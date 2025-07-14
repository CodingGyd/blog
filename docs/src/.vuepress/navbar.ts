import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "小郭笔记", icon: "note", link: "/note-book.md" },
  { text: "常用链接", icon: "link",link: "/common-links.md" },
  {
    text: "关于本站",
    icon: "info",
    prefix: "/about/",
    children: [
      { text: "网站内容介绍", link: "zd" },
      { text: "网站技术方案", link: "blog-tech-list" },
      {text: "评论接入总结", link: "waline"},
      { text: "版权声明", link: "copyright" },
    ],
  }
]);
