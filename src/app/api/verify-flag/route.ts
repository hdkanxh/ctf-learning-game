import { NextRequest, NextResponse } from 'next/server';

// flag 哈希映射表
// key: levelId（字符串）, value: flag 的 SHA-256
// 这些哈希在后面关卡制作阶段会填入真实值
const FLAG_HASHES: Record<string, string> = {
  // Phase 1
  '0':  'f4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', // PLACEHOLDER - 需替换
  '1':  'PLACEHOLDER',
  '2':  'PLACEHOLDER',
  '3':  'PLACEHOLDER',
  '4':  'PLACEHOLDER',
  '5':  'PLACEHOLDER',
  // Phase 2
  '6':  'PLACEHOLDER',
  '7':  'PLACEHOLDER',
  '8':  'PLACEHOLDER',
  '9':  'PLACEHOLDER',
  '10': 'PLACEHOLDER',
  '11': 'PLACEHOLDER',
  // Phase 3
  '12': 'PLACEHOLDER',
  '13': 'PLACEHOLDER',
  '14': 'PLACEHOLDER',
  '15': 'PLACEHOLDER',
  // Phase 4
  '16': 'PLACEHOLDER',
  '17': 'PLACEHOLDER',
  '18': 'PLACEHOLDER',
  // Phase 5
  '19': 'PLACEHOLDER',
  '20': 'PLACEHOLDER',
  '21': 'PLACEHOLDER',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { levelId, flag } = body;

    if (typeof levelId !== 'number' || typeof flag !== 'string') {
      return NextResponse.json({ success: false, message: '参数错误' }, { status: 400 });
    }

    const expectedHash = FLAG_HASHES[String(levelId)];
    if (!expectedHash || expectedHash === 'PLACEHOLDER') {
      return NextResponse.json({ success: false, message: '关卡尚未配置' }, { status: 500 });
    }

    // 计算提交的 flag 的 SHA-256
    const msgBuffer = new TextEncoder().encode(flag.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const correct = hashHex === expectedHash;

    return NextResponse.json({
      success: correct,
      message: correct ? '🎉 恭喜！Flag 正确！' : '❌ Flag 不正确，再试试？',
    });
  } catch {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 });
  }
}