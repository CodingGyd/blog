---
title: 基础组件的docker离线部署
shortTitle: 基础组件docker部署
date: 2024-02-03
category:
  - 容器化
tag:
  - docker
head:
  - - meta
    - name: keywords
      content: 容器化,docker,基础组件的docker部署
---

# docker&docker-compose 离线部署各种组件

> 本文总结了如何在linux环境下通过docker compose离线部署各种基础应用组件，后续会增加更多的应用组件部署说明，有需要的朋友可以关注我！


## 一、离线部署 minio(单机)

### 1、离线安装包获取

- 先在有网络的机器环境下安装并导出minio镜像

```
#拉取最新的minio（需要网络）
docker search minio
docker pull minio/minio
#查看已安装的minio镜像
docker images
#导出minio镜像的安装包
docker save minio/minio -o minio.tar
```

![](http://cdn.gydblog.com/images/docker/docker-component-1.png)

- 在无网络的机器上导入minio镜像包

  > 上传绝对路径：/root/minio.tar

```
#创建minio目录
[root@xxx ~]#  mkdir -p /usr/local/minio
# 导入minio镜像包 
[root@xxx ~]# docker load -i minio.tar 
744c86b54390: Loading layer  104.1MB/104.1MB
1323ffbff4dd: Loading layer  20.48kB/20.48kB
9a5123a464dc: Loading layer  3.584kB/3.584kB
9e9eecfbe95d: Loading layer  3.584kB/3.584kB
6088fcbd6a76: Loading layer  1.724MB/1.724MB
678ce496e457: Loading layer  36.86kB/36.86kB
50f383b04a07: Loading layer [==================================================>]  309.3MB/309.3MB
Loaded image: minio/minio:latest
[root@xxx ~]# 
```



### 2、编写docker-compose.yml

> 绝对路径：/root/docker-compose.yml

```
version: '3'
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - 9000:9000
      - 9011:9011
    environment:
      TZ: Asia/Shanghai
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    volumes:
      # 宿主机目录 /data/minio  映射到容器内目录/data ，作为minio的数据文件目录
      - /data/minio:/data   
    command: server /data --console-address ":9011"
```



### 3、启动和关闭镜像

> 在docker-compose.yml的目录下执行命令，否则会报`no configuration file provided: not found`

```
# 启动
docker compose up -d
# 关闭
docker compose down
```



### 4、验证minio服务

访问minio控制台页面：http://xxx:9011/  ，输入配置文件中的用户名minio、密码minio123登录成功即可开始使用了！

![](http://cdn.gydblog.com/images/docker/docker-component-6.png)



### 5、卸载minio镜像

```
#停止minio容器
[root@xxx ~]# docker container stop minio
minio

#删除容器
[root@xxx ~]# docker container rm minio
minio

#删除镜像(镜像ID通过docker images查看)
[root@xxx ~]# docker rmi e31e0721a96b
Untagged: minio/minio:latest
Deleted: sha256:e31e0721a96b4366c3a3b2352e29a8edada826a85adef236efad6e92a887502e
Deleted: sha256:70bd20c65ddd3af7c1c70ad3e9363fbfa071ebf54bb8285bb21b1e8e85145d6e
Deleted: sha256:ef6c570590d1ebbe3f7df28a388448981ccfd1fd52d7d9443cbcc8335630f890
Deleted: sha256:d8bc68c4ccbaaddb8ae026159c5ec47691198a47dcecec0fb134b3dc30507b13
Deleted: sha256:87e863855652b20f4d0ab45c8608a5fd4d99d1eb759b4a2a09f1a82ef68b1abc
Deleted: sha256:a996688e5211438bbef257c9fccecc209936ba8005dddc830ac3def3675d82e8
Deleted: sha256:d16d1b7a622b1599bac6442b550b1d31fc8348033a9ab00d86b35789a1487266
Deleted: sha256:744c86b543903d171c69633d70aef72a25ce73da0a3be609e46db08e72978810
[root@iZbp128dczen7roibd3xciZ ~]# 

#可选 清理minio数据
[root@xxx ~]# rm -rf /data/minio/
```





## 二、离线部署 nacos(单机)

### 1、离线安装包获取

- 先在有网络的机器环境下安装并导出nacos镜像

```
#拉取最新的nacos（需要网络）
docker search nacos
docker pull nacos/nacos-server
#查看已安装的nacos镜像
docker images
#导出nacos镜像的安装包
docker save nacos/nacos-server -o nacos.tar
```

- 在无网络的机器上导入nacos镜像包

> 上传绝对路径：/root/nacos.tar

```
# 导入nacos镜像包 
[root@xxx ~]# docker load -i nacos.tar 
```



### 2、编写docker-compose.yml

> 在之前的minio基础上追加对nacos的配置（也可以分文件配置）
>
> 绝对路径：/root/docker-compose.yml

```
version: '3'
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - 9000:9000
      - 9011:9011
    environment:
      TZ: Asia/Shanghai
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    volumes:
      - /data/minio:/data
    command: server /data --console-address ":9011"
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    volumes:
      #日志目录挂载
      - /data/nacos/logs:/home/nacos/logs
      - /data/nacos/data:/home/nacos/data
    ports:
      #端口映射
      - 8848:8848
    environment:
      #环境配置
      - PREFER_HOST_MODE=hostname
      - MODE=standalone 
      # 数据源平台 (不配置则默认使用内置数据库derby)
      #- SPRING_DATASOURCE_PLATFORM=mysql
      # mysql配置，!!!attention必须是mysql所在主机IP
      #- MYSQL_SERVICE_HOST=47.111.1.180
      #- MYSQL_SERVICE_PORT=3306
      #- MYSQL_SERVICE_USER=root
      #- MYSQL_SERVICE_PASSWORD=123456
      #- MYSQL_SERVICE_DB_NAME=nacos
```

### 3、启动和关闭镜像

> 在docker-compose.yml的目录下执行命令，否则会报`no configuration file provided: not found`

```
# 启动
docker compose up -d
# 关闭
docker compose down
```



### 4、验证nacos服务

访问nacos控制台页面：http://xxx:8848/  ，输入配置文件中的用户名nacos、密码nacos登录成功即可开始使用了！

![](http://cdn.gydblog.com/images/docker/docker-component-7.png)

### 5、卸载nacos镜像

```
#停止nacos容器
[root@xxx ~]# docker container stop nacos
nacos

#删除容器
[root@xxx ~]# docker container rm nacos
nacos

#删除镜像(镜像ID通过docker images查看)
[root@xxx ~]# docker rmi e31e0721a96b
```





### 6、遇到的问题

启动一直在重启，查看/data/nacos/nacos.log的日志发现有如下重复日志：

![](http://cdn.gydblog.com/images/docker/docker-component-2.png)

![](http://cdn.gydblog.com/images/docker/docker-component-3.png)

日志中显示tomcat服务一直在重启，而且因为使用的是默认内置的数据库derby，日志中出现大量关于`org.apache.derby.jdbc.EmbeddedDriver`的warn日志，查了很多资料没查到答案，最后发现机器内存很少，尝试释放了一些内存之后，nacos启动好了。。  

## 三、离线部署 redis(单机)

### 1、离线安装包获取

- 先在有网络的机器环境下安装并导出redis镜像

```
#拉取最新的redis（需要网络）
docker search redis
docker pull redis
#查看已安装的redis镜像
docker images
#导出redis镜像的安装包
docker save redis -o redis.tar
```



- 在无网络的机器上导入redis镜像包

  > 上传绝对路径：/root/redis.tar

```
#创建redis相关目录和配置文件
[root@xxx ~]#  mkdir -p /data/redis/conf/
```

 在/data/redis/conf目录下创建配置文件redis.conf并写入如下内容：

```
# 关闭保护模式，允许远程连接
protected-mode no
# 开启AOF持久化
appendonly yes 
# 密码
requirepass 123456
```



```
# 导入redis镜像包 
[root@xxx ~]# docker load -i redis.tar 
2edcec3590a4: Loading layer [==================================================>]  83.86MB/83.86MB
9b24afeb7c2f: Loading layer [==================================================>]  338.4kB/338.4kB
4b8e2801e0f9: Loading layer [==================================================>]  4.274MB/4.274MB
529cdb636f61: Loading layer [==================================================>]   27.8MB/27.8MB
9975392591f2: Loading layer [==================================================>]  2.048kB/2.048kB
8e5669d83291: Loading layer [==================================================>]  3.584kB/3.584kB
Loaded image: redis:latest
[root@xxx ~]# 
```



### 2、编写docker-compose.yml

> 在之前的nacos和minio基础上追加对redis的配置（也可以分文件配置）
>
> 绝对路径：/root/docker-compose.yml

```
version: '3'
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - 9000:9000
      - 9011:9011
    environment:
      TZ: Asia/Shanghai
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    volumes:
      - /data/minio:/data
    command: server /data --console-address ":9011"
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    volumes:
      #日志目录挂载
      - /data/nacos/logs:/home/nacos/logs
      - /data/nacos/data:/home/nacos/data
    ports:
      #端口映射
      - 8848:8848
    environment:
      #环境配置，nacos无需数据库配置连接
      - PREFER_HOST_MODE=hostname
      - MODE=standalone 
      # 数据源平台 
      #- SPRING_DATASOURCE_PLATFORM=mysql
      # mysql配置，!!!attention必须是mysql所在主机IP
      #- MYSQL_SERVICE_HOST=47.111.1.180
      #- MYSQL_SERVICE_PORT=3306
      #- MYSQL_SERVICE_USER=root
      #- MYSQL_SERVICE_PASSWORD=123456
      #- MYSQL_SERVICE_DB_NAME=nacos
  redis:
    image: redis
    container_name: redis
    ports:
      - 6379:6379
    volumes:
      - /data/redis/conf/redis.conf:/etc/redis/redis.conf
      - /data/redis/data:/data 
    restart: always
    privileged: true
    command: ["redis-server","/etc/redis/redis.conf"] 
```

### 3、启动和关闭镜像

> 在docker-compose.yml的目录下执行命令，否则会报`no configuration file provided: not found`

```
# 启动
docker compose up -d
# 关闭
docker compose down
```

### 4、验证redis服务

这里可以直接使用外部工具连接验证，也可以直接使用docker exec调用容器类程序测试。

- 使用docker exec方式连接redis。

```
[root@xxx ~]# docker exec -it redis redis-cli -a 1234567
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
127.0.0.1:6379> info server
# Server
redis_version:6.2.6
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:b61f37314a089f19
redis_mode:standalone
os:Linux 3.10.0-957.1.3.el7.x86_64 x86_64
arch_bits:64
multiplexing_api:epoll
atomicvar_api:atomic-builtin
gcc_version:10.2.1
process_id:1
process_supervised:no
run_id:7802b1ce3f5e25baa4a94ed9efe75a8dd18e461d
tcp_port:6379
server_time_usec:1710299049006668
uptime_in_seconds:1983
uptime_in_days:0
hz:10
configured_hz:10
lru_clock:15800232
executable:/data/redis-server
config_file:/etc/redis/redis.conf
io_threads_active:0
127.0.0.1:6379> set k 1
OK
127.0.0.1:6379> 
```

- 外部工具连接使用redis客户端工具，登录redis客户端：

![](http://cdn.gydblog.com/images/docker/docker-component-4.png)

![](http://cdn.gydblog.com/images/docker/docker-component-5.png)

### 5、redis的卸载

```
#停止redis容器
[root@xxx ~]# docker container stop redis
redis

#删除容器
[root@xxx ~]# docker container rm redis
redis

#删除镜像(镜像ID通过docker images查看)
[root@xxx ~]# docker rmi e31e0721a96b
```



## 四、离线部署 nginx(单机)

### 1、离线安装包获取

- 先在有网络的机器环境下安装并导出nginx镜像

```
#拉取最新的nginx（需要网络）
docker search nginx
docker pull nginx
#查看已安装的nginx镜像
docker images
#导出nginx镜像的安装包
docker save nginx -o nginx.tar
```



- 在无网络的机器上导入nginx镜像包

  > 上传绝对路径：/root/nginx.tar

```
#创建nginx相关目录和配置文件
[root@xxx data]# mkdir -p nginx/conf/
[root@xxx data]# mkdir -p nginx/data/conf.d
[root@xxx data]# mkdir -p nginx/data/log
[root@xxx data]# mkdir -p nginx/data/log
[root@xxx data]# mkdir -p nginx/html
[root@xxx data]# ls
minio  nacos  nginx  redis
```

 在/data/nginx/conf目录下创建配置文件nginx.conf并写入如下内容：

```
user root;
worker_processes  1;
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65; 
    server {
        gzip on;
	gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
	listen       81;
    server_name  localhost;
         location / {
            root  /usr/share/nginx/html;
           index  index.html index.htm;
	}
    }
}

```

 在/data/nginx/html目录下创建页面文件index.html并写入如下内容（用于后面的访问验证）：

```
hello nginx docker
```



 导入nginx镜像包 ：

```

[root@xxx ~]# docker load -i nginx.tar 
e379e8aedd4d: Loading layer [==================================================>]     62MB/62MB
b8d6e692a25e: Loading layer [==================================================>]  3.072kB/3.072kB
f1db227348d0: Loading layer [==================================================>]  4.096kB/4.096kB
32ce5f6a5106: Loading layer [==================================================>]  3.584kB/3.584kB
d874fd2bc83b: Loading layer [==================================================>]  7.168kB/7.168kB
Loaded image: nginx:latest
```



### 2、编写docker-compose.yml

> 在之前的配置文件基础上追加对nginx的配置（也可以分文件配置）
>
> 绝对路径：/root/docker-compose.yml

```
version: '3'
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - 9000:9000
      - 9011:9011
    environment:
      TZ: Asia/Shanghai
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    volumes:
      - /data/minio:/data
    command: server /data --console-address ":9011"
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    volumes:
      #日志目录挂载
      - /data/nacos/logs:/home/nacos/logs
      - /data/nacos/data:/home/nacos/data
    ports:
      #端口映射
      - 8848:8848
    environment:
      #环境配置，nacos无需数据库配置连接
      - PREFER_HOST_MODE=hostname
      - MODE=standalone 
      # 数据源平台 
      #- SPRING_DATASOURCE_PLATFORM=mysql
      # mysql配置，!!!attention必须是mysql所在主机IP
      #- MYSQL_SERVICE_HOST=47.111.1.180
      #- MYSQL_SERVICE_PORT=3306
      #- MYSQL_SERVICE_USER=root
      #- MYSQL_SERVICE_PASSWORD=123456
      #- MYSQL_SERVICE_DB_NAME=nacos
  redis:
    image: redis
    container_name: redis
    ports:
      - 6379:6379
    volumes:
      - /data/redis/conf/redis.conf:/etc/redis/redis.conf
      - /data/redis/data:/data 
    restart: always
    privileged: true
    command: ["redis-server","/etc/redis/redis.conf"] 
  nginx:
    restart: always
    image: nginx
    ports:
      - 81:81
      - 444:444
    volumes:
      - /data/nginx/data/conf.d:/etc/nginx/conf.d
      - /data/nginx/log:/var/log/nginx
      - /data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - /data/nginx/html:/usr/share/nginx/html
```

### 3、启动和关闭镜像

> 在docker-compose.yml的目录下执行命令，否则会报`no configuration file provided: not found`

```
# 启动
docker compose up -d
# 关闭
docker compose down
```

### 4、验证nginx服务 

打开浏览器输入http://xxxx:81/index.html  （xxxx是宿主机ip地址）出现如下信息则说明部署成功了：

![](http://cdn.gydblog.com/images/docker/docker-component-8.png)



### 5、nginx的卸载

```
#停止nginx容器
[root@xxx ~]# docker container stop nginx
redis

#删除容器
[root@xxx ~]# docker container rm nginx
redis

#删除镜像(镜像ID通过docker images查看)
[root@xxx ~]# docker rmi e31e0721a96b
```



### 6、遇到的问题

查看/data/nginx/log/error.log 报如下错误：

```
invalid parameter "server_name" in /etc/nginx/nginx.conf:36
```

检查下来是nginx.conf格式不对，重新修改即可。

## 五、离线部署 mysql(单机)

### 1、离线安装包获取

- 先在有网络的机器环境下安装并导出mysql镜像

```
#拉取最新的mysql（需要网络）
docker search mysql
docker pull mysql
#查看已安装的mysql镜像
docker images
#导出mysql镜像的安装包
docker save mysql -o mysql.tar
```



- 在无网络的机器上导入mysql镜像包

  > 上传绝对路径：/root/mysql.tar

```
[root@iZbp128dczen7roibd3xciZ ~]# docker load -i mysql.tar 
ad6b69b54919: Loading layer [==================================================>]  72.55MB/72.55MB
fba7b131c5c3: Loading layer [==================================================>]  338.4kB/338.4kB
0798f2528e83: Loading layer [==================================================>]  9.556MB/9.556MB
a0c2a050fee2: Loading layer [==================================================>]  4.202MB/4.202MB
d7a777f6c3a4: Loading layer [==================================================>]  2.048kB/2.048kB
0d17fee8db40: Loading layer [==================================================>]  53.77MB/53.77MB
aad27784b762: Loading layer [==================================================>]  5.632kB/5.632kB
1d1f48e448f9: Loading layer [==================================================>]  3.584kB/3.584kB
c654c2afcbba: Loading layer [==================================================>]  380.5MB/380.5MB
118fee5d988a: Loading layer [==================================================>]  5.632kB/5.632kB
fc8a043a3c75: Loading layer [==================================================>]  17.92kB/17.92kB
d67a9f3f6569: Loading layer [==================================================>]  1.536kB/1.536kB
Loaded image: mysql:latest
```

在/data目录下 创建相关目录

```
[root@xxx data]# mkdir -p mysql/log
[root@xxx data]# mkdir -p mysql/data
[root@xxx data]# mkdir -p mysql/conf.d
[root@xxx data]# ls
minio  mysql  nacos  nginx  redis
```

在/data/conf.d下新增配置文件，并输入如下内容（若没有特殊需求配置可跳过本步骤）：

```
###### [client]配置模块 ######
[client]
default-character-set=utf8mb4
socket=/var/lib/mysql/mysql.sock

###### [mysql]配置模块 ######
[mysql]
# 设置MySQL客户端默认字符集
default-character-set=utf8mb4
socket=/var/lib/mysql/mysql.sock

###### [mysqld]配置模块 ######
[mysqld]
port=3306
user=mysql
# 设置sql模式 sql_mode模式引起的分组查询出现*this is incompatible with sql_mode=only_full_group_by，这里最好剔除ONLY_FULL_GROUP_BY
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
server-id = 1

# MySQL8 的密码认证插件 如果不设置低版本navicat无法连接
default_authentication_plugin=mysql_native_password

# 禁用符号链接以防止各种安全风险
symbolic-links=0

# 允许最大连接数
max_connections=1000

# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8mb4

# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB

# 表名存储在磁盘是小写的，但是比较的时候是不区分大小写
lower_case_table_names=0
max_allowed_packet=16M 

# 设置时区
default-time_zone='+8:00'
```

### 2、编写docker-compose.yml

在之前的配置文件基础上追加对mysql的配置（也可以分文件配置）

绝对路径：/root/docker-compose.yml

```
version: '3'
services:
  minio:
    image: minio/minio
    container_name: minio
    ports:
      - 9000:9000
      - 9011:9011
    environment:
      TZ: Asia/Shanghai
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    volumes:
      - /data/minio:/data
    command: server /data --console-address ":9011"
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    volumes:
      #日志目录挂载
      - /data/nacos/logs:/home/nacos/logs
      - /data/nacos/data:/home/nacos/data
    ports:
      #端口映射
      - 8848:8848
    environment:
      #环境配置，nacos无需数据库配置连接
      - PREFER_HOST_MODE=hostname
      - MODE=standalone 
      # 数据源平台 
      #- SPRING_DATASOURCE_PLATFORM=mysql
      # mysql配置，!!!attention必须是mysql所在主机IP
      #- MYSQL_SERVICE_HOST=47.111.1.180
      #- MYSQL_SERVICE_PORT=3306
      #- MYSQL_SERVICE_USER=root
      #- MYSQL_SERVICE_PASSWORD=123456
      #- MYSQL_SERVICE_DB_NAME=nacos
  redis:
    image: redis
    container_name: redis
    ports:
      - 6379:6379
    volumes:
      - /data/redis/conf/redis.conf:/etc/redis/redis.conf
      - /data/redis/data:/data 
    restart: always
    privileged: true
    command: ["redis-server","/etc/redis/redis.conf"] 
  nginx:
    restart: always
    container_name: nginx
    image: nginx
    ports:
      - 81:81
      - 444:444
    volumes:
      - /data/nginx/data/conf.d:/etc/nginx/conf.d
      - /data/nginx/log:/var/log/nginx
      - /data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf
      - /data/nginx/html:/usr/share/nginx/html 
  mysql:     
    image: mysql
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=12345678 
    volumes:
      - /data/mysql/log:/var/log/mysql 
      - /data/mysql/data:/var/lib/mysql 
      - /data/mysql/conf.d:/etc/mysql/conf.d 
      - /etc/localtime:/etc/localtime:ro 
    ports:
      - 3306:3306 
    restart: always
```



### 3、启动和关闭镜像

> 在docker-compose.yml的目录下执行命令，否则会报`no configuration file provided: not found`

```
# 启动
docker compose up -d
# 关闭
docker compose down
```

### 4、验证mysql服务

这里可以直接使用外部工具连接验证，也可以直接使用docker exec调用容器内程序测试。

- 使用docker exec方式连接mysql。

```
#进入mysql容器虚拟机
[root@iZbp128dczen7roibd3xciZ log]# docker exec -it mysql  /bin/bash
root@02a4b0391e94:/# ls
bin  boot  dev	docker-entrypoint-initdb.d  entrypoint.sh  etc	home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@02a4b0391e94:/# mysql -h 127.0.0.1 -uroot -p12345678
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.27 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> select 

```

- 使用外部客户端如DBeaver连接

![](http://cdn.gydblog.com/images/docker/docker-component-10.png)

![](http://cdn.gydblog.com/images/docker/docker-component-11.png)

### 5、mysql的卸载

```
#停止mysql容器
[root@xxx ~]# docker container stop mysql
mysql

#删除容器
[root@xxx ~]# docker container rm mysql
mysql

#删除镜像(镜像ID通过docker images查看)
[root@xxx ~]# docker rmi e31e0721a96b
```

