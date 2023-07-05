---
# icon: lock
date: 2023-06-26

category:
  - Java
tag:
  - 并发编程
  - 锁
---
# 锁的那些事
## 锁的常见分类
<img src="/images/java/concurrent/lock-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 乐观锁和悲观锁

### 乐观锁 
乐观锁是指认为自己在使用数据时不会有别的线程来修改数据，所以不会添加锁。
在JAVA中是通过无锁编程来实现，只是在最后更新数据的时候才去判断之前有没有别的线程更新了这个数据，此时会出现两种判断：
- 如果这个数据没有被别的线程更新，则当前线程将自己修改的数据写入。
- 如果这个数据已经被别的线程更新，则当前线程可以选择放弃修改或者重新获取最新数据进行重新修改。

判断的规则常用如下方式：
- version版本号机制
- cas算法(java中atomic包中的递增操作就算通过CAS自旋实现的)


乐观锁适合读操作多的场景，不加锁能大大提高并发性能。

### 悲观锁

悲观锁认为自己使用数据时肯定会有别的线程也来竞争操作，在使用之前先加锁，确保数据不会被别的线程修改。  

在java中synchronized关键字和lock的api原理都是悲观锁。  

悲观锁适合写操作多的场景，性能相对乐观锁要差。

**synchronized**  
synchronized可以用于修饰实例方法、静态方法、代码块。当一个线程试图访问同步代码时必须首先获得锁，正常退出或者抛出异常时必须释放锁。  
[synchronized笔记](./synchronized.md)
 
这里提一下阿里开发手册中的几个用锁原则：  
- 尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用rpc方法或者耗时的io操作。
- 能锁代码块，就不要锁整个方法体；能用对象锁，就不要用类锁。


### 死锁

应用中多个线程需要以独占的方式访问同一个资源，当多个线程去并发访问资源时同一个时间段只能有一个线程占用该资源，另一个线程只能阻塞等待，如果两个线程永远都在等待对方释放独占的资源，则会永远阻塞不能执行，这种现象就叫死锁。

**源码示例**
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