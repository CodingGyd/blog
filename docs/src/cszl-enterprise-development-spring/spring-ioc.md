---
title: Spring系列笔记-IOC容器和Bean定义的基本常识
shortTitle: IOC容器和Bean定义的基本常识
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

# IOC容器和Bean定义的基本常识
## 前言 
> 笔记来源于对 [Spring文档](Spring文档 "https://springdoc.cn/spring/index.html")  的系统性学习总结

先从上帝视角看一下Spring对IOC容器的定位: 

![Spring IOC容器](http://cdn.gydblog.com/images/spring/spring-ioc-1.png)

上面的图显示了Spring工作方式的高层视图。我们的应用程序类与配置元数据相结合，在IOC容器 被创建和初始化后，就有了一个完全配置好的可执行系统或应用程序。

图中涉及的三个元素作用如下：

- Spring Container
  IOC容器
- Configuration Metadata
  配置元数据信息，通常以XML、Java注解或Java代码表示，用于开发者描述对象以及这些对象之间的相互依赖关系。下面是一个XML配置示例：
  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
          https://www.springframework.org/schema/beans/spring-beans.xsd">
          
      <!-- id 属性是一个字符串，用于识别单个Bean定义。 -->
      <!-- class 属性定义了 Bean 的类型，并使用类的全路径名。 -->
      <bean id="..." class="...">  
          <!-- 这个bean的依赖者和配置在这里 -->
      </bean>

      <bean id="..." class="...">
          <!-- 这个bean的依赖者和配置在这里 -->
      </bean>

      <!-- 更多bean 定义在这里 -->

  </beans>
  ```
- Your Business Objects
  开发者自己定义的各种对象

上面这三个元素相互配合，在Spring中构成了一个完全配置好的可执行系统或应用程序。 



我们再来看下IOC容器的整体核心类继承关系图：

![Spring IOC类继承关系](http://cdn.gydblog.com/images/spring/spring-ioc-2.png)

其中我们需要重点关注的是顶层接口BeanFactory、扩展接口ApplicationContext、实现类 ClassPathXmlApplicationContext 或 FileSystemXmlApplicationContext。

了解完了顶层设计，接下来跟着小郭一起来学习一下IOC的具体原理和各种基本概念吧。

## IOC概念
> IOC是控制反转的意思，也被称为依赖注入（DI）。

IOC指的是一个对象创建和依赖的过程，对象仅通过构造参数、工厂方法的参数或在对象实例被构造或从工厂方法返回后在其上设置的属性来定义其依赖关系（即它们与之合作的其他对象）。然后容器在创建 bean 时注入这些依赖关系。这个过程从根本上说是Bean本身通过使用直接构建类或诸如服务定位模式的机制来控制其依赖关系的实例化或位置的逆过程，因此被称为控制反转。

那么Bean是什么呢？ 
:::info bean
Bean是一个由Spring IoC容器实例化、组装和管理的对象。否则，Bean只是你的应用程序中众多对象中的一个。Bean以及它们之间的依赖关系都反映在容器使用的配置元数据中。
:::

org.springframework.beans 和 org.springframework.context 包是Spring Framework的IOC容器的基础。

其中，BeanFactory是顶层设计接口，提供了配置框架和基本功能：
```java
package org.springframework.beans.factory;

import org.springframework.beans.BeansException;
import org.springframework.core.ResolvableType;
import org.springframework.lang.Nullable;

public interface BeanFactory {
    String FACTORY_BEAN_PREFIX = "&";

    Object getBean(String var1) throws BeansException;

    <T> T getBean(String var1, Class<T> var2) throws BeansException;

    Object getBean(String var1, Object... var2) throws BeansException;

    <T> T getBean(Class<T> var1) throws BeansException;

    <T> T getBean(Class<T> var1, Object... var2) throws BeansException;

    <T> ObjectProvider<T> getBeanProvider(Class<T> var1);

    <T> ObjectProvider<T> getBeanProvider(ResolvableType var1);

    boolean containsBean(String var1);

    boolean isSingleton(String var1) throws NoSuchBeanDefinitionException;

    boolean isPrototype(String var1) throws NoSuchBeanDefinitionException;

    boolean isTypeMatch(String var1, ResolvableType var2) throws NoSuchBeanDefinitionException;

    boolean isTypeMatch(String var1, Class<?> var2) throws NoSuchBeanDefinitionException;

    @Nullable
    Class<?> getType(String var1) throws NoSuchBeanDefinitionException;

    @Nullable
    Class<?> getType(String var1, boolean var2) throws NoSuchBeanDefinitionException;

    String[] getAliases(String var1);
}
```

ApplicationContext 是 BeanFactory 的一个子接口，是一个完整的超集：
```java
package org.springframework.context;

import org.springframework.beans.factory.HierarchicalBeanFactory;
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.core.env.EnvironmentCapable;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.lang.Nullable;

public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
    @Nullable
    String getId();

    String getApplicationName();

    String getDisplayName();

    long getStartupDate();

    @Nullable
    ApplicationContext getParent();

    AutowireCapableBeanFactory getAutowireCapableBeanFactory() throws IllegalStateException;
}

```
相对BeanFactory而言，ApplicationContext提供了更多符合企业级应用需求的功能如国际化Message resource处理、事件发布、特定上下文WebApplicationContext用于web应用等。  

## IOC容器的第一个程序

我们先创建两个bean，使用xml配置进行元数据描述，最后用spring提供的容器将其加载运行。

- 1）创建bean
StudentInfo.java:  
```java
package com.gyd.springdemo.ioc;

public class StudentInfo {
    /**学生编号*/
    private String stuNo;
    /**学生姓名*/
    private String stuName;
    /**所属班级*/
    private ClassesInfo classesInfo;
    public String getStuNo() {
        return stuNo;
    }

    public void setStuNo(String stuNo) {
        this.stuNo = stuNo;
    }

    public String getStuName() {
        return stuName;
    }

    public void setStuName(String stuName) {
        this.stuName = stuName;
    }

    public ClassesInfo getClassesInfo() {
        return classesInfo;
    }

    public void setClassesInfo(ClassesInfo classesInfo) {
        this.classesInfo = classesInfo;
    }
}
```

--- 

ClassesInfo.java：  
```java
package com.gyd.springdemo.ioc;

public class ClassesInfo {
    /**班级名称*/
    private String classesNo;
    /**班级姓名*/
    private String classesName;

    public String getClassesNo() {
        return classesNo;
    }

    public void setClassesNo(String classesNo) {
        this.classesNo = classesNo;
    }

    public String getClassesName() {
        return classesName;
    }

    public void setClassesName(String classesName) {
        this.classesName = classesName;
    }
}

```

- 2）配置bean
下面的例子显示了 bean 对象配置文件（bean.xml）：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- bean -->

    <bean id="student" class="com.gyd.springdemo.ioc.StudentInfo">
        <property name="stuName" value="张三"/>
        <property name="stuNo" value="1001"/>
        <property name="classesInfo" ref="classes"/>
    </bean>

    <bean id="classes" class="com.gyd.springdemo.ioc.ClassesInfo">
        <property name="classesName" value="精英班"/>
        <property name="classesNo" value="1001"/>
    </bean>

</beans>

```
在上面xml配置中，定义了两个bean：student和classes。property name 元素指的是 JavaBean 属性的名称，而 ref 元素(依赖)指的是另一个Bean定义的名称。id 和 ref 元素之间的这种联系表达了协作对象之间的依赖关系。


- 3）使用IOC容器构建和读取bean
ApplicationContext 是一个高级工厂的接口，这里使用它的一个实现类ClassPathXmlApplicationContext来启动一个容器实例: 

```java
ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
```

ApplicationContext实现维护不同Bean及其依赖关系的注册表，通过使用方法```T getBean(String name, Class<T> requiredType)```，可以读取Bean定义（definition）以及找到到Bean的实例：

```java
// 检索配置的实例
StudentInfo studentInfo = context.getBean("student",StudentInfo.class);
System.out.print(student.getStuName());
```

到此为止，我们使用spring容器完成了对自定义bean的简单管理，整个过程不需要我们自己主动使用new操作符创建bean以及对依赖进行关联，一切都交由Spring IOC容器来管理。


## Bean的概念
从前面使用容器的简单例子中可以看到，我们使用IOC容器能方便的获取Bean的实例信息，由此衍生出IOC和Bean的关系：
```
一个Spring IoC容器管理着一个或多个Bean。这些Bean是用开发者提前描述好的bean配置文件提供给容器进行创建的。
```

那么，Spring IOC容器是如何保存Bean的信息呢？ 这里有一个重要的定义：BeanDefinition。

### BeanDefinition定义
BeanDefinition 对象结构中有以下几个要素：
- 一个全路径类名：通常，被定义的Bean的实际实现类。

- Bean的行为配置元素，它说明了Bean在容器中的行为方式（scope、生命周期回调，等等）。

- 对其他Bean的引用，这些Bean需要做它的工作。这些引用也被称为合作者或依赖。

- 要在新创建的对象中设置的其他配置设置—​例如，pool的大小限制或在管理连接池的Bean中使用的连接数。


SpringIOC容器通过读取开发者提供的配置文件 生成对应的BeanDefinition来管理bean，同时也支持开发者在IOC容器外部手动创建Bean并注册到IOC容器中进行管理(通常不建议这样做)。
```
自定义Bean通过 getBeanFactory() 方法访问 ApplicationContext 的 BeanFactory 来实现，该方法返回 DefaultListableBeanFactory 实现。
DefaultListableBeanFactory 通过 registerSingleton(..) 和 registerBeanDefinition(..) 方法支持这种注册。 
```

更多Bean的详细描述，请查阅Spring官方[Bean概览](https://docs.spring.io/spring-framework/reference/core/beans/definition.html"Bean概览")  
 
### 实例化Bean的三种方式
- 1）用构造函数进行实例化
  需要有默认构造函数:
  ```
  <bean id="exampleBean" class="examples.ExampleBean"/>
  ```
- 2）用静态工厂方法进行实例化
   
  定义静态工厂方法：  
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
- 3）用实例工厂方法进行实例化
  定义实例工厂方法
  ```
  public class DefaultServiceLocator {

    private static ClientService clientService = new ClientServiceImpl();

    private static AccountService accountService = new AccountServiceImpl();

    public ClientService createClientServiceInstance() {
        return clientService;
    }

    public AccountService createAccountServiceInstance() {
        return accountService;
    }
  }

  ```

  ```
    <bean id="serviceLocator" class="examples.DefaultServiceLocator">
    </bean>

  <bean id="clientService"
    factory-bean="serviceLocator"
    factory-method="createClientServiceInstance"/>

  <bean id="accountService"
    factory-bean="serviceLocator"
    factory-method="createAccountServiceInstance"/>
  ```
 
### Bean的作用域Scope

![Bean的六种作用域](http://cdn.gydblog.com/images/spring/spring-ioc-3.png)

配置示例：
```
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

六种作用域的解释：
- 1）singleton
   默认情况，一个bean在同一个IOC容器中只会有一个实例，单例模式。
   ![singleton作用域](http://cdn.gydblog.com/images/spring/spring-ioc-4.png)

   
  作为一项规则，我们应该对无状态的 bean 使用 singleton scope。
- 2）prototype
  将单个Bean定义的Scope扩大到任何数量的对象实例(每次都重新创建),原型模式。
  ![prototype作用域](http://cdn.gydblog.com/images/spring/spring-ioc-5.png)

  作为一项规则，我们应该对所有有状态的 bean 使用 prototype scope。
- 3）request
  每个HTTP请求都有自己的Bean实例，该实例是在单个Bean定义的基础上创建的。只在Web感知的Spring ApplicationContext 的上下文中有效。

- 4）session
  每个客户端session都有自己的Bean实例。只在Web感知的Spring ApplicationContext(如XmlWebApplicationContext) 的上下文中有效。

- 5）application
  每个ServletContext都有自己的Bean实例。只在Web感知的Spring ApplicationContext 的上下文中有效。

- 6）websocket
  每个websocket链接都有自己的Bean实例。仅在具有Web感知的 Spring ApplicationContext 的上下文中有效。

Spring是扩展性极强的，也支持自定义作用域，若有兴趣的可以查阅Spring官方文档

#### 初始 Web 配置
为了支持Bean在 request、 session、application 和 Websocket 级别的scope（Web scope 的Bean），在定义Bean之前，需要一些小的初始配置。（对于标准作用域（singleton 和 prototype）来说，这种初始设置是不需要的）。
如果是在Spring Web MVC中访问 scope 内的Bean，实际上是在一个由Spring DispatcherServlet 处理的请求（request）中，就不需要进行特别的设置。 DispatcherServlet 已经暴露了所有相关的状态。  

如果是使用Servlet Web容器，在Spring的 DispatcherServlet 之外处理请求（例如，在使用JSF时），需要注册 org.springframework.web.context.request.RequestContextListener:
```xml
<web-app>
    ...
    <listener>
        <listener-class>
            org.springframework.web.context.request.RequestContextListener
        </listener-class>
    </listener>
    ...
</web-app>
```

如果上面的Listener设置有问题，可以换成使用Spring的 RequestContextFilter：

```xml
  <web-app>
      ...
      <filter>
          <filter-name>requestContextFilter</filter-name>
          <filter-class>org.springframework.web.filter.RequestContextFilter</filter-class>
      </filter>
      <filter-mapping>
          <filter-name>requestContextFilter</filter-name>
          <url-pattern>/*</url-pattern>
      </filter-mapping>
      ...
  </web-app>
 ```

DispatcherServlet、RequestContextListener 和 RequestContextFilter 都做了完全相同的事情，即把HTTP请求对象绑定到为该请求服务的 Thread。这使得 request scope 和 session scope 的Bean可以在调用链的更远处使用。

### Bean的懒加载
默认情况下，Spring的IOC容器 的实现会初始化好所有的 单例 Bean的实例，但也支持让开发者通过将Bean定义标记为懒加载来阻止单例Bean的预实例化。懒加载的 bean 告诉IoC容器在第一次被请求时创建一个bean实例，而不是在启动时。 

如何配置懒加载：
- <bean/> 元素上的 lazy-init 属性控制单个bean的延迟加载
```xml
<bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
<bean name="not.lazy" class="com.something.AnotherBean"/>
```

- 使用 <beans/> 元素上的 default-lazy-init 属性来控制容器级的懒加载
```xml
<beans default-lazy-init="true">
    <!-- no beans will be pre-instantiated... -->
</beans>
```


### Bean的回调函数
Spring框架提供了许多扩展点接口，让开发者可以干预Bean的创建和销毁的整个过程。
#### 生命周期回调
从Spring 2.5开始，提供了三个选项来控制Bean的生命周期行为。
```
1.InitializingBean 和 DisposableBean callback 接口。

2.自定义 init() and destroy() 方法。

3.@PostConstruct 和 @PreDestroy 注解。
```

这三个选项的使用方式类似，下面使用InitializingBean 和DisposableBean进行说明。
1） 初始化回调InitializingBean 
InitializingBean 接口指定了一个方法：
```java
void afterPropertiesSet() throws Exception;
```
org.springframework.beans.factory.InitializingBean 接口让Bean在容器对Bean设置了所有必要的属性后执行初始化工作。

最佳实践：建议不要直接使用 InitializingBean 接口，因为它将代码与Spring耦合。建议使用注解@PostConstruct。


2）销毁回调DisposableBean 
DisposableBean 接口指定了一个方法：
```
void destroy() throws Exception;
```
实现 org.springframework.beans.factory.DisposableBean 接口可以让Bean在包含它的容器被销毁时获得一个回调。


最佳实践：建议不要直接使用 DisposableBean 接口，因为它将代码与Spring耦合。建议使用注解@PreDestroy 

#### 启动和关闭的回调
当 ApplicationContext 本身收到启动和停止信号时（例如，在运行时的停止/重启场景），均会进行启动和关闭的回调。

任何Spring管理的对象都可以实现 Lifecycle 接口，Lifecycle 接口定义了一些启动和关闭的基本方法：
```java
public interface Lifecycle {

    void start();

    void stop();

    boolean isRunning();
}
```

面试的时候会问：如何优雅地关闭Spring IoC容器？
答案：如果是在非web应用环境中使用Spring的IoC容器，可以向JVM注册一个shutdown hook。这样做就可以确保JVM关闭前会回调我们实现的Bean销毁函数destroy，从而释放所有资源。
```java
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        //注意需要获取容器的实现ConfigurableApplicationContext，才能注册shutdown hook!
        ConfigurableApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

        // add a shutdown hook for the above context...
        ctx.registerShutdownHook();

        // app runs here...

        // main method exits, hook is called prior to the app shutting down...
    }
}


```

#### 各种Aware接口
有时候我们需要获取容器本身的一些信息，可以通过各种Aware接口来注入，比如获取IOC容器的引用可以实现ApplicationContextAware。
```java
public interface ApplicationContextAware {
    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```
Spring提供了许多的Aware接口，让我们方便的获取基础设施相关的信息，但不建议这样做，因为会让业务代码和Spring框架过多的耦合。

  ![Aware接口](http://cdn.gydblog.com/images/spring/spring-ioc-9.png)

如果我们想在Spring容器完成实例化、配置和初始化、销毁Bean时实现一些自定义逻辑，可以来实现上面这些扩展点接口。

## 依赖注入(DI)
依赖注入（DI）是一个过程，对象仅通过构造参数、工厂方法的参数或在对象实例被构造或从工厂方法返回后在其上设置的属性来定义它们的依赖（即与它们一起工作的其它对象）。然后，容器在创建 bean 时注入这些依赖。这个过程从根本上说是Bean本身通过使用类的直接构造或服务定位模式来控制其依赖的实例化或位置的逆过程（因此被称为控制反转）  

采用DI的好处： 
- 代码会更干净
 当对象被提供其依赖时，解耦会更有效。对象不会查找其依赖，也不知道依赖的位置或类别。

- 更容易测试 
类变得更容易测试，特别是当依赖是在接口或抽象基类上时，这允许在单元测试中使用stub或mock实现。

DI的方式有两种：
1）基于构造器的依赖注入  
基于构造函数的 DI 是通过容器调用带有许多参数的构造函数来完成的，每个参数代表一个依赖。  
```java
package com.gyd;
public class TestBean {

    public ThingOne(TestBean thingTwo, TestBean thingThree) {
        // ...
    }
}
```

```xml
<beans>
    <bean id="beanOne" class="com.gyd.TestBean">
        <constructor-arg ref="beanTwo"/>
        <constructor-arg ref="beanThree"/>
    </bean>

    <bean id="beanTwo" class="com.gyd.TestBean"/>

    <bean id="beanThree" class="com.gyd.TestBean"/>
</beans>

```

2）基于Setter的依赖注入  
基于 Setter 的 DI 是通过容器在调用无参数的构造函数或无参数的 static 工厂方法来实例化你的 bean 之后调用 Setter 方法来实现的。
```java
public class TestBean {

  private TestBean sub;
  public void setSub(TestBean sub) {
      this.sub = sub;
  }

}
```

Spring支持混合使用基于 构造函数的DI和基于Setter的DI。
:::warning 注意
但是Spring推荐对强制依赖使用构造函数，对可选依赖使用setter方法或配置方法。
:::

### 循环依赖问题
创建 bean 有可能导致创建 bean 图（graph，也就是循环依赖）  

![循环依赖](http://cdn.gydblog.com/images/spring/spring-ioc-8.png)

> 这也是面试中的高频问题

发生场景(一个典型的鸡生蛋蛋生鸡的场景)：
```
比如说类A通过构造函数注入需要类B的一个实例，而类B通过构造函数注入需要类A的一个实例。
如果将A类和B类的Bean配置为相互注入，Spring IoC容器会在运行时检测到这种循环引用，并抛出一个循环依赖错误 BeanCurrentlyInCreationException。
```

解决方法：
```
使其通过setter而不是构造器进行配置。或者避免构造器注入，只使用setter注入。
```

解决原理：
Spring 通过三级缓存机制解决 **循环依赖** 问题。

接下来我们学习一下什么是三级缓存。

### 三级缓存原理
一张图概括Spring IOC容器获取单例Bean实例的流程：

![图片来源于网络](http://cdn.gydblog.com/images/spring/spring-ioc-7.png)

上面的图中完整描述了SpringIOC容器获取单例Bean的过程， 接下来我们摘录核心源码片段来学习。

核心源码片段1-三级缓存定义：
```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	...
	// 从上至下 分表代表这“三级缓存”
	private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256); //一级缓存
	private final Map<String, Object> earlySingletonObjects = new HashMap<>(16); // 二级缓存
	private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16); // 三级缓存
	...
	
	/** Names of beans that are currently in creation. */
	// 这个缓存也十分重要：它表示bean创建过程中都会在里面呆着~
	// 它在Bean开始创建时放值，创建完成时会将其移出~
	private final Set<String> singletonsCurrentlyInCreation = Collections.newSetFromMap(new ConcurrentHashMap<>(16));

	/** Names of beans that have already been created at least once. */
	// 当这个Bean被创建完成后，会标记为这个 注意：这里是set集合 不会重复
	// 至少被创建了一次的  都会放进这里~~~~
	private final Set<String> alreadyCreated = Collections.newSetFromMap(new ConcurrentHashMap<>(256));
}
```
从上面的源码可以看到，Spring的三级缓存其实就是三个缓存Map，这三个map的定位：
- singletonObjects：第一级缓存，用于存放完全初始化好的 bean，从该缓存中取出的 bean 可以直接使用
- earlySingletonObjects：第二级缓存，提前曝光的单例对象的cache，存放原始的 bean 对象（尚未填充属性），用于解决循环依赖
- singletonFactories：第三级缓存，单例对象工厂的cache，存放 bean 工厂对象，用于解决循环依赖


核心源码片段3-从IOC容器中获取单例bean：
```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	...
	@Override
	@Nullable
	public Object getSingleton(String beanName) {
		return getSingleton(beanName, true);
	}
	@Nullable
	protected Object getSingleton(String beanName, boolean allowEarlyReference) {
		Object singletonObject = this.singletonObjects.get(beanName);
		if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
			synchronized (this.singletonObjects) {
				singletonObject = this.earlySingletonObjects.get(beanName);
				if (singletonObject == null && allowEarlyReference) {
					ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
					if (singletonFactory != null) {
						singletonObject = singletonFactory.getObject();
						this.earlySingletonObjects.put(beanName, singletonObject);
						this.singletonFactories.remove(beanName);
					}
				}
			}
		}
		return singletonObject;
	}
	...
	public boolean isSingletonCurrentlyInCreation(String beanName) {
		return this.singletonsCurrentlyInCreation.contains(beanName);
	}
	protected boolean isActuallyInCreation(String beanName) {
		return isSingletonCurrentlyInCreation(beanName);
	}
	...
}
```

上方源码片段就是IOC容器使用三级缓存的Map对象进行Bean获取的整个过程，流程总结如下：
1) 先从一级缓存singletonObjects中去i获取，如果获取到就直接返回
2) 如果获取不到或者对象正在创建中（sSingletonCurrentlyInCreation()），那就再从二级缓存earlySingletonObjects中获取，如果获取到就直接return。
3) 如果第二步还是获取不到，且允许singletonFactories（allowEarlyReference=true）通过getObject()获取。就从三级缓存singletonFactory.getObject()获取。如果获取到了就从第三级缓存singletonFactories中移除，并且放进二级缓存earlySingletonObjects。

> 这里加入singletonFactories第三级缓存的前提是执行了构造方法，所以构造方法注入方式的循环依赖没法解决，Spring框架会直接抛出循环依赖错误。
 
## 总结
本文粗略总结了IOC容器、Bean的相关概念，并且重点总结了Spring框架解决Bean的循环依赖问题思路，最后对常见面试题三级缓存进行了原理说明。  

本文并没有记录太多细节，因为小郭认为在学习技术的过程中只要了解核心流程和原理性质的知识即可，其余知识点可以在需要用的时候通过查阅官方手册现学现用。