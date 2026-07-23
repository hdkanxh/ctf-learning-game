'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '🏠 首页' },
    { href: '/levels', label: '🗺️ 关卡' },
    { href: '/tools', label: '🧰 工具箱' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors">
          <span className="text-2xl">🔐</span>
          <span>CTF 冒险岛</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/github"
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            ⭐ Star
          </Link>
        </nav>
      </div>
    </header>
  );
}