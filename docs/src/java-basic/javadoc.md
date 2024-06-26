---
# icon: lock
date: 2018-01-05

category:
  - JAVA

---

# 如何写好程序注释
注释是编码规范中必备的一部分，java中的源码注释分为：单行注释、多行注释、文档注释。这三种注释都有其特定的用途和场景。单行注释和多行注释用于提供简单的代码注释和说明，而文档注释相对复杂，主要用于自动生成API文档。因此我们在编写代码时应该根据实际场景选择合适的注释方式，并且要遵循团队内统一的注释风格和规范。

这三种注释在编译时也有不同的处理方式：
  - 单行注释和多行注释在编译时会直接被编译器忽略掉，不会被翻译成class文件中的字节码内容
  - 文档注释在编译时会被翻译成HTML格式的文档。我们可以使用javadoc工具从文档注释中直接生成API文档。

## 01、语法解释

**单行注释**  
用"//"开头直到该行的末尾，只能注释单行代码，且注释信息不能太多。常用来解释变量名、方法的用途，调试信息、代码的功能等，例如：

```java
//这是一个变量(单行注释格式)
int a = 50;
```

**多行注释**  
用/*开头，*/结尾，可以跨越多行注释代码块。主要用来解释代码块的功能、方法实现的细节、复杂算法的步骤说明等。多行注释可以包含任意数量的代码和空白行

```java
/* 这是一个除法计算(多行注释)
 * 可以注释多行内容
 */ 
int a = 50;
int b = 10;
int c = a/b;
```
**文档注释**  
用/**开头，*/结尾，也能注释多行内容，一般用在类、方法和变量上面，用来描述其作用。注释后，鼠标放在类和变量上面会自动显示出我们注释的内容，示例:
```java
/**
 *  文档注释
 *  也可以注释多条内容
 */
public class Demo{
  public static void main(String[] args) {
    System.out.println("test);
  }
}
```

## 02、注释原则

我根据个人的开发经验总结了几条原则：
- 同一个团队内的注释格式需要统一。团队长定义好统一的注释规范，成员必须遵守。
- 注释要简洁。描述要简单明了、含义准确，错误的注释反而有害。
- 注释要和代码逻辑修改保持同步。避免修改了代码而没有调整注释。
- 该有的注释不能少。尤其是类、方法、关键算法、配置等位置必须要有注释说明。

## 03、注释模板
以下是我个人习惯使用的注释模板：

**类和接口注释模板**
```java
/**
 * 类描述：
 * 
 * @ClassName ${NAME}
 * @Description TODO   
 * @Author ${USER}
 * @Date ${DATE} ${TIME}
 * @Version 1.0
 */
```

**方法注释模板**
```java
/** 
 * @description: $description$ 
 * @param: $params$ 
 * @return: $returns$ 
 * @author $USER$
 * @date: $date$ $time$
 */
```


