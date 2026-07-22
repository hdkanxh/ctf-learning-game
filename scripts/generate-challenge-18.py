"""
生成关卡 18 的多层编码程序
flag 经过 Base64 → ROT13 → 逆序
"""

import base64

def caesar(text, shift):
    result = []
    for c in text:
        if 'a' <= c <= 'z':
            result.append(chr((ord(c) - 97 + shift) % 26 + 97))
        elif 'A' <= c <= 'Z':
            result.append(chr((ord(c) - 65 + shift) % 26 + 65))
        else:
            result.append(c)
    return ''.join(result)

flag = "flag{r3v3rs3_4nd_d3c0d3}"

# 正向编码（程序中存储这个）
step1 = base64.b64encode(flag.encode()).decode()  # Base64
step2 = caesar(step1, 13)                          # ROT13
step3 = step2[::-1]                                 # 逆序

print(f'原始 flag:  {flag}')
print(f'Base64:     {step1}')
print(f'ROT13:      {step2}')
print(f'最终密文:   {step3}')
print(f'')
print(f'解密链（用户需要逆向）：')
print(f'  逆序 → ROT13 → Base64 解码')
print(f'')

# 生成 C 源码
C_SOURCE = f'''
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// 存储的密文
const char* stored = "{step3}";

void reverse_str(char* str) {{
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {{
        char tmp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = tmp;
    }}
}}

void rot13(char* str) {{
    for (int i = 0; str[i]; i++) {{
        char c = str[i];
        if (c >= 'a' && c <= 'z') str[i] = (c - 'a' + 13) % 26 + 'a';
        else if (c >= 'A' && c <= 'Z') str[i] = (c - 'A' + 13) % 26 + 'A';
    }}
}}

// 简化的 Base64 解码（仅用于展示逻辑）
// 实际提示用户用网页工具解码

int main() {{
    printf("=== Eclipse Encrypt Tool v3.0 ===\\n");
    printf("多层加密模块已加载。\\n");
    printf("Encrypted data: %s\\n", stored);
    printf("\\n");
    printf("Hint: The encryption chain is: reverse → ROT13 → Base64\\n");
    printf("Use the online tools to decode it step by step.\\n");
    return 0;
}}
'''

import os
os.makedirs('../public/challenges', exist_ok=True)
with open('../public/challenges/challenge-18.c', 'w') as f:
    f.write(C_SOURCE)

print(f'✅ challenge-18.c 已生成！')
print(f'')
print(f'用户解法：')
print(f'  1. 用 Strings 工具提取密文字符串')
print(f'  2. 在解码流水线中按顺序设置：逆序 → ROT13 → Base64 解码')
print(f'  3. 得到 flag')