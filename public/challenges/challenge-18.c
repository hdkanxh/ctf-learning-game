
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Encoded output:
const char* stored = "==QfhMTcwA3Mx9VchRzXzYWZzk2MltHdul3c";

void reverse_str(char* str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char tmp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = tmp;
    }
}

// ROT13 example: "flag" <-> "synt"
void rot13(char* str) {
    for (int i = 0; str[i]; i++) {
        char c = str[i];
        if (c >= 'a' && c <= 'z') str[i] = (c - 'a' + 13) % 26 + 'a';
        else if (c >= 'A' && c <= 'Z') str[i] = (c - 'A' + 13) % 26 + 'A';
    }
}

int main() {
    printf("=== Eclipse Encrypt Tool v3.0 ===\n");
    printf("Encrypted data: %s\n", stored);
    printf("\n");
    printf("Decode it. The tools you need are right here.\n");
    return 0;
}
