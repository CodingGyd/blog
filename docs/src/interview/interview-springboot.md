---
# icon: lock
date: 2023-02-10
category:
  - 技术题库
---

# SpringBoot

## 1、谈谈你对SpringBoot的理解

用来简化spring应用的初始搭建以及开发过程 使用特定的方式来进行配置（properties或yml文件）  
创建独立的spring引用程序 main方法运行    
嵌入的Tomcat 无需部署war文件    
简化maven配置    

答：spring boot来简化spring应用开发，约定大于配置，去繁从简，just run就能创建一个独立的，产品级别的应用

SpringBoot有以下优点：
- 快速创建独立运行的spring项目与主流框架集成  

- 使用嵌入式的servlet容器，应用无需打包成war包  

- starters自动依赖与版本控制  

- 大量的自动配置，简化开发，也可修改默认值  

- 准生产环境的运行应用监控  

- 与云计算的天然集成  

## 2、SpringBoot如何实现热部署
Spring Boot有一个开发工具（DevTools）模块支持实现热部署功能.

我们修改代码后可以重新加载Spring Boot上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。Spring Boot在发布它的第一个版本时没有这个功能。

该模块在生产环境中被禁用。


## 3、Spring Boot、Spring MVC 和 Spring 有什么区别？
- Spring

Spring最重要的特征是依赖注入。所有 SpringModules 不是依赖注入就是 IOC 控制反转。

当我们恰当的使用 DI 或者是 IOC 的时候，我们可以开发松耦合应用。松耦合应用的单元测试可以很容易的进行。

- Spring MVC

Spring MVC 提供了一种分离式的方法来开发 Web 应用。通过运用像 DispatcherServelet，MoudlAndView 和 ViewResolver 等一些简单的概念，开发 Web 应用将会变的非常简单。

- SpringBoot

Spring 和 SpringMVC 的问题在于需要配置大量的参数。Spring Boot 通过一个自动配置和启动的项来目解决这个问题。

## 4、SpringBoot中的监视器

Spring boot actuator是spring启动框架中的重要功能之一。Spring boot监视器可帮助访问生产环境中正在运行的应用程序的当前状态。

有几个指标必须在生产环境中进行检查和监控。即使一些外部应用程序可能正在使用这些服务来向相关人员触发警报消息。监视器模块公开了一组可直接作为HTTP URL访问的REST端点来检查状态。



## 5、SpringBoot自动配置的原理

在springboot程序main方法中 添加@SpringBootApplication或者@EnableAutoConfiguration

会自动去maven中读取每个starter中的spring.factories文件 该文件里配置了所有需要被创建spring容器中的bean，然后通过反射的方式进行实例化

自动配置是SpringBoot的核心，而自动配置是基于条件判断来配置Bean的。关于自动配置的源码在spring-boot-autoconfigure-x.x.x.RELEASE.jar

  

## 6、Spring Boot 的核心注解是哪个？它主要由哪几个注解组成的？

启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：

@SpringBootConfiguration：组合了 @Configuration 注解，实现配置文件的功能。

@EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能：

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })。

@ComponentScan：Spring组件扫描。



## 7、如何在 Spring Boot 启动的时候运行一些特定的代码？

可以实现接口 ApplicationRunner或者 CommandLineRunner，这两个接口实现方式一样(项目启动完成后执行) ，它们
都只提供了一个 run 方法，在run方法写你的业务逻辑。


 