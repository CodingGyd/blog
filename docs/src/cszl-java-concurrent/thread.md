---
# icon: lock
date: 2023-07-09

category:
  - JAVA基础
tag:
  - 多线程
---
# 多线程入门

## 一、理论基础
### 1、进程
简单来说，在系统中运行的一个应用程序就是一个进程，比如启动一个java程序，系统就会创建一个对应的进程。 每一个进程都拥有自己独立的内存空间和系统资源。  

### 2、线程
线程(Light Weight Process)也称为轻量级线程，线程是大多数操作系统进行时间片分配调度的基本单元，是调度的最小单位。每一个进程下都至少有1个或多个线程，每个线程拥有独立的程序计数器、堆栈、局部变量等信息，并且能够访问共享变量。处理器在这些线程之间进行高速切换执行，让用户以为是在并发执行。

线程又可以分为用户线程和守护线程：  

- 用户线程(User Thread)  
用户线程是系统的工作线程，负责完成程序需要完成的业务操作。一般情况下不做特别说明配置，默认都是用户线程。

比如下面的main方法所在的线程就属于用户线程：  

```java
public class ThreadDemo {
    public static void main(String[] args) {
    }
}
```

- 守护线程(Daemon Thread)  
是一种特殊的服务线程，主要为其它线程服务的，一般负责在后台完成一些非业务功能型、系统性的服务。比如我们的垃圾回收线程就是最典型的守护线程。  

既然做为一种服务线程，在服务对象终止运行时，守护线程也没有必要继续运行了。因此当我们的用户线程结束时，表明我们的程序业务操作也结束了，此时JVM不会去关心守护线程的运行状态，会直接自动退出。

### 3、管程
也叫Monitor(监视器)，也就是我们平时常说的锁(synchronized)。  Monitor是一种同步机制，目的是保证同一时间只能有一个线程可以访问被保护的代码和数据。  

JVM中的同步也是基于进入和退出监视器对象(Monitor管程对象)来实现的，每个对象实例都会伴随有一个Monitor对象，Monitor对象会和对象实例一同创建并销毁，Monitor底层是由C++语言实现的。

在HotSpot虚拟机中，monitor采用ObjectMonitor实现:
```java
ObjectMonitor(){
    _header = NULL;
    _count = 0;
    _waiter = 0;
    _recursions = 0;
    object = NULL;
    owner = NULL;
    _WaitSet = NULL;
    _WaitSetLock = 0;
    _Responsible = NULL;
    _succ = NULL;
    _cxq = NULL;
    FreeNext = NULL;
    _EntryList = NULL;
    _SpinFreq = 0;
    _SpinClock = 0;
    OwnerIsThread = 0;
    _previous_owner_tid = 0;
}
```
ObjectMonitor中有几个关键属性：
<table>
<tr><td>_owner</td><td>指向持有ObjectMonitor对象的线程</td></tr>
<tr><td>_WaitSet</td><td>存放处于wait状态的线程队列</td></tr>
<tr><td>_EntryList</td><td>存放处于等待锁block状态的线程队列</td></tr>
<tr><td>_recursions</td><td>锁的重入次数</td></tr>
<tr><td>_count</td><td>用来记录该线程获取锁的次数</td></tr>
</table>


### 4、上下文切换
即使是单核处理器也是支持多个线程同时执行的。这里的"同时"其实是假象，实际是CPU通过给每个线程分配时间片来实现这个假象的。时间片就是CPU分配给每个线程的可支配时间，每个时间片特别短，一般几十毫秒。当某个线程获取到时间片就会执行线程相关逻辑，时间片时间结束后就会保存当前线程的状态，然后把时间片按某种算法分配给下一个线程执行。  

### 5、线程池  
创建一个线程是比较耗费系统资源的，受限于硬件配置和CPU核数限制，一个机器上能创建的线程数是有限制的。线程的创建和销毁也会导致操作系统底层进行频繁的上下文切换动作。对于需要支持高并发请求量的系统来说，允许无限制的创建线程是可怕的。

线程池技术能很好解决这些问题，线程池技术是指提前准备了一个池子，预先初始化好了一定数量的线程放入其中，并通过一定策略对池子中的线程进行新增和销毁。用户在使用过程中不能自己对线程进行创建和销毁，只能重复使用池子里的线程。通过这种方式，能很好的解决频繁创建线程导致操作系统上下文频繁切换的开销问题，而且面对过量任务请求的提交能够进行平滑的控制，增强系统的可用性。

## 二、线程基础

一个 最简单的Java Hello程序其实也包含了多个线程。从 main()方法开始执行，然后按照既定的代码逻辑执行，看似没有其他线程参与，但实际上 Java 程序天生就是多线程程序，因为执行 main()方法的是一个名称为 main 的主线程。下面使用 JMX 来查看一个普通的 Java 程序包含有多少个线程：
```java
package com.gyd;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public class ThreadBasicDemo1 {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        // 获取 Java 线程管理 MXBean
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        // 不需要获取同步的 monitor 和 synchronizer 信息，仅获取线程和线程堆栈信息
        ThreadInfo[] threadInfos = threadMXBean.dumpAllThreads(false, false);
        // 遍历线程信息，仅打印线程 ID 和线程名称信息
        for (ThreadInfo threadInfo : threadInfos) {
            System.out.println("[" + threadInfo.getThreadId() + "] " + threadInfo.
                    getThreadName());
        }
    }
}

```

执行结果如下：
```
Hello World!
[6] Monitor Ctrl-Break
[5] Attach Listener
[4] Signal Dispatcher  // 分发处理发送给 JVM 信号的线程
[3] Finalizer   // 调用对象 finalize 方法的线程
[2] Reference Handler  // 清除 Reference 的线
[1] main   //主线程 用户程序入口
```

可以看出，我们写的java程序启动后，jvm还启动了多个负责不同任务的子线程在后台同时执行。


### 1、线程的生命周期
开篇先放张图：
<img src="http://cdn.gydblog.com/images/java/concurrent/thread-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

从Thread.State内部类源码也可以得出线程主要有以下几种状态：

```java
public enum State {
        //新建状态 
        NEW,
        //就绪状态
        RUNNABLE,
        //阻塞状态
        BLOCKED,
        //等待状态
        WAITING,
        //超时等待状态
        TIMED_WAITING,
        //终止状态
        TERMINATED;
    }
```
**新建（NEW）**  
当我们创建一个新的线程实例时，线程就处于新建状态。这时候线程的start()方法还未被调用，线程对象还未开始执行。在这个状态下，Java虚拟机（JVM）已经为此线程分配了必要的内存。
```java
Thread t = new Thread();//线程此时处于新建状态
```

**就绪状态（RUNNABLE）**  
当线程对象调用了start()方法后，该线程就处于就绪状态。就绪状态的线程在获得CPU时间片后就可以开始运行。这个状态的线程位于可运行线程池中，等待被线程调度选中，获得CPU的使用权。
```java
t.start(); // 线程此时处于Runnable状态
```

**运行状态（Running）**  
线程获取到CPU时间片后，就进入运行状态，开始执行run()方法中的代码。值得注意的是，代码执行的实际速度和效率与处理器的速度以及多核处理器的核数有关。
```java
public void run() {
    System.out.println("Thread is running.");
}
// 如果此时这个方法正在执行，那么线程就处于Running状态
```

<font color='red'>注意：</font>Java 将操作系统中的运行和就绪两个状态合并称为运行状态，因此在前面的Thread.State内部类源码中没有Running这个类型。


**阻塞状态（Blocked）**  
当一个线程试图获取一个内部的对象锁（也就是进入一个synchronized块），而该锁被其他线程持有，则该线程进入阻塞状态。阻塞状态的线程在锁被释放时，将会进入就绪状态。  
```java
synchronized(object) {
    // 如果此时object的锁被其他线程持有，那么线程就处于Blocked状态
}
```

**等待状态（Waiting）**  
线程通过调用其自身的wait()方法、join()方法或LockSupport.park()方法，或者通过调用其他线程的join()方法，可以进入等待状态。在等待状态的线程不会被分配CPU时间片，它们只能通过被其他线程显式唤醒进入就绪状态。
```java
t.wait();  // 线程此时处于Waiting状态
t.join();  // 线程此时处于Waiting状态
```

**超时等待状态（Timed Waiting）**  
当线程调用了sleep(long ms)，wait(long ms)，join(long ms)，或者LockSupport.parkNanos(), LockSupport.parkUntil()等具有指定等待时间的方法，线程就会进入超时等待状态。当超时时间到达后，线程会自动返回到就绪状态。
```java
Thread.sleep(1000); // 线程此时处于Timed Waiting状态
```

**终止状态（Terminated）**  
当线程的run()方法执行完毕，或者线程中断，线程就会进入终止状态。在这个状态下，线程已经完成了它的全部工作。
```java
// 当run()方法执行完毕，线程处于Terminated状态
public void run() {
    System.out.println("Thread is running.");
}
```
 
### 2、线程的中断机制 

如何停止中断运行中的线程？

- volatile
```java
package com.gyd;

import java.util.concurrent.TimeUnit;

public class InterruptDemo1 {
    static volatile boolean isStop = false;
    public static void main(String[] args) {
        new Thread(()->{
            while(true) {
                if (isStop) {
                    System.out.println(Thread.currentThread().getName()+" 被中断");
                    break;
                }
                System.out.println("t1 --- hello volatile");
            }
        },"t1").start();


        try {
            TimeUnit.MICROSECONDS.sleep(20);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        new Thread(()->{
            isStop = true;
        },"t2").start();

    }
}

```

- AtomicBoolean
```java
package com.gyd;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
public class InterruptDemo2 {
    static AtomicBoolean isStop = new AtomicBoolean(false);

    public static void main(String[] args) {
        new Thread(()->{
            while(true) {
                if (isStop.get()) {
                    System.out.println(Thread.currentThread().getName()+" 被中断");
                    break;
                }
                System.out.println("t1 --- hello volatile");
            }
        },"t1").start();


        try {
            TimeUnit.MICROSECONDS.sleep(20);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        new Thread(()->{
            isStop.set(true);
        },"t2").start();
  
    }
}

```

- interrupt
```java
package com.gyd;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class InterruptDemo3 {

    public static void main(String[] args) {
       Thread t1= new Thread(()->{
            while(true) {
                if (Thread.currentThread().isInterrupted()) {
                    System.out.println(Thread.currentThread().getName()+" 被中断");
                    break;
                }
                System.out.println("t1 --- hello volatile");
            }
        },"t1");
       t1.start();


        try {
            TimeUnit.MICROSECONDS.sleep(20);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        new Thread(()->{
            t1.interrupt();
        },"t2").start();
  
    }
}

```

<br/>
<font color="blue">线程中断的三大API方法：</font>

> public void interrupt()  
是一个实例方法，它通知目标线程商量中断，也仅仅是设置目标线程的中断标志位为true，至于是否中断是由目标线程自己控制。  

> public boolean isInterrupted()  
是一个实例方法，它判断当前线程是否被中断(通过检查中断标志位)，并返回中断标志。  

> public static boolean interrupted()  
是Thread类的静态方法，返回当前线程的中断状态真实值并将当前线程的中断状态设置为false。此方法调用之后会清除当前线程的中断标志位(当中断标志置为false)， 返回当前值并清零置为false


### 3、线程的等待和唤醒机制
是指一个线程 A 调用了对象 O 的 等待方法(wait、await、park)进入等待状态，而另一个线程 B 调用了对象 O 的唤醒方法(notify、nofityAll、signal、unpark)，线程 A 收到通知后从对象 O 的等待方法返回，进而执行后续操作。上述两个线程通过对象 O 来完成交互，而对象上的等待方法和唤醒方法的关系就如同开关信号一样，用来完成等待方和通知方之间的交互工作。
等待方法和唤醒方法有三组，下面介绍下每一组的概念和用法
- 方式1-wait和notify  
<img src="http://cdn.gydblog.com/images/java/concurrent/thread-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

wait和notify方法必须在同步块或者同步方法中使用，且必须成对出现，先执行wait才可以执行notify方法
```java
package com.gyd;

import java.util.concurrent.TimeUnit;

public class LockSupportDemo1 {

    private static Object lockObject = new Object();

    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            synchronized (lockObject) {
                System.out.println(Thread.currentThread().getName()+" enter");
                try {
                    lockObject.wait();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                System.out.println(Thread.currentThread().getName()+" 被唤醒");
            }
        },"AAA").start();

        TimeUnit.SECONDS.sleep(1);

        new Thread(()->{
            synchronized (lockObject) {
                lockObject.notify();
                System.out.println(Thread.currentThread().getName()+" 发出唤醒通知");
            }
        },"BBB").start();
    }
}

```


- 方式2-Condition中的await和signal   

Condition 接口也提供了类似 Object 的监视器方法await和signal，await和signal方法必须在同步块或者同步方法中使用，必须先执行await，再执行signal ，与 Lock 配合可以实现等待/通知模式
```java
package com.gyd;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockSupportDemo2 {

    public static void main(String[] args) throws InterruptedException {
        Lock lock = new ReentrantLock();
        //Condition 对象是由 Lock 对象（调用 Lock 对象的newCondition()方法）创建出来的，换句话说，Condition 是依赖 Lock 对象的。
        
        Condition condition = lock.newCondition();
        new Thread(() -> {
            lock.lock();
            try {
                System.out.println(Thread.currentThread().getName()+" enter");
                condition.await();
                System.out.println(Thread.currentThread().getName()+" 被唤醒");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
        },"AAA").start();

        TimeUnit.SECONDS.sleep(1);

        new Thread(()->{
            lock.lock();
            try {
                condition.signal();
                System.out.println(Thread.currentThread().getName()+" 发起唤醒");
            } finally {
                lock.unlock();
            }
        },"BBB").start();
    }
}

```

 
- 方式3-LockSupport   
前面的等待和唤醒方式都有两个限制条件：  

    a. 线程必须要先获得并持有锁，必须在锁块中(synchronized或Lock)。  
    b. 必须先等待后唤醒，线程才能够被正确唤醒。  

而LockSupport就突破了这两个限制条件，使用时不需要额外关注锁的持有和释放动作，且可以突破wait/notify 、await/signal的原有调用顺序。  

LockSupport 定义了一组的公共静态方法，这些方法提供了最基本的线程阻塞和唤醒功能L，LockSupport 也成为构建同步组件的基础工具。 


使用示例：
```java
package com.gyd;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.LockSupport;
public class LockSupportDemo3 {


    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            System.out.println(Thread.currentThread().getName()+" enter");
            LockSupport.park();
            System.out.println(Thread.currentThread().getName()+" 被唤醒");
        },"AAA");
        thread.start();

        TimeUnit.SECONDS.sleep(1);

        new Thread(()->{
            LockSupport.unpark(thread);
            System.out.println(Thread.currentThread().getName()+" 发起唤醒");

        },"BBB").start();
    }
}

```

LockSupport是一个线程阻塞工具类，所有的方法都是静态方法，可以让线程在任意位置进行阻塞(LockSupport.park())，阻塞之后也有对应的唤醒方法(LockSupport.unpark())。LockSupport底层调用的是Unsafe中的native代码。   

LockSupport和每个使用它的线程都有一个许可证(permit)关联。每个线程最多只能有一个permit许可证，重复调用unpark也不会积累凭证。   

**当调用park方法时**  
   a. 如果有凭证，则使用完这个凭证并退出(凭证可以提前发放，这里就是为什么可以突破wait/notify、await/signal调用顺序的原因)。  
   b. 如果没有凭证， 则线程会阻塞直到unpark发放一个凭证才能退出。  

当调用unpark方法时，会给对应的线程增加一个凭证(最多增加一个)，多次调用unpark也不会重复发放凭证。  


从上面三组等待通知方法可以提炼出其中的经典范式，该范式分为两部分，分别针对等待方（消费者）和通知方（生产者）。  

等待方遵循如下原则:  
1) 获取对象的锁。  
2) 如果条件不满足，那么调用对象的 wait()方法，被通知后仍要检查条件。  
3) 条件满足则执行对应的逻辑。 

对应的伪代码如下。  
```
synchronized(对象) {
 while(条件不满足) { 
 对象.wait();
 }
 对应的处理逻辑
}
```

通知方遵循如下原则:  
1) 获得对象的锁。  
2) 改变条件。  
3) 通知所有等待在对象上的线程。  

对应的伪代码如下。 
```
synchronized(对象){
 改变条件
 对象.notifyAll();
}
``` 


线程还有一个join方法，也是等待唤醒机制的一种。如果一个线程 A 执行了 thread.join()语句，其含义是：当前线程 A 等待 thread 线程终止之后才从 thread.join()返回。线程 Thread 除了提供 join()方法之外，还提供了 join(long millis)和 join(longmillis,int nanos)两个具备超时特性的方法。这两个超时方法表示，如果线程 thread 在给定的超时时间里没有终止，那么将会从该超时方法中返回。  

jdk中Thread类中join方法的源码：  
```java
    public final synchronized void join(long millis)
    throws InterruptedException {
        long base = System.currentTimeMillis();
        long now = 0;

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            //条件不满足继续等待
            while (isAlive()) {
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
            //条件满足，停止等待，方法返回。
        }
    }
```
可以看出源码中join方法的逻辑也基本符合等待/通知经典范式的思想。  

在下面所示的例子中，创建了 10 个线程，编号 0~9，每个线程调用前一个线程的 join()方法，也就是线程 0 结束了，线程 1 才能从 join()方法中返回，而线程 0 需要等待 main 线程结束。

```java
public class JoinDemo {
    public static void main(String[] args) throws Exception {
        Thread previous = Thread.currentThread();
        for (int i = 0; i < 10; i++) {
            // 每个线程拥有前一个线程的引用，需要等待前一个线程终止，才能从等待中返回
            Thread thread = new Thread(new Domino(previous), String.valueOf(i));
            thread.start();
            previous = thread;
        }
        TimeUnit.SECONDS.sleep(5);
        System.out.println(Thread.currentThread().getName() + " terminate.");
    }
    static class Domino implements Runnable {
        private Thread thread;
        public Domino(Thread thread) {
            this.thread = thread;
        }
        public void run() {
            try {
                thread.join();
            } catch (InterruptedException e) {
            }
            System.out.println(Thread.currentThread().getName() + " terminate.");
        }
    }
}
```
上面会按顺序输出结果：
```java
main terminate.
0 terminate.
1 terminate.
2 terminate.
3 terminate.
4 terminate.
5 terminate.
6 terminate.
7 terminate.
8 terminate.
9 terminate.
```


### 4、线程的管道输入输出流  
管道输入/输出流和普通的文件输入/输出流或者网络输入/输出流不同之处在于，它主要用于线程之间的数据传输，而传输的媒介为内存。管道输入/输出流主要包括了如下
4 种具体实现：PipedOutputStream、PipedInputStream、PipedReader 和 PipedWriter，前两种面向字节，而后两种面向字符。

下面是一个管道输入输出的示例程序：  
```java
public class Piped {
    public static void main(String[] args) throws Exception {
        PipedWriter out = new PipedWriter();
        PipedReader in = new PipedReader();
        // 对于 Piped 类型的流，必须先要进行绑定，也就是调用 connect()方法，将输出流和输入流进行连接，否则在使用时会抛出 IOException
        out.connect(in);
        Thread printThread = new Thread(new Print(in), "PrintThread");
        printThread.start();
        int receive = 0;
        try {
            while ((receive = System.in.read()) != -1) {
                out.write(receive);
            }
        } finally {
            out.close();
        }
    }
    static class Print implements Runnable {
        private PipedReader in;
        public Print(PipedReader in) {
            this.in = in;
        }
        public void run() {
            int receive = 0;
            try {
                while ((receive = in.read()) != -1) {
                    System.out.print((char) receive);
                }
            } catch (IOException ex) {
            }
        }
    }
}
```
上面程序中创建了 printThread，它用来接受 main 线程的输入，任何 main 线程的输入均通过 PipedWriter 写入，而printThread 在另一端通过 PipedReader 将内容读出并打印。

运行上面程序，输入一组字符串，可以看到被 printThread 进行了原样输出。  
```
111
111
222
222
333
333
444
444
``` 

### 5、线程属性-优先级  

目前的操作系统基本是采用时分的形式调度各个线程，每个线程根据分配到的若干个时间片来执行自己的任务，当线程的时间片用完时就会发生线程调度，该线程需要等待下一次分配时间片后才能继续执行。线程根据时间片分配来分配处理器资源，而线程的优先级属性就保证了线程能够多分配或者少分配处理器资源。  

通过查看Thread.java类源码可以看出，一个java线程可以通过priority属性来设置自身的优先级，priority的范围是从1到10，数值越大代表优先级越高，默认值是5。
```java
public class Thread implements Runnable {

    private int            priority;

    /*** 优先级最小值*/
    public final static int MIN_PRIORITY = 1;

    /*** 优先级默认值*/
    public final static int NORM_PRIORITY = 5;

    /*** 优先级最大值*/
    public final static int MAX_PRIORITY = 10;

    public final void setPriority(int newPriority) {
        ThreadGroup g;
        checkAccess();
        if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
            throw new IllegalArgumentException();
        }
        if((g = getThreadGroup()) != null) {
            if (newPriority > g.getMaxPriority()) {
                newPriority = g.getMaxPriority();
            }
            setPriority0(priority = newPriority);
        }
    }

    ....
}
```

设置线程优先级时，通常的方式是针对频繁阻塞（休眠或者 I/O 操作）的线程需要设置较高优先级，而偏重计算（需要较多 CPU时间或者偏运算）的线程则设置较低的优先级，确保处理器不会被独占。在不同的 JVM以及操作系统上，线程规划会存在差异，有些操作系统甚至会忽略对线程优先级的设定，因此线程优先级不能作为程序正确性的依赖。

### 6、线程属性-Daemon

Daemon 线程是一种支持型线程(常被叫做守护线程)，因为它主要被用作程序中后台调度以及支持性工作。这意味着，当一个 Java 虚拟机中不存在非 Daemon 线程的时候，Java 虚拟机将会退出。可以通过调用 Thread.setDaemon(true)将线程设置为 Daemon 线程。  

Daemon 属性需要在启动线程之前设置，不能在启动线程之后设置。Daemon 线程被用作完成支持性工作，但是在 Java 虚拟机退出时 Daemon 线程中的逻辑不一定保证会执行。
```java
package com.gyd;

public class ThreadBasicDemo2 {
    public static void main(String[] args) {
        Thread thread = new Thread(new DaemonRunner(),"DaemonRunner");
        thread.setDaemon(true);
        thread.start();
    }

    static class DaemonRunner implements Runnable{

        @Override
        public void run() {
            try {
                System.out.println("daemon...");
            } finally {
                System.out.println("exit daemon...");
            }
        }
    }
}

```
上面的程序中，当main程序执行完成时，DaemonRunner中的run方法逻辑不一定会被执行完成。

## 三、常用接口和类介绍
### 1、FutureTask
优点：Future+线程池异步多线程任务配合，能够显著提高程序的执行效率。  
缺点：获取结果的get操作容易导致阻塞，一般建议放在程序后面，如果不希望阻塞太长时间，可以设置阻塞最大时间，超过指定时间后自动返回。
```java
public class ThreadDemo {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        long start = System.currentTimeMillis();
        FutureTask<String> a1 = new FutureTask<>(() -> {
            Thread.sleep(500);
            return "aaa";
        });
        executorService.submit(a1);
        FutureTask<String> a2 = new FutureTask<>(() -> {
            Thread.sleep(500);
            return "bbb";
        });
        Thread.sleep(500);
        executorService.submit(a2);

        System.out.println(a1.get());
        System.out.println(a2.get());

        System.out.println("call3");

        long end = System.currentTimeMillis() - start;
        System.out.println("cost : "+end);
        executorService.shutdown();
    }
}

```

### 2、CompletableFuture
[CompletableFuture入门](../cszl-java-concurrent/completableFuture.md)
 

## 四、参考资料  
《Java并发编程的艺术》

 