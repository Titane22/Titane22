---
layout: page
title: 공간의 방향성(Handedness)
description: >
  3D 공간에서의 왼손/오른손 좌표계 시스템과 게임 물리 엔진에서의 활용법을 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

3D 공간에서 좌표계를 정의할 때는 두 가지 방식이 있습니다: 왼손 좌표계(Left-handed)와 오른손 좌표계(Right-handed). 이 두 시스템의 차이점과 게임 물리 엔진에서의 활용법을 알아보겠습니다.

## 좌표계 시스템의 이해

![Left-right-handed-axes](/assets/img/blog/gamedev/Left-right-handed-axes.png)

_왼손 좌표계와 오른손 좌표계의 축 방향 비교_

### 오른손 좌표계 (Right-handed Coordinate System)
- 엄지: X축 (양의 방향)
- 검지: Y축 (양의 방향)
- 중지: Z축 (양의 방향)
- 오른손 법칙을 따름
- OpenGL, Unity(기본값) 등에서 사용

### 왼손 좌표계 (Left-handed Coordinate System)
- 엄지: X축 (양의 방향)
- 검지: Y축 (양의 방향)
- 중지: Z축 (양의 방향이지만 반대 방향)
- DirectX, Unreal Engine 등에서 사용

## 좌표계 선택의 중요성

1. **크로스 프로덕트 (외적)**
   - 오른손 좌표계: A × B = C (오른손 법칙)
   - 왼손 좌표계: A × B = -C (왼손 법칙)

2. **회전 방향**
   - 오른손 좌표계: 반시계 방향이 양의 회전
   - 왼손 좌표계: 시계 방향이 양의 회전

3. **변환 행렬**
   - 좌표계에 따라 변환 행렬의 구성이 달라짐
   - 특히 투영 행렬에서 중요한 차이 발생

## 게임 물리 엔진에서의 고려사항

1. **충돌 감지**
   - 법선 벡터의 방향
   - 충돌 응답 계산

2. **각운동량 계산**
   - 회전 방향의 결정
   - 토크 계산

3. **좌표계 변환**
   - 월드 공간 ↔ 로컬 공간
   - 물리 시뮬레이션 공간

## 실제 구현 시 주의사항

```cpp
// 오른손 좌표계에서의 크로스 프로덕트
Vector3 CrossProduct(const Vector3& a, const Vector3& b) {
    return Vector3(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
}

// 왼손 좌표계에서의 크로스 프로덕트
Vector3 CrossProduct(const Vector3& a, const Vector3& b) {
    return Vector3(
        a.z * b.y - a.y * b.z,
        a.x * b.z - a.z * b.x,
        a.y * b.x - a.x * b.y
    );
}
```

## 엔진 간 전환 시 고려사항

1. **좌표계 변환**
   - Z축 반전
   - 회전 방향 조정
   - UV 좌표 조정

2. **에셋 파이프라인**
   - 모델링 툴의 좌표계 설정
   - 익스포트/임포트 시 변환 옵션

3. **물리 시뮬레이션**
   - 중력 방향
   - 충돌 응답
   - 관성 텐서 계산

## 참고 자료
- Game Physics Engine Development (Ian Millington)