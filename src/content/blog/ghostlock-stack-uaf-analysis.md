---
title: "GhostLock 栈 UAF 原理浅析：从用户态投毒到内核态提权"
date: 2026-07-17
categories: "Android"
tags: ["内核安全", "UAF", "Linux内核", "漏洞分析", "Android"]
id: "ghostlock-stack-uaf-analysis"
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

<div class="hero"><h1>GhostLock 栈 UAF 原理浅析：从用户态投毒到内核态提权</h1>
<p class="subtitle">一次关于内核 futex PI 路径中栈释放后引用的学习记录</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">内核安全</span><span class="tag">UAF</span><span class="tag">Linux内核</span><span class="tag">漏洞分析</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 漏洞概述</a></li>
<li><a href="#s2">2. 什么是栈 UAF</a></li>
<li><a href="#s3">3. GhostLock 的技术细节</a></li>
<li><a href="#s4">4. 利用链解析</a></li>
<li><a href="#s5">5. 关键概念辨析</a></li>
<li><a href="#s6">6. 对逆向学习者的启发</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 漏洞概述</h2>

<p>CVE-2026-43499（代号 GhostLock）是 Linux 内核 futex PI（优先级继承）路径中发现的一个栈 Use-After-Free 漏洞。根据公开资料，这个漏洞在所有 Linux 发行版中已存在超过 15 年，影响范围覆盖几乎所有运行 Linux 内核的设备——从服务器到 Android 手机。</p>

<p>这个漏洞被用于 Nebula Security 公开的 IonStack 利用链中，该链从 Firefox 渲染器（SpiderMonkey JIT 类型混淆）切入，经过内核提权，最终获得 Android 设备的 root 权限。</p>

<p>本文不涉及具体的 exploit 代码或未公开细节，仅从原理层面讨论这个漏洞的机制和利用思路。</p>

<h2 id="s2">2. 什么是栈 UAF</h2>

<p>UAF（Use-After-Free）通常与堆内存关联——堆上的一块内存被释放后，程序还在使用指向它的指针。但 UAF 也可以发生在栈上，这就是栈 UAF。</p>

<p>栈 UAF 的发生场景比较特殊。一个线程的栈通常在其生命周期内是稳定的，但在以下情况下可能出现问题：</p>

<ul>
  <li>线程退出时栈被回收，但其他执行上下文仍持有指向该栈的指针</li>
  <li>内核在异步路径中（如定时器回调、超时处理）保存了指向某线程栈的指针</li>
  <li>这个指针在栈被回收后仍被解引用</li>
</ul>

<p>栈 UAF 比堆 UAF 更难触发，也更容易被忽视，因为开发者通常认为"栈是安全的"——一个函数返回后其栈帧就失效了，这是常识。但在内核的异步路径中，这种常识不一定成立。</p>

<div class="warn-box">
  <div class="warn-label">WARN</div>
  堆 UAF 是分配器把释放的内存重新分配给别人，栈 UAF 是栈内存所在的物理页被回收或映射给其他用途。两者的核心问题都是"内存语义失效后继续访问"。
</div>

<h2 id="s3">3. GhostLock 的技术细节</h2>

<h3>3.1 futex PI 的工作原理</h3>

<p>futex（Fast Userspace Mutex）是 Linux 中实现用户态同步的原语。普通的 futex 只处理争用情况——当锁被持有时，等待线程挂入等待队列并阻塞。</p>

<p>PI futex（优先级继承 futex）是它的增强版本，用于解决优先级反转问题。当一个低优先级线程持有锁，高优先级线程在等待时，低优先级线程会临时继承高优先级的调度优先级，从而更快释放锁。</p>

<p>PI futex 使用了一种称为 PI 链（PI chain）的数据结构来追踪锁的依赖关系。每个等待 PI futex 的线程在内核中会被表示为一个 <code>rt_mutex_waiter</code> 结构体，挂入 PI 链中。</p>

<h3>3.2 Requeue 机制</h3>

<p>futex 的 requeue 操作用于将等待在一个 futex 上的线程转移到另一个 futex 的等待队列上。PI requeue 则是这种操作的 PI 变体，它会把 waiter 从一个非 PI futex 的等待队列转移到目标 PI futex 的 PI 链中。</p>

<p>操作流程大致如下：</p>

<ul>
  <li>线程 A（waiter）调用 <code>futex WAIT_REQUEUE_PI</code> 等待在 futex A 上，设置超时</li>
  <li>线程 B（主线程）调用 <code>futex CMP_REQUEUE_PI</code> 将线程 A 转移到 futex B（PI futex）的 PI 链</li>
  <li>如果超时先发生，内核会执行清理路径：将线程 A 从等待队列中移除，恢复执行</li>
</ul>

<h3>3.3 漏洞触发点</h3>

<p>漏洞发生在超时清理路径中。当 waiter 线程在等待期间超时，内核的清理代码会去读取栈上保存的 <code>rt_mutex_waiter</code> 指针，以便从 PI 链中移除它——但此时该线程的栈可能已经被释放或复用。</p>

<blockquote>waiter 在等待期间其 task 栈可能被释放/复用，而清理代码仍按栈上保存的指针去解引用、去操作 PI 树，形成栈 UAF。</blockquote>

<p>这个场景不容易直观理解，可以做一个类比：</p>

<p>想象你在一家餐馆吃饭，服务员在你的桌号本上记下了你点的菜（内核在 waiter 的栈上保存了指针）。然后你去洗手间了（线程等待）。等你回来时，你的桌子被收走了，换了一张新桌子坐了别人（栈被回收复用）。但服务员还拿着原来的桌号本去取菜（清理代码读取栈上指针），结果取到了别人的东西。</p>

<h2 id="s4">4. 利用链解析</h2>

<h3>4.1 从栈 UAF 到代码执行</h3>

<p>漏洞触发时，内核读到了已经失效的栈内存。如果攻击者能在栈被回收后、内核读它之前，在这块内存上铺上可控的数据，就能控制内核读到的内容。这就是利用的核心思路。</p>

<p>在 GhostLock 的利用中，攻击者通过 <code>pselect</code> 系统调用在栈上铺设伪造数据。<code>pselect</code> 的参数中包含一个 <code>fd_set</code>，这个 <code>fd_set</code> 会直接放在内核栈上。攻击者精心构造 <code>fd_set</code> 中的位模式，使其在内存中呈现为伪造的 <code>rt_mutex_waiter</code> 结构体。当超时清理路径读到这块被回收的栈内存时，读到的是攻击者构造的伪数据。</p>

<p>这里有一个关键限制：内核的间接函数调用受到 CFI（Control Flow Integrity，控制流完整性）的保护，不能跳转到任意地址。这意味着攻击者不能简单地覆盖一个函数指针然后跳转到任意 gadget。</p>

<h3>4.2 利用链的分层结构</h3>

<p>从漏洞触发到最终 root，利用链是分层的：</p>

<ol>
  <li><strong>漏洞触发层</strong>：利用栈 UAF 获得内核态的初始代码执行</li>
  <li><strong>原语构造层</strong>：劫持 <code>ashmem_misc.fops</code>（file_operations 表），将文件操作指向攻击者控制的函数。这里选择 ashmem 是因为它的 fops 表在 CFI 检查中相对容易绕过</li>
  <li><strong>物理内存读写层</strong>：通过伪造 <code>pipe_buffer</code> 的 <code>ops</code> 表，实现任意物理地址读取和写入。这是通过 slab 堆风水技术，释放 <code>pipe_buffer</code>、用受控页回收、填入伪造的 <code>ops</code> 指针来实现的</li>
  <li><strong>提权层</strong>：有了物理内存读写后，直接修改内核数据结构——遍历 <code>init_task.tasks</code> 找到目标进程，改写 <code>cred</code> 结构体（uid/gid/caps 置 0）、清掉 <code>TIF_SECCOMP</code> 标志、将 SELinux SID patch 为 <code>kernel_sid</code></li>
</ol>

<h3>4.3 为什么不能纯用户态完成</h3>

<p>一个容易被混淆的问题是：既然 <code>pselect</code> 是用户态系统调用，那是不是纯用户态就能完成利用？答案是否定的。关键在于：</p>

<ul>
  <li><strong>pselect 只是投毒</strong>——攻击者在自己的栈上铺了伪造数据</li>
  <li><strong>内核自己中毒</strong>——是内核代码读了这块栈内存并执行了伪造的指针</li>
  <li>从伪造指针被执行的那一刻起，代码就已经在内核态（ring 0）了</li>
</ul>

<p>修改 <code>ashmem_misc.fops</code> 需要写内核内存、伪造 <code>pipe_buffer-&gt;ops</code> 需要操作内核 slab、改 <code>cred</code> 需要访问内核数据结构——这些全部需要内核态权限，纯用户态不可能完成。</p>

<div class="tip-box">
  <div class="tip-label">KEY INSIGHT</div>
  整个利用链的"入口"是用户态可控的（pselect 的参数），但突破权限边界的关键是让内核去读用户铺好的数据。这个模式在 kernel exploit 中很常见：用户态负责布局，内核负责执行。
</div>

<h2 id="s5">5. 关键概念辨析</h2>

<h3>5.1 死锁 vs. 栈 UAF</h3>

<p>futex 涉及到锁的操作，很容易让人联想到"死锁"。但 GhostLock 不是死锁：</p>

<table>
  <tr><th>概念</th><th>死锁 (Deadlock)</th><th>栈 UAF (GhostLock)</th></tr>
  <tr><td>本质</td><td>锁语义问题</td><td>内存安全问题</td></tr>
  <tr><td>表现</td><td>线程永久阻塞</td><td>访问已释放的栈内存</td></tr>
  <tr><td>后果</td><td>程序卡死</td><td>可能被利用执行任意代码</td></tr>
  <tr><td>修复方式</td><td>加锁顺序规范</td><td>生命周期管理、引用计数</td></tr>
</table>

<h3>5.2 堆 UAF vs. 栈 UAF</h3>

<table>
  <tr><th>属性</th><th>堆 UAF</th><th>栈 UAF</th></tr>
  <tr><td>释放对象</td><td>堆上分配的缓冲区</td><td>线程的栈帧或整个栈</td></tr>
  <tr><td>触发难度</td><td>较常见</td><td>较罕见</td></tr>
  <tr><td>利用方式</td><td>堆喷、slab 风水</td><td>需要精确控制栈布局</td></tr>
  <tr><td>保护机制</td><td>KASLR、CFI、SLAB_FREELIST_HARDENED</td><td>同上 + 栈保护</td></tr>
</table>

<h2 id="s6">6. 对逆向学习者的启发</h2>

<p>虽然内核漏洞利用和常规逆向工程看起来是不同领域，但技术手段和思维方式是相通的：</p>

<p><strong>理解结构体布局</strong>——无论在用户态还是内核态，看懂结构体成员和偏移都是基本功。内核 exploit 需要精确知道 <code>cred</code> 的 <code>uid</code> 字段在偏移多少，这和逆向时需要知道某个类对象的虚表在偏移多少，本质是一样的。</p>

<p><strong>追踪异步路径</strong>——futex 的 requeue 超时路径是一个异步路径：主路径（requeue）和超时路径（清理）之间是竞态关系。在逆向工程中，分析回调、定时器、信号处理等异步路径时，也要考虑类似的"谁先到达"问题。</p>

<p><strong>内存生命周期</strong>——"保存指针，稍后使用"是编程中非常常见的模式。但如果中间存在等待、阻塞、让出 CPU 等操作，就必须考虑指针指向的内存是否仍然有效。这在逆向分析中也是一个重要的观察点。</p>

<p>这篇文章是纯粹的学习笔记，所有内容均来自公开的漏洞原理讨论和通用的计算机系统知识。撰写目的是记录和梳理自己对这些底层机制的理解，希望能帮助到同样在学习这个方向的读者。</p>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
