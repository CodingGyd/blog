---
# icon: lock
date: 2018-01-05

category:
  - Java
tag:
  - Java入门
---

# 新手无法逃避的HelloWorld


## Java程序的执行逻辑
以hello.java程序举例，其生命周期会经历如下几个阶段：

- 产生源文件<br/>
由程序员们使用最原始的记事本或者Java集成开发环境(主流的是IDEA、Eclipse)新建hello.java文件，然后根据java语法编写好正确的java代码。

- 编译<br/>
通过编辑器调用javac命令将hello.java文件翻译成字节码文件hello.class。 class格式文件可在任何平台/操作系统上由JVM（Java虚拟机）解释执行，JVM替我们屏蔽了底层不同操作系统之间的差异。

- 运行<br/>
JVM根据底层不同的操作系统，通过java命令将class文件翻译成机器可以执行的机器码指令(01,二进制)

整体流程是：
<img src="/images/java/java-hello-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 编写一个HelloWorld
-  我们先用最朴素的方式-记事本 来敲第一个java程序，文件名是HelloWorld.java,文件内容如下：
```
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("HelloWorld!");
    }
} 
```



