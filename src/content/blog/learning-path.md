---
title: "完整学习路径"
date: 2026-05-25
categories: "Agent"
tags: ["AI","学习路线"]
id: "learning-path"
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

<div class="hero"><h1>完整学习路径</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">初级阶段：理解基础</a></li>
<li><a href="#s2">中级阶段：工具与集成</a></li>
<li><a href="#s3">高级阶段：Agent 系统</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 初级阶段：理解基础</h2>
<p>目标：建立对大模型和 Prompt Engineering 的基本认知，能够使用 API 进行简单开发。</p>

<h3>学习内容</h3>
<ol>
<li><strong>大模型基本原理</strong>：Transformer、自回归生成、Token、采样策略</li>
<li><strong>Prompt Engineering</strong>：五大要素、CoT、Few-shot、迭代优化</li>
<li><strong>API 调用</strong>：OpenAI API / Claude API 的基本使用</li>
<li><strong>Context Window</strong>：理解 Token 限制和上下文管理</li>
</ol>

<h3>实践项目</h3>
<ul>
<li>搭建一个简单的 ChatBot（Web 界面 + API 调用）</li>
<li>写一个 Prompt 模板库，测试不同提示词的效果差异</li>
<li>实现一个基于规则的简单问答系统</li>
</ul>

<h3>推荐资源</h3>
<table><tr><th>资源</th><th>类型</th><th>说明</th></tr>
<tr><td>OpenAI Cookbook</td><td>文档</td><td>官方 API 使用指南</td></tr>
<tr><td>Prompt Engineering Guide</td><td>教程</td><td>系统化的提示词工程指南</td></tr>
<tr><td>ChatGPT Prompt Engineering for Developers</td><td>课程</td><td>DeepLearning.AI 出品</td></tr></table>

<h2 id="s2">2. 中级阶段：工具与集成</h2>
<p>目标：掌握 Function Calling、RAG、MCP 等核心技术，能够构建实用的 AI 应用。</p>

<h3>学习内容</h3>
<ol>
<li><strong>Function Calling</strong>：工具定义、调用流程、安全策略</li>
<li><strong>RAG</strong>：文档切分、向量化、检索策略、上下文组装</li>
<li><strong>MCP</strong>：协议规范、Server 开发、Client 集成</li>
<li><strong>向量数据库</strong>：ChromaDB / Pinecone / Milvus 的使用</li>
</ol>

<h3>实践项目</h3>
<ul>
<li>构建一个 RAG 问答系统（文档检索 + LLM 生成）</li>
<li>开发一个 MCP Server（如数据库查询、文件操作）</li>
<li>实现一个多工具 Agent（搜索 + 计算 + 代码执行）</li>
</ul>

<h2 id="s3">3. 高级阶段：Agent 系统</h2>
<p>目标：理解 Agent 架构，能设计复杂的多 Agent 系统和自动化工作流。</p>

<h3>学习内容</h3>
<ol>
<li><strong>Agent 架构</strong>：四大组件、工作循环、规划策略</li>
<li><strong>Skill 设计</strong>：能力封装、可组合性、可观测性</li>
<li><strong>Memory 系统</strong>：三层架构、读写生命周期、遗忘策略</li>
<li><strong>Harness</strong>：调度中枢、请求路由、错误处理</li>
<li><strong>多 Agent 协作</strong>：Agent 间通信、任务分配、冲突解决</li>
</ol>

<h3>实践项目</h3>
<ul>
<li>构建一个自主编码 Agent（读代码 → 分析 → 修改 → 测试）</li>
<li>设计一个多 Agent 协作系统（分析师 + 编码员 + 审查员）</li>
<li>实现一个完整的 Agent Harness 框架</li>
</ul>

<h3>推荐资源</h3>
<table><tr><th>资源</th><th>类型</th><th>说明</th></tr>
<tr><td>LangChain / LangGraph 文档</td><td>框架</td><td>主流 Agent 开发框架</td></tr>
<tr><td>ReAct 论文</td><td>论文</td><td>Reasoning and Acting with LLMs</td></tr>
<tr><td>CrewAI 文档</td><td>框架</td><td>多 Agent 协作框架</td></tr>
<tr><td>AutoGPT 源码</td><td>源码</td><td>自主 Agent 的参考实现</td></tr></table>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/agent-skill">← 上一篇</a> <a href="/article/agent-memory">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
