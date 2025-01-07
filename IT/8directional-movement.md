---
layout: page
title: 8방향 이동 블렌드 스페이스
description: >
  언리얼 엔진에서 8방향 이동 시스템 구현을 위한 블렌드 스페이스 설정 가이드
hide_description: false
---

## 필요한 애니메이션

![8방향 이동 애니메이션 구성](/assets/img/blog/gamedev/8directionalmovement.png)
*8방향 이동을 위한 기본 애니메이션 구성도*

## 애니메이션 목록

| 걷기 동작 (Walking) | 달리기 동작 (Running) |
|-------------------|-------------------|
| Idle | - |
| Walking Forward | Running Forward |
| Walking Backward | Running Backward |
| Walking Left | Running Left |
| Walking Right | Running Right |
| Walking Forward Left | Running Forward Left |
| Walking Forward Right | Running Forward Right |
| Walking Backward Left | Running Backward Left |
| Walking Backward Right | Running Backward Right |

## 블렌드 스페이스 설정 방법

1. **블렌드 스페이스 생성**
   - 콘텐츠 브라우저에서 우클릭 > Animation > Blend Space
   - 축 설정:
     - Horizontal Axis: Direction (-180 to 180)
     - Vertical Axis: Speed (0 to 600)

2. **샘플 포인트 배치**
   - Idle (0, 0)
   - Walking 시리즈 (Speed = 180)
     - Forward (0, 180)
     - Backward (180, 180)
     - Left (-90, 180)
     - Right (90, 180)
     - Forward Left (-45, 180)
     - Forward Right (45, 180)
     - Backward Left (-135, 180)
     - Backward Right (135, 180)
   
   - Running 시리즈 (Speed = 600)
     - Forward (0, 600)
     - Backward (180, 600)
     - Left (-90, 600)
     - Right (90, 600)
     - Forward Left (-45, 600)
     - Forward Right (45, 600)
     - Backward Left (-135, 600)
     - Backward Right (135, 600)

3. **보간 설정**
   - Interpolation Type: Averaged Interpolation
   - Target Weight Interpolation: Per-axis
   - Number of Grid Divisions: 8 (방향), 4 (속도)

## 애니메이션 블루프린트 연동

