---
# icon: lock
date: 2023-01-05
category:
  - 建站
tag:
  - 建站
---

# 博客搭建记录
## 主体框架选型
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

我目前采用的是方案二vuepress模板来搭建的，前端功能基本使用现成的轮子组装使用即可，博客整体框架搭建和部署只花了大概2天的时间。接下来大部分精力可以用来思考如何写出好的文章啦。<br/>

vuepress小白教程：https://theme-hope.vuejs.press/zh/cookbook/tutorial/
## 评论插件接入
 详情参考：https://plugin-comment2.vuejs.press/zh/guide/giscus.html

### 如何配置
- 在github上新建一个公开的仓库，并开启评论功能
<img src="/images/cszl-combined/blog-create-2.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>


- 在[giscus配置页](https://giscus.app/zh-CN/) 页面填写仓库和 Discussion 分类，之后滚动到页面下部的 “启用 giscus” 部分，获取 data-repo, data-repo-id, data-category 和 data-category-id 这四个属性
<img src="/images/cszl-combined/blog-create-3.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 在项目中config.ts文件内引入giscus配置页生成的四个属性值
<img src="/images/cszl-combined/blog-create-4.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

完成以上配置工作后，默认评论插件就在每个md文档底部全局开启啦！ 
 
### 遇到的问题
<img src="/images/cszl-combined/blog-create-error-1.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 解决方法：
引入插件后依赖的组件版本和已有的版本有冲突，直接一键更新所有vuepress依赖的组件版本
执行命令： pnpm dlx vp-update

## 访问量统计

### 如何配置
通过接入[百度统计](https://tongji.baidu.com/main/setting/10000555566/home/site/index) 平台来实现<br/>
- 先在平台上新增一个网站配置
<img src="/images/cszl-combined/blog-create-5.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 找到平台生成好的统计代码
<img src="/images/cszl-combined/blog-create-6.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 加入博客项目的config.ts文件中
<img src="/images/cszl-combined/blog-create-7.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 验证
- 启用浏览器的开发者工具，然后访问网站任意一个页面，看开发者工具上有产生如下网络请求则请求成功
<img src="/images/cszl-combined/blog-create-8.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

- 在百度统计后台也可以看到相关pvuv数据(有延迟，建议半小时以后去看)
<img src="/images/cszl-combined/blog-create-9.png"  style="zoom: 50%;margin:0 auto;display:block"/><br/>

### 博客文章实时显示浏览量功能
todo
