'use client';

import { useState } from 'react';
import CookieEditor from '@/components/tools/CookieEditor';
import HttpConstructor from '@/components/tools/HttpConstructor';

type WebTab = 'source' | 'cookie' | 'http';

const tabs: { key: WebTab; label: string; icon: string }[] = [
  { key: 'source', label: '源码查看', icon: '📄' },
  { key: 'cookie', label: 'Cookie 编辑器', icon: '🍪' },
  { key: 'http', label: 'HTTP 请求构造', icon: '📨' },
];

export default function WebToolsPage() {
  const [activeTab, setActiveTab] = useState<WebTab>('source');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSource = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url);
      const text = await res.text();
      setSource(text);
    } catch {
      setError('获取失败，请检查 URL 或网络（跨域限制可能导致失败）');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🌐 Web 调试器</h1>
        <p className="text-gray-500">查看源码、修改 Cookie、构造 HTTP 请求</p>
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
        {activeTab === 'source' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              💡 获取并查看网页的 HTML 源代码。很多前端漏洞（如注释中的密码、隐藏表单）就藏在源码中。
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="输入网址，如 /challenges/eclipse-blog 或完整 URL"
                className="input-field flex-1"
              />
              <button onClick={fetchSource} disabled={loading} className="btn-primary whitespace-nowrap">
                {loading ? '获取中...' : '📥 获取源码'}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {source && (
              <div className="relative">
                <textarea
                  readOnly
                  value={source}
                  className="input-field h-96 font-mono text-xs bg-gray-900 text-green-400"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'cookie' && <CookieEditor />}
        {activeTab === 'http' && <HttpConstructor />}
      </div>
    </div>
  );
}