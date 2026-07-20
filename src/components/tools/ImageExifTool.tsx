'use client';

import { useState, useRef } from 'react';

interface ExifData {
  key: string;
  value: string;
}

export default function ImageExifTool() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setExifData([]);

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // 读取文件为 ArrayBuffer 以解析 EXIF
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const exif: ExifData[] = [];

    // 基本信息
    exif.push({ key: '文件名', value: file.name });
    exif.push({ key: '文件大小', value: `${(file.size / 1024).toFixed(1)} KB` });
    exif.push({ key: '文件类型', value: file.type || '未知' });

    // 解析简单的 TIFF/EXIF 头
    const text = new TextDecoder().decode(bytes);

    // 搜索 ASCII 字符串中可能包含的元数据
    const patterns = [
      { regex: /[A-Za-z0-9+/=]{20,}={0,2}/g, label: 'Base64 字符串' },
      { regex: /flag\{[^}]+\}/gi, label: 'Flag 格式' },
      { regex: /comment[:\s]*["']?([^"'\n\r]{5,})/gi, label: 'Comment 字段' },
      { regex: /artist[:\s]*["']?([^"'\n\r]{3,})/gi, label: 'Artist 字段' },
    ];

    for (const { regex, label } of patterns) {
      const matches = text.matchAll(regex);
      for (const match of matches) {
        const val = match[1] || match[0];
        if (val && val.length > 2) {
          exif.push({ key: label, value: val.trim() });
        }
      }
    }

    // 提取所有可读字符串（连续 4 个以上可打印字符）
    const readableStrings = text.match(/[\x20-\x7E]{4,}/g) || [];
    const uniqueStrings = [...new Set(readableStrings)].slice(0, 50);

    // 过滤出有意义的字符串
    const interesting = uniqueStrings.filter((s) => {
      const lower = s.toLowerCase();
      return (
        lower.includes('flag') ||
        lower.includes('key') ||
        lower.includes('secret') ||
        lower.includes('password') ||
        lower.includes('exif') ||
        lower.includes('comment') ||
        lower.includes('http') ||
        lower.includes('.com') ||
        lower.includes('admin') ||
        (s.length > 15 && !s.match(/^[A-Za-z0-9+/=]+$/)) // 长且非纯base64
      );
    });

    if (interesting.length > 0) {
      exif.push({ key: '🔍 可疑字符串', value: interesting.join('\n') });
    }

    setExifData(exif);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 上传图片查看其元数据（EXIF）。很多图片的隐藏信息就藏在文件头和元数据字段中。
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
        📁 选择图片文件
      </button>

      {loading && <p className="text-gray-500">分析中...</p>}

      {imageUrl && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <img src={imageUrl} alt="预览" className="max-w-full max-h-80 mx-auto" />
        </div>
      )}

      {exifData.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 text-gray-500 font-medium w-1/3">字段</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">值</th>
              </tr>
            </thead>
            <tbody>
              {exifData.map((item, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-600 font-medium align-top">{item.key}</td>
                  <td className="px-4 py-2 font-mono text-gray-800 whitespace-pre-wrap break-all">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}