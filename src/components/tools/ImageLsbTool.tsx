'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageLsbTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [lsbText, setLsbText] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractLSB = (file: File) => {
    setLoading(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const pixels = imageData.data;

      // 从每个像素的 R, G, B 最低位提取数据
      let bits = '';
      for (let i = 0; i < pixels.length; i += 4) {
        bits += (pixels[i] & 1).toString();       // R LSB
        bits += (pixels[i + 1] & 1).toString();   // G LSB
        bits += (pixels[i + 2] & 1).toString();   // B LSB
      }

      // 每 8 位转一个字符
      let text = '';
      for (let i = 0; i < bits.length - 7; i += 8) {
        const byte = bits.slice(i, i + 8);
        const charCode = parseInt(byte, 2);
        if (charCode >= 32 && charCode <= 126) {
          text += String.fromCharCode(charCode);
        } else if (charCode === 0) {
          break; // null 终止
        }
      }

      // 尝试提取 flag
      const flagMatch = text.match(/flag\{[^}]+\}/i);
      setLsbText(flagMatch ? flagMatch[0] : text.slice(0, 500));
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

      <canvas ref={canvasRef} className="hidden" />

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