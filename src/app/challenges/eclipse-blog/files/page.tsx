'use client';

import { useState } from 'react';

// 虚拟文件系统
interface FileTree {
  [key: string]: string | FileTree;
}

const fileSystem: FileTree = {
  'public': {
    'welcome.txt': '欢迎使用 Eclipse 文件系统 v2.0。\n\n可用文件：\nwelcome.txt · about.txt · notes.txt\n\n试试浏览不同的文件夹？',
    'about.txt': '关于 Eclipse：\n一位热爱网络安全的独立研究者。\n喜欢在深夜里写代码。\n偶尔也喜欢登山。',
    'notes.txt': '开发笔记：\n1. 文件浏览功能上线\n2. TODO: 把 secret 文件夹藏好，不要让人翻到上级目录\n3. 不过……谁会去翻上级目录呢？',
  },
  'secret': {
    'flag.txt': 'flag{p4th_tr4v3rs4l_3z}',
  },
  'src': {
    'app.js': '// Eclipse Blog v2.0\n// 文件系统模块\nconst fs = require("fs");\n// ...',
  },
};

type PathSeg = string[];

export default function FilesPage() {
  const [currentPath, setCurrentPath] = useState<PathSeg>(['public']);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // 根据路径获取当前目录内容（空路径 = 根目录）
  const getDir = (path: PathSeg): FileTree | null => {
    if (path.length === 0) return fileSystem;
    let current: any = fileSystem;
    for (const seg of path) {
      current = current?.[seg];
      if (typeof current === 'string') return null;
    }
    return typeof current === 'object' ? current : null;
  };

  const currentDir = getDir(currentPath);
  const breadcrumbPath = '/var/www/eclipse-blog/' + currentPath.join('/');

  const entries = currentDir
    ? Object.entries(currentDir).map(([name, content]) => ({
        name,
        isDir: typeof content === 'object',
      }))
    : [];

  const handleClick = (name: string, isDir: boolean) => {
    if (isDir) {
      setCurrentPath([...currentPath, name]);
      setSelectedFile(null);
    } else {
      setSelectedFile(name);
    }
  };

  const handleGoUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFile(null);
    }
  };

  const handleGoRoot = () => {
    setCurrentPath(['public']);
    setSelectedFile(null);
  };

  const fileContent = selectedFile && typeof currentDir?.[selectedFile] === 'string'
    ? currentDir[selectedFile] as string
    : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-800">🌑 Eclipse&apos;s Blog</span>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="/challenges/eclipse-blog" className="hover:text-gray-800">首页</a>
            <a href="/challenges/eclipse-blog/admin" className="hover:text-gray-800">会员专区</a>
            <a href="/challenges/eclipse-blog/files" className="hover:text-gray-800 text-primary-600 font-bold">文件</a>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📁 文件浏览器</h1>

        {/* 面包屑导航 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center gap-2 text-sm font-mono flex-wrap">
          <button onClick={handleGoRoot} className="text-gray-400 hover:text-primary-500" title="重置">
            🏠
          </button>
          <span className="text-gray-300">/</span>
          {currentPath.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className={i === currentPath.length - 1 ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
                {seg}
              </span>
              {i < currentPath.length - 1 && <span className="text-gray-300">/</span>}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 文件/文件夹列表 */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-3">
            <div className="text-xs text-gray-400 font-medium mb-2 px-2">当前目录内容</div>

            {/* 上级目录按钮 */}
            {currentPath.length > 0 && (
              <button
                onClick={handleGoUp}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-500"
              >
                <span>📁</span>
                <span className="font-mono">..</span>
                <span className="text-xs text-gray-400">上级目录</span>
              </button>
            )}

            {entries.map((entry) => (
              <button
                key={entry.name}
                onClick={() => handleClick(entry.name, entry.isDir)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm ${
                  selectedFile === entry.name ? 'bg-primary-50 border border-primary-200' : ''
                }`}
              >
                <span>{entry.isDir ? '📁' : '📄'}</span>
                <span className="font-mono text-gray-700 truncate">{entry.name}</span>
              </button>
            ))}

            {entries.length === 0 && (
              <p className="text-xs text-gray-400 px-2 py-4 text-center">空目录</p>
            )}
          </div>

          {/* 文件内容 */}
          <div className="md:col-span-2">
            {fileContent ? (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-xs text-gray-400 font-medium mb-2 font-mono">
                  📄 {selectedFile}
                </div>
                <pre className="text-sm text-gray-700 font-mono bg-gray-50 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
                  {fileContent}
                </pre>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-4xl mb-3">👈</p>
                <p className="text-sm text-gray-400">点击左侧文件查看内容</p>
                <p className="text-xs text-gray-300 mt-2">
                  也可以浏览不同的文件夹
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
