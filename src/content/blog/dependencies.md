---
title: "Dependencies：现代 DLL 依赖分析工具"
date: 2026-05-28
categories: "安全与逆向"
tags: ["Dependencies","Dependency Walker","DLL","逆向","PE分析"]
id: "dependencies"
description: "详解 Dependencies 工具的功能与用法，它是经典 Dependency Walker 的现代替代品，用于分析 Windows 可执行文件的 DLL 依赖关系"
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

<div class="hero"><h1>Dependencies：现代 DLL 依赖分析工具</h1>
<p class="subtitle">经典 Dependency Walker 的现代替代品，解析 PE 文件的完整 DLL 依赖树</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">Dependencies</span><span class="tag">DLL</span><span class="tag">PE分析</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 从 Dependency Walker 到 Dependencies</a></li>
<li><a href="#s2">2. 安装与基本使用</a></li>
<li><a href="#s3">3. 核心功能详解</a></li>
<li><a href="#s4">4. 逆向分析实战</a></li>
<li><a href="#s5">5. 命令行用法</a></li>
<li><a href="#s6">6. 与相关工具的对比</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 从 Dependency Walker 到 Dependencies</h2>

<h3>1.1 Dependency Walker 的历史</h3>
<p><strong>Dependency Walker</strong>（<code>depends.exe</code>）是 Windows 平台上最经典的 DLL 依赖分析工具，最早随 Visual C++ 5.0 发布（1997 年），由 Steve Miller 开发。它能够递归解析 PE 文件的导入表，展示完整的 DLL 依赖树，在排查「找不到 DLL」错误时是必备工具。</p>

<p>但 Dependency Walker 有严重的时代局限：</p>
<ul>
<li><strong>不支持 API Sets</strong>：Windows 8 之后引入的 API Set 机制（如 <code>api-ms-win-core-file-l1-1-0.dll</code>）会导致 Dependency Walker 报告大量不存在的「缺失 DLL」</li>
<li><strong>不支持 WinSxS</strong>：Windows 的并排组件（Side-by-Side Assembly）机制让 DLL 解析逻辑变得复杂，旧版工具无法正确处理</li>
<li><strong>不支持 Universal Windows Platform</strong>：UWP 应用的依赖机制完全不同</li>
<li><strong>项目已停止维护</strong>：最后一次更新在 2006 年，距今已有 20 年</li>
</ul>

<h3>1.2 Dependencies 的诞生</h3>
<p><strong>Dependencies</strong> 是由 lucasg 开发的开源项目，完全重写了 Dependency Walker 的核心功能，同时解决了上述所有问题。它使用 C# 编写，基于 .NET Framework，支持 Windows 7 及以上系统。</p>

<p>核心改进：</p>
<ul>
<li>正确解析 API Set 映射关系，不再误报缺失 DLL</li>
<li>支持 WinSxS 和 Universal Windows Platform</li>
<li>支持 32 位和 64 位 PE 文件</li>
<li>现代化的用户界面</li>
<li>支持命令行操作，可集成到自动化脚本中</li>
</ul>

<div class="tip-box"><div class="tip-label">推荐</div>在 Windows 10/11 上分析 DLL 依赖时，请直接使用 Dependencies 而不是 Dependency Walker。旧版工具会产生大量误报，浪费排查时间。</div>

<h2 id="s2">2. 安装与基本使用</h2>

<h3>2.1 下载安装</h3>
<p>Dependencies 是开源项目，可从 GitHub 仓库（lucasg/Dependencies）下载 Release 版本。下载后解压即可使用，无需安装。注意根据分析目标选择 32 位或 64 位版本——分析 64 位 PE 文件需要 64 位版本。</p>

<h3>2.2 基本操作</h3>
<p>打开 Dependencies 后，有两种方式加载目标文件：</p>
<ul>
<li>通过菜单 File → Open 选择 PE 文件</li>
<li>直接将 PE 文件（<code>.exe</code>、<code>.dll</code>、<code>.sys</code>）拖入窗口</li>
</ul>

<p>加载后，Dependencies 会递归解析 PE 文件的导入表，生成完整的依赖树。主界面分为几个区域：</p>
<ul>
<li><strong>依赖树面板</strong>（左侧）：以树形结构展示所有 DLL 依赖关系，可逐层展开</li>
<li><strong>导入表面板</strong>（右上）：显示当前选中 DLL 导入的所有函数</li>
<li><strong>导出表面板</strong>（右下）：显示当前选中 DLL 导出的所有函数</li>
<li><strong>详细信息面板</strong>（底部）：显示 PE 文件的元数据（PE 头信息、编译时间戳等）</li>
</ul>

<h2 id="s3">3. 核心功能详解</h2>

<h3>3.1 依赖树分析</h3>
<p>Dependencies 的核心功能是递归解析 PE 文件的导入表，构建完整的依赖树。加载目标文件后，你会看到类似这样的结构：</p>

<pre><code>target.exe
├── kernel32.dll
│   ├── ntdll.dll
├── user32.dll
│   ├── win32u.dll
│   └── ntdll.dll
├── advapi32.dll
│   ├── sechost.dll
│   └── ntdll.dll
└── custom.dll
    ├── msvcrt.dll
    └── ws2_32.dll</code></pre>

<p>展开每个节点可以看到该 DLL 的子依赖。依赖树的叶子节点通常是 <code>ntdll.dll</code>，因为它是所有用户态程序的底层基础。</p>

<h3>3.2 导入表与导出表</h3>
<p>选中依赖树中的任意 DLL 后，右侧面板会显示：</p>
<ul>
<li><strong>导入函数列表</strong>：该 DLL 从其他 DLL 中引入了哪些函数，包括函数名和 Ordinal</li>
<li><strong>导出函数列表</strong>：该 DLL 向外提供了哪些函数，包括函数名、Ordinal 和地址</li>
</ul>

<p>在逆向分析中，这些信息非常关键。通过查看导入函数列表，可以快速了解一个 DLL 或 EXE 使用了哪些系统能力——是文件操作、网络通信、注册表访问，还是加密解密。</p>

<h3>3.3 缺失 DLL 检测</h3>
<p>如果依赖树中某个 DLL 无法在系统路径中找到，Dependencies 会用<strong>红色</strong>标记该节点。这比旧版 Dependency Walker 的误报少得多——它会正确处理 API Set 映射，只有真正的缺失 DLL 才会被标红。</p>

<h3>3.4 PE 头信息</h3>
<p>底部面板显示 PE 文件的详细元数据：</p>
<ul>
<li>编译时间戳（可用于判断程序的编译时间）</li>
<li>Machine 类型（x86 / x64 / ARM）</li>
<li>子系统类型（Console / GUI / Driver）</li>
<li>入口点地址</li>
<li>节表信息（Section Table）</li>
<li>资源目录</li>
</ul>

<div class="tip-box"><div class="tip-label">TIP</div>PE 文件的<strong>编译时间戳</strong>是逆向分析中的一个重要线索。它可以帮你判断程序的大致编译时间，与已知的恶意软件家族时间线进行对比。但注意时间戳可以被伪造，不能作为唯一证据。</div>

<h2 id="s4">4. 逆向分析实战</h2>

<h3>4.1 快速判断程序功能</h3>
<p>拿到一个未知的 EXE 文件，第一步就是用 Dependencies 查看它的导入表。通过导入函数可以快速推断程序的功能：</p>

<table><tr><th>导入的 DLL / 函数</th><th>推断的功能</th></tr>
<tr><td><code>ws2_32.dll</code>（<code>socket</code>、<code>connect</code>、<code>send</code>）</td><td>有网络通信能力</td></tr>
<tr><td><code>wininet.dll</code>（<code>HttpSendRequest</code>、<code>InternetOpen</code>）</td><td>有 HTTP 通信能力</td></tr>
<tr><td><code>advapi32.dll</code>（<code>RegOpenKey</code>、<code>RegSetValue</code>）</td><td>操作注册表</td></tr>
<tr><td><code>crypt32.dll</code> / <code>bcrypt.dll</code></td><td>涉及加密操作</td></tr>
<tr><td><code>user32.dll</code>（<code>SetWindowsHookEx</code>、<code>GetAsyncKeyState</code>）</td><td>可能有键盘记录功能</td></tr>
<tr><td><code>psapi.dll</code> / <code>tlhelp32.dll</code></td><td>枚举进程，可能注入代码到其他进程</td></tr>
<tr><td><code>dbghelp.dll</code> / <code>dbgcore.dll</code></td><td>有调试或异常转储功能</td></tr></table>

<div class="warn-box"><div class="warn-label">注意</strong></div>通过 IAT（导入地址表）只能看到<strong>静态链接</strong>的 API。如果程序使用 <code>LoadLibrary</code> + <code>GetProcAddress</code> 进行动态加载，这些 API 不会出现在导入表中。要分析动态加载的 API，需要结合 x64dbg 或 API Monitor。</div>

<h3>4.2 排查「找不到 DLL」错误</h3>
<p>程序启动时报错「由于找不到 xxx.dll，无法继续执行代码」，这是 Dependencies 最经典的用途：</p>
<ol>
<li>用 Dependencies 打开报错的 EXE</li>
<li>检查依赖树中标红的节点（缺失 DLL）</li>
<li>找到缺失 DLL 的名称和版本</li>
<li>安装对应的运行时库（如 VC++ Redistributable）或将 DLL 放到程序目录</li>
</ol>

<h3>4.3 分析可疑 DLL</h3>
<p>场景：发现某个进程加载了一个不认识的 DLL，想判断它是否可疑。</p>
<ol>
<li>用 Dependencies 打开该 DLL</li>
<li>查看它的导入表——如果一个「工具软件」的 DLL 导入了键盘记录相关函数（<code>SetWindowsHookEx</code>、<code>GetAsyncKeyState</code>），这很可疑</li>
<li>查看它的导出表——了解它提供了什么功能</li>
<li>查看编译时间戳——与已知恶意软件样本对比</li>
</ol>

<h3>4.4 分析加壳程序</h3>
<p>加壳程序（如 UPX、ASPack）处理后的 PE 文件，导入表通常只有很少几个函数（主要是 <code>LoadLibrary</code> 和 <code>GetProcAddress</code>），因为壳会自行解压并修复导入表。</p>
<p>如果用 Dependencies 打开一个 EXE，发现导入表异常精简，几乎只看到 <code>kernel32.dll</code> 中的 <code>LoadLibrary</code> 和 <code>GetProcAddress</code>，这说明程序很可能被加壳了。</p>

<div class="tip-box"><div class="tip-label">判断方法</div>正常编译的程序至少会导入 5-10 个以上的系统 DLL。如果你看到导入表中只有 1-2 个 DLL，且函数列表很短，大概率是加壳了。可以结合 PEiD 或 DIE（Detect It Easy）进一步确认壳的类型。</div>

<h3>4.5 对比两个版本的差异</h3>
<p>场景：程序更新后出现了兼容性问题，想知道新版本的依赖有什么变化。</p>
<ol>
<li>分别用 Dependencies 打开新旧两个版本</li>
<li>对比依赖树，看新增或移除了哪些 DLL</li>
<li>对比导入函数列表，看 API 调用范围的变化</li>
</ol>

<h2 id="s5">5. 命令行用法</h2>

<p>Dependencies 提供了命令行工具 <code>Dependencies.exe</code>，可以在脚本中批量分析 PE 文件。</p>

<h3>5.1 基本命令</h3>

<p>查询指定 PE 文件的依赖：</p>
<pre><code>Dependencies.exe -imports "C:\path\to\target.exe"</code></pre>

<p>递归查询所有依赖：</p>
<pre><code>Dependencies.exe -chain "C:\path\to\target.exe"</code></pre>

<p>查询指定 DLL 的导出函数：</p>
<pre><code>Dependencies.exe -exports "C:\Windows\System32\kernel32.dll"</code></pre>

<h3>5.2 批量分析</h3>
<p>可以结合脚本批量分析目录中的所有 PE 文件，快速检查是否有缺失依赖：</p>
<pre><code>for %f in (*.exe *.dll) do Dependencies.exe -imports "%f"</code></pre>

<h2 id="s6">6. 与相关工具的对比</h2>

<table><tr><th>工具</th><th>分析深度</th><th>现代系统支持</th><th>命令行</th><th>适用场景</th></tr>
<tr><td><strong>Dependencies</strong></td><td>导入表 + 导出表 + PE 头</td><td>完全支持</td><td>支持</td><td>DLL 依赖分析、PE 快速检查</td></tr>
<tr><td>Dependency Walker</td><td>导入表 + 导出表</td><td>大量误报</td><td>支持</td><td>老系统上的依赖检查（不推荐再用）</td></tr>
<tr><td>DIE（Detect It Easy）</td><td>壳检测 + 编译器识别</td><td>完全支持</td><td>支持</td><td>判断程序是否加壳、用什么编译器编译</td></tr>
<tr><td>CFF Explorer</td><td>PE 头编辑 + 导入表修复</td><td>完全支持</td><td>不支持</td><td>手动编辑 PE 结构、修复导入表</td></tr>
<tr><td>IDA / Ghidra</td><td>反汇编 + 反编译</td><td>完全支持</td><td>支持</td><td>深度逆向分析、还原程序逻辑</td></tr></table>

<p>选择建议：</p>
<ul>
<li><strong>快速查看依赖</strong>：用 Dependencies，打开即看，交互友好</li>
<li><strong>检查是否加壳</strong>：用 DIE，专门做壳检测和编译器识别</li>
<li><strong>修复 PE 结构</strong>：用 CFF Explorer，可以手动编辑 PE 头、修复被破坏的导入表</li>
<li><strong>深度分析代码</strong>：用 IDA 或 Ghidra，从汇编层面还原程序逻辑</li>
</ul>

<div class="tip-box"><div class="tip-label">工具链</div>在逆向分析流程中，Dependencies 通常处于<strong>侦察阶段</strong>：拿到样本后先用 Dependencies 看导入表，快速判断程序功能和是否加壳；然后用 DIE 确认壳类型；脱壳后用 x64dbg 动态调试；最后用 IDA/Ghidra 进行静态分析。Dependencies 花费的时间最少，但提供的信息量很大。</div>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
