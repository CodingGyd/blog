---
date: 2022-11-21
category:
  - 我的苦逼IT人生路

---

# 开发好习惯

1.项目目录结构要划分明确
目前主流的项目都遵循MVC模式，很多人都习惯将目录直接划分为Controller、Service、Mapper、Modal等。

但未来业务扩展比较快的话，同一个目录下比如Service下会有几十上百个类文件，这看起来也是不合理的。  

正确的做法，是我们最好在一开始就按照业务模块来划分目录结构，如一个论坛系统一般至少有登录、评论、文章、积分这几个模块，service目录下可以按照下面的方式细分：
<img src="http://cdn.gydblog.com/images/it-life/better-coder-1.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>


或者可以直接按照业务模块划分独立的controller、service、mapper、modal，比如下面这样：
> 个人不推荐此目录划分方式，更推荐前一种做法
<img src="http://cdn.gydblog.com/images/it-life/better-coder-2.png"  style="zoom: 40%;margin:0 auto;display:block"/><br/>


2.接口文档要清晰且实时更新

3.参数校验不可少

4.循环逻辑要小心
