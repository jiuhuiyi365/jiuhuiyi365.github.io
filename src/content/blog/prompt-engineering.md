---
title: "Prompt Engineering 提示词工程"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Prompt"]
id: "prompt-engineering"
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

<div class="hero"><h1>Prompt Engineering 提示词工程</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 Prompt Engineering</a></li>
<li><a href="#s2">Prompt 的五大要素</a></li>
<li><a href="#s3">System Prompt vs User Prompt</a></li>
<li><a href="#s4">Chain of Thought（思维链）</a></li>
<li><a href="#s5">常用 Prompt 模式</a></li>
<li><a href="#s6">迭代优化技巧</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 Prompt Engineering</h2>
<p>Prompt Engineering（提示词工程）是<strong>设计和优化输入提示</strong>以引导大语言模型输出期望结果的技术。好的 Prompt 能显著提升模型输出的质量、准确性和一致性。</p>

<h2 id="s2">2. Prompt 的五大要素</h2>
<table><tr><th>要素</th><th>说明</th><th>示例</th></tr>
<tr><td><strong>角色（Role）</strong></td><td>设定模型的身份和专业领域</td><td>"你是一位资深 Python 工程师"</td></tr>
<tr><td><strong>任务（Task）</strong></td><td>明确需要完成的具体任务</td><td>"审查以下代码并指出潜在问题"</td></tr>
<tr><td><strong>约束（Constraints）</strong></td><td>限定输出范围和规则</td><td>"只关注性能问题，忽略格式"</td></tr>
<tr><td><strong>格式（Format）</strong></td><td>期望的输出格式</td><td>"以 Markdown 表格形式输出"</td></tr>
<tr><td><strong>示例（Example）</strong></td><td>提供输入-输出样例</td><td>"例如：输入 X → 输出 Y"</td></tr></table>

<h2 id="s3">3. System Prompt vs User Prompt</h2>
<p>在 API 调用中，消息分为不同角色：</p>
<pre><code>messages = [
    {"role": "system", "content": "你是一个代码审查专家。用中文回答。"},
    {"role": "user",   "content": "审查这段 Python 代码：\ndef fib(n): ..."},
    {"role": "assistant", "content": "我发现了以下问题：..."},
    {"role": "user",   "content": "请给出修改建议"}
]</code></pre>
<ul>
<li><strong>System Prompt</strong>：设定全局行为准则、角色身份、输出风格</li>
<li><strong>User Prompt</strong>：具体的问题或指令</li>
<li><strong>Assistant Prompt</strong>：模型的历史回复（多轮对话中使用）</li>
</ul>

<h2 id="s4">4. Chain of Thought（思维链）</h2>
<p>通过引导模型<strong>展示推理过程</strong>来提升复杂任务的准确率。核心思想：不要直接要答案，让模型先"想一想"。</p>

<h3>Zero-shot CoT</h3>
<pre><code>Q: 一个商店有 15 个苹果，卖出了 40%，又进货了 8 个，现在有多少苹果？
A: 让我们一步步思考这个问题。
   1. 卖出 40%: 15 × 0.4 = 6 个
   2. 剩余: 15 - 6 = 9 个
   3. 进货后: 9 + 8 = 17 个
   答案：17 个苹果。</code></pre>

<h3>Few-shot CoT</h3>
<pre><code>Q: 2+3=?
A: 2+3=5。这是因为 2 个加上 3 个等于 5 个。

Q: 7×8=?
A: 7×8=56。这是因为 7 个 8 相加等于 56。

Q: 12×15=?
A: 让我一步步计算：
   12×15 = 12×(10+5) = 120+60 = 180
   答案：180。</code></pre>

<h2 id="s5">5. 常用 Prompt 模式</h2>

<h3>角色扮演模式</h3>
<pre><code>你是一位拥有 20 年经验的数据库架构师。
请从性能、可扩展性、成本三个维度评估以下数据库设计方案。
要求：每个维度给出 1-10 分的评分，并说明理由。</code></pre>

<h3>结构化输出模式</h3>
<pre><code>请分析以下代码，按以下 JSON 格式返回结果：
{
  "bugs": [{"line": int, "description": string, "severity": "low|medium|high"}],
  "suggestions": [string],
  "overall_score": int
}</code></pre>

<h3>ReAct 模式</h3>
<pre><code>请按照以下格式回答：
Thought: 分析当前问题需要什么信息
Action: 选择要使用的工具
Observation: 工具返回的结果
... (重复直到问题解决)
Final Answer: 最终答案</code></pre>

<h2 id="s6">6. 迭代优化技巧</h2>
<ol>
<li><strong>明确性</strong>：避免模糊指令，如不说"优化代码"而说"减少时间复杂度到 O(n)"</li>
<li><strong>分步拆解</strong>：复杂任务拆分为多个简单步骤</li>
<li><strong>负面示例</strong>：告诉模型"不要做什么"同样重要</li>
<li><strong>温度控制</strong>：需要精确答案时用低温度（0-0.3），创意任务用高温度（0.7-1.0）</li>
<li><strong>输出限制</strong>：通过格式要求（如 JSON Schema）限制输出格式</li>
</ol>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/llm-basics">← 上一篇</a> <a href="/article/context-window">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
