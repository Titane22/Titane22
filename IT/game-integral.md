---
layout: page
title: 게임 물리의 적분 계산
description: >
  게임 물리 엔진에서 사용되는 적분 계산의 기본 개념을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math, game-math]
---

## 개요
적분은 미분의 반대 연산입니다. 게임 물리에서는 주로 물체의 위치와 속도를 업데이트하는 데 사용됩니다.

## 기본 공식

### 등속 운동 (constant velocity)
위치 업데이트:
$$
p(t) = p + \dot{p}t
$$

여기서:
- $$p$$ 는 위치
- $$\dot{p}$$ 는 속도
- $$t$$ 는 시간 간격

### 등가속도 운동 (constant acceleration)
위치 업데이트:
$$
p(t) = p + \dot{p}t + \frac{\ddot{p}t^2}{2}
$$

여기서:
- $$\ddot{p}$$ 는 가속도

## 벡터 적분

벡터의 각 성분별로 독립적으로 적분을 수행합니다:

$$
\begin{bmatrix}
p_x \\
p_y \\
p_z
\end{bmatrix} = 
\begin{bmatrix}
p_x + \dot{p}_xt \\
p_y + \dot{p}_yt \\
p_z + \dot{p}_zt
\end{bmatrix}
$$

```cpp
struct Vector3 {
    double x, y, z;
    
    Vector3 operator+(const Vector3& v) const {
        return {x + v.x, y + v.y, z + v.z};
    }
    
    Vector3 operator*(double t) const {
        return {x*t, y*t, z*t};
    }
    
    // 스케일된 벡터 더하기 (최적화된 버전)
    void addScaledVector(const Vector3& v, double t) {
        x += v.x * t;
        y += v.y * t;
        z += v.z * t;
    }
};

// 위치 업데이트 (등속 운동)
position = position + velocity * deltaTime;
// 또는 최적화된 버전
position.addScaledVector(velocity, deltaTime);
```

## 주의사항

1. **시간 간격**
   - 너무 큰 시간 간격은 부정확한 결과를 초래
   - 적절한 deltaTime 선택 중요

2. **정밀도**
   - 누적 오차 발생 가능
   - 필요한 경우 고차 적분 방법 사용

3. **최적화**
   - addScaledVector와 같은 최적화된 메서드 사용 권장
   - 불필요한 벡터 생성 피하기 