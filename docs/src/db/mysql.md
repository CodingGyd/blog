---
title: MYSQL知识点大全
shortTitle: MYSQL知识点大全
date: 2023-08-30
category:
  - JAVA企业级开发
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: 数据库,MySQL,关系型数据库,MySQL语法,MySQL原理
---

# MySQL知识点大全

> 官方文档https://www.mysql.com/cn/products/community/

> 本篇默认读者已有SQL基础知识储备

## 一、概述
MySQL 是当下最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 可以说是最流行的技术。选择 MySQL 数据库已是既成事实，绝大多数使用 Linux 操作系统的互联网网站都在使用 MySQL 作为其后端的数据库存储方式，从大型的 BAT 门户到电商平台、分类门户等无一例外。


原因可能有以下几点：

- MySQL 性能卓越，服务稳定，很少出现异常宕机的情况。

- MySQL 开放源代码且无版权制约，自主性强，使用成本低。

- MySQL 历史悠久，社区及用户非常活跃，遇到问题，可以寻求帮助。

- MySQL 软件体积小，安装使用简单，并且易于维护，安装及维护成本低。

- MySQL 品牌口碑效应好，使得企业无须考虑即可直接用之。

- LAMP、LNMP、LNMT（tomcat）等流行 Web 架构都含有 MySQL。

- MySQL 支持多种操作系统，提供了多种 API，支持多种开发语言，特别是对流行的 Java、Python、PHP 等语言都有很好的支持。


接下来小郭将把MySql的常见知识点进行总结(部分知识点转载于网络)。

## 二、架构设计

### 1、整体逻辑架构

![逻辑架构](http://cdn.gydblog.com/images/database/mysql/mysql-jiagou-2.png)

**1）客户端**

本层所提供的服务并不是MySQL所独有的技术。它们都是服务于C/S程序或者是这些程序所需要的，例如连接处理，身份验证，安全性等等。

**2）核心服务层**

本层是MySQL的核心部分，也叫做 SQL Layer。
在 MySQL数据库系统处理底层数据之前的所有工作都是在这一层完成的，包括权限判断， sql解析，行计划优化， 查询缓存的处理以及所有内置的函数(如日期,时间,数学运算,加密)等等。各个存储引擎提供的功能都集中在这一层，如存储过程，触发器，视图等。

**3）存储引擎** 

本层也叫做StorEngine Layer ，是底层数据存取操作实现的核心，由多种存储引擎共同组成。

它们负责存储和获取所有存储在MySQL中的数据。就像Linux众多的文件系统 一样，每个存储引擎都有自己的优点和缺陷。核心服务层通过存储引擎API来与它们交互的。这些API隐藏了各个存储引擎不同的地方，对于服务层尽可能的透明。API包含了很多底层的操作，如开始一个事物，或者取出有特定主键的行。存储引擎不能解析SQL，互相之间也不能通信。仅仅是简单的响应核心服务层的请求。

### 2、架构组件划分

以下是官网的体系结构图： 

![架构组件划分](http://cdn.gydblog.com/images/database/mysql/mysql-jiagou-1.png)


![架构组件划分中文版](http://cdn.gydblog.com/images/database/mysql/mysql-jiagou-3.png)

**1）客户端连接器(Connectors)**
这一层也可以认为是网络链接层。

连接器为不同的客户端程序提供与MySQL服务器的连接。 使得我们能够连接和执行来自另一种语言或环境的MySQL语句，包括ODBC，Java（JDBC），Perl，Python，PHP，Ruby和本机C MySQL实例。

连接器实例：
- Connector/C++ ： 提供C++程序驱动支持，C++程序可以连接到MySQL
- Connector/J：提供JAVA程序驱动程序支持，可使用标准Java数据库连接（JDBC）API从Java应用程序连接到MySQL。
- Connector/NET： 提供.NET程序驱动程序支持，可以支持任何.NET语言编写的应用程序连接MySQL数据库。
- Connector/ODBC：为使用开放数据库连接（ODBC）API连接到MySQL提供驱动程序支持。 支持从Windows，Unix和macOS平台进行ODBC连接。
- Connector/Python：提供Python程序驱动程序支持，可使用兼容 Python DB API版本2.0的API从Python应用程序连接到MySQL。不需要其他Python模块或MySQL客户端库。

**2）系统管理和控制工具**

系统管理和控制工具，比如MySQL安装包bin目录下提供的服务管理和工具（mysqld、mysql_safe、mysql.server等），还有备份恢复工具等等。

**3）连接池**

连接池主要负责连接管理、授权认证、安全等等。每个客户端连接都对应着MySql服务器上的一个线程。服务器上维护了一个线程池，避免为每个连接都创建销毁一个线程。当客户端连接到MySQL服务器时，服务器对其进行认证。可以通过用户名与密码认证，也可以通过SSL证书进行认证。登录认证后，服务器还会验证客户端是否有执行某个查询的操作权限。

> 由于每次建立连接需要消耗很多时间，连接池的作用就是将这些连接缓存下来，下次可以直接用已经建立好的连接，提升服务器性能。 连接池可以大大提高Java应用程序的性能，同时减少总体资源使用量。

**4）SQL 接口**

SQL Interface（SQL接口组件），接受用户的SQL命令，并且返回用户需要查询的结果。比如select from就是调用SQL接口操作的。

**5）解析器**  

SQL命令传递到解析器的时候会被解析器验证和解析。解析器是由Lex和YACC实现的，是一个很长的脚本。

在 MySQL中我们习惯将所有 Client 端发送给 Server 端的命令都称为 query ，在 MySQL Server 里面，连接线程接收到客户端的一个 Query 后，会直接将该 query 传递给专门负责将各种 Query 进行分类然后转发给各个对应的处理模块。

主要功能：
- 将SQL语句进行语义和语法的分析，分解成数据结构，然后按照不同的操作类型进行分类，然后做出针对性的转发到后续步骤，以后SQL语句的传递和处理就是基于这个结构的。
- 如果在分解构成中遇到错误，那么就说明这个sql语句是不合理的

**6）查询优化器** 

SQL语句在查询之前会使用查询优化器对查询进行优化。就是优化客户端请求的 query（sql语句） ，根据客户端请求的 query 语句，和数据库中的一些统计信息，在一系列算法的基础上进行分析，得出一个最优的策略，告诉后面的程序如何取得这个 query 语句的结果

**7）缓存**

> 8.0版本之前支持查询缓存，8.0之后不支持了

主要功能是将客户端提交给MySQL的**查询类请求**的返回结果集**缓存**到内存中，与该查询语句的一个hash值做一个对应。该查询请求所取数据的基表发生任何数据的变化之后， MySQL会自动使该查询请求的缓存数据失效。在读写比例非常高的应用系统中， 查询请求增加缓存对性能的提高是非常显著的。当然它对内存的消耗也是非常大的。

如果查询缓存有命中的查询结果，查询语句就可以直接去查询缓存中取数据。这个缓存机制是由一系列小缓存组成的。比如表缓存，记录缓存，key缓存，权限缓存等

**8）可插拔存储引擎**

存储引擎负责与数据库文件交互。存储引擎接口模块可以说是 MySQL 数据库中最有特色的一点了。目前各种数据库产品中，基本上只有 MySQL 可以实现其底层数据存储引擎的插件式管理。这个模块实际上只是 一个抽象类，但正是因为它成功地将各种数据处理高度抽象化，才成就了今天 MySQL 可插拔存储引擎的特色。


> 注意：存储引擎是基于表的，而不是数据库。


在MySQL中，存储引擎是以插件的形式运行的。支持的引擎有十几种之多，但我们实战常用到的，大概只有InnoDB、MyISAM 、Memory、Archive 了，下面是这几种引擎的区别：

![存储引擎区别](http://cdn.gydblog.com/images/database/mysql/mysql-jiagou-4.png)


## 三、基础知识-版本定义
MySQL 数据库的官方网站为http://www.mysql.com，其发布的 MySQL 版本采用双授权政策，和大多数开源产品的路线一样，MySQL 数据库也有社区版和企业版之分，且这两个版本又各自分了四个版本依次发布，这四个版本分别为：Alpha 版、Beta 版、RC 版和 GA 版本。

生产环境应该选择GA版本!

![版本路线分类](http://cdn.gydblog.com/images/database/mysql/mysql-version.jpg)


## 四、基础知识-环境搭建

> 本文基于window64位操作系统+mysql5.7.43版本来进行陈述。

### 1、安装包获取
MySQL 安装包获取地址为：[官方下载链接](https://dev.mysql.com/downloads/mysql/ "官方下载链接")    

国内下载地址为：[国内下载链接](http://mirrors.sohu.com/mysql/ "国内下载链接")    
挑选对应的 MySQL Community Server 版本(社区版本，免费)及对应的操作系统。

![下载参数选择](http://cdn.gydblog.com/images/database/mysql/mysql-1.png)

安装包下载后解压到指定目录(小郭这里是到D盘根目录)：

![安装包解压目录](http://cdn.gydblog.com/images/database/mysql/mysql-2.png)

### 2、配置
**接下来我们需要配置下 MySQL 的配置文件**  

打开刚刚解压的文件夹 D:\mysql-5.7.43-winx64\ ，在该文件夹下创建 my.ini 配置文件，编辑 my.ini 配置以下基本信息：

```
[client]
# 设置mysql客户端默认字符集
default-character-set=utf8
 
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=D:\\mysql-5.7.43-winx64
# 设置 mysql数据库的数据的存放目录，MySQL 8+ 不需要以下配置，系统自己生成即可，否则有可能报错
# datadir=D:\\mysql-5.7.43-winx64\\sqldata
# 允许最大连接数
max_connections=20
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
```


### 3、启动服务
接下来我们来启动下 MySQL 数据库：

以管理员身份打开 cmd 命令行工具，切换到bin目录:

```
cd D:\\mysql-5.7.43-winx64
```

初始化数据库：
```
mysqld --initialize --console
```

执行完成后，会输出 root 用户的初始默认密码：

```
A temporary password is generated for root@localhost: y?6lLRUr1aSh
```

上述密码要记住，后续登录要用到！


![启动服务日志](http://cdn.gydblog.com/images/database/mysql/mysql-3.png)



在bin目录下，继续执行下面命令(需管理员权限)，安装mysql服务到系统中
```
mysqld install
```

输出如下日志，代表mysql服务安装成功: 
```
Service successfully installed.
```

![安装日志](http://cdn.gydblog.com/images/database/mysql/mysql-4.png)

继续，启动输入以下命令即可：
```
net start mysql
```

![最终启动结果](http://cdn.gydblog.com/images/database/mysql/mysql-5.png)


### 4、访问mysql


当 MySQL 服务已经运行时, 我们可以通过用市面上的mysql客户端进行连接和编写sql， 也可以用MySQL 自带的客户端工具登录到 MySQL 数据库中, 下面演示自带的客户端工具的使用。

首先打开命令提示符, 输入以下格式的命名:
```
//-h : 指定客户端所要登录的 MySQL 主机名, 登录本机(localhost 或 127.0.0.1)该参数可以省略;
//-u : 登录的用户名;
//-p : 告诉服务器将会使用一个密码来登录, 如果所要登录的用户名密码为空, 可以忽略此选项。

mysql -h 主机名 -u 用户名 -p
```

示例：
```
mysql -u root -p
```

然后输入安装时生成的密码即可完成登录。

![MYSQL客户端登录工具](http://cdn.gydblog.com/images/database/mysql/mysql-6.png)


通过默认的密码登录上mysql后，发现总是提示："You must reset your password using ALTER USER statement before executing this statement."
大意就是：在执行此语句之前，必须使用 ALTER USER 语句重置密码。因第一次安装，给的是随机密码，登陆成功后需要第一时间改成自己的密码。

修改密码有两种方式：
```
# 登录mysqlmysql -uroot -p
# alter方式修改root账户的密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';  
flush privileges; //修改成功后刷新权限

# set方式修改
set password for root@localhost = password('123456'); //记得修改自己的账户
flush privileges; //修改成功后刷新权限
```

更新密码后再次执行MySQL相关语句操作即正常回显。

![修改密码](http://cdn.gydblog.com/images/database/mysql/mysql-7.png)


接下来就可以进行正常的库表操作了。

### 5、docker一键安装

> 前面的安装步骤特别繁琐，也可以采用如今的容器化技术docker ，简单几个命令就可以安装完毕。

[docker一键安装mysql](../docker/docker.html#四、示例-部署安装mysql程序)


## 五、基础知识-常用命令

> 命令不区分大小写

### 1、mysql连接
```
mysql -u username -p
```

实例:
```
mysql -u root -p
```
### 2、元数据查询
```
//服务器版本信息
SELECT VERSION( )	
//当前数据库名 (或者返回空)
SELECT DATABASE( )	
//当前用户名
SELECT USER( )	
//服务器状态
SHOW STATUS	
//服务器配置变量
SHOW VARIABLES	
//查看版本支持的存储引擎
show engines;
```

![元数据查询](http://cdn.gydblog.com/images/database/mysql/mysql-22.png)

### 3、数据库操作


1）创建数据库  

语法
```
CREATE DATABASE 数据库名;
```

2）查询数据库

语法
```
SHOW DATABASES;
```

实例：
![创建和查询数据库](http://cdn.gydblog.com/images/database/mysql/mysql-8.png)


3）删除数据库
```
drop database <数据库名>;
```

实例：
![删除数据库](http://cdn.gydblog.com/images/database/mysql/mysql-9.png)

4）使用数据库
```
use DATABASE;
```

实例：
![使用数据库](http://cdn.gydblog.com/images/database/mysql/mysql-10.png)

### 4、创建数据表

语法
```
CREATE TABLE table_name (column_name column_type);
```

或者顺便指定索引
```
CREATE TABLE table_name (
  column1_name data_type,
  column2_name data_type,
  ...,
  INDEX index_name (column1 [ASC|DESC], column2 [ASC|DESC], ...)
);
```

实例：
```
CREATE TABLE IF NOT EXISTS `User`(
   `user_id` INT UNSIGNED AUTO_INCREMENT,
   `user_name` VARCHAR(100) NOT NULL,
   `user_sex` VARCHAR(10) NOT NULL,
   `insert_date` DATE,
   PRIMARY KEY ( `user_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
![创建数据表](http://cdn.gydblog.com/images/database/mysql/mysql-11.png)

### 5、删除数据表
语法
```
DROP TABLE table_name ;
```

实例：
```
DROP TABLE User;
```

![删除数据表](http://cdn.gydblog.com/images/database/mysql/mysql-12.png)

### 6、修改数据表结构

> 在进行重要的结构修改时，建议先备份数据，并在生产环境中谨慎操作,因为修改时会影响到数据库的性能和运行时间。

1）添加新字段
```
ALTER TABLE table_name
ADD column_name data_type;
```

2）修改字段类型
```
ALTER TABLE table_name
MODIFY column_name new_data_type;
```

3）修改字段名称
```
ALTER TABLE table_name
CHANGE old_column_name new_column_name data_type;
```

4）删除字段

```
ALTER TABLE table_name
DROP column_name;
```

5）添加主键约束
```
ALTER TABLE table_name
ADD PRIMARY KEY (column_name);
```

6）添加外键约束
```
ALTER TABLE table_name
ADD FOREIGN KEY (column_name) REFERENCES referenced_table(ref_column_name);
```

7）添加普通索引
```
ALTER TABLE table_name
ADD INDEX index_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```

或者
```
CREATE INDEX index_name
ON table_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```

8）添加唯一索引
```
ALTER TABLE table_name
ADD UNIQUE INDEX index_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```

或者
```
CREATE UNIQUE INDEX index_name
ON table_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```


9）删除索引
```
ALTER TABLE table_name
DROP INDEX index_name;
```

或者
```
DROP INDEX index_name ON table_name;
```

10）重命名表
```
ALTER TABLE old_table_name
RENAME TO new_table_name;
```

11）修改表的存储引擎
```
ALTER TABLE table_name ENGINE = new_storage_engine;
```

### 7、复制数据表
如果我们需要完全的复制MySQL的数据表，包括表的结构，索引，默认值等。 如果仅仅使用CREATE TABLE ... SELECT 命令，是无法实现的。下面介绍如何完全复制一张表

> 原始表是User，复制一个新的表叫User_2

1）获取数据表User的建表语句。
命令：SHOW CREATE TABLE User;

![获取建表语句](http://cdn.gydblog.com/images/database/mysql/mysql-19.png)


2）修改SQL语句的数据表名为User_2，并执行SQL语句。
```
CREATE TABLE `user_2` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `user_sex` varchar(10) NOT NULL,
  `insert_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8
```

此时表user_2的结构和原始表user完全一致，但是没有数据。

3）使用INSERT INTO... SELECT 语句拷贝表中的数据

命令： 
```
INSERT INTO User_2(user_id,user_name,user_sex,insert_date) select user_id,user_name,user_sex,insert_date from user;
```

![数据复制](http://cdn.gydblog.com/images/database/mysql/mysql-20.png)


通过上面三个步骤，就会完整的复制表的内容，包括表结构及表数据。
### 8、插入数据行
语法
```
INSERT INTO table_name ( field1, field2,...fieldN )
                       VALUES
                       ( value1, value2,...valueN );
```

实例：
```
INSERT INTO User(user_name,user_sex,insert_date) VALUES('admin','男','2023-08-29');
```

![插入数据行](http://cdn.gydblog.com/images/database/mysql/mysql-13.png)


### 9、查询数据行
语法
```
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M]
```

实例：
```
SELECT user_name,user_sex FROM User WHERE user_name='admin' LIMIT 1;
```

![查询数据行](http://cdn.gydblog.com/images/database/mysql/mysql-14.png)

### 10、更新数据行
语法
```
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause]
```

实例：
```
UPDATE User SET user_sex='女' where user_name='admin'; 
```

![更新数据行](http://cdn.gydblog.com/images/database/mysql/mysql-15.png)


### 11、删除数据行
语法
```
DELETE FROM table_name [WHERE Clause]
```

实例：
```
DELETE FROM User WHERE user_name='admin';
```

![删除数据行](http://cdn.gydblog.com/images/database/mysql/mysql-16.png)


### 12、模糊查询LIKE
语法
```
SELECT field1, field2,...fieldN 
FROM table_name
WHERE field1 LIKE condition1 [AND [OR]] filed2 = 'somevalue'

```

> LIKE 通常与 % 一同使用，类似于一个元字符的搜索

实例：
```
SELECT *FROM User WHERE user_name LIKE '%ad%';
```

![模糊查询](http://cdn.gydblog.com/images/database/mysql/mysql-17.png)

### 13、联合查询UNION
语法
```
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];

```

> UNION ALL: 返回所有结果集，包含重复数据。
> UNION: 返回所有结果集，不包含重复数据。

### 14、排序

语法
```
SELECT field1, field2,...fieldN FROM table_name1, table_name2...
ORDER BY field1 [ASC [DESC][默认 ASC]], [field2...] [ASC [DESC][默认 ASC]]
```

实例：
```
//按插入时间升序
SELECT * from User ORDER BY insert_date ASC;
```

### 15、分组
语法
```
SELECT column_name, function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
```

实例：
```
//按用户名分组
SELECT user_name,count(1) from User GROUP BY user_name
```


### 16、多表连接查询
- INNER JOIN（内连接,或等值连接）：获取两个表中字段匹配关系的记录。
- LEFT JOIN（左连接）：获取左表所有记录，即使右表没有对应匹配的记录。
- RIGHT JOIN（右连接）： 与 LEFT JOIN 相反，用于获取右表所有记录，即使左表没有对应匹配的记录。

> 我们可以在SELECT, UPDATE 和 DELETE 语句中使用 Mysql 的 JOIN 来联合多表查询。

语法：
```
SELECT a.x,b.y from a inner join b on a.id = b.a_id
```

### 17、正则表达式

>  MySQL中使用 REGEXP 操作符来进行正则表达式匹配。

实例：
```
//查找user_name字段中以'st'为开头的所有数据：
SELECT user_name FROM User WHERE user_name REGEXP '^ad';
```

### 18、事务控制

> 在 MySQL 中只有使用了 Innodb 数据库引擎的数据库或表才支持事务。

语法：

```
MYSQL 事务处理主要有两种方法：
1、用 BEGIN, ROLLBACK, COMMIT来实现

BEGIN 开始一个事务
ROLLBACK 事务回滚
COMMIT 事务确认
2、直接用 SET 来改变 MySQL 的自动提交模式:

SET AUTOCOMMIT=0 禁止自动提交
SET AUTOCOMMIT=1 开启自动提交

```

实例：
![事务](http://cdn.gydblog.com/images/database/mysql/mysql-18.png)


### 19、数据导出
可以使用 SELECT ... INTO OUTFILE 语句导出数据

实例：
```
select *from user into outfile 'D:\\mysql-5.7.43-winx64\\outfile';
```

直接执行上述导出会报错：
```
ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement
```

看字面意思是和--secure-file-pri这个变量有关系，我们看下这个变量的设置是什么：
```
show variables like '%secure%';
```

![secure-file-pri](http://cdn.gydblog.com/images/database/mysql/mysql-23.png)

可以看到这个值是NULL, 查阅资料得知
```
secure-file-pri这个变量被用于限制数据导入的导出操作，诸如执行LOAD DATA以及SELECT ... INTO OUTFILE操作以及LOAD_FILE()函数。 

这个secure_file_priv可以设置的值有三个可选项：

- If empty, the variable has no effect. This is not a secure setting. 【如果此配置项值为空，则表示没有安全设置】
- 如果设置为目录名，则服务器将限制导入和导出操作，使其仅适用于该目录中的文件。该目录必须存在；服务器将不会创建它。
- 如果设置为NULL，则服务器将禁用导入和导出操作。从MySQL 5.7.6开始允许使用此值
```

根据上述的NULL值，可以看到是不允许导出（入）到文件。

解决办法就是在配置文件中，设置secure-file-priv为某个路径即可，如下：
![secure-file-pri](http://cdn.gydblog.com/images/database/mysql/mysql-24.png)

> 注意配置前一定要加一行[mysqld]

最后要想配置生效，需要重启mysql服务，注意是重启服务！不是退出重新登录！

![](http://cdn.gydblog.com/images/database/mysql/mysql-25.png)


配置生效后，重新执行前面的导出命令即可导出数据

![](http://cdn.gydblog.com/images/database/mysql/mysql-26.png)

![导出结果](http://cdn.gydblog.com/images/database/mysql/mysql-27.png)


### 20、数据导入
1）使用mysql命令导入  
语法：
```
mysql -u用户名    -p密码    <  要导入的数据库数据(data.sql)
```

以上命令将将备份的整个数据库 data.sql 导入。

2）使用source命令导入
> source 命令导入数据库需要先登录到数库终端

导入步骤：
```mysql
mysql> create database gyd;      # 创建数据库
mysql> use gyd;                  # 使用已创建的数据库 
mysql> set names utf8;           # 设置编码
mysql> source /home/gyd/gyd.sql  # 导入备份数据库
```

3）使用 LOAD DATA 导入数据

以下实例中将从当前目录中读取文件 outfile.txt ，将该文件中的数据插入到当前数据库的 user 表中。
```
mysql> LOAD DATA LOCAL INFILE 'outfile.txt' INTO TABLE user;
```

LOAD DATA 默认情况下是按照数据文件中列的顺序插入数据的，如果数据文件中的列与插入表中的列不一致，则需要指定列的顺序。

如，在数据文件中的列顺序是  user_sex,user_name, insert_date，但在插入表的列顺序为user_name, user_sex, insert_date，则数据导入语法如下：
```mysql
mysql> LOAD DATA LOCAL INFILE 'outfile.txt' 
    -> INTO TABLE user (user_name, user_sex, insert_date);
```

4）使用 mysqlimport 导入数据

```mysql
$ mysqlimport -u root -p --local user outfile.txt
password *****
```

mysqlimport有很多可选项，有兴趣的可以自行查资料啦！


### 21、刷新缓存
FLUSH QUERY CACHE : 清理查询缓存内存碎片  
RESET QUERY CACHE : 从查询缓存中移出所有查询  
FLUSH TABLES : 关闭所有打开的表，同时该操作将会清空查询缓存中的内容。  


### 22、查询系统性能
语法：
```mysql
SHOW STATUS LIKE 'value';
```

value参数的几个统计参数如下 :
Connections : 连接 MySQL 服务器的次数
Uptime : MySQL 服务器的上线时间
Slow_queries : 慢查询次数
Com_Select : 查询操作的次数
Com_insert : 插入操作的次数
Com_update : 更新操作的次数
Com_delete : 删除操作的次数



### 23、查看建表语句

语法：

```mysql
SHOW CREATE TABLE TABLE_NAME
```



mysql还有很多命令，小郭会慢慢的补充进来。

## 六、基础知识-数据类型

MySQL 支持多种类型，大致可以分为三类：数值、日期/时间和字符串(字符)类型。

### 1、数值类型
<table>
	<tbody>
		<tr>
			<th width="10%">类型</th>
			<th width="15%">大小</th>
			<th width="30%">范围（有符号）</th>
			<th width="30%">范围（无符号）</th>
			<th width="15%">用途</th>
		</tr>
		<tr>
			<td>TINYINT</td>
			<td>1 Bytes</td>
			<td>(-128，127)</td>
			<td>(0，255)</td>
			<td>小整数值</td>
		</tr>
		<tr>
			<td>SMALLINT</td>
      <td>2 Bytes</td>
			<td>(-32 768，32 767)</td>
			<td>(0，65 535)</td>
			<td>大整数值</td>
		</tr>
		<tr>
      <td>MEDIUMINT</td>
			<td>3 Bytes</td>
			<td>(-8 388 608，8 388 607)</td>
			<td>(0，16 777 215)</td>
			<td>大整数值</td>
		</tr>
		<tr>
			<td>INT或INTEGER</td>
			<td>4 Bytes</td>
			<td>(-2 147 483 648，2 147 483 647)</td>
			<td>(0，4 294 967 295)</td>
			<td>大整数值</td>
		</tr>
		<tr>
			<td>BIGINT</td>
			<td>8 Bytes</td>
			<td>(-9,223,372,036,854,775,808，9 223 372 036 854 775 807)</td>
			<td>(0，18 446 744 073 709 551 615)</td>
			<td>极大整数值</td>
		</tr>
		<tr>
			<td>FLOAT</td>
			<td>4 Bytes</td>
			<td>(-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)</td>
			<td>0，(1.175 494 351 E-38，3.402 823 466 E+38)</td>
			<td>单精度<br>浮点数值</td>
		</tr>
		<tr>
			<td>DOUBLE</td>
			<td>8 Bytes</td>
			<td>(-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)</td>
			<td>0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)</td>
			<td>双精度<br>浮点数值</td>
		</tr>
		<tr>
			<td>DECIMAL</td>
			<td>对DECIMAL(M,D) ，如果M&gt;D，为M+2否则为D+2</td>
			<td>依赖于M和D的值</td>
			<td>依赖于M和D的值</td>
			<td>小数值</td>
		</tr>
	</tbody>
</table>



### 2、日期和时间类型
<table>
	<tbody>
		<tr>
			<th width="10%">类型</th>
			<th width="10%">大小<br>( bytes)</th>
			<th width="40%">范围</th>
			<th width="20%">格式</th>
			<th>用途</th>
		</tr>
		<tr>
			<td width="10%">DATE</td>
			<td width="10%">3</td>
			<td>1000-01-01/9999-12-31</td>
			<td>YYYY-MM-DD</td>
			<td>日期值</td>
		</tr>
		<tr>
			<td width="10%">TIME</td>
			<td width="10%">3</td>
			<td>'-838:59:59'/'838:59:59'</td>
			<td>HH:MM:SS</td>
			<td>时间值或持续时间</td>
		</tr>
		<tr>
			<td width="10%">YEAR</td>
			<td width="10%">1</td>
			<td>1901/2155</td>
			<td>YYYY</td>
			<td>年份值</td>
		</tr>
		<tr>
			<td width="10%">DATETIME</td>
			<td width="10%">8</td>
			<td width="40%">'1000-01-01 00:00:00' 到 '9999-12-31 23:59:59'</td>
			<td>YYYY-MM-DD hh:mm:ss</td>
			<td>混合日期和时间值</td>
		</tr>
		<tr>
			<td width="10%">TIMESTAMP</td>
			<td width="10%">4</td>
			<td width="40%">
        <p>'1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC </p>
				<p>结束时间是第 <strong>2147483647</strong> 秒，北京时间 <strong>2038-1-19 11:14:07</strong>，格林尼治时间 2038年1月19日 凌晨 03:14:07</p>
			</td>
			<td>YYYY-MM-DD hh:mm:ss</td>
			<td>混合日期和时间值，时间戳</td>
		</tr>
	</tbody>
</table>

### 3、字符串类型

> 效率来说基本是 Char > Varchar > Text > Blob，但是如果使用的是 Innodb 引擎的话，推荐使用 Varchar 代替 Char。

<table>
	<tbody>
		<tr>
			<th width="20%">类型</th>
			<th width="25%">大小</th>
			<th width="55%">用途</th>
		</tr>
		<tr>
			<td>CHAR</td>
			<td>0-255 bytes</td>
			<td>定长字符串</td>
		</tr>
		<tr>
			<td>VARCHAR</td>
			<td>0-65535 bytes</td>
			<td>变长字符串</td>
		</tr>
		<tr>
			<td>TINYBLOB</td>
			<td>0-255 bytes</td>
			<td>不超过 255 个字符的二进制字符串</td>
		</tr>
		<tr>
			<td>TINYTEXT</td>
			<td>0-255 bytes</td>
			<td>短文本字符串</td>
		</tr>
		<tr>
			<td>BLOB</td>
			<td>0-65535 bytes</td>
			<td>二进制形式的长文本数据</td>
		</tr>
		<tr>
			<td>TEXT</td>
			<td>0-65535bytes，约64kb</td>
			<td>长文本数据</td>
		</tr>
		<tr>
			<td>MEDIUMBLOB</td>
			<td>0-16777215 bytes</td>
			<td>二进制形式的中等长度文本数据</td>
		</tr>
		<tr>
			<td>MEDIUMTEXT</td>
			<td>0-16777215bytes，约 16 Mb</td>
			<td>中等长度文本数据</td>
		</tr>
		<tr>
			<td>LONGBLOB</td>
			<td>0-4294967295 bytes
			</td>
			<td>二进制形式的极大文本数据</td>
		</tr>
		<tr>
			<td>LONGTEXT</td>
			<td>0-4294967295 bytes，约 4Gb</td>
			<td>极大文本数据</td>
		</tr>
	</tbody>
</table>


## 七、基础知识-内置函数
### 1、数字函数
<table class="reference">
	<tbody>
	  <tr>
		<th style="width:25%">函数名</th>
		<th>描述</th>
		<th>实例</th>
	  </tr>
	  <tr>
		<td>ABS(x)</td>
		<td>返回 x 的绝对值　　</td>
	  </tr>
	  <tr>
		<td>ACOS(x)</td>
		<td>求 x 的反余弦值（单位为弧度），x 为一个数值</td>
	  </tr>
	  <tr>
		<td>ASIN(x)</td>
		<td>求反正弦值（单位为弧度），x 为一个数值</td>
	  </tr>
	  <tr>
		<td>ATAN(x)</td>
		<td>求反正切值（单位为弧度），x 为一个数值</td>
	  </tr>
	  <tr>
		<td>ATAN2(n, m)</td>
		<td>求反正切值（单位为弧度）</td>
	  </tr>
	  <tr>
		<td>AVG(expression)</td>
		<td>返回一个表达式的平均值，expression 是一个字段</td>
	  </tr>
	  <tr>
		<td>CEIL(x)</td>
		<td>返回大于或等于 x 的最小整数　</td>
	  </tr>
	  <tr>
		<td>CEILING(x)</td>
		<td>返回大于或等于 x 的最小整数　</td>
	  </tr>
	  <tr>
		<td>COS(x)</td>
	  </tr>
	  <tr>
		<td>COT(x)</td>
		<td>求余切值(参数是弧度)</td>
	  </tr>
	  <tr>
		<td>COUNT(expression)</td>
		<td>返回查询的记录总数，expression 参数是一个字段或者 * 号</td>
	  </tr>
	  <tr>
		<td>DEGREES(x)</td>
		<td>将弧度转换为角度　　</td>
	  </tr>
	  <tr>
		<td>n DIV m</td>
		<td>整除，n 为被除数，m 为除数</td>
	  </tr>
	  <tr>
		<td>EXP(x)</td>
		<td>返回 e 的 x 次方　　</td>
	  </tr>
	  <tr>
		<td>FLOOR(x)</td>
		<td>返回小于或等于 x 的最大整数　　</td>
	  </tr>
	  <tr>
		<td>GREATEST(expr1, expr2, expr3, ...)</td>
		<td>返回列表中的最大值</td>
	  </tr>
	  <tr>
		<td>LEAST(expr1, expr2, expr3, ...)</td>
		<td>返回列表中的最小值</td>
	  </tr>
	  <tr>
		<td>LN</td>
		<td>返回数字的自然对数，以 e 为底。</td>
	  </tr>
	  <tr>
		<td>LOG(x) 或 LOG(base, x)</td>
		<td>返回自然对数(以 e 为底的对数)，如果带有 base 参数，则 base 为指定带底数。　　</td>
	  </tr>
	  <tr>
		<td>LOG10(x)</td>
		<td>返回以 10 为底的对数　　</td>
	  </tr>
	  <tr>
		<td>LOG2(x)</td>
		<td>返回以 2 为底的对数</td>
	  </tr>
	  <tr>
		<td>MAX(expression)</td>
		<td>返回字段 expression 中的最大值</td>
	  </tr>
	  <tr>
		<td>MIN(expression)</td>
		<td>返回字段 expression 中的最小值</td>
	  </tr>
	  <tr>
		<td>MOD(x,y)</td>
		<td>返回 x 除以 y 以后的余数　</td>
	  </tr>
	  <tr>
		<td>PI()</td>
		<td>返回圆周率(3.141593）　　</td>
	  </tr>
	  <tr>
		<td>POW(x,y)</td>
		<td>返回 x 的 y 次方　</td>
	  </tr>
	  <tr>
		<td>POWER(x,y)</td>
		<td>返回 x 的 y 次方　</td>
	  </tr>
	  <tr>
		<td>RADIANS(x)</td>
		<td>将角度转换为弧度　　</td>
	  </tr>
	  <tr>
		<td>RAND()</td>
		<td>返回 0 到 1 的随机数　　</td>
	  </tr>
	  <tr>
		<td>ROUND(x [,y])</td>
		<td>返回离 x 最近的整数，可选参数 y 表示要四舍五入的小数位数，如果省略，则返回整数。</td>
	  </tr>
	  <tr>
		<td>SIGN(x)</td>
		<td>返回 x 的符号，x 是负数、0、正数分别返回 -1、0 和 1　</td>
	  </tr>
	  <tr>
		<td>SIN(x)</td>
		<td>求正弦值(参数是弧度)　　</td>
	  </tr>
	  <tr>
		<td>SQRT(x)</td>
		<td>返回x的平方根　　</td>
	  </tr>
	  <tr>
		<td>SUM(expression)</td>
		<td>返回指定字段的总和</td>
	  </tr>
	  <tr>
		<td>TAN(x)</td>
		<td>求正切值(参数是弧度)</td>
	  </tr>
	  <tr>
		<td>TRUNCATE(x,y)</td>
		<td>返回数值 x 保留到小数点后 y 位的值（与 ROUND 最大的区别是不会进行四舍五入）</td>
	  </tr>
	</tbody>
  </table>

### 2、字符串函数 
<table class="reference">
	<tbody>
	  <tr>
		<th style="width:12%">函数</th>
		<th>描述</th>
	  </tr>
	  <tr>
		<td>ASCII(s)</td>
		<td>返回字符串 s 的第一个字符的 ASCII 码。</td>
	  </tr>
	  <tr>
		<td>CHAR_LENGTH(s)</td>
		<td>返回字符串 s 的字符数</td>
	  </tr>
	  <tr>
		<td>CHARACTER_LENGTH(s)</td>
		<td>返回字符串 s 的字符数，等同于 CHAR_LENGTH(s)</td>
	  </tr>
	  <tr>
		<td>CONCAT(s1,s2...sn)</td>
		<td>字符串 s1,s2 等多个字符串合并为一个字符串</td>
	  </tr>
	  <tr>
		<td>CONCAT_WS(x, s1,s2...sn)</td>
		<td>同 CONCAT(s1,s2,...) 函数，但是每个字符串之间要加上 x，x 可以是分隔符</td>
	  </tr>
	  <tr>
		<td>FIELD(s,s1,s2...)</td>
		<td>返回第一个字符串 s 在字符串列表(s1,s2...)中的位置</td>
	  </tr>
	  <tr>
		<td>FIND_IN_SET(s1,s2)</td>
		<td>返回在字符串s2中与s1匹配的字符串的位置</td>
	  </tr>
	  <tr>
		<td>FORMAT(x,n)</td>
		<td>函数可以将数字 x 进行格式化 "#,###.##", 将 x 保留到小数点后 n 位，最后一位四舍五入。</td>
	  </tr>
	  <tr>
		<td>INSERT(s1,x,len,s2)</td>
		<td>字符串 s2 替换 s1 的 x 位置开始长度为 len 的字符串</td>
	  </tr>
	  <tr>
		<td>LOCATE(s1,s)</td>
		<td>从字符串 s 中获取 s1 的开始位置</td>
	  </tr>
	  <tr>
		<td>LCASE(s)</td>
		<td>将字符串 s 的所有字母变成小写字母</td>
	  </tr>
	  <tr>
		<td>LEFT(s,n)</td>
		<td>返回字符串 s 的前 n 个字符</td>
	  </tr>
	  <tr>
		<td>LOWER(s)</td>
		<td>将字符串 s 的所有字母变成小写字母</td>
	  </tr>
	  <tr>
		<td>LPAD(s1,len,s2)</td>
		<td>在字符串 s1 的开始处填充字符串 s2，使字符串长度达到 len</td>
	  </tr>
	  <tr>
		<td>LTRIM(s)</td>
		<td>去掉字符串 s 开始处的空格</td>
	  </tr>
	  <tr>
		<td>MID(s,n,len)</td>
		<td>从字符串 s 的 n 位置截取长度为 len 的子字符串，同 SUBSTRING(s,n,len)</td>
	  </tr>
	  <tr>
		<td>POSITION(s1 IN s)</td>
		<td>从字符串 s 中获取 s1 的开始位置</td>
	  </tr>
	  <tr>
		<td>REPEAT(s,n)</td>
		<td>将字符串 s 重复 n 次</td>
	  </tr>
	  <tr>
		<td>REPLACE(s,s1,s2)</td>
		<td>将字符串 s2 替代字符串 s 中的字符串 s1</td>
	  </tr>
	  <tr>
		<td>REVERSE(s)</td>
		<td>将字符串s的顺序反过来</td>
	  </tr>
	  <tr>
		<td>RIGHT(s,n)</td>
		<td>返回字符串 s 的后 n 个字符</td>
	  </tr>
	  <tr>
		<td>RPAD(s1,len,s2)</td>
		<td>在字符串 s1 的结尾处添加字符串 s2，使字符串的长度达到 len</td>
	  </tr>
	  <tr>
		<td>RTRIM(s)</td>
		<td>去掉字符串 s 结尾处的空格</td>
	  </tr>
	  <tr>
		<td>SPACE(n)</td>
		<td>返回 n 个空格</td>
	  </tr>
	  <tr>
		<td>STRCMP(s1,s2)</td>
		<td>比较字符串 s1 和 s2，如果 s1 与 s2 相等返回 0 ，如果 s1&gt;s2 返回 1，如果 s1&lt;s2 返回 -1</td>
	  </tr>
	  <tr>
		<td>SUBSTR(s, start, length)</td>
		<td>从字符串 s 的 start 位置截取长度为 length 的子字符串</td>
	  </tr>
	  <tr>
		<td>SUBSTRING(s, start, length)</td>
		<td>从字符串 s 的 start 位置截取长度为 length 的子字符串，等同于 SUBSTR(s, start, length)</td>
	  </tr>
	  <tr>
		<td>SUBSTRING_INDEX(s, delimiter, number)</td>
		<td>返回从字符串 s 的第 number 个出现的分隔符 delimiter 之后的子串。
		  <br>如果 number 是正数，返回第 number 个字符左边的字符串。
		  <br>如果 number 是负数，返回第(number 的绝对值(从右边数))个字符右边的字符串。</td>
	  </tr>
	  <tr>
		<td>TRIM(s)</td>
		<td>去掉字符串 s 开始和结尾处的空格</td>
	  </tr>
	  <tr>
		<td>UCASE(s)</td>
		<td>将字符串转换为大写</td>
	  </tr>
	  <tr>
		<td>UPPER(s)</td>
		<td>将字符串转换为大写</td>
	  </tr>
	</tbody>
  </table>

### 3、日期函数
<table class="reference">
	<tbody>
	  <tr>
		<th style="width:25%">函数名</th>
		<th>描述</th>
	  </tr>
	  <tr>
		<td>ADDDATE(d,n)</td>
		<td>计算起始日期 d 加上 n 天的日期</td>
	  </tr>
	  <tr>
		<td>ADDTIME(t,n)</td>
		<td>n 是一个时间表达式，时间 t 加上时间表达式 n</td>
	  </tr>
	  <tr>
		<td>CURDATE()</td>
		<td>返回当前日期</td>
	  </tr>
	  <tr>
		<td>CURRENT_DATE()</td>
		<td>返回当前日期</td>
	  </tr>
	  <tr>
		<td>CURRENT_TIME</td>
		<td>返回当前时间</td>
	  </tr>
	  <tr>
		<td>CURRENT_TIMESTAMP()</td>
		<td>返回当前日期和时间</td>
	  </tr>
	  <tr>
		<td>CURTIME()</td>
		<td>返回当前时间</td>
	  </tr>
	  <tr>
		<td>DATE()</td>
		<td>从日期或日期时间表达式中提取日期值</td>
	  </tr>
	  <tr>
		<td>DATEDIFF(d1,d2)</td>
		<td>计算日期 d1-&gt;d2 之间相隔的天数</td>
	  </tr>
	  <tr>
		<td>DATE_ADD(d，INTERVAL expr type)</td>
		<td>计算起始日期 d 加上一个时间段后的日期，type 值可以是：
		  <ul>
			<li>MICROSECOND</li>
			<li>SECOND</li>
			<li>MINUTE</li>
			<li>HOUR</li>
			<li>DAY</li>
			<li>WEEK</li>
			<li>MONTH</li>
			<li>QUARTER</li>
			<li>YEAR</li>
			<li>SECOND_MICROSECOND</li>
			<li>MINUTE_MICROSECOND</li>
			<li>MINUTE_SECOND</li>
			<li>HOUR_MICROSECOND</li>
			<li>HOUR_SECOND</li>
			<li>HOUR_MINUTE</li>
			<li>DAY_MICROSECOND</li>
			<li>DAY_SECOND</li>
			<li>DAY_MINUTE</li>
			<li>DAY_HOUR</li>
			<li>YEAR_MONTH</li>
		  </ul>
		</td>
	  </tr>
	  <tr>
		<td>DATE_FORMAT(d,f)</td>
		<td>按表达式 f的要求显示日期 d</td>
	  </tr>
	  <tr>
		<td>DATE_SUB(date,INTERVAL expr type)</td>
		<td>函数从日期减去指定的时间间隔。</td>
	  </tr>
	  <tr>
		<td>DAY(d)</td>
		<td>返回日期值 d 的日期部分</td>
	  </tr>
	  <tr>
		<td>DAYNAME(d)</td>
		<td>返回日期 d 是星期几，如 Monday,Tuesday</td>
	  </tr>
	  <tr>
		<td>DAYOFMONTH(d)</td>
		<td>计算日期 d 是本月的第几天</td>
	  </tr>
	  <tr>
		<td>DAYOFWEEK(d)</td>
		<td>日期 d 今天是星期几，1 星期日，2 星期一，以此类推</td>
	  </tr>
	  <tr>
		<td>DAYOFYEAR(d)</td>
		<td>计算日期 d 是本年的第几天</td>
	  </tr>
	  <tr>
		<td>EXTRACT(type FROM d)</td>
		<td>从日期 d 中获取指定的值，type 指定返回的值。
		  <br>type可取值为：
		  <br>
		  <ul>
			<li>MICROSECOND</li>
			<li>SECOND</li>
			<li>MINUTE</li>
			<li>HOUR</li>
			<li>DAY</li>
			<li>WEEK</li>
			<li>MONTH</li>
			<li>QUARTER</li>
			<li>YEAR</li>
			<li>SECOND_MICROSECOND</li>
			<li>MINUTE_MICROSECOND</li>
			<li>MINUTE_SECOND</li>
			<li>HOUR_MICROSECOND</li>
			<li>HOUR_SECOND</li>
			<li>HOUR_MINUTE</li>
			<li>DAY_MICROSECOND</li>
			<li>DAY_SECOND</li>
			<li>DAY_MINUTE</li>
			<li>DAY_HOUR</li>
			<li>YEAR_MONTH</li>
		  </ul>
		</td>
	  </tr>
	  <tr>
		<td>FROM_DAYS(n)</td>
		<td>计算从 0000 年 1 月 1 日开始 n 天后的日期</td>
	  </tr>
	  <tr>
		<td>HOUR(t)</td>
		<td>返回 t 中的小时值</td>
	  </tr>
	  <tr>
		<td>LAST_DAY(d)</td>
		<td>返回给给定日期的那一月份的最后一天</td>
	  </tr>
	  <tr>
		<td>LOCALTIME()</td>
		<td>返回当前日期和时间</td>
	  </tr>
	  <tr>
		<td>LOCALTIMESTAMP()</td>
		<td>返回当前日期和时间</td>
	  </tr>
	  <tr>
		<td>MAKEDATE(year, day-of-year)</td>
		<td>基于给定参数年份 year 和所在年中的天数序号 day-of-year 返回一个日期</td>
	  </tr>
	  <tr>
		<td>MAKETIME(hour, minute, second)</td>
		<td>组合时间，参数分别为小时、分钟、秒</td>
	  </tr>
	  <tr>
		<td>MICROSECOND(date)</td>
		<td>返回日期参数所对应的微秒数</td>
	  </tr>
	  <tr>
		<td>MINUTE(t)</td>
		<td>返回 t 中的分钟值</td>
	  </tr>
	  <tr>
		<td>MONTHNAME(d)</td>
		<td>返回日期当中的月份名称，如 November</td>
	  </tr>
	  <tr>
		<td>MONTH(d)</td>
		<td>返回日期d中的月份值，1 到 12</td>
	  </tr>
	  <tr>
		<td>NOW()</td>
		<td>返回当前日期和时间</td>
	  </tr>
	  <tr>
		<td>PERIOD_ADD(period, number)</td>
		<td>为 年-月 组合日期添加一个时段</td>
	  </tr>
	  <tr>
		<td>PERIOD_DIFF(period1, period2)</td>
		<td>返回两个时段之间的月份差值</td>
	  </tr>
	  <tr>
		<td>QUARTER(d)</td>
		<td>返回日期d是第几季节，返回 1 到 4</td>
	  </tr>
	  <tr>
		<td>SECOND(t)</td>
		<td>返回 t 中的秒钟值</td>
	  </tr>
	  <tr>
		<td>SEC_TO_TIME(s)</td>
		<td>将以秒为单位的时间 s 转换为时分秒的格式</td>
	  </tr>
	  <tr>
		<td>STR_TO_DATE(string, format_mask)</td>
		<td>将字符串转变为日期</td>
	  </tr>
	  <tr>
		<td>SUBDATE(d,n)</td>
		<td>日期 d 减去 n 天后的日期</td>
	  </tr>
	  <tr>
		<td>SUBTIME(t,n)</td>
		<td>时间 t 减去 n 秒的时间</td>
	  </tr>
	  <tr>
		<td>SYSDATE()</td>
		<td>返回当前日期和时间</td>
	  </tr>
	  <tr>
		<td>TIME(expression)</td>
		<td>提取传入表达式的时间部分</td>
	  </tr>
	  <tr>
		<td>TIME_FORMAT(t,f)</td>
		<td>按表达式 f 的要求显示时间 t</td>
	  </tr>
	  <tr>
		<td>TIME_TO_SEC(t)</td>
		<td>将时间 t 转换为秒</td>
	  </tr>
	  <tr>
		<td>TIMEDIFF(time1, time2)</td>
		<td>计算时间差值</td>
	  </tr>
	  <tr>
		<td>TIMESTAMP(expression, interval)</td>
		<td>单个参数时，函数返回日期或日期时间表达式；有2个参数时，将参数加和</td>
	  </tr>
	  <tr>
		<td>TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2)</td>
		<td>计算时间差，返回 datetime_expr2 − datetime_expr1 的时间差</td>
	  </tr>
	  <tr>
		<td>TO_DAYS(d)</td>
		<td>计算日期 d 距离 0000 年 1 月 1 日的天数</td>
	  </tr>
	  <tr>
		<td>WEEK(d)</td>
		<td>计算日期 d 是本年的第几个星期，范围是 0 到 53</td>
	  </tr>
	  <tr>
		<td>WEEKDAY(d)</td>
		<td>日期 d 是星期几，0 表示星期一，1 表示星期二</td>
	  </tr>
	  <tr>
		<td>WEEKOFYEAR(d)</td>
		<td>计算日期 d 是本年的第几个星期，范围是 0 到 53</td>
	  </tr>
	  <tr>
		<td>YEAR(d)</td>
		<td>返回年份</td>
	  </tr>
	  <tr>
		<td>YEARWEEK(date, mode)</td>
		<td>返回年份及第几周（0到53），mode 中 0 表示周天，1表示周一，以此类推</td>
	  </tr>
	</tbody>
  </table>

### 4、高级函数
<table class="reference">
  <tbody>
    <tr>
      <th style="width:25%">函数名</th>
      <th>描述</th>
    </tr>
    <tr>
      <td>BIN(x)</td>
      <td>返回 x 的二进制编码</td>
    </tr>
    <tr>
      <td>BINARY(s)</td>
      <td>将字符串 s 转换为二进制字符串</td>
    </tr>
    <tr>
      <td>CAST(x AS type)</td>
      <td>转换数据类型</td>
    </tr>
    <tr>
      <td>COALESCE(expr1, expr2, ...., expr_n)</td>
      <td>返回参数中的第一个非空表达式（从左向右）</td>
    </tr>
    <tr>
      <td>CONNECTION_ID()</td>
      <td>返回唯一的连接 ID</td>
    </tr>
    <tr>
      <td>CONV(x,f1,f2)</td>
      <td>返回 f1 进制数变成 f2 进制数</td>
    </tr>
    <tr>
      <td>CONVERT(s USING cs)</td>
      <td>函数将字符串 s 的字符集变成 cs</td>
    </tr>
    <tr>
      <td>CURRENT_USER()</td>
      <td>返回当前用户</td>
    </tr>
    <tr>
      <td>DATABASE()</td>
      <td>返回当前数据库名</td>
    </tr>
    <tr>
      <td>IF(expr,v1,v2)</td>
      <td>如果表达式 expr 成立，返回结果 v1；否则，返回结果 v2。</td>
    </tr>
    <tr>
      <td>IFNULL(v1,v2)</td>
      <td>如果 v1 的值不为 NULL，则返回 v1，否则返回 v2。</td>
    </tr>
    <tr>
      <td>ISNULL(expression)</td>
      <td>判断表达式是否为 NULL</td>
    </tr>
    <tr>
      <td>LAST_INSERT_ID()</td>
      <td>返回最近生成的 AUTO_INCREMENT 值</td>
    </tr>
    <tr>
      <td>NULLIF(expr1, expr2)</td>
      <td>比较两个字符串，如果字符串 expr1 与 expr2 相等 返回 NULL，否则返回 expr1</td>
    </tr>
    <tr>
      <td>SESSION_USER()</td>
      <td>返回当前用户</td>
    </tr>
    <tr>
      <td>SYSTEM_USER()</td>
      <td>返回当前用户</td>
    </tr>
    <tr>
      <td>USER()</td>
      <td>返回当前用户</td>
    </tr>
    <tr>
      <td>VERSION()</td>
      <td>返回数据库的版本号</td>
    </tr>
  </tbody>
</table>

### 5、MYSQL8.0的新函数

<table class="reference">
	<thead>
	  <tr>
		<th>函数</th>
		<th>描述</th>
	  </tr>
	</thead>
	<tbody>
	  <tr>
		<td>JSON_OBJECT()</td>
		<td>将键值对转换为 JSON 对象</td>
	  </tr>
	  <tr>
		<td>JSON_ARRAY()</td>
		<td>将值转换为 JSON 数组</td>
	  </tr>
	  <tr>
		<td>JSON_EXTRACT()</td>
		<td>从 JSON 字符串中提取指定的值</td>
	  </tr>
	  <tr>
		<td>JSON_CONTAINS()</td>
		<td>检查一个 JSON 字符串是否包含指定的值</td>
	  </tr>
	  <tr>
		<td>ROW_NUMBER()</td>
		<td>为查询结果中的每一行分配一个唯一的数字</td>
	  </tr>
	  <tr>
		<td>RANK()</td>
		<td>为查询结果中的每一行分配一个排名</td>
	  </tr>
	</tbody>
</table>

## 八、实用SQL

### 1、统计

> 记录mysql常用的统计写法，来源于网络，原文链接：https://blog.csdn.net/fwj_ntu/article/details/86680053

1）按天统计
format参数的取值为’%y%m%d’，可以按天输出统计结果。
```
SELECT DATE_FORMAT(insertTime,'%y年%m月%d日') as d,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%m%d')
ORDER BY d asc;
```

2）按自然周统计
format()函数的format参数取值为’%y%u’时，可实现按年、年中的周来统计结果。如果在where条件中限制是某一年的周期，可以直接将format参数的值配置为’%u’，否则一定要用’%y%u’，不然会把不同年的第n周合并到一起而出现错乱。

```
SELECT DATE_FORMAT(insertTime,'%y年%u周') as w,min(insertTime) as st,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%u')
ORDER BY w asc;
```

3）按月统计
format()函数的format参数值为’%y%m’时，可实现按月份输出聚合结果。
```
SELECT DATE_FORMAT(insertTime,'%y年%m月') as m,count(1) 
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%m')
ORDER BY m asc
```

4）按季度统计
date_format()函数没有直接按照季节输出结果的功能，但这对于数据分析师并不是什么难事，自己利用月度聚合结果去加工以下即可：
```
SELECT FLOOR((DATE_FORMAT(insertTime,'%m')-1)/3)+1 as q,min(insertTime) as st,count(*)
FROM table
WHERE DATE_FORMAT(insertTime,'%Y') = 2023
GROUP BY FLOOR((DATE_FORMAT(insertTime,'%m')-1)/3)+1
ORDER BY q asc; 
```

5）按年份统计
date_format()函数的format参数值为’%Y’或’%y’时可实现按年份输出统计结果。
```
SELECT DATE_FORMAT(insertTime,'%Y') as y,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%Y')
ORDER BY y asc; 
```

### 2、重置自增ID

alter table table_name auto_increment=1

### 3、生成随机数

```Mysql
-- 生成 3 位的随机整数
SELECT CEILING(RAND() * 900 + 100);
 
-- 生成 4 位的随机整数
SELECT CEILING(RAND() * 9000 + 1000);
 
-- 生成 5 位的随机整数
SELECT CEILING(RAND() * 90000 + 10000);
 
-- 生成 6 位的随机整数
SELECT CEILING(RAND() * 900000 + 100000);
 
-- 随机生成 11位 手机号(批量执行会存在重复手机号，视情况使用)
SELECT TRIM(CONCAT('1', ELT(floor(rand() * 6 + 1), '3', '4', '5', '7', '8', '9'), TRIM(CAST(CEILING(RAND() * 900000000 + 100000000) AS CHAR(9))))) AS phone;
```

### 4、循环插入测试数据

1）先新增一张测试表

```mysql
CREATE TABLE `user_info` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL ,
    `name` VARCHAR(20) DEFAULT NULL,
    `company_id` INT(11) DEFAULT NULL,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

```

2）构造生成测试数据的存储过程(插入1000000条测试数据)
mysql
```mysql
delimiter $$  # 定义结束符
drop procedure if exists addTestData; # 存储过程名叫：addTestData
create procedure addTestData()
begin
declare user_id int;
set user_id = 1;
while user_id <= 10000 #插入N条数据
do
insert into user_info(user_id,name,company_id)
values(user_id,concat('用户_',CEILING(RAND() * 90000 + 10000)),1001);  # 为了区分用户，我们在名称后加上后缀
set user_id = user_id + 1;
end
while;
end $$;
```

3）执行调用

```mysql
CALL addTestData;
```

4）删除存储过程

```mysql
drop procedure addTestData;
```

## 九、进阶知识-查询语句执行过程

> [参考原文链接](https://cloud.tencent.com/developer/article/1981543 "参考原文链接")  

下面是Select的执行流程图：

![Select语句执行流程](http://cdn.gydblog.com/images/database/mysql/mysql-jiagou-5.png)

整个查询执行过程，总的来说分为 6 个步骤 :

### 1、建立连接
客户端向 MySQL 服务器发送一条查询请求，与连接池交互：连接池认证相关处理。

建立与 MySQL 的连接，这就是由连接器Connectors来完成的。连接器Connectors负责跟客户端建立连接、获取权限、维持和管理连接。

连接命令为： mysql -h localhost -P 3306 -u user -p password

验证通过后，连接器会到权限表里面查出登录用户拥有的权限，之后这个连接里面的权限判断逻辑，都将依赖于此时读到的权限，一个用户成功建立连接后，即使管理员对这个用户的权限做了修改，也不会影响已经存在连接的权限，修改完后，只有再新建的连接才会使用新的权限设置。

连接完成后，如果没有后续的动作，这个连接就处于空闲状态，可以在mysql服务端控制台执行 show processlist 命令中看到已建立的客户端连接。

![MYSQL服务端连接信息](http://cdn.gydblog.com/images/database/mysql/mysql-select-1.png)

客户端系统的连接，可以通过在客户端控制台执行’netstat -natp|grep 端口‘来查看， 端口就是在MYSQL服务端查到的连接信息里的端口：

![客户端连接信息](http://cdn.gydblog.com/images/database/mysql/mysql-select-2.png)

客户端如果太长时间没动静，连接器就会自动将它断开；这个时间是由参数 wait_timeout 控制的，默认值是8小时。如果在连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒：Lost connection to MySQL server during query。



### 2、查询缓存

服务器首先检查查询缓存，如果命中缓存，则立刻返回存储在缓存中的结果，否则进入下一阶段

在解析一个查询语句前，如果查询缓存是打开的，那么 MySQL 会检查这个查询语句是否命中查询缓存中的数据。如果当前查询恰好命中查询缓存，在检查一次用户权限后直接返回缓存中的结果。这种情况下，查询不会被解析，也不会生成执行计划，更不会执行。MySQL将缓存存放在一个引用表 (不要理解成table，可以认为是类似于 HashMap 的数据结构)，通过一个哈希值索引，这个哈希值通过查询本身、当前要查询的数据库、客户端协议版本号等一些可能影响结果的信息计算得来。所以两个查询在任何字符上的不同 (例如 : 空格、注释)，都会导致缓存不会命中

如果查询中包含任何用户自定义函数、存储函数、用户变量、临时表、MySQL库中的系统表，其查询结果都不会被缓存。比如函数 NOW() 或者 CURRENT_DATE() 会因为不同的查询时间，返回不同的查询结果，再比如包含 CURRENT_USER 或者 CONNECION_ID() 的查询语句会因为不同的用户而返回不同的结果，将这样的查询结果缓存起来没有任何的意义

MySQL 查询缓存系统会跟踪查询中涉及的每个表，如果这些表 (数据或结构) 发生变化，那么和这张表相关的所有缓存数据都将失效。正因为如此，在任何的写操作时，MySQL必须将对应表的所有缓存都设置为失效。如果查询缓存非常大或者碎片很多，这个操作就可能带来很大的系统消耗，甚至导致系统僵死一会儿，而且查询缓存对系统的额外消耗也不仅仅在写操作，读操作也不例外 :

- 任何的查询语句在开始之前都必须经过检查，即使这条 SQL语句 永远不会命中缓存
- 如果查询结果可以被缓存，那么执行完成后，会将结果存入缓存，也会带来额外的系统消耗
- 两个SQL语句，只要相差哪怕是一个字符（例如 大小写不一样：多一个空格等），那么两个SQL将使用不同的cache。


基于此，并不是什么情况下查询缓存都会提高系统性能，缓存和失效都会带来额外消耗，特别是写密集型应用，只有当缓存带来的资源节约大于其本身消耗的资源时，才会给系统带来性能提升。可以尝试打开查询缓存，并在数据库设计上做一些优化 :
- 用多个小表代替一个大表，注意不要过度设计
- 批量插入代替循环单条插入
- 合理控制缓存空间大小，一般来说其大小设置为几十兆比较合适
- 可以通过 SQL_CACHE 和 SQL_NO_CACHE 来控制某个查询语句是否需要进行缓存

```
//先查询缓存
mysql> SELECT SQL_CACHE COUNT(*) FROM a;

//跳过缓存直接查询实时表
mysql> SELECT SQL_NO_CACHE COUNT(*) FROM a;
```

查看开启缓存的情况，可以知道query_cache_size的设置是否合理

![缓存配置](http://cdn.gydblog.com/images/database/mysql/mysql-select-3.png)

- query_cache_limit：超出此大小的查询将不被缓存
- query_cache_min_res_unit：缓存块的最小大小，query_cache_min_res_unit的配置是一柄双刃剑，默认是 4KB ，设置值大对大数据查询有好处，但是如果你查询的都是小数据查询，就容易造成内存碎片和浪费。
- query_cache_size：查询缓存大小（注：QC存储的单位最小是1024byte，所以如果你设定的一个不是1024的倍数的值。这个值会被四舍五入到最接近当前值的等于1024的倍数的值。）
- query_cache_type：缓存类型，决定缓存什么样子的查询，注意这个值不能随便设置必须设置为数字，可选值以及说明如下：
         0：OFF 相当于禁用了
         1：ON 将缓存所有结果，除非你的select语句使用了SQL_NO_CACHE禁用了查询缓存
         2：DENAND  则只缓存select语句中通过SQL_CACHE指定需要缓存的查询。
- query_cache_wlock_invalidate：当有其他客户端正在对MyISAM表进行写操作时，如果查询在query cache中，是否返回cache结果还是等写

### 3、SQL解析

如果查询缓存未命中，就要开始执行语句了。首先，MySQL 需要对 SQL 语句进行SQL解析(词法语法)、预处理。

**1）词法分析**  

SQL语句是由多个字符串和空格组成的，MySQL 需要识别出里面的字符串分别是什么，代表什么。
  MySQL 从输入的"select"这个关键字识别出来，这是一个查询语句。它也要把字符串“user_info”识别成“表名 user_info”，
  把字符串“id ”识别成“列 id ”

**2）语法分析**
根据词法分析的结果，语法分析器会根据语法规则，判断你输入的这SQL语句是否满足 MySQL 语法。
如果提交的SQL语句不对，就会收到 You have an error in your SQL syntax 的错误提醒，比如下面这个语句 from 写成了 form。
```
mysql> select * form user_info where id = 1;
 1064 - You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'form user_info where id = 1' at line 1
```

一般语法错误会提示第一个出现错误的位置，所以要关注的是紧接 use near 的内容。


### 4、SQL优化

经过前面的步骤生成的语法树被认为是合法的了，并且由优化器将其转化成查询计划。

多数情况下，一条查询可以有很多种执行方式，最后都返回相应的结果,优化器的作用就是找到这其中最好的执行计划.

MySQL使用基于成本的优化器，它尝试预测一个查询使用某种执行计划时的成本，并选择其中成本最小的一个。在 MySQL 可以通过查询当前会话的 last_query_cost 的值来得到其计算当前查询的成本

mysql> SELECT * FROM p_product_fee WHERE total_price BETWEEN 580000 AND 680000;
mysql> SHOW STATUS LIKE 'last_query_cost'; # 显示要做多少页的随机查询才能得到最后一查询结果，这个结果是根据一些列的统计信息计算得来的，这些统计信息包括 : 每张表或者索引的页面个数、索引的基数、索引和数据行的长度、索引的分布情况等等

有非常多的原因会导致 MySQL 选择错误的执行计划，比如统计信息不准确、不会考虑不受其控制的操作成本(用户自定义函数、存储过程)、MySQL认为的最优跟我们想的不一样 (我们希望执行时间尽可能短，但 MySQL 值选择它认为成本小的，但成本小并不意味着执行时间短) 等等


MySQL的查询优化器是一个非常复杂的部件，它使用了非常多的优化策略来生成一个最优的执行计划 :
- 在表里面有多个索引的时候，决定使用哪个索引；
- 重新定义表的关联顺序 (多张表关联查询时，并不一定按照 SQL 中指定的顺序进行，但有一些技巧可以指定关联顺序)
- 优化 MIN() 和 MAX()函数 (找某列的最小值，如果该列有索引，只需要查找 B+Tree索引 最左端，反之则可以找到最大值)
- 提前终止查询 (比如 : 使用 Limit 时，查找到满足数量的结果集后会立即终止查询)
- 优化排序 (在老版本 MySQL 会使用两次传输排序，即先读取行指针和需要排序的字段在内存中对其排序，然后再根据排序结果去读取数据行，而新版本采用的是单次传输排序，也就是一次读取所有的数据行，然后根据给定的列排序。对于I/O密集型应用，效率会高很多)

比如你执行下面这样的语句，这个语句是执行两个表的 join：
```
mysql> SELECT * FROM order_master JOIN order_detail USING (order_id) WHERE order_master.pay_status = 0 AND order_detail.detail_id = 1558963262141624521;
```

既可以先从表 order_master 里面取出 pay_status = 0 的记录的 order_id 值，再根据 order_id 值关联到表 order_detail，再判断 order_detail 里面 detail_id 的值是否等于 1558963262141624521。

也可以先从表 order_detail 里面取出 detail_id = 1558963262141624521 的记录的 order_id 值，再根据 order_id 值关联到 order_master，再判断 order_master 里面 pay_status 的值是否等于 0。

这两种执行方法的逻辑结果是一样的，但是执行的效率会有不同，而优化器的作用就是决定选择使用哪一个方案。优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。

### 5、执行计划

在完成解析和优化阶段以后，MySQL会生成对应的执行计划，查询执行引擎根据执行计划给出的指令逐步执行得出结果。整个执行过程的大部分操作均是通过调用存储引擎实现的接口来完成，这些接口被称为 handler API。查询过程中的每一张表由一个 handler 实例表示。实际上，MySQL在查询优化阶段就为每一张表创建了一个 handler实例，优化器可以根据这些实例的接口来获取表的相关信息，包括表的所有列名、索引统计信息等。存储引擎接口提供了非常丰富的功能，但其底层仅有几十个接口，这些接口像搭积木一样完成了一次查询的大部分操作

开始执行SQL语句:mysql> select * from user_info  where id = 1;
**1）判断是否有查询权限有就继续执行没有就返回权限错误。**
例如判断当前连接对这个表 user_info 有没有执行查询的权限，如果没有，就会返回没有权限的错误。错误如下（如果命中查询缓存，会在查询缓存返回结果的时候，做权限验证。查询也会在优化器之前调用 precheck 验证权限)。
```
ERROR 1142 (42000): SELECT command denied to user 'appusser'@'localhost' for table 'user_info'
```

**2）执行器根据表的引擎定义去掉用引擎接口**
如果有权限，就打开表继续执行。打开表的时候，执行器就会根据表的引擎定义，去使用这个引擎提供的接口。

**对于没有有索引的表使用全表扫描API：**  比如我们这个例子中的表 user_info  中，id 字段没有索引，那么执行器的执行流程是这样的：
```
A.调用 InnoDB 引擎接口取这个表的第一行，判断 id 值是不是 1，如果不是则跳过，如果是则将这行存在结果集中；
B.调用引擎接口取下一行，重复相同的判断逻辑，直到取到这个表的最后一行。
C.执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。
```

全表扫描接口：
 //初始化全表扫描
 virtual int rnd_init (bool scan);
 //从表中读取下一行
 virtual int rnd_next (byte* buf);

**对于有索引的表，使用索引相关接口：**
```
A.第一次调用读取索引第一条内容接口（ha_index_first）。
B.之后循环取满足索引条件的下一行接口（ha_index_next）。
```

通过索引访问table内容：
 //使用索引前调用该方法
 int ha_foo::index_init(uint keynr, bool sorted)
 //使用索引后调用该方法
 int ha_foo::index_end(uint keynr, bool sorted)
 //读取索引第一条内容
 int ha_index_first(uchar * buf);
 //读取索引下一条内容
 int ha_index_next(uchar * buf);
 //读取索引前一条内容
 int ha_index_prev(uchar * buf);
 //读取索引最后一条内容
 int ha_index_last(uchar * buf);
 //给定一个key基于索引读取内容
 int index_read(uchar * buf, const uchar * key, uint key_len,  enum ha_rkey_function find_flag)


 数据库的慢查询日志中有 rows_examined 字段，表示这个语句执行过程中扫描了多少行。这个值就是在执行器每次调用引擎获取数据行的时候累加的。在有些场景下，执行器调用一次，在引擎内部则扫描了多行，因此引擎扫描行数跟 rows_examined 并不是完全相同的。

### 6、结果返回

查询执行的最后一个阶段就是将结果返回给客户端。即使查询不到数据，MySQL 仍然会返回这个查询的相关信息，比如该查询影响到的行数以及执行时间等。如果查询缓存被打开且这个查询可以被缓存，MySQL也会将结果存放到缓存中。结果集返回客户端是一个增量且逐步返回的过程。有可能 MySQL 在生成第一条结果时，就开始向客户端逐步返回结果集。这样服务端就无须存储太多结果而消耗过多内存，也可以让客户端第一时间获得返回结果。需要注意的是，结果集中的每一行都会以一个满足客户端/服务器通信协议的数据包发送，再通过 TCP协议 进行传输，在传输过程中，可能对 MySQL 的数据包进行缓存然后批量发送


## 十、进阶知识-更新语句执行过程
### 1、基本流程
查询语句的执行流程，更新语句也会同样的走一遍。sql= update T set c=c+1 where id=2

![整体执行过程](http://cdn.gydblog.com/images/database/mysql/mysql-update-1.png)

大概的执行步骤是如下:
1）客户端向 MySQL 服务器发送一条更新请求

2）清除表查询缓存，跟这个有关的查询缓存会失效。这就是一般不建议使用查询缓存的原因。

3）分析器进行 SQL解析（词法和语法分析），分析这是一条更新语句。

4）优化器生成对应的执行计划，优化器决定使用ID这个索引；

5）执行器负责更新，找到这一行，然后进行更新:
```
a.取数据行: 执行器先找引擎取 ID=2 这一行:  ID 是主键，引擎直接用树搜索找到这一行。如果 ID=2 这一行所在的数据页本来就在内存中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回。)
b.更新数据: 执行器拿到引擎给的行数据，把这个值加上 1，比如原来是 N，现在就是 N+1，得到新的一行数据，再调用引擎接口写入这行新数据。
c.更新内存: 引擎将这行新数据更新到内存中，
d.更新 redo log :同时将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务。
e.写入binlog:执行器生成这个操作的 binlog，并把 binlog 写入磁盘。
f.提交事务: 执行器调用引擎的提交事务接口，引擎把刚刚写入的 redo log 改成提交（commit）状态，更新完成。
```

![更新过程](http://cdn.gydblog.com/images/database/mysql/mysql-update-2.png)


### 2、日志文件
与查询流程不同的是，更新流程涉及两个重要日志模块：redo log（重做日志）和 binlog（归档日志）。redo log是InnoDB存储引擎层的日志，binlog是MySQL Server层记录的日志， 两者都是记录了某些操作的日志(不是所有)自然有些重复（但两者记录的格式不同）。

redo log在数据库重启恢复的时候被使用，因为其属于物理日志的特性，恢复速度远快于逻辑日志。而binlog和undo log属于逻辑日志。

物理日志和逻辑日志的区别：
- 物理日志存储了数据被修改的值
- 逻辑日志存储了逻辑修改SQL语句



## 十一、进阶知识-索引
[MySQL索引概念详解](./mysql-index.md)


## 参考资料
https://juejin.cn/post/6950607182433878047
https://www.runoob.com/mysql/
https://www.infoq.cn/article/3Dve2K5wtS3kEMZtXyEh
https://cloud.tencent.com/developer/article/1353360
https://cloud.tencent.com/developer/article/1981543
https://developer.aliyun.com/article/831250