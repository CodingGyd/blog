import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { commentPlugin } from "vuepress-plugin-comment2";


 
export default defineUserConfig({
  base: "/",
  head: [
    //百度资源平台收录
    ['meta', {name: 'baidu-site-verification', content: 'codeva-tWf4n24Yyh'}],
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "代码小郭" }],
    [
      "meta",
      {
        "http-equiv": "Cache-Control",
        content: "no-cache, no-store, must-revalidate",
      },
    ],
    ["meta", { "http-equiv": "Pragma", content: "no-cache" }],
    ["meta", { "http-equiv": "Expires", content: "0" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "代码小郭, 技术博客, Java, Java基础, Mysql, Spring, Redis, 消息队列, 生活随笔, 分享, 人生感悟",
      },
    ],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],

    [
      //集成百度访问统计
      'script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?a27504a4817b85eaa9887b38169a5a29";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
    //网页头像
    ["link", { rel: "icon", href: "/assets/icon/avata.jpg" }],

  ],
  locales: {
    "/": {
      lang: "zh-CN",
      title: "代码小郭",
    },
  },
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
    }),
    // commentPlugin({
    //   // 插件选项
    //   provider: "Giscus", //评论服务提供者。
    //   comment: true, //启用评论功能
    //   repo: "CodingGyd/blog-giscus", //远程仓库
    //   repoId: "R_kgDOJqDkjg", //对应自己的仓库Id
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOJqDkjs4CW4Jo" //对应自己的分类Id

    // }),
  ],

  theme,
   // Enable it with pwa
  // shouldPrefetch: false,
 
});



