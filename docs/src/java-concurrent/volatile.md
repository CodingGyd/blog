---
# icon: lock
date: 2023-07-03

category:
  - JAVA基础
tag:
  - volatile
---
# volatile关键字
## 一、简介
volatitle经常被用到并发编程的场景中。它的作用有两个，即：

- 保证可见性；
- 保证有序性。  

但是，要注意volatile关键字并不能保证原子性。

<img src="http://cdn.gydblog.com/images/sucai/sc-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 二、如何保证可见性
由于每个线程都有自己的工作空间，导致多线程的场景下会出现缓存不一致性的问题。即，当两个线程共用一个共享变量时，如果其中一个线程修改了这个共享变量的值。但是由于另外一个线程在自己的工作内存中已经保留了一份该共享变量的副本，因此它无法感知该变量的值已经被修改。volatile可以解决这个问题。

先看一个没有使用volatile时的问题：
```java
package com.gyd;

public class VolatileDemo1 {
    private static boolean flag = false;

    public static class PhoneThread extends Thread {
        @Override
        public void run() {
            System.out.println("PhoneThread is running...");
            while (!flag) ; // 如果flag为false，则死循环
            System.out.println("PhoneThread is end");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        new PhoneThread().start();
        Thread.sleep(1000);
        flag = true;
        System.out.println("flag = " + flag);
        Thread.sleep(5000);
        System.out.println("main thread is end.");
    }
}

```
上面代码运行输出预期是：
```java
PhoneThread is running...
PhoneThread is end
flag = true
main thread is end.
```

实际是：
```java
PhoneThread is running...
flag = true
main thread is end.
```

上面代码涉及一个PhoneThread线程和Main线程，每个线程都有自己的一个工作内存副本，各自有flag的一个变量副本。当Main线程中修改了flag值时，只影响了Main线程中的工作副本，而PhoneThread的工作副本依旧是旧的值。


那么接下来我们将成员变量flag使用volatile关键字修饰后，再运行看打印日志：

```java

```

输出结果符合预期：
```java
PhoneThread is running...
PhoneThread is end
flag = true
main thread is end.
```
可见，当在主线程中修改了flag为true后，PhoneThread线程立即感知了flag的变化，并结束了死循环。  

从上面例子中也可以看见volatile确实能有效的保证多个线程共享变量的可见性！

## 三、如何保证有序性
编译器为了优化程序性能，可能会在编译时对字节码指令进行重排序。重排序后的指令在单线程中运行时没有问题的，但是如果在多线程环境中，重排序后的代码则可能会出现问题。因此，一般在多线程并发情况下我们都应该禁止指令重排序的优化。而volatile关键字就可以禁止编译器对字节码进行重排序。

双重锁校验就是一个典型例子，在单例模式下需要使用volatile关键字来禁止指令重排序。我们来看下代码：
```java
package com.gyd;

public class VolatileDemo3 {

    private volatile static VolatileDemo3 instance;

    private VolatileDemo3(){}

    public static VolatileDemo3 getInstance(){

        //第一次检测
        if (instance==null){
            //同步
            synchronized (VolatileDemo3.class){
                if (instance == null){
                    //多线程环境下可能会出现问题的地方
                    instance = new VolatileDemo3();
                }
            }
        }
        return instance;
    }
}
```
 如果上述代码中没有给instance加上volatile关键字会怎么呢？我们不妨来分析一下，首先我们应该清楚instance = new VolatileDemo3();这一操作并不是一个原子操作，实例化对象的字节指令可以分为三步，如下：  

1.分配对象内存：memory = allocate();  
2.初始化对象：instance(memory);  
3.instance指向刚分配的内存地址：instance = memory;  

而由于编译器的指令重排序，以上指令可能会出现以下顺序：  

1.分配对象内存：memory = allocate();  
2.instance指向刚分配的内存地址：instance = memory;  
3.初始化对象：instance(memory);  
 
以优化后的字节码指令来看双重锁校验的代码是否有问题呢？不难发现，如果线程1第一次调用单例方法，在该线程的时间片轮转结束后执行到了优化后的第二个指令，即instance被赋值，但是还未被分配初始化对象。此时，线程2抢到了CPU时间片，同时调用了getInstance方法，第一次校验就发现instance不为null，遂将其返回。在得到这个单例后调用单例的方法，此时必定出现空指针异常。  

因此，可见指令重排序在多线程并发的情况下是会出现问题的。此时，我们便可以通过volatile关键字来禁止编译器的优化，从而避免空指针的出现。
 
## 四、原理
Java 定义一个volatile修饰的变量:
```java
volatile instance = new Singleton(); // instance 是 volatile 变量
```
转变成汇编代码，如下：
```java
0x01a3de1d: movb $0×0,0×1104800(%esi);
x01a3de24: lock addl $0×0,(%esp)
```
可以看到除了第一行汇编以外，还额外多了第二行lock汇编指令。只要有 volatile 变量修饰的共享变量进行写操作的时候就会多出第二行汇编指令lock。  

有lock标记的指令在多核处理器下会引发如下两件事情：
- 将处理器中的变量缓存值写入系统内存
- 其它处理器的缓存中该变量值会失效，强制从系统内存中读取变量最新的值

由于cpu的处理速度和内存处理速度不一致，在计算机架构设计中，大佬们专门在cpu和内存之间增加了一层内部缓存(L1，L2或其它)。cpu读写操作都是先和缓存层进行交互，最终通过一些机制刷回系统内存中。

<img src="http://cdn.gydblog.com/images/sucai/sc-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


jmm内存模型就是这种方式：
<img src="http://cdn.gydblog.com/images/java/concurrent/jmm.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
JMM可以简单的理解为线程访问共享变量的方式。可见JMM是Java并发编程的底层基础，想要深入了解并发编程，就需要先理解JMM。  

JMM规定所有变量都存储在主内存中，每条线程还有自己的工作内存。线程的工作内存中保存了被线程使用的变量的主内存副本，线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存中的数据。不同线程之间也无法直接访问对方的工作内存中的变量，线程间变量值的传递需要通过主内存来完成。 也就是说Java线程之间的通信采用的是共享内存。

然而这种缓存架构在多处理器并发场景下会引发缓存一致性的问题：每个处理器对同一个变量都有一份自己的副本在自己的缓存中，当某个处理器对变量进行了修改，其它处理器从自己缓存中拿到的还是该变量的旧值。

在多处理器下，为了保证各个处理器的缓存是一致的，就会实现缓存一致性协议，每个处理器通过嗅探在总线上传播的数据来检查自己缓存的值是不是过期了，当处理器发现自己缓存行对应的内存地址被修改，就会将当前处理器的缓存行设置成无效状态，当处理器对这个数据进行修改操作的时候，会重新从系统内存中把数据读到处理器缓存里。这就是volatile的效果！

## 五、参考资料
[这一次，彻底搞懂Java内存模型与volatile关键字](https://juejin.cn/post/6967739352784830494 "这一次，彻底搞懂Java内存模型与volatile关键字")  
