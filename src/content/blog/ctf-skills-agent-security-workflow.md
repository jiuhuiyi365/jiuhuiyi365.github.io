---
title: "ctf-skills 深度解析：让 AI 获得可执行的 CTF 安全工作流"
date: 2026-07-31
categories: "安全与逆向"
tags: ["Agent Skills", "CTF", "AI安全", "逆向工程", "安全自动化"]
id: "ctf-skills-agent-security-workflow"
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

<div class="hero"><h1>ctf-skills 深度解析：让 AI 获得可执行的 CTF 安全工作流</h1>
<p class="subtitle">从 Agent Skills 机制、11 个专业模块到逆向分析与流量取证的实际能力边界</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">Agent Skills</span><span class="tag">CTF</span><span class="tag">AI安全</span><span class="tag">安全自动化</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 项目定位：它究竟是什么</a></li>
<li><a href="#s2">2. Agent Skills 的运行机制</a></li>
<li><a href="#s3">3. ctf-skills 的整体架构</a></li>
<li><a href="#s4">4. 11 个 Skill 的能力全景</a></li>
<li><a href="#s5">5. 它能让 AI 实际完成什么</a></li>
<li><a href="#s6">6. 逆向与 Misc 模块深度拆解</a></li>
<li><a href="#s7">7. 看雪文章案例如何理解</a></li>
<li><a href="#s8">8. 安装、环境与调用方式</a></li>
<li><a href="#s9">9. 能力边界与安全风险</a></li>
<li><a href="#s10">10. 适用人群与实践建议</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 项目定位：它究竟是什么</h2>

<p><a href="https://github.com/ljagiello/ctf-skills" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">ljagiello/ctf-skills</a> 是一组遵循 Agent Skills 开放规范的 CTF 专业能力包，覆盖 Web、Pwn、密码学、逆向、取证、OSINT、恶意代码、AI/ML 安全和 Misc 等方向。它的核心价值不是向模型灌输几个知识点，而是把<strong>题目分诊、技术选择、工具调用、脚本编写、结果验证和 Writeup 输出</strong>组织成可复用的工程流程。</p>

<p>看雪文章 <a href="https://bbs.kanxue.com/thread-292063.htm" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">《Agent Skills：让 AI 拥有安全攻防知识库》</a> 将它概括为“用 Markdown 写成的结构化安全知识库”。这个表述便于理解，但从工程视角看还可以更准确：</p>

<blockquote><code>ctf-skills</code> 更接近一个版本化的 CTF 专家操作手册与任务路由系统，而不是经过向量化检索的传统知识库，也不是重新训练后的安全大模型。</blockquote>

<p>安装 Skill 不会修改模型参数。它改变的是 Agent 的<strong>上下文、操作规程与可调用资源</strong>：模型仍负责推理，Skill 负责告诉模型何时采用哪套流程，工具负责真正读取文件、运行命令和生成结果。</p>

<table>
  <tr><th>组件</th><th>负责什么</th><th>在 ctf-skills 中的对应物</th></tr>
  <tr><td>大模型</td><td>理解题意、形成假设、综合证据</td><td>Claude Code 或其他兼容 Agent 的基础模型</td></tr>
  <tr><td>Skill</td><td>规定专业工作流、触发条件和决策边界</td><td><code>solve-challenge/SKILL.md</code>、<code>ctf-reverse/SKILL.md</code> 等</td></tr>
  <tr><td>Reference</td><td>按需提供深入技术资料和代码模板</td><td><code>anti-analysis.md</code>、<code>pyjails.md</code> 等</td></tr>
  <tr><td>工具</td><td>对真实文件和服务执行操作</td><td>GDB、Ghidra、Frida、angr、tshark、Volatility、Z3 等</td></tr>
  <tr><td>RAG</td><td>从外部文档集合中检索相关片段</td><td>项目本身并未要求向量数据库；其按文件加载机制与 RAG 目标相似，但实现不同</td></tr>
  <tr><td>MCP</td><td>为 Agent 提供外部系统的标准化工具接口</td><td>不是该仓库的核心组成，但可与 Skills 组合使用</td></tr>
</table>

<div class="tip-box">
  <div class="tip-label">CORE IDEA</div>
  Skill 解决的是“模型知道下一步该怎么做”的问题；工具解决的是“模型能不能真的做”的问题。只有 Skill 而没有文件访问、调试器、解释器或网络权限，AI 仍然只能给出建议。
</div>

<h2 id="s2">2. Agent Skills 的运行机制</h2>

<p>根据 <a href="https://agentskills.io/specification" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">Agent Skills 官方规范</a>，一个 Skill 至少是一个包含 <code>SKILL.md</code> 的目录。文件头部使用 YAML 描述名称、触发条件、兼容性和允许使用的工具，正文则保存具体操作流程。复杂能力还可以附带脚本、参考资料和模板。</p>

<pre><code>ctf-reverse/
├── SKILL.md
├── anti-analysis.md
├── patterns.md
├── tools-dynamic.md
├── languages-compiled.md
└── platforms.md</code></pre>

<h3>2.1 三阶段渐进式加载</h3>

<ol>
  <li><strong>Discovery：</strong>Agent 启动时只读取各 Skill 的 <code>name</code> 和 <code>description</code>，用于低成本发现能力。</li>
  <li><strong>Activation：</strong>任务命中描述后，Agent 才完整读取对应的 <code>SKILL.md</code>。</li>
  <li><strong>Execution：</strong>只有遇到具体技术点时，才继续读取相关 reference 或执行配套脚本。</li>
</ol>

<p>这套机制的关键是<strong>控制上下文成本</strong>。如果一次性把 Web、Pwn、密码学和逆向的全部资料塞进上下文，不但消耗 Token，还容易产生概念干扰。渐进式加载让 Agent 先知道“有哪些专家”，再根据题目只请相关专家进入工作区。</p>

<h3>2.2 description 是语义路由规则</h3>

<p><code>description</code> 不只是说明文字，它同时承担触发器角色。例如 <code>ctf-reverse</code> 明确说明：当主要任务是理解编译、混淆、加壳或虚拟化目标时使用；如果漏洞已经理解、剩余任务是构造 ROP 或堆利用，则应切换到 <code>ctf-pwn</code>。</p>

<p>这种正向条件加排除条件的写法，可以降低错误路由概率。仓库中的多个 Skill 还设置了 <code>When to Pivot</code>，告诉 Agent 在证据发生变化时应切换到哪个专业模块。</p>

<h2 id="s3">3. ctf-skills 的整体架构</h2>

<p>整个仓库可以理解为四层：</p>

<pre><code>题目、附件、URL 或远程服务
            │
            ▼
solve-challenge：侦察、识别文件类型、确定主类别
            │
            ▼
ctf-web / pwn / crypto / reverse / forensics / ...
            │
            ▼
按需加载 reference + 调用本地安全工具 + 编写求解脚本
            │
            ▼
验证 Flag → ctf-writeup 生成可复现报告</code></pre>

<h3>3.1 总路由器 solve-challenge</h3>

<p><code>solve-challenge</code> 是入口 Skill，而不是最深层的技术文档。它首先执行文件枚举、格式识别、字符串检查、二进制保护检查、URL 探测和服务交互，再根据扩展名、题目关键词和服务行为进行分类。</p>

<p>例如：</p>

<ul>
  <li><code>.pcap</code>、<code>.raw</code>、<code>.E01</code> 通常路由到取证；</li>
  <li><code>.exe</code>、<code>.dll</code>、<code>.so</code> 先判断是逆向还是 Pwn；</li>
  <li><code>.apk</code>、<code>.wasm</code>、<code>.pyc</code> 通常进入逆向；</li>
  <li>含 RSA、AES、LWE、GCM 等特征的题目进入密码学；</li>
  <li>受限 Shell、编码谜题、沙箱和混合逻辑题进入 Misc。</li>
</ul>

<h3>3.2 专项 Skill 与跨类别 Pivot</h3>

<p>真实 CTF 经常不是单一类别。一个 PCAP 可能先由 <code>ctf-forensics</code> 重组会话，再由 <code>ctf-crypto</code> 解密；一个 APK 可能先用 <code>ctf-reverse</code> 找到 JNI 校验逻辑，再切换 <code>ctf-pwn</code> 构造利用。路由器的作用不是一次分类永远不变，而是维护当前最合理的分析方向。</p>

<h3>3.3 Writeup 作为结果闭环</h3>

<p><code>ctf-writeup</code> 会收集题目元数据、求解脚本、命令输出、关键转折和 Flag 证据，生成标准化 <code>writeup.md</code>。它强调从题目数据到最终 Flag 的完整脚本和可复现步骤，使 AI 的输出从“聊天答案”转化为可交接、可审核的工程文档。</p>

<h2 id="s4">4. 11 个 Skill 的能力全景</h2>

<table>
  <tr><th>Skill</th><th>核心能力</th><th>AI 可以承担的任务</th></tr>
  <tr><td><code>solve-challenge</code></td><td>题目侦察与类别路由</td><td>识别文件和服务、确定主方向、跨类别切换、验证 Flag 候选</td></tr>
  <tr><td><code>ctf-web</code></td><td>Web 漏洞与业务逻辑</td><td>审查请求和源码、构造测试载荷、分析 SQLi、SSTI、SSRF、JWT、XXE 等</td></tr>
  <tr><td><code>ctf-pwn</code></td><td>二进制漏洞利用</td><td>识别保护、定位内存破坏原语、设计 ROP/堆利用、编写 pwntools 脚本</td></tr>
  <tr><td><code>ctf-crypto</code></td><td>密码算法与数学攻击</td><td>识别 RSA/AES/ECC/PRNG 弱点，建立方程、调用 SageMath/Z3、验证密钥与明文</td></tr>
  <tr><td><code>ctf-reverse</code></td><td>程序语义恢复</td><td>静态和动态分析、去混淆、虚拟机分析、跨架构仿真、自动化提取校验逻辑</td></tr>
  <tr><td><code>ctf-forensics</code></td><td>磁盘、内存、网络与隐写取证</td><td>恢复文件、重组流量、分析系统痕迹、解码 USB/音频/图像隐写</td></tr>
  <tr><td><code>ctf-osint</code></td><td>公开信息调查</td><td>地理定位、用户名枚举、DNS/WHOIS 调查、公开记录关联分析</td></tr>
  <tr><td><code>ctf-malware</code></td><td>恶意代码与 C2 分析</td><td>脚本去混淆、PE/.NET 研判、配置提取、C2 协议还原、YARA 规则草拟</td></tr>
  <tr><td><code>ctf-misc</code></td><td>编码、沙箱、RF/SDR 与混合题</td><td>多层编码识别、Pyjail/Bash jail 分析、Z3 约束、QR/音频/奇异语言处理</td></tr>
  <tr><td><code>ctf-ai-ml</code></td><td>机器学习与 LLM 安全</td><td>分析对抗样本、模型提取、成员推断、数据投毒、Prompt 注入与模型后门</td></tr>
  <tr><td><code>ctf-writeup</code></td><td>标准化成果输出</td><td>整理证据、脚本、复现步骤、失败路径和经验总结</td></tr>
</table>

<p>表中的“AI 可以承担”有一个前提：Agent 必须拥有相应工具和数据访问权限。例如，<code>ctf-forensics</code> 知道如何使用 tshark，并不等于系统已经安装 tshark；<code>ctf-reverse</code> 知道 Frida 的 Hook 方法，也不等于目标进程可以被附加。</p>

<h2 id="s5">5. 它能让 AI 实际完成什么</h2>

<h3>5.1 从“回答知识”升级到“执行流程”</h3>

<p>普通模型通常可以解释 AES-CBC、ROP 或控制流平坦化，但面对附件时容易停留在概念层。ctf-skills 为 Agent 提供了下一步动作序列，因此 AI 可以围绕真实工件形成闭环：</p>

<ol>
  <li>读取题目目录和描述，识别所有附件及格式；</li>
  <li>执行低成本侦察，收集字符串、文件头、保护信息、网络端点等证据；</li>
  <li>根据证据选择专项 Skill，并加载最相关的 reference；</li>
  <li>调用调试器、反编译器、抓包工具、求解器或密码学库；</li>
  <li>把重复分析步骤编码为 Python、Bash、Frida 或 pwntools 脚本；</li>
  <li>对候选结果进行唯一性、格式和运行时验证；</li>
  <li>生成能够被队友复现的 Writeup。</li>
</ol>

<h3>5.2 对逆向工作的直接价值</h3>

<p>以 Windows EXE 为例，Skill 可以指导 Agent 先完成 PE/架构识别、字符串和导入表初筛，再根据目标选择 x64dbg、Ghidra、Frida、angr 或 Unicorn。遇到比较函数时可自动生成断点和 Hook 脚本；遇到自定义 VM 时可整理 opcode、建立状态转移模型，必要时生成解释器或 Z3 约束。</p>

<p>这与专业逆向流程并不冲突。更合理的分工是：</p>

<table>
  <tr><th>阶段</th><th>人工负责</th><th>AI + Skill 负责</th></tr>
  <tr><td>执行流确认</td><td>选择案例、控制输入、判断证据有效性</td><td>整理 Trace、函数命中、地址与模块关系</td></tr>
  <tr><td>代码分析</td><td>确定关键语义与分析边界</td><td>批量解释指令、识别模式、生成验证假设</td></tr>
  <tr><td>数据采集</td><td>决定抓什么以及为什么抓</td><td>生成断点、Hook、内存解析与日志脚本</td></tr>
  <tr><td>算法复现</td><td>确认业务语义和最终正确性</td><td>实现阶段性模拟器、差分测试和回归样本</td></tr>
</table>

<div class="tip-box">
  <div class="tip-label">PROFESSIONAL USE</div>
  ctf-skills 最适合把已经成熟的分析套路自动化。它能显著减少查命令、找工具、写模板代码的时间，但不能替代对执行证据、业务语义和误报的专业判断。
</div>

<h2 id="s6">6. 逆向与 Misc 模块深度拆解</h2>

<h3>6.1 ctf-reverse：不是一本命令速查表</h3>

<p><code>ctf-reverse</code> 的主文件负责路线选择，其 supporting references 再分别覆盖静态工具、动态工具、仿真、反分析、语言与平台、CTF 模式和高级去混淆。仓库当前列出的技术包括：</p>

<ul>
  <li>GDB、Ghidra、radare2、IDA、Binary Ninja 等静态分析环境；</li>
  <li>Frida、x64dbg、LLDB、angr、Qiling、Triton、Unicorn 等动态、符号执行与仿真工具；</li>
  <li>VMProtect/Themida、自定义 VM、MBA、控制流平坦化、自修改代码和反调试；</li>
  <li>Android DEX/JNI、Flutter/Dart AOT、WASM、.NET、Go、Rust、Swift、Kotlin、Haskell；</li>
  <li>C++ RTTI/vtable 恢复、跨架构固件、游戏引擎和硬件相关逆向。</li>
</ul>

<p>它还规定了一条重要策略：先尝试低成本信息泄露和动态观测，再进入高成本完整逆向。例如先执行 <code>strings</code>、<code>ltrace</code>、<code>strace</code> 或 Hook <code>strcmp/memcmp</code>，只有这些路径不能闭合时才建立完整控制流或符号执行模型。</p>

<h3>6.2 ctf-misc：处理无法被传统类别覆盖的问题</h3>

<p><code>ctf-misc</code> 是真正的边缘问题路由器，当前目录通过多份 reference 覆盖 Pyjail、Bash jail、多层编码、DNS、RF/SDR、提权、CTFd API、游戏与自定义 VM。它可以把以下问题转化为可执行任务：</p>

<ul>
  <li>根据字符集和文件头识别 Base 系列、Hex、Unicode 与特殊编码；</li>
  <li>把位运算网络、产品密钥校验或逻辑门转换为 Z3 BitVec/SAT 约束；</li>
  <li>处理 QR 拼图、音频频谱、IQ 信号与 USB HID 数据；</li>
  <li>识别受限解释器的可用对象、属性链与输入约束；</li>
  <li>通过 CTFd API 获取题目、附件、提示、积分榜并提交 Flag。</li>
</ul>

<p>它被设计为 fallback，而不是默认入口。如果题目本质上是密码学、真实二进制利用或文件恢复，Skill 会要求切换到更专业的模块。这种边界意识比单纯堆积 Payload 更重要。</p>

<h2 id="s7">7. 看雪文章案例如何理解</h2>

<p>看雪原文使用冰蝎 v3 流量分析题展示了一个完整闭环：先从 PCAP 中筛选 HTTP POST 请求，根据参数、请求头和密钥协商特征识别流量类型，再确定编码与 AES 参数，最后生成脚本批量解密请求和响应并提取 Flag。</p>

<p>这个案例证明的不是“Skill 自己破解了冰蝎”，而是以下能力组合有效：</p>

<ol>
  <li><strong>模式索引：</strong>从流量特征联想到已知 Webshell 协议；</li>
  <li><strong>程序化取证：</strong>使用 tshark 提取字段，而不是人工逐包点击；</li>
  <li><strong>参数化解密：</strong>将密钥、IV、Padding 和数据方向写入脚本；</li>
  <li><strong>结构验证：</strong>检查解密结果能否解析为预期 JSON，并验证命令与响应的对应关系；</li>
  <li><strong>结果提取：</strong>在完整会话中搜索并验证 Flag。</li>
</ol>

<p>原文给出的“传统方式与 AI 辅助耗时对比”应视为案例估算，而不是严格基准测试。实际效率取决于样本是否命中知识库、工具是否齐全、流量是否完整、协议是否被修改，以及模型能否及时发现错误假设。</p>

<div class="warn-box">
  <div class="warn-label">EVIDENCE</div>
  AI 生成的解密脚本能够运行，不等于协议判断一定正确。专业分析仍应通过已知明文、Padding、消息结构、双向会话和多个数据包进行交叉验证。
</div>

<h2 id="s8">8. 安装、环境与调用方式</h2>

<h3>8.1 安装 Skill</h3>

<p>仓库 README 提供的安装命令是：</p>

<pre><code>npx skills add ljagiello/ctf-skills</code></pre>

<p>安装后，兼容 Agent Skills 规范的客户端可以根据任务描述自动加载 Skill，也可以直接调用总路由：</p>

<pre><code>/solve-challenge &lt;challenge description or URL&gt;</code></pre>

<p>也可以只安装或引用单个目录，例如 <code>ljagiello/ctf-skills/ctf-reverse</code>，减少无关能力和上下文入口。</p>

<h3>8.2 安装工具链</h3>

<p>仓库包含统一的 Bash 安装脚本，可按 Python、apt、Homebrew、Ruby Gem、Go 或全部模式安装，并支持 <code>--dry-run</code> 与 <code>--verify</code>：</p>

<pre><code>bash scripts/install_ctf_tools.sh --dry-run all
bash scripts/install_ctf_tools.sh all
bash scripts/install_ctf_tools.sh --verify</code></pre>

<p>它会准备 pwntools、PyCryptodome、Z3、angr、Frida、Qiling、Volatility、YARA、Capstone、Unicorn 等 Python 包，以及 GDB、radare2、binwalk、tshark、Sleuth Kit、apktool、QEMU 等系统工具。</p>

<h3>8.3 Windows 用户的现实选择</h3>

<p>该项目的自动安装器主要面向 Bash + apt 或 Homebrew，原生 Windows 不是其完整覆盖目标。Windows 用户更适合采用以下结构：</p>

<ul>
  <li>使用 WSL2 Ubuntu/Kali 承载通用 CTF 工具和 Python 依赖；</li>
  <li>在 Windows 主机保留 x64dbg、IDA、dnSpy、Wireshark 等原生 GUI 工具；</li>
  <li>通过共享目录传递样本，但不要把未知二进制直接放入重要工程目录运行；</li>
  <li>比赛前使用 <code>--dry-run</code> 审核依赖，再在隔离环境中安装；</li>
  <li>对具体题目按需安装工具，避免把整套攻击面长期暴露在日常系统中。</li>
</ul>

<h2 id="s9">9. 能力边界与安全风险</h2>

<h3>9.1 它不能保证什么</h3>

<ul>
  <li><strong>不能保证解题成功：</strong>全新攻击面、私有协议和多阶段未知逻辑仍可能超出 reference 覆盖范围。</li>
  <li><strong>不能保证结论正确：</strong>模型可能选择错误类别、误用 Payload、忽略环境差异或把诱饵字符串当作 Flag。</li>
  <li><strong>不能替代工具：</strong>没有调试权限、抓包数据、依赖库或目标运行环境时，Skill 无法凭空生成证据。</li>
  <li><strong>不能恢复不存在的信息：</strong>符号被抹除、数据被截断或关键输入缺失时，AI 仍需要补充动态证据。</li>
  <li><strong>不能代替授权：</strong>Skill 中包含攻防技术，只应在 CTF、靶场、实验室或明确授权范围内使用。</li>
</ul>

<h3>9.2 第三方 Skill 本身也是供应链输入</h3>

<p>Skill 会向 Agent 注入高优先级操作流程，并可能允许执行 Bash、读写文件、访问网络和安装依赖。因此，安装第三方 Skill 前应像审计脚本或 CI 配置一样审计它：</p>

<ol>
  <li>检查 <code>SKILL.md</code> 的 <code>allowed-tools</code> 和兼容性声明；</li>
  <li>审查安装脚本、依赖版本、外部下载地址和提权操作；</li>
  <li>优先固定可信 Commit，而不是长期无条件跟随最新分支；</li>
  <li>在容器、虚拟机或独立 CTF 用户账户中运行；</li>
  <li>不要向 Agent 暴露 GitHub Token、云密钥、浏览器 Cookie 等无关凭据；</li>
  <li>把题目网页、附件和样本视为不可信输入，防范 Prompt Injection 与恶意构建脚本。</li>
</ol>

<div class="danger-box">
  <div class="danger-label">IMPORTANT</div>
  “自动加载 Skill”不等于“自动授权所有操作”。安全 Agent 应继续执行最小权限、作用域确认、命令审计、样本隔离和结果复核。
</div>

<h2 id="s10">10. 适用人群与实践建议</h2>

<h3>10.1 适合谁</h3>

<ul>
  <li>需要快速建立 CTF 多方向知识框架的学习者；</li>
  <li>希望把常用命令、脚本模板和检查清单标准化的战队；</li>
  <li>需要让 AI 协助处理附件、生成求解脚本和整理 Writeup 的研究人员；</li>
  <li>希望把成熟逆向、取证或密码学流程沉淀为可复用组织资产的安全团队。</li>
</ul>

<h3>10.2 推荐使用顺序</h3>

<ol>
  <li>先阅读仓库 README 和目标类别的 <code>SKILL.md</code>，理解其触发条件与 Pivot 规则；</li>
  <li>只安装当前需要的 Skill，确认 Agent 实际拥有的工具和权限；</li>
  <li>选择一道已有公开 Writeup 的题目进行盲测；</li>
  <li>记录 AI 的分类、假设、命令、失败路径和最终证据；</li>
  <li>将结果与官方解法对照，修正本地 Skill 或补充团队专属 reference；</li>
  <li>最后再用于限时比赛或更复杂的真实安全研究。</li>
</ol>

<p>从长期价值看，ctf-skills 最值得借鉴的不是其中某一条 Payload，而是它将专家经验拆成了<strong>可触发、可路由、可执行、可验证、可交接</strong>的结构。AI 因此不再只是回答“这是什么技术”，而是能够围绕真实证据推进一套受约束的专业工作流。</p>

<h3>参考资料</h3>

<ul>
  <li><a href="https://github.com/ljagiello/ctf-skills" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">ctf-skills GitHub 仓库</a></li>
  <li><a href="https://bbs.kanxue.com/thread-292063.htm" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">看雪：Agent Skills，让 AI 拥有安全攻防知识库</a></li>
  <li><a href="https://agentskills.io/" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">Agent Skills 官方文档</a></li>
  <li><a href="https://agentskills.io/specification" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">Agent Skills 格式规范</a></li>
</ul>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
