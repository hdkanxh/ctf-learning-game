'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

export default function HomePage() {
  const { progress } = useProgress();

  const completedCount = progress.completedLevels.length;
  const totalLevels = 21; // 不含结局（22）

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Hero */}
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CTF 冒险岛
        </h1>
        <p className="text-lg text-gray-500 mb-2">
          一个面向零基础新手的 CTF 入门闯关平台
        </p>
        <p className="text-sm text-gray-400 mb-8">
          无需安装任何工具 · 浏览器即玩 · 2-3 小时通关
        </p>

        {/* 进度条 */}
        {progress.startedAt && (
          <div className="mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>🗺️ 探索进度</span>
              <span>{completedCount} / {totalLevels} 关</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-400 to-primary-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalLevels) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA 按钮 */}
        <div className="flex gap-4 justify-center flex-wrap">
          {!progress.startedAt ? (
            <Link href="/levels/0" className="btn-primary text-lg px-8 py-4">
              🎮 开始冒险
            </Link>
          ) : (
            <>
              <Link
                href={`/levels/${progress.completedLevels.length}`}
                className="btn-primary text-lg px-8 py-4"
              >
                ▶️ 继续冒险
              </Link>
              <Link href="/levels" className="btn-secondary text-lg px-8 py-4">
                🗺️ 关卡地图
              </Link>
            </>
          )}
        </div>

        {/* 背景故事 */}
        <div className="mt-12 card p-8 text-left">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📖</span> 背景故事
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              三天前，一名代号为 <strong className="text-red-500">Eclipse</strong> 的神秘黑客
              入侵了「网络安全联盟」的核心数据库，窃取了全球安全研究人员的身份档案。
            </p>
            <p>
              但奇怪的是——Eclipse 并没有直接公开数据，而是留下了一条消息：
            </p>
            <div className="bg-gray-50 border-l-4 border-primary-400 p-4 rounded-r-lg italic text-gray-500">
              &ldquo;想拿回数据？那就来追我吧。我留下了 20 道谜题，只有真正的网络安全人才配走到最后。
              每条谜题的答案（flag）是一把钥匙碎片。集齐所有碎片，就能找到我。&rdquo;
            </div>
            <p>
              联盟现正式邀请你作为独立调查员，追踪 Eclipse 的数字足迹。
            </p>
            <p className="font-medium text-gray-700">
              📁 你的任务：解谜 → 收集 flag → 找到 Eclipse 的真实位置
            </p>
            <p className="text-sm text-gray-400">
              💡 提示：flag 格式为 flag&#123;...&#125;，过关后输入 flag 即可进入下一关
            </p>
          </div>
        </div>

        {/* 学习方向预览 */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: '🔐', label: '密码学', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { icon: '🧩', label: '杂项', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { icon: '🌐', label: 'Web安全', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { icon: '🔧', label: '逆向工程', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { icon: '💻', label: '二进制', color: 'bg-red-50 text-red-700 border-red-200' },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.color} border rounded-xl p-3 text-center text-sm font-medium`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}