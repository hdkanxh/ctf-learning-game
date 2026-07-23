'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';

export default function HttpConstructor() {
  const [url, setUrl] = usePersistedState('http-url', '');
  const [method, setMethod] = usePersistedState('http-method', 'GET');
  const [headers, setHeaders] = usePersistedState('http-headers', '{}');
  const [body, setBody] = usePersistedState('http-body', '');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendRequest = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    setResponse('');

    try {
      let parsedHeaders: Record<string, string> = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch {
        setError('Headers JSON 格式错误');
        setLoading(false);
        return;
      }

      const fetchOptions: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json', ...parsedHeaders },
      };

      if (method !== 'GET' && method !== 'HEAD' && body) {
        fetchOptions.body = body;
      }

      const res = await fetch(url, fetchOptions);
      const text = await res.text();

      setResponse(
        `状态码: ${res.status} ${res.statusText}\n\n响应头:\n${JSON.stringify(
          Object.fromEntries(res.headers.entries()),
          null,
          2
        )}\n\n响应体:\n${text}`
      );
    } catch (err: any) {
      setError(err.message || '请求失败（跨域限制可能导致某些 URL 无法访问）');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 构造自定义 HTTP 请求。修改请求方法、请求头或参数，模拟各种攻击场景。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 HTTP 请求基础</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>HTTP（超文本传输协议）是 Web 通信的基础。每次访问网页，浏览器都会向服务器发送 HTTP 请求。</p>
          <p><strong>请求方法</strong>：GET（获取数据）、POST（提交数据）、PUT（更新）、DELETE（删除）</p>
          <p><strong>请求头（Headers）</strong>：附加的元数据，如 User-Agent（客户端标识）、Cookie（身份凭证）、Referer（来源页面）</p>
          <p>在 CTF 中，通过修改请求头来绕过权限验证是最常见的 Web 攻击手法之一。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：Web 题通常提供一个网站环境，你需要修改 HTTP 请求头（如伪造 User-Agent、添加 X-Forwarded-For、篡改 Referer）来绕过服务器的权限验证。还可能涉及 JWT Token 伪造、Session 劫持等进阶技巧。</p>
        </div>
      </details>

      {/* URL + Method */}
      <div className="flex gap-3">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="input-field w-28 py-2"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL 地址"
          className="input-field flex-1"
        />
      </div>

      {/* 请求头 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          自定义请求头（JSON 格式）
        </label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="input-field h-20 font-mono text-sm"
          placeholder='{"User-Agent": "EclipseBot/1.0"}'
        />
        <p className="text-xs text-gray-400 mt-1">
          💡 格式：&#123;"Header名": "值"&#125;，多个用逗号分隔
        </p>
      </div>

      {/* 请求体 */}
      {method !== 'GET' && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">请求体</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-field h-24 font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={sendRequest} disabled={loading} className="btn-primary">
          {loading ? '发送中...' : '📨 发送请求'}
        </button>

        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setHeaders('{"User-Agent": "EclipseBot/1.0"}')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-mono"
          >
            EclipseBot UA
          </button>
          <button
            onClick={() => setHeaders('{"Referer": "https://admin.eclipse.local"}')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-mono"
          >
            Referer 伪造
          </button>
          <button
            onClick={() => setUrl('/api/verify-flag')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-mono"
          >
            /api/verify-flag
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ❌ {error}
        </div>
      )}

      {response && (
        <div className="relative">
          <textarea
            readOnly
            value={response}
            className="input-field h-80 font-mono text-xs bg-gray-900 text-green-400"
          />
        </div>
      )}
    </div>
  );
}