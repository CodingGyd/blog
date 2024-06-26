---
# icon: lock
date: 2023-06-26

category:
  - JAVA
tag:
  - 并发编程
---

# Java中的阻塞队列
## 一、什么是阻塞队列？
::: tip 阻塞队列科普
阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。这两个附加的操作支持阻塞的插入和移除方法。  

支持阻塞的插入方法：意思是当队列满时，队列会阻塞插入元素的线程，直到队列不满。  

支持阻塞的移除方法：意思是在队列为空时，获取元素的线程会等待队列变为非空。  
:::

## 二、底层原理分析

首先说明，JAVA中的阻塞队列基本使用通知模式实现。

所谓通知模式，就是当生产者往满的队列里添加元素时会阻塞住生产者，当消费者消费了一个队列中的元素后，会通知生产者当前队列可用。

我们以ArrayBlockingQueue的元素入队和出队为例来说明下通知模式的运用。 

ArrayBlockingQueue类的元素入队方法逻辑：
> 往队列中添加元素时调用put方法
```
public void put(E e) throws InterruptedException {
    checkNotNull(e);
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        while (count == items.length)
            notFull.await();
        enqueue(e);
    } finally {
        lock.unlock();
    }
}
```
从源码可以看出put方法的大概流程是：先获取锁(用ReentrantLock)，然后判断当前队列元素总数是否已经到达最大值，如果是则while死循环执行notFull.await进行线程阻塞等待，
直到被唤醒(说明队列有空位)，唤醒后将元素加入队列中，最后释放锁，退出。

那么阻塞的核心就是上面的notFull.await动作，这是condition机制里的知识，我们先不谈，再来看看队列的元素出队方法逻辑：
> 从队列中拿元素时调用take方法
```
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        while (count == 0)
            notEmpty.await();
        return dequeue();
    } finally {
        lock.unlock();
    }
}
```
从源码可以看出take方法的大概流程是：先获取锁(用ReentrantLock)，然后判断当前队列中的元素个数是否为0，若是，则while死循环执行notEmpty.await进行线程阻塞等待，直到被唤醒(说明队列中有元素了)，
唤醒后从队列中获取元素，并释放锁,退出。


上面分析了队列元素的入队put和出队take的大概流程，都涉及到了调用await开始阻塞等待，那何时会停止阻塞继续往下执行呢？

这就涉及到通知机制的闭环了，肯定得有一个地方进行通知，告诉await方法你可以继续往下执行了，不要再等啦。

我们回到put方法源码里，有一个enqueue方法的调用，这是元素入队的真正逻辑，先来看看它的源码：
```java
private void enqueue(E x) {
    // assert lock.getHoldCount() == 1;
    // assert items[putIndex] == null;
    final Object[] items = this.items;
    items[putIndex] = x;
    if (++putIndex == items.length)
        putIndex = 0;
    count++;
    notEmpty.signal();
}
```
上面源码的大概流程是：先拷贝当前队列中的元素数组引用，然后把元素加入到数组的尾部，并将元素总数count+1，最后执行notEmpty.signal通知执行了await的取元素的线程停止阻塞，想通知的信息就是：队列中我放入元素了，你可以取走啦！。

看到这里我们一般可以猜到notEmpty.signal是和notEmpty.await相呼应的，一个等待，一个通知。

那么put方法中不是有notFull.await调用么，肯定有另外一个地方执行了notFull.signal进行通知了， 这个通知就发生在take方法执行成功之后，目的是告诉put线程：我队列空出位置了，你赶紧入队！
```java
private E dequeue() {
   // assert lock.getHoldCount() == 1;
   // assert items[takeIndex] != null;
   final Object[] items = this.items;
   @SuppressWarnings("unchecked")
   E x = (E) items[takeIndex];
   items[takeIndex] = null;
   if (++takeIndex == items.length)
       takeIndex = 0;
   count--;
   if (itrs != null)
       itrs.elementDequeued();
   notFull.signal();
   return x;
} 
```

总结一下上面的流程核心逻辑：
- 入队：A线程操作元素入队时，如果队列满了，则A线程阻塞等待，直到B线程从队列中取走一个元素，此时留出空位置了，通知A线程停止阻塞执行元素入队操作。
- 出队：B线程操作元素出队时，如果队列是空的，则B线程阻塞等待，直到A线程操作元素入队，此时队列不为空，通知A线程停止阻塞执行元素出队操作。

上面的等待唤醒机制依赖下面的两个Conditionobject: notEmpty和notFull  
```
public class ArrayBlockingQueue<E> extends AbstractQueue<E>
    implements BlockingQueue<E>, java.io.Serializable {
final ReentrantLock lock;

private final Condition notEmpty;

private final Condition notFull;
```
Condition底层是使用LockSupport.park（this）LockSupport.unpark（）来实现线程等待和唤醒机制的
  

## 三、阻塞队列的实现
Java 里目前为止提供了7个阻塞队列的实现：  

```java
//1.用数组实现的有界阻塞队列(支持公平和非公平锁)
ArrayBlockingQueue arrayBlockingQueue = new ArrayBlockingQueue(1000,false);

//2.用链表实现的有界阻塞队列(保证FIFO先进先出)
LinkedBlockingQueue linkedBlockingQueue = new LinkedBlockingQueue(1000);

//3.支持优先级的无界阻塞队列。不设置排序策略情况下元素采取的是自然顺序升序排列
PriorityBlockingQueue priorityBlockingQueue = new PriorityBlockingQueue(1000);

//4.支持延时获取元素的无界阻塞队列(队列中的元素必须实现 Delayed 接口,参考ScheduledThreadPoolExecutor 里 ScheduledFutureTask 类的实现)
DelayQueue delayQueue = new DelayQueue();

//5.不存储元素的阻塞队列。每一个 put 操作必须等待一个take 操作，否则不能继续添加元素(支持公平和非公平锁)
SynchronousQueue synchronousQueue = new SynchronousQueue(true);

//6.是一个由链表结构组成的无界阻塞 TransferQueue 队列。相对于其他阻塞队列，LinkedTransferQueue 多了 tryTransfer 和 transfer 方法。
LinkedTransferQueue linkedTransferQueue = new LinkedTransferQueue();

//7.由链表结构组成的双向阻塞队列。所谓双向队列指的是可以从队列的两端插入和移出元素
LinkedBlockingDeque linkedBlockingDeque = new LinkedBlockingDeque();
```

### 1、ArrayBlockingQueue
ArrayBlockingQueue 底层是一个用数组实现的有界阻塞队列，按照FIFO(先进先出)的顺序对队列元素进行管理。  

通过默认的构造方法构造的实例在使用时不保证线程公平的访问队列，但是可以自定义公平策略， jdk1.8中的构造方法源码如下：
```java
/**
 * 用于创建一个具有给定固定容量和默认访问策略的ArrayBlockingQueue。
 * 如果容量小于1，则会抛出IllegalArgumentException异常。
 */
public ArrayBlockingQueue(int capacity) {
    this(capacity, false);
}

/**
 * @param capacity 指定了队列的容量
 * @param fair fair 参数指定了队列的访问策略，如果为 true，则队列的访问顺序为先进先出（FIFO、公平策略），否则访问顺序是不确定的(非公平策略)
 * @throws IllegalArgumentException 如果容量小于1，则会抛出IllegalArgumentException异常。
 */
public ArrayBlockingQueue(int capacity, boolean fair) {
    if (capacity <= 0)
        throw new IllegalArgumentException();
    this.items = new Object[capacity];
    lock = new ReentrantLock(fair);
    notEmpty = lock.newCondition();
    notFull =  lock.newCondition();
}
```

### 2、LinkedBlockingQueue
LinkedBlockingQueue 底层是一个用链表实现的有界阻塞队列，此队列的默认和最大长度都是 Integer.MAX_VALUE，按照先进先出的原则对元素进行管理。  
jdk1.8中提供了三种构造方式，源码如下：
```java
    /**
     * 默认构造方法中此队列的默认和最大长度都是 Integer.MAX_VALUE
     */ 
    public LinkedBlockingQueue() {
        this(Integer.MAX_VALUE);
    }

    /**
     * @param capacity  指定了队列的容量
     * @throws IllegalArgumentException 如果容量小于 1，则会抛出异常
     */
    public LinkedBlockingQueue(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException();
        this.capacity = capacity;
        last = head = new Node<E>(null);
    }

    /**
     * 创建一个具有指定容量的LinkedBlockingQueue
     *
     * @param c 队列中要包含的初始元素集合
     * @throws NullPointerException 如果指定的集合或其任何元素为null，抛出异常
     */
    public LinkedBlockingQueue(Collection<? extends E> c) {
        this(Integer.MAX_VALUE);
        final ReentrantLock putLock = this.putLock;
        putLock.lock(); // Never contended, but necessary for visibility
        try {
            int n = 0;
            for (E e : c) {
                if (e == null)
                    throw new NullPointerException();
                if (n == capacity)
                    throw new IllegalStateException("Queue full");
                enqueue(new Node<E>(e));
                ++n;
            }
            count.set(n);
        } finally {
            putLock.unlock();
        }
    }
```


### 3、PriorityBlockingQueue
PriorityBlockingQueue 是一个无界阻塞队列，支持按指定优先级排序， 默认情况下队列中的元素采取自然顺序升序排列。  
我们也可以自定义类实现 compareTo()方法来指定元素排序规则，或者初始化PriorityBlockingQueue 时，指定一个构造参数 Comparator 来对元素进行排序。

> 注意：队列的Comparator无法保证同优先级元素的顺序，随机排序。

jdk1.8中提供了四种构造方式初始化一个无界阻塞队列，源码如下：
```java
    /**
     *  创建一个具有默认初始容量（11）的PriorityBlockingQueue，队列元素按照它们的自然顺序进行排序
     */
    public PriorityBlockingQueue() {
        this(DEFAULT_INITIAL_CAPACITY, null);
    }

    /**
     * 创建一个具有指定初始容量和自然顺序排序的PriorityBlockingQueue。
     *
     * @param initialCapacity 队列指定初始容量
     * @throws IllegalArgumentException 如果initialCapacity小于1，则抛出IllegalArgumentException异常 
     */
    public PriorityBlockingQueue(int initialCapacity) {
        this(initialCapacity, null);
    }

    /**
     * 创建一个具有指定初始容量和比较器的PriorityBlockingQueue
     *
     * @param initialCapacity 队列指定初始容量
     * @param  comparator 用于对元素进行排序的比较器。如果为null，则使用元素的自然顺序。
     * @throws IllegalArgumentException 如果initialCapacity小于1，则抛出IllegalArgumentException
     */
    public PriorityBlockingQueue(int initialCapacity,
                                 Comparator<? super E> comparator) {
        if (initialCapacity < 1)
            throw new IllegalArgumentException();
        this.lock = new ReentrantLock();
        this.notEmpty = lock.newCondition();
        this.comparator = comparator;
        this.queue = new Object[initialCapacity];
    }

    /**
     * 创建一个包含指定集合中元素的PriorityBlockingQueue。
     * 如果指定的集合是一个SortedSet或PriorityQueue，则此优先队列将按照相同的顺序排序。
     * 否则，此优先队* 列将按照元素的自然顺序进行排序
     *
     * @param  c 包含要放入优先队列的元素的集合
     * @throws ClassCastException 如果指定集合中的元素无法按照优先队列的排序规则进行比较，则抛出类型转换异常
     * @throws NullPointerException 如果指定集合或其元素为null，则抛出空指针异常
     */
    public PriorityBlockingQueue(Collection<? extends E> c) {
        this.lock = new ReentrantLock();
        this.notEmpty = lock.newCondition();
        boolean heapify = true; // true if not known to be in heap order
        boolean screen = true;  // true if must screen for nulls
        if (c instanceof SortedSet<?>) {
            SortedSet<? extends E> ss = (SortedSet<? extends E>) c;
            this.comparator = (Comparator<? super E>) ss.comparator();
            heapify = false;
        }
        else if (c instanceof PriorityBlockingQueue<?>) {
            PriorityBlockingQueue<? extends E> pq =
                (PriorityBlockingQueue<? extends E>) c;
            this.comparator = (Comparator<? super E>) pq.comparator();
            screen = false;
            if (pq.getClass() == PriorityBlockingQueue.class) // exact match
                heapify = false;
        }
        Object[] a = c.toArray();
        int n = a.length;
        if (c.getClass() != java.util.ArrayList.class)
            a = Arrays.copyOf(a, n, Object[].class);
        if (screen && (n == 1 || this.comparator != null)) {
            for (int i = 0; i < n; ++i)
                if (a[i] == null)
                    throw new NullPointerException();
        }
        this.queue = a;
        this.size = n;
        if (heapify)
            heapify();
    }
```

### 4、DelayQueue

DelayQueue 是一个可以支持指定延时获取元素的无界阻塞队列，队列使用 PriorityQueue 来实现。  

队列中的元素必须实现 Delayed 接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟时间到时才能从队列中提取元素。

Delayed的实现示例可以参考ScheduledThreadPoolExecutor 里 ScheduledFutureTask 类的实现。

jdk1.8提供了两种构造DelayQueue的方式，源码如下：  
```java
    /**
     * 创建一个初始元素为空的DelayQueue。
     */
    public DelayQueue() {}

    /**
     * 创建一个初始包含给定元素集合的DelayQueue。
     *
     * @param c 给定元素集合
     * @throws NullPointerException 如果指定的集合或其任何元素为 null，抛出该异常
     */
    public DelayQueue(Collection<? extends E> c) {
        this.addAll(c);
    }
```

### 5、SynchronousQueue

SynchronousQueue 是一种特殊的阻塞队列，不存储任何元素，它规定了生产者线程和消费者线程之间的依赖关系。对该队列的每一个 put 操作必须等待一个take 操作，也就是说当一个线程向 SynchronousQueue 中放入元素时，另一个线程可以从 SynchronousQueue 中获取该元素，但是它们之间必须要等待，直到生产者线程将元素放入 SynchronousQueue 中。相反，当一个线程从 SynchronousQueue 中获取元素时，另一个线程可以向 SynchronousQueue 中放入元素，但是它们之间也必须要等待，直到消费者线程从 SynchronousQueue 中获取元素。这种阻塞队列通常用于在没有其他线程的情况下进行通信，或者用于在单线程环境中进行同步。

jdk1.8提供了两种构造SynchronousQueue的方式，源码如下：  

```java
    /**
     * 创建一个使用非公平访问策略的无界阻塞队列
     */
    public SynchronousQueue() {
        this(false);
    }

    /**
     * 创建一个具使用公平访问策略的无界阻塞队列
     *
     * @param fair 如果为true，则等待线程将按照先进先出的顺序竞争访问权限；否则，访问顺序是不确定的。
     */
    public SynchronousQueue(boolean fair) {
        transferer = fair ? new TransferQueue<E>() : new TransferStack<E>();
    }
```

### 6、LinkedTransferQueue

LinkedTransferQueue底层是链表结构组成的无界阻塞 TransferQueue 队列，初始为空。相对于其他阻塞队列比如SynchronousQueue，LinkedTransferQueue 多了 tryTransfer 和 transfer 方法，用于在队列之间进行元素传输。    

LinkedTransferQueue 还提供了一些其他的方法，例如 hasWaitingConsumer()、hasContended() 等，用于查询队列中的元素。  

jdk1.8提供了两种构造LinkedTransferQueue的方式，源码如下：  

```java
    /**
     *创建一个初始元素为空的无界阻塞队列  
     */
    public LinkedTransferQueue() {
    }

    /**
     * 创建一个初始包含指定元素集合的无界阻塞队列。
     *
     * @param c 包含要初始包含的元素的集合，按集合的迭代器的遍历顺序添加
     * @throws NullPointerException 如果指定的集合或其任何元素为null，则抛出异常
     */
    public LinkedTransferQueue(Collection<? extends E> c) {
        this();
        addAll(c);
    }
```

### 7、LinkedBlockingDeque

LinkedBlockingDeque底层是一个由链表结构组成的双向阻塞队列。支持从队列的两端插入和移出元素。  

jdk1.8提供了三种构造LinkedTransferQueue的方式，源码如下：  

```java
 /**
     * 创建一个默认最大容量Integer.MAX_VALUE的双向阻塞队列
     */
    public LinkedBlockingDeque() {
        this(Integer.MAX_VALUE);
    }

    /**
     * 创建一个指定容量的双向阻塞队列
     *
     * @param capacity 指定容量
     * @throws IllegalArgumentException 指定容量配置<1 时抛出异常
     */
    public LinkedBlockingDeque(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException();
        this.capacity = capacity;
    }

    /**
     * 创建一个具有指定容量的双向阻塞队列，其中包含给定集合的元素，按集合的迭代器的遍历顺序添加。
     *
     * @param c 初始化时要包含的元素集合
     * @throws NullPointerException 如果指定的集合或其任何元素为null，则抛出异常
     */
    public LinkedBlockingDeque(Collection<? extends E> c) {
        this(Integer.MAX_VALUE);
        final ReentrantLock lock = this.lock;
        lock.lock(); // Never contended, but necessary for visibility
        try {
            for (E e : c) {
                if (e == null)
                    throw new NullPointerException();
                if (!linkLast(new Node<E>(e)))
                    throw new IllegalStateException("Deque full");
            }
        } finally {
            lock.unlock();
        }
    }
```