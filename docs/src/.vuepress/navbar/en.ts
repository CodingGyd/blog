import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "小郭笔记", icon: "note", link: "/home.md" },
  {
    text: "葵花宝典",
    icon: "repo",
    prefix: "/zhencangziyuan/",
    children: [
      { text: "学习资源", link: "learn" },
      { text: "工具软件", link: "tools" },
      { text: "实用网站", link: "websites" },
      { text: "代码片段",link: "code" },
      { text: "偷懒神器",link: "effect-raising" },
      { text: "网络梯子",link: "vpn" },

    ],
  },
  {
    text: "面试题库",
    icon: "question",
    link: "/mianshi/"
  },
  { text: "副业探索", icon: "ability", link: "/fuye/" },
  {
    text: "关于本站",
    icon: "info",
    prefix: "/about/",
    children: [
      { text: "站点介绍", icon: "edit", link: "zd" },
      { text: "建站记录", icon: "edit", link: "blog-create" },
      { text: "站长介绍", icon: "edit", link: "intro" },
      { text: "版权声明", icon: "edit", link: "copyright" },

    ],
  },

]);
