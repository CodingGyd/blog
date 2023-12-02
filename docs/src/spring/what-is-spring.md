---
title: Spring系列笔记-什么是Spring?
shortTitle: 什么是Spring?
date: 2023-08-14
category:
  - JAVA企业级开发
tag:
  - spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring5,Spring总结,Spring核心知识
---

# Spring

> 笔记来源于对 [Spring文档](https://springdoc.cn/spring/index.html "Spring文档")  的系统性学习总结
 
## 一、前言
目前Spring框架已经迭代到了6.X版本，下面是Spring版本对JDK的依赖关系：
```
Spring Framework 6.1.x: JDK 17-23
Spring Framework 6.0.x: JDK 17-21
Spring Framework 5.3.x: JDK 8-21 (as of 5.3.26)
```

## 二、Spring是什么？

Spring是一个轻量级的JAVA EE 开发框架，用于简化企业级应用程序的开发。

## 三、Spring框架概述

Spring 总共大约有 20 个模块， 由 1300 多个不同的文件构成。 而这些组件被分别整合在核心容器（Core Container） 、 AOP（Aspect Oriented Programming）和设备支持（Instrmentation） 、数据访问与集成（Data Access/Integeration） 、 Web、 消息（Messaging） 、 Test等 6 个模块中。 以下是 Spring 5 的模块结构图：

![Spring模块划分](http://cdn.gydblog.com/images/spring/spring-jiagou.png)

其中最核心的模块是IOC和AOP：

- IoC
  控制反转Inversion of Control，IoC()，将对象的创建过程从业务代码中剥离出去，交由Spring来完成。

- AOP
  面向切面编程，使我们可以方便的在某段代码上增加额外的操作而不污染该部分代码。

**Spring框架的特征：**
1）轻量
体积小：完整的Spring框架可以在只有1MB多的JAR文件里发布。
处理开销小：Spring所需的处理开销可以忽略不记。

2）控制反转
与传统的编程方式不一样，控制反转的意思就是：你不用来找我，我主动提供给你。Spring中一个对象的自身初始化和依赖会被动的完成，而不是这个对象自己主动完成。

3）面向切面
支持分离应用的业务逻辑和系统逻辑，例如日志和事务支持。

4）扩展性强
  Spring提供了很多扩展点和默认的框架实现，开发者也可以自己实现扩展点逻辑并替换框架默认行为。


**Spring框架的优点：**
1）方便解耦，简化了应用开发
Spring提供了IOC容器来管理对象的初始化和对象之间的依赖工作，开发者无需关心这部分工作是如何完成的，只需要专注业务逻辑的实现即可。

2）AOP编程的支持
通过Spring提供的AOP功能，应用的很多非业务功能可以统一管理。

3）事务支持
Spring提供了一套声明式事务的管理方式，开发者可以通过简单的注解完成事务控制。

4）方便测试
Spring默认支持Junit4测试框架，我们可以很容易实现程序的测试用例。

5）方便集成各种优秀框架
Spring框架的设计非常优秀，扩展性极强，提供了对各种优秀框架的直接集成支持，如Quartz、Hibernate等，大大降低了这些框架的使用难度。

6）降低了Java EE API的使用难度
Spring对很多难用的Java EE API(如JDBC、JavaMail、远程过程调用)等均封装了一层好用的接口，极大的方便了开发者的使用。

7）优秀的框架源码
Spring框架非常强调有意义的、最新的和准确的javadoc。它是为数不多的可以宣称代码结构干净、包与包之间没有循环依赖关系的项目之一。
其源代码中包含了大量Java设计模式，设计巧妙，Spring源码值得我们深入学习，相信我，绝对能快速提高我们的JAVA技术水平。

## 四、第一个Spring程序
> Spring Boot提供了一种快速的方式来创建一个生产就绪的基于Spring的应用程序。它以Spring框架为基础，提供了约定俗成的配置。

这里通过使用 [start.spring.io](https://start.spring.io/ "start.spring.io")   一键生成一个基于 Spring Boot 的应用程序开始使用Spring框架。


![spring程序在线生成](http://cdn.gydblog.com/images/spring/spring-1.png)

如上图所示，主要填写以下几个元素：
- JAVA作为编程语言(Spring也支持别的语言如Kotlin、Groovy)
- 选择MAVEN作为项目管理工具
- 使用SpringBoot作为脚手架
- 打包方式选择jar，项目基本描述信息填写完整(Group、Artifact、Name、Description、Package Name)
- Java语言选择jdk8

相关要素填写完毕后，点击按钮[GENERATE]，即可生成一个源码工程！

将源码工程导入IDEA，就可以直接运行：

![运行spring](http://cdn.gydblog.com/images/spring/spring-2.png)


## 五、Spring知识点
Spring框架入门的基础知识有下面这些：
![运行spring](http://cdn.gydblog.com/images/spring/spring-3.png)

接下来小郭我会仔细学习Spring框架官方文档，并对Spring的每一个常见知识点进行学习和总结输出系列文章，欢迎有兴趣的小伙伴关注我一起学习呀(总结不到位的地方使劲喷我！！)

