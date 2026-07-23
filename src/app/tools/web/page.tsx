'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import CookieEditor from '@/components/tools/CookieEditor';
import HttpConstructor from '@/components/tools/HttpConstructor';

type WebTab = 'source' | 'cookie' | 'http';

const tabs: { key: WebTab; label: string; icon: string }[] = [
  { key: 'source', label: '源码查看', icon: '📄' },
  { key: 'cookie', label: 'Cookie 编辑器', icon: '🍪' },
  { key: 'http', label: 'HTTP 请求构造', icon: '📨' },
];

interface SourceReport {
  title: string;
  comments: string[];
  hiddenInputs: string[];
  forms: string[];
  scripts: string[];
  links: string[];
  metaTags: string[];
  skeleton: string;
  suspicious: string[];
}

function analyzeSource(html: string): SourceReport {
  const report: SourceReport = {
    title: '',
    comments: [],
    hiddenInputs: [],
    forms: [],
    scripts: [],
    links: [],
    metaTags: [],
    skeleton: '',
    suspicious: [],
  };

  // 提取 title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  report.title = titleMatch?.[1]?.trim() || '(无标题)';

  // 提取 HTML 注释
  const commentRegex = /<!--[\s\S]*?-->/g;
  const comments = html.match(commentRegex) || [];
  report.comments = comments.map((c) => c.replace(/<!--|-->/g, '').trim()).filter((c) => c.length > 0);

  // 提取隐藏 input
  const hiddenRegex = /<input[^>]*type\s*=\s*["']hidden["'][^>]*>/gi;
  report.hiddenInputs = html.match(hiddenRegex)?.map((t) => t.trim()) || [];

  // 提取 form
  const formRegex = /<form[^>]*>/gi;
  report.forms = html.match(formRegex)?.map((t) => t.trim()) || [];

  // 提取 script
  const scriptRegex = /<script[^>]*src\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let m;
  while ((m = scriptRegex.exec(html)) !== null) {
    report.scripts.push(m[1]);
  }

  // 提取链接
  const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi;
  while ((m = linkRegex.exec(html)) !== null) {
    if (m[1] && !m[1].startsWith('#') && !m[1].startsWith('javascript:')) {
      report.links.push(m[1]);
    }
  }

  // 提取 meta
  const metaRegex = /<meta[^>]*>/gi;
  report.metaTags = html.match(metaRegex)?.map((t) => t.trim()) || [];

  // 提取 DOM 骨架（只显示标签名，不含内容和属性）
  const skeletonRegex = /<\/?(\w+)[^>]*>/g;
  const tags: string[] = [];
  let depth = 0;
  while ((m = skeletonRegex.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    if (m[0].startsWith('</')) {
      depth = Math.max(0, depth - 1);
    } else if (!m[0].endsWith('/>') && !['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tag)) {
      tags.push('  '.repeat(depth) + '<' + tag + '>');
      depth++;
    } else {
      tags.push('  '.repeat(depth) + '<' + tag + ' />');
    }
  }
  report.skeleton = tags.slice(0, 60).join('\n');

  // 可疑关键词扫描
  const suspiciousPatterns = [
    /flag\{/gi, /password/gi, /secret/gi, /admin/gi,
    /TODO/gi, /FIXME/gi, /hack/gi, /backdoor/gi,
  ];
  for (const pattern of suspiciousPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      for (const match of matches) {
        report.suspicious.push(`发现关键词: "${match}" → 周围的代码中可能藏有线索`);
      }
    }
  }

  return report;
}

export default function WebToolsPage() {
  const [activeTab, setActiveTab] = usePersistedState<WebTab>('web-tab', 'source');
  const [url, setUrl] = usePersistedState('web-url', '');
  const [source, setSource] = useState('');
  const [report, setReport] = useState<SourceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFull, setShowFull] = useState(false);

  const fetchSource = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setReport(null);
    setShowFull(false);
    try {
      const res = await fetch(url);
      const text = await res.text();
      setSource(text);
      setReport(analyzeSource(text));
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
            {report && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2 text-center">
                  ⚠️ 以下为智能提取的关键信息，非完整源码。点击底部按钮可查看原始代码。
                </p>

                {/* 页面概览 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">📋 页面概览</h4>
                  <p className="text-sm text-gray-700">
                    标题：<span className="font-mono text-primary-600">{report.title}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    发现 {report.comments.length} 条注释 · {report.hiddenInputs.length} 个隐藏输入
                    · {report.suspicious.length} 处可疑关键词
                  </p>
                </div>

                {/* 注释 */}
                {report.comments.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-yellow-700 mb-2">💬 HTML 注释（可能藏有秘密）</h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {report.comments.map((c, i) => (
                        <div key={i} className="font-mono text-xs text-yellow-800 bg-yellow-100 rounded-lg p-2 whitespace-pre-wrap break-all">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 隐藏输入 */}
                {report.hiddenInputs.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-purple-700 mb-2">🔒 隐藏输入字段</h4>
                    {report.hiddenInputs.map((input, i) => (
                      <div key={i} className="font-mono text-xs text-purple-800 break-all">{input}</div>
                    ))}
                  </div>
                )}

                {/* 表单 */}
                {report.forms.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">📝 表单</h4>
                    {report.forms.map((form, i) => (
                      <div key={i} className="font-mono text-xs text-blue-800 break-all">{form}</div>
                    ))}
                  </div>
                )}

                {/* 脚本引用 */}
                {report.scripts.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">📜 外部脚本</h4>
                    {report.scripts.map((src, i) => (
                      <div key={i} className="font-mono text-xs text-gray-600 truncate">{src}</div>
                    ))}
                  </div>
                )}

                {/* 页面链接 */}
                {report.links.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">🔗 页面链接</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {report.links.slice(0, 20).map((href, i) => (
                        <div key={i} className="font-mono text-xs text-blue-600 hover:underline truncate">{href}</div>
                      ))}
                    </div>
                    {report.links.length > 20 && (
                      <p className="text-xs text-gray-400 mt-1">...还有 {report.links.length - 20} 个链接</p>
                    )}
                  </div>
                )}

                {/* DOM 骨架 */}
                {report.skeleton && (
                  <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <summary className="text-sm font-semibold text-gray-600 cursor-pointer">🏗️ DOM 结构骨架（点击展开）</summary>
                    <pre className="mt-3 text-xs text-gray-500 font-mono overflow-x-auto max-h-48">{report.skeleton}</pre>
                  </details>
                )}

                {/* 可疑发现 */}
                {report.suspicious.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2">🚩 可疑发现</h4>
                    {report.suspicious.map((s, i) => (
                      <div key={i} className="text-sm text-red-600 font-mono">{s}</div>
                    ))}
                  </div>
                )}

                {/* 原始代码切换 */}
                <div className="text-center">
                  <button
                    onClick={() => setShowFull(!showFull)}
                    className="text-xs text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {showFull ? '▲ 收起完整源码' : '▼ 查看完整源码（仅供进阶参考）'}
                  </button>
                </div>
                {showFull && (
                  <textarea
                    readOnly
                    value={source}
                    className="input-field h-96 font-mono text-xs bg-gray-900 text-green-400"
                  />
                )}
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