---
# icon: lock
date: 2018-01-05
---

# 单元测试入门

参考资料：https://juejin.cn/post/7203143824012804157#heading-0
## 单元测试目的

单元测试是用来验证使用既定的入参输入给定程序，该程序是否输出符合预期的出参。  

单元测试只针对某个小的功能点进行测试，不包括对整个业务流程进行测试。一般我们习惯用单元测试对给定方法、代码段进行小范围的功能验证，覆盖范围比较小。

做单元测试时必须对依赖的组件、接口、服务等周边环境进行屏蔽(MOCK)

## 单元测试标准
一个好的单元测试用例应该符合以下标准：
:::tip 单元测试标准
- 1.区别于接口测试，单测主要测试对象为类方法。大多数测试单例应该是围绕方法或代码片段展开，不包含调用的别的类方法的内容。

- 2、由于代码书写美观要求，大多数方法比较简洁，主要内容都是抽出的，转而调用别的类方法，此情况下在定义测试范围时，可适量加入别的类方法，注意别的类必须在当前spring容器中

- 3、服务依赖组件的调用都使用mock，比如数据库、redis、mq等等；测试启动的组件只可以包含spring容器，不可受数据库、mq等服务外的组件影响。
  换句话说，单元测试用例在没有外界组件情况下只需要jvm即可运行

- 4、服务之间的调用，如接口http接口、dubbo接口和socket调用等，都必须使用mock进行调用，调用参数可用mock参数校验器校验
:::

## 单元测试框架
常见的有junit、mockito、easymock，本文以springboot+mockito+junit来说明如何写单元测试。

## springboot应用的单元测试
> 下面是一个简单的例子，使用mybatis-plus实现一个数据查询的功能，在service层通过mapper与数据库交互。

- 1）引入junit、mockito的maven依赖
> 由于是springboot应用，可以直接引入springboot官方提供的测试相关的starter即可，该starter中封装好了对junit和mockito的依赖。

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <version>2.2.13</version>
</dependency>
```
- 2）数据库操作mapper类

DemoMapper.java: 
```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gyd.entity.IdRuleEntity;

public interface DemoMapper extends BaseMapper<IdRuleEntity> {
}
```

- 3）写一个业务逻辑类:  
```java
@Service
public class DemoService {
    @Autowired
    private DemoMapper mapper;

    public IdRuleEntity queryIdRule(Long id){
        QueryWrapper<IdRuleEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id",id);
        return mapper.selectOne(queryWrapper);
    }
}

public class IdRuleEntity {
    private Long id;
}
```

- 4）使用junit+mockito框架编写单元测试:  
```java
import com.gyd.entity.IdRuleEntity;

import com.gyd.mapper.DemoMapper;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;


/**
 * @ClassName IdRuleServiceTest
 * @Description TODO
 * @Author guoyading
 * @Date 2023/8/3 14:09
 * @Version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@SpringBootTest(classes = MainApplication.class)
public class IdRuleServiceTest  {

    @InjectMocks
    DemoService demoService;

    @Mock
    DemoMapper mapper;

    @Before
    public void setUp(){
    }

    @Test
    public void testQuery() {
        //mock数据
        IdRuleEntity idRule = new IdRuleEntity();
        idRule.setCurrentId(1L);
        idRule.setId(1L);
        idRule.setOperator("admin1");

        //mock操作
        Mockito.when(mapper.selectOne(Mockito.any())).thenReturn(idRule);

        //目标方法调用
        IdRuleEntity idRule2 = demoService.queryIdRule(1L);
        //结果是否符合预期
        Assert.assertEquals(idRule, idRule2);

        System.out.println("测试执行成功");
    }

    @After
    public void setDown(){
        System.out.println("后置动作");
    }
}
```

- 5）执行测试用例，输出结果如下：
<img src="http://cdn.gydblog.com/images/java/test/unit-test-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


上述代码演示了和数据库交互的业务流程，数据库交互使用mybatis-plus框架实现的mapper类进行CRUD操作，然后实现一个业务service类对mapper进行调用， 单元测试时对数据库依赖的真正执行进行了mock，返回了mock数据。


 
//遗留问题：在使用针对mybatis-plus的链式调用代码时，  mockito使用报错，怎么办？



