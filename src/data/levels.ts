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
    flagHash: 'PLACEHOLDER',
    hints: ['仔细观察页面上的每一段文字...'],
    tools: [],
    challengeType: 'story',
  },
  {
    id: 1,
    title: '凯撒的问候',
    category: ['crypto'],
    description: 'Eclipse 留下了一张纸条：「L vkliw wkh orfn, exw zkdw lv wkh nhb？」',
    content: 'iodj{fhvdub_lv_ixq}',
    flagHash: 'PLACEHOLDER',
    hints: ['试试凯撒密码——每个字母在字母表中往后移3位？', '偏移量是 3'],
    tools: ['caesar'],
    challengeType: 'caesar',
  },
  {
    id: 2,
    title: '凯撒独立战',
    category: ['crypto'],
    description: '「偏移量被我藏起来了，自己找！」Eclipse 的第二条消息...',
    content: 'iodj{brx_duh_ohduqlqj_idvw}',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['caesar'],
    challengeType: 'caesar',
  },
  {
    id: 3,
    title: 'Base64 初识',
    category: ['crypto'],
    description: '「换换口味——这可不是加密，只是编码而已。」',
    content: 'ZmxhZ3tiYXNlNjRfaXNfY29tbW9ufQ==',
    flagHash: 'PLACEHOLDER',
    hints: ['末尾的 == 是 Base64 的特征哦～试试 Base64 解码？'],
    tools: ['base64'],
    challengeType: 'base64',
  },
  {
    id: 4,
    title: '摩尔斯电码',
    category: ['crypto'],
    description: '「嘀嗒嘀嗒……一段来自旧时代的电波。」',
    content: '..-. .-.. .- --. --... -- ----- .-. ... ...-- ..--.- -.-. ----- -.. ...-- ..... -.-. ----- ----- .-.. -....- --..-- -.-- --- ..- .-. ... . .-.. ..-. -....-',
    flagHash: 'PLACEHOLDER',
    hints: ['短信号是 .（点），长信号是 -（划），这就是摩尔斯电码'],
    tools: ['morse'],
    challengeType: 'morse',
  },
  {
    id: 5,
    title: '双重编码',
    category: ['crypto'],
    description: '「一层不够？那我叠两层。」',
    content: 'Cpodjh{grxeoh_wurxeoh}',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['caesar', 'base64', 'pipeline'],
    challengeType: 'combo',
  },

  // ===== Phase 2: 密码进阶 + 杂项 =====
  {
    id: 6,
    title: '栅栏密码',
    category: ['crypto'],
    description: '「这次我把字母像围栏一样排列起来了。」',
    content: 'fa{lgf_eennc_ep_lias_ys}',
    flagHash: 'PLACEHOLDER',
    hints: ['把字符串按固定行数排列，然后按行读取。试试 3 行？'],
    tools: ['railfence'],
    challengeType: 'railfence',
  },
  {
    id: 7,
    title: '维吉尼亚密码',
    category: ['crypto'],
    description: '「单表替换太容易被破了。试试多表替换？密钥是 ECLIPSE。」',
    content: 'Vigenère 密文（用密钥 ECLIPSE 加密 "flag{vigenere_is_classic}"）',
    flagHash: 'PLACEHOLDER',
    hints: ['密钥已经告诉你了：ECLIPSE。用维吉尼亚密码解密。'],
    tools: ['vigenere'],
    challengeType: 'vigenere',
  },
  {
    id: 8,
    title: '密码迷宫',
    category: ['crypto'],
    description: '「密码学的毕业考。三层编码，顺序自己想。」',
    content: '（凯撒偏移5 → Base64 → 逆序 三层编码后的密文）',
    flagHash: 'PLACEHOLDER',
    hints: [],
    tools: ['caesar', 'base64', 'reverse', 'pipeline'],
    challengeType: 'combo',
  },
  {
    id: 9,
    title: '图片的悄悄话',
    category: ['misc'],
    description: 'Eclipse 在社交平台发了张风景照。联盟分析员觉得不对劲...',
    content: '一张看似普通的风景照，EXIF 信息中藏了东西',
    flagHash: 'PLACEHOLDER',
    hints: ['图片不只是像素～用图片分析工具查看它的 EXIF 元数据？'],
    tools: ['image-exif'],
    challengeType: 'image-exif',
    downloadFiles: ['challenge-09.jpg'],
  },
  {
    id: 10,
    title: '像素里的秘密',
    category: ['misc'],
    description: '「EXIF 只是开胃菜。我更擅长把秘密藏在像素里。」',
    content: '看起来和原图一模一样，但每个像素的最低位被修改过',
    flagHash: 'PLACEHOLDER',
    hints: ['用 LSB 工具提取每个像素颜色值的最低位，看看拼出了什么？'],
    tools: ['image-lsb'],
    challengeType: 'image-lsb',
    downloadFiles: ['challenge-10.png'],
  },
  {
    id: 11,
    title: '被截获的电波',
    category: ['misc'],
    description: '「联盟截获了一段 Eclipse 的网络通信记录。看看他传输了什么？」',
    content: '一段 HTTP 流量记录（PCAP 简化版），某个响应中包含 flag',
    flagHash: 'PLACEHOLDER',
    hints: ['关注 HTTP 响应体——flag 就在其中一个请求的返回内容里'],
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