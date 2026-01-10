---
# icon: lock
date: 2026-01-10
category:
  - AI
---

# Claude Code 国内使用指南


## 快速决策指南

**不知道该选哪个方案？30 秒快速定位：**

| 你的情况 | 推荐方案 | 预计成本 | 配置时间 |
|---------|---------|---------|---------|
| 想要最简单稳定的方式 | cc-switch + 智谱 AI | ¥20/月起 | 5 分钟 |
| 预算有限，完全不想花钱 | 国内 AI 替代方案 | 免费 | 3 分钟 |
| 有稳定的代理服务器 | 自建代理 + 官方 API | 按量付费 | 15 分钟 |
| 喜欢用图形界面编辑器 | Cursor | $20/月 或免费额度 | 3 分钟 |
| 技术爱好者，喜欢折腾 | 自建代理 + 官方 API | 按量付费 | 30 分钟+ |

> **💡 温馨提示**：如果你是第一次使用，强烈推荐选择 **cc-switch + 智谱 AI**，配置最简单，稳定性最高。

---

## 准备工作

**在开始之前，请确认：**

- [ ] **手机号**：用于注册智谱 AI 账号（国内手机号即可）
- [ ] **Node.js 环境**：如果需要安装 Claude Code CLI（可选）
- [ ] **系统权限**：能够安装软件的权限
- [ ] **支付方式**：微信/支付宝等（如需付费套餐）

**预计耗时**：整个流程约 **5-10 分钟**

---

## 一、什么是 Claude Code

Claude Code 是 Anthropic 官方推出的命令行界面（CLI）工具，让开发者能够直接在终端中使用 Claude AI 进行编程辅助。

**核心特点：**
- 直接在终端中使用，无需切换窗口
- 可以读写和编辑本地文件
- 支持 git 操作（commit、PR review 等）
- 支持多轮对话和上下文理解
- 按用量计费（API 模式）

## 二、国内使用现状

**直接访问官方渠道存在的问题：**

1. Anthropic 官网 `anthropic.com` 无法访问
2. API 端点 `api.anthropic.com` 被限制访问
3. npm 包安装可能遇到网络问题
4. 需要国外手机号或邮箱注册账号

## 三、可行方案概览

| 方案 | 难度 | 成本 | 稳定性 | 推荐度 |
|------|------|------|--------|--------|
| cc-switch + 智谱AI | 低 | 低 | 高 | ★★★★★ |
| 自建代理+官方 API | 高 | 中 | 中 | ★★★☆☆ |
| 使用 API 中转服务 | 低 | 低 | 高 | ★★★★☆ |
| 使用国内 AI 替代 | 低 | 低 | 高 | ★★★★★ |

---

## 四、cc-switch + 智谱AI（强烈推荐）

> **🔥 专属福利提醒：本文读者通过[专属链接](https://www.bigmodel.cn/glm-coding?ic=CNEW3EQAJF)注册可享 **9 折优惠**，每月仅需 **18 元起**！**

这是目前最适合国内用户的方案。cc-switch 是一个开源的 Claude Code 辅助工具，可以方便地切换不同的 AI 供应商，而智谱 AI 提供了稳定的 API 中转服务。

### 4.1 什么是 cc-switch

cc-switch 是一个跨平台的桌面应用，专为 Claude Code / Codex / Gemini CLI 设计的全方位辅助工具。

**主要功能：**
- **供应商管理**：一键切换不同 AI 平台的 API 配置
- **MCP 服务器管理**：统一管理 MCP 服务器配置
- **速度测试**：测试 API 端点延迟
- **配置备份**：支持导入导出和云同步
- **系统托盘**：快速切换供应商

### 4.2 什么是智谱 GLM Coding Plan

智谱 AI 的 GLM CODING PLAN 是专为 AI 编程打造的订阅套餐，提供对 Claude Code 等工具的 API 中转服务。

**优势：**
- 国内直连，无需代理
- 每月最低仅需 20 元
- 支持十余款主流 AI 编程工具
- **全球顶尖编程模型 GLM-4.7 驱动**
- 高速稳定，专为编码优化

### 4.3 下载安装 cc-switch

**Windows 用户：**

1. 访问 [cc-switch GitHub Releases](https://github.com/farion1231/cc-switch/releases)
2. 下载 `CC-Switch-v{版本号}-Windows.msi` 安装包
3. 双击运行安装程序

**macOS 用户：**

```bash
# 使用 Homebrew 安装（推荐）
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

或从 [Releases](https://github.com/farion1231/cc-switch/releases) 页面下载 `CC-Switch-v{版本号}-macOS.zip` 解压使用。

**Linux 用户：**

从 [Releases](https://github.com/farion1231/cc-switch/releases) 下载对应发行版的安装包：
- `.deb`（Debian/Ubuntu）
- `.rpm`（Fedora/RHEL）
- `.AppImage`（通用）

### 4.4 注册智谱 AI 账号

1. 访问 [智谱 AI 开放平台](https://bigmodel.cn/usercenter/glm-coding/overview)
2. 点击"注册"创建账号
3. 使用手机号完成验证
4. 登录账号

### 4.5 开通 GLM Coding Plan

1. 登录后进入 [GLM Coding Plan 页面](https://bigmodel.cn/usercenter/glm-coding/overview)
2. 选择合适的订阅套餐（最低 20 元/月）
3. 完成支付开通

---

### 🔥 限时专属优惠通道

> **⭐ 特别福利：通过下方专属链接购买，立享 9 折优惠！**
>
> [**👉 点击这里立即开通 GLM Coding Plan（专属 9 折通道）👈**](https://www.bigmodel.cn/glm-coding?ic=CNEW3EQAJF)
>
> **为什么选择这个链接？**
> - ✅ **官方正品**：智谱 AI 官方渠道，安全可靠
> - ✅ **立减 10%**：专属优惠码自动生效，无需手动输入
> - ✅ **超值划算**：每月仅需 **18 元起**（原价 20 元）
> - ✅ **GLM-4.7 驱动**：全球顶尖编程模型，编码效率翻倍
> - ✅ **国内直连**：无需代理，稳定高速
> - ✅ **即买即用**：开通后 1 分钟内即可开始使用
>
> **⚠️ 注意：请务必通过上方专属链接购买，否则无法享受 9 折优惠！**

---

### 4.6 获取 API Key

1. 开通套餐后，进入[用户中心](https://bigmodel.cn/usercenter/apikeys)
2. 点击"创建 API Key"
3. 复制生成的 API Key（格式类似：`xxxxxx.xxxxxx`）

### 4.7 在 cc-switch 中配置智谱 AI

**步骤一：启动 cc-switch**

首次启动会自动检测并导入现有的 Claude Code 配置。

**步骤二：添加智谱供应商**

1. 点击主界面的"添加供应商"按钮
2. 在预设列表中选择"智谱 GLM"
3. 粘贴刚才获取的 API Key
4. 点击"保存"

**步骤三：启用智谱供应商**

1. 在供应商列表中选择"智谱 GLM"
2. 点击"启用"按钮
3. 配置会自动写入 Claude Code 的配置文件

### 4.8 安装 Claude Code

```bash
# 使用国内 npm 镜像加速安装
npm config set registry https://registry.npmmirror.com
npm install -g @anthropic-ai/claude-code

# 或使用 pnpm
pnpm config set registry https://registry.npmmirror.com
pnpm add -g @anthropic-ai/claude-code
```

### 4.9 验证配置

```bash
# 启动 Claude Code
claude-code

# 测试对话
> 你好，请介绍一下你自己
```

**✅ 配置成功的标志：**
- Claude Code 能够正常启动
- 能够收到 AI 的回复（不是报错）
- 回复内容通顺、相关

**❌ 如果失败，请检查：**
1. cc-switch 中智谱供应商是否已启用
2. API Key 是否正确复制
3. GLM Coding Plan 是否已开通
4. 网络连接是否正常

### 4.10 cc-switch 高级功能

**系统托盘快速切换：**

- cc-switch 会在系统托盘运行
- 右键托盘图标可以快速切换供应商
- 切换后重启终端即可生效

**速度测试：**

- 在 cc-switch 中点击"速度测试"
- 测量各 API 端点的延迟
- 选择响应最快的供应商

**配置备份：**

- 支持导出所有配置到文件
- 可以在不同设备间同步配置

---

## 五、使用其他 API 中转服务

除了智谱 AI，cc-switch 还预设了多个中转服务商：

| 服务商 | 特点 | 优惠 |
|--------|------|------|
| PackyCode | 稳定高效，多模型支持 | 充值输入"cc-switch"享9折 |
| AIGoCode | 一站式平台，国内直连 | 首充额外10%奖励 |
| DMXAPI | 企业级服务，当天开票 | Claude Code专属3.4折 |
| Cubence | 灵活计费，可靠高效 | 充值输入"CCSWITCH"享9折 |

**配置步骤与智谱 AI 类似：**

1. 注册对应服务商账号
2. 获取 API Key
3. 在 cc-switch 中添加供应商
4. 启用并使用

---

## 六、自建代理+官方 API

如果你有稳定的代理服务器，可以直接使用官方 API。

### 6.1 准备代理环境

**常见代理工具：**

| 工具 | 类型 | 推荐度 |
|------|------|--------|
| Clash | 规则代理 | ★★★★☆ |
| V2Ray | 协议代理 | ★★★★☆ |
| Shadowsocks | 轻量代理 | ★★★☆☆ |

### 6.2 配置系统代理

**Windows:**

```powershell
# 设置环境变量
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
```

**Linux/Mac:**

```bash
# 添加到 shell 配置
echo 'export HTTP_PROXY=http://127.0.0.1:7890' >> ~/.bashrc
echo 'export HTTPS_PROXY=http://127.0.0.1:7890' >> ~/.bashrc
source ~/.bashrc
```

### 6.3 注册官方账号

需要使用代理访问以下网站：

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 使用邮箱注册（推荐 Gmail/Outlook）
3. 验证邮箱
4. 获取 API Key

### 6.4 在 cc-switch 中配置

1. 打开 cc-switch
2. 添加供应商 → 选择"自定义"
3. 填写官方 API Key
4. 配置代理端点（如需要）

---

## 七、使用国内 AI 替代方案

如果上述方案都不可行，可以考虑国内的 AI 编程助手：

### 7.1 通义灵码（阿里）

```bash
# VS Code 扩展安装
code --install-extension alibaba-cloud.tongyi-lingma
```

**特点：**
- 国内网络无限制
- 完全免费
- 支持多种编程语言
- 与阿里云深度集成

### 7.2 CodeGeeX

```bash
# VS Code 扩展安装
code --install-extension aminer.codegeex
```

**特点：**
- 清华大学开发
- 支持代码生成和解释
- 完全免费

### 7.3 Comate（百度）

```bash
# VS Code 扩展安装
code --install-extension Baidu.Comate
```

**特点：**
- 百度文心大模型驱动
- 支持多种 IDE
- 有免费额度

### 7.4 豆包 AI（字节）

访问官网下载：[https://www.doubao.com/](https://www.doubao.com/)

**特点：**
- 字节跳动出品
- 支持多种开发场景
- 免费使用

---

## 八、使用 Cursor

Cursor 是一个基于 AI 的代码编辑器，内置了 Claude 等多种模型。

### 8.1 下载安装

访问 [cursor.sh](https://cursor.sh) 下载安装包。

### 8.2 配置使用

1. 打开 Cursor
2. 使用邮箱注册（支持国内邮箱）
3. 选择 AI 模型（Claude 3.5 Sonnet 推荐）
4. 开始使用

**优势：**
- 无需配置代理
- 内置多种 AI 模型
- 界面类似 VS Code
- 有免费额度

---

## 九、常见问题

### 9.1 cc-switch 提示配置文件写入失败

**原因：** Claude Code 配置目录权限问题

**解决：**
1. 以管理员身份运行 cc-switch
2. 或手动修改配置目录权限
3. Windows: 右键 → 属性 → 安全 → 编辑权限

### 9.2 智谱 API Key 验证失败

**原因：** API Key 格式错误或未开通套餐

**解决：**
1. 确认已开通 GLM Coding Plan
2. 检查 API Key 是否完整复制
3. 尝试重新生成 API Key

### 9.3 Claude Code 连接超时

**原因：** 网络无法访问 API 端点

**解决：**
1. 检查 cc-switch 中启用的供应商
2. 使用速度测试功能检查连接
3. 尝试切换其他供应商

### 9.4 npm 安装失败

**原因：** npm 仓库访问受限

**解决：**

```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install -g @anthropic-ai/claude-code
```

### 9.5 cc-switch 无法启动

**原因：** 缺少系统依赖或权限问题

**解决：**
1. Linux: 安装 `webkit2gtk` 等依赖
2. Windows: 以管理员身份运行
3. macOS: 在"隐私与安全性"中允许运行

---

## 十、费用对比

| 方案 | 价格 | 月费用估算 | 性价比 |
|------|------|-----------|--------|
| cc-switch + 智谱AI | ¥20/月起 | ¥20 | ★★★★★ |
| 官方 API (Sonnet) | $3/百万tokens | $10-50 | ★★★☆☆ |
| 其他中转服务 | ¥15-30/百万tokens | ¥50-200 | ★★★★☆ |
| 通义灵码 | 免费 | ¥0 | ★★★★★ |
| Cursor | $20/月 | $20 | ★★★★☆ |

**建议：**
- **首选**：cc-switch + 智谱 AI（性价比最高）
- 轻度使用：选择国内免费方案
- 中度使用：使用智谱 GLM Coding Plan
- 重度使用：考虑 Cursor 订阅

---

## 十一、总结

在中国国内使用 Claude Code，推荐优先级：

1. **强烈推荐**：cc-switch + 智谱 AI
   - 开源免费，配置简单
   - 国内直连，稳定高速
   - 每月仅需 20 元起
   - 一键切换多个供应商

2. **次选**：cc-switch + 其他中转服务
   - 同样使用 cc-switch
   - 多个服务商可选
   - 按需付费更灵活

3. **备选**：Cursor - 开箱即用，无需配置
4. **替代**：国内 AI 助手 - 完全免费，效果不错
5. **折腾**：自建代理 - 适合技术爱好者

### 快速开始三步走

1. **下载 cc-switch**：[点击访问 GitHub Releases 页面](https://github.com/farion1231/cc-switch/releases)
2. **注册智谱 AI**：[点击注册（九折优惠）](https://www.bigmodel.cn/glm-coding?ic=CNEW3EQAJF)
3. **安装 Claude Code**：`npm install -g @anthropic-ai/claude-code`

## 十二、参考链接

- [Claude Code 官方文档](https://docs.anthropic.com/claude/docs/claude-code)
- [cc-switch GitHub](https://github.com/farion1231/cc-switch)
- [智谱 AI GLM Coding Plan](https://www.bigmodel.cn/glm-coding?ic=CNEW3EQAJF)
- [Cursor 官网](https://cursor.sh)
- [通义灵码官网](https://tongyi.aliyun.com/lingma)
