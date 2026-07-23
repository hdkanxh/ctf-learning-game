import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CTF 冒险岛 — 零基础 CTF 入门闯关',
    template: '%s | CTF 冒险岛',
  },
  description: '一个面向新手的 CTF 学习游戏，无需安装任何工具，浏览器即玩。涵盖密码学、隐写术、Web安全、逆向工程、二进制漏洞利用五大方向。',
  keywords: ['CTF', '网络安全', '入门', '学习', '闯关', 'CTF入门', 'Capture The Flag'],
  openGraph: {
    title: 'CTF 冒险岛 — 零基础 CTF 入门闯关',
    description: '一个面向新手的 CTF 学习游戏，浏览器即玩，2-3 小时通关',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}