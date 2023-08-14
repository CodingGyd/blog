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

> 笔记来源于对 [Spring文档](Spring文档 "https://springdoc.cn/spring/index.html")  的学习总结
 
## 前言
目前Spring框架已经迭代到了6.X版本，下面是Spring版本对JDK的依赖关系：
```
Spring Framework 6.1.x: JDK 17-23
Spring Framework 6.0.x: JDK 17-21
Spring Framework 5.3.x: JDK 8-21 (as of 5.3.26)
```
小郭在这里使用最新的Spring Framework6来进行学习总结，但由于小郭本地只安装了JDK8环境，部分Spring6新特性会选择忽略。  


当我们了解一个框架时，重要的是不仅要知道它做什么，还要知道它遵循什么原则。下面是Spring框架的指导原则: 

- 在每个层面上提供选择。
   Spring让你尽可能晚地推迟设计决策。例如，你可以通过配置来切换持久化供应商，而不需要改变你的代码。对于许多其他基础设施问题和与第三方API的集成也是如此。

- 适应不同的观点。
   Spring拥抱灵活性，对事情应该如何做不持意见。它支持具有不同视角的广泛的应用需求。

- 保持强大的后向兼容性。
   Spring的演进是经过精心管理的，在不同的版本之间几乎不存在破坏性的变化。Spring支持一系列精心选择的JDK版本和第三方库，以方便维护依赖Spring的应用程序和库。

- 关心API的设计。
   Spring团队花了很多心思和时间来制作直观的API，并且在很多版本和很多年中都能保持良好的效果。

- 为代码质量设定高标准。
   Spring框架非常强调有意义的、最新的和准确的javadoc。它是为数不多的可以宣称代码结构干净、包与包之间没有循环依赖关系的项目之一。

## 第一个Spring程序
> Spring Boot提供了一种快速的方式来创建一个生产就绪的基于Spring的应用程序。它以Spring框架为基础，提供了约定俗成的配置。

这里通过使用 [start.spring.io](start.spring.io "https://start.springboot.io/ml")   一键生成一个基于 Spring Boot 的应用程序开始使用Spring框架。


![spring程序在线生成](http://cdn.gydblog.com/images/spring/spring-1.png)

如上图所示，主要填写以下几个元素：
- 1）JAVA作为编程语言(Spring也支持别的语言如Kotlin、Groovy)
- 2）选择MAVEN作为项目管理工具
- 3）使用SpringBoot作为脚手架
- 4）打包方式选择jar，项目基本描述信息填写完整(Group、Artifact、Name、Description、Package Name)
- 5）Java语言选择jdk8

相关要素填写完毕后，点击按钮[GENERATE]，即可生成一个源码工程！

将源码工程导入IDEA，就可以直接运行：

![运行spring](http://cdn.gydblog.com/images/spring/spring-2.png)


## Spring知识点
Spring框架入门的基础知识有下面这些：
![运行spring](http://cdn.gydblog.com/images/spring/spring-3.png)

接下来小郭我会仔细学习Spring框架官方文档，并对Spring的每一个常见知识点进行学习和总结输出系列文章，欢迎有兴趣的小伙伴关注我一起学习呀(总结不到位的地方使劲喷我！！)

