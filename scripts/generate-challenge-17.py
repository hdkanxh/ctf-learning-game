"""
生成关卡 17 的 XOR 加密程序
程序将输入与 0x55 做 XOR，然后与硬编码密文比较
"""

C_SOURCE = r'''
#include <stdio.h>
#include <string.h>

int main() {
    char input[50];

    // 加密后的密文（"you_got_xor" 每个字符 XOR 0x55）
    unsigned char encrypted[] = {
        0x2c, 0x3a, 0x3a, 0xed, 0x36, 0x3a, 0x21, 0xed,
        0x27, 0x3a, 0x3f, 0x00
    };

    printf("=== Eclipse Encrypt Tool v2.0 ===\n");
    printf("Enter the secret key: ");
    scanf("%49s", input);

    // XOR 0x55 加密用户输入
    char xored[50];
    for (int i = 0; i < strlen(input); i++) {
        xored[i] = input[i] ^ 0x55;
    }
    xored[strlen(input)] = '\0';

    // 比较
    if (strcmp(xored, (char*)encrypted) == 0) {
        printf("Correct! The flag is: flag{x0r_r3v3rs1ng_fun}\n");
    } else {
        printf("Wrong key! Hint: each character ^ 0x55 = encrypted\n");
    }

    return 0;
}
'''

import os

os.makedirs('../public/challenges', exist_ok=True)
with open('../public/challenges/challenge-17.c', 'w') as f:
    f.write(C_SOURCE)

print('✅ challenge-17.c 已生成！')
print('')
print('解题思路：')
print('  1. 用户查看源码或用反汇编工具分析')
print('  2. 发现程序做了 XOR 0x55 后与密文比较')
print('  3. 密文是 [0x2c, 0x3a, 0x3a, 0xed, 0x36, 0x3a, 0x21, 0xed, 0x27, 0x3a, 0x3f]')
print('  4. 每个字节 XOR 0x55 得到 "you_got_xor"')
print('  5. 运行程序输入 "you_got_xor" 获得 flag')
print('')
print('验证：')
for b in [0x2c, 0x3a, 0x3a, 0xed, 0x36, 0x3a, 0x21, 0xed, 0x27, 0x3a, 0x3f]:
    print(f'  0x{b:02x} ^ 0x55 = 0x{(b ^ 0x55):02x} = {chr(b ^ 0x55)}')