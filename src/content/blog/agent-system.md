---
title: "Agent 智能体"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Agent"]
id: "agent-system"
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

<div class="hero"><h1>Agent 智能体</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 Agent</a></li>
<li><a href="#s2">四大核心组件</a></li>
<li><a href="#s3">Agent 工作循环</a></li>
<li><a href="#s4">主流规划策略</a></li>
<li><a href="#s5">主流 Agent 框架</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 Agent</h2>
<p>Agent（智能体）是一种能够<strong>自主感知环境、做出决策并执行行动</strong>的 AI 系统。与传统的"问-答"模式不同，Agent 能够：</p>
<ul>
<li>将复杂任务分解为多个子任务</li>
<li>自主决定使用哪些工具</li>
<li>根据中间结果动态调整策略</li>
<li>在多轮迭代中逐步完成目标</li>
</ul>

<h2 id="s2">2. 四大核心组件</h2>
<table><tr><th>组件</th><th>角色</th><th>实现方式</th></tr>
<tr><td><strong>大脑（Brain）</strong></td><td>推理与决策</td><td>LLM（GPT-4, Claude 等）</td></tr>
<tr><td><strong>双手（Hands）</strong></td><td>执行操作</td><td>Function Calling / MCP Tools</td></tr>
<tr><td><strong>记忆（Memory）</strong></td><td>信息存储与回忆</td><td>短期记忆 + 长期记忆（向量数据库）</td></tr>
<tr><td><strong>规划（Planning）</strong></td><td>任务分解与调度</td><td>ReAct / Plan-and-Execute / ToT</td></tr></table>

<h2 id="s3">3. Agent 工作循环</h2>
<pre><code>while (not task_completed and not max_iterations_reached) {
    // 1. 观察：收集当前状态
    observation = perceive(current_state, memory)

    // 2. 思考：LLM 分析并决策
    thought = llm.think(system_prompt, observation, tools, history)

    // 3. 行动：执行工具调用或给出最终答案
    if (thought.requires_tool_call) {
        result = execute_tool(thought.tool_name, thought.tool_args)
        memory.store(observation, thought, result)
    } else {
        return thought.final_answer
    }
}</code></pre>

<h2 id="s4">4. 主流规划策略</h2>
<h3>ReAct（Reasoning + Acting）</h3>
<p>模型在每一步交替进行"推理"和"行动"，是最常用的 Agent 策略：</p>
<pre><code>Thought: 用户要查找最近30天的销售数据。我需要先查询数据库。
Action: query_database({"sql": "SELECT * FROM sales WHERE date > '2024-04-01'"})
Observation: 返回了 1,234 条记录
Thought: 数据已获取。现在需要按产品类别汇总。
Action: aggregate_data({"data": [...], "group_by": "category", "metric": "sum"})
Observation: {"电子产品": 500000, "服装": 320000, "食品": 180000}
Thought: 汇总完成。可以给用户一个清晰的总结了。
Final Answer: 最近30天的销售数据汇总如下：...</code></pre>

<h3>Plan-and-Execute</h3>
<p>先制定完整计划，再逐步执行。适合需要全局视野的复杂任务：</p>
<pre><code>// Plan 阶段
Plan:
1. 从数据库拉取用户信息
2. 调用风控 API 检查信用
3. 根据信用等级计算额度
4. 生成审批报告

// Execute 阶段：按计划逐步执行每一步</code></pre>

<h2 id="s5">5. 主流 Agent 框架</h2>
<table><tr><th>框架</th><th>特点</th><th>语言</th></tr>
<tr><td>LangChain / LangGraph</td><td>生态最大，支持复杂工作流</td><td>Python</td></tr>
<tr><td>CrewAI</td><td>多 Agent 协作</td><td>Python</td></tr>
<tr><td>AutoGen (Microsoft)</td><td>多 Agent 对话</td><td>Python</td></tr>
<tr><td>Semantic Kernel</td><td>微软官方，.NET 友好</td><td>C#/Python</td></tr>
<tr><td>OpenAI Assistants API</td><td>开箱即用，功能有限</td><td>API</td></tr></table>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/mcp-protocol">← 上一篇</a> <a href="/article/agent-skill">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
