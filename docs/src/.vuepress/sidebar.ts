import { sidebar } from "vuepress-theme-hope";

export default sidebar({
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
        { text: "77道Spring面试题以及参考答案(转载)", link: "interview-spring" },
        { text: "Redis经典面试题", link: "interview-redis" }

      ],
    }
  ],
"/it-life/": [
    {
      text: 'IT人生',
      link: '/it-life/',
      children: [   
        // { text: "开发好习惯", link: "better-coder" },
        // { text: "程序员的中年危机",  link: "fuye" },
        { text: "写作模板", link: "markdown-template" },
        { text: "Markdown写作技巧",  link: "markdown" },
        // { text: "生命不熄,学习不止！",  link: "learn" },
        // { text: "每日打卡！！！",  link: "todo-list" },

      ],
      
    }
  ],
  "/about/": [
    { text: "一、 网站内容介绍", link: "zd" },
    {text: "二、 发版记录", link: "blog-version"},
    {text: "三、网站技术方案", link: "blog-tech-list"},
    {text: "Waline接入总结", link: "waline"},
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
          prefix: "java-overview/",
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
          prefix: "java-basic/",
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
          prefix: "java-collections/",
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
          prefix: "java-concurrent/",
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
          prefix: "java-io/",
          text: "2.5 IO编程",
          collapsible: true,
          children: [
          "io",
          ],
        },
        {
          prefix: "java-exception/",
          text: "2.6 异常处理",
          collapsible: true,
          children: [
          "exception",
          ],
        },
        {
          prefix: "java-net/",
          text: "2.7 网络编程",
          collapsible: true,
          children: [
          "net",
          ],
        },
        {
          prefix: "java-jvm/",
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
      text: '三、JAVA企业级开发技术',
      collapsible: true,
      children: [   
        {
          prefix: "spring/",
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
          prefix: "springboot/",
          text: "3.2 SpringBoot",
          collapsible: true,
          children: [
          "springboot",
          "springboot-version-list"
          ],
        },
        {
          prefix: "middleware/",
          text: "3.3 微服务中间件",
          collapsible: true,
          children: [
          "kafka",
          "kafka-config",
          "kafka-operations",
          "elasticjob",
          "nginx",
          "redis",
          "elasticsearch1",
          "elasticsearch2",

          // "dubbo",
          "zookeeper",
          // "apollo",
          // "eurka",
          ],
        },
        {
          prefix: "instant-message/",
          text: "3.4 即时通讯技术",
          collapsible: true,
          children: [
          "websocket",
          ],
        },
        {
          prefix: "distributed/",
          text: "3.5 分布式",
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
          prefix: "docker/",
          text: "3.6 容器化",
          collapsible: true,
          children: [
          "docker",
        
          ],
        },
        {
          prefix: "code-quality/",
          text: "3.7 代码质量",
          collapsible: true,
          children: [
          // "code-quality",
          ],
        },
        {
          prefix: "test/",
          text: "3.8 软件测试",
          collapsible: true,
          children: [
          "unit-testing",
          // "functional-testing",
          // "automated-testing",
          "performance-testing",

          ],
        },
        {
          prefix: "tools/",
          text: "3.9 开发/构建工具",
          collapsible: true,
          children: [
          // "git",
          // "svn",
          // "maven",
          // "ide",
          // "xshell",
          ],
        },
        {
          prefix: "security/",
          text: "3.10 安全相关",
          collapsible: true,
          children: [
          "data-security",
          "api-security"
          ],
        }
      ],
   
    },
    {
      text: '四、数据库',
      collapsible: true,
      prefix: "db/",
      children: [   
        "mysql",
        "mysql-gf",
        "mysql-index",
        "mysql-tiaoyou",
        "mysql-mianshi",
        "dm"

      ],
    },
    {
      text: '五、Python基础',
      collapsible: true,
      prefix: "python/",
      children: [   
        "python-hello",
      ],
   
    },
    {
      text: '六、综合',
      collapsible: true,
      prefix: "combined/",
      children: [   
        "layered-architecture",
        "domain",
        "industry-lossary",
        "poi",
      ],
   
    },
    {
      text: '七、SOP库(持续更新)',
      collapsible: true,
      prefix: "sop/",
      children: [   
        "exception-sop",
        "compute-sop",
        "axure",
        "cros",
        "linux",
        "git"

      ],
   
    }
  ]
});
