'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, c) => {
      const [key, val] = c.trim().split('=');
      if (key) acc[key.trim()] = val ? val.trim() : '';
      return acc;
    }, {});
    setRole(cookies['role'] || 'guest');
  }, []);

  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-800">🌑 Eclipse&apos;s Blog</span>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="/challenges/eclipse-blog" className="hover:text-gray-800">首页</a>
            <a href="/challenges/eclipse-blog/admin" className="hover:text-gray-800 text-primary-600 font-bold">会员专区</a>
            <a href="/challenges/eclipse-blog/files" className="hover:text-gray-800">文件</a>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🔒 会员专区</h1>

        {role === null ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-400">加载中...</p>
          </div>
        ) : isAdmin ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border-2 border-green-400">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-xl font-semibold text-green-700 mb-2">欢迎回来，管理员！</h2>
            <p className="text-gray-600 mb-4">以下是会员专享内容：</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-green-600 mb-1">🔑 系统 Flag：</p>
              <p className="font-mono text-lg text-green-800 font-bold">
                flag&#123;c00k13_m4n1pul4t10n&#125;
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-5xl mb-4">🚫</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">访问被拒绝</h2>
            <p className="text-gray-500 mb-4">此区域仅限会员访问。请先登录。</p>
            <div className="bg-gray-50 rounded-lg p-4 text-left max-w-xs mx-auto">
              <p className="text-sm text-gray-400 mb-2">当前身份信息：</p>
              <p className="font-mono text-sm">
                Cookie: <span className="text-gray-600">role={role}</span>
              </p>
              <p className="font-mono text-sm mt-1">
                权限: <span className="text-red-500 font-bold">{role}（访客）</span>
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              提示：也许你可以试着改变自己的"身份"？
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
