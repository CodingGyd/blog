---
# icon: lock
date: 2023-06-26

category:
  - Java
tag:
  - 并发编程
  - 原子操作
---
# 原子操作

原子(atomic)含义是不能被进一步分割的最小粒子，而原子操作表示不可被中断的一个或一组操作。在多处理器上实现
原子操作是很复杂的，一般是通过总线锁和缓存锁这两个机制来保证原子性。

在Java中是通过锁和循环CAS的方式来实现原子操作的。JDK1.5的juc并发包里提供了很多原子操作类，比如AtomicBoolean、AtomicInteger、AtomicLong等。这些原子操作类还提供了有用的工具方法，比如以原子的
方式自增1和自减1

## 代码实例
以下代码实现了一个基于CAS线程安全的原子计数器方法safeCount和一个非线程安全的计数器count方法：


```java
package com.gyd;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicDemo {

    private AtomicInteger atomicInteger = new AtomicInteger(0);
    private int i = 0;
    public static void main(String[] args)  {
        AtomicDemo atomicDemo = new AtomicDemo();
        List<Thread> allThread = new ArrayList<>(100);
        long start = System.currentTimeMillis();
        for(int i=1;i<=100;i++) {
            Thread t = new Thread(() ->{
                for (int j=0;j<1000;j++) {
                    atomicDemo.count();
                    atomicDemo.safeCount();
                }
            });
            allThread.add(t);
        }
        for (Thread t : allThread) {
            t.start();
        }

        //等待所有线程执行完成
        for (Thread t: allThread){
            try {
                t.join();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        System.out.println(atomicDemo.i);
        System.out.println(atomicDemo.atomicInteger.get());
        System.out.println(System.currentTimeMillis()-start);

    }

    private void count(){
        i++;
    }

    private void safeCount() {
        for (;;) {
            int a = atomicInteger.get();
            boolean suc = atomicInteger.compareAndSet(a,++a);
            if (suc) break;
        }

    }

}

```
上面代码模拟100个线程对成员变量进行自增操作， 只有safeCount才能保证并发安全。

## CAS操作
CAS（Compare and Swap）比较并交换，顾名思义：比较两个值，如果他们两者相等就把他们交换，CAS 也被认为是一种乐观锁。

java.util.concurrent.atomic 并发包下的所有原子类都是基于 CAS 来实现的。

- ABA问题  

- 性能问题  

- 只能保证一个共享变量的原子操作  
