---
layout: page
title: 언리얼 엔진 루트 모션
description: >
  언리얼 엔진에서 루트 모션(Root Motion)의 개념과 구현 방법을 알아봅니다.
categories: [IT]
tags: [unreal-engine, animation, game-development]
---

루트 모션(Root Motion)은 캐릭터의 움직임을 애니메이션 데이터를 기반으로 제어하는 기술입니다. 이를 통해 더욱 자연스럽고 정확한 캐릭터 움직임을 구현할 수 있습니다.

## 루트 모션의 이해

### 기본 개념
- 루트 모션은 애니메이션의 루트 본(root bone) 움직임을 캐릭터의 실제 이동에 적용
- 애니메이션 데이터에 기반한 정확한 이동 구현 가능
- 물리 기반 상호작용과의 연동 용이

### 장점
- 정확한 애니메이션 이동 구현
- 복잡한 움직임 패턴 구현 가능
- 자연스러운 캐릭터 움직임
- 물리 기반 상호작용 향상

### 단점
- CPU 리소스 추가 사용
- 정확한 설정이 필요
- 애니메이션 전환 시 주의 필요

## 블루프린트로 루트 모션 구현하기

### 1. 애니메이션 블루프린트 설정

![Animation Blueprint Setup](/assets/img/blog/unreal/anim-blueprint-setup.png)

1. **애니메이션 블루프린트 생성**
   - Content Browser에서 우클릭
   - Animation > Animation Blueprint 선택
   - 사용할 스켈레톤 선택

2. **Anim Graph 설정**
   - Use Root Motion 옵션 활성화
   - State Machine 생성
   - 필요한 애니메이션 스테이트 추가

### 2. 스테이트 머신 구성

![State Machine Setup](/assets/img/blog/unreal/state-machine.png)

```
상태 구성 예시:
- Idle
- Walk (Root Motion)
- Run (Root Motion)
- Jump (Root Motion)
```

### 3. 블렌드 스페이스 설정

![Blend Space Setup](/assets/img/blog/unreal/blend-space.png)

1. **블렌드 스페이스 생성**
   - Speed (X축)
   - Direction (Y축)
   - 각 지점에 적절한 애니메이션 할당

2. **트랜지션 규칙 설정**
   ```
   Idle -> Walk: Speed > 0
   Walk -> Run: Speed > 300
   Any -> Jump: IsJumping == true
   ```

### 4. 캐릭터 블루프린트 설정

![Character Blueprint Setup](/assets/img/blog/unreal/character-bp.png)

1. **Movement Component 설정**
   - Movement Mode: Using Root Motion
   - Root Motion Options 활성화
   - Nav Movement Flag 설정

2. **입력 처리**
   ```
   W/S: Forward/Backward Movement
   A/D: Left/Right Movement
   Space: Jump
   Shift: Sprint
   ```

### 5. 애니메이션 노티파이 활용

![Animation Notifies](/assets/img/blog/unreal/anim-notifies.png)

1. **이벤트 트리거**
   - 발자국 소리
   - 파티클 효과
   - 카메라 쉐이크

2. **타이밍 조절**
   ```
   - 공격 시작/종료 지점
   - 피격 판정 구간
   - 이동 속도 변화 구간
   ```

### 6. 디버깅 도구

![Debug Tools](/assets/img/blog/unreal/debug-tools.png)

1. **시각적 디버깅**
   - Show Root Motion
   - Show Velocity
   - Show Animation Poses

2. **문제 해결**
   ```
   - Root bone 위치 확인
   - 이동 경로 추적
   - 충돌 감지 시각화
   ```

### 7. 최적화 설정

![Optimization Settings](/assets/img/blog/unreal/optimization.png)

1. **LOD 설정**
   - 거리에 따른 애니메이션 복잡도 조절
   - 업데이트 빈도 최적화

2. **성능 모니터링**
   ```
   - Animation Blueprint 성능 프로파일링
   - 메모리 사용량 확인
   - CPU 사용량 모니터링
   ```

### 8. 네트워크 동기화

![Network Sync](/assets/img/blog/unreal/network-sync.png)

1. **리플리케이션 설정**
   - Movement Replication
   - Animation State Sync
   - Root Motion Source 동기화

2. **지연 보상**
   ```
   - 클라이언트 예측
   - 서버 권한 설정
   - 롤백/보정 처리
   ```

## 주의사항

### 1. 애니메이션 설정
- 루트 본이 올바르게 설정되어 있는지 확인
- 애니메이션 시작/종료 포즈가 매끄럽게 연결되는지 확인
- 블렌딩 파라미터 적절히 조정

### 2. 성능 고려사항
- 과도한 블렌드 스페이스 사용 자제
- 불필요한 노티파이 최소화
- LOD 설정 최적화

### 3. 디버깅 팁
- Play 모드에서 실시간으로 파라미터 조정
- Visual Logger 활용
- 문제 발생 시 단계별 확인

## 추가 리소스
- [언리얼 엔진 공식 문서](https://docs.unrealengine.com/)
- [루트 모션 튜토리얼](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/root-motion-in-unreal-engine)