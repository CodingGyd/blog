import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
    {
      text: "学习路线",
      prefix: "xuexiluxian/",
      link: "xuexiluxian/",
      children: "structure",
    },
    {
      text: "超神之路",
      prefix: "chaoshenzhilu/",
      link: "chaoshenzhilu/",
      children: "structure",
    },
    {
      text: "珍藏资源",
      prefix: "zhencangziyuan/",
      children: "structure",
    },
    {
      text: "面试题库",
      prefix: "mianshi/",
      children: "structure",
    },
    {
      text: "副业",
      prefix: "fuye/",
      link:"fuye",
      children: "structure",
    },
    // {
    //   text: "demo1",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    "intro",
    "slides",
  ],
});
