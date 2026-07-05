---
title: "加密算法：从 Hash 到 RSA 的逆向识别指南"
date: 2026-06-26
categories: "安全与逆向"
tags: ["加密算法", "逆向", "密码学", "软件保护", "RSA"]
id: "encryption-algorithms-ch6"
---

<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0f1117;--card:#1a1d28;--accent:#6c9eeb;--accent2:#a78bfa;
--text:#e1e4ed;--text2:#9ca3b0;--border:#2a2d3a;--code-bg:#151720;--code-border:#252837;
--tag-bg:#252837;--tag-text:#8b9cc7;--success:#34d399;--warn:#fbbf24;--danger:#f87171;
--code-bg2:#1a1d2e;--formula-bg:#181b28}
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

<div class="hero"><h1>加密算法：从 Hash 到 RSA 的逆向识别指南</h1>
<p class="subtitle">面向逆向分析者的加密算法精简导读 · 附软件保护三层攻防实战</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">加密算法</span><span class="tag">密码学</span><span class="tag">软件保护</span><span class="tag">RSA</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-intro">1. 本章导读</a></li>
<li><a href="#sec-practice">2. 实战：三层保护体系</a>
  <div class="toc-sub">
  <a href="#sec-layer1">2.1 第一层：代码加密（壳）</a>
  <a href="#sec-layer2">2.2 第二层：完整性校验</a>
  <a href="#sec-layer3">2.3 第三层：注册验证</a>
  </div>
</li>
<li><a href="#sec-hash">3. 单向散列算法（Hash）</a>
  <div class="toc-sub">
  <a href="#sec-md5">3.1 MD5</a>
  <a href="#sec-sha">3.2 SHA 家族</a>
  <a href="#sec-sm3">3.3 SM3</a>
  </div>
</li>
<li><a href="#sec-sym">4. 对称加密算法</a>
  <div class="toc-sub">
  <a href="#sec-rc4">4.1 RC4</a>
  <a href="#sec-tea">4.2 TEA</a>
  <a href="#sec-idea">4.3 IDEA</a>
  <a href="#sec-blowfish">4.4 BlowFish</a>
  <a href="#sec-aes">4.5 AES</a>
  <a href="#sec-sm4">4.6 SM4</a>
  </div>
</li>
<li><a href="#sec-asym">5. 公钥加密算法</a>
  <div class="toc-sub">
  <a href="#sec-rsa">5.1 RSA</a>
  <a href="#sec-elgamal">5.2 ElGamal</a>
  </div>
</li>
<li><a href="#sec-summary">6. 核心要点速查</a></li>
<li><a href="#sec-tools">7. 常用工具速查</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-intro">1. 本章导读</h2>

<p>很多软件作者为了保护自己的软件，会自己设计序列号验证算法。但自己设计的算法往往漏洞百出。其实，密码学中已经有大量成熟的、高强度的算法可以直接使用，如 RSA、BlowFish、MD5 等。</p>

<p>对于<strong>逆向分析者</strong>来说，不需要从头理解这些算法的数学原理，只需要能<strong>识别出</strong>程序中用的是哪种算法，然后直接套用该算法的标准代码来编写注册机即可。</p>

<div class="tip-box">
<div class="tip-label">核心思想</div>
加密算法就像"黑盒子"——你不用完全理解盒子内部怎么工作的，你只需要知道这个盒子长什么样（特征），然后去网上找到它的说明书（源码）就能用了。
</div>

<p>本章按三类算法组织：</p>

<table>
<tr><th>类别</th><th>特点</th><th>常见算法</th></tr>
<tr><td><strong>散列函数</strong></td><td>不可逆，输出固定长度</td><td>MD5、SHA、SM3</td></tr>
<tr><td><strong>对称加密</strong></td><td>加解密用同一个密钥</td><td>RC4、TEA、IDEA、BlowFish、AES、SM4</td></tr>
<tr><td><strong>公钥加密</strong></td><td>加解密用不同密钥（公钥/私钥）</td><td>RSA、ElGamal</td></tr>
</table>

<p>在实际的软件保护中，这三种算法不是各干各的，而是<strong>三层叠在一起</strong>协同防守。先让你对整个"战场"有个全景认知。</p>

<h2 id="sec-practice">2. 实战：三层保护体系</h2>

<p>现代商业软件保护（如 VMProtect、Themida、Safengine）通常构筑<strong>三道防线</strong>：</p>

<table>
<tr><th>防线</th><th>用什么算法</th><th>防什么</th><th>破解思路</th></tr>
<tr>
<td><strong>① 代码加密（壳）</strong></td>
<td>对称 AES / 自定义加密</td>
<td>防 IDA 静态分析<br>exe 里全是乱码</td>
<td>跑起来 → 等解密到内存 → dump → 再分析</td>
</tr>
<tr>
<td><strong>② 完整性校验</strong></td>
<td>散列 SHA / CRC</td>
<td>防暴力 Patch<br>改 exe 就闪退</td>
<td>Hook 校验函数，让它永远返回"文件没被改"</td>
</tr>
<tr>
<td><strong>③ 注册验证</strong></td>
<td>公钥 RSA / ECC</td>
<td>防写出注册机<br>没私钥生成不了</td>
<td>Patch 跳转指令，绕过验证</td>
</tr>
</table>

<h3 id="sec-layer1">2.1 第一层：代码加密（壳）— 防静态分析</h3>

<p>你从官网下载的 exe，其实是<strong>被加密压缩过</strong>的。原始代码存在但被 AES 加密成了乱码。</p>

<pre><code>// 加壳前（IDA 能直接看）
00401000  mov eax, [ebp+8]
00401003  push eax
00401004  call CheckRegistration

// 加壳后（IDA 看到乱码）
00401000  8F 3A C7 1B A5 72 1D 4E
00401008  ... （全是乱码，无法反汇编）</code></pre>

<p><strong>保护原理：</strong>exe 被加密了，IDA 打开只能看到一堆乱码字节，无法反汇编成代码。</p>

<p><strong>破解思路：</strong></p>

<ul>
<li>用调试器（x64dbg/OllyDbg）加载 exe 并运行</li>
<li>壳会自己把加密的代码解密到内存中</li>
<li>等解密完成后，把内存 dump 出来</li>
<li>把 dump 出的文件扔回 IDA 分析</li>
<li>或者直接用脱壳工具：UPX -d、OllDbump、Scylla 等</li>
</ul>

<div class="tip-box">
<div class="tip-label">常见壳</div>
UPX（最简）、ASPack、ASProtect、Armadillo、VMProtect（最难）、Themida
</div>

<h3 id="sec-layer2">2.2 第二层：完整性校验 — 防暴力 Patch</h3>

<p>你脱壳后，想把验证跳转改了是吧？软件早就料到这点了——它会在运行时检查自己的 exe 文件有没有被修改。</p>

<pre><code>// 软件启动时做完整性校验
current_hash = SHA256(读取自身 exe 文件)
if (current_hash != 出厂时保存的 hash):
    ExitProcess(0)  // 你改了代码？直接退出
// 校验通过才继续执行</code></pre>

<p><strong>保护原理：</strong>你改了 exe 的任何字节，Hash 就不对，软件直接闪退或弹窗报错。</p>

<p><strong>破解思路：</strong></p>

<ul>
<li>找到软件调用 SHA256/CRC 的地方</li>
<li>Hook 这个校验函数</li>
<li>让它不管读到什么 exe，都返回正确的 hash</li>
</ul>

<pre><code>// Hook 后的效果
SHA256(你修改过的 exe) → return 原始 hash  ✅  // 骗过去了</code></pre>

<div class="warn-box">
<div class="warn-label">注意</div>
有些软件会用"暗桩"——不是在启动时统一校验，而是在不同时机、不同函数里偷偷检查。你一 Patch 某个地方，可能几小时后软件才突然崩溃。
</div>

<h3 id="sec-layer3">2.3 第三层：注册验证 — 防写出注册机</h3>

<p>前两层都被你绕过了，现在到了最后一道防线——验证注册码。</p>

<pre><code>// RSA 注册验证（核心防伪）
if (RSA_Encrypt(用户输入的注册码, 公钥) == 用户名):
    // 注册成功 ✅
else:
    // 注册失败 ❌</code></pre>

<p><strong>为什么前两层的思路在这不管用：</strong></p>

<table>
<tr><th>破解思路</th><th>为什么不行</th></tr>
<tr><td>Dump 内存分析</td><td>✅ 可以看到验证逻辑，但你仍然没有私钥</td></tr>
<tr><td>Hook 校验函数</td><td>❌ 这是 RSA，不是简单的 hash 比较，不能 Hook 让它"返回正确"</td></tr>
<tr><td>写出注册机</td><td>❌ 你没私钥，生成不了合法的注册码</td></tr>
</table>

<p><strong>唯一有效的破解方法：暴力 Patch</strong></p>

<pre><code>// 原始代码
00401234  call  RSA_Verify         ; 验证注册码
00401238  test  eax, eax           ; 检查返回值
0040123A  jz    RegistrationFailed ; 失败则跳走
0040123C  MessageBox "注册成功！"

// Patch 后
0040123A  nop  ; jz 改成 nop nop nop nop nop
// 或者直接改成 jmp RegistrationSuccess</code></pre>

<div class="tip-box">
<div class="tip-label">RSA 的意义</div>
它让你写不出注册机。破解者只能一个一个地 Patch 版本。每出一个新版本，都得重新 Patch 一次。而如果写出了注册机，所有版本一次搞定。
</div>

<h3>实战总结</h3>

<table>
<tr><th>防线</th><th>目标</th><th>方法</th><th>耗时</th></tr>
<tr><td>① 壳（对称加密）</td><td>看到真正的代码</td><td>调试器跑起来 → Dump 内存</td><td>几分钟到几小时</td></tr>
<tr><td>② 完整性校验（Hash）</td><td>绕过校验</td><td>Hook 校验函数</td><td>几十分钟</td></tr>
<tr><td>③ 注册验证（RSA）</td><td>绕过验证</td><td>找到跳转指令 → Patch</td><td>几十分钟</td></tr>
</table>

<div class="warn-box">
<div class="warn-label">现实</div>
所有保护最终都能被破，只是时间成本的问题。职业保护方案（VMProtect 等）的目标不是"破不了"，而是"让破解需要的时间大于软件更新的周期"。
</div>

<h2 id="sec-hash">3. 单向散列算法（Hash）</h2>

<p><strong>散列函数（Hash Function）</strong> 能把任意长度的数据"压缩"成固定长度的"指纹"（消息摘要）。这个过程是<strong>不可逆</strong>的——你不能从指纹反推出原始数据。</p>

<div class="tip-box">
<div class="tip-label">逆向中的应用</div>
在软件保护中，Hash 通常只作为中间步骤：先用 Hash 处理用户名，再对 Hash 结果做可逆加密，最后得到注册码。<br>
对解密者来说，一般不需要理解 Hash 函数的具体细节，只要能识别出是哪种 Hash，直接套用源码即可。
</div>

<h3 id="sec-md5">3.1 MD5 算法</h3>

<p><strong>全称：</strong>Message Digest Algorithm 5，由 Ron Rivest 设计</p>
<p><strong>输出：</strong>128 位（16 字节）的消息摘要</p>
<p><strong>现状：</strong>由于安全原因已不再推荐使用，但软件保护中仍常见</p>

<h4>算法原理（极简版）</h4>

<ul>
<li><strong>数据填充：</strong>在消息末尾补位，使长度满足 448 mod 512</li>
<li><strong>添加长度：</strong>附加 64 位的原始消息长度</li>
<li><strong>初始化 4 个寄存器：</strong>A、B、C、D，用固定的初始值</li>
<li><strong>数据处理：</strong>以 512 位为一组，经过 4 轮（每轮 16 步）变换</li>
<li><strong>输出：</strong>A、B、C、D 级联为 128 位散列值</li>
</ul>

<pre><code>// MD5 初始化常数（也是识别特征！）
A = 0x67452301
B = 0xEFCDAB89
C = 0x98BADCFE
D = 0x10325476</code></pre>

<h4>常见的使用误区</h4>

<p>很多软件作者这样判断注册码：</p>

<pre><code>if (MD5(用户名 + 序列号) == 正确的注册码)
  // 注册成功</code></pre>

<p>❌ 这是<strong>错误的用法</strong>！因为验证时正确的注册码会以明文形式出现在内存中，破解者直接就能找到它。</p>

<h4>逆向识别特征</h4>

<ul>
<li>查找 4 个初始化常数：<code>0x67452301</code>、<code>0xEFCDAB89</code>、<code>0x98BADCFE</code>、<code>0x10325476</code></li>
<li>用 PEiD 的 Krypto ANALyzer 插件扫描，会提示 MD5 的 T 表（64 个常数元素）</li>
<li>跟踪时关注正弦函数表 T[1..64]</li>
</ul>

<div class="tip-box">
<div class="tip-label">对于变形的 MD5</div>
常见的变形方式有 3 种：① 改变初始化常数；② 改变填充方式；③ 改变处理过程。跟踪时关注这几个点即可。
</div>

<h3 id="sec-sha">3.2 SHA 算法家族</h3>

<p><strong>全称：</strong>Secure Hash Algorithm，包括 SHA-1、SHA-256、SHA-384、SHA-512 四种</p>

<table>
<tr><th>算法</th><th>输出长度</th><th>字长</th><th>轮数</th><th>寄存器数</th></tr>
<tr><td>SHA-1</td><td>160 位</td><td>32 位</td><td>80 轮</td><td>5 个</td></tr>
<tr><td>SHA-256</td><td>256 位</td><td>32 位</td><td>64 轮</td><td>8 个</td></tr>
<tr><td>SHA-384</td><td>384 位</td><td>64 位</td><td>80 轮</td><td>8 个</td></tr>
<tr><td>SHA-512</td><td>512 位</td><td>64 位</td><td>80 轮</td><td>8 个</td></tr>
</table>

<p>其中 SHA-384 与 SHA-512 算法结构相同，但初始值不同且 SHA-384 截断输出为 384 位。</p>

<h4>SHA-1 特征常数</h4>

<pre><code>// SHA-1 初始化常数（5 个 32 位寄存器）
H0 = 0x67452301
H1 = 0xEFCDAB89
H2 = 0x98BADCFE
H3 = 0x10325476
H4 = 0xC3D2E1F0

// SHA-1 轮常数 K[0]~K[79]
K[0..19]  = 0x5A827999
K[20..39] = 0x6ED9EBA1
K[40..59] = 0x8F1BBCDC
K[60..79] = 0xCA62C1D6</code></pre>

<h4>SHA-256 特征常数</h4>

<pre><code>// SHA-256 初始化常数（8 个 32 位寄存器）
H0 = 0x6A09E667  H1 = 0xBB67AE85
H2 = 0x3C6EF372  H3 = 0xA54FF53A
H4 = 0x510E527F  H5 = 0x9B05688C
H6 = 0x1F83D9AB  H7 = 0x5BE0CD19

// SHA-256 轮常数 K[0]~K[63]（前 8 个）
K[0..7] = 0x428A2F98 0x71374491 0xB5C0FBCF 0xE9B5DBA5
          0x3956C25B 0x59F111F1 0x923F82A4 0xAB1C5ED5</code></pre>

<h4>SHA-384 特征常数</h4>

<pre><code>// SHA-384 初始化常数（8 个 64 位寄存器）
H0 = 0xCBBB9D5DC1059ED8  H1 = 0x629A292A367CD507
H2 = 0x9159015A3070DD17  H3 = 0x152FECD8F70E5939
H4 = 0x67332667FFC00B31  H5 = 0x8EB44A8768581511
H6 = 0xDB0C2E0D64F98FA7  H7 = 0x47B5481DBEFA4FA4</code></pre>

<h4>SHA-512 特征常数</h4>

<pre><code>// SHA-512 初始化常数（8 个 64 位寄存器）
H0 = 0x6A09E667F3BCC908  H1 = 0xBB67AE8584CAA73B
H2 = 0x3C6EF372FE94F82B  H3 = 0xA54FF53A5F1D36F1
H4 = 0x510E527FADE682D1  H5 = 0x9B05688C2B3E6C1F
H6 = 0x1F83D9ABFB41BD6B  H7 = 0x5BE0CD19137E2179</code></pre>

<h4>逆向识别要点</h4>

<ul>
<li><strong>区分 SHA-1 vs SHA-256：</strong>SHA-1 有 5 个寄存器（MD5 是 4 个），SHA-256 有 8 个寄存器</li>
<li><strong>SHA-256 初始化特征：</strong>在 IDA/OllyDbg 中搜索 8 个常数 H0~H7（以 <code>0x6A09E667</code> 开头）</li>
<li><strong>SHA-384 与 SHA-512 区分：</strong>结构相同但初始值不同。SHA-384 的 H0 以 <code>0xCBBB9D5D...</code> 开头，SHA-512 以 <code>0x6A09E667...</code> 开头</li>
<li><strong>64 位 vs 32 位：</strong>SHA-384/512 使用 64 位寄存器操作，在反汇编中会看到 64 位指令（如 <code>shr rdi, 8</code> 等）</li>
<li><strong>轮常数：</strong>不同 SHA 版本的轮常数不同，PEiD 的 Kanal 插件可以识别</li>
</ul>

<h3 id="sec-sm3">3.3 SM3 密码杂凑算法</h3>

<p><strong>国密算法</strong>，由国家密码局发布。输出 256 位杂凑值。广泛用于商用密码的数字签名和验证、消息认证码等。</p>

<h3>Hash 小结</h3>

<div class="warn-box">
<div class="warn-label">注意</div>
随着密码分析技术的发展，MD5 和 SHA-1 已被证明可以构造碰撞（不同的输入产生相同的输出）。建议软件保护时选用 SHA-256/384/512。<br>
在解密时，只要搞清是哪种 Hash 算法（以及是否变形），就能通过该算法的源代码写出注册机。
</div>

<h2 id="sec-sym">4. 对称加密算法</h2>

<p><strong>核心思想：</strong>加密和解密用<strong>同一个密钥</strong>。安全性取决于算法强度和密钥的保密性。</p>

<div class="tip-box">
<div class="tip-label">正确的用法</div>
把用户输入的注册码（或其散列值）作为密钥，这样破解者只能通过穷举来找到正确的注册码。<br>
❌ 错误的用法：把注册码作为加密的输入或输出——这样密钥会暴露在内存中，破解者可以求逆算法写出注册机。
</div>

<h3 id="sec-rc4">4.1 RC4 流密码</h3>

<p><strong>类型：</strong>流密码（Stream Cipher），而非分组密码</p>
<p><strong>设计者：</strong>Ron Rivest（1987），1994 年公开</p>
<p><strong>应用：</strong>SSL、WEP 等</p>

<h4>原理</h4>

<p>RC4 生成一个伪随机密钥流，与明文进行 XOR（异或）来加解密：</p>

<ul>
<li><strong>KSA（密钥调度算法）：</strong>初始化 256 字节的数组 S，用密钥做置换</li>
<li><strong>PRGA（伪随机生成算法）：</strong>从 S 中生成密钥流，与明文 XOR</li>
</ul>

<pre><code>// KSA - 初始化
for i = 0 to 255:
  S[i] = i
j = 0
for i = 0 to 255:
  j = (j + S[i] + key[i mod keylen]) mod 256
  swap(S[i], S[j])

// PRGA - 生成密钥流
i = 0; j = 0
while (还有数据):
  i = (i + 1) mod 256
  j = (j + S[i]) mod 256
  swap(S[i], S[j])
  k = S[(S[i] + S[j]) mod 256]
  // 用 k 与明文 XOR 得到密文</code></pre>

<div class="tip-box">
<div class="tip-label">RC4 的特点</div>
加密和解密用同一个函数（因为 XOR 两次就还原了），逆向分析时看到 XOR 指令 + 同一个 call 被加解密两处调用，就要联想到 RC4。
</div>

<h4>混合加密（Hybrid Encryption）</h4>

<p>RC4 或任何对称加密，在实际通信中从不单独使用。它们都是跟非对称加密（公钥算法）配合，组成混合加密方案：</p>

<pre><code>// 客户端（发送消息）
会话密钥 = 随机生成的一段数据     // 这是 RC4 要用的密钥，用完就丢
加密后的密钥 = RSA加密(会话密钥, 服务器的公钥)  // 非对称加密保护密钥
加密后的消息 = RC4加密(明文消息, 会话密钥)      // 对称加密保护数据
发送(加密后的密钥 + 加密后的消息)

// 服务端（收到消息）
会话密钥 = RSA解密(加密后的密钥, 自己的私钥)    // 只有服务器能解开
明文消息 = RC4解密(加密后的消息, 会话密钥)</code></pre>

<table>
<tr><th>步骤</th><th>做什么</th><th>用什么算法</th><th>为什么</th></tr>
<tr><td>① 随机生成会话密钥</td><td>客户端临时生成一个"一次性密钥"</td><td>随机数生成</td><td>用完即弃，每次通信都不同</td></tr>
<tr><td>② 加密这个密钥</td><td>用服务器的公钥加密这个会话密钥</td><td>RSA/非对称</td><td>只有服务器能用私钥打开</td></tr>
<tr><td>③ 加密真正的消息</td><td>用会话密钥加密要发送的数据</td><td>RC4/对称</td><td>对称加密速度快</td></tr>
<tr><td>④ 打包发送</td><td>加密后的密钥 + 加密后的消息一起发出去</td><td>—</td><td>"密钥藏在密文里"就是这一步</td></tr>
</table>

<div class="tip-box">
<div class="tip-label">总结</div>
所以这不是"纯对称"也不是"纯非对称"，而是两者结合（混合加密）——<br>
🔐 非对称加密负责安全地送钥匙（会话密钥）<br>
📦 对称加密（如 RC4）负责高效地加密实际消息
</div>

<h3 id="sec-tea">4.2 TEA 算法</h3>

<p><strong>全称：</strong>Tiny Encryption Algorithm，1994 年由 David J. Wheeler 发明</p>
<p><strong>分组长度：</strong>64 位　<strong>密钥长度：</strong>128 位</p>
<p><strong>结构：</strong>Feistel 网络，推荐 32 轮</p>

<h4>特征常数</h4>

<pre><code>// TEA 的密钥调度常数（黄金分割点衍生）
delta = 0x9E3779B9  // (√5 - 1) * 2³¹</code></pre>

<h4>逆向识别要点</h4>

<p>在逆向分析中，看到 <code>0x9E3779B9</code> 这个常数，基本可以确定是 TEA 算法。</p>

<h3 id="sec-idea">4.3 IDEA 算法</h3>

<p><strong>全称：</strong>International Data Encryption Algorithm，由来学嘉和 James Massey 于 1991 年提出</p>
<p><strong>分组长度：</strong>64 位　<strong>密钥长度：</strong>128 位</p>
<p><strong>特点：</strong>使用了 3 种不同的代数群操作：异或、模 2¹⁶ 加法、模 2¹⁶+1 乘法</p>
<p><strong>子密钥：</strong>共 52 个 16 位子密钥，由 128 位密钥循环左移 25 位生成</p>

<h4>逆向识别要点</h4>

<p>IDEA 的乘法逆元计算函数是重要特征（模 65537 乘法运算）。由于 IDEA 算法受专利保护时间较长，PEiD 的 Krypto ANALyzer 可能识别不出来，需要手动跟踪。</p>

<h3 id="sec-blowfish">4.4 BlowFish 算法</h3>

<p><strong>设计者：</strong>Bruce Schneier</p>
<p><strong>分组长度：</strong>64 位　<strong>密钥长度：</strong>32~448 位可变</p>
<p><strong>结构：</strong>16 轮 Feistel 网络</p>

<h4>特征数据</h4>

<ul>
<li><strong>P 数组：</strong>18 个 32 位子密钥（P[1]~P[18]）</li>
<li><strong>S-box：</strong>4 个 8×32 的 S 盒（共 1024 个 32 位值）</li>
<li>P 数组和 S-box 使用 π 的小数部分初始化</li>
</ul>

<pre><code>// BlowFish P 数组初始值（部分）
P[1]  = 0x243F6A88
P[2]  = 0x85A308D3
P[3]  = 0x13198A2E
P[4]  = 0x03707344</code></pre>

<h4>逆向识别要点</h4>

<p>用 PEiD 的 Krypto ANALyzer 可以识别出 BlowFish 的 P 数组和 S-box。在内存中查看 <code>0x243F6A88</code> 等 π 的小数部分常数即可确认。</p>

<h3 id="sec-aes">4.5 AES 算法（高级加密标准）</h3>

<p><strong>当选：</strong>2000 年 NIST 宣布 Rijndael 算法当选 AES</p>
<p><strong>分组长度：</strong>128 位　<strong>密钥长度：</strong>128 / 192 / 256 位</p>
<p><strong>轮数：</strong>AES-128 为 10 轮，AES-192 为 12 轮，AES-256 为 14 轮</p>

<h4>算法结构</h4>

<p>AES 的轮函数由 4 个部分组成：</p>

<ol>
<li><strong>SubBytes</strong> — 字节代换（S-box 查表）</li>
<li><strong>ShiftRows</strong> — 行移位</li>
<li><strong>MixColumns</strong> — 列混合</li>
<li><strong>AddRoundKey</strong> — 轮密钥加</li>
</ol>

<p>其中最后一轮没有 MixColumns 操作。</p>

<h4>AES 的 S-box（特征）</h4>

<p>逆向分析中可以直接在内存中查找 AES 的 S-box（256 字节，从 <code>0x63</code> 开始）和逆 S-box。</p>

<pre><code>// AES S-box 前 16 字节（识别特征）
63 7C 77 7B F2 6B 6F C5 30 01 67 2B FE D7 AB 76</code></pre>

<h4>实际软件中的实现</h4>

<p>实际 AES 软件实现通常以空间换时间——将 SubBytes、ShiftRows、MixColumns 合并为 4 个查找表 T0、T1、T2、T3（各 256 个 32 位值，共 4KB）。这是 AES 实现的重要特征。</p>

<h4>逆向识别要点</h4>

<ul>
<li>PEiD 的 Krypto ANALyzer 能识别 AES 的 S-box 和逆 S-box</li>
<li>查找 4KB 的 T 表（AES 查表法实现的标志）</li>
<li>10/12/14 轮的循环结构</li>
</ul>

<h3 id="sec-sm4">4.6 SM4 分组密码算法</h3>

<p><strong>国密算法</strong>，分组长度 128 位，密钥长度 128 位，采用 32 轮非线性迭代结构。解密与加密结构相同，只是轮密钥使用顺序相反。</p>

<h3>对称加密识别小结</h3>

<ol>
<li>使用 PEiD 的 Krypto ANALyzer（Kanal）插件，大部分常见算法都能识别</li>
<li>通过算法特征判断：是否为 Feistel 网络、加密轮数、密钥长度、子密钥生成过程、S-box 的值等</li>
<li>要确认算法和工作模式（ECB、CBC 等），通常需要自己编写加解密程序来对比验证</li>
</ol>

<h2 id="sec-asym">5. 公开密钥加密算法（非对称加密）</h2>

<p><strong>核心思想：</strong>加密和解密用<strong>不同的密钥</strong>——</p>

<ul>
<li><strong>公钥（Public Key）：</strong>公开，用于加密</li>
<li><strong>私钥（Private Key）：</strong>保密，用于解密</li>
</ul>

<div class="tip-box">
<div class="tip-label">为什么公钥算法更安全</div>
即使破解者用调试器跟踪分析找到公钥，也无法算出私钥（基于 NP 困难问题），因此无法写出注册机。<br>
理想用法：软件作者用私钥生成注册码，软件中用公钥验证。
</div>

<h3 id="sec-rsa">5.1 RSA 算法</h3>

<p><strong>发明者：</strong>Rivest、Shamir、Adleman（1978 年，MIT）</p>
<p><strong>安全性基础：</strong>大整数因式分解的困难性</p>

<h4>极简原理</h4>

<table>
<tr><th>项目</th><th>内容</th></tr>
<tr><td>公钥</td><td>(n, e)，n = p × q（p 和 q 为大素数）</td></tr>
<tr><td>私钥</td><td>d，满足 e·d ≡ 1 mod (p-1)(q-1)</td></tr>
<tr><td>加密</td><td>C = m<sup>e</sup> mod n</td></tr>
<tr><td>解密</td><td>m = C<sup>d</sup> mod n</td></tr>
</table>

<h4>常用 e 值</h4>

<p><code>3</code>、<code>17</code>、<code>65537</code>（0x10001）—— 选这些值可以加快加解密速度</p>

<div class="warn-box">
<div class="warn-label">安全提醒</div>
<ul>
<li>模数 n 至少 1024 位才有安全保障（128 位的 n 一分钟内就能被分解）</li>
<li>生成密钥对时要使用好的随机数生成器</li>
<li>如果用 RSA 做注册保护，公钥 e 不要用 3、65537 等常用值</li>
</ul>
</div>

<h4>如何攻击 RSA 保护</h4>

<ol>
<li>通过跟踪分析找到模数 n 和公钥 e</li>
<li>对 n 进行因式分解，得到 p 和 q</li>
<li>计算私钥 d</li>
<li>用 d 编写注册机</li>
</ol>

<p>常用工具：<strong>RSATool</strong>、<strong>Factor</strong>、<strong>PPSIQS</strong> 等</p>

<div class="tip-box">
<div class="tip-label">如果 n 太长无法分解</div>
可以"替换 n"——生成一个位数相同的 n（此时你知道私钥），然后用逆向技术替换软件中的 n。这样就可以用自己的私钥来编写注册机了。
</div>

<h3 id="sec-elgamal">5.2 ElGamal 公钥算法</h3>

<p><strong>安全性基础：</strong>有限域上计算离散对数的困难性</p>
<p><strong>功能：</strong>既可用于加密，也可用于数字签名</p>

<h4>应用思路</h4>

<p>用 ElGamal 签名算法生成注册码：</p>

<ol>
<li>生成密钥对（大素数 p、生成元 g、私钥 x、公钥 y = g<sup>x</sup> mod p）</li>
<li>将注册码分成签名 (a, b) 两部分</li>
<li>用 MD5 取得用户名的散列值</li>
<li>验证 y<sup>a</sup> · a<sup>b</sup> ≡ g<sup>hash</sup> mod p 是否成立</li>
</ol>

<h2 id="sec-summary">6. 核心要点速查</h2>

<table>
<tr><th>算法</th><th>类型</th><th>关键特征 / 常数</th><th>识别工具</th></tr>
<tr><td>MD5</td><td>散列</td><td>A=0x67452301, B=0xEFCDAB89, C=0x98BADCFE, D=0x10325476</td><td>Kanal 插件</td></tr>
<tr><td>SHA-1</td><td>散列</td><td>5 个寄存器（H0=0x67452301…）+ 轮常数 K</td><td>Kanal 插件</td></tr>
<tr><td>SHA-256</td><td>散列</td><td>8 个寄存器（H0=0x6A09E667…）+ 64 轮 K</td><td>Kanal 插件</td></tr>
<tr><td>SHA-384</td><td>散列</td><td>8 个 64 位寄存器（H0=0xCBBB9D5D…）</td><td>手动分析</td></tr>
<tr><td>SHA-512</td><td>散列</td><td>8 个 64 位寄存器（H0=0x6A09E667…）+ 80 轮 K</td><td>手动分析</td></tr>
<tr><td>RC4</td><td>对称</td><td>256 字节 S 数组 + XOR 操作</td><td>手动分析</td></tr>
<tr><td>TEA</td><td>对称</td><td>delta = 0x9E3779B9</td><td>手动分析</td></tr>
<tr><td>IDEA</td><td>对称</td><td>模 65537 乘法 + 52 个子密钥</td><td>手动分析</td></tr>
<tr><td>BlowFish</td><td>对称</td><td>P[1]=0x243F6A88（π 小数部分）</td><td>Kanal 插件</td></tr>
<tr><td>AES</td><td>对称</td><td>S-box: 63 7C 77 … / 4KB T 表</td><td>Kanal 插件</td></tr>
<tr><td>RSA</td><td>公钥</td><td>公钥 (n, e)，私钥 d，常用 e=65537</td><td>RSATool</td></tr>
<tr><td>ElGamal</td><td>公钥</td><td>基于离散对数</td><td>手动分析</td></tr>
</table>

<div class="tip-box">
<div class="tip-label">学习建议</div>
<ul>
<li>先不要纠结数学原理，重点学如何识别各种算法</li>
<li>实践时先用 PEiD 的 Kanal 插件扫描目标程序，快速定位算法类型</li>
<li>然后打开 OllyDbg / IDA Pro，根据特征常数确认并跟踪分析</li>
<li>确认算法后，直接找该算法的标准源码来编写注册机</li>
<li>多看随书文件中的 KeyGenMe 实例，动手跟踪调试</li>
</ul>
</div>

<div class="warn-box">
<div class="warn-label">重要提醒</div>
工具只起辅助作用，不能完全依赖。有些算法（如 IDEA）Kanal 可能识别不出来，最终还是需要自己根据算法特征来手动跟踪分析。
</div>

<h2 id="sec-tools">7. 常用工具速查</h2>

<table>
<tr><th>工具</th><th>用途</th></tr>
<tr><td>PEiD + Krypto ANALyzer</td><td>扫描 PE 文件，识别加密算法类型</td></tr>
<tr><td>RSATool</td><td>生成 RSA 参数、因式分解 n、计算 d</td></tr>
<tr><td>BigCalc</td><td>大数计算器（模幂运算等）</td></tr>
<tr><td>Factor / PPSIQS</td><td>大整数因式分解</td></tr>
<tr><td>Miracl 库</td><td>大数运算库，常用于实现 RSA 等公钥算法</td></tr>
</table>

<div class="footer">内容整理自《加密与解密（第4版）》第6章 · 段钢 主编，已做精简和重新组织</div>

</div></div>
