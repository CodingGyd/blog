---
# icon: lock
date: 2023-06-26

category:
  - JAVA基础
tag:
  - 原子操作
---
# 原子操作原来这么简单

## 1、什么是原子操作?
原子(atomic)含义是不能被进一步分割的最小粒子，而原子操作表示不可被中断的一个或一组操作。在多处理器上实现原子操作是很复杂的，一般是通过总线锁和缓存锁这两个机制来保证原子性。

我们可以通过synchronized来实现一个原子操作，但jdk1.5以后提供了专门的原子操作类，让我们可以安全的更新变量的值。 

## 2、JDK中的原子操作类
在Java中是通过锁和循环CAS的方式来实现原子操作的。   

JDK1.5的java.util.cconcurrent.atomic包里提供了很多原子操作类，比如AtomicBoolean、AtomicInteger、AtomicLong等，这些原子操作类基本都是使用 Unsafe 实现的包装类。

JDK中提供的原子操作类如下：
<img src="http://cdn.gydblog.com/images/java/concurrent/atomic-1.jpg"  style="zoom: 70%;margin:0 auto;display:block"/><br/>

这些原子操作类中提供了许多有用的工具方法，比如以原子的方式自增1和自减1
### 01、原子更新基本数据类型
JDK实现了原子更新整型、长整型、布尔型基本数据，Atomic 包提供了以下 3三个类来支持:  

>- AtomicBoolean：原子更新布尔类型

>- AtomicInteger：原子更新整型

>- AtomicLong：原子更新长整型

上面三个类的底层原理和方法都基本一致，下面以AtomicLong为例来说明。

AtomicLong里常用的方法有以下几个：  
::: info AtomicLong常用方法
- boolean compareAndSet(long expect, long update)：
  如果输入的数值update等于预期值expect，则以原子方式将该值设置为输入的值update。

- int getAndSet（int newValue）
  以原子方式将当前值设置为 newValue，并返回旧值。

- long getAndIncrement()
  以原子方式将当前值加 1，并返回加1前的旧值。

- lazySet(long newValue) 
  保证最终会设置成 newValue，但当使用 lazySet 设置值后，值不一定马上变为newValue，可能导致其他线程在之后的一小段时间内还是可以读到旧的值。
:::

### 02、原子更新数组类型
我们可以通过原子操作的方式更新数组里的某个元素，JDK提供了以下 三个类：

>- AtomicIntegerArray：原子更新整型数组里的元素。

>- AtomicLongArray：原子更新长整型数组里的元素。

>- AtomicReferenceArray：原子更新引用类型数组里的元素。

::: warning
上面三个类的原理和方法都基本一致，接下来以AtomicLongArray为例来说明。
:::

AtomicIntegerArray 类主要是提供原子的方式更新数组里的整型，其常用方法如下： 
::: info AtomicIntegerArray常用方法
- int addAndGet(int i, int delta)
 以原子方式将输入值delta与数组中索引位置为i的元素相加。

- boolean compareAndSet(int i, int expect, int update)
 CAS操作，如果当前值等于预期值except，则以原子方式将数组索引位置 i 的元素设置成 update 值。
:::

### 03、原子更新引用
原子更新基本类型只能修改一个变量，而我们很多业务场景需要同时修改几个变量值，比如原子修改对象中的多个属性，这时候就需要用到这个原子更新引用类型的类。

JDK提供了以下 三个类：
>- AtomicReference：原子更新引用类型

>- AtomicReferenceFieldUpdater：原子更新引用类型里的字段

>- AtomicMarkableReference：原子更新带有标记位的引用类型。

::: warning
以上几个类提供的方法几乎一样，接下来以AtomicReference 为例进行讲解。
:::

AtomicReference的常用方法如下：
:::info AtomicReference的常用方法
- void set(V newValue)
 设置当前指向的引用变量

- V get()
  返回当前指向的引用变量

- boolean compareAndSet(V expect, V update)
 CAS操作，如果当前引用值和预期引用expect相同，则以原子方式将当前引用值更新为update值
- 
:::

### 04、原子更新属性(字段) 
很多时候我们需要原子地更新某个类里的某个字段时，就需要使用到JDK提供的原子更新属性(字段)类。

JDK 包提供了以下 三 个类进行原子字段更新：

>- AtomicIntegerFieldUpdater：原子更新整型的字段。

>- AtomicLongFieldUpdater：原子更新长整型字段。

>- AtomicStampedReference：原子更新带有版本号的引用类型
  该类将整数值与引用关联起来，可用于原子的更新数据和数据的版本号，可以解决使用 CAS 进行原子更新时可能出现的 ABA 问题。

注意：更新类的字段（属性）必须使用 public volatile 修饰符。

## 3、示例代码 
:::warning
针对每种原子操作类型，仅选取其中的一个类进行代码使用演示，其它的类使用方式基本一致
:::
### 01、AtomicLong
```java
public class AtomicLongTest {
    static AtomicLong al = new AtomicLong(1);

    public static void main(String[] args) {
		System.out.println(al.getAndSet(2));
        System.out.println(al.compareAndSet(2,3));
        al.lazySet(4);
        System.out.println(al.get());
    }
}
```

### 02、AtomicLongArray
```java
public class AtomicLongArrayTest {
    static AtomicLongArray al = new AtomicLongArray(1);

    public static void main(String[] args) {
        long[] array = new long[]{1,2};
        //注意这里构造方法内部是对array引用进行一个拷贝，之后的修改不会影响到原先的引用
        AtomicLongArray al = new AtomicLongArray(array);
 		System.out.println(al.addAndGet(0,10));
        System.out.println(al.compareAndSet(0,11,15));
        System.out.println(al.get(0));
    }
}
```

### 03、AtomicReference
```java
public class AtomicReferenceTest {

    public static void main(String[] args) {
        Bean bean = new Bean("AAA",18);
        AtomicReference<Bean> atomicReference = new AtomicReference<>();
        atomicReference.set(bean);
        atomicReference.compareAndSet(bean,new Bean("BBB",20));
        System.out.println( atomicReference.get().getAge());
        System.out.println( atomicReference.get().getName());
    }

    static class Bean{
        String name;
        int age;

        //get、set、construct代码略
    }
}

```

### 04、AtomicLongFieldUpdater
```java
public class AtomicLongFieldUpdaterTest {

    public static void main(String[] args) {
        Bean bean = new Bean("AAA",18);
        AtomicLongFieldUpdater<Bean> atomicLongFieldUpdater =  AtomicLongFieldUpdater.
                newUpdater(Bean.class,"age");
        atomicLongFieldUpdater.set(bean,20);
        System.out.println(atomicLongFieldUpdater.get(bean));
    }

    static class Bean{
        String name;
        //重点，必须设置为volatile类型
        volatile long age;
        //get、set、construct代码略
    }
}

```


## 4、CAS操作
CAS（Compare and Swap）比较并交换，顾名思义：比较两个值，如果他们两者相等就把他们交换，CAS 也被认为是一种乐观锁。

JDK的java.util.concurrent.atomic 并发包下的所有原子类都是基于 CAS 来实现的。

::: warning
CAS操作也会带来下面的问题
:::

- ABA问题  
  使用CAS操作进行更新时，会检测值有没有发生变化，如果没有发生变化则更新。若是值原来是A，然后变成了B，最后又变回了A。此时CAS操作检测会认为该值没有发生过变化，和实际情况不符。
  
  ABA问题的解决思路就是加上版本号，每更新一次值，就把版本号+1,最后通过比较版本号有没有变化来判断值有没有被改动过。  
  
  从JDK1.5开始，juc的atomic包里提供了类AtomicStampedReference来解决ABA问题。这个类的compareAndSet方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值。  
  ```java
      public boolean compareAndSet(
                V   expectedReference,//预期引用
                V   newReference,//更新后的引用
                int expectedStamp,//预期标志 比如版本号
                int newStamp//更新后的标志  比如+1后的版本号
                ) {
        Pair<V> current = pair;
        return
            expectedReference == current.reference &&
            expectedStamp == current.stamp &&
            ((newReference == current.reference &&
              newStamp == current.stamp) ||
             casPair(current, Pair.of(newReference, newStamp)));
    }
  ```
- 循环性能问题  
  自旋CAS如果长时间不成功，会占用CPU资源，带来非常大的执行开销  

- 只能保证一个共享变量的原子操作  
  当对一个共享变量操作时，可以使用循环CAS的方式来保证原子操作，但是如果需要对多个共享变量操作时，循环CAS就无法保证原子性了，这个时候就必须用锁机制来实现了，如synchronized、ReentrantLock等锁方式。  
  还有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作，从JDK1.5开始，提供了AtumicReference类来保证引用对象之间的原子性，就可以实现把多个变量放在一个对象里来进行CAS操作了。
  ```java
  package com.gyd;

    import java.util.concurrent.TimeUnit;
    import java.util.concurrent.atomic.AtomicReference;

    class BankCard{
        private String name;
        private Integer money;

        public BankCard(String name,Integer money) {
            this.money = money;
            this.name = name;
        }
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getMoney() {
            return money;
        }

        public void setMoney(Integer money) {
            this.money = money;
        }

        @Override
        public String toString() {
            return "BankCard{" +
                    "name='" + name + '\'' +
                    ", money=" + money +
                    '}';
        }
    }
    public class AtomicDemo2 {

        private static volatile  BankCard bankCard = new BankCard("张三",100);
        private static AtomicReference<BankCard> bankCard2 = new AtomicReference<>(new BankCard("张三",100));

        public static void main(String[] args) {

            //线程不安全版本
    //        putMoney();

            //线程安全版本1 使用锁 synchronized
    //        putMoneySafe1();

            //线程安全版本2 使用锁 AtomicReference
            putMoneySafe2();

        }

        //线程不安全版本
        private static void putMoney(){
            for (int i=0;i<10;i++) {
                new Thread(()->{
                    //构造一个新的账户，存入100元
                    BankCard newBankCard = new BankCard(bankCard.getName(),bankCard.getMoney()+100);

                    System.out.println(Thread.currentThread().getName()+" "+ newBankCard);
                    //把新的账户引用赋给原账户
                    bankCard = newBankCard;
                    try {TimeUnit.MICROSECONDS.sleep(1000);} catch (InterruptedException e) {throw new RuntimeException(e);}

                }).start();
            }
        }

        //线程安全版本1 使用锁 synchronized
        private static void putMoneySafe1(){
            for (int i=0;i<10;i++) {
                new Thread(()->{
                    synchronized (AtomicDemo2.class) {
                        //构造一个新的账户，存入100元
                        BankCard newBankCard = new BankCard(bankCard.getName(), bankCard.getMoney() + 100);

                        System.out.println(Thread.currentThread().getName() + " " + newBankCard);
                        //把新的账户引用赋给原账户
                        bankCard = newBankCard;
                        try {
                            TimeUnit.MICROSECONDS.sleep(1000);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }).start();
            }
        }

        //线程安全版本2 使用锁 AtomicReference
        private static void putMoneySafe2(){
            for (int i=0;i<10;i++) {
                new Thread(()->{
                        while(true) {
                            BankCard oldBankCard = bankCard2.get();
                            //构造一个新的账户，存入100元
                            BankCard newBankCard = new BankCard(oldBankCard.getName(), oldBankCard.getMoney() + 100);

                            //把新的账户引用赋给原账户
                            if(bankCard2.compareAndSet(oldBankCard,newBankCard)){
                                System.out.println(Thread.currentThread().getName() + " " + newBankCard);
                                break;
                            }
                            try {
                                TimeUnit.MICROSECONDS.sleep(1000);
                            } catch (InterruptedException e) {
                                throw new RuntimeException(e);
                            }
                        }

                }).start();
            }
        }
    }

  ```