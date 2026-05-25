---
title: "STL 核心数据结构源码剖析"
date: 2026-05-25
categories: "STL源码"
tags: ["C++","STL","逆向"]
id: "stl-source"
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

<div class="hero"><h1>STL 核心数据结构源码剖析</h1>
<div class="hero-meta"><span class="tag tag-accent">STL源码</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">迭代器（Iterator）</a></li>
<li><a href="#s2">内存池（Memory Pool / Allocator）</a></li>
<li><a href="#s3">vector — 连续数组</a></li>
<li><a href="#s4">list — 双向链表</a></li>
<li><a href="#s5">deque — 双向队列</a></li>
<li><a href="#s6">红黑树（map / set）</a></li>
<li><a href="#s7">哈希表（unordered_map）</a></li>
<li><a href="#s8">tuple 元组</a></li>
<li><a href="#s9">算法（Algorithm）</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 迭代器（Iterator）</h2>
<p>迭代器的核心设计理念是<strong>屏蔽底层数据结构的物理存储差异</strong>，对外提供统一的前向/后向遍历接口。无论底层是连续数组还是链式结构，迭代器的 <code>operator++</code> / <code>operator--</code> 都能正确推进。</p>

<h3>迭代器分类</h3>
<table><tr><th>迭代器类型</th><th>能力</th><th>代表容器</th></tr>
<tr><td>Input Iterator</td><td>只读，单遍扫描</td><td>istream</td></tr>
<tr><td>Output Iterator</td><td>只写，单遍扫描</td><td>ostream</td></tr>
<tr><td>Forward Iterator</td><td>读写，多遍扫描，单向</td><td>forward_list</td></tr>
<tr><td>Bidirectional Iterator</td><td>可 ++/--，双向</td><td>list, map</td></tr>
<tr><td>Random Access Iterator</td><td>随机访问，支持 +/-/[]</td><td>vector, deque</td></tr></table>

<h3>迭代器失效</h3>
<p>容器内部结构发生变化时，已持有的迭代器可能失效：</p>
<ul>
<li><strong>vector</strong>：<code>push_back</code> 触发 reallocation 后所有迭代器失效；<code>erase</code> 使被删位置及之后的迭代器失效</li>
<li><strong>deque</strong>：首尾插入不会使其他迭代器失效；中间插入使所有迭代器失效</li>
<li><strong>list</strong>：仅被删除节点的迭代器失效，其余不受影响</li>
<li><strong>map/set</strong>：仅被删除节点的迭代器失效</li>
</ul>

<h3>Traits（萃取）机制</h3>
<p>通过模板特化提取迭代器的 <code>value_type</code>、<code>difference_type</code>、<code>iterator_category</code> 等类型信息，使泛型算法能根据迭代器类型选择最优实现：</p>
<pre><code>template &lt;typename Iterator&gt;
struct iterator_traits {
    typedef typename Iterator::value_type        value_type;
    typedef typename Iterator::difference_type   difference_type;
    typedef typename Iterator::iterator_category iterator_category;
    typedef typename Iterator::pointer           pointer;
    typedef typename Iterator::reference         reference;
};

// 原生指针特化
template &lt;typename T&gt;
struct iterator_traits&lt;T*&gt; {
    typedef T                          value_type;
    typedef ptrdiff_t                  difference_type;
    typedef random_access_iterator_tag iterator_category;
};</code></pre>

<h2 id="s2">2. 内存池（Memory Pool / Allocator）</h2>
<p>SGI STL 的二级配置器（<code>__default_alloc_template</code>）是其最经典的设计之一。核心思想是<strong>避免频繁调用 malloc/free</strong>，减少系统调用开销和内存碎片。</p>

<h3>一级配置器 vs 二级配置器</h3>
<table><tr><th>类型</th><th>阈值</th><th>策略</th></tr>
<tr><td>一级配置器</td><td>&gt; 128 字节</td><td>直接调用 <code>malloc</code>/<code>free</code></td></tr>
<tr><td>二级配置器</td><td>≤ 128 字节</td><td>内存池 + 自由链表</td></tr></table>

<h3>自由链表（Free List）</h3>
<p>二级配置器维护 16 条自由链表，分别管理 8, 16, 24, ..., 128 字节的小对象。每条链表是一个 <code>union obj</code> 链表节点：</p>
<pre><code>union obj {
    union obj *free_list_link;  // 指向下一个空闲块
    char client_data[1];        // 用户可见的数据区
};</code></pre>
<p>分配时向上取整到 8 的倍数，从对应链表头部取出节点，O(1) 时间复杂度。回收时将节点插入链表头部，同样是 O(1) 操作。</p>
<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
    <marker id="arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#a78bfa"/></marker>
  </defs>
  <!-- Title -->
  <text x="360" y="24" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">SGI STL 二级配置器：16 条自由链表 + 内存池</text>
  <!-- Free list headers -->
  <g font-size="10" font-family="monospace">
    <rect x="20" y="40" width="48" height="26" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
    <text x="44" y="57" text-anchor="middle" fill="#fff">8 B</text>
    <rect x="76" y="40" width="48" height="26" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
    <text x="100" y="57" text-anchor="middle" fill="#fff">16 B</text>
    <rect x="132" y="40" width="48" height="26" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
    <text x="156" y="57" text-anchor="middle" fill="#fff">24 B</text>
    <text x="204" y="57" fill="#555">⋯</text>
    <rect x="228" y="40" width="48" height="26" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
    <text x="252" y="57" text-anchor="middle" fill="#fff">120 B</text>
    <rect x="284" y="40" width="48" height="26" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
    <text x="308" y="57" text-anchor="middle" fill="#fff">128 B</text>
  </g>
  <!-- Arrows from headers to chains -->
  <line x1="44" y1="66" x2="44" y2="80" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="100" y1="66" x2="100" y2="80" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="156" y1="66" x2="156" y2="80" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="308" y1="66" x2="308" y2="80" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#arrow)"/>
  <!-- Chain for 8B -->
  <rect x="14" y="84" width="60" height="26" rx="4" fill="#151720" stroke="#252837" stroke-width="1"/>
  <text x="44" y="101" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">→ blk_1</text>
  <rect x="80" y="84" width="60" height="26" rx="4" fill="#151720" stroke="#252837" stroke-width="1"/>
  <text x="110" y="101" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">→ blk_2</text>
  <line x1="74" y1="97" x2="80" y2="97" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#arrow)"/>
  <line x1="140" y1="97" x2="152" y2="97" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="160" y="101" fill="#555" font-size="10">→ ∅</text>
  <!-- Chain for 16B -->
  <rect x="70" y="84" width="60" height="26" rx="4" fill="#151720" stroke="#252837" stroke-width="1" opacity="0"/>
  <!-- Chain for 128B -->
  <rect x="278" y="84" width="60" height="26" rx="4" fill="#151720" stroke="#252837" stroke-width="1"/>
  <text x="308" y="101" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">→ blk_1</text>
  <line x1="338" y1="97" x2="350" y2="97" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="358" y="101" fill="#555" font-size="10">→ ∅</text>
  <!-- Memory Pool -->
  <rect x="420" y="46" width="280" height="140" rx="8" fill="#0f1117" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="6,3"/>
  <text x="560" y="68" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="600" font-family="sans-serif">内存池（Memory Pool）</text>
  <!-- Pool blocks -->
  <rect x="440" y="82" width="56" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="468" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">Pool Block</text>
  <rect x="504" y="82" width="56" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="532" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">Pool Block</text>
  <rect x="568" y="82" width="56" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="596" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">Pool Block</text>
  <rect x="632" y="82" width="56" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="660" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">...</text>
  <line x1="468" y1="106" x2="468" y2="118" stroke="#a78bfa" stroke-width="1"/>
  <line x1="532" y1="106" x2="532" y2="118" stroke="#a78bfa" stroke-width="1"/>
  <line x1="596" y1="106" x2="596" y2="118" stroke="#a78bfa" stroke-width="1"/>
  <!-- Pool labels -->
  <text x="560" y="140" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">start_free → 指向池中空闲起始</text>
  <text x="560" y="156" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">end_free → 指向池中空闲结束</text>
  <text x="560" y="172" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">heap_size → 累计 malloc 大小</text>
  <!-- Flow -->
  <text x="420" y="210" fill="#34d399" font-size="11" font-family="sans-serif">分配：free_list 取出 → pool 填充 → malloc 兜底</text>
  <text x="420" y="228" fill="#fbbf24" font-size="11" font-family="sans-serif">回收：free_list 插入头部（LIFO）</text>
</svg>
</div>

<h3>内存池填充流程</h3>
<p>当自由链表为空时，从内存池申请空间：</p>
<ol>
<li>计算需申请的总字节数：<code>bytes × 20 + round_up(heap_size >> 4)</code></li>
<li>调用 <code>malloc</code> 获取大块内存</li>
<li>将第一块返回给用户，其余挂到对应自由链表上</li>
<li>如果 <code>malloc</code> 失败，从更大的自由链表中回收空间</li>
</ol>

<h2 id="s3">3. vector — 连续数组</h2>
<p><code>std::vector</code> 是最基础的序列容器，底层为<strong>连续内存块</strong>，支持 O(1) 随机访问。</p>

<h3>内存布局（逆向视角）</h3>
<pre><code>struct vector {
    T* begin_0x0;       // 首元素指针
    T* end_0x8;         // 尾后指针 (size = end - begin)
    T* cap_end_0x10;    // 容量尾后 (capacity = cap_end - begin)
};
// 64 位系统总大小：0x18 (24 字节)</code></pre>

<h3>扩容机制</h3>
<p>当 <code>size == capacity</code> 时触发扩容：</p>
<ol>
<li>申请 <code>new_capacity = max(2 × old_capacity, 1)</code> 的新空间</li>
<li>将旧数据移动/拷贝到新空间</li>
<li>释放旧空间</li>
</ol>
<pre><code>// 简化的 push_back 逻辑
void push_back(const T&amp; val) {
    if (end_ == cap_end_) {
        size_t old_sz = size();
        size_t new_cap = old_sz == 0 ? 1 : 2 * old_sz;
        T* new_buf = allocator::allocate(new_cap);
        // 使用 move_if_noexcept 迁移已有元素
        for (size_t i = 0; i &lt; old_sz; ++i)
            new (new_buf + i) T(std::move_if_noexcept(*(begin_ + i)));
        // 构造新元素
        new (new_buf + old_sz) T(val);
        // 释放旧空间
        for (size_t i = 0; i &lt; old_sz; ++i) (begin_ + i)->~T();
        allocator::deallocate(begin_, cap_end_ - begin_);
        begin_ = new_buf;
        end_ = new_buf + old_sz + 1;
        cap_end_ = new_buf + new_cap;
    } else {
        new (end_) T(val);
        ++end_;
    }
}</code></pre>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 680 210" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="va" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
  </defs>
  <text x="340" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">std::vector 内存布局（64 位系统，总大小 0x18 = 24 字节）</text>
  <!-- Vector object on stack -->
  <rect x="20" y="40" width="160" height="130" rx="8" fill="#0f1117" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="100" y="60" text-anchor="middle" fill="#6c9eeb" font-size="12" font-weight="600" font-family="sans-serif">vector 对象（栈）</text>
  <rect x="32" y="72" width="136" height="28" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="40" y="90" fill="#80deea" font-size="11" font-family="monospace">begin_0x0</text>
  <text x="160" y="90" text-anchor="end" fill="#fff" font-size="11" font-family="monospace">0x7f2a00</text>
  <rect x="32" y="104" width="136" height="28" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="40" y="122" fill="#80deea" font-size="11" font-family="monospace">end_0x8</text>
  <text x="160" y="122" text-anchor="end" fill="#fff" font-size="11" font-family="monospace">0x7f2a18</text>
  <rect x="32" y="136" width="136" height="28" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="40" y="154" fill="#80deea" font-size="11" font-family="monospace">cap_end_0x10</text>
  <text x="160" y="154" text-anchor="end" fill="#fff" font-size="11" font-family="monospace">0x7f2a30</text>
  <!-- Arrows -->
  <line x1="168" y1="86" x2="250" y2="86" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#va)" stroke-dasharray="6,3"/>
  <line x1="168" y1="118" x2="250" y2="134" stroke="#34d399" stroke-width="1.5" marker-end="url(#va)" stroke-dasharray="6,3"/>
  <line x1="168" y1="150" x2="250" y2="182" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#va)" stroke-dasharray="6,3"/>
  <!-- Heap buffer -->
  <rect x="254" y="56" width="400" height="140" rx="8" fill="#0f1117" stroke="#252837" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="454" y="200" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">堆（Heap）连续内存块</text>
  <!-- Buffer cells -->
  <rect x="264" y="70" width="68" height="36" rx="4" fill="#151720" stroke="#6c9eeb" stroke-width="1"/>
  <text x="298" y="83" text-anchor="middle" fill="#6c9eeb" font-size="10" font-family="monospace">elem[0]</text>
  <text x="298" y="98" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">42</text>
  <rect x="336" y="70" width="68" height="36" rx="4" fill="#151720" stroke="#6c9eeb" stroke-width="1"/>
  <text x="370" y="83" text-anchor="middle" fill="#6c9eeb" font-size="10" font-family="monospace">elem[1]</text>
  <text x="370" y="98" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">17</text>
  <rect x="408" y="70" width="68" height="36" rx="4" fill="#151720" stroke="#6c9eeb" stroke-width="1"/>
  <text x="442" y="83" text-anchor="middle" fill="#6c9eeb" font-size="10" font-family="monospace">elem[2]</text>
  <text x="442" y="98" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">99</text>
  <!-- Unused capacity -->
  <rect x="480" y="70" width="68" height="36" rx="4" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="4,2"/>
  <text x="514" y="92" text-anchor="middle" fill="#555" font-size="10" font-family="monospace">未使用</text>
  <rect x="552" y="70" width="68" height="36" rx="4" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="4,2"/>
  <text x="586" y="92" text-anchor="middle" fill="#555" font-size="10" font-family="monospace">未使用</text>
  <!-- Pointer labels -->
  <line x1="264" y1="62" x2="264" y2="52" stroke="#6c9eeb" stroke-width="1"/>
  <text x="264" y="48" text-anchor="middle" fill="#6c9eeb" font-size="9" font-weight="600">begin</text>
  <line x1="480" y1="62" x2="480" y2="52" stroke="#34d399" stroke-width="1"/>
  <text x="480" y="48" text-anchor="middle" fill="#34d399" font-size="9" font-weight="600">end</text>
  <line x1="620" y1="62" x2="620" y2="52" stroke="#a78bfa" stroke-width="1"/>
  <text x="620" y="48" text-anchor="middle" fill="#a78bfa" font-size="9" font-weight="600">cap_end</text>
  <!-- Size/Capacity labels -->
  <text x="370" y="132" text-anchor="middle" fill="#34d399" font-size="10" font-family="sans-serif">← size=3 →</text>
  <line x1="264" y1="138" x2="480" y2="138" stroke="#34d399" stroke-width="1" marker-end="url(#va)"/>
  <line x1="480" y1="138" x2="264" y2="138" stroke="#34d399" stroke-width="1" marker-end="url(#va)"/>
  <text x="454" y="162" text-anchor="middle" fill="#a78bfa" font-size="10" font-family="sans-serif">← capacity=5 ——→</text>
  <line x1="264" y1="168" x2="620" y2="168" stroke="#a78bfa" stroke-width="1" marker-end="url(#va)"/>
  <line x1="620" y1="168" x2="264" y2="168" stroke="#a78bfa" stroke-width="1" marker-end="url(#va)"/>
</svg>
</div>

<h3>vector&lt;bool&gt; 特化</h3>
<p>采用位压缩存储，每个 bool 占 1 bit。通过代理对象（proxy）实现元素访问：</p>
<pre><code>// 内部使用 unsigned long 数组，每 64 bit 为一组
struct _Bit_reference {
    unsigned long *_M_p;     // 指向所在 word
    unsigned long _M_mask;   // 对应 bit 位的掩码
};</code></pre>

<h2 id="s4">4. list — 双向链表</h2>
<p><code>std::list</code> 是带头节点的<strong>双向循环链表</strong>，任意位置插入/删除为 O(1)，但不支持随机访问。</p>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="la" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
    <marker id="lp" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill="#a78bfa"/></marker>
  </defs>
  <text x="350" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">std::list 双向循环链表（带头节点）</text>
  <!-- list object -->
  <rect x="14" y="40" width="120" height="100" rx="8" fill="#0f1117" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="74" y="60" text-anchor="middle" fill="#6c9eeb" font-size="11" font-weight="600" font-family="sans-serif">list 对象</text>
  <rect x="22" y="68" width="104" height="22" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="74" y="83" text-anchor="middle" fill="#80deea" font-size="10" font-family="monospace">next → head</text>
  <rect x="22" y="94" width="104" height="22" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="74" y="109" text-anchor="middle" fill="#80deea" font-size="10" font-family="monospace">prev → head</text>
  <rect x="22" y="118" width="104" height="22" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="74" y="133" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">size = 3</text>
  <!-- Head node -->
  <rect x="200" y="50" width="90" height="60" rx="6" fill="#1a1530" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="245" y="74" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="600">HEAD</text>
  <text x="245" y="92" text-anchor="middle" fill="#555" font-size="9">(end 指向这里)</text>
  <!-- Node 1 -->
  <rect x="370" y="50" width="100" height="80" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="420" y="68" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">next →</text>
  <text x="420" y="84" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">← prev</text>
  <rect x="380" y="92" width="80" height="26" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="420" y="109" text-anchor="middle" fill="#c9d1d9" font-size="11" font-family="monospace">value=10</text>
  <!-- Node 2 -->
  <rect x="540" y="50" width="100" height="80" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="590" y="68" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">next →</text>
  <text x="590" y="84" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">← prev</text>
  <rect x="550" y="92" width="80" height="26" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="590" y="109" text-anchor="middle" fill="#c9d1d9" font-size="11" font-family="monospace">value=20</text>
  <!-- Arrows: next (blue, clockwise top) -->
  <!-- list -> head -->
  <line x1="134" y1="79" x2="200" y2="70" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#la)"/>
  <!-- head -> node1 -->
  <line x1="290" y1="65" x2="370" y2="65" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#la)"/>
  <!-- node1 -> node2 -->
  <line x1="470" y1="65" x2="540" y2="65" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#la)"/>
  <!-- node2 -> head (circular) -->
  <path d="M590,130 C590,170 370,180 245,170 C160,164 140,140 200,110" fill="none" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#la)" stroke-dasharray="5,3"/>
  <!-- Arrows: prev (purple, clockwise bottom) -->
  <!-- head -> node2 (via bottom) -->
  <path d="M245,110 C245,160 370,185 590,155" fill="none" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#lp)" stroke-dasharray="5,3"/>
  <!-- node2 -> node1 -->
  <line x1="540" y1="84" x2="470" y2="84" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#lp)"/>
  <!-- node1 -> head -->
  <line x1="370" y1="84" x2="290" y2="84" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#lp)"/>
  <!-- begin label -->
  <text x="420" y="160" text-anchor="middle" fill="#34d399" font-size="10" font-weight="600">begin() 指向这里 ↑</text>
  <line x1="420" y1="148" x2="420" y2="130" stroke="#34d399" stroke-width="1" marker-end="url(#la)"/>
  <!-- Legend -->
  <line x1="180" y1="188" x2="220" y2="188" stroke="#6c9eeb" stroke-width="2"/>
  <text x="228" y="192" fill="#6c9eeb" font-size="10" font-family="sans-serif">next（后继）</text>
  <line x1="340" y1="188" x2="380" y2="188" stroke="#a78bfa" stroke-width="2"/>
  <text x="388" y="192" fill="#a78bfa" font-size="10" font-family="sans-serif">prev（前驱）</text>
</svg>
</div>

<h3>内存布局</h3>
<pre><code>struct list {
    listNode *next_node_0x0;   // 头节点（end 迭代器指向此处）
    listNode *prev_node_0x8;
    size_t list_size_0x10;     // 元素个数
};
// begin() 指向 head->next，end() 指向 head

template &lt;typename T&gt;
struct listNode {
    listNode *next_node_0x0;   // 后继
    listNode *prev_node_0x8;   // 前驱
    T value_0x10;              // 数据
};</code></pre>

<h3>splice 操作</h3>
<p>list 的 <code>splice</code> 是 O(1) 的节点搬运，不需要拷贝元素：</p>
<pre><code>// 将 x 中的节点搬到 position 之前
void splice(iterator position, list&amp; x, iterator first, iterator last) {
    if (first != last) {
        // 修改 6 个指针完成节点摘取和插入
        listNode *tmp = position.node-&gt;prev;
        last.node-&gt;prev-&gt;next = position.node;
        position.node-&gt;prev = last.node-&gt;prev;
        first.node-&gt;prev-&gt;next = last.node;
        last.node-&gt;prev = first.node-&gt;prev;
        tmp-&gt;next = first.node;
        first.node-&gt;prev = tmp;
    }
}</code></pre>

<h2 id="s5">5. deque — 双向队列</h2>
<p>采用<strong>中控映射表（map）+ 多段连续缓冲区（buffer）</strong>的分段存储策略，兼具随机访问与高效头尾插入能力。</p>

<h3>内存布局</h3>
<pre><code>struct deque {
    T **map_0x0;                    // 中控指针数组
    size_t map_size_0x8;            // map 的大小
    // --- start 迭代器 (0x10~0x30) ---
    T *start_cur_0x10;             // 当前元素
    T *start_first_0x18;           // 缓冲区首
    T *start_last_0x20;            // 缓冲区尾
    T **start_node_0x28;           // map 中的位置
    // --- finish 迭代器 (0x30~0x50) ---
    T *finish_cur_0x30;
    T *finish_first_0x38;
    T *finish_last_0x40;
    T **finish_node_0x48;
};</code></pre>

<h3>迭代器设计</h3>
<p>deque 的迭代器大小为 0x20（32 字节），包含 4 个指针：当前元素指针、缓冲区首尾地址、map 节点指针。当跨越缓冲区边界时，自动切换到下一个 map 节点：</p>
<pre><code>void set_node(T **new_node) {
    node = new_node;
    first = *new_node;
    last = first + buffer_size;
}</code></pre>

<h3>头尾插入</h3>
<p>头尾插入均为 O(1)：当缓冲区有空位时直接构造，否则申请新缓冲区并更新 map。如果 map 空间不足，会重新分配更大的 map 并居中已有节点。</p>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="da" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
  </defs>
  <text x="350" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">std::deque 中控映射表 + 分段缓冲区</text>
  <!-- Map array -->
  <rect x="230" y="36" width="240" height="40" rx="6" fill="#0f1117" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="350" y="58" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="600" font-family="sans-serif">deque_map（中控指针数组）</text>
  <!-- Map slots -->
  <rect x="236" y="80" width="44" height="28" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="258" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">map[0]</text>
  <rect x="286" y="80" width="44" height="28" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="308" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">map[1]</text>
  <rect x="336" y="80" width="44" height="28" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="358" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">map[2]</text>
  <rect x="386" y="80" width="44" height="28" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="408" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">map[3]</text>
  <rect x="436" y="80" width="44" height="28" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="458" y="98" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">map[4]</text>
  <!-- Arrows from map to buffers -->
  <line x1="258" y1="108" x2="130" y2="138" stroke="#a78bfa" stroke-width="1.2" marker-end="url(#da)"/>
  <line x1="308" y1="108" x2="280" y2="138" stroke="#a78bfa" stroke-width="1.2" marker-end="url(#da)"/>
  <line x1="358" y1="108" x2="420" y2="138" stroke="#a78bfa" stroke-width="1.2" marker-end="url(#da)"/>
  <line x1="408" y1="108" x2="560" y2="138" stroke="#a78bfa" stroke-width="1.2" marker-end="url(#da)"/>
  <line x1="458" y1="108" x2="650" y2="138" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <!-- Buffer 0 -->
  <rect x="70" y="142" width="120" height="38" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <rect x="74" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="87" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">10</text>
  <rect x="102" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="115" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">20</text>
  <rect x="130" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="143" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">30</text>
  <rect x="158" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="171" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">40</text>
  <!-- Buffer 1 -->
  <rect x="220" y="142" width="120" height="38" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <rect x="224" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="237" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">50</text>
  <rect x="252" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="265" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">60</text>
  <rect x="280" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="293" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">70</text>
  <rect x="308" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="321" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">80</text>
  <!-- Buffer 2 -->
  <rect x="360" y="142" width="120" height="38" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <rect x="364" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="377" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">90</text>
  <rect x="392" y="146" width="26" height="30" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="405" y="165" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">100</text>
  <rect x="420" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="433" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <rect x="448" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="461" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <!-- Buffer 3 -->
  <rect x="500" y="142" width="120" height="38" rx="6" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="4,2"/>
  <rect x="504" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="517" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <rect x="532" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="545" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <rect x="560" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="573" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <rect x="588" y="146" width="26" height="30" rx="3" fill="#151720" stroke="#252837" stroke-width="1" stroke-dasharray="3"/>
  <text x="601" y="165" text-anchor="middle" fill="#555" font-size="8">—</text>
  <!-- Start iterator pointer -->
  <line x1="237" y1="142" x2="237" y2="130" stroke="#6c9eeb" stroke-width="1.5"/>
  <polygon points="234,130 240,130 237,124" fill="#6c9eeb"/>
  <text x="237" y="200" text-anchor="middle" fill="#6c9eeb" font-size="10" font-weight="600">↑ start.cur (value=10)</text>
  <text x="237" y="214" text-anchor="middle" fill="#6c9eeb" font-size="9">start.node → map[0]</text>
  <!-- Finish iterator pointer -->
  <line x1="405" y1="142" x2="405" y2="130" stroke="#34d399" stroke-width="1.5"/>
  <polygon points="402,130 408,130 405,124" fill="#34d399"/>
  <text x="405" y="200" text-anchor="middle" fill="#34d399" font-size="10" font-weight="600">↑ finish.cur (value=100)</text>
  <text x="405" y="214" text-anchor="middle" fill="#34d399" font-size="9">finish.node → map[2]</text>
  <!-- Layout notes -->
  <text x="350" y="246" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">每个迭代器含 4 个指针：cur, first, last, node（共 0x20 = 32 字节）</text>
  <text x="350" y="264" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">push_front / push_back 只扩展两端，不会使已有迭代器失效</text>
</svg>
</div>

<h2 id="s6">6. 红黑树（map / set / multimap / multiset）</h2>
<p>SGI STL 的关联容器基于<strong>红黑树</strong>实现，保证查找、插入、删除均为 O(log n)。</p>

<h3>内存布局</h3>
<pre><code>struct _Rb_tree {
    size_t key_compare_0x0;         // 比较器
    _Rb_tree_node *header_0x8;      // 哨兵头节点
    _Rb_tree_node *root_0x10;       // header->parent = root
    _Rb_tree_node *leftmost_0x18;   // header->left = 最小值
    _Rb_tree_node *rightmost_0x20;  // header->right = 最大值
    size_t node_count_0x28;         // 节点数
};

struct _Rb_tree_node {
    bool color_0x0;                 // RED=0 / BLACK=1
    _Rb_tree_node *parent_0x8;
    _Rb_tree_node *left_0x10;
    _Rb_tree_node *right_0x18;
    value_type value_0x20;          // 键值对
};</code></pre>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="ta" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
  </defs>
  <text x="340" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">红黑树 + header 哨兵节点（map/set 底层）</text>
  <!-- Header node (large, left side) -->
  <rect x="16" y="40" width="130" height="160" rx="8" fill="#0f1117" stroke="#a78bfa" stroke-width="2"/>
  <text x="81" y="62" text-anchor="middle" fill="#a78bfa" font-size="12" font-weight="700">header</text>
  <text x="81" y="78" text-anchor="middle" fill="#555" font-size="9">(哨兵节点)</text>
  <rect x="24" y="86" width="114" height="22" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="81" y="101" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">parent → root</text>
  <rect x="24" y="112" width="114" height="22" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="81" y="127" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">left → 最小节点</text>
  <rect x="24" y="138" width="114" height="22" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="81" y="153" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">right → 最大节点</text>
  <rect x="24" y="164" width="114" height="22" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="81" y="179" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">node_count = 4</text>
  <!-- Arrows from header -->
  <line x1="146" y1="97" x2="260" y2="74" stroke="#a78bfa" stroke-width="1.2" marker-end="url(#ta)" stroke-dasharray="5,3"/>
  <line x1="146" y1="123" x2="260" y2="200" stroke="#34d399" stroke-width="1.2" marker-end="url(#ta)" stroke-dasharray="5,3"/>
  <line x1="146" y1="149" x2="500" y2="200" stroke="#f87171" stroke-width="1.2" marker-end="url(#ta)" stroke-dasharray="5,3"/>
  <!-- Root node (BLACK) -->
  <circle cx="340" cy="74" r="28" fill="#1a1d28" stroke="#fff" stroke-width="2"/>
  <text x="340" y="72" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">30</text>
  <text x="340" y="86" text-anchor="middle" fill="#555" font-size="8">BLACK</text>
  <!-- Root left (RED) -->
  <circle cx="220" cy="148" r="28" fill="#1a1d28" stroke="#f87171" stroke-width="2"/>
  <text x="220" y="146" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">15</text>
  <text x="220" y="160" text-anchor="middle" fill="#f87171" font-size="8">RED</text>
  <line x1="314" y1="86" x2="248" y2="136" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#ta)"/>
  <!-- Root right (RED) -->
  <circle cx="460" cy="148" r="28" fill="#1a1d28" stroke="#f87171" stroke-width="2"/>
  <text x="460" y="146" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">55</text>
  <text x="460" y="160" text-anchor="middle" fill="#f87171" font-size="8">RED</text>
  <line x1="366" y1="86" x2="432" y2="136" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#ta)"/>
  <!-- 15's left child (BLACK) -->
  <circle cx="160" cy="222" r="26" fill="#1a1d28" stroke="#fff" stroke-width="2"/>
  <text x="160" y="220" text-anchor="middle" fill="#fff" font-size="10" font-weight="600">10</text>
  <text x="160" y="234" text-anchor="middle" fill="#555" font-size="8">BLACK</text>
  <line x1="200" y1="170" x2="176" y2="200" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#ta)"/>
  <!-- 15's right child (BLACK nil) -->
  <text x="280" y="220" fill="#555" font-size="9" font-family="monospace">nil (BLACK)</text>
  <line x1="240" y1="170" x2="276" y2="214" stroke="#6c9eeb" stroke-width="1" stroke-dasharray="3"/>
  <!-- 55's children (BLACK nil) -->
  <text x="420" y="220" fill="#555" font-size="9" font-family="monospace">nil (BLACK)</text>
  <text x="520" y="220" fill="#555" font-size="9" font-family="monospace">nil (BLACK)</text>
  <line x1="446" y1="170" x2="420" y2="214" stroke="#6c9eeb" stroke-width="1" stroke-dasharray="3"/>
  <line x1="474" y1="170" x2="516" y2="214" stroke="#6c9eeb" stroke-width="1" stroke-dasharray="3"/>
  <!-- Legend -->
  <circle cx="560" cy="60" r="8" fill="#1a1d28" stroke="#fff" stroke-width="2"/>
  <text x="576" y="64" fill="#fff" font-size="10" font-family="sans-serif">BLACK 节点</text>
  <circle cx="560" cy="84" r="8" fill="#1a1d28" stroke="#f87171" stroke-width="2"/>
  <text x="576" y="88" fill="#f87171" font-size="10" font-family="sans-serif">RED 节点</text>
  <!-- Node layout -->
  <rect x="230" y="260" width="300" height="32" rx="6" fill="#0f1117" stroke="#252837" stroke-width="1"/>
  <text x="380" y="280" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">节点：color + parent + left + right + value（共 0x28）</text>
</svg>
</div>

<h3>旋转操作</h3>
<pre><code>// 左旋：将 x 的右子节点提升
void _Rb_tree_rotate_left(_Rb_tree_node *x) {
    _Rb_tree_node *y = x-&gt;right;
    x-&gt;right = y-&gt;left;
    if (y-&gt;left) y-&gt;left-&gt;parent = x;
    y-&gt;parent = x-&gt;parent;
    if (x == root) root = y;
    else if (x == x-&gt;parent-&gt;left) x-&gt;parent-&gt;left = y;
    else x-&gt;parent-&gt;right = y;
    y-&gt;left = x;
    x-&gt;parent = y;
}</code></pre>

<h2 id="s7">7. 哈希表（unordered_map / unordered_set）</h2>
<p>采用<strong>拉链法</strong>（separate chaining）解决哈希冲突，底层为桶数组 + 单链表。</p>

<h3>内存布局</h3>
<pre><code>struct _Hashtable {
    _Bucket *buckets_0x0;          // 桶数组（指针数组）
    size_t bucket_count_0x8;       // 桶数量（素数）
    _Node before_begin_0x10;       // 超前哨兵节点
    size_t element_count_0x18;     // 元素数量
    float max_load_factor_0x20;    // 默认 1.0
    size_t next_resize_0x28;       // 触发扩容的元素阈值
};

struct _Node {
    _Node *next;                   // 链表下一节点
    value_type value;              // 键值对
    size_t bucket_index;           // 所在桶索引
};</code></pre>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="ha" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6c9eeb"/></marker>
  </defs>
  <text x="350" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">std::unordered_map 拉链法哈希表</text>
  <!-- Hashtable object -->
  <rect x="14" y="36" width="140" height="130" rx="8" fill="#0f1117" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="84" y="56" text-anchor="middle" fill="#6c9eeb" font-size="11" font-weight="600" font-family="sans-serif">_Hashtable</text>
  <rect x="22" y="64" width="124" height="20" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="84" y="78" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">buckets → 桶数组</text>
  <rect x="22" y="88" width="124" height="20" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="84" y="102" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">bucket_count = 7</text>
  <rect x="22" y="112" width="124" height="20" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="84" y="126" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">element_count = 5</text>
  <rect x="22" y="136" width="124" height="20" rx="3" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="84" y="150" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">load_factor = 0.71</text>
  <!-- Arrow to buckets -->
  <line x1="154" y1="74" x2="210" y2="74" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#ha)"/>
  <!-- Bucket array -->
  <rect x="214" y="40" width="50" height="200" rx="6" fill="#0f1117" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="239" y="254" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="600">桶数组</text>
  <!-- Bucket slots -->
  <rect x="220" y="46" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="62" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[0]</text>
  <rect x="220" y="74" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="90" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[1]</text>
  <rect x="220" y="102" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="118" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[2]</text>
  <rect x="220" y="130" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="146" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[3]</text>
  <rect x="220" y="158" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="174" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[4]</text>
  <rect x="220" y="186" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="202" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[5]</text>
  <rect x="220" y="214" width="38" height="24" rx="3" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="239" y="230" text-anchor="middle" fill="#80deea" font-size="9" font-family="monospace">[6]</text>
  <!-- Chain 1: bucket[0] -> node("apple", 5) -> node("ant", 8) -->
  <line x1="258" y1="58" x2="320" y2="58" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#ha)"/>
  <rect x="324" y="42" width="110" height="32" rx="5" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="379" y="62" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">"apple" → 5</text>
  <line x1="434" y1="58" x2="460" y2="58" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#ha)"/>
  <rect x="464" y="42" width="110" height="32" rx="5" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="519" y="62" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">"ant" → 8</text>
  <line x1="574" y1="58" x2="600" y2="58" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="606" y="62" fill="#555" font-size="9">∅</text>
  <!-- Chain 3: bucket[2] -> node("banana", 3) -->
  <line x1="258" y1="114" x2="320" y2="114" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#ha)"/>
  <rect x="324" y="98" width="110" height="32" rx="5" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="379" y="118" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">"banana" → 3</text>
  <line x1="434" y1="114" x2="460" y2="114" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="466" y="118" fill="#555" font-size="9">∅</text>
  <!-- Chain 4: bucket[3] -> node("cherry", 7) -> node("cat", 2) -->
  <line x1="258" y1="142" x2="320" y2="142" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#ha)"/>
  <rect x="324" y="126" width="110" height="32" rx="5" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="379" y="146" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">"cherry" → 7</text>
  <line x1="434" y1="142" x2="460" y2="142" stroke="#6c9eeb" stroke-width="1.2" marker-end="url(#ha)"/>
  <rect x="464" y="126" width="110" height="32" rx="5" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="519" y="146" text-anchor="middle" fill="#c9d1d9" font-size="10" font-family="monospace">"cat" → 2</text>
  <line x1="574" y1="142" x2="600" y2="142" stroke="#555" stroke-width="1" stroke-dasharray="3"/>
  <text x="606" y="146" fill="#555" font-size="9">∅</text>
  <!-- Empty buckets -->
  <text x="296" y="66" fill="#555" font-size="9">∅</text>
  <text x="296" y="174" fill="#555" font-size="9">∅</text>
  <text x="296" y="202" fill="#555" font-size="9">∅</text>
  <text x="296" y="230" fill="#555" font-size="9">∅</text>
  <!-- Hash labels -->
  <text x="300" y="48" fill="#555" font-size="8" font-family="monospace">hash("apple")%7=0</text>
  <text x="300" y="106" fill="#555" font-size="8" font-family="monospace">hash("banana")%7=2</text>
  <text x="300" y="134" fill="#555" font-size="8" font-family="monospace">hash("cherry")%7=3</text>
</svg>
</div>

<h3>扩容策略</h3>
<p>当 <code>element_count &gt; bucket_count × max_load_factor</code> 时触发扩容：</p>
<ol>
<li>桶数量翻倍并取最近的素数</li>
<li>重新分配所有元素到新桶中（rehash）</li>
</ol>
<p>SGI STL 的素数序列为：<code>53, 97, 193, 389, 769, 1543, 3079, 6151, 12289, ...</code></p>

<h2 id="s8">8. tuple 元组</h2>
<p><code>std::tuple</code> 采用<strong>逆序存储</strong>（模板参数从右至左继承），利用空基类优化（EBO）消除空类型的空间浪费：</p>
<pre><code>// std::tuple&lt;int, double, string&gt; 的实际继承链：
// tuple_impl&lt;2, string&gt; → tuple_impl&lt;1, double&gt; → tuple_impl&lt;0, int&gt;
template &lt;size_t I, typename T&gt;
struct tuple_impl {
    T value;   // 每层存储一个元素
};</code></pre>
<p>按指针大小对齐后，<code>std::pair&lt;int, int&gt;</code> 总大小为 0x8，<code>std::pair&lt;int*, int&gt;</code> 为 0x10。</p>

<div style="overflow-x:auto;margin:20px 0">
<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#0d0f16;border-radius:10px;border:1px solid #252837">
  <defs>
    <marker id="ia" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#a78bfa"/></marker>
  </defs>
  <text x="340" y="22" text-anchor="middle" fill="#6c9eeb" font-size="13" font-weight="600" font-family="sans-serif">std::tuple&lt;int, double, string&gt; 逆序继承存储</text>
  <!-- Inheritance chain -->
  <text x="30" y="54" fill="#555" font-size="10" font-family="sans-serif">继承链：</text>
  <rect x="100" y="40" width="160" height="50" rx="6" fill="#151720" stroke="#a78bfa" stroke-width="1.5"/>
  <text x="180" y="60" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="600">tuple_impl&lt;2, string&gt;</text>
  <rect x="110" y="68" width="140" height="16" rx="2" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="180" y="80" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">string value (偏移 0x10)</text>
  <line x1="260" y1="65" x2="300" y2="65" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#ia)"/>
  <rect x="304" y="40" width="160" height="50" rx="6" fill="#151720" stroke="#6c9eeb" stroke-width="1.5"/>
  <text x="384" y="60" text-anchor="middle" fill="#6c9eeb" font-size="10" font-weight="600">tuple_impl&lt;1, double&gt;</text>
  <rect x="314" y="68" width="140" height="16" rx="2" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="384" y="80" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">double value (偏移 0x08)</text>
  <line x1="464" y1="65" x2="504" y2="65" stroke="#6c9eeb" stroke-width="1.5" marker-end="url(#ia)"/>
  <rect x="508" y="40" width="160" height="50" rx="6" fill="#151720" stroke="#34d399" stroke-width="1.5"/>
  <text x="588" y="60" text-anchor="middle" fill="#34d399" font-size="10" font-weight="600">tuple_impl&lt;0, int&gt;</text>
  <rect x="518" y="68" width="140" height="16" rx="2" fill="#1a1d28" stroke="#34d399" stroke-width="1"/>
  <text x="588" y="80" text-anchor="middle" fill="#c9d1d9" font-size="9" font-family="monospace">int value (偏移 0x00)</text>
  <!-- Memory layout -->
  <text x="30" y="124" fill="#555" font-size="10" font-family="sans-serif">实际内存：</text>
  <rect x="100" y="108" width="568" height="42" rx="6" fill="#0f1117" stroke="#252837" stroke-width="1.5"/>
  <rect x="104" y="112" width="110" height="34" rx="4" fill="#1e2a4a" stroke="#34d399" stroke-width="1"/>
  <text x="159" y="133" text-anchor="middle" fill="#34d399" font-size="10" font-family="monospace">int (4B)</text>
  <rect x="216" y="112" width="160" height="34" rx="4" fill="#1e2a4a" stroke="#6c9eeb" stroke-width="1"/>
  <text x="296" y="133" text-anchor="middle" fill="#6c9eeb" font-size="10" font-family="monospace">double (8B) + 4B padding</text>
  <rect x="378" y="112" width="286" height="34" rx="4" fill="#1a1530" stroke="#a78bfa" stroke-width="1"/>
  <text x="521" y="133" text-anchor="middle" fill="#a78bfa" font-size="10" font-family="monospace">string (32B, 含指针/size/capacity)</text>
  <!-- Offset labels -->
  <text x="159" y="164" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x00</text>
  <text x="296" y="164" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x08</text>
  <text x="521" y="164" text-anchor="middle" fill="#555" font-size="9" font-family="monospace">+0x10</text>
  <!-- Total size -->
  <text x="340" y="186" text-anchor="middle" fill="#8b9cc7" font-size="10" font-family="sans-serif">总大小 = 0x28（40 字节），std::tuple 模板参数从右至左逆序存储</text>
</svg>
</div>

<h2 id="s9">9. 算法（Algorithm）</h2>
<p>STL 算法通过迭代器进行泛型编程，不依赖具体容器类型。可分为<strong>非质变算法</strong>（不修改元素）和<strong>质变算法</strong>（修改元素值）。</p>

<h3>常用非质变算法</h3>
<table><tr><th>算法</th><th>功能</th><th>复杂度</th></tr>
<tr><td><code>find</code></td><td>线性查找目标值</td><td>O(n)</td></tr>
<tr><td><code>count</code></td><td>统计目标值出现次数</td><td>O(n)</td></tr>
<tr><td><code>binary_search</code></td><td>二分查找（要求有序）</td><td>O(log n)</td></tr>
<tr><td><code>lower_bound</code></td><td>第一个 ≥ 目标值的位置</td><td>O(log n)</td></tr>
<tr><td><code>accumulate</code></td><td>累加求和</td><td>O(n)</td></tr></table>

<h3>常用质变算法</h3>
<table><tr><th>算法</th><th>功能</th><th>注意</th></tr>
<tr><td><code>copy</code></td><td>拷贝区间到目标</td><td>目标空间必须 ≥ 源区间长度</td></tr>
<tr><td><code>transform</code></td><td>对每个元素应用函数</td><td>原地操作时输入输出可相同</td></tr>
<tr><td><code>sort</code></td><td>排序（IntroSort: 快排+堆排+插入排序）</td><td>需要随机访问迭代器</td></tr>
<tr><td><code>remove</code></td><td>移除指定值（实际是前移）</td><td>需配合 <code>erase</code>（erase-remove 惯用法）</td></tr>
<tr><td><code>unique</code></td><td>去除相邻重复元素</td><td>需先排序，配合 <code>erase</code></td></tr></table>

<div class="warn-box"><div class="warn-label">注意</div><code>copy</code> 类算法要求目标容器的可用空间至少等于源范围长度，否则将产生未定义行为（缓冲区溢出）。</div>
</div>
<div class="nav-bar"><a href="/archives">← 总目录</a><a href="/article/so-injection">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
