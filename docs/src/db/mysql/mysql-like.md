---
title: MYSQL中like的模糊查询如何优化
shortTitle:  MYSQL中like的模糊查询如何优化
date: 2025-07-03
category:
  - 数据库
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: 数据库,MySQL,关系型数据库,Like关键字,模糊查询优化
---

# MYSQL中like的模糊查询如何优化

在MySQL中，使用like进行模糊查询，在某些场景下是无法使索引生效的，如下所示：  

- 当like值前有匹配符时 `%abc` ，无法使用索引
```mysql
 EXPLAIN select *from test where user_name like '%abc'
 
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | test  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+

```

- 当like值前后都有匹配符时 `%abc%` ，无法使用索引

```
EXPLAIN select *from test where user_name like '%abc%'

+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | test  | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------------+

```



- 当like值后有匹配符时 `abc%`，可以使用索引

```
EXPLAIN select *from test where user_name like 'abc%'

+----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
| id | select_type | table | partitions | type  | possible_keys | key           | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | test  | NULL       | range | idx_user_name | idx_user_name | 1023    | NULL |    3 |   100.00 | Using index condition |
+----+-------------+-------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+


```





那么，我们一般习惯使用的like `%abc` 还有办法优化吗？

我们之所以使用`%abc`来查询说明表中的user_name可能包含以abc结尾的字符串，如果以`abc%`说明有以abc开头的字符串。

假设我们要向表中的user_name写入123abc，我们可以将这一列反转过来，将cba321插入到冗余列v_user_name中，并为这一列建立索引：

```
ALTER TABLE `test` ADD COLUMN `v_user_name` VARCHAR(50) NOT NULL DEFAULT '';// 为test表新增v_user_name
ALTER TABLE `test` ADD INDEX `idx_v_user_name`(`v_user_name`);//为v_user_name列添加索引
INSERT INTO `test`(`id`,`user_name`,`v_user_name`) VALUES(3,'123abc','cba321');// 这里不但要写name，
```

接下来在查询的时候，就可以使用v_user_name列进行模糊查询了

```
SELECT *FROM `test` WHERE `v_user_name` like 'cba%'; //相当于反向查询匹配出了user_name='abc123'的行
```

上面的方式解决了模糊匹配时无法使用索引的问题，但是表中如果已经有了很多历史数据，还需要利用update语句将user_name反转到v_user_name中，这个耗时长，同时也会增大表空间。

```
UPDATE `test` SET `v_user_name` = REVERSE(`user_name`);
```

查资料会发现在MySQL5.7.6之后，新增了虚拟列的功能（如果不是>=5.7.6，只能用上面的方法）。为一个列建立虚拟列，并为虚拟列建立索引，在查询时where中like条件改为虚拟列，就可以使用索引了。

```
ALTER TABLE `test` ADD COLUMN `v_user_name_v` varchar(50) GENERATED ALWAYS AS (REVERSE(`user_name`)) VIRTUAL;//创建虚拟列
ALTER TABLE `test` ADD INDEX `idx_name_virt`(`v_user_name_v`);//为虚拟列v_user_name_v添加索引
```



如果你要同时查询like `abc%`和like `%abc`， 只需要使用一个union：

```
EXPLAIN SELECT *FROM test where `v_user_name_v` like 'cba%' //第一部分查询使用的是虚拟列
UNION SELECT *FROM `test` where `user_name` like 'abc%';//第二部分查询使用的是原始列

+----+--------------+------------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
| id | select_type  | table      | partitions | type  | possible_keys | key           | key_len | ref  | rows | filtered | Extra                 |
+----+--------------+------------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
|  1 | PRIMARY      | test       | NULL       | range | id_name_virt  | id_name_virt  | 203     | NULL |    1 |   100.00 | Using where           |
|  2 | UNION        | test       | NULL       | range | idx_user_name | idx_user_name | 1023    | NULL |    1 |   100.00 | Using index condition |
|  3 | UNION RESULT | <union1,2> | NULL       | ALL   | NULL          | NULL          | NULL    | NULL | NULL |     NULL | Using temporary       |
+----+--------------+------------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+

```

可以看到，除了union result合并两个语句，另外两个查询都已经走了索引了。

