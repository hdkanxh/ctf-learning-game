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