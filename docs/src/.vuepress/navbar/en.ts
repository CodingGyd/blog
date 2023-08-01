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
      { text: "工具软件", link: "tools" },
      { text: "实用网站", link: "websites" },
      { text: "代码轮子",link: "code" },
      { text: "摸鱼神器",link: "effect-raising" },
      { text: "编程规约",link: "coding-standard" },

    ],
  },
  {
    text: "IT人生",
    icon: "ability",
    prefix: "/it-life/",
    children: [
      { text: "程序员的中年危机", link: "fuye" },
      { text: "好用的写作模板，不用头疼排版啦！", link: "markdown-template" },
      { text: "通用的现代写作技能，你学会了吗？", link: "markdown" },
      { text: "生命不熄,学习不止！", link: "learn" },
      { text: "待办任务清单", link: "todo-list" },

    ],
  },
  {
    text: "关于本站",
    icon: "info",
    prefix: "/about/",
    children: [
      { text: "网站内容介绍", link: "zd" },
      { text: "发版大事记", link: "blog-version" },
      { text: "网站技术方案", link: "blog-tech-list" },
      { text: "博主的自我介绍",  link: "intro" },
      { text: "版权声明", link: "copyright" },
    ],
  },

]);
