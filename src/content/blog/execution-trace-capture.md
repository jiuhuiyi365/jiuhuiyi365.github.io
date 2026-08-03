---
title: "Execution Trace Capture：基于函数白名单的 Windows 执行流采集"
date: 2026-08-03
categories: "安全与逆向"
tags: ["执行流追踪", "Windows", "调试", "函数白名单"]
id: "execution-trace-capture"
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

<div class="hero"><h1>Execution Trace Capture：基于函数白名单的 Windows 执行流采集</h1>
<p class="subtitle">从预检到结构化输出，一套可重复、范围明确的运行时追踪流程</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">执行流追踪</span><span class="tag">Windows</span><span class="tag">函数白名单</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 工具定位</a></li>
<li><a href="#s2">2. 准备函数白名单</a></li>
<li><a href="#s3">3. 运行预检</a></li>
<li><a href="#s4">4. 启动与协调采集</a></li>
<li><a href="#s5">5. 输出文件与读取方式</a></li>
<li><a href="#s6">6. 安全边界与常见问题</a></li>
<li><a href="#s7">7. GitHub 使用指南</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 工具定位</h2>

<p>Execution Trace Capture 是一个面向 Windows x64 进程的函数执行流采集工具。它读取用户提供的 JSON 函数列表，在运行时只追踪列表中的函数，并把调用顺序、线程、直接调用者、运行时地址和可选的虚表证据写入磁盘。</p>

<p>这套工具适合以下场景：</p>

<ul>
<li>只想确认一组候选函数在当前操作中是否真正执行。</li>
<li>需要获得函数首次出现顺序和每个函数的命中次数。</li>
<li>希望把大规模运行时记录保存为 JSONL，交给后续脚本或 AI 分析。</li>
<li>需要用明确的函数白名单约束分析范围，避免沿静态调用图无限扩展。</li>
</ul>

<div class="tip-box"><div class="tip-label">核心原则</div>输入 JSON 就是本轮采集的唯一函数白名单。工具不会根据符号、交叉引用、调用关系或其他静态列表自动增加函数。</div>

<p>默认使用 <code>auto</code> 后端，优先选择低依赖的原生 Windows 调试后端。只有原生后端不适用或确实需要备用能力时，才显式切换到其他后端。</p>

<h2 id="s2">2. 准备函数白名单</h2>

<p>函数列表可以是根数组，也可以放在 <code>key_functions</code>、<code>all_functions</code>、<code>functions</code> 或 <code>whitelist</code> 字段中。每条记录包含地址、名称和可选模块名。</p>

<pre><code>{
  "functions": [
    {
      "addr": "0x123450",
      "name": "function_alpha",
      "module": "module.dll"
    },
    {
      "addr": "0x140012340",
      "name": "function_beta",
      "module": ""
    }
  ]
}</code></pre>

<table>
<tr><th>字段</th><th>说明</th></tr>
<tr><td><code>addr</code></td><td>十六进制字符串、十进制字符串或整数</td></tr>
<tr><td><code>name</code></td><td>非空函数名称，用于输出标识</td></tr>
<tr><td><code>module</code></td><td>填写模块名时按 RVA 解释；留空时按主模块绝对虚拟地址解释</td></tr>
</table>

<div class="warn-box"><div class="warn-label">唯一性要求</div><code>(module, addr)</code> 组合必须唯一。重复地址会导致采集点含义不清，应在预检前清理。</div>

<h2 id="s3">3. 运行预检</h2>

<p>正式采集前先运行预检。它不会启动实际追踪，只检查输入结构、地址策略、模块分布、函数规模和后端选择。</p>

<pre><code>python "&lt;skill-dir&gt;\scripts\trace_capture.py" `
  --target "&lt;target.exe&gt;" `
  --json "&lt;functions.json&gt;" `
  --max-calls 10 `
  --backend auto `
  --preflight</code></pre>

<p>需要重点确认：</p>

<ul>
<li>选中的后端是否符合预期。</li>
<li>JSON 实际使用了哪个数组字段。</li>
<li>总条目数与唯一条目数是否一致。</li>
<li>模块分布和地址解释方式是否正确。</li>
<li>函数规模是否通过安全判断。</li>
</ul>

<p>默认安全上限为 10000 个函数。超过上限时，优先缩小白名单或拆成多个确定性批次。每函数次数限制只会在函数命中后停用对应采集点，不会降低初始配置数量。</p>

<h2 id="s4">4. 启动与协调采集</h2>

<p>推荐通过启动脚本运行。它会隐藏采集进程、把控制输出重定向到文件，并返回采集器 PID 与结果路径。</p>

<pre><code>&amp; "&lt;skill-dir&gt;\scripts\launch_capture.ps1" `
  -Target "&lt;target.exe&gt;" `
  -Json "&lt;functions.json&gt;" `
  -MaxCalls 10</code></pre>

<p>完整流程如下：</p>

<ol>
<li>启动采集器并记录它返回的控制输出路径。</li>
<li>看到 <code>WAITING_FOR_PROCESS</code> 后，再启动目标进程。此时采集点尚未完成配置。</li>
<li>看到 <code>READY_FOR_CASE</code> 后，开始需要追踪的操作。</li>
<li>操作结束后，检查控制输出、错误输出、元数据和执行流文件。</li>
</ol>

<div class="danger-box"><div class="danger-label">不要并行附加</div>目标进程如果已经被另一个用户态调试器占用，应先分离或关闭原调试器。Windows 通常不允许两个用户态调试器同时控制同一进程。</div>

<p>也可以直接运行核心入口：</p>

<pre><code>python "&lt;skill-dir&gt;\scripts\trace_capture.py" `
  --target "&lt;target.exe&gt;" `
  --json "&lt;functions.json&gt;" `
  --max-calls 10 `
  --backend auto `
  --output-dir "&lt;output-dir&gt;"</code></pre>

<table>
<tr><th>参数</th><th>用途</th></tr>
<tr><td><code>--target</code></td><td>目标进程名，包含 <code>.exe</code></td></tr>
<tr><td><code>--json</code></td><td>函数白名单路径</td></tr>
<tr><td><code>--max-calls</code></td><td>每个函数最多记录次数；<code>0</code> 表示不限制</td></tr>
<tr><td><code>--backend</code></td><td><code>auto</code>、<code>native</code> 或 <code>frida</code></td></tr>
<tr><td><code>--wait-timeout</code></td><td>等待目标进程的秒数；<code>0</code> 表示一直等待</td></tr>
<tr><td><code>--accurate-backtrace</code></td><td>为每条记录生成完整回溯，开销较高</td></tr>
</table>

<h2 id="s5">5. 输出文件与读取方式</h2>

<table>
<tr><th>文件</th><th>用途</th></tr>
<tr><td><code>trace_key_*.txt</code></td><td>按首次命中顺序保存唯一的 <code>module!function</code></td></tr>
<tr><td><code>trace_log_*.txt</code></td><td>紧凑的人类可读执行顺序和控制日志</td></tr>
<tr><td><code>trace_flow_*.jsonl</code></td><td>每次函数进入的结构化记录，适合后续分析</td></tr>
<tr><td><code>trace_meta_*.json</code></td><td>运行参数、路径、计数、采集点状态和内存峰值</td></tr>
</table>

<p><code>trace_flow_*.jsonl</code> 是主要分析输入。常用字段包括：</p>

<ul>
<li><code>seq</code>：全局执行顺序。</li>
<li><code>tid</code>：线程 ID。</li>
<li><code>hit</code>：当前函数的命中序号。</li>
<li><code>callee</code>：输入地址、运行时地址、模块、名称和白名单索引。</li>
<li><code>caller</code>：直接调用者名称和返回地址。</li>
<li><code>virtual</code>：可选的运行时虚表关系证据。</li>
<li><code>callsite</code>：可选的调用点字节与直接/间接分类。</li>
<li><code>stack_candidates</code>：原生后端的保守栈候选，不等同于正式栈回溯。</li>
</ul>

<p>采集结束后，应核对已安装、失败、待处理、活动和已卸载的函数数量，以及唯一函数数、总调用数和内存峰值。不要只根据准备阶段的进度数字判断最终成功。</p>

<h2 id="s6">6. 安全边界与常见问题</h2>

<h3>没有任何函数命中</h3>
<p>依次检查目标进程名、模块名、地址基准、JSON 字段、预检结果和 <code>READY_FOR_CASE</code> 状态。不要通过加入白名单外函数来猜测执行路径。</p>

<h3>白名单规模过大</h3>
<p>优先按模块或确定性批次拆分列表并重复运行。只有在明确评估内存成本后，才考虑放宽默认安全上限。</p>

<h3>输出文件增长过快</h3>
<p>为每个函数设置合理的 <code>--max-calls</code>。无限次数会持续记录高频函数，可能迅速增加磁盘和内存压力。</p>

<h3>采集器异常退出</h3>
<p>原生后端异常退出后，先检查断点恢复日志。如果日志仍处于活动状态，应先完成恢复流程，再开始下一轮采集。</p>

<div class="tip-box"><div class="tip-label">数据保留建议</div>完整调用记录保存在磁盘，不要把大型 JSONL 全量复制到编辑器或对话中。分析时优先读取元数据、唯一函数列表和必要的结构化片段。</div>

<h2 id="s7">7. GitHub 使用指南</h2>

<p>独立仓库只保留通用工具使用说明，不包含采集脚本、目标程序、具体函数名、案例地址或执行流数据：</p>

<p><a href="https://github.com/jiuhuiyi365/execution-trace-capture" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">github.com/jiuhuiyi365/execution-trace-capture</a></p>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
