---
title: "UPX 脱壳全流程：从手动到工具"
date: 2026-07-16
categories: "安全与逆向"
tags: ["逆向", "UPX", "脱壳", "IAT重建", "软件保护"]
id: "upx-unpacking-guide"
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

<div class="hero"><h1>UPX 脱壳全流程：从手动到工具</h1>
<p class="subtitle">理解脱壳本质——哪些必须手动，哪些可以交给工具</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">UPX</span><span class="tag">脱壳</span><span class="tag">IAT重建</span><span class="tag">逆向</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-upx">1. UPX 做了什么</a></li>
<li><a href="#sec-manual">2. 纯手动脱壳流程</a>
  <div class="toc-sub">
  <a href="#sec-oep">2.1 寻找 OEP</a>
  <a href="#sec-dump">2.2 内存转储</a>
  <a href="#sec-iat">2.3 IAT 重建——体力活</a>
  </div>
</li>
<li><a href="#sec-tool">3. 哪些是体力活</a></li>
<li><a href="#sec-software">4. 市面常用脱壳工具</a></li>
<li><a href="#sec-example">5. 实战：Scylla 一键修复</a></li>
<li><a href="#sec-summary">6. 总结</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-upx">1. UPX 做了什么</h2>

<p>UPX 对 exe 做了三件事：</p>

<pre><code>原始 exe:
┌────────────────────────────────────┐
│ IMAGE_DOS_HEADER                   │
│ IMAGE_NT_HEADERS                   │
│ Section Table                      │
├────────────────────────────────────┤
│ .text  (原始代码)      ← 明文       │
│ .rdata (包含导入表)    ← 明文       │
│ .data  (全局变量)      ← 明文       │
│ .rsrc  (资源)          ← 明文       │
└────────────────────────────────────┘
           ↓ UPX 加壳后
┌────────────────────────────────────┐
│ UPX0 (未初始化数据)                │
│ UPX1 (压缩后的代码+数据+导入表信息)  │
│ UPX2 (解压 stub)    ← 唯一可执行代码│
└────────────────────────────────────┘</code></pre>

<p>运行时，UPX stub 做两件事：</p>

<ol>
<li><strong>解压代码</strong>——把压缩的原始代码解压回内存</li>
<li><strong>重建 IAT</strong>——调用 <code>LoadLibrary</code> + <code>GetProcAddress</code>，把函数地址填入 IAT 表</li>
</ol>

<div class="warn-box">
<div class="warn-label">关键问题</div>
UPX 在内存中重建的 IAT 是<strong>裸地址数组</strong>，不是 Windows 加载器认的 IMAGE_IMPORT_DESCRIPTOR 结构。所以直接 dump 内存得到的 exe 跑不起来。
</div>

<h2 id="sec-manual">2. 纯手动脱壳流程</h2>

<h3 id="sec-oep">2.1 寻找 OEP</h3>

<p>UPX 的入口通常是这样的：</p>

<pre><code>00401000 &gt; pushad                    ; 保存所有寄存器（ESP 定律的关键）
00401001  mov esi, eip
...
00401050  popad                     ; 恢复寄存器
00401051  jmp 004F12E0              ; ← 跨段跳转到 OEP</code></pre>

<p><strong>ESP 定律法：</strong></p>

<pre><code>1. 在入口处，ESP = 0012FFC0（记下这个值）
2. 设置硬件访问断点：hr 0012FFC0
3. F9 运行
4. 断在 popad 处
5. F8 单步 → 看到 jmp OEP
6. F8 进入 OEP</code></pre>

<p><strong>单步跟踪法：</strong></p>

<pre><code>1. F8 单步走
2. 观察是否出现了跨段跳转（jmp .text 段）
3. 出现 → 跟上 → 到达 OEP</code></pre>

<h3 id="sec-dump">2.2 内存转储</h3>

<p>到达 OEP 后：</p>

<pre><code>用 x64dbg 的 Scylla 插件 → 点击 Dump
或者用 LordPE → 在目标进程右键 → 完整转储
→ 保存为 dumped.exe</code></pre>

<div class="tip-box">
<div class="tip-label">验证 dump 是否正确</div>
用 IDA Pro 或 x64dbg 打开 dumped.exe：<br>
- 如果能反汇编出正常的代码 → dump 对了<br>
- 如果全是乱码 → 还没到 OEP 就 dump 了
</div>

<h3 id="sec-iat">2.3 IAT 重建——体力活</h3>

<p>dumped.exe 有原始代码但没有导入表，需要手动重建。</p>

<p><strong>第一步：定位 IAT 地址</strong></p>

<p>在 OEP 处的内存中，找到一段连续的指针值区域：</p>

<pre><code>00402000  77E20000  ← 这是 MessageBoxA 的地址
00402004  77E10000  ← LoadIconA
00402008  00000000  ← 结束标志</code></pre>

<p>这段区域就是 IAT，记下它的起始 RVA 和大小。</p>

<p><strong>第二步：反查每个地址的函数名</strong></p>

<p>对 IAT 中的每个地址，要找出它属于哪个 DLL、叫什么名字。这个过程在 Windows 中可以通过遍历进程已加载模块的导出表来手动反查，非常繁琐。</p>

<p><strong>第三步：构建导入表结构</strong></p>

<pre><code>// 需要在 dump 文件的空白区写入以下内容：
//
// 1. DLL 名字符串（如 "USER32.dll\0"、"KERNEL32.dll\0"）
// 2. IMAGE_IMPORT_BY_NAME 结构（Hint + 函数名）
// 3. IMAGE_THUNK_DATA 数组（INT 和 IAT）
// 4. IMAGE_IMPORT_DESCRIPTOR 数组
// 5. 修改 PE 头 DataDirectory[1] 指向第 4 步的地址</code></pre>

<p>这是纯手动脱壳中最耗时、最容易出错的一步。</p>

<div class="danger-box">
<div class="danger-label">纯手动 IAT 重建的工作量</div>
假设一个 exe 导入了 3 个 DLL（USER32、KERNEL32、GDI32），共 50 个函数：<br>
- 需要反查 50 个函数地址<br>
- 写入 50 个 IMAGE_IMPORT_BY_NAME 结构<br>
- 写入 50 个 IMAGE_THUNK_DATA（INT）+ 50 个（IAT）<br>
- 写入 3 个 IID + 1 个结束标识<br>
- 写入 3 个 DLL 名字符串<br>
- 修改 PE 头的 3 处偏移<br>
- 重新计算校验和<br><br>
一个字节写错，整个 exe 就废了。
</div>

<h2 id="sec-tool">3. 哪些是体力活</h2>

<table>
<tr><th>步骤</th><th>类型</th><th>原因</th></tr>
<tr>
<td>找 OEP</td>
<td><strong>脑力活 ✅</strong></td>
<td>需要理解 UPX stub 的代码逻辑、知道 ESP 定律的原理、能识别 popad + jmp 跳转模式</td>
</tr>
<tr>
<td>内存 dump</td>
<td><strong>机械操作 ⚙️</strong></td>
<td>点一下按钮的事</td>
</tr>
<tr>
<td>定位 IAT 地址</td>
<td><strong>脑力活 ✅</strong></td>
<td>需要识别内存中的 IAT 区域</td>
</tr>
<tr>
<td>反查函数名</td>
<td><strong>体力活 💪</strong></td>
<td>遍历导出表、逐函数对比地址——机器最适合干这个</td>
</tr>
<tr>
<td>构建导入表结构</td>
<td><strong>体力活 💪</strong></td>
<td>机械地拼结构、算偏移、写字节——没有需要人类判断的地方</td>
</tr>
<tr>
<td>修复 PE 头</td>
<td><strong>体力活 💪</strong></td>
<td>算算偏移、改几个 DWORD</td>
</tr>
</table>

<div class="warn-box">
<div class="warn-label">重要认知</div>
"手动脱壳"在逆向圈的真实的含义是：<strong>手动找到 OEP + 手动 dump，IAT 修复交给工具。</strong><br><br>
重键 IAT 是纯粹的<strong>体力活</strong>——不需要理解算法、不需要做决策、不需要处理异常。就是机械地把 A 数据转换成 B 格式。这类工作恰恰是计算机最擅长的，没必要人去干。
</div>

<h2 id="sec-software">4. 市面常用脱壳工具</h2>

<table>
<tr><th>工具</th><th>用途</th><th>特点</th></tr>
<tr>
<td><strong>upx -d</strong></td>
<td>UPX 专用脱壳</td>
<td>命令行，一键完成。只对标准 UPX 有效，修改过的 UPX 壳无法识别</td>
</tr>
<tr>
<td><strong>Scylla</strong></td>
<td>通用脱壳（IAT 重建）</td>
<td>x64dbg 内置插件，支持 x86/x64，可以脱各种壳</td>
</tr>
<tr>
<td><strong>ImportREC (Import Recovery)</strong></td>
<td>通用脱壳（IAT 重建）</td>
<td>老牌工具，只支持 32 位，功能稳定</td>
</tr>
<tr>
<td><strong>LordPE</strong></td>
<td>PE 编辑 + 内存 dump</td>
<td>查看/修改 PE 结构、dump 进程内存</td>
</tr>
<tr>
<td><strong>OllyDump</strong></td>
<td>内存 dump</td>
<td>OllyDbg 的插件</td>
</tr>
<tr>
<td><strong>UnPacKB</strong></td>
<td>自动脱壳机</td>
<td>针对常见壳自动识别并脱壳</td>
</tr>
</table>

<h2 id="sec-example">5. 实战：Scylla 一键修复</h2>

<p>以 x64dbg + Scylla 为例，完整脱一个 UPX。以下是大致的操作流程。</p>

<h3>环境准备</h3>

<pre><code>x64dbg（下载地址：https://x64dbg.com/）
自带 Scylla 插件</code></pre>

<h3>操作步骤</h3>

<p><strong>第一步：找到 OEP</strong></p>

<pre><code>1. 用 x64dbg 加载 upx.exe
2. 在入口处停下，看到第一行是 pushad
3. 记下 ESP 值（寄存器窗口能看到）
4. 右键 ESP → 在内存中跟随 → 选择硬件访问 → 字
5. F9 运行
6. 断下后 F8 单步 → 看到 "jmp XXX" 跨段指令
7. F8 跟上 → 到达 OEP</code></pre>

<p><strong>第二步：启动 Scylla</strong></p>

<pre><code>1. 在 OEP 处停下
2. 菜单：插件 → Scylla
3. 自动填充了 Imagebase 和进程 PID
4. OEP 栏填入当前 OEP 的 RVA</code></pre>

<p><strong>第三步：Dump</strong></p>

<pre><code>1. 点击 "Dump" 按钮
2. 选择保存路径 → 保存为 dumped.exe</code></pre>

<p><strong>第四步：自动修复 IAT</strong></p>

<pre><code>1. 点击 "IAT Autosearch" → 自动检测 IAT 区域
2. 点击 "Get Imports" → 自动扫描所有导入函数
   绿色 = 正常识别、红色 = 无法识别
3. 如果有红色的，点击 "Trace Level1" 或 "Level2"
4. 点击 "Fix Dump" → 选择 dumped.exe
5. Scylla 生成 dumped_SCY.exe</code></pre>

<p><strong>第五步：验证</strong></p>

<pre><code>1. 用 x64dbg 或 IDA 打开 dumped_SCY.exe
2. 检查字符串窗口 → 能看到原始字符串
3. 检查导入表 → 能看到 USER32.dll、KERNEL32.dll 等
4. 尝试运行 → 功能正常</code></pre>

<div class="tip-box">
<div class="tip-label">Scylla 做了什么</div>
Scylla 在后台做了我们第 3 节说的所有体力活：<br>
1. 遍历 IAT 区域每个地址<br>
2. 对每个地址，调用 GetModuleHandleEx 反查属于哪个 DLL<br>
3. 遍历该 DLL 的导出表，反向查找函数名<br>
4. 在 dumped.exe 的新增区块中写入完整的导入表结构<br>
5. 修改 PE 头的数据目录表<br>
整个过程不到 1 秒。</div>

<h2 id="sec-summary">6. 总结</h2>

<table>
<tr><th></th><th>手动完成</th><th>工具完成</th></tr>
<tr><td>理解 UPX 原理</td><td>✅ 必须自己学</td><td>—</td></tr>
<tr><td>找 OEP（ESP 定律）</td><td>✅ 必须自己操作</td><td>⚠️ 部分工具支持自动 OEP 搜索</td></tr>
<tr><td>验证 OEP 是否正确</td><td>✅ 必须自己判断</td><td>—</td></tr>
<tr><td>内存 dump</td><td>❌ 没必要手动</td><td>✅ LordPE / x64dbg</td></tr>
<tr><td>反查函数名</td><td>❌ 没必要手动</td><td>✅ Scylla / ImportREC</td></tr>
<tr><td>构建导入表结构</td><td>❌ 没必要手动</td><td>✅ Scylla / ImportREC</td></tr>
<tr><td>修改 PE 头</td><td>❌ 没必要手动</td><td>✅ 工具自动完成</td></tr>
</table>

<p><strong>记住一点：</strong>手动脱壳的"手动"是指手动找到 OEP。IAT 重建是体力活——你理解它的原理，但不要让自已去做它。</p>

<div class="footer">参考工具：x64dbg · Scylla · ImportREC · LordPE · UPX</div>

</div></div>
