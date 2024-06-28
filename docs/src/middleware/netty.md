---
# icon: lock
date: 2024-06-26
---

## Netty权威指南读书笔记

## 一、I/O基础概念

### **1、文件描述符**

对文件的读写操作会调用内核提供的系统命令，并返回一股file descriptor ，简称fd， 是一个数字，指向内核中的一个结构体（文件路径，数据区等一些属性）。 类似的，对一个socket的读写也会产生相应的描述符（socketfd）。

### **2、5种I/O模型**

UNIX网络编程提供的5种I/O模型：

#### 1）阻塞I/O模型：

最常用，默认情况所有文件操作都是阻塞的。

<img src="http://cdn.gydblog.com/images/middleware/netty-1.png" style="zoom:33%;" />

#### 2）非阻塞I/O模型

应用层不断轮询检查内核有无数据到来。

<img src="http://cdn.gydblog.com/images/middleware/netty-2.png" style="zoom:33%;" />

#### 3）I/O复用模型

Linux上提供了select/poll的系统调用，应用进程通过将一个或者多个fd传递给select或者poll，同时阻塞在select上，这样select/poll帮我们监听多个fd是否处于就绪状态。

select/poll通过顺序扫描fd是否就绪，且只支持有限个fd（默认配置是1024个），因此为了克服select的缺点，linux提供了一个epoll的系统调用，epoll的使用基于事件驱动方式代替顺序扫描，性能更高，且对fd没有数量限制，当检测到有fd就绪时，立即回调函数rollback。

这里总结一下epoll和select的区别：

- 支持一个进程打开的socket描述符（fd）数量不受限制（仅受限于操作系统的最大文件句柄数，在1GB内存的机器上大约是10万个句柄左右）
- I/O效率不会随着fd数量的增加而线性下降。（不同于select对全部集合的线性扫描，epoll只会多活跃的fd进行操作）
- 使用mmap加速了内核与用户空间的消息传递（epoll是通过内核和用户空间mmap同一块内存实现，避免了不必要的内存复制）
- epoll的API更加简单



<img src="http://cdn.gydblog.com/images/middleware/netty-3.png" style="zoom:33%;" />

#### 4）信号驱动I/O模型

通过系统调用sigaction执行一个信号处理函数（调用后立即返回进程继续工作，是非阻塞的调用）。当内核数据准备就绪时，就会为该进程生成一个SIGIO信号，通过信号回调通知应用程序调用recvfrom来读取数据，并通知主循环函数处理数据。

<img src="http://cdn.gydblog.com/images/middleware/netty-4.png" style="zoom:33%;" />

#### 5）异步I/O

告知内核启动某个操作，并让内核在整个操作完成后（包括将数据从内核复制到用户自己的缓冲区）通知我们。这种模型与信号驱动模型的主要区别是：信号驱动I/O由内核通知我们何时可以开始一个I/O操作；异步I/O模型由内核通知我们I/O操作何时已经完成。

<img src="http://cdn.gydblog.com/images/middleware/netty-5.png" style="zoom:33%;" />



## **二、NIO编程基本概念**

一般低负载、低并发的应用程序可以选择同步阻塞I/O（BIO），而对于高负载、高并发的应用，需要使用NIO的非阻塞模式。

### **1、缓冲区（Buffer）**

在NIO编程中，所有数据都是用Buffer处理的。在读取数据时，它是直接读到缓冲区中；在写入数据时，是写入到缓冲区中。任何时候访问NIO中的数据，都是通过缓冲区进行操作的。

Buffer是NIO类库中的一个对象，包含一些要写入或者要读出的数据。它实际上是一个数组，一般是一个字节数组（ByteBuffer）。它还有其它很多类型，例如针对每一种Java基本类型（除了Boolean）都对应有一种缓冲区，具体如下：

ByteBuffer：字节缓冲区（大多数标准I/O操作都使用它，它除了具有一般缓冲区的操作之外还提供一些特有操作，方便网络读写）

CharBuffer：字符缓冲区

ShortBuffer：短整型缓冲区

IntBuffer：整型缓冲区

LongBuffer：长整形缓冲区

FloatBuffer：浮点型缓冲区

DoubleBuffer：双精度浮点型缓冲区



### **2、通道（Channel）**

Channel就像自来水管一样，网络数据通过Channel读取和写入，Channel和流的不同支出在于它是全双工的，可以同时用于读写操作（而流只是在一个方向流动，必须是InputStream或者OutputStream的子类）。



### **3、多路复用器（Selector）**













