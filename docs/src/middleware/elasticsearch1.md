---
title: Elasticsearch入门-基本概念介绍
shortTitle: Elasticsearch入门-基本概念介绍
date: 2023-12-20
category:
  - 开源框架
tag:
  - 搜索引擎
description: 记录Elasticsearch的基本概念介绍
head:
  - - meta
    - name: keywords
      content: Elasticsearch,全文检索,大数据搜索,分词查找,统计分析
---

# Elasticsearch入门-基本概念介绍

## 一、前言

最近接了个需求，需要实现一个全文检索页面，客户直接要求我们使用ElasticSearch，小郭在之前并没有使用过这个组件，特意花了两天时间对它的基础知识进行了学习和总结，分享给有兴趣的小伙伴。

> 本文适合ElasticSearch的初学者阅读。

## 二、简介

Elasticsearch 为所有类型的数据提供近乎实时的搜索和分析。无论是具有结构化或非结构化文本、数字数据或地理空间数据， Elasticsearch 可以以支持快速搜索的方式有效地存储和索引它。随着数据和查询量的增长， Elasticsearch 的分布式特性也支持无缝扩展。

Elasticsearch 提供了一些 REST API，用于管理集群和建立索引 并搜索数据。我们可以直接从命令行或通过 Kibana 中的开发人员控制台提交搜索请求。或者使用所选语言的 Elasticsearch 客户端（Java、JavaScript、Go、.NET、PHP、Perl、Python 或 Ruby）从应用程序发起搜索请求。

与传统关系型数据库将信息存储为行 列式数据格式不同的是，elasticsearch是一个分布式文档存储组件。将已序列化的复杂数据结构 存储为 JSON 文档。当在集群中有多个 Elasticsearch 节点时，可以从集群中的任何节点访问存储的任何文档。

当文档被存储时，它会被索引并可在 1 秒内近乎实时地完全搜索。为什么这么快呢？因为Elasticsearch 使用一种称为 倒排索引，支持非常快速的全文搜索。倒排索引能 列出任何文档中出现的每个唯一单词，并标识所有 每个单词出现的文档。

**那么，什么是文档、索引？**

索引可以看作是文档的集合，每个文档是字段的集合，这些字段是我们定义的业务数据。默认情况下，Elasticsearch 会为每个字段中的所有数据创建索引，并为每个索引应用专用的优化数据结构。例如，文本字段是存储在倒排索引中，数字和地理字段存储在 BKD 树中。 能够使用每个字段的数据结构来组合和返回搜索 结果是 Elasticsearch 如此快速的原因。

**索引的字段类型动态映射能力**

Elasticsearch 还具有索引字段类型动态映射能力，也就是说我们在创建索引但未明确指定文档中每个不同的字段类型时， 如果启用了动态映射，Elasticsearch 将自动检测新字段并将其添加到索引中。 将检测并映射布尔值、浮点数等类型，并将整数值、日期和字符串转换为相应的 Elasticsearch 数据类型。

有时候我们不需要动态映射，可以关闭这个能力，然后自定义映射字段类型，通过自定义，我们可以实现如下目标：

- 区分全文字符串字段和精确值字符串字段
- 执行特定于语言的文本分析
- 优化字段以进行部分匹配
- 使用自定义日期格式
- 使用不能自动使用的数据类型，例如 和 检测`geo_point``geo_shape`

### 1、起源

Elasticsearch 的起源于一家名为 Elasticsearch BV（现在的 Elastic N.V.） 的公司，该公司成立于 2012 年，总部位于荷兰阿姆斯特丹。Elasticsearch 的创始人之一是 Shay Banon（沙伊·巴农），他是 Elasticsearch BV 公司的创始人和首席技术官员（CTO）。Shay Banon 在创建 Elasticsearch 之前，曾经在开发搜索和实时分析方面的技术。他发现现有的搜索引擎在处理大规模数据时存在性能和扩展性方面的挑战，因此决定创建一个新的解决方案，以解决这些问题。

elasticsearch 最初的版本于 2010 年左右开始开发，并于 2010 年 2 月发布了第一个 alpha 版本。最初的版本注重了搜索引擎的性能和实时特性。随着时间的推移，Elasticsearch 逐渐吸引了更多的开发者和用户，他们在不同领域的应用中开始使用 Elasticsearch 来进行搜索、分析和数据存储。

在 Shay Banon 的领导下，Elasticsearch 不断演进和改进，引入了许多创新的功能，包括分布式架构、实时索引、强大的聚合框架等。随着 Elastic N.V. 公司的成立，Elasticsearch 成为 Elastic Stack（也称为 ELK Stack，现在称为 Elastic Stack），其中还包括 Logstash 和 Kibana 等工具，形成了一个全面的实时数据分析解决方案。

### 2、区别

与传统关系型数据库的区别，这里以MySQL为例：

| MySQL                   | Elastic Search        |
| ----------------------- | --------------------- |
| Database                | Index                 |
| Table                   | Type                  |
| Row                     | Document              |
| Column                  | Field                 |
| Schema                  | Mapping               |
| Index                   | Everything is indexed |
| SQL                     | Query DSL             |
| SELECT * FROM table ... | GET http://...        |
| UPDATE table SET...     | PUT http://...        |



### 3、优势

1、分布式实时文件存储，可将每一个字段存入索引，使其可以被检索到。
2、实时分析的分布式搜索引擎。
    分布式：索引分拆成多个分片，每个分片可有零个或多个副本。集群中的每个数据节点都可承载一个或多个分片，并且协调和处理各种操作；负载再平衡和路由在大多数情况下自动完成。
3、可以扩展到上百台服务器，处理PB级别的结构化或非结构化数据。也可以运行在单台PC上（已测试）。
4、支持插件机制，分词插件、同步插件、Hadoop插件、可视化插件等 。

## 三、版本管理

### 1、主版本简介

下面列出了elasticsearch各个主版本的发布说明：

| 版本  | 发布日期       | 内容                                                         |
| ----- | -------------- | ------------------------------------------------------------ |
| 0.7.0 | 2010年5月14日  | 1）  Zen Discovery 自动发现模块 <br/>2）Groovy Client支持 <br/>3）简单的插件管理机制 <br/>4）更好支持ICU分词器 <br/>5）更多的管理API |
| 1.0.0 | 2014年2月14日  | 1）Snapshot/Restore API 备份恢复API<br/>2）支持聚合分析Aggregations<br/>3）CAT API 支持<br/>4）支持联盟查询<br/>5）断路器支持<br/>6）Doc values 引入 |
| 2.0.0 | 2015年10月28日 | 1）增加了 pipleline Aggregations<br/>2）query/filter 查询合并，都合并到query中，根据不同的上下文执行不同的查询<br/>3）存储压缩可配置<br/>4）Rivers 模块被移除<br/>5）Multicast 组播发现被移除，成为一个插件，生产环境必须配置单播地址 |
| 5.0.0 | 2016年10月26日 | 1）Lucene 6.x 的支持，磁盘空间少一半；索引时间少一半；查询性能提升25%；支持IPV6。<br/>2）Internal engine级别移除了用于避免同一文档并发更新的竞争锁，带来15%-20%的性能提升<br/>3）Shrink API ，它可将分片数进行收缩成它的因数，如之前你是15个分片，你可以收缩成5个或者3个又或者1个，那么我们就可以想象成这样一种场景，在写入压力非常大的收4）集阶段，设置足够多的索引，充分利用shard的并行写能力，索引写完之后收缩成更少的shard，提高查询性能<br/>5）提供了第一个Java原生的REST客户端SDK<br/>6）IngestNode，之前如果需要对数据进行加工，都是在索引之前进行处理，比如logstash可以对日志进行结构化和转换，现在直接在es就可以处理了<br/>7）提供了 Painless 脚本，代替Groovy脚本 |
| 6.0.0 | 2017年11月14日 | 1）稀疏性 Doc Values 的支持<br/>2）Index sorting，即索引阶段的排序。<br/>3）顺序号的支持，每个 es 的操作都有一个顺序编号（类似增量设计）<br/>4）无缝滚动升级<br/>5）Removal of types，在 6.0 里面，开始不支持一个 index 里面存在多个 type<br/>6）Index-template inheritance，索引版本的继承，目前索引模板是所有匹配的都会合并，这样会造成索引模板有一些冲突问题， 6.0 将会只匹配一个，索引创建时也会进行验证<br/>7）Load aware shard routing， 基于负载的请求路由，目前的搜索请求是全节点轮询，那么性能最慢的节点往往会造成整体的延迟增加，新的实现方式将基于队列的耗费时间自动调节队列长度，负载高的节点的队列长度将减少，让其他节点分摊更多的压力，搜索和索引都将基于这种机制。<br/>8）已经关闭的索引将也支持 replica 的自动处理，确保数据可靠。 |
| 7.0.0 | 2019年4月10日  | 1）引入了真正的内存断路器，它可以更精准地检测出无法处理的请求，并防止它们使单个节点不稳定<br/>2）Zen2 是 Elasticsearch 的全新集群协调层，提高了可靠性、性能和用户体验，变得更快、更安全，并更易于使用<br/>3）查询优化(更快的前 k 个查询、间隔查询、Function score 2.0) |
| 8.0.0 | 2022年2月10日  | Security默认启用、NLP支持、KNN、API升级、存储与性能提升      |



下面针对每个主版本的小版本，总结了官方文档入口，方便后续查阅。

> 2.0之前的文档在官网未找到，因此本小节仅记录了2.0以后的版本文档地址

### 2、2.x文档

| 版本号      | 官方发行说明                                                 |
| ----------- | ------------------------------------------------------------ |
| 2.0.0-beta1 | https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.0.0-alpha1-2x.html |
| 2.0.0-beta2 | https://www.elastic.co/guide/en/elasticsearch/reference/2.0/release-notes-2.0.0-beta2.html |
| 2.0.0-rc1   | https://www.elastic.co/guide/en/elasticsearch/reference/2.0/release-notes-2.0.0-rc1.html |
| 2.0.0       | https://www.elastic.co/guide/en/elasticsearch/reference/2.0/release-notes-2.0.0.html |
| 2.0.1       | https://www.elastic.co/guide/en/elasticsearch/reference/2.0/release-notes-2.0.1.html |
| 2.0.2       | https://www.elastic.co/guide/en/elasticsearch/reference/2.0/release-notes-2.0.2.html |
| 2.1.0       | https://www.elastic.co/guide/en/elasticsearch/reference/2.1/release-notes-2.1.0.html |
| 2.1.1       | https://www.elastic.co/guide/en/elasticsearch/reference/2.1/release-notes-2.1.1.html |
| 2.1.2       | https://www.elastic.co/guide/en/elasticsearch/reference/2.1/release-notes-2.1.2.html |
| 2.2.0       | https://www.elastic.co/guide/en/elasticsearch/reference/2.2/release-notes-2.2.0.html |
| 2.2.1       | https://www.elastic.co/guide/en/elasticsearch/reference/2.2/release-notes-2.2.1.html |
| 2.2.2       | https://www.elastic.co/guide/en/elasticsearch/reference/2.2/release-notes-2.2.2.html |
| 2.3.0       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.0.html |
| 2.3.1       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.1.html |
| 2.3.2       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.2.html |
| 2.3.3       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.3.html |
| 2.3.4       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.4.html |
| 2.3.5       | https://www.elastic.co/guide/en/elasticsearch/reference/2.3/release-notes-2.3.5.html |
| 2.4.0       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.0.html |
| 2.4.1       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.1.html |
| 2.4.2       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.2.html |
| 2.4.3       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.3.html |
| 2.4.4       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.4.html |
| 2.4.5       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.5.html |
| 2.4.6       | https://www.elastic.co/guide/en/elasticsearch/reference/2.4/release-notes-2.4.6.html |



### 3、5.x文档

| 版本号          | 官方发行说明                                                 |
| --------------- | ------------------------------------------------------------ |
| 5.0.0-alpha1-2x | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha1-2x.html |
| 5.0.0-alpha1    | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha1.html |
| 5.0.0-alpha2    | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha2.html |
| 5.0.0-alpha3    | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha3.html |
| 5.0.0-alpha4    | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha4.html |
| 5.0.0-alpha5    | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-alpha5.html |
| 5.0.0-beta1     | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-beta1.html |
| 5.0.0-rc1       | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-rc1.html |
| 5.0.0-GA        | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.0-GA.html |
| 5.0.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.1.html |
| 5.0.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.0/release-notes-5.0.2.html |
| 5.1.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.1/release-notes-5.1.0.html |
| 5.1.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.1/release-notes-5.1.1.html |
| 5.1.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.1/release-notes-5.1.2.html |
| 5.2.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.2/release-notes-5.2.0.html |
| 5.2.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.2/release-notes-5.2.1.html |
| 5.2.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.2/release-notes-5.2.2.html |
| 5.3.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.3.0.html |
| 5.3.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.3.1.html |
| 5.3.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.3.2.html |
| 5.3.3           | https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.3.3.html |
| 5.4.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.4/release-notes-5.4.0.html |
| 5.4.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.4/release-notes-5.4.1.html |
| 5.4.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.4/release-notes-5.4.2.html |
| 5.4.3           | https://www.elastic.co/guide/en/elasticsearch/reference/5.4/release-notes-5.4.3.html |
| 5.5.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.5/release-notes-5.5.0.html |
| 5.5.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.5/release-notes-5.5.1.html |
| 5.5.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.5/release-notes-5.5.2.html |
| 5.5.3           | https://www.elastic.co/guide/en/elasticsearch/reference/5.5/release-notes-5.5.3.html |
| 5.6.0           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.0.html |
| 5.6.1           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.1.html |
| 5.6.2           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.2.html |
| 5.6.3           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.3.html |
| 5.6.4           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.4.html |
| 5.6.5           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.5.html |
| 5.6.6           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.6.html |
| 5.6.7           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.7.html |
| 5.6.8           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.8.html |
| 5.6.9           | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.9.html |
| 5.6.10          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.10.html |
| 5.6.11          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.11.html |
| 5.6.12          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.12.html |
| 5.6.13          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.13.html |
| 5.6.14          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.14.html |
| 5.6.15          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.15.html |
| 5.6.16          | https://www.elastic.co/guide/en/elasticsearch/reference/5.6/release-notes-5.6.16.html |



### 4、6.x文档

| 版本号          | 官方发行说明                                                 |
| --------------- | ------------------------------------------------------------ |
| 6.0.0-alpha1-5x | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-alpha1-5x.html |
| 6.0.0-alpha1    | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-alpha1.html |
| 6.0.0-alpha2    | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-alpha2.html |
| 6.0.0-beta1     | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-beta1.html |
| 6.0.0-beta2     | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-beta2.html |
| 6.0.0-rc1       | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-rc1.html |
| 6.0.0-rc2       | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0-rc2.html |
| 6.0.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.0.html |
| 6.0.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.0/release-notes-6.0.1.html |
| 6.1.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.1/release-notes-6.1.0.html |
| 6.1.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.1/release-notes-6.1.1.html |
| 6.1.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.1/release-notes-6.1.2.html |
| 6.1.3           | https://www.elastic.co/guide/en/elasticsearch/reference/6.1/release-notes-6.1.3.html |
| 6.1.4           | https://www.elastic.co/guide/en/elasticsearch/reference/6.1/release-notes-6.1.4.html |
| 6.2.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.2/release-notes-6.2.0.html |
| 6.2.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.2/release-notes-6.2.1.html |
| 6.2.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.2/release-notes-6.2.2.html |
| 6.2.3           | https://www.elastic.co/guide/en/elasticsearch/reference/6.2/release-notes-6.2.3.html |
| 6.2.4           | https://www.elastic.co/guide/en/elasticsearch/reference/6.2/release-notes-6.2.4.html |
| 6.3.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.3/release-notes-6.3.0.html |
| 6.3.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.3/release-notes-6.3.1.html |
| 6.3.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.3/release-notes-6.3.2.html |
| 6.4.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.4/release-notes-6.4.0.html |
| 6.4.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.4/release-notes-6.4.1.html |
| 6.4.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.4/release-notes-6.4.2.html |
| 6.4.3           | https://www.elastic.co/guide/en/elasticsearch/reference/6.4/release-notes-6.4.3.html |
| 6.5.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.5/release-notes-6.5.0.html |
| 6.5.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.5/release-notes-6.5.1.html |
| 6.5.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.5/release-notes-6.5.2.html |
| 6.5.3           | https://www.elastic.co/guide/en/elasticsearch/reference/6.5/release-notes-6.5.3.html |
| 6.5.4           | https://www.elastic.co/guide/en/elasticsearch/reference/6.5/release-notes-6.5.4.html |
| 6.6.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.6/release-notes-6.6.0.html |
| 6.6.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.6/release-notes-6.6.1.html |
| 6.6.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.6/release-notes-6.6.2.html |
| 6.7.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.7/release-notes-6.7.0.html |
| 6.7.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.7/release-notes-6.7.1.html |
| 6.7.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.7/release-notes-6.7.2.html |
| 6.8.0           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.0.html |
| 6.8.1           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.1.html |
| 6.8.2           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.2.html |
| 6.8.3           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.3.html |
| 6.8.4           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.4.html |
| 6.8.5           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.5.html |
| 6.8.6           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.6.html |
| 6.8.7           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.7.html |
| 6.8.8           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.8.html |
| 6.8.9           | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.9.html |
| 6.8.10          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.10.html |
| 6.8.11          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.11.html |
| 6.8.12          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.12.html |
| 6.8.13          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.13.html |
| 6.8.14          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.14.html |
| 6.8.15          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.15.html |
| 6.8.16          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.16.html |
| 6.8.17          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.17.html |
| 6.8.18          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.18.html |
| 6.8.19          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.19.html |
| 6.8.20          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.20.html |
| 6.8.21          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.21.html |
| 6.8.22          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.22.html |
| 6.8.23          | https://www.elastic.co/guide/en/elasticsearch/reference/6.8/release-notes-6.8.23.html |



### 5、7.x文档

| 版本号       | 官方发行说明                                                 |
| ------------ | ------------------------------------------------------------ |
| 7.0.0-aplha1 | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0-alpha1.html |
| 7.0.0-aplha2 | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0-alpha2.html |
| 7.0.0-beta1  | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0-beta1.html |
| 7.0.0-rc1    | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0-rc1.html |
| 7.0.0-rc2    | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0-rc2.html |
| 7.0.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.0.html |
| 7.0.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.0/release-notes-7.0.1.html |
| 7.1.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.1/release-notes-7.1.0.html |
| 7.1.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.1/release-notes-7.1.1.html |
| 7.2.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.2/release-notes-7.2.0.html |
| 7.2.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.2/release-notes-7.2.1.html |
| 7.3.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.3/release-notes-7.3.0.html |
| 7.3.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.3/release-notes-7.3.1.html |
| 7.3.2        | https://www.elastic.co/guide/en/elasticsearch/reference/7.3/release-notes-7.3.2.html |
| 7.4.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.4/release-notes-7.4.0.html |
| 7.4.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.4/release-notes-7.4.1.html |
| 7.4.2        | https://www.elastic.co/guide/en/elasticsearch/reference/7.4/release-notes-7.4.2.html |
| 7.5.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.5/release-notes-7.5.0.html |
| 7.5.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.5/release-notes-7.5.1.html |
| 7.5.2        | https://www.elastic.co/guide/en/elasticsearch/reference/7.5/release-notes-7.5.2.html |
| 7.6.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.6/release-notes-7.6.0.html |
| 7.6.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.6/release-notes-7.6.1.html |
| 7.6.2        | https://www.elastic.co/guide/en/elasticsearch/reference/7.6/release-notes-7.6.2.html |
| 7.7.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.7/release-notes-7.7.0.html |
| 7.7.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.7/release-notes-7.7.1.html |
| 7.8.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.8/release-notes-7.8.0.html |
| 7.8.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.8/release-notes-7.8.1.html |
| 7.9.0        | https://www.elastic.co/guide/en/elasticsearch/reference/7.9/release-notes-7.9.0.html |
| 7.9.1        | https://www.elastic.co/guide/en/elasticsearch/reference/7.9/release-notes-7.9.1.html |
| 7.9.2        | https://www.elastic.co/guide/en/elasticsearch/reference/7.9/release-notes-7.9.2.html |
| 7.9.3        | https://www.elastic.co/guide/en/elasticsearch/reference/7.9/release-notes-7.9.3.html |
| 7.10.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.10/release-notes-7.10.0.html |
| 7.10.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.10/release-notes-7.10.1.html |
| 7.10.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.10/release-notes-7.10.2.html |
| 7.11.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.0.html |
| 7.11.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.1.html |
| 7.11.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.11/release-notes-7.11.2.html |
| 7.12.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.12/release-notes-7.12.0.html |
| 7.12.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.12/release-notes-7.12.1.html |
| 7.13.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.0.html |
| 7.13.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.1.html |
| 7.13.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.2.html |
| 7.13.3       | https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.3.html |
| 7.13.4       | https://www.elastic.co/guide/en/elasticsearch/reference/7.13/release-notes-7.13.4.html |
| 7.14.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.14/release-notes-7.14.0.html |
| 7.14.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.14/release-notes-7.14.1.html |
| 7.14.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.14/release-notes-7.14.2.html |
| 7.15.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.15/release-notes-7.15.0.html |
| 7.15.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.15/release-notes-7.15.1.html |
| 7.15.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.15/release-notes-7.15.2.html |
| 7.16.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.16/release-notes-7.16.0.html |
| 7.16.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.16/release-notes-7.16.1.html |
| 7.16.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.16/release-notes-7.16.2.html |
| 7.16.3       | https://www.elastic.co/guide/en/elasticsearch/reference/7.16/release-notes-7.16.3.html |
| 7.17.0       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.0.html |
| 7.17.1       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.1.html |
| 7.17.2       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.2.html |
| 7.17.3       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.3.html |
| 7.17.4       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.4.html |
| 7.17.5       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.5.html |
| 7.17.6       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.6.html |
| 7.17.7       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.7.html |
| 7.17.8       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.8.html |
| 7.17.9       | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.9.html |
| 7.17.10      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.10.html |
| 7.17.11      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.11.html |
| 7.17.12      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.12.html |
| 7.17.13      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.13.html |
| 7.17.14      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.14.html |
| 7.17.15      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.15.html |
| 7.17.16      | https://www.elastic.co/guide/en/elasticsearch/reference/7.17/release-notes-7.17.16.html |



### 6、8.x文档（目前最新）

| 版本号       | 官方发行说明                                                 |
| ------------ | ------------------------------------------------------------ |
| 8.0.0-alpha1 | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0-alpha1.html |
| 8.0.0-alpha2 | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0-alpha2.html |
| 8.0.0-beta1  | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0-beta1.html |
| 8.0.0-rc1    | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0-rc1.html |
| 8.0.0-rc2    | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0-rc2.html |
| 8.0.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.0.html |
| 8.0.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.0/release-notes-8.0.1.html |
| 8.1.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.1/release-notes-8.1.0.html |
| 8.1.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.1/release-notes-8.1.1.html |
| 8.1.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.1/release-notes-8.1.2.html |
| 8.1.3        | https://www.elastic.co/guide/en/elasticsearch/reference/8.1/release-notes-8.1.3.html |
| 8.2.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.2/release-notes-8.2.0.html |
| 8.2.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.2/release-notes-8.2.1.html |
| 8.2.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.2/release-notes-8.2.2.html |
| 8.2.3        | https://www.elastic.co/guide/en/elasticsearch/reference/8.2/release-notes-8.2.3.html |
| 8.3.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.3/release-notes-8.3.0.html |
| 8.3.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.3/release-notes-8.3.1.html |
| 8.3.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.3/release-notes-8.3.2.html |
| 8.3.3        | https://www.elastic.co/guide/en/elasticsearch/reference/8.3/release-notes-8.3.3.html |
| 8.4.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.4/release-notes-8.4.0.html |
| 8.4.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.4/release-notes-8.4.1.html |
| 8.4.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.4/release-notes-8.4.2.html |
| 8.4.3        | https://www.elastic.co/guide/en/elasticsearch/reference/8.4/release-notes-8.4.3.html |
| 8.5.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.5/release-notes-8.5.0.html |
| 8.5.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.5/release-notes-8.5.1.html |
| 8.5.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.5/release-notes-8.5.2.html |
| 8.5.3        | https://www.elastic.co/guide/en/elasticsearch/reference/8.5/release-notes-8.5.3.html |
| 8.6.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.6/release-notes-8.6.0.html |
| 8.6.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.6/release-notes-8.6.1.html |
| 8.6.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.6/release-notes-8.6.2.html |
| 8.7.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.7/release-notes-8.7.0.html |
| 8.7.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.7/release-notes-8.7.1.html |
| 8.8.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.8/release-notes-8.8.0.html |
| 8.8.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.8/release-notes-8.8.1.html |
| 8.8.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.8/release-notes-8.8.2.html |
| 8.9.0        | https://www.elastic.co/guide/en/elasticsearch/reference/8.9/release-notes-8.9.0.html |
| 8.9.1        | https://www.elastic.co/guide/en/elasticsearch/reference/8.9/release-notes-8.9.1.html |
| 8.9.2        | https://www.elastic.co/guide/en/elasticsearch/reference/8.9/release-notes-8.9.2.html |
| 8.10.0       | https://www.elastic.co/guide/en/elasticsearch/reference/8.10/release-notes-8.10.0.html |
| 8.10.1       | https://www.elastic.co/guide/en/elasticsearch/reference/8.10/release-notes-8.10.1.html |
| 8.10.2       | https://www.elastic.co/guide/en/elasticsearch/reference/8.10/release-notes-8.10.2.html |
| 8.10.3       | https://www.elastic.co/guide/en/elasticsearch/reference/8.10/release-notes-8.10.3.html |
| 8.10.4       | https://www.elastic.co/guide/en/elasticsearch/reference/8.10/release-notes-8.10.4.html |
| 8.11.0       | https://www.elastic.co/guide/en/elasticsearch/reference/8.11/release-notes-8.11.0.html |
| 8.11.1       | https://www.elastic.co/guide/en/elasticsearch/reference/8.11/release-notes-8.11.1.html |
| 8.11.2       | https://www.elastic.co/guide/en/elasticsearch/reference/8.11/release-notes-8.11.2.html |
| 8.11.3       | https://www.elastic.co/guide/en/elasticsearch/reference/8.11/release-notes-8.11.3.html |



## 四、环境搭建

elasticsearch的安装部署是非常简单的，下面也简单记录下。

### 1、安装

选择指定系统版本，下载对应安装包。

下载地址：[Download Elasticsearch | Elastic](https://www.elastic.co/cn/downloads/elasticsearch)

默认下载的是当前最新版本，如果需要下载指定版本，点这里查找：[Past Releases of Elastic Stack Software | Elastic](https://www.elastic.co/cn/downloads/past-releases#elasticsearch)。

下载好后，解压到指定路径即可。

### 2、运行

先进入bin目录。

linux：

```
运行 `bin/elasticsearch`
```

window：

```
运行 `bin\elasticsearch.bat`
```

## 五、基本知识

### 1、数据读写模型

要理解Elasticsearch的数据读写模型，我们先要搞懂几个概念：

- **分片**：最简单的理解就是分区。类似MySQL中的分区表。随着数据量的增大，不可能将所有数据都放到一起，这样在查询和删除的时候都会非常慢。其他系统如HBASE中Region的概念对应ES的shard概念。kafka中也有分区的概念可以近似对应分片的概念。
- **复制组**：复制组是以分片和副本为基础的。上面讲到了分片的意义。一个ES索引可以有多个分片，同样也可以有多个副本。同一分片的不同副本就构成了一个复制组，只是在ES中分的比较清楚，主副本叫做primary，从副本叫做replica。很明显前者只能有一个，后者可以有多个。
- **同步副本**：数据写入ES是先写到primary副本再同步到replica副本的。但是由于网络等一系列问题，很难保证所有备份副本都能跟primary副本一直同步，这些能保证同步的副本就是同步副本。很明显，同步副本集合是动态变化的。其实这里还有一个问题无法保证replica副本写入正常，那就能保证primary写入正常吗？当然不能。但是如果primary都没有写入正常，这就需要开发人员或者运维人员去排查并解决问题。但是为了效率，在配置ES集群的时候可能会容忍可以有一定数量的replica副本同步不正常也算成功。
- **master节点和primary分片：**已经很明显了，前者代表集群的一个节点，而后者则代表一个索引一个分片的主分片。前者的主要功能是选举primary分片等。而后者的主要功能是协调数据写入 。

#### 1.1 基本写模型

![](http://cdn.gydblog.com/images/middleware/es-3.png)

ES中的每个索引操作首先使用路由解析（通常基于文档ID）到一个复制组。一旦确定了目标复制组，该操作将在内部转发到该组的当前主分片（这一阶段称为协调阶段）。主分片primary负责验证操作并将其转发到其他副本分片replica（这一阶段称为主阶段）。由于replica可以离线，因此不需要primary复制到所有副本，相反，elasticsearch的master节点会维护一个同步副本列表（这一点跟kafka很类似），同步副本需要满足一个条件，即该副本的所有索引和删除操作都跟主分片是同步的。

**主分片primary上的操作基于以下基本流程：**

1）验证客户端的传入操作，如果结构无效，则拒绝它（例如：字段类型是数字，但是传入了字符串）

2）在本地执行操作，即索引或删除相关文档。这也将验证字段的内容 并在需要时拒绝（例如：关键字值太长，无法在 Lucene 中建立索引）。

3）将操作转发到当前同步副本集中的每个副本。如果有多个副本，则此操作将并行完成。

4）一旦所有同步副本都成功执行了操作并响应了主副本，主副本就会确认成功 完成对客户端的请求。

**错误处理方式：**

> 在索引过程中，许多事情都可能出错。例如磁盘可能会损坏，节点之间可能会断开连接，或者某些配置错误可能导致副本上的操作失败，尽管该操作在主副本上成功。这些 不常见，但必须对它们做出反应。

- 如果primary本身发生故障，primary分片所在的节点会向集群master节点发送故障信息，master节点将会把其中一个同步replica提升为新的primary分片。然后客户端的请求将会转发到这个新的primary分片进行处理。
- 如果replica分片发生故障，导致primary的请求无法到达，或者master请求到达以后无法收到确认消息。primary会向master节点申请将该分片从同步副本集中删除。primary分片在确认master节点删除有问题的同步副本以后才会向客户端发送操作成功的确认消息。之后master会尝试在其他节点创建新的同步副本，以便将系统恢复到健康状态。 

#### 1.2 基本读模型

> Elasticsearch 中的读取可以是按 ID 进行非常轻量级的查找，也可以是具有复杂聚合的繁重搜索请求，主备份模型的优点之一是它使所有分片副本保持相同 （悬空操作除外）。因此，单个同步副本足以为读取请求提供完整的服务。

当节点收到读取请求时，该节点负责将其转发到持有相关分片的节点， 整理响应，并响应客户端。我们将该节点称为该请求的*协调节点*。基本流程 具体如下：

 1）解析对相关分片的读取请求。由于大多数搜索将发送到一个或多个索引， 所以它们通常需要从多个分片中读取数据，每个分片代表不同的数据子集。

2）从分片复制组中选择每个相关分片的活动副本。这可以是主分片primary或 复制分片replica。

3）向所选副本发送分片级读取请求。

4）合并结果并做出响应。在按 ID 查找的情况下，只有一个相关的分片，也就不需要合并。

**错误处理：**

- 如果所选分片没有响应读取请求，协调节点会将请求重新发送到同一复制组的其他分片。
- 如果复制组中的所有分片都没有响应，那么会导致请求的结果不完整，但是为了确保快速响应，`search`/`mutil search`/`bulk`/`multi get`API会以部分结果响应，并且状态码为200.

### 2、基本数据类型

es的基本数字类型有如下分类:

| 类型         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| byte         | 有符号的8位整数, 范围: [-128 ~ 127]                          |
| short        | 有符号的16位整数, 范围: [-32768 ~ 32767]                     |
| integer      | 有符号的32位整数, 范围: [−231−231 ~ 231231-1]                |
| long         | 有符号的64位整数, 范围: [−263−263 ~ 263263-1]                |
| float        | 32位单精度浮点数                                             |
| double       | 64位双精度浮点数                                             |
| half_float   | 16位半精度IEEE 754浮点类型                                   |
| scaled_float | 缩放类型的的浮点数, 比如price字段只需精确到分, 57.34缩放因子为100, 存储结果为5734 |

使用注意事项:

> 尽可能选择范围小的数据类型, 字段的长度越短, 索引和搜索的效率越高;
> 优先考虑使用带缩放因子的浮点类型.

使用示例：

```
PUT my_index
{
    "mappings": {
        "my_table_index": {
            "properties": {
                "name": {"type": "text"},
                "quantity": {"type": "integer"},  // integer类型
                "price": {
                    "type": "scaled_float",       // scaled_float类型
                    "scaling_factor": 100
                }
            }
        }
    }
}
```



### 3、数据检索方式

在传统关系型数据库中，原生的查询语句叫做`SQL`，在elasticsearch中，这类查询语句叫做`EQL`。除了EQL之外，ES还有针对各种编程语言提供了查询客户端，比如JAVA。本小节主要总结常用的EQL语法以及对应的JAVA-API实现。

![](http://cdn.gydblog.com/images/middleware/es-1.jpg)

> 词条查询，也就是ES不会对查询条件进行分词处理，只有当词条和查询字符串完全匹配时，才会被查询到。**注意查询字段带上keyword**。
>
> ElasticSearch 5.0以后，string类型有重大变更，移除了string类型，string字段被拆分成两种新的数据类型: text用于全文索引的，而keyword用于关键词搜索。 



**测试数据准备：**

| id   | title | phone       | createTime          | modifyTime          | address   | age  |      |      |      |
| ---- | ----- | ----------- | ------------------- | ------------------- | --------- | ---- | ---- | ---- | ---- |
| 1    | 张三  | 13762827777 | 2023-06-29 19:46:25 | 2023-06-29 19:46:25 | 上海市xxx | 11   |      |      |      |
| 2    | 李四  | 13762827778 | 2021-06-29 19:46:25 | 2021-06-29 19:46:25 | 上海市xxx | 12   |      |      |      |
| 3    | 王五  | 13762827779 | 2019-06-29 19:46:25 | 2019-06-29 19:46:25 | 浙江省xxx | 13   |      |      |      |

上面准备了三条数据，在es中创建的索引index是`testindex`。每条数据在es存储的格式如下：

```
{
  "_index" : "testindex",
  "_type" : "_doc",
  "_id" : "1",
  "_score" : 1.0,
  "_source" : {
    "id" : 1,
    "title" : "张三",
    "phone" : "13762827777",
    "modifyTime" : "2023-06-29 19:46:25",
    "createTime" : "2023-06-29 19:46:25",
    "address" : "上海市xxx",
    "age" : 11
  }
}
```

接下来演示使用各种查询方式查询上面的数据。

####  3.1 词条查询-精确查询

##### 1）单值查询

单值查询，即筛选出一个字段等于特定值的所有记录。

SQL：

```
SELECT *FROM testindex WHERE title = "张三"
```

EQL（**注意查询字段带上keyword**）：

```
{
	"query": {
		"term": {
			"title.keyword": {
				"value": "张三"
			}
		}
	}
}
```

请求接口：

```
#POST方式
http://ES-IP:9200/testindex/_search
#body数据
{
	"query": {
		"term": {
			"title.keyword": {
				"value": "张三"
			}
		}
	}
}
```

返回数据结果：

```
{
  "took" : 0,
  "timed_out" : false,
  "_shards" : { // 分片信息
    "total" : 1, // 总计分片数
    "successful" : 1, // 查询成功的分片数
    "skipped" : 0, // 跳过查询的分片数
    "failed" : 0  // 查询失败的分片数
  },
  "hits" : { // 命中结果
    "total" : {
      "value" : 1, // 数量
      "relation" : "eq"  // 关系：等于
    },
    "max_score" : 2.8526313,  // 最高分数
    "hits" : [
      {
        "_index" : "testindex", // 索引
        "_type" : "_doc", // 类型
        "_id" : "1",
        "_score" : 2.8526313,
        "_source" : {
          "id" : 1,
          "title" : "张三",
          "phone" : "13762827777",
          "modifyTime" : "2023-06-29 19:46:25",
          "createTime" : "2023-06-29 19:46:25"
        }
      }
    ]
  }
}
```

Java写法：

```
// 根据索引创建查询请求
SearchRequest searchRequest = new SearchRequest("testindex");
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.termQuery("title.keyword", "张三"));
searchRequest.source(searchSourceBuilder);
SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

```

仔细观察查询结果，会发现ES查询结果中会带有`_score`这一项，ES会根据结果匹配程度进行评分。打分是会耗费性能的，如果确认自己的查询不需要评分，就设置查询语句关闭评分：

```javascript
{
	"query": {
		"constant_score": {
			"filter": {
				"term": {
					"title.keyword": {
						"value": "张三",
                           "boost": 1.0
					}
				}
			},
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 这样构造的查询条件，将不进行score计算，从而提高查询效率
searchSourceBuilder.query(QueryBuilders.constantScoreQuery(QueryBuilders.termQuery("title.keyword", "张三")));
```

##### 2）多值查询

多值查询类似Mysql里的IN查询。

SQL：

```
SELECT *FROM testindex WHERE title IN("张三","李四")
```

EQL：

```
#POST方式
http://ES-IP:9200/testindex/_search
#body数据
{
	"query": {
		"terms": {
			"title.keyword": [
				"张三",
				"李四"
			],
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.termsQuery("title.keyword", Arrays.asList("张三", "李四")));
```

#### 3.2 词条查询-模糊查询

模糊查询类似Mysql里的LIKE查询。细分为前缀查询和通配符查询。通配符查询，与前缀查询类似，都属于模糊查询的范畴，但通配符显然功能更强。

##### 1）通配符查询

通配符查询SQL如下：

SQL：

```
SELECT *FROM testindex WHERE title LIKE "张%"
```

EQL：

```
{
	"query": {
		"wildcard": {
			"title.keyword": {
				"wildcard": "张*",
				"boost": 1.0
			}
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.wildcardQuery("title.keyword","张*"));
```

##### 2）前缀查询

EQL：

```
{
	"query": {
		"prefix": {
			"title.keyword": {
				"value": "张",
				"boost": 1.0
			}
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.prefixQuery("title.keyword","张"));
```



#### 3.3 词条查询-范围查询

范围查询，即查询某字段在特定区间的记录。

SQL：

```
select * from testindex where id between 1 and 3;
```

EQL：

```
{
	"query": {
		"range": {
			"id": {
				"from": 1,
				"to": 3,
				"include_lower": true,
				"include_upper": true,
				"boost": 1.0
			}
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.rangeQuery("id").gte(1).lte(3));
```



#### 3.4 匹配查询

匹配（Match）查询属于全文（Fulltext）查询，不同于词条查询，ElasticSearch引擎在处理全文搜索时，首先分析（analyze）查询字符串，然后根据分词构建查询，最终返回查询结果。匹配查询共有三种类型，分别是布尔（boolean）、短语（phrase）和短语前缀（phrase_prefix），默认的匹配查询是布尔类型，这意味着，ElasticSearch引擎首先分析查询字符串，根据分析器对其进行分词，例如，对于以下match查询：

```
"query":{  
      "match":{  
         "title":"张三"
      }
      }
```

查询字符串是“张三”，被分析器分词之后，产生三个字符：张，三，然后根据分析的结果构造一个布尔查询，默认情况下，引擎内部执行的查询逻辑是：只要title字段值中包含有任意一个关键字张、三，那么返回该文档，伪代码是：

```
if (doc.eventname contains "张" or doc.eventname contains "三") 
return doc
```

小郭的业务开发中暂时没有需要用到匹配查询的需求，等后续有实际需求时再来学习补充本小节的知识。

#### 3.5 复合查询-bool查询

前面的例子都是单个字段条件查询，在实际应用中，我们很有可能会过滤多个值或字段。先看一个简单的例子：

```javascript
select * from testindex where title = '张三' and phone = '13762827777';
```

这样的多条件等值查询，就要借用到组合过滤器了，其查询语句是：

```javascript
{
	"query": {
		"bool": {
			"must": [
				{
				    "term": {
						"title.keyword": {
							"value": "张三",
							"boost": 1.0
						}
					}
				},
				{
					"term": {
						"phone.keyword": {
							"value": "13762827777",
							"boost": 1.0
						}
					}
				}
			],
			"adjust_pure_negative": true,
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.boolQuery()
        .must(QueryBuilders.termQuery("title.keyword", "张三"))
        .must(QueryBuilders.termQuery("phone.keyword", "13762827777")));
```

布尔过滤器（`bool filter`）属于复合过滤器（`compound filter`）的一种 ，可以接受多个其他过滤器作为参数，并将这些过滤器结合成各式各样的布尔（逻辑）组合。 

![](http://cdn.gydblog.com/images/middleware/es-2.png)

bool 过滤器下可以有4种子条件，可以任选其中任意一个或多个。filter是比较特殊的，这里先不说。

```javascript
{
   "bool" : {
      "must" :     [],
      "must_not" : [],
      "should" :   [],
   }
}
```

- **`must`**：所有的语句都必须匹配，与 ‘=’ 等价。
- **`must_not`**：所有的语句都不能匹配，与 ‘!=’ 或 not in 等价。
- **`should`**：至少有n个语句要匹配，n由参数控制。

其中：所有 `must` 语句必须匹配，所有 `must_not` 语句都必须不匹配，但有多少 `should` 语句应该匹配呢？默认情况下，没有 `should` 语句是必须匹配的，只有一个例外：那就是当没有 `must` 语句的时候，至少有一个 `should` 语句必须匹配。

可以通过 `minimum_should_match` 参数控制需要匹配的 should 语句的数量，它既可以是一个绝对的数字，又可以是个百分比：

```
{
	"query": {
		"bool": {
			"must": [
				{
					"term": {
						"title.keyword": {
							"value": "张三",
							"boost": 1.0
						}
					}
				}
			],
			"should": [
				{
					"term": {
						"address.keyword": {
							"value": "上海",
							"boost": 1.0
						}
					}
				},
				{
					"term": {
						"phone": {
							"value": "13762827777",
							"boost": 1.0
						}
					}
				}
			],
			"adjust_pure_negative": true,
			"minimum_should_match": "1",
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
        .must(QueryBuilders.termQuery("title.keyword", "张三"))
        .should(QueryBuilders.termQuery("address.keyword", "上海"))
        .should(QueryBuilders.termQuery("phone.keyword", "13762827777"))
        .minimumShouldMatch(1);// 设置should至少需要满足几个条件
// 将BoolQueryBuilder构建到SearchSourceBuilder中
searchSourceBuilder.query(boolQueryBuilder);
```



接下来总结下filter查询的知识。

**filter查询**

query和filter的区别：query查询的时候，会先比较查询条件，然后计算分值，最后返回文档结果；而filter是先判断是否满足查询条件，如果不满足会缓存查询结果（记录该文档不满足结果），满足的话，就直接缓存结果，**filter不会对结果进行评分，能够提高查询效率**。

filter的使用方式比较多样，下面用几个例子演示一下。

**方式一，单独使用：**

> 单独使用时，filter与must基本一样，不同的是**filter不计算评分，效率更高**。

```
{
	"query": {
		"bool": {
			"filter": [
				{
					"term": {
						"title.keyword": {
							"value": "张三",
							"boost": 1.0
						}
					}
				}
			],
			"adjust_pure_negative": true,
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.boolQuery()
        .filter(QueryBuilders.termQuery("title.keyword", "张三"))
);
```

**方式二，和must、must_not同级，相当于子查询：**

EQL：

```
{
	"query": {
		"bool": {
			"must": [
				{
					"term": {
						"title.keyword": {
							"value": "张三",
							"boost": 1.0
						}
					}
				}
			],
			"filter": [
				{
					"term": {
						"address": {
							"value": "上海",
							"boost": 1.0
						}
					}
				}
			],
			"adjust_pure_negative": true,
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.boolQuery()
        .must(QueryBuilders.termQuery("title.keyword", "张三"))
        .filter(QueryBuilders.termQuery("address", "上海"))
);
```



**方式三，将must、must_not置于filter下，这种方式是最常用的：**

```javascript
{
	"query": {
		"bool": {
			"filter": [
				{
					"bool": {
						"must": [
							{
								"term": {
									"title.keyword": {
										"value": "张三",
										"boost": 1.0
									}
								}
							},
							{
								"range": {
									"id": {
										"from": 1,
										"to": 3,
										"include_lower": true,
										"include_upper": true,
										"boost": 1.0
									}
								}
							}
						],
						"must_not": [
							{
								"term": {
									"address.keyword": {
										"value": "上海",
										"boost": 1.0
									}
								}
							}
						],
						"adjust_pure_negative": true,
						"boost": 1.0
					}
				}
			],
			"adjust_pure_negative": true,
			"boost": 1.0
		}
	}
}
```

Java写法：

```
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 构建查询语句
searchSourceBuilder.query(QueryBuilders.boolQuery()
        .filter(QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("title.keyword", "张三"))
                .must(QueryBuilders.rangeQuery("id").gte(1).lte(3))
                .mustNot(QueryBuilders.termQuery("address.keyword", "上海")))
);
```

#### 3.6 聚合查询

##### 1）最值/平均值/求和

 **查询最大年龄、最小年龄、平均年龄**

SQL：

```
select max(age) from testindex;
```

EQL：

```
{
	"size": 20,	
	"aggregations": {
		"max_age": {
			"max": {
				"field": "age"
			}
		}
	}
}
```

Java写法：

```
// 聚合查询条件
AggregationBuilder aggBuilder = AggregationBuilders.max("max_age").field("age");
SearchRequest searchRequest = new SearchRequest("testindex");
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
//使用聚合查询，结果中默认只会返回10条文档数据（当然我们关心的是聚合的结果，而非文档）。返回多少条数据可以自主控制：
searchSourceBuilder.size(20);

// 将聚合查询条件构建到SearchSourceBuilder中
searchSourceBuilder.aggregation(aggBuilder);
searchRequest.source(searchSourceBuilder);

// 执行查询，获取SearchResponse
SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
```

其它最值查询类似：

```
AggregationBuilder minBuilder = AggregationBuilders.min("min_age").field("age");
AggregationBuilder avgBuilder = AggregationBuilders.avg("min_age").field("age");
AggregationBuilder sumBuilder = AggregationBuilders.sum("min_age").field("age");
AggregationBuilder countBuilder = AggregationBuilders.count("min_age").field("age");
```



##### 2）去重查询

> 查询有多少个不同的名字

SQL：

```
select count(distinct title) from testindex;
```

EQL：

```
{
	"aggregations": {
		"title_count": {
			"cardinality": {
				"field": "title.keyword"
			}
		}
	}
}
```

Java写法：

```
// 创建某个索引的request
SearchRequest searchRequest = new SearchRequest("testindex");
// 查询条件
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 聚合查询
AggregationBuilder aggBuilder = AggregationBuilders.cardinality("sect_count").field("sect.keyword");
searchSourceBuilder.size(0);
// 将聚合查询构建到查询条件中
searchSourceBuilder.aggregation(aggBuilder);
searchRequest.source(searchSourceBuilder);
// 执行查询，获取结果
SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
```

##### 3）分组聚合

**单条件分组**

> 查询每个地区的人数

SQL：

```
select address,count(id) from testindex group by address;
```

EQL：

```
{
	"size": 0,
	"aggregations": {
		"address_count": {
			"terms": {
				"field": "address.keyword",
				"size": 10,
				"min_doc_count": 1,
				"shard_min_doc_count": 0,
				"show_term_doc_count_error": false,
				"order": [
					{
						"_count": "desc"
					},
					{
						"_key": "asc"
					}
				]
			}
		}
	}
}
```

Java实现：

```
SearchRequest searchRequest = new SearchRequest("testindex");
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
searchSourceBuilder.size(0);
// 按address分组
AggregationBuilder aggBuilder = AggregationBuilders.terms("address_count").field("address.keyword");
searchSourceBuilder.aggregation(aggBuilder);
```

**查询聚合**

> 前面所有聚合的例子请求都省略了 query ，整个请求只不过是一个聚合。这意味着我们对全部数据进行了聚合，但现实应用中，我们常常对特定范围的数据进行聚合，先筛选一批数据，再聚合统计。

> 下面的例子：查询上海地区年龄最大的人

SQL：

```
select max(age) from testindex where address = '上海';
```

EQL：

```
{
	"query": {
		"term": {
			"address": {
				"value": "上海",
				"boost": 1.0
			}
		}
	},
	"aggregations": {
		"max_age": {
			"max": {
				"field": "age"
			}
		}
	}
}
```

Java写法：

```
SearchRequest searchRequest = new SearchRequest("testindex");
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
// 聚合查询条件
AggregationBuilder maxBuilder = AggregationBuilders.max("max_age").field("age");
// 等值查询
searchSourceBuilder.query(QueryBuilders.termQuery("address", "上海"));
searchSourceBuilder.aggregation(maxBuilder);
```

### 4、命名规范

实际中使用Elasticsearch，首要需要考虑定义索引、映射以及字段等，本小节总结了一些必要的命名规范。

#### 4.1 索引
索引受文件系统的限制。仅可能为小写字母，不能下划线开头。同时需遵守下列规则：

- 不能包括 , /, *, ?, ", <, >, |, 空格, 逗号, #。
- 7.0版本之前可以使用冒号:,但不建议使用并在7.0版本之后不再支持。
- 默认Elasticsearch内部使用的字段名称使用_开始。我们的索引不能以这些字符 -, _, + 开头。
- 不能包括 . 或 …。
- 长度不能超过 255 个字符，建议索引名称字符长度不要超过32位，字段名称字符长度不要超过32位。
- 索引名称不区分大小写，建议全部由字母、数字组成，字母开头。

以上这些命名限制是因为当Elasticsearch使用索引名称作为磁盘上的目录名称，这些名称必须符合不同操作系统的约定。
我猜想未来可能会放开这些限制，因为我们使用uuid关联索引放在磁盘上，而不使用索引名称 。

#### 4.2 类型

类型名称可以包括除了null的任何字符，不能以下划线开头。7.0版本之后不再支持类型，默认为`_doc`。

#### 4.3 字段

对于对象类型，举例：

```
"foo.bar.baz": "abc"
```

等同于：

```
"foo": {
  "bar": {
    "baz": "abc"
  }
}
```

#### 4.4 路由

路由命名也是除了空的任何字符。多个路由值传入查询字符串，使用逗号分隔，如：

```
?routing=foo,bar
```

如果路由值包含逗号，会造成路由值解析错误。

### 5、最佳实践

#### 5.1 索引性能调优

> 经验来源于网络搜集

- **严格设置存储和索引开关，不要将数据全部存储或者全部索引**

  Elasticsearch支持持久化和索引，但是Elasticsearch主要场景是全文检索，成本昂贵。建议根据业务只将需要索引的Field进行索引，不仅节省索引成本，而且在操作时速度更快、效率更高！

- 禁止使用多type索引 ，避免索引稀疏

​      Elasticsearch支持对同一个索引，划分不同的type进行读写，数据以type级别进行隔离。但是  Elasticsearch多type索引共用_id，其version往往容易产生冲突，而且6.x版本开始逐渐转向单type索引的设计，7.x之后将不再支持多type索引。

- **副本数不大于3**

  Elasticsearch默认副本数是1，即存在1个primary和1个replica共两份数据，主备形式同步，为了提升数据的安全性，避免数据丢失，可以设置副本数为2，即存在1个primary和两个replica共三份数据。但是没有必要设置过大的副本数，Elasticsearch的复制会对集群性能产生影响，特别是refresh_interval设置比较小的集群。

- **禁止自动创建索引**

  Elasticsearch的索引默认可以自动创建，必须禁用掉。

  自动创建索引无法避免误操作带来的元数据治理问题，设置`action.auto_create_index`为`false`。

- **创建完索引，禁用掉自动类型mapping**

  Elasticsearch的索引默认可自动类型mapping，必须禁用掉。自动创建mapping会带来类型与实际类型不匹配的问题，设置`index.mapper.dynamic`为`false`。

- **字符串mapping设置，优先使用keyword**

  Elasticsearch的索引默认支持keyword和text，text用于分词场景，keyword不支持分词，不使用分词时，需要明确指定类型为keyword。

- **mapping设置，慎用嵌套类型**

​    Elasticsearch的索引默认支持mapping嵌套，正常情况下慎用嵌套类型，如果使用嵌套类型，建议深度不要超过2，嵌套类型文档内部更新无法原子更新。

- **join设计，慎用nested和parent-child**

Elasticsearch的索引默认不支持join，建议应用程序自身处理。如果需要在父子两个文档都需要进行过滤，或者需要返回父子两个文档的field，建议使用nested，其他场景建议使用parent-child。

通常情况下，nested比parent-child查询快5-10倍，但parent-child更新文档比较方便。

- **索引字段数不要太多，字段类型占用内存越少越好**

  Elasticsearch的索引最多默认支持1000个字段，Elasticsearch的字段数越多，对于集群缓存的消耗越严重，通常建议不要超过50个字段。

  建议设计过程中，非索引和聚合字段不要存放到Elasticsearch中，可以使用其他存储引擎，比如mysql、hbase等。

- **禁用掉_all和_source**

  Elasticsearch的索引默认开启_all和_source，除了正常的存储和索引之外，还存放着原始写入记录、其他的元数据信息，这些信息可以直接使用正常的存储和索引filed进行替代，禁用掉可以提升集群性能，也可以在进行查询和搜索时进行exclude或者include设置。

- **设置合理延迟分片平衡时间**

  Elasticsearch的集群对网络的稳定性有很大的依赖，默认延迟分片平衡时间是1m，即副本在1分钟内恢复到集群，则不会进行重新分片。如果运维过程中，断网时间较长，建议修改该参数，避免来回创建分片、移动分片，为运维和节点异常恢复提供缓冲时间。

- **分片数根据业务数据量和集群规模进行设置**

​    Elasticsearch默认分片数是5， 不同的业务索引分片数应该根据实际情况进行设置，如果索引数据量特别小且未来的增量有限，可以适当减少分片数，因为分片作为Elasticsearch集群的元数据在分片数很多的情况下，集群的同步管理和故障恢复会存在一定的风险。

​    如果索引数据量特别大，需要根据数据量和集群规模进行设置，一个分片建议在10亿级别，最大数据量建议是40亿。同时分片数也受集群规模影响，集群节点数太少不宜设置过多的分片数，会导致同一个索引的多个分片存在于一个Elasticsearch节点中，出现故障恢复较慢。

​    可以在集群节点上保存的分片数量与节点服务器可用的堆内存大小成正比，但这在Elasticsearch中没有固定的限制。 **一个很好的经验法则是：确保每个节点的分片数量保持在低于每1GB堆内存对应集群的分片在20-25之间。** 因此，具有30GB堆内存的节点最多可以有600-750个分片，但是这只是极限值，实际应用中建议低于此限制， 这通常会帮助九群保持处于健康状态。

#### 5.2 查询性能调优

- **在查询中设置明确的超时时间**

   几乎所有的Elasticsearch API都允许用户指定超时。

   找出并摆脱耗时长的操作，节省相关资源，建立稳定的服务，这将对应用程序和Elasticsearch集群都有帮助。

- **谨慎使用Scan和Scroll**

Elasticsearch默认只支持查询最多10000条记录，from+size不能大于10000。这种深度分页会随着请求的页次增加，所消耗的内存和时间的增长也是成比例的增加。

深分页场景可以使用Scan或者Scroll，但是谨慎使用Scan和Scroll，因为滚动上下文代价很高，建议不要将其用于实时用户请求，对于大索引，频繁的Scan和Scroll对Elasticsearch集群的稳定性影响非常大，可能会导致jvm假死等甚至宕机等恶劣结果发生。

针对实时场景，建议禁止掉，针对离线场景请谨慎使用！

- **使用size:0和includes/excludes限定字段返回**

  Elasticsearch在添加size:0子句前后会带来显著的性能差异 。

  除非业务需要，才返回必要字段，否则，无需返回的字段通过includes和excludes控制。

- **API调用使用rest接口，慎用transport方式**

Elasticsearch的客户端api，native-api支持transport方式访问集群，该方式跟集群内部通信采用统一的基于netty方式通信，持续性写入系统可以采用transport方式。正常的客户端进行索引的查询，使用基于dsl方式的restful接口即可，httpclient访问效率更高。

- **避免前缀模糊匹配**

  Elasticsearch 默认支持通过 *? 正则表达式来做模糊匹配，如果在一个数据量较大规模的索引上执行模糊匹配，尤其是前缀模糊匹配，通常耗时会比较长，甚至可能导致内存溢出。尽量避免在有高并发查询请求的生产环境执行这类操作。

  某客户需要对车牌号进行模糊查询，通过查询请求 **"车牌号:\*A8848\*"**  查询时，往往导致整个集群负载较高。通过对数据预处理，增加冗余字段 "车牌号.keyword"，并事先将所有车牌号按照1元、2元、3元...7元分词后存储至该字段，字段存储内容示例：沪,A,8,4,沪A,A8,88,84,48,沪A8...沪A88488。通过查询"**车牌号.keyword:A8848**"即可解决原来的性能问题。

- ### 避免查询深度翻页

  Elasticsearch 默认只允许查看排序前 10000 条的结果，当翻页查看排序靠后的记录时，响应耗时一般较长。使用 **search_after** 方式查询会更轻量级，如果每次只需要返回 10 条结果，则每个 shard 只需要返回 search_after 之后的 10 个结果即可，返回的总数据量只是和 shard 个数以及本次需要的个数有关，和历史已读取的个数无关。

  **使用search_after、from&size、scroll的一些说明：**

  - 使用search_after时 from设置为0，-1或者直接不加from
  - 使用search_after 进行分页 相比from&size的方式要更加高效，而且在不断有新数据入库的时候仅仅使用from和size分页会有重复的情况
  - 相比使用scroll分页，search_after可以进行实时的查询
  - search_after不适合跳跃式的分页

   

- **配置查询聚合节点**

  查询聚合节点可以发送子查询请求到其他节点，收集和合并结果，以及响应发出查询的客户端。通过给查询聚合节点配置更高规格的 CPU 和内存，可以加快查询运算速度、提升缓存命中率。

  某客户使用 25 台 8 核 CPU32G 内存节点 Elasticsearch 集群，查询 QPS 在 4000 左右。增加 6 台 16 核 CPU32G 内存节点作为查询聚合节点，观察服务器 CPU、JVM 堆内存使用情况，并调整缓存、分片、副本参数，查询 QPS 达到 12000。

  具体配置如下

  ```
  # 查询聚合节点配置(conf/elasticsearch.yml)：
  node.master: false
  node.data: false
  node.ingest: false
  ```

- **配置合适的分词器**

Elasticsearch 内置了很多分词器，包括 standard、cjk、nGram 等，也可以安装自研/开源分词器。根据业务场景选择合适的分词器，避免全部采用默认 standard 分词器。

常用的分词器如下：

 **standard**：默认分词，英文按空格切分，中文按照单个汉字切分。

**cjk**：根据二元索引对中日韩文分词，可以保证查全率。

**nGram**：可以将英文按照字母切分，结合ES的短语搜索(match_phrase)使用。

**IK**：比较热门的中文分词，能按照中文语义切分，可以自定义词典。

**pinyin**：可以让用户输入拼音，就能查找到相关的关键词。

**aliws**：阿里巴巴自研分词，支持多种模型和分词算法，词库丰富，分词结果准确，适用于电商等对查准要求高的场景。 

#### 5.3 其它优化

- **不同的业务场景进行集群级别隔离**

​    不要将不同业务场景的数据都放到一个Elasticsearch集群中，建议实时业务和离线业务分开部署。因为Elasticsearch集群的读写参数配置是所有索引共享的，高峰期会存在相互影响。

​    建议根据读写频率和实时性要求不同，划分不同的集群进行隔离，根据不同的业务场景设置集群参数！

- **禁止存放大文本或者二进制数据**

  Elasticsearch支持大文本和二进制数据，但是大文本和二进制数据会占用集群的内存和磁盘空间，影响集群的磁盘io和缓存效率。

建议将大文本或者二进制数据单独存储在其他的文件系统或者存储系统，然后通过Elasticsearch存放大文本或者二进制数据的存放位置。

- **遵循良好的命名规范**

​	本文的上一节有提到命名规范细则。

### 6、SpringBoot应用接入说明

#### 6.1 引入依赖

```
<!---开箱即用，默认使用的和当前使用的springboot的一一致的spring-data-elasticsearch-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

这其中有个坑就是，如果你想升级单独升级pring-boot-starter-data-elasticsearch 的版本而不升级springboot的版本，启动的时候就会报错，建议还是按照官方的版本对应关系进行选择，避免不必要的麻烦：

> 官方参考链接：https://docs.spring.io/spring-data/elasticsearch/docs/3.2.4.RELEASE/reference/html/#reference

![](http://cdn.gydblog.com/images/middleware/es-4.png)

#### 6.2 配置

```java
@Configuration
@Slf4j
public class EsClientConfig extends AbstractElasticsearchConfiguration {

    @Resource
    AppConfig appConfig;
    @Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
        log.info("[RestClientConfig] ----------> url={}", appConfig.getEsUrl());
        final ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(appConfig.getEsUrl())
                .withBasicAuth(appConfig.getEsUsername(), appConfig.getEsPassword())
                .build();
        return RestClients.create(clientConfiguration).rest();
    }
}
```

#### 6.3 应用

##### 1）索引配置初始化

> 可以在程序运行过程中业务访问的时候动态创建索引，或者提前创建好索引。小郭这里选择了第二种方式

定义索引结构实体类：

```
public class DemoBean {
    private int id;
    private String title;
    private Date addDate;
    public DemoBean(int id, String title, Date addDate) {
        this.id = id;
        this.title = title;
        this.addDate = addDate
    }
}
```

准备一份符合elasticsearch规范的索引字段映射描述文件（包含三个字段：title、add_date、insert_time）

```
{
  "properties": {
      "id": {
      "type": "long"
    } ,
    "title": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "add_date": {
      "type": "date",
      "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
    }
  }
}
```

在应用启动时加载描述文件，生成索引：

```
package com.gyd.es;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.xcontent.XContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
 
@Component
@Order(value = 0)
@Slf4j
public class InitEsIndex implements CommandLineRunner {

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    AppConfig appConfig;

    @Autowired
    RestHighLevelClient restHighLevelClient;
    /**
     * 项目启动的时候，如果elasticsearch已经存有索引，则不做任何操作
     * 如果没有索引，则新建索引
     *
     * @param args
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {
        if (appConfig.getEsEnable()) {
            GetIndexRequest getIndexRequest = new GetIndexRequest(appConfig.getCaseEsIndexName());
            boolean indexExists = restHighLevelClient.indices().exists(getIndexRequest, RequestOptions.DEFAULT);
            if (indexExists){
                log.warn("存在索引");
            }else {
                log.warn("索引不存在。。。");
                try {
                    String indexConfig = readIndexConfigFromJsonFile();
                    CreateIndexRequest request = new CreateIndexRequest(appConfig.getCaseEsIndexName());
                    request.mapping(appConfig.getEsType(),indexConfig,XContentType.JSON);
                    // 2、执行请求
                    CreateIndexResponse createIndexResponse = restHighLevelClient.indices().create(request, RequestOptions.DEFAULT);
                    boolean acknowledged = createIndexResponse.isAcknowledged();
                    boolean shardsAcknowledged = createIndexResponse.isShardsAcknowledged();
                    log.info("创建es索引：acknowledged= {},shardsAcknowledged = {}",acknowledged,shardsAcknowledged);
                }catch (Exception e){
                    log.error("error: {}", e.getLocalizedMessage());
                }
            }
        } else {
            log.warn("未开启es...skip");
        }

    }

    public String readIndexConfigFromJsonFile() throws IOException {
        Resource resource = applicationContext.getResource("classpath:es.json");
        InputStream inputStream = resource.getInputStream();
        String indexConfig = IOUtils.toString(inputStream, String.valueOf(StandardCharsets.UTF_8));
        return indexConfig;
    }
}

```

##### 2）索引操作

```
package com.gyd.controller;

import io.swagger.annotations.ApiOperation;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import java.io.IOException;

@RestController
@RequestMapping("/es/tool/index/")
@ApiIgnore
public class ElasticSearchIndexToolController {
    @Autowired(required = false)
    RestHighLevelClient restHighLevelClient;
  
    @GetMapping(value = "/addIndex")
    @ApiOperation("测试添加索引（不能重复添加相同索引）")
    public ResultWrapper<String> addIndex(@RequestParam(name = "indexName") String indexName) throws IOException {
        // 1、创建索引请求
        CreateIndexRequest request = new CreateIndexRequest(indexName);
        // 2、执行请求
        CreateIndexResponse createIndexResponse = restHighLevelClient.indices().create(request, RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS("测试"+createIndexResponse.toString());
        //BulkRequest的方式可以支持批量操作
        //        BulkRequest request = new BulkRequest();
//        request.add(new IndexRequest("demoindex","doc").source(JSONObject.toJSONString(demoBean ), XContentType.JSON));
//         BulkResponse bulk = restHighLevelClient.bulk(request);
//        return ResultWrapper.SUCCESS("测试"+bulk.toString());
    }
  
    @GetMapping(value = "/existIndex")
    @ApiOperation("判断索引是否存在")
    public ResultWrapper<Boolean> existIndex(@RequestParam(name = "indexName") String indexName) throws IOException {
        GetIndexRequest request = new GetIndexRequest(indexName);
        boolean exists = restHighLevelClient.indices().exists(request, RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS(exists);
    }
    
    @GetMapping(value = "/deleteIndex")
    @ApiOperation("测试删除索引")
    public ResultWrapper<AcknowledgedResponse> deleteIndex(@RequestParam(name = "indexName") String indexName) throws IOException {
        DeleteIndexRequest request = new DeleteIndexRequest(indexName);
        AcknowledgedResponse delete = restHighLevelClient.indices().delete(request, RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS(delete);
    }
}
```



##### 3）文档操作

```
package com.gyd.controller;

import com.alibaba.fastjson.JSON;
import io.swagger.annotations.ApiOperation;

import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/es/tool/doc/")
@ApiIgnore
public class ElasticSearchDocToolController {
    @Autowired(required = false)
    RestHighLevelClient restHighLevelClient;

    private String indexName = "testindex";
    private String type = "_doc";

    @GetMapping(value = "/addDoc")
    @ApiOperation("测试在索引中添加文档(如果没有索引会自动创建)")
    public ResultWrapper<String> addDoc(@RequestParam(name = "indexName") String indexName,@RequestParam(name = "id") String id) throws IOException {
        // 创建对象
        DemoBean demoBean = new DemoBean(Integer.parseInt(id),"测试1",new Date());
        // 创建请求 规则:put /testindex/_doc/1
        IndexRequest indexRequest = new IndexRequest(indexName,type,String.valueOf(demoBean.getId()));
        // 将我们的数据放入请求 json
        String jsonUser = JSON.toJSONString(demoBean);
        indexRequest.source(jsonUser, XContentType.JSON);
        // 客户端发送请求
        IndexResponse index = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS(index.toString());

    }

    @GetMapping(value = "/queryDoc")
    @ApiOperation("查询文档")
    public ResultWrapper<String> queryDoc(@RequestParam(name = "indexName") String indexName,@RequestParam(name = "id") String id) throws IOException {
        // get /index/_doc/1
        GetRequest getRequest = new GetRequest(indexName, type,id);
        GetResponse getResponse = restHighLevelClient.get(getRequest, RequestOptions.DEFAULT);
        System.out.println("getResponse = " + getResponse);
        return ResultWrapper.SUCCESS(getResponse.getSourceAsString());
    }
    
    @GetMapping(value = "/updateDoc")
    @ApiOperation("更新文档")
    public ResultWrapper<UpdateResponse>  updateDocument(@RequestParam(name = "indexName") String indexName,@RequestParam(name = "id") String id) throws IOException {
        // post /index/_doc/1/_update
        UpdateRequest updateRequest = new UpdateRequest(indexName,type, id);
        // 修改内容
        DemoBean demoBean = new DemoBean(Integer.parseInt(id),"测试1",new Date());

        String jsonUser = JSON.toJSONString(demoBean);
        updateRequest.doc(jsonUser,XContentType.JSON);

        UpdateResponse update = restHighLevelClient.update(updateRequest, RequestOptions.DEFAULT);
        System.out.println("update = " + update);
        return ResultWrapper.SUCCESS(update);
    }

    @GetMapping(value = "/deleteDoc")
    @ApiOperation("删除文档")
    public ResultWrapper<DeleteResponse>  deleteDoc(@RequestParam(name = "indexName") String indexName,@RequestParam(name = "id") String id) throws IOException {
        // DELETE /index/_doc/1
        DeleteRequest deleteRequest = new DeleteRequest(indexName, type,id);
        DeleteResponse delete = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
        System.out.println("delete.status() = " + delete.status());
        return ResultWrapper.SUCCESS(delete);
    }

    @GetMapping(value = "/batchInsertDoc")
    @ApiOperation("批量插入文档")
    public ResultWrapper<BulkResponse> batchInsertDoc() throws IOException {
        BulkRequest bulkRequest = new BulkRequest();

        List<DemoBean> dataList = new ArrayList<>();
        dataList.add(new DemoBean(1,"测试1",new Date()));
        dataList.add(new DemoBean(2,"测试2",new Date()));
        dataList.add(new DemoBean(3,"测试3",new Date()));
        // 批处理请求
        int size = dataList.size();
        for (int i = 0; i < size; i++) {
            DemoBean bean = dataList.get(i);
            // 如果是批量更新、删除改这里就可以
            bulkRequest.add(new IndexRequest(indexName)
                    .id(""+bean.getId())
                            .type(type)
                    .source(JSON.toJSONString(bean),XContentType.JSON));
        }
        BulkResponse response = restHighLevelClient.bulk(bulkRequest,RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS(response);

    }

    @GetMapping(value = "/searchDoc")
    @ApiOperation("搜素文档")
    public ResultWrapper<SearchHits> search1() throws IOException {
        SearchRequest searchRequest = new SearchRequest(indexName);
        // 使用搜索条件构造器，构造搜索条件
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

        //查询条件，使用QueryBuilders 工具类，来实现
        // QueryBuilders.termQuery 精确查询
        //如果是中文需要在name后面增加'.keyword'!!!
        TermQueryBuilder queryBuilder = QueryBuilders.termQuery("title.keyword", "测试1");
        // QueryBuilders.matchAllQuery 匹配所有
//		MatchAllQueryBuilder allQueryBuilder = QueryBuilders.matchAllQuery();

        sourceBuilder.query(queryBuilder);
        searchRequest.source(sourceBuilder);

        SearchResponse search = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
        return ResultWrapper.SUCCESS(search.getHits());
    }
}

```





## 六、遇到的问题

- 创建索引时报ElasticsearchStatusException[Elasticsearch exception [type=too_long_frame_exception, reason=An HTTP line is larger than 4096 bytes.]]

  默认情况下ES对请求参数设置为4K，如果遇到请求参数长度限制可以在[elasticsearch](https://so.csdn.net/so/search?q=elasticsearch&spm=1001.2101.3001.7020).yml中修改如下相关参数：

```
http.max_initial_line_length: "8k"
http.max_header_size: "16k"

http.max_content_length: 500mb
```

​    修改完毕后重启服务

- [ElasticSearch High Level REST] 精确搜索termQuery搜不到结果

  代码里搜素时一开始用的是下面的方式

  ```
  //精确查找字段【title】="测试223"的文档
    SearchRequest searchRequest = new SearchRequest(indexName);
    // 使用搜索条件构造器，构造搜索条件
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
    //查询条件，使用QueryBuilders 工具类，来实现
    // QueryBuilders.termQuery 精确查询
    TermQueryBuilder queryBuilder = QueryBuilders.termQuery("title", "测试2");
    sourceBuilder.query(queryBuilder);
    searchRequest.source(sourceBuilder);
    SearchResponse search = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
    System.out.println("search.getHits() = " + JSON.toJSONString(search.getHits()));
    for (SearchHit hits:search.getHits().getHits()){
        System.out.println("hits.getSourceAsString() = " + hits.getSourceAsString());
     }
  ```

  发现查找不到，处理方法是在构造TermQueryBuilder对象时，在要检索的字段后面加上“.keyword”，亲测有效哦！

  ```
  TermQueryBuilder queryBuilder = QueryBuilders.termQuery("title.keyword", "测试2");
  ```

  

  ## 原因：

  term做精确查询可以用它来处理数字，布尔值，日期以及文本。查询数字时问题不大，但是当查询字符串时会有问题。term查询的含义是termQuery会去倒排索引中寻找确切的term,但是它并不知道分词器的存在。term表示查询字段里含有某个关键词的文档，terms表示查询字段里含有多个关键词的文档。也就是说直接对字段进行term本质上还是模糊查询，只不过不会对搜索的输入字符串进行分词处理罢了。如果想通过term查到数据，那么term查询的字段在索引库中就必须有与term查询条件相同的索引词，否则无法查询到结果。

  一句话解释： elasticsearch 里默认的IK分词器是会将每一个中文都进行了分词的切割，所以你直接想查一整个词，或者一整句话是无返回结果的。

  **关于keyword:**

  只能通过精确值搜索到，适合简短、结构化字符串，例如主机名、姓名、商品名称等，**可以用于过滤、排序、聚合检索，也可以用于精确查询**

  

  term查询和字段类型有关系，ElasticSearch两个数据类型：

  - text：会分词，不支持聚合
  - keyword：不会分词，将全部内容作为一个词条，支持聚合

  term查询：不会对查询条件进行分词。但是注意，term查询，查询text类型字段时，文档中类型为text类型的字段本身仍然会分词

   

  网上还有一种说法是将字段的type设置为keyword ，小郭没试过，有兴趣的朋友可以验证一下。


## 七、参考资料

[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/getting-started.html)