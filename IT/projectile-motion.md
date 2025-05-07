---
layout: page
title: 포물선 운동 계산
description: >
  게임에서 투사체의 포물선 운동을 계산하는 방법
---

## 개요
게임에서 투사체의 움직임을 자연스럽게 표현하기 위한 포물선 운동의 수학적 원리와 구현 방법을 설명합니다.

## 노드 파라미터 설명

### 입력 파라미터
- **Start Pos**: 투사체의 시작 위치 (Vector3)
- **End Pos X/Y/Z**: 목표 도달 위치의 각 좌표 (Float)
- **Override Gravity Z**: 중력 가속도 값 (기본값: -980.0)
- **Arc Param**: 포물선의 곡률 제어 파라미터 (0.0 ~ 1.0)

### 출력 파라미터
- **Out Launch Velocity**: 계산된 초기 발사 속도 (Vector3)
- **Return Value**: 계산 성공 여부 (Boolean)

## 수학적 원리

### 1. 포물선 운동 기본 방정식
시간 t에서의 위치:

$$
\begin{aligned}
x(t) &= x_0 + v_{0x}t \\
y(t) &= y_0 + v_{0y}t \\
z(t) &= z_0 + v_{0z}t - \frac{1}{2}gt^2
\end{aligned}
$$

### 2. 초기 속도 계산
목표 지점 도달을 위한 초기 속도:

$$
\begin{aligned}
T &= \sqrt{\frac{2h}{g}} \cdot (1 + \text{arcParam}) \\[1em]
v_{0x} &= \frac{x_{end} - x_{start}}{T} \\[1em]
v_{0y} &= \frac{y_{end} - y_{start}}{T} \\[1em]
v_{0z} &= \frac{z_{end} - z_{start}}{T} + \frac{1}{2}gT
\end{aligned}
$$

여기서:
- $$T$$ : 예상 비행 시간
- $$g$$ : 중력 가속도
- $$h$$ : 시작점과 끝점의 높이 차이
- $$\text{arcParam}$$ : 포물선 곡률 제어 파라미터 (0.0 ~ 1.0)

## 실전 응용

### 1. 기본 사용 예시
```cpp
// 기본적인 포물선 투사체 발사
void AProjectile::LaunchProjectile(float Speed) 
{
    // 현재 위치와 목표 위치 설정
    FVector StartPos = GetActorLocation();           // 현재 위치
    FVector EndPos = TargetActor->GetActorLocation(); // 목표 위치
    float ArcParam = 0.5f;                           // 중간 정도의 곡률

    // 포물선 초기 속도 계산
    FVector LaunchVelocity = CalculateVelocity(
        StartPos,
        EndPos,
        ArcParam,
        -980.0f  // 기본 중력값
    );

    // 프로젝타일 발사
    ProjectileMovement->SetVelocityInLocalSpace(LaunchVelocity);
    ProjectileMovement->Activate();
}
```
링크: [BattleTank/Projectile.cpp](https://github.com/Titane22/04_BattleTank/blob/master/BattleTank/Source/BattleTank/Private/Projectile.cpp)

### 2. 상황별 Arc Param 조정
- **낮은 곡률 (0.0 ~ 0.3)**: 직선적인 발사 (총알, 레이저)
- **중간 곡률 (0.3 ~ 0.7)**: 표준 투사체 (화살, 수류탄)
- **높은 곡률 (0.7 ~ 1.0)**: 높은 포물선 (박격포, 투석기)

## 최적화 및 주의사항

### 1. 성능 최적화
- 불필요한 매 프레임 계산 피하기
- 미리 계산된 값 캐싱
- 정밀도와 성능의 균형

### 2. 예외 처리
- 도달 불가능한 거리 체크
- 최대/최소 속도 제한
- 물리적으로 불가능한 경우 대체 경로 제공

### 3. 게임플레이 고려사항
- 게임 장르에 맞는 곡률 선택
- 시각적 피드백 제공
- 플레이어 예측 가능성 확보

## 활용 예시

### 1. 전투 시스템
- 투사체 무기 시스템
- 유도 미사일 초기 경로
- 범위형 스킬 예측선

### 2. 이동 시스템
- 캐릭터 점프 궤적
- NPC 이동 경로
- 물리 기반 애니메이션

### 3. UI/UX
- 조준선 가이드
- 투사체 경로 미리보기
- 착탄 지점 표시

## 디버깅 팁
1. 시각적 디버그 라인 사용
2. 주요 변수값 모니터링
3. 엣지 케이스 테스트

## 참고 사항
- 언리얼 엔진 공식 문서
- 물리 기반 시뮬레이션 고려
- 네트워크 동기화 처리