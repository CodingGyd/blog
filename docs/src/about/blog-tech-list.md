---
# icon: lock
date: 2023-01-05
category:
  - 建站过程记录
star: 9
sticky: 8
---

# 网站开发技术选型
> 记录本网站用到的主要技术栈
 
## 1.1、主体框架选型
<table>
  <tr>
    <th>方案</th>
    <th>优点</th>
    <th>缺点</th>
  </tr>
  <tr>
    <td>方案一: 自主开发前后端服务</td>
    <td>完全自主可控，可随意修改</td>
    <td>维护成本高，对本人开发要求高</td>
  </tr>
  <tr>
    <td>方案二: 采用vuepress</td>
    <td>页面简洁美观，接入简单！</td>
    <td>需要简单了解vue的相关知识</td>
  </tr>
</table>

以上两种方案我都有尝试过，一开始用的是方案一，前端后端都是自己实现的服务，整体看下来界面感觉不是很好看，很多功能都比较粗糙，感觉平时花费在编写前后端功能模块代码的时间多过博客文章的总结编写，已经偏离了自己搭建博客的初衷。
附上源代码链接： <a href="https://github.com/CodingGyd/mine-client" text="前端工程" target="_blank"></a> <a href="https://github.com/CodingGyd/mine-server" text="后端工程" target="_blank"></a> <a href="https://github.com/CodingGyd/mine-sys" text="管理后台工程" target="_blank"></a>
<br/>

我目前采用的是方案二vuepress的博客模板vuepress-theme-hope来搭建的，前端功能基本使用现成的轮子组装使用即可，博客整体框架搭建和部署只花了大概2天的时间。接下来大部分精力可以用来思考如何写出好的文章啦。<br/>

vuepress小白教程：<a href="https://theme-hope.vuejs.press/zh/cookbook/tutorial/" text="戳这里！" target="_blank"></a>  

## ~~1.2、评论插件接入(废弃)~~

~~详情参考：<a href="https://plugin-comment2.vuejs.press/zh/guide/giscus.html" text="戳这里！" target="_blank"></a>~~


### ~~01、如何配置~~
- ~~在github上新建一个公开的仓库，并开启评论功能~~
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


- ~~在[giscus配置页](https://giscus.app/zh-CN/) 页面填写仓库和 Discussion 分类，之后滚动到页面下部的 “启用 giscus” 部分，获取 data-repo, data-repo-id, data-category 和 data-category-id 这四个属性~~
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- ~~在项目中config.ts文件内引入giscus配置页生成的四个属性值~~
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

~~完成以上配置工作后，默认评论插件就在每个md文档底部全局开启啦！~~ 
 
### ~~02、遇到的问题~~
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-error-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- ~~解决方法：~~
~~引入插件后依赖的组件版本和已有的版本有冲突，直接一键更新所有vuepress依赖的组件版本~~
~~执行命令： pnpm dlx vp-update~~

## 1.2、评论插件接入(最新)
原本使用的是giscus方式，使用一段时间下来发现有一个最大的缺点：
- 游客无法评论，必须有github账户。
   > 这也就限定了网站客户群体只能是IT相关人员，而我打算把网站打造成一个以IT行业为切入点，辐射到各个行业资讯的综合性博客，不符合我的定位。  
   
经过查找对比，发现了比较适合我的waline评论系统，不仅支持游客评论，还支持单篇文章浏览量的统计和展示，非常符合我当前的需求，因此决定将giscus替换为waline。

官方接入步骤参考：<a href="https://waline.js.org/guide/get-started/" text="戳这里！" target="_blank"></a>  

也可以看这里：[Waline接入总结记录](./waline.md)

 
## 1.3、访问量统计

### 接入百度统计
通过接入[百度统计](https://tongji.baidu.com/main/setting/10000555566/home/site/index) 平台来实现<br/>
- 先在平台上新增一个网站配置
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 找到平台生成好的统计代码
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 加入博客项目的config.ts文件中
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

**验证**    

- 启用浏览器的开发者工具，然后访问网站任意一个页面，看开发者工具上有产生如下网络请求则请求成功
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 在百度统计后台也可以看到相关pvuv数据(有延迟，建议半小时以后去看)
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 接入waline评论系统
百度统计支持对PVUV的统计，且开放了api用于网页查询和展示在页面上，但是api调用比较麻烦。      

正好本站使用的建站框架模板vuepress-theme-hope给我们提供了开箱即用的配置，只需要一个配置项即可在页面上实时展示浏览量了。 

具体配置方式如下：
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-14.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

效果：  
<img src="http://cdn.gydblog.com/images/blog-create/blog-create-13.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

## 1.4、图片存储方案
本博客文章中用到了大量的图片资源，之前是直接将图片文件放在博客项目工程中，随着文章数量越来越多，大量的图片资源导致项目整体大小过于庞大(目前制品包已经54M了...)，因此我考虑将图片存储到第三方云端。

目前主流的云服务商都提供了文件存储云服务，比如阿里云对象存储OSS和百度云对象存储OSS， 由于我的域名是在百度供应商处注册的，对象存储OSS需要自定义域名的方式，因此我选择了百度供应商的oss服务来存放博客的图片资源。
 
此处记录一下接入百度云对象存储oss并实现自定义域名访问图片的主要步骤过程。

### 01、 登录百度智能云控制台，找到对象存储OSS管理入口
<img src="http://cdn.gydblog.com/images/blog-create/oss-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
### 02、 进入对象存储BOS控制台的bucket列表菜单，创建一个bucket
> 我创建的bucket命名是"gydblog"  
> 这里的配置按需选择  
<img src="http://cdn.gydblog.com/images/blog-create/oss-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/blog-create/oss-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 03、 上传一张测试图片
<img src="http://cdn.gydblog.com/images/blog-create/oss-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>
<img src="http://cdn.gydblog.com/images/blog-create/oss-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 04、 预览图片
回到文件列表，找到刚上传的图片记录，点击[复制链接]，在浏览器即可打开预览
> 生成的文件url是https://gydblog.fsh.bcebos.com/images/blog-create/easycode-1.png
<img src="http://cdn.gydblog.com/images/blog-create/oss-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

预览效果： 
<img src="http://cdn.gydblog.com/images/blog-create/oss-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


### 05、 自定义预览url中的域名
默认生成的域名是百度oss官方提供的官方域名，上面默认的官方域名是"gydblog.fsh.bcebos.com"，可以在tab【发布管理】中看到：
<img src="http://cdn.gydblog.com/images/blog-create/oss-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

但我想自定义一个域名叫"cdn.gydblog.com"， 和博客主域名风格保持一致，如何操作呢？

先找到[自定义域名]配置的入口：
<img src="http://cdn.gydblog.com/images/blog-create/oss-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


点击上图【添加自定义域名】后会跳出两种编辑框，分别如下：
- a.若是第一次添加，需要额外验证下域名的归属是否本人
(验证的具体操作见操作文档[验证域名归属](https://cloud.baidu.com/doc/BOS/s/ckaqihkra#%E5%88%9B%E5%BB%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9F%9F%E5%90%8D)   
界面长下面这样：  
<img src="http://cdn.gydblog.com/images/blog-create/oss-10.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


- b. 若非第一次添加，则只要填写自定义的域名并点击确认就可以
界面长下面这样：  
<img src="http://cdn.gydblog.com/images/blog-create/oss-11.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


自定义域名填写窗口填写完整并点击确认后，列表中就会出现一条自定义域名记录：
<img src="http://cdn.gydblog.com/images/blog-create/oss-12.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


完成上面步骤后，还差最后一步：在域名供应商的域名管理配置中心 增加自定义域名的CNAME解析记录。

我的域名供应商是百度，百度域名操作具体操作手册可以查看[CNAME域名解析说明](https://cloud.baidu.com/doc/BOS/s/ckaqihkra#cname%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90)

我的域名cname解析配置如下：
<img src="http://cdn.gydblog.com/images/blog-create/oss-13.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


好了，所有配置都完成了！  

先前默认生成的测试图片预览链接是："https://gydblog.fsh.bcebos.com/images/blog-create/easycode-1.png"   

现在可以改为自定义域名访问："https://cdn.gydblog.com/images/blog-create/easycode-1.png"


大功告成！

接下来就是花时间把存量的图片都迁移到百度oss服务里， 迁移前项目打包输出目录有53M， 迁移完成后降到33M了！！！