import { hopeTheme, readingTime } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";
 
export default hopeTheme({
  hostname: "http://www.gydblog.com/",
  //网站左上角logo
  logo: "/assets/icon/avata.jpg",
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
  locales: {
    "/": {
      // 导航
      navbar: enNavbar,
      // sidebar
      sidebar: enSidebar,
       // 页脚支持
      footer: '<a href="http://beian.miit.gov.cn/" target="_blank">备案号:湘ICP备17020097号-1</a>',
      displayFooter: true,
      blog: {
        // 博主头像
        avatar: "/assets/icon/avata.jpg",
        // 圆角  
        roundAvatar: true,
        // 座右铭
        description: "博客目前列出的文章标题均为我工作期间接触过的技术栈，目前正在持续重新学习和整理内容中。)",
         // 个人介绍页地址
        intro: "/about/intro.html",
        medias: {
          GitHub: "https://github.com/CodingGyd/",
        },
      },

      metaLocales: {
        editLink: "编辑此页",
      },
    },
  },

  //文章加密
  encrypt: {
    config: {
      "/fuye/": ["qwe1234567"],
      "/mianshi/": ["qwe1234567"],
      "/cszl-combined/todo-list.html": ["qwe123"],

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
    blog: true,
    //该插件会监听页面滚动事件。当页面滚动至某个 标题锚点 后，如果存在对应的 标题链接 ，那么该插件会将路由 Hash 更改为该 标题锚点 。
    activeHeaderLinks: true,
    //文章评论插件
    comment: {
      provider: "Giscus",
        // 插件选项
        comment: true, //启用评论功能
        repo: "CodingGyd/blog-giscus", //远程仓库
        repoId: "R_kgDOJqDkjg", //对应自己的仓库Id
        category: "Announcements",
        categoryId: "DIC_kwDOJqDkjs4CW4Jo" //对应自己的分类Id
  
    },

    mdEnhance: {
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
      mark: true,
      // 支持任务列表
      tasklist: true,
      // 流程图
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
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
