---
# icon: lock
date: 2023-01-07
category:
  - git常用操作
tag:
  - git常用操作
---

# Git常用操作

## 全局用户设置
```
git config --global user.name "xxx"
git config --global user.email "xxx@xxx.com"
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
```
cd existing_folder
git init --initial-branch=main
git remote add origin http://git.wingdata.dev.com/wcos/major-events.git
git add .
git commit -m "Initial commit"
```