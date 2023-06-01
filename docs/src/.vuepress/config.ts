import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: "/",

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
  ],

  theme,
   // Enable it with pwa
  // shouldPrefetch: false,
 
});
