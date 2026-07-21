// 计算所有 flag 的 SHA-256 哈希值
// 运行方式：node scripts/hash-flags.js
// 需要 Node.js >= 20.9

const crypto = require('crypto');

function sha256(text) {
  return crypto.createHash('sha256').update(text.trim()).digest('hex');
}

const flags = {
  // Phase 1: 密码学入门
  '0':  'flag{w3lc0me_t0_ctf}',
  '1':  'flag{caesar_is_fun}',
  '2':  'flag{you_are_learning_fast}',
  '3':  'flag{base64_is_common}',
  '4':  'flag{m0rs3_c0d3_c00l}',
  '5':  'flag{double_trouble}',
  // Phase 2: 密码进阶 + 杂项
  '6':  'flag{fence_is_easy}',
  '7':  'flag{vigenere_is_classic}',
  '8':  'flag{crypto_master_achieved}',
  '9':  'flag{h1dd3n_1n_pla1n_s1ght}',
  '10': 'flag{lsb_st3g4n0gr4phy}',
  '11': 'flag{p4ck3t_an4lys1s_r0cks}',
  // Phase 3: Web 安全（Phase 4 制作关卡时用到，这里先算好）
  '12': 'flag{html_c0mm3nt_is_n0t_s4fe}',
  '13': 'flag{c00k13_m4n1pul4t10n}',
  '14': 'flag{p4th_tr4v3rs4l_3z}',
  '15': 'flag{w3b_4nd_crypt0_t0g3th3r}',
  // Phase 4: 逆向工程
  '16': 'flag{str1ngs_1s_p0w3rful}',
  '17': 'flag{x0r_r3v3rs1ng_fun}',
  '18': 'flag{r3v3rs3_4nd_d3c0d3}',
  // Phase 5: 终局
  '19': 'flag{thr33_1n_0n3_g4t3}',
  '20': 'flag{m1rr0r_m4z3_c0nqu3r3d}',
  '21': 'flag{3cl1ps3_l0c4t10n_b31j1ng_h41d14n}',
};

console.log('// 将以下内容复制到 src/app/api/verify-flag/route.ts 的 FLAG_HASHES 中：\n');
for (const [id, flag] of Object.entries(flags)) {
  console.log(`  '${id}': '${sha256(flag)}',  // ${flag}`);
}