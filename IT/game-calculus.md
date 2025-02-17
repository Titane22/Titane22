---
layout: page
title: 게임 개발자를 위한 미적분학
description: >
  게임 물리 엔진 개발에 필요한 미적분학의 핵심 개념을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math, game-math]
---

## 개요

게임 물리 엔진에서는 시간에 따른 변화를 다루기 위해 미적분학이 필요합니다. 주로 위치, 속도, 가속도와 같은 벡터 양을 다룹니다.

## 미분 계산 (Differential Calculus)

### 속도 (Velocity)
- 위치의 시간에 대한 미분
- 수식: 
$$
v = \frac{dp}{dt} = \dot{p}
$$
- 순간 속도를 나타냄

```cpp
struct Vector3 {
    double x, y, z;
    Vector3 operator-(const Vector3& v) const {
        return {x - v.x, y - v.y, z - v.z};
    }
    Vector3 operator/(double t) const {
        return {x/t, y/t, z/t};
    }
};

// 속도 계산 (위치의 변화율)
Vector3 calculateVelocity(const Vector3& currentPos, const Vector3& prevPos, double deltaTime) {
    return (currentPos - prevPos) / deltaTime;
}
```

### 가속도 (Acceleration)
- 속도의 시간에 대한 미분
- 수식: 
$$
a = \frac{dv}{dt} = \frac{d^2p}{dt^2} = \ddot{p}
$$
- 속도 변화율을 나타냄

```cpp
// 가속도 계산 (속도의 변화율)
Vector3 calculateAcceleration(const Vector3& currentVel, const Vector3& prevVel, double deltaTime) {
    return (currentVel - prevVel) / deltaTime;
}
```

### 극한을 통한 이해
순간 속도를 정확하게 계산하기 위해 극한 개념을 사용합니다:

1. **평균 속도에서 시작**
   - 두 시점 사이의 위치 변화를 시간 간격으로 나눔
   - 수식: 
   $$
   v = \frac{\Delta p}{\Delta t}
   $$

2. **극한 적용**
   - 시간 간격을 무한히 작게 만듦
   - 수식: 
   $$
   v = \lim_{\Delta t \to 0} \frac{\Delta p}{\Delta t}
   $$

3. **미분 표기로 단순화**
   - 극한 표현을 미분 기호로 대체
   - 수식: 
   $$
   v = \frac{dp}{dt}
   $$

4. **점 표기법**
   - mechanics에서 자주 사용되는 간단한 표기
   - 수식: 
   $$
   v = \dot{p}
   $$

이러한 과정을 통해:
- 순간적인 변화율을 정확하게 계산 가능
- 연속적인 움직임을 수학적으로 표현
- 물리 엔진에서 정확한 움직임 구현 가능
```cpp
// 평균 속도 계산
Vector3 velocity = (currentPosition - previousPosition) / deltaTime;
```

## 벡터 미분

벡터의 미분은 각 성분별로 독립적으로 수행됩니다:

$$
\dot{a} = \begin{bmatrix} 
\dot{a_x} \\
\dot{a_y} \\
\dot{a_z}
\end{bmatrix}
$$

$$
\ddot{a} = \begin{bmatrix}
\ddot{a_x} \\
\ddot{a_y} \\
\ddot{a_z}
\end{bmatrix}
$$

```cpp
// 벡터 미분의 예
struct Vector3 {
    double x, y, z;
};

Vector3 vectorDerivative(const Vector3& v, double dt) {
    return Vector3{
        v.x/dt,  // X 성분의 미분
        v.y/dt,  // Y 성분의 미분
        v.z/dt   // Z 성분의 미분
    };
}
```

## 속도, 방향, 속력의 차이

### 속도 (Velocity)
- 벡터량
- 방향과 크기를 모두 포함

속도 벡터는 속력과 방향의 곱으로 표현됩니다:

$$
\dot{x} = s\hat{d}
$$

여기서:
- $s$는 속력(speed, 스칼라)
- $\hat{d}$는 단위 방향 벡터

속력은 속도의 크기로 계산됩니다:

$$
s = |\dot{x}|
$$

방향은 속도를 정규화하여 얻습니다:
$$
\hat{d} = \frac{\dot{x}}{|\dot{x}|}
$$

```cpp
struct Vector3 {
    double x, y, z;
    
    // 속력 계산 (벡터의 크기)
    double magnitude() const {
        return std::sqrt(x*x + y*y + z*z);
    }
    
    // 방향 계산 (정규화된 벡터)
    Vector3 normalize() const {
        double mag = magnitude();
        if (mag > 0) {
            return {x/mag, y/mag, z/mag};
        }
        return {0, 0, 0};
    }
};

// 속도 얻기
Vector3 velocity = getVelocity();

// 속력 얻기
double speed = velocity.magnitude();

// 방향 얻기
Vector3 direction = velocity.normalize();
```

## 주요 활용

1. **물리 시뮬레이션**
   - 운동 방정식 계산
   - 충돌 처리

2. **캐릭터 움직임**
   - 이동 속도 제어
   - 가속/감속 처리

3. **애니메이션**
   - 움직임 방향 결정
   - 속도 기반 애니메이션 블렌딩

## 주의사항

1. **수치 정밀도**
   - 매우 작은 시간 간격 사용 시 주의
   - 부동소수점 오차 고려

2. **성능 최적화**
   - 불필요한 계산 피하기
   - 캐싱 활용

3. **좌표계 일관성**
   - 월드/로컬 좌표계 구분
   - 단위 일관성 유지 

