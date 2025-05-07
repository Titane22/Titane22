---
layout: page
title: 게임 물리
description: >
  게임 개발에 필요한 물리 시스템의 기초를 알아봅니다.
categories: [IT]
tags: [game-development, physics]
---

## 기본 물리 개념

### 1. 힘과 운동
- 뉴턴의 운동 법칙
- 가속도와 속도
- 질량과 무게
- 마찰력

### 2. 충돌 처리
- 충돌 감지
- 충돌 응답
- 탄성/비탄성 충돌

## 물리 시뮬레이션

### 1. 입자 시스템
```cpp
struct Particle {
    Vector3 position;
    Vector3 velocity;
    Vector3 acceleration;
    float mass;
    
    void Update(float deltaTime) {
        velocity += acceleration * deltaTime;
        position += velocity * deltaTime;
    }
};
```

### 2. 강체 동역학
- 회전 운동
- 토크와 각운동량
- 관성 텐서

### 3. 제약 조건
- 거리 제약
- 각도 제약
- 조인트 시스템

## 게임 물리 최적화

### 1. 광역 충돌 감지
- 공간 분할
- 경계 볼륨 계층

### 2. 연속 충돌 감지
- 스위핑
- 시간 기반 충돌