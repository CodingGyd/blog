---
# icon: lock
date: 2023-07-09

category:
  - JAVA基础
tag:
  - 线程池
---
# 手写一个简单的线程池

## 01、废话少说，先上代码

下面代码实现了一个简单的，比较潦草的线程池~

### 定义线程池顶层接口
```java
public interface ThreadPool<T> {
    // 执行一个 Job，这个 Job 需要实现 Runnable
    void execute(T job);
    // 关闭线程池
    void shutdown();
    // 增加工作者线程
    void addWorkers(int num);
    // 减少工作者线程
    void removeWorker(int num);
    // 得到正在等待执行的任务数量
    int getJobSize();
}
```

### 实现线程池能力接口具体逻辑
```java
package com.gyd;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

public class ThreadPoolDemo<T> implements ThreadPool<T> {
    // 线程池最大限制数
    private static final int MAX_WORKER_NUMBERS = 10;
    // 线程池默认的数量
    private static final int DEFAULT_WORKER_NUMBERS = 5;
    // 线程池最小的数量
    private static final int MIN_WORKER_NUMBERS = 1;

    //工作任务队列，用户不断提交任务到队列中
    private final LinkedList<T> jobs = new LinkedList<>();

    //工作线程，从任务队列拉取任务进行处理
    private final List<Worker> workers = Collections.synchronizedList(new ArrayList<>());

    // 工作者线程的数量
    private int workerNum = 10;
    // 线程编号生成
    private AtomicLong threadNum = new AtomicLong();

    public ThreadPoolDemo() {
        initializeWokers(DEFAULT_WORKER_NUMBERS);
    }
    public ThreadPoolDemo(int num) {
        workerNum = num > MAX_WORKER_NUMBERS ? MAX_WORKER_NUMBERS : Math.max(num,
                MIN_WORKER_NUMBERS);
        initializeWokers(workerNum);
    }
    public int getJobSize() {
        return jobs.size();
    }
    public void execute(T job) {
        if (null != job) {
            synchronized (jobs) {
                //添加一个任务
                jobs.addLast(job);
                //随机唤醒一个线程
                jobs.notify();
            }
        }
    }

    public void shutdown(){
        for (Worker worker : workers) {
            worker.shutdown();
        }
    }

    public void initializeWokers(int num){
        for(int i=0;i<num;i++) {
            Worker worker = new Worker();
            workers.add(worker);

            Thread thread = new Thread(worker,"thread-"+threadNum.incrementAndGet());
            thread.start();
        }
    }

    public void addWorkers(int num) {
        synchronized (jobs) {
            // 限制新增的 Worker 数量不能超过最大值
            if (num + this.workerNum > MAX_WORKER_NUMBERS) {
                num = MAX_WORKER_NUMBERS - this.workerNum;
            }
            initializeWokers(num);
            this.workerNum += num;
        }
    }
    public void removeWorker(int num) {
        synchronized (jobs) {
            if (num >= this.workerNum) {
                throw new IllegalArgumentException("beyond workNum");
            }
            // 按照给定的数量停止 Worker
            int count = 0;
            while (count < num) {
                Worker worker = workers.get(count);
                if (workers.remove(worker)) {
                    worker.shutdown();
                    count++;
                }
            }
            this.workerNum -= count;
        }
    }
    //工作线程定义
    class Worker implements Runnable{
        private volatile boolean running = true;
        @Override
        public void run() {
            while(running){
                T job = null;

                synchronized (jobs) {
                    while(jobs.isEmpty()) {
                        try {
                            //等待被唤醒
                            jobs.wait();
                        } catch (InterruptedException e) {
                            // 感知到外部对 WorkerThread 的中断操作，返回
                            Thread.currentThread().interrupt();
                            return;
                        }
                        job = jobs.removeFirst();
                    }
                }
                if (null != job) {
                    System.out.println(Thread.currentThread().getName()+" 执行一个任务======="+job);
                }
            }
            System.out.println(Thread.currentThread().getName()+" 销毁了");

        }

        public void shutdown() {
            running = false;
        }
    }

}
 class BeanDemo {
    Integer id;
    String name;

     public String getName() {
         return name;
     }

     public void setName(String name) {
         this.name = name;
     }

     public Integer getId() {
         return id;
     }

     public void setId(Integer id) {
         this.id = id;
     }
 }

```


### 使用线程池
```java
 public static void main(String[] args) throws InterruptedException {
        ThreadPoolDemo threadPoolDemo = new ThreadPoolDemo();
        for (int i=0;i<10;i++) {
            BeanDemo beanDemo = new BeanDemo();
            beanDemo.setName("zzz"+i);
            threadPoolDemo.execute(beanDemo);
        }
        TimeUnit.SECONDS.sleep(2);
        threadPoolDemo.shutdown();
}
```
运行程序，输出结果如下：
```java
thread-3 执行一个任务=======com.gyd.BeanDemo@688b4222
thread-4 执行一个任务=======com.gyd.BeanDemo@3658a36e
thread-2 执行一个任务=======com.gyd.BeanDemo@23fe98dc
thread-1 执行一个任务=======com.gyd.BeanDemo@3fe25157
thread-5 执行一个任务=======com.gyd.BeanDemo@120f3e22
thread-3 销毁了
thread-2 销毁了
thread-5 销毁了
thread-1 销毁了
thread-4 销毁了
```

## 02、看看官方权威的线程池源码
ThreadPoolExecutor是JDK中的线程池实现，在juc包中，下面是它的构造方法源码：
```java
 public ThreadPoolExecutor(int corePoolSize, //核心线程数
                              int maximumPoolSize,//最大线程数
                              long keepAliveTime, //空闲线程存活时间
                              TimeUnit unit,//时间单位
                              BlockingQueue<Runnable> workQueue,//工作队列
                              ThreadFactory threadFactory,//线程工厂
                              RejectedExecutionHandler handler//拒绝策略
                              ) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

从构造方法可以看出，初始化线程池需要定义七大参数，下面介绍下每个参数的具体含义。

### corePoolSize-核心线程数  
线程池维护的最小线程数量，核心线程创建后不会被回收（注意：设置allowCoreThreadTimeout=true后，空闲的核心线程超过存活时间也会被回收）。  

大于核心线程数的线程，在空闲时间超过keepAliveTime后会被回收。  

线程池刚创建时，里面没有一个线程，当调用 execute() 方法添加一个任务时，如果正在运行的线程数量小于corePoolSize，则马上创建新线程并运行这个任务。   

### maximumPoolSize-最大线程数  
线程池允许创建的最大线程数量。  

当添加一个任务时，核心线程数已满，线程池还没达到最大线程数，并且没有空闲线程，工作队列已满的情况下，创建一个新线程并执行。    

一般需要根据任务的类型来配置线程池大小：  

- 如果是CPU密集型任务，就需要尽量压榨CPU，参考值可以设为 NCPU+1  

- 如果是IO密集型任务，参考值可以设置为2*NCPU  

上面配置方式只是一个经验参考，具体的设置还需要根据实际情况进行调整，比如可以先将线程池大小设置为参考值，再观察任务运行情况和系统负载、资源利用率来进行适当调整。  

### keepAliveTime-空闲线程存活时间
当一个可被回收的线程的空闲时间大于keepAliveTime，就会被回收。  

可被回收的线程：  
- 设置allowCoreThreadTimeout=true的核心线程。  
- 大于核心线程数的线程（非核心线程）。  

### unit-时间单位
时间单位有以下几种：  
```java
TimeUnit.NANOSECONDS
TimeUnit.MICROSECONDS
TimeUnit.MILLISECONDS 
TimeUnit.SECONDS
TimeUnit.MINUTES
TimeUnit.HOURS
TimeUnit.DAYS
```

### workQueue-工作队列
存放待执行任务的队列：当提交的任务数超过核心线程数大小后，再提交的任务就存放在工作队列，任务调度时再从队列中取出任务。它仅仅用来存放被execute()方法提交的Runnable任务。工作队列实现了BlockingQueue接口。  

JDK默认的工作队列有五种：  

- ArrayBlockingQueue 数组型阻塞队列：数组结构，初始化时传入大小，有界，FIFO，使用一个重入锁，默认使用非公平锁，入队和出队共用一个锁，互斥。  
- LinkedBlockingQueue 链表型阻塞队列：链表结构，默认初始化大小为Integer.MAX_VALUE，有界（近似无解），FIFO，使用两个重入锁分别控制元素的入队和出队，用Condition进行线程间的唤醒和等待。  
- SynchronousQueue 同步队列：容量为0，添加任务必须等待取出任务，这个队列相当于通道，不存储元素。  
- PriorityBlockingQueue 优先阻塞队列：无界，默认采用元素自然顺序升序排列。  
- DelayQueue 延时队列：无界，元素有过期时间，过期的元素才能被取出。   


### threadFactory-线程工厂
创建线程的工厂，可以设定线程名、线程编号等。

### handler-拒绝策略
当线程池线程数已满，并且工作队列达到限制，新提交的任务使用拒绝策略处理。可以自定义拒绝策略，拒绝策略需要实现RejectedExecutionHandler接口。  

JDK默认的拒绝策略有四种：

- AbortPolicy：丢弃任务并抛出RejectedExecutionException异常。
- DiscardPolicy：丢弃任务，但是不抛出异常。可能导致无法发现系统的异常状态。
- DiscardOldestPolicy：丢弃队列最前面的任务，然后重新提交被拒绝的任务。
- CallerRunsPolicy：由调用线程处理该任务。 

## 03、线程池的内置类型
java内置了线程池工具类，可以方便的创建不同类型的线程池，主要有下面四种：
```java
// 实例化一个单线程的线程池
ExecutorService singleExecutor = Executors.newSingleThreadExecutor();
// 创建固定线程个数的线程池
ExecutorService fixedExecutor = Executors.newFixedThreadPool(10);
// 创建一个可重用固定线程数的线程池
ExecutorService cachedExecutor = Executors.newCachedThreadPool();
// 创建一个周期性执行的线程池
ExecutorService cachedExecutor = Executors.newScheduledThreadPool();
 ```

但是在实际开发中并不推荐直接使用Executors来创建线程池，而是需要根据项目实际情况配置(线程池七大参数)适合自己项目的线程池。

## 04、线程池生命周期
线程池从创建到销毁会经历RUNNING、SHUTDOWN、STOP、TIDYING、TERMINATED五个生命周期状态。

- **RUNNING** 表示线程池处于运行状态，能够接受新提交的任务且能对已添加的任务进行处理。RUNNING状态是线程池的初始化状态，线程池一旦被创建就处于RUNNING状态。  


- **SHUTDOWN** 线程处于关闭状态，不接受新任务，但可以处理已添加的任务。RUNNING状态的线程池调用shutdown后会进入SHUTDOWN状态。


- **STOP** 线程池处于停止状态，不接收任务，不处理已添加的任务，且会中断正在执行任务的线程。RUNNING状态的线程池调用了shutdownNow后会进入STOP状态。


- **TIDYING** 当所有任务已终止，且任务数量为0时，线程池会进入TIDYING。当线程池处于SHUTDOWN状态时，阻塞队列中的任务被执行完了，且线程池中没有正在执行的任务了，状态会由SHUTDOWN变为TIDYING。当线程处于STOP状态时，线程池中没有正在执行的任务时则会由STOP变为TIDYING。


- **TERMINATED** 线程终止状态。处于TIDYING状态的线程执行terminated()后进入TERMINATED状态。
 

## 05、线程池的工作机制
<img src="http://cdn.gydblog.com/images/java/concurrent/threadpool-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 06、来个小总结
线程池的本质就是统一管理线程资源，使用了一个线程安全的工作队列连接工作者线程和客户端线程，客户端线程将任务放入工作队列后便返回，而工作者线程则不断地从工作队列上取出工作并执行。当工作队列为空时，所有的工作者线程均阻塞等待在工作队列上，当有客户端提交了一个任务之后会通知任意一个工作者线程，随着大量的任务被提交，更多的工作者线程会被唤醒。当唤醒的工作者线程达到数量限制时，又会有一些策略来进行线程的回收管理和任务的提交请求处理。

一个完善的线程池有七大核心参数：核心线程数、最大线程数、空闲线程存活时间、时间单位、线程工厂、拒绝策略、工作队列。


## 07、参考资料
https://blog.csdn.net/Anenan/article/details/115603481

