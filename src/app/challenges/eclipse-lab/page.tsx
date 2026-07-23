export default function EclipseLabPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🧪</span>
          <h1 className="text-2xl font-bold text-white">Eclipse 实验室</h1>
          <span className="text-xs bg-red-800 text-red-300 px-2 py-1 rounded">内部系统</span>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">📟 加密通信模块</h2>
          <p className="text-sm text-gray-400 mb-4">
            系统日志显示一段加密传输被中断。剩余数据如下：
          </p>
          <div className="bg-black rounded-lg p-4 font-mono text-sm">
            <p className="text-green-400 mb-1">[加密载荷 #4721]</p>
            <p className="text-yellow-400 break-all">
              c3RnbntmYXlycnZfemlmbF92Z3VxeGllbWohfQ==
            </p>
            <p className="text-gray-600 mt-2 text-xs">// 加密算法在程序 v4.0 中定义</p>
            <p className="text-gray-600 text-xs">// 密钥已硬编码在程序内</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">📥 工具下载</h2>
          <p className="text-sm text-gray-400 mb-3">
            加密程序 v4.0 — Eclipse 自研的加密工具
          </p>
          <a
            href="/challenges/challenge-20.c"
            download
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            📥 下载 encrypt-v4.0.c
          </a>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">📡 传输记录</h2>
          <div className="space-y-2 text-sm font-mono">
            <p className="text-gray-500">[14:30:00] 连接到 relay.eclipse.net:9001</p>
            <p className="text-gray-500">[14:30:02] 发送加密载荷 #4721</p>
            <p className="text-red-400">[14:30:05] 连接中断 — 载荷未完全发送</p>
          </div>
        </div>
      </div>
    </div>
  );
}
