import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const source = request.headers.get('x-from') || '';

  if (source.includes('eclipse-blog')) {
    return NextResponse.json({
      status: 'authorized',
      flag: 'flag{thr33_1n_0n3_g4t3}',
    });
  }

  return NextResponse.json(
    {
      status: 'denied',
      message: '来源验证失败',
      current_source: source || '(未设置)',
      hint: '只有从 eclipse-blog 内部发出的请求才能通过。试试添加 X-From 请求头？',
    },
    { status: 403 }
  );
}
