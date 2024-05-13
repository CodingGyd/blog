---
# icon: lock
date: 2023-08-04
category:
  - JAVA
tag:
  - 异常处理
---

# JAVA的异常处理框架

## 一、前言

> 大家好呀，我是代码小郭，专注JAVA领域知识学习和分享。
> 我的个人网站地址<a href="http://www.gydblog.com" target="_blank">戳这里</a> 还在建设中，欢迎来喷。  

在日常生活工作中，我们都会提前想一些预案来预防一些可能会发生的事情，但不管怎么预防，总会出现一些意料之外的事情，比如最近的水灾，还有火灾，简直防不胜防啊。

异常这个词，就有"未知的意外"的意思。意外出现了，总得想办法处理吧？如果我不知道该如何处理，那我应该提交给我的上一级去处理吧？ 

我们的程序代码是人的脑力逻辑产物，其实应用程序就等于逻辑+数据。逻辑和数据总该会出问题的，没人能保证自己写的逻辑没有任何漏洞或者产生的数据完全正确啊。

<img src="http://cdn.gydblog.com/images/sucai/sc-2.jpg"  style="zoom: 40%;margin:0 auto;display:block"/><br/>

因此，在编写程序代码时，编写人员不仅仅要实现正常的逻辑代码，还要考虑逻辑如果出问题了怎么处理，编写人员需要完成针对异常处理带来的额外的工作。  

思考一下，假设我们编写正常业务逻辑代码是100行，但是异常处理逻辑代码也写了50行，是不是感觉很多余？ 代码复杂度和整洁度肯定受到影响。

那么，异常处理部分的代码是否可以从正常业务逻辑中分离出来呢？  答案是：非常可以！

JAVA语言中给我们提供了完整的异常处理框架，使用异常处理框架的一个好处是它往往能够降低错误处理代码的复杂度，可以使程序中异常处理代码和正常业务逻辑代码分离，保证程序代码更加优雅，并提高程序健壮性。如果不使用异常处理，那么就必须检查特定的错误，并在程序中的许多地方去处理它。而如果使用异常，那就不必在方法调用处进行检查，因为异常机制将保证能够捕获这个错误。
 
## 二、简介

先看一张图:
<img src="http://cdn.gydblog.com/images/java/exception/exception-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
示例图描述的就是目前JAVA体系中异常处理框架的整体结构。

java定义了一个Throwable类作为所有异常类的超类。java中定义了很多异常类，主要分为两大类：错误Error和溢出Exception。  

从图中可以看出Java定义了一个Throwable类作为所有异常类的超类，还定义了很多子类，子类主要分为两大类：Exception和Error。

- **Exception**
Exception是程序本身能够有能力处理的一种异常，通常程序员会用trycatch等进行显示的捕获处理。正因为JAVA语言分编译器和运行期，Exception也被设计成了两大类：编译期异常和运行期异常。
> 1）编译期异常

编译器异常就是CheckedException，所有不是运行期的异常都可以归为此类异常，是指开发人员在编写代码期间检查出来的异常，这种异常强制开发人员必须在写代码的时候进行处理，否则编译会报错，大大增加了程序的可靠性。  

常见的CheckedException有FileNotFoundException、IOException、SQLException、InterruptException等以及我们自己定义的异常，通常我们使用的开发工具比如idea就会直接提示这类异常，开发人员必须主动捕获该类异常，否则编译报错。

示例：
```java
try {
    FileOutputStream fileOutputStream  = new FileOutputStream(new File("F://xxx.dos"));
} catch (FileNotFoundException e) {
    //发生异常时的操作
    e.printStackTrace();
}

```
 
::: warning 注意：
只有Java语言提供了Checked异常，其他语言都没有提供Checked异常。Java认为Checked异常都是可以被处理（修复）的异常，所以Java程序必须显式处理Checked异常。如果程序没有处理Checked异常，该程序在编译时就会发生错误，无法通过编译。
:::
> 2）运行期异常
运行期异常指的是程序在运行过程中动态产生的各类异常，可能是由于某种业务场景才会触发，非必现。

这类异常一般是程序员编写的代码存在逻辑漏洞而产生，在编写程序时，并不要求必须使用异常处理机制处理这类异常。

常见的运行期异常有空指针NullPointException、下标越界IndexOutBoundsException、类型转换ClassCastException等。

示例：
```java
int a = 10/0;
```

- **Error**
Error是指一些非常严重的问题，我们的应用程序本身已经无法修复这些错误，一般是指与虚拟机JVM相关的问题，如系统崩溃、虚拟机错误、动态链接失败等，这种错误无法恢复或不可能捕获，将导致应用程序中断。

当机器资源不足、或是程序无法继续运行的条件发生时，就产生Error(错误)，表明JVM已经处于不可恢复的崩溃状态。

大多数错误与代码编写者执行的操作无关，而表示代码运行时JVM出现的问题，常见的错误有内存溢出OutOfMemoryError、堆栈溢出StackOverFlowError等，这些异常发生时，JVM一般会选则终止程序进程的运行。
 

**总结一下Exception和Error的区别：**
Error通常是灾难性的致命的错误，是程序无法控制和处理的，当出现这些异常时，Java虚拟机（JVM）一般会选择终止线程；Exception通常情况下是可以被程序处理的，并且在程序中应该尽可能的去处理这些异常。

## 三、异常处理关键字
- try：用于监听。try后紧跟一个花括号括起来的代码块（花括号不可省略），简称try块，它里面放置可能引发异常的代码，当try语句块内发生异常时，异常就被抛出。
- catch: 用于捕获异常。catch后对应异常类型和一个代码块，用于处理try块发生对应类型的异常。
- throws：用在方法签名中，用于声明该方法可能抛出的异常。
- throw:用于抛出一个实际的异常。throw可以单独作为语句使用，抛出一个具体的异常对象。【抛出异常】
- finally:用于清理资源，finally语句块总是会被执行。 多个catch块后还可以跟一个finally块，finally块用于回收在try块里打开的物理资源（如数据库连接、网络连接和磁盘文件）。只有finally块执行完成之后，才会回来执行try或者catch块中的return或者throw语句，如果finally中使用了return或者throw等终止方法的语句，则就不会跳回执行，直接停止。
 
## 四、代码示例
### 1、使用try...catch处理异常
语法格式：
```java
try{
    //业务代码逻辑
    ...
 }catch(Exception e){
   //异常处理代码
   ...
 }
```

实例：
```java
public class ExceptionTest {
     
    public static void main(String[] args) {
        try {
            int a=Integer.parseInt(args[0]);
            int b=Integer.parseInt(args[1]);
            int c=a/b;
            System.out.println("您输入的两个数相除的结果是"+c);
        }catch(IndexOutOfBoundsException e) {
            System.out.println("数组越界，运行时参数不够");
        }catch(NumberFormatException e) {
            System.out.println("数字格式异常");
        }catch(ArithmeticException e) {
            System.out.println("算术异常");
        }catch(Exception e) {
            System.out.println("未知异常");
        }
    }
}
```

### 2、使用throw抛出异常  
```java
public class ExceptionTest {
     
    public static void main(String[] args) {
        try {
            int a=Integer.parseInt("a");
            int b=Integer.parseInt("2");
            int c=a/b;
        }catch(IndexOutOfBoundsException e) {
            throw new RuntimeException("throw抛出异常了");
        }
    }
 
}
```

### 3、使用throws声明异常  
```java
public class ExceptionTest {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(1000);
    }
}

```
### 4、使用finally保证最终操作
有些时候，程序在try块里打开了一些物理资源（例如数据库连接、网络连接和磁盘文件），不管 发生异常还是正常执行完后，这些物理资源都必须显示回收。
java的异常体系给我们提供了finally机制，让我们可以在异常发生时主动完成一些事情，比如进行物理资源的回收。  
 
语法结构：
```java
try{
    //业务实现代码
    ...
  }catch(xxxException e){
    //异常处理块
    ...
  }finally{
     //资源回收
     ...
  }
```

示例：
```java
public class ExceptionTest {
     
    public static void main(String[] args) throws Exception {
        try {
            int c=10/0
        }catch(Exception e) {
            System.out.println("发生异常");
        }finally {
            System.out.println("资源回收");
        }
    }
}
```

### 5、如何访问异常信息  
所有的异常对象类中都有如下几个常用方法：
::: info 常用方法
getStackTrace()：返回该异常的跟踪栈信息。

printStackTrace()：将该异常的跟踪栈信息输出到标准错误输出。

printStackTrace(PrintStream s)：将该异常的跟踪栈信息输出到指定输出流。

getMessage()：返回该异常信息的跟踪栈信息输出到标准错误输出

:::

## 五、自定义异常
有时候JAVA中已经定义好的异常类型不满足目前业务的使用，或者我们需要针对不同的业务制定不同的业务异常分类，方便事后统计和监控。

JAVA的异常框架支持我们自定义一个异常类型，自定义类型都需要继承RuntimeException。

下面是一个简单的案例。

实现步骤：
- 1）声明一个自定义异常类，继承RuntimeException
```java
public class MyException extends RuntimeException{
}
```

- 2）编写两个构造器，一个空的，一个有参数的构造器(带给父类的message属性赋值的构造器)
```java
public class MyException extends RuntimeException{
    
    MyException(){super();}

    MyException(String message){
        super(message);
    }
}

```
- 3）在业务代码中使用自定义异常
```java
public class ExceptionTest {
    public static void main(String[] args) throws InterruptedException {
        try {
            //业务代码
            int a = 10/0;
        } catch (Exception e) {
            //捕获系统异常并抛出自定义异常
            throw new MyException("我是自定义异常");
        }
    }
}
```



## 六、总结 
异常机制使代码的阅读、编写和调试工作更加井井有条。
<img src="http://cdn.gydblog.com/images/sucai/sc-1.jpg"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
