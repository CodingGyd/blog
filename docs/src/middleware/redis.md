---
title: Redis知识点详解
shortTitle: Redis知识点详解
date: 2023-09-21
category:
  - 微服务中间件
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

优点：

- 使用方便

  SQL语言通用，可用于复杂查询；

- 易于维护

  都是使用表结构，格式一致；

- 复杂操作

  支持SQL，可用于一个表以及多个表之间非常复杂的查询。

- 支持事务控制

 缺点：

- 高并发读写性能比较差

  尤其是海量数据的高效读写场景性能比较差，因为硬盘I/O是一个无法避免的瓶颈。

- 灵活度低

  表结构固定，DDL修改对业务影响大。

*非关系型数据库严格上不是一种数据库，应该是一种数据结构化存储方法的集合，可以是文档或者键值对等。有如下优缺点。*

 优点：

- 读写速度快

  IO快，可以使用内存、硬盘或者其它随机存储器作为数据载体，而关系型数据库只能使用硬盘

- 扩展性强

- 数据格式灵活

  存储数据格式可以是kv、文档、图片等等，限制少，应用场景广，而关系型数据只能是内置的基础数据类型

- 成本低

  部署简单，大部分开源免费，社区活跃。

缺点：

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

## 二、Redis简介

> redis的官网地址，是redis.io。（域名后缀io属于国家域名，是british Indian Ocean territory，即英属印度洋领地），Vmware在资助着redis项目的开发和维护。
>
> 从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由[Pivotal](https://baike.baidu.com/item/Pivotal?fromModule=lemma_inlink)赞助。

### 1）是什么

Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。Redis属于非关系型数据库中的一种解决方案，目前也是业界主流的缓存解决方案组件。

数百万开发人员在使用Redis用作数据库、缓存、流式处理引擎和消息代理。

### 2）为什么用它

**Redis**是当前互联网世界最为流行的 NoSQL（Not Only SQL）数据库，它的性能十分优越，其性能远超关系型数据库，可以**支持每秒十几万此的读/写操作**，并且还**支持集群、分布式、主从同步等**配置，理论上可以无限扩展节点，它还**支持一定的事务能力**，这也保证了高并发的场景下数据的安全和一致性。

最重要的一点是：Redis的社区活跃，这个很重要。

### 3）优点

- 性能极高

   官方测试数据显示：Redis读的速度是110000次/s,写的速度是81000次/s 。

- 数据类型丰富

  支持 Strings, Lists, Hashes, Sets 及 Ordered Sets 数     据类型操作。

- 原子操作

  所有的操作都是原子性的，同时Redis还支持对几个操作全并后的原子性执行。

- 功能丰富

  提供了缓存淘汰策略、发布定义、lua脚本、简单事务控制、管道技术等功能特性支持

## 三、如何安装

###  1、windows安装

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

打开一个 **cmd** 窗口 使用 cd 命令切换目录到 **D:\Redis-x64-5.0.14.1>** 运行：

```
redis-server.exe redis.windows.conf
```

如果想方便的话，可以把 redis 的路径加到系统的环境变量里，这样就省得再输路径了，后面的那个 redis.windows.conf 可以省略，如果省略，会启用默认的。输入之后，会显示如下界面：

![启动日志](http://cdn.gydblog.com/images/middleware/redis-install-2.png)

接下来保持这个cmd界面不要关闭，我们启动一个客户端去连接服务端。

#### 3）客户端连接

服务端程序启动好之后，我们就可以用客户端去连接使用了，目前已经有很多开源的图形化客户端比如Redis-Desktop-Manager，redis本身也提供了命令行客户端连接工具，接下来我们直接用命令行工具去连接测试。

另启一个 cmd 窗口，原来的不要关闭，不然就无法访问服务端了。切换到目录**D:\Redis-x64-5.0.14.1>**，执行如下命令：

```
redis-cli.exe -h 127.0.0.1 -p 6379
```

设置一个key名为hello，value是"world"的键值对: 

![客户端访问](http://cdn.gydblog.com/images/middleware/redis-install-3.png)

上面成功连接到了redis服务，并且设置了一个key名为hello，value是"world"的键值对数据。

### 2、linux安装

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

#### 4）启动服务端

redis安装好了，我们可以在任意目录下执行`redis-server`命令启动服务端:

> 因为redis-server已经被配置到了环境变量中，所以可以在任意目录执行

```
[root@xxx ~]# redis-server  
```

![启动日志](http://cdn.gydblog.com/images/middleware/redis-install-6.png)

上面演示的是使用默认配置启动redis服务，如果我们想自定义配置，可以使用如下方式：

```
redis-server /xxx/xxx/redis.conf
```

redis.conf是redis的核心配置文件，我们可以按需进行配置修改。 

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

todo

## 五、基础知识-请求执行流程



## 六、基础知识-配置文件

### 1）概述

Redis7 有很多新的功能、bug修改、特性优化，因此也伴随着很多新配置和变化，本小节进行配置项的逐一说明

> Redis 7.0 以后新增了近 50 个新命令，但是目前大部分企业还没有或者不敢用上最新版本

在redis中，配置文件主要有普通配置文件、sentinel配置文件和cluster-node配置文件。我们重点关注普通配置文件。

普通配置文件中的配置按模块进行了划分，主要模块清单如下：

| 配置模块           | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| INCLUDES           | 主要用于引入额外的配置文件                                   |
| NETWORK            | 网络连接相关的配置模块                                       |
| GENERAL            | 通用的配置模块                                               |
| MODULES            | 可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令 |
| SNAPSHOTTING       | rdb持久化配置模块                                            |
| REPLICATION        | 主从配置模块                                                 |
| KEYS TRACKING      | 客户端缓存密钥失效管理                                       |
| SECURITY           | 安全配置模块                                                 |
| CLIENTS            | 客户端相关配置，比较重要，建议熟记！                         |
| MEMORY MANAGEMENT  | 内存管理配置模块                                             |
| LAZY FREEING       | 异步策略管理                                                 |
| THREADED I/O       | 线程I/O管理 (了解)                                           |
| KERNEL OOM CONTROL | 可以提示内核OOM killer在OOM发生时应该首先终止哪些进程        |
| APPEND ONLY MODE   | aof持久化配置模块                                            |
| LUA SCRIPTING      | lua脚本配置模块                                              |
| REDIS CLUSTER      | cluster集群模式配置模块                                      |
| SLOW LOG           | 慢日志配置模块                                               |
| LATENCY MONITOR    | 延迟监控配置模块                                             |
| ADVANCED CONFIG    | 高级配置模块                                                 |

​	

### 2）INCLUDES
作用：引入额外的配置文件。
使用示例：

```
include \etc\redis\conf\shared.conf
```


说明：如果在一台服务器上有多台redis实例，则可以将一些公共的配置抽取出来，在具体的redis实例的配置文件是使用include引入即可让这些配置生效。
注意：redis支持配置更新，比如在client端通过CONFIG REWRITE或者sentinel模式下来修改配置。但是无论用哪一种方式都无法对include配置进行覆盖。比如在client端执行：config rewrite include .\new_shared.conf，server端会抛出异常提示。

### 3）NETWORK

​	作用：对网络相关的配置，如绑定网卡、端口监听、连接超时等设置
​	 

### 4）GENERAL

一些通用的配置

### 5）MODULES

作用：可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令

使用示例

```
loadmodule /path/to/my_module.so
loadmodule /path/to/other_module.so
```



### 6）SNAPSHOTTING

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

​	 

### 7）REPLICATION

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

 

### 8）KEYS TRACKING 



### 9）SECURITY

作用：安全配置

| 参数名                   | 默认值 | 含义                                             |
| ------------------------ | ------ | ------------------------------------------------ |
| requirepass foobared     | 未启用 | Redis命令需要输入的密码                          |
| rename-command CONFIG "" | 未启用 | 重命名Redis的那些危险的命令,这样普通用户不能使用 |



### 10）CLIENTS

作用：客户端相关配置

### 11）MEMORY MANAGEMENT

作用：内存限制等配置

| 参数名              | 默认值     | 含义                                                         |
| ------------------- | ---------- | ------------------------------------------------------------ |
| maxmemory bytes     | 未启用     | Redis最大内存大小,如果超过该值,redis将会执行过期删除,如果不能执行,那么redis将会返回错误 |
| maxmemory-policy    | noeviction | noeviction: 不删除策略, 达到最大内存限制时, 如果需要更多内存, 直接返回错误信息。<br/>allkeys-lru: 所有key通用; 优先删除最近最少使用(less recently used ,LRU) 的 key。<br/>volatile-lru: 只限于设置了 expire 的部分; 优先删除最近最少使用(less recently used ,LRU) 的 key。<br/>allkeys-random: 所有key通用; 随机删除一部分 key。<br/>volatile-random: 只限于设置了 expire 的部分; 随机删除一部分 key。<br/>volatile-ttl: 只限于设置了 expire 的部分; 优先删除剩余时间(time to live,TTL) 短的key。<br/> |
| maxmemory-samples 5 | 未启用     | LRU淘汰策略的样例大小，redis中并不会准确的删除所有键中最近最少使用的键，而是随机抽取maxmeory-samples个键，删除这些键中最近最少使用的键。 |

 

### 12）LAZY FREEING

作用：异步策略管理



### 13）THREADED I/O 

作用：线程io管理



### 14）KERNEL OOM CONTROL

作用：在Linux上，可以提示内核OOM killer在OOM发生时应该首先终止哪些进程。启用此功能可使Redis根据其角色主动控制其所有进程的oom_score_adj值。默认分数将尝试在所有其他进程之前杀死背景子进程，并在主进程之前杀死从节点进程。

###  15）APPEND ONLY MODE 

作用： AOF持久化配置

| 参数名                      | 默认值           | 含义                                                         |
| --------------------------- | ---------------- | ------------------------------------------------------------ |
| appendonly                  | no               | 是否开启AOF持久化功能                                        |
| appendfilename              | "appendonly.aof" | AOF持久化文件名                                              |
| appendfsync                 | everysec         | AOF持久化的方式：<br>no: 不调用fsync()，由OS决定什么时候flush数据到磁盘；<br/><br/> everysec: fsync()每秒调用一次；<br/><br/> always: 每次有数据写入就调用一次，最安全但是最慢。 |
| no-appendfsync-on-rewrite   | no               | bgrewriteaof往往会涉及大量磁盘操作，这样就会造成主进程在写aof文件的时候出现阻塞的情形，如果该参数设置位no，表示fsync不执行不磁盘操作，只是写入了缓冲区。设置为yes，则执行磁盘操作，但是可能会阻塞很久。 |
| auto-aof-rewrite-percentage | 100              | 触发redis的rewrite的文件百分比，即当前文件大小大于上一次rewrite文件的的100%时，触发rewrite。 |
| auto-aof-rewrite-min-size   | 64MB             | 最初的rewirte文件的大小                                      |

### 16）LUA SCRIPTING 

作用：lua脚本配置

| 参数名         | 默认值 | 含义                      |
| -------------- | ------ | ------------------------- |
| lua-time-limit | 5000   | Lua脚本的最大执行时间(ms) |



### 17）REDIS CLUSTER

作用：cluster集群模式配置

| 参数名                              | 默认值 | 含义                                                         |
| ----------------------------------- | ------ | ------------------------------------------------------------ |
| cluster-enabled yes                 | 未启用 | 是否启动Redis集群功能                                        |
| cluster-config-file nodes-6379.conf | 未启用 | redis集群的配置文件名                                        |
| cluster-node-timeout 15000          | 未启用 | 集群节点的超时时间                                           |
| cluster-migration-barrier 1         | 未启用 | cluster-migration-barrier属性可以保证redis集群中不会出现裸奔的主节点（这个主节点没有对应的从节点），当某个主节点的 |

 

### 18）SLOW LOG

作用：慢查询日志配置

| 参数名                  | 默认值 | 含义                                                         |
| ----------------------- | ------ | ------------------------------------------------------------ |
| slowlog-log-slower-than | 10000  | 表示slowlog的划定界限，只有query执行时间大于slowlog-log-slower-than的才会定义成慢查询，才会被slowlog进行记录。 |
| slowlog-max-len         | 128    | 表示慢查询最大的条数，当slowlog超过设定的最大值后，会将最早的slowlog删除，是个FIFO队列 |

​	 

### 19）LATENCY MONITOR

作用：延迟监控配置



### 20）ADVANCED CONFIG

作用：高级配置

| 参数名                        | 默认值              | 含义                                                         |
| ----------------------------- | ------------------- | ------------------------------------------------------------ |
| hash-max-ziplist-entries      | 512                 | 哈希对象保存的元素个数大于512时进行编码转换，转为哈希表，最开始为压缩列表 |
| hash-max-ziplist-value        | 64                  | 哈希对象保存的字符串长度大于64时进行编码转换，转为哈希表，最开始为压缩列表 |
| list-max-ziplist-entries      | 512                 | 列表对象保存的元素个数大于512时进行编码转换，转为双端链表，最开始为压缩列表 |
| list-max-ziplist-value        | 64                  | 列表对象保存的字符串长度大于64时进行编码转换，转为双端链表，最开始为压缩列表 |
| set-max-intset-entries        | 512                 | 集合对象保存的元素个数大于512时进行编码转换，转为哈希表，最开始为整数集合 |
| zset-max-ziplist-entries      | 128                 | 有序集合对象保存的元素个数大于128时进行编码转换，转为跳跃表，最开始为压缩列表 |
| zset-max-ziplist-value        | 64                  | 有序集合对象保存的元素成员的长度大于64字节时进行编码转换，转为跳跃表，最开始为压缩列表 |
| hll-sparse-max-bytes          | 3000                |                                                              |
| activerehashing               | yes                 | 是否激活rehash算法                                           |
| client-output-buffer-limit    | nomal 0 0 0         | 设置普通客户端的硬性限制和软性限制为0，表示不限制客户端的输出缓冲区大小 |
| client-output-buffer-limit    | slave 256mb 64mb 60 | 设置从服务器客户单的硬性限制为256MB，软性限制为64MB，软性限制的时长为60s |
| client-output-buffer-limit    | pubsub 32mb 8mb 60  | 设置执行发布与订阅功能的客户端的硬性限制为32MB，软性限制为8MB，软性限制时长为60s |
| hz                            | 10                  | 后台函数serverCron函数每秒执行的次数，默认每秒执行10次       |
| aof-rewrite-incremental-fsync | yes                 | 在进行AOF文件重写的时候，每产生32MB的文件，就调用fsync函数同步到文件中 |

​	

### 21）配置文件全集！！

```
# Redis配置文件样例
 
# 单位注意事项：当需要内存大小时，可以指定，它以通常的形式 1k 5GB 4M 等等：
#
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# 单位不区分大小写，所以 1GB 1Gb 1gB 都是一样的
 
############################### INCLUDES（包含） ##############################
#这在你有标准配置模板但是每个redis服务器又需要个性设置的时候很有用。等同import导入
# include /path/to/local.conf
# include /path/to/other.conf
# include /path/to/fragments/*.conf

 
############################### MODULES（模块） ##############################
# 可以使用指令loadmodule在redis服务启动时加载模块。可以同时使用多个loadmodule指令
# loadmodule /path/to/my_module.so
# loadmodule /path/to/other_module.so
 

############################## NETWORK（网络）##################################
/* bind参数表示绑定主机的哪个网卡，比如本机有两个网卡分别对应ip 1.1.1.1 ,2.2.2.2，配置bind 1.1.1.1，
# 则客户端288.30.3.3访问#2.2.2.2将无法连接redis。
# 如果不配置bind，redis将监听本机所有可用的网络接口。也就是说redis.conf配置文件中没有bind配置项，redis可以接受来自任意一个网卡的Redis请求
# bind 192.168.1.100 10.0.0.1 # 该示例表示绑定本机的两个ipv4网卡地址
# bind 0:0:0:0 #该示例表示所有连接都可以连接上
# bind 127.0.0.1::1 #该示例表示绑定到本机的ipv6
# bind 127.0.0.1 #该示例表示绑定到本机
*/

#默认情况下，传出连接（从副本到主机、从Sentinel到实例、集群总线等）不绑定到特定的本地地址。在大多数情况下，这意味着操作系统将
#根据路由和连接所通过的接口来处理。使用bind source addr可以配置要绑定到的特定地址，这也可能会影响连接的路由方式，默认未启用。
#bind-source-addr 10.0.0.1

# 是否开启保护模式。如配置里没有指定bind和密码。开启该参数后，redis只允许本地访问，拒绝外部访问
# 要是开启了密码和bind，可以开启。否则最好关闭，设置为no。
protected-mode yes

# Redis监听端口号，默认为6379，如果指定0端口，表示Redis不监听TCP连接
port 6379

/* tcp keepalive参数是表示空闲连接保持活动的时长。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值
  使用keepalive有两个好处:
  1) 检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经发生与对端端口的问题。
  2) 在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需两倍的设置值
*/
tcp-keepalive 300

 
/* tcp-backlog参数用于在linux系统中控制tcp三次握手已完成连接队列的长度。
在高并发系统中，通常需要设置一个较高的tcp-backlog来避免客户端连接速度慢的问题（三次握手的速度）。
已完成连接队列的长度也与操作系统中somaxconn有关，取二者最小min(tcp-backlog,somaxconn)
linux查看已完成连接队列的长度:$ /proc/sys/net/core/somaxconn
*/
tcp-backlog 511
 
# 连接超时时间，单位秒；超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0
timeout 0



################################# TLS/SSL （数据连接加密） #####################################
//从版本6开始，Redis支持TLS/SSL，这是一项需要在编译时启用的可选功能。
//可以在编译redis源码的时候使用如下命令启用：make BUILD_TLS=yes
 

/**tls-port配置指令允许在指定的端口上接受TLS/SSL连接
示例：只接受TLS端口tls-port，禁用非TLS端口port
port 0
tls-port 6379
*/

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
 
 # 当Redis以上述守护进程方式运行时，Redis默认会把进程文件写入/var/run/redis_6379.pid文件
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


############################## MEMORY MANAGEMENT ################################
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


############################ KERNEL OOM CONTROL ##############################
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


//Redis可以创建RDB或AOF格式的仅追加基础文件。使用RDB格式总是更快、更高效，只有出于向后兼容性的目的才支持禁用它。
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
//普通Redis实例不能是Redis集群的一部分；只有作为集群节点启动的节点才能。为了将Redis实例作为集群节点启动，可以配置cluster-enabled值为yes
# cluster-enabled yes


//cluster-config-file是每个集群节点都有的单独一个集群配置文件。此文件不可手动编辑。它由Redis节点创建和更新。每个Redis Cluster节点都需要不同的群集配置文件。请确保在同一系统中运行的实例没有重叠的群集配置文件名。
# cluster-config-file nodes-6379.conf

//集群节点超时是指节点必须无法访问才能被视为处于故障状态的毫秒数。大多数其他内部时间限制是节点超时的倍数。
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


//cluster-migration-barrier设置master故障转移时保留的最少副本数: master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1

//关闭此选项可以使用较少的自动群集配置。它既禁止迁移到孤立主机，也禁止从变空的主机迁移,默认yes
# cluster-allow-replica-migration yes


//默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。
//cluster-require-full-coverage设置为no，可以在slot没有全部分配的时候提供服务。
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

################################ LATENCY TRACKING ##############################
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



## 基础知识-数据类型

todo

## 基础知识-事务

todo

## 基础知识-淘汰策略

todo

## 基础知识-持久化机制

todo

## 基础知识-发布与订阅

todo

## 基础知识-并发问题

todo

缓存穿透、缓存击穿、雪崩

## 基础知识-常用命令

todo

## 进阶知识-主从复制

todo

## 进阶知识-哨兵机制

todo



## 常见问题

todo