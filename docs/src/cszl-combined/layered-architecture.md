---
# icon: lock
date: 2023-07-05
category:
  - Springboot的项目分层
tag:
  - Springboot的项目分层
---

# Springboot的项目分层
每个人、每个开发团队的规范习惯都不太一样，没有固定标准，合适的才是最好的。这里记录下我习惯的一种springboot项目分层方式

## 初学时简单分层-单个module
初学时一般都是一些简单项目，单个module即可满足需求，该module内划分如下：

 <img src="/images/cszl-combined/layered-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
 <img src="/images/cszl-combined/layered-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### controller层
controller层是用来接受前端提交的数据并调用一个或多个service层接口执行，返回请求结果的。该层一般不能包含任何业务处理逻辑，通常在该层做一些系统级别的参数校验、鉴权、限流、入参出参打印、耗时统计等切面拦截。 controller层应该只是一个转发者，不能包含太重的处理逻辑！

```java

@RestController
@RequestMapping("/api")
public class ApiController {
 
    @Autowired
    private ApiService apiService;
    
    @GetMapping("/select")
    public List<String> index(){
        return apiService.query();
    }
 
    @PostMapping("/insert")
    public boolean save(@RequestBody String data){
        return apiService.save(data);
    }
 
    @DeleteMapping("/{id}")
    public Integer delete(@PathVariable Integer id){
        return apiService.deleteById(id);
    } 
}
```

### service层

service层接收controller层的请求参数，并实现具体的业务复杂逻辑，service层也会调用多个mapper层与数据库进行交互，或者调用其他依赖服务进行数据的增删改查操作。 一个controller层会对应多个service层的具体实现。

```java
public class ApiServiceImpl extends ApiService {
    @Autowired
    private ApiMapper mapper;

        public boolean save(String data) {
            if(data == "1"){
            return mapper.save(user);//mapper层的实现 
            }else{
            return mapper.update(data);
        }
} 
```

### mapper层

mapper层是持久化层，负责和数据库进行交互，定义了具体的增删改查sql。在mybatis中mapper方法主要与与xxx.xml内相互一一映射。
```java
@Mapper
public interface ApiMapper extends BaseMapper<String> {//数据库查询接口，专门用来跟数据库交互用的
    @Select("SELECT xx from api_data")
    public List<String> findAll();
 
    List<User> findAll1();
    @Insert("INSERT into api_data(xx)VALUES(#{data};")
    public int insert(String data);
 
    public int update(String data);
 
    @Delete("delete from api_data where id = #{id}")
    public Integer deleteById(@Param("id") Integer id); 
```

### entity层

entity层创建实体类，和数据库表里面属性值一一对应。实现set和get的方法。

```java
@Data//Data注解代替了get和set方法
@TableName(value = "table_xxx")
public class DataEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String data;
}
```

### dto层

dto层主要负责定义服务之间交互的实体类，大部分情况下和entity层保持一致。也会存在一些聚合结构或者字段转换后的定义，主要用于业务处理后生成的数据结构定义或者服务与服务之间接口传输参数的定义, 有时候也会直接返回给前端用于展示

```java
@Data//Data注解代替了get和set方法
public class DataDto {
    private Integer id;
    private String data;
}
```

### vo层

vo层主要负责定义前端展示的实体结构，一般是通过dto转换而来，非必须存在，我认为只要存在dto和vo结构一模一样时，就不需要定义一个多余的vo对象了，可以直接用dto替代vo返回给到前端。
```java
@Data//Data注解代替了get和set方法
public class DataVo {
    private Integer id;
    private String data;
}
```

### validator层

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


### util层

util层主要用于定义各种工具类，如日期操作、数值操作、字符串操作等。
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

## 进阶多模块分层-多个module
 <img src="/images/cszl-combined/layered-3.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
主要分成以下几层来划分module：
```
控制层：xxx-controller 
服务层：xxx-service 
数据层：xxx-dao 
门面层：xxx-facade
接口层：xxx-api
工具层：xxx-util 
公共层：xxx-common 
领域层：xxx-domain 
网关层：xxx-gateway 
启动层：xxx-boot
```

### 门面层(facade)

设计模式中有一种Facade模式，称为门面模式或者外观模式。这种模式提供一个简洁对外语义，屏蔽内部系统复杂性。  

facade服务实现可以作为RPC提供服务。例如对外作为服务提供者提供一系列dubbo接口。

### 控制层(controller)

facade服务实现可以作为RPC提供服务，controller则作为本项目HTTP接口提供服务，供前端调用。  
controller层需要注意HTTP相关特性，敏感信息例如登陆用户ID不能依赖前端传递，登陆后前端会在请求头带一个登陆用户信息，服务端需要从请求头中获取并解析。  


### 服务层(service)

服务层负责业务逻辑的具体实现，通常是我们在工作中花费时间编码最多的地方。 服务层通常是实现api层接口定义，为controller层提供服务。


### 数据层(dao)

数据层负责和数据库进行交互，通常是定义和表对应的xxxmapper类，通过领域层定义的实体对象来操作数据库的增删改查。

### 接口层(api)

接口层主要定义一些服务层需要实现的接口。一般需要依赖领域层定义的一些实体对象。
 
### 工具层(util)

工具层承载工具代码，例如日期操作工具、数值操作工具、字符串操作工具、加解密工具等。不依赖本项目其它模块，只依赖一些通用工具包。

### 公共层(common)

公共层主要定义一些公共代码，可以被其他层引用。

### 领域层(domain)

领域层是DDD流行兴起的概念，该层主要定义数据对象、业务传输对象、视图对象。  

数据对象：xxxEntity  和具体的表对应。  
业务传输对象： xxxDto  和具体的业务操作实体对应 ，一般用于服务与服务之间接口交互。  
视图对象：xxxVo 由dto聚合而来，一般和前端页面对应，用于controller层返回给前端展示数据。  


### 网关层(gateway)

网关层主要用于管理和外部http服务的交互逻辑。比如我要调用一个用户服务查询用户信息，就可以在该层编写具体的代码。外部交互统一在该层处理能极大方便我们统一做降级、限流等兜底处理。

### 启动层(boot)

启动层主要用于放启动入口，启动整个项目，包含项目启动必须的各类配置文件。



