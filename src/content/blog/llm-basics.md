---
title: "大模型基本原理"
date: 2026-05-25
categories: "Agent"
tags: ["AI","LLM","Transformer"]
id: "llm-basics"
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

<div class="hero"><h1>大模型基本原理</h1>
<div class="hero-meta"><span class="tag tag-accent">Agent</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">Transformer 架构</a></li>
<li><a href="#s2">自回归生成</a></li>
<li><a href="#s3">Token 与分词</a></li>
<li><a href="#s4">费用计算</a></li>
<li><a href="#s5">关键参数说明</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. Transformer 架构</h2>
<p>2017 年 Google 团队在论文 <em>Attention Is All You Need</em> 中提出了 Transformer 架构，彻底取代了 RNN/LSTM 在 NLP 领域的统治地位。核心组件包括：</p>
<ul>
<li><strong>Self-Attention（自注意力）</strong>：计算序列中每个位置与其他所有位置的相关性，实现全局信息捕获</li>
<li><strong>Multi-Head Attention（多头注意力）</strong>：多个注意力头并行运算，捕获不同维度的依赖关系</li>
<li><strong>FFN（前馈神经网络）</strong>：两层全连接网络，引入非线性变换</li>
<li><strong>Residual Connection + LayerNorm</strong>：残差连接缓解梯度消失，层归一化稳定训练</li>
</ul>

<h3>注意力计算公式</h3>
<pre><code>Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V

# 其中 d_k 为 Key 的维度，缩放因子防止 softmax 梯度消失
# Q = X·W_Q,  K = X·W_K,  V = X·W_V</code></pre>

<h3>主流架构变体</h3>
<table><tr><th>架构</th><th>代表模型</th><th>特点</th></tr>
<tr><td>Encoder-Only</td><td>BERT, RoBERTa</td><td>双向注意力，适合分类/NER</td></tr>
<tr><td>Decoder-Only</td><td>GPT, Claude, LLaMA</td><td>因果注意力（Causal Mask），自回归生成</td></tr>
<tr><td>Encoder-Decoder</td><td>T5, BART</td><td>编码理解 + 解码生成，适合翻译/摘要</td></tr></table>

<div class="tip-box"><div class="tip-label">提示</div>理解 Transformer 并非使用大模型的必要条件，但有助于更好地设计 Prompt 和理解模型行为边界。</div>

<h2 id="s2">2. 自回归生成</h2>
<p>当前主流 LLM（GPT-4, Claude, LLaMA 等）均采用<strong>自回归（Autoregressive）生成</strong>方式：逐 Token 预测下一个词的概率分布，然后采样一个 Token，将其拼接到输入后继续预测。</p>

<h3>生成过程示例</h3>
<pre><code>输入: "今天天气"
Step 1: P("真"|今天天气) = 0.35, P("好"|今天天气) = 0.42, ...
        采样 → "好"
Step 2: P("。"|今天天气好) = 0.5, P("，"|今天天气好) = 0.3, ...
        采样 → "。"
输出: "今天天气好。"</code></pre>

<h3>采样策略</h3>
<table><tr><th>参数</th><th>效果</th><th>推荐场景</th></tr>
<tr><td><code>temperature=0</code></td><td>贪心解码，每次选概率最高的词</td><td>代码生成、精确任务</td></tr>
<tr><td><code>temperature=0.3~0.7</code></td><td>较稳定，有一定随机性</td><td>通用对话、问答</td></tr>
<tr><td><code>temperature=0.7~1.0</code></td><td>高创造性，输出多样</td><td>写作、头脑风暴</td></tr>
<tr><td><code>top_p=0.9</code></td><td>Nucleus 采样，只从概率前 90% 中选</td><td>控制输出质量</td></tr>
<tr><td><code>top_k=50</code></td><td>只从概率前 50 个词中选</td><td>限制离谱输出</td></tr></table>

<h2 id="s3">3. Token 与分词</h2>
<p>LLM 不直接处理字符，而是将文本切分为 <strong>Token</strong>（词片段）。主流分词方案：</p>
<ul>
<li><strong>BPE（Byte Pair Encoding）</strong>：GPT 系列使用，从字符级开始逐步合并高频对</li>
<li><strong>SentencePiece</strong>：Google/Claude/LLaMA 使用，支持无监督分词，中日韩表现好</li>
<li><strong>WordPiece</strong>：BERT 使用，类似 BPE 但使用似然而非频率</li>
</ul>

<h3>Token 数量估算</h3>
<table><tr><th>语言</th><th>近似比例</th><th>示例</th></tr>
<tr><td>英文</td><td>~4 字符 = 1 Token</td><td>"Hello world" ≈ 2 Token</td></tr>
<tr><td>中文</td><td>~1-2 汉字 = 1 Token</td><td>"你好世界" ≈ 3-4 Token</td></tr>
<tr><td>代码</td><td>~3-5 字符 = 1 Token</td><td>取决于语法复杂度</td></tr></table>

<div class="warn-box"><div class="warn-label">注意</div>中文 Token 消耗约为英文的 2-3 倍，直接影响 API 费用和上下文窗口的有效长度。</div>

<h2 id="s4">4. 费用计算</h2>
<pre><code>总费用 = (输入Token数 × 输入单价) + (输出Token数 × 输出单价)

# 以 GPT-4o 为例（2024 价格）：
# 输入: $2.50 / 1M tokens
# 输出: $10.00 / 1M tokens</code></pre>

<h2 id="s5">5. 关键参数说明</h2>
<table><tr><th>参数</th><th>说明</th><th>默认值</th></tr>
<tr><td><code>max_tokens</code></td><td>最大输出 Token 数</td><td>模型相关</td></tr>
<tr><td><code>temperature</code></td><td>输出随机性（0-2）</td><td>1.0</td></tr>
<tr><td><code>top_p</code></td><td>Nucleus 采样阈值</td><td>1.0</td></tr>
<tr><td><code>frequency_penalty</code></td><td>重复惩罚（-2~2）</td><td>0</td></tr>
<tr><td><code>presence_penalty</code></td><td>新话题鼓励（-2~2）</td><td>0</td></tr>
<tr><td><code>stop</code></td><td>停止序列</td><td>无</td></tr></table>
</div>
<div class="nav-bar"><a href="/article/ai-core-concepts">← 总览</a><a href="/article/prompt-engineering">下一篇 →</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
