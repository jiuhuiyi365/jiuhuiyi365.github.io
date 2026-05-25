---
title: "Tool 与 Function Calling"
date: 2026-05-25
categories: "Agent"
tags: ["AI","Tool"]
id: "function-calling"
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

<div class="hero"><h1>Tool 与 Function Calling</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 Function Calling</a></li>
<li><a href="#s2">工具定义（JSON Schema）</a></li>
<li><a href="#s3">调用流程（六步）</a></li>
<li><a href="#s4">代码实现示例</a></li>
<li><a href="#s5">并行调用与强制调用</a></li>
<li><a href="#s6">安全策略</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 Function Calling</h2>
<p>Function Calling 是大模型与外部工具交互的标准化接口。它允许模型在推理过程中<strong>决定调用哪个工具</strong>，并<strong>生成符合工具定义的参数</strong>，由宿主程序执行后将结果返回给模型。</p>

<h3>核心价值</h3>
<ul>
<li>突破模型的知识截止日期（实时搜索）</li>
<li>执行模型无法完成的操作（计算、代码执行、API 调用）</li>
<li>获取私有数据（数据库查询、文件读取）</li>
<li>控制外部系统（发送邮件、创建任务）</li>
</ul>

<h2 id="s2">2. 工具定义（JSON Schema）</h2>
<p>每个工具通过 JSON Schema 描述其名称、功能和参数：</p>
<pre><code>{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "获取指定城市的当前天气信息",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "城市名称，如 '北京'、'上海'"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "温度单位"
        }
      },
      "required": ["city"]
    }
  }
}</code></pre>

<h2 id="s3">3. 调用流程（六步）</h2>
<pre><code>1. 用户发送消息
   User: "北京今天天气怎么样？"

2. 模型分析并决定调用工具
   → Tool Call: get_weather({city: "北京", unit: "celsius"})

3. 宿主程序执行工具
   → 调用天气 API，获取结果

4. 宿主程序返回工具结果
   → Tool Result: {"temp": 25, "weather": "晴", "humidity": 45}

5. 模型基于工具结果生成回复
   → "北京今天天气晴朗，气温 25°C，湿度 45%。"

6. 返回给用户</code></pre>

<h2 id="s4">4. 代码实现示例</h2>
<pre><code>import openai
import json

# 定义工具
tools = [{
    "type": "function",
    "function": {
        "name": "search_docs",
        "description": "搜索项目文档",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "搜索关键词"},
                "limit": {"type": "integer", "description": "返回结果数量", "default": 5}
            },
            "required": ["query"]
        }
    }
}]

# 第一次调用：模型决定是否需要工具
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "我们的退款政策是什么？"}],
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message

# 检查模型是否要求调用工具
if msg.tool_calls:
    for call in msg.tool_calls:
        args = json.loads(call.function.arguments)
        result = search_docs(args["query"], args.get("limit", 5))

        # 将工具结果返回给模型
        messages.append(msg)
        messages.append({
            "role": "tool",
            "tool_call_id": call.id,
            "content": json.dumps(result, ensure_ascii=False)
        })

    # 第二次调用：模型基于工具结果生成最终回复
    final = openai.chat.completions.create(
        model="gpt-4",
        messages=messages
    )
    print(final.choices[0].message.content)</code></pre>

<h2 id="s5">5. 并行调用与强制调用</h2>
<p>模型可以在一次回复中同时调用多个独立工具（并行调用），大幅减少交互轮次：</p>
<pre><code># tool_choice 参数控制调用行为
tool_choice = "auto"      # 模型自行决定（默认）
tool_choice = "none"      # 禁止调用任何工具
tool_choice = {"type": "function", "function": {"name": "search_docs"}}  # 强制调用指定工具</code></pre>

<h2 id="s6">6. 安全策略</h2>
<table><tr><th>策略</th><th>说明</th></tr>
<tr><td>用户确认</td><td>执行敏感操作前（如发送邮件、删除数据）要求用户确认</td></tr>
<tr><td>参数校验</td><td>验证模型生成的参数是否合法、安全</td></tr>
<tr><td>权限隔离</td><td>工具只授予最小必要权限</td></tr>
<tr><td>输入消毒</td><td>防止模型生成的参数包含注入攻击</td></tr>
<tr><td>速率限制</td><td>限制工具调用频率，防止滥用</td></tr></table>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/context-window">← 上一篇</a> <a href="/article/mcp-protocol">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
