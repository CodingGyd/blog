import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { 
    text: "博客主页",
    // icon: "gaishu",
    link: "/blog.md" 
  },
  { text: "小郭笔记", icon: "note", link: "/note-book.md" },
  {
    text: "葵花宝典",
    icon: "repo",
    prefix: "/zhencangziyuan/",
    children: [
      { text: "学习资源", link: "learn" },
      { text: "工具软件", link: "tools" },
      { text: "实用网站", link: "websites" },
      { text: "代码轮子",link: "code" },
      { text: "偷懒神器",link: "effect-raising" },
      { text: "编程规约",link: "coding-standard" },

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
      { text: "站点介绍", link: "zd" },
      { text: "建站记录", link: "blog-create" },
      { text: "站长介绍",  link: "intro" },
      { text: "版权声明", link: "copyright" },

    ],
  },

]);
