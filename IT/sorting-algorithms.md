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