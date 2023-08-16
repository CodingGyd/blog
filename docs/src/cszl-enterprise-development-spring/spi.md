---
title: Spring系列笔记-SPI机制
shortTitle: SPI机制
date: 2023-08-15
category:
  - JAVA企业级开发
tag:
  - spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,SPI原理,Spring笔记,Spring5,Spring总结,Spring核心知识
---
<!-- @include: ../common-top.md -->

# SPI机制

## SPI概念
SPI 全称 Service Provider Interface，是一套用来被第三方实现或者扩展的接口，经常用来替换框架本身组件或者进行框架功能扩展。

SPI的作用就是寻找扩展的服务实现，可以实现 解耦 （接口和实现分离），提高框架的 可拓展性（第三方可以自己实现，达到插拔式的效果）。

SPI的本质其实就是基于接口+策略模式+配置问卷来实现动态加载。

SPI分为多个角色：Service、Service Provider、ServiceLoader和资源文件。

## JAVA的SPI设计
JAVA内置了一套最基础的SPI，我们先来看看是如何使用的。

首先定义一个SPI顶层接口：
```java
public interface MySpi {

  String getName();

  void hello();

}
```

然后定义两个SPI的不同实现：
```java
public class ASpiImpl implements MySpi {
  @Override
  public String getName() {
      return "A";
  }

  @Override
  public void hello() {
      System.out.println(getName() + "执行");
  }
}

public class BSpiImpl implements MySpi {
  @Override
  public String getName() {
      return "B";
  }

  @Override
  public void hello() {
      System.out.println(getName() + "执行");
  }
}
```

在指定目录（META-INF.services 必须是该目录，jdk源码中写死的）下创建文件:
> 文件名是接口的全类名，文件内容是实现类的全类名。

![SPI配置文件](http://cdn.gydblog.com/images/java/java-spi-2.png)


文件中填写SPI的实现类的全路径
```
com.gyd.springdemo.spi.ASpiImpl
com.gyd.springdemo.spi.BSpiImpl
```

最后写一个启动测试类：
```java
public class TestMain {
  public static void main(String[] args) {
      ServiceLoader<MySpi> load = ServiceLoader.load(MySpi.class);
      Iterator<MySpi> iterator = load.iterator();
      while (iterator.hasNext()) {
          MySpi next = iterator.next();
          System.out.println(next.getName() + " 准备执行");
          next.hello();
      }
      System.out.println("执行结束");
  }
}
```

程序执行输出日志如下：
```
A 准备执行
A执行
B 准备执行
B执行
执行结束
```

通过上面的执行结果可以看到，我们针对MySpi的所有实现类的指定方法都得到了执行，这都是java.util.ServiceLoader的功劳。

ServiceLoader是一个简单的服务提供者加载工具。下面是JDK1.8中对应的部分源码：
```java
public static <S> ServiceLoader<S> load(Class<S> service) {
  ClassLoader cl = Thread.currentThread().getContextClassLoader();
  return ServiceLoader.load(service, cl);
}
```
可以看出load方法是通过获取currentThread当前线程的 ClassLoader线程上下文类加载器 实例来加载的。

Java应用运行的初始线程的上下文类加载器默认是系统类加载器。这里其实 破坏了双亲委派模型，因为Java应用收到类加载的请求时，按照双亲委派模型会向上请求父类加载器完成，这里并没有这么做（如果面试官让你举例破坏双亲委派模型相关问题，可以用本案例）。

iterator.hasNext()主要是通过 hasNextService()来实现的，我们来看一下主要代码。
```java
private boolean hasNextService() {
    if (nextName != null) {
        return true;
    }
    if (configs == null) {
        try {
            String fullName = PREFIX + service.getName();
            if (loader == null)
                configs = ClassLoader.getSystemResources(fullName);
            else
                configs = loader.getResources(fullName);
        } catch (IOException x) {
            fail(service, "Error locating configuration files", x);
        }
    }
    while ((pending == null) || !pending.hasNext()) {
        if (!configs.hasMoreElements()) {
            return false;
        }
        pending = parse(service, configs.nextElement());
    }
    nextName = pending.next();
    return true;
}

```
hasNextService方法会去加载 PREFIX 变量路径下的配置，PREFIX 是一个固定路径，这也就是我们为什么要在META-INF/services/下创建文件的原因。并根据 PREFIX 加上全类名获取到实现类所在的全路径。

上面使用的变量PREFIX，我们再查看ServiceLoader类，发现有一个PREFIX变量，就是前面提到的配置文件的目录路径(这也是为什么只能是这个目录的原因)：
```java
public final class ServiceLoader<S>
  implements Iterable<S>
{
  private static final String PREFIX = "META-INF/services/";
  ....
}
  ```

总结一下，java的spi的流程：

![JAVA的SPI加载流程](http://cdn.gydblog.com/images/java/java-spi-1.jpg)

JAVA SPI机制的一个劣势，是无法确认具体加载哪一个实现，也无法加载某个指定的实现，只能加载配置文件中的全部实现，而且仅靠ClassPath的顺序加载是一个非常不严谨的方式。

## Spring的SPI设计
Spring SPI其实就是基于Java SPI的设计进行了再次封装。我们只需要在 META-INF/spring.factories 中配置接口实现类名，即可通过服务发现机制，在运行时加载接口的实现类。

![Spring的SPI加载流程](http://cdn.gydblog.com/images/spring/spring-spi-1.png)

编辑好META-INF/spring.factories，基于之前JAVA的spi示例，修改一下启动程序：
```java
public class TestSpringMain {
  public static void main(String[] args) {
      List<MySpi> helloSpiList = SpringFactoriesLoader.loadFactories(MySpi.class,TestSpringMain.class.getClassLoader());
      Iterator<MySpi> iterator = helloSpiList.iterator();
      while (iterator.hasNext()) {
          MySpi next = iterator.next();
          System.out.println(next.getName() + " 准备执行");
          next.hello();
      }
      System.out.println("执行结束");
  }
}
```

程序执行输出日志如下：
```
A 准备执行
A执行
B 准备执行
B执行
执行结束
```

执行效果和JAVA的SPI一样。


Spring的SPI支持多个扩展点配置到一个文件中，如SpringBoot的spring-boot-autoconfigure-2.7.14.jar中的META-INF/spring.factories：
```
# Initializers
org.springframework.context.ApplicationContextInitializer=\
org.springframework.boot.autoconfigure.SharedMetadataReaderFactoryContextInitializer,\
org.springframework.boot.autoconfigure.logging.ConditionEvaluationReportLoggingListener

# Application Listeners
org.springframework.context.ApplicationListener=\
org.springframework.boot.autoconfigure.BackgroundPreinitializer

# Environment Post Processors
org.springframework.boot.env.EnvironmentPostProcessor=\
org.springframework.boot.autoconfigure.integration.IntegrationPropertiesEnvironmentPostProcessor

....
```

Spring的SPI 虽然属于spring-framework(core)，但是目前主要用在spring boot中……

## SPI思想的应用举例
在各种流行框架如Dubbo、JDBC、Druid、SpringBoot 中都使用到了SPI机制。虽然他们之间的实现方式不同，但原理都差不多。

下面以SpringBoot和Dubbo为例做简单说明。

### SpringBoot自动配置

SpringBoot中大量运用了Spring的SPI设计，保证了良好的扩展性。

@EnableAutoConfiguration 可以借助 SpringFactoriesLoader 这个特性将标注了 @Configuration 的 JavaConfig 类全部汇总并加载到最终的 ApplicationContext。

例如阿里的数据库连接池组件druid-spring-boot-starter:
```
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid-spring-boot-starter</artifactId>
  <version>1.1.21</version>
</dependency>
```

SpringBoot启动时，会自动扫描依赖包中的META-INF，通过配置文件（如spring.factories）来实例化所指定的配置类，及一些启动时的初始化操作。

![druid-spring-boot-starter](http://cdn.gydblog.com/images/spring/spring-spi-3.png)

如上图所示，SpringBoot启动时会将DruidDataSourceAutoConfigure作为一个配置类进行加载。

### Dubbo
Dubbo 中的扩展能力是从 JDK 标准的 SPI 扩展点发现机制加强而来。  

![dubbo的SPI流程](http://cdn.gydblog.com/images/dubbo/dubbo-spi-1.png)

通过SPI思想，用户能够基于 Dubbo 提供的扩展能力，很方便基于自身需求扩展其他协议、过滤器、路由等。

![dubbo的扩展点能力](http://cdn.gydblog.com/images/dubbo/dubbo-spi-2.png)

Dubbo 扩展能力使得 Dubbo 项目很方便的切分成一个一个的子模块，实现热插拔特性。用户完全可以基于自身需求，替换 Dubbo 原生实现，来满足自身业务需求。

Dubbo SPI 的相关逻辑被封装在了 ExtensionLoader 类中，通过 ExtensionLoader，我们可以加载指定的实现类。Dubbo SPI 所需的配置文件需放置在 META-INF/dubbo 路径下。

下面还是拿最开始的JAVA SPI的示例稍作改动来演示。

配置文件修改为：
![dubbo的SPI配置](http://cdn.gydblog.com/images/dubbo/dubbo-spi-3.png)

代码调整：
```java
//增加该注解
@SPI
public interface MySpi {

    String getName();

    void hello();

}
```

执行入口类：
```java
public class TestDubboMain {
  public static void main(String[] args) {
      ExtensionLoader<MySpi> extensionLoader =
              ExtensionLoader.getExtensionLoader(MySpi.class);
      MySpi a = extensionLoader.getExtension("a");
      a.hello();
      MySpi b = extensionLoader.getExtension("b");
      b.hello();
  }
}
```

程序执行输出日志如下：
```
11:17:29.009 [main] INFO org.apache.dubbo.common.logger.LoggerFactory - using logger: org.apache.dubbo.common.logger.slf4j.Slf4jLoggerAdapter
A执行
B执行

Process finished with exit code 0

```

Dubbo相对于JAVA的spi的最大的亮点是：JDK 标准的 SPI 会一次性实例化扩展点所有实现，如果有扩展实现初始化很耗时，但如果没用上也加载，会很浪费资源。而Dubbo支持只加载指定扩展实现

<!-- @include: ../common-bottom.md -->


## 参考资料 
[一文搞懂Spring的SPI机制（详解与运用实战）](https://juejin.cn/post/7197070078361387069 "一文搞懂Spring的SPI机制（详解与运用实战）")    

[Dubbo SPI 概述](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/spi/overview/ "Dubbo SPI 概述")  


