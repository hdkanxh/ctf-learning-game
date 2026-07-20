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