---
layout: page
title: Pitch, Roll, Yaw (비행 역학 회전)
description: >
  3D 공간에서의 회전을 표현하는 Pitch, Roll, Yaw의 개념과 활용에 대해 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math, game-math]
---

## 개요

3D 공간에서 물체의 회전을 표현하는 세 가지 기본 축을 설명합니다. 이 용어들은 항공기의 움직임을 설명하는 데서 유래했지만, 현재는 3D 그래픽스와 게임 개발에서 널리 사용됩니다.

## 기본 개념

![pitch-roll-yaw](/assets/img/pitch-roll-yaw.png)

### Pitch (피치)
- Y축을 중심으로 한 회전
- 기수(nose)를 위아래로 움직이는 회전
- 고개를 끄덕이는 움직임과 유사

### Roll (롤)
- Z축을 중심으로 한 회전
- 좌우로 기울어지는 회전
- 고개를 좌우로 기울이는 움직임과 유사

### Yaw (요)
- X축을 중심으로 한 회전
- 좌우로 방향을 바꾸는 회전
- 고개를 좌우로 돌리는 움직임과 유사

## 언리얼 엔진에서의 사용

```cpp
// 회전값 설정
FRotator NewRotation(Pitch, Yaw, Roll);  // (Pitch, Yaw, Roll) 순서
Actor->SetActorRotation(NewRotation);

// 현재 회전값 얻기
FRotator CurrentRotation = Actor->GetActorRotation();
float CurrentPitch = CurrentRotation.Pitch;
float CurrentYaw = CurrentRotation.Yaw;
float CurrentRoll = CurrentRotation.Roll;

// 회전 추가
Actor->AddActorLocalRotation(FRotator(DeltaPitch, DeltaYaw, DeltaRoll));
```

## 주의사항

1. **짐벌 락(Gimbal Lock)**
   - 특정 회전 조합에서 발생하는 자유도 손실
   - 쿼터니온 사용으로 해결 가능

2. **각도 범위**
   - Pitch: -90° ~ +90°
   - Yaw: -180° ~ +180°
   - Roll: -180° ~ +180°

3. **좌표계 차이**
   - 엔진마다 축 방향이 다를 수 있음
   - 언리얼은 왼손 좌표계 사용

## 활용 사례

1. **카메라 제어**
```cpp
// 마우스 입력으로 카메라 회전
void APlayerCamera::UpdateCamera(float DeltaX, float DeltaY)
{
    float NewPitch = FMath::Clamp(CurrentRotation.Pitch + DeltaY, -89.0f, 89.0f);
    float NewYaw = CurrentRotation.Yaw + DeltaX;
    
    SetActorRotation(FRotator(NewPitch, NewYaw, 0.0f));
}
```

2. **비행체 조종**
```cpp
// 비행기 조종
void AAircraft::Control(float PitchInput, float YawInput, float RollInput)
{
    FRotator NewRotation = GetActorRotation();
    NewRotation += FRotator(PitchInput, YawInput, RollInput) * RotationRate * DeltaTime;
    SetActorRotation(NewRotation);
}
```

3. **캐릭터 회전**
```cpp
// 캐릭터 회전
void ACharacter::Turn(float YawDelta)
{
    AddControllerYawInput(YawDelta);
}
```

## 관련 수학

1. **오일러 각**
   - Pitch, Roll, Yaw는 오일러 각의 한 표현
   - 직관적이지만 짐벌 락 문제 존재

2. **쿼터니온**
   - 더 안정적인 회전 표현
   - 짐벌 락 없음
   - 계산 효율적

3. **회전 행렬**
   - 3x3 또는 4x4 행렬로 회전 표현
   - 다른 변환과 결합 용이 