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


