'use client';

import { useState, useRef } from 'react';

export default function StringsTool() {
  const [strings, setStrings] = useState<string[]>([]);
  const [minLength, setMinLength] = useState(4);
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