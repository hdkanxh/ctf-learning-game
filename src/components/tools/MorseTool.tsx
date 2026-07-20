'use client';

import { useState } from 'react';
import { MORSE_CODE, MORSE_REVERSE } from '@/lib/crypto';

export default function MorseTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');

  const handleConvert = () => {
    if (mode === 'decode') {
      setOutput(
        input
          .trim()
          .split(/\s+/)
          .map((code) => MORSE_REVERSE[code] || '?')
          .join('')
      );
    } else {
      setOutput(
        input
          .toLowerCase()
          .split('')
          .map((char) => MORSE_CODE[char] || char)
          .join(' ')
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 摩尔斯电码使用点（.）和划（-）表示字母。单词之间用空格分隔。
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setMode('decode'); setOutput(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'decode' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          📻 解码（摩尔斯 → 文本）
        </button>
        <button
          onClick={() => { setMode('encode'); setOutput(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'encode' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          📡 编码（文本 → 摩尔斯）
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {mode === 'decode' ? '摩尔斯电码（用空格分隔）' : '输入文本'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field h-28 font-mono"
          placeholder={mode === 'decode' ? '例：..-. .-.. .- --.' : '例：flag'}
        />
      </div>

      <button onClick={handleConvert} className="btn-primary">转换</button>

      {output && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{output}</p>
        </div>
      )}

      {/* 对照表 */}
      <details className="mt-4">
        <summary className="text-sm text-gray-500 cursor-pointer hover:text-primary-600">
          查看摩尔斯电码对照表
        </summary>
        <div className="mt-3 grid grid-cols-6 md:grid-cols-9 gap-1 text-xs font-mono">
          {Object.entries(MORSE_CODE).map(([char, code]) => (
            <div key={char} className="bg-gray-50 p-2 rounded text-center">
              <div className="text-gray-800 font-bold">{char}</div>
              <div className="text-gray-500">{code}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}