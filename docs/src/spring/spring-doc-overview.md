---
title: Spring框架概述
shortTitle: Spring框架概述
date: 2023-08-15
category:
  - 开源框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring6,Spring官方文档,Spring核心知识
---

# Spring框架概述

> 基于官方文档翻译，根据个人理解总结于此。

## 一、简介

Spring诞生于2003年，是对早期J2EE规范的复杂性的响应。Spring与JavaEE及其的迭代版本JakartaEE是互补的。Spring编程模型不包含JavaEE平台规范；相反，它集成了从JavaEE中精心选择的单个规范：

- Servlet API

- WebSocket API

- 并发API

- JSON 绑定API

- Bean验证API

- JPA

- JMS

- 用于事务协调的JTA/JCA设置（如果需要）

  

Spring框架还支持依赖注入（JSR 330）和通用注释（JSR 250）规范，应用程序开发人员可以选择使用这些规范，而不是Spring框架提供的特定于Spring的机制。最初，这些都是基于通用javax包的。

Spring 框架使得创建 Java 企业应用程序变得容易。它提供了在企业环境中使用 Java 语言所需的一切，支持 Groovy 和 Kotlin 作为 JVM 上的替代语言，并且可以根据应用程序的需要灵活地创建多种架构。从 Spring Framework 6.0 开始，Spring 要求 Java 17+。

 Spring是开源的。它拥有一个庞大而活跃的社区，该社区根据各种现实世界用例提供持续的反馈。这有助于Spring在很长一段时间内成功发展。

术语“Spring”在不同的上下文中意味着不同的东西。它可以用于引用SpringFramework项目。随着时间的推移，其他Spring项目已经大量构建在Spring框架之上。因此大多数情况下，当人们说“Spring”时，他们指的是整个项目家族。本文档侧重于基础：SpringFramework框架本身。

Spring框架分为多个模块。应用程序可以选择他们需要的模块。核心是IOC容器模块spring-core，包括配置模型和依赖注入机制。除此之外，Spring框架还为不同的应用程序架构提供了基础支持，包括消息传递messaging、事务管理transactional data和JDBC持久化管理以及web。它还包括基于Servlet的SpringMVC web框架，以及SpringWebFlux响应式web框架。



## 二、版本要求

从Spring Framework 6.0开始，Spring已经升级到Jakarta EE 9级别（例如Servlet 5.0+、JPA 3.0+），基于Jakarta命名空间，而不是传统的javax包。至少支持EE9，并且已经支持EE10，Spring准备为Jakarta EEAPI的进一步发展提供开箱即用的支持。Spring Framework 6.0与Tomcat 10.1、Jetty 11和Undertow 2.3作为web服务器完全兼容，还与Hibernate ORM 6.1完全兼容。



## 三、设计理念

>  当我们学习一门新的技术框架时，重要的是不仅要知道它能做什么，还要知道它遵循的是什么原则，也就是他的设计理念是什么。

Spring的设计原则遵循如下几条：

- 在每个级别都支持选择（配置）。

  例如可以通过配置切换持久化程序，而无需更改代码。许多其它基础架构和与第三方API集成的方案设计也是如此。

- 适应不同的观点。

  Spring拥抱灵活性，对事情应该如何做并不固执己见。它支持具有不同视角的广泛应用需求。

- 保持强大的向后兼容性。Spring的发展已经被谨慎地管理，以强制在版本之间进行很少的破坏性更改。Spring支持精心选择的一系列JDK版本和第三方库，以便于维护依赖于Spring的应用程序和库。

- 关注API设计。Spring团队投入了大量的思想和时间来设计API，并在许多版本和未来许多年都可以使用。

- 为代码质量设定高标准。Spring框架强调有意义的、当前的和准确的javadoc。它是少数几个可以声明干净的代码结构，并且包之间没有循环依赖关系的项目之一。


## 四、核心技术
Spring框架的核心技术点有：

- IOC容器
- AOP框架
- Resources（资源管理）
- Validation，Data Binding，and Type Conversion（数据验证、数据绑定、类型转换）
- Spring Expression Language（SpEL表达式）
- Aspect Oriented Programming with Spring
- Data Buffers and Codecs（数据缓冲和编解码器）
- Logging（日志）

Spring框架的核心技术中最重要的首先是控制反转（IOC）容器，然后是面向切面（AOP）框架。Spring有自己的AOP框架，它成功地解决了Java企业级应用中80%的AOP需求。 另外，Spring提供了与AspectJ（就功能而言，目前是最丰富的，也是Java企业领域最成熟的AOP实现）的集成。

接下来小郭的目标是仔细阅读官方文档，针对每个技术点进行详细学习和笔记。