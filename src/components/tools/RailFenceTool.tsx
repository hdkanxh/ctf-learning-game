'use client';

import { useState, useMemo } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

function railFenceDecrypt(text: string, rails: number): string {
  const len = text.length;
  // 标记位置
  const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(len).fill(null));
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < len; i++) {
    fence[rail][i] = '*';
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }
  // 填入字符
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < len; c++) {
      if (fence[r][c] === '*') {
        fence[r][c] = text[idx++] || '';
      }
    }
  }
  // 按 zigzag 读取
  rail = 0;
  dir = 1;
  let result = '';
  for (let i = 0; i < len; i++) {
    result += fence[rail][i] || '';
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }
  return result;
}

export default function RailFenceTool() {
  const [input, setInput] = usePersistedState('railfence-input', '');
  const [rails, setRails] = usePersistedState<number>('railfence-rails', 3);

  const results = useMemo(() => {
    if (!input) return [];
    return Array.from({ length: 9 }, (_, i) => ({
      rails: i + 2,
      text: railFenceDecrypt(input, i + 2),
    }));
  }, [input]);

  const currentResult = results.find((r) => r.rails === rails)?.text || '';

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 栅栏密码将文字按 Z 字形排列在 N 行中，然后按行读取。解密时需要尝试不同的行数。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 原理</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>栅栏密码是一种<strong>换位密码</strong>——字母本身不变，但排列顺序被改变。</p>
          <p>将文字按 Z 字形写入 N 行，然后按行读出，形成密文。</p>
          <p>例如 "HELLO" 用 2 行：H L O（第 1 行）、E L（第 2 行）→ 密文 "HLOEL"</p>
          <p>解密时需要知道行数，用相同的 Z 字形规则还原。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：题目给出一段乱序字符，提示或暗示"栅栏"或"Z 字形"。你需要尝试不同行数（通常 2-10 行）来还原原文。进阶考法会将栅栏密码与其他换位密码（如列置换）组合，增加破解难度。</p>
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

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-600">栅栏行数</label>
          <span className="text-lg font-bold text-primary-600">{rails}</span>
        </div>
        <input
          type="range"
          min={2}
          max={10}
          value={rails}
          onChange={(e) => setRails(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      {currentResult && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">{rails} 行解密结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{currentResult}</p>
        </div>
      )}

      {input && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-primary-600">
            查看所有行数结果（2-10 行）
          </summary>
          <div className="mt-3 space-y-1 max-h-64 overflow-y-auto bg-gray-50 rounded-xl p-3">
            {results.map((r) => (
              <div key={r.rails} className={`font-mono text-sm p-2 rounded-lg ${
                r.rails === rails ? 'bg-primary-100 text-primary-800 font-bold' : 'text-gray-600'
              }`}>
                <span className="text-gray-400 mr-2">{r.rails}行:</span>
                <span className="break-all">{r.text}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}