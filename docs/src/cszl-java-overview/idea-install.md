---
# icon: lock
date: 2023-06-25

category:
  - Java核心
tag:
  - JAVA开发环境
  - 编译器
  - IDEA
---

# IDEA安装
## 1.IDEA简介
IDEA全称是IntelliJ IDEA，由JetBrains公司开发，是业界公认最好的JAVA编程工具之一。IDEA是具有高级代码导航和可靠代码重构的首批Java IDE中的一员，经过长期迭代已发展成为具备高效软件开发所需的所有关键工具和实用功能以及一套基于IntelliJ平台的其他IDE的综合型IDE。IDEA在智能代码助手、代码自动提示、J2EE支持、Ant、Junit、CVS整合、代码审查等方面的功能都是非常优秀的。<br/>

IntelliJ IDEA在官网是这样介绍自己的：IntelliJ IDEA是Java和Kotliin开发的领先IDE。它具有一套有助于提高效率的功能，包括智能编码辅助、可靠重构、即时代码导航、内置开发者工具、Web和企业开发支持等。<br/>

IDEA支持功能特性主要围绕以下几个方面：
- 开发者人体工程学<br/>
提供了对所有关键功能和集成工具的快速访问以及广泛的自定义选项。 开发者可以根据工作流自由微调：设置快捷键、安装插件、按照个人偏好自定义界面等。<br/>

- 更深入的代码洞察<br/>
IntelliJ IDEA 虽然主要针对 Java 和 Kotlin 开发而设计，但也理解大量其他编程语言，包括 Groovy、Scala、JavaScript、TypeScript 和 SQL，并为每种语言提供了智能编码辅助。 源代码的初始索引允许 IDE 创建项目的虚拟映射。 利用虚拟映射的信息，它可以即时检测错误，以精确的上下文感知建议代码补全变体，执行重构等。<br/>
- 快速导航和搜索<br/>
IntelliJ IDEA 提供了多种功能，使导航更快、搜索更方便，帮助开发者专注于代码并更高效地工作。<br/>
- 运行、测试和调试<br/>
IntelliJ IDEA 带有强大的工具包，用于设置应用程序的运行和构建参数、调试代码，以及直接在 IDE 中应用和开发 JUnit 测试。<br/>
- 内置工具和集成<br/>
IntelliJ IDEA 具有任务关键型内置工具和集成，可帮助开发者在熟悉的环境中工作并避免切换应用程序。<br/>
- 版本控制<br/>
IntelliJ IDEA 开箱即支持最流行的版本控制系统，例如 Git、Subversion、Mercurial 和 Perforce。<br/>
- JVM框架<br/>
IntelliJ IDEA Ultimate 为面向现代应用程序和微服务开发的领先框架和技术提供了一流支持。 IDE 具有 Spring 和 Spring Boot、Jakarta EE、JPA、Reactor 和其他框架的专属辅助。<br/>
- Web开发<br/>
IntelliJ IDEA Ultimate 包括 WebStorm 的所有功能 – WebStorm 是面向 JavaScript 和相关技术（包括 TypeScript、React、Vue、Angular、Node.js、HTML 和样式表）的集成开发环境。<br/>
- 部署<br/>
IntelliJ IDEA Ultimate 提供了与最流行容器编排系统 Kubernetes 和 Docker 的集成。还支持用于将代码部署到 AWS、Google Cloud 和 Azure 的第三方插件。<br/>
- 远程开发和协作<br/>
IntelliJ IDEA 提供了开发者适应远程工作所需的工具。 开发者无论身在何处都可以与团队成员有效协作，并在任何笔记本电脑上编写代码，让远程服务器处理所有繁重工作。<br/>

我刚入门时用的Eclipse，工作三年后跳槽进入互联网公司才开始接触IDEA。刚开始是很不习惯使用的，但是坚持用了一段时间后才感觉真香呀，果断放弃Eclipse拥抱IDEA。总体来说IDEA比Eclipse在使用上更方便，功能更稳定。建议刚入门的同学直接上手IDEA，因为现在主流互联网大厂都是使用IDEA的。
## 2.安装步骤
首先我们要从[官网](https://www.jetbrains.com/zh-cn/idea/download/#section=windows)获取安装包。 安装包有两种类型：社区版(Community)和旗舰版(Ultimate)。社区版是免费的产品。旗舰版是收费的，可免费试用30天，功能比社区版更丰富。<br/>

这里仅展示 windows 环境下的社区版本安装，其他系统也是大同小异。<br/>
<img src="/images/java/java-idea-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


## 3.遇到的问题
注意jdk版本和idea版本要匹配https://www.jetbrains.com/help/idea/supported-java-versions.html


## 4.IDEA破解
[IDEA2023.1永久破解教程（亲测有效）](../zhencangziyuan/tools.md#idea20231永久破解教程亲测有效)
## 5.好用的idea插件推荐
- POJO to json
dto转json
- Maven Helper
pom依赖分析
- better-mybatis-generator
数据库实体代码生成
- Database navigate
数据库插件，可以查看数据库
- Thief-Book 
真摸鱼插件，看txt小说用！！ 缺点是只能看txt。。  非插件方式的桌面安装方式支持pdf:https://thief.im/
thief.com 摸鱼官网
- EasyCode
支持一键生成mvc模式的增删改查代码，能大大提高开发效率(摸鱼时间更多^_^)！

## 6.IDEA配置groovy环境
我在用idea的database功能根据表生成pojo时报如下错误，查了下是缺少配置groovy环境。
```groovy
Error running 'Generate POJOs': Argument for @NotNull parameter 'module' of org/jetbrains/plugins/groovy/runner/DefaultGroovyScriptRunner.configureGenericGroovyRunner must not be null
```

**在此记录下IDEA中如何配置groovy环境。** 

### 6.1 下载groovy安装包  
 [官方地址点击下载](http://www.groovy-lang.org/download.html)  
下载好后解压到自己本机想要的目录下，我这边是放在D:\apache-groovy-sdk-4.0.12\groovy-4.0.12
 <img src="/images/java/java-idea-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 6.2 添加环境变量
这里建议直接添加系统级别的环境变量。  

新增变量名：GROOVY_HOME
变量值：解压后的目录
 <img src="/images/java/java-idea-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


在path路径中追加：%GROOVY_HOME%\bin  
<img src="/images/java/java-idea-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 6.3 检查环境变量配置是否生效
打开cmd，输入"groovy -v"
<img src="/images/java/java-idea-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
只要是这样就说明成功了。

## 7. 配置常用代码注释模板
[注释模板获取](../cszl-java-basic/javadoc.html##注释模板)

### 7.1 类文件注释 
<img src="/images/java/java-idea-10.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
（1）按照上图的提示，找到位置1的File and Code Templates  
（2）选择右侧的Files选项卡，选择位置2的Class（如果需要设置接口和枚举的注释模版，只需要选择Interface和Enum，按照步骤3配置一下就ok了）  
（3）在最右侧的输入栏中，输入位置3框住的一段注释代码，然后点击保存即可  

### 7.2 方法签名注释  
方法签名注释的配置需要手工设置。
首先进入Editor》Live Templates，在右上角+号选择Template Group，新增一个组，我取名为DIYMethod。
<img src="/images/java/java-idea-11.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-12.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

然后按下图1、2、3、4分别进行设置  
```
配置的内容：
1）Abbreviation：模板的缩写。

2）Description：模板的描述。

3）Template text：模板的内容 ，图中第一个/不是我漏掉了，只要写上第一个/，生成的注释@param和@return都会为null。

4）Options→Expand with：模板的扩展快捷键，可以按照个人习惯选择，我用的是Enter键。

下边的“Define” 或者‘change’要点进去进行勾选，可以选everyone 也可以只选java。
```
<img src="/images/java/java-idea-13.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="/images/java/java-idea-14.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>



点击Edit variables：设置变量参数。
点击Edit variables，列表中显示的就是配置的模板内容中的参数的参数名。
<img src="/images/java/java-idea-15.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
上图中的param脚本
```groovy
groovyScript("if(\"${_1}\".length() == 2) {return '';} else {def result=''; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList();for(i = 0; i < params.size(); i++) {result+='\\n' + ' * @param ' + params[i] + ' '}; return result;}", methodParameters());
```
最终效果展示：
<img src="/images/java/java-idea-16.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## idea快捷键
查看类的方法列表 ALT+7    
大小写转换 CTRL+SHIFT+U  
