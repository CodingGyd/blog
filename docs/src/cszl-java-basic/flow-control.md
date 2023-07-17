---
# icon: lock
date: 2018-01-05

category:
  - Java核心
tag:
  - 流程控制
---

# 流程控制语句

Java中的流程控制结构有顺序结构、分支结构、循环结构。

## 顺序结构
顺序结构只能从上到下依次执行，如以下代码片段顺序输出：one、two、three
```java
public class Demo{
  public static void main(String[] args){
    System.out.println("one");
    System.out.println("two");
    System.out.println("three");
  }
}
```

## 分支结构
分支结构支持我们实现逻辑判断和选择，java语法里支持两种分支结构：switch语句、if语句
### if语法
**if语句**  

一个if语句包含一个bool表达式和多行代码逻辑，示例：
```java
int score = 70;
if (score >= 60) {
    System.out.println("及格啦！");
}
```
**if...else语句**  

if后面可以跟一个else语句，当if语句的bool表达式结果为false时，会执行else语句逻辑。也就是非0则1的效果。示例代码如下：
```java
int score = 59;
if (score>=60) {
  System.out.println("及格啦");
} else {
  System.out.println("没有及格");
}
```

**if...else if...else语句**  

if后面可以同时跟else if语句和else语句，解决多种可能的情况。

对if语法总结一下：
- if语句最多有一个else语句，可以有多个else if语句，else语句肯定在所有的else if语句之后。
- if、else if、else语句只要有其中一个语句的bool条件为true，则其他的语句都将跳过执行。


### switch语法
switch语句后跟随一个表达式，将表达式的值与随后的每个case语句匹配，当判断和某个case语句的值相等，则执行该case语句关联的代码块逻辑。<br/>

可选的break语句保障程序可以马上从相关的case语句跳出并终止余下的case语句匹配判断，执行switch之后的代码逻辑。
如果没有break，代码将从值所匹配的case语句开始执行，然后继续挨个执行后面的case语句而不管值是否匹配。示例代码如下：

```java
int number = 1;

switch (number) {
case 0:
	System.out.println("zero");
	break;
case 1:
	System.out.println("one");
	break;
case 2:
	System.out.println("two");
	break;
case 3:
	System.out.println("three");
	break;
default:
	System.out.println("找不到匹配");
}
```



## 循环结构
顺序结构的语句只能执行一次。如果想要重复多次执行某段代码，则需要用循环结构。<br/>
java中有四种重要的循环结构: 常规for循环、增强型for循环、do...while循环、while循环

### for循环 

for关键字用于创建一个循环，关联了三个可选的表达式，这三个表达式被包在圆括号中，使用;分隔，然后在循环体中跟随要重复执行的代码块，示例：
```java
//i=1是第一个表达式，用于循环前的初始化
//i<10是第二个表达式，用于循环是否结束的判断
//i++是第三个表达式，在每次循环体代码块执行完后执行。
for(int i=1;i<10;i++) {
  System.out.println(i);
}
```

### 增强型for循环 
java5中引入了一种主要用于遍历数组的循环语法：增强型for循环。

语法格式如下：
```java
//声明语句： 定义新的局部变量，变量的类型必须和数组元素的类型匹配。
//数组引用：要遍历访问的数组名，或者是返回值为数组引用的方法。
for(声明语句：数组引用){
  //代码块语句
}
```
示例代码：
```java
String[] strs = {"AA","BB","CC"};
for(String str : strs){
  System.out.println(str);
}
```

### do...while循环 
do...while 语句先执行 do 语句，仅当 while 语句表达式为真的前提下，循环执行 do 语句。示例代码：
```java
int count= 3;
do {
  System.out.println(count);
  count++;
} while (n 《10);
```

### while循环
while语句使得我们可以在某个表达式为真的前提下，一直循环执行指定的代码块逻辑，当表达式不为真时结束循环。
```java
int count = 10;
while(count>0) {
  System.out.println(count);
  count--;
}
```