
#include <stdio.h>
#include <string.h>

int main() {
    printf("=== Eclipse Backdoor v2.1 ===\n");
    printf("Enter activation code: ");

    char input[100];
    scanf("%99s", input);

    // ∫Û√≈º§ªÓ¬Î
    const char* activation_code = "activate_backdoor_555";

    if (strcmp(input, activation_code) == 0) {
        printf("\n[+] Backdoor activated!\n");
        printf("[+] Extracting hidden data...\n");
        printf("[+] Data saved to eclipse-location.png\n");
        printf("\nRun LSB extraction on the output PNG.\n");
    } else {
        printf("\n[-] Invalid activation code.\n");
        printf("Hint: the code is in the binary. Use 'strings'.\n");
    }

    return 0;
}
