---
# icon: lock
date: 2024-04-25
category:
  - 面试手册
tag:
  - SpringCloud面试
---

# SpringCloud知识点



## 1、什么是SpringCloud

`Spring Cloud`就是微服务系统架构的一站式解决方案，在平时我们构建微服务的过程中需要做如**服务发现注册**、**配置中心**、**消息总线**、**负载均衡**、**断路器**、**数据监控**等操作，而 Spring Cloud 为我们提供了一套简易的编程模型，使我们能在 Spring Boot 的基础上轻松地实现微服务项目的构建。

## 2、SpringCloud的组件架构

![](http://cdn.gydblog.com/images/spring/springcloud.png)

- Eureka 服务发现框架
- Ribbon 进程内负载均衡器
- Open Feign 服务调用映射
- Hystrix 服务降级熔断器
- Zuul 微服务网关
- Config 微服务统一配置中心
- Bus 消息总线

## 3、服务发现-Eureka

Eureka是基于REST（代表性状态转移）的服务，主要在AWS云中用于定位服务，以实现负载均衡和中间层服务器的故障转移。我们称此服务为Eureka服务器。Eureka还带有一个基于Java的客户端组件Eureka Client，它使与服务的交互变得更加容易。客户端还具有一个内置的负载平衡器，可以执行基本的循环负载平衡。

通俗的来说可以把Eureka认为是现实生活中的中介，提供居间服务。而服务提供者Provider就相当于提供房子的房东。消费者`Consumer`相当于需要找房子的租客，租客一般都是通过中介来获取房子信息（Consumer通过Eureka获取Provider的地址等信息，然后进行调用）



## 4、负载均衡-Ribbon

`Ribbon` 是`Netflix`公司的一个开源的负载均衡 项目，是一个客户端/进程内负载均衡器，**运行在消费者端**。其工作原理就是`Consumer`端获取到了所有的服务列表之后，在其**内部**使用**负载均衡算法**，进行对多个系统的调用。

![](http://cdn.gydblog.com/images/spring/springcloud-ribbon.png)

提到**负载均衡**就不得不提到大名鼎鼎的`Nignx`了，而和`Ribbon`不同的是，它是一种**集中式**的负载均衡器。

何为集中式呢？简单理解就是**将所有请求都集中起来，然后再进行负载均衡**

## 5、声明式调用-Open Feign

有了 Eureka，`RestTemplate`，`Ribbon`，就可以进行服务间的调用了，但是使用`RestTemplate`还是不方便。通过open feign框架可以实现**像调用原来代码一样进行各个服务间的调用**

> OpenFeign 也是运行在消费者端的，使用 Ribbon 进行负载均衡，所以 OpenFeign 直接内置了 Ribbon。

导入Open Feign组件后进行如下定义。

```
// 使用 @FeignClient 注解来指定提供者的名字
@FeignClient(value = "eureka-client-provider")
public interface TestClient {
    // 这里一定要注意需要使用的是提供者那端的请求相对路径，这里就相当于映射了
    @RequestMapping(value = "/provider/xxx",
    method = RequestMethod.POST)
    CommonResponse<List<Plan>> getPlans(@RequestBody planGetRequest request);
}
```

然后我们在`Controller`就可以像原来调用`Service`层代码一样调用它了。

```
@RestController
public class TestController {
    // 这里就相当于原来自动注入的 Service
    @Autowired
    private TestClient testClient;
    // controller 调用 service 层代码
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public CommonResponse<List<Plan>> get(@RequestBody planGetRequest request) {
        return testClient.getPlans(request);
    }
}
```



## 6、熔断降级-Hystrix

在分布式环境中，不可避免地会有许多服务依赖项中的某些失败。Hystrix是一个库，可支持通过添加等待时间容限和容错逻辑来实现控制这些分布式服务之间的交互。Hystrix通过隔离服务之间的访问点，停止服务之间的级联故障并提供后备选项来实现此目的，所有这些都可以提高系统的整体弹性。

熔断：**熔断**就是服务雪崩的一种有效解决方案。当指定时间窗内的请求失败率达到设定阈值时，可以使用Hystrix提供的断路器直接将此请求链路断开。

降级：**降级是为了更好的用户体验，当一个方法调用异常时，通过执行另一种代码逻辑来给用户友好的回复**。这也就对应着`[Hystrix]`的**后备处理**模式。



## 7、微服务网关-Zuul

网关是系统唯一对外的入口，介于客户端与服务器端之间，用于对请求进行**鉴权**、**限流**、**路由**、**监控**等功能。网关有的功能，`Zuul`基本都有。而`Zuul`中最关键的就是**路由和过滤器**，



## 8、配置管理-Config

当我们的微服务系统开始慢慢地庞大起来，那么多`Consumer`、`Provider`、`[Eureka] Server`、`Zuul`系统都会持有自己的配置，这个时候我们在项目运行的时候可能需要更改某些应用的配置，如果我们不进行配置的统一管理，我们只能**去每个应用下一个一个寻找配置文件然后修改配置文件再重启应用**。这样会非常麻烦，为了解决这个问题，于是有了配置中心的说法。

`Spring Cloud Config`就是能将各个 应用/系统/模块 的配置文件存放到**统一的地方然后进行管理**(Git 或者 SVN)，又能在项目运行时动态修改配置文件**

一般我们会使用`Bus`消息总线 +`Spring Cloud Config`进行配置的动态刷新。



## 9、消息总线-Bus

可以简单理解为`Spring Cloud Bus`的作用就是**管理和广播分布式系统中的消息**，也就是消息引擎系统中的广播模式。比如可以支持客户端的配置刷新功能。
