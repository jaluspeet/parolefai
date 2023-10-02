#include <ctype.h>
#include <stdio.h>
#define N 279894
#define NLETTERE 6

int controlla(const char parola[], char chiave, const char lettere[]) {
  int i = 0;
  char flag = 0;
  while (parola[i] != 0) {
    int j = 0;
    for (; j < NLETTERE; ++j) {
      if (parola[i] == lettere[j]) {
        j = 26;
      }
    }
    if (j == NLETTERE) {
      if (parola[i] != chiave) {
        return 0;
      } else
        flag = 1;
    }

    i++;
  }
  if (flag == 1)
    return i;
  return 0;
}

int main() {
  FILE *fp, *fout;
  char chiave;
  char lettere[NLETTERE];

  printf("Inserire lettera chiave: ");
  chiave = (char)getc(stdin);
  printf("Digitare le 6 lettere usabili senza spaziature: ");
  scanf("%s", lettere);

  chiave = (char)tolower(chiave);
  for (int i = 0; i < NLETTERE; ++i) {
    lettere[i] = (char)tolower(lettere[i]);
  }
  fp = fopen("parole.txt", "r");
  fout = fopen("output.txt", "w");
  for (int i = 0; i < N; ++i) {
    char parola[30] = {0};
    fscanf(fp, "%s", parola);
    if (controlla(parola, chiave, lettere) > 0)
      fprintf(fout, "\n%s", parola);
  }
  fclose(fp);
  fclose(fout);
  // printf("\n\nPremere 'e' per uscire: ");
  // while ((char)getchar() != 'e');
  return 0;
}