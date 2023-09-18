---
title: Nginx知识点详解
shortTitle: Nginx知识点详解
date: 2023-09-14
article: false

category:
  - 微服务中间件
description: 记录中间件Nginx的常用知识点
head:
  - - meta
    - name: keywords
      content: Nginx,反向代理,负载均衡
---



## 简介

> 介绍来自百度百科

*Nginx* (engine x) 是一个高性能的http和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（[俄文](https://baike.baidu.com/item/俄文/5491693?fromModule=lemma_inlink)：Рамблер）开发的，公开版本1.19.6发布于2020年12月15日。

Nginx将源代码以类BSD许可证的形式发布，因它的稳定性、丰富的功能集、简单的配置文件和低系统资源的消耗而闻名。2022年01月25日，nginx 1.21.6发布。

其特点是占有内存少，并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好。

**优点**

- 安装部署非常简单

  nginx 是一个安装非常的简单、配置文件非常简洁（还能够支持perl语法）、Bug非常少的服务。Nginx 启动也特别容易，并且几乎可以做到7*24不间断运行，即使运行数个月也不需要重新启动,还能够在不间断服务的情况下进行软件版本的动态升级。

- 支持主流操作系统

   nginx可以在大多数Unix Linux OS 上编译运行，并有Windows移植版

- 支持高并发量访问

  nginx能同时支持高达50000个并发连接数的响应，是Apache服务不错的替代品。

- 系统资源开销少

  nginx采用C进行编写，不论是系统资源开销还是CPU使用效率都是比较好的。

- 模块化的结构设计

  nginx提供了很多开箱即用的功能模块，如果不需要可以通过参数关闭。

  

## 如何安装

> 小郭采用下载nginx源码编译的方式进行安装

Nginx 使用 Unix 下常用的 './configure && make && make install' 过程来编译安装。

**1）从官网下载源码包**

[源码下载链接](https://nginx.org/en/download.html)

![源码包获取](http://cdn.gydblog.com/images/middleware/nginx-install-1.png)



> 小郭这里选取了nginx-1.9.9的linux版本下载，如果你对版本功能有特殊要求，按需选择哦！

**2）configure环节**

步骤1下载好源码包并解压：

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

和文章开头部分的目录截图对比可以看出，多了objs、makefile这两种文件，接下来我们执行。



**3）make环节**

./configure执行完成后，会生成很多中间文件，主要放在objs目录下面。

我们继续在根目录下执行make命令, 没有报错代表执行成功

> <font color="red">注意 如果是第一次安装，下一步可以执行`make install`命令，如果是升级，就不能执行install命令。</font> 小郭这里已经安装过，因此只执行make命令即可

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



**4）启动**

> 使用默认的配置文件进行启动

```nginx
 /usr/local/nginx/sbin/nginx   -c /usr/local/nginx/conf/nginx.conf
```

**5）访问**

访问部署主机 IP，这时候就可以看到 Nginx 的欢迎页面了～ `Welcome to nginx！` 👏

![nginx成功页](http://cdn.gydblog.com/images/middleware/nginx-install-6.png)



## 基础知识-文件目录

```nginx
[root@iZbp128dczen7roibd3xciZ nginx-1.9.9]# ll
total 680
drwxr-xr-x 6 1001 1001   4096 Sep 18 10:28 auto
-rw-r--r-- 1 1001 1001 256752 Dec  9  2015 CHANGES
-rw-r--r-- 1 1001 1001 390572 Dec  9  2015 CHANGES.ru
drwxr-xr-x 2 1001 1001   4096 Sep 18 10:28 conf
-rwxr-xr-x 1 1001 1001   2481 Dec  9  2015 configure
drwxr-xr-x 4 1001 1001   4096 Sep 18 10:28 contrib
drwxr-xr-x 2 1001 1001   4096 Sep 18 10:28 html
-rw-r--r-- 1 1001 1001   1397 Dec  9  2015 LICENSE
-rw-r--r-- 1 root root    366 Sep 18 10:35 Makefile
drwxr-xr-x 2 1001 1001   4096 Sep 18 10:28 man
drwxr-xr-x 3 root root   4096 Sep 18 14:39 objs
-rw-r--r-- 1 1001 1001     49 Dec  9  2015 README
drwxr-xr-x 9 1001 1001   4096 Sep 18 10:28 src
```

- auto目录：用于编译时的文件，以及相关lib库，编译时对对操作系统的判断等，都是为了辅助./configure命令执行的辅助文件。

- CHANGES文件：就是当前版本的说明信息，比如新增的功能，修复的bug，变更的功能等

- CHANGES.ru文件：作者是俄罗斯人，生成了一份俄罗斯语言的CHANGE文件

- conf目录：是nginx编译安装后的默认配置文件或者示列文件，安装时会拷贝到安装的文件夹里面。

- configure文件：编译安装前的预备执行文件。

- contrib目录：该目录是为了方便vim编码nginx的配置文件时候，颜色突出显示，可以将该目录拷贝到自己的~/.vim目录下面

  `cp -rf contrib/vim/* ~/.vim/` 这样vim打开nginx配置文件就有突出的颜色显示。

- html目录：编译安装的默认的2个标准web页面，安装后会自动拷贝到nginx的安装目录下的html下。

- man目录：nginx命令的帮助文档，linux上可以使用man命令查看帮助，

- objs目录：存放.configure和make命令执行的中间文件和生成文件

- src：nginx的源码文件



### 主配置文件

 `/etc/nginx/nginx.conf`是Nginx 的主配置文件，可以使用 `cat -n nginx.conf` 来查看配置。

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

小郭的博客nginx的配置文件是下面这样的：

```nginx
user root; #运行用户
worker_processes  1;#Nginx 进程数，一般设置为和 CPU 核数一样

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

         location / {
           #博客页面文件路径
           root   html/dist;
           index  index.html index.htm;
	}
    }
}
```





## 基础知识-常用命令

```nginx
nginx -s reload  # 向主进程发送信号，重新加载配置文件，热重启
nginx -s reopen	 # 重启 Nginx
nginx -s stop    # 快速关闭
nginx -s quit    # 等待工作进程处理完成后关闭
nginx -T         # 查看当前 Nginx 最终的配置
nginx -t -c <配置路径>    # 检查配置是否有问题，如果已经在配置目录，则不需要-c
```

假如我们修改了nginx.conf文件，但是又不能重启Nginx，就可以按如下步骤使配置文件动态更新:

```nginx
[root@iZbp128dczen7roibd3xciZ sbin]# ./nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
[root@iZbp128dczen7roibd3xciZ sbin]# ./nginx -s reload
[root@iZbp128dczen7roibd3xciZ sbin]# 
```



## 基础知识-开启gzip压缩

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


##   


# 遇到的问题
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

大致意思是我的linux版本缺少了zlib库. 那就安装一下吧：
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

解决办法如下：https://blog.csdn.net/securitit/article/details/109104477

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


# 参考资料

https://juejin.cn/post/6844904144235413512

 [Nginx 编译参数 | Nginx 入门教程 (xuexb.github.io)](https://xuexb.github.io/learn-nginx/guide/nginx-configure-descriptions.html#参数详情)