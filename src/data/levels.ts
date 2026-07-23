export type CTFCategory = 'crypto' | 'misc' | 'web' | 're' | 'pwn' | 'story';

export interface Level {
  id: number;
  title: string;
  category: CTFCategory[];
  description: string;        // 剧情文字
  content: string;             // 题目内容展示
  flagHash: string;            // flag 的 SHA-256（不存明文）
  hints: string[];             // 提示列表（空数组 = 无提示）
  tools: string[];             // 推荐使用的内置工具
  challengeType: string;       // 题目子类型：caesar / base64 / morse / image / webshell 等
  downloadFiles?: string[];    // 可下载的附件文件名
  webChallengeUrl?: string;    // Web 题的内嵌页面路径
  knowledge?: {               // 科普知识卡片
    title: string;
    content: string;
  };
}

// ⚠️ 此处 flagHash 需要运行 hashFlag 工具生成
// 现阶段先用占位符，Phase 3 制作关卡时再填入真实哈希

export const levels: Level[] = [
  // ===== Phase 1: 密码学入门 =====
  {
    id: 0,
    title: '启程',
    category: ['story'],
    description: '网络安全联盟向你发来了一封任务邀请函。在正式开始追踪 Eclipse 之前，需要先找到你的调查员凭证。',
    content: '提示系统说明：\n💡 提示 1：提供解题思路和方向，不会直接给答案\n💡 提示 2：给出更具体的解法步骤，实在卡住了再点开\n\n每关都有两个提示，默认隐藏。尝试自己思考，享受解谜的乐趣！',
    flagHash: 'db64c56f55833dc7e724a46966d93a6116e21e04c56ddeacf54b0e9c8830c1be',
    hints: [
      '仔细阅读系统消息区域，寻找身份验证令牌',
      '在页面下方灰色背景的模拟终端日志中，有一条包含 flag{...} 格式的令牌信息',
    ],
    tools: [],
    challengeType: 'story',
  },
  {
  id: 1,
  title: '凯撒的问候',
  category: ['crypto'],
  description: 'Eclipse 在入侵联盟服务器后留下了一张电子纸条：\n\n' +
    '「L vkliw wkh orfn, exw zkdw lv wkh nhb? Guhvvlqj wkh frgh lv wkh iluvw vwhs.」\n\n' +
    '联盟分析员说这是一种最古老的加密方式——凯撒密码。\n似乎 Eclipse 想先测试我们的基本功。',
  content: 'iodj{fdhvdu_lv_ixq}',
  flagHash: '85920f3446e17f7ce8f733d7067f8b6e5efdb782a99d440b5392d2430d2ca331',
  hints: [
    '每个字母好像被移动了固定的位置，试试凯撒密码工具？',
    '使用凯撒解密工具，偏移量设为 3 即可还原原文',
  ],
  tools: ['caesar'],
  challengeType: 'caesar',
  knowledge: {
    title: '📜 凯撒密码的历史',
    content: '凯撒密码因古罗马军事统帅尤利乌斯·凯撒（Julius Caesar）而得名。他在高卢战争期间使用这种替换密码与将领通信——将每个字母后移三位，即使信使被截获，敌人也无法读懂。这是人类有记载的最早的加密技术之一，距今已有 2000 多年历史。现代密码学的核心思想——用密钥（偏移量）控制加密——正是从凯撒密码开始的。',
  },
  },
  {
  id: 2,
  title: '凯撒独立战',
  category: ['crypto'],
  description: '「不错嘛。但那只是热身——这次我不告诉你偏移量了。自己找！」\n\n' +
    'Eclipse 的第二条消息显然加密得更随意了。你需要自己尝试所有可能的偏移量。',
  content: 'zfua{sio_uly_fyulhcha_zumn}',
  flagHash: 'f4bd210bc78189817dab898dffc85626ebc49f80458835153e0dde2da939cf98',
  hints: [
    '和上一关是同一种密码，但偏移量变了。试试逐个排查？',
    '拖动凯撒工具滑块从 0 到 25，找到输出为合理英文的那个偏移量',
  ],
  tools: ['caesar'],
  challengeType: 'caesar',
  },
  {
  id: 3,
  title: 'Base64 初识',
  category: ['crypto'],
  description: '「换换口味。这严格来说不叫加密——只是换了一种编码方式。」\n\n' +
    'Eclipse 发来了一串看起来像乱码的字符串，末尾有两个等号。\n联盟分析员提示：这叫 Base64 编码，在网络传输中很常见。',
  content: 'ZmxhZ3tiYXNlNjRfaXNfY29tbW9ufQ==',
  flagHash: 'c123208666ad349e0b17b941643e2e87ae40d1210ff4b5029f2b0cd36045c077',
  hints: [
    '末尾的 == 是某种编码的特征，回忆一下之前看到过的介绍？',
    '直接用 Base64 解码工具，把密文粘贴进去选解码模式',
  ],
  tools: ['base64'],
  challengeType: 'base64',
  knowledge: {
    title: '📧 Base64 的用途',
    content: 'Base64 不是加密，而是一种编码方式。它的设计目的是让二进制数据（如图片、附件）能够通过只支持文本的通道传输——最典型的场景就是电子邮件。早期的 SMTP 协议只能传输 ASCII 文本，Base64 把任意字节映射到 64 个可打印字符（A-Z, a-z, 0-9, +, /），= 号用来补位。今天你在 JSON、URL、甚至网页图片的 data URI 中都能看到它的身影。',
  },
  },
  {
  id: 4,
  title: '摩尔斯电码',
  category: ['crypto'],
  description: '「嘀嗒嘀嗒...这是来自一个世纪前的通信方式。」\n\n' +
    'Eclipse 留下了一段音频文件（已转录为文本）：一串由点和划组成的信号。\n他说这是在致敬无线电通信的黄金时代。',
  content: '..-. .-.. .- --. ---... -- ----- .-. ... ...-- ..--.- -.-. ----- -.. ...-- ..--.- -.-. ----- ----- .-.. ...---',
  // 上面是 "flag{m0rs3_c0d3_c00l}" 的摩尔斯电码
  flagHash: '2a5620afb471bbeb9a5ee560fb2e313605796cbb1ff7d95dcc73497156fea998',
  hints: [
    '点和划组成的信号——想想电报时代是怎么通信的？',
    '使用摩尔斯电码解码工具，将密文粘贴进去，选择解码模式',
  ],
  tools: ['morse'],
  challengeType: 'morse',
  knowledge: {
    title: '📻 摩尔斯电码与无线通信',
    content: '摩尔斯电码由萨缪尔·摩尔斯（Samuel Morse）于 1836 年发明，是最早的电子通信编码方式。它用点（.）和划（-）的组合表示字母和数字，通过电报线路或无线电波传输。泰坦尼克号沉没时（1912 年），船上的电报员就是通过摩尔斯电码发出求救信号 SOS（··· --- ···）才使附近船只赶来救援。直到今天，航空导航、业余无线电爱好者仍在广泛使用摩尔斯电码。',
  },
  },
  {
  id: 5,
  title: '双重编码',
  category: ['crypto'],
  description: '「一层不够？那我叠两层。解码顺序自己猜吧。」\n\n' +
    'Eclipse 这次把信息编码了两遍。你需要搞清楚他是先用 Base64 再用凯撒，\n还是先用凯撒再用 Base64？提示：试试不同的顺序。',
  // 生成方式：flag{double_trouble} → Base64 → 凯撒(偏移3)
  // ZmxhZ3tkb3VibGVfdHJvdWJsZX0= → Cpodjh{grxeoh_wurxeoh}
  content: 'KxisK3evm3GtmRGqoSUgoHUdKI0=',
  flagHash: '60dbc6eddb1b0b1cbdab301a1745a25260c6e301020ae7417c8b02ead21709c7',
  hints: [
    '末尾有 = 暗示了 Base64，但直接解码是乱码。想想还学了什么密码？',
    '先用凯撒解密（偏移 11），再 Base64 解码。可以在解码流水线中按此顺序操作',
  ],
  tools: ['caesar', 'base64', 'pipeline'],
  challengeType: 'combo',
  },

  // ===== Phase 2: 密码进阶 + 杂项 =====
  {
  id: 6,
  title: '栅栏密码',
  category: ['crypto'],
  description: '「这次我把字母像围栏的木桩一样排列了。试试翻过这道栅栏？」\n\n' +
    'Eclipse 的留言使用了栅栏密码——一种换位密码，\n将文字按 Z 字形排列在多行中，然后按行读取。',
  // flag{fence_is_easy} 用 3 行栅栏加密
  content: 'fa{ec_ses}lgfnei_ay',
  flagHash: 'f726f5eea9e724ff77774d6a4bad371e4feda599392b937782d25cfcc6dcc9bf',
  hints: [
    '字母没有被替换成别的，只是排列顺序变了。"栅栏"是什么意思？',
    '使用栅栏密码工具，把密文粘贴进去，行数设为 2 即可还原',
  ],
  tools: ['railfence'],
  challengeType: 'railfence',
  },
  {
  id: 7,
  title: '维吉尼亚密码',
  category: ['crypto'],
  description: '「单表替换太容易被暴力破解了。试试多表替换——给你密钥：ECLIPSE」\n\n' +
    'Eclipse 终于用上了稍微安全一点的加密方式。\n维吉尼亚密码使用一个关键词作为密钥，每个字母用不同的偏移量。\n密钥就是 Eclipse 自己的名字。',
  // 用密钥 "ECLIPSE" 加密 "flag{vigenere_is_classic}"
  // Python 验证:
  // def vigenere_encrypt(text, key):
  //     result = []
  //     key_idx = 0
  //     for char in text:
  //         if char.isalpha():
  //             shift = ord(key[key_idx % len(key)].lower()) - 97
  //             base = 65 if char.isupper() else 97
  //             result.append(chr((ord(char) - base + shift) % 26 + base))
  //             key_idx += 1
  //         else:
  //             result.append(char)
  //     return ''.join(result)
  // print(vigenere_encrypt("flag{vigenere_is_classic}", "ECLIPSE"))
  content: 'jnlo{kakippzt_aw_gnlahag}',
  flagHash: '2d666e258e920a74c33d8ca038e62a059e418cb5b45beb06762874743a2b891b',
  hints: [
    '题目里已经明确说了密码类型和密钥——就是 Eclipse 自己的代号',
    '使用维吉尼亚密码工具，密钥输入 ECLIPSE，点解密',
  ],
  tools: ['vigenere'],
  challengeType: 'vigenere',
  knowledge: {
    title: '🔐 维吉尼亚密码——300 年未被破解',
    content: '维吉尼亚密码由法国外交官布莱斯·德·维吉尼亚（Blaise de Vigenère）于 1586 年提出。它使用一个关键词对不同位置的字母应用不同的凯撒偏移，从而打破了单表替换密码容易被频率分析破解的弱点。此后的 300 年里，维吉尼亚密码一直被认为是"无法破解的密码"（Le Chiffre Indéchiffrable），直到 1863 年才被普鲁士军官卡西斯基（Kasiski）用数学方法攻破。但它的核心思想——多表替换——至今仍是现代加密算法（如 AES）的基础之一。',
  },
  },
  {
  id: 8,
  title: '密码迷宫',
  category: ['crypto'],
  description: '「密码学的毕业考。三层编码，顺序自己想。这是最后一关纯密码题了。」\n\n' +
    'Eclipse 把 flag 经过了三次处理。他声称用到了之前出现过的所有技巧。\n你需要自己搞清楚编码的种类和顺序，逆向还原出原始信息。',
  content: '==QfppWYq5WboZ2X3pWe4ZmcfRXe1R2dotHbmF3a',
  flagHash: '9b750dbcfc890b544ecb031e7f560b31a5abe68dbea7f119543d7a5e9634d7db',
  hints: [
    '密文开头有 ==，但它不在末尾——这暗示了什么操作？还涉及另外两种学过的技巧',
    '解码顺序：逆序（把==移回末尾）→ Base64解码 → 凯撒解密(shift=5)。在解码流水线中按此操作',
  ],
  tools: ['caesar', 'base64', 'reverse', 'pipeline'],
  challengeType: 'combo',
  },
  {
  id: 9,
  title: '图片的悄悄话',
  category: ['misc'],
  description: 'Eclipse 在社交平台上发了一张旅行照片。联盟分析员觉得不对劲——\n这张照片的文件大小比正常的要大一些。\n\n也许，秘密不在照片画面里？',
  content: '下载下面的图片，用图片分析工具查看它的元数据（EXIF）。\n\n' +
    '提示：关注 Comment、Artist、Copyright 等不常见的字段。',
  flagHash: '56e2d88d66c7a174d0080f194ed4f6de33c068860c8497126ce685c065d5724e',
  hints: [
    '图片文件除了像素画面，还包含拍摄设备、时间等隐藏元数据信息',
    '使用图片 EXIF 工具上传 challenge-09.jpg，查看 UserComment 等不常见字段',
  ],
  tools: ['image-exif'],
  challengeType: 'image-exif',
  knowledge: {
    title: '📸 照片泄露了多少秘密？',
    content: '你拍的每一张照片，手机都会自动嵌入 EXIF（可交换图像文件格式）元数据——拍摄时间、设备型号、GPS 坐标、光圈快门参数……2012 年，FBI 就是通过一张照片的 EXIF GPS 数据定位并逮捕了一名黑客。2023 年，一名美国飞行员在社交平台发布战机座舱自拍，俄罗斯情报部门通过 EXIF 数据推断出了基地位置。在 CTF 比赛中，EXIF 信息也是最常见的隐写考点之一。',
  },
  downloadFiles: ['challenge-09.jpg'],
  },
  {
  id: 10,
  title: '像素里的秘密',
  category: ['misc'],
  description: '「EXIF 只是开胃菜。真正的秘密，藏在你的眼皮底下。」\n\nEclipse 发来了一张看起来完全正常的 PNG 图片。\n但如果你仔细观察每个像素……',
  content: '下载下面的 PNG 图片，用 LSB 提取工具查看隐藏信息。\n\n' +
    '提示：每个像素的 RGB 颜色值的最低位（LSB）被修改了。',
  flagHash: '7369b9296d71bde2ab0a15ea49e081c678f3726254cd5abc35086b8797d4a7fa',
  hints: [
    '每个像素的红绿蓝颜色值，最低位可以藏信息而不影响外观',
    '使用 LSB 提取工具上传 challenge-10.png，工具会自动提取隐藏的文本',
  ],
  tools: ['image-lsb'],
  challengeType: 'image-lsb',
  downloadFiles: ['challenge-10.png'],
  },
  {
  id: 11,
  title: '被截获的电波',
  category: ['misc'],
  description: '「联盟截获了一段 Eclipse 的网络通信记录。」\n\n分析人员提取了 HTTP 请求和响应数据，但还没仔细翻看过。',
  content: '下载下面的流量记录文件，用流量分析器打开它。\n' +
    '浏览每个 HTTP 请求的响应内容，flag 就在其中一个里面。',
  flagHash: 'd3bad68cb3097e5700b93e9774147bf5cd45eeb1c87ec489e4a2a9423714a4d6',
  hints: [
    '网络通信中有多条 HTTP 请求，每条都有请求内容和服务器返回的响应数据',
    '用流量分析器打开 challenge-11.json，重点看第 4 号数据包（POST /api/auth）的响应体',
  ],
  tools: ['pcap-viewer'],
  challengeType: 'pcap',
  downloadFiles: ['challenge-11.json'],
  },

  // ===== Phase 3: Web 安全 =====
  {
  id: 12,
  title: '不能说的秘密',
  category: ['web'],
  description: '通过流量分析，你发现了一个网址。点进去——这是 Eclipse 的个人博客？\n\n' +
    '看起来就是一个普通的技术博客。但 Eclipse 这种人，会在自己的博客上留下什么？\n' +
    '试试查看网页的源代码。',
  content: '打开 Eclipse 的博客，查看网页的 HTML 源代码。\n\n' +
    '在 VS Code 中也可以直接打开 src/app/challenges/eclipse-blog/page.tsx 查看源码——模仿攻击者的视角。',
  flagHash: '6c5d0ebbc86002b7328e60198a46b0bb1a66ef6cbb0afdcdcd4bbaaa9a1f8dd2',
  hints: ['网页上看到的内容不是全部——浏览器还加载了看不见的部分', '使用源码查看工具获取页面 HTML，或者右键查看网页源代码，搜索注释标记'],
  tools: ['source-viewer'],
  challengeType: 'web-source',
  knowledge: {
    title: '🕵️ HTML 注释泄露——真实案例',
    content: '把敏感信息写在前端代码注释里，听起来很蠢——但它真的发生过。2018 年，安全研究员在耐克官网的 HTML 注释中发现了内部 API 密钥。2021 年，一名开发者在某政府网站的源码注释中留下了数据库密码。前端代码对用户是完全透明的——浏览器的"查看源代码"功能不会过滤任何内容。记住：永远不要在前端代码中存放秘密。HTTPS 加密的是传输过程，加密不了用户的眼睛。',
  },
  webChallengeUrl: '/challenges/eclipse-blog',
  },
  {
  id: 13,
  title: '谁才是管理员',
  category: ['web'],
  description: '「博客有个会员专区。但它的登录验证……好像不太靠谱？」\n\n' +
    'Eclipse 的博客会员专区通过检查浏览器 Cookie 来判断用户身份。\n' +
    '但你发现 Cookie 是可以被用户随意修改的……',
  content: '访问会员专区页面，使用 Cookie 编辑工具将 role 从 guest 改为 admin。',
  flagHash: '82cec5fea11c2d511951b75c8cb0a3e12a656f9a039544f13a35648e147a8f88',
  hints: ['网站用什么来记住你的登录状态？浏览器里存着这些小文件', '用 Cookie 编辑器把 role 的值从 guest 改成 admin，然后刷新会员专区页面'],
  tools: ['cookie-editor'],
  challengeType: 'web-cookie',
  knowledge: {
    title: '🍪 Cookie 劫持——Firesheep 事件',
    content: '2010 年，一名开发者发布了一款名为 Firesheep 的 Firefox 浏览器插件。它让任何人都能在公共 Wi-Fi（咖啡厅、机场）中一键劫持他人的 Facebook、Twitter 登录会话——原理就是截获未加密的 Cookie。这个事件震惊了整个互联网行业，直接推动了各大网站全面启用 HTTPS 加密。今天，Cookie 安全属性（HttpOnly、Secure、SameSite）已成为 Web 安全的基础知识，但仍有大量网站因为 Cookie 配置不当被攻破。',
  },
  webChallengeUrl: '/challenges/eclipse-blog/admin',
  },
  {
  id: 14,
  title: '翻墙找文件',
  category: ['web'],
  description: '「博客有个文件查看功能……但 Eclipse 似乎忘记做路径过滤了。」\n\n' +
    '文件查看器通过 URL 参数 ?file= 指定文件名。\n' +
    '如果直接拼接用户输入到文件路径中，会发生什么？',
  content: '文件查看器 URL：/challenges/eclipse-blog/files?file=welcome.txt\n\n' +
    '尝试修改 file 参数的值来读取其他文件。\n' +
    '也许服务器上有个 secret 目录？',
  flagHash: '39cdccbd4c2acbefe8e1e269237c61a8f945e9804d611427a960a985646f79d2',
  hints: ['当前目录只是文件树的一部分，目录结构可以往上走', '点击 .. 返回上级目录，寻找一个叫 secret 的文件夹'],
  tools: ['http-constructor'],
  challengeType: 'web-pathtraversal',
  knowledge: {
    title: '📂 路径遍历——Equifax 数据泄露',
    content: '路径遍历（又称目录穿越）是 OWASP Top 10 中最古老的 Web 漏洞之一。攻击者通过在文件路径中插入 ../ 来跳出预期目录，读取任意文件。2017 年，美国征信巨头 Equifax 因一个路径遍历漏洞被攻击，导致 1.47 亿美国人的社保号、驾照号等敏感数据泄露。CEO 因此引咎辞职，公司被罚款 7 亿美元。这个漏洞的原理如此简单，但危害可以如此巨大——这就是 Web 安全需要从基础学起的原因。',
  },
  webChallengeUrl: '/challenges/eclipse-blog/files',
  },
  {
  id: 15,
  title: '伪装者',
  category: ['web', 'crypto'],
  description: '「在 Eclipse 的服务器深处，发现了一个隐藏的 API 接口。」\n\n它似乎只允许 Eclipse 的内部工具访问……',
  content: '直接访问 API 会看到网关拦截页面，里面有线索。\n\n' +
    '找到合法身份后，用 HTTP 请求构造器添加 X-Client-ID 请求头，\n获取加密配置后解码得到 flag。',
  flagHash: '678bdebd65549b4a527f5f9ea8894afce2c3eb215f3cd1f45708ff7e3a2ee22b',
  hints: ['直接访问这个 API 会看到一个网关拦截页面，上面列出了允许访问的工具名单', '在 HTTP 请求构造器中添加 X-Client-ID: EclipseBot 头，获取加密配置后做两次 Base64 解码'],
  tools: ['http-constructor', 'base64'],
  challengeType: 'web-crypto',
  webChallengeUrl: '/challenges/eclipse-blog/api/secret',
},

  // ===== Phase 4: 逆向工程 =====
  {
  id: 16,
  title: '字符串寻宝',
  category: ['re'],
  description: '「Eclipse 有个加密工具程序。先别急着运行它——看看里面写了什么？」\n\n' +
    '分析二进制文件的第一步往往不是反编译，而是提取字符串。\n' +
    '很多程序员会在代码中硬编码密码、密钥和……flag。',
  content: '下载 challenge-16 程序，用 Strings 提取工具分析。\n\n' +
    '提示：不需要运行程序。flag 就在字符串列表中。',
  flagHash: '970fe86712c1bb73390c02119a65452f039bf68d16f0543a4ebd666cd4fa5024',
  hints: [
    '不需要运行程序！程序文件里直接包含了可读的文本信息',
    '用 Strings 工具上传程序文件，在输出中直接搜索 flag{...} 格式的字符串',
  ],
  tools: ['strings', 'hex-viewer'],
  challengeType: 're-strings',
  downloadFiles: ['challenge-16.c'],
  },
  {
  id: 17,
  title: '异或的秘密',
  category: ['re'],
  description: '「第二个程序做了加密。不过——异或运算嘛，你懂的。」\n\n' +
    'Eclipse 的这个程序会检查你的输入，但检查方式是用 XOR 0x55 处理后比较。\n' +
    '如果你能找到密文，就可以反推出正确的输入。',
  content: '下载 challenge-17 程序（源码或二进制）。\n\n' +
    '方法1：查看源码中的 encrypted[] 数组，用 XOR 工具计算每个字节 ^ 0x55。\n' +
    '方法2：用 Strings 工具找线索，用 XOR 分析器反推。',
  flagHash: '058716e43294521a5b0c234317f9a2e196d8cd0001eae4f3a185658a9676e958',
  hints: [
    'Strings 输出中有一串十六进制数字和 XOR 0x55 的线索——两者有关联',
    '把那些十六进制字节复制到 XOR 计算器（选十六进制模式），密钥填 55',
  ],
  tools: ['strings', 'hex-viewer', 'xor-calc'],
  challengeType: 're-xor',
  knowledge: {
    title: '🧮 XOR 加密——简单却无处不在',
    content: 'XOR（异或）运算有一个神奇的特性：A XOR B XOR B = A。即用同一个密钥异或两次，数据就还原了。因为这个特性，XOR 成为了计算机领域最基础的加密运算——从早期的游戏存档加密、恶意软件的混淆器，到现代密码学中的流密码（如 RC4）和分组密码（如 AES 的 MixColumns 步骤），XOR 无处不在。它简单到只需一行代码，但又强大到足以构建整个加密体系。比尔·盖茨的第一款产品——为 Altair 8800 写的 BASIC 解释器——就使用了 XOR 来保护代码。',
  },
  downloadFiles: ['challenge-17.c'],
  },
  {
  id: 18,
  title: '层层解码',
  category: ['re', 'crypto'],
  description: '「最后一个程序，Eclipse 花了点心思。不过套路差不多。」\n\n这个程序存储的不是明文 flag，需要你逆向还原。',
  content: '下载 challenge-18 程序。\n\n' +
    '用 Strings 工具提取关键信息，在解码流水线中还原 flag。',
  flagHash: '8e64a38d454269a92cc0183558c5b905cad7581e1fc33a7d5c09113ce238eef6',
  hints: [
    '先用 Strings 提取密文——注意末尾 == 暗示了 Base64。再看看程序里的函数名',
    '解码顺序：逆序 → Base64解码 → ROT13。Strings 中有 ROT13 示例 flag↔synt 作为提示',
  ],
  tools: ['strings', 'base64', 'rot13', 'reverse', 'pipeline'],
  challengeType: 're-crypto',
  downloadFiles: ['challenge-18.c'],
  },

  // ===== Phase 5: 终局之战 =====
  {
  id: 19,
  title: '三重门',
  category: ['misc', 'crypto', 'web'],
  description: '「你越来越近了。Eclipse 开启了第一道防线——三重门。」\n\n一张图片、一段密文、一个隐藏页面。三道关卡环环相扣。',
  content: '步骤提示（不强制，靠自己摸索）：\n' +
    '① 下载图片 → LSB 提取隐藏文本\n' +
    '② 隐藏文本是凯撒密文 → 解密得到 URL 路径\n' +
    '③ 访问该路径 → 用 HTTP 请求构造器修改 Referer 头',
  flagHash: '49fabd9fadc38ac1ec3bf48bf79e982601544d4773aaa7fb8486fe915f4330c9',
  hints: [
    '先 LSB 提取图片中的隐藏文本，文本会告诉你下一步的方向',
    'LSB 提取后获得凯撒密文和 header 线索。凯撒解密(偏移7)得到路径，HTTP 构造器加 X-From 头访问',
  ],
  tools: ['image-lsb', 'caesar', 'http-constructor'],
  challengeType: 'combo-final1',
  downloadFiles: ['challenge-19.png'],
  },
  {
    id: 20,
    title: '镜像迷宫',
    category: ['web', 're', 'crypto'],
    description: '「第二道防线。Eclipse 把秘密藏得更深了。」\n\n实验室里有一段加密载荷和一个加密程序。从哪里入手？',
    content: '在 robots.txt 中或许能找到隐藏的入口。',
    flagHash: 'b7a193b75e355f5816ff41929005e9f02134fa49a3ff03c19e75eacce9f965b1',
    hints: [
    '先找实验室入口——网站通常会有一个文件告诉爬虫哪些路径不能访问',
    'robots.txt → 实验室 → Strings 找密钥 NIGHTSHADE → 密文先 Base64 再 Vigenère 解密',
    ],
    tools: ['source-viewer', 'strings', 'base64', 'vigenere', 'pipeline'],
    challengeType: 'combo-final2',
    webChallengeUrl: '/challenges/eclipse-lab',
  },
  {
    id: 21,
    title: '终焉',
    category: ['web', 'pwn', 'crypto', 're', 'misc'],
    description: '「最后一道防线。Eclipse 用尽了他所有的技能。」\n\n进入远程终端，找到 Eclipse 藏在系统深处的真实坐标。',
    content: '进入 Eclipse 的远程终端。你需要的所有线索都在那里。',
    flagHash: '6a102e55154d1de588858f4907ec64676e998c7170448f3c3dbc30b93fd3087e',
    hints: [
    '一切从查看页面源码开始——终端里的每一步都会给出下一步的线索',
    '源码找登录凭证 → 登录 → 栅栏密码(4行)解密指令 → 终端输入 → Strings找激活码 → 终端执行 → LSB提取坐标',
    ],
    tools: ['source-viewer', 'railfence', 'strings', 'image-lsb'],
    challengeType: 'combo-final3',
    webChallengeUrl: '/challenges/eclipse-terminal',
  },
];

export function getLevelById(id: number): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getAllLevels(): Level[] {
  return levels;
}