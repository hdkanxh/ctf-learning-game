'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

export default function Base64Tool() {
  const [input, setInput] = usePersistedState('base64-input', '');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'decode') {
        // 处理 URL-safe Base64
        let cleaned = input.trim().replace(/\s/g, '');
        // 补齐 padding
        while (cleaned.length % 4 !== 0) cleaned += '=';
        const decoded = atob(cleaned);
        // 尝试 UTF-8 解码
        try {
          setOutput(decodeURIComponent(escape(decoded)));
        } catch {
          setOutput(decoded);
        }
      } else {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      }
    } catch {
      setError('解码失败，请检查输入是否为有效的 Base64 字符串');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 Base64 是一种编码方式，不是加密。特征：只包含 A-Z, a-z, 0-9, +, / 和末尾的 = 填充符。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 原理</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>Base64 将每 3 个字节（24 bit）拆分为 4 个 6 bit 的组，每组映射到 64 个可打印字符之一（A-Z, a-z, 0-9, +, /）。</p>
          <p>如果原始数据不是 3 的倍数，用 = 号填充到 4 的倍数。</p>
          <p>例如 "<code className="bg-gray-200 px-1 rounded">Man</code>" → Base64 → "<code className="bg-gray-200 px-1 rounded">TWFu</code>"</p>
          <p>Base64 不是加密！它只是换了一种表示方式，任何人都可以解码。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：数据末尾有 = 或 == 是 Base64 的明显标志。简单题直接解码即可；进阶题会将 Base64 与其他加密组合，或进行多次 Base64 编码来增加解码层数。有时 Base64 编码的内容不是文本而是图片/压缩包——注意输出内容。</p>
        </div>
      </details>

      <div className="flex gap-3">
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'decode' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🔓 解码（Base64 → 文本）
        </button>
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'encode' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🔒 编码（文本 → Base64）
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {mode === 'decode' ? 'Base64 密文' : '原始文本'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field h-28 font-mono"
          placeholder={mode === 'decode' ? '在此粘贴 Base64 字符串...' : '在此输入文本...'}
        />
      </div>

      <button onClick={handleConvert} className="btn-primary">
        {mode === 'decode' ? '🔓 解码' : '🔒 编码'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ❌ {error}
        </div>
      )}

      {output && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{output}</p>
        </div>
      )}
    </div>
  );
}