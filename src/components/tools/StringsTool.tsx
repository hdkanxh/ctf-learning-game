'use client';

import { useState, useRef } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

export default function StringsTool() {
  const [strings, setStrings] = useState<string[]>([]);
  const [minLength, setMinLength] = usePersistedState<number>('strings-minlen', 4);
  const [fileName, setFileName] = useState('');
  const [highlight, setHighlight] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = new TextDecoder('ascii').decode(bytes);

    // 提取所有连续可打印 ASCII 字符串
    const found = text.match(new RegExp(`[\\x20-\\x7E]{${minLength},}`, 'g')) || [];
    // 去重并排序
    const unique = [...new Set(found)].sort((a, b) => b.length - a.length);
    setStrings(unique);
  };

  const filteredStrings = highlight
    ? strings.filter((s) => s.toLowerCase().includes(highlight.toLowerCase()))
    : strings;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 Strings 工具从任意文件中提取所有可读字符串。在逆向工程中，硬编码的密码、URL、flag 往往就藏在字符串中。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 为什么 Strings 有效？</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>编译后的程序文件中包含了源码中所有的<strong>字符串常量</strong>——如提示信息、文件路径、URL、密钥等。</p>
          <p>即使不懂汇编语言，通过提取这些可读字符串也能获得大量线索——这通常是逆向分析的第一步。</p>
          <p>strings 命令（Linux）从二进制中提取连续 4 个以上的可打印 ASCII 字符。</p>
          <p>在 CTF 和恶意软件分析中，strings 往往能直接暴露出硬编码的密码、API 密钥甚至 flag。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：逆向题的第一步几乎总是跑 strings。flag 可能直接以明文字符串形式存在于程序中，也可能被拆分成多个片段。进阶考法：flag 经过 XOR 加密，strings 看到的是加密后的乱码而非原文——需要结合其他线索找到解密方式。</p>
        </div>
      </details>

      <div className="flex items-center gap-3">
        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
          📁 选择文件
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">最小长度：</label>
          <select
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
            className="input-field w-20 py-1.5"
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {fileName && (
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            文件：<span className="font-mono text-gray-700">{fileName}</span> · 共 {strings.length} 个字符串
          </p>
          <input
            type="text"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="🔍 过滤（如 flag）"
            className="input-field w-48 py-1.5 text-sm"
          />
        </div>
      )}

      {filteredStrings.length > 0 && (
        <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-3 font-mono text-sm">
          {filteredStrings.map((s, i) => {
            const isInteresting =
              /flag|key|secret|password|admin|http|\.com|\.cn|login|token/i.test(s);
            return (
              <div
                key={i}
                className={`px-2 py-1 rounded break-all ${
                  isInteresting ? 'bg-yellow-100 text-yellow-900 font-bold' : 'text-gray-700'
                }`}
              >
                {s}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}