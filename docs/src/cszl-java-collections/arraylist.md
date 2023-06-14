---
# icon: lock
date: 2018-01-05

category:
  - Java
tag:
  - 集合
---

# ArrayList
**简介**  

java.util.ArrayList 类是一个可以动态修改的数组容器，给开发者提供了相关的添加、删除、修改、遍历等常用功能。它与普通数组的区别就是它是没有固定大小的限制，底层基于数组实现容量大小动态扩容变化，我们可以随意添加或删除元素。允许null值的存在，同时还实现了RandomAccess、Cloneable、Serializable等能力接口。所以ArrayList是支持快速访问、复制、序列化的一种结构。  

**特点**  

- 查找快  
由于底层数据结构是数组，数组在内存中是一块连续空间，因此可以根据地址+索引的方式快速获取对应位置上的元素，时间复杂度是O(1)。  

- 增删慢  
每次删除元素，都需要更改数组长度、拷贝以及移动元素位置，时间复杂度最差是O(n)。 

- 自动扩容机制  
默认数组大小是10，随着元素的增多而触发阈值自动进行扩容，每次扩容是到原先的1.5倍。   
```java
//默认的构造方法 会构造一个初始容易为10的数组
private static final int DEFAULT_CAPACITY = 10;
``` 
ArrayList的扩容主要发生在向ArrayList集合中添加元素的时候，通过add()方法添加单个元素时，会先检查容量，看是否需要扩容。如果容量不足需要扩容则调用grow()扩容方法，扩容后的大小等于扩容前大小的1.5倍，也就是10+10/2。比如说超过10个元素时，会重新定义一个长度为15的数组。然后把原数组的数据，原封不动的复制到新数组中，这个时候再把指向原数的地址换到新数组。
```java
// grow扩容方法
private void grow(int minCapacity) {
    // 记录扩容前的数组长度
    int oldCapacity = elementData.length;

    // 位运算，右移动一位。 整体相当于newCapacity =oldCapacity + 0.5 * oldCapacity
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    
    // 如果扩容后的长度小于当前的数据量，那么就将当前的数据量的长度作为本次扩容的长度
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    
    // 判断新数组的长度是否大于可分配数组的最大值
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        // 将扩容长度设置为最大可用长度
        newCapacity = hugeCapacity(minCapacity);
    // 拷贝，扩容，构建一个新的数组
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

要注意的是频繁自动扩容导致ArrayList添加性能急剧下降，因此我们使用ArrayList时，可以 new ArrayList(大小)构造方法来指定集合的大小，以减少扩容的次数，提高写入效率。

- 线程不安全  
ArrayList是非线程安全的。当开启多个线程操作List集合，向ArrayList中增加元素，同时去除元素。最后输出list中的所有数据，会出现几种情况：

①有些元素输出为Null；②数组下标越界异常。  

要保证线程安全有多种解决方案：  

第一种是选用线程安全的数组容器是Vector，它将所有的方法都加上了synchronized。
```java
public static Vector<Object> vector= new Vector<Object>(); 
```
第二种是用Collections.synchronizedList将ArrayList包装成线程安全的数组容器。
```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```
第三种是直接使用juc并发包提供的线程安全类CopyOnWriterArrayList
```java
CopyOnWriteArrayList cp = new CopyOnWriteArrayList();
```


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

 

