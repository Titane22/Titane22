---
layout: page
title: 애니메이션 루트 모션과 물리 회전
description: >
  언리얼 엔진의 Allow Physics Rotation During Anim Root Motion 설정에 대한 이해
hide_description: false
---

## Allow Physics Rotation During Anim Root Motion

### False 설정
<p align="center">
  <video width="100%" preload="auto" muted controls>
    <source src="{{ site.baseurl }}/assets/video/gamedev/allow-physics-rotation-false.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <em>Allow Physics Rotation이 비활성화된 경우 - 애니메이션이 회전을 완전히 제어</em>
</p>

### True 설정
<p align="center">
  <video width="100%" preload="auto" muted controls>
    <source src="{{ site.baseurl }}/assets/video/gamedev/allow-physics-rotation-true.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <em>Allow Physics Rotation이 활성화된 경우 - 물리 기반 회전이 적용되어 자연스러운 환경 상호작용</em>
</p>

### 개요
- 루트 모션 애니메이션 재생 중 물리 기반 회전을 허용할지 결정하는 설정
- Character Movement Component의 주요 설정 중 하나
- 캐릭터의 자연스러운 움직임과 물리적 상호작용에 영향

### 설정의 영향
1. 활성화된 경우 (True)
   - 물리 시스템이 캐릭터 회전에 영향을 줄 수 있음
   - 경사면이나 장애물과의 상호작용 시 자연스러운 회전 가능
   - 루트 모션 애니메이션의 회전값이 물리 시스템과 혼합됨

2. 비활성화된 경우 (False)
   - 애니메이션의 루트 모션이 회전을 완전히 제어
   - 물리적 충돌이 회전에 영향을 주지 않음
   - 정확한 애니메이션 방향 제어 가능

## 사용 사례

### 활성화가 유용한 경우
- 자연스러운 환경 상호작용이 필요한 상황
- 경사진 지형에서의 이동
- 물리적 충돌이 많은 전투 시스템
- 래그돌 전환이 필요한 상황

### 비활성화가 유용한 경우
- 정확한 애니메이션 방향 제어가 필요한 경우
- 정교한 전투 시스템
- 특정 방향으로의 강제 이동
- 컷신이나 특수 애니메이션 상황

## 구현 시 고려사항

### 물리 시스템과의 상호작용
```cpp
// Character Movement Component 설정
CharacterMovementComponent->bAllowPhysicsRotationDuringAnimRootMotion = true;
```

### 주의사항
1. 성능 영향
   - 물리 연산 추가로 인한 CPU 부하
   - 많은 캐릭터에 적용 시 성능 고려 필요

2. 애니메이션 품질
   - 물리 회전과 애니메이션 블렌딩의 자연스러움
   - 급격한 방향 전환 시 부자연스러운 움직임 발생 가능

3. 게임플레이 영향
   - 전투 시스템의 정확성
   - 플레이어 조작감

## 결론
Allow Physics Rotation During Anim Root Motion 설정은 캐릭터의 자연스러운 움직임과 게임플레이 요구사항 사이의 균형을 맞추는 중요한 도구입니다. 상황에 따라 적절히 활용하면 더 몰입감 있는 게임플레이를 구현할 수 있습니다.

## 참고 자료
- [Unreal Engine Documentation - Character Movement Component](https://docs.unrealengine.com/5.0/en-US/API/Runtime/Engine/GameFramework/UCharacterMovementComponent/)