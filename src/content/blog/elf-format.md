---
title: "ELF 文件格式详解：从结构到加载的完整剖析"
date: 2026-05-27
categories: "安全与逆向"
tags: ["ELF","二进制","Linux","逆向"]
id: "elf-format"
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

<div class="hero"><h1>ELF 文件格式详解：从结构到加载的完整剖析</h1>
<p class="subtitle">理解 Linux 可执行文件的底层结构，掌握逆向分析的基础</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">ELF</span><span class="tag">Linux</span><span class="tag">二进制</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. ELF 概述</a></li>
<li><a href="#s2">2. 文件整体布局</a></li>
<li><a href="#s3">3. ELF Header</a></li>
<li><a href="#s4">4. Program Header Table（程序头表）</a></li>
<li><a href="#s5">5. Section Header Table（节头表）</a></li>
<li><a href="#s6">6. 核心 Section 详解</a></li>
<li><a href="#s7">7. 动态链接机制</a></li>
<li><a href="#s8">8. 符号与重定位</a></li>
<li><a href="#s9">9. 加载与执行流程</a></li>
<li><a href="#s10">10. 实用分析工具与命令</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. ELF 概述</h2>
<p>ELF（Executable and Linkable Format）是 Linux 和大多数 Unix 系统的可执行文件标准格式。它不仅用于可执行文件（EXE），还用于：</p>
<ul>
<li><strong>可重定位文件</strong>（Relocatable）：<code>.o</code> 文件，编译器输出</li>
<li><strong>可执行文件</strong>（Executable）：编译链接后的程序</li>
<li><strong>共享目标文件</strong>（Shared Object）：<code>.so</code> 动态链接库</li>
<li><strong>核心转储文件</strong>（Core Dump）：程序崩溃时的内存快照</li>
</ul>

<p>ELF 文件的类型通过 ELF Header 中的 <code>e_type</code> 字段标识。</p>

<h2 id="s2">2. 文件整体布局</h2>
<p>一个 ELF 文件从头到尾由以下部分组成：</p>

<pre><code>┌─────────────────────────┐  偏移 0x00
│      ELF Header         │  固定 64 字节（64位）或 52 字节（32位）
├─────────────────────────┤
│  Program Header Table   │  紧跟 ELF Header（或指定偏移）
│  (程序头表，段视图)      │  描述运行时如何加载
├─────────────────────────┤
│                         │
│     Segment 1 (LOAD)    │  代码段 (.text)
│     Segment 2 (LOAD)    │  数据段 (.data, .rodata, .bss)
│     Segment 3 (DYNAMIC) │  动态链接信息
│     ...                 │
│                         │
├─────────────────────────┤
│  Section Header Table   │  通常在文件末尾
│  (节头表，节视图)        │  描述文件内部结构
└─────────────────────────┘</code></pre>

<p>ELF 文件有两种视角：</p>
<ul>
<li><strong>链接视图</strong>（Linking View）：通过 Section Header Table 看到各节（Section）</li>
<li><strong>执行视图</strong>（Execution View）：通过 Program Header Table 看到各段（Segment）</li>
</ul>

<p>节（Section）是给链接器和编译器看的，段（Segment）是给操作系统加载器看的。一个段可以包含多个节。</p>

<h2 id="s3">3. ELF Header</h2>
<p>ELF Header 是文件的起点，定义了文件的基本属性和关键偏移。</p>

<pre><code>typedef struct {
    unsigned char e_ident[16];  // 魔数和标识信息
    Elf64_Half    e_type;       // 文件类型
    Elf64_Half    e_machine;    // 目标架构
    Elf64_Word    e_version;    // ELF 版本
    Elf64_Addr    e_entry;      // 入口点地址
    Elf64_Off     e_phoff;      // Program Header Table 偏移
    Elf64_Off     e_shoff;      // Section Header Table 偏移
    Elf64_Word    e_flags;      // 处理器特定标志
    Elf64_Half    e_ehsize;     // ELF Header 大小
    Elf64_Half    e_phentsize;  // Program Header 大小
    Elf64_Half    e_phnum;      // Program Header 数量
    Elf64_Half    e_shentsize;  // Section Header 大小
    Elf64_Half    e_shnum;      // Section Header 数量
    Elf64_Half    e_shstrndx;   // 字符串表的 Section 索引
} Elf64_Ehdr;</code></pre>

<p><strong>e_ident 数组</strong>：前 4 字节是魔数 <code>0x7f 'E' 'L' 'F'</code>，用于验证文件格式。</p>

<table><tr><th>字段</th><th>偏移</th><th>大小</th><th>说明</th></tr>
<tr><td>e_ident[0..3]</td><td>0x00</td><td>4 字节</td><td>魔数 7f 45 4c 46</td></tr>
<tr><td>e_ident[4]</td><td>0x04</td><td>1 字节</td><td>类别：1=ELFCLASS32, 2=ELFCLASS64</td></tr>
<tr><td>e_ident[5]</td><td>0x05</td><td>1 字节</td><td>字节序：1=小端, 2=大端</td></tr>
<tr><td>e_type</td><td>0x10</td><td>2 字节</td><td>ET_REL(1)=可重定位, ET_EXEC(2)=可执行, ET_DYN(3)=共享库</td></tr>
<tr><td>e_machine</td><td>0x12</td><td>2 字节</td><td>EM_X86_64(62), EM_ARM(40), EM_AARCH64(183)</td></tr>
<tr><td>e_entry</td><td>0x18</td><td>8 字节</td><td>程序入口虚拟地址</td></tr>
<tr><td>e_phoff</td><td>0x20</td><td>8 字节</td><td>Program Header Table 文件偏移</td></tr>
<tr><td>e_shoff</td><td>0x28</td><td>8 字节</td><td>Section Header Table 文件偏移</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>用 <code>readelf -h target</code> 可以快速查看 ELF Header 全部信息。用 <code>hexdump -C target | head -1</code> 可以查看魔数。</div>

<h2 id="s4">4. Program Header Table（程序头表）</h2>
<p>程序头表描述了<strong>运行时如何加载</strong>文件内容到内存。每个条目定义一个段（Segment）。</p>

<pre><code>typedef struct {
    Elf64_Word  p_type;    // 段类型
    Elf64_Word  p_flags;   // 段标志
    Elf64_Off   p_offset;  // 段在文件中的偏移
    Elf64_Addr  p_vaddr;   // 段在虚拟内存中的地址
    Elf64_Addr  p_paddr;   // 物理地址（通常等于 vaddr）
    Elf64_Xword p_filesz;  // 段在文件中的大小
    Elf64_Xword p_memsz;   // 段在内存中的大小
    Elf64_Xword p_align;   // 对齐要求
} Elf64_Phdr;</code></pre>

<p><strong>关键段类型：</strong></p>
<table><tr><th>p_type</th><th>值</th><th>说明</th></tr>
<tr><td>PT_LOAD</td><td>1</td><td>可加载段，从文件映射到内存</td></tr>
<tr><td>PT_DYNAMIC</td><td>2</td><td>动态链接信息</td></tr>
<tr><td>PT_INTERP</td><td>3</td><td>动态链接器路径（如 <code>/lib64/ld-linux-x86-64.so.2</code>）</td></tr>
<tr><td>PT_NOTE</td><td>4</td><td>辅助信息（ABI 版本等）</td></tr>
<tr><td>PT_PHDR</td><td>6</td><td>程序头表自身的映射</td></tr>
<tr><td>PT_TLS</td><td>7</td><td>线程局部存储模板</td></tr>
<tr><td>PT_GNU_STACK</td><td>0x6474e551</td><td>栈可执行性标志</td></tr></table>

<p><strong>p_flags 段标志：</strong></p>
<table><tr><th>标志</th><th>值</th><th>含义</th></tr>
<tr><td>PF_X</td><td>1</td><td>可执行</td></tr>
<tr><td>PF_W</td><td>2</td><td>可写</td></tr>
<tr><td>PF_R</td><td>4</td><td>可读</td></tr></table>

<p>典型的 LOAD 段映射：</p>
<pre><code># readelf -l 输出示例
Type     Offset   VirtAddr   FileSiz   MemSiz   Flg Align
LOAD     0x000000 0x400000   0x000704  0x000704 R E 0x200000
LOAD     0x001000 0x601000   0x000230  0x000230 RW  0x200000</code></pre>

<p>第一个 LOAD 段包含 <code>.text</code>（代码），标志为 R E（可读可执行）。<br>
第二个 LOAD 段包含 <code>.data</code>（数据），标志为 RW（可读可写）。</p>

<h2 id="s5">5. Section Header Table（节头表）</h2>
<p>节头表描述了文件的<strong>内部组织结构</strong>。每个条目定义一个节（Section）。</p>

<pre><code>typedef struct {
    Elf64_Word  sh_name;      // 节名（在字符串表中的偏移）
    Elf64_Word  sh_type;      // 节类型
    Elf64_Xword sh_flags;     // 节标志
    Elf64_Addr  sh_addr;      // 节在内存中的虚拟地址
    Elf64_Off   sh_offset;    // 节在文件中的偏移
    Elf64_Xword sh_size;      // 节大小
    Elf64_Word  sh_link;      // 关联节索引
    Elf64_Word  sh_info;      // 附加信息
    Elf64_Xword sh_addralign; // 对齐要求
    Elf64_Xword sh_entsize;   // 表项大小（如果是表）
} Elf64_Shdr;</code></pre>

<h2 id="s6">6. 核心 Section 详解</h2>

<table><tr><th>Section 名</th><th>类型</th><th>说明</th></tr>
<tr><td><code>.text</code></td><td>PROGBITS</td><td>机器代码（指令）</td></tr>
<tr><td><code>.rodata</code></td><td>PROGBITS</td><td>只读数据（字符串常量等）</td></tr>
<tr><td><code>.data</code></td><td>PROGBITS</td><td>已初始化的全局/静态变量</td></tr>
<tr><td><code>.bss</code></td><td>NOBITS</td><td>未初始化的全局/静态变量（不占文件空间）</td></tr>
<tr><td><code>.symtab</code></td><td>SYMTAB</td><td>符号表（所有符号，包括局部）</td></tr>
<tr><td><code>.dynsym</code></td><td>DYNSYM</td><td>动态符号表（动态链接所需的符号）</td></tr>
<tr><td><code>.strtab</code></td><td>STRTAB</td><td>符号名字符串表</td></tr>
<tr><td><code>.dynstr</code></td><td>STRTAB</td><td>动态符号名字符串表</td></tr>
<tr><td><code>.rel.text</code></td><td>REL</td><td>.text 节的重定位信息</td></tr>
<tr><td><code>.rela.dyn</code></td><td>RELA</td><td>动态重定位（数据引用）</td></tr>
<tr><td><code>.rela.plt</code></td><td>RELA</td><td>PLT 重定位（函数调用）</td></tr>
<tr><td><code>.got</code></td><td>PROGBITS</td><td>全局偏移表（GOT）</td></tr>
<tr><td><code>.plt</code></td><td>PROGBITS</td><td>过程链接表（PLT）</td></tr>
<tr><td><code>.got.plt</code></td><td>PROGBITS</td><td>GOT 中 PLT 专用部分</td></tr>
<tr><td><code>.init</code> / <code>.fini</code></td><td>PROGBITS</td><td>构造/析构函数</td></tr>
<tr><td><code>.init_array</code> / <code>.fini_array</code></td><td>INIT_ARRAY</td><td>构造/析构函数数组</td></tr>
<tr><td><code>.dynamic</code></td><td>DYNAMIC</td><td>动态链接器所需信息</td></tr>
<tr><td><code>.interp</code></td><td>PROGBITS</td><td>动态链接器路径字符串</td></tr>
<tr><td><code>.shstrtab</code></td><td>STRTAB</td><td>Section 名字符串表</td></tr>
<tr><td><code>.note.*</code></td><td>NOTE</td><td>注释信息（ABI 标记等）</td></tr>
<tr><td><code>.eh_frame</code></td><td>PROGBITS</td><td>异常处理/栈展开信息</td></tr>
<tr><td><code>.ctors</code> / <code>.dtors</code></td><td>PROGBITS</td><td>旧版构造/析构函数（已被 init_array 取代）</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div><code>.bss</code> 的特殊之处：它在文件中不占空间（<code>sh_type = NOBITS</code>），但在内存中需要分配。这就是为什么 LOAD 段的 <code>p_memsz</code> 通常大于 <code>p_filesz</code>。</div>

<h2 id="s7">7. 动态链接机制</h2>
<p>动态链接是 ELF 最复杂的部分，涉及 PLT/GOT 两个核心结构。</p>

<p><strong>基本流程：</strong></p>
<ol>
<li>程序调用外部函数（如 <code>printf</code>）</li>
<li>调用跳转到 PLT 表项</li>
<li>PLT 表项读取 GOT 表中的地址</li>
<li>首次调用时 GOT 中填的是 PLT 的回填代码（解析函数地址）</li>
<li>动态链接器 <code>ld.so</code> 查找并解析真实地址，写入 GOT</li>
<li>后续调用直接通过 GOT 跳转，不再经过链接器</li>
</ol>

<p>这就是 <strong>Lazy Binding</strong>（延迟绑定），只在首次调用时解析符号。</p>

<pre><code>// 调用 printf 的流程
call printf@plt    // 跳到 PLT
  └→ jmp *GOT[printf]  // 读 GOT 中的地址
       └→ 首次：跳到回填代码 → 调用 ld.so 解析 → 写入 GOT
       └→ 非首次：直接跳到 printf 真实地址</code></pre>

<p><strong>关键动态段条目：</strong></p>
<table><tr><th>d_tag</th><th>说明</th></tr>
<tr><td>DT_NEEDED</td><td>需要的共享库名称</td></tr>
<tr><td>DT_SONAME</td><td>共享库自身的名称</td></tr>
<tr><td>DT_PLTGOT</td><td>GOT 表地址</td></tr>
<tr><td>DT_PLTRELSZ</td><td>PLT 重定位表大小</td></tr>
<tr><td>DT_SYMTAB</td><td>动态符号表地址</td></tr>
<tr><td>DT_STRTAB</td><td>字符串表地址</td></tr>
<tr><td>DT_HASH / DT_GNU_HASH</td><td>符号哈希表（加速符号查找）</td></tr>
<tr><td>DT_RPATH / DT_RUNPATH</td><td>共享库搜索路径</td></tr></table>

<h2 id="s8">8. 符号与重定位</h2>

<p><strong>符号表结构：</strong></p>
<pre><code>typedef struct {
    Elf64_Word  st_name;   // 符号名（字符串表偏移）
    unsigned char st_info; // 符号类型和绑定属性
    unsigned char st_other;// 可见性
    Elf64_Half  st_shndx;  // 所在节索引
    Elf64_Addr  st_value;  // 值（地址或常量）
    Elf64_Xword st_size;   // 大小
} Elf64_Sym;</code></pre>

<p><strong>符号绑定类型（st_info 高 4 位）：</strong></p>
<table><tr><th>值</th><th>名称</th><th>说明</th></tr>
<tr><td>STB_LOCAL</td><td>0</td><td>局部符号，仅在本文件可见</td></tr>
<tr><td>STB_GLOBAL</td><td>1</td><td>全局符号，对外可见</td></tr>
<tr><td>STB_WEAK</td><td>2</td><td>弱符号，可被全局符号覆盖</td></tr></table>

<p><strong>符号类型（st_info 低 4 位）：</strong></p>
<table><tr><th>值</th><th>名称</th><th>说明</th></tr>
<tr><td>STT_NOTYPE</td><td>0</td><td>未指定类型</td></tr>
<tr><td>STT_OBJECT</td><td>1</td><td>数据对象（变量）</td></tr>
<tr><td>STT_FUNC</td><td>2</td><td>函数</td></tr>
<tr><td>STT_SECTION</td><td>3</td><td>节关联符号</td></tr>
<tr><td>STT_FILE</td><td>4</td><td>源文件名符号</td></tr></table>

<p><strong>重定位类型（x86-64 常见）：</strong></p>
<table><tr><th>类型</th><th>值</th><th>计算方式</th></tr>
<tr><td>R_X86_64_64</td><td>1</td><td>S + A（符号地址 + 加数）</td></tr>
<tr><td>R_X86_64_PC32</td><td>2</td><td>S + A - P（PC 相对偏移）</td></tr>
<tr><td>R_X86_64_GOT32</td><td>3</td><td>G + A（GOT 偏移）</td></tr>
<tr><td>R_X86_64_PLT32</td><td>4</td><td>L + A - P（PLT 相对偏移）</td></tr>
<tr><td>R_X86_64_GLOB_DAT</td><td>6</td><td>S（直接写入 GOT）</td></tr>
<tr><td>R_X86_64_JUMP_SLOT</td><td>7</td><td>S（PLT/GOT 延迟绑定）</td></tr>
<tr><td>R_X86_64_RELATIVE</td><td>8</td><td>B + A（基址 + 加数，无符号）</td></tr></table>

<h2 id="s9">9. 加载与执行流程</h2>
<p>当在 Linux 上执行一个 ELF 程序时，内核和动态链接器的协作流程如下：</p>

<pre><code>1. 用户执行 ./program
        │
2. Shell 调用 execve()
        │
3. 内核 ELF Loader
   ├── 验证 ELF Header（魔数、架构）
   ├── 读取 Program Header Table
   ├── 对每个 PT_LOAD 段：
   │   ├── mmap() 映射文件内容到虚拟内存
   │   └── 清零 .bss 区域（p_memsz > p_filesz 的部分）
   ├── 检查 PT_INTERP 段
   │   └── 如果存在，加载动态链接器（ld.so）
   ├── 设置栈、环境变量、auxv
   └── 跳转到入口点（e_entry 或 ld.so 入口）
        │
4. 动态链接器 ld.so
   ├── 读取 PT_DYNAMIC 段
   ├── 加载 DT_NEEDED 指定的共享库
   ├── 解析 GOT/PLT 重定位
   ├── 执行 .init / .init_array
   └── 跳转到程序真正的入口点 (_start)
        │
5. _start (CRT)
   ├── 调用 __libc_start_main()
   ├── 调用全局构造函数
   └── 调用 main()
        │
6. 程序正常运行</code></pre>

<div class="tip-box"><div class="tip-label">TIP</div>用 <code>readelf -d target</code> 查看动态段可以知道程序依赖哪些 .so 文件。用 <code>ldd target</code> 可以递归列出所有依赖及其路径。用 <code>LD_DEBUG=all ./target</code> 可以看到动态链接器的完整加载过程。</div>

<h2 id="s10">10. 实用分析工具与命令</h2>

<table><tr><th>工具</th><th>命令</th><th>用途</th></tr>
<tr><td>readelf</td><td><code>readelf -h file</code></td><td>查看 ELF Header</td></tr>
<tr><td>readelf</td><td><code>readelf -l file</code></td><td>查看 Program Header Table</td></tr>
<tr><td>readelf</td><td><code>readelf -S file</code></td><td>查看 Section Header Table</td></tr>
<tr><td>readelf</td><td><code>readelf -s file</code></td><td>查看符号表</td></tr>
<tr><td>readelf</td><td><code>readelf -d file</code></td><td>查看动态段</td></tr>
<tr><td>readelf</td><td><code>readelf -r file</code></td><td>查看重定位表</td></tr>
<tr><td>objdump</td><td><code>objdump -d file</code></td><td>反汇编</td></tr>
<tr><td>objdump</td><td><code>objdump -h file</code></td><td>查看 Section 头</td></tr>
<tr><td>nm</td><td><code>nm file</code></td><td>列出符号</td></tr>
<tr><td>ldd</td><td><code>ldd file</code></td><td>查看动态依赖</td></tr>
<tr><td>strip</td><td><code>strip file</code></td><td>移除符号和调试信息</td></tr>
<tr><td>file</td><td><code>file elf</code></td><td>识别文件类型和架构</td></tr>
<tr><td>strings</td><td><code>strings file</code></td><td>提取可打印字符串</td></tr>
<tr><td>hexedit</td><td><code>hexedit file</code></td><td>十六进制编辑</td></tr></table>

<p>调试时配合 GDB：</p>
<pre><code># 查看 ELF 加载的内存映射
info proc mappings
# 或
cat /proc/&lt;pid&gt;/maps

# 查看 GOT 表内容
x/3gx &amp;_GLOBAL_OFFSET_TABLE_

# 查看 PLT 表
disassemble 'puts@plt'

# 查看加载的共享库
info sharedlibrary</code></pre>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
