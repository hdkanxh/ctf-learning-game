'use client';

import { useState, useRef } from 'react';
import StringsTool from '@/components/tools/StringsTool';
import HexViewer from '@/components/tools/HexViewer';

type RETab = 'strings' | 'hex' | 'filetype' | 'xor';

const tabs: { key: RETab; label: string; icon: string }[] = [
  { key: 'strings', label: 'Strings 提取', icon: '📝' },
  { key: 'hex', label: 'Hex Viewer', icon: '🔢' },
  { key: 'filetype', label: '文件类型', icon: '📊' },
  { key: 'xor', label: 'XOR 分析', icon: '🧮' },
];

export default function REToolsPage() {
  const [activeTab, setActiveTab] = useState<RETab>('strings');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [magicInfo, setMagicInfo] = useState('');
  const [xorInput, setXorInput] = useState('');
  const [xorKey, setXorKey] = useState('55');
  const [xorOutput, setXorOutput] = useState('');
  const [xorMode, setXorMode] = useState<'text' | 'hex'>('hex');

  const checkFileType = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes.slice(0, 16))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
      .toUpperCase();

    const magicMap: Record<string, string> = {
      'FF D8 FF': 'JPEG 图片',
      '89 50 4E 47': 'PNG 图片',
      '47 49 46 38': 'GIF 图片',
      '50 4B 03 04': 'ZIP 压缩包',
      '25 50 44 46': 'PDF 文档',
      '7F 45 4C 46': 'ELF 可执行文件（Linux）',
      '4D 5A': 'PE 可执行文件（Windows EXE/DLL）',
      'CA FE BA BE': 'Java Class 文件',
      '52 61 72 21': 'RAR 压缩包',
      '1F 8B': 'GZIP 压缩文件',
    };

    let fileType = '未知文件类型';
    for (const [magic, label] of Object.entries(magicMap)) {
      if (hex.startsWith(magic)) {
        fileType = label;
        break;
      }
    }

    setMagicInfo(
      `文件名: ${file.name}\n文件大小: ${(file.size / 1024).toFixed(1)} KB\n文件头 Magic: ${hex}\n识别类型: ${fileType}`
    );
  };

  const handleXor = () => {
    try {
      const keyByte = parseInt(xorKey, 16);
      if (isNaN(keyByte)) { setXorOutput('密钥格式错误'); return; }

      if (xorMode === 'hex') {
        // 十六进制字节模式：支持 0x2c, 2c, 0x2C, 2C 等格式
        const hexValues = xorInput
          .replace(/0x/gi, '')
          .split(/[\s,;]+/)
          .filter(Boolean);
        let result = '';
        for (const hex of hexValues) {
          const byte = parseInt(hex, 16);
          if (isNaN(byte)) { setXorOutput(`无法解析 "${hex}"，请检查格式`); return; }
          result += String.fromCharCode(byte ^ keyByte);
        }
        setXorOutput(result);
      } else {
        // 文本模式
        let result = '';
        for (let i = 0; i < xorInput.length; i++) {
          result += String.fromCharCode(xorInput.charCodeAt(i) ^ keyByte);
        }
        setXorOutput(result);
      }
    } catch {
      setXorOutput('XOR 计算失败');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 逆向分析器</h1>
        <p className="text-gray-500">分析二进制文件，提取字符串，查看十六进制</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {activeTab === 'strings' && <StringsTool />}
        {activeTab === 'hex' && <HexViewer />}

        {activeTab === 'filetype' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              💡 通过检查文件的 Magic Bytes（文件头标识）来识别文件类型，即使文件扩展名被修改也能正确识别。
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={checkFileType}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
            >
              📁 选择文件
            </button>
            {magicInfo && (
              <pre className="p-4 bg-green-50 border border-green-200 rounded-xl font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {magicInfo}
              </pre>
            )}
          </div>
        )}

        {activeTab === 'xor' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              💡 XOR（异或）是逆向工程中最常见的简单加密方式。输入密文和密钥（十六进制）进行 XOR 解密。
            </div>

            <details className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <summary className="text-sm font-medium text-blue-700 cursor-pointer">📖 什么是十六进制？（点击展开）</summary>
              <div className="mt-3 space-y-2 text-sm text-blue-800 leading-relaxed">
                <p>日常生活中我们用<strong>十进制</strong>（0-9），满10进1。</p>
                <p>计算机底层用<strong>二进制</strong>（0和1），但二进制写起来太长。于是有了<strong>十六进制</strong>作为简写：</p>
                <div className="bg-white rounded-lg p-3 font-mono text-xs">
                  <p>十进制 0-9  →  十六进制 0-9（一样）</p>
                  <p>十进制 10  →  十六进制 A</p>
                  <p>十进制 11  →  十六进制 B</p>
                  <p>十进制 12  →  十六进制 C</p>
                  <p>十进制 13  →  十六进制 D</p>
                  <p>十进制 14  →  十六进制 E</p>
                  <p>十进制 15  →  十六进制 F</p>
                </div>
                <p>用 <code className="bg-blue-100 px-1 rounded">0x</code> 前缀表示这是十六进制数，如 <code className="bg-blue-100 px-1 rounded">0x2C</code> = 2×16 + 12 = 十进制44。</p>
                <p className="text-blue-600">🔍 在 Strings 输出中看到的 <code className="bg-blue-100 px-1 rounded">0x2c, 0x3a, 0x3a...</code> 就是十六进制字节，每两个字符代表一个数字。</p>
              </div>
            </details>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">输入</label>
                <div className="flex gap-1 text-xs">
                  <button
                    onClick={() => { setXorMode('hex'); setXorOutput(''); }}
                    className={`px-3 py-1 rounded-lg transition-colors ${xorMode === 'hex' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    十六进制字节
                  </button>
                  <button
                    onClick={() => { setXorMode('text'); setXorOutput(''); }}
                    className={`px-3 py-1 rounded-lg transition-colors ${xorMode === 'text' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    普通文本
                  </button>
                </div>
              </div>
              <textarea
                value={xorInput}
                onChange={(e) => setXorInput(e.target.value)}
                className="input-field h-24 font-mono text-sm"
                placeholder={xorMode === 'hex'
                  ? '例：2c 3a 3a ed 36 3a 21 ed 27 3a 3f（空格或逗号分隔）'
                  : '在此粘贴文本...'}
              />
              {xorMode === 'hex' && (
                <p className="text-xs text-gray-400 mt-1">
                  💡 支持格式：<code className="bg-gray-100 px-1 rounded">2c 3a 3a</code> 或 <code className="bg-gray-100 px-1 rounded">0x2c, 0x3a, 0x3a</code>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">XOR 密钥（十六进制）：0x</label>
              <input
                type="text"
                value={xorKey}
                onChange={(e) => setXorKey(e.target.value)}
                className="input-field w-20 py-2 font-mono text-center"
                placeholder="55"
              />
              <button onClick={handleXor} className="btn-primary">🧮 XOR 计算</button>
            </div>
            <p className="text-xs text-gray-400">常用密钥：0x55, 0xFF, 0x41, 0x13, 0x37</p>
            {xorOutput && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 font-medium mb-1">XOR 结果：</p>
                <p className="font-mono text-gray-800 break-all">{xorOutput}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}