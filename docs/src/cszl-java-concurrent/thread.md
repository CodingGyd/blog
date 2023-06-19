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
线程的生命周期

线程的各种属性
todo

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
1. 简介  

FutureTask的get()方法在Future计算完成之前会一直处于阻塞状态下，isDone()方法容易耗费CPU资源，对于真正的异步处理我们是希望能通过传入回调函数，在Future结束时自动调用该回调函数，这样，我们就不用等待结果。阻塞的方式和异步编程的设计理念相违背，而轮询的方式也会耗费CPU资源。因此JDK8中出现了一种新的工具类：CompletableFuture。

CompletableFuture是FutureTask的增强版，提供的是一种类似观察者模式的机制，可以让任务执行完成后通知监听的一方。在任务执行完成之前，监听方可以去干别的事情。

在Java8中，CompletableFuture提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程的复杂性，并且提供了函数式编程的能力，可以通过回调的方式处理计算结果，也提供了转换和组合CompletableFuture的方法。它实现了Future和CompletionStage接口。


## 总结

 