---
# icon: lock
date: 2019-04-03
article: false
category:
  - 接口文档
tag:
  - swagger
---

# 接口文档利器-swagger指南
# 接入流程
# 配置

3.0版本在配置上与2.9稍有差别，包括依赖包改为: springfox-boot-starter，启用注解更改为: @EnableOpenApi等。
# 遇到的问题
网上查的答案：
https://blog.csdn.net/LeeKitch/article/details/126967804

而实际我是在nacos增加如下配置解决的：
```
spring:
  mvc:
    custom:
      autoMapping: true
      autoRequestBody: true
      autoResultWrapper: true
      logHttpBody: true
      excludeInterceptUrl: /**/swagger**
      interceptors:
        - .SecurityInterceptor    
```
 