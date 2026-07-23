'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import ImageExifTool from '@/components/tools/ImageExifTool';
import ImageLsbTool from '@/components/tools/ImageLsbTool';
import StringsTool from '@/components/tools/StringsTool';
import HexViewer from '@/components/tools/HexViewer';
import PcapViewer from '@/components/tools/PcapViewer';

type MiscTab = 'image-exif' | 'image-lsb' | 'strings' | 'hex' | 'pcap';

const tabs: { key: MiscTab; label: string; icon: string }[] = [
  { key: 'image-exif', label: '图片 EXIF', icon: '📋' },
  { key: 'image-lsb', label: 'LSB 提取', icon: '🔍' },
  { key: 'strings', label: 'Strings 提取', icon: '📝' },
  { key: 'hex', label: '十六进制', icon: '🔢' },
  { key: 'pcap', label: '流量分析', icon: '📡' },
];

export default function MiscToolsPage() {
  const [activeTab, setActiveTab] = usePersistedState<MiscTab>('misc-tab', 'image-exif');

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧩 杂项分析器</h1>
        <p className="text-gray-500">图片分析、文件检查、流量查看</p>
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
        {activeTab === 'image-exif' && <ImageExifTool />}
        {activeTab === 'image-lsb' && <ImageLsbTool />}
        {activeTab === 'strings' && <StringsTool />}
        {activeTab === 'hex' && <HexViewer />}
        {activeTab === 'pcap' && <PcapViewer />}
      </div>
    </div>
  );
}