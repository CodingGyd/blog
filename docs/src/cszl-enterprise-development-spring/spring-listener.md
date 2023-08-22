---
title: Spring系列笔记-事件监听机制
shortTitle: 事件监听机制
date: 2023-08-22
category:
  - JAVA企业级开发
tag:
  - spring
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,事件监听机制,观察者模式,Spring笔记,Spring5,Spring总结,Spring核心知识
---

:::tip 写在前面
大家好，我是代码小郭，又来和大家分享知识啦！

小郭写文章的目的就是为了促进自己技术的成长，同时分享给大家一起学习交流，如果您对 Java领域感兴趣，可以关注我，我们一起学习。
:::

# Spring的事件监听 
## 一、简介
事件监听机制可以理解为是一种观察者模式，有数据发布者（事件源，也称为被监听对象）、数据接受者（监听器 listener）、事件对象event。
 
Spring定义了许多事件对象，事件对象都是继承java.util.EventObject对象，下面是部分事件对象：

![Spring的事件对象](http://cdn.gydblog.com/images/spring/listener-3.png)


Spring的事件监听器定义为ApplicationListener，继承java.util.EventListener(Spring还定义了一个注解，也叫EventListener，在spring-context包中，两者是不同的概念哦！)。

```java
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E var1);
}
```

Spring实现了很多事件监听器的类型，都是继承自ApplicationListener，下面是部分实现类：

![Spring的事件监听器实现](http://cdn.gydblog.com/images/spring/listener-4.png)


## 二、如何使用

Spring中提供了两种方式实现事件监听。

### 1、基于注解驱动

> 使用@EventListener（Spring自定义的注解）

**1）定义事件对象**

> 和Spring内置的事件对象一样，如果要自定义事件，必须继承Spring定义的接口ApplicationEvent

```java
package com.gyd.springdemo.listener;
import org.springframework.context.ApplicationEvent;

public class MyEvent extends ApplicationEvent {
    public MyEvent(Object source) {
        super(source);
    }
}
```

**2）定义事件监听器实现**

> 和Spring内置的事件监听器实例一样，要继承接口ApplicationListener

```java
package com.gyd.springdemo.listener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MyListener {

    @EventListener(MyEvent.class)
    public void onEvent(MyEvent event) {
        System.out.println("收到基于注解驱动的自定义事件：" + event);
    }
}
```

**3）启动EventMain，发布事件**

```java
package com.gyd.springdemo.listener;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class EventMain {
  public static void main(String[] args) {
      AnnotationConfigApplicationContext context =
              new AnnotationConfigApplicationContext();
      // 注册自定义事件监听器
      context.register(MyListener.class);
      // 启动上下文
      context.refresh();
      // 发布事件，事件源为Context
      context.publishEvent(new MyEvent(context));
      // 结束
      context.close();
  }
}
```

**4）程序执行输出日志**

执行输出日志如下说明事件监听生效了
```
11:01:22.409 [main] DEBUG org.springframework.context.event.EventListenerMethodProcessor - 1 @EventListener methods processed on bean 'myListener': {public void com.gyd.springdemo.listener.MyListener.onEvent(com.gyd.springdemo.listener.MyEvent)=@org.springframework.context.event.EventListener(classes={com.gyd.springdemo.listener.MyEvent.class}, condition="", id="", value={com.gyd.springdemo.listener.MyEvent.class})}
收到基于注解驱动的自定义事件：com.gyd.springdemo.listener.MyEvent[source=org.springframework.context.annotation.AnnotationConfigApplicationContext@2437c6dc, started on Tue Aug 22 11:01:22 CST 2023]
11:01:22.432 [main] DEBUG org.springframework.context.annotation.AnnotationConfigApplicationContext - Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@2437c6dc, started on Tue Aug 22 11:01:22 CST 2023
```


### 2、面向接口编程


> 实现ApplicationListener接口


**1）定义事件对象**

这里可以直接复用基于注解驱动的事件对象MyEvent。

**2）定义事件监听器实现**

> 和Spring内置的事件监听器实例一样，要继承接口ApplicationListener

```java
package com.gyd.springdemo.listener.listener2;

import com.gyd.springdemo.listener.MyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;

public class MyListener2 implements ApplicationListener<MyEvent> {

    @Override
    public void onApplicationEvent(MyEvent event) {
        System.out.println("收到基于接口驱动的事件：" + event);
    }
}
```

**3）启动EventMain，发布事件**

``` java
package com.gyd.springdemo.listener.listener2;

import com.gyd.springdemo.listener.MyEvent;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class EventMain2 {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext();
        // 注册自定义事件监听器
        context.addApplicationListener(new MyListener2());
        // 启动上下文
        context.refresh();
        // 发布事件，事件源为Context
        context.publishEvent(new MyEvent(context));
        // 结束
        context.close();
    }
}

```

**4）程序执行输出日志**

执行输出日志如下说明事件监听生效了
```
11:10:02.671 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'org.springframework.context.annotation.internalCommonAnnotationProcessor'
收到基于接口驱动的事件：com.gyd.springdemo.listener.MyEvent[source=org.springframework.context.annotation.AnnotationConfigApplicationContext@e73f9ac, started on Tue Aug 22 11:10:02 CST 2023]
11:10:02.706 [main] DEBUG org.springframework.context.annotation.AnnotationConfigApplicationContext - Closing org.springframework.context.annotation.AnnotationConfigApplicationContext@e73f9ac, started on Tue Aug 22 11:10:02 CST 2023
```

## 三、底层原理
### 1、事件是如何发布的？
在上面基于注解驱动和基于接口驱动的例子中，都是通过context.publishEvent(new MyEvent(context));来发布事件的，我们进入这个方法的源码看看：

```java
protected void publishEvent(Object event, @Nullable ResolvableType eventType) {
  Assert.notNull(event, "Event must not be null");
  Object applicationEvent;
  //将事件封装成事件对象ApplicationEvent
  if (event instanceof ApplicationEvent) {
      applicationEvent = (ApplicationEvent)event;
  } else {
      applicationEvent = new PayloadApplicationEvent(this, event);
      if (eventType == null) {
          eventType = ((PayloadApplicationEvent)applicationEvent).getResolvableType();
      }
  }
  //// 广播事件
  if (this.earlyApplicationEvents != null) {
      //earlyApplicationEvents。它是一个set，用来存放一些容器启动时需要发布的事件。
      //在earlyApplicationEvents中的事件被发布、容器彻底启动后，它将被置空
      this.earlyApplicationEvents.add(applicationEvent);
  } else {
      //我们自定义的事件以及容器启动后发送的事件都会走else分支,      重点是这一行代码！！！
      this.getApplicationEventMulticaster().multicastEvent((ApplicationEvent)applicationEvent, eventType);
  }

  //// 如果有父容器，则在父容器内也进行广播
  if (this.parent != null) {
      if (this.parent instanceof AbstractApplicationContext) {
          ((AbstractApplicationContext)this.parent).publishEvent(event, eventType);
      } else {
          this.parent.publishEvent(event);
      }
  }

}

```

从上面源码可以看出，AbstractApplicationContext中对publishEvent的实现一共分为以下几个步骤。
- 首先将传入的事件封装成ApplicationEvent，如果本身已经是ApplicationEvent，则无需处理。直接到第二步。
  这里分为两种情况：
​		<font color="red">1.如果earlyApplicationEvents不为空，</font>那么将当前事件加入earlyApplicationEvents，第二步结束。
   earlyApplicationEvents是AbstractApplicationContext中定义的一个字段，代码如下所示。
   ```java
   @Nullable
   private Set<ApplicationEvent> earlyApplicationEvents;
   ```
   earlyApplicationEvents用来存放容器启动时需要发布的事件。它会在容器启动的prepareRefresh环节初始化为一个LinkedHashSet。  
   放在earlyApplicationEvents事件不会立刻发布，而是在容器启动的registerListeners环节进行发布。并且在预置事件发布后，earlyApplicationEvents会被销毁"（this.earlyApplicationEvents = null;）"
   ```java
   protected void registerListeners() {
		// 省略无关代码
		....
      // 发布earlyApplicationEvents中的时间，并且让earlyApplicationEvents为空
      Set<ApplicationEvent> earlyEventsToProcess =this.earlyApplicationEvents;
      this.earlyApplicationEvents = null;
      if (earlyEventsToProcess != null) {
        for (ApplicationEvent earlyEvent : earlyEventsToProcess) {
          getApplicationEventMulticaster().multicastEvent(earlyEvent);
        }
      }
  	}  
   ```
  <font color="red">2.如果earlyApplicationEvents为空</font>，则通过getApplicationEventMulticaster拿到事件广播器，然后将事件广播出去。

- 如果有父容器，比如springMVC有父容器spring等。那么要再父容器内也将此事件进行广播。
 

SimpleApplicationEventMulticaster的multicastEvent方法是事件发布的核心逻辑，Spring 中事件发布都是通过SimpleApplicationEventMulticaster来实现的。

```java
public void multicastEvent(final ApplicationEvent event, @Nullable ResolvableType eventType) {
  ResolvableType type = eventType != null ? eventType : this.resolveDefaultEventType(event);
  Executor executor = this.getTaskExecutor();
  Iterator var5 = this.getApplicationListeners(event, type).iterator();

  while(var5.hasNext()) {
      ApplicationListener<?> listener = (ApplicationListener)var5.next();
      if (executor != null) {
          executor.execute(() -> {
              this.invokeListener(listener, event);
          });
      } else {
          this.invokeListener(listener, event);
      }
  }

}
```

从上面源码可以看出，如果设置了Executor则异步发送（在我们想要异步执行的事件监听器上添加@Async注解），否则同步；
而且可以看出通过 “resolveDefaultEventType(event)” 对发布的事件类型进行了校验，这就是为什么我们可以直接使用泛型来指定我们想接收的事件对象。
继续深入底层，查看invokeListener()方法的源码：

```java
protected void invokeListener(ApplicationListener<?> listener, ApplicationEvent event) {
  ErrorHandler errorHandler = this.getErrorHandler();
  if (errorHandler != null) {
      try {
          this.doInvokeListener(listener, event);
      } catch (Throwable var5) {
          errorHandler.handleError(var5);
      }
  } else {
      this.doInvokeListener(listener, event);
  }
}
```

上面这个方法内部主要调用了doInvokeListener方法，我们继续往深入看：
```java
private void doInvokeListener(ApplicationListener listener, ApplicationEvent event) {
  try {
      //这里就是最终回调我们的事件监听器实现逻辑的地方！！！
      listener.onApplicationEvent(event);
  } catch (ClassCastException var6) {
      String msg = var6.getMessage();
      if (msg != null && !this.matchesClassCastMessage(msg, event.getClass()) && (!(event instanceof PayloadApplicationEvent) || !this.matchesClassCastMessage(msg, ((PayloadApplicationEvent)event).getPayload().getClass()))) {
          throw var6;
      }

      Log loggerToUse = this.lazyLogger;
      if (loggerToUse == null) {
          loggerToUse = LogFactory.getLog(this.getClass());
          this.lazyLogger = loggerToUse;
      }

      if (loggerToUse.isTraceEnabled()) {
          loggerToUse.trace("Non-matching event type for listener: " + listener, var6);
      }
  }
}
```

最后就是回调了listener.onApplicationEvent(event) ，使用对应的ApplicationListener进行接收和处理，事件的通知到此就完成啦！


### 2、事件是如何注册的？
<font color="red">那么我们自定义的ApplicationListener是什么时候注册的呢？</font>

在Spring容器初始化过程中，我们执行了context.refresh()方法，refresh方法源码如下：
```
public void refresh() throws BeansException, IllegalStateException {
  //...其余代码略
  // 初始化事件广播器
  this.initApplicationEventMulticaster();
  this.onRefresh();
  // 注册监听器
  this.registerListeners();
  //...其余代码略
}

```

先看看是如何初始化事件广播器的，进入子方法initApplicationEventMulticaster();
```java
protected void initApplicationEventMulticaster() {
  ConfigurableListableBeanFactory beanFactory = this.getBeanFactory();
  if (beanFactory.containsLocalBean("applicationEventMulticaster")) {
    // 如果IOC容器中已经有applicationEventMulticaster这个Bean的话，直接赋值给applicationEventMulticaster
      this.applicationEventMulticaster = (ApplicationEventMulticaster)beanFactory.getBean("applicationEventMulticaster", ApplicationEventMulticaster.class);
      if (this.logger.isTraceEnabled()) {
          this.logger.trace("Using ApplicationEventMulticaster [" + this.applicationEventMulticaster + "]");
      }
  } else {
    // 如果容器中没有，那么创建一个SimpleApplicationEventMulticaster，并且注册到IOC容器中
      this.applicationEventMulticaster = new SimpleApplicationEventMulticaster(beanFactory);
      beanFactory.registerSingleton("applicationEventMulticaster", this.applicationEventMulticaster);
      if (this.logger.isTraceEnabled()) {
          this.logger.trace("No 'applicationEventMulticaster' bean, using [" + this.applicationEventMulticaster.getClass().getSimpleName() + "]");
      }
  }

}
```
上面的大致意思是：先判断容器中有没有提前配置实例化好的事件广播器ApplicationEventMulticaster，如果没有，默认创建一个子类型SimpleApplicationEventMulticaster并注册到容器中， 这个就是前面介绍事件发布代码逻辑里使用的对象了。

事件广播器初始化好了之后，就是注册所有的监听对象ApplicationListener了，看registerListeners方法的源码：
```
protected void registerListeners() {
  // 遍历applicationListeners链表中的事件监听器，因为可能有一部分监听器通过addApplicationListener()方法添加；属于api的方式添加
  Iterator var1 = this.getApplicationListeners().iterator();

  while(var1.hasNext()) {
      // 把所有的事件监听器添加到事件广播器中
      ApplicationListener<?> listener = (ApplicationListener)var1.next();
      this.getApplicationEventMulticaster().addApplicationListener(listener);
  }
  // 从当前容器中找所有ApplicationListener子类；这一部分属于注解｜配置方式添加监听器
  String[] listenerBeanNames = this.getBeanNamesForType(ApplicationListener.class, true, false);
  String[] var7 = listenerBeanNames;
  int var3 = listenerBeanNames.length;

  for(int var4 = 0; var4 < var3; ++var4) {
    // 依次把对应的Bean对象添加到事件广播器中
      String listenerBeanName = var7[var4];
      this.getApplicationEventMulticaster().addApplicationListenerBean(listenerBeanName);
  }
  // 把监听器还没注册之前就发布的容器启动相关事件依次调用multicastEvent()方法发布出来.
  Set<ApplicationEvent> earlyEventsToProcess = this.earlyApplicationEvents;
  this.earlyApplicationEvents = null;
  if (!CollectionUtils.isEmpty(earlyEventsToProcess)) {
      Iterator var9 = earlyEventsToProcess.iterator();

      while(var9.hasNext()) {
          ApplicationEvent earlyEvent = (ApplicationEvent)var9.next();
          this.getApplicationEventMulticaster().multicastEvent(earlyEvent);
      }
  }

}
```



两句话总结事件机制：
  1）事件的注册：在容器启动时会找到所有的事件监听器，注册到容器中。
  2）事件的发布：
  AbstractApplicationContext中对publishEvent方法进行了实现，发布事件的核心方法的原理是：获取spring容器中管理的监听器，然后for循环容器中的listener，对应事件的listener实现类的onApplication方法会被调用，实现对事件的响应。
 

## 四、Spring事件的注意事项

- 如果发布事件的方法处于事务中，那么事务会在监听器方法执行完毕之后才提交。事件发布之后就由监听器去处理，而不要影响原有的事务，也就是说希望事务及时提交。我们就可以 @TransactionalEventListener来定义一个监听器。
- 对于同一个事件，有多个监听器的时候，如果出现了异常，后续的监听器就失效了，因为他是把同一个事件的监听器add在一个集合里面循环执行，如果出现异常，需要注意捕获异常处理异常。
- 对于同一个事件，有多个监听器的时候，注意可以通过@Order注解指定顺序，Order的value值越小，执行的优先级就越高。  
- 监听器默认是同步执行的，如果我们想实现异步执行，可以搭配@Async注解使用，但是前提条件是你真的懂@Async注解，使用不当会出现问题的。
 
## 五、Spring事件的应用场景

> 一切与主业务无关的操作都可以通过这种方式进行解耦 

- 告警操作，例如钉钉告警，异常告警，可以通过事件机制进行解耦。
- 关键性日志记录和业务埋点，例如说我们的关键日志需要入库，记录一下操作时间，操作人，变更内容等等，可以通过事件机制进行解耦。
- 性能监控，例如说一些接口的时长，性能方便的埋点等。可以通过事件机制进行解耦。
 

## 六、什么是观察者模式？

Spring的事件机制借鉴了观察者模式的一种思想，下面啰嗦几句，总结下观察者模式的基本概念。

![观察者模式](http://cdn.gydblog.com/images/spring/listener-1.png)

观察者模式是一种行为型设计模式，它定义了一种一对多的依赖关系，当一个对象的状态发生改变时，其所有依赖者都会收到通知并自动更新。
当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。比如，当一个对象被修改时，则会自动通知依赖它的对象。观察者模式属于行为型模式。


**观察者模式包含以下几个核心角色：**

- 主题（Subject）：也称为被观察者或可观察者，它是具有状态的对象，并维护着一个观察者列表。主题提供了添加、删除和通知观察者的方法。
- 观察者（Observer）：观察者是接收主题通知的对象。观察者需要实现一个更新方法，当收到主题的通知时，调用该方法进行更新操作。
- 具体主题（Concrete Subject）：具体主题是主题的具体实现类。它维护着观察者列表，并在状态发生改变时通知观察者。
- 具体观察者（Concrete Observer）：具体观察者是观察者的具体实现类。它实现了更新方法，定义了在收到主题通知时需要执行的具体操作。
- 观察者模式通过将主题和观察者解耦，实现了对象之间的松耦合。当主题的状态发生改变时，所有依赖于它的观察者都会收到通知并进行相应的更新。

编程实现观察者模式的类继承关系模板：
![观察者模式](http://cdn.gydblog.com/images/spring/listener-2.png)


## 七、参考资料
https://juejin.cn/post/6923923418513571848

https://juejin.cn/post/7214699255507959869