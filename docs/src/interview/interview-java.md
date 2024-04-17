---
title: JAVA基础面试题
shortTitle: JAVA基础面试题
date: 2023-10-26
category:
  - 面试手册
description: 收集JAVA基础的常见面试题
head:
  - - meta
    - name: keywords
      content: JAVA基础,面试
---


> 本篇收集了常见的JAVA基础相关面试题。

## 一、集合框架

### 1、HashMap

<font color="red">1）考点1：数据结构</font>    <br/>

<font color="green">答案：</font>

1. 基本结构：jdk1.8前数据结构是：链表 + 数组  jdk1.8之后是 ：链表 + 数组  + 红黑树
2. 何时转换：链表长度阈值(边界值) > 8 并且数组长度大于64，才将链表转换为红黑树，变为红黑树的目的是为了高效的查询。

<font color="red">2）考点2：扩容机制</font> <br/>

<font color="green">答案：</font>

1. 何时扩容：当数组元素大于数组长度*负载因子的值时会扩容。例如默认情况下负载因子是0.75，数组长度是16，当数组中的元素超过0.75**16=12个时，会触发扩容机制。
2. 如何扩容：在进行扩容时使用 resize() 方法申请一个容量是原先数组2倍的新数组，**计算 table 数组的新容量和 Node 在新数组中的新位置**，将旧数组中的值复制到新数组中，从而实现自动扩容，而这是一个非常耗性能的操作，所以如果我们已经预知HashMap中元素的个数，那么初始化时指定数组大小而不是使用默认值16，这能够有效的提高HashMap的性能。

<font color="red">3）考点3：put流程</font> <br/>

<font color="green">答案：</font>

![](http://cdn.gydblog.com/images/java/collections/hashmap-3.png)

重点要回答出下面三个要点：

- 何时扩容
- 何时触发红黑树和链表的转换
- JDK1.7和1.8对于链表插入方式的修改：头插容易导致HashMap链表死循环，1.8改为了尾插法。

<font color="red">4）考点4：get流程</font> <br/>

<font color="green">答案：</font>

- 获取元素在数组中的位置：根据key计算hash值，然后通过hash值&（数组长度-1）的方式获取到key在数组中的位置。
- 判断当前数组位置上的元素是否为空且位置上的第一个结点对象hash值和要查找的一致，若一致则返回对应的value，否则继续查找该结点的下一个结点（链表遍历或者红黑树遍历），直到找到为止



### 2、ConcurrentHashmap

<font color="red">考点1：底层数据结构</font> <br/>

<font color="green">答案：</font>

ConcurrentHashmap在JDK1.7和1.8的版本改动差异比较大，1.7使用Segment+HashEntry分段锁的方式实现，1.8则抛弃了Segment，改为使用CAS+synchronized+Node实现，同样也加入了红黑树，避免链表过长导致性能的问题。



## 二、并发编程

### 1、关键字

<font color="red">考点1：谈谈对Synchronized的理解</font> <br/>

<font color="green">答案：</font>

> 主要从基本概念、使用场景、底层原理这三个方面进行回答即可

基本概念：JVM关键字，是一种对象锁。jdk1.6前后的区别（锁升级过程：无锁、偏向锁、轻量级锁、自旋、重量级锁）。
使用场景：同步代码块、同步实例方法、同步静态方法
底层原理：涉及对象头的基本构成（markword区、实例数据区、对齐填充区），以及monitor对象。用javap命令查看生成的字节码文件能看到其中的同步标记:ACC_SYNCHRONIZED、ACC_PUBLIC

<font color="red">考点2：谈谈对Volatile的理解</font> <br/>

<font color="green">答案：</font>

底层原理：先讲JMM内存模型，然后引出Volatile的作用，重点说出关键概念：可见性、有序性、内存读屏障、内存写屏障、缓存一致性协议、CPU多级缓存。其中有序性可以展开举例：一个对象实例的创建过程。

应用场景举例：比如在多线程中通过定义一股Volatile变量来通知其它线程触发某些业务操作。

### 2、线程池

<font color="red">考点1：讲讲线程池的参数有哪些</font> <br/>

<font color="green">答案：</font>

主要有七个参数：

- int corePoolSize：核心线程数
- int maximumPoolSize：最大线程数：
- BlockingQueue workQueue：队列：
- ThreadFactory threadFactory：线程工厂：
- long keepAliveTime：空闲线程存活时间
- TimeUnit unit：时间单位
- RejectedExecutionHandler handler：拒绝策略

<font color="red">考点2：讲讲线程池的处理流程</font> <br/>

<font color="green">答案：</font>

> 重点是从提交一个task开始，把七大参数在流程中发挥的作用进行串联说明

![](http://cdn.gydblog.com/images/java/concurrent/threadpool-1.jpg)

<font color="red">考点3：讲讲线程池的生命周期</font> <br/>

<font color="green">答案：</font>

- RUNNING：该状态是线程池的初始化状态，表示线程池处于运行状态。
- SHUTDOWN：表示线程池处于停止状态，不再接收新任务，但是会等待已经在运行中的线程正常执行完成。RUNNING状态时调用shutdown()会进入该状态
- STOP：表示线程池处于停止状态，不再接收新任务，同时会中断当前正在运行的任务线程。RUNNING状态时调用shutdownnow()会进入该状态
- TIDYING：当所有任务已终止，且任务数量为0时，线程池会进入TIDYING
- TERMINTED：处于TIDYING状态的线程执行terminated()后进入TERMINATED状态



### 3、线程

<font color="red">考点1：讲讲线程的生命周期</font> <br/>

<font color="green">答案：</font>

- NEW：新建状态 
- RUNNABLE：就绪状态
- RUNNING：运行状态
- BLOCKED：阻塞状态
- WAITING：等待状态
- TIMED_WAITING：超时等待状态
- TERMINATED：终止状态

![](http://cdn.gydblog.com/images/java/concurrent/thread-1.jpg)

<font color="red">考点2：线程之间如何通信？</font> <br/>

<font color="green">答案：</font>

1）线程之间的中断判断

- 通过volatile机制
- AtomicBoolean
- interrupt()和isInterrupted()

2）线程之间的等待和唤醒

- wait()和notify()
- Condition中的await()和signal()
- LockSupport中的park()和unpark()

<font color="red">考点3：常用API有哪些</font> <br/>

<font color="green">答案：</font>

- FutureTask
- CompletableFuture
- Runnable和Callable



<font color="red">考点4：谈谈对ThreadLocal的理解</font> <br/>

<font color="green">答案：</font>

底层原理：Thread源码中定义了ThreadLocalMap，是一个Map，Map的key就是ThreadLocal变量，value是指向的值。get和set操作是对这个map的操作。

应用场景举例：session、用户信息、不同层之间变量值的优雅获取

存在的问题：弱应用强引用的内存泄漏问题  （map中的key是弱引用，value是强引用，key回收之后，在线程销毁之前，value可能还是存在，需要我们使用完后主动调用ThreadLocal.remove方法进行释放）

## 三、JVM

### 1、代码编译

<font color="red">考点：谈谈JAVA代码编译过程</font> <br/>

<font color="green">答案：</font>

开发者编写好的java代码在完整的JDK架构下，编译运行过程如下（图片来源于网络）：

![success](https://gydblog.fsh.bcebos.com/images/mianshi/java/java-ms-1.png)

如上图所示：通过JDK中的javac命令，将java源代码编译成class文件，然后将这个class文件放到JVM中运行得到最终结果。

**我们把java源码到class文件的过程称之为编译阶段，把class文件到JVM中运行得到结果的阶段称为运行阶段**

### 2、JAVA内存模型

<font color="red">考点：谈谈对JVM内存模型的理解</font> <br/>

<font color="green">答案：</font>

- 堆：是JVM中内存分配最大的一块区域，被分为为新生代、老年代、元空间(1.8以前叫方法区或者永久代)
- 虚拟机栈：描述的是Java方法执行的内存模型。每个方法执行的同时会创建一个栈帧，该方法从调用开始至执行结束的过程，都对应着一个栈帧在虚拟机栈里面从入栈到出栈的过程。虚拟机栈的生命周期与线程相同，会在栈深度溢出或者栈扩展失败时分别抛出StackOverflowError和OutOfMemoryError异常。
- 本地方法栈：作用与虚拟机栈类似，也会抛出相同的异常。区别是本地方法栈是为虚拟机使用到的本地方法服务。
- 程序计数器：是JVM中一块很小的内存空间，几乎可以忽略不计，是运行速度最快的存储区域，也是唯一一个在java虚拟机规范中没有被规定任何OutOfMemoryError(OOM)情况的区域。是线程私有的，生命周期与线程相同。
- 执行引擎：是 Java 虚拟机核心的组成部分之一，它的任务就是将字节码指令解释/编译为对应平台上的本地机器指令。
- 本地库接口：调用本地方法库(Native Libary)的接口（Java调用非Java代码
- 元空间：在1.8以前是在堆中分配叫永久代，1.8以后移动到了堆外叫元空间，主要是为了防止OOM。

![](http://cdn.gydblog.com/images/java/jvm/jvm-2.jpg)

### 3、双亲委派模型

<font color="red">考点1：什么是双亲委派模型?</font> <br/>

<font color="green">答案：</font>

如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成。 每一个层次的类加载器都是如此，因此所有的加载请求最终都应该传送到最顶层的启动类加载器中。只有当上一层类加载器反馈自己无法完成这个加载请求（它的搜索范围中没有找到这个类）时，下一层类加载器才会尝试自己去加载。

<font color="red">考点2：双亲委派模型的实际应用</font> <br/>

<font color="green">答案：</font>

双亲委派模型这种技术思想在许多框架中都被用到，比如以 Apache Tomcat 来说，容器不希望它下面的webapps之间能互相访问到，每个 Web 应用都有一个对应的类加载器实例。

<font color="red">考点3：双亲委派模型可以被打破吗?</font> <br/>

<font color="green">答案：</font>

双亲委派模型可以被打破，需要自定义类加载器，继承ClassLoader类，重写LoadClass方法。

### 4、垃圾回收机制

<font color="red">考点1：谈谈你对垃圾回收机制的理解</font> <br/>

<font color="green">答案：</font>垃圾回收机制指的就是对象的内存回收机制(回收目标、回收策略)，这种回收是不需要程序员主动操作的，由虚拟机在后台完成。通过可达性分析、引用计数法等方式来判断某个对象是否可以被回收。



<font color="red">考点2：有哪些常用的垃圾回收算法</font> <br/>

<font color="green">答案：</font>

- 标记清除算法：是最开始时采用的垃圾回收算法，也是最简单最基础的垃圾处理算法，会造成内存碎片问题。

- 复制算法：将整个堆内存按容量划分为大小相等的两块，每次实际只使用其中的一块。当这一块的内存用完了，就将还存活着的对象复制到另外一块上面，然后再把已使用过的内存空间一次性清理掉。该算法解决了标记清除算法的内存碎片问题，但是将可用内存缩小到了原先的一半。

- 标记整理算法：复制算法主要用于回收新生代的对象，但是这个算法并不适用于老年代，因为老年代的对象存活率都比较高。

  该算法的标记过程仍然与“标记-清除”算法一样，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。

- 分代收集算法：JVM将堆划分了不同的区域：新生代、老年代、永久代，每个区域的对象生命周期是不一样的。分代收集算法，其实就是针对不同生命周期的对象采用不同的垃圾回收算法进行回收

<font color="red">考点2：有哪些常用的垃圾收集器</font> <br/>

<font color="green">答案：</font>

- Serial 收集器：串行收集器，有Serial和Serial Old。会造成STW现象（ Stop-the-world）
- ParNew 收集器：并行收集器，采用多个 GC 线程并行收集，在多处理器环境下工作的并行收集器能够极大地缩短 STW时间。ParNew 是针对新生代的垃圾回收器，采用“复制”算法，可以看成是 Serial 的多线程版本。
- CMS收集器：CMS（Concurrent Mark Swee）收集器是一种以获取最短回收停顿时间为目标的收集器。仅作用于老年代的收集，采用“标记-清除”算法，它的运作过程分为 4 个步骤（初始标记》并发标记》重新标记》并发清除）。问题是会带来很多内存碎片
- G1 收集器：在堆的结构设计时，G1 打破了以往将收集范围固定在新生代或老年代的模式，G1 将堆分成许多相同大小的区域单元，每个单元称为 Region，Region 是一块地址连续的内存空间，G1是针对Region进行内存的回收管理，运作过程也分为4个步骤（初始标记》并发标记》最终标记》筛选回收），它解决了CMS的内存碎片问题。



### 5、线上调优和故障排查的经历

先排查最近是否有上线代码，检查代码问题

上机器看看内存、cpu占用情况，比如cpu占用过高，那就通过top 找出问题线程最终定位到代码。

查看mingc和fullgc的频率和效果，用jstat查看堆中的情况，用jmap查看最近数量最大的对象的情况，然后可以用jmap将dump文件导出来快照，最后用eclipse的mat插件或者jdk自带的jvisualvm插件进行分析。

## 四、IO

<font color="red">考点1：IO多路复用</font> <br/>

<font color="green">答案：</font>

大白话总结一下。

一切的开始，都起源于这个 read 函数是操作系统提供的，而且是阻塞的，我们叫它 **阻塞 IO**。

为了破这个局，程序员在用户态通过多线程来防止主线程卡死。

后来操作系统发现这个需求比较大，于是在操作系统层面提供了非阻塞的 read 函数，这样程序员就可以在一个线程内完成多个文件描述符的读取，这就是 **非阻塞 IO**。

但多个文件描述符的读取就需要遍历，当高并发场景越来越多时，用户态遍历的文件描述符也越来越多，相当于在 while 循环里进行了越来越多的系统调用。

后来操作系统又发现这个场景需求量较大，于是又在操作系统层面提供了这样的遍历文件描述符的机制，这就是 **IO 多路复用**。

多路复用有三个函数，最开始是 select，然后又发明了 poll 解决了 select 文件描述符的限制，然后又发明了 epoll 解决 select 的三个不足。

------

所以，IO 模型的演进，其实就是时代的变化，倒逼着操作系统将更多的功能加到自己的内核而已。
