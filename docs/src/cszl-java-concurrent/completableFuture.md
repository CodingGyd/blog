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

在Java8中，CompletableFuture提供了非常强大的Future的扩展功能，可以帮助我们简化异步编程的复杂性，并且提供了函数式编程的能力，可以通过回调的方式处理计算结果，也提供了转换和组合CompletableFuture的方法。它实现了Future和CompletionStage接口。

## 2. 四大静态方法
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

## 3 总结

todo
