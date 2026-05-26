---
title: "基于 Astro 搭建个人博客并部署上线全流程"
date: 2026-05-26
categories: "环境搭建"
tags: ["Astro","GitHub Pages","Cloudflare","SEO"]
id: "astro-blog-setup"
---

<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0f1117;--card:#1a1d28;--accent:#6c9eeb;--accent2:#a78bfa;
--text:#e1e4ed;--text2:#9ca3b0;--border:#2a2d3a;--code-bg:#151720;--code-border:#252837;
--tag-bg:#252837;--tag-text:#8b9cc7;--success:#34d399;--warn:#fbbf24;--danger:#f87171}
.hero,.container{font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;color:#e1e4ed;line-height:1.85;font-size:15px}
.hero,.container,.article-content,.toc,.nav-bar,.footer{background:#0f1117}
.hero{background:linear-gradient(135deg,#1e2a4a 0%,#161929 40%,#1a1530 100%);border-bottom:1px solid var(--border);padding:48px 24px 40px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(ellipse at 30% 50%,rgba(108,158,235,0.06) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(167,139,250,0.04) 0%,transparent 60%);pointer-events:none}
.hero h1{font-size:28px;font-weight:700;color:#fff;max-width:800px;margin:0 auto 16px;line-height:1.4;position:relative;letter-spacing:-0.3px}
.hero .subtitle{color:var(--text2);font-size:15px;margin-bottom:16px;position:relative}
.hero-meta{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;position:relative}
.tag{display:inline-block;background:var(--tag-bg);color:var(--tag-text);padding:4px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--border)}
.tag-accent{background:rgba(108,158,235,0.12);color:var(--accent);border-color:rgba(108,158,235,0.2)}
.container{max-width:820px;margin:0 auto;padding:32px 24px 80px}
.article-content,.toc,.nav-bar,.footer{color:#e1e4ed}
.article-content h2{font-size:21px;font-weight:700;color:#fff;margin:40px 0 16px;padding-left:14px;border-left:3px solid var(--accent);line-height:1.4}
.article-content h3{font-size:17px;font-weight:600;color:#d1d5e0;margin:28px 0 12px}
.article-content h4{font-size:15px;font-weight:600;color:var(--accent);margin:20px 0 10px}
.article-content p{margin:12px 0;color:#e1e4ed!important;line-height:1.85;background:#0f1117!important}
.article-content a{color:var(--accent);text-decoration:none;border-bottom:1px solid rgba(108,158,235,0.3);transition:border-color .2s}
.article-content a:hover{border-bottom-color:var(--accent)}
.article-content strong{color:#fff;font-weight:600}
.article-content img{max-width:100%;border-radius:8px;margin:16px 0;border:1px solid var(--border)}
.article-content ul,.article-content ol{padding-left:24px;margin:12px 0}
.article-content li{margin:6px 0;color:#e1e4ed!important;line-height:1.75;background:#0f1117!important}
.article-content li::marker{color:var(--accent)}
.article-content div:not([style]):not(.tip-box):not(.warn-box):not(.danger-box){color:#e1e4ed!important;background:#0f1117!important}
.article-content strong{color:#fff!important}
.article-content span:not(.tag):not(.tip-label):not(.warn-label):not(.danger-label){color:#e1e4ed!important}
.article-content em{color:#d1d5e0!important}
pre{background:var(--code-bg)!important;border:1px solid var(--code-border);border-radius:10px;padding:20px!important;margin:16px 0!important;overflow-x:auto;font-size:13.5px!important;line-height:1.65!important;position:relative}
pre::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(108,158,235,0.2),transparent)}
code{font-family:"JetBrains Mono","Fira Code","Consolas",monospace!important;font-size:13.5px!important}
p code,li code,td code{background:rgba(108,158,235,0.08)!important;color:var(--accent)!important;padding:2px 8px!important;border-radius:5px!important;border:1px solid rgba(108,158,235,0.12)!important;font-size:13px!important}
pre code{background:none!important;border:none!important;padding:0!important;color:#c9d1d9!important}
blockquote{border-left:3px solid var(--accent2)!important;background:rgba(167,139,250,0.04)!important;padding:14px 20px!important;margin:16px 0!important;border-radius:0 8px 8px 0!important;color:#e1e4ed!important;font-size:14px}
blockquote code{color:var(--accent2)!important}
.tip-box{background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.15);border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px}
.tip-box .tip-label{color:var(--success);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
.warn-box{background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.15);border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px}
.warn-box .warn-label{color:var(--warn);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
.danger-box{background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.15);border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px}
.danger-box .danger-label{color:var(--danger);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
table{border-collapse:collapse;width:100%;margin:16px 0;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:var(--code-bg)!important}
th{background:var(--tag-bg);color:var(--accent);font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:0.5px}
th,td{padding:10px 16px;border:1px solid var(--border);text-align:left;font-size:14px;background:transparent}
td{color:#e1e4ed!important;background:var(--code-bg)!important}
.footer{text-align:center;padding:32px;color:var(--text2);font-size:12px;border-top:1px solid var(--border);margin-top:40px}
.toc{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px;margin:0 0 32px}
.toc-title{font-size:13px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.toc ul{list-style:none;padding-left:0}
.toc li{margin:6px 0;color:#e1e4ed!important}
.toc a{color:#9ca3b0!important;text-decoration:none;font-size:14px;transition:color .2s;display:block;padding:4px 0;border-bottom:none}
.toc a:hover{color:var(--accent)!important}
.toc a::before{content:'›';margin-right:10px;color:var(--accent);font-weight:700}
.toc .toc-sub{padding-left:20px}
.back{display:inline-block;color:var(--accent)!important;text-decoration:none;margin-bottom:24px;font-size:0.95em}
.back:hover{text-decoration:underline}
.nav-bar{display:flex;justify-content:space-between;align-items:center;margin-top:40px;padding-top:20px;border-top:1px solid var(--border)}
.nav-bar a{color:var(--accent);text-decoration:none;font-size:13px}
.nav-bar a:hover{opacity:0.8}
@media(max-width:768px){.hero h1{font-size:22px}.container{padding:20px 16px 60px}pre{padding:14px!important;font-size:12.5px!important}}
</style>

<div class="hero"><h1>基于 Astro 搭建个人博客并部署上线全流程</h1>
<div class="subtitle">从本地开发到 GitHub Pages 部署、域名配置、CDN 加速、搜索引擎收录的完整记录</div>
<div class="hero-meta"><span class="tag tag-accent">环境搭建</span><span class="tag">Astro</span><span class="tag">GitHub Pages</span><span class="tag">Cloudflare</span><span class="tag">SEO</span></div>
</div>
<div class="container">
<a class="back" href="/">← 返回首页</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">项目背景与选型</a></li>
<li><a href="#s2">本地环境搭建</a></li>
<li><a href="#s3">部署到 GitHub Pages</a></li>
<li><a href="#s4">自定义域名配置</a></li>
<li><a href="#s5">Cloudflare CDN 加速</a></li>
<li><a href="#s6">百度站长平台接入</a></li>
<li><a href="#s7">Bing 站长工具接入</a></li>
<li><a href="#s8">踩坑记录与总结</a></li>
</ul></div>

<div class="article-content">

## 项目背景与选型 {#s1}

最近想搭建一个个人技术博客，记录安全与逆向相关的学习笔记。在对比了多个静态站点生成器后，最终选择了 **Astro**。

Astro 的核心优势：

- **内容驱动**：原生支持 Markdown/MDX，非常适合技术博客
- **零 JS 默认**：生成纯静态 HTML，加载速度极快
- **岛屿架构**：需要交互的部分可以按需加载 JS
- **主题丰富**：社区有大量开箱即用的博客主题

基于 vhAstro-Theme 进行了个性化定制，包括样式调整、内容迁移、SEO 优化等。

## 本地环境搭建 {#s2}

### 环境要求

- Node.js 22+
- pnpm 10+

### 初始化项目

```bash
# 克隆主题仓库
git clone https://github.com/uxiaohan/vhAstro-Theme.git my-blog
cd my-blog

# 安装依赖
pnpm install

# 本地开发预览
pnpm dev
```

### 基础配置

核心配置文件是 `src/config.ts`，主要修改以下内容：

```typescript
export default {
  Title: '姚振远博客',
  Site: 'https://yaozhenyuanblog.cn',
  Subtitle: '网安 | 逆向',
  Description: '姚振远博客 专注于安全与逆向相关技术的分享。',
  Author: '.Yao',
  // ...
}
```

### 文章编写

文章放在 `src/content/blog/` 目录下，格式为 Markdown，需要包含 frontmatter：

```markdown
---
title: "文章标题"
date: 2026-05-26
categories: "分类"
tags: ["标签1", "标签2"]
id: "article-slug"
---
```

### 主题样式调整

在实际使用中遇到了几个样式问题需要修复：

**代码块背景色**：原主题使用 `github-light` 主题，代码块背景和页面背景对比度不够。解决方法是在 `astro.config.mjs` 中将 Shiki 主题改为 `github-dark`：

```javascript
shikiConfig: { theme: 'github-dark' }
```

同时修改 `ArticleBase.less` 中的代码块背景色为 `#151720`，边框改为 `#252837`。

**搜索索引污染**：搜索索引生成时会包含 `<style>` 标签内的 CSS 文本。在 `src/utils/vhSearch.ts` 中提取文本前先清除样式标签：

```typescript
const $ = cheerio.load(`<body>${i.rendered.html}</body>`);
$('style').remove();
$('script').remove();
$('svg').remove();
```

## 部署到 GitHub Pages {#s3}

### 创建 GitHub 仓库

在 GitHub 创建仓库 `jiuhuiyi365.github.io`（用户名.github.io 格式会自动启用 GitHub Pages）。

### 配置 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --no-frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 推送代码

```bash
git add .
git commit -m "初始博客部署"
git push origin main
```

推送后 GitHub Actions 会自动构建并部署，约 1-2 分钟后网站即可访问。

<div class="tip-box"><div class="tip-label">TIP</div>GitHub Pages 部署成功后，访问 <code>https://jiuhuiyi365.github.io</code> 即可看到网站。自定义域名会在下一步配置。</div>

## 自定义域名配置 {#s4}

### 购买域名

在阿里云万网购买了域名 `yaozhenyuanblog.cn`。

### DNS 配置

在阿里云 DNS 控制台添加 CNAME 记录：

| 类型 | 主机记录 | 记录值 |
|------|---------|--------|
| CNAME | @ | jiuhuiyi365.github.io |
| CNAME | www | jiuhuiyi365.github.io |

### GitHub Pages 自定义域名

在仓库根目录创建 `CNAME` 文件，内容为：

```
yaozhenyuanblog.cn
```

然后在仓库 Settings → Pages → Custom domain 中填入域名，GitHub 会自动签发 HTTPS 证书。

## Cloudflare CDN 加速 {#s5}

由于 GitHub Pages 在国内访问速度较慢，且百度爬虫无法直接抓取，需要接入 Cloudflare CDN。

### 注册 Cloudflare

在 Cloudflare 注册账号后，选择 "Connect and accelerate traffic" → "Public websites" → "Connect a domain"，输入域名 `yaozhenyuanblog.cn`。

Cloudflare 会自动扫描已有 DNS 记录，确认无误后点击继续。

### 修改 Nameserver

最关键的一步：将域名的 Nameserver 从阿里云默认的 `dns1.hichina.com / dns2.hichina.com` 修改为 Cloudflare 提供的：

```
darwin.ns.cloudflare.com
dorthy.ns.cloudflare.com
```

在阿里云域名控制台 → 修改 DNS → 填入以上两个地址，提交保存。

### SSL/TLS 配置

在 Cloudflare 控制台 → SSL/TLS → 将加密模式改为 **Flexible**。这样 Cloudflare 到 GitHub Pages 之间不需要强制 HTTPS，避免证书问题。

<div class="warn-box"><div class="warn-label">WARN</div>修改 Nameserver 后 DNS 生效需要几分钟到 24 小时，期间网站可能短暂不可访问。Cloudflare 检测到生效后会显示 Active 状态。</div>

## 百度站长平台接入 {#s6}

### 验证站点

1. 访问 [百度站长平台](https://ziyuan.baidu.com)，添加网站 `https://yaozhenyuanblog.cn`
2. 验证方式选择 **文件验证**，下载验证文件放到 `public/` 目录下
3. 部署后点击完成验证

在 `src/components/Head/Head.astro` 中添加百度验证 meta 标签：

```html
<meta name="baidu-site-verification" content="codeva-LSpbhWl9M8" />
```

<div class="danger-box"><div class="danger-label">IMPORTANT</div>如果网站部署在 GitHub Pages，百度爬虫在海外可能无法直接访问。需要通过 Cloudflare CDN 代理后才能验证成功。这也是接入 Cloudflare 的重要原因之一。</div>

### 提交 Sitemap

在百度站长 → 普通收录 → Sitemap 中提交：`https://yaozhenyuanblog.cn/sitemap-index.xml`。

新站的提交配额可能为 0，需要等待百度自动分配（通常 1-3 天）。不用着急，百度会通过 robots.txt 自动发现并抓取网站内容。

## Bing 站长工具接入 {#s7}

### 验证站点

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)，输入 `https://yaozhenyuanblog.cn`
2. 选择 CNAME 验证方式，获取 CNAME 记录值
3. 在 Cloudflare DNS 中添加 CNAME 记录：

| 类型 | 名称 | 目标 | 代理状态 |
|------|------|------|---------|
| CNAME | 77af7dd692941c6553350210f3d30fe7 | verify.bing.com | DNS only |

4. 回到 Bing 点击验证

在 `Head.astro` 中同时添加 Bing 验证 meta 标签：

```html
<meta name="msvalidate.01" content="12186215EEDB59BBCB6B5876C4DB3A06" />
```

### 提交 Sitemap

在 Bing Webmaster → Sitemaps 中提交：`https://yaozhenyuanblog.cn/sitemap-index.xml`。

Bing 的收录速度通常比百度快，提交后很快就能在搜索引擎中搜到网站内容。

## 踩坑记录与总结 {#s8}

### 遇到的问题汇总

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 代码块背景色太浅 | Shiki 使用 github-light 主题 | 改为 github-dark 主题 |
| 搜索结果包含 CSS | cheerio 提取文本未清理 style 标签 | 提取前移除 style/script/svg |
| 导航链接跳转 404 | 旧 HTML 文件名与 Astro 路由不匹配 | 统一改为 `/article/{id}` 格式 |
| Banner 图片目录缺失报错 | getCover.ts 未处理目录不存在的情况 | 添加 try-catch 降级到默认封面 |
| 百度验证失败 | GitHub Pages 在国内不可访问 | 接入 Cloudflare CDN |
| Bing 验证失败 | Cloudflare 缓存旧版本 | 清除缓存或使用 CNAME 验证 |
| git push 连接超时 | 国内无法直接访问 GitHub | 需要开启梯子 |

### 最终架构

```
用户访问 → Cloudflare CDN → GitHub Pages
                ↓
          DNS 解析 (阿里云)
                ↓
       搜索引擎爬虫 (百度/Bing/Google)
```

### 费用明细

| 项目 | 费用 |
|------|------|
| 域名 (yaozhenyuanblog.cn) | 首年 ¥29 |
| GitHub Pages | 免费 |
| Cloudflare CDN | 免费 |
| 百度站长 | 免费 |
| Bing Webmaster | 免费 |
| **总计** | **¥29/年** |

整体搭建过程比较顺利，主要时间花在了样式调试和搜索引擎接入上。最终以极低的成本拥有了一个性能不错、SEO 友好的个人技术博客。

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>