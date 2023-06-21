import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "超神笔记", icon: "discover", link: "/home.md" },
  { text: "学习路线", icon: "discover", link: "/xuexiluxian/"},
  {
    text: "珍藏资源",
    icon: "edit",
    prefix: "/zhencangziyuan/",
    children: [
      { text: "学习资源", link: "learn" },
      { text: "工具软件", link: "tools" },
      { text: "实用网站", link: "websites" },
      { text: "代码片段",link: "code" },

    ],
  },
  {
    text: "面试题库",
    icon: "edit",
    link: "/mianshi/"
  },
  { text: "副业探索", icon: "edit", link: "/fuye/" },
  {
    text: "关于",
    icon: "edit",
    prefix: "/about/",
    children: [
      { text: "个人介绍", icon: "edit", link: "intro" },
    ],
  },

]);
