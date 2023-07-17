---
# icon: lock
date: 2018-01-05

category:
  - Java核心
tag:
  - 字符串
---

# 字符串
## 概述
字符串(String)是由下划线、数字、字母组成的一串字符，格式是s="i1i2i3i···in"。字符串在存储上类似字符数组，它的每一个单位元素都是可以通过索引提取的，如s="abcdef"，则s[0]="a"，s[1]="b"。  
字符串广泛应用于Java语法中。

## 创建方式
java支持使用构造方法和直接方式两种方式创建一个字符串，直接方式创建的字符串在内存中是存储在公共区域，而构造方法创建的字符串是存储在堆中：
 <img src="/images/java/java-string-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 构造方法
翻看java的String类源码，可以看到Java为我们默认提供了11个构造方法构造String对象，下面列出几个常见的构造方法示例：
```java
public class Test {

    public static void main(String[] args) {

        //构造一个空字符串，相当于String s1="";
        String str1=new String();
        System.out.println("str1的长度="+str1.length()+",str1="+str1);

        //构造一个由内容的字符串,相当于String str2 = "代码小郭";
        String str2 = new String("代码小郭的博客");
        System.out.println("str2的长度="+str2.length()+",str2="+str2);

        //通过字节数组构建字符串对象
        byte[] b = {97,98,99,100};
        String str3=new String(b);
        System.out.println("str3的长度="+str3.length()+",str3="+str3);

        //通过字符数组创建字符串对象
        char[] c = {'代','码','小','郭'};
        String str4 = new String(c, 0, c.length);
        System.out.println("str4的长度="+str4.length()+",str5="+str4);

        //通过字节数组构建字符串对象
        //参数1:字节数组；参数2:起始下标；参数3:长度
        String str5 = new String(b, 0, b.length);
        System.out.println("str5的长度="+str5.length()+",str5="+str5);

    }

}

```
### 直接赋值
```java
public class Test {

    public static void main(String[] args) {

       //直接赋值的方式创建String对象
 
      //特别注意：null表示String对象为空，而""表示是一个长度为零、内容为空的空字符串对象，但该对象不为空，在业务代码编写时需要特别注意这个坑！
      //定义一个值为null的空字符串
      String str1=null;
      System.out.println("str1="+str1);
  
      //定义一个内容为空，长度为零的字符串
      String str2 = "";
      System.out.println("str2的长度="+str2.length()+",str2="+str2);
  
      //定义一个带有内容的字符串
      String s3 = "代码小郭";
      System.out.println("str3的长度="+str3.length()+",str3="+str3);
    }

}
```
## 字符串的常用方法
### 字符串长度获取

int length()方法：返回字符串对象包含的字符数。
```java
int len = str.length();
```

### 连接字符串
String concat(String str)：连接两个字符串的方法
或者直接用‘+’操作符来连接

```java
//String对象的连接
str1.concat(str2);

"两个字符串连接结果："+str1+str2; 
```

### 字符串查找
int indexOf(String s)：字符串s在指定字符串中首次出现的索引位置，如果没有检索到字符串s，该方法返回-1  
int lastIndexOf(String s)：字符串s在指定字符串中最后一次出现的索引位置，如果没有检索到字符串s，该方法返回-1；如果s是空字符串，则返回的结果与length方法的返回结果相同，即返回整个字符串的长度。  
```java
int idx = str.indexOf("a");//字符a在str中首次出现的位置
int idx = str.lastIndexOf("a");
```

### 获取指定位置的字符串
char charAt(int index)方法：返回指定索引出的字符
```java
String str = "abcde";
char thischar = str.charAt(3);//索引为3的thischar是"d"
```

### 获取子字符串
String substring()方法：实现截取字符串，利用字符串的下标索引来截取(字符串的下标是从0开始的，在字符串中空格占用一个索引位置)  

substring(int beginIndex)：截取从指定索引位置开始到字符串结尾的子串  
substring(int beginIndex, int endIndex)：从beginIndex开始，到endIndex结束(不包括endIndex)  
```java
String str = "abcde";
String substr1 = str.substring(2);//substr1为"cde"
String substr2 = str.substring(2,4);//substr2为"cd"
```

### 去除字符串首尾的空格()
String trim()方法
```java
String str = " ab cde ";
String str1 = str.trim();//str1为"ab cde"
```

### 字符串替换
String replace(char oldChar, char newChar)：将指定的字符/字符串oldchar全部替换成新的字符/字符串newChar  
String replaceAll(String regex, String replacement)：使用给定的参数 replacement替换字符串所有匹配给定的正则表达式的子字符串  
String replaceFirst(String regex, String replacement)：使用给定replacement 替换此字符串匹配给定的正则表达式的第一个子字符串
regex是正则表达式，替换成功返回替换的字符串，替换失败返回原字符串
```java
String str = "abcde";
String newstr = str.replace("a","A");//newstr为"Abcde"
```

### 判断字符串的开始与结尾
boolean startsWith()  
boolean startsWith(String prefix)：判断此字符串是否以指定的后缀prefix开始  
boolean startsWith(String prefix, int beginidx)：判断此字符串中从beginidx开始的子串是否以指定的后缀prefix开始  
boolean endsWith(String suffix)：判断此字符串是否以指定的后缀suffix结束  
```java
String str = "abcde";
boolean res = str.startsWith("ab");//res为true
boolean res = str.StartsWith("bc",1);//res为true
boolean res = str.endsWith("de");//res为true
```

### 判断字符串是否相等
boolean equals(Object anObject)：将此字符串与指定的对象比较，区分大小写  
boolean equalsIgnoreCase(String anotherString)：将此 String 与另一个 String 比较，不考虑大小写  
```java
String str1 = "abcde";
String str2 = str1;//字符串str1和str2都是一个字符串对象
String str3 = "ABCDE";
boolean isEqualed = str1.equals(str2);//返回true
boolean isEqualed = str1.equals(str3);//返回false
boolean isEqualed = str1.equlasIgnoreCase(str3);//返回true
```
### 比较两个字符串
int compareTo(Object o)：把这个字符串和另一个对象比较。  
int compareTo(String anotherString)：按字典顺序比较两个字符串。
比较对应字符的大小(ASCII码顺序)，如果参数字符串等于此字符串，则返回值 0；如果此字符串小于字符串参数，则返回一个小于 0 的值；如果此字符串大于字符串参数，则返回一个大于 0 的值。  
```java
String str1 = "abcde";
String str2 = "abcde123";
String str3 = str1;
int res = str1.compareTo(str2);//res = -3
int res = str1.compareTo(str3);//res = 0
int res = str2.compareTo(str1);//res = 3
```

### 把字符串转换为相应的数值
```java
//String转int型：
//第一种
int i = Integer.parseInt(String str)
//第二种
int i = Integer.valueOf(s).intValue();

//String转long型：
long l = Long.parseLong(String str);

//String转double型：
double d = Double.valueOf(String str).doubleValue();//doubleValue()不要也可
double d = Double.parseDouble(str);
 
//int转string型：
//第一种
String s = String.valueOf(i)；
//第二种
String s = Integer.toString(i);
//第三种
String s = "" + i;
```
### 字符大小写转换
String toLowerCase()：将字符串中的所有字符从大写字母改写为小写字母  
String toUpperCase()：将字符串中的所有字符从小写字母改写为大写字母  
```java
String str1 = "abcde";
String str2 = str1.toUpperCase();//str2 = "ABCDE";
String str3 = str2.toLowerCase();//str3 = "abcde";
```

### 字符串分割
String[] split()：根据匹配给定的正则表达式来拆分字符串，将分割后的结果存入字符数组中。  
String[] split(String regex)：regex为正则表达式分隔符, . 、 $、 | 和 * 等转义字符，必须得加 \\；多个分隔符，可以用 | 作为连字符。  
String[] split(String regex, int limit)：limit为分割份数  
```java
String str = "Hello World A.B.C"
String[] res = str.split(" ");//res = {"Hello","World","A.B.C"}
String[] res = str.split(" ",2);//res = {"Hello","World A.B.C"}
String[] res = str.split("\\.");//res = {"Hello World A","B","C"}

String str = "A=1 and B=2 or C=3"
String[] res = str.split("and|or");//res = {"A=1 "," B=2 "," C=3"}
```

### 字符数组与字符串的转换
public String(char[] value) ：通过char[]数组来创建字符串  
char[] toCharArray()：将此字符串转换为一个新的字符数组。  
```java
String str = "abcde";
char mychar[] = str.toCharArray();//char[0] = 'a'; char[1] = 'b'...
```

### 字符串与byte数组的转换
byte[] getBytes()
byte[] getBytes()：使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。  
byte[] getBytes(String charsetName)：使用指定的字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。  
```java
byte[] Str2 = Str1.getBytes();
```

