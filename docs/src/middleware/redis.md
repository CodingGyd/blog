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

>  linux安装redis的方式也有多种，小郭这里仅演示源码安装的方式。

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

### 

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



## 四、基础知识-配置文件



[【Redis】Redis7.0新特性汇总（详细）_喝不完一杯咖啡的博客-CSDN博客](https://blog.csdn.net/sinat_14840559/article/details/124433556)

Redis7 有很多新的功能、bug修改、特性优化，因此也伴随着很多新配置和变化，本小节进行配置项的逐一说明

> 有些配置在老版本中是没有的哦，可能目前大部分企业还没有用上最新版本

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
 /////下面的配置未核对完整


 
 

 

 
 

 
 
#配置unix socket来让redis支持监听本地连接。
# unixsocket /var/run/redis/redis.sock
 
 
#配置unix socket使用文件的权限
# unixsocketperm 755
 

 
 

 


 
 
# 是否将日志输出到系统日志
# syslog-enabled no
 
 
# syslog的标识符。
# syslog-ident redis
 
 
# 日志的来源、设备；指定系统日志工具。必须是 USER 或介于 LOCAL0-LOCAL7 之间
# syslog-facility local0
 
 
# 数据库的数量，默认数据库为0。可通过”SELECT [index]“命令指定数据库
databases 16
 
 
 
 
 
########################### SNAPSHOTTING (快照方式)  ###########################
 
# 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合
# 注释掉“save”这一行配置项就可以让保存数据库功能失效
# 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） 
# 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
# 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
save 900 1
save 300 10
save 60 10000
 
 
# 当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作
# 可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误
stop-writes-on-bgsave-error yes
 
 
# 指定存储至本地数据库时是否压缩数据，耗cpu资源，默认为yes，Redis采用LZF压缩
# 如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大
rdbcompression yes
 
 
# 保存rdb文件时，是否进行错误检查校验。
# 从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。这跟有利于文件的容错性
# 但是在保存rdb文件的时候，会有大概10%的性能损耗，如果你追求高性能，可以关闭该配置。
rdbchecksum yes
 
 
# 指定本地数据库文件名（rdb文件的名称），默认值为dump.rdb
dbfilename dump.rdb
 
 
# 数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
# 指定本地数据库存放目录（dump.rdb文件存放目录），rdb、aof文件也会写在这个目录
# 注意，这里只能指定一个目录，不能指定文件名（文件名由上一个dbfilename配置项指定）
dir ./
 
 
 
 
 
############################# REPLICATION（主从复制） #############################
 
 
# 主从复制。使用slaveof从 Redis服务器复制一个Redis实例。注意，该配置仅限于当前slave有效
# 设置当本机为slav服务时，设置master服务的ip地址及端口，Redis启动时，自动从master进行数据同步
# slaveof <masterip> <masterport>
 
 
# 如master设置了requirepass密码，slave用此选项指定master认证密码
# 下文的“requirepass”配置项可以指定密码
# masterauth <master-password>
 
 
# 从库同主机失去连接或者复制正在进行，从机库的两种运行方式
# 当slave与master之间的连接断开或slave正在与master进行数据同步时，如果有slave请求
# 1) yes：slave仍然响应请求，此时可能有问题
# 2) no：slave会返回"SYNC with master in progress"错误信息。但INFO和SLAVEOF命令除外。
slave-serve-stale-data yes
 
 
# 作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。
slave-read-only yes
 
 
# 是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或# 者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。
# 有2种方式：
#   1) disk：master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。
#   2) socket：master创建一个新的进程，直接把rdb文件以socket的方式发给slave。
# disk方式时，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。
# socket方式就得一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
repl-diskless-sync no
 
 
# diskless复制的延迟时间，防止设置为0。一旦复制开始
# 节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来
repl-diskless-sync-delay 5
 
 
# slave根据指定的时间间隔向服务器发送ping请求。默认10秒。
# repl-ping-slave-period 10
 
 
# 复制连接超时时间。master和slave都有超时时间的设置。
# master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。
# slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。
# 需注意repl-timeout需设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。
# repl-timeout 60
 
 
# 是否禁止复制tcp链接的tcp nodelay参数，默认是no，即使用tcp nodelay。
# 如master设置了yes，在把数据复制给slave时，会减少包的数量和更小的网络带宽。
# 但这也可能带来数据的延迟。默认我们推荐更小的延迟，但在数据量传输很大的场景下，建议选择yes。
repl-disable-tcp-nodelay no
 
 
# 复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。
# 这样在slave离线时，无需完全复制master的数据，如果可以执行部分同步，只需把缓冲区的部分数据复制# 给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有
# slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。
# repl-backlog-size 5mb
 
 
# master没有slave一段时间会释放复制缓冲区的内存，repl-backlog-ttl设置该时间长度。单位为秒
# repl-backlog-ttl 3600
 
 
# 当master不可用，Sentinel会根据slave的优先级选举一个master。
# 最低的优先级的slave，当选master。而配置成0，永远不会被选举。
slave-priority 100
 
 
# master停止写入的方式，健康的slave的个数小于N，mater就禁止写入。master最少得有多少个健康的
# slave存活才能执行写命令。这个配置虽然不能保证N个slave都一定能接收到master的写操作，
# 但能避免没有足够健康的slave时，master不能写入来避免数据丢失。设置为0是关闭该功能。
# min-slaves-to-write 3
 
 
# 延迟小于min-slaves-max-lag 秒的slave才认为是健康的slave。
# min-slaves-max-lag 10
 
 
 
 
 
############################## SECURITY（安全） ################################
 
# 配置redis连接认证密码
# 如果配置了，则客户端在连接Redis时需通过auth <password>命令提供密码（默认关闭）
# 注意：因为redis太快了，每秒可认证15w次密码，简单的很容易被攻破，最好使用一个更复杂的密码
# requirepass foobared
 
 
 
# 把危险的命令给修改成其他名称。比如CONFIG命令可以重命名为一个很难被猜到的命令
# 这样用户不能使用，而内部工具还能接着使用。
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
 
 
# 设置成一个空的值，可以禁止一个命令
# rename-command CONFIG ""
 
 
 
 
################################ LIMITS（限制）#################################
 
# 设置连上redis的最大客户端连接数量。默认10000。设置0表示不作限制。
# 超出此数，Redis会关闭新的连接并向客户端返回max Number of clients reached错误
# redis不区分连接是客户端连接还是内部打开文件或和slave连接等，故maxclients最小建议设置到32
# maxclients 10000
 
 
# 指定Redis最大内存限制，Redis在启动时会把数据加载到内存中
# 当内存满了，配合maxmemory-policy策略进行处理
# 当此方法处理后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。
# maxmemory <bytes>
 
 
# 内存容量超过maxmemory后的处理策略如下几种策略：
#  1) volatile-lru：只对设置过期时间的key进行LRU算法删除（默认）
#  2) allkeys-lru：删除不经常使用的key
#  3) volatile-random：随机删除即将过期的key
#  4) allkeys->random：随机删除一个key
#  5) volatile-ttl：删除即将过期的的key
#  6) noeviction：不移除任何key，对于写命令返回报错
# maxmemory-policy volatile-lru
 
#
 
# lru检测的样本数。
# 使用lru或ttl淘汰算法，从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key移除。
# maxmemory-samples 3
 
 
 
 
 
 
########################## APPEND ONLY MODE （附加模式） ###########################
 
 
# AOF持久化，指定是否在每次更新操作后进行日志记录，默认redis是异步（快照）的把数据写入本地磁盘
# redis默认使用的是rdb方式持久化，此方式在许多应用中已足够用。
# 但redis如果中途宕机，会导致可能有几分钟的数据丢失，按照上面save条件来策略进行持久化
# Append Only File是另一种持久化方式，可提供更好的持久化特性。
# Redis会把每次写入的数据在接收后都写入appendonly.aof 文件
# 每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
appendonly no
 
 
# 指定aof文件名，默认为appendonly.aof
# appendfilename appendonly.aof
 
 
 
# AOF持久化三种同步策略：
#   1) no：不同步（不执行fsync），数据不会持久化
#   2) always：每次有数据发生变化时都会写入appendonly.aof（慢，安全）
#   3) everysec：每秒同步一次到appendonly.aof，可能会导致丢失这1s数据（折中选择，默认值）
appendfsync everysec
 
 
 
# 在AOF重写或写入rdb文件时，会执行大量IO
# 对于everysec和always的AOF模式来说，执行fsync会造成阻塞过长时间
# yes：表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入
# 默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。
no-appendfsync-on-rewrite no
 
 
 
# AOF自动重写配置。当目前AOF文件大小超过上一次重写的aof文件大小的百分之多少进行重写
# 即当AOF文件增长到一定大小时，Redis能调用bgrewriteaof对日志文件进行重写。
# 当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
auto-aof-rewrite-percentage 100
 
 
# 设置允许重写的最小AOF文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb
 
 
 
#aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
aof-load-truncated yes
 
 
 
 
 
############################ LUA SCRIPTING（LUA 脚本） ###########################
 
# 如果达到最大时间限制（毫秒），redis会记个log，然后返回error。当一个脚本超过了最大时限。
# 只有SCRIPT KILL和SHUTDOWN NOSAVE可以用。第一个可以杀没有调write命令的东西。
# 要是已经调用了write，只能用第二个命令杀。
lua-time-limit 5000
 
 
 
 
############################ REDIS CLUSTER（Redis集群） ###########################
 
# 集群开关，默认是不开启集群模式。
# cluster-enabled yes
 
 
# 集群配置文件的名称，每个节点都有一个集群相关的配置文件，持久化保存集群的信息。
# 这个文件无需手动配置，这个配置文件有Redis生成并更新，每个Redis集群节点需要一个单独的配置文件，# 请确保与实例运行的系统中配置文件名称不冲突
# cluster-config-file nodes-6379.conf
 
 
# 节点互连超时的阀值。集群节点超时毫秒数
# cluster-node-timeout 15000
 
 
# 在进行故障转移时，全部slave会请求申请为master，有些slave可能与master断开连接一段时间了，
# 导致数据过于陈旧，这种slave不该提升为master。该参数判断slave与master断线的时间是否过长。
# 判断方法是：比较slave断开连接的时间和
#   (node-timeout * slave-validity-factor) + repl-ping-slave-period
# 如果节点超时时间为三十秒, 并且slave-validity-factor为10
# 假设默认的repl-ping-slave-period是10秒，即如果超过310秒slave将不会尝试进行故障转移 
# cluster-slave-validity-factor 10
 
 
# master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，
# 那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
# cluster-migration-barrier 1
 
 
# 默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。
# 设置为no，可以在slot没有全部分配的时候提供服务。
# 不建议打开该配置，这样会造成分区时，小分区的master一直在接受写请求，而造成很长时间数据不一致。
# cluster-require-full-coverage yes
 
 
 
 
 
 
############################## SLOW LOG （慢日志）#############################
 
# slog log是用来记录redis运行中执行比较慢的命令耗时。
# 当命令的执行超过了指定时间，就记录在slow log中，slog log保存在内存中，所以没有IO操作。
# 执行时间比slowlog-log-slower-than大的请求记录到slowlog里面，单位是微秒
# 所以1000000就是1秒。注意，负数时间会禁用慢查询日志，而0则会强制记录所有命令。
slowlog-log-slower-than 10000
 
 
# 慢查询日志长度。当一个新的命令被写进日志时，最老的那个记录会被删掉。
# 这个长度没有限制。只要有足够的内存就行。你可以通过 SLOWLOG RESET 来释放内存。
slowlog-max-len 1024
 
 
 
 
 
############################ VIRTUAL MEMORY（ 虚拟内存） ###########################
 
 
 
# 指定是否启用虚拟内存机制，默认no，
# VM机制将数据分页存放，由Redis将访问量较少的页即冷数据swap到磁盘上（内存占用多，最好关闭）
# 访问多的页面由磁盘自动换出到内存中
vm-enabled no
 
 
# 虚拟内存文件位置，默认值为/tmp/redis.swap，不可多个Redis实例共享
# Redis交换文件最好的存储是SSD（固态硬盘）
vm-swap-file /tmp/redis.swap
 
 
# redis使用的最大内存上限，保护redis不会因过多使用物理内存影响性能
# 将大于vm-max-memory的数据存入虚拟内存，但无论设置多少，所有索引数据都是内存存储的（即keys）
# 当vm-max-memory设置为0时，所有value都存在于磁盘。默认值为0
vm-max-memory 0
 
 
# Redis swap文件分成了很多的page，一个对象可以保存在多个page上面
# 但一个page上不能被多个对象共享，vm-page-size是要根据存储的数据大小来设定的。
# 建议：
#    如果存储很多小对象，page大小设置为32或64字节；
#    如果存储很大的对象，则可以使用更大的page，如果不确定，就使用默认值
# 每个页面的大小设置为32字节
vm-page-size 32
 
 
# 设置swap文件中页面数量
# 由于页表（一种表示页面空闲或使用的bitmap）是存放在内存中的，在磁盘上每8个页将消耗1byte的内存
# swap空间总容量为 vm-page-size * vm-pages
vm-pages 134217728
 
 
 
# 设置访问swap文件的线程数，最后不要超过机器的核数
# 如果设置为0，那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟，默认值为4
vm-max-threads 4
 
 
 
 
############################ ADVANCED CONFIG（高级配置） ###########################
 
 
# 哈希表中元素（条目）总个数<=512个，采用ziplist，否则使用hash
hash-max-zipmap-entries 512   
 
# 哈希表中每个value的长度<=64字节时，采用ziplist，否则使用hash
hash-max-zipmap-value 64     
 
 
 
 
# list元素<=512个，采用ziplist，否则用linkedlist
list-max-ziplist-entries 512
 
# list内某个元素大小<=64字节时，采用ziplist，否则用linkedlist 
list-max-ziplist-value 64
 
 
 
 
# set内元素数量<=512个，且都是整数型值，采用inset，否则使用hashtable
set-max-intset-entries 512
 
 
 
# zset内元素数量<=128个，采用ziplist，否则用skiplist跳表 
zset-max-ziplist-entries 128
 
# zset内某个元素大小<=64字节时，采用ziplist，否则用skiplist跳表 
zset-max-ziplist-value 64
 
 
 
# value大小 <= hll-sparse-max-bytes使用稀疏数据结构（sparse）
# value大小 > hll-sparse-max-bytes使用稠密的数据结构（dense）。
# 一个比16000大的value是几乎没用的，建议的value大概为3000。
# 如果对CPU要求不高，对空间要求较高的，建议设置到10000左右。
hll-sparse-max-bytes 3000
 
 
# Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。
# 当你的使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话
# 把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
# 指定是否激活重置哈希，默认为开启
activerehashing yes
 
 
 
# 对客户端输出缓冲进行限制,可以强迫那些不从服务器读取数据的客户端断开连接
# 用来强制关闭传输缓慢的客户端。
# 对于normal client，第一个0表示取消hard limit，第二个0和第三个0表示取消soft limit
# normal client默认取消限制，因为如果没有寻问，他们是不会接收数据的。
client-output-buffer-limit normal 0 0 0
 
 
# 对于slave client和 MONITER client，如果client-output-buffer一旦超过256mb
# 又或者超过64mb持续60秒，那么服务器就会立即断开客户端连接。
client-output-buffer-limit slave 256mb 64mb 60
 
 
# 对于pubsub client，如果client-output-buffer一旦超过32mb，又或者超过8mb持续60秒，
# 那么服务器就会立即断开客户端连接。
client-output-buffer-limit pubsub 32mb 8mb 60
 
 
# redis执行任务的频率为1s除以hz。
hz 10
 
 
# 在AOF重写时，如果打开了aof-rewrite-incremental-fsync开关，系统会每32MB执行一次fsync。
# 这对于把文件写入磁盘是有帮助的，可以避免过大的延迟峰值。
aof-rewrite-incremental-fsync yes

```



## 基础知识-数据类型

## 基础知识-事务

## 基础知识-淘汰策略

## 基础知识-持久化机制

## 基础知识-发布与订阅

## 基础知识-并发问题

缓存穿透、缓存击穿、雪崩

## 进阶知识-主从复制

## 进阶知识-哨兵机制

## 四、基础知识-常用命令

## 常见问题