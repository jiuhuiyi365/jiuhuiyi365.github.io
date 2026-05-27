---
title: "PE 文件格式详解：Windows 可执行文件的底层结构"
date: 2026-05-27
categories: "安全与逆向"
tags: ["PE","Windows","逆向","二进制"]
id: "pe-format"
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

<div class="hero"><h1>PE 文件格式详解：Windows 可执行文件的底层结构</h1>
<p class="subtitle">从 DOS Header 到 Section Table，全面理解 PE 格式的设计与实现</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">PE</span><span class="tag">Windows</span><span class="tag">二进制</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. PE 概述</a></li>
<li><a href="#s2">2. 文件整体布局</a></li>
<li><a href="#s3">3. DOS Header 与 DOS Stub</a></li>
<li><a href="#s4">4. PE Signature 与 COFF Header</a></li>
<li><a href="#s5">5. Optional Header</a></li>
<li><a href="#s6">6. Section Table（节表）</a></li>
<li><a href="#s7">7. 核心数据目录</a></li>
<li><a href="#s8">8. 导入表与 IAT</a></li>
<li><a href="#s9">9. 导出表</a></li>
<li><a href="#s10">10. 重定位表</a></li>
<li><a href="#s11">11. 加载与执行流程</a></li>
<li><a href="#s12">12. 实用分析工具</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. PE 概述</h2>
<p>PE（Portable Executable）是 Windows 平台的可执行文件格式，用于 EXE、DLL、SYS（驱动）、OCX、CPL 等文件。它基于 COFF 格式发展而来，保留了 DOS 兼容性。</p>

<p>PE 文件类型：</p>
<table><tr><th>扩展名</th><th>类型</th><th>说明</th></tr>
<tr><td><code>.exe</code></td><td>IMAGE_FILE_EXECUTABLE_IMAGE</td><td>可执行文件</td></tr>
<tr><td><code>.dll</code></td><td>IMAGE_FILE_DLL</td><td>动态链接库</td></tr>
<tr><td><code>.sys</code></td><td>IMAGE_FILE_EXECUTABLE_IMAGE</td><td>驱动程序（内核模式）</td></tr>
<tr><td><code>.efi</code></td><td>IMAGE_FILE_EXECUTABLE_IMAGE</td><td>UEFI 固件程序</td></tr></table>

<h2 id="s2">2. 文件整体布局</h2>

<pre><code>┌──────────────────────────────┐  偏移 0x00
│        DOS Header            │  64 字节（MZ 签名）
├──────────────────────────────┤
│        DOS Stub              │  "This program cannot be run
│                              │   in DOS mode"
├──────────────────────────────┤  e_lfanew 指向此处
│      PE Signature            │  4 字节 "PE\0\0" (50 45 00 00)
├──────────────────────────────┤
│      COFF Header             │  20 字节
├──────────────────────────────┤
│      Optional Header         │  240 字节（PE32+）或 224 字节（PE32）
│  ├── Standard Fields         │
│  └── Windows-Specific Fields │
├──────────────────────────────┤
│   Data Directories           │  16 个条目（128 字节）
├──────────────────────────────┤
│   Section Table              │  每个 Section 40 字节
├──────────────────────────────┤
│                              │
│   .text   (代码)             │
│   .rdata  (只读数据)         │
│   .data   (可读写数据)       │
│   .rsrc   (资源)             │
│   .reloc  (重定位)           │
│   ...                        │
│                              │
└──────────────────────────────┘</code></pre>

<h2 id="s3">3. DOS Header 与 DOS Stub</h2>
<p>DOS Header 是 PE 文件的历史遗留，前 2 字节固定为 <code>MZ</code>（Mark Zbikowski，DOS 开发者的名字缩写）。</p>

<pre><code>typedef struct _IMAGE_DOS_HEADER {
    WORD  e_magic;     // "MZ" = 0x5A4D
    // ... 保留字段 ...
    LONG  e_lfanew;    // PE Signature 的文件偏移（最重要的字段！）
} IMAGE_DOS_HEADER;</code></pre>

<p><code>e_lfanew</code>（位于偏移 0x3C）是整个 DOS Header 中唯一还被使用的字段，它指向 PE Signature 的位置。</p>

<p>DOS Stub 紧跟在 DOS Header 后面，默认会输出 "This program cannot be run in DOS mode."。它的大小不固定，实际分析中可以忽略。</p>

<h2 id="s4">4. PE Signature 与 COFF Header</h2>
<p>PE Signature 是 4 字节的标识 <code>50 45 00 00</code>（"PE\0\0"），用于验证这是一个合法的 PE 文件。</p>

<p>COFF Header 紧跟在 PE Signature 后面：</p>
<pre><code>typedef struct _IMAGE_FILE_HEADER {
    WORD  Machine;              // 架构：IMAGE_FILE_MACHINE_I386(0x14c),
                                // IMAGE_FILE_MACHINE_AMD64(0x8664)
    WORD  NumberOfSections;     // Section 数量
    DWORD TimeDateStamp;        // 编译时间戳
    DWORD PointerToSymbolTable; // 符号表偏移（调试用）
    DWORD NumberOfSymbols;      // 符号数量
    WORD  SizeOfOptionalHeader; // Optional Header 大小
    WORD  Characteristics;      // 文件属性标志
} IMAGE_FILE_HEADER;</code></pre>

<p><strong>Characteristics 标志：</strong></p>
<table><tr><th>标志</th><th>值</th><th>含义</th></tr>
<tr><td>IMAGE_FILE_EXECUTABLE_IMAGE</td><td>0x0002</td><td>可执行文件</td></tr>
<tr><td>IMAGE_FILE_DLL</td><td>0x2000</td><td>DLL 文件</td></tr>
<tr><td>IMAGE_FILE_SYSTEM</td><td>0x1000</td><td>系统文件（驱动）</td></tr>
<tr><td>IMAGE_FILE_LARGE_ADDRESS_AWARE</td><td>0x0020</td><td>支持大于 2GB 地址空间</td></tr>
<tr><td>IMAGE_FILE_32BIT_MACHINE</td><td>0x0100</td><td>32 位机器</td></tr>
<tr><td>IMAGE_FILE_DEBUG_STRIPPED</td><td>0x0200</td><td>调试信息已移除</td></tr></table>

<h2 id="s5">5. Optional Header</h2>
<p>虽然叫 "Optional"，但对于可执行文件来说是<strong>必须的</strong>。它包含加载器所需的关键信息。</p>

<pre><code>// PE32+（64位）
typedef struct _IMAGE_OPTIONAL_HEADER64 {
    // Standard Fields
    WORD  Magic;                // 0x20b = PE32+, 0x10b = PE32
    BYTE  MajorLinkerVersion;
    BYTE  MinorLinkerVersion;
    DWORD SizeOfCode;
    DWORD SizeOfInitializedData;
    DWORD SizeOfUninitializedData;
    DWORD AddressOfEntryPoint;  // 入口点 RVA
    DWORD BaseOfCode;

    // Windows-Specific Fields
    ULONGLONG ImageBase;        // 首选基址
    DWORD SectionAlignment;     // 内存对齐（通常 0x1000）
    DWORD FileAlignment;        // 文件对齐（通常 0x200）
    WORD  MajorOperatingSystemVersion;
    WORD  MinorOperatingSystemVersion;
    WORD  MajorImageVersion;
    WORD  MinorImageVersion;
    WORD  MajorSubsystemVersion;
    WORD  MinorSubsystemVersion;
    DWORD Win32VersionValue;
    DWORD SizeOfImage;          // 内存中 PE 镜像总大小
    DWORD SizeOfHeaders;        // 所有 Header 的总大小
    DWORD CheckSum;
    WORD  Subsystem;            // 子系统：1=控制台, 2=GUI
    WORD  DllCharacteristics;
    ULONGLONG SizeOfStackReserve;
    ULONGLONG SizeOfStackCommit;
    ULONGLONG SizeOfHeapReserve;
    ULONGLONG SizeOfHeapCommit;
    DWORD LoaderFlags;
    DWORD NumberOfRvaAndSizes;  // 数据目录数量（通常 16）
    IMAGE_DATA_DIRECTORY DataDirectory[16]; // 数据目录
} IMAGE_OPTIONAL_HEADER64;</code></pre>

<p><strong>关键字段：</strong></p>
<ul>
<li><code>AddressOfEntryPoint</code>：入口点的 RVA（相对虚拟地址），程序从这里开始执行</li>
<li><code>ImageBase</code>：PE 文件的首选加载基址。64 位 EXE 通常是 <code>0x140000000</code>，DLL 通常是 <code>0x180000000</code></li>
<li><code>SectionAlignment</code>：内存中节的对齐粒度</li>
<li><code>FileAlignment</code>：文件中节的对齐粒度</li>
<li><code>Subsystem</code>：<code>IMAGE_SUBSYSTEM_WINDOWS_CUI(3)</code> = 控制台程序，<code>IMAGE_SUBSYSTEM_WINDOWS_GUI(2)</code> = 窗口程序</li>
</ul>

<p><strong>Data Directories（16 个）：</strong></p>
<table><tr><th>索引</th><th>名称</th><th>说明</th></tr>
<tr><td>0</td><td>Export Directory</td><td>导出函数表</td></tr>
<tr><td>1</td><td>Import Directory</td><td>导入函数表</td></tr>
<tr><td>2</td><td>Resource Directory</td><td>资源表（图标、对话框等）</td></tr>
<tr><td>3</td><td>Exception Directory</td><td>异常处理表（x64 结构化异常）</td></tr>
<tr><td>4</td><td>Security Directory</td><td>数字签名</td></tr>
<tr><td>5</td><td>Base Relocation Table</td><td>基址重定位表</td></tr>
<tr><td>6</td><td>Debug Directory</td><td>调试信息</td></tr>
<tr><td>7</td><td>Architecture</td><td>保留</td></tr>
<tr><td>8</td><td>Global Ptr</td><td>全局指针（RISC）</td></tr>
<tr><td>9</td><td>TLS Directory</td><td>线程局部存储</td></tr>
<tr><td>10</td><td>Load Config Directory</td><td>加载配置（SEH、CFG、GFID）</td></tr>
<tr><td>11</td><td>Bound Import</td><td>绑定导入</td></tr>
<tr><td>12</td><td>IAT</td><td>导入地址表</td></tr>
<tr><td>13</td><td>Delay Import Descriptor</td><td>延迟导入</td></tr>
<tr><td>14</td><td>CLR Runtime Header</td><td>.NET 元数据</td></tr>
<tr><td>15</td><td>Reserved</td><td>保留</td></tr></table>

<h2 id="s6">6. Section Table（节表）</h2>
<p>Section Table 紧跟在 Optional Header 后面，每个条目 40 字节，描述一个节的属性。</p>

<pre><code>typedef struct _IMAGE_SECTION_HEADER {
    BYTE  Name[8];              // 节名（如 ".text"）
    union {
        DWORD PhysicalAddress;
        DWORD VirtualSize;      // 内存中实际大小
    } Misc;
    DWORD VirtualAddress;       // 内存中的 RVA
    DWORD SizeOfRawData;        // 文件中对齐后的大小
    DWORD PointerToRawData;     // 文件中的偏移
    DWORD PointerToRelocations;
    DWORD PointerToLinenumbers;
    WORD  NumberOfRelocations;
    WORD  NumberOfLinenumbers;
    DWORD Characteristics;      // 节属性标志
} IMAGE_SECTION_HEADER;</code></pre>

<p><strong>常见节及其作用：</strong></p>
<table><tr><th>节名</th><th>内容</th><th>属性</th></tr>
<tr><td><code>.text</code></td><td>机器代码</td><td>可执行、可读</td></tr>
<tr><td><code>.rdata</code></td><td>只读数据（常量、导入表、导出表）</td><td>可读</td></tr>
<tr><td><code>.data</code></td><td>已初始化的全局变量</td><td>可读、可写</td></tr>
<tr><td><code>.bss</code></td><td>未初始化的全局变量</td><td>可读、可写</td></tr>
<tr><td><code>.rsrc</code></td><td>资源（图标、菜单、版本信息）</td><td>可读</td></tr>
<tr><td><code>.reloc</code></td><td>基址重定位信息</td><td>可读</td></tr>
<tr><td><code>.edata</code></td><td>导出表</td><td>可读</td></tr>
<tr><td><code>.idata</code></td><td>导入表</td><td>可读</td></tr>
<tr><td><code>.tls</code></td><td>线程局部存储</td><td>可读、可写</td></tr>
<tr><td><code>.debug</code></td><td>调试信息</td><td>可读</td></tr>
<tr><td><code>.pdata</code></td><td>异常处理信息（x64）</td><td>可读</td></tr>
<tr><td><code>.gfids</code></td><td>Control Flow Guard 表</td><td>可读</td></tr></table>

<p><strong>Characteristics 标志：</strong></p>
<table><tr><th>标志</th><th>值</th><th>含义</th></tr>
<tr><td>IMAGE_SCN_CNT_CODE</td><td>0x00000020</td><td>包含代码</td></tr>
<tr><td>IMAGE_SCN_CNT_INITIALIZED_DATA</td><td>0x00000040</td><td>包含已初始化数据</td></tr>
<tr><td>IMAGE_SCN_CNT_UNINITIALIZED_DATA</td><td>0x00000080</td><td>包含未初始化数据</td></tr>
<tr><td>IMAGE_SCN_MEM_EXECUTE</td><td>0x20000000</td><td>可执行</td></tr>
<tr><td>IMAGE_SCN_MEM_READ</td><td>0x40000000</td><td>可读</td></tr>
<tr><td>IMAGE_SCN_MEM_WRITE</td><td>0x80000000</td><td>可写</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>PE 中没有像 ELF 那样的 "段（Segment）" 概念。PE 的 Section 直接对应 ELF 的 Section。PE 的加载由 Windows PE Loader 直接按 Section Table 映射，不需要 Program Header Table 那样的中间层。</div>

<h2 id="s7">7. 核心数据目录</h2>

<h3 id="s8">导入表与 IAT</h3>
<p>导入表是 PE 最重要的数据结构之一，定义了程序依赖哪些外部 DLL 和函数。</p>

<pre><code>// 导入描述符（每个被导入的 DLL 一个）
typedef struct _IMAGE_IMPORT_DESCRIPTOR {
    union {
        DWORD Characteristics;
        DWORD OriginalFirstThunk; // INT（Import Name Table）的 RVA
    };
    DWORD TimeDateStamp;
    DWORD ForwarderChain;
    DWORD Name;                   // DLL 名称的 RVA
    DWORD FirstThunk;             // IAT 的 RVA
} IMAGE_IMPORT_DESCRIPTOR;</code></pre>

<p><strong>INT vs IAT：</strong></p>
<ul>
<li><strong>INT（Import Name Table）</strong>：存储函数名/序号的查找表，加载后不修改</li>
<li><strong>IAT（Import Address Table）</strong>：存储实际函数地址的表，加载器填充真实地址</li>
</ul>
<p>加载前 INT 和 IAT 的内容相同，加载后 IAT 被填充为实际地址。</p>

<pre><code>加载前：
INT[0] → IMAGE_IMPORT_BY_NAME("MessageBoxA")
IAT[0] → IMAGE_IMPORT_BY_NAME("MessageBoxA")  // 相同

加载后：
INT[0] → IMAGE_IMPORT_BY_NAME("MessageBoxA")   // 不变
IAT[0] → 0x00007FFA12345678                    // MessageBoxA 的真实地址</code></pre>

<p>每个函数的查找方式：</p>
<pre><code>// IMAGE_IMPORT_BY_NAME
typedef struct _IMAGE_IMPORT_BY_NAME {
    WORD  Hint;     // 导出表中的猜测索引（加速查找）
    BYTE  Name[];   // 函数名字符串
} IMAGE_IMPORT_BY_NAME;

// 或者通过序号导入（高位为1时）
// 值 = 0x80000000 | Ordinal</code></pre>

<h3 id="s9">导出表</h3>
<p>导出表定义了 DLL 向外暴露的函数，供其他程序调用。</p>

<pre><code>typedef struct _IMAGE_EXPORT_DIRECTORY {
    DWORD Characteristics;
    DWORD TimeDateStamp;
    WORD  MajorVersion;
    WORD  MinorVersion;
    DWORD Name;                 // DLL 名称 RVA
    DWORD Base;                 // 导出序号的基数（通常为 1）
    DWORD NumberOfFunctions;    // 导出函数总数
    DWORD NumberOfNames;        // 按名称导出的数量
    DWORD AddressOfFunctions;   // 函数地址表 RVA
    DWORD AddressOfNames;       // 函数名称表 RVA
    DWORD AddressOfNameOrdinals;// 名称序号映射表 RVA
} IMAGE_EXPORT_DIRECTORY;</code></pre>

<p>查找导出函数的流程：</p>
<ol>
<li>按名称：在 AddressOfNames 中二分查找函数名 → 得到索引 → 在 AddressOfNameOrdinals 中查序号 → 在 AddressOfFunctions 中取地址</li>
<li>按序号：序号 - Base = AddressOfFunctions 的索引 → 直接取地址</li>
</ol>

<h3 id="s10">重定位表</h3>
<p>当 PE 无法加载到首选基址（ImageBase）时，需要修正所有绝对地址引用。重定位表就是做这个的。</p>

<pre><code>// 重定位块（按 4KB 页组织）
typedef struct _IMAGE_BASE_RELOCATION {
    DWORD VirtualAddress;   // 需要重定位的页 RVA
    DWORD SizeOfBlock;      // 此块的总大小
    // WORD TypeOffset[];   // 紧跟其后的重定位项数组
} IMAGE_BASE_RELOCATION;

// 每个重定位项：高 4 位 = 类型，低 12 位 = 页内偏移
// 类型：
// IMAGE_REL_BASED_ABSOLUTE (0)  — 填充项，无实际作用
// IMAGE_REL_BASED_HIGHLOW (3)   — 32 位重定位（PE32）
// IMAGE_REL_BASED_DIR64 (10)    — 64 位重定位（PE32+）</code></pre>

<p>重定位的计算：真实基址 - 首选基址 = Delta。将 Delta 加到每个需要重定位的地址上。</p>

<div class="warn-box"><div class="warn-label">WARN</div>EXE 文件通常有固定的 ImageBase（如 <code>0x140000000</code>），ASLR 开启时基址会随机化。DLL 的 ImageBase 只是建议值，ASLR 下会被随机分配到其他地址，所以 DLL 必须包含重定位表。</div>

<h2 id="s11">11. 加载与执行流程</h2>

<pre><code>1. 用户双击 EXE 或调用 CreateProcess
        │
2. Windows PE Loader (NtCreateSection + NtMapViewOfSection)
   ├── 验证 MZ 签名 → PE 签名
   ├── 检查 Machine 类型（x86/x64）
   ├── 检查 Subsystem（GUI/CUI）
   ├── 映射文件到内存（按 Section Table）
   │   ├── .text  → 可读可执行
   │   ├── .rdata → 只读
   │   ├── .data  → 可读可写
   │   └── .rsrc  → 只读
   ├── 加载依赖的 DLL
   │   ├── 读取 Import Directory
   │   ├── 递归加载每个 DLL
   │   └── 填充 IAT（Import Address Table）
   ├── 应用重定位（如果基址不对）
   ├── 设置 TLS 回调
   ├── 设置安全 cookie（/GS 保护）
   ├── 执行 DLL 的 DllMain（DLL_PROCESS_ATTACH）
   └── 跳转到 AddressOfEntryPoint
        │
3. CRT 入口（mainCRTStartup / wmainCRTStartup）
   ├── 初始化堆
   ├── 初始化 C 运行时
   ├── 获取命令行参数
   └── 调用 main() / wmain()
        │
4. 程序正常运行</code></pre>

<p><strong>DLL 加载顺序：</strong></p>
<ol>
<li>应用程序所在目录</li>
<li>系统目录（System32）</li>
<li>16 位系统目录（System）</li>
<li>Windows 目录</li>
<li>当前目录</li>
<li>PATH 环境变量中的目录</li>
</ol>

<h2 id="s12">12. 实用分析工具</h2>

<table><tr><th>工具</th><th>功能</th><th>命令/用法</th></tr>
<tr><td>PE-bear</td><td>可视化 PE 结构分析</td><td>GUI 工具，拖入文件即可</td></tr>
<tr><td>PEiD</td><td>PE 特征识别（加壳检测）</td><td>GUI 工具</td></tr>
<tr><td>CFF Explorer</td><td>PE 编辑器</td><td>GUI 工具，可修改 Header</td></tr>
<tr><td>dumpbin</td><td>MSVC 自带 PE 分析</td><td><code>dumpbin /headers file.exe</code></td></tr>
<tr><td>objdump</td><td>MinGW 反汇编</td><td><code>objdump -x file.exe</code></td></tr>
<tr><td>Dependency Walker</td><td>查看 DLL 依赖</td><td>GUI 工具（已过时，推荐 dumpbin）</td></tr>
<tr><td>x64dbg</td><td>动态调试 PE</td><td>拖入文件调试</td></tr>
<tr><td>Scylla</td><td>IAT 重建和 Dump</td><td>x64dbg 插件或独立工具</td></tr></table>

<pre><code># dumpbin 常用命令
dumpbin /headers file.exe      # 查看所有 Header
dumpbin /imports file.exe      # 查看导入表
dumpbin /exports file.dll      # 查看导出表
dumpbin /relocations file.exe  # 查看重定位表
dumpbin /sections file.exe     # 查看节表
dumpbin /disasm file.exe       # 反汇编代码段</code></pre>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
