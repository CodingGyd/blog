---
# icon: lock
date: 2023-06-26

category:
  - Java核心
tag:
  - AQS基础知识
---

# AQS基础知识
## 01、简介  
AQS(全称AbstractQueuedSynchronizer，中文是抽象队列同步器)是java锁的基石。 java中的锁底层都是继承AbstractQueuedSynchronizer来做具体实现的。


## 02、内置的自定义同步组件
AQS同步器使用一个int类型的state变量来定义当前同步的状态，使用一个Thread类型的变量来定义当前占用锁的线程信息，使用一个FIFO类型的队列来控制多线程的竞争排队顺序。其内部仅仅是定义了若干同步状态获取和释放的方法来供自定义同步组件使用。
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

AQS其实是一种思想原则，通常的方式是在自定义同步组件中实现一个AQS同步器的子类，该子类是作为自定义同步组件的静态内部类。

常见的自定义同步组件有ReentrantLock、ReentrantReadWriteLock 、CountDownLatch等。

查看自定义同步组件源码可以看出这些自定义同步组件中都有一个继承AQS类的静态内部类：

ReentrantLock源码：
```java
public class ReentrantLock implements Lock, Serializable{
    abstract static class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写
        //略。。。
    }
    //其它代码略...
}
```

ReentrantReadWriteLock源码：
```java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写
        //略。。。
    }
    //其它代码略...
}
```


CountDownLatch源码：
```java
public class CountDownLatch {
    private static final class Sync extends AbstractQueuedSynchronizer {
        //对AQS模板中的同步状态获取和释放的相关方法进行重写
        //略。。。
    }
    //其它代码略...
}
```

AQS同步器的设计是基于模板方法模式的，也就是说，使用者需要继承同步器并重写指定的方法，随后将同步器组合在自定义同步组件的实现中，并调用同步器提供的模板方法，而这些模板方法将会调用使用者重写的方法。重写同步器指定的方法时，需要调用同步器提供的如下3 个方法来访问或修改同步状态。

- getState()：获取当前同步状态。

- setState(int newState)：设置当前同步状态。

- compareAndSetState(int expect,int update)：使用 CAS 设置当前状态，该方法能够保证状态设置的原子性。

上面三个方法在同步器基类中是final类型的，也就是说不能被子类重写，只能被子类调用，这三个方法封装了底层与操作系统交互的细节，能够保证原子操作。

自定义一个同步组件必须重写同步器基类中的下列五个方法：
<table>
  <tr>
    <th>方法名称</th>
    <th>描述</th>
  </tr>
  <tr>
    <td>protected boolean tryAcquire(int arg)</td>
    <td>独占方式获取同步状态，实现该方法需要查询当前状态并判断同步状态是否符合预期，然后再进行CAS设置同步状态</td>
  </tr>
  <tr>
    <td>protected boolean tryRelease(int arg)</td>
    <td>独占方式释放同步状态，在队列中阻塞等待获取同步状态的线程此时将有机会获取同步状态</td>
  </tr>
  <tr>
    <td>protected int tryAcquireShared(int arg)</td>
    <td>共享方式获取同步状态，返回大于等于0的值，表示获取成功，否则获取失败</td>
  </tr>
 <tr>
    <td>protected boolean tryReleaseShared(int arg)</td>
    <td>共享方式释放同步状态</td>
  </tr>
   <tr>
    <td>protected boolean isHeldExclusively()</td>
    <td>当前同步器是否在独占模式下被线程占用，一般该方法表示是否被当前线程独占</td>
  </tr>
</table>


## 03、底层分析

底层核心的三个方面是同步队列、独占锁、共享锁。

### 同步队列

AQS底层是通过一个先进先出(FIFO)的同步队列来对等待线程进行管理，当线程申请锁失败时，同步器则将申请线程信息封装为一个Node节点放入队列中，同时会阻塞当前申请线程。当锁被释放时，同步队列中的首节点对应的线程会被唤醒，同时会自旋尝试获取锁。  

同步队列中的节点（Node）用来保存获取同步状态失败的等待线程的引用、等待状态以及前驱和后继节点，同步器本身会保存同步队列的头指针和尾指针。

同步器中的队列属性源码片段：
```java

    /**
     *同步队列的头指针
     */
    private transient volatile Node head;

    /**
     *同步队列的尾指针
     */
    private transient volatile Node tail;

    /**
     *当前同步状态
     */
    private volatile int state;
}
```

同步队列的结构大致如下：
<img src="http://cdn.gydblog.com/images/java/concurrent/aqs-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

同步器设置首节点无需CAS操作保证线程安全：  

是通过获取同步状态成功的线程来完成的，当首节点的线程能够成功获取到同步状态，则会把同步器的首节点指向当前首节点的后继节点（由于只会有一个线程能获取到同步状态，这里无需cas操作），并断开原来首节点的next引用。原先的首节点线程由于已经获取到了同步状态，则从队列出栈去执行完成自己的业务逻辑即可。 
<img src="http://cdn.gydblog.com/images/java/concurrent/aqs-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

同步器设置尾节点需要通过CAS操作来保证线程安全：  

当一个线程成功地获取了锁，其他的线程将无法获取到锁，会被构造成为Node节点并加入到同步队列中。由于此时可能有多个线程都没有抢到锁，都需要加入队列中，这种情况需要保证线程安全，因此同步器提供了一个基于 CAS 的设置尾节点的方法：compareAndSetTail(Node expect,Node update)，它需要传递当前线程“认为”的尾节点和当前节点，只有设置成功后，当前节点才正式与之前的尾节点建立关联。


### 独占锁的获取与释放  

**独占锁的获取**  
```
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```
上面代码主要完成同步锁获取、同步队列Node节点构造、加入同步队列以及在同步队列中自旋等待的相关工作。

主要的流程是：tryAcquire方法中先尝试用线程安全的方式去获取锁(需要子类去覆盖实现其中的逻辑)，如果锁获取失败，则先在addWaiter方法中构建Node节点(EXCLUSIVE独占类型的Node，包含当前线程的信息)，并通过自旋cas的方式将Node追加到同步队列的尾部，同时修改同步器指向同步队列的尾指针为当前新加入的Node节点。 接下来在acquireQueued方法中通过自旋(死循环)的方式尝试获取锁，如果获取不到则阻塞当前线程，直到被唤醒后继续尝试获取锁的动作。 这里的被唤醒需要依赖前驱节点抢到锁并出队列或者阻塞线程被响应中断来实现。  

下面是涉及到的几个核心方法的源代码(JDK1.8):

ReentrantLock中对tryAcquire模板方法的实现：
```java
        protected final boolean tryAcquire(int acquires) {
           final Thread current = Thread.currentThread();
          int c = getState();
            if (c == 0) {
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
```

addWaiter()：
```java
       private Node addWaiter(Node mode) {
        Node node = new Node(Thread.currentThread(), mode);
        // Try the fast path of enq; backup to full enq on failure
        Node pred = tail;
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {
                pred.next = node;
                return node;
            }
        }
        enq(node);
        return node;
    }
```

acquireQueued(): 
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
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```
下面是基本的独占锁获取流程：  
<img src="http://cdn.gydblog.com/images/java/concurrent/aqs-3.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


**独占锁的释放**  
独占锁的释放入口是AQS基类中的release方法：
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

release里会唤醒同步队列当前头节点的后继节点线程，unparkSuccessor()方法使用 LockSupport.unpark来唤醒处于等待状态的线程。  

release在唤醒后继节点线程之前先调用模板方法tryRelease做具体锁释放的逻辑，而tryRelease需要由具体的自定义同步组件去实现具体逻辑。  

下面是ReentrantLock中针对tryRelease的实现逻辑：
```java
    protected final boolean tryRelease(int releases) {
            int c = getState() - releases;
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();
            boolean free = false;
            if (c == 0) {
                free = true;
                setExclusiveOwnerThread(null);
            }
            setState(c);
            return free;
        }
```
ReentrantLock同步组件的tryRelease里主要做了这几件事：判断当前占用锁的线程和当前调用线程是否是同一个，若不是直接抛出锁状态异常，若是则设置当前占用锁的线程对象为null，并将锁的状态复位为未占用的状态(此时队列中下一个阻塞线程就可以有机会获得锁资源了)，最后返回释放成功的标志。
 


### 共享锁的获取与释放

**共享锁的获取**  
共享锁获取与独占锁获取最主要的区别在于同一时刻能否有多个线程同时获取到锁。

AQS基类中acquireShared()定义了共享锁的获取逻辑：
```java
    public final void acquireShared(int arg) {
        if (tryAcquireShared(arg) < 0)
            doAcquireShared(arg);
    }
```
acquireShared方法中先是调用模板方法tryAcquireShared尝试自旋方式获取锁，tryAcquireShared()方法返回值为 int 类型，当返回值大于等于 0 时，表示能够获取到同步状态。

tryAcquireShared也是需要由自定义同步组件自己去实现具体逻辑，下面是ReentrantLock中的一种实现：
```java
       protected int tryAcquireShared(int acquires) {
            for (;;) {
                if (hasQueuedPredecessors())
                    return -1;
                int available = getState();
                int remaining = available - acquires;
                if (remaining < 0 ||
                    compareAndSetState(available, remaining))
                    return remaining;
            }
        }
```
从上面源码可以看出，tryAcquireShared中也是尝试自旋的方式获取锁，当成功获取到锁时就会退出自旋。

tryAcquireShared返回值>=0时，调用doAccquireShared方法： 
```java
private void doAcquireShared(int arg) {
 final Node node = addWaiter(Node.SHARED);
 boolean failed = true;
 try {
    boolean interrupted = false;
    for (; ; ) {
    final Node p = node.predecessor();
    if (p == head) {
    int r = tryAcquireShared(arg);
    if (r >= 0) {
    setHeadAndPropagate(node, r);
    p.next = null;
    if (interrupted) selfInterrupt();
    failed = false;
    return;
}
 }
 if (shouldParkAfterFailedAcquire(p, node) && parkAndCheckInterrupt()) 
    interrupted = true;
 }
 } finally {
    if (failed) cancelAcquire(node);
 }
}
```

上面doAcquireShared(int arg)方法的自旋过程中，如果当前节点的前驱predecessor为头节点时，尝试获取锁，如果返回值大于等于 0，表示该次获取同步状态成功并从自旋过程中退出。  


**共享锁的释放**  
共享锁的释放逻辑入口是releaseShared():
```java
    public final boolean releaseShared(int arg) {
        if (tryReleaseShared(arg)) {
            doReleaseShared();
            return true;
        }
        return false;
    }
```

该方法在释放锁成功后，将会使用LockSupport.unpark方式唤醒在同步队列中后续处于等待状态的Node节点。 



## 04、基于AQS实现一个自定义同步组件  
AQS已经给我们定义好了底层的模板，只需要写一个静态内部类，继承AbstractQueuedSynchronizer实现其中获取锁tryAcquireShared和释放锁的tryReleaseShared方法即可。
```java

public class MyAqsLockDemo implements Lock {

    private final MySync sync = new MySync(3);
    private static final class MySync extends {
        MySync(int count) {
            if (count <= 0) {
                throw new IllegalArgumentException("count must large than zero.");
            }
            setState(count);
        }
        public int tryAcquireShared(int reduceCount) {
            for (; ; ) {
                int current = getState();
                int newCount = current - reduceCount;
                if (newCount < 0 || compareAndSetState(current, newCount)) {
                    return newCount;
                }
            }
        }
        public boolean tryReleaseShared(int returnCount) {
            for (; ; ) {
                int current = getState();
                int newCount = current + returnCount;
                if (compareAndSetState(current, newCount)) {
                    return true;
                }
            }
        }
    }


    @Override
    public void lock() {
        sync.acquireShared(1);
    }

    @Override
    public void unlock() {
        sync.releaseShared(1);
    }

    @Override
    public void lockInterruptibly() throws InterruptedException {

    }

    @Override
    public boolean tryLock() {
        return false;
    }

    @Override
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
        return false;
    }

    @Override
    public Condition newCondition() {
        return null;
    }

    public static void main(String[] args) throws InterruptedException {
        final Lock lock = new MyAqsLockDemo();
        // 启动 20 个用户线程
        for (int i = 0; i < 20; i++) {
            UserThread w = new UserThread(lock);
            w.setDaemon(true);
            w.start();
        }

        // 每隔 1 秒换行
        for (int i = 0; i < 20; i++) {
            TimeUnit.SECONDS.sleep(1);
            System.out.println();
        }

    }

    static class UserThread extends Thread {
        Lock myLock = null;
        UserThread(Lock lock) {myLock = lock;}

        public void run() {
            while (true) {
                myLock.lock();
                try {
                    TimeUnit.SECONDS.sleep(1);
                    System.out.println(Thread.currentThread().getName());
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    myLock.unlock();
                }
            }
        }
    }
}
```
上面实现的自定义同步器实现了 Lock 接口，内部实现了一个自定义同步器 MySync，同时提供了面向使用者的方法lock、unLock等。使用者调用 lock() 方法获取锁，随后调用 unlock()方法释放锁， lock方法和unlock方法底层分别是调用自定义同步组件MySync的acquireShared和releaseShared，而这两个方法就是AQS中的顶层设计预先实现好的方法，AQS会回调MySync中实现的获取锁tryAcquireShared和释放锁tryReleaseShared的方法。    

自定义同步器MySync作为一个衔接，衔接线程访问以及同步状态控制等底层核心技术与不同并发应用组件(如ReentrantLock、CountDownLatch、ReadWriteLock等)一起完成获取锁和释放锁的业务动作。  