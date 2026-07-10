---
title: "VT 技术：硬件虚拟化与 Ring -1 安全应用"
date: 2026-07-10
categories: "安全与逆向"
tags: ["逆向", "VT技术", "虚拟化", "Intel VT-x", "EPT", "Hypervisor", "内核"]
id: "vt-technology-ch10"
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

<div class="hero"><h1>VT 技术：硬件虚拟化与 Ring -1 安全应用</h1>
<p class="subtitle">Intel VT-x · VMCS · EPT · Hypervisor 原理与实战</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">VT技术</span><span class="tag">虚拟化</span><span class="tag">Intel VT-x</span><span class="tag">EPT</span><span class="tag">内核</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s101">1. 硬件虚拟化基础</a>
  <div class="toc-sub">
  <a href="#s1011">1.1 概述</a>
  <a href="#s1012">1.2 VT 指令与 VMCS</a>
  <a href="#s1013">1.3 EPT 机制</a>
  </div>
</li>
<li><a href="#s102">2. VT 安全应用</a>
  <div class="toc-sub">
  <a href="#s1021">2.1 ShadowWalker 实例</a>
  <a href="#s1023">2.2 检测 VT 支持</a>
  <a href="#s1024">2.3 VMCS 配置</a>
  <a href="#s1025">2.4 EPT 配置</a>
  <a href="#s1026">2.5 开启 VT</a>
  <a href="#s1027">2.6 内存隐藏实现</a>
  </div>
</li>
<li><a href="#s103">3. VT 调试方法</a></li>
<li><a href="#summary">4. 总结</a></li>
</ul></div>

<div class="article-content">

<h2 id="s101">1. 硬件虚拟化的基本概念</h2>

<div class="tip-box">
<div class="tip-label">初学者提示</div>
VT（Virtualization Technology）是 Intel 的硬件辅助虚拟化技术。它引入了一个全新的 CPU 层级——<strong>Ring -1</strong>，这个层级的权限比操作系统所在的 Ring 0 还要高。如果你之前只听说过 Ring 0（内核态）和 Ring 3（用户态），那么 VT 技术就是在 Ring 0 之下再挖一层，这一层的代码叫 <strong>Hypervisor</strong>（虚拟机监控器），拥有"上帝视角"。
</div>

<p>VT 技术最初是为了提高 VMware 之类软件虚拟化的性能而设计的。但随着安全研究人员的探索，人们很快发现——由于 VT 引入了新的 CPU 层级 Ring -1，它在安全领域也带来了大量的新应用场景。</p>

<h3 id="s1011">1.1 概述</h3>

<p>硬件虚拟化技术引入了新的 CPU 模式和虚拟化指令集，帮助 VMM（Virtual Machine Monitor，虚拟机监控器）提升性能。Intel VT-x 为 CPU 提供了 VMX（Virtual Machine Extension，虚拟机扩展）功能。</p>

<p>在 VMX 中有两种操作模式：</p>

<ul>
<li><strong>VMX Root Operation</strong>（Root 模式）—— 供 VMM/Hypervisor 使用，拥有最高权限</li>
<li><strong>VMX Non-Root Operation</strong>（Non-Root 模式）—— Guest OS（客户操作系统）运行的模式</li>
</ul>

<p>VMM 通过虚拟机控制结构（Virtual-Machine Control Structure，<strong>VMCS</strong>）设置需要截获的硬件访问，例如指令、中断、内存访问和异常等。如果 Guest OS 在执行时触发了这些条件设置，将引起 <strong>#VMExit</strong>（VM 退出），此时 CPU 会从 Non-Root 模式切换到 Root 模式，VMM 获得控制权并执行相应的处理程序。当 VMM 执行结束后，将控制权返回给 Guest OS，这称为 <strong>#VMEntry</strong>（VM 进入）。</p>

<div class="tip-box">
<div class="tip-label">类比理解</div>
编写一个 VT 技术的 Hypervisor 例子和编写 Windows 窗口程序非常相似：<br>
1. 分配 VMXON 区域和 VMCS 控制块（类似 RegisterClassEx 注册窗口）<br>
2. 填写 VMCS 控制块，设置要监控什么特权指令、是否开启 EPT 等（类似填写窗口过程 WndProc）<br>
3. 调用 VMLAUNCH 指令启动虚拟机（类似 CreateWindow 显示窗口）<br>
4. 当产生 #VMExit 事件时调用 ExitEventHandler 函数处理（类似在 WndProc 中处理消息）<br><br>
VT 技术并不神秘，与编写窗口程序有很多相似之处。其难点在于<strong>调试</strong>（出现错误时定位比较困难）。
</div>

<h3 id="s1012">1.2 相关结构和汇编指令</h3>

<p>为了实现 VT 技术，Intel 引入了一系列新的指令集：</p>

<table>
<tr><th>指令</th><th>功能</th><th>说明</th></tr>
<tr><td><code>VMXON</code></td><td>开启 VMX 模式</td><td>执行后续虚拟化相关指令的前提</td></tr>
<tr><td><code>VMXOFF</code></td><td>关闭 VMX 模式</td><td>后续虚拟化指令执行都会失败</td></tr>
<tr><td><code>VMLAUNCH</code></td><td>启动虚拟机</td><td>启动 VMCS 指向的 Guest OS，触发 #VMEntry</td></tr>
<tr><td><code>VMRESUME</code></td><td>恢复虚拟机</td><td>从 Hypervisor 中恢复 Guest OS 的执行</td></tr>
<tr><td><code>VMPTRLD</code></td><td>激活 VMCS</td><td>加载一个 VMCS 指针，后续操作针对该 VMCS</td></tr>
<tr><td><code>VMCLEAR</code></td><td>清除 VMCS</td><td>使一块 VMCS 变为非激活状态</td></tr>
<tr><td><code>VMREAD</code></td><td>读 VMCS</td><td>读取当前 VMCS 中的数据</td></tr>
<tr><td><code>VMWRITE</code></td><td>写 VMCS</td><td>向当前 VMCS 中写入数据</td></tr>
<tr><td><code>VMCALL</code></td><td>Guest-Hypervisor 交互</td><td>Guest OS 中执行，产生 #VMExit 陷入 Hypervisor</td></tr>
<tr><td><code>INVEPT</code></td><td>刷新 EPT 缓存</td><td>使 TLB 中缓存的 EPT 地址映射失效</td></tr>
</table>

<p>VT 的基本工作流程：</p>

<ol>
<li>使用 <code>VMXON</code> 进入 VMX Root 模式（Hypervisor 模式）</li>
<li>对 Guest OS 进行配置（填写 VMCS）</li>
<li>使用 <code>VMLAUNCH</code> 从 Root 模式转到 Non-Root 模式（Guest OS）</li>
<li>Guest OS 运行中产生 #VMExit 事件，陷入 Hypervisor（Root 模式）</li>
<li>Hypervisor 处理事件</li>
<li>调用 <code>VMRESUME</code> 重新 #VMEntry 到 Guest OS</li>
<li>如此循环，直到调用 <code>VMXOFF</code> 关闭 VMX 模式</li>
</ol>

<h4>VMCS（Virtual Machine Control Structure）</h4>

<div class="tip-box">
<div class="tip-label">关键理解</div>
VMCS 是 VT 技术中最重要的数据结构。可以简单地认为——<strong>每个 VMCS 代表一个虚拟机</strong>。通过控制 VMCS 就能控制虚拟机的各种行为和属性。CPU 支持多个 Guest OS，每个 Guest OS 对应一个 VMCS。
</div>

<p>VMCS 的数据区分为以下 6 个部分：</p>

<table>
<tr><th>#</th><th>区域名称</th><th>作用</th></tr>
<tr>
<td>1</td>
<td><strong>Guest-State Area</strong><br>客户区状态域</td>
<td>#VMEntry 时加载 Guest OS 状态；#VMExit 时保存 Guest OS 状态。包括通用寄存器、CR0/CR3/CR4、RSP/RIP、段寄存器、GDTR/IDTR 等。</td>
</tr>
<tr>
<td>2</td>
<td><strong>Host-State Area</strong><br>宿主机状态域</td>
<td>#VMExit 时加载 Hypervisor 的状态，恢复 Hypervisor 的执行环境。</td>
</tr>
<tr>
<td>3</td>
<td><strong>VM-Execution Control Fields</strong><br>虚拟机执行控制域</td>
<td><strong>最关键的配置区域。</strong>设置各种退出条件：控制哪些事件会导致 #VMExit，包括异常、I/O 访问、MSR 访问、EPT 配置等。</td>
</tr>
<tr>
<td>4</td>
<td><strong>VM-Entry Control Fields</strong></td>
<td>控制 #VMEntry 时的行为，如是否进入 x64 模式、是否注入中断等。</td>
</tr>
<tr>
<td>5</td>
<td><strong>VM-Exit Control Fields</strong></td>
<td>定义 #VMExit 后硬件立即执行的操作。</td>
</tr>
<tr>
<td>6</td>
<td><strong>VM-Exit Information Fields</strong></td>
<td><strong>只读区域。</strong>包含最近一次 #VMExit 的退出原因、指令地址等信息。处理 #VMExit 时必须使用此处信息才能知道陷入原因。</td>
</tr>
</table>

<div class="tip-box">
<div class="tip-label">学习建议</div>
第一次接触 VT 时，不要纠缠于每一个字段的细节。先在大局上理解 VT 技术的运作方式——Root/Non-Root 模式的切换、VMCS 的 6 个区域各自的作用，然后再深入研究代码细节。Intel 开发者手册（Intel SDM）是最终的权威参考。
</div>

<h3 id="s1013">1.3 EPT 机制（扩展页表）</h3>

<div class="tip-box">
<div class="tip-label">初学者提示</div>
EPT 是 VT 技术中与安全关系最密切的特性之一。简单理解，EPT 就是<strong>多了一层地址转换</strong>——在原有的 CR3 页表转换之外，再加一层 EPT 页表。这层额外的转换给了 Hypervisor 巨大的控制空间，可以实现内存隐藏、内存访问监控等强大的安全功能。
</div>

<p>在虚拟化平台上，每个 Guest OS 都有独立的物理地址空间，地址转换流程如下：</p>

<ol>
<li>Guest OS 中的虚拟地址（GVA）→ 通过 CR3 页表 → <strong>GPA</strong>（客户机物理地址）</li>
<li>GPA → 通过 <strong>EPT</strong>（由 EPTP 寄存器配置）→ <strong>HPA</strong>（宿主机物理地址）</li>
</ol>

<p>EPT 页表最多包含 4 级：</p>

<table>
<tr><th>级别</th><th>表项</th><th>映射粒度</th></tr>
<tr><td>1（PML4T）</td><td>EPT PML4E</td><td>512 GB</td></tr>
<tr><td>2（PDPT）</td><td>EPT PDPTE</td><td>1 GB（大页面）或指向下级</td></tr>
<tr><td>3（PDT）</td><td>EPT PDE</td><td>2 MB（大页面）或指向下级</td></tr>
<tr><td>4（PT）</td><td>EPT PTE</td><td>4 KB（普通页面）</td></tr>
</table>

<p>EPT 页表项的关键属性位：</p>

<table>
<tr><th>位</th><th>名称</th><th>含义</th></tr>
<tr><td>0</td><td>Read</td><td>可读</td></tr>
<tr><td>1</td><td>Write</td><td>可写</td></tr>
<tr><td>2</td><td>Execute</td><td>可执行</td></tr>
<tr><td>5:3</td><td>Memory Type</td><td>内存类型（如 WB=6, UC=0）</td></tr>
<tr><td>7</td><td>Page Size</td><td>大页面标志（仅 PDPTE/PDE 有效）</td></tr>
</table>

<div class="warn-box">
<div class="warn-label">EPT Violation</div>
如果从 GPA 转换到 HPA 的过程中发生错误，将引发两类 EPT 故障——<strong>EPT Violation</strong> 和 <strong>EPT Misconfiguration</strong>。当发生这些故障时，处理器会产生 #VMExit 事件（退出原因为 <code>EXIT_REASON_EPT_VIOLATION</code>）。Hypervisor 在 #VMExit 处理中分析具体原因，修正页表映射。这是实现内存隐藏等技术的基础。
</div>

<h2 id="s102">2. VT 技术的应用</h2>

<div class="tip-box">
<div class="tip-label">本节目标</div>
通过分析一个完整的 <strong>Shadow Walker</strong> 内存隐藏实例，理解 VT 技术在实际安全场景中的使用方法。这个例子展示了如何利用 EPT 机制，让同一个内存地址在<strong>代码执行</strong>和<strong>数据访问</strong>时得到截然不同的结果。
</div>

<h3 id="s1021">2.1 ShadowWalker 实例</h3>

<p>Shadow Walker 通过 EPT 机制将 Split.exe 程序的代码执行和数据访问映射到不同的物理地址上。这样，Split.exe 在执行指令和读取数据时就会得到不同的结果，从而达到隐藏内容的目的。</p>

<p>Split.exe 的代码很简单：首先将 <code>PrintValue</code> 的值作为代码执行一遍，然后打印 <code>PrintValue</code> 的值。原始值 <code>0x90902390</code> 作为代码执行是没问题的，但打印的结果却是 <code>0x79696450</code>。秘密就在 <code>Hypervisor.sys</code> 里面——Hypervisor 将 NewSeon 这个区段根据代码执行和数据访问进行了不同的映射。</p>

<p>示例程序的限制条件：</p>

<ul>
<li>机器必须支持 Intel VT-x 技术及 EPT 特性，并在 BIOS 中开启 VT</li>
<li>操作系统必须是 <strong>32 位 Windows 7</strong></li>
<li>CPU 关闭了多核支持（单核模式）</li>
<li>关闭 PAE 机制（<code>bcdedit /set pae forcedisable</code>）</li>
</ul>

<div class="warn-box">
<div class="warn-label">注意</div>
Hypervisor.sys 属于内核模块，一旦造成蓝屏可能会损坏系统，建议在 VMware 虚拟机中运行。VMware Workstation 10 以上的版本都支持 VT 技术的模拟。
</div>

<h4>分析 Hypervisor</h4>

<p>Hypervisor 内核模块的大体功能：</p>

<ol>
<li>在 <code>DriverEntry</code> 中检测 CPU 对 VT 的支持情况</li>
<li>在 CPU 支持 VT 技术的情况下，配置 VMCS 和 EPT 信息，开启 VT</li>
<li>通过 <code>cpuid</code> 测试 VT 的效果（修改 cpuid 的返回值以验证 VT 已生效）</li>
<li>注册进程创建回调，监控 Split.exe 的创建</li>
<li>当 Split.exe 创建时，将其内存复制为两份：一份作为数据访问，另一份作为代码执行</li>
<li>对数据访问拷贝进行修改（将 PrintValue 值修改为 "Pdiy"）</li>
<li>两份拷贝都进行 EPT 映射，根据是代码执行还是数据访问，映射到不同的 HPA</li>
<li>在 Split.exe 退出时拆除页面分割并释放内存</li>
<li>驱动被卸载时，删除进程回调并关闭 VT</li>
</ol>

<p>例如，修改 <code>cpuid</code> 功能号 0xPdiy 的处理：</p>

<pre><code>// 开启 VT 前：cpuid 0xPdiy 返回全 0
// 开启 VT 后：Hypervisor 截获并修改返回值
if (Function == 0xPdiy) {
    GuestReg-&gt;RegEax = 0x11111111;
    GuestReg-&gt;RegEcx = 0x22222222;
    GuestReg-&gt;RegEdx = 0x33333333;
    GuestReg-&gt;RegEbx = 0x49144444;
}</code></pre>

<div class="tip-box">
<div class="tip-label">原理总结</div>
只要系统运行在 Non-Root 模式下，任何 cpuid 指令的执行都会触发 #VMExit 陷入 Hypervisor。Hypervisor 的 #VMExit 处理函数可以检查退出原因，如果是 cpuid 指令并且功能号是感兴趣的，就可以修改返回值再回到 Guest OS。这就是 VT 反调试、VT 保护技术的核心思想。
</div>

<h3 id="s1023">2.2 检测 VT 支持情况</h3>

<p>在开启 VT 之前，必须检查 CPU 和相关硬件是否满足条件：</p>

<ol>
<li><strong>检测 CPU 是否支持 VMX：</strong>执行 <code>CPUID.1:ECX[5]</code>，检查 ECX 第 5 位</li>
<li><strong>检测 BIOS 是否开启了 VT：</strong>读取 <code>IA32_FEATURE_CONTROL</code> MSR（0x3A）</li>
<li><strong>检测 Secondary ProcBased Control：</strong>读取 <code>IA32_VMX_PROCBASED_CTLS</code>（0x482）</li>
<li><strong>检测 EPT 支持：</strong>读取 <code>IA32_VMX_PROCBASED_CTLS2</code>（0x48B）</li>
</ol>

<pre><code>// 检测 VMX 是否支持（CPUID.1:ECX[5]）
ExecuteCpuid(0x1, &amp;Eax, &amp;Ebx, &amp;Ecx, &amp;Edx);
if (!(Ecx &amp; (1 &lt;&lt; 5))) {
    KdPrint("VMX not supported\n");
    return STATUS_UNSUCCESSFUL;
}

// 检测 BIOS 是否开启了 VT
Msr = ReadMsr(IA32_FEATURE_CONTROL);
if (!(Msr &amp; (1 &lt;&lt; 2))) {
    KdPrint("VMX not enabled in BIOS\n");
    return STATUS_UNSUCCESSFUL;
}

// 检测 EPT 支持
ReadMsr(IA32_VMX_PROCBASED_CTLS2, &amp;Ctls2);
if (!(Ctls2.EnableEpt &amp;&amp; Ctls2.EnableVpid)) {
    KdPrint("EPT/VPID not supported\n");
    return STATUS_UNSUCCESSFUL;
}</code></pre>

<p>当所有条件满足后，将 <code>CR4.VMXE</code> 置位。只有设置了 CR4 的 VMXE 位，才能执行后续的 VT 指令。</p>

<h3 id="s1024">2.3 VMCS 的配置</h3>

<p>将 <code>CR4.VMXE</code> 置位后，就可以进入开启 VT 的流程了。整个过程在 <code>LoadHypervisor()</code> 函数中完成：</p>

<ol>
<li>为每个 CPU 核心分配 <code>CPU_VMX_CONTEXT</code> 结构，存放 VMCS、IOBitmap、ExceptionBitmap 和 EPT 信息</li>
<li>调用 <code>SetupVMX()</code> 执行 <code>VMXON</code> 指令，进入 VMX Root 模式</li>
<li>调用 <code>SetupVMCS()</code> 填充 VMCS 结构的 6 个部分</li>
</ol>

<h4>Guest-State Area（客户区状态域）</h4>

<p>如果不是为了编写类似 VMware 的虚拟机，只是把当前操作系统放入 Guest OS 中执行，那么 Guest OS 的配置基本上要和 Hypervisor 的一样。需要填写的内容包括：CR0/CR3/CR4、DR7、RSP、RIP、RFLAGS、段寄存器等。</p>

<p>其中最关键的是 <strong>GUEST_EIP</strong>——从 Hypervisor（Root 模式）切换到 Guest OS（Non-Root 模式）时，CPU 会从 GUEST_EIP 填写的地址处开始执行。</p>

<h4>Host-State Area（宿主机状态域）</h4>

<p>关键区别在于 <strong>HOST_EIP</strong>——这是 #VMExit 事件发生时 CPU 跳转到的地址，相当于 VT 技术中的"窗口过程"。</p>

<pre><code>// 设置 Host ESP 和 EIP
WriteVmcs(HOST_ESP, (ULONG)CpuInfo-&gt;HostEsp - 0x7000);

// HOST_EIP 是关键！产生 #VMExit 时进入这里
WriteVmcs(HOST_EIP, (ULONG)ExitEventHandler);</code></pre>

<h4>VM-Execution Control Fields（虚拟机执行控制域）</h4>

<p>这是 VT 配置中最重要的区域：</p>

<pre><code>// 配置异常位图 - 设置哪些异常需要截获
ExceptionBitmap = 0;
ExceptionBitmap |= (1 &lt;&lt; DEBUG_EXCEPTION);    // 调试异常
ExceptionBitmap |= (1 &lt;&lt; BREAKPOINT_EXCEPTION); // 断点异常
ExceptionBitmap |= (1 &lt;&lt; PAGE_FAULT_EXCEPTION); // 页异常
WriteVmcs(EXCEPTION_BITMAP, ExceptionBitmap);

// 配置 I/O 位图 - 拦截 I/O 端口访问
WriteVmcs(IO_BITMAP_A, CpuInfo-&gt;IOBitmapPhysicalAddr.LowPart);
WriteVmcs(IO_BITMAP_B, CpuInfo-&gt;IOBitmapPhysicalAddr.HighPart);

// 配置 MSR 位图 - 拦截 MSR 寄存器访问
WriteVmcs(MSR_BITMAP, CpuInfo-&gt;MSRBitmapPhysicalAddr.LowPart);</code></pre>

<h3 id="s1025">2.4 EPT 的配置</h3>

<div class="tip-box">
<div class="tip-label">EPT 配置两步走</div>
1. 设置 EPT 指针（EPTP），指向 EPT 页表<br>
2. 初始化 EPT 页表结构
</div>

<p>首先在 VMCS 的 <code>CPU_BASED_VM_EXEC_CONTROL</code> 字段中启用 Secondary Controls，然后在 <code>SECONDARY_VM_EXEC_CONTROL</code> 字段中将 <code>ENABLE_EPT</code> 位置 1：</p>

<pre><code>// 配置 EPT 指针
PhysicalAddress = MmGetPhysicalAddress(CpuInfo-&gt;EptInfo.EptPml4TablePointer);
EptPointer.Bits.PhysAddr = PhysicalAddress.LowPart &gt;&gt; 12;
EptPointer.Bits.PageWalkLength = 0;
WriteVmcs(EPT_POINTER, EptPointer.UnsignedVal);

// 启用 EPT - bit 1 置 1
WriteVmcs(SECONDARY_VM_EXEC_CONTROL, (1 &lt;&lt; 1));

// 激活 Secondary Controls
WriteVmcs(CPU_BASED_VM_EXEC_CONTROL, Value | (1 &lt;&lt; 31));</code></pre>

<p>EPT 页表的初始化（由 <code>InitEptIdentityMap()</code> 实现）：</p>

<pre><code>// 32 位系统，4GB 内存空间
// 分配 1 个 PML4T（512 项）
Pml4Ptr = AllocateContiguousMemory(512 * sizeof(EPT_PML4_ENTRY));

// 分配 4 个 PDPT（每项管理 1GB）
for (i = 0; i &lt; 4; i++) {
    PdptePtr[i] = AllocateContiguousMemory(512 * sizeof(EPT_PDPTE_ENTRY));
}

// 设置 PML4E：可读、可写、可执行
Pml4Ptr-&gt;Present = 1;
Pml4Ptr-&gt;Write = 1;
Pml4Ptr-&gt;Execute = 1;

// 设置 PDE 使用 2MB 大页面（bit 7 = 1）
PdePtr-&gt;Size = 1;
PdePtr-&gt;Present = 1;
PdePtr-&gt;Write = 1;
PdePtr-&gt;Execute = 1;
PdePtr-&gt;MemoryType = EPT_MEMORY_TYPE_WB;</code></pre>

<div class="tip-box">
<div class="tip-label">EPT 页表内存布局</div>
在 32 位系统中最多支持 4GB 内存：<br>
- 1 个 PML4T 管理 512GB 空间<br>
- 4 个 PDPTE 管理 4GB 空间（每个 1GB）<br>
- 512 个 PDE，每个使用 2MB 大页面<br>
- 没有使用 PTE（因为 PDE 的 Page Size 位已置 1）<br><br>
即 2MB × 512 × 4 = 4GB，覆盖了整个 32 位地址空间。
</div>

<h3 id="s1026">2.5 开启 VT</h3>

<p>准备工作完成后，执行 <code>VMLAUNCH</code> 指令开启 VT：</p>

<pre><code>NTSTATUS LaunchVirtualize(PCPU_VMX_CONTEXT CpuInfo)
{
    // VMLAUNCH 不应该返回，如果成功，将进入 VMCS 中的 Guest EIP
    ExecuteVmLaunch();

    if (VmFailInvalid()) {
        KdPrint("VMLAUNCH Failed\n");
        return STATUS_UNSUCCESSFUL;
    }

    if (VmLaunchFailValid()) {
        KdPrint("VMLAUNCH Failed, Error Code: %p\n",
                ReadVmcs(VM_INSTRUCTION_ERROR));
        return STATUS_UNSUCCESSFUL;
    }

    return STATUS_UNSUCCESSFUL;
}</code></pre>

<p>如果 VT 开启成功，<code>VMLAUNCH</code> 不会返回，CPU 会直接跳转到 VMCS 中设置的 <code>GUEST_EIP</code> 地址开始执行。</p>

<h3 id="s1027">2.6 内存隐藏的实现</h3>

<div class="warn-box">
<div class="warn-label">核心思想</div>
EPT 机制可以对同一个 GPA 根据访问类型（代码执行还是数据读写）映射到不同的 HPA。这就是 VT 技术实现内存隐藏的根本原理。
</div>

<p>内存隐藏的具体实现流程：</p>

<ol>
<li><strong>监控进程创建：</strong>调用 <code>PsSetCreateProcessNotifyRoutine</code> 注册进程创建回调</li>
<li><strong>复制 PE 文件：</strong>当检测到 Split.exe 创建时，将其整个 PE 文件复制一份——原始页面用于代码执行，复制的页面用于数据访问</li>
<li><strong>修改数据副本：</strong>对数据访问副本中 NewSeon 节的 PrintValue 值进行修改</li>
<li><strong>通过 VMCALL 通知 Hypervisor：</strong>发送 VMCALL_INIT_SPLIT 编号的 #VMExit 事件</li>
<li><strong>使 EPT 页面无效：</strong>在 Hypervisor 中遍历 Split.exe 的所有 CODE_EPT 页面，将对应的 EPT PTE 的 Present 位置 0</li>
<li><strong>捕获 EPT Violation：</strong>当 Split.exe 访问这些页面时，产生 <code>EXIT_REASON_EPT_VIOLATION</code></li>
<li><strong>动态映射：</strong>在 #VMExit 处理函数中，根据访问类型进行不同的 GPA 到 HPA 映射</li>
</ol>

<pre><code>// EPT Violation 处理 - 根据访问类型映射到不同物理地址
ExitQualification = ReadVmcs(EXIT_QUALIFICATION);

if (ExitQualification &amp; EPT_MSK_DATA_EXEC) {
    // 代码执行访问 → 映射到 CodePhys
    PtePtr-&gt;PhysAddr = TranslationPtr-&gt;CodePhys &gt;&gt; 12;
    PtePtr-&gt;Execute = 1;
}
else if ((ExitQualification &amp; EPT_MSK_DATA_READ) ||
         (ExitQualification &amp; EPT_MSK_DATA_WRITE)) {
    // 数据访问 → 映射到 DataPhys
    PtePtr-&gt;PhysAddr = TranslationPtr-&gt;DataPhys &gt;&gt; 12;
    PtePtr-&gt;Present = 1;
    PtePtr-&gt;Write = 1;
}</code></pre>

<div class="tip-box">
<div class="tip-label">内存隐藏的应用场景</div>
- <strong>反调试：</strong>让调试器读取到的代码与 CPU 实际执行的代码不同<br>
- <strong>代码保护：</strong>加密的代码在数据访问时不可见，只有 CPU 执行时才能解密<br>
- <strong>Rootkit 隐藏：</strong>隐藏恶意代码的踪迹，安全软件无法扫描到<br>
- <strong>游戏保护：</strong>防止内存修改器篡改游戏数据<br><br>
理解了这个原理，就能明白为什么 VT 技术在软件保护领域如此重要。
</div>

<h2 id="s103">3. VT 调试方法</h2>

<div class="tip-box">
<div class="tip-label">调试策略</div>
VT 技术本身并不复杂，只是因为参考资料较少、难以调试，才给人造成研究困难的假象。使用 <strong>VMware + WinDbg + IDA Pro</strong> 进行调试，可以让难度大幅降低。
</div>

<h4>双机调试环境搭建</h4>

<ol>
<li><strong>选择 VMware 版本：</strong>VMware Workstation 8 以上版本支持 VT 技术程序，推荐 Workstation 12</li>
<li><strong>BIOS 开启 VT-x：</strong>在 BIOS 中开启 VT-x 技术支持</li>
<li><strong>配置虚拟化引擎：</strong>在虚拟机"处理器"设置中，将"首选模式"改成 <strong>Intel VT-x/EPT</strong></li>
<li><strong>使用 VirtualKD：</strong>下载 VirtualKD，将 target 目录复制到被调试机中，运行 vminst.exe 即可自动完成配置</li>
</ol>

<h4>Root 模式调试（Hypervisor 代码）</h4>

<p>使用 WinDbg 无法调试进入 VT 后 Root 模式下的代码。要调试 Hypervisor 代码，需要使用 IDA Pro + VMware 的 GDB Stub 功能：</p>

<pre><code>// 在虚拟机 .vmx 文件中添加以下配置
debugStub.listen.guest32 = "TRUE"
debugStub.listen.guest64 = "TRUE"
monitor.debugOnStartGuest32 = "TRUE"
debugStub.hideBreakpoints = "TRUE"
bios.bootDelay = "3000"</code></pre>

<p>GDB Stub 分为两部分：当虚拟 CPU 运行于 32 位模式时，在 8832 端口监听；当运行于 x64 模式时，在 8864 端口监听。</p>

<p>配置完成后：</p>

<ol>
<li>在 IDA Pro 中选择 "Debugger" → "Attach" → "Remote GDB Debugger"</li>
<li>设置 Hostname 为 "localhost"，端口为 8832</li>
<li>选择 PID 为 0 的进程进行附加</li>
<li>在 IDA Pro 中加载 Hypervisor.sys 的 PDB 符号文件</li>
</ol>

<div class="tip-box">
<div class="tip-label">双调试器协同工作</div>
- <strong>WinDbg：</strong>调试 Non-Root 模式（Guest OS 内核代码）<br>
- <strong>IDA Pro：</strong>调试 Root 模式（Hypervisor 代码）<br><br>
Hypervisor（Root 模式）中的代码通常不会太多，IDA Pro 加上调试符号基本可满足调试需求。Non-Root 模式使用 WinDbg 效果更好。
</div>

<h2 id="summary">4. 总结</h2>

<table>
<tr><th>概念</th><th>核心要点</th><th>安全意义</th></tr>
<tr>
<td><strong>VT / VMX</strong></td>
<td>Intel 硬件虚拟化技术，引入 VMX Root 和 Non-Root 两种操作模式</td>
<td>创建 Ring -1 特权层，权限高于操作系统 Ring 0</td>
</tr>
<tr>
<td><strong>Hypervisor</strong></td>
<td>运行在 Root 模式的代码，相当于 VMM</td>
<td>拥有"上帝视角"，可监控操作系统的各种行为</td>
</tr>
<tr>
<td><strong>VMCS</strong></td>
<td>虚拟机控制结构，6 个区域，每个 VMCS 代表一个虚拟机</td>
<td>通过 VMCS 控制 #VMExit 的触发条件</td>
</tr>
<tr>
<td><strong>#VMExit / #VMEntry</strong></td>
<td>Root 与 Non-Root 模式的切换事件</td>
<td>所有特权操作都可能触发 #VMExit</td>
</tr>
<tr>
<td><strong>EPT</strong></td>
<td>扩展页表，在 CR3 页表之上增加 GPA → HPA 转换</td>
<td>可对同一 GPA 根据访问类型映射到不同 HPA</td>
</tr>
<tr>
<td><strong>EPT Violation</strong></td>
<td>EPT 地址转换失败时触发的 #VMExit 事件</td>
<td>Hypervisor 可动态修正映射</td>
</tr>
<tr>
<td><strong>VMCALL</strong></td>
<td>Guest OS 与 Hypervisor 的交互指令</td>
<td>Guest OS 主动触发 #VMExit 进入 Hypervisor</td>
</tr>
<tr>
<td><strong>Shadow Walker</strong></td>
<td>利用 EPT 实现代码/数据不同映射的内存隐藏示例</td>
<td>反调试、代码保护、Rootkit 隐藏、游戏保护</td>
</tr>
</table>

<div class="warn-box">
<div class="warn-label">VT 在逆向工程中的重要性</div>
随着越来越多的软件保护方案（如 VMProtect、Themida、腾讯游戏保护等）采用 VT 技术，理解 VT 原理已经成为了高端逆向工程师的必备技能。VT 技术虽然入门门槛较高，但其核心思想——通过硬件虚拟化实现比操作系统更高的权限——并不复杂。关键在于多调试、多实践，逐步积累经验。
</div>

<div class="footer">内容整理自《加密与解密（第4版）》第10章 · 本章由看雪技术专家 程勋德 编写</div>

</div></div>
