---
date: 2023-06-20
category:
  - github
tag:
  - github
---
# 完美解决github访问慢的问题！

如果你存在以下情况:
```
访问速度慢的问题

项目中的图片显示不出的问题

本文应该可以在两分半内帮你解决 .

本文主要仅仅搬运了windows的解决办法
```

**操作步骤**  
找到host文件C:\Windows\System32\drivers\etc\hosts，追加如下映射:  
```
# GitHub520 Host Start
140.82.114.26                 alive.github.com
140.82.114.5                  api.github.com
185.199.110.153               assets-cdn.github.com
185.199.108.133               avatars.githubusercontent.com
185.199.108.133               avatars0.githubusercontent.com
185.199.108.133               avatars1.githubusercontent.com
185.199.108.133               avatars2.githubusercontent.com
185.199.108.133               avatars3.githubusercontent.com
185.199.108.133               avatars4.githubusercontent.com
185.199.108.133               avatars5.githubusercontent.com
185.199.108.133               camo.githubusercontent.com
140.82.112.22                 central.github.com
185.199.108.133               cloud.githubusercontent.com
140.82.112.10                 codeload.github.com
140.82.114.22                 collector.github.com
185.199.108.133               desktop.githubusercontent.com
185.199.108.133               favicons.githubusercontent.com
140.82.112.4                  gist.github.com
52.217.227.105                github-cloud.s3.amazonaws.com
52.217.93.68                  github-com.s3.amazonaws.com
52.217.122.89                 github-production-release-asset-2e65be.s3.amazonaws.com
54.231.165.177                github-production-repository-file-5c1aeb.s3.amazonaws.com
52.217.49.124                 github-production-user-asset-6210df.s3.amazonaws.com
192.0.66.2                    github.blog
140.82.114.3                  github.com
140.82.113.18                 github.community
185.199.109.154               github.githubassets.com
151.101.129.194               github.global.ssl.fastly.net
185.199.110.153               github.io
185.199.108.133               github.map.fastly.net
185.199.110.153               githubstatus.com
140.82.112.25                 live.github.com
185.199.108.133               media.githubusercontent.com
185.199.108.133               objects.githubusercontent.com
13.107.42.16                  pipelines.actions.githubusercontent.com
185.199.108.133               raw.githubusercontent.com
185.199.108.133               user-images.githubusercontent.com
13.107.226.40                 vscode.dev
140.82.114.22                 education.github.com


# Update time: 2023-06-07T12:52:32+08:00
# Update url: https://raw.hellogithub.com/hosts
# Star me: https://github.com/521xueweihan/GitHub520
# GitHub520 Host End
```

完事后一般就直接生效了

方案源自 : Github520    
鉴于大家不一定知道这个东西 , 或者知道了也上不去github , 所以我搬运一下这个解决方案 .  
亲测有效 . 或许会让你爱上github , 可能这也是作者为什么给项目取名 : github520  