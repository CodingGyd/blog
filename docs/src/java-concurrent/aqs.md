---
# icon: lock
date: 2023-08-02

category:
  - JAVA
tag:
  - 并发编程
---

# AQS基础知识

<font color="red">AQS，你学废了吗？ 没学废请耐心往下看>>></font>

## 一、简介  
AbstractQueuedSynchronizer(简称AQS)是JAVA中一套实现锁机制的底层框架，Java中著名的JUC包的核心就是AQS框架。

AQS框架内部维护一个FIFO类型的Node队列来控制多线程的竞争排队顺序，使用一个int类型的state变量来定义当前共享资源占用的状态，定义了若干同步状态获取和释放的方法来供开发者使用，开发者只需要继承AbstractQueuedSynchronizer类，然后实现其中的指定模板方法，就可以快速实现一套线程同步控制组件。

AQS框架还定义了condition结构来提供线程的wait/signal(等待和唤醒)机制，同时根据资源互斥级别提供了独占锁/共享锁两种锁控制方式。

经典的AQS实现有ReentrantLock、ReentrantReadWriteLock 、CountDownLatch等，这些实现面向的是锁的使用者，而AQS本身是面向锁的实现者(开发者)。

## 二、原理
不要深入源码细节，从顶层看看AQS的设计，会发现其实并不复杂。  

AQS框架内部维护一个volatile int类型的state变量和一个CLH(三个人名的缩写)双向队列的头尾指针head和tail，队列中的每个节点都封装了某个等待线程的各种信息(引用、当前状态等),每个节点均可通过getState()、setState()和compareAndSetState()对state变量进行修改和访问。·
```java
/**
 * @since 1.5
 * @author juc包作者，并发大师Doug Lea
 */
public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    /**
     * 同步队列头指针
     */
    private transient volatile Node head;

    /**
     * 同步队列尾指针
     */
    private transient volatile Node tail;

    /**
     * 锁状态
     */
    private volatile int state;
    /**
     * 当前占用锁的线程
     */
    private transient Thread exclusiveOwnerThread;

    //若干同步状态获取和释放的方法
    //略...
}
```

多线程并发时，某个线程尝试修改state变量成功则表示该线程获取锁成功，否则将自身信息封装为Node节点并通过尾插法挂载到CLH队列尾部，并等待持有锁的线程释放锁,最后唤醒队列中的Node节点。
::: warning 注意
深入源码会发现，在CLH队列中只有当前节点的前一个节点是头节点时，当前节点线程才会尝试去获取锁，否则一直自旋等待。
```
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```
:::

## 三、模板方法一览表
AQS框架定义了实现独占/共享锁的标准方法，实现者一般只需要重写模板方法实现具体逻辑即可，五个重要的模板方法如下：
<table>
    <tr>
      <th>模板方法名称</th>
      <th>描述</th>
    </tr>
    <tr>
      <td>protected boolean tryAcquire(int arg)</td>
      <td><font color="red">独占锁</font> 独占方式获取同步状态，实现该方法需要查询当前状态并判断同步状态是否符合预期，然后再进行CAS设置同步状态</td>
    </tr>
    <tr>
      <td>protected boolean tryRelease(int arg)</td>
      <td><font color="red">独占锁</font> 独占方式释放同步状态，在队列中阻塞等待获取同步状态的线程此时将有机会获取同步状态</td>
    </tr>
    <tr>
      <td>protected int tryAcquireShared(int arg)</td>
      <td><font color="red">共享锁</font> 共享方式获取同步状态，返回大于等于0的值，表示获取成功，否则获取失败</td>
    </tr>
   <tr>
      <td>protected boolean tryReleaseShared(int arg)</td>
      <td><font color="red">共享锁</font> 共享方式释放同步状态</td>
    </tr>
     <tr>
      <td>protected boolean isHeldExclusively()</td>
      <td>当前同步器是否在独占模式下被线程占用，一般该方法表示是否被当前线程独占</td>
    </tr>
</table>

如果你想实现一个独占锁组件，只需要重写tryAcquire和tryRelease方法即可，如果是实现一个共享锁组件，则只需要重写tryAcquireShared和tryReleaseShared。

下面是一个同步锁实现的例子：
```java

public class AqsDemo1 extends AbstractQueuedSynchronizer {
    @Override
    protected boolean tryAcquire(int arg) {
        return compareAndSetState(0, 1);
    }

    @Override
    protected boolean tryRelease(int arg) {
        return compareAndSetState(1, 0);
    }

    public static void main(String[] args) throws InterruptedException {
        final AqsDemo1 lock = new AqsDemo1();

        new Thread(() -> {
            System.out.println("thread1 acquire lock");
            lock.acquire(1);
            // 获取资源后sleep保持
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch(InterruptedException ignore) {

            }
            lock.release(1);
            System.out.println("thread1 release lock");
        }).start();

        new Thread(() -> {
            // 保证线程2在线程1启动后执行
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch(InterruptedException ignore) {

            }
            // 等待线程1 sleep结束释放资源
            lock.acquire(1);
            System.out.println("thread2 acquire lock");
            lock.release(1);
        }).start();
        
    }
}

```
示例代码通过继承AQS框架实现了一个简单的多线程资源竞争操作，线程1获取lock后，线程2的acquire陷入阻塞，直到线程1释放。
其中的tryAcquire/acquire/tryRelease/release的arg参数可按实现逻辑自定义传入值，

## 四、CLH队列结构
AQS底层是通过一个先进先出(FIFO)的CLH同步队列来对所有等待线程进行管理，当某个请求线程申请锁失败时，同步器则将该线程信息封装为一个Node节点并通过尾插法放入队列中，同时会阻塞当前请求线程。当锁被释放时，同步队列中的首节点对应的线程会被唤醒，同时会自旋尝试获取锁。  

同步队列中的节点（Node）用来保存获取同步状态失败的等待线程的引用、等待状态以及前驱和后继节点，同步器本身会保存同步队列的头指针和尾指针。 

Node对象的结构定义如下：
```java
static final class Node {
     
    /** waitStatus表示当前Node节点状态，该状态总共有五种 */
    //static final int CANCELLED =  1;节点引用线程由于等待超时或被打断时的状态。
    //static final int SIGNAL    = -1;后继节点线程需要被唤醒时的当前节点状态。当队列中加入后继节点被挂起(block)时，其前驱节点会被设置为SIGNAL状态，表示该节点需要被唤醒。
    //static final int CONDITION = -2;当节点线程进入condition队列时的状态。(见ConditionObject)
    //static final int PROPAGATE = -3;//仅在释放共享锁releaseShared时对头节点使用。(见共享锁分析)
    //默认值0：节点初始化时的状态。
    volatile int waitStatus;

    //当前节点的前驱节点引用
    volatile Node prev;

     //当前节点的后继节点引用
    volatile Node next;
    //当前节点引用线程，头节点不包含线程。
    volatile Thread thread;
    //condition条件队列。(见ConditionObject)
    Node nextWaiter;
}
```


AQS设置首节点无需CAS操作保证线程安全，是通过获取同步状态成功的线程来完成的，当首节点的线程能够成功获取到同步状态，则会把同步器的首节点指向当前首节点的后继节点（由于只会有一个线程能获取到同步状态，这里无需cas操作），并断开原来首节点的next引用。原先的首节点线程由于已经获取到了同步状态，则从队列出栈去执行完成自己的业务逻辑即可。 

<img src="http://cdn.gydblog.com/images/java/concurrent/aqs-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

AQS设置尾节点需要通过CAS操作来保证线程安全， 当一个线程成功地获取了锁，其他的线程将无法获取到锁，会被构造成为Node节点并加入到同步队列中。由于此时可能有多个线程都没有抢到锁，都需要加入队列中，这种情况需要保证线程安全，因此同步器提供了一个基于 CAS 的设置尾节点的方法：compareAndSetTail(Node expect,Node update)，它需要传递当前线程“认为”的尾节点和当前节点，只有设置成功后，当前节点才正式与之前的尾节点建立关联。


## 五、独占锁实现原理
**1）独占锁的获取**

我们先看看AbstractQueuedSynchronizer类的acquire方法源码：
```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

示例代码中主要做的事情是：先尝试一次性获取锁，如果成功则返回，否则将线程加入CLH等待队列，重复尝试获取锁，直到成功。  

详细的流程是：
- 1）先调用tryAcquire方法尝试用线程安全的方式去获取锁(这里具体实现需要子类去覆盖实现其中的逻辑);

- 2）如果tryAcquire获取锁成功，则正常退出执行，下面的步骤跳过;

- 3）如果tryAcquire获取锁失败，则调用addWaiter方法构建CLH队列的Node节点(独占锁：EXCLUSIVE独占类型的Node，包含当前线程的信息)，并通过自旋CAS的方式将Node追加到CLH同步队列的尾部(尾插法)，同时修改同步器指向同步队列的尾指针为当前新加入的Node节点;

- 4）接下来调用acquireQueued方法通过自旋(死循环)的方式尝试获取锁，如果获取不到则阻塞当前线程，直到被唤醒后继续尝试获取锁的动作，这里的被唤醒需要依赖前驱节点抢到锁并出队列或者阻塞线程被响应中断来实现。  


总结一下独占锁的获取流程：
<img src="http://cdn.gydblog.com/images/java/concurrent/aqs-3.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

**2）独占锁的释放**  
我们先看看AbstractQueuedSynchronizer类的release方法源码：
```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```
示例代码中主要做的事情：尝试释放独占模式的锁，如果失败直接返回false，如果成功则从头节点开始唤醒后继节点。  

唤醒后继节点的逻辑主要在unparkSuccessor方法中，源码如下：
```java
private void unparkSuccessor(Node node) {
    /*
     * If status is negative (i.e., possibly needing signal) try
     * to clear in anticipation of signalling.  It is OK if this
     * fails or if status is changed by waiting thread.
     */
    int ws = node.waitStatus;
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);

    //在park操作中，线程会被阻塞，直到有其他线程调用unpark方法将其唤醒。如果当前线程被取消或者被认为是null，那么会遍历链表，找到第一个非取消的线程作为下一个唤醒的线程
    Node s = node.next;
    if (s == null || s.waitStatus > 0) {
        s = null;
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)
        LockSupport.unpark(s.thread);
}
```
在上述源码中，如后继节点被取消，则转为从CLH队列的尾部开始找最近的阻塞的节点将其唤醒。阻塞节点被唤醒后，即进入acquireQueued中的for(;;)循环开始新一轮的资源竞争。

unparkSuccessor方法中调用 LockSupport.unpark后，acquireQueued方法中对应阻塞的线程会被唤醒， 这里涉及到LockSupport的park和unpark等待唤醒机制的前后呼应。

那么线程又是在何时被阻塞的呢？ 我们回头看看获取锁tryAcquire方法中调用的acquireQueued方法：
```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())//这里对应线程的阻塞！！！
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```
```java
private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);//这是核心了
    return Thread.interrupted();
}
```

最后串联一下上面的代码说明线程被阻塞和被唤醒的时机：   
- 在获取锁失败时 acquireQueued方法中的子方法parkAndCheckInterrupt内调用了LockSupport.park(this)对某个线程进行了阻塞，
- 在释放锁的方法release内的子方法unparkSuccessor里调用LockSupport.unpark(node.thread)对CLH队列中的某个node对应的线程进行了唤醒，


## 六、共享锁实现原理  
> 共享锁与独占锁整体流程类似，最主要的区别在于同一时刻能否有多个线程同时获取到锁。

**1）共享锁的获取** 

acquireShared方法中先是调用模板方法tryAcquireShared尝试自旋方式获取锁，tryAcquireShared()方法返回值为 int 类型，当返回值大于等于 0 时，表示能够获取到同步状态。

acquireShared 源码：  
```java
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)
        doAcquireShared(arg);
}
```

tryAcquireShared返回值>=0时，调用doAccquireShared方法，源码如下： 

```java
private void doAcquireShared(int arg) {
    final Node node = addWaiter(Node.SHARED);
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head) {
                int r = tryAcquireShared(arg);
                if (r >= 0) {
                    setHeadAndPropagate(node, r);
                    p.next = null; // help GC
                    if (interrupted)
                        selfInterrupt();
                    failed = false;
                    return;
                }
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```
tryAcquireShared获取失败后将当前线程信息封装为Node以共享方式Node.SHARED插入到队尾阻塞，直到队头节点将其唤醒。
在doAcquireShared与独占锁不同的是，由于共享锁是可以被多个线程获取的，因此在首个阻塞节点被唤醒后，会通过setHeadAndPropagate传递唤醒后续的阻塞节点。

**2）共享锁的释放**
releaseShared 源码：
```java
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {
        doReleaseShared();
        return true;
    }
    return false;
}
```

该方法在tryReleaseShared释放锁成功后，将会调用doReleaseShared方法使用LockSupport.unpark方式唤醒在同步队列中后续处于等待状态的Node节点。 

## 七、AQS经典实现

AQS其实是一种思想原则，JAVA官方的应用方式是在自定义同步组件中实现一个AQS同步器的子类，该子类是作为自定义同步组件的静态内部类。

常见的自定义同步组件有ReentrantLock、ReentrantReadWriteLock 、CountDownLatch等。

查看自定义同步组件源码可以看出这些自定义同步组件中都有一个继承AQS类的静态内部类Sync。

- ReentrantReadLock重写了框架的tryAcquire/tryRelease方法，支持独占锁，自定义实现了公平锁FairSync和非公平锁NonfairSync两大同步组件，源码如下：
```java
public class ReentrantLock implements Lock, Serializable{
    abstract static class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写，这里重写了独占锁的相关锁操作方法
        protected final boolean tryRelease(int releases) {}
        //略。。。
    }
    //非公平锁
    static final class NonfairSync extends Sync {
        protected final boolean tryAcquire(int acquires) {}
        //略...
    }
    //公平锁
    static final class FairSync extends Sync {
        protected final boolean tryAcquire(int acquires) {}
        //略...
    }
    //其它代码略...
}
```


- ReentrantReadWriteLock重写了框架的tryAcquire/tryRelease、tryAcquireShared/tryReleaseShared方法，同时支持独占锁和共享锁方式，自定义实现了公平锁FairSync和非公平锁NonfairSync两大同步组件，源码如下：
```java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写，这里重写了独占锁和共享锁的相关锁操作方法
        protected final boolean tryRelease(int releases) {}

        protected final boolean tryAcquire(int acquires) {}

        protected final boolean tryReleaseShared(int unused) {}

        protected final int tryAcquireShared(int unused) {}
        //略。。。
    }
    //非公平锁
    static final class NonfairSync extends Sync {
        //略...
    }
    //公平锁
    static final class FairSync extends Sync {
        //略...
    }
    //其它代码略...
}
```


- CountDownLatch是共享锁的实现，重写了框架的tryAcquireShared和tryReleaseShared方法，源码如下：
```java
public class CountDownLatch {
    private static final class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写
        private static final class Sync extends AbstractQueuedSynchronizer {
            private static final long serialVersionUID = 4982264981922014374L;
    
            Sync(int count) {
                setState(count);
            }
    
            int getCount() {
                return getState();
            }
    
            protected int tryAcquireShared(int acquires) {
                return (getState() == 0) ? 1 : -1;
            }
    
            protected boolean tryReleaseShared(int releases) {
                // Decrement count; signal when transition to zero
                for (;;) {
                    int c = getState();
                    if (c == 0)
                        return false;
                    int nextc = c-1;
                    if (compareAndSetState(c, nextc))
                        return nextc == 0;
                }
            }
        }
        //略。。。
    }
    //其它代码略...
}
```

AQS框架的设计是基于模板方法模式的，正因为如此，上面的实现者都是继承框架类并重写了指定的方法，随后将同步器组合在自定义同步组件的实现中，并调用框架提供的模板方法，而这些模板方法将会调用实现者重写的方法。重写框架指定的方法时，需要调用框架提供的如下3 个方法来访问或修改同步状态：
```java
- getState()：获取当前同步状态。

- setState(int newState)：设置当前同步状态。

- compareAndSetState(int expect,int update)：使用 CAS 设置当前状态，该方法能够保证状态设置的原子性。
```

上面三个方法在AbstractQueuedSynchronizer框架类中是final类型的，也就是说不能被子类重写，只能被子类调用，这三个方法封装了底层与操作系统交互的细节，能够保证原子操作。  

静态内部类Sync作为一个衔接，衔接线程访问以及同步状态控制等底层核心技术与不同并发应用组件(如ReentrantLock、CountDownLatch、ReadWriteLock等)一起完成获取锁和释放锁的业务动作。 

## 八、参考资料
[Java并发之AQS详解](https://juejin.cn/post/7006895386103119908 "Java并发之AQS详解")  


 