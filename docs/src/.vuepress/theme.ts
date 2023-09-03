import { hopeTheme, readingTime } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";
export default hopeTheme({
  hostname: "http://www.gydblog.com/",
  //网站左上角logo
  logo: "/assets/icon/avata.svg",
  // 文章信息，可以填入数组，数组的顺序是各条目显示的顺序
  pageInfo: ["Author","Date","Original","Category","Tag","ReadingTime","Word","PageView"],
 
  //全局默认作者
  author: {
    name: "代码小郭",
    url: "/about/",
  },

   // 阿里妈妈图标的前缀
  //  iconPrefix: "iconfont icon-",
   // Iconfont 精选图标 和 阿里妈妈的互斥

   //Iconify: https://icon-sets.iconify.design/
  // Iconfont: https://www.iconfont.cn/
  //Fontawesome: https://fontawesome.com/icons
  iconAssets: "iconfont",
   
  //Git仓库和编辑链接
  repo: "https://github.com/CodingGyd/blog",
  docsDir: "docs/src",
 // 以前的默认仓库分支名，方便提交 pr 和 issue
  docsBranch: "master",
  //在深色模式，浅色模式和自动之间切换 (默认)
  darkmode: "switch",
  //展示全屏按钮
  fullscreen: true,
  //文章是否展示贡献者名称
  contributors:false,
  //文章是否展示最后编辑时间
  lastUpdated:true,
  //文章是否展示[编辑此页]的链接
  editLink:true,

  locales: {
    "/": {

      // 导航
      navbar: enNavbar,
      // sidebar
      sidebar: enSidebar,
       // 页脚支持
      footer: '<a href="http://beian.miit.gov.cn/" target="_blank">备案号:湘ICP备17020097号-1</a>',
      displayFooter: true,

      //博主个人信息
      blog: {
        //文章列表分页配置
        articlePerPage:10,
        // 博主头像
        avatar: "/assets/icon/avata.svg",
        // 圆角  
        roundAvatar: false,
        // 座右铭
        description: "专心写代码，写到没人要为止",
         // 个人介绍页地址
        intro: "/about/intro.html",
        medias: {
          GitHub: "https://github.com/CodingGyd/",
          Zhihu: "https://www.zhihu.com/people/guoyading",
          Baidu: "https://blog.csdn.net/u011208987",//没有对应csdn的图标
          // Weibo: "https://blog.sina.com.cn/u/3373065440",
          
        },
      },

      metaLocales: {
        editLink: "编辑此页",
      },
    },
  },

  copyright:"基于 MIT 协议，© 2019-至今 代码小郭",

  //页面路径是否隐藏(若不隐藏，可以在每个文章目录的README.md下指定页面路径名称)
  breadcrumb:true,
  //文章加密
  encrypt: {
    config: {
      "/fuye/": ["qwe1234567"],
      "/mianshi/": ["qwe1234567"],
      "/it-life/todo-list.html": ["qwe123"],
      "/it-life/fuye.html": ["qwe123"],
      "/it-life/learn.html": ["qwe123"],


    },
  },
  // 文章加密提示文字
  encryptLocales: {
    placeholder: "口令只有作者知道，暂不想开放访问~",

    /**
     * Passwrod error hint
     */
    errorHint: "哈哈，别调戏人家啦，就不让你看",
  },
  plugins: {
    blog: {
      //自动生成摘要设置
      excerptLength: 300,
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
    //vuepress组件库
    components:{
      // 你想使用的组件
      components: [
        "ArtPlayer",
        "AudioPlayer",
        "Badge",
        "BiliBili",
        "CodePen",
        "PDF",
        "Replit",
        "Share",
        "SiteInfo",
        "StackBlitz",
        // "VidStack",
        "VideoPlayer",
        "XiGua",
        "YouTube",
      ],
    },
    mdEnhance:{
      // 启用自定义容器
      container: true,
      // 开启卡片支持
      card: true,
      mark: true,
       //自动对齐
       align: true,
       attrs: true,
       chart: true,
       //代码块分组支持
       codetabs: true,
       demo: true,
       echarts: true,
       figure: true,
       // 支持流程图
       flowchart: true,
       gfm: true,
        // 启用图片懒加载
       imgLazyload: true,
       // 启用图片标记
       imgMark:true,
       imgSize: true,
       include: true,
       katex: true,
       // 支持任务列表
       tasklist: true,
       // 流程图
       mermaid: true,
       playground: {
         presets: ["ts", "vue"],
       },
       // presentation: {
       //   plugins: ["highlight", "math", "search", "notes", "zoom"],
       // },
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
       // 添加选项卡支持
       tabs: true,
       vPre: true,
       vuePlayground: true,
    },

    
  },

});
