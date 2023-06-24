---
# icon: lock
date: 2023-06-01

category:
  - Java
tag:
  - 并发编程
  - CompletableFuture
---
# CompletableFuture
## 1. 简介  

FutureTask的get()方法在Future计算完成之前会一直处于阻塞状态下，isDone()方法容易耗费CPU资源，对于真正的异步处理我们是希望能通过传入回调函数，在Future结束时自动调用该回调函数，这样，我们就不用等待结果。阻塞的方式和异步编程的设计理念相违背，而轮询的方式也会耗费CPU资源。因此JDK8中出现了一种新的工具类：CompletableFuture。

CompletableFuture是FutureTask的增强版，提供的是一种类似观察者模式的机制，可以让任务执行完成后通知监听的一方。在任务执行完成之前，监听方可以去干别的事情。

在Java8中，CompletableFuture提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程的复杂性，并且提供了函数式编程的能力，可以通过回调的方式处理计算结果，也提供了转换和组合CompletableFuture的方法。它能代表一个明确完成的Future，也有可能代表一个完成阶段(CompletableStage)。它支持在计算完成后触发一些函数或者执行某些动作。它实现了Future和CompletionStage接口。

![类结构](/images/java/concurrent/CompletableFuture-1.png)


> CompletionStage代表异步计算过程中的某一个阶段，一个阶段完成以后可能会触发另外一个阶段。  
一个阶段的计算可以是一个Function，Consumer或者Runnable，比如：stage.thenApply(x -> square(x)).thenAccept(x -> System.out.print(x)).thenRun(() -> System.out.println());  
一个阶段的执行可能是被单个阶段的完成触发，也可能是由多个阶段一起触发

## 2. 四大静态方法入门
> java不推荐使用构造方法构造CompletableFuture，推荐使用下面的四大静态方法。
### 2.1 runAsync无返回值(默认线程池)
```java
public static CompletableFuture<Void> runAsync(Runnable runnable);
```

### 2.2 runAsync无返回值(自定义线程池)
```java
public static CompletableFuture<Void> runAsync(Runnable runnable,Executor executor);
```

### 2.3 supplyAsync有返回值(默认线程池)
```java
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier);
```

### 2.4 supplyAsync有返回值(自定义线程池)
```java
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier,Executor executor);
```
### 2.5 源码测试
```java
package com.gyd;

import java.util.concurrent.*;

public class CompletableFutureDemo {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("======CompletableFuture.runAsync的演示(无返回值，默认线程池)");
        runAsync1();
        System.out.println("======CompletableFuture.runAsync的演示(无返回值，自定义线程池)");
        runAsync2();
        System.out.println("======CompletableFuture.supplyAsync1的演示(有返回值，默认线程池)");
        supplyAsync1();
        System.out.println("======CompletableFuture.supplyAsync1的演示(有返回值，自定义线程池)");
        supplyAsync2();
    }

    public static void runAsync1() throws ExecutionException, InterruptedException {
        //不推荐
        //CompletableFuture completableFuture = new CompletableFuture();
        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(()->{
           System.out.println(Thread.currentThread().getName());
           try {TimeUnit.SECONDS.sleep(1);}catch (Exception e) {e.printStackTrace();}
        });
        System.out.println(completableFuture.get());
    }

    public static void runAsync2() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(()->{
            System.out.println(Thread.currentThread().getName());
            try {TimeUnit.SECONDS.sleep(1);}catch (Exception e) {e.printStackTrace();}
        },executorService);
        System.out.println(completableFuture.get());
        executorService.shutdown();
    }

    public static void supplyAsync1() throws ExecutionException, InterruptedException {
         CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(() ->{
             System.out.println(Thread.currentThread().getName());
             try {TimeUnit.SECONDS.sleep(1);}catch (Exception e) {e.printStackTrace();}
             return "Hello Supply";
         });
         System.out.println(completableFuture.get());
    }
    public static void supplyAsync2() throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(() ->{
            System.out.println(Thread.currentThread().getName());
            try {TimeUnit.SECONDS.sleep(1);}catch (Exception e) {e.printStackTrace();}
            return "Hello Supply";
        },executorService);
        System.out.println(completableFuture.get());
        executorService.shutdown();
    }
}

```
输出结果:  
```
======CompletableFuture.runAsync的演示(无返回值，默认线程池)
ForkJoinPool.commonPool-worker-25
null
======CompletableFuture.runAsync的演示(无返回值，自定义线程池)
pool-1-thread-1
null
======CompletableFuture.supplyAsync1的演示(有返回值，默认线程池)
ForkJoinPool.commonPool-worker-25
Hello Supply
======CompletableFuture.supplyAsync1的演示(有返回值，自定义线程池)
pool-2-thread-1
Hello Supply

Process finished with exit code 0

```

## 应用场景
**先A后B的场景应用**
```java
package com.gyd;

import java.util.Random;
import java.util.concurrent.*;

public class CompletableFutureDemo2 {
    //先A后B的场景应用
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //推荐配置自定义的线程池！！
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        try {
            CompletableFuture<Integer> completableFuture = CompletableFuture.supplyAsync(() -> {
                //第一步
                int result = new Random().nextInt(10);
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " 出结果:" + result);
                return result;
            },executorService).whenComplete((v, e) -> {
                //第二步，获取第一步的结果
                if (null == e) {
                    System.out.println(Thread.currentThread().getName() + " 接收到结果:" + v);
                }
            }).exceptionally(e -> {
                e.printStackTrace();
                System.out.println("发生异常了：" + e);
                return null;
            });

            System.out.println(Thread.currentThread().getName()+"主线程去忙别的事情");
            //主线程不要立刻结束，否则CompletableFuture默认使用的线程池会立刻关闭，这里暂停3秒钟
            try{ Thread.sleep(3000);}catch (Exception e){e.printStackTrace();}
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            executorService.shutdown();
        }
    }
}

```
todo
