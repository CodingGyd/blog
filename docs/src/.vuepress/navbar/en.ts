import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  "/",
  { text: "超神之路", icon: "discover", link: "/home.md" },
  { text: "学习路线", icon: "discover", link: "/xuexiluxian/"},
  {
    text: "珍藏资源",
    icon: "edit",
    prefix: "/zhencangziyuan/",
    children: [
      { text: "PDF资源", icon: "edit", link: "pdf" },
      { text: "破解工具", icon: "edit", link: "tools" },
      { text: "实用网站", icon: "edit", link: "websites" },
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
