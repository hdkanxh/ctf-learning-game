'use client';

import { useState, useMemo } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

export default function CaesarTool() {
  const [input, setInput] = usePersistedState('caesar-input', '');
  const [shift, setShift] = usePersistedState<number>('caesar-shift', 3);

  const results = useMemo(() => {
    if (!input) return [];
    // 显示所有 26 种偏移结果，高亮当前选中的
    return Array.from({ length: 26 }, (_, i) => {
      const decrypted = input
        .split('')
        .map((char) => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 - i + 26) % 26) + 65);
          }
          if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - i + 26) % 26) + 97);
          }
          return char;
        })
        .join('');
      return { shift: i, text: decrypted };
    });
  }, [input]);

  const currentResult = results.find((r) => r.shift === shift)?.text || '';

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 凯撒密码将每个字母按字母表移动固定位数。例如偏移 3 时，A→D, B→E, C→F...
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 原理</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>凯撒密码是一种<strong>替换密码</strong>——每个字母被替换为字母表中固定位置之后的另一个字母。</p>
          <p>公式：<code className="bg-gray-200 px-1 rounded">密文 = (明文 + 偏移量) mod 26</code></p>
          <p>例如偏移 3：A→D, B→E, C→F, ..., X→A, Y→B, Z→C</p>
          <p>由于只有 26 种可能的偏移量，凯撒密码非常容易被暴力枚举破解。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：题目给出一段无意义的字母串，可能暗示或直接告知是凯撒密码。你需要用工具枚举 26 种偏移量，找到输出为可读英文的那个。进阶考法是将凯撒与其他编码（如 Base64）组合使用。</p>
        </div>
      </details>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">密文 / 明文</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field h-28 font-mono"
          placeholder="在此粘贴密文..."
        />
      </div>

      {/* 偏移滑块 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-600">偏移量（Shift）</label>
          <span className="text-lg font-bold text-primary-600">{shift}</span>
        </div>
        <input
          type="range"
          min={0}
          max={25}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span>
        </div>
      </div>

      {/* 当前偏移结果 */}
      {currentResult && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">偏移 {shift} 解密结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{currentResult}</p>
        </div>
      )}

      {/* 所有偏移预览 */}
      {input && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-primary-600">
            查看全部 26 种偏移结果
          </summary>
          <div className="mt-3 max-h-64 overflow-y-auto space-y-1 bg-gray-50 rounded-xl p-3">
            {results.map((r) => (
              <div
                key={r.shift}
                className={`font-mono text-sm p-2 rounded-lg flex gap-3 ${
                  r.shift === shift ? 'bg-primary-100 text-primary-800 font-bold' : 'text-gray-600'
                }`}
              >
                <span className="text-gray-400 w-8 text-right flex-shrink-0">{r.shift}</span>
                <span className="break-all">{r.text}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}