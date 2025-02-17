---
layout: page
title: 벡터의 덧셈과 뺄셈 (Vector Addition and Subtraction)
description: >
  벡터의 덧셈과 뺄셈 연산 및 그 기하학적 의미에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

# 벡터의 덧셈과 뺄셈 

## 기하학적 의미
![vector-addition](/assets/img/blog/gamedev/vector-addition.png)

_벡터 덧셈의 기하학적 표현_

- **벡터 덧셈**: 두 벡터를 끝과 끝을 이어 붙이면, 결과 벡터는 첫 벡터의 시작점에서 마지막 벡터의 끝점까지입니다.
- **벡터 뺄셈**: 첫 번째 벡터를 따라 전진한 후, 두 번째 벡터를 반대 방향으로 이동합니다.

## 수학적 정의

### 벡터 덧셈
두 벡터 a와 b의 덧셈:
```
a + b = ⎡ax⎤   ⎡bx⎤   ⎡ax + bx⎤
        ⎢ay⎥ + ⎢by⎥ = ⎢ay + by⎥
        ⎣az⎦   ⎣bz⎦   ⎣az + bz⎦
```

### 벡터 뺄셈
두 벡터 a와 b의 뺄셈:
```
a - b = ⎡ax⎤   ⎡bx⎤   ⎡ax - bx⎤
        ⎢ay⎥ - ⎢by⎥ = ⎢ay - by⎥
        ⎣az⎦   ⎣bz⎦   ⎣az - bz⎦
```

## C++ 구현

### 기본 덧셈과 뺄셈
```cpp
class Vector3 {
public:
    // 벡터 덧셈 (자기 자신 수정)
    void operator+=(const Vector3& v) {
        x += v.x;
        y += v.y;
        z += v.z;
    }

    // 벡터 덧셈 (새로운 벡터 반환)
    Vector3 operator+(const Vector3& v) const {
        return Vector3(x+v.x, y+v.y, z+v.z);
    }

    // 벡터 뺄셈 (자기 자신 수정)
    void operator-=(const Vector3& v) {
        x -= v.x;
        y -= v.y;
        z -= v.z;
    }

    // 벡터 뺄셈 (새로운 벡터 반환)
    Vector3 operator-(const Vector3& v) const {
        return Vector3(x-v.x, y-v.y, z-v.z);
    }
};
```

### 스케일된 벡터 덧셈
벡터에 스케일된 다른 벡터를 더하는 연산:
```cpp
class Vector3 {
public:
    // 스케일된 벡터를 현재 벡터에 더함
    void addScaledVector(const Vector3& vector, real scale) {
        x += vector.x * scale;
        y += vector.y * scale;
        z += vector.z * scale;
    }
};
```

이는 다음 수식을 구현한 것입니다:
```
a + cb = ⎡ax⎤   ⎡cbx⎤   ⎡ax + cbx⎤
         ⎢ay⎥ + ⎢cby⎥ = ⎢ay + cby⎥
         ⎣az⎦   ⎣cbz⎦   ⎣az + cbz⎦
```

## 활용 예시

1. **물체의 위치 업데이트**
   ```cpp
   position += velocity * deltaTime;
   ```

2. **힘의 합산**
   ```cpp
   totalForce += gravity + wind + thrust;
   ```

3. **상대 위치 계산**
   ```cpp
   Vector3 relativePos = targetPos - currentPos;
   ```

4. **가속도를 이용한 속도 업데이트**
   ```cpp
   velocity.addScaledVector(acceleration, deltaTime);
   ```

## 주의사항

1. **벡터 연산 순서**
   - 벡터 덧셈은 교환법칙이 성립
   - 뺄셈은 교환법칙이 성립하지 않음

2. **수치 안정성**
   - 매우 큰 값과 매우 작은 값의 덧셈 시 주의
   - 누적 오차 관리

3. **최적화**
   - 연속된 덧셈/뺄셈 연산 최적화
   - SIMD 연산 활용 고려 