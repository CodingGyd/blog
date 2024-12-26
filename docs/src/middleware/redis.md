---
title: Redis知识点详解
shortTitle: Redis知识点详解
date: 2023-09-21
category:
  - 开源框架
tag:
  - 缓存组件
description: 记录中间件Redis的常用知识点
head:
  - - meta
    - name: keywords
      content: Redis,非关系型数据库,缓存,NoSQL,分布式缓存,集群,哨兵
---

# Redis知识点详解


## 一、前言

目前计算机世界中的数据库共有2种类型：关系型数据库、非关系型数据库。

**常见的关系型数据库解决方案**

```
MySQL、MariaDB（MySQL的代替品）、Percona Server（MySQL的代替品·）、Oracle、PostgreSQL、
Microsoft Access、Google Fusion Tables、SQLite、DB2、FileMaker、SQL Server、INFORMIX、Sybase、dBASE、Clipper、FoxPro、foshub。
```

几乎所有的数据库管理系统都配备了一个开放式数据库连接（ODBC）驱动程序，令各个数据库之间得以互相集成。

**常见的非关系型数据库解决方案（NoSQL）**

> Not Only SQL

 ```
 Redis、MongoDB、Memcache、HBase、BigTable、Cassandra、CouchDB、Neo4J。
 ```

目前小郭的工作经历里使用最多的就是Redis了。

**关系型数据库和非关系型数据库的区别**

区别就是一个叫关系型，一个叫非关系型~  这么解释网友们会不会打残我？ 哈哈哈 下面来个正经一点的解释。

*关系型数据库最典型的数据结构是表，由二维表及其之间的联系所组成的一个数据组织，有如下优缺点。*

**1）优点**

- 使用方便

  SQL语言通用，可用于复杂查询；

- 易于维护

  都是使用表结构，格式一致；

- 复杂操作

  支持SQL，可用于一个表以及多个表之间非常复杂的查询。

- 支持事务控制

**2） 缺点**

- 高并发读写性能比较差

  尤其是海量数据的高效读写场景性能比较差，因为硬盘I/O是一个无法避免的瓶颈。

- 灵活度低

  表结构固定，DDL修改对业务影响大。

*非关系型数据库严格上不是一种数据库，应该是一种数据结构化存储方法的集合，可以是文档或者键值对等。有如下优缺点。*

 **1）优点**

- 读写速度快

  IO快，可以使用内存、硬盘或者其它随机存储器作为数据载体，而关系型数据库只能使用硬盘

- 扩展性强

- 数据格式灵活

  存储数据格式可以是kv、文档、图片等等，限制少，应用场景广，而关系型数据只能是内置的基础数据类型

- 成本低

  部署简单，大部分开源免费，社区活跃。

**2）缺点**

- 不支持join等复杂连接操作

- 事务处理能力弱

- 缺乏数据完整性约束

- 不提供SQL支持

  暂时不提供SQL支持，会造成开发任意额外的学习成本

*再来说说为什么需要非关系型数据库技术。*

小郭结合自己的工作经验来总结一下(不喜轻点喷~)，目前的软件产品从用户角度主要分为几个方向：

- To C

  这个方向的软件产品是目前市面上最多的，面向的主要是个人用户，遵循比较规范的产品流程。 通常这类软件的用户量基数巨大且增长快，比如美团的年度交易用户数已从2015年的2亿人，增长到2022年的6.87亿人（2022年Q3财报），平均每2个中国人就有一个在美团上花过钱。用户量大，对性能的要求也会比较高，有可能一瞬间成千上万的请求到来（抢购、促销活动场景不可控），需要系统在极短的时间内完成成千上万次的读/写操作，这个时候往往不是关系型数据库能够承受的，极其容易造成数据库系统瘫痪，最终导致服务宕机的严重生产问题， 因此需要引入缓存解决方案，减少对关系型数据库的影响。 Redis就是一个不二选择。

- To G

  随着近年来不断倡导互联网+，政府也纷纷进行转型，寻求更好的商业模式。To G是从 To B衍生出来的一种特殊划分，面向的企业为政府或相关事业单位，主要是根据每年政府投入的财政预算，然后去做的一系列信息化项目，可以说是“指标驱动，为做项目而做项目”。这类项目有两个极端场景，一类是用户量极低，提供给内部使用的，本地化部署； 还有一类是面向老百姓的，用户量也大，但是对并发要求并不高，比如政务类软件。

  举个栗子：智能考车系统，是典型的公安部主导的一款To G产品，使用对象是考官和公安部相关管理等内部人员，用户量不多；而“交管12123”是直接提供给老百姓使用的APP，可以自行预约考试，处理违章等，面向的是全国十几亿人，用户基数大，海量数据，完全依赖传统的关系型数据库肯定会降低应用访问性能，因此也需要引入新的非关系型数据库解决方案来开发程序功能。

- To B

  这个方向的产品一般是面向商业企业用户的，一般不向大众用户公开。用户量相对较少，通常情况对性能的要求比To C类产品要低一些，一般大部分场景都是直接使用关系型数据库进行数据存储，少部分场景也会额外依赖非关系型数据库。

一句话总结：To C使用场地是随时对地；ToB更多是内网；To G是内外网相结合（互联网+政务）

> 软件研发产品大体是包括这三大类（当然还有To VC , To P 的一些分法，也没错，只是立足点不同）

目前业界的技术选型原则基本是：核心数据存储选择关系型数据库，次要数据存储选择非关系型数据库。

本文接下来主要总结非关系型数据库中的Redis技术的相关知识。

![redis知识点大纲](http://cdn.gydblog.com/images/middleware/redis-ml.jpg)

## 二、Redis简介

> redis的官网地址，是redis.io。（域名后缀io属于国家域名，是british Indian Ocean territory，即英属印度洋领地），Vmware在资助着redis项目的开发和维护。
>
> 从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由[Pivotal](https://baike.baidu.com/item/Pivotal?fromModule=lemma_inlink)赞助。

### 1、是什么

据说有一名意大利程序员，在 2004 年到 2006 年间主要做嵌入式工作，之后接触了 Web，2007 年和朋友共同创建了一个网站，并为了解决这个网站的负载问题（为了避免 MySQL 的低性能），于是亲自定做一个数据库，并于 2009 年开发完成，这个就是 Redis。这个意大利程序员就是 Salvatore Sanfilippo 江湖人称 Redis 之父，大家更习惯称呼他 Antirez。

Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。Redis属于非关系型数据库中的一种解决方案，目前也是业界主流的缓存解决方案组件。

数百万开发人员在使用Redis用作数据库、缓存、流式处理引擎和消息代理。

### 2、为什么用它

**Redis**是当前互联网世界最为流行的 NoSQL（Not Only SQL）数据库，它的性能十分优越，其性能远超关系型数据库，可以**支持每秒十几万此的读/写操作**，并且还**支持集群、分布式、主从同步等**配置，理论上可以无限扩展节点，它还**支持一定的事务能力**，这也保证了高并发的场景下数据的安全和一致性。

最重要的一点是：Redis的社区活跃，这个很重要。

Redis 已经成为 IT 互联网大型系统的标配，熟练掌握 Redis 成为开发、运维人员的必备技能。

### 3、优点

- 性能极高

   官方的 Benchmark 数据：测试完成了 50 个并发执行 10W 个请求。设置和获取的值是一个 256 字节字符串。

   测试结果：Redis读的速度是110000次/s,写的速度是81000次/s 。

- 数据类型丰富

  支持 Strings, Lists, Hashes, Sets 及 Ordered Sets 数     据类型操作。

- 原子操作

  所有的操作都是原子性的，同时Redis还支持对几个操作全并后的原子性执行。

- 功能丰富

  提供了缓存淘汰策略、发布订阅、lua脚本、简单事务控制、管道技术等功能特性支持

## 三、如何安装

### 1、版本管理

Redis 使用标准的做法进行版本管理: **主版本号.副版本号.补丁号**。 偶数 **副版本号** 表示一个 **稳定的** 发布，像 1.2, 2.0, 2.2, 2.4, 2.6, 2.8。奇数副版本号表示 **不稳定的** 发布，例如 2.9.x 发布是一个不稳定版本，下一个稳定版本将会是Redis 3.0。

###  2、windows安装

>  Redis在Windows上不受官方支持。但是，我们还是可以按照下面的说明在Windows上安装Redis进行开发。

[官方window安装教程](https://redis.io/docs/getting-started/installation/install-redis-on-windows/)这个照着安装是行不通的！！！！

但是有开源爱好者提供了window的**免安装**方式，操作非常简单，下面进行步骤说明。

#### 1）获取安装包

直接下载开源的redis-window版本安装包：[Releases · tporadowski/redis (github.com)](https://github.com/tporadowski/redis/releases)

![源码包获取](http://cdn.gydblog.com/images/middleware/redis-install-1.png)



下载好后解压到本地磁盘某个目录，目录结构如下：

![目录结构](http://cdn.gydblog.com/images/middleware/redis-install-4.png)

redis-server.exe和redis.windows.conf就是我们接下来要用到的重要文件了。

#### 2）启动服务端

打开一个 **cmd** 窗口 使用 cd 命令切换目录到 **D:\Redis-x64-5.0.14.1** 运行如下命令：

```
redis-server.exe redis.windows.conf
```

如果想方便的话，可以把 redis 的路径加到系统的环境变量里，这样就省得再输路径了，后面的那个 redis.windows.conf 可以省略，如果省略，会启用默认的。输入之后，会显示如下界面：

![启动日志](http://cdn.gydblog.com/images/middleware/redis-install-2.png)

接下来保持这个cmd界面不要关闭，我们启动一个客户端去连接服务端。

#### 3）客户端连接

服务端程序启动好之后，我们就可以用客户端去连接使用了，目前已经有很多开源的图形化客户端比如Redis-Desktop-Manager，redis本身也提供了命令行客户端连接工具，接下来我们直接用命令行工具去连接测试。

另启一个 cmd 窗口，原来的不要关闭，不然就无法访问服务端了。切换到目录**D:\Redis-x64-5.0.14.1**，执行如下命令：

```
redis-cli.exe -h 127.0.0.1 -p 6379
```

设置一个key名为"hello"，value是"world"的键值对: 

![客户端访问](http://cdn.gydblog.com/images/middleware/redis-install-3.png)

上面的日志显示成功连接到了redis服务，并且设置了一个key名为"hello"，value是"world"的键值对数据。

### 3、linux安装

linux安装redis的方式也有多种，小郭这里仅演示源码安装的方式。

#### 1） 获取源码

使用wget命令从[官网](https://redis.io/download/ )下载最新的源码包

```linux
root@xxx guoyd]# wget https://download.redis.io/redis-stable.tar.gz
```

![源码获取](http://cdn.gydblog.com/images/middleware/redis-install-5.png)

#### 2）编译

- 解压源码包并进入根目录：

```
root@xxx guoyd]# tar -xvf redis-stable.tar.gz 
root@xxx guoyd]# cd redis-stable
root@xxx guoyd]# ll
[root@xxx redis-stable]# ll
total 244
-rw-rw-r--  1 guoyd guoyd  18320 Sep  7 01:56 00-RELEASENOTES
-rw-rw-r--  1 guoyd guoyd     51 Sep  7 01:56 BUGS
-rw-rw-r--  1 guoyd guoyd   5027 Sep  7 01:56 CODE_OF_CONDUCT.md
-rw-rw-r--  1 guoyd guoyd   2634 Sep  7 01:56 CONTRIBUTING.md
-rw-rw-r--  1 guoyd guoyd   1487 Sep  7 01:56 COPYING
drwxrwxr-x  8 guoyd guoyd   4096 Sep  7 01:56 deps
-rw-rw-r--  1 guoyd guoyd     11 Sep  7 01:56 INSTALL
-rw-rw-r--  1 guoyd guoyd    151 Sep  7 01:56 Makefile
-rw-rw-r--  1 guoyd guoyd   6888 Sep  7 01:56 MANIFESTO
-rw-rw-r--  1 guoyd guoyd  22607 Sep  7 01:56 README.md
-rw-rw-r--  1 guoyd guoyd 107512 Sep  7 01:56 redis.conf
-rwxrwxr-x  1 guoyd guoyd    279 Sep  7 01:56 runtest
-rwxrwxr-x  1 guoyd guoyd    283 Sep  7 01:56 runtest-cluster
-rwxrwxr-x  1 guoyd guoyd   1772 Sep  7 01:56 runtest-moduleapi
-rwxrwxr-x  1 guoyd guoyd    285 Sep  7 01:56 runtest-sentinel
-rw-rw-r--  1 guoyd guoyd   1695 Sep  7 01:56 SECURITY.md
-rw-rw-r--  1 guoyd guoyd  14700 Sep  7 01:56 sentinel.conf
drwxrwxr-x  4 guoyd guoyd   4096 Sep  7 01:56 src
drwxrwxr-x 11 guoyd guoyd   4096 Sep  7 01:56 tests
-rw-rw-r--  1 guoyd guoyd   3628 Sep  7 01:56 TLS.md
drwxrwxr-x  9 guoyd guoyd   4096 Sep  7 01:56 utils
```



- 执行make命令进行源码编译

  ```
  root@xxx redis-stable]# make
  ```

  

  编译时间大概需要几分钟，如果编译成功，将看到如下输出日志：

  ```
  .....日志太多，略......
  Hint: It's a good idea to run 'make test' ;)
  make[1]: Leaving directory `/home/guoyd/redis-stable/src'
  ```

  

  同时，在src目录中会生成几个 新的Redis 二进制文件：

  ```
  redis-server: 代表redis服务本身的可执行程序
  redis-cli：redis提供的命令行工具，用于和redis服务端进行交互
  ```

  

#### 3）安装

编译成功后，我们继续在源码根目录下使用`make install`将redis服务安装到默认目录usr/local/bin中：

```
[root@iZbp128dczen7roibd3xciZ redis-stable]# make install
cd src && make install
which: no python3 in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/usr/java/jdk1.8.0_201/bin:/root/bin)
make[1]: Entering directory `/home/guoyd/redis-stable/src'
    CC Makefile.dep
make[1]: Leaving directory `/home/guoyd/redis-stable/src'
which: no python3 in (/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/usr/java/jdk1.8.0_201/bin:/root/bin)
make[1]: Entering directory `/home/guoyd/redis-stable/src'

Hint: It's a good idea to run 'make test' ;)

    INSTALL redis-server
    INSTALL redis-benchmark
    INSTALL redis-cli
make[1]: Leaving directory `/home/guoyd/redis-stable/src'
[root@iZbp128dczen7roibd3xciZ redis-stable]# 
```

`make install`执行完成后，redis就被安装到了默认目录usr/local/bin中，该目录中有如下文件：

```
[root@iZbp128dczen7roibd3xciZ bin]# ls
redis-benchmark  redis-check-aof  redis-check-rdb  redis-cli  redis-sentinel  redis-server
```

**redis-benchmark**：性能测试工具，可以在自己电脑上运行，看看自己电脑性能情况。

**redis-check-aof**：修复有问题的AOF文件。

**redis-check-rdb**：修复有问题的RDB文件。

**redis-cli**：Redis客户端操作入口（常用）

**redis-sentinel**：Redis哨兵集群使用。

**redis-server**：Redis服务器启动命令入口 （常用）



#### 4）启动服务端

redis安装好了，我们可以在任意目录下执行`redis-server`命令启动服务端，启动方式有两种：`前台启动`、`后台启动`，它们的区别如下：

**前台启动（不推荐）**：启动命令行窗口不能被关闭，否则Redis服务进程将被停止。

**后台启动（推荐）**：启动命令执行后，命令执行窗口可以关闭，Redis服务进程正常运行。

下面演示启动Redis服务，用的是`前台启动`方式。

> 因为redis-server已经被配置到了环境变量中，所以可以在任意目录执行

```
[root@xxx ~]# redis-server  
```

上面演示的是使用默认配置启动redis服务，如果我们想自定义配置，可以使用如下方式：

```
redis-server /xxx/xxx/redis.conf
```

redis.conf是redis的核心配置文件，我们可以按需进行配置修改。 

比如如果你想使用`后台启动`方式，修改redis.conf中的配置项`daemonize`为yes，然后重新执行启动命令即可。

在源码redis-stable的根目录中也提供了配置文件的模板redis.conf， 小郭会在本文后续章节中对这个配置文件做详细说明。

#### 5）客户端连接

和window版本一样，有很多开源图形化客户端，我们这里还是使用redis自带的命令行工具去连接。

另启一个 linux终端，原来的不要关闭，不然就无法访问服务端了。重新打开一个linux终端，执行如下命令：

> 当然这里也有办法直接让redis在后台运行，重新打开一个终端的操作不是必要的。

```
[root@xxx ~]# redis-cli.exe -h 127.0.0.1 -p 6379
-bash: redis-cli.exe: command not found
[root@iZbp128dczen7roibd3xciZ ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> get hello
"world"
127.0.0.1:6379> 
```

上面的操作成功连接到了redis服务，并且使用set命令设置了一个key名为"hello"，value是"world"的键值对数据。

此时，我们的linux服务器上就同时存在一个redis服务端进程和一个redis客户端连接进程：

```
[root@xxx ~]# ps -ef|grep redis
root     21739     1  0 14:28 ?        00:00:00 redis-server *:6379    # redis服务端进程
root     22007 21982  0 14:33 pts/0    00:00:00 redis-cli -h 127.0.0.1 -p 6379  # redis客户端进程
root     22143 22121  0 14:35 pts/2    00:00:00 grep --color=auto redis
[root@xxx ~]# 
```



redis支持许多客户端同时建立连接，接下来我们就可以在业务系统中同时开启多个客户端去访问redis了。



---

<font color = "red">注意：本文接下来的笔记都基于Redis的版本7.2.1</font>

-------

## 四、基础知识-架构

Redis 支持**单机**、**主从**、**哨兵**、**集群**多种架构模式，本节来总结一下其中的区别。

### 1、单机架构

![单机架构](http://cdn.gydblog.com/images/middleware/redis-jg-1.png)



单机模式是最原始的模式，非常简单，就是安装运行一个Redis实例，然后业务项目调用即可。一些非常简单的应用，并非必须保证高可用的情况下完全可以使用该模式。

**优点**

- 成本低，只需要一个实例

- 部署简单

- 数据天然一致性（不需要数据同步）

  

**缺点**

- 可用性保证差，单节点有宕机的风险。
- 高性能受限，单机高性能受限于 CPU 的处理能力。

单机 Redis 能够承载的 QPS（每秒查询速率）取决于业务操作的复杂性。假如是简单的 key value 查询那性能就会很高，单机能支持10W+的QPS。如果是Lua 脚本，则性能会差。

但是在单机架构下，系统的最大瓶颈就出现在 Redis 单机问题上，此时我们可以通过将架构演化为**主从架构**解决该问题。



### 2、主从架构

我们可以部署多个 Redis 实例，单机架构模型就演变成了下面这样：

![主从架构](http://cdn.gydblog.com/images/middleware/redis-jg-2.png)

我们把同时接收读/写操作的节点称为Master(主节点), 接收读操作和数据同步的节点称为Slave(从节点)。

只要主从节点之间的网络连接正常，主节点就会将写入自己的数据同步更新给从节点，从而保证主从节点的数据一致性。

主从架构比较适合读高并发场景。

主从架构存在的问题是：当主节点宕机，需要在众多从节点中选一个作为新的主节点，同时需要修改客户端保存的主节点信息并重启客户端，还需要通知所有的从节点去复制新的主节点数据，从而保证服务的高可用性。整个切换过程需要人工干预，而这个过程很明显会造成服务的短暂不可用。

**优点**

- 方便水平扩展

  当QPS 增加时，增加 从节点 即可

- 降低了主节点的读压力，分摊给了从节点

- 主节点宕机时，从节点可以顶上

**缺点**

- 主从切换过程需要人工干预

- 主节点写压力大

- 可靠性不高

  一旦主节点挂掉，在人工做主从切换过程中，对外失去了写的能力

- 主节点的写能力受到单机的限制；

- 主节点的存储能力受到单机的限制。

- 数据大量冗余

  每个从节点都有一份完整数据



### 3、哨兵架构

哨兵架构主要解决了主从架构中存在的高可用性问题，在**主从架构的基础**上，哨兵架构实现了**自动化故障检测和恢复机制**，全过程无需人工干预。

>  Redis 2.8 版本开始，引入哨兵（Sentinel）这个概念

![哨兵架构](http://cdn.gydblog.com/images/middleware/redis-jg-3.png)

如上图所示，哨兵架构由两部分集群组成，哨兵节点集群和数据节点集群：

- 哨兵节点集群

  该集群中的节点不存储数据，是特殊的redis节点，主要完成监控、提醒、自动故障转移这三大功能。

  1）监控(Monitoring)：哨兵节点会不断地发送ping消息检测数据节点是否正常；

  2）提醒(Notification)：当监控到某个数据节点有问题时， 哨兵可以通过 API 向管理员或者其他应用程序发送通知

  3）自动故障迁移(Automatic failover)：当一个主数据节点不能正常工作时， 哨兵会开始一次自动故障迁移操作，将该主节点下线，选举一个从数据节点升级为主节点（这里也就是将主从架构中的人工干预过程自动化）

- 数据节点集群

  该集群中的节点分为主从模式，都存储业务数据，这块其实就是之前的主从架构模式部分

**哨兵模式工作原理**

1. 每个 哨兵节点以每秒一次的频率向它所监控的主数据节点，从数据节点以及哨兵集群中的其他 哨兵节点发送一个 `PING` 命令；
2. 如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过配置文件 `own-after-milliseconds` 选项所指定的值，则这个实例会被 该哨兵节点标记为**主观下线**； 
3. 如果一个 主数据节点被标记为主观下线，那么正在监视这个 主数据节点的所有 哨兵要以每秒一次的频率确认 该主数据节点是否真的进入主观下线状态；
4. 当有**足够数量的 哨兵节点**（大于等于配置文件指定的值）在**指定的时间范围内确认** 该主数据节点确实进入了主观下线状态，则 该主数据节点会被标记为**客观下线**ODOWN ；
5. 如果 该主数据节点处于 **ODOWN 状态**，则投票自动选出新的主节点。将剩余的从节点指向新的主节点继续进行数据复制；
6. 在正常情况下，每个 哨兵会以每 10 秒一次的频率向它已知的所有 主、从数据节点发送 `INFO` 命令；当 主节点被 哨兵标记为客观下线时，哨兵向已下线的 主节点的所有 从节点发送 INFO 命令的频率会从 10 秒一次改为每秒一次； 
7. 若没有足够数量的 哨兵认为 主节点客观下线，主节点的客观下线状态就会被移除。若 主节点重新向 哨兵的 PING 命令返回有效回复，主节点的主观下线状态就会被移除

**优点**

- 主从实现了发生故障时自动切换，无需人工干预，大大增强系统可用性
- 哨兵实时监控数据节点状态，发现问题可以通过API立即通知到管理员或者其它应用程序。
- 哨兵模式是基于主从模式的，所有主从的优点，哨兵模式都有

**缺点**

- 部署成本高，需要单独维护一套哨兵集群
- 依旧没有解决主数据节点的写压力，主节点写的能力和存储能力依旧受限单机限制
- 动态扩容变得更加复杂

### 4、集群架构

集群架构可以说是Redis的王炸方案了！一经推出，便深得广大开发者喜爱。

> Redis 3.0 版本正式推出 **Redis Cluster 集群**模式，有效地解决了 Redis 分布式方面的需求。Redis Cluster 集群模式具有**高可用**、**可扩展性**、**分布式**、**容错**等特性。

![集群架构](http://cdn.gydblog.com/images/middleware/redis-jg-4.png)

如上图所示，该集群架构中包含 6 个 Redis 节点，3 主 3 从，分别为 M1，M2，M3，S1，S2，S3。除了主从 Redis 节点之间进行数据复制外，所有 Redis 节点之间采用 Gossip 协议进行通信，交换维护节点元数据信息。

客户端读请求分配给 Slave 节点，写请求分配给 Master，数据同步从 Master 到 Slave 节点。读写能力都可以快速进行横向扩展！！！

如上图所示，Redis的集群模式采用的是无中心多节点结构，节点数量至少为 6 个才能保证组成完整高可用的集群，其中三个为主节点，三个为从节点。三个主节点会分配槽，处理客户端的命令请求，而从节点可用在主节点故障后，顶替主节点。**每个节点都可以保存部分数据**和整个集群状态，每个节点都和其他所有节点连接。 



**分片**

　单机、主从、哨兵的架构中每个数据节点都存储了全量的数据，从节点进行数据的复制。然而单个节点存储能力受限于机器资源，是存在上限的，集群模式就是把数据进行**分片**存储，当一个分片数据达到上限的时候，还可以分成多个分片。

Redis Cluster 采用**虚拟哈希槽分区**，所有的键根据哈希函数映射到 0 ~ 16383 整数槽内，计算公式：`HASH_SLOT = CRC16(key) % 16384`。每一个节点负责维护一部分槽以及槽所映射的键值数据。

![分片策略](http://cdn.gydblog.com/images/middleware/redis-jg-5.png)



槽是 Redis Cluster 管理数据的基本单位，集群扩缩容其实就是槽和数据在节点之间的移动。

假如，这里有 3 个节点的集群环境如下：

- 节点 A 哈希槽范围为 0 ~ 5500；
- 节点 B 哈希槽范围为 5501 ~ 11000；
- 节点 C 哈希槽范围为 11001 ~ 16383。

此时，我们如果要存储数据，按照 Redis Cluster 哈希槽的算法，假设结果是： CRC16(key) % 16384 = 3200。 那么就会把这个 key 的存储分配到 A节点。此时连接 A、B、C 任何一个节点获取 key，都会这样计算，最终是通过 A节点获取数据。

假如这时我们新增一个节点 D，Redis Cluster 会从各个节点中拿取一部分 Slot 到 D 上，比如会变成这样：

- 节点 A 哈希槽范围为 1266 ~ 5500；
- 节点 B 哈希槽范围为 6827 ~ 11000；
- 节点 C 哈希槽范围为 12288 ~ 16383；
- 节点 D 哈希槽范围为 0 ~ 1265，5501 ~ 6826，11001 ~ 12287

　　这种特性允许在集群中轻松地添加和删除节点。同样的如果我想删除节点 D，只需要将节点 D 的哈希槽移动到其他节点，当节点是空时，便可完全将它从集群中移除。



**主从切换**

Redis Cluster 为了保证数据的高可用性，加入了主从模式，**一个主节点对应一个或多个从节点**，主节点提供数据存取，从节点复制主节点数据备份，当这个主节点挂掉后，就会通过这个主节点的从节点选取一个来充当主节点，从而保证集群的高可用。

　　回到前面分片的例子中，集群有 A、B、C 三个主节点，如果这 3 个节点都没有对应的从节点，如果 B 挂掉了，则集群将无法继续，因为我们不再有办法为 5501 ~ 11000 范围内的哈希槽提供服务。

　　所以我们在创建集群的时候，一定要为每个主节点都添加对应的从节点。比如，集群包含主节点 A、B、C，以及从节点 A1、B1、C1，那么即使 B 挂掉系统也可以继续正确工作。

　　因为 B1 节点属于 B 节点的子节点，所以 Redis 集群将会选择 B1 节点作为新的主节点，集群将会继续正确地提供服务。当 B 重新开启后，它就会变成 B1 的从节点。但是请注意，如果节点 B 和 B1 同时挂掉，Redis Cluster 就无法继续正确地提供服务了。



---

以上几种架构模式，每种都有各自的优缺点，在实际场景中要根据业务特点去选择合适的模式使用。

## 五、基础知识-模块组成

![主要模块划分](http://cdn.gydblog.com/images/middleware/redis-jg-6.jpg)

### 1、网络访问框架

​    通过网络框架以 Socket 通信的形式对外提供键值对操作，包括socket服务和协议解析。客户端发送命令时，命令会被封装成网络请求传输给redis。

### 2、操作模块

主要对各种数据进行操作，如get 、put 、delete 、scan操作等。

### 3、索引模块

索引模块主要目的是为了通过key值快速定位value值，从而进行操作。 redis使用的索引模块为哈希表。redis存储内存的高性能随机访问特性可以很好地与哈希表 O(1) 的操作复杂度相匹配。



### 4、存储模块

主要完成保存数据的工作，存储数据模型为 key-value形式，value支持丰富的数据类型。包括字符串，列表 ，哈希表，集合等。不同的数据类型能支持不同的业务需求。

其中的持久化模块主要对数据进行持久化，当系统重启时，能够快速恢复服务。redis的持久化策略分为：日志（AOF）和快照（RDB）两种方式。



### 5、高可用模块

主从复制：主从架构中用到（一个Master至少一个slave），master -> slave 数据复制 

哨兵：主从架构实现高可用（一个Master至少一个slave），在master故障的时候，快速将slave切换成master，实现快速的灾难恢复，实现高可用性；



### 6、高扩展模块

Redis Cluster（分片集群）是Redis提供的分布式高可扩展解决方案。

切片集群，也叫分片集群（集群分片），就是指启动多个 Redis 实例组成一个集群，然后按照一定的规则，把收到的数据划分成多份，每一份用一个实例来保存。

### 7、其它模块

还有一些其他模块，例如：数据压缩、过期机制、数据淘汰策略、主从复制、集群化、高可用等功能，另外还可以增加统计模块、通知模块、调试模块、元数据查询等辅助功能。



## 六、基础知识-请求执行流程

### 1、概述

一个redis命令请求从用户端发起到获得结果的过程中，redis客户端和服务器端都需要完成一系列操作。

比如发送一个set命令：

> set key value

这个过程中经历了如下的几个处理阶段：

1）客户端发送命令请求

2）服务器端读取命令请求

3）服务器端执行命令

4）服务器端将命令回复发送回客户端

5）客户端接收并打印命令回复



整体流程图如下：

![请求执行流程](http://cdn.gydblog.com/images/middleware/redis-jg-11.png)

下面小郭将针对图中的每个处理阶段展开说一说细节。



### 2、客户端发送命令请求

当用户在客户端中键入一个命令请求时， 客户端会将这个命令请求转换成约定的协议格式， 然后通过连接到服务器的套接字， 将协议格式的命令请求发送给服务器。

![](http://cdn.gydblog.com/images/middleware/redis-jg-7.jpg)



### 3、服务器端读取命令请求

当客户端与服务器之间的连接套接字因为客户端的写入而变得可读时， 服务器将调用命令请求处理器来执行以下操作：

1）读取套接字中协议格式的命令请求，并将其保存到客户端状态的输入缓冲区里面。

2）对输入缓冲区中的命令请求进行分析，提取出命令请求中包含的命令参数，以及命令参数的个数，然后分别将参数和参数个数保存到客户端状态的argv属性和argc属性里面。

3）调用命令执行处理器，执行客户端指定的命令。



### 4、服务器端执行命令

**1）命令执行器：查找命令实现**

命令执行器根据客户端状态的argv[0]参数，在命令表（command table）中查找参数所指定的命令，并将找到的命令保存到客户端状态的cmd属性里面。

命令表是一个字典，字典的键是一个个命令名字，比如"set"、"get"、"del"等等。而字典的值则是一个个redisCommand结构，每个redisCommand结构记录了一个Redis命令的实现信息。

需要注意的是**命令名字的大小写不影响命令表的查找结果**:

因为命令表使用的是大小写无关的查找算法， 无论输入的命令名字是大写、小写或者混合大小写， 只要命令的名字是正确的， 就能找到相应的 redisCommand 结构。

比如说， 无论用户输入的命令名字是 "SET" 、 "set" 、 "SeT" 又或者 "sEt" ， 命令表返回的都是同一个 redisCommand 结构。下面是redisCommand结构 的属性描述：

| 属性名       | 类型               | 作用                                                         |
| ------------ | ------------------ | ------------------------------------------------------------ |
| name         | char *             | 保存命令的名字，比如“set”                                    |
| proc         | redisCommandProc * | 函数指针，指向命令的具体实现函数，比如setCommand。redisCommandProc类型的定义为typedef void redisCommandProc(redisClient *c); |
| arity        | int                | 命令参数的个数，用于检查命令请求的格式是否正确。如果这个值为-N，那么表示参数的数量大于等于N。注意命令的名字本身也是一个参数，比如说SET msg "hello world"命令的参数分别是"SET"、"msg"、"hello world"。而不仅仅是"msg"和"hello world" |
| sflags       | char *             | 字符串形式的标识值，这个值记录了命令的属性，比如这个命令是写命令还是读命令，这个命令是否允许在载入数据时使用，这个命令是否允许在Lua脚本中使用等等含义。接下来的表格有详细说明 |
| flags        | int                | 对sflags标识进行分析得出的二进制标识，由程序自动生成。服务器对命令标识进行检查时使用的都是flags属性而不是sflags属性，因为对二进制标识的检查可以方便地通过&、^、~等操作来完成 |
| calls        | long long          | 服务器总共执行了多少次这个命令                               |
| milliseconds | long long          | 服务器执行这个命令所耗费的总时长                             |



| sflags标识 | 含义                                                         | 带有这个标识的命令                        |
| ---------- | ------------------------------------------------------------ | ----------------------------------------- |
| w          | 这是一个写入命令，可能会修改数据库                           | SET、RPUSH、DEL等等                       |
| r          | 这是一个只读命令，不会修改数据库                             | GET、STRLEN、EXISTS等等                   |
| m          | 这个命令可能会占用大量内存，执行之前需要先检查服务器的内存使用情况，如果内存紧缺的话就可以禁止执行这个命令 | SET、APPEND、RPUSH、LPUSH、SADD等等       |
| a          | 这是一个管理命令                                             | SAVE、BGSAVE、SHUTDOWN等等                |
| P          | 这是一个发布与订阅功能方面的命令                             | PUBLISH、SUBSCRIBE、PUBSUB等等            |
| s          | 这个命令不可以在Lua脚本中使用                                | BRPOP、BLPOP、BRPOPLPUSH、SPOP等等        |
| R          | 这是一个随机命令，对于相同的数据集和相同的参数，命令返回的结果可能不同 | SPOP、SRANDMEMBER、SSCAN、RANDOMKEY等等   |
| S          | 当在Lua脚本中执行这个命令时，对这个命令的输出结果进行一次排序，使得命令的结果有序 | SINTER、SUNION、SDIFF、SMEMBERS、KEYS等等 |
| l          | 这个命令可以在服务器载入数据的过程中使用                     | INFO、SHUTDOWN、PUBLISH等等               |
| t          | 这是一个允许从服务器在带有过期数据时使用的命令               | SLAVEOF、PING、INFO等等                   |
| M          | 这个命令在监视器(monitor)模式下不会自动被传播(propagate)     | EXEC                                      |



**举个栗子：**

GET命令的名字为"get"，实现函数为getCommand函数；命令的参数个数为2，表示命令只接受两个参数；命令的标识为"r"，表示这是一个只读命令。

SET命令的名字为"set"，实现函数为setCommand；命令的参数个数为-3，表示命令接受三个或以上数量的参数；命令的标识为"wm"，表示SET命令是一个写入命令，并且在执行这个命令之前，服务器应该对占用内存状况进行检查，因为这个命令可能会占用大量内存。

![命令表结构示例](http://cdn.gydblog.com/images/middleware/redis-jg-8.png)



**2）命令执行器：执行校验**

经过之前的阶段， 服务器端已经将执行请求命令所需的参数（保存在客户端状态的 argv 属性）、参数个数（保存在客户端状态的 argc 属性）、命令实现函数（保存在客户端状态的 cmd 属性）都解析齐了， 但是在真正执行命令之前， 还需要进行一些预备操作， 从而确保命令可以正确、顺利地被执行， 这些主要操作包括： 

- 命令校验

  检查客户端状态的cmd指针是否指向NULL。如果是的话， 那么说明用户输入的命令名字找不到相应的命令实现， 服务器不再执行后续步骤， 并向客户端返回一个错误。

- 参数校验

  根据客户端cmd属性指向的redisCommand结构的arity属性，检查命令请求所给定的参数个数是否正确。当参数个数不正确时， 不再执行后续步骤， 直接向客户端返回一个错误。 比如说， 如果 `redisCommand` 结构的 `arity` 属性的值为 `-3` ， 那么用户输入的命令参数个数必须大于等于 `3` 个才行。

- 权限校验

  检查客户端是否已经通过了身份验证，未通过身份验证的客户端只能执行AUTH命令。如果未通过身份验证的客户端试图执行除 AUTH 命令之外的其他命令， 那么服务器将向客户端返回一个错误。

- 内存检测

  如果服务器打开了maxmemory功能，那么在执行命令之前，先检查服务器的内存占用情况，并在有需要时进行内存回收，从而使得接下来的命令可以顺利执行。 如果内存回收失败， 那么不再执行后续步骤， 向客户端返回一个错误。

- 其它校验

  Redis设计者是非常严谨的，每个环节都考虑的非常齐全，执行命令前还校验了许多方面，例如: 

  1) 如果服务器上一次执行 BGSAVE 命令时出错， 并且服务器打开了 stop-writes-on-bgsave-error 功能， 而且服务器即将要执行的命令是一个写命令， 那么服务器将拒绝执行这个命令， 并向客户端返回一个错误。
  2) 如果客户端当前正在用 SUBSCRIBE 命令订阅频道， 或者正在用 PSUBSCRIBE 命令订阅模式， 那么服务器只会执行客户端发来的 SUBSCRIBE 、 PSUBSCRIBE 、 UNSUBSCRIBE 、 PUNSUBSCRIBE 四个命令， 其他别的命令都会被服务器拒绝。
  3) 如果服务器正在进行数据载入， 那么客户端发送的命令必须带有 l 标识（比如 INFO 、 SHUTDOWN 、 PUBLISH ，等等）才会被服务器执行， 其他别的命令都会被服务器拒绝。
  4) 如果服务器因为执行 Lua 脚本而超时并进入阻塞状态， 那么服务器只会执行客户端发来的 SHUTDOWN nosave 命令和 SCRIPT KILL 命令， 其他别的命令都会被服务器拒绝。
  5) 如果客户端正在执行事务， 那么服务器只会执行客户端发来的 EXEC 、 DISCARD 、 MULTI 、 WATCH 四个命令， 其他命令都会被放进事务队列中。
  6) 如果服务器打开了监视器功能， 那么服务器会将要执行的命令和参数等信息发送给监视器。 

只有当通过了上面的所有校验，命令才会真正的开始执行。

**3）命令执行器：调用命令实现函数**

经过前面的步骤，服务器将要执行命令的实现保存到了客户端状态的cmd属性里面，并将命令的参数和参数个数分别保存到了客户端状态的argv属性和argv属性里面，当服务器执行命令时，只需要一个指向客户端状态的指针作为参数，调用实际执行函数。如下图所示: 

![调用命令实现函数](http://cdn.gydblog.com/images/middleware/redis-jg-9.png)

*命令实现函数内部会执行指定的操作，并产生相应的命令回复，这些回复会被保存在客户端状态的输出缓冲区里面（buf属性和reply属性），之后实现函数还会为客户端的套接字关联命令回复处理器，这个处理器负责将命令回复返回给客户端。*



**4）命令执行器：执行收尾工作**

如在Redis.config里面有相关配置，则后续操作包含：慢日志记录、redisCommand结构属性更新、AOF持久化记录、主从复制命令传播等。

- **慢日志记录**：如果服务器开启了慢查询日志功能， 那么慢查询日志模块会检查是否需要为刚刚执行完的命令请求添加一条新的慢查询日志。
- **redisCommand结构属性更新**：根据刚刚执行命令所耗费的时长， 更新被执行命令的 redisCommand 结构的 milliseconds 属性， 并将命令的 redisCommand 结构的 calls 计数器的值增一。
- **AOF持久化记录**：如果服务器开启了 AOF 持久化功能， 那么 AOF 持久化模块会将刚刚执行的命令请求写入到 AOF 缓冲区里面。
- **主从复制命令传播**：如果有其他从服务器正在复制当前这个服务器， 那么服务器会将刚刚执行的命令传播给所有从服务器。

当以上操作都执行完了之后， 服务器对于当前命令的执行到此就告一段落了， 之后服务器就可以继续从文件事件处理器中取出并处理下一个命令请求了。



### 5、服务器端将命令回复发送回客户端

命令实现函数执行完成后会将命令回复保存到客户端的输出缓冲区里面， 并为客户端的套接字关联命令回复处理器， 当客户端套接字变为可写状态时， 服务器就会执行命令回复处理器， 将保存在客户端输出缓冲区中的命令回复发送给客户端。

当命令回复发送完毕之后， 回复处理器会清空客户端状态的输出缓冲区， 为处理下一个命令请求做好准备。 



### 6、客户端接收并打印命令回复

当客户端接收到协议格式的命令回复之后， 它会将这些回复转换成人类可读的格式， 并打印给用户观看（Redis 自带的 客户端和开源的客户端都需要遵循redis的协议格式进行转换）

![](http://cdn.gydblog.com/images/middleware/redis-jg-10.png)



以上就是 Redis 客户端和服务器执行命令请求的整个过程了。

## 七、基础知识-配置文件解读

### 1）概述

Redis7 有很多新的功能、bug修改、特性优化，因此也伴随着很多新配置和变化，本小节进行配置项的逐一说明

> Redis 7.0 以后新增了近 50 个新命令，但是目前大部分企业还没有或者不敢用上最新版本

在redis中，配置文件主要有普通配置文件、sentinel配置文件和cluster-node配置文件。我们重点关注普通配置文件。

普通配置文件中的配置按模块进行了划分，主要模块清单如下：

| 配置模块                                 | 说明                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| INCLUDES                                 | 主要用于引入额外的配置文件                                   |
| MODULES                                  | 可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令 |
| NETWORK                                  | 网络连接相关的配置模块                                       |
| TLS/SSL                                  | 数据连接加密配置                                             |
| GENERAL                                  | 通用的配置模块                                               |
| SNAPSHOTTING                             | rdb持久化配置模块                                            |
| REPLICATION                              | 主从配置模块                                                 |
| KEYS TRACKING                            | 客户端缓存密钥追踪管理                                       |
| SECURITY                                 | 安全配置模块                                                 |
| CLIENTS                                  | 客户端相关配置，比较重要，建议熟记！！！                     |
| MEMORY MANAGEMENT                        | 内存管理配置模块                                             |
| LAZY FREEING                             | 异步策略管理                                                 |
| THREADED I/O                             | 线程I/O管理 (了解)                                           |
| KERNEL OOM CONTROL                       | 可以提示内核OOM killer在OOM发生时应该首先终止哪些进程        |
| KERNEL transparent hugepage CONTROL      | 操作系统内存大页（THP）管理                                  |
| APPEND ONLY MODE                         | aof持久化配置模块                                            |
| SHUTDOWN                                 | 关闭操作管理                                                 |
| NON-DETERMINISTIC LONG BLOCKING COMMANDS | 非确定性长阻塞命令                                           |
| REDIS CLUSTER                            | cluster集群模式配置模块                                      |
| CLUSTER DOCKER/NAT support               | 关于NAT网络或者Docker的支持                                  |
| SLOW LOG                                 | 慢日志配置模块                                               |
| LATENCY MONITOR                          | 延迟监控配置模块                                             |
| LATENCY TRACKING                         | 延迟信息追踪配置                                             |
| EVENT NOTIFICATION                       | 事件通知管理                                                 |
| ADVANCED CONFIG                          | 高级配置模块                                                 |
| ACTIVE DEFRAGMENTATION                   | 活动碎片整理                                                 |

​	

### 2）INCLUDES
作用：引入额外的配置文件。

这个在有标准配置模板但是每个redis服务器又需要个性设置的时候很有用。等同import导入

使用示例：

```
# include /path/to/local.conf
# include /path/to/other.conf
# include /path/to/fragments/*.conf
```

说明：如果在一台服务器上有多台redis实例，则可以将一些公共的配置抽取出来，在具体的redis实例的配置文件是使用include引入即可让这些配置生效。
注意：redis支持配置更新，比如在client端通过CONFIG REWRITE或者sentinel模式下来修改配置。但是无论用哪一种方式都无法对include配置进行覆盖。比如在client端执行：config rewrite include .\new_shared.conf，server端会抛出异常提示。



### 3）MODULES

作用：可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令

使用示例: 

```
# loadmodule /path/to/my_module.so
# loadmodule /path/to/other_module.so
```

### 4）NETWORK

作用：对网络相关的配置，如绑定网卡bind、端口监听、连接超时等设置

使用示例：

```
// bind参数表示绑定主机的哪个网卡，比如本机有两个网卡分别对应ip 1.1.1.1 ,2.2.2.2，配置bind 1.1.1.1，
// 则客户端288.30.3.3访问2.2.2.2将无法连接redis。
// 如果不配置bind，redis将监听本机所有可用的网络接口。也就是说redis.conf配置文件中没有bind配置项，redis可以接受来自任意一个网卡的Redis请求
//如下示例表示绑定本机的两个ipv4网卡地址
# bind 192.168.1.100 10.0.0.1  
//如下示例表示所有连接都可以连接上
# bind 0:0:0:0 
//如下示例表示绑定到本机的ipv6
# bind 127.0.0.1::1 
//如下示例表示绑定到本机
# bind 127.0.0.1 


//默认情况下，传出连接（从副本到主机、从Sentinel到实例、集群总线等）不绑定到特定的本地地址。在大多数情况下，这意味着操作系统将
//根据路由和连接所通过的接口来处理。使用bind source addr可以配置要绑定到的特定地址，这也可能会影响连接的路由方式，默认未启用。
# bind-source-addr 10.0.0.1

// 是否开启保护模式。如配置里没有指定bind和密码。开启该参数后，redis只允许本地访问，拒绝外部访问
// 要是开启了密码和bind，可以开启。否则最好关闭，设置为no。
protected-mode yes

# Redis监听端口号，默认为6379，如果指定0端口，表示Redis不监听TCP连接
port 6379

// tcp keepalive参数是表示空闲连接保持活动的时长。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值
//  使用keepalive有两个好处:
//  1) 检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经发生与对端端口的问题。
//  2) 在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需两倍的设置值
tcp-keepalive 300

 
// tcp-backlog参数用于在linux系统中控制tcp三次握手已完成连接队列的长度。
//在高并发系统中，通常需要设置一个较高的tcp-backlog来避免客户端连接速度慢的问题（三次握手的速度）。
//已完成连接队列的长度也与操作系统中somaxconn有关，取二者最小min(tcp-backlog,somaxconn)
//linux查看已完成连接队列的长度:$ /proc/sys/net/core/somaxconn
tcp-backlog 511
 
//连接超时时间，单位秒；超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0
timeout 0
```



### 5）TLS/SSL

作用： 数据连接加密配置     

从版本6开始，Redis支持TLS/SSL，这是一项需要在编译时启用的可选功能。可以在编译redis源码的时候使用如下命令启用：

```
make BUILD_TLS=yes
```

使用示例：

```
//从版本6开始，Redis支持TLS/SSL，这是一项需要在编译时启用的可选功能。
//可以在编译redis源码的时候使用如下命令启用：make BUILD_TLS=yes
 

//tls-port配置指令允许在指定的端口上接受TLS/SSL连接
//示例：只接受TLS端口tls-port，禁用非TLS端口port
port 0
tls-port 6379


//配置X.509证书和私钥。此外，在验证证书时，需要指定用作受信任根的CA证书捆绑文件或路径。为了支持基于DH的密码，还可以配置DH参数文件。例如：
//tls-cert-file 用于指定redis服务端证书文件,tls-key-file 用于指定redis服务端私钥文件 ,tls-key-file-pass用于配置服务端私钥密码(如果需要)
#tls-cert-file /path/to/redis.crt
#tls-key-file /path/to/redis.key
# tls-key-file-pass secret
//tls-client-cert-file 用于指定redis客户端证书文件,tls-client-key-file 用于指定redi客户端私钥文件 ,tls-client-key-file-pass配置客户端私钥密码（如果有）
# tls-client-cert-file /path/to/redis.crt
# tls-client-key-file /path/to/redis.key
# tls-client-key-file-pass secret

//tls-dh-params-file配置DH参数文件以启用Diffie-Hellman（DH）密钥交换,旧版本的OpenSSL（<3.0）需要配置该项,较新的版本不需要此配置。
# tls-dh-params-file /path/to/redis.dh

//配置CA证书捆绑包或目录以对TLSSSL客户端和对等方进行身份验证。Redis需要至少一个显式配置，并且不会隐式使用系统范围的配置。
# tls-ca-cert-file ca.crt
# tls-ca-cert-dir /etc/ssl/certs

//默认情况下，TLS端口上的客户端（包括副本服务器）需要使用有效的客户端证书进行身份验证。
//如果tls-auth-clients指定“no”，则不需要也不接受客户端证书。如果tls-auth-clients指定了“optional”，则接受客户端证书，并且如果提供了客户端证书，则客户端证书必须有效，但不是必需的。
# tls-auth-clients no
# tls-auth-clients optional

//默认情况下，Redis复制副本不会尝试与其主机建立TLS连接，tls-replication指定为‘yes’表示在主从复制链接上启用TLS。
# tls-replication yes

//默认情况下，Redis Cluster总线使用纯TCP连接。要为总线协议启用TLS，可以将tls-cluster配置为yes
# tls-cluster yes

//默认情况下，仅启用TLSv1.2和TLSv1.3，强烈建议禁用正式弃用的旧版本，以减少攻击面。可以通过tls-protocols明确指定要支持的TLS版本。允许的值不区分大小写，包括“TLSv1”、“TLSv1.1”、“TL Sv1.2”、“T Sv1.3”（OpenSSL>=1.1.1.1）或任何组合。
//示例；
//启用TLSv1.2和TLSv1.3
# tls-protocols "TLSv1.2 TLSv1.3"

//配置允许的密码，tls-ciphers仅在tls版本<=TLSv1.2时生效
# tls-ciphers DEFAULT:!MEDIUM

//配置允许的TLSv1.3密码套件
# tls-ciphersuites TLS_CHACHA20_POLY1305_SHA256

//选择密码时，请使用服务器的首选项，而不是客户端的首选项。默认情况下，tls-prefer-server-ciphers配置为‘yes’表示服务器遵循客户端的首选项。
# tls-prefer-server-ciphers yes

//默认情况下，启用TLS会话缓存以允许支持它的客户端更快、更便宜地重新连接。使用以下指令禁用缓存
# tls-session-caching no

//更改缓存的TLS会话的默认数量。零值将缓存设置为无限制大小。默认大小为20480。
# tls-session-cache-size 5000

//更改缓存TLS会话的默认超时。默认超时为300秒。
# tls-session-cache-timeout 60


/**
以TLS模式手动运行Redis服务器（假设示例证书/密钥是可用的）：
./src/redis-server --tls-port 6379 --port 0 \
    --tls-cert-file ./tests/tls/redis.crt \
    --tls-key-file ./tests/tls/redis.key \
    --tls-ca-cert-file ./tests/tls/ca.crt
    
使用redis-cli连接到此Redis服务器：
./src/redis-cli --tls \
    --cert ./tests/tls/redis.crt \
    --key ./tests/tls/redis.key \
    --cacert ./tests/tls/ca.crt
*/
```



### 6）GENERAL

作用：一些通用的配置

使用示例：

```

//默认情况下，Redis不作为守护进程运行（老版本默认）。如果需要可以修改daemonize为‘yes’
//注意，Redis在守护进程时会在var/run/redis.pid中写入一个pid文件。当Redis被upstart或systemd监管时，这个参数没有影响。
daemonize no
 
//当Redis以上述守护进程方式运行时，Redis默认会把进程文件写入/var/run/redis_6379.pid文件
pidfile /var/run/redis_6379.pid


 
//指定日志记录级别，四个级别：
//1) debug：很多信息，方便开发、测试
//2) verbose：许多有用的信息，但是没有debug级别信息多
//3) notice：适当的日志级别，适合生产环境（默认）
//4) warning：只记录非常重要/关键的消息
//5）nothing：什么都不记录
loglevel notice
 
  
//指定日志文件记录的位置。logfile “”：标准输出。则日志将会发送给/dev/null
logfile “”  

//要启用对系统记录器的日志记录，只需将“syslog enabled”设置为yes，并根据需要更新其他syslog参数即可。
# syslog-enabled no
//系统日志标识
# syslog-ident redis
//指定系统日志功能。必须是USER或介于LOCAL0-LOCAL7之间。
# syslog-facility local0
 
//禁用内置的崩溃日志记录
# crash-log-enabled no
//禁用作为崩溃日志一部分运行的快速内存检查，这可能会让redis提前终止
# crash-memcheck-enabled no

//设置数据库的数量，默认数量是16，默认数据库是DB 0，客户端可以使用select＜dbid＞在每个连接的基础上选择不同的数据库，其中dbid是介于0和“databases”-1之间的数字
databases 16
 
//默认情况下，Redis只有在开始登录到标准输出时，以及如果标准输出是TTY并且syslog日志记录被禁用时，才会显示ASCII艺术徽标。基本上，这意味着通常只有在交互式会话中才会显示徽标。但是，通过将以下选项设置为yes，可以强制执行4.0之前的行为，并始终在启动日志中显示ASCII艺术徽标。
# always-show-logo no

//默认情况下，Redis会修改进程标题（如“top”和“ps”中所示）以提供一些运行时信息。通过将以下设置为否，可以禁用此功能并将进程名称保留为已执行状态。
#set-proc-title yes

//在更改流程标题时，Redis使用以下模板构建修改后的标题。模板变量用大括号指定。支持以下变量：
//｛title｝如果为父进程，则执行的进程的名称，或子进程的类型。
//｛listen-addr｝绑定地址或“”，然后是正在侦听的TCP或TLS端口，或者Unix套接字（如果只有可用的话）。
//｛server-mode｝特殊模式，即“[ssentinel]”或“[cluster]”。
//｛port｝TCP端口正在侦听，或0。
//｛tls-port｝tls端口正在侦听，或0。
//｛unixsocket｝Unix域套接字正在侦听，或“”。
//｛config file｝使用的配置文件的名称。
proc-title-template "{title} {listen-addr} {server-mode}"

//设置用于字符串比较操作的本地环境，会影响Lua脚本的性能。空字符串表示区域设置是从环境变量派生的。
locale-collate ""
```



### 7）SNAPSHOTTING

作用：RDB持久化配置

| 参数名                      | 默认值   | 含义                                                         |
| --------------------------- | -------- | ------------------------------------------------------------ |
| save                        | 900 1    | 服务器在900s内对数据库进行了了至少1次修改，BGSAVE命令就会被执行。 |
| save                        | 300 10   | 服务器在300s之内对数据库进行了至少10次修改，BGSAVE命令就会被执行。 |
| save                        | 60 10000 | 服务器在60s之内对数据库进行了至少10000次修改，BGSAVE命令就会被执行。 |
| stop-writes-on-bgsave-error | yes      | 在持久化过程成如果出现错误是否停止向redis写入数据。          |
| rdbcompression              | yes      | 是否在持久化的时候使用LZF方式压缩字符串对象。                |
| rdbchecksum                 | yes      | 在持久化的时候，是否进行文件的校验。如果进行文件校验将会付出10%的性能代价。 |
| dbfilename                  | dump.rdb | 持久化的文件名。                                             |
| rdb-del-sync-files          | no       | 在未启用持久性的实例中删除复制使用的RDB文件。默认情况下，此选项处于禁用状态。注意，此选项仅适用于同时禁用AOF和RDB持久性的实例，否则将被完全忽略。 |
| dir                         | ./       | 持久化的工作目录，AOF文件也会写在这里。                      |

使用示例：

```
//save将数据库保存到磁盘。
//save＜seconds＞＜changes＞〔＜seconds〕＜changes〕…〕如果经过给定的秒数，并且超过了对数据库的给定写入操作数，Redis将保存数据库。可以组合设置多种情况，如下面所示：
# save 3600 1 300 100 60 10000
//使用单个空字符串参数可以完全禁用保存，如下例所示：
# save ""

//在持久化过程成如果出现错误是否停止向redis写入数据。
stop-writes-on-bgsave-error yes

//是否在持久化的时候使用LZF方式压缩字符串对象。
rdbcompression yes

//由于在RDB的版本5中CRC64校验和被放置在文件的末尾。这使格式更不容易损坏，但在保存和加载RDB文件时会对性能造成影响（约10%），因此我们可以禁用它以获得最大性能。在禁用校验和的情况下创建的RDB文件的校验和为零，这将告诉加载代码跳过检查校验和。
rdbchecksum yes

//持久化文件名，默认dump.rdb
dbfilename dump.rdb


//在未启用持久性的实例中删除复制使用的RDB文件。默认情况下，此选项处于禁用状态。注意，此选项仅适用于同时禁用AOF和RDB持久性的实例，否则将被完全忽略。
rdb-del-sync-files no

//持久化的工作目录，AOF文件也会写在这里。
dir ./
```

​	 

### 8）REPLICATION

作用：主从配置



| 参数名                         | 默认值 | 含义                                                         |
| ------------------------------ | ------ | ------------------------------------------------------------ |
| replicaof masterip  masterport | 未启用 | 使当前的Redis实例成为另一个Redis服务器的从节点。             |
| slaveof masterip masterport    | 未启用 | 配置从服务器的主服务器地址, 保证从服务器重启之后仍然保持主从关系. |
| masterauth  master-password    | 未启用 | 从服务器复制主服务器时需要输入密码                           |
| masteruser  username           | 未启用 | 从服务器复制主服务器时需要输入用户名, 如果使用的是Redis ACL（适用于Redis版本6或更高版本），并且默认用户无法运行PSYNC命令和或复制所需的其他命令，则在这种情况下，最好配置一个特殊用户用于复制 |
| slave-serve-stale-data         | yes    | 在主从复制期间或者从服务器和主服务器失去连接时，从服务器充当两种角色：<br/><br/>如果设置为yes，表示从服务器在这期间仍然会回复客户端的请求，此时可能带有过期的数据，或者如果这是第一次同步，数据集可能只是空的。<br/><br/>如果设置为no，表示从服务器对客户端除了INFO和SLAVEOF命令外，其它的所有类型的命令都回复一个错误“SYNC with master in progress”。<br/> |
| slave-read-only                | yes    | 从服务器是否设置为只读。一主多从可以用作读写分离的场景，主提供写，从提供读。 |
| repl-ping-slave-period         | 10     | 从服务器发送ping给主服务器，如果在该参数指定的时间内没有收到pong，那么表示网络状态不好, 主服务器会断开连接. |
| repl-timeout                   | 60     | 当redis检测到repl-timeout超时(默认值60s)，将会关闭主从之间的连接,redis slave发起重新建立主从连接的请求。 |
| repl-disable-tcp-nodelay       | no     | SYNC是否禁用TCP_NODELAY机制，即TCP的粘包机制.                |
| repl-backlog-size              | 1mb    | 复制积压缓冲区的大小.                                        |
| repl-backlog-ttl               | 3600   | 复制积压缓冲区在主从服务器失去连接后多久后进行释放           |
| slave-priority                 | 100    | 从服务器被哨兵选未主服务器的优先级,优先级越低,表示越有可能选未主服务器 . 如果设置未0,表示该从服务器不能充当master |
| min-slaves-to-write            | 3      | 从服务器的数量小于3个,主服务器拒绝执行写命令.                |
| min-slaves-max-lag             | 10     | 三个从服务器的延迟都大于等于10s时,主服务器将拒绝执行写命令.  |

 使用示例：

```

//使当前的Redis实例成为另一个Redis服务器的从节点。 
# replicaof <masterip> <masterport>

//从服务器复制主服务器时需要输入密码(如果有)
# masterauth <master-password>

//如果使用的是Redis ACL（适用于Redis版本6或更高版本），并且默认用户无法运行PSYNC命令和或复制所需的其他命令，则在这种情况下，最好配置一个特殊用户用于复制
# masteruser <username>

//指定masteruser后，从节点将使用新的AUTH形式对其master进行身份验证：AUTH＜username＞＜password＞。当从节点失去与主节点的连接时，或者当复制仍在进行中时，从节点可以通过两种不同的方式进行操作：
//1）如果replica-serve-stale-data为“yes”（默认值），则从节点仍将应答客户端请求，可能使用过期的数据，或者如果这是第一次同步，则数据集可能只是空的。
//2） 如果replica-serve-stale-data为“no”，则从节点将对所有数据访问命令（不包括以下命令）回复错误“MASTERDOWN与MASTER的链接已断开
replica-serve-stale-data yes

//从节点是否只能接收客户端的读请求
replica-read-only yes
 
//是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。
//有2种方式：
//  1) disk：master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。
//  2) socket：master创建一个新的进程，直接把rdb文件以socket的方式发给slave。
// disk方式时，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。
// socket方式就得一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
repl-diskless-sync no
 
//如果是无硬盘传输，如果预期的最大副本数已连接，则可以在最大延时之前进行复制,在主服务器配置
//repl-diskless-sync-max-replicas <int> 默认 0 标识未定义
repl-diskless-sync-max-replicas 0

  
//diskless复制的延迟时间，防止设置为0。一旦复制开始节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来
repl-diskless-sync-delay 5
 
 
//警告：由于在此设置中，副本不会立即将RDB存储在磁盘上，因此在故障切换过程中可能会导致数据丢失。RDB无盘加载+Redis模块不处理IO读取可能会导致Redis在与主机的初始同步阶段出现IO错误时中止。
//从节点可以直接从套接字加载它从复制链接读取的RDB，或者将RDB存储到一个文件中，并在完全从主机接收到该文件后读取该文件。
//在许多情况下，磁盘比网络慢，存储和加载RDB文件可能会增加复制时间（甚至会增加主机的写时拷贝内存和副本缓冲区）。
//当直接从套接字解析RDB文件时，为了避免数据丢失，只有当新数据集完全加载到内存中时，才可以安全地刷新当前数据集，从而导致更高的内存使用率，针对这些问题提供了下面的几个方案：
//disable：不使用 无硬盘方案
//on-empty-db：只有在完全安全才使用无硬盘
//swapdb：在解析socket的rdb数据时，将当前数据库的数据放到内存中，这样可以在复制的时候为客户端提供服务，但是可能会造成内存溢出
//我们可以通过配置项repl-diskless-load来修改，默认是disable
repl-diskless-load disabled
 
//Master在预定义的时间间隔内向其副本发送PING。可以使用repl_ping_replica_period选项更改此间隔。默认值为10秒。
# repl-ping-replica-period 10

//设置主从之间的超时时间，这里的超时有多种含义：
//1）从从节点的角度来看，SYNC期间的大容量传输IO。
//2）从从节点（数据、ping）的角度来看，主机超时。
//3）从主机的角度来看，从节点超时（REPLCONF ACK ping）。
//重要的是要确保此值大于为从节点周期指定的值，否则每次主机和从节点之间的流量较低时都会检测到超时。默认值为60秒。
# repl-timeout 60


//是否禁止复制tcp链接的tcp nodelay参数，默认是no，即使用tcp nodelay。
//如master设置了yes，在把数据复制给slave时，会减少包的数量和更小的网络带宽。但这可能会增加数据在slave端出现的延迟，对于使用默认配置的Linux内核，延迟时间可达40毫秒
//如master设置了no，数据出现在slave端的延迟将减少，但复制将使用更多带宽。
//默认我们推荐更小的延迟，但在数据量传输很大的场景下，或者当主服务器和副本相距许多跳时，建议选择yes。
repl-disable-tcp-nodelay no


//repl-backlog-size设置复制缓冲区大小。backlog是一个缓冲区，这是一个环形复制缓冲区，用来保存最新复制的命令。当副本断开连接一段时间时，它会累积副本数据，因此当副本想要再次连接时，通常不需要完全重新同步，但部分重新同步就足够了，只需传递副本在断开连接时丢失的部分数据。复制缓冲区越大，复制副本能够承受断开连接的时间就越长，以后能够执行部分重新同步。只有在至少连接了一个复制副本的情况下，才会分配缓冲区，没有复制副本的一段时间，内存会被释放出来，默认1mb。
# repl-backlog-size 1mb

//在一段时间内主机没有连接的副本后，复制缓冲区backlog的占用内存将被释放，repl-backlog-ttl设置该时间长度。单位为秒，值为0意味着永远不会释放该缓冲区！
# repl-backlog-ttl 3600

//副本优先级是Redis在INFO输出中发布的一个整数。Redis Sentinel使用它来选择复制副本，以便在主副本无法正常工作时将其升级为主副本。优先级较低的副本被认为更适合升级。
//例如，如果有三个优先级为10、100、25的副本，Sentinel将选择优先级为10的副本，即优先级最低的副本。但是，0的特殊优先级将该副本标记为无法执行主机角色，因此Redis Sentinel永远不会选择优先级为0的副本进行升级。默认情况下，优先级为100
replica-priority 100

传播错误行为控制Redis在无法处理在复制流中从主机处理的命令或在读取AOF文件时处理的命令时的行为（同步的RDB或AOF中的指令出现错误时的处理方式）。
//传播过程中发生的错误是意外的，可能会导致数据不一致。
//然而，在早期版本的Redis中也存在一些边缘情况，服务器可能会复制或持久化在未来版本中失败的命令。因此，默认行为是忽略此类错误并继续处理命令。
//如果应用程序希望确保没有数据分歧，则应将此配置设置为“panic”。该值也可以设置为“panic on replicas”，以仅在复制流中复制副本遇到错误时才死机。一旦有足够的安全机制来防止误报崩溃，这两个恐慌值中的一个将在未来成为默认值。通常传播控制行为有以下可选项：
//1）ignore: 忽略错误并继续执行指令   默认值
//2）panic:   不知道
//3）panic-on-replicas:  不知道
# propagation-error-behavior ignore


//当复制副本无法将从其主机接收到的写入命令持久化到磁盘时忽略磁盘写入错误控制的行为。默认情况下，此配置设置为“no”，在这种情况下会使复制副本崩溃。不建议更改此默认值，但是，为了与旧版本的Redis兼容，可以将此配置切换为“yes”，这只会记录一个警告并执行从主机获得的写入命令。
# replica-ignore-disk-write-errors no

//默认情况下，Redis Sentinel在其报告中包括所有副本。复制品可以从Redis Sentinel的公告中排除。未通知的副本将被“sentinel replicas＜master＞”命令忽略，并且不会暴露给Redis sentinel的客户端。
//此选项不会更改复制副本优先级的行为。即使已宣布的复制副本设置为“no”，复制副本也可以升级为主副本。若要防止这种行为，请将副本优先级replica-priority设置为0。
# replica-announced yes

//如果从库的数量少于N个 并且 延时时间小于或等于N秒 ，那么Master将停止发送同步数据
//计算方式:
//	从库数量: 根据心跳
//	延时: 根据从库最后一次ping进行计算，默认每秒一次
//例子：
//	最少需要3个延时小于10秒的从库，才会发送同步
//	min-replicas-to-write 3 
//	min-replicas-max-lag 10   
//如果这两项任意一项的值为0则表示禁用
//默认情况下，要写入的最小复制副本min-replicas-to-write设置为0（功能已禁用），最小复制副本最大滞后设置min-replicas-max-lag为10。
# min-replicas-to-write 3
# min-replicas-max-lag 10

//Slave需要向Master声明实际的ip和port。Redis主机能够以不同的方式列出连接的副本的地址和端口。例如，“INFO replication”部分提供了这些信息，Redis Sentinel在其他工具中使用这些信息来发现副本实例。该信息可用的另一个地方是在主控器的“ROLE”命令的输出中。
//复制副本通常报告的列出的IP地址和端口通过以下方式获得：
//1）ip：通过检查复制副本用于连接主机的套接字的对等地址，可以自动检测地址。
//2）port：该端口在复制握手期间由复制副本进行通信，通常是复制副本用于侦听连接的端口。
//当使用端口转发或网络地址转换（NAT）时，副本实际上可能可以通过不同的IP和端口对访问。复制副本可以使用以下两个选项向其主机报告一组特定的IP和端口，以便INFO和ROLE都报告这些值。
# replica-announce-ip 5.5.5.5
# replica-announce-port 1234
```



### 9）KEYS  TRACKING 

作用：客户端缓存密钥追踪管理  

使用示例：

```
//Redis实现了对客户端缓存值的服务器辅助支持。这是使用一个无效表来实现的，该表使用按密钥名称索引的基数密钥来记住哪些客户端具有哪些密钥。反过来，这被用来向客户端发送无效消息，详情查阅：https://redis.io/topics/client-side-caching
//当为客户端启用跟踪时，假设所有只读查询都被缓存：这将迫使Redis将信息存储在无效表中。当密钥被修改时，这些信息会被清除，并向客户端发送无效消息。然而，如果工作负载主要由读取控制，Redis可能会使用越来越多的内存来跟踪许多客户端获取的密钥
//因此，可以为无效表配置最大填充值。默认情况下，它被设置为1M的键，一旦达到这个限制，Redis将开始收回无效表中的键，即使它们没有被修改，只是为了回收内存：这将反过来迫使客户端使缓存的值无效。基本上，表的最大大小是在服务器端用来跟踪谁缓存了什么信息的内存和客户端在内存中保留缓存对象的能力之间进行权衡。
//如果将该值设置为0，则表示没有限制，Redis将在无效表中保留所需数量的键。在“stats”INFO部分，您可以在每个给定时刻找到关于无效表中键数的信息。
//注意：当在广播模式下使用密钥跟踪时，服务器端不使用内存，因此此设置无效!!!!
# tracking-table-max-keys 1000000
```



### 10）SECURITY

作用：安全配置

使用示例：

```
//由于Redis速度相当快，外部用户每秒可以在一个现代盒子上尝试多达100万个密码。这意味着我们应该使用非常强的密码，否则它们很容易被破坏。redis推荐使用长且不可破解的密码将不可能进行暴力攻击，关于ACL配置的详细描述可以查阅：https://redis.io/topics/acl
//Redis ACL用户的定义格式如下：user <username> ... acl rules ...
//示例：
# user worker +@list +@connection ~jobs:* on >ffa9203c493aa99

//ACL日志跟踪与ACL关联的失败命令和身份验证事件。ACL日志可用于对ACL阻止的失败命令进行故障排除。ACL日志存储在内存中。可以使用ACL LOG RESET回收内存。通过acllog-max-len 定义ACL日志的最大条目长度，默认128：
acllog-max-len 128

//可以使用独立的外部ACL文件配置ACL用户，而不是在rdis.conf文件中配置。这两种方法不能混合使用：如果在这里配置用户，同时激活外部ACL文件，服务器将拒绝启动。外部ACL用户文件的格式与redis.conf中用于描述用户的格式完全相同
# aclfile /etc/redis/users.acl

//requirepass用来设置Redis连接密码
//重要提示：从Redis 6开始，“requirepass”只是新ACL系统之上的一个兼容层。选项效果将只是为默认用户设置密码。客户端仍将像往常一样使用AUTH＜password＞进行身份验证，或者更明确地使用AUTH默认＜password＞（如果它们遵循新协议）进行身份验证：两者都可以工作。requirepass与aclfile选项和ACL LOAD命令不兼容，这将导致requirepass被忽略。
# requirepass foobared


//默认情况下，新用户通过ACL规则“off resetkeys -@all”的等效项使用限制性权限进行初始化。
//从Redis 6.2开始，也可以使用ACL规则管理对PubSub通道的访问。如果新用户受acl PubSub默认配置指令控制，则默认PubSub通道权限，该指令接受以下值之一：
//1）allchannels: 授予对所有PubSub频道的访问权限｝
//2）resetchannels: 取消对所有PubSub频道的访问
//从Redis 7.0开始，acl pubsub默认为“resetchannels”权限！！！
# acl-pubsub-default resetchannels

//可以在共享环境中更改危险命令的名称。例如，CONFIG命令可能会被重命名为难以猜测的东西，这样它仍然可以用于内部使用的工具，但不能用于一般客户端，示例
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
//也可以通过将命令重命名为空字符串来完全终止命令，示例：
# rename-command CONFIG ""
//警告：如果可能，请避免使用此选项。相反，使用ACL从默认用户中删除命令，并将它们只放在您为管理目的创建的某个管理用户中。
//警告：更改记录到AOF文件或传输到副本的命令的名称可能会导致问题
```



### 11）CLIENTS

作用：客户端相关配置

使用示例：

```
//maxclients设置同时连接的客户端的最大数量。默认情况下为10000个，但是，如果受限于机器资源限制，则允许的客户端的最大数量将设置为当前文件限制减去32（因为Redis需要保留一些文件描述符供内部使用）。
//一旦达到限制，Redis将关闭所有新连接，并发送错误“达到最大客户端数”。
//重要提示：使用Redis集群时，最大连接数也与集群总线共享：集群中的每个节点都将使用两个连接，一个传入，另一个传出。在非常大的集群的情况下，相应地调整限制大小是很重要的
# maxclients 10000
```



### 12）MEMORY MANAGEMENT

作用：内存限制等配置 

使用示例：

```
//maxmemory将内存使用限制设置为指定的字节数。当达到内存限制时，Redis将尝试根据所选的逐出策略删除密钥（请参阅maxmemory策略）。
//如果Redis无法根据策略删除密钥，或者策略设置为“noevision”，Redis将开始对使用更多内存的命令（如set、LPUSH等）进行错误回复，并将继续回复GET等只读命令。
//当使用Redis作为LRU或LFU缓存，或为实例设置硬内存限制（使用“noevision”策略）时，此选项通常很有用。
# maxmemory <bytes>

//maxmemory-policy最大内存策略：当达到最大内存时，Redis将如何选择要删除的内容。可以从以下行为中选择一种：
//1）volatile lru：使用近似lru驱逐，只驱逐具有过期集的密钥。
//）allkeys-lru：使用近似lru收回任何密钥
//3）volatile lfu：使用近似lfu驱逐，只驱逐具有过期集的密钥。
//4）allkeys-lfu->使用近似lfu收回任何密钥。
//5）volatile random：移除具有过期集的随机密钥。
//6）allkeys random：移除随机密钥，任意密钥。
//7）volatile ttl：删除最接近到期时间的密钥（次要ttl）
//8）noviction：不要收回任何内容，只在写入操作时返回一个错误。LRU表示最近最少使用LFU表示最不频繁使用  默认值
//LRU、LFU和volatile ttl都是使用近似随机化算法实现的。
# maxmemory-policy noeviction

//LRU、LFU和最小TTL算法不是精确算法，而是近似算法（为了节省内存），因此我们可以根据速度或准确性对其进行调整。默认值为5会产生足够好的结果。10非常接近真实的LRU，但成本更高。3更快，但不是很准确。
//默认情况下，Redis会检查五个键并选择最近使用最少的一个，也支持使用以下配置指令更改样本大小：
# maxmemory-samples 5


//驱逐处理被设计为在默认设置下运行良好。如果写入流量异常大，则可能需要增加此值。降低此值可以降低延迟，但存在驱逐处理有效性的风险0=最小延迟，10=默认值，100=进程而不考虑延迟
# maxmemory-eviction-tenacity 10


//从 Redis 5 开始，默认情况下，从节点会忽略 maxmemory 设置（除非在发生 failover故障转移后或者此节点被提升为 master 节点）。 这意味着只有 master 才会执行过期删除策略，并且 master 在删除键之后会对 replica 发送 DEL 命令。
//这个行为保证了 master 和 replicas 的一致性，但是若我们的 从 节点是可写的， 或者希望 从 节点有不同的内存配置，并且确保所有到 replica 写操作都幂等的，那么我们可以修改这个默认的行为 。通过eplica-ignore-maxmemory修改，默认是yes代表忽略: 
# replica-ignore-maxmemory yes

//过期key的处理执行策略如下：
//1）定时删除: 过期key，开启定时任务，过期时间到期执行
//2）惰性删除: 访问过期key的时候，将过期的key清理
//3）定期删除: 后台扫描过期的key ，默认过期key的数量不能超过内存10%，避免效果超过25%的CPU资源
//取值范围1 ~ 10  值越大CPU消耗越大，越频繁，默认值是1
# active-expire-effort 1
```



### 13）LAZY FREEING

作用：异步策略管理

使用示例：

```
//针对redis内存使用达到maxmeory，并设置有淘汰策略时，在被动淘汰键时，是否采用lazy free机制。因为此场景开启lazy free, 可能使用淘汰键的内存释放不及时，导致redis内存超用，超过maxmemory的限制。默认值no
lazyfree-lazy-eviction no

//针对设置有TTL的键，达到过期后，被redis清理删除时是否采用lazy free机制。此场景建议开启，因TTL本身是自适应调整的速度。默认值no
lazyfree-lazy-expire no

//针对有些指令在处理已存在的键时，会带有一个隐式的DEL键的操作。如rename命令，当目标键已存在,redis会先删除目标键，如果这些目标键是一个big key,那就会引入阻塞删除的性能问题。 此参数设置就是解决这类问题，建议可开启。默认值no
lazyfree-lazy-server-del no

//针对slave进行全量数据同步，slave在加载master的RDB文件前，会运行flushall来清理自己的数据场景，参数设置决定是否采用异常flush机制。如果内存变动不大，建议可开启。可减少全量同步耗时，从而减少主库因输出缓冲区爆涨引起的内存使用增长
replica-lazy-flush no

//对于替换用户代码DEL调用的情况，也可以这样做,使用UNLINK调用是不容易的，要修改DEL的默认行为。命令的行为完全像UNLINK。
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
```



### 14）THREADED I/O 

作用：线程io管理

使用示例：

```
//Redis大多是单线程的，但也有一些线程操作，如UNLINK、慢速IO访问和其他在侧线程上执行的操作。
//建议：只有当确实存在性能问题时，才使用线程IO
//启用线程IO，可以设置参数io-threads，例如，如果有四个核心，请尝试使用2或3个IO线程，如果具有8个核心，则尝试使用6个线程，配置示例：
# io-threads 4

//将io线程设置为1将照常使用主线程。当启用IO线程时，我们只使用线程进行写入，也就是说，通过线程执行write（2）系统调用，并将客户端缓冲区传输到套接字。但是，也可以使用以下配置指令启用读取线程和协议解析，方法是将其设置为yes：
# io-threads-do-reads no
```



### 15）KERNEL OOM CONTROL

作用：在Linux上，可以提示内核OOM killer在OOM发生时应该首先终止哪些进程。启用此功能可使Redis根据其角色主动控制其所有进程的oom_score_adj值。默认分数将尝试在所有其他进程之前杀死背景子进程，并在主进程之前杀死从节点进程。

使用示例：

```
//Redis支持以下选项：
//1）no：不更改oom score adj（默认值）。
//2）yes：“相对”的别名，请参见下文。
//3）absolute：oom score adj中的值按原样写入内核。
//4）relative：当服务器启动时，使用相对于oom_score_adj初始值的值，然后将其限制在-1000到1000的范围内。因为初始值通常为0，所以它们通常与绝对值匹配。
//默认值no
oom-score-adj no


//当使用oom score adj时，此指令控制用于主进程、副本进程和后台子进程的特定值。数值范围为-2000到2000（越高意味着越有可能被杀死）。
oom-score-adj-values 0 200 800
```



### 16）KERNEL transparent hugepage CONTROL 

作用：操作系统内存大页（THP）管理 。内存大页机制（Transport Huge Pages，THP），是linux2.6.38后支持的功能，该功能支持2MB的大爷内存分配，默认开启。常规的内存分配为4KB维度 。

通常，内核Transparent Jug Pages控件默认设置为“madvise”或“never”（syskernelmmtransparent_hugepageenabled），在这种情况下，此配置无效。在设置为“madvise”的系统上，redis将尝试专门针对redis进程禁用它，以避免fork（2）和CoW的延迟问题。如果出于某种原因喜欢启用它，可以将此disable-thp配置设置为“no”，并将内核全局设置为“always”。



使用示例：

```
//参考资料：https://www.cnblogs.com/Brake/p/14354964.html
//默认关闭了操作系统内存大页机制
disable-thp yes
```



###  17）APPEND ONLY MODE 

作用： AOF持久化配置

使用示例：

```

//AOF持久化，指定是否在每次更新操作后进行日志记录，默认redis是异步（快照）的把数据写入本地磁盘
//redis默认使用的是rdb方式持久化，此方式在许多应用中已足够用。
//但redis如果中途宕机，会导致可能有几分钟的数据丢失，按照上面save条件来策略进行持久化
//Append Only File是另一种持久化方式，可提供更好的持久化特性。
//Redis会把每次写入的数据在接收后都写入appendonly.aof 文件
//每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
//AOF和RDB持久性可以同时启用，而不会出现问题。如果在启动时启用了AOF，Redis将加载AOF，即具有更好耐用性保证的文件。
//更多资料查阅：https://redis.io/topics/persistence
appendonly no


//Redis 7及更新版本使用一组仅追加的文件来保存数据集和应用于数据集的更改。使用的文件有两种基本类型：
//1）Base files：基本文件，是表示创建文件时数据集完整状态的快照。基本文件可以是RDB（二进制序列化）或AOF（文本命令）的形式
//2）Incremental files：增量文件 其中包含在上一个文件之后应用于数据集的其他命令
//文件名的前缀基于“appendfilename”配置参数，默认为appendonly.aof
//例子:
//appendfilename "appendonly.aof"
//appendonly.aof.1.base.rdb 基础文件
//appendonly.aof.1.incr.aof, appendonly.aof.2.incr.aof 作为增量文件
//appendonly.aof.manifest  清单文件 
appendfilename "appendonly.aof"

//为了方便起见，Redis将所有持久的仅追加文件存储在一个专用目录中。目录的名称由appenddirname配置参数决定。
appenddirname "appendonlydir"


//AOF持久化三种同步策略：
//   1) no：不同步（不执行fsync），数据不会持久化
//   2) always：每次有数据发生变化时都会写入appendonly.aof（慢，安全）
//   3) everysec：每秒同步一次到appendonly.aof，可能会导致丢失这1s数据（折中选择，默认值）
appendfsync everysec
 
 //当AOF fsync策略设置为always或everysec，并且后台保存过程（后台保存或AOF日志后台重写）正在对磁盘执行大量IO时，在某些Linux配置中，Redis可能会在fsync（）调用上阻塞太长时间。请注意，目前还没有对此进行修复，因为即使在不同的线程中执行fsync也会阻止我们的同步write（2）调用，在最坏的情况下（使用默认的Linux设置）可能会丢失长达30秒的日志
//为了缓解这个问题，可以使用以下选项来防止在BGSAVE或BGREWRITEOF进行时在主进程中调用fsync（）
//如果有延迟问题，请将此选项设置为“yes”。否则，从耐用性的角度来看，默认配置no最安全的选择
no-appendfsync-on-rewrite no



 
# AOF自动重写配置。当目前AOF文件大小超过上一次重写的aof文件大小的百分之多少进行重写
# 即当AOF文件增长到一定大小时，Redis能调用bgrewriteaof对日志文件进行重写。
# 当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
auto-aof-rewrite-percentage 100
 
 
# 设置允许重写的最小AOF文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb

在Redis启动过程的最后，当AOF数据被加载回内存时，可能会发现AOF文件被截断。当Redis运行的系统崩溃时，尤其是当ext4文件系统在没有data=ordered选项的情况下挂载时，可能会发生这种情况（然而，当Redis本身崩溃或中止，但操作系统仍然正常工作时，这种情况就不会发生）


//aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。
//如果aof-load-truncated配置的是yes，当截断的aof文件被导入的时候，Redis会自动发布一个日志通知给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
//如果该选项设置为no，则服务器将因错误而中止并拒绝启动。当该选项设置为no时，用户需要在重新启动服务器之前使用“redis check AOF”实用程序修复AOF文件
aof-load-truncated yes


//Redis可以创建RDB或AOF格式的仅追加基础文件。使用RDB格式总是更快、更高效，只有出于向后兼容性的目的才支持禁用它。
aof-use-rdb-preamble yes


//Redis支持在AOF中记录时间戳注释，以支持特定时间点的恢复数据，但是可能会以一种与现有的AOF解析器不兼容的方式更改AOF格式，默认关闭
aof-timestamp-enabled no
```



###  18）SHUTDOWN

作用： 关闭操作管理

使用示例：

```
//shutdown-timeout是指关闭时等待复制副本的最长时间（秒）
//“shutdown-timeout的值是宽限期的持续时间（以秒为单位）。仅当实例具有副本时才适用。要禁用该功能，请将该值设置为0
# shutdown-timeout 10


//支持针对SIGINT / SIGTERM 这两个指令做出不同的解决方案
//取值范围 
//1）default:  如果有需要保存的数据，则等待RDB保存，且等待Slave同步
//2）save ： 即便有需要保存的数据，也会执行RDB
//3）nosave :  有保存点，也不执行RDB
//4）now ： 不等待Slave同步
//5）force ： 如果Redis关机遇到问题则忽略
//以上五个值，save 和 nosave不能一起使用外，其他都可以一起使用，例如
//shutdown-on-sigint nosave force now 
# shutdown-on-sigint default
# shutdown-on-sigterm default
```



###  19）NON-DETERMINISTIC LONG BLOCKING COMMANDS

作用：非确定性长阻塞命令，这是redis7.0的新增命令, 可以配置在Redis开始处理或拒绝其他客户端之前，EVAL脚本、函数以及某些情况下模块命令的最长时间（以毫秒为单位）。如果达到最长执行时间，Redis将开始回复带有BUSY错误的大多数命令。
在这种状态下，Redis将只允许执行少数命令。例如，SCRIPT KILL、FUNCTION KILL、SHUTDOWN NOSAVE，以及一些特定于模块的“允许繁忙”命令 。

SCRIPT KILL和FUNCTION KILL只能停止尚未调用任何写入命令的脚本，因此在用户不想等待脚本的自然终止时脚本已经发出写入命令的情况下，SHUTDOWN NOSAVE可能是停止服务器的唯一方法。

使用示例：

```
//默认值为5秒。可以将其设置为0或负值以禁用此机制（不间断执行）。
//在老版本中这个配置有一个不同的名称，redis7.0以后是一个新的别名，这两个名称的作用是相同的
# lua-time-limit 5000
# busy-reply-threshold 5000
```



### 20）REDIS CLUSTER

作用：cluster集群模式配置

使用示例：

```
//一个最小的集群需要最少３个主节点。第一次测试，强烈建议你配置６个节点：３个主节点和３个从节点
//普通Redis实例不能是Redis集群的一部分；只有作为集群节点启动的节点才能。为了将Redis实例作为集群节点启动，可以配置cluster-enabled值为yes
# cluster-enabled yes


//cluster-config-file是每个集群节点都有的单独一个集群配置文件。此文件不可手动编辑。它由Redis节点创建和更新。每个Redis Cluster节点都需要不同的群集配置文件。请确保在同一系统中运行的实例没有重叠的群集配置文件名。
# cluster-config-file nodes-6379.conf

//这是集群中的节点能够失联的最大时间，超过这个时间，该节点就会被认为故障。如果主节点超过这个时间还是不可达，则用它的从节点将启动故障迁移，升级成主节点。注意，任何一个节点在这个时间之内如果还是没有连上大部分的主节点，则此节点将停止接收任何请求。
# cluster-node-timeout 15000

//集群节点端口是集群总线将侦听入站连接的端口。当设置为默认值0时，它将绑定到命令端口+10000。设置此值要求在执行群集相遇时指定集群总线端口。
# cluster-port 0



//cluster-replica-validity-factor设置副本有效因子: 副本数据太老旧就不会被选为故障转移的启动者。副本没有简单的方法可以准确测量其“数据年龄”，因此需要执行以下两项检查：
//1)如果有多个复制副本能够进行故障切换，则它们会交换消息，以便尝试为具有最佳复制偏移量的副本提供优势（已经从master接收了尽可能多的数据的节点更可能成为新master）。复制副本将尝试按偏移量获取其排名，并在故障切换开始时应用与其排名成比例的延迟（排名越靠前的越早开始故障迁移）。
//2)每个副本都会计算最后一次与其主副本交互的时间。这可以是最后一次收到的PING或命令（如果主机仍处于“已连接”状态），也可以是与主机断开连接后经过的时间（如果复制链路当前已关闭）。如果最后一次交互太旧，复制副本根本不会尝试故障切换。
//第2点的值可以由用户调整。特别的，如果自上次与master交互以来，经过的时间大于(node-timeout * cluster-replica-validity-factor) + repl-ping-replica-period，则不会成为新的master。
//较大的cluster-replica-validity-factor可能允许数据太旧的副本故障切换到主副本，而太小的值可能会阻止群集选择副本。
//为了获得最大可用性，可以将cluster-replica-validity-factor设置为0，这意味着，无论副本上次与主机交互的时间是什么，副本都将始终尝试故障切换主机。（不过，他们总是会尝试应用与其偏移等级成比例的延迟）。
//0是唯一能够保证当所有分区恢复时，集群始终能够继续的值（保证集群的可用性）。
# cluster-replica-validity-factor 10


//cluster-migration-barrier主节点需要的最小从节点数，只有达到这个数，主节点失败时，它从节点才会进行迁移: master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1

//关闭此选项可以使用较少的自动群集配置。它既禁止迁移到孤立主机，也禁止从变空的主机迁移,默认yes
# cluster-allow-replica-migration yes


//cluster-require-full-coverage：部分key所在的节点不可用时，如果此参数设置为”yes”(默认值), 则整个集群停止接受操作；如果此参数设置为”no”，则集群依然为可达节点上的key提供读操作
//不建议打开该配置，这样会造成分区时，小分区的master一直在接受写请求，而造成很长时间数据不一致。
# cluster-require-full-coverage yes


//cluster-replica-no-failover是否自动故障转移,此选项设置为“yes”时，可防止复制副本在主机出现故障时尝试对其主机进行故障切换。但是，如果强制执行手动故障切换，复制副本仍然可以执行。
//这在不同的场景中都很有用，尤其是在多个数据中心运营的情况下，如果不是在完全DC故障的情况下的话，我们希望其中一方永远不会被提升为master
# cluster-replica-no-failover no

//cluster-allow-reads-when-down设置集群失败时允许节点处理读请求
//此选项设置为“yes”时，允许节点在集群处于关闭状态时提供读取流量，只要它认为自己拥有这些插槽。
//这对两种情况很有用。第一种情况适用于在节点故障或网络分区期间应用程序不需要数据一致性的情况。其中一个例子是缓存，只要节点拥有它应该能够为其提供服务的数据。
//第二个用例适用于不满足三个分片集群，但又希望启用群集模式并在以后扩展的配置。不设置该选项而使用1或2分片配置中的master中断服务会导致整个集群的读/写服务中断。如果设置此选项，则只会发生写中断。如果达不到master的quorum（客观宕机）数值，插槽所有权将不会自动更改。
# cluster-allow-reads-when-down no

//当该选项设置为yes时，允许节点在集群处于关闭状态时提供pubsub shard流量，只要它认为自己拥有插槽
//如果应用程序想要使用pubsub功能，即使集群全局稳定状态不正常，这也很有用。如果应用程序希望确保只有一个shard为给定通道服务，则此功能应保持为yes
# cluster-allow-pubsubshard-when-down yes

//集群链路发送缓冲区限制
//cluster-link-sendbuf-limit是以字节为单位的单个集群总线链路的发送缓冲区的内存使用限制。如果集群链接超过此限制，它们将被释放。这主要是为了防止发送缓冲区在指向慢速对等端的链接上无限增长（例如，PubSub消息堆积）。默认情况下禁用此限制。当“cluster links”命令输出中的“mem_cluster_links”INFO字段和或“send buffer allocated”条目持续增加时，启用此限制。建议最小限制为1gb，这样默认情况下集群链接缓冲区至少可以容纳一条PubSub消息。（客户端查询缓冲区限制默认值为1gb）
# cluster-link-sendbuf-limit 0

//集群可以使用此配置配置其公布的主机名,将其设置为空字符串将删除主机名并传播删除
# cluster-announce-hostname ""

//除了用于调试和管理信息的节点ID之外，集群还可以配置要使用的可选节点名。此名称在节点之间广播，因此在报告跨节点事件（如节点故障）时，除了节点ID外，还会使用此名称。
# cluster-announce-human-nodename ""

//设置告诉客户端使用何种方式连接集群（IP地址、用户自定义主机名、声明没有端点）；可以设置为“ip”、“hostname”、“unknown-endpoint”，用于控制MOVED/ASKING请求的返回和CLUSTER SLOTS的第一个字段（如果指定了hostname但没有公布主机名，则会返回“?”）；
# cluster-preferred-endpoint-type ip
```

 

### 21）CLUSTER DOCKER/NAT support

作用：关于NAT网络或者Docker的支持       

在某些部署中，Redis Cluster节点的地址发现失败，原因是地址被NAT转发或端口被转发（典型的情况是Docker和其他容器）
为了让Redis集群在这样的环境中工作，需要一个静态配置，每个节点都知道自己的公共地址。redis提供了一些配置项来支持在这种环节中运行。

使用示例：

```
//redis提供了以下四个配置项：
//1）cluster-announce-ip：节点地址
//2）cluster-announce-tls-port：客户端tls端口
//3）cluster-announce-port：客户端普通端口
//4）cluster-announce-bus-port：集群消息总线端口
//这些信息将发布在总线数据包的标头中，以便其他节点能够正确映射发布信息的节点的地址。
//请注意，如果tls-cluster设置为yes，并且cluster-announce-tls-port被省略或设置为零，则cluster-annaunce-port指tls端口。如果tls-cluster设置为no，则cluster-annotice-tls-port无效
# cluster-announce-ip 10.1.1.5
# cluster-announce-tls-port 6379
# cluster-announce-port 0
# cluster-announce-bus-port 6380
```





### 22）SLOW LOG

作用：慢查询日志配置

Redis慢日志管理模块会记录超过指定执行时间的查询。执行时间不包括IO操作，如与客户端交谈、发送回复等，而只是实际执行命令所需的时间（这是命令执行的唯一阶段，线程被阻塞，在此期间无法为其他请求提供服务）。
redis提供了两个参数：

- slowlog-log-slower-than参数：告诉Redis需要超过多少执行时间才记录对应的命令，时间单位以微秒表示，因此1000000相当于一秒钟。需要特别注意的是:配置为负数将禁用慢速日志，而零值将强制记录每个命令。
- slowlog-max-len参数：慢日志的最大长度限制。这个长度配置没有限制。只要注意它会消耗内存。您可以使用SLOWLOG RESET回收慢速日志使用的内存。

记录新命令时，最旧的命令将从记录的命令队列中删除。

使用示例：

```

slowlog-log-slower-than 10000
slowlog-max-len 128
```

​	 

### 23）LATENCY MONITOR

作用：延迟监控配置。Redis延迟监测子系统在运行时对不同的操作进行采样，以收集与Redis实例的可能延迟源相关的数据。
通过LATENCY相关命令，可以打印图形和获取报告的用户可以使用此信息。

使用示例：

```
//系统只记录在等于或大于通过延迟监视器阈值配置指令latency-monitor-threshold指定的毫秒数的时间内执行的操作。当其值设置为零时，延迟监视器将关闭。
//默认情况下，延迟监控是禁用的，因为如果您没有延迟问题，则基本上不需要它，并且收集数据会对性能产生影响，虽然影响很小，但可以在大负载下进行测量。如果需要，可以在运行时使用命令“CONFIG SET latency-monitor-threshold <milliseconds>”轻松启用延迟监控。
latency-monitor-threshold 0
```



### 24）LATENCY  TRACKING   

作用：延迟信息追踪配置。Redis扩展延迟监控跟踪每个命令的延迟，并允许通过INFO latencystats命令导出百分比分布，以及通过latency命令导出累积延迟分布（直方图）。

使用示例：

```
//默认情况下，由于跟踪命令延迟的开销非常小，因此启用了扩展延迟监控。
# latency-tracking yes
//默认情况下，通过INFO latencystats命令导出的延迟百分比是p50、p99和p999
# latency-tracking-info-percentiles 50 99 99.9
```



### 25）EVENT NOTIFICATION 

作用：事件通知管理。Redis可以将缓存key中发生的事件通知PubSub客户端，详细描述查阅：https://redis.io/topics/notifications

使用示例：

```
//例如，如果启用了缓存key事件通知，并且客户端对存储在数据库0中的key“foo”执行DEL操作，则将通过PubSub发布两条消息：
# PUBLISH __keyspace@0__:foo del
# PUBLISH __keyevent@0__:del foo

//可以在一组类中选择Redis将通知的事件。每类都有一个字符标识
//1）K     Keyspace eventsK键空间通知，所有通知以 keyspace@ 为前缀.
//2）E     Keyevent events键事件通知, 所有通知以 keyevent@ 为前缀
//3）g     DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知
//4）$     String 命令 字符串命令的通知
//5）l     List 命令 列表命令的通知
//6）s     Set 命令 集合命令的通知
//7）h     Hash 命令  哈希命令的通知
//8）z     Sorted set 有序集合命令的通知
//9）x     过期事件,每次key过期时生成的事件
//10）e     驱逐(evict)事件, 每当有键因为 maxmemory 策略而被删除时发送
//11）n    key创建事件 （不被A命令包含！）
//12）t     Stream 命令
//13）d     模块键类型事件
//14）m     key丢失事件 (不被A命令包含!)
//15）A     g$lshzxe 的简写  因此“AKE”字符串表示所有事件（由于其独特性质而被排除在“A”之外的关键未命中事件除外，比如n和m）
//“notify-keyspace-events”将由零个或多个类标识符组成的字符串作为参数。空字符串表示所有事件通知被禁用
//示例：启用列表命令事件l和常规事件，可以组合‘E’、‘l’、‘g’：
#  notify-keyspace-events Elg
//示例：获取订阅频道的key过期事件
# notify-keyspace-events Ex
//默认情况下，所有事件通知都被禁用，因为大多数用户不需要此功能，而且该功能有一些开销。请注意，如果没有指定K或E中的至少一个，j就算配置了别的标识符，也不会传递任何事件。
notify-keyspace-events ""
```



### 26）ADVANCED CONFIG

作用：进阶配置，需要调优时涉及。

使用示例：

```
//Redis 7中ziplist被listpack替代，所以相关配置都变为listpack。
//当散列具有少量条目，并且最大条目不超过给定阈值时，散列使用高效内存的数据结构进行编码。可以使用以下指令配置这些阈值。
hash-max-listpack-entries 512
hash-max-listpack-value 64

//list列表也以一种特殊的方式进行编码，以节省大量空间,每个内部列表节点允许的条目数可以指定为固定的最大大小或最大元素数。对于固定的最大大小，使用-5到-1，有下列几种情况：
//1）-5: max size: 64 Kb  <-- 不推荐用于正常工作负载
//2）-4: max size: 32 Kb  <-- 不推荐
//3）-3: max size: 16 Kb  <-- 可能不推荐
//4）-2: max size: 8 Kb   <-- 好  默认值
//5）-1: max size: 4 Kb   <-- 好
list-max-listpack-size -2

//list列表也可能被压缩。list-compress-depth配置是指一个quicklist两端不被压缩的节点个数。列表的头部和尾部总是未压缩的，以便进行快速的pushpop操作，
 1: ，中间的节点压缩。3: 。
//1）0: 表示都不压缩  默认值
//2）1: 在列表中的1个节点之后才开始压缩,从头压缩到尾：[head]->node->node->...->node->[tail]，[head]和[tail]不会被压缩; 中间的node才会被压缩
//3）2: 不要压缩头部或头部的下一个或尾部或者尾部的上一个或末尾，[head]->[next]->node->node->...->node->[prev]->[tail]  
//4）3: 表示quicklist两端各有3个节点不压缩，中间的节点压缩
list-compress-depth 0

//intset 、listpack和hashtable这三者的转换时根据要添加的数据、当前set的编码和阈值决定的。
//当集合中的元素全是整数,且长度不超过set-max-intset-entries(默认为512个)时,redis会选用intset作为内部编码，大于512用set
set-max-intset-entries 512
//如果要添加的数据是字符串，分为三种情况
//1)当前set的编码为intset：如果没有超过阈值，转换为listpack；否则，直接转换为hashtable
//2)当前set的编码为intset：如果没有超过阈值，转换为listpack；否则，直接转换为hashtable
//3)当前set的编码为hashtable：直接插入，编码不会进行转换
set-max-listpack-entries 128
set-max-listpack-value 64

//与散hash和列表list类似，sorted sets排序集也经过特殊编码，以节省大量空间。当zset同时满足zset-max-listpack-entries、zset-max-listpack-value时，会使用listpack作为底层结构，当zset中不满足这两个条件时，会使用skiplist作为底层结构。
zset-max-listpack-entries 128
zset-max-listpack-value 64

//HyperLogLog 是一种概率数据结构，用于在恒定的内存大小下估计集合的基数（不同元素的个数）。它不是一个独立的数据类型，而是一种特殊的 string 类型，它可以使用极小的空间来统计一个集合中不同元素的数量，也就是基数。一个 hyperloglog 类型的键最多可以存储 12 KB 的数据
//hyperloglog 类型的底层实现是 SDS（simple dynamic string），它和 string 类型相同，只是在操作时会使用一种概率算法来计算基数。hyperloglog 的误差率为 0.81%，也就是说如果真实基数为 1000，那么 hyperloglog 计算出来的基数可能在 981 到 1019 之间
//hyperloglog 类型的应用场景主要是利用空间换时间和精度，比如：
//1）统计网站的独立访客数（UV）
//2）统计在线游戏的活跃用户数（DAU）
//3）统计电商平台的商品浏览量
//4）统计社交网络的用户关注数
//5）统计日志分析中的不同事件数
//value大小 小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），大于hll-sparse-max-bytes使用稠密的数据结构（dense）。
hll-sparse-max-bytes 3000

//Streams单个节点的字节数，以及切换到新节点之前可能包含的最大项目数
//将其中一项设置为零，则会忽略该项限制。
//例如，可以通过将stream-node-max-bytes最大字节设置为0并将stream-node-max-entries最大条目设置为所需值来仅设置最大条目限制
stream-node-max-bytes 4096
stream-node-max-entries 100


//activerehashing指定是否激活重置哈希，默认为开启
//Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。
//当我们的业务使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，可以把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
activerehashing yes


//client-output-buffer-limit对单个客户端输出缓冲区限制,可用于强制断开由于某些原因而没有足够快地从服务器读取数据的客户端（一个常见的原因是PubSub客户端无法像发布者生成消息那样快速地使用消息）, 可以为三种不同类别的客户端设置不同的限制：
//1）normal -> 普通客户端，包括MONITOR客户端
//2）replica -> 从节点客户端
//3）pubsub -> 订阅了至少一个pubsub频道或模式的客户端
# client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>
//一旦达到hard limit硬限制，或者如果达到soft limit软限制并保持达到指定的秒数（连续），客户端将立即断开连接。例如，如果hard limit硬限制是32兆字节，soft limit软限制是16兆字节10秒，则如果输出缓冲区的大小达到32兆字节则客户端将立即断开连接，但如果客户端达到16兆字节并连续超过该限制10秒，客户端也将断开连接
//默认情况下，普通客户端不受限制，因为它们不会在没有请求的情况下（以推送方式）接收数据，而是在请求之后接收数据，因此只有异步客户端才能创建这样一种情况，即数据的请求速度快于读取速度，相反，pubsub和副本客户端有一个默认限制，因为订阅者和副本以推送方式接收数据
//通过将硬限制或软限制设置为0，可以禁用它们
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60


//client-query-buffer-limit对单个客户端的输入缓冲区限制配置，之前固定为1gb，在4.0之后改为可配置
# client-query-buffer-limit 1gb

//在某些情况下，客户端连接可能会占用内存，导致OOM错误或数据逐出。为了避免这种情况，我们可以限制所有客户端连接（所有pubsub和普通客户端）使用的累积内存。一旦我们达到这个限制，服务器就会按照一定策略杀掉问题客户端释放内存，从而丢弃连接。服务器将首先尝试使用最多内存来断开连接。我们称这种机制为“客户端驱逐”。
//客户端驱逐是使用maxmemory-clients配置的，配置为0代表禁用客户端驱逐功能，默认是0
//maxmemory-clients 0
//客户端逐出阈值配置示例：
# maxmemory-clients 1g

//百分比值（介于1%和100%之间）表示客户端逐出阈值基于最大内存设置的百分比。如果整机部署密度较高，建议配置一定百分比，但会有客户端被干掉的风险。配置实例：将客户端逐出设置为最大内存的5%
# maxmemory-clients 5%

//在Redis协议中，批量请求，即表示单个字符串的元素，通常限制为512 mb。但是，我们可以通过proto-max-bulk-len修改这个限制，但必须为1mb或更大
# proto-max-bulk-len 512mb

//Redis调用一个内部函数来执行许多后台任务，比如在超时时关闭客户端的连接，清除从未请求过的过期密钥，等等。并非所有任务都以相同的频率执行，但Redis会根据指定的“hz”值检查要执行的任务
//默认情况下，“hz”设置为10。当Redis空闲时，提高该值将使用更多的CPU，但当有多个key同时过期时，Redis将更具响应性，并且可以更精确地处理超时
//该范围在1到500之间，但是超过100的值通常不是一个好主意。大多数用户应该使用默认值10，并且只有在需要非常低延迟的环境中才能将其提高到100
hz 10

//通常情况下，有一个与连接的客户端数量成比例的HZ值是有用的。例如，这对于避免每次后台任务调用处理过多客户端以避免延迟峰值非常有用
//由于默认情况下默认的HZ值保守地设置为10，Redis提供并默认启用了使用自适应HZ值的能力，当有许多连接的客户端时，该值会暂时升高
//启用动态HZ时，实际配置的HZ将用作基线，但一旦连接了更多客户端，将根据需要实际使用配置的HZ值的倍数。通过这种方式，空闲实例将使用很少的CPU时间，而繁忙实例将更具响应性
dynamic-hz yes

//当一个子进程重写AOF文件时，如果启用下面的选项，则文件每生成4M数据会被同步，这对于避免大的延迟峰值非常有用
aof-rewrite-incremental-fsync yes

//当redis保存RDB文件时，如果启用以下选项，则每生成4MB的数据就会对该文件进行fsync，这对于避免大的延迟峰值非常有用
rdb-save-incremental-fsync yes

//Redis LFU逐出（请参阅maxmemory设置）可以进行调优。然而，最好从默认设置开始，只有在研究了如何提高性能以及键LFU如何随时间变化后才能更改它们，这可以通过OBJECT FREQ命令进行检查
//Redis LFU实现中有两个可调参数：计数器对数因子lfu-log-factor和计数器衰减时间lfu-decay-time。在更改这两个参数之前，了解它们的含义是很重要的。
# lfu-log-factor 10
# lfu-decay-time 1
```

​	



### 27）ACTIVE DEFRAGMENTATION 

作用：活动碎片整理。主动（在线）碎片整理允许Redis服务器压缩内存中的空间，从而可以回收内存。

当碎片超过一定级别时（请参阅下面的配置选项），Redis将开始通过利用某些特定的Jemalloc功能在连续内存区域中创建值的新副本（以便了解分配是否会导致碎片，并将其分配到更好的位置），同时释放数据的旧副本，对所有key递增重复此过程将导致碎片降回正常值。需要注意的是：

- 此功能默认禁用，仅当您编译Redis以使用我们随Redis源代码一起提供的Jemalloc副本时才有效。这是Linux构建的默认设置。
- 如果没有碎片问题，则最好永远不要启用此功能！！！
- 一旦遇到碎片，我们可以在需要时使用命令“CONFIG SET activedefrag yes”启用此功能。

碎片相关配置参数能够微调碎片整理过程的行为。如果我们不确定它们的含义，那么最好保留默认值

使用示例：

```
//碎片相关配置参数能够微调碎片整理过程的行为。如果我们不确定它们的含义，那么最好保留默认值
# activedefrag no
//启动活动碎片整理的最小内存碎片阈值
# active-defrag-ignore-bytes 100mb
//启动活动碎片整理的最小内存碎片百分比
# active-defrag-threshold-lower 10
//尝试释放的最大百分比
# active-defrag-threshold-upper 100
//最少CPU使用率
# active-defrag-cycle-min 1
//最大CPU使用率
# active-defrag-cycle-max 25
//将从主字典扫描处理的set hash zset list字段的最大数目 
# active-defrag-max-scan-fields 1000

//碎片整理的Jemalloc线程默认在后台运行
jemalloc-bg-thread yes

//可以将Redis的不同线程和进程固定到系统中的特定CPU，以最大限度地提高服务器的性能。这既有助于将不同的Redis线程固定在不同的CPU中，也有助于确保在同一主机中运行的多个Redis实例将固定到不同的CPU
//通常情况下，可以使用“taskset”命令来完成此操作，但在Linux和FreeBSD中，也可以通过Redis配置直接完成此操作,可以固定serverIO线程、bio线程、aof重写子进程和bgsave子进程。指定cpu列表的语法与taskset命令相同
//示例将redis server/io线程设置为cpu0,2,4,6:
# server_cpulist 0-7:2
//示例将bio线程设置为cpu 1,3:
# bio_cpulist 1,3
//示例将aof重写子进程设置为cpu8,9,10,11：
# aof_rewrite_cpulist 8-11
//示例将bgsave子进程设置为cpu1,10,11
# bgsave_cpulist 1,10-11

//在某些情况下，如果检测到系统处于坏状态，redis会发出警告，甚至拒绝启动。可以通过设置以下配置来抑制这些警告，该配置使用空格分隔的警告列表
# ignore-warnings ARM64-COW-BUG
```



### 28）配置文件全集！！

<font color="red">注意：本配置文件基于Redis的版本是7.2.1</font>

```
// Redis配置文件样例
 
// 单位注意事项：当需要内存大小时，可以指定，它以通常的形式 1k 5GB 4M 等等：
// 1k => 1000 bytes
// 1kb => 1024 bytes
// 1m => 1000000 bytes
// 1mb => 1024*1024 bytes
// 1g => 1000000000 bytes
// 1gb => 1024*1024*1024 bytes
// 单位不区分大小写，所以 1GB 1Gb 1gB 都是一样的
 
############################### INCLUDES（包含） ##############################
//这在你有标准配置模板但是每个redis服务器又需要个性设置的时候很有用。等同import导入
# include /path/to/local.conf
# include /path/to/other.conf
# include /path/to/fragments/*.conf

 
############################### MODULES（模块） ##############################
// 可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令
# loadmodule /path/to/my_module.so
# loadmodule /path/to/other_module.so
 

############################## NETWORK（网络）##################################
// bind参数表示绑定主机的哪个网卡，比如本机有两个网卡分别对应ip 1.1.1.1 ,2.2.2.2，配置bind 1.1.1.1，
// 则客户端288.30.3.3访问2.2.2.2将无法连接redis。
// 如果不配置bind，redis将监听本机所有可用的网络接口。也就是说redis.conf配置文件中没有bind配置项，redis可以接受来自任意一个网卡的Redis请求
//如下示例表示绑定本机的两个ipv4网卡地址
# bind 192.168.1.100 10.0.0.1  
//如下示例表示所有连接都可以连接上
# bind 0:0:0:0 
//如下示例表示绑定到本机的ipv6
# bind 127.0.0.1::1 
//如下示例表示绑定到本机
# bind 127.0.0.1 


//默认情况下，传出连接（从副本到主机、从Sentinel到实例、集群总线等）不绑定到特定的本地地址。在大多数情况下，这意味着操作系统将
//根据路由和连接所通过的接口来处理。使用bind source addr可以配置要绑定到的特定地址，这也可能会影响连接的路由方式，默认未启用。
# bind-source-addr 10.0.0.1

// 是否开启保护模式。如配置里没有指定bind和密码。开启该参数后，redis只允许本地访问，拒绝外部访问
// 要是开启了密码和bind，可以开启。否则最好关闭，设置为no。
protected-mode yes

# Redis监听端口号，默认为6379，如果指定0端口，表示Redis不监听TCP连接
port 6379

// tcp keepalive参数是表示空闲连接保持活动的时长。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值
//  使用keepalive有两个好处:
//  1) 检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经发生与对端端口的问题。
//  2) 在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需两倍的设置值
tcp-keepalive 300

 
// tcp-backlog参数用于在linux系统中控制tcp三次握手已完成连接队列的长度。
//在高并发系统中，通常需要设置一个较高的tcp-backlog来避免客户端连接速度慢的问题（三次握手的速度）。
//已完成连接队列的长度也与操作系统中somaxconn有关，取二者最小min(tcp-backlog,somaxconn)
//linux查看已完成连接队列的长度:$ /proc/sys/net/core/somaxconn
tcp-backlog 511
 
//连接超时时间，单位秒；超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0
timeout 0



################################# TLS/SSL （数据连接加密） #####################################
//从版本6开始，Redis支持TLS/SSL，这是一项需要在编译时启用的可选功能。
//可以在编译redis源码的时候使用如下命令启用：make BUILD_TLS=yes
 

//tls-port配置指令允许在指定的端口上接受TLS/SSL连接
//示例：只接受TLS端口tls-port，禁用非TLS端口port
port 0
tls-port 6379


//配置X.509证书和私钥。此外，在验证证书时，需要指定用作受信任根的CA证书捆绑文件或路径。为了支持基于DH的密码，还可以配置DH参数文件。例如：
//tls-cert-file 用于指定redis服务端证书文件,tls-key-file 用于指定redis服务端私钥文件 ,tls-key-file-pass用于配置服务端私钥密码(如果需要)
#tls-cert-file /path/to/redis.crt
#tls-key-file /path/to/redis.key
# tls-key-file-pass secret
//tls-client-cert-file 用于指定redis客户端证书文件,tls-client-key-file 用于指定redi客户端私钥文件 ,tls-client-key-file-pass配置客户端私钥密码（如果有）
# tls-client-cert-file /path/to/redis.crt
# tls-client-key-file /path/to/redis.key
# tls-client-key-file-pass secret

//tls-dh-params-file配置DH参数文件以启用Diffie-Hellman（DH）密钥交换,旧版本的OpenSSL（<3.0）需要配置该项,较新的版本不需要此配置。
# tls-dh-params-file /path/to/redis.dh

//配置CA证书捆绑包或目录以对TLSSSL客户端和对等方进行身份验证。Redis需要至少一个显式配置，并且不会隐式使用系统范围的配置。
# tls-ca-cert-file ca.crt
# tls-ca-cert-dir /etc/ssl/certs

//默认情况下，TLS端口上的客户端（包括副本服务器）需要使用有效的客户端证书进行身份验证。
//如果tls-auth-clients指定“no”，则不需要也不接受客户端证书。如果tls-auth-clients指定了“optional”，则接受客户端证书，并且如果提供了客户端证书，则客户端证书必须有效，但不是必需的。
# tls-auth-clients no
# tls-auth-clients optional

//默认情况下，Redis复制副本不会尝试与其主机建立TLS连接，tls-replication指定为‘yes’表示在主从复制链接上启用TLS。
# tls-replication yes

//默认情况下，Redis Cluster总线使用纯TCP连接。要为总线协议启用TLS，可以将tls-cluster配置为yes
# tls-cluster yes

//默认情况下，仅启用TLSv1.2和TLSv1.3，强烈建议禁用正式弃用的旧版本，以减少攻击面。可以通过tls-protocols明确指定要支持的TLS版本。允许的值不区分大小写，包括“TLSv1”、“TLSv1.1”、“TL Sv1.2”、“T Sv1.3”（OpenSSL>=1.1.1.1）或任何组合。
//示例；
//启用TLSv1.2和TLSv1.3
# tls-protocols "TLSv1.2 TLSv1.3"

//配置允许的密码，tls-ciphers仅在tls版本<=TLSv1.2时生效
# tls-ciphers DEFAULT:!MEDIUM

//配置允许的TLSv1.3密码套件
# tls-ciphersuites TLS_CHACHA20_POLY1305_SHA256

//选择密码时，请使用服务器的首选项，而不是客户端的首选项。默认情况下，tls-prefer-server-ciphers配置为‘yes’表示服务器遵循客户端的首选项。
# tls-prefer-server-ciphers yes

//默认情况下，启用TLS会话缓存以允许支持它的客户端更快、更便宜地重新连接。使用以下指令禁用缓存
# tls-session-caching no

//更改缓存的TLS会话的默认数量。零值将缓存设置为无限制大小。默认大小为20480。
# tls-session-cache-size 5000

//更改缓存TLS会话的默认超时。默认超时为300秒。
# tls-session-cache-timeout 60


/**
以TLS模式手动运行Redis服务器（假设示例证书/密钥是可用的）：
./src/redis-server --tls-port 6379 --port 0 \
    --tls-cert-file ./tests/tls/redis.crt \
    --tls-key-file ./tests/tls/redis.key \
    --tls-ca-cert-file ./tests/tls/ca.crt
    
使用redis-cli连接到此Redis服务器：
./src/redis-cli --tls \
    --cert ./tests/tls/redis.crt \
    --key ./tests/tls/redis.key \
    --cacert ./tests/tls/ca.crt
*/

############################## GENERAL（通配）##################################

//默认情况下，Redis不作为守护进程运行（老版本默认）。如果需要可以修改daemonize为‘yes’
//注意，Redis在守护进程时会在var/run/redis.pid中写入一个pid文件。当Redis被upstart或systemd监管时，这个参数没有影响。
daemonize no
 
//当Redis以上述守护进程方式运行时，Redis默认会把进程文件写入/var/run/redis_6379.pid文件
pidfile /var/run/redis_6379.pid


 
//指定日志记录级别，四个级别：
//1) debug：很多信息，方便开发、测试
//2) verbose：许多有用的信息，但是没有debug级别信息多
//3) notice：适当的日志级别，适合生产环境（默认）
//4) warning：只记录非常重要/关键的消息
//5）nothing：什么都不记录
loglevel notice
 
  
//指定日志文件记录的位置。logfile “”：标准输出。则日志将会发送给/dev/null
logfile “”  

//要启用对系统记录器的日志记录，只需将“syslog enabled”设置为yes，并根据需要更新其他syslog参数即可。
# syslog-enabled no
//系统日志标识
# syslog-ident redis
//指定系统日志功能。必须是USER或介于LOCAL0-LOCAL7之间。
# syslog-facility local0

 
//禁用内置的崩溃日志记录
# crash-log-enabled no
//禁用作为崩溃日志一部分运行的快速内存检查，这可能会让redis提前终止
# crash-memcheck-enabled no

//设置数据库的数量，默认数量是16，默认数据库是DB 0，客户端可以使用select＜dbid＞在每个连接的基础上选择不同的数据库，其中dbid是介于0和“databases”-1之间的数字
databases 16
 
//默认情况下，Redis只有在开始登录到标准输出时，以及如果标准输出是TTY并且syslog日志记录被禁用时，才会显示ASCII艺术徽标。基本上，这意味着通常只有在交互式会话中才会显示徽标。但是，通过将以下选项设置为yes，可以强制执行4.0之前的行为，并始终在启动日志中显示ASCII艺术徽标。
# always-show-logo no

//默认情况下，Redis会修改进程标题（如“top”和“ps”中所示）以提供一些运行时信息。通过将以下设置为否，可以禁用此功能并将进程名称保留为已执行状态。
#set-proc-title yes

//在更改流程标题时，Redis使用以下模板构建修改后的标题。模板变量用大括号指定。支持以下变量：
//｛title｝如果为父进程，则执行的进程的名称，或子进程的类型。
//｛listen-addr｝绑定地址或“”，然后是正在侦听的TCP或TLS端口，或者Unix套接字（如果只有可用的话）。
//｛server-mode｝特殊模式，即“[ssentinel]”或“[cluster]”。
//｛port｝TCP端口正在侦听，或0。
//｛tls-port｝tls端口正在侦听，或0。
//｛unixsocket｝Unix域套接字正在侦听，或“”。
//｛config file｝使用的配置文件的名称。
proc-title-template "{title} {listen-addr} {server-mode}"

//设置用于字符串比较操作的本地环境，会影响Lua脚本的性能。空字符串表示区域设置是从环境变量派生的。
locale-collate ""


################################ SNAPSHOTTING （RDB持久化配置） ################################
//save将数据库保存到磁盘。
//save＜seconds＞＜changes＞〔＜seconds〕＜changes〕…〕如果经过给定的秒数，并且超过了对数据库的给定写入操作数，Redis将保存数据库。可以组合设置多种情况，如下面所示：
# save 3600 1 300 100 60 10000
//使用单个空字符串参数可以完全禁用保存，如下例所示：
# save ""

//在持久化过程成如果出现错误是否停止向redis写入数据。
stop-writes-on-bgsave-error yes

//是否在持久化的时候使用LZF方式压缩字符串对象。
rdbcompression yes

//由于在RDB的版本5中CRC64校验和被放置在文件的末尾。这使格式更不容易损坏，但在保存和加载RDB文件时会对性能造成影响（约10%），因此我们可以禁用它以获得最大性能。在禁用校验和的情况下创建的RDB文件的校验和为零，这将告诉加载代码跳过检查校验和。
rdbchecksum yes

//持久化文件名，默认dump.rdb
dbfilename dump.rdb


//在未启用持久性的实例中删除复制使用的RDB文件。默认情况下，此选项处于禁用状态。注意，此选项仅适用于同时禁用AOF和RDB持久性的实例，否则将被完全忽略。
rdb-del-sync-files no

//持久化的工作目录，AOF文件也会写在这里。
dir ./


################################# REPLICATION （主从配置） #################################
//使当前的Redis实例成为另一个Redis服务器的从节点。 
# replicaof <masterip> <masterport>

//从服务器复制主服务器时需要输入密码(如果有)
# masterauth <master-password>

//如果使用的是Redis ACL（适用于Redis版本6或更高版本），并且默认用户无法运行PSYNC命令和或复制所需的其他命令，则在这种情况下，最好配置一个特殊用户用于复制
# masteruser <username>

//指定masteruser后，从节点将使用新的AUTH形式对其master进行身份验证：AUTH＜username＞＜password＞。当从节点失去与主节点的连接时，或者当复制仍在进行中时，从节点可以通过两种不同的方式进行操作：
//1）如果replica-serve-stale-data为“yes”（默认值），则从节点仍将应答客户端请求，可能使用过期的数据，或者如果这是第一次同步，则数据集可能只是空的。
//2） 如果replica-serve-stale-data为“no”，则从节点将对所有数据访问命令（不包括以下命令）回复错误“MASTERDOWN与MASTER的链接已断开
replica-serve-stale-data yes

//从节点是否只能接收客户端的读请求
replica-read-only yes
 
//是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。
//有2种方式：
//  1) disk：master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。
//  2) socket：master创建一个新的进程，直接把rdb文件以socket的方式发给slave。
// disk方式时，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。
// socket方式就得一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
repl-diskless-sync no
 
//如果是无硬盘传输，如果预期的最大副本数已连接，则可以在最大延时之前进行复制,在主服务器配置
//repl-diskless-sync-max-replicas <int> 默认 0 标识未定义
repl-diskless-sync-max-replicas 0

  
//diskless复制的延迟时间，防止设置为0。一旦复制开始节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来
repl-diskless-sync-delay 5
 
 
//警告：由于在此设置中，副本不会立即将RDB存储在磁盘上，因此在故障切换过程中可能会导致数据丢失。RDB无盘加载+Redis模块不处理IO读取可能会导致Redis在与主机的初始同步阶段出现IO错误时中止。
//从节点可以直接从套接字加载它从复制链接读取的RDB，或者将RDB存储到一个文件中，并在完全从主机接收到该文件后读取该文件。
//在许多情况下，磁盘比网络慢，存储和加载RDB文件可能会增加复制时间（甚至会增加主机的写时拷贝内存和副本缓冲区）。
//当直接从套接字解析RDB文件时，为了避免数据丢失，只有当新数据集完全加载到内存中时，才可以安全地刷新当前数据集，从而导致更高的内存使用率，针对这些问题提供了下面的几个方案：
//disable：不使用 无硬盘方案
//on-empty-db：只有在完全安全才使用无硬盘
//swapdb：在解析socket的rdb数据时，将当前数据库的数据放到内存中，这样可以在复制的时候为客户端提供服务，但是可能会造成内存溢出
//我们可以通过配置项repl-diskless-load来修改，默认是disable
repl-diskless-load disabled
 
//Master在预定义的时间间隔内向其副本发送PING。可以使用repl_ping_replica_period选项更改此间隔。默认值为10秒。
# repl-ping-replica-period 10

//设置主从之间的超时时间，这里的超时有多种含义：
//1）从从节点的角度来看，SYNC期间的大容量传输IO。
//2）从从节点（数据、ping）的角度来看，主机超时。
//3）从主机的角度来看，从节点超时（REPLCONF ACK ping）。
//重要的是要确保此值大于为从节点周期指定的值，否则每次主机和从节点之间的流量较低时都会检测到超时。默认值为60秒。
# repl-timeout 60


//是否禁止复制tcp链接的tcp nodelay参数，默认是no，即使用tcp nodelay。
//如master设置了yes，在把数据复制给slave时，会减少包的数量和更小的网络带宽。但这可能会增加数据在slave端出现的延迟，对于使用默认配置的Linux内核，延迟时间可达40毫秒
//如master设置了no，数据出现在slave端的延迟将减少，但复制将使用更多带宽。
//默认我们推荐更小的延迟，但在数据量传输很大的场景下，或者当主服务器和副本相距许多跳时，建议选择yes。
repl-disable-tcp-nodelay no

 
//repl-backlog-size设置复制缓冲区大小。backlog是一个缓冲区，这是一个环形复制缓冲区，用来保存最新复制的命令。当副本断开连接一段时间时，它会累积副本数据，因此当副本想要再次连接时，通常不需要完全重新同步，但部分重新同步就足够了，只需传递副本在断开连接时丢失的部分数据。复制缓冲区越大，复制副本能够承受断开连接的时间就越长，以后能够执行部分重新同步。只有在至少连接了一个复制副本的情况下，才会分配缓冲区，没有复制副本的一段时间，内存会被释放出来，默认1mb。
# repl-backlog-size 1mb

//在一段时间内主机没有连接的副本后，复制缓冲区backlog的占用内存将被释放，repl-backlog-ttl设置该时间长度。单位为秒，值为0意味着永远不会释放该缓冲区！
# repl-backlog-ttl 3600

//副本优先级是Redis在INFO输出中发布的一个整数。Redis Sentinel使用它来选择复制副本，以便在主副本无法正常工作时将其升级为主副本。优先级较低的副本被认为更适合升级。
//例如，如果有三个优先级为10、100、25的副本，Sentinel将选择优先级为10的副本，即优先级最低的副本。但是，0的特殊优先级将该副本标记为无法执行主机角色，因此Redis Sentinel永远不会选择优先级为0的副本进行升级。默认情况下，优先级为100
replica-priority 100


传播错误行为控制Redis在无法处理在复制流中从主机处理的命令或在读取AOF文件时处理的命令时的行为（同步的RDB或AOF中的指令出现错误时的处理方式）。
//传播过程中发生的错误是意外的，可能会导致数据不一致。
//然而，在早期版本的Redis中也存在一些边缘情况，服务器可能会复制或持久化在未来版本中失败的命令。因此，默认行为是忽略此类错误并继续处理命令。
//如果应用程序希望确保没有数据分歧，则应将此配置设置为“panic”。该值也可以设置为“panic on replicas”，以仅在复制流中复制副本遇到错误时才死机。一旦有足够的安全机制来防止误报崩溃，这两个恐慌值中的一个将在未来成为默认值。通常传播控制行为有以下可选项：
//1）ignore: 忽略错误并继续执行指令   默认值
//2）panic:   不知道
//3）panic-on-replicas:  不知道
# propagation-error-behavior ignore



//当复制副本无法将从其主机接收到的写入命令持久化到磁盘时忽略磁盘写入错误控制的行为。默认情况下，此配置设置为“no”，在这种情况下会使复制副本崩溃。不建议更改此默认值，但是，为了与旧版本的Redis兼容，可以将此配置切换为“yes”，这只会记录一个警告并执行从主机获得的写入命令。
# replica-ignore-disk-write-errors no

//默认情况下，Redis Sentinel在其报告中包括所有副本。复制品可以从Redis Sentinel的公告中排除。未通知的副本将被“sentinel replicas＜master＞”命令忽略，并且不会暴露给Redis sentinel的客户端。
//此选项不会更改复制副本优先级的行为。即使已宣布的复制副本设置为“no”，复制副本也可以升级为主副本。若要防止这种行为，请将副本优先级replica-priority设置为0。
# replica-announced yes

//如果从库的数量少于N个 并且 延时时间小于或等于N秒 ，那么Master将停止发送同步数据
//计算方式:
//	从库数量: 根据心跳
//	延时: 根据从库最后一次ping进行计算，默认每秒一次
//例子：
//	最少需要3个延时小于10秒的从库，才会发送同步
//	min-replicas-to-write 3 
//	min-replicas-max-lag 10   
//如果这两项任意一项的值为0则表示禁用
//默认情况下，要写入的最小复制副本min-replicas-to-write设置为0（功能已禁用），最小复制副本最大滞后设置min-replicas-max-lag为10。
# min-replicas-to-write 3
# min-replicas-max-lag 10


 
//Slave需要向Master声明实际的ip和port。Redis主机能够以不同的方式列出连接的副本的地址和端口。例如，“INFO replication”部分提供了这些信息，Redis Sentinel在其他工具中使用这些信息来发现副本实例。该信息可用的另一个地方是在主控器的“ROLE”命令的输出中。
//复制副本通常报告的列出的IP地址和端口通过以下方式获得：
//1）ip：通过检查复制副本用于连接主机的套接字的对等地址，可以自动检测地址。
//2）port：该端口在复制握手期间由复制副本进行通信，通常是复制副本用于侦听连接的端口。
//当使用端口转发或网络地址转换（NAT）时，副本实际上可能可以通过不同的IP和端口对访问。复制副本可以使用以下两个选项向其主机报告一组特定的IP和端口，以便INFO和ROLE都报告这些值。
# replica-announce-ip 5.5.5.5
# replica-announce-port 1234


############################### KEYS TRACKING（key失效管理） #################################
//Redis实现了对客户端缓存值的服务器辅助支持。这是使用一个无效表来实现的，该表使用按密钥名称索引的基数密钥来记住哪些客户端具有哪些密钥。反过来，这被用来向客户端发送无效消息，详情查阅：https://redis.io/topics/client-side-caching
//当为客户端启用跟踪时，假设所有只读查询都被缓存：这将迫使Redis将信息存储在无效表中。当密钥被修改时，这些信息会被清除，并向客户端发送无效消息。然而，如果工作负载主要由读取控制，Redis可能会使用越来越多的内存来跟踪许多客户端获取的密钥
//因此，可以为无效表配置最大填充值。默认情况下，它被设置为1M的键，一旦达到这个限制，Redis将开始收回无效表中的键，即使它们没有被修改，只是为了回收内存：这将反过来迫使客户端使缓存的值无效。基本上，表的最大大小是在服务器端用来跟踪谁缓存了什么信息的内存和客户端在内存中保留缓存对象的能力之间进行权衡。
//如果将该值设置为0，则表示没有限制，Redis将在无效表中保留所需数量的键。在“stats”INFO部分，您可以在每个给定时刻找到关于无效表中键数的信息。
//注意：当在广播模式下使用密钥跟踪时，服务器端不使用内存，因此此设置无效!!!!
# tracking-table-max-keys 1000000


################################## SECURITY（安全设置） ###################################
//由于Redis速度相当快，外部用户每秒可以在一个现代盒子上尝试多达100万个密码。这意味着我们应该使用非常强的密码，否则它们很容易被破坏。redis推荐使用长且不可破解的密码将不可能进行暴力攻击，关于ACL配置的详细描述可以查阅：https://redis.io/topics/acl
//Redis ACL用户的定义格式如下：user <username> ... acl rules ...
//示例：
# user worker +@list +@connection ~jobs:* on >ffa9203c493aa99

//ACL日志跟踪与ACL关联的失败命令和身份验证事件。ACL日志可用于对ACL阻止的失败命令进行故障排除。ACL日志存储在内存中。可以使用ACL LOG RESET回收内存。通过acllog-max-len 定义ACL日志的最大条目长度，默认128：
acllog-max-len 128

//可以使用独立的外部ACL文件配置ACL用户，而不是在rdis.conf文件中配置。这两种方法不能混合使用：如果在这里配置用户，同时激活外部ACL文件，服务器将拒绝启动。外部ACL用户文件的格式与redis.conf中用于描述用户的格式完全相同
# aclfile /etc/redis/users.acl

//requirepass用来设置Redis连接密码
//重要提示：从Redis 6开始，“requirepass”只是新ACL系统之上的一个兼容层。选项效果将只是为默认用户设置密码。客户端仍将像往常一样使用AUTH＜password＞进行身份验证，或者更明确地使用AUTH默认＜password＞（如果它们遵循新协议）进行身份验证：两者都可以工作。requirepass与aclfile选项和ACL LOAD命令不兼容，这将导致requirepass被忽略。
# requirepass foobared


//默认情况下，新用户通过ACL规则“off resetkeys -@all”的等效项使用限制性权限进行初始化。
//从Redis 6.2开始，也可以使用ACL规则管理对PubSub通道的访问。如果新用户受acl PubSub默认配置指令控制，则默认PubSub通道权限，该指令接受以下值之一：
//1）allchannels: 授予对所有PubSub频道的访问权限｝
//2）resetchannels: 取消对所有PubSub频道的访问
//从Redis 7.0开始，acl pubsub默认为“resetchannels”权限！！！
# acl-pubsub-default resetchannels

//可以在共享环境中更改危险命令的名称。例如，CONFIG命令可能会被重命名为难以猜测的东西，这样它仍然可以用于内部使用的工具，但不能用于一般客户端，示例
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
//也可以通过将命令重命名为空字符串来完全终止命令，示例：
# rename-command CONFIG ""
//警告：如果可能，请避免使用此选项。相反，使用ACL从默认用户中删除命令，并将它们只放在您为管理目的创建的某个管理用户中。
//警告：更改记录到AOF文件或传输到副本的命令的名称可能会导致问题


############################CLIENTS（客户端）###（需记）###############################
//maxclients设置同时连接的客户端的最大数量。默认情况下为10000个，但是，如果受限于机器资源限制，则允许的客户端的最大数量将设置为当前文件限制减去32（因为Redis需要保留一些文件描述符供内部使用）。
//一旦达到限制，Redis将关闭所有新连接，并发送错误“达到最大客户端数”。
//重要提示：使用Redis集群时，最大连接数也与集群总线共享：集群中的每个节点都将使用两个连接，一个传入，另一个传出。在非常大的集群的情况下，相应地调整限制大小是很重要的
# maxclients 10000


############################## MEMORY MANAGEMENT（内存策略管理） ################################
//maxmemory将内存使用限制设置为指定的字节数。当达到内存限制时，Redis将尝试根据所选的逐出策略删除密钥（请参阅maxmemory策略）。
//如果Redis无法根据策略删除密钥，或者策略设置为“noevision”，Redis将开始对使用更多内存的命令（如set、LPUSH等）进行错误回复，并将继续回复GET等只读命令。
//当使用Redis作为LRU或LFU缓存，或为实例设置硬内存限制（使用“noevision”策略）时，此选项通常很有用。
# maxmemory <bytes>

//maxmemory-policy最大内存策略：当达到最大内存时，Redis将如何选择要删除的内容。可以从以下行为中选择一种：
//1）volatile lru：使用近似lru驱逐，只驱逐具有过期集的密钥。
//）allkeys-lru：使用近似lru收回任何密钥
//3）volatile lfu：使用近似lfu驱逐，只驱逐具有过期集的密钥。
//4）allkeys-lfu->使用近似lfu收回任何密钥。
//5）volatile random：移除具有过期集的随机密钥。
//6）allkeys random：移除随机密钥，任意密钥。
//7）volatile ttl：删除最接近到期时间的密钥（次要ttl）
//8）noviction：不要收回任何内容，只在写入操作时返回一个错误。LRU表示最近最少使用LFU表示最不频繁使用  默认值
//LRU、LFU和volatile ttl都是使用近似随机化算法实现的。
# maxmemory-policy noeviction

//LRU、LFU和最小TTL算法不是精确算法，而是近似算法（为了节省内存），因此我们可以根据速度或准确性对其进行调整。默认值为5会产生足够好的结果。10非常接近真实的LRU，但成本更高。3更快，但不是很准确。
//默认情况下，Redis会检查五个键并选择最近使用最少的一个，也支持使用以下配置指令更改样本大小：
# maxmemory-samples 5


//驱逐处理被设计为在默认设置下运行良好。如果写入流量异常大，则可能需要增加此值。降低此值可以降低延迟，但存在驱逐处理有效性的风险0=最小延迟，10=默认值，100=进程而不考虑延迟
# maxmemory-eviction-tenacity 10



//从 Redis 5 开始，默认情况下，从节点会忽略 maxmemory 设置（除非在发生 failover故障转移后或者此节点被提升为 master 节点）。 这意味着只有 master 才会执行过期删除策略，并且 master 在删除键之后会对 replica 发送 DEL 命令。
//这个行为保证了 master 和 replicas 的一致性，但是若我们的 从 节点是可写的， 或者希望 从 节点有不同的内存配置，并且确保所有到 replica 写操作都幂等的，那么我们可以修改这个默认的行为 。通过eplica-ignore-maxmemory修改，默认是yes代表忽略: 
# replica-ignore-maxmemory yes

//过期key的处理执行策略如下：
//1）定时删除: 过期key，开启定时任务，过期时间到期执行
//2）惰性删除: 访问过期key的时候，将过期的key清理
//3）定期删除: 后台扫描过期的key ，默认过期key的数量不能超过内存10%，避免效果超过25%的CPU资源
//取值范围1 ~ 10  值越大CPU消耗越大，越频繁，默认值是1
# active-expire-effort 1


############################# LAZY FREEING（异步策略管理） ####################################
//针对redis内存使用达到maxmeory，并设置有淘汰策略时，在被动淘汰键时，是否采用lazy free机制。因为此场景开启lazy free, 可能使用淘汰键的内存释放不及时，导致redis内存超用，超过maxmemory的限制。默认值no
lazyfree-lazy-eviction no

//针对设置有TTL的键，达到过期后，被redis清理删除时是否采用lazy free机制。此场景建议开启，因TTL本身是自适应调整的速度。默认值no
lazyfree-lazy-expire no

//针对有些指令在处理已存在的键时，会带有一个隐式的DEL键的操作。如rename命令，当目标键已存在,redis会先删除目标键，如果这些目标键是一个big key,那就会引入阻塞删除的性能问题。 此参数设置就是解决这类问题，建议可开启。默认值no
lazyfree-lazy-server-del no

//针对slave进行全量数据同步，slave在加载master的RDB文件前，会运行flushall来清理自己的数据场景，参数设置决定是否采用异常flush机制。如果内存变动不大，建议可开启。可减少全量同步耗时，从而减少主库因输出缓冲区爆涨引起的内存使用增长
replica-lazy-flush no

//对于替换用户代码DEL调用的情况，也可以这样做,使用UNLINK调用是不容易的，要修改DEL的默认行为。命令的行为完全像UNLINK。
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no

################################ THREADED I/O 线程IO管理 #################################
//Redis大多是单线程的，但也有一些线程操作，如UNLINK、慢速IO访问和其他在侧线程上执行的操作。
//建议：只有当确实存在性能问题时，才使用线程IO
//启用线程IO，可以设置参数io-threads，例如，如果有四个核心，请尝试使用2或3个IO线程，如果具有8个核心，则尝试使用6个线程，配置示例：
# io-threads 4

//将io线程设置为1将照常使用主线程。当启用IO线程时，我们只使用线程进行写入，也就是说，通过线程执行write（2）系统调用，并将客户端缓冲区传输到套接字。但是，也可以使用以下配置指令启用读取线程和协议解析，方法是将其设置为yes：
# io-threads-do-reads no


############################ KERNEL OOM CONTROL(内核oom控制) ##############################
//在Linux上，可以提示内核OOM杀手在内存不足时应该首先杀死哪些进程。
//启用此功能可以使Redis主动控制其所有进程的oom_score_adj值，具体取决于它们的角色。默认分数将尝试在所有其他进程之前杀死背景子进程，并在主进程之前杀死副本。
//Redis支持以下选项：
//1）no：不更改oom score adj（默认值）。
//2）yes：“相对”的别名，请参见下文。
//3）absolute：oom score adj中的值按原样写入内核。
//4）relative：当服务器启动时，使用相对于oom_score_adj初始值的值，然后将其限制在-1000到1000的范围内。因为初始值通常为0，所以它们通常与绝对值匹配。
//默认值no
oom-score-adj no


//当使用oom score adj时，此指令控制用于主进程、副本进程和后台子进程的特定值。数值范围为-2000到2000（越高意味着越有可能被杀死）。
oom-score-adj-values 0 200 800

#################### KERNEL transparent hugepage CONTROL  操作系统内存大页（THP）管理 ######################
//内存大页机制（Transport Huge Pages，THP），是linux2.6.38后支持的功能，该功能支持2MB的大爷内存分配，默认开启。常规的内存分配为4KB维度  
//参考资料：https://www.cnblogs.com/Brake/p/14354964.html
//通常，内核Transparent Jug Pages控件默认设置为“madvise”或“never”（syskernelmmtransparent_hugepageenabled），在这种情况下，此配置无效。在设置为“madvise”的系统上，redis将尝试专门针对redis进程禁用它，以避免fork（2）和CoW的延迟问题。如果出于某种原因喜欢启用它，可以将此disable-thp配置设置为“no”，并将内核全局设置为“always”。
//默认关闭了操作系统内存大页机制
disable-thp yes




############################## APPEND ONLY MODE(AOF持久化配置) ###############################
//AOF持久化，指定是否在每次更新操作后进行日志记录，默认redis是异步（快照）的把数据写入本地磁盘
//redis默认使用的是rdb方式持久化，此方式在许多应用中已足够用。
//但redis如果中途宕机，会导致可能有几分钟的数据丢失，按照上面save条件来策略进行持久化
//Append Only File是另一种持久化方式，可提供更好的持久化特性。
//Redis会把每次写入的数据在接收后都写入appendonly.aof 文件
//每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
//AOF和RDB持久性可以同时启用，而不会出现问题。如果在启动时启用了AOF，Redis将加载AOF，即具有更好耐用性保证的文件。
//更多资料查阅：https://redis.io/topics/persistence
appendonly no


//Redis 7及更新版本使用一组仅追加的文件来保存数据集和应用于数据集的更改。使用的文件有两种基本类型：
//1）Base files：基本文件，是表示创建文件时数据集完整状态的快照。基本文件可以是RDB（二进制序列化）或AOF（文本命令）的形式
//2）Incremental files：增量文件 其中包含在上一个文件之后应用于数据集的其他命令
//文件名的前缀基于“appendfilename”配置参数，默认为appendonly.aof
//例子:
//appendfilename "appendonly.aof"
//appendonly.aof.1.base.rdb 基础文件
//appendonly.aof.1.incr.aof, appendonly.aof.2.incr.aof 作为增量文件
//appendonly.aof.manifest  清单文件 
appendfilename "appendonly.aof"

//为了方便起见，Redis将所有持久的仅追加文件存储在一个专用目录中。目录的名称由appenddirname配置参数决定。
appenddirname "appendonlydir"


//AOF持久化三种同步策略：
//   1) no：不同步（不执行fsync），数据不会持久化
//   2) always：每次有数据发生变化时都会写入appendonly.aof（慢，安全）
//   3) everysec：每秒同步一次到appendonly.aof，可能会导致丢失这1s数据（折中选择，默认值）
appendfsync everysec
 
 //当AOF fsync策略设置为always或everysec，并且后台保存过程（后台保存或AOF日志后台重写）正在对磁盘执行大量IO时，在某些Linux配置中，Redis可能会在fsync（）调用上阻塞太长时间。请注意，目前还没有对此进行修复，因为即使在不同的线程中执行fsync也会阻止我们的同步write（2）调用，在最坏的情况下（使用默认的Linux设置）可能会丢失长达30秒的日志
//为了缓解这个问题，可以使用以下选项来防止在BGSAVE或BGREWRITEOF进行时在主进程中调用fsync（）
//如果有延迟问题，请将此选项设置为“yes”。否则，从耐用性的角度来看，默认配置no最安全的选择
no-appendfsync-on-rewrite no



 
# AOF自动重写配置。当目前AOF文件大小超过上一次重写的aof文件大小的百分之多少进行重写
# 即当AOF文件增长到一定大小时，Redis能调用bgrewriteaof对日志文件进行重写。
# 当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
auto-aof-rewrite-percentage 100
 
 
# 设置允许重写的最小AOF文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb

在Redis启动过程的最后，当AOF数据被加载回内存时，可能会发现AOF文件被截断。当Redis运行的系统崩溃时，尤其是当ext4文件系统在没有data=ordered选项的情况下挂载时，可能会发生这种情况（然而，当Redis本身崩溃或中止，但操作系统仍然正常工作时，这种情况就不会发生）


//aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。
//如果aof-load-truncated配置的是yes，当截断的aof文件被导入的时候，Redis会自动发布一个日志通知给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
//如果该选项设置为no，则服务器将因错误而中止并拒绝启动。当该选项设置为no时，用户需要在重新启动服务器之前使用“redis check AOF”实用程序修复AOF文件
aof-load-truncated yes


//AOF和RDB的混合持久化模式，Redis可以创建RDB或AOF格式的仅追加基础文件。使用RDB格式总是更快、更高效，只有出于向后兼容性的目的才支持禁用它。
aof-use-rdb-preamble yes


//Redis支持在AOF中记录时间戳注释，以支持特定时间点的恢复数据，但是可能会以一种与现有的AOF解析器不兼容的方式更改AOF格式，默认关闭
aof-timestamp-enabled no


################################ SHUTDOWN（关闭操作管理） #####################################
//shutdown-timeout是指关闭时等待复制副本的最长时间（秒）
//“shutdown-timeout的值是宽限期的持续时间（以秒为单位）。仅当实例具有副本时才适用。要禁用该功能，请将该值设置为0
# shutdown-timeout 10


//支持针对SIGINT / SIGTERM 这两个指令做出不同的解决方案
//取值范围 
//1）default:  如果有需要保存的数据，则等待RDB保存，且等待Slave同步
//2）save ： 即便有需要保存的数据，也会执行RDB
//3）nosave :  有保存点，也不执行RDB
//4）now ： 不等待Slave同步
//5）force ： 如果Redis关机遇到问题则忽略
//以上五个值，save 和 nosave不能一起使用外，其他都可以一起使用，例如
//shutdown-on-sigint nosave force now 
# shutdown-on-sigint default
# shutdown-on-sigterm default


################ NON-DETERMINISTIC LONG BLOCKING COMMANDS (非确定性长阻塞命令)#####################
//这是redis7.0的新增命令
//可以配置在Redis开始处理或拒绝其他客户端之前，EVAL脚本、函数以及某些情况下模块命令的最长时间（以毫秒为单位）。如果达到最长执行时间，Redis将开始回复带有BUSY错误的大多数命令
//在这种状态下，Redis将只允许执行少数命令。例如，SCRIPT KILL、FUNCTION KILL、SHUTDOWN NOSAVE，以及一些特定于模块的“允许繁忙”命令
//SCRIPT KILL和FUNCTION KILL只能停止尚未调用任何写入命令的脚本，因此在用户不想等待脚本的自然终止时脚本已经发出写入命令的情况下，SHUTDOWN NOSAVE可能是停止服务器的唯一方法
//默认值为5秒。可以将其设置为0或负值以禁用此机制（不间断执行）。
//在老版本中这个配置有一个不同的名称，redis7.0以后是一个新的别名，这两个名称的作用是相同的
# lua-time-limit 5000
# busy-reply-threshold 5000

################################ REDIS CLUSTER (集群配置) ###############################
//一个最小的集群需要最少３个主节点。第一次测试，强烈建议你配置６个节点：３个主节点和３个从节点
//普通Redis实例不能是Redis集群的一部分；只有作为集群节点启动的节点才能。为了将Redis实例作为集群节点启动，可以配置cluster-enabled值为yes
# cluster-enabled yes


//cluster-config-file是每个集群节点都有的单独一个集群配置文件。此文件不可手动编辑。它由Redis节点创建和更新。每个Redis Cluster节点都需要不同的群集配置文件。请确保在同一系统中运行的实例没有重叠的群集配置文件名。
# cluster-config-file nodes-6379.conf

//这是集群中的节点能够失联的最大时间，超过这个时间，该节点就会被认为故障。如果主节点超过这个时间还是不可达，则用它的从节点将启动故障迁移，升级成主节点。注意，任何一个节点在这个时间之内如果还是没有连上大部分的主节点，则此节点将停止接收任何请求。
# cluster-node-timeout 15000

//集群节点端口是集群总线将侦听入站连接的端口。当设置为默认值0时，它将绑定到命令端口+10000。设置此值要求在执行群集相遇时指定集群总线端口。
# cluster-port 0



//cluster-replica-validity-factor设置副本有效因子: 副本数据太老旧就不会被选为故障转移的启动者。副本没有简单的方法可以准确测量其“数据年龄”，因此需要执行以下两项检查：
//1)如果有多个复制副本能够进行故障切换，则它们会交换消息，以便尝试为具有最佳复制偏移量的副本提供优势（已经从master接收了尽可能多的数据的节点更可能成为新master）。复制副本将尝试按偏移量获取其排名，并在故障切换开始时应用与其排名成比例的延迟（排名越靠前的越早开始故障迁移）。
//2)每个副本都会计算最后一次与其主副本交互的时间。这可以是最后一次收到的PING或命令（如果主机仍处于“已连接”状态），也可以是与主机断开连接后经过的时间（如果复制链路当前已关闭）。如果最后一次交互太旧，复制副本根本不会尝试故障切换。
//第2点的值可以由用户调整。特别的，如果自上次与master交互以来，经过的时间大于(node-timeout * cluster-replica-validity-factor) + repl-ping-replica-period，则不会成为新的master。
//较大的cluster-replica-validity-factor可能允许数据太旧的副本故障切换到主副本，而太小的值可能会阻止群集选择副本。
//为了获得最大可用性，可以将cluster-replica-validity-factor设置为0，这意味着，无论副本上次与主机交互的时间是什么，副本都将始终尝试故障切换主机。（不过，他们总是会尝试应用与其偏移等级成比例的延迟）。
//0是唯一能够保证当所有分区恢复时，集群始终能够继续的值（保证集群的可用性）。
# cluster-replica-validity-factor 10


//cluster-migration-barrier主节点需要的最小从节点数，只有达到这个数，主节点失败时，它从节点才会进行迁移: master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1

//关闭此选项可以使用较少的自动群集配置。它既禁止迁移到孤立主机，也禁止从变空的主机迁移,默认yes
# cluster-allow-replica-migration yes


//cluster-require-full-coverage：部分key所在的节点不可用时，如果此参数设置为”yes”(默认值), 则整个集群停止接受操作；如果此参数设置为”no”，则集群依然为可达节点上的key提供读操作
//不建议打开该配置，这样会造成分区时，小分区的master一直在接受写请求，而造成很长时间数据不一致。
# cluster-require-full-coverage yes


//cluster-replica-no-failover是否自动故障转移,此选项设置为“yes”时，可防止复制副本在主机出现故障时尝试对其主机进行故障切换。但是，如果强制执行手动故障切换，复制副本仍然可以执行。
//这在不同的场景中都很有用，尤其是在多个数据中心运营的情况下，如果不是在完全DC故障的情况下的话，我们希望其中一方永远不会被提升为master
# cluster-replica-no-failover no

//cluster-allow-reads-when-down设置集群失败时允许节点处理读请求
//此选项设置为“yes”时，允许节点在集群处于关闭状态时提供读取流量，只要它认为自己拥有这些插槽。
//这对两种情况很有用。第一种情况适用于在节点故障或网络分区期间应用程序不需要数据一致性的情况。其中一个例子是缓存，只要节点拥有它应该能够为其提供服务的数据。
//第二个用例适用于不满足三个分片集群，但又希望启用群集模式并在以后扩展的配置。不设置该选项而使用1或2分片配置中的master中断服务会导致整个集群的读/写服务中断。如果设置此选项，则只会发生写中断。如果达不到master的quorum（客观宕机）数值，插槽所有权将不会自动更改。
# cluster-allow-reads-when-down no

//当该选项设置为yes时，允许节点在集群处于关闭状态时提供pubsub shard流量，只要它认为自己拥有插槽
//如果应用程序想要使用pubsub功能，即使集群全局稳定状态不正常，这也很有用。如果应用程序希望确保只有一个shard为给定通道服务，则此功能应保持为yes
# cluster-allow-pubsubshard-when-down yes

//集群链路发送缓冲区限制
//cluster-link-sendbuf-limit是以字节为单位的单个集群总线链路的发送缓冲区的内存使用限制。如果集群链接超过此限制，它们将被释放。这主要是为了防止发送缓冲区在指向慢速对等端的链接上无限增长（例如，PubSub消息堆积）。默认情况下禁用此限制。当“cluster links”命令输出中的“mem_cluster_links”INFO字段和或“send buffer allocated”条目持续增加时，启用此限制。建议最小限制为1gb，这样默认情况下集群链接缓冲区至少可以容纳一条PubSub消息。（客户端查询缓冲区限制默认值为1gb）
# cluster-link-sendbuf-limit 0

//集群可以使用此配置配置其公布的主机名,将其设置为空字符串将删除主机名并传播删除
# cluster-announce-hostname ""

//除了用于调试和管理信息的节点ID之外，集群还可以配置要使用的可选节点名。此名称在节点之间广播，因此在报告跨节点事件（如节点故障）时，除了节点ID外，还会使用此名称。
# cluster-announce-human-nodename ""


//设置告诉客户端使用何种方式连接集群（IP地址、用户自定义主机名、声明没有端点）；可以设置为“ip”、“hostname”、“unknown-endpoint”，用于控制MOVED/ASKING请求的返回和CLUSTER SLOTS的第一个字段（如果指定了hostname但没有公布主机名，则会返回“?”）；
# cluster-preferred-endpoint-type ip

########################## CLUSTER DOCKER/NAT support(关于NAT网络或者Docker的支持)  ########################
//在某些部署中，Redis Cluster节点的地址发现失败，原因是地址被NAT转发或端口被转发（典型的情况是Docker和其他容器）
//为了让Redis集群在这样的环境中工作，需要一个静态配置，每个节点都知道自己的公共地址。redis提供了以下四个配置项：
//1）cluster-announce-ip：节点地址
//2）cluster-announce-tls-port：客户端tls端口
//3）cluster-announce-port：客户端普通端口
//4）cluster-announce-bus-port：集群消息总线端口
//这些信息将发布在总线数据包的标头中，以便其他节点能够正确映射发布信息的节点的地址。
//请注意，如果tls-cluster设置为yes，并且cluster-announce-tls-port被省略或设置为零，则cluster-annaunce-port指tls端口。如果tls-cluster设置为no，则cluster-annotice-tls-port无效
# cluster-announce-ip 10.1.1.5
# cluster-announce-tls-port 6379
# cluster-announce-port 0
# cluster-announce-bus-port 6380


################################## SLOW LOG (慢日志管理)###################################
//Redis慢日志管理模块会记录超过指定执行时间的查询。执行时间不包括IO操作，如与客户端交谈、发送回复等，而只是实际执行命令所需的时间（这是命令执行的唯一阶段，线程被阻塞，在此期间无法为其他请求提供服务）
//redis提供了两个参数：
//1）slowlog-log-slower-than参数：告诉Redis需要超过多少执行时间才记录对应的命令，时间单位以微秒表示，因此1000000相当于一秒钟。需要特别注意的是:配置为负数将禁用慢速日志，而零值将强制记录每个命令。
//2）slowlog-max-len参数：慢日志的最大长度限制。这个长度配置没有限制。只要注意它会消耗内存。您可以使用SLOWLOG RESET回收慢速日志使用的内存。
//记录新命令时，最旧的命令将从记录的命令队列中删除。
slowlog-log-slower-than 10000
slowlog-max-len 128


################################ LATENCY MONITOR(延迟监控配置)##############################
//Redis延迟监测子系统在运行时对不同的操作进行采样，以收集与Redis实例的可能延迟源相关的数据。
//通过LATENCY相关命令，可以打印图形和获取报告的用户可以使用此信息
//系统只记录在等于或大于通过延迟监视器阈值配置指令latency-monitor-threshold指定的毫秒数的时间内执行的操作。当其值设置为零时，延迟监视器将关闭。
//默认情况下，延迟监控是禁用的，因为如果您没有延迟问题，则基本上不需要它，并且收集数据会对性能产生影响，虽然影响很小，但可以在大负载下进行测量。如果需要，可以在运行时使用命令“CONFIG SET latency-monitor-threshold <milliseconds>”轻松启用延迟监控。
latency-monitor-threshold 0

################################ LATENCY TRACKING（延迟信息追踪配置） ##############################
//Redis扩展延迟监控跟踪每个命令的延迟，并允许通过INFO latencystats命令导出百分比分布，以及通过latency命令导出累积延迟分布（直方图）。
//默认情况下，由于跟踪命令延迟的开销非常小，因此启用了扩展延迟监控。
# latency-tracking yes
//默认情况下，通过INFO latencystats命令导出的延迟百分比是p50、p99和p999
# latency-tracking-info-percentiles 50 99 99.9

############################# EVENT NOTIFICATION(事件通知管理) ##############################
//Redis可以将缓存key中发生的事件通知PubSub客户端，详细描述查阅：https://redis.io/topics/notifications
//例如，如果启用了缓存key事件通知，并且客户端对存储在数据库0中的key“foo”执行DEL操作，则将通过PubSub发布两条消息：
# PUBLISH __keyspace@0__:foo del
# PUBLISH __keyevent@0__:del foo

//可以在一组类中选择Redis将通知的事件。每类都有一个字符标识
//1）K     Keyspace eventsK键空间通知，所有通知以 keyspace@ 为前缀.
//2）E     Keyevent events键事件通知, 所有通知以 keyevent@ 为前缀
//3）g     DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知
//4）$     String 命令 字符串命令的通知
//5）l     List 命令 列表命令的通知
//6）s     Set 命令 集合命令的通知
//7）h     Hash 命令  哈希命令的通知
//8）z     Sorted set 有序集合命令的通知
//9）x     过期事件,每次key过期时生成的事件
//10）e     驱逐(evict)事件, 每当有键因为 maxmemory 策略而被删除时发送
//11）n    key创建事件 （不被A命令包含！）
//12）t     Stream 命令
//13）d     模块键类型事件
//14）m     key丢失事件 (不被A命令包含!)
//15）A     g$lshzxe 的简写  因此“AKE”字符串表示所有事件（由于其独特性质而被排除在“A”之外的关键未命中事件除外，比如n和m）
//“notify-keyspace-events”将由零个或多个类标识符组成的字符串作为参数。空字符串表示所有事件通知被禁用
//示例：启用列表命令事件l和常规事件，可以组合‘E’、‘l’、‘g’：
#  notify-keyspace-events Elg
//示例：获取订阅频道的key过期事件
# notify-keyspace-events Ex
//默认情况下，所有事件通知都被禁用，因为大多数用户不需要此功能，而且该功能有一些开销。请注意，如果没有指定K或E中的至少一个，j就算配置了别的标识符，也不会传递任何事件。
notify-keyspace-events ""


############################ ADVANCED CONFIG（高级配置） ###########################
//Redis 7中ziplist被listpack替代，所以相关配置都变为listpack。
//当散列具有少量条目，并且最大条目不超过给定阈值时，散列使用高效内存的数据结构进行编码。可以使用以下指令配置这些阈值。
hash-max-listpack-entries 512
hash-max-listpack-value 64

//list列表也以一种特殊的方式进行编码，以节省大量空间,每个内部列表节点允许的条目数可以指定为固定的最大大小或最大元素数。对于固定的最大大小，使用-5到-1，有下列几种情况：
//1）-5: max size: 64 Kb  <-- 不推荐用于正常工作负载
//2）-4: max size: 32 Kb  <-- 不推荐
//3）-3: max size: 16 Kb  <-- 可能不推荐
//4）-2: max size: 8 Kb   <-- 好  默认值
//5）-1: max size: 4 Kb   <-- 好
list-max-listpack-size -2

//list列表也可能被压缩。list-compress-depth配置是指一个quicklist两端不被压缩的节点个数。列表的头部和尾部总是未压缩的，以便进行快速的pushpop操作，
 1: ，中间的节点压缩。3: 。
//1）0: 表示都不压缩  默认值
//2）1: 在列表中的1个节点之后才开始压缩,从头压缩到尾：[head]->node->node->...->node->[tail]，[head]和[tail]不会被压缩; 中间的node才会被压缩
//3）2: 不要压缩头部或头部的下一个或尾部或者尾部的上一个或末尾，[head]->[next]->node->node->...->node->[prev]->[tail]  
//4）3: 表示quicklist两端各有3个节点不压缩，中间的节点压缩
list-compress-depth 0


//intset 、listpack和hashtable这三者的转换时根据要添加的数据、当前set的编码和阈值决定的。
//当集合中的元素全是整数,且长度不超过set-max-intset-entries(默认为512个)时,redis会选用intset作为内部编码，大于512用set
set-max-intset-entries 512
//如果要添加的数据是字符串，分为三种情况
//1)当前set的编码为intset：如果没有超过阈值，转换为listpack；否则，直接转换为hashtable
//2)当前set的编码为intset：如果没有超过阈值，转换为listpack；否则，直接转换为hashtable
//3)当前set的编码为hashtable：直接插入，编码不会进行转换
set-max-listpack-entries 128
set-max-listpack-value 64

//与散hash和列表list类似，sorted sets排序集也经过特殊编码，以节省大量空间。当zset同时满足zset-max-listpack-entries、zset-max-listpack-value时，会使用listpack作为底层结构，当zset中不满足这两个条件时，会使用skiplist作为底层结构。
zset-max-listpack-entries 128
zset-max-listpack-value 64

//HyperLogLog 是一种概率数据结构，用于在恒定的内存大小下估计集合的基数（不同元素的个数）。它不是一个独立的数据类型，而是一种特殊的 string 类型，它可以使用极小的空间来统计一个集合中不同元素的数量，也就是基数。一个 hyperloglog 类型的键最多可以存储 12 KB 的数据
//hyperloglog 类型的底层实现是 SDS（simple dynamic string），它和 string 类型相同，只是在操作时会使用一种概率算法来计算基数。hyperloglog 的误差率为 0.81%，也就是说如果真实基数为 1000，那么 hyperloglog 计算出来的基数可能在 981 到 1019 之间
//hyperloglog 类型的应用场景主要是利用空间换时间和精度，比如：
//1）统计网站的独立访客数（UV）
//2）统计在线游戏的活跃用户数（DAU）
//3）统计电商平台的商品浏览量
//4）统计社交网络的用户关注数
//5）统计日志分析中的不同事件数
//value大小 小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），大于hll-sparse-max-bytes使用稠密的数据结构（dense）。
hll-sparse-max-bytes 3000

//Streams单个节点的字节数，以及切换到新节点之前可能包含的最大项目数
//将其中一项设置为零，则会忽略该项限制。
//例如，可以通过将stream-node-max-bytes最大字节设置为0并将stream-node-max-entries最大条目设置为所需值来仅设置最大条目限制
stream-node-max-bytes 4096
stream-node-max-entries 100


//activerehashing指定是否激活重置哈希，默认为开启
//Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。
//当我们的业务使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，可以把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
activerehashing yes


//client-output-buffer-limit对单个客户端输出缓冲区限制,可用于强制断开由于某些原因而没有足够快地从服务器读取数据的客户端（一个常见的原因是PubSub客户端无法像发布者生成消息那样快速地使用消息）, 可以为三种不同类别的客户端设置不同的限制：
//1）normal -> 普通客户端，包括MONITOR客户端
//2）replica -> 从节点客户端
//3）pubsub -> 订阅了至少一个pubsub频道或模式的客户端
# client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>
//一旦达到hard limit硬限制，或者如果达到soft limit软限制并保持达到指定的秒数（连续），客户端将立即断开连接。例如，如果hard limit硬限制是32兆字节，soft limit软限制是16兆字节10秒，则如果输出缓冲区的大小达到32兆字节则客户端将立即断开连接，但如果客户端达到16兆字节并连续超过该限制10秒，客户端也将断开连接
//默认情况下，普通客户端不受限制，因为它们不会在没有请求的情况下（以推送方式）接收数据，而是在请求之后接收数据，因此只有异步客户端才能创建这样一种情况，即数据的请求速度快于读取速度，相反，pubsub和副本客户端有一个默认限制，因为订阅者和副本以推送方式接收数据
//通过将硬限制或软限制设置为0，可以禁用它们
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60


//client-query-buffer-limit对单个客户端的输入缓冲区限制配置，之前固定为1gb，在4.0之后改为可配置
# client-query-buffer-limit 1gb

//在某些情况下，客户端连接可能会占用内存，导致OOM错误或数据逐出。为了避免这种情况，我们可以限制所有客户端连接（所有pubsub和普通客户端）使用的累积内存。一旦我们达到这个限制，服务器就会按照一定策略杀掉问题客户端释放内存，从而丢弃连接。服务器将首先尝试使用最多内存来断开连接。我们称这种机制为“客户端驱逐”。
//客户端驱逐是使用maxmemory-clients配置的，配置为0代表禁用客户端驱逐功能，默认是0
//maxmemory-clients 0
//客户端逐出阈值配置示例：
# maxmemory-clients 1g

//百分比值（介于1%和100%之间）表示客户端逐出阈值基于最大内存设置的百分比。如果整机部署密度较高，建议配置一定百分比，但会有客户端被干掉的风险。配置实例：将客户端逐出设置为最大内存的5%
# maxmemory-clients 5%

//在Redis协议中，批量请求，即表示单个字符串的元素，通常限制为512 mb。但是，我们可以通过proto-max-bulk-len修改这个限制，但必须为1mb或更大
# proto-max-bulk-len 512mb

//Redis调用一个内部函数来执行许多后台任务，比如在超时时关闭客户端的连接，清除从未请求过的过期密钥，等等。并非所有任务都以相同的频率执行，但Redis会根据指定的“hz”值检查要执行的任务
//默认情况下，“hz”设置为10。当Redis空闲时，提高该值将使用更多的CPU，但当有多个key同时过期时，Redis将更具响应性，并且可以更精确地处理超时
//该范围在1到500之间，但是超过100的值通常不是一个好主意。大多数用户应该使用默认值10，并且只有在需要非常低延迟的环境中才能将其提高到100
hz 10

//通常情况下，有一个与连接的客户端数量成比例的HZ值是有用的。例如，这对于避免每次后台任务调用处理过多客户端以避免延迟峰值非常有用
//由于默认情况下默认的HZ值保守地设置为10，Redis提供并默认启用了使用自适应HZ值的能力，当有许多连接的客户端时，该值会暂时升高
//启用动态HZ时，实际配置的HZ将用作基线，但一旦连接了更多客户端，将根据需要实际使用配置的HZ值的倍数。通过这种方式，空闲实例将使用很少的CPU时间，而繁忙实例将更具响应性
dynamic-hz yes

//当一个子进程重写AOF文件时，如果启用下面的选项，则文件每生成4M数据会被同步，这对于避免大的延迟峰值非常有用
aof-rewrite-incremental-fsync yes

//当redis保存RDB文件时，如果启用以下选项，则每生成4MB的数据就会对该文件进行fsync，这对于避免大的延迟峰值非常有用
rdb-save-incremental-fsync yes

//Redis LFU逐出（请参阅maxmemory设置）可以进行调优。然而，最好从默认设置开始，只有在研究了如何提高性能以及键LFU如何随时间变化后才能更改它们，这可以通过OBJECT FREQ命令进行检查
//Redis LFU实现中有两个可调参数：计数器对数因子lfu-log-factor和计数器衰减时间lfu-decay-time。在更改这两个参数之前，了解它们的含义是很重要的。
# lfu-log-factor 10
# lfu-decay-time 1

########################### ACTIVE DEFRAGMENTATION(碎片整理) #######################
//主动（在线）碎片整理允许Redis服务器压缩内存中的空间，从而可以回收内存
//当碎片超过一定级别时（请参阅下面的配置选项），Redis将开始通过利用某些特定的Jemalloc功能在连续内存区域中创建值的新副本（以便了解分配是否会导致碎片，并将其分配到更好的位置），同时释放数据的旧副本。对所有key递增重复此过程将导致碎片降回正常值。需要注意的是：
//1）此功能默认禁用，仅当您编译Redis以使用我们随Redis源代码一起提供的Jemalloc副本时才有效。这是Linux构建的默认设置。
//2）如果没有碎片问题，则永远不需要启用此功能。
//3）一旦遇到碎片，我们可以在需要时使用命令“CONFIG SET activedefrag yes”启用此功能。
//碎片相关配置参数能够微调碎片整理过程的行为。如果我们不确定它们的含义，那么最好保留默认值
# activedefrag no
//启动活动碎片整理的最小内存碎片阈值
# active-defrag-ignore-bytes 100mb
//启动活动碎片整理的最小内存碎片百分比
# active-defrag-threshold-lower 10
//尝试释放的最大百分比
# active-defrag-threshold-upper 100
//最少CPU使用率
# active-defrag-cycle-min 1
//最大CPU使用率
# active-defrag-cycle-max 25
//将从主字典扫描处理的set hash zset list字段的最大数目 
# active-defrag-max-scan-fields 1000

//碎片整理的Jemalloc线程默认在后台运行
jemalloc-bg-thread yes

//可以将Redis的不同线程和进程固定到系统中的特定CPU，以最大限度地提高服务器的性能。这既有助于将不同的Redis线程固定在不同的CPU中，也有助于确保在同一主机中运行的多个Redis实例将固定到不同的CPU
//通常情况下，可以使用“taskset”命令来完成此操作，但在Linux和FreeBSD中，也可以通过Redis配置直接完成此操作,可以固定serverIO线程、bio线程、aof重写子进程和bgsave子进程。指定cpu列表的语法与taskset命令相同
//示例将redis server/io线程设置为cpu0,2,4,6:
# server_cpulist 0-7:2
//示例将bio线程设置为cpu 1,3:
# bio_cpulist 1,3
//示例将aof重写子进程设置为cpu8,9,10,11：
# aof_rewrite_cpulist 8-11
//示例将bgsave子进程设置为cpu1,10,11
# bgsave_cpulist 1,10-11

//在某些情况下，如果检测到系统处于坏状态，redis会发出警告，甚至拒绝启动。可以通过设置以下配置来抑制这些警告，该配置使用空格分隔的警告列表
# ignore-warnings ARM64-COW-BUG
```



## 八、基础知识-数据类型

redis中支持的数据类型主要分为三大类：五大基本数据类型、三大扩展数据类型、自定义数据类型：

 ![数据类型分类](http://cdn.gydblog.com/images/middleware/redis-datatypes.png)



Redis 所有的数据结构都是以唯一的key 字符串作为名称，然后通过这个唯一 key 值来获取相应的 value 数据。不同类型的数据结构的差异就在于 value 的结构不一样。

### 1、字符串(string)

#### 基本使用

string是redis最基本的类型，一个key对应一个value，一个key最大能存储512MB的value。

string类型是二进制安全的，在redis中的string可以包含任何数据，比如jpg图片或者序列化的对象 。下面演示用命令操作string类型的读写：

```
[root@XXX ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> set key1 'hello redis'
OK
127.0.0.1:6379> get key1
"hello redis"
127.0.0.1:6379> 
```

在以上实例中小郭使用了 Redis 的 **SET** 和 **GET** 命令。键为‘key1’，对应的值为‘hello redis’。



#### 底层结构

Redis 中的字符串是可以修改的字符串，在内存中它是以字节数组的形式存在的。Redis 的字符串叫「SDS」，也就是 Simple Dynamic String。它的结构是一个带长度信息的字节数组。

```
struct SDS<T> {
	T capacity; //表示所分配数组的长度，也就是数组最大容量   使用泛型表示的
	T len; // 表示字符串的实际占用长度    使用泛型表示的 
	byte flags; // 特殊标识位，不理睬它
	byte[] content; // 存储了真正的字符串内容   字节数组
}
```

上面的 SDS 结构使用了范型 T，为什么不直接用 int 呢 ？

这是因为当字符串比较短时，len 和 capacity 可以使用 byte 和 short 来表示，Redis 为了对内存做非常极致的优化，不同长度的字符串使用不同的结构体来表示。

![](http://cdn.gydblog.com/images/middleware/redis-str-1.png)

如上图所示，有几个点需要说明

-  redis内部为当前字符串实际分配的空间 capacity 一般要高于实际字符串长度 len. 

  初始创建字符串时 len 和 capacity 一样长，不会多分配冗余空间，这是因为绝大多数场景下我们不会使用 append 操作来修改字符串。

-  当字符串长度小于 1M 时，扩容都是加倍现有的空间 

-  超过 1M，扩容时一次只会多扩 1M 的空间 

-  字符串最大长度为 512M 

- 字符串是由多个字节组成，每个字节又是由 8 个 bit 组成，可以说在redis中一个字符串是很多 bit 的组合

String 在 Redis 中有三种编码方式： int、embstr、raw 。其中， raw 和 embstr 类型，都是基于动态字符串（SDS）实现的，int类型是当存储内容为整数时使用：

```
127.0.0.1:6379> set key2 a
OK
127.0.0.1:6379> get key2
"a"
127.0.0.1:6379> object encoding key2
"embstr"
127.0.0.1:6379> set key2 1
OK
127.0.0.1:6379> object encoding key2
"int"
127.0.0.1:6379> set key2 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
OK
127.0.0.1:6379> object encoding key2
"raw"
```

在redis中使用 string 类型时，尽可能让其长度小于 44 字节，或者使用整数表示，使其使用 EMBSTR 和 INT 编码。

关于redis编码类型的相关知识，接下来会有专门的章节来总结。

#### 常用命令

| 命令语法                          | 描述                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| SET key value                     | 设置指定 key 的值                                            |
| GET key                           | 获取指定 key 的值                                            |
| GETRANGE key start end            | 返回 key 中字符串值的子字符                                  |
| GETSET key value                  | 将给定 key 的值设为 value ，并返回 key 的旧值(old value)     |
| GETBIT key offset                 | 对 key 所储存的字符串值，获取指定偏移量上的位(bit)           |
| MGET key1 [key2..\]               | 获取所有(一个或多个)给定 key 的值                            |
| SETBIT key offset value           | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)     |
| SETEX key seconds value           | 将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)。 |
| SETNX key value                   | 只有在 key 不存在时设置 key 的值                             |
| SETRANGE key offset value         | 用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始。 |
| STRLEN key                        | 返回 key 所储存的字符串值的长度。                            |
| MSET key value [key value ...\]   | 同时设置一个或多个 key-value 对。                            |
| MSETNX key value [key value ...\] | 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。 |
| PSETEX key milliseconds value     | 这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位。 |
| INCR key                          | 将 key 中储存的数字值增一。                                  |
| INCRBY key increment              | 将 key 所储存的值加上给定的增量值（increment） 。            |
| INCRBYFLOAT key increment         | 将 key 所储存的值加上给定的浮点增量值（increment） 。        |
| DECR key                          | 将 key 中储存的数字值减一。                                  |
| DECRBY key decrement              | key 所储存的值减去给定的减量值（decrement） 。               |
| APPEND key value                  | 如果 key 已经存在并且是一个字符串， APPEND 命令将指定的 value 追加到该 key 原来值（value）的末尾。 |



### 2、哈希(hash)

#### 基本使用

Redis hash就是一个键值对集合，对应一个string类型的field和value的映射表。在 hash 类型中，field 与 value 一一对应，且不允许重复。

redis 本身就是一个 key-value 型数据库，因此 hash 数据结构相当于在 value 中又套了一层 key-value 型数据。

![hash存储结构](http://cdn.gydblog.com/images/middleware/redis-hash-4.png)

由于对象都有多个字段属性，hash特别适合用于存储对象，每个字段在映射表中对应一个field。使用示例如下：

```
127.0.0.1:6379> HMSET user username gyd age 18 phone 123
OK
127.0.0.1:6379> HGETALL user
1) "username"
2) "gyd"
3) "age"
4) "18"
5) "phone"
6) "123"
127.0.0.1:6379> 
```

以上示例中 hash 数据类型存储了包含用户脚本信息的用户对象。 我们使用了 Redis **HMSET, HEGTALL** 命令，**user** 为键值，映射表中了三个field分别是**username**、**age**、**phone**。

每个 hash 可以存储 2^32^ - 1 键值对（40多亿）。



#### 底层结构

hash 类型是 Redis 常用数据类型之一，其底层存储结构有两种实现方式。

1）第一种，当存储的数据量较少的时，hash 采用 ziplist （压缩列表）作为底层存储结构，需要同时满足以下两个条件：

- 哈希对象保存的所有键值对的键和值的字符串长度都小于64字节
- 哈希对象保存的键值对数量小于512个

ziplist的数据结构主要包括两层，第一层ziplist和第二层zipEntry。

- ziplist包括ZIP HEADER、ZIP ENTRY、ZIP END三个模块。

- ZIP ENTRY由prevlen、encoding&length、value三部分组成。

- prevlen主要是指前面zipEntry的长度，encoding&length是指编码字段长度和实际- 存储value的长度，value是指真正的内容。

- 每个key/value存储结果中key用一个zipEntry存储，value用一个zipEntry存储。

  

![ziplist](http://cdn.gydblog.com/images/middleware/redis-hash-2.png)



上述每一部分在内存中都是紧密相邻的，并承担着不同的作用，具体含义总结如下：

- ZIP_BYTES是一个无符号整数，表示当前 ziplist 占用的总字节数；

- ZIP_TAIL指的是压缩列表尾部元素相对于压缩列表起始元素的偏移量。

- ZIP_LENGTH指 ziplist 中 entry 的数量。当 zllen 比`2^16 - 2`大时，需要完全遍历 entry 列表来获取 entry 的总数目。

- ZIP_Entry用来存放具体的数据项（member），长度不定，可以是字节数组或整数，entry 会根据成员的数量自动扩容。

- ZIP_END是一个单字节的特殊值，等于 255，起到标识 ziplist 内存结束点的作用。

  

![zipentry](http://cdn.gydblog.com/images/middleware/redis-hash-3.png)

2）当无法满足上述条件时，hash 就会采用第二种方式来存储数据，也就是 dict（字典结构），也称为哈希表(hashtable)，该结构类似于 Java 的 HashMap，是一个无序的字典，并采用了数组和链表相结合的方式存储数据。在 Redis 中，dict 是基于哈希表算法实现的，因此其查找性能非常高效，其时间复杂度为 O(1)。

哈希表又称散列表，其初衷是将数据映射到数组中的某个位置上，这样就能够通过数组下标来访问该数据，从而提高数据的查找效率。下面通过一个示例，了解一下到底什么是哈希表。



假设现在有 1/5/8/ 这三个业务数据数字，需要把这三个数字映射到数组中，由于哈希表规定必须使用下标来访问数据，因此需要构建一个 0 到 8 的数组，如下所示：

![](http://cdn.gydblog.com/images/middleware/redis-hash-5.png)



如上图所示，通常我们把待查找的数字，在相应的下标数组上标记出来，它们之间一一对应。

虽然这样做能实现元素的查找，但却很浪费存储空间，并且查找效率也不高。Redis采用了哈希表，我们只需要申请一个长度为 3 的数组（与待查找的元素个数相同），如下图所示：

![](http://cdn.gydblog.com/images/middleware/redis-hash-6.png)

如上图所示，将 1/5/8 分别对数组长度 3 做取模运算，然后把它们指向运算结果对应的数组**槽位**，这样就把一组离散的数据映射到了连续的空间中，从而在最大限度上提高了空间的利用率，并且也提高了元素的查找效率。但是会出现一个问题，数字 5、8 竟然映射到同一个槽位上，这样就导致其中一个数字无法查找到。上述这种情况在实际中也会遇到，我们习惯把它称为“哈希冲突”或者“哈希碰撞”。

有许多方法可以解决“哈希冲突”，比如开放地址法、链表地址法，再次散列法等，而 Redis 采用是链表地址法。如下图所示：

![](http://cdn.gydblog.com/images/middleware/redis-hash-7.png)

如上图所示，即使发生了冲突，Redis也可以将数据存储在一起，最后，通过遍历链表的方式就找到上述发生“冲突”的数据。如下所示：



![](http://cdn.gydblog.com/images/middleware/redis-hash-1.png)

#### 常用命令

| 命令语法                                       | 描述                                                  |
| ---------------------------------------------- | ----------------------------------------------------- |
| HDEL key field1 [field2]                       | 删除一个或多个哈希表字段                              |
| HEXISTS key field                              | 查看哈希表 key 中，指定的字段是否存在                 |
| HGET key field                                 | 获取存储在哈希表中指定字段的值                        |
| HGETALL key                                    | 获取在哈希表中指定 key 的所有字段和值                 |
| HINCRBY key field increment                    | 为哈希表 key 中的指定字段的整数值加上增量 increment   |
| HINCRBYFLOAT key field increment               | 为哈希表 key 中的指定字段的浮点数值加上增量 increment |
| HKEYS key                                      | 获取哈希表中的所有字段                                |
| HLEN key                                       | 获取哈希表中字段的数量                                |
| HMGET key field1 [field2]                      | 获取所有给定字段的值                                  |
| HMSET key field1 value1 [field2 value2 ]       | 同时将多个 field-value (域-值)对设置到哈希表 key 中   |
| HSET key field value                           | 将哈希表 key 中的字段 field 的值设为 value            |
| HSETNX key field value                         | 只有在字段 field 不存在时，设置哈希表字段的值         |
| HVALS key                                      | 获取哈希表中所有值                                    |
| HSCAN key cursor [MATCH pattern] [COUNT count] | 迭代哈希表中的键值对，cursor 表示游标，默认为 0。     |



### 3、列表(List)

#### 基本使用

Redis列表是简单的字符串列表，按照插入顺序排序，支持添加一个元素到列表的头部（左边）或者尾部（右边）。

一个列表最多可以包含 2^32^ - 1 个元素 (4294967295, 每个列表超过40亿个元素)。

Redis 的列表也常被用作异步处理。可以被当做栈、队列来使用，如果列表的元素是“左进右出”那就是队列模型；如果元素是“右进右出”那就是栈模型，例如：一个线程将需要异步处理的任务序列化成字符串，并从左侧“放”进 Redis 列表中，而另外一个线程则以轮询的方式从该列表右侧中读取“任务”，这就实现了先进先出的队列效果。

#### 底层结构

Redis的列表相当于 Java 语言中的 LinkedList 结构，是一个双向链表而非数组，其插入、删除元素的时间复杂度为 O(1)，但是查询速度欠佳，时间复杂度为 O(n)。

它的底层存储结构，其实是一个被称为快速链表（quicklist，双向链表）的结构。当列表中存储元素较少时，Redis 会直接使用一块连续的内存来存储这些元素，这个连续的结构被称为 ziplist（压缩列表，*压缩列表是 Redis 为节省内存而开发的，它是由一系列特殊编码的连续内存块组成的顺序型数据结构，一个压缩列表了可以包含任意多个节点，每个节点都可以保存一个字符数组或者整数值*），它将所有的元素紧挨着一起存储。如果元素非常多时，Redis 列表就会优化成用 quicklist（快速链表）存储元素。

正是因为单独使用普通链表存储元素时，所需的空间较大，会造成存储空间的浪费。Redis 设计者巧妙的采用了链表和压缩列表这两种方法相结合的方式来存储元素，也就是 quicklist + ziplist，结构如下图：

![快速链表](http://cdn.gydblog.com/images/middleware/redis-list-1.jpg)

如上图 1 所示，将多个 ziplist 使用双向指针串联起来，这样既能满足快速插入、删除的特性，又节省了一部分存储空间。



#### 常用命令

| 命令语法                                | 描述                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| BLPOP key1 [key2 ] timeout              | 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止 |
| BRPOP key1 [key2 ] timeout              | 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止 |
| BRPOPLPUSH source destination timeout   | 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止 |
| LINDEX key index                        | 通过索引获取列表中的元素                                     |
| LINSERT key BEFORE \| AFTER pivot value | 在列表的指定元素前或者后插入元素                             |
| LLEN key                                | 获取列表长度                                                 |
| LPOP key                                | 移出并获取列表的第一个元素                                   |
| LPUSH key value1 [value2]               | 将一个或多个值插入到列表头部                                 |
| LPUSHX key value                        | 将一个值插入到已存在的列表头部                               |
| LRANGE key start stop                   | 获取列表指定范围内的元素                                     |
| LREM key count value                    | 移除列表元素                                                 |
| LSET key index value                    | 通过索引设置列表元素的值                                     |
| LTRIM key start stop                    | 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除 |
| RPOP key                                | 移除列表的最后一个元素，返回值为移除的元素                   |
| RPOPLPUSH source destination            | 移除列表的最后一个元素，并将该元素添加到另一个列表并返回     |
| RPUSH key value1 [value2]               | 在列表中添加一个或多个值到列表尾部                           |
| RPUSHX key value                        | 为已存在的列表添加值                                         |



### 4、集合(set)

#### 基本使用

Redis的Set是string类型的无序集合，有点类似于 Java 中的 `HashSet` 。

Redis set 是通过哈希映射表实现的，所以它的添加、删除、查找操作的时间复杂度为 O(1)。集合中最多可容纳 2^32 - 1 个成员（40 多亿个）。set有一个非常重要的特性就是“自动去重”，这使得它可以适用于许多场景，比如过滤掉已中奖用户的 id，保证该用户不会被第二次抽中。

我们可以基于 Set 轻易实现交集、并集、差集的操作，比如可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。这样的话，Set 可以非常方便的实现如共同关注、共同粉丝、共同喜好等功能。这个过程也就是求交集的过程，redis都提供了基本的功能命令。

#### 底层结构

set的底层存储结构有两种实现方式，分别是 intset（整型数组）与 hash table（哈希表）。

1）当 set 存储的数据满足以下要求时，使用 intset 结构：

- 集合内保存的所有成员都是整数值；
- 集合内保存的成员数量不超过 512 个。

Redis 中 intset 的结构体定义如下：

```c++
typedf struct inset{
    //指定编码方式，默认为INSET_ENC_INT16
    //共有三种，分别是 INTSET_ENC_INT16、INSET_ENC_INT32 和 INSET_ENC_INT64，它们对应不同的数值范围。Redis 为了尽可能地节省内存，它会根据插入数据的大小来选择不同的编码格式。
    uint32_t encoding;
    //集合内成员的数量，记录 contents 数组中共有多少个成员
    uint32_t length;
    //实际存储成员的数组，数组中的成员从小到大依次排列，且不允许重复。
    int8_t contents[];//实际存储成员的数组，并且数组中的数值从小到大依次排列
}inset;
```

![inset结构](http://cdn.gydblog.com/images/middleware/redis-set-1.jpg)

2）当不满足上述要求时，则使用 hash table 结构。

哈希表原理都大同小异，在前面总结哈希(hash)的时候已经说明过， set 的哈希表与其相似，这里不再重复总结。



#### 常用命令

| 命令语法                                       | 描述                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| SADD key member1 [member2]                     | 向集合添加一个或多个成员                             |
| SCARD key                                      | 获取集合的成员数                                     |
| SDIFF key1 [key2]                              | 返回第一个集合与其他集合之间的差异                   |
| SDIFFSTORE destination key1 [key2]             | 返回给定所有集合的差集并存储在 destination 中        |
| SINTER key1 [key2]                             | 求两个或多个集合的交集                               |
| SINTERSTORE destination key1 [key2]            | 求两个或多个集合的交集，并将结果保存到指定的集合中   |
| SISMEMBER key member                           | 判断 member 元素是否是集合 key 的成员                |
| SMEMBERS key                                   | 返回集合中的所有成员                                 |
| SMOVE source destination member                | 将 member 元素从 source 集合移动到 destination 集合  |
| SPOP key                                       | 移除并返回集合中的一个随机元素                       |
| SRANDMEMBER key [count]                        | 随机从集合中返回指定数量的元素，默认返回 1个         |
| SREM key member1 [member2]                     | 删除一个或者多个元素，若元素不存在则自动忽略         |
| SUNION key1 [key2]                             | 求两个或者多个集合的并集                             |
| SUNIONSTORE destination key1 [key2]            | 求两个或者多个集合的并集，并将结果保存到指定的集合中 |
| SSCAN key cursor [MATCH pattern] [COUNT count] | 迭代集合中的元素                                     |



### 5、有序集合(sorted set)

> 有序集合通常也被称为zset，下面的内容都使用zset来进行描述。

#### 基本使用

zset和set类似，set该有的特点它都具备，唯一不同的一点是zset是有序的，set 是无序的，这是因为zset中每个成员都会关联一个 double（双精度浮点数）类型的 score (分数值)，Redis 正是通过 score 实现了对集合成员的排序。

我们可以使用如下语法来创建一个zset：

```
127.0.0.1:6379> ZADD key score member [score member ...]  
```

- key：指定一个键名
- score：分数值，用来描述 member，它是实现排序的关键，可以重复
- member：要添加的成员（元素），不可以重复

zset中的成员（member）是唯一存在的，但是分数（score）却可以重复。zset的最大成员数为 2^32 - 1 (大约 40 多亿个)。

zset非常适用于排行榜类型的业务场景，比如 用户贡献榜、用户活跃度排行榜、QQ 音乐排行榜等。在音乐排行榜单中，我们可以将歌曲的点击次数作为 score 值，把歌曲的名字作为 value 值，通过对 score 排序就可以得出歌曲“热度榜单”。



#### 底层结构

zset底层也使用了两种不同的存储结构，分别是 zipList（压缩列表）和 skipList（跳跃列表）。

1）当 zset 满足以下条件时使用压缩列表ziplist：

- 成员的数量小于128 个；
- 每个 member （成员）的字符串长度都小于 64 个字节

ziplist的结构在前面的哈希(hash)数据类型介绍时已经说明过，唯一不同的一点是：

在zset中，ZIP_Entry用来存放具体的数据项（score和member），而哈希hash的ZIP_Entry只存了member。

**示例：**

下面执行`ZADD`命令添加两个成员：gyd1（代码小郭1） 的存款是 2100.0；gyd2（代码小郭2） 的存款是3400.0

```
[root@XXX ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> zadd deposit 2100 gyd1 3400 gyd2
(integer) 2
127.0.0.1:6379> 
```

内存中布局是如下的情况：

![ziplist](http://cdn.gydblog.com/images/middleware/redis-zset-1.jpg)

当 zset 使用上面的压缩列表ziplist保存数据时，zipentry 的第一个节点保存 成员member，第二个节点保存分数 score。依次类推，集合中的所有成员最终会按照 score 从小到大排列。

2）当zset不满足使用压缩列表的条件时，就会使用 跳跃表(skipList) 结构来存储数据。

跳跃列表（skipList）又称“跳表”是一种基于链表实现的随机化数据结构，其插入、删除、查找的时间复杂度均为 O(logN)。从名字可以看出“跳跃列表”，并不同于一般的普通链表，它的结构较为复杂，本节仅介绍最基础的知识。

在Redis 中一个 skipList 节点最高可以达到 64 层，一个“跳表”中最多可以存储 2^64 个元素，每个节点都是一个 skiplistNode（跳表节点）。skipList 的结构体定义如下：

```c++
typedf struct zskiplist{
    //指向 skiplist 的头节点指针，通过它可以直接找到跳表的头节点，时间复杂度为 O(1)
    struct zskiplistNode *header;
    //指向 skiplist 的尾节点指针，通过它可以直接找到跳表的尾节点，时间复杂度为 O(1)
    struct zskiplistNode *tail;
    // 记录 skiplist 的长度，也就跳表中有多少个元素，但不包括头节点
    unsigned long length;
    //记录当前跳表内所有节点中的最大层数（level）
    int level;
}zskiplist;
```

跳跃列表的每一层都是一个有序的链表，链表中每个节点都包含两个指针，一个指向同一层的下了一个节点，另一个指向下一层的同一个节点。最低层的链表将包含 zset 中的所有元素。如果说一个元素出现在了某一层，那么低于该层的所有层都将包含这个元素，也就说高层是底层的子集

下图演示一个上下共四层的跳跃列表结构：

![skiplist](http://cdn.gydblog.com/images/middleware/redis-zset-2.jpg)

跳跃列表中的每个节点都存储着 S:V（即 score/value），示意图显示了使用跳跃列表查找 S:V 节点的过程。跳跃列表的层数由高到低依次排列，最低层是 L0 层，最高层是 L3 层，共有 4 层。

如上图所示，首先从最高层开始遍历找到第一个`S:V`节点，然后从此节点开始，逐层下降，通过遍历的方式找出每一层的 S:V 节点，直至降至最底层（L0）才停止。在这个过程中找到所有 S:V 节点被称为期望的节点。跳跃列表把上述搜索一系列期望节点的过程称为“搜索路径”，这个“搜索路径”由搜索到的每一层的期望节点组成，其本质是一个列表。



#### 常用命令

| 命令语法                                       | 描述                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| ZADD key score1 member1 [score2 member2]       | 用于将一个或多个成员添加到有序集合中，或者更新已存在成员的 score 值 |
| ZCARD key                                      | 获取有序集合中成员的数量                                     |
| ZCOUNT key min max                             | 用于统计有序集合中指定 score 值范围内的元素个数              |
| ZINCRBY key increment member                   | 用于增加有序集合中成员的分值                                 |
| ZINTERSTORE destination numkeys key [key ...]  | 求两个或者多个有序集合的交集，并将所得结果存储在新的 key 中  |
| ZLEXCOUNT key min max                          | 当成员分数相同时，计算有序集合中在指定词典范围内的成员的数量 |
| ZRANGE key start stop [WITHSCORES]             | 返回有序集合中指定索引区间内的成员数量                       |
| ZRANGEBYLEX key min max [LIMIT offset count]   | 返回有序集中指定字典区间内的成员数量                         |
| ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT] | 返回有序集合中指定分数区间内的成员                           |
| ZRANK key member                               | 返回有序集合中指定成员的排名                                 |
| ZREM key member [member ...]                   | 移除有序集合中的一个或多个成员                               |
| ZREMRANGEBYLEX key min max                     | 移除有序集合中指定字典区间的所有成员                         |
| ZREMRANGEBYRANK key start stop                 | 移除有序集合中指定排名区间内的所有成员                       |
| ZREMRANGEBYSCORE key min max                   | 移除有序集合中指定分数区间内的所有成员                       |
| ZREVRANGE key start stop [WITHSCORES]          | 返回有序集中指定区间内的成员，通过索引，分数从高到低         |
| ZREVRANGEBYSCORE key max min [WITHSCORES]      | 返回有序集中指定分数区间内的成员，分数从高到低排序           |
| ZREVRANK key member                            | 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序 |
| ZSCORE key member                              | 返回有序集中，指定成员的分数值                               |
| ZUNIONSTORE destination numkeys key [key ...]  | 求两个或多个有序集合的并集，并将返回结果存储在新的 key 中    |
| ZSCAN key cursor [MATCH pattern] [COUNT count] | 迭代有序集合中的元素（包括元素成员和元素分值）               |



### 6、位图(Bitmaps)

#### 基本使用

Redis Bitmap 通过类似 map 结构存放 0 或 1 ( bit 位 ) 作为值。Redis 官方模拟了一个拥有 1 亿 2 千 8 百万用户的系统，然后使用 Redis 的位图来统计“日均用户数量”，最终所用时间的约为 50ms，且仅仅占用 16 MB内存。

Redis Bitmap适用于一些特定场景， 比如日活是否浏览过某个东西、用户每日签到、用户登录次数等。相比于直接使用字符串而言，位图中的每一条记录仅占用一个 bit 位，从而大大降低了内存空间使用率。

Redis 的bitmap数组是自动扩展的，如果设置了某个偏移位置超出了现有的内容范围，bitmap数组容量就会自动扩充。

下面演示如何使用bitmap。

我们设置一个key名称叫"keyone"，值设置为"he"， 字符"h"的八位二进制码是"01101000"，字符"e"的八位二进制码是"01100101"，两者的二进制连接起来是16位的二进制码0110100001100101，第一位的下标是 0，依次递增至 15，然后将二进制码中数字为 1 的位置标记出来，得到 位置1/2/4/9/10/13/15，我们把这组数字称为位的“偏置数”，最后按照上述偏置数对keyone 进行如下位图操作：

>  注意，key 的初始二进制位全部为 0。

```
127.0.0.1:6379> setbit keyone 1 1
(integer) 0
127.0.0.1:6379> setbit keyone 2 1
(integer) 0
127.0.0.1:6379> setbit keyone 4 1
(integer) 0
127.0.0.1:6379> get keyone
"h"
127.0.0.1:6379> setbit keyone 9 1
(integer) 0
127.0.0.1:6379> setbit keyone 10 1
(integer) 0
127.0.0.1:6379> setbit keyone 13 1
(integer) 0
127.0.0.1:6379> setbit keyone 15 1
(integer) 0
127.0.0.1:6379> get keyone
"he"
127.0.0.1:6379> 
```



#### 底层结构

bitmap本质上就是一个普通的字节串，也就是 bytes 数组。我们可以使用`getbit/setbit`命令来处理这个位数组，位图的结构如下所示：

![bitmaps](http://cdn.gydblog.com/images/middleware/redis-bitmap-1.jpg)

如上图所示，bitmap本质上就是一个普通的字符串(字节串)，也就是 bytes 数组。Redis 中一个字符串类型的值最多能存储 512 MB 的内容，每个字符串由多个字节组成，每个字节又由 8 个 Bit 位组成。bitmap结构正是使用“位”来实现存储的，它通过将比特位设置为 0 或 1来达到数据存取的目的，这大大增加了 value 存储数量，它存储上限为`2^32^ `。bitmap操作的优势，相比于字符串而言，它不仅效率高，而且还非常的节省空间。

#### 常用命令

| 命令语法                 | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| SETBIT key offset value  | 用来设置或者清除某一位上的值，其返回值是原来位上存储的值。key 在初始状态下所有的位都为 0 ，其中 offset 表示偏移量，从 0 开始 |
| GETBIT                   | 用来获取某一位上的值，当偏移量 offset 比字符串的长度大，或者当 key 不存在时，返回 0 |
| BITCOUNT key [start end] | 统计指定位区间上，值为 1 的个数。通过指定的 start 和 end 参数，可以让计数只在特定的字节上进行。start 和 end 参数和 [GETRANGE](http://c.biancheng.net/redis2/getrange.html) 命令的参数类似，都可以使用负数，比如 -1 表示倒数第一个位， -2 表示倒数第二个 |



### 7、基数统计(HyperLogLog)

> Redis 2.8.9 版本中新增了 HyperLogLog 类型
>
> 基数定义：一个集合中不重复的元素个数就表示该集合的基数，比如集合 {1,2,3,1,2} ，它的基数集合为 {1,2,3} ，所以基数为 3。HyperLogLog 正是通过基数估计算法来统计输入元素的基数。

#### 基本使用

HyperLogLog非常适用于海量数据的计算、统计，可以接受多个元素作为输入，并给出输入元素的基数估算值，其特点是:

- 占用空间小

​      **即使输入元素的数量或者体积非常非常大，计算基数所需的空间总是固定的、并且是很小的**,  HyperLogLog 只会根据输入元素来计算  基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素

- 计算速度快

HyperLogLog采用了一种基数估计算法，因此，最终得到的结果会存在一定范围的误差（标准误差为 0.81%）。每个 HyperLogLog key 只占用 12 KB 内存，理论上可以存储大约`2^64`个值，而 set（集合）则是元素越多占用的内存就越多，两者形成了鲜明的对比 。



HyperLogLog 适合特定的使用场景，例如统计网站用户月活量，或者网站页面的 UV(网站独立访客)数据等。

当一个网站拥有巨大的用户访问量时，我们就可以使用 Redis 的 HyperLogLog 来统计网站的 UV （网站独立访客）数据，它提供的去重计数方案，虽说不精确，但 0.81% 的误差足以满足 UV 统计的需求。

使用示例：

```
[root@XXX ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> PFADD uv:20231009 user1 user2 user3
(integer) 1
127.0.0.1:6379> PFCOUNT uv:20231009
(integer) 3
127.0.0.1:6379> PFADD uv:20231008 user4
(integer) 1
127.0.0.1:6379> PFCOUNT uv:20231008
(integer) 1
127.0.0.1:6379> PFMERGE uv:all uv:20231009 uv:20231008
OK
127.0.0.1:6379> PFCOUNT uv:all
(integer) 4
127.0.0.1:6379> PFCOUNT uv:20231009
(integer) 3
127.0.0.1:6379> PFADD uv:20231009 user1
(integer) 0
127.0.0.1:6379> PFCOUNT uv:20231009
(integer) 3
127.0.0.1:6379> 
```



#### 底层结构

HyperLogLog 的内部原理较为复杂，不建议大家深入研究，只要会用即可。小郭也不打算深入学习它啦！

#### 常用命令

| 命令语法                                  | 描述                                    |
| ----------------------------------------- | --------------------------------------- |
| PFADD key element [element ...]           | 添加指定元素到 HyperLogLog key 中。     |
| PFCOUNT key [key ...]                     | 返回指定 HyperLogLog key 的基数估算值。 |
| PFMERGE destkey sourcekey [sourcekey ...] | 将多个 HyperLogLog key 合并为一个 key。 |



### 8、地理位置(GEO)

> Redis GEO (全称geographic)主要用于存储地理位置信息，并对存储的信息进行操作，该功能在 Redis 3.2 版本新增。

#### 基本使用

GEO 有很多应用场景，比如外卖APP上会显示“店家距离你有多少米，打车APP上会显示司机师傅距离你有多远，类似这种功能就可以使用 Redis GEO 实现。数据库中存放着商家所处的经纬度，你的位置则由手机定位获取，这样 APP 就计算出了最终的距离。

微信中附近的人、摇一摇、实时定位等功能都依赖地理位置实现。

#### 底层结构

GEO的底层通过 Redis 有序集合（zset）实现。不过它并没有与 zset 共用一套的命令，而是拥有自己的一套命令。

#### 常用命令

** 1）GEOADD **

**语法：**

```
GEOADD key longitude latitude member [longitude latitude member ...]
```

**描述：**添加地理位置的坐标

- longitude：位置地点所处的经度；
- latitude：位置地点所处的纬度；
- member：位置名称

`GEOADD`命令能够记录的坐标数量是有限的，如果位置非常接近两极（南极/北极）区域，那么将无法被索引到。因此当您输入经纬度时，需要注意以下规则:  

- 有效的经度介于 -180 度至 180 度之间 
- 有效的纬度介于 -85.05112878 度至 85.05112878 度之间



** 2）GEODIST  **

**语法：**

```
GEODIST key member1 member2 [unit]  
```

**描述：**

计算两个位置之间的距离，返回值为双精度浮点数，计算举例时存在 0.5% 左右的误差，这是由于 Redis GEO 把地球假设成了完美的球体。<br>参数 unit 是表示距离单位，取值如下所示： 

- m 表示单位为米；如果没有指出距离单位，那么默认取值为`m`  
- km 表示单位为千米；
- mi 表示单位为英里； 
- ft 表示单位为英尺

** 3）GEORADIUS**

**语法：**

```
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC]
```

**描述：**

以给定的经纬度为中心，计算出 key 包含的地理位置元素与中心的距离不超过给定最大距离的所有位置元素，并将其返回。

- WITHDIST ：在返回位置元素的同时， 将位置元素与中心之间的距离也一并返回。
- WITHCOORD ：返回位置元素的经度和维度。
- WITHHASH ：采用 GEOHASH 对位置元素进行编码，以 52 位有符号整数的形式返回有序集合的分值，该选项主要用于底层调试，实际作用不大。
- COUNT：指定返回位置元素的数量，在数据量非常大时，可以使用此参数限制元素的返回数量，从而加快计算速度。

注意：该命令默认返回的是未排序的位置元素。通过 ASC 与 DESC 可让返回的位置元素以升序或者降序方式排列。



** 4）GEORADIUSBYMEMBER**

**语法：**

```
GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DES]
```

**描述：**

根据给定的地理位置坐标（即经纬度）获取指定范围内的位置元素集合。

georadiusbymember 和 GEORADIUS 命令一样， 都可以找出位于指定范围内的元素， 但是 georadiusbymember 的中心点是由给定的位置元素决定的， 而不是使用经度和纬度来决定中心点。

- m ：米，默认单位；
- km ：千米（可选）；
- mi ：英里（可选）；
- ft ：英尺（可选）；
- ASC：根据距离将查找结果从近到远排序；
- DESC：根据距离将查找结果从远到近排序。

** 5）GEOHASH**

**语法：**

```
GEOHASH key member [member ...]
```

**描述：**

Redis GEO 使用 geohash 来保存地理位置的坐标。geohash返回一个或多个位置元素的哈希字符串，该字符串具有唯一 ID 标识，它与给定的位置元素一一对应。

**6）ZREM**

**语法：**

```
zrem KEY member1 member2 member...
```

**描述：**

用于删除指定的地理位置元素



**7）ZPOS**

**语法：**

```
GEOPOS key member [member ...]
```

**描述：**

geopos 用于从给定的 key 里返回所有指定名称(member)的位置（经度和纬度），不存在的返回 nil。



### 9、自定义数据类型



## 九、基础知识-事务

### 1、简介

说到事务，大家可能最先想到的就是关系型数据库中的事务管理，其实redis中的事务也有类似的特点：

-  隔离性：事务是一个单独的隔离操作，事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
-  原子性：事务是一个原子操作，事务中的命令要么全部被执行，要么全部都不执行。

但是redis的事务和关系型数据库的事务有一个最大的区别：redis事务不会回滚，即使事务中有某条/某些命令执行失败了， 事务队列中的其他命令仍然会继续执行完毕。

**为什么 Redis 不支持回滚（roll back）?**

*redis官方文档中大概是这样解释的：*

1）redis 命令只会因为错误的语法而失败，或是命令用在了错误类型的键上面：也就是说，从实用性的角度来说，失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该带到生产环境中。

2）因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。



Redis 中的脚本(比如lua)本身也是一种事务， 所以任何在事务里可以完成的事， 在脚本里面也能完成。 并且一般来说， 使用脚本要来得更简单，并且速度更快。因为脚本功能是 Redis 2.6 才引入的， 而事务功能则更早之前就存在了， 所以 Redis 才会同时存在两种处理事务的方法。

本小节只总结原始的事务功能。

### 2、语法

MULTI 、 EXEC 、 DISCARD 和 WATCH 是 Redis 事务相关的命令。

#### 1）MULTI

MULTI负责开启一个事务，执行它总是返回’OK‘，只有当执行了MULTI，才可以继续接下来的操作。

MULTI执行之后， Redis客户端可以继续向服务器发送任意多条命令， 这些命令不会立即被执行， 而是被放到一个队列中， 当EXEC命令被调用时， 所有队列中的命令才会被执行。 通过调用DISCARD， 客户端可以清空事务队列， 并放弃执行事务。

#### 2）EXEC

EXEC命令负责触发并顺序执行事务的命令队列中的全部命令。

- 如果客户端在使用MULTI 开启了一个事务之后，却因为网络异常等情况而没有成功执行EXEC，那么事务中的所有命令都不会被执行。
- 如果客户端在成功使用MULTI开启事务之后执行EXEC，那么事务中的所有命令都会被执行。

当使用 AOF 方式做持久化的时候， Redis 会使用单个 write(2) 命令将事务写入到磁盘中，然而，如果 Redis 服务器因为某些原因被管理员杀死，或者遇上某种硬件故障，那么可能只有部分事务命令会被成功写入到磁盘中。

如果 Redis 在重新启动时发现 AOF 文件出了这样的问题，那么它会退出，并汇报一个错误。

使用`redis-check-aof`程序可以修复这一问题：它会移除 AOF 文件中不完整事务的信息，确保服务器可以顺利启动。

从 redis的2.2 版本开始，Redis 还可以通过乐观锁（optimistic lock）实现 CAS （check-and-set）操作。



以下是一个事务例子， 它原子地增加了 `A` 和 `B` 两个键的值：

```
[root@XXX ~]# redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> INCR A
QUEUED
127.0.0.1:6379(TX)> INCR B
QUEUED
127.0.0.1:6379(TX)> EXEC
1) (integer) 1
2) (integer) 1
127.0.0.1:6379> 
```

EXEC 命令的回复是一个数组， 数组中的每个元素都是执行事务中的命令所产生的回复。 其中， 回复元素的先后顺序和命令发送的先后顺序一致。

在 EXEC 命令执行之后所产生的错误， 并没有对它们进行特别处理： 即使事务中有某个/某些命令在执行时产生了错误， 事务中的其他命令仍然会被继续执行。

#### 3）DISCARD

通过DISCARD命令，客户端可以清空事务中的命令队列， 并放弃执行当前事务。

下面演示如何使用DISCARD: 

```
127.0.0.1:6379> SET AAA 10
OK
127.0.0.1:6379> GET AAA
"10"
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379(TX)> INCR AAA
QUEUED
127.0.0.1:6379(TX)> DISCARD
OK
127.0.0.1:6379> GET AAA
"10"
127.0.0.1:6379> 
```

在上面的示例中，创建了一个初始值为10的key"AAA"， 然后开启一个事务对该key进行自增，在执行EXEC之前，执行了DISCARD放弃执行。

#### 4）WATCH

假如我们在执行redis事务操作某些键的过程中，有其它客户端对相同的键做了修改，那么此时事务执行就会导致业务问题，Redis提供了WATCH机制来监控某个键是否被修改。

WATCH命令可以为 Redis 事务提供 check-and-set （CAS）行为。

被 WATCH 的键会被监视， 如果有至少一个被监视的键在EXEC执行之前被修改了， 那么整个事务都会被取消，EXEC返回nil-reply来表示事务已经失败。

WATCH 命令可以被调用多次。 对键的监视从WATCH执行之后开始生效， 直到调用 EXEC为止。当客户端断开连接时， 该客户端对键的监视也会被取消。

我们可以在单个WATCH 命令中监视任意多个键，示例：

```
redis> WATCH key1 key2 key3
OK
```



## 十、基础知识-淘汰策略

### 1、过期删除策略

Redis提供了四个命令来设置过期时间（生存时间）。

```
EXPIRE <key> <ttl> ：表示将键 key 的生存时间设置为 ttl 秒。
PEXPIRE <key> <ttl> ：表示将键 key 的生存时间设置为 ttl 毫秒。
EXPIREAT <key> <timestamp> ：表示将键 key 的生存时间设置为 timestamp 所指定的秒数时间戳。
PEXPIREAT <key> <timestamp> ：表示将键 key 的生存时间设置为 timestamp 所指定的毫秒数时间戳。
```

在Redis内部实现中，前面三个设置过期时间的命令最后都会转换成最后一个PEXPIREAT 命令来完成。

另外还有三个命令：

```
//移除键的过期时间
PERSIST <key> ：表示将key的过期时间移除。
```

```
//返回键的剩余生存时间
TTL <key> ：以秒的单位返回键 key 的剩余生存时间。
PTTL <key> ：以毫秒的单位返回键 key 的剩余生存时间。
```



*redis对于已过期的key，有下面两种清理策略：*

#### 1）定期删除

redis 会将每个设置了过期时间的 key 放入到一个独立的字典中，以后会定期遍历这个字典来删除到期的 key。

Redis 默认每秒进行十次过期扫描（100ms一次），过期扫描不会遍历过期字典中所有的 key，而是采用了一种简单的贪心策略：

```
a.从过期字典中随机 20 个 key；
b.删除这 20 个 key 中已经过期的 key；
c.如果过期的 key 比率超过 1/4，那就重复步骤 1；
```

redis默认是每隔 100ms就随机抽取一些设置了过期时间的key，检查其是否过期，如果过期就删除。注意这里是随机抽取的,为什么要随机呢？想一想假如 redis 存了几十万个 key ，每隔100ms就遍历所有的设置过期时间的 key 的话，就会给 CPU 带来很大的负载。 

在Redis 2.8 版本后，可以通过修改配置文件redis.conf 的 **hz** 选项来调整这个扫描次数，默认是10：

```
# The range is between 1 and 500, however a value over 100 is usually not
# a good idea. Most users should use the default of 10 and raise this up to
# 100 only in environments where very low latency is required.
hz 10
```



#### 2）惰性删除

惰性策略就是在客户端访问这个key的时候，redis对key的过期时间进行检查，如果过期了就立即删除，不会给你返回任何东西。



### 2、内存淘汰策略

>  redis.conf中MEMORY MANAGEMENT部分就是对内存淘汰策略的相关配置。

我们的机器资源是有限的，安装完redis之后最好是在redis根目录中找到redis.conf文件,在配置文件中设置redis的最大可用内存大小：

```
# 设置 Redis 最大使用内存大小为200M
maxmemory 200mb    //指定最大内存为200mb

# 下面的写法均合法：
# maxmemory 1024000
# maxmemory 1GB
# maxmemory 1G
# maxmemory 1024KB
# maxmemory 1024K
# maxmemory 1024MB
```

上面的配置，当 Redis 使用的内存超过 200Mb 时,就开始对数据进行淘汰。

每进行一次redis操作的时候，redis都会检测可用内存，判断是否要进行内存淘汰，当超过可用内存的时候，redis就会使用对应淘汰策略。

**内存淘汰策略有8种，分别如下：**

#### 1）no-envicition
该策略对于写请求不再提供服务，会直接返回错误，当然排除del等特殊操作，redis默认是no-envicition策略。

#### 2）allkeys-random
从redis的数据集（server.db[i].dict）随机选取key进行淘汰

#### 3）allkeys-lru
使用LRU（Least Recently Used，最近最少使用）算法，从redis从redis的数据集（server.db[i].dict）中选取使用最少的key进行淘汰

#### 4）volatile-random
从已设置过期时间的数据集中任意选择key，进行随机淘汰

#### 5）volatile-ttl
从已设置过期时间的数据集中选取即将过期的key，进行淘汰

#### 6）volatile-lru
使用LRU（Least Recently Used，最近最少使用）算法，从已设置过期时间的数据集中，选取最少使用的进行淘汰

#### 7）volatile-lfu
使用LFU（Least Frequently Used，最不经常使用），从设置了过期时间的键中选择某段时间之内使用频次最小的键值对清除掉

#### 8）allkeys-lfu
使用LFU（Least Frequently Used，最不经常使用），从所有的键中选择某段时间之内使用频次最少的键值对清除 

#### 9）配置项

上面这八种策略可以分为4种类型：lru、lfu、random、ttl。默认是no-envicition，可以通过修改配置redis.conf来调整策略：

```
每个配置项的具体含义可以查看文章的第七部分：七、基础知识-配置文件解读
```

```
############################## MEMORY MANAGEMENT（内存策略管理） ################################
# maxmemory <bytes>
# maxmemory-policy noeviction
# maxmemory-samples 5
# maxmemory-eviction-tenacity 10
# replica-ignore-maxmemory yes
# active-expire-effort 1
```



## 十一、基础知识-持久化机制

 redis 提供了两种持久化的方式，分别是**RDB**（Redis DataBase）和**AOF**（Append Only File）。

### 1、RDB

RDB 方式，是定期将 redis 某一时刻的数据持久化到磁盘中，是一种快照式的持久化方法。

#### 1）原理

Redis会单独创建一个子进程（执行文件IO操作），将数据写入到一个临时文件中，待持久化过程都结束了，才会用这个临时文件替换上次持久化好的文件。正是这种特性，让我们可以随时来进行备份，因为快照文件总是完整可用的。而主进程是不会进行任何 IO 操作的，这样也确保了 redis 极高的性能。

RDB持久化主要是通过SAVE和BGSAVE两个命令对Redis中当前的数据做snapshot并生成rdb文件来实现的。其中SAVE是阻塞的，BGSAVE是非阻塞的（通过fork了一个子进程来完成的）在Redis启动的时候会检查这些rdb文件，然后载入rdb文件中未过期的数据到服务器中。

#### 2）配置

RDB模块相关配置汇总如下：

> 每个配置项的具体含义可以查看文章的第七部分：[七、基础知识-配置文件解读]

```
################################ SNAPSHOTTING （RDB持久化配置） ################################
# save 3600 1 300 100 60 10000
# save ""
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir ./
```



### 2、AOF

#### 1）原理

AOF，英文是 Append Only File，即只允许追加不允许改写的文件。

和RDB相比，其实是换了一个角度来实现持久化，那就是将 redis 执行过的所有写指令记录下来，在下次 redis 重新启动时，只要把这些写指令按先后顺序再重复执行一遍，就可以实现数据恢复了。

通过配置 redis.conf 中的 appendonly yes 就可以打开 AOF 功能。

```
appendonly yes
```

开启AOF配置后，只要有写操作（如 SET 等），命令就会被追加到 AOF 文件的末尾。

默认的 AOF 持久化策略是每秒钟 fsync 一次（fsync 是指把缓存中的写指令记录到磁盘中）:

```
//everysec代表每秒一次，在这种情况下，redis 仍然可以保持很好的处理性能，即使 redis 故障，也只会丢失最近 1 秒钟的数据。
appendfsync everysec
```

如果在AOF追加日志时，恰好遇到磁盘空间满、inode 满或断电等情况导致日志写入不完整，也没有关系，redis 提供了 redis-check-aof 工具，可以用来进行日志修复。

**AOF 文件重写（rewrite）机制**

采用文件追加方式不断追加写入命令，且不做任何限制措施的话，会使得AOF 文件会变得越来越大。

因此，redis 设计者加入了 AOF 文件重写（rewrite）机制，即当 AOF 文件的大小超过所设定的阈值时，redis 就会主动压缩 AOF 文件的内容，只保留可以恢复数据的最小指令集。

举个栗子：假如我们对同一个key，执行了200次set指令，在 AOF 文件中就要存储 200 条指令，其实完全可以把这 200 条指令合并成一条 SET 指令，也就是取最后一次set指令进行追加就行了，这就是重写机制的核心逻辑。

**文件重写原理**

在进行 AOF 重写时，也是采用先写临时文件，全部完成后再替换的流程，所以断电、磁盘满等问题都不会影响 AOF 文件的可用性。

在重写即将开始时，redis 会创建（fork）一个“重写子进程”，这个子进程会首先读取现有的 AOF 文件，并将其包含的指令进行分析压缩写入到一个临时文件中。

与此同时，主工作进程会将新接收到的写指令一边累积到内存缓冲区中，一边继续写入到原有的 AOF 文件中，这样做是保证原有的 AOF 文件的可用性，避免在重写过程中出现意外。

当“重写子进程”完成重写工作后，它会给父进程发一个信号，父进程收到信号后就会将内存中缓存的写指令追加到新 AOF 文件中。

当追加结束后，redis 就会用新 AOF 文件来整体代替旧 AOF 文件，之后再有新的写指令，就都会追加到新的 AOF 文件中了。

#### 2）配置

AOF相关的配置项汇总如下：

> 每个配置项的具体含义可以查看文章的第七部分：[七、基础知识-配置文件解读]

```
################APPEND ONLY MODE(AOF持久化配置) ###############################
appendonly no
appendfilename "appendonly.aof"
appenddirname "appendonlydir"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
aof-timestamp-enabled no
```



### 3、总结

官方的建议是两种持久化方式同时使用，这样可以提供更可靠的持久化方案。在这种情况下，如果 redis 重启的话，则会优先采用 AOF 方式来进行数据恢复，这是因为 AOF 方式的数据恢复完整度更高。

如果项目中没有数据持久化的需求，也完全可以关闭 RDB 和 AOF 方式，这样的话，redis 将变成一个纯内存数据库，就像 memcache 一样。

*下面对AOF和RDB在多个维度做对比：*

**1）持久化方式**

RDB定时对整个内存做快照；AOF记录每一次执行的命令。

**2）数据完整性**

RDB不完整，两次备份之间会存在数据丢失；AOF相对完整，取决于刷盘策略配置。

**3）文件大小**

RDB有压缩，文件体积小；AOF记录命令，文件体积大，但是经过重写后会减小。

**3）宕机恢复速度**

RDB很快，AOF慢

**4）数据恢复优先级**

RDB低，因为数据完整性不如AOF；AOF高，因为数据完整性更高

**5）系统资源占用**

RDB高，大量CPU和内存的消耗；AOF低，主要是磁盘IO资源，但AOF重写时会占用大量CPU和内存资源

**6）使用场景**

RDB使用于可以容忍数分钟的数据丢失，追求赶快的启动速度的场景；AOF使用于对数据安全性要求较高的场景。



由于 RDB 和 AOF 各有优势，于是，Redis 4.0 开始支持 RDB 和 AOF 的混合持久化（默认关闭，可以通过配置项 aof-use-rdb-preamble 开启）。

**如果把混合持久化打开，AOF 重写的时候就直接把 RDB 的内容写到 AOF 文件开头。**

这样做的好处是可以结合 RDB 和 AOF 的优点, 快速加载同时避免丢失过多的数据。当然缺点也是有的， AOF 里面的 RDB 部分是压缩格式不再是 AOF 格式，可读性较差。



## 十二、基础知识-发布与订阅

### 1、简介

Redis 发布/订阅是一种消息通信模式，发送者（pub）发布消息，而订阅者（sub）接收消息。

传递消息的通道称为**channel**（频道），Redis客户端可以订阅任意数量的频道。

下图展示了频道 channel1 ， 以及订阅这个频道的三个客户端 —— client2 、 client5 和 client1 之间的关系：

![](http://cdn.gydblog.com/images/middleware/redis-pubsub-1.png)



当有新消息通过 PUBLISH 命令发送给频道 channel1 时， 这个消息就会被发送给订阅它的三个客户端：

![](http://cdn.gydblog.com/images/middleware/redis-pubsub-2.png)

### 2、使用

使用非常简单，在下面的例子中我们创建了订阅频道名为 **pubsubdemo**,

先开启一个redis客户端A，代表消息订阅者，订阅频道pubsubdemo的消息：

```
127.0.0.1:6379> subscribe pubsubdemo
1) "subscribe"
2) "pubsubdemo"
3) (integer) 1
```



再重新开启一个新的 redis 客户端B，代表消息发布者，在频道 pubsubdemo发布消息，订阅者A就能接收到消息。

```
127.0.0.1:6379> publish pubsubdemo "helloredis"
(integer) 1
127.0.0.1:6379> 
```

```
# 订阅者A的客户端会显示如下消息
1) "message"
2) "pubsubdemo"
3) "helloredis"
```

### 3、常用命令

| 命令语法                                    | 描述                             |
| ------------------------------------------- | -------------------------------- |
| PSUBSCRIBE pattern [pattern ...]            | 订阅一个或多个符合给定模式的频道 |
| PUBSUB subcommand [argument [argument ...]] | 查看订阅与发布系统状态           |
| PUBLISH channel message                     | 将信息发送到指定的频道           |
| PUNSUBSCRIBE [pattern [pattern ...]]        | 退订所有给定模式的频道           |
| SUBSCRIBE channel [channel ...]             | 订阅给定的一个或多个频道的信息   |
| UNSUBSCRIBE [channel [channel ...]]         | 指退订给定的频道                 |



## 十三、应用接入

参见springboot整合redis的文章

springboot/springboot.html#_6、整合Redis



## 十四、常见问题

### 1、缓存击穿

缓存击穿，是指一个key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞 。

常见解决方案：

1）设置热点数据永远不过期

2）接口限流与熔断，降级

3）布隆过滤器

4）加互斥锁



### 2、缓存穿透

缓存穿透的概念很简单，用户想要查询一个数据，发现redis内存数据库没有，也就是缓存没有命中，于是向持久层数据库查询。发现也没有，于是本次查询失败。当用户很多的时候，缓存都没有命中，于是都去请求了持久层数据库。这会给持久层数据库造成很大的压力，这时候就相当于出现了缓存穿透。

<font color="red">一些恶意的请求会故意查询不存在的key,请求量很大，就会对后端系统造成很大的压力。</font>

常见解决方案：**Bitmap布隆过滤器**、**缓存空对象**

### 3、缓存雪崩

缓存雪崩是指，缓存层不能正常工作了（服务器重启期间、大量缓存集中在某个时间失效）。于是所有的请求都会达到存储层，存储层的调用量会暴增，造成存储层也会挂掉的情况。

缓存雪崩的解决方案：**redis高可用(集群部署)**、**限流降级**、**数据预热**、**多级缓存**、**key有效期增加随机数**等



### 4、双写一致性问题

一致性问题是分布式常见问题，还可以再分为最终一致性和强一致性。

只要涉及到数据库和缓存双写，就必然会存在不一致的问题。如果我们的业务场景对数据有强一致性要求，那就不能放缓存。

既然使用了缓存，我们所做的一切方案，就只能保证数据最终一致性。只能降低不一致发生的概率，无法完全避免。因此，有强一致性要求的数据，不能放缓存。

那么如何尽最大可能保证双写的一致性呢？ 

这里可以采取一些手段，比如：

1）缓存延时双删

2）删除缓存重试机制

3）读取binlog异步删除缓存

参考：[美团二面：Redis与MySQL双写一致性如何保证？ - 掘金 (juejin.cn)](https://juejin.cn/post/6964531365643550751)

### 5、其它

持续补充...



##  十五、参考资料

- [Documentation | Redis](https://redis.io/docs/)
- [Redis文档中心 -- Redis中国用户组（CRUG）](http://www.redis.cn/documentation.html)