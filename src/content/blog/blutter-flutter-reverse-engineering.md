---
title: "Blutter 使用指南：Flutter Android AOT 逆向分析"
date: 2026-07-29
categories: "Android"
tags: ["Blutter", "Flutter逆向", "Dart AOT", "Android", "Frida"]
id: "blutter-flutter-reverse-engineering"
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

<div class="hero"><h1>Blutter 使用指南：Flutter Android AOT 逆向分析</h1>
<p class="subtitle">从 Dart AOT 结构、环境搭建到静态符号恢复与动态验证</p>
<div class="hero-meta"><span class="tag tag-accent">Android</span><span class="tag">Blutter</span><span class="tag">Flutter逆向</span><span class="tag">Dart AOT</span><span class="tag">Frida</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. Flutter Release 为什么难分析</a></li>
<li><a href="#s2">2. Blutter 的定位与工作原理</a></li>
<li><a href="#s3">3. 支持范围与能力边界</a></li>
<li><a href="#s4">4. 环境搭建</a></li>
<li class="toc-sub"><a href="#s4-1">4.1 Linux</a></li>
<li class="toc-sub"><a href="#s4-2">4.2 Windows</a></li>
<li class="toc-sub"><a href="#s4-3">4.3 macOS</a></li>
<li><a href="#s5">5. 准备 APK 与目标库</a></li>
<li><a href="#s6">6. 基本用法与更新</a></li>
<li><a href="#s7">7. 输出文件如何使用</a></li>
<li><a href="#s8">8. 与 IDA、Frida 配合分析</a></li>
<li><a href="#s9">9. 常见问题与排查</a></li>
<li><a href="#s10">10. 推荐分析工作流</a></li>
</ul></div>

<div class="article-content">

<div class="warn-box">
<div class="warn-label">授权边界</div>
本文仅用于分析自己开发、明确授权测试或合法取得研究许可的应用。Blutter 能降低 Flutter AOT 程序的分析门槛，但不应被用于窃取商业机密、绕过付费控制或破坏第三方系统。
</div>

<h2 id="s1">1. Flutter Release 为什么难分析</h2>

<p>普通 Android 应用的业务逻辑通常位于 DEX 中，使用 JADX 等工具可以恢复 Java/Kotlin 类、方法与近似源码。Flutter Release 应用的核心 Dart 代码则通常以 AOT（Ahead-of-Time）形式编译进 <code>libapp.so</code>，运行时由 Flutter Engine 和 Dart Runtime 提供对象模型、线程、垃圾回收与调用约定。</p>

<p>这意味着分析者面对的不是结构清晰的 DEX，而是 ARM64 原生代码、Dart 对象池、AOT Snapshot 和版本相关的运行时布局。Release 构建还可能移除大量符号；如果启用了 Dart 混淆，类名和函数名的可读性会进一步下降。</p>

<table>
<tr><th>文件</th><th>主要作用</th><th>分析价值</th></tr>
<tr><td><code>libapp.so</code></td><td>Dart 业务代码的 AOT 产物</td><td>目标函数、常量、对象池和业务控制流</td></tr>
<tr><td><code>libflutter.so</code></td><td>Flutter Engine 与 Dart Runtime</td><td>识别 Dart/Flutter 版本及运行时结构</td></tr>
<tr><td>DEX</td><td>Android 启动壳、插件和 Platform Channel 原生侧</td><td>Java/Kotlin 插件、权限与系统 API 交互</td></tr>
<tr><td>Assets</td><td>图片、字体、配置及其他资源</td><td>配置线索、资源映射和功能入口</td></tr>
</table>

<blockquote>Flutter 逆向不是“只分析一个 SO”。Dart 业务通常在 <code>libapp.so</code>，而插件、平台能力与 Java/Kotlin 桥接仍需结合 DEX、Manifest 和运行时行为一起分析。</blockquote>

<h2 id="s2">2. Blutter 的定位与工作原理</h2>

<p><strong>Blutter</strong> 是 Worawit Wangwarunyoo 开源的 Flutter 移动应用逆向工程工具。项目名称写作 B(l)utter，核心思路是为目标应用构建与其 Dart 版本匹配的 AOT Runtime，再利用正确的内部结构解析 <code>libapp.so</code>。</p>

<p>官方项目地址：<a href="https://github.com/worawit/blutter" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">worawit/blutter</a>。OWASP Mobile Application Security Testing Guide 也将其收录为 Flutter Android 静态分析工具：<a href="https://mas.owasp.org/MASTG/tools/android/MASTG-TOOL-0116/" style="color:#e1e4ed;font-weight:600;border-bottom:2px solid #6c9eeb;">OWASP MASTG：Blutter</a>。</p>

<pre><code>APK 中的 arm64-v8a 目录
        │
        ├── libflutter.so → 检测 Dart / Flutter 版本
        │
        └── libapp.so     → 待解析的 Dart AOT 代码
                         │
                         ▼
       查找或构建匹配版本的 Blutter 分析器
                         │
                         ▼
    恢复函数信息、对象池、注释汇编与 Frida 模板</code></pre>

<p><code>blutter.py</code> 是整个流程的编排入口。它会从 Flutter Engine 中检测 Dart 版本，检查 <code>bin/</code> 中是否已有对应版本的分析器；如果不存在，就自动获取相应的 Dart Runtime 源码并构建，然后调用 Blutter 可执行程序解析 <code>libapp.so</code>。</p>

<div class="tip-box">
<div class="tip-label">核心价值</div>
Blutter 的价值不是把二进制一键还原成原始 Dart 源码，而是恢复足够多的 Dart 语义和符号线索，使原本近乎匿名的 ARM64 代码具备可导航、可搜索和可动态验证的分析入口。
</div>

<h2 id="s3">3. 支持范围与能力边界</h2>

<p>使用之前必须先确认样本是否落在工具支持范围内。根据官方 README，当前主线具有以下边界：</p>

<table>
<tr><th>项目</th><th>当前状态</th></tr>
<tr><td>目标平台</td><td>Android</td></tr>
<tr><td>目标二进制</td><td><code>libapp.so</code></td></tr>
<tr><td>CPU 架构</td><td>ARM64 / <code>arm64-v8a</code></td></tr>
<tr><td>Dart 版本</td><td>主要面向近期 Dart 版本</td></tr>
<tr><td>iOS</td><td>尚未支持</td></tr>
<tr><td>直接输入 APK/IPA</td><td>尚未支持，需要先提取 <code>lib</code> 目录</td></tr>
<tr><td>混淆应用</td><td>能够分析，但仍可能缺失较多函数和可读名称</td></tr>
</table>

<p>Blutter 也不是完整的 Dart 反编译器。它不会自动恢复原始变量名、注释、工程结构和高质量伪代码；对函数参数、返回类型、复杂代码模式与强混淆样本的恢复能力也有限。正确预期应该是“生成高质量静态分析素材”，而不是“一键得到 Flutter 源码”。</p>

<h2 id="s4">4. 环境搭建</h2>

<p>Blutter 本体包含 C++20 代码，并使用 C++ Formatting Library，因此编译器版本要求较新。首次遇到一个尚未缓存的 Dart 版本时，工具还需要获取并构建对应的 Dart Runtime，耗时和磁盘占用都会明显高于普通 Python 脚本。</p>

<h3 id="s4-1">4.1 Linux</h3>

<p>官方推荐使用能够从主仓库直接提供 <code>g++ &gt;= 13</code> 的新版本 Debian/Ubuntu。不要在过旧系统上强行混用移植编译器和旧版系统库。</p>

<h4>Debian / Ubuntu</h4>

<pre><code>sudo apt update
sudo apt install python3-pyelftools python3-requests git cmake ninja-build \
  build-essential pkg-config libicu-dev libcapstone-dev

git clone https://github.com/worawit/blutter.git
cd blutter</code></pre>

<h3 id="s4-2">4.2 Windows</h3>

<p>Windows 环境需要安装 Git、Python 3，以及最新版 Visual Studio，并在安装器中选中：</p>

<ul>
<li><strong>Desktop development with C++</strong></li>
<li><strong>C++ CMake tools for Windows</strong></li>
</ul>

<p>克隆仓库后，先运行官方脚本准备 Windows 所需的 Capstone 与 ICU4C：</p>

<pre><code>git clone https://github.com/worawit/blutter.git
cd blutter
python scripts\init_env_win.py</code></pre>

<p>接下来不要直接使用普通 CMD。应从开始菜单打开与 Visual Studio 对应的 <strong>x64 Native Tools Command Prompt</strong>，在其中进入 Blutter 目录并执行后续命令，使 MSVC、CMake 和 Windows SDK 环境变量处于正确状态。</p>

<div class="warn-box">
<div class="warn-label">Windows 常见问题</div>
如果出现找不到编译器、CMake Generator 或标准库头文件的问题，首先确认命令是否在 x64 Native Tools Command Prompt 内运行，而不是急于修改 Blutter 源码。
</div>

<h3 id="s4-3">4.3 macOS</h3>

<p>macOS Sequoia 可以使用 Xcode 自带工具链；Ventura 和 Sonoma 按官方说明安装 Clang 16。依赖示例如下：</p>

<pre><code># macOS Sequoia
brew install cmake ninja pkg-config icu4c capstone
pip3 install pyelftools requests

# Ventura / Sonoma 额外安装 LLVM 16
brew install llvm@16 cmake ninja pkg-config icu4c capstone
pip3 install pyelftools requests</code></pre>

<h2 id="s5">5. 准备 APK 与目标库</h2>

<p>APK 本质上是 ZIP 容器，可以使用 7-Zip、解压工具或 APKTool 提取。Blutter 当前不直接接收 APK，它需要完整的 <code>lib/arm64-v8a</code> 目录。</p>

<h4>使用 7-Zip</h4>

<pre><code>7z x target.apk -oapp-unpacked

# 确认目标文件
dir app-unpacked\lib\arm64-v8a</code></pre>

<p>目录中至少应重点检查：</p>

<pre><code>app-unpacked/
└── lib/
    └── arm64-v8a/
        ├── libapp.so
        └── libflutter.so</code></pre>

<p>如果 APK 中只有 <code>armeabi-v7a</code>、<code>x86</code> 或 <code>x86_64</code>，该样本不满足主线 Blutter 的 ARM64 输入要求。如果使用的是 Split APK / App Bundle，还需要从正确的架构 Split 中提取原生库。</p>

<h2 id="s6">6. 基本用法与更新</h2>

<p>命令的第一个位置参数是目标应用的 <code>arm64-v8a</code> 目录，第二个位置参数是输出目录。</p>

<h4>Linux / macOS</h4>

<pre><code>python3 blutter.py path/to/app/lib/arm64-v8a out_dir</code></pre>

<h4>Windows</h4>

<pre><code>python blutter.py path\to\app\lib\arm64-v8a out_dir</code></pre>

<p>建议每个 APK、版本和 CPU 架构使用独立输出目录，避免把旧结果误认为当前样本：</p>

<pre><code>python blutter.py samples\demo_3.22.1\lib\arm64-v8a \
  outputs\demo_3.22.1_arm64</code></pre>

<p>更新 Blutter 后，如果需要强制重新构建对应 Dart 版本的分析器，可以添加 <code>--rebuild</code>：</p>

<pre><code>git pull
python blutter.py path\to\lib\arm64-v8a out_dir --rebuild</code></pre>

<p>如果目的是开发或调试 Blutter 本身，可以生成 Visual Studio Solution：</p>

<pre><code>python blutter.py path\to\lib\arm64-v8a build\vs --vs-sln</code></pre>

<h2 id="s7">7. 输出文件如何使用</h2>

<p>一次成功分析通常会生成以下核心产物：</p>

<table>
<tr><th>输出</th><th>内容</th><th>主要用途</th></tr>
<tr><td><code>asm/*</code></td><td>带有 Dart 符号信息的 <code>libapp.so</code> 汇编</td><td>定位类、函数、偏移和调用关系</td></tr>
<tr><td><code>blutter_frida.js</code></td><td>面向当前样本生成的 Frida 脚本模板</td><td>运行时地址换算、Hook 和参数验证</td></tr>
<tr><td><code>objs.txt</code></td><td>Object Pool 中对象的完整嵌套转储</td><td>观察对象关系、常量和复杂结构</td></tr>
<tr><td><code>pp.txt</code></td><td>Object Pool 中的 Dart 对象列表</td><td>快速检索字符串、类和对象线索</td></tr>
</table>

<h3>7.1 asm：带语义的汇编视图</h3>

<p><code>asm/</code> 是静态分析的主要入口。它将原本缺少符号的 ARM64 代码与恢复出的 Dart 类和函数信息关联起来。分析时可以先从业务关键词、类名或网络相关字符串入手，再沿函数调用关系寻找参数构造、状态判断和算法实现。</p>

<p>需要注意：汇编中的符号名是 Blutter 根据 AOT 元数据恢复的结果，不等价于原始项目的完整调试符号；混淆样本中的名称也可能失去业务含义。</p>

<h3>7.2 pp.txt 与 objs.txt：对象池视角</h3>

<p>Dart AOT 代码会通过 Object Pool 引用字符串、类型、闭包、函数与其他运行时对象。<code>pp.txt</code> 适合快速全文检索，<code>objs.txt</code> 则适合查看嵌套对象关系。常用搜索方向包括：</p>

<ul>
<li>域名、URL 路径、请求头和错误消息</li>
<li>路由名称、页面标题和功能提示文本</li>
<li>序列化字段、JSON Key 和状态枚举</li>
<li>加密算法名称、协议标识与固定常量</li>
<li>类名、函数名和包路径</li>
</ul>

<p>字符串只能用于定位，不能单独证明对应函数在当前案例中执行。最终结论仍需结合调用关系和运行时命中数据。</p>

<h3>7.3 blutter_frida.js：动态验证模板</h3>

<p>生成的 Frida 文件是模板而不是自动完成的分析脚本。它提供与目标 Dart 版本和样本相关的运行时辅助信息，分析者仍需根据目标函数的偏移、参数布局与对象类型编写具体 Hook。</p>

<div class="danger-box">
<div class="danger-label">地址纪律</div>
Android 启用 ASLR 后，<code>libapp.so</code> 每次启动的绝对基址可能变化。静态偏移应与当前进程模块基址组合，不能把某次运行的绝对地址直接复制到下一次启动。
</div>

<h2 id="s8">8. 与 IDA、Frida 配合分析</h2>

<p>Blutter 的最佳使用方式不是替代 IDA 或 Frida，而是为它们补充 Dart AOT 语义。一个实用的组合流程如下：</p>

<ol>
<li>使用 Blutter 解析 <code>libapp.so</code>，获得汇编、对象池和函数偏移。</li>
<li>在 <code>pp.txt</code>、<code>objs.txt</code> 和 <code>asm/</code> 中搜索业务线索。</li>
<li>把候选函数偏移映射到 IDA 中，核对控制流、交叉引用和数据访问。</li>
<li>根据静态代码选择函数入口、关键分支或结果写回点。</li>
<li>使用 Frida 在真实运行中验证函数是否命中，并采集参数、返回值与对象数据。</li>
<li>通过多个受控样本比较中间状态，逐步恢复业务语义或算法。</li>
</ol>

<pre><code>Blutter 恢复符号和对象
          ↓
IDA 验证静态控制流
          ↓
Frida 证明运行时命中
          ↓
采集参数与中间状态
          ↓
分阶段复现和多样本对拍</code></pre>

<p>这套流程与原生 Windows 逆向中的“执行流定界—白名单代码分析—定点内存采集—阶段性复现”本质一致，只是观测对象从 C++ 对象和寄存器换成了 Dart AOT 函数、对象池与 Flutter 运行时对象。</p>

<h2 id="s9">9. 常见问题与排查</h2>

<h3>9.1 编译器版本过低</h3>

<p>如果报错集中在 <code>&lt;format&gt;</code>、C++20 或标准库实现，优先检查编译器版本。Linux 应满足官方要求的 <code>g++ &gt;= 13</code> 或相应的新版本 Clang；旧系统中只升级单个编译器包仍可能与系统库不兼容。</p>

<h3>9.2 Windows 找不到 MSVC 或 CMake</h3>

<p>确认 Visual Studio 已安装 C++ Desktop 和 CMake 组件，并从 <strong>x64 Native Tools Command Prompt</strong> 启动。普通 PowerShell/CMD 未必具有正确的编译环境。</p>

<h3>9.3 Dart Runtime 获取或构建失败</h3>

<p>首次分析新的 Dart 版本时，Blutter 可能需要访问上游仓库并执行较长时间的编译。应检查 Git 网络、磁盘空间、CMake/Ninja 版本和代理配置。更新项目后可以用 <code>--rebuild</code> 排除旧缓存影响。</p>

<h3>9.4 找不到 libapp.so 或版本检测失败</h3>

<p>传入参数必须是包含 <code>libapp.so</code> 与 <code>libflutter.so</code> 的 <code>arm64-v8a</code> 目录，而不是 APK 文件、单独的 <code>libapp.so</code> 或整个解压目录。Split APK 场景还要确认提取的是 ARM64 Split。</p>

<h3>9.5 输出函数不完整或名称不可读</h3>

<p>可能原因包括 Dart 版本较旧、Flutter 内部布局尚未适配、应用启用了混淆，或 Blutter 仍缺少对应代码模式。不要通过静态调用图擅自补齐缺失函数；应将其标记为工具能力边界，并通过运行时数据继续验证。</p>

<h3>9.6 磁盘占用持续增长</h3>

<p>项目目录中的 <code>build/</code> 保存构建工程，<code>dartsdk/</code> 保存 Dart Runtime 源码，<code>packages/</code> 保存 Dart Runtime 静态库，<code>bin/</code> 则缓存不同 Dart 版本的 Blutter 可执行文件。官方说明部分构建目录可在完成后删除，但保留 <code>bin/</code> 缓存能够减少重复构建。</p>

<h2 id="s10">10. 推荐分析工作流</h2>

<p>为了避免把工具输出误认为最终结论，可以按以下顺序组织一次 Flutter 样本分析：</p>

<ol>
<li><strong>样本归档：</strong>记录 APK 哈希、版本号、架构和获取来源。</li>
<li><strong>静态拆分：</strong>分别保存 DEX、Manifest、Assets、<code>libapp.so</code> 与 <code>libflutter.so</code>。</li>
<li><strong>Blutter 解析：</strong>按样本版本建立独立输出目录，保存完整日志。</li>
<li><strong>语义定位：</strong>通过对象池和汇编定位候选类、函数与常量。</li>
<li><strong>静态核对：</strong>在 IDA 中验证函数边界、偏移、分支和数据依赖。</li>
<li><strong>动态证明：</strong>通过 Frida 记录当前案例的实际命中、参数和返回值。</li>
<li><strong>阶段复现：</strong>以真实中间数据为测试向量实现等价逻辑。</li>
<li><strong>独立验证：</strong>使用未参与推导的新输入排除样本硬编码。</li>
</ol>

<p>最终报告应明确区分四类信息：</p>

<table>
<tr><th>证据类型</th><th>示例</th></tr>
<tr><td>静态工具事实</td><td>Blutter 在对象池中恢复出某个字符串或函数偏移</td></tr>
<tr><td>静态代码事实</td><td>IDA 中该函数存在某个比较、调用或数据写入</td></tr>
<tr><td>运行时事实</td><td>Frida 证明当前案例命中该函数，并记录真实参数</td></tr>
<tr><td>分析推断</td><td>根据多组数据认为该函数负责鉴权、解码或状态转换</td></tr>
</table>

<p>Blutter 解决的是 Flutter AOT 分析中的“看不见函数与对象”问题，却不会替代执行流、运行时采集和多样本验证。把它当成静态语义恢复器，再与 IDA 和 Frida 组成证据闭环，才能发挥最大的分析价值。</p>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
