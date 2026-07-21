import { NextRequest, NextResponse } from 'next/server';

// flag 哈希映射表
// key: levelId（字符串）, value: flag 的 SHA-256
// 这些哈希在后面关卡制作阶段会填入真实值
const FLAG_HASHES: Record<string, string> = {
  '0': 'db64c56f55833dc7e724a46966d93a6116e21e04c56ddeacf54b0e9c8830c1be',  // flag{w3lc0me_t0_ctf}
  '1': '85920f3446e17f7ce8f733d7067f8b6e5efdb782a99d440b5392d2430d2ca331',  // flag{caesar_is_fun}
  '2': 'f4bd210bc78189817dab898dffc85626ebc49f80458835153e0dde2da939cf98',  // flag{you_are_learning_fast}
  '3': 'c123208666ad349e0b17b941643e2e87ae40d1210ff4b5029f2b0cd36045c077',  // flag{base64_is_common}
  '4': '2a5620afb471bbeb9a5ee560fb2e313605796cbb1ff7d95dcc73497156fea998',  // flag{m0rs3_c0d3_c00l}
  '5': '60dbc6eddb1b0b1cbdab301a1745a25260c6e301020ae7417c8b02ead21709c7',  // flag{double_trouble}
  '6': 'f726f5eea9e724ff77774d6a4bad371e4feda599392b937782d25cfcc6dcc9bf',  // flag{fence_is_easy}
  '7': '2d666e258e920a74c33d8ca038e62a059e418cb5b45beb06762874743a2b891b',  // flag{vigenere_is_classic}
  '8': '9b750dbcfc890b544ecb031e7f560b31a5abe68dbea7f119543d7a5e9634d7db',  // flag{crypto_master_achieved}
  '9': '56e2d88d66c7a174d0080f194ed4f6de33c068860c8497126ce685c065d5724e',  // flag{h1dd3n_1n_pla1n_s1ght}
  '10': '7369b9296d71bde2ab0a15ea49e081c678f3726254cd5abc35086b8797d4a7fa',  // flag{lsb_st3g4n0gr4phy}
  '11': 'd3bad68cb3097e5700b93e9774147bf5cd45eeb1c87ec489e4a2a9423714a4d6',  // flag{p4ck3t_an4lys1s_r0cks}
  '12': '6c5d0ebbc86002b7328e60198a46b0bb1a66ef6cbb0afdcdcd4bbaaa9a1f8dd2',  // flag{html_c0mm3nt_is_n0t_s4fe}
  '13': '82cec5fea11c2d511951b75c8cb0a3e12a656f9a039544f13a35648e147a8f88',  // flag{c00k13_m4n1pul4t10n}
  '14': '39cdccbd4c2acbefe8e1e269237c61a8f945e9804d611427a960a985646f79d2',  // flag{p4th_tr4v3rs4l_3z}
  '15': '678bdebd65549b4a527f5f9ea8894afce2c3eb215f3cd1f45708ff7e3a2ee22b',  // flag{w3b_4nd_crypt0_t0g3th3r}
  '16': '970fe86712c1bb73390c02119a65452f039bf68d16f0543a4ebd666cd4fa5024',  // flag{str1ngs_1s_p0w3rful}
  '17': 'f06d3d9fc34e308124035853861c010cb1a769d256d154996ebbcc1c3c72a3b5',  // flag{x0r_r3v3rs1ng_fun}
  '18': '831c3eae2b301b1068b7a85f09c326295aa96de6895e8910805f1b8592702b89',  // flag{r3v3rs3_4nd_d3c0d3}
  '19': '49fabd9fadc38ac1ec3bf48bf79e982601544d4773aaa7fb8486fe915f4330c9',  // flag{thr33_1n_0n3_g4t3}
  '20': 'd62a2af5668074898e0471f75b4dceaa77f6ad253b98a418d9e8d645621db5d9',  // flag{m1rr0r_m4z3_c0nqu3r3d}
  '21': '6a102e55154d1de588858f4907ec64676e998c7170448f3c3dbc30b93fd3087e',  // flag{3cl1ps3_l0c4t10n_b31j1ng_h41d14n}
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