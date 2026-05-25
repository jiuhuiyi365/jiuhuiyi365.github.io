---
title: "SO 文件注入方法（外挂注入）"
date: 2026-05-25
categories: "安全与逆向"
tags: ["逆向","SO注入","安全"]
id: "so-injection"
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

<div class="hero"><h1>SO 文件注入方法（外挂注入）</h1>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">SO 注入的基本原理</a></li>
<li><a href="#s2">常见注入方法</a></li>
<li class="toc-sub"><a href="#s2">ptrace + dlopen 注入</a></li>
<li class="toc-sub"><a href="#s2">LD_PRELOAD 预加载</a></li>
<li class="toc-sub"><a href="#s2">/proc/pid/mem 内存注入</a></li>
<li><a href="#s3">自定义 SO 编写</a></li>
<li><a href="#s4">防护与检测</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. SO 注入的基本原理</h2>
<p>SO 注入是一种在 Android/Linux 环境下通过<strong>将自定义动态链接库加载到目标进程地址空间</strong>中来改变其行为的技术。常用于游戏外挂、逆向分析、安全测试等场景。</p>
<p>基本原理是利用操作系统提供的动态链接机制（如 <code>dlopen</code>），在目标进程中执行任意代码。注入流程通常分为两步：</p>
<ol>
<li>在目标进程中调用 <code>dlopen</code> 加载恶意 SO 文件</li>
<li>SO 的 <code>__attribute__((constructor))</code> 函数自动执行，完成 hook 或篡改</li>
</ol>

<h2 id="s2">2. 常见注入方法</h2>

<h3>方法一：ptrace + dlopen 注入</h3>
<p>利用 <code>ptrace</code> 系统调用 attach 到目标进程，修改其寄存器和栈，使其执行 <code>dlopen</code>：</p>
<pre><code>// 1. attach 目标进程
ptrace(PTRACE_ATTACH, target_pid, NULL, NULL);
waitpid(target_pid, NULL, 0);

// 2. 保存目标进程的寄存器状态
struct user_regs_struct old_regs, new_regs;
ptrace(PTRACE_GETREGS, target_pid, NULL, &old_regs);

// 3. 在目标进程中分配内存（用于存放 SO 路径字符串）
//    通过 mmap 系统调用在远程进程分配空间
new_regs = old_regs;
new_regs.orig_rax = 9;  // __NR_mmap
new_regs.rdi = 0;       // addr = NULL
new_regs.rsi = 4096;    // length
new_regs.rdx = PROT_READ | PROT_WRITE | PROT_EXEC;  // prot
new_regs.r10 = MAP_ANONYMOUS | MAP_PRIVATE;  // flags
new_regs.r8 = -1;       // fd
new_regs.r9 = 0;        // offset

// 4. 注入 shellcode 调用 dlopen/dlsym
// 5. 恢复寄存器，detach 进程
ptrace(PTRACE_SETREGS, target_pid, NULL, &old_regs);
ptrace(PTRACE_DETACH, target_pid, NULL, NULL);</code></pre>

<h3>方法二：LD_PRELOAD 预加载</h3>
<p>设置环境变量 <code>LD_PRELOAD</code> 使动态链接器在程序启动时优先加载指定 SO：</p>
<pre><code>LD_PRELOAD=./libhook.so ./target_app</code></pre>
<p>该方法只能在进程启动前设置，适用于 hook libc 函数（如 <code>open</code>、<code>read</code>、<code>connect</code>）的场景。</p>

<h3>方法三：/proc/pid/mem 内存注入</h3>
<p>直接读写目标进程的内存空间（需要 root 权限）：</p>
<pre><code>#include <fcntl.h>
#include <sys/stat.h>

// 打开目标进程的内存
char mem_path[64];
sprintf(mem_path, "/proc/%d/mem", target_pid);
int fd = open(mem_path, O_RDWR);

// 定位到目标地址写入 shellcode
lseek(fd, target_addr, SEEK_SET);
write(fd, shellcode, shellcode_size);</code></pre>

<h2 id="s3">3. 自定义 SO 编写</h2>
<p>注入的 SO 通常使用 <code>__attribute__((constructor))</code> 定义构造函数，在 SO 被加载时自动执行：</p>
<pre><code>#include <stdio.h>
#include <unistd.h>
#include <android/log.h>
#include <substrate.h>  // 或使用 inline hook 库

#define LOG_TAG "HOOK"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

// Hook 目标函数
static int (*orig_open)(const char *pathname, int flags, ...);

int hooked_open(const char *pathname, int flags, ...) {
    LOGI("open() called: %s", pathname);
    return orig_open(pathname, flags);
}

// SO 加载时自动执行
__attribute__((constructor))
static void init() {
    LOGI("SO injected into PID %d", getpid());

    // 使用 PLT/GOT hook 或 inline hook 替换 open 函数
    MSHookFunction(
        (void *)open,
        (void *)hooked_open,
        (void **)&orig_open
    );
}</code></pre>

<h2 id="s4">4. 防护与检测</h2>
<table><tr><th>检测手段</th><th>原理</th><th>绕过难度</th></tr>
<tr><td>检查 <code>/proc/self/maps</code></td><td>扫描加载的 SO 列表</td><td>中等</td></tr>
<tr><td>ptrace 自保护</td><td>进程 attach 自身防止被 ptrace</td><td>低</td></tr>
<tr><td>签名校验</td><td>验证 SO 文件的数字签名</td><td>高</td></tr>
<tr><td>完整性检查</td><td>周期性校验代码段的 CRC</td><td>高</td></tr>
<tr><td>反调试</td><td>检测 <code>TracerPid</code>、时序异常</td><td>中等</td></tr></table>

<div class="danger-box"><div class="danger-label">免责声明</div>本文仅用于安全研究和学习目的。未经授权对他人软件进行注入属于违法行为。请在合法授权的范围内使用这些技术。</div>
</div>
<div class="nav-bar"><a href="/archives">← 总目录</a><a href="/article/cmake-intro">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
