
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
