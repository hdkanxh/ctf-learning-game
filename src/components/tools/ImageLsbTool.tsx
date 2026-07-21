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
