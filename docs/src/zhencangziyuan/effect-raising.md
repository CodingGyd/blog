---
date: 2023-07-16
category:
  - 工具软件
star: true
---

# 摸鱼神器
## 一、学会摸鱼
:::tip 声明
摸鱼的目的不是真的为了偷懒，而是为了挤出时间和精力休息调整后提升自己(不止技术)，这是优秀的开发必备技能。
:::

作为一名从业多年的业务CRUD工程师， 我发现在日常编码工作中的大部分时间都是在重复做一些CV操作，看似一直在忙碌，其实并没有给我带来太多成长。温水煮青蛙，会逐渐在就业市场上失去竞争力，最后的结果就是被更廉价的劳动力替代~    

一直在做重复CV操作，这应该就是大家自嘲码农的原因之一吧。你别不信，我认为大部分人都正在做这样的CV工作。  

因此，我们必须得学会提高我们的工作效率(学会正确的摸鱼姿势)，寻找合适的方法解放我们的双手，把精力从重复CV操作中解放出来，每天在不影响工作产出的前提下留出一些时间来持续学习技术，保持自己的核心竞争力。

下面会持续记录一些解放个人生产力的神器，也是我目前在用的一些好用工具，推荐给大家。
 
## 二、数据库设计工具
### 1、经验分享
一个需求流转到开发人员手上后，我们需要先做底层的分析设计，而数据库设计是重要的底层设计之一。数据库方案设计的好不好，会直接影响到之后的应用代码编写过程以及上线之后的维护。这个就跟建造房屋一个道理，万丈高楼平地起，一砖一瓦皆根基，基建质量直接影响到之后房屋的质量。

回顾我的工作经历，我发现数据库设计最终要产出的其实就是两大要素：实体、关系。 

我一般习惯围绕以下5个问题来分析拆解一个复杂的业务需求(照着原型图看，不明确的找产品沟通确认)：

- 1.有哪些业务实体？
- 2.每个实体的属性有哪些？ 
- 3.实体与实体之间是什么关联关系? （1:1、1:N、N:N）
- 4.属性应该定义成什么类型？
- 5.属性的字段长度应该设计成多少？

上面的工作产出最终其实就是一张ER图，实体与关系的定义其实就是E-R图，ER图是专业人员用来描述现实世界中的实体关系模型。  

完成ER图绘制的方式有很多种，可以选择在线工具比如processon，桌面软件visio，或者直接用excel或者白板绘制工具都行。但是这些方式都有一个缺点，绘制好之后还得自己照着设计花时间编写sql建表语句。那么有没有工具让我们能在做好设计的同时把sql工作也一并完成呢？答案是：有！ 

PowerDesigner就支持我们做好ER图设计之后一键导出各种数据库的SQL语句了，我们只需要将生成的SQL拷贝到数据库进行执行即可(极少量的修改)。  

下面举个简单的例子说明我是如何使用PowerDesigner完成E-R图设计和SQL语句的生成。

### 2、需求提出
假设业务方需要在后台管理系统中增加一个班级和学生信息维护模块，支持班级信息和学生信息的增删改查即可。

接下来用5个问题来分析拆解该需求，最终产出数据库设计方案(此处不考虑数据库设计的一些规范原则如三大范式，目的仅说明er图工具如何使用)。  

**1) 有哪些业务实体** 

涉及班级、学生这两个实体  

**2) 每个实体的属性有哪些？**

班级：班级号、班级名称、创建时间、更新时间、操作人；  

学生：学生号、姓名、性别、身份证、联系方式、住址、备注、录入时间、更新时间、操作人。

**3) 实体与实体之间是什么关联关系?**

班级和学生是1:N的关联关系，一个班级里有多个学生，一个学生只能属于某一个班级。
 
**4) 属性应该定义成什么类型**

##班级##  
班级号：字符串  
班级名称：字符串  
创建时间；日期(精确到秒)  
更新时间：日期(精确到秒)   
操作人：字符串  
 
##学生##  
学生号：字符串  
姓名：字符串  
性别：字符串  
身份证：字符串  
联系方式：字符串  
住址：字符串  
备注：字符串
录入时间；日期(精确到秒)  
更新时间：日期(精确到秒)   
操作人：字符串  

**5) 属性字段长度应设计成多少？**

此处日期类型默认限制了长度，字符串类型统一设置成255(注意实际业务需要按具体场景设计每个字段长度，否则会造成表空间资源的浪费)  

 
### 3、ER图绘制
**1）新建ER文件**

打开我们的PowerDesigner，左上角选择File-New Model，输入er图名称，点击[ok]创建空文件。

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

**2）定义实体和关系**

- 班级实体定义

在右侧Toolbox上选中table图标，然后单击中间绘图区域添加一个表区域

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

注意：上面的Toolbox视图如果没有，则在软件左上角选择View-ToolBox 勾选中即可展示。  


接下来双击绘制区域的表区域，弹出编辑框，在Tab[Generals]开始编辑表的名称和描述信息

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

编辑框切到Tab[Columns]定义字段配置信息

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


编辑框的Tab[Preview]可以预览对应的SQL语句

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


表配置和字段配置定义好后，先点击编辑框右下角的【应用】，然后点击【确定】完成班级表的配置

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


班级表在ER图展示如下

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 学生实体定义

同班级表结构定义步骤。

- 关联关系定义

班级和学生实体定义完成后，在ER图中效果如下

<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-10.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

接下来选中右侧ToolBox-Pyhsical Diagram-Reference，然后对班级表和学生表进行关联
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-11.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
注意：箭头指向的是主表(班级表)，箭尾是子表(学生表)。

双击画好的连接线，弹出编辑框，切换到Tab[Joins]定义字段关联关系
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-12.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
注意：学生和班级通过班级号来进行关联，学生和班级是1:N的关系


**3）导出建表语句**
实体和关系的ER图绘制完成后，接下来就是导出建表SQL语句了。

在软件左上角选择DataBase-Generate Database，弹出如下界面进行导出配置：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-13.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

上面可以选择导出文件名称和导出路径，也可以切换到PreView页面预览导出的sql：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-14.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


最终导出的sql文件：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-15.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


### 4、工具问题记录
- **导出的sql语句中字段注释缺失**  
我明明在er图绘制定义字段的时候，给了注释，导出的sql里却没有注释信息？ 

原因是因为PowerDesigner默认配置的导出不带注释，需要手动修改下导出的sql配置信息，针对mysql5.0修改方式如下：

软件左上角Database --> Edit Current DBMS，弹出编辑框后找到 MySqlX.X --> Script --> Objects --> Column --> Add：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-16.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

原始内容：
```
%20:COLUMN% [%National%?national ]%DATATYPE%[%Unsigned%? unsigned][%ZeroFill%? zerofill][ [.O:[character set][charset]] %CharSet%][.Z:[ %NOTNULL%][%IDENTITY%? auto_increment:[ default %DEFAULT%]][ comment %.q:@OBJTLABL%]]
```
修改原始内容为如下即可：
```
%20:COLUMN% [%National%?national ]%DATATYPE%[%Unsigned%? unsigned][%ZeroFill%? zerofill][ [.O:[character set][charset]] %CharSet%][.Z:[ %NOTNULL%][%R%?[%PRIMARY%]][%IDENTITY%? auto_increment:[ default %DEFAULT%]][ comment %.q:COMMENT%]]
```

其实只有最后的@OBJTLABL改为COMMENT就行了。

- **导出的sql语句中字段注释乱码**  
```
create table xxx
(
   id                   bigint not null,
   code                 varchar(100) comment ' ¼     ',
   event_name           varchar(100) comment ' ¼     ',
   occur_time           varchar(50) comment ' · ʱ  ',
   address              varchar(100) comment ' ·   ַ',
   latitude             varchar(50) comment ' ·   λ    ',
   longitude            varchar(50) comment ' ·   λγ  ',
   level                varchar(10) comment ' ¼  ȼ ',
   description          varchar(50) comment ' ¼     ',
   reporter             varchar(100) comment ' ϱ   ',
   info_source          varchar(50) comment '  Ϣ  Դ',
   "label"              varchar(200) comment ' ¼   ǩ',
   event_type           varchar(20) comment ' ¼     ',
   data_version         int comment ' ¼  汾  ',
   insert_time          timestamp comment '    ʱ  ',
   update_time          timestamp comment '    ʱ  ',
   last_updater         varchar(100) comment '        ',
   primary key (id)
);
```

解决办法：在DataBase Generation对话框中的format选项卡中修改编码即可，我将Encoding设置为UTF-8 重新导出正常了。
<img src="http://cdn.gydblog.com/images/zhencangziyuan/er-17.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


## 三、代码生成工具
### 1、千篇一律的CRUD工作

CRUD工程师们的日常开发工作流程通常是下面的形式：

- 1.设计数据库表(画ER图, 有些开发人员甚至不画ER图，直接建表，遇到问题再修修改改)；
- 2.根据ER图建好数据库表结构；
- 3.定义表的映射实体: 根据表结构写实体类XxxEntity；
- 4.定义SQL:写XxxMapper实现CRUD的SQL方法；
- 5.实现业务逻辑-写XxxService对XxxMapper进行调用；
- 6.定义接口：写XxxController对XxxService进行调用并返回给前端；


思考一下，如果数据库表中的字段定义比较少且表数量少，完成上面的6个步骤不会占用太多时间，按顺序傻瓜式操作完成即可。

但是！！如果一个需求里涉及的表有几十张甚至上百张，且每个表的字段有几十个呢！？想想都心累，上面6个步骤带来的工作量将巨大无比，纯纯的体力活，而且会占用很多工作时间。

上述操作步骤其实都是有共性操作的，在如今这个追求智能化的时代，完全可以通过自动化手段来完成。在这里我强烈推荐IDEA插件EasyCode，完美的帮我们实现了上面6个步骤的自动化代码生成工作！！真的是能够节约了很多时间，我们可以把省出来的时间去做一些重要且有意义的事情了。

接下来就和大家分享一下EasyCode的简单使用。

### 2、EasyCode工具介绍  

- 基于IntelliJ IDEA开发的代码生成插件，支持自定义任意模板（Java，html，js，xml）。

- 只要是与数据库相关的代码都可以通过自定义模板来生成。支持数据库类型与java类型映射关系配置。

- 支持同时生成生成多张表的代码。每张表有独立的配置信息。完全的个性化定义，规则由你设置。

官方文档：https://gitee.com/makejava/EasyCode/wikis/pages

### 3、IDEA集成EasyCode工具说明

- IDEA中安装EasyCode插件

在idea的plugins 插件市场搜索EasyCode，点击Install按钮进行安装：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 插件配置

配置入口路径是IDEA的File>>Settings>>Other Settings>>EasyCode: 

<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 配置EasyCode全局信息
可配置用户名（对应生成代码注释中的@author字段），支持自定义模板的导出和导入，用户也可以自定义  

- Type Mapper配置  
用于自定义配置生成代码的字段类型映射模板。 

> 不推荐编辑默认模板，复制默认分组（default），生成一份自己的分组（MyGroup）,然后在自己的分组上进行个性化修改（点击分组右边的复制图标或新增图片）；  

> columnType对应数据库表的字段类型，用正则表达式，详细的语法参考正则语法；  

> javaType对应生成的Java Entity中属性的类型。

可以点击+/-号添加/或删除映射关系。

示例中数据库的integer类型和java.lang.Integer类对应:  
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


- Template配置代码模板    

为每个Java类（Controller，Service，ServiceImpl，Mapper，Entity，Dto）配置一个生成模板，配置使用。

> 不推荐编辑默认模板，可以复制一个分组进行编辑（点击分组右边的复制图标或新增图标）；

> 添加模板时名称尽量带扩展名，如entity.java 这样可以实现代码语法高亮。

<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- Global Config全局配置  

全局变量主要是用来定义宏（velocity宏定义），或者用来编写一大段重复代码：  

<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

> 例如添加一个全局变量名称为demo值为Hello,那么就可以在任意模板中通过$!demo去使用这个全局变量。当然通常并不会这么使用，而是使用velocity语法中的#set来完成。

> 全局变量的命名很重要，千万不能与模板中的任意变量名冲突。不然会被替换。

- Column Config全局配置  
暂未用到，没有深入了解过

### 4、EasyCode工具的使用  
#### 1）数据表结构
假设一个业务需求分析下来需要设计下面的Demo表，表结构如下：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
 

#### 2）使用easycode导出代码
找到IDEA的database插件(若不了解该插件的使用，百度一下)，连接到表所在的数据库，然后选中要生成代码的表，右键点击EasyCode》Generate Code: 
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

弹出如下代码生成选型，勾选相关配置(主要是选择配置好的代码模板)，点击【ok】，即可生成对应的代码了！
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


最终生成的代码文件：
<img src="http://cdn.gydblog.com/images/zhencangziyuan/easycode-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

经过上面步骤生成了基本的MVC三层代码，我只需要根据具体业务逻辑做一些定制化的修改即可，至少给我节省了30%的开发时间了！！！

### 5、个人代码生成模板分享  
EasyCode的Template Setting里面 生成的代码配置脚本，根据本人的开发习惯，整理出一套集成swagger的代码生成模板，仅供参考：

**1) entity.java.vm**  
```java
##引入宏定义
$!{define.vm}

##使用宏定义设置回调（保存位置与文件后缀）
#save("/entity", "Entity.java")

##使用宏定义设置包后缀
#setPackageSuffix("entity")

##使用全局变量实现默认包导入
$!{autoImport.vm}
import java.io.Serializable;

##使用宏定义实现类注释信息
#tableComment("实体类")
public class $!{tableInfo.name}Entity implements Serializable {
    private static final long serialVersionUID = $!tool.serial();
#foreach($column in $tableInfo.fullColumn)
    #if(${column.comment})/**
     * ${column.comment}
     */#end

    private $!{tool.getClsNameByFullName($column.type)} $!{column.name};
#end

#foreach($column in $tableInfo.fullColumn)
##使用宏定义实现get,set方法
#getSetMethod($column)
#end

}
```


**2) mapper.java.vm**  
```java
##定义初始变量
#set($tableName = $tool.append($tableInfo.name, "Mapper"))
##设置回调
$!callback.setFileName($tool.append($tableName, ".java"))
$!callback.setSavePath($tool.append($tableInfo.savePath, "/mapper"))

##拿到主键
#if(!$tableInfo.pkColumn.isEmpty())
    #set($pk = $tableInfo.pkColumn.get(0))
#end

#if($tableInfo.savePackageName)package $!{tableInfo.savePackageName}.#{end}mapper;

import $!{tableInfo.savePackageName}.entity.$!{tableInfo.name}Entity;
import org.apache.ibatis.annotations.Param;
import java.util.List;


/**
 * $!{tableInfo.comment}($!{tableInfo.name})表数据库访问层
 *
 * @author $!author
 * @since $!time.currTime()
 */
public interface $!{tableName} {

    /**
     * 通过ID查询单条数据
     *
     * @param $!pk.name 主键
     * @return 实例对象
     */
    $!{tableInfo.name}Entity queryById($!pk.shortType $!pk.name);

    /**
     * 查询指定行数据
     *
     * @param $!tool.firstLowerCase($!{tableInfo.name}) 查询条件
     * @param pageSize         每页记录条数
     * @param pageIndex         页码
     * @return 对象列表
     */
    List<$!{tableInfo.name}Entity> queryAllByLimit($!{tableInfo.name}Entity $!tool.firstLowerCase($!{tableInfo.name}), @Param("pageSize") long pageSize, @Param("pageIndex") long pageIndex);

    /**
     * 统计总行数
     *
     * @param $!tool.firstLowerCase($!{tableInfo.name}) 查询条件
     * @return 总行数
     */
    long count($!{tableInfo.name}Entity $!tool.firstLowerCase($!{tableInfo.name}));

    /**
     * 新增数据
     *
     * @param $!tool.firstLowerCase($!{tableInfo.name}) 实例对象
     * @return 影响行数
     */
    int insert($!{tableInfo.name}Entity $!tool.firstLowerCase($!{tableInfo.name}));

    /**
     * 批量新增数据（MyBatis原生foreach方法）
     *
     * @param entities List<$!{tableInfo.name}> 实例对象列表
     * @return 影响行数
     */
    int insertBatch(@Param("entities") List<$!{tableInfo.name}Entity> entities);

    /**
     * 批量新增或按主键更新数据（MyBatis原生foreach方法）
     *
     * @param entities List<$!{tableInfo.name}> 实例对象列表
     * @return 影响行数
     * @throws org.springframework.jdbc.BadSqlGrammarException 入参是空List的时候会抛SQL语句错误的异常，请自行校验入参
     */
    int insertOrUpdateBatch(@Param("entities") List<$!{tableInfo.name}Entity> entities);

    /**
     * 修改数据
     *
     * @param $!tool.firstLowerCase($!{tableInfo.name}) 实例对象
     * @return 影响行数
     */
    int update($!{tableInfo.name}Entity $!tool.firstLowerCase($!{tableInfo.name}));

    /**
     * 通过主键删除数据
     *
     * @param $!pk.name 主键
     * @return 影响行数
     */
    int deleteById($!pk.shortType $!pk.name);

}

```


**3) service.java.vm**  
```java
##定义初始变量
#set($tableName = $tool.append($tableInfo.name, "Service"))
##设置回调
$!callback.setFileName($tool.append($tableName, ".java"))
$!callback.setSavePath($tool.append($tableInfo.savePath, "/service"))

##拿到主键
#if(!$tableInfo.pkColumn.isEmpty())
    #set($pk = $tableInfo.pkColumn.get(0))
#end

#if($tableInfo.savePackageName)package $!{tableInfo.savePackageName}.#{end}service;

import $!{tableInfo.savePackageName}.dto.$!{tableInfo.name}Dto;
import com.gyd.PageResult;
import java.util.List;

/**
 * $!{tableInfo.comment}($!{tableInfo.name})表服务接口
 *
 * @author $!author
 * @since $!time.currTime()
 */
public interface $!{tableName} {


    /**
     * 单条记录新增或修改
     * @param request 待保存数据
     * @return 查询结果
     */
    $!{tableInfo.name}Dto save$!{tableInfo.name}($!{tableInfo.name}Dto request);

    /**
     * 分页查询
     *
     * @param request 筛选条件
     * @return 查询结果
     */
    PageResult<$!{tableInfo.name}Dto> query$!{tableInfo.name}List($!{tableInfo.name}Dto request);
    
    /**
     * 全量查询
     *
     * @param request 筛选条件
     * @return 查询结果
     */
    List<$!{tableInfo.name}Dto> query$!{tableInfo.name}ListAll($!{tableInfo.name}Dto request);

    /**
     * 根据业务主键查询单条数据
     * @param request 筛选条件
     * @return 查询结果
     */
    $!{tableInfo.name}Dto queryOne($!{tableInfo.name}Dto request);

    /**
     * 删除单条数据
     * @param request 待删除数据
     * @return 删除结果
     */
    boolean deleteOne($!{tableInfo.name}Dto request);
     
}
```


**4) serviceImpl.java.vm**  
```java
##定义初始变量
#set($tableName = $tool.append($tableInfo.name, "ServiceImpl"))
##设置回调
$!callback.setFileName($tool.append($tableName, ".java"))
$!callback.setSavePath($tool.append($tableInfo.savePath, "/service/impl"))

##拿到主键
#if(!$tableInfo.pkColumn.isEmpty())
    #set($pk = $tableInfo.pkColumn.get(0))
#end

#if($tableInfo.savePackageName)package $!{tableInfo.savePackageName}.#{end}service.impl;

import $!{tableInfo.savePackageName}.entity.$!{tableInfo.name}Entity;
import $!{tableInfo.savePackageName}.dto.$!{tableInfo.name}Dto;

import $!{tableInfo.savePackageName}.mapper.$!{tableInfo.name}Mapper;
import $!{tableInfo.savePackageName}.service.$!{tableInfo.name}Service;
import org.springframework.stereotype.Service;
import com.gyd.PageResult;
import java.util.List;

import javax.annotation.Resource;

/**
 * $!{tableInfo.comment}($!{tableInfo.name})表服务实现类
 *
 * @author $!author
 * @since $!time.currTime()
 */
@Service("$!tool.firstLowerCase($!{tableInfo.name})Service")
public class $!{tableName} implements $!{tableInfo.name}Service {
    @Resource
    private $!{tableInfo.name}Mapper $!tool.firstLowerCase($!{tableInfo.name})Mapper;

    @Override
    public $!{tableInfo.name}Dto save$!{tableInfo.name}($!{tableInfo.name}Dto request){
        //todo
        return null;
    }

    @Override
    public PageResult<$!{tableInfo.name}Dto> query$!{tableInfo.name}List($!{tableInfo.name}Dto request){
        //todo
        return null;
    }
    
    
    @Override
    public List<$!{tableInfo.name}Dto> query$!{tableInfo.name}ListAll($!{tableInfo.name}Dto request){
        //todo
        return null;
    }

    @Override
    public $!{tableInfo.name}Dto queryOne($!{tableInfo.name}Dto request){
        //todo
        return null;
    }

    @Override
    public boolean deleteOne($!{tableInfo.name}Dto request){
        //todo
        return false;
    }
     
}
```

**5) controller.java.vm**  
```java
##定义初始变量
#set($tableName = $tool.append($tableInfo.name, "Controller"))
##设置回调
$!callback.setFileName($tool.append($tableName, ".java"))
$!callback.setSavePath($tool.append($tableInfo.savePath, "/controller"))
##拿到主键
#if(!$tableInfo.pkColumn.isEmpty())
    #set($pk = $tableInfo.pkColumn.get(0))
#end

#if($tableInfo.savePackageName)package $!{tableInfo.savePackageName}.#{end}controller;

import $!{tableInfo.savePackageName}.dto.$!{tableInfo.name}Dto;
import $!{tableInfo.savePackageName}.service.$!{tableInfo.name}Service;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.gyd.ResultWrapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.annotation.Resource;
import com.gyd.PageResult;

/**
 * $!{tableInfo.comment}($!{tableInfo.name})表控制层
 *
 * @author $!author
 * @since $!time.currTime()
 */
@RestController
@RequestMapping("$!tool.firstLowerCase($tableInfo.name)")
@Api(tags = {"$!{tableInfo.comment}相关接口"})
public class $!{tableName} {

    @Resource
    $!{tableInfo.name}Service $!tool.firstLowerCase($tableInfo.name)Service;
    
    /**
     * 新增或修改数据
     *
     * @param request 入参
     * @return 新增或修改结果
     */
    @PostMapping(value = "/save")
    @ApiOperation("新增或修改")
    public ResultWrapper<$!{tableInfo.name}Dto> save(@ApiParam @RequestBody $!{tableInfo.name}Dto request){
        return  ResultWrapper.SUCCESS($!{tool.firstLowerCase($tableInfo.name)}Service.save$!{tableInfo.name}(request));
    }
    
    /**
     * 分页查询
     *
     * @param request 筛选条件
     * @return 查询结果
     */
    @NoLogin
    @RequestMapping(value = "/queryList",method = {RequestMethod.POST,RequestMethod.GET})
    @ApiOperation("列表分页查询")
    public ResultWrapper<PageResult<$!{tableInfo.name}Dto>> query$!{tableInfo.name}List(@RequestBody $!{tableInfo.name}Dto request){
        return ResultWrapper.SUCCESS($!{tool.firstLowerCase($tableInfo.name)}Service.query$!{tableInfo.name}List(request));
    }

    /**
     * 不分页查询
     * @param request 入参
     */
    @NoLogin
    @RequestMapping(value = "/queryListAll",method = {RequestMethod.POST,RequestMethod.GET})
    @ApiOperation("列表全量查询")
    public ResultWrapper<List<$!{tableInfo.name}Dto>> query$!{tableInfo.name}ListAll(@RequestBody $!{tableInfo.name}Dto request){
        return ResultWrapper.SUCCESS($!{tool.firstLowerCase($tableInfo.name)}Service.query$!{tableInfo.name}ListAll(request));
    }

    /**
     * 单个查询接口
     * @param request 入参
     */
    @NoLogin
    @RequestMapping(value = "/queryOne",method = {RequestMethod.POST,RequestMethod.GET})
    @ApiOperation("单个查询")
    public ResultWrapper<$!{tableInfo.name}Dto> query$!{tableInfo.name}(@RequestBody $!{tableInfo.name}Dto request){
        return ResultWrapper.SUCCESS($!{tool.firstLowerCase($tableInfo.name)}Service.queryOne(request));
    }

   /**
     * 删除数据
     *
     * @param request 入参
     * @return 删除是否成功
     */
    @NoLogin
    @DeleteMapping(value = "/deleteOne")
    @ApiOperation("列表单个删除接口")
    public ResultWrapper<Boolean> deleteOne(@RequestBody $!{tableInfo.name}Dto request){
        return ResultWrapper.SUCCESS($!{tool.firstLowerCase($tableInfo.name)}Service.deleteOne(request));
    }

}

```

**6) dto.java.vm**  
```java
##引入宏定义
$!{define.vm}

##使用宏定义设置回调（保存位置与文件后缀）
#save("/dto", "Dto.java")

##使用宏定义设置包后缀
#setPackageSuffix("dto")

##使用全局变量实现默认包导入
$!{autoImport.vm}
import java.io.Serializable;

##使用宏定义实现类注释信息
#tableComment("业务实体类")
public class $!{tableInfo.name}Dto implements Serializable {
    private static final long serialVersionUID = $!tool.serial();
#foreach($column in $tableInfo.fullColumn)
    #if(${column.comment})/**
     * ${column.comment}
     */#end

    private $!{tool.getClsNameByFullName($column.type)} $!{column.name};
#end

#foreach($column in $tableInfo.fullColumn)
##使用宏定义实现get,set方法
#getSetMethod($column)
#end

}

```

**7) mapper.xml.vm**  
```java
##引入mybatis支持
$!{mybatisSupport.vm}

##设置保存名称与保存位置
$!callback.setFileName($tool.append($!{tableInfo.name}, "Mapper.xml"))
$!callback.setSavePath($tool.append($modulePath, "/src/main/resources/com/gyd/mapper"))

##拿到主键
#if(!$tableInfo.pkColumn.isEmpty())
    #set($pk = $tableInfo.pkColumn.get(0))
#end

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="$!{tableInfo.savePackageName}.mapper.$!{tableInfo.name}Mapper">

    <resultMap type="$!{tableInfo.savePackageName}.entity.$!{tableInfo.name}Entity" id="$!{tableInfo.name}Map">
#foreach($column in $tableInfo.fullColumn)
        <result column="$!column.obj.name" jdbcType="$!column.ext.jdbcType" property="$!column.name" />
#end
    </resultMap>

  <sql id="Base_Column_List">
     #allSqlColumn()
  </sql>
  
    <!--查询单个-->
    <select id="queryById" resultMap="$!{tableInfo.name}Map">
        select
           <include refid="Base_Column_List" />

        from $!tableInfo.obj.name
        where $!pk.obj.name = #{$!pk.name}
    </select>

    <!--查询指定行数据-->
    <select id="queryAllByLimit" resultMap="$!{tableInfo.name}Map">
        select
          <include refid="Base_Column_List" />

        from $!tableInfo.obj.name
        <where>
#foreach($column in $tableInfo.fullColumn)
            <if test="$!column.name != null#if($column.type.equals("java.lang.String")) and $!column.name != ''#end">
                and $!column.obj.name = #{$!column.name}
            </if>
#end
        </where>
        limit #{pageIndex}, #{pageSize}
    </select>

    <!--统计总行数-->
    <select id="count" resultType="java.lang.Long">
        select count(1)
        from $!tableInfo.obj.name
        <where>
#foreach($column in $tableInfo.fullColumn)
            <if test="$!column.name != null#if($column.type.equals("java.lang.String")) and $!column.name != ''#end">
                and $!column.obj.name = #{$!column.name}
            </if>
#end
        </where>
    </select>

    <!--新增所有列-->
    <insert id="insert" keyProperty="$!pk.name" useGeneratedKeys="true">
        insert into $!{tableInfo.obj.name}(#foreach($column in $tableInfo.otherColumn)$!column.obj.name#if($velocityHasNext), #end#end)
        values (#foreach($column in $tableInfo.otherColumn)#{$!{column.name}}#if($velocityHasNext), #end#end)
    </insert>

    <insert id="insertBatch" keyProperty="$!pk.name" useGeneratedKeys="true">
        insert into $!{tableInfo.obj.name}(#foreach($column in $tableInfo.otherColumn)$!column.obj.name#if($velocityHasNext), #end#end)
        values
        <foreach collection="entities" item="entity" separator=",">
        (#foreach($column in $tableInfo.otherColumn)#{entity.$!{column.name}}#if($velocityHasNext), #end#end)
        </foreach>
    </insert>

    <insert id="insertOrUpdateBatch" keyProperty="$!pk.name" useGeneratedKeys="true">
        insert into $!{tableInfo.obj.name}(#foreach($column in $tableInfo.otherColumn)$!column.obj.name#if($velocityHasNext), #end#end)
        values
        <foreach collection="entities" item="entity" separator=",">
            (#foreach($column in $tableInfo.otherColumn)#{entity.$!{column.name}}#if($velocityHasNext), #end#end)
        </foreach>
        on duplicate key update
        #foreach($column in $tableInfo.otherColumn)$!column.obj.name = values($!column.obj.name)#if($velocityHasNext),
        #end#end

    </insert>

    <!--通过主键修改数据-->
    <update id="update">
        update $!{tableInfo.obj.name}
        <set>
#foreach($column in $tableInfo.otherColumn)
            <if test="$!column.name != null#if($column.type.equals("java.lang.String")) and $!column.name != ''#end">
                $!column.obj.name = #{$!column.name},
            </if>
#end
        </set>
        where $!pk.obj.name = #{$!pk.name}
    </update>

    <!--通过主键删除-->
    <delete id="deleteById">
        delete from $!{tableInfo.obj.name} where $!pk.obj.name = #{$!pk.name}
    </delete>

</mapper>

```

