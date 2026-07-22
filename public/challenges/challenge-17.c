
#include <stdio.h>
#include <string.h>

int main() {
    char input[50];

    // XOR_encrypted_with_0x55: 2c 3a 20 0a 32 3a 21 0a 2d 3a 27
    unsigned char encrypted[] = { 0x2c, 0x3a, 0x20, 0x0a, 0x32, 0x3a, 0x21, 0x0a, 0x2d, 0x3a, 0x27 };

    printf("=== Eclipse Encrypt Tool v2.0 ===\n");
    printf("Enter the secret key: ");
    scanf("%49s", input);

    char xored[50];
    for (int i = 0; i < strlen(input); i++) {
        xored[i] = input[i] ^ 0x55;
    }
    xored[strlen(input)] = '\0';

    if (strcmp(xored, (char*)encrypted) == 0) {
        printf("Access Granted!\n");
        printf("The flag is: flag{%s}\n", input);
    } else {
        printf("Wrong key! Hint: each character ^ 0x55 = encrypted\n");
    }

    return 0;
}
