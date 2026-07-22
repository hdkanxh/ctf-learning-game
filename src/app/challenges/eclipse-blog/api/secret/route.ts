import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = request.headers.get('x-client-id') || '';

  if (clientId.includes('EclipseBot')) {
    return NextResponse.json({
      status: 'authorized',
      message: '欢迎，Eclipse 内部机器人。这里是加密的系统配置。',
      encrypted_config: 'Wm14aFozdDNNMkpmTkc1a1gyTnllWEIwTUY5ME1HY3pkR2d6Y24wPQ==',
      hint: 'config 经过了编码处理。提示：不是加密，只是编码。',
    });
  }

  // 返回 HTML 页面，埋入线索
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"/><title>Eclipse 内部网关</title></head>
<body style="background:#1a1a2e;color:#c0c0c0;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
<div style="max-width:500px;padding:40px">
<pre style="color:#ff6b6b;font-size:14px;text-align:center">
╔══════════════════════════╗
║  ⛔ 访问被拒绝 (403)      ║
╚══════════════════════════╝
</pre>
<pre style="font-size:12px;line-height:1.8">
[网关] 请求来源验证失败
[网关] 当前客户端: <span style="color:#ffd93d">${clientId || '(未声明)'}</span>
[网关] ──────────────────────────
[网关] 内部工具白名单:
[网关]   ✓ EclipseBot     <span style="color:#6bff6b">● 在线</span>
[网关]   ✓ EclipseClient  <span style="color:#6bff6b">● 在线</span>
[网关]   ✗ 外部浏览器     <span style="color:#ff6b6b">● 已拦截</span>
[网关] ──────────────────────────
[网关] 提示: 在请求头中添加
[网关] X-Client-ID 来声明身份
</pre>
</div></body></html>`;

  return new NextResponse(html, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}