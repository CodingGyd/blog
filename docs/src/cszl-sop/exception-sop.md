---
# icon: lock
date: 2023-05-24
category:
  - SOP
tag:
  - NoClassDefFoundError
  - 问题记录
---

# 异常SOP

## java.lang.NoClassDefFoundError:javassist/bytecode/ClassFile
错误信息：<br/>
![NoclassdeffoundError](/images/cszl-sop/problem-manual-1.png)

解决方式：<br/>
是javassist.jar这个jar包出问题了, 去MAVEN仓库里找到这个jar包, 删除, 然后重新构建程序让其重新下载一个即可。

我的javassist在本地MAVEN仓库的路径是D:\developer\apache-maven-3.3.9-bin\repository\org\javassist


## java.lang.NoClassDefFoundError: org/mybatis/logging/LoggerFactory
SpringBoot + Mybatis-plus 整合的时候发生的异常。

错误信息：<br/>
```java
Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [org.apache.ibatis.session.SqlSessionFactory]: Factory method 'sqlSessionFactory' threw exception; nested exception is java.lang.NoClassDefFoundError: org/mybatis/logging/LoggerFactory
	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:185)
	at org.springframework.beans.factory.support.ConstructorResolver.instantiate(ConstructorResolver.java:652)
	... 60 more
Caused by: java.lang.NoClassDefFoundError: org/mybatis/logging/LoggerFactory
	at com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean.<clinit>(MybatisSqlSessionFactoryBean.java:89)
	at com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration.sqlSessionFactory(MybatisPlusAutoConfiguration.java:163)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:154)
	... 61 more
Caused by: java.lang.ClassNotFoundException: org.mybatis.logging.LoggerFactory
	at java.net.URLClassLoader.findClass(URLClassLoader.java:387)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
	at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:355)
	at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
	... 68 more
Disconnected from the target VM, address: '127.0.0.1:56559', transport: 'socket'

Process finished with exit code 0
```

解决方式：<br/>
排查发现此类问题是因为 mybatis-spring-boot-starter 和 mybatis-plus-boot-starter同时引入项目导致的，排除其中一个即可


## java.nio.charset.MalformedInputException: Input length = 1
JAR启动并加载/解析Nacos yml格式的配置文件报错<br/>

**原因1：字符集不匹配**<br/>
nacos中配置文件的字符集为A，应用程序的读取配置文件时使用了字符集B，导致使用字符集B解码文件二进制流时字符解码失败。一般问题出在中文注释上

两种解决方式：<br/>
1.打JAR包时，在pom.xml指定JAR包内的字符集
```java
<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<project.build.outputEncoding>UTF-8</project.build.outputEncoding>
```
2.jar包启动时，全局指定文件编码类型
```java
java -Dfile.encoding=utf-8 -jar app.jar
```


**原因2：(yml文件)配置格式有误**<br/>
解决方式：当然是检查文件格式啦！
 