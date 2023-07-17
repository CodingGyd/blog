---
# icon: lock
date: 2018-01-05

category:
  - Java核心
tag:
  - 数组
---

# 数组

## 什么是数组
借用百度百科的解释：数组是有序的元素序列。若将有限个类型相同的变量的集合命名，那么这个名称未数组名。组成数组的各个变量称为数组的分量，也就是我们常说的数组元素。用于区分数组的各个元素的位置的数字编号称为下标。一句话概况：数组是用于存储多个相同数据类型的集合。<br/>

[]是数组符号，高中数学里的集合和数组几乎是一样的书写格式，数组是在集合前面加上了变量Y，再加上[X]里面是元素的个数,{}里面填上每个元素。例如Y[3]={x,y,z}就是表示一个长度为3的数组，其中的元素有x、y、z。

## 数组的语法介绍
**数组的声明**<br/>
一般有以下两种形式：
```java
dataType[] data;
//上方语句等价于
dataType data[];
```
示例：
```java
//声明一个数组变量
int[] array;
int array[];
```

**数组的初始化**<br/>
语法：
```java
array = new dateType[size];
```
示例：
```java
//初始化一个存储10个int类型元素的数组
 array = new int[10];
```

数组的声明和初始化同时完成：
```java
//声明一个存储10个int类型元素的数组
int[] array = new int[10];
int array = new int[10];
```

**数组的遍历**<br/>
数组的遍历可以用for循环或增强型for循环来实现<br/>
示例：
```java
public class TestArray {
   public static void main(String[] args) {
      double[] array = {2.9, 4.9, 5.4, 3.5};
 
      // 打印所有数组元素
      for (int i = 0; i < array.length; i++) {
         System.out.println(array[i] + " ");
      }
      // 计算所有元素的总和
      double total = 0;
      for (int i = 0; i < array.length; i++) {
         total += array[i];
      }
      System.out.println("Total is " + total);
      // 查找最大元素
      double max = array[0];
      for (int i = 1; i < array.length; i++) {
         if (myLarrayist[i] > max) max = array[i];
      }
      System.out.println("Max is " + max);

      //增强型for循环的使用
      // 打印所有数组元素
      for (double element: array) {
         System.out.println(element);
      }
   }
}
```


