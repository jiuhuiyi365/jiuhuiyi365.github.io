---
title: "ELF vs PE：两大可执行文件格式的深度对比"
date: 2026-05-27
categories: "安全与逆向"
tags: ["ELF","PE","二进制","逆向"]
id: "elf-vs-pe"
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

<div class="hero"><h1>ELF vs PE：两大可执行文件格式的深度对比</h1>
<p class="subtitle">Linux ELF 与 Windows PE 的设计理念、结构差异与逆向视角</p>
<div class="hero-meta"><span class="tag tag-accent">安全与逆向</span><span class="tag">ELF</span><span class="tag">PE</span><span class="tag">二进制</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 为什么需要对比</a></li>
<li><a href="#s2">2. 总览对比表</a></li>
<li><a href="#s3">3. 文件头结构对比</a></li>
<li><a href="#s4">4. 内存映射对比</a></li>
<li><a href="#s5">5. 动态链接机制对比</a></li>
<li><a href="#s6">6. 符号与导出对比</a></li>
<li><a href="#s7">7. 重定位机制对比</a></li>
<li><a href="#s8">8. 安全机制对比</a></li>
<li><a href="#s9">9. 调用约定对比</a></li>
<li><a href="#s10">10. 工具链对比</a></li>
<li><a href="#s11">11. 逆向分析视角总结</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 为什么需要对比</h2>
<p>理解两种格式的异同，有助于：</p>
<ul>
<li>从一个平台的逆向经验快速迁移到另一个平台</li>
<li>理解跨平台程序（如 Chromium、Firefox）在不同系统上的行为差异</li>
<li>编写跨平台安全工具时的设计参考</li>
<li>理解漏洞利用技术在两个平台上的不同实现方式</li>
</ul>

<h2 id="s2">2. 总览对比表</h2>

<table><tr><th>维度</th><th>ELF（Linux）</th><th>PE（Windows）</th></tr>
<tr><td>设计来源</td><td>Unix System V</td><td>COFF + DOS 遗留</td></tr>
<tr><td>文件签名</td><td>0x7f 'E' 'L' 'F'</td><td>'M' 'Z' + 'P' 'E' 签名</td></tr>
<tr><td>位数标识</td><td>e_ident[4]（1=32, 2=64）</td><td>Magic（0x10b=PE32, 0x20b=PE32+）</td></tr>
<tr><td>字节序</td><td>可配置（e_ident[5]）</td><td>固定小端序</td></tr>
<tr><td>文件类型</td><td>可重定位/可执行/共享库/核心转储</td><td>EXE/DLL/SYS</td></tr>
<tr><td>代码节</td><td><code>.text</code></td><td><code>.text</code></td></tr>
<tr><td>数据节</td><td><code>.data</code> / <code>.rodata</code> / <code>.bss</code></td><td><code>.data</code> / <code>.rdata</code> / <code>.bss</code></td></tr>
<tr><td>动态链接</td><td>PLT/GOT + ld.so</td><td>IAT + PE Loader</td></tr>
<tr><td>重定位</td><td>REL/RELA 节</td><td>.reloc 节</td></tr>
<tr><td>符号信息</td><td>.symtab / .dynsym</td><td>PDB 外部文件 + 导入/导出表</td></tr>
<tr><td>资源</td><td>不支持（用外部文件）</td><td>.rsrc 节（图标、对话框、版本信息）</td></tr>
<tr><td>调试信息</td><td>.debug 节（DWARF）</td><td>PDB 外部文件</td></tr>
<tr><td>数字签名</td><td>不原生支持</td><td>Security Directory（Authenticode）</td></tr>
<tr><td>历史兼容</td><td>无</td><td>DOS Header + DOS Stub</td></tr></table>

<h2 id="s3">3. 文件头结构对比</h2>

<table><tr><th>项目</th><th>ELF</th><th>PE</th></tr>
<tr><td>总头大小</td><td>固定 64 字节（64位）</td><td>不固定（DOS Header 64 + PE Sig 4 + COFF 20 + Optional + DataDir）</td></tr>
<tr><td>魔数位置</td><td>文件开头</td><td>DOS Header 开头为 MZ，PE Signature 在 e_lfanew 指向的位置</td></tr>
<tr><td>入口点</td><td>e_entry</td><td>Optional Header.AddressOfEntryPoint</td></tr>
<tr><td>Section 信息</td><td>Section Header Table（文件末尾）</td><td>Section Table（紧跟 Optional Header）</td></tr>
<tr><td>Segment 信息</td><td>Program Header Table</td><td>无（PE 不区分 Segment/Section）</td></tr>
<tr><td>数据目录</td><td>分散在各 Section 中</td><td>集中定义在 Optional Header 的 DataDirectory[16]</td></tr>
<tr><td>DOS 兼容</td><td>无</td><td>DOS Header + DOS Stub 保留</td></tr></table>

<p><strong>设计理念差异：</strong></p>
<p>ELF 的设计更简洁——一个 ELF Header + 两组表（Program Header Table + Section Header Table）就描述了所有信息。PE 的设计更复杂，因为要兼容 DOS 和 COFF 历史，文件头由多层结构嵌套组成。</p>

<p>ELF 的两层视图（链接视图 + 执行视图）是其独特设计。PE 没有这种区分，Section Table 同时服务于链接和加载两个目的。</p>

<h2 id="s4">4. 内存映射对比</h2>

<table><tr><th>概念</th><th>ELF</th><th>PE</th></tr>
<tr><td>映射单位</td><td>Segment（PT_LOAD）</td><td>Section（由 PE Loader 按属性合并）</td></tr>
<tr><td>映射粒度</td><td>可包含多个 Section</td><td>按 Section 单独映射（或合并属性相同的）</td></tr>
<tr><td>对齐方式</td><td>Program Header 指定</td><td>Section Table 指定</td></tr>
<tr><td>默认基址（64位 EXE）</td><td>0x400000</td><td>0x140000000</td></tr>
<tr><td>默认基址（64位 SO/DLL）</td><td>0x0（PIE）</td><td>0x180000000</td></tr>
<tr><td>栈执行标志</td><td>PT_GNU_STACK 段</td><td>Section Header 的 Characteristics</td></tr>
<tr><td>PIE/ASLR</td><td>ET_DYN + 无固定基址</td><td>DllCharacteristics.IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>ELF 中 PT_LOAD 段可以包含多个 Section（比如一个段包含 .text 和 .rodata）。PE 中每个 Section 独立映射，但 PE Loader 可能合并属性相同的 Section。这是两者在内存布局上最重要的区别。</div>

<h2 id="s5">5. 动态链接机制对比</h2>

<table><tr><th>机制</th><th>ELF</th><th>PE</th></tr>
<tr><td>延迟绑定</td><td>PLT + GOT（Lazy Binding）</td><td>IAT + PE Loader（非延迟，启动时全部解析）</td></tr>
<tr><td>延迟加载</td><td>不原生支持</td><td>Delay Import Directory</td></tr>
<tr><td>动态链接器</td><td>ld.so（/lib64/ld-linux-x86-64.so.2）</td><td>ntdll.dll（NtMapViewOfSection）</td></tr>
<tr><td>符号解析</td><td>哈希表（DT_HASH / DT_GNU_HASH）</td><td>按名称查找（Hint + Name 优化）</td></tr>
<tr><td>库搜索路径</td><td>DT_RPATH / DT_RUNPATH / LD_LIBRARY_PATH</td><td>LoadLibrary 搜索顺序</td></tr>
<tr><td>符号可见性</td><td>STV_DEFAULT / STV_HIDDEN / STV_PROTECTED</td><td>__declspec(dllexport) / .def 文件</td></tr>
<tr><td>弱符号</td><td>STB_WEAK 支持</td><td>不支持（有 __declspec(selectany) 类似）</td></tr></table>

<p><strong>Lazy Binding vs Eager Binding：</strong></p>
<p>ELF 的 PLT/GOT 机制支持延迟绑定——函数在首次调用时才被解析。PE 默认在加载时就解析所有导入函数地址（Eager Binding），但支持 Delay Import Directory 实现类似效果。</p>

<pre><code>// ELF 延迟绑定流程
call printf@plt → jmp *GOT[printf] → 首次：ld.so 解析
                                    → 非首次：直接跳转

// PE 加载时绑定
NtCreateSection → 遍历 Import Directory
               → LoadLibrary 每个 DLL
               → GetProcAddress 填充每个 IAT 条目
               → 全部完成后跳转入口点</code></pre>

<p>PE 的加载时间更长（因为要解析所有导入），但运行时调用开销更小（不需要经过 PLT 跳板）。ELF 的启动更快（延迟绑定），但首次调用有额外开销。</p>

<h2 id="s6">6. 符号与导出对比</h2>

<table><tr><th>维度</th><th>ELF</th><th>PE</th></tr>
<tr><td>符号表位置</td><td>.symtab / .dynsym 节（文件内）</td><td>导出表/导入表（文件内）+ PDB（外部）</td></tr>
<tr><td>导出函数</td><td>全局符号 + .dynamic</td><td>Export Directory（edata）</td></tr>
<tr><td>导入函数</td><td>未定义符号 + DT_NEEDED</td><td>Import Directory（idata）</td></tr>
<tr><td>查找方式</td><td>哈希表（DT_GNU_HASH，O(log n)）</td><td>Hint 优化的名称查找（O(n)）</td></tr>
<tr><td>按序号导出</td><td>不支持</td><td>支持（Base + Ordinal）</td></tr>
<tr><td>符号装饰</td><td>无</td><td>C++ 名称修饰（Name Mangling）</td></tr>
<tr><td>调试符号</td><td>DWARF 格式（.debug_* 节）</td><td>PDB 格式（外部 .pdb 文件）</td></tr></table>

<p>ELF 把完整的符号表（包括局部变量、静态函数）放在 <code>.symtab</code> 中，调试信息也嵌在文件里。PE 则把详细符号信息（类型、行号、局部变量）放在外部的 PDB 文件中，文件本身只保留导出/导入表中的外部符号。</p>

<p>这意味着 ELF 文件的逆向信息更丰富（strip 之前），而 PE 文件的逆向高度依赖是否拥有 PDB 文件。</p>

<h2 id="s7">7. 重定位机制对比</h2>

<table><tr><th>维度</th><th>ELF</th><th>PE</th></tr>
<tr><td>重定位类型</td><td>R_X86_64_64, PC32, GLOB_DAT, JUMP_SLOT, RELATIVE 等</td><td>IMAGE_REL_BASED_ABSOLUTE, HIGHLOW, DIR64</td></tr>
<tr><td>粒度</td><td>按重定位类型区分不同计算方式</td><td>按页组织，只有绝对地址修正</td></tr>
<tr><td>时机</td><td>链接时（静态）+ 加载时（动态）</td><td>仅加载时（ASLR 命中时）</td></tr>
<tr><td>是否必须</td><td>PIE 程序必须</td><td>DLL 必须，EXE 可选</td></tr></table>

<p>ELF 的重定位更复杂但也更灵活，支持多种重定位类型（地址计算、GOT 填充、PLT 解析等）。PE 的重定位相对简单——只处理绝对地址引用，将 Delta（实际基址 - 首选基址）加到需要修正的位置上。</p>

<h2 id="s8">8. 安全机制对比</h2>

<table><tr><th>安全特性</th><th>ELF</th><th>PE</th></tr>
<tr><td>栈不可执行（NX）</td><td>PT_GNU_STACK（无此段则栈可执行）</td><td>NX_COMPAT 标志（DEP）</td></tr>
<tr><td>地址空间随机化</td><td>PIE（位置无关可执行文件）</td><td>ASLR（IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE）</td></tr>
<tr><td>栈保护</td><td>-fstack-protector（canary 在 TLS）</td><td>/GS（canary 在 TLS + Load Config）</td></tr>
<tr><td>控制流保护</td><td>-fcf-protection（CET）</td><td>CFG / XFG（Guard CF 表在 .gfids 节）</td></tr>
<tr><td>代码完整性</td><td>不原生支持</td><td>Authenticode 数字签名</td></tr>
<tr><td>RELRO</td><td>Partial RELRO / Full RELRO</td><td>无对应机制</td></tr>
<tr><td>FORTIFY_SOURCE</td><td>编译时替换危险函数</td><td>/GS + __security_check_cookie</td></tr></table>

<div class="tip-box"><div class="tip-label">TIP</div>ELF 的 RELRO（Read-Only Relocation）是一个独特的安全机制：Partial RELRO 将 .got 设为只读（加载后），Full RELRO 还会让 .got.plt 也被解析后设为只读，完全消除 GOT 覆盖攻击的可能。PE 没有类似机制。</div>

<h2 id="s9">9. 调用约定对比</h2>
<p>调用约定决定了函数参数如何传递、栈由谁清理，这直接影响逆向分析时的参数识别。</p>

<table><tr><th>维度</th><th>Linux x64（ELF）</th><th>Windows x64（PE）</th></tr>
<tr><td>调用约定</td><td>System V AMD64 ABI</td><td>Microsoft x64</td></tr>
<tr><td>前4个整型参数</td><td>RDI, RSI, RDX, RCX, R8, R9（6个）</td><td>RCX, RDX, R8, R9（4个）</td></tr>
<tr><td>前4个浮点参数</td><td>XMM0-7（8个）</td><td>XMM0-3（4个）</td></tr>
<tr><td>额外参数</td><td>全部通过栈传递</td><td>全部通过栈传递</td></tr>
<tr><td>返回值</td><td>RAX</td><td>RAX</td></tr>
<tr><td>调用者清理栈</td><td>是</td><td>是</td></tr>
<tr><td>Shadow Space</td><td>无</td><td>调用者分配 32 字节</td></tr>
<tr><td>红区（Red Zone）</td><td>RSP 下 128 字节保留</td><td>无</td></tr>
<tr><td>栈对齐</td><td>调用前 16 字节对齐</td><td>调用前 16 字节对齐</td></tr></table>

<div class="warn-box"><div class="warn-label">WARN</div><strong>Shadow Space</strong> 是 Windows x64 特有的概念：调用者必须在栈上预留 32 字节，供被调用者存放 RCX/RDX/R8/R9 的副本。Linux 没有这个要求。逆向时，Windows 函数的前几条指令经常会把参数保存到这个区域（<code>mov [rsp+8], rcx</code>），在 Linux 上看不到这种代码。</div>

<h2 id="s10">10. 工具链对比</h2>

<table><tr><th>操作</th><th>ELF 工具</th><th>PE 工具</th></tr>
<tr><td>查看头信息</td><td><code>readelf -h</code></td><td>PE-bear / CFF Explorer</td></tr>
<tr><td>查看 Section</td><td><code>readelf -S</code></td><td><code>dumpbin /sections</code></td></tr>
<tr><td>查看符号</td><td><code>readelf -s</code> / <code>nm</code></td><td><code>dumpbin /exports</code> / <code>dumpbin /imports</code></td></tr>
<tr><td>反汇编</td><td><code>objdump -d</code></td><td><code>objdump -d</code> / IDA / Ghidra</td></tr>
<tr><td>查看依赖</td><td><code>ldd</code></td><td><code>dumpbin /dependents</code></td></tr>
<tr><td>动态调试</td><td>GDB / LLDB</td><td>x64dbg / WinDbg</td></tr>
<tr><td>内核调试</td><td>KGDB / QEMU GDB stub</td><td>WinDbg（串口/网络）</td></tr>
<tr><td>崩溃分析</td><td>GDB + core 文件</td><td>WinDbg + DMP 文件</td></tr>
<tr><td>脱壳/修复</td><td>strip / objcopy</td><td>Scylla / OllyDumpEx</td></tr>
<tr><td>资源提取</td><td>不需要（无内嵌资源）</td><td>Resource Hacker / CFF Explorer</td></tr>
<tr><td>签名验证</td><td>不原生支持</td><td><code>signtool verify</code></td></tr></table>

<h2 id="s11">11. 逆向分析视角总结</h2>

<p>从 GDB + ELF 逆向转向 x64dbg + PE 逆向时，需要关注的核心差异：</p>

<ul>
<li><strong>符号信息的获取方式不同</strong>：ELF 内嵌符号表，PE 依赖 PDB。拿到一个没有 PDB 的 PE 文件，你只能看到导出表中的函数名，内部函数全是地址。ELF 即使 strip 了，导出表和 GOT/PLT 的符号名仍然保留。</li>
<li><strong>动态链接分析思路不同</strong>：ELF 关注 PLT/GOT 的延迟绑定行为，PE 关注 IAT 的静态绑定。分析 ELF 需要理解 PLT stub 的跳转逻辑，分析 PE 只需要看 IAT 表被填了什么地址。</li>
<li><strong>调用约定不同</strong>：识别函数参数时，Linux x64 看 RDI/RSI/RDX/RCX，Windows x64 看 RCX/RDX/R8/R9。Shadow Space 的存在让 Windows 函数的 prologue 更长。</li>
<li><strong>安全机制不同</strong>：ELF 的 RELRO 保护 GOT，PE 没有类似保护（但有 CFG 保护间接调用）。漏洞利用时，ELF 可以尝试 GOT 覆盖，PE 则需要找 ROP 链或利用 CFG 绕过。</li>
<li><strong>调试工具不同</strong>：ELF 用 GDB + readelf + objdump，PE 用 x64dbg + PE-bear + dumpbin。思维模式是一样的，只是命令和工具换了。</li>
</ul>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
