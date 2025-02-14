import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "小郭笔记", icon: "note", link: "/note-book.md" },
  { text: "常用链接", icon: "link",link: "/common-links.md" },
  // { text: "每日必看", icon: "notice",link: "/it-life/todo-list" },

  {
    text: "葵花宝典",
    icon: "repo",
    prefix: "/zhencangziyuan/",
    children: [
      { text: "工具软件", link: "tools" },
      { text: "代码轮子",link: "code" },
      { text: "编程利器",link: "effect-raising" },
      { text: "编程规约",link: "coding-standard" },
      { text: "Markdown", link: "markdown" },
    ],
  },
  {
    text: "技术题库",
    icon: "repo",
    prefix: "/interview/",
    children: [

      { text: "JAVA", link: "interview-java" },
      { text: "Spring", link: "interview-spring" },
      { text: "SpringBoot", link: "interview-springboot" },
      { text: "SpringCloud", link: "interview-springcloud" },
      { text: "Redis", link: "interview-redis" },
      { text: "Dubbo", link: "interview-dubbo" },
      { text: "Netty", link: "interview-netty" },
      { text: "MySQL", link: "interview-mysql" },
      { text: "Zookeeper", link: "interview-zookeeper" },
      { text: "MQ", link: "interview-mq" }


    ],
  },
  
  // {
  //   text: "IT人生",
  //   icon: "ability",
  //   prefix: "/it-life/",
  //   children: [
  //     // { text: "开发好习惯", link: "better-coder" },
  //     // { text: "程序员的中年危机", link: "fuye" },

  //     // { text: "生命不熄,学习不止！", link: "learn" },
  //     // { text: "每日打卡", link: "todo-list" },

  //   ],
  // },
  {
    text: "关于本站",
    icon: "info",
    prefix: "/about/",
    children: [
      { text: "网站内容介绍", link: "zd" },
      { text: "网站技术方案", link: "blog-tech-list" },
      {text: "Waline接入总结", link: "waline"},
      // { text: "关于作者",  link: "intro" },
      { text: "版权声明", link: "copyright" },
    ],
  }
]);
