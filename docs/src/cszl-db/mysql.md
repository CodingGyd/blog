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
```
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
```
mysql> LOAD DATA LOCAL INFILE 'outfile.txt' 
    -> INTO TABLE user (user_name, user_sex, insert_date);
```

4）使用 mysqlimport 导入数据
```
$ mysqlimport -u root -p --local user outfile.txt
password *****
```

mysqlimport有很多可选项，有兴趣的可以自行查资料啦！


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


## 五、基础知识-内置函数
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
      <td>
        <a href="/mysql/mysql-func-ifnull.html" rel="noopener noreferrer" target="_blank">IFNULL(v1,v2)</a>
      </td>
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

## 进阶知识-索引优化

## 进阶知识-xxx

## 技术同学必会的MySQL设计规约，都是惨痛的教训

> 原文链接：https://mp.weixin.qq.com/s/XC8e5iuQtfsrEOERffEZ-Q




## 参考资料

https://www.runoob.com/mysql/