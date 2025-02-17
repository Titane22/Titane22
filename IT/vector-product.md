---
layout: page
title: 벡터곱 (Vector Product)
description: >
  벡터의 벡터곱(외적)과 그 기하학적 의미에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

## 개요

스칼라곱이 스칼라 값을 결과로 주는 것과 달리, 벡터곱은 새로운 벡터를 결과로 줍니다. 성분별 곱셈과 유사하지만 훨씬 더 일반적으로 사용됩니다. a × b로 표기하며, "외적(cross product)"이라고도 합니다.

## 수학적 정의

벡터곱은 다음 공식으로 계산됩니다:

```
a × b = ⎡ax⎤   ⎡bx⎤   ⎡aybz - azby⎤
        ⎢ay⎥ × ⎢by⎥ = ⎢azbx - axbz⎥ [2.5]
        ⎣az⎦   ⎣bz⎦   ⎣axby - aybx⎦
```

## C++ 구현

```cpp
class Vector3 {
public:
    /**
     * 이 벡터와 주어진 벡터의 벡터곱을 계산하여 반환합니다.
     */
    Vector3 vectorProduct(const Vector3 &vector) const {
        return Vector3(y*vector.z - z*vector.y,
                      z*vector.x - x*vector.z,
                      x*vector.y - y*vector.x);
    }

    /**
     * 벡터곱 연산자 오버로딩
     */
    Vector3 operator%(const Vector3 &vector) const {
        return vectorProduct(vector);
    }

    /**
     * 벡터곱 결과로 자신을 업데이트
     */
    void operator%=(const Vector3 &vector) {
        *this = vectorProduct(vector);
    }
};
```

참고: % 연산자를 사용한 것은 × 기호와 시각적으로 유사하기 때문입니다. 일반적으로 % 연산자는 모듈로 연산에 사용되지만, 벡터에는 의미 있는 모듈로 연산이 없으므로 이렇게 재사용합니다.

## 삼각함수와의 관계

벡터곱의 크기는 다음과 같이 계산됩니다:

```
|a × b| = |a||b| sin θ [2.6]

여기서 θ는 두 벡터 사이의 각도
```

이는 스칼라곱에서 cosine을 sine으로 바꾼 것과 같습니다. 실제로 다음과 같이 쓸 수 있습니다:

```
|a × b| = |a||b|√(1 - (a · b)²)

이는 cos²θ + sin²θ = 1 관계를 이용한 것입니다.
```

## 교환법칙

벡터곱은 교환법칙이 성립하지 않습니다:
```
a × b ≠ b × a
실제로 a × b = -(b × a)
```

이는 성분별 곱셈(a ◦ b = b ◦ a)이나 스칼라곱(a · b = b · a)과는 다른 특징입니다.

## 기하학적 의미

![vector-product](/assets/img/blog/gamedev/vector-product.png)

_벡터곱의 기하학적 해석_

1. **방향성**
   - 결과 벡터는 두 입력 벡터에 모두 수직(90°)
   - 오른손 법칙을 따름

2. **크기**
   - 두 벡터가 이루는 평행사변형의 면적과 같음
   - 두 벡터가 평행할 때 크기는 0

3. **차원 제한**
   - 3차원에서만 정의됨
   - 2차원에서는 두 비평행 벡터에 수직인 벡터가 존재할 수 없음

## 활용

1. **수직 벡터 생성**
   ```cpp
   Vector3 normal = a % b;
   normal.normalize();
   ```

2. **회전 방향 결정**
   - 오른손 법칙을 이용한 회전축 결정

3. **면적 계산**
   - 평행사변형 면적 계산
   - 삼각형 면적 계산 (결과의 절반)

## 주의사항

1. **연산 순서**
   - 순서가 바뀌면 결과의 방향이 반대
   - 물리 시뮬레이션에서 순서 오류는 심각한 버그 발생 가능

2. **성능 고려**
   - 스칼라곱보다 계산 비용이 높음
   - 각도 계산이 필요할 때는 스칼라곱 사용 권장

3. **수치 안정성**
   - 정규화된 벡터 사용 권장
   - 평행한 벡터에 대한 처리 주의 