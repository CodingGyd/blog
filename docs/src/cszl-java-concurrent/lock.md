---
# icon: lock
date: 2023-06-26

category:
  - Java
tag:
  - 并发编程
  - 锁
---
# 锁的那些事
## 锁的常见分类
<img src="/images/java/concurrent/lock-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 乐观锁和悲观锁

### 乐观锁 
乐观锁是指认为自己在使用数据时不会有别的线程来修改数据，所以不会添加锁。
在JAVA中是通过无锁编程来实现，只是在最后更新数据的时候才去判断之前有没有别的线程更新了这个数据，此时会出现两种判断：
- 如果这个数据没有被别的线程更新，则当前线程将自己修改的数据写入。
- 如果这个数据已经被别的线程更新，则当前线程可以选择放弃修改或者重新获取最新数据进行重新修改。

判断的规则常用如下方式：
- version版本号机制
- cas算法(java中atomic包中的递增操作就算通过CAS自旋实现的)


乐观锁适合读操作多的场景，不加锁能大大提高并发性能。

### 悲观锁

悲观锁认为自己使用数据时肯定会有别的线程也来竞争操作，在使用之前先加锁，确保数据不会被别的线程修改。  

在java中synchronized关键字和lock的api原理都是悲观锁。  

悲观锁适合写操作多的场景，性能相对乐观锁要差。

**synchronized**  
synchronized可以用于修饰实例方法、静态方法、代码块。当一个线程试图访问同步代码时必须首先获得锁，正常退出或者抛出异常时必须释放锁。  
- 修饰实例方法  
一个对象里如果有多个synchronized方法，某一个时刻内，只要有一个线程去调用其中的任何一个synchronized方法了，其它的线程都只能等待，也就是说，某一个时刻内，只能有一个线程去访问这些synchronized方法。synchronized锁的是当前对象this，被锁定后，其它的线程都不能进入到当前对象的其它的synchronized方法
```java
    public synchronized void printB(){
        System.out.println("BBBBB");
    }

```
作用于实例方法时，当前实例枷锁，进入同步代码前要抢到当前实例的锁才可以继续执行，否则阻塞。

- 修饰静态方法  

对于静态同步方法，锁的是当前类的class对象，所有该类的实例都受影响。也就是说一旦一个静态同步方法获取锁之后，其他的静态同步方
法都必须等待该方法释放锁后才能获取锁。
```java
    public static synchronized void printB(){
        System.out.println("BBBBB");
    }

```
作用于静态方法，当前类加锁，进入同步代码前要抢到当前类class对象的锁才可以继续执行，否则阻塞。

- 修饰同步代码块
```java
    public void printB(){
      synchronized() {
        System.out.println("BBBBB");
      }
    }
```
作用于代码块，对括号里配置的对象加锁。


这里提一下阿里开发手册中的几个用锁原则：  
- 尽可能使加锁的代码块工作量尽可能的小，避免在锁代码块中调用rpc方法或者耗时的io操作。
- 能锁代码块，就不要锁整个方法体；能用对象锁，就不要用类锁。

