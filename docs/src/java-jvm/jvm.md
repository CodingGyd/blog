---
# icon: lock
date: 2023-08-10
category:
  - JAVA
tag:
  - JVM
---

# JVM入门，看这一篇就够了！
## 一、什么是JVM？
JVM(Java Virtual Machine,Java虚拟机），是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机平台(操作系统)上仿真模拟各种计算机功能来实现的。引入Java语言虚拟机后，Java语言在不同平台上运行时不需要重新编译。  

Java语言使用Java虚拟机屏蔽了与具体平台相关的信息，使得Java语言编译程序只需生成在Java虚拟机上运行的目标代码（字节码class文件），就可以在多种平台上不加修改地运行。Java虚拟机在执行字节码时，把字节码解释成具体平台上的机器指令执行。这就是Java能够“一次编译，到处运行”的原因。  

![JVM的平台定位](http://cdn.gydblog.com/images/java/jvm/jvm-1.jpg)

## 二、JVM的基础概念
### 1、JVM内存布局总览
![JVM内存布局总览](http://cdn.gydblog.com/images/java/jvm/jvm-2.jpg)

### 2、堆(Heap)
![堆内存结构](http://cdn.gydblog.com/images/java/jvm/jvm-4.jpg)

堆是JVM中内存分配最大的一块区域，被分为新生代、老年代、元空间(1.8以前叫方法区或者永久代)：  

- 新生代
新生代区域是类和对象的创建、成长、销毁的主要区域，又被细分为Eden区和两个幸存区(S0和S1)，eden和幸存区的默认比例是8:1:1，所有的类对象都是在Eden区被new出来的。
当Eden区的空间用完但程序又需要创建对象，JVM的垃圾回收器将对Eden区进行垃圾回收，将其中不再被其他对象所引用的对象进行销毁(涉及到一些判断算法如可达性分析、引用计数等)，然后将Eden中的剩余对象移动到幸存0区。
若幸存0区也满了，则启动垃圾回收算法对该区进行垃圾回收，然后移动到幸存1区。如果幸存1区也满了再移动到老年代区。

新生代采用的内存回收方式是轻GC（YoungGC）。
- 老年代
老年代中存放的对象是存活了很久的，年龄大于15的对象。在老年代触发的gc叫major gc，也叫full gc。full gc会包含年轻代的gc，但老年代只要执行gc就一定是full gc。  

full gc采用的是标记-清除算法，会产生内存碎片。在执行full gc的情况下，会阻塞程序的正常运行，也就是STW现象(Stop The World)。  

老年代的gc比年轻代的gc效率上慢10倍以上，对应用程序运行效率有很大的影响。

- 元空间  
介绍元空间之前先说一下永久代：永久代是hotspot虚拟机特有的概念，他不属于堆内存，是方法区的一种实现，各大厂商对方法区有各自的实现。永久代存放jvm运行时需要的类，包含java库的类和方法，在触发full gc的情况下，永久代也会被进行垃圾回收。永久代的内存溢出也就是 pergen space。  

元空间是metaspace，在jdk1.8的时候，jvm移除了永久代的概念，元空间也是对java虚拟机的方法区的一种实现。元空间与永久代最大的区别在于，元空间不在虚拟机中，使用本地内存。通过配置如下参数可以更改元空间的大小。
-XX:MetaspaceSize：初始空间的大小。达到该值就会触发垃圾收集进行类型卸载，同时GC会对该值进行调整：如果释放了大量的空间，就适当降低该值；如果释放了很少的空间，那么在不超过MaxMetaspaceSize时，适当提高该值。
-XX:MaxMetaspaceSize，最大空间，默认是没有限制的。
永久代的回收会随着full gc进行移动，消耗性能。每种类型的垃圾回收都需要特殊处理元数据。将元数据剥离出来，简化了垃圾收集，提高了效率。

--- 


初学者可能会奇怪，为啥堆中还细分了这么多内存区域？新生代空间要划分这么细？

其实如果我们了解了JVM的垃圾收集机制，就会佩服JVM的研发设计人员了。  

首先，堆中划分了新生代和老年代是为了垃圾回收效率更快：新生代中的对象存活期一般不长，存在的对象是死亡非常快的，存在朝生夕死的情况。而老年代中的对象存活期较长，所以当垃圾回收器回收内存时，新生代中垃圾回收效果较好，会回收大量的内存，而老年代中回收效果较差，内存回收不会太多。 

其次，基于对象生命存活期性质的不同，新生代区域中一般采用复制算法，因为存活下来的对象是少数，所需要复制的对象少，而老年代对象存活多，不适合采用复制算法，一般是标记整理和标记清除算法。(针对每个算法的介绍本篇暂不涉及，后续会出一篇专门的文章来说明)。  

因为采用的复制算法需要留出一块单独的内存空间来以备垃圾回收时复制对象使用，所以将新生代分为eden区和两个survivor区(S0和S1)，每次使用eden和一个survivor区，另一个survivor作为备用的对象复制内存区。
![](http://cdn.gydblog.com/images/java/jvm/jvm-5.png)


--- 

一个JVM实例只存在一个堆内存空间，堆的大小可以固定，也可以扩大和缩小，JVM支持通过下面的配置项，动态调整堆中不同内存区域内存分配比例：

- JVM运行时堆的大小：　　-Xms堆的最小值　　-Xmx堆空间的最大值
- 新生代堆空间大小调整：　　-XX:NewSize新生代的最小值　　-XX:MaxNewSize新生代的最大值　　
-XX:NewRatio设置新生代与老年代在堆空间的大小　　-XX:SurvivorRatio新生代中Eden所占区域的大小

- 永久代大小调整：　　-XX:MaxPermSize
- 其他：　  -XX:MaxTenuringThreshold,设置将新生代对象转到老年代时需要经过多少次垃圾回收，但是仍然没有被回收

堆的内存不需要是连续空间，其内存是没有限制的，但是会受限于机器内存配置，如果超过机器最大内存限制，会抛出异常：
```
java.lang.OutOfMemoryError: Java heap space
```

### 3、虚拟机栈(VM Stack)  
Java虚拟机栈描述的是Java方法执行的内存模型：每个方法执行的同时会创建一个栈帧，该方法从调用开始至执行结束的过程，都对应着一个栈帧在虚拟机栈里面从入栈到出栈的过程。  
Java虚拟机栈也是线程私有的，它的生命周期与线程相同（随线程而生，随线程而灭）。  
> 栈是一种先进后出的数据结构，所以Java虚拟机栈他只会先处理位于栈顶的栈帧，而位于栈底的栈帧(也就是最先入栈的栈帧)只会等待其上面的栈帧处理完毕了才会被处理。
Java虚拟机栈内部划分了几个部分：
- 局部变量表
- 操作数栈
- 动态连接
- 方法出口(返回地址)
![虚拟机栈内部划分](http://cdn.gydblog.com/images/java/jvm/jvm-6.png)

对于我们来说，主要关注的stack栈内存，就是虚拟机栈中局部变量表部分。

虚拟机栈中的异常：  
```
1）如果线程请求的栈深度大于虚拟机所允许的深度，将抛出StackOverflowError异常；
2）如果虚拟机栈可以动态扩展，如果扩展时无法申请到足够的内存，就会抛出OutOfMemoryError异常
（当前大部分JVM都可以动态扩展，只不过JVM规范也允许固定长度的虚拟机栈）
```

### 4、本地方法栈(Native Method Stack)
本地方法栈和java虚拟机栈所发挥的作用是非常相似的，其区别就是
```
1）java虚拟机栈为虚拟机执行Java方法（也就是字节码）服务
2）本地方法栈则是为虚拟机使用到的本地方法服务
```
与虚拟机栈一样，本地方法栈也会在栈深度溢出或者栈扩展失败时分别抛出StackOverflowError和OutOfMemoryError异常。


### 5、程序计数器(Program Counter Register)
程序计数器是JVM中一块很小的内存空间，几乎可以忽略不计，是运行速度最快的存储区域，也是唯一一个在java虚拟机规范中没有被规定任何OutOfMemoryError(OOM)情况的区域。

在JVM规范中，每个线程都有它的程序计数器，是线程私有的，生命周期与线程的生命周期保持一致。

程序计数器会存储当前线程正在执行的Java方法JVM指令地址，如果是执行native方法，则是未指定值（undefined）。

程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。
字节码解释器工作时是通过改变这个程序计数器的值来读取下一条需要执行的字节码指令。
 

### 6、执行引擎(Execution Engine)
执行引擎（Execution Engine) 是 Java 虚拟机核心的组成部分之一，它的任务就是将字节码指令解释/编译为对应平台上的本地机器指令。简单来说，JVM 中的执行引擎充当了将高级语言翻译为机器语言的译者。

Java 字节码的执行是由 JVM 执行引擎来完成，流程图如下所示：  

![字节码的执行](http://cdn.gydblog.com/images/java/jvm/jvm-6.png)

### 7、本地库接口(Native Interface)

### 8、本地方法库(Native Libary)
首先说明什么是本地方法：简单地讲，一个Native Method就 是一个Java调用非Java代码的接口。 在定义一个native method时，并不提供实现体(有些像定义一个Javainterface)，因为其实现体是由非java语言在外面实现的。
```java
public class MyNatives {
    public native void Native1(int x);

    native static public long Native2();

    native synchronized private float Native3(Object o);

}
```

本地方法库就是本地方法的集合。

### 9、类加载器
开发人员核心工作是创造源代码。在java中源代码文件的格式是xxx.java，编写好的源代码文件经过编译器(如IDEA、eclipse)调用javac编译后会生成对应的xxx.class文件，类加载器会负责将xxx.class文件加载到内存中，只要xxx.class文件结构符合格式要求即可，类加载器不负责运行，运行是由执行引擎Execution Engine来实现的。  

一句话概括：我们所讲的类加载器classLoader,就是负责把JAVA源代码编译后的.class文件 ，加载到JVM虚拟机内存中，并生成 java.lang.Class类的一个实例。  

先来看一段源码：
```java
public class ClassLoaderTest {
    public static void main(String[] args) {
        ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
        System.out.println(classLoader);//应用程序类加载器

        ClassLoader classLoader1 = classLoader.getParent();
        System.out.println(classLoader1);//扩展类加载器

        ClassLoader classLoader2 = classLoader1.getParent();
        System.out.println(classLoader2);//启动类加载器
    }
}
```

运行结果：
```
sun.misc.Launcher$AppClassLoader@18b4aac2
sun.misc.Launcher$ExtClassLoader@677327b6
null
```
上述示例代码按层次关系输出了对应的类加载器对象信息，但是扩展类加载器ExtClassLoader的parent加载器为啥是null而不是一个启动类加载器Bootstrap ClassLoader么？   

其实，是因为Bootstrap ClassLoader是由C/C++编写的，它本身是虚拟机的一部分，所以它并不是一个JAVA类，也就是无法在java代码中获取它的引用 ，JVM启动时通过Bootstrap类加载器加载rt.jar等核心jar包中的class文件，比如int.class,String.class都是由它加载。  

类加载器通过树状方式组织起来，形成树状结构。树的根节点就是Bootstrap ClassLoader引导类加载器。下图中给出了一个典型的类加载器树状组织结构示意图，其中的箭头指向的是父类加载器。

![类加载器继承关系](http://cdn.gydblog.com/images/java/jvm/jvm-3.jpg)

---

涉及的类加载器分别介绍如下：  

1）启动类加载器(引导类加载器，Bootstrap ClassLoader)
:::info 启动类加载器
启动类加载器使用C/C++语言实现的，嵌套在JVM内部。  
它用来加载Java的核心库（JAVAHOME/jre/1ib/rt.jar、resources.jar或sun.boot.class.path路径下的内容），用于提供JVM自身需要的类。 
它并不继承自 java.lang.ClassLoader，没有父加载器。  
加载扩展类加载器和应用程序类加载器，并指定为他们的父类加载器。  
出于安全考虑，Bootstrap启动类加载器只加载包名为java、javax、sun等开头的类  
:::

2）扩展类加载器（Extension ClassLoader）  
:::info 扩展类加载器
Java语言编写，JDK1.8由sun.misc.Launcher$ExtClassLoader实现，JDK1.9之后改成PlatFromClassLoader，由jdk.internal.loader.PlatformClassLoader实现。
派生于ClassLoader类.
父类加载器为启动类加载器.
从java.ext.dirs系统属性所指定的目录中加载类库，或从JDK的安装目录的jre/lib/ext子目录（扩展目录）下加载类库。如果用户创建的JAR放在此目录下，也会自动由扩展类加载器加载.
:::

3）应用程序类加载器（系统类加载器，Application ClassLoader)
:::info 应用程序类加载器
java语言编写，由sun.misc.LaunchersAppClassLoader实现.
派生于ClassLoader类.
父类加载器为扩展类加载器.
它负责加载环境变量classpath或系统属性java.class.path指定路径下的类库.
该类加载是程序中默认的类加载器，一般来说，Java应用的类都是由它来完成加载
通过classLoader#getSystemclassLoader（）方法可以获取到该类加载器.
:::

4）用户自定义类加载器（User ClassLoader）
:::info 用户自定义类加载器
在Java的日常应用程序开发中，类的加载几乎是由上述3种类加载器相互配合执行的，在必要时，我们还可以自定义类加载器，来定制类的加载方式。 
为什么要自定义类加载器？  
a.隔离加载类
b.修改类加载的方式
c.扩展加载源
d.防止源码泄漏 
:::

## 三、双亲委派模型
如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成。
每一个层次的类加载器都是如此，因此所有的加载请求最终都应该传送到最顶层的启动类加载器中。只有当上一层类加载器反馈自己无法完成这个加载请求（它的搜索范围中没有找到这个类）时，下一层类加载器才会尝试自己去加载。 

还是拿前面提到过的源代码程序ClassLoaderTest举例，ClassLoaderTest加载时调用类加载器的顺序是下面这样的：
:::info 类加载时调用类加载器的顺序
ClassLoaderTest.class要进行加载时，它将会启动应用类加载器进行加载ClassLoaderTest类，但是这个系统类加载器不会真正去加载他，而是会调用看是否有父加载器，结果有，是扩展类加载器，扩展类加载器也不会直接去加载，它看自己是否有父加载器没，结果它还是有的，是根类加载器。
所以这个时候根类加载器就去加载这个类，可在%JAVA_HOME%\jre\lib下，它找不到com.wangmeng.Test这个类，所以他告诉他的子类加载器，我找不到，你去加载吧，子类扩展类加载器去%JAVA_HOME%\lib\ext去找，也找不着，它告诉它的子类加载器 System类加载器，我找不到这个类，你去加载吧，结果System类加载器找到了，就加到内存中，并生成Class对象。
这个时间时候启动类加载器（应用类加载器）和实际类加载器（应用类加载器）是同一个.
:::

针对ClassLoaderTest类的加载原理其实就是JAVA中著名的委托加载机制-双亲委派模型。  

那么，有童鞋会奇怪，这不是多余吗？直接加载不就完事了么，为啥还多这么多传递判断呢？

这里需要先说明一下 Java 虚拟机JVM是如何判定两个 Java 类是相同的：
```
JVM不仅要看类的全名是否相同，还要看加载此类的类加载器是否一样。只有两者都相同的情况，才认为两个类是相同的。  
即便是同样的字节代码，被不同的类加载器加载之后所得到的类，也是不同的。
```

双亲委派模型其实是为了保证 Java 核心库的类型安全。  

所有 Java 应用都至少需要引用 java.lang.Object类，也就是说在运行的时候，java.lang.Object这个类需要被加载到 Java 虚拟机中。
如果这个加载过程由 Java 应用自己的类加载器来完成的话，很可能就存在多个版本的 java.lang.Object类，而且这些类之间是不兼容的。

这里总结一下双亲委派模型的设计动机：
**1、代理模式是为了保证 Java 核心库的类型安全：** 通过代理模式，对于 Java 核心库的类的加载工作由引导类加载器来统一完成，保证了 Java 应用所使用的都是同一个版本的 Java 核心库的类，是互相兼容的。

**2、相同名称的类可以并存在 Java 虚拟机中：** 不同的类加载器为相同名称的类创建了额外的名称空间。相同名称的类可以并存在 Java 虚拟机中，只需要用不同的类加载器来加载它们即可。不同类加载器加载的类之间是不兼容的，这就相当于在 Java 虚拟机内部创建了一个个相互隔离的 Java 类空间。

双亲委派模型这种技术思想在许多框架中都被用到，比如以 Apache Tomcat 来说，容器不希望它下面的webapps之间能互相访问到，每个 Web 应用都有一个对应的类加载器实例。

双亲委派模型可以被打破，需要自定义类加载器，继承ClassLoader类，重写LoadClass方法。
