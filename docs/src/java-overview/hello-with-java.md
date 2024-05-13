---
# icon: lock
date: 2018-01-05

category:
  - JAVA
---

# 新手无法逃避的HelloWorld


## 01、Java程序的执行逻辑
以HelloWorld.java程序举例，其生命周期会经历如下几个阶段：

- 1）产生源文件<br/>
由程序员们使用最原始的记事本或者Java集成开发环境(主流的是IDEA、Eclipse)新建HelloWorld.java文件，然后根据java语法编写好正确的java代码。

- 2）编译<br/>
通过编辑器调用javac命令将hello.java文件翻译成字节码文件HelloWorld.class。 class格式文件可在任何平台/操作系统上由JVM（Java虚拟机）解释执行，JVM替我们屏蔽了底层不同操作系统之间的差异。

- 3）运行<br/>
JVM根据底层不同的操作系统，通过java命令将class文件翻译成机器可以执行的机器码指令(01,二进制)

整体流程是：
<img src="http://cdn.gydblog.com/images/java/java-hello-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 02、编写一个HelloWorld
我们先用最朴素的方式-记事本 来敲第一个java程序，在控制台输出"HelloWorld！"信息，该程序文件名是HelloWorld.java,文件内容如下：
```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("HelloWorld!");
    }
} 
```

然后在HelloWorld.java文件所在目录调出cmd对话框，输入命令"javac 源文件名"，回车，编译生成字节码class文件

:::warning 注意
>编译生成的字节码文件的文件名对应java源文件中的类名，与java源文件的文件名是不一致的。因此当一个声明了多个类的源文件经过编译之后会生成多个字节码文件！
:::

 <img src="http://cdn.gydblog.com/images/java/java-hello-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

最后输入命令"java HelloWorld" 执行编译后的字节码文件
 <img src="http://cdn.gydblog.com/images/java/java-hello-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


输出"HelloWorld！" 代表我们的第一个JAVA程序写好啦！
