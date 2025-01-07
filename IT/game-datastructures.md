---
layout: page
title: 게임 개발을 위한 자료구조와 알고리즘
description: >
  게임 개발에서 자주 사용되는 자료구조와 알고리즘을 알아봅니다.
categories: [IT]
tags: [game-development, data-structures, algorithms]
---

## 기본 자료구조

### 1. 동적 배열
```cpp
template<typename T>
class DynamicArray {
    T* data;
    size_t size;
    size_t capacity;
public:
    void Add(const T& item);
    void Remove(size_t index);
    T& operator[](size_t index);
};
```

### 2. 연결 리스트
- 단일 연결 리스트
- 이중 연결 리스트
- 순환 리스트

### 3. 트리 구조
- 이진 트리
- 쿼드트리
- 옥트리

## 게임 특화 자료구조

### 1. 씬 그래프
- 계층 구조
- 공간 분할
- 렌더링 최적화

### 2. 객체 풀
```cpp
template<typename T>
class ObjectPool {
    vector<T*> activeObjects;
    vector<T*> inactiveObjects;
public:
    T* Acquire();
    void Release(T* obj);
};
```

### 3. 컴포넌트 시스템
- 엔티티-컴포넌트 시스템
- 데이터 지향 설계

## 게임 알고리즘

### 1. 경로찾기
- A* 알고리즘
- 다익스트라 알고리즘
- 내비게이션 메시

### 2. 인공지능
- 상태 기계
- 행동 트리
- 목표 지향 행동

### 3. 최적화 알고리즘
- 공간 분할
- LOD (Level of Detail)
- 컬링 시스템

## 참고 자료
- [게임 프로그래밍 패턴](https://gameprogrammingpatterns.com/)
- [데이터 지향 설계](https://www.dataorienteddesign.com/dodbook/)