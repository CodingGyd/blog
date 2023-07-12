import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  // "/": [
  //   "",
  //   "intro",
  //   "slides",
  // ],
  
  
  "/xuexiluxian/": [
    {
      text: '学习路线',
      link: '/xuexiluxian/',
      children: "structure",
    }
  ],
  "/zhencangziyuan/": [
    {
      text: '珍藏资源',
      link: '/zhencangziyuan/',
      children: "structure",
    }
  ],
  "/mianshi/": [
    {
      text: '面试题库',
      link: '/mianshi/',
      children: "structure",
    }
  ],
"/fuye/": [
    {
      text: '副业探索',
      link: '/fuye/',
      children: [   
        { text: "体力篇",  link: "tili" },
        { text: "脑力篇", link: "naoli" },
      ],
      
    }
  ],
  "/about/": [
    {
      text: '关于',
      link: '/about/',
      children: [   
        { text: "站点介绍", link: "zd" },
        { text: "站长介绍", link: "intro" },
        { text: "版权声明", link: "copyright" },
      ],
    }
  ],

  "/": [
    {
      text: "一、前言",
      link: "home.md",
    },
    {
      text: '二、JAVA核心',
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
          "thread-pool"
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
          prefix: "cszl-java-object/",
          text: "2.8 面向对象编程",
          collapsible: true,
          children: [
          "object",
          ],
        },
        {
          prefix: "cszl-java-jvm/",
          text: "2.9 JVM",
          collapsible: true,
          children: [
          "jvm",
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
          "spring",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-springboot/",
          text: "3.2 SpringBoot",
          collapsible: true,
          children: [
          "springboot",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-message/",
          text: "3.3 消息中间件",
          collapsible: true,
          children: [
          "message",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-rpc/",
          text: "3.4 RPC框架",
          collapsible: true,
          children: [
          "dubbo",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-register/",
          text: "3.5 注册中心",
          collapsible: true,
          children: [
          "zookeeper",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-config/",
          text: "3.6 配置中心",
          collapsible: true,
          children: [
          "apollo",
          "eurka",

          ],
        },
        {
          prefix: "cszl-enterprise-development-distributed/",
          text: "3.7 分布式",
          collapsible: true,
          children: [
          "distributed",
          "rongduan",
          "xianliu",
          "jiangji",
          "lock",
          ],
        },
        {
          prefix: "cszl-enterprise-development-code-quality/",
          text: "3.8 代码质量控制",
          collapsible: true,
          children: [
          "code-quality",
          
          ],
        },
        {
          prefix: "cszl-enterprise-development-test/",
          text: "3.9 测试",
          collapsible: true,
          children: [
          "unit-testing",
          "functional-testing",
          "automated-testing",
          "performance-testing",

          ],
        },
        {
          prefix: "cszl-enterprise-development-tools/",
          text: "3.10 开发/构建工具",
          collapsible: true,
          children: [
          "git",
          "svn",
          "maven",
          "nginx",
          "jenkins",
          "ide",
          "xshell",
          ],
        },
        {
          prefix: "cszl-enterprise-development-solution/",
          text: "3.11 好用的解决方案",
          collapsible: true,
          children: [
          "log",
          "mybatis",
         
          ],
        },
      ],
   
    },
    {
      text: '四、数据库',
      collapsible: true,
      prefix: "cszl-db/",
      children: [   
        "redis",
        "mongodb",
        "mysql",
        "oracle",
        "sqlserver",
      ],
   
    },
    {
      text: '五、综合',
      collapsible: true,
      prefix: "cszl-combined/",
      children: [   
        "layered-architecture",
        "domain",
        "poi",
        "blog-create",
        "markdown",
        "git",
        "linux",
        "cros",
        "books",
        "elasticjob",
        "jenkins",
        "nginx",
        "todo-list",
        "industry-lossary"

      ],
   
    },
    {
      text: '六、SOP库(持续更新)',
      collapsible: true,
      prefix: "cszl-sop/",
      children: [   
        "exception-sop",
        "compute-sop",

      ],
   
    }
  ],
  
});
