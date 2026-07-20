'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getLevelById } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = Number(params.id);
  const level = getLevelById(levelId);

  const { progress, completeLevel, unlockHint, isLevelUnlocked, getUnlockedHints } = useProgress();

  const [flagInput, setFlagInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!level) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">关卡不存在</h2>
        <p className="text-gray-500">找不到第 {levelId} 关</p>
      </div>
    );
  }

  if (!isLevelUnlocked(levelId)) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">关卡未解锁</h2>
        <p className="text-gray-500">请先完成前面的关卡</p>
        <button onClick={() => router.push('/levels')} className="btn-primary mt-6">
          返回关卡地图
        </button>
      </div>
    );
  }

  const completed = progress.completedLevels.includes(levelId);
  const unlockedHintCount = getUnlockedHints(levelId);

  const handleSubmit = async () => {
    if (!flagInput.trim()) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/verify-flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId, flag: flagInput.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        completeLevel(levelId);
        // 3 秒后自动跳转下一关
        setTimeout(() => {
          router.push(`/levels/${levelId + 1}`);
        }, 2000);
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch {
      setFeedback({ type: 'error', message: '网络错误，请重试' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowHint = (index: number) => {
    unlockHint(levelId, index);
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      {/* 关卡标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
            #{levelId}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">{level.title}</h1>
          {completed && (
            <span className="badge bg-success-50 text-success-600 border border-success-200">
              ✅ 已完成
            </span>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {level.category.map((cat) => (
            <span key={cat} className={`badge ${
              cat === 'crypto' ? 'badge-crypto' :
              cat === 'misc' ? 'badge-misc' :
              cat === 'web' ? 'badge-web' :
              cat === 're' ? 'badge-re' :
              cat === 'pwn' ? 'badge-pwn' :
              'bg-gray-100 text-gray-600'
            }`}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* 剧情 */}
      <div className="card p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">📖 剧情</h3>
        <p className="text-gray-700 leading-relaxed">{level.description}</p>
      </div>

      {/* 题目内容 */}
      {level.content && (
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">🔍 谜题</h3>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 break-all">
            {level.content}
          </div>
        </div>
      )}

      {/* 下载附件 */}
      {level.downloadFiles && level.downloadFiles.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">📎 附件</h3>
          <div className="flex gap-2 flex-wrap">
            {level.downloadFiles.map((file) => (
              <a
                key={file}
                href={`/challenges/${file}`}
                download
                className="btn-secondary text-sm py-2 px-4"
              >
                📥 {file}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 推荐工具 */}
      {level.tools.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">🔧 推荐工具</h3>
          <div className="flex gap-2 flex-wrap">
            {level.tools.map((tool) => (
              <a
                key={tool}
                href={`/tools#${tool}`}
                className="text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                🛠️ {tool}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 提示系统 */}
      {level.hints.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">💡 提示</h3>
          <div className="space-y-2">
            {level.hints.map((hint, index) => {
              const isRevealed = index < unlockedHintCount || (level.id <= 3 && index === 0); // 前4关默认展示第1条
              return (
                <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                  {isRevealed ? (
                    <div className="p-3 bg-amber-50 text-amber-800 text-sm">
                      💡 提示 {index + 1}：{hint}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleShowHint(index)}
                      className="w-full p-3 text-left text-sm text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      🔒 点击查看提示 {index + 1}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flag 提交 */}
      <div className="card p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">🚩 提交 Flag</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="flag{...}"
            className="input-field flex-1"
            disabled={completed}
          />
          <button
            onClick={handleSubmit}
            disabled={completed || submitting || !flagInput.trim()}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '验证中...' : '✅ 提交'}
          </button>
        </div>
        {feedback && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* 导航 */}
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/levels')}
          className="btn-secondary text-sm"
        >
          ← 关卡地图
        </button>
        {completed && (
          <button
            onClick={() => router.push(`/levels/${levelId + 1}`)}
            className="btn-primary text-sm"
          >
            下一关 →
          </button>
        )}
      </div>
    </div>
  );
}