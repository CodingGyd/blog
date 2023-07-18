---
# icon: lock
date: 2023-06-20
category:
  - elasticjob
tag:
  - elasticjob
---


# elasticjob的简单使用

某业务项目原先用的是quartz，需要用elasticjob来进行组件替换。

## 1. elasticjob-lite架构图

轻量级无中心化解决方案，使用jar 的形式提供分布式任务的协调服务

![架构](http://cdn.gydblog.com/images/cszl-combined/elasticjob-1.png)

## 2. elasticjob-lite接入

elasticjob分lite版和cloud版，以下是lite版本接入记录

以下接入描述均基于某业务项目的定时任务模块【adviser-job】

###  2.1 环境要求

```
jdk：要求Java8及其以上版本，采用1.8
maven：要求3.5.0及其以上版本，采用3.8.1
Zookeeper：要求3.6.0及其以上版本(从运维了解到公司目前线上是3.4.x版本，elasticjob投产需要单独部署高版本zk)，采用3.7.0
```

### 2.2 代码开发

####  2.2.1 POM文件引入相关jar包

**引入elasticjob-lite的相关依赖** 

采用最新发布版本3.0.0,截止20210818

```java
<dependency>
    <groupId>org.apache.shardingsphere.elasticjob</groupId>
    <artifactId>elasticjob-lite-core</artifactId>
    <version>3.0.0</version>
</dependency>
<dependency>
    <groupId>org.apache.shardingsphere.elasticjob</groupId>
    <artifactId>elasticjob-lite-spring-boot-starter</artifactId>
    <version>3.0.0</version>
</dependency>
```

**引入zookeeper的相关依赖** 

elasticjob要求zookeeper版本3.6.0以上，且需注意zookeeper和curator的jar版本需要匹配！

```
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.7.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.1.0</version>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
    <version>5.1.0</version>
</dependency>
```



####  2.2.2 job实现类改造

##### 2.2.2.1 现状

使用quartz框架实现job，项目中继承QuartzJobBean实现业务逻辑，核心代码现状如下：

```java
public class PortfolioInfoSyncTask extends QuartzJobBean {
    
	protected final Logger LOG = LoggerFactory.getLogger(this.getClass);
    
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException{
        long start = System.currentTimeMillis();
        try {
            SchedulerContext context = jobExecutionContext.getScheduler().getContext();
             portfolioInfoSyncService portfolioInfoSyncService = 	(PortfolioInfoSyncService)context.get("portfolioInfoSyncService");
            portfolioInfoSyncService.syncPortfolio();
        } catch(Exception e) {
            LOG.error("异常信息[{}]"，e)
        }
    }
}
```



##### 2.2.2.2 改造后

```
@Component
public class PortfolioInfoSyncElasticJob implements SimpleJob {
    
	protected final Logger LOG = LoggerFactory.getLogger(this.getClass);
	
	@Autowired
    private PortfolioInfoSyncService portfolioInfoSyncService;
    
    @Override
    public void execute(ShardingContext shardingContext) {
        long start = System.currentTimeMillis();
        try {
            portfolioInfoSyncService.syncPortfolio();
        } catch(Exception e) {
            LOG.error("异常信息[{}]"，e)
        }
    }
}
```



#### 2.2.3  增加job配置项

##### 2.2.3.1 现状

quartz配置文件增加任务配置,核心代码现状如下：

```xml
<bean id="startInverstmentadviserQuertz" lazy-init="true" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
    <property name="overwriteExistingJobs" value="true"></property>
    <property name="dataSource"><ref bean="dbGroupInverstmentadviser"/></property>
    <property name="schedulerContextAsMap">
    	<map>
            <entry key="portfolioInfoSyncService" value-ref="portfolioInfoSyncService"/>
           
        </map>
    </property>
    <property name="applicationContextSchedulerContextKey" value="applicationContextKey"></property>
    <property name="configLocation" value="classpath:quartz.properties"></property>
	<property name="autoStartup" value="true"></property>
    <property name="triggers">
    	<list>
        	<ref bean="portfolioInfoSyncTaskTrigger"/>
        </list>
    </property>
</bean>
<bean id="portfolioInfoSyncTask" class="com.gyd.PortfolioInfoSyncTask"></bean>
<bean id="portfolioInfoSyncTask-action" class="org.springframework.scheduling.quartz.JobDetailFactoryBean">
	<property name="jobClass" value="com.gyd.PortfolioInfoSyncTask"></property>
    <property name="durability" value="true"/>
</bean>
<bean id="portfolioInfoSyncTaskTrigger" class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
    <property name="jobDetail" ref="portfolioInfoSyncTask-action"/>
    <property name="cronExpression">0 0/5 * * * ?</property>
</bean>
```



##### 2.2.3.2 改造后

```

#事件追踪数据源配置为数据库
elasticjob.tracing.type=RDB

#mysql数据源配置(项目中存在多数据源情况时会报错，可通过在指定数据源DataSource上增加@Primary注解来解决
，参考https://blog.csdn.net/szy350/article/details/83443384)
spring.datasource.default.driverClassName=com.mysql.jdbc.Driver
spring.datasource.default.url=jdbc:mysql://192.168.22.163:3306/elastic_job?useUnicode=true&characterEncoding=GBK&autoReconnect=true&failOverReadOnly=false&tinyInt1isBit=false&socketTimeOut=30000
spring.datasource.default.username=root
spring.datasource.default.password=000000

#任务注册中心配置(自定义注册中心地址、自定义任务模块命名空间)
elasticjob.reg-center.serverLists=127.0.0.1:2181
elasticjob.reg-center.namespace=ai-investment-adviser-job

#单个任务配置(aiPortfolioInfoSyncJob是任务的唯一标识名，不同任务不能重复，配置格式是elasticjob.jobs.任务名.配置项=配置值)
elasticjob.jobs.aiPortfolioInfoSyncJob.elasticJobClass=com.sinolink.ai.iadviser.job.v2.AiPortfolioInfoSyncElasticJob
elasticjob.jobs.aiPortfolioInfoSyncJob.cron=0/10 * * * * ?
elasticjob.jobs.aiPortfolioInfoSyncJob.shardingTotalCount=1
elasticjob.jobs.aiPortfolioInfoSyncjob.description=定时更新量化组合详情任务
elasticjob.jobs.aiPortfolioInfoSyncJob.overwrite=true
```



####  2.2.4  job运维平台配置

若使用elasticjob提供的开源运维平台查看任务运行相关数据，则需要增加此步骤

cd apache-shardingsphere-elasticjob-3.0.0-lite-ui-bin/conf  

vi application.properties  

```
server.port=8088
auth.root_username=root
auth.root_password=root
auth.guest_username=guest
auth.guest_password=guest

##数据源需和应用服务的数据源保持一致(若采用dbroute配置，则可忽略如下配置，只需要在实例化对应的dataSource的bean时增加@Primary注解即可！)
spring.datasource.default.driverClassName=com.mysql.jdbc.Driver
spring.datasource.default.url=jdbc:mysql://192.xxx.xxx.xxx:3306/elastic_job?useUnicode=true&characterEncoding=GBK&autoReconnect=true&failOverReadOnly=false&tinyInt1isBit=false&socketTimeOut=30000
spring.datasource.default.username=root
spring.datasource.default.password=000000
```



## 3.部署

### 2.1 启动zookeeper

![启动zookeeper](http://cdn.gydblog.com/images/cszl-combined/elasticjob-2.png)

### 2.2 启动业务模块的job服务

![业务job服务启动成功日志](http://cdn.gydblog.com/images/cszl-combined/elasticjob-3.png)


### 2.3 启动elasticjob运维管理平台
![elasticjob运维管理平台启动成功日志](http://cdn.gydblog.com/images/cszl-combined/elasticjob-4.png)


## 4.验证

初次接入主要是通过观察应用中的任务执行是否按预期调度、任务数据表是否自动生成、运维平台展示任务相关配置和运行状态是否正常即可

数据库表是否自动创建：

![elasticjob相关数据库表](http://cdn.gydblog.com/images/cszl-combined/elasticjob-5.png)



运维平台连接zookeeper配置

![运维平台连接zookeeper配置](http://cdn.gydblog.com/images/cszl-combined/elasticjob-6.png)



作业维度查看和操作具体任务

![作业维度查看和操作具体任务](http://cdn.gydblog.com/images/cszl-combined/elasticjob-7.png)


服务器维度查看任务

![服务器维度查看和操作具体任务](http://cdn.gydblog.com/images/cszl-combined/elasticjob-8.png)


查看任务历史运行数据

![查看任务历史运行数据](http://cdn.gydblog.com/images/cszl-combined/elasticjob-9.png)





使用zktools查看zookeeper中生成的znode数据

![zookeeper的node结构](http://cdn.gydblog.com/images/cszl-combined/elasticjob-10.png)


## 5. 接入时遇到的问题

### zookeeper版本冲突

**问题**  
elasticjob要求jdk1.8和zookeeper3.6.0以上，而我们的业务项目目前生产使用的zookeeper是3.4.x

**解决**

​	**方式1**- 尝试下载3.6.0版本以上的zookeeper-api源码和5.1.0版本的zookeeper客户端curator源码，修改包路径和pom描述符，重新打包给项目引用，尝试了下，操作繁琐，后期不好维护，不采用。

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-11.png)


![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-12.png)


​     **方式2**- 尝试在项目中同时引入多个版本的zookeeper相关jar包，发现项目启动时会报少量zookeeper链接错误,运行过程中观察任务可以正常调度，dubbo接口可以正常调用，目前采用此方法

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-13.png)


![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-14.png)

备注：若elasticjob投产，线上需要单独增加部署版本>=3.6.0的zookeeper服务



### zookeeper多版本并存报异常

项目中3.4.x和3.7.0版本zookeeper并存时，项目启动初期会刷如下错误，但是不影响最终启动，dubbo接口最终能正常访问

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-15.png)

### maven仓库缺失elasticjob相关jar包

公司的maven库里缺少elasticjob相关jar包，从github下载后手动上传到maven仓库解决

   



### zookeeper源码下载后打包报错

参考https://blog.csdn.net/u012957549/article/details/104701435/



### elasticjob运维平台源码打包失败、启动失败

**运维管理平台源码打包**

cd shardingsphere-elasticjob-ui-3.0.0-release

执行mvn clean package -Prelease 报错 node服务连接超时，公司司网络问题，换自己手机热点解决

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-16.png)

打包报assembly文件错误，因为是在window环境下的打包，需要把打包描述文件里的<outputDirectory>/</outputDirectory>` 替换为 `<outputDirectory>${file.separator}</outputDirectory>(这个错误似乎不影响最终的tar包生成，可忽略)

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-17.png)



打包后生成的tar包里的lib目录文件名称不全，导致无法启动，原因是window对文件路径有长度限制(大概287个字符)，需要修改下文件夹名字为短名称，或者在linux系统环境下打包！

或者直接在官方网站下载可执行的bin包https://shardingsphere.apache.org/elasticjob/current/en/downloads/

(官方网站下载的打包好的tar，在我本机window解压也有问题，见截图，lib目录里的jar文件名称被截断了)

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-18.png)



### 任务配置修改后重启服务不生效

修改某个任务配置并重启服务后，查看运维管理控制台未更新，因为管理控制台读取的是zookeeper中的数据，默认不会因为应用服务中配置调整而强制修改zookeeper中的znode节点数据，需要在应用服务中给某个任务配置增加overwrite=true配置

（谨慎使用该配置，若管理员在运维平台对任务配置做了修改且开启了此配置，则下次应用服务重启时会覆盖当时管理员做的修改！）

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-19.png)



### 任务描述信息中文编码问题

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-20.png)


在运维平台查看某个任务描述信息时出现乱码，需查看应用中的配置文件编码是否正确，我本机是改成UTF-8后，删除zookeeper中znode数据，再去运维平台查看任务描述信息恢复正常

![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-21.png)


![](http://cdn.gydblog.com/images/cszl-combined/elasticjob-22.png)





### 多数据源配置问题

项目中配置了多个DataSource，而elasticjob-lite-spring-boot-starter里的ElasticJobTracingConfiguration采用的是spring的自动注入方式注入DataSource，导致会报XXXXX required a single bean, but 2 were found，解决方式是在指定的dataSource上增加 添加@Primary注解，就可以做到唯一区分。



未知问题XXX

## 6. 参考文档和源码链接

elasticjob官方手册：https://shardingsphere.apache.org/elasticjob/current/cn/overview/

elasticjob框架源码：https://www.apache.org/dyn/closer.cgi/shardingsphere/elasticjob-3.0.0/apache-shardingsphere-elasticjob-3.0.0-lite-bin.tar.gz

elasticjob运维管理平台源码：https://www.apache.org/dyn/closer.cgi/shardingsphere/elasticjob-ui-3.0.0-RC1/apache-shardingsphere-elasticjob-3.0.0-RC1-lite-ui-bin.tar.gz

zookeeper源码下载：https://zookeeper.apache.org/releases.html

curator源码下载：https://archive.apache.org/dist/curator/5.1.0/







## 7.多机多实例部署

业务job服务部署三个实例
```
192.168.xx.xx1
192.168.xx.xx2
192.168.xx.xx3

```

elasticjob-ui 管理控制台

```
192.168.xx.xx4:8088
```

elasticjob-zk

```
192.168.xx.xx5:2181
```



 
