---
# icon: lock
date: 2023-01-07
category:
  - 团队协作
tag:
  - git
---

# git常用操作
## 修改默认分支main

默认主干分支名称叫什么都可以，只是我们习惯主分支名称叫master，这里记录如何修改默认分支：
1. 在gitlab上新建项目test后，进入test项目，点击左侧Repository->Branches，可以看到里面只有一个受保护的默认分支main，此处无法删除。
2. 我们接着新建一个分支叫master：点击右上角New Branch，输入分支名称master》Create branch。

3. 再点击左侧Settings->Repository，点开Default branch，选择Default branch 为master->Save Changes。

这样项目的默认受保护分支就变成master了。
> 注意：自2020年10月1日起，官方就把所有在Github上创建的新代码仓库的默认受保护分支命名为"main"了！

## 配置文件修改git config
可以直接编辑文件的方式：
```
//全局配置修改
git config --global --edit

//局部配置修改
git config --edit
```
### 修改用户信息
```
//全局用户修改
git config --global user.name "xxx"
git config --global user.email "xxx@xxx.com"

//局部用户修改
git config user.name "xxx"
git config user.email "xxx@xxx.com"
```

## 初始化空仓库
```
git clone http://git.wingdata.dev.com/wcos/major-events.git
cd major-events
git switch -c main
touch README.md
git add README.md
git commit -m "add README"
git push origin main
```

## 本地仓库关联远端
语法格式：git  remote add  [远端名称(可随意命名)]  [远端地址(ssh或http)]

示例：
```
cd existing_folder
git init --initial-branch=main
git remote add origin http://git.wingdata.dev.com/wcos/major-events.git
git add .
git commit -m "Initial commit"
```


## 查看本地和远端的关联列表
git remote -v

## 本地仓库移除和远端的关联
语法格式： git remote remove [远端名称，当时关联设置的名称]


