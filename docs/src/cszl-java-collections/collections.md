---
# icon: lock
date: 2018-01-05

category:
  - Java
tag:
  - Java集合
---

# 集合框架
## 整体架构
 <img src="/images/java/collections/overview.gif"  style="zoom: 100%;margin:0 auto;display:block"/><br/>

## 总体概述
从全景图可以看出，Java集合框架主要包含两种类型的结构，一种是集合(Collection)，一种是键值对映射(Map)。  

Collection下面有三种子类型接口定义，分别是List、Set、Queue，再下面一层是抽象类如AbstractSet、AbstractList等，接着是具体的实现类，常用的有CopyOnWriteArrayList、ArrayList、LinkedList、HashSet、TreeSet、LinkedHashSet、SortedSet等。  

Map体系设计和List类似，先是设计了顶层接口，接着下面有一些子类型接口定义，然后是抽象类定义比如AbstractMap，最后是具体的实现类。常用的实现类有HashMap、TreeMap、LinkedHashMap、SortedMap、NavigableMap、ConcurrentMap等。

## 设计模式

**迭代器模式**  

迭代器模式属于行为型模式，指提供一种方法顺序访问一个聚合对象中各个元素，而又无须暴露该对象的内部表示（底层数据结构）。  

Collection接口从父接口Iterable中继承了Iterator()方法，而该方法返回的是一个Iterator迭代器,可以按照某种顺序遍历集合中的每个元素，Collection下面的所有实现类型都是可迭代的。

## ArrayList

**简介**  

java.util.ArrayList 类是一个可以动态修改的数组容器，给开发者提供了相关的添加、删除、修改、遍历等常用功能。它与普通数组的区别就是它是没有固定大小的限制，底层基于数组实现容量大小动态扩容变化，我们可以随意添加或删除元素。允许null值的存在，同时还实现了RandomAccess、Cloneable、Serializable等能力接口。所以ArrayList是支持快速访问、复制、序列化的一种结构。  

**特点**  

1.底层数据结构是数组，查找遍历时间复杂度O(1)、增删时间复杂度最差是O(n)，适合查找场景，不太适合增删频繁的业务场景。  
2.自动扩容机制：随着元素的增多而触发阈值自动进行扩容，每次扩容是到原先的1.5倍。  
3.线程不安全。多线程场景需要考虑并发安全，或者改为使用CopyOnWriterArrayList。    

**ArrayList 常用方法列表**  

|方法	|描述
| ----------- | ----------- |
|add()	|将元素插入到指定位置的 arraylist 中
|addAll()	|添加集合中的所有元素到 arraylist 中
|clear()	|删除 arraylist 中的所有元素
|clone()	|复制一份 arraylist
|contains()	|判断元素是否在 arraylist
|get()	|通过索引值获取 arraylist 中的元素
|indexOf()	|返回 arraylist 中元素的索引值
|removeAll()	|删除存在于指定集合中的 arraylist 里的所有元素
|remove()	|删除 arraylist 里的单个元素
|size()	|返回 arraylist 里元素数量
|isEmpty()	|判断 arraylist 是否为空
|subList()	|截取部分 arraylist 的元素
|set()	|替换 arraylist 中指定索引的元素
|sort()	|对 arraylist 元素进行排序
|toArray()	|将 arraylist 转换为数组
|toString()	|将 arraylist 转换为字符串
|ensureCapacity()	|设置指定容量大小的 arraylist
|lastIndexOf()	|返回指定元素在 arraylist 中最后一次出现的位置
|retainAll()	|保留 arraylist 中在指定集合中也存在的那些元素
|containsAll()	|查看 arraylist 是否包含指定集合中的所有元素
|trimToSize()	|将 arraylist 中的容量调整为数组中的元素个数
|removeRange()	|删除 arraylist 中指定索引之间存在的元素
|replaceAll()	|将给定的操作内容替换掉数组中每一个元素
|removeIf()	|删除所有满足特定条件的 arraylist 元素
|forEach()	|遍历 arraylist 中每一个元素并执行特定操作

 
## CopyOnWriterArrayList
## LinkedList
## HashSet
## SortedSet
## LinkedHashSet
## 总结

