---
title: Spring系列笔记-AOP-面向切面编程
shortTitle: AOP-面向切面编程
date: 2023-08-19
category:
  - JAVA企业级开发
tag:
  - AOP
head:
  - - meta
    - name: keywords
      content: JAVA企业级开发,Spring笔记,Spring5,Spring总结,Spring核心知识,AOP编程
---

# AOP-面向切面编程
## 一、AOP为何物？
AOP(Aspect Oriented Programming)，即面向切面编程，是一种编程思想，也是通过预编译方式和运行期间动态代理实现程序功能的统一维护的一种技术。

![AOP的关键概念](http://cdn.gydblog.com/images/spring/aop-1.png)

利用AOP可以对业务逻辑的各个部分进行组件化隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

## 二、关键概念

![AOP的关键概念](http://cdn.gydblog.com/images/spring/aop-2.png)

上图列出了AOP编程中的关键概念，下面针对每一个概念来进行详细说明。

### 1、Joinpoint（连接点）
连接点是告诉程序"在哪里做"，是指允许被作为切入点的资源。切入点可能是类初始化、方法执行、方法调用、字段调用或者异常处理等。

Spring AOP只支持通过方法执行这个资源切入点作为连接点，换句话说，在 Spring AOP 中，一个连接点总是代表一个方法执行。

### 2、Pointcut（切入点）
切入点可以认为是Joinpoint连接点的集合，其实就是筛选出的连接点集合，指要对哪些连接点进行切入(拦截)。

一个类中的所有方法其实都是连接点，但我们一般不全需要，会筛选出某些连接点作为切入点。

### 3、Advice（增强）
Advice（增强），有些资料也称之为“通知”。其实定义为“增强”更为准确，指的就是拦截Joinpoint连接点后要附加做的事情，即对切入点增强的内容，告诉程序“干什么”。

Advice提供了需要在Joinpoint连接点处扩展现有业务行为的手段，包括前置增强（before-advice）、后置增强（after-advice）、环绕增强（around-advice）、返回后增强（after-returning advice）、抛出异常后增强（after-throwing advice）

不同的增强手段分别对应了不同的注解配置：

- **@Before：** 前置增强，在调用目标方法之前执行附加的行为。

- **@After：** 后置增强，在目标方法执行结束后，无论执行结果如何都执行附加的行为。

- **@After-returning：** 返回后增强，在目标方法执行结束后，如果执行成功，则执行附加的行为。

- **@After-throwing：** 抛出异常后增强，如果目标方法执行过程中抛出异常，则执行附加的行为。

- **@Around：** 环绕增强，在目标方法执行前和执行后，都需要执行附加的行为。

**举例：** 假如我想统计一个方法的执行耗时，可以使用环绕增强，在方法执行前记录开始时间，在方法执行后根据当前时间减去记录的开始时间，即可得到方法执行耗时数据。

### 4、Target（目标）
Target（目标）也可以称为“被增强对象”， 就是需要加入额外代码(行为)的对象，表示“对谁干”。

被增强对象一般是指我们自己编写的业务逻辑部分，由于Spring AOP 通过代理模式实现，这个对象永远是被代理对象。

在Advice（增强）部分举的例子中，被统计执行耗时的方法就是一个典型的被增强对象。

### 5、Aspect（切面）

Aspect（切面）是其实就是增强、切点、目标的结合，说明了“干什么”、“什么时候干”、“在哪里干”。

说白了就是把前面1234小节部分的四个概念整合起来衍生出来一个切面，组成一个完整的东西。

例如在类Test的invoke()方法被调用之前进行增强操作。缺了invoke()方法，不知道在哪做，缺了方法上的注解配置before()，不知道什么时候进行增强操作，也不知道要具体要增强什么。

### 6、Weaving（织入）

织入指的是一个过程，是将Aspect切面应用到Target目标对象从而创建出AOP代理对象的过程，织入可以在目标对象的生命周期的不同时期进行：

- **编译期：** 切面在目标类编译时被织入，这种方式需要特殊的编译器

- **类加载期：** 切面在目标类加载到JVM时被织入，这种方式需要特殊的类加载器，它可以在目标类被引入应用之前增强该目标类的字节码

- **运行期：** 切面在应用运行的某个时刻被织入，一般情况下，在织入切面时，AOP容器会为目标对象动态创建一个代理对象，Spring AOP就是以这种方式织入切面的。

### 7、Proxy（代理）
AOP编程的实现方式。在Spring中，AOP代理采用了JDK动态代理和CGLIB代理的混合模式。

**1）JDK动态代理**

JDK动态代理是Spring AOP实现的默认方式，如果目标对象实现了接口，Spring就会采用此方式实现动态代理。

<font color="red">下面演示JDK动态代理的简单使用。</font>

- a.定义目标对象，该目标对象必须实现了接口。

  示例代码：
  ```java
  //接口定义
  public interface TargetObject {
    String invoke();
  }
  ```

  ```java
  //目标对象实现类
  public class TargetObjectImpl implements TargetObject{

    @Override
    public String invoke(){
        System.out.println("我是目标方法里面的逻辑。。。");
        return "SUCCESS";
    }

  }
  ```

- b.编写一个类实现InvocationHandler接口
  重写InvocationHandler接口的invoke方法，在invoke方法内调用我们需要代理的目标方法。
  代码示例：
  ```java
  public class JdkProxyDemo implements InvocationHandler {
  
      private TargetObject targetObject;
  
      public JdkProxyDemo(TargetObject targetObject) {
          this.targetObject = targetObject;
      }
  
      @Override
      public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
  
          System.out.println("before 前置增强处理");
          Object result = null;
  
          try {
              result = method.invoke(targetObject, args);
          }catch (Exception ex) {
              System.out.println("ex: " + ex.getMessage());
              throw ex;
          }finally {
              System.out.println("after 后置增强处理");
          }
          return result;
      }
  }
  ```

- c.通过Proxy类的newProxyInstance方法，返回一个代理对象。
  代码示例：
  ```java
  public class TestMain {
      public static void main(String[] args) { 
        //获取InvocationHandler对象 在构造方法中注入目标对象 
        InvocationHandler handler = new JdkProxySubject(new TargetObjectImpl()); 

        //获取代理类对象 
        TargetObject proxySubject = (TargetObject)Proxy.newProxyInstance(TestMain.class.getClassLoader(), new Class[]{TargetObject.class}, handler); 

        //调用目标方法
        proxySubject.invoke(); 
      }
  }
  ```

- d.程序执行，输出日志
  ```
  before 前置增强处理
  我是目标方法里面的逻辑。。。
  after 后置增强处理
  ```

**<font color="red">JDK动态代理的优缺点分析</font>**
:::info 优点
JDK动态代理是JDK原生的，不需要任何依赖即可直接使用；
:::

:::info 缺点
如果要使用JDK动态代理，被代理的目标类必须实现了接口；
:::

**2）CGLIB代理**

> 如果AOP目标对象没有实现接口，则可以使用CGLIB代理。

CGLIB代理的实现依赖Cglib包。Cglib包是一个强大的、高性能的代码生成包，它目前已经广泛被许多AOP框架使用，为他们提供方法的拦截。

下图所示说明了Cglib与Spring等应用框架的依赖关系图：

![CGLIB](http://cdn.gydblog.com/images/spring/aop-3.png)

- 最底层的是字节码 Bytecode ，字节码是Java为了保证“一次编译、到处运行”而产生的一种虚拟指令格式，例如iload_0、iconst_1、if_icmpne、dup等。

- 位于字节码之上的是 ASM ，这是一种直接操作字节码的框架，应用ASM需要对Java字节码、Class结构比较熟悉

- 位于 ASM 之上的是 CGLIB，与之并列的还有Groovy、BeanShell等脚本语言。它们通过ASM框架生成字节码变相执行Java代码，这同时也证明了 在JVM中执行程序并不一定非要写Java代码（只要你能生成Java字节码，JVM并不关心字节码的来源 ，当然通过Java代码生成的JVM字节码是通过编译器直接生成的，算是最“正统”的JVM字节码）

- 位于 CGLIB之上的就是 Spring AOP 这些框架了。

- 最上层的是Applications，即具体应用，一般都是我们应用开发者直接编写的程序。


接下来我们用代码来简单示例是如何应用CGLIB的。

- 引入cglib包依赖
```java
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.0.8.RELEASE</version>
</dependency>
```

- b.定义目标类和方法
```java
public class MyObject {
  public void hello() {
      try {
          System.out.println("我是目标方法的业务逻辑。。。");
      } catch (Exception e) {
          System.out.println("目标方法执行出现异常，终止");
      }
  }
}

```

- c.创建MethodInterceptor代理方法
```java

import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;
public class CglibMethodInterceptor implements MethodInterceptor {

    // 需要被代理的对象
    private Object target;

    public Object getTarget() {
        return target;
    }

    public void setTarget(Object target) {
        this.target = target;
    }

    /**
     * 代理目标方法
     * target 实例代表被代理类对象引用, 初始化 CglibMethodInterceptor 时候被赋值 。但是Cglib不推荐使用这种方式
     * @param obj    代表Cglib 生成的动态代理类 对象本身
     * @param method 代理类中被拦截的接口方法 Method 实例
     * @param args   接口方法参数
     * @param proxy  用于调用父类真正的业务类方法。可以直接调用被代理类接口方法
     * @return
     * @throws Throwable
     */
    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        Object result = null;
        try {
            System.out.println("before 前置增强");
            // 执行目标方法  反射调用被代理类方法，
            result = proxy.invokeSuper(obj, args);
            // Object result = method.invoke(target, args);
            System.out.println("after 后置增强");
        } catch (Exception e) {
            System.out.println("返回异常后增强");
        }
        return result;
    }
}
```

- d. 编写测试启动类
```java

import net.sf.cglib.proxy.Enhancer;

public class TestCglibMain {
    public static void main(String[] args) throws Exception {
        // 增强类
        CglibMethodInterceptor cglibMethodInterceptor = new CglibMethodInterceptor();
        // 需被代理的对象
        MyObject myObject = new MyObject();
        // 把真实对象放入增强类中，隐藏起来
        cglibMethodInterceptor.setTarget(myObject);

        // 创建Enhancer，用来创建动态代理类
        Enhancer enhancer = new Enhancer();
        // 为代理类指定需要代理的类
        enhancer.setSuperclass(cglibMethodInterceptor.getTarget().getClass());
        // 设置调用代理类会触发的增强类
        enhancer.setCallback(cglibMethodInterceptor);

        // 获取动态代理类对象并返回
        MyObject proxy = (MyObject) enhancer.create();

        // 调用代理类的方法
        proxy.hello();
    }
}
```

- e.程序执行，输出日志
```
before 前置增强
我是目标方法的业务逻辑。。。
after 后置增强
```

Cglib的实现是在字节码的基础上的，并且使用了开源的ASM读取字节码，对类实现增强功能的。

## 三、3种实现方式

> 这里总结Spring中针对AOP的3种支持方式。

### 1、使用Spring自带的AOP
此方式不推荐使用，已过时，不再总结笔记，有兴趣的可以查资料。

### 2、使用Aspectj(基于XML)

**1）导入Aspectj相关依赖**

```xml
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

**2）定义目标对象方法**
```java
public class MyBean {
  public String hello(){
      System.out.println("我的业务逻辑。。。Hello");
      return "Hello";
  }
}
```

**3）定义切面**
```java

public class MyLogAdvice {
  //前置通知
  public void beforeAdvice(JoinPoint joinPoint){
      System.out.println("========== 【Aspectj前置通知】 ==========");
  }

  //后置通知：方法正常执行后，有返回值，执行该后置通知：如果该方法执行出现异常，则不执行该后置通知
  public void afterReturningAdvice(JoinPoint joinPoint,Object returnVal){
      System.out.println("========== 【Aspectj返回值以后的后置通知】 ==========");
  }
  public void afterAdvice(JoinPoint joinPoint){
      System.out.println("========== 【Aspectj后置通知】 ==========");
  }

  //环绕通知
  public Object aroundAdvice(ProceedingJoinPoint joinPoint) throws Throwable {
      System.out.println("##########【环绕通知中的前置通知】##########");
      Object returnVale = joinPoint.proceed();
      System.out.println("##########【环绕通知中的后置通知】##########");
      return returnVale;
  }

  /**
   * 异常通知：方法出现异常时，执行该通知
   */
  public void throwAdvice(JoinPoint joinPoint, Exception ex){
      System.out.println("出现异常：" + ex.getMessage());
  }

}
```

**4）使用Spring的容器xml配置方式进行AOP声明**
<font color="red">注意：标签“aop:config”的使用 需要提前声明如下namespace</font>
```
  xmlns:aop="http://www.springframework.org/schema/aop"
  xsi:schemaLocation="
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd"
```

xml配置：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- services -->

    <!--目标业务对象-->
    <bean id="myBean" class="com.gyd.springdemo.aop.MyBean"></bean>
    <!--切面Aspect-->
    <bean id="myLogAdviceBean" class="com.gyd.springdemo.aop.aspectj.MyLogAdvice"></bean>
    <!--使用Aspectj实现切面，使用Spring AOP的方式进行配置-->
    <aop:config>
        <!--配置切面-->
        <aop:aspect ref="myLogAdviceBean">
            <!--定义切点Pointcut：通过expression表达式，查找特定的方法作为切点-->
            <aop:pointcut id="pointcut" expression="execution(* com.gyd.springdemo.aop.MyBean.hello())"/>

            <!--配置前置通知 before advice-->
            <aop:before method="beforeAdvice" pointcut-ref="pointcut"/>

            <!--配置后置通知 after advice和after returning advice-->
            <aop:after-returning returning="returnVal" method="afterReturningAdvice" pointcut-ref="pointcut"/>
            <aop:after method="afterAdvice" pointcut-ref="pointcut"/>

            <!--配置异常通知-->
            <aop:after-throwing throwing="ex" method="throwAdvice" pointcut-ref="pointcut"/>

            <aop:around method="aroundAdvice" pointcut-ref="pointcut"/>
        </aop:aspect>
    </aop:config>
</beans>
```
 
**5）测试目标方法的执行是否拦截**
```java
public class AopMain {
  public static void main(String[] args) {
      ConfigurableApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      com.gyd.springdemo.aop.MyBean myBean = context.getBean("myBean", MyBean.class);
      //执行目标方法 验证AOP逻辑
      myBean.hello();
  }
}
```

程序执行输出日志如下：
```
========== 【Aspectj前置通知】 ==========
##########【环绕通知中的前置通知】##########
我的业务逻辑。。。Hello
##########【环绕通知中的后置通知】##########
========== 【Aspectj后置通知】 ==========
========== 【Aspectj返回值以后的后置通知】 ==========
```

上面使用xml方式进行配置，看起来还是比较麻烦的，其实还有一种更简化的注解方式也实现同样的功能，下面进行介绍。

### 3、使用Aspectj(基于注解)
todo

## 四、应用场景

在Spring中提供了AOP的丰富支持，允许开发者通过分离应用的业务逻辑与系统级逻辑，目前应用AOP比较常见的场景有如下几类：

- 记录日志
- 性能统计 如监控方法运行时间
- 权限控制
- 安全控制 如加解密
- 事务处理（调用方法前开启事务， 调用方法后提交关闭事务 ） 
- 异常处理 全局异常统一捕获
- 缓存操作（第一次调用查询数据库，将查询结果放入内存对象， 第二次调用， 直接从内存对象返回，不需要查询数据库 ）
 

## 五、结束语
本文初步总结了AOP的定义、关键概念，列出了AOP的常用业务场景，相信看完这篇文章后 大家对AOP会有一定的了解。

## 六、参考资料
https://blog.csdn.net/Cr1556648487/article/details/126777903