'use client';

import { useState, useRef } from 'react';

// 模拟 HTTP 流量数据（实际关卡会提供真实 JSON 文件）
interface HttpPacket {
  id: number;
  method: string;
  host: string;
  path: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: string;
}

export default function PcapViewer() {
  const [packets, setPackets] = useState<HttpPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filterText, setFilterText] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // 支持数组格式或 { packets: [...] } 格式
      setPackets(Array.isArray(data) ? data : data.packets || []);
    } catch {
      // 如果不是 JSON，尝试解析为文本并展示
      setPackets([{
        id: 1,
        method: 'RAW',
        host: '',
        path: '',
        requestHeaders: {},
        requestBody: '',
        responseStatus: 0,
        responseHeaders: {},
        responseBody: '文件不是 JSON 格式。请上传关卡提供的流量分析文件。',
      }]);
    }
  };

  const filteredPackets = filterText
    ? packets.filter((p) =>
        JSON.stringify(p).toLowerCase().includes(filterText.toLowerCase())
      )
    : packets;

  const selected = packets.find((p) => p.id === selectedPacket);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        💡 网络流量分析：查看网络通信中的数据包，在 HTTP 请求和响应中寻找隐藏信息。
      </div>

      <div className="flex items-center gap-3">
        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
        <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm">
          📁 选择流量文件
        </button>
        {fileName && (
          <span className="text-sm text-gray-500 font-mono">{fileName} · {packets.length} 个包</span>
        )}
      </div>

      {packets.length > 0 && (
        <>
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="🔍 过滤（如 flag、200、POST）"
            className="input-field text-sm py-1.5"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 包列表 */}
            <div className="md:col-span-1 max-h-80 overflow-y-auto space-y-1">
              {filteredPackets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPacket(p.id)}
                  className={`w-full text-left p-2 rounded-lg text-sm font-mono transition-colors ${
                    selectedPacket === p.id
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="font-bold">{p.method}</span>{' '}
                  <span className="text-gray-400">{p.path}</span>
                  <span className={`ml-2 text-xs px-1.5 rounded ${
                    p.responseStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {p.responseStatus}
                  </span>
                </button>
              ))}
            </div>

            {/* 包详情 */}
            <div className="md:col-span-2">
              {selected ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 font-medium mb-1">📤 请求</p>
                    <p className="font-mono text-sm text-gray-800">
                      <span className="font-bold text-blue-600">{selected.method}</span>{' '}
                      {selected.path}
                    </p>
                    {Object.entries(selected.requestHeaders).map(([k, v]) => (
                      <p key={k} className="font-mono text-xs text-gray-500">
                        {k}: <span className="text-gray-700">{v}</span>
                      </p>
                    ))}
                    {selected.requestBody && (
                      <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded whitespace-pre-wrap">
                        {selected.requestBody}
                      </pre>
                    )}
                  </div>

                  <div className={`rounded-lg p-3 ${
                    selected.responseStatus === 200 ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className="text-xs text-gray-400 font-medium mb-1">📥 响应 ({selected.responseStatus})</p>
                    {Object.entries(selected.responseHeaders).map(([k, v]) => (
                      <p key={k} className="font-mono text-xs text-gray-500">
                        {k}: <span className="text-gray-700">{v}</span>
                      </p>
                    ))}
                    <pre className="mt-2 text-sm text-gray-800 bg-white p-3 rounded whitespace-pre-wrap font-mono break-all">
                      {selected.responseBody}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-12">← 选择一个数据包查看详情</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}