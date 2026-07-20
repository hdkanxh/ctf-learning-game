import Link from 'next/link';

const toolCategories = [
  {
    title: '🔐 密码学工具箱',
    description: '凯撒密码 · Base64 · 摩尔斯电码 · 栅栏密码 · 维吉尼亚密码 · XOR 计算器 · 解码流水线',
    href: '/tools/crypto',
    color: 'border-l-amber-400',
  },
  {
    title: '🧩 杂项分析器',
    description: '图片 EXIF 查看 · LSB 提取 · 颜色通道分离 · Strings 提取 · 十六进制查看器 · 流量包分析',
    href: '/tools/misc',
    color: 'border-l-emerald-400',
  },
  {
    title: '🌐 Web 调试器',
    description: '页面源码查看 · Cookie 编辑器 · HTTP 请求构造器 · robots.txt 探测器',
    href: '/tools/web',
    color: 'border-l-blue-400',
  },
  {
    title: '🔧 逆向分析器',
    description: 'Strings 提取 · Hex Viewer · 文件类型识别 · 反编译预览 · XOR 分析器',
    href: '/tools/re',
    color: 'border-l-purple-400',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧰 工具箱</h1>
        <p className="text-gray-500">所有工具都内置在网页中，无需下载任何软件</p>
      </div>

      <div className="grid gap-4">
        {toolCategories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`card p-6 border-l-4 ${cat.color} hover:shadow-md transition-all`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{cat.title}</h3>
            <p className="text-sm text-gray-500">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}