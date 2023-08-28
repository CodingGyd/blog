---
# icon: lock
date: 2023-05-24
category:
  - SOP资料库
---

# JAVA开发常见问题
## Not registered via @EnableConfigurationProperties
 
当使用@ConfigurationProperties时IDEA顶部出现这样的提示： 

![ConfigurationProperties](http://cdn.gydblog.com/images/cszl-sop/problem-manual-2.png)

错误信息：  
Not registered via @EnableConfigurationProperties, marked as Spring component, or scanned via @ConfigurationPropertiesScan.


解决方式：  
@ConfigurationProperties使用spring-boot-configuration-processorjar 轻松地从带有注释的项目中生成自己的配置元数据文件 。该jar包含一个Java注释处理器，在项目被编译时会被调用。要使用处理器，请包含对的依赖 spring-boot-configuration-processor。
1>在配置文件pom.xml中添加依赖： 
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

2>回到自定义的bean Person中，添加注解@Component，声明将这个组件添加至容器中，这样才可以被使用
![](http://cdn.gydblog.com/images/cszl-sop/problem-manual-3.png)



## java.lang.NoClassDefFoundError:javassist/bytecode/ClassFile
错误信息：  
![NoclassdeffoundError](http://cdn.gydblog.com/images/cszl-sop/problem-manual-1.png)

解决方式：  
是javassist.jar这个jar包出问题了, 去MAVEN仓库里找到这个jar包, 删除, 然后重新构建程序让其重新下载一个即可。

我的javassist在本地MAVEN仓库的路径是D:\developer\apache-maven-3.3.9-bin\repository\org\javassist


## java.lang.NoClassDefFoundError: org/mybatis/logging/LoggerFactory
SpringBoot + Mybatis-plus 整合的时候发生的异常。

错误信息：  
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

解决方式：  
排查发现此类问题是因为 mybatis-spring-boot-starter 和 mybatis-plus-boot-starter同时引入项目导致的，排除其中一个即可


## java.nio.charset.MalformedInputException: Input length = 1
JAR启动并加载/解析Nacos yml格式的配置文件报错  

**原因1：字符集不匹配**  
nacos中配置文件的字符集为A，应用程序的读取配置文件时使用了字符集B，导致使用字符集B解码文件二进制流时字符解码失败。一般问题出在中文注释上

两种解决方式：  
1.打JAR包时，在pom.xml指定JAR包内的字符集
```java
<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<project.build.outputEncoding>UTF-8</project.build.outputEncoding>
```
2.jar包启动时，全局指定文件编码类型
```java
java -Dfile.encoding=utf-8 -jar app.jar
```


**原因2：(yml文件)配置格式有误**  
解决方式：当然是检查文件格式啦！
 


## [ERROR] Unknown lifecycle phase "test.skip=true".

小郭使用 IntelliJ IDEA 中的终端（Terminal）来运行跳过单元测试时的命令 mvn package -Dmaven.test.skip=true 时，发现总是报如下的错：
```xml
[WARNING] The requested profile "localRepository" could not be activated because it does not exist.
[ERROR] Unknown lifecycle phase "test.skip=true". You must specify a valid lifecycle phase or a goal in the format <plugin-prefix>:<goal> or <plugin-group-id>:<plugin-arti
fact-id>[:<plugin-version>]:<goal>. Available lifecycle phases are: pre-clean, clean, post-clean, validate, initialize, generate-sources, process-sources, generate-resourc
es, process-resources, compile, process-classes, generate-test-sources, process-test-sources, generate-test-resources, process-test-resources, test-compile, process-test-c
lasses, test, prepare-package, package, pre-integration-test, integration-test, post-integration-test, verify, install, deploy, pre-site, site, post-site, site-deploy. -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/LifecyclePhaseNotFoundException
PS D:\code\springboot-hello> mvn clean package -Dmaven.test.skip=true
[INFO] Scanning for projects...
[WARNING] The requested profile "localRepository" could not be activated because it does not exist.

```

原来是因为 IntelliJ IDEA 的终端默认使用 PowerShell 来运行命令，而在 PowerShell 下，参数 -Dmaven.test.skip=true 没有被正确地识别。

不过这只需要加在此参数外加单引号即可，即：mvn package '-Dmaven.test.skip=true'。也可以选择将 IntelliJ IDEA 的终端设置成 CMD 模式（Command Prompt）

![Unknown lifecycle phase](http://cdn.gydblog.com/images/cszl-sop/problem-manual-4.png)
