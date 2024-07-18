---
title: Spring的Bean概述
shortTitle: Spring的Bean概述
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

# Spring的Bean概述

> 基于官方文档翻译，根据个人理解总结于此。

Spring IoC容器管理一个或多个bean。这些bean是使用开发者提供给容器的配置元数据创建的（例如，以XML‘<bean/>’定义的形式）。

Spring还允许开发者在容器外部创建Bean。这是通过getBeanFactory（）方法访问ApplicationContext的BeanFactory来完成的，该方法返回DefaultListableBeanFactory实现。DefaultListableBeanFactory通过registerSingleton（..）和registerBeanDefinition（..）方法支持此注册。然而，一般情况应用程序仅使用通过常规bean定义方式注册bean（XML、Java）。

在容器本身中，这些bean定义表示为BeanDefinition对象，其中包含以下元数据：

- bean的实际实现类全路径
- Bean行为配置元素，说明Bean在容器中的行为（作用域、生命周期回调等）
- Bean的依赖项（合作者）
- 其它信息

**Bean创建**

Bean创建有多种方式。

- 使用构造函数实例化（可能需要一个无参构造函数和属性的setter和getter方法）

```
<bean id="exampleBean" class="examples.ExampleBean"/>
<bean name="anotherExample" class="examples.ExampleBeanTwo"/>
```



- 使用实例工厂方法进行实例化

- 使用静态工厂方法进行实例化（这种bean定义的一个用途是在遗留代码中调用静态工厂）

  ```
  public class ClientService {
  	private static ClientService clientService = new ClientService();
  	private ClientService() {}
  
  	public static ClientService createInstance() {
  		return clientService;
  	}
  }
  ```

  

  ```
  <bean id="clientService"
  	class="examples.ClientService"
  	factory-method="createInstance"/>
  ```

**Bean重写**

当使用已经分配的标识符注册Bean时，就会发生Bean重写。虽然允许bean重写，但它会使配置更难阅读，并且在Spring未来的版本中将不推荐使用此功能。

官方不推荐在IOC容器运行时注册新的bean，这可能会导致并发访问异常、bean容器中的状态不一致，或两者兼而有之。

要完全禁用bean重写，可以在刷新ApplicationContext之前将其上的allowBeanDefinitionOverride标志设置为false。在这样的设置中，如果使用bean重写，则会抛出异常。



**Bean命名**

每个bean都有一个或多个标识符。这些标识符在IOC容器中必须是唯一的。一个bean通常只有一个标识符。但是也支持定义多个别名。

```
<alias name="fromName" alias="toName"/>
```



在基于XML的配置方式中，可以使用id属性、name属性或两者来指定bean标识符。通常，这些名称是字母数字（“myBean”、“someService”等），但也可以包含特殊字符。如果想为bean引入其他别名，也可以在name属性中指定它们，用逗号（，）、分号（；）或空格分隔。尽管id属性被定义为xsd:string类型，但bean id的唯一性是由容器强制执行的，而不是由XML解析器强制执行的。

命名约定：在命名bean时使用标准Java约定作为实例字段名。也就是说，bean名称以小写字母开头，并从此处开始使用驼色大小写。例如accountManager、accountService、userDao、loginroller等。

如果没有显式提供name或id，Spring容器将为该bean生成一个唯一的名称，当有多个字符，并且第一个和第二个字符都是大写时，原始大小写会被保留。如果想通过使用ref元素或Service Locator样式的查找来按名称引用该bean，则必须显示提供一个名称。

 