---
title: "OnePlus 7T 刷机笔记：TWRP + Magisk 完整流程"
date: 2026-07-16
categories: "环境搭建"
tags: ["刷机", "OnePlus", "TWRP", "Magisk", "Android"]
id: "oneplus-7t-flashing-guide"
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

<div class="hero"><h1>OnePlus 7T 刷机笔记：TWRP + Magisk 完整流程</h1>
<p class="subtitle">解锁 Bootloader → TWRP → 刷写系统 → Magisk Root</p>
<div class="hero-meta"><span class="tag tag-accent">环境搭建</span><span class="tag">刷机</span><span class="tag">OnePlus</span><span class="tag">TWRP</span><span class="tag">Magisk</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#sec-prep">1. 准备工作</a></li>
<li><a href="#sec-unlock">2. 解锁 Bootloader</a></li>
<li><a href="#sec-twrp">3. 刷入 TWRP</a></li>
<li><a href="#sec-rom">4. 刷写第三方 ROM</a></li>
<li><a href="#sec-magisk">5. 刷入 Magisk（获取 Root）</a>
  <div class="toc-sub">
  <a href="#sec-magisk-twrp">5.1 方式一：TWRP 刷入 Magisk.zip</a>
  <a href="#sec-magisk-boot">5.2 方式二：修补 boot.img（推荐）</a>
  </div>
</li>
<li><a href="#sec-check">6. 验证</a></li>
</ul></div>

<div class="article-content">

<h2 id="sec-prep">1. 准备工作</h2>

<p>刷机前需要准备好以下环境和文件：</p>

<table>
<tr><th>需要准备</th><th>说明</th></tr>
<tr><td>ADB / Fastboot 工具</td><td>电脑端工具，用于下发刷机指令</td></tr>
<tr><td>解锁 Bootloader</td><td>刷机的必要前提，会清空所有数据</td></tr>
<tr><td>TWRP 镜像</td><td>第三方 Recovery，用于刷写 zip 包</td></tr>
<tr><td>ROM 刷机包</td><td>第三方系统包（如 Pixel Experience、LineageOS 等），zip 格式</td></tr>
<tr><td>Magisk 安装包</td><td>获取 Root 权限的工具（APK 或 ZIP 格式）</td></tr>
<tr><td>备份数据</td><td>解锁、刷机都会清数据，提前备份</td></tr>
</table>

<h2 id="sec-unlock">2. 解锁 Bootloader</h2>

<p>刷任何第三方东西之前，都要先解 BL 锁。这是厂商设置的"第一道门"。</p>

<pre><code># 1. 手机上开启开发者模式
设置 → 关于手机 → 连续点击"版本号"7 次

# 2. 打开 OEM 解锁 + USB 调试
设置 → 系统 → 开发者选项 → 开启 OEM 解锁 + USB 调试

# 3. 进入 fastboot 模式
adb reboot bootloader

# 4. 执行解锁
fastboot oem unlock
# 或 fastboot flashing unlock

# 5. 用音量键确认解锁 → 手机自动恢复出厂并重启</code></pre>

<div class="warn-box">
<div class="warn-label">注意</div>
解锁 Bootloader 会清除手机所有数据，相当于恢复出厂设置。如果手机上有重要数据，务必先备份。
</div>

<h2 id="sec-twrp">3. 刷入 TWRP</h2>

<p>BL 解锁后，就可以刷入 TWRP 了。TWRP 是一个第三方 Recovery 工具，替代官方 recovery，用来刷写 zip 包、备份系统等。</p>

<pre><code># 1. 再次进入 fastboot
adb reboot bootloader

# 2. 刷入 TWRP（两种方式）

# 方式 A：临时启动（不写入 recovery 分区，重启后恢复官方 recovery）
fastboot boot twrp-3.7.0_11-0-oos11-fbe-hotdogb.img

# 方式 B：永久刷入（替换官方 recovery）
fastboot flash recovery twrp-3.7.0_11-0-oos11-fbe-hotdogb.img

# 刷完后，用音量键选择 Recovery Mode，按电源键确认进入 TWRP</code></pre>

<div class="tip-box">
<div class="tip-label">建议</div>
第一次刷机推荐先临时启动 TWRP（方式 A）试试。如果后续需要经常用 TWRP，再永久刷入。
</div>

<h2 id="sec-rom">4. 刷写第三方 ROM</h2>

<p>第三方 ROM 通常以 zip 包形式分发，在 TWRP 中刷入。这个刷入的过程本质上就是解压 zip 并写入各分区。</p>

<pre><code># 1. 把 ROM 包推送到手机
adb push rom_name.zip /sdcard/

# 2. 在 TWRP 中操作
# 进入 TWRP 主界面 → Wipe → 滑动恢复出厂（四清：Dalvik、Data、Cache、System）
# 注意：不要 wipe Internal Storage（会清掉 ROM 包）

# 3. 刷入系统
# 返回 TWRP 主界面 → Install → 选择 rom_name.zip → 滑动刷入

# 4. 重启
# 刷完后点击 Wipe cache/dalvik → Reboot System
# 第一次开机比较慢（5-15 分钟），等待进入系统</code></pre>

<div class="warn-box">
<div class="warn-label">为什么叫"解压安装"</div>
ROM 包（zip）本质上就是一个压缩包，里面包含系统镜像文件（system.img、boot.img、vendor.img 等）。TWRP 刷写 zip 包的过程，就是把这些镜像解压并写入对应分区。<br><br>
刷机包（zip）本质上就是一个压缩包，TWRP 刷写的过程就是将其解压并写入手机各分区。
</div>

<h2 id="sec-magisk">5. 刷入 Magisk（获取 Root）</h2>

<p>Magisk 有两种常见的刷入方式：</p>

<h3 id="sec-magisk-twrp">5.1 方式一：TWRP 刷入 Magisk.zip</h3>

<p>这是最直接的方式，刷完 ROM 后直接在 TWRP 里刷 Magisk：</p>

<pre><code># 1. 把 Magisk 安装包推送到手机
adb push Magisk-v27.0.apk /sdcard/
# TWRP 下可以直接刷 APK 文件（它自动识别为 ZIP）

# 2. 在 TWRP 中
# Install → 选择 Magisk-v27.0.apk → 滑动刷入

# 3. 重启
# Reboot System

# 4. 进系统后，安装 Magisk Manager APK
# 打开 Magisk → 显示已安装版本号 → Root 成功</code></pre>

<h3 id="sec-magisk-boot">5.2 方式二：修补 boot.img（推荐，更稳定）</h3>

<p>修补 boot.img 的完整流程如下：</p>

<pre><code># 第一步：提取 boot.img
# 从当前系统的 OTA 包中，用 payload_dumper 工具提取 boot.img

# 第二步：传给手机
adb push boot.img /sdcard/Download/

# 第三步：用 Magisk Manager 修补
# 手机上安装 Magisk Manager APK
# 打开 → 点击"安装" → "选择并修补一个文件"
# 选择 /sdcard/Download/boot.img
# 修补完成后，在 Download 目录生成 magisk_patched-xxx.img

# 第四步：把修补后的文件传回电脑
adb pull /sdcard/Download/magisk_patched-xxx.img

# 第五步：刷入修补后的 boot
adb reboot bootloader
fastboot flash boot magisk_patched-xxx.img

# 第六步：重启
fastboot reboot
# 开机后 Magisk Manager 已显示已安装 Root 权限 ✅</code></pre>

<div class="tip-box">
<div class="tip-label">关于 /data/tmp</div>
在比较早期的版本（Magisk v20 以前），确实有一种做法是将 Magisk zip 放到某个 tmp 目录后重启，它会自动触发安装，这叫 "Magic Flash"。新版本的 Magisk Manager 已经内置了直接安装功能，不需要手动放 tmp 目录了。
</div>

<div class="warn-box">
<div class="warn-label">方式二更好</div>
修补 boot.img 的方式不需要依赖 TWRP，也不修改 recovery 分区。<br>
以后刷 OTA 更新时，只需要重新执行一次修补流程即可，不容易翻车。
</div>

<h2 id="sec-check">6. 验证</h2>

<p>刷完 Magisk 后，确认 Root 是否正常：</p>

<pre><code># 命令行验证
adb shell
su
# 如果弹出授权提示，或 $ 变成 # → Root 成功

# 也可以用 Root Checker 等 App 验证</code></pre>

<p>Magisk 的安装方式在版本迭代中有一些变化。现在的主流方式是修补 boot.img，而非通过 tmp 目录自动触发安装。</p>

<div class="footer">参考：XDA Developers · Magisk 官方文档 · TWRP 官方</div>

</div></div>
