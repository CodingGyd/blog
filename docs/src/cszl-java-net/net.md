---
# icon: lock
date: 2023-08-07

category:
  - Java核心
---

# 网络编程入门 
## 概述
网络编程的目的: 直接或间接地通过网络协议与其它计算机实现数据交换，进行通讯。

实现网络通信需要解决的两个问题:
- 如何准确地定位网络上一台或多台主机；定位主机上的某个具体应用
- 找到主机后如何安全可靠高效地进行数据传输

## 名词解释
- 1）计算机网络
  计算机网络是指将地理位置不同的具有独立功能的多台计算机及其外部设备，通过通信线路连接起来，在网络操作系统，网络管理软件及网络通信协议的管理和协调下，实现资源共享和信息传递的计算机系统。
  计算机网络按其覆盖的地理范围可分为如下3类：
  - 局域网(LAN)：局域网是一种在小区域内使用的，由多台计算机组成的网络，覆盖范围通常局限在10 千米范围之内，属于一个单位或部门组建的小范围网。  

  - 城域网(MAN)：城域网是作用范围在广域网与局域网之间的网络，其网络覆盖范围通常可以延伸到整个城市，借助通信光纤将多个局域网联通公用城市网络形成大型网络，使得不仅局域网内的资源可以共享，局域网之间的资源也可以共享。  

  - 广域网(WAN)：广城网是一种远程网，涉及长距离的通信，覆盖范围可以是个国家或多个国家，甚至整个世界。由于广域网地理上的距离可以超过几千千米，所以信息衰减非常严重，这种网络一般要租用专线，通过接口信息处理协议和线路连接起来，构成网状结构，解决寻径问题。
 

- 2）协议
    计算机网络中，连接和通信的规则被称为网络通信协议，常见的协议有TCP、UDP等。  

    TCP协议：  
    TCP（Transmission Control Protocol，传输控制协议） 是一种面向连接的、可靠的、基于字节流的传输层通信协议，TCP 层是位于 IP 层之上，应用层之下的中间层。  
    TCP协议是Internet最基本、最广泛的协议。它定义了计算机如何连入因特网，以及数据如何在它们之间传输的标准。它的内部包含一系列的用于处理数据通信的协议，并采用了4层的分层模型，每一层都呼叫它的下一层所提供的协议来完成自己的需求。  
    TCP协议特点总结：  速度慢、没有单次传输数据大小限制、数据安全、传输可靠。
    
    UDP协议：  
    UDP （User Datagram Protocol，用户数据报协议），位于 OSI 模型的传输层，是一个面向无连接的通信协议。提供了应用程序之间要发送数据的数据报。由于UDP缺乏可靠性且属于无连接协议，所以应用程序通常必须容许一些丢失、错误或重复的数据包。  
    UDP协议特点总结：速度快、每次传输数据报被限制在64K以内、数据不安全、容易丢失数据。  


- 4）网络分层模型
  目前主要有两种，OSI参考模型以及根据OSI简化过的TCP/IP分层模型
  <img src="http://cdn.gydblog.com/images/java/net/net-1.jpg"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
  每层对应的协议：
  <img src="http://cdn.gydblog.com/images/java/net/net-5.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>
  OSI参考模型是世界互联协议标准，全球通信规范，但是它的单模型过于理想化，未能在因特网上进行广泛推广。
  而TCP/IP模型已经成为了事实上的国际标准。

- 5）Socket  
端口号与 IP 地址的组合得出一个网络套接字：Socket。  
百度百科上的解释：套接字（socket）是一个抽象层，应用程序可以通过它发送或接收数据，可对其进行像对文件一样的打开、读写和关闭等操作。套接字允许应用程序将I/O插入到网络中，并与网络中的其他应用程序进行通信。网络套接字是IP地址与端口的组合。  
也就是说套接字使用TCP提供了两台计算机之间的通信机制。 客户端程序创建一个套接字，并尝试连接服务器的套接字。当连接建立时，服务器会创建一个 Socket 对象。客户端和服务器现在可以通过对 Socket 对象的写入和读取来进行通信。java.net.Socket 类代表一个套接字，并且 java.net.ServerSocket 类为服务器程序提供了一种来监听客户端，并与他们建立连接的机制。

- 6）IP
 Internet 上的计算机（通信实体）的唯一标识叫IP，每个人的电脑在公网都会有一个独一无二的IP地址，这样互相通信时就不会传错信息了。
 IP地址根据版本可以分类为：IPv4和IPv6  
 :::info IPv4和IPv6的区别
|属性| IPv4      | IPv4 |
|----| ----------- | ----------- |
|地址长度| IPv4协议具有32位（4字节）地址长度      | IPv6协议具有128位（16字节）地址长度|
|格式|IPv4 地址的文本格式为 nnn.nnn.nnn.nnn，其中 0<=nnn<=255，而每个 n 都是十进制数。可省略前导零。   | IPv6 地址的文本格式为 xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx，其中每个 x 都是十六进制数可省略前导零。        |
|数量| 共有43亿，30亿在北美，4亿在亚洲，2011年就已经用尽 | 多到每一粒沙子都可以分配一个IPv6地址 |
:::
 		
在Java语言中使用InetAddress类代表IP。

- 7）端口port
端口号用于标识正在计算机上运行的进程，不同的进程拥有不同的端口号
```
端口的分类：
 - 公有端口：0~1023
        HTTP：80
        HTTPS：443
        FTP：21
        Telnet：23
 - 程序注册端口（分配给用户或者程序）:1024~49151
        Tomcat：8080
        MySQL：3306
        Oracle：1521
 - 动态、私有端口：49152~65535

记住一点，我们编写的程序要占用端口号的话占用1024以上的端口号，1024以下的端口号不要去占用，因为系统有可能会随时征用。
端口号本身又分为TCP端口和UDP端口，TCP的8888端口和UDP的8888端口是完全不同的两个端口。
TCP端口和UDP端口都有65535个
```
## TCP三次握手和四次挥手  
:::tip TCP三次握手
所谓三次握手(Three-way Handshake)，是指建立一个TCP连接时，需要客户端和服务器总共发送3个包。
三次握手的目的是连接服务器指定端口，建立TCP 连接并同步连接双方的序列号和确认号并交换 TCP窗口大小信息，在socket编程中，客户端执行 connect()时。将触发三次握手。
:::
<img src="http://cdn.gydblog.com/images/java/net/net-2.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


:::tip TCP四次挥手
TCP的连接是全双工的，所以连接的拆除需要单独将两个通道分别拆除，而四次挥手所做的事情就是拆除两条通道和释放资源。
:::
<img src="http://cdn.gydblog.com/images/java/net/net-3.jpg"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

总结一下：  
三次握手： 最少需要三次，保证稳定连接！ ①A：你瞅啥？ ②B：瞅你咋地？ ③A：干一场！
四次挥手 情人节版本： ①A：分手吧！ ②B：真的要分手吗？ ③B：（确认一次）真的真的要分手吗？ ④A：分手！

## JAVA的API介绍
> 使用Java进行网络编程时，由虚拟机实现了底层复杂的网络协议，Java程序只需要调用Java标准库提供的接口，就可以简单高效地编写网络程序。JAVA中对网络编程的支持都封装在java.net包中，并提供了两种常见的网络协议的支持：TCP和UDP。

TCP是可靠的连接，TCP就像打电话，需要先打通对方电话，等待对方有回应后才会跟对方继续说话，也就是一定要确认可以发信息以后才会把信息发出去。TCP上传任何东西都是可靠的，只要两台机器上建立起了连接，在本机上发送的数据就一定能传到对方的机器上。  

UDP就好比发电报，发出去就完事了，对方有没有接收到它都不管，所以UDP是不可靠的。  

TCP传送数据虽然可靠，但传送得比较慢；UDP传送数据不可靠，但是传送得快。

下面针对JAVA中提供的TCP和UDP相关支持API进行总结。

### TCP网络编程(Socket编程)
> JAVA提供的类 ServerSocket 和 Socket 实现了基于 TCP 协议网络程序。  

我们将TCP协议简化一下，就只有三个核心功能：建立连接、发送数据以及接收数据，这就是Socekt编程的几个步骤了。

搞懂什么是Socket后，无论是Java还是C#，或是其它语言，Socket编程的步骤都类似的。

以下步骤在两台计算机之间使用套接字建立TCP连接时会出现：

> 1）服务器实例化一个 ServerSocket 对象，表示通过服务器上的端口通信。

> 2）服务器调用 ServerSocket 类的 accept() 方法，该方法将一直等待，直到客户端连接到服务器上给定的端口。

> 3）服务器正在等待时，一个客户端实例化一个 Socket 对象，指定服务器名称和端口号来请求连接。

> 4）Socket 类的构造函数试图将客户端连接到指定的服务器和端口号。如果通信被建立，则在客户端创建一个 Socket 对象能够与服务器进行通信。

> 5）在服务器端，accept() 方法返回服务器上一个新的 socket 引用，该 socket 连接到客户端的 socket。

> 6）连接建立后，通过使用 I/O 流在进行通信，每一个socket都有一个输出流和一个输入流，客户端的输出流连接到服务器端的输入流，而客户端的输入流连接到服务器端的输出流。
<img src="http://cdn.gydblog.com/images/java/net/net-4.png"  style="zoom: 100%;margin:0 auto;display:block"/><br/>

::: info JAVA的Socket编程API
针对上面的每个步骤，Java中提供了友好的API供我们调用，下面分别进行介绍。
:::

- 1）服务器应用程序通过使用 java.net.ServerSocket 类以获取一个端口,并且侦听客户端请求。

ServerSocket 类有四个构造方法：
```java
//创建绑定到特定端口的服务器套接字
public ServerSocket(int port) throws IOException

//利用指定的 backlog 创建服务器套接字并将其绑定到指定的本地端口号
public ServerSocket(int port, int backlog) throws IOException

//使用指定的端口、侦听 backlog 和要绑定到的本地 IP 地址创建服务器
public ServerSocket(int port, int backlog, InetAddress address) throws IOException

//创建非绑定服务器套接字。
public ServerSocket() throws IOException
```

ServerSocket 类有四个常用方法：
```java
//返回此套接字在其上侦听的端口
public int getLocalPort()

//侦听并接受到此套接字的连接
public Socket accept() throws IOException

//通过指定超时值启用/禁用 SO_TIMEOUT，以毫秒为单位
public void setSoTimeout(int timeout)

//将 ServerSocket 绑定到特定地址（IP 地址和端口号）
public void bind(SocketAddress host, int backlog)
```

- 2）客户端要获取一个 Socket 对象通过实例化 ，而 服务器获得一个 Socket 对象则通过 accept() 方法的返回值。
java.net.Socket 类代表客户端和服务器都用来互相沟通的套接字。

Socket 类有五个构造方法:
> Socket 构造方法返回，并没有简单的实例化了一个 Socket 对象，它实际上会尝试连接到指定的服务器和端口。
```java
//创建一个流套接字并将其连接到指定主机上的指定端口号。
public Socket(String host, int port) throws UnknownHostException, IOException.

//创建一个流套接字并将其连接到指定 IP 地址的指定端口号。
public Socket(InetAddress host, int port) throws IOException

//创建一个套接字并将其连接到指定远程主机上的指定远程端口。
public Socket(String host, int port, InetAddress localAddress, int localPort) throws IOException.

//创建一个套接字并将其连接到指定远程地址上的指定远程端口。
public Socket(InetAddress host, int port, InetAddress localAddress, int localPort) throws IOException.

//通过系统默认类型的 SocketImpl 创建未连接套接字
public Socket()
```

Socket 类有八个常用方法：
```java
//将此套接字连接到服务器，并指定一个超时值。
public void connect(SocketAddress host, int timeout) throws IOException
// 返回套接字连接的地址。
public InetAddress getInetAddress()
//返回此套接字连接到的远程端口。
public int getPort()
//返回此套接字绑定到的本地端口。
public int getLocalPort()
//返回此套接字连接的端点的地址，如果未连接则返回 null。
public SocketAddress getRemoteSocketAddress()
//返回此套接字的输入流。
public InputStream getInputStream() throws IOException
//返回此套接字的输出流。
public OutputStream getOutputStream() throws IOException
//关闭此套接字。
public void close() throws IOException
```
注意客户端和服务器端都有一个 Socket 对象，所以无论客户端还是服务端都能够调用上面这些方法。

#### 简单示例
> 客户端发送信息给服务端并获得服务端的返回数据显示到控制台，服务端将数据显示在控制台上

> 服务端实例
```java
public class SocketServerDemo{

    private ServerSocket serverSocket;

    SocketServerDemo(int port) throws IOException {
        serverSocket = new ServerSocket(port);
    }

    public void start() {
        while(true) {
            try {
                System.out.println("等待客户端连接，本端口号为：" + serverSocket.getLocalPort() + "...");
                Socket server = serverSocket.accept();//阻塞等待
                System.out.println("远程主机地址：" + server.getRemoteSocketAddress());
                DataInputStream in = new DataInputStream(server.getInputStream());
                System.out.println("收到客户端信息："+in.readUTF());
                DataOutputStream out = new DataOutputStream(server.getOutputStream());
                out.writeUTF("客户端你好，我是服务端：" + server.getLocalSocketAddress() + "\nGoodbye!");
                server.close();
            }catch(SocketTimeoutException s) {
                System.out.println("Socket timed out!");
                break;
            }catch(IOException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    public static void main(String[] args) throws IOException {
        try {
            new SocketServerDemo(6666).start();
        }catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```
> 客户端实例
```java
public class SocketClientDemo {
    public static void main(String[] args) throws IOException {
        Socket client = new Socket("127.0.0.1",6666);
 
        OutputStream outToServer = client.getOutputStream();
        DataOutputStream out = new DataOutputStream(outToServer);

        out.writeUTF("你好呀，socket服务端,我是" + client.getLocalSocketAddress());

        InputStream inFromServer = client.getInputStream();
        DataInputStream in = new DataInputStream(inFromServer);
        System.out.println("来自服务端的回应:"+in.readUTF());
    }
}
```


### UDP网络编程
> Java提供的类 DatagramSocket 和 DatagramPacket 实现了基于 UDP 协议网络程序。

::: info 介绍
- DatagramPacket 对象封装了 UDP 数据报，在数据报中包含了发送端的 IP 地址和端口号以及接收端的 IP 地址和端口号。
- UDP 协议中每个数据报都给出了完整的地址信息，因此无须建立发送方和接收方的连接。如同发快递包裹一样。
- UDP 数据报通过数据报套接字 DatagramSocket 发送和接收，系统不保证 UDP 数据报一定能够安全送到目的地，也不能确定什么时候可以抵达。
:::

UDP的两个常用构造方法：
```java
//构造一个 DatagramPacket用于接收指定长度的数据报包到缓冲区中
DatagramPacket(byte[] buf, int offset, int length)
//构造用于发送指定长度的数据报包到指定主机的指定端口号上
DatagramPacket(byte[] buf, int offset, int length, InetAddress address, int port)
```

UDP的三个常用方法:
```java
//返回数据报包中的数据
byte[] getData() 
//返回该数据报发送或接收数据报的计算机的IP地址
InetAddress getAddress() 
//返回要发送的数据的长度或接收到的数据的长度
int getLength() 
```
#### 单播、组播、广播
UDP支持三种通信方式：单播、组播、广播。只有UDP有广播和多播， TCP只能进行点对点的单播， 多播的重点是高效的把同一个包尽可能多的发送到不同的，甚至可能是未知的设备。但是TCP连接是一对一明确的，只能单播。

1）单播
单播是客户端与服务器之间的点到点连接。只能是发送方往接收方指定的IP 端口发送数据。

2）组播
组播可以多设置一个IP（这里称为为组播地址224打头的），发送方除了可以往接收方绑定的IP发送，也可以往接收方设置的组播ip发送数据。   

组播也被叫为多播，多播使用的是D类IP地址， 被划分为局部链接多播地址、预留多播地址和管理权限多播地址三类。  

|IP地址|   说明    |  
|----| ----------- |  
|244.0.0.0~244.0.0.255| 局部链接多播地址：是为路由协议和其它用途保留的地址，路由器并不转发属于此范围的IP包  |
|244.0.1.0~244.0.1.255| 预留多播地址：公用组播地址，可用于Internet；使用前需要申请  |
|244.0.2.0~238.255.255.255| 预留多播地址：用户可用组播地址(临时组地址)，全网范围内有效  |
|239.0.0.0~239.255.255.255| 本地管理组播地址，可供组织内部使用，类似于私有 IP 地址，不能用于 Internet，可限制多播范围 |

3）广播  
广播是主机之间一对所有”的通讯模式，广播者可以向网络中所有主机发送信息。广播顾名思义，就是向局域网内所有的人说话，但是广播还是要指明接收者的端口号的，因为不可能接受者的所有端口都来收听广播。  
广播禁止在Internet宽带网上传输（广播风暴），一般只是在局域网中使用该模式。  
广播与单播的区别就是IP地址不同，广播使用广播地址255.255.255.255，将消息发送到在同一广播网络上的每个主机。

必须强调一下：本地广播信息是不会被路由器允许转发。这是十分容易理解的，因为如果路由器转发了广播信息，那么势必会引起网络瘫痪。这也是为什么IP协议的设计者故意没有定义互联网范围的广播机制的原因。

广播地址通常用于在网络游戏中处于同一本地网络的玩家之间交流状态信息等。

#### 简单示例
> 服务端实例
```java
public class UdpServerDemo {
    public static void main(String[] args) throws IOException {
        DatagramSocket  socket = new DatagramSocket(8088);
        byte[] data = new byte[100];
        DatagramPacket packet = new DatagramPacket(data,0,data.length);
        socket.receive(packet);
        System.out.println(new String(packet.getData(),0,packet.getLength()));
        socket.close();
    }
}
```
> 客户端实例
```java
public class UdpClientDemo {
    public static void main(String[] args) throws IOException {
        DatagramSocket  socket = new DatagramSocket();
        String str = "你好我是UDP";
        byte[] data = str.getBytes();
        InetAddress inet = InetAddress.getLocalHost();
        DatagramPacket packet = new DatagramPacket(data,0,data.length,inet,8088);
        socket.send(packet);
        socket.close();
    }
}
```
 