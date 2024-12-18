---
layout: page
title: 정렬 알고리즘
description: >
  다양한 정렬 알고리즘의 원리와 특징을 알아봅니다.
categories: [IT]
tags: [sorting, algorithms, computer-science]
---

# 정렬 알고리즘의 이해

정렬 알고리즘은 컴퓨터 과학의 기본이 되는 중요한 알고리즘입니다. 각각의 정렬 방식은 서로 다른 특징과 성능을 가지고 있어, 상황에 따라 적절한 알고리즘을 선택하는 것이 중요합니다.

## 1. 선택 정렬 (Selection Sort)

![Selection Sort Animation](/assets/img/blog/sorting-algorithms/selection.gif)

### 원리
- 배열에서 최솟값을 찾아 첫 번째 위치와 교환
- 남은 원소들 중에서 최솟값을 찾아 두 번째 위치와 교환
- 이 과정을 반복하여 정렬 완성

### 특징
- 시간 복잡도: O(n²)
- 공간 복잡도: O(1)
- 장점: 구현이 간단하고 추가 메모리가 필요 없음
- 단점: 큰 데이터셋에서는 비효율적

### 구현 (C++)

```cpp
void selectionSort(int arr[], int n) {
    for(int i = 0; i < n-1; i++) {
        int min_idx = i;
        for(int j = i+1; j < n; j++) {
            if(arr[j] < arr[min_idx])
                min_idx = j;
        }
        swap(arr[min_idx], arr[i]);
    }
}
```

## 2. 버블 정렬 (Bubble Sort)

![Bubble Sort Animation](/assets/img/blog/sorting-algorithms/bubble.gif)

### 원리
- 인접한 두 원소를 비교하여 순서가 잘못되어 있으면 교환
- 배열의 끝까지 이 과정을 반복
- 한 번의 순회로 가장 큰 원소가 마지막 위치로 이동

### 특징
- 시간 복잡도: O(n²)
- 공간 복잡도: O(1)
- 장점: 구현이 매우 간단
- 단점: 매우 비효율적인 정렬 방식

### 구현 (C++)

```cpp
void bubbleSort(int arr[], int n) {
    for(int i = 0; i < n-1; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}
```

## 3. 삽입 정렬 (Insertion Sort)

![Insertion Sort Animation](/assets/img/blog/sorting-algorithms/insertion.gif)

### 원리
- 두 번째 원소부터 시작하여 앞의 원소들과 비교
- 자신의 위치를 찾아 삽입
- 정렬된 부분과 정렬되지 않은 부분으로 나누어 진행

### 특징
- 시간 복잡도: O(n²)
- 공간 복잡도: O(1)
- 장점: 작은 데이터셋에서 효율적, 안정적인 정렬
- 단점: 큰 데이터셋에서는 비효율적

### 구현 (C++)

```cpp
void insertionSort(int arr[], int n) {
  for(int i = 1; i < n; i++) {
  int key = arr[i];
        int j = i - 1;
        while(j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}
```

## 4. 병합 정렬 (Merge Sort)

![Merge Sort Animation](/assets/img/blog/sorting-algorithms/merge.gif)

### 원리
- 배열을 절반으로 나누어 각각을 정렬
- 정렬된 두 배열을 병합하는 과정을 재귀적으로 실행
- 분할 정복(Divide and Conquer) 방식 사용

### 특징
- 시간 복잡도: O(n log n)
- 공간 복잡도: O(n)
- 장점: 안정적인 정렬, 대용량 데이터 처리에 적합
- 단점: 추가 메모리 공간 필요

### 구현 (C++)

```cpp
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> L(n1), R(n2);
    for(int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for(int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while(i < n1 && j < n2) {
        if(L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {  
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while(i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while(j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
  }
}

void mergeSort(int arr[], int left, int right) {
  if(left < right) {
  int mid = left + (right - left) / 2;
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
  }
}
```

## 5. 힙 정렬 (Heap Sort)

![Heap Sort Animation](/assets/img/blog/sorting-algorithms/heap.gif)

### 원리
- 배열을 최대 힙으로 구성
- 루트(최댓값)를 마지막 요소와 교환하고 힙 크기를 줄임
- 루트부터 힙 속성을 복구하는 과정 반복

### 특징
- 시간 복잡도: O(n log n)
- 공간 복잡도: O(1)
- 장점: 추가 메모리가 필요 없음
- 단점: 불안정 정렬

### 구현 (C++)

```cpp
void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 i + 1;
    int right = 2 i + 2;
    if(left < n && arr[left] > arr[largest])
        largest = left;
    if(right < n && arr[right] > arr[largest])
        largest = right;
    if(largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest); // 재귀적으로 힙 속성 복구
    }
}

void heapSort(int arr[], int n) {
    for(int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i); // 힙 속성 복구
    for(int i = n-1; i >= 0; i--) {
        swap(arr[0], arr[i]); // 루트와 마지막 요소 교환
        heapify(arr, i, 0); // 힙 속성 복구
    }
}
```

## 6. 퀵 정렬 (Quick Sort)

![Quick Sort Animation](/assets/img/blog/sorting-algorithms/quick.gif)

### 원리
- 피벗을 선택하여 피벗보다 작은 값과 큰 값으로 분할
- 분할된 부분에 대해 재귀적으로 정렬 수행
- 분할 정복 방식 사용

### 특징
- 시간 복잡도: 평균 O(n log n), 최악 O(n²)
- 공간 복잡도: O(log n)
- 장점: 평균적으로 가장 빠른 정렬 알고리즘
- 단점: 피벗 선택에 따라 성능 차이가 큼

### 구현 (C++)

```cpp
void quickSort(int arr[], int low, int high) {
    if(low < high) {
        int pivot = partition(arr, low, high);
        quickSort(arr, low, pivot - 1);
        quickSort(arr, pivot + 1, high);
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for(int j = low; j <= high-1; j++) {
        if(arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}
```

## 7. 기수 정렬 (Radix Sort)

![Radix Sort Animation](/assets/img/blog/sorting-algorithms/radix.gif)

### 원리
- 각 자릿수별로 버킷에 분류하여 정렬
- 가장 작은 자릿수부터 가장 큰 자릿수까지 반복
- 비교 기반이 아닌 분배 기반 정렬

### 특징
- 시간 복잡도: O(d * n) (d는 최대 자릿수)
- 공간 복잡도: O(n + k) (k는 기수의 크기)
- 장점: 특정 조건에서 매우 빠른 성능
- 단점: 자릿수가 있는 데이터에만 적용 가능

### 구현 (C++)

```cpp
void countingSort(int arr[], int n, int exp) {
    vector<int> output(n);
    vector<int> count(10, 0);
    
    for(int i = 0; i < n; i++)
        count[(arr[i]/exp)%10]++;
        
    for(int i = 1; i < 10; i++)
        count[i] += count[i-1];
        
    for(int i = n-1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10]-1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    
    for(int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int max_val = arr[0];
    for(int i = 1; i < n; i++)
        max_val = max(max_val, arr[i]);
        
    for(int exp = 1; max_val/exp > 0; exp *= 10)
        countingSort(arr, n, exp);
}
```

## 정렬 알고리즘 비교

| 알고리즘 | 평균 시간복잡도 | 공간복잡도 | 안정성 |
|---------|--------------|------------|--------|
| 선택정렬 | O(n²)        | O(1)       | 불안정  |
| 버블정렬 | O(n²)        | O(1)       | 안정    |
| 삽입정렬 | O(n²)        | O(1)       | 안정    |
| 병합정렬 | O(n log n)   | O(n)       | 안정    |
| 힙정렬   | O(n log n)   | O(1)       | 불안정  |
| 퀵정렬   | O(n log n)   | O(log n)   | 불안정  |
| 기수정렬 | O(d * n)     | O(n + k)   | 안정    | 