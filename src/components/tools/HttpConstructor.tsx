'use client';

import { useState } from 'react';

export default function HttpConstructor() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('');
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
          placeholder='{"User-Agent": "EclipseBot/1.0", "Referer": "http://admin"}'
        />
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