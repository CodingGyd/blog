import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { commentPlugin } from "vuepress-plugin-comment2";
import { searchConsolePlugin } from 'vuepress-plugin-china-search-console'


 
export default defineUserConfig({
  base: "/",
  head: [
    //百度资源平台收录
    ['meta', {name: 'referrer', content: 'no-referrer-when-downgrade'}],
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
    //头条搜索
    ["meta", { name: "bytedance-verification-code", content: "0A1aSzjvbI23ILuC5UsA" }],

    //百度联盟
    ["meta", { name: "baidu_union_verify", content: "a47546c48f2c51c0e92b3baaace680cb" }],

    [
      //集成百度访问统计
      // 根据官网数据导出api开通得到的数据中包含ACCESS_TOKEN和REFRESH_TOKEN两个值，其中ACCESS_TOKEN的有效期为一个月，REFRESH_TOKEN的有效期为十年。REFRESH_TOKEN的作用就是刷新获取新的ACCESS_TOKEN和REFRESH_TOKEN，如此反复操作来实现ACCESS_TOKEN有效期永久的机制。一旦ACCESS_TOKEN过期，可根据以下请求更换新的ACCESS_TOKEN和REFRESH_TOKEN：
      //http://openapi.baidu.com/oauth/2.0/token?grant_type=refresh_token&refresh_token={REFRESH_TOKEN}&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}
      // {
      //   "expires_in": 2592000,
      //   "refresh_token": "122.3f6b16953253643159387b599efbd651.YBECoOnSV9CYd-y-EFNZaaSOKAziw7QT9LPJu3Q.w3oOvQ",
      //   "access_token": "121.b8e66f6966434a4c8f99df9fe3cde386.Y5Qdp4sfYkKQInFd6b_Ps2BEd2LIZj-cVNiOiTp.o0aGdA",
      //   "session_secret": "",
      //   "session_key": "",
      //   "scope": "basic"
      // }
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
    [
      //集成不蒜子
      "script",
      {
        async: true,
        src: "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
      }
    ],
    // [
    //   //集成Google AdSense
    //   "script",
    //   {
    //     "data-ad-client": "ca-pub-1601618516206303",
    //     async: true,
    //     src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    //   }
    // ],

    //网页头像
    ["link", { rel: "icon", href: "/assets/icon/avata.svg" }],

  ],
  locales: {
    // 站点配置
    "/": {
      lang: "zh-CN",
      title: "代码小郭",
      description: "代码小郭的技术博客"
    },
  },
 
  plugins: [

    searchProPlugin({
      // 索引全部内容
      indexContent: true,
    }),
 
  ],

  theme,
 
});



