---
# icon: lock
date: 2023-06-26

category:
  - JAVA基础
tag:
  - 锁
---
# 锁的那些事
## 一、前言
多线程访问情况有三种: 

- 只有一个线程来访问
- 有多个线程来访问(2个线程交替访问)
- 并发量高，竞争激烈，多个线程来访问

多线程访问会涉及到线程安全问题，而锁可以用来解决这种并发访问导致的问题。

## 二、锁的常见分类
<img src="http://cdn.gydblog.com/images/java/concurrent/lock-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 三、乐观锁和悲观锁

### 1、乐观锁 
乐观锁是指认为自己在使用数据时不会有别的线程来修改数据，所以不会添加锁。
在JAVA中是通过无锁编程来实现，只是在最后更新数据的时候才去判断之前有没有别的线程更新了这个数据，此时会出现两种判断：
- 如果这个数据没有被别的线程更新，则当前线程将自己修改的数据写入。
- 如果这个数据已经被别的线程更新，则当前线程可以选择放弃修改或者重新获取最新数据进行重新修改。

判断的规则常用如下方式：
- version版本号机制
- cas算法(java中atomic包中的递增操作就算通过CAS自旋实现的)


乐观锁适合读操作多的场景，不加锁能大大提高并发性能。

### 2、悲观锁

悲观锁认为自己使用数据时肯定会有别的线程也来竞争操作，在使用之前先加锁，确保数据不会被别的线程修改。  

在java中synchronized关键字和lock的api原理都是悲观锁。  

悲观锁适合写操作多的场景，性能相对乐观锁要差。

**synchronized**  
synchronized可以用于修饰实例方法、静态方法、代码块。当一个线程试图访问同步代码时必须首先获得锁，正常退出或者抛出异常时必须释放锁。  
[synchronized笔记](./synchronized.md)
 
这里提一下阿里开发手册中的几个用锁原则：  
- 尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用rpc方法或者耗时的io操作。
- 能锁代码块，就不要锁整个方法体；能用对象锁，就不要用类锁。


## 四、公平锁和非公平锁

公平锁：多个线程按照申请锁的顺序来获取锁，先来先得，类似排队打饭机制，这是公平的
```java
    ReentrantLock lock = new ReentrantLock(true);
```

非公平锁：是指多个线程获取锁的顺序不一定是按照提出申请时的顺序，可能后来的比先来的要先获得锁资源。尤其是在我们的高并发环境下这种非公平锁有可能会导致旱的旱死涝的涝死(某些线程一直得不到锁)
```java
    ReentrantLock lock = new ReentrantLock(false);
    ReentrantLock lock = new ReentrantLock();//默认非公平锁
```

非公平锁更能充分的利用CPU的时间片，尽量减少CPU空闲状态时间，能提高吞吐量。 因此ReentrantLock默认是非公平锁。  

在实际业务场景中，如果为了顶住更高的吞吐量，那么非公平锁是更合适的，因为节省了很多线程切换的时间，吞吐量也就自然而然的上去了；
如果不追求吞吐量，那就用公平锁，大家一视同仁。


具体demo：
```java
package com.gyd;

import java.util.concurrent.locks.ReentrantLock;

//资源类，模拟30元钱
class Money {
    private int number = 30;

    ReentrantLock lock = new ReentrantLock(true);//公平锁
    //ReentrantLock lock = new ReentrantLock();//非公平锁

    public void get(){
        lock.lock();

        try {
            if (number>0) {
                number--;
                System.out.println(Thread.currentThread().getName()+" 获得1元,当前还剩"+number+"元");
            }
        }finally {
            lock.unlock();
        }
    }
}
public class LockDemo6 {

    public static void main(String[] args) {
        Money money = new Money();
        //模拟3个人分30块钱
        new Thread(()->{for (int i=0;i<50;i++) {money.get();}},"a").start();
        new Thread(()->{for (int i=0;i<50;i++) {money.get();}},"b").start();
        new Thread(()->{for (int i=0;i<50;i++) {money.get();}},"c").start();
    }
}

```


## 五、可重入锁(递归锁)

可重入锁是指同一个线程在外层方法获取到锁，在进入同一线程的内层方法或代码块时会自动获取锁，不会因为之前已经获取过锁还没有释放而阻塞等待。(外层和内层的锁对象需要是同一个对象)
java中ReentranLock和Synchronized都是可重入锁，可重入锁的优点是能够在一定程度避免死锁的发生。


### 1、可重入锁分类
- 隐式锁  
  synchronized关键字使用的锁，默认是可重入锁；
  
  同步代码块可重入锁示例：
  ```java
    public static void main(String[] args){
        Object object = new Object();
        new Thread(()->{
            //隐式可重入锁示例-同步代码块
            synchronized (object) {
                System.out.println(Thread.currentThread().getName()+"外层调用");
                synchronized (object) {
                    System.out.println(Thread.currentThread().getName()+"内层调用");
                }
            }
        }).start();
    }
  ```

    
  同步方法可重入锁示例：
  ```java
     public class LockDemo7 {

        public static void main(String[] args){
            LockDemo7 lockDemo7 = new LockDemo7();
            new Thread(()->{
                //隐式可重入锁示例-同步方法
                lockDemo7.m1();
            }).start();
        }

        public synchronized void m1() {
            System.out.println(Thread.currentThread().getName()+" come in");
            m2();
            System.out.println(Thread.currentThread().getName()+"end m1");
        }
        public synchronized void m2() {
            System.out.println(Thread.currentThread().getName()+" come in");
        }
    }
  ```
- 显式锁  
  Lock，ReentranctLock就是显示定义的可重入锁，主动上了几次锁就得主动释放几次锁
    ```java
        package com.gyd;

        import java.util.concurrent.locks.ReentrantLock;

        public class LockDemo8 {

            static ReentrantLock lock = new ReentrantLock();
            public static void main(String[] args){
                new Thread(()->{
                    //可重入锁示例-同步方法
                    lock.lock();
                    try{
                        System.out.println(Thread.currentThread().getName()+" 外层调用");
                        lock.lock();
                        try {
                            System.out.println(Thread.currentThread().getName()+" 内层调用");
                        }finally {
                            lock.unlock();
                        }
                    }finally {
                        lock.unlock();
                    }

                }).start();
            }

        }

    ```


### 2、可重入锁原理分析
以ReentrantLock中的非公平锁实现为例，看下jdk是如何实现可重入的。
```java
```

核心是底层的objectMonitor锁对象。每个锁对象都拥有一个锁计数器和一个指向持有该锁的线程的指针。 

当执行monitorenter指令时，如果目标锁对象的计数器为零，那么说明它没有被其它线程持有，jvm会将该锁对象的持有线程设置为当前线程，并且将其计数器加1；  

当目标锁对象的计数器不为零时，如果锁对象的持有线程就是当前线程，那么jvm将锁对象的计数器加1，就相当于再次获取了锁，否则当前线程阻塞等待，直至持有锁的线程释放锁。  

当执行monitorexit指令时，jvm会将锁对象的计数器减1，计数器值为0时代表锁已被释放。


## 六、死锁

应用中多个线程需要以独占的方式访问同一个资源，当多个线程去并发访问资源时同一个时间段只能有一个线程占用该资源，另一个线程只能阻塞等待，如果两个线程永远都在等待对方释放独占的资源，则都会永远阻塞不能执行，两败俱伤了，这种现象就叫死锁。

**死锁示例**
```java
package com.gyd;

public class DeadLockDemo {
    private static String A = "A";
    private static String B = "B";

    private void deadLockTest() {
        Thread t1 = new Thread(() -> {
            synchronized (A) {
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (B){
                    System.out.println("1");
                }
            }
        });
        Thread t2 = new Thread(() -> {
            synchronized (B) {
                synchronized (A){
                    System.out.println("2");
                }
            }
        });
        t1.start();
        t2.start();
    }
    public static void main(String[] args) {
        new DeadLockDemo().deadLockTest();
    }
}

```
实际我们一般不会写出逻辑如此简单的死锁，上面只是演示一下死锁现象是如何产生。生产环境需要分析线程堆栈情况才能发现死锁现象

**死锁排查**  

我们来按下面步骤分析上面的死锁示例程序。

1.先运行DeadLockDemo.java

2.在控制台执行jps命令：
```java
PS D:\code\demo\target\classes\com\gyd> jps -l
22256 org.jetbrains.jps.cmdline.Launcher
9296 
25812 sun.tools.jps.Jps
9320 org.jetbrains.idea.maven.server.RemoteMavenServer36
9704 com.gyd.DeadLockDemo
```
可以得到DeadLockDemo程序的进程编号是9704

3.在控制台执行"jstack 进程编号"命令：
```java
PS D:\code\demo\target\classes\com\gyd> jstack 9704
2023-07-05 21:44:18
Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.371-b11 mixed mode):

"DestroyJavaVM" #22 prio=5 os_prio=0 tid=0x000002e40459e800 nid=0x3a04 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Thread-1" #21 prio=5 os_prio=0 tid=0x000002e422bd3800 nid=0x3d04 waiting for monitor entry [0x000000ed540ff000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at com.gyd.DeadLockDemo.lambda$deadLockTest$1(DeadLockDemo.java:30)
        - waiting to lock <0x000000076c41f2a0> (a java.lang.String)
        - locked <0x000000076c41f2d0> (a java.lang.String)
        at com.gyd.DeadLockDemo$$Lambda$2/1747585824.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:750)

"Thread-0" #20 prio=5 os_prio=0 tid=0x000002e422bd2800 nid=0x2860 waiting for monitor entry [0x000000ed53fff000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at com.gyd.DeadLockDemo.lambda$deadLockTest$0(DeadLockDemo.java:23)
        - waiting to lock <0x000000076c41f2d0> (a java.lang.String)
        - locked <0x000000076c41f2a0> (a java.lang.String)
        at com.gyd.DeadLockDemo$$Lambda$1/1096979270.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:750)

"Service Thread" #19 daemon prio=9 os_prio=0 tid=0x000002e421572000 nid=0x37b0 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread11" #18 daemon prio=9 os_prio=2 tid=0x000002e42149f800 nid=0x3994 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread10" #17 daemon prio=9 os_prio=2 tid=0x000002e42149e800 nid=0x6138 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread9" #16 daemon prio=9 os_prio=2 tid=0x000002e42149e000 nid=0x19f8 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread8" #15 daemon prio=9 os_prio=2 tid=0x000002e4214a3000 nid=0x4494 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread7" #14 daemon prio=9 os_prio=2 tid=0x000002e42149c800 nid=0x5adc waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread6" #13 daemon prio=9 os_prio=2 tid=0x000002e4214a1000 nid=0x284c waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread5" #12 daemon prio=9 os_prio=2 tid=0x000002e4214a0000 nid=0x4444 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread4" #11 daemon prio=9 os_prio=2 tid=0x000002e4214a2800 nid=0x4e18 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread3" #10 daemon prio=9 os_prio=2 tid=0x000002e42149d000 nid=0x33e0 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread2" #9 daemon prio=9 os_prio=2 tid=0x000002e42149a000 nid=0x5fc waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread1" #8 daemon prio=9 os_prio=2 tid=0x000002e421497800 nid=0x381c waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread0" #7 daemon prio=9 os_prio=2 tid=0x000002e421494800 nid=0x2a74 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Monitor Ctrl-Break" #6 daemon prio=5 os_prio=0 tid=0x000002e421488000 nid=0x2b68 runnable [0x000000ed530fe000]
   java.lang.Thread.State: RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
        at java.net.SocketInputStream.read(SocketInputStream.java:171)
        at java.net.SocketInputStream.read(SocketInputStream.java:141)
        at sun.nio.cs.StreamDecoder.readBytes(StreamDecoder.java:284)
        at sun.nio.cs.StreamDecoder.implRead(StreamDecoder.java:326)
        at sun.nio.cs.StreamDecoder.read(StreamDecoder.java:178)
        - locked <0x000000076c30d238> (a java.io.InputStreamReader)
        at java.io.InputStreamReader.read(InputStreamReader.java:184)
        at java.io.BufferedReader.fill(BufferedReader.java:161)
        at java.io.BufferedReader.readLine(BufferedReader.java:324)
        - locked <0x000000076c30d238> (a java.io.InputStreamReader)
        at java.io.BufferedReader.readLine(BufferedReader.java:389)
        at com.intellij.rt.execution.application.AppMainV2$1.run(AppMainV2.java:53)

"Attach Listener" #5 daemon prio=5 os_prio=2 tid=0x000002e421433000 nid=0x2ee8 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Signal Dispatcher" #4 daemon prio=9 os_prio=2 tid=0x000002e421431000 nid=0x5a60 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Finalizer" #3 daemon prio=8 os_prio=1 tid=0x000002e41f37e800 nid=0x6204 in Object.wait() [0x000000ed52dfe000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076c188f08> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:150)
        - locked <0x000000076c188f08> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:171)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:188)

"Reference Handler" #2 daemon prio=10 os_prio=2 tid=0x000002e4213c3000 nid=0x4c40 in Object.wait() [0x000000ed52cff000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076c186ba0> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x000000076c186ba0> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"VM Thread" os_prio=2 tid=0x000002e41f36f000 nid=0x67a4 runnable

"GC task thread#0 (ParallelGC)" os_prio=0 tid=0x000002e4045b8800 nid=0x4424 runnable

"GC task thread#1 (ParallelGC)" os_prio=0 tid=0x000002e4045ba000 nid=0x61b4 runnable

"GC task thread#2 (ParallelGC)" os_prio=0 tid=0x000002e4045bb000 nid=0x468c runnable

"GC task thread#3 (ParallelGC)" os_prio=0 tid=0x000002e4045bc800 nid=0x4bec runnable

"GC task thread#4 (ParallelGC)" os_prio=0 tid=0x000002e4045be800 nid=0x1dcc runnable

"GC task thread#5 (ParallelGC)" os_prio=0 tid=0x000002e4045bf800 nid=0x299c runnable

"GC task thread#6 (ParallelGC)" os_prio=0 tid=0x000002e4045c2800 nid=0x2d48 runnable

"GC task thread#7 (ParallelGC)" os_prio=0 tid=0x000002e4045c3800 nid=0x4ef4 runnable

"GC task thread#8 (ParallelGC)" os_prio=0 tid=0x000002e4045c4800 nid=0x4b14 runnable

"GC task thread#9 (ParallelGC)" os_prio=0 tid=0x000002e4045c6000 nid=0x474 runnable

"GC task thread#10 (ParallelGC)" os_prio=0 tid=0x000002e4045c7000 nid=0x5540 runnable

"GC task thread#11 (ParallelGC)" os_prio=0 tid=0x000002e4045ca800 nid=0x4104 runnable

"GC task thread#12 (ParallelGC)" os_prio=0 tid=0x000002e4045cb800 nid=0x5fdc runnable

"GC task thread#13 (ParallelGC)" os_prio=0 tid=0x000002e4045cc800 nid=0x2cc runnable

"GC task thread#14 (ParallelGC)" os_prio=0 tid=0x000002e4045d0000 nid=0x5ec0 runnable

"VM Periodic Task Thread" os_prio=2 tid=0x000002e421672000 nid=0x331c waiting on condition
        - locked <0x000000076c41f2a0> (a java.lang.String)
        at com.gyd.DeadLockDemo$$Lambda$1/1096979270.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:750)

Found 1 deadlock.

```

从jstack执行结果可以看到最后一行的信息“Found 1 deadlock.”，说明发生了死锁现象！

上面演示的是命令行方式排查死锁现象，还可以用图形化的jconsole来排查死锁现象，在cmd中执行jconsole即可调出图形化界面(需要先配置好java环境变量)

<img src="http://cdn.gydblog.com/images/java/concurrent/lock-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/java/concurrent/lock-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 七、读写锁(独占锁、共享锁)

写锁又名独占锁，就是在同一时刻只能有一个线程获取到锁，而其他获取锁的线程只能处于同步队列中等待，只有获取锁的线程释放了锁，后继的线程才能够获取锁。  

读锁又名共享锁，在同一时刻可以允许多个读线程访问。

读写锁维护了一对锁，一个读锁和一个写锁，通过分离读锁和写锁，使得并发性相比一般的排他锁有了很大提升。  

java5以后提供了读写锁的实现ReentrantReadWriteLock，下面是一个该读写锁的使用示例：
```java
//一句话概括背景：在程序中定义一个共享的用作缓存数据结构，它大部分时间提供读服务（例如查询和搜索），而写操作占有的时间很少，但是写操作完成之后的更新需要对后续的读服务可见。

public class ReadWriteLockDemo {
    static Map<String, Object> map = new HashMap<>();
    static ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    static Lock r = rwl.readLock();
    static Lock w = rwl.writeLock(); // 获取一个 key 对应的 value
    public static final Object get(String key) {
        r.lock();
        try {
            return map.get(key);
        } finally {
            r.unlock();
        }
    }
    // 设置 key 对应的 value，并返回旧的 value
    public static final Object put(String key, Object value) {
        w.lock();
        try {
            return map.put(key, value);
        } finally {
            w.unlock();
        }
    }
    // 清空所有的内容
    public static final void clear() {
        w.lock();
        try {
            map.clear();
        } finally {
            w.unlock();
        }
    }
}
```

## 八、偏向锁/轻量级锁/重量级锁

[详细介绍戳synchronized笔记](./synchronized.md#锁升级过程)
 
## 九、锁降级
锁降级指的是写锁降级成为读锁。如果当前线程拥有写锁，然后将其释放，最后再获取读锁，这种分段完成的过程不能称之为锁降级。锁降级是指把持住（当前拥有的）
写锁，再获取到读锁，随后释放（先前拥有的）写锁的过程。
## 十、AQS笔记
 [详细介绍戳AQS笔记](./aqs.md)

