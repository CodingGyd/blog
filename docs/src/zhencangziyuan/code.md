---
date: 2022-01-09
category:
  - 珍藏资源
tag:
  - 代码片段
---

# 代码片段 
> 更多实用代码片段 <a href="https://github.com/CodingGyd/common-utils" text="戳这里！" target="_blank"></a>  
> excel导入导出组件 <a href="https://github.com/CodingGyd/excel-utils" text="戳这里！" target="_blank"></a>

## 参数校验工具

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

## 数值精确运算工具
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


## bean和map转换工具
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