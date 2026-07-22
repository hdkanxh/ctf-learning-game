"""
生成关卡 16 的简单程序（C 语言源码 + 编译说明）
程序功能：要求输入密码，输入正确显示 flag
但这个程序的 flag 同时以明文字符串存在二进制中
"""

C_SOURCE = r'''
#include <stdio.h>
#include <string.h>

int main() {
    char password[50];
    const char* correct = "eclipse123";
    // 下面的字符串就是答案，但别告诉别人哦
    const char* secret = "flag{str1ngs_1s_p0w3rful}";

    printf("=== Eclipse Encrypt Tool v1.0 ===\n");
    printf("Enter password: ");
    scanf("%49s", password);

    if (strcmp(password, correct) == 0) {
        printf("Access granted! Here is the secret:\n");
        printf("%s\n", secret);
    } else {
        printf("Wrong password! Try again.\n");
    }

    return 0;
}
'''

import os

# 保存源码
os.makedirs('../public/challenges', exist_ok=True)
with open('../public/challenges/challenge-16.c', 'w') as f:
    f.write(C_SOURCE)

print('✅ challenge-16.c 已生成！')
print('')
print('编译方法：')
print('  Windows (MinGW):  gcc challenge-16.c -o challenge-16.exe')
print('  Linux:            gcc challenge-16.c -o challenge-16')
print('  macOS:            gcc challenge-16.c -o challenge-16')
print('')
print('编译后将可执行文件放到 public/challenges/ 目录下')
print('')
print('用户解法：')
print('  1. 用 Strings 工具上传二进制文件')
print('  2. 在字符串列表中找 flag{str1ngs_1s_p0w3rful}')
print('  3. 不需要实际运行程序')