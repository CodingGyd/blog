---
# icon: lock
date: 2023-06-18
category:
  - linux
---
# Linux操作

## 常用shell脚本
### jar包启动/停止/重启  
脚本名称：server.sh  

用途：用于执行springboot打包生成的可执行文件helloworld.jar ，jar包存放在/home/test/目录下。

脚本内容：
```java
cd /home/test/
if [ -z $appName ];then
    appName=`ls -t |grep .jar$ |head -n1`
fi

if [ -n "$appName" ];then
	if [ -z $APP_NAME ];then
       APP_NAME=${appName%.*}
	fi
	if [ -z $JVM ];then
	JVM="-XX:+UseG1GC -XX:+HeapDumpOnOutOfMemoryError -Xms512M -Xmx2G"
	fi

fi

function getAppId()
{
	appId=`ps -ef |grep java|grep $appName|awk '{print $2}'`
}

function start()
{
	getAppId
	if [ -z $appId ];then
		echo "The $appName is starting..."
		nohup java $JVM -jar ./$appName --server.port=8090 --server.servlet.context-path=/appName  > /dev/null 2>&1 &
	else
		echo "$appName is still running, please check it..."
		exit 1
	fi  
}

function stop()
{
	getAppId
	if [ -z $appId ];then
	  echo "The $appName not running"
	else
        echo "The $appName is stopping..."
        kill $appId
		for i in {1..15}
		do
			echo *****wait 1s to check server[$appId]  status*****
			sleep 1
			getAppId
			if [ -z $appId ];then
				echo "The $appName is stopped..."
				return
			fi
		done
		echo *****force kill server[$appId]*****
  		kill -9 $appId
	fi
}

function restart()
{
    stop
    start
}

function status()
{
    getAppId
	if [ -z $appId ]; then
	    echo -e "$appName not running" 
	else
		echo -e "$appName is running [$appId], waiting to check status" 
		SYS_URL="http://localhost:$SERVER_PORT/appname/sys/status/check"
		echo "check $SYS_URL ......" 
        RST=`curl $SYS_URL -s`
		if [ "$RST" == "On" ]; then
			echo "running"
		else
			echo "failure"
		fi
	fi
}


function usage()
{
    echo "Usage: $0 {start|stop|restart|status|stop -f}"
    echo "Example: $0 start"
    exit 1
}

case $1 in
	start)
	start;;

	stop)
	stop;;
	
	restart)
	restart;;
	
	status)
	status;;
	
	*)
	usage;;
esac
```

执行示例：
```java
./server.sh start //启动
./server.sh restart //重启
./server.sh stop //停止

```

## ssh连接远程服务器
语法格式：ssh 用户名@IP地址 -p 端口号

示例：
 <img src="http://cdn.gydblog.com/images/linux/linux-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 全文检索指定字符串-grep
Linux grep (global regular expression) 命令用于查找文件里符合条件的字符串或正则表达式。  

语法格式：grep [options] pattern [files]  

示例：检索文件dump.txt中匹配“java.lang.Thread.State”的部分

 <img src="http://cdn.gydblog.com/images/linux/linux-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 文本分析命令-awk
AWK 是一种处理文本文件的语言，是一个强大的文本分析工具。  

之所以叫 AWK 是因为其取了三位创始人 Alfred Aho，Peter Weinberger, 和 Brian Kernighan 的 Family Name 的首字符。

awk命令很复杂，详细教程可参考https://www.runoob.com/linux/linux-comm-awk.html  

示例 使用awk和grep组合分析字符串出现的次数 ：  
grep java.lang.Thread.State dump.txt | awk '{print $2$3$4$5}' | sort | uniq -c
 <img src="http://cdn.gydblog.com/images/linux/linux-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


## 线上查询及帮助命令（2个）

```
man：查看命令帮助，更复杂的还有info，但不常用。

help：查看Linux内置命令的帮助，比如cd命令。
```



## 文件和目录操作命令（18个）

```
查找大文件： du -h --max-depth=1 
ls：全拼list，功能是列出目录的内容及其内容属性信息。 （ll 是 ls -l 的别名，ll 命令可以看到该目录下的所有目录和文件的详细信息）：查看目录信息。

cd：全拼change directory，功能是从当前工作目录切换到指定的工作目录。

cp：全拼copy，其功能为复制文件或目录。

find：查找的意思，用于查找目录及目录下的文件。寻找目录（查）。示例：① 列出当前目录及子目录下所有文件和文件夹: find .；② 在/home目录下查找以.txt 结尾的文件名:find /home -name "*.txt" ,忽略大小写: find /home -iname "*.txt" ；③ 当前目录及子目录下查找所有以.txt 和.pdf 结尾的文件:find . \( -name "*.txt" -o -name "*.pdf" \)或find . -name "*.txt" -o -name "*.pdf"。

mkdir：全拼make directories，其功能是创建目录。

mv：全拼move，其功能是移动或重命名文件。

pwd：全拼print working directory，其功能是显示当前工作目录的绝对路径。

rename：用于重命名文件。

rm：全拼remove，其功能是删除一个或多个文件或目录。

rmdir：全拼remove empty directories，功能是删除空目录。

touch：创建新的空文件，改变已有文件的时间戳属性。 文件名称: 文件的创建（增）。

tree：功能是以树形结构显示目录下的内容。

basename：显示文件名或目录名。

dirname：显示文件或目录路径。

chattr：改变文件的扩展属性。

lsattr：查看文件扩展属性。

file：显示文件的类型。

md5sum：计算和校验文件的MD5值。

```



## 查看文件及内容处理命令（21个）

```
cat：全拼concatenate，功能是用于连接多个文件并且打印到屏幕输出或重定向到指定文件中。

tac：是cat的反向拼写，因此命令的功能为反向显示文件内容。

more：分页显示文件内容。

less：分页显示文件内容，more命令的相反用法。

head：显示文件内容的头部。

tail：显示文件内容的尾部。 命令 tail -f 文件 可以对某个文件进行动态监控，例如 tomcat 的日志文件， 会随着程序的运行，日志会变化，可以使用 tail -f catalina-2016-11-11.log 监控 文 件的变化 。

cut：将文件的每一行按指定分隔符分割并输出。

split：分割文件为不同的小片段。

paste：按行合并文件内容。

sort：对文件的文本内容排序。

uniq：去除重复行。

wc：统计文件的行数、单词数或字节数。

iconv：转换文件的编码格式。

dos2unix：将DOS格式文件转换成UNIX格式。

diff：全拼difference，比较文件的差异，常用于文本文件。

vimdiff：命令行可视化文件比较工具，常用于文本文件。

rev：反向输出文件内容。

grep/egrep：过滤字符串，三剑客老三。

join：按两个文件的相同字段合并。

tr：替换或删除字符。

vi/vim：命令行文本编辑器。

```



## 文件压缩及解压缩命令(4个)

```
tar：打包压缩。

unzip：解压文件。

gzip：压缩工具。

zip：压缩工具。

1）打包并压缩文件：

Linux 中的打包文件一般是以.tar 结尾的，压缩的命令一般是以.gz 结尾的。而一般情况下打包和压缩是一起进行的，打包并压缩后的文件的后缀名一般.tar.gz。 命令：tar -zcvf 打包压缩后的文件名 要打包压缩的文件 ，其中：

z：调用 gzip 压缩命令进行压缩
c：打包文件
v：显示运行过程
f：指定文件名
比如：假如 test 目录下有三个文件分别是：aaa.txt bbb.txt ccc.txt，如果我们要打包 test 目录并指定压缩后的压缩包名称为 test.tar.gz 可以使用命令：**tar -zcvf test.tar.gz aaa.txt bbb.txt ccc.txt 或 tar -zcvf test.tar.gz /test/**

2）解压压缩包：

命令：tar [-xvf] 压缩文件

其中：x：代表解压

示例：

将 /test 下的 test.tar.gz 解压到当前目录下可以使用命令：**tar -xvf test.tar.gz**
将 /test 下的 test.tar.gz 解压到根目录/usr 下:**tar -xvf test.tar.gz -C /usr**（- C 代表指定解压的位置）

```



## 信息显示命令(11个)

```
uname：显示操作系统相关信息的命令。

hostname：显示或者设置当前系统的主机名。

dmesg：显示开机信息，用于诊断系统故障。

uptime：显示系统运行时间及负载。

stat：显示文件或文件系统的状态。

du：计算磁盘空间使用情况。示例:"du -h /logs/ | sort -rh | head" 查看目录logs最大的文件

df：报告文件系统磁盘空间的使用情况。

top：实时显示系统资源使用情况。

free：查看系统内存。

date：显示与设置系统时间。  date -s "2021-08-28 21:21:21" 或  date -s 2021-08-28  或 date -s 20:20:20

cal：查看日历等时间信息。

```



## 搜索文件命令(4个)

```
which：查找二进制命令，按环境变量PATH路径查找。

find：从磁盘遍历查找文件或目录。

whereis：查找二进制命令，按环境变量PATH路径查找。

locate：从数据库 (/var/lib/mlocate/mlocate.db) 查找命令，使用updatedb更新库。

```



## 用户管理命令(10个)

```
useradd：添加用户。

usermod：修改系统已经存在的用户属性。

userdel：删除用户。

groupadd：添加用户组。

passwd：修改用户密码。

chage：修改用户密码有效期限。

id：查看用户的uid,gid及归属的用户组。

su：切换用户身份。

visudo：编辑/etc/sudoers文件的专属命令。

sudo：以另外一个用户身份(默认root用户)执行事先在sudoers文件允许的命令。

```



## 基础网络操作命令(11个)

```
telnet：使用TELNET协议远程登录。

ssh：使用SSH加密协议远程登录。

scp：全拼secure copy，用于不同主机之间复制文件。

wget：命令行下载文件。

ping：测试主机之间网络的连通性。

route：显示和设置linux系统的路由表。

ifconfig：查看、配置、启用或禁用网络接口的命令。  查看当前系统的网卡信息

ifup：启动网卡。

ifdown：关闭网卡。

netstat：查看网络状态。  查看当前系统的端口使用：netstat -an

ss：查看网络状态。

```



## 深入网络操作命令(9个)

```
nmap：网络扫描命令。

lsof：全名list open files，也就是列举系统中已经被打开的文件。

mail：发送和接收邮件。

mutt：邮件管理命令。

nslookup：交互式查询互联网DNS服务器的命令。

dig：查找DNS解析过程。

host：查询DNS的命令。

traceroute：追踪数据传输路由状况。

tcpdump：命令行的抓包工具。

```



## 磁盘与文件系统的命令(16个)

```
df:  查看磁盘空间，   df -h
mount：挂载文件系统。

umount：卸载文件系统。

fsck：检查并修复Linux文件系统。

dd：转换或复制文件。

dumpe2fs：导出ext2/ext3/ext4文件系统信息。

dumpe：xt2/3/4文件系统备份工具。

fdisk：磁盘分区命令，适用于2TB以下磁盘分区。

parted：磁盘分区命令，没有磁盘大小限制，常用于2TB以下磁盘分区。

mkfs：格式化创建Linux文件系统。

partprobe：更新内核的硬盘分区表信息。

e2fsck：检查ext2/ext3/ext4类型文件系统。

mkswap：创建Linux交换分区。

swapon：启用交换分区。

swapoff：关闭交换分区。

sync：将内存缓冲区内的数据写入磁盘。

resize2fs：调整ext2/ext3/ext4文件系统大小。
系统权限及用户授权相关命令(4个)

chmod：改变文件或目录权限。

chown：改变文件或目录的属主和属组。

chgrp：更改文件用户组。

umask：显示或设置权限掩码。


```



## 系统用户登录信息的命令(7个)

```
whoami：显示当前有效的用户名称，相当于执行id -un命令。

who：显示目前登录系统的用户信息。

w：显示已经登录系统的用户列表，并显示用户正在执行的指令。

last：显示登入系统的用户。

lastlog：显示系统中所有用户最近一次登录信息。

users：显示当前登录系统的所有用户的用户列表。

finger：查找并显示用户信息。

```



## 内置命令及其它(19个)

```
echo：打印变量，或直接输出指定的字符串

printf：将结果格式化输出到标准输出。

rpm：管理rpm包的命令。

yum：自动化简单化地管理rpm包的命令。

watch：周期性的执行给定的命令，并将命令的输出以全屏方式显示。

alias：设置系统别名。

unalias：取消系统别名。

date：查看或设置系统时间。

clear：清除屏幕，简称清屏。

history：查看命令执行的历史纪录。

eject：弹出光驱。

time：计算命令执行时间。

nc：功能强大的网络工具。

xargs：将标准输入转换成命令行参数。

exec：调用并执行指令的命令。

export：设置或者显示环境变量。

unset：删除变量或函数。

type：用于判断另外一个命令是否是内置命令。

bc：命令行科学计算器。

```



## 系统管理与性能监视命令(9个)

```
chkconfig：管理Linux系统开机启动项。

vmstat：虚拟内存统计。

mpstat：显示各个可用CPU的状态统计。

iostat：统计系统IO。

sar：全面地获取系统的CPU、运行队列、磁盘 I/O、分页(交换区)、内存、 CPU中断和网络等性能数据。

ipcs：用于报告Linux中进程间通信设施的状态，显示的信息包括消息列表、共享内存和信号量的信息。

ipcrm：用来删除一个或更多的消息队列、信号量集或者共享内存标识。

strace：用于诊断、调试Linux用户空间跟踪器。我们用它来监控用户空间进程和内核的交互，比如系统调用、信号传递、进程状态变更等。

ltrace：命令会跟踪进程的库函数调用,它会显现出哪个库函数被调用。
关机/重启/注销和查看系统信息的命令(6个)

shutdown：shutdown -h now： 指定现在立即关机；shutdown +5 "System will shutdown after 5 minutes"：指定 5 分钟后关机，同时送出警告信息给登入用户。

reboot： reboot： 重开机。**reboot -w：** 做个重开机的模拟（只有纪录并不会真的重开机）。

halt：关机。

poweroff：关闭电源。

logout：退出当前登录的Shell。

exit：退出当前登录的Shell。

Ctrl+d：退出当前登录的Shell的快捷键。

```



## 进程管理相关命令(15个)

```
bg：将一个在后台暂停的命令，变成继续执行 (在后台执行)。

fg：将后台中的命令调至前台继续运行。

jobs：查看当前有多少在后台运行的命令。

kill：终止进程。

killall：通过进程名终止进程。

pkill：通过进程名终止进程。

crontab：定时任务命令。

ps：显示进程的快照。

pstree：树形显示进程。

nice/renice：调整程序运行的优先级。

nohup：忽略挂起信号运行指定的命令。  示例： 后台运行java程序   nohup java -jar xxx.jar &

pgrep：查找匹配条件的进程。

runlevel：查看系统当前运行级别。

init：切换运行级别。

service：启动、停止、重新启动和关闭系统服务，还可以显示所有系统服务的当前状态。

ps -ef|grep xxx:  查找进程， 如ps -ef |grep "redis"得到redis进程是4908, 然后 cat /proc/4908 即可知道进程的文件目录

```



## 时间调整命令

```
调整时间实例：date -s 11:10:35
调整日期实例：date -s 2021/02/02
```



## 查看环境信息

```
env：查看环境变量
echo $HOME命令：看当前用户目录
echo $SHELL命令:看当前用户Shell类型

```

## 查找文件路径
```
 which 文件关键字

 //示例查找java路径
 which java
```


## RPM 包的安装
安装 RPM 的命令格式为：rpm -ivh 包全名
此命令中各选项参数的含义为：  
- -i：安装（install）;  
- -v：显示更详细的信息（verbose）;  
- -h：打印 #，显示安装进度（hash）;  

示例安装jdk-11.0.19_linux-x64_bin.rpm
 <img src="http://cdn.gydblog.com/images/linux/linux-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

上面会报错V3 RSA/SHA256 Signature, keykey ID c105b9de: NOKEY。解决的方法就是在rpm 语句后面加上 --force --nodeps   
即原本为 rpm -ivh *.rpm 现在改成 rpm -ivh *.rpm --force --nodeps就可以了。nodeps的意思是忽视依赖关系。因为各个软件之间会有多多少少的联系。有了这两个设置选项就忽略了这些依赖关系，强制安装或者卸载