---
title: Redis不为人知的冷知识
shortTitle: Redis不为人知的冷知识
date: 2023-11-01
category:
  - 微服务中间件
description: 记录中间件Redis的冷门知识，
head:
  - - meta
    - name: keywords
      content: Redis,非关系型数据库,缓存,NoSQL,分布式缓存,集群,哨兵
---

# Redis背后的冷知识


## 一、前言
大家在学一门技术时，基本都习惯关注某个具体技术点是什么，怎么用。很少有人去了解这个技术点背后的故事。小郭将Redis各个技术点背后的故事进行了收集，大家当个八卦花边了解一下即可。

## 二、6379端口的由来
为什么默认端口是6379？ 
不知道大家在刚学习Redis的时候有没有问过这个问题？ 我相信大部分人觉得这可能就是作者随意命名的，没什么好说的。  其实这背后还是有点小故事的。



`Alessia Merz` 是一位意大利女演员、舞女。 Redis 作者 `Antirez` 早年看电视节目，觉得`Alessia  Merz `在节目中的一些话愚蠢可笑，`Antirez` 喜欢造“梗”用于平时和朋友们交流，于是造了一个词 "MERZ"，形容愚蠢，与 "stupid" 含义相同。

后来 `Antirez `重新定义了 "MERZ" ，形容”具有很高的技术价值，包含技艺、耐心和劳动，但仍然保持简单本质“。

到了给 Redis 选择一个数字作为默认端口号时，`Antirez `没有多想，把 "MERZ" 在手机键盘上对应的数字 6379 拿来用了。

 

<img src="http://cdn.gydblog.com/images/middleware/redis-trivia-1.png"  style="zoom: 30%;margin:0 auto;display:block"/>

如上图所示，6379 是 "**MERZ** " 九宫格输入法对应的数字。这种手机目前也不多见了~


有兴趣的可以细读这篇文章：http://oldblog.antirez.com/post/redis-as-LRU-cache.html

## 三、为什么数据库默认16个？

这是stackoverflow上的一篇讨论帖子，Redis作者亲自参与讨论了：[多个redis数据库的意义何在](https://stackoverflow.com/questions/16221563/whats-the-point-of-multiple-redis-databases)

小郭摘选出了redis作者本人的解释：

```
I understand how this can be useful, but unfortunately I consider Redis multiple database errors my worst decision in Redis design at all... without any kind of real gain, it makes the internals a lot more complex. The reality is that databases don't scale well for a number of reason, like active expire of keys and VM. If the DB selection can be performed with a string I can see this feature being used as a scalable O(1) dictionary layer, that instead it is not.
With DB numbers, with a default of a few DBs, we are communication better what this feature is and how can be used I think. I hope that at some point we can drop the multiple DBs support at all, but I think it is probably too late as there is a number of people relying on this feature for their work.
```

用咱中国话翻译总结一下：

```
当时搞Redis设计的时候，设计成多数据库，确定数据库的数量时，感觉8小了点，32多了点，那就16吧。。。我本来以为这样划分多个数据库是有用的，但事实证明，这是我在Redis设计中最糟糕的设计！因为这样增加了复杂性，且很少有人用到。虽然我希望在某个时候可以完全放弃对多个数据库的支持，但目前可能为时已晚，因为目前Redis的应用太广泛， 很多生产环境的应用都耦合了此功能，改动风险很大。
```

其实 redis 的多数据库并不是真正概念上的数据库，而是一种命名空间，用于隔离不同的键。为什么这么说呢？

Redis本身是一个字典结构的存储服务器，一个Redis实例提供了多个用来存储数据的字典，客户端可以指定将数据存储在哪个字典中，这个字典其实就是Redis的数据库，不同字典之间的元素是隔离的。

由于Redis不支持自定义数据库的名字，所以每个数据库都以编号命名，默认从0开始。应用开发者则需要自己记录存储的数据与数据库的对应关系（一般在redis配置文件中指定属性`database`）。如果连接redis的时候，不主动指定数据库编号，则默认使用的是0号数据库。

另外Redis也不支持为每个数据库设置不同的访问密码，所以一个客户端要么可以访问全部数据库，要么全部数据库都不能访问。

Redis的多数据库支持都是基于单体模式Redis的情况。集群模式Redis只有一个db0的数据库，不支持多db。

## 四、为什么集群里有16384个槽

对于客户端请求的key，根据公式`HASH_SLOT=CRC16(key) mod 16384`，计算出映射到哪个分片上，然后Redis就会去相应的节点进行key操作，如下图所示

![key位置定位](http://cdn.gydblog.com/images/middleware/redis-trivial-2.jpg)

`CRC16`算法是可以产生2^16-=65536个值。换句话说，值是分布在0~65535之间。那Redis的作者为什么不是`mod`65536，而选择`mod`16384？相信大家应该和小郭一样，心中会出现这个疑问。

这个疑问，Redis作者是亲自给出了答案的！[原文链接](https://github.com/antirez/redis/issues/2576)

![作者的答案](http://cdn.gydblog.com/images/middleware/redis-trivial-3.jpg)

> 英文好的同学体现实力的时候到了！！！

用中国话翻译总结下：

1）如果槽位为65536，发送心跳信息的消息头达8k，发送的心跳包过于庞大。因为每秒钟，redis节点需要发送一定数量的ping消息作为心跳包，如果槽位为65536，这个ping消息的消息头太大了，浪费带宽。

2）redis的集群主节点数量基本不可能超过1000个。集群节点越多，心跳包的消息体内携带的数据越多。如果节点过1000个，也会导致网络拥堵。因此redis作者不建议redis cluster节点数量超过1000个。对于节点数在1000以内的redis cluster集群，16384个槽位够用了。没有必要拓展到65536个。

3）槽位越小，节点少的情况下，压缩比高。Redis主节点的配置信息中，它所负责的哈希槽是通过一张bitmap的形式来保存的，在传输过程中，会对bitmap进行压缩，但是如果bitmap的填充率slots / N很高的话(N表示节点数)，bitmap的压缩率就很低。
如果节点数很少，而哈希槽数量很多的话，bitmap的压缩率就很低。


   

综上所述，Redis作者决定取16384个槽，恰到好处！
