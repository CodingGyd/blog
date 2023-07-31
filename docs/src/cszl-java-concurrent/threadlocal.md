---
# icon: lock
date: 2023-07-03

category:
  - Java核心
tag:
  - threadlocal
---
# ThreadLocal的用法
## 01、原理
ThreadLocal(线程本地变量)，是一个以 ThreadLocal 对象为键、任意对象为值的存储结构，底层是map键值对方式。  

查看Thread类源码可以看到每个线程实例都会有自己的一个成员变量threadLocalMap：   
```java
ThreadLocal.ThreadLocalMap threadLocals = null;
```

ThreadLocalMap这个结构被附带在每个线程上，也就是说一个线程可以根据一个ThreadLocal对象查询到绑定在这个线程上的一个值。我们可以通过 set(T)方法来设置一个值，在当前线程下再通过 get()方法获取到原先设置的值。  通过ThreadLocalMap的set方法可以看出，ThreadLocalMap是一个哈希表结构。set方法是将value插入到哈希表中的操作。插入可能会出现哈希冲突，使用了线性探测再散列法解决。ThreadLocalMap的key是当前的ThreadLocal。  

查看set方法源码:
```java
    public void set(T value) {
        //获取当前线程引用
        Thread t = Thread.currentThread();
        //获取当前线程的成员变量threadLocalMap
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            // 将值存储到ThreadLocalMap中
            map.set(this, value);
        } else {
            // 创建ThreadLocalMap，并存储值
            createMap(t, value);
        }
    }

    //获取当前线程的成员变量threadLocalMap
    ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }

    //创建ThreadLocalMap，并存储值
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }


```

查看get方法源码:
```java
    public T get() {
        //获取当前线程引用
        Thread t = Thread.currentThread();
        //获取当前线程的成员变量threadLocalMap
        ThreadLocalMap map = getMap(t);
        //获取值
        if (map != null) {
            ThreadLocalMap.Entry e = map.getEntry(this);
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
    }
```

在后端开发中，ThreadLocal有大量的应用场景，尤其是在并发访问的场景下用来保障并发数据安全，比如Spring采用Threadlocal的方式，来保证单个线程中的数据库操作使用的是同一个数据库连接。还有比如用于web场景保存用户信息。  

## 02、使用示例
ThreadLocal是一个泛型类，泛型表示ThreadLocal可以存储的类型，它的使用非常简单。  

举个例子，统计主线程和子线程各自的执行耗时，代码如下：  
```java
public class ThreadLocalDemo {

    public static void main(String[] args) throws InterruptedException {

        TimeRecorder timeRecorder = new TimeRecorder();
        timeRecorder.begin();
        TimeUnit.SECONDS.sleep(1);

        timeRecorder.end();

        new Thread(()->{
            TimeRecorder r = new TimeRecorder();
            r.begin();
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            for (int i=0;i<100000000;i++) {
            }
            r.end();
        }).start();

    }


}
class TimeRecorder {
    private static final ThreadLocal<Long> time = new ThreadLocal<>();

    public void begin() {
        time.set(System.currentTimeMillis());
    }

    public void end() {
        long t = System.currentTimeMillis()-time.get();
        System.out.println(Thread.currentThread().getName()+" 耗时："+t);
    }
}
```

上面演示了main线程和子线程分别统计各自执行耗时的逻辑。


## 03、内存泄漏问题  
通过查看ThreadLocal源码得知，其中的map元素结构entry继承了一个弱引用WeakReference：
```java
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }
```

为什么ThreadLocalMap中的Entry要继承WeakReference，使ThreadLocal作为一个弱引用呢？我们知道，弱引用在发生GC时这个对象一定会被回收。通常来说使用弱引用是为了避免内存泄漏。这里也不例外，ThreadLocal使用弱引用可以避免内存泄漏问题的发生。

然而，仅仅将Entry继承WeakReference，只依赖这一点来避免内存泄漏是不太现实的。因为在使用ThreadLocal时存在以下引用链路：
<img src="http://cdn.gydblog.com/images/java/concurrent/threadlocal-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

如果我们的Thread一直在运行，Value是强引用的类型，那么此时由于强引用的Value无法被GC自动回收，此种情况下也可能出现内存泄漏的问题。因此，一般情况下，在不需要使用这个ThreadLocal变量的使用，需要主动调用ThreadLocal.remove方法来避免内存泄漏的风险。
