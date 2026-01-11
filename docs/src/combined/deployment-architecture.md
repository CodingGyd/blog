---
date: 2026-01-11
article: true
category:
  - 部署运维
tag:
  - 部署架构
  - 自动化部署
  - SSL证书
  - Nginx
  - 反向代理
---

# 三项目域名部署架构与自动化方案实战

## 前言

在实际项目中，我们经常需要将多个应用部署到同一个域名下，通过不同的路径区分。本文介绍如何将博客网站和后台管理系统整合到一个域名下，并配置 HTTPS 证书和自动化部署方案。

> **注意**：本文中的服务器 IP、路径、端口等敏感信息已做脱敏处理，仅保留配置结构供参考。

## 项目概览

### 涉及的三个项目

| 项目 | 技术栈 | 功能说明 |
|------|--------|----------|
| **个人博客** | VuePress | 技术文章分享 |
| **后台管理后端** | Spring Boot + MySQL + Redis | 资产管理系统后端 API |
| **后台管理前端** | Vue.js + Element UI | 资产管理系统前端界面 |

### 服务器资源

| 服务器 | IP | 配置 | 部署内容 |
|--------|-----|------|----------|
| 主服务器 | x.x.x.x | 2核4G | Nginx + 博客 + 后端 + MySQL + Redis |
| 前端服务器 | x.x.x.x | 1核2G | 前端静态文件 |

**为什么需要两台服务器？**

主服务器部署了 MySQL、Redis、后端 JAR 等内存密集型服务，内存资源紧张。将前端静态文件单独部署到另一台服务器，可以：
- 释放主服务器内存压力
- 前后端独立扩展
- 提高整体系统稳定性

## 部署架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      your-domain.com                         │
│                       (x.x.x.x - 主服务器)                    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     /        │  │   /console   │  │  /prod-api/  │      │
│  │   博客网站    │  │  后台前端     │  │  后端 API    │      │
│  │  (静态文件)   │  │  (反向代理)   │  │  (本地JAR)   │      │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │
│                            │                 │              │
│                   ┌──────────┴──────────┐              │
│                   │  MySQL + Redis    │              │
│                   └─────────────────────┘              │
└────────────────────────────┼───────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   x.x.x.x        │
                    │  前端文件服务器    │
                    └──────────────────┘
```

### 路由规划

| 访问路径 | 类型 | 服务器位置 | 实现方式 |
|---------|------|-----------|----------|
| `/` | 博客首页 | 主服务器本地 | Nginx 静态文件服务 |
| `/console` | 后台前端 | 前端服务器 | Nginx 反向代理 |
| `/console/xxx` | 后台子页面 | 前端服务器 | Nginx 反向代理 |
| `/static/` | 前端静态资源 | 前端服务器 | Nginx 反向代理 |
| `/prod-api/` | 后端 API | 主服务器本地 | 反向代理到本地端口 |

### 关键配置

#### 1. 前端项目路径配置

由于前端应用通过 `/console` 路径访问，需要配置正确的 base path：

**vue.config.js**
```javascript
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/console/" : "/",
  // ...
}
```

**router/index.js**
```javascript
export default new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/console/' : '/',
  routes: constantRoutes
})
```

#### 2. 主服务器 Nginx 配置

**文件位置**: `/path/to/nginx/conf/nginx.conf`

```nginx
user root;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # HTTP 自动跳转 HTTPS
    server {
        listen       80;
        server_name  your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS 主服务
    server {
        listen       443 ssl;
        server_name  your-domain.com;

        # SSL 证书
        ssl_certificate      /path/to/ssl/cert.pem;
        ssl_certificate_key  /path/to/ssl/cert.key;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        # 博客网站 - 根路径
        location / {
            root   /path/to/blog/dist;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        # 后台管理系统前端 - 反向代理
        location /console {
            proxy_pass http://x.x.x.x/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_http_version 1.1;
            client_max_body_size 50m;
        }

        # 后台管理系统 API - 本地后端
        location /prod-api/ {
            proxy_pass http://127.0.0.1:xxxx/prod-api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 后台管理系统静态资源
        location /static/ {
            proxy_pass http://x.x.x.x/static/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 自动化部署方案

### 部署脚本目录结构

```
D:\path\to\deploy-scripts\
├── deploy-all.bat              # 全栈一键部署
├── deploy-blog.bat             # 博客部署
├── deploy-admin.bat            # 后端部署
├── deploy-ui.bat               # 前端部署
├── upgrade-nginx-with-ssl.sh   # Nginx升级脚本
├── setup-domain-https.sh       # 域名HTTPS配置
├── generate-ssl.sh             # SSL证书生成
├── nginx-ui.conf               # 前端Nginx配置
└── README.md                   # 部署文档
```

### 核心脚本说明

#### 1. 后端部署脚本 (deploy-admin.bat)

```batch
@echo off
echo ========================================
echo   Admin Auto Deploy Script
echo ========================================

REM 配置
set PUTTY_DIR=C:\Users\YourName\PuTTY
set SERVER=x.x.x.x
set USER=root
set PASSWORD=your_password
set HOSTKEY=ssh-ed25519 0 SHA256:xxx

REM 本地项目路径
set PROJECT_DIR=D:\path\to\project
set JAR_NAME=app.jar

REM 1. Maven 打包
cd /d %PROJECT_DIR%
call mvn clean package -DskipTests

REM 2. 备份远程 JAR
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% ^
  "cd /path/to/app && cp app.jar app.jarbak"

REM 3. 上传新 JAR
"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% ^
  %PROJECT_DIR%\module\target\%JAR_NAME% %USER%@%SERVER%:/path/to/app/

REM 4. 重启服务
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% ^
  "sh /path/to/app.sh restart"

echo Deploy Complete!
```

#### 2. 前端部署脚本 (deploy-ui.bat)

```batch
@echo off
echo ========================================
echo   UI Frontend Deploy Script
echo ========================================

REM 配置
set PUTTY_DIR=C:\Users\YourName\PuTTY
set SERVER=x.x.x.x
set PROJECT_DIR=D:\path\to\project-ui

REM 1. 本地构建
cd /d %PROJECT_DIR%
call pnpm run build:prod

REM 2. 备份远程目录
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% ^
  %USER%@%SERVER% "cd /usr/share/nginx && cp -r html htmlbak"

REM 3. 清理并上传
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% ^
  %USER%@%SERVER% "rm -rf /usr/share/nginx/html/*"

"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% -r ^
  %PROJECT_DIR%\dist\/* %USER}@%SERVER%:/usr/share/nginx/html/

echo Deploy Complete!
```

#### 3. 博客部署脚本 (deploy-blog.bat)

```batch
@echo off
echo ========================================
echo   Deploying Blog...
echo ========================================

REM 本地构建
cd /d D:\path\to\blog
call pnpm run build

REM 上传
set PUTTY_DIR=C:\Users\YourName\PuTTY
set SERVER=x.x.x.x
set LOCAL_DIR=D:\path\to\blog\dist
set REMOTE_DIR=/path/to/nginx/html/blog/dist

"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% ^
  %USER%@%SERVER% "rm -rf %REMOTE_DIR%/*"

"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% -r ^
  %LOCAL_DIR%\* %USER%@%SERVER%:%REMOTE_DIR%/

echo Blog Deploy Complete!
```

#### 4. 全栈一键部署 (deploy-all.bat)

```batch
@echo off
echo ========================================
echo   Full Stack Deploy
echo   Backend + Frontend
echo ========================================

set CURRENT_DIR=%~dp0
cd /d "%CURRENT_DIR%"

REM 部署后端
call "%CURRENT_DIR%deploy-admin.bat"

REM 部署前端
call "%CURRENT_DIR%deploy-ui.bat"

echo ========================================
echo   ALL DEPLOYMENTS COMPLETE!
echo ========================================
```

### 使用说明

1. **全栈部署**（推荐）:
   ```bash
   cd D:\path\to\deploy-scripts
   deploy-all.bat
   ```

2. **单独部署某个项目**:
   - 后端: `deploy-admin.bat`
   - 前端: `deploy-ui.bat`
   - 博客: `deploy-blog.bat`

## SSL 证书配置详解

### 证书选择对比

| 方案 | 成本 | 信任度 | 推荐度 |
|------|------|--------|--------|
| **自签名证书** | 免费 | 不受信任 | ⭐ 测试环境 |
| **Let's Encrypt** | 免费 | 受信任 | ⭐⭐⭐ 自动续期 |
| **阿里云免费证书** | 免费 | 受信任 | ⭐⭐⭐⭐⭐ 推荐 |
| **付费证书** | ¥50-500/年 | 受信任 | ⭐⭐⭐ 企业级 |

### 阿里云 SSL 证书申请流程

#### 步骤 1：购买免费额度

1. 登录阿里云控制台
2. 搜索「SSL 证书」→「数字证书管理服务」
3. 点击「免费证书」→「立即购买」
4. 选择 DigiCert 或 TrustAsia，数量 20
5. 提交订单（¥0.00）

#### 步骤 2：申请证书

1. 返回证书控制台
2. 点击「创建证书」→「申请证书」
3. 填写信息：
   - 证书类型：单域名
   - 域名：`your-domain.com`
   - 申请算法：RSA
4. 提交申请

#### 步骤 3：DNS 验证

1. 在证书申请页面点击「验证」
2. 记录显示的 DNS TXT 记录
3. 登录域名管理平台（百度云/阿里云等）
4. 添加 TXT 记录
5. 返回阿里云点击「验证」
6. 等待 5-30 分钟审核通过

#### 步骤 4：下载证书

1. 审核通过后点击「下载」
2. 选择服务器类型：**Nginx**
3. 下载并解压，得到：
   - `your-domain.com.pem`（证书文件）
   - `your-domain.com.key`（私钥文件）

### 证书安装配置

#### 上传证书到服务器

```bash
# 通过 SCP 上传
scp your-domain.com.pem root@x.x.x.x:/path/to/nginx/ssl/cert.pem
scp your-domain.com.key root@x.x.x.x:/path/to/nginx/ssl/cert.key

# 设置权限
chmod 644 /path/to/nginx/ssl/cert.pem
chmod 600 /path/to/nginx/ssl/cert.key
```

#### 更新 Nginx 配置

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate      /path/to/nginx/ssl/cert.pem;
    ssl_certificate_key  /path/to/nginx/ssl/cert.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # ... 其他配置
}
```

#### 测试并重载

```bash
# 测试配置
/path/to/nginx/sbin/nginx -t

# 重载 Nginx
/path/to/nginx/sbin/nginx -s reload
```

### 证书自动续期

阿里云免费证书有效期为 **1 年**，到期前需要手动续期。提醒设置：

1. 阿里云控制台 → 证书服务
2. 开启「到期提醒」通知
3. 提前 1 个月申请新证书

## Nginx 升级记录

### 为什么升级 Nginx？

主服务器原有 Nginx 版本为 **1.9.9**，不支持 SSL 模块，无法配置 HTTPS。

### 升级脚本 (upgrade-nginx-with-ssl.sh)

```bash
#!/bin/bash
# 升级 Nginx 并启用 SSL 支持

# 1. 安装依赖
yum install -y pcre-devel openssl-devel zlib-devel

# 2. 下载 Nginx 1.22.1 源码
cd /tmp
wget http://nginx.org/download/nginx-1.22.1.tar.gz
tar -xzf nginx-1.22.1.tar.gz
cd nginx-1.22.1

# 3. 编译安装
./configure \
    --prefix=/usr/local/nginx \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_realip_module \
    --with-http_gzip_static_module \
    --with-file-aio \
    --with-http_stub_status_module

make && make install

# 4. 验证
/usr/local/nginx/sbin/nginx -V 2>&1 | grep TLS
```

### 升级前后对比

| 项目 | 升级前 | 升级后 |
|------|--------|--------|
| 版本 | 1.9.9 | 1.22.1 |
| SSL 支持 | ❌ 不支持 | ✅ 支持 |
| HTTP/2 | ❌ 不支持 | ✅ 支持 |
| 安全性 | 较低 | 高 |

## 常见问题与解决

### 1. 麦克风权限问题

**问题**: HTTPS 环境下无法使用麦克风

**原因**: 浏览器要求麦克风权限必须在 HTTPS 或 localhost 环境下使用

**解决**: 配置 HTTPS 证书（本文已详细说明）

### 2. 路径冲突问题

**问题**: `/home/home` 路径别扭

**解决**: 使用更合适的路径前缀，如 `/console`

### 3. 自签名证书警告

**问题**: 浏览器提示"证书不安全"

**解决**: 使用阿里云等受信任的证书机构颁发的证书

### 4. Nginx 配置错误

**问题**: `location` 指令不在 `server` 块中

**解决**: 确保 `location` 配置在 `server` 块内部，或使用完整的 server 块配置

## 最佳实践建议

### 1. 安全建议

- ✅ 使用 HTTPS（本文已配置）
- ✅ 定期更新 SSL 证书
- ✅ 不要在脚本中硬编码密码（考虑使用 SSH 密钥）
- ✅ 定期备份数据库和重要文件
- ✅ 部署脚本不要提交到公开仓库

### 2. 监控建议

- 配置服务器监控（CPU、内存、磁盘）
- 监控 Nginx 访问日志
- 监控后端 JAR 运行状态

### 3. 性能优化

- 启用 Gzip 压缩
- 配置静态资源缓存
- 使用 CDN 加速静态资源

### 4. 备份策略

- 数据库定期备份
- Nginx 配置文件备份
- 部署脚本版本控制（Git）

## 总结

本文介绍了一个完整的多项目域名部署方案，包括：

1. **架构设计**: 两台服务器，三个项目，一个域名
2. **路径规划**: 通过不同路径区分不同应用
3. **自动化部署**: Windows 批处理脚本实现一键部署
4. **SSL 证书**: 阿里云免费证书的申请、安装和配置
5. **Nginx 升级**: 从 1.9.9 升级到 1.22.1 支持 SSL

通过这套方案，实现了：
- ✅ 统一域名访问
- ✅ HTTPS 安全连接
- ✅ 自动化部署流程
- ✅ 清晰的路径结构

希望对有类似需求的朋友有所帮助！

## 参考资源

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PuTTY 下载](https://the.earth.li/~sgtatham/putty/latest/w64/putty.zip)
- [Vue Router 官方文档](https://router.vuejs.org/)
