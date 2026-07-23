'use client';

import { useState, useRef, useMemo } from 'react';

export default function HexViewer() {
  const [hexData, setHexData] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const lines: string[] = [];
    const bytesPerLine = 16;

    for (let offset = 0; offset < bytes.length; offset += bytesPerLine) {
      const chunk = Array.from(bytes.slice(offset, offset + bytesPerLine));
      const hex = chunk.map((b) => b.toString(16).padStart(2, '0')).join(' ');
      const ascii = chunk
        .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
        .join('');
      const addr = offset.toString(16).padStart(8, '0');
      lines.push(`${addr}  ${hex.padEnd(48, ' ')}  ${ascii}`);
    }

    setHexData(lines.slice(0, 500)); // 限制显示行数
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 十六进制查看器以十六进制和 ASCII 形式显示文件内容。可以用来查看文件头（Magic Bytes）、找隐藏文本等。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 十六进制与文件结构</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>计算机中所有文件——图片、程序、文档——本质上都是二进制数据（0 和 1）。</p>
          <p>十六进制（Hex）是二进制的简写：每 4 个比特 = 1 位十六进制数字（0-F），两个十六进制数字 = 1 个字节。</p>
          <p><strong>Magic Bytes（文件头）</strong>：每种文件格式都有独特的开头标识——PNG 是 89 50 4E 47，ZIP 是 50 4B 03 04。</p>
          <p>即使文件扩展名被修改，通过十六进制查看文件头也能识别其真实类型——这是文件分析的起点。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：文件扩展名被故意修改（如 .jpg 改成 .txt），需要通过十六进制查看文件头来识别真实格式。还可能涉及：修复被损坏的文件头、合并被分割的文件、从剪贴板数据中提取文件。</p>
        </div>
      </details>

      <div className="flex items-center gap-3">
        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
          📁 选择文件
        </button>
        {fileName && (
          <span className="text-sm text-gray-500 font-mono">{fileName}</span>
        )}
      </div>

      {hexData.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto leading-relaxed">
          {hexData.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}