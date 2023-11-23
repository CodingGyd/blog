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


