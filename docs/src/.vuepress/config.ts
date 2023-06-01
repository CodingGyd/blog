import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { commentPlugin } from "vuepress-plugin-comment2";


 
export default defineUserConfig({
  base: "/",
  head: [
    [
      'script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?a27504a4817b85eaa9887b38169a5a29";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ]
  ],

  locales: {
    "/": {
      lang: "zh-CN",
      title: "代码小郭",
      // description: "A blog demo for vuepress-theme-hope",
    },
  },
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
    }),
    commentPlugin({
      // 插件选项
      provider: "Giscus", //评论服务提供者。
      comment: true, //启用评论功能
      repo: "CodingGyd/blog-giscus", //远程仓库
      repoId: "R_kgDOJqDkjg", //对应自己的仓库Id
      category: "Announcements",
      categoryId: "DIC_kwDOJqDkjs4CW4Jo" //对应自己的分类Id

    }),
  ],

  theme,
   // Enable it with pwa
  // shouldPrefetch: false,
 
});



