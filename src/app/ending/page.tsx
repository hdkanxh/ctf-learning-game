'use client';

import { useProgress } from '@/hooks/useProgress';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EndingPage() {
  const { progress } = useProgress();
  const [showContent, setShowContent] = useState(false);

  const allCleared = progress.completedLevels.length >= 21; // 0-20 共 21 关

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!allCleared) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">尚未通关</h2>
        <p className="text-gray-500">请先完成所有关卡再回来。</p>
        <Link href="/levels" className="btn-primary mt-6 inline-block">返回关卡</Link>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto text-center ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* 大标题 */}
      <p className="text-6xl mb-6">🏆</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        恭喜通关！
      </h1>
      <p className="text-xl text-gray-500 mb-8">
        你成功追踪到了 Eclipse 的真实位置
      </p>

      {/* 故事结局 */}
      <div className="card p-8 mb-8 text-left">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📖 结局</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            根据最终 flag 揭示的坐标——<strong>北京市海淀区</strong>——
            联盟迅速派出了行动小组。
          </p>
          <p>
            但他们找到的并不是一个黑客巢穴，而是一间普通的办公室。
            桌上放着一封信：
          </p>
          <div className="bg-gray-50 border-l-4 border-primary-400 p-4 italic text-gray-500">
            &ldquo;恭喜你走到了最后。我叫林晨，是网络安全联盟的前安全研究员。
            这场'入侵'实际上是一次精心策划的人才选拔测试。
            你通过的 20 道关卡涵盖了 CTF 的五大核心方向。
            如果你在读这封信，说明你具备了成为一名安全研究员的基本素养。
            联盟需要你这样的人才。&rdquo;
          </div>
          <p>
            Eclipse 并不是敌人，而是一位用独特方式寻找接班人的导师。
            他的真实身份是联盟的前首席安全研究员，一年前&ldquo;退休&rdquo;后
            设计了这套选拔系统。
          </p>
          <p className="font-medium text-gray-700">
            你的表现证明了你拥有网络安全领域最重要的品质：
            好奇心、耐心和永不放弃的精神。
          </p>
        </div>
      </div>

      {/* 通关统计 */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📊 你的成绩</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-400">完成关卡</p>
            <p className="text-2xl font-bold text-primary-600">22 / 22</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-400">开始时间</p>
            <p className="text-sm font-mono text-gray-700">
              {progress.startedAt
                ? new Date(progress.startedAt).toLocaleDateString('zh-CN')
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Writeup 入口 */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/writeups" className="btn-primary">
          📝 查看完整 Writeup
        </Link>
        <Link href="/levels" className="btn-secondary">
          🗺️ 回顾关卡
        </Link>
      </div>

      <p className="text-gray-300 text-sm mt-12">
        CTF 冒险岛 — 你的网络安全之旅才刚刚开始 🚀
      </p>
    </div>
  );
}