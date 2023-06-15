---
# icon: lock
date: 2023-06-15

category:
  - Java
tag:
  - HashMap
---

# HashMap
## 简介  
HashMap是java集合框架中非常重要的一种类型，也是开发业务系统时常用的数据结构。    
HashMap是一个散列表，数据是以键值对(Key-Value)的形式存储。  
HashMap 实现了 Map 接口，根据键的 HashCode 值存储数据，具有很快的访问速度，最多允许一条记录的键为 null，不支持线程同步。  
HashMap 是无序的，不会记录插入的顺序。  
HashMap 继承于AbstractMap，实现了 Map、Cloneable、java.io.Serializable 接口。  
 <img src="/images/java/collections/hashmap-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 特点  
- 非线程安全
- 扩容机制
- 底层数据结构  

 在JDK1.8以前，HashMap底层是由数组+链表实现的，数组是HashMap的主体，查询复杂度是O(1)，链表是为了解决hash冲突而存在的("拉链法"解决冲突)，查询复杂度是O(n)。  

 JDK1.8开始，对HashMap做了一次优化，当链表长度大于阈值(默认是8)并且主体数组的长度大于64时，链表就会转换为红黑树存储，红黑树相对链表而言能提高查询性能，查询复杂度是O(logn)，但是结构也变得更复杂。  

 当链表阈值大于8，但是数组长度小于64时，jdk不会将链表变为红黑树，而是选择进行数组的扩容。这样做的目的是因为红黑树结构附加了很多左旋、右旋、变色这些操作来保持树的平衡，而数组元素少时，数组搜索时间相对要快一些。  

 数组里面都是Key-Value的实例，在JDK1.8之前每个数组元素叫Entry，JDK1.8以后叫Node。
  <img src="/images/java/collections/hashmap-2.png"  style="zoom: 70%;margin:0 auto;display:block"/><br/>

## put流程
从HashMap的put方法分析得出以下流程
  <img src="/images/java/collections/hashmap-3.png"  style="zoom: 70%;margin:0 auto;display:block"/><br/>

注意：jdk7和jdk8的put实现有细微区别，整体流程差不多。

## get流程
从HashMap的get方法分析得出以下流程
  <img src="/images/java/collections/hashmap-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

注意：jdk7和jdk8的get实现有细微区别，整体流程差不多。

## 哈希冲突
针对HashMap的hash冲突场景，通俗的讲就是在put操作中，不同的key计算出的hashcode相同导致的冲突，这时候我们是直接覆盖存储还是追加存储或者其他方式解决呢？  

了解Hash冲突如何解决需要首先了解Hash算法和Hash表的概念。
  <img src="/images/java/collections/hashmap-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
1.Hash算法就是把任意长度的输入通过散列算法变成固定长度的输出，这个输出结果就是一个散列值。  
2.Hash表又叫做“散列表”，它是通过key直接访问到内存存储位置的数据结构，在具体的实现上，我们通过Hash函数，把key映射到表中的某个位置，来获取这个位置的数据，从而加快数据的查找。  


Hash冲突是由于哈希算法，被计算的数据是无限的，而计算后的结果的范围是有限的，总会存在不同的数据，经过计算之后得到值是一样，那么这个情况下就会出现所谓的哈希冲突。

**解决Hash冲突的方式有四种**：
- 开放定址法  
  也称为线性探测法，就是从发生冲突的那个位置开始，按照一定次序从Hash表找到一个空闲位置，然后把发生冲突的元素存入到该空闲位置，我们熟悉的java-ThreadLocal机制就用到了线性探测法来解决Hash冲突。

  <img src="/images/java/collections/hashmap-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
如上图，在Hash表索引1的位置存了key=name，再向它添加key=hobby的时候，假设计算得到的索引也是1，那么这个时候发生哈希冲突，而开放开放定址法就是按照顺序向前找到一个空闲的位置，来存储这个冲突的key。

- 链式寻址法  
简单理解就是把存在Hash冲突的key，在冲突位置上拉出来一个链表，以单向链表来存储，HashMap在jdk1.8就是采用此方式解决Hash冲突的(还有红黑树方式，红黑树是为了优化Hash链表过长导致时间复杂度增加的问题)。

作者：请叫我黄同学
链接：https://juejin.cn/post/7088332200130658312
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
  <img src="/images/java/collections/hashmap-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
如上图，存在冲突的key直接是以单向链表的方式去进行存储的。  

- 再Hash法  
就是通过某个Hash函数计算的key，存在冲突的时候，再用另外一个Hash函数对这个key进行再次Hash，一直运算，直到不再产生Hash冲突为止，这种方式会增加计算的一个时间，在性能上会有一些影响。  

- 建立公共溢出区  
就是把Hash表分为基本表和溢出表两个部分，凡是存在冲突的元素，均放到溢出表中。  

## 扩容机制  


## JDK的差异
JDK7、8对于链表的插入：JDK7采用的是头插法，JDK8采用的是尾插法。



## HashMap 常用方法列表  

|方法	|描述
| ----------- | ----------- |
|clear()	|删除 hashMap 中的所有键/值对
|clone()	|复制一份 hashMap
|isEmpty()	|判断 hashMap 是否为空
|size()	|计算 hashMap 中键/值对的数量
|put()	|将键/值对添加到 hashMap 中
|putAll()	|将所有键/值对添加到 hashMap 中
|putIfAbsent()	|如果 hashMap 中不存在指定的键，则将指定的键/值对插入到 hashMap 中。
|remove()	|删除 hashMap 中指定键 key 的映射关系
|containsKey()	|检查 hashMap 中是否存在指定的 key 对应的映射关系。
|containsValue()	|检查 hashMap 中是否存在指定的 value 对应的映射关系。
|replace()	|替换 hashMap 中是指定的 key 对应的 value。
|replaceAll()	|将 hashMap 中的所有映射关系替换成给定的函数所执行的结果。
|get()	|获取指定 key 对应对 value
|getOrDefault()	|获取指定 key 对应对 value，如果找不到 key ，则返回设置的默认值
|forEach()	|对 hashMap 中的每个映射执行指定的操作。
|entrySet()	|返回 hashMap 中所有映射项的集合集合视图。
|keySet()	|返回 hashMap 中所有 key 组成的集合视图。
values()	|返回 hashMap 中存在的所有 value 值。
|merge()	|添加键值对到 hashMap 中
|compute()	|对 hashMap 中指定 key 的值进行重新计算
|computeIfAbsent()	|对 hashMap 中指定 key 的值进行重新计算，如果不存在这个 key，则添加到 hasMap 中
|computeIfPresent()	|对 hashMap 中指定 key 的值进行重新计算，前提是该 key 存在于 hashMap 中。

## 参考资料
[HashMap|菜鸟教程](https://www.runoob.com/java/java-hashmap.html)<br/>
[哈希冲突|掘金社区](https://juejin.cn/post/7088332200130658312)<br/>

