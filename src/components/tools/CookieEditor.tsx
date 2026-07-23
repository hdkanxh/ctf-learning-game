'use client';

import { useState, useEffect } from 'react';

interface CookieEntry {
  name: string;
  value: string;
}

export default function CookieEditor() {
  const [cookies, setCookies] = useState<CookieEntry[]>([]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  // 读取当前页面的 Cookie
  useEffect(() => {
    const parsed = document.cookie.split(';').filter(Boolean).map((c) => {
      const [name, ...rest] = c.trim().split('=');
      return { name: name.trim(), value: rest.join('=').trim() };
    });
    setCookies(parsed);
  }, []);

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
    setCookies((prev) => {
      const exists = prev.findIndex((c) => c.name === name);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = { name, value };
        return updated;
      }
      return [...prev, { name, value }];
    });
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setCookies((prev) => prev.filter((c) => c.name !== name));
  };

  const handleAdd = () => {
    if (newName.trim()) {
      setCookie(newName.trim(), newValue.trim());
      setNewName('');
      setNewValue('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 查看和修改浏览器 Cookie。某些网站用 Cookie 存储用户身份，修改 Cookie 可能绕过权限验证。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 Cookie 是什么？</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>Cookie 是服务器存储在浏览器中的一小段数据（通常不超过 4KB），用于在多个请求之间维持状态。</p>
          <p><strong>常见用途</strong>：登录会话（Session）、用户偏好、购物车、追踪标识</p>
          <p><strong>安全属性</strong>：HttpOnly（JS 不可读）、Secure（仅 HTTPS 传输）、SameSite（防 CSRF）</p>
          <p>在 CTF 中，如果服务器仅靠 Cookie 判断用户身份而未做签名验证，修改 Cookie 值即可伪装成他人。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：服务器用 Cookie 值来判断用户身份（如 admin=0 改为 1），但未做加密签名。你需要修改 Cookie 来提权。进阶考法：破解弱 JWT 密钥、利用反序列化漏洞、或通过 XSS 窃取他人的 Cookie。</p>
        </div>
      </details>

      {/* 当前 Cookie 列表 */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">当前 Cookie</h3>
        {cookies.length === 0 ? (
          <p className="text-sm text-gray-400">暂无 Cookie</p>
        ) : (
          <div className="space-y-2">
            {cookies.map((c) => (
              <div key={c.name} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="font-mono text-sm font-bold text-gray-700">{c.name}</span>
                <span className="text-gray-300">=</span>
                <input
                  type="text"
                  defaultValue={c.value}
                  onBlur={(e) => setCookie(c.name, e.target.value)}
                  className="flex-1 font-mono text-sm bg-white border border-gray-200 rounded px-2 py-1"
                />
                <button
                  onClick={() => deleteCookie(c.name)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加新 Cookie */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">添加 Cookie</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="名称"
            className="input-field w-1/3 py-2 text-sm"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="值"
            className="input-field flex-1 py-2 text-sm"
          />
          <button onClick={handleAdd} className="btn-primary text-sm py-2">添加</button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">💡 常用示例（点击快速填入）：</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: 'role', value: 'admin' },
              { name: 'is_admin', value: 'true' },
              { name: 'user_level', value: '999' },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => { setNewName(preset.name); setNewValue(preset.value); }}
                className="text-xs bg-white border border-gray-200 px-2 py-1 rounded hover:bg-primary-50 hover:border-primary-200 transition-colors font-mono"
              >
                {preset.name}={preset.value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}