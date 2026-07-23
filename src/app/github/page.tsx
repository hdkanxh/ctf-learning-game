'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GitHubPage() {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <p className="text-5xl mb-4">⭐</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">支持这个项目</h1>
        <p className="text-gray-500">开源不易，你的 Star 是我持续更新的动力</p>
      </div>

      {/* 第一步：是否有 GitHub 账号 */}
      <div className="card p-6 mb-6 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-4">你是否有 GitHub 账号？</h2>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setHasAccount(true)}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              hasAccount === true
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✅ 有账号
          </button>
          <button
            onClick={() => setHasAccount(false)}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              hasAccount === false
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ❌ 还没有
          </button>
        </div>
      </div>

      {/* 有账号 → 跳转仓库 */}
      {hasAccount === true && (
        <div className="card p-6 mb-6 text-center animate-slide-up">
          <p className="text-4xl mb-4">🚀</p>
          <p className="text-gray-600 mb-4">太棒了！点击下方按钮前往项目仓库</p>
          <a
            href="https://github.com/hdkanxh/ctf-learning-game"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            ⭐ 去 GitHub 给项目点个 Star
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Star 是 GitHub 上的"收藏+点赞"，帮助更多人发现这个项目
          </p>
        </div>
      )}

      {/* 没有账号 → 注册教程 */}
      {hasAccount === false && (
        <div className="card p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-gray-800 mb-4 text-center">📝 GitHub 注册指南</h3>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-medium text-blue-700 mb-2">🌐 访问加速</p>
              <p>GitHub 在国内直接访问可能不稳定，推荐使用以下免费工具加速：</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>Watt Toolkit（原 Steam++）</strong>：免费开源，支持 GitHub 加速。<br />
                  <span className="text-blue-500">下载：</span><a href="https://steampp.net" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">steampp.net</a></li>
                <li><strong>FastGithub</strong>：专为 GitHub 加速设计。<br />
                  <span className="text-blue-500">下载：</span><a href="https://github.com/dotnetcore/FastGithub" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">github.com/dotnetcore/FastGithub</a></li>
                <li><strong>dev-sidecar</strong>：开发者边车，一键解决 GitHub 访问。<br />
                  <span className="text-blue-500">下载：</span><a href="https://github.com/docmirror/dev-sidecar" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">github.com/docmirror/dev-sidecar</a></li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-medium text-green-700 mb-2">📋 注册步骤</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>打开上述加速工具后访问 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-mono underline hover:text-green-800">github.com</a></li>
                <li>点击右上角 <strong>Sign up</strong></li>
                <li>输入邮箱 → 设置密码 → 设置用户名</li>
                <li>完成邮箱验证</li>
                <li>注册完成后回到本页面点「有账号」</li>
              </ol>
            </div>

            <button
              onClick={() => setHasAccount(true)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              ✅ 已注册完成，我有账号了
            </button>
          </div>
        </div>
      )}

      {/* Git vs GitHub 科普 */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">📖 Git 和 GitHub 是什么？</h3>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">🔧 Git — 版本控制工具</p>
            <p>Git 是一个<strong>免费的分布式版本控制系统</strong>，由 Linux 之父 Linus Torvalds 于 2005 年创建。</p>
            <p className="mt-1">它可以记录文件的每一次修改，让你随时回退到之前的版本、查看是谁改了什么、合并多人协作的代码——是现代软件开发的基础工具。</p>
            <div className="mt-2 bg-white rounded-lg p-3 text-xs font-mono space-y-1">
              <p className="text-gray-400"># Windows 安装 Git</p>
              <p className="text-gray-600">1. 访问 <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">git-scm.com</a> 下载安装包</p>
              <p className="text-gray-600">2. 一路 Next 安装（默认选项即可）</p>
              <p className="text-gray-600">3. 安装完成后，Win+R 打开运行，输入 cmd 回车打开命令提示符，输入 git --version 验证</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">🐙 GitHub — 代码托管平台</p>
            <p>GitHub 是全球最大的<strong>代码托管和协作平台</strong>，2008 年上线，2018 年被微软以 75 亿美元收购。</p>
            <p className="mt-1">它基于 Git 构建，提供网页界面让你在云端存储代码、管理项目、协作开发、发布开源软件。到今天，GitHub 拥有超过 1 亿开发者用户，是程序员必备工具之一。</p>
            <p className="mt-1">像 VS Code、React、Python、Linux——你熟悉的大部分技术，源码都在 GitHub 上开源。</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-medium text-amber-700 mb-2">💡 一句话区分</p>
            <p><strong>Git</strong> 是工具（装在你电脑上），<strong>GitHub</strong> 是网站（存在云端的仓库）。你可以不用 GitHub 只用 Git，但 GitHub 让 Git 的使用体验提升了几个量级。</p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="font-medium text-primary-700 mb-2">🎓 对计算机学习的重要性</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>📂 <strong>作品集</strong>：GitHub 就是你的在线简历，所有项目代码一目了然</li>
              <li>🔍 <strong>学习资源</strong>：全球无数优质开源项目供你阅读和借鉴</li>
              <li>🤝 <strong>协作能力</strong>：几乎所有科技公司都用 Git + GitHub 进行团队协作</li>
              <li>🏆 <strong>社区参与</strong>：通过 Issue、Pull Request 与全球开发者交流</li>
              <li>📝 <strong>版本管理</strong>：再也不用"毕业论文_v1_v2_最终版_真的最终版.docx"</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="btn-secondary text-sm">← 返回首页</Link>
      </div>
    </div>
  );
}
