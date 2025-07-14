---
title: 容器化docker技术-Docker Compose
shortTitle: Docker Compose入门
date: 2024-12-01
category:
  - 容器化
tag:
  - docker
head:
  - - meta
    - name: keywords
      content: 容器化,docker,docker compose
---

# Docker Compose入门



> [Docker Compose 官方文档](https://docs.docker.com/compose/)

## 一、简介

自 2023 年 7 月起，Compose V1 停止更新，不再出现在新的 Docker Desktop 版本中。Compose V2 是目前最新的版本。

## 二、安装

官方提供了三种方式：

- 安装Docker Desktop（window、linux、macos）

  获取 Docker Compose 的最简单和推荐的方法是安装 Docker Desktop。Docker Desktop 包括 Docker Compose 以及 Docker Engine 和 Docker CLI，后两个组件是 安装运行Compose 的前提条件。

  如果已经安装了 Docker Desktop，则可以通过从 Docker 菜单![鲸鱼菜单](https://docs.docker.com/desktop/images/whale-x.svg)中选择 **About Docker Desktop** 来检查当前的 Compose 版本。

- 安装Compose插件（仅支持linux）

  如果已经安装了 Docker 引擎和 Docker CLI，则可以通过以下任一方式从命令行安装 Compose 插件：

  1）使用docker repository命令在线安装

  2）下载Compose安装包离线安装

   

- 安装Compose单机版（linux、window）

  可以在 Linux 或 Windows Server 上安装 Compose 单机版。详情参考：https://docs.docker.com/compose/install/standalone/

  不建议使用此安装方案，仅出于向后兼容性目的而支持此安装方案



>  小郭在这里记录下在linux环境（centos）下安装Compose插件的全过程。

### 2.1 自动安装
#### 1）安装docker

可以看看小郭之前总结的一篇文章：[docker安装说明](./docker.md#二、centos环境docker安装)

#### 2）更新包索引

> 这个过程可能耗时比较长，小郭等了五分钟

```
[root@XXX ~]# sudo yum update
```

#### 3）执行Compose安装

```
[root@XXX ~]# sudo yum install docker-compose-plugin
```

#### 4）查看Compose版本

通过检查版本来验证 Docker Compose 是否已正确安装。

```
[root@XXX ~]# docker compose version
```

我这里的版本显示是：

```
Docker Compose version v2.24.2
```



#### 5）更新Compose版本

要更新 Compose 插件的版本，可以重新运行以下命令：

```console
[root@XXX ~]# sudo yum update
[root@XXX ~]# sudo yum install docker-compose-plugin
```



### 2.2 手动安装

这种手动方式要求我们手动管理升级。官方建议手动设置 Docker 的存储库，以便于维护。

#### 1）安装包获取

如果缺少Compose CLI插件，可以在目标机器上运行如下命令：

```
[root@XXX ~]# [root@XXX ~]# DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
[root@XXX ~]# curl -SL https://github.com/docker/compose/releases/download/v2.24.2/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
```

上述命令会下载最新版本的 Docker Compose（从 Compose 版本存储库），并在$HOME目录下为用户安装 Compose



#### 2）执行安装

执行如下命令(二选一)：

>  为当前用户安装Compose

```console
[root@XXX ~]# chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

> 为所有用户安装 Compose：

```
[root@XXX ~]# sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```



#### 3）测试安装

```
[root@XXX ~]# docker compose version
Docker Compose version v2.24.2
```





## 三、使用总结

### 3.1 命令

```
# 启动
docker compose up 
docker compose up -d 后台启动
# 停止并删除容器
docker compose down 

# 停止(不删除容器)
docker compose stop
# 查看运行中的容器
docker compose ps

# 查看帮助说明
docker compose --help

# 进入某个镜像的容器命令行（以mysql为例）
docker exec -it  mysql8 /bin/bash

```



### 3.2 配置文件

Docker Compose 依赖于一个 YAML 配置文件，通常命名为 .`compose.yaml`



### 3.3 配置文件

docker-compose.yaml

```
version: '3'
services:
  # 指定服务名称
  mysql:
    # 指定服务使用的镜像
    image: mysql:5.7
    # 指定容器名称
    container_name: mysql
    restart: always
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    # 指定服务运行的端口
    ports:
      - 3306:3306
    # 指定容器中需要挂载的文件
    volumes:
      - /mydata/mysql/data/db:/var/lib/mysql #数据文件挂载
      - /mydata/mysql/data/conf:/etc/mysql/conf.d #配置文件挂载
      - /mydata/mysql/log:/var/log/mysql #日志文件挂载
    # 指定容器的环境变量
    environment:
      - MYSQL_ROOT_PASSWORD=root

  # 指定服务名称
  minio:
    # 指定服务使用的镜像
    image: minio/minio
    # 指定容器名称
    container_name: minio
    restart: always
    # 指定服务运行的端口
    ports:
      - 9000:9000 # api 端口
      - 9090:9090 # 控制台端口
    # 指定容器中需要挂载的文件
    volumes:
      - /mydata/minio/data:/data               #映射当前目录下的data目录至容器内/data目录
      - /mydata/minio/config:/root/.minio/     #映射配置目录
      - /etc/localtime:/etc/localtime
    # 指定容器的环境变量
    environment:
      MINIO_ACCESS_KEY: minioadmin    #管理后台用户名
      MINIO_SECRET_KEY: minioadmin #管理后台密码，最小8个字符
    command: server -console-address ":9000" --address ":9090" /data  #指定容器中的目录 /data
  
  nginx:
    image: nginx:1.10
    restart: always
    container_name: nginx
    volumes:
      - /mydata/nginx/nginx.conf:/etc/nginx/nginx.conf #配置文件挂载
      - /mydata/nginx/html:/usr/share/nginx/html #静态资源根目录挂载
      - /mydata/nginx/log:/var/log/nginx #日志文件挂载
      - #若用到ssl，可以引入
      - /mydata/nginx/ssl:/etc/nginx/ssl
    ports:
      - 80:80
      - 443:443

```



docker-compose-app.yaml:

```
version: '3'
services:
  # 指定服务名称
  mall-tiny-docker-compose:
    # 指定服务使用的镜像
    image: mall-tiny/mall-tiny:1.0.0-SNAPSHOT
    # 指定容器名称
    container_name: mall
    depends_on:
      - minio
      - mysql
    # 指定服务运行的端口
    ports:
      - 8080:8080
    # 指定容器中需要挂载的文件
    volumes:
      - /etc/localtime:/etc/localtime
      - /mydata/app/mall-tiny-docker-compose/logs:/var/logs
    external_links:
      - minio:minio #可以用minio这个域名访问minio服务
      - mysql:mysql #可以用mysql这个域名访问mysql服务
```



基于springboot程序的镜像构建：

[入门 |Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker/)







四、示例程序

mysql：  

```
#安装
#进入命令行
docker exec -it mysql8 /bin/bash

#创建用户
create user 'test'@'%' IDENTIFIED BY '123456'
#开启远程访问
GRANT ALL PRIVILEGES ON *.* TO 'test'@'%';
#刷新权限
flush privileges;
```

