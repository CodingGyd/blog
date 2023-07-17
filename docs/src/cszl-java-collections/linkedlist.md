---
# icon: lock
date: 2018-01-05

category:
  - Java核心
tag:
  - 集合框架
  - LinkedList
---

# LinkedList
**简介**  
链表（Linked list）是一种常见的基础数据结构，是一种线性表，但并不是按照线性的顺序存储数据，而是在每一个节点里存到下一个节点的地址。
链表可分为单向链表和双向链表。  

一个单向链表包含两个值: 当前节点的值和一个指向下一个节点的链接。  
 <img src="/images/java/collections/linkedlist-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
一个双向链表有三个整数值: 数值、向后的节点链接、向前的节点链接。  
 <img src="/images/java/collections/linkedlist-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

Java LinkedList（链表） 类似于 ArrayList，是一种常用的数据容器。与 ArrayList 相比，LinkedList 的增加和删除对操作效率更高，而查找和修改的操作效率较低。 

**特点**  

- 查找慢  
由于底层数据结构是链表，而链表中每个节点之间的内存地址是非连续的，所以只能从链表头部或者尾部查找元素，查询的时间复杂度最差为O(n)。jdk对LinkedList做了查找优化，当查找某个元素时，若index<(size/2)，则从head往后查找，否则从tail往前开始查找，但是我们在计算时间复杂度的时候，常数项会忽略，因此LinkedList的查询时间复杂度仍旧认为是O(n)。  
```java
    Node<E> node(int index) {
        // assert isElementIndex(index);

        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
```

- 增删快  
链表通过指针去访问各个元素，所以插入、删除元素只需要更改指针指向即可，因此插入、删除的时间复杂度 O(1)。

- 理论上存储元素长度无限制  
LinkedList是基于双向链表的结构来存储元素的，所以长度没有限制(受机器内存限制)，因此也不存在自动扩容机制。 

- 非线程安全  
和ArrayList一样，在多线程并发修改时会存在线程安全的问题，可以采用下面的方法解决：
```java
//方法1
Collections.synchronizedList(new LinkedList<T>())    
//方法2
LinkedList和ArrayList换成线程安全的集合，如CopyOnWriteArrayList，ConcurrentLinkedQueue  
//方法3
Vector(内部主要使用synchronized关键字实现同步)
```
 
**LinkedList 常用方法列表**  

|方法	|描述
| ----------- | ----------- |
|public boolean add(E e)	|链表末尾添加元素，返回是否成功，成功为 true，失败为 false。
|public void add(int index, E element)	|向指定位置插入元素。
|public boolean addAll(Collection c)	|将一个集合的所有元素添加到链表后面，返回是否成功，成功为 true，失败为 false。
|public boolean addAll(int index, Collection c)	|将一个集合的所有元素添加到链表的指定位置后面，返回是否成功，成功为 true，失败为 false。
|public void addFirst(E e)	|元素添加到头部。
|public void addLast(E e)	|元素添加到尾部。
|public boolean offer(E e)	|向链表末尾添加元素，返回是否成功，成功为 true，失败为 false。
|public boolean offerFirst(E e)	|头部插入元素，返回是否成功，成功为 true，失败为 false。
|public boolean offerLast(E e)	|尾部插入元素，返回是否成功，成功为 true，失败为 false。
|public void clear()	|清空链表。
|public E removeFirst()	|删除并返回第一个元素。
|public E removeLast()	|删除并返回最后一个元素。
|public boolean remove(Object o)	|删除某一元素，返回是否成功，成功为 true，失败为 false。
|public E remove(int index)	|删除指定位置的元素。
|public E poll()	|删除并返回第一个元素。
|public E remove()	|删除并返回第一个元素。
|public boolean contains(Object o)	|判断是否含有某一元素。
|public E get(int index)	|返回指定位置的元素。
|public E getFirst()	|返回第一个元素。
|public E getLast()	|返回最后一个元素。
|public int indexOf(Object o)	|查找指定元素从前往后第一次出现的索引。
|public int lastIndexOf(Object o)	|查找指定元素最后一次出现的索引。
|public E peek()	|返回第一个元素。
|public E element()	|返回第一个元素。
|public E peekFirst()	|返回头部元素。
|public E peekLast()	|返回尾部元素。
|public E set(int index, E element)	|设置指定位置的元素。
|public Object clone()	|克隆该列表。
|public Iterator descendingIterator()	|返回倒序迭代器。
|public int size()	|返回链表元素个数。
|public ListIterator listIterator(int index)	|返回从指定位置开始到末尾的迭代器。
|public Object[] toArray()	|返回一个由链表元素组成的数组。
|public T[] toArray(T[] a)	|返回一个由链表元素转换类型而成的数组。

