'use client';

import { useState, useEffect } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import CaesarTool from '@/components/tools/CaesarTool';
import Base64Tool from '@/components/tools/Base64Tool';
import MorseTool from '@/components/tools/MorseTool';
import RailFenceTool from '@/components/tools/RailFenceTool';
import VigenereTool from '@/components/tools/VigenereTool';
import PipelineTool from '@/components/tools/PipelineTool';
import { reverseString, rot13 } from '@/lib/crypto';

type ToolTab = 'caesar' | 'base64' | 'morse' | 'railfence' | 'vigenere' | 'reverse' | 'rot13' | 'pipeline';

const tabs: { key: ToolTab; label: string; icon: string }[] = [
  { key: 'caesar', label: '凯撒密码', icon: '🔄' },
  { key: 'base64', label: 'Base64', icon: '📝' },
  { key: 'morse', label: '摩尔斯电码', icon: '📻' },
  { key: 'railfence', label: '栅栏密码', icon: '🏗️' },
  { key: 'vigenere', label: '维吉尼亚', icon: '🔑' },
  { key: 'reverse', label: '逆序文本', icon: '↔️' },
  { key: 'rot13', label: 'ROT13', icon: '🔃' },
  { key: 'pipeline', label: '解码流水线', icon: '🧩' },
];

export default function CryptoToolsPage() {
  const [activeTab, setActiveTab] = usePersistedState<ToolTab>('crypto-tab', 'caesar');
  const [input, setInput] = usePersistedState('crypto-input', '');
  const [output, setOutput] = usePersistedState('crypto-output', '');

  // URL hash 跳转到指定工具
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as ToolTab;
    if (hash && tabs.some(t => t.key === hash)) setActiveTab(hash);
  }, []);

  // 简单工具的处理函数
  const handleReverse = () => setOutput(reverseString(input));
  const handleRot13 = () => setOutput(rot13(input));

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 密码学工具箱</h1>
        <p className="text-gray-500">所有编码解码工具，一站式搞定</p>
      </div>

      {/* 类别导航 */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { key: 'crypto', label: '🔐 密码学', href: '/tools/crypto' },
          { key: 'misc', label: '🧩 杂项', href: '/tools/misc' },
          { key: 'web', label: '🌐 Web', href: '/tools/web' },
          { key: 're', label: '🔧 逆向', href: '/tools/re' },
        ].map(cat => (
          <a key={cat.key} href={cat.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              'crypto' === cat.key ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {cat.label}
          </a>
        ))}
      </div>

      {/* 工具标签切换 */}
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

      {/* 工具面板 */}
      <div className="card p-6">
        {activeTab === 'caesar' && <CaesarTool />}
        {activeTab === 'base64' && <Base64Tool />}
        {activeTab === 'morse' && <MorseTool />}
        {activeTab === 'railfence' && <RailFenceTool />}
        {activeTab === 'vigenere' && <VigenereTool />}
        {activeTab === 'pipeline' && <PipelineTool />}

        {/* 简单工具：逆序 */}
        {activeTab === 'reverse' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">输入文本</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field h-32 font-mono"
                placeholder="在此输入要反转的文本..."
              />
            </div>
            <button onClick={handleReverse} className="btn-primary">↔️ 逆序</button>
            {output && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 font-medium mb-1">结果：</p>
                <p className="font-mono text-gray-800 break-all">{output}</p>
              </div>
            )}
          </div>
        )}

        {/* 简单工具：ROT13 */}
        {activeTab === 'rot13' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">输入文本</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field h-32 font-mono"
                placeholder="在此输入文本..."
              />
            </div>
            <button onClick={handleRot13} className="btn-primary">🔃 ROT13 转换</button>
            {output && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 font-medium mb-1">结果：</p>
                <p className="font-mono text-gray-800 break-all">{output}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}