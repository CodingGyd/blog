---
# icon: lock
date: 2023-08-02

category:
  - JAVA
tag:
  - 并发编程
---

# 并发编程中常用的工具类有哪些?  

面试时经常会被问到：你了解哪些并发编程中的工具类？

<img src="http://cdn.gydblog.com/images/java/concurrent/util-class-1.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

上面的问题如果你答不上，我赌十包辣条，你这次面试肯定凉凉了。 

对于JDK提供的并发编程工具，我们必须了解常见的几种：
- 等待多线程完成的 CountDownLatch
- 同步屏障 CyclicBarrier
- 控制并发线程数的 Semaphore
- 线程间交换数据的 Exchanger

## 1、CountDownLatch

CountDownLatch 允许一个或多个线程等待其他线程完成操作。  

CountDownLatch的构造函数接收一个int类型的参数，假设你需要等待2个线程执行完再开始执行操作，那这个参数就传2。
<img src="http://cdn.gydblog.com/images/java/concurrent/util-class-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

示例代码：
```java
public class CountDownLatchTest {
  public static void main(String[] args) throws InterruptedException {
      CountDownLatch countDownLatch = new CountDownLatch(2);
      //one线程
      new Thread(()->{
          System.out.println("one");
          countDownLatch.countDown();
      }).start();

      //two线程
      new Thread(()->{
          System.out.println("two");
          countDownLatch.countDown();
      }).start();
      countDownLatch.await();
      //main线程
      System.out.println("main");
  }
}
```
示例代码实现了：main线程等待one和two这两个子线程完成一些业务操作后再继续执行main的逻辑。

:::warning 注意
countDownLatch只能被使用一次。
:::

## 2、CyclicBarrier
CyclicBarrier 的意思是可循环使用（Cyclic）的同步屏障（Barrier）。  

它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续运行。

通俗的例子就是：通常情况下，黑车司机载客时，车里要坐满人才走，但凡空了一个位置，都不发车。

CyclicBarrier 默认的构造方法接收一个int类型的参数，表示屏障计划拦截的线程个数。
每个线程调用 CyclicBarrier实例的await 方法告诉 CyclicBarrier 我已经到了你这个屏障这里，然后我开始等待(阻塞)，直到你开门我才继续执行。
<img src="http://cdn.gydblog.com/images/java/concurrent/util-class-3.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

示例代码：
```java
public class CyclicBarrierTest {
  public static void main(String[] args) throws InterruptedException {
      CyclicBarrier cyclicBarrier = new CyclicBarrier(3);

      new Thread(()->{
          System.out.println("a线程到达屏障点,开始阻塞");
          try {cyclicBarrier.await();} catch (Exception e) {}
          System.out.println("屏障开门了，a线程继续执行");
      }).start();

      new Thread(()->{
          System.out.println("b线程到达屏障点,开始阻塞");
          try {cyclicBarrier.await();} catch (Exception e) {}
          System.out.println("屏障开门了，b线程继续执行");
      }).start();

      Thread.sleep(10000);
  }
}
```
示例代码实现了a线程和b线程互相等对方到达同步点时再继续执行后续业务动作的过程。  

CyclicBarrier 可以用于并行计算数据，最后汇总计算结果的场景。  

看到这里大家是不是觉得前面介绍的CountDownLatch也能实现同样的功能？  

是的没错，CountDownLatch和CyclicBarrier都能实现同样的功能，但是他们的区别是：CountDownLatch 的计数器只能使用一次，而 CyclicBarrier 的计数器可以使用 reset()方法重置。  

程序异常是不可避免的，例如，如果计算发生错误，如果使用的CyclicBarrier，我们可以重置计数器，并让业务线程重新执行一次。

## 3、Semaphore
Semaphore（信号量）类似于限流控制器，控制并发线程数的 。比如我们去车管所办理业务，车管所某个时段就只能承载接待100人的流量，需要大家提前预约，预约人数满100人后该时段不再接待新的预约。

在代码程序里，Semaphore是用来控制同时(并发)访问特定资源的线程数量，保证合理的使用公共资源。

<img src="http://cdn.gydblog.com/images/java/concurrent/util-class-4.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

看一段示例代码：
```java
public class SemaphoreTest {
  static Semaphore s = new Semaphore(2);

  public static void main(String[] args) {
      for (int i = 0; i < 10; i++) {
          new Thread(()->{
              try {
                  s.acquire();
                  System.out.println("预约1位");
                  s.release();
              } catch (InterruptedException e) {
              }
          }).start();
      }

      System.out.println("end");

  }
}
```
示例代码创建了10个线程来执行预约动作，但同一时间只允许两个线程并发预约(new Semaphore(2))，只有拿到信号量(s.acquire)的2个线程执行完并释放了信号量(s.release)后，下一批2个线程才能继续并发执行。

Semaphore 还提供了很多其他方法，可以自行查看API。

## 4、Exchanger
Exchanger是JDK1.5以后提供的用于两个线程之间在某个时间点进行通信(数据交换)的工具。 

也就是说，一个线程到达某个时间点时，将产生的数据传递给另外一个线程，同时等待另外一个线程将它的数据传回。

Exchanger工具适合一个线程执行完一些业务逻辑后希望将数据传递给另外一个线程做下一步处理的业务场景。

两个线程无论调用时间先后，都会互相等到线程到达Exchange方法调用点，此时两个线程可以交换数据，将本线程产出数据传递给对方。

<img src="http://cdn.gydblog.com/images/java/concurrent/util-class-5.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

示例代码：
```java

public class ExchangerTest {
  public static void main(String[] args) throws InterruptedException {
      Exchanger<String> exchanger = new Exchanger<>();

      new Thread(()->{
          try {
              String bResult = exchanger.exchange("hello B");
              System.out.println("A thread: get B thread Result is "+bResult);
          } catch (InterruptedException e) {}
      }).start();

      new Thread(()->{
          try {
              String aResult = exchanger.exchange("hello A");
              System.out.println("B thread: get A thread Result is "+aResult);
          } catch (InterruptedException e) {}
      }).start();

      Thread.sleep(100);
  }
}

```
示例代码演示了两个线程之间互相打招呼并传递信息的功能。