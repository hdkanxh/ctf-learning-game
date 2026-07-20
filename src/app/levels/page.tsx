'use client';

import Link from 'next/link';
import { levels } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';

const categoryLabel: Record<string, string> = {
  crypto: '🔐 密码学',
  misc: '🧩 杂项',
  web: '🌐 Web安全',
  re: '🔧 逆向工程',
  pwn: '💻 二进制',
  story: '📖 剧情',
};

export default function LevelsPage() {
  const { progress, isLevelUnlocked } = useProgress();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🗺️ 关卡地图</h1>
        <p className="text-gray-500">
          已解锁 {progress.completedLevels.length + 1} / {levels.length} 关
        </p>
      </div>

      <div className="space-y-3">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id);
          const completed = progress.completedLevels.includes(level.id);

          return (
            <Link
              key={level.id}
              href={unlocked ? `/levels/${level.id}` : '#'}
              className={`card p-5 flex items-center gap-4 transition-all ${
                unlocked
                  ? 'hover:shadow-md cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              } ${completed ? 'border-success-500 border-2 bg-green-50/30' : ''}`}
            >
              {/* 状态图标 */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                completed
                  ? 'bg-success-500 text-white'
                  : unlocked
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {completed ? '✅' : unlocked ? level.id : '🔒'}
              </div>

              {/* 关卡信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    第 {level.id} 关
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-700">{level.title}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {level.category.map((cat) => (
                    <span key={cat} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {categoryLabel[cat] || cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* 箭头 */}
              {unlocked && (
                <span className="text-gray-300 text-xl">→</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}