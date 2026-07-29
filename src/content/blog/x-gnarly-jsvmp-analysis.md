---
title: "X-Gnarly 332 位签名还原：从 JSVMP 语义插桩到纯算法复现"
date: 2026-07-28
categories: "Android"
tags: ["X-Gnarly", "JSVMP", "JavaScript逆向", "动态插桩", "ChaCha"]
id: "x-gnarly-jsvmp-analysis"
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

<div class="hero"><h1>X-Gnarly 332 位签名还原：从 JSVMP 语义插桩到纯算法复现</h1>
<p class="subtitle">以 webmssdk 5.2.1 为样本，解析数据封装、变种流加密与差分验证方法</p>
<div class="hero-meta"><span class="tag tag-accent">Android</span><span class="tag">X-Gnarly</span><span class="tag">JSVMP</span><span class="tag">动态插桩</span><span class="tag">ChaCha</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 问题背景与分析边界</a></li>
<li><a href="#s2">2. 为什么 JSVMP 不适合直接硬啃</a></li>
<li><a href="#s3">3. 语义插桩：从指令噪声提升到数据流</a></li>
<li><a href="#s4">4. 四阶段生成链路</a></li>
<li class="toc-sub"><a href="#s4-1">4.1 TLV 序列化</a></li>
<li class="toc-sub"><a href="#s4-2">4.2 ChaCha 结构变体</a></li>
<li class="toc-sub"><a href="#s4-3">4.3 密钥嵌入与编码</a></li>
<li><a href="#s5">5. 动态变量、常量与版本耦合</a></li>
<li><a href="#s6">6. 如何建立可信的对拍验证</a></li>
<li><a href="#s7">7. 可迁移的逆向方法论</a></li>
<li><a href="#s8">8. 风险、局限与进一步研究</a></li>
<li><a href="#s9">9. 延伸：我的 Windows 软件逆向工作流</a></li>
</ul></div>

<div class="article-content">

<div class="warn-box">
<div class="warn-label">研究范围</div>
本文用于理解前端保护、虚拟机混淆和动态数据流分析方法。具体实现具有明显版本与运行环境依赖，不应被用于绕过平台访问控制、批量抓取或违反服务条款的自动化行为。
</div>

<h2 id="s1">1. 问题背景与分析边界</h2>

<p>TikTok Web 的部分接口会携带 <code>X-Bogus</code> 与 <code>X-Gnarly</code> 等客户端计算参数。原始案例选择 <code>/api/post/item_list</code> 作为观测入口，目标 SDK 为 <code>webmssdk 5.2.1</code>。其中，<code>X-Gnarly</code> 的输出长度固定为 332 个字符，生成逻辑位于 <code>byted_acrawler</code> SDK 的虚拟化执行路径中。</p>

<p>与普通的变量改名、控制流平坦化不同，JSVMP 会将原始程序编译为自定义字节码，再由 JavaScript 编写的解释器逐条调度。分析者在源码层看到的主要是取指、译码、栈操作与 opcode 分发，而不是签名算法本身。原文的核心贡献，不是“猜出一种加密算法”，而是通过动态证据把黑盒计算分解为可验证的协议阶段。</p>

<blockquote>本文基于看雪社区作者“红皮西瓜”的公开研究进行结构化整理，并补充协议分析与验证方法。原文：<a href="https://mp.weixin.qq.com/s/WVFirSjHfjRQBcEKt4Bn6w" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">基于 GLM-5.2 的 X-Gnarly（332 位）纯算还原分析</a>。</blockquote>

<h2 id="s2">2. 为什么 JSVMP 不适合直接硬啃</h2>

<p>传统静态分析假设“源代码结构与业务语义仍存在可追踪关系”。JSVMP 则主动破坏这个假设：算术、比较、属性访问和调用都可能变成虚拟指令，真实控制流被折叠进解释器循环。即使完成 opcode 映射，分析者仍需重建虚拟栈、虚拟寄存器、异常路径与动态对象语义，成本会随版本快速上升。</p>

<table>
<tr><th>分析策略</th><th>优势</th><th>主要瓶颈</th></tr>
<tr><td>纯静态反编译</td><td>覆盖面完整，可复查全部分支</td><td>虚拟指令数量大，业务语义被解释器噪声淹没</td></tr>
<tr><td>补浏览器环境</td><td>便于在 Node.js 中重复运行</td><td>环境探针、原型链与时序行为难以一次补齐</td></tr>
<tr><td>动态语义插桩</td><td>直接观察调用参数、返回值和关键运算</td><td>日志体量大，需严格控制观测点与样本变量</td></tr>
<tr><td>完整去虚拟化</td><td>理论上能恢复高层逻辑</td><td>工程成本最高，且对 SDK 小版本高度敏感</td></tr>
</table>

<p>因此，更现实的路线是把浏览器当作“可信执行器”，在不理解所有虚拟指令的前提下，记录关键值如何进入、变换和离开算法边界。这是一种由<strong>解释虚拟机</strong>转向<strong>解释数据流</strong>的策略。</p>

<h2 id="s3">3. 语义插桩：从指令噪声提升到数据流</h2>

<p>原始工作流通过特征匹配定位 SDK 内的 <code>.call()</code>、<code>.apply()</code> 与关键二元/三元运算，在这些位置注入统一记录器，再通过页面请求拦截，将线上 SDK 替换为本地插桩版本。一次运行可以产生约 28 万行语义日志。</p>

<pre><code>// 示意代码：重点是记录调用边界，而非绑定某个压缩变量名
function traceCall(site, fn, receiver, args) {
  const result = Reflect.apply(fn, receiver, args);
  log({
    site,
    functionType: typeof fn,
    args: snapshot(args),
    result: snapshot(result)
  });
  return result;
}</code></pre>

<p>高质量插桩必须解决三个问题。第一，<strong>可定位性</strong>：每条记录需要携带稳定的源码位置或逻辑站点编号。第二，<strong>可序列化性</strong>：循环引用、TypedArray、函数与 DOM 对象不能直接交给 <code>JSON.stringify</code>。第三，<strong>低扰动性</strong>：记录器不得修改 <code>this</code>、参数求值顺序、异常传播和 Promise 调度，否则观测结果本身可能改变签名。</p>

<div class="tip-box">
<div class="tip-label">关键技巧</div>
不要从 28 万行日志中搜索“最终答案”，而应先用输入变化设计实验：仅改变 query、UA 或时间戳中的一个变量，比较哪些中间值随之变化。差分传播路径往往比单次完整日志更能揭示字段含义。
</div>

<h2 id="s4">4. 四阶段生成链路</h2>

<p>根据原文的动态轨迹，完整链路可以抽象为四个阶段：</p>

<pre><code>(queryString, userAgent, timestamp)
            │
            ▼
  TLV 序列化：17 个字段 → 约 200 字节
            │
            ▼
  ChaCha 结构变体：200 字节密文
            │
            ▼
  按动态分割点嵌入 48 字节 key：248 字节 W
            │
            ▼
  添加协议前缀并使用自定义 Base64：332 字符</code></pre>

<h3 id="s4-1">4.1 TLV 序列化：先定义协议，再谈加密</h3>

<p>输入首先被组织为 17 元素的混合数组，字段包含查询串摘要、空串摘要、User-Agent 摘要、秒级时间戳、SDK 版本号、内部版本号、固定参数以及校验值。数组在序列化前会经过由线性同余生成器驱动的 Fisher–Yates 洗牌。</p>

<pre><code>seed = (1664525 × seed + 1013904223) mod 2³²
j    = floor((seed / 2³²) × (i + 1))
swap(arr[i], arr[j])</code></pre>

<p>这里的 LCG 并不提供密码学安全随机性。它的作用更接近<strong>确定性的字段重排</strong>：相同种子必然产生相同排列，便于协议两端同步解析，同时增加静态阅读难度。序列化采用 <code>[Tag:1B][Length:2B][Value:NB]</code> 的 TLV 结构，整数按取值范围编码为 2 或 4 字节大端数据，字符串使用 UTF-8；头部记录字段总数 <code>0x11</code>。</p>

<p>值得注意的是，“固定输出为 200 字节”是特定样本与输入约束下的观测结果，而非 TLV 结构天然保证的性质。只要字符串字段长度变化，原始载荷长度理论上就可能变化。因此，复现时应以编码规则为准，而不能把 200 写成无条件断言。</p>

<h3 id="s4-2">4.2 ChaCha 结构变体：相似不等于兼容</h3>

<p>第二阶段使用由 16 个 32 位字组成的 ARX 状态矩阵。ARX 指 Addition、Rotation、XOR，即模加、循环移位和异或。其 Quarter Round 保留了 ChaCha 常见的 <code>16 / 12 / 8 / 7</code> 位旋转常数：</p>

<pre><code>function quarterRound(x, a, b, c, d) {
  x[a] = (x[a] + x[b]) | 0; x[d] = rotl32(x[d] ^ x[a], 16);
  x[c] = (x[c] + x[d]) | 0; x[b] = rotl32(x[b] ^ x[c], 12);
  x[a] = (x[a] + x[b]) | 0; x[d] = rotl32(x[d] ^ x[a],  8);
  x[c] = (x[c] + x[d]) | 0; x[b] = rotl32(x[b] ^ x[c],  7);
}</code></pre>

<p>但该实现不能直接等同于标准 ChaCha：初始状态字、48 字节密钥布局、动态轮数以及对角线轮索引均存在定制。标准实现中的“列轮 + 对角线轮”依赖特定索引形成扩散；哪怕只替换一个索引，最终密钥流也会完全不同。每个 64 字节块完成轮函数后，再执行 feed-forward，将变换后状态与初始状态逐字相加，随后与明文异或；计数器递增后处理下一块。</p>

<div class="warn-box">
<div class="warn-label">实现陷阱</div>
JavaScript 的 Number 是 IEEE-754 双精度浮点数。复现 32 位 ARX 运算时必须显式约束无符号溢出，例如使用 <code>Math.imul</code>、<code>&gt;&gt;&gt; 0</code> 与正确的循环移位；否则高位精度和符号扩展会造成难以定位的差异。
</div>

<h3 id="s4-3">4.3 密钥嵌入与自定义 Base64</h3>

<p>密文生成后，算法根据密文与密钥数据计算动态分割点，把 48 字节 <code>key48</code> 插入 200 字节密文，形成 248 字节数据块 <code>W</code>。随后添加固定协议前缀 <code>0x4B</code>，总长度变为 249 字节。</p>

<p><code>249 ÷ 3 = 83</code>，而 Base64 每 3 字节映射为 4 个字符，所以编码结果恰好为 <code>83 × 4 = 332</code> 个字符，无需填充。这解释了 332 位长度的结构来源：它不是随机设计的字符串长度，而是二进制协议长度经 Base64 膨胀后的确定结果。</p>

<p>最后一步使用置换后的 64 字符字母表。它改变的是 6 bit 数值到字符的映射，不改变 Base64 的分组模型。逆向时应先恢复字符索引，再按标准 Base64 位拼接反解；直接调用系统 Base64 解码器会因为字母表不一致而产生错误字节。</p>

<h2 id="s5">5. 动态变量、常量与版本耦合</h2>

<table>
<tr><th>类别</th><th>代表字段</th><th>验证方式</th></tr>
<tr><td>请求动态量</td><td>queryString、User-Agent、timestamp</td><td>单变量实验，观察摘要与 TLV 字段传播</td></tr>
<tr><td>会话/环境量</td><td>可能由页面状态、设备特征或运行时生成的数据</td><td>跨会话、跨浏览器、跨设备对比</td></tr>
<tr><td>样本常量</td><td>状态字、内部版本号、部分 TLV 字段</td><td>同一 SDK 多批次 trace 交叉验证</td></tr>
<tr><td>算法常量</td><td>LCG 参数、旋转位数、编码字母表</td><td>跨输入稳定，且能解释完整变换</td></tr>
</table>

<p>原文将若干值作为静态常量使用，这对于固定版本的复现实验是可行的，但不能自然推出它们在所有设备、账号、地区或 SDK 版本中都恒定。专业的结论应写成“在已采集样本中保持不变”，并记录样本数量、环境指纹与 SDK 哈希。</p>

<p>尤其需要区分<strong>密钥材料</strong>与<strong>协议常量</strong>。如果某个 48 字节值在一次会话中固定，它仍可能来自启动阶段、服务端下发或设备派生。只有跨冷启动、跨账号和跨版本实验均不变化，才有资格暂时归类为版本常量。</p>

<h2 id="s6">6. 如何建立可信的对拍验证</h2>

<p>“接口返回成功”只能说明某次请求被接受，不能单独证明每个中间步骤都正确。更可靠的验证体系应同时包含正向对拍、逆向解包与消融实验。</p>

<ol>
<li><strong>固定输入：</strong>冻结 query、UA、timestamp 及环境状态，保存原 SDK 的最终输出。</li>
<li><strong>逐阶段对拍：</strong>比较 TLV 明文、每个 64 字节密钥流块、密文、分割点、W 数据块与最终字符串。</li>
<li><strong>逆向解包：</strong>对最终 332 字符结果反编码，验证前缀、长度、嵌入 key 与密文能否无损恢复。</li>
<li><strong>单变量扰动：</strong>分别改变 query、UA 和 timestamp，确认变化传播到预期字段而非无关字段。</li>
<li><strong>负向测试：</strong>修改一个 bit、轮索引或字母表字符，确认中间差异及服务端行为符合预期。</li>
</ol>

<pre><code>assert(encoded.length === 332);
assert(decoded.length === 249);
assert(decoded[0] === 0x4b);
assert(equal(local.tlv, trace.tlv));
assert(equal(local.ciphertext, trace.ciphertext));
assert(local.signature === trace.signature);</code></pre>

<p>原文列出的多批次 trace 已实现最终结果一致。进一步工程化时，建议把每个阶段保存为十六进制测试向量，并为版本升级建立回归测试。一旦 SDK 更新，只需定位首个失配阶段，而不是重新从最终请求失败开始排查。</p>

<h2 id="s7">7. 可迁移的逆向方法论</h2>

<p>这类案例最值得复用的并非某组常量，而是一套面向虚拟化 JavaScript 的实验方法：</p>

<ul>
<li><strong>先找稳定边界：</strong>网络请求、摘要函数、TypedArray 构造、编码器和函数调用点都比 opcode 更接近业务语义。</li>
<li><strong>先恢复数据格式：</strong>长度、前缀、字段数量、字节序和分组规律通常比算法名称更容易被证实。</li>
<li><strong>用差分代替猜测：</strong>一次只改变一个输入，沿日志追踪影响范围，建立输入到字段的因果映射。</li>
<li><strong>让模型做归纳，不让模型替代证据：</strong>大模型适合聚类重复轨迹、生成验证脚本和提出候选结构，但常量、分支与公式必须回到 trace 对拍。</li>
<li><strong>保留可复现实验包：</strong>SDK 哈希、页面版本、浏览器版本、输入向量、插桩补丁和阶段输出应共同归档。</li>
</ul>

<p>从工程视角看，语义插桩本质上是一种动态程序切片：它不试图重建全部程序，而是围绕目标输出，逐步缩小与结果相关的值、操作和调用集合。当插桩点能够覆盖输入进入、核心变换与输出离开三个边界时，完整去虚拟化往往不再是必要条件。</p>

<h2 id="s8">8. 风险、局限与进一步研究</h2>

<p>当前链路仍有三类重要局限。第一，部分常量来自特定环境 trace，缺乏跨环境稳定性证明。第二，原文公开页面中的若干公式和索引以富文本对象呈现，纯文本提取无法完整恢复，因此不应凭上下文补造。第三，服务端校验可能同时关联 Cookie、TLS 指纹、请求顺序与行为信号；单一签名参数正确并不等于请求语义完整。</p>

<p>进一步研究可以围绕三条线展开：一是建立多版本 SDK 的结构差分，判断哪些是稳定协议层、哪些是变动保护层；二是为插桩日志设计二进制/列式存储与污点标签，降低几十万行 JSON 的分析成本；三是将协议推断转化为属性测试，例如自动验证字段排列可逆性、计数器单调性、编码长度不变量与单 bit 扩散特征。</p>

<div class="danger-box">
<div class="danger-label">结论边界</div>
本文可以确认的是原始研究所展示的四阶段数据通路及其验证思路；不能仅凭公开文本断言所有常量在其他账户、设备或未来 SDK 版本中仍然有效。任何复现结论都应绑定具体 SDK 哈希、运行环境和测试向量。
</div>

<p>真正高质量的还原，不是让一段代码“偶尔能发包”，而是能够回答：每个字节从哪里来、为何这样编码、改变输入后如何传播、版本变化时首先在哪里失配。达到这个标准，才算从黑盒调用走向了可审计的算法复现。</p>
<h2 id="s9">9. 延伸：我的 Windows 软件逆向工作流</h2>

<div class="tip-box">
<div class="tip-label">作者补充</div>
本节是我在 Windows 原生软件分析实践中独立总结的工作流，不属于前述看雪文章的原始内容。这里将它作为方法论延伸，用于说明 JSVMP 语义插桩与原生程序动态逆向之间的共性。
</div>

<p>阅读这个 JSVMP 案例时，我发现它与自己分析 Windows 软件的流程高度一致。两者面对的代码载体不同：前者处理 JavaScript 自定义虚拟机和字节码，后者处理 EXE、DLL、汇编、寄存器与原生内存；但核心都是以执行证据限定范围，再通过中间数据逐步恢复算法。</p>

<h3>9.1 第一步：用执行流限定真实分析范围</h3>

<p>我的第一步不是从程序的静态函数全集开始阅读，而是先针对具体案例采集执行流，确定本次操作实际命中了哪些模块、函数和路径。EXE 与各个 DLL 分别维护函数范围，只把当前执行流命中的函数作为本案例的代码证据。</p>

<p>这一步解决的是<strong>分析边界</strong>问题。大型 Windows 软件中可能存在数万甚至数十万个函数，静态调用图还会包含错误恢复、其他功能、历史兼容与未触发分支。执行流可以将问题从“整个程序如何工作”收缩为“当前案例经过了哪些代码”。</p>

<pre><code>当前案例操作
      │
      ▼
采集 EXE / DLL 执行流
      │
      ▼
按模块建立命中函数范围
      │
      ▼
只分析与目标结果有关的实际路径</code></pre>

<p>这里必须区分三种含义：静态代码中存在某个调用，只能证明该调用在代码结构上可能发生；函数出现在执行流中，才能证明本案例实际进入过它；某条内部条件分支是否执行，则还需要更细粒度的命中或运行时数据。执行流若被数量上限截断，未出现的函数也不能直接视为“未执行”。</p>

<h3>9.2 第二步：在命中代码中恢复阶段结构</h3>

<p>建立范围后，我会分析命中函数的汇编、伪代码和函数间数据依赖，识别输入准备、对象初始化、核心计算、结果修正与输出写回等阶段。此时恢复的是候选结构，而不是未经运行数据验证的最终公式。</p>

<ul>
<li>确认外部输入从哪个参数、对象字段或缓冲区进入。</li>
<li>追踪数据在哪些命中函数之间传递，以及生命周期如何变化。</li>
<li>识别可能构成核心算法的循环、条件和数据结构。</li>
<li>定位最终结果写入的对象、矩阵或输出缓冲区。</li>
<li>区分静态代码事实、执行流事实与仍待验证的语义推断。</li>
</ul>

<p>这与 JSVMP 案例中识别 TLV、流加密、Key 插入和编码边界的思路相同：先把一条复杂执行链切分为可独立验证的阶段，再决定每个阶段需要采集什么数据。</p>

<h3>9.3 第三步：依据代码定点采集 AI 所需数据</h3>

<p>仅向 AI 提供反编译伪代码通常不够。反编译器恢复出的变量类型、结构体字段和函数签名可能不准确，优化后的机器码还可能复用寄存器或消除高层变量。因此，我会根据上一阶段的代码分析，在命中函数内部选择观测点，采集能够约束语义的真实运行数据。</p>

<table>
<tr><th>采集对象</th><th>主要目的</th></tr>
<tr><td>RCX、RDX、R8、R9 与栈参数</td><td>确认 Windows x64 调用约定下的真实入口参数</td></tr>
<tr><td>对象指针及字段内存</td><td>恢复结构布局、数组指针、长度与状态字段</td></tr>
<tr><td>循环前后的缓冲区</td><td>判断每轮变换、收敛过程或数据重排规律</td></tr>
<tr><td>条件分支相关变量</td><td>证明当前案例实际选择了哪条路径</td></tr>
<tr><td>函数返回值与输出对象</td><td>建立阶段输入和阶段输出之间的对应关系</td></tr>
</table>

<p>AI主要负责把“命中代码 + 寄存器状态 + 内存快照 + 多次样本差异”综合起来，提出数据类型、结构字段和算法公式的候选解释。候选解释不能直接成为结论，必须回到新的断点数据和运行结果中验证。</p>

<h3>9.4 第四步：按阶段建立等价复现</h3>

<p>我不会一开始就尝试复现整个软件，而是将目标链路拆成若干边界清晰的计算阶段。每个阶段都记录确定的输入、输出、数据类型、内存布局和测试样本，然后使用独立代码实现相同变换。</p>

<pre><code>阶段 1：输入规范化      原程序输出 == 复现输出？
阶段 2：参数或矩阵构建  原程序输出 == 复现输出？
阶段 3：核心求解        每轮状态   == 对应运行数据？
阶段 4：结果修正与写回  最终结果   == 原程序结果？</code></pre>

<p>阶段性复现的价值在于定位<strong>第一个失配点</strong>。如果只比较最终输出，一旦不一致，就很难判断问题来自参数解释、结构偏移、整数溢出、浮点精度、循环边界、分支条件还是后处理。逐阶段对拍则可以把错误收缩到具体函数、具体循环甚至具体字段。</p>

<h3>9.5 第五步：用独立案例检验是否过拟合</h3>

<p>当前案例全部对齐，只能证明复现能够解释当前样本。为了判断得到的是通用规律还是样本拟合，还需要使用未参与公式推导的新案例进行验证，并有意识地改变几何参数、材料参数、边界条件、输入规模或其他与目标算法相关的变量。</p>

<ul>
<li>如果新案例从第一阶段开始失配，应重新检查输入解释和结构布局。</li>
<li>如果前置阶段一致而核心迭代失配，应检查分支、精度、停止条件和隐藏状态。</li>
<li>如果只有最终后处理失配，应检查单位换算、排序、归一化或结果写回逻辑。</li>
<li>如果某个所谓“常量”跨案例发生变化，应将其重新归类为环境量或动态参数。</li>
</ul>

<p>因此，我的完整工作流可以概括为：</p>

<pre><code>执行流定界
   ↓
命中代码分析
   ↓
定点运行时采集
   ↓
AI 辅助提出候选解释
   ↓
分阶段等价复现
   ↓
独立案例逐阶段对拍</code></pre>

<p>这套流程与本文 JSVMP 案例的共同点，是不依赖“读懂全部程序”才开始复现。执行流负责限定证据范围，静态代码负责提出结构，运行时数据负责确认真实语义，AI负责提高归纳和试错效率，而最终结论由逐阶段对拍决定。对我而言，AI不是替代逆向分析，而是把原本分散在汇编、伪代码、寄存器和内存中的证据更快地组织成可验证模型。</p>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
