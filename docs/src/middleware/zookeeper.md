---
# icon: lock
date: 2018-01-05
article: false
---

# Zookeeper入门

> 小郭写文章的目的是总结复盘学过的知识点，方便以后查阅。
>
> 如果本文对您也有帮助，可以动动您的小手点个关注和赞再走呀。

## 一、前言

在小郭的工作经历中，每个公司基本都使用到了zookeeper。趁着最近有空，小郭想总结一下zookeeper的基本知识。

<font color="red">如果你没有使用过zookeeper，这篇文章能带你快速入门。</font>

<font color="red">如果你已经在用zookeeper，这篇文章绝对能帮你复习相关基础知识，用于面试。</font>



## 二、zookeeper简介

Apache ZooKeeper 是 Apache 软件基金会旗下的开源项目，是用于分布式应用程序的分布式开源协调服务。它公开了一组简单的构件，分布式应用程序可以在这些构件的基础上进行构建，以实现更高级别的同步、配置维护以及组和命名服务。它被设计为易于编程，并使用以熟悉的文件系统目录树结构为基础的数据模型。它在 Java环境 中运行。

**ZooKeeper 的设计：** ZooKeeper 允许分布式进程通过共享的分层命名空间相互协调，该命名空间的组织方式类似于标准文件系统，命名空间由文件和目录组成，在 ZooKeeper 术语中称为` znodes`。与专为存储而设计的传统文件系统不同，ZooKeeper 数据保存在内存中，这意味着 ZooKeeper 可以实现高吞吐量和低延迟。ZooKeeper 的设计非常重视高性能、高可靠性、严格有序的访问。ZooKeeper 的性能优秀，因此它完全可以用于大型分布式系统. 可靠性方面使其不会成为单点故障。严格有序的访问意味着可以在客户端实现复杂的同步原语。

下面针对zookeeper的一些特性展开介绍。

### 1、集群角色

通常在分布式系统中，构成一个集群中的每一台机器都有一个自己的角色，最典型的集群模式就是 master/slave (主备模式)。在这种模式中，我们把能够处理写操作请求的机器成为 Master ，把所有通过异步复制方式获取最新数据，并提供读请求服务的机器成为 Slave 机器。

**而 ZooKeeper 没有采用这种方式**，ZooKeeper 引用了 Leader、Follower和 Observer 三个角色。ZooKeeper 集群中的所有机器通过选举的方式选出一个 Leader，Leader 可以为客户端提供读服务和写服务。除了 Leader 外，集群中还包括了 Follower 和 Observer 。Follower 和 Observer 都能够提供读服务，唯一区别在于，***Observer \*** 不参与 Leader 的选举过程，也不写操作的"过半写成功"策略，因此 Observer 可以在不影响写性能的情况下提升集群的读性能。

### 2、原子性
在Zookeeper中要么更新成功，要么失败，没有部分结果。


### 3、高性能

*在“读多写少的”工作负载中，Zookeeper的速度非常快。ZooKeeper 应用程序在数千台机器上运行，在读取比写入更常见的情况下，它的性能最佳，比率约为 10：1。

<font color="red">雅虎研究院的 ZooKeeper 开发团队的测试结果表明，Zookeeper的性能确实强悍。</font>

所使用的测试环境：

- ZooKeeper release 3.2
- 服务器 双核 2GHz Xeon, 两块 15K RPM 的 SATA, 一块作为 ZK 的日志, 快照写到系统盘
- 读写请求都是 1K
- "Servers" 表示提供服务的 ZK 服务器数量
- 接近 30 台其它服务器用来模拟客户端
- leader 配置成不接受客户端连接

![](http://cdn.gydblog.com/images/middleware/zk-4.jpg)



在读取操作超过写入操作的应用程序中，它的效率高。而写入操作由于涉及同步所有服务器的状态，性能会有一定影响。

### 4、高可靠

就像它协调的分布式应用程序一样，ZooKeeper 的部署本身也是多节点的，其中有且仅有一个leader节点，组成 ZooKeeper 集群的服务器相互保持了解，并且它们在持久性存储中维护状态的内存映像，以及事务日志和快照信息。

通常情况下，只要大多数服务器可用，ZooKeeper 服务就可用。ZooKeeper 集群中，建议部署奇数个 ZooKeeper节点（或进程） —— 大多数情况下，3个节点就足够了。节点个数并不是越多越好 —— 节点越多，节点间通信所需的时间就会越久，选举 Leader 时需要的时间也会越久。

![](http://cdn.gydblog.com/images/middleware/zk-1.jpg)

如上图所示，客户端只会连接到单个 ZooKeeper 服务器，在客户端维护了一个 TCP 连接，通过该连接发送请求、获取响应、获取监视事件和发送检测信号。如果与服务器的 TCP 连接中断，客户端将连接到其他服务器。

下面是官方对可靠性进行测试的数据结果：

> 运行了一个由 7 台机器组成的 ZooKeeper 服务。将写入百分比保持在恒定的 30%

![](http://cdn.gydblog.com/images/middleware/zk-5.jpg)

从上面的图中可以看出一些重要的观察结果。首先，如果`followers`失败并迅速恢复，那么即使发生故障，ZooKeeper 也能够维持高吞吐量。但也许更重要的是，领导者选举算法允许系统恢复得足够快，以防止吞吐量大幅下降。根据我们的观察，ZooKeeper 只需不到 200 毫秒即可选出新的`leader `。第三，随着followers的恢复，一旦他们开始处理请求，ZooKeeper 就能够再次提高吞吐量。

### 5、顺序一致性

Zookeeper保证 来自客户端的更新将按发送顺序处理。

ZooKeeper 在每次更新时都会使用一个数字来标记，该数字反映了所有 ZooKeeper 事务的顺序。

### 6、数据模型和分层命名空间

**数据模型**

ZooKeeper 提供的命名空间与标准文件系统的命名空间非常相似。名称是一系列由斜杠 （/） 分隔的路径元素。ZooKeeper 命名空间中的每个节点都有路径标识。

**分层命名空间**

zookeeper的分层命名空间图：

![](http://cdn.gydblog.com/images/middleware/zk-2.jpg)

**节点和临时节点**

与标准文件系统不同，ZooKeeper 命名空间中的每个节点都可以有与之关联的数据以及子节点。这就像有一个文件系统，允许文件也是一个目录。

ZooKeeper 被设计用于存储协调数据：状态信息、配置、位置信息等，因此每个节点存储的数据通常很小，在字节到千字节的范围内。我们使用官方术语 *znode* 来表示一个 ZooKeeper的 数据节点。

Znodes 维护一个统计信息结构，其中包括数据更改、ACL 更改和时间戳的版本号，以允许缓存验证和协调更新。每当 znode 的数据发生变化时，版本号就会增加。例如，每当客户端检索数据时，它也会接收数据的版本。存储在命名空间中每个 znode 的数据都是以原子方式读取和写入的。读取获取与 znode 关联的所有数据字节，写入替换所有数据。每个节点都有一个访问控制列表 （ACL），用于限制谁可以执行哪些操作。

ZooKeeper 也有临时节点的概念。只要创建 znode 的会话处于活动状态，这些 znode 就存在。会话结束时，znode 将被删除。



### 7、watch机制

> watch：数据变更监听机制



客户端可以在 znode 上设置监听器，当 znode 发生变化时，将通知客户端并删除监听器，客户端会收到一个数据包，表示 znode 的数据发生了变化。

在`3.6.0`及以后的zookeeper版本中，客户端还可以在 znode 上设置永久的递归监听，这些监听在触发时不会被删除，并且会以递归方式触发已注册的 znode 以及任何子 znode 上的更改。

如果客户端与其中一个 ZooKeeper 服务器之间的连接断开，客户端将收到本地通知。

### 8、简单API接入

> API主要是围绕对znode 的crud操作

ZooKeeper 的设计目标之一是提供一个非常简单的编程接口，而且有严格的ACL（权限）控制。因此，它仅支持以下操作：

- *create* : 在树中的某个位置创建znode
- *delete* : 删除一个znode
- *exists* : 判断树的某个位置是否存在节点
- *get data* : 读取某个节点的数据
- *set data* : 将数据写入某个节点
- *get children* : 检索节点的子节点列表
- *sync* : 等待数据传播

### 9、服务组件



![](http://cdn.gydblog.com/images/middleware/zk-3.jpg)

如上图所示，ZooKeeper Components 展现了ZooKeeper 服务的高级组件。除Request Processor（请求处理器）外，构成 ZooKeeper 服务的每个服务器都复制其自己的每个组件的副本。其中有个重要的高级组件是Replicated Database。

**Replicated Database**

Replicated Database是包含整个数据树的内存数据库。每一个更新操作都会先序列化到磁盘, 然后才会应用到内存数据库。

读写请求的区别如下：

- Read Request - ZK 服务器根据其服务内本地内存数据库来响应
- Write Request - ZK 服务器会将来自客户端的所有写请求转发到角色为 leader 的 ZK 服务器(leader 只有一个, 其它称为 follower或者Observer) 来写, 然后同步给 follower。



## 三、常见应用场景

分布式协调 kafka、dubbo都在使用它！

## 四、版本管理

### 1、版本管理策略

Apache ZooKeeper 社区同时支持两个发布分支：**稳定**版和**当前**版。ZooKeeper **的稳定**版本为 3.8.x，**当前**版本为 3.9.x。一旦新的次要版本发布，**稳定**版本预计将很快退役，大约半年后将宣布生命周期结束。在半年的宽限期内，预计只会发布该版本的安全修复和关键修复。在宣布 EoL 后，社区不再提供进一步的补丁。

所有 ZooKeeper 版本都可以从官方 Apache 存档中访问。

### 2、版本历史

> Apache ZooKeeper 3.9.1 是当前的版本，3.8.3 是最新的稳定版本。

[ZooKeeper各版本介绍戳这里](https://zookeeper.apache.org/releases.html)

小郭整理了每个已发布版本的信息：

| 版本                                                         | 发行时间   | 备注                                                         |
| ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| [ZooKeeper 3.9.1](https://zookeeper.apache.org/doc/r3.9.1/index.html) | 2023.10.09 | 该版本是 3.9 分支的错误修复版本                              |
| [ZooKeeper 3.9.0](https://zookeeper.apache.org/doc/r3.9.0/index.html) | 2023.08.03 | 该版本是 3.9 分支的第一个版本。 这是一个主要版本，它引入了许多新功能，最值得注意的是：<br>1）用于拍摄快照和流出数据的管理服务器 API<br/>2）传达触发 WatchEvent 触发的 Zxid<br/>3）TLS - 客户端信任/密钥存储的动态加载<br/>4）添加 Netty-TcNative OpenSSL 支持<br/>5）向 Zktreeutil 添加 SSL 支持<br/>6）提高 syncRequestProcessor 性能<br/>7）更新所有第三方依赖项，以消除所有已知的 CVE。 |
| [ZooKeeper 3.8.3](https://zookeeper.apache.org/doc/r3.8.3/index.html) | 2023.10.09 | 该版本是 3.8 分支的错误修复版本。                            |
| [ZooKeeper 3.8.2](https://zookeeper.apache.org/doc/r3.8.2/index.html) | 2023.07.18 | 该版本是 3.8 分支的错误修复版本。                            |
| [ZooKeeper 3.8.1](https://zookeeper.apache.org/doc/r3.8.1/index.html) | 2023.01.30 | 该版本是 3.8 分支的错误修复版本。                            |
| [ZooKeeper 3.8.0](https://zookeeper.apache.org/doc/r3.8.0/index.html) | 2022.03.07 | 该版本是 3.8 分支的第一个版本。 这是一个主要版本，它引入了许多新功能，最值得注意的是：<br>1）将日志记录框架从 Apache Log4j1 迁移到 LogBack<br/>2）从文件中读取密钥/信任存储密码（以及其他与安全相关的改进）<br/>3）恢复了对OSGI的支持<br/>4）减少了 Prometheus 指标对性能的影响<br/>5）官方支持 JDK17（所有测试均通过）<br/>6）更新所有第三方依赖项，以消除所有已知的 CVE。 |
| [ZooKeeper 3.7.2](https://zookeeper.apache.org/doc/r3.7.2/index.html) | 2023.10.09 | 该版本是 3.7 分支的错误修复版本。                            |
| [ZooKeeper 3.7.1](https://zookeeper.apache.org/doc/r3.7.1/index.html) | 2022.05.12 | 该版本是 3.7 分支的错误修复版本。<br/>它修复了 64 个问题，包括多个 CVE 修复。 |
| [ZooKeeper 3.7.0](https://zookeeper.apache.org/doc/r3.7.0/index.html) | 2021.03.27 | 该版本是 3.7 分支的第一个版本。 它引入了许多新功能，特别是：<br>1）从 Java 启动 ZooKeeper 服务器的 API （ZOOKEEPER-3874);<br/>2）配额强制执行 （ZOOKEEPER-3301);<br/>3）仲裁 SASL 身份验证中的主机名规范化 （ZOOKEEPER-4030);<br/>4）支持 BCFKS 密钥/信任存储格式 （ZOOKEEPER-3950);<br/>5）强制身份验证方案的选择 （ZOOKEEPER-3561);<br/>6）“whoami”API 和 CLI 命令 （ZOOKEEPER-3969);<br/>7）禁用摘要式身份验证的可能性 （ZOOKEEPER-3979);<br/>8）多个 SASL“超级用户”（ZOOKEEPER-3959);<br/>9）快速跟踪受限制的请求 （ZOOKEEPER-3683);<br/>10）其他安全指标 （ZOOKEEPER-3978);<br/>11）C 和 Perl 客户端中的 SASL 支持（ZOOKEEPER-1112、ZOOKEEPER-3714）;<br/>12）新的 zkSnapshotComparer.sh 工具（ZOOKEEPER-3427);<br/>13）关于如何使用 YCSB 工具对 ZooKeeper 进行基准测试的说明 （ZOOKEEPER-3264）。<br/><br/>来自 3.5 和 3.6 分支的 ZooKeeper 客户端与 3.7 服务器完全兼容。<br/>从 3.6.x 到 3.7.0 的升级可以照常执行，不需要特别的额外升级过程。<br/>ZooKeeper 3.7.0 客户端与 3.5 和 3.6 服务器兼容，只要您不使用不存在这些版本的新 API。 |
| [ZooKeeper 3.6.4](https://zookeeper.apache.org/doc/r3.6.4/index.html) | 2022.12.30 | 该版本是 3.6 分支的最后一个错误修复版本。<br/>它修复了 42 个问题，包括 CVE 修复、log4j1 删除（从现在开始使用 reload4j）<br/>和各种其他错误修复（例如快照、SASL 和 C 客户端相关修复）。 |
| [ZooKeeper 3.6.3](https://zookeeper.apache.org/doc/r3.6.3/index.html) | 2021.04.13 | 该版本是 3.6 分支的错误修复版本。<br/>它修复了 52 个问题，包括多个 CVE 修复。 |
| [ZooKeeper 3.6.2](https://zookeeper.apache.org/doc/r3.6.2/index.html) | 2020.09.09 | 该版本是 3.6 分支的错误修复版本。<br/>这是一个次要版本，它修复了一些关键问题，并带来了一些依赖项升级。 |
| [ZooKeeper 3.6.1](https://zookeeper.apache.org/doc/r3.6.1/index.html) | 2020.04.30 | 该版本是 3.6 分支的第二个版本。<br/>这是一个错误修复版本，它修复了与为 ZooKeeper 3.5 构建的应用程序的一些兼容性问题。从 3.5.7 到 3.6.1 的升级可以照常执行，不需要特别的额外升级过程。ZooKeeper 3.6.1 客户端与 3.5 服务器兼容，只要您不使用 3.5 中不存在的新 API。 |
| [ZooKeeper 3.6.0](https://zookeeper.apache.org/doc/r3.6.0/index.html) | 2020.03.04 | 该版本是 3.6 分支的第一个版本。<br/>它带来了许多新功能，并围绕性能和安全性进行了改进。它还在客户端引入了新的 API。<br/>来自 3.4 和 3.5 分支的 ZooKeeper 客户端与 3.6 服务器完全兼容。从 3.5.7 到 3.6.0 的升级可以照常执行，不需要特别的额外升级过程。ZooKeeper 3.6.0 客户端与 3.5 服务器兼容，只要您不使用 3.5 中不存在的新 API。 |
| [ZooKeeper 3.5.10](https://zookeeper.apache.org/doc/r3.5.10/index.html) | 2022.06.04 | 该版本是 3.5 分支的最后一个错误修复版本，因为 3.5 是自 2022.6.01起的 EoL。 它修复了 4 个问题，包括 CVE 修复、log4j1 删除（从现在开始使用 reload4j ） 和各种其他错误修复（线程泄漏、数据损坏、快照和 SASL 相关修复）。 |
| [ZooKeeper 3.5.9](https://zookeeper.apache.org/doc/r3.5.9/index.html) | 2021.01.15 | 该版本是 3.5 分支的错误修复版本。<br/>它修复了 25 个问题，包括多个 CVE 修复。 |
| [ZooKeeper 3.5.8](https://zookeeper.apache.org/doc/r3.5.8/index.html) | 2020.05.11 | 该版本是 3.5 分支的错误修复版本。<br/>它修复了 24 个问题，包括第三方 CVE 修复、几个与领导者选举相关的修复以及与针对早期 3.5 客户端库构建的应用程序的兼容性问题（通过恢复一些非公共 API）。 |
| [ZooKeeper 3.5.7](https://zookeeper.apache.org/doc/r3.5.7/index.html) | 2020.02.14 | 该版本是 3.5 分支的错误修复版本。 它修复了 25 个问题，包括第三方 CVE 修复、潜在的数据丢失和潜在的脑裂（如果存在一些罕见情况）。 |
| ZooKeeper 3.5.6                                              | 2019.10.19 | 该版本是 3.5 分支的错误修复版本。 它修复了 29 个问题，包括 CVE 修复、主机名解析问题和可能的内存泄漏。 文档找不到啦！ |
| [ZooKeeper 3.5.5](https://zookeeper.apache.org/doc/r3.5.5/index.html) | 2019.05.20 | 该版本是3.5 分支的第一个稳定版本。建议的最低 JDK 版本现在为 1.8。此版本被认为是 3.4 稳定分支的后续版本，建议用于生产。从此版本开始，apache-zookeeper-X.Y.Z.tar.gz 是标准的纯源代码版本， apache-zookeeper-X.Y.Z-bin.tar.gz 是包含二进制文件的方便压缩包<br/>它包含 950 个提交，解决了 744 个问题，修复了 470 个错误，并包括以下新功能：<br> 1）动态重配置 <br> 2）本地会话<br> 3）新节点类型：容器、TTL<br> 4）对原子广播协议的 SSL 支持<br> 5）能够删除观察程序 <br> 6）多线程提交处理器 <br> 7）升级到 Netty 4.1 <br> 8）Maven 构建<br> |
| [ZooKeeper 3.5.4-beta](https://zookeeper.apache.org/doc/r3.5.4-beta/index.html) | 2018.05.17 | 3.5.4-beta 是计划中的 3.5 版本系列中的第二个测试版，之后将发布稳定的 3.5 版本。它包括 113 个错误修复和改进。版本 3.5.3 添加了新功能 ZOOKEEPER-2169“启用使用 TTL 创建节点”。在实施 TTL 节点时存在重大疏忽。每个服务器的会话 ID 生成器都以高字节中配置的服务器 ID 为种子。TTL 节点在临时所有者中使用时使用最高位来表示 TTL 节点。这意味着创建临时节点的服务器 ID > 127 将始终将这些节点视为 TTL 节点（TTL 本质上是一个随机数）。ZOOKEEPER-2901 修复了该问题。默认情况下，TTL 处于禁用状态，现在必须在 zoo .cfg 中启用。启用 TTL 节点后，最大服务器 ID 将从 255 更改为 254。 |
| [ZooKeeper 3.5.3-beta](https://zookeeper.apache.org/doc/r3.5.3-beta/index.html) | 2017.04.17 | 3.5.3-beta 是计划中的 3.5 版本线中的第一个测试版，之后将发布稳定的 3.5 版本。它包括 76 个错误修复和改进。此版本包括有关动态重新配置 API 的重要安全修复、对测试基础架构的改进以及 TTL 节点等新功能。 |
| [ZooKeeper 3.5.2-alpha](https://zookeeper.apache.org/doc/r3.5.2-alpha/index.html) | 2016.07.20 | 这是一个 alpha 版本，包含许多错误修复和改进。                |
| [ZooKeeper 3.5.1-alpha](https://zookeeper.apache.org/doc/r3.5.1-alpha/index.html) | 2015.08.31 | 这是一个 alpha 版本，包含许多错误修复和改进。它还引入了一些新功能，包括容器 znodes 和对客户端-服务器通信的 SSL 支持。 |
| [ZooKeeper 3.5.0-alpha](https://zookeeper.apache.org/doc/r3.5.0-alpha/index.html) | 2014.08.06 | 此版本是 alpha 版本，包含许多改进、新功能、错误修复和优化。  |
| [ZooKeeper 3.4.14](https://zookeeper.apache.org/doc/r3.4.14/index.html) | 2019.04.02 | 这是一个错误修复版本。它修复了 8 个问题，主要是构建/单元测试问题、由 OWASP、NPE 标记的依赖项更新和名称解析问题。其中，它还支持实验性的 Maven 构建和基于 Markdown 的文档生成。 |
| [ZooKeeper 3.4.13](https://zookeeper.apache.org/doc/r3.4.13/index.html) | 2018.07.15 | 这是一个错误修复版本。它修复了 17 个问题，包括 ZOOKEEPER-2959 等问题，这些问题在使用观察器时可能导致数据丢失，以及 ZOOKEEPER-2184 阻止 ZooKeeper Java 客户端在动态 IP（容器/云）环境中工作 |
| [ZooKeeper 3.4.12](https://zookeeper.apache.org/doc/r3.4.12/index.html) | 2018.05.01 | 此版本修复了 22 个问题，包括在3.4.11中影响 dataDir 和 dataLogDir 的问题 |
| [ZooKeeper 3.4.11](https://zookeeper.apache.org/doc/r3.4.11/index.html) | 2017.11.09 | 此版本修复了 53 个问题，包括对 Java 9 的支持和其他关键错误修复。**警告**：[ZOOKEEPER-2960](https://issues.apache.org/jira/browse/ZOOKEEPER-2960) 最近在 3.4.11 中被确定为回归，影响了单独的 dataDir 和 dataLogDir 配置参数的规范（与默认值相比，两者都是单个目录）。它将在 3.4.12 中得到解决。 |
| [ZooKeeper 3.4.10](https://zookeeper.apache.org/doc/r3.4.10/index.html) | 2017.03.30 | 此版本修复了 43 个问题，包括通过 SASL 进行安全功能 QuorumPeer 相互身份验证和其他关键错误。 |
| [ZooKeeper 3.4.9](https://zookeeper.apache.org/doc/r3.4.9/index.html) | 2016.09.03 | 此版本修复了许多关键错误和改进。                             |
| [ZooKeeper 3.4.8](https://zookeeper.apache.org/doc/r3.4.8/index.html) | 2016.02.20 | 此版本修复了 9 个问题，最明显的是关闭 ZooKeeper 时的死锁。   |
| [ZooKeeper 3.4.6](https://zookeeper.apache.org/doc/r3.4.6/index.html) | 2014.03.10 | 该版本修复了一个关键错误，该错误可能会阻止服务器加入已建立的集合 |
| [ZooKeeper 3.4.5](https://zookeeper.apache.org/doc/r3.4.5/index.html) | 2012.11.18 | 该版本修复了可能导致客户端连接问题的关键 bug。               |
| [ZooKeeper 3.4.4](https://zookeeper.apache.org/doc/r3.4.4/index.html) | 2012.09.23 | 该版本修复了一个可能导致数据不一致的关键错误。               |
| [ZooKeeper 3.4.3](https://zookeeper.apache.org/doc/r3.4.3/index.html) | 2012.02.13 | 此版本修复 3.4.2 中的关键错误。我们现在正在将此版本升级到测试版，因为对 3.4 分支进行了相当多的错误修复，并且 3.4 版本已经发布了一段时间。 |
| [ZooKeeper 3.4.2](https://zookeeper.apache.org/doc/r3.4.2/index.html) | 2011.12.29 | 此版本修复了 3.4.1 中的一个严重缺陷。<br>请注意，这是一个 alpha 版本，我们不建议将其用于生产。请使用稳定版本行 3.3.* 用于生产用途。 |
| [ZooKeeper 3.4.1](https://zookeeper.apache.org/doc/r3.4.1/index.html) | 2011.12.16 | 此版本修复了 3.4.0 中数据丢失的关键错误                      |
| [ZooKeeper 3.4.0](https://zookeeper.apache.org/doc/r3.4.0/index.html) | 2011.11.22 | 由于数据丢失问题，此版本已从下载页面中删除。请不要使用，版本 3.4.1 现已推出。 |
| [ZooKeeper 3.3.6](https://zookeeper.apache.org/doc/r3.3.6/index.html) | 2012.08.02 | 该版本修复了可能导致数据丢失的关键错误                       |
| [ZooKeeper 3.3.5](https://zookeeper.apache.org/doc/r3.3.5/index.html) | 2012.03.20 | 该版本修复了可能导致数据损坏的关键错误                       |
| [ZooKeeper 3.3.4](https://zookeeper.apache.org/doc/r3.3.4/index.html) | 2011.11.26 | 该版本修复了许多可能导致数据损坏的关键错误                   |
| [ZooKeeper 3.3.3](https://zookeeper.apache.org/doc/r3.3.3/index.html) | 2011.02.27 | 该版本修复了可能导致数据损坏的两个关键错误。它还解决了其他 12 个问题 |
| [ZooKeeper 3.3.2](https://zookeeper.apache.org/doc/r3.3.2/index.html) | 2010.11.11 | 此版本包含许多bug修复                                        |
| ZooKeeper 3.3.1                                              | 2010.05.17 | 文档找不到啦！                                               |
| ZooKeeper 3.3.0                                              | 2010.03.25 | 文档找不到啦！                                               |
| [ZooKeeper 3.2.2](https://zookeeper.apache.org/doc/r3.2.2/index.html) | 2009.12.14 | 此版本包含许多bug修复                                        |
| ZooKeeper 3.2.1                                              | 2009.09.04 | 文档找不到啦！                                               |
| ZooKeeper 3.2.0                                              | 2009.07.08 | 文档找不到啦！                                               |
| [ZooKeeper 3.1.2](https://zookeeper.apache.org/doc/r3.1.2/index.html) | 2009.12.14 | 此版本包含许多bug修复                                        |
| ZooKeeper 3.1.1                                              | 2009.03.27 | 文档找不到啦！                                               |
| ZooKeeper 3.1.0                                              | 2009.02.13 | 文档找不到啦！                                               |
| ZooKeeper 3.0.1                                              | 2008.12.04 | 文档找不到啦！                                               |
| ZooKeeper 3.0.0                                              | 2008.10.27 | 文档找不到啦！                                               |



## 五、环境搭建

## 六、基本知识

[Zookeeper详解（从安装—入门—使用）_〖雪月清〗的博客-CSDN博客](https://blog.csdn.net/qq_52595134/article/details/123467180)

## 七、常见问题

[ZooKeeper 04 - ZooKeeper 集群的节点为什么必须是奇数个 - 瘦风 - 博客园 (cnblogs.com)](https://www.cnblogs.com/shoufeng/p/14314785.html)

## 八、参考资料

[Apache ZooKeeper官方文档](https://zookeeper.apache.org/)

[ZooKeeper 介绍 — zookeeper入门 文档](https://zookeeper.readthedocs.io/zh/latest/intro.html)

## 九、结束语

ZooKeeper 已成功应用于许多工业应用。它在雅虎 用作 `Yahoo！ Message Broker `的协调和故障恢复服务，`Yahoo！ Message Broker `是一个高度可扩展的发布-订阅系统，用于管理数千个用于复制和数据传输的主题。它由` Fetching Service for Yahoo！ `爬网程序使用，它还管理故障恢复。许多雅虎广告系统也使用ZooKeeper来实现可靠的服务。

如果你是在大公司做开发，zookeeper一般有专门的运维人员维护，普通开发人员无需关心。如果你是在小公司的话，zookeeper绝对要会基本操作的！
