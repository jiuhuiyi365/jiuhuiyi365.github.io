---
title: "VSCode 的 C/C++ 插件替换成 clangd 插件"
date: 2026-05-25
categories: "环境搭建"
tags: ["VSCode","C++","clangd"]
id: "vscode-clangd"
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

<div class="hero"><h1>VSCode 的 C/C++ 插件替换成 clangd 插件</h1>
<div class="hero-meta"><span class="tag tag-accent">环境搭建</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">为什么用 clangd 替代 C/C++ 插件</a></li>
<li><a href="#s2">卸载 C/C++ 插件</a></li>
<li><a href="#s3">安装 clangd 插件</a></li>
<li><a href="#s4">配置 compile_commands.json</a></li>
<li><a href="#s5">VSCode 配置优化</a></li>
<li><a href="#s6">.clangd 配置文件</a></li>
<li><a href="#s7">常见问题排查</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 为什么用 clangd 替代 C/C++ 插件</h2>
<p>微软官方的 <strong>C/C++ 插件（cpptools）</strong> 基于自身的 IntelliSense 引擎，在大型项目中经常出现以下问题：</p>
<ul>
<li>代码补全响应慢，尤其在头文件较多的项目中</li>
<li>跳转定义经常定位到错误位置或失败</li>
<li>对 C++17/20 新特性的支持滞后</li>
<li>内存占用高，容易导致 VSCode 卡顿</li>
</ul>
<p><strong>clangd</strong> 基于 LLVM/Clang 的语言服务协议（LSP）实现，具有以下优势：</p>
<ul>
<li>补全速度快，基于实际编译结果而非启发式猜测</li>
<li>精准的代码跳转和查找引用</li>
<li>实时诊断（错误、警告）</li>
<li>支持 clang-format 自动格式化</li>
<li>内存占用低，对 C++20 支持良好</li>
</ul>

<h2 id="s2">2. 卸载 C/C++ 插件</h2>
<p>在 VSCode 扩展面板中搜索 <code>C/C++</code>（ms-vscode.cpptools），点击卸载。同时建议卸载以下相关插件以避免冲突：</p>
<ul>
<li><code>C/C++ Extension Pack</code></li>
<li><code>C/C++ Themes</code></li>
</ul>
<p>卸载后重启 VSCode 确保完全清除。</p>

<h2 id="s3">3. 安装 clangd 插件</h2>
<p>在扩展面板搜索 <code>clangd</code>（llvm-vs-code-extensions.vscode-clangd），点击安装。安装完成后 VSCode 会提示同时安装 clangd 语言服务器。</p>
<div class="tip-box"><div class="tip-label">提示</div>如果系统未安装 clangd，插件会自动下载。也可手动安装：<code>sudo apt install clangd-15</code>（Linux）或通过 <code>brew install llvm</code>（macOS）。</div>

<h2 id="s4">4. 配置 compile_commands.json</h2>
<p>clangd 的核心是 <code>compile_commands.json</code>，它告诉 clangd 每个文件的编译命令、头文件路径和宏定义。生成方式：</p>
<h3>CMake 项目</h3>
<pre><code>mkdir build && cd build
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1 ..
ln -s build/compile_commands.json .</code></pre>
<h3>Makefile 项目</h3>
<pre><code># 使用 bear 拦截 make 的编译命令
sudo apt install bear
bear -- make</code></pre>
<h3>其他构建系统</h3>
<p>可以手动编写 <code>compile_commands.json</code>：</p>
<pre><code>[
  {
    "directory": "/home/user/project",
    "command": "g++ -std=c++17 -I./include -c main.cpp -o main.o",
    "file": "main.cpp"
  }
]</code></pre>

<h2 id="s5">5. VSCode 配置优化</h2>
<p>在 <code>.vscode/settings.json</code> 中添加以下配置：</p>
<pre><code>{
  "clangd.arguments": [
    "--log=verbose",
    "--pretty",
    "--background-index",
    "--compile-commands-dir=${workspaceFolder}",
    "--header-insertion=iwyu",
    "--completion-style=detailed",
    "--query-driver=/usr/bin/g++,/usr/bin/clang++"
  ],
  "editor.formatOnSave": true,
  "[cpp]": {
    "editor.defaultFormatter": "llvm-vs-code-extensions.vscode-clangd"
  },
  "[c]": {
    "editor.defaultFormatter": "llvm-vs-code-extensions.vscode-clangd"
  },
  "C_Cpp.intelliSenseEngine": "disabled"
}</code></pre>
<div class="warn-box"><div class="warn-label">重要</div>必须设置 <code>"C_Cpp.intelliSenseEngine": "disabled"</code>，否则 cpptools 的残留服务会与 clangd 冲突，导致补全和跳转异常。</div>

<h2 id="s6">6. .clangd 配置文件</h2>
<p>在项目根目录创建 <code>.clangd</code> 文件来定制 clangd 行为：</p>
<pre><code>CompileFlags:
  Add:
    - -std=c++17
    - -Wall
    - -I./third_party/include
  Remove:
    - -Wno-*

Diagnostics:
  UnusedIncludes: Strict
  MissingIncludes: Strict

InlayHints:
  Enabled: true
  ParameterNames: true
  TypeDeduction: true</code></pre>

<h2 id="s7">7. 常见问题排查</h2>
<table><tr><th>问题</th><th>解决方案</th></tr>
<tr><td>补全不工作</td><td>检查 <code>compile_commands.json</code> 路径是否正确</td></tr>
<tr><td>头文件找不到</td><td>在 <code>.clangd</code> 中添加 <code>-I</code> 路径</td></tr>
<tr><td>格式化不生效</td><td>确认 <code>defaultFormatter</code> 设为 clangd</td></tr>
<tr><td>两个插件冲突</td><td>确保已禁用 cpptools 的 IntelliSense</td></tr>
<tr><td>clangd 版本过旧</td><td>运行 <code>clangd --version</code>，建议 ≥ 14</td></tr></table>
</div>
<div class="nav-bar"><a href="/archives">← 总目录</a><a href="/article/vim-ycm-cpp">上一篇</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
