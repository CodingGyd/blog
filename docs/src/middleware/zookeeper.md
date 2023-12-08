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

在小郭的工作经历中，每个公司基本都使用到了zookeeper。趁着最近有空，小郭想在此总结一下zookeeper的基本知识。

<font color="red">如果你没有使用过zookeeper，这篇文章能带你快速入门。</font>

<font color="red">如果你已经在用zookeeper，这篇文章绝对能帮你复习相关基础知识，应付面试。</font>



## 二、zookeeper简介

Apache ZooKeeper 是 Apache 软件基金会旗下的开源项目，是用于分布式应用程序的分布式开源协调服务。它公开了一组简单的构件，分布式应用程序可以在这些构件的基础上进行构建，以实现更高级别的同步、配置维护以及组和命名服务。它被设计为易于编程，并使用以熟悉的文件系统目录树结构为基础的数据模型。它在 Java环境 中运行。

**ZooKeeper 的设计：** ZooKeeper 允许分布式进程通过共享的分层命名空间相互协调，该命名空间的组织方式类似于标准文件系统，命名空间由文件和目录组成，在 ZooKeeper 术语中称为` znodes`。与专为存储而设计的传统文件系统不同，ZooKeeper 数据保存在内存中，这意味着 ZooKeeper 可以实现高吞吐量和低延迟。ZooKeeper 的设计非常重视高性能、高可靠性、严格有序的访问。ZooKeeper 的性能优秀，因此它完全可以用于大型分布式系统. 可靠性方面使其不会成为单点故障。严格有序的访问意味着可以在客户端实现复杂的同步原语。

下面针对zookeeper的一些特性展开简介。

### 1、集群角色

通常在分布式系统中，构成一个集群中的每一台机器都有一个自己的角色，最典型的集群模式就是 master/slave (主备模式)。在这种模式中，我们把能够处理写操作请求的机器称为 Master ，把所有通过异步复制方式获取最新数据，并提供读请求服务的机器称为 Slave 机器。

**而 ZooKeeper 没有采用这种方式**，ZooKeeper 引用了 Leader、Follower和 Observer 三个角色。ZooKeeper 集群中的所有机器通过选举的方式选出一个 Leader，Leader 可以为客户端提供读服务和写服务。除了 Leader 外，集群中还包括了 Follower 和 Observer 。Follower 和 Observer 都能够提供读服务，唯一区别在于，***Observer \*** 不参与 Leader 的选举过程，也不参与写操作的"过半写成功"策略，因此 Observer 可以在不影响写性能的情况下提升集群的读性能。

### 2、原子性
在Zookeeper中要么更新成功，要么失败，不存在只产生部分结果的情况。


### 3、高性能

Zookeeper的速度非常快。ZooKeeper 应用程序在数千台机器上运行，尤其是在读多写少的情况下，它的性能最佳，比率约为 10：1。

<font color="red">雅虎研究院的 ZooKeeper 开发团队的测试结果表明，Zookeeper的性能确实强悍。</font>

所使用的测试环境：

- ZooKeeper release 3.2
- 服务器 双核 2GHz Xeon, 两块 15K RPM 的 SATA, 一块作为 ZK 的日志, 快照写到系统盘
- 读写请求都是 1K
- "Servers" 表示提供服务的 ZK 服务器数量
- 接近 30 台其它服务器用来模拟客户端
- leader 配置成不接受客户端连接

![](http://cdn.gydblog.com/images/middleware/zk-4.jpg)



在读多写少的业务场景中，它的效率高。而写入操作由于涉及同步所有服务器的状态，性能会有一定影响。

### 4、高可靠

就像它协调的分布式应用程序一样，ZooKeeper 的部署本身也是多节点的，其中有且仅有一个leader节点，组成 ZooKeeper 集群的服务器之间相互保持了解，并且它们在持久性存储中维护状态的内存映像，以及事务日志和快照信息。

通常情况下，只要大多数服务器可用，ZooKeeper 服务对外就是可用的。ZooKeeper 集群中，建议部署奇数个 ZooKeeper节点（或进程） —— 大多数情况下，3个节点就足够了。节点个数并不是越多越好 —— 节点越多，节点间通信所需的时间就会越久，选举 Leader 时需要的时间也会越久。

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

如上图所示，zookeeper的数据存储是分布在一个树上的不同的节点上的，官方术语使用 *znode* 来表示一个 ZooKeeper的 数据节点。

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

Replicated Database是包含整个znode数据树的内存数据库。每一个更新操作都会先序列化到磁盘, 然后才会应用到内存数据库。

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

> 截止20231207，Apache ZooKeeper 3.9.1 是当前的版本，3.8.3 是最新的稳定版本。

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

> 在真实生产环境中一般都是部署在Linux，因此此处仅记录Linux环境如何搭建。

### 1、环境要求

**1）支持的平台**

ZooKeeper 由多个组件组成。某些组件受到广泛支持，而其他组件仅在较小的平台上受支持。

- **Client** 是 Java 客户端库，应用程序使用它来连接到 ZooKeeper 集合。
- **Server** 是在 ZooKeeper 集合节点上运行的 Java 服务器。
- **Native Client** 是用 C 语言实现的客户端，类似于 Java 客户端，应用程序使用它来连接到 ZooKeeper 集合。
- **Contrib** 是指多个可选的附加组件。

| 操作系统  | Client     | Server     | Native Client | Contrib    |
| --------- | ---------- | ---------- | ------------- | ---------- |
| GNU/Linux | 开发和生产 | 开发和生产 | 开发和生产    | 开发和生产 |
| Solaris   | 开发和生产 | 开发和生产 | 不支持        | 不支持     |
| FreeBSD   | 开发和生产 | 开发和生产 | 不支持        | 不支持     |
| Windows   | 开发和生产 | 开发和生产 | 不支持        | 不支持     |
| Mac OS X  | 仅开发     | 仅开发     | 不支持        | 不支持     |

**2）软件环境**

JDK1.8+(JDK 8 LTS, JDK 11 LTS, JDK 12 - Java 9 、Java 10 不支持)

**3）其它说明**

需要部署奇数个zookeeper服务实例，并且至少需要部署3个zookeeper服务器实例。

建议在单独的服务器上部署zookeeper，不和别的服务公用。

> 在雅虎，ZooKeeper 通常部署在专用的 RHEL 机器上，配备双核处理器、2GB RAM 和 80GB IDE 硬盘。

如果只有两台服务器，则处于以下情况：如果其中一台服务器发生故障，则没有足够的计算机来形成多数仲裁。两台服务器本质上**不如**一台服务器稳定，因为有两个单点故障。

### 2、下载安装包

从Apache官网获取最新的**稳定**版本，[获取链接](http://zookeeper.apache.org/releases.html)

截止20231207，官网最新稳定版本是`Apache ZooKeeper 3.8.3`

![](http://cdn.gydblog.com/images/middleware/zk-6.png)

如上图所示，zookeeper提供了源码包和可执行程序包，如果下载源码包，需要在本地进行编译操作，因此我们直接选择编译好的可执行程序包下载到服务器上。

下载好稳定的 ZooKeeper 版本：

```bash
[root@XX ~]# ls
apache-zookeeper-3.8.3-bin.tar.gz 
```



### 3、修改配置

下载稳定的 ZooKeeper 版本后，将其解压缩并 cd 到根目录

```bash
[root@XX ~]# tar -xvf apache-zookeeper-3.8.3-bin.tar.gz
[root@XX ~]# cd apache-zookeeper-3.8.3-bin
[root@iZbp128dczen7roibd3xciZ apache-zookeeper-3.8.3-bin]# ls
bin  conf  docs  lib  LICENSE.txt  logs  NOTICE.txt  README.md  README_packaging.md
```

根目录下的`conf/`目录就是zookeeper的配置文件目录了，cd到`conf/`目录

```bash
[root@XX apache-zookeeper-3.8.3-bin]# cd conf/
[root@XX conf]# ls
configuration.xsl  logback.xml  zoo_sample.cfg
```

可以看到zookeeper给我们提供了一个配置模板`zoo_sample.cfg`，大部分情况下我们只需要在当前目录下复制该文件，然后编辑其中的少数几个配置即可

> 复制生成的目标文件可以称为任何名称，但为了便于讨论，将其称为 **conf/zoo.cfg。**

```
# ZooKeeper 使用的基本时间单位（以毫秒为单位）。它用于执行心跳（zk 服务器之间或客户端与服务器之间维持心跳的时间间隔），最小会话超时将是 tickTime 的两倍。
tickTime=2000  
#存储内存数据库快照的位置，除非另有说明，否则存储数据库更新的事务日志。
dataDir=/var/lib/zookeeper 
# 用于侦听客户端连接的端口
clientPort=2181 
```



> zk完整的配置说明在后面会进行总结

### 4、启动服务

返回到程序根目录`apache-zookeeper-3.8.3-bin`，执行`bin/zkServer.sh start`

```
[root@XXX bin]# cd ..
[root@XXX apache-zookeeper-3.8.3-bin]# ls
bin  conf  docs  lib  LICENSE.txt  logs  NOTICE.txt  README.md  README_packaging.md
[root@XXX apache-zookeeper-3.8.3-bin]# bin/zkServer.sh start
ZooKeeper JMX enabled by default
Using config: /root/apache-zookeeper-3.8.3-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

ZooKeeper 使用 *logback* 记录消息，如果启动正常，将看到发送到控制台的日志消息（默认）和日志文件中的消息。

注意：对于长时间运行的生产系统，必须在外部管理ZooKeeper存储（dataDir 和 logs）。 



### 5、客户端操作

zookeeper在bin目录下自带了一个客户端脚本`zkCli.sh`，我们使用它来连接到zookeeper服务：

```
bin/zkCli.sh -server 127.0.0.1:2181
```

连接成功后，应该会看到如下内容：

```
[root@XXX apache-zookeeper-3.8.3-bin]# bin/zkCli.sh -server 127.0.0.1:2181
Connecting to 127.0.0.1:2181
.....日志略...
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
[zk: 127.0.0.1:2181(CONNECTED) 0] 
```

连接成功后，可以执行简单的类似文件的操作。

**1）列出`znode`列表**

```
[zk: 127.0.0.1:2181(CONNECTED) 0] ls /
[zookeeper]
[zk: 127.0.0.1:2181(CONNECTED) 1] 
```

**2）创建新的`znode`**

创建一个znode，命名为`zk_test`，写入内容是`my_data`

```
[zk: 127.0.0.1:2181(CONNECTED) 1] create /zk_test my_data
Created /zk_test
[zk: 127.0.0.1:2181(CONNECTED) 10] ls -s /zk_test
[]
cZxid = 0x2
ctime = Thu Dec 07 10:27:25 CST 2023
mZxid = 0x2
mtime = Thu Dec 07 10:27:25 CST 2023
pZxid = 0x2
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 7
numChildren = 0
[zk: 127.0.0.1:2181(CONNECTED) 11] 
```

**3）查看`znode数据`**

查看`zk_test`这个znode的数据

```
[zk: 127.0.0.1:2181(CONNECTED) 11] get -s /zk_test
my_data
cZxid = 0x2
ctime = Thu Dec 07 10:27:25 CST 2023
mZxid = 0x2
mtime = Thu Dec 07 10:27:25 CST 2023
pZxid = 0x2
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 7
numChildren = 0
[zk: 127.0.0.1:2181(CONNECTED) 12] 
```

**4）修改znode数据**

我们可以通过命令来更改与zk_test关联的数据，如下所示：

```
[zk: 127.0.0.1:2181(CONNECTED) 12] set /zk_test helloworld
[zk: 127.0.0.1:2181(CONNECTED) 14] get -s /zk_test
helloworld
cZxid = 0x2
ctime = Thu Dec 07 10:27:25 CST 2023
mZxid = 0x3
mtime = Thu Dec 07 10:39:25 CST 2023
pZxid = 0x2
cversion = 0
dataVersion = 1
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 10
numChildren = 0
[zk: 127.0.0.1:2181(CONNECTED) 15] 
```

可以看出修改后，其中的dataVersion从0变成了1。

**5）删除znode**

删除新增的节点`zk_test`

```
[zk: 127.0.0.1:2181(CONNECTED) 15] ls /
[zk_test, zookeeper]
[zk: 127.0.0.1:2181(CONNECTED) 16] delete /zk_test
[zk: 127.0.0.1:2181(CONNECTED) 17] ls /
[zookeeper]
[zk: 127.0.0.1:2181(CONNECTED) 18] 
```



### 6、集群部署

前面完成了单个zookeeper实例的部署和连接测试，一般我们在生产环境至少部署3台zookeeper服务器组成集群，预防单点故障。下面总结如何部署多个实例。

首先准备拷贝一份zookeeper目录到另外一台服务器上，并修改其中的配置文件`zoo.cfg`，如下所示：

```
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181

initLimit=5
syncLimit=2
server.1=zoo1:2888:3888
server.2=zoo2:2888:3888
server.3=zoo3:2888:3888
```

可以看出多了一些配置项：

- initLimit -集群中的follower服务器(F)与leader服务器(L)之间 初始连接 时能容忍的最多心跳数（tickTime的数量）。当超过设置倍数的 *tickTime* 时间，则连接失败。
- syncLimit -集群中的follower服务器(F)与leader服务器(L)之间 请求和应答 之间能容忍的最多心跳数（tickTime的数量）。如果 *follower* 在设置的时间内不能与*leader* 进行通信，那么此 *follower* 将被丢弃。
- server.x - 列出组成集群的zk服务器标识，这里的x是一个数字，与myid文件中的id是一致的。右边可以配置两个端口，第一个端口用于F和L之间的数据同步和其它通信，第二个端口用于Leader选举过程中投票通信

在上面配置示例中，initLimit 的超时为 5 个时钟周期，每个时钟周期 2000 毫秒，即 10 秒。总共有三台zk实例，标识分布是zoo1、zoo2、zoo3。



## 六、基本知识

[ZooKeeper: Because Coordinating Distributed Systems is a Zoo (apache.org)](https://zookeeper.apache.org/doc/current/zookeeperProgrammers.html)



### 1、数据模型

在文章开头的简介中，提到过zookeeper的数据模型和分层命名空间，这里详细说明一下相关的概念。

与标准文件系统不同，ZooKeeper 命名空间中的每个节点都可以有与之关联的数据以及子节点。这就像有一个文件系统，允许文件也是一个目录。我们使用官方术语 *znode* 来表示一个 ZooKeeper的 数据节点。

Znodes 维护一个统计信息结构，其中包括数据更改、ACL 更改和时间戳的版本号，以允许缓存验证和协调更新。每当 znode 的数据发生变化时，版本号就会增加。例如，每当客户端检索数据时，它也会接收数据的版本。存储在命名空间中每个 znode 的数据都是以原子方式读取和写入的。读取获取与 znode 关联的所有数据字节，写入替换所有数据。每个节点都有一个访问控制列表 （ACL），用于限制谁可以执行哪些操作。

ZooKeeper 被设计用于存储协调数据：状态信息、配置、位置信息等，因此每个节点存储的数据通常很小，在字节到千字节的范围内。



**znode的属性说明：**

ZooKeeper 树中的每个节点都称为 *znode*。通过`bin/zkCli.sh start` 连接上zk服务后，执行`get -s znode_name`，可以获取znode（示例znode是`zk_test`）的属性信息，如下：

```
[zk: 127.0.0.1:2181(CONNECTED) 11] get -s /zk_test
my_data
cZxid = 0x2
ctime = Thu Dec 07 10:27:25 CST 2023
mZxid = 0x2
mtime = Thu Dec 07 10:27:25 CST 2023
pZxid = 0x2
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 7
numChildren = 0
```

其中：

- my_data： 是该节点本身存储的内容。
- cZxid：该节点创建的事务id。
- ctime：该节点创建时的时间。
- mZxid：该节点被修改的事务id，即每次对znode的修改都会更新mZxid。
- mtime：该节点最新一次更新发生时的时间。
- pZxid：表示该节点的子节点列表最后一次修改的事务ID，添加子节点或删除子节点就会影响子节点列表，但是修改子节点的数据内容则不影响该ID。
- cversion：子节点的版本号。当该节点的子节点有变化时，cversion 的值就会增加1。
- dataVersion：数据版本号，数据每次修改该版本号加1。
- aclVersion：权限版本号，权限每次修改该版本号加1。
- ephemeralOwner：如果该节点为临时节点, ephemeralOwner值表示与该节点绑定的session id. 如果不是, ephemeralOwner值为0x0。
- dataLength：该节点的数据长度。
- numChildren：该节点拥有子节点的数量。

Zookeeper里面的版本号和我们理解的版本号不同，它表示的是对数据节点的内容、子节点列表或者ACL信息的修改次数。节点创建时dataversion、aclversion，cversion都为0，每次修改响应内容其对应的版本号加1。

Zookeeper中的版本号其实就是乐观锁的一种思想。两个API操作可以有条件地执行：setData和delete。这两个调用以版本号作为转入参数，只有当转入参数的版本号与服务器上的版本号一致时调用才会成功。当多个Zookeeper客户端对同一个znode进行操作时，版本的作用就会显得尤为重要。

![](http://cdn.gydblog.com/images/middleware/zk-7.png)

如上图所示，客户端C1对znode/config写入了一些配置信息，如果另一个客户端C2同时更新了这个znode，此时C1的版本过期，C1的setData一定不会成功。使用版本机制避免了数据写入混乱情况。


**创建znode时的注意事项：**

- 空字符 （\u0000） 不能是znode路径名的一部分。（这会导致 C 绑定出现问题）
- 不能使用以下字符，因为它们不能很好地显示：\u0001 - \u001F 和 \u007F\u009F.
- 不允许使用以下字符：\ud800 - uF8FF、\uFFF0 - uFFFF。
- “.” 字符可以用作另一个名称的一部分，但 “.” 和 “..” 不能单独用于指示路径上的节点，因为 ZooKeeper 不使用相对路径。以下内容无效：“/a/b/./c”或“/a/b/../c”。
- “zookeeper”是zk服务保留使用的znode，不允许我们自行创建。

官方文档中提到，zookeeper的数据存储节点类型分为了持久节点、临时节点、容器节点、TTL 节点。

#### 1）持久节点

> 持久节点是zookeeper中默认的一种节点类型，也是用的最多的节点类型

#### 2）**临时节点**

ZooKeeper 也有临时节点的概念。只要创建 znode 的会话处于活动状态，这些 znode 就存在。会话结束时，znode 将被删除。<font color="red">不允许临时 znode 具有子节点</font>

#### 3）**容器节点**

在3.5.3版本中，zookeeper增加了`容器 znode` 的概念。容器 znode 是特殊用途的 znode，可用于 leader、lock 等场景。只要在调用 create 方法时，指定 CreateMode 为 CONTAINER 即可创建 容器 znode类型， 容器 znode的表现形式和持久节点是一样的，但是区别是 ZK 服务端启动后，会有一个单独的线程去扫描所有的容器znode，当发现 容器znode的子节点数量为 0 时，会自动删除该节点，除此之外和 持久 节点没有区别。

#### 4）**TTL节点**

**TTL** 是 `time to live` 的缩写，指带有存活时间的节点，如果 znode 未在 TTL时间范围内 有修改并且没有子节点，则它将在TTL时间到达后被删除。

创建 PERSISTENT 或PERSISTENT_SEQUENTIAL znode 时，可以选择为 znode 设置 TTL（以毫秒为单位）。



<font color="red">需要注意：TTL 节点必须通过 System 属性启用，因为它们在默认情况下处于禁用状态。</font>

```
#zoo.cfg配置文件
extendedTypesEnabled=true
```

如果尝试在未设置正确 System 属性的情况下创建 TTL 节点，则服务器将引发 KeeperException.UnimplementedException。

#### 5）**数据访问**

存储在命名空间中每个 znode 的数据都是以原子方式读取和写入的。读取获取与 znode 关联的所有数据，写入替换所有数据。每个节点都有一个访问控制列表 （ACL），用于限制谁可以执行哪些操作。

要特别注意的是，ZooKeeper 并非设计为通用数据库或支持大型对象存储。它设计的初衷是管理协调分布式系统中的协调数据。各种协调数据的一个共同属性是它们相对较小：以千字节为单位。ZooKeeper 客户端和服务器实现具有健全性检查，应确保 znode 存储的数据少于 1M，而且要尽量远低于1M。对相对较大的数据进行操作将导致其他操作可能会被阻塞导致延迟较高，因为通过网络移动到存储介质上需要额外的时间。

如果需要存储大型数据，通常建议是将其存储在大容量存储系统（如 NFS 或 HDFS）上，并在 ZooKeeper 中仅存储指向存储位置的指针。

###  2、watch机制

[ZooKeeper: Because Coordinating Distributed Systems is a Zoo (apache.org)](https://zookeeper.apache.org/doc/current/zookeeperProgrammers.html#ch_zkWatches)

#### 1）**底层原理**

 ZooKeeper官方 对watch的定义：watch事件是一次性触发，发送到设置watch的客户端，当设置watch的数据发生变化时发生。

>  客户端可以在 znode 上设置watch监听器，接受监听事件。监听事件是一次性的，发送到设置监听器的客户端后，会将对应监听器删除。

![](http://cdn.gydblog.com/images/middleware/zk-8.jpg)

 zookeeper的watch设计思想很像设计模式中的”观察者模式“，一个znode节点可能会被多个客户端监控，当对应事件被触发时，会通知这些客户端。

ZooKeeper 中 Watch 机制的实现的方式是通过客服端和服务端分别创建有观察者的信息列表。客户端调用 getData、exist 等接口时，首先将对应的 Watch 事件放到本地的 ZKWatchManager 中进行管理。服务端在接收到客户端的请求后根据请求类型判断是否含有 Watch 事件，并将对应事件放到 WatchManager 中进行管理。

在事件触发的时候服务端通过节点的路径信息查询相应的 Watch 事件通知给客户端，客户端在接收到通知后，首先查询本地的 ZKWatchManager 获得对应的 Watch 信息处理回调操作。

这种设计不但实现了一个分布式环境下的观察者模式，而且通过将客户端和服务端各自处理 Watch 事件所需要的额外信息分别保存在两端，减少彼此通信的内容，提升了服务的处理性能。



#### 2）**何时触发？**

对 znode 的更改会触发监听器。当znode有变更时，ZooKeeper 会向客户端发送本地通知，最多发送一次后watch监听器就会自动失效。

ZooKeeper 中的所有读取操作 - getData（）、**getChildren**（） 和 **exists（）** - 都可以被监听。

例如：如果客户端执行 `getData(“/znode1”， true)`，并且稍后更改或删除了 /znode1 的数据，则客户端将获得 /znode1 的watch监听事件（异步获得）。如果 /znode1 再次更改，则不会发送watch事件，除非客户端重新设置一次新的监听器。

下面图中列出了客户端在不同会话状态下，相应的在服务器节点所能支持的事件类型。

例如在客户端连接服务端的时候，可以对数据节点的创建、删除、数据变更、子节点的更新等操作进行监控。

![](http://cdn.gydblog.com/images/middleware/zk-9.jpg)

#### 3）**其它说明**

1）watch在客户端连接到的 ZooKeeper 服务器上本地维护，Watcher 将作为整个 ZooKeeper 会话期间的上下文 ，一直被保存在客户端 ZKWatchManager 的 defaultWatcher 中 。

2）当客户端与服务器断开连接时，不会收到watch事件。当客户端重新连接时，将重新注册并在需要时触发任何以前注册的watch事件。

3）有一种情况可能会错过监听事件：如果在断开连接时创建并删除了 znode，则将错过尚未创建的 znode 存在的watch事件。

4）**3.6.0 中的新功能：** 客户端可以在 znode 上设置永久的递归监听事件，这些监听事件在触发时不会被删除，并且会以递归方式触发已注册的 znode 以及任何子 znode 上的更改。

#### 4）**应用案例**

在分布式应用开发的过程中会用到各种各样的配置信息，如应用本身业务配置、第三方接口调用地址、数据库信息等等,我们可以将这些配置集中管理，然后利用ZooKeeper 的watcher机制解决分布式应用中的配置实时通知功能。

我们可以在zookeeper创建一个znode节点，然后把上面的信息存储于该节点中。

然后服务器集群客户端对该节点添加 Watch 事件监控，当集群中的服务启动时，会读取该节点数据获取数据配置信息。而当该节点数据发生变化时，ZooKeeper 服务器会发送 Watch 事件给各个客户端，集群中的客户端在接收到该通知后，重新读取最新的配置信息。

<font color="red">需要特别注意的是，如果你使用的zookeeper版本是3.6.0之前的版本，则Watch 具有一次性，所以当我们获得服务器通知后要再次添加 Watch 事件。</font>

> 目前市面上已经有很多优秀的开源分布式配置集中管理系统，比如Apollo、Nacos等，真实业务场景还是建议直接采用这些优秀的开源轮子，而不是重新开发配置管理系统了，毕竟咱不要重复造轮子，除非你能比他们更优秀！



### 3、会话机制

若要创建客户端会话，应用程序代码必须提供一个zookeeper连接配置字符串，其中包含以逗号分隔的主机：端口对列表，每个对应于 ZooKeeper 服务器。字符串格式示例如下：

```
"127.0.0.1:3000,127.0.0.1:3001,127.0.0.1:3002"
```

ZooKeeper 客户端库将选择连接字符串中的任意一台服务器地址并尝试连接到它。如果此连接失败，或者客户端由于任何原因与服务器断开连接，则客户端将自动尝试列表中的下一个服务器，直到（重新）建立连接。

ZK Server在配置集群时，会在配置文件指定明确的服务器IP和端口，然后启动。如果中途某台挂了，那么只要在一定数量范围之内不影响，但是如果想要增加几台，需要在每台ZK Server上的配置文件上都加入新增加的IP和端口，最重要一点就是要重启所有的ZK Server才能使其生效。



下图显示了 ZooKeeper 客户端与服务器在连接过程中可能的状态转换：

![](http://cdn.gydblog.com/images/middleware/zk-10.jpg)

ZooKeeper 客户端通过使用的编程语言创建服务的句柄来建立与 ZooKeeper 服务的会话。创建后，句柄以 `CONNECTING` 状态启动，客户端库尝试连接到组成 ZooKeeper 服务集群的其中一个实例，此时它将切换到 CONNECTED 状态。在正常操作期间，客户端句柄将处于这两种状态之一。如果发生不可恢复的错误（如会话过期或身份验证失败），或者应用程序显式关闭句柄，则句柄将移至 CLOSED 状态。

当客户端获取 到ZooKeeper 服务的句柄时，ZooKeeper 会创建一个 代表ZooKeeper 会话的64 位数字，并将其分配给客户端。如果客户端连接到其他 ZooKeeper 服务器，它将发送会话 ID 作为连接握手的一部分。服务器会为该会话 ID 创建一个密码，任何 ZooKeeper 服务器都可以验证该密码。当客户端建立会话时，密码将随会话 ID 一起发送到客户端。每当客户端与新服务器重新建立会话时，客户端都会将此密码与会话 ID 一起发送。





**异常说明**

在3.2.0版本中增加了SessionMovedException。发生此异常的原因是，已在其他服务器上重新建立的会话的连接上收到了请求。此错误的正常原因是客户端向服务器发送请求，但网络数据包延迟，因此客户端超时并连接到新服务器。当延迟的数据包到达第一台服务器时，旧服务器检测到会话已移动，并关闭客户端连接。

架构设计

程序目录结构

完整配置说明

api操作

客户端操作（java代码演示）



[Zookeeper详解（从安装—入门—使用）_〖雪月清〗的博客-CSDN博客](https://blog.csdn.net/qq_52595134/article/details/123467180)

## 七、常见问题

[ZooKeeper 04 - ZooKeeper 集群的节点为什么必须是奇数个 - 瘦风 - 博客园 (cnblogs.com)](https://www.cnblogs.com/shoufeng/p/14314785.html)

## 八、参考资料

[Apache ZooKeeper官方文档](https://zookeeper.apache.org/)

[ZooKeeper 介绍 — zookeeper入门 文档](https://zookeeper.readthedocs.io/zh/latest/intro.html)

## 九、结束语

ZooKeeper 已成功应用于许多工业应用。它在雅虎 用作 `Yahoo！ Message Broker `的协调和故障恢复服务，`Yahoo！ Message Broker `是一个高度可扩展的发布-订阅系统，用于管理数千个用于复制和数据传输的主题。它由` Fetching Service for Yahoo！ `爬网程序使用，它还管理故障恢复。许多雅虎广告系统也使用ZooKeeper来实现可靠的服务。

如果你是在大公司做开发，zookeeper一般有专门的运维人员维护，普通开发人员无需关心。如果你是在小公司的话，zookeeper绝对要会基本操作的！
