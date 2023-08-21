---
# icon: lock
date: 2023-08-21
category:
  - Mysql
---


# MySQL中的统计语法

> 记录mysql常用的统计写法，来源于网络

## 按天统计
format参数的取值为’%y%m%d’，可以按天输出统计结果。
```
SELECT DATE_FORMAT(insertTime,'%y年%m月%d日') as d,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%m%d')
ORDER BY d asc;
```

## 按自然周统计
format()函数的format参数取值为’%y%u’时，可实现按年、年中的周来统计结果。如果在where条件中限制是某一年的周期，可以直接将format参数的值配置为’%u’，否则一定要用’%y%u’，不然会把不同年的第n周合并到一起而出现错乱。

```
SELECT DATE_FORMAT(insertTime,'%y年%u周') as w,min(insertTime) as st,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%u')
ORDER BY w asc;
```

## 按月统计
format()函数的format参数值为’%y%m’时，可实现按月份输出聚合结果。
```
SELECT DATE_FORMAT(insertTime,'%y年%m月') as m,count(1) 
FROM table
GROUP BY DATE_FORMAT(insertTime,'%y%m')
ORDER BY m asc
```

## 按季度统计
date_format()函数没有直接按照季节输出结果的功能，但这对于数据分析师并不是什么难事，自己利用月度聚合结果去加工以下即可：
```
SELECT FLOOR((DATE_FORMAT(insertTime,'%m')-1)/3)+1 as q,min(insertTime) as st,count(*)
FROM table
WHERE DATE_FORMAT(insertTime,'%Y') = 2023
GROUP BY FLOOR((DATE_FORMAT(insertTime,'%m')-1)/3)+1
ORDER BY q asc; 
```

## 按年份统计
date_format()函数的format参数值为’%Y’或’%y’时可实现按年份输出统计结果。
```
SELECT DATE_FORMAT(insertTime,'%Y') as y,count(1)
FROM table
GROUP BY DATE_FORMAT(insertTime,'%Y')
ORDER BY y asc; 
```


原文链接：https://blog.csdn.net/fwj_ntu/article/details/86680053



