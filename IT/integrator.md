---
layout: page
title: Integrator
description: >
  물리 엔진에서의 통합기 구현과 역할에 대해 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-physics]
tags: [physics, integrator]
---

## 개요

통합기는 물리 엔진에서 각 객체의 위치와 속도를 업데이트하는 역할을 합니다. 각 프레임마다 객체의 가속도를 계산하고, 이를 통해 위치와 속도를 업데이트합니다.

## 업데이트 방정식

### 3.3.1 업데이트 방정식

#### 1) 위치 업데이트

위치를 업데이트하는 공식은 다음과 같습니다:

$$
p = p + vt + \frac{1}{2}at^2
$$

이 공식을 코드로 표현하면 다음과 같습니다:

```cpp
object.position += object.velocity * time +
                   object.acceleration * time * time * 0.5;
```

또는

```cpp
object.position.addScaledVector(object.velocity, time);
object.position.addScaledVector(object.acceleration, time * time * 0.5);
```

그러나 게임에서 매 프레임마다 업데이트를 수행하면 \( t \)가 매우 작습니다(예: 0.033초, 30FPS 기준). 따라서 \( at^2 \) 항이 너무 작아 실질적인 영향을 거의 주지 않습니다. 그래서 대부분의 경우 가속도 항을 무시하고 간단한 형태를 사용합니다:

$$
p = p + vt
$$

즉, 코드는 다음과 같이 처리할 수 있습니다:

```cpp
object.position.addScaledVector(object.velocity, time);
```

#### 2) 속도 업데이트

속도 업데이트는 다음 방정식을 따릅니다:

$$
v = v + at
$$

하지만 속도를 줄이는 감쇠(damping) 효과를 추가해야 합니다. 이를 반영하면 다음과 같은 새로운 방정식이 됩니다:

$$
v = vd^t + at
$$

여기서 \( d \)는 감쇠 계수(damping factor)입니다. 문제점: 위 방정식에서는 프레임 간격이 짧아지면 감쇠 효과가 커지는 문제가 있습니다. 이를 해결하기 위해 감쇠를 프레임이 아닌 시간 단위로 적용하는 방법을 사용합니다.

이 방식은 감쇠가 프레임의 속도에 영향을 받지 않도록 합니다. 단, \( d^t \) 계산(실수의 거듭제곱)은 성능이 느릴 수 있으므로 최적화가 필요합니다.

## 구현

```cpp
class Particle {
    // ... 기존 코드 ...
    void integrate(real duration) {
        assert(duration > 0.0);
        position.addScaledVector(velocity, duration);
        Vector3 resultingAcc = acceleration;
        resultingAcc.addScaledVector(forceAccum, inverseMass);
        velocity.addScaledVector(resultingAcc, duration);
        velocity *= real_pow(damping, duration);
    }
};
```

## 요약

통합기는 물리 엔진의 핵심 구성 요소로, 힘과 시간에 기반하여 위치와 속도를 통합합니다. 이 과정은 모든 물리 시뮬레이션의 기본 단계입니다. 