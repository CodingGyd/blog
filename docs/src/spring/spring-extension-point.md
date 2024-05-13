---
title: Spring系列笔记-Spring的内置常用扩展点
shortTitle: Spring的内置常用扩展点
date: 2023-08-15
category:
  - 开源框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring5,Spring总结,Spring核心知识
---

# Spring的内置常用扩展点
:::tip 写在前面
大家好，我是代码小郭，又来和大家分享知识啦！

小郭写文章的目的就是为了促进自己技术的成长，同时分享给大家一起学习交流，如果您对 Java领域感兴趣，可以关注我，我们一起学习。
:::

## 开心一刻  
  
小明：“妈，我被公司开除了”

妈：“啊，为什么呀？”，

小明：“我骂董事长是笨蛋，公司召开高层会议还要起诉我”

妈：“告你诽谤是吧？”

小明：“不是，他们说要告我泄露公司机密”
![](http://cdn.gydblog.com/images/sucai/sc-6.gif)


今天小郭摸鱼学习了Spring的扩展点的相关概念和应用场景，给大家汇报一下我的学习笔记，大家往下看👇👇👇

## 一、前言
众所周知，Spring是一个非常优秀的开源框架，目前在JAVA企业应用领域基本上可以说是绝对的霸主，无人不知。这得益于它本身巧妙的设计理念：对修改封闭，对扩展开放，这也是设计模式中的开闭原则。  

正因为这个设计理念让Spring能够快速支持整合其它的中间件技术，Spring基于此能力从一开始的框架演变成了如今的Spring生态。 

小郭将今天学习到的Spring常用扩展点技术整理成了笔记，分享给大家。我们在日常工作中如果能灵活的运用这些扩展点，将会事半功倍哦！

## 二、扩展点概览
![Spring的常见扩展点](http://cdn.gydblog.com/images/spring/spring-extension-point-1.png)

## 三、Bean相关扩展点
### 1、生命周期回调
1）初始化回调InitializingBean/@PostConstruct
InitializingBean接口为bean提供了属性初始化后的处理方法，它提供了一个afterPropertiesSet方法，凡是继承该接口的类，在bean的属性初始化后都会执行该方法。  

@PostConstruct是Spring提供的注解方式，功能和InitializingBean一样，官方建议使用注解方式。  

使用示例：
```java
@Component
public class MyBean implements InitializingBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("启动时加载了我afterPropertiesSet...");
    }

    @PostConstruct
    public void init() {
        System.out.println("启动时加载了我@PostConstruct...");
    }
}
```
程序启动时输出日志如下：  

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-2.png)

从输出结果可以看出@PostConstruct会先于InitializingBean执行。  

2）销毁回调DisposableBean/@PreDestroy  
DisposableBean 接口可以让Bean在包含它的容器被销毁时(Spring实例停止运行时)获得一个回调。DisposableBean 接口提供了一个方法destroy，凡是继承该接口的类，在Spring实例停止时会执行该方法。  

@PreDestroy 是Spring提供的注解方式，功能和DisposableBean 一样，官方建议使用注解方式。

使用示例：
```java
@Component
public class MyBean implements DisposableBean {
    @PreDestroy
    public void init() {
        System.out.println("销毁前加载了我@PostConstruct...");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("销毁前加载了我destroy...");
    }
}
```

程序启动输出日志如下：  

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-3.png)

从输出结果可以看出@PreDestroy会先于DisposableBean执行。  

3）启动和关闭的回调Lifecycle  


Lifecycle 接口定义了任何有自己的生命周期要求的对象的基本方法（如启动和停止一些后台进程）。当 ApplicationContext 本身收到启动和停止信号时，会回调实现了该接口的类的start和stop方法

使用示例：  
```java
public class MyLifeCycle implements Lifecycle {
  private volatile boolean running = false;

  @Override
  public void start() {
      running = true;
      System.out.println("我是Lifecycle.start");
  }

  @Override
  public void stop() {
      running = false;
      System.out.println("我是Lifecycle.stop");
  }

  @Override
  public boolean isRunning() {
      System.out.println("我是Lifecycle.isRunning");
      return running;
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      //使用 Lifecycle这种方式，需要显示的调用容器的 start、stop方法
      context.start();
      context.stop();
  }
}
```

程序启动后输出日志如下:  
![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-4.png)

但是Lifecycle的触发需要我们显示去调用容器实例的start和stop方法，这个在官方文档中是有说明的：
```
请注意，常规的 org.springframework.context.Lifecycle 接口是一个明确的start和stop通知的普通约定，并不意味着在上下文刷新时自动启动。如果要对特定Bean的自动启动进行细粒度控制（包括启动阶段），可以考虑实现 org.springframework.context.SmartLifecycle 来代替。
```

spring提供了另外一种方式SmartLifecycle，支持自动执行。除了继承Lifecycle之外，它还继承了 Phased。并且新增了几个方法：
- getPhase：来自于 Phased 接口，当容器中有多个实现了 SmartLifecycle的类，这个时候可以依据 getPhase方法返回值来决定start 方法、 stop方法的执行顺序。 start 方法执行顺序按照 getPhase方法返回值从小到大执行，而 stop方法则相反。比如： 启动时：1 比 3 先执行，-1 比 1 先执行，退出时：3 比 1 先退出，1 比 -1 先退出。
- isAutoStartup：是否自动启动。为 true，则自动调用start()；为 false，则需要显示调用 start()。
- stop：当 isRunning 方法返回 true 时，该方法才会被调用。
 
使用示例：
```java
@Component
public class CustomizeSmartLifecycle implements SmartLifecycle {
  @Override
  public void start() {
      System.out.println("SmartLifecycle.start");
  }

  @Override
  public void stop() {
      System.out.println("SmartLifecycle.stop");
  }

  @Override
  public boolean isRunning() {
      System.out.println("SmartLifecycle.isRunning");
      return false;
  }

  @Override
  public boolean isAutoStartup() {
      System.out.println("SmartLifecycle.isAutoStartup");
      return SmartLifecycle.super.isAutoStartup();
  }

  @Override
  public void stop(Runnable callback) {
      System.out.println("SmartLifecycle.stop(callback)");
      SmartLifecycle.super.stop(callback);
  }

  @Override
  public int getPhase() {
      System.out.println("SmartLifecycle.getPhase");
      return SmartLifecycle.super.getPhase();
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      //这里不需要显示调用容器的开始和关闭方法了
      //context.start();
      //context.stop();
  }
}
```

程序启动输出日志如下：  
![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-5.png)

从上面的日志发现好像没有执行Lifecycle的stop方法呀？ 咦？怎么肥四？
经过查找前人资料，得到了答案：这是因为容器类型问题。如果在Spring Boot项目会自动执行的。


Lifecycle或SmartLifecycle 的运用场景还是比较多的。

SmartLifecycle不仅仅能在容器初始化后执行一个逻辑，还能在它关闭前执行一个逻辑，

比如一个服务在容器启动时向服务注册中心发一个信号告诉它服务上线了，下线前通知它我下线了。也就是实现了一个 从生到死 的闭环通知。

再比如我们想在容器本身的生命周期（比如容器启动、停止）的事件上做一些工作等 都能用到上面的机制啦！


4） 优雅关闭程序的钩子

我们的java程序运行在JVM上，有很多情况可能会突然崩溃掉，比如OOM、用户强制退出、业务其他报错等一系列的问题可能导致我们的进程挂掉。如果我们的进程在运行一些很重要的内容，比如事务操作之类的，很有可能导致事务的不一致性问题。所以，实现应用的优雅关闭还是蛮重要的，起码我们可以在关闭之前做一些记录补救操作。

如果我们正在一个非web应用的环境下使用Spring的IoC容器，如dubbo服务，想让容器优雅的关闭，并调用scopre为singleton的bean相应destory回调方法，
只需要在JVM里注册一个“关闭钩子”（shutdown hook）即可， 这个钩子就是ConfigurableApplicationContext.registerShutdownHook。  

使用示例：
```java
// 通过这种方式来添加钩子函数
ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
context.registerShutdownHook();
```


### 2、获取容器基础设施信息
有时候我们需要获取容器本身的一些信息或者容器内其它bean的一些信息，那么可以通过本节的方式来处理。 

1）ApplicationContextAware

ApplicationContextAware接口的继承者会被提供 ApplicationContext 的引用，接口定义如下：
```java
public interface ApplicationContextAware {
  void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

我们的Bean可以通过 ApplicationContextAware提供的ApplicationContext 接口或通过将引用转换为该接口的已知子类（如 ConfigurableApplicationContext），以编程方式获取容器的其它信息。或者对容器中的其他Bean进行编程式操作(但Spring官方不建议这样做，因为它将代码与Spring容器耦合在一起，并且不遵循控制反转)。


使用示例：
```java
public class MyBean implements ApplicationContextAware {

  private ApplicationContext applicationContext;
  @Override
  public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
      System.out.println("执行了setApplicationContext。。。");
      this.applicationContext = applicationContext;
  }

  public void printOther() {
      //获取容器的一些基本信息
      System.out.println("getApplicationName:"+applicationContext.getApplicationName());
      System.out.println("getDisplayName:"+applicationContext.getDisplayName());
      System.out.println("getStartupDate:"+applicationContext.getStartupDate());
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      MyBean myBean = context.getBean("myBean",MyBean.class);
      myBean.printOther();
  }
}
```

程序执行输出日志如下：  

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-6.png)


2）BeanNameAware
BeanNameAware接口的实现类被提供了相关bean定义的名称的引用， BeanNameAware 接口的定义：
```java
public interface BeanNameAware {
  void setBeanName(String name) throws BeansException;
}
```

使用示例：  
```java
public class MyBean implements BeanNameAware {
  @Override
  public void setBeanName(String s) {
      System.out.println("beanName="+s);
  }
}
```

```java
public class Main {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      MyBean myBean = context.getBean("myBean",MyBean.class);
  }
}
```

程序执行输出日志：  

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-7.png)

BeanNameAware的典型用例可能是获取bean名称以进行日志记录或埋点，对于BeanFactoryAware，它可以使用扩展代码中的spring bean。 


spring还提供了许多其它的Aware接口供回调使用，下图总结了最重要的Aware接口清单：  

![最重要的Aware接口总览](http://cdn.gydblog.com/images/spring/spring-extension-point-8.png)

> 在大多数情况下，我们应该避免使用任何Aware接口，除非我们需要它们，实现这些接口会将代码耦合到Spring框架。

## 四、容器相关扩展点

### 1、BeanPostProcessor

BeanPostProcessor也称为Bean后置处理器，它是Spring中定义的接口，在Spring容器的创建过程中（具体为Bean初始化前后）会回调BeanPostProcessor中定义的两个方法。Spring支持我们配置多个 BeanPostProcessor 实例，可以通过设置 order 属性控制这些 BeanPostProcessor 实例的运行顺序。

BeanPostProcessor的定义如下:
```java
public interface BeanPostProcessor {
  //在每一个bean对象的初始化方法调用之前回调
  @Nullable
  default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      return bean;
  }

  //在每个bean对象的初始化方法调用之后被回调
  @Nullable
  default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      return bean;
  }
}
```

使用示例：
```java
public class CustomBeanPostProcessor implements BeanPostProcessor {
  @Override
  public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      if (bean instanceof MyBean) {
        System.out.println("postProcessBeforeInitialization:beanName="+beanName);
      }
      return bean;
  }

  @Override
  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      if (bean instanceof MyBean) {
        System.out.println("postProcessAfterInitialization:beanName="+beanName);
      }
      return bean;
  }
}
```

```java
public class MyBean{
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->
    <bean id="myBean" class="com.gyd.springdemo.ioc.MyBean" >
    </bean>
    <bean id="customBeanPostProcessor" class="com.gyd.springdemo.ioc.CustomBeanPostProcessor" >
    </bean>

</beans>

```

上面代码创建了一个业务bean和一个BeanPostProcess接口实现。

程序执行日志输出如下： 

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-9.png)


BeanPostProcessor的典型应用场景就是AOP了， 我们只需要写一个BeanPostProcessor的实现类，在postProcessBeforeInitialization或者postProcessAfterInitialization方法中，对特定对象进行判断，判断是否需要织入切面逻辑，如果需要，那就根据当前对象生成一个代理对象，然后返回这个代理对象放入容器中。
 
### 2、BeanFactoryPostProcessor
这个扩展点的执行发生在bean实例化之前，BeanDefinition读取完之后。所以我们在这里可以获取到BeanDefinition，以改变他默认的实例化方式。该扩展点提供的接口定义如下：
```java
@FunctionalInterface
public interface BeanFactoryPostProcessor {
    void postProcessBeanFactory(ConfigurableListableBeanFactory var1) throws BeansException;
}
```

BeanDefinitionRegistryPostProcessor这个接口是 BeanFactoryPostProcessor的子接口，一般说来这个接口更更常用。


BeanFactoryPostProcessor及其子类的使用场景有很多，例如修改bean属性值，实现bean动态代理等。
很多框架都是通过此接口实现对spring容器的扩展，例如mybatis与spring集成时，只定义了mapper接口，无实现类，但spring却可以完成自动注入。
再比如在RPC框架dubbo中的 ReferenceAnnotationBeanPostProcessor 就是实现上面接口，扫描Spring容器中所有的Bean，查找带有@Reference注解的服务引用，并为其创建代理对象。这个代理对象会拦截服务消费者对服务提供者的调用，并通过Dubbo框架实现远程调用。这样，服务消费者就可以像调用本地服务一样调用远程服务，而不需要关心远程调用的细节。


### 3、FactoryBean 
面试中会遇到这样的问题：请说说FactoryBean和BeanFactory的区别？

遇到此类你是否会懵圈？

其实区分比较简单，稍微了解下就知道区别了，这个问题能过滤一部分程序员渣渣。

BeanFactory是用于访问Spring bean容器的根接口，也就是IoC容器，我们在项目中更常用的ApplicationContext就是一个BeanFactory。我们通过bean的名称或者类型都可以从BeanFactory来获取bean。对于BeanFactory这么介绍相信都不陌生了。让我们把关注点转向FactoryBean上。

FactoryBean 是个什么玩意儿呢？来看看源码：
```java
public interface FactoryBean<T> {
  String OBJECT_TYPE_ATTRIBUTE = "factoryBeanObjectType";

  //获取泛型T的实例。用来创建Bean。
  @Nullable
  T getObject() throws Exception;

  //获取 T getObject()中的返回值 T 的具体类型，强烈建议如果T是一个接口，返回其具体实现类的类型
  @Nullable
  Class<?> getObjectType();

  //用来规定 Factory创建的的bean是否是单例。这里通过默认方法定义为单例。
  default boolean isSingleton() {
      return true;
  }
}

```

FactoryBean是一个bean，可以作为其他bean的工厂。FactoryBean像其他bean一样在注入到IoC容器中，但是当从IoC容器中获取FactoryBean的时候，实际返回的FactoryBean#getObject()方法返回的对象。如果想获取FactoryBean本身，则需要在bean的名称添加前缀&来获取FactoryBean对象本身（applicationContext.getBean("&" + beanName)）。

著名的Mybatis框架就是是通过FactoryBean对象创建Mapper对象的代理对象，完成Mapper接口的注入。有兴趣的伙伴可以去了解下具体细节。

### 4、ApplicationListener
  Spring的事件机制是观察者设计模式的实现，通过ApplicationEvent类和ApplicationListener接口，可以实现ApplicationContext事件处理。

  ApplicationListener是Spring事件机制的一部分，与抽象类ApplicationEvent类配合来完成ApplicationContext的事件机制。 

  如果容器中有一个ApplicationListener的实现 Bean，每当ApplicationContext发布ApplicationEvent时，ApplicationListener Bean将自动被触发。
  
  这种事件机制都必须需要程序显示的触发，当ApplicationContext调用publishEvent方法时，对应的ApplicationListener实现Bean会被触发。

ApplicationListener的源码如下： 
```java
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E event);

    static <T> ApplicationListener<PayloadApplicationEvent<T>> forPayload(Consumer<T> consumer) {
        return (event) -> {
            consumer.accept(event.getPayload());
        };
    }
}
```

使用示例：
- 首先写一个ApplicationListener的实现类
```java
public class MyApplicationListener implements ApplicationListener<ApplicationEvent> {

    // 当容器中发布此事件以后，下面这个方法就会被触发
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        System.out.println("收到事件：" + event);
    }
} 
```

- xml方式注册bean到容器(注解方式也可以)
```java
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="listener" class="com.gyd.springdemo.ioc.MyApplicationListener" >
    </bean>
</beans>
```

- 测试启动类
```java
public class Main {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      // 关闭容器 触发监听事件回调
      context.close();
  }
}
```

程序执行输出日志如下： 

![控制台日志](http://cdn.gydblog.com/images/spring/spring-extension-point-10.png)

可以看到我们收到了两个事件，这两个事件分别是org.springframework.context.event.ContextRefreshedEvent和org.springframework.context.event.ContextClosedEvent，其中第一个是容器已经刷新完成事件，第二个是容器关闭事件。

### 5、ApplicationContextInitializer

ApplicationContextInitializer是Spring框架原有的概念, 这个类的主要目的就是在ConfigurableApplicationContext类型（或者子类型）的ApplicationContext做refresh之前，允许我们对ConfigurableApplicationContext的实例做进一步的设置或者处理。  
```java
@FunctionalInterface
public interface ApplicationContextInitializer<C extends ConfigurableApplicationContext> {
    void initialize(C applicationContext);
}
```


该接口典型的应用场景是web应用中需要编程方式对应用上下文做初始化。比如，注册属性源(property sources)或者针对上下文的环境信息environment激活相应的profile。

在一个Springboot应用中，classpath上会包含很多jar包，有些jar包需要在ConfigurableApplicationContext#refresh()调用之前对应用上下文做一些初始化动作，因此它们会提供自己的ApplicationContextInitializer实现类，然后放在自己的META-INF/spring.factories属性文件中，这样相应的ApplicationContextInitializer实现类就会被SpringApplication#initialize发现：

示例：
```java
// SpringApplication#initialize方法，在其构造函数内执行，从而确保在其run方法之前完成
     private void initialize(Object[] sources) {
        if (sources != null && sources.length > 0) {
            this.sources.addAll(Arrays.asList(sources));
        }
        this.webEnvironment = deduceWebEnvironment();
        setInitializers((Collection) getSpringFactoriesInstances(
                ApplicationContextInitializer.class)); 
        setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
        this.mainApplicationClass = deduceMainApplicationClass();
    }
```


### 6、SmartInitializingSingleton
实现SmartInitializingSingleton的接口后，当所有单例 bean 都初始化完成以后，Spring的IOC容器会回调该接口的 afterSingletonsInstantiated()方法。
```java
public interface SmartInitializingSingleton {
  void afterSingletonsInstantiated();
}
```

主要应用场合就是在所有单例 bean 创建完成之后，可以在该回调中做一些事情，例如：
```java
import org.springframework.beans.factory.ListableBeanFactory;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.stereotype.Component;
 
@Component
public class MyTest implements SmartInitializingSingleton {
 
    private ListableBeanFactory beanFactory;
 
    public MyTest(ListableBeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }
 
    @Override
    public void afterSingletonsInstantiated() {
        String[] beanNames = beanFactory.getBeanNamesForType(IMyBean.class);
        for (String s : beanNames) {
            System.out.println(s);
        }
    }
 
}
```

:::tip 啰嗦一句
小郭今天的学习成果跟大家分享完毕，大家有觉得不好的地方欢迎在下方评论区开喷👇👇👇 
也可以给我点点关注鼓励一下呀👍👍👍
:::