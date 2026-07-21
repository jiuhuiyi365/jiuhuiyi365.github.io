---
title: "Mini Debug Capture：一个轻量级 Windows 调试器"
date: 2026-07-21
categories: "安全与逆向"
tags: ["调试", "Windows", "逆向", "Q3D", "断点"]
id: "mini-debug-capture"
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

<div class="hero"><h1>Mini Debug Capture：一个轻量级 Windows 调试器</h1>
<p class="subtitle">用纯 Python 实现的用户态调试器，专为自动化断点数据捕获设计</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">调试</span><span class="tag">Windows</span><span class="tag">Q3D</span><span class="tag">逆向</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-intro">1. 为什么需要它</a></li>
<li><a href="#sec-flow">2. 断点执行流</a></li>
<li><a href="#sec-usage">3. 使用方式</a>
  <div class="toc-sub">
  <a href="#sec-basic">3.1 基本断点捕获</a>
  <a href="#sec-wait">3.2 监听模式</a>
  <a href="#sec-multi">3.3 多进程捕获</a>
  <a href="#sec-selftest">3.4 自测试</a>
  </div>
</li>
<li><a href="#sec-output">4. 输出格式</a></li>
<li><a href="#sec-scripts">5. 工具链</a></li>
<li><a href="#sec-repo">6. 源码</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-intro">1. 为什么需要它</h2>

<p>在逆向工程中，经常需要在特定断点处捕获寄存器值、内存数据和函数参数。通常的做法是用 x64dbg 或 WinDbg 手动下断点、查看数据。但当需要：</p>

<p>在此之前尝试过两种方案：<strong>x64dbg + MCP</strong> 和 <strong>Frida Hook</strong>，各有明显短板。</p>

<table>
<tr><th>方案</th><th>问题</th></tr>
<tr><td>x64dbg + MCP</td><td>MCP 在控制 x64dbg 时频繁出现卡死、断点失效、进程不同步等问题，兼容性不稳定，在大批量自动化断点捕获场景中几乎不可用</td></tr>
<tr><td>Frida Hook</td><td>Frida 的 <code>Interceptor.attach</code> 只能捕获函数的入参和返回值，函数体内部中间状态的寄存器值、栈上数据无法直接获取。想要读取内部数据需要手动计算栈偏移、解析结构体，操作复杂且容易出错</td></tr>
</table>

<p>因此需要一个满足以下条件的工具：</p>

<ul>
<li>完全自动化，不需要人工干预断点操作</li>
<li>能捕获任意断点处的完整寄存器状态和内存数据</li>
<li>稳定可靠，不依赖 GUI 调试器的 IPC 接口</li>
<li>轻量级，纯 Python 实现，方便 AI 调用和控制</li>
</ul>

<p>Mini Debug Capture 就是为这个场景设计的——一个纯粹用 Python + Windows Debug API 实现的轻量级用户态调试器。</p>

<ul>
<li>在程序运行到特定位置时自动、重复地捕获数据</li>
<li>配合自动化脚本或 AI 工具完成批量捕获</li>
<li>在短时间内对同一断点捕获数十次数据</li>
</ul>

<p>手动的调试器操作就变得不可行了。Mini Debug Capture 就是为这个场景设计的——一个纯粹用 Python + Windows Debug API 实现的轻量级用户态调试器。</p>

<div class="warn-box">
<div class="warn-label">设计原则</div>
它不是一个通用的交互式调试器。它不做反汇编、不做控制流分析、不提供命令行交互界面。它的全部工作就是：在指定地址下断点 → 捕获数据 → 恢复执行 → 重复，然后把数据写成 JSONL 供后续分析。
</div>

<h2 id="sec-flow">2. 断点执行流</h2>

<p>调试器使用软件 INT3 断点（0xCC），每条断点的完整生命周期如下：</p>

<pre><code>1. 保存目标地址处的原始字节
2. 写入 0xCC（INT3）
3. 等待 EXCEPTION_BREAKPOINT 事件
4. 将 RIP 回退到原始地址
5. 恢复原始字节
6. 捕获寄存器 + XMM + 请求的内存数据
7. 写入 JSONL 输出
8. 设置 Trap Flag 准备单步
9. 等待 EXCEPTION_SINGLE_STEP 事件
10. 重新插入 0xCC
11. 恢复执行（等待下一个断点或超时）</code></pre>

<p>这个过程完全自动，不需要人工干预。每次断点命中都会输出一行 JSON 到结果文件中。</p>

<div class="tip-box">
<div class="tip-label">x64 Context 验证</div>
脚本在执行前会验证 CONTEXT64 结构体的布局：Rip 在偏移 248 处，Xmm0 在偏移 416 处，VectorRegister 在偏移 768 处，总大小 1232 字节。如果布局不符会直接报错，避免在调用 GetThreadContext/SetThreadContext 时损坏调试器进程自身的内存。
</div>

<h2 id="sec-usage">3. 使用方式</h2>

<h3 id="sec-basic">3.1 基本断点捕获</h3>

<p>对已运行的进程下断点，捕获寄存器参数和内存数据：</p>

<pre><code>python scripts/mini_debug_capture.py capture ^
  --pid 25268 ^
  --bp q3d_73A0E0=Q3D.DLL+0x73A0E0 ^
  --extract freq=xmm1.double0 ^
  --extract y_12p5ghz=complex(r8+0x60) ^
  --max-hits 4 ^
  --timeout-ms 60000 ^
  --out outputs\q3d_73A0E0_extracts.jsonl</code></pre>

<h3 id="sec-wait">3.2 监听模式</h3>

<p>如果目标进程尚未启动，可以等待它出现后再附加：</p>

<pre><code>python scripts/mini_debug_capture.py capture ^
  --wait-process caxtr.exe ^
  --wait-process-timeout-ms 600000 ^
  --wait-module Q3D.DLL ^
  --preset q3d-curve ^
  --max-hits 8 ^
  --timeout-ms 180000 ^
  --out outputs\q3d_curve_extracts.jsonl</code></pre>

<h3 id="sec-multi">3.3 多进程捕获</h3>

<p>当目标进程短生命周期、频繁重启时，使用 multiwait 脚本批量处理：</p>

<pre><code>python scripts/multiwait_capture.py ^
  --profile profiles\target_profile.json ^
  --out-dir outputs</code></pre>

<p>Profile 文件示例：</p>

<pre><code>{
  "name": "target_profile",
  "wait_process": "caxtr.exe",
  "max_attempts": 30,
  "min_hits_to_stop": 100,
  "max_hits": 50000,
  "timeout_ms": 7200000,
  "bp": ["entry=caxtr.exe+0x1234"],
  "extract": ["arg0=addr(rcx)", "arg1=addr(rdx)"]
}</code></pre>

<h3 id="sec-selftest">3.4 自测试</h3>

<p>运行自测试验证调试器能否正常工作：</p>

<pre><code>python scripts/mini_debug_capture.py selftest ^
  --max-hits 3 ^
  --out outputs\mini_debug_selftest.jsonl</code></pre>

<p>自测试会启动一个临时的 Python 子进程，在 <code>lstrlenA</code> 上设置断点，捕获 RCX 寄存器并读取字符串内容。成功意味着核心循环正常工作。</p>

<h2 id="sec-output">4. 输出格式</h2>

<p>每次断点命中输出一行 JSON：</p>

<pre><code>{
  "event": "breakpoint",
  "hit_index": 1,
  "pid": 25268,
  "tid": 20528,
  "breakpoint": "q3d_73A0E0",
  "address": "0x00000000360BA0E0",
  "registers": {"rcx": "0x...", "rsp": "0x..."},
  "xmm": {"xmm1": {"double0": 1.0, "double1": 0.0}},
  "memory": {"rcx_obj": {"ok": true, "addr": "0x...", "qwords": []}}
}</code></pre>

<p>每条捕获记录会同时生成一个 <code>.breakpoints.json</code> 侧边文件，记录 PID、断点地址、原始字节、启用状态和命中次数。</p>

<h2 id="sec-scripts">5. 工具链</h2>

<table>
<tr><th>脚本</th><th>功能</th></tr>
<tr><td><code>mini_debug_capture.py</code></td><td>核心调试器，包含 capture、restore-breakpoints、selftest 三个子命令</td></tr>
<tr><td><code>multiwait_capture.py</code></td><td>多进程捕获调度器，处理短生命周期进程的反复捕获</td></tr>
<tr><td><code>summarize_capture_jsonl.py</code></td><td>从 JSONL 捕获文件生成人类可读的摘要报告</td></tr>
</table>

<div class="footer">源码仓库：<a href="https://github.com/jiuhuiyi365/mini-debug-capture">github.com/jiuhuiyi365/mini-debug-capture</a></div>

</div></div>
