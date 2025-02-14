---
title: Logback日志组件
shortTitle: Logback日志组件
date: 2023-10-11
category:
  - 开源框架
tag:
  - 日志组件
description: 记录Logback日志组件的常见用法
head:
  - - meta
    - name: keywords
    - content: Logback,日志
---

# Logback日志组件

## 简介

 [官方网站](http://logback.qos.ch)

logback主要由三个模块构成：

- logback-core：为基础核心，另外两个模块均依赖它
- logback-classic：实现了简单日志门面SLF4J
- logback-access：主要作为一个与Servlet容器交互的模块，提供与HTTP访问相关的一些功能。

## xml配置文件

在SpringBoot中，默认支持四种命名的日志文件

- logback-spring.xml
- logback.xml
- logback-spring.groovy
- logback.groovy

Spring Boot官方推荐优先使用带有-spring的文件名配置（如有logback-spring.xml，则不会使用logback.xml）。

若需要对配置文件名进行修改，或者希望把放到其它目录下，可以在application中通过logging.config属性来指定，如logging.config=classpath:config/my-log-config.xml。

**下面先来看一份典型的Logback xml配置：**

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 日志存放路径 -->
	<property name="log.path" value="logs" />
    <!-- 日志输出格式 -->
	<property name="log.pattern" value="%d{HH:mm:ss.SSS} [%thread] %-5level %logger{20} - [%method,%line] - %msg%n" />

	<!-- 控制台输出 -->
	<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
		<encoder>
			<pattern>${log.pattern}</pattern>
		</encoder>
	</appender>
	
	<!-- 系统日志输出 -->
	<appender name="file_info" class="ch.qos.logback.core.rolling.RollingFileAppender">
	    <file>${log.path}/sys-info.log</file>
        <!-- 循环政策：基于时间创建日志文件 -->
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 日志文件名格式 -->
			<fileNamePattern>${log.path}/sys-info.%d{yyyy-MM-dd}.log</fileNamePattern>
			<!-- 日志最大的历史 60天 -->
			<maxHistory>60</maxHistory>
		</rollingPolicy>
		<encoder>
			<pattern>${log.pattern}</pattern>
		</encoder>
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- 过滤的级别 -->
            <level>INFO</level>
            <!-- 匹配时的操作：接收（记录） -->
            <onMatch>ACCEPT</onMatch>
            <!-- 不匹配时的操作：拒绝（不记录） -->
            <onMismatch>DENY</onMismatch>
        </filter>
	</appender>
	
	<appender name="file_error" class="ch.qos.logback.core.rolling.RollingFileAppender">
	    <file>${log.path}/sys-error.log</file>
        <!-- 循环政策：基于时间创建日志文件 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 日志文件名格式 -->
            <fileNamePattern>${log.path}/sys-error.%d{yyyy-MM-dd}.log</fileNamePattern>
			<!-- 日志最大的历史 60天 -->
			<maxHistory>60</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${log.pattern}</pattern>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!-- 过滤的级别 -->
            <level>ERROR</level>
			<!-- 匹配时的操作：接收（记录） -->
            <onMatch>ACCEPT</onMatch>
			<!-- 不匹配时的操作：拒绝（不记录） -->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
	 
	
	<!-- 系统模块日志级别控制  -->
	<logger name="com.gyd" level="debug" />
	<!-- Spring日志级别控制  -->
	<logger name="org.springframework" level="debug" />

	<root level="debug">
		<appender-ref ref="console" />
	</root>
 
</configuration> 
```



![](http://cdn.gydblog.com/images/middleware/logback-1.png)

## 取代log4j的理由

- 更快的实现：Logback的内核重写了，在一些关键执行路径上性能提升10倍以上。而且logback不仅性能提升了，初始化内存加载也更小了。
- -非常充分的测试：Logback经过了几年，数不清小时的测试。Logback的测试完全不同级别的。
- Logback-classic非常自然实现了SLF4j：Logback-classic实现了SLF4j。在使用SLF4j中，你都感觉不到logback-classic。而且因为logback-classic非常自然地实现了slf4j，所以切换到log4j或者其他，非常容易，只需要提供成另一个jar包就OK，根本不需要去动那些通过SLF4JAPI实现的代码。
- 自动重新加载配置文件，当配置文件修改了，Logback-classic能自动重新加载配置文件。扫描过程快且安全，它并不需要另外创建一个扫描线程。
- 谨慎的模式和非常友好的恢复，在谨慎模式下，多个FileAppender实例跑在多个JVM下，能够安全地写道同一个日志文件。RollingFileAppender会有些限制。Logback的FileAppender和它的子类包括RollingFileAppender能够非常友好地从I/O异常中恢复。
- 配置文件可以处理不同的情况，一个配置文件就可以适应多个环境。
- Filters（过滤器）有些时候，需要诊断一个问题。在log4j，只有降低日志级别，不过这样会打出大量的日志，会影响应用性能。在Logback，你可以继续保持那个日志级别而除掉某种特殊情况，如alice这个用户登录，她的日志将打在DEBUG级别而其他用户可以继续打在WARN级别。要实现这个功能只需加4行XML配置。可以参考MDCFIlter。
- 自动压缩已经打出来的log：RollingFileAppender在产生新文件的时候，会自动压缩已经打出来的日志文件。压缩是个异步过程，所以甚至对于大的日志文件，在压缩过程中应用不会受任何影响。
- 堆栈树带有包版本：Logback在打出堆栈树日志时，会带上包的数据。
- 自动去除旧的日志文件：可以控制已经产生日志文件的最大数量。

## 参考资料

[logback 从入门到精通 超详细配置说明_logback配置详解-CSDN博客](https://blog.csdn.net/weixin_41377777/article/details/120962037)