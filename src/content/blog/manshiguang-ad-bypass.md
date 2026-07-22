---
title: "漫时光 App 广告绕过与逆向分析"
date: 2026-07-22
categories: "Android"
tags: ["Android", "逆向工程", "Flutter", "Smali", "WindMill"]
id: "manshiguang-ad-bypass"
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

<div class="hero"><h1>漫时光 App 广告绕过与逆向分析</h1>
<p class="subtitle">Flutter 应用广告聚合 SDK 逆向全记录 —— 从底层架构到 Smali 修改</p>
<div class="hero-meta"><span class="tag tag-accent">Android</span><span class="tag">逆向工程</span><span class="tag">Flutter</span><span class="tag">Smali</span><span class="tag">WindMill</span></div>
</div>
<div class="container">
<a class="back" href="/archives">&larr; 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 概述</a></li>
<li><a href="#s2">2. 应用基本信息</a></li>
<li><a href="#s3">3. 广告 SDK 架构分析</a></li>
<li class="toc-sub"><a href="#s3-1">3.1 广告网络矩阵</a></li>
<li class="toc-sub"><a href="#s3-2">3.2 Flutter 平台通道桥接</a></li>
<li class="toc-sub"><a href="#s3-3">3.3 奖励回调链路</a></li>
<li><a href="#s4">4. 修改策略</a></li>
<li class="toc-sub"><a href="#s4-1">4.1 入口分析</a></li>
<li class="toc-sub"><a href="#s4-2">4.2 劫持 loadReward</a></li>
<li class="toc-sub"><a href="#s4-3">4.3 劫持 showReward</a></li>
<li><a href="#s5">5. 踩坑记录</a></li>
<li class="toc-sub"><a href="#s5-1">5.1 if-nez 与 if-eqz 的歧义</a></li>
<li class="toc-sub"><a href="#s5-2">5.2 跳过 loadAd 导致的网络问题</a></li>
<li><a href="#s6">6. 重打包与签名</a></li>
<li><a href="#s7">7. 总结</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 概述</h2>

<p>本文记录了对<strong>"漫时光"</strong>（<code>com.weimei168.erjian.msg.gsm</code>）Android 应用的逆向分析过程。目标是绕过激励视频广告播放，直接获取应用内奖励。该应用是一个 Flutter 应用，使用了<strong>WindMill 广告聚合平台</strong>，集成了多家主流广告 SDK。</p>

<div class="tip-box">
<div class="tip-label">TIP</div>
本文描述的技术只适用于本地修改自用，不得用于商业用途或侵犯他人权益。
</div>

<h2 id="s2">2. 应用基本信息</h2>

<p>通过 <code>apktool</code> 解包后，得到以下基本信息：</p>

<table>
<tr><th>属性</th><th>值</th></tr>
<tr><td>包名</td><td><code>com.weimei168.erjian.msg.gsm</code></td></tr>
<tr><td>版本</td><td>1.1.1 (versionCode 111)</td></tr>
<tr><td>minSdk</td><td>24</td></tr>
<tr><td>targetSdk</td><td>36</td></tr>
<tr><td>框架</td><td>Flutter (flutterEmbedding=2)</td></tr>
<tr><td>主 Activity</td><td><code>com.proetry.www.MainActivity</code></td></tr>
</table>

<p>应用总共包含 <strong>4 个 smali 目录</strong>（multi-dex），近 30,000 个 smali 文件，assets 目录中内置了 <code>bdxadsdk.jar</code>（百度广告 SDK）和 <code>gdt_plugin/gdtadv2.jar</code>（腾讯优量汇 SDK）。</p>

<h2 id="s3">3. 广告 SDK 架构分析</h2>

<h3 id="s3-1">3.1 广告网络矩阵</h3>

<p>通过分析 smali 代码，发现应用集成了 <strong>5 家广告 SDK</strong>，全部通过 <strong>WindMill</strong>（一个国内常用的广告聚合平台）统一管理：</p>

<table>
<tr><th>广告网络</th><th>适配器路径</th></tr>
<tr><td>腾讯优量汇 (GDT)</td><td><code>com.windmill.gdt.GDTRewardVideoAdapter</code></td></tr>
<tr><td>字节 Pangle (穿山甲)</td><td><code>com.windmill.toutiao.TouTiaoRewardVideoAdapter</code></td></tr>
<tr><td>快手联盟</td><td><code>com.windmill.kuaishou.KuaiShouRewardVideoAdapter</code></td></tr>
<tr><td>百度广告</td><td><code>com.windmill.baidu.BdRewardAdapter</code></td></tr>
<tr><td>Sigmob</td><td><code>com.windmill.sigmob.SigRewardAdAdapter</code></td></tr>
</table>

<p>此外还有 <strong>BeiZi（倍孜）</strong> 广告 SDK 作为补充。这是一个典型的<strong>国内 Android 广告聚合架构</strong>——通过一个中介层（WindMill）统一管理多家广告源的竞价、加载、展示和回调。</p>

<h3 id="s3-2">3.2 Flutter 平台通道桥接</h3>

<p>由于是 Flutter 应用，核心业务逻辑在 Dart 层（编译为 <code>libapp.so</code>），无法直接修改。但广告 SDK 是原生 Android 代码，因此 <strong>Flutter 与原生广告代码之间的通信通道</strong> 就成了关键切入点。</p>

<p>经过代码分析，找到了一个自定义 Flutter 插件 <code>com.hzsv.libs.s5.a</code>，它实现了三个接口：</p>

<pre><code>.implements Lio/flutter/embedding/engine/plugins/FlutterPlugin;
.implements Lio/flutter/plugin/common/MethodChannel$MethodCallHandler;
.implements Lio/flutter/embedding/engine/plugins/activity/ActivityAware;</code></pre>

<p>这个插件在 <code>onAttachedToEngine</code> 中注册了一个 <strong>MethodChannel</strong> 和三个 <strong>EventChannel</strong>：</p>

<table>
<tr><th>通道名</th><th>类型</th><th>用途</th></tr>
<tr><td><code>flutter_ads_plugin/method</code></td><td>MethodChannel</td><td>Flutter 调用原生广告方法</td></tr>
<tr><td><code>flutter_ads_plugin/events_RewardAd</code></td><td>EventChannel</td><td>激励广告事件回调给 Flutter</td></tr>
<tr><td><code>flutter_ads_plugin/events_SplashAd</code></td><td>EventChannel</td><td>开屏广告事件</td></tr>
<tr><td><code>flutter_ads_plugin/events_InterstitialAd</code></td><td>EventChannel</td><td>插屏广告事件</td></tr>
</table>

<p><code>onMethodCall</code> 方法处理以字符串比较为路由的请求分发，支持以下方法：<code>init</code>、<code>loadSplash</code>、<code>showSplash</code>、<code>loadAndShowSplash</code>、<code>loadInterstitial</code>、<code>showInterstitial</code>、<code>loadReward</code>、<code>showReward</code>、<code>log</code>。</p>

<h3 id="s3-3">3.3 奖励回调链路</h3>

<p>完整的奖励回调链路如下：</p>

<pre><code>Flutter (Dart)
    |
    | MethodChannel "flutter_ads_plugin/method"
    |-- loadReward(codeId, userId, option)
    |-- showReward(option)
    |
    v
com.hzsv.libs.s5.a  (Flutter 插件桥接层)
    |
    |-- loadReward --&gt; 创建 SVAdsSdkReward --&gt; loadAd()
    |-- showReward --&gt; isReady() --&gt; show()
    |
    v
com.hzsv.openads.SVAdsSdkReward  (自定义 SDK 封装)
    |
    v
com.windmill.sdk.reward.WMRewardAd  (WindMill 聚合)
    |
    |-- GDTRewardVideoAdapter (腾讯 GDT)
    |-- TouTiaoRewardVideoAdapter (字节 Pangle)
    |-- KuaiShouRewardVideoAdapter (快手)
    |-- BdRewardAdapter (百度)
    |-- SigRewardAdAdapter (Sigmob)
    |
    v  (回调上抛)
SVAdsSdkReward$4 --&gt; u5.a (SVOnAdsSdkRewardListener)
    |
    | EventChannel "flutter_ads_plugin/events_RewardAd"
    | {"event": "onVideoRewarded", "transId": "xxx"}
    |
    v
Flutter (Dart 层发放奖励)</code></pre>

<p>关键回调监听器 <code>u5.a</code> 实现了 <code>SVOnAdsSdkRewardListener</code> 接口，每个回调方法都构造一个 HashMap，通过 <code>EventSink.success()</code> 发送给 Flutter 端：</p>

<pre><code>onVideoAdLoadSuccess --&gt; {"event": "onVideoAdLoadSuccess"}
onVideoAdPlayStart  --&gt; {"event": "onVideoAdPlayStart"}
onVideoRewarded     --&gt; {"event": "onVideoRewarded", "transId": "xxx"}
onVideoAdPlayEnd    --&gt; {"event": "onVideoAdPlayEnd"}
onVideoAdClosed     --&gt; {"event": "onVideoAdClosed"} + endOfStream()</code></pre>

<h2 id="s4">4. 修改策略</h2>

<h3 id="s4-1">4.1 入口分析</h3>

<p>最终的切入点选择在 <code>com.hzsv.libs.s5.a</code> 的 <code>onMethodCall</code> 方法中。这是 Flutter 调用原生广告功能的唯一入口，修改此处可以同时控制 <code>loadReward</code> 和 <code>showReward</code> 两个流程。</p>

<h3 id="s4-2">4.2 劫持 loadReward</h3>

<p>原始的 <code>loadReward</code> 处理逻辑位于 <code>:goto_3</code> 标签处：</p>

<pre><code>:goto_3
iget-object p1, p0, ... -&gt;f:Lcom/hzsv/libs/u5/b;
iget-object p1, p1, ... -&gt;c:Lcom/hzsv/openads/SVAdsSdkReward;
if-eqz p1, :cond_d       ; 如果 null 则返回
invoke-virtual {p1}, ... -&gt;loadAd()V  ; 加载真实广告
return-void</code></pre>

<p>修改为：先调用 <code>loadAd()</code> 确保 SDK 正常初始化网络，然后通过 <code>EventSink</code> 发送伪造的加载成功事件：</p>

<pre><code>:goto_3
iget-object p1, p0, ... -&gt;f:Lcom/hzsv/libs/u5/b;
iget-object p1, p1, ... -&gt;c:Lcom/hzsv/openads/SVAdsSdkReward;
if-eqz p1, :do_send_fake  ; 如果 null 跳过 loadAd
invoke-virtual {p1}, ... -&gt;loadAd()V  ; 初始化 SDK

:do_send_fake
iget-object p1, p0, ... -&gt;f:Lcom/hzsv/libs/u5/b;
iget-object p1, p1, ... -&gt;b:Lio/flutter/plugin/common/EventChannel$EventSink;
if-eqz p1, :cond_d        ; 如果 EventSink 为 null 则返回
new-instance v3, Ljava/util/HashMap;
...
const-string v5, "onVideoAdLoadSuccess"
invoke-interface {p1, v3}, ... EventSink-&gt;success
return-void</code></pre>

<h3 id="s4-3">4.3 劫持 showReward</h3>

<p><code>showReward</code> 的原始逻辑做了三层检查：<code>u5.b != null</code>、<code>SVAdsSdkReward != null</code>、<code>isReady()</code>，全部通过后才调用 <code>show()</code> 播放广告。修改后完全绕过这些检查，直接伪造整个播放和奖励流程：</p>

<pre><code>:cond_c
; 方法名 == "showReward" 检查
iget-object v3, p1, ... method:String
const-string v5, "showReward"
invoke-virtual {v3, v5}, ... equals
move-result v3
if-eqz v3, :cond_e     ; 不是 showReward 跳到下一个 handler

; 检查 u5.b 是否可用
iget-object p1, p0, ... -&gt;f:Lcom/hzsv/libs/u5/b;
if-eqz p1, :cond_d     ; u5.b 为 null 则返回

; 获取 EventSink
iget-object p1, p1, ... -&gt;b:EventSink;
if-eqz p1, :cond_xx    ; EventSink 为 null 则返回

; 发送 4 个伪造事件：
; 1. onVideoAdPlayStart
new-instance v6, HashMap
const-string v5, "onVideoAdPlayStart"
invoke-interface {p1, v6}, EventSink-&gt;success

; 2. onVideoRewarded (含伪造 transId)
new-instance v6, HashMap
const-string v5, "onVideoRewarded"
const-string v4, "transId"
const-string v5, "bypass_fake_id"
invoke-interface {p1, v6}, EventSink-&gt;success

; 3. onVideoAdPlayEnd
new-instance v6, HashMap
const-string v5, "onVideoAdPlayEnd"
invoke-interface {p1, v6}, EventSink-&gt;success

; 4. onVideoAdClosed + endOfStream
new-instance v6, HashMap
const-string v5, "onVideoAdClosed"
invoke-interface {p1, v6}, EventSink-&gt;success
invoke-interface {p1}, EventSink-&gt;endOfStream

:cond_xx
return-void</code></pre>

<h2 id="s5">5. 踩坑记录</h2>

<h3 id="s5-1">5.1 if-nez 与 if-eqz 的歧义</h3>

<p>第一次修改时犯了一个低级错误——混淆了 <code>if-nez</code> 和 <code>if-eqz</code> 的含义：</p>

<table>
<tr><th>指令</th><th>含义</th><th>相当于</th></tr>
<tr><td><code>if-eqz vX, :target</code></td><td>如果 <strong>vX == 0</strong> 则跳转</td><td><code>if (v == null) goto target</code></td></tr>
<tr><td><code>if-nez vX, :target</code></td><td>如果 <strong>vX != 0</strong> 则跳转</td><td><code>if (v != null) goto target</code></td></tr>
</table>

<p>原始代码中 <code>if-eqz p1, :cond_d</code> 意为"如果 p1 为 null 则跳转到返回"。我错误地写成了 <code>if-nez p1, :cond_d</code>，结果变成了"如果 p1 不为 null 则返回"——当 EventSink 正常存在时反而跳过事件发送，导致整个奖励流程卡死。</p>

<div class="warn-box">
<div class="warn-label">WARN</div>
Smali 的 <code>if-eqz</code> 中的 "z" 代表 "zero"——检测的是"是否为零/空"，而不是"是否等于"。初次接触很容易搞反。
</div>

<h3 id="s5-2">5.2 跳过 loadAd 导致的网络问题</h3>

<p>第一次修改还跳过了 <code>loadAd()</code> 调用，认为"既然不加载广告，就不需要初始化广告 SDK"。但这导致了一个严重问题：</p>

<p>WindMill SDK 在 <code>loadAd()</code> 时会进行网络初始化——建立 HTTP 连接池、获取广告配置、初始化各广告网络适配器。跳过这个调用后，SDK 处于<strong>半初始化</strong>状态，部分网络组件拦截了应用的正常网络请求，导致整个应用出现<strong>"网络请求失败"</strong>的错误。</p>

<p>修复方案：恢复 <code>loadAd()</code> 调用让 SDK 正常初始化，只在 <code>showReward</code> 阶段拦截广告播放。</p>

<h2 id="s6">6. 重打包与签名</h2>

<p>修改完成后，需要经过以下步骤重新打包：</p>

<h4>重打包</h4>
<pre><code>java -jar apktool_3.0.3.jar b apkbase_dir -o patched.apk</code></pre>

<h4>签名</h4>
<p>推荐使用 Android SDK 自带的 <code>apksigner</code>：</p>
<pre><code>apksigner sign --ks debug.jks --ks-key-alias debug \
    --ks-pass pass:android --key-pass pass:android patched.apk</code></pre>

<h4>验证签名</h4>
<pre><code>apksigner verify patched.apk</code></pre>

<h4>安装</h4>
<pre><code>adb install -r patched.apk</code></pre>

<div class="tip-box">
<div class="tip-label">TIP</div>
<code>apksigner</code> 位于 Android SDK 的 <code>build-tools/&lt;version&gt;/</code> 目录下，比 <code>jarsigner</code> 更适合 APK 签名，会自动处理 V1/V2/V3 签名方案。
</div>

<h2 id="s7">7. 总结</h2>

<p>这次逆向过程涉及了以下技术点：</p>

<ul>
<li><strong>Flutter 应用分析</strong>：识别 Flutter 引擎、插件注册、MethodChannel 和 EventChannel 通信机制</li>
<li><strong>广告聚合 SDK 架构</strong>：理解 WindMill 如何统一管理多家广告网络</li>
<li><strong>Smali 代码修改</strong>：在汇编层面对 Android 字节码进行精确修改</li>
<li><strong>APK 重打包</strong>：使用 apktool 解包/回编，apksigner 签名</li>
<li><strong>调试与修复</strong>：从网络异常的 bug 逆向排查到 smali 指令错误</li>
</ul>

<blockquote>逆向工程是一个不断试错的过程。每一步错误都是理解的深化，每一个 bug 都是对系统更深刻的认知。</blockquote>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
