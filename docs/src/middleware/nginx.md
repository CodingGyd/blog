---
title: Nginx知识点详解
shortTitle: Nginx知识点详解
date: 2023-09-19
category:
  - 微服务中间件
description: 记录中间件Nginx的常用知识点
head:
  - - meta
    - name: keywords
      content: Nginx,反向代理,负载均衡
---

[TOC]

## 一、前言

**首先，我们来看一张关于正向代理和反向代理的图片**

<img src="http://cdn.gydblog.com/images/middleware/nginx-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

*简单理解正向代理和反向代理的概念：*

- 正向代理：在客户端配置代理服务器(和跳板机功能类似，比如公司很多机器需要通过跳板机才允许登录，正向代理的典型用途是为在防火墙内的局域网客户端提供访问Internet的途径)
- 反向代理：在服务端配置代理服务器(暴露的是代理服务器的地址，隐藏了真实服务器的地址，反向代理的典型用途是将防火墙后面的服务器提供给Internet用户访问)

*简单理解正向代理和反向代理的共同点：*

1. 都是做为服务器和客户端的中间层
2. 都可以加强内网的安全性，阻止 web 攻击
3. 都可以做缓存机制，提高访问速度

*简单理解正向代理和反向代理的区别：*

1. 正向代理其实是客户端的代理,反向代理则是服务器的代理。
2. 正向代理中，服务器并不知道真正的客户端到底是谁；而在反向代理中，客户端也不知道真正的服务器是谁。
3. 作用不同。正向代理主要是用来解决访问限制问题；而反向代理则是提供负载均衡、安全防护等作用

而nginx就是比较流行的反向代理组件。



## 二、Nginx介绍

*Nginx* (engine x) 是一个高性能的http和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（[俄文](https://baike.baidu.com/item/俄文/5491693?fromModule=lemma_inlink)：Рамблер）开发的，公开版本1.19.6发布于2020年12月15日。

Nginx将源代码以类BSD许可证的形式发布，因它的稳定性、丰富的功能集、简单的配置文件和低系统资源的消耗而闻名。2022年01月25日，nginx 1.21.6发布。

其特点是占有内存少，并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好。

**优点**

- 开源免费

  nginx作为开源软件，文档齐全，社区活跃，可以免费使用以及二次开发。这个是最重要的优点，哈哈~ 毕竟如果需要付费使用的话，大部分小企业都不会愿意采用了。

- 安装部署和更新非常方便

  nginx 是一个安装非常的简单、配置文件非常简洁（还能够支持perl语法）的服务。Nginx 启动也特别容易，还能够在不间断服务的情况下进行软件版本的热更新。

- 稳定性极高

  nginx是Bug非常少的服务，用于反向代理，宕机的概率微乎其微，并且几乎可以做到7*24不间断运行，即使运行数个月也不需要重新启动。

- 支持主流操作系统

   nginx可以在大多数Unix Linux OS 上编译运行，并有Windows移植版

- 支持高并发量访问

  官方测试数据显示nginx能同时支持高达50000个并发连接数的响应，在实际生产环境中跑到2-3万并发。

- 系统资源开销少

  nginx采用C进行编写，不论是系统资源开销还是CPU使用效率都是比较好的。

- 模块化的结构设计

  nginx提供了很多开箱即用的功能模块，如果不需要可以通过参数关闭。

- 其它

  其实还可以列出很多优点，每个人总结的优点都会不一样啦，总之就是想强调这款程序非常优秀！

   



## 三、如何安装

> 小郭采用下载nginx源码编译的方式进行安装

Nginx 使用 Unix 下常用的 './configure && make && make install' 过程来完成配置、编译构建、安装。

### 1）从官网下载源码包

[源码下载链接](https://nginx.org/en/download.html)

![源码包获取](http://cdn.gydblog.com/images/middleware/nginx-install-1.png)



> 小郭这里选取了nginx-1.9.9的linux版本下载，如果你对版本功能有特殊要求，按需选择哦！

### 2）配置环节

`configure` 脚本负责在我们使用的系统上准备好软件的构建环境。确保接下来的构建和安装过程所需要的依赖准备好，并且搞清楚使用这些依赖需要的东西。

configure命令的作用主要是根据当前系统环境是生成Makefile文件（指定安装路径；自动设定源程序以符合各种不同平台上Unix系统的特性）。

在前面的步骤1已经下载好了源码包，我们将其解压：

```linux
#我的安装包存放目录是/home/guoyd
cd /home/guoyd  
tar -zxvf nginx-1.9.9.tar.gz 
cd nginx-1.9.9
```

![解压的目录结构](http://cdn.gydblog.com/images/middleware/nginx-install-3.png)

接下来使用configure命令对源码进行配置

> nginx支持很多扩展功能，有很多功能模块可以选择开启或者关闭，因此通过configure命令按需自己编译比较合适。

可以通过./configure --help 查看支持的参数选项：

```nginx
[root@iZbp128dczen7roibd3xciZ nginx-1.9.9]# ./configure --help

  --help                             print this message
  #Nginx安装路径。如果没有指定，默认为 /usr/local/nginx
  --prefix=PATH                     
  #Nginx可执行文件安装路径。只能安装时指定，如果没有指定，默认为/sbin/nginx
  --sbin-path=PATH         
  #在没有给定-c选项下默认的nginx.conf的路径。如果没有指定，默认为/conf/nginx.conf
  --conf-path=PATH
  #在nginx.conf中没有指定error_log指令的情况下，默认的错误日志的路径。如果没有指定，默认为 /logs/error.log
  --error-log-path=PATH
  #在nginx.conf中没有指定pid指令的情况下，默认的nginx.pid的路径。如果没有指定，默认为 /logs/nginx.pid
  --pid-path=PATH 
  #nginx.lock文件的路径
  --lock-path=PATH                 
  #在nginx.conf中没有指定user指令的情况下，默认的nginx使用的用户。如果没有指定，默认为 nobody
  --user=USER
  #在nginx.conf中没有指定group指令的情况下，默认的nginx使用的组。如果没有指定，默认为 nobody
  --group=GROUP
  #指定编译的名称
  --build=NAME                     
  #指定编译的目录
  --builddir=DIR                     
  #允许开启SELECT模式，如果 configure 没有找到更合适的模式，比如：kqueue(sun os),epoll (linux kenel 2.6+),rtsig（实时信号）或者/dev/poll（一种类似select的模式，底层实现与SELECT基本相 同，都是采用轮训方法） SELECT模式将是默认安装模式  
  --with-select_module              
  #禁用SELECT模式
  --without-select_module          
  #启用 poll 模块支持（功能与 select 相同，与 select 特性相同，为一种轮询模式,不推荐在高负载环境下使用）
  --with-poll_module    
  #禁用 poll 模块支持
  --without-poll_module               
  #开启线程池支持(社区版从1.7.11开始引入线程池, 默认不开启时无论是master进程，还是worker进程的线程数都是1)
  --with-threads                     
  #启用 file aio 支持（一种 APL 文件传输格式）
  --with-file-aio 
  #启用 ipv6 支持
  --with-ipv6                  
  #开启HTTP SSL模块，使NGINX可以支持HTTPS请求。这个模块需要已经安装了OPENSSL，在DEBIAN上是libssl
  --with-http_ssl_module   
  #启用对HTTP/2的支持，并取代ngx_http_spdy_module模块
  --with-http_v2_module
  #启用 ngx_http_realip_module 支持（这个模块允许从请求标头更改客户端的 IP 地址值，默认为关）
  --with-http_realip_module
  #启用 ngx_http_addition_module 支持（作为一个输出过滤器，支持不完全缓冲，分部分响应请求）
  --with-http_addition_module
  #启用 ngx_http_xslt_module 支持（过滤转换 XML 请求）
  --with-http_xslt_module  
  #启用 ngx_http_image_filter_module 支持（传输 JPEG/GIF/PNG 图片的一个过滤器）（默认为不启用。GD 库要用到）
  --with-http_image_filter_module
  #启用 ngx_http_geoip_module 支持（基于与 MaxMind GeoIP 二进制文件相配的客户端 IP 地址的 ngx_http_geoip_module 变量）
  --with-http_geoip_module           
  #启用 ngx_http_sub_module 支持（允许用一些其他文本替换 Nginx 响应中的一些文本）
  --with-http_sub_module 
  #启用 ngx_http_dav_module 支持（增加 PUT、DELETE、MKCOL 创建集合，COPY 和 MOVE 方法）默认情况下为关闭，需编译开启
  --with-http_dav_module
  #启用 ngx_http_flv_module 支持（提供寻求内存使用基于时间的偏移量文件）
  --with-http_flv_module 
  #启用ngx_http_mp4_module 模块为 MP4 文件提供伪流服务端支持。这些文件的扩展名通常为 .mp4、.m4v 或 .m4a。
  --with-http_mp4_module
  #启用ngx_http_gunzip_module模块为不支持"gzip"编码方式的客户端解压缩头"Content-Encoding:gzip"提供的过滤器。
  --with-http_gunzip_module
  #启用ngx_http_gzip_static_module模块，开启预读gzip功能，允许发送.gz扩展名文件进行响应。
  --with-http_gzip_static_module   
  #启用ngx_http_auth_request_module模块(1.5.4)基于子请求的结果实现客户端授权。如果子请求返回 2xx 响应代码，则允许访问。如  果返回 401 或 403，则使用相应的错误代码拒绝访问。子请求返回的任何其他响应代码都被视为错误
  --with-http_auth_request_module
  #启用 ngx_http_random_index_module 支持（从目录中随机挑选一个目录索引）
  --with-http_random_index_module
  #启用 ngx_http_secure_link_module 支持（计算和检查要求所需的安全链接网址）
  --with-http_secure_link_module
  #启用 ngx_http_degradation_module 支持（允许在内存不足的情况下返回204或444码）
  --with-http_degradation_module
  #启用ngx_http_slice_module模块(1.9.8), 提供一个过滤器，用于将请求分为多个子请求，每个子请求都返回一定范围的响应
  --with-http_slice_module  
  #启用 ngx_http_stub_status_module 支持（获取 Nginx 自上次启动以来的工作状态）
  --with-http_stub_status_module  
  #禁用 ngx_http_charset_module 支持（重新编码 WEB 页面，但只能是一个方向--服务器端到客户端，并且只有一个字节的编码可以被重  新编码）  
  --without-http_charset_module
  #禁用 ngx_http_gzip_module 支持（该模块同 --with-http_gzip_static_module 功能一样）
  --without-http_gzip_module
  #禁用 ngx_http_ssi_module 支持（该模块提供了一个在输入端处理处理服务器包含文件（SSI）的过滤器，目前支持 SSI 命令的列表是不完整的）
  --without-http_ssi_module
  #禁用 ngx_http_userid_module 支持（该模块用来处理用来确定客户端后续请求的 cookie ）
  --without-http_userid_module
  #禁用 ngx_http_access_module 支持（该模块提供了一个简单的基于主机的访问控制。允许/拒绝基于 IP 地址）
  --without-http_access_module
  #禁用 ngx_http_auth_basic_module（该模块是可以使用用户名和密码基于 HTTP 基本认证方法来保护你的站点或其部分内容）
  --without-http_auth_basic_module
  #禁用 ngx_http_autoindex_module支持（该模块用于自动生成目录列表，只在 ngx_http_index_module 模块未找到索引文件时发出请求）
  --without-http_autoindex_module 
  #禁用 ngx_http_geo_module 支持（创建一些变量，其值依赖于客户端的IP地址）
  --without-http_geo_module    
  #禁用 ngx_http_map_module 支持（使用任意的键/值对设置配置变量）
  --without-http_map_module
  #禁用 ngx_http_split_clients_module 支持（该模块用来基于某些条件划分用户。条件如：ip地址、报头、cookies等等）
  --without-http_split_clients_module
  #禁用 ngx_http_referer_module支持（该模块用来过滤请求，拒绝报头中 Referer 值不正确的请求）
  --without-http_referer_module
  #禁用 ngx_http_rewrite_module ，链接重写
  --without-http_rewrite_module 
  #禁用 ngx_http_proxy_module 支持（有关代理服务器）
  --without-http_proxy_module 
  #禁用 ngx_http_fastcgi_module 支持（该模块允许 Nginx 与 FastCGI 进程交互，并通过传递参数来控制 FastCGI 进程工作。 ）FastCGI 一个常驻型的公共网关接口 
  --without-http_fastcgi_module
  #禁用 ngx_http_uwsgi_module 支持（该模块用来医用uwsgi协议，uWSGI服务器相关）
  --without-http_uwsgi_module
  #禁用 ngx_http_scgi_module支持
  --without-http_scgi_module
  #禁用 ngx_http_memcached_module 支持（该模块用来提供简单的缓存，以提高系统效率）
  --without-http_memcached_module  
  ##禁用ngx_http_limit_conn_module模块，该模块用于限制每个定义的键的连接数，特别是来自单个 IP 地址的连接数 
  --without-http_limit_conn_module     
  #禁用 ngx_http_limit_req_module 支持（该模块允许你对于一个地址进行请求数量的限制用一个给定的session或一个特定的事件）
  --without-http_limit_req_module 
  #禁用 ngx_http_empty_gif_module 支持（该模块在内存中常驻了一个1*1的透明GIF图像，可以被非常快速的调用）
  --without-http_empty_gif_module
  #禁用 ngx_http_browser_module 支持
  --without-http_browser_module
  #禁用ngx_http_upstream_hash_module，该模块支持普通的hash及一致性hash两种负载均衡算法，默认的是普通的hash来进行负载均衡。
  --without-http_upstream_hash_module
  #禁用 ngx_http_upstream_ip_hash_module 支持（该模块用于简单的负载均衡）                                  
  --without-http_upstream_ip_hash_module
  #禁用ngx_http_upstream_least_conn_module用于将多个服务器器定义成服务器器组,⽽由 proxy_pass,fastcgi_pass 等指令进⾏引  
  --without-http_upstream_least_conn_module
  #禁用http_upstream_keepalive_module模块                                     
  --without-http_upstream_keepalive_module
  #禁用ngx_http_upstream_zone_module模块 该模块使用共享内存使负载均衡策略对所有worker进程生效                           
  --without-http_upstream_zone_module
  #启用 ngx_http_perl_module 支持（该模块使nginx可以直接使用perl或通过ssi调用perl）
  --with-http_perl_module    
  #设定 perl 模块路径
  --with-perl_modules_path=PATH 
  #设定 perl 库文件路径
  --with-perl=PATH 
  #设定 access log 路径
  --http-log-path=PATH  
  #设定 HTTP 客户端请求临时文件路径
  --http-client-body-temp-path=PATH
  #设定 HTTP 代理临时文件路径
  --http-proxy-temp-path=PATH  
  #设定 HTTP Fastcgi 临时文件路径
  --http-fastcgi-temp-path=PATH
  #设定 HTTP uwsgi 临时文件路径
  --http-uwsgi-temp-path=PATH
  #设定 HTTP scgi 临时文件路径
  --http-scgi-temp-path=PATH
  #禁用 HTTP server 功能
  --without-http           
  #禁用 HTTP Cache 功能
  --without-http-cache          
  #启用 POP3/IMAP4/SMTP 代理模块支持   
  --with-mail
  #启用 ngx_mail_ssl_module 支持
  --with-mail_ssl_module
  #禁用 POP3 协议
  --without-mail_pop3_module
  #禁用 IMAP 协议
  --without-mail_imap_module 
  #禁用 SMTP 协议
  --without-mail_smtp_module 
  #启用tcp代理支持
  --with-stream   
  #启用ngx_stream_ssl_module模块，用于流代理服务器与SSL / TLS协议工作必要的支持
  --with-stream_ssl_module 
  #启用ngx_http_limit_conn_module模块 能够配置并发连接数限制
  --without-stream_limit_conn_module 
  #禁用ngx_stream_access_module
  #禁用ngx_stream_access_module模块（1.9.2），该模块允许对某些客户端地址限制访问
  --without-stream_access_module
  #禁用ngx_stream_upstream_hash_module模块
  --without-stream_upstream_hash_module
  #禁用ngx_stream_upstream_least_conn_module模块                                 
  --without-stream_upstream_least_conn_module
  #禁用ngx_stream_upstream_zone_module模块，共享内存使用的单链表模块                                  
  --without-stream_upstream_zone_module
  #启用 ngx_google_perftools_module支持（调试用，剖析程序性能瓶颈）                           
  --with-google_perftools_module 
  #启用 ngx_cpp_test_module 支持
  --with-cpp_test_module  
  #添加新的模块
  --add-module=PATH 
  #指向 C 编译器路径
  --with-cc=PATH
  #指向 C 预处理路径
  --with-cpp=PATH 
  #设置 C 编译器参数
  --with-cc-opt=OPTIONS
  #设置连接文件参数
  --with-ld-opt=OPTIONS
  #指定编译的 CPU，可用的值为：pentium, pentiumpro, pentium3, pentium4, athlon, opteron, amd64, sparc32, sparc64, ppc64
  --with-cpu-opt=CPU
  #禁用 PCRE 库
  --without-pcre 
  #启用 PCRE 库
  --with-pcre
  #指向 PCRE 库文件目录
  --with-pcre=DIR 
  #在编译时为 PCRE 库设置附加参数
  --with-pcre-opt=OPTIONS
  # 配置参数启用 JIT 支持  PCRE JIT 可以明显加快正则表达式的处理速度。
  --with-pcre-jit                   
  #指向 MD5 库文件目录（消息摘要算法第五版，用以提供消息的完整性保护）
  --with-md5=DIR
  #在编译时为 MD5 库设置附加参数
  --with-md5-opt=OPTIONS
  #使用 MD5 汇编源
  --with-md5-asm 
  #指向 sha1 库目录（数字签名算法，主要用于数字签名）
  --with-sha1=DIR
  #在编译时为 sha1 库设置附加参数
  --with-sha1-opt=OPTIONS
  #使用 sha1 汇编源
  --with-sha1-asm
  #指向 zlib 库目录
  --with-zlib=DIR 
  #在编译时为 zlib 设置附加参数
  --with-zlib-opt=OPTIONS  
  #为指定的 CPU 使用 zlib 汇编源进行优化，CPU 类型为 pentium, pentiumpro
  --with-zlib-asm=CPU
  #为原子内存的更新操作的实现提供一个架构
  --with-libatomic  
  #指向 libatomic_ops 安装目录
  --with-libatomic=DIR 
  #指向 openssl 安装目录
  --with-openssl=DIR
  #在编译时为 openssl 设置附加参数
  --with-openssl-opt=OPTIONS  
  #启用 debug 日志
  --with-debug  
```

上面列出了configure支持的全部参数，其中：

- --with-xxx的参数表示默认没有开启的功能模块，如果需要开启，就需要加在./configure的执行参数

  例如：./configure --with-libatomic

- --without-xxx的参数表示默认已经开启安装的功能模块，如果不需要开启，就需要加在./configure的执行参数

  例如：./configure  without-mail_pop3_module

下面开始使用configure命令对nginx进行安装， 不带任何参数均使用默认配置。

```nginx
[root@iZbp128dczen7roibd3xciZ nginx-1.9.9]# ./configure
checking for OS
 + Linux 3.10.0-957.1.3.el7.x86_64 x86_64
checking for C compiler ... found
 + using GNU C compiler
 + gcc version: 4.8.5 20150623 (Red Hat 4.8.5-36) (GCC) 
checking for gcc -pipe switch ... found
checking for gcc builtin atomic operations ... found
checking for C99 variadic macros ... found
checking for gcc variadic macros ... found
checking for unistd.h ... found
checking for inttypes.h ... found
checking for limits.h ... found
checking for sys/filio.h ... not found
checking for sys/param.h ... found
checking for sys/mount.h ... found
checking for sys/statvfs.h ... found
checking for crypt.h ... found
checking for Linux specific features
checking for epoll ... found
checking for EPOLLRDHUP ... found
checking for O_PATH ... found
checking for sendfile() ... found
checking for sendfile64() ... found
checking for sys/prctl.h ... found
checking for prctl(PR_SET_DUMPABLE) ... found
checking for sched_setaffinity() ... found
checking for crypt_r() ... found
checking for sys/vfs.h ... found
checking for nobody group ... found
checking for poll() ... found
checking for /dev/poll ... not found
checking for kqueue ... not found
checking for crypt() ... not found
checking for crypt() in libcrypt ... found
checking for F_READAHEAD ... not found
checking for posix_fadvise() ... found
checking for O_DIRECT ... found
checking for F_NOCACHE ... not found
checking for directio() ... not found
checking for statfs() ... found
checking for statvfs() ... found
checking for dlopen() ... not found
checking for dlopen() in libdl ... found
checking for sched_yield() ... found
checking for SO_SETFIB ... not found
checking for SO_REUSEPORT ... found
checking for SO_ACCEPTFILTER ... not found
checking for TCP_DEFER_ACCEPT ... found
checking for TCP_KEEPIDLE ... found
checking for TCP_FASTOPEN ... found
checking for TCP_INFO ... found
checking for accept4() ... found
checking for eventfd() ... found
checking for int size ... 4 bytes
checking for long size ... 8 bytes
checking for long long size ... 8 bytes
checking for void * size ... 8 bytes
checking for uint64_t ... found
checking for sig_atomic_t ... found
checking for sig_atomic_t size ... 4 bytes
checking for socklen_t ... found
checking for in_addr_t ... found
checking for in_port_t ... found
checking for rlim_t ... found
checking for uintptr_t ... uintptr_t found
checking for system byte ordering ... little endian
checking for size_t size ... 8 bytes
checking for off_t size ... 8 bytes
checking for time_t size ... 8 bytes
checking for setproctitle() ... not found
checking for pread() ... found
checking for pwrite() ... found
checking for pwritev() ... found
checking for sys_nerr ... found
checking for localtime_r() ... found
checking for posix_memalign() ... found
checking for memalign() ... found
checking for mmap(MAP_ANON|MAP_SHARED) ... found
checking for mmap("/dev/zero", MAP_SHARED) ... found
checking for System V shared memory ... found
checking for POSIX semaphores ... not found
checking for POSIX semaphores in libpthread ... found
checking for struct msghdr.msg_control ... found
checking for ioctl(FIONBIO) ... found
checking for struct tm.tm_gmtoff ... found
checking for struct dirent.d_namlen ... not found
checking for struct dirent.d_type ... found
checking for sysconf(_SC_NPROCESSORS_ONLN) ... found
checking for openat(), fstatat() ... found
checking for getaddrinfo() ... found
checking for PCRE library ... found
checking for PCRE JIT support ... found
checking for md5 in system md library ... not found
checking for md5 in system md5 library ... not found
checking for md5 in system OpenSSL crypto library ... not found
checking for sha1 in system md library ... not found
checking for sha1 in system OpenSSL crypto library ... not found
checking for zlib library ... found
creating objs/Makefile

Configuration summary
  + using system PCRE library
  + OpenSSL library is not used
  + using builtin md5 code
  + sha1 library is not found
  + using system zlib library

  nginx path prefix: "/usr/local/nginx"
  nginx binary file: "/usr/local/nginx/sbin/nginx"
  nginx configuration prefix: "/usr/local/nginx/conf"
  nginx configuration file: "/usr/local/nginx/conf/nginx.conf"
  nginx pid file: "/usr/local/nginx/logs/nginx.pid"
  nginx error log file: "/usr/local/nginx/logs/error.log"
  nginx http access log file: "/usr/local/nginx/logs/access.log"
  nginx http client request body temporary files: "client_body_temp"
  nginx http proxy temporary files: "proxy_temp"
  nginx http fastcgi temporary files: "fastcgi_temp"
  nginx http uwsgi temporary files: "uwsgi_temp"
  nginx http scgi temporary files: "scgi_temp"
```

> <font color="red">上面编译过程中有一些报错小插曲, 问题可以参见本文最后的小节[遇到的问题]</font>

执行完成后，没有报错代表安装完成。在当前目录下会生成一些目标文件

![编译后的目录结构](http://cdn.gydblog.com/images/middleware/nginx-install-4.png)

和文章开头部分的目录截图对比可以看出，多了objs、makefile这两种文件，接下来我们进入编译构建环节。



### 3）编译构建环节

当 `configure` 配置完毕后，可以使用 `make` 命令执行编译构建。这个过程会执行在 `Makefile` 文件中定义的一系列任务将软件源代码编译成可执行文件。

```nginx
make
```



我们下载的nginx源码包一般没有一个最终的 `Makefile` 文件，需要 `configure` 根据系统的参数生成一个定制化的 `Makefile` 文件。

在前面的步骤2中配置动作执行完成后，会根据当前系统环境生成Makefile脚本文件以及objs目录。这两个文件的用途会在接下来的文件目录说明中进行解释。

我们继续在根目录下执行make命令开始对源代码进行编译构建, 没有报错代表执行成功

> <font color="red">注意 如果是第一次安装，可以跳过本步骤，执行下一个步骤`make install`命令，如果是升级，就只能执行make而不能执行make install命令。</font> 小郭这里已经安装过，因此只执行make命令即可

![make命令执行](http://cdn.gydblog.com/images/middleware/nginx-install-5.png)

```nginx
///.......
//......篇幅太长，略......
objs/src/http/modules/ngx_http_upstream_ip_hash_module.o \
objs/src/http/modules/ngx_http_upstream_least_conn_module.o \
objs/src/http/modules/ngx_http_upstream_keepalive_module.o \
objs/src/http/modules/ngx_http_upstream_zone_module.o \
objs/ngx_modules.o \
-lpthread -lcrypt -lpcre -lz
make[1]: Leaving directory `/home/guoyd/nginx-1.9.9'
make -f objs/Makefile manpage
make[1]: Entering directory `/home/guoyd/nginx-1.9.9'
sed -e "s|%%PREFIX%%|/usr/local/nginx|" \
	-e "s|%%PID_PATH%%|/usr/local/nginx/logs/nginx.pid|" \
	-e "s|%%CONF_PATH%%|/usr/local/nginx/conf/nginx.conf|" \
	-e "s|%%ERROR_LOG_PATH%%|/usr/local/nginx/logs/error.log|" \
	< man/nginx.8 > objs/nginx.8
make[1]: Leaving directory `/home/guoyd/nginx-1.9.9'
```

make命令执行完成后，**需要把objs目录下生成nginx二进制文件拷贝到原老版本的nginx目录下**。

```nginx
//先备份原先的二进制文件（好习惯，所有人都值得记住）
cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx-default 
// 将新的二进制文件拷贝到最终执行目录下
cp /home/guoyd/nginx-1.9.9/objs/nginx /usr/local/nginx/sbin/
```



### 4）安装

> 如果非第一次安装，则必须跳过本步骤！

现在nginx软件已经被构建好并且可以执行，接下来要做的就是将可执行文件复制到最终的路径。`make install` 命令就是将可执行文件、第三方依赖包和文档复制到正确的路径。

```nginx
make install
```



因为安装这一步也是被定义在 `Makefile` 中，所以程序安装的路径可以通过 `configure` 命令的参数指定，或者 `configure` 通过系统参数决定。默认的nginx安装路径是`/usr/local/nginx` 

如果要将可执行文件安装在系统路径，执行这步需要赋予相应的权限，一般是通过 sudo。



**5）启动**

经过前面的步骤，nginx可执行程序已经成功安装到服务器上了，默认安装目录是`/usr/local/nginx`, 接下来我们就执行对应的程序把nginx启动即可

> 使用默认的配置文件进行启动
>
> 可以把nginx可执行程序配置成系统环境变量，这样就不需要指定全路径了

```nginx
 /usr/local/nginx/sbin/nginx   -c /usr/local/nginx/conf/nginx.conf
```

**6）访问**

访问部署主机 IP，这时候就可以看到 Nginx 的欢迎页面了～ `Welcome to nginx！` 👏

![nginx成功页](http://cdn.gydblog.com/images/middleware/nginx-install-6.png)



至此，nginx 的安装就大功告成啦！



## 四、基础知识-模块架构

下面是Nginx模块架构图：

> nginx 的设计`完全`遵循模块化设计思想，模块化设计使得Nginx方便开发和扩展，功能很强大。

![nginx模块组成](http://cdn.gydblog.com/images/middleware/nginx-3.png)

这5个模块由上到下重要性一次递减。

**（1）核心模块**

该模块是nginx 最基本最核心的服务，如同操作系统的内核。它提供了基本功能像进程管理、权限控制、错误日志记录等；

**（2）标准HTTP模块**

标准HTTP模块支持标准的HTTP的功能，如：端口配置，网页编码设置，HTTP响应头设置等；

**（3）可选HTTP模块**

可选HTTP模块主要用于扩展标准的HTTP功能，让Nginx能处理一些特殊的服务，如：解析GeoIP请求，SSL支持等；

**（4）邮件服务模块**

邮件服务模块主要用于支持Nginx的邮件服务；

**（5）第三方模块**

第三方模块是为了扩展Nginx服务器应用，完成开发者想要的功能，如：Lua支持，JSON支持等；



核心模块是 Nginx 启动的时候一定会加载的，其他的模块，只有在解析配置的时候，遇到了这个模块的命令，才会加载对应的模块。
这个也是体现了 nginx 按需加载的理念。

nginx 拥有的模块能力是在编译的时候就确定了，也就是我们在安装nginx时执行的./configure环节，该环节可以指定启用或者禁用某些模块，具体细节可以看文章开头的安装步骤介绍。

## 五、基础知识-多进程模型

### 1）概览

Nginx是经典的多进程模型，它启动以后会以守护进程的方式在后台运行，后台进程包含一个master进程，和多个worker进程。请求进来后由**maste**r分发任务，**worker**负责执行或反向代理给具体的业务服务单元。

![多进程模型](http://cdn.gydblog.com/images/middleware/nginx-4.png)



master进程只会有一个，worker进程的数量由配置项worker_processes指定，比如小郭的网站nginx配置：

```
worker_processes  1;
```

 ![查看进程数量](http://cdn.gydblog.com/images/middleware/nginx-5.png)

从上图可以看出小郭的网站nginx只创建了一个master进程和一个worker进程。

### 2）异步非阻塞机制

这里使用了一种**异步非阻塞机制**，底层使用的epoll开发模型，简单来说就是每个worker进程 使用 异步非阻塞方式 ，可以处理 多个客户端请求 ；
当某个worker进程 接收到客户端的请求以后，调用 IO 进行处理，如果不能立即得到结果，就去 处理其他请求 （即为 非阻塞 ）；
而 客户端 在此期间也 无需等待响应 ，可以去处理其他事情（即为异步）。当 IO 返回时，就会通知此 worker进程 ，该进程得到通知，暂时 挂起 当前处理的事务去 响应客户端请求 。

### 3）职责分工

**master进程和worker进程各司其职：**

- `master`进程主要用来管理`worker`进程，包括创建Socket并监听端口，启动并管理worker进程，接收来自外界的信号，向各 worker 进程发送信号，监控 worker 进程的运行状态以及启动 worker 进程。记住：master进程不处理任何客户端请求！

- `worker`进程是用来处理来自客户端的请求事件。多个 worker 进程之间是对等的，它们同等竞争来自客户端的请求，各进程互相独立，一个请求只能在一个 worker 进程中处理。worker 进程的个数通过配置项worker_processes来设置，一般会设置与机器 CPU 核数一致。event节点中的worker_connections用于配置每个worker进程最大维护的socket链接数目；

  worker进程基于事件驱动的异步非阻塞模式处理请求，这种模式大大提高了worker进程处理请求的速度。为了尽可能的提高性能，nginx对每个worker进程设置了CPU的亲和性，尽量把worker进程绑定在指定的CPU上执行，以减少上下文切换带来的开销。

### 4）热更新原理

这里值得一提的是nginx的配置文件热更新原理 ，我们修改配置文件然后使用命令‘nginx -s reload’ 使之生效，其实正是依赖这个多进程模型才得以实现。 

在多进程模型机制下，当一个worker抢到请求时，它会去转发(反向代理)给后面的业务服务器(比如tomcat)，让其去处理并返回。在这个过程中，我们能够使用上述的热部署命令加载nginx，是因为其它没抢到的worker会去热加载配置，使最新的配置生效，而正在执行请求的worker正在工作中（因为抢到请求，需要先处理完），等待其处理请求完成之后也会去热加载配置。这么做可以在不影响当前进行中请求的情况下去更新nginx的配置。也就是“无缝热部署”。 

### 5）最大并发连接数计算

最大并发数指的就是当前所有的worker进程加起来最多可以同时处理多少个请求。也就是所有worker的连接数之和（worker个数*worker支持的最大连接数），但其中因为动静请求的问题会有来回，损耗了连接数。所以所有worker的连接数还需根据请求的类别除以2或4.。

假如nginx 有一个 master，有4个 woker，每个 woker 支持最大的连接数 1024，支持的最大并发数是多少？

这个问题需要区分动态资源请求和静态资源请求：

- 动态资源请求

  最大并发数=worker个数（4）*worker支持的最大连接数（1024）/ 所消耗的连接数（4）=1024

- 静态资源请求

  最大并发数=worker个数（4）*worker支持的最大连接数（1024）/ 所消耗的连接数（2）=2048

 

## 六、基础知识-请求执行流程

基于前面的多进程模型，当客户端请求进来后，nginx会去通知名下空闲的worker进程（如果没有空闲中的worker进程且当前worker进程数量没有超出配置个数限制，则会让master进程来创建一个worker进程），告诉它们有新的请求啦。然后这些worker会去争抢，谁抢到这个请求就算谁的。抢到之后，由于nginx不能直接处理动态资源（比如java服务业务逻辑）的要求，需要动态资源的业务服务器来做处理，所以这个时候抢到请求的worker会反向代理给后面的业务服务器执行，最后拿到执行结果返回给客户端。 

 ![请求流程](http://cdn.gydblog.com/images/middleware/nginx-6.png)



上图展示了一个请求的基本执行主流程： 首先用户通过http/https协议访问nginx的主机，nginx通过worker线程来处理客户端的请求，若用户请求网站服务，worker就会到web server这个服务集群提取对应的资源给客户端，同理，这个Application server可以用来访问应用服务器，Memcached缓存服务器，backup是后端的意思。 

## 七、基础知识-服务动静分离

Nginx的静态处理能力很强，但是动态处理能力不足，因此，在企业中常用动静分离技术。动静分离技术其实是采用代理的方式，在server{}段中加入带正则匹配的location来指定匹配项针对PHP的动静分离：静态页面交给Nginx处理，动态页面交给PHP-FPM模块或Apache处理。在Nginx的配置中，是通过location配置段配合正则匹配实现静态与动态页面的不同处理方式。

静态服务器是`Nginx`的强项，使用非常容易，在默认配置下本身就是指向了静态的HTML界面，比如小郭的个人博客网站源代码其实都是一些静态的文章页面资源，直接放在nginx服务器上的指定目录，通过nginx对外提供直接访问的。

![动静分离](http://cdn.gydblog.com/images/middleware/nginx-1.png)

再看看下面是一个动态和静态服务都存在的配置方式：

```
   //动态服务器资源群组
   upstream server_pools {
   		server 192.168.1.189:80 ;
   }
    server {
        listen       80;
        server_name  www_server_pool;
        location / {
            proxy_pass http://server_pools;  //动态资源
        	include proxy.conf;
        }
     
        location /static/ {
            root   html/dist;  //静态资源
           index  index.html index.htm;
        }
   }
```



## 八、基础知识-负载均衡

### 1）简介

负载均衡（Load Balance）的意思就是将客户端请求按某种分配算法分摊到多个操作单元上进行执行，例如Web服务器、FTP服务器、企业关键应用服务器和其它关键任务服务器等，从而共同完成工作任务。负载均衡的目的是提升吞吐率, 提升请求性能, 实现高容灾。

通俗的解释：现有的请求使服务器压力太大无法承受，所以需要搭建一个服务器集群，去分担原先单个服务器所承受的压力，那现在我们有多台服务器，我们想把请求分摊给这些服务器，但是服务器可能资源配置不同，能承受的压力也不同，所以怎么分？如何分配更好？又是一个问题。 

Nginx实现负载均衡功能是依赖 proxy_pass 代理模块和upstream负载均衡模块, 将客户端请求代理转发至一组 upstream 虚拟服务池。

| 负载均衡模块             | 模块说明                                                     |
| :----------------------- | :----------------------------------------------------------- |
| ngx_http_proxy_module    | proxy代理模块，用于把请求后抛给服务器节点或upstream服务器池。 |
| ngx_http_upstream_module | 负载均衡模块，可以实现网站的负载均衡功能及节点的健康检查。   |



### 2）如何配置

打开Nginx配置文件nginx.con，在http模块内server模块外添加upstream配置， 然后在server模块内添加proxy_pass配置

> upstream是关键字必须要有，后面的node为一个upstream集群组的名字，可以自定义, 需要和proxy_pass节点的配置保持一致即可

```
//动态服务器群组
upstream	node	{
	server	192.168.10.11:8081;
	server	192.168.10.12:8081;
	server	192.168.10.13:8081;
	//....无限个
}
server	{
	server_name	localhost;
	listen	80;
		location	/	{
		proxy_pass	http://node;
		proxy_set_header    Host    $http_host;
		proxy_set_header    X-Real-IP   $remote_addr;
		proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}
```

通过上面的配置，就实现了192.168.10.11、192.168.10.12、192.168.10.13这三台服务器的请求分发了, 使用的是默认的负载均衡算法-轮询法。

### 3）upstream参数

**upstream模块还支持很多参数，下面也简单记录下。**

- **负载均衡配置状态**

| 状态         | 概述                                                         |
| ------------ | ------------------------------------------------------------ |
| down         | 当前的server暂不参与负载均衡                                 |
| backup       | 预留的备份服务器，当其他服务器都挂掉的时候，启用             |
| max_fails    | 允许请求失败的次数 ，如果请求失败次数超过限制，则进过fail_timeout 时间后从虚拟服务池中kill掉该服务器 |
| fail_timeout | 经过max_fails失败后，服务暂停时间，max_fails设置后，必须设置fail_timeout 值 |
| max_conns    | 限制最大的连接数，用于服务器硬件配置不同的情况下             |

例如我想让192.168.10.11这台服务器不参与负载均衡，192.168.10.12这台服务器当成预留的备用机器，192.168.10.13这太服务器允许请求失败1次，则可以按如下方式配置：

```
//动态服务器群组
upstream	node	{
	server	192.168.10.11:8081 down; //暂不参与负载均衡
	server	192.168.10.12:8081 backup;//预留的备份服务器，当其他服务器都挂掉的时候，启用
	server	192.168.10.13:8081 max_fails=1fail_timeout=10s;//允许请求失败1次，请求失败1次后服务器暂停服务10秒
	//....无限个
}
```



- **负载均衡配置策略**

> 除了轮询和weight轮询权重外，都是Nginx根据不同的算法实现的。在实际运用中，需要根据不同的场景选择性运用，大都是多种策略结合使用以达到实际需求。

| 策略算法   | 作用                                                         |
| ---------- | ------------------------------------------------------------ |
| 轮询       | 逐一轮询，默认方式 。如果服务器down掉了，会自动剔除该服务器。此策略适合服务器配置相当，无状态且短平快的服务使用。业务无特殊要求时使用。 也适用于图片服务器集群和纯静态页面服务器集群 |
| weight     | 在轮询策略的基础上指定轮询的几率,  加权轮询，weight越大，分配的几率越高。此策略可以与least_conn和ip_hash结合使用。适用业务场景：用于后端服务器硬件性处理能力不平均的情形。 |
| ip_hash    | 按照访问IP的hash结果分配，会导致来自同一IP的请求访问固定的一个后台服务器，适合需要状态保持的服务，例如需要账号登录的系统，会话连接保持的业务。 |
| url_hash   | 按照访问URL的hash结果分配（需编译安装第三方模块 ngx_http_upstream_hash_module）适用于后端服务器为缓存服务器时比较有效。 |
| least_conn | 最少链接数，那个服务器链接数少就会给分配 。适合请求处理时间长短不一造成服务器过载的业务场景。 |
| fair       | 按后端服务器的响应时间来分配请求，响应时间短的优先分配。 适合对访问响应速度有一定要求的业务(需编译安装第三方模块 ngx_http_upstream_fair_module) |

​	

### 4）配置示例

**weight配置示例：**

> 在该例子中，weight参数用于在默认的轮询算法基础上指定轮询几率，weight的默认值为1；weight的数值与访问比率成正比，比如jdk 8.0的机器被访问的几率为其他服务器的两倍。
>
> 此策略比较适合服务器的硬件配置差别比较大的情况。

```
#动态服务器组
upstream dynamic_server {
  server localhost:8080  weight=2; #jdk 8
  server localhost:8081; #jdk 17
  server localhost:8082  backup; #jdk 16
  server localhost:8083  max_fails=3 fail_timeout=20s; #jdk 15
}
```



**ip_hash配置示例：**

> - 注意
> - 在nginx版本1.3.1之前，不能在ip_hash中使用权重（weight）。
> - ip_hash不能与backup同时使用。
> - 此策略适合有状态服务，比如session。当有服务器需要剔除，必须手动down掉。

```
#动态服务器组
upstream dynamic_server {
  ip_hash;  #保证每个访客固定访问一个后端服务器
  server localhost:8080  weight=2; #jdk 8
  server localhost:8081; #jdk 17
  server localhost:8082  backup; #jdk 16
  server localhost:8083  max_fails=3 fail_timeout=20s; #jdk 15
}
```



**url_hash配置示例：**

> 按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，要配合缓存命中来使用

```
#动态服务器组
upstream dynamic_server {
  hash $request_uri;  #实现每个url定向到同一个后端服务器
  server localhost:8080;
  server localhost:8081; 
  server localhost:8082;;  max_fails=3 fail_timeout=20s; #jdk 15
}
```



**least_conn配置示例：**

> 有些请求占用的时间很长，会导致其所在的后端负载较高。这种情况下，least_conn这种方式就可以达到更好的负载均衡效果

```
#动态服务器组
upstream dynamic_server {
  least_conn;  #把请求转发给连接数较少的后端服务器
  server localhost:8080  weight=2; #jdk 8
  server localhost:8081; #jdk 17
  server localhost:8082  backup; #jdk 16
  server localhost:8083  max_fails=3 fail_timeout=20s; #jdk 15
}
```



**fair配置示例：**

> 特点：按后端服务器的响应时间来分配请求，响应时间短的优先分配。 适用业务场景：对访问响应速度有一定要求的业务 

```
#动态服务器组
upstream dynamic_server {
  fair;  #把请求转发给连接数较少的后端服务器
  server localhost:8080;
  server localhost:8081;
  server localhost:8082;
  server localhost:8083  max_fails=3 fail_timeout=20s;
}
```



## 九、基础知识-文件目录

### 1）源代码目录

> 展示的是从官网下载下来的原始代码压缩包，通过命令` tar -xvf nginx.1.9.9.tar.gz` 解压出来的文件目录(未编译前的原始目录)

```nginx
[root@xxx nginx-1.9.9]# pwd
/home/guoyd/nginx-1.9.9
[root@xxx nginx-1.9.9]# ll
total 672
drwxr-xr-x 6 1001 1001   4096 Sep 19 14:34 auto
-rw-r--r-- 1 1001 1001 256752 Dec  9  2015 CHANGES
-rw-r--r-- 1 1001 1001 390572 Dec  9  2015 CHANGES.ru
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 conf
-rwxr-xr-x 1 1001 1001   2481 Dec  9  2015 configure
drwxr-xr-x 4 1001 1001   4096 Sep 19 14:34 contrib
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 html
-rw-r--r-- 1 1001 1001   1397 Dec  9  2015 LICENSE
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 man
-rw-r--r-- 1 1001 1001     49 Dec  9  2015 README
drwxr-xr-x 9 1001 1001   4096 Sep 19 14:34 src
```

- auto目录：用于编译时的文件，以及相关lib库，编译时对对操作系统的判断等，都是为了辅助./configure命令执行的辅助文件。

- CHANGES文件：就是当前版本的说明信息，比如新增的功能，修复的bug，变更的功能等

- CHANGES.ru文件：作者是俄罗斯人，生成了一份俄罗斯语言的CHANGE文件

- conf目录：是nginx编译安装后的默认配置文件或者示列文件，安装时会拷贝到安装的文件夹里面。

- configure文件：编译安装前的预备执行文件。

- contrib目录：该目录是为了方便vim编码nginx的配置文件时候，颜色突出显示，可以将该目录拷贝到自己的~/.vim目录下面

  `cp -rf contrib/vim/* ~/.vim/` 这样vim打开nginx配置文件就有突出的颜色显示。

- html目录：编译安装的默认的2个标准web页面，安装后会自动拷贝到nginx的安装目录下的html下。

- LICENSE: 版权说明文档

- man目录：nginx命令的帮助文档，linux上可以使用man命令查看帮助，

- README：其它说明文档

- src：nginx的源码文件

### 2）配置后程序目录

> 展示的是在源代码根目录下执行`./configure`命令执行配置后的目录结构

```nginx
[root@xxx nginx-1.9.9]# pwd
/home/guoyd/nginx-1.9.9
[root@xxx nginx-1.9.9]# ll
total 680
drwxr-xr-x 6 1001 1001   4096 Sep 19 14:34 auto
-rw-r--r-- 1 1001 1001 256752 Dec  9  2015 CHANGES
-rw-r--r-- 1 1001 1001 390572 Dec  9  2015 CHANGES.ru
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 conf
-rwxr-xr-x 1 1001 1001   2481 Dec  9  2015 configure
drwxr-xr-x 4 1001 1001   4096 Sep 19 14:34 contrib
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 html
-rw-r--r-- 1 1001 1001   1397 Dec  9  2015 LICENSE
-rw-r--r-- 1 root root    366 Sep 19 14:39 Makefile    # 编译后产生的文件
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 man
drwxr-xr-x 3 root root   4096 Sep 19 14:39 objs  # 编译后产生的文件
-rw-r--r-- 1 1001 1001     49 Dec  9  2015 README
drwxr-xr-x 9 1001 1001   4096 Sep 19 14:34 src
[root@xxx objs]# ls
autoconf.err  Makefile  ngx_auto_config.h  ngx_auto_headers.h  ngx_modules.c  src
[root@xxx objs]# 
```

和原始源代码目录对比可以看出，只是新增了Makefile、objs这两类文件信息：

- Makefile：编译后产生的文件，用于编写执行Make命令时触发的脚本逻辑，我们可以对其进行修改
- objs目录：编译后产生的目录，存放.configure和make命令执行的中间文件和生成文件

### 3）编译后程序目录

```nginx
[root@xxx nginx-1.9.9]# pwd
/home/guoyd/nginx-1.9.9
[root@xxx nginx-1.9.9]# ll
total 680
drwxr-xr-x 6 1001 1001   4096 Sep 19 14:34 auto
-rw-r--r-- 1 1001 1001 256752 Dec  9  2015 CHANGES
-rw-r--r-- 1 1001 1001 390572 Dec  9  2015 CHANGES.ru
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 conf
-rwxr-xr-x 1 1001 1001   2481 Dec  9  2015 configure
drwxr-xr-x 4 1001 1001   4096 Sep 19 14:34 contrib
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 html
-rw-r--r-- 1 1001 1001   1397 Dec  9  2015 LICENSE
-rw-r--r-- 1 root root    366 Sep 19 14:39 Makefile
drwxr-xr-x 2 1001 1001   4096 Sep 19 14:34 man
drwxr-xr-x 3 root root   4096 Sep 19 14:51 objs
-rw-r--r-- 1 1001 1001     49 Dec  9  2015 README
drwxr-xr-x 9 1001 1001   4096 Sep 19 14:34 src
[root@xxx nginx-1.9.9]# cd objs/
[root@xxx objs]# ls
autoconf.err  Makefile  nginx  nginx.8  ngx_auto_config.h  ngx_auto_headers.h  ngx_modules.c  ngx_modules.o  src
[root@xxx objs]# 
```

和上一步的目录对比，可以看出仅objs目录下新生成了nginx、nginx.8、ngx_modules.o这三个文件

- nginx

   是我们操作nginx程序的可执行程序  比如执行 `nginx -t`、`nginx -s reload`等命令

  假如服务器上已经安装过nginx，安装目录是/usr/local/nginx/，本次只是对nginx做版本更新，则只需要把这个执行程序拷贝到/usr/local/nginx/sbin目录下即可完成升级操作（覆盖原先的nginx可执行文件）

- nginx.8

  这个文件小郭没搞懂是干嘛的，反正暂时用不到。。  有知道的大佬可以评论区告知一下。

- ngx_modules.o

  没搞懂用途，同`nginx.8` /(ㄒoㄒ)/~~

**4）编译后安装目录**

如果是第一次安装，则需要执行`make install`命令直接将程序安装到本机指定路径（默认安装到/usr/local/nginx，可以通过配置文件修改）

下面是安装后的目录

> 后续所有针对nginx的日常运维操作都是基于这个目录了哦,  除非是升级和扩展功能模块，否则和源代码目录就没啥关系了

```nginx
[root@XXX nginx]# pwd
/usr/local/nginx
[root@XXX nginx]# ll
total 36
drwx------  2 root root 4096 Jan 19  2019 client_body_temp
drwxr-xr-x  2 root root 4096 Sep 19 09:59 conf
drwx------  2 root root 4096 Jan 19  2019 fastcgi_temp
drwxr-xr-x  3 root root 4096 Sep 18 20:38 html
drwxr-xr-x  2 root root 4096 Jun 12 22:23 logs
drwx------ 12 root root 4096 Jan 31  2019 proxy_temp
drwxr-xr-x  2 root root 4096 Sep 18 10:10 sbin
drwx------  2 root root 4096 Jan 19  2019 scgi_temp
drwx------  2 root root 4096 Jan 19  2019 uwsgi_temp
```



## 十、基础知识-配置文件

 `/etc/nginx/nginx.conf`是Nginx 的主配置文件，可以使用 `cat -n nginx.conf` 来查看配置，也可以使用./nginx -T 查看当前生效中的配置。

`nginx.conf` 结构图可以这样概括：

```
main        # 全局配置，对全局生效
├── events  # 配置影响 Nginx 服务器或与用户的网络连接
├── http    # 配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置
│   ├── upstream # 配置后端服务器具体地址，负载均衡配置不可或缺的部分
│   ├── server   # 配置虚拟主机的相关参数，一个 http 块中可以有多个 server 块
│   ├── server
│   │   ├── location  # server 块可以包含多个 location 块，location 指令用于匹配 uri
│   │   ├── location
│   │   └── ...
│   └── ...
└── ...
```

一个 Nginx 配置文件的结构就像 `nginx.conf` 显示的那样，配置文件的语法规则：

1. 配置文件由指令与指令块构成；
2. 每条指令以 `;` 分号结尾，指令与参数间以空格符号分隔；
3. 指令块以 `{}` 大括号将多条指令组织在一起；
4. `include` 语句允许组合多个配置文件以提升可维护性；
5. 使用 `#` 符号添加注释，提高可读性；
6. 使用 `$` 符号使用变量；
7. 部分指令的参数支持正则表达式；

小郭的博客网站nginx的配置文件是下面这样的（业务比较简单，没有涉及过多自定义配置项）：

```nginx
user root; #运行用户
worker_processes  1;#Nginx 进程数，一般设置为和 CPU 核数一样
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        location / {
           #博客页面静态文件路径
           root   html/dist;
           index  index.html index.htm;
		}
   }
}
```



下面记录下全量的配置说明，方便日后查阅：

> 信息来源于网络，仅供参考，最终要以nginx官网更新为准哦

```properties
# 运行用户
user www-data;    

# 启动进程,通常设置成和cpu的数量相等
worker_processes  6;

# 全局错误日志定义类型，[debug | info | notice | warn | error | crit]
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

# 进程pid文件
pid        /var/run/nginx.pid;

# 工作模式及连接数上限
events {
    # 仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll; 
    
    # 单个后台worker process进程的最大并发链接数
    worker_connections  1024;     
    
    # 客户端请求头部的缓冲区大小
    client_header_buffer_size 4k;
    
    # keepalive 超时时间
    keepalive_timeout 60;      
    
    # 告诉nginx收到一个新连接通知后接受尽可能多的连接
    # multi_accept on;            
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
    # 文件扩展名与文件类型映射表义
    include       /etc/nginx/mime.types;
    
    # 默认文件类型
    default_type  application/octet-stream;
    
    # 默认编码
    charset utf-8;
    
    # 服务器名字的hash表大小
    server_names_hash_bucket_size 128;
    
    # 客户端请求头部的缓冲区大小
    client_header_buffer_size 32k;
    
    # 客户请求头缓冲大小
	large_client_header_buffers 4 64k;
	
	# 设定通过nginx上传文件的大小
    client_max_body_size 8m;
    
    # 开启目录列表访问，合适下载服务器，默认关闭。
    autoindex on;

    # sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    # 必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度
    sendfile        on;
    
    # 此选项允许或禁止使用socke的TCP_CORK的选项，此选项仅在使用sendfile的时候使用
    #tcp_nopush     on;

    # 连接超时时间（单秒为秒）
    keepalive_timeout  65;
    
    
    # gzip模块设置
    gzip on;               #开启gzip压缩输出
    gzip_min_length 1k;    #最小压缩文件大小
    gzip_buffers 4 16k;    #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2;     #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml;
    gzip_vary on;

    # 开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;
   
	# 指定虚拟主机的配置文件，方便管理
    include /etc/nginx/conf.d/*.conf;


    # 负载均衡配置
    upstream mysvr {
        # 请见上文中的五种配置
    }

   # 虚拟主机的配置
    server {
        
        # 监听端口
        listen 80;

        # 域名可以有多个，用空格隔开
        server_name www.jd.com jd.com;
        
        # 默认入口文件名称
        index index.html index.htm index.php;
        root /data/www/jd;

        # 图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)${
            expires 10d;
        }
         
        #JS和CSS缓存时间设置
        location ~ .*.(js|css)?${
            expires 1h;
        }
         
        # 日志格式设定
        #$remote_addr与$http_x_forwarded_for用以记录客户端的ip地址；
        #$remote_user：用来记录客户端用户名称；
        #$time_local： 用来记录访问时间与时区；
        #$request： 用来记录请求的url与http协议；
        #$status： 用来记录请求状态；成功是200，
        #$body_bytes_sent ：记录发送给客户端文件主体内容大小；
        #$http_referer：用来记录从那个页面链接访问过来的；
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';
         
        # 定义本虚拟主机的访问日志
        access_log  /usr/local/nginx/logs/host.access.log  main;
        access_log  /usr/local/nginx/logs/host.access.404.log  log404;
         
        # 对具体路由进行反向代理
        location /connect-controller {
 
            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
             
            # 后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;

            # 允许客户端请求的最大单文件字节数
            client_max_body_size 10m;

            # 缓冲区代理缓冲用户端请求的最大字节数，
            client_body_buffer_size 128k;

            # 表示使nginx阻止HTTP应答代码为400或者更高的应答。
            proxy_intercept_errors on;

            # nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_connect_timeout 90;

            # 后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
            proxy_send_timeout 90;

            # 连接成功后，后端服务器响应的超时时间
            proxy_read_timeout 90;

            # 设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffer_size 4k;

            # 设置用于读取应答的缓冲区数目和大小，默认情况也为分页大小，根据操作系统的不同可能是4k或者8k
            proxy_buffers 4 32k;

            # 高负荷下缓冲大小（proxy_buffers*2）
            proxy_busy_buffers_size 64k;

            # 设置在写入proxy_temp_path时数据的大小，预防一个工作进程在传递文件时阻塞太长
            # 设定缓存文件夹大小，大于这个值，将从upstream服务器传
            proxy_temp_file_write_size 64k;
        }
        
        # 动静分离反向代理配置（多路由指向不同的服务端或界面）
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }
    }
}
```





## 十一、基础知识-常用命令

```nginx
nginx -s reload  # 向主进程发送信号，重新加载配置文件，热重启
nginx -s reopen	 # 重启 Nginx
nginx -s stop    # 快速关闭Nginx 可能并不保存相关信息
nginx -s quit    # 等待工作进程处理完成后关闭，会保存相关信息 比stop更优雅
nginx -T         # 查看当前 Nginx 最终的配置
nginx -t -c <配置路径>    # 检查配置是否有问题，如果已经在配置目录，则不需要-c
nginx -v  #查看nginx版本
```

假如我们修改了nginx.conf文件，但是又不能重启Nginx，就可以按如下步骤使配置文件动态更新:

```nginx
[root@iZbp128dczen7roibd3xciZ sbin]# ./nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
[root@iZbp128dczen7roibd3xciZ sbin]# ./nginx -s reload
[root@iZbp128dczen7roibd3xciZ sbin]# 
```



## 十二、基础知识-gzip压缩

```nginx

gzip on; # 默认off，是否开启gzip
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

# 上面两个开启基本就能跑起了，下面的愿意折腾就了解一下
gzip_static on;
gzip_proxied any;
gzip_vary on;
gzip_comp_level 6;
gzip_buffers 16 8k;
# gzip_min_length 1k;
```

> 若报错，检查nginx在configure环节是否关闭了ngx_http_gzip_module的功能模块。

## 十三、遇到的问题
1）源码编译./configure：error: the HTTP rewrite module requires the PCRE library.
对nginx源码使用"./configure"进行编译时报错:

```
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```

大致意思是我的linux环境缺少了PCRE库. 那就安装一下吧：
```
//我的是centos系统
yum install pcre pcre-devel
```

![pcre安装](http://cdn.gydblog.com/images/middleware/nginx-pcre.png)


> Nginx的rewrite模块和HTTP核心模块会用到PCRE正则表达式语法）

2）源码编译./configure：error: the HTTP gzip module requires the zlib library.
对nginx源码使用"./configure"进行编译时报错:

```
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
```

大致意思是我的linux版本缺少了zlib库. 那就再安装一下吧：
```
//我的是centos系统
yum install zlib-devel
```

![zlib安装](http://cdn.gydblog.com/images/middleware/nginx-zlib.png)

> Nginx的gzip模块会用到zlib支持

3）gzip开启报错：
```
unknown directive "gzip"
```

大致意思是不支持gzip指令，原因是我在编译nginx源码的时候，使用了参数--without-http_gzip_module, 未安装gzip的功能模块。

解决办法如下：

- 首次安装[Nginx](https://so.csdn.net/so/search?q=Nginx&spm=1001.2101.3001.7020)时，切换到Nginx源码目录，执行命令./configure  

  默认会把gzip功能模块开启

- 非首次安装Nginx

  本人Nginx首次安装时，使用./configure --without-http_gzip_module跳过了gzip的配置和安装，所以现在需要动态增加gzip压缩模块。

  首先切换到Nginx源码目录，运行./configure命令。

  ```
  cd /home/guoyd/nginx-1.9.9
  ./configure
  ```

  配置完成后，执行make命令，但切记，不要执行make install命令。

  make命令编译完成后，将nginx执行文件复制到/usr/local/nginx/sbin/下（/usr/local/nginx/是Nginx的默认安装目录），复制之前，最好将nginx备份。

  ```
  //先备份原先的二进制文件（好习惯，所有人都值得记住）
  cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx-default 
  // 将新的二进制文件拷贝到最终执行目录下
  cp /home/guoyd/nginx-1.9.9/objs/nginx /usr/local/nginx/sbin/
  ```

  通过上面的步骤，就可以成功将ngx_http_gzip_module模块增加到已安装的Nginx中。

  