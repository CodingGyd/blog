---
home: true
icon: home
title: 主页
heroImage: /assets/icon/avata.svg
heroText: 代码小郭的常用链接
tagline: 技术学习、吹水讨论入口汇总(持续更新)

<!-- actions:
  - text: 小郭的笔记→
    link: /blog.md
    type: primary
    
  - text: 关于本站
    link: /about/
    type: default -->

docs1:
  - name: IDEA 高效使用指南
    desc: 必备插件推荐 | 插件开发入门 | 重构小技巧 | 源码阅读技巧
    logo: http://cdn.gydblog.com/images/index/logo-idea.svg
    url: https://idea.javaguide.cn/ 
    repo: https://github.com/CodingDocs/awesome-idea
    preview: http://cdn.gydblog.com/images/index/bg-site-idea.png
    
  - name: Spring中文文档
    desc: SPRINGDOC.CN 提供最新的Spring Boot, Spring Cloud, Spring Security等Spring框架的官方中文文档
    logo: http://cdn.gydblog.com/images/index/logo-spring-cn.svg
    url: https://springdoc.cn/
    preview: http://cdn.gydblog.com/images/index/bg-site-spring-cn.png
    
  - name: Java官方API手册
    desc: Java 平台标准版和 JDK各版本 的官方文档汇聚于此。
    logo: http://cdn.gydblog.com/images/index/logo-java.png
    url: https://www.oracle.com/cn/java/technologies/java-se-api-doc.html
    preview: http://cdn.gydblog.com/images/index/bg-site-java-tutorial-oracle.png

  - name: Markdown 官方教程
    desc: Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，Markdown文件的后缀名便是“.md”。
    logo: http://cdn.gydblog.com/images/index/logo-markdown.png
    url: https://markdown.com.cn/
    preview: http://cdn.gydblog.com/images/index/bg-site-markdown.png
  
  - name: Processon
    desc: 免费在线流程图思维导图，专业强大的作图工具，支持多人实时在线协作，可用于原型图、UML、BPMN、网络拓扑图等多种图形绘制
    logo: http://cdn.gydblog.com/images/index/logo-processon.svg
    url: https://www.processon.com/
    preview: http://cdn.gydblog.com/images/index/bg-site-processon.png

  - name: 标智客
    desc: 智能LOGO设计生成
    logo: http://cdn.gydblog.com/images/index/logo-bzk.svg
    url: https://www.logomaker.com.cn/
    preview: http://cdn.gydblog.com/images/index/bg-site-bzk.png
    


docs2:
    - name: 掘金社区
      desc: 一个帮助开发者成长的社区
      logo: http://cdn.gydblog.com/images/index/logo-juejin.svg
      url: https://juejin.cn/
      preview: http://cdn.gydblog.com/images/index/bg-site-juejin.png
      
    - name: 知乎
      desc: 中文互联网高质量的问答社区和创作者聚集的原创内容平台
      logo: http://cdn.gydblog.com/images/index/logo-zhihu.png
      url: https://www.zhihu.com/people/guoyading
      preview: http://cdn.gydblog.com/images/index/bg-site-zhihu.png

    - name: CSDN
      desc: 技术人交流和成长的家园
      logo: http://cdn.gydblog.com/images/index/logo-csdn.png
      url:  https://blog.csdn.net/u011208987
      preview: http://cdn.gydblog.com/images/index/bg-site-csdn.png

    - name: Thief
      desc: 一款AI智能创新摸鱼神器
      logo: http://cdn.gydblog.com/images/index/logo-thief.png
      url: https://thief.im/
      preview: http://cdn.gydblog.com/images/index/bg-site-thief.png
       
docs3:
  - name: VuePress Theme Hope
    desc: 一个具有强大功能的 vuepress 主题✨ 本站页面框架靠它！
    logo: http://cdn.gydblog.com/images/index/logo-vuepress.svg
    url: https://theme-hope.vuejs.press/zh/
    repo: https://github.com/vuepress-theme-hope/vuepress-theme-hope
    preview: http://cdn.gydblog.com/images/index/bg-site-vuepress.png    

  - name: Waline
    desc: 一款简洁、安全的评论系统 本站评论功能靠它！
    logo: http://cdn.gydblog.com/images/index/logo-waline.png
    url: https://waline.js.org/
    repo: https://github.com/walinejs/waline
    preview: http://cdn.gydblog.com/images/index/bg-site-waline.png    

  - name: 百度智能云
    desc: 本站的域名管理、图片存储功能靠它！
    logo: http://cdn.gydblog.com/images/index/logo-bdcloud.png
    url: https://cloud.baidu.com/
    preview: http://cdn.gydblog.com/images/index/bg-site-bdcloud.png  

  - name: 阿里云
    desc: 本站的服务器部署支持靠它！
    logo: http://cdn.gydblog.com/images/index/logo-aly.png
    url: https://cn.aliyun.com/
    preview: http://cdn.gydblog.com/images/index/bg-site-aly.png  

    
footer:   
        <a href="http://beian.miit.gov.cn/" target="_blank">备案号:湘ICP备17020097号-1</a>

---

## 1. 常用开发语言&工具&学习资源(吃饭的家伙🤦‍)

<SiteInfo
  v-for="item in $frontmatter.docs1"
  :key="item.link"
  v-bind="item"
/>

## 2. 技术讨论&生活吹水区(摸鱼放松专区😄)
<SiteInfo
  v-for="item in $frontmatter.docs2"
  :key="item.link"
  v-bind="item"
/>
 

## 3. 建站技术(本站用到的技术栈🧐)
<SiteInfo
  v-for="item in $frontmatter.docs3"
  :key="item.link"
  v-bind="item"
/>
 


## 4. 参与贡献

- 如果你也想贡献一些好玩的、有用的网站链接在本站展示，欢迎提交PR。
- PR提交入口：点击网页右上角github图标进入。
 