'use client';

import { useState, useRef } from 'react';

export default function ImageLsbTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [lsbText, setLsbText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractLSB = (file: File) => {
    setLoading(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setLsbText('[错误] 无法创建画布');
        setLoading(false);
        return;
      }
      // 关键：禁用平滑，避免像素值变化
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // 按行优先提取（匹配 Python 嵌入顺序：for y for x）
      let bits = '';
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          bits += (pixels[i] & 1).toString();       // R
          bits += (pixels[i + 1] & 1).toString();   // G
          bits += (pixels[i + 2] & 1).toString();   // B
        }
      }

      let text = '';
      for (let i = 0; i < bits.length - 7; i += 8) {
        const charCode = parseInt(bits.slice(i, i + 8), 2);
        if (charCode >= 32 && charCode <= 126) {
          text += String.fromCharCode(charCode);
        } else if (charCode === 0) {
          break;
        }
      }

      const flagMatch = text.match(/flag\{[^}]+\}/i);
      setLsbText(flagMatch ? flagMatch[0] : text.slice(0, 500));
      setLoading(false);
    };
    img.onerror = () => {
      setLsbText('[错误] 图片加载失败');
      setLoading(false);
    };
    img.src = url;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    extractLSB(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 LSB（最低有效位）隐写是将信息隐藏在图片每个像素颜色值的最低比特位中。肉眼无法察觉，但程序可以提取。
      </div>

      <details className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <summary className="text-sm font-medium text-gray-600 cursor-pointer">📖 LSB 隐写原理</summary>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>LSB（Least Significant Bit，最低有效位）隐写利用了人眼对细微颜色变化不敏感的特性。</p>
          <p>每个像素由 R、G、B 三个通道组成（各 0-255），修改每个通道值的最低 1-2 个比特，肉眼完全无法察觉。</p>
          <p>例如：将 "A"（ASCII 65 = 01000001）的 8 个比特分散写入 3 个像素的最低有效位中。</p>
          <p>LSB 隐写是最经典的图像隐写术之一，容量大、隐蔽性强，但也容易被统计分析检测。</p>
          <p className="mt-3 text-amber-700 bg-amber-50 rounded-lg p-3 text-xs">🎯 CTF 常见考法：图片看起来完全正常，但 LSB 提取后能发现隐藏信息。常见变体：只在固定颜色通道（如仅蓝色）中嵌入、使用像素顺序而非扫描线顺序、嵌入前先用 Base64 或凯撒编码。有时 LSB 提取出来的是一张新图片或一个压缩包。</p>
        </div>
      </details>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
        📁 选择 PNG 图片
      </button>

      {loading && <p className="text-gray-500">正在提取 LSB 编码数据...</p>}

      {imageUrl && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <img src={imageUrl} alt="原图" className="max-w-full max-h-60 mx-auto" />
        </div>
      )}

      {!loading && imageUrl && !lsbText && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
          未在 LSB 中发现可读文本。如果确定此图有 LSB 隐写，可能使用了加密或自定义编码。
        </div>
      )}

      {lsbText && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600 font-medium mb-1">LSB 提取结果：</p>
          <p className="font-mono text-lg text-gray-800 break-all">{lsbText}</p>
        </div>
      )}
    </div>
  );
}
