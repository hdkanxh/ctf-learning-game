'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ctf-game-progress';

export interface ProgressData {
  completedLevels: number[];   // 已完成的关卡 ID
  unlockedHints: Record<number, number>; // 每关已解锁的提示数量
  startedAt: string | null;    // 首次游戏时间
}

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') {
    return { completedLevels: [], unlockedHints: {}, startedAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // 损坏了就重置
  }
  return { completedLevels: [], unlockedHints: {}, startedAt: null };
}

function saveProgress(data: ProgressData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  // 首次加载时设 startedAt
  useEffect(() => {
    const current = loadProgress();
    if (!current.startedAt) {
      const updated = { ...current, startedAt: new Date().toISOString() };
      saveProgress(updated);
      setProgress(updated);
    }
  }, []);

  // 标记关卡完成
  const completeLevel = useCallback((levelId: number) => {
    setProgress((prev) => {
      if (prev.completedLevels.includes(levelId)) return prev;
      const updated = {
        ...prev,
        completedLevels: [...prev.completedLevels, levelId],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // 解锁提示
  const unlockHint = useCallback((levelId: number, hintIndex: number) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        unlockedHints: {
          ...prev.unlockedHints,
          [levelId]: Math.max(prev.unlockedHints[levelId] || 0, hintIndex + 1),
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  // 判断关卡是否解锁（前一个关卡必须完成）
  const isLevelUnlocked = useCallback((levelId: number): boolean => {
    if (levelId === 0) return true;
    return progress.completedLevels.includes(levelId - 1);
  }, [progress.completedLevels]);

  // 获取关卡已解锁的提示数
  const getUnlockedHints = useCallback((levelId: number): number => {
    return progress.unlockedHints[levelId] || 0;
  }, [progress.unlockedHints]);

  // 重置进度
  const resetProgress = useCallback(() => {
    const empty: ProgressData = { completedLevels: [], unlockedHints: {}, startedAt: null };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    completeLevel,
    unlockHint,
    isLevelUnlocked,
    getUnlockedHints,
    resetProgress,
  };
}