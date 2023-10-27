---
title: Kafka基本概念入门
shortTitle: Kafka基本概念入门
date: 2023-10-11
category:
  - 微服务中间件
description: 记录中间件Kafka的常用知识点
head:
  - - meta
    - name: keywords
      content: Kafka,消息队列,分布式消息,消息中间件,流式处理,发布订阅
---
# Kafka基本概念入门


## 一、前言

消息队列中间件是分布式系统中重要的组件，主要用于流量削锋、系统耦合、异步处理等问题，最终目的是提升系统并发能力，保证数据最终一致性。

目前业内已经出现了许多分布式消息队列中间件，经过不断迭代和应用实践，比较稳定且广泛使用的主要是`Kafka`、`ActiveMQ`、`RabbitMQ` 及 `RocketMQ`这四种消息队列中间件。

消息队列中间件已经是大型分布式系统架构选型不可缺少的组件。作为一名从业多年的软件从业人员，如果你还不了解消息队列中间件的话，可以赶紧转行了哇！

本文将主要总结Kafka的相关知识，知识点均来源于官网。相信耐心阅读完本文，你和小郭一样可以对Kafka有较为全面的认识。



## 二、简介 

摘抄于官网的一句话：

```
Apache Kafka® is an event streaming platform. 
```

翻译一下：

```
Apache Kafka是一个事件流式处理平台
```

虽然一提到Kafka，很多人就将其定义为消息中间件，但官方定义是“事件流处理平台”。

Kafka 设计了三个关键功能，让我们可以很简单快速的实现端到端的事件流处理：

1）**发布**（写入）和**订阅**（读取）事件流，包括连续导入/导出 来自其他系统的数据。

2）根据需要持久可靠地**存储**事件流。

3）在事件发生时或回顾性地**处理**事件流。

所有上面这些功能都是保证分布式、高度可扩展、弹性、容错和 安全的。

Kafka 可以部署在裸机硬件、虚拟机和容器上，也可以部署在本地 以及在云中。我们可以选择自主管理 Kafka 环境和使用完全由各种供应商提供的服务托管环境 。但是要注意的是：**Kafka 严重依赖文件系统来存储和缓存消息！！。**

Kafka 是一个由**服务端**和**客户端**组成的分布式系统， 通过高性能 [TCP 网络协议](https://kafka.apache.org/protocol.html)进行通信。 它可以部署在本地和云中的裸机硬件、虚拟机和容器环境。

 <font color="red">服务端：</font>

Kafka 在后台以一台或多台服务器的集群模式运行，这些服务器可以跨越多个数据中心 或云区域。其中一些服务器用作存储层，称为broker（代理）。其他服务器运行 [Kafka Connect](https://kafka.apache.org/documentation/#connect) 以持续导入和导出 数据到事件流，主要可用于将 Kafka 与我们现有的系统（如关系数据库）集成 。Kafka 服务器集群具有高度可扩展性 和容错，如果其任何服务器发生故障，其他服务器将迅速接管其工作以确保连续操作，没有任何数据丢失。



<font color="red">客户端：</font>

客户端指的是我们编写的各种分布式应用程序、微服务等， 这些应用程序和微服务在运行过程中持续读取服务端的数据、写入数据到服务端。

Kafka官方自带了一些这样的客户端，目前已经 存在[数十个客户端](https://cwiki.apache.org/confluence/display/KAFKA/Clients)可支持各种编程语言通过Rest API方式访问Kafka。比较流行的有Java、Scale、Go、Python、C/C++，以及[Kafka Streams](https://kafka.apache.org/documentation/streams/)库



Kafka的详细设计理念可以查阅：[Apache Kafka](https://kafka.apache.org/documentation/#design)

## 三、周边生态

Kafka在主发行版之外，有大量的工具与 Kafka 集成。[ 生态系统页面](https://cwiki.apache.org/confluence/display/KAFKA/Ecosystem)列出了其中的许多工具，包括流处理系统，Hadoop集成，监控和部署工具，大家可以按需研究学习。

## 四、安装

### 1、linux

#### 1.1、依赖准备

**1）Java**

本地环境必须安装 Java 8+，小郭这里安装的是Java11。

```powershell
[root@XXX ~]# java -version
java version "11.0.19" 2023-04-18 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.19+9-LTS-224)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.19+9-LTS-224, mixed mode)
```

**2）zookeeper**

Apache Kafka可以使用ZooKeeper或KRaft启动。KRaft是Kafka为了脱离对Zookeeper的依赖而设计出来的，二者不能同时存在，小郭这里选择使用Zookeeper（这也是目前大部分企业在用的模式）

- zookeeper目录情况

```powershell
[root@XXX apache-zookeeper-3.8.3-bin]# ls
bin  conf  docs  lib  LICENSE.txt  NOTICE.txt  README.md  README_packaging.md
[root@XXX apache-zookeeper-3.8.3-bin]# cd bin/
[root@XXX bin]# ls
README.txt    zkCli.cmd  zkEnv.cmd  zkServer.cmd            zkServer.sh             zkSnapshotComparer.sh  zkSnapShotToolkit.sh  zkTxnLogToolkit.sh
zkCleanup.sh  zkCli.sh   zkEnv.sh   zkServer-initialize.sh  zkSnapshotComparer.cmd  zkSnapShotToolkit.cmd  zkTxnLogToolkit.cmd
```

- 启动Zookeeper服务

```powershell
[root@xxx apache-zookeeper-3.8.3-bin]# bin/zkServer.sh start
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.8.3-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
[root@xxx apache-zookeeper-3.8.3-bin]# 
```

zookeeper的安装相关细节可以参考[官方教程](https://zookeeper.apache.org/doc/current/zookeeperStarted.html)

- 验证Zookeeper连接

```powershell
[root@XXX apache-zookeeper-3.8.3-bin]# bin/zkCli.sh -server 127.0.0.1:2181
Connecting to 127.0.0.1:2181
.....
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 127.0.0.1:2181(CONNECTED) 0]
```



#### 1.2、Kakfa安装

**1）安装包获取**

- 下载

[截止20231019的最新版本kafka_2.13-3.6.0.tgz](https://www.apache.org/dyn/closer.cgi?path=/kafka/3.6.0/kafka_2.13-3.6.0.tgz)

- 解压

```powershell
[root@XXX ~]# tar -xzf kafka_2.13-3.6.0.tgz
[root@XXX ~]# ls
kafka_2.13-3.6.0  kafka_2.13-3.6.0.tgz
[root@XXX ~]# cd kafka_2.13-3.6.0
[root@XXX kafka_2.13-3.6.0]# ls
bin  config  libs  LICENSE  licenses  NOTICE  site-docs
[root@XXX kafka_2.13-3.6.0]# cd config/
[root@XXX config]# ls
connect-console-sink.properties    connect-file-sink.properties    connect-mirror-maker.properties  kraft                server.properties       zookeeper.properties
connect-console-source.properties  connect-file-source.properties  connect-standalone.properties    log4j.properties     tools-log4j.properties
connect-distributed.properties     connect-log4j.properties        consumer.properties              producer.properties  trogdor.conf
```

**2）修改配置**

主要修改其中的zookeeper连接配置，kafka默认连接zookeeper地址是localhost:2181

```powershell

############################# Zookeeper #############################
# Zookeeper connection string (see zookeeper docs for details).
# This is a comma separated host:port pairs, each corresponding to a zk
# server. e.g. "127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002".
# You can also append an optional chroot string to the urls to specify the
# root directory for all kafka znodes.
zookeeper.connect=localhost:2181

# Timeout in ms for connecting to zookeeper
zookeeper.connection.timeout.ms=18000
```



**3）启动kafka**

```powershell
# Start the Kafka broker service
[root@XXX kafka_2.13-3.6.0]# bin/kafka-server-start.sh config/server.properties
```



<font color="red">小插曲：</font>

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-server-start.sh config/server.properties 
Java HotSpot(TM) 64-Bit Server VM warning: INFO: os::commit_memory(0x00000000c0000000, 1073741824, 0) failed; error='Cannot allocate memory' (errno=12)
#
# There is insufficient memory for the Java Runtime Environment to continue.
# Native memory allocation (mmap) failed to map 1073741824 bytes for committing reserved memory.
# An error report file with more information is saved as:
# /root/kafka_2.13-3.6.0/hs_err_pid30565.log
```

上面的启动命令报错，看提示就是：服务器的物理内存太小，kafka需要的内存不足，启动失败！

小郭比较穷，买的阿里云服务器配置极低，平时用来部署一些练习程序用，这次为了学习Kafka，只能把之前的一些java程序停掉了。

停掉之后启动kafka发现内存还是不足，其实还要修改几个启动参数，我们打开Kafka-server-start.sh的脚本：

![](http://cdn.gydblog.com/images/middleware/kafka-install-1.png)

可以看到其中指定了Kafka启动时需要分配1G的堆内存，我们将该参数进行修改，小郭这里限定只分配100M（每个人情况不一样哦）

```powershell
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-Xmx100M -Xms100M"
fi
```

修改完后继续执行启动命令：

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-server-start.sh config/server.properties
```

然而，发现还是报同样的错误。。。  

<font color="green">实在没办法了，小郭只能在平时少的可怜的吃饭钱预算里分了一部分出来，在阿里云升级服务器配置！</font>

升级完配置后，将Kafka-server-start.sh中的堆内存参数配置改回默认值1G：

```powershell
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
fi
```

再次执行启动命令，这次正常啦！（这个世道，没钱寸步难行~）

![](http://cdn.gydblog.com/images/middleware/kafka-install-2.png)



但是如果我们把当前linux终端关闭，kafka进程就退出了，所以我们对kafka启动命令稍加改造，让其在后台运行：

```powershell
# nohup 和 & 都是结合起来使用的。表示程序后台运行，不占用当前终端，而且终端关闭后，程序还能继续运行
[root@XXX kafka_2.13-3.6.0]# nohup bin/kafka-server-start.sh config/server.properties &
[1] 5897
[root@XXX kafka_2.13-3.6.0]# nohup: ignoring input and appending output to ‘nohup.out’
```

到此，Kafka的简单部署就完成啦，接下来小郭会用示例演示Kafka的基本操作。



### 2、window环境

window环境不推荐使用。

## 五、基础知识-官方术语

### 1、event（事件）

<font color="red">事件（event）</font> 记录了业务中“发生了某些事情”，它在文档中也称为记录record或消息message。不过我们通常习惯用消息message来代替描述（本文后续部分均以消息来叙述）。

当我们向 Kafka 读取或写入数据时，都是以消息的形式执行此操作。

一条消息由键、值、时间戳和可选的元数据标头组成。下面是一个示例消息结构：

```
Event key: "Alice"
Event value: "Made a payment of $200 to Bob"
Event timestamp: "Jun. 25, 2020 at 2:06 p.m."
```

### 2、producer（生产者）

<font color="red">生产者(producer) </font>是向 Kafka 发布（写入）消息的客户端应用程序。生产者用于持续不断的向某个主题发送消息。

### 3、consumer（消费者）

<font color="red">消费者(consumer)</font> 是订阅生产者发布的消息的客户端应用程序，生产者和消费者是完全解耦的，彼此不可知。消费者用于处理生产者产生的消息。

多个消费者可以被组成一个消费者组。`消费者群组`（Consumer Group）指的就是由一个或多个消费者组成的群体。

![](http://cdn.gydblog.com/images/middleware/kafka-2.png)

### 4、broker（代理）

一个独立的 Kafka 服务器就被称为<font color="red">broker </font>，broker 接收来自生产者的消息，为消息设置偏移量，并提交消息到磁盘保存。

<font color="red">broker </font>是`kafka集群` 的组成部分，broker 集群由一个或多个 broker 组成，每个集群都有一个 broker 同时充当了`集群控制器`的角色（自动从集群的活跃成员中选举出来）。

### 5、topic（主题）

<font color="red">主题(topic)</font>类似于文件系统中的文件夹，消息是该文件夹中的文件，大量消息被持久存储在主题中。

主题始终对应多个生产者和多个订阅者：一个主题可以有0个或多个向其写入消息的生产者，也可以被0个或多个消费者订阅。

主题中的消息可以根据需要频繁读取，注意与传统消息传递系统不同的是消息在使用后不会被立即删除（可以通过每个主题的配置设置定义 Kafka 应保留消息的时间，之后旧的消息将被丢弃）

kafka支持为主题制作副本，例如跨地理区域或者数据中心进行复制，保证每个主题都有自己的数据副本，防止万一出现问题时数据能正常恢复，这也保证了kafka的容错能力和高可用性。 常见的生产设置是复制因子 3，即始终存在数据的三个副本，此复制在主题分区级别执行。

### 6、partition（分区）

**主题（topic）**是可以被分为若干个**分区（partition）的**，这意味着主题分布在不同的 broker（kafka实例）的许多bucket（桶）上。

数据的这种分布式存储对于系统可伸缩性非常重要，因为它允许客户端应用程序同时从多个broker读取和写入数据。

将新消息发布到主题时，实际上就是追加到主题的某个分区上。具有相同消息键（例如，客户或车辆 ID）的消息将被写入同一分区，Kafka 会确保给定主题分区的任何使用者将始终**以与写入完全相同的顺序读取该分区的消息**，换句话说：单一主题中的分区有序，但是无法保证主题中所有的分区有序。

![](http://cdn.gydblog.com/images/middleware/kafka-1.png)

上面的示例图中主题有四个分区 P1–P4。两个独立的生产者发布发布消息，通过网络将消息写入主题的分区。具有相同键的消息（在图中由其颜色表示）将写入相同的键分区。两个生产者都可以写入同一分区。

每个分区日志都放置在 Kafka 日志目录下自己的文件夹中（默认路径是/tmp/kafka-logs/）。分区数量会影响消费者的最大数量。此类文件夹的名称由主题名称（附加短划线 （-） 和分区 ID 组成，例如文件夹`hello-gyd-events-0` 表示主题`hello-gyd-events`的第0个分区的数据。文件夹的名称不能超过255个字符，因此主题的名称会受到限制。我们假设分区数永远不会超过 100,000，因此，主题名称不能超过 249 个字符，这会在文件夹名称中为短划线和可能 5 位数长的分区 ID 留出足够的空间。





### 7、replica（副本）

Kafka 中消息的备份又叫做 `副本`（Replica），副本的数量是可以配置的，Kafka 定义了两类副本：领导者副本（Leader Replica） 和 追随者副本（Follower Replica），前者对外提供服务，后者只是被动跟随。

### 8、rebalance（重平衡）

**rebalance（重平衡）**消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。Rebalance 是 Kafka 消费者端实现高可用的重要手段。

### 9、Consumer  Offset（偏移量）

`偏移量`（Consumer Offset）是一种元数据，它是一个不断递增的整数值，用来记录消费者发生重平衡时的位置，以便用来恢复数据。

## 六、基本使用-入门

Kafka 是一个分布式事件*流平台*，可支持读取、写入、存储和处理[*事件*](https://kafka.apache.org/documentation/#messages)（在文档中也称为*记录*或*消息*） 跨多台机器。

### 1、命令行工具简介

Kafka的开源客户端有很多种，本文为了方便演示，直接使用Kafka自带的一些命令行工具来进行相关语法操作演示。

Kafka的命令行工具都在bin目录下：

```powershell
[root@XXX kafka_2.13-3.6.0]# cd bin/
[root@XXX bin]# ls
connect-distributed.sh        kafka-configs.sh             kafka-dump-log.sh         kafka-metadata-quorum.sh       kafka-server-start.sh               kafka-verifiable-producer.sh
connect-mirror-maker.sh       kafka-console-consumer.sh    kafka-e2e-latency.sh      kafka-metadata-shell.sh        kafka-server-stop.sh                trogdor.sh
connect-plugin-path.sh        kafka-console-producer.sh    kafka-features.sh         kafka-mirror-maker.sh          kafka-storage.sh                    windows
connect-standalone.sh         kafka-consumer-groups.sh     kafka-get-offsets.sh      kafka-producer-perf-test.sh    kafka-streams-application-reset.sh  zookeeper-security-migration.sh
kafka-acls.sh                 kafka-consumer-perf-test.sh  kafka-jmx.sh              kafka-reassign-partitions.sh   kafka-topics.sh                     zookeeper-server-start.sh
kafka-broker-api-versions.sh  kafka-delegation-tokens.sh   kafka-leader-election.sh  kafka-replica-verification.sh  kafka-transactions.sh               zookeeper-server-stop.sh
kafka-cluster.sh              kafka-delete-records.sh      kafka-log-dirs.sh         kafka-run-class.sh             kafka-verifiable-consumer.sh        zookeeper-shell.sh
[root@XXX bin]# 
```



所有Kafka的命令行工具都有额外的选项，可以通过执行不带任何参数的运行命令 用于显示对应脚本可支持的参数选项。示例查看`kafka-topics.sh`工具的所有参数：

```powershell
[root@XXX bin]# ./kafka-topics.sh 
Create, delete, describe, or change a topic.
Option                                   Description                            
------                                   -----------                            
--alter                                  Alter the number of partitions and     
                                           replica assignment. Update the       
                                           configuration of an existing topic   
                                           via --alter is no longer supported   
                                           here (the kafka-configs CLI supports 
                                           altering topic configs with a --     
                                           bootstrap-server option).            
--at-min-isr-partitions                  if set when describing topics, only    
                                           show partitions whose isr count is   
                                           equal to the configured minimum.     
--bootstrap-server <String: server to    REQUIRED: The Kafka server to connect  
  connect to>                              to.                                  
--command-config <String: command        Property file containing configs to be 
  config property file>                    passed to Admin Client. This is used 
                                           only with --bootstrap-server option  
                                           for describing and altering broker   
                                           configs.                             
--config <String: name=value>            A topic configuration override for the 
                                           topic being created or altered. The  
                                           following is a list of valid         
                                           configurations:                      
                                         	cleanup.policy                        
                                         	compression.type                      
                                         	delete.retention.ms                   
                                         	file.delete.delay.ms                  
                                         	flush.messages                        
                                         	flush.ms                              
                                         	follower.replication.throttled.       
                                           replicas                             
                                         	index.interval.bytes                  
                                         	leader.replication.throttled.replicas 
                                         	local.retention.bytes                 
                                         	local.retention.ms                    
                                         	max.compaction.lag.ms                 
                                         	max.message.bytes                     
                                         	message.downconversion.enable         
                                         	message.format.version                
                                         	message.timestamp.after.max.ms        
                                         	message.timestamp.before.max.ms       
                                         	message.timestamp.difference.max.ms   
                                         	message.timestamp.type                
                                         	min.cleanable.dirty.ratio             
                                         	min.compaction.lag.ms                 
                                         	min.insync.replicas                   
                                         	preallocate                           
                                         	remote.storage.enable                 
                                         	retention.bytes                       
                                         	retention.ms                          
                                         	segment.bytes                         
                                         	segment.index.bytes                   
                                         	segment.jitter.ms                     
                                         	segment.ms                            
                                         	unclean.leader.election.enable        
                                         See the Kafka documentation for full   
                                           details on the topic configs. It is  
                                           supported only in combination with --
                                           create if --bootstrap-server option  
                                           is used (the kafka-configs CLI       
                                           supports altering topic configs with 
                                           a --bootstrap-server option).        
--create                                 Create a new topic.                    
--delete                                 Delete a topic                         
--delete-config <String: name>           A topic configuration override to be   
                                           removed for an existing topic (see   
                                           the list of configurations under the 
                                           --config option). Not supported with 
                                           the --bootstrap-server option.       
--describe                               List details for the given topics.     
--exclude-internal                       exclude internal topics when running   
                                           list or describe command. The        
                                           internal topics will be listed by    
                                           default                              
--help                                   Print usage information.               
--if-exists                              if set when altering or deleting or    
                                           describing topics, the action will   
                                           only execute if the topic exists.    
--if-not-exists                          if set when creating topics, the       
                                           action will only execute if the      
                                           topic does not already exist.        
--list                                   List all available topics.             
--partitions <Integer: # of partitions>  The number of partitions for the topic 
                                           being created or altered (WARNING:   
                                           If partitions are increased for a    
                                           topic that has a key, the partition  
                                           logic or ordering of the messages    
                                           will be affected). If not supplied   
                                           for create, defaults to the cluster  
                                           default.                             
--replica-assignment <String:            A list of manual partition-to-broker   
  broker_id_for_part1_replica1 :           assignments for the topic being      
  broker_id_for_part1_replica2 ,           created or altered.                  
  broker_id_for_part2_replica1 :                                                
  broker_id_for_part2_replica2 , ...>                                           
--replication-factor <Integer:           The replication factor for each        
  replication factor>                      partition in the topic being         
                                           created. If not supplied, defaults   
                                           to the cluster default.              
--topic <String: topic>                  The topic to create, alter, describe   
                                           or delete. It also accepts a regular 
                                           expression, except for --create      
                                           option. Put topic name in double     
                                           quotes and use the '\' prefix to     
                                           escape regular expression symbols; e.
                                           g. "test\.topic".                    
--topic-id <String: topic-id>            The topic-id to describe.This is used  
                                           only with --bootstrap-server option  
                                           for describing topics.               
--topics-with-overrides                  if set when describing topics, only    
                                           show topics that have overridden     
                                           configs                              
--unavailable-partitions                 if set when describing topics, only    
                                           show partitions whose leader is not  
                                           available                            
--under-min-isr-partitions               if set when describing topics, only    
                                           show partitions whose isr count is   
                                           less than the configured minimum.    
--under-replicated-partitions            if set when describing topics, only    
                                           show under replicated partitions     
--version                                Display Kafka version.                 
```

### 2、查看版本

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-topics.sh --version
3.6.0
```

目前我们用的是最新的Kafka版本3.6.0 （截止时间20231019）

### 3、主题操作

#### 3.1、创建主题

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-topics.sh --create --topic hello-gyd-events --bootstrap-server localhost:9092
Created topic hello-gyd-events.
```

示例中使用kafka提供的命令行工具`kafka-topics.sh`成功创建了一个名为"hello-gyd-events"的主题(topic)。

#### 3.2、查看主题信息

例如查看主题的`hello-gyd-events`的分区计数等信息：

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-topics.sh --describe --topic hello-gyd-events --bootstrap-server localhost:9092
Topic: hello-gyd-events	TopicId: o15jNumLSaS68uKiX5PTog	PartitionCount: 1	ReplicationFactor: 1	Configs: 
	Topic: hello-gyd-events	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
[root@XXX kafka_2.13-3.6.0]# 
```



#### 3.3、生产消息

Kafka 客户端通过网络与 Kafka broker通信，用于写入（或读取）消息。 broker服务器收到消息后，将以持久和容错的方式存储消息。

下面使用Kafka官方提供的生产者命令行工具`kafka-console-producer.sh`来演示如何生产消息到主题`hello-gyd-events`中：

```bash
[root@XXX kafka_2.13-3.6.0]# bin/kafka-console-producer.sh --topic hello-gyd-events --bootstrap-server localhost:9092
>this is first message
>this is  second message
>
```

上面演示了写入两条消息（每行一条），可以随时使用快捷键`CTRL+C`停止生产者客户端。

#### 3.4、消费消息

下面使用Kafka官方提供的消费者命令行工具`kafka-console-consumer.sh`来演示如何消费主题`hello-gyd-events`的消息：

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-console-consumer.sh --topic hello-gyd-events --from-beginning --bootstrap-server localhost:9092
this is first message
this is  second message
```

上面显示消费到了两条消息（每行一条），可以随时使用快捷键`CTRL+C`停止消费者客户端。如果不停止，只要生产者有写入消息，上面的消费者端控制台就能立即显示最新的消息。

消息是持久存储在 Kafka 中的，因此可以根据需要多次读取它们，并被任意数量的消费者读取。 可以通过打开另一个终端会话并再次重新运行`kafka-console-consumer.sh`来验证上述结论。

### 4、消息流操作

#### 4.1、连接器简介

我们可能在现有系统（如关系数据库或传统消息传递系统）中已经存在大量数据， 以及许多已经在使用这些系统的应用程序。

Kafka官方提供了[Kafka Connect](https://kafka.apache.org/documentation/#connect) 。Kafka Connect 是一个可扩展的、可靠的在Kafka和其他系统之间流传输的数据工具。简而言之就是他可以通过Connector（连接器）简单、快速的将大集合数据导入和导出Kafka。可以接收整个数据库或收集来自所有的应用程序的消息到Kafka的topic中，Kafka Connect 功能包括：

- Kafka连接器通用框架：Kafka connect 规范了kafka和其他数据系统集成，简化了开发、部署和管理。

- 分布式和单机式：扩展到大型支持整个organization的集中管理服务，也可以缩小到开发，测试和小规模生产部署。

- REST接口：通过rest API 来提交（和管理）Connector到kafka connect 集群。

- offset自动化管理：从Connector 获取少量信息，connect来管理offset提交。

- 分布式和默认扩展：kafka connect建立在现有的组管理协议上，更多的工作可以添加扩展到connect集群。

- 流/批量集成：利用kafka现有能力，connect是一个桥接流和批量数据系统的理想解决方案。

在这里我们测试connect的kafka版本是：3.6.0。

小郭根据官方提供的指南，总结了如何使用导入数据的简单连接器运行 Kafka Connect 将数据从文件导入到 Kafka 主题，并将数据从 Kafka 主题导出到文件。

#### 4.2、数据导入导出

Kafka安装目录的libs文件夹下提供了大量官方的jar包，我们使用文件导入需要用到其中的`connect-file-3.6.0.jar`。

**1）首先确保`connect-file-3.6.0.jar`的路径添加到plugin.path**

> 此处配置的是相对路径，在生产环境建议使用绝对路径。更多说明：plugin.path](https://kafka.apache.org/documentation/#connectconfigs_plugin.path)

```powershell
[root@XXX kafka_2.13-3.6.0]# echo "plugin.path=libs/connect-file-3.6.0.jar"
plugin.path=libs/connect-file-3.6.0.jar
[root@XXX kafka_2.13-3.6.0]# 
```



**2）修改配置文件**

编辑connect-standalone.properties 中的plugin.path配置，与步骤1保持一致。

```powershell
[root@XXX kafka_2.13-3.6.0]# cd config/
[root@XXX config]# ls
connect-console-sink.properties    connect-file-sink.properties    connect-mirror-maker.properties  kraft                server.properties       zookeeper.properties
connect-console-source.properties  connect-file-source.properties  connect-standalone.properties    log4j.properties     tools-log4j.properties
connect-distributed.properties     connect-log4j.properties        consumer.properties              producer.properties  trogdor.conf
[root@XXX config]# vi connect-standalone.properties 
```

![](http://cdn.gydblog.com/images/middleware/kafka-install-3.png)

**3）创建测试数据文件**

```powershell
[root@XXX kafka_2.13-3.6.0]# pwd
/root/kafka_2.13-3.6.0
[root@XXX kafka_2.13-3.6.0]# echo -e "AAAAA\nBBBBB\nCCCCC" > test.txt
[root@XXX kafka_2.13-3.6.0]# ls
bin  config  hs_err_pid30565.log  hs_err_pid31064.log  libs  LICENSE  licenses  logs  nohup.out  NOTICE  site-docs  test.txt
[root@XXX kafka_2.13-3.6.0]# 
```



**4）启动连接器**

接下来，使用官方提供的连接器命令行工具`connect-standalone.sh`，启动两个在*独立*模式下运行的连接器。

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/connect-standalone.sh config/connect-standalone.properties config/connect-file-source.properties config/connect-file-sink.properties
```



上面的命令执行时了附加三个配置文件参数，解释一下：

- config/connect-standalone.properties

  Kafka 连接器的通用框架配置主文件，包含通用配置，例如要连接到的 Kafka Broker地址和数据序列化格式。

- config/connect-file-source.properties 

  源连接器配置，它从输入文件中读取行并将每行生成到 Kafka 主题 。

  ```powershell
  # 连接器名称(全局唯一)
  name=local-file-source
  # 连接器实现类
  connector.class=FileStreamSource
  # 并行任务数
  tasks.max=1
  # 配置需要导入的文件名称
  file=test.txt
  # 配置数据写入到Kafka的哪个主题
  topic=connect-test
  ```

  

- config/connect-file-sink.properties 

  接收连接器，它从 Kafka 主题读取消息，并将每个消息生成为输出文件中的一行。

  ```powershell
  # 连接器名称(全局唯一)
  name=local-file-sink
  # 连接器实现类
  connector.class=FileStreamSink
  # 并行任务数
  tasks.max=1
  # 配置需要导出的文件名称
  file=test.sink.txt
  # 配置数据从哪个Kafka主题读取
  topics=connect-test
  ```



连接器正常启动后，源连接器将从文件`test.txt`中按行读取文件并写入到主题`connect-test`，接收连接器将不断从主题`connect-test`中读取消息并写入到文件`test.sink.txt`中。

可以验证`test.sink.txt`中的内容是否和`test.txt`是一致的：

```powershell
[root@XXX kafka_2.13-3.6.0]# cat test.sink.txt 
AAAAA
BBBBB
CCCCC
```



因为数据存储在 Kafka 主题中 ，所以我们也可以运行一个消费者实例来查看 主题中的数据：

```powershell
[root@XXX kafka_2.13-3.6.0]# bin/kafka-console-consumer.sh --topic connect-test --from-beginning --bootstrap-server localhost:9092
{"schema":{"type":"string","optional":false},"payload":"AAAAA"}
{"schema":{"type":"string","optional":false},"payload":"BBBBB"}
{"schema":{"type":"string","optional":false},"payload":"CCCCC"}
```



连接器一直在运行，我们可以持续写入数据到`test.txt`，连接器会持续将数据同步到`test.sink.txt`中，小郭亲测有效：

```powershell
[root@XXX kafka_2.13-3.6.0]# echo  Another line>> test.txt
[root@XXX kafka_2.13-3.6.0]# cat test.sink.txt 
AAAAA
BBBBB
CCCCC

[root@XXX kafka_2.13-3.6.0]# echo  "DDDDD" >> test.txt
[root@XXX kafka_2.13-3.6.0]# cat test.sink.txt 
AAAAA
BBBBB
CCCCC

DDDDD
[root@XXX kafka_2.13-3.6.0]# 
```



### 5、 流式处理类库

只要你的数据计划存储在Kafka中，你就可以在Java/Scala语言中使用 [Kafka Streams](https://kafka.apache.org/documentation/streams) 客户端流式处理类库处理数据。

Kafka的流式处理类库提供了一种简单而强大的方式来处理实时数据流。这使得开发人员可以在应用程序中直接读取、处理和生成事件，而无需依赖外部的处理框架。Kafka的流式处理类库提供了许多有用的功能，如窗口化处理、状态存储和流处理拓扑构建等，使得开发人员能够轻松地构建强大的流式处理应用程序。

详细文档可查阅：[Kafka Streams demo](https://kafka.apache.org/documentation/streams/quickstart)、 [app development tutorial](https://kafka.apache.org/36/documentation/streams/tutorial) 



### 6、停止Kafka运行

说白了就是将生产者、消费者、Broker的进程停止掉啦，这都不用说，相信软件从业者都知道怎么停止的。（搞不懂官网为啥专门有一段文字教大家怎么停止的。。）

```
Now that you reached the end of the quickstart, feel free to tear down the Kafka environment—or continue playing around.

Stop the producer and consumer clients with Ctrl-C, if you haven't done so already.
Stop the Kafka broker with Ctrl-C.
Lastly, if the Kafka with ZooKeeper section was followed, stop the ZooKeeper server with Ctrl-C.
```

最后，如果我们想清理kafka系统的所有事件数据，可以执行下面的命令：

```
$ rm -rf /tmp/kafka-logs /tmp/zookeeper /tmp/kraft-combined-logs
```

上面涉及到了三个文件目录：

- /tmp/kafka-logs

  kafka系统本身的数据存放默认目录，如消息、主题、分区等等信息。可以通过配置修改：

  ```powershell
  [root@XXX config]# vi server.properties
  log.dirs=/tmp/kafka-logs
  ```

  

- /tmp/zookeeper

  kafka写入zookeeper的数据目录，可以通过配置修改：

  ```powershell
  [root@XXX config]# vi zookeeper.properties
  dataDir=/tmp/zookeeper
  ```

  

- /tmp/kraft-combined-logs

  kraft是kafka官方设计的用于替代Zookeeper的产物，在启动kafka时与zookeeper不能共存，只能二选一。

  ```powershell
  [root@XXX config]# cd kraft/
  [root@XXX kraft]# vi server.properties 
  log.dirs=/tmp/kraft-combined-logs
  ```

  

### 7、更多操作

[Kafka的更多常用操作介绍戳这里](./kafka-operations.md)

## 七、基础知识-核心API

Kafka 有五个核心API，它们分别是：

- Producer API ：允许应用程序向 Kafka 集群中的主题发送数据流（消息）。

- Consumer API：允许应用程序从 Kafka 集群中的主题读取数据流（消息）。

- Streams API：允许将数据流从输入主题转换为输出主题。

- Connector API：允许实现连接器，这些连接器不断从某个源系统或应用程序拉取数据到 Kafka，或者从 Kafka 推送到某个接收器系统或应用程序。

- Admin API：允许管理和检查主题、broker和其他 Kafka 对象。

Kafka 通过与语言无关的协议公开其所有API功能，该协议具有许多编程语言的可用客户端。

不过从 0.8 版本开始，只有Java客户端作为Kafka主项目代码库的一部分进行维护，其他客户端作为独立的开源项目提供。[详细说明戳这里](https://cwiki.apache.org/confluence/display/KAFKA/Clients)

> 官方解释这样做的原因是：这样能够允许一小群熟悉该客户端语言的实现者根据自己的发布周期快速迭代他们的代码库。<br>集中维护这些正在成为一个瓶颈，因为主要提交者不能做到了解每种可能的编程语言，以便能够执行有意义的代码审查和测试。<br>这导致了提交者试图审查和测试他们不理解的代码的情况。

非 Java 客户端开源项目列表如下：

```
C/C++
Python
Go (AKA golang)
Erlang
PowerShell
.NET
Clojure
Ruby
Node.js
Proxy (HTTP REST, etc)
Perl
stdin/stdout
PHP
Rust
Alternative Java
Storm
Scala DSL 
Clojure
Swift
```



### 1、Producer API

Producer API 主要用于生产者客户端向Kafka集群发送消息，它的详细说明：[Producer API](https://kafka.apache.org/36/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html)

要使用Producer API，需要添加以下 maven 依赖项：

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>3.6.0</version>
</dependency>
```



### 2、Consumer API

Consumer API 主要用于消费者客户端向Kafka集群读取消息，它的详细说明：[Consumer API](https://kafka.apache.org/36/javadoc/index.html?org/apache/kafka/clients/consumer/KafkaConsumer.html)

要使用Consumer API，需要添加以下 maven 依赖项：

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>3.6.0</version>
</dependency>
```



### 3、Streams API

Streams API 主要用于将数据流从输入主题转换为输出主题，它的详细说明：[Streams API](https://kafka.apache.org/36/javadoc/index.html?org/apache/kafka/streams/KafkaStreams.html)  、[使用示例](https://kafka.apache.org/36/documentation/streams/)

要使用Streams API，需要添加以下 maven 依赖项：

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-streams</artifactId>
	<version>3.6.0</version>
</dependency>
```

当使用 Scala 时，需要引入kafka-streams-scala的依赖。[使用说明](https://kafka.apache.org/36/documentation/streams/developer-guide/dsl-api.html#scala-dsl)

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-streams-scala_2.13</artifactId>
	<version>3.6.0</version>
</dependency>
```



### 4、Connector API

Connect API 允许实现连接器，这些连接器不断从某个源数据系统拉取到 Kafka 或从 Kafka 推送到某个接收器数据系统。

很多时候我们不需要直接使用此API，可以使用预构建的连接器，而无需编写任何代码。

如果需要自定义连接器，可以戳这里了解[API文档](https://kafka.apache.org/36/javadoc/index.html?org/apache/kafka/connect)、[使用说明](https://kafka.apache.org/documentation.html#connect)



### 5、Admin API

管理 API 支持管理和检查主题、broker代理、ACLS 和其他 Kafka 对象。[API说明](https://kafka.apache.org/36/javadoc/index.html?org/apache/kafka/clients/admin/Admin.html)

要使用Admin API，需要添加以下 maven 依赖项：

```xml
<dependency>
	<groupId>org.apache.kafka</groupId>
	<artifactId>kafka-clients</artifactId>
	<version>3.6.0</version>
</dependency>
```



## 八、基础知识-配置说明

[Kafka配置说明](./kafka-config.md)



## 九、基础知识-应用接入

[SpringBoot应用接入](../springboot/springboot.html#_7、整合kafka)

## 十、参考资料

1. [Apache Kafka简介](https://kafka.apache.org/intro)

2. [Apache Kafka文档](https://kafka.apache.org/documentation/)

3. [Apache Kafka用例](https://kafka.apache.org/powered-by)

4. [Apache Kafka设计](https://kafka.apache.org/documentation/#design)
5. [Apache Kafka生态](https://cwiki.apache.org/confluence/display/KAFKA/Ecosystem)



