---
title: Elasticsearch入门-常用API介绍
shortTitle: Elasticsearch入门-常用API介绍
date: 2023-12-20
category:
  - 微服务中间件
description: 记录elasticsearch的常用API介绍
head:
  - - meta
    - name: keywords
      content: Elasticsearch,全文检索,大数据搜索,分词查找,统计分析
---

# Elasticsearch入门-常用API介绍
 

## 一、REST API

> 下面演示用到的索引名称，为了方便，统一都叫`testindex`，不再特殊说明。

Elasticsearch REST API 支持结构化查询、全文查询和复杂查询（将两者结合在一起的查询）。

*结构化查询*包括 类似于可以在 SQL 中构造的查询类型。例如，可以在索引`employee`中搜索 gender和 age字段，并对匹配结果 按字段`hire_date`排序。

*全文查询*根据查询字符串查找所有文档并返回按*相关性*排序的匹配结果。

### 1 、全局约定

调用REST API之前需要知道的约定：

#### 1）请求返回字段过滤

所有 REST API 都支持使用参数`filter_path`指定请求返回的字段，可用于减少 Elasticsearch 返回的响应体大小。例如：

```
GET /_search?q=kimchy&filter_path=took,hits.hits._id,hits.hits._score
```

返回如下：

```
{
  "took" : 3,
  "hits" : {
    "hits" : [
      {
        "_id" : "0",
        "_score" : 1.6375021
      }
    ]
  }
}
```

还支持通配符*的方式来配置，通配符可用于包含字段，而无需知道 字段的确切路径。示例如下：

```
GET /_cluster/state?filter_path=metadata.indices.*.stat*
```

```
{
  "metadata" : {
    "indices" : {
      "my-index-000001": {"state": "open"}
    }
  }
}
```

关于filter_path的完整用法说明参考官网：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/common-options.html#common-options-response-filtering

#### 2）请求返回值格式配置

- 格式化

将`?pretty=true`追加到请求url后面时，返回的json数据将会被格式化显示（仅用于调试！)，另一种选择是 追加`?format=yaml`，这种将导致结果返回 （有时）更具可读性的 YAML 格式。类似的选项还有`?human=false`。

- 指定返回结构类型是嵌套还是铺平

  在请求url后面追加`flat_settings`会影响返回列表的结构类型。当标志为`true`时，设置以铺平格式返回：

  ```
  GET my-index-000001/_settings?flat_settings=true
  ```

  ```
  {
    "my-index-000001" : {
      "settings": {
        "index.number_of_replicas": "1",
        "index.number_of_shards": "1",
        "index.creation_date": "1474389951325",
        "index.uuid": "n6gzFZTgS664GUfx0Xrpjw",
        "index.version.created": ...,
        "index.routing.allocation.include._tier_preference" : "data_content",
        "index.provided_name" : "my-index-000001"
      }
    }
  }
  ```

  否则是默认返回格式：

  ```
  {
    "my-index-000001" : {
      "settings" : {
        "index" : {
          "number_of_replicas": "1",
          "number_of_shards": "1",
          "creation_date": "1474389951325",
          "uuid": "n6gzFZTgS664GUfx0Xrpjw",
          "version": {
            "created": ...
          },
          "routing": {
            "allocation": {
              "include": {
                "_tier_preference": "data_content"
              }
            }
          },
          "provided_name" : "my-index-000001"
        }
      }
    }
  }
  ```

- 请求异常信息返回

  默认情况下，当请求返回错误时，Elasticsearch 不包含 错误的堆栈跟踪。通过将 url 参数`error_trace`设置为 `true`来启用该行为。

   ```
   POST /my-index-000001/_search?size=surprise_me&error_trace=true
   ```

  ```
  {
    "error": {
      "root_cause": [
        {
          "type": "illegal_argument_exception",
          "reason": "Failed to parse int parameter [size] with value [surprise_me]",
          "stack_trace": "Failed to parse int parameter [size] with value [surprise_me]]; nested: IllegalArgumentException..."
        }
      ],
      "type": "illegal_argument_exception",
      "reason": "Failed to parse int parameter [size] with value [surprise_me]",
      "stack_trace": "java.lang.IllegalArgumentException: Failed to parse int parameter [size] with value [surprise_me]\n    at org.elasticsearch.rest.RestRequest.paramAsInt(RestRequest.java:175)...",
      "caused_by": {
        "type": "number_format_exception",
        "reason": "For input string: \"surprise_me\"",
        "stack_trace": "java.lang.NumberFormatException: For input string: \"surprise_me\"\n    at java.lang.NumberFormatException.forInputString(NumberFormatException.java:65)..."
      }
    },
    "status": 400
  }
  ```

  

#### 3）REST API 版本兼容性

Elasticsearch REST API 通常在各个版本之间是稳定的。但是，一些重大改进可能会导致与以前版本不兼容。例如，Elasticsearch 7.x 在许多 URL 路径中支持自定义映射类型， 但 Elasticsearch 8.0+ 没有。

REST API 兼容性是通过 请求头中的Accept或 Content-Type 实现的。升级elasticsearch后，可以在请求头中的Content-Type和Accept设置版本兼容性。但要确保在升级 Elasticsearch 后请求仍能正常工 作。

​    例如：要告知 Elasticsearch 8.0 使用的API是 7.x 请求和响应格式， 设置`compatible-with=7`:

```
Content-Type: application/vnd.elasticsearch+json; compatible-with=7
Accept: application/vnd.elasticsearch+json; compatible-with=7
```

用7.17升级8.11.3的操作示例正确处理兼容性的步骤应该是：

a. 升级ElasticSearch升级到最新的 7.x 版本，并启用 REST API 兼容性的配置。

b. 使用[升级助手](https://www.elastic.co/guide/en/kibana/7.17/upgrade-assistant.html)查看所有关键问题并浏览弃用日志。 REST API 兼容性可能会缓解一些关键问题。

c. 在继续升级之前，解决所有关键问题。

d. 将 Elasticsearch 升级到 8.11.3。

e. 查看弃用日志中的条目。 查看与依赖于兼容模式的请求关联的条目

f. 将 Elasticsearch 客户端升级到 8.x，并在需要时手动解决兼容性问题。

#### 4）系统内置索引无法访问

Elasticsearch 模块和插件可以将配置和状态信息存储在内部*系统索引*中。 不应直接访问或修改系统索引， 因为它们包含对系统运行至关重要的数据。不推荐直接访问系统索引，并且 将不再允许在将来的版本中使用。

#### 5）编码

Elasticsearch 仅支持 UTF-8 编码的 请求JSON。Elasticsearch 会忽略任何其他编码。响应数据也采用 UTF-8 编码。

#### 6）必须指定合法的Content-Type

必须在请求头中指定发送的内容类型 。值必须映射到API 支持的格式。大多数 API 都支持 JSON， YAML、CBOR 和 SMILE。bulk 批量和multi-search 多搜索 API 支持 NDJSON、 JSON 和 SMILE;其他类型将导致错误响应。

当使用`source`查询字符串参数时，content-type的key必须使用`source_content_type`

### 2、集群API

> 如果启用了 Elasticsearch 安全功能，则用户必须具有`monitor` 或者`manage的集群权限才能使用集群相关的 API。

官方文档：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster.html

下面是一些常用示例：

```
# 默认查询集群全部节点
GET http://127.0.0.1:9200/_nodes
# 显示查询集群全部节点
GET http://127.0.0.1:9200/_nodes/_all
# 仅查询本地节点
GET http://127.0.0.1:9200/_nodes/_local
# 查询选定的主节点
GET http://127.0.0.1:9200/_nodes/_master
# 按名称查询节点
GET http://127.0.0.1:9200/_nodes/node_name_goes_here
# 按名称通配符查询节点
GET http://127.0.0.1:9200/_nodes/node_name_goes_*
# 按地址查询节点
GET http://127.0.0.1:9200/_nodes/10.0.0.3,10.0.0.4
# 按地址通配符查询节点
GET http://127.0.0.1:9200/_nodes/10.0.0.*
# 按角色查询节点
GET http://127.0.0.1:9200/_nodes/_all,master:false
GET http://127.0.0.1:9200/_nodes/data:true,ingest:true
GET http://127.0.0.1:9200/_nodes/coordinating_only:true
GEThttp://127.0.0.1:9200/_nodes/master:true,voting_only:false
# 按自定义属性选择节点（例如，在配置文件中使用类似“node.attr.rack:2”的内容）
GET http://127.0.0.1:9200/_nodes/rack:2
GET http://127.0.0.1:9200/_nodes/ra*:2
GET http://127.0.0.1:9200/_nodes/ra*:2*
```



下面总结了集群相关的常用api，默认请求es的ip和端口都是：127.0.0.1:9200  es部署服务器地址。默认集群api都需要monitor或manager权限

#### 1）集群分片当前分配情况查询

请求方式：GET | POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-allocation-explain.html

请求地址：/_cluster/allocation/explain

参数示例：

```
{
  "index": "testindex",
  "shard": 0,
  "primary": false,
  "current_node": "my-node"
}
```

#### 2）集群分片配置查询

请求方式：GET 

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-get-settings.html

请求地址：/_cluster/settings  

#### 3）集群健康状况

请求方式：GET 

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-health.html

请求地址：/_cluster/health/${target}

其它说明：集群运行状况分为green、yellow 、red。在分片级别，red状态表示集群中未分配特定分片，yellow表示已分配主分片，但未分配副本，green表示已分配所有分片。索引级别状态为 由最差分片状态控制。集群状态由 最差索引状态决定.

#### 4）集群健康状况报告

请求方式：GET 

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/health-api.html

请求地址：

```
/_health_report
/_health_report/<indicator>
```

#### 5）更改集群中分片的分配

> reroute 命令允许手动更改单个的分配集群中的分片。例如，可以将分片从一个集群节点移动到 另一个集群节点，可以取消分配，而未分配的分片可以 显式分配给特定节点。重新分配分片后，将会执行重新平衡以保持分片的平衡状态（依赖配置`cluster.routing.rebalance.enable`）。例如：将某个分片从node1移动到node2，则会导致该分片的备份 从node2移动到node1。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-reroute.html

请求地址：/_cluster/reroute?metric=none

#### 6）查询集群内部状态信息

返回集群内部状态信息（集群状态数据有时可能非常大，Elasticsearch 可能会消耗大量 资源来计算对此 API 的响应，会影响集群性能，仅用于调试或诊断目的）。

*集群状态*是一个内部数据结构，它跟踪 每个节点所需的各种信息，包括：

- 集群中其他节点的标识和属性
- 集群范围的设置
- 索引元数据，包括每个索引的映射和设置
- 集群中每个分片副本的位置和状态

默认情况下，集群状态 API 会将请求路由到选定的主节点 因为此节点是集群状态的权威来源。也可以 检索处理 API 请求的节点上保存的集群状态，方法是将 查询参数追加`?local=true`.

请求方式：GET 

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-state.html

请求地址：/_cluster/state/<metrics>/<target>

#### 7）返回集群统计信息

>  Cluster Stats API 允许从集群范围内检索统计信息 。API 返回基本索引指标（分片编号、存储大小、 内存使用情况）以及有关构成集群的当前节点的信息 （数量、角色、操作系统、JVM 版本、内存使用情况、CPU 和已安装的插件）。

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-stats.html

请求地址：/_cluster/stats、/_cluster/stats/nodes/<node_filter>

#### 8）动态更新集群配置

> 除了在未启动或关闭集群节点时使用配置文件 .`elasticsearch.yml`配置节点，elasticsearch还支持在运行过程中通过API动态更新节点配置。当同时使用多种方法配置相同的配置项时，Elasticsearch 会应用 按以下优先级顺序进行设置：

​		a.瞬态设置

​		b.持久性设置

​		c.`elasticsearch.yml`设置

​		d.默认设置值

请求方式：PUT

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-update-settings.html

请求地址：/_cluster/settings

#### 9）查询有关功能使用情况

除了在未启动或关闭集群节点时使用配置文件 .`elasticsearch.yml`配置节点，elasticsearch还支持在运行过程中通过API动态更新节点配置。当同时使用多种方法配置相同的配置项时，Elasticsearch 会应用 按以下优先级顺序进行设置：

​		a.瞬态设置

​		b.持久性设置

​		c.`elasticsearch.yml`设置

​		d.默认设置值

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-nodes-usage.html

请求地址：

```
GET /_nodes/usage
GET /_nodes/<node_id>/usage
GET /_nodes/usage/<metric>
GET /_nodes/<node_id>/usage/<metric>
```

#### 10）查询每个节点的热点线程

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-nodes-hot-threads.html

请求地址：

```
GET /_nodes/hot_threads
GET /_nodes/<node_id>/hot_threads
```

#### 11）查询集群的节点信息

>  默认情况，返回节点的所有属性和核心设置

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-nodes-info.html

请求地址：

```
GET /_nodes
GET /_nodes/<node_id>
GET /_nodes/<metric>
GET /_nodes/<node_id>/<metric>
```

示例：

```
# return all info
GET /_nodes

# return just process
GET /_nodes/process

# same as above
GET /_nodes/_all/process

# return just jvm and process of only nodeId1 and nodeId2
GET /_nodes/nodeId1,nodeId2/jvm,process

# same as above
GET /_nodes/nodeId1,nodeId2/info/jvm,process

# return all the information of only nodeId1 and nodeId2
GET /_nodes/nodeId1,nodeId2/_all

# return details about the installed plugins and modules
GET /_nodes/plugins

# return details about the available processors per node
GET /_nodes/ingest
```

#### 12）预验证节点的删除影响

> 此 API 检查尝试从集群中删除指定节点是否可能成功。对于没有未分配分片的集群，删除任何节点都被认为是安全的，这意味着删除节点可能会成功。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/prevalidate-node-removal-api.html

请求地址：/_internal/prevalidate_node_removal

#### 13）重新加载密钥配置

> 在集群中的节点上重新加载密钥库，无需重新启动集群节点

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-nodes-reload-secure-settings.html

请求地址：

```
POST /_nodes/reload_secure_settings
POST /_nodes/<node_id>/reload_secure_settings
```

#### 14）查询节点统计信息

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-nodes-stats.html

请求地址：

```
GET /_nodes/stats
GET /_nodes/<node_id>/stats
GET /_nodes/stats/<metric>
GET /_nodes/<node_id>/stats/<metric>
GET /_nodes/stats/<metric>/<index_metric>
GET /_nodes/<node_id>/stats/<metric>/<index_metric>
```

示例：

```
# return just indices
GET /_nodes/stats/indices

# return just os and process
GET /_nodes/stats/os,process

# return just process for node with IP address 10.0.0.1
GET /_nodes/10.0.0.1/stats/process

# Fielddata summarized by node
GET /_nodes/stats/indices/fielddata?fields=field1,field2

# Fielddata summarized by node and index
GET /_nodes/stats/indices/fielddata?level=indices&fields=field1,field2

# Fielddata summarized by node, index, and shard
GET /_nodes/stats/indices/fielddata?level=shards&fields=field1,field2

# You can use wildcards for field names
GET /_nodes/stats/indices/fielddata?fields=field*

# All groups with all stats
GET /_nodes/stats?groups=_all

# Some groups from just the indices stats
GET /_nodes/stats/indices?groups=foo,bar

# To return only ingest-related node statistics
GET /_nodes/stats/ingest?filter_path=nodes.*.ingest
# You can use the metric and filter_path query parameters to get the same response.
GET /_nodes/stats?metric=ingest&filter_path=nodes.*.ingest

# only returns ingest pipeline statistics.
GET /_nodes/stats?metric=ingest&filter_path=nodes.*.ingest.pipelines

```

#### 15）查询集群信息

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-info.html

请求地址：/_info/<target>

示例：

```
# returns all stats info of the cluster
GET /_info/_all

# returns the http info of the cluster
GET /_info/http

# returns the http info of the cluster
GET /_info/ingest

# returns the thread_pool info of the cluster
GET /_info/thread_pool

# returns the script info of the cluster
GET /_info/script

# returns the http and ingest info of the cluster
GET /_info/http,ingest
```

#### 16）查询尚未执行的集群更新

> 待处理的集群任务 API 返回任何集群级别更改的列表（例如 创建索引、更新映射、分配或失败分片），但尚未创建索引、更新映射、分配或失败分片 执行。

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-pending.html

请求地址：/_cluster/pending_tasks

#### 17）查询远程集群信息

请求方式：GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-remote-info.html

请求地址：/_remote/info

#### 18）修改投票配置节点列表

> 在[投票配置排除列表中](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/modules-discovery-voting.html)添加或删除符合主节点条件的节点。
>
> - 如果启用了 Elasticsearch 安全功能，必须具有[集群权限](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/security-privileges.html#privileges-list-cluster)才能使用此 API。`manage`
> - 如果启用[了操作员权限功能](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/operator-privileges.html)，则只有操作员 用户可以使用此 API。

请求方式：POST|DELETE

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/voting-config-exclusions.html

请求地址：

```
POST /_cluster/voting_config_exclusions?node_names=<node_names>
POST /_cluster/voting_config_exclusions?node_ids=<node_ids>
DELETE /_cluster/voting_config_exclusions
```

示例：

```
#将命名nodeName1 和nodeName2 的节点添加到投票配置中 排除列表
POST /_cluster/voting_config_exclusions?node_names=nodeName1,nodeName2
#从列表中删除所有排除项：
DELETE /_cluster/voting_config_exclusions
```

#### 19）创建或更新所需的节点

> 此功能旨在供 [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup?page=docs&placement=docs-body)、Elastic Cloud [Enterprise 和 Elastic Cloud](https://www.elastic.co/guide/en/cloud-enterprise/current) [on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current) 间接使用。不支持直接使用。

请求方式：PUT

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/voting-config-exclusions.html

请求地址：

```
PUT /_internal/desired_nodes/<history_id>/<version>
```

示例：

```
PUT /_internal/desired_nodes/Ywkh3INLQcuPT49f6kcppA/100
{
    "nodes" : [
        {
            "settings" : {
                 "node.name" : "instance-000187",
                 "node.external_id": "instance-000187",
                 "node.roles" : ["data_hot", "master"],
                 "node.attr.data" : "hot",
                 "node.attr.logical_availability_zone" : "zone-0"
            },
            "processors" : 8.0,
            "memory" : "58gb",
            "storage" : "2tb",
            "node_version" : "{version}"
        }
    ]
}
```

#### 20）获取所需的节点 API

> 此功能旨在供 [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup?page=docs&placement=docs-body)、Elastic Cloud [Enterprise 和 Elastic Cloud](https://www.elastic.co/guide/en/cloud-enterprise/current) [on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current) 间接使用。不支持直接使用。

请求方式：GET

请求地址：/_internal/desired_nodes/_latest

示例：

```
# 获取最新的节点
GET /_internal/desired_nodes/_latest

#返回如下
{
    "history_id": <history_id>,
    "version": <version>,
    "nodes": [
        {
            "settings": <node_settings>,
            "processors": <node_processors>,
            "memory": "<node_memory>",
            "storage": "<node_storage>",
            "node_version": "<node_version>"
        }
    ]
}
```

#### 21）删除所需的节点

> 此功能旨在供 [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup?page=docs&placement=docs-body)、Elastic Cloud [Enterprise 和 Elastic Cloud](https://www.elastic.co/guide/en/cloud-enterprise/current) [on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current) 间接使用。不支持直接使用。

请求方式：DELETE

请求地址：/_internal/desired_nodes

#### 22）显示基本指标

> 此功能旨在供 [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup?page=docs&placement=docs-body)、Elastic Cloud [Enterprise 和 Elastic Cloud](https://www.elastic.co/guide/en/cloud-enterprise/current) [on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current) 间接使用。不支持直接使用。

请求方式：GET

请求地址：/_internal/desired_balance

####  23）重置所需余额API

> 重置所需的余额，并从当前分配开始新的计算。 如果所需的余额计算偏离当前状态，则可以使用此 API 并且试图移动太多碎片。
>
> 此功能旨在供 [Elasticsearch Service](https://www.elastic.co/cloud/elasticsearch-service/signup?page=docs&placement=docs-body)、Elastic Cloud [Enterprise 和 Elastic Cloud](https://www.elastic.co/guide/en/cloud-enterprise/current) [on Kubernetes](https://www.elastic.co/guide/en/cloud-on-k8s/current) 间接使用。不支持直接使用。

请求方式：DELETE 

请求地址：/_internal/desired_balance

### 3 、索引API

索引 API 用于管理单个索引， 索引设置、别名、映射和索引模板。

#### 1）检查别名是否存在

> Elasticsearch 安全功能，必须具有查看index元数据`或者`管理index`的权限。如果指定目标，则还必须具有该目标的 相关权限

请求方式：HEAD

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-alias-exists.html

请求地址：

```
HEAD _alias/<alias>
HEAD <target>/_alias/<alias>
```

示例：

```
HEAD _alias/my-alias
```

返回值说明：

```
200
所有指定的别名都存在。
404
一个或多个指定的别名不存在。
```

#### 2）原子操作

> 在单个原子操作中执行一个或多个[别名](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/aliases.html)操作。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-aliases.html

请求地址：

```
POST _aliases
```

```console
{
  "actions": [
    {
      "add": {
        "index": "my-data-stream",
        "alias": "my-alias"
      }
    }
  ]
}
```

#### 3）文本分析API

> 对文本字符串执行[分析](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/analysis.html) 并返回生成的令牌。

请求方式：POST|GET

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-analyze.html

请求地址：

```
GET /_analyze
POST /_analyze
GET /<index>/_analyze
POST /<index>/_analyze
```

示例：

```
# 单个文本
GET /_analyze
{
  "analyzer" : "standard",
  "text" : "this is a test"
}

# 多个文本
GET /_analyze
{
  "analyzer" : "standard",
  "text" : ["this is a test", "the second text"]
}

# 自定义
```

#### 4）分析字段的磁盘使用情况

> 分析索引或数据流中每个字段的磁盘使用情况。 此 API 可能不支持在以前的 Elasticsearch 版本中创建的索引。 小索引的结果可能不准确，因为索引的某些部分 API 可能不会对其进行分析。
>
> 此功能为技术预览版，可能会在将来的版本中更改或删除。Elastic 将努力解决任何问题，但技术预览版中的功能不受官方 GA 功能的支持 SLA 的约束。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-disk-usage.html

请求地址：/<target>/_disk_usage

示例：

```
 /my-index-000001/_disk_usage?run_expensive_tasks=true
```

#### 5）缓存清理API

> 清除一个或多个索引的缓存。对于数据流，API 会清除 流的支持索引的缓存。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-disk-usage.html

请求地址：

```
/<target>/_cache/clear
/_cache/clear
```

示例：

```
# 默认清除所有缓存
POST /my-index-000001/_cache/clear

# 默认情况下， 清除缓存 API 清除所有缓存。 可以只清除特定缓存 通过将以下查询参数设置为true：
# 仅清除字段缓存
POST /my-index-000001/_cache/clear?fielddata=true  
# 仅清除查询缓存
POST /my-index-000001/_cache/clear?query=true    
# 仅清除请求缓存
POST /my-index-000001/_cache/clear?request=true    

#要仅清除特定字段的缓存， 使用 field 参数，例如清除foo和bar这两个字段的缓存
POST /my-index-000001/_cache/clear?fields=foo,bar   

#清除多个数据流和索引的缓存编辑
POST /my-index-000001,my-index-000002/_cache/clear

# 清除所有数据流和索引的缓存编辑
POST /_cache/clear


```

#### 6）复制索引

> 使用复制索引 API 将现有索引复制到新索引中，其中每个 原始主分片将复制到新索引中的新主分片中。大概的步骤是：
>
> - 首先，它创建一个与源定义相同的新目标索引 指数。
> - 然后，它将段从源索引硬链接到目标索引。（如果 文件系统不支持硬链接，然后复制所有段 添加到新索引中，这是一个更耗时的过程。
> - 最后，它恢复目标索引，就好像它是一个封闭的索引一样， 刚刚重新开放。
>
> 仅当索引满足以下要求时，才能复制索引：
>
> - 要复制索引，必须将原索引标记为只读，并且[集群运行状况](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/cluster-health.html)为 `green`
>
> - 目标索引不得存在。
> - 源索引的主分片数必须与目标索引相同。
> - 处理克隆过程的节点必须具有足够的可用磁盘空间，以便 容纳现有索引的第二个副本。
>
> 

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-disk-usage.html

请求地址：

```
POST /<index>/_clone/<target-index>
PUT /<index>/_clone/<target-index>
```

示例：

```
# 将索引my-index-000001复制到新索引cloned-my-index-000001
POST /my-index-000001/_clone/
```

#### 7）关闭索引

> 可以使用关闭索引 API 关闭打开的索引。
>
> 闭合索引被阻止进行读/写操作，并且不允许 打开索引的所有操作都允许。无法编制索引文档或在封闭索引中搜索文档。这允许 封闭索引，不必维护内部数据结构 索引或搜索文档，从而减少 集群工作负载。

请求方式：POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-close.html

请求地址：/<index>/_close

示例：

```
# 关闭索引my-index-000001
POST /my-index-000001/_close
# 返回如下响应
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "indices": {
    "my-index-000001": {
      "closed": true
    }
  }
}
```

#### 8）创建索引

> 可以使用创建索引 API 向 Elasticsearch 集群添加新索引。 创建索引时，可以指定以下内容：
>
> - 索引的设置  （分片配置number_of_shards的默认值为 1，副本数number_of_replicas默认值为 1（即每个主分片一个副本）
> - 索引中字段的映射
> - 索引别名

请求方式：PUT

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-create-index.html

请求地址：/<index>

示例：

- 索引的设置

```
# 创建索引时指定索引级别的配置（分片数3，副本数2）
PUT /my-index-000001
{
  "settings": {
    "index": {
      "number_of_shards": 3,  
      "number_of_replicas": 2 
    }
  }
}

# 上面参数可以更简化为如下(不必在xsettings节点内显式指定index)
PUT /my-index-000001
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  }
}
```

- 索引中字段的映射mappings

```
#创建索引 API 允许提供映射定义：
PUT /test
{
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "field1": { "type": "text" }
    }
  }
}
```



- 索引的别名设置

```
# 创建索引 API 还允许提供一组别名：
PUT /test
{
  "aliases": {
    "alias_1": {},
    "alias_2": {
      "filter": {
        "term": { "user.id": "kimchy" }
      },
      "routing": "shard-1"
    }
  }
}
# 索引别名还支持日期数学。
PUT /logs
{
  "aliases": {
    "<logs_{now/M}>": {}
  }
}

```



返回值：

> 默认情况下，索引创建请求只会在主副本 每个分片都已启动，或者请求超时时会返回响应

```console-result
{
  "acknowledged": true, # 指示是否已在集群中成功创建索引
  "shards_acknowledged": true, # 指示是否在超时之前启动了索引所需数量的分片副本
  "index": "logs"
}
```

有可能发生acknowledged和shards_acknowledged有false，而索引创建成功的情况，因为这些值仅指示操作是否在超时之前完成。

如果acknowledged是false，则在集群状态更新之前，我们新创建索引超时了 ，但它仍可能很快就会创建。

如果shards_acknowledged是false，则我们在成功启动所需数量的分片之前超时了（默认情况下），即使acknowledged返回了true

可以更改仅等待主分片通过索引启动的默认值 设置：index.write.wait_for_active_shards

```
PUT /test
{
  "settings": {
    "index.write.wait_for_active_shards": "2"
  }
}
```

#### 9）创建或更新索引别名

> 将数据流或索引添加到[别名](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/aliases.html)。

请求方式：PUT|POST

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-add-alias.html

请求地址：

```
POST <target>/_alias/<alias>
POST <target>/_aliases/<alias>
PUT <target>/_alias/<alias>
PUT <target>/_aliases/<alias>
```

#### 10）创建或更新组件模板

请求方式：PUT

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-component-template.html

请求地址：/_component_template/<component-template>

示例：

- 创建具有索引别名的组件模板

  > 别名中的占位符`{index}`将替换为 在索引创建期间应用模板的实际索引名称。

  ```
  PUT _component_template/template_1
  {
    "template": {
      "settings" : {
          "number_of_shards" : 1
      },
      "aliases" : {
          "alias1" : {},
          "alias2" : {
              "filter" : {
                  "term" : {"user.id" : "kimchy" }
              },
              "routing" : "shard-1"
          },
          "{index}-alias" : {} 
      }
    }
  }
  ```

- 组件模板版本控制

  > 可以使用参数`version`向组件模板添加版本号。 外部系统可以使用这些版本号来简化模板管理。`version`参数是可选的，不会由 Elasticsearch 自动生成或使用。要取消设置`version`，替换模板而不指定模板。

#### 11）创建或更新索引模板

> 使用删除组件模板 API 支持删除一个或多个组件模板 

请求地址：PUT /_index_template/<index-template>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-put-template.html

#### 12）删除组件模板

>  创建或更新索引模板。索引模板定义可自动应用于新索引的[设置](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/index-modules.html#index-modules-settings)、[映射](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/mapping.html)和[别名](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/aliases.html)。

请求地址：DELETE /_component_template/<component-template>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-put-template.html

#### 13）删除索引

> 删除一个或多个索引。删除索引会删除其文档、分片和元数据

请求地址：DELETE /<index>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-delete-index.html

#### 14）删除索引模板

请求地址：DELETE /_index_template/<index-template>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-delete-template.html

#### 15）检查xx是否存在

>  检查数据流、索引或别名是否存在。

请求地址：HEAD <target>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-exists.html

#### 16）刷新数据流或索引

> 刷新一个或多个数据流或索引。

请求地址：

```
POST /<target>/_flush
GET /<target>/_flush
POST /_flush
GET /_flush
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-flush.html

示例：

```
# 刷新特定数据流或索引
POST /my-index-000001/_flush
# 刷新多个数据流和索引
POST /my-index-000001,my-index-000002/_flush
# 刷新集群中的所有数据流和索引
POST /_flush
```

#### 17）获取字段映射定义

请求地址：

```
GET /_mapping/field/<field>
GET /<target>/_mapping/field/<field>
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-get-field-mapping.html

示例：

- 查看单个字段定义

```
GET publications/_mapping/field/title
# 返回如下
{
   "publications": {
      "mappings": {
          "title": {
             "full_name": "title",
             "mapping": {
                "title": {
                   "type": "text"
                }
             }
          }
       }
   }
}
```

- 查看多个字段定义

```
GET publications/_mapping/field/author.id,abstract,name
```

- 模糊查询

  ```
  GET publications/_mapping/field/a*

#### 18）查询索引定义

请求地址：GET /<target>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-get-index.html

#### 19）查询索引设置信息

> 返回一个或多个索引的设置信息。对于数据流，API 返回流的支持索引的设置信息。

请求地址：

```
GET /<target>/_settings
GET /<target>/_settings/<setting>
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-get-settings.html

示例：

```
# 获取多个数据流或索引
GET /my-index-000001,my-index-000002/_settings
GET /_all/_settings
GET /log_2099_*/_settings
# 按名称筛选设置(可以使用通配符匹配来筛选返回的设置)
GET /log_2099_-*/_settings/index.number_*
```

#### 19）获取索引模板信息

请求地址：GET /_index_template/<index-template>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-get-template.html

示例：

```
# 使用通配符表达式获取索引模板
GET /_index_template/temp*
# 获取所有索引模板
GET /_index_template
```

#### 20）获取索引的映射定义

> 检索一个或多个索引的[映射定义](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/mapping.html)。对于数据 streams，API 检索流的支持索引的映射。

请求地址：

```
GET /_mapping
GET /<target>/_mapping
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-get-mapping.html

示例：

```
# 获取多个数据流和索引的映射定义
GET /my-index-000001,my-index-000002/_mapping
# 获取集群中所有索引映射定义
GET /*/_mapping
GET /_all/_mapping
GET /_mapping
```

#### 21）查询索引恢复信息

> 返回有关一个或多个索引的正在进行和已完成的分片恢复的信息

请求地址：

```
GET /<target>/_recovery
GET /_recovery
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-recovery.html

示例：

```
# 获取多个数据流和索引的恢复信息
GET index1,index2/_recovery?human
# 获取集群中所有数据流和索引的分段信息
GET /_recovery?human
# 获取详细的恢复信息
GET _recovery?human&detailed=true
```

#### 22）查询索引的段信息

> 提供Lucene索引(分片级别)使用的segments(段信息)。

请求地址：

```
GET /<target>/_segments
GET /_segments
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-segments.html

示例：

```
#获取特定数据流或索引的段信息
GET /test/_segments
#获取多个数据流和索引的区段信息
GET /test1,test2/_segments
#获取集群中所有数据流和索引的分段信息
GET /_segments
```

#### 23）查询索引统计信息

请求地址：

```
GET /<target>/_stats/<index-metric>
GET /<target>/_stats
GET /_stats
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-stats.html

示例：

```
#获取多个数据流和索引的统计信息
GET /index1,index2/_stats
#获取集群中所有数据流和索引的统计信息
GET /_stats
#获取具体统计信息
GET /_stats/merge,refresh
#获取特定搜索组的统计信息
GET /_stats/search?groups=group1,group2
```

#### 24）列出悬空索引

请求地址：GET /_dangling

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/dangling-indices-list.html

#### 25）打开闭合索引

> 打开闭合索引。对于数据流，API 打开任何已关闭的后备索引。

请求地址：POST /<target>/_open

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-open-close.html

示例：

```
#以下请求将重新打开名为my-index-000001 的封闭索引。
POST /my-index-000001/_open
# 返回如下：
{
  "acknowledged" : true,
  "shards_acknowledged" : true
}
```

#### 26）刷新索引

> 刷新使最近对一个或多个索引执行的操作可用于 搜索。对于数据流，API 对流的 支持指数。有关刷新操作的详细信息，请参阅[准实时搜索](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/near-real-time.html)。

请求地址：

```
POST <target>/_refresh
GET <target>/_refresh
POST /_refresh
GET /_refresh
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-refresh.html

示例：

```
#刷新多个数据流和索引
POST /my-index-000001,my-index-000002/_refresh
#刷新集群中的所有数据流和索引
POST /_refresh
```

#### 27）收缩索引

> 将现有索引收缩为具有较少主分片的新索引。目标索引中请求的主分片数 必须是源索引中分片数的因子。例如，具有8个主分片的索引可以缩小为 `4`或`2`或1个主分片的新索引

请求地址：

```
POST /<index>/_shrink/<target-index>
PUT /<index>/_shrink/<target-index>
```

#### 28）拆分索引

> 将现有索引拆分为具有更多主分片的新索引。 其中，每个原始主分片被拆分为两个或多个主分片 的新索引。
>
> 索引可以拆分的次数（以及每个索引的分片数 原始分片可以拆分为）由`index.number_of_routing_shards` 设置决定. 

请求地址：

```
POST /<index>/_split/<target-index>
PUT /<index>/_split/<target-index>
```

请求参数说明：

示例：

```
#要拆分为一个名为 my_target_index的新索引，请对索引my_source_index发出 以下请求：
POST /my_source_index/_split/my_target_index
{
  "settings": {
    "index.number_of_shards": 2
  }
}
```

#### 29）更新索引设置

请求地址：PUT /<target>/_settings

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-update-settings.html

示例：

```
#重置索引设置
PUT /my-index-000001/_settings
{
  "index" : {
    "refresh_interval" : null
  }
}

#更新索引分片数量
PUT /my-index-000001/_settings
{
  "index" : {
    "number_of_replicas" : 2
  }
}

#更新索引分词器(要添加分析器，必须先关闭索引，定义分析器，然后重新打开索引)
For example, the following commands add the content analyzer to the my-index-000001 index:
例如 以下命令将content分析器添加到索引contentmy-index-000001中：
POST /my-index-000001/_close
PUT /my-index-000001/_settings
{
  "analysis" : {
    "analyzer":{
      "content":{
        "type":"custom",
        "tokenizer":"whitespace"
      }
    }
  }
}
POST /my-index-000001/_open
```

#### 30）更新索引的字段映射设置

> 实时更改动态索引字段映射设置，将新字段添加到现有数据流或索引。也可以用这个 用于更改现有字段的搜索设置的 API。

请求地址：PUT /<target>/_mapping

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/indices-put-mapping.html

示例：

```
#请求创建没有任何字段映射的索引publications
PUT /publications
# The following update mapping API request adds title, a new text field, to the publications index.
以下更新映射 API 请求添加了一个类型为文本text的字段`title`， 添加到索引`publications`中。
PUT /publications/_mapping
{
  "properties": {
    "title":  { "type": "text"}
  }
}
```

### 4 、文档API

#### 1）文档的新增或更新操作

>  将 JSON 文档添加到指定的数据流或索引中，并使 它是可搜索的。如果目标是索引，并且文档已存在， 该请求将更新文档并递增其版本。

请求地址：

```
PUT /<target>/_doc/<_id>
POST /<target>/_doc/
PUT /<target>/_create/<_id>
POST /<target>/_create/<_id>
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-index_.html

示例：

- 新增或更新一个JSON文档

  > 新增或更新一个JSON文档到索引`my-index-000001` , 文档id字段是`_id`,值是1。 id记录如果已存在则覆盖，否则新增。

```
PUT my-index-000001/_doc/1
{
  "@timestamp": "2099-11-15T13:12:00",
  "message": "GET /search HTTP/1.1 200 1070000",
  "user": {
    "id": "kimchy"
  }
}

# 返回数据：
{
  "_shards": {
    "total": 2,
    "failed": 0,
    "successful": 2
  },
  "_index": "my-index-000001",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "result": "created"
}
```

   

#### 2）检索单个文档

> 从索引中检索指定的 JSON 文档。

请求地址：

```
# 使用GET从指定索引中获取文档信息
GET <index>/_doc/<_id>
GET <index>/_source/<_id>

# 使用 HEAD 验证文档是否存在
HEAD <index>/_doc/<_id>
HEAD <index>/_source/<_id>
```

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-get.html

示例：

- 从索引`my-index-00001`中检索_id等于0的JSON文档信息

```
GET my-index-000001/_doc/0

#返回结果如下：
{
  "_index": "my-index-000001",
  "_id": "0",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "@timestamp": "2099-11-15T14:12:12",
    "http": {
      "request": {
        "method": "get"
      },
      "response": {
        "status_code": 200,
        "bytes": 1070000
      },
      "version": "1.1"
    },
    "source": {
      "ip": "127.0.0.1"
    },
    "message": "GET /search HTTP/1.1 200 1070000",
    "user": {
      "id": "kimchy"
    }
  }
}
```

- 检索_id等于0的文档是否存在

```
HEAD my-index-000001/_doc/0

#返回状态码 200 表示存在，返回 404 表示不存在。
```

- 仅获取文档中的`_source`字段

  ```
  # 获取_source中的全量字段
  GET my-index-000001/_source/1
  
  # 获取_source中的部分字段
  GET my-index-000001/_source/1/?_source_includes=*.id&_source_excludes=entities
  ```

- 将 HEAD 与端点一起使用，测试文档的_source是否存在(前提是_source在mapping中没有禁用)

```
HEAD my-index-000001/_source/1
```

#### 3）检索多个文档

请求地址：

```
GET /_mget
GET /<index>/_mget
```



请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-multi-get.html

示例：

```
#按 ID 获取文档, 如果在请求 URI 中指定索引，则请求正文中只需要文档 ID：
GET /my-index-000001/_mget
{
  "docs": [
    {
      "_id": "1"
    },
    {
      "_id": "2"
    }
  ]
}
# 上面的请求可以简化如下：
GET /my-index-000001/_mget
{
  "ids" : ["1", "2"]
}

```

```
#筛选源字段
GET /_mget
{
  "docs": [
    {
      "_index": "test",
      "_id": "1",
      "_source": false
    },
    {
      "_index": "test",
      "_id": "2",
      "_source": [ "field3", "field4" ]
    },
    {
      "_index": "test",
      "_id": "3",
      "_source": {
        "include": [ "user" ],
        "exclude": [ "user.location" ]
      }
    }
  ]
}
```

```
#筛选存储的字段
GET /_mget
{
  "docs": [
    {
      "_index": "test",
      "_id": "1",
      "stored_fields": [ "field1", "field2" ]
    },
    {
      "_index": "test",
      "_id": "2",
      "stored_fields": [ "field3", "field4" ]
    }
  ]
}
```



#### 4）根据文档ID删除文档

> 从指定的索引中删除 JSON 文档。必须指定 索引名称和文档 ID。
>
> 每次操作文档更新（包括删除动作）都会导致文档版本号的递增。
>
> 已删除文档的版本号仍在 删除后较短的时间内可用查询，以便控制并发操作。已删除文档的版本保持可用的时间长度为 由索引设置`index.gc_deletes`确定，默认为 60 秒。 

请求地址：DELETE /<index>/_doc/<_id>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-delete.html

**示例：**

**根据文档id删除**

```
# 从索引my-index-000001上删除id为1的JSON文档
DELETE /my-index-000001/_doc/1
# 返回结果如下：
{
  "_shards": {
    "total": 2,
    "failed": 0,
    "successful": 2
  },
  "_index": "my-index-000001",
  "_id": "1",
  "_version": 2,
  "_primary_term": 1,
  "_seq_no": 5,
  "result": "deleted"
}
```



**指定路由删除**

```
DELETE /my-index-000001/_doc/1?routing=shard-1
```

**指定超时时间删除**

> 分配给执行删除操作的主分片可能正好不可用。造成这种情况的一些原因 可能是主分片当前正在从存储中恢复 或正在迁移。默认情况下，删除操作将等待 主分片故障恢复时间是最多 1 分钟，超时则会响应错误。可以在请求参数增加timeout指定超时时间

```
# 5分钟
DELETE /my-index-000001/_doc/1?timeout=5m
```

#### 5）根据查询条件删除文档

> 删除与指定查询匹配的文档。可以在请求 URI 或请求正文中指定查询条件 使用与[搜索 API](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/search-search.html) 相同的语法。

请求地址：POST /<target>/_delete_by_query

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-delete-by-query.html

示例：

```
# 删除单个数据流或索引`my-index-000001`中的全部文档
POST my-index-000001/_delete_by_query?conflicts=proceed
{
  "query": {
    "match_all": {}
  }
}

#删除多个数据流或索引中的全部文档
POST /my-index-000001,my-index-000002/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}

#将“通过查询删除”操作限制为特定路由的分片值：
POST my-index-000001/_delete_by_query?routing=1
{
  "query": {
    "range" : {
        "age" : {
           "gte" : 10
        }
    }
  }
}

#默认情况下，_delete_by_query使用 1000 的滚动批次。可以通过URL参数scroll_size更改批处理大小：
POST my-index-000001/_delete_by_query?scroll_size=5000
{
  "query": {
    "term": {
      "user.id": "kimchy"
    }
  }
}

#使用唯一属性删除文档：
POST my-index-000001/_delete_by_query
{
  "query": {
    "term": {
      "user.id": "kimchy"
    }
  },
  "max_docs": 1
}
```



#### 6）更新指定文档

请求地址：POST /<index>/_update/<_id>

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-update.html

示例：

- 索引一个简单的文档

```
PUT test/_doc/1
{
  "counter" : 1,
  "tags" : ["red"]
}


# 让计数器递增
POST test/_update/1
{
  "script" : {
    "source": "ctx._source.counter += params.count",
    "lang": "painless",
    "params" : {
      "count" : 4
    }
  }
}

# 将标签添加到标签列表中 （这只是一个列表，所以即使存在标签也会添加）
POST test/_update/1
{
  "script": {
    "source": "ctx._source.tags.add(params.tag)",
    "lang": "painless",
    "params": {
      "tag": "blue"
    }
  }
}

# 从标签列表中删除标签。为避免可能的运行时错误，首先需要确保存在标签列表，如果列表包含标签的重复项，则此 脚本只删除一个匹配项
POST test/_update/1
{
  "script": {
    "source": "if (ctx._source.tags.contains(params.tag)) { ctx._source.tags.remove(ctx._source.tags.indexOf(params.tag)) }",
    "lang": "painless",
    "params": {
      "tag": "blue"
    }
  }
}

#在文档中添加和删除字段。例如，此脚本 添加字段：new_field
POST test/_update/1
{
  "script" : "ctx._source.new_field = 'value_of_new_field'"
}

#此脚本会删除以下字段：new_field
POST test/_update/1
{
  "script" : "ctx._source.remove('new_field')"
}

# 以下脚本从对象字段中删除子字段：
POST test/_update/1
{
  "script": "ctx._source['my-object'].remove('my-subfield')"
}
# 以下部分更新将一个新字段添加到 现有文档：
POST test/_update/1
{
  "doc": {
    "name": "new_name"
  }
}


```

#### 7）批量操作

> 在单个 API 调用中执行多个索引或删除操作。 这样可以减少开销，并可以大大提高索引速度。
>
> 提供一种在单个请求中执行多个 `index`, `create`, `delete`, 和`update` 操作的方法。

请求地址：

```
POST /_bulk
POST /<target>/_bulk
```

示例：

```
# 在单个请求中执行多个 `index`, `create`, `delete`, 和`update` 操作
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} 

# 返回如下：
{
   "took": 30,
   "errors": false,
   "items": [
      {
         "index": {
            "_index": "test",
            "_id": "1",
            "_version": 1,
            "result": "created",
            "_shards": {
               "total": 2,
               "successful": 1,
               "failed": 0
            },
            "status": 201,
            "_seq_no" : 0,
            "_primary_term": 1
         }
      },
      {
         "delete": {
            "_index": "test",
            "_id": "2",
            "_version": 1,
            "result": "not_found",
            "_shards": {
               "total": 2,
               "successful": 1,
               "failed": 0
            },
            "status": 404,
            "_seq_no" : 1,
            "_primary_term" : 2
         }
      },
      {
         "create": {
            "_index": "test",
            "_id": "3",
            "_version": 1,
            "result": "created",
            "_shards": {
               "total": 2,
               "successful": 1,
               "failed": 0
            },
            "status": 201,
            "_seq_no" : 2,
            "_primary_term" : 3
         }
      },
      {
         "update": {
            "_index": "test",
            "_id": "1",
            "_version": 2,
            "result": "updated",
            "_shards": {
                "total": 2,
                "successful": 1,
                "failed": 0
            },
            "status": 200,
            "_seq_no" : 3,
            "_primary_term" : 4
         }
      }
   ]
}
```

```
# 批量更新示例
# update操作支持如下选项：doc (部分文档), upsert, doc_as_upsert, script, params (为 脚本), lang (为脚本),  _source
#retry_on_conflict可用作 操作本身（不在额外有效负载行中），指定在版本冲突的情况下应重试更新的次数。
POST _bulk
{ "update" : {"_id" : "1", "_index" : "index1", "retry_on_conflict" : 3} }
{ "doc" : {"field" : "value"} }
{ "update" : { "_id" : "0", "_index" : "index1", "retry_on_conflict" : 3} }
{ "script" : { "source": "ctx._source.counter += params.param1", "lang" : "painless", "params" : {"param1" : 1}}, "upsert" : {"counter" : 1}}
{ "update" : {"_id" : "2", "_index" : "index1", "retry_on_conflict" : 3} }
{ "doc" : {"field" : "value"}, "doc_as_upsert" : true }
{ "update" : {"_id" : "3", "_index" : "index1", "_source" : true} }
{ "doc" : {"field" : "value"} }
{ "update" : {"_id" : "4", "_index" : "index1"} }
{ "doc" : {"field" : "value"}, "_source": true}
```

#### 8）复制文档

> 将文档从源复制到目标。
>
> 源可以是任何现有索引、别名或数据流。目的地 必须与来源不同。

请求地址：POST /_reindex

请求参数说明：https://www.elastic.co/guide/en/elasticsearch/reference/8.11/docs-reindex.html

示例：

```
# 将满足查询条件的文档复制到目标索引中
POST _reindex
{
  "source": {
    "index": "my-index-000001",
    "query": {
      "term": {
        "user.id": "kimchy"
      }
    }
  },
  "dest": {
    "index": "my-new-index-000001"
  }
}

# 将满足查询条件的文档复制到目标索引中(通过max_docs限定文档数量)
POST _reindex
{
  "max_docs": 1,
  "source": {
    "index": "my-index-000001"
  },
  "dest": {
    "index": "my-new-index-000001"
  }
}

# 根据多个来源生成新的索引
POST _reindex
{
  "source": {
    "index": ["my-index-000001", "my-index-000002"]
  },
  "dest": {
    "index": "my-new-index-000002"
  }
}

#使用源筛选器重新索引所选字段
POST _reindex
{
  "source": {
    "index": "my-index-000001",
    "_source": ["user.id", "_doc"]
  },
  "dest": {
    "index": "my-new-index-000001"
  }
}

```



### 5、部分API调用实例

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

#### 4） 查看索引的元数据

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

 
