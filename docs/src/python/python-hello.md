---
title: Python学习笔记
shortTitle: Python学习笔记
date: 2024-01-22
category:
  - Python基础
head:
  - - meta
    - name: keywords
      content: Python介绍,HelloWorld,Python开发环境
---


# python学习笔记

>  本文是小郭在学习Python时按个人习惯总结的学习笔记，记录在此，方便后续查阅。

## 1、起源

python是著名的“龟叔”Guido van Rossum在1989年圣诞节期间，为了打发无聊的圣诞节而编写的一个编程语言。

吉多·范罗苏姆（Guido van Rossum） ，是一名荷兰计算机程序员。为什么在中国被人叫`龟叔`呢？因为 吉多·范罗苏姆(Guido van Rossum)中的Guido（吉多），**拼音（哥威龟）Gui 龟**，所以被中国程序员**戏称**为“龟叔”。

<img src="http://cdn.gydblog.com/images/python/python-1.png"  style="zoom: 30%;margin:0 auto;display:block"/>



1989年圣诞节期间，在阿姆斯特丹，Guido为了打发圣诞节的无趣，决心开发一个新的脚本解释程序，作为ABC语言的一种继承。之所以选中单词Python（意为大蟒蛇）作为该编程语言的名字，是因为英国20世纪70年代首播的电视喜剧《蒙提·派森的飞行马戏团》（Monty Python's Flying Circus）。

ABC语言是由Guido参加设计的一种教学语言。Guido本人认为ABC这种语言非常优美和强大，是专门为非专业程序员设计的。但是ABC语言并没有成功，究其原因，Guido认为是其非开放造成的。Guido决心在Python中避免这一错误。同时，他还想实现在ABC中闪现过但未曾实现的东西。

## 2、优缺点

**说说缺点**

- 运行速度慢

   和C程序相比非常慢，因为Python是解释型语言，代码在执行时会一行一行地翻译成CPU能理解的机器码，这个翻译过程非常耗时，所以很慢。而C程序是运行前直接编译成CPU能执行的机器码，所以非常快。

- 源代码不能加密

   如果要发布Python程序，实际上就是发布源代码。如果需要一段关键代码运行得更快或者希望某些算法不公开，可以部分程序用C或C++编写，然后在Python程序中使用它们。

**说说优点**

- 丰富的类库

​		Python的库很庞大。它可以帮助处理各种工作，包括正则表达式、文档生成、单元测试、线程、数据库、网页浏览器、CGI、		FTP、电子邮件、XML、XML-RPC、HTML、WAV文件、密码系统、GUI（图形用户界面）、Tk和其他与系统有关的操作。这被称		作Python的“功能齐全”理念。除了标准库以外，还有许多其他高质量的库，如wxPython、Twisted和Python图像库等等

其它优点：规范的代码、简单易学、速度较快、免费开源、面向对象、可扩展、可嵌入等等优点。



## 3、谁在用？

许多大型网站就是用Python开发的，例如YouTube、Instagram，还有国内的豆瓣。很多大公司，包括Google、Yahoo等，甚至NASA（美国航空航天局）都大量地使用Python。很多在线游戏的后台也都是Python开发的。

在国外用Python做科学计算的研究机构也日益增多，一些知名大学已经采用Python来教授程序设计课程。例如卡耐基梅隆大学的编程基础、麻省理工学院的计算机科学及编程导论就使用Python语言讲授。众多开源的科学计算软件包都提供了Python的调用接口，例如著名的计算机视觉库OpenCV、三维可视化库VTK、医学图像处理库ITK。而Python专用的科学计算扩展库就更多了，例如如下3个十分经典的科学计算扩展库：NumPy、SciPy和matplotlib，它们分别为Python提供了快速数组处理、数值运算以及绘图功能。因此Python语言及其众多的扩展库所构成的开发环境十分适合工程技术、科研人员处理实验数据、制作图表，甚至开发科学计算应用程序。

**适用领域总结** 

- 网络爬虫：只要提到爬虫技术，都会提及到Python，Python几乎是霸主地位，想爬什么就爬什么；

- 自动化测试：编写为简单的实现脚本，运用在Selenium/lr中，实现自动化；

- 数据分析：实现数据可视化，直观的展示数据；

- 网站开发：借助django,flask框架自己搭建网站；

- 人工智能：Python由于简便、库多、可读性强、可植入等优点，被作为人工智能的主要开发语言；

- 自动化运维：自动化处理大量的运维任务，系统管理员需要的脚本任务等等；

- 金融分析：目前为止，Python是金融分析、量化交易领域用的最多的语言；

- 游戏开发：在网络游戏开发中Python也有很多应用。网易的两大游戏客户端引擎（NeoX和Messiah），都是使用Python作为脚本语言的；

- 日常小工具：许多日常需要的小工具都可以考虑用Python开发，可以提高工作效率。

## 4、环境安装

> 截止20240115，Python最新的稳定版是3.12.1

根据Windows版本（64位还是32位）从Python的官方网站下载Python 对应的最新[安装程序](https://www.python.org/downloads/windows/)，然后，运行下载的exe安装包：

<img src="http://cdn.gydblog.com/images/python/python-2.png"  style="zoom: 30%;margin:0 auto;display:block"/>

特别要注意勾上`Add Python 3.x to PATH`，然后点“Install Now”即可完成安装。

**运行Python**

安装成功后，打开命令提示符窗口，敲入python后，出现下面情况：

<img src="http://cdn.gydblog.com/images/python/python-3.png"  style="zoom: 30%;margin:0 auto;display:block"/>

看到上面的画面，就说明Python安装成功！

看到提示符`>>>`就表示我们已经在Python交互式环境中了，可以输入任何Python代码，回车后会立刻得到执行结果。现在，输入`exit()`并回车，就可以退出Python交互式环境（直接关掉命令行窗口也可以）。

## 5、第一个程序

### 1）开发工具选型

支持Python的编辑器有非常多，下面摘录了百度百科中介绍的工具：

- IDLE：Python内置IDE（随python安装包提供）

- PyCharm：详见百度百科PyCharm，由著名的JetBrains公司开发，带有一整套可以帮助用户在使用Python语言开发时提高其效率的工具，比如调试、语法高亮、Project管理、代码跳转、智能提示、自动完成、单元测试、版本控制。 [10]此外，该IDE提供了一些高级功能，以用于支持Django框架下的专业Web开发。

- Komodo和Komodo Edit：后者是前者的免费精简版

- Spyder：安装Anaconda自带的高级IDE

- PythonWin：ActivePython或pywin32均提供该IDE，仅适用于Windows

- SPE（Stani's Python Editor）：功能较多的自由软件，基于wxPython

- Ulipad：功能较全的自由软件，基于wxPython；作者是中国Python高手limodou

- WingIDE：可能是功能最全的IDE，但不是自由软件（教育用户和开源用户可以申请免费key）

- Eric：基于PyQt的自由软件，功能强大。全名是：The Eric Python IDE

- DrPython

- PyScripter：使用Delphi开发的轻量级的开源Python IDE，支持Python2.6和3.0。

- PyPE：一个开源的跨平台的PythonIDE。

- bpython：类Unix操作系统下使用curses库开发的轻量级的Python解释器。语法提示功能。

- eclipse+pydev插件：方便调试程序

- emacs：自带python支持，自动补全、refactor等功能需要插件支持

- Vim：最新7.3版编译时可以加入python支持，提供python代码自动提示支持

- Visual Studio 2003+VisualPython：仅适用Windows，已停止维护，功能较差

- SlickEdit

- Visual Studio 2010+Python Tools for Visual Studio

- TextMate

- Netbeans IDE

- Sublime

- ipython
- Visual Studio Code

另外，诸如Notepad++、EditPlus、UltraEdit等通用的程序员文本编辑器软件也能对Python代码编辑提供一定的支持，比如代码自动着色、注释快捷键等，但是否够得上集成开发环境的水平，尚有待评估。

小郭在学习Python选择了轻量级的Visual Studio Code作为python的编写环境。

### 2）源代码编写

打开Visual Studio Code，新建`hello.py`文件，然后输入如下内容：

```
#!/usr/bin/env python3
print('hello, world')
```

### 3）运行

在`hello.py`文件目录下打开命令行窗口，输入`python hello.py`，回车，即可运行：

```
D:\code\python>python hello.py
hello, world
```

## 6、语法总结

> 默认读者和小郭一样 已经有较好的Java语言基础

### 6.1、数据类型

#### 1）整型

**Python示例**

 Python可以处理任意大小的整数，包括负整数，在程序中的表示方法和数学上的写法一模一样，例如：`1`，`100`，`-8080`，`0`，等等。

对于很大的数，例如`10000000000`，很难数清楚0的个数。Python允许在数字中间以`_`分隔，因此，写成`10_000_000_000`和`10000000000`是完全一样的。十六进制数也可以写成`0xa1b2_c3d4`。

```
number = 9223372036854775808 
number = 10_000_000_000
```



**Java示例**

对于整型类型，Java只定义了带符号的整型，因此，最高位的bit表示符号位（0表示正数，1表示负数）。各种整型能表示的最大范围如下：

- byte：-128 ~ 127
- short: -32768 ~ 32767
- int: -2147483648 ~ 2147483647
- long: -9223372036854775808 ~ 9223372036854775807

```
byte i = 0;
short i1 = 100;
int i2 = 2147483647;
int i3 = -2147483648;
int i4 = 2_000_000_000; // 加下划线更容易识别
int i5 = 0xff0000; // 十六进制表示的16711680
int i6 = 0b1000000000; // 二进制表示的512
long n1 = 9000000000000000000L; // long型的结尾需要加L
long n2 = 900; // 没有加L，此处900为int，但int类型可以赋值给long
long n6 = 900L; // 错误：不能把long型赋值给int
```



#### 2）浮点型

> 浮点类型的数就是小数，因为小数用科学计数法表示的时候，小数点是可以“浮动”的，如1234.5可以表示成12.345x102，也可以表示成1.2345x103，所以称为浮点数。

**Python示例**

```
# 直接写小数就是浮点型
pi = 3.14159  
```

**Java示例**

```
float a = 1;
float a1 = 1f;
float a2 = 1.2f;
double b = 1;
double b1 = 1d;
double b2 = 1.2;
double b3 = 1.2d;
float f1 = 3.14f;
float f2 = 3.14e38f; // 科学计数法表示的3.14x10^38
double d = 1.79e308;
double d2 = -1.79e308;
double d3 = 4.9e-324; // 科学计数法表示的4.9x10^-324
```

#### 3）字符串

字符串是以单引号`'`或双引号`"`括起来的任意文本，比如`'qwe'`，`"dfg"`等等。如果`'`本身也是一个字符，那就可以用`""`括起来，比如`"what's that"`包含的字符是`w，h，a，t，`'`，`空格，t，h，a，t`，这10个字符。如果字符串内部既包含`'`又包含`"`怎么办？可以用转义字符`\`来标识，比如：'I\'m \"OK\"!' 表示的字符串是 I'm "OK"!

**Python示例**

```
print('qwe')
print("dfg")
print('I\'m fine.')
```

输出如下：

```
qwe
dfg
I'm fine.
```

转义字符`\`可以转义很多字符，比如`\n`表示换行，`\t`表示制表符，字符`\`本身也要转义，所以`\\`表示的字符就是`\`

例如：

```
print('I like \nPython.')
```

输出如下：

```
I like
Python.
```



计算字符串的长度：

```
len('QWE')
len('中文字符串')
```



由于Python源代码也是一个文本文件，所以，当源代码中包含中文的时候，在保存源代码时，就需要务必指定保存为UTF-8编码。当Python解释器读取源代码时，为了让它按UTF-8编码读取，我们通常在文件开头写上这两行：

```python
#!/usr/bin/env python3     //第一行注释是为了告诉Linux/OS X系统，这是一个Python可执行程序，Windows系统会忽略这个注释；
# -*- coding: utf-8 -*-     //第二行注释是为了告诉Python解释器，按照UTF-8编码读取源代码，否则，你在源代码中写的中文输出可能会有乱码。

```



格式化处理：

```python
print('Hi, %s, you have $%d.' % ('code-guo', 2000000))
//格式化整数和浮点数还可以指定是否补0和整数与小数的位数：
print('%2d-%02d' % (3, 1))
print('%.2f' % 3.1415926)   
```

输出如下：

```
Hi, code-guo, you have $2000000.
 3-01
3.14
```

`%`运算符就是用来格式化字符串的。在字符串内部，`%s`表示用字符串替换，`%d`表示用整数替换，有几个`%?`占位符，后面就跟几个变量或者值，顺序要对应好。如果只有一个`%?`，括号可以省略。如果不太确定用什么占位符，用`%s`准没错

常见的占位符有：

| 占位符 | 替换内容     |
| :----- | :----------- |
| %x     | 十六进制整数 |
| %d     | 整数         |
| %f     | 浮点数       |
| %s     | 字符串       |



**Java示例**

Java中语法和Python类似，区别就是必须用`String` 定义变量为一个字符串

```java
String str = "这是一个字符串";
String str1 = "qwe";
String str2 = "dfg";
String str3 = "I\'m man.";
String str4 = "I like \nPython.";
System.out.println(str);
System.out.println(str1);
System.out.println(str2);
System.out.println(str3);
System.out.println(str4);

//计算字符串的长度
int length = str.length();
```



#### 4）列表list

list是一种有序的集合，可以随时添加和删除其中的元素。

**Python示例**

> list在Python语言中是内置的一种数据类型。是可变长的列表

```python
#!/usr/bin/env python3
names = ['张三', '李四', '王五']
print(names)

#获取列表长度
len = len(names)
print(len)

#取指定索引范围的元素
subNames = names[0:2]
print(subNames)

#获取指定索引位置的元素
print(names[0])
print(names[1])
print(names[2])

#获取最后一个元素的两种方式
print(names[len - 1])
print(names[-1])

#ist是一个可变的有序表，可以往list中追加元素到末尾：
names.append('赵二')
print(names[-1])

#也可以把元素插入到指定的位置，比如索引号为1的位置：
names.insert(1, '赵三')
print(names[1])

#要删除list末尾的元素，用pop()方法：
names.pop(1)
print(names[-1])

#要把某个元素替换成别的元素，可以直接赋值给对应的索引位置：
names[1] = 'XXX'
print(names[1])

#list里面的元素的数据类型也可以不同，比如：
L = ['郭六', 123, True]
print(L)

#list元素也可以是另一个list，比如：s可以看成是一个二维数组，类似的还有三维、四维……数组，不过很少用到
s = ['python', 'java', ['asp', 'php'], 'scheme']
# 要拿到s中的php元素可以用s[2][1]
print(s[2][1])
```



***Java示例**

```java
List<String> names = new ArrayList<>();
names.add("张三");
names.add("李四");
names.add("王五");

//获取列表长度
int len = names.size();
System.out.println(len);
//获取指定索引位置的元素
System.out.println(names.get(0));
System.out.println(names.get(1));
System.out.println(names.get(2));

#取指定索引范围的元素
List subNames = names.subList(0,2);
System.out.println(subNames);

//获取最后一个元素的方式
System.out.println(names.get(len-1));
//list也是一个可动态扩容的列表，可以追加元素到末尾
names.add("赵二");
System.out.println(names.get(len-1));
//也可以把元素插入到指定的位置，比如索引号为1的位置：
names.add(1,"赵三");
System.out.println(names.get(1));

//要删除list末尾的元素，用pop()方法：
names.remove(len-1);
System.out.println(names.get(len-1));
//要把某个元素替换成别的元素，可以直接赋值给对应的索引位置：
names.add(1,"找六");
System.out.println(names.get(1));
//list里的元素类型必须相同，在创建list对象时已经指定
```

#### 5）元组tuple

**Python示例**

在Python中，另一种有序列表叫元组：tuple。tuple和list非常类似，但是tuple一旦初始化就不能修改，例如：

```python
#!/usr/bin/env python3
#names这个tuple不能变了，它也没有append()，insert()这样的方法。其他获取元素的方法和list是一样的
names = ('张三', '李四', '王五')

#要定义一个空的tuple，可以写成()：
t = ()
#要定义一个只有1个元素的tuple，
t = (1,)
print(t)
```

**Java示例**

在Java中，当我们希望函数返回多个值的时候，我们可以使用Tuple类型作为函数的返回值，这样我们就可以不用ref来定义多个参数了。自定义Tuple示例：

```java
//支持两个元素的元组
public class TwoTuple<Integer,Double> {
    public final Integer first;
    public final Double second;

    public TwoTuple(Integer first,Double second){
        this.first = first;
        this.second = second;
    }
}
```

*JavaTuple*是一个*Java*库,它提供了可以容纳多个元素的元组数据结构。与数组和列表不同,元组的大小和每个元素的类型在创建后是不可改变的。



#### 6）键值对

**Python示例**

Python内置了字典：dict的支持，dict全称dictionary，使用键-值（key-value）存储，具有极快的查找速度。

```python
d = {'a': 95, 'b': 75, 'c': 85}
print(d.get('a'))
print(d['b'])
```



**Java示例**

Java中使用Map表示键值对存储。

```java
Map<String,Integer> map = new HashMap<>();
map.put("a",95);
map.put("b",85);
map.put("c",75);
System.out.println(map.get("a"));
```



### 6.2、输入与输出

**python示例**

```python
#!/usr/bin/env python3
name=input()
print('hello, '+name)
```

控制台输出结果：

```
PS D:\code\python> & "C:/Program Files/Python310/python.exe" d:/code/python/hello.py
Input your name: Bob
Input your age: 18
Hi, Bob, you are 18
PS D:\code\python> 
```



**java示例**

```java
Scanner scanner = new Scanner(System.in); // 输入：创建Scanner对象
System.out.print("Input your name: "); // 输出：打印提示
String name = scanner.nextLine(); // 读取一行输入并获取字符串
System.out.print("Input your age: "); // 打印提示
int age = scanner.nextInt(); // 读取一行输入并获取整数
System.out.printf("Hi, %s, you are %d\n", name, age); // 格式化输出
   
```

控制台输出结果：

```
Input your name: Bob
Input your age: 18
Hi, Bob, you are 18
```



### 6.3、条件判断

**Python示例**

在Python程序中，用`if`、``elif、`else`语句实现根据不同条件执行不同的业务逻辑，例如根据年龄输出不同的内容：

```python
#注意不要少写了冒号:。
#!/usr/bin/env python3
age = 18
if age > 30: 
    print(1)
elif age > 20 :
    print(2)
else : 
    print(3)
```

>  elif是else if的缩写

 

**Java示例**

在Java程序中，用`if`、`else if`、`else` 语句  实现根据不同条件执行不同的业务逻辑

```java
int age = 18;
if (age > 30) {
     System.out.println(1);
} else if (age > 20) {
     System.out.println(2);
} else {
     System.out.println(3);
}
```

### 6.4、模式匹配

**Python示例**

如果要针对某个变量匹配若干种情况，可以使用match语句。`match`语句除了可以匹配简单的单个值外，还可以匹配多个值、匹配一定范围，并且把匹配后的值绑定到变量：

```python
#!/usr/bin/env python3

# 第一个case x if x < 10表示当age < 10成立时匹配，且赋值给变量x，第二个case 10仅匹配单个值，第三个case 11|12|...|18能匹配多个值，用|分隔。
age = 15

match age:
    case x if x < 10:
        print(f'< 10 years old: {x}')
    case 10:
        print('10 years old.')
    case 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18:
        print('11~18 years old.')
    case 19:
        print('19 years old.')
    case _:
        print('not sure.')
```

```python

# 匹配列表
#第一个case ['A']表示列表仅有'A'一个字符串
#第二个case ['A', v2, *other]表示列表第一个字符串是'A'，第二个字符串绑定到变量v2，后面的任意个字符串绑定到*other
#第三个case ['D']表示列表仅有'D'一个字符串；
#最后一个case _表示其他所有情况。
args = ['A', 'B', 'C','D']
match args:
    # 如果仅出现gcc，报错:
    case ['A']:
        print('11111')
    # 出现A，且后面至少还有一个元素:
    case ['A', v2, *other]:
        print('A,' + v2 + ', ' + ', '.join(other))
    # 仅出现clean:
    case ['D']:
        print('D')
    case _:
        print('invalid command.')
```

**Java示例**

Java中的模式匹配仅仅支持单个值的精确匹配，示例如下：

```java
int age = 18;
switch (age){
     case 10:
          System.out.println(10);
          break;
     case 18:
          System.out.println(18);
          break;
     default:
          System.out.println("unknow");
          break;
}
```

### 6.5、循环语句

**Python示例**

Python的循环有两种，一种是for...in循环，依次把list或tuple中的每个元素迭代出来，第二种循环是while循环，只要条件满足，就不断循环，条件不满足时退出循环。示例如下：

```python
#for 循环示例 依次打印names的每一个元素
names = ['张三', '李四', '王五']
for name in names:
    print(name)
```

```python

# while循环示例  求和
sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)

# break语句可以提前退出while循环
sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
    if n < 20 :
       break
print(sum)

#continue 语句可以退出当前循环，进入下一次循环
n = 0
while n < 10:
    n = n + 1
    if n % 2 == 0: # 如果n是偶数，执行continue语句
        continue # continue语句会直接继续下一轮循环，后续的print()语句不会执行
    print(n)
```



**Java示例**

Java中的循环也有两种，for和while，其中while的中断条件也有break和continue，思想基本和python类似。示例如下：

```java
List<String> names = Arrays.asList("Michael", "Bob", "Tracy");
//for循环 两种方式
for (String n : names) {
      System.out.println(n);
}
for (int i=0;i<names.size();i++) {
      System.out.println(names.get(i));
}
        
//while循环示例  求和
int sum = 0;
int n = 99;
while (n > 0){
     sum = sum + n;
     n = n - 2;
}
System.out.println(sum);
// break语句可以提前退出while循环
sum = 0;
n = 99;
while (n > 0){
    sum = sum + n;
    n = n - 2;
    if (n < 20) break;
}
System.out.println(sum);
        
// continue语句退出当前循环进入下一次循环
sum = 0;
n = 99;
while (n > 0){
    sum = sum + n;
    n = n - 2;
   //如果n是偶数，执行continue语句
    if (n % 2 == 0 ) continue;
}
System.out.println(sum);
```

### 6.6 、函数

#### 1）定义函数

**Python示例**

> 在Python中，定义一个函数要使用`def`语句，依次写出函数名、括号、括号中的参数和冒号`:`，然后，在缩进块中编写函数体，函数的返回值用`return`语句返回。

```python
def test_function(a,b):
    return a+b
print(test(1,2))
```

>  Python的函数定义非常简单，但灵活度却非常大。除了正常定义的必选参数外，还可以使用默认参数、可变参数和关键字参数，使得函数定义出来的接口，不但能处理复杂的参数，还可以简化调用者的代码。

*默认参数*

```python
def power(x, n=2,i=3):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s
    
#调用实例
>>> power(5)
25
>>> power(5, 2)
25
```

*可变参数*

> 区别在参数前面加了一个`*`号。在函数内部，参数`numbers`接收到的是一个tuple

```python
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
 
# 调用时可以传入任意个参数
 >>> calc(1, 2)
5
>>> calc()
0
```

*关键字参数*

> 可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个tuple。而关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict。请看示例：

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

#调用实例
>>> person('Bob', 35, city='Beijing')
name: Bob age: 35 other: {'city': 'Beijing'}
>>> person('Adam', 45, gender='M', job='Engineer')
name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}
```

*命名关键字参数*

> 命名关键字参数需要一个特殊分隔符`*`，`*`后面的参数被视为命名关键字参数。

```python
#仍以person()函数为例，我们希望检查是否有city和job参数：
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)
 
#如果要限制关键字参数的名字，就可以用命名关键字参数，例如，只接收city和job作为关键字参数。这种方式定义的函数如下：
def person(name, age, *, city, job):
    print(name, age, city, job)
```



*参数组合*

> 在Python中定义函数，可以用必选参数、默认参数、可变参数、关键字参数和命名关键字参数，这5种参数都可以组合使用。但是请注意，参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。
>
>  虽然可以组合多达5种参数，但不要同时使用太多的组合，否则函数接口的可理解性很差。

```python
def f1(a, b, c=0, *args, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c=0, *, d, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)

#调用实例
>>> f1(1, 2)
a = 1 b = 2 c = 0 args = () kw = {}
>>> f1(1, 2, c=3)
a = 1 b = 2 c = 3 args = () kw = {}
>>> f1(1, 2, 3, 'a', 'b')
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {}
>>> f1(1, 2, 3, 'a', 'b', x=99)
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {'x': 99}
>>> f2(1, 2, d=99, ext=None)
a = 1 b = 2 c = 0 d = 99 kw = {'ext': None}
```



**Java示例**

> Python中的函数，在Java中的叫法是`方法`。Java是一个面向对象编程语言，一个类中可以有多个方法，方法又分为类级别的静态方法，类实例级别的实例方法

 定义Java方法的语法是：

```
修饰符 方法返回类型 方法名(方法参数列表) {
    若干方法语句;
    return 方法返回值;
}
```

```
//方法示例
public class Hello {
    //静态方法
    public static int test_function(int a,int b) {
        return a+b;
    }
    //实例方法
    public int test_function2(int a,int b) {
        return a+b;
    }
 }
```



#### 2）调用函数

**Python示例**

如果你已经把前面定义的函数`test_function()`源码保存为`myfunction.py`文件了，那么，可以在该文件的当前目录下创建新的py文件，用`from myfunction import test_function`来导入`test_function()`函数，注意`myfunction `是文件名（不含`.py`扩展名）：

```
from myfunction import test_function
print(test_function(1,2))
```

**Java示例**

调用前面写好的静态方法和实例方法的方式如下：

```
Hello.test_function(1,2)
new Hello().test_function(1,2)
```



#### 3）内置函数（functools）

[Built-in Functions — Python 3.12.1 documentation](https://docs.python.org/3/library/functions.html#abs)



#### 4）高阶函数

变量可以指向函数，函数的参数能接收变量，因此一个函数可以接收另一个函数作为参数，这种函数就称之为高阶函数。

编写高阶函数，就是让函数的参数能够接收别的函数。

```python
# 一个最简单的高阶函数实例
def add(x, y, f):
    return f(x) + f(y)
print(add(1,2,abs))
```

**map函数**

```python
def f(x):
    return x * x

r = map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9])
print(list(r))
# 输出
[1, 4, 9, 16, 25, 36, 49, 64, 81]
```

**reduce函数**

```python
#对序列求和
from functools import reduce
def add(x, y):
  return x + y
print(reduce(add, [1, 3, 5, 7, 9]))
25
```

**filter函数**

> 和`map()`类似，`filter()`也接收一个函数和一个序列。和`map()`不同的是，`filter()`把传入的函数依次作用于每个元素，然后根据返回值是`True`还是`False`决定保留还是丢弃该元素

```python
def is_odd(n):
    return n % 2 == 1

list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
# 结果: [1, 5, 9, 15]
```



**sorted函数**

> sorted函数可以对list进行排序，它还可以接收一个`key`函数

```python
sorted([36, 5, -12, 9, -21])
```

#### 5）匿名函数

> 在Python中，关键字`lambda`表示匿名函数，冒号前面的`x`表示函数参数

```python
list(map(lambda x: x * x, [1, 2, 3, 4, 5, 6, 7, 8, 9]))
```

匿名函数`lambda x: x * x`实际上就是

```python
def f(x):
    return x * x
```

匿名函数有个限制，就是只能有一个表达式，不用写`return`，返回值就是该表达式的结果。



#### 6）装饰器

**Python示例**

> 现在，假设我们要增强`printDate()`函数的功能，比如，在函数调用前后自动打印日志，但又不希望修改`printDate()`函数的定义，这种在代码运行期间动态增加功能的方式，就被叫做“装饰器”（Decorator）。

```python
def log(func):
    def aop(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return aop

@log
def printDate():
    print('2015-3-25')

printDate()
```

**Java示例**

Java中通过AOP的思想在代码运行期动态增加功能。

#### 7）偏函数

**Python示例**

Python的`functools`模块提供了很多有用的功能，其中一个就是偏函数（Partial function）。要注意，这里的偏函数和数学意义上的偏函数不一样。`functools.partial`就是帮助我们创建一个偏函数的，例如不需要我们自己定义`int2()`，可以直接使用下面的代码创建一个新的函数`int2`：

```python
import functools
int2 = functools.partial(int, base=2)
print(int2('1000000'))
```



### 6.7、模块化

模块化能提高代码的可维护性，同时能方便复用。 减少重复开发。模块化其实就是代码的一种组织方式，很多编程语言都采用这种组织代码的方式。

**Python示例**

> 在Python中，一个.py文件就称之为一个模块（Module）。
>
> 我们可以定义自己的模块，或者引用包括Python内置的模块和来自第三方的模块。 自己创建模块时要注意命名，不能和Python自带的模块名称冲突。例如，系统自带了sys模块，自己的模块就不可命名为sys.py，否则将无法导入系统自带的sys模块。
>
> Python中引入了按目录来组织模块的方法，称为包（Package），这个和其它语言类似。
>
> 例如：一个`abc.py`的文件就是一个名字叫`abc`的模块，一个`xyz.py`的文件就是一个名字叫`xyz`的模块。

```
mypython
 ├─ web
 │  ├─ __init__.py
 │  ├─ abc.py
 │  └─ xyz.py
 ├─ __init__.py
 ├─ abc.py
 └─ xyz.py
```

如上所示，两个文件`abc.py`的模块名分别是`mypython.abc`和`mypython.web.abc`。

在python中使用外部模块需要先导入，导入示例如下：

```
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
' a test module '
__author__ = 'Bob'

import sys

def test():
    args = sys.argv
    if len(args)==1:
        print('Hello, world!')
    elif len(args)==2:
        print('Hello, %s!' % args[1])
    else:
        print('Too many arguments!')

if __name__=='__main__':
    test()
```

上面代码，第1行和第2行是标准注释，第1行注释可以让这个`hello.py`文件直接在Unix/Linux/Mac上运行，第2行注释表示.py文件本身使用标准UTF-8编码；

第3行是一个字符串，表示模块的文档注释，任何模块代码的第一个字符串都被视为模块的文档注释；

第4行使用`__author__`变量把作者写进去，这样当你公开源代码后别人就可以瞻仰你的大名；

以上就是Python模块的标准文件模板，当然也可以全部删掉不写，但是，请按标准规范办事。



*安装第三方模块*

> 在Python中，安装第三方模块，是通过包管理工具pip完成的。
>
> 在命令提示符窗口下尝试运行`pip`，如果Windows提示未找到命令，可以重新运行安装程序添加`pip`。
>
> 注意：Mac或Linux上有可能并存Python 3.x和Python 2.x，因此对应的pip命令是`pip3`。

一般来说，第三方库都会在Python官方的[pypi.python.org](https://pypi.python.org/)网站注册，要安装一个第三方库，必须先知道该库的名称，可以在官网或者pypi上搜索，比如Pillow的名称叫[Pillow](https://pypi.python.org/pypi/Pillow/)，因此，安装Pillow的命令就是：

```
pip install Pillow
```

在使用Python时，肯定经常需要用到很多第三方库，例如，上面提到的Pillow，以及MySQL驱动程序，Web框架Flask，科学计算Numpy等。用pip一个一个安装费时费力，还需要考虑兼容性。推荐直接使用[Anaconda](https://www.anaconda.com/)，这是一个基于Python的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库，我们装上Anaconda，就相当于把数十个第三方模块自动安装好了，非常简单易用。

**Java示例**

Java中模块的划分通过类class、包package、jar包来划分

> Java中通过import 导入其它依赖模块的类class

```
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableWdlsFeignClients;

public class MainApplication {
  
    public static void main(String[] args) {
    
    }
}

```



*安装第三方模块*

java中有多种方式引入第三方模块，比如下载jar到本地项目中，或者目前最流行的maven管理模式：

```
//只需要引入对应的依赖maven库坐标即可
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>1.0</version>
</dependency>
```



### 6.8、面向对象

#### 1）类和实例

面向对象编程——Object Oriented Programming，简称OOP，是一种程序设计思想。OOP把对象作为程序的基本单元，一个对象包含了数据和操作数据的函数。所以，面向对象的设计思想是抽象出Class，根据Class创建Instance。

**Python示例**

在Python中，所有数据类型都可以视为对象，当然也可以自定义对象。自定义的对象数据类型就是面向对象中的类（Class）的概念。

> 打印学生姓名和成绩

如下所示，强制必须绑定的属性通过init方式指定, 特殊方法“__init__”前后分别有两个下划线！！！ 注意到`__init__`方法的第一个参数永远是`self`，表示创建的实例本身，因此，在`__init__`方法内部，就可以把各种属性绑定到`self`，因为`self`就指向创建的实例本身。

```
class Student(object):
    def __init__(self,name,score):
        self.name = name
        self.score = score
        
    def print_score(self) :
        print('%s: %s' % (self.name,self.score))

bob = Student('bob',19)
bob.print_score()
print(bob.name)
```

动态语言和静态语言最大的不同，就是函数和类的定义，不是编译时定义的，而是运行时动态创建的。正常情况下，当我们定义了一个class，创建了一个class的实例后，我们可以给该实例绑定任何属性和方法，这就是动态语言的灵活性。示例如下：

- 给实例绑定属性：

```
class Student(object):
        pass
        
s = Student()
s.name = 'Bb' # 动态给实例绑定一个属性
print(s.name)

```

- 给实例绑定方法：

  > 注意：给一个实例绑定的方法，对另一个实例是不起作用的：

```
class Student(object):
        pass
def set_age(self, age): # 定义一个函数作为实例方法
	self.age = age
        
from types import MethodType
s = Student();
s.set_age = MethodType(set_age, s) # 给实例绑定一个方法
s.set_age(25) # 调用实例方法
print(s.age)
```

- 给类绑定方法：

  > 给class绑定的方法，所有实例都可以使用

```
class Student(object):
       def __init__(self,score):
             self.score = score
def set_age(self, age): # 定义一个函数作为实例方法
	self.age = age
        
def set_score(self, score):
    self.score = score
Student.set_score = set_score

s = Student(1000)
s.set_score(10)
print(s.score)

#输出
10
```



**Java示例**

Java中的面向对象编程思想和Python类似，实现方式不同。区别是Java中的类定义好后在运行态就不能新增自定义属性了

```
package com.gyd;

public class Student {
    private String name;
    private Integer score;

    public Student(String name, Integer score) {
        this.name = name;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void printScore(){
        System.out.println(this.name+" "+ this.score);
    }
    public static void main(String[] args) {
        Student student = new Student("Bob",18);
    }
}

```

#### 2）访问权限控制

**Python示例**

如果要让内部属性不被外部访问，可以把属性的名称前加上两个下划线`__`，在Python中，实例的变量名如果以`__`开头，就变成了一个私有变量（private），只有内部可以访问，外部不能访问，比如我们想让外部无法访问Student类中的name属性：

```
class Student(object):
    def __init__(self,name,score):
        self.__name = name
        self.score = score
        
    def print_score(self) :
        print('%s: %s' % (self.name,self.score))
```

**Java示例**

Java中访问权限控制是通过四大访问修饰符public、protected、default、private来控制：

| 修饰符      | 当前类 | 同一包内 | 子孙类(同一包) | 子孙类(不同包) | 其他包 |
| :---------- | :----- | :------- | :------------- | :------------- | :----- |
| `public`    | Y      | Y        | Y              | Y              | Y      |
| `protected` | Y      | Y        | Y              | Y/N            | N      |
| `default`   | Y      | Y        | Y              | N              | N      |
| `private`   | Y      | N        | N              | N              | N      |



#### 3）继承

在面向对象程序设计中，当我们定义一个class的时候，可以从某个现有的class继承，新的class称为子类（Subclass），而被继承的class称为基类、父类或超类（Base class、Super class）。

**Python示例**

> Cat类继承Anamial类，并重写其中的run方法

```
class Anamial(object):
    def __init__(self,name):
        self.name = name
    def run(self):
        print("hello Anamial")

class Cat(Anamial):
    # pass
    def run(self):
        print("hello cat")

cat = Cat("bob")
cat.run()

#输出：
hello cat
```

Python中允许多重继承，例如下面的示例演示了A类的定义，其同时继承了B、C、D这三个类。

```
class A(B, C, D):
    pass
```

Java中只支持单一继承。

**Java示例**

> Java中类的继承是通过关键字extends来实现，方法的重写是通过@Override关键字来标识

```

public class Anamial {
    private String name;

    public Anamial(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void run(){
        System.out.println("hello Anamial");
    }
}



public class Cat extends Anamial {
    public Cat(String name) {
        super(name);
    }

    @Override
    public void run(){
        System.out.println("hello Cat");
    }

}


public static void main(String[] args) {
	Cat cat = new Cat("Bob");
    cat.run();
}

```



#### 4）多态

> 一句话概括：父类的引用指向子类的对象

```
class Anamial(object):
    def __init__(self,name):
        self.name = name
    def run(self):
        print("hello Anamial")

class Cat(Anamial):
    # pass
    def run(self):
        print("hello cat")

class Dog(Anamial):
    # pass
    def run(self):
        print("hello dog")

def run_twice(animal):
    animal.run()
    animal.run()

cat = Cat("bob")
dog = Dog("dog")

print(isinstance(cat,Anamial))
print(isinstance(dog,Anamial))

run_twice(cat)
run_twice(dog)


#输出如下：
True
True
hello cat
hello cat
hello dog
hello dog
```



#### 5）`__slots__`

当我们定义了一个class，创建了一个class的实例后，我们可以给该实例绑定任何属性和方法，这就是Python动态语言的灵活性。

但如果想要限制实例的属性怎么办？比如，只允许对Student实例添加`name`和`age`属性。

为了达到限制的目的，Python允许在定义class的时候，定义一个特殊的`__slots__`变量，来限制该class实例能添加的属性：

```
class Anamial(object):
    __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称

c = Anamial();
c.sex = 10 #绑定限制范围外的属性
```

```
#输出如下错误
Traceback (most recent call last):
  File "d:\code\python\hello.py", line 5, in <module>
    c.sex = 10
AttributeError: 'Anamial' object has no attribute 'sex'
```



#### 6）@property

**Python示例**

`@property`广泛应用在python语言中类的定义中，可以让调用者写出简短的代码，同时保证对参数进行必要的检查，这样，程序运行时就减少了出错的可能性。

下面定义了一个支持 读写的属性`_name`和只支持读的属性`_age`

```
class Anamial(object):
    __slots__ = ("_name","_age")
    def __init__(self,name,age):
        self._name = name
        self._age = age
    @property
    def name(self):
        return self._name

    @name.setter
    def name(self,value):
        print("name.setter")
        self._name = value
    
    @property
    def age(self):
        print("age.getter")
        return self._age+10
    
    
c = Anamial("tom",18);
c.name = "bob"
print(c._name)
print(c.age)

#输出如下：
name.setter
bob
age.getter
28
```

**Java示例**

Python中的@property 和Java中的setter、getter方法的作用比较像。属性的修饰符用`private`修饰，定义支持读写属性，需要定义getter和setter方法，定义只读属性，则只需要定义getter方法即可

```
package com.gyd;

public class Anamial {
    private String name;

    private Integer age;
    public Anamial(String name,Integer age) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public String getName() {
        System.out.println("name getter");
        return name;
    }

    public void setName(String name) {
        System.out.println("name getter");
        this.name = name;
    }
}
```

#### 7）枚举类

**Python示例**

Python语言可以从`Enum`派生出自定义的枚举类，`@unique`装饰器可以帮助我们检查保证没有重复值。

```
from enum import Enum, unique

@unique
class Weekday(Enum):
    Sun = 0 # Sun的value被设定为0
    Mon = 1
    Tue = 2
    Wed = 3
    Thu = 4
    Fri = 5
    Sat = 6

#遍历所有枚举
for name,member in Weekday.__members__.items():
    print(name,member,member.value)

#遍历单个枚举
day1 = Weekday.Mon
print(day1)
print(Weekday.Tue)
print(Weekday['Tue'])
print(Weekday.Tue.value)
print(day1 == Weekday.Mon)
print(day1 == Weekday.Tue)
print(Weekday(1))
print(day1 == Weekday(1))
```

**Java示例**

```
public enum WeekDayType {
    Sun("Sun",0),
    Mon("Mon",1),
    Tue("Tue",2),
    Wed("Wed",3),
    Thu("Thu",4),
    Fri("Fri",5),
    Sat("Sat",6);

    private Integer code;
    private String name;

    WeekDayType(String name, Integer code){
        this.code = code;
        this.name = name;
    }
    public Integer getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}

    public static void main(String[] args) {
        System.out.println(WeekDayType.Wed);
        System.out.println(WeekDayType.Wed.name);
        System.out.println(WeekDayType.Wed.code);
    }

```



#### 8）type()元类

**Python示例**

在Python语言中，class的定义是运行时动态创建的，而创建class的方法就是使用`type()`函数。

`type()`函数既可以返回一个对象的类型，又可以创建出新的类型，比如，可以通过`type()`函数创建出`Hello`类，而无需通过`class Hello(object)...`的定义。

要创建一个class对象，`type()`函数依次传入3个参数：

1. class的名称；
2. 继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
3. class的方法名称与函数绑定，这里我们把函数`fn`绑定到方法名`hello`

示例如下：

> `Hello`是一个class，它的类型就是`type`，而`h`是一个实例，它的类型就是class `Hello`。

```
def fn(self,name="bob"):
    print("hello %s" % name)

Hello = type("Hello",(object,),dict(hello=fn))

h = Hello()
h.hello("jam")
```

​	 等同于下面的

```
class Hello(object):
    def hello(self,name="bob"):
        print("hello %s" % name)
 
h = Hello()
h.hello("jam")    
```



**Java示例**

Java语言支持通过字节码技术在运行过程中动态创建类，最常用的有cglib和asm。

### 6.9 、错误处理

#### 1）错误捕获和抛出

**Python示例**

高级语言通常都内置了一套`try...except...finally...`的错误处理机制，Python也不例外。

Python语法和Java的几点区别：

- Java中的关键字`catch`在Python中是`except`
- Python支持在所有`except`关键字后可以写`else`逻辑，表示没有捕获到任何错误时要执行的一段逻辑。

示例如下

```
import logging
try:
    result = 10/0
    print("Result:",result)
except ZeroDivisionError as e:
    print("except:",e)
    #Python内置的logging模块可以非常容易地记录错误信息
 	logging.exception(e)
 	# 抛出异常
 	raise e
except ValueError as e:
    print('ValueError:', e)
else:
    print('no erro')
finally:
    print("finally")
print("end")
```

上面代码中使用的logging，是Python内置的日志模块，通过配置，`logging`还可以把错误记录到日志文件里，方便事后排查。

上面代码中使用了关键字`raise`抛出异常，等同于Java中的`throw`

上面代码中使用了`ZeroDivisionError`、`ValueError`等内置错误类型，而所有的错误类型都继承自`BaseException`，所以在使用`except`时需要注意的是，它不但捕获该类型的错误，还把其子类也“一网打尽”。比如：

```
try:
    test()
except ValueError as e:
    print('ValueError')
except UnicodeError as e:
    print('UnicodeError')
```

上面代码中，第二个`except`永远也捕获不到`UnicodeError`，因为`UnicodeError`是`ValueError`的子类，如果有，也被第一个`except`给捕获了。

[Python语言内置的所有错误类型点这里查看](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)

我们也可以自定义错误，不过只有在必要的时候才定义我们自己的错误类型。如果可以选择Python已有的内置的错误类型（比如`ValueError`，`TypeError`），尽量使用Python内置的错误类型。自定义错误示例如下：

```
class MyError(ValueError):
    pass

def test(s):
    n = int(s)
    if n==0:
        raise MyError('invalid value: %s' % s)
    return 10 / n

test("0")
```



**Java示例**

```
 public static void main(String[] args) {
        try {
            System.out.println("业务代码开始执行");
            int i =0;
            System.out.println(10/i);
        } catch (ArithmeticException e) {
            System.out.println("捕获数学异常:"+e);
            throw new RuntimeException("主动抛出异常"+e.getMessage());
        } finally {
            System.out.println("执行一些其它动作");
        }
        System.out.println("结束。。");
    }
```



#### 2）断点调试

**Python示例**

Python的调试方式有多种：

- 启动Python的调试器pdb，让程序以单步方式运行，可以随时查看运行状态。
- 使用pdb.set_trace()
- 使用print或者logging打印日志
- 使用支持打断点的IDE工具

*先说第一种pdb方式。先写一段有问题的代码：*

```
# 保存到hello.py文件中
a = '0'
b = int(a)
print(10 / a)
```

然后启动python解释器，进入pdb调试环境：

```
D:\code\python> python -m pdb hello.py
> d:\code\python\hello.py(2)<module>()
-> a = '0'
(Pdb)
```

接着输入命令`l`，可以查看当前准备执行的代码所在行：

```
(Pdb) l
  1     # hello.py
  2  -> a = '0'
  3     b = int(a)
  4     print(10 / a)
[EOF]
(Pdb)
```

接着输入命令`n`，单步执行代码：

```
(Pdb) n
> d:\code\python\hello.py(3)<module>()
-> b = int(a)
(Pdb) l
  1     # hello.py
  2     a = '0'
  3  -> b = int(a)
  4     print(10 / a)
[EOF]
(Pdb)
```

可以输入命令`p 变量名`来查看变量：

```
[EOF]
(Pdb) p a
'0'
(Pdb) p b
*** NameError: name 'b' is not defined
(Pdb)
```

最后输入命令`q`结束调试，退出程序：

```
(Pdb) q
PS D:\code\python>
```

经过上面的步骤，大家肯定和小郭一样觉得太麻烦啦，如果有500行代码，要运行到第499行得敲多少个`l`命令啊！ 因此Python还提供了第二种方式`pdb.set_trace()`，对前面的错误代码片段稍作改造：

```
# hello.py
import pdb

a = '0'
b = int(a)
pdb.set_trace() 
print(10 / b)
```

运行代码，程序会自动在`pdb.set_trace()`暂停并进入pdb调试环境，可以用命令`p`查看变量，或者用命令`c`继续运行。 这种比第一种方式方便很多了，但是其实也好不到哪里去。

对编码断点调试支持最好的还是我们最常用的IDE图形开发工具。

目前比较好的Python IDE有：

Visual Studio Code：https://code.visualstudio.com/，需要安装Python插件。

PyCharm：http://www.jetbrains.com/pycharm/

Eclipse：[Eclipse](http://www.eclipse.org/)加上[pydev](http://pydev.org/)插件也可以调试Python程序。



**Java示例**

Java中的断点调试当然离不开常用的Eclipse、IDEA等开发工具啦！

#### 3）单元测试

**Python示例**

为了编写单元测试，需要引入Python自带的`unittest`模块，然后编写一个测试类，这个类需要从`unittest.TestCase`继承。最后编写对应的测试方法，注意`test`开头的方法就是测试方法，不以`test`开头的方法不被认为是测试方法，测试的时候不会被执行。

示例被测试代码如下：

```
class CalUtil(object):
    def __init__(self,a,b):
        self.a = a
        self.b = b

    def add(self):
        return self.a+self.b
```

针对上述代码，编写测试代码如下：

```
# test.py
import unittest
class TestCalUtil(unittest.TestCase):
    def setUp(self) -> None:
        print("单元测试用例执行前的处理====")
        return super().setUp()
    
    def tearDown(self) :
        print("单元测试用例执行后的处理===")
    def test_init(self):
        d = CalUtil(1, 2)
        self.assertEqual(d.a, 1)
        self.assertEqual(d.b, 2)
        self.assertTrue(isinstance(d, CalUtil))

```

上面代码中，test_init方法就是我们针对业务代码编写的单元测试用例，而setUp和tearDown是两个特殊方法，这两个方法会分别在每调用一个测试方法的前后分别被执行。一旦编写好单元测试，我们就可以运行单元测试。最简单的运行方式是在当前源码后追加下面两行

```
if __name__ == '__main__':
    unittest.main()
```

然后运行当前文件即可执行测试

```
PS D:\code\python> & "C:/Program Files/Python310/python.exe" d:/code/python/test.py
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
PS D:\code\python>
```



另一种方法是在命令行通过参数`-m unittest`直接运行单元测试：

> 这是推荐的做法，因为这样可以一次批量运行很多单元测试，并且，有很多工具可以自动来运行这些单元测试。

```
 PS D:\code\python> python -m unittest test.py
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
PS D:\code\python>
```



对每一类测试都需要编写一个`test_xxx()`方法。由于`unittest.TestCase`提供了很多内置的条件判断，我们只需要调用这些方法就可以断言输出是否是我们所期望的。最常用的断言就是`assertEqual()`，Python内置了许多断言，详情查阅：[unittest --- 单元测试框架 — Python 3.12.1 文档](https://docs.python.org/zh-cn/3/library/unittest.html)



**Java示例**

Java中的单元测试框架有很多，功能和Python相似，常见的有junit、mockito、easymock。示例伪代码如下：

> Java细节在此不多叙述

```
import com.gyd.entity.IdRuleEntity;

import com.gyd.mapper.DemoMapper;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
 
@RunWith(MockitoJUnitRunner.class)
@SpringBootTest(classes = MainApplication.class)
public class IdRuleServiceTest  {

    @InjectMocks
    DemoService demoService;

    @Mock
    DemoMapper mapper;

    @Before
    public void setUp(){
    }

    @Test
    public void testQuery() {
        //mock数据
        IdRuleEntity idRule = new IdRuleEntity();
        idRule.setCurrentId(1L);
        idRule.setId(1L);
        idRule.setOperator("admin1");

        //mock操作
        Mockito.when(mapper.selectOne(Mockito.any())).thenReturn(idRule);

        //目标方法调用
        IdRuleEntity idRule2 = demoService.queryIdRule(1L);
        //结果是否符合预期
        Assert.assertEquals(idRule, idRule2);

        System.out.println("测试执行成功");
    }

    @After
    public void setDown(){
        System.out.println("后置动作");
    }
}
```



### 6.10、IO操作

操作IO的能力都是由操作系统提供的，每一种编程语言都会把操作系统提供的低级C接口封装起来方便使用，Python也不例外。接下来总结Python封装的IO操作接口。

#### 1）文件读写

*读文件*

要以读文件的模式打开一个文件对象，使用Python内置的`open()`函数，传入文件名和标示符：

```
try:
    # r表示读
    f = open('D://test.txt', 'r',encoding='utf-8')
    # 调用read()会一次性读取文件的全部内容
    print(f.read())
finally:
    if f:
        f.close
```

上面代码通过演示了文件的读取与关闭，但是每次都写try...finally太麻烦，Python提供了更简洁的语法（推荐！！）：

```
with open('D://test.txt', 'r',encoding='utf-8') as f:
    print(f.read())
```

调用f.read()方法会一次性读取文件全部内容，如果文件内容超大，可能会把内存干爆，因此Python还提供了多种读取方式：

- read(size)：每次读取指定大小
- readline() ：每次读取一行
- readlines ：一次读取所有内容并按行返回list

上面演示的代码默认都是读取文本文件，并且是UTF-8编码的文本文件。要读取二进制文件，比如图片、视频等等，用`'rb'`模式打开文件即可：

```
f = open('D://test.jpg', 'rb')
f.read()
```



*写文件*

写文件和读文件是一样的，唯一区别是调用`open()`函数时，传入标识符`'w'`或者`'wb'`表示写文本文件或写二进制文件：

```
with open('D://test.txt', 'w',encoding='utf-8') as f:
    print(f.write("测试写入"))
```

但是这种写入是直接覆盖文件原始内容，有时候我们只想追加内容，则把模式`w`改成`a`即可

```
with open('D://test.txt', 'a',encoding='utf-8') as f:
    print(f.write("测试追加写入"))
```

文件操作所有模式参数定义可以参考[Built-in Functions — Python 3.12.1 documentation](https://docs.python.org/3/library/functions.html#open)

#### 2）StringIO/BytesIO

StringIO和BytesIO是在内存中操作str和bytes的方法，使得和读写文件具有一致的接口。

StringIO就是在内存中读写str。

````
from io import StringIO
f = StringIO()
f.write('hello')
f.write(' ')
f.write('world!')
print(f.getvalue())
````

StringIO操作的只能是str，如果要操作二进制数据，就需要使用BytesIO。

```
from io import BytesIO
f = BytesIO()
f.write('中文'.encode('utf-8'))
print(f.getvalue())
```



#### 3）操作文件和目录

```
import os
#posix，说明系统是Linux、Unix或Mac OS X，如果是nt，就是Windows系统。
print(os.name)

#os.uname()可以获取系统的详细信息，但是uname()函数在Windows上不提供，也就是说，os模块的某些函数是跟操作系统相关的。
#os.uname()
#获取操作系统中定义的全部环境变量
print(os.environ)
#要获取某个环境变量的值，可以调用os.environ.get('key')：
print(os.environ.get("path"))


# 操作文件和目录的函数一部分放在os模块中，一部分放在os.path模块中
# 查看当前目录的绝对路径
print(os.path.abspath("."))


# 在某个目录下创建一个新目录，首先把新目录的完整路径表示出来，把两个路径合成一个时，不要直接拼字符串，而要通过os.path.join()函数
# 要拆分路径时，也不要直接去拆字符串，而要通过os.path.split()函数
path = os.path.join('D:\\', 'testdir3')
print(path)
# 创建目录
os.mkdir(path)

# 删除目录
os.rmdir(path)

# os.path.splitext()可以直接让你得到文件扩展名，很多时候非常方便：
print(os.path.splitext("D:\\test.txt"))


# 对文件重命名:
# os.rename('test.txt', 'test.py')
# 删掉文件:
# os.remove('test.py')

# 列出当前目录下的所有文件
# 当前目录
base_dir = 'D:\\'

# 获取当前目录下的所有文件（第一层）
files = [os.path.join(base_dir, file) for file in os.listdir(base_dir)]
for file in files:
    print(file) 
```

#### 4）序列化

**Python示例**

我们把变量从内存中变成可存储或传输的过程称之为序列化。

在Python中叫pickling，在其他语言中也被称之为serialization，marshalling，flattening等等，都是一个意思。

反过来，把变量内容从序列化的对象重新读到内存里称之为反序列化，在python中即unpickling。

Python提供了`pickle`模块来实现序列化。示例代码如下：

```
import pickle
d = dict(name='Bob', age=20, score=88)
# 序列化成bte
print(pickle.dumps(d))

# 序列化到指定磁盘文件
f = open('dump.txt', 'wb')
pickle.dump(d, f)
f.close()

# 从磁盘文件反序列化
f = open('dump.txt', 'rb')
d = pickle.load(f)
print(d)
f.close()
```

Pickle的问题和所有其他编程语言特有的序列化问题一样，就是它只能用于Python语言，并且可能不同版本的Python彼此都不兼容，因此，只能用Pickle保存那些不重要的数据，不能成功地反序列化也没关系。如果需要实现更好的跨版本、跨语言兼容性，则需要使用目前通用的JSON技术。JSON类型和Python数据类型的对应关系如下：

| JSON类型   | Python类型 |
| :--------- | :--------- |
| {}         | dict       |
| []         | list       |
| "string"   | str        |
| 1234.56    | int或float |
| true/false | True/False |
| null       | None       |

Python内置的`json`模块提供了非常完善的Python对象到JSON格式的转换

```
import json
d = dict(name='Bob', age=20, score=88)
str = json.dumps(d)  # dumps()方法返回一个str，内容就是标准的JSON。
print(str) #输出内容是：{"name": "Bob", "age": 20, "score": 88}
```

JSON操作的简单示例：

```
import json
d = dict(name='Bob', age=20, score=88)
str = json.dumps(d)
print(str)

# 序列化到指定磁盘文件
with open('test.json', 'w') as f:
    json.dump(d, f) 

# 序列化到指定磁盘文件
with open('test.json', 'w') as f:
    json.dump(d, f) 

# 从磁盘文件反序列化
with open('test.json', 'r') as f:
    data = json.load(f)  # 解码JSON数据
print(data)

# 把JSON的字符串反序列化（转换为JSON结构）
json_str = '{"age": 20, "score": 88, "name": "Bob"}'
data = json.loads(json_str)
print(data)
```

```
import json
class User(object):
     def __init__(self,name,age):
          self._name=name
          self._age=age

def user2dict(std):
    return {
        'name': std._name,
        'age': std._age
    }

user = User("a",18)

#序列化对象成json
#print(json.dumps(user)) 这个会报错，需要用如下方式指定序列化函数 先将对象转成dict
print(json.dumps(user,default=user2dict))
#或者使用通用的序列化函数,把任意class的实例变为dict，因为通常class的实例都有一个__dict__属性，它就是一个dict，用来存储实例变量。也有少数例外，比如定义了__slots__的class。
print(json.dumps(user, default=lambda obj: obj.__dict__))

#将json字符串反序列化成对象
def dict2user(d):
    return User(d['name'], d['age'])
json_str = '{"age": 20,  "name": "Bob"}'
print(json.loads(json_str, object_hook=dict2user))
```



python关于json的官方说明：[json — JSON encoder and decoder — Python 3.12.1 documentation](https://docs.python.org/3/library/json.html#json.dumps)



### 6.11、并发编程

> 重点总结Python并发编程中进程和线程相关的语法知识。

#### 1）多进程

- 启动一个进程并等待其结束

```
import os
#multiprocessing模块就是跨平台版本的多进程模块。multiprocessing模块提供了一个Process类来代表一个进程对象
from multiprocessing import Process

# 子进程要执行的代码
def run_proc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))
print("Process pid = %s" % os.getpid())

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    # 创建一个子进程，用Process实例表示，只需要传入一个执行函数和函数的参数，用start()方法启动，这样创建进程比fork()还要简单。
    p = Process(target=run_proc, args=('test',))
    print('Child process will start.')
    p.start()
    #join()方法等待子进程结束后再继续往下运行，通常用于进程间的同步。
    p.join()
    print('Child process end.')

#输出结果如下
Process pid = 8508
Parent process 8508.
Child process will start.
Process pid = 13196
Run child process test (13196)...
Child process end.
```

- 进程池方式批量创建进程

```
import os
#multiprocessing模块就是跨平台版本的多进程模块。multiprocessing模块提供了一个Process类来代表一个进程对象
from multiprocessing import Process
#进程池
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(long_time_task, args=(i,))
    print('Waiting for all subprocesses done...')
    #调用join()之前必须先调用close()，调用close()之后就不能继续添加新的Process了
    p.close()
    #调用join()方法会等待所有子进程执行完毕
    p.join()
    print('All subprocesses done.')
    
 #输出如下：
Parent process 13000.
Waiting for all subprocesses done...
Run task 0 (24112)...
Run task 1 (4004)...
Run task 2 (22012)...
Run task 3 (8348)...
Task 3 runs 0.13 seconds.
Run task 4 (8348)...
Task 1 runs 0.40 seconds.
Task 2 runs 1.18 seconds.
Task 4 runs 1.23 seconds.
Task 0 runs 2.98 seconds.
All subprocesses done.
```

- 进程间通信

  Python的`multiprocessing`模块包装了底层的机制，提供了`Queue`、`Pipes`等多种方式来在进程间交换数据。

```
from multiprocessing import Process, Queue
import os, time, random

# 写数据进程执行的代码:
def write(q):
    print('Process to write: %s' % os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' % value)
        q.put(value)
        time.sleep(random.random())

# 读数据进程执行的代码:
def read(q):
    print('Process to read: %s' % os.getpid())
    while True:
        value = q.get(True)
        print('Get %s from queue.' % value)

if __name__=='__main__':
    # 父进程创建Queue，并传给各个子进程：
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动子进程pw，写入:
    pw.start()
    # 启动子进程pr，读取:
    pr.start()
    # 等待pw结束:
    pw.join()
    # pr进程里是死循环，无法等待其结束，只能强行终止:
    pr.terminate()
    
 #输出如下
Process to read: 23112
Process to write: 24308
Put A to queue...
Get A from queue.
Put B to queue...
Get B from queue.
Put C to queue...
Get C from queue.
```

#### 2）多线程

Python的标准库提供了两个模块：`_thread`和`threading`，`_thread`是低级模块，`threading`是高级模块，对`_thread`进行了封装。绝大多数情况下，只需要使用`threading`这个高级模块来实现多线程开发。下面是示例：

```
import time,threading

def loop():
	#`current_thread()`函数，它永远返回当前线程的实例
    print("thread %s is running..." % threading.current_thread().name)
    n = 0
    while n < 5:
        n = n+1
        print("thread %s >>> %s" % (threading.current_thread().name,n))
        time.sleep(1)
    print("thread %s ended." % threading.current_thread().name)

print("thread %s is running..." % threading.current_thread().name)
#，子线程的名字在创建时指定，这里指定为LoopThread
t = threading.Thread(target=loop, name="LoopThread")
t.start()
t.join()
#主线程实例的名字叫`MainThread`
print("thread %s ended." % threading.current_thread().name)

#输出日志如下
thread MainThread is running...
thread LoopThread is running...
thread LoopThread >>> 1
thread LoopThread >>> 2
thread LoopThread >>> 3
thread LoopThread >>> 4
thread LoopThread >>> 5
thread LoopThread ended.
thread MainThread ended.
```

多线程和多进程最大的不同在于，多进程中，同一个变量，各自有一份拷贝存在于每个进程中，互不影响，而多线程中，所有变量都由所有线程共享，所以，任何一个变量都可以被任何一个线程修改，这就是我们常说的多线程并发问题。在Java语言里，提供了各种并发控制技术比如锁来保证并发安全。Python同样也提供了锁的机制。示例如下：

```
import time, threading

# 假定这是你的银行存款:
balance = 0

def change_it(n):
    # 先存后取，结果应该为0:
    global balance
    balance = balance + n
    balance = balance - n

#保证线程安全的关键：定义一把全局锁
lock = threading.Lock()

def run_thread(n):
    for i in range(100000):
        # 先要获取锁:
        lock.acquire()
        # 用try...finally来确保锁一定会被占用的线程释放，否则会造成死锁现象的发生
        try:
            # 放心地改吧:
            change_it(n)
        finally:
            # 改完了一定要释放锁:
            lock.release()

t1 = threading.Thread(target=run_thread, args=(5,))
t2 = threading.Thread(target=run_thread, args=(8,))
t1.start()
t2.start()
t1.join()
t2.join()
print(balance)
```



#### 3）ThreadLocal

多线程环境下，每个线程都有自己的数据。一个线程使用自己的局部变量比使用全局变量好。ThreadLocal类型可以用来存储线程本地数据。`ThreadLocal`最常用的地方就是为每个线程绑定一个数据库连接，HTTP请求，用户身份信息等，这样一个线程的所有调用到的处理函数都可以非常方便地访问这些资源。

简单示例如下：

```
import threading
local_data = threading.local()

def print_data():
    _name = local_data.name
    print("Hello, %s, you name is %s" % (threading.current_thread(),_name))
def process_thread(name):
    local_data.name = name;
    print_data()
    
t1 = threading.Thread(target=process_thread,args=("张三",),name="Thread-A")
t2 = threading.Thread(target=process_thread,args=("李四",),name="Thread-B")
t1.start()
t2.start()
t1.join()
t2.join()

#输出如下
Hello, <Thread(Thread-A, started 9092)>, you name is 张三
Hello, <Thread(Thread-B, started 24252)>, you name is 李四
```

#### 4）分布式进程

todo  [分布式进程 - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1016959663602400/1017631559645600)

## 7、常用内置模块

Python提供了许多实用的内置模块，无需手动导入即可使用。

### 1）collections

> collections是Python内建的一个集合模块，提供了许多有用的集合类。可以根据需要选用。

```
from collections import namedtuple,defaultdict,OrderedDict,Counter,ChainMap

# namedtuple是一个函数，用来创建一个自定义的tuple对象，并且规定了tuple元素的个数，并可以用属性而不是索引来引用tuple的某个元素。
Point = namedtuple('Point', ['x', 'y', 'z'])
p = Point(1, 2, 3)
print(p.x)
print(p.y)
print(p.z)

#defaultdict：使用dict时，如果引用的Key不存在，就会抛出KeyError。如果希望key不存在时，返回一个默认值，就可以用defaultdict。
dd = defaultdict(lambda: 'N/A')
dd['key1'] = 'abc'
print(dd['key1'])
#key2不存在，返回默认值 N/A
print(dd['key2'])

#OrderedDict：使用dict时，Key是无序的。在对dict做迭代时，我们无法确定Key的顺序。如果要保持Key的顺序，可以用OrderedDict。OrderedDict的Key会按照插入的顺序排列，不是Key本身排序。
d = dict([('a', 1), ('b', 2), ('c', 3)])
print(d) #无序
od = OrderedDict([('a', 1), ('b', 2), ('c', 3)])
print(od) #有序
od = OrderedDict()
od["a"] = 1
od["c"] = 2
od["b"] = 3
print(list(od.keys())) # 按照插入的Key的顺序返回
print(od.popitem()) # 按先进先出顺序出栈
print(od.popitem()) 


#Counter：简单计数器。例如，统计字符出现的个数：
c = Counter()
for ch in 'programming':
    c[ch] = c[ch] + 1
print(c)
c.update('hello') # 也可以一次性update
print(c)

#ChainMap：可以把一组dict串起来并组成一个逻辑上的dict。ChainMap本身也是一个dict，但是查找的时候，会按照顺序在内部的dict依次查找。可以用ChainMap实现参数的优先级查找
```

### 2）datetime

> datetime是Python处理日期和时间的标准库。

```
from datetime import datetime,timedelta

# 获取当前datetime
now = datetime.now() 
print(now)
print(type(now))

# 用指定日期时间创建datetime
dt = datetime(2015, 4, 19, 12, 20) 
print(dt)

# 把datetime转换为timestamp . Python的timestamp是一个浮点数，整数位表示秒
t = dt.timestamp();
print(dt.timestamp())

#timestamp转换为datetime (timestamp是一个浮点数，它没有时区的概念，而datetime是有时区的。上述转换是在timestamp和本地时间做转换)
print(datetime.fromtimestamp(t))
# UTC时间
print(datetime.utcfromtimestamp(t)) 

# 字符串和datetime的互相转换 https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior
cday = datetime.strptime('2015-6-1 18:19:59', '%Y-%m-%d %H:%M:%S')
print(cday)
now = datetime.now()
print(now.strftime('%a, %b %d %H:%M'))

# datetime的加减
print(now + timedelta(hours=10))
print(now - timedelta(days=1))
print(now + timedelta(days=2, hours=12))
```

### 3）base64

> Python内置的`base64`可以直接进行base64的编解码

```
import base64
str = "你好"
temp_b = str.encode("utf-8")  # 将字符串转换为二进制
b = base64.b64encode(temp_b)
print(b)
print(base64.b64decode(b).decode('utf-8'))

#输出如下
b'5L2g5aW9'
你好
```

### 4）hashlib

>  Python的hashlib提供了常见的摘要算法，如MD5，SHA1等等。

```
import hashlib

# 计算MD5值
md5 = hashlib.md5()
md5.update('how to use md5 in python hashlib?'.encode('utf-8'))
print(md5.hexdigest())
# 计算MD5值，如果数据量大，可以分多次计算
md5 = hashlib.md5()
md5.update('how to use md5 in '.encode('utf-8'))
md5.update('python hashlib?'.encode('utf-8'))
print(md5.hexdigest())


#计算SHA1   和MD5操作一样
sha1 = hashlib.sha1()
sha1.update('how to use md5 in python hashlib?'.encode('utf-8'))
print(sha1.hexdigest())
sha1 = hashlib.sha1()
sha1.update('how to use sha1 in '.encode('utf-8'))
sha1.update('python hashlib?'.encode('utf-8'))
print(sha1.hexdigest())

#输出如下：
d26a53750bc40b38b65a520292f69306
d26a53750bc40b38b65a520292f69306
b752d34ce353e2916e943dc92501021c8f6bca8c
2c76b57293ce30acef38d98f6046927161b46a44
```

### 5）itertools

> Python的内建模块`itertools`提供了非常有用的用于操作迭代对象的函数。`itertools`模块提供的全部是处理迭代功能的函数，它们的返回值不是list，而是`Iterator`，只有用`for`循环迭代的时候才真正计算。

```
import itertools
# 创建一个无限迭代器  只能按ctrl+c退出
natuals = itertools.count(1)
for n in natuals:
    print(n)

#cycle会把传入的一个序列无限重复下去, 只能按ctrl+c退出
cs = itertools.cycle('ABC') # 注意字符串也是序列的一种
for c in cs:
     print(c)

#repeat()负责把一个元素无限重复下去，不过如果提供第二个参数就可以限定重复次数：
ns = itertools.repeat('A', 3)
for n in ns:
    print(n) 

#chain()可以把一组迭代对象串联起来，形成一个更大的迭代器：
for c in itertools.chain('ABC', 'XYZ'):
    print(c)

#groupby()把迭代器中相邻的重复元素挑出来放在一起：
for key, group in itertools.groupby('AAABBBCCAAA'):
    print(key, list(group))
#groupby 忽略大小写
for key, group in itertools.groupby('AaaBBbcCAAa', lambda c: c.upper()):
     print(key, list(group))
```



### 6）contextlib

> 某段代码执行前后自动执行特定代码

### 7）urllib

urllib提供的功能就是利用程序去执行各种HTTP请求。如果要模拟浏览器完成特定功能，需要把请求伪装成浏览器。伪装的方法是先监控浏览器发出的请求，再根据浏览器的请求头来伪装，`User-Agent`头就是用来标识浏览器的。

urllib的`request`模块可以非常方便地抓取URL内容，也就是发送一个GET请求到指定的页面，然后返回HTTP的响应：

```
from urllib import request,parse

#GET请求：把请求伪装成浏览器。例如，模拟iPhone 6去请求csdn页面：
req = request.Request('https://blog.csdn.net/nav/back-end')
req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
with request.urlopen(req) as f:
    print('Status:', f.status, f.reason)
    for k, v in f.getheaders():
        print('%s: %s' % (k, v))
    print('Data:', f.read().decode('utf-8'))
```

urllib也可以模拟登录请求，发送POST：

```
#POST请求：如果要以POST发送一个请求，只需要把参数data以bytes形式传入。
print('Login to weibo.cn...')
email = input('Email: ')
passwd = input('Password: ')
login_data = parse.urlencode([
    ('username', email),
    ('password', passwd),
    ('entry', 'mweibo'),
    ('client_id', ''),
    ('savestate', '1'),
    ('ec', ''),
    ('pagerefer', 'https://passport.weibo.cn/signin/welcome?entry=mweibo&r=http%3A%2F%2Fm.weibo.cn%2F')
])

req = request.Request('https://passport.weibo.cn/sso/login')
req.add_header('Origin', 'https://passport.weibo.cn')
req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
req.add_header('Referer', 'https://passport.weibo.cn/signin/login?entry=mweibo&res=wel&wm=3349&r=http%3A%2F%2Fm.weibo.cn%2F')

with request.urlopen(req, data=login_data.encode('utf-8')) as f:
    print('Status:', f.status, f.reason)
    for k, v in f.getheaders():
        print('%s: %s' % (k, v))
    print('Data:', f.read().decode('utf-8'))
```

### 8）xml

在Python中使用SAX解析XML非常简洁，我们只需要关心的事件是`start_element`，`end_element`和`char_data`，准备好这3个函数，然后就可以解析xml了。

当SAX解析器读到一个节点时：

```
<a href="/">python</a>
```

会产生3个事件：

1. start_element事件，在读取`<a href="/">`时；
2. char_data事件，在读取`python`时；
3. end_element事件，在读取`</a>`时

- 解析xml示例

```
from xml.parsers.expat import ParserCreate

class DefaultSaxHandler(object):
    def start_element(self, name, attrs):
        print('sax:start_element: %s, attrs: %s' % (name, str(attrs)))

    def end_element(self, name):
        print('sax:end_element: %s' % name)

    def char_data(self, text):
        print('sax:char_data: %s' % text)

xml = r'''<?xml version="1.0"?>
<ol>
    <li><a href="/python">Python</a></li>
    <li><a href="/ruby">Ruby</a></li>
</ol>
'''

handler = DefaultSaxHandler()
parser = ParserCreate()
parser.StartElementHandler = handler.start_element
parser.EndElementHandler = handler.end_element
parser.CharacterDataHandler = handler.char_data
parser.Parse(xml)


#输出如下：
sax:start_element: ol, attrs: {}
sax:char_data:

sax:char_data:
sax:start_element: li, attrs: {}
sax:start_element: a, attrs: {'href': '/python'}
sax:char_data: Python
sax:end_element: a
sax:end_element: li
sax:char_data:

sax:char_data:
sax:start_element: li, attrs: {}
sax:start_element: a, attrs: {'href': '/ruby'}
sax:char_data: Ruby
sax:end_element: a
sax:end_element: li
sax:char_data:

sax:end_element: ol
PS D:\code\python> & "C:/Program Files/Python310/python.exe" d:/code/python/hello.py
sax:start_element: ol, attrs: {}
sax:char_data:

sax:char_data:
sax:start_element: li, attrs: {}
sax:start_element: a, attrs: {'href': '/python'}
sax:char_data: Python
sax:end_element: a
sax:end_element: li
sax:char_data:

sax:char_data:
sax:start_element: li, attrs: {}
sax:start_element: a, attrs: {'href': '/ruby'}
sax:char_data: Ruby
sax:end_element: a
sax:end_element: li
sax:char_data:

sax:end_element: ol
```

- 生成xml示例

```
L = []
L.append(r'<?xml version="1.0"?>')
L.append(r'<root>')
L.append('some & data')
L.append(r'</root>')
print(''.join(L))

#输出如下：
<?xml version="1.0"?><root>some & data</root>
```

### 9）HTMLParser

一般分析一个互联网网站，第一步是用爬虫把目标网站的页面抓下来，第二步就是解析该HTML页面，看看里面的内容到底是新闻、图片还是视频。

Python提供了HTMLParser来非常方便地解析HTML，利用HTMLParser，可以把网页中的文本、图像等解析出来。

```
from html.parser import HTMLParser
from html.entities import name2codepoint

class MyHTMLParser(HTMLParser):

    def handle_starttag(self, tag, attrs):
        print('<%s>' % tag)

    def handle_endtag(self, tag):
        print('</%s>' % tag)

    def handle_startendtag(self, tag, attrs):
        print('<%s/>' % tag)

    def handle_data(self, data):
        print(data)

    def handle_comment(self, data):
        print('<!--', data, '-->')

    def handle_entityref(self, name):
        print('&%s;' % name)

    def handle_charref(self, name):
        print('&#%s;' % name)

parser = MyHTMLParser()
#feed()方法可以多次调用，也就是不一定一次把整个HTML字符串都塞进去，可以一部分一部分塞进去。
parser.feed('''<html>
<head></head>
<body>
<!-- test html parser -->
    <p>Some <a href=\"#\">html</a> HTML&nbsp;tutorial...<br>END</p>
</body></html>''')
```



## 8、常用第三方模块

基本上，所有的第三方模块都会在[PyPI - the Python Package Index](https://pypi.python.org/)上注册，只要找到对应的模块名字，即可用pip安装。

安装后，main环境的外部库储存在python安装目录的Lib/site-packages文件夹中，virtualenv的外部库在C:\Users\用户名\Envs\ENV环境名\Lib\site-packages文件夹中。

pip安装示例：

```
#安装pillow
pip install pillow
```

### 1）pillow

PIL提供了操作图像的强大功能，可以通过简单的代码完成复杂的图像处理。

```
from PIL import Image,ImageFilter,ImageDraw, ImageFont
import random

# 打开一个jpg图像文件，注意是当前路径:
im = Image.open('python-1.png')

#######重新缩放图片
# 获得图像尺寸:
w, h = im.size
print('Original image size: %sx%s' % (w, h))
# 缩放到50%:
im.thumbnail((w//2, h//2))
print('Resize image to: %sx%s' % (w//2, h//2))
# 把缩放后的图像用jpeg格式保存:
im.save('thumbnail.jpg', 'jpeg')

########应用模糊滤镜
im2 = im.filter(ImageFilter.BLUR)
im2.save('blur.jpg', 'jpeg')

#########生成验证码
# 随机字母:
def rndChar():
    return chr(random.randint(65, 90))

# 随机颜色1:
def rndColor():
    return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))

# 随机颜色2:
def rndColor2():
    return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))

# 240 x 60:
width = 60 * 4
height = 60
image = Image.new('RGB', (width, height), (255, 255, 255))
# 创建Font对象:
font = ImageFont.truetype('Arial.ttf', 36)
# 创建Draw对象:
draw = ImageDraw.Draw(image)
# 填充每个像素:
for x in range(width):
    for y in range(height):
        draw.point((x, y), fill=rndColor())
# 输出文字:
for t in range(4):
    draw.text((60 * t + 10, 10), rndChar(), font=font, fill=rndColor2())
# 模糊:
image = image.filter(ImageFilter.BLUR)
image.save('code.jpg', 'jpeg')
```



### 2）requests

Python内置的urllib模块，用于访问网络资源。但是，它用起来比较麻烦，而且，缺少很多实用的高级功能。更好的方案是使用requests。它是一个Python第三方库，处理URL资源特别方便。

安装requests

```
#如果安装了Anaconda，requests就已经可用了。否则，需要在命令行下通过pip安装：
pip install requests
```

简单使用：

```
import requests
#GET方式访问一个网页 不带参数
r = requests.get('https://juejin.cn/') # 掘金社区首页
print(r.status_code)
print(r.text)
print(r.encoding) #获得编码
print(r.content) #获得byte格式内容
print(r.headers) #获取响应头

#GET方式访问一个网页， 传入一个dict作为URL的传参
r = requests.get('https://www.douban.com/search', params={"aid":2608,"uuid":"7324137434249250343","spider":0,"query":"java","id_type":0,"cursor":0,"limit":20,"search_type":0,"sort_type":0,"version":1})


# #需要传入HTTP Header时，传入一个dict作为headers参数：
r = requests.get('https://api.juejin.cn/search_api/v1/search', headers={'authority':'api.juejin.cn','method':'GET','path':'/search_api/v1/search?aid=2608&uuid=7324137434249250343&spider=0&query=java&id_type=0&cursor=0&limit=20&search_type=0&sort_type=0&version=1','User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"}, params={"aid":2608,"uuid":"7324137434249250343","spider":0,"query":"java","id_type":0,"cursor":0,"limit":20,"search_type":0,"sort_type":0,"version":1})
# print(r.status_code)
# print(r.text)
# print(r.encoding) #获得编码
# print(r.content) #获得byte格式内容

#要发送POST请求，只需要把get()方法变成post()，然后传入data参数作为POST请求的数据，同时指定超时时间为2.5秒
r = requests.post('https://accounts.douban.com/login', data={'form_email': 'abc@example.com', 'form_password': '123456'},timeout=2.5)
print(r.status_code)
print(r.text)

#requests默认使用application/x-www-form-urlencoded对POST数据编码。如果要传递JSON数据
params = {'key': 'value'}
r = requests.post(url, json=params) # 内部自动序列化为JSON

#上传文件需要更复杂的编码格式，但是requests把它简化成files参数：
upload_files = {'file': open('report.xls', 'rb')}
r = requests.post(url, files=upload_files)
```



### 3）psutil

> `psutil`这个第三方模块。全称是psutil = process and system utilities，它不仅可以通过一两行代码实现系统监控，还可以跨平台使用，支持Linux／UNIX／OSX／Windows等，是系统管理员和运维小伙伴不可或缺的必备模块。

```
#安装psutil
pip install psutil
```

```
import psutil
#官网 https://github.com/giampaolo/psutil
print(psutil.cpu_count()) # CPU逻辑数量
print(psutil.cpu_count(logical=False)) # CPU物理核心
print(psutil.cpu_times()) #CPU的用户／系统／空闲时间
print(psutil.virtual_memory()) #获取物理内存信息

print(psutil.virtual_memory()) #获取物理内存信息
print(psutil.swap_memory()) #获取交换内存信息

# 可以通过psutil获取磁盘分区、磁盘使用率和磁盘IO信息：
print(psutil.disk_partitions())# 磁盘分区信息
print(psutil.disk_usage('/'))  # 磁盘使用情况
print(psutil.disk_io_counters())  # 磁盘IO

print(psutil.net_io_counters())  # 获取网络读写字节／包的个数
print(psutil.net_if_addrs())  # 获取网络接口信息
print(psutil.net_if_stats())  # 获取网络接口状态
print(psutil.net_connections()) #获取当前网络连接信息

#获取进程信息
print(psutil.pids())  #所有进程ID
p = psutil.Process(9512) # 获取指定进程ID=9512
print(p.name())  # 进程名称
print(p.exe()) #进程路径
print(p.cwd()) # 进程工作目录
print(p.cmdline())  # 进程启动的命令行
print(p.ppid())  # 父进程ID
print(p.parent())  # 父进程
print(p.children())  # 子进程列表
print(p.status())  # 进程状态
print(p.username())  # 进程用户名
print(p.create_time())  # 进程创建时间
print(p.cpu_times())  # 进程使用的CPU时间
print(p.memory_info())  # 进程使用的内存
print(p.memory_info())  # 进程使用的内存
print(p.open_files()) # 进程打开的文件
print(p.open_files()) # 进程打开的文件
print(p.connections())  # 进程相关网络连接
print(p.num_threads())  # 进程的线程数量
print(p.threads())  # 所有线程信息
print(p.environ())  # 进程环境变量
p.terminate() # 结束进程


#实现类似top命令的CPU使用率，每秒刷新一次，累计10次：
for x in range(10):
  print(psutil.cpu_percent(interval=1, percpu=True))
```



## 9、网络编程

### 1）TCP编程

> TCP是建立可靠连接，并且通信双方都可以以流的形式发送数据。

**服务端**

```
# 导入socket库:
import socket,threading,time

def tcplink(sock, addr):
    print('Accept new connection from %s:%s...' % addr)
    sock.send(b'Welcome!')
    while True:
        data = sock.recv(1024)
        time.sleep(1)
        if not data or data.decode('utf-8') == 'exit':
            break
        sock.send(('Hello, %s!' % data.decode('utf-8')).encode('utf-8'))
    sock.close()
    print('Connection from %s:%s closed.' % addr)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 监听端口:
s.bind(('127.0.0.1', 8888))
s.listen(5)
print('Waiting for connection...')
while True:
    # 接受一个新连接:
    sock, addr = s.accept()
    # 创建新线程来处理TCP连接:
    t = threading.Thread(target=tcplink, args=(sock, addr))
    t.start()
```



**客户端**

```
# 导入socket库:
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 建立连接:
s.connect(('127.0.0.1', 8888))
# 接收欢迎消息:
print(s.recv(1024).decode('utf-8'))
for data in [b'aaaaa', b'bbbb', b'cccc']:
    # 发送数据:
    s.send(data)
    print(s.recv(1024).decode('utf-8'))
s.send(b'exit')
s.close()
```



### 2）UDP编程

**服务端**

```
# 导入socket库:
import socket,threading,time
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# 绑定端口:
s.bind(('127.0.0.1', 7777))
print('Bind UDP on 7777...')
while True:
    # 接收数据:
    data, addr = s.recvfrom(1024)
    print('Received from %s:%s.' % addr)
    s.sendto(b'Hello, %s!' % data, addr)
```



**客户端**

```
# 导入socket库:
import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
for data in [b'Michael', b'Tracy', b'Sarah']:
    # 发送数据:
    s.sendto(data, ('127.0.0.1', 7777))
    # 接收数据:
    print(s.recv(1024).decode('utf-8'))
s.close()
```



## 10、数据库

> 这里记录如何通过Python操作MySQL进行编程。

安装MySQL驱动

```
pip install mysql-connector-python --allow-external mysql-connector-python
```

数据库操作

```
# 导入MySQL库:
import mysql.connector

# 注意把password设为你的root口令:
conn = mysql.connector.connect(user='root', password='123456', database='gyd')
cursor = conn.cursor()
# 创建user表:
cursor.execute('create table user (id varchar(20) primary key, name varchar(20))')
# 插入一行记录，注意MySQL的占位符是%s:
cursor.execute('insert into user (id, name) values (%s, %s)', ['2', 'TEST'])
cursor.rowcount

# 提交事务:
conn.commit()
cursor.close()
# 运行查询:
cursor = conn.cursor()
cursor.execute('select * from user_info where id = %s', ('237',))
values = cursor.fetchall()
print(values)
# 关闭Cursor和Connection:
cursor.close()
conn.close()
```

## 11、Web编程

### 1）WSGI框架

>  WSGI：Web Server Gateway Interface。

先定义一个函数：

```
# hello.py
#application()函数是符合WSGI标准的一个HTTP处理函数
#environ：一个包含所有HTTP请求信息的dict对象；
#start_response：一个发送HTTP响应的函数。

start_response：一个发送HTTP响应的函数。
def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    return [b'<h1>Hello, web!</h1>']
```

启动WSGI服务器：

```
# server.py
# 从wsgiref模块导入:
from wsgiref.simple_server import make_server
# 导入我们自己编写的application函数:
from hello import application

# 创建一个服务器，IP地址为空，端口是8000，处理函数是application:
httpd = make_server('', 8000, application)
print('Serving HTTP on port 8000...')
# 开始监听HTTP请求:
httpd.serve_forever()
```

打开浏览器，输入地址`localhost:8000` 访问页面：

<img src="http://cdn.gydblog.com/images/python/python-4.png"  style="zoom: 30%;margin:0 auto;display:block"/>

### 2）WebApp框架

用Python开发一个Web框架十分容易，Python有上百个开源的Web框架。这里我们直接选择一个比较流行的Web框架——[Flask](http://flask.pocoo.org/)来使用。

引入flask模块：

```
pip install flask
```

代码示例：

```
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    return '<h1>Home</h1>'

@app.route('/signin', methods=['GET'])
def signin_form():
    return '''<form action="/signin" method="post">
              <p><input name="username"></p>
              <p><input name="password" type="password"></p>
              <p><button type="submit">Sign In</button></p>
              </form>'''

@app.route('/signin', methods=['POST'])
def signin():
    # 需要从request对象读取表单内容：
    if request.form['username']=='admin' and request.form['password']=='password':
        return '<h3>Hello, admin!</h3>'
    return '<h3>Bad username or password.</h3>'

if __name__ == '__main__':
    app.run()
```



启动app.py，打开浏览器，输入`localhost:5000` 可以访问首页：

<img src="http://cdn.gydblog.com/images/python/python-5.png"  style="zoom: 30%;margin:0 auto;display:block"/>

继续输入`localhost:5000/signin`，可以访问登录表单页：

<img src="http://cdn.gydblog.com/images/python/python-6.png"  style="zoom: 30%;margin:0 auto;display:block"/>

输入账户密码admin\password，可以跳转登录成功页：

<img src="http://cdn.gydblog.com/images/python/python-7.png"  style="zoom: 30%;margin:0 auto;display:block"/>

### 3）HTML模板

Flask通过`render_template()`函数来实现模板的渲染。和Web框架类似，Python的模板也有很多种。Flask默认支持的模板是[jinja2](http://jinja.pocoo.org/)，所以我们先直接安装jinja2：

```
pip install jinja2
```

HTML模板定义：

```
#home.html
<html>
<head>
  <title>Home</title>
</head>
<body>
  <h1 style="font-style:italic">Home</h1>
</body>
</html>
```

```
#form.html
<html>
<head>
  <title>Please Sign In</title>
</head>
<body>
  {% if message %}
  <p style="color:red">{{ message }}</p>
  {% endif %}
  <form action="/signin" method="post">
    <legend>Please sign in:</legend>
    <p><input name="username" placeholder="Username" value="{{ username }}"></p>
    <p><input name="password" placeholder="Password" type="password"></p>
    <p><button type="submit">Sign In</button></p>
  </form>
</body>
</html>
```

```
#signin-ok.html
<html>
<head>
  <title>Welcome, {{ username }}</title>
</head>
<body>
  <p>Welcome, {{ username }}!</p>
</body>
</html>
```

代码编写：

```
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')

@app.route('/signin', methods=['GET'])
def signin_form():
    return render_template('form.html')

@app.route('/signin', methods=['POST'])
def signin():
    username = request.form['username']
    password = request.form['password']
    if username=='admin' and password=='1':
        return render_template('signin-ok.html', username=username)
    return render_template('form.html', message='Bad username or password', username=username)

if __name__ == '__main__':
    app.run()
```



注意html模板和app.py文件的目录结构需要按如下：

<img src="http://cdn.gydblog.com/images/python/python-8.png"  style="zoom: 30%;margin:0 auto;display:block"/>



启动app.py，打开浏览器访问如下路径：

```
locahost:5000
```

启动app.py，打开浏览器，输入`localhost:5000` 可以访问首页；

输入`localhost:5000/siginin`可以访问登录表单页；

输入登录正确的用户名和密码后，可以访问登录成功页`localhost:5000/sign-ok.html`



## 12、参考资料

[3.12.1 Documentation (python.org)](https://docs.python.org/zh-cn/3.12/)

[Python教程 - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1016959663602400)

good good study，day day up!
