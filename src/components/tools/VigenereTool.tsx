'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

function vigenereDecrypt(text: string, key: string): string {
  const cleanKey = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanKey) return text;
  let result = '';
  let keyIdx = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 97;
      result += String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      keyIdx++;
    } else if (code >= 97 && code <= 122) {
      const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 97;
      result += String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      keyIdx++;
    } else {
      result += char;
    }
  }
  return result;
}

export default function VigenereTool() {
  const [input, setInput] = usePersistedState('vigenere-input', '');
  const [key, setKey] = usePersistedState('vigenere-key', '');
  const [output, setOutput] = useState('');

  const handleDecrypt = () => {
    setOutput(vigenereDecrypt(input, key));
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 维吉尼亚密码使用一个关键词作为密钥，对每个字母使用不同的凯撒偏移。比普通凯撒密码更难破解。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 原理</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>维吉尼亚密码是凯撒密码的升级版——每个字母使用<strong>不同的偏移量</strong>，偏移量由密钥决定。</p>
          <p>公式：<code className="bg-gray-200 px-1 rounded">密文[i] = (明文[i] + 密钥[i mod 密钥长度]) mod 26</code></p>
          <p>例如密钥为 "KEY"，则第 1 个字母用 K 对应的偏移，第 2 个用 E，第 3 个用 Y，第 4 个又回到 K...</p>
          <p>由于同一字母在不同位置可能被加密成不同结果，频率分析法难以直接破解。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：题目给出密文和密钥（或密钥的线索）。常见套路是用与题目背景相关的人物名、地名作为密钥。如果密钥未知，可以用卡西斯基测试（Kasiski Examination）或 Friedman 测试来推测密钥长度，再进行频率分析破解。</p>
        </div>
      </details>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">密文</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field h-28 font-mono"
          placeholder="在此粘贴密文..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">密钥（Keyword）</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="input-field font-mono"
          placeholder="输入密钥，如：ECLIPSE"
        />
      </div>

      <button onClick={handleDecrypt} className="btn-primary">🔓 解密</button>

      {output && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">解密结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{output}</p>
        </div>
      )}
    </div>
  );
}