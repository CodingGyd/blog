---
title:  记录centos下离线安装mysql8
shortTitle:  记录centos下离线安装mysql8
date: 2024-01-07
category:
  - 数据库
tag:
  - MySQL
head:
  - - meta
    - name: keywords
      content: 数据库,MySQL,关系型数据库,安装,MYSQL8
---

#  记录centos下离线安装mysql8

>  本文记录在centos服务器下使用rpm包离线安装mysql8的过程。

https://download.csdn.net/blog/column/8489557/130616685#rpm_3

## 一、准备安装包

官网下载地址：https://dev.mysql.com/downloads/mysql/

![image-20240801164308710](http://cdn.gydblog.com/images/database/mysql/mysql-install-1.png)

如上图所示，我选择的是bundle包，该包包含了mysql依赖的其它rpm包，下载后解压如下：

```
[root@xxx mysql-8.0.36-1.el7.x86_64.rpm-bundle]# ll
total 1006288
-rw-r--r-- 1 root root  16767208 Aug  1 14:42 mysql-community-client-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   3621168 Aug  1 14:42 mysql-community-client-plugins-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root    681264 Aug  1 14:42 mysql-community-common-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root 528659552 Aug  1 14:44 mysql-community-debuginfo-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   1948160 Aug  1 14:42 mysql-community-devel-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   4217212 Aug  1 14:42 mysql-community-embedded-compat-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   2344468 Aug  1 14:42 mysql-community-icu-data-files-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   1563732 Aug  1 14:42 mysql-community-libs-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root    685408 Aug  1 14:42 mysql-community-libs-compat-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root  67429872 Aug  1 14:42 mysql-community-server-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root  25664528 Aug  1 14:43 mysql-community-server-debug-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root 376818184 Aug  1 14:44 mysql-community-test-8.0.36-1.el7.x86_64.rpm
```



注意：由于我当时下载的时候版本只更新到8.0.36, 而官网目前已经更新到8.0.39了。



## 二、清理历史（可选）

>  若之前在服务器上安装过mysql，需要清理干净再进行安装。

执行如下命令查找之前是否有mysql相关文件：

```
rpm -qa|grep mysql-*
find / -name mysql
```

需要将查找到的mysql相关文件全部删除。



## 三、安装和启动

### 1）执行安装

```
root@XXX mysql-8.0.36-1.el7.x86_64.rpm-bundle]# ll
total 1006288
-rw-r--r-- 1 root root  16767208 Aug  1 14:42 mysql-community-client-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   3621168 Aug  1 14:42 mysql-community-client-plugins-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root    681264 Aug  1 14:42 mysql-community-common-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root 528659552 Aug  1 14:44 mysql-community-debuginfo-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   1948160 Aug  1 14:42 mysql-community-devel-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   4217212 Aug  1 14:42 mysql-community-embedded-compat-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   2344468 Aug  1 14:42 mysql-community-icu-data-files-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root   1563732 Aug  1 14:42 mysql-community-libs-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root    685408 Aug  1 14:42 mysql-community-libs-compat-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root  67429872 Aug  1 14:42 mysql-community-server-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root  25664528 Aug  1 14:43 mysql-community-server-debug-8.0.36-1.el7.x86_64.rpm
-rw-r--r-- 1 root root 376818184 Aug  1 14:44 mysql-community-test-8.0.36-1.el7.x86_64.rpm
#mysql的组件安装有依赖关系，执行下面的命令批量强制安装，不检查依赖
[root@XXX mysql-8.0.36-1.el7.x86_64.rpm-bundle]# rpm -Uvh *.rpm --nodeps --force
```

### 2）检查安装

```
[root@xxx ~]# rpm -qa|grep mysql
mysql-community-common-8.0.36-1.el7.x86_64
mysql-community-icu-data-files-8.0.36-1.el7.x86_64
mysql-community-devel-8.0.36-1.el7.x86_64
mysql-community-client-plugins-8.0.36-1.el7.x86_64
mysql-community-client-8.0.36-1.el7.x86_64
mysql-community-server-8.0.36-1.el7.x86_64
mysql-community-test-8.0.36-1.el7.x86_64
mysql-community-libs-compat-8.0.36-1.el7.x86_64
mysql-community-debuginfo-8.0.36-1.el7.x86_64
mysql-community-libs-8.0.36-1.el7.x86_64
mysql-community-server-debug-8.0.36-1.el7.x86_64
mysql-community-embedded-compat-8.0.36-1.el7.x86_64
```

```
## rpm方式重要文件路径说明
主要文件默认路径如下：
配置文件路径：/etc/my.cnf
数据存储目录：/var/lib/mysql
错误日志存储路径：/var/log/mysqld.log
socket文件路径：/var/lib/mysql/mysql.sock
参数可以通过/etc/my.cnf参数配置文件查看和自定义。
```



### 3）开启服务

```
root@xxx ~]# systemctl start mysqld
[root@xxx ~]# systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2024-08-01 16:05:57 CST; 58min ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 6705 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 6736 (mysqld)
   Status: "Server is operational"
    Tasks: 46
   Memory: 427.9M
   CGroup: /system.slice/mysqld.service
           └─6736 /usr/sbin/mysqld

Aug 01 16:05:55 iZbp128dczen7roibd3xciZ systemd[1]: Starting MySQL Server...
Aug 01 16:05:57 iZbp128dczen7roibd3xciZ systemd[1]: Started MySQL Server.
[root@xxx ~]# 
```

## 四、登录mysql

第一次启动mysql，会自动生成一个随机密码，可在/var/log/mysqld.log中查看。

```
[root@XXX ~]# grep "password" /var/log/mysqld.log
2024-08-01T02:48:50.966917Z 1 [Note] A temporary password is generated for root@localhost: q=VIgtgHH7p_
2024-08-01T02:54:05.987706Z 2 [Note] Access denied for user 'root'@'localhost' (using password: YES)
[root@XXX ~]# 
```

登录:

```
root@xxx ~]# mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 27
Server version: 8.0.36

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```





## 五、常用操作

### 1）修改密码

以修改root用户密码为例，使用以下SQL命令修改密码

```
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
#刷新权限使更改生效：
mysql> FLUSH PRIVILEGES;
```

### 2）授权远程登录

允许root用户远程登录访问（生产不允许！）

```
mysql> update user set host ='%' where user = 'root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.00 sec)

```

### 3）启停命令

```
## 启动 mysql 服务
[root@XXX ~]# systemctl start mysqld
## 关闭
[root@XXX ~]# systemctl stop mysqld
## 重启
[root@XXX ~]# systemctl restart mysqld
## 状态查看
[root@XXX ~]# systemctl status mysqld
## 设置开机自启
[root@XXX ~]# systemctl enable mysqld
```



## 六、遇到的问题

1.修改root默认密码：

```
mysql> ALTER user 'root'@'localhost' IDENTIFIED BY '123456';
ERROR 1819 (HY000): Your password does not satisfy the current policy requirements
mysql> 
```

看提示是密码不符合安全规则。

解决方式：

查看当安全规则

```
mysql> SHOW VARIABLES LIKE 'validate_password%';
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
8 rows in set (0.01 sec)

```

从上面可以看出默认的**密码的验证强度等级**validate_password.policy=MEDIUM，默认的验证密码长度是validate_password.length =8.

我们按自己需求对这两个配置进行调整，我这里由于是测试项目，调整验证强度等级为LOW，调整验证密码长度为6.

```
mysql> set global validate_password.policy=LOW;
Query OK, 0 rows affected (0.00 sec)

mysql> set global validate_password.length=6;
Query OK, 0 rows affected (0.00 sec)
```

然后继续执行密码修改即可：

```
mysql> ALTER user 'root'@'localhost' IDENTIFIED BY '123456';
Query OK, 0 rows affected (0.01 sec)
```



2.创建数据库报权限问题
这个问题因为root用户突然失去了数据库操控的权限嘛，我们可以把权限都设置为Y  
```
update user set Select_priv ='Y' where user = 'root';
 
update user set Insert_priv ='Y' where user = 'root';
 
update user set Update_priv ='Y' where user = 'root';
 
update user set Delete_priv ='Y' where user = 'root';
 
update user set Create_priv ='Y' where user = 'root';
 
update user set Drop_priv ='Y' where user = 'root';
 
update user set Reload_priv ='Y' where user = 'root';
 
update user set Shutdown_priv ='Y' where user = 'root';
 
update user set Process_priv ='Y' where user = 'root';
 
update user set File_priv ='Y' where user = 'root';
 
update user set Grant_priv ='Y' where user = 'root';
 
update user set References_priv ='Y' where user = 'root';
 
update user set Index_priv ='Y' where user = 'root';
 
update user set Alter_priv ='Y' where user = 'root';
 
update user set Show_db_priv ='Y' where user = 'root';
 
update user set Super_priv ='Y' where user = 'root';
 
update user set Create_tmp_table_priv ='Y' where user = 'root';
 
update user set Lock_tables_priv ='Y' where user = 'root';
 
update user set Execute_priv ='Y' where user = 'root';
```
然后再刷新重启MySQL：  
```
flush privileges;
systemctl restart mysqld
```
 
