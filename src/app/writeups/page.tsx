'use client';

import { useState } from 'react';
import { levels } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';
import Link from 'next/link';

interface WriteupData {
  levelId: number;
  title: string;
  category: string;
  answer: string;
  explanation: string;
}

const writeups: WriteupData[] = [
  {
    levelId: 0, title: '启程', category: '剧情',
    answer: 'flag{w3lc0me_t0_ctf}',
    explanation: '在第 0 关页面的故事文字底部有一段模拟系统消息的灰色区域，其中包含 flag。这是为了让玩家了解 flag 格式为 flag{...}。',
  },
  {
    levelId: 1, title: '凯撒的问候', category: '密码学',
    answer: 'flag{caesar_is_fun}',
    explanation: '密文 iodj{fdhvdu_lv_ixq} 是凯撒密码，偏移量为 3。将每个字母在字母表中向前移 3 位即可解密。',
  },
  {
    levelId: 2, title: '凯撒独立战', category: '密码学',
    answer: 'flag{you_are_learning_fast}',
    explanation: '偏移量未知，但可以尝试 0-25 全部 26 种偏移。找到偏移 20 时输出为合理英文。',
  },
  {
    levelId: 3, title: 'Base64 初识', category: '密码学',
    answer: 'flag{base64_is_common}',
    explanation: '密文 ZmxhZ3tiYXNlNjRfaXNfY29tbW9ufQ== 末尾有 ==，是典型的 Base64 编码。用 Base64 解码即可。',
  },
  {
    levelId: 4, title: '摩尔斯电码', category: '密码学',
    answer: 'flag{m0rs3_c0d3_c00l}',
    explanation: '密文由 . 和 - 组成，是摩尔斯电码。对照摩尔斯电码表解码即可得到 flag。',
  },
  {
    levelId: 5, title: '双重编码', category: '密码学（复合）',
    answer: 'flag{double_trouble}',
    explanation: '密文 KxisK3evm3GtmRGqoSUgoHUdKI0= 经过了 Base64 编码 + 凯撒加密（偏移11）。先用凯撒解密(shift=11)再 Base64 解码。或者利用末尾 = 先意识到有 Base64，试过后发现是乱码，再尝试凯撒。',
  },
  {
    levelId: 6, title: '栅栏密码', category: '密码学',
    answer: 'flag{fence_is_easy}',
    explanation: '密文 fa{ec_ses}lgfnei_ay 是栅栏密码，栏数为 2。按 2 行 Z 字形排列再按行读取。',
  },
  {
    levelId: 7, title: '维吉尼亚密码', category: '密码学',
    answer: 'flag{vigenere_is_classic}',
    explanation: '使用密钥 ECLIPSE 进行维吉尼亚解密。题目中已给出密钥。',
  },
  {
    levelId: 8, title: '密码迷宫', category: '密码学（复合）',
    answer: 'flag{crypto_master_achieved}',
    explanation: '密文 ==QfppWYq5WboZ2X3pWe4ZmcfRXe1R2dotHbmF3a 开头 == 暗示逆序。编码链：凯撒(偏移5) → Base64 → 逆序。解码链：逆序 → Base64解码 → 凯撒解密(shift=5)。',
  },
  {
    levelId: 9, title: '图片的悄悄话', category: '杂项（EXIF）',
    answer: 'flag{h1dd3n_1n_pla1n_s1ght}',
    explanation: '下载图片，用图片 EXIF 工具查看元数据，flag 藏在 UserComment 字段中。',
  },
  {
    levelId: 10, title: '像素里的秘密', category: '杂项（LSB）',
    answer: 'flag{lsb_st3g4n0gr4phy}',
    explanation: '下载 PNG 图片，用 LSB 提取工具提取每个像素 RGB 的最低位，拼接成文本即得 flag。',
  },
  {
    levelId: 11, title: '被截获的电波', category: '杂项（流量分析）',
    answer: 'flag{p4ck3t_an4lys1s_r0cks}',
    explanation: '下载 JSON 流量文件，用流量分析器打开。浏览第 4 号数据包（POST /api/auth）的响应体，secret_note 字段包含 flag。',
  },
  {
    levelId: 12, title: '不能说的秘密', category: 'Web安全',
    answer: 'flag{html_c0mm3nt_is_n0t_s4fe}',
    explanation: '打开 Eclipse 博客页面，查看 HTML 源代码，flag 藏在底部注释中（<!-- ... -->）。',
  },
  {
    levelId: 13, title: '谁才是管理员', category: 'Web安全',
    answer: 'flag{c00k13_m4n1pul4t10n}',
    explanation: '用 Cookie 编辑器将 role=guest 改为 role=admin，刷新会员专区页面，flag 显示在管理面板中。',
  },
  {
    levelId: 14, title: '翻墙找文件', category: 'Web安全',
    answer: 'flag{p4th_tr4v3rs4l_3z}',
    explanation: '文件浏览器初始在 public/ 目录。点击 .. 返回上级目录，可发现 secret/ 文件夹，进入后查看 flag.txt 即可。notes.txt 中有暗示上级目录藏了东西。',
  },
  {
    levelId: 15, title: '伪装者', category: 'Web + 密码学',
    answer: 'flag{w3b_4nd_crypt0_t0g3th3r}',
    explanation: '直接访问 API 会看到网关拦截页面，白名单显示 EclipseBot。用 HTTP 请求构造器向 /challenges/eclipse-blog/api/secret 发 GET 请求，添加请求头 X-Client-ID: EclipseBot。获取返回的 encrypted_config，做两次 Base64 解码。',
  },
  {
    levelId: 16, title: '字符串寻宝', category: '逆向工程',
    answer: 'flag{str1ngs_1s_p0w3rful}',
    explanation: '下载程序文件，用 Strings 提取工具分析。在可读字符串列表中直接找到 flag{...} 格式的字符串。',
  },
  {
    levelId: 17, title: '异或的秘密', category: '逆向工程',
    answer: 'flag{you_got_xor}',
    explanation: '用 Strings 工具提取程序中的十六进制字节和 XOR 0x55 线索。将字节复制到 XOR 计算器（十六进制模式），密钥填 55，解密得到密码 you_got_xor。flag 格式为 flag{密码}。',
  },
  {
    levelId: 18, title: '层层解码', category: '逆向 + 密码学',
    answer: 'flag{r3v3rs3_4nd_d3c0d3!}',
    explanation: '用 Strings 提取密文 fSEzcTBwM3FfcWE0XzNmZTNpM2V7dG55cw==。末尾 == 提示 Base64，解码后发现 } 在开头暗示逆序，逆序后 synt{ 提示 ROT13。解码链：逆序 → Base64解码 → ROT13。',
  },
  {
    levelId: 19, title: '三重门', category: '综合（Misc+Crypto+Web）',
    answer: 'flag{thr33_1n_0n3_g4t3}',
    explanation: '① LSB 提取图片，得到凯撒密文和 header 线索 ② 凯撒解密(偏移7)得到路径 /challenges/eclipse-hidden-gateway 和请求头 X-From: eclipse-blog ③ 用 HTTP 构造器访问该路径，添加 X-From 头获取 flag。',
  },
  {
    levelId: 20, title: '镜像迷宫', category: '综合（Web+RE+Crypto）',
    answer: 'flag{mirror_maze_conquered!}',
    explanation: '① robots.txt 泄露 /eclipse-lab ② 进入实验室下载程序，strings 找到 Vigenère 密钥 NIGHTSHADE ③ 密文末尾 == 提示先做 Base64 解码 ④ 解码结果是 Vigenère 密文，用密钥 NIGHTSHADE 解密得到 flag。',
  },
  {
    levelId: 21, title: '终焉', category: '综合（五维融合）',
    answer: 'flag{3cl1ps3_l0c4t10n_b31j1ng_h41d14n}',
    explanation: '① 查看终端页面源码，HTML 注释泄露登录凭证 eclipse_admin / th3_3cl1ps3_r1s1ng（Web）② 登录后终端显示栅栏密文，4 行解密得到 analyze_backdoor_find_code（Crypto）③ 终端输入该指令获取后门源码，strings 分析得到激活码 activate_backdoor_555（RE）④ 终端输入激活码执行后门，获得坐标图片（Pwn）⑤ LSB 提取图片得到 Eclipse 最终位置（Misc）。',
  },
];

export default function WriteupsPage() {
  const { progress } = useProgress();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 完整 Writeup</h1>
        <p className="text-gray-500">所有关卡的详细解法，通关后可查看</p>
      </div>

      <div className="space-y-3">
        {writeups.map((w) => {
          const isCompleted = progress.completedLevels.includes(w.levelId);
          const isExpanded = expandedId === w.levelId;

          return (
            <div key={w.levelId} className="card overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : w.levelId)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? '✅' : w.levelId}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      第 {w.levelId} 关 · {w.title}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {w.category}
                    </span>
                  </div>
                </div>
                <span className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3 animate-fade-in">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">🚩 Flag</p>
                    <p className="font-mono text-sm text-primary-600 bg-primary-50 p-2 rounded-lg">
                      {w.answer}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">📖 解法</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{w.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/ending" className="btn-secondary text-sm">
          ← 返回结局
        </Link>
      </div>
    </div>
  );
}