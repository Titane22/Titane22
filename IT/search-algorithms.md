---
layout: page
title: 검색 알고리즘
description: >
  다양한 검색 알고리즘의 원리와 특징을 알아봅니다.
categories: [IT]
tags: [algorithms, search, computer-science]
---

# 검색 알고리즘의 이해

검색 알고리즘은 데이터 집합에서 특정 값을 찾는 방법을 정의하는 알고리즘입니다. 효율적인 검색은 프로그램의 성능에 큰 영향을 미치므로, 상황에 맞는 적절한 검색 알고리즘을 선택하는 것이 중요합니다.

## 주요 검색 알고리즘

![Binary Search & Linear Search](/assets/img/blog/algorithms/linear_bin_search.gif)

### 1. 선형 검색 (Linear Search)

가장 기본적인 검색 방법으로, 배열의 처음부터 끝까지 순차적으로 검색합니다.

**특징:**
- 시간복잡도: O(n)
- 정렬되지 않은 데이터에서도 사용 가능
- 구현이 간단함
- 작은 데이터셋에 효율적

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
```

### 2. 이진 검색 (Binary Search)

정렬된 배열에서 중간값을 기준으로 탐색 범위를 절반씩 줄여가며 검색합니다.

**특징:**
- 시간복잡도: O(log n)
- 정렬된 데이터에서만 사용 가능
- 큰 데이터셋에서 효율적
- 분할 정복 방식 사용

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

### 3. 해시 검색 (Hash Search)

![Hash Search](/assets/img/blog/algorithms/hash-search.png)

해시 함수를 사용하여 데이터를 저장하고 검색합니다.

**특징:**
- 평균 시간복잡도: O(1)
- 추가 메모리 필요
- 충돌 처리 필요
- 직접 접근 가능

```python
class HashTable:
    def __init__(self, size):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def hash_function(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        hash_key = self.hash_function(key)
        for item in self.table[hash_key]:
            if item[0] == key:
                item[1] = value
                return
        self.table[hash_key].append([key, value])
    
    def search(self, key):
        hash_key = self.hash_function(key)
        for item in self.table[hash_key]:
            if item[0] == key:
                return item[1]
        return None
```

### 4. 트리 검색 (Tree Search)

![Tree Search](/assets/img/blog/algorithms/tree-search.gif)

이진 검색 트리 등의 트리 구조를 사용한 검색 방법입니다.

**특징:**
- 시간복잡도: O(log n) (균형 잡힌 트리의 경우)
- 동적 데이터 처리에 효율적
- 정렬된 데이터 유지 가능
- 삽입/삭제가 빈번한 경우 유용

```python
class TreeNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

def tree_search(root, key):
    if root is None or root.key == key:
        return root
    
    if key < root.key:
        return tree_search(root.left, key)
    return tree_search(root.right, key)
```

## 검색 알고리즘 비교

| 알고리즘 | 평균 시간복잡도 | 최악 시간복잡도 | 공간복잡도 | 정렬 필요 |
|---------|--------------|--------------|-----------|---------|
| 선형 검색 | O(n) | O(n) | O(1) | 아니오 |
| 이진 검색 | O(log n) | O(log n) | O(1) | 예 |
| 해시 검색 | O(1) | O(n) | O(n) | 아니오 |
| 트리 검색 | O(log n) | O(n) | O(n) | 부분적 |

## 검색 알고리즘 선택 기준

### 1. 데이터 크기
- 작은 데이터셋: 선형 검색
- 큰 데이터셋: 이진 검색, 해시 검색

### 2. 데이터 정렬 상태
- 정렬된 데이터: 이진 검색
- 정렬되지 않은 데이터: 해시 검색, 선형 검색

### 3. 메모리 제약
- 제한된 메모리: 이진 검색
- 충분한 메모리: 해시 검색

### 4. 검색 빈도
- 빈번한 검색: 해시 검색, 트리 검색
- 간헐적 검색: 선형 검색, 이진 검색

## 실제 응용 사례

### 1. 데이터베이스 검색
```sql
-- 인덱스를 활용한 검색
SELECT * FROM users WHERE id = 1;
```

### 2. 파일 시스템
```python
# 파일 검색 구현
def find_file(directory, filename):
    for root, dirs, files in os.walk(directory):
        if filename in files:
            return os.path.join(root, filename)
    return None
```

### 3. 웹 검색 엔진
```python
# 간단한 검색 엔진 구현
class SearchEngine:
    def __init__(self):
        self.index = {}
    
    def index_document(self, doc_id, content):
        words = content.lower().split()
        for word in words:
            if word not in self.index:
                self.index[word] = set()
            self.index[word].add(doc_id)
    
    def search(self, query):
        words = query.lower().split()
        if not words:
            return set()
        
        result = self.index.get(words[0], set())
        for word in words[1:]:
            result &= self.index.get(word, set())
        return result
```

## 최적화 기법

### 1. 캐싱
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def cached_search(arr, target):
    return binary_search(arr, target)
```

### 2. 병렬 검색
```python
from multiprocessing import Pool

def parallel_search(data_chunks, target):
    with Pool() as pool:
        results = pool.starmap(linear_search, 
            [(chunk, target) for chunk in data_chunks])
    return results
```