---
title: "Agent Skill"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Agent"]
id: "agent-skill"
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

<div class="hero"><h1>Agent Skill</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 Agent Skill</a></li>
<li><a href="#s2">Skill 的设计原则</a></li>
<li><a href="#s3">Skill 结构设计</a></li>
<li><a href="#s4">Skill 示例：代码审查</a></li>
<li><a href="#s5">Skill 与 MCP 的关系</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 Agent Skill</h2>
<p>Agent Skill 是将<strong>工具（Tools）、流程（Workflow）和知识（Knowledge）</strong>封装在一起的可复用能力单元。如果说工具是 Agent 的"单个手势"，那么 Skill 就是一套"完整的套路"。</p>

<h3>Skill vs Tool</h3>
<table><tr><th>维度</th><th>Tool</th><th>Skill</th></tr>
<tr><td>复杂度</td><td>单一操作</td><td>多步骤流程</td></tr>
<tr><td>组合性</td><td>原子级</td><td>可包含多个 Tool</td></tr>
<tr><td>知识</td><td>无</td><td>可携带领域知识</td></tr>
<tr><td>示例</td><td>搜索文件</td><td>代码审查（搜索+分析+建议+报告）</td></tr></table>

<h2 id="s2">2. Skill 的设计原则</h2>
<ul>
<li><strong>单一职责</strong>：一个 Skill 只做一件事，但做得很好</li>
<li><strong>可组合性</strong>：多个 Skill 可以组合成更复杂的能力</li>
<li><strong>自描述</strong>：Skill 的名称、描述、参数要清晰，让 LLM 能正确选择</li>
<li><strong>幂等性</strong>：同一 Skill 多次执行不会产生副作用（或可安全重试）</li>
<li><strong>可观测性</strong>：每个步骤的输入输出都应该可被追踪和调试</li>
</ul>

<h2 id="s3">3. Skill 结构设计</h2>
<pre><code>class Skill {
    name: string           // 技能名称
    description: string    // 功能描述（供 LLM 理解何时使用）
    parameters: Schema     // 输入参数定义

    // 核心方法
    async execute(params, context) {
        // 1. 验证参数
        this.validate(params)

        // 2. 执行前置检查
        await this.pre_check(params, context)

        // 3. 执行核心逻辑（可能调用多个 Tool）
        const result = await this.run(params, context)

        // 4. 后置处理
        await this.post_process(result, context)

        return result
    }

    // 可选：LLM 调用 Skill 前的判断
    can_handle(task_description): boolean

    // 可选：执行结果的格式化
    format_output(result): string
}</code></pre>

<h2 id="s4">4. Skill 示例：代码审查</h2>
<pre><code>{
  "name": "code_review",
  "description": "对指定代码文件进行全面审查，包括安全性、性能、可读性分析",
  "parameters": {
    "file_path": "string - 要审查的文件路径",
    "focus": "string[] - 审查重点：security, performance, readability",
    "severity_threshold": "string - 最低报告级别：info, warning, error"
  },
  "workflow": [
    {"tool": "read_file", "params": {"path": "$file_path"}},
    {"tool": "parse_ast", "params": {"code": "$output[0]"}},
    {"tool": "run_linter", "params": {"ast": "$output[1]"}},
    {"tool": "llm_analyze", "params": {"code": "$output[0]", "ast": "$output[1]", "lint": "$output[2]"}},
    {"tool": "format_report", "params": {"analysis": "$output[3]", "threshold": "$severity_threshold"}}
  ]
}</code></pre>

<h2 id="s5">5. Skill 与 MCP 的关系</h2>
<p>MCP Server 天然适合承载 Skill——Server 对外暴露的 Tools 就是一个个 Skill 的入口。区别在于：</p>
<ul>
<li>MCP 定义了<strong>通信标准</strong>（如何调用）</li>
<li>Skill 定义了<strong>能力语义</strong>（做什么、怎么做）</li>
<li>两者互补：MCP 提供传输层，Skill 提供业务层</li>
</ul>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/agent-system">← 上一篇</a> <a href="/article/learning-path">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
