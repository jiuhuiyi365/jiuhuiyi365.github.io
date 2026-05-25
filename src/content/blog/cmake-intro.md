---
title: "CMake 入门指南"
date: 2026-05-25
categories: "构建工具"
tags: ["CMake","C++"]
id: "cmake-intro"
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

<div class="hero"><h1>CMake 入门指南</h1>
<div class="hero-meta"><span class="tag tag-accent">构建工具</span></div>
</div>
<div class="container">
<div class="toc"><div class="toc-title">目录</div><ul><li><a href="#s1">CMake 基本概念</a></li>
<li><a href="#s2">变量与缓存</a></li>
<li><a href="#s3">目标与依赖</a></li>
<li><a href="#s4">条件编译与选项</a></li>
<li><a href="#s5">子目录与 find_package</a></li>
<li><a href="#s6">实用技巧</a></li></ul></div>
<div class="article-content">
<h2 id="s1">1. CMake 基本概念</h2>
<p>CMake 是一个<strong>跨平台的构建系统生成器</strong>，通过 <code>CMakeLists.txt</code> 描述项目结构，生成对应平台的构建文件（Makefile、Ninja、Visual Studio 项目等）。</p>

<h3>核心工作流程</h3>
<pre><code># 1. 配置阶段：读取 CMakeLists.txt，生成构建系统
cmake -S . -B build -G "Unix Makefiles"

# 2. 构建阶段：调用底层构建工具
cmake --build build -j$(nproc)

# 3. 安装阶段（可选）
cmake --install build --prefix /usr/local</code></pre>

<h3>最小 CMakeLists.txt</h3>
<pre><code>cmake_minimum_required(VERSION 3.10)
project(MyProject VERSION 1.0 LANGUAGES CXX)

add_executable(main main.cpp)</code></pre>

<h2 id="s2">2. 变量与缓存</h2>
<p>CMake 有三种作用域的变量：</p>
<table><tr><th>类型</th><th>设置方式</th><th>作用域</th></tr>
<tr><td>普通变量</td><td><code>set(VAR value)</code></td><td>当前 CMakeLists.txt 及子目录</td></tr>
<tr><td>缓存变量</td><td><code>set(VAR value CACHE TYPE "doc")</code></td><td>全局，持久化到 CMakeCache.txt</td></tr>
<tr><td>环境变量</td><td><code>set(ENV{VAR} value)</code></td><td>当前 CMake 进程</td></tr></table>

<p>常用内置变量：</p>
<pre><code># 预定义变量
${CMAKE_SOURCE_DIR}      # 项目根目录
${CMAKE_BINARY_DIR}      # 构建输出目录
${CMAKE_CURRENT_SOURCE_DIR}  # 当前 CMakeLists.txt 所在目录
${PROJECT_NAME}          # 项目名称
${PROJECT_VERSION}       # 项目版本

# 编译器相关
${CMAKE_CXX_COMPILER}    # C++ 编译器路径
${CMAKE_CXX_STANDARD}    # C++ 标准版本
${CMAKE_BUILD_TYPE}      # 构建类型（Debug/Release/RelWithDebInfo）</code></pre>

<h2 id="s3">3. 目标与依赖</h2>
<p>CMake 的核心概念是<strong>目标（Target）</strong>——可执行文件或库。所有编译选项、链接库、头文件路径都应该通过目标属性来传递，而非全局变量。</p>

<h3>创建目标</h3>
<pre><code># 可执行文件
add_executable(myapp main.cpp utils.cpp)

# 静态库
add_library(core STATIC core.cpp parser.cpp)

# 动态库
add_library(utils SHARED utils.cpp)

# 接口库（仅传递属性，不生成文件）
add_library(compile_options INTERFACE)</code></pre>

<h3>设置目标属性</h3>
<pre><code>target_include_directories(core
    PUBLIC  include          # 使用者也需要这些头文件
    PRIVATE src              # 仅编译 core 自身需要
)

target_compile_features(core
    PUBLIC cxx_std_17        # 使用者自动继承 C++17 标准
)

target_link_libraries(myapp
    PRIVATE core             # 链接 core 库
    PUBLIC  compile_options  # 继承编译选项
)

target_compile_definitions(core
    PRIVATE VERSION="\"${PROJECT_VERSION}\""
)</code></pre>

<div class="tip-box"><div class="tip-label">PUBLIC / PRIVATE / INTERFACE</div>
<strong>PUBLIC</strong>：自身使用 + 传递给使用者<br>
<strong>PRIVATE</strong>：仅自身使用<br>
<strong>INTERFACE</strong>：不自身使用，仅传递给使用者</div>

<h2 id="s4">4. 条件编译与选项</h2>
<pre><code># 定义选项开关
option(ENABLE_TESTS "Build unit tests" ON)
option(ENABLE_ASAN  "Enable AddressSanitizer" OFF)

# 条件编译
if(ENABLE_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

# 平台判断
if(WIN32)
    target_link_libraries(myapp PRIVATE ws2_32)
elseif(UNIX)
    target_link_libraries(myapp PRIVATE pthread dl)
endif()

# 编译器判断
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
    target_compile_options(myapp PRIVATE -Wall -Wextra -Wpedantic)
elseif(MSVC)
    target_compile_options(myapp PRIVATE /W4 /WX)
endif()</code></pre>

<h2 id="s5">5. 子目录与 find_package</h2>
<h3>子目录管理</h3>
<pre><code># 项目结构：
# ├── CMakeLists.txt        (顶层)
# ├── src/
# │   └── CMakeLists.txt
# ├── include/
# └── third_party/
#     └── CMakeLists.txt

# 顶层 CMakeLists.txt
add_subdirectory(src)
add_subdirectory(third_party)</code></pre>

<h3>find_package 使用</h3>
<pre><code># 查找系统已安装的库
find_package(OpenSSL REQUIRED)
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(JSONCPP REQUIRED jsoncpp)

target_link_libraries(myapp
    PRIVATE OpenSSL::SSL OpenSSL::Crypto
    PRIVATE Threads::Threads
    PRIVATE ${JSONCPP_LIBRARIES}
)</code></pre>

<h2 id="s6">6. 实用技巧</h2>
<h3>compile_commands.json 导出</h3>
<pre><code>set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
# 或命令行: cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1 ..</code></pre>

<h3>安装规则</h3>
<pre><code>install(TARGETS myapp core
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)

install(FILES include/core.h
    DESTINATION include
)</code></pre>

<h3>自定义命令与目标</h3>
<pre><code># 生成代码
add_custom_command(
    OUTPUT  generated_parser.cpp
    COMMAND ${CMAKE_SOURCE_DIR}/tools/generate_parser.py
    ARGS    -o generated_parser.cpp grammar.txt
    DEPENDS grammar.txt tools/generate_parser.py
    COMMENT "Generating parser..."
)

add_custom_target(gen ALL DEPENDS generated_parser.cpp)</code></pre>
</div>
<div class="nav-bar"><a href="/archives">← 总目录</a><a href="/article/so-injection">上一篇</a></div>
<div class="footer">技术笔记 · 持续更新</div>
</div>
