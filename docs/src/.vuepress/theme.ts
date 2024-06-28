import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "http://www.gydblog.com/",

  //全局默认作者
  author: {
    name: "代码小郭",
    url: "/about/",
  },

  iconAssets: "iconify",

  //网站左上角logo
  logo: "/assets/icon/avata.svg",
  //Git仓库和编辑链接
  repo: "https://github.com/CodingGyd/blog",
  docsDir: "docs/src",
  // 以前的默认仓库分支名，方便提交 pr 和 issue
   docsBranch: "master",
 //文章是否展示贡献者名称
 contributors:false,
 //文章是否展示最后编辑时间
 lastUpdated:true,
 //文章是否展示[编辑此页]的链接
 editLink:true,


  // navbar
  navbar,

  // sidebar
  sidebar,
  // 页脚支持
  footer: '<a href="http://beian.miit.gov.cn/" target="_blank">备案号:湘ICP备17020097号-1</a>',


  displayFooter: true,

  blog: {
   //文章列表分页配置
   articlePerPage:10,
   // 博主头像
   avatar: "/assets/icon/avata.svg",
   // 座右铭
   description: "专心写代码，写到没人要为止",
    // 个人介绍页地址
  //  intro: "/about/intro.html",
  // intro: "/about/intro.html",
   medias: {
     GitHub: "https://github.com/CodingGyd/",
     Zhihu: "https://www.zhihu.com/people/guoyading",
     Baidu: "https://blog.csdn.net/u011208987",//没有对应csdn的图标
     // Weibo: "https://blog.sina.com.cn/u/3373065440",
     Email: "mailto:964781872@qq.com",
   },
  },

  encrypt: {
    config: {
      "/it-life/todo-list.html": ["test13123"],
      "/it-life/fuye.html": ["testqweas"],
      "/it-life/learn.html": ["testxzs"],

    },
  },

  // page meta
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  plugins: {
    blog: true,
    //vuepress组件库
    components:{
      // vuepress组件库 你想使用的组件
      components: [
        "ArtPlayer",
        "Badge",
        "BiliBili",
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "StackBlitz",
        // "VidStack",
        "XiGua",
        "VPCard"
      ],
    },
    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
    },
    searchPro:{
      // 索引全部内容
      indexContent: true,
     },
  //该插件会监听页面滚动事件。当页面滚动至某个 标题锚点 后，如果存在对应的 标题链接 ，那么该插件会将路由 Hash 更改为该 标题锚点 。
  activeHeaderLinks: true,
  //文章评论插件
  comment: {

      //git库的评论插件(废弃)
      // provider: "Giscus",
      // // 插件选项
      // comment: true, //启用评论功能
      // repo: "CodingGyd/blog-giscus", //远程仓库
      // repoId: "R_kgDOJqDkjg", //对应自己的仓库Id
      // category: "Announcements",
      // categoryId: "DIC_kwDOJqDkjs4CW4Jo" //对应自己的分类Id
      //评论系统waline
      provider:"Waline",
      //启用评论功能
      comment: true, 
      serverURL:"https://waline.gydblog.com/",
      //评论字数限制
      wordLimit:1000000,
      //文章反应
      reaction:true,
      //页面访问量统计并展示
      pageview:true,

  },
  //版权限制
  copyright:{
      //禁用复制和粘贴
      // disableCopy:true,
      //版权声明
      global:true,
      author:"代码小郭",
      // license:"协议",
      triggerLength:10,
  },
    
  },
});
