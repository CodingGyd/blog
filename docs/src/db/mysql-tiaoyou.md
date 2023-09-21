---
title: MYSQL性能分析思路
shortTitle:  MYSQL性能分析思路
date: 2023-09-11
category:
  - JAVA企业级开发
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: 数据库,MySQL,关系型数据库,性能分析工具,慢SQL
---

# MYSQL性能分析思路

## 一、前言

MySQL的SQL性能分析是一个专业的JAVA开发人员无法逃避的知识，不管是面试还是在软件实际生产环境中，了解MySQL的SQL性能分析是非常重要的。

小郭对常见的MySQL性能分析排查思路进行了一个小结，分享给大家。

> MySQL性能分析的水很深，本文也只是粗略介绍一些概念和方法，大家有补充的可以在评论区讨论一下哦！

## 二、**测试数据准备工作**
1）创建测试表

```mysql
DROP TABLE IF EXISTS user_info;

CREATE TABLE `user_info` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL ,
    `name` VARCHAR(20) DEFAULT NULL,
    `company_id` INT(11) DEFAULT NULL,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```



2）定义存储过程，录入200W条测试数据

```mysql
delimiter $$  # 定义结束符
drop procedure if exists addTestData; # 存储过程名叫：addTestData
create procedure addTestData()
begin
declare user_id int;
set user_id = 1;
while user_id <= 2000000 #插入N条数据
do
insert into user_info(user_id,name,company_id)
values(user_id,concat('用户_',CEILING(RAND() * 90000 + 10000)),1001);  # 为了区分用户，我们在名称后加上后缀
set user_id = user_id + 1;
end
while;
end $$;
```



3）执行存储过程

```mysql
call addTestData;
```

小郭这里插入了200W条测试数据，耗时2.5小时。。(正常不应该这么慢，应该是电脑资源问题导致)

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-8.png)

4）删除存储过程（可选）

```mysql
drop procedure addTestData;
```

> 该测试表用于后续的索引语法查找验证

## 三、分析方法

### 1、查看SQL查询成本：last_query_cost

如果我们想要查询id=5678的用户记录，执行如下sql：

```mysql
SELECT user_id,name,company_id FROM user_info WHERE id = 5678;
```

上面查询是直接在聚簇索引上进行查找，执行结果是：1 row in set (0.00 sec)

我们看看上面sql的查询成本，执行如下命令：

```mysql
mysql> SHOW STATUS LIKE 'last_query_cost';
+-----------------+-----------+
| Variable_name   |   Value   |
+-----------------+-----------+
| Last_query_cost | 1.000000 |
+-----------------+-----------+
```



可以得出结论，实际上耗时0秒（实际可能是毫秒级别，也许几十ms），我们只需要检索一个页即可得到目标数据。

> MySQL中可以通过命令<font color="">show  status  like  'last_query_cost'</font>  来统计SQL的查询成本，它是io_cost和cpu_cost的开销总和，它通常也是我们评价一个查询的执行效率的一个常用指标。
>
>     (1)它是作为比较各个查询之间的开销的一个依据。
>     (2)它只能检测比较简单的查询开销，对于包含子查询和union的查询是测试不出来的。
>     (3)当我们执行查询的时候，MySQL会自动生成一个执行计划，也就是query  plan，而且通常有很多种不同的实现方式，它会选择最低的那一个，而这个cost值就是开销最低的那一个。
>     (4)它对于比较我们的开销是非常有用的，特别是我们有好几种查询方式可选的时候。

如果我们是想查询id范围在（1000，1100）的记录，执行sql如下：

```mysql
SELECT user_id,name,company_id FROM user_info WHERE id >= 1000 AND id <= 1100;
```

上面查询页是直接在聚簇索引上进行查找，执行结果是：101 row in set (0.01 sec)

我们看看上面sql的查询成本，同样执行如下命令：

```mysql
mysql> SHOW STATUS LIKE 'last_query_cost';
+-----------------+-----------+
| Variable_name   |   Value   |
+-----------------+-----------+
| Last_query_cost | 41.734363 |
+-----------------+-----------+
```

可以看出，范围查询sql查询页的数量是前面单个查询sql的41倍，但实际上这两个sql的执行效率没有太大差别，这其实是因为缓冲池的作用。

虽然 页 数量（last_query_cost）增加了不少 ，但是采用了顺序读取（非随机读取）的方式将页面一次性加载到缓冲池中，并 不会增加多少查询时间 。 

### 2、查看 SQL 执行过程成本：profiling

show profile 是 MySQL 提供的可以用来分析当前会话中 SQL 都做了什么、执行的资源消耗工具的情况，可用于 sql 调优的测量。`默认情况下处于关闭状态`，并保存最近15次的运行结果。

我们需要先将profiling参数打开，执行命令 :

```mysql
set profiling = 'on'
```



![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-11.png)



然后执行相关的查询语句。接着看下当前会话都有哪些 profiles，使用下面这条命令：

```mysql
show profiles;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-13.png)

通过上面的图可以看到当前会话一共有 3 个查询。如果我们想要查看最近一次查询的执行成本开销，可以使用show profile：

```mysql
show profile;
```



![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-12.png)

show profile 也可以指定参数，如 cpu、block io等：

```mysql
show profile cpu,block io for query 2;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-14.png)

**<font color="red">show profile的常用查询参数有下面这些： </font>**

| 参数             | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| BLOCK IO         | 显示块IO开销                                                 |
| ALL              | 显示所有的开销信息                                           |
| CPU              | 显示CPU开销信息                                              |
| CONTEXT SWITCHES | 上下文切换开销                                               |
| IPC              | 显示发送和接收开销信息。                                     |
| MEMORY           | 显示内存开销信息                                             |
| PAGE FAULTS      | 显示页面错误开销信息                                         |
| SOURCE           | 显示和Source_function，Source_file， Source_line相关的开销信息 |
| SWAPS            | 显示交换次数开销信息                                         |

 



**经验之谈：**

如果执行show profile查询的结果列status出现如下信息的任何一条，则大概率需要进行SQL语句优化了。

| Status中的信息               |                                                    |
| ---------------------------- | -------------------------------------------------- |
| Creating tmp table           | 创建临时表。先拷贝数据到临时表，用完后再删除临时表 |
| converting HEAP to MyISAM    | 查询结果太大，内存不够，数据往磁盘上搬了           |
| Copying to tmp table on disk | 把内存中临时表复制到磁盘上，警惕！                 |
| locked                       | 发生锁的情况                                       |



### 3、开启慢查询监控: slow_query_log

1）**开启 slow_query_log**

MySQL提供了`slow_query_log`参数可以开启统计慢查询sql信息，但是默认是不开启该功能的，通过下面命令可以查看是否开启：

```mysql
show variables like '%slow_query_log'
```



![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-1.png)

可以看到 `slow_query_log=OFF`，我们需要把慢查询日志打开:

```mysql
//注意设置变量值的时候需要使用 global，否则会报错：
set global slow_query_log='ON';
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-2.png)



2）**设置 long_query_time 阈值**

先查询下long_query_time 参数的默认配置：

```
show variables like '%long_query_time'
```



![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-3.png)

可以看出针对参数long_query_time默认配置的是10秒，也就是说执行超过10秒的sql才肯会被判断为慢SQL， 这里我们把参数设置为1秒

```mysql
set global long_query_time = 1;
```

```
注意：控制慢查询日志的还有一个系统变量：min_examined_row_limit。这个变量的意思是查询扫描过的最少记录数。  这个变量和long_query_time共同作为了判断一个查询语句是否是慢查询的条件。

也就是说：如果查询扫描过的记录数大于等于min_examined_row_limit，且查询执行时间超过long_query_time，则这个查询语句就被认为是慢查询，记录到慢查询日志中，否则不被记录。
min_examined_row_limit的系统默认值是0，也就是说如果我们没有主动设置过这个值，查询语句只需要满足执行时间大于long_query_time即被认定为是慢查询。

```

然后通过show命令查看配置的值是否生效: 

```
SHOW variables LIKE '%long_query_time';
```

我们会发现怎么还是10呢？如果执行show命令时带上global参数：

```
SHOW global variables LIKE '%long_query_time';
```

会发现值其实是生效的:

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-4.png)

这里需要注意一点：**设置global的方式对当前session的long_query_time不会失效，只对新连接的客户端有效。**

因此如果我们不重新连接mysql的话，需要同时执行下面命令(不带global)，才可以使参数设置对当前连接有效：

```
set long_query_time=1;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-5.png)



### 4 、定位慢查询SQL语句: slow_queries

首先查看系统目前监控到的慢查询语句的数量：

```mysql
show global variables like '%slow_queries'
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-6.png) 

如果查询显示大于0，则说明存在慢SQL， 找到慢SQL记录文件所在路径：  

```mysql
SHOW VARIABLES LIKE 'slow_query_log%';
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-9.png) 

可以看到默认配置的慢SQL记录保存在D:\mysql-5.7.43-winx64\data\ace-slow.log （这是小郭安装mysql程序的目录），我们找到这个ace-slow.log文件就能看到慢查询语句是哪些了。

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-10.png) 

如上图所示，文件中有记录call addTestData这条执行语句，本文最开始的部分【准备工作】说过这条存储过程执行耗时了2.5h，是肯定符合慢SQL判定条件的！  

一般我们的生产环境系统不太会直接使用到存储过程，该文件中会记录的大部分都是一些常见的CRUD表操作，只要定位到某条语句是慢查询，接下来就可以针对这条语句进行具体的分析优化了。

### 5 、分析慢查询SQL原因: explain  

**Explain工具的官方完整文档**： [MySQL5.7](https://dev.mysql.com/doc/refman/5.7/en/explain-output.html  "MySQL5.7")      [MySQL8.0](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html  "MySQL8.0")  

通过前面的铺垫，我们已经定位到了具体的慢SQL语句了，接下来可以使用MySQL提供的Explain工具(Describe工具等价)对该语句做具体问题分析了。 
通过Explain工具可以查看到某个SQL语句的具体执行计划，了解Explain工具的分析结果，比如对每个表采用的是什么访问方法，走了哪个索引查询，多表连接的顺序等等信息，可以引导我们针对性的优化SQL。

> 执行计划是MySQL中专门负责优化SELECT语句的模块来定义的，该模块会经过一系列分析最终定它认为最优的执行计划，然后交给执行模块去执行。
>

**Explain工具支持的SQL类型**： 

* MySQL 5.6.3以前只能 EXPLAIN SELECT ；MYSQL 5.6.3以后就可以 EXPLAIN SELECT，UPDATE， DELETE 
* 在5.7以前的版本中，想要显示 partitions 需要使用 explain partitions 命令；想要显示 filtered 需要使用 explain extended 命令。在5.7版本后，默认explain直接显示partitions和 filtered中的信息。



**EXPLAIN的语法形式如下**：

```mysql
EXPLAIN SQL语句
```

示例：

```mysql
explain select user_id from user_info limit 1
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-15.png) 

如上图所示就是MySQL的SQL优化器模块给出来的执行计划。执行explain并没有真正的去执行SQL语句，不会对数据产生实际影响，只是确定一个待执行的执行计划，如果后面提交执行就是使用该执行计划去落地。

通过执行计划，我们可以了解到我们SQL是否可以改善得更加的高效。除了SELECT，DELETE、INSERT、REPLACE、UPDATE等语句都可以用explain进行执行计划的预览。

执行计划输出的字段清单如下：

| 字段          | 概述                                                   |
| ------------- | ------------------------------------------------------ |
| id            | 每个SELECT语句中都对应一个唯一的id                     |
| select_type   | SELECT 关键字对应的查询类型                            |
| table         | 表名                                                   |
| partitions    | 匹配的分区信息                                         |
| type          | 针对单表的访问方法                                     |
| possible_keys | 可能命中的索引                                         |
| key           | 实际命中的索引                                         |
| ken_len       | 实际使用到的索引长度                                   |
| ref           | 当使用索引列等值查询时，与索引列进行等值匹配的对象信息 |
| rows          | 预估的需要读取的记录条数                               |
| filtered      | 某个表经过搜索条件过滤后剩余记录条数的百分比           |
| Extra         | 额外的信息                                             |



下面小郭将对其中重要字段的用途进行详细的总结说明。

**1）id**

查询语句一般都以 SELECT 关键字开头，但是一个SQL语句中可能出现一次SELECT或者多次SELECT关键字，这两种情况下的id生成有区别。 <font color='red'>查询语句中每出现一次SELECT关键字，MySQL就会为它分配一个唯一的id值</font>，这个id是explain执行结果的第一列。

**下边是一个比较简单的查询语句，只出现了1次SELECT**：

```mysql
SELECT user_id from user_info limit 1;
```

使用explain 对上边的sql进行执行计划预览：

```
EXPLAIN SELECT user_id from user_info limit 1;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-15.png) 

可以看出，mysql为这条sql的select生成的唯一值id是1。

**再看一个多表连接的例子，这个例子出现了2次SELECT**：

```
EXPLAIN SELECT a.user_id,b.name from user_info a inner join user_info2 b where a.user_id = b.user_id and a.user_id = 1;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-16.png) 

从上图可以看到, 连接查询时出现了两次select关键字，对应执行计划中生成了两条记录，但是他们的id值是相同的。 <font color="red">这是MySQL内部的特殊处理，在多表连接查询的执行计划中，每个表都会对应一条执行计划的记录，且这些记录的id列的值是相同的。</font>出现在前边的表表示`驱动表`，出现在后面的表表示`被驱动表`。所以从上边的EXPLAIN输出中我们可以看到，查询优化器准备让b表作为驱动表，让a表作为被驱动表来执行查询(这里的a和b是sql中定义的表的别名)。

**接着看一个使用union联合查询的例子，也出现了两次SELECT**:  

```mysql
EXPLAIN SELECT user_id,name from user_info 
UNION 
SELECT user_id,name from user_info2  ;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-17.png) 



从上图可以看到，explain生成的执行计划中出现了三行记录，首先针对每个select关键字生成了两个唯一id，还生成了一个<font color="red">id=null</font>的数据。这里的null值id是具有特殊含义的：<font color="red">在MySQL中，union关键字会把多个结果集合并进行去重再返回给调用方</font>。这个id=null的记录就是为了方便返回最终查询结果前去重的，MySQL在内部创建了一个名为<union1,2>的临时表（就是执行计划中第三条记录的table列的名称），id为null表明这个临时表是为了合并两个select查询的结果集而创建的。

注意MySQL中除了支持去重的联合查找union，还支持不需要去重的联合查找union all。因为不需要去重，所以用不到临时表，也就是说，在执行计划中不会生成id=null的记录。实践是检验真理的唯一标准，我们可以执行union all进行验证一下：

```mysql
EXPLAIN SELECT user_id,name from user_info 
UNION ALL 
SELECT user_id,name from user_info2  ;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-18.png) 

从上图可以看出，union类型的sql在执行计划中生成了3条记录，其中有一条id为null的记录，而union all类型的sql只生成了2条记录。

规律：

```
1）id相同时，可以认为是一组，从上往下顺序执行。
2）在所有组中，id值越大，优先级越高，越先执行。
3）每个不同的id，表示一次独立的小查询，一个sql下面的小查询次数越少越好。
```



**2）select_type** 



| 类型                 | 解释                                                         |
| -------------------- | ------------------------------------------------------------ |
| SIMPLE               | 查询语句中不包含`UNION`或者子查询的查询都算作是`SIMPLE`类型, 连接查询join也是SIMPLE类型。 |
| PRIMARY              | 对于包含`UNION、UNION ALL`或者子查询的大查询来说，它是由几个小查询组成的，其中最左边的那个查询的`select_type`的值就是`PRIMARY`,也就是说`驱动表`的select_type是primary，例如：EXPLAIN SELECT * FROM s1 UNION SELECT * FROM s2; |
| UNION                | 对于包含`UNION`或者`UNION ALL`的大查询来说，它是由几个小查询组成的，其中除了最左边的那个小查询意外，其余的小查询的`select_type`值就是UNION |
| UNION RESULT         | MySQL 选择使用临时表来完成`UNION`查询的去重工作，针对该临时表的查询的`select_type`就是`UNION RESULT`, |
| SUBQUERY             | 如果包含子查询的查询语句不能够转为对应的`semi-join`的形式，并且该子查询是不相关子查询，并且查询优化器决定采用将该子查询物化的方案来执行该子查询时，该子查询的第一个`SELECT`关键字代表的那个查询的`select_type`就是`SUBQUERY`，比如下边这个查询：EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2) OR key3 = 'a'; |
| DEPENDENT SUBQUERY   | 示例：EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2 WHERE s1.key2 = s2.key2) OR key3 = 'a'; |
| DEPENDENT UNION      | 示例：EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2 WHERE key1 = 'a' UNION SELECT key1 FROM s1 WHERE key1 = 'b'); |
| DERIVED              | EXPLAIN SELECT * FROM (SELECT key1, count(*) as c FROM s1 GROUP BY key1) AS derived_s1 where c > 1; |
| MATERIALIZED         | 当查询优化器在执行包含子查询的语句时，选择将子查询物化之后的外层查询进行连接查询时，该子查询对应的`select_type`属性就是DERIVED，比如下边这个查询：EXPLAIN SELECT * FROM s1 WHERE key1 IN (SELECT key1 FROM s2); |
| UNCACHEABLE SUBQUERY | 基本不用                                                     |
| UNCACHEABLE UNION    | 基本不用                                                     |

**3）table**

不管我们的SQL语句有多复杂，到最后MySQL都是需要对每个表进行单表访问的，因为MySQL中每个表的数据存储都是单个的文件。

所 以MySQL规定EXPLAIN语句输出的每条记录都对应着某个单表的访问方法，该条记录的table列代表着该 表的表名（有时不是真实的表名字，可能是简称）。EXPLAIN语句输出多条记录，table列就会有多个值。

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-19.png) 

**4）partitions**

代表分区表中的命中情况，非分区表，该项为`NULL`。一般情况下我们的查询语句的执行计划的`partitions`列的值为`NULL`。

下面演示分区表的使用。

创建分区表，该表按照id分区，id<100 p0分区，其他p1分区：

```mysql

CREATE TABLE user_info_partitions (id INT auto_increment,
NAME VARCHAR(12),PRIMARY KEY(id))
PARTITION BY RANGE(id)(
PARTITION p0 VALUES less than(100),
PARTITION p1 VALUES less than MAXVALUE
);
```

**查询id < 100的记录，看看分区表的命中情况**：

```mysql
explain SELECT * FROM user_info_partitions WHERE id<100;
```

 ![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-20.png)

可以看出，命中了分区p0。

**查询id>100的记录，看看分区表的命中情况**：

```mysql
 SELECT * FROM user_infopartitions WHERE id>100;
```

 ![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-21.png)

可以看出，命中了分区p1。



**5）type**  

执行计划中的type是我们分析慢SQL时要重点关注的。该字段代表着MySQL对某个表的 `执行查询时的访问方法` , 又称“访问类型”，比如，看到`type`列的值是`ref`，表明`MySQL`即将使用`ref`访问方法来执行对xxx表的查询。

type的可选值有很多, 执行效率由高到低依次是： <font color="green">system > const > eq_ref > ref </font>> fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > <font color="red">range > index > ALL </font>。

**SQL性能优化目标：至少要达到range级别，要求达到ref级别，最好是const级别！！！**



因为type这个属性比较重要，小郭来对type的部分重要可选值来详细演示说明一下。

- system | ALL

  当表中`只有一条记录`并且该表使用的存储引擎的统计数据是精确的，比如MyISAM、Memory，那么对该表的访问方法就是`system`。我们新建一个存储引擎是`MyISAM`类型的表，并为其插入一条记录 ，最后使用explain分析一下执行计划：

  ![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-22.png) 

  

  此时，如果我们继续插入记录，再使用explain分析执行计划，type就不会是system类型了

  ![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-23.png) 

  

  或者我们把表的存储引擎改为INNODB， 再使用同样的sql查询，explain工具生成执行计划type也会是all，有兴趣的小伙伴可以自己尝试一下。

  

- const

  当我们根据主键或者唯一二级索引列与常数进行等值匹配时，对单表的访问方法就是`const`, 比如：

  >  

  ```mysql
  //创建表t2，id是主键列
  create table t2(id int primary key) engine =INNODB;
  //插入一条记录
  insert into t2 values(1);
  //使用explain进行查询语句的分析
  explain select *from t2 where id = 1;
  ```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-24.png)

- eq_ref

  在连接查询时，如果被驱动表是通过主键或者唯一二级索引列等值匹配的方式进行访问的(被驱动表和驱动表的概念在文章开头有介绍)，则对该被驱动表的访问方法就是`eq_ref`，下面演示一下这种类型何时会出现：

  ```mysql
  //创建表t3和表t4， 并分别插入一条数据，然后使用连接查询两表的数据（假设两个表的主键id是关联条件）
  //注意：这里是演示效果，实际业务中不会出现两个主键id互为关联条件哦
  create table t3(id int primary key);
  create table t4(id int primary key);
  insert into t3 values(1);
  insert into t4 values(1);
  explain select *from t3 inner join t4 on t3.id = t4.id;
  ```

  ![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-25.png)

从上图中执行计划的结果中可以看出，MySQL打算将t3作为驱动表，t1作为被驱动表。t1的访问 方法是 `eq_ref` ，表明在访问t1表的时候可以 `通过主键的等值匹配` 来进行访问。

- ref | ref_or_null

```mysql
//创建表t5，其中的字段name是二级索引（非主键索引）
create table t5(id int primary key, name varchar(100), index idx_name(name));
insert into t5 values(1,'test');
```

**当通过普通的二级索引列与常量进行等值匹配时来查询某个表，那么对该表的访问方法就可能是`ref`。**

```
explain select *from t5 where name = 'test';
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-26.png)

**当通过普通的二级索引列与常量进行等值匹配，，该索引列的值也可以是`NULL`值时，那么对该表的访问方法就可能是`ref_or_null`。**

```
explain select *from t5 where name = 'test' or name is null;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-27.png)

- index

   一般情况下对于某个表的查询只能使用到一个索引，但单表访问方法时在某些场景下可能会同时用到多个索引。

  我们执行下面的查询语句：

  ```mysql
  explain select *from t5 where name = 'test' or id = 1;
  ```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-28.png)

从explain生成的执行计划结果可以看出，使用主键索引和二级索引进行同时检索（实际不会发生这种情况，因为主键索引就可以唯一定位记录了） ，type的值就是index。



**6）possible_keys | key | key_len**

​	 possible_keys:  可能命中的索引

​     key:  实际命中的索引  

​      key_len: 实际使用到的索引长度（字节数），帮我们检查是否充分利用上了索引，值越大代表越好。

**7）Extra**

| 类型                  | 解释                                                         |
| --------------------- | ------------------------------------------------------------ |
| Using filesort        | MySQL 需要额外的一次传递，以找出如何按排序顺序检索行。通过根据联接类型浏览所有行并为所有匹配 WHERE 子句的行保存排序关键字和行的指针来完成排序。然后关键字被排序，并按排序顺序检索行 |
| Using temporary       | 使用了临时表保存中间结果，性能特别差，需要重点优化           |
| Using index           | 表示相应的 select 操作中使用了覆盖索引（Coveing Index）,避免访问了表的数据行，效率不错！如果同时出现 using where，意味着无法直接通过索引查找来查询到符合条件的数据 |
| Using index condition | MySQL5.6 之后新增的index condition pushdown, 简称 ICP，using index condtion 就是使用了 ICP（索引下推），在存储引擎层进行数据过滤，而不是在服务层过滤，利用索引现有的数据减少回表的次数 |
| Using where           | 表示MySQL服务器层将在存储引擎层返回行以后再应用WHERE过滤条件 |

## 四、常用性能参数

有时候SQL本身没有性能问题，问题可能出现在数据库服务器机器资源上。

在MySQL中，可以使用 `SHOW STATUS` 语句查询一些MySQL数据库服务器的`性能参数、执行频率`。

SHOW STATUS语句语法如下：

```sql
SHOW [GLOBAL|SESSION] STATUS LIKE '参数';
```

一些常用的性能参数如下：

* Connections：连接MySQL服务器的次数。 
* Uptime：MySQL服务器的上线时间。 
* Slow_queries：慢查询的次数。 
* Innodb_rows_read：Select查询返回的行数 
* Innodb_rows_inserted：执行INSERT操作插入的行数 
* Innodb_rows_updated：执行UPDATE操作更新的 行数 
* Innodb_rows_deleted：执行DELETE操作删除的行数 
* Com_select：查询操作的次数。 
* Com_insert：插入操作的次数。对于批量插入的 INSERT 操作，只累加一次。 
* Com_update：更新操作 的次数。 
* Com_delete：删除操作的次数。

若查询MySQL服务器的连接次数，则可以执行如下语句:

```mysql
SHOW STATUS LIKE 'Connections';
```

若查询服务器工作时间，则可以执行如下语句:

```mysql
SHOW STATUS LIKE 'Uptime';
```

若查询MySQL服务器的慢查询次数，则可以执行如下语句:

```mysql
SHOW STATUS LIKE 'Slow_queries';
```

慢查询次数参数可以结合慢查询日志找出慢查询语句，然后针对慢查询语句进行`表结构优化`或者`查询语句优化`。

再比如，如下的指令可以查看相关的指令情况：

```mysql
SHOW STATUS LIKE 'Innodb_rows_%';
```

## 

## 五、常见索引失效案例

表结构如下：

```
 CREATE TABLE `user_info3` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userid_companyid` (`user_id`,`company_id`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```



### 1、最左匹配

> 最左匹配常见于联合索引中。

索引结构：

```mysql
KEY`idx_userid_companyid`(`user_id`,`company_id`)
```

业务SQL: 

```mysql
select * from  user_info  where company_id=111
```

上面业务SQL在实际执行时不会命中索引， 是因为在MySQL的联合索引中，查询匹配是从左往右进行匹配的，要使用 company_id走索引，必须查询条件携带 user_id或者修改索引结构由（`user_id`，`company_id`）变为(`company_id`,`user_id`) 调换前后顺序。

### 2、字段类型不同(隐式转换)

索引：

```mysql
KEY`idx_phone`(`phone`)
```

SQL 语句：

```mysql
select * from user_info where phone= 15974154444
```

隐式转换相当于在索引上做运算，会让索引失效。phone是字符类型，使用了数字，应该使用字符串匹配，否则 MySQL 会用到隐式替换，导致索引失效。

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-29.png)



### 3、不等于、不包含等场景

索引：

```mysql
KEY`idx_userid_companyid`(`user_id`,`company_id`)
```

SQL：

```mysql
select *from user_info where user_id != 1;
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-30.png)

可以看到，索引是不生效的。

在索引上，避免使用 NOT、!=、<>、!<、!>、NOT EXISTS、NOT IN、NOT LIKE等。



### 4、复杂查询

类似下面的sql，查询条件比较多的情况都认为是一个复杂查询了：

```mysql
select  sum(xxx)  from   table where  a=1   and   b   in(1,2,3)   and  c >'2020-01-01' ;
```

如果是统计某些数据，可能改用数仓进行解决；如果是业务上就有那么复杂的查询，可能就不建议继续走 SQL 了，而是采用其他的方式进行解决，比如使用 ES 等搜索组件进行解决。



### 5、 索引列上有计算

```mysql
select * from  user_info where user_id+1=2;  
```

![](http://cdn.gydblog.com/images/database/mysql/mysql-slow-31.png)

 如果索引有计算或者索引列上使用了函数都会导致索引失效。



### 6、like左边包含%

模糊查询，在我们日常的工作中，使用频率还是比较高的。

目前like查询主要有三种情况：

- select *from xxx  where field like '%a'
- select *from xxx  where field like 'a%'
- select *from xxx  where field like '%a%'

如果field是索引列，只有 like 'a%'的方式是会走索引的！ 



### 7、列对比

如果把两个单独建了索引的列，用来做列对比时索引会失效。

```mysql
select * from table where a=b
```

### 8、or

如果使用了`or`关键字，那么它前面和后面的字段都要加索引，不然所有的索引都会失效，这是一个大坑。

```mysql
select * from table where a=1 OR b=2 or c=3
```

上述sql中若a、b、c任一一个不是索引列，则sql不会走索引查询

## 六、结束语

上面总结了MySQL中慢SQL的几种排查手段，都涉及到MySQL服务的一些全局的基本配置项修改。而然在实际生产环境，修改任何MySQL全局配置都需要慎重！

