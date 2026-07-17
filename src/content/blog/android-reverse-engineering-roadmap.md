---
title: "Android 逆向技能树：从入门到实战"
date: 2026-07-17
categories: "Android"
tags: ["Android", "逆向", "Frida", "Hook", "Smali", "JNI"]
id: "android-reverse-engineering-roadmap"
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

<div class="hero"><h1>Android 逆向技能树：从入门到实战</h1>
<p class="subtitle">系统架构 · APK 拆解 · Hook 框架 · 加固对抗 · 反调试绕过的完整知识体系</p>
<div class="hero-meta"><span class="tag tag-accent">Android</span><span class="tag">逆向</span><span class="tag">Frida</span><span class="tag">Smali</span><span class="tag">JNI</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-system">1. Android 系统与架构</a>
  <div class="toc-sub">
  <a href="#sec-boot">1.1 启动流程</a>
  <a href="#sec-art">1.2 ART 与 Dalvik</a>
  <a href="#sec-apk">1.3 APK 结构</a>
  <a href="#sec-zygote">1.4 Zygote 进程共享</a>
  <a href="#sec-oat">1.5 OAT / ODEX</a>
  </div>
</li>
<li><a href="#sec-java">2. Java / Kotlin 基础</a>
  <div class="toc-sub">
  <a href="#sec-reflection">2.1 反射在逆向中的用途</a>
  <a href="#sec-kotlin">2.2 Kotlin 编译特征</a>
  </div>
</li>
<li><a href="#sec-apktool">3. APK 拆包与反编译</a></li>
<li><a href="#sec-smali">4. Smali 代码能力</a></li>
<li><a href="#sec-debug">5. 动态调试</a>
  <div class="toc-sub">
  <a href="#sec-jdwp">5.1 JDWP 原理</a>
  <a href="#sec-anti-debug">5.2 反调试与绕过</a>
  </div>
</li>
<li><a href="#sec-hook">6. Hook 框架</a></li>
<li><a href="#sec-protect">7. 常见加固方案</a></li>
<li><a href="#sec-jni">8. JNI &amp; Native</a></li>
<li><a href="#sec-practice">9. 实战与分析思路</a>
  <div class="toc-sub">
  <a href="#sec-login">9.1 Hook 登录接口</a>
  <a href="#sec-signature">9.2 SO 签名校验绕过</a>
  <a href="#sec-ssl">9.3 网络与加密</a>
  <a href="#sec-comprehensive">9.4 综合场景题</a>
  </div>
</li>
<li><a href="#sec-bonus">10. 逆向进阶</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-system">1. Android 系统与架构理解</h2>

<h3 id="sec-boot">1.1 Android 启动流程</h3>

<p>从按下电源键到用户看到桌面，Android 经历了以下启动链路：</p>

<pre><code>Boot ROM
  → 加载引导程序到 RAM
  ↓
Bootloader
  → 初始化硬件，加载内核
  ↓
Linux Kernel
  → 初始化内核，加载驱动，启动 init 进程
  ↓
Init 进程（PID=1）
  → 解析 init.rc，启动守护进程，挂载文件系统
  ↓
Zygote
  → 预加载类和资源，启动 SystemServer
  ↓
SystemServer
  → 启动核心服务（AMS、PMS、WMS 等）
  ↓
ActivityManagerService
  → 启动 Launcher（第一个应用，即用户交互界面）
  ↓
App
  → 作为 Zygote 的子进程运行</code></pre>

<p>App 进程的创建流程：AMS 检查目标 App 进程是否已存在，若不存在则通过 Zygote 进程的 <code>fork()</code> 创建。</p>

<h3 id="sec-art">1.2 ART 与 Dalvik 的区别</h3>

<p>ART 和 Dalvik 是 Android 的两套运行时环境，核心区别在于编译策略：</p>

<table>
<tr><th>特性</th><th>Dalvik</th><th>ART</th></tr>
<tr><td>编译策略</td><td>JIT（即时编译）</td><td>AOT（预编译）+ JIT 混合</td></tr>
<tr><td>安装速度</td><td>快（无需编译）</td><td>慢（预编译产生机器码）</td></tr>
<tr><td>启动速度</td><td>慢（运行时需编译）</td><td>快（预编译完成）</td></tr>
<tr><td>存储占用</td><td>较低</td><td>较高（机器码约增大 20%）</td></tr>
<tr><td>CPU 架构</td><td>主要为 32 位</td><td>支持 64 位</td></tr>
</table>

<h4>为什么 Android 逆向要关注 ART</h4>

<p>当前大部分 APK 使用 ART 模式运行，安装或运行时原始 Dex 文件已被转换。这对逆向工程意味着：</p>

<ul>
<li>逆向工具（Frida、Objection、IDA）需要理解 ART 的内部 API 和数据结构</li>
<li>可利用 ART 的 Instrumentation 框架或 dex2oat 工具，在运行时将机器码反编译回 Dex/Smali</li>
<li>OAT 中的代码混淆和优化力度较大，增加了逆向分析难度</li>
<li>开发者会利用 OAT 的内部机制进行反调试和完整性检测</li>
<li>Android 版本迭代可能导致 Hook 脚本对 ART 模块失效（如变量偏移错位）</li>
</ul>

<h3 id="sec-apk">1.3 APK 的基本结构</h3>

<p>APK 本质上是一个 Zip 压缩包，解压后包含以下关键文件：</p>

<table>
<tr><th>文件/目录</th><th>说明</th></tr>
<tr><td><code>AndroidManifest.xml</code></td><td>清单文件，描述应用配置</td></tr>
<tr><td><code>classes.dex</code></td><td>Java/Kotlin 字节码（方法数超 65535 时会生成多个 Dex）</td></tr>
<tr><td><code>META-INF/</code></td><td>签名校验信息（去除签名需删除该目录）</td></tr>
<tr><td><code>res/</code></td><td>资源文件（按类型分类：drawable、layout、mipmap、values 等）</td></tr>
<tr><td><code>resources.arsc</code></td><td>资源索引表，编译后的二进制资源，存储资源 ID 与文件路径的映射</td></tr>
<tr><td><code>lib/</code></td><td>Native 库（.so 文件）</td></tr>
<tr><td><code>assets/</code></td><td>原始资源文件，不经压缩编译（如字体、配置文件）</td></tr>
</table>

<h4>AndroidManifest.xml 在逆向中的价值</h4>

<ul>
<li>快速了解应用：包名、入口 Activity、权限列表、组件注册、支持的最低 SDK 版本</li>
<li>识别第三方 SDK 和框架</li>
<li>判断是否启用了调试模式（<code>debuggable=true</code>）</li>
<li>识别 Native 库加载和硬件特性需求</li>
</ul>

<h3 id="sec-zygote">1.4 Zygote fork 出来的进程共享内容</h3>

<p>Zygote 创建子进程时，以下资源以写时复制（Copy-on-Write）方式共享：</p>

<ul>
<li>Zygote 预加载的只读 Java 类（但 Java 堆对象不共享）</li>
<li>Framework 资源（预加载的系统资源）</li>
<li>已加载的动态库（.so 文件）</li>
<li>只读的全局数据</li>
<li>物理页（写时复制：父子进程共享同一物理页，直至任一进程写入时才复制新页）</li>
<li>文件描述符</li>
</ul>

<h3 id="sec-oat">1.5 OAT / ODEX 的作用</h3>

<p><strong>OAT</strong> 是 ELF 文件格式，并针对系统架构进行了优化。它是 ART 将 Dex 文件预编译成本地机器码后的产物。为了兼容，OAT 文件通常还会内嵌 Dex 文件，当机器码无法执行时仍可用解释器执行 Dex。</p>

<p><strong>ODEX</strong> 是 Dalvik 时代的产物，是 Dex 优化后的中间文件，用于提高 Dalvik 虚拟机的解释执行效率。ART 时代，ODEX 的核心功能已被 OAT 吸收和替代，通常仅作为辅助或过渡文件存在。</p>

<h2 id="sec-java">2. Java / Kotlin 基础</h2>

<h3 id="sec-reflection">2.1 Java 反射在逆向中的用途</h3>

<p>反射机制允许程序在运行时检查自身的结构和行为。在逆向分析中，反射具有以下关键用途：</p>

<ul>
<li><strong>绕过访问控制：</strong>调用 <code>setAccessible(true)</code> 访问私有字段和方法</li>
<li><strong>动态分析类结构：</strong>通过 <code>getClass()</code>、<code>getMethods()</code> 等获取类名、方法签名和字段信息</li>
<li><strong>动态调用：</strong>对未知但符合特定条件的方法进行反射调用</li>
<li><strong>实例化不可构造的类：</strong>使私有构造方法可访问，强行创建对象</li>
<li><strong>Hook 基础：</strong>Frida 等动态插桩工具在 Java 层即利用反射机制实现方法替换</li>
</ul>

<h3 id="sec-kotlin">2.2 Kotlin 编译后的特征</h3>

<h4>Kotlin 与 Java 编译后的主要区别</h4>

<ul>
<li>Kotlin 默认生成 <code>getXxx()</code> / <code>setXxx()</code> 访问字段，不直接暴露字段；Java 可字段直接访问</li>
<li>Kotlin 顶层函数编译后自动归入以文件名命名的类</li>
<li>协程编译后包含大量 Label 和 switch-case 结构，分析复杂度高</li>
<li>Kotlin 有空安全（Null Safety）语法糖，编译后自动插入空检查</li>
</ul>

<h4>Kotlin 关键字的逆向识别</h4>

<table>
<tr><th>关键字</th><th>编译特征</th></tr>
<tr>
<td><code>companion object</code></td>
<td>生成 <code>Xxx$Companion</code> 内部类，包含 <code>public static final</code> 的 Companion 字段，原方法变为 Companion 实例方法</td>
</tr>
<tr>
<td><code>inline</code></td>
<td>编译后直接展开为代码块，临时变量名带 <code>$</code> 后缀。原函数仍保留但不被调用，Hook inline 函数无效</td>
</tr>
<tr>
<td><code>suspend</code></td>
<td>函数签名中包含 <code>Continuation</code> 类型参数，返回类型为 <code>Object</code>，类名后缀 <code>$suspendImpl</code>，内部基于状态机（Label + switch）实现</td>
</tr>
</table>

<h4>反编译后识别 Kotlin 的线索</h4>

<ul>
<li><code>kotlin</code> 包名依然存在</li>
<li><code>Continuation</code> 类型参数可见</li>
<li>Suspend 函数的状态机（Label + switch 结构）保留</li>
</ul>

<h2 id="sec-apktool">3. APK 拆包与反编译</h2>

<h4>常用工具</h4>

<table>
<tr><th>工具</th><th>用途</th></tr>
<tr><td>Apktool</td><td>解包/打包，输出 Smali 及其他资源文件</td></tr>
<tr><td>Jadx / Jadx-GUI</td><td>将 Dex 还原为 Java 代码，支持跳转和全局搜索</td></tr>
<tr><td>Baksmali</td><td>Dex 到 Smali 的拆解工具</td></tr>
<tr><td>DecompileX</td><td>Android Studio 插件，实时反编译</td></tr>
</table>

<h4>Apktool 与 Jadx 的区别</h4>

<p>Apktool 侧重于解包和打包，输出 Smali 语言格式的资源文件；Jadx 侧重于将 Dex 文件尽可能还原为可读的 Java 代码，适用于代码逻辑分析。</p>

<h4>Jadx 反编译失败的常见对策</h4>

<table>
<tr><th>问题</th><th>解决方案</th></tr>
<tr><td>OutOfMemoryError</td><td>修改 Jadx 配置文件，增加 JVM 堆内存分配</td></tr>
<tr><td>Bad Dex file checksum</td><td>校验失败，通常由加固或文件篡改导致，使用 <code>--no-checksum</code> 关闭校验</td></tr>
<tr><td>函数反编译失败</td><td>函数体过大，提高注释级别（<code>--show-bad-code</code>）</td></tr>
<tr><td>类缺失或结构紊乱</td><td>Jadx 可能为优化重命名，尝试关闭优化选项</td></tr>
<tr><td>逻辑错误</td><td>使用 <code>--cfg</code> 生成 CFG .dot 文件，借助 GraphViz 分析控制流</td></tr>
</table>

<h2 id="sec-smali">4. Smali 代码能力</h2>

<h4>寄存器模型</h4>

<ul>
<li><code>v0</code> 开头：局部变量寄存器</li>
<li><code>p0</code> 开头：方法入参寄存器</li>
<li><code>.registers N</code>：声明寄存器总数（参数 + 局部）</li>
<li><code>.locals N</code>：声明局部寄存器数</li>
</ul>

<p>若要新增逻辑，可修改 <code>.registers</code> 增加寄存器数量，使用新增的寄存器而不影响原有赋值逻辑。</p>

<h4>常用指令</h4>

<table>
<tr><th>指令</th><th>含义</th></tr>
<tr><td><code>const/4 v0, 0x1</code></td><td>将数值 1 赋值给 v0</td></tr>
<tr><td><code>move v0, v1</code></td><td>将 v1 的值复制到 v0</td></tr>
<tr><td><code>invoke-virtual</code></td><td>调用虚函数（需传 this 指针）</td></tr>
<tr><td><code>invoke-static</code></td><td>调用静态函数（不传 this）</td></tr>
<tr><td><code>return-void</code> / <code>return v0</code></td><td>无返回值/有返回值返回</td></tr>
</table>

<h4>修改判断逻辑</h4>

<p>强制判断条件永远为 True：</p>

<pre><code>if-ne v0, v0, :cond_1   ; 寄存器自比较，结果恒为 True</code></pre>

<h4>Try-Catch 的 Smali 结构</h4>

<pre><code>:try_start_0
  // 执行逻辑
:try_end_0
.catch &lt;异常类型&gt; {:try_start_0 .. :try_end_0} :catch_label

:catch_label
  // 异常处理逻辑</code></pre>

<h2 id="sec-debug">5. 动态调试</h2>

<h4>Android 常用调试方式</h4>

<table>
<tr><th>层</th><th>工具</th><th>应用场景</th></tr>
<tr><td>Native 层</td><td>IDA Pro + android_server、GDB/LLDB + gdbserver</td><td>加固分析、反调试绕过、算法还原、逻辑修改</td></tr>
<tr><td>Java 层</td><td>JEB、Jadx（静态）、jdb（动态）</td><td>业务逻辑分析、解密脱壳、校验绕过</td></tr>
<tr><td>应用层</td><td>Android Studio、Android Profiler</td><td>性能分析、内存泄漏、网络请求分析</td></tr>
<tr><td>系统层</td><td>ADB</td><td>安装卸载、日志查看、Shell 访问</td></tr>
</table>

<h4>Attach 到目标 App</h4>

<ul>
<li><strong>Native 层：</strong>IDA Pro + android_server，端口转发后附加</li>
<li><strong>Frida：</strong>可同时附加 Java 层和 Native 层，手机端启动 frida-server</li>
<li><strong>调试模式：</strong>若 App 的 AndroidManifest 中 <code>debuggable=true</code>，可直接使用 Android Studio 或 jdb 附加</li>
</ul>

<h4>Debugable=false 时的调试方案</h4>

<ul>
<li>解包修改 AndroidManifest，设置 <code>debuggable=true</code> 后重打包签名</li>
<li>刷 Root，使所有 App 均可调试</li>
<li>使用定制 ROM 或内核（需解锁 BL）</li>
<li>使用虚拟机环境（部分 App 会检测虚拟机）</li>
</ul>

<h3 id="sec-jdwp">5.1 JDWP 原理</h3>

<p>JDWP（Java Debug Wire Protocol）定义了调试器与 JVM 之间的通信协议。其工作机制如下：</p>

<ul>
<li>调试器将指令封转为 JDWP 命令帧发送给 JVM</li>
<li>Android 虚拟机提供 JDWP 后端，负责解析命令</li>
<li>ADB 作为传输通道桥接调试器和设备</li>
<li>协议采用请求-响应模型，同时支持事件推送</li>
<li>连接建立后首先发送 JDWP-Handshake 握手包确认协议版本</li>
<li>断点等事件触发时，JVM 主动向调试器推送事件包</li>
</ul>

<h3 id="sec-anti-debug">5.2 反调试手段与绕过</h3>

<table>
<tr><th>反调试手段</th><th>绕过思路</th></tr>
<tr><td>Ptrace 自身进程</td><td>劫持 Ptrace 系统调用，使其失效</td></tr>
<tr><td>端口检测</td><td>使用非默认端口启动调试工具</td></tr>
<tr><td>后台进程检测</td><td>修改调试工具进程名称</td></tr>
<tr><td>TracerPid 检测</td><td>Hook <code>/proc/self/status</code> 读取函数，返回前将 TracerPid 置 0</td></tr>
<tr><td>时间戳检测</td><td>将检测时间差的指令 Nop 掉</td></tr>
<tr><td>软件断点检测（int 3）</td><td>Hook 校验哈希函数返回正确值；或使用硬件断点</td></tr>
<tr><td>Java 层调试检测</td><td>Hook 检测函数，强制返回 False</td></tr>
<tr><td>文件/目录监控</td><td>Hook 系统函数阻止监控线程启动</td></tr>
<tr><td>父进程检测（非 Zygote）</td><td>Hook <code>getppid()</code> 返回 Zygote 的 PID</td></tr>
</table>

<h2 id="sec-hook">6. Hook 框架</h2>

<h4>Xposed / LSPosed / Frida 对比</h4>

<table>
<tr><th>框架</th><th>原理</th><th>优点</th><th>缺点</th></tr>
<tr>
<td>Xposed</td>
<td>替换系统 Zygote 进程的 app_process，加载 XposedBridge.jar</td>
<td>Java 层 Hook 能力强，无需修改 App</td>
<td>不支持 Android 8+，需 Root</td>
</tr>
<tr>
<td>LSPosed</td>
<td>基于 LSPlant Hook 框架，兼容 Android 8~14</td>
<td>支持新版本 Android，作用域隔离</td>
<td>需 Root + LSPosed Manager</td>
</tr>
<tr>
<td>Frida</td>
<td>将 V8/QuickJS 引擎注入目标进程，执行 JS 脚本</td>
<td>Java + Native 双端 Hook，跨平台，无需重启</td>
<td>需 frida-server，部分环境被检测</td>
</tr>
</table>

<h4>Frida Hook Java 方法</h4>

<pre><code>Java.perform(function() {
    var TargetClass = Java.use("com.example.TargetClass");
    TargetClass.targetMethod.implementation = function(arg) {
        console.log("arg = " + arg);
        var result = this.targetMethod(arg);
        console.log("result = " + result);
        return result;
    };
});</code></pre>

<h4>Frida Hook Native 方法</h4>

<pre><code>Interceptor.attach(Module.findExportByName("libtarget.so", "targetFunc"), {
    onEnter: function(args) {
        console.log("arg[0] = " + args[0]);
    },
    onLeave: function(retval) {
        console.log("retval = " + retval);
    }
});</code></pre>

<h4>Frida Gadget</h4>

<p>Frida Gadget 是一个动态链接库，可嵌入 APK 中，在应用启动时自动加载。它允许在未运行 frida-server 的设备上进行 Hook，适用于 Root 受限的场景。</p>

<h4>Inline Hook 与 PLT Hook 的区别</h4>

<table>
<tr><th>类型</th><th>原理</th><th>优点</th><th>缺点</th></tr>
<tr><td>PLT Hook</td><td>修改 ELF 文件的 PLT 表项，替换函数地址</td><td>实现简单、稳定性高</td><td>只能 Hook 外部导入函数，无法 Hook 内部函数</td></tr>
<tr><td>Inline Hook</td><td>在目标函数入口写入跳转指令，劫持执行流</td><td>可 Hook 任意函数（包括内部函数）</td><td>实现复杂，需处理指令长度对齐和并发问题</td></tr>
</table>

<h2 id="sec-protect">7. 常见加固方案</h2>

<h4>常见加固方案</h4>

<ul>
<li><strong>Dex 加固：</strong>360 加固、腾讯加固、娜迦加固、百度加固等，对 Dex 文件整体加密</li>
<li><strong>资源加固：</strong>对 resources.arsc 和 assets 目录进行加密或伪装</li>
<li><strong>VMP（虚拟机保护）：</strong>将 Dalvik 字节码转换为自定义虚拟机指令</li>
<li><strong>SO 加固：</strong>对 Native 库进行加壳、混淆或 UPX 压缩</li>
</ul>

<h4>加固 APK 与原始 APK 的区别</h4>

<ul>
<li>加固后的 Dex 文件被加密或自定义格式混淆，无法直接反编译</li>
<li>AndroidManifest.xml 中入口 Activity 通常被替换为壳的代理 Activity</li>
<li>壳程序在运行时将原始 Dex 解密加载到内存中</li>
</ul>

<h4>壳加载流程</h4>

<pre><code>1. 壳的代理 Application/Activity 被系统启动
2. 壳初始化（反调试、环境检测）
3. 壳解密原始 Dex 文件（从 assets 或 lib 中读取）
4. 使用 InMemoryDexClassLoader 或自定义 ClassLoader 动态加载
5. 调用原始 Application.onCreate() / Activity.onCreate()</code></pre>

<h4>Dex 解密时机与内存 Dump</h4>

<p>Dex 在壳的 <code>Application.attachBaseContext()</code> 或 <code>onCreate()</code> 阶段被解密。常用的内存 Dump 方案：</p>

<ul>
<li><strong>Frida：</strong>Hook <code>open()</code> / <code>read()</code> / <code>DexFile</code> 相关 API，在 Dex 被加载到内存时 Dump</li>
<li><strong>DumpDex：</strong>利用 Frida 脚本扫描内存中的 Dex 魔头（<code>dex\n035</code> 或 <code>dex\n038</code>）</li>
<li><strong>frida-dexdump：</strong>自动化内存 Dex 提取工具</li>
<li><strong>Custom ClassLoader Hook：</strong>拦截 <code>InMemoryDexClassLoader</code> 构造函数的字节数组参数</li>
</ul>

<h2 id="sec-jni">8. JNI &amp; Native</h2>

<h4>JNI_OnLoad 的作用</h4>

<p>当 Java 层通过 <code>System.loadLibrary()</code> 加载 SO 文件时，系统会首先调用 SO 中的 <code>JNI_OnLoad()</code> 函数。该函数通常用于：</p>

<ul>
<li>注册 Native 方法与 Java 方法的映射关系（RegisterNatives）</li>
<li>获取 Java VM 指针并缓存</li>
<li>执行初始化操作（如反调试检测）</li>
</ul>

<h4>Java 层调用 SO 的过程</h4>

<pre><code>1. System.loadLibrary("native-lib")
2. → nativeLoad → dlopen 加载 SO 到进程空间
3. → JNI_OnLoad 执行（可选）
4. → 查找 Java 声明的 native 方法对应的 Native 函数
5. → 根据命名约定 JNI_Java_xxx_xxx 注册或在 JNI_OnLoad 中手动注册</code></pre>

<h4>常见 Native 混淆手段</h4>

<ul>
<li><strong>字符串加密：</strong>运行时 XOR / AES 解密，去混淆需定位解密入口</li>
<li><strong>控制流平坦化（OLLVM）：</strong>将正常控制流拆分为无关 Case 块的循环结构</li>
<li><strong>虚假控制流：</strong>插入大量无害但不透明的谓词分支</li>
<li><strong>指令替换（Substitution）：</strong>将标准运算替换为等效的复杂指令序列</li>
<li><strong>反调试 Ptrace：</strong>在 JNI_OnLoad 中 ptrace 自身</li>
</ul>

<h4>SO 中字符串加密的处理思路</h4>

<ol>
<li>在 IDA Pro 中找到引用加密字符串的位置</li>
<li>回溯解密函数调用点，提取解密逻辑</li>
<li>使用 Frida/Unicorn 模拟执行解密代码</li>
<li>或使用 ida_xorstr_decrypt 等插件自动模拟解密</li>
</ol>

<h4>IDA / Ghidra 分析 ARM SO</h4>

<ul>
<li>加载 SO 时选择正确的架构（ARM32 / ARM64）</li>
<li><strong>IDA：</strong>使用 <code>Shift+F12</code> 查看字符串，识别解密函数后手动跟踪交叉引用</li>
<li><strong>Ghidra：</strong>利用其反编译器分析控制流，使用 <code>Decompile</code> 窗口还原伪代码</li>
<li>通过 <code>JNI_OnLoad</code> 的交叉引用定位核心功能函数入口</li>
<li>使用 <code>Frida stracer</code> 或 <code>Unicorn</code> 动态跟踪 SO 执行路径</li>
</ul>

<h2 id="sec-practice">9. 实战与分析思路</h2>

<h3 id="sec-login">9.1 Hook 登录接口</h3>

<p><strong>目标：</strong>拦截登录接口，打印明文账号和密码。</p>

<p><strong>分析思路：</strong></p>

<ol>
<li>使用 Jadx 搜索关键词（<code>password</code>、<code>login</code>、<code>pwd</code>、API URL）定位登录接口</li>
<li>在参数组装回调处 Hook 对应方法，打印传参</li>
<li>若加密，跟踪加密逻辑前的明文入口</li>
</ol>

<p><strong>Frida 实现：</strong></p>

<pre><code>Java.perform(function() {
    var LoginApi = Java.use("com.example.api.LoginApi");
    LoginApi.login.implementation = function(username, password) {
        console.log("[+] 明文账号 = " + username);
        console.log("[+] 明文密码 = " + password);
        return this.login(username, password);
    };
});</code></pre>

<h3 id="sec-signature">9.2 SO 签名校验绕过</h3>

<p><strong>场景：</strong>SO 文件中校验了 APK 签名，重打包后闪退。</p>

<p><strong>分析思路：</strong></p>

<ol>
<li>在 IDA 中搜索 <code>PackageManager</code>、<code>getPackageInfo</code>、<code>signatures</code> 等相关字符串</li>
<li>在 JNI_OnLoad 或调用点附近下断点</li>
<li>确认校验函数后，修改其返回值为正确签名</li>
</ol>

<p><strong>Frida 绕过方案：</strong></p>

<pre><code>// Hook Java 层的签名校验
Java.perform(function() {
    var PackageManager = Java.use("android.content.pm.PackageManager");
    PackageManager.getPackageInfo.implementation = function(pkg, flags) {
        var info = this.getPackageInfo(pkg, flags);
        // 修改 info.signatures 为原始签名
        return info;
    };
});

// 或 Hook Native 层对比函数
Interceptor.attach(Module.findExportByName("libc.so", "strcmp"), {
    onEnter: function(args) {
        var s1 = args[0].readCString();
        var s2 = args[1].readCString();
        if (s1 && s2 && s1.indexOf("原始签名") >= 0) {
            this.retval = 0;
        }
    }
});</code></pre>

<h3 id="sec-ssl">9.3 网络与加密</h3>

<h4>HTTPS 抓包方案</h4>

<ul>
<li>安装用户证书到系统信任存储（需 Root）</li>
<li>使用 VirtualXposed + 抓包工具绕过证书锁定</li>
<li>使用 Frida Hook 证书校验函数绕过 SSL Pinning</li>
<li>使用 ProxyDroid + Burp Suite 全局代理</li>
</ul>

<h4>证书锁定的绕过</h4>

<ul>
<li><strong>Hook TrustManager：</strong>替换 X509TrustManager 的 checkServerTrusted 方法</li>
<li><strong>Hook OkHttp：</strong>OkHttp 的 CertificatePinner 对象，清空或替换其 pin 值</li>
<li><strong>Universal SSL Pinning Bypass：</strong>使用 Frida 的 ssl-pinning-bypass 脚本</li>
</ul>

<h4>常见加密算法的定位</h4>

<table>
<tr><th>算法</th><th>Java 层特征</th><th>Native 层特征</th></tr>
<tr><td>AES</td><td><code>Cipher.getInstance("AES/ECB/PKCS5Padding")</code></td><td>查找 S-Box 常量表（0x63, 0x7c...）</td></tr>
<tr><td>RSA</td><td><code>Cipher.getInstance("RSA")</code> / <code>KeyPairGenerator</code></td><td>查找大数运算库（BigInteger、OpenSSL）</td></tr>
<tr><td>HMAC</td><td><code>Mac.getInstance("HmacSHA256")</code></td><td>查找哈希上下文结构</td></tr>
</table>

<h4>密钥来源分析</h4>

<ul>
<li><strong>硬编码：</strong>在 Java 代码或 SO 字符串中直接查找</li>
<li><strong>动态生成：</strong>由设备 ID + 密钥种子 + 固定盐值组成</li>
<li><strong>服务器下发：</strong>登录请求返回的 Token 或 Session Key</li>
<li><strong>安卓 KeyStore：</strong>利用 TEE 环境存储，Frida Hook KeyStore API 拦截</li>
</ul>

<h3 id="sec-comprehensive">9.4 综合场景题</h3>

<p><strong>场景描述：</strong>一个 App 有加固、登录接口参数加密、检测 Root + Frida。</p>

<p><strong>分析思路与行动清单：</strong></p>

<ol>
<li><strong>第一步：脱壳</strong>
  <ul>
    <li>用 Frida + frida-dexdump 从内存中提取 Dex</li>
    <li>或使用 <strong>Frida-DexDump</strong>（GitHub: hluwa/FRIDA-DEXDump）在壳加载完成后扫描 Dex 魔头</li>
  </ul>
</li>
<li><strong>第二步：静态分析</strong>
  <ul>
    <li>用 Jadx 打开提取的 Dex 文件</li>
    <li>搜索加密算法特征，定位加密入口</li>
    <li>查找 Hook 检测和 Root 检测的逻辑</li>
  </ul>
</li>
<li><strong>第三步：动态分析</strong>
  <ul>
    <li>使用 Frida 的 <code>--frida-anti-anti-frida</code> 绕过 Frida 检测</li>
    <li>使用 <code>DroidRootBypass</code> 或修改 <code>build.prop</code> 绕过 Root 检测</li>
    <li>从关键函数入口开始 Hook，逐层跟踪</li>
  </ul>
</li>
<li><strong>第四步：重点突破顺序</strong>
  <ul>
    <li><strong>最优先：</strong>登录接口的参数加密逻辑——通常是最容易入口</li>
    <li><strong>其次：</strong>SO 中的签名校验——决定了能否重打包持久化</li>
    <li><strong>最后：</strong>反调试和完整性校验——在修改后再逐一排查</li>
  </ul>
</li>
</ol>

<p><strong>时间紧迫时优先突破：</strong>登录接口的加密和 SO 签名校验——这两处是控制流的核心节点，绕过它们就能完成大部分业务分析。</p>

<h2 id="sec-bonus">10. 逆向进阶</h2>

<ul>
<li><strong>自动化逆向脚本：</strong>使用 Frida + Python 编写批量 Hook、数据采集和日志分析的自动化工具链</li>
<li><strong>自写 Xposed 模块：</strong>掌握 Xposed 模块开发，用于系统级功能的定制和分析</li>
<li><strong>定制 ROM / Kernel：</strong>修改 Android 源码或内核驱动，实现系统层的反检测和监控</li>
<li><strong>风控/支付/金融 App 逆向：</strong>这些场景通常涉及 SSL Pinning、设备指纹、多因子认证，对抗难度高，也是面试中的重点考察方向</li>
</ul>

<div class="footer">持续更新中 · 如有补充欢迎交流</div>

</div></div>
