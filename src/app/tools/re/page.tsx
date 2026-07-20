'use client';

import { useState } from 'react';
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
  const [magicInfo, setMagicInfo] = useState('');
  const [xorInput, setXorInput] = useState('');
  const [xorKey, setXorKey] = useState('55');
  const [xorOutput, setXorOutput] = useState('');

  const checkFileType = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes.slice(0, 16))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
      .toUpperCase();

    // Magic bytes 识别
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
      let result = '';
      for (let i = 0; i < xorInput.length; i++) {
        result += String.fromCharCode(xorInput.charCodeAt(i) ^ keyByte);
      }
      setXorOutput(result);
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

      <div className="flex flex-wrap gap-2 mb-6">
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
            <input type="file" onChange={checkFileType} className="text-sm" />
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
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">输入文本</label>
              <textarea
                value={xorInput}
                onChange={(e) => setXorInput(e.target.value)}
                className="input-field h-28 font-mono"
                placeholder="在此粘贴文本..."
              />
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