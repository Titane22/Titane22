---
layout: page
title: 벡터와 방향(Vectors and Directions)
description: >
  게임 물리 엔진에서 벡터의 표현과 방향 계산에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

물리 엔진에서 벡터는 위치, 속도, 가속도, 힘 등을 표현하는 기본 요소입니다. 벡터의 정확한 이해와 활용은 물리 시뮬레이션의 핵심입니다.

![vector-movement](/assets/img/blog/gamedev/vector-movement.png)

_A vector as a movement in space._

## 벡터의 기본 개념

### 벡터의 정의
벡터는 두 가지 관점에서 해석할 수 있습니다:
1. 크기와 방향을 가진 양
2. 위치의 변화량

위치 변화량으로서의 벡터는 시작점 a0에서 끝점 a1까지의 이동을 나타내며, 다음과 같이 표현됩니다:

```
a = ⎡ x ⎤
    ⎢ y ⎥
    ⎣ z ⎦

여기서 x = x1 - x0 (X축 방향의 변화)
      y = y1 - y0 (Y축 방향의 변화)
      z = z1 - z0 (Z축 방향의 변화)
```

위치와 위치 변화량은 같은 개념의 두 가지 측면입니다. 모든 위치는 원점(0,0,0)으로부터의 위치 변화로 생각할 수 있습니다.

### 벡터의 분해
위치 변화를 나타내는 벡터는 다음과 같이 두 요소로 분해할 수 있습니다:

```
a = dn [2.1]

여기서 d: 직선 거리(벡터의 크기, magnitude)
      n: 변화의 방향(단위 벡터)
```

### 벡터의 크기
벡터의 크기는 3차원 피타고라스 정리를 사용하여 계산합니다:
```cpp
float Vector3::magnitude() const {
    return sqrt(x*x + y*y + z*z);
}

// 제곱 크기 (빠른 계산을 위해 자주 사용)
float Vector3::squareMagnitude() const {
    return x*x + y*y + z*z;
}
```

### 단위 벡터 (정규화)
방향 n을 구하는 과정을 정규화(normalizing)라고 하며, 다음 공식을 사용합니다:
```cpp
void Vector3::normalize() {
    float l = magnitude();
    if (l > 0) {
        *this *= 1.0f/l;  // â = a/|a|
    }
}
```

제곱근 계산은 비용이 많이 들기 때문에, 가능한 경우 squareMagnitude()를 사용하는 것이 좋습니다.

### 벡터의 방향
- 단위 벡터로 표현
- 각도로 표현 가능
```cpp
float Vector3::direction2D() const {
    return atan2(y, x);
}
```

## 방향 표현 방식

### 1. 오일러 각 (Euler Angles)
- 3개의 회전각으로 방향 표현
- 짐벌락(Gimbal Lock) 문제 발생 가능
```cpp
struct EulerAngles {
    float pitch; // X축 회전
    float yaw;   // Y축 회전
    float roll;  // Z축 회전
};
```

### 2. 방향 코사인 (Direction Cosines)
- 단위 벡터의 각 축과의 각도
- 9개의 값으로 표현 (3x3 행렬)
```cpp
struct DirectionCosines {
    float matrix[3][3];
};
```

## 물리 엔진에서의 활용

### 1. 운동 계산
```cpp
// 속도와 가속도를 이용한 위치 업데이트
position += velocity * deltaTime;
velocity += acceleration * deltaTime;
```

### 2. 충돌 처리
```cpp
// 충돌 법선 벡터를 이용한 반사 벡터 계산
Vector3 reflect(const Vector3& incident, const Vector3& normal) {
    return incident - 2.0f * dot(incident, normal) * normal;
}
```

### 3. 힘 적용
```cpp
// 물체에 힘 적용
void applyForce(const Vector3& force) {
    acceleration += force / mass;
}
```

## 주의사항

1. **정밀도 관리**
   - 부동소수점 오차 관리
   - 매우 작은 값 처리

2. **성능 최적화**
   - 불필요한 제곱근 계산 피하기
   - SIMD 명령어 활용 고려

3. **특수 케이스 처리**
   - 0 벡터 처리
   - 정규화 시 예외 처리

## 참고 자료
- Game Physics Engine Development (Ian Millington)
- Essential Mathematics for Games and Interactive Applications (James M. Van Verth)
- 3D Game Engine Programming (Stefan Zerbst) 