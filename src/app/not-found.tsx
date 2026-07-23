import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <p className="text-6xl mb-4">🔍</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">404 · 页面未找到</h2>
      <p className="text-gray-500 mb-6">
        这个页面不存在，也许 Eclipse 把它藏起来了？
      </p>
      <Link href="/" className="btn-primary">
        🏠 返回首页
      </Link>
    </div>
  );
}
