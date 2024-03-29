---
# icon: lock
date: 2023-07-05
category:
  - 编程规约
---

# 项目分层结构
> 这里以SpringBoot项目为例子
 
每个人、每个开发团队的规范习惯都不太一样，没有固定标准，合适的才是最好的。这里记录下我习惯的一种springboot项目分层方式

```
也不是固定死模板，在实际开发中要学会做适当的加减法
源码已上传到github：https://github.com/CodingGyd/spring-demo/  会不定时迭代
```

## 一、初学时简单分层-单个module
初学时一般都是一些简单项目，单个module即可满足需求，该module内划分如下：

 <img src="http://cdn.gydblog.com/images/combined/layered-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
 <img src="http://cdn.gydblog.com/images/combined/layered-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 1、controller层
controller层是用来接受前端提交的数据并调用一个或多个service层接口执行，返回请求结果的。该层一般不能包含任何业务处理逻辑，通常在该层做一些系统级别的参数校验、鉴权、限流、入参出参打印、耗时统计等切面拦截。 controller层应该只是一个转发者，不能包含太重的处理逻辑！

```java
package com.gyd.contoller;

import com.gyd.dto.UserDto;
import com.gyd.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
@Api(tags="用户数据操作相关接口")
public class UserController {

    @Autowired
    private UserService service;

    @ApiOperation("新增用户接口")
    @PostMapping("/save")
    public boolean save(@ApiParam @RequestBody UserDto data){
        return service.save(data);
    }

    @ApiOperation("查询用户列表接口")
    @PostMapping("/queryAll")
    public List<String> query(){
        return service.queryAll();
    }

}

```

### 2、service层

service层接收controller层的请求参数，并实现具体的业务复杂逻辑，service层也会调用多个mapper层与数据库进行交互，或者调用其他依赖服务进行数据的增删改查操作。 一个controller层会对应多个service层的具体实现。

```java
package com.gyd.service.impl;

import com.gyd.dto.UserDto;
import com.gyd.entity.UserEntity;
import com.gyd.mapper.UserMapper;
import com.gyd.service.UserService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserMapper mapper;

    @Override
    public boolean save(UserDto request) {
        UserEntity entity = new UserEntity();
        entity.setAge(request.getAge());
        entity.setLastName(request.getLastName());
        entity.setFirstName(request.getFirstName());
        mapper.insert(entity);
        System.out.println("插入一条用户数据记录");
        return true;
    }

    @Override
    public List<String> queryAll() {
        return mapper.findAllFirstName();
    }
}
```

### 3、mapper层

mapper层是持久化层，负责和数据库进行交互，定义了具体的增删改查sql。在mybatis中mapper方法主要与与xxx.xml内相互一一映射。
```java
package com.gyd.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gyd.entity.UserEntity;
import org.apache.ibatis.annotations.*;
import java.util.List;

//继承 mybatis-plus 的 BaseMapper<T> 后，无需编写 mapper.xml 文件，即可获得CRUD功能
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {
     @Select("SELECT distinct first_name from user_info")
     public List<String> findAllFirstName();
}
```

### 4、entity层

entity层创建实体类，和数据库表里面属性值一一对应。实现set和get的方法。

```java
package com.gyd.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName(value = "user_info")
public class UserEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String firstName;
    private String lastName;
    private Integer age;

    //getter setter方法略
}
```

### 5、dto层

dto层主要负责定义服务之间交互的实体类，大部分情况下和entity层保持一致。也会存在一些聚合结构或者字段转换后的定义，主要用于业务处理后生成的数据结构定义或者服务与服务之间接口传输参数的定义, 有时候也会直接返回给前端用于展示

```java
package com.gyd.dto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "用户信息实体")
 public class UserDto {
    private Integer id;
    @ApiModelProperty(value = "姓")
    private String firstName;
    @ApiModelProperty(value = "名")
    private String lastName;
    @ApiModelProperty(value = "年龄")
    private Integer age;

    //getter setter方法略
 }
```

### 6、vo层

vo层主要负责定义前端展示的实体结构，一般是通过dto转换而来，非必须存在，我认为只要存在dto和vo结构一模一样时，就不需要定义一个多余的vo对象了，可以直接用dto替代vo返回给到前端。
```java
@Data//Data注解代替了get和set方法
public class DataVo {
    private Integer id;
    private String data;
}
```

### 7、validator层

validator层主要用于校验参数，参数分为系统级别参数和业务参数，都统一在这一层做具体实现。能够很好的避免在service层出现大量的ifelse判断。
```java
public class XXXValidator {
    
    public void checkParam(String param) {
        if (null == param){
            throw new RuntimeException("参数不能为空");
        }
    }
}
```


### 8、util层

util层主要用于定义各种工具类，如日期操作、数值操作、字符串操作等。
示例：
```java
/**
 * 用于高精确处理常用的数学运算
 */
public class ArithmeticUtils {
    //默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */

    public static double add(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }
}
```

### 9、constant层
constant层主要用于定义项目中用到的所有常量，如配置项名称、字段名称等。
示例：
```java
public class xxxconstants {
    //接口请求超时实际
    public static final int TIME_OUT = 100;
}
```



### 10、config层
config层主要用于定义启动时的一些自动化配置项
示例：
> 引入swagger自动化接口文档
```java
package com.gyd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {
    @Bean
    public Docket docket(){
        return new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo()).enable(true)
                .select()
                //apis： 添加swagger接口提取范围
                .apis(RequestHandlerSelectors.basePackage("com.gyd"))
                //.apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("SpringBoot脚手架项目接口文档")
                .description("这里是项目描述信息")
                .contact(new Contact("代码小郭", "url", "964781872@qq.com"))
                .version("1.0")
                .build();
    }
}
```

## 二、进阶多模块分层-多个module
 <img src="http://cdn.gydblog.com/images/combined/layered-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
主要分成以下几层来划分module：
```
控制层：xxx-controller 
服务层：xxx-service 
数据层：xxx-dao 
门面层：xxx-facade
接口层：xxx-api
工具层：xxx-util 
公共层：xxx-common 
配置层：xxx-config
领域层：xxx-domain 
网关层：xxx-gateway 
启动层：xxx-boot
```

### 1、门面层(facade)

设计模式中有一种Facade模式，称为门面模式或者外观模式。这种模式提供一个简洁对外语义，屏蔽内部系统复杂性。  

facade服务实现可以作为RPC提供服务。例如对外作为服务提供者提供一系列dubbo接口。

### 2、控制层(controller)

facade服务实现可以作为RPC提供服务，controller则作为本项目HTTP接口提供服务，供前端调用。  
controller层需要注意HTTP相关特性，敏感信息例如登陆用户ID不能依赖前端传递，登陆后前端会在请求头带一个登陆用户信息，服务端需要从请求头中获取并解析。  


### 3、服务层(service)

服务层负责业务逻辑的具体实现，通常是我们在工作中花费时间编码最多的地方。 服务层通常是实现api层接口定义，为controller层提供服务。
我一般习惯按模块划分不同业务的service：
```
src
|-- module                         所有业务模块
|-- |-- role                          业务模块
|-- |-- |--XXX1Service.java                 service
|-- |-- |--XXX2Service.java                 service
|-- |-- employee                      员工模块
|-- |-- login                         登录模块
|-- |-- email                         邮件模块
|-- |-- ....                          其他
```
当然，你也可以写在一个包下面，没有硬性标准，看团队和个人习惯了。


### 4、数据层(dao)

数据层负责和数据库进行交互，通常是定义和表对应的xxxmapper类，通过领域层定义的实体对象来操作数据库的增删改查。

### 5、接口层(api)

接口层主要定义一些服务层需要实现的接口。一般需要依赖领域层定义的一些实体对象。
 
### 6、工具层(util)

工具层承载工具代码，例如日期操作工具、数值操作工具、字符串操作工具、加解密工具等。不依赖本项目其它模块，只依赖一些通用工具包。

### 7、公共层(common)
公共层主要定义一些公共代码，可以被其他层引用,例如各种常量定义。
```
src 源码目录
|-- common 各个项目的通用类库
|-- |--- anno          通用注解，比如权限，登录等等
|-- |--- constant      通用常量，比如 ResponseCodeConst
|-- |--- domain        全局的 javabean，比如 BaseEntity,PageParamDTO 等
|-- |--- exception     全局异常，如 BusinessException
|-- |--- json          json 类库，如 LongJsonDeserializer，LongJsonSerializer
|-- |--- swagger       swagger 文档
|-- |--- validator     适合各个项目的通用 validator，如 CheckEnum，CheckBigDecimal 等
```

### 8、配置层(config)  
config 目录用于存放各个项目通用的项目，由各个项目按需引入并使之生效(注解方式或者xml注入方式均可)，但是又可以依照项目进行特定的修改。
```
src                               源码目录
|-- config                            项目的所有配置信息
|-- |--- MvcConfig                    mvc的相关配置，如interceptor,filter等
|-- |--- DataSourceConfig             数据库连接池的配置
|-- |--- MybatisConfig                mybatis的配置
|-- |--- ....                         其他
```

### 9、领域层(domain)

领域层是DDD流行兴起的概念，该层主要定义数据对象、业务传输对象、视图对象。  

数据对象：xxxEntity  和具体的表对应。  
业务传输对象： xxxDto  和具体的业务操作实体对应 ，一般用于服务与服务之间接口交互。  
视图对象：xxxVo 由dto聚合而来，一般和前端页面对应，用于controller层返回给前端展示数据,但很多时候开发人员会直接将dto返回给前端，省去vo和dto转换的代码，这也影响不大，看团队习惯吧。  


领域层的各种对象命名规范
**1） javabean 的整体要求：**
- 不得有任何的业务逻辑或者计算
- 基本数据类型必须使用包装类型（Integer, Double、Boolean 等）
- 不允许有任何的默认值
- 每个属性必须添加注释，并且必须使用多行注释。
- 必须使用 lombok 简化 getter/setter 方法
- 建议对象使用 lombok 的 @Builder ，@NoArgsConstructor，同时使用这两个注解，简化对象构造方法以及set方法。

正例：
```java
@Builder
@NoArgsConstructor
@Data
public class DemoDTO {

    private String name;
    
    private Integer age;
}

// 使用示例：

DemoDTO demo = DemoDTO.builder()
                .name("yeqiu")
                .age(66)
                .build();
```


**2）数据对象；XxxxEntity，要求：**  
- 以 Entity 为结尾（阿里是为 DO 为结尾）
- Xxxx 与数据库表名保持一致
- 类中字段要与数据库字段保持一致，不能缺失或者多余
- 类中的每个字段添加注释，并与数据库注释保持一致
- 不允许有组合
- 项目内的日期类型必须统一，建议使用 java.util.Date，java.sql.Timestamp，java.time.LocalDateTime 其中只一。


**3）传输对象；XxxxDTO，要求：**
- 不可以继承自 Entity
- DTO 可以继承、组合其他 DTO，VO，BO 等对象
- DTO 只能用于前端、RPC 的请求参数

**4）视图对象；XxxxVO，要求：**
- 不可继承自 Entity
- VO 可以继承、组合其他 DTO，VO，BO 等对象
- VO 只能用于返回前端、rpc 的业务数据封装对象  

**5）业务对象 BO，要求：**
- 不可以继承自 Entity
- BO 对象只能用于 service，manager，dao 层，不得用于 controller 层

### 10、网关层(gateway)

网关层主要用于管理和外部http服务的交互逻辑。比如我要调用一个用户服务查询用户信息，就可以在该层编写具体的代码。外部交互统一在该层处理能极大方便我们统一做降级、限流等兜底处理。

### 11、启动层(boot)

启动层主要用于放启动入口，启动整个项目，包含项目启动必须的各类配置文件。





## 三、进阶-微服务工程结构

如今的互联网公司技术部门通常会采用微服务架构方式协作开发业务需求，划分不同的业务单元，每个业务单元都由某个部门或者部门下的某个小组负责具体应用开发迭代，
所有业务单元的应用都通过统一的网关对外业务服务，同时每个应用都会统一注册到注册中心提供互相之间的服务注册发现和接口交互。通常情况还会有一个统一的分布式配置中心，所有应用的业务配置项会在这个分布式配置中心进行维护更新。

上面谈到的网关、注册中心、配置中心等组件一般也都是由架构角色来进行技术选型，并且交由公司内部专业的运维人员来维护（小公司例外）。

至于每个业务单元下具体某个应用内的工程结构就由具体的部门或小组自行定义了，这里定义参考的标准一般就是公司级别的开发规范以及部门内部自己的开发规范了。 

![微服务架构-图片来源于网络](http://cdn.gydblog.com/images/combined/layered-3.jpg)

上面示例图是一个简单的微服务架构，实际企业生产环境的微服务架构远比这个要复杂，而且每个企业的方式都不太一样。

 