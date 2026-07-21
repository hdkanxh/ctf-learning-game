'use client';

import { useState } from 'react';
import { caesarDecrypt, base64Decode, reverseString, rot13, railFenceDecrypt } from '@/lib/crypto';

interface PipelineStep {
  id: string;
  type: string;
  label: string;
  params?: Record<string, number | string>;
}

const availableSteps = [
  { type: 'caesar', label: '凯撒解密', icon: '🔄' },
  { type: 'base64', label: 'Base64 解码', icon: '📝' },
  { type: 'reverse', label: '逆序', icon: '↔️' },
  { type: 'rot13', label: 'ROT13', icon: '🔃' },
  { type: 'railfence', label: '栅栏解密', icon: '🏗️' },
];

export default function PipelineTool() {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [output, setOutput] = useState('');
  const [railCount, setRailCount] = useState(3);
  const [caesarShift, setCaesarShift] = useState(3);

  const addStep = (type: string, label: string) => {
    const newStep: PipelineStep = {
      id: `${type}-${Date.now()}`,
      type,
      label,
      params: type === 'caesar' ? { shift: caesarShift } : type === 'railfence' ? { rails: railCount } : undefined,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;
    [newSteps[index], newSteps[targetIdx]] = [newSteps[targetIdx], newSteps[index]];
    setSteps(newSteps);
  };

  const executePipeline = () => {
    let result = input;
    for (const step of steps) {
      try {
        switch (step.type) {
          case 'caesar':
            result = caesarDecrypt(result, caesarShift);
            break;
          case 'base64':
            result = base64Decode(result);
            break;
          case 'reverse':
            result = reverseString(result);
            break;
          case 'rot13':
            result = rot13(result);
            break;
          case 'railfence':
            result = railFenceDecrypt(result, railCount);
            break;
        }
      } catch {
        result = '[解码失败，请检查上一步的输出]';
        break;
      }
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 当密文经过多层编码时，可以在这里拖拽组合解码步骤，形成一条流水线，一次性完成全部解码。
      </div>

      {/* 输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">原始密文</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field h-24 font-mono"
          placeholder="在此粘贴密文..."
        />
      </div>

      {/* 添加步骤 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">添加解码步骤（按顺序执行）</label>
        <div className="flex gap-2 flex-wrap">
          {availableSteps.map((s) => (
            <button
              key={s.type}
              onClick={() => addStep(s.type, s.label)}
              className="px-3 py-2 rounded-lg text-sm bg-gray-100 hover:bg-primary-50 hover:text-primary-600 transition-colors border border-gray-200"
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 凯撒偏移设置 */}
      {steps.some((s) => s.type === 'caesar') && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-sm text-gray-600">凯撒偏移量：</label>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={25} value={caesarShift}
              onChange={(e) => setCaesarShift(Number(e.target.value))}
              className="flex-1 accent-primary-500" />
            <span className="font-mono font-bold">{caesarShift}</span>
          </div>
        </div>
      )}

      {/* 栅栏行数设置 */}
      {steps.some((s) => s.type === 'railfence') && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-sm text-gray-600">栅栏行数：</label>
          <div className="flex items-center gap-2">
            <input type="range" min={2} max={10} value={railCount}
              onChange={(e) => setRailCount(Number(e.target.value))}
              className="flex-1 accent-primary-500" />
            <span className="font-mono font-bold">{railCount}</span>
          </div>
        </div>
      )}

      {/* 步骤流水线可视化 */}
      {steps.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">解码流水线：</label>
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono">📥 输入</span>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-1">
                <span className="text-gray-300">→</span>
                <div className="relative group">
                  <div className="px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg text-sm flex items-center gap-1">
                    <span>{step.label}</span>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="ml-1 text-red-400 hover:text-red-600"
                      title="移除此步骤"
                    >
                      ✕
                    </button>
                  </div>
                  {/* 上下移动 */}
                  <div className="absolute -top-2 right-0 hidden group-hover:flex gap-1">
                    <button onClick={() => moveStep(index, 'up')}
                      className="text-xs bg-white border rounded px-1 hover:bg-gray-50">↑</button>
                    <button onClick={() => moveStep(index, 'down')}
                      className="text-xs bg-white border rounded px-1 hover:bg-gray-50">↓</button>
                  </div>
                </div>
              </div>
            ))}
            <span className="text-gray-300">→</span>
            <span className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-mono">📤 输出</span>
          </div>
        </div>
      )}

      <button onClick={executePipeline} disabled={steps.length === 0 || !input}
        className="btn-primary disabled:opacity-50">
        ▶️ 执行流水线
      </button>

      {output && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">最终结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{output}</p>
        </div>
      )}
    </div>
  );
}