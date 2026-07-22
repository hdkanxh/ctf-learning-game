export default function EclipseBlogPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-gray-800">🌑 Eclipse&apos;s Blog</span>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="/challenges/eclipse-blog" className="hover:text-gray-800">首页</a>
            <a href="/challenges/eclipse-blog/admin" className="hover:text-gray-800">会员专区</a>
            <a href="/challenges/eclipse-blog/files" className="hover:text-gray-800">文件</a>
          </div>
        </div>
      </nav>

      {/* 主体内容 */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          欢迎来到我的技术博客
        </h1>

        <article className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            关于网络安全的一些思考
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            很多人认为只要把密码藏在服务器端就安全了。
            但事实上，前端也有很多地方可以泄露信息。
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            比如，有些开发者会在 HTML 注释里留下敏感信息。
            这看似安全——毕竟普通用户不会查看源代码——但对于任何懂技术的人来说，
            这就像把钥匙放在门垫下面。
          </p>
          <p className="text-gray-500 text-sm">
            发布于 2024-07-10 · Eclipse
          </p>
        </article>

        <article className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            旅行日记：山间小屋
          </h2>
          <p className="text-gray-600 leading-relaxed">
            周末去了趟山里。没有网络，没有代码，只有风声和鸟鸣。
            偶尔远离屏幕也是一种奢侈。
          </p>
          <p className="text-gray-500 text-sm mt-4">
            发布于 2024-07-08 · Eclipse
          </p>
        </article>

        <div dangerouslySetInnerHTML={{
          __html: '<!--\n          管理员备忘：\n          新会员注册系统的 flag 验证码：flag{html_c0mm3nt_is_n0t_s4fe}\n          记得删掉这个注释再上线！ —— Eclipse\n        -->'
        }} />

        <footer className="text-center text-gray-400 text-sm mt-12">
          &copy; 2024 Eclipse. Powered by CTF 冒险岛.
        </footer>
      </main>
    </div>
  );
}