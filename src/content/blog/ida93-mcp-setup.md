---
title: "IDA Pro 9.3 安装、Patch 与 MCP 环境搭建"
date: 2026-07-22
categories: "环境搭建"
tags: ["IDA Pro", "逆向", "MCP", "AI辅助逆向", "环境搭建"]
id: "ida93-mcp-setup"
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
.article-content h2{font-size:21px;font-weight:700;color:#fff;margin:40px 0 16px;padding-left:14px;border-left:3px solid var(--accent);line-height:1.4}
.article-content h3{font-size:17px;font-weight:600;color:#d1d5e0;margin:28px 0 12px}
.article-content h4{font-size:15px;font-weight:600;color:var(--accent);margin:20px 0 10px}
.article-content p{margin:12px 0;color:#e1e4ed!important;line-height:1.85;background:#0f1117!important}
.article-content a{color:var(--accent);text-decoration:none;border-bottom:1px solid rgba(108,158,235,0.3);transition:border-color .2s}
.article-content a:hover{border-bottom-color:var(--accent)}
.article-content strong{color:#fff;font-weight:600}
.article-content img{max-width:100%;border-radius:8px;margin:16px 0;border:1px solid var(--border)}
.article-content ul,.article-content ol{padding-left:24px;margin:12px 0}
.article-content li{margin:6px 0;color:#e1e4ed!important;line-height:1.75}
.article-content li::marker{color:var(--accent)}
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
.toc a::before{content:'\203A';margin-right:10px;color:var(--accent);font-weight:700}
.toc .toc-sub{padding-left:20px}
.back{display:inline-block;color:var(--accent)!important;text-decoration:none;margin-bottom:24px;font-size:0.95em}
.back:hover{text-decoration:underline}
.nav-bar{display:flex;justify-content:space-between;align-items:center;margin-top:40px;padding-top:20px;border-top:1px solid var(--border)}
.nav-bar a{color:var(--accent);text-decoration:none;font-size:13px}
.nav-bar a:hover{opacity:0.8}
@media(max-width:768px){.hero h1{font-size:22px}.container{padding:20px 16px 60px}pre{padding:14px!important;font-size:12.5px!important}}
</style>

<div class="hero"><h1>IDA Pro 9.3 安装、Patch 与 MCP 环境搭建</h1>
<p class="subtitle">从零搭建 IDA 9.3 + MCP（AI 自动化逆向）</p>
<div class="hero-meta"><span class="tag tag-accent">环境搭建</span><span class="tag">IDA Pro</span><span class="tag">逆向</span><span class="tag">MCP</span><span class="tag">AI辅助逆向</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-prep">1. 准备与安装</a></li>
<li><a href="#sec-patch">2. Patch 与激活</a></li>
<li><a href="#sec-mcp">3. MCP 环境搭建</a>
  <div class="toc-sub">
  <a href="#sec-install">3.1 安装 ida-pro-mcp</a>
  <a href="#sec-config">3.2 客户端配置</a>
  <a href="#sec-verify">3.3 验证</a>
  </div>
</li>
<li><a href="#sec-usage">4. 使用场景</a></li>
<li><a href="#sec-notes">5. 注意事项</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-prep">1. 准备与安装</h2>

<h4>下载</h4>

<p>IDA Pro 9.3 安装文件可以从以下渠道获取：</p>
<ul>
<li>官方购买：<a href="https://hex-rays.com/ida-pro/" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">Hex-Rays 官网</a></li>
<li>评估版：官方提供 30 天评估版下载</li>
<li>看雪论坛（破解版参考）：<a href="https://bbs.kanxue.com/thread-290063.htm" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">IDA 9.3 下载与 Patch 讨论</a></li>
</ul>

<h4>系统要求</h4>

<table>
<tr><th>项目</th><th>要求</th></tr>
<tr><td>操作系统</td><td>Windows 10/11 64 位</td></tr>
<tr><td>Python</td><td>3.11+（注册机和 MCP 都需要）</td></tr>
<tr><td>硬盘</td><td>至少 5 GB 可用空间</td></tr>
<tr><td>内存</td><td>至少 16 GB（推荐 32 GB）</td></tr>
</table>

<h4>安装步骤</h4>

<ol>
<li>运行 IDA Pro 9.3 安装程序，建议安装到非系统盘（如 <code>E:\IDA Pro 9.3</code>）</li>
<li>安装过程中勾选 Python 3.11 组件</li>
<li>安装完成后不要立即运行程序</li>
</ol>

<h2 id="sec-patch">2. Patch 与激活</h2>

<div class="warn-box">
<div class="warn-label">免责声明</div>
本节仅作为技术研究参考。请支持正版软件，从 Hex-Rays 官方获取授权。
</div>

<h4>Patch 流程</h4>

<ol>
<li>将注册机（Python 脚本）复制到 IDA 安装目录</li>
<li>确保 Python 3.11+ 环境可用，执行注册机脚本生成许可证文件</li>
<li>将生成的许可证文件放入 IDA 安装目录的对应位置</li>
<li>首次启动 IDA Pro 9.3，确认版本号和功能正常</li>
</ol>

<div class="tip-box">
<div class="tip-label">提示</div>
如果使用 Python 3 注册机出现报错，请确认 Python 版本是否为 3.11+，必要时使用 <code>idapyswitch</code> 切换 IDA 绑定的 Python 版本。
</div>

<h2 id="sec-mcp">3. MCP 环境搭建</h2>

<p><strong>IDA Pro MCP</strong>（<a href="https://github.com/mrexodia/ida-pro-mcp" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">mrexodia/ida-pro-mcp</a>）是一个开源的 AI 逆向辅助工具，通过 Model Context Protocol（MCP）将 IDA Pro 与 AI 大模型连接起来。它让 AI 能够直接读取 IDA 数据库中的反汇编代码、函数列表、交叉引用等，实现 AI 辅助逆向分析。</p>

<h3 id="sec-install">3.1 安装 ida-pro-mcp</h3>

<p><strong>前提：</strong>Python 3.11+，安装 <code>uv</code> 包管理器。</p>

<pre><code># 安装 uv（Windows）
pip install uv</code></pre>

<p><strong>安装 MCP 插件：</strong></p>

<pre><code># 卸载旧版本（如果有）
pip uninstall ida-pro-mcp

# 安装最新版
pip install --upgrade git+https://github.com/mrexodia/ida-pro-mcp

# 安装插件到 IDA
ida-pro-mcp --install</code></pre>

<p>或者使用 <code>uv</code> 方式（推荐）：</p>

<pre><code># 克隆仓库到本地（如 C:\MCP\ida-pro-mcp）
git clone https://github.com/mrexodia/ida-pro-mcp.git C:\MCP\ida-pro-mcp

# 激活 idalib
uv run "C:\Program Files\IDA Professional 9.3\idalib\python\py-activate-idalib.py"</code></pre>

<h3 id="sec-config">3.2 客户端配置</h3>

<h4>获取配置 JSON</h4>

<pre><code>ida-pro-mcp --config</code></pre>

<h4>Cline / Roo Code 配置示例</h4>

<p>编辑 <code>cline_mcp_settings.json</code>：</p>

<pre><code>{
  "mcpServers": {
    "github.com/mrexodia/ida-pro-mcp": {
      "command": "uv",
      "args": [
        "--directory",
        "C:\\MCP\\ida-pro-mcp",
        "run",
        "server.py",
        "--install-plugin"
      ],
      "timeout": 1800,
      "disabled": false
    }
  }
}</code></pre>

<h4>SSE 传输模式配置</h4>

<pre><code>{
  "ida-pro-mcp-sse-transport": {
    "command": "uv",
    "args": [
      "run",
      "ida-pro-mcp",
      "--transport",
      "http://127.0.0.1:8744/sse"
    ],
    "env": {}
  }
}</code></pre>

<h3 id="sec-verify">3.3 验证</h3>

<ol>
<li>完全重启 IDA Pro 9.3（加载任意二进制文件）</li>
<li>在 IDA 的插件菜单中找到并启动 MCP 服务</li>
<li>服务正常启动后会显示监听地址 <code>http://127.0.0.1:13337</code></li>
<li>重启 MCP 客户端（VS Code、Claude 等）使配置生效</li>
<li>在客户端中连接 MCP 服务，即可通过 AI 与 IDA 交互</li>
</ol>

<div class="tip-box">
<div class="tip-label">验证方法</div>
启动后在 IDA 插件菜单中看到 MCP 相关条目，且客户端能成功连接到 MCP 服务，即表示搭建完成。
</div>

<h2 id="sec-usage">4. 使用场景</h2>

<p>MCP 搭建完成后，可以在以下场景中使用：</p>

<table>
<tr><th>场景</th><th>说明</th></tr>
<tr><td>AI 自动分析函数</td><td>指示 AI 读取指定函数的反汇编代码，分析其功能、参数和返回值</td></tr>
<tr><td>批量重命名</td><td>让 AI 根据函数行为自动为大量 <code>sub_xxxx</code> 函数赋予有意义的名称</td></tr>
<tr><td>交叉引用追踪</td><td>AI 自动追踪函数调用链，生成调用关系图</td></tr>
<tr><td>反混淆辅助</td><td>将混淆后的代码片段交给 AI，配合 IDA 的 microcode 进行去混淆</td></tr>
<tr><td>结构体还原</td><td>AI 分析内存访问模式，自动推断和创建结构体定义</td></tr>
</table>

<h2 id="sec-notes">5. 注意事项</h2>

<ul>
<li><strong>Python 版本：</strong>确保 IDA 绑定的 Python 版本为 3.11+，低版本可能导致注册机或 MCP 运行失败</li>
<li><strong>网络问题：</strong>安装 MCP 时需要从 GitHub 拉取代码，确保网络能够正常访问 GitHub</li>
<li><strong>protobuf 版本冲突：</strong>如果之前使用过 angr 等工具，注意 protobuf 版本冲突问题，可用虚拟环境隔离</li>
<li><strong>完全重启：</strong>配置后需要完全重启 IDA 和 MCP 客户端（有些客户端如 Claude 在后台运行，需从系统托盘退出）</li>
<li><strong>加载二进制：</strong>MCP 插件菜单需要在 IDA 中加载了二进制文件后才能显示</li>
<li><strong>安全性：</strong>MCP Server 存在潜在安全风险，第三方可通过 MCP 协议进行注入攻击，开启自动执行模式时风险更高，注意权限控制</li>
</ul>

<div class="footer">参考：看雪论坛 · GitHub mrexodia/ida-pro-mcp</div>

</div></div>
