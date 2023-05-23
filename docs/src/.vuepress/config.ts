import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "JAVA程序员超神之路",
      description: "A blog demo for vuepress-theme-hope",
    },
    
    
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
