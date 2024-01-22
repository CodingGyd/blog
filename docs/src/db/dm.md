---
title: 达梦数据库使用记录
shortTitle: 达梦数据库使用记录
date: 2024-01-19
category:
  - JAVA企业级开发
tag:
  - 达梦
head:
  - - meta
    - name: keywords
      content: 数据库,达梦,关系型数据库,DaMeng,国产数据库
---

# 达梦数据库使用记录

> 官方文档https://eco.dameng.com/document/dm/zh-cn/start/index.html

> MySql迁移达梦总结：https://download.dameng.com/eco/docs/DM_DBA%E6%89%8B%E8%AE%B0%E4%B9%8BMySQL%E7%A7%BB%E6%A4%8D%E5%88%B0DM.pdf   

- 查看数据库版本
```
SELECT * FROM v$version
```

- 日期字段默认时间设置

  达梦不支持默认时间设置，可以在字段上设置触发器来实现

- 字段自增设置

​    DM 数据库可以实现这种方式，和 MySQL 的操作方式不一样而已。需要在建表的时候设置，举例如下：

```
CREATE TABLE "TAB_12"
(
"ID" INT IDENTITY (1, 1) NOT NULL,
"NAME" VARCHAR(10),
NOT CLUSTER PRIMARY KEY("ID")) ;
```

- 修改字段类型

​    DM直接将varchar类型修改为text类型会报错：数据类型的变更无效，

​    一个有效的变更方法:  

```
（1）增加一个为text类型的字段case_name1

alter table KF.BASE_CASE add case_name1 text;

（2）将case_name字段的值赋给case_name1

update KF.BASE_CASE set case_name1=trim(case_name);

（3）删除字段case_name

alter table KF.BASE_CASE drop column CASE_NAME;

（4）将字段case_name1改名为case_name

alter table KF.BASE_CASE rename column case_name1 to case_name; 
```



