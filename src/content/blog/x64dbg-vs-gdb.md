---
title: "从 GDB 到 x64dbg：Windows 逆向调试指南"
date: 2026-05-27
categories: "安全与逆向"
tags: ["GDB","x64dbg","逆向","调试器"]
id: "x64dbg-vs-gdb"
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

<div class="hero"><h1>从 GDB 到 x64dbg：Windows 逆向调试指南</h1>
<p class="subtitle">GDB 老手转 x64dbg 的核心差异、功能全览与扩展生态</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">GDB</span><span class="tag">x64dbg</span><span class="tag">调试器</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 为什么要了解 x64dbg</a></li>
<li><a href="#s2">2. 核心差异对比</a></li>
<li class="toc-sub"><a href="#s2">架构与定位</a></li>
<li class="toc-sub"><a href="#s3">操作方式差异</a></li>
<li><a href="#s4">3. x64dbg 的窗口布局与工作流</a></li>
<li><a href="#s5">4. 断点系统详解</a></li>
<li><a href="#s6">5. 内置分析与脱壳能力</a></li>
<li><a href="#s7">6. 脚本系统</a></li>
<li class="toc-sub"><a href="#s7">命令脚本</a></li>
<li class="toc-sub"><a href="#s8">JavaScript 脚本</a></li>
<li class="toc-sub"><a href="#s9">C++ 插件开发</a></li>
<li><a href="#s10">7. 实用插件推荐</a></li>
<li><a href="#s11">8. 实战示例</a></li>
<li class="toc-sub"><a href="#s11">自动 Hook 提取函数参数</a></li>
<li class="toc-sub"><a href="#s12">批量断点与日志</a></li>
<li class="toc-sub"><a href="#s13">Trace 记录与回溯</a></li>
<li><a href="#s14">9. GDB 用户速查对照表</a></li>
<li><a href="#s15">10. 总结</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 为什么要了解 x64dbg</h2>
<p>长期使用 GDB 调试 Linux 程序的逆向工程师，转到 Windows 平台时会面临一个核心问题：<strong>GDB 在 Windows 上存在感极弱</strong>。虽然 MinGW 的 GDB 可以调试 PE 文件，但缺少对 Windows 内部机制（PEB、TEB、SEH、Wow64）的原生支持，调试体验大打折扣。</p>
<p>x64dbg 是目前 Windows 平台上最成熟的开源调试器，它的定位和 OllyDbg 类似，但支持 64 位程序，且插件和脚本生态更丰富。掌握 x64dbg 的全部能力，才能在 Windows 逆向中发挥 100% 的效率。</p>

<h2 id="s2">2. 核心差异对比</h2>

<h3>架构与定位</h3>
<table><tr><th>维度</th><th>GDB</th><th>x64dbg</th></tr>
<tr><td>平台</td><td>跨平台（Linux/macOS/Windows）</td><td>仅 Windows</td></tr>
<tr><td>界面</td><td>CLI 为主，需要插件增强</td><td>GUI 为主，开箱即用</td></tr>
<tr><td>目标格式</td><td>ELF 为主，支持 PE/Mach-O</td><td>Windows PE（EXE、DLL）</td></tr>
<tr><td>调试信息</td><td>DWARF、STABS</td><td>PDB</td></tr>
<tr><td>远程调试</td><td>原生支持（gdbserver）</td><td>通过插件或桥接</td></tr>
<tr><td>内核调试</td><td>配合 KGDB</td><td>不支持（用 WinDbg）</td></tr>
<tr><td>反向调试</td><td>record + rr 支持</td><td>Trace 记录回放</td></tr>
<tr><td>开源协议</td><td>GPL</td><td>BSD 3-Clause</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>x64dbg 不是 WinDbg 的替代品。内核调试、驱动分析、崩溃转储分析仍然需要 WinDbg。x64dbg 专注的是<strong>用户态</strong>的 PE 文件调试。</div>

<h3 id="s3">操作方式差异</h3>
<p>GDB 用户需要适应的最大变化：</p>

<p><strong>1. 从命令驱动到 GUI + 命令混合</strong></p>
<p>GDB 的一切操作都通过命令完成：<code>break main</code>、<code>ni</code>、<code>x/10gx $rsp</code>。x64dbg 虽然也有命令行窗口，但大部分操作可以通过鼠标完成：</p>
<ul>
<li>双击反汇编窗口的指令 → 设置断点</li>
<li>右键寄存器值 → 在内存中跟随</li>
<li>右键栈地址 → 在转储中查看</li>
<li>鼠标悬停 → 显示符号解析结果</li>
</ul>

<p><strong>2. 从 ELF 到 PE 的概念映射</strong></p>
<table><tr><th>GDB (Linux/ELF)</th><th>x64dbg (Windows/PE)</th></tr>
<tr><td><code>/proc/pid/maps</code></td><td>内存映射窗口（Memory Map）</td></tr>
<tr><td>ELF 符号表</td><td>PDB + 导入表 + 导出表</td></tr>
<tr><td><code>LD_PRELOAD</code></td><td>DllMain + IAT Hook</td></tr>
<tr><td>段错误 (SIGSEGV)</td><td>访问违规 (0xC0000005)</td></tr>
<tr><td><code>ptrace</code></td><td><code>DebugActiveProcess</code> + <code>WaitForDebugEvent</code></td></tr>
<tr><td>GOT/PLT</td><td>IAT/EAT</td></tr>
<tr><td><code>ld.so</code> 动态链接</td><td>PE Loader + LdrLoadDll</td></tr></table>

<p><strong>3. 寄存器差异</strong></p>
<table><tr><th>GDB 常用寄存器</th><th>x64dbg 对应</th><th>说明</th></tr>
<tr><td><code>$rax</code></td><td>RAX</td><td>通用寄存器，返回值</td></tr>
<tr><td><code>$rsp</code></td><td>RSP</td><td>栈指针</td></tr>
<tr><td><code>$rip</code></td><td>RIP</td><td>指令指针</td></tr>
<tr><td><code>$rdi, $rsi</code></td><td>RDI, RSI</td><td>函数参数1、2（Linux）</td></tr>
<tr><td>-</td><td>RCX, RDX, R8, R9</td><td>函数参数1-4（Windows x64 调用约定）</td></tr>
<tr><td>-</td><td>GS (x64) / FS (x86)</td><td>指向 TEB，Windows 特有</td></tr></table>

<div class="warn-box"><div class="warn-label">WARN</div>Windows x64 使用 <strong>Microsoft x64 调用约定</strong>，前 4 个参数通过 RCX、RDX、R8、R9 传递，和 Linux System V ABI（RDI、RSI、RDX、RCX）完全不同。这是 GDB 用户最容易搞混的地方。</div>

<h2 id="s4">3. x64dbg 的窗口布局与工作流</h2>
<p>x64dbg 启动后默认分为 5 个核心面板：</p>
<ul>
<li><strong>反汇编窗口（CPU）</strong>：左上方，显示当前指令及其上下文，是主要工作区</li>
<li><strong>寄存器窗口</strong>：右上方，实时显示所有寄存器值，支持右键菜单修改</li>
<li><strong>栈窗口</strong>：右下方，显示当前栈帧内容</li>
<li><strong>内存转储窗口（Dump）</strong>：左下方，十六进制内存查看器</li>
<li><strong>日志窗口</strong>：底部，显示调试器日志和脚本输出</li>
</ul>
<p>此外通过菜单可以打开：<strong>内存映射</strong>（Memory Map）、<strong>断点管理器</strong>、<strong>句柄</strong>、<strong>线程</strong>、<strong>模块</strong>、<strong>SSE 寄存器</strong>、<strong>调用栈</strong>等窗口。</p>

<p>GDB 用户建议的调试工作流：</p>
<ol>
<li>拖入 PE 文件或附加（Attach）到进程</li>
<li>在<strong>符号/模块窗口</strong>中确认目标 DLL 已加载</li>
<li>用 <code>bp 函数名</code> 或 <code>bp 地址</code> 在命令行设置断点（和 GDB 风格一致）</li>
<li>运行到断点后，用 GUI 查看反汇编、寄存器、栈、内存</li>
<li>用 <code>sti</code>（步入）、<code>sto</code>（步过）、<code>run</code>（运行）命令控制执行</li>
</ol>

<h2 id="s5">4. 断点系统详解</h2>
<p>x64dbg 的断点系统比 GDB 更细粒度：</p>

<table><tr><th>断点类型</th><th>GDB</th><th>x64dbg</th><th>用途</th></tr>
<tr><td>软件断点</td><td><code>break *addr</code>（INT3）</td><td>双击指令（INT3）</td><td>常规断点</td></tr>
<tr><td>硬件断点</td><td><code>hbreak *addr</code></td><td>右键 → 断点 → 硬件执行</td><td>不可被软件检测</td></tr>
<tr><td>内存断点</td><td><code>watch *(int*)addr</code></td><td>右键内存 → 内存断点</td><td>监控整个内存页</td></tr>
<tr><td>条件断点</td><td><code>break *addr if expr</code></td><td>断点属性 → 条件表达式</td><td>按条件触发</td></tr>
<tr><td>日志断点</td><td>-</td><td>断点属性 → 日志命令</td><td>命中时只记录不暂停</td></tr>
<tr><td>DLL 断点</td><td><code>set stop-on-solib-events 1</code></td><td>选项 → 事件 → DLL 加载/卸载</td><td>监控模块加载</td></tr>
<tr><td>API 断点</td><td><code>break MessageBoxA</code></td><td>bp MessageBoxA（自动下符号）</td><td>拦截 Win32 API</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>x64dbg 的<strong>日志断点</strong>（Log breakpoint）是 GDB 没有的能力。设置后每次命中只在日志窗口输出指定信息而不暂停程序，非常适合批量记录函数调用参数。</div>

<div class="warn-box"><div class="warn-label">加密调试提醒</div>软件断点通过将指令首字节改为 <code>0xCC</code>（INT3）实现，这会<strong>修改内存代码</strong>。调试加密/加壳程序时，修改内存可能导致解密后的代码校验不通过或数据错误。<strong>硬件断点</strong>（CPU 调试寄存器 DR0-DR3）不修改任何内存，仅由 CPU 在指令执行时检查，在加密相关调试中极其有用。</div>

<h2 id="s6">5. 内置分析与脱壳能力</h2>
<p>这是 x64dbg 相比 GDB 最大的优势领域：</p>

<p><strong>自动分析（Analysis）</strong></p>
<p>x64dbg 可以自动分析二进制代码，识别函数边界、参数个数、局部变量、循环结构等。在反汇编窗口中右键 → "分析模块"，或者命令行输入 <code>analr</code> 即可。分析后的反汇编结果会标注函数名、参数、交叉引用等信息。</p>

<p><strong>内置汇编器</strong></p>
<p>在反汇编窗口选中一条指令，按 <code>Space</code>（或右键 → 汇编），可以直接输入汇编指令替换当前指令。GDB 中修改指令需要先用 <code>set *(unsigned int*)addr = 0x90</code> 这样的方式手动写十六进制，x64dbg 则直接支持汇编语法：</p>
<pre><code>; 直接在 x64dbg 中输入
nop
mov eax, 1
ret</code></pre>

<p><strong>Scylla 脱壳工具</strong></p>
<p>x64dbg 内置了 Scylla（通过插件形式），专门用于：</p>
<ul>
<li><strong>IAT 重建</strong>：脱壳后的程序导入表被破坏，Scylla 可以自动修复</li>
<li><strong>Dump 内存</strong>：将进程内存完整 dump 到文件</li>
<li><strong>入口点修复</strong>：还原程序原始入口点</li>
</ul>

<p><strong>Trace 功能</strong></p>
<p>x64dbg 内置两种 Trace 模式：</p>
<ul>
<li><strong>Trace record</strong>：记录哪些指令被执行过（类似 GDB 的 <code>record full</code>），在反汇编窗口中用不同颜色标记</li>
<li><strong>Run trace</strong>：记录完整的执行路径（指令地址、寄存器状态），可以回放查看</li>
</ul>

<h2 id="s7">6. 脚本系统</h2>
<p>这是 GDB 用户最关心的部分。x64dbg 提供三层扩展能力：</p>

<h3>命令脚本</h3>
<p>x64dbg 支持类似 OllyDbg 的命令脚本（<code>.txt</code> 文件），语法简洁，适合批量操作：</p>
<pre><code>// x64dbg 命令脚本示例：批量下断点并记录
var addr
mov addr, 0x00401000

loop:
  cmp addr, 0x00402000
  je done
  bp addr
  log "Set breakpoint at {addr}"
  add addr, 4
  jmp loop

done:
  msg "All breakpoints set!"
  ret</code></pre>

<p>支持的指令包括：<code>mov</code>、<code>add</code>、<code>sub</code>、<code>cmp</code>、<code>je</code>/<code>jne</code>/<code>jmp</code>、<code>bp</code>、<code>bc</code>、<code>log</code>、<code>msg</code>、<code>ret</code> 等。</p>

<h3 id="s8">JavaScript 脚本</h3>
<p>x64dbg 内置 JavaScript 引擎（Duktape），脚本文件后缀 <code>.js</code>，功能比命令脚本强大得多：</p>
<pre><code>// x64dbg JS 脚本：监控 CreateFileA 调用并记录文件名

// 下断点
var addr = "CreateFileA";
bp(addr);

// 注册断点回调
var hitCount = 0;

// 注册命令回调
addCommand("logcall", function() {
    var rcx = regRead("RCX"); // 第一个参数：文件名指针
    var filename = str(rcx);  // 读取字符串
    log("CreateFileA called: " + filename);
    return true;
});

log("Script loaded. Waiting for CreateFileA...");</code></pre>

<p>JS API 主要函数：</p>
<table><tr><th>分类</th><th>函数</th><th>说明</th></tr>
<tr><td>寄存器</td><td><code>regRead(name)</code> / <code>regWrite(name, val)</code></td><td>读写寄存器</td></tr>
<tr><td>内存</td><td><code>memRead(addr, size)</code> / <code>memWrite(addr, data)</code></td><td>读写内存</td></tr>
<tr><td>断点</td><td><code>bp(addr)</code> / <code>bc(addr)</code></td><td>设置/清除断点</td></tr>
<tr><td>调试</td><td><code>run()</code> / <code>sti()</code> / <code>sto()</code></td><td>执行控制</td></tr>
<tr><td>模块</td><td><code>modbase(name)</code> / <code>modsize(name)</code></td><td>获取模块基址/大小</td></tr>
<tr><td>符号</td><td><code>symfromaddr(addr)</code></td><td>地址解析为符号名</td></tr>
<tr><td>输出</td><td><code>log(msg)</code> / <code>msg(text)</code></td><td>日志输出 / 弹窗</td></tr>
<tr><td>回调</td><td><code>addCommand(name, cb)</code> / <code>addCallback(event, cb)</code></td><td>注册命令/事件回调</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>如果你更习惯 Python，可以通过第三方项目 <strong>x64dbg-python</strong>（<code>pip install x64dbg</code>）在外部 Python 进程中通过调试接口控制 x64dbg。不过原生能力上，JavaScript 是官方支持的脚本语言。</div>

<h3 id="s9">C++ 插件开发</h3>
<p>对于需要最高性能和最深度集成的场景，x64dbg 提供 C++ SDK 开发插件。插件以 DLL 形式加载，可以：</p>
<ul>
<li>注册自定义命令（和内置命令一样使用）</li>
<li>拦截所有调试事件（断点、异常、模块加载、线程创建等）</li>
<li>访问完整的调试器 API（内存、寄存器、符号、断点管理）</li>
<li>添加菜单项、工具栏按钮、自定义窗口</li>
</ul>

<p>插件基本框架：</p>
<pre><code>// x64dbg 插件基础模板
#include "pluginsdk\_x64dbg.h"

// 插件入口
bool pluginInit(PLUG_INITSTRUCT* initStruct) {
    // 注册自定义命令
    _plugin_registercommand(
        pluginHandle,
        "MyPlugin",
        [](int argc, char* argv[]) {
            dprintf("MyPlugin command executed!\n");
            return true;
        },
        false
    );
    return true;
}

// 插件卸载
void pluginStop() {
    _plugin_unregistercommand(pluginHandle, "MyPlugin");
}</code></pre>

<p>已有的优质 C++ 插件大多开源，可以学习其源码来掌握插件开发模式。</p>

<h2 id="s10">7. 实用插件推荐</h2>

<table><tr><th>插件</th><th>功能</th><th>类似 GDB 的什么</th></tr>
<tr><td><strong>xAnalyzer</strong></td><td>增强的代码分析，自动识别函数参数、调用约定</td><td>类似 IDA 的分析能力</td></tr>
<tr><td><strong>Scylla</strong></td><td>脱壳、IAT 修复、Dump</td><td>GDB 无对应</td></tr>
<tr><td><strong>OllyDumpEx</strong></td><td>增强的内存 Dump 工具</td><td><code>gcore</code> 的增强版</td></tr>
<tr><td><strong>x64dbg.js</strong></td><td>增强 JS 脚本引擎</td><td>类似 GDB Python</td></tr>
<tr><td><strong>SharpOD</strong></td><td>反反调试，隐藏调试器</td><td>类似 <code>hide</code> 命令</td></tr>
<tr><td><strong>PhantOm</strong></td><td>反反调试（另一种方案）</td><td>-</td></tr>
<tr><td><strong>xAnalyzer32/64</strong></td><td>自动分析、标记参数</td><td>-</td></tr>
<tr><td><strong>Heap-Analyzer</strong></td><td>堆分析可视化</td><td>类似 <code>pwndbg heap</code></td></tr>
<tr><td><strong>x64dbg_TraceExec</strong></td><td>增强的执行追踪</td><td>类似 <code>rr record</code></td></tr></table>

<div class="danger-box"><div class="danger-label">IMPORTANT</div>插件安装后需要在菜单 Plugins 中确认已加载，或重启 x64dbg。部分插件有 32 位和 64 位版本之分，必须和 x64dbg/x32dbg 的版本匹配。</div>

<h2 id="s11">8. 实战示例</h2>

<h3>自动 Hook 提取函数参数</h3>
<p>假设目标程序调用了 <code>MessageBoxA</code>，我们想自动记录每次调用时的文本内容：</p>
<pre><code>// 文件：hook_messagebox.js
// 功能：自动记录 MessageBoxA 的调用参数

// MessageBoxA 签名：
// int MessageBoxA(HWND hWnd, LPCSTR lpText, LPCSTR lpCaption, UINT uType)

// 下断点
bp("MessageBoxA");

// 注册断点命中的回调
addCallback("breakpoint", function() {
    var rip = regRead("RIP");
    var name = symfromaddr(rip);
    
    if (name === "MessageBoxA") {
        var rcx = regRead("RCX");  // hWnd
        var rdx = regRead("RDX");  // lpText
        var r8  = regRead("R8");   // lpCaption
        var r9  = regRead("R9");   // uType
        
        var text = str(rdx);
        var caption = str(r8);
        
        log("=== MessageBoxA Called ===");
        log("Caption: " + caption);
        log("Text: " + text);
        log("Type: " + r9.toString(16));
    }
});</code></pre>

<h3 id="s12">批量断点与日志</h3>
<p>在逆向分析中，经常需要在多个地址设置断点并记录执行路径。用命令脚本可以快速完成：</p>
<pre><code>// 文件：batch_breakpoints.txt
// 功能：批量设置断点，命中时记录并自动继续

// 清除所有现有断点
bpc

// 设置断点
bp 0x00401000
bp 0x00401050
bp 0x004010A0
bp 0x00401100

// 设置日志断点（不暂停，只记录）
bpl 0x00401000, "Reached main entry"
bpl 0x00401050, "Reached init function"
bpl 0x004010A0, "Reached network call"
bpl 0x00401100, "Reached cleanup"

log "All breakpoints configured. Run the program."</code></pre>

<p>对比 GDB 中的等价操作：</p>
<pre><code># GDB 版本
break *0x00401000
commands
  silent
  printf "Reached main entry\n"
  continue
end

break *0x00401050
commands
  silent
  printf "Reached init function\n"
  continue
end</code></pre>

<p>x64dbg 的 <code>bpl</code>（log breakpoint）语法更简洁，不需要逐个写 <code>commands...end</code> 块。</p>

<h3 id="s13">Trace 记录与回溯</h3>
<p>分析一段未知的代码执行路径时，x64dbg 的 Trace 功能非常有用：</p>
<pre><code>// 1. 在感兴趣的位置下断点
bp 0x00401500
run

// 2. 到达断点后，开启 Run Trace
// 菜单：Debug → Trace → Run Trace
// 或命令：
TraceStart
// 运行一段代码
run
// 停止记录
TraceStop

// 3. 查看 Trace 记录
// 菜单：Debug → Trace → Open Run Trace
// 或命令：TraceOver（步过记录）</code></pre>

<p>GDB 中的等价操作需要 rr：</p>
<pre><code># GDB + rr 版本
rr record ./target
rr replay
# 然后用 reverse-step / reverse-continue 回溯</code></pre>

<p>x64dbg 的 Trace 更适合短时间的执行记录分析，不需要额外安装工具。</p>

<h2 id="s14">9. GDB 用户速查对照表</h2>

<table><tr><th>操作</th><th>GDB 命令</th><th>x64dbg 对应</th></tr>
<tr><td>启动调试</td><td><code>gdb ./target</code></td><td>拖入文件或 File → Open</td></tr>
<tr><td>附加进程</td><td><code>gdb -p PID</code></td><td>File → Attach</td></tr>
<tr><td>设置断点</td><td><code>break main</code></td><td><code>bp main</code> 或双击指令</td></tr>
<tr><td>运行</td><td><code>run</code></td><td><code>run</code> 或 F9</td></tr>
<tr><td>单步步入</td><td><code>stepi</code></td><td><code>sti</code> 或 F7</td></tr>
<tr><td>单步步过</td><td><code>nexti</code></td><td><code>sto</code> 或 F8</td></tr>
<tr><td>运行到返回</td><td><code>finish</code></td><td><code>execute til return</code> 或 Ctrl+F9</td></tr>
<tr><td>查看寄存器</td><td><code>info registers</code></td><td>寄存器窗口（实时显示）</td></tr>
<tr><td>查看内存</td><td><code>x/20gx $rsp</code></td><td>内存转储窗口 + Follow in Dump</td></tr>
<tr><td>查看栈</td><td><code>bt</code></td><td>调用栈窗口（Call Stack）</td></tr>
<tr><td>修改内存</td><td><code>set {int}addr = 0x90</code></td><td>右键 Dump → Edit / Space 汇编</td></tr>
<tr><td>查看模块</td><td><code>info sharedlibrary</code></td><td>模块窗口（Modules）</td></tr>
<tr><td>条件断点</td><td><code>break *addr if expr</code></td><td>断点属性 → 条件</td></tr>
<tr><td>硬件断点</td><td><code>hbreak *addr</code></td><td>右键 → Hardware Execute</td></tr>
<tr><td>监视点</td><td><code>watch *(int*)addr</code></td><td>右键内存 → Memory Breakpoint</td></tr>
<tr><td>反汇编</td><td><code>disassemble</code></td><td>反汇编窗口（自动显示）</td></tr>
<tr><td>查看线程</td><td><code>info threads</code></td><td>线程窗口</td></tr>
<tr><td>切换线程</td><td><code>thread N</code></td><td>双击线程窗口中的线程</td></tr></table>

<h2 id="s15">10. 总结</h2>
<p>从 GDB 转到 x64dbg，核心思路的转变是：<strong>从纯命令行驱动，转向 GUI + 命令行混合驱动</strong>。x64dbg 的命令行窗口支持大部分 GDB 风格的操作（<code>bp</code>、<code>run</code>、<code>sti</code>、<code>log</code>），但 GUI 窗口的实时信息展示和右键交互能力才是效率提升的关键。</p>

<p>要发挥 x64dbg 100% 的能力，建议重点掌握以下几点：</p>
<ul>
<li><strong>断点系统的全部类型</strong>：软件、硬件、内存、条件、日志断点，每种都有特定用途</li>
<li><strong>Trace 功能</strong>：用于分析未知代码的执行路径</li>
<li><strong>JavaScript 脚本</strong>：用于自动化重复操作（批量 Hook、参数提取、异常监控）</li>
<li><strong>插件生态</strong>：xAnalyzer 做代码分析、Scylla 做脱壳、SharpOD 做反反调试</li>
<li><strong>Windows 特有机制</strong>：SEH 异常处理、PEB/TEB 结构、Wow64 兼容层</li>
</ul>

<p>GDB 的经验不会浪费——底层的逆向思维（控制流分析、数据流追踪、调用约定理解）是通用的。x64dbg 只是把这些能力用 Windows 的方式重新组织了一遍。</p>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
