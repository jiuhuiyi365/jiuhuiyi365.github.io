---
title: "Memory 记忆系统"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Agent","Memory"]
id: "agent-memory"
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

<div class="hero"><h1>Memory 记忆系统</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">为什么 Agent 需要记忆</a></li>
<li><a href="#s2">三层记忆架构</a></li>
<li><a href="#s3">读写生命周期</a></li>
<li><a href="#s4">遗忘与合并策略</a></li>
<li><a href="#s5">实现示例</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 为什么 Agent 需要记忆</h2>
<p>LLM 本身是无状态的——每次 API 调用都是独立的，模型不会"记住"之前的对话（除非通过上下文窗口）。Agent 的记忆系统负责<strong>跨越多次交互持久化信息</strong>，使 Agent 能够：</p>
<ul>
<li>记住用户的偏好和历史决策</li>
<li>从过去的错误中学习</li>
<li>积累领域知识</li>
<li>维持连贯的长期任务状态</li>
</ul>

<h2 id="s2">2. 三层记忆架构</h2>
<table><tr><th>层级</th><th>名称</th><th>存储位置</th><th>生命周期</th><th>示例</th></tr>
<tr><td>L1</td><td>短期记忆</td><td>上下文窗口</td><td>单次会话</td><td>当前对话的前几轮消息</td></tr>
<tr><td>L2</td><td>工作记忆</td><td>Session 存储</td><td>一次任务</td><td>当前任务的中间状态、工具调用结果</td></tr>
<tr><td>L3</td><td>长期记忆</td><td>向量数据库 / 文件</td><td>持久</td><td>用户偏好、历史总结、领域知识</td></tr></table>

<h3>记忆类型细分</h3>
<ul>
<li><strong>情景记忆（Episodic）</strong>：具体的事件和经历，如"用户上周问过关于 Python 装饰器的问题"</li>
<li><strong>语义记忆（Semantic）</strong>：抽象的知识和事实，如"用户是后端工程师，偏好 Go 语言"</li>
<li><strong>程序记忆（Procedural）</strong>：执行任务的经验，如"遇到网络错误时应该重试 3 次"</li>
</ul>

<h2 id="s3">3. 读写生命周期</h2>
<pre><code>// 记忆的完整生命周期

// 1. 写入（Store）
//    Agent 在交互过程中识别值得记忆的信息
memory.store({
    type: "preference",
    content: "用户喜欢用 TypeScript 而非 JavaScript",
    context: "对话中用户说 '我都用 TS'",
    timestamp: Date.now(),
    importance: 0.7
})

// 2. 检索（Retrieve）
//    在新任务开始时，检索相关记忆
relevant_memories = memory.retrieve(
    query = "用户正在讨论前端开发",
    top_k = 5,
    threshold = 0.6
)

// 3. 注入（Inject）
//    将检索到的记忆注入上下文
context += "\n## 用户偏好:\n" + relevant_memories.map(m => m.content).join("\n")

// 4. 更新（Update）
//    当信息发生变化时更新已有记忆
memory.update(id, {content: "用户现在改用 Rust 了"})

// 5. 遗忘（Forget）
//    定期清理低价值或过时的记忆
memory.forget(criteria = {importance < 0.3, age > 90days})</code></pre>

<h2 id="s4">4. 遗忘与合并策略</h2>
<h3>遗忘策略</h3>
<ul>
<li><strong>时间衰减</strong>：记忆的权重随时间指数衰减，低于阈值时被遗忘</li>
<li><strong>重要度淘汰</strong>：只保留重要度评分最高的 N 条记忆</li>
<li><strong>冲突覆盖</strong>：新信息与旧信息矛盾时，覆盖旧信息</li>
</ul>

<h3>合并策略</h3>
<ul>
<li><strong>摘要合并</strong>：将多条相关记忆合并为一条摘要</li>
<li><strong>聚类归档</strong>：将同类记忆聚类后存储为知识块</li>
<li><strong>LLM 总结</strong>：定期让 LLM 对记忆库进行总结和去重</li>
</ul>

<h2 id="s5">5. 实现示例</h2>
<pre><code>class MemorySystem {
    constructor() {
        this.shortTerm = []           // 数组：当前会话消息
        this.workMemory = new Map()   // KV：当前任务状态
        this.longTerm = new VectorDB() // 向量数据库
    }

    // 写入记忆
    async store(info) {
        // 生成嵌入向量
        const embedding = await this.embed(info.content)
        // 计算重要度
        const importance = this.calcImportance(info)
        // 存入长期记忆
        await this.longTerm.upsert({
            id: generateId(),
            vector: embedding,
            metadata: {...info, importance}
        })
    }

    // 检索记忆
    async retrieve(query, topK = 5) {
        const embedding = await this.embed(query)
        const results = await this.longTerm.query({
            vector: embedding,
            topK,
            includeMetadata: true
        })
        return results.map(r => r.metadata)
    }

    // 计算重要度
    calcImportance(info) {
        let score = 0.5
        if (info.type === 'preference') score += 0.2
        if (info.type === 'error_lesson') score += 0.3
        if (info.user_confirmed) score += 0.2
        return Math.min(score, 1.0)
    }
}</code></pre>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/learning-path">← 上一篇</a> <a href="/article/agent-harness">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
