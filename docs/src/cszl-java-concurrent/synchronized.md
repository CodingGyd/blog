---
# icon: lock
date: 2023-07-03

category:
  - Java
tag:
  - 并发编程
  - 锁
  - synchronized
---
# synchronized关键字

## 简介 
在多线程并发编程中 synchronized 是历史很悠久的概念，它可以用于修饰实例方法、静态方法、代码块。当一个线程试图访问同步代码时必须首先获得锁，正常退出或者抛出异常时必须释放锁。 由于会导致争用不到锁的线程进入阻塞状态，因此很多人都会称呼synchronized为重量级锁。

但是，随着 Java SE 1.6以后 对 synchronized 进行了各种优化之后，有些情况下它就并不那么重了。Java SE 1.6 中为了减少获得锁和释放锁带来的性能消耗而引入了无锁状态、偏向锁、轻量级锁、重量级锁、自旋等一系列锁升级概念。


这里顺便提一下阿里开发手册中的几个用锁原则：  
- 尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用rpc方法或者耗时的io操作。
- 能锁代码块，就不要锁整个方法体；能用对象锁，就不要用类锁。  


下面是synchronized的三种应用场景：

## 修饰实例方法  

一个对象里如果有多个synchronized方法，某一个时刻内，只要有一个线程去调用其中的任何一个synchronized方法了，其它的线程都只能等待，也就是说，某一个时刻内，只能有一个线程去访问这些synchronized方法。synchronized锁的是当前对象this，被锁定后，其它的线程都不能进入到当前对象的其它的synchronized方法
```java
package com.gyd;

public class LockDemo4 {
    public synchronized void m1(){
        System.out.println("----实例同步方法");
    }

    public void m2(){
        System.out.println("----普通方法");
     }
    public static void main(String[] args){
    }
}

```
作用于实例方法时，当前实例加锁，进入同步代码前要抢到当前实例的锁才可以继续执行，否则阻塞。

### 字节码分析
使用javap -v命令对上述代码的字节码文件LockDemo4.class进行反汇编，结果如下：
```java
Classfile /D:/code/demo/target/classes/com/gyd/LockDemo4.class
  Last modified 2023-7-3; size 715 bytes
  MD5 checksum c2407a25c8e642fa676372e3ff28d4fd
  Compiled from "LockDemo4.java"
public class com.gyd.LockDemo4
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #7.#23         // java/lang/Object."<init>":()V
   #2 = Fieldref           #24.#25        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #26            // ----实例同步方法
   #4 = Methodref          #27.#28        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = String             #29            // ----普通方法
   #6 = Class              #30            // com/gyd/LockDemo4
   #7 = Class              #31            // java/lang/Object
   #8 = Utf8               <init>
   #9 = Utf8               ()V
  #10 = Utf8               Code
  #11 = Utf8               LineNumberTable
  #12 = Utf8               LocalVariableTable
  #13 = Utf8               this
  #14 = Utf8               Lcom/gyd/LockDemo4;
  #15 = Utf8               m1
  #16 = Utf8               m2
  #17 = Utf8               main
  #18 = Utf8               ([Ljava/lang/String;)V
  #19 = Utf8               args
  #20 = Utf8               [Ljava/lang/String;
  #21 = Utf8               SourceFile
  #22 = Utf8               LockDemo4.java
  #23 = NameAndType        #8:#9          // "<init>":()V
  #24 = Class              #32            // java/lang/System
  #25 = NameAndType        #33:#34        // out:Ljava/io/PrintStream;
  #26 = Utf8               ----实例同步方法
  #27 = Class              #35            // java/io/PrintStream
  #28 = NameAndType        #36:#37        // println:(Ljava/lang/String;)V
  #29 = Utf8               ----普通方法
  #30 = Utf8               com/gyd/LockDemo4
  #31 = Utf8               java/lang/Object
  #32 = Utf8               java/lang/System
  #33 = Utf8               out
  #34 = Utf8               Ljava/io/PrintStream;
  #35 = Utf8               java/io/PrintStream
  #36 = Utf8               println
  #37 = Utf8               (Ljava/lang/String;)V
{
  public com.gyd.LockDemo4();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/gyd/LockDemo4;

  public synchronized void m1();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_SYNCHRONIZED
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String ----实例同步方法
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 5: 0
        line 6: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  this   Lcom/gyd/LockDemo4;

  public void m2();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #5                  // String ----普通方法
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 9: 0
        line 10: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  this   Lcom/gyd/LockDemo4;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 12: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       1     0  args   [Ljava/lang/String;
}
SourceFile: "LockDemo4.java"
```
在上面的汇编代码中，m1方法所在的第64行的ACC_SYNCHRONIZED是一个访问标志，有该标记的方法是一个实例同步方法。调用指令会检查方法的flag有没有设置ACC_SYNCHRONIZED访问标志。如果设置了，执行线程会先去抢占实例对象的monitor锁，然后再执行方法，最后在方法执行完后释放monitor锁(无论方法是正常完成还是异常完成)。 而普通非同步方法如m2的方法头flag上就没有这个ACC_SYNCHRONIZED访问标志。


## 修饰静态方法  

对于静态同步方法，锁的是当前类的class对象，所有该类的实例都受影响。也就是说一旦一个静态同步方法获取锁之后，其他的静态同步方法都必须等待该方法释放锁后才能获取锁。

```java
package com.gyd;

public class LockDemo5 {
    public static synchronized void m1(){
        System.out.println("----静态同步方法");
    }

    public static void main(String[] args){
    }
}
```
作用于静态方法，当前类加锁，进入同步代码前要抢到当前类class对象的锁才可以继续执行，否则阻塞。

### 字节码分析  

和普通同步方法一样，使用javap -v 命令对LockDemo5.clas进行反汇编，结果如下：

```java
Classfile /D:/code/demo/target/classes/com/gyd/LockDemo5.class
  Last modified 2023-7-3; size 601 bytes
  MD5 checksum f1327a18fa7cda2fd388cf8ef3860aa5
  Compiled from "LockDemo5.java"
public class com.gyd.LockDemo5
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #6.#21         // java/lang/Object."<init>":()V
   #2 = Fieldref           #22.#23        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #24            // ----静态同步方法
   #4 = Methodref          #25.#26        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #27            // com/gyd/LockDemo5
   #6 = Class              #28            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lcom/gyd/LockDemo5;
  #14 = Utf8               m1
  #15 = Utf8               main
  #16 = Utf8               ([Ljava/lang/String;)V
  #17 = Utf8               args
  #18 = Utf8               [Ljava/lang/String;
  #19 = Utf8               SourceFile
  #20 = Utf8               LockDemo5.java
  #21 = NameAndType        #7:#8          // "<init>":()V
  #22 = Class              #29            // java/lang/System
  #23 = NameAndType        #30:#31        // out:Ljava/io/PrintStream;
  #24 = Utf8               ----静态同步方法
  #25 = Class              #32            // java/io/PrintStream
  #26 = NameAndType        #33:#34        // println:(Ljava/lang/String;)V
  #27 = Utf8               com/gyd/LockDemo5
  #28 = Utf8               java/lang/Object
  #29 = Utf8               java/lang/System
  #30 = Utf8               out
  #31 = Utf8               Ljava/io/PrintStream;
  #32 = Utf8               java/io/PrintStream
  #33 = Utf8               println
  #34 = Utf8               (Ljava/lang/String;)V
{
  public com.gyd.LockDemo5();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/gyd/LockDemo5;

  public static synchronized void m1();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_STATIC, ACC_SYNCHRONIZED
    Code:
      stack=2, locals=0, args_size=0
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String ----静态同步方法
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 5: 0
        line 6: 8

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 9: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       1     0  args   [Ljava/lang/String;
}
SourceFile: "LockDemo5.java"
```
从上面的汇编结果可以看出，静态同步方法m1所在的flag除了ACC_SYNCHRONIZED访问标志，还多了一个ACC_STATIC标记。 这就是用来区分普通同步方法的标志。其它和普通同步方法相同。

## 修饰同步代码块
锁的是 synchonized 括号里配置的对象。
使用示例：
```java
package com.gyd;

public class LockDemo2 {

    Object object = new Object();
    public void m1(){
        synchronized (object) {
            System.out.println("----hello");
        }
        System.out.println("-other code---");
    }
    public static void main(String[] args){
    }
}
```
作用于代码块，是对括号里配置的对象加锁。

### 字节码分析

找到target目录下的字节码文件LockDemo2.class，使用javap命令对LockDemo2.class文件进行字节码反汇编，输入命令"javap -c .\LockDemo2.class"
<img src="/images/java/concurrent/synchronized-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

结果如下：
```java
Compiled from "LockDemo2.java"
public class com.gyd.LockDemo2 {
  java.lang.Object object;

  public com.gyd.LockDemo2();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: new           #2                  // class java/lang/Object
       8: dup
       9: invokespecial #1                  // Method java/lang/Object."<init>":()V
      12: putfield      #3                  // Field object:Ljava/lang/Object;
      15: return

  public void m1();
       6: monitorenter
       7: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      10: ldc           #5                  // String ----hello
      12: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      15: aload_1
      16: monitorexit
      17: goto          25
      20: astore_2
      21: aload_1
      22: monitorexit
      23: aload_2
      24: athrow
      25: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      28: ldc           #7                  // String -同步代码块外的业务逻辑代码===
      30: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      33: return
    Exception table:
       from    to  target type
           7    17    20   any
          20    23    20   any

  public static void main(java.lang.String[]);
    Code:
       0: return

```
从上述反编译生成代码分析可以看出第6行的monitorenter指令和第16行的monitorexit指令分别对应了同步代码块的开始和结束位置。而且还发现多了一个22行的monitorexit指令。可以得出结论：同步代码块至少会有一个monitorenter和一个monitorexit配对。monitorexit指令可能会有多个，这是java对发生异常时的特殊处理，保证异常情况时锁也能得到释放。

那么，如果在同步代码块范围内发生了未处理异常，java是怎么处理的呢？  
我们再来看一个例子：
```java
package com.gyd;

public class LockDemo3 {

    Object object = new Object();
    public void m1(){
        synchronized (object) {
            System.out.println("----hello");
            throw new RuntimeException("error");
        }
    }
    public static void main(String[] args){
    }
}

```
还是执行javap命令对LockDemo3.class字节码文件进行反汇编，得出如下结果：
```java
Compiled from "LockDemo3.java"
public class com.gyd.LockDemo3 {
  java.lang.Object object;

  public com.gyd.LockDemo3();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: new           #2                  // class java/lang/Object
       8: dup
       9: invokespecial #1                  // Method java/lang/Object."<init>":()V
      12: putfield      #3                  // Field object:Ljava/lang/Object;
      15: return

  public void m1();
    Code:
       0: aload_0
       1: getfield      #3                  // Field object:Ljava/lang/Object;
       4: dup
       5: astore_1
       6: monitorenter
       7: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
      10: ldc           #5                  // String ----hello
      12: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      15: new           #7                  // class java/lang/RuntimeException
      18: dup
      19: ldc           #8                  // String error
      21: invokespecial #9                  // Method java/lang/RuntimeException."<init>":(Ljava/lang/String;)V
      24: athrow
      25: astore_2
      26: aload_1
      27: monitorexit
      28: aload_2
      29: athrow
    Exception table:
       from    to  target type
           7    28    25   any

  public static void main(java.lang.String[]);
    Code:
       0: return
}

```

从LockDemo3的汇编代码可以看出第6行出现一条monitorenter指令，第27行出现了一条monitorexit指令。这里要注意第24行和第29行出现了athrow指令，athrow代表一个异常的抛出定义。

从上述两种反汇编结果可以总结一个结论：使用同步块时，底层汇编代码一般情况会生成1个monitorenter指令和2个monitorexit指令。极端情况下是一个monitorenter和1个monitorexit指令。   


## Java对象头
synchronized 用的锁是存在 Java 对象头里的。如果对象是数组类型，则虚拟机用 3个字宽（Word）存储对象头，如果对象是非数组类型，则用 2 字宽存储对象头。在 32位虚拟机中，1字宽等于 4 字节，即 32bit，如表所示：

|长度|内容|说明|
| ----------- | ----------- |--|
|32/64bit|Mark Word|存储对象的hashcode或锁信息等|
|32/64bit|Class Metadata Address|存储到对象类型数据的指针|
|32/64bit|Array Length|数组的长度(如果当前对象是数组)|



synchronized锁升级过程和对象头的Mark Word区域有着密切关系，该区域主要存储HashCode、分代年龄和锁标记位等信息。32
位 JVM 的 Mark Word 的默认存储结构如表所示：  

| 锁状态      | 25bit | 4bit | 1bit是否是偏向锁 | 2bit锁标志位 | 
| ----------- | ----------- |----|---|---|
| 无锁状态      | 对象的hashcode |对象的分代年龄   | 0 |01 |



在运行期间，synchronized锁触发升级时，Mark Word 里存储的数据会随着锁标志位的变化而变化。Mark Word
可能变化为存储以下 4 种数据：
<img src="/images/java/concurrent/synchronized-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 锁升级过程

jdk1.6以后为了减少获得锁和释放锁带来的性能消耗，引入了多个锁状态，级别从低到高依次是无锁状态、偏向锁、轻量级锁、重量级锁状态，
这几个状态会随着竞争情况逐渐升级。锁的升级过程是不可逆的，也就是说偏向锁升级为轻量级锁后不能再降级为偏向锁。这种锁升级却不能降级的策略也是为了提高获得锁和释放锁的效率

<table>
  <tr>
    <td>锁</td>
    <td>优点</td>
    <td>缺点</td>
    <td>适用场景</td>
  </tr>
  <tr>
    <td>偏向锁</td>
    <td>加锁和锁不需要额外的消耗，和执行普通非同步方法相比仅存在纳秒级别的差距</td>
    <td>如果线程间存在锁竞争，则会带来额外的锁释放的消耗</td>
    <td>适用于只有一个线程访问同步块的场景</td>
  </tr>
  <tr>
    <td>轻量级锁</td>
    <td>竞争的线程不会阻塞，提高了程序的响应速度</td>
    <td>如果始终得不到锁的线程，一直自旋会消耗CPU资源</td>
    <td>追求响应时间、同步代码块执行速度非常快</td>
  </tr>
  <tr>
    <td>重量级锁</td>
    <td>线程竞争不使用自旋，不会消耗CPU</td>
    <td>线程阻塞，响应时间缓慢</td>
    <td>追求吞吐量、同步代码块执行时间较长</td>
  </tr>
</table>
## 参考资料
《Java并发编程的艺术》  