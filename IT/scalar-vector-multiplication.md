---
layout: page
title: 스칼라와 벡터의 곱셈(Scalar and Vector Multiplication)
description: >
  벡터의 스칼라 곱과 그 기하학적 의미에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

## 스칼라 곱의 정의
스칼라 k와 벡터 a의 곱셈은 다음과 같이 정의됩니다:

```
ka = k⎡ x ⎤   ⎡ kx ⎤
      ⎢ y ⎥ = ⎢ ky ⎥
      ⎣ z ⎦   ⎣ kz ⎦
```

즉, 벡터의 각 성분에 스칼라를 곱하는 것입니다.

## 벡터의 나눗셈
벡터를 스칼라로 나누는 것은 다음 관계를 이용합니다:
```
a ÷ b = a × (1/b)
```

따라서 벡터를 스칼라 k로 나누는 것은:
```
a/k = (1/k)a
```

이 원리는 앞서 본 정규화 방정식 [2.2]에서 사용되었습니다.

## 벡터의 덧셈 역원
스칼라 곱을 이용하여 벡터의 덧셈 역원(additive inverse)을 정의할 수 있습니다:
```
-a = -1 × a = ⎡-x⎤
              ⎢-y⎥
              ⎣-z⎦
```

## C++ 구현
Vector3 클래스에서 스칼라 곱을 위한 연산자 오버로딩:

```cpp
class Vector3 {
public:
    // 벡터에 스칼라를 곱하는 연산 (자기 자신 수정)
    void operator*=(const real value) {
        x *= value;
        y *= value;
        z *= value;
    }

    // 벡터와 스칼라의 곱을 새로운 벡터로 반환
    Vector3 operator*(const real value) const {
        return Vector3(x*value, y*value, z*value);
    }
};
```

## 기하학적 의미
스칼라 곱은 기하학적으로 벡터의 크기를 스칼라 값만큼 변경하는 것을 의미합니다:
- k > 1: 벡터가 k배 늘어남
- 0 < k < 1: 벡터가 k배 줄어듦
- k < 0: 벡터의 방향이 반대가 되고 크기가 |k|배 변함
- k = 0: 영벡터가 됨

## 활용 예시
1. **속도 조절**
   ```cpp
   velocity *= 0.5f;  // 속도를 절반으로 줄임
   ```

2. **힘의 크기 조절**
   ```cpp
   force *= 2.0f;  // 힘을 두 배로 증가
   ```

3. **방향 반전**
   ```cpp
   direction *= -1.0f;  // 방향을 반대로 변경
   ```

4. **정규화 과정에서의 활용**
   ```cpp
   Vector3 normalized = vector * (1.0f / vector.magnitude());
   ```

## 주의사항
1. **부동소수점 연산**
   - 부동소수점 오차 관리
   - 매우 작은 값으로 나눌 때 주의

2. **최적화**
   - 곱셈이 많은 경우 SIMD 연산 고려
   - 연속된 스칼라 곱은 하나로 합치기

3. **특수 케이스**
   - 0으로 나누는 경우 처리
   - 매우 큰 스칼라 값 처리 