---
layout: page
title: 벡터의 곱셈
description: >
  벡터 곱셈의 다양한 형태와 그 의미에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

# 벡터의 곱셈 (Vector Multiplication)

## 개요

벡터의 덧셈과 뺄셈은 비교적 단순하지만, 벡터의 곱셈은 훨씬 복잡합니다. 벡터를 곱하는 방법에는 여러 가지가 있으며, 각각의 방법은 서로 다른 의미와 용도를 가지고 있습니다.

## 벡터 곱셈의 표기법

스칼라 값의 경우 두 값의 곱셈을 ab와 같이 기호 없이 표현할 수 있습니다(a × b를 의미). 하지만 벡터의 경우, 이러한 표기는 특정한 종류의 곱셈(벡터 직접곱)을 의미하므로 사용을 피해야 합니다. 대신, 각각의 곱셈 종류에 맞는 고유한 연산자 기호를 사용해야 합니다.

## 성분별 곱셈 (Component Product)

가장 직관적이지만 상대적으로 덜 사용되는 곱셈 방식입니다. 이 책에서는 ◦ 기호로 표현합니다.

### 수학적 정의
```
a ◦ b = ⎡ax⎤   ⎡bx⎤   ⎡axbx⎤
        ⎢ay⎥ ◦ ⎢by⎥ = ⎢ayby⎥
        ⎣az⎦   ⎣bz⎦   ⎣azbz⎦
```

### C++ 구현
```cpp
class Vector3 {
public:
    // 성분별 곱셈의 결과를 새 벡터로 반환
    Vector3 componentProduct(const Vector3 &vector) const {
        return Vector3(x * vector.x, 
                      y * vector.y, 
                      z * vector.z);
    }

    // 성분별 곱셈을 현재 벡터에 적용
    void componentProductUpdate(const Vector3 &vector) {
        x *= vector.x;
        y *= vector.y;
        z *= vector.z;
    }
};
```

### 특징
- 결과는 새로운 벡터
- 각 성분별로 독립적으로 곱셈
- 기하학적 의미가 명확하지 않음
- 벡터가 위치를 나타낼 때 결과의 기하학적 해석이 어려움

## 다른 벡터 곱셈 종류

### 1. 내적 (Dot Product)
- 표기: a · b
- 결과: 스칼라 값
- 기하학적 의미: 두 벡터 사이의 각도와 관련

### 2. 외적 (Cross Product)
- 표기: a × b
- 결과: 새로운 벡터
- 기하학적 의미: 두 벡터에 수직인 벡터

### 3. 벡터 직접곱 (Vector Direct Product)
- 표기: a⊗b
- 결과: 텐서(tensor)
- 게임 물리에서는 잘 사용되지 않음

## 게임 물리에서의 활용

1. **성분별 곱셈의 활용**
   - 스케일링 연산
   - 마스크 연산
   - 개별 축 기반 연산

2. **내적의 활용**
   - 각도 계산
   - 투영 계산
   - 방향 비교

3. **외적의 활용**
   - 수직 벡터 생성
   - 회전 방향 결정
   - 토크 계산

## 주의사항

1. **연산자 선택**
   - 목적에 맞는 적절한 곱셈 연산자 사용
   - 명확한 연산자 표기

2. **성능 고려**
   - 성분별 곱셈은 비교적 가벼운 연산
   - 불필요한 벡터 곱셈 연산 피하기

3. **수치 안정성**
   - 정규화된 벡터 사용 권장
   - 매우 작은 값 처리 주의 