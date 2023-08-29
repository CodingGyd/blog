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

> 本篇默认读者已有SQL基础知识储备

## 一、概述
MySQL 是最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 可以说是最流行的技术。接下来小郭将把MySql的常见知识点进行总结。
## 二、基础知识-环境搭建

> 本文基于window64位操作系统+mysql5.7.43版本来进行陈述。

### 1、安装包获取
MySQL 安装包获取地址为：[官方下载链接](https://dev.mysql.com/downloads/mysql/ "官方下载链接")    

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
# 登录mysqlmysql -uroot -p# alter方式修改ALTER USER 'root'@'localhost' IDENTIFIED BY '123456'; //记得修改自己的账户
flush privileges; //修改成功后刷新权限

# set方式修改
set password for root@localhost = password('123456'); //记得修改自己的账户
flush privileges; //修改成功后刷新权限
```

更新密码后再次执行MySQL相关语句操作即正常回显。

![修改密码](http://cdn.gydblog.com/images/database/mysql/mysql-7.png)


接下来就可以进行正常的库表操作了。

### docker一键安装

[docker一键安装mysql](../cszl-enterprise-development-docker/docker.html#四、示例-部署安装mysql程序)


## 三、基础知识-常用命令

> 命令不区分大小写

### 1、mysql连接
```
mysql -u username -p
```

实例:
```
mysql -u root -p
```

### 2、数据库操作


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

### 3、创建数据表

语法
```
CREATE TABLE table_name (column_name column_type);
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

### 4、删除数据表
语法
```
DROP TABLE table_name ;
```

实例：
```
DROP TABLE User;
```

![删除数据表](http://cdn.gydblog.com/images/database/mysql/mysql-12.png)


### 5、插入数据行
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


### 6、查询数据行
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

### 7、更新数据行
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


### 8、删除数据行
语法
```
DELETE FROM table_name [WHERE Clause]
```

实例：
```
DELETE FROM User WHERE user_name='admin';
```

![删除数据行](http://cdn.gydblog.com/images/database/mysql/mysql-16.png)


### 9、模糊查询LIKE
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

### 10、联合查询UNION
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


mysql还有很多命令，小郭会慢慢的补充进来。

## 四、基础知识-数据类型

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
			<td>0-65 535 bytes</td>
			<td>二进制形式的长文本数据</td>
		</tr>
		<tr>
			<td>TEXT</td>
			<td>0-65 535 bytes</td>
			<td>长文本数据</td>
		</tr>
		<tr>
			<td>MEDIUMBLOB</td>
			<td>0-16 777 215 bytes</td>
			<td>二进制形式的中等长度文本数据</td>
		</tr>
		<tr>
			<td>MEDIUMTEXT</td>
			<td>0-16 777 215 bytes</td>
			<td>中等长度文本数据</td>
		</tr>
		<tr>
			<td>LONGBLOB</td>
			<td>0-4 294 967 295 bytes
			</td>
			<td>二进制形式的极大文本数据</td>
		</tr>
		<tr>
			<td>LONGTEXT</td>
			<td>0-4 294 967 295 bytes</td>
			<td>极大文本数据</td>
		</tr>
	</tbody>
</table>

## 进阶知识-索引优化

## 进阶知识-xxx

## 技术同学必会的MySQL设计规约，都是惨痛的教训

> 原文链接：https://mp.weixin.qq.com/s/XC8e5iuQtfsrEOERffEZ-Q




## 参考资料

https://www.runoob.com/mysql/mysql-data-types.html