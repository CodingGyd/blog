---
title: Kafka配置说明
shortTitle: Kafka配置说明
date: 2023-10-11
category:
  - 微服务中间件
description: 记录中间件Kafka的常用知识点
head:
  - - meta
    - name: keywords
      content: Kafka,消息队列,分布式消息,消息中间件,流式处理,发布订阅
---

# Kafka配置说明


## 一、前言

> Apache Kafka3.0.0的发布为kafka彻底去掉Zookeeper铺平了道路，Kafka Raft 支持元数据主题的快照以及自我管理，而3.1.0版本在2022.1.24发布，对3.0.0版本又修改了。 下面的部分配置需要开启了KRaft部署模式才会生效。

<font color="red">小郭看了网上很多人写的文章，都自称是全量的kafka配置说明，然而不是。因此小郭花了3天时间，照着目前kafka官方最新的文档，把所有的配置项整理成表格，方便后续查阅，大家有兴趣的可以赶紧点赞收藏防丢失哦！</font>

其中有很多配置项在一般应用场景均不涉及调整，保持默认即可，仅需了解哦。



## 二、broker 配置

### 2.1 三个基本配置

| 配置项            | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| broker.id         | 此服务器的唯一标识。如果未设置，将自动生成。为了避免 ZooKeeper 生成的服务器标识 和用户配置的服务器标识 之间的冲突，生成的服务器标识 从reserved.broker.max.id + 1 开始。 |
| log.dirs          | 保存日志数据的目录，逗号分隔列表。如果未设置，则使用 log.dir 中的值。 |
| zookeeper.connect | 指定 ZooKeeper 连接字符串，格式为hostname:port，其中 host 和 port 是 ZooKeeper 服务器的主机和端口。要允许在 ZooKeeper 机器关闭时通过其他 ZooKeeper 节点进行连接，还可以指定多个主机`hostname1:port1,hostname2:port2,hostname3:port3`。<br/>服务器还可以将 ZooKeeper chroot 路径作为其 ZooKeeper 连接字符串的一部分，该连接字符串将其数据放置在全局 ZooKeeper 命名空间中的某个路径下。例如，要给出 chroot 路径，`/chroot/path`请将连接字符串给出为`hostname1:port1,hostname2:port2,hostname3:port3/chroot/path`. |

### 2.2 其它配置

| 配置项                                                      | 描述                                                         |
| :---------------------------------------------------------- | ------------------------------------------------------------ |
| listeners                                                   | 定义Kafka Broker的Listener的配置项。<br/>listeners是kafka真正bind的地址 |
| advertised.listeners                                        | 将Broker的Listener信息发布到Zookeeper中。<br/>是暴露给外部的listeners，如果没有设置，会用listeners的配置。 |
| delete.topic.enable                                         | 允许删除主题。默认true，如果关闭此配置，则无法通过管理工具删除主题 |
| auto.create.topics.enable                                   | broker上是否允许自动创建 Topic                               |
| auto.leader.rebalance.enable                                | 是否开启`leader`自动平衡，默认值为`true`。后台会有线程进行定期检查leader的分布情况<br>定期间隔可由 leader.imbalance.check.interval.seconds 配置。如果领导者不平衡超过 leader.imbalance.per.broker.percentage，则会触发领导者重新平衡到分区的首选领导者。 |
| background.threads                                          | 用于各种后台处理任务的线程数                                 |
| compression.type                                            | 指定主题的最终压缩类型。配置可选值是gzip、snappy、lz4、zstd、producer、uncompressed。<br>默认值是producer，意味着保留生产者设置的原始压缩编解码器；<br>uncompressed也就是不做压缩。 |
| control.plane.listener.name                                 | 用于控制器和broker之间通信的侦听器listeners的名称。broker将使用 在listeners侦听器列表中查找端点，以侦听来自控制器的连接。 |
| controller.listener.names                                   | 一个控制器使用的侦听器名称的逗号分隔列表。<br>3.0.0以上版本kafka，可以完全脱离zookeeper，自带有支持KRaft 模式。如果在KRaft模式运行，这个配置是必须的，如果服务器具有控制器角色，controller.listener.names不能为空。<br>基于 ZooKeeper 的控制器不应设置此配置。 |
| controller.quorum.election.backoff.max.ms                   | 开始新选举前的最长时间（以毫秒为单位），默认值是1000。这是选举过程中的回退机制的核心配置，设置一个随机的回退超时时间，有助于防止选举陷入僵局 |
| controller.quorum.election.timeout.ms                       | 在触发新选举之前，无法从领导者处获取数据时等待的最长时间（以毫秒为单位），默认值是1000 |
| controller.quorum.fetch.timeout.ms                          | 在成为候选人并触发选民选举之前，没有从现任领导人成功获得选举的最长时间；在询问领导人是否有新时代之前，没有从大多数仲裁中接收提取的最长时间（以秒为单位），默认值是2 |
| controller.quorum.voters                                    | 逗号分隔的条目列表中一组投票者的 id/端点信息映射。示例：1@localhost:9092,2@localhost:9093,3@localhost:9094 |
| early.start.listeners                                       | 可在授权方完成初始化之前启动的侦听器名称的逗号分隔列表.当授权方依赖于集群本身进行引导时，这很有用，就像标准授权方（将 ACL 存储在元数据日志中）一样。默认情况下，controller.listener.names 中包含的所有侦听器也将是早期启动侦听器。如果侦听器接受外部流量，则不应显示在此列表中。 |
| leader.imbalance.check.interval.seconds                     | 控制器触发分区重新平衡检查的频率，单位是秒，默认300          |
| leader.imbalance.per.broker.percentage                      | 每个broker允许的领导者不平衡比率.如果每个broker的此值高于此值，控制器将触发领导者平衡。该值以百分比形式指定，默认值是10。 |
| log.dir                                                     | 保存日志数据的目录（log.dirs 属性的补充），默认值/tmp/kafka-logs |
| log.flush.interval.messages                                 | 将消息刷新到磁盘之前日志分区上累积的消息数，默认无限制。列入配置为1000时，表示每当producer写入10000条消息时，刷数据到磁盘。 |
| log.flush.interval.ms                                       | 任何主题中的消息在刷新到磁盘之前保留在内存中的最长时间（毫秒）。<br>例如log.flush.interval.ms=1000表示每间隔1秒钟时间，刷数据到磁盘<br>如果未设置，则使用 log.flush.scheduler.interval.ms 中的值， |
| log.flush.offset.checkpoint.interval.ms                     | 用于定时对partition的offset进行保存的时间间隔,默认值60000ms。该记录充当日志恢复点。 |
| log.flush.scheduler.interval.ms                             | 日志刷新程序检查是否需要将任何日志刷新到磁盘的频率（以毫秒为单位），默认不检查. |
| log.flush.start.offset.checkpoint.interval.ms               | 更新日志起始偏移量的持久记录的频率（以毫秒为单位）。默认600000 |
| log.retention.bytes                                         | 删除日志之前日志的最大大小，kafka定期为那些超过磁盘空间阈值的topic进行日志段的删除 |
| log.retention.hours                                         | 删除日志文件之前保留日志文件的小时数（以小时为单位），默认为168小时，即7天。 |
| log.retention.minutes                                       | 删除日志文件之前保留日志文件的分钟数（以分钟为单位），默认不设置。辅助于 log.retention.ms 属性。如果未设置，则使用 log.retention.hours 中的值 |
| log.retention.ms                                            | 在删除日志文件之前保留日志文件的毫秒数（以毫秒为单位），如果未设置，则使用 log.retention.minutes 中的值。如果设置为 -1，则不应用时间限制。 |
| log.roll.hours                                              | 推出新日志段之前的最长时间（以小时为单位），次于 log.roll.ms 属性，默认为168小时，即7天。 |
| log.roll.ms                                                 | 推出新日志段之前的最长时间（以毫秒为单位）。如果未设置，则使用 log.roll.hours 中的值 |
| log.roll.jitter.hours                                       | 指定日志切分段的小时数，避免日志切分时造成惊群，次要于log.roll.jitter.ms |
| log.roll.jitter.ms                                          | 指定日志切分段的毫秒数，如果不设置，默认使用log.roll.jitter.hours |
| log.segment.bytes                                           | 单个日志文件的最大大小，默认1073741824  即1GB                |
| log.segment.delete.delay.ms                                 | 从文件系统中删除文件之前等待的时间量（以毫秒为单位）默认值为60000。日志文件被真正删除前的保留时间。当删除的条件满足以后，日志将被“删除”，但是这里的删除其实只是将该日志进行了“delete”标注，文件只是无法被索引到了而已。但是文件本身，仍然是存在的，只有当过了log.segment.delete.delay.ms 这个时间以后，文件才会被真正的从文件系统中删除。 |
| message.max.bytes                                           | Broker接收Producer单次请求的最大字节数（如果启用了压缩，则压缩后），默认1048588。间接限制了单条消息的大小。该参数值不应该设置得大于Consumer端fetch.message.max.bytes参数的值。<br>如果增加此值，并且存在早于 0.10.2 的使用者，则使用者的提取大小也必须增加 |
| metadata.log.dir                                            | 此配置确定我们在 KRaft 模式下放置集群元数据日志的位置。如果未设置，则元数据日志将放置在 log.dirs 中的第一个日志目录中。 |
| metadata.log.max.record.bytes.between.snapshots             | 这是生成新快照之前日志中最新快照和高水位线之间所需的最大字节数。默认值为 20971520。要根据使用的时间生成快照，请参阅配置。当达到最大时间间隔或达到最大字节限制时，Kafka 节点将生成快照。`metadata.log.max.snapshot.interval.ms` |
| metadata.log.max.snapshot.interval.ms                       | 如果日志中存在未包含在最新快照中的已提交记录，则这是等待生成快照的最大毫秒数。值为零将禁用基于时间的快照生成。默认值为3600000(1H)。如果要根据元数据字节数生成快照，请参见配置`metadata.log.max.record.bytes.between.snapshots`。当达到最大时间间隔或达到最大字节数限制时，Kafka 节点将生成快照。 |
| metadata.log.segment.bytes                                  | 单个元数据日志文件的最大大小。默认1073741824  即1G           |
| metadata.log.segment.ms                                     | 推出新元数据日志文件之前的最长时间（以毫秒为单位）。默认604800000 (7 天) |
| metadata.max.retention.bytes                                | 删除旧快照和日志文件之前元数据日志和快照的最大组合大小。默认104857600 (100 M)。<br>由于在删除任何日志之前必须至少存在一个快照，因此这是一项软限制。 |
| metadata.max.retention.ms                                   | 元数据日志文件或快照在删除之前保留它的毫秒数。默认604800000 (7 天)<br>由于必须至少存在一个快照才能删除任何日志，因此这是一个软限制。 |
| min.insync.replicas                                         | 当生产者将 acks 设置为 “all”（或“-1”）时，min.insync.replicas 指定必须确认写入才能被视为成功的最小副本数。该配置默认值是1。如果无法满足此最小值，则生产者将引发异常（NotEnoughReplicas 或 NotEnoughReplicasAfterAppend）。<br>当一起使用时，min.insync.replicas 和 ack 允许您强制执行更高的持久性保证。典型的场景是创建一个复制因子为 3 的主题，将 min.insync.replicas 设置为 2，并使用“all”的 ack 进行生成。这将确保生产者在大多数副本未收到写入时引发异常。 |
| node.id                                                     | 当“process.roles”为非空时，与此进程所扮演的角色关联的节点 ID。这是在 KRaft 模式下运行时所需的配置。 |
| num.io.threads                                              | 服务器用于处理请求（可能包括磁盘 I/O）的线程数。默认值是8    |
| num.network.threads                                         | 服务器用于接收来自网络的请求并向网络发送响应的线程数。默认值3。<br>注意：每个侦听器（控制器侦听器除外）都会创建自己的线程池。 |
| num.recovery.threads.per.data.dir                           | 每个数据目录用于启动时日志恢复和关闭时刷新的线程数。默认值1  |
| num.replica.alter.log.dirs.threads                          | 可以在日志目录log.dirs（可能包括磁盘 I/O）之间移动副本的线程数 |
| num.replica.fetchers                                        | 用于从每个broker复制记录的提取程序线程数。默认值是1。<br>每个 Broker 上的 fetcher 总数`num.replica.fetchers`与集群中的 Broker 数量相乘。增加此值可以提高跟随者和领导者 Broker 中的 I/O 并行度，但代价是更高的 CPU 和内存利用率。 |
| offset.metadata.max.bytes                                   | 与偏移量提交关联的元数据条目的最大大小。默认值4096 (4 kb)    |
| offsets.commit.required.acks                                | 在接受提交之前所需的确认。通常，不应覆盖默认值 （-1）。      |
| offsets.commit.timeout.ms                                   | 偏移量提交将被延迟，直到偏移量主题的所有副本都收到提交或达到此超时时间。这类似于生产者请求超时。默认值5000（5秒） |
| offsets.load.buffer.size                                    | 将偏移量加载到缓存中时从偏移量段读取的批量字节大小（软限制，如果记录太大则覆盖）。默认5242880 |
| offsets.retention.check.interval.ms                         | 检查过时偏移量的频率，默认600000 (10 minutes)                |
| offsets.retention.minutes                                   | 对于订阅的消费者，在以下情况下，特定分区的已提交偏移量将过期并被丢弃： 1）在消费者组失去所有消费者（即变空）后，此保留期已过； 2) 自上次为该分区提交偏移量以来，该保留期已过，并且该组不再订阅相应的主题。 对于独立消费者（使用手动分配），自上次提交以来的保留期过后，偏移量将过期。 请注意，当通过delete-group请求删除一个组时，其提交的偏移量也将被删除，而无需额外的保留期； 此外，当通过删除主题请求删除主题时，在传播元数据更新时，该主题的任何组的提交偏移量也将被删除，而无需额外的保留期。默认值10080 |
| offsets.topic.compression.codec                             | 偏移量主题的压缩编解码器 - 压缩可用于实现“原子”提交。        |
| offsets.topic.num.partitions                                | 偏移提交主题的分区数（部署后不应更改）。默认值50             |
| offsets.topic.replication.factor                            | 偏移量主题的复制因子（设置得更高以确保可用性）。默认值3。在集群大小满足此复制因子要求之前，内部主题创建将失败。 |
| offsets.topic.segment.bytes                                 | 偏移量主题段字节应保持相对较小，以便更快地压缩日志和缓存加载。默认104857600 (100 M) |
| process.roles                                               | 此流程扮演的角色：“broker”、“controller”或“broker,controller”（如果两者兼而有之）。此配置仅适用于KRaft（Kafka Raft）模式的集群（而不是ZooKeeper）。对于 Zookeeper 集群，将此配置保留为未定义或为空。 |
| queued.max.requests                                         | 在阻塞网络线程之前，数据平面允许的排队请求数。默认500        |
| replica.fetch.min.bytes                                     | 每个获取响应所需的最小字节数。默认值1。<br>如果没有足够的字节，请等待`replica.fetch.wait.max.ms`（broker配置）。 |
| replica.fetch.wait.max.ms                                   | 跟随者副本发出的每个提取请求的最长等待时间。默认值500。<br>此值应始终小于 replica.lag.time.max.ms，以防止低吞吐量主题的 ISR 频繁收缩 |
| replica.high.watermark.checkpoint.interval.ms               | 将高水位线保存到磁盘的频率。默认5000 (5 秒)                  |
| replica.lag.time.max.ms                                     | 如果追随者至少在这段时间内没有发送任何获取请求或没有消耗到领导者日志结束偏移量，则领导者将从 isr 中删除追随者。默认值30000 (30 秒) |
| replica.socket.receive.buffer.bytes                         | 用于向领导者复制数据的网络请求的套接字接收缓冲区。默认65536 (64 kb) |
| replica.socket.timeout.ms                                   | 网络请求的套接字超时时间。默认30000 (30 秒)。它的值至少应该是replica.fetch.wait.max.ms |
| request.timeout.ms                                          | 配置控制客户端等待请求响应的最长时间。默认30000（30秒）。如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试次数耗尽时使请求失败。 |
| sasl.mechanism.controller.protocol                          | 用于与控制器通信的 SASL 机制。默认值为 GSSAPI。              |
| socket.receive.buffer.bytes                                 | 套接字服务器套接字的SO_RCVBUF缓冲区。如果值为 -1，则将使用操作系统默认值。默认为102400（100 KB） |
| socket.request.max.bytes                                    | 一次socket请求中的最大字节数。默认104857600 (100 M)          |
| socket.send.buffer.bytes                                    | 套接字服务器套接字的SO_SNDBUF缓冲区。如果值为 -1，则将使用操作系统默认值。默认为102400（100 KB） |
| transaction.max.timeout.ms                                  | 事务允许的最大超时。默认900000 (15 分钟)。如果客户端请求的交易时间超过此时间，则代理将在 InitProducerIdRequest 中返回错误。这可以防止客户端超时过大，这可能会使使用者停止读取事务中包含的主题。 |
| transaction.state.log.load.buffer.size                      | 将生产者 ID 和事务加载到缓存中时从事务日志段读取的批大小（软限制，如果记录太大则覆盖）。默认值5242880 |
| transaction.state.log.min.isr                               | 重写事务主题的 min.insync.replicas 配置。默认值2             |
| transaction.state.log.num.partitions                        | 事务主题的分区数（部署后不应更改）。默认值50                 |
| transaction.state.log.replication.factor                    | 事务主题的复制因子（设置得更高以确保可用性），默认值3。<br>在集群大小满足此复制因子要求之前，内部主题创建将失败。 |
| transaction.state.log.segment.bytes                         | 事务主题段字节应保持相对较小，以便于更快的日志压缩和缓存加载，默认104857600 (100 M) |
| transactional.id.expiration.ms                              | 在事务 ID 过期之前，事务协调器在未收到当前事务的任何事务状态更新的情况下将等待的时间（以毫秒为单位）。默认值604800000 (7 天)。事务 ID 不会在事务仍在进行期间过期。 |
| unclean.leader.election.enable                              | 指示是否将不在 ISR 集中的副本作为最后手段选举为领导者，即使这样做可能会导致数据丢失。默认值false |
| zookeeper.connection.timeout.ms                             | 客户端等待与 ZooKeeper 建立连接的最长时间。如果未设置，则使用 zookeeper.session.timeout.ms 中的值 |
| zookeeper.max.in.flight.requests                            | 客户端在阻塞之前向 Zookeeper 发送的未确认请求的最大数量。默认值10 |
| zookeeper.metadata.migration.enable                         | 启用 ZK 到 KRaft 迁移                                        |
| zookeeper.session.timeout.ms                                | Zookeeper 会话超时时间，默认18000 (18 秒)                    |
| zookeeper.set.acl                                           | 设置客户端使用安全 ACL                                       |
| broker.heartbeat.interval.ms                                | broker 之间 心跳的时间长度（以毫秒为单位）。在 KRaft 模式下运行时使用。默认值2000 (2 秒) |
| broker.id.generation.enable                                 | 在服务器上启用自动broker ID 生成。启用后，应检查served.broker.max.id配置的值。默认值true |
| broker.rack                                                 | 说明当前broker在哪个机房。                                   |
| broker.session.timeout.ms                                   | broker 租约在没有检测信号的情况下持续的时间长度（以毫秒为单位）。在 KRaft 模式下运行时使用。默认9000 (9 秒) |
| connections.max.idle.ms                                     | 在该配置指定的毫秒数后关闭空闲连接。默认600000 (10 分钟)     |
| connections.max.reauth.ms                                   | 当显式地设置为正数(默认值为0，而不是正数)时，将在v2.2.0或更高版本的客户端进行身份验证时将不会超过配置值的会话生存期与它们通信。broker将断开在会话生命周期内没有重新身份验证的任何此类连接，然后将其用于重新身份验证以外的任何目的。配置名可以选择使用监听器前缀和小写的SASL机制名作为前缀。例如listener.name.sasl_ssl.oauthbearer.connections.max.reauth.ms=3600000<br/><br/><br/> |
| controlled.shutdown.enable                                  | 是否允许控制关闭服务器，默认为true。                         |
| controlled.shutdown.max.retries                             | 有控制的关机可能由于多种原因而失败。这将确定发生此类失败时重试的次数，默认值为3。 |
| controlled.shutdown.retry.backoff.ms                        | 在每次重试之前，系统需要一段时间从导致之前失败的状态(控制器故障转移、复制延迟等)中恢复过来。这个配置决定了在重试之前等待的时间。默认时间5000毫秒。 |
| controller.quorum.append.linger.ms                          | 领导者在将写入刷新到磁盘之前等待写入累积的持续时间（以毫秒为单位）。默认25毫秒 |
| controller.quorum.request.timeout.ms                        | 配置控制客户端等待请求响应的最长时间。如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试用尽时使请求失败。默认2000 (2 秒) |
| controller.socket.timeout.ms                                | controller到broker通道的套接字超时时间，默认30000毫秒。      |
| default.replication.factor                                  | 自动创建的主题的默认复制因子。默认为1                        |
| delegation.token.expiry.time.ms                             | token在需要更新之前的有效性时间（以毫秒为单位）。默认值 86400000 (1 天)。 |
| delegation.token.master.key                                 | 已弃用：“delegation.token.secret.key”的别名，应使用该别名而不是此配置。 |
| delegation.token.secret.key                                 | 用于生成和验证委派令牌的密钥。必须在所有代理中配置相同的密钥。如果将 Kafka 与 KRaft 一起使用，还必须在所有控制器上设置密钥。如果未设置密钥或将其设置为空字符串，代理将禁用委派令牌支持。 |
| delegation.token.max.lifetime.ms                            | 令牌具有最大生存期，超过该生存期将无法再续订。默认值604800000 (7天)。 |
| delete.records.purgatory.purge.interval.requests            | 删除记录请求的清除时间间隔(以请求数量计)，默认为1。          |
| fetch.max.bytes                                             | 我们将为获取请求返回的最大字节数。必须至少为 1024。默认57671680 (55 M) |
| fetch.purgatory.purge.interval.requests                     | 获取请求的清除时间间隔(以请求数为单位)，默认值为1000。       |
| group.initial.rebalance.delay.ms                            | 在进行第一次再平衡之前，group协调者等待更多消费者加入新group的时间。更长的延迟意味着重新平衡的可能性更小，但会增加处理开始之前的时间。默认为3000毫秒。 |
| group.max.session.timeout.ms                                | 注册使用者允许的最大会话超时，默认为1800000毫秒，即30分钟。更长的超时使使用者有更多时间处理心跳之间的消息，但检测故障的时间更长。 |
| group.max.size                                              | 单个消费者组所能容纳的最大消费者数量。默认2147483647个。     |
| group.min.session.timeout.ms                                | 注册使用者允许的最小会话超时时间，默认6000毫秒。更短的超时时间将导致更快的故障检测，但代价是更频繁的用户心跳，这会耗尽broker资源。 |
| initial.broker.registration.timeout.ms                      | 在最初向控制器仲裁注册时，在声明失败并退出代理进程之前等待的毫秒数。默认60000（1分钟） |
| inter.broker.listener.name                                  | 用于代理之间通信的侦听器名称。如果此属性未设置，则侦听器名称由“security.inter.broker.protocol”定义。同时设置此属性和“security.inter.broker.protocol”属性是错误的。 |
| inter.broker.protocol.version                               | 指定将使用哪个版本的broker间协议。这通常在所有broker都升级到新版本之后发生。 |
| log.cleaner.backoff.ms                                      | 当没有要清理的日志时的睡眠时间,默认15000毫秒。               |
| log.cleaner.dedupe.buffer.size                              | 所有清理线程中用于日志重复数据删除的总内存，默认134217728(128M)。 |
| log.cleaner.delete.retention.ms                             | 删除记录保留多久?默认86400000毫秒，即24小时。                |
| log.cleaner.enable                                          | 启用日志清理程序在服务器上运行。默认true。<br>如果使用任何具有“cleanup.policy=compact”的主题，包括内部偏移主题，则应设置为true。如果为false，这些主题将不会被压缩，并且大小将不断增长。 |
| log.cleaner.io.buffer.load.factor                           | 日志清理器dedupe缓冲负载系数，默认为0.9。dedupe缓冲区可以变为满的百分比，虽然较高的值将允许一次清除更多的日志，但会导致更多的哈希冲突。 |
| log.cleaner.io.buffer.size                                  | 所有清理器线程中用于日志清理器I/O缓冲区的总内存，默认524288(512K)。 |
| log.cleaner.io.max.bytes.per.second                         | 日志清理程序将被限制，以便其读取和写入i/o的总和平均小于此值。默认1.7976931348623157E308 |
| log.cleaner.max.compaction.lag.ms                           | 消息在日志中不符合压缩条件的最长时间，默认9223372036854775807。仅适用于正在压缩的日志。 |
| log.cleaner.min.cleanable.ratio                             | 符合清理条件的日志的脏日志与总日志的最小比率，默认为0.5。如果还指定了log.cleaner.max.compaction.lag.ms或log.cleaner.min.compaction.lag.ms配置，那么日志压缩器会在以下情况下认为日志符合压缩条件:<br/>    1)、脏比率阈值已经满足，并且日志至少在log.cleaner.min.compaction.lag.ms期间有脏(未压缩)记录<br/>    2)、脏比率阈值已经满足，如果日志在不超过log.cleaner.max.compaction.lag.ms期间有脏(未压缩)记录<br/> |
| log.cleaner.min.compaction.lag.ms                           | 消息在日志中保持未压缩状态的最小时间，默认为0。仅适用于正在压缩的日志。 |
| log.cleaner.threads                                         | 用于日志清理的后台线程数。默认1                              |
| log.cleanup.policy                                          | 超出保留窗口的段的默认清除策略，默认为delete。用逗号分隔的有效策略列表。可选策略是:“delete”和“compact”。 |
| log.index.interval.bytes                                    | 将一个条目添加到偏移索引中的时间间隔，每次间隔添加的大小，默认为4096（1K）。 |
| log.index.size.max.bytes                                    | 偏移量索引的最大大小（以字节为单位）。默认10485760 （10M）   |
| log.local.retention.bytes                                   | 分区在符合删除条件之前可以增长的本地日志段的最大大小。默认值为 -2，它表示要使用的“log.retention.bytes”值。有效值应始终小于或等于“log.retention.bytes”值。 |
| log.local.retention.ms                                      | 在符合删除条件之前保留本地日志段的毫秒数。默认值为 -2，表示要使用的“log.retention.ms”值。有效值应始终小于或等于“log.retention.ms”值。 |
| log.message.format.version                                  | 指定broker将用于向日志追加消息的消息格式版本，该值应该是有效的 MetadataVersion。默认值3.0-IV1。<br>一些示例是：0.8.2、0.9.0.0、0.10.0。通过设置特定的消息格式版本，用户可以确认磁盘上现有的所有消息都小于或等于指定的版本。不正确地设置此值将导致使用旧版本的用户无法使用，因为他们将接收到他们不理解的格式的消息。 |
| log.message.timestamp.after.max.ms                          | 此配置设置消息时间戳与broker时间戳之间允许的时间戳差异。消息时间戳可以晚于或等于broker的时间戳，最大允许差异由此配置中设置的值确定。如果 log.message.timestamp.type=CreateTime，则当时间戳的差异超过此指定阈值时，消息将被拒绝。如果 log.message.timestamp.type=LogAppendTime，则忽略此配置。 |
| log.message.timestamp.before.max.ms                         | 此配置设置代理时间戳和消息时间戳之间允许的时间戳差异。消息时间戳可以早于或等于代理的时间戳，最大允许差异由此配置中设置的值确定。如果 log.message.timestamp.type=CreateTime，则当时间戳的差异超过此指定阈值时，消息将被拒绝。如果 log.message.timestamp.type=LogAppendTime，则忽略此配置。 |
| log.message.timestamp.difference.max.ms                     | [已弃用]broker接收消息时的时间戳与消息中指定的时间戳之间允许的最大差异。如果 log.message.timestamp.type=CreateTime，则当时间戳的差异超过此阈值时，消息将被拒绝。如果 log.message.timestamp.type=LogAppendTime，则忽略此配置。允许的最大时间戳差异不应大于 log.retention.ms 以避免不必要的频繁日志滚动。 |
| log.message.timestamp.type                                  | 定义消息中的时间戳是消息创建时间还是日志追加时间。默认值CreateTime。<br>该值应可选列表是：“CreateTime”或“LogAppendTime”。 |
| log.preallocate                                             | 创建新段时是否应预先分配文件？如果您在Windows上使用Kafka，您可能需要将其设置为true。 |
| log.retention.check.interval.ms                             | 日志清理程序检查任何日志是否符合删除条件的频率（以毫秒为单位）。默认300000毫秒，即5分钟。 |
| max.connection.creation.rate                                | 我们在任何时候允许broker的最大连接创建速率。侦听器级别限制还可以通过在配置名称前添加侦听器前缀来配置，例如，`listener.name.internal.max.connection.creation.rate`应根据broker容量配置broker范围的连接速率限制，而应根据应用程序要求配置侦听器限制。如果达到侦听器或broker限制（broker间侦听器除外），新连接将受到限制。仅当达到侦听器级别的速率限制时，才会限制broker间侦听器上的连接。 |
| max.connections                                             | 我们在任何时候允许broker的最大连接数。除了使用 max.connections.per.ip 配置的任何 ip 限制之外，还应用此限制。侦听器级别限制也可以通过在配置名称前添加侦听器前缀来配置，<br>例如`listener.name.internal.max.connections`. broker范围的限制应根据broker容量进行配置，而侦听器限制应根据应用程序要求进行配置。如果达到侦听器或broker限制，则新连接将被阻止。即使达到broker范围的限制，也允许broker间侦听器上的连接。在这种情况下，另一个侦听器上最近最少使用的连接将被关闭。 |
| max.connections.per.ip                                      | 我们允许来自每个 IP 地址的最大连接数。如果使用 max.connections.per.ip.overrides 属性配置了覆盖，则可以将其设置为 0。如果达到限制，来自该 IP 地址的新连接将被丢弃。 |
| max.connections.per.ip.overrides                            | 每个 IP 或主机名的逗号分隔列表将覆盖默认的最大连接数。示例值为“hostName:100,127.0.0.1:200” |
| max.incremental.fetch.session.cache.slots                   | 我们将维护的增量获取会话的最大数量。默认1000                 |
| num.partitions                                              | 每个主题的默认日志分区数，默认1                              |
| password.encoder.old.secret                                 | 用于动态配置密码编码的旧秘钥。只有在秘钥被更新时才需要这样做，如果指定，所有动态编码的密码将使用这个旧秘钥进行解码，并在broker启动时使用password.encoder.secret重新编码。 |
| password.encoder.secret                                     | 用于对此broker的动态配置的密码进行编码的密钥。               |
| principal.builder.class                                     | 实现KafkaPrincipalBuilder接口的类的完全限定名，该接口用于构建授权期间使用的KafkaPrincipal对象。默认值org.apache.kafka.common.security.authenticator.DefaultKafkaPrincipalBuilder<br>这个配置还支持以前用于SSL上的客户端身份验证的过期的PrincipalBuilder接口。<br>如果没有定义主体构建器，则默认行为取决于所使用的安全协议。对于SSL身份验证，将使用ssl.principal.mapping.rules定义的规则应用于专有名称如果从客户端提供的证书，否则，如果不需要客户端身份验证，则主体名将是ANONYMOUS(匿名)的。对于SASL身份验证，如果使用GSSAPI，主体将会使用sasl.kerberos.principal.to.local.rules定义的规则派生，如果使用其他机制，则使用SASL身份验证ID派生主体。对于PLAINTEXT，主体将是ANONYMOUS(匿名)的。<br/> |
| producer.purgatory.purge.interval.requests                  | 生产者请求的清除间隔（以请求数为单位），默认1000             |
| queued.max.request.bytes                                    | 在不读取更多请求之前允许的排队字节数                         |
| remote.log.manager.thread.pool.size                         | 用于复制段、获取远程日志索引和清理远程日志段的计划任务的线程池大小。默认10 |
| remote.log.metadata.manager.class.name                      | “RemoteLogMetadataManager”实现类名。默认值org.apache.kafka.server.log.remote.metadata.storage.TopicBasedRemoteLogMetadataManager |
| remote.log.metadata.manager.class.path                      | “RemoteLogMetadataManager”实现的类路径。如果指定，RemoteLogMetadataManager 实现及其依赖库将由专用类加载器加载，该类加载器在 Kafka 代理类路径之前搜索此类路径。此参数的语法与标准 Java 类路径字符串相同。 |
| remote.log.metadata.manager.impl.prefix                     | 用于将属性传递给 RemoteLogMetadataManager 实现的前缀。例如，此值可以是“rlmm.config.”。默认值rlmm.config. |
| remote.log.metadata.manager.listener.name                   | 本地broker 的侦听器名称，如果 RemoteLogMetadataManager 实现需要，它应连接到该代理。 |
| remote.log.reader.max.pending.tasks                         | 最大远程日志读取器线程池任务队列大小。默认100如果任务队列已满，则提取请求将出现错误。 |
| remote.log.reader.threads                                   | 为处理远程日志读取而分配的线程池的大小。默认10               |
| remote.log.storage.manager.class.name                       | “RemoteStorageManager”实现的完全限定类名。                   |
| remote.log.storage.manager.class.path                       | “RemoteStorageManager”实现的类路径。如果指定，RemoteStorageManager 实现及其依赖库将由专用类加载器装入，该类加载器在 Kafka 代理类路径之前搜索此类路径。此参数的语法与标准 Java 类路径字符串相同。 |
| remote.log.storage.manager.impl.prefix                      | 用于将属性传递给远程存储管理器实现的前缀。默认是“rsm.config.”。 |
| remote.log.storage.system.enable                            | 是否在代理中启用分层存储功能。默认值为false。如果是true，broker将启动分层存储功能所需的所有服务。 |
| replica.fetch.backoff.ms                                    | 发生提取分区错误时休眠的时间量。默认1000（1秒）              |
| replica.fetch.max.bytes                                     | 试图为每个分区获取的消息字节数，默认为1048576(1M)。这不是绝对最大值，如果fetch的第一个非空分区中的第一个记录批处理大于这个值，仍然会返回该记录批处理，以确保可以进行进度。broker接受的最大记录批处理大小通过message.max.bytes定义(broker配置)或max.message.bytes(topic配置)。 |
| replica.fetch.response.max.bytes                            | 整个提取响应预期的最大字节数。默认10485760(10M)。记录是分批提取的，如果提取的第一个非空分区中的第一个记录批次大于此值，则仍将返回记录批次，以确保可以取得进展。因此，这不是绝对的最大值。代理接受的最大记录批处理大小是通过message.max.bytes（代理配置）或max.message.bytes（主题配置）定义的。 |
| replica.selector.class                                      | 实现副本选择器的完全限定类名。broker使用它来查找首选只读副本。默认情况下，我们使用返回领导者的实现。 |
| reserved.broker.max.id                                      | broker可以使用的最大ID值，默认1000                           |
| sasl.client.callback.handler.class                          | 实现身份验证回调 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.enabled.mechanisms                                     | Kafka服务器中启用的SASL机制列表。该列表可能包含安全提供程序可用的任何机制。默认情况下，仅启用GSSAPI。 |
| sasl.jaas.config                                            | JAAS配置文件使用的格式的SASL连接的JAAS登录上下文参数。说明了JAAS配置文件格式为：“loginModuleClass controlFlag (optionName=optionValue)*;”。对于代理，配置必须以监听器前缀和SASL机制名称为小写前缀。例如，“listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule” |
| sasl.kerberos.kinit.cmd                                     | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin                       | 登录线程在刷新尝试之间的睡眠时间。默认60000毫秒              |
| sasl.kerberos.principal.to.local.rules                      | 从主体名到短名称(通常是操作系统用户名)的映射规则列表，默认DEFAULT。规则将按顺序计算，第一个匹配主体名称的规则将用于将其映射为短名称。列表中以后的任何规则都将被忽略。默认情况下，形式{username}/{hostname}@{REALM}的主体名称映射到{username}。注意，如果principal.builder.class配置提供了KafkaPrincipalBuilder的扩展，则该配置将被忽略 |
| sasl.kerberos.service.name                                  | Kafka 运行的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.kerberos.ticket.renew.jitter                           | 随机不稳定的百分比增加到更新时间，默认0.05。法定值在0至0.25(含25%)之间。目前只适用于oauthholder。 |
| sasl.kerberos.ticket.renew.window.factor                    | 登录线程将休眠直到到达从上次刷新到票证到期的指定窗口时间因子，此时它将尝试更新票证，默认为0.8。 |
| sasl.login.callback.handler.class                           | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
| sasl.login.class                                            | 实现 Login 接口的类的完全限定名称。 对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。 例如: `listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin` |
| sasl.login.refresh.buffer.seconds                           | 刷新凭据时在凭据过期前要维护的缓冲区时间，以秒为单位。如果刷新发生在比缓冲区秒数更接近过期的时候，那么刷新将被上移，以尽可能多地维护缓冲区时间。合法值在0~3600秒(1小时)之间;如果没有指定值，则使用默认值300秒(5分钟)。这个值和sasl.login.refresh.min.period.seconds都会被忽略如果他们的总和超过了凭据的剩余生命周期。目前只适用于oauthholder。 |
| sasl.login.refresh.min.period.seconds                       | 登录刷新线程在刷新凭据之前等待的最小时间，以秒为单位。合法值在0到900秒之间(15分钟);如果没有指定值，则使用默认值60秒(1分钟)。此值和sasl.login.refresh.buffer.seconds将会被忽略如果他们的总和超过了凭据的剩余生命周期。目前只适用于oauthholder。 |
| sasl.login.refresh.window.factor                            | 登录刷新线程将休眠，直到达到与凭据的生存期相关的指定窗口因子，此时它将尝试刷新凭据。合法值在0.5(50%)和1.0(100%)之间;如果没有指定值，则使用缺省值0.8(80%)。目前只适用于oauthholder。 |
| sasl.login.refresh.window.jitter                            | 添加到登录刷新线程睡眠时间中的相对于凭据生命周期的最大随机时基误差。法定值在0至0.25(含25%)之间;如果没有指定值，则使用默认值0.05(5%)。目前只适用于oauthholder。 |
| sasl.mechanism.inter.broker.protocol                        | 用于broker间通信的 SASL 机制。默认值为 GSSAPI。              |
| sasl.oauthbearer.jwks.endpoint.url                          | 可以从中检索提供商的 [JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5) 的 OAuth/OIDC 提供商 URL。 URL 可以基于 HTTP(S) 或基于文件。 如果 URL 基于 HTTP(S)，则将通过代理启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。 所有当时的密钥都将缓存在代理上以用于传入请求。 如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。 但是，代理会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。 如果 URL 是基于文件的，代理将在启动时从配置的位置加载 JWKS 文件。 如果 JWT 包含 JWKS 文件中不存在的“kid”标头值，代理将拒绝 JWT 并且身份验证将失败。 |
| sasl.oauthbearer.token.endpoint.url                         | OAuth/OIDC 身份提供商的 URL。 如果 URL 基于 HTTP(S)，则它是颁发者的令牌端点 URL，将根据 sasl.jaas.config 中的配置发出登录请求。 如果 URL 是基于文件的，则它指定一个包含 OAuth/OIDC 身份提供商颁发的访问令牌（JWT 序列化形式）的文件，用于授权。 |
| sasl.server.callback.handler.class                          | 实现 AuthenticateCallbackHandler 接口的 SASL 服务器回调处理程序类的完全限定名称。服务器回调处理程序必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.plain.sasl.server.callback.handler.class=com.example.CustomPlainCallbackHandler。 |
| sasl.server.max.receive.size                                | 初始 SASL 身份验证之前和期间允许的最大接收大小。默认接收大小为 512KB。GSSAPI 将请求限制为 64K，但默认情况下，对于自定义 SASL 机制，我们允许最多 512KB。在实践中，PLAIN、SCRAM 和 OAUTH 机制可以使用更小的限制。 |
| security.inter.broker.protocol                              | 用于在broker之间进行通信的安全协议。默认值PLAINTEXT，可选值为：PLAINTEXT, SSL, SASL_PLAINTEXT, SASL_SSL。同时设置此属性和 inter.broker.listener.name 属性是错误的。 |
| socket.connection.setup.timeout.max.ms                      | 客户端等待建立套接字连接的最长时间。默认30000（30秒）。对于每个连续的连接失败，连接设置超时将呈指数增长，直至达到此最大值。为了避免连接风暴，将对超时应用 0.2 的随机化因子，从而产生比计算值低 20% 到高 20% 之间的随机范围。 |
| socket.connection.setup.timeout.ms                          | 客户端等待建立套接字连接的时间。默认100000（10秒）。如果在超时之前未建立连接，客户端将关闭套接字通道。 |
| socket.listen.backlog.size                                  | 套接字上挂起的最大连接数。默认50。在 Linux 中，您可能还需要相应地配置 'somaxconn' 和 'tcp_max_syn_backlog' 内核参数才能使配置生效。 |
| ssl.cipher.suites                                           | 密码套件列表。 这是身份验证、加密、MAC 和密钥交换算法的命名组合，用于使用 TLS 或 SSL 网络协议协商网络连接的安全设置。 默认情况下，支持所有可用的密码套件。 |
| ssl.client.auth                                             | 配置 kafka 代理来请求客户端身份验证。 以下设置是常见的：<br>1) `ssl.client.auth=required` 如果设置为必需，则需要客户端身份验证。 <br>2) `ssl.client.auth=requested` 这意味着客户端身份验证是可选的。与必需的不同，如果设置了此选项，客户端可以选择不提供有关其自身的身份验证信息 <br>3）`ssl.client.auth=none` 这意味着不需要客户端身份验证 |
| ssl.enabled.protocols                                       | 为 SSL 连接启用的协议列表。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2,TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值时，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.2，否则将回退到 TLSv1.2（假设两者都至少支持 TLSv1.2）。在大多数情况下，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.key.password                                            | 密钥存储文件中私钥的密码或在“ssl.keystore.key”中指定的 PEM 密钥。 |
| ssl.keymanager.algorithm                                    | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法。 |
| ssl.keystore.certificate.chain                              | 证书链采用由“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                            | 由“ssl.keystore.type”指定的格式的私钥。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                                       | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                                       | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.keystore.type                                           | 密钥存储文件的文件格式。默认值是JKS，这对于客户端是可选的。可选的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                                | 用于生成 SSLContext 的 SSL 协议。 使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。 该值对于大多数用例来说应该没问题。 最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。 较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。 使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。 如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                                | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.trustmanager.algorithm                                  | 信任管理器工厂用于 SSL 连接的算法。 默认值是为 Java 虚拟机配置的信任管理器工厂算法PKIX。 |
| ssl.truststore.certificates                                 | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                                     | 信任存储区文件的位置。                                       |
| ssl.truststore.password                                     | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| ssl.truststore.type                                         | 信任存储文件的文件格式。默认值JKS。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| zookeeper.clientCnxnSocket                                  | 使用 TLS 连接到 ZooKeeper 时，通常设置为 `org.apache.zookeeper.ClientCnxnSocketNetty`。 覆盖通过同名 `zookeeper.clientCnxnSocket` 系统属性设置的任何显式值。 |
| zookeeper.ssl.client.enable                                 | 设置客户端在连接到ZooKeeper时使用TLS，默认值false，可以通过设置zookeeper.client.secure系统属性的显式值覆盖任何值(注意不同的名称)。如果两者都没有设置，则默认为false；如果为true，则zookeeper.clientCnxnSocket(通常是org.apache.zookeeper.ClientCnxnSocketNetty)必须设置。同时被设置的还可能包括zookeeper.ssl.cipher.suites, zookeeper.ssl.crl.enable, zookeeper.ssl.enabled.protocols, zookeeper.ssl.endpoint.identification.algorithm, zookeeper.ssl.keystore.location, zookeeper.ssl.keystore.password, zookeeper.ssl.keystore.type, zookeeper.ssl.ocsp.enable, zookeeper.ssl.protocol, zookeeper.ssl.truststore.location, zookeeper.ssl.truststore.password, zookeeper.ssl.truststore.type。<br/> |
| zookeeper.ssl.keystore.location                             | 使用通过 TLS 连接到 ZooKeeper 的客户端证书时的密钥库位置。覆盖通过`zookeeper.ssl.keyStore.location`系统属性设置的任何显式值（注意驼峰命名法）。 |
| zookeeper.ssl.keystore.password                             | 使用通过 TLS 连接到 ZooKeeper 的客户端证书时的密钥库密码。覆盖通过`zookeeper.ssl.keyStore.password`系统属性设置的任何显式值（注意驼峰命名法）。请注意，ZooKeeper 不支持与 keystore 密码不同的密钥密码，因此请务必将 keystore 中的密钥密码设置为与 keystore 密码相同；否则与 Zookeeper 的连接尝试将失败。 |
| zookeeper.ssl.keystore.type                                 | 使用通过 TLS 连接到 ZooKeeper 的客户端证书时的密钥库类型。 覆盖通过系统属性设置的任何显式值（注意驼峰命名法）。 默认值表示将根据密钥库的文件扩展名自动检测类型。 |
| zookeeper.ssl.truststore.location                           | 使用 TLS 连接到 ZooKeeper 时的信任库位置。覆盖通过`zookeeper.ssl.trustStore.location`系统属性设置的任何显式值（注意驼峰命名法）。 |
| zookeeper.ssl.truststore.password                           | 使用 TLS 连接到 ZooKeeper 时的信任库密码。覆盖通过`zookeeper.ssl.trustStore.password`系统属性设置的任何显式值（注意驼峰命名法）。 |
| zookeeper.ssl.truststore.type                               | 使用 TLS 连接到 ZooKeeper 时的信任库类型。覆盖通过`zookeeper.ssl.trustStore.type`系统属性设置的任何显式值（注意驼峰命名法）。默认值`null`表示将根据信任库的文件扩展名自动检测类型。 |
| alter.config.policy.class.name                              | 应用于验证的更改配置策略类。该类应该实现该`org.apache.kafka.server.policy.AlterConfigPolicy`接口。 |
| alter.log.dirs.replication.quota.window.num                 | 为更改log dirs复制配额在内存中保留的样本数量，默认值为11。   |
| alter.log.dirs.replication.quota.window.size.seconds        | 更改日志目录复制配额的每个示例的时间跨度，默认1秒            |
| authorizer.class.name                                       | 实现org.apache.kafka.server.authorizer.Authorizer接口的类的完全限定名，broker将使用该实现类进行授权。这个配置还支持实现已被弃用的以前用于授权kafka.security.auth.Authorizer的接口。 |
| auto.jmx.reporter                                           | 已弃用。是否自动包含 JmxReporter，即使它没有在 中列出`metric.reporters`。此配置将在 Kafka 4.0 中删除，用户应添加`org.apache.kafka.common.metrics.JmxReporter`该配置`metric.reporters`以启用 JmxReporter。 |
| client.quota.callback.class                                 | 实现 ClientQuotaCallback 接口的类的完全限定名称，用于确定应用于客户端请求的配额限制。默认情况下，应用存储在 ZooKeeper 中的 和 配额。对于任何给定的请求，将应用与会话的用户主体和请求的客户端 ID 匹配的最具体的配额。 |
| connection.failed.authentication.delay.ms                   | 身份验证失败时的连接关闭延迟：这是身份验证失败时连接关闭将延迟的时间（以毫秒为单位）默认100。必须将其配置为小于connections.max.idle.ms，以防止连接超时。 |
| controller.quorum.retry.backoff.ms                          | 尝试重试对给定主题分区的失败请求之前等待的时间。默认20毫秒。这避免了在某些故障场景下在紧密循环中重复发送请求。 |
| controller.quota.window.num                                 | 控制器突变配额要保留在内存中的样本数，默认11                 |
| controller.quota.window.size.seconds                        | 每个样本的控制器突变配额的时间跨度，默认1秒                  |
| create.topic.policy.class.name                              | 应用于验证的create topic策略类。这个类应该实现org.apache.kafka.server.policy.CreateTopicPolicy接口。 |
| delegation.token.expiry.check.interval.ms                   | 扫描间隔以删除过期的委托令牌，默认3600000毫秒，即1小时。     |
| kafka.metrics.polling.interval.secs                         | 可在 kafka.metrics.reporters 实现中使用的指标轮询间隔（以秒为单位）。默认10秒 |
| kafka.metrics.reporters                                     | 用作Yammer度量自定义报告器的类列表。自定义报告器应该实现kafka.metrics.KafkaMetricsReporter特征。如果客户端希望在定制报告器上公开JMX操作，那么定制报告器需要另外实现一个扩展kafka.metrics.KafkaMetricsReporterMBean特性，同时注册的MBean符合标准MBean约定。 |
| listener.security.protocol.map                              | 在侦听器名称和安全协议之间映射，默认为PLAINTEXT:PLAINTEXT,SSL:SSL,SASL_PLAINTEXT:SASL_PLAINTEXT,SASL_SSL:SASL_SSL。为了使同一个安全协议能够在多个端口或IP中使用，必须定义这一点，例如，内部和外部通信可以分离，即使两者都需要SSL，具体地说，用户可以用名称内部和外部定义监听器，这个属性为:'INTERNAL:SSL,EXTERNAL:SSL'，键和值用冒号分隔，映射项用逗号分隔。每个侦听器名称应该只在映射中出现一次。可以为每个侦听器配置不同的安全(SSL和SASL)设置，方法是在配置名中添加一个规范化的前缀(侦听器名称是小写的)，例如，要为内部监听器设置不同的密钥存储，那么就需要设置一个名为listener.name.internal.ssl.keystore.location的配置。如果没有设置监听器名称的配置，该配置将退回到通用配置(即ssl.keystore.location)。 |
| log.message.downconversion.enable                           | 此配置控制是否启用消息格式的向下转换以满足消费请求，默认为true。当设置为false时，broker将不会为希望使用旧消息格式的用户执行向下转换。broker将会以UNSUPPORTED_VERSION错误响应来自这样旧的客户端的消费请求。此配置不适用将可能需要的任何消息格式向下转换复制到followers。 |
| metadata.max.idle.interval.ms                               | 此配置控制活动控制器应将无操作记录写入元数据分区的频率。如果值为 0，则无操作记录不会附加到元数据分区。默认值为 500 |
| metric.reporters                                            | 用作度量报告器的类列表。实现org.apache.kafka.common.metrics.MetricsReporter接口允许插入将被通知新度量创建的类。JmxReporter一直包含用来注册JMX统计信息。 |
| metrics.num.samples                                         | 为计算指标而维护的样本数量。默认2                            |
| metrics.recording.level                                     | 度量标准的最高记录级别，默认info，可选项为INFO, DEBUG。      |
| metrics.sample.window.ms                                    | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| password.encoder.cipher.algorithm                           | 用于对动态配置的密码进行编码的密码算法。默认值AES/CBC/PKCS5Padding |
| password.encoder.iterations                                 | 用于编码动态配置的密码的迭代计数，默认4096，最小1024。       |
| password.encoder.key.length                                 | 用于对动态配置的密码进行编码的密钥长度。默认128，最小为8。   |
| password.encoder.keyfactory.algorithm                       | 用于对动态配置的密码进行编码的密钥工厂算法。如果可用，默认值为 PBKDF2WithHmacSHA512（如果可用），否则为 PBKDF2WithHmacSHA1。 |
| producer.id.expiration.ms                                   | 主题分区领导者在生产者 ID 过期之前等待的时间（以毫秒为单位）。默认86400000 (1 天) 当与其关联的交易仍在进行时，生产者 ID 不会过期。 请注意，如果由于主题的保留设置而删除了生产者 ID 的最后一次写入，则生产者 ID 可能会更快过期。 将此值设置为与 `delivery.timeout.ms` 相同或更高可以帮助防止重试期间过期并防止消息重复，但默认值对于大多数用例来说应该是合理的。 |
| quota.window.num                                            | 保留在内存中用于客户端配额的样本数量，默认11。               |
| quota.window.size.seconds                                   | 客户端配额的每个示例的时间跨度，默认1秒。                    |
| remote.log.manager.task.interval.ms                         | 远程日志管理器运行计划任务（如复制段）和清理远程日志段的时间间隔。默认3000秒) |
| remote.log.metadata.custom.metadata.max.bytes               | broker应从远程存储插件接受的自定义元数据的最大大小（以字节为单位）。默认128，最小为8。如果自定义元数据超过此限制，则不会存储更新的段元数据，会尝试删除复制的数据，并且该主题分区的远程复制任务将停止并显示错误。 |
| replication.quota.window.num                                | 要在内存中保留用于复制配额的样本数，默认11                   |
| replication.quota.window.size.seconds                       | 复制配额的每个示例的时间跨度，默认1秒                        |
| sasl.login.connect.timeout.ms                               | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                                  | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                           | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。 如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。 合法值介于 0 到 3600（1 小时）之间； 如果未指定值，则使用默认值 300（5 分钟）。 如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。 目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds                       | 登录刷新线程在刷新凭据之前等待的最小时间，以秒为单位。合法值在0到900秒之间(15分钟);如果没有指定值，则使用默认值60秒(1分钟)。此值和sasl.login.refresh.buffer.seconds将会被忽略如果他们的总和超过了凭据的剩余生命周期。目前只适用于oauthholder。 |
| sasl.login.refresh.window.factor                            | 登录刷新线程将休眠，直到达到与凭据的生存期相关的指定窗口因子，此时它将尝试刷新凭据。合法值在0.5(50%)和1.0(100%)之间;如果没有指定值，则使用缺省值0.8(80%)。目前只适用于oauthholder。 |
| sasl.login.refresh.window.jitter                            | 添加到登录刷新线程睡眠时间中的相对于凭据生命周期的最大随机时基误差。法定值在0至0.25(含25%)之间;如果没有指定值，则使用默认值0.05(5%)。目前只适用于oauthholder。 |
| sasl.login.retry.backoff.max.ms                             | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位）。默认10000（10秒）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                                 | 尝试登录外部身份验证提供程序之间的初始等待的（可选）值（以毫秒为单位）。默认100毫秒。登录使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，并且在尝试之间等待时间将加倍，直至达到 sasl.login.retry.backoff.max.ms 设置指定的最大等待时间。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                         | 以秒为单位的（可选）值，默认30秒。用于允许 OAuth/OIDC 身份提供程序和broker的时间差异。 |
| sasl.oauthbearer.expected.audience                          | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.expected.issuer                            | broker用于验证 JWT 是否由预期发行者创建的（可选）设置。将检查 JWT 是否有标准 OAuth“iss”声明，如果设置了该值，broker会将其与 JWT 的“iss”声明中的内容完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms                   | 代理在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 小时)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms         | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位）。默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms             | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位）。默认100毫秒。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                           | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                             | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以提供用于 JWT 有效负载声明中包含的主题的不同名称。 |
| security.providers                                          | 可配置创建器类的列表，每个创建器类返回实现安全算法的提供程序，需要实现org.apache.kafka.common.security.auth.SecurityProviderCreator接口。 |
| ssl.endpoint.identification.algorithm                       | 使用服务器证书验证服务器主机名的端点识别算法，默认https。    |
| ssl.engine.factory.class                                    | 类型为 org.apache.kafka.common.security.auth.SslEngineFactory 的类，用于提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.principal.mapping.rules                                 | 从客户端证书的专有名称到短名称的映射规则列表。规则将按顺序计算，第一个匹配主体名称的规则将用于将其映射为短名称，列表中以后的任何规则都将被忽略。默认情况下，X.500证书的专有名称将是主体，默认值采用DEFAULT。注意，如果principal.builder.class配置提供了KafkaPrincipalBuilder的扩展，则该配置将被忽略。 |
| ssl.secure.random.implementation                            | 用于SSL加密操作的SecureRandom PRNG实现。                     |
| transaction.abort.timed.out.transaction.cleanup.interval.ms | 回滚超时事务的时间间隔，默认10000毫秒。                      |
| transaction.partition.verification.enable                   | 启用事务验证，以在将事务记录写入分区之前检查分区是否已添加到事务中。默认true |
| transaction.remove.expired.transaction.cleanup.interval.ms  | 删除由于transactional.id.expiration.ms而过期的事务的间隔，默认3600000毫秒，即1小时。 |
| zookeeper.ssl.cipher.suites                                 | 指定在ZooKeeper TLS协商(csv)中使用的已启用密码套件。可以通过设置zookeeper.ssl.ciphersuites系统属性覆盖任何显式值(注意ciphersuites)。默认值null表示已启用的密码套件列表由所使用的Java运行时确定。 |
| zookeeper.ssl.crl.enable                                    | 指定是否在ZooKeeper TLS协议中启用证书撤销列表，默认false。可以通过设置zookeeper.ssl.crl系统属性覆盖任何显式值(注意简写)。 |
| zookeeper.ssl.enabled.protocols                             | 指定ZooKeeper TLS协商(csv)中启用的协议。可以通过设置zookeeper.ssl.enabledProtocols系统属性覆盖任何显式值(注意驼峰法)。默认值为null意味着启用的协议将是zookeeper.ssl.protocol配置属性。 |
| zookeeper.ssl.endpoint.identification.algorithm             | 指定是否在ZooKeeper TLS协商过程中启用主机名验证，使用(不区分大小写)“https”表示ZooKeeper主机名验证是启用的，而显式的空白值表示禁用(禁用仅用于测试目的)，默认值HTTPS。可以通过显示设置zookeeper.ssl.hostnameVerification系统属性覆盖任何true或false值(注意不同的名称和值;true表示https, false表示空白)。 |
| zookeeper.ssl.ocsp.enable                                   | 指定是否在ZooKeeper TLS协议中启用在线证书状态协议，默认为false。可以通过设置zookeeper.ssl.ocsp系统属性覆盖任何显式值(注意简写)。 |
| zookeeper.ssl.protocol                                      | 指定在ZooKeeper TLS协商中使用的协议，默认为TLSv1.2。可以通过设置zookeeper.ssl.protocol系统属性覆盖任何显式值。 |
|                                                             |                                                              |





### 2.3 配置更新方式

从 Kafka 版本 1.1 开始，某些broker配置可以在不重新启动broker的情况下更新。有关每个broker配置的更新方式，都在配置名旁边增加了如下标记：

- `read-only`: 需要重新启动broker才能进行更新
- `per-broker`: 可以为每个broker动态更新
- `cluster-wide`: ：可以作为集群范围的默认值动态更新。也可以更新为每个broker值以进行测试。

下面演示配置如何更新和查看。

- 要更改broker id为 0 的broker实例的某个配置（例如，日志清理器线程数）：

```
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-name 0 --alter --add-config log.cleaner.threads=2
```

- 要查看broker id为 0 的当前动态配置：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-name 0 --describe
```



- 要删除配置覆盖并恢复broker id为 0  的broker的静态配置或默认值（例如，日志清理器线程数）：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-name 0 --alter --delete-config log.cleaner.threads
```

- 对于一些命令可能需要配置为集群范围的默认值，保证在整个集群中的每个broker保持一致的值，如上面的日志清理线程的命令，我们可以通过下面的方式进行cluster-wide启动： 

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-default --alter --add-config log.cleaner.threads=2
```

- 要查看当前配置的动态集群范围默认配置，可以执行以下操作：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-default --describe
```

可以看出上面的日志清理线程命令不同的地方就在于是否指定了**entity-name**。

所有可在集群级别配置的配置也可以在每个broker实例级别进行配置（通常是用于测试时）。 如果配置值在不同的级别定义，则使用以下优先级顺序使之生效：

- 动态的在每个broker上面定义配置，其存储在zookeeper上面；
- 动态的通过集群方式(cluster-wide)定义的配置，起存储也在zookeeper上面；
- 通过server.properties定义的配置；存储在每个broker实例所在服务器上
- Kafka 默认值



#### 2.3.1 动态密码更新

针对于密码密钥的更新，我们只能在server.properties上面配置，每次配置完成后必须重启broker节点才能生效，为了避免新旧密码的解析错误，我们必须通过password.encoder.old.secret配置来先解析以前的密码，然后在通过password.encoder.secret在进行新密码的加解密解析，并且所有的密码信息都会存储在zookeeper中。如果在命令中包含了密码的更新操作，那么在这个命令中我们还必须包含password.encoder.secret的配置，当然还可以提供其他的密码相关配置。

`kafka-configs.sh`在 Kafka 1.1.x 中，即使密码配置未更改，在更新配置时也必须在每个更改请求中提供所有动态更新的密码配置。此限制将在未来版本中删除。



**在启动 Broker 之前更新 ZooKeeper 中的密码配置**

从 Kafka 2.0.0 开始，`kafka-configs.sh`在启动broker进行引导之前，可以使用 ZooKeeper 更新动态代理配置。这使得所有密码配置都能够以加密形式存储。

下面实例演示如何在broker 0上面更新listener INTERNAL的SSL密钥密码：

```
> bin/kafka-configs.sh --zookeeper localhost:2181 --entity-type brokers --entity-name 0 --alter --add-config
  'listener.name.internal.ssl.key.password=key-password,password.encoder.secret=secret,password.encoder.iterations=8192'
```

上面实例中的listener.name.internal.ssl.key.password将会被加密持久化存储在zookeeper中，其他的2个命令只是会被暂时存储。



#### 2.3.2 更新现有侦听器的 SSL 密钥库

SSL密钥库的更新是动态更新的，配置名必须以listener前缀listener.name.{listenerName}作为前缀，这样只更新特定listener的密钥存储库配置。只能在每个broker上面单独更新：

```
ssl.keystore.type
ssl.keystore.location
ssl.keystore.password
ssl.key.password
```

需要注意的是如果listener是broker间的listener，则仅当新密钥存储库受到为该listener配置的信任存储库的信任时，才允许更新。对于其他listener，broker不会对密钥存储库执行信任验证。证书必须由签署旧证书的同一证书权威机构签署，以避免任何客户端身份验证失败

#### 2.3.3 更新现有侦听器的 SSL 信任库

更新SSL truststore也是可以动态更新的在每个broker上面，但是配置名称也必须以listener前缀listener.name.{listenerName}作为前缀，这样只更新特定listener的密钥存储库配置。配置有：

```
ssl.truststore.type
ssl.truststore.location
ssl.truststore.password
```



#### 2.3.4 更新默认主题配置

更新默认的topic配置，它可以针对所有的broker节点有效，配置有：

```
log.segment.bytes
log.roll.ms
log.roll.hours
log.roll.jitter.ms
log.roll.jitter.hours
log.index.size.max.bytes
log.flush.interval.messages
log.flush.interval.ms
log.retention.bytes
log.retention.ms
log.retention.minutes
log.retention.hours
log.index.interval.bytes
log.cleaner.delete.retention.ms
log.cleaner.min.compaction.lag.ms
log.cleaner.max.compaction.lag.ms
log.cleaner.min.cleanable.ratio
log.cleanup.policy
log.segment.delete.delay.ms
unclean.leader.election.enable
min.insync.replicas
max.message.bytes
compression.type
log.preallocate
log.message.timestamp.type
log.message.timestamp.difference.max.ms
```

其中unclean.leader.election.enable在2.0.0+版本中是动态更新的，在1.1.x中当新的controller被选择时将会有效，我们也可以通过命令进行手动有效，如：

```bash
> bin/zookeeper-shell.sh localhost
  rmr /controller
```



#### 2.3.5 更新日志清理器配置

日志清理器配置可以在集群默认级别动态更新。对所有broker实例生效。这些更改将在下一次日志清理迭代中生效。其配置有：

```
log.cleaner.threads
log.cleaner.io.max.bytes.per.second
log.cleaner.dedupe.buffer.size
log.cleaner.io.buffer.size
log.cleaner.io.buffer.load.factor
log.cleaner.backoff.ms
```



 #### 2.3.6 更新线程配置

broker使用的各种线程池的大小可以在集群范围进行统一动态更新。修改对所有broker生效。其有效的大小在currentSize/2到currentSize*2之间，currentSize是指broker使用的各种线程池的大小，其配置有：

 ```
num.network.threads
num.io.threads
num.replica.fetchers
num.recovery.threads.per.data.dir
log.cleaner.threads
background.threads
 ```



#### 2.3.7 更新连接配额配置

更新每个ip/主机的最大连接数，针对所有broker节点有效。这些更改将应用于新的连接创建，并且新的限制将考虑现有连接计数。

```
max.connections.per.ip
max.connections.per.ip.overrides
```

#### 2.3.8 添加和删除监听器

新增和删除listener都可以动态进行，当添加一个新的listener时，listener的安全性配置必须以listener前缀listener.name.{listenerName}被提供。如果新的listener使用SASL，listener的JAAS配置则必须使用JAAS配置属性sasl.jaas.config和前缀机制。

在Kafka1.1版本中，broker间listener使用的listener可能不会动态更新，如果要将broker间listener更新为新listener，可以在所有broker上添加新listener，而无需重新启动broker，然后需要滚动重启来更新inter.broker.listener.name。除了新的listener的安全配置，还需要在各个broker上添加以下配置： 

```
listeners
advertised.listeners
listener.security.protocol.map
```

broker间listener必须使用静态代理配置配置inter.broker.listener.name 或 security.inter.broker.protocol。



##  三、topic配置

与topic(主题)相关的配置既有服务器级别(broker)默认值，也可以通过--config命令来单独设置每个主题自己的配置项。如果单独指定每个主题的配置，则会覆盖服务器默认值。

### 3.1 配置更新方式

**1）创建主题时，同时指定配置项**

下面示例创建一个名为*gyd-topic 的*主题，自定义最大消息大小和刷新率：

```properties
> bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic gyd-topic --partitions 1 \
--replication-factor 1 --config max.message.bytes=64000 --config flush.messages=1
```



**2）已创建好的主题，修改指定配置项**

下面示例针对已创建好的主题gyd-topic，修改最大消息大小配置：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name gyd-topic
  --alter --add-config max.message.bytes=128000
```



**3）查看主题的配置**

下面示例查看主题gyd-topic中单独指定的配置项有哪些：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name gyd-topic --describe
```



**4）移除主题的某个配置**

下面示例移除主题gyd-topic中的最大消息大小配置（移除后，服务器级别的该配置会开始生效）：

```properties
> bin/kafka-configs.sh --bootstrap-server localhost:9092  --entity-type topics --entity-name gyd-topic
  --alter --delete-config max.message.bytes
```



### 3.2 配置列表

以下是主题级别的配置列表：

| 配置项                                  | 描述                                                         | 对应broker配置                          |
| --------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| cleanup.policy                          | 此配置指定要在日志段上使用的清理策略。默认"delete"策略。可选策略有"delete"和"compact"。<br>1）delete策略：将在达到保留时间或大小限制时删除旧段<br>2）compact策略：“压缩”策略将启用日志压缩，压缩时保留每个键的最新值<br>配置时也支持同时指定这两个策略（用逗号分隔，例如“delete,compact”，在这种情况下，旧的段将根据保留时间和大小配置被丢弃，而保留的段将被压缩） | log.cleanup.policy                      |
| compression.type                        | 指定给定主题的最终压缩类型。默认producer。此配置可选值有：“producer”、“uncompressed”、“gzip”、“snappy”、“lz4”、“zstd”）。<br>标准压缩编解码器：“gzip”、“snappy”、“lz4”、“zstd”；<br>producer生产者：表示保留生产者设置的原始压缩编解码器；<br>uncompressed未压缩：相当于不做压缩 | compression.type                        |
| delete.retention.ms                     | 为日志压缩主题保留删除逻辑删除标记的时间量。默认86400000 (1 天)<br>这个配置就是专门针对tombstone类型的消息进行设置的，也就是这个tombstone在当次compact完成后并不会被清理，在下次compact的时候，他的最后修改时间+delete.retention.ms当前时间，才会被删掉。此设置还规定了消费者必须完成读取的时间限制（如果消费者从偏移量 0 开始），以确保他们获得最后阶段的有效快照（否则可能会在完成扫描之前收集删除逻辑删除）。 | log.cleaner.delete.retention.ms         |
| file.delete.delay.ms                    | 从文件系统中删除文件之前等待的时间。默认60000 (1 分钟)       | log.segment.delete.delay.ms             |
| flush.messages                          | 指定强制同步写入日志的数据的间隔。默认不开启。<br>例如，如果将flush.messages设置为1，那么每一条消息都会刷盘，配合前面整理的acks、min.insync.replicas，会使消息可靠性得到大幅度得提升，但是flush.messages=1会严重影响性能，可以在部分可靠性要求高的Topic级别进行配置。官方不建议设置该选项 | log.flush.interval.messages             |
| flush.ms                                | 指定强制同步写入日志的数据的时间间隔。例如，如果将其设置为 1000，我们将在 1000 毫秒过去后进行 fsync。官方不建议设置该选项 | log.flush.interval.ms                   |
| follower.replication.throttled.replicas | 应在从属端限制其日志复制的副本列表。该列表应以 [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... 的形式描述一组副本，或者可以使用通配符“*”来限制该主题的所有副本。 | 无                                      |
| index.interval.bytes                    | 此设置控制 Kafka 将索引条目添加到其偏移索引的频率。默认4096(4kb)<br>当执行一个fetch操作后，需要一定的空间来扫描最近的offset大小，设置越大，代表扫描速度越快，但是也更耗内存，一般情况下不需要设置这个参数。 | log.index.interval.bytes                |
| leader.replication.throttled.replicas   | 应在领导者端限制其日志复制的副本列表。该列表应以 [PartitionId]:[BrokerId],[PartitionId]:[BrokerId]:... 的形式描述一组副本，或者可以使用通配符“*”来限制该主题的所有副本。 | 无                                      |
| local.retention.bytes                   | 分区在删除旧段之前可以增长的本地日志段的最大大小。默认值为 -2，它表示要使用的“retention.bytes”值。有效值应始终小于或等于“retention.bytes”值。 | log.local.retention.bytes               |
| local.retention.ms                      | 删除本地日志段之前保留该日志段的毫秒数。默认值-2。它表示要使用的“retention.ms”值。有效值应始终小于或等于“retention.ms”值。 | log.local.retention.ms                  |
| max.compaction.lag.ms                   | 消息在日志中保持不符合压缩条件的最长时间。默认不设置。仅适用于正在压缩的日志。 | log.cleaner.max.compaction.lag.ms       |
| max.message.bytes                       | Kafka 允许的最大记录批量大小（如果启用压缩，则在压缩后）。默认值1048588。<br>如果增加此值并且存在早于 0.10.2 的消费者，则消费者的获取大小也必须增加，以便他们可以获取这么大的记录批次。<br>在最新的消息格式版本中，为了提高效率，记录总是分组为批次。在以前的消息格式版本中，未压缩的记录不会分组为批次，并且此限制仅适用于这种情况下的单个记录。 | message.max.bytes                       |
| message.format.version                  | [已弃用] 指定broker将用于将消息附加到日志的消息格式版本。    | log.message.format.version              |
| message.timestamp.after.max.ms          | broker端收到消息时的时间戳与消息中指定的时间戳之间允许的最大差异。如果message.timestamp.type=CreateTime，则如果时间戳差异超过此阈值，消息将被拒绝。如果 message.timestamp.type=LogAppendTime，则忽略此配置。 | log.message.timestamp.after.max.ms      |
| message.timestamp.before.max.ms         | 此配置设置broker时间戳和消息时间戳之间允许的时间戳差异。消息时间戳可以早于或等于broker的时间戳，最大允许差异由此配置中设置的值确定。如果 message.timestamp.type=CreateTime，则当时间戳的差异超过此指定阈值时，消息将被拒绝。如果 message.timestamp.type=LogAppendTime，则忽略此配置。 | log.message.timestamp.before.max.ms     |
| message.timestamp.difference.max.ms     | [已弃用]broker接收消息时的时间戳与消息中指定的时间戳之间允许的最大差异。如果 message.timestamp.type=CreateTime，则当时间戳的差异超过此阈值时，消息将被拒绝。如果 message.timestamp.type=LogAppendTime，则忽略此配置。 | log.message.timestamp.difference.max.ms |
| message.timestamp.type                  | 定义消息中的时间戳是消息创建时间CreateTime还是日志追加时间LogAppendTime。默认CreateTime。 | log.message.timestamp.type              |
| min.cleanable.dirty.ratio               | 此配置控制日志压缩程序尝试清理日志的频率（前提是启用了[日志压缩](https://kafka.apache.org/documentation/#compaction)），默认值0.5，范围是（0-1），越大意味着更高效的清理。 | log.cleaner.min.cleanable.ratio         |
| min.compaction.lag.ms                   | 消息在日志中保持未压缩的最短时间。仅适用于正在压缩的日志。   | log.cleaner.min.compaction.lag.ms       |
| min.insync.replicas                     | 当生产者将 acks 设置为 “all”（或“-1”）时，min.insync.replicas 指定必须确认写入才能被视为成功的最小副本数。该配置默认值是1。如果无法满足此最小值，则生产者将引发异常（NotEnoughReplicas 或 NotEnoughReplicasAfterAppend）。<br/>当一起使用时，min.insync.replicas 和 ack 允许您强制执行更高的持久性保证。典型的场景是创建一个复制因子为 3 的主题，将 min.insync.replicas 设置为 2，并使用“all”的 ack 进行生成。这将确保生产者在大多数副本未收到写入时引发异常。 | min.insync.replicas                     |
| preallocate                             | 如果我们在创建新的日志段时应该在磁盘上预分配文件，则为 true。默认false | log.preallocate                         |
| remote.storage.enable                   | 要为主题启用分层存储，请将此配置设置为 true。默认false，启用此配置后，您将无法禁用它。它将在未来版本中提供。 |                                         |
| retention.bytes                         | 此配置控制分区（由日志段组成）可以增长到的最大大小，然后如果我们使用“delete”保留策略，我们将丢弃旧的日志段以释放空间。默认情况下，没有大小限制，只有时间限制。由于此限制是在分区级别强制实施的，因此请将其乘以分区数以计算主题保留期（以字节为单位）。 | log.retention.bytes                     |
| retention.ms                            | 此配置控制我们在丢弃旧日志段以释放空间之前保留日志的最长时间（如果我们使用“delete”保留策略），默认604800000 (7 天)。这表示关于消费者必须多快读取其数据的 SLA。如果设置为 -1，则不应用时间限制。 | log.retention.ms                        |
| segment.bytes                           | 此配置控制日志的段文件大小。默认1073741824 (1 g)。保留和清理总是一次对一个文件进行，因此较大的段大小意味着文件较少，但对保留的粒度控制较小。 | log.segment.bytes                       |
| segment.index.bytes                     | 此配置控制将偏移映射到文件位置的索引的大小。默认10485760 (10 MB)。我们预分配此索引文件，并仅在日志滚动后收缩它。通常不需要更改此设置。 | log.index.size.max.bytes                |
| segment.jitter.ms                       | 分段滚动时间，默认0。从计划的分段滚动时间中减去最大随机抖动，以避免分段滚动的雷群 | log.roll.jitter.ms                      |
| segment.ms                              | 此配置控制一段时间后，即使段文件未满，Kafka也会强制日志滚动，以确保保留可以删除或压缩旧数据。默认604800000(7 天) | log.roll.ms                             |
| unclean.leader.election.enable          | 是否允许不在ISR集合的replicas副本作为最后的手段被选举为leader，即使这样做可能会导致数据丢失。默认false不允许 | unclean.leader.election.enable          |
| message.downconversion.enable           | 该配置控制是否启用消息格式下转换以满足消费请求。当设置为 时`false`，broker将不会为期望旧消息格式的消费者执行向下转换。对于来自此类较旧客户端的消费请求，broker会返回错误响应`UNSUPPORTED_VERSION`。此配置不适用于复制到关注者可能需要的任何消息格式转换。 | log.message.downconversion.enable       |
|                                         |                                                              |                                         |



## 四、producer配置

以下是生产者的配置：

| 配置项                                              | 描述                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| key.serializer                                      | 实现该`org.apache.kafka.common.serialization.Serializer`接口的键的序列化器类。 |
| value.serializer                                    | 实现`org.apache.kafka.common.serialization.Serializer`接口的值的序列化器类。 |
| bootstrap.servers                                   | 用于建立与 Kafka 集群的初始连接的主机/端口对列表。客户端将使用所有服务器，无论此处指定哪些服务器进行引导 - 该列表仅影响用于发现全套服务器的初始主机。该列表应采用以下形式`host1:port1,host2:port2,...`。由于这些服务器仅用于初始连接以发现完整的集群成员资格（可能会动态更改），因此此列表不需要包含完整的服务器集（不过，您可能需要多个服务器，以防服务器停机） 。 |
| buffer.memory                                       | 生产者可用于缓冲等待发送到服务器的记录的内存总字节数。默认33554432。<br>如果记录的发送速度快于传送到服务器的速度，生产者将阻塞，`max.block.ms`然后抛出异常。<br>此设置应大致对应于生产者将使用的总内存，但不是硬限制，因为并非生产者使用的所有内存都用于缓冲。一些额外的内存将用于压缩（如果启用压缩）以及维护正在进行的请求。 |
| compression.type                                    | 生产者生成的所有数据的压缩类型。默认值为none（即不压缩）。可选值为`none`、`gzip`、`snappy`、`lz4`或`zstd`。<br>压缩是对整批数据进行压缩，因此批处理的效果也会影响压缩率（批处理越多意味着压缩效果越好）。 |
| retries                                             | 失败重试次数，默认设置为Integer.MAX_VALUE。设置大于零的值将导致客户端重新发送发送失败并可能出现暂时性错误的任何记录。请注意，此重试与客户端在收到错误后重新发送记录没有什么不同。`delivery.timeout.ms`如果在成功确认之前配置的超时时间先到期，则在重试次数用完之前，生产请求将失败。用户通常应该更愿意保留此配置未设置，而是用于`delivery.timeout.ms`控制重试行为。<br>启用幂等性要求此配置值大于 0。如果设置了冲突的配置并且未显式启用幂等性，则幂等性将被禁用。<br>在设置`enable.idempotence`为`false`或`max.in.flight.requests.per.connection`大于 1 时允许重试可能会更改记录的顺序，因为如果将两个批次发送到单个分区，并且第一个批次失败并重试，但第二个成功，则第二个批次中的记录可能会先出现。 |
| ssl.key.password                                    | 密钥存储文件中私钥的密码或在“ssl.keystore.key”中指定的 PEM 密钥。 |
| ssl.keystore.certificate.chain                      | 证书链采用“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                    | 由“ssl.keystore.type”指定的格式的私钥。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                               | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                               | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.truststore.certificates                         | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                             | 信任存储区文件的位置。                                       |
| ssl.truststore.password                             | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| batch.size                                          | 此配置控制默认批量大小（以字节为单位）。默认16384。<br>每当多个记录发送到同一分区时，生产者将尝试将记录一起批处理为更少的请求。这有助于提高客户端和服务器的性能。<br>不会尝试批处理大于此大小的记录。<br>发送到broker的请求将包含多个批次，每个分区一个批次，并具有可发送的数据。 |
| client.dns.lookup                                   | 控制客户端使用 DNS 查找broker的方式。默认`use_all_dns_ips`。可选值还有 resolve_canonical_bootstrap_servers_only<br>如果设置为`use_all_dns_ips` ，则按顺序连接到每个返回的 IP 地址，直到建立成功的连接。<br>断开连接后，将使用下一个 IP。一旦所有 IP 都使用过一次，客户端就会再次从主机名解析 IP（但是，JVM 和操作系统缓存 DNS 名称查找）。<br>如果设置为`resolve_canonical_bootstrap_servers_only`，将每个地址解析为规范名称列表。在引导阶段之后，其它行为和`use_all_dns_ips`一样。 |
| client.id                                           | 客户端标识，发出请求时会将该标识字符串传递给服务器。这样会在服务器端请求日志记录包含中，能够跟踪请求源，而不仅仅是 ip/端口。 |
| connections.max.idle.ms                             | 在此配置指定的毫秒数后关闭空闲连接。默认540000 (9 分钟)      |
| delivery.timeout.ms                                 | 生产者发送完请求接受服务器ACk的时间，该时间允许重试 ，默认120000 (2 分钟)。该配置应该大于request.timeout.ms + linger.ms。 |
| linger.ms                                           | 发送延迟时间（默认：0）。为减少负载和客户端的请求数量，生产者不会一条一条发送，而是会逗留一段时间批量发送。batch.size和linger.ms满足任何一个条件都会发送。 |
| max.block.ms                                        | 阻塞时间（默认：60000，一分钟）。`KafkaProducer`配置控制`send()`、`partitionsFor()`、`initTransactions()`、`sendOffsetsToTransaction()`和`commitTransaction()`方法将阻塞多长时间`abortTransaction()`。对于`send()`此超时限制等待元数据获取和缓冲区分配的总时间（用户提供的序列化器或分区器中的阻塞不计入此超时）。对于`partitionsFor()`此超时，限制了等待元数据（如果元数据不可用）所花费的时间。与事务相关的方法始终会阻塞，但如果无法发现事务协调器或在超时内未响应，则可能会超时。 |
| max.request.size                                    | 请求的最大大小（以字节为单位），默认1048576。<br>此设置将限制生产者在单个请求中发送的记录批次数量，以避免发送巨大的请求。这实际上也是最大未压缩记录批量大小的上限。请注意，服务器对记录批量大小有自己的上限（如果启用了压缩，则在压缩后），这可能与此不同。 |
| partitioner.class                                   | 用于确定生成记录时要发送到哪个分区的类。有以下两种情况<br>1.如果未设置，则使用默认分区逻辑。该策略将尝试坚持一个分区，直到至少为该分区生成了batch.size字节。它适用于以下策略：<br>      1.1 如果未指定分区但存在密钥，则根据密钥的哈希值选择分区<br>      1.2 如果不存在分区或键，则选择当至少为该分区生成batch.size字节时更改的粘性分区。<br>2.`org.apache.kafka.clients.producer.RoundRobinPartitioner`：这种分区策略是一系列连续记录中的每条记录将被发送到不同的分区（无论是否提供“key”），直到我们用完分区并重新开始。注意：有一个已知问题会导致创建新批次时分布不均匀。可以查看 KAFKA-9965 了解更多详情。<br>实现该`org.apache.kafka.clients.producer.Partitioner`接口允许开发者插入自定义分区器。 |
| partitioner.ignore.keys                             | 当设置为“true”时，生产者不会使用记录键来选择分区。如果为“false”，则当存在键时，生产者将根据键的哈希值选择分区。注意：如果使用自定义分区程序，此设置不起作用。 默认false |
| receive.buffer.bytes                                | 读取数据时要使用的 TCP 接收缓冲区 （SO_RCVBUF） 的大小。默认32768 (32 KB)。如果值为 -1，则将使用操作系统默认值。 |
| request.timeout.ms                                  | 配置控制客户端等待请求响应的最长时间。默认30000 (30 秒)。<br>如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试次数耗尽时使请求失败。这应该大于`replica.lag.time.max.ms`（broker配置），以减少由于不必要的生产者重试而导致消息重复的可能性。 |
| sasl.client.callback.handler.class                  | 实现 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.jaas.config                                    | SASL 连接的 JAAS 登录上下文参数，采用 JAAS 配置文件使用的格式，SASL 连接的 JAAS 登录上下文参数采用 JAAS 配置文件使用的格式。JAAS 配置文件格式描述[如下](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/tutorials/LoginConfigFile.html)。该值的格式为：`loginModuleClass controlFlag (optionName=optionValue)*;`。对于代理，配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，需要listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule； |
| sasl.kerberos.service.name                          | Kafka 运行的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.login.callback.handler.class                   | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
| sasl.login.class                                    | 实现 Login 接口的类的完全限定名称。对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin |
| sasl.mechanism                                      | 用于客户端连接的 SASL 机制，默认机制是GSSAPI 。这可以是安全提供程序可用的任何机制。 |
| sasl.oauthbearer.jwks.endpoint.url                  | OAuth/OIDC 提供者 URL，提供者的[JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5)可以检索。URL 可以基于 HTTP(S) 或基于文件。<br>如果 URL 基于 HTTP(S)，则将通过broker启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。所有当时的密钥都将缓存在broker上以用于传入请求。如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。但是，broker会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。<br>如果 URL 是基于文件的，broker将在启动时从配置的位置加载 JWKS 文件。如果 JWT 包含 JWKS 文件中不存在的“kid”标头值 |
| sasl.oauthbearer.token.endpoint.url                 | OAuth/OIDC 身份提供商的 URL。<br>如果 URL 基于 HTTP(S)，则它是颁发者的令牌端点 URL，将根据 sasl.jaas.config 中的配置发出登录请求。<br>如果 URL 是基于文件的，则它指定一个包含 OAuth/OIDC 身份提供商颁发的访问令牌（JWT 序列化形式）的文件，用于授权。 |
| security.protocol                                   | 用于与broker通信的协议，默认PLAINTEXT。可选值为：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL。 |
| send.buffer.bytes                                   | 发送数据时使用的 TCP 发送缓冲区 (SO_SNDBUF) 的大小，默认131072 (128 KB)。如果值为-1，将使用操作系统默认值。 |
| socket.connection.setup.timeout.max.ms              | 客户端等待建立套接字连接的最长时间，默认30000 (30 秒)。对于每个连续的连接失败，连接设置超时将呈指数级增长，直至此最大值。为避免连接风暴，将对超时应用随机因子 0.2，从而导致随机范围在计算值以下 20% 和高于计算值 20% 之间。 |
| socket.connection.setup.timeout.ms                  | 客户端等待建立套接字连接的时间，默认10000 (10 秒)。如果在超时之前未建立连接，客户端将关闭套接字通道。 |
| ssl.enabled.protocols                               | 为 SSL 连接启用的协议列表，默认"TLSv1.2,TLSv1.3"。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2、TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.3，否则回退到 TLSv1.2（假设两者至少支持 TLSv1.2）。对于大多数情况，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.keystore.type                                   | 密钥存储文件的文件格式，默认JKS。这对于客户端是可选的。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                        | 用于生成 SSLContext 的 SSL 协议，默认TLSv1.3。使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。该值对于大多数用例来说应该没问题。最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                        | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.truststore.type                                 | 信任存储文件的文件格式。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| acks                                                | 生成者要求领导者在认为请求完成之前收到的确认数，默认是All。这控制所发送记录的持久性。允许以下设置：<br>1.`acks=0`如果设置为零，则生产者根本不会等待服务器的任何确认。该记录将立即添加到套接字缓冲区并被视为已发送。在这种情况下，不能保证服务器已收到记录，并且配置`retries`不会生效（因为客户端通常不会知道任何失败）。为每个记录返回的偏移量将始终设置为`-1`。<br>2.`acks=1`这意味着领导者会将记录写入其本地日志，但会在不等待所有追随者完全确认的情况下做出响应。在这种情况下，如果领导者在确认记录后但在追随者复制记录之前立即失败，那么记录将丢失。<br>3.`acks=all`这意味着领导者将等待完整的同步副本集确认记录。这保证了只要至少一个同步副本保持活动状态，记录就不会丢失。这是最强有力的保证。这相当于 acks=-1 设置。<br>需要注意：启用幂等性要求此配置值为“all”。如果设置了冲突的配置并且未显式启用幂等性，则幂等性将被禁用。 |
| auto.include.jmx.reporter                           | 已弃用。是否自动包含 JmxReporter，即使它没有在 中列出`metric.reporters`。此配置将在 Kafka 4.0 中删除，用户应添加`org.apache.kafka.common.metrics.JmxReporter`该配置`metric.reporters`以启用 JmxReporter。 |
| enable.idempotence                                  | 默认为true。当设置为“true”时，生产者将确保每条消息的一份副本准确写入流中。如果为“false”，则生产者由于broker故障等原因重试，可能会在流中写入重试消息的重复项。请注意，启用幂等性要求`max.in.flight.requests.per.connection`小于或等于 5（为任何允许的值保留消息排序）、`retries`大于 0，并且`acks`必须为“全部”。<br>如果没有设置冲突的配置，则默认启用幂等性。如果设置了冲突的配置并且未显式启用幂等性，则幂等性将被禁用。如果显式启用幂等性并且设置了冲突的配置，则会抛出`ConfigException` 。 |
| interceptor.classes                                 | 用作拦截器的类的列表。实现该`org.apache.kafka.clients.producer.ProducerInterceptor`接口允许开发者在将生产者收到的记录发布到 Kafka 集群之前拦截（并可能改变）这些记录。默认情况下，没有拦截器。 |
| max.in.flight.requests.per.connection               | 客户端在阻塞之前在单个连接上发送的未确认请求的最大数量，默认5。注意，如果该配置设置大于1且`enable.idempotence`设置为false，则存在因重试导致发送失败后消息重新排序的风险（即如果启用了重试）；如果禁用重试或`enable.idempotence`设置为 true，则将保留排序。此外，启用幂等性要求此配置的值小于或等于 5。如果设置了冲突的配置并且未显式启用幂等性，则幂等性将被禁用。 |
| metadata.max.age.ms                                 | 强制刷新元数据的时间间隔，以毫秒为单位的时间段，默认300000 (5 分钟)，在此时间段之后，即使我们没有看到任何分区领导更改，我们也会强制刷新元数据，以主动发现任何新的broker或分区。 |
| metadata.max.idle.ms                                | 控制生产者为空闲主题缓存元数据的时间，默认300000 (5 分钟)。如果自上次生成主题以来经过的时间超过了元数据空闲持续时间，则该主题的元数据缓存失效，并且下次访问该主题将强制执行元数据重新获取请求。 |
| metric.reporters                                    | 用作指标报告者的类的列表。实现该`org.apache.kafka.common.metrics.MetricsReporter`接口允许插入将收到新指标创建通知的类。JmxReporter 始终包含在内以注册 JMX 统计信息。 |
| metrics.num.samples                                 | 为计算指标而维护的样本数量。默认2                            |
| metrics.recording.level                             | 指标的最高记录级别，默认INFO。可选值有[INFO, DEBUG, TRACE]   |
| metrics.sample.window.ms                            | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| partitioner.adaptive.partitioning.enable            | 当设置为“true”时，生产者将尝试适应broker性能并向更快broker上托管的分区生成更多消息。如果为“false”，生产者将尝试统一分发消息。<br>注意：如果使用自定义分区程序，此设置无效 |
| partitioner.availability.timeout.ms                 | 如果broker在一段`partitioner.availability.timeout.ms`时间内无法处理来自分区的生产请求，则分区程序会将该分区视为不可用。如果值为 0，则禁用此逻辑。<br>注意：如果使用自定义分区程序或设置partitioner.adaptive.partitioning.enable为“false”，则此设置无效 |
| reconnect.backoff.max.ms                            | 重新连接到多次连接失败的broker时等待的最长时间（以毫秒为单位），默认1000 (1 秒)。如果设置，每个主机的退避将在每次连续连接失败时呈指数增加，直至达到此最大值。计算退避增量后，添加 20% 的随机抖动以避免连接风暴。 |
| reconnect.backoff.ms                                | 尝试重新连接到给定主机之前等待的基本时间量，默认50ms。这避免了在紧密循环中重复连接到主机。此退避适用于客户端与broker的所有连接尝试。 |
| retry.backoff.ms                                    | 尝试重试对给定主题分区的失败请求之前等待的时间量，默认100ms。这样可以避免在某些故障情况下在紧密循环中重复发送请求。 |
| sasl.kerberos.kinit.cmd                             | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin               | 刷新尝试之间的登录线程休眠时间。默认60000                    |
| sasl.kerberos.ticket.renew.jitter                   | 添加到更新时间的随机抖动的百分比。默认0.05                   |
| sasl.kerberos.ticket.renew.window.factor            | 登录线程将休眠，直到达到从上次刷新到票证到期的指定时间窗口因子，此时它将尝试更新票证。默认0.8 |
| sasl.login.connect.timeout.ms                       | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                          | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                   | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。合法值介于 0 到 3600（1 小时）之间；如果未指定值，则使用默认值 300（5 分钟）。如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds               | 登录刷新线程在刷新凭据之前等待的所需最短时间（以秒为单位）。合法值介于 0 到 900（15 分钟）之间；如果未指定值，则使用默认值 60（1 分钟）。如果该值和 sasl.login.refresh.buffer.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.factor                    | 登录刷新线程将休眠，直到达到相对于凭证生命周期的指定窗口因子，此时它将尝试刷新凭证。合法值介于 0.5 (50%) 和 1.0 (100%)（含）之间；如果未指定值，则使用默认值 0.8 (80%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.jitter                    | 相对于添加到登录刷新线程睡眠时间的凭证生命周期的最大随机抖动量。合法值介于 0 和 0.25 (25%) 之间（含）；如果未指定值，则使用默认值 0.05 (5%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.max.ms                     | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位），默认10000(10秒)。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                         | 尝试登录外部身份验证提供程序之间的初始等待时间（可选）值（以毫秒为单位）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                 | 用于允许 OAuth/OIDC 身份提供程序和broker的时间差异，以秒为单位的（可选）值，默认30秒 |
| sasl.oauthbearer.expected.audience                  | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，代理将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.expected.issuer                    | broker用于验证 JWT 是否由预期发行者创建的（可选）设置。将检查 JWT 是否有标准 OAuth“iss”声明，如果设置了该值，broker会将其与 JWT 的“iss”声明中的内容完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms           | broker在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 H)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位），默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms     | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位），默认100ms。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                   | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                     | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的主题提供不同的名称。 |
| security.providers                                  | 可配置创建者类的列表，每个类返回一个实现安全算法的提供者。这些类应该实现该`org.apache.kafka.common.security.auth.SecurityProviderCreator`接口。 |
| ssl.endpoint.identification.algorithm               | 使用服务器证书验证服务器主机名的端点识别算法。默认https      |
| ssl.engine.factory.class                            | org.apache.kafka.common.security.auth.SslEngineFactory 类型的类提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.keymanager.algorithm                            | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法SunX509。 |
| ssl.secure.random.implementation                    | 用于 SSL 加密操作的 SecureRandom PRNG 实现。                 |
| ssl.trustmanager.algorithm                          | 信任管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的信任管理器工厂算法PKIX。 |
| transaction.timeout.ms                              | 在协调器主动中止事务之前，事务保持打开状态的最长时间（以毫秒为单位）。默认60000 (1 分钟)。<br>事务的开始时间是在将第一个分区添加到其中时设置的。如果该值大于broker中的设置`transaction.max.timeout.ms`，请求将失败并出现`InvalidTxnTimeoutException`错误。 |
| transactional.id                                    | 用于事务传递的事务性 ID。这启用了跨多个创建者会话的可靠性语义，因为它允许客户端保证在开始任何新事务之前已完成使用相同的 TransactionalId 的事务。如果未提供事务 ID，则生产者仅限于幂等传递。如果配置了事务性 ID，则为隐含的。默认情况下，未配置事务 ID，这意味着无法使用事务。请注意，默认情况下，事务需要至少三个broker的集群，这是生产环境的推荐设置;对于开发，您可以通过调整broker设置来更改此设置`enable.idempotence``transaction.state.log.replication.factor`。 |



## 五、consumer配置

以下是消费者的配置：

| 配置项                                              | 描述                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| key.deserializer                                    | 消息键的反序列化器类。实现该`org.apache.kafka.common.serialization.Deserializer`接口。 |
| value.deserializer                                  | 消息值的反序列化器类。实现`org.apache.kafka.common.serialization.Deserializer`接口。 |
| bootstrap.servers                                   | 用于建立与 Kafka 集群的初始连接的主机/端口对列表（该配置列表仅影响用于发现全套服务器的初始主机）。无论此处指定哪些服务器进行引导，客户端都将发现并使用所有服务器。该配置列表应采用以下形式`host1:port1,host2:port2,...`。由于这些服务器仅用于初始连接以发现完整的集群成员资格（可能会动态更改），因此此列表不需要包含完整的服务器集（不过，您可能需要多个服务器，以防服务器停机） 。 |
| fetch.min.bytes                                     | 服务器应为获取请求返回的最小数据量。如果可用数据不足，请求将等待积累足够多的数据，然后再答复请求。默认设置 1 字节意味着，只要有那么多字节的数据可用，或者获取请求在等待数据到达时超时，就会立即应答获取请求。将其设置为较大的值将导致服务器等待大量数据的积累，这可以稍微提高服务器吞吐量，但会带来一些额外的延迟。 |
| group.id                                            | 标识该消费者所属的消费者组的唯一字符串。如果消费者使用组管理功能`subscribe(topic)`或基于 Kafka 的偏移量管理策略，则需要此属性。 |
| heartbeat.interval.ms                               | 使用 Kafka 的组管理设施时向消费者协调器发出心跳的预期时间间隔。默认3000 (3 秒)。心跳用于确保消费者的会话保持活动状态，并在新消费者加入或离开组时促进重新平衡。该值必须设置为低于`session.timeout.ms`，但通常不应高于该值的 1/3。它可以调整得更低，以控制正常重新平衡的预期时间。 |
| max.partition.fetch.bytes                           | 服务器将返回的每个分区的最大数据量。默认1048576 (1 MB)。记录由消费者批量获取。如果提取的第一个非空分区中的第一个记录批次大于此限制，该批次仍将被返回以确保消费者可以取得进展。broker接受的最大记录批量大小是通过`message.max.bytes`（broker配置）或`max.message.bytes`（主题配置）定义的。请参阅 fetch.max.bytes 以限制消费者请求大小。 |
| session.timeout.ms                                  | 使用 Kafka 的组管理工具时用于检测客户端故障的超时。客户端定期发送心跳以向代理表明其活跃度。如果在此会话超时到期之前broker没有收到心跳，则broker将从组中删除该客户端并启动重新平衡。请注意，该值必须在broker配置中`group.min.session.timeout.ms`和所配置的允许范围内`group.max.session.timeout.ms`。 |
| ssl.key.password                                    | 密钥存储文件中私钥的密码或“ssl.keystore.key”中指定的 PEM 密钥的密码。 |
| ssl.keystore.certificate.chain                      | 证书链采用由“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                    | 私钥采用“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                               | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                               | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.truststore.certificates                         | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                             | 信任存储区文件的位置。                                       |
| ssl.truststore.password                             | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| allow.auto.create.topics                            | 允许在订阅或分配主题时在broker上自动创建主题。仅当broker允许使用 'auto.create.topics.enable' broker配置时，才会自动创建正在订阅的主题。使用早于 0.11.0 的broker时，此配置必须设置为 'false' |
| auto.offset.reset                                   | 当 Kafka 中没有初始偏移量或者当前偏移量在服务器上不再存在时（例如因为该数据已被删除）该怎么办，默认latest：<br>1）  earliest(最早)：自动将偏移量重置为最早的偏移量 <br>2）latest(最新)：自动将偏移量重置为最新偏移量 <br>3）none：如果没有找到消费者组的先前偏移量，则向消费者抛出异常 <br>4）anything else(其他任何事情)：向消费者抛出异常 |
| client.dns.lookup                                   | 控制客户端如何使用 DNS 查找。默认值use_all_dns_ips<br>1）如果设置为`use_all_dns_ips`，则按顺序连接每个返回的 IP 地址，直到建立成功连接。断开连接后，将使用下一个 IP。一旦所有 IP 使用一次，客户端就会再次从主机名解析 IP（但是 JVM 和操作系统都会缓存 DNS 名称查找）。<br>2）如果设置为`resolve_canonical_bootstrap_servers_only`，则将每个引导地址解析为规范名称列表。在引导阶段之后，其行为与 相同`use_all_dns_ips`。 |
| connections.max.idle.ms                             | 在此配置指定的毫秒数后关闭空闲连接。默认540000 (9 分钟)      |
| default.api.timeout.ms                              | 指定客户端 API 的超时（以毫秒为单位）。默认60000 (1 分组)。此配置用作所有未指定`timeout`参数的客户端操作的默认超时。 |
| enable.auto.commit                                  | 如果为 true，消费者的偏移量将在后台定期提交。默认true        |
| exclude.internal.topics                             | 是否应从订阅中排除与订阅模式匹配的内部主题。默认true。始终可以显式订阅内部主题。 |
| fetch.max.bytes                                     | 服务器应为获取请求返回的最大数据量。默认52428800 (50 MB)。记录由消费者批量获取，如果获取的第一个非空分区中的第一个记录批次大于该值，仍然会返回该记录批次以确保消费者能够取得进展。因此，这不是绝对最大值。broker接受的最大记录批量大小是通过`message.max.bytes`（代理配置）或`max.message.bytes`（主题配置）定义的。请注意，消费者并行执行多个提取。 |
| group.instance.id                                   | 最终用户提供的消费者实例的唯一标识符。只允许非空字符串。如果设置，消费者将被视为静态成员，这意味着消费者组中任何时候只允许有一个具有此 ID 的实例。这可以与较大的会话超时结合使用，以避免由于暂时不可用（例如进程重新启动）而导致的组重新平衡。如果未设置，消费者将作为动态成员加入该组，这是传统行为。 |
| isolation.level                                     | 控制如何读取以事务方式写入的消息。如果设置为 `read_committed`，consumer.poll（） 将只返回已提交的事务性消息。如果设置为 `read_uncommitted`（默认值），consumer.poll（） 将返回所有消息，甚至是已中止的事务消息。非事务性消息将在任一模式下无条件返回。<br>消息将始终按偏移顺序返回。因此，在`read_committed`模式，consumer.poll（） 将只返回到最后一个稳定偏移量 （LSO） 的消息，即小于第一个打开事务的偏移量。特别是在属于正在进行的事务的消息之后出现的任何消息都将被扣留，直到相关事务完成。因此，配置了`read_committed`的消费者在事务未完成时时将无法读取高水位线。<br><font color="red">上面的话是不是看不懂？没错，我也看不懂，下面说一段大白话来解释：</font>在消费端有一个参数isolation.level,用来配置事务的隔离级别的。<br/>默认是 read_uncommitted，读未提交，也就是消费端应用可以消费到未提交的事务。<br/>这个参数还可以设置为  read_committed ，只有已经提交的事务，消费端才能消费到。<br/>例如，生产者开启事务并向某个分区发送3条消息msg1 msg2 msg3 ，在执行commitTransaction（）或者abortTransaction()方法前，设置为read_committed的话，消费端应用是消费不到这些消息的。<br/>不过在KafkaConsumer内部会缓存这些消息，知道生产者执行commitTransaction()方法之后它才能将这些消息推送给消费端应用。<br/>反之，如果生产者执行了abortTransaction()方法，那么KafkaConsumer会将这些缓存的消息丢弃而不推送给消费端应用。<br/> |
| max.poll.interval.ms                                | 使用消费者组管理时，调用 poll() 之间的最大延迟。默认300000 (5 分钟)。这对消费者在获取更多记录之前可以空闲的时间设置了上限。如果在此超时到期之前未调用 poll()，则消费者将被视为失败，并且组将重新平衡，以便将分区重新分配给另一个成员。对于使用非空的消费者`group.instance.id`达到此超时，分区不会立即重新分配。相反，消费者将停止发送心跳，并且分区将在 过期后重新分配`session.timeout.ms`。这反映了已关闭的静态消费者的行为。 |
| max.poll.records                                    | 单次调用 poll() 返回的最大记录数。默认500。请注意，这`max.poll.records`不会影响底层的获取行为。消费者将缓存每个获取请求的记录，并从每次轮询中增量返回它们。 |
| partition.assignment.strategy                       | 按优先顺序排序的类名称或类类型列表，支持分区分配策略，当使用组管理时，客户端将使用这些策略在消费者实例之间分配分区所有权。可用选项有：<br>1）`org.apache.kafka.clients.consumer.RangeAssignor`：按主题分配分区。<br>2）`org.apache.kafka.clients.consumer.StickyAssignor`：保证分配最大程度地平衡，同时保留尽可能多的现有分区分配。<br>3）`org.apache.kafka.clients.consumer.CooperativeStickyAssignor`：遵循相同的 StickyAssignor 逻辑，但允许合作重新平衡。<br>默认分配器是 [RangeAssignor, CooperativeStickyAssignor]，默认情况下将使用 RangeAssignor，但允许升级到 CooperativeStickyAssignor，只需一次滚动弹跳即可从列表中删除 RangeAssignor。<br>实现该`org.apache.kafka.clients.consumer.ConsumerPartitionAssignor`接口允许我们插入自定义分配策略。 |
| receive.buffer.bytes                                | 读取数据时要使用的 TCP 接收缓冲区 （SO_RCVBUF） 的大小。默认65536 (64 kb)。如果值为 -1，则将使用操作系统默认值。 |
| request.timeout.ms                                  | 配置控制客户端等待请求响应的最长时间。默认30000 (30 秒)。如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试用尽时使请求失败。 |
| sasl.client.callback.handler.class                  | 实现 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.jaas.config                                    | SASL 连接的 JAAS 登录上下文参数采用 JAAS 配置文件使用的格式。JAAS 配置文件格式描述[如下](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/tutorials/LoginConfigFile.html)。该值的格式为：`loginModuleClass controlFlag (optionName=optionValue)*;`。对于代理，配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，需要listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule； |
| sasl.kerberos.service.name                          | Kafka 运行时使用的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.login.callback.handler.class                   | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
| sasl.login.class                                    | 实现 Login 接口的类的完全限定名称。对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin |
| sasl.mechanism                                      | 用于客户端连接的 SASL 机制。这可以是安全提供程序可用的任何机制。GSSAPI 是默认机制。 |
| sasl.oauthbearer.jwks.endpoint.url                  | OAuth/OIDC 提供者 URL，提供者的[JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5)可以检索。URL 可以基于 HTTP(S) 或基于文件。<br>1）如果 URL 基于 HTTP(S)，则将通过broker启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。所有当时的密钥都将缓存在broker上以用于传入请求。如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。但是，broker会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。<br>2）如果 URL 是基于文件的，broker将在启动时从配置的位置加载 JWKS 文件。如果 JWT 包含不在 JWKS 文件中的“kid”标头值，则broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.token.endpoint.url                 | OAuth/OIDC 身份提供程序的 URL。<br>1）如果 URL 基于 HTTP（S），则它是颁发者的令牌终结点 URL，将根据 sasl.jaas.config 中的配置向其发出登录请求。<br>2）如果 URL 是基于文件的，则指定一个文件，其中包含由 OAuth/OIDC 身份提供程序颁发的用于授权的访问令牌（采用 JWT 序列化形式）。 |
| security.protocol                                   | 用于与broker通信的协议。不区分大小写，默认PLAINTEXT。可选值为：SASL_SSL, PLAINTEXT, SSL, SASL_PLAINTEXT。 |
| send.buffer.bytes                                   | 发送数据时要使用的 TCP 发送缓冲区 （SO_SNDBUF） 的大小。默认131072 (128 kb)。如果值为 -1，则将使用操作系统默认值。 |
| socket.connection.setup.timeout.max.ms              | 客户端等待建立套接字连接的最长时间。默认30000 (30 秒)。对于每个连续的连接失败，连接设置超时将呈指数级增长，直至此最大值。为避免连接风暴，将对超时应用随机因子 0.2，从而导致随机范围在计算值以下 20% 和高于计算值 20% 之间。 |
| socket.connection.setup.timeout.ms                  | 客户端等待建立套接字连接的时间量。默认10000 (10 秒)。如果在超时之前未建立连接，客户端将关闭套接字通道。 |
| ssl.enabled.protocols                               | 为 SSL 连接启用的协议列表。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2，TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值时，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.2，否则将回退到 TLSv1.2（假设两者都至少支持 TLSv1.2）。在大多数情况下，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.keystore.type                                   | 密钥存储文件的文件格式。默认值JKS。这对于客户端是可选的。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                        | 用于生成 SSLContext 的 SSL 协议。使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。该值对于大多数用例来说应该没问题。最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                        | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.truststore.type                                 | 信任存储文件的文件格式。默认值JKS。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| auto.commit.interval.ms                             | 消费者偏移量自动提交到 Kafka 的频率（以毫秒为单位）。默认5000 (5 秒)。当`enable.auto.commit`如果设置为true时生效。 |
| auto.include.jmx.reporter                           | 已弃用。是否自动包含 JmxReporter，即使它没有在`metric.reporters`中列出。此配置将在 Kafka 4.0 中删除，用户应改为添加`org.apache.kafka.common.metrics.JmxReporter`该到`metric.reporters`以启用 JmxReporter。 |
| check.crcs                                          | 是否自动检查消费记录的CRC32。默认true。这可确保消息不会发生在线或磁盘上的损坏。此检查会增加一些开销，因此在寻求极端性能的情况下可能会禁用它。 |
| client.id                                           | 发出请求时要传递给服务器的 id 字符串。这样做的目的是通过允许将逻辑应用程序名称包含在服务器端请求日志记录中，能够跟踪请求源，而不仅仅是 ip/端口。 |
| client.rack                                         | 此客户端的机架标识符。这可以是指示此客户端物理位置的任何字符串值。它对应于broker配置'broker.rack' |
| fetch.max.wait.ms                                   | 如果没有足够的数据立即满足 fetch.min.bytes 给出的要求，服务器在响应 fetch 请求之前将阻止的最长时间。默认500ms。 |
| interceptor.classes                                 | 用作拦截器的类的列表。实现该`org.apache.kafka.clients.consumer.ConsumerInterceptor`接口允许我们拦截（并可能改变）消费者收到的记录。默认情况下，没有拦截器。 |
| metadata.max.age.ms                                 | 强制刷新元数据的时间段，以毫秒为单位，默认300000 (5 分钟)。在此时间段之后，即使我们没有看到任何分区领导更改，我们也会强制刷新元数据，以主动发现任何新的代理或分区。 |
| metric.reporters                                    | 用作度量报告器的类列表。实现org.apache.kafka.common.metrics.MetricsReporter接口允许插入将被通知新度量创建的类。JmxReporter一直包含用来注册JMX统计信息。 |
| metrics.num.samples                                 | 为计算指标而维护的样本数量。默认2                            |
| metrics.recording.level                             | 度量标准的最高记录级别，默认info，可选项为INFO, DEBUG，TRACE。 |
| metrics.sample.window.ms                            | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| reconnect.backoff.max.ms                            | 重新连接到多次连接失败的broker时等待的最长时间（以毫秒为单位），默认1000 (1 秒)。如果设置，每个主机的退避将在每次连续连接失败时呈指数增加，直至达到此最大值。计算退避增量后，添加 20% 的随机抖动以避免连接风暴。 |
| reconnect.backoff.ms                                | 尝试重新连接到给定主机之前等待的基本时间量，默认50ms。这避免了在紧密循环中重复连接到主机。此退避适用于客户端与broker的所有连接尝试。 |
| retry.backoff.ms                                    | 尝试重试对给定主题分区的失败请求之前等待的时间量，默认100ms。这样可以避免在某些故障情况下在紧密循环中重复发送请求。 |
| sasl.kerberos.kinit.cmd                             | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin               | 刷新尝试之间的登录线程休眠时间。默认60000                    |
| sasl.kerberos.ticket.renew.jitter                   | 添加到更新时间的随机抖动的百分比。默认0.05                   |
| sasl.kerberos.ticket.renew.window.factor            | 登录线程将休眠，直到达到从上次刷新到票证到期的指定时间窗口因子，此时它将尝试更新票证。默认0.8 |
| sasl.login.connect.timeout.ms                       | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                          | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                   | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。合法值介于 0 到 3600（1 小时）之间；如果未指定值，则使用默认值 300（5 分钟）。如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds               | 登录刷新线程在刷新凭据之前等待的所需最短时间（以秒为单位）。合法值介于 0 到 900（15 分钟）之间；如果未指定值，则使用默认值 60（1 分钟）。如果该值和 sasl.login.refresh.buffer.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.factor                    | 登录刷新线程将休眠，直到达到相对于凭证生命周期的指定窗口因子，此时它将尝试刷新凭证。合法值介于 0.5 (50%) 和 1.0 (100%)（含）之间；如果未指定值，则使用默认值 0.8 (80%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.jitter                    | 相对于添加到登录刷新线程睡眠时间的凭证生命周期的最大随机抖动量。合法值介于 0 和 0.25 (25%) 之间（含）；如果未指定值，则使用默认值 0.05 (5%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.max.ms                     | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位），默认10000(10秒)。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                         | 尝试登录外部身份验证提供程序之间的初始等待时间（可选）值（以毫秒为单位）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                 | 以秒为单位的（可选）值，默认30秒。用于允许 OAuth/OIDC 身份提供程序和broker的时间差异。 |
| sasl.oauthbearer.expected.audience                  | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.expected.issuer                    | broker用于验证 JWT 是否由预期发行者创建的（可选）设置。将检查 JWT 是否有标准 OAuth“iss”声明，如果设置了该值，broker会将其与 JWT 的“iss”声明中的内容完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms           | 代理在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 小时)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位）。默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms     | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位）。默认100毫秒。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                   | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                     | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以提供用于 JWT 有效负载声明中包含的主题的不同名称。 |
| security.providers                                  | 可配置创建器类的列表，每个创建器类返回实现安全算法的提供程序，需要实现org.apache.kafka.common.security.auth.SecurityProviderCreator接口。 |
| ssl.cipher.suites                                   | 密码套件列表。 这是身份验证、加密、MAC 和密钥交换算法的命名组合，用于使用 TLS 或 SSL 网络协议协商网络连接的安全设置。 默认情况下，支持所有可用的密码套件。 |
| ssl.endpoint.identification.algorithm               | 使用服务器证书验证服务器主机名的端点识别算法，默认https。    |
| ssl.engine.factory.class                            | 类型为 org.apache.kafka.common.security.auth.SslEngineFactory 的类，用于提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.keymanager.algorithm                            | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法SunX509。 |
| ssl.secure.random.implementation                    | 用于 SSL 加密操作的 SecureRandom PRNG 实现。                 |
| ssl.trustmanager.algorithm                          | 信任管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的信任管理器工厂算法PKIX。 |



## 六、Kafka Connect框架配置

### 6.1、基础配置



| 配置项                                              | 描述                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| config.storage.topic                                | 存储连接器配置的 Kafka 主题的名称                            |
| group.id                                            | 标识该工作线程所属的 Connect 集群组的唯一字符串。            |
| key.converter                                       | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中键的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| offset.storage.topic                                | 存储源连接器偏移量的 Kafka 主题的名称                        |
| status.storage.topic                                | 存储连接器和任务状态的 Kafka 主题的名称                      |
| value.converter                                     | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中的值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| bootstrap.servers                                   | 用于建立与 Kafka 集群的初始连接的主机/端口对列表（该配置列表仅影响用于发现全套服务器的初始主机）。默认"localhost:9092"。无论此处指定哪些服务器进行引导，客户端都将发现并使用所有服务器。该配置列表应采用以下形式`host1:port1,host2:port2,...`。由于这些服务器仅用于初始连接以发现完整的集群成员资格（可能会动态更改），因此此列表不需要包含完整的服务器集（不过，您可能需要多个服务器，以防服务器停机） |
| exactly.once.source.support                         | 是否通过使用事务写入源记录及其源偏移量，以及在启动新任务之前主动隔离旧任务代，来为集群中的源连接器启用一次性支持。默认DISABLED，可选值有【DISABLED, ENABLED, PREPARING】<br/>要在新集群上启用一次性源支持，请将此属性设置为“ENABLED”。要在现有集群上启用支持，请首先在集群中的每个工作线程上设置为“preparing”，然后设置为“ENABLED”。滚动升级可用于这两种更改。有关此功能的更多信息，请参阅[一次性源支持文档](https://kafka.apache.org/documentation.html#connect_exactlyoncesource)。 |
| heartbeat.interval.ms                               | 使用 Kafka 的组管理工具时，向组协调器发出心跳的预期时间间隔。默认3000 (3 秒)。心跳用于确保工作人员的会话保持活动状态，并在新成员加入或离开组时促进重新平衡。该值必须设置为低于`session.timeout.ms`，但通常不应高于该值的 1/3。它可以调整得更低，以控制正常重新平衡的预期时间。 |
| rebalance.timeout.ms                                | 重新平衡开始后，每个工作人员加入该组的最大允许时间。默认60000 (1 分钟)。这基本上是对所有任务刷新任何挂起数据和提交偏移量所需的时间的限制。如果超过超时，那么该worker将从组中删除，这将导致偏移量提交失败。 |
| session.timeout.ms                                  | 用于检测工作器故障的超时时间。默认10000 (10 秒)。工作线程定期发送心跳以向broker表明其活跃度。如果在此会话超时到期之前broker没有收到心跳，则broker将从组中删除该工作线程并启动重新平衡。请注意，该值必须在broker配置 group.min.session.timeout.ms`和`group.max.session.timeout.ms`的范围之内。 |
| ssl.key.password                                    | 密钥存储文件中私钥的密码或在“ssl.keystore.key”中指定的 PEM 密钥。 |
| ssl.keystore.certificate.chain                      | 证书链采用由“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                    | 由“ssl.keystore.type”指定的格式的私钥。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                               | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                               | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.truststore.certificates                         | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                             | 信任存储区文件的位置。                                       |
| ssl.truststore.password                             | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| client.dns.lookup                                   | 控制客户端使用 DNS 查找broker的方式。默认`use_all_dns_ips`。可选值还有 resolve_canonical_bootstrap_servers_only<br>如果设置为`use_all_dns_ips` ，则按顺序连接到每个返回的 IP 地址，直到建立成功的连接。<br>断开连接后，将使用下一个 IP。一旦所有 IP 都使用过一次，客户端就会再次从主机名解析 IP（但是，JVM 和操作系统缓存 DNS 名称查找）。<br>如果设置为`resolve_canonical_bootstrap_servers_only`，将每个地址解析为规范名称列表。在引导阶段之后，其它行为和`use_all_dns_ips`一样。 |
| connections.max.idle.ms                             | 在该配置指定的毫秒数后关闭空闲连接。默认540000 (9 分钟)      |
| connector.client.config.override.policy             | ConnectorClientConfigOverridePolicy实现类的类名或者别名，定义连接器可以覆盖的客户端配置。默认实现为“All”，这意味着连接器配置可以覆盖所有客户端属性。框架中其他可能的策略包括“None”（禁止连接器重写客户端属性）和“Principal”（允许连接器仅覆盖客户端主体）。 |
| receive.buffer.bytes                                | 读取数据时要使用的 TCP 接收缓冲区 （SO_RCVBUF） 的大小。默认32768 (32 kb)。如果值为 -1，则将使用操作系统默认值。 |
| request.timeout.ms                                  | 配置控制客户端等待请求响应的最长时间。默认40000 (40 秒)。如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试用尽时使请求失败。 |
| sasl.client.callback.handler.class                  | 实现 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.jaas.config                                    | JAAS配置文件使用的格式的SASL连接的JAAS登录上下文参数。说明了JAAS配置文件格式为：“loginModuleClass controlFlag (optionName=optionValue)*;”。对于代理，配置必须以监听器前缀和SASL机制名称为小写前缀。例如，“listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule” |
| sasl.kerberos.service.name                          | Kafka 运行的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.login.callback.handler.class                   | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
| sasl.login.class                                    | 实现 Login 接口的类的完全限定名称。对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin |
|                                                     |                                                              |
| sasl.mechanism                                      | 用于客户端连接的 SASL 机制，默认机制是GSSAPI 。这可以是安全提供程序可用的任何机制。 |
| sasl.oauthbearer.jwks.endpoint.url                  | OAuth/OIDC 提供者 URL，提供者的[JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5)可以检索。URL 可以基于 HTTP(S) 或基于文件。<br>如果 URL 基于 HTTP(S)，则将通过broker启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。所有当时的密钥都将缓存在broker上以用于传入请求。如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。但是，broker会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。<br>如果 URL 是基于文件的，broker将在启动时从配置的位置加载 JWKS 文件。如果 JWT 包含 JWKS 文件中不存在的“kid”标头值 |
| sasl.oauthbearer.token.endpoint.url                 | OAuth/OIDC 身份提供商的 URL。<br>如果 URL 基于 HTTP(S)，则它是颁发者的令牌端点 URL，将根据 sasl.jaas.config 中的配置发出登录请求。<br>如果 URL 是基于文件的，则它指定一个包含 OAuth/OIDC 身份提供商颁发的访问令牌（JWT 序列化形式）的文件，用于授权。 |
| security.protocol                                   | 用于与broker通信的协议，默认PLAINTEXT。可选值为：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL。 |
| send.buffer.bytes                                   | 发送数据时要使用的 TCP 发送缓冲区 （SO_SNDBUF） 的大小。默认131072 (128 kb)。如果值为 -1，则将使用操作系统默认值。 |
| ssl.enabled.protocols                               | 为 SSL 连接启用的协议列表。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2,TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值时，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.2，否则将回退到 TLSv1.2（假设两者都至少支持 TLSv1.2）。在大多数情况下，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.keystore.type                                   | 密钥存储文件的文件格式。默认值是JKS，这对于客户端是可选的。可选的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                        | 用于生成 SSLContext 的 SSL 协议。 使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。 该值对于大多数用例来说应该没问题。 最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。 较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。 使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。 如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                        | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.truststore.type                                 | 信任存储文件的文件格式。默认JKS。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| worker.sync.timeout.ms                              | 当工作人员与其他工作人员不同步并且需要重新同步配置时，请在放弃、离开组之前等待一段时间，并在重新加入之前等待一段退避期。默认3000 (3 秒) |
| worker.unsync.backoff.ms                            | 当工作线程与其他工作线程不同步并且无法在worker.sync.timeout.ms内赶上时，请在重新加入之前离开Connect集群这么长时间。默认300000 (5 分钟) |
| access.control.allow.methods                        | 通过设置访问控制允许方法标头来设置跨源请求支持的方法。Access-Control-Allow-Methods 标头的默认值允许对 GET、POST 和 HEAD 的跨源请求。 |
| access.control.allow.origin                         | 用于为 REST API 请求设置访问控制允许源标头的值。若要启用跨源访问，请将此项设置为应允许访问 API 的应用程序域，或设置为“*”以允许从任何域进行访问。默认值仅允许从 REST API 的域进行访问。 |
| admin.listeners                                     | 管理 REST API 将侦听的以逗号分隔的 URI 列表。支持的协议是 HTTP 和 HTTPS。空字符串将禁用此功能。默认行为是使用常规侦听器（由“侦听器”属性指定）。<br>示例: "http://localhost:8080,https://localhost:8443" |
| auto.include.jmx.reporter                           | 已弃用。是否自动包含 JmxReporter，即使它没有在 `metric.reporters`中列出。此配置将在 Kafka 4.0 中删除，用户应改为添加`org.apache.kafka.common.metrics.JmxReporter`配置在`metric.reporters`以启用 JmxReporter。 |
| client.id                                           | 发出请求时要传递给服务器的 id 字符串。这样做的目的是通过允许将逻辑应用程序名称包含在服务器端请求日志记录中，能够跟踪请求源，而不仅仅是 ip/端口。 |
| config.providers                                    | 以逗号分隔的类名称，按指定的顺序加载和使用。通过实现该接口ConfigProvider，可以替换连接器配置中的变量引用，例如外部化机密的引用。 |
| config.storage.replication.factor                   | 创建配置存储主题时使用的复制因子，默认3。范围是不大于 Kafka 集群中的broker数量的正整数，或 -1 表示使用broker的默认值 |
| connect.protocol                                    | Kafka 连接协议的兼容模式，默认sessioned。可选值：eager, compatible, sessioned |
| header.converter                                    | HeaderConverter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。默认值"org.apache.kafka.connect.storage.SimpleHeaderConverter"。<br>这控制写入 Kafka 或从 Kafka 读取的消息中标头值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。默认情况下，SimpleHeaderConverter 用于将标头值序列化为字符串，并通过推断架构来反序列化它们。 |
| inter.worker.key.generation.algorithm               | 用于生成内部请求密钥的算法。算法“HmacSHA256”将在支持它的 JVM 上用作默认值;在其他 JVM 上，不使用缺省值，必须在工作线程配置中手动指定此属性的值。 |
| inter.worker.key.size                               | 用于对内部请求进行签名的密钥的大小（以位为单位）。如果为 null，则将使用密钥生成算法的默认密钥大小。 |
| inter.worker.key.ttl.ms                             | 用于内部请求验证的生成的会话密钥的 TTL（以毫秒为单位），默认3600000 (1 h) |
| inter.worker.signature.algorithm                    | 用于签署内部请求的算法，“HmacSHA256”将在支持它的 JVM 上被用作默认值;在其他 JVM 上，不使用缺省值，必须在工作线程配置中手动指定此属性的值。 |
| inter.worker.verification.algorithms                | 用于验证内部请求的允许算法的列表，其中必须包括用于 inter.worker.signature.algorithm 属性的算法。算法“[HmacSHA256]”将用作提供它们的 JVM 的默认值;在其他 JVM 上，不使用缺省值，必须在工作线程配置中手动指定此属性的值。 |
| listeners                                           | REST API 将侦听的以逗号分隔的 URI 列表。默认值"http://:8083"。支持的协议是 HTTP 和 HTTPS。<br/>将主机名指定为 0.0.0.0 以绑定到所有接口。<br/>将主机名留空以绑定到默认接口。<br/>合法侦听器列表示例：”http://localhost:8080,https://localhost:8443" |
|                                                     |                                                              |
| metadata.max.age.ms                                 | 强制刷新元数据的时间间隔，以毫秒为单位的时间段，默认300000 (5 分钟)，在此时间段之后，即使我们没有看到任何分区领导更改，我们也会强制刷新元数据，以主动发现任何新的broker或分区。 |
| metric.reporters                                    | 用作指标报告者的类的列表。实现该`org.apache.kafka.common.metrics.MetricsReporter`接口允许插入将收到新指标创建通知的类。JmxReporter 始终包含在内以注册 JMX 统计信息。 |
| metrics.num.samples                                 | 为计算指标而维护的样本数量。默认2                            |
| metrics.recording.level                             | 指标的最高记录级别，默认INFO。可选值有[INFO, DEBUG,]         |
| metrics.sample.window.ms                            | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| offset.flush.interval.ms                            | 尝试为任务提交偏移量的时间间隔。默认60000 (1 分钟)           |
| offset.flush.timeout.ms                             | 在取消进程并恢复要在未来尝试中提交的偏移数据之前，等待记录刷新并将分区偏移数据提交到偏移存储的最大毫秒数。默认5000 (5 秒)。此属性对于以一次性支持运行的源连接器没有影响。 |
| offset.storage.partitions                           | 创建偏移存储主题时使用的分区数，默认25。范围是：正数，或 -1 表示使用broker的默认值 |
| offset.storage.replication.factor                   | 创建偏移存储主题时使用的复制因子，默认3。范围是：正数，或 -1 表示使用broker的默认值 |
| plugin.discovery                                    | 用于发现类路径和 plugin.path 配置中存在的插件的方法。大小写都可以，默认值是hybrid_warn。可选值有：<br>1）only_scan：仅通过反射发现插件。服务加载程序无法发现的插件不会影响工作线程启动。<br>2）hybrid_warn：通过 ServiceLoader 反射性地发现插件。服务加载程序无法发现的插件将在工作线程启动期间打印警告。<br>3）hybrid_fail：通过 ServiceLoader 反射性地发现插件。服务加载程序无法发现的插件将导致工作线程启动失败。<br>4）service_load：仅通过 ServiceLoader 发现插件。启动速度比其他模式更快。服务加载程序无法发现的插件可能无法使用。 |
| plugin.path                                         | 包含插件（连接器、转换器、转换）的用逗号 （，） 分隔的路径列表。该列表应由顶级目录组成，其中包括以下任意组合：<br/>1） 立即包含带有插件及其依赖项的 jar 的目录<br>2） 带有插件及其依赖项的 uber-jars<br>3）立即包含插件类及其依赖项的包目录结构的目录依赖项<br>注意：将遵循符号链接来发现依赖项或插件。<br>示例：plugin.path=/usr/local/share/java,/usr/local/share/kafka/plugins,/opt/connectors<br/>不要在此属性中使用配置提供程序变量，因为原始路径由工作程序的扫描仪使用在配置提供程序初始化并用于替换变量之前。 |
| reconnect.backoff.max.ms                            | 重新连接到多次连接失败的broker时等待的最长时间（以毫秒为单位），默认1000 (1 秒)。如果设置，每个主机的退避将在每次连续连接失败时呈指数增加，直至达到此最大值。计算退避增量后，添加 20% 的随机抖动以避免连接风暴。 |
| reconnect.backoff.ms                                | 尝试重新连接到给定主机之前等待的基本时间量，默认50ms。这避免了在紧密循环中重复连接到主机。此退避适用于客户端与broker的所有连接尝试。 |
| response.http.headers.config                        | REST API HTTP 响应头的规则。逗号分隔的标头规则，其中每个标头规则的格式为 '[action] [标头名称]:[标头值]'，如果标头规则的任何部分包含逗号，则可以选择用双引号引起来 |
| rest.advertised.host.name                           | 如果设置了此选项，则这是将提供给其他工作线程以连接到的主机名。 |
| rest.advertised.listener                            | 设置将提供给其他工作人员使用的广告侦听器（HTTP 或 HTTPS）。  |
| rest.advertised.port                                | 如果设置了此端口，则该端口将提供给其他工作人员进行连接。     |
| rest.extension.class                                | 以逗号分隔的`ConnectRestExtension`类名称，按指定的顺序加载和调用。实现该接口 `ConnectRestExtension`允许您将用户定义的资源（例如过滤器）注入 Connect 的 REST API。通常用于添加自定义功能，例如日志记录、安全性等。 |
| retry.backoff.ms                                    | 尝试重试对给定主题分区的失败请求之前等待的时间。默认100ms。这避免了在某些故障场景下在紧密循环中重复发送请求。 |
| sasl.kerberos.kinit.cmd                             | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin               | 刷新尝试之间的登录线程休眠时间。默认60000                    |
| sasl.kerberos.ticket.renew.jitter                   | 添加到更新时间的随机抖动的百分比。默认0.05                   |
| sasl.kerberos.ticket.renew.window.factor            | 登录线程将休眠，直到达到从上次刷新到票证到期的指定时间窗口因子，此时它将尝试更新票证。默认0.8 |
| sasl.login.connect.timeout.ms                       | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                          | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                   | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。合法值介于 0 到 3600（1 小时）之间；如果未指定值，则使用默认值 300（5 分钟）。如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds               | 登录刷新线程在刷新凭据之前等待的所需最短时间（以秒为单位）。合法值介于 0 到 900（15 分钟）之间；如果未指定值，则使用默认值 60（1 分钟）。如果该值和 sasl.login.refresh.buffer.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.factor                    | 登录刷新线程将休眠，直到达到相对于凭证生命周期的指定窗口因子，此时它将尝试刷新凭证。合法值介于 0.5 (50%) 和 1.0 (100%)（含）之间；如果未指定值，则使用默认值 0.8 (80%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.jitter                    | 相对于添加到登录刷新线程睡眠时间的凭证生命周期的最大随机抖动量。合法值介于 0 和 0.25 (25%) 之间（含）；如果未指定值，则使用默认值 0.05 (5%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.max.ms                     | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位）。默认10000（10秒）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                         | 尝试登录外部身份验证提供程序之间的初始等待的（可选）值（以毫秒为单位）。默认100毫秒。登录使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，并且在尝试之间等待时间将加倍，直至达到 sasl.login.retry.backoff.max.ms 设置指定的最大等待时间。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                 | 以秒为单位的（可选）值，默认30秒。用于允许 OAuth/OIDC 身份提供程序和broker的时间差异。 |
| sasl.oauthbearer.expected.audience                  | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms           | 代理在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 小时)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位）。默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms     | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位）。默认100毫秒。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                   | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                     | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以提供用于 JWT 有效负载声明中包含的主题的不同名称。 |
| scheduled.rebalance.max.delay.ms                    | 为等待一名或多名离职工作人员返回而安排的最大延迟，然后再重新平衡其连接器和任务并将其重新分配给组。默认300000 (5 分钟)。在此期间，离职员工的连接器和任务仍未分配 |
| socket.connection.setup.timeout.max.ms              | 客户端等待建立套接字连接的最长时间。默认30000（30秒）。对于每个连续的连接失败，连接设置超时将呈指数增长，直至达到此最大值。为了避免连接风暴，将对超时应用 0.2 的随机化因子，从而产生比计算值低 20% 到高 20% 之间的随机范围。 |
| socket.connection.setup.timeout.ms                  | 客户端等待建立套接字连接的时间。默认100000（10秒）。如果在超时之前未建立连接，客户端将关闭套接字通道。 |
| ssl.cipher.suites                                   | 密码套件列表。 这是身份验证、加密、MAC 和密钥交换算法的命名组合，用于使用 TLS 或 SSL 网络协议协商网络连接的安全设置。 默认情况下，支持所有可用的密码套件。 |
| ssl.client.auth                                     | 配置 kafka 代理来请求客户端身份验证。 以下设置是常见的：<br>1) `ssl.client.auth=required` 如果设置为必需，则需要客户端身份验证。 <br>2) `ssl.client.auth=requested` 这意味着客户端身份验证是可选的。与必需的不同，如果设置了此选项，客户端可以选择不提供有关其自身的身份验证信息 <br>3）`ssl.client.auth=none` 这意味着不需要客户端身份验证 |
| ssl.endpoint.identification.algorithm               | 使用服务器证书验证服务器主机名的端点识别算法，默认https。    |
| ssl.engine.factory.class                            | 类型为 org.apache.kafka.common.security.auth.SslEngineFactory 的类，用于提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.keymanager.algorithm                            | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法SunX509。 |
| ssl.secure.random.implementation                    | 用于SSL加密操作的SecureRandom PRNG实现。                     |
| ssl.trustmanager.algorithm                          | 信任管理器工厂用于 SSL 连接的算法。 默认值是为 Java 虚拟机配置的信任管理器工厂算法PKIX。 |
| status.storage.partitions                           | 创建状态存储主题时使用的分区数，默认值5。可选范围是正整数，或者-1表示使用broker的配置 |
| status.storage.replication.factor                   | 创建状态存储主题时使用的复制因子，默认3。可选范围是正整数，或者-1表示使用broker的配置 |
| task.shutdown.graceful.timeout.ms                   | 等待任务正常关闭的时间量。这是总时间量，而不是每个任务。所有任务都触发了关闭，然后按顺序等待。默认5000 (5 秒) |
| topic.creation.enable                               | 当源连接器配置了“topic.creation.”属性时，是否允许自动创建源连接器使用的主题。默认true。每个任务都将使用管理客户端来创建其主题，并且不依赖于 Kafka 代理自动创建主题。 |
| topic.tracking.allow.reset                          | 如果设置为 true，则允许用户请求重置每个连接器的活动主题集。默认true |
| topic.tracking.enable                               | 启用在运行时跟踪每个连接器的活动主题集。默认true             |

 

### 6.2、源连接器配置

| 配置项                           | 描述                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| name                             | 用于此连接器的全局唯一名称。不带 ISO 控制字符的非空字符串    |
| connector.class                  | 此连接器的类的名称或别名。必须是 org.apache.kafka.connect.connector.connector 的子类。如果连接器是 org.apache.kafka.connect.file.FileStreamSinkConnector，则可以指定此全名，或使用“FileStreamSink”或“FileStreamSinkConnector”使配置更短一些 |
| tasks.max                        | 用于此连接器的最大任务数。默认1。                            |
| key.converter                    | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中键的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| value.converter                  | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中的值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| header.converter                 | HeaderConverter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中标头值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。默认情况下，SimpleHeaderConverter 用于将标头值序列化为字符串，并通过推断架构来反序列化它们。 |
| config.action.reload             | 当外部配置提供程序的更改导致连接器的配置属性发生更改时，Connect 应对连接器执行的操作。值“none”表示 Connect 将不执行任何操作。“restart”值表示 Connect 应使用更新的配置属性重新启动/重新加载连接器。如果外部配置提供程序指示配置值将来会过期，则实际上可能会在将来安排重新启动。 |
| transforms                       | 要应用于记录的转换的别名。非空字符串，唯一的转换别名         |
| predicates                       | 转换使用的谓词的别名。非空字符串，唯一的谓词别名             |
| errors.retry.timeout             | 重新尝试失败操作的最长持续时间（以毫秒为单位）。默认值为 0，表示不会尝试重试。使用 -1 进行无限次重试。 |
| errors.retry.delay.max.ms        | 连续重试尝试之间的最大持续时间（以毫秒为单位）。默认60000 (1 分钟)。一旦达到此限制，抖动将添加到延迟中，以防止出现雷鸣般的牛群问题。 |
| errors.tolerance                 | 在连接器操作期间容忍错误的行为。“none”是默认值，表示任何错误都将导致立即连接器任务失败;“all”更改行为以跳过有问题的记录。 |
| errors.log.enable                | 如果为 true，则将每个错误以及失败操作和有问题的记录的详细信息写入 Connect 应用程序日志。默认配置是“false”，因此仅报告不能容忍的错误。 |
| errors.log.include.messages      | 是否在日志中包含导致失败的连接记录。对于接收器记录，将记录主题、分区、偏移量和时间戳。对于源记录，将记录键和值（及其架构）、所有标头以及时间戳、Kafka 主题、Kafka 分区、源分区和源偏移量。默认情况下，这是“false”，这将阻止将记录键、值和标头写入日志文件。 |
| topic.creation.groups            | 源连接器创建的主题的配置组                                   |
| exactly.once.support             | 允许的值是[requested的、required]。如果设置为“required”，则强制对连接器进行预检，以确保它可以使用给定的配置提供一次性语义。某些连接器可能能够提供一次性语义，但不会向 Connect 发出信号表明它们支持此功能；在这种情况下，在创建连接器之前应仔细查阅连接器的文档，并且该属性的值应设置为“requested”。此外，如果该值设置为“required”，但执行预检验证的工作线程没有为源连接器启用exactly.once.support，则创建或验证连接器的请求将失败。 |
| transaction.boundary             | 允许的值为：[INTERVAL, POLL, CONNECTOR]。如果设置为“poll”，则将为该连接器中的每个任务提供给 Connect 的每批记录启动并提交一个新的生产者事务。如果设置为“CONNECTOR”，则依赖于连接器定义的事务边界；请注意，并非所有连接器都能够定义自己的事务边界，在这种情况下，尝试使用此值实例化连接器将会失败。最后，如果设置为“interval”，则仅在用户定义的时间间隔过去后提交事务。 |
| transaction.boundary.interval.ms | 如果“transaction.boundary”设置为“interval”，则确定连接器任务提交生产者事务的间隔。如果未设置，则默认为辅助角色级别“offset.flush.interval.ms”属性的值。如果指定了不同的事务边界，则它不起作用。 |
| offsets.storage.topic            | 要用于此连接器的单独偏移量主题的名称。如果为空或未指定，将使用工作线程的全局偏移量主题名称。如果指定，则如果此连接器所针对的 Kafka 集群上尚不存在偏移量主题，则将创建偏移量主题（如果连接器生产者的 bootstrap.servers 属性已从辅助角色的集群覆盖，则可能与用于辅助角色全局偏移量主题的偏移量主题不同）。仅适用于分布式模式;在独立模式下，设置此属性将不起作用。 |



### 6.3、接收器连接器配置

下面是接收器连接器的配置：

| 配置项                                          | 描述                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| name                                            | 用于此连接器的全局唯一名称。                                 |
| connector.class                                 | 此连接器的类的名称或别名。必须是 org.apache.kafka.connect.connector.connector 的子类。如果连接器是 org.apache.kafka.connect.file.FileStreamSinkConnector，则可以指定此全名，或使用“FileStreamSink”或“FileStreamSinkConnector”使配置更短一些 |
| tasks.max                                       | 用于此连接器的最大任务数。                                   |
| topics                                          | 要消费的主题列表，以逗号分隔                                 |
| topics.regex                                    | 提供要使用的主题的正则表达式。在底层，正则表达式被编译为`java.util.regex.Pattern`. 仅应指定 topic 或 topic.regex 之一。 |
| key.converter                                   | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中键的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| value.converter                                 | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中的值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| header.converter                                | HeaderConverter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中标头值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。默认情况下，SimpleHeaderConverter 用于将标头值序列化为字符串，并通过推断架构来反序列化它们。 |
| config.action.reload                            | 当外部配置提供程序的更改导致连接器的配置属性发生更改时，Connect 应对连接器执行的操作。值“none”表示 Connect 将不执行任何操作。“restart”值表示 Connect 应使用更新的配置属性重新启动/重新加载连接器。如果外部配置提供程序指示配置值将来会过期，则实际上可能会在将来安排重新启动。 |
| transforms                                      | 要应用于记录的转换的别名。                                   |
| predicates                                      | 转换使用的谓词的别名。                                       |
| errors.retry.timeout                            | 重新尝试失败操作的最长持续时间（以毫秒为单位）。默认值为 0，表示不会尝试重试。使用 -1 进行无限次重试。 |
| errors.retry.delay.max.ms                       | 连续重试尝试之间的最大持续时间（以毫秒为单位）。默认60000 (1 分钟)。一旦达到此限制，抖动将添加到延迟中，以防止出现雷鸣般的牛群问题。 |
| errors.tolerance                                | 在连接器操作期间容忍错误的行为。“none”是默认值，表示任何错误都将导致立即连接器任务失败;“all”更改行为以跳过有问题的记录。 |
| errors.log.enable                               | 默认false，如果为 true，则将每个错误以及失败操作和有问题的记录的详细信息写入 Connect 应用程序日志。默认情况下，这是“false”，因此仅报告不能容忍的错误。 |
| errors.log.include.messages                     | 是否在日志中包含导致失败的连接记录。对于接收器记录，将记录主题、分区、偏移量和时间戳。对于源记录，将记录键和值（及其架构）、所有标头以及时间戳、Kafka 主题、Kafka 分区、源分区和源偏移量。默认情况是“false”，这将阻止将记录键、值和标头写入日志文件。 |
| errors.deadletterqueue.topic.name               | 要用作死信队列 （DLQ） 的主题的名称，这些消息在此接收器连接器或其转换或转换器处理时会导致错误。默认情况下，主题名称为空，表示DLQ中不会记录任何消息。 |
| errors.deadletterqueue.topic.replication.factor | 用于创建死信队列主题（如果死信队列主题尚不存在）的复制因子。默认3 |
| errors.deadletterqueue.context.headers.enable   | 默认false，如果为 true，则将包含错误上下文的标头添加到写入死信队列的消息中。为避免与原始记录中的标头发生冲突，所有错误上下文标头键、所有错误上下文标头键都将以`__connect.errors`开头 |



## 七、Kafka Streams配置



下面是 Kafka Streams 客户端库的配置。

| 配置项                                        | 描述                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| application.id                                | 流处理应用程序的标识符。在 Kafka 集群中必须是唯一的。它用作<br> 1） 默认客户端 ID 前缀<br>2） 成员资格管理的组 ID<br>3） 更新日志主题前缀。 |
| bootstrap.servers                             | 用于建立与 Kafka 集群的初始连接的主机/端口对列表。客户端将使用所有服务器，无论此处指定哪些服务器进行引导 - 该列表仅影响用于发现全套服务器的初始主机。该列表应采用以下形式`host1:port1,host2:port2,...`。由于这些服务器仅用于初始连接以发现完整的集群成员资格（可能会动态更改），因此此列表不需要包含完整的服务器集（不过，您可能需要多个服务器，以防服务器停机） 。 |
| num.standby.replicas                          | 每个任务的备用副本数。                                       |
| state.dir                                     | 状态存储的目录位置。对于共享同一底层文件系统的每个流实例，此路径必须是唯一的。<br>默认值/var/folders/1w/r49gc42j1ml6ddw0lhlvt9pw0000gn/T//kafka-streams |
| acceptable.recovery.lag                       | 客户端被视为已赶上足以接收活动任务分配的最大可接受滞后（要赶上的偏移量数量）。默认10000。分配后，它仍然会在处理之前恢复变更日志的其余部分。为了避免重新平衡期间处理暂停，此配置应对应于给定工作负载的远低于一分钟的恢复时间。必须至少为 0。 |
| cache.max.bytes.buffering                     | 用于跨所有线程缓冲的最大内存字节数，默认10485760             |
| client.id                                     | 用于内部消费者、生产者和恢复消费者的客户端 ID 的 ID 前缀字符串，模式为`<client.id>-StreamThread-<threadSequenceNumber$gt;-<consumer|producer|restore-consumer>`。 |
| default.deserialization.exception.handler     | 实现该`org.apache.kafka.streams.errors.DeserializationExceptionHandler`接口的异常处理类。默认值org.apache.kafka.streams.errors.LogAndFailExceptionHandler |
| default.key.serde                             | 实现`org.apache.kafka.common.serialization.Serde`接口的键的默认序列化器/反序列化器类。请注意，当使用窗口化 Serde 类时，还需要通过“default.windowed.key.serde.inner”或“default.windowed.value.serde.inner”设置实现该接口`org.apache.kafka.common.serialization.Serde`的内部 serde 类 |
| default.list.key.serde.inner                  | 实现接口的 key 的 list serde 的默认内部类`org.apache.kafka.common.serialization.Serde`。当且仅当`default.key.serde`配置设置为`org.apache.kafka.common.serialization.Serdes.ListSerde` |
| default.list.key.serde.type                   | 实现`java.util.List`接口的键的默认类。当且仅当`default.key.serde`配置设置为`org.apache.kafka.common.serialization.Serdes.ListSerde`，注意当使用 list serde 类时，需要设置`org.apache.kafka.common.serialization.Serde`通过 'default.list.key.serde.inner' 实现接口的内部 serde 类时，才会读取此配置 |
| default.production.exception.handler          | 实现该`org.apache.kafka.streams.errors.ProductionExceptionHandler`接口的异常处理类。默认值org.apache.kafka.streams.errors.DefaultProductionExceptionHandler |
| default.timestamp.extractor                   | 实现该`org.apache.kafka.streams.processor.TimestampExtractor`接口的默认时间戳提取器类。默认org.apache.kafka.streams.processor.FailOnInvalidTimestamp |
| default.value.serde                           | 实现 `org.apache.kafka.common.serialization.Serde` 接口的值的默认序列化器/反序列化器类。 请注意，当使用窗口化 Serde 类时，需要通过 `default.windowed.key.serde.inner` 或 `default.windowed` 设置 `org.apache.kafka.common.serialization.Serde`接口的内部实现. |
| max.task.idle.ms                              | 此配置控制连接和合并是否可能产生无序结果。 配置值是流任务在完全赶上某些（但不是全部）输入分区以等待生产者发送附加记录并避免潜在的无序记录处理时保持空闲状态的最长时间（以毫秒为单位） 跨多个输入流。 默认值（零）不等待生产者发送更多记录，但它会等待获取代理上已存在的数据。 此默认值意味着对于代理上已存在的记录，Streams 将按时间戳顺序处理它们。 设置为 -1 以完全禁用空闲并处理任何本地可用的数据，即使这样做可能会产生无序处理。 |
| max.warmup.replicas                           | 可以一次分配的最大预热副本数（超出配置的 num.standbys 的额外备用副本），以便在任务在已重新分配到的另一实例上预热时保持任务在一个实例上可用。用于限制可用于实现高可用性的额外代理流量和集群状态。必须至少为 1。注意，1 个预热副本对应一个 Stream Task。此外，请注意，每个预热副本只能在重新平衡期间提升为活动任务（通常在所谓的探测重新平衡期间，其发生频率由“probing.rebalance.interval.ms”配置指定）。这意味着活动任务从一个 Kafka Streams 实例迁移到另一个实例的最大速率可以由 （'max.warmup.replicas' / 'probing.rebalance.interval.ms' 确定。 |
| num.stream.threads                            | 要执行流处理的线程数。默认1                                  |
| processing.guarantee                          | 应使用的处理保证。可选的值为`at_least_once`（默认）和`exactly_once_v2`（需要broker版本 2.5 或更高版本）。已弃用的选项有`exactly_once`（需要broker版本 0.11.0 或更高版本）和`exactly_once_beta`（需要broker版本 2.5 或更高版本）。请注意，默认情况下，一次处理需要至少三个broker的集群，对于开发，可以通过调整broker设置`transaction.state.log.replication.factor`和`transaction.state.log.min.isr`来更改此设置。 |
| rack.aware.assignment.non_overlap_cost        | 与从现有工作分配中移动任务相关的成本。此配置和`rack.aware.assignment.traffic_cost`是倾向于最小化跨机架流量还是最小化现有分配中任务的移动。如果设置较大的值，org.apache.kafka.streams.processor.internals.assignment.RackAwareTaskAssignor将进行优化以维护现有分配。默认值为 null，这意味着它将在不同的分配者中使用默认non_overlap成本值。`rack.aware.assignment.traffic_cost``org.apache.kafka.streams.processor.internals.assignment.RackAwareTaskAssignor` |
| rack.aware.assignment.strategy                | 用于机架感知分配的策略。在分配任务时，机架感知分配将考虑在内，以最大程度地减少跨机架流量。<br>可选设置为：<br>1）`none`（默认值）：将禁用机架感知分配;<br>2）min_traffic：将计算最小跨机架流量分配。 |
| rack.aware.assignment.tags                    | 用于在 Kafka Streams 实例之间分发备用副本的客户端标签键列表。配置后，Kafka Streams 将尽最大努力在每个客户端标记维度上分配备用任务。可配置最多包含 5 个元素的列表。 |
| rack.aware.assignment.traffic_cost            | 与跨机架流量相关的成本。此配置和`rack.aware.assignment.non_overlap_cost `是倾向于最小化跨机架流量还是最小化现有分配中任务的移动。如果设置较大的值，org.apache.kafka.streams.processor.internals.assignment.RackAwareTaskAssignor将优化以最大程度地减少跨机架流量。默认值为 null，这意味着它将使用不同分配器中的默认流量成本值。 |
| replication.factor                            | 流处理应用程序创建的更改日志主题和重新分区主题的复制因子。默认值-1（含义：使用broker默认复制因子）需要broker版本 2.4 或更高版本 |
| security.protocol                             | 用于与代理通信的协议。默认值PLAINTEXT，不区分大小写。可选值为：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL。 |
| statestore.cache.max.bytes                    | 用于跨所有线程的状态存储缓存的最大内存字节数，默认10485760 (10 mb) |
| task.timeout.ms                               | 任务可能因内部错误而停止并重试直到引发错误的最长时间（以毫秒为单位）。默认300000 (5 分钟)。对于 0ms 的超时，任务将引发第一个内部错误的错误。对于任何大于 0ms 的超时，任务将在引发错误之前至少重试一次。 |
| topology.optimization                         | 告诉 Kafka Streams 是否应该优化拓扑以及要应用哪些优化。可接受的值为：“+NO_OPTIMIZATION+”、“+OPTIMIZE+”或逗号分隔的特定优化列表：“+REUSE_KTABLE_SOURCE_TOPICS+”、“+MERGE_REPARTITION_TOPICS+”+“SINGLE_STORE_SELF_JOIN+”）。NO_OPTIMIZATION“为默认值。 |
| application.server                            | 指向用户定义端点的主机：端口对，可用于此 KafkaStreams 实例上的状态存储发现和交互式查询。 |
| auto.include.jmx.reporter                     | 已弃用。是否自动包含 JmxReporter，即使它没有在 `metric.reporters`中列出。此配置将在 Kafka 4.0 中删除，用户应改为添加`org.apache.kafka.common.metrics.JmxReporter`配置在`metric.reporters`以启用 JmxReporter。 |
| buffered.records.per.partition                | 每个分区要缓冲的最大记录数。默认1000                         |
| built.in.metrics.version                      | 要使用的内置指标的版本。默认latest                           |
| commit.interval.ms                            | 提交处理进度的频率（以毫秒为单位）。默认30000 (30 秒)。对于至少一次处理，提交意味着保存处理器的位置（即偏移量）。对于恰好一次处理，这意味着提交事务，其中包括保存位置并使输出主题中提交的数据对具有隔离级别read_committed的消费者可见。（注意，如果`processing.guarantee`设置为`exactly_once_v2`, `exactly_once`，则默认值为`100`，否则默认值为`30000`)。 |
| connections.max.idle.ms                       | 在此配置指定的毫秒数后关闭空闲连接。默认540000 (9 分钟)      |
| default.client.supplier                       | 实现`org.apache.kafka.streams.KafkaClientSupplier`接口的客户端供应商类。 |
| default.dsl.store                             | DSL 运算符使用的默认状态存储类型。默认rocksDB。可选值【rocksDB, in_memory】 |
| metadata.max.age.ms                           | 强制刷新元数据的时间间隔，以毫秒为单位的时间段，默认300000 (5 minutes)在此时间段之后，即使我们没有看到任何分区领导更改，我们也会强制刷新元数据，以主动发现任何新的broker或分区。 |
| metric.reporters                              | 要用作指标报告器的类的列表。实现该`org.apache.kafka.common.metrics.MetricsReporter`接口允许插入将收到新指标创建通知的类。始终包含 JmxReporter 以注册 JMX 统计信息。 |
| metrics.num.samples                           | 为计算指标而维护的样本数。默认2                              |
| metrics.recording.level                       | 指标的最高记录级别。默认INFO，可选值有[INFO, DEBUG, TRACE]   |
| metrics.sample.window.ms                      | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| poll.ms                                       | 阻止等待输入的时间量（以毫秒为单位）。默认100ms              |
| probing.rebalance.interval.ms                 | 触发重新平衡以探测已完成预热并准备变为活动的预热副本之前等待的最长时间（以毫秒为单位）。默认600000 (10 分钟)。探测重新平衡将继续触发，直到分配平衡为止。必须至少为 1 分钟。 |
| receive.buffer.bytes                          | 读取数据时使用的 TCP 接收缓冲区 (SO_RCVBUF) 的大小。默认32768（32 KB）。如果值为-1，将使用操作系统默认值。 |
| reconnect.backoff.max.ms                      | 重新连接到多次连接失败的broker时等待的最长时间（以毫秒为单位）。默认1000 (1 秒)。如果提供，则每个主机的退避将因每次连续连接失败呈指数级增长，直至达到此最大值。计算回退增加后，添加20%的随机抖动以避免连接风暴。 |
| reconnect.backoff.ms                          | 尝试重新连接到给定主机之前等待的基本时间。这样可以避免在紧密循环中重复连接到主机。此退避适用于客户端与broker的所有连接尝试。 |
| repartition.purge.interval.ms                 | 从重新分区主题中删除完全使用的记录的频率（以毫秒为单位）。 默认30000 (30 秒)。自上次清除后至少会在该值之后进行清除，但可能会延迟到以后。 （请注意，与`commit.interval.ms`不同，当`processing.guarantee`设置为`exactly_once_v2`时，该值的默认值保持不变）。 |
| request.timeout.ms                            | 配置控制客户端等待请求响应的最长时间。默认40000 (40 秒)。如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试用尽时使请求失败。 |
| retries                                       | 设置大于零的值将导致客户端重新发送任何失败并出现潜在暂时性错误的请求。建议将该值设置为0或“MAX_VALUE”，并使用相应的超时参数来控制客户端应重试请求的时间。 |
| retry.backoff.ms                              | 尝试重试对给定主题分区的失败请求之前等待的时间量，默认100ms。这样可以避免在某些故障情况下在紧密循环中重复发送请求。 |
| rocksdb.config.setter                         | 实现`org.apache.kafka.streams.state.RocksDBConfigSetter`接口的 Rocks DB 配置库类或类名 |
| send.buffer.bytes                             | 发送数据时要使用的 TCP 发送缓冲区 （SO_SNDBUF） 的大小。默认131072 (128 kb)。如果值为 -1，则将使用操作系统默认值。 |
| state.cleanup.delay.ms                        | 迁移分区后删除状态之前等待的时间量（以毫秒为单位）。默认600000 (10 秒)。只有至少未修改的状态目录才会被删除 |
| upgrade.from                                  | 允许以向后兼容的方式升级。从 [0.10.0， 1.1] 升级到 2.0+ 或从 [2.0， 2.3] 升级到 2.4+ 时需要执行此操作。从 3.3 升级到较新版本时，不需要指定此配置。默认值为“null”。可选的值为“0.10.0”、“0.10.1”、“0.10.2”、“0.11.0”、“1.0”、“1.1”、“2.0”、“2.1”、“2.2”、“2.3”、“2.4”、“2.5”、“2.6”、“2.7”、“2.8”、“3.0”、“3.1”、“3.2”、“3.3”、“3.4”（用于从相应的旧版本升级）。 |
| window.size.ms                                | 设置反序列化程序的窗口大小，以便计算窗口结束时间。           |
| windowed.inner.class.serde                    | 窗口记录的内部类的默认序列化程序/反序列化程序。必须实现`org.apache.kafka.common.serialization.Serde`接口。请注意，在 KafkaStreams 应用程序中设置此配置将导致错误，因为它只能从 Plain 消费者客户端使用。 |
| windowstore.changelog.additional.retention.ms | 添加到 Windows MaintenanceMs 以确保数据不会过早地从日志中删除。允许时钟漂移。默认为 86400000 （1 天） |



## 八、Admin配置（管理）

以下是 Kafka 管理客户端库的配置。

| 配置项                                              | 描述                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| bootstrap.servers                                   | 用于建立与 Kafka 集群的初始连接的主机/端口对列表。客户端将使用所有服务器，无论此处指定哪些服务器进行引导 - 该列表仅影响用于发现全套服务器的初始主机。该列表应采用以下形式`host1:port1,host2:port2,...`。由于这些服务器仅用于初始连接以发现完整的集群成员资格（可能会动态更改），因此此列表不需要包含完整的服务器集（不过，您可能需要多个服务器，以防服务器停机） 。 |
| ssl.key.password                                    | 密钥存储文件中私钥的密码或在“ssl.keystore.key”中指定的 PEM 密钥。 |
| ssl.keystore.certificate.chain                      | 证书链采用由“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                    | 由“ssl.keystore.type”指定的格式的私钥。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                               | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                               | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.truststore.certificates                         | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                             | 信任存储区文件的位置。                                       |
| ssl.truststore.password                             | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| client.dns.lookup                                   | 控制客户端使用 DNS 查找broker的方式。默认`use_all_dns_ips`。可选值还有 resolve_canonical_bootstrap_servers_only<br>如果设置为`use_all_dns_ips` ，则按顺序连接到每个返回的 IP 地址，直到建立成功的连接。<br>断开连接后，将使用下一个 IP。一旦所有 IP 都使用过一次，客户端就会再次从主机名解析 IP（但是，JVM 和操作系统缓存 DNS 名称查找）。<br>如果设置为`resolve_canonical_bootstrap_servers_only`，将每个地址解析为规范名称列表。在引导阶段之后，其它行为和`use_all_dns_ips`一样。 |
| client.id                                           | 发出请求时要传递给服务器的 id 字符串。这样做的目的是通过允许将逻辑应用程序名称包含在服务器端请求日志记录中，能够跟踪请求源，而不仅仅是 ip/端口。 |
| connections.max.idle.ms                             | 在此配置指定的毫秒数后关闭空闲连接。默认300000 (5 分钟)      |
| default.api.timeout.ms                              | 指定客户端 API 的超时（以毫秒为单位）。默认60000 (1 分钟)。此配置用作所有未指定`timeout`参数的客户端操作的默认超时。 |
| receive.buffer.bytes                                | 读取数据时要使用的 TCP 接收缓冲区 （SO_RCVBUF） 的大小。默认65536 (64 kb)。如果值为 -1，则将使用操作系统默认值。 |
| request.timeout.ms                                  | 配置控制客户端等待请求响应的最长时间。默认30000 (30 秒)。<br>如果在超时之前未收到响应，则客户端将在必要时重新发送请求，或者在重试次数耗尽时使请求失败。 |
| sasl.client.callback.handler.class                  | 实现 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.jaas.config                                    | SASL 连接的 JAAS 登录上下文参数，采用 JAAS 配置文件使用的格式，SASL 连接的 JAAS 登录上下文参数采用 JAAS 配置文件使用的格式。JAAS 配置文件格式描述[如下](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/tutorials/LoginConfigFile.html)。该值的格式为：`loginModuleClass controlFlag (optionName=optionValue)*;`。对于代理，配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，需要listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule； |
| sasl.kerberos.service.name                          | Kafka 运行的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.login.callback.handler.class                   | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
|                                                     |                                                              |
| sasl.login.class                                    | 实现 Login 接口的类的完全限定名称。对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin |
| sasl.mechanism                                      | 用于客户端连接的 SASL 机制，默认机制是GSSAPI 。这可以是安全提供程序可用的任何机制。 |
| sasl.oauthbearer.jwks.endpoint.url                  | OAuth/OIDC 提供者 URL，提供者的[JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5)可以检索。URL 可以基于 HTTP(S) 或基于文件。<br>如果 URL 基于 HTTP(S)，则将通过broker启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。所有当时的密钥都将缓存在broker上以用于传入请求。如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。但是，broker会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。<br>如果 URL 是基于文件的，broker将在启动时从配置的位置加载 JWKS 文件。如果 JWT 包含 JWKS 文件中不存在的“kid”标头值 |
| sasl.oauthbearer.token.endpoint.url                 | OAuth/OIDC 身份提供商的 URL。<br>如果 URL 基于 HTTP(S)，则它是颁发者的令牌端点 URL，将根据 sasl.jaas.config 中的配置发出登录请求。<br>如果 URL 是基于文件的，则它指定一个包含 OAuth/OIDC 身份提供商颁发的访问令牌（JWT 序列化形式）的文件，用于授权。 |
| security.protocol                                   | 用于与broker通信的协议，默认PLAINTEXT。可选值为：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL。 |
| send.buffer.bytes                                   | 发送数据时要使用的 TCP 发送缓冲区 （SO_SNDBUF） 的大小。默认131072 (128 KB)。如果值为 -1，则将使用操作系统默认值。 |
| socket.connection.setup.timeout.max.ms              | 客户端等待建立套接字连接的最长时间。默认30000（30秒）。对于每个连续的连接失败，连接设置超时将呈指数增长，直至达到此最大值。为了避免连接风暴，将对超时应用 0.2 的随机化因子，从而产生比计算值低 20% 到高 20% 之间的随机范围。 |
| socket.connection.setup.timeout.ms                  | 客户端等待建立套接字连接的时间。默认100000（10秒）。如果在超时之前未建立连接，客户端将关闭套接字通道。 |
| ssl.enabled.protocols                               | 为 SSL 连接启用的协议列表。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2,TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值时，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.2，否则将回退到 TLSv1.2（假设两者都至少支持 TLSv1.2）。在大多数情况下，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.keystore.type                                   | 密钥存储文件的文件格式。默认值是JKS，这对于客户端是可选的。可选的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                        | 用于生成 SSLContext 的 SSL 协议。 使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。 该值对于大多数用例来说应该没问题。 最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。 较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。 使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。 如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                        | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.truststore.type                                 | 信任存储文件的文件格式。默认JKS。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| auto.include.jmx.reporter                           | 已弃用。是否自动包含 JmxReporter，即使它没有在 中列出`metric.reporters`。此配置将在 Kafka 4.0 中删除，用户应添加`org.apache.kafka.common.metrics.JmxReporter`该配置`metric.reporters`以启用 JmxReporter。 |
| metadata.max.age.ms                                 | 强制刷新元数据的时间间隔，以毫秒为单位的时间段，默认300000 (5 分钟)，在此时间段之后，即使我们没有看到任何分区领导更改，我们也会强制刷新元数据，以主动发现任何新的broker或分区。 |
| metric.reporters                                    | 用作指标报告者的类的列表。实现该`org.apache.kafka.common.metrics.MetricsReporter`接口允许插入将收到新指标创建通知的类。JmxReporter 始终包含在内以注册 JMX 统计信息。 |
| metrics.num.samples                                 | 为计算指标而维护的样本数量。默认2                            |
| metrics.recording.level                             | 度量标准的最高记录级别，默认info，可选项为INFO, DEBUG。      |
| metrics.sample.window.ms                            | 计算指标样本的时间窗口。默认30000 (30 秒)                    |
| reconnect.backoff.max.ms                            | 重新连接到多次连接失败的broker时等待的最长时间（以毫秒为单位），默认1000 (1 秒)。如果设置，每个主机的退避将在每次连续连接失败时呈指数增加，直至达到此最大值。计算退避增量后，添加 20% 的随机抖动以避免连接风暴。 |
| reconnect.backoff.ms                                | 尝试重新连接到给定主机之前等待的基本时间量，默认50ms。这避免了在紧密循环中重复连接到主机。此退避适用于客户端与broker的所有连接尝试。 |
| retries                                             | 设置大于零的值将导致客户端重新发送任何失败并出现潜在暂时性错误的请求。默认2147483647（INTEGER.MAX_VALUE）。建议将该值设置为零或“INTEGER.MAX_VALUE”，并使用相应的超时参数来控制客户端应重试请求的时间。 |
| retry.backoff.ms                                    | 尝试重试失败的请求之前等待的时间量。这样可以避免在某些故障情况下在紧密循环中重复发送请求。默认100ms |
| sasl.kerberos.kinit.cmd                             | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin               | 登录线程在刷新尝试之间的睡眠时间。默认60000毫秒              |
| sasl.kerberos.ticket.renew.jitter                   | 添加到续订时间的随机抖动百分比。默认0.05                     |
| sasl.kerberos.ticket.renew.window.factor            | 登录线程将休眠，直到达到从上次刷新到票证到期的指定时间窗口因子，此时它将尝试续订票证。默认0.8 |
|                                                     |                                                              |
| sasl.login.connect.timeout.ms                       | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                          | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                   | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。 如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。 合法值介于 0 到 3600（1 小时）之间； 如果未指定值，则使用默认值 300（5 分钟）。 如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。 目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds               | 登录刷新线程在刷新凭据之前等待的最小时间，以秒为单位。合法值在0到900秒之间(15分钟);如果没有指定值，则使用默认值60秒(1分钟)。此值和sasl.login.refresh.buffer.seconds将会被忽略如果他们的总和超过了凭据的剩余生命周期。目前只适用于oauthholder。 |
| sasl.login.refresh.window.factor                    | 登录刷新线程将休眠，直到达到与凭据的生存期相关的指定窗口因子，此时它将尝试刷新凭据。合法值在0.5(50%)和1.0(100%)之间;如果没有指定值，则使用缺省值0.8(80%)。目前只适用于oauthholder。 |
| sasl.login.refresh.window.jitter                    | 添加到登录刷新线程睡眠时间中的相对于凭据生命周期的最大随机时基误差。法定值在0至0.25(含25%)之间;如果没有指定值，则使用默认值0.05(5%)。目前只适用于oauthholder。 |
| sasl.login.retry.backoff.max.ms                     | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位）。默认10000（10秒）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                         | 尝试登录外部身份验证提供程序之间的初始等待的（可选）值（以毫秒为单位）。默认100毫秒。登录使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，并且在尝试之间等待时间将加倍，直至达到 sasl.login.retry.backoff.max.ms 设置指定的最大等待时间。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                 | 以秒为单位的（可选）值，默认30秒。用于允许 OAuth/OIDC 身份提供程序和broker的时间差异。 |
| sasl.oauthbearer.expected.audience                  | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.expected.issuer                    | broker用于验证 JWT 是否由预期发行者创建的（可选）设置。将检查 JWT 是否有标准 OAuth“iss”声明，如果设置了该值，broker会将其与 JWT 的“iss”声明中的内容完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms           | 代理在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 小时)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位）。默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms     | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位）。默认100毫秒。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                   | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                     | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以提供用于 JWT 有效负载声明中包含的主题的不同名称。 |
| security.providers                                  | 可配置创建器类的列表，每个创建器类返回实现安全算法的提供程序，需要实现org.apache.kafka.common.security.auth.SecurityProviderCreator接口。 |
| ssl.cipher.suites                                   | 密码套件列表。 这是身份验证、加密、MAC 和密钥交换算法的命名组合，用于使用 TLS 或 SSL 网络协议协商网络连接的安全设置。 默认情况下，支持所有可用的密码套件。 |
| ssl.endpoint.identification.algorithm               | 使用服务器证书验证服务器主机名的端点识别算法，默认https。    |
| ssl.engine.factory.class                            | 类型为 org.apache.kafka.common.security.auth.SslEngineFactory 的类，用于提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.keymanager.algorithm                            | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法SunX509。 |
| ssl.secure.random.implementation                    | 用于 SSL 加密操作的 SecureRandom PRNG 实现。                 |
| ssl.trustmanager.algorithm                          | 信任管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的信任管理器工厂算法。PKIX |



## 九、MirrorMaker配置

> MirrorMaker是Kafka 官方提供的跨数据中心的流数据同步方案

### 9.1、MirrorMaker常用配置

以下是适用于所有三个连接器的常见配置属性。

| 配置项                                              | 描述                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| source.cluster.alias                                | 源集群别名                                                   |
| ssl.key.password                                    | 密钥存储文件中私钥的密码或在“ssl.keystore.key”中指定的 PEM 密钥。 |
| ssl.keystore.certificate.chain                      | 证书链采用由“ssl.keystore.type”指定的格式。默认 SSL 引擎工厂仅支持带有 X.509 证书列表的 PEM 格式 |
| ssl.keystore.key                                    | 由“ssl.keystore.type”指定的格式的私钥。默认 SSL 引擎工厂仅支持带有 PKCS#8 密钥的 PEM 格式。如果密钥已加密，则必须使用“ssl.key.password”指定密钥密码 |
| ssl.keystore.location                               | 密钥存储文件的位置。这对于客户端是可选的，可用于客户端的双向身份验证。 |
| ssl.keystore.password                               | 密钥存储文件的存储密码。这对于客户端是可选的，只有在配置了“ssl.keystore.location”时才需要。PEM 格式不支持密钥存储密码。 |
| ssl.truststore.certificates                         | 采用“ssl.truststore.type”指定格式的受信任证书。默认 SSL 引擎工厂仅支持具有 X.509 证书的 PEM 格式。 |
| ssl.truststore.location                             | 信任存储区文件的位置。                                       |
| ssl.truststore.password                             | 信任存储区文件的密码。如果未设置密码，仍将使用配置的信任存储文件，但会禁用完整性检查。PEM 格式不支持信任存储密码。 |
| target.cluster.alias                                | 目标集群的别名。在指标报告中使用。                           |
| sasl.client.callback.handler.class                  | 实现身份验证回调 AuthenticateCallbackHandler 接口的 SASL 客户端回调处理程序类的完全限定名称。 |
| sasl.jaas.config                                    | JAAS配置文件使用的格式的SASL连接的JAAS登录上下文参数。说明了JAAS配置文件格式为：“loginModuleClass controlFlag (optionName=optionValue)*;”。对于代理，配置必须以监听器前缀和SASL机制名称为小写前缀。例如，“listener.name.sasl_ssl.scram-sha-256.sasl.jaas.config=com.example.ScramLoginModule” |
| sasl.kerberos.service.name                          | Kafka 运行的 Kerberos 主体名称。这可以在 Kafka 的 JAAS 配置或 Kafka 的配置中定义。 |
| sasl.login.callback.handler.class                   | 实现 AuthenticateCallbackHandler 接口的 SASL 登录回调处理程序类的完全限定名称。对于broker，登录回调处理程序配置必须以侦听器前缀和小写的 SASL 机制名称为前缀。例如，listener.name.sasl_ssl.scram-sha-256.sasl.login.callback.handler.class=com.example.CustomScramLoginCallbackHandler |
| sasl.login.class                                    | 实现 Login 接口的类的完全限定名称。 对于broker，登录配置必须以侦听器前缀和小写的 SASL 机制名称作为前缀。 例如: `listener.name.sasl_ssl.scram-sha-256.sasl.login.class=com.example.CustomScramLogin` |
| sasl.mechanism                                      | 用于客户端连接的 SASL 机制。这可以是安全提供程序可用的任何机制。GSSAPI 是默认机制。 |
| sasl.oauthbearer.jwks.endpoint.url                  | OAuth/OIDC 提供者 URL，提供者的[JWKS（JSON Web 密钥集）](https://datatracker.ietf.org/doc/html/rfc7517#section-5)可以检索。URL 可以基于 HTTP(S) 或基于文件。<br>如果 URL 基于 HTTP(S)，则将通过broker启动时配置的 URL 从 OAuth/OIDC 提供程序检索 JWKS 数据。所有当时的密钥都将缓存在broker上以用于传入请求。如果收到 JWT 的身份验证请求，其中包含尚未在缓存中的“kid”标头声明值，则将根据需要再次查询 JWKS 端点。但是，broker会每隔 sasl.oauthbearer.jwks.endpoint.refresh.ms 毫秒轮询一次 URL，以便在收到包含这些密钥的任何 JWT 请求之前使用任何即将到来的密钥刷新缓存。<br>如果 URL 是基于文件的，broker将在启动时从配置的位置加载 JWKS 文件。如果 JWT 包含 JWKS 文件中不存在的“kid”标头值 |
| sasl.oauthbearer.token.endpoint.url                 | OAuth/OIDC 身份提供商的 URL。<br>如果 URL 基于 HTTP(S)，则它是颁发者的令牌端点 URL，将根据 sasl.jaas.config 中的配置发出登录请求。<br>如果 URL 是基于文件的，则它指定一个包含 OAuth/OIDC 身份提供商颁发的访问令牌（JWT 序列化形式）的文件，用于授权。 |
| security.protocol                                   | 用于与broker通信的协议，默认PLAINTEXT。可选值为：PLAINTEXT、SSL、SASL_PLAINTEXT、SASL_SSL。 |
| ssl.enabled.protocols                               | 为 SSL 连接启用的协议列表，默认"TLSv1.2,TLSv1.3"。使用 Java 11 或更高版本运行时，默认值为“TLSv1.2、TLSv1.3”，否则为“TLSv1.2”。使用 Java 11 的默认值，如果客户端和服务器都支持 TLSv1.3，则首选 TLSv1.3，否则回退到 TLSv1.2（假设两者至少支持 TLSv1.2）。对于大多数情况，此默认值应该没问题。另请参阅“ssl.protocol”的配置文档。 |
| ssl.keystore.type                                   | 密钥存储文件的文件格式，默认JKS。这对于客户端是可选的。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| ssl.protocol                                        | 用于生成 SSLContext 的 SSL 协议，默认TLSv1.3。使用 Java 11 或更高版本运行时，默认值为“TLSv1.3”，否则为“TLSv1.2”。该值对于大多数用例来说应该没问题。最新 JVM 中允许的值为“TLSv1.2”和“TLSv1.3”。较旧的 JVM 可能支持“TLS”、“TLSv1.1”、“SSL”、“SSLv2”和“SSLv3”，但由于已知的安全漏洞，不鼓励使用它们。使用此配置和“ssl.enabled.protocols”的默认值，如果服务器不支持“TLSv1.3”，客户端将降级到“TLSv1.2”。如果此配置设置为“TLSv1.2”，客户端将不会使用“TLSv1.3”，即使它是 ssl.enabled.protocols 中的值之一，并且服务器仅支持“TLSv1.3”。 |
| ssl.provider                                        | 用于 SSL 连接的安全提供程序的名称。缺省值是 JVM 的缺省安全提供程序。 |
| ssl.truststore.type                                 | 信任存储文件的文件格式。默认值JKS。默认的“ssl.engine.factory.class”当前支持的值是[JKS，PKCS12，PEM]。 |
| admin.timeout.ms                                    | 管理任务超时时间配置，例如检测新主题。默认60000 (1 分钟)     |
| auto.include.jmx.reporter                           | 已弃用。是否自动包含 JmxReporter，即使它没有在 中列出`metric.reporters`。此配置将在 Kafka 4.0 中删除，用户应添加`org.apache.kafka.common.metrics.JmxReporter`该配置`metric.reporters`以启用 JmxReporter。 |
| enabled                                             | 是否复制源>目标。默认值true                                  |
| forwarding.admin.class                              | 扩展 ForwardingAdmin 以定义自定义群集资源管理（主题、配置等）的类。该类必须具有一个带签名`(Map config)`的构造函数，该构造函数用于配置 KafkaAdminClient，如有必要，也可用于为外部系统配置客户端。默认值`org.apache.kafka.clients.admin.ForwardingAdmin` |
| metric.reporters                                    | 要用作指标报告器的类的列表。实现该接口`org.apache.kafka.common.metrics.MetricsReporter`允许插入将收到新指标创建通知的类。始终包含 JmxReporter 以注册 JMX 统计信息。 |
| replication.policy.class                            | 定义远程主题命名约定的类。默认值`org.apache.kafka.connect.mirror.DefaultReplicationPolicy` |
| replication.policy.internal.topic.separator.enabled | 是否使用 replication.policy.separator 来控制用于检查点和偏移同步的主题的名称。默认情况下，这些主题名称中使用自定义分隔符;但是，如果从不允许自定义这些主题名称的旧版本升级 MirrorMaker 2，则可能需要将此属性设置为“false”，以便继续对这些主题使用相同的名称。 |
| replication.policy.separator                        | 远程主题命名约定中使用的分隔符。默认值"."                    |
| sasl.kerberos.kinit.cmd                             | Kerberos kinit 命令路径。默认/usr/bin/kinit                  |
| sasl.kerberos.min.time.before.relogin               | 刷新尝试之间的登录线程休眠时间。默认60000                    |
| sasl.kerberos.ticket.renew.jitter                   | 添加到更新时间的随机抖动的百分比。默认0.05                   |
| sasl.kerberos.ticket.renew.window.factor            | 登录线程将休眠，直到达到从上次刷新到票证到期的指定时间窗口因子，此时它将尝试更新票证。默认0.8 |
| sasl.login.connect.timeout.ms                       | 外部身份验证提供程序连接超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.read.timeout.ms                          | 外部身份验证提供程序读取超时的（可选）值（以毫秒为单位）。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.buffer.seconds                   | 刷新凭证时在凭证过期前维持的缓冲时间量（以秒为单位）。如果刷新发生的时间比缓冲秒数更接近到期，则刷新将向上移动以维持尽可能多的缓冲时间。合法值介于 0 到 3600（1 小时）之间；如果未指定值，则使用默认值 300（5 分钟）。如果该值和 sasl.login.refresh.min.period.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.min.period.seconds               | 登录刷新线程在刷新凭据之前等待的所需最短时间（以秒为单位）。合法值介于 0 到 900（15 分钟）之间；如果未指定值，则使用默认值 60（1 分钟）。如果该值和 sasl.login.refresh.buffer.seconds 的总和超过凭证的剩余生命周期，则它们都会被忽略。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.factor                    | 登录刷新线程将休眠，直到达到相对于凭证生命周期的指定窗口因子，此时它将尝试刷新凭证。合法值介于 0.5 (50%) 和 1.0 (100%)（含）之间；如果未指定值，则使用默认值 0.8 (80%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.refresh.window.jitter                    | 相对于添加到登录刷新线程睡眠时间的凭证生命周期的最大随机抖动量。合法值介于 0 和 0.25 (25%) 之间（含）；如果未指定值，则使用默认值 0.05 (5%)。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.max.ms                     | 尝试登录外部身份验证提供程序之间的最长等待时间（可选）值（以毫秒为单位），默认10000(10秒)。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.login.retry.backoff.ms                         | 尝试登录外部身份验证提供程序之间的初始等待时间（可选）值（以毫秒为单位）。Login 使用指数退避算法，初始等待基于 sasl.login.retry.backoff.ms 设置，尝试之间的等待长度将加倍，直至达到 sasl.login.retry.backoff.max 指定的最大等待长度。毫秒设置。目前仅适用于 OAUTHBEARER。 |
| sasl.oauthbearer.clock.skew.seconds                 | 用于允许 OAuth/OIDC 身份提供程序和broker的时间差异，以秒为单位的（可选）值，默认30秒 |
| sasl.oauthbearer.expected.audience                  | broker的（可选）逗号分隔设置，用于验证 JWT 是否是为预期受众之一颁发的。将检查 JWT 是否有标准 OAuth“aud”声明，如果设置了此值，broker将匹配 JWT 的“aud”声明中的值，以查看是否存在完全匹配。如果不匹配，代理将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.expected.issuer                    | broker用于验证 JWT 是否由预期发行者创建的（可选）设置。将检查 JWT 是否有标准 OAuth“iss”声明，如果设置了该值，broker会将其与 JWT 的“iss”声明中的内容完全匹配。如果不匹配，broker将拒绝 JWT，身份验证将失败。 |
| sasl.oauthbearer.jwks.endpoint.refresh.ms           | broker在刷新其 JWKS（JSON Web 密钥集）缓存之间等待的（可选）值（以毫秒为单位），默认3600000 (1 H)，该缓存包含用于验证 JWT 签名的密钥。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms | 尝试从外部身份验证提供程序检索 JWKS（JSON Web 密钥集）之间的最长等待时间（可选）值（以毫秒为单位），默认10000 (10 秒)。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.jwks.endpoint.retry.backoff.ms     | 来自外部身份验证提供程序的 JWKS（JSON Web 密钥集）检索尝试之间的初始等待时间（可选）值（以毫秒为单位），默认100ms。JWKS 检索使用指数退避算法，并根据 sasl.oauthbearer.jwks.endpoint.retry.backoff.ms 设置进行初始等待，并且两次尝试之间的等待长度将加倍，直至达到 sasl.oauthbearer.jwks 指定的最大等待长度sasl.oauthbearer.jwks.endpoint.retry.backoff.max.ms 设置。 |
| sasl.oauthbearer.scope.claim.name                   | 该范围的 OAuth 声明通常被命名为“scope”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的范围提供不同的名称。 |
| sasl.oauthbearer.sub.claim.name                     | 主题的 OAuth 声明通常命名为“sub”，但如果 OAuth/OIDC 提供程序对该声明使用不同的名称，则此（可选）设置可以为 JWT 负载声明中包含的主题提供不同的名称。 |
| ssl.cipher.suites                                   | 密码套件列表。这是身份验证、加密、MAC 和密钥交换算法的命名组合，用于协商使用 TLS 或 SSL 网络协议的网络连接的安全设置。默认情况下，支持所有可用的密码套件。 |
| ssl.endpoint.identification.algorithm               | 使用服务器证书验证服务器主机名的终结点标识算法。默认`https`  |
| ssl.engine.factory.class                            | 类型为 org.apache.kafka.common.security.auth.SslEngineFactory 的类，用于提供 SSLEngine 对象。默认值为 org.apache.kafka.common.security.ssl.DefaultSslEngineFactory |
| ssl.keymanager.algorithm                            | 密钥管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的密钥管理器工厂算法SunX509。 |
| ssl.secure.random.implementation                    | 用于 SSL 加密操作的 SecureRandom PRNG 实现。                 |
| ssl.trustmanager.algorithm                          | 信任管理器工厂用于 SSL 连接的算法。缺省值是为 Java 虚拟机配置的信任管理器工厂算法PKIX。 |
| name                                                | 用于此连接器的全局唯一名称。                                 |
| connector.class                                     | 此连接器的类的名称或别名。必须是 org.apache.kafka.connect.connector.connector 的子类。如果连接器是 org.apache.kafka.connect.file.FileStreamSinkConnector，则可以指定此全名，或使用“FileStreamSink”或“FileStreamSinkConnector”使配置更短一些 |
| tasks.max                                           | 用于此连接器的最大任务数。默认1                              |
| key.converter                                       | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中键的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| value.converter                                     | Converter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中的值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。 |
| header.converter                                    | HeaderConverter 类用于在 Kafka Connect 格式和写入 Kafka 的序列化形式之间进行转换。这控制写入 Kafka 或从 Kafka 读取的消息中标头值的格式，并且由于它独立于连接器，因此允许任何连接器使用任何序列化格式。常见格式的示例包括 JSON 和 Avro。默认情况下，SimpleHeaderConverter 用于将标头值序列化为字符串，并通过推断架构来反序列化它们。 |
| config.action.reload                                | 当外部配置提供程序的更改导致连接器的配置属性发生更改时，Connect 应对连接器执行的操作。值“none”表示 Connect 将不执行任何操作。“restart”值表示 Connect 应使用更新的配置属性重新启动/重新加载连接器。如果外部配置提供程序指示配置值将来会过期，则实际上可能会在将来安排重新启动。 |
| transforms                                          | 要应用于记录的转换的别名。非空字符串，唯一的转换别名         |
| predicates                                          | 转换使用的谓词的别名。非空字符串，唯一的谓词别名             |
| errors.retry.timeout                                | 重新尝试失败操作的最长持续时间（以毫秒为单位）。默认值为 0，表示不会尝试重试。使用 -1 进行无限次重试。 |
| errors.retry.delay.max.ms                           | 连续重试尝试之间的最大持续时间（以毫秒为单位）。默认60000 (1 分钟)。一旦达到此限制，抖动将添加到延迟中，以防止出现雷鸣般的牛群问题。 |
| errors.tolerance                                    | 在连接器操作期间容忍错误的行为。“none”是默认值，表示任何错误都将导致立即连接器任务失败;“all”更改行为以跳过有问题的记录。 |
| errors.log.enable                                   | 如果为 true，则将每个错误以及失败操作和有问题的记录的详细信息写入 Connect 应用程序日志。默认配置是“false”，因此仅报告不能容忍的错误。 |
| errors.log.include.messages                         | 是否在日志中包含导致失败的连接记录。对于接收器记录，将记录主题、分区、偏移量和时间戳。对于源记录，将记录键和值（及其架构）、所有标头以及时间戳、Kafka 主题、Kafka 分区、源分区和源偏移量。默认情况下，这是“false”，这将阻止将记录键、值和标头写入日志文件。 |
|                                                     |                                                              |



### 9.2、MirrorMaker源配置

下面是用于复制主题的MirrorMaker 源连接器的配置。

| 配置项                                | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| config.properties.blacklist           | 已废弃。请改用 config.properties.exclude 。                  |
| config.properties.exclude             | 不应复制的主题配置属性。支持逗号分隔的属性名称和正则表达式。<br>默认值：follower\.replication\.throttled\.replicas,leader\.replication\.throttled\.replicas,message\.timestamp\.difference\.max\.ms,message\.timestamp\.type,unclean\.leader\.election\.enable,min\.insync\.replicas |
| topics                                | 已废弃。请改用 topics.exclude 。                             |
| topics.exclude                        | 排除的主题。支持逗号分隔的主题名称和正则表达式。排除优先于包含。<br>默认值：.*[\-\.]internal,.*\.replica,__.* |
| add.source.alias.to.metrics           | 已废弃。是否使用源集群别名标记指标。指标具有目标、主题和分区标签。启用此设置后，它将添加源标记。此配置将在 Kafka 4.0 中删除，默认行为将始终具有源标记。 |
| config.property.filter.class          | 要使用的配置属性筛选器。选择要复制的主题配置属性。<br>默认值：org.apache.kafka.connect.mirror.DefaultConfigPropertyFilter |
| consumer.poll.timeout.ms              | 轮询源集群超时时间配置。默认1000 (1 秒)                      |
| offset-syncs.topic.location           | 偏移同步主题的位置（source/target）。默认source。可选值：[source, target] |
| offset-syncs.topic.replication.factor | 偏移同步主题的复制因子。默认3                                |
| offset.lag.max                        | 远程分区在重新同步之前可以有多不同步。默认100                |
| refresh.topics.enabled                | 是否定期检查新主题和分区。默认true                           |
| refresh.topics.interval.seconds       | 主题刷新的频率。默认600秒                                    |
| replication.factor                    | 新创建的远程主题的复制因子。默认2                            |
| sync.topic.acls.enabled               | 是否定期配置远程主题ACL以匹配其对应的上游主题。默认true      |
| sync.topic.acls.interval.seconds      | 主题 ACL 同步的频率。默认600秒                               |
| sync.topic.configs.enabled            | 是否定期配置远程主题以匹配其对应的上游主题。默认true         |
| sync.topic.configs.interval.seconds   | 主题配置同步的频率。默认600秒                                |
| topic.filter.class                    | 主题过滤器使用。选择要复制的主题。默认值：org.apache.kafka.connect.mirror.DefaultTopicFilter |
| use.incremental.alter.configs         | 已废弃。用于同步主题配置的 API。有效值为“requested”、“required”和“never”。默认情况下，设置为“requested”，这意味着 IncrementalAlterConfigs API 用于同步主题配置，如果任何请求收到来自不兼容broker的错误，它将回退到使用已弃用的 AlterConfigs API。如果显式设置为“required”，则在没有回退逻辑的情况下使用 IncrementalAlterConfigs API，如果它从不兼容的broker收到错误，连接器将失败。如果显式设置为“never”，则始终使用 AlterConfig。此设置将被删除，并在 Kafka 4.0 中使用“required”的行为，因此用户应确保目标broker版本至少为 2.3.0 |



### 9.3、MirrorMaker检查点配置

下面是用于发出消费者偏移检查点的 MirrorMaker 2 检查点连接器的配置。

| 配置项                               | 描述                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| groups                               | 要复制的消费者组。支持逗号分隔的组 ID 和正则表达式。默认".*" |
| groups.blacklist                     | 已废弃。请改用 groups.exclude 。                             |
| groups.exclude                       | 排除组。支持逗号分隔的组 ID 和正则表达式。排除优先于包含。默认“console-consumer-.*,connect-.*,__.*” |
| checkpoints.topic.replication.factor | 检查点主题的复制因子。默认3                                  |
| consumer.poll.timeout.ms             | 轮询源集群超时时间配置。默认1000 (1 秒)                      |
| emit.checkpoints.enabled             | 是否将消费者偏移量复制到目标集群。                           |
| emit.checkpoints.interval.seconds    | 检查点的频率。默认60秒                                       |
| group.filter.class                   | 要使用的组筛选器。选择要复制的消费者组。默认org.apache.kafka.connect.mirror.DefaultGroupFilter |
| offset-syncs.topic.location          | 偏移同步主题的位置（source/target）。默认source。可选值：[source, target] |
| refresh.groups.enabled               | 是否定期检查新的消费者组。默认true                           |
| refresh.groups.interval.seconds      | 组刷新的频率。默认600                                        |
| sync.group.offsets.enabled           | 是否定期将转换后的偏移量写入目标集群中的__consumer_offsets主题，只要该组中没有活动消费者连接到目标集群。默认false |
| sync.group.offsets.interval.seconds  | 消费组偏移同步的频率。默认60秒                               |
| topic.filter.class                   | 主题过滤器使用。选择要复制的主题。默认org.apache.kafka.connect.mirror.DefaultTopicFilter |



### 9.4、MirrorMaker 心跳配置

下面是用于检查连接器和集群之间连接的 MirrorMaker 2 心跳配置。

| 配置项                              | 描述                                 |
| ----------------------------------- | ------------------------------------ |
| emit.heartbeats.enabled             | 是否向目标群集发出心跳检测。默认true |
| emit.heartbeats.interval.seconds    | 心跳频率。默认1秒                    |
| heartbeats.topic.replication.factor | 心跳检测主题的复制因子。默认3        |



## 十、系统配置

Kafka 支持一些可以通过 Java 系统属性启用的配置。系统属性通常是通过将 -D 标志传递给运行 Kafka 组件的 Java 虚拟机来设置的。

示例配置：

```
//批量禁用登录模块，多个用","分开
-Dorg.apache.kafka.disallowed.login.modules=com.sun.security.auth.module.JndiLoginModule

//启用登录模块，则重置该配置为空值就可以
-Dorg.apache.kafka.disallowed.login.modules=
```

 以下是受支持的系统属性。

| 配置项                                    | 描述                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| org.apache.kafka.disallowed.login.modules | 此系统属性用于禁用 SASL JAAS 配置中有问题的登录模块使用。该配置从kafka3.4.0开始。此属性接受以逗号分隔的登录模块名称列表。默认情况下，**com.sun.security.auth.module.JndiLoginModule loginModule** 被禁用。<br>我们建议用户验证配置，并且只允许受信任的 JNDI 配置。更多详情[CVE-2023-25194](https://nvd.nist.gov/vuln/detail/CVE-2023-25194). |



## 十一、分层存储配置

下面是分层存储的配置属性。

| 配置项                                                  | 描述                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| log.local.retention.bytes                               | 分区在符合删除条件之前可以增长的本地日志段的最大大小。默认值为 -2，它表示要使用的“log.retention.bytes”值。有效值应始终小于或等于“log.retention.bytes”值。 |
| log.local.retention.ms                                  | 在符合删除条件之前保留本地日志段的毫秒数。默认值为 -2，表示要使用的“log.retention.ms”值。有效值应始终小于或等于“log.retention.ms”值。 |
| remote.log.manager.thread.pool.size                     | 用于复制段、获取远程日志索引和清理远程日志段的计划任务的线程池大小。默认10 |
| remote.log.metadata.manager.class.name                  | “RemoteLogMetadataManager”实现的完全限定类名。默认org.apache.kafka.server.log.remote.metadata.storage.TopicBasedRemoteLogMetadataManager |
| remote.log.metadata.manager.class.path                  | “RemoteLogMetadataManager”实现的类路径。如果指定，RemoteLogMetadataManager 实现及其依赖库将由专用类加载器加载，该类加载器在 Kafka 代理类路径之前搜索此类路径。此参数的语法与标准 Java 类路径字符串相同。 |
| remote.log.metadata.manager.impl.prefix                 | 用于将属性传递给 RemoteLogMetadataManager 实现的前缀。默认值是“rlmm.config.”。 |
| remote.log.metadata.manager.listener.name               | 本地broker的侦听器名称，如果 RemoteLogMetadataManager 实现需要，它应连接到该broker。 |
| remote.log.reader.max.pending.tasks                     | 最大远程日志读取器线程池任务队列大小。默认100。如果任务队列已满，则提取请求将出现错误。 |
| remote.log.reader.threads                               | 为处理远程日志读取而分配的线程池的大小。默认10               |
| remote.log.storage.manager.class.name                   | “远程存储管理器”实现的完全限定类名。                         |
| remote.log.storage.manager.class.path                   | “远程存储管理器”实现的类路径。如果指定，RemoteStorageManager 实现及其依赖库将由专用类加载器装入，该类加载器在 Kafka 代理类路径之前搜索此类路径。此参数的语法与标准 Java 类路径字符串相同。 |
| remote.log.storage.manager.impl.prefix                  | 用于将属性传递给远程存储管理器实现的前缀。默认值是“rsm.config.”。 |
| remote.log.storage.system.enable                        | 是否在broker中启用分层存储功能。默认值为false。当它是true时，broker将启动分层存储功能所需的所有服务。 |
| remote.log.manager.task.interval.ms                     | 远程日志管理器运行计划任务（如复制段）和清理远程日志段的时间间隔。默认30000（30秒） |
| remote.log.metadata.custom.metadata.max.bytes           | broker应从远程存储插件接受的自定义元数据的最大大小（以字节为单位）。默认128。如果自定义元数据超过此限制，则不会存储更新的段元数据，会尝试删除复制的数据，并且该主题分区的远程复制任务将停止并显示错误。 |
| remote.log.metadata.consume.wait.ms                     | 等待本地使用者接收已发布事件的时间量（以毫秒为单位）。默认120000 (2 分钟) |
| remote.log.metadata.initialization.retry.interval.ms    | 重试远程日志元数据管理器资源初始化的重试间隔（以毫秒为单位）。默认100 |
| remote.log.metadata.initialization.retry.max.timeout.ms | 重试远程日志元数据管理器资源初始化的最长时间（以毫秒为单位）。默认120000 (2 分钟)。当总重试间隔达到此超时时，初始化将被视为失败，broker开始关闭。 |
| remote.log.metadata.topic.num.partitions                | 远程日志元数据主题的分区数。默认50                           |
| remote.log.metadata.topic.replication.factor            | 远程日志元数据主题的复制因子。默认3                          |
| remote.log.metadata.topic.retention.ms                  | 远程日志元数据主题的保留时间（以毫秒为单位）。默认值：-1，表示无限制。用户可以根据其用例配置此值。为避免任何数据丢失，此值应大于集群中启用了分层存储的任何主题的最长保留期。 |



## 十二、参考资料

[Apache Kafka文档](https://kafka.apache.org/documentation/)
