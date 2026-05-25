---
title: "CS2 外挂技术架构分析"
date: 2026-05-25
categories: "安全与逆向"
tags: ["逆向","游戏安全","CS2"]
id: "cs2-cheat-analysis"
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

<div class="hero"><h1>CS2 外挂技术架构分析</h1>
<p class="subtitle">矩阵透视（ESP）与自瞄（Aimbot）的实现原理</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">进程注入</span><span class="tag">游戏安全</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>
<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">整体架构概述</a></li>
<li><a href="#s2">外部读写模型（External Cheat）</a></li>
<li><a href="#s3">内存偏移系统</a></li>
<li><a href="#s4">实体枚举与去重</a></li>
<li><a href="#s5">骨骼系统（Skeleton）</a></li>
<li><a href="#s6">矩阵透视（View Matrix ESP）</a></li>
<li><a href="#s7">透明叠加窗口（Overlay）</a></li>
<li><a href="#s8">自瞄系统（Aimbot）</a></li>
<li><a href="#s9">多线程与对局状态追踪</a></li>
<li><a href="#s10">检测面分析</a></li>
</ul></div>
<div class="article-content">

<h2 id="s1">1. 整体架构概述</h2>
<p>该外挂是一个<strong>外部（External）型</strong> CS2 作弊工具，运行在独立进程中，通过 Windows API 读写游戏内存，实现<strong>矩阵透视（ESP/Wallhack）</strong>和<strong>自瞄（Aimbot）</strong>两大功能。整个系统由 6 个核心模块组成：</p>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="a1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
  </defs>
  <text x="360" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">系统架构总览</text>
  <!-- Main process box -->
  <rect x="200" y="36" width="320" height="50" rx="8" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="2"/>
  <text x="360" y="66" text-anchor="middle" fill="#fff" font-size="13" font-weight="600" font-family="sans-serif">Cheat 主控模块（主循环 + 线程管理）</text>
  <!-- Module boxes -->
  <rect x="20" y="120" width="150" height="56" rx="6" fill="#151720" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="95" y="144" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="600">内存读写层</text>
  <text x="95" y="162" text-anchor="middle" fill="#555" font-size="9">ReadProcessMemory</text>

  <rect x="190" y="120" width="150" height="56" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="265" y="144" text-anchor="middle" fill="#6c9eeb" font-size="11" font-weight="600">实体枚举</text>
  <text x="265" y="162" text-anchor="middle" fill="#555" font-size="9">Entity List 遍历</text>

  <rect x="370" y="120" width="150" height="56" rx="6" fill="#151720" stroke="#34d399" stroke-width="1.5"/>
  <text x="445" y="144" text-anchor="middle" fill="#34d399" font-size="11" font-weight="600">骨骼匹配</text>
  <text x="445" y="162" text-anchor="middle" fill="#555" font-size="9">Skeleton Address Match</text>

  <rect x="550" y="120" width="150" height="56" rx="6" fill="#151720" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="625" y="144" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="600">视图矩阵</text>
  <text x="625" y="162" text-anchor="middle" fill="#555" font-size="9">4×4 View Matrix</text>

  <!-- Bottom modules -->
  <rect x="140" y="216" width="180" height="56" rx="6" fill="#151720" stroke="#f87171" stroke-width="1.5"/>
  <text x="230" y="240" text-anchor="middle" fill="#f87171" font-size="11" font-weight="600">透明叠加窗口</text>
  <text x="230" y="258" text-anchor="middle" fill="#555" font-size="9">Direct2D Overlay</text>

  <rect x="400" y="216" width="180" height="56" rx="6" fill="#151720" stroke="#f87171" stroke-width="1.5"/>
  <text x="490" y="240" text-anchor="middle" fill="#f87171" font-size="11" font-weight="600">自瞄模块</text>
  <text x="490" y="258" text-anchor="middle" fill="#555" font-size="9">角度计算 + 内存写入</text>

  <!-- Arrows down from main -->
  <line x1="240" y1="86" x2="95" y2="120" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#a1)"/>
  <line x1="310" y1="86" x2="265" y2="120" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#a1)"/>
  <line x1="410" y1="86" x2="445" y2="120" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#a1)"/>
  <line x1="480" y1="86" x2="625" y2="120" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#a1)"/>
  <!-- Arrows from modules to bottom -->
  <line x1="265" y1="176" x2="230" y2="216" stroke="#6c9eeb" stroke-width="1" marker-end="url(#a1)"/>
  <line x1="445" y1="176" x2="490" y2="216" stroke="#6c9eeb" stroke-width="1" marker-end="url(#a1)"/>
  <line x1="625" y1="176" x2="490" y2="216" stroke="#6c9eeb" stroke-width="1" marker-end="url(#a1)"/>
  <line x1="625" y1="176" x2="230" y2="216" stroke="#6c9eeb" stroke-width="1" marker-end="url(#a1)"/>
  <!-- External label -->
  <rect x="20" y="290" width="680" height="24" rx="4" fill="#0f1117" stroke="#252837" stroke-width="1"/>
  <text x="360" y="307" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">所有模块均在外部进程中运行，通过 ReadProcessMemory / WriteProcessMemory 与 cs2.exe 交互</text>
</svg>
</div>

<h2 id="s2">2. 外部读写模型（External Cheat）</h2>
<p>该外挂采用<strong>外部模式</strong>——作弊程序以独立进程运行，与 cs2.exe 无代码注入关系。所有数据交互通过 Windows 系统调用完成：</p>

<h3>核心 API 调用链</h3>
<table><tr><th>API</th><th>用途</th><th>调用时机</th></tr>
<tr><td><code>CreateToolhelp32Snapshot</code></td><td>遍历系统进程列表，按名称查找 cs2.exe 的 PID</td><td>启动时</td></tr>
<tr><td><code>OpenProcess</code></td><td>以 <code>VM_READ | VM_WRITE | QUERY_INFORMATION</code> 权限打开目标进程</td><td>启动时</td></tr>
<tr><td><code>EnumProcessModulesEx</code></td><td>枚举目标进程加载的所有 DLL 模块（client.dll, server.dll）</td><td>初始化</td></tr>
<tr><td><code>GetModuleFileNameExW</code></td><td>获取模块的完整路径，用于按名称匹配基地址</td><td>初始化</td></tr>
<tr><td><code>ReadProcessMemory</code></td><td>从目标进程的虚拟地址空间读取数据</td><td>每帧（60Hz）</td></tr>
<tr><td><code>WriteProcessMemory</code></td><td>向目标进程写入修改后的数据（角度值）</td><td>自瞄触发时</td></tr>
<tr><td><code>VirtualProtectEx</code></td><td>修改目标内存页的保护属性（临时改为 PAGE_READWRITE）</td><td>自瞄写入前</td></tr></table>

<div class="tip-box"><div class="tip-label">关键设计</div>外部模式的优势是<strong>不注入任何代码到游戏进程</strong>，因此不会触发 DLL 注入检测。但高频的 <code>ReadProcessMemory</code> 调用本身是可被检测的行为特征。</div>

<h3>模块基地址获取</h3>
<p>CS2 的游戏数据分布在两个核心 DLL 中：</p>
<ul>
<li><strong>client.dll</strong>：包含实体列表、玩家属性、视角矩阵、屏幕比例等客户端数据</li>
<li><strong>server.dll</strong>：包含骨骼坐标（服务器权威数据），用于精确的骨骼匹配和自瞄</li>
</ul>
<p>通过 <code>EnumProcessModulesEx</code> 枚举所有已加载模块，按文件名匹配获取基地址，后续所有偏移都基于此基地址计算。</p>

<h2 id="s3">3. 内存偏移系统</h2>
<p>外挂通过<strong>硬编码偏移量（Hardcoded Offsets）</strong>定位游戏内存中的各项数据。这些偏移在每次游戏更新后都可能失效，需要重新逆向获取。</p>

<h3>client.dll 偏移表</h3>
<table><tr><th>偏移常量</th><th>偏移值</th><th>数据类型</th><th>含义</th></tr>
<tr><td><code>PERSON_ADDRESS</code></td><td><code>0x2073BC8</code></td><td>指针数组</td><td>玩家实体指针数组基地址</td></tr>
<tr><td><code>ENTITY_ADDRESS</code></td><td><code>0x2334358</code></td><td>指针数组</td><td>实体列表（0x18 间隔排列）</td></tr>
<tr><td><code>VIEW_ADDRESS</code></td><td><code>0x2343AB0</code></td><td>float[4][4]</td><td>4×4 视图投影矩阵</td></tr>
<tr><td><code>MYSELF_PLAYER</code></td><td><code>0x2069800</code></td><td>指针</td><td>本地玩家实体指针</td></tr>
<tr><td><code>PITCH_ANGLE</code></td><td><code>0x2353818</code></td><td>float</td><td>垂直视角角度（pitch）</td></tr>
<tr><td><code>HORIZONTAL_ANGLE</code></td><td><code>0x235381C</code></td><td>float</td><td>水平视角角度（yaw）</td></tr>
<tr><td><code>SCREEN_RATIO</code></td><td><code>0x2091B0C</code></td><td>float</td><td>屏幕宽高比校正系数</td></tr>
<tr><td><code>NUMBER_OF_GAME</code></td><td><code>0x20771AC</code></td><td>unsigned int</td><td>对局场次计数器</td></tr></table>

<h3>玩家属性偏移表</h3>
<table><tr><th>偏移量</th><th>类型</th><th>含义</th></tr>
<tr><td><code>+0x34C</code></td><td>uint32</td><td>生命值（Health）</td></tr>
<tr><td><code>+0x3EB</code></td><td>uint8</td><td>阵营编号（Team Number）</td></tr>
<tr><td><code>+0x14C8</code></td><td>uint32</td><td>护甲值（Armor）</td></tr>
<tr><td><code>+0x1390</code></td><td>float</td><td>世界坐标 X</td></tr>
<tr><td><code>+0x1394</code></td><td>float</td><td>世界坐标 Y</td></tr>
<tr><td><code>+0x1398</code></td><td>float</td><td>世界坐标 Z</td></tr></table>

<h3>server.dll 偏移（骨骼数据）</h3>
<table><tr><th>偏移量</th><th>含义</th></tr>
<tr><td><code>0x1DEFD10</code></td><td>骨骼数据数组基地址（server.dll 内）</td></tr>
<tr><td><code>+0x00</code></td><td>头部骨骼坐标 (X, Y, Z)</td></tr>
<tr><td><code>+0x0C</code></td><td>胸部骨骼坐标</td></tr>
<tr><td><code>+0x18</code></td><td>大腿骨骼坐标</td></tr>
<tr><td><code>+0x24</code></td><td>头部骨骼2（备用）</td></tr>
<tr><td><code>+0x30</code></td><td>头部骨骼3（备用）</td></tr></table>

<div class="warn-box"><div class="warn-label">偏移维护</div>这些偏移是游戏版本相关的。Valve 每次更新都可能重新编译二进制，导致偏移完全失效。成熟的外挂通常配合<strong>模式扫描（Pattern Scan）</strong>或<strong>在线偏移更新服务</strong>来自适应版本变化，本项目采用硬编码方式，更新后需手动重新逆向。</div>

<h2 id="s4">4. 实体枚举与去重</h2>
<p>游戏中的每个玩家（包括本地玩家和所有对手/队友）都对应一个实体对象。外挂需要遍历实体列表来获取所有玩家信息。</p>

<h3>实体列表结构</h3>
<p>实体列表是一个<strong>指针数组</strong>，每个元素间隔 <code>0x18</code> 字节（一个指针 8 字节 + 可能的元数据填充）。外挂遍历所有槽位：</p>
<ol>
<li>读取基地址偏移处的指针值</li>
<li>非空指针则视为有效实体</li>
<li>通过实体指针 + 属性偏移读取血量、护甲、阵营、坐标</li>
<li>过滤条件：血量 > 0 且 护甲 > 0 且 阵营为 T（2）或 CT（3）</li>
</ol>

<h3>去重策略</h3>
<p>由于实体列表可能在帧间产生波动（指针复用），使用 <code>unordered_set&lt;void*&gt;</code> 记录已注册的实体指针地址，避免同一玩家被重复创建 Player 对象。</p>

<h2 id="s5">5. 骨骼系统（Skeleton）</h2>
<p>骨骼数据存储在 <strong>server.dll</strong> 的内存空间中，是服务器权威的物理碰撞/动画数据。外挂通过读取骨骼坐标来实现精确的自瞄定位。</p>

<h3>骨骼数据布局</h3>
<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 660 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <text x="330" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">骨骼数据在 server.dll 中的内存布局（每骨骼 0x0C = 12 字节）</text>
  <rect x="20" y="40" width="620" height="40" rx="6" fill="#0f1117" stroke="#252837" stroke-width="1.5"/>
  <rect x="24" y="44" width="116" height="32" rx="4" fill="#1e2a4a" stroke="#f87171" stroke-width="1.5"/>
  <text x="82" y="58" text-anchor="middle" fill="#f87171" font-size="10" font-weight="600">Head (头部)</text>
  <text x="82" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">X Y Z float</text>
  <rect x="144" y="44" width="116" height="32" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="202" y="58" text-anchor="middle" fill="#6c9eeb" font-size="10" font-weight="600">Chest (胸部)</text>
  <text x="202" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">X Y Z float</text>
  <rect x="264" y="44" width="116" height="32" rx="4" fill="#1e2a4a" stroke="#34d399" stroke-width="1.5"/>
  <text x="322" y="58" text-anchor="middle" fill="#34d399" font-size="10" font-weight="600">Thigh (大腿)</text>
  <text x="322" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">X Y Z float</text>
  <rect x="384" y="44" width="116" height="32" rx="4" fill="#151720" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="442" y="58" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="600">Head2</text>
  <text x="442" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">X Y Z float</text>
  <rect x="504" y="44" width="116" height="32" rx="4" fill="#151720" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="562" y="58" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="600">Head3</text>
  <text x="562" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">X Y Z float</text>
  <!-- Offset labels -->
  <text x="82" y="100" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x00</text>
  <text x="202" y="100" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x0C</text>
  <text x="322" y="100" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x18</text>
  <text x="442" y="100" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x24</text>
  <text x="562" y="100" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x30</text>
  <!-- Bone matching -->
  <text x="330" y="130" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">骨骼以 0x40 为一组间隔排列，共 50 组（覆盖前 200 个玩家槽位）</text>
  <text x="330" y="148" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">匹配策略：Thigh 骨的 X/Y 坐标 == Player 坐标 X/Y → 确认属于该玩家</text>
</svg>
</div>

<h3>骨骼匹配算法</h3>
<p>骨骼数据和实体数据分别存储在 client.dll 和 server.dll 中，需要通过<strong>坐标匹配</strong>来建立关联：</p>
<ol>
<li>遍历 server.dll 中的 50 组骨骼数据（每组偏移 0x40）</li>
<li>取出每组的 Thigh（大腿）骨骼的 X/Y 坐标</li>
<li>与每个 Player 实体的 X/Y 坐标比对</li>
<li>完全匹配则将该骨骼地址绑定到对应 Player 对象</li>
</ol>
<p>用大腿骨骼而非头部骨骼做匹配的原因是：大腿骨骼坐标与 Player 对象的底部坐标一致，作为锚点最稳定。</p>

<h2 id="s6">6. 矩阵透视（View Matrix ESP）</h2>
<p>矩阵透视的核心原理是<strong>将 3D 世界坐标投影到 2D 屏幕坐标</strong>，然后在屏幕对应位置绘制方框/线条。</p>

<h3>4×4 视图投影矩阵</h3>
<p>游戏引擎使用一个 4×4 的浮点矩阵（View-Projection Matrix）来完成 3D→2D 的变换。该矩阵存储在 client.dll 的特定偏移处，每帧更新。</p>

<h3>投影计算过程</h3>
<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <text x="350" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">3D 世界坐标 → 2D 屏幕坐标 投影流程</text>
  <!-- Step 1 -->
  <rect x="14" y="40" width="140" height="60" rx="6" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="84" y="62" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">世界坐标</text>
  <text x="84" y="82" text-anchor="middle" fill="#80deea" font-size="10" font-family="monospace">(X, Y, Z)</text>
  <!-- Arrow 1 -->
  <line x1="154" y1="70" x2="186" y2="70" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#a1)"/>
  <text x="170" y="58" text-anchor="middle" fill="#555" font-size="8">×M</text>
  <!-- Step 2 -->
  <rect x="190" y="40" width="160" height="60" rx="6" fill="#1e2a4a" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="270" y="56" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">矩阵乘法</text>
  <text x="270" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">clip = M × world</text>
  <text x="270" y="86" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">w = M[2,:] · world</text>
  <!-- Arrow 2 -->
  <line x1="350" y1="70" x2="382" y2="70" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#a1)"/>
  <text x="366" y="58" text-anchor="middle" fill="#555" font-size="8">÷w</text>
  <!-- Step 3 -->
  <rect x="386" y="40" width="150" height="60" rx="6" fill="#1e2a4a" stroke="#34d399" stroke-width="1.5"/>
  <text x="461" y="56" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">透视除法</text>
  <text x="461" y="72" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">ndc_x = clip_x / w</text>
  <text x="461" y="86" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">ndc_y = clip_y / w</text>
  <!-- Arrow 3 -->
  <line x1="536" y1="70" x2="568" y2="70" stroke="#34d399" stroke-width="1.5" marker-end="url(#a1)"/>
  <!-- Step 4 -->
  <rect x="572" y="40" width="114" height="60" rx="6" fill="#1e2a4a" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="629" y="62" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">屏幕坐标</text>
  <text x="629" y="82" text-anchor="middle" fill="#fbbf24" font-size="10" font-family="monospace">(sx, sy)</text>
  <!-- Formula -->
  <rect x="40" y="120" width="620" height="64" rx="6" fill="#0f1117" stroke="#252837" stroke-width="1"/>
  <text x="350" y="142" text-anchor="middle" fill="#80deea" font-size="11" font-family="monospace">screen_x = width/2  + (M[0,:] · world) / w × (width/2)</text>
  <text x="350" y="164" text-anchor="middle" fill="#80deea" font-size="11" font-family="monospace">screen_y = height/2 − (M[1,:] · world) / w × (height/2)</text>
</svg>
</div>

<p>具体步骤：</p>
<ol>
<li><strong>读取矩阵</strong>：从 client.dll + <code>VIEW_ADDRESS</code> 处读取 16 个 float（4×4 矩阵），行优先排列，每行间隔 16 字节</li>
<li><strong>Z 分量计算</strong>：<code>clip_z = M[2][0]×X + M[2][1]×Y + M[2][2]×Z + M[2][3]</code>，若 <code>clip_z &lt; 0</code> 说明玩家在相机后面，跳过不绘制</li>
<li><strong>透视除法</strong>：<code>depth = 1 / clip_z</code>，将齐次坐标转为 NDC（归一化设备坐标）</li>
<li><strong>屏幕映射</strong>：将 NDC 乘以屏幕半宽/半高，加上屏幕中心偏移，得到最终像素坐标</li>
</ol>

<div class="tip-box"><div class="tip-label">Y 轴翻转</div>注意屏幕坐标 Y 轴向下为正，而 3D 世界中 Y 轴向上为正，因此计算 screen_y 时需要<strong>减去</strong>投影结果而非加上。</div>

<h3>透视方框绘制</h3>
<p>投影得到的屏幕坐标用于绘制包围框（Bounding Box）。框的宽高基于<strong>距离因子</strong>动态计算：<code>distance_factor = 10000 × depth</code>，距离越远框越小，模拟近大远小的透视效果。同时引入 <code>screen_ratio</code> 修正非正方形屏幕的宽高比。</p>

<h2 id="s7">7. 透明叠加窗口（Overlay）</h2>
<p>透视绘制不在游戏窗口内进行，而是创建一个<strong>独立的透明叠加窗口</strong>，覆盖在游戏窗口上方。</p>

<h3>窗口创建参数</h3>
<table><tr><th>参数</th><th>值</th><th>作用</th></tr>
<tr><td><code>WS_EX_TOPMOST</code></td><td>扩展样式</td><td>窗口始终置顶</td></tr>
<tr><td><code>WS_EX_TRANSPARENT</code></td><td>扩展样式</td><td>鼠标点击穿透，不影响游戏操作</td></tr>
<tr><td><code>WS_EX_LAYERED</code></td><td>扩展样式</td><td>支持分层窗口，实现透明效果</td></tr>
<tr><td><code>WS_EX_TOOLWINDOW</code></td><td>扩展样式</td><td>不在任务栏显示</td></tr>
<tr><td><code>WS_POPUP</code></td><td>窗口样式</td><td>无边框弹出窗口</td></tr></table>

<h3>透明实现方式</h3>
<p>通过 <code>SetLayeredWindowAttributes</code> 设置颜色键（Color Key）：<code>RGB(0,0,0)</code> 被设为全透明色。Direct2D 渲染时先以 <code>ColorF(0,0,0,0)</code> 清屏，背景变为完全透明，只有绘制的方框/线条可见。</p>

<h3>窗口同步</h3>
<p>叠加窗口在每帧通过 <code>SetWindowPos</code> 同步游戏窗口的位置和大小，确保覆盖精确对齐。当游戏窗口被拖动或调整大小时，叠加窗口实时跟随。</p>

<h2 id="s8">8. 自瞄系统（Aimbot）</h2>
<p>自瞄不通过模拟鼠标移动来实现，而是<strong>直接修改游戏内存中的视角角度</strong>，使准星瞬间指向目标。</p>

<h3>角度计算原理</h3>
<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="a2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f87171"/></marker>
    <marker id="a3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#34d399"/></marker>
  </defs>
  <text x="340" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">自瞄角度计算（从自身头部 → 敌方头部）</text>
  <!-- 2D diagram: top-down view -->
  <text x="340" y="44" text-anchor="middle" fill="#555" font-size="10" font-family="sans-serif">俯视图（计算 Yaw 偏航角）</text>
  <!-- My head -->
  <circle cx="180" cy="140" r="20" fill="#1e2a4a" stroke="#34d399" stroke-width="2"/>
  <text x="180" y="136" text-anchor="middle" fill="#34d399" font-size="10" font-weight="600">我</text>
  <text x="180" y="150" text-anchor="middle" fill="#555" font-size="8">(mx, my)</text>
  <!-- Enemy head -->
  <circle cx="500" cy="90" r="20" fill="#1e2a4a" stroke="#f87171" stroke-width="2"/>
  <text x="500" y="86" text-anchor="middle" fill="#f87171" font-size="10" font-weight="600">敌</text>
  <text x="500" y="100" text-anchor="middle" fill="#555" font-size="8">(ex, ey)</text>
  <!-- Line between -->
  <line x1="200" y1="136" x2="480" y2="94" stroke="#f87171" stroke-width="1.5" marker-end="url(#a2)" stroke-dasharray="6,3"/>
  <!-- Yaw arc -->
  <path d="M 210 140 A 30 30 0 0 0 218 124" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="228" y="124" fill="#fbbf24" font-size="10" font-weight="600">θ</text>
  <!-- X axis -->
  <line x1="160" y1="140" x2="210" y2="140" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="214" y="144" fill="#555" font-size="9">+X</text>
  <!-- Formula -->
  <text x="340" y="180" text-anchor="middle" fill="#fbbf24" font-size="11" font-family="monospace">yaw = atan2(ey − my, ex − mx) × 180/π</text>
  <!-- Side view -->
  <text x="340" y="210" text-anchor="middle" fill="#555" font-size="10" font-family="sans-serif">侧视图（计算 Pitch 俯仰角）：pitch = atan2(−(eh − mh), √(Δx² + Δy²)) × 180/π</text>
</svg>
</div>

<p>自瞄的计算分为两步：</p>
<ol>
<li><strong>目标选择</strong>：遍历所有存活的敌方玩家，计算每人的头部骨骼与自身头部骨骼的三维欧氏距离，取距离最近者</li>
<li><strong>角度计算</strong>：
  <ul>
  <li><strong>Yaw（水平偏航角）</strong>：<code>atan2(ΔY, ΔX) × 180/π</code>，基于 XY 平面计算水平旋转角</li>
  <li><strong>Pitch（垂直俯仰角）</strong>：<code>atan2(−ΔZ, √(ΔX² + ΔY²)) × 180/π</code>，基于 XY 平面距离和 Z 差计算俯仰角。Z 取负是因为世界坐标中 Z 向上为正，而俯仰角向下为正</li>
  </ul>
</li>
</ol>

<h3>内存写入实现</h3>
<p>计算得到的目标角度直接通过 <code>WriteProcessMemory</code> 写入游戏的视角地址：</p>
<ol>
<li><code>VirtualProtectEx</code> 临时将目标内存页改为 <code>PAGE_READWRITE</code></li>
<li><code>WriteProcessMemory</code> 写入新的 float 角度值</li>
<li><code>VirtualProtectEx</code> 恢复原始保护属性</li>
</ol>

<div class="warn-box"><div class="warn-label">频率控制</div>自瞄并非每帧触发，而是每 4 帧执行一次（<code>freq % 4 == 0</code>），以降低写入频率，减小被反作弊系统检测到的概率。</div>

<h3>与模拟鼠标自瞄的区别</h3>
<table><tr><th>维度</th><th>内存写入式（本项目）</th><th>模拟鼠标式</th></tr>
<tr><td>精度</td><td>精确到 float 级别</td><td>受鼠标 DPI 和系统采样率限制</td></tr>
<tr><td>速度</td><td>瞬时（一帧完成）</td><td>需要平滑移动多帧</td></tr>
<tr><td>隐蔽性</td><td>差（角度突变是硬特征）</td><td>较好（类似人手操作）</td></tr>
<tr><td>检测难度</td><td>低（服务端容易检测异常角度跳变）</td><td>高（需要统计学分析鼠标轨迹）</td></tr></table>

<h2 id="s9">9. 多线程与对局状态追踪</h2>
<h3>对局变化检测</h3>
<p>外挂通过监控<strong>对局场次计数器</strong>（client.dll + <code>0x20771AC</code>）来检测新对局的开始。当该值发生变化时，触发一次完整的玩家重新枚举和骨骼匹配，因为新对局中所有实体地址都会改变。</p>

<h3>线程模型</h3>
<ul>
<li><strong>主线程</strong>：消息循环 + 渲染循环（60 FPS，Sleep(16ms)）</li>
<li><strong>更新线程</strong>：检测到新对局时，创建 detach 线程执行 <code>GameUpdate</code>，包含玩家列表重建和骨骼地址匹配（Sleep 12 秒等待服务器数据稳定）</li>
<li><strong>互斥锁</strong>：使用 <code>std::mutex</code> 保护玩家列表的并发访问，更新线程持有锁期间主线程暂停绘制</li>
</ul>

<h2 id="s10">10. 检测面分析</h2>
<p>从反作弊（VAC / VACnet）的角度，该外挂存在以下可被检测的特征：</p>

<table><tr><th>检测面</th><th>具体特征</th><th>风险等级</th></tr>
<tr><td><strong>RPM 频率</strong></td><td>每秒数千次 ReadProcessMemory 调用，形成异常的系统调用模式</td><td>中</td></tr>
<tr><td><strong>进程句柄</strong></td><td>外部进程持有 cs2.exe 的 PROCESS_VM_READ/WRITE 句柄</td><td>高</td></tr>
<tr><td><strong>角度突变</strong></td><td>自瞄写入的角度值瞬间跳变，与人类操作的连续轨迹不符</td><td>高</td></tr>
<tr><td><strong>Overlay 窗口</strong></td><td>WS_EX_TOPMOST + WS_EX_TRANSPARENT + WS_EX_LAYERED 的组合特征</td><td>低</td></tr>
<tr><td><strong>偏移访问模式</strong></td><td>对特定内存地址的规律性访问模式</td><td>中</td></tr>
<tr><td><strong>WPM 写入</strong></td><td>对角度地址的 WriteProcessMemory 调用</td><td>高</td></tr></table>

<div class="danger-box"><div class="danger-label">免责声明</div>本文仅用于安全研究、逆向分析学习和游戏安全防护研究。未经授权使用外挂违反游戏用户协议，可能导致永久封禁。请在合法授权的范围内使用这些技术。</div>

</div>
<div class="nav-bar"><a href="/archives">← 总目录</a><a href="/article/so-injection">SO 注入方法 →</a></div>
<div class="footer">安全与逆向 · 技术分析</div>
</div>
