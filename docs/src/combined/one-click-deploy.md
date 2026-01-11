---
date: 2026-01-11
article: true
category:
  - 部署运维
tag:
  - 自动化部署
  - PuTTY
  - Shell脚本
---

# Windows下一键自动化部署方案实战

## 前言

在日常开发中，每次代码修改后都需要手动打包、上传、重启服务，重复劳动非常耗时。本文介绍如何使用 Windows 批处理脚本 + PuTTY 工具实现一键自动化部署，大幅提升开发效率。

## 背景现状

### 部署流程痛点

我的日常部署涉及三个项目：

| 项目 | 类型 | 服务器 | 部署方式 |
|------|------|--------|----------|
| GYD资产管理系统-后端 | SpringBoot | 服务器A | Maven打包→上传JAR→重启 |
| GYD资产管理系统-前端 | Vue.js | 服务器B | pnpm构建→上传dist |
| 个人技术博客 | VuePress | 服务器A | pnpm构建→上传dist |

每次部署需要手动执行多个步骤，效率低下且容易出错。

### 解决方案思路

利用 Windows 批处理脚本（.bat）自动化整个部署流程：
1. 本地构建（Maven/pnpm）
2. 远程备份
3. 上传新文件
4. 重启服务

## 技术方案

### 核心工具

**PuTTY 工具套件**
- **PLINK.EXE**: Windows 下的 SSH 命令行工具，用于远程执行 Linux 命令
- **PSCP.EXE**: Windows 下的 SCP 文件传输工具，用于上传文件到远程服务器

下载地址：https://the.earth.li/~sgtatham/putty/latest/w64/putty.zip

### 关键参数说明

```batch
# PLINK 远程执行命令
PLINK.EXE -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "command"

# PSCP 上传文件
PSCP.EXE -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% -r local/* %USER%@%SERVER%:/remote/
```

| 参数 | 说明 |
|------|------|
| `-batch` | 批处理模式，避免交互式提示 |
| `-hostkey` | 服务器主机密钥，首次连接时保存 |
| `-pw` | 登录密码 |
| `-r` | 递归上传目录 |

## 实战案例

### 案例1：SpringBoot 后端一键部署

**deploy-gyd-admin.bat**

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   GYD-Admin Auto Deploy Script
echo ========================================
echo.

REM ========== Configuration ==========
set PUTTY_DIR=C:\Users\[用户名]\PuTTY
set SERVER=[服务器IP地址]
set USER=root
set PASSWORD=[服务器密码]
set HOSTKEY=[服务器主机密钥]

set PROJECT_DIR=D:\code\[项目目录]
set JAR_NAME=gyd-admin.jar
set LOCAL_JAR=%PROJECT_DIR%\gyd-admin\target\%JAR_NAME%
set REMOTE_DIR=[远程部署目录]
set REMOTE_SCRIPT=[远程启动脚本路径]

REM ========== Build Project ==========
echo [1/4] Building gyd-admin.jar...
cd /d %PROJECT_DIR%
call mvn clean package -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

REM ========== Backup & Clean ==========
echo [2/4] Cleaning remote directory...
echo   - Removing old backup...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "cd %REMOTE_DIR% && rm -f gyd-admin.jarbak 2>/dev/null"

echo   - Backing up existing JAR...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "cd %REMOTE_DIR% && if [ -f gyd-admin.jar ]; then cp gyd-admin.jar gyd-admin.jarbak; fi"

echo   - Removing old JAR...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "cd %REMOTE_DIR% && rm -f gyd-admin.jar 2>/dev/null"

echo   - Clearing logs directory...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "cd %REMOTE_DIR% && rm -rf logs/* 2>/dev/null"

REM ========== Upload ==========
echo [3/4] Uploading new JAR to server...
"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% "%LOCAL_JAR%" %USER%@%SERVER%:%REMOTE_DIR%/

REM ========== Restart ==========
echo [4/4] Restarting application...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "sh %REMOTE_SCRIPT% restart"

echo.
echo ========================================
echo   Deploy Complete!
echo ========================================
pause
```

**关键设计点**：
- Maven 打包后检查 JAR 文件是否存在
- 自动备份旧 JAR 为 `.jarbak`
- 清空 logs 目录，避免日志堆积
- 使用已有的启动脚本重启服务

### 案例2：Vue 前端一键部署（含备份）

**deploy-gyd-ui.bat**

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   GYD-UI Frontend Deploy Script
echo ========================================
echo.

REM ========== Configuration ==========
set PUTTY_DIR=C:\Users\[用户名]\PuTTY
set SERVER=[服务器IP地址]
set USER=root
set PASSWORD=[服务器密码]
set HOSTKEY=[服务器主机密钥]

set PROJECT_DIR=D:\code\[前端项目目录]
set DIST_DIR=%PROJECT_DIR%\dist
set REMOTE_DIR=[前端远程部署目录]

REM ========== Build Project ==========
echo [1/3] Building gyd-ui...
cd /d %PROJECT_DIR%

REM Check if node_modules exists
if not exist "%PROJECT_DIR%\node_modules" (
    echo Installing dependencies...
    call pnpm install
)

call pnpm run build:prod

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

REM ========== Backup & Upload ==========
echo [2/3] Uploading to server...

echo   - Removing old backup...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "rm -rf [备份目录路径] 2>/dev/null"

echo   - Creating backup...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "cd [Nginx目录] && cp -r html htmlbak"

echo   - Cleaning remote directory...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "rm -rf %REMOTE_DIR%/* 2>/dev/null"

echo   - Uploading files...
"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% -r %DIST_DIR%\* %USER%@%SERVER%:%REMOTE_DIR%/

REM ========== Verify ==========
echo [3/3] Verifying deployment...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "ls -lh %REMOTE_DIR% | head -10"

echo.
echo ========================================
echo   Deploy Complete!
echo   URL: http://[前端服务器IP]
echo ========================================
pause
```

**关键设计点**：
- 检测 node_modules 是否存在，自动安装依赖
- 每次部署前备份远程目录为 `htmlbak`
- 清理远程目录后再上传
- 部署后验证文件列表

### 案例3：全栈一键部署

**deploy-all.bat**

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   GYD Full Stack Deploy Script
echo   Backend + Frontend
echo ========================================
echo.

set CURRENT_DIR=%~dp0
cd /d %CURRENT_DIR%

REM ========== Deploy Backend ==========
echo.
echo ========================================
echo   [1/2] Deploying Backend...
echo ========================================
echo.

call deploy-gyd-admin.bat

if %ERRORLEVEL% NEQ 0 (
    echo Backend Deployment FAILED!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Backend Deployment SUCCESS!
echo ========================================

REM ========== Deploy Frontend ==========
echo.
echo ========================================
echo   [2/2] Deploying Frontend...
echo ========================================
echo.

call deploy-gyd-ui.bat

if %ERRORLEVEL% NEQ 0 (
    echo Frontend Deployment FAILED!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ALL DEPLOYMENTS COMPLETE!
echo ========================================
echo.
echo   URLs:
echo   - Frontend: http://[前端服务器IP]
echo   - Backend API: http://[后端服务器IP]:[端口号]/prod-api
echo.
pause
```

**优势**：一键完成整个系统的发布，适合完整版本发布场景。

### 案例4：个人博客一键部署

**deploy-blog.bat**

```batch
@echo off
echo ========================================
echo   Deploying Blog...
echo ========================================
echo.

echo [1/2] Building...
cd /d D:\code\[博客项目目录]
call pnpm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Uploading...

set PUTTY_DIR=C:\Users\[用户名]\PuTTY
set SERVER=[服务器IP地址]
set USER=root
set PASSWORD=[服务器密码]
set HOSTKEY=[服务器主机密钥]
set LOCAL_DIR=D:\code\[博客项目目录]\src\.vuepress\dist
set REMOTE_DIR=[博客远程部署目录]

echo Cleaning remote directory...
"%PUTTY_DIR%\PLINK.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% %USER%@%SERVER% "rm -rf %REMOTE_DIR%/*"

echo Uploading files...
"%PUTTY_DIR%\PSCP.EXE" -batch -hostkey "%HOSTKEY%" -pw %PASSWORD% -r %LOCAL_DIR%\* %USER%@%SERVER%:%REMOTE_DIR%/

echo.
echo ========================================
echo   Done!
echo   URL: http://[你的博客域名]
echo ========================================
pause
```

## 项目目录结构

```
D:\code\[部署脚本目录]\
├── deploy-all.bat           # GYD 全栈一键部署
├── deploy-gyd-admin.bat     # GYD 后端部署
├── deploy-gyd-ui.bat        # GYD 前端部署
├── deploy-blog.bat          # 个人博客部署
└── README.md                # 操作手册
```

## 部署效果对比

| 项目 | 部署前（手动） | 部署后（自动） | 效率提升 |
|------|----------------|----------------|----------|
| GYD后端 | Maven打包→手动上传→手动重启（5分钟） | 双击脚本（30秒） | 10倍 |
| GYD前端 | pnpm构建→手动上传（3分钟） | 双击脚本（20秒） | 9倍 |
| 博客 | pnpm构建→手动上传（2分钟） | 双击脚本（15秒） | 8倍 |

## 常见问题与解决

### 1. 提示 "Press Return to begin session"

**原因**：缺少 `-batch` 参数

**解决**：确保 PLINK 和 PSCP 命令都包含 `-batch` 参数

### 2. 上传失败

**原因**：网络问题或服务器连接问题

**解决**：检查服务器 IP、密码、主机密钥是否正确

### 3. JVM 启动失败

**原因**：Java 版本不兼容（如 Java 11 的 GC 日志参数变更）

**解决**：更新启动脚本中的 JVM 参数
```bash
# Java 8 的 GC 参数
-XX:+PrintGCDateStamps -XX:+PrintGCDetails

# Java 11 的 GC 参数
-Xlog:gc*:file=$LOG_DIR/gc.log:time,tags:filecount=10,filesize=10m
```

### 4. 前端构建失败

**原因**：依赖未安装或 node_modules 损坏

**解决**：删除 node_modules 后重新安装
```bash
rm -rf node_modules
pnpm install
```

## 安全建议

1. **不要将部署脚本提交到 Git**
   - 脚本包含服务器密码
   - 建议添加到 `.gitignore`

2. **定期更换密码**

3. **使用 SSH 密钥认证（可选）**
   - 更安全，避免密码泄露
   - 需要配置 PuTTY 密钥认证

## 总结

通过 Windows 批处理脚本 + PuTTY 工具的组合，我们实现了：

1. **自动化部署流程**：一键完成构建、备份、上传、重启
2. **提高开发效率**：从几分钟缩短到几十秒
3. **降低出错风险**：减少手动操作步骤
4. **统一管理**：所有部署脚本集中在一个目录

这种方案简单实用，适合个人开发者和中小团队使用。如果有更多服务器或更复杂的需求，可以考虑使用 Jenkins、GitLab CI 等专业 CI/CD 工具。

---

**相关文章**：
- [VuePress 博客搭建指南](/java-basic/README.md)
- [Nginx 配置详解](/middleware/nginx.md)
- [Shell 脚本编程基础](/tools/xshell.md)
