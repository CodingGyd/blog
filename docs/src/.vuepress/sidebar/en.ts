import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  // "/": [
  //   "",
  //   "intro",
  //   "slides",
  // ],
  
  
  "/zhencangziyuan/": [
    {
      text: '葵花宝典',
      link: '/zhencangziyuan/',
      collapsible: true,
      children: [
        { text: "代码轮子-减少重复开发工作", link: "code" },
        { text: "合格程序员必备的编程规约", link: "coding-standard" },
        { text: "研发过程-提效工具(摸鱼神器)", link: "effect-raising" },
        { text: "工具软件", link: "tools" },
        { text: "常用网站", link: "websites" },        
      ],
    }
  ],
  "/interview/": [
    {
      text: '面试手册',
      link: '/interview/',
      children: [
        { text: "JAVA面试", link: "interview-java" },
        { text: "77道Spring面试题以及参考答案(转载)", link: "interview-spring" }
      ],
    }
  ],
"/it-life/": [
    {
      text: 'IT人生',
      link: '/it-life/',
      children: [   
        { text: "优秀码农都应该具备的开发好习惯", link: "better-coder" },
        { text: "程序员的中年危机",  link: "fuye" },
        { text: "好用的写作模板，不用头疼排版啦！", link: "markdown-template" },
        { text: "通用的现代写作技能，你学会了吗？",  link: "markdown" },
        { text: "生命不熄,学习不止！",  link: "learn" },
        { text: "待办任务",  link: "todo-list" },

      ],
      
    }
  ],
  "/about/": [
    { text: "一、 网站内容介绍", link: "zd" },
    {text: "二、 发版大事记", link: "blog-version"},
    {text: "三、网站技术方案", link: "blog-tech-list"},
    {text: "W Waline接入总结", link: "waline"},
    { text: "关于作者", link: "intro" },
    { text: "五、版权的声明", link: "copyright" },
  ],

  "/": [
    {
      text: "一、前言",
      link: "note-book.md",
    },
    {
      text: '二、JAVA基础',
      collapsible: true,
      children: [   
        {
          prefix: "cszl-java-overview/",
          text: "2.1 Java概述及环境配置",
          collapsible: true,
          children: [
          {text:"Java的历史",link:"what-is-java"},
          "jdk-install",
          "idea-install",
          {text:"第一个Java程序",link:"hello-with-java"},
          ],
        },
        {
          prefix: "cszl-java-basic/",
          text: "2.2 Java基础语法",
          collapsible: true,
          children: [
          "data-types",
          "keywords",
          "javadoc",
          "flow-control",
          "array",
          "string",
          ],
        },
        {
          prefix: "cszl-java-collections/",
          text: "2.3 集合框架",
          collapsible: true,
          children: [
          "collections",
          "arraylist",
          "linkedlist",
          "hashmap",

          ],
        },
        {
          prefix: "cszl-java-concurrent/",
          text: "2.4 并发编程",
          collapsible: true,
          children: [
          "thread",
          "completableFuture",
          "lock",
          "synchronized",
          "volatile",
          "threadlocal",
          "thread-pool",
          "aqs",
          "queue",
          "atomic",
          "util-class"
          ],
        },
        {
          prefix: "cszl-java-io/",
          text: "2.5 IO编程",
          collapsible: true,
          children: [
          "io",
          ],
        },
        {
          prefix: "cszl-java-exception/",
          text: "2.6 异常处理",
          collapsible: true,
          children: [
          "exception",
          ],
        },
        {
          prefix: "cszl-java-net/",
          text: "2.7 网络编程",
          collapsible: true,
          children: [
          "net",
          ],
        },
        {
          prefix: "cszl-java-jvm/",
          text: "2.8 JVM",
          collapsible: true,
          children: [
          "jvm",
          "jvm-gc",
          "jvm-params"
          ],
        },
      ],
   
    },
    {
      text: '三、企业级开发技术',
      collapsible: true,
      children: [   
        {
          prefix: "cszl-enterprise-development-spring/",
          text: "3.1 Spring",
          collapsible: true,
          children: [
          "what-is-spring",
          "spring-ioc",
          "spring-extension-point",
          "spi",
          "spring-aop",
          "spring-transaction",
          "spring-listener",

          ],
        },
        {
          prefix: "cszl-enterprise-development-springboot/",
          text: "3.2 SpringBoot",
          collapsible: true,
          children: [
          "springboot",
          "springboot-version-list",

          ],
        },
        {
          prefix: "cszl-enterprise-development-message/",
          text: "3.3 消息中间件",
          collapsible: true,
          children: [
          // "message",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-task/",
          text: "3.4 任务调度",
          collapsible: true,
          children: [
          "elasticjob",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-rpc/",
          text: "3.5 RPC框架",
          collapsible: true,
          children: [
          // "dubbo",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-register/",
          text: "3.6 注册中心",
          collapsible: true,
          children: [
          // "zookeeper",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-config/",
          text: "3.7 配置中心",
          collapsible: true,
          children: [
          // "apollo",
          // "eurka",

          ],
        },
        {
          prefix: "cszl-enterprise-development-distributed/",
          text: "3.8 分布式",
          collapsible: true,
          children: [
          "distributed",
          // "rongduan",
          // "xianliu",
          // "jiangji",
          // "lock",
          ],
        },
        {
          prefix: "cszl-enterprise-development-docker/",
          text: "3.9 容器化",
          collapsible: true,
          children: [
          "docker",
        
          ],
        },
        {
          prefix: "cszl-enterprise-development-code-quality/",
          text: "3.10 代码质量",
          collapsible: true,
          children: [
          // "code-quality",
          ],
        },
        {
          prefix: "cszl-enterprise-development-test/",
          text: "3.11 软件测试",
          collapsible: true,
          children: [
          "unit-testing",
          // "functional-testing",
          // "automated-testing",
          "performance-testing",

          ],
        },
        {
          prefix: "cszl-enterprise-development-tools/",
          text: "3.12 开发/构建工具",
          collapsible: true,
          children: [
          // "git",
          // "svn",
          // "maven",
          // "nginx",
          // "ide",
          // "xshell",
          ],
        }
      ],
   
    },
    {
      text: '三、数据库',
      collapsible: true,
      prefix: "cszl-db/",
      children: [   
        // "redis",
        // "mongodb",
        "mysql",
        // "oracle",
        // "sqlserver",
      ],
   
    },
    {
      text: '四、综合',
      collapsible: true,
      prefix: "cszl-combined/",
      children: [   
        "layered-architecture",
        "domain",
        // "nginx",
        "industry-lossary",
        "poi",
      ],
   
    },
    {
      text: '五、SOP库(持续更新)',
      collapsible: true,
      prefix: "cszl-sop/",
      children: [   
        "exception-sop",
        "compute-sop",
        "axure",
        "cros",
        "linux",
        "git"

      ],
   
    }
  ],
  
});
