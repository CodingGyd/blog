---
# icon: lock
date: 2023-06-01

category:
  - Java
tag:
  - 并发编程
---
# 多线程入门

## 理论基础
### 进程
简单来说，在系统中运行的一个应用程序就是一个进程，每一个进程都拥有自己独立的内存空间和系统资源。  

### 线程
也称为轻量级线程，每一个进程下都至少有1个或多个线程。线程是大多数操作系统进行时间片分配调度的基本单元。  

### 管程
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

### 用户线程(User Thread)
用户线程是系统的工作线程，负责完成程序需要完成的业务操作。一般情况下不做特别说明配置，默认都是用户线程。

比如下面的main方法所在的线程就属于用户线程：  

```java
public class ThreadDemo {
    public static void main(String[] args) {
    }
}
```

### 守护线程(Daemon Thread)
是一种特殊的服务线程，主要为其它线程服务的，一般负责在后台完成一些非业务功能型、系统性的服务。比如我们的垃圾回收线程就是最典型的守护线程。  

既然做为一种服务线程，在服务对象终止运行时，守护线程也没有必要继续运行了。因此当我们的用户线程结束时，表明我们的程序业务操作也结束了，此时JVM不会去关心守护线程的运行状态，会直接自动退出。


### 上下文切换
即使是单核处理器也是支持多个线程同时执行的。这里的"同时"其实是假象，实际是CPU通过给每个线程分配时间片来实现这个假象的。时间片就是CPU分配给每个线程的可支配时间，每个时间片特别短，一般几十毫秒。当某个线程获取到时间片就会执行线程相关逻辑，时间片时间结束后就会保存当前线程的状态，然后把时间片按某种算法分配给下一个线程执行。  

## 线程基础
### 线程的生命周期
开篇先放张图：
<img src="/images/java/concurrent/thread-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

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
**新建（NEW）**：当我们创建一个新的线程实例时，线程就处于新建状态。这时候线程的start()方法还未被调用，线程对象还未开始执行。在这个状态下，Java虚拟机（JVM）已经为此线程分配了必要的内存。
```java
Thread t = new Thread();//线程此时处于新建状态
```

**就绪状态（RUNNABLE）**：当线程对象调用了start()方法后，该线程就处于就绪状态。就绪状态的线程在获得CPU时间片后就可以开始运行。这个状态的线程位于可运行线程池中，等待被线程调度选中，获得CPU的使用权。
```java
t.start(); // 线程此时处于Runnable状态
```

**运行状态（Running）**：线程获取到CPU时间片后，就进入运行状态，开始执行run()方法中的代码。值得注意的是，代码执行的实际速度和效率与处理器的速度以及多核处理器的核数有关。
```java
public void run() {
    System.out.println("Thread is running.");
}
// 如果此时这个方法正在执行，那么线程就处于Running状态
```

**阻塞状态（Blocked）**：当一个线程试图获取一个内部的对象锁（也就是进入一个synchronized块），而该锁被其他线程持有，则该线程进入阻塞状态。阻塞状态的线程在锁被释放时，将会进入就绪状态。
```java
synchronized(object) {
    // 如果此时object的锁被其他线程持有，那么线程就处于Blocked状态
}
```

**等待状态（Waiting）**：线程通过调用其自身的wait()方法、join()方法或LockSupport.park()方法，或者通过调用其他线程的join()方法，可以进入等待状态。在等待状态的线程不会被分配CPU时间片，它们只能通过被其他线程显式唤醒进入就绪状态。
```java
t.wait();  // 线程此时处于Waiting状态
t.join();  // 线程此时处于Waiting状态
```

**超时等待状态（Timed Waiting）**：当线程调用了sleep(long ms)，wait(long ms)，join(long ms)，或者LockSupport.parkNanos(), LockSupport.parkUntil()等具有指定等待时间的方法，线程就会进入超时等待状态。当超时时间到达后，线程会自动返回到就绪状态。
```java
Thread.sleep(1000); // 线程此时处于Timed Waiting状态
```

**终止状态（Terminated）**：当线程的run()方法执行完毕，或者线程中断，线程就会进入终止状态。在这个状态下，线程已经完成了它的全部工作。
```java
// 当run()方法执行完毕，线程处于Terminated状态
public void run() {
    System.out.println("Thread is running.");
}
```

线程的各种属性
todo

线程并发锁的概念  


## 常用接口和类介绍
### FutureTask
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

### CompletableFuture
[CompletableFuture入门](../cszl-java-concurrent/completableFuture.md)


## 总结

 