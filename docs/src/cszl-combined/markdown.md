---
# icon: lock
date: 2022-02-05
category:
  - Markdown语法
tag:
  - Markdown语法
---

# Markdown语法
 
## 图片
用法一
```
<img src="/images/logo.png"  style="zoom: 20%;margin:0 auto;display:block"/><br/>
```

示例：
<img src="/images/logo.png"  style="zoom: 20%;margin:0 auto;display:block"/>  



用法二(带底部文字说明)
```
![底部说明文字](/images/logo.png)
```

示例：

![底部说明文字](/images/logo.png)


## 标题
标准语法是在文字前面加#和空格， 一个#是一级标题，二个#是二级标题，以此类推。支持六级标题
```
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题
```

## 加粗
要加粗的文字左右分别用两个*包起来

## 代码块
在代码块的开头和结尾分别用```包起来

## 上角标
- ^ 内容 ^ <br/>
例如 2^31^:
```
  2^31^
```
## 下角标
- ~ 内容 ~  <br/>
例如 H~2~O
```
  H~2~O
```

## 分割线
可用三个以上的减号、星号、底线在一空行中建立一条分隔线，中间可以插入空格，但行内不能有其他东西。
```
---
***
___
```

效果如下:

---


## 引用
引用的格式是在符号`>`后面书写文字。如下：
```
> 读一本好书，就是在和高尚的人谈话。 ——歌德

> 雇用制度对工人不利，但工人根本无力摆脱这个制度。 ——阮一峰
```
效果：
> 读一本好书，就是在和高尚的人谈话。 ——歌德

> 雇用制度对工人不利，但工人根本无力摆脱这个制度。 ——阮一峰


## 有序列表

有序列表的使用，在数字及符号`.`后加空格后输入内容，如下：
```
1. 有序列表 1
2. 有序列表 2
3. 有序列表 3
```

效果：
1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

## 无序列表
无序列表的使用，在符号`-`后加空格使用。如下：
```
- 无序列表 1
- 无序列表 2
- 无序列表 3
```
如果要控制列表的层级，则需要在符号`-`前使用空格。如下：
```
- 无序列表 1
- 无序列表 2
  - 无序列表 2.1
  - 无序列表 2.2
```

效果：
- 无序列表 1
- 无序列表 2
- 无序列表 3

*** 
- 无序列表 1
- 无序列表 2
  - 无序列表 2.1
  - 无序列表 2.2


## 代码块
> 支持平台：微信代码主题仅支持微信公众号！其他主题无限制。

如果在一个行内需要引用代码，只要用反引号引起来就好，如下：

Use the `printf()` function.

在需要高亮的代码块的前一行及后一行使用三个反引号，同时**第一行反引号后面表示代码块所使用的语言**，如下：

```java
// FileName: HelloWorld.java
public class HelloWorld {
  // Java 入口程序，程序从此入口
  public static void main(String[] args) {
    System.out.println("Hello,World!"); // 向控制台打印一条语句
  }
}
```

支持以下语言种类：

```
bash
clojure，cpp，cs，css
dart，dockerfile, diff
erlang
go，gradle，groovy
haskell
java，javascript，json，julia
kotlin
lisp，lua
makefile，markdown，matlab
objectivec
perl，php，python
r，ruby，rust
scala，shell，sql，swift
tex，typescript
verilog，vhdl
xml
yaml
```

如果想要更换代码高亮样式，可在上方**代码主题**中挑选。

其中**微信代码主题与微信官方一致**，有以下注意事项：

- 带行号且不换行，代码大小与官方一致
- 需要在代码块处标志语言，否则无法高亮
- 粘贴到公众号后，用鼠标点代码块内外一次，完成高亮

diff 不能同时和其他语言的高亮同时显示，且需要调整代码主题为微信代码主题以外的代码主题才能看到 diff 效果，使用效果如下:

```diff
+ 新增项
- 删除项
```

**其他主题不带行号，可自定义是否换行，代码大小与当前编辑器一致**



## 表格
要添加表，请使用三个或多个连字符（---）创建每列的标题，并使用管道（|）分隔每列。您可以选择在表的任一端添加管道。
格式如下
```
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
```

效果如下：
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |


## 超链接
链接文本放在中括号内，链接地址放在后面的括号中，链接title可选。  

超链接Markdown语法代码：
```
[超链接显示名](超链接地址 "超链接title")  
```

对应的HTML代码：
```
<a href="超链接地址" title="超链接title">超链接显示名</a>
```
示例：
```
这是一个链接 [菜鸟教程|HashMap](https://www.runoob.com/java/java-hashmap.html)。
```
效果如下：  
这是一个链接 [菜鸟教程|HashMap](https://www.runoob.com/java/java-hashmap.html)。
