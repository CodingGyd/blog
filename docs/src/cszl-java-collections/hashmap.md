---
# icon: lock
date: 2023-06-15

category:
  - Java核心
tag:
  - HashMap
---

# HashMap
## 01、简介  
HashMap是java集合框架中非常重要的一种类型，也是开发业务系统时最受欢迎的数据类型之一；   
HashMap是一个散列表，数据是以键值对(Key-Value)的形式存储；  
HashMap 实现了 Map 接口，根据键的 HashCode 值存储数据，具有很快的访问速度，最多允许一条记录的键为 null，不支持线程同步；  
HashMap 是无序的，不会记录插入的顺序；  
HashMap 继承于AbstractMap，实现了 Map、Cloneable、java.io.Serializable 接口：
 <img src="http://cdn.gydblog.com/images/java/collections/hashmap-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 02、数据结构  

 在JDK1.8以前，HashMap底层是由数组+链表实现的，数组是HashMap的主体，查询复杂度是O(1)，链表是为了解决hash冲突而存在的("拉链法"解决冲突)，查询复杂度是O(n)。  

 JDK1.8开始，对HashMap做了一次优化，当链表长度大于阈值(默认是8)并且主体数组的长度大于64时，链表就会转换为红黑树存储，红黑树相对链表而言能提高查询性能，查询复杂度是O(logn)，但是结构也变得更复杂。  

 当链表阈值大于8，但是数组长度小于64时，jdk不会将链表变为红黑树，而是选择进行数组的扩容。这样做的目的是因为红黑树结构附加了很多左旋、右旋、变色这些操作来保持树的平衡，而数组元素少时，数组搜索时间相对要快一些。    

阈值定义相关源码如下：
```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {
    /**
     * 默认初始容量为16，必须是2的k次方
     */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    /**
     * 最大容量
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;

    /**
     * 默认负载因子(例如初始容量是16，则当容量达到16*0.75=12时，会触发扩容)
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /**
     * 桶上的链表长度大于等于8时，链表转化成红黑树
     */
    static final int TREEIFY_THRESHOLD = 8;

    /**
     * 桶上的红黑树大小小于等于6时，红黑树转化为链表
     */
    static final int UNTREEIFY_THRESHOLD = 6;

    /**
     * 当主数组容量大于64时，链表才能转为红黑树
     */
    static final int MIN_TREEIFY_CAPACITY = 64;
    ....
}
```

 数组里面都是Key-Value的实例，在JDK1.8之前每个数组元素叫Entry，JDK1.8以后叫Node。
  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-2.png"  style="zoom: 70%;margin:0 auto;display:block"/><br/>

## 03、put流程
从HashMap的put方法分析得出以下流程
  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-3.png"  style="zoom: 70%;margin:0 auto;display:block"/><br/>

注意：jdk7和jdk8的put实现有细微区别，整体流程差不多。

## 04、get流程
从HashMap的get方法分析得出以下流程
  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

注意：jdk7和jdk8的get实现有细微区别，整体流程差不多。

## 05、哈希冲突
针对HashMap的hash冲突场景，通俗的讲就是在put操作中，不同的key计算出的hashcode相同导致的冲突，这时候我们是直接覆盖存储还是追加存储或者其他方式解决呢？  

了解Hash冲突如何解决需要首先了解Hash算法和Hash表的概念。
  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
1.Hash算法就是把任意长度的输入通过散列算法变成固定长度的输出，这个输出结果就是一个散列值。  
2.Hash表又叫做“散列表”，它是通过key直接访问到内存存储位置的数据结构，在具体的实现上，我们通过Hash函数，把key映射到表中的某个位置，来获取这个位置的数据，从而加快数据的查找。  


Hash冲突是由于哈希算法，被计算的数据是无限的，而计算后的结果的范围是有限的，总会存在不同的数据，经过计算之后得到值是一样，那么这个情况下就会出现所谓的哈希冲突。

**解决Hash冲突的方式有四种**：
- 开放定址法  
  也称为线性探测法，就是从发生冲突的那个位置开始，按照一定次序从Hash表找到一个空闲位置，然后把发生冲突的元素存入到该空闲位置，我们熟悉的java-ThreadLocal机制就用到了线性探测法来解决Hash冲突。

  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
如上图，在Hash表索引1的位置存了key=name，再向它添加key=hobby的时候，假设计算得到的索引也是1，那么这个时候发生哈希冲突，而开放开放定址法就是按照顺序向前找到一个空闲的位置，来存储这个冲突的key。

- 链式寻址法  
简单理解就是把存在Hash冲突的key，在冲突位置上拉出来一个链表，以单向链表来存储，HashMap在jdk1.8就是采用此方式解决Hash冲突的(还有红黑树方式，红黑树是为了优化Hash链表过长导致时间复杂度增加的问题)。

  <img src="http://cdn.gydblog.com/images/java/collections/hashmap-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
如上图，存在冲突的key直接是以单向链表的方式去进行存储的。  

- 再Hash法  
就是通过某个Hash函数计算的key，存在冲突的时候，再用另外一个Hash函数对这个key进行再次Hash，一直运算，直到不再产生Hash冲突为止，这种方式会增加计算的一个时间，在性能上会有一些影响。  

- 建立公共溢出区  
就是把Hash表分为基本表和溢出表两个部分，凡是存在冲突的元素，均放到溢出表中。  

## 06、扩容机制  
**1. 什么时候会需要扩容？**
- 在首次调用put方法的时候，初始化数组table  

- 当HashMap中的元素个数超过数组大小(数组长度)*loadFactor(负载因子)时，就会进行数组扩容  
loadFactor的默认值(DEFAULT_LOAD_FACTOR)是0.75,这是一个折中的取值。也就是说，默认情况下，数组大小为16，那么当HashMap中的元素个数超过16×0.75=12(这个值就是阈值或者边界值threshold值)的时候，就把数组的大小扩展为2×16=32，即扩大一倍，然后重新计算每个元素在数组中的位置，而这是一个非常耗性能的操作，所以如果我们已经预知HashMap中元素的个数，那么预知元素的个数能够有效的提高HashMap的性能。

- 当HashMap中的其中一个链表的对象个数如果达到了8个，此时如果数组长度没有达到64，那么HashMap会先扩容解决，如果已经达到了64，那么这个链表会变成红黑树，节点类型由Node变成TreeNode类型。当然，如果映射关系被移除后，下次执行resize方法时判断树的节点个数低于6，也会再把树转换为链表

**2. 扩容流程说明**  

hashMap的扩容逻辑是底层的resize方法，分析源码可以得出结论是进行扩容时会伴随着一次重新hash分配，并且会遍历hash表中所有的元素，是非常耗时的。因此我们在编写程序中，要尽量避免resize()的触发。  

HashMap在进行扩容时，使用的rehash方式非常巧妙，因为每次扩容都是翻倍，与原来计算的 (n-1)&hash的结果相比，只是多了一个bit位，所以节点要么就在原来的位置，要么就被分配到"原位置+旧容量"这个位置。  

JDK1.8的扩容源码resize()解读如下：
```java
final Node<K,V>[] resize() {
    //得到当前数组
    Node<K,V>[] oldTab = table;
    //如果当前数组等于null长度返回0，否则返回当前数组的长度
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    //当前阀值点 默认是12(16*0.75)
    int oldThr = threshold;
    int newCap, newThr = 0;
    //如果老的数组长度大于0
    //开始计算扩容后的大小
    if (oldCap > 0) {
        // 超过最大值就不再扩充了，就只好随你碰撞去吧
        if (oldCap >= MAXIMUM_CAPACITY) {
            //修改阈值为int的最大值
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        /*
        	没超过最大值，就扩充为原来的2倍
        	1)(newCap = oldCap << 1) < MAXIMUM_CAPACITY 扩大到2倍之后容量要小于最大容量
        	2)oldCap >= DEFAULT_INITIAL_CAPACITY 原数组长度大于等于数组初始化长度16
        */
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            //阈值扩大一倍
            newThr = oldThr << 1; // double threshold
    }
    //老阈值点大于0 直接赋值
    else if (oldThr > 0) // 老阈值赋值给新的数组长度
        newCap = oldThr;
    else {// 直接使用默认值
        newCap = DEFAULT_INITIAL_CAPACITY;//16
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    // 计算新的resize最大上限
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    //新的阀值 默认原来是12 乘以2之后变为24
    threshold = newThr;
    //创建新的哈希表
    @SuppressWarnings({"rawtypes","unchecked"})
    //newCap是新的数组长度--》32
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    //判断旧数组是否等于空
    if (oldTab != null) {
        // 把每个bucket都移动到新的buckets中
        //遍历旧的哈希表的每个桶，重新计算桶里元素的新位置
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                //原来的数据赋值为null 便于GC回收
                oldTab[j] = null;
                //判断数组是否有下一个引用
                if (e.next == null)
                    //没有下一个引用，说明不是链表，当前桶上只有一个键值对，直接插入
                    newTab[e.hash & (newCap - 1)] = e;
                //判断是否是红黑树
                else if (e instanceof TreeNode)
                    //说明是红黑树来处理冲突的，则调用相关方法把树分开
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // 采用链表处理冲突
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    //通过上述讲解的原理来计算节点的新位置
                    do {
                        // 原索引
                        next = e.next;
                     	//这里来判断如果等于true e这个节点在resize之后不需要移动位置
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        // 原索引+oldCap
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 原索引放到bucket里
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    // 原索引+oldCap放到bucket里
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

## 07、JDK的差异
- JDK1.7采用的是头插法，JDK1.8采用的是尾插法。  

- JDK1.8以前 底层数据结构是数组+链表，JDK1.8之后是数组+链表or红黑树。



## 08、常用方法列表  

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


## 09、hashmap实现策略模式
参考：https://www.cnblogs.com/keeya/p/13187727.html
## 10、参考资料
1. [HashMap|菜鸟教程](https://www.runoob.com/java/java-hashmap.html)<br/>
2. [哈希冲突|掘金社区](https://juejin.cn/post/7088332200130658312)<br/>
3. [扩容机制|CSDN](https://dalianpai.blog.csdn.net/article/details/113726055)<br/>

