## 一、前言

最近接了个需求，需要实现一个全文检索页面，客户直接点名了要我们使用ElasticSearch，小郭在之前并没有使用过这个组件，特意花了两天时间对它的基础知识进行了学习，总结出来分享给有兴趣的小伙伴。

> 本文适合ElasticSearch的初学者阅读。

## 二、简介

### 1、起源

Elasticsearch 的起源于一家名为 Elasticsearch BV（现在的 Elastic N.V.） 的公司，该公司成立于 2012 年，总部位于荷兰阿姆斯特丹。Elasticsearch 的创始人之一是 Shay Banon（沙伊·巴农），他是 Elasticsearch BV 公司的创始人和首席技术官员（CTO）。Shay Banon 在创建 Elasticsearch 之前，曾经在开发搜索和实时分析方面的技术。他发现现有的搜索引擎在处理大规模数据时存在性能和扩展性方面的挑战，因此决定创建一个新的解决方案，以解决这些问题。

elasticsearch 最初的版本于 2010 年左右开始开发，并于 2010 年 2 月发布了第一个 alpha 版本。最初的版本注重了搜索引擎的性能和实时特性。随着时间的推移，Elasticsearch 逐渐吸引了更多的开发者和用户，他们在不同领域的应用中开始使用 Elasticsearch 来进行搜索、分析和数据存储。

在 Shay Banon 的领导下，Elasticsearch 不断演进和改进，引入了许多创新的功能，包括分布式架构、实时索引、强大的聚合框架等。随着 Elastic N.V. 公司的成立，Elasticsearch 成为 Elastic Stack（也称为 ELK Stack，现在称为 Elastic Stack），其中还包括 Logstash 和 Kibana 等工具，形成了一个全面的实时数据分析解决方案。

### 2、与传统数据库的区别

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

[5.0.0-alpha1 发行说明（之前在 2.x 中发布的更改） |Elasticsearch 指南 [5.3\] |弹性的](https://www.elastic.co/guide/en/elasticsearch/reference/5.3/release-notes-5.0.0-alpha1-2x.html)

[Elasticsearch 版本历史及新特性变化 | 程序员笔记 (knowledgedict.com)](https://www.knowledgedict.com/tutorial/elasticsearch-version-history.html)

[Past Releases of Elastic Stack Software | Elastic](https://www.elastic.co/cn/downloads/past-releases#elasticsearch)

[Elasticsearch版本和客户端介绍 - wangzhen3798 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wangzhen3798/p/13561211.html)

[Elasticsearch发展史 - wangzhen3798 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wangzhen3798/p/10751516.html)

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



### 2、2.x文档

> 2.0之前的文档在官网未找到，因此本小节仅记录了2.0以后的版本文档

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
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |
|                 |                                                              |

   





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

### 1、数据查询语法

> 本节内容来源：[ElasticSearch进阶：一文全览各种ES查询在Java中的实现-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1897321)
>
> 、[Elasticsearch高级操作及集群 - 掘金 (juejin.cn)](https://juejin.cn/post/7208015349450997816#heading-15)
>
> 感谢大佬们的总结！

在传统关系型数据库中，原生的查询语句叫做`SQL`，在elasticsearch中，这类查询语句叫做`EQL`。除了EQL之外，ES还有针对各种编程语言提供了查询客户端，比如JAVA。本小节主要总结常用的EQL语法以及对应的JAVA-API实现。

![](http://cdn.gydblog.com/images/middleware/es-1.jpg)

> 词条查询，也就是ES不会对查询条件进行分词处理，只有当词条和查询字符串完全匹配时，才会被查询到。**注意查询字段带上keyword**。
>
> ElasticSearch 5.0以后，string类型有重大变更，移除了string类型，string字段被拆分成两种新的数据类型: text用于全文索引的，而keyword用于关键词搜索。 



数据准备：

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

####  1.1 词条查询-精确查询

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

#### 1.2 词条查询-模糊查询

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



#### 1.3 词条查询-范围查询

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



#### 1.4 匹配查询

匹配（Match）查询属于全文（Fulltext）查询，不同于词条查询，ElasticSearch引擎在处理全文搜索时，首先分析（analyze）查询字符串，然后根据分词构建查询，最终返回查询结果。匹配查询共有三种类型，分别是布尔（boolean）、短语（phrase）和短语前缀（phrase_prefix），默认的匹配查询是布尔类型，这意味着，ElasticSearch引擎首先分析查询字符串，根据分析器对其进行分词，例如，对于以下match查询：

```
"query":{  
      "match":{  
         "title":"张三"
      }
```

查询字符串是“张三”，被分析器分词之后，产生三个字符：张，三，然后根据分析的结果构造一个布尔查询，默认情况下，引擎内部执行的查询逻辑是：只要title字段值中包含有任意一个关键字张、三，那么返回该文档，伪代码是：

```
if (doc.eventname contains "张" or doc.eventname contains "三") 
return doc
```



小郭的业务开发中暂时没有需要用到匹配查询的需求，等后续有实际需求时再来补充本小节的知识。

#### 1.5 复合查询-bool查询

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

#### 1.6 聚合查询

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



**多条件分组**

> 查询每个地区相同名字的人数

SQL：

```
select address,title,count(id) from testindex group by address,title;
```

EQL：

```
{
	"aggregations": {
		"address_count": {
			"terms": {
				"field": "address.keyword",
				"size": 10
			},
			"aggregations": {
				"title_count": {
					"terms": {
						"field": "title.keyword",
						"size": 10
					}
				}
			}
		}
	}
}
```

Java写法：

```
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



### 2、原生API

#### 1）查看集群索引列表

indices表示索引，是index的复数.

```
curl -X GET http://ip:9200/_cat/indices?v
#如果要模糊匹配，可以使用*，比如匹配test
curl -X GET http://ip:9200/_cat/indices?test_*?v
```

返回字段如下：

```
health status index                   uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   index_test~2022-06     6rb1BsHpSA-pHT7u_3UNWA  20   1        208            0      1.1mb        609.8kb
green  open   index_test~2022-07     smyDnnX3QB-4N81p4Wq9fA  30   1          4            1    222.4kb        111.2kb
```

返回字段含义如下：

- health:  green代表健康；yellow代表分配了所有主分片，但至少缺少一个副本，此时集群数据仍旧完整；red代表部分主分片不可用，可能已经丢失数据。 
- status：状态
- index：索引名称
- uuid：唯一标识
- pri：primary缩写，主分片数量 
- rep：副分片数量 
- docs.count： Lucene 级别的文档数量
-  docs.deleted： 删除的文档 
- store.size：全部分片大小（包含副本）
-  pri.store.size：主分片大小



#### 2）查看集群状态

```
curl -XGET http://ip:9200/_cat/health?v
```

返回字段含义分别如下：

- cluster ，集群名称 
- status，集群状态 green代表健康；yellow代表分配了所有主分片，但至少缺少一个副本，此时集群数据仍旧完整；red代表部分主分片不可用，可能已经丢失数据。 
- node.total，代表在线的节点总数量 
- node.data，代表在线的数据节点的数量 
- shards， active_shards 存活的分片数量 
- pri，active_primary_shards 存活的主分片数量 正常情况下 shards的数量是pri的两倍。 
- relo， relocating_shards 迁移中的分片数量，正常情况为 0 
- init， initializing_shards 初始化中的分片数量 正常情况为 0 
- unassign， unassigned_shards 未分配的分片 正常情况为 0 
- pending_tasks，准备中的任务，任务指迁移分片等 正常情况为 0 
- max_task_wait_time，任务最长等待时间 
- active_shards_percent，正常分片百分比 正常情况为 100%



#### 3）查看分片信息

- 查看es分片信息，精确匹配，比如匹配demoindex：

```
http://ip:9200/_cat/shards/demoindex?v
```

返回的信息如下：

```
index     shard prirep state      docs store ip            node
demoindex 0     p      STARTED       2 6.6kb 10.241.141.29 host-186a146302f
demoindex 0     r      UNASSIGNED    
```

字段含义如下：

- index：所有名称 
- shard：分片数 
- prirep：分片类型，p=pri=primary为主分片，r=rep=replicas为复制分片 
- state：分片状态，STARTED为正常分片，INITIALIZING为异常分片
-  docs：记录数 
- store：存储大小
- ip：es节点ip 
- node：es节点名称



#### 4）查看索引的元数据

```
http://IP:9200/indexName
```

示例：

```
http://127.0.0.1:9200/demoindex
```

返回结构：

```
{
    "demoindex": {
        "aliases": {},
        "mappings": {
            "properties": {
                "name": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256
                        }
                    }
                },
                "commentCount": {
                    "type": "long"
                },
                "createTime": {
                    "type": "long"
                },
                "id": {
                    "type": "long"
                },
            
                "score": {
                    "type": "float"
                },
                "status": {
                    "type": "long"
                },
                "type": {
                    "type": "long"
                },
               
                "userId": {
                    "type": "long"
                }
            }
        },
        "settings": {
            "index": {
                "routing": {
                    "allocation": {
                        "include": {
                            "_tier_preference": "data_content"
                        }
                    }
                },
                "number_of_shards": "1",
                "provided_name": "demoindex",
                "creation_date": "1702523639922",
                "number_of_replicas": "1",
                "uuid": "RjPiS89LRIed_TcjLGaFlA",
                "version": {
                    "created": "7170599"
                }
            }
        }
    }
```

上面列出的就是索引`demoindex`的字段属性配置，其中需要特别注意的是这个属性`ignore_above`，解释如下：

```
长度超过ignore_above设置的字符串将不会被索引。对于字符串数组，ignore_above将分别应用于每个数组元素，并且长度超过的字符串元素ignore_above不会被索引。
```

也就是说如果我们存储的对应text类型的字段值如果超过`ignore_above`的大小，则只会存储，不会做索引分词， 这样就会导致在搜索时你模糊查询可能搜索不到，但是如果精确查找还是可以搜到的。

#### 5）文档增删改查

| method | 请求url                                  | 示例                                             | 描述                   |
| ------ | ---------------------------------------- | ------------------------------------------------ | ---------------------- |
| PUT    | ip:9200/索引名称/类型名称/文档id         |                                                  | 创建文档（指定文档id） |
| POST   | ip:9200/索引名称/索引类型                |                                                  | 创建文档（随机文档id） |
| POST   | ip:9200/索引名称/类型名称/文档id/_update |                                                  | 修改文档               |
| DELETE | ip:9200/索引名称/类型名称/文档id         |                                                  | 删除文档               |
| GET    | ip:9200/索引名称/类型名称/文档id         | http://10.241.141.29:9200/comparisontools/_doc/1 | 通过文档id查询指定文档 |
| POST   | ip:9200/索引名称/类型名称/_search        |                                                  | 条件检索所有文档数据   |



### 3、基本配置

本文最全！

[Es 8.x Index和Mapping详解及Java API 注解-CSDN博客](https://blog.csdn.net/lixinkuan328/article/details/132695644)

[Elasticsearch入门必备——ES中的字段类型以及常用属性-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1022264)

### 4、命名规范

实际中使用Elasticsearch，首要需要考虑定义索引、映射以及字段等，本小节总结了一些必要的命名规范。

#### 1）索引
索引受文件系统的限制。仅可能为小写字母，不能下划线开头。同时需遵守下列规则：

- 不能包括 , /, *, ?, ", <, >, |, 空格, 逗号, #。
- 7.0版本之前可以使用冒号:,但不建议使用并在7.0版本之后不再支持。
- 默认Elasticsearch内部使用的字段名称使用_开始。我们的索引不能以这些字符 -, _, + 开头。
- 不能包括 . 或 …。
- 长度不能超过 255 个字符，建议索引名称字符长度不要超过32位，字段名称字符长度不要超过32位。
- 索引名称不区分大小写，建议全部由字母、数字组成，字母开头。

以上这些命名限制是因为当Elasticsearch使用索引名称作为磁盘上的目录名称，这些名称必须符合不同操作系统的约定。
我猜想未来可能会放开这些限制，因为我们使用uuid关联索引放在磁盘上，而不使用索引名称 。



#### 2）类型

类型名称可以包括除了null的任何字符，不能以下划线开头。7.0版本之后不再支持类型，默认为`_doc`。



#### 3）字段

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

#### 4）路由

路由命名也是除了空的任何字符。多个路由值传入查询字符串，使用逗号分隔，如：

```
?routing=foo,bar
```

如果路由值包含逗号，会造成路由值解析错误。

### 5、优化建议

#### 1）索引性能调优建议

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



#### 2）查询性能调优建议

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

#### 3）其它优化建议

- **不同的业务场景进行集群级别隔离**

​    不要将不同业务场景的数据都放到一个Elasticsearch集群中，建议实时业务和离线业务分开部署。因为Elasticsearch集群的读写参数配置是所有索引共享的，高峰期会存在相互影响。

​    建议根据读写频率和实时性要求不同，划分不同的集群进行隔离，根据不同的业务场景设置集群参数！

- **禁止存放大文本或者二进制数据**

  Elasticsearch支持大文本和二进制数据，但是大文本和二进制数据会占用集群的内存和磁盘空间，影响集群的磁盘io和缓存效率。

建议将大文本或者二进制数据单独存储在其他的文件系统或者存储系统，然后通过Elasticsearch存放大文本或者二进制数据的存放位置。

- **遵循良好的命名规范**

​	本文的上一节有提到命名规范细则。

## 六、遇到的问题

- [ElasticSearch High Level REST] 精确搜索termQuery搜不到结果

  代码里搜素时一开始用的是下面的方式

  ```
  //精确查找字段【title】="测试223"的文档
    SearchRequest searchRequest = new SearchRequest(indexName);
    // 使用搜索条件构造器，构造搜索条件
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
    //查询条件，使用QueryBuilders 工具类，来实现
    // QueryBuilders.termQuery 精确查询
    TermQueryBuilder queryBuilder = QueryBuilders.termQuery("title", "测试223");
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
  TermQueryBuilder queryBuilder = QueryBuilders.termQuery("title.keyword", "测试223");
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



  学习资料：

  https://zhuanlan.zhihu.com/p/496868297



## 七、参考资料

[Quick start | Elasticsearch Guide [8.11\] | Elastic](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/getting-started.html)