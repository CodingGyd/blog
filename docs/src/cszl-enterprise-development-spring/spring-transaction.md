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

下面小郭从代码设计和应用角度对Spring提供的事务管理机制进行总结。

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

2）TransactionStatus
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



下面代码示例如何进行XML配置。
todo

 

**2）编程式事务**
编程式事务指通过硬编码的方式使用spring中提供的事务相关的类来控制事务

最原始的方式是通过主动创建PlatfornTransactionManager的实例，并进行相关配置，然后编程主动执行开启事务，提交事务，回滚事务等导致。

//伪代码代码示例(说明主要流程)

- 引入依赖

```xml

```

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
      System.out.println("before:" + jdbcTemplate.queryForList("SELECT * from xxx_table"));
      jdbcTemplate.update("insert into xxx_table (name) values (?)", "test1-1");
      jdbcTemplate.update("insert into xxx_table (name) values (?)", "test1-2");
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

### 3、事务失效问题
- @Transactional 声明在非 public 的方法上

- 自调用：同一个类中，有方法A，B，无 @Transactional 的方法A内部调用有 @Transactional 的方法B 的情况。原因是AOP无法为自身生成代理对象进行调用。解决办法，将需要添加@Transactional 方法另起一个类作为被调用类，调用类注入这个另起的被调用类。

- @Transactional 没有声明对回滚的异常类以及子类 

## 五、总结

## 六、参考资料
https://blog.csdn.net/weixin_45627039/article/details/130345855
https://juejin.cn/post/6844903608224333838

https://zhuanlan.zhihu.com/p/56070261