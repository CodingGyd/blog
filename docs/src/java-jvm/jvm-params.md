---
# icon: lock
date: 2023-08-13
category:
  - JAVA
tag:
  - JVM
---

# JVM参数配置
![](http://cdn.gydblog.com/images/sucai/sc-1.jpg)

## 一、简介
JVM提供的参数非常多，熟悉常用JVM参数能够帮助我们更好的进行调优

本篇文章将总结JVM参数的分类，以及GC日志、运行时内存区、OOM、垃圾收集器相关的常用参数。

![JVM参数概览](http://cdn.gydblog.com/images/java/jvm/jvm-21.jpg)

## 二、常用JVM参数
JVM参数可以分为三种类型，分别是以-、-X、-XX开头的参数：

- -开头的参数比较稳定，后续版本基本不变，如-version  查看版本信息
- -X开头的参数比较稳定，后续版本可能改变，如-Xmx设置初始堆内存大小
- -XX开头的参数不稳定，后续版本会变动，如-XX:MetaspaceSize 设置元空间大小 

### 1、GC日志相关
通过GC日志能够分析JVM发生GC时各个数据区的情况

```
-XX:+PrintGC 或 -verbose:gc 输出简单GC日志信息
-XX:+PrintGCDeatils 输出详细GC日志信息
-XX:+PrintGCTimeStamps 和 -XX:+PrintGCDateStamps 则是在详细输出GC日志信息的基础上增加时间，前者输出程序运行时间，后者输出时间戳
-Xloggc:d:\gc.log 将GC信息输出到d:\gc.log文件
-XX:PrintHeapAtGC 每次GC前后打印堆信息等
```

### 2、运行时数据区相关
JVM有对各种运行时数据区（栈、堆、方法区、直接内存）的参数，常使用-XX命令，有些命令也可用-X来代替

**1）栈**
```
-XX:ThreadStackSize=100k 设置栈内存大小100k，可以使用 -Xss100k代替
```

注意：栈是线程私有的，设置太大且创建线程多的场景下，可能会内存不足导致OOM


**2）堆**
```
-XX:InitalHeapSize=100m 设置堆内存初始化为100m，可以使用 -Xms100m代替
-XX:MaxHeapSize=100m 设置最大堆内存为100m，可以使用 -Xmx100m代替  
-XX:SurvivorRatio=8 设置survivor:Eden占比为 1:1:8
-XX:NewRatio=2 设置年轻代:老年代占比为 1:2（观察GC日志，如果是因为年轻代空间不够导致频繁minor GC，可以适当调整年轻代与老年代比例）  
-XX:PretenureSizeThreadshold=2014 设置内存大于此值(byte)的对象作为大对象直接分配到老年代
-XX:MaxTenuringThreshold=15 对象年龄超过15进入老年代
-XX:+PrintTenuringDistribution JVM每次MinorGC后打印出当前使用的Survivor中对象的年龄
 
```

![](http://cdn.gydblog.com/images/sucai/sc-5.png)

**3）方法区(元空间)**
> 要回收元空间时只能触发FULL GC，频繁触发FULL GC也可能是元空间大小不够，运行时产生大量动态类可能导致元空间被占满从而抛出OOM，面对这两种情况可以适当调整元空间大小
```
-XX:MetaspaceSize 元空间初始大小
-XX:MaxMetasoaceSize 元空间最大大小
-XX:+UseCompressedOops 使用压缩对象指针
-XX:+UseCompressedClassPointers 使用压缩类执行
-XX:ComporessedClassSpaceSize 设置ClassMetaspace大小，默认1g
```

**4）直接内存**
```
-XX:MaxDiectMemorySize 设置直接内存大小，未指定则和最大堆内存一致
```

### 3、OOM相关  
```
-XX:+HeapDumpOutOfMemoryError 发生OOM时生成堆dump文件
-XX:+HeapDumpBeforeFullGC 发生FullGC时生成堆dump文件（OOM前会多次FullGC也就是可能多次生成dump文件）
-XX:HeapDumpPath=d:\指定生成堆dump文件路径为d:\ (默认生成的dump文件在项目当前目录下)
-XX:OnOutOfMemoryError=/opt/restart.sh  发生OOM时去执行/opt/restart.sh文件
```

### 4、垃圾收集器相关
**1）Serial 串行收集器**
```
-XX:+UseSerialGC 年轻代，老年代都使用串行收集器
```

**2）ParNew 并行收集器**
```
-XX:+UseParNewGC 年轻代使用ParNew收集器
```

JDK14 CMS被移除 没有老年代收集器配合 , 被废弃

**3）Parallel 吞吐量优先并行收集器**
```
-XX:+UseParallelGC 、-XX:+UseParallelOldGC 使用任意一个参数，新生代、老年代就会使用Parallel收集器
-XX:ParallelGCThreads 设置年轻代并行收集线程数 （CPU数 < 8 设置与核心数相同；CPU数 > 8 设置线程数 = 3 + (5 * 核心数) / 8）
-XX:+UseAdaptiveSizePolicy 自适应调节策略
-XX:MaxGCPauseMillis 设置最大STW时间，单位ms（Parallel 主打高吞吐量优先，该参数具体值最好由-XX:+UseAdaptiveSizePolicy来分配）
-XX:GCTimeRatio=N 垃圾收集时间占比(1/N+1) 用于衡量吞吐量，该值设置越大就与设置最大STW时间-XX:MaxGCPauseMillis 矛盾，不能同时使用
```

**4）CMS 并发收集器**
```
-XX:+UseConcMarkSweepGC 老年代使用CMS垃圾收集器，新生代使用ParNew收集器
-XX:CMSInitiatingOccupancyFraction设置老年代使用多少空间时开始垃圾回收(如果设置的太高，不够内存分配不能满足并发执行，就会冻结用户线程启动Serial Old收集器，停顿时间就会变长（如果内存增长缓慢可以设置高一些，如果内存增长很快就要设置低一些 默认92%）)
-XX:+UseCMSCompactAtFullCollection指定在FULL GC后是否对内存进行压缩整理
-XX:CMSFullGCsBeforeCompaction设置执行多少次FULL GC后进行内存压缩整理（需要和参数UseCMSCompactAtFullCollection配合使用）
-XX:ParallelCMSThreads 设置CMS线程数量
```

**5）G1 低延迟分代收集器**
```
-XX:+UseG1GC 使用G1收集器
-XX:G1HeapRegionSize设置每个region大小
-XX:MaxGCPauseMillis设置预期停顿时间 （默认200ms，最好不要太小）
-XX:ParallelGCThread设置STW时GC线程数
-XX:ConcGCThreads设置并发标记线程数
-XX:InitiatingHeapOccupancyPercent设置触发老年代GC的堆占用率阈值
```

使用G1时最好不要使用-XX:NewRatio 、-Xmn，会影响G1自动调节


## 三、参考资料
原文：https://juejin.cn/post/7202996870250987575
整理：代码小郭
