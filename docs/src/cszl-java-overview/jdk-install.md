---
# icon: lock
date: 2023-04-02

category:
  - Java核心
---

# JDK安装(傻瓜式教程)
## 01、什么是JDK?
JDK全称是Java Development ToolKit，也就是Java开发工具包。JDK是JAVA的基础设施，包含了Java运行时环境(Java Runtime Envirnment，简称JRE), 以及Java源代码编译环境如JAVA小工具(javac、java、javap、jstat、jps、jmap
、jinfo等)和Java基础API库（比如rt.jar）。<br/>

那么 JDK包含的JRE是什么呢? JRE是提供给普通用户运行打包好的JAVA程序的，也就是说该用户不需要懂java代码。JDK是提供给专业开发人员使用的，同时也包含了JRE方便开发者运行编译好的JAVA程序。

目前企业生产使用最广的应该是JDK8和JDK11了，是经过考验的长期稳定版本LTS。其他版本建议慎用，因为自从2009年4月20日oracle以74亿美元收购sun后，对jdk版本的迭代频率提高了不少，发布的大部分都是过渡版本，版本不稳定，不太受开发者待见。


## 02、下载JDK安装包
官方下载链接：https://www.oracle.com/java/technologies/downloads/<br/>

可以在官网选择自己需要的版本，我这里采用JDK8来做示例，操作系统是64位的windows。
<img src="http://cdn.gydblog.com/images/java/java-jdk-1.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>

注意：官方下载链接有时候会比较慢，可以自行搜索国内网站进行下载，只要版本对应就可以。

## 03、安装JDK
下载完毕后，双击JDK安装包，按照弹出框提示一步步安装。 这里尽量不要改动安装路径。
<img src="http://cdn.gydblog.com/images/java/java-jdk-5.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/java/java-jdk-6.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/java/java-jdk-7.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/java/java-jdk-8.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>

## 04、环境变量配置
啥叫环境变量呀？ 我认为它其实就是指定一个程序的安装路径，然后我们可以在操作系统的任何地方执行该程序暴露的关键字而无需指定全路径，操作系统在执行这个关键字时不仅会在当前目录下寻找对应的可执行程序，也会在环境变量映射的安装路径下寻找可执行程序，进而执行关键字背后的动作。环境变量分用户级别和系统级别，我们一般直接配置系统级别，对所有用户生效。

常见的tomcat、maven、jdk这些程序都需要指定环境变量，否则在程序运行的时候会报找不到命令的错误提示。

那么，JDK环境变量该怎么配呢？我们来一起配置一下。<br/>

- 首先打开window的环境变量编辑窗口，选择编辑【系统变量】 (这里也可以选择新建一个新的环境变量)
<img src="http://cdn.gydblog.com/images/java/java-jdk-2.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>

- 在弹出的框中新建一行，填写jdk的安装目录
<img src="http://cdn.gydblog.com/images/java/java-jdk-3.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>

## 05、验证
在任意目录打开cmd命令行，敲命令: java -version，若显示如下则表示JDK安装成功了
<img src="http://cdn.gydblog.com/images/java/java-jdk-4.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
