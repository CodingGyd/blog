---
# icon: lock
date: 2022-02-05
category:
  - 葵花宝典
tag:
  - markdown
---

# 通用的现代写作技能，你学会了吗？
曾经我们分享知识只是用笔写到纸上就可以，而如今互联网开始兴起，各种在线文章资讯平台层出不穷，大家就把书写转到了各种在线网站上来，这也导致知识传播速度非常快。

<font color=Tomato>那么如何才能快速发布到在线网站呢？</font>

有人发现当他们用本地的Word或者txt文本编辑器思考写好一篇文章，然后准备发布到各个博客、论坛、网站上时，发现格式完全乱了，于是对于每一个网站可能都需要花费大量的时间来重新排版，处理其中的缩进、字体、图片、加粗、标题、颜色等格式问题。最后会发现文章写作可能只花了1小时，但是针对各个网站的排版要求重新排版就花了2小时！

因此我们需要借助一些强大的现代IT工具，让我们可以专注于文章内容本身，提高文章的发布效率。

## 技术文写作思路


### 1）确定主题
比如我想写一篇关于redis的基础知识总结， 主题就是"redis基础知识"，接下来所有的文字都应该围绕该主题进行展开叙述。

### 2）确定大纲

小郭习惯先把文章目录按总分总的模式先建立起来。

例如下面是对一门技术的知识点笔记目录结构：
```
一、前言    
二、xxx简介
三、如何安装
四、基础知识-xxxxx介绍
五、结束语
```

### 3）完善细节
 对于每个目录小节的内容 应该充分调研目前已公开发表的资料，保证描述的准确性。

## 强大的文档书写语言-Markdown
**强烈推荐**<a href="https://markdown.com.cn/" target="_blank">官方语法教程</a>👍👍👍
> Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。
> Markdown 语言在 2004 由约翰·格鲁伯（英语：John Gruber）创建。
> Markdown 编写的文档可以导出 HTML 、Word、图像、PDF、Epub 等多种格式的文档。
> Markdown 编写的文档后缀为 .md, .markdown。

建议安装<a href="https://typoraio.cn/" target="_blank">Typoa工具</a> 书写Markdown语法的文章，支持实时预览！

> 下面列出的都是我写作时常用的markdown语法，以备随时可以查阅，毕竟好记性不如烂笔头。  

### 图片
用法一
```
<img src="http://cdn.gydblog.com/images/logo.png"  style="zoom: 20%;margin:0 auto;display:block"/><br/>
```

示例：
<img src="http://cdn.gydblog.com/images/logo.png"  style="zoom: 20%;margin:0 auto;display:block"/>  



用法二(带底部文字说明)
```
![底部说明文字](http://cdn.gydblog.com/images/logo.png)
```

示例：

![底部说明文字](http://cdn.gydblog.com/images/logo.png)

### 区块高亮
> 提示色，内容使用"::: tip"开始，使用":::"结束
```
::: tip
文本内容
:::
```

示例效果：

::: tip
这里是一个使用提示色的区块
:::

警告色：
```
::: warning
文本内容
:::
```

示例：
::: warning
这里是一个使用警告色的区块
:::


### 标题
标准语法是在文字前面加#和空格， 一个#是一级标题，二个#是二级标题，以此类推。支持六级标题
```
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题
```

### 中划线
要划上中划线的文字左右分别用两个~~包起来


### 加粗
要加粗的文字左右分别用两个*包起来

### 上角标
- ^ 内容 ^ <br/>
例如 2^31^:
```
  2^31^
```

### 下角标
- ~ 内容 ~  <br/>
例如 H~2~O
```
  H~2~O
```

### 分割线
可用三个以上的减号、星号、底线在一空行中建立一条分隔线，中间可以插入空格，但行内不能有其他东西。
```
---
***
___
```

效果如下:

---


### 引用
引用的格式是在符号`>`后面书写文字。如下：
```
> 读一本好书，就是在和高尚的人谈话。 ——歌德

> 雇用制度对工人不利，但工人根本无力摆脱这个制度。 ——阮一峰
```
效果：
> 读一本好书，就是在和高尚的人谈话。 ——歌德

> 雇用制度对工人不利，但工人根本无力摆脱这个制度。 ——阮一峰


### 有序列表

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

### 无序列表
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


### 代码块
> 支持平台：微信代码主题仅支持微信公众号！其他主题无限制。

如果在一个行内需要引用代码，只要用反引号引起来就好，在代码块的开头和结尾分别用```包起来，如下：

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

如果想要代码块折叠效果，可以用如下标签：
```
<details>
  <summary>查看代码</summary>
  <pre><code>  
  &nbsp;
    public void interrupt(){
      
    }
  &nbsp;
  </code></pre>
</details>
```
示例效果：
<details>
  <summary>查看代码</summary>
  <pre><code>  
  &nbsp;
    public void interrupt(){}
  &nbsp;
  </code></pre>
</details>

### 表格
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


### 超链接
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


### 颜色
**字体颜色**  
修改字体颜色，选择颜色名称，例如：
```
<font color="Blue">Test</font>
```
效果为：<font color="Blue">Test</font>


修改字体颜色，选择16进制颜色值，例如：
```
<font color="#00F0FF">Test</font>
```
效果为：<font color="#00F0FF">Test</font>

**背景颜色**  
修改背景颜色，选择颜色名称，例如：
```
//方式1：
<font style="background:red">Test</font>
//方式2:
<span style=background:red>Test</span>
```
效果为：<font style="background:red">Test</font>   <span style=background:red>Test</span>  

修改背景颜色，选择16进制颜色值，例如：
```
//方式1：
<font style="background:#FF0000">Test</font>
//方式2:
<span style="background:#FF0000">Test</span>
```
效果为：<font style="background:FF0000">Test</font>   <span style=background:FF0000>Test</span>  

**支持的颜色**  
> 颜色可以选择下表的颜色名称，或者根据RGB值。

支持的各种颜色名称如下：
		 
<table>
	<thead>
		<tr>
			<th align="left">HTML</th>
			<th align="left">示例</th>
			<th align="left">示例效果</th>
			<th>颜色名称</th>
			<th>16进制</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td align="left">
				<code>&lt;font color=AliceBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=AliceBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="aliceblue">Test</font>
			</td>
			<td>AliceBlue</td>
			<td>#F0F8FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=AntiqueWhite&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=AntiqueWhite&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="antiquewhite">Test</font>
			</td>
			<td>AntiqueWhite</td>
			<td>#FAEBD7</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Aqua&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Aqua&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="aqua">Test</font>
			</td>
			<td>Aqua</td>
			<td>#00FFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Aquamarine&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Aquamarine&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="aquamarine">Test</font>
			</td>
			<td>Aquamarine</td>
			<td>#7FFFD4</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Azure&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Azure&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="azure">Test</font>
			</td>
			<td>Azure</td>
			<td>#F0FFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Beige&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Beige&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="beige">Test</font>
			</td>
			<td>Beige</td>
			<td>#F5F5DC</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Bisque&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Bisque&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="bisque">Test</font>
			</td>
			<td>Bisque</td>
			<td>#FFE4C4</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Black&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Black&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="black">Test</font>
			</td>
			<td>Black</td>
			<td>#000000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=BlanchedAlmond&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=BlanchedAlmond&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="blanchedalmond">Test</font>
			</td>
			<td>BlanchedAlmond</td>
			<td>#FFEBCD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Blue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Blue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="blue">Test</font>
			</td>
			<td>Blue</td>
			<td>#0000FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=BlueViolet&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=BlueViolet&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="blueviolet">Test</font>
			</td>
			<td>BlueViolet</td>
			<td>#8A2BE2</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Brown&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Brown&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="brown">Test</font>
			</td>
			<td>Brown</td>
			<td>#A52A2A</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=BurlyWood&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=BurlyWood&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="burlywood">Test</font>
			</td>
			<td>BurlyWood</td>
			<td>#DEB887</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=CadetBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=CadetBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="cadetblue">Test</font>
			</td>
			<td>CadetBlue</td>
			<td>#5F9EA0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Chartreuse&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Chartreuse&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="chartreuse">Test</font>
			</td>
			<td>Chartreuse</td>
			<td>#7FFF00</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Chocolate&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Chocolate&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="chocolate">Test</font>
			</td>
			<td>Chocolate</td>
			<td>#D2691E</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Coral&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Coral&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="coral">Test</font>
			</td>
			<td>Coral</td>
			<td>#FF7F50</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=CornflowerBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=CornflowerBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="cornflowerblue">Test</font>
			</td>
			<td>CornflowerBlue</td>
			<td>#6495ED</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Cornsilk&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Cornsilk&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="cornsilk">Test</font>
			</td>
			<td>Cornsilk</td>
			<td>#FFF8DC</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Crimson&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Crimson&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="crimson">Test</font>
			</td>
			<td>Crimson</td>
			<td>#DC143C</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Cyan&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Cyan&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="cyan">Test</font>
			</td>
			<td>Cyan</td>
			<td>#00FFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkblue">Test</font>
			</td>
			<td>DarkBlue</td>
			<td>#00008B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkCyan&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkCyan&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkcyan">Test</font>
			</td>
			<td>DarkCyan</td>
			<td>#008B8B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkGoldenRod&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkGoldenRod&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkgoldenrod">Test</font>
			</td>
			<td>DarkGoldenRod</td>
			<td>#B8860B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkGray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkGray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkgray">Test</font>
			</td>
			<td>DarkGray</td>
			<td>#A9A9A9</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkgreen">Test</font>
			</td>
			<td>DarkGreen</td>
			<td>#006400</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkKhaki&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkKhaki&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkkhaki">Test</font>
			</td>
			<td>DarkKhaki</td>
			<td>#BDB76B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkMagenta&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkMagenta&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkmagenta">Test</font>
			</td>
			<td>DarkMagenta</td>
			<td>#8B008B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkOliveGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkOliveGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkolivegreen">Test</font>
			</td>
			<td>DarkOliveGreen</td>
			<td>#556B2F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Darkorange&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Darkorange&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkorange">Test</font>
			</td>
			<td>Darkorange</td>
			<td>#FF8C00</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkOrchid&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkOrchid&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkorchid">Test</font>
			</td>
			<td>DarkOrchid</td>
			<td>#9932CC</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkred">Test</font>
			</td>
			<td>DarkRed</td>
			<td>#8B0000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkSalmon&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkSalmon&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darksalmon">Test</font>
			</td>
			<td>DarkSalmon</td>
			<td>#E9967A</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkSeaGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkSeaGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkseagreen">Test</font>
			</td>
			<td>DarkSeaGreen</td>
			<td>#8FBC8F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkSlateBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkSlateBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkslateblue">Test</font>
			</td>
			<td>DarkSlateBlue</td>
			<td>#483D8B</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkSlateGray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkSlateGray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkslategray">Test</font>
			</td>
			<td>DarkSlateGray</td>
			<td>#2F4F4F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkTurquoise&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkTurquoise&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkturquoise">Test</font>
			</td>
			<td>DarkTurquoise</td>
			<td>#00CED1</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DarkViolet&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DarkViolet&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="darkviolet">Test</font>
			</td>
			<td>DarkViolet</td>
			<td>#9400D3</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DeepPink&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DeepPink&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="deeppink">Test</font>
			</td>
			<td>DeepPink</td>
			<td>#FF1493</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DeepSkyBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DeepSkyBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="deepskyblue">Test</font>
			</td>
			<td>DeepSkyBlue</td>
			<td>#00BFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DimGray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DimGray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="dimgray">Test</font>
			</td>
			<td>DimGray</td>
			<td>#696969</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=DodgerBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=DodgerBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="dodgerblue">Test</font>
			</td>
			<td>DodgerBlue</td>
			<td>#1E90FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Feldspar&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Feldspar&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="#fed0a0">Test</font>
			</td>
			<td>Feldspar</td>
			<td>#D19275</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=FireBrick&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=FireBrick&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="firebrick">Test</font>
			</td>
			<td>FireBrick</td>
			<td>#B22222</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=FloralWhite&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=FloralWhite&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="floralwhite">Test</font>
			</td>
			<td>FloralWhite</td>
			<td>#FFFAF0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=ForestGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=ForestGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="forestgreen">Test</font>
			</td>
			<td>ForestGreen</td>
			<td>#228B22</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Fuchsia&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Fuchsia&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="fuchsia">Test</font>
			</td>
			<td>Fuchsia</td>
			<td>#FF00FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Gainsboro&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Gainsboro&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="gainsboro">Test</font>
			</td>
			<td>Gainsboro</td>
			<td>#DCDCDC</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=GhostWhite&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=GhostWhite&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="ghostwhite">Test</font>
			</td>
			<td>GhostWhite</td>
			<td>#F8F8FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Gold&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Gold&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="gold">Test</font>
			</td>
			<td>Gold</td>
			<td>#FFD700</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=GoldenRod&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=GoldenRod&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="goldenrod">Test</font>
			</td>
			<td>GoldenRod</td>
			<td>#DAA520</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Gray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Gray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="gray">Test</font>
			</td>
			<td>Gray</td>
			<td>#808080</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Green&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Green&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="green">Test</font>
			</td>
			<td>Green</td>
			<td>#008000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=GreenYellow&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=GreenYellow&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="greenyellow">Test</font>
			</td>
			<td>GreenYellow</td>
			<td>#ADFF2F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=HoneyDew&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=HoneyDew&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="honeydew">Test</font>
			</td>
			<td>HoneyDew</td>
			<td>#F0FFF0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=HotPink&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=HotPink&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="hotpink">Test</font>
			</td>
			<td>HotPink</td>
			<td>#FF69B4</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=IndianRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=IndianRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="indianred">Test</font>
			</td>
			<td>IndianRed</td>
			<td>#CD5C5C</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Indigo&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Indigo&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="indigo">Test</font>
			</td>
			<td>Indigo</td>
			<td>#4B0082</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Ivory&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Ivory&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="ivory">Test</font>
			</td>
			<td>Ivory</td>
			<td>#FFFFF0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Khaki&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Khaki&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="khaki">Test</font>
			</td>
			<td>Khaki</td>
			<td>#F0E68C</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Lavender&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Lavender&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lavender">Test</font>
			</td>
			<td>Lavender</td>
			<td>#E6E6FA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LavenderBlush&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LavenderBlush&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lavenderblush">Test</font>
			</td>
			<td>LavenderBlush</td>
			<td>#FFF0F5</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LawnGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LawnGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lawngreen">Test</font>
			</td>
			<td>LawnGreen</td>
			<td>#7CFC00</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LemonChiffon&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LemonChiffon&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lemonchiffon">Test</font>
			</td>
			<td>LemonChiffon</td>
			<td>#FFFACD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightblue">Test</font>
			</td>
			<td>LightBlue</td>
			<td>#ADD8E6</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightCoral&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightCoral&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightcoral">Test</font>
			</td>
			<td>LightCoral</td>
			<td>#F08080</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightCyan&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightCyan&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightcyan">Test</font>
			</td>
			<td>LightCyan</td>
			<td>#E0FFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightGoldenRodYellow&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightGoldenRodYellow&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightgoldenrodyellow">Test</font>
			</td>
			<td>LightGoldenRodYellow</td>
			<td>#FAFAD2</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightGrey&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightGrey&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightgrey">Test</font>
			</td>
			<td>LightGrey</td>
			<td>#D3D3D3</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightGrey&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightGrey&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightgreen">Test</font>
			</td>
			<td>LightGreen</td>
			<td>#90EE90</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightPink&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightPink&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightpink">Test</font>
			</td>
			<td>LightPink</td>
			<td>#FFB6C1</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSalmon&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSalmon&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightsalmon">Test</font>
			</td>
			<td>LightSalmon</td>
			<td>#FFA07A</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSeaGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSeaGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightseagreen">Test</font>
			</td>
			<td>LightSeaGreen</td>
			<td>#20B2AA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSkyBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSkyBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightskyblue">Test</font>
			</td>
			<td>LightSkyBlue</td>
			<td>#87CEFA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSlateBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSlateBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="#0000b0">Test</font>
			</td>
			<td>LightSlateBlue</td>
			<td>#8470FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSlateGray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSlateGray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightslategray">Test</font>
			</td>
			<td>LightSlateGray</td>
			<td>#778899</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightSteelBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightSteelBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightsteelblue">Test</font>
			</td>
			<td>LightSteelBlue</td>
			<td>#B0C4DE</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LightYellow&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LightYellow&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lightyellow">Test</font>
			</td>
			<td>LightYellow</td>
			<td>#FFFFE0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Lime&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Lime&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="lime">Test</font>
			</td>
			<td>Lime</td>
			<td>#00FF00</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=LimeGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=LimeGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="limegreen">Test</font>
			</td>
			<td>LimeGreen</td>
			<td>#32CD32</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Linen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Linen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="linen">Test</font>
			</td>
			<td>Linen</td>
			<td>#FAF0E6</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Magenta&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Magenta&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="magenta">Test</font>
			</td>
			<td>Magenta</td>
			<td>#FF00FF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Maroon&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Maroon&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="maroon">Test</font>
			</td>
			<td>Maroon</td>
			<td>#800000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumAquaMarine&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumAquaMarine&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumaquamarine">Test</font>
			</td>
			<td>MediumAquaMarine</td>
			<td>#66CDAA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumblue">Test</font>
			</td>
			<td>MediumBlue</td>
			<td>#0000CD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumOrchid&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumOrchid&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumorchid">Test</font>
			</td>
			<td>MediumOrchid</td>
			<td>#BA55D3</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumPurple&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumPurple&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumpurple">Test</font>
			</td>
			<td>MediumPurple</td>
			<td>#9370D8</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumSeaGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumSeaGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumseagreen">Test</font>
			</td>
			<td>MediumSeaGreen</td>
			<td>#3CB371</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumSlateBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumSlateBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumslateblue">Test</font>
			</td>
			<td>MediumSlateBlue</td>
			<td>#7B68EE</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumSpringGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumSpringGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumspringgreen">Test</font>
			</td>
			<td>MediumSpringGreen</td>
			<td>#00FA9A</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumTurquoise&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumTurquoise&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumturquoise">Test</font>
			</td>
			<td>MediumTurquoise</td>
			<td>#48D1CC</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MediumVioletRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MediumVioletRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mediumvioletred">Test</font>
			</td>
			<td>MediumVioletRed</td>
			<td>#C71585</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MidnightBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MidnightBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="midnightblue">Test</font>
			</td>
			<td>MidnightBlue</td>
			<td>#191970</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MintCream&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MintCream&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mintcream">Test</font>
			</td>
			<td>MintCream</td>
			<td>#F5FFFA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=MistyRose&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=MistyRose&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="mistyrose">Test</font>
			</td>
			<td>MistyRose</td>
			<td>#FFE4E1</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Moccasin&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Moccasin&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="moccasin">Test</font>
			</td>
			<td>Moccasin</td>
			<td>#FFE4B5</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=NavajoWhite&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=NavajoWhite&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="navajowhite">Test</font>
			</td>
			<td>NavajoWhite</td>
			<td>#FFDEAD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Navy&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Navy&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="navy">Test</font>
			</td>
			<td>Navy</td>
			<td>#000080</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=OldLace&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=OldLace&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="oldlace">Test</font>
			</td>
			<td>OldLace</td>
			<td>#FDF5E6</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Olive&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Olive&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="olive">Test</font>
			</td>
			<td>Olive</td>
			<td>#808000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=OliveDrab&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=OliveDrab&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="olivedrab">Test</font>
			</td>
			<td>OliveDrab</td>
			<td>#6B8E23</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Orange&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Orange&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="orange">Test</font>
			</td>
			<td>Orange</td>
			<td>#FFA500</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=OrangeRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=OrangeRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="orangered">Test</font>
			</td>
			<td>OrangeRed</td>
			<td>#FF4500</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Orchid&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Orchid&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="orchid">Test</font>
			</td>
			<td>Orchid</td>
			<td>#DA70D6</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PaleGoldenRod&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PaleGoldenRod&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="palegoldenrod">Test</font>
			</td>
			<td>PaleGoldenRod</td>
			<td>#EEE8AA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PaleGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PaleGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="palegreen">Test</font>
			</td>
			<td>PaleGreen</td>
			<td>#98FB98</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PaleTurquoise&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PaleTurquoise&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="paleturquoise">Test</font>
			</td>
			<td>PaleTurquoise</td>
			<td>#AFEEEE</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PaleVioletRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PaleVioletRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="palevioletred">Test</font>
			</td>
			<td>PaleVioletRed</td>
			<td>#D87093</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PapayaWhip&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PapayaWhip&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="papayawhip">Test</font>
			</td>
			<td>PapayaWhip</td>
			<td>#FFEFD5</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PeachPuff&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PeachPuff&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="peachpuff">Test</font>
			</td>
			<td>PeachPuff</td>
			<td>#FFDAB9</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Peru&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Peru&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="peru">Test</font>
			</td>
			<td>Peru</td>
			<td>#CD853F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Pink&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Pink&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="pink">Test</font>
			</td>
			<td>Pink</td>
			<td>#FFC0CB</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Plum&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Plum&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="plum">Test</font>
			</td>
			<td>Plum</td>
			<td>#DDA0DD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=PowderBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=PowderBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="powderblue">Test</font>
			</td>
			<td>PowderBlue</td>
			<td>#B0E0E6</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Purple&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Purple&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="purple">Test</font>
			</td>
			<td>Purple</td>
			<td>#800080</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Red&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Red&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="red">Test</font>
			</td>
			<td>Red</td>
			<td>#FF0000</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=RosyBrown&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=RosyBrown&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="rosybrown">Test</font>
			</td>
			<td>RosyBrown</td>
			<td>#BC8F8F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=RoyalBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=RoyalBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="royalblue">Test</font>
			</td>
			<td>RoyalBlue</td>
			<td>#4169E1</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SaddleBrown&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SaddleBrown&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="saddlebrown">Test</font>
			</td>
			<td>SaddleBrown</td>
			<td>#8B4513</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Salmon&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Salmon&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="salmon">Test</font>
			</td>
			<td>Salmon</td>
			<td>#FA8072</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SandyBrown&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SandyBrown&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="sandybrown">Test</font>
			</td>
			<td>SandyBrown</td>
			<td>#F4A460</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SeaGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SeaGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="seagreen">Test</font>
			</td>
			<td>SeaGreen</td>
			<td>#2E8B57</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SeaShell&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SeaShell&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="seashell">Test</font>
			</td>
			<td>SeaShell</td>
			<td>#FFF5EE</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Sienna&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Sienna&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="sienna">Test</font>
			</td>
			<td>Sienna</td>
			<td>#A0522D</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Silver&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Silver&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="silver">Test</font>
			</td>
			<td>Silver</td>
			<td>#C0C0C0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SkyBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SkyBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="skyblue">Test</font>
			</td>
			<td>SkyBlue</td>
			<td>#87CEEB</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SlateBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SlateBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="slateblue">Test</font>
			</td>
			<td>SlateBlue</td>
			<td>#6A5ACD</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SlateGray&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SlateGray&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="slategray">Test</font>
			</td>
			<td>SlateGray</td>
			<td>#708090</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Snow&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Snow&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="snow">Test</font>
			</td>
			<td>Snow</td>
			<td>#FFFAFA</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SpringGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SpringGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="springgreen">Test</font>
			</td>
			<td>SpringGreen</td>
			<td>#00FF7F</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=SteelBlue&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=SteelBlue&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="steelblue">Test</font>
			</td>
			<td>SteelBlue</td>
			<td>#4682B4</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Tan&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Tan&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="tan">Test</font>
			</td>
			<td>Tan</td>
			<td>#D2B48C</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Teal&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Teal&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="teal">Test</font>
			</td>
			<td>Teal</td>
			<td>#008080</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Thistle&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Thistle&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="thistle">Test</font>
			</td>
			<td>Thistle</td>
			<td>#D8BFD8</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Tomato&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Tomato&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="tomato">Test</font>
			</td>
			<td>Tomato</td>
			<td>#FF6347</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Turquoise&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Turquoise&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="turquoise">Test</font>
			</td>
			<td>Turquoise</td>
			<td>#40E0D0</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Violet&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Violet&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="violet">Test</font>
			</td>
			<td>Violet</td>
			<td>#EE82EE</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=VioletRed&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=VioletRed&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="#00e0ed">Test</font>
			</td>
			<td>VioletRed</td>
			<td>#D02090</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Wheat&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Wheat&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="wheat">Test</font>
			</td>
			<td>Wheat</td>
			<td>#F5DEB3</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=White&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=White&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="white">Test</font>
			</td>
			<td>White</td>
			<td>#FFFFFF</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=WhiteSmoke&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=WhiteSmoke&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="whitesmoke">Test</font>
			</td>
			<td>WhiteSmoke</td>
			<td>#F5F5F5</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=Yellow&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=Yellow&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="yellow">Test</font>
			</td>
			<td>Yellow</td>
			<td>#FFFF00</td>
		</tr>
		<tr>
			<td align="left">
				<code>&lt;font color=YellowGreen&gt;</code>
			</td>
			<td align="left">
				<code>&lt;font color=YellowGreen&gt;Test&lt;/font&gt;</code>
			</td>
			<td align="left">
				<font color="yellowgreen">Test</font>
			</td>
			<td>YellowGreen</td>
			<td>#9ACD32</td>
		</tr>
	</tbody>
</table>
