---
# icon: lock
date: 2023-07-30
category:
  - 网站建设
---
# 只需几个步骤，给网站增加评论和文章浏览量功能!
只需几个步骤，我就成功的在自己的网站中启用 Waline 提供评论与文章浏览量服务。

## LeanCloud 设置 (数据库)

1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)

2. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个自己喜欢的名字 (注意这里一定选择免费的开发版，如果你特别有钱当我没说...):

   ![创建应用](http://cdn.gydblog.com/images/blog-create/waline-1.png)
   
3. 进入应用，选择左下角的 `设置` > `应用 Key`。你可以看到你的 `APP ID`,`APP Key` 和 `Master Key`。请记录它们，以便后续使用。

   ![ID 和 Key](http://cdn.gydblog.com/images/blog-create/waline-2.png)

::: warning 国内版需要完成备案接入

如果之前正在使用 Leancloud 国内版 ([leancloud.cn](https://leancloud.cn))，推荐直接切换到国际版 ([leancloud.app](https://leancloud.app))。否则，我们需要为应用额外绑定**已备案**的域名，同时购买独立 IP 并完成备案接入:

- 登录国内版并进入需要使用的应用
- 选择 `设置` > `域名绑定` > `API 访问域名` > `绑定新域名` > 输入域名 > `确定`。
- 按照页面上的提示按要求在 DNS 上完成 CNAME 解析。
- 购买独立 IP 并提交工单完成备案接入。(独立 IP 目前价格为 ￥ 50/个/月)

![域名设置](http://cdn.gydblog.com/images/blog-create/waline-3.png)

:::

## Vercel 部署 (服务端)

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)

1. 点击上方按钮，跳转至 Vercel 进行 Server 端部署。

   ::: note

   如果你未登录的话，Vercel 会让你注册或登录，请使用 GitHub 账户进行快捷登录。

   :::

2. 输入一个你喜欢的 Vercel 项目名称并点击 `Create` 继续:

   ![创建项目](http://cdn.gydblog.com/images/blog-create/waline-4.png)

3. 此时 Vercel 会基于 Waline 模板帮助你新建并初始化仓库，仓库名为你之前输入的项目名(我这里示例是waline-test)。

   ![deploy](http://cdn.gydblog.com/images/blog-create/waline-5.png)

   一两分钟后，满屏的烟花会庆祝你部署成功。此时点击屏幕中的 `Go to Dashboard` 可以跳转到应用的控制台。

   ![deploy](http://cdn.gydblog.com/images/blog-create/waline-6.png)

4. 点击顶部的 `Settings` - `Environment Variables` 进入环境变量配置页，并配置三个环境变量 `LEAN_ID`, `LEAN_KEY` 和 `LEAN_MASTER_KEY` 。它们的值分别对应上一步在 LeanCloud 中获得的 `APP ID`, `APP KEY`, `Master Key`。

   ![设置环境变量](http://cdn.gydblog.com/images/blog-create/waline-7.png)

   ::: note

   如果你使用 LeanCloud 国内版，由于国内网络限制原因，请额外配置 `LEAN_SERVER` 环境变量，值为你在leancloud网站上设置模块绑定好的域名。

   :::

1. 环境变量配置完成之后点击顶部的 `Deployments` 点击顶部最新的一次部署右侧的 `Redeploy` 按钮进行重新部署。该步骤是为了让刚才设置的环境变量生效。

   ![redeploy](http://cdn.gydblog.com/images/blog-create/waline-8.png)

1. 此时会跳转到 `Overview` 界面开始部署，等待片刻后 `STATUS` 会变成 `Ready`。此时请点击 `Visit` ，即可跳转到部署好的网站地址，此地址即为你的服务端地址。

   ![redeploy success](http://cdn.gydblog.com/images/blog-create/waline-9.png)

## 绑定域名 (可选)

::: warning

我遇到的问题：  
如果是使用LeanCloud国际版数据库，并直接使用Vercel搭建的waline评论系统，由于xxx.vercel.app域名在国内遭到污染无法访问。

解决方案：  
按本章节的操作步骤，用已备案的博客域名去免费申请一个子域名来代替vercel.app那个被污染的域名。  

本演示是单独申请博客主域名下的子域名：test.gydblog.com ， 需要在域名供应商处新增CNAME类型的域名映射，将子域名映射到Vercel的dns服务器

:::


1. 点击顶部的 `Settings` - `Domains` 进入域名配置页

1. 输入需要绑定的域名并点击 `Add`

   ![Add domain](http://cdn.gydblog.com/images/blog-create/waline-10.png)

1. 在域名服务器商处添加新的 `CNAME` 解析记录
![解析记录配置](http://cdn.gydblog.com/images/blog-create/waline-11.png)  

> 注意这里容易踩坑，如果填写vercel域名配置页生成的dns服务器地址"cname.vercel-dns.com"，会发现自定义域名访问不通，其实这里由于 国内网络原因要填写的value是"cname-china.vercel-dns.com"！！！

   | Type  | Name    | Value                |
   | ----- | ------- | -------------------- |
   | CNAME | test | cname-china.vercel-dns.com |
 

4. 等待生效，你可以通过自己的域名来访问了:tada:

> 我这里自定义域名是"test.gydblog.com"  

   - 评论系统：test.gydblog.com
   - 评论管理：test.gydblog.com/ui

   ![success](http://cdn.gydblog.com/images/blog-create/waline-12.png)

   
## 评论管理 (管理端)

1. 部署完成后，需要先访问 `<serverURL>/ui/register` 进行注册。首个注册的人会被设定成管理员。
  ![success](http://cdn.gydblog.com/images/blog-create/waline-14.png)

1. 管理员登陆后，即可看到评论管理界面。在这里可以修改、标记或删除评论。
![success](http://cdn.gydblog.com/images/blog-create/waline-15.png)

1. 用户也可通过评论框注册账号，登陆后会跳转到自己的档案页。

## vuepress客户端接入
> 这是接入的最后一步啦！！！
### 插件配置

打开项目的主题配置文件theme.ts（或者config.ts），在插件选项中设置 `provider: "Waline"`，同时设置服务端地址 `serverURL` 为上一步获取到的值。
![success](http://cdn.gydblog.com/images/blog-create/waline-13.png)

然后重启项目，可以看到在每个文章页面底部都有相关的评论功能了！  

![success](http://cdn.gydblog.com/images/blog-create/blog-create-12.png)


**开启文章浏览量展示功能**  

只需要增加配置项pageview=true即可，效果如下：  

![success](http://cdn.gydblog.com/images/blog-create/blog-create-13.png)


**开启文章反应功能**

只需要增加配置项reaction=true即可，效果如下：  

![success](http://cdn.gydblog.com/images/blog-create/waline-16.png)

大功告成，是不是很简单呢？
 
::: tip

 Waline 支持的选项配置还有很多。

详情请见 [Waline 配置](https://plugin-comment2.vuejs.press/zh/config/waline.html)

:::

