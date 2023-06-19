---
# icon: lock
date: 2023-01-07
category:
  - linux常用操作
tag:
  - linux常用操作
---
# Linux操作
## ssh连接远程服务器
语法格式：ssh 用户名@IP地址 -p 端口号

示例：
 <img src="/images/linux/linux-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 全文检索指定字符串-grep
Linux grep (global regular expression) 命令用于查找文件里符合条件的字符串或正则表达式。  

语法格式：grep [options] pattern [files]  

示例：检索文件dump.txt中匹配“java.lang.Thread.State”的部分

 <img src="/images/linux/linux-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 文本分析命令-awk
AWK 是一种处理文本文件的语言，是一个强大的文本分析工具。  

之所以叫 AWK 是因为其取了三位创始人 Alfred Aho，Peter Weinberger, 和 Brian Kernighan 的 Family Name 的首字符。

awk命令很复杂，详细教程可参考https://www.runoob.com/linux/linux-comm-awk.html  

示例 使用awk和grep组合分析字符串出现的次数 ：  
grep java.lang.Thread.State dump.txt | awk '{print $2$3$4$5}' | sort | uniq -c
 <img src="/images/linux/linux-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


## 脚本模板
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