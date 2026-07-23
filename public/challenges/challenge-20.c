
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Eclipse Encrypt Tool v4.0
// Vigenere key stored here for internal use
const char* VIGENERE_KEY = "NIGHTSHADE";

const char* B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void vigenere_encrypt(char* text, const char* key) {
    int key_len = strlen(key);
    for (int i = 0, j = 0; text[i]; i++) {
        char c = text[i];
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            int shift = key[j % key_len] - 'a';
            if (shift < 0) shift += 32;
            char base = (c >= 'a' && c <= 'z') ? 'a' : 'A';
            text[i] = (c - base + shift) % 26 + base;
            j++;
        }
    }
}

int main() {
    printf("=== Eclipse Encrypt Tool v4.0 ===\n");
    printf("\n");
    printf("Encrypted payload:\n");
    printf("%s\n", "c3RnbntmYXlycnZfemlmbF92Z3VxeGllbWohfQ==");
    printf("\n");
    printf("Decryption requires the embedded key.\n");
    return 0;
}
