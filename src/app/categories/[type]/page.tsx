import Link from 'next/link';
import { notFound } from 'next/navigation';

const categories: Record<string, { icon: string; title: string; subtitle: string; intro: string; types: string; tools: string; realWorld: string; levels: number[] }> = {
  crypto: {
    icon: '🔐', title: '密码学', subtitle: 'Cryptography — 从古典密码到现代加密',
    intro: '在 CTF 比赛中，密码学（Crypto）题目考察选手对加密算法的理解和破解能力。题目通常给出一段密文和加密提示，你需要找到正确的解密方法还原出明文 flag。密码学是大多数新手最先接触的 CTF 方向，因为它不依赖复杂的系统环境——只要有纸笔和逻辑推理就能入门。',
    types: 'CTF 密码学题目主要分为几类：\n\n• 古典密码：凯撒密码、栅栏密码、维吉尼亚密码、培根密码等，靠替换或换位实现加密，用频率分析或暴力枚举即可破解\n• 编码方式：Base64、Base32、摩尔斯电码、ASCII/Hex/URL 编码等，本身不是加密但常用来混淆信息\n• 现代密码：AES、DES、RSA、ECC 等，涉及复杂的数学运算，CTF 中通常考察对算法弱点的利用而非直接破解\n• 自定义加密：题目作者自己设计的加密算法，需要逆向分析加密逻辑来找到解密方法\n\n在冒险岛中，你将从前两种开始，逐步建立密码学的思维框架。',
    tools: '常用工具：\n• CyberChef（在线编解码神器，支持组合操作）\n• Python（自己写脚本处理复杂的编解码逻辑）\n• 在线工具：dcode.fr、quipqiup（古典密码自动破解）\n• 冒险岛内置工具：凯撒、Base64、摩尔斯、栅栏、Vigenère、解码流水线',
    realWorld: '密码学并非只存在于比赛中。你每天使用的 HTTPS、Wi-Fi 密码、手机解锁、银行转账，底层都是密码学在保护。2013 年斯诺登揭露的美国全球监控计划，正是利用了加密协议的漏洞。2024 年，中国量子计算机"祖冲之号"在公钥密码破解上取得突破性进展——密码学的发展直接关系到国家安全。',
    levels: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  misc: {
    icon: '🧩', title: '杂项', subtitle: 'Miscellaneous — 在细节中发现秘密',
    intro: '在 CTF 比赛中，杂项（Misc）是一个"大杂烩"式的分类——所有不属于密码学、Web、逆向、Pwn 的题目都可能归入此类。杂项题目考察的是选手的观察力、想象力和对各种数据格式的理解能力。它没有固定的解题套路，每一道题都可能是一次全新的探索。',
    types: '常见杂项题型：\n\n• 隐写术（Steganography）：将信息隐藏在图片、音频、视频、甚至文本的空白字符中。图片 EXIF 元数据、LSB 最低位隐写是最常见的考点\n• 流量分析（Traffic Analysis）：分析网络通信数据包（PCAP 文件），从中提取传输的文件、密码或 flag\n• 文件分析：通过十六进制编辑器查看文件真实内容，识别被篡改扩展名的文件，修复损坏的文件头\n• 编码与加密混淆：Base64 套娃、与佛论禅、核心价值观编码等各种奇怪的编码方式\n• 取证（Forensics）：内存镜像分析、磁盘镜像取证、日志分析等\n\n在冒险岛中，你将体验前三种：EXIF 隐写、LSB 隐写和流量包分析。',
    tools: '常用工具：\n• 隐写：Stegsolve（图片通道分析）、binwalk（文件提取）、strings（字符串提取）\n• 流量：Wireshark（PCAP 分析）、NetworkMiner\n• 文件：010 Editor、HxD（十六进制编辑）、file 命令（Linux）\n• 取证：Volatility（内存分析）、Autopsy（磁盘取证）\n• 冒险岛内置工具：EXIF 查看器、LSB 提取器、Strings、Hex Viewer、流量包分析器',
    realWorld: '杂项技能在现实中非常实用。2018 年，安全研究员通过分析一张 Instagram 照片的 EXIF GPS 数据，定位了一名在逃黑客的行踪。2022 年，研究人员从一张被裁剪的泄密文档截图中，通过分析背景纹理恢复了被裁掉的文字——这就是隐写思维的现实应用。网络流量分析则是企业安全运营中心（SOC）的日常工作，每天从海量流量中发现异常行为。',
    levels: [9, 10, 11],
  },
  web: {
    icon: '🌐', title: 'Web 安全', subtitle: 'Web Security — 网站应用的攻防艺术',
    intro: 'Web 安全是 CTF 中最热门的题型之一，也是最贴近日常生活的安全领域。你每天浏览的网站、登录的 App、输入的密码——每一个环节都可能存在安全漏洞。Web 安全题目通常搭建一个模拟的网站环境，你需要找到并利用其中的漏洞来获取 flag。',
    types: 'OWASP Top 10（十大 Web 安全风险）是 Web 安全的经典框架：\n\n• 信息泄露：敏感信息写在 HTML 注释、JS 源码、robots.txt 等前端可见位置\n• 身份认证绕过：通过修改 Cookie、JWT Token 来伪装成其他用户\n• 路径遍历/文件包含：利用 ../ 跳出预期目录，读取服务器上的任意文件\n• SQL 注入：在输入框中注入恶意 SQL 语句，操纵数据库\n• XSS（跨站脚本）：在页面中注入恶意 JavaScript，窃取其他用户的 Cookie\n• CSRF（跨站请求伪造）：利用用户已登录的身份，诱导其执行非预期操作\n• SSRF（服务端请求伪造）：利用服务器发起内网请求\n\n在冒险岛中，你将在 Eclipse 的博客系统中体验前三类漏洞。',
    tools: '常用工具：\n• Burp Suite（Web 安全测试标配，拦截和修改 HTTP 请求）\n• 浏览器开发者工具（F12）：查看源码、Cookie、网络请求\n• sqlmap（SQL 注入自动化工具）\n• dirsearch/gobuster（目录扫描，发现隐藏路径）\n• 冒险岛内置工具：源码智能分析、Cookie 编辑器、HTTP 请求构造器',
    realWorld: 'Web 安全漏洞的破坏力不容小觑。2017 年，Equifax 因一个路径遍历漏洞被攻击，1.47 亿美国人的社保号泄露，CEO 引咎辞职，公司被罚 7 亿美元。2018 年，Facebook 因一个访问控制漏洞导致 5000 万用户数据泄露。2021 年，Log4j 漏洞（Log4Shell）被评为"互联网史上最严重漏洞"，影响了全球数百万台服务器。每一行代码都可能成为攻击入口。',
    levels: [12, 13, 14, 15],
  },
  re: {
    icon: '🔧', title: '逆向工程', subtitle: 'Reverse Engineering — 理解程序的内部世界',
    intro: '逆向工程（RE）是指从编译好的可执行程序反推出源代码逻辑的过程。在 CTF 中，逆向题通常给你一个程序文件（Linux ELF 或 Windows EXE），你需要分析它来找到隐藏的 flag——可能是硬编码在程序中的字符串，也可能需要通过输入正确的密码来触发。',
    types: '逆向分析的主要方法：\n\n• 静态分析——不运行程序，直接"读"代码\n  - Strings 提取：从二进制文件中提取所有可读字符串，密码、密钥、flag 往往在此\n  - 反汇编：将机器码翻译为汇编语言，分析程序执行流程\n  - 反编译：将机器码还原为近似 C 代码（Ghidra、IDA Pro 等工具）\n• 动态分析——运行程序，观察其行为\n  - 调试器（gdb、x64dbg）：单步执行、查看内存、修改寄存器\n  - 系统调用监控（strace/ltrace）：追踪程序的系统调用和库函数调用\n• XOR 分析——逆向中最常见的简单加密方式，利用 A⊕B⊕B=A 的特性\n\n在冒险岛中，你将使用 Strings 工具和 XOR 分析器进行静态分析。',
    tools: '常用工具：\n• IDA Pro / Ghidra（反汇编+反编译，行业标准）\n• x64dbg / gdb（动态调试器）\n• radare2 / rizin（命令行逆向框架）\n• Detect It Easy（文件类型和壳识别）\n• 冒险岛内置工具：Strings 提取器、十六进制查看器、文件类型识别、XOR 分析器',
    realWorld: '逆向工程在安全领域有广泛的应用：恶意软件分析（安全公司每天收到数万个新病毒样本，需要逆向分析其行为）、漏洞挖掘（通过对软件逆向分析来发现未知漏洞）、游戏外挂与反外挂（外挂作者逆向游戏客户端，反外挂系统逆向分析外挂行为）。2010 年，Stuxnet 蠕虫就是通过逆向工程被发现——研究人员破解了其加密逻辑，确认了它是针对伊朗核设施的精确打击武器。',
    levels: [16, 17, 18],
  },
  pwn: {
    icon: '💻', title: '二进制漏洞利用', subtitle: 'Pwn — 突破程序的边界',
    intro: 'Pwn（发音类似"砰"）是 CTF 中技术门槛最高的方向。它的目标是通过利用程序的内存漏洞，让程序执行你预设的代码——本质上就是"黑掉"这个程序。Pwn 需要理解 C 语言、汇编、操作系统内存管理、Linux 命令行等多层知识，是安全研究员的终极技能之一。',
    types: 'Pwn 的核心漏洞类型：\n\n• 栈溢出（Stack Buffer Overflow）：输入超长字符串覆盖函数的返回地址，让程序跳转到攻击者控制的位置——这是最经典的 Pwn 漏洞\n• 堆漏洞（Heap Exploitation）：利用动态内存分配（malloc/free）的漏洞，篡改堆管理数据结构\n• 格式化字符串（Format String）：利用 printf 等函数的 %n、%s 格式符泄露或修改内存\n• ROP（Return-Oriented Programming）：在程序已有的代码中寻找以 ret 结尾的片段（gadget），拼接成攻击链\n• Shellcode：直接注入机器码，让程序执行 /bin/sh 等命令来获得 Shell\n• 整数溢出（Integer Overflow）：利用整数运算的溢出导致分配过小的缓冲区\n\n在冒险岛的终局关卡中，你将体验 Pwn 最基础的应用：利用逆向分析找到的后门激活码来获取系统控制权——这是真实渗透测试中最理想的场景。',
    tools: '常用工具：\n• pwntools（Python 攻击脚本框架，Pwn 选手的瑞士军刀）\n• gdb + pwndbg/peda（带 Pwn 增强插件的调试器）\n• checksec（检查程序的安全保护机制）\n• ROPgadget / ropper（搜索 ROP 指令片段）\n• IDA Pro / Ghidra（静态分析辅助）\n• 冒险岛内置：WebSocket 终端（终局关卡）',
    realWorld: 'Pwn 漏洞的现实影响堪称灾难级别。2014 年的 Heartbleed 漏洞（CVE-2014-0160）是 OpenSSL 中的一个缓冲区越界读取漏洞，攻击者可以每次泄露 64KB 服务器内存，包括私钥、密码等敏感数据——全球 17% 的安全网站受影响。2017 年的 WannaCry 勒索病毒利用 Windows 的 EternalBlue 漏洞（缓冲区溢出），在 24 小时内感染了 150 个国家的 23 万台计算机，造成至少 40 亿美元损失。学习 Pwn 的目的不是成为攻击者，而是理解程序的底层机制，写出更安全的代码。',
    levels: [21],
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const cat = categories[type];
  if (!cat) notFound();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <p className="text-5xl mb-4">{cat.icon}</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat.title}</h1>
        <p className="text-gray-500">{cat.subtitle}</p>
      </div>

      <section className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">📖 简介</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{cat.intro}</p>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🏷️ 常见题型</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{cat.types}</p>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🛠️ 常用工具</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{cat.tools}</p>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🌍 现实案例</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{cat.realWorld}</p>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🎮 相关关卡</h2>
        <div className="flex gap-2 flex-wrap">
          {cat.levels.map((id) => (
            <Link
              key={id}
              href={`/levels/${id}`}
              className="text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              第 {id} 关 →
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center mt-8">
        <Link href="/" className="btn-secondary text-sm">← 返回首页</Link>
      </div>
    </div>
  );
}
