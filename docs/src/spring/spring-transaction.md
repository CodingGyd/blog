---
title: Spring系列笔记-事务管理
shortTitle: Spring的事务管理
date: 2023-08-20
category:
  - JAVA企业级开发
tag:
  - 事务
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring5,Spring总结,Spring核心知识,事务管理
---

# 学废事务管理原理
## 前言

本文将通过下面的几个维度详细总结事务管理的基本知识点，希望能对初学者有帮助。
![事务管理](http://cdn.gydblog.com/images/spring/tx-1.png)


## 一、何为事务？
先来说说“事务”这个词语，在百度百科上的解释是：指具体的事情、行政杂务、总务。

在编程领域，具体的事情其实就是指某个业务动作，事务管理就是对一组业务动作的管理，这一组业务动作要么全部执行完成，要么全部不执行，是一个不可分割的工作单位。
 
## 二、为什么要有事务？
 事务控制广泛存在各类应用场景程序中，比如银行取款和转账、电商的订单支付和库存。

 举个例子，张三去银行ATM上操作取款：

 - 银行卡放入ATM机。，输入密码
 - 连接数据库，验证账户密码
 - 验证成功，获得张三信息（银行余额：3000）
 - 张三输入取款金额，按下确认键（取款：1000）
 - 从后台数据库中减掉张三取款金额（剩下余额：2000）
 - ATM机吐出钱
 - 张三拿走钱

上面的业务动作只要有一个出错了就会导致整个业务流程失败，例如在取钱这个过程中，张三账号的余额已经减少到2000了，但是ATM机器确没有成功吐出钞票。这时候就要用到事务回滚了，将张三账户余额的钱恢复到3000，没有事务回滚机制就乱套啦！

## 三、事务的基本概念

事务要实现“要么全部执行完成，要么全部不执行”这一目标，需要有一些规则来支持，在事务管理中的规则就是指各种开始管理前的约定配置，核心的配置项有传播行为、隔离级别、回滚机制、超时设置。

下面小郭将对这些核心配置进行使用说明总结。

### 1、传播行为

> 事务传播行为是为了解决业务层方法之间互相调用的事务如何生效问题。

事务传播行为是指：多个含有事务的方法相互调用时，事务如何在这些方法间传播。

Spring框架提供了七种事务传播行为的选项配置：

![Spring中的七种事务传播行为](http://cdn.gydblog.com/images/spring/tx-2.png)

例如：methodA事务方法调用methodB事务方法时，methodB是继续在调用者methodA的事务中运行呢，还是为自己开启一个新事务运行，这就是由methodB的事务传播行为决定的。


### 2、隔离级别
隔离级别有四种：读未提交、不可重复读、可重复读、串行化。

![四种隔离级别](http://cdn.gydblog.com/images/spring/tx-3.png)

下面分别对每一种事务隔离级别进行介绍：

- **读未提交（read-uncommitted）**  
  是要求最低的隔离级别，使用这个隔离级别很少，因为它允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读等并发问题。

- **不可重复读（read-committed）** 
  允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生。

- **可重复读（repeatable-read）** 
  对同一数据的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。
  
- **串行化（serializable）** 
  要求最高的隔离级别，所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，该级别可以防止脏读、不可重复读以及幻读。但是这对程序的并发性能有极大影响。通常我们也不会用到该级别。


> MySQL 默认采用的 可重复读repeatable-read 隔离级别 ，Oracle 默认采用的 不可重复读read-committed 隔离级别.
 

### 3、回滚
事务回滚是指将该事务中已经执行完的一系列业务动作造成的数据变更均进行恢复到变更之前的状态。

就拿本文开头举的例子"张三转账"，如果ATM机吐出失败，就将张三的余额数据变更为取款之前的余额。


### 4、超时

事务超时，就是指允许一个事务执行的最长时间，如果超过该时间限制但事务处理还没有完成，则会自动回滚事务。


## 四、Spring的事务处理

我们常说的 Spring 事务，其实是事务在 Spring 中的实现。Spring 事务的本质，其实就是通过 Spring AOP 切面技术，在合适的地方开启事务，接着在合适的地方提交事务或回滚事务，从而实现了业务编程层面的事务操作。

Spring框架对事务管理进行了良好的模块化封装，通过各种组件的定义，对事务的相关配置进行了良好的支持，开放了各种可选手段供开发者对事务的各种配置进行按需定义。

在Spring框架中提供了一个名为spring-tx的JAR包，该包就是Spring提供的用于事务管理的核心。

小郭将从代码设计和应用角度对Spring提供的事务管理机制进行总结。

### 1、顶层接口设计

首先，我们先了解Spring事务管理的顶层设计部分(擒贼先擒王！)。

:::warning 敲黑板
通常情况下，数据的查询不会影响原数据的改变，所以不需要进行事务管理，而对于数据的插入、更新和删除操作，必须进行事务管理。
:::

1）PlatformTransactionManager
在spring-tx这个jar包的org.Springframework.transaction包下有一个PlatformTransactionManager接口，这是Spring针对事务管理的顶层接口定义，可以认为是事务的大管家。

该接口中定义了3个事务操作的方法，用于获取事务状态、提交事务、回滚事务：

```java
public interface PlatformTransactionManager extends TransactionManager {
  //获取事务状态
  TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;
  //提交事务
  void commit(TransactionStatus status) throws TransactionException;
  //回滚事务
  void rollback(TransactionStatus status) throws TransactionException;
}
```

PlatformTransactionManager接口只是代表事务管理的接口，并不关心底层管理事务的细节，它只需要定义好上面的3个方法，但具体如何管理事务则由它的实现类来完成。

> 作为管家，只需要安排好每一个大的节点，至于每个节点细节怎么实现，都是吩咐下人去完成的，管家只关心结果，不关心过程。

不同持久化技术针对PlatformTransactionManager接口有不同的实现，下面是几个主要的实现：

![Spring事务管理器的实现类](http://cdn.gydblog.com/images/spring/tx-4.png)

当底层采用不同的持久层技术时，系统只需使用不同的PlatformTransactionManager实现类即可，这也说明了Spring对修改封闭、对扩展开放的设计理念。


2）TransactionDefinition
在事务管理器PlatformTransactionManager的getTransaction方法中，定义了入参TransactionDefinition，这个其实包含了事务的配置信息。

TransactionDefinition是Spring框架对事务的传播行为、隔离级别等配置的封装。
```java
public interface TransactionDefinition {
  ////////////////////七种事务传播行为////////////////////////
  //支持当前事务，如果当前没有事务，就新建一个事务，这是spring默认的传播行为。
  int PROPAGATION_REQUIRED = 0;
  //支持当前事务，如果当前没有事务，就以非事务方式执行
  int PROPAGATION_SUPPORTS = 1;
  //支持当前事务，如果当前没有事务，就抛出异常
  int PROPAGATION_MANDATORY = 2;
  //直接新建事务，如果当前已经存在事务，就把当前事务挂起
  int PROPAGATION_REQUIRES_NEW = 3;
  //以非事务方式执行，如果当前存在事务，就把当前事务挂起
  int PROPAGATION_NOT_SUPPORTED = 4;
  //以非事务方式执行，如果当前存在事务，则抛出异常
  int PROPAGATION_NEVER = 5;
  //必须在事务状态下执行，如果当前没有事务，就新建一个事务，如果当前已有事务，则创建一个嵌套事务
  int PROPAGATION_NESTED = 6;

  /////////////四种隔离级别/////////
  //读未提交
  int ISOLATION_READ_UNCOMMITTED = 1;
  //读已提交
  int ISOLATION_READ_COMMITTED = 2;
  //可重复读
  int ISOLATION_REPEATABLE_READ = 4;
  //串行化
  int ISOLATION_SERIALIZABLE = 8;
  //使用数据库设置的隔离级别，数据库设置的是什么就用什么
  //MySQL 默认采用的 可重复读repeatable-read 隔离级别 
  //Oracle 默认采用的 不可重复读read-committed 隔离级别
  int ISOLATION_DEFAULT = -1;

  //事务超时时间 默认不设置
  int TIMEOUT_DEFAULT = -1;

  //获取事务的传播行为
  default int getPropagationBehavior() {
      return 0;
  }

  //获取事务的隔离级别
  default int getIsolationLevel() {
      return -1;
  }

  //获取事务的超时时间
  default int getTimeout() {
      return -1;
  }

  //获取事务是否只读
  default boolean isReadOnly() {
      return false;
  }

  //获取事务对象名称
  @Nullable
  default String getName() {
      return null;
  }

  static TransactionDefinition withDefaults() {
      return StaticTransactionDefinition.INSTANCE;
  }
}
```  

3）TransactionStatus
在事务管理器PlatformTransactionManager的方法定义中，入参出参都出现了TransactionStatus这个东东，这又是干啥的呢？

TransactionStatus接口描述了事务的状态，描述了某一时间点上事务的状态信息。该接口定义如下：
```java
public interface TransactionStatus extends TransactionExecution, SavepointManager, Flushable {
  //获取是否存在保存点
  boolean hasSavepoint();
  //刷新事务
  void flush();
}
```

TransactionStatus还继承了多个父接口的相关方法：
```java
public interface TransactionExecution {
  //获取是否是新事务
  boolean isNewTransaction();
  //设置事务回滚
  void setRollbackOnly();
  //获取是否回滚
  boolean isRollbackOnly();
  //获取事务是否完成
  boolean isCompleted();
}
```

```java
public interface SavepointManager {
  //创建保存点
  Object createSavepoint() throws TransactionException;
  //回滚至保存点
  void rollbackToSavepoint(Object savepoint) throws TransactionException;
  //释放保存点
  void releaseSavepoint(Object savepoint) throws TransactionException;
}
```


### 2、使用方式
Spring允许开发人员使用下面的两种方式来使用事务管理功能：

- 声明式事务：注解方式或XML配置
- 编程式事务：通过编写AOP的切点，拦截器。可在切点上拦截某些方法达到局部事务，或拦截全局达到全局事务

**1）声明式事务**

Spring的声明式事务管理可以通过两种方式来实现：

- 基于XML的方式
基于XML方式的声明式事务管理是通过在配置文件中配置事务规则的相关声明来实现的。

- 基于Annotation的方式（推荐）


<font color="red">下面代码示例如何进行XML配置。</font>
> 基于springboot生成的脚手架 ，springboot推荐注解方式配置，此处为了演示才使用xml配置
- **a. 引入依赖**
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
<!--MYSQL驱动-->
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
</dependency>
<!--AOP支持-->
<dependency>
  <groupId>org.aspectj</groupId>
  <artifactId>aspectjrt</artifactId>
  <version>1.9.5</version>
</dependency>
<dependency>
  <groupId>org.aspectj</groupId>
  <artifactId>aspectjweaver</artifactId>
  <version>1.9.5</version>
</dependency>
```
- **b. 定义实体类(对应表结构)**
```java
package com.gyd.springtxdemo;

public class User {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

- **c. 定义Dao接口和实现**
> getJdbcTemplate()获取的是JdbcTemplate对象。
> JdbcTemplate 是 Spring JDBC 核心包（core）中的核心类，它可以通过配置文件、注解、Java 配置类等形式获取数据库的相关信息，实现了对 JDBC 开发过程中的驱动加载、连接的开启和关闭、SQL 语句的创建与执行、异常处理、事务处理、数据类型转换等操作的封装。我们只要对其传入SQL 语句和必要的参数即可轻松进行 JDBC 编程。
```java
public interface UserDao {

  List<User> findAll(Integer id);

  void update(User user);

}
```

```java
public class UserDaoImpl  extends JdbcDaoSupport implements UserDao{

  @Override
  public List<User> findAll(Integer id) {
      System.out.println("UserDaoImpl findAll");
      RowMapper<User> rowMapper = new BeanPropertyRowMapper<>(User.class);
      //将id绑定到SQL语句中，并通过RowMapper返回list
      return getJdbcTemplate().query("select id,name,age from user where id = ?", rowMapper,id);
  }

  @Override
  public void update(User user) {
      System.out.println("UserDaoImpl update");
      getJdbcTemplate().update("update user set name= ?,age = ? where id = ?",user.getName(),user.getAge(),user.getId());
  }
}
```
  
- **d. xml配置(核心！)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/tx
       https://www.springframework.org/schema/tx/spring-tx.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">
    <!--从classpath的根路径去加载db.properties文件-->
    <!--<context:property-placeholder location="classpath:db.properties" system-properties-mode="NEVER"/>-->
    <context:property-placeholder location="classpath:db.properties"/>
    <!--配置一个druid的连接池-->
    <!--数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${jdbc.driverClassName}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    <!--配置dao-->
    <bean id = "userDao" class="com.gyd.springtxdemo.UserDaoImpl">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!--配置service-->
    <bean id="userService" class="com.gyd.springtxdemo.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>
    <!--配置controller-->
    <bean id = "userController" class="com.gyd.springtxdemo.UserController">
        <property name="userService" ref="userService"/>
    </bean>

    <!-- ====================================================================== -->

    <!-- 1: 配置JDBC事务管理器 WHAT:做什么增强(这里做事务增强)-->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 2: 配置事务管理器增强 WHEN-->
    <tx:advice id="txAdvice" transaction-manager="txManager">
        <tx:attributes>
            <tx:method name="trans"/>
        </tx:attributes>
    </tx:advice>

    <!-- 3: 配置切面 WHERE-->
    <aop:config>
        <aop:pointcut id="txPointcut" expression="execution(* com.gyd.springtxdemo.*Service.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointcut"/>
    </aop:config>

    <!-- ====================================================================== -->
</beans>
```

db.properties: 
```
server.port=8080
jdbc.driverClassName=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://127.0.0.1:6666/gyd?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
jdbc.username=root
jdbc.password=1234

```

- **e.程序测试类**
```java
public class SpringTxDemoApplication {

	public static void main(String[] args) {
		//加载配置文件
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
		//获取userDao实例
		UserDao userDao = (UserDao)applicationContext.getBean("userDao");

		User user = new User();
		user.setAge(18);
		user.setName("test");
		user.setId(1);
		userDao.insert(user);
		System.out.println("插入数据成功！"+user);

		List<User> userList = userDao.findAll(1);
		System.out.println("查询数据成功！"+userList);
	}
}
```


启动程序，验证事务逻辑正常。
```
UserDaoImpl insert
插入数据成功！User{id=2, name='test', age=19}
UserDaoImpl findAll
查询数据成功！[User{id=2, name='test', age=19}]
Disconnected from the target VM, address: '127.0.0.1:56447', transport: 'socket'

Process finished with exit code 0
```

查看mysql中正常保存了数据：
![Spring事务管理器的实现类](http://cdn.gydblog.com/images/spring/tx-5.png)

接下来再来验证下出错场景，看数据是否回滚。

我们在插入数据的方法里造一个数据异常：
```java
@Override
@Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT,readOnly = false)
public void insert(User user) {
    System.out.println("UserDaoImpl insert");
    getJdbcTemplate().update("insert into user(id,name,age) values(?,?,?)",user.getId(),user.getName(),user.getAge());
    int i=10/0;
}
```

修改程序测试类：
```java
public class SpringTxDemoApplication {

	public static void main(String[] args) {
		//加载配置文件
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext-annotation.xml");
		//获取userDao实例
		UserDao userDao = (UserDao)applicationContext.getBean("userDao");

		User user = new User();
		user.setAge(20);
		user.setName("test");
		user.setId(3);
		userDao.insert(user);
		System.out.println("插入数据成功！"+user);

		List<User> userList = userDao.findAll(3);
		System.out.println("查询数据成功！"+userList);

	}

}


```
运行程序测试类SpringTxDemoApplication，控制台输出了错误：
```
UserDaoImpl insert
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at com.gyd.springtxdemo.UserDaoImpl.insert(UserDaoImpl.java:42)
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:104)
	at java.base/java.lang.reflect.Method.invoke(Method.java:578)
	at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:343)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.invokeJoinpoint(ReflectiveMethodInvocation.java:196)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
	at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:123)
	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:391)
	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:119)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:244)
	at jdk.proxy2/jdk.proxy2.$Proxy10.insert(Unknown Source)
	at com.gyd.springtxdemo.SpringTxDemoApplication.main(SpringTxDemoApplication.java:22)

```

然后我们登录数据库查看是否有id=19的数据记录
![](http://cdn.gydblog.com/images/spring/tx-6.png)

从上面的结果来看，程序出现错误时，虽然insert语句执行完成了，但是在同一个方法内发生了异常，事务管理进行了数据回滚操作，数据库中并没有保留id等于3的记录。

上面看起来配置很繁琐，没关系，Spring的声明式事务管理还可以通过Annotation（注解）的方式来实现。这种方式的使用非常简单，开发者只需做两件事情：

<font color="red">下面代码示例如何进行注解配置。</font>
- **a.在Spring容器中注册事务注解驱动，其代码如下：**
为了和之前的配置区分，新建一个配置文件：applicationContext-annotation.xml。
```
<tx:annotation-driven transaction-manager="transactionManager" />
```

- **b.在需要使用事务的Spring Bean类或者Bean类的方法上添加注解@Transactional:**
> 指定事务的传播行为和隔离级别
```
public class UserDaoImpl  extends JdbcDaoSupport implements UserDao{
  @Override
  public List<User> findAll(Integer id) {
      System.out.println("UserDaoImpl findAll");
      RowMapper<User> rowMapper = new BeanPropertyRowMapper<>(User.class);
      //将id绑定到SQL语句中，并通过RowMapper返回list
      return getJdbcTemplate().query("select id,name,age from user where id = ?", rowMapper,id);
  }

  @Override
  @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT,readOnly = false)
  public void update(User user) {
      System.out.println("UserDaoImpl update");
      getJdbcTemplate().update("update user set name= ?,age = ? where id = ?",user.getName(),user.getAge(),user.getId());
  }
}
```

启动程序，验证事务逻辑。
- **c.程序测试类**
```java
public class SpringTxDemoApplication {

	public static void main(String[] args) {
    //加载配置文件
		ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext-annotation.xml");
		//获取userDao实例
		UserDao userDao = (UserDao)applicationContext.getBean("userDao");

		User user = new User();
		user.setAge(18);
		user.setName("test");
		user.setId(1);
		userDao.insert(user);
		System.out.println("插入数据成功！"+user);

		List<User> userList = userDao.findAll(1);
		System.out.println("查询数据成功！"+userList);
	}
}
```

不出意外，结果和xml配置方式一样。

**2）编程式事务**
编程式事务指通过硬编码的方式使用spring中提供的事务相关的类来控制事务

最原始的方式是通过主动创建PlatfornTransactionManager的实例，并进行相关配置，然后编程主动执行开启事务，提交事务，回滚事务等导致。

//伪代码代码示例(说明主要流程)
//编码操作事务
```java
public void test1() throws Exception {
  //定义一个数据源
  DataSource dataSource = new DataSource();
  dataSource.setDriverClassName("com.mysql.jdbc.Driver");
  dataSource.setUrl("jdbc:mysql://localhost:3306/xxx?characterEncoding=UTF-8&serverTimezone=UTC");
  dataSource.setUsername("root");
  dataSource.setPassword("123456");
  dataSource.setInitialSize(5);
  //定义一个JdbcTemplate，用来方便执行数据库增删改查
  JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
  //1.定义事务管理器，给其指定一个数据源（可以把事务管理器想象为一个大管家，这个管理来负责安排事务的控制操作，然后下面的下人来执行细节）
  PlatformTransactionManager platformTransactionManager = new DataSourceTransactionManager(dataSource);
  //2.定义事务属性：TransactionDefinition，
  // TransactionDefinition可以用来配置事务的属性信息，比如事务隔离级别、事务超时时间、事务传播方式、是否是只读事务等等。
  TransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
  //3.开启事务：调用platformTransactionManager.getTransaction开启事务操作，得到事务状态(TransactionStatus)对象
  TransactionStatus transactionStatus = platformTransactionManager.getTransaction(transactionDefinition);
  //4.执行业务操作，下面就执行2个插入操作
  try {
      System.out.println("before:" + jdbcTemplate.queryForList("SELECT * from User"));
      jdbcTemplate.update("insert into User (name) values (?)", "test1-1");
      jdbcTemplate.update("insert into User (name) values (?)", "test1-2");
      //5.提交事务：platformTransactionManager.commit
      platformTransactionManager.commit(transactionStatus);
  } catch (Exception e) {
      //6.回滚事务：platformTransactionManager.rollback
      platformTransactionManager.rollback(transactionStatus);
  }
  System.out.println("after:" + jdbcTemplate.queryForList("SELECT * from xxx_table"));
}
```

- 开启全局事务：在启动类上添加注解 @EnableTransactionManagement 

### 3、事务失效场景
- @Transactional 声明在非 public 的方法上

- 自调用：同一个类中，有方法A，B，无 @Transactional 的方法A内部调用有 @Transactional 的方法B 的情况。原因是AOP无法为自身生成代理对象进行调用。解决办法，将需要添加@Transactional 方法另起一个类作为被调用类，调用类注入这个另起的被调用类。

- @Transactional 没有声明对回滚的异常类以及子类 

## 五、总结
本文总结了什么是事务、为什么要有事务、以及事务的基本概念。 最后用主要代码演示了Spring框架中如何实现事务管理。

## 六、参考资料
https://blog.csdn.net/weixin_45627039/article/details/130345855
https://juejin.cn/post/6844903608224333838
https://zhuanlan.zhihu.com/p/56070261