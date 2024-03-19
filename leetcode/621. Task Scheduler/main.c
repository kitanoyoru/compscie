#include <stdio.h>
#include <stdlib.h>

int compare(const void *a, const void *b) { 
    return *(int*)b - *(int*)a;
}

int leastInterval(char* tasks, int tasksSize, int n) {
    int freq[26] = {0};
    for (int i = 0; i < tasksSize; i++) {
        freq[tasks[i] - 'A']++;
    }

    qsort(freq, 26, sizeof(int), compare);

    int chunk = freq[0] - 1;
    int idle = chunk * n;

    for (int i = 1; i < 26; i++) {
        idle -= (freq[i] > chunk) ? chunk : freq[i];
    }

    return (idle > 0) ? (tasksSize + idle) : tasksSize;
}

