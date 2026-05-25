---
title: "AI 核心概念知识总结"
date: 2026-05-25
categories: "Agent"
tags: ["AI","LLM","Agent"]
id: "ai-core-concepts"
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

<div class="hero"><h1>AI 核心概念知识总结</h1>

</div>
<div class="container">

<div class="article-content">
<p style="text-align:center;color:var(--text2);margin-bottom:32px">从 LLM 基本原理到 Agent 系统架构的完整技术笔记</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0">
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">1. 大模型基本原理</h3>
<p style="font-size:13px;color:var(--text2);margin:0">Transformer · 自回归生成 · Token · 采样策略</p>
<a href="/article/llm-basics" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">2. Prompt Engineering</h3>
<p style="font-size:13px;color:var(--text2);margin:0">提示词设计 · CoT 思维链 · Few-shot · 迭代优化</p>
<a href="/article/prompt-engineering" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">3. Context 与 Context Window</h3>
<p style="font-size:13px;color:var(--text2);margin:0">上下文窗口 · RAG · 向量数据库 · 检索增强</p>
<a href="/article/context-window" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">4. Tool 与 Function Calling</h3>
<p style="font-size:13px;color:var(--text2);margin:0">工具定义 · 调用流程 · JSON Schema · 安全策略</p>
<a href="/article/function-calling" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">5. MCP 模型上下文协议</h3>
<p style="font-size:13px;color:var(--text2);margin:0">N×M → N+M · Host/Client/Server · JSON-RPC</p>
<a href="/article/mcp-protocol" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">6. Agent 智能体</h3>
<p style="font-size:13px;color:var(--text2);margin:0">四大组件 · ReAct · Plan-and-Execute · 主流框架</p>
<a href="/article/agent-system" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">7. Agent Skill</h3>
<p style="font-size:13px;color:var(--text2);margin:0">Skill = 工具 + 流程 + 知识 · 设计原则</p>
<a href="/article/agent-skill" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">8. 完整学习路径</h3>
<p style="font-size:13px;color:var(--text2);margin:0">初/中/高三阶段路线图 · 实践项目</p>
<a href="/article/learning-path" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">9. Memory 记忆系统</h3>
<p style="font-size:13px;color:var(--text2);margin:0">三层记忆架构 · 读写生命周期 · 遗忘策略</p>
<a href="/article/agent-memory" style="font-size:13px">查看详情 →</a>
</div>
<div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px">
<h3 style="color:var(--accent);margin:0 0 8px">10. Harness 调度中枢</h3>
<p style="font-size:13px;color:var(--text2);margin:0">请求路由 · Agent 循环 · 错误处理 · 容错</p>
<a href="/article/agent-harness" style="font-size:13px">查看详情 →</a>
</div>
</div>

<h2 style="margin:32px 0 16px;padding-left:14px;border-left:3px solid var(--accent)">推荐学习顺序</h2>
<ol>
<li>先理解大模型基本原理（1），建立对 LLM 能力和限制的认知</li>
<li>学习 Prompt Engineering（2），掌握与 LLM 高效交互的技巧</li>
<li>了解 Context Window 和 RAG（3），理解如何扩展模型的知识边界</li>
<li>掌握 Tool 和 Function Calling（4），学会让模型使用外部工具</li>
<li>了解 MCP 协议（5），理解工具集成的标准化方案</li>
<li>学习 Agent 架构（6），理解如何构建自主决策的 AI 系统</li>
<li>学习 Skill 设计（7）、Memory（9）和 Harness（10）来完善 Agent 系统</li>
</ol>
</div>

<div class="footer">技术笔记 · 持续更新</div>
</div>
