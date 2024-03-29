---
# icon: lock
date: 2023-02-10
category:
  - 面试手册
tag:
  - JAVA面试
---

# JAVA
> 本篇记录常见的JAVA相关面试题，持续更新。

## 一、集合框架

### 1、HashMap

HashMap主要由数组和链表组成，他不是线程安全的。核心的点就是put插入数据的过程，get查询数据以及扩容的方式。JDK1.7和1.8的主要区别在于头插和尾插方式的修改，头插容易导致HashMap链表死循环，并且1.8之后加入红黑树对性能有提升。

**线程安全问题**

- 多线程修改元素会出现不安全
在并发环境下，多个线程同时对HashMap进行修改操作，例如添加、删除、修改元素，可能会导致数据结构出现冲突，最终导致数据不一致或丢失
- 多线程并发扩容会出现不安全
HashMap在达到一定容量时需要进行扩容，扩容过程需要重新计算hash值、重新分配存储位置等操作。如果在扩容过程中有多个线程同时进行插入或删除操作，就可能导致数据结构混乱，死循环等问题。
- hash冲突会出现不安全
hashmap内部使用数组和链表(或红黑树)的数据结构来实现键值对的存储和查找，当多个线程同时进行插入或者删除操作时，可能导致链表或者红黑树的结构被破坏，从而导致数据丢失或者异常
- 线程之间的可见性不安全
  当一个线程对HashMap进行修改时，其它线程可能无法立即看到这些修改，就可能导致数据不一致问题。 因此可以使用ConcurretHashMap来替换使用，这个类使用了锁分段技术、cas、volatile变量等机制来保证线程安全和数据可见性  



**put插入数据流程**

往map插入元素的时候首先通过对key hash然后与数组长度-1进行与运算((n-1)&hash)，都是2的次幂所以等同于取模，但是位运算的效率更高。找到数组中的位置之后，如果数组中没有元素直接存入，反之则判断key是否相同，key相同就覆盖，否则就会插入到链表的尾部，如果链表的长度超过8，则会转换成红黑树，最后判断数组长度是否超过默认的长度*负载因子也就是12，超过则进行扩容。

##  

### 2、ConcurrentHashmap

ConcurrentHashmap在JDK1.7和1.8的版本改动比较大，1.7使用Segment+HashEntry分段锁的方式实现，1.8则抛弃了Segment，改为使用CAS+synchronized+Node实现，同样也加入了红黑树，避免链表过长导致性能的问题。

## 二、并发编程

### 1、说说Synchronized原理

先来说一下JAVA中的对象：在JVM中，对象在内存中存储的布局可以分为三个区域，分别是对象头、实例数据以及填充数据。在对象头的Mark Word中主要存储了对象自身的运行时数据，例如哈希码、GC分代年龄、锁状态、线程持有的锁、偏向线程ID以及偏向时间戳等。同时，Mark Word也记录了对象和锁有关的信息。

Synchronized是单机并发中重要的关键字，可以用来修饰代码块、实例方法、静态方法。synchronized其实是一个对象锁，锁的是对象，它的底层原理和对象头中的Mark Word区域有着密切联系。

- 当状态为偏向锁时，Mark Word存储了偏向线程的ID；
- 当状态为轻量级锁时，Mark Word存储了指向线程栈中Lock Record的指针；
- 当状态为重量级锁时，Mark Word存储了指向堆中的Monitor对象的指针

**重点说一下Monitor**。Monitor对象被称为管程或者监视器锁。在Java中，每一个对象实例都会关联一个Monitor对象。这个Monitor对象既可以与对象一起创建销毁，也可以在线程试图获取对象锁时自动生成。当这个Monitor对象被线程持有后，它便处于锁定状态。

在HotSpot虚拟机中，Monitor是由ObjectMonitor实现的,它是一个使用C++实现的类。

ObjectMonitor中有五个重要部分，分别为_ower,_WaitSet,_cxq,_EntryList和count。

- **_ower** 用来指向持有monitor的线程，它的初始值为NULL,表示当前没有任何线程持有monitor。当一个线程成功持有该锁之后会保存线程的ID标识，等到线程释放锁后_ower又会被重置为NULL;
- **_WaitSet** 调用了锁对象的wait方法后的线程会被加入到这个队列中；
- **_cxq**  是一个阻塞队列，线程被唤醒后根据决策判读是放入cxq还是EntryList;
- **_EntryList** 没有抢到锁的线程会被放到这个队列；
- **count** 用于记录线程获取锁的次数，成功获取到锁后count会加1，释放锁时count减1。



**锁升级过程描述**

我们来详细的看一下synchronized是怎么一步步进行锁升级的。

(1）当对象没有被当成锁时，这就是一个普通的对象，Mark Word记录对象的HashCode，锁标志位是01，是否偏向锁那一位是0;

(2）当对象被当做同步锁并有一个线程A抢到了锁时，锁标志位还是01，但是否偏向锁那一位改成1，前23bit记录抢到锁的线程id，表示进入偏向锁状态;

(3) 当线程A再次试图来获得锁时，JVM发现同步锁对象的标志位是01，是否偏向锁是1，也就是偏向状态，Mark Word中记录的线程id就是线程A自己的id，表示线程A已经获得了这个偏向锁，可以执行同步中的代码;

(4) 当线程B试图获得这个锁时，JVM发现同步锁处于偏向状态，但是Mark Word中的线程id记录的不是B，那么线程B会先用CAS操作试图获得锁，这里的获得锁操作是有可能成功的，因为线程A一般不会自动释放偏向锁。如果抢锁成功，就把Mark Word里的线程id改为线程B的id，代表线程B获得了这个偏向锁，可以执行同步代码。如果抢锁失败，则继续执行步骤5;

(5) 偏向锁状态抢锁失败，代表当前锁有一定的竞争，偏向锁将升级为轻量级锁。JVM会在当前线程的线程栈中开辟一块单独的空间，里面保存指向对象锁Mark Word的指针，同时在对象锁Mark Word中保存指向这片空间的指针。上述两个保存操作都是CAS操作，如果保存成功，代表线程抢到了同步锁，就把Mark Word中的锁标志位改成00，可以执行同步代码。如果保存失败，表示抢锁失败，竞争太激烈，继续执行步骤6;

(6) 轻量级锁抢锁失败，JVM会使用自旋锁，自旋锁不是一个锁状态，只是代表不断的重试，尝试抢锁。从JDK1.7开始，自旋锁默认启用，自旋次数由JVM决定。如果抢锁成功则执行同步代码，如果失败则继续执行步骤7;

(7) 自旋锁重试之后如果抢锁依然失败，同步锁会升级至重量级锁，锁标志位改为10。在这个状态下，未抢到锁的线程都会被阻塞。

 

### 2、说说Volatile原理

​	Volatile主要用来保证内存可见性和有序性的。关键概念：内存屏障、JMM内存模型、缓存一致性协议、CPU多级缓存





### 3、对ThreadLocal的理解



### 4、线程池原理







 
