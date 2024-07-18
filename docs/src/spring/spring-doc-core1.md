---
title: Spring的IoC容器
shortTitle: Spring的IoC容器
date: 2024-03-15
category:
  - 开源框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring6,Spring官方文档,Spring核心知识
---

# Spring的IOC容器

> 基于官方文档翻译，根据个人理解总结于此。

容器知识学习大纲如下：

- 容器概述
- Bean概述
- Bean的作用域
- 自定义Bean的性质
- Bean定义继承
- 容器扩展点
- 两种容器配置方式（基于Java、基于注解)
- 基于ClassPath扫描和管理组件
- 使用JSR330的标准注解
- 环境抽象化
- 注册LoadTimeWeaver
- ApplicationContext的其它功能
- BeanFactory API

本小节主要讲解容器的基本概念。

## 一、术语解释

**Bean**

在Spring中，构成应用程序主干并由Spring Ioc容器管理的对象称为bean。bean是由Spring IoC容器实例化、组装和管理的对象。Bean及其之间的依赖关系反映在容器使用的配置元数据中。

**依赖注入（DI）**

依赖注入指的是对象仅通过构造函数参数、工厂方法参数或在对象实例构造或从工厂方法返回后在对象实例上设置的属性来定义其依赖项。然后IOC容器在创建Bean时注入这些依赖项。

使用DI原理，代码更干净，当为对象提供依赖项时，解耦更有效。对象不查找其依赖项，也不知道依赖项的位置或类。DI的方式主要有基于构造函数的依赖注入和基于Setter的依赖注入。

由于可以混合使用基于构造函数和基于setter的DI，因此将构造函数用于强制依赖项，将setter方法或配置方法用于可选依赖项是一条很好的经验法则。请注意，在setter方法上使用@Autowired注释可以使该属性成为必需的依赖项；

**控制反转（IOC）**

依赖注入的本质是bean本身的逆过程，因此得名为控制反转。它是通过使用类的直接构造或服务定位器模式等机制来控制其依赖项的实例化或者位置。



## 二、IOC容器

Spring的IOC容器的工作模式如下图所示：

![](http://cdn.gydblog.com/images/spring/spring-ioc-1.png)



如上图，Spring IoC容器使用某种约定形式的配置元数据对业务实体Bean进行创建和初始化。此配置元数据表示作为应用程序开发人员，如何告诉Spring容器实例化、配置和组装应用程序中的组件。在IOC容器启动后，就有了一个完全配置好的可执行应用程序。

org.springframework.beans和org.springeframework.context包是IoC容器的基础。其中org.springframework.beans.BeanFactory接口是IOC 容器基本实现，提供了配置框架和基本功能，能够管理任何类型的对象。而org.springeframework.context.ApplicationContext是BeanFactory的子接口，添加了更多企业特定的功能：

- 更容易与Spring的AOP框架集成
- 消息资源处理（用于国际化）
- 事件发布
- 应用程序层特定的上下文，如用于web应用程序的WebApplicationContext。

ApplicationContext接口也有多个实现。在独立的应用程序中，通常创建实例AnnotationConfigApplicationContext或ClassPathXmlApplicationContext。

 ```
 #xml方式描述容器配置（官方建议使用xml文件绝对路径，而不是相对路径）
 ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
 
 // 获取容器中的bean实例
 PetStoreService service = context.getBean("petStore", PetStoreService.class);
 
 //使用bean实例
 List<String> userList = service.getUsernameList();
 ```

bean定义除了xml方式，也可以在Spring的Groovy bean Definition DSL中表示，这在Grails框架中是众所周知的。通常，这样的配置位于“.Groovy”文件中，其结构如以下示例所示：

```
beans {
	dataSource(BasicDataSource) {
		driverClassName = "org.hsqldb.jdbcDriver"
		url = "jdbc:hsqldb:mem:grailsDB"
		username = "sa"
		password = ""
		settings = [mynew:"setting"]
	}
	sessionFactory(SessionFactory) {
		dataSource = dataSource
	}
	myService(MyService) {
		nestedBean = { AnotherBean bean ->
			dataSource = dataSource
		}
	}
}
```

使用groovy定义的配置文件初始化容器，可以按如下方式：

```
ApplicationContext context = new GenericGroovyApplicationContext("services.groovy", "daos.groovy");
```



 



-