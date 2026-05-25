---
title: "解决 Kali Linux 无法 git clone 的问题"
date: 2026-05-25
categories: "Linux"
tags: ["Linux","Git"]
id: "kali-git-clone-fix"
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

<div class="hero"><h1>解决 Kali Linux 无法 git clone 的问题</h1>
<div class="hero-meta"><span class="tag tag-accent">Linux问题解决</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">问题现象</a></li>
<li><a href="#s2">DNS 配置优化</a></li>
<li><a href="#s3">使用 SSH 替代 HTTPS</a></li>
<li><a href="#s4">配置 Git 代理</a></li>
<li><a href="#s5">GnuTLS 错误修复</a></li>
<li><a href="#s6">使用镜像加速</a></li>
<li><a href="#s7">排查总结</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. 问题现象</h2>
<p>在 Kali Linux 中执行 <code>git clone</code> 时，可能遇到以下错误：</p>
<pre><code>fatal: unable to access 'https://github.com/.../repo.git/':
GnuTLS recv error (-110): The TLS connection was non-properly terminated.

# 或
error: RPC failed; curl 28 OpenSSL SSL_read: Connection was reset

# 或
Cloning into 'repo'...
fatal: unable to access '...': Failed to connect to github.com port 443:
Connection timed out</code></pre>
<p>这些问题在 Kali Linux（国内网络环境）中非常常见，主要由以下原因导致：</p>
<ul>
<li>DNS 解析被污染或超时</li>
<li>GitHub 的 HTTPS 端口（443）被墙</li>
<li>Git 底层使用的 GnuTLS 库与服务器不兼容</li>
<li>系统代理配置缺失</li>
</ul>

<h2 id="s2">2. DNS 配置优化</h2>
<p>修改 <code>/etc/resolv.conf</code> 使用可靠的 DNS 服务器：</p>
<pre><code># 备份原始配置
sudo cp /etc/resolv.conf /etc/resolv.conf.bak

# 写入新的 DNS 配置
sudo tee /etc/resolv.conf << 'EOF'
nameserver 8.8.8.8
nameserver 114.114.114.114
nameserver 223.5.5.5
EOF</code></pre>
<div class="warn-box"><div class="warn-label">注意</div>Kali Linux 使用 NetworkManager 管理网络，重启后 <code>/etc/resolv.conf</code> 可能被还原。如需永久修改，编辑 <code>/etc/NetworkManager/NetworkManager.conf</code> 并添加 <code>dns=none</code>。</div>

<h2 id="s3">3. 使用 SSH 替代 HTTPS</h2>
<p>HTTPS 协议（443 端口）容易被干扰，而 SSH 协议（22 端口）通常可用：</p>
<pre><code># 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 将公钥添加到 GitHub
cat ~/.ssh/id_ed25519.pub
# 复制内容 → GitHub Settings → SSH and GPG keys → New SSH key

# 3. 测试连接
ssh -T git@github.com

# 4. 使用 SSH 地址克隆
git clone git@github.com:user/repo.git</code></pre>
<p>若 22 端口也被封，可尝试使用 443 端口：</p>
<pre><code># 编辑 ~/.ssh/config
Host github.com
    Hostname ssh.github.com
    Port 443
    User git</code></pre>

<h2 id="s4">4. 配置 Git 代理</h2>
<p>如果本地有代理（如 Clash、V2Ray），可为 Git 单独配置：</p>
<pre><code># HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:7891
git config --global https.proxy socks5://127.0.0.1:7891

# 仅对 GitHub 使用代理
git config --global http.https://github.com.proxy http://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy</code></pre>

<h2 id="s5">5. GnuTLS 错误修复</h2>
<p>如果遇到 <code>GnuTLS recv error (-110)</code>，可以将 Git 的 HTTP 后端从 GnuTLS 切换为 OpenSSL：</p>
<pre><code># 卸载系统自带的 git，从源码编译（使用 OpenSSL）
sudo apt remove git -y
sudo apt install -y build-essential libssl-dev libcurl4-openssl-dev \
    libexpat1-dev gettext libz-dev

cd /tmp
wget https://www.kernel.org/pub/software/scm/git/git-2.43.0.tar.gz
tar xzf git-2.43.0.tar.gz
cd git-2.43.0
make prefix=/usr/local all -j$(nproc) CURLDIR=/usr NO_GNUTLS=1
sudo make prefix=/usr/local install</code></pre>

<h2 id="s6">6. 使用镜像加速</h2>
<p>对于 GitHub 仓库，可以使用国内镜像加速克隆：</p>
<pre><code># GitHub 镜像（地址经常变动，需要搜索最新可用的）
git clone https://gitclone.com/github.com/user/repo.git
git clone https://ghproxy.com/https://github.com/user/repo.git

# 克隆后修改 remote 为原始地址
cd repo
git remote set-url origin https://github.com/user/repo.git</code></pre>

<h2 id="s7">7. 排查总结</h2>
<table><tr><th>现象</th><th>可能原因</th><th>解决方法</th></tr>
<tr><td>Connection timed out</td><td>网络不通/DNS污染</td><td>换DNS/用代理/用SSH</td></tr>
<tr><td>GnuTLS recv error</td><td>GnuTLS 库问题</td><td>重编译 Git 用 OpenSSL</td></tr>
<tr><td>RPC failed curl 28</td><td>网络不稳定/缓冲区不足</td><td><code>git config --global http.postBuffer 524288000</code></td></tr>
<tr><td>443 Connection refused</td><td>HTTPS 端口被封</td><td>用 SSH 代替/配代理</td></tr>
<tr><td>SSL certificate problem</td><td>系统时间不对/证书过期</td><td><code>sudo ntpdate time.windows.com</code></td></tr></table>
</div>
<div class="nav-bar"><a href="/archives">← 总目录</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
