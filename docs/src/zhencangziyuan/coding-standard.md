---
date: 2023-07-21
category:
  - 葵花宝典
tag:
  - 编程规约
star: 9
sticky: 10
---
 
# 合格程序员必备的编程规约
## 前言  
::: tip 至理名言
对本职工作认真负责，是一种职业基本素养，对于一线正在撸代码的各位程序员，写好代码是大家的天职。
:::

>规范不是为了约束和禁锢大家的创造力，而是为了帮助大家能够在正确的道路上，尽可能的避免踩坑和跑偏。  
>规范可以让我们无论单枪匹马还是与众人同行的时候都能得心应手。  
>规范可以让我们在面对日益变态的需求和做代码接盘侠的时候，更优雅从容。  
>规则并不是完美的，通过约束和禁止在特定情况下的特性，可能会对代码实现造成影响。  
>但是我们制定规则的目的：为了大多数程序员小伙伴可以得到更多的好处，如果在团队实际运作中认为某个规则无法遵循或有更好的做法，希望大家可以共同改进该规范。  

::: warning 软件开发常用词汇查找手册

素材来源于网络  
链接：<a href="https://pan.baidu.com/s/12WL1y_bs6fPK4NxI9LDF4Q" target="_blank">点此跳转</a>
提取码：98tt

:::

## 一、编程规范  
### 1、好代码的原则  
我们参考 Kent Beck 的简单设计四原则来指导我们的如何写出优秀的代码，如何有效地判断我们的代码是优秀的。  
- 通过所有测试（Passes its tests）：强调的是外部需求，这是代码实现最重要的  
- 尽可能消除重复 (Minimizes duplication)：代码的模块架构设计，保证代码的正交性，保证代码更容易修改  
- 尽可能清晰表达 (Maximizes clarity)：代码的可阅读性，保证代码是容易阅读的  
- 更少代码元素 (Has fewer elements)：保证代码是简洁的，在简洁和表达力之间，我们更看重表达力  

以上四个原则的重要程度依次降低， 这组定义被称做简单设计原则。  

### 2、项目命名规范

正例：mall-management-system / order-service-client / user-api  

反例：mall_management-system / mallManagementSystem / orderServiceClient  

### 3、TODO/FIXME 规范  
TODO/TBD(to be determined) 注释一般用来描述已知待改进、待补充的修改点,并且加上作者名称。  

FIXME 注释一般用来描述已知缺陷，它们都应该有统一风格，方便文本搜索统一处理。如：  
```
// TODO <author-name>: 补充XX处理
// FIXME <author-name>: XX缺陷
```

### 4、方法参数规范  
无论是 controller，service，manager，dao 亦或是其他的代码，每个方法最多 3 个参数，如果超出 3 个参数的话，要封装成 javabean 对象。

- 方便他人调用，降低出错几率。尤其是当参数是同一种类型，仅仅依靠顺序区分，稍有不慎便是灾难性后果，而且排查起来也极其恶心。
- 保持代码整洁、清晰度。当一个个方法里充斥着一堆堆参数的时候，再坚强的人，也会身心疲惫。

反例：
```java
/**
* 使用证书加密数据工具方法
*
* @param param
* @param password 加密密码
* @param priCert 私钥
* @param pubCert 公钥
* @return 返回加密后的字符串
*/
public String signEnvelop(JdRequestParam param, String password, String priCert, String pubCert){}
```

### 5、注释规范

#### 5-1、注释和代码一样重要
注释是我们披荆斩棘历经磨难翻越需求这座大山时，留下的踪迹和收获的经验教训，这些宝贵的知识除了证明我们曾经存在过，也提醒着后来的人们殷鉴不远、继往开来。  

注释除了说明作用、逻辑之外。还有一个很重要的原因：当业务逻辑过于复杂，代码过于庞大的时候，注释就变成了一道道美化环境、分离与整理逻辑思路的路标。这是很重要的一点，它能有效得帮助我们免于陷入代码与业务逻辑的泥沼之中。  

正例：
```java
/**
* 开始抽奖方法
* 保存中奖信息、奖励用户积分等
* @param luckDrawDTO
* @return ResponseDTO 返回中奖信息
*/
public ResponseDTO<String> startLuckDraw(LuckDrawDTO luckDrawDTO) {

    // -------------- 1、校验抽奖活动基本信息 ------------------------
    xxx伪代码一顿操作

    // -------------- 2、新增抽奖记录 -------------------------------
    xxx伪代码一顿操作

    // -------------- 3、如果需要消耗积分，则扣除钢镚积分 -------------
    xxx伪代码一顿操作

    // -------------- 4、获取奖品信息，开始翻滚吧 --------------------
    xxx伪代码一顿操作

    return ResponseDTO.succ(luckDrawPrizeVO);
}
```

#### 5-2、注释和代码的一致性
注释并不是越多越好，当注释过多，维护代码的同时，还需要维护注释，不仅变成了一种负担，也与我们当初添加注释的初衷背道而驰。  

首先：大家应该通过清晰的逻辑架构，好的变量命名来提高代码可读性；需要的时候，才辅以注释说明。注释是为了帮助阅读者快速读懂代码，所以要从读者的角度出发，按需注释。注释内容要简洁、明了、无二义性，信息全面且不冗余。  

其次：无论是修改、复制代码时，都要仔细核对注释内容是否正确。只改代码，不改注释是一种不文明行为，破坏了代码与注释的一致性，会让阅读者迷惑、费解，甚至误解。

反例：
```java
// 查询部门
EmployeeDTO employee = employeeDao.listByDeptId(deptId);
```

#### 5-3、方法注释
方法要尽量通过方法名自解释，不要写无用、信息冗余的方法头，不要写空有格式的方法头注释。  

方法头注释内容可选，但不限于：功能说明、返回值，用法、算法实现等等。尤其是对外的方法接口声明，其注释，应当将重要、有用的信息表达清楚。  

正例：
```java
/**
 * 解析转换时间字符串为 LocalDate 时间类
 * 调用前必须校验字符串格式 否则可能造成解析失败的错误异常
 *
 * @param dateStr 必须是 yyyy-MM-dd 格式的字符串
 * @return LocalDate
 */
public static LocalDate parseYMD(String dateStr){}
```

反例：
```java
/**
 *
 * @param dateStr 必须是 yyyy-MM-dd 格式的字符串
 * @return LocalDate
 */
public static LocalDate parseYMD(String dateStr){}
```

反例中出现的问题：  
- 方法注释没有说明具体的作用、使用事项。
- 参数、返回值，空有格式没内容。这是非常重要一点，任何人调用任何方法之前都需要知道方法对参数的要求，以及返回值是什么。


## 二、项目规范
### 1、代码目录结构
统一的目录结构是所有项目的基础，没有固定的目录结构，适合项目团队的才是最好的。  

[目录分层参考](../cszl-combined/layered-architecture.md)

### 2、Http接口对接规范
> 科普：API（Application Programming Interface，应用程序编程接口）
> http接口:基于HTTP协议的开发接口.这个并不能排除没有使用其他的协议。
::: tip

1）确认接口文档的准确性
在进行API对接之前，首先要确保接口文档的确性。接口文档应该清晰地描述API的功能、参数、返回值和错误码等方进行沟通和确认  

2）参数的正确性和安全性   
在进行API对接时，需要对参数的正确性安全性进行验证。对于必填参数，需要确保其不为空;对于可选参数需要进行合理的默认值处理。同时，需要对参数进行合法性检查避免恶意输入和攻击异常进行处理。

3）错误处理和异常处理  
在进行API对接时，应该对可能出现的错误和异常进行处理。对于返回的错误码，可以通过对应的错误码表进行解读和业务处理。同时，需要合理地处理异常情况，比如网络异常、服务器错误、超时异常等，以提高系统的稳定性和可靠性.

4）数据传输的安全性和加密性   
在进行API对接时，需要确保数据传输的安全性和加密性。可以使用HTTPS协议来保证数据传输的加密性，同时可以使用其他加密算法来保证数据存储的安全性。如果涉及到用户的敏感信息，应该尽量避免明文传输和存储。
 
5）版本控制和兼容性处理  
在进行API对接时，应该考虑到接口的版本控制和兼容性处理。当接口发生变化时，应该及时进行版本升级，并及时通知对接方进行相应的调整。同时，为了保持接口的兼容性，可以通过使用接口升级策略和向后兼容的方式来处理。
:::

### 3、Rpc接口对接规范
> 科普：RPC（Remote Procedure Call），远程过程调用）  
> 局域网内部跨应用通信框架。常见的有dubbo、thrift、HSF、Feign。

重要的事情说三遍：
:::warning
一定要做好超时处理和异常处理的兜底！！！
一定要做好超时处理和异常处理的兜底！！！
一定要做好超时处理和异常处理的兜底！！！
:::

## 三、MVC 规范  
### 1、整体分层
- controller 层
- service 层
- manager 层
- dao 层

### 2、 controller 层规范
1） 只允许在 method 上添加 RequestMapping 注解，不允许加在 class 上（为了方便的查找 url，放到 url 不能一次性查找出来）  
正例：
```java
@RestController
public class DepartmentController {

    @GetMapping("/department/list")
    public ResponseDTO<List<DepartmentVO>> listDepartment() {
        return departmentService.listDepartment();
    }
}
```

反例：
```java

@RequestMapping ("/department")
public class DepartmentController {

    @GetMapping("/list")
    public ResponseDTO<List<DepartmentVO>> listDepartment() {
        return departmentService.listDepartment();
    }

}
```

2）不推荐使用 rest 命名 url， 只能使用 get/post 方法。url 命名上规范如下：
> 虽然 Rest 大法好，但是有时并不能一眼根据 url 看出来是什么操作，所以我们选择了后者，这个没有对与错，只有哪个更适合我们的团队。

格式：/业务模块/子模块/动作  

正例：
```
GET  /department/get/{id}      查询某个部门详细信息
POST /department/query         复杂查询
POST /department/add           添加部门
POST /department/update        更新部门
GET  /department/delete/{id}   删除部门
```

3）每个方法必须添加 swagger 文档注解 @ApiOperation ，并填写接口描述信息，描述最后必须加上作者信息 @author 哪吒 。

正例：
```java
@ApiOperation("更新部门信息 @author 哪吒")
    @PostMapping("/department/update")
    public ResponseDTO<String> updateDepartment(@Valid @RequestBody DeptUpdateDTO deptUpdateDTO) {
        return departmentService.updateDepartment(deptUpdateDTO);
    }
}
```

4）controller 负责协同和委派业务，充当路由的角色，每个方法要保持简洁：

- 不做任何的业务逻辑操作
- 不做任何的参数、业务校验，参数校验只允许使用@Valid 注解做简单的校验
- 不做任何的数据组合、拼装、赋值等操作

正例：
```java
@ApiOperation("添加部门 @author 哪吒")
    @PostMapping("/department/add")
    public ResponseDTO<String> addDepartment(@Valid @RequestBody DepartmentCreateDTO departmentCreateDTO) {
        return departmentService.addDepartment(departmentCreateDTO);
    }
}
```

5）只能在 controller 层获取当前请求用户，并传递给 service 层。

> 因为获取当前请求用户是从 ThreadLocal 里获取的，在 service、manager、dao 层极有可能是其他非 request 线程调用，会出现 null 的情况，尽量避免

```java
@ApiOperation("添加员工 @author yandanyang")
    @PostMapping("/employee/add")
    public ResponseDTO<String> addEmployee(@Valid @RequestBody EmployeeAddDTO employeeAddDTO) {
        LoginTokenBO requestToken = SmartRequestTokenUtil.getRequestUser();
        return employeeService.addEmployee(employeeAddDTO, requestToken);
    }
```

### 3、 service 层规范
1）合理拆分 service 文件，如果业务较大，请拆分为多个 service。  

如订单业务,所有业务都写到 OrderService 中会导致文件过大，故需要进行拆分如下：  

- OrderQueryService 订单查询业务
- OrderCreateService 订单新建业务
- OrderDeliverService 订单发货业务
- OrderValidatorService 订单验证业务

2）谨慎处理 @Transactional 事务注解的使用，不要简单对 service 的方法添加个 @Transactional 注解就觉得万事大吉了。应当合并对数据库的操作，尽量减少添加了@Transactional方法内的业务逻辑。
@Transactional 注解内的 rollbackFor 值必须使用异常的基类 Throwable.class  
> 对于@Transactional 注解，当 spring 遇到该注解时，会自动从数据库连接池中获取 connection，并开启事务然后绑定到 ThreadLocal 上，如果业务并没有进入到最终的 操作数据库环节，那么就没有必要获取连接并开启事务，应该直接将 connection 返回给数据库连接池，供其他使用（比较难以讲解清楚，如果不懂的话就主动去问）。  

反例：
```java
@Transactional(rollbackFor = Throwable.class)
    public ResponseDTO<String> upOrDown(Long departmentId, Long swapId) {
        // 验证 1
        DepartmentEntity departmentEntity = departmentDao.selectById(departmentId);
        if (departmentEntity == null) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.NOT_EXISTS);
        }
        // 验证 2
        DepartmentEntity swapEntity = departmentDao.selectById(swapId);
        if (swapEntity == null) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.NOT_EXISTS);
        }
        // 验证 3
        Long count = employeeDao.countByDepartmentId(departmentId)
        if (count != null && count > 0) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.EXIST_EMPLOYEE);
        }
        // 操作数据库 4
        Long departmentSort = departmentEntity.getSort();
        departmentEntity.setSort(swapEntity.getSort());
        departmentDao.updateById(departmentEntity);
        swapEntity.setSort(departmentSort);
        departmentDao.updateById(swapEntity);
        return ResponseDTO.succ();
    }
}
```

以上代码前三步都是使用 connection 进行验证操作，由于方法上有@Transactional 注解，所以这三个验证都是使用的同一个 connection。  

若对于复杂业务、复杂的验证逻辑，会导致整个验证过程始终占用该 connection 连接，占用时间可能会很长，直至方法结束，connection 才会交还给数据库连接池。  

对于复杂业务的不可预计的情况，长时间占用同一个 connection 连接不是好的事情，应该尽量缩短占用时间。  

正例：
```java
DepartmentService.java

    public ResponseDTO<String> upOrDown(Long departmentId, Long swapId) {
        DepartmentEntity departmentEntity = departmentDao.selectById(departmentId);
        if (departmentEntity == null) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.NOT_EXISTS);
        }
        DepartmentEntity swapEntity = departmentDao.selectById(swapId);
        if (swapEntity == null) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.NOT_EXISTS);
        }
        Long count = employeeDao.countByDepartmentId(departmentId)
        if (count != null && count > 0) {
            return ResponseDTO.wrap(DepartmentResponseCodeConst.EXIST_EMPLOYEE);
        }
        departmentManager.upOrDown(departmentSort,swapEntity);
        return ResponseDTO.succ();
    }


    DepartmentManager.java

    @Transactional(rollbackFor = Throwable.class)
    public void upOrDown(DepartmentEntity departmentEntity ,DepartmentEntity swapEntity){
        Long departmentSort = departmentEntity.getSort();
        departmentEntity.setSort(swapEntity.getSort());
        departmentDao.updateById(departmentEntity);
        swapEntity.setSort(departmentSort);
        departmentDao.updateById(swapEntity);
    }

}
```

将数据在 service 层准备好，然后传递给 manager 层，由 manager 层添加@Transactional 进行数据库操作。   

3）需要注意的是：注解 @Transactional 事务在类的内部方法调用是不会生效的  

反例：如果发生异常，saveData方法上的事务注解并不会起作用
```java
@Service
public class OrderService{

    public void createOrder(OrderCreateDTO createDTO){
        this.saveData(createDTO);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void saveData(OrderCreateDTO createDTO){
        orderDao.insert(createDTO);
    }
}
```

> spring采用动态代理(AOP)实现对bean的管理和切片，它为我们的每个class生成一个代理对象。只有在代理对象之间进行调用时，可以触发切面逻辑。而在同一个class中，方法A调用方法B，调用的是原对象的方法，而不通过代理对象。所以Spring无法拦截到这次调用，也就无法通过注解保证事务了。简单来说，在同一个类中的方法调用，不会被方法拦截器拦截到，因此事务不会起作用。  

解决方案：  
a. 可以将方法放入另一个类，如新增 manager层，通过spring注入，这样符合了在对象之间调用的条件。  

b. 启动类添加 @EnableAspectJAutoProxy(exposeProxy = true)，方法内使用AopContext.currentProxy()获得代理类，使用事务  

```java  
SpringBootApplication.java

@EnableAspectJAutoProxy(exposeProxy = true)
@SpringBootApplication
public class SpringBootApplication {}

OrderService.java

public void createOrder(OrderCreateDTO createDTO){
    OrderService orderService = (OrderService)AopContext.currentProxy();
    orderService.saveData(createDTO);
}
```

4）service是具体的业务处理逻辑服务层，尽量避免将web层某些参数传递到service中。  
反例：
```java
public ResponseDTO<String> handlePinganRequest(HttpServletRequest request){
    InputStreamReader inputStreamReader = new InputStreamReader(request.getInputStream(), "GBK");
    BufferedReader reader = new BufferedReader(inputStreamReader);
    StringBuilder sb = new StringBuilder();
    String str;
    while ((str = reader.readLine()) != null) {
        sb.append(str);
    }
    if(!JSON.isValid(msg)){
      return ResponseDTO.wrap(ResponseCodeConst.ERROR_PARAM);
    }
    PinganMsgDTO PinganMsgDTO = JSON.parseObject(msg,PinganMsgDTO.class);
    // 示例结束
}
```

反例中出现的问题：  
- 反例中把 HttpServletRequest 传递到service中，是为了获取Request流中的字符信息，然后才是真正的业务处理。按照分层的初衷：将代码、业务逻辑解耦，正确的做法应该是handlePinganRequest方法将String字符作为参数直接处理业务，将从Request中获取字符的操作放入controller中。
- 另一个坏处是不方便做单元测试，还得一个new一个HttpServletRequest并制造一个InputStream，然而这样做并不能模拟到真实的业务情景及数据。

### 4、 manager 层规范
manager 层的作用(引自《阿里 java 手册》)：  
- 对第三方平台封装的层，预处理返回结果及转化异常信息；
- 对 Service 层通用能力的下沉，如缓存方案、中间件通用处理；
- 与 DAO 层交互，对多个 DAO 的组合复用。

个人认为，该层也不是必须的，如果你觉得业务逻辑都写在service就可以，那就是可以，哈哈。
### 5、 dao 层规范
优先使用 mybatis-plus 框架。如果需要多个数据源操作的，可以选择使用 SmartDb 框架。

a.所有 Dao 继承自 BaseMapper  

b.禁止使用 Mybatis-plus 的 Wrapper 条件构建器  

c.禁止直接在 mybatis xml 中写死常量，应从 dao 中传入到 xml 中  

d.建议不要使用星号 * 代替所有字段  

正例：
```java
NoticeDao.java

    Integer noticeCount(@Param("sendStatus") Integer sendStatus);
---------------------------------------------
    NoticeMapper.xml

    <select id="noticeCount" resultType="integer">
        select
        count(1)
        from t_notice
        where
        send_status = #{sendStatus}
    </select>

}
```

反例：
```java
NoticeDao.java

    Integer noticeCount();
---------------------------------------------
    NoticeMapper.xml

    <select id="noticeCount" resultType="integer">
        select
        count(1)
        from t_notice
        where
        send_status = 0
    </select>
```

 dao层方法命名规范  
- 获取单个对象的方法用 get 做前缀。
- 获取多个对象的方法用 list 做前缀。
- 获取统计值的方法用 count 做前缀。
- 插入的方法用 save/insert 做前缀。
- 删除的方法用 remove/delete 做前缀。
- 修改的方法用 update 做前缀。
建议：dao层方法命名尽量以sql语义命名，避免与业务关联。

正例：
```
List<PerformanceDTO> listByMonthAndItemId(@Param("month") String month, @Param("itemId") Integer itemId);
```

反例：
```
List<PerformanceDTO> getInternalData(@Param("month") String month, @Param("itemId") Integer itemId);
```

反例中出现的不规范操作：  

- get代表单个查询，批量查询的应该 list 开头。  
- 命名与业务关联，局限了dao方法的使用场景和范围，降低了方法的复用性，造成他人困惑以及重复造轮子。  


### 6、boolean类型的属性命名规范  
> 类中布尔类型的变量，都不要加is，否则部分框架解析会引起序列化错误。反例：定义为基本数据类型 Boolean isDeleted；的属性，它的方法也是 isDeleted()，RPC在反向解析的时候，“以为”对应的属性名称是 deleted，导致属性获取不到，进而抛出异常。

这是阿里巴巴开发手册中的原文，我们团队的规定是：boolean 类型的类属性和数据表字段都统一使用 flag 结尾。虽然使用 isDeleted，is_deleted 从字面语义上更直观，但是比起可能出现的潜在错误，这点牺牲还是值得的。  

正例： 
```
deletedFlag，deleted_flag，onlineFlag，online_flag
```

## 四、数据库规范
### 1、建表规范
表必备三字段：id, create_time, update_time

- id 字段 Long 类型，单表自增，自增长度为 1
- create_time 字段 datetime 类型，默认值 CURRENT_TIMESTAMP
- update_time 字段 datetime 类型，默认值 CURRENT_TIMESTAMP, On update CURRENT_TIMESTAMP

### 2、枚举类表字段注释需要将所有枚举含义进行注释

修改或增加字段的状态描述，必须要及时同步更新注释。  
如下表的 sync_status 字段 同步状态 0 未开始 1同步中 2同步成功 3失败。  
正例：
```
CREATE TABLE `t_change_data` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`sync_status` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '同步状态 0 未开始 1同步中 2同步成功 3失败',
	`sync_time` DATETIME NULL DEFAULT NULL COMMENT '同步时间',
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`update_time` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`change_data_id`)
)
```

反例：
```
CREATE TABLE `t_change_data` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`sync_status` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '同步状态 ',
	`sync_time` DATETIME NULL DEFAULT NULL COMMENT '同步时间',
	`create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`update_time` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`change_data_id`)
)
```

### 3、合理结合业务给表字段添加索引和唯一索引

具体索引规范请参照《阿里巴巴 Java 开发手册》索引规约  

## 五、其他 
### 1、代码提交规范

- 提交前应该冷静、仔细检查一下，确保没有忘记加入版本控制或不应该提交的文件。
- 提交前应该先编译一次（idea里ctrl+F9），防止出现编译都报错的情况。
- 提交前先更新pull一次代码，提交前发生冲突要比提交后发生冲突容易解决的多。
- 提交前检查代码是否格式化，是否符合代码规范，无用的包引入、变量是否清除等等。
- 提交时检查注释是否准确简洁的表达出了本次提交的内容。

### 2、maven项目
- pom禁止出现相同 groupId，artifactId 的依赖配置。
- 项目名称应该与 artifactId 保持一致。
- 定期检查jar包依赖关系，及时排除解决冲突的jar包。

### 3、保持项目整洁
- 使用git，必须添加 .gitignore 忽略配置文件。
- 不要提交与项目无关的内容文件：idea配置、target包等。


## 参考资料
原文链接：https://www.cnblogs.com/lovemelucky/p/15235062.html  
原作者：爱我的幸运
整理：代码小郭

