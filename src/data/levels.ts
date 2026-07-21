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
}

// ⚠️ 此处 flagHash 需要运行 hashFlag 工具生成
// 现阶段先用占位符，Phase 3 制作关卡时再填入真实哈希

export const levels: Level[] = [
  // ===== Phase 1: 密码学入门 =====
  {
    id: 0,
    title: '启程',
    category: ['story'],
    description: '一封来自网络安全联盟的加密邮件...',
    content: '',
    flagHash: 'db64c56f55833dc7e724a46966d93a6116e21e04c56ddeacf54b0e9c8830c1be',
    hints: ['仔细观察页面上的每一段文字...'],
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
    '试试凯撒密码——每个字母在字母表中往后移 3 位？',
    '偏移量就是 3，用凯撒解密工具，shift 设为 3',
  ],
  tools: ['caesar'],
  challengeType: 'caesar',
  },
  {
  id: 2,
  title: '凯撒独立战',
  category: ['crypto'],
  description: '「不错嘛。但那只是热身——这次我不告诉你偏移量了。自己找！」\n\n' +
    'Eclipse 的第二条消息显然加密得更随意了。你需要自己尝试所有可能的偏移量。',
  content: 'zfua{sio_uly_fyulhcha_zumn}',
  flagHash: 'f4bd210bc78189817dab898dffc85626ebc49f80458835153e0dde2da939cf98',
  hints: [],
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
    '末尾的 == 是 Base64 编码的标志性特征！用 Base64 解码工具试试。',
    '直接把上面那串字符粘贴到 Base64 解码器里，选"解码"模式。',
  ],
  tools: ['base64'],
  challengeType: 'base64',
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
    '短信号是 .（点/dit），长信号是 -（划/dah）。这就是摩尔斯电码。',
    '用摩尔斯电码解码工具，把密文粘贴进去，选"解码"模式。',
  ],
  tools: ['morse'],
  challengeType: 'morse',
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
  hints: [],
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
    '栅栏密码——把字符串按固定行数排列成 Z 字形，然后按行读取。试试 3 行？',
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
    '密钥已经告诉你了：ECLIPSE。用维吉尼亚密码解密工具。',
  ],
  tools: ['vigenere'],
  challengeType: 'vigenere',
  },
  {
  id: 8,
  title: '密码迷宫',
  category: ['crypto'],
  description: '「密码学的毕业考。三层编码，顺序自己想。这是最后一关纯密码题了。」\n\n' +
    'Eclipse 把 flag 经过了三次处理。他声称用到了之前出现过的所有技巧。\n你需要自己搞清楚编码的种类和顺序，逆向还原出原始信息。',
  content: '==QfppWYq5WboZ2X3pWe4ZmcfRXe1R2dotHbmF3a',
  flagHash: '9b750dbcfc890b544ecb031e7f560b31a5abe68dbea7f119543d7a5e9634d7db',
  hints: [],
  tools: ['caesar', 'base64', 'reverse', 'pipeline'],
  challengeType: 'combo',
  },
  {
  id: 9,
  title: '图片的悄悄话',
  category: ['misc'],
  description: 'Eclipse 在社交平台上发了一张旅行照片。联盟分析员觉得不对劲——\n' +
    '这张照片的文件大小比正常的要大一些。\n\n' +
    '「秘密不一定藏在画面里。有时候，文件的"身份信息"里藏了东西。」',
  content: '下载下面的图片，用图片分析工具查看它的元数据（EXIF）。\n\n' +
    '提示：关注 Comment、Artist、Copyright 等不常见的字段。',
  flagHash: '56e2d88d66c7a174d0080f194ed4f6de33c068860c8497126ce685c065d5724e',
  hints: [
    '图片不只是像素！用"图片 EXIF"工具上传这张图片，查看元数据字段。',
    '检查 Comment 字段，flag 就在那里。',
  ],
  tools: ['image-exif'],
  challengeType: 'image-exif',
  downloadFiles: ['challenge-09.jpg'],
  },
  {
  id: 10,
  title: '像素里的秘密',
  category: ['misc'],
  description: '「EXIF 只是开胃菜。我更擅长把秘密藏在像素里。」\n\n' +
    'Eclipse 这次发来了一张看起来完全正常的 PNG 图片。\n但如果你观察每个像素颜色值的最低位……会发现另一个世界。',
  content: '下载下面的 PNG 图片，用 LSB 提取工具查看隐藏信息。\n\n' +
    '提示：每个像素的 RGB 颜色值的最低位（LSB）被修改了。',
  flagHash: '7369b9296d71bde2ab0a15ea49e081c678f3726254cd5abc35086b8797d4a7fa',
  hints: [
    '用"LSB 提取"工具上传这张 PNG 图片，提取每个像素的最低位。',
    'flag 直接以 ASCII 文本形式藏在 LSB 中。',
  ],
  tools: ['image-lsb'],
  challengeType: 'image-lsb',
  downloadFiles: ['challenge-10.png'],
  },
  {
  id: 11,
  title: '被截获的电波',
  category: ['misc'],
  description: '「联盟截获了一段 Eclipse 的网络通信记录。他似乎在从某个服务器下载文件。」\n\n' +
    '分析人员提取了 HTTP 请求和响应数据。翻翻看——也许某个响应包里藏了不该出现的东西？',
  content: '下载下面的流量记录文件，用流量分析器打开它。\n' +
    '浏览每个 HTTP 请求的响应内容，flag 就在其中一个里面。',
  flagHash: 'd3bad68cb3097e5700b93e9774147bf5cd45eeb1c87ec489e4a2a9423714a4d6',
  hints: [
    '用"流量分析"工具上传这个文件。浏览每个 HTTP 响应，flag 在响应体里。',
    '找找看哪个请求的响应内容看起来像是"不该出现在那里的"？',
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
    description: '通过流量分析，你发现了一个网址。这是 Eclipse 的个人博客？',
    content: '查看这个网页的源代码，也许能找到有趣的注释...',
    flagHash: 'PLACEHOLDER',
    hints: ['右键 → 查看网页源代码？或者用我们的源码查看面板？'],
    tools: ['source-viewer'],
    challengeType: 'web-source',
    webChallengeUrl: '/challenges/eclipse-blog',
  },
  {
    id: 13,
    title: '谁才是管理员',
    category: ['web'],
    description: '「博客有个会员专区。但它的登录验证...好像不太靠谱？」',
    content: '修改 Cookie 伪装成管理员',
    flagHash: 'PLACEHOLDER',
    hints: ['看看浏览器里存了什么 Cookie？把 role 的值改一下试试？'],
    tools: ['cookie-editor'],
    challengeType: 'web-cookie',
    webChallengeUrl: '/challenges/eclipse-blog/admin',
  },
  {
    id: 14,
    title: '翻墙找文件',
    category: ['web'],
    description: '「Eclipse 的博客有个文件查看功能...但过滤做得不太好。」',
    content: '通过路径遍历漏洞读取服务器上的秘密文件',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['http-constructor'],
    challengeType: 'web-pathtraversal',
    webChallengeUrl: '/challenges/eclipse-blog/files',
  },
  {
    id: 15,
    title: '双重身份',
    category: ['web', 'crypto'],
    description: '「在 Eclipse 服务器深处发现了一个加密接口...」',
    content: '修改请求头 + Base64 解码',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['http-constructor', 'base64'],
    challengeType: 'web-crypto',
    webChallengeUrl: '/challenges/eclipse-blog/api/secret',
  },

  // ===== Phase 4: 逆向工程 =====
  {
    id: 16,
    title: '字符串寻宝',
    category: ['re'],
    description: '「Eclipse 有个加密工具程序。先看看里面写了什么？」',
    content: '一个简单编译的 C 程序，flag 就藏在明文字符串中',
    flagHash: 'PLACEHOLDER',
    hints: ['二进制文件里藏着可读的字符串！用 Strings 提取工具试试？'],
    tools: ['strings', 'hex-viewer'],
    challengeType: 're-strings',
    downloadFiles: ['challenge-16.exe'],
  },
  {
    id: 17,
    title: '异或的秘密',
    category: ['re'],
    description: '「第二个程序做了加密。不过——异或运算嘛，你懂的。」',
    content: '程序将输入与 0x55 做 XOR 后比对密文',
    flagHash: 'PLACEHOLDER',
    hints: ['反编译代码显示使用了 XOR 0x55。试试反推密文？'],
    tools: ['strings', 'hex-viewer', 'xor-calc'],
    challengeType: 're-xor',
    downloadFiles: ['challenge-17.exe'],
  },
  {
    id: 18,
    title: '层层解码',
    category: ['re', 'crypto'],
    description: '「最后一个程序，Eclipse 花了点心思。不过套路差不多。」',
    content: '程序对 flag 做了 Base64 → ROT13 → 逆序，分析解码流程',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['strings', 'hex-viewer', 'base64', 'rot13', 'reverse', 'pipeline'],
    challengeType: 're-crypto',
    downloadFiles: ['challenge-18.exe'],
  },

  // ===== Phase 5: 终局之战 =====
  {
    id: 19,
    title: '三重门',
    category: ['misc', 'crypto', 'web'],
    description: '「你越来越近了。Eclipse 开启了第一道防线——三重门。」',
    content: '图片隐写 → 凯撒解密 → Web 请求',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['image-lsb', 'caesar', 'http-constructor'],
    challengeType: 'combo-final1',
    downloadFiles: ['challenge-19.png'],
  },
  {
    id: 20,
    title: '镜像迷宫',
    category: ['web', 're', 'crypto', 'misc'],
    description: '「第二道防线。Eclipse 把秘密藏得更深了。」',
    content: 'robots.txt → RE → Base64+Vigenère → 音频频谱图',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['source-viewer', 'strings', 'base64', 'vigenere', 'image-lsb'],
    challengeType: 'combo-final2',
    downloadFiles: ['challenge-20.exe', 'challenge-20.wav'],
    webChallengeUrl: '/challenges/eclipse-lab',
  },
  {
    id: 21,
    title: '终焉',
    category: ['web', 'pwn', 'crypto', 're', 'misc'],
    description: '「最后一道防线。攻破它，找到 Eclipse 的真实位置。」',
    content: 'HTML注释泄露 → 栅栏密码 → WebSocket终端 → RE → LSB',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['source-viewer', 'railfence', 'ws-terminal', 'strings', 'image-lsb'],
    challengeType: 'combo-final3',
    downloadFiles: ['challenge-21.exe', 'challenge-21.png'],
    webChallengeUrl: '/challenges/eclipse-terminal',
  },
];

export function getLevelById(id: number): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getAllLevels(): Level[] {
  return levels;
}