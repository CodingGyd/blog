---
title: WebSocket入门
shortTitle:  WebSocket入门
date: 2023-09-13
tag:
  - WebSocket
head:
  - - meta
    - name: keywords
      content: WebSocket,WebSocket入门
---

 

# WebSocket入门篇

> 小郭最近接到了一个业务需求，要在页面上展示一些业务数据。业务方要求数据展示要实时更新，因此常规的前端轮询查询方式肯定是行不通了，会导致数据更新有延迟。
>
> 小郭想起来以前上大学时接触过的WebSocket技术是可以支持业务方的要求，由于学习时间有点久，需要重新拿起来学习一下了。 
>
> 本篇文章将WebSocket的基础知识进行了较为全面的总结，希望大家和小郭一样，通过本篇文章的学习可以掌握WebSocket的基本使用。

## 一、是什么？

WebSocket 是一种网络传输协议，在2008年诞生，2011年成为了国际标准，基于它的WebSocket API也被W3C定为标准，目前所有浏览器都已经支持该协议了。

WebSocket 可实现在单个 TCP 连接上进行全双工通信，位于 OSI 模型的应用层。它使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就可以创建持久性的连接，并进行双向数据传输。



## 二、为什么出现

互联网早期，很多网站为了实现推送技术，所用的技术都是轮询。轮询是指在特定的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式有一个很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的[头部](https://baike.baidu.com/item/头部?fromModule=lemma_inlink)，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

而目前比较新的技术是Comet。这种技术虽然可以双向通信，但依然需要反复发出请求。而且在Comet中，普遍采用的长链接，也会消耗服务器资源。

在这种情况下，[HTML5](https://baike.baidu.com/item/HTML5?fromModule=lemma_inlink)定义了WebSocket协议，相对于Http和Comet，只需要建立一次连接，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

![](http://cdn.gydblog.com/images/springboot/websocket-3.png)



## 三、有什么用？

**WebSocket的特点**：

- 更高的实时性

  协议是全双工类型的，服务器可以随时主动给客户端推送数据。相对于HTTP短轮询操作需要等待客户端请求服务端才能响应，实时性明显更高。即使和Comet等长轮询来比较，其也能在短时间内传递更多的数据。

  

- 更好的数据格式支持

  WebSocket支持文本和二进制这两种格式的数据，而且定义了二进制帧，相对比HTTP，可以更容易处理二进制内容。

  

- 扩展性强

  WebSocket支持用户扩展协议、实现部分自定义的子协议。比如部分浏览器支持的压缩功能。

  Websocket在适当的扩展支持下，可以沿用之前内容的上下文，在传递类似的数据时，可以大大提高压缩率。

  

- 较少的传输开销

  在连接创建后，服务端和客户端交换数据时，用于协议元数据控制的数据包长度比较小。相比HTTP请求每次都需要携带完整头部，此项内容传输开销大大减少。

- 保持连接状态

  与HTTP不同的是，Websocket是一种有状态的协议，因为它需要先建立连接，之后在连接关闭之前的每次通信时都可以省略部分状态信息。而HTTP请求每次都需要建立连接(握手), 而且每次请求可能都需要携带状态信息（如身份认证鉴权等）。

- 建立在 TCP 协议之上，服务器端的实现比较容易

- 没有同源限制，客户端可以与任意服务器通信

- 协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是 URL

- 兼容HTTP协议

  和HTTP一样，默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

由于 WebSocket 拥有上述的特点，所以它被广泛地应用在下面的领域：

- 即时聊天通信

- 多玩家游戏

- 在线协同编辑/编辑

- 实时数据流的拉取与推送

- 体育/游戏实况

- 实时地图位置

- 即时`Web`应用程序：即时`Web`应用程序使用一个`Web`套接字在客户端显示数据，这些数据由后端服务器连续发送。在`WebSocke`t中，数据被连续推送/传输到已经打开的同一连接中，这就是为什么`WebSocket`更快并提高了应用程序性能的原因。 例如在交易网站或比特币交易中，这是最不稳定的事情，它用于显示价格波动，数据被后端服务器使用Web套接字通道连续推送到客户端。

- 游戏应用程序：在游戏应用程序中，你可能会注意到，服务器会持续接收数据，而不会刷新用户界面。屏幕上的用户界面会自动刷新，而且不需要建立新的连接，因此在`WebSocket`游戏应用程序中非常有帮助。

- 聊天应用程序：聊天应用程序仅使用`WebSocket`建立一次连接，便能在订阅户之间交换，发布和广播消息。它重复使用相同的`WebSocket`连接，用于发送和接收消息以及一对一的消息传输。 

## 四、如何使用？

![图片来源于网络](http://cdn.gydblog.com/images/springboot/websocket-4.png)

> 由上图可知：目前主流的 Web 浏览器都支持 WebSocket，所以我们可以在大多数项目中放心地使用它。



Web 浏览器和服务器都必须实现 WebSockets 协议来建立和维护连接。由于 WebSockets 连接长期存在，与典型的 HTTP 连接不同，对服务器有重要的影响。

基于多线程或多进程的服务器无法适用于 WebSockets，因为它旨在打开连接，尽可能快地处理请求，然后关闭连接。任何实际的 WebSockets 服务器端实现都需要一个异步服务器。

下面通过一些案例介绍WebSocket的客户端和服务端基本使用。

### 1、WebSocket 客户端

在客户端，支持 WebSocket 的 Web 浏览器将通过 WebSocket 对象公开所有必需的客户端功能（主要指支持 Html5 的浏览器）。

#### 1）源码示例

```javascript
<script type="text/javascript">
    var websocket=null
    if('WebSocket' in window){
        //调用service请求,获取信息
        topic=new WebSocket("ws://localhost:8082/websocket");
    }else{
        alert("该浏览器不支持WebSocket!")
    }

    topic.onopen=function(event){
        console.log("建立连接!");
    }


    topic.onclose=function(event){
        console.log("连接关闭!");
    }

    topic.onmessage=function(event){
        console.log("收到消息!"+event.data);
        document.getElementById("info").textContent +=event.data;
        //弹窗提醒
    }

    topic.onerror=function(){
        alert("websocket发生错误!");
    }

    topic.onbeforeunload=function(){
        topic.close();
    }
</script>
```

#### 2)  WebSocket 事件

以下是 WebSocket 对象的相关事件：

| 事件           | 描述                           |
| -------------- | ------------------------------ |
| onopen         | 连接建立时触发                 |
| onmessage      | 客户端接收服务端数据时触发     |
| onerror        | 通信发生错误时触发             |
| onclose        | 连接关闭时触发                 |
| onbeforeunload | 当浏览器窗口关闭或者刷新时触发 |



### 2、WebSocket 服务端（单机版）

#### 1）概述

> WebSocket 在服务端的实现非常丰富。Node.js、Java、C++、Python 等多种语言都有自己的解决方案。
>
> 本篇仅介绍小郭在学习 WebSocket 过程中接触过的 Java服务端解决方案。



Java 的 web能力 一般都依托于 servlet 容器。

小郭了解的 servlet 容器有：Tomcat、Jetty、Resin。其中 Tomcat7、Jetty7 及以上版本均开始支持 WebSocket（推荐较新的版本，因为随着版本的更迭，对 WebSocket 的支持可能有变更）。

目前流行的Spring 框架对 WebSocket 也提供了支持，主要依赖下面的jar包：

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-websocket</artifactId>
  <version>${spring.version}</version>
</dependency>
```

基于Spring之上的SpringBoot对WebSocket提供了良好的整合，主要依赖下面的jar包：

```xml
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
    <version>${springboot.version}</version>
 </dependency>
```



本篇接下来采用SpringBoot框架来介绍如何整合WebSocket。



#### 2）源码示例

下面记录一下 SpringBoot程序如何整合WebSocket。

> 为了减少篇幅，demo项目采用前后端不分离的方式，因此也包含了客户端实现代码。

- a、引入jar包

​	这里直接创建前后端不分离的web应用程序（实际生产中web前端和后端是分离的工程）

```xml
<!-- 添加Web依赖 -->
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
 </dependency>
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-thymeleaf</artifactId>
 </dependency>
 <!--websocket-->
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
 </dependency>
```

- b、配置页面信息

​	在application.properties中添加页面相关配置

```properties
server.port=8082
# Spring thymeleaf
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/pages/
spring.thymeleaf.suffix=.html
```

- c、配置websocket

  > WebSocket核心都在这里。
  >
  > 因为WebSocket是类似客户端服务端的形式(`采用ws协议`)，那么这里的WebSocketServer其实就相当于一个ws协议的Controller
  >
  > 直接@ServerEndpoint("/websocket") 、@Component启用即可，然后在里面实现@OnOpen开启连接，@onClose关闭连接，@onMessage接收消息等事件方法。
  
  
  
  ```java
  @Configuration
  public class WebSocketConfig {
      @Bean
      public ServerEndpointExporter serverEndpointExporter() {
          return new ServerEndpointExporter();
      }
  }
  ```
  
  ```java
  
  package com.gyd.websocket;
  
  import org.springframework.stereotype.Component;
  
  import javax.websocket.OnClose;
  import javax.websocket.OnMessage;
  import javax.websocket.OnOpen;
  import javax.websocket.Session;
  import javax.websocket.server.ServerEndpoint;
  import java.util.concurrent.CopyOnWriteArraySet;
  
  @Component
  //这个注解用来标记一个类是 WebSocket 的处理器。然后，我们可以在这个类的方法签名上使用一系列注解来表明所修饰的方法是某种事件类型的回调
  @ServerEndpoint("/websocket")
  public class WebSocketService {
      private Session session;
  
      //保存连接
      private static CopyOnWriteArraySet<WebSocketService> webSocketService = new CopyOnWriteArraySet<>();
  
      /**
       * 建立连接
       * @param session
       */
      @OnOpen
      public void opOpen(Session session) {
          this.session = session;
          webSocketService.add(this);
          System.out.println("有新的连接=============》" + webSocketService.size());
      }
  
      /**
       * 断开连接
       */
      @OnClose
      public void onClose() {
          webSocketService.remove(this);
          System.out.println("断开连接=============》" + webSocketService.size());
      }
  
      /**
       * 接收客户端消息
       * @param message
       */
      @OnMessage
      public void onMessage(String message) {
          System.out.println("收到客户端消息" + message);
      }
  
      /**
       * 发送消息到客户端
       * @param message
       */
      public void sendMessage(String message) {
          for (WebSocketService webSocketService2 : webSocketService) {
              System.out.println("广播消息" + message);
              webSocketService2.session.getAsyncRemote().sendText(message);
          }
      }
       /**
       * 传输消息错误触发事件
       * @param error
       */
      @OnError
      public void onError(Throwable error) {
  
      }
  }
  ```
  
  

- d、创建接口

  > controller中只有一个简单的界面跳转操作和模拟造数操作，其他的不需要。

​	页面访问接口：/show/topic   (对应页面名称)

​	websocket数据模拟接口：/show/createOrder

```java
package com.gyd.contoller;

import com.gyd.websocket.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.UUID;


/*
 *@Controller：如果当前类所在的包配置了Spring容器包扫描，具有
 *该注解的类，就会作为bean注册到spring容器中，由spring容器创建实例。
 */
@Controller
@RequestMapping("/show/")
public class WebSocketTestController {

    @Autowired
    private WebSocketService webSocketService;

    /**
     * 跳转thymeleaf模板路径
     *
     * @return
     */
    @RequestMapping("/topic")
    public String websocket() {
        return "topic";
    }

    /**
     * 模拟创建订单，发送消息到客户端
     *
     * @return
     */
    @RequestMapping("/createOrder")
    public @ResponseBody String createOrder() {
        webSocketService.sendMessage("你有新的订单，请及时处理========>" + UUID.randomUUID());
        return "新增订单成功!";
    }
}
```

- e、编写html页面

  > 新建一个文件，放到 templates目录下面。页面简单使用js代码调用WebSocket。

​	页面：topic.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Insert title here</title>
</head>
<body>
<script type="text/javascript">
    var websocket=null
    if('WebSocket' in window){
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        topic=new WebSocket("ws://localhost:8082/websocket");
    }else{
        alert("该浏览器不支持WebSocket!")
    }
	//打开事件
    topic.onopen=function(event){
        console.log("建立连接!");
    }
	//关闭事件
    topic.onclose=function(event){
        console.log("连接关闭!");
    }
	//获得消息事件
    topic.onmessage=function(event){
        console.log("收到消息!"+event.data);
        document.getElementById("info").textContent +=event.data;
        //弹窗提醒
    }
	//发生了错误事件
    topic.onerror=function(){
        alert("websocket发生错误!");
    }
	//浏览器窗口关闭或者刷新事件
    topic.onbeforeunload=function(){
        topic.close();
    }
</script>
<h4>您好</h4>
    <span id="info"></span>
</body>
</html>

```

- f、运行测试

​		先启动应用，然后在浏览器输入127.0.0.1:8082/show/topic 打开topic.html页面，然后调用127.0.0.1:8082/show/createOrder 模拟数据创建，看页面是否收到创建的数据：

![](http://cdn.gydblog.com/images/springboot/websocket-1.png)

![](http://cdn.gydblog.com/images/springboot/websocket-2.png)

这样就简单实现了服务端实时推送数据到客户端的效果啦！

注意： websocket是全双工的，客户端也可以往服务端推送，两者之间只需要建立一次链接即可！



#### 3）注解介绍

@ServerEndpoint：将目前的类定义成一个websocket服务器端，注解的值将被用于监听用户连接的终端访问URL地址，客户端可以通过这个URL来连接到WebSocket服务器端

@OnOpen：当WebSocket建立连接成功后会触发这个注解修饰的方法。

@OnClose：当WebSocket建立的连接断开后会触发这个注解修饰的方法。

@OnMessage：当客户端发送消息到服务端时，会触发这个注解修改的方法。

@OnError：当WebSocket建立连接时出现异常会触发这个注解修饰的方法。 

### 3、WebSocket 服务端（分布式版）

前面介绍的例子，在单机环境下没有问题，如果是多节点部署的话需要解决一个问题：如何解决多台客户端连接在不同服务器，互相发送消息问题！ 比如部署了两台服务器分别是AA和BB，此时客户端A 连接了服务器AA，但是业务处理是发生在服务器BB上，那么服务器BB就通知不到客户端A了！

针对上述多节点部署问题，我们可以借助redis的发布订阅功能来解决，下面用代码示例如何实现。

#### 1）添加redis配置

```properties
spring.redis.host=XXX.XXXX.XXX.XXX
spring.redis.port=6479
spring.redis.password=123456
spring.redis.database=0
spring.redis.lettuce.pool.max-idle=6
spring.redis.lettuce.pool.max-active=10
spring.redis.lettuce.pool.min-idle=2
```



#### 2）redis消息监听类定义

```java
package com.gyd.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @ClassName MessageListener
 * @Description TODO
 * @Author guoyading
 * @Date 2023/10/11 11:03
 * @Version 1.0
 */
@Component
public class MessageListener implements org.springframework.data.redis.connection.MessageListener {

    @Resource
    private RedisTemplate redisTemplate;
    @Autowired
    private WebSocketService webSocketService;
    @Override
    public void onMessage(Message message, byte[] pattern) {
        RedisSerializer<String> valueSerializer = redisTemplate.getValueSerializer();
        String value = valueSerializer.deserialize(message.getBody());
        if (null != value && value.length() > 0) {
            System.out.println("监听集群websocket消息--"+value);
            webSocketService.sendMessage(value);
         }
    }
}
```



#### 3）redis消息订阅配置类

```java
package com.gyd.config;

import com.gyd.websocket.MessageListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

/**
 * @Description redis消息订阅配置类
 */
@Configuration
public class RedisSubscriberConfig {

    /**
     * 消息监听适配器，注入接受消息方法
     *
     * @param receiver
     * @return
     */
    @Bean
    public MessageListenerAdapter messageListenerAdapter(MessageListener receiver) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(receiver);
        return adapter;
    }
    /**
     * 创建消息监听容器
     *
     * @param redisConnectionFactory
     * @param messageListenerAdapter
     * @return
     */
    @Bean
    public RedisMessageListenerContainer getRedisMessageListenerContainer(RedisConnectionFactory redisConnectionFactory, MessageListenerAdapter messageListenerAdapter) {
        RedisMessageListenerContainer redisMessageListenerContainer = new RedisMessageListenerContainer();
        redisMessageListenerContainer.setConnectionFactory(redisConnectionFactory);
        redisMessageListenerContainer.addMessageListener(messageListenerAdapter, new PatternTopic("websocket"));
        return redisMessageListenerContainer;
    }
}
```



#### 4）封装redis操作工具类

```java
package com.gyd.util;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @ClassName RedisUtil
 * @Description TODO
 * @Author guoyading
 * @Date 2023/10/11 10:47
 * @Version 1.0
 */
@Component
public class RedisUtil {

    @Resource
    private RedisTemplate<String,String> redisTemplate;
    /**
     * 发布
     *
     * @param key
     */
    public void publish(String key, String value) {
        redisTemplate.convertAndSend(key, value);
    }
}
```



#### 5）测试接口定义

```java

@Controller
@RequestMapping("/show/")
public class WebSocketTestController {
 
    @Autowired
    private RedisUtil redisUtil;

    /**
     * 模拟创建订单，通过redis的发布订阅  发送消息到客户端
     *
     * @return
     */
    @RequestMapping("/createOrderAsync")
    public @ResponseBody String createOrderAsync() {
        redisUtil.publish("websocket","订阅：你有新的订单，请及时处理========>" + UUID.randomUUID());
        return "新增订单成功!";
    }
}
```



#### 6）验证

先启动应用，然后在浏览器输入127.0.0.1:8082/show/topic 打开topic.html页面，然后调用127.0.0.1:8082/show/createOrderAsync 模拟数据创建，页面就能收到订阅的推送数据

![](http://cdn.gydblog.com/images/springboot/websocket-redis.png)

### 4、如何携带参数?

- 方式1

```
@ServerEndpoint("/websocket/{param}")
```

- 方式2

```
ws:localhost:8080/websocket/123?username=gyd&token=xxx";
```



java代码获取参数：

> 连接建立时获取传参

```
@OnOpen
public void open(Session session, @PathParam("param")String  param) {
    //通过注解@PathParam获取参数
    System.out.println("注解参数: "+param);
    //通过URL获取
    Map<String, String> map = session.getPathParameters();
    System.out.println("getParameter:token="+map.get("token").toString());
    System.out.println("getParameter:token="+map.get("username").toString());
    String username = session.getQueryString();
    System.out.println("session.getQueryString()="+username);
    String uri = session.getRequestURI().toString();
    System.out.println("session.getRequestURI().toString()="+uri);
}
```







## 五、结束语

>  学不完，根本学不完

本文简单介绍了WebSocket的基本概念，并且用代码演示了一个SpringBoot项目如何接入WebSocket。

其实WebSocket可总结的东西还挺多，比如WebSocket扩展，客户端、服务端之间是如何协商、使用扩展的。WebSocket扩展可以给协议本身增加很多能力和想象空间，比如数据的压缩、加密，以及多路复用等。

