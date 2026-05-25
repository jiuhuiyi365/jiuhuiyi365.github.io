---
title: "Harness 调度中枢"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Agent"]
id: "agent-harness"
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

<div class="hero"><h1>Harness 调度中枢</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 Harness</a></li>
<li><a href="#s2">六大子模块</a></li>
<li><a href="#s3">请求路由流程</a></li>
<li><a href="#s4">Agent 循环控制</a></li>
<li><a href="#s5">错误处理与容错</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 Harness</h2>
<p>Harness（调度中枢）是 Agent 系统的<strong>运行时引擎</strong>，负责协调 LLM 推理、工具调用、记忆管理和错误恢复。它不直接参与智能决策，而是确保 Agent 的各个组件能够正确、高效、安全地协同工作。</p>

<h2 id="s2">2. 六大子模块</h2>
<table><tr><th>模块</th><th>职责</th></tr>
<tr><td><strong>请求路由器（Router）</strong></td><td>解析用户请求，路由到对应的处理流程</td></tr>
<tr><td><strong>LLM 调度器（LLM Scheduler）</strong></td><td>管理 LLM 调用：重试、降级、限流、缓存</td></tr>
<tr><td><strong>工具执行器（Tool Executor）</strong></td><td>安全地执行工具调用，管理超时和权限</td></tr>
<tr><td><strong>循环控制器（Loop Controller）</strong></td><td>控制 Agent 的推理-行动循环，防止无限循环</td></tr>
<tr><td><strong>记忆管理器（Memory Manager）</strong></td><td>协调短期/工作/长期记忆的读写</td></tr>
<tr><td><strong>错误处理器（Error Handler）</strong></td><td>捕获异常、执行恢复策略、生成错误报告</td></tr></table>

<h2 id="s3">3. 请求路由流程</h2>
<pre><code>class Harness {
    async handleRequest(userMessage, context) {
        // 1. 路由：判断请求类型
        const route = this.router.classify(userMessage)
        // → "chat" | "agent_task" | "tool_direct" | "clarification_needed"

        switch (route) {
            case "chat":
                return await this.simpleChat(userMessage, context)

            case "agent_task":
                return await this.agentLoop(userMessage, context)

            case "tool_direct":
                return await this.directToolCall(userMessage, context)

            case "clarification_needed":
                return await this.askClarification(userMessage, context)
        }
    }
}</code></pre>

<h2 id="s4">4. Agent 循环控制</h2>
<pre><code>async agentLoop(task, context) {
    const MAX_ITERATIONS = 10
    const MAX_TOKENS = 50000
    let tokenCount = 0
    let iteration = 0

    while (iteration < MAX_ITERATIONS && tokenCount < MAX_TOKENS) {
        iteration++

        // 1. 组装上下文
        const prompt = this.buildPrompt(task, context, this.memory)

        // 2. LLM 推理
        const response = await this.llmScheduler.call(prompt)
        tokenCount += response.usage.total_tokens

        // 3. 解析响应
        const action = this.parseAction(response)

        if (action.type === "final_answer") {
            await this.memory.store({
                type: "task_result",
                task, answer: action.content, iterations: iteration
            })
            return action.content
        }

        if (action.type === "tool_call") {
            // 4. 执行工具
            const result = await this.toolExecutor.execute(
                action.tool, action.args, context
            )

            // 5. 更新上下文
            context.addToolResult(action.tool, result)
        }

        // 6. 安全检查：防止无限循环
        if (this.detectLoop(context.history)) {
            return this.errorHandler.handleInfiniteLoop(context)
        }
    }

    // 超出迭代限制
    return this.errorHandler.handleMaxIterations(task, context)
}</code></pre>

<h2 id="s5">5. 错误处理与容错</h2>
<h3>LLM 调用错误</h3>
<pre><code>class LLMScheduler {
    async call(prompt, options = {}) {
        const maxRetries = options.maxRetries || 3

        for (let i = 0; i < maxRetries; i++) {
            try {
                // 尝试主模型
                return await this.primaryModel.call(prompt)
            } catch (e) {
                if (e.type === "rate_limit") {
                    await this.backoff(i)  // 指数退避
                } else if (e.type === "context_overflow") {
                    prompt = this.compress(prompt)  // 压缩上下文重试
                } else if (i === maxRetries - 1) {
                    // 最后一次失败，降级到备选模型
                    return await this.fallbackModel.call(prompt)
                }
            }
        }
    }
}</code></pre>

<h3>工具调用错误</h3>
<pre><code>class ToolExecutor {
    async execute(toolName, args, context) {
        try {
            // 权限检查
            if (!this.authCheck(toolName, context.user)) {
                throw new ToolError("PERMISSION_DENIED", toolName)
            }

            // 超时控制
            const result = await withTimeout(
                this.tools[toolName].execute(args),
                30000  // 30秒超时
            )

            return result
        } catch (e) {
            // 返回结构化的错误信息给 LLM，让它决定如何处理
            return {
                error: true,
                type: e.type,
                message: e.message,
                suggestion: "工具执行失败，请尝试其他方法或跳过此步骤"
            }
        }
    }
}</code></pre>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/agent-memory">← 上一篇</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
