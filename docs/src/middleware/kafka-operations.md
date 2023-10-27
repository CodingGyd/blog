---
title: Kafka常用操作
shortTitle: Kafka常用操作
date: 2023-10-11
category:
  - 微服务中间件
description: 记录中间件Kafka的常用知识点
head:
  - - meta
    - name: keywords
      content: Kafka,消息队列,分布式消息,消息中间件,流式处理,发布订阅
---
# Kafka常用操作


> 本小节总结在Kafka集群中最常用的操作，所有的操作都基于Kafka安装目录下的bin/文件夹中的命令行工具

## 1、添加主题

主题可以手动添加，也可以在首次将数据发布到不存在的主题时自动创建主题。(这依赖主题的初始化配置)

主题操作工具是bin/kafka-topics.sh。

 ```
 > bin/kafka-topics.sh --bootstrap-server broker_host:port --create --topic hello-gyd-events \
         --partitions 20 --replication-factor 3 --config x=y
 ```

上面创建名称为`hello-gyd-events`的主题时附带了几个参数：

replication-factor：复制因子，控制将复制写入的每条消息的服务器数量，例如如果复制因子为 3，则最多允许 2 台服务器出现故障，仍有一台服务器能保证数据的正常访问。

partitions：分区，主题数据将被分割到多少个日志中。每个分区日志都放置在 Kafka 日志目录下自己的文件夹中（默认路径是/tmp/kafka-logs/）。分区数量会影响消费者的最大数量。此类文件夹的名称由主题名称（附加短划线 （-） 和分区 ID 组成，例如`hello-gyd-events-0` 表示主题`hello-gyd-events`的第0个分区。文件夹的名称不能超过255个字符，因此主题的名称会受到限制。我们假设分区数永远不会超过 100,000，因此，主题名称不能超过 249 个字符，这会在文件夹名称中为短划线和可能 5 位数长的分区 ID 留出足够的空间。

在命令行上添加的配置会覆盖服务器的默认设置。



## 2、修改主题

可以使用主题命令行工具`bin/kafka-topics.sh`更改主题的配置项、分区数。

### 2.1、添加分区

```
> bin/kafka-topics.sh --bootstrap-server broker_host:port --alter --topic hello-gyd-events \
        --partitions 40
```

注意：添加分区不会更改现有数据的分区。

```bash
> bin/kafka-configs.sh --bootstrap-server broker_host:port --entity-type topics --entity-name my_topic_name --alter --add-config x=y
```

当主题中的消息包含有key时（即key不为null），根据key来计算分区（hash(key) % number_of_partitions）的行为就会有所影响。当topic-config的分区数为1时，不管消息的key为何值，消息都会发往这一个分区中；当分区数增加到3时，那么就会根据消息的key来计算分区号，原本发往分区0的消息现在有可能会发往分区1或者分区2中。如此还会影响既定消息的顺序，所以在增加分区数时一定要三思而后行。对于基于key计算的主题而言，建议在一开始就设置好分区数量，避免以后对其进行调整。

目前Kafka只支持增加分区数而不支持减少分区数。比如我们再将主题topic-config的分区数修改为1，就会报出InvalidPartitionException的异常。

Kafka官方认为，减少分区其实也是可以实现的，但是收益很低，反而会带来消息的顺序性问题、事务性问题、以及分区和副本的状态机切换问题，这些都是减少分区需要解决的问题。

### 2.2、添加配置

```
> bin/kafka-configs.sh --bootstrap-server broker_host:port --entity-type topics --entity-name my_topic_name --alter --add-config x=y
```

### 2.3、删除配置

```
> bin/kafka-configs.sh --bootstrap-server broker_host:port --entity-type topics --entity-name my_topic_name --alter --delete-config x
```



## 3、删除主题

```
> bin/kafka-topics.sh --bootstrap-server broker_host:port --delete --topic my_topic_name
```


## 4、优雅关机

 Kafka 集群将自动检测任何broker的状态（正常关闭或故障），并为该broker机器上的主题分区选择新的领导者。 

当需要正常关闭一台broker服务器时，Kafka支持一种优雅的方式来操作，而不是直接杀掉进程。优雅体现在两个方面： 

1）关闭之前，会将所有日志同步到磁盘，保证在broker重新启动时能够进行任何日志恢复（验证日志尾部所有消息的校验和）

 2）关闭之前，将服务器上作为领导者的任何分区迁移到其他副本。每个分区不可用的时间将控制到几毫秒内。

​       这种情况下的领导者能够迁移成功需要有两个前提：

- 开启了配置`controlled.shutdown.enable=true`

- broker上托管*的所有*分区都具有副本（即复制因子大于 1 *并且*这些副本中至少有一个处于活动状态），如果没有副本，会导致该分区数据不可用。



## 5、领导者平衡

每当broker停止或崩溃时，该broker分区的领导权都会转移到其他副本。当broker重新启动时，它将只是其所有分区的追随者，也就是说这意味着它不会用于客户端消息读取和写入。

为了避免大量出现上面这种情况(不平衡)， Kafka有一个首选副本的概念。如果分区的副本列表为 1,5,9，则节点 1 优先作为节点 5 或 9 的领导者，因为它在副本列表中位于前面。默认情况下，Kafka 集群将尝试将领导恢复到首选副本。此行为配置需要开启` auto.leader.rebalance.enable=true`

当将其`auto.leader.rebalance.enable`设置为 false时，需要通过运行以下命令手动恢复对已恢复复制副本的领导：

```
> bin/kafka-leader-election.sh --bootstrap-server broker_host:port --election-type preferred --all-topic-partitions
```

## 6、跨机架平衡副本

机架感知功能将同一分区的副本分布在不同的机架上。这可以在机架发生故障时保证broker的高可用性，从而降低了机架上所有broker同时发生故障时数据丢失的风险。可以通过向broker配置添加属性来指定broker属于特定机架：

```
  broker.rack=my-rack-id
```

[创建](https://kafka.apache.org/documentation/#basic_ops_add_topic)、[修改](https://kafka.apache.org/documentation/#basic_ops_modify_topic)主题或[重新分发](https://kafka.apache.org/documentation/#basic_ops_cluster_expansion)副本时，Kafka将确保副本跨越尽可能多的机架，来降低某个机架发生故障时主题的读写高可用性。

## 7、集群和异地之间复制镜像数据

Kafka 管理员可以定义跨越各个 Kafka 集群、数据中心或地理区域边界的数据流。详细信息可以查阅[异地复制](https://kafka.apache.org/documentation/#georeplication)部分。

## 8、检查消费者位置

kafka提供了工具，可以查看消费者组中所有消费者的位置，以及他们落后于日志末尾的距离。

例如，要在名为 *my-group* 的消费者组上运行此工具，使用名为 *my-topic* 的主题，如下所示：

```
 > bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group
```

![](http://cdn.gydblog.com/images/middleware/kafka-3.png)

## 9、管理消费者组

kafka提供了消费者组管理命令行工具`kafka-consumer-groups.sh`，我们可以针对消费者组做如下操作：

1）列出、描述消费者组

2）手动删除消费者组，仅当组没有任何活动成员时，手动删除才有效

3）可以在该组的上次提交的偏移量到期时自动删除该组

### 9.1、查看消费者组

例如，要列出所有主题中的所有消费者组：

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
connect-local-file-sink
[root@XXX kafka_2.13-3.6.0]# 
```

可以查看（describe）消费者的信息比如偏移量：

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group
```

![](http://cdn.gydblog.com/images/middleware/kafka-4.png)



describe时，还可以添加许多参数用于查看有关消费者组的更多详细信息：

- --members：此选项提供使用者组中所有活动成员的列表。

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group --members
CONSUMER-ID                                    HOST            CLIENT-ID       #PARTITIONS
consumer1-3fc8d6f1-581a-4472-bdf3-3515b4aee8c1 /127.0.0.1      consumer1       2
consumer4-117fe4d3-c6c1-4178-8ee9-eb4a3954bee0 /127.0.0.1      consumer4       1
consumer2-e76ea8c3-5d30-4299-9005-47eb41f3d3c4 /127.0.0.1      consumer2       3
consumer3-ecea43e4-1f01-479f-8349-f9130b75d8ee /127.0.0.1      consumer3       0
```

-  --verbose：除了上面“--members”选项报告的信息之外，此选项还显示分配给每个成员的分区。

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group --members --verbose
```

![](http://cdn.gydblog.com/images/middleware/kafka-5.png)

- --state：此选项提供有用的组级别信息。

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group --state
COORDINATOR (ID)          ASSIGNMENT-STRATEGY       STATE                #MEMBERS
localhost:9092 (0)        range                     Stable          
```



### 9.2、删除消费者组

要手动删除一个或多个消费者组，可以使用“--delete”选项：

```
[root@XXX kafka_2.13-3.6.0]# bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --delete --group my-group --group my-other-group
Deletion of requested consumer groups ('my-group', 'my-other-group') was successful.
```

### 9.3、重置消费者组偏移量

要重置使用者组的偏移量，可以使用“--reset-offsets”选项。使用之前首先确保使用者实例处于非活动状态

此选项一次支持一个消费者组。它需要至少定义以下范围的一个：--all-topics 或 --topic，使用`--from-file`方案就无需定义。

“--reset-offsets”选项可以指定如下任意值：

- --to-datetime <String: datetime> : 将偏移量重置为日期时间的偏移量。格式: 'YYYY-MM-DDTHH:mm:SS.sss'
- --to-earliest : 将偏移重置为最早偏移.
- --to-latest : 将偏移重置为最新偏移.
- --shift-by <Long: number-of-offsets> : Reset offsets shifting current offset by 'n',   'n' 可以是正或负.
- --from-file : 将偏移重置为 CSV 文件中定义的值.
- --to-current : 将偏移重置为当前偏移
- --by-duration <String: duration> : 将偏移量重置为按当前时间戳的持续时间偏移. 格式: 'PnDTnHnMnS'
- --to-offset : 将偏移重置为特定偏移.

注意：不管是哪种偏移设置，超出范围的偏移将调整为可用的偏移端。例如，如果偏移端为 10，偏移偏移请求为 的 15，然后，实际上将选择 10 的偏移量。

例如，要将消费者组的偏移量重置为最新偏移量，可以执行如下命令：

```
> bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --reset-offsets --group consumergroup1 --topic topic1 --to-latest

  TOPIC                          PARTITION  NEW-OFFSET
  topic1                         0          0
```



如果使用的是旧的高级消费者并将组元数据存储在 ZooKeeper 中，且配置了`offsets.storage=zookeeper`，则需要将命令中的`--bootstrap-server`改为`--zookeeper`

```
> bin/kafka-consumer-groups.sh --zookeeper localhost:2181 --list
```



## 10、集群扩容

将服务器添加到 Kafka 集群非常简单，只需为它们分配一个唯一的broker ID 并在新服务器上启动 Kafka。

这些新的broker服务器只会对新创建的主题有效，或者手动将旧主题的部分分区移动到这些服务器上。

因此，运维人员将新的broker服务器添加到kafka集群时，会将一些现有数据迁移到这些服务器上，以此减轻已有服务器的压力。

**那么数据是如何迁移呢？**

迁移数据的过程手动启动的，但之后完全自动化，大概的逻辑是：Kafka 将添加新服务器作为它正在迁移的分区的追随者，并允许它完全复制该分区中的现有数据. 当新服务器完全复制了此分区的内容并加入同步副本时，其中一个现有副本将删除其分区的数据。

分区重新分配工具可用于跨broker移动分区。理想的分区分布将确保所有broker的数据负载和分区大小均匀。但是分区重新分配工具无法自动研究 Kafka 集群中的数据分布并移动分区以实现均匀的负载分布。因此，管理员必须弄清楚应该移动哪些主题或分区。

分区重新分配工具可以在 3 种互斥模式下运行：

- --generate：在此模式下，给定主题列表和broker列表，该工具将生成候选重新分配，以将指定主题的所有分区移动到新broker。此选项仅提供一种在给定主题和目标broker列表的情况下生成分区重新分配计划的便捷方法。
- --execute：在此模式下，该工具根据用户提供的重新分配计划启动分区的重新分配。（使用 --reassignment-json-file 选项）。这可以是由管理员手动制定的自定义重新分配计划，也可以是使用 --generate 选项提供的。
- --vertify：在此模式下，该工具将验证上次执行期间列出的所有分区的重新分配状态。状态可以是“成功完成”、“失败”或“正在进行”

 **自动数据迁移到新服务器**

分区重新分配工具可用于将某些主题从当前broker集移动到新添加的broker。 这在扩展现有集群时通常很有用，因为将整个主题移动到新的broker集比一次移动一个分区更容易. 用于执行此操作时，用户应提供应移动到新broker集的主题列表和新broker的目标列表。

例如，以下示例将主题 foo1，foo2 的所有分区移动到新的broker集 5,6。在此步骤结束时，主题 foo1 和 foo2 的所有分区将*仅*存在于broker 5,6 上。

由于该工具接受输入的主题列表作为 json 文件，因此首先需要确定要移动的主题并创建 json 文件，如下所示：

```
> cat topics-to-move.json
  {"topics": [{"topic": "foo1"},
              {"topic": "foo2"}],
  "version":1
  }
```

json 文件准备就绪后，使用分区重新分配工具生成候选分配：

```
> bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --topics-to-move-json-file topics-to-move.json --broker-list "5,6" --generate
  Current partition replica assignment

  {"version":1,
  "partitions":[{"topic":"foo1","partition":0,"replicas":[2,1]},
                {"topic":"foo1","partition":1,"replicas":[1,3]},
                {"topic":"foo1","partition":2,"replicas":[3,4]},
                {"topic":"foo2","partition":0,"replicas":[4,2]},
                {"topic":"foo2","partition":1,"replicas":[2,1]},
                {"topic":"foo2","partition":2,"replicas":[1,3]}]
  }

  Proposed partition reassignment configuration

  {"version":1,
  "partitions":[{"topic":"foo1","partition":0,"replicas":[6,5]},
                {"topic":"foo1","partition":1,"replicas":[5,6]},
                {"topic":"foo1","partition":2,"replicas":[6,5]},
                {"topic":"foo2","partition":0,"replicas":[5,6]},
                {"topic":"foo2","partition":1,"replicas":[6,5]},
                {"topic":"foo2","partition":2,"replicas":[5,6]}]
  }
```

该工具生成一个候选分配，该赋值将所有分区从主题 foo1，foo2 移动到代理 5,6. 但是请注意，此时分区移动尚未开始，它只是告诉我们当前分配和建议的新分配。应保存当前分配到 json 文件（例如 expand-cluster-reassignment .json）中，以便使用 --execute 选项输入到工具中，如下所示：

```
 > bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file expand-cluster-reassignment.json --execute
  Current partition replica assignment

  {"version":1,
  "partitions":[{"topic":"foo1","partition":0,"replicas":[2,1]},
                {"topic":"foo1","partition":1,"replicas":[1,3]},
                {"topic":"foo1","partition":2,"replicas":[3,4]},
                {"topic":"foo2","partition":0,"replicas":[4,2]},
                {"topic":"foo2","partition":1,"replicas":[2,1]},
                {"topic":"foo2","partition":2,"replicas":[1,3]}]
  }

  Save this to use as the --reassignment-json-file option during rollback
  Successfully started partition reassignments for foo1-0,foo1-1,foo1-2,foo2-0,foo2-1,foo2-2
 
```

最后，--verify 选项可以与该工具一起使用，以检查分区重新分配的状态。请注意，相同的 expand-cluster-reassignment.json（与 --execute 选项一起使用）应与 --verify 选项一起使用：

```
> bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file expand-cluster-reassignment.json --verify
  Status of partition reassignment:
  Reassignment of partition [foo1,0] is completed
  Reassignment of partition [foo1,1] is still in progress
  Reassignment of partition [foo1,2] is still in progress
  Reassignment of partition [foo2,0] is completed
  Reassignment of partition [foo2,1] is completed
  Reassignment of partition [foo2,2] is completed
```



**自定义分区分配和迁移**

分区重新分配工具还可用于有选择地将分区的副本移动到一组特定的代理。以这种方式使用时，假设用户知道重新分配计划，并且不需要该工具生成候选重新分配，从而有效地跳过 --generate 步骤并直接移动到 --execute 步骤

例如，以下示例将主题 foo0 的分区 1 移动到代理 5,6，将主题 foo1 的分区 2 移动到代理 2,3：

- 第一步是在 json 文件中手动创建自定义重新分配计划：

```
> cat custom-reassignment.json
  {"version":1,"partitions":[{"topic":"foo1","partition":0,"replicas":[5,6]},{"topic":"foo2","partition":1,"replicas":[2,3]}]}
```

- 第二步，使用带有 --execute 选项的 json 文件启动重新分配过程：

```
> bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file custom-reassignment.json --execute
  Current partition replica assignment

  {"version":1,
  "partitions":[{"topic":"foo1","partition":0,"replicas":[1,2]},
                {"topic":"foo2","partition":1,"replicas":[3,4]}]
  }

  Save this to use as the --reassignment-json-file option during rollback
  Successfully started partition reassignments for foo1-0,foo2-1
 
```

--verify 选项可以与该工具一起使用，以检查分区重新分配的状态。请注意，相同的 custom-reassignment.json（与 --execute 选项一起使用）应与 --verify 选项一起使用：

```
 > bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file custom-reassignment.json --verify
  Status of partition reassignment:
  Reassignment of partition [foo1,0] is completed
  Reassignment of partition [foo2,1] is completed
```



## 11、集群缩容

 分区重新分配工具还做不到为准备下线的broker自动生成重新分配计划。因此，管理员必须提出一个重新分配计划，将要停用的broker上托管的所有分区的副本移动到其余broker。这个过程非常繁琐，因为重新分配需要确保所有副本不会从已停用的broker仅移动到一个其它broker。Kafka官方后续也会为缩容场景提供自动化迁移工具支持。

## 12、增加复制因子

增加现有分区的复制因子很容易。只需在自定义重新分配 json 文件中指定额外的副本，并将其与 --execute 选项一起使用即可增加指定分区的复制因子。

例如，以下示例将主题 foo 的分区 0 的复制因子从 1 增加到 3。在增加复制因子之前，broker 5 上存在分区的唯一副本。作为增加复制因子的一部分，我们将在broker 6 和 7 上添加更多副本。

- 第一步是在 json 文件中手动创建自定义重新分配计划：

```
> cat increase-replication-factor.json
  {"version":1,
  "partitions":[{"topic":"foo","partition":0,"replicas":[5,6,7]}]}
```

- 第二步，使用带有 --execute 选项的 json 文件启动重新分配过程：

```
> bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file increase-replication-factor.json --execute
  Current partition replica assignment

  {"version":1,
  "partitions":[{"topic":"foo","partition":0,"replicas":[5]}]}

  Save this to use as the --reassignment-json-file option during rollback
  Successfully started partition reassignment for foo-0
```

--verify 选项可以与该工具一起使用，以检查分区重新分配的状态。请注意，increase-replication-factor.json（与 --execute 选项一起使用）应与 --verify 选项一起使用：

```bash
 > bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file increase-replication-factor.json --verify
  Status of partition reassignment:
  Reassignment of partition [foo,0] is completed
```



- 最后，可以使用 kafka-topics 工具验证复制因子的增加是否成功：

```
> bin/kafka-topics.sh --bootstrap-server localhost:9092 --topic foo --describe
  Topic:foo	PartitionCount:1	ReplicationFactor:3	Configs:
    Topic: foo	Partition: 0	Leader: 5	Replicas: 5,6,7	Isr: 5,6,7
```


## 13、数据迁移期间限制带宽使用

生产环境进行重新平衡集群、添加或删除broker实例时，会有副本移动和复制的动作，会占用网络带宽，如果不加以限制，可能会对正常业务访问造成影响，Kafka支持在这个过程中对带宽使用进行限制。

 例如，执行重新平衡操作时，使用以下命令，它将被限制以不超过 50MB/s 的速度移动分区：

```
$ bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --execute --reassignment-json-file bigger-cluster.json --throttle 50000000

The inter-broker throttle limit was set to 50000000 B/s
  Successfully started partition reassignment for foo1-0
```

如果希望在重新平衡期间更改限制，例如增加吞吐量以使其更快地完成，可以通过使用 --extra 选项重新运行执行命令来执行此操作，该选项传递相同的reassignment-json-file：

```
$ bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092  --additional --execute --reassignment-json-file bigger-cluster.json --throttle 700000000
  The inter-broker throttle limit was set to 700000000 B/s
```

重平衡任务执行完成后，管理员可以使用 --verify 选项检查重新平衡的状态，如果重新平衡已完成，将通过 --verify 命令移除带宽限制。管理员一定要通过运行以下命令及时删除带宽限制 ，否则会导致常规复制流量受到限制：

```
> bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092  --verify --reassignment-json-file bigger-cluster.json
  Status of partition reassignment:
  Reassignment of partition [my-topic,1] is completed
  Reassignment of partition [my-topic,0] is completed

  Clearing broker-level throttles on brokers 1,2,3
  Clearing topic-level throttles on topic my-topic
```

## 14、设置配额

默认情况下，客户端会收到无限制的配额。 可以通过命令行工具`kafka-configs.sh`为每个（用户、客户端 ID）、用户或客户端 ID 组设置自定义配额。

- 为 （用户 = user1， 客户端 id=clientA） 配置自定义配额：

```
> bin/kafka-configs.sh  --bootstrap-server localhost:9092 --alter --add-config 'producer_byte_rate=1024,consumer_byte_rate=2048,request_percentage=200' --entity-type users --entity-name user1 --entity-type clients --entity-name clientA
  Updated config for entity: user-principal 'user1', client-id 'clientA'.
```

- 为 用户 = user1 配置自定义配额：

```
> bin/kafka-configs.sh  --bootstrap-server localhost:9092 --alter --add-config 'producer_byte_rate=1024,consumer_byte_rate=2048,request_percentage=200' --entity-type users --entity-name user1
  Updated config for entity: user-principal 'user1'.
```

- 为 客户端id = clientA 配置自定义配额：

```bash
> bin/kafka-configs.sh  --bootstrap-server localhost:9092 --alter --add-config 'producer_byte_rate=1024,consumer_byte_rate=2048,request_percentage=200' --entity-type clients --entity-name clientA
  Updated config for entity: client-id 'clientA'.
```



## 15、参考资料

[Apache Kafka](https://kafka.apache.org/documentation/#operations)
