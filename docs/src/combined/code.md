---
date: 2022-11-09
category:
  - 葵花宝典
star: true
---

# 代码轮子
> 更多实用代码轮子 <a href="https://github.com/CodingGyd/common-utils" text="戳这里！" target="_blank"></a>  
> excel导入导出组件 <a href="https://github.com/CodingGyd/excel-utils" text="戳这里！" target="_blank"></a>
> 

## 一、代码片段

### 1、参数校验

需要在pom引入相关依赖  
```java
	<dependency>
		<groupId>jakarta.validation</groupId>
		<artifactId>jakarta.validation-api</artifactId>
		<version>2.0.2</version>
	</dependency>
	<dependency>
		<groupId>org.hibernate</groupId>
		<artifactId>hibernate-validator</artifactId>
		<version>5.1.0.Final</version>
	</dependency>
	<dependency>
		<groupId>javax.el</groupId>
		<artifactId>javax.el-api</artifactId>
		<version>2.2.4</version>
	</dependency>
```
Jakarta就是Java更名之后的名称，官网https://beanvalidation.org/，Jakarta Bean Validation也就是Java Bean Validation，是一套Java的规范，它可以：
- 通过使用注解的方式在对象模型上表达约束 
- 以扩展的方式编写自定义约束
- 提供了用于验证对象和对象图的API
- 提供了用于验证方法和构造方法的参数和返回值的API
- 报告违反约定的集合
- 运行在Java SE，并且集成在Jakarta EE8中

Jakarta Bean Validation只是一套标准，我们需要使用其他组织机构提供的实现来进行验证，官方支持的为Hibernate Validator

如果是spring项目在参数上加上@Valid或@Validated即可，还可以在代码中通过工具类的方式主动调用，下面是封装好的工具类：
``` java
package com.codinggyd.utils;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Iterator;
import java.util.Set;


public class ValidatorUtils {
    private static ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();

    public ValidatorUtils() {
    }

    public static <T> void validate(T object, Class<?>... groups) {
        Validator validator = validatorFactory.getValidator();

        Set<ConstraintViolation<T>> errors = validator.validate(object, groups);
        if (errors.size() != 0) {
            StringBuilder builder = new StringBuilder();
            if (errors.size() > 6) {
                builder.append(String.format("校验未通过：共%d项错误</br>", errors.size()));
            } else {
                builder.append("校验不通过：**");
            }

            int i = 1;
            for(Iterator var5 = errors.iterator(); var5.hasNext(); ++i) {
                ConstraintViolation<T> error = (ConstraintViolation)var5.next();
                if (i > 6) {
                    builder.append("......");
                    break;
                }
                builder.append(error.getMessage()).append("**");
            }
            throw new RuntimeException(builder.toString());
        }
    }
}

```

使用实例：
```java
package com.codinggyd;

import com.codinggyd.utils.ValidatorUtils;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

public class User {

    @NotNull(message = "name不能为空！")
    private String name;

    @Digits(integer = 1,fraction = 10,message = "年龄不能大于10")
    private Integer age;

    public void setName(String name) {this.name = name;}

    public String getName() {return name;}

    public void setAge(Integer age) {this.age = age;}

    public Integer getAge() {return age;}

    public static void main(String[] args) {
        User user = new User();
        user.setAge(100);
        ValidatorUtils.validate(user);
    }
}

```

输出:
```java
INFO: HV000001: Hibernate Validator 5.1.0.Final
Exception in thread "main" java.lang.RuntimeException: 校验不通过：**name不能为空！**年龄不能大于10**
	at com.codinggyd.utils.ValidatorUtils.validate(ValidatorUtils.java:38)
	at com.codinggyd.User.main(User.java:27)
```

### 2、枚举校验
在业务系统开发中，离散的枚举值校验是非常有必要的。而Jakarta的javax.validation包提供了方便的自定义校验的入口，就是javax.validation.ConstraintValidator,我们可以通过自定义校验枚举类型方式实现离散值校验。

下面是一套校验工具，可以直接运用于项目中

**1) 定义一个校验注解，类似于@NotNull @Size等等那样**
```java
package com.codinggyd.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {EnumStringValidator.class})
@Documented
public @interface EnumStringValid {

    String message() default "";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    Class<?>[] target() default {};

    /**
     * 允许的枚举
     * @return
     */
    Class<? extends Enum<?>> enumClass();
}
```

**2) 自定义枚举校验处理类**

> 该类必须实现javax.validation.ConstraintValidator接口  
```java
package com.codinggyd.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;


/**
 * @description value值是String类型的枚举校验器
 */
public class EnumStringValidator implements ConstraintValidator<EnumStringValid,String> {

    private Class<? extends Enum> enumClass;

    @Override
    public void initialize(EnumStringValid enumStringValid) {
        enumClass = enumStringValid.enumClass();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || "".equals(value)) {
            return true;
        }

        EnumValidate[] enums = (EnumValidate[]) enumClass.getEnumConstants();
        if(enums ==null || enums.length == 0){
            return false;
        }

        return enums[0].existValidate(value);
    }
}
```

**3) 业务代码使用**
业务场景: 假设我需要校验性别类型参数是否在可选范围之内。

- a. 先定义一个枚举接口，所有需要被校验的业务枚举类都需要实现该接口的校验方法  

接口如下：
```java
package com.codinggyd.validator;

/**
 * @description 枚举值校验
 */
public interface EnumValidate<T> {

    /**
     * 校验枚举值是否存在
     */
    boolean existValidate(T value);

}
```

- b. 写一个业务枚举类，实现上面的枚举接口： 
```java
package com.codinggyd.validator;

/**
 * 性别类型
 */
public enum SexType implements EnumValidate<String> {
    MAN("1001","男"),
    WOMAN("1002","女"),
    UN_KNOW("1003","未知")
    ;

    SexType(String code, String name){
        this.code = code;
        this.name = name;
    }
    private String code;
    private String name;

    public String getCode() {
            return code;
        }

        public String getName() {
            return name;
        }

    @Override
    public boolean existValidate(String value) {
        if (value == null || "".equals(value)) {
            return false;
        }

        for (SexType testEnum : SexType.values()) {
            if (testEnum.getCode().equalsIgnoreCase(value.trim())) {
                return true;
            }
        }
        return false;
    }
}

```

- c 实体类中定义性别属性，并加上自定义性别校验器  
```java
package com.codinggyd;

import com.codinggyd.utils.ValidatorUtils;
import com.codinggyd.validator.EnumStringValid;
import com.codinggyd.validator.SexType;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

public class User {

    @EnumStringValid(message = "性别类型输入错误", enumClass = SexType.class)
    private String sex;
    @NotNull(message = "name不能为空！")
    private String name;
    @Digits(integer = 1,fraction = 10,message = "年龄不能大于10")
    private Integer age;


    public void setName(String name) {this.name = name;}

    public String getName() {return name;}

    public void setAge(Integer age) {this.age = age;}

    public Integer getAge() {return age;}

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getSex() {
        return sex;
    }

}

```

- d 检查校验是否生效  
```java

    public static void main(String[] args) {
        User user = new User();
        user.setAge(9);
        user.setName("xx");
        user.setSex("1");
        ValidatorUtils.validate(user);
    }
```

输出结果如下：  
```java
Exception in thread "main" java.lang.RuntimeException: 校验不通过：**性别类型输入错误**
	at com.codinggyd.utils.ValidatorUtils.validate(ValidatorUtils.java:37)
	at com.codinggyd.User.main(User.java:41)
```



### 3、数值精确运算
```java
package com.codinggyd.utils;
import java.math.BigDecimal;

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

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
    public static BigDecimal add(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2);
    }

    /**
     * 提供精确的加法运算
     *
     * @param v1    被加数
     * @param v2    加数
     * @param scale 保留scale 位小数
     * @return 两个参数的和
     */
    public static String add(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static double sub(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    /**
     * 提供精确的减法运算。
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static BigDecimal sub(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2);
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1    被减数
     * @param v2    减数
     * @param scale 保留scale 位小数
     * @return 两个参数的差
     */
    public static String sub(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static BigDecimal mul(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2, int scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.multiply(b2).doubleValue(), scale);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static String mul(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
     * 小数点以后10位，以后的数字四舍五入
     *
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */

    public static double div(double v1, double v2) {
        return div(v1, v2, DEF_DIV_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double div(double v1, double v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示需要精确到小数点以后几位
     * @return 两个参数的商
     */
    public static String div(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v1);
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(double v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static String round(String v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(v);
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static String remainder(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.remainder(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数  BigDecimal
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static BigDecimal remainder(BigDecimal v1, BigDecimal v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        return v1.remainder(v2).setScale(scale, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 比较大小
     *
     * @param v1 被比较数
     * @param v2 比较数
     * @return 如果v1 大于v2 则 返回true 否则false
     */
    public static boolean compare(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        int bj = b1.compareTo(b2);
        boolean res;
        if (bj > 0)
            res = true;
        else
            res = false;
        return res;
    }
}
```


### 4、bean和map转换
需要在pom引入相关依赖：
```java
	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-core</artifactId>
		<version>5.2.12.RELEASE</version>
	</dependency>
```

```java
package com.codinggyd.utils;

import com.codinggyd.User;
import org.springframework.cglib.beans.BeanMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BeanMapUtils {
    public static <T> Map<String, ?> beanToMap(T bean) {
        BeanMap beanMap = BeanMap.create(bean);
        Map<String, Object> map = new HashMap<>();

        beanMap.forEach((key, value) -> {
            map.put(String.valueOf(key), value);
        });
        return map;
    }

    public static <T> Map<String, String> beanToMapStr(T bean) {
        BeanMap beanMap = BeanMap.create(bean);
        Map<String, String> map = new HashMap<>();

        beanMap.forEach((key, value) -> {
            map.put(String.valueOf(key), String.valueOf(value));
        });
        return map;
    }

    public static <T> T mapToBean(Map<String, ?> map, Class<T> clazz)
            throws IllegalAccessException, InstantiationException {
        T bean = clazz.newInstance();
        BeanMap beanMap = BeanMap.create(bean);
        beanMap.putAll(map);
        return bean;
    }

    public static <T> List<Map<String, ?>> objectsToMaps(List<T> objList) {
        List<Map<String, ?>> list = new ArrayList<>();
        if (objList != null && objList.size() > 0) {
            Map<String, ?> map = null;
            T bean = null;
            for (int i = 0, size = objList.size(); i < size; i++) {
                bean = objList.get(i);
                map = beanToMap(bean);
                list.add(map);
            }
        }
        return list;
    }

    public static <T> List<T> mapsToObjects(List<Map<String, ?>> maps, Class<T> clazz)
            throws InstantiationException, IllegalAccessException {
        List<T> list = new ArrayList<>();
        if (maps != null && maps.size() > 0) {
            Map<String, ?> map = null;
            for (int i = 0, size = maps.size(); i < size; i++) {
                map = maps.get(i);
                T bean = mapToBean(map, clazz);
                list.add(bean);
            }
        }
        return list;
    }

    public static void main(String[] args) {
        testBeanToMap();
        System.out.println("========");
        testMapToBean();
    }
    public static void testBeanToMap() {
        User user = new User();
        user.setName("testName");
        user.setAge(18);
        Map<String, ?> map = BeanMapUtils.beanToMap(user);
        System.out.println(map.get("name"));
        System.out.println(map.get("age"));

    }

    public static void testMapToBean() {
        Map<String, Object> map = new HashMap<>();
        map.put("age", 18);
        map.put("name", "testName");
        try {
            User userVo = BeanMapUtils.mapToBean(map, User.class);
            System.out.println(userVo.getName());
            System.out.println(userVo.getAge());
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch (InstantiationException e) {
            throw new RuntimeException(e);
        }
    }
}

```





## 二、开源组件
### 1、验证码

目前使用图片验证码较为广泛的是 Kaptcha ，Kaptcha 是一个Google开源、可自由配置的图片验证码生成工具。

它只有一个版本：2.3.2，值得注意的是，在 springboot 3的环境下，使用该插件包大部分会使用到的 http 包，不能导入 javax 包内的，而是应该导入jakarta 包内的。

它能够实现以下效果：水纹有干扰、鱼眼无干扰、水纹无干扰、阴影无干扰、阴影有干扰

![](https://gydblog.fsh.bcebos.com/images/zhencangziyuan/yzm.png)

**验证码的一般流程**

**后端：**

- 随机生成四位数字的验证码图片和数字
- 结合随机生成的UUID作为Key，验证码值作为Value保存验证码到Redis中
- 将UUID和验证码图片响应给用户，等用户提交后验证校验码是否有效

**前端：**

- 进入登录/注册页面时，获取验证码图片
- 对用户输入的验证码进行简单的规则校验
- 返回登录结果
- 提供刷新验证码的动作，防止出现用户难以辨识的识别码

**基本的使用步骤**

1. 导入POM依赖
2. 定义生成验证码图片时的一系列参数：图片的宽高、字符内容、干扰类型等
3. 调用com.google.code.kaptcha.impl.DefaultKaptcha#createText()创建验证码值
4. 调用com.google.code.kaptcha.impl.DefaultKaptcha#createText(kaptchaText)创建验证图片（BufferedImage）
5. 将图片BufferedImage转换为目标流

```
<dependency>
    <groupId>com.github.penggle</groupId>
    <artifactId>kaptcha</artifactId>
    <version>2.3.2</version>
      <exclusions>
        <exclusion>
          <groupId>javax.servlet</groupId>
          <artifactId>javax.servlet-api</artifactId>
        </exclusion>
      </exclusions>
</dependency>
```

**配置参数说明**

对于一张验证码图片来说，我们如何控制验证码图片的样式呢？这就是kaptcha提供的配置参数的意义。

- 首先，它本质是一张图片，所以将会涉及图片的边框、宽高、背景颜色
- 验证码是字符，这将会涉及到字体类型、字体大小、字体颜色、字体间距、字体数量
- 验证码的另一个重要功能是干扰，这将会涉及干扰类型、干扰样式

<table style="border-collapse: collapse; width: 444px; border-style: solid; margin-left: auto; margin-right: auto" border="1px">
<tbody>
<tr>
<td width="198">
<p>属性</p>
</td>
<td width="212">
<p>说明</p>
</td>
<td width="287">
<p>默认值</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.border</p>
</td>
<td width="212">
<p>图片边框，合法值：yes , no</p>
</td>
<td width="287">
<p>yes</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.border.color</p>
</td>
<td width="212">
<p>边框颜色，合法值： r,g,b (and optional alpha) 或者 white,black,blue.</p>
</td>
<td width="287">
<p>black</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.image.width</p>
</td>
<td width="212">
<p>图片宽</p>
</td>
<td width="287">
<p>200</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.image.height</p>
</td>
<td width="212">
<p>图片高</p>
</td>
<td width="287">
<p>50</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.producer.impl</p>
</td>
<td width="212">
<p>图片实现类</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.impl.DefaultKaptcha</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.impl</p>
</td>
<td width="212">
<p>文本实现类</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.text.impl.DefaultTextCreator</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.char.string</p>
</td>
<td width="212">
<p>文本集合，验证码值从此集合中获取</p>
</td>
<td width="287">
<p>abcde2345678gfynmnpwx</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.char.length</p>
</td>
<td width="212">
<p>验证码长度</p>
</td>
<td width="287">
<p>5</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.font.names</p>
</td>
<td width="212">
<p>字体</p>
</td>
<td width="287">
<p>Arial, Courier</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.font.size</p>
</td>
<td width="212">
<p>字体大小</p>
</td>
<td width="287">
<p>40px.</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.font.color</p>
</td>
<td width="212">
<p>字体颜色，合法值： r,g,b 或者 white,black,blue.</p>
</td>
<td width="287">
<p>black</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.textproducer.char.space</p>
</td>
<td width="212">
<p>文字间隔</p>
</td>
<td width="287">
<p>2</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.noise.impl</p>
</td>
<td width="212">
<p>干扰实现类</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.impl.DefaultNoise</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.noise.color</p>
</td>
<td width="212">
<p>干扰 颜色，合法值： r,g,b 或者 white,black,blue.</p>
</td>
<td width="287">
<p>black</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.obscurificator.impl</p>
</td>
<td width="212">
<p>图片样式：&lt;br /&gt;水纹 com.google.code.kaptcha.impl.WaterRipple &lt;br /&gt;</p>
<p>鱼眼 com.google.code.kaptcha.impl.FishEyeGimpy &lt;br /&gt;</p>
<p>阴影 com.google.code.kaptcha.impl.ShadowGimpy</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.impl.WaterRipple</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.background.impl</p>
</td>
<td width="212">
<p>背景实现类</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.impl.DefaultBackground</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.background.clear.from</p>
</td>
<td width="212">
<p>背景颜色渐变，开始颜色</p>
</td>
<td width="287">
<p>light grey</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.background.clear.to</p>
</td>
<td width="212">
<p>背景颜色渐变， 结束颜色</p>
</td>
<td width="287">
<p>white</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.word.impl</p>
</td>
<td width="212">
<p>文字渲染器</p>
</td>
<td width="287">
<p>com.google.code.kaptcha.text.impl.DefaultWordRenderer</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.session.key</p>
</td>
<td width="212">
<p>session key</p>
</td>
<td width="287">
<p>KAPTCHA_SESSION_KEY</p>
</td>
</tr>
<tr>
<td width="198">
<p>kaptcha.session.date</p>
</td>
<td width="212">
<p>session date</p>
</td>
<td width="287">
<p>KAPTCHA_SESSION_DATE</p>
</td>
</tr>
</tbody>
</table>



**配置类KaptchaConfig**

```java
package com.gydblog.base.config;

import com.google.code.kaptcha.text.impl.DefaultTextCreator;

import java.util.Random;

/**
 * 验证码文本生成器
 */
public class KaptchaTextCreator extends DefaultTextCreator {
    private static final String[] CNUMBERS = "0,1,2,3,4,5,6,7,8,9,10".split(",");

    @Override
    public String getText() {
        Integer result = 0;
        Random random = new Random();
        int x = random.nextInt(10);
        int y = random.nextInt(10);
        StringBuilder suChinese = new StringBuilder();
        int randomoperands = random.nextInt(3);
        if (randomoperands == 0) {
            result = x * y;
            suChinese.append(CNUMBERS[x]);
            suChinese.append("*");
            suChinese.append(CNUMBERS[y]);
        } else if (randomoperands == 1) {
            if ((x != 0) && y % x == 0) {
                result = y / x;
                suChinese.append(CNUMBERS[y]);
                suChinese.append("/");
                suChinese.append(CNUMBERS[x]);
            } else {
                result = x + y;
                suChinese.append(CNUMBERS[x]);
                suChinese.append("+");
                suChinese.append(CNUMBERS[y]);
            }
        } else {
            if (x >= y) {
                result = x - y;
                suChinese.append(CNUMBERS[x]);
                suChinese.append("-");
                suChinese.append(CNUMBERS[y]);
            } else {
                result = y - x;
                suChinese.append(CNUMBERS[y]);
                suChinese.append("-");
                suChinese.append(CNUMBERS[x]);
            }
        }
        suChinese.append("=?@" + result);
        return suChinese.toString();
    }
}
```



```java
package com.gydblog.base.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

import static com.google.code.kaptcha.Constants.*;

/**
 * 验证码配置
 */
@Configuration
public class CaptchaConfig {
    @Bean(name = "captchaProducer")
    public DefaultKaptcha getKaptchaBean() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        // 是否有边框 默认为true 我们可以自己设置yes，no
        properties.setProperty(KAPTCHA_BORDER, "yes");
        // 验证码文本字符颜色 默认为Color.BLACK
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_COLOR, "black");
        // 验证码图片宽度 默认为200
        properties.setProperty(KAPTCHA_IMAGE_WIDTH, "160");
        // 验证码图片高度 默认为50
        properties.setProperty(KAPTCHA_IMAGE_HEIGHT, "60");
        // 验证码文本字符大小 默认为40
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_SIZE, "38");
        // KAPTCHA_SESSION_KEY
        properties.setProperty(KAPTCHA_SESSION_CONFIG_KEY, "kaptchaCode");
        // 验证码文本字符长度 默认为5
        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_LENGTH, "4");
        // 验证码文本字体样式 默认为new Font("Arial", 1, fontSize), new Font("Courier", 1, fontSize)
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_NAMES, "Arial,Courier");
        // 图片样式 水纹com.google.code.kaptcha.impl.WaterRipple 鱼眼com.google.code.kaptcha.impl.FishEyeGimpy 阴影com.google.code.kaptcha.impl.ShadowGimpy
        properties.setProperty(KAPTCHA_OBSCURIFICATOR_IMPL, "com.google.code.kaptcha.impl.ShadowGimpy");
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }

    @Bean(name = "captchaProducerMath")
    public DefaultKaptcha getKaptchaBeanMath() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        // 是否有边框 默认为true 我们可以自己设置yes，no
        properties.setProperty(KAPTCHA_BORDER, "yes");
        // 边框颜色 默认为Color.BLACK
        properties.setProperty(KAPTCHA_BORDER_COLOR, "105,179,90");
        // 验证码文本字符颜色 默认为Color.BLACK
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_COLOR, "blue");
        // 验证码图片宽度 默认为200
        properties.setProperty(KAPTCHA_IMAGE_WIDTH, "160");
        // 验证码图片高度 默认为50
        properties.setProperty(KAPTCHA_IMAGE_HEIGHT, "60");
        // 验证码文本字符大小 默认为40
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_SIZE, "35");
        // KAPTCHA_SESSION_KEY
        properties.setProperty(KAPTCHA_SESSION_CONFIG_KEY, "kaptchaCodeMath");
        // 验证码文本生成器
        properties.setProperty(KAPTCHA_TEXTPRODUCER_IMPL, "com.gydblog.base.config.KaptchaTextCreator");
        // 验证码文本字符间距 默认为2
        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_SPACE, "3");
        // 验证码文本字符长度 默认为5
        properties.setProperty(KAPTCHA_TEXTPRODUCER_CHAR_LENGTH, "6");
        // 验证码文本字体样式 默认为new Font("Arial", 1, fontSize), new Font("Courier", 1, fontSize)
        properties.setProperty(KAPTCHA_TEXTPRODUCER_FONT_NAMES, "Arial,Courier");
        // 验证码噪点颜色 默认为Color.BLACK
        properties.setProperty(KAPTCHA_NOISE_COLOR, "white");
        // 干扰实现类
        properties.setProperty(KAPTCHA_NOISE_IMPL, "com.google.code.kaptcha.impl.NoNoise");
        // 图片样式 水纹com.google.code.kaptcha.impl.WaterRipple 鱼眼com.google.code.kaptcha.impl.FishEyeGimpy 阴影com.google.code.kaptcha.impl.ShadowGimpy
        properties.setProperty(KAPTCHA_OBSCURIFICATOR_IMPL, "com.google.code.kaptcha.impl.ShadowGimpy");
        Config config = new Config(properties);
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }
}
```

