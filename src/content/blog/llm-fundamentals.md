---
title: "LLM 基础：从 Transformer 到大语言模型的核心原理"
date: 2026-05-29
categories: "Agent"
tags: ["LLM","Transformer","大模型","注意力机制","预训练"]
id: "llm-fundamentals"
description: "详解大语言模型的核心原理，从 Transformer 架构、注意力机制、预训练与微调，到推理优化与 Agent 应用的完整知识链"
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

<div class="hero"><h1>LLM 基础：从 Transformer 到大语言模型的核心原理</h1>
<p class="subtitle">理解大语言模型背后的技术栈——架构、训练、推理与应用</p>
<div class="hero-meta"><span class="tag tag-accent">Agent</span><span class="tag">LLM</span><span class="tag">Transformer</span><span class="tag">大模型</span></div>
</div>
<div class="container">
<a class="back" href="/archives">← 总目录</a>

<div class="toc"><div class="toc-title">目录</div><ul>
<li><a href="#s1">1. 什么是 LLM</a></li>
<li><a href="#s2">2. Transformer 架构</a></li>
<li class="toc-sub"><a href="#s2-1">2.1 自注意力机制</a></li>
<li class="toc-sub"><a href="#s2-2">2.2 多头注意力</a></li>
<li class="toc-sub"><a href="#s2-3">2.3 前馈网络与残差连接</a></li>
<li class="toc-sub"><a href="#s2-4">2.4 Encoder-Decoder vs Decoder-Only</a></li>
<li><a href="#s3">3. 分词与词嵌入</a></li>
<li class="toc-sub"><a href="#s3-1">3.1 Tokenizer</a></li>
<li class="toc-sub"><a href="#s3-2">3.2 词嵌入与位置编码</a></li>
<li><a href="#s4">4. 预训练</a></li>
<li class="toc-sub"><a href="#s4-1">4.1 训练目标</a></li>
<li class="toc-sub"><a href="#s4-2">4.2 数据工程</a></li>
<li class="toc-sub"><a href="#s4-3">4.3 缩放定律</a></li>
<li><a href="#s5">5. 对齐与微调</a></li>
<li class="toc-sub"><a href="#s5-1">5.1 指令微调（SFT）</a></li>
<li class="toc-sub"><a href="#s5-2">5.2 RLHF</a></li>
<li class="toc-sub"><a href="#s5-3">5.3 DPO 与 RLHF 的替代方案</a></li>
<li><a href="#s6">6. 推理与解码策略</a></li>
<li class="toc-sub"><a href="#s6-1">6.1 自回归生成</a></li>
<li class="toc-sub"><a href="#s6-2">6.2 采样策略</a></li>
<li class="toc-sub"><a href="#s6-3">6.3 KV Cache</a></li>
<li><a href="#s7">7. 推理优化技术</a></li>
<li class="toc-sub"><a href="#s7-1">7.1 量化</a></li>
<li class="toc-sub"><a href="#s7-2">7.2 推理框架</a></li>
<li class="toc-sub"><a href="#s7-3">7.3 长上下文处理</a></li>
<li><a href="#s8">8. 大模型生态</a></li>
<li class="toc-sub"><a href="#s8-1">8.1 主流模型家族</a></li>
<li class="toc-sub"><a href="#s8-2">8.2 开源 vs 闭源</a></li>
<li><a href="#s9">9. 从 LLM 到 Agent</a></li>
</ul></div>

<div class="article-content">

<h2 id="s1">1. 什么是 LLM</h2>

<p><strong>LLM（Large Language Model，大语言模型）</strong>是一类基于 Transformer 架构、通过海量文本数据训练而成的深度学习模型。它通过学习文本中的统计规律和语义关系，具备了理解和生成自然语言的能力。</p>

<p>LLM 的核心能力：</p>
<ul>
<li><strong>文本生成</strong>：给定一段提示（Prompt），生成连贯的后续文本</li>
<li><strong>语言理解</strong>：理解语义、情感、指代关系</li>
<li><strong>推理能力</strong>：逻辑推理、数学计算、代码分析</li>
<li><strong>多任务泛化</strong>：同一个模型可以翻译、总结、问答、写代码，无需针对每个任务单独训练</li>
<li><strong>上下文学习（In-Context Learning）</strong>：通过 Prompt 中的示例学习新任务，无需微调</li>
</ul>

<div class="tip-box"><div class="tip-label">核心洞察</div>LLM 的本质是一个<strong>概率模型</strong>——给定前面的 Token 序列，预测下一个 Token 的概率分布。所有看似「智能」的行为，都是这个简单的自回归目标在大规模数据和参数下的涌现。</div>

<h2 id="s2">2. Transformer 架构</h2>

<p>Transformer 是 LLM 的基础架构，由 Vaswani 等人在 2017 年的论文《Attention Is All You Need》中提出。它彻底取代了 RNN/LSTM，成为 NLP（以及后来的多模态）领域的主导架构。</p>

<h3 id="s2-1">2.1 自注意力机制（Self-Attention）</h3>

<p>自注意力机制是 Transformer 的核心。它解决了 RNN 的根本问题：<strong>无法并行处理长序列</strong>，且长距离依赖容易丢失。</p>

<p>自注意力的计算过程：</p>
<ol>
<li>每个 Token 生成三个向量：<strong>Query（Q）</strong>、<strong>Key（K）</strong>、<strong>Value（V）</strong>，通过与权重矩阵相乘得到</li>
<li>计算每对 Token 之间的注意力分数：<code>Attention(Q, K, V) = softmax(QK^T / √d_k) V</code></li>
<li>注意力分数决定了每个 Token 在表示当前位置时应该「关注」哪些其他 Token</li>
</ol>

<p>直观理解：</p>
<ul>
<li><strong>Query</strong>：「我在找什么信息？」</li>
<li><strong>Key</strong>：「我能提供什么信息？」</li>
<li><strong>Value</strong>：「我的实际内容是什么？」</li>
<li><strong>注意力分数</strong>：Query 和 Key 的匹配程度，决定了 Value 的权重</li>
</ul>

<div class="tip-box"><div class="tip-label">例子</div>句子「猫坐在垫子上，因为它累了」中，当模型处理「它」这个词时，自注意力机制会计算「它」与每个词的注意力分数。「猫」的分数会很高，因为「它」最可能指代「猫」。这就是模型理解指代关系的方式。</div>

<h3 id="s2-2">2.2 多头注意力（Multi-Head Attention）</h3>

<p>单个注意力头只能学习一种注意力模式。多头注意力通过并行运行多个注意力头，让模型同时关注不同的语义关系：</p>
<ul>
<li>一个头可能关注语法关系（主谓宾）</li>
<li>另一个头可能关注语义相似性</li>
<li>另一个头可能关注位置邻近性</li>
</ul>

<p>多头注意力的输出是所有头的拼接后经过线性变换的结果。</p>

<h3 id="s2-3">2.3 前馈网络与残差连接</h3>

<p>Transformer 的每个层除了注意力模块，还包含：</p>
<ul>
<li><strong>前馈网络（Feed-Forward Network, FFN）</strong>：两层线性变换 + 激活函数（GELU）。注意力负责「信息聚合」，FFN 负责「信息处理」</li>
<li><strong>残差连接（Residual Connection）</strong>：将输入直接加到输出上，缓解深层网络的梯度消失问题</li>
<li><strong>层归一化（Layer Normalization）</strong>：稳定训练过程。现代 LLM 多使用 <strong>RMSNorm</strong>（去掉均值中心化，只做缩放）</li>
</ul>

<h3 id="s2-4">2.4 Encoder-Decoder vs Decoder-Only</h3>

<table><tr><th>架构</th><th>代表模型</th><th>特点</th><th>适用场景</th></tr>
<tr><td>Encoder-Decoder</td><td>T5、BART</td><td>编码器理解输入，解码器生成输出</td><td>翻译、摘要</td></tr>
<tr><td>Encoder-Only</td><td>BERT</td><td>只做理解，不做生成</td><td>分类、NER、语义匹配</td></tr>
<tr><td><strong>Decoder-Only</strong></td><td>GPT 系列、LLaMA、Claude</td><td>自回归生成，统一架构</td><td>通用语言模型（当前主流）</td></tr></table>

<p>当前几乎所有主流 LLM（GPT-4、Claude、LLaMA、Gemini）都采用 <strong>Decoder-Only</strong> 架构。原因：</p>
<ul>
<li>统一的训练目标（下一个 Token 预测）简单且可扩展</li>
<li>架构简单，工程实现更容易</li>
<li>经过海量数据训练后，Decoder-Only 模型同样能完成 Encoder-Decoder 的任务</li>
<li>自然支持自回归生成和上下文学习</li>
</ul>

<h2 id="s3">3. 分词与词嵌入</h2>

<h3 id="s3-1">3.1 Tokenizer</h3>

<p>模型处理的是 Token，不是原始文本。<strong>Tokenizer</strong> 负责将文本切分为 Token 序列。</p>

<p>常见分词算法：</p>
<table><tr><th>算法</th><th>原理</th><th>代表模型</th></tr>
<tr><td><strong>BPE（Byte Pair Encoding）</strong></td><td>从字符开始，迭代合并最频繁出现的相邻对</td><td>GPT 系列、LLaMA</td></tr>
<tr><td><strong>WordPiece</strong></td><td>类似 BPE，但基于似然而非频率选择合并</td><td>BERT</td></tr>
<tr><td><strong>SentencePiece</strong></td><td>语言无关的分词框架，支持 BPE 和 Unigram</td><td>T5、LLaMA</td></tr>
<tr><td><strong>Byte-Level BPE</strong></td><td>在字节级别而非字符级别做 BPE，支持任意语言</td><td>GPT-4、Claude</td></tr></table>

<p>分词的影响：</p>
<ul>
<li>同一个句子在不同 Tokenizer 下的 Token 数量不同，直接影响上下文窗口的有效长度</li>
<li>中文在大多数 Tokenizer 下 Token 数量比英文多（因为训练数据以英文为主，中文字符没有充分合并）</li>
<li>代码的 Token 效率通常较高（因为 BPE 能很好地合并重复的代码模式）</li>
</ul>

<h3 id="s3-2">3.2 词嵌入与位置编码</h3>

<p><strong>词嵌入（Embedding）</strong>：将每个 Token 映射为一个高维向量（通常 4096 维或更高）。语义相近的 Token 在向量空间中距离更近。</p>

<p><strong>位置编码（Positional Encoding）</strong>：自注意力机制本身不包含位置信息（置换不变性），需要额外注入位置信息。</p>
<ul>
<li><strong>绝对位置编码</strong>：原始 Transformer 使用正弦/余弦函数生成固定的位置向量</li>
<li><strong>旋转位置编码（RoPE）</strong>：通过旋转矩阵编码相对位置关系，是当前 LLM 的主流方案（LLaMA、GPT-NeoX、Qwen）</li>
<li><strong>ALiBi</strong>：在注意力分数上添加线性偏置，不需要额外的位置嵌入参数</li>
</ul>

<h2 id="s4">4. 预训练</h2>

<h3 id="s4-1">4.1 训练目标</h3>

<p>LLM 的预训练目标是<strong>自回归语言建模（Autoregressive Language Modeling）</strong>：</p>
<ul>
<li>给定前面的 Token 序列，预测下一个 Token</li>
<li>损失函数：交叉熵损失（Cross-Entropy Loss）</li>
<li>数学表达：最大化 <code>P(x_t | x_1, x_2, ..., x_{t-1})</code></li>
</ul>

<p>这个目标看似简单，但迫使模型学习：语法结构、语义关系、事实知识、推理模式、世界模型。所有涌现能力都来自这个目标函数。</p>

<h3 id="s4-2">4.2 数据工程</h3>

<p>预训练数据的质量和多样性对模型能力至关重要。典型数据来源：</p>
<ul>
<li><strong>网页数据</strong>：Common Crawl（经过清洗过滤）、Wikipedia</li>
<li><strong>书籍</strong>：BookCorpus、Gutenberg、书籍扫描数据</li>
<li><strong>代码</strong>：GitHub 开源代码、StackOverflow</li>
<li><strong>学术论文</strong>：arXiv、PubMed、Semantic Scholar</li>
<li><strong>对话数据</strong>：论坛、Reddit、社交媒体</li>
</ul>

<p>数据处理流程：</p>
<ol>
<li>去重：精确去重（URL 级别）和模糊去重（SimHash、MinHash）</li>
<li>质量过滤：去除低质量内容（乱码、广告、自动生成文本）</li>
<li>安全过滤：去除 PII（个人身份信息）、有害内容</li>
<li>数据混合（Data Mixing）：按照一定比例混合不同来源的数据</li>
</ol>

<div class="warn-box"><div class="warn-label">注意</div>数据质量比数据数量更重要。经过精心清洗的小数据集训练出的模型，可能比用大量噪声数据训练的模型效果更好。这也是为什么很多团队不愿意公开数据配方——数据工程是核心竞争力。</div>

<h3 id="s4-3">4.3 缩放定律（Scaling Laws）</h3>

<p>Kaplan et al.（2020）和 Chinchilla et al.（2022）的研究发现，模型性能与三个因素之间存在幂律关系：</p>
<ul>
<li><strong>模型参数量 N</strong></li>
<li><strong>训练数据量 D</strong></li>
<li><strong>计算量 C</strong></li>
</ul>

<p>核心结论：</p>
<ul>
<li>增加任何一个因素都能提升性能，但存在收益递减</li>
<li>最优分配：模型参数和数据量应该等比例增长（Chinchilla 定律）</li>
<li>同等计算预算下，更小的模型 + 更多数据 > 更大的模型 + 更少数据</li>
</ul>

<div class="tip-box"><div class="tip-label">实践意义</div>Chinchilla 定律推动了「小模型 + 大数据」的趋势。LLaMA 系列就是典型代表——用较少的参数但更多的 Token 数量训练，效果媲美参数量更大的模型。这也使得开源模型更容易部署到消费级硬件上。</div>

<h2 id="s5">5. 对齐与微调</h2>

<p>预训练模型虽然知识丰富，但并不「听话」。对齐（Alignment）的目标是让模型按照人类期望的方式使用这些知识。</p>

<h3 id="s5-1">5.1 指令微调（SFT）</h3>

<p><strong>Supervised Fine-Tuning（SFT）</strong>是最基本的对齐方式：</p>
<ul>
<li>准备高质量的「指令-回答」数据对</li>
<li>在预训练模型上继续训练，但只计算回答部分的损失</li>
<li>模型学会：收到指令 → 生成符合格式和期望的回答</li>
</ul>

<p>SFT 数据的质量关键在于：</p>
<ul>
<li><strong>多样性</strong>：覆盖各种任务类型（问答、总结、翻译、代码、推理等）</li>
<li><strong>准确性</strong>：回答必须正确，否则模型会学习错误知识</li>
<li><strong>风格一致性</strong>：回答风格统一（详细程度、格式、语气）</li>
</ul>

<h3 id="s5-2">5.2 RLHF</h3>

<p><strong>RLHF（Reinforcement Learning from Human Feedback）</strong>通过人类偏好信号进一步优化模型：</p>
<ol>
<li><strong>收集偏好数据</strong>：对同一个问题，模型生成多个回答，人类标注哪个更好</li>
<li><strong>训练奖励模型（Reward Model）</strong>：学习人类的偏好排序</li>
<li><strong>PPO 优化</strong>：用强化学习（PPO 算法）调整语言模型，使其生成的回答能得到更高的奖励分数</li>
</ol>

<p>RLHF 解决的问题：有些回答虽然语法正确、信息准确，但人类就是不喜欢（太啰嗦、太机械、不安全等）。这些微妙的偏好很难用监督学习表达，但可以通过人类对比标注来学习。</p>

<h3 id="s5-3">5.3 DPO 与 RLHF 的替代方案</h3>

<p>RLHF 的 PPO 阶段复杂且不稳定，近年出现了替代方案：</p>

<table><tr><th>方法</th><th>原理</th><th>优势</th></tr>
<tr><td><strong>DPO（Direct Preference Optimization）</strong></td><td>直接从偏好数据优化策略，不需要单独训练奖励模型</td><td>实现简单、训练稳定</td></tr>
<tr><td><strong>RLAIF</strong></td><td>用 AI 替代人类做偏好标注</td><td>成本更低、可扩展</td></tr>
<tr><td><strong>KTO（Kahneman-Tversky Optimization）</strong></td><td>只需要「好/坏」二元标签，不需要对比对</td><td>数据要求更低</td></tr>
<tr><td><strong>GRPO（Group Relative Policy Optimization）</strong></td><td>DeepSeek 提出，基于组内相对优势优化</td><td>在推理任务上效果突出</td></tr></table>

<h2 id="s6">6. 推理与解码策略</h2>

<h3 id="s6-1">6.1 自回归生成</h3>

<p>LLM 的推理过程是<strong>逐个 Token 生成</strong>的：</p>
<ol>
<li>将输入文本编码为 Token 序列</li>
<li>模型前向传播，得到下一个 Token 的概率分布</li>
<li>从概率分布中采样一个 Token</li>
<li>将新 Token 追加到序列中，重复步骤 2-3</li>
<li>直到生成结束标记（EOS）或达到最大长度</li>
</ol>

<p>每生成一个 Token 都需要一次完整的模型前向传播，这就是为什么长文本生成比处理慢得多。</p>

<h3 id="s6-2">6.2 采样策略</h3>

<table><tr><th>策略</th><th>参数</th><th>效果</th></tr>
<tr><td><strong>Greedy</strong></td><td>无</td><td>每次选概率最高的 Token。输出确定但可能重复</td></tr>
<tr><td><strong>Temperature</strong></td><td>0.0-2.0</td><td>控制随机性。低温度趋近 Greedy，高温度更随机</td></tr>
<tr><td><strong>Top-K</strong></td><td>K 值</td><td>只从概率最高的 K 个 Token 中采样</td></tr>
<tr><td><strong>Top-P（Nucleus）</strong></td><td>P 值（0-1）</td><td>从累积概率达到 P 的最小 Token 集合中采样</td></tr>
<tr><td><strong>Repetition Penalty</strong></td><td>&gt;1.0</td><td>降低已出现 Token 的概率，减少重复</td></tr></table>

<div class="tip-box"><div class="tip-label">推荐设置</div>创意写作：Temperature 0.7-0.9 + Top-P 0.9。代码生成：Temperature 0.0-0.2（确定性优先）。事实问答：Temperature 0.0-0.3。</div>

<h3 id="s6-3">6.3 KV Cache</h3>

<p>自回归生成中，每一步都需要计算所有之前 Token 的 Key 和 Value。如果不做缓存，每次生成都要重新计算整个序列的注意力，极其低效。</p>

<p><strong>KV Cache</strong>：缓存已经计算过的 Key 和 Value 向量，每步只需要计算新 Token 的 Q、K、V，然后与缓存拼接。</p>

<p>KV Cache 的挑战：</p>
<ul>
<li>显存占用随序列长度线性增长，是长上下文推理的主要瓶颈</li>
<li>每个注意力头的每个层都需要独立缓存</li>
<li><strong>GQA（Grouped Query Attention）</strong>和 <strong>MQA（Multi-Query Attention）</strong>通过减少 KV 头的数量来减少缓存大小</li>
</ul>

<h2 id="s7">7. 推理优化技术</h2>

<h3 id="s7-1">7.1 量化</h3>

<p>将模型权重从高精度（FP32/FP16）转换为低精度（INT8/INT4/FP8），减少显存占用和计算量。</p>

<table><tr><th>量化方式</th><th>精度</th><th>显存节省</th><th>质量损失</th></tr>
<tr><td>FP16</td><td>16-bit</td><td>基准</td><td>几乎无</td></tr>
<tr><td>INT8（W8A8）</td><td>8-bit</td><td>~50%</td><td>极小</td></tr>
<tr><td>INT4（GPTQ/AWQ）</td><td>4-bit</td><td>~75%</td><td>轻微可接受</td></tr>
<tr><td>FP8</td><td>8-bit</td><td>~50%</td><td>极小</td></tr></table>

<p>常用量化工具：</p>
<ul>
<li><strong>GPTQ</strong>：基于逐层量化的后训练量化方法</li>
<li><strong>AWQ（Activation-Aware Weight Quantization）</strong>：考虑激活值分布的量化方法，效果优于 GPTQ</li>
<li><strong>GGUF/GGML</strong>：llama.cpp 使用的量化格式，支持 CPU 推理</li>
<li><strong>bitsandbytes</strong>：HuggingFace 生态中的量化库</li>
</ul>

<h3 id="s7-2">7.2 推理框架</h3>

<table><tr><th>框架</th><th>特点</th><th>适用场景</th></tr>
<tr><td><strong>vLLM</strong></td><td>PagedAttention、连续批处理、高吞吐</td><td>API 服务、高并发场景</td></tr>
<tr><td><strong>llama.cpp</strong></td><td>C/C++ 实现、CPU/GPU 混合推理、GGUF 格式</td><td>本地部署、边缘设备</td></tr>
<tr><td><strong>TensorRT-LLM</strong></td><td>NVIDIA 官方、极致 GPU 优化</td><td>NVIDIA GPU 上的生产部署</td></tr>
<tr><td><strong>ollama</strong></td><td>一行命令启动、本地运行</td><td>个人使用、快速原型</td></tr>
<tr><td><strong>SGLang</strong></td><td>结构化生成、RadixAttention</td><td>Agent 应用、复杂 Prompt</td></tr></table>

<h3 id="s7-3">7.3 长上下文处理</h3>

<p>将上下文窗口从 4K 扩展到 100K+ 需要解决几个问题：</p>
<ul>
<li><strong>位置编码外推</strong>：RoPE 的频率缩放（NTK-aware Scaling）、YaRN</li>
<li><strong>KV Cache 优化</strong>：StreamingLLM（保留注意力汇聚点）、H2O（Heavy Hitter Oracle）</li>
<li><strong>注意力机制改进</strong>：Ring Attention（分布式长序列）、Flash Attention（IO 优化的精确注意力）</li>
<li><strong>分层注意力</strong>：将长序列分块处理，不同层使用不同的注意力范围</li>
</ul>

<h2 id="s8">8. 大模型生态</h2>

<h3 id="s8-1">8.1 主流模型家族</h3>

<table><tr><th>模型</th><th>开发方</th><th>架构特点</th></tr>
<tr><td><strong>GPT-4 / GPT-4o</strong></td><td>OpenAI</td><td>多模态、MoE（疑似）、最强推理能力之一</td></tr>
<tr><td><strong>Claude 3.5 / Claude 4</strong></td><td>Anthropic</td><td>长上下文（200K）、安全性、Agent 能力</td></tr>
<tr><td><strong>Gemini</strong></td><td>Google DeepMind</td><td>原生多模态、超长上下文（1M+）</td></tr>
<tr><td><strong>LLaMA 3</strong></td><td>Meta</td><td>开源、高质量、多种尺寸（8B-405B）</td></tr>
<tr><td><strong>Mixtral</strong></td><td>Mistral AI</td><td>MoE 架构、高效率</td></tr>
<tr><td><strong>DeepSeek</strong></td><td>深度求索</td><td>开源、MoE、推理模型（DeepSeek-R1）</td></tr>
<tr><td><strong>Qwen</strong></td><td>阿里通义</td><td>开源、多模态、中文优化</td></tr></table>

<h3 id="s8-2">8.2 开源 vs 闭源</h3>

<table><tr><th>维度</th><th>开源（LLaMA、Qwen、DeepSeek）</th><th>闭源（GPT-4、Claude）</th></tr>
<tr><td>成本</td><td>自行部署，GPU 成本可控</td><td>按 Token 计费</td></tr>
<tr><td>数据安全</td><td>数据不出本地</td><td>数据发送到第三方服务器</td></tr>
<tr><td>定制化</td><td>可微调、可修改架构</td><td>只能通过 Prompt 工程</td></tr>
<tr><td>性能</td><td>快速追赶，部分领域已持平</td><td>目前仍有优势（推理、长上下文）</td></tr>
<tr><td>部署难度</td><td>需要 GPU 集群或量化到消费级硬件</td><td>API 调用即可</td></tr></table>

<h2 id="s9">9. 从 LLM 到 Agent</h2>

<p>LLM 从「文本生成器」进化为「Agent」的关键在于赋予它<strong>使用工具和执行动作</strong>的能力。</p>

<p>Agent 的核心组件：</p>
<ul>
<li><strong>LLM 核心</strong>：负责理解和推理</li>
<li><strong>工具调用（Tool Use）</strong>：让模型能够调用外部工具（搜索、代码执行、API 调用）</li>
<li><strong>记忆系统</strong>：短期记忆（上下文窗口）和长期记忆（向量数据库、文件系统）</li>
<li><strong>规划能力</strong>：将复杂任务分解为子任务，制定执行计划</li>
<li><strong>行动执行</strong>：通过代码、API、操作界面与环境交互</li>
</ul>

<p>Agent 框架：</p>
<ul>
<li><strong>LangChain / LangGraph</strong>：灵活的 Agent 编排框架</li>
<li><strong>CrewAI</strong>：多 Agent 协作框架</li>
<li><strong>AutoGPT / Open Interpreter</strong>：自主执行任务的 Agent</li>
<li><strong>Anthropic Claude Code</strong>：代码领域的 Agent，基于 Claude 模型</li>
<li><strong>OpenAI Assistants API</strong>：云端 Agent 服务</li>
</ul>

<div class="tip-box"><div class="tip-label">趋势</div>2024-2025 年 LLM 的发展方向已经从「更大的模型」转向「更强的 Agent 能力」。模型的推理能力（Reasoning）、工具使用能力（Tool Use）、多步骤规划能力（Planning）成为新的竞争焦点。DeepSeek-R1、Claude 的 extended thinking、OpenAI o1/o3 都体现了这一趋势。</div>

<div class="footer">如果这篇文章对你有帮助，欢迎分享给更多人</div>

</div></div>
