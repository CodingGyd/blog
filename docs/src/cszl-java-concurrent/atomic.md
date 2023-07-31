---
# icon: lock
date: 2023-06-26

category:
  - Java核心
tag:
  - 原子操作
---
# 原子操作

原子(atomic)含义是不能被进一步分割的最小粒子，而原子操作表示不可被中断的一个或一组操作。在多处理器上实现
原子操作是很复杂的，一般是通过总线锁和缓存锁这两个机制来保证原子性。

在Java中是通过锁和循环CAS的方式来实现原子操作的。JDK1.5的juc并发包里提供了很多原子操作类，比如AtomicBoolean、AtomicInteger、AtomicLong等。这些原子操作类还提供了有用的工具方法，比如以原子的
方式自增1和自减1

## 01、代码实例
以下代码实现了一个基于CAS线程安全的原子计数器方法safeCount和一个非线程安全的计数器count方法：


```java
package com.gyd;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicDemo {

    private AtomicInteger atomicInteger = new AtomicInteger(0);
    private int i = 0;
    public static void main(String[] args)  {
        AtomicDemo atomicDemo = new AtomicDemo();
        List<Thread> allThread = new ArrayList<>(100);
        long start = System.currentTimeMillis();
        for(int i=1;i<=100;i++) {
            Thread t = new Thread(() ->{
                for (int j=0;j<1000;j++) {
                    atomicDemo.count();
                    atomicDemo.safeCount();
                }
            });
            allThread.add(t);
        }
        for (Thread t : allThread) {
            t.start();
        }

        //等待所有线程执行完成
        for (Thread t: allThread){
            try {
                t.join();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        System.out.println(atomicDemo.i);
        System.out.println(atomicDemo.atomicInteger.get());
        System.out.println(System.currentTimeMillis()-start);

    }

    private void count(){
        i++;
    }

    private void safeCount() {
        for (;;) {
            int a = atomicInteger.get();
            boolean suc = atomicInteger.compareAndSet(a,++a);
            if (suc) break;
        }

    }

}

```
上面代码模拟100个线程对成员变量进行自增操作，从程序运行结果来看只有safeCount才能保证并发安全。

## 02、CAS操作
CAS（Compare and Swap）比较并交换，顾名思义：比较两个值，如果他们两者相等就把他们交换，CAS 也被认为是一种乐观锁。

java.util.concurrent.atomic 并发包下的所有原子类都是基于 CAS 来实现的。

- ABA问题  
  使用CAS操作进行更新时，会检测值有没有发生变化，如果没有发生变化则更新。若是值原来是A，然后变成了B，最后又变回了A。此时CAS操作检测会认为该值没有发生过变化，和实际情况不符。ABA问题的解决思路就是加上版本号，每更新一次值，就把版本号+1,最后通过比较版本号有没有变化来判断值有没有被改动过。  
  
  从jdk1.5开始，juc的atomic包里提供了类AtomicStampedReference来解决ABA问题。这个类的compareAndSet方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值。  
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
  当对一个共享变量操作时，可以使用循环CAS的方式来保证原子操作，但是如果需要对多个共享变量操作时，循环CAS就无法保证原子性了，这个时候就必须用锁机制来实现了，如synchronized、ReentrantLock等锁方式。还有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作，从Jdk1.5开始，提供了AtumicReference类来保证引用对象之间的原子性，就可以实现把多个变量放在一个对象里来进行CAS操作了。
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