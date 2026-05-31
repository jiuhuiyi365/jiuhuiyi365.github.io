---
title: "MCP 模型上下文协议"
date: 2026-05-25
categories: "Agent"
tags: ["AI","MCP"]
id: "mcp-protocol"
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

<div class="hero"><h1>MCP 模型上下文协议</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">什么是 MCP</a></li>
<li><a href="#s2">架构组件</a></li>
<li><a href="#s3">通信方式</a></li>
<li><a href="#s4">核心能力</a></li>
<li><a href="#s5">MCP vs Function Calling</a></li>
<li><a href="#s6">实际应用示例</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 什么是 MCP</h2>
<p>MCP（Model Context Protocol，模型上下文协议）是由 Anthropic 提出的<strong>开放标准协议</strong>，旨在统一 LLM 与外部工具/数据源之间的通信方式。</p>

<h3>核心思想：N×M → N+M</h3>
<p>在 MCP 之前，每个 AI 应用要接入 M 个工具，需要写 M 个集成代码。N 个应用接入 M 个工具，总共需要 <strong>N×M</strong> 个集成。MCP 将其标准化后，每个应用只需实现 MCP Client，每个工具只需实现 MCP Server，总共只需 <strong>N+M</strong> 个实现。</p>

<h2 id="s2">2. 架构组件</h2>
<pre><code>┌─────────────────────────────────────────┐
│                Host (应用)                │
│  ┌───────────────────────────────────┐   │
│  │           MCP Client              │   │
│  │  ┌─────────┐  ┌─────────┐        │   │
│  │  │Session 1│  │Session 2│  ...   │   │
│  │  └────┬────┘  └────┬────┘        │   │
│  └───────┼────────────┼─────────────┘   │
└──────────┼────────────┼─────────────────┘
           │            │
     ┌─────┴─────┐ ┌────┴──────┐
     │MCP Server │ │MCP Server │
     │(文件系统)  │ │(数据库)    │
     └───────────┘ └───────────┘</code></pre>

<ul>
<li><strong>Host</strong>：AI 应用（如 Claude Desktop、Claude Code），负责管理 MCP Client 实例，读取配置文件发现可用的 Server</li>
<li><strong>Client</strong>：Host 内的一个通用组件，负责与<strong>多个</strong> MCP Server 建立连接。对每个 Server 创建一个独立的 <strong>Session</strong>（会话），实现 1:1 的通信管理</li>
<li><strong>Server</strong>：向 LLM 暴露工具（Tools）、资源（Resources）、提示模板（Prompts）。Client 在连接时会查询 Server 的能力列表，<strong>动态注册</strong>可用的工具</li>
</ul>

<div class="tip-box"><div class="tip-label">关键点</div>一个 Host 中只有一个 MCP Client，但这个 Client 可以同时连接多个 Server。例如 Claude Code 同时连接文件系统 Server、数据库 Server 和 Git Server，Client 会从每个 Server 动态发现并注册各自的 Tools，然后将它们统一暴露给 LLM 使用。</div>

<h2 id="s3">3. 通信方式</h2>
<h3>stdio（标准输入输出）</h3>
<p>Server 作为子进程启动，通过 stdin/stdout 交换 JSON-RPC 消息。适用于本地工具：</p>
<pre><code>{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/docs"]
    }
  }
}</code></pre>

<h3>HTTP + SSE（Server-Sent Events）</h3>
<p>Server 作为 HTTP 服务运行，Client 通过 SSE 接收实时消息。适用于远程工具：</p>
<pre><code>// Client → Server (HTTP POST)
POST /messages
Content-Type: application/json
{"jsonrpc":"2.0","method":"tools/call","id":1,"params":{"name":"query","arguments":{"sql":"SELECT * FROM users"}}}

// Server → Client (SSE)
data: {"jsonrpc":"2.0","id":1,"result":{"content":[{"type":"text","text":"..."}]}}</code></pre>

<h2 id="s4">4. 核心能力</h2>
<table><tr><th>能力</th><th>说明</th><th>示例</th></tr>
<tr><td><strong>Tools</strong></td><td>可被 LLM 调用的函数</td><td>搜索、计算、API 调用</td></tr>
<tr><td><strong>Resources</strong></td><td>可被读取的数据</td><td>文件内容、数据库记录</td></tr>
<tr><td><strong>Prompts</strong></td><td>预定义的提示模板</td><td>代码审查模板、翻译模板</td></tr>
<tr><td><strong>Sampling</strong></td><td>Server 请求 Host 执行 LLM 推理</td><td>递归 AI 调用</td></tr></table>

<h2 id="s5">5. MCP vs Function Calling</h2>
<table><tr><th>维度</th><th>Function Calling</th><th>MCP</th></tr>
<tr><td>标准化</td><td>各厂商 API 格式不同</td><td>统一的开放标准</td></tr>
<tr><td>可发现性</td><td>静态定义</td><td>动态发现（支持工具列表查询）</td></tr>
<tr><td>双向通信</td><td>仅 Client → Server</td><td>支持双向（Sampling）</td></tr>
<tr><td>资源管理</td><td>无</td><td>Resources API</td></tr>
<tr><td>状态管理</td><td>无状态</td><td>有状态会话</td></tr></table>

<h2 id="s6">6. 实际应用示例</h2>
<pre><code>// 一个简单的 MCP Server（Node.js）
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {name: "my-calculator", version: "1.0.0"},
  {capabilities: {tools: {}}}
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, () => ({
  tools: [{
    name: "calculate",
    description: "执行数学计算",
    inputSchema: {
      type: "object",
      properties: {expression: {type: "string"}},
      required: ["expression"]
    }
  }]
}));

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, (req) => {
  if (req.params.name === "calculate") {
    const result = eval(req.params.arguments.expression);
    return {content: [{type: "text", text: String(result)}]};
  }
});

// 启动 Server
const transport = new StdioServerTransport();
await server.connect(transport);</code></pre>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/function-calling">← 上一篇</a> <a href="/article/agent-system">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
