---
title: "Context 与 Context Window"
date: 2026-05-25
categories: "Agent"
tags: ["AI","RAG"]
id: "context-window"
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

<div class="hero"><h1>Context 与 Context Window</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">上下文窗口（Context Window）</a></li>
<li><a href="#s2">Context 的作用与挑战</a></li>
<li><a href="#s3">RAG（检索增强生成）</a></li>
<li><a href="#s4">Context 工程实践</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 上下文窗口（Context Window）</h2>
<p>Context Window 是 LLM 在一次推理中能够<strong>同时看到的最大 Token 数量</strong>。它是 LLM 最核心的资源限制之一，直接影响模型能处理的任务复杂度。</p>

<h3>主流模型上下文长度</h3>
<table><tr><th>模型</th><th>上下文窗口</th><th>备注</th></tr>
<tr><td>GPT-4</td><td>8K / 128K</td><td>128K 为 Turbo 版本</td></tr>
<tr><td>Claude 3</td><td>200K</td><td>支持超长文档</td></tr>
<tr><td>LLaMA 3</td><td>8K / 128K</td><td>开源模型</td></tr>
<tr><td>Gemini 1.5</td><td>1M</td><td>当前最大窗口</td></tr></table>

<h2 id="s2">2. Context 的作用与挑战</h2>
<p>上下文窗口中包含的所有内容（System Prompt、对话历史、工具结果、检索文档）都共享同一个 Token 预算。这带来了几个挑战：</p>
<ul>
<li><strong>信息衰减</strong>：窗口中间的信息容易被忽略（Lost in the Middle 现象）</li>
<li><strong>成本增加</strong>：Token 数量直接决定 API 费用</li>
<li><strong>延迟上升</strong>：更长的上下文意味着更多的计算量</li>
<li><strong>注意力分散</strong>：无关信息过多会降低模型对关键信息的关注</li>
</ul>

<h2 id="s3">3. RAG（检索增强生成）</h2>
<p>RAG（Retrieval-Augmented Generation）是解决上下文窗口限制的主流方案：<strong>先从外部知识库检索最相关的内容，再将其注入上下文</strong>。</p>

<h3>RAG 工作流程</h3>
<pre><code>1. 文档切分（Chunking）
   将长文档切分为 500-1000 Token 的片段

2. 向量化（Embedding）
   使用 Embedding 模型将每个片段转为向量
   例如: text-embedding-3-small → 1536 维向量

3. 向量存储（Vector Store）
   存入向量数据库（Pinecone, Weaviate, ChromaDB, Milvus）

4. 检索（Retrieval）
   用户提问 → 向量化 → 在向量库中搜索最相似的 K 个片段

5. 增强生成（Augmented Generation）
   将检索到的片段拼接为 Context，连同问题一起发送给 LLM</code></pre>

<h3>向量数据库对比</h3>
<table><tr><th>数据库</th><th>特点</th><th>适用场景</th></tr>
<tr><td>Pinecone</td><td>全托管，开箱即用</td><td>快速原型、中小项目</td></tr>
<tr><td>ChromaDB</td><td>轻量，Python 友好</td><td>本地开发、学习</td></tr>
<tr><td>Weaviate</td><td>支持混合搜索</td><td>需要多模态检索</td></tr>
<tr><td>Milvus</td><td>高性能，分布式</td><td>大规模生产环境</td></tr>
<tr><td>pgvector</td><td>PostgreSQL 扩展</td><td>已有 PG 的团队</td></tr></table>

<h2 id="s4">4. Context 工程实践</h2>

<h3>上下文组装策略</h3>
<pre><code>完整的 Context 通常由以下部分组成（按顺序）：

[System Prompt]     ← 角色定义、行为准则
[工具描述]          ← 可用工具的 JSON Schema
[检索到的文档]      ← RAG 结果（最相关优先）
[对话历史]          ← 最近 N 轮对话（重要的放最后）
[当前用户输入]      ← 最新的用户消息</code></pre>

<h3>上下文压缩</h3>
<p>当对话历史过长时，需要压缩以腾出空间：</p>
<ul>
<li><strong>摘要压缩</strong>：用 LLM 对旧对话进行摘要</li>
<li><strong>滑动窗口</strong>：只保留最近 N 轮对话</li>
<li><strong>重要性排序</strong>：根据相关性保留关键信息</li>
<li><strong>分层存储</strong>：详细内容存入向量库，上下文只保留摘要</li>
</ul>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/prompt-engineering">← 上一篇</a> <a href="/article/function-calling">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
