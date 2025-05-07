---
layout: page
title: 언리얼 엔진 카메라 Lock-on 시스템
description: >
  타겟팅 카메라 시스템 구현 가이드
---

# 카메라 Lock-on 시스템 구현

## 카메라 회전 계산 원리

### 1. 방향 벡터 계산
카메라에서 타겟으로의 방향 벡터 D는 다음과 같이 계산됩니다:
```
D = T - C
여기서,
T = 타겟의 위치 벡터 (Tx, Ty, Tz)
C = 카메라의 위치 벡터 (Cx, Cy, Cz)
```

### 2. 회전각 계산
```
Pitch (θ) = arctan(Dy / √(Dx² + Dz²))
Yaw (φ) = arctan(Dx / Dz)
```

### 3. 선형 보간 (LERP)
현재 각도에서 목표 각도로의 부드러운 전환:
```
R(t) = R₁ + (R₂ - R₁) * t

여기서,
R₁ = 현재 회전값
R₂ = 목표 회전값
t = DeltaTime * InterpSpeed
```

### 4. 시야각 계산
타겟이 카메라 시야각 내에 있는지 확인:
```
cos(θ) = (V₁ · V₂) / (|V₁| * |V₂|)

여기서,
V₁ = 카메라 전방 벡터
V₂ = 타겟 방향 벡터
θ = 두 벡터 사이의 각도
```

### 5. 거리 계산
카메라와 타겟 사이의 유클리드 거리:
```
Distance = √((Tx-Cx)² + (Ty-Cy)² + (Tz-Cz)²)
```

## 구현 코드

```cpp
void ACameraManager::UpdateCameraLockOn(float DeltaTime)
{
    if (!TargetActor || !PlayerController)
        return;

    // 1. 현재 상태 가져오기
    FRotator CurrentRotation = PlayerController->GetControlRotation();
    FVector TargetLocation = TargetActor->GetActorLocation();
    FVector CameraLocation = PlayerController->PlayerCameraManager->GetCameraLocation();
    
    // 2. 타겟 방향으로의 회전값 계산
    // 수학적으로: atan2(TargetLocation - CameraLocation)
    FRotator TargetRotation = UKismetMathLibrary::FindLookAtRotation(
        CameraLocation,
        TargetLocation
    );
    
    // 3. 각 축별 보간 처리
    // R(t) = R1 + (R2 - R1) * t, where t = DeltaTime * Speed
    FRotator NewRotation;
    NewRotation.Roll = FMath::FInterpTo(
        CurrentRotation.Roll,    // 시작 회전값
        TargetRotation.Roll,     // 목표 회전값
        DeltaTime,              // 보간 시간
        InterpSpeed             // 보간 속도
    );
    NewRotation.Pitch = FMath::FInterpTo(
        CurrentRotation.Pitch,
        TargetRotation.Pitch,
        DeltaTime,
        InterpSpeed
    );
    NewRotation.Yaw = FMath::FInterpTo(
        CurrentRotation.Yaw,
        TargetRotation.Yaw,
        DeltaTime,
        InterpSpeed
    );
    
    // 4. 새로운 회전값 적용
    PlayerController->SetControlRotation(NewRotation);
}
```

## 시야각 계산 및 타겟 감지

```cpp
bool ACameraManager::IsTargetInViewAngle(const FVector& TargetLocation, float MaxAngle)
{
    // 1. 카메라의 전방 벡터
    FVector CameraForward = PlayerController->PlayerCameraManager->GetActorForwardVector();
    
    // 2. 타겟까지의 방향 벡터
    FVector DirectionToTarget = (TargetLocation - PlayerController->PlayerCameraManager->GetCameraLocation()).GetSafeNormal();
    
    // 3. 각도 계산 (내적 사용)
    // cos(θ) = A·B / (|A|·|B|)
    float DotProduct = FVector::DotProduct(CameraForward, DirectionToTarget);
    float AngleInRadians = FMath::Acos(DotProduct);
    float AngleInDegrees = FMath::RadiansToDegrees(AngleInRadians);
    
    return AngleInDegrees <= MaxAngle;
}
```

## 거리 기반 타겟팅

```cpp
bool ACameraManager::IsTargetInRange(const FVector& TargetLocation, float MaxDistance)
{
    // 유클리드 거리 계산: √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
    float Distance = FVector::Distance(
        PlayerController->PlayerCameraManager->GetCameraLocation(),
        TargetLocation
    );
    
    return Distance <= MaxDistance;
}
```

## 최적화 고려사항

1. **벡터 연산 최적화**
   - 정규화된 벡터 재사용
   - 불필요한 제곱근 계산 회피

2. **보간 속도 조정**
   - InterpSpeed가 높을수록 빠른 회전
   - 일반적으로 3.0f ~ 10.0f 사이 값 사용

3. **프레임 독립적 보간**
   - DeltaTime을 사용하여 프레임률 독립적 동작
   - 부드러운 카메라 움직임 보장

## 최적화된 계산

### 1. 정규화된 방향 벡터
```cpp
FVector Direction = (TargetLocation - CameraLocation).GetSafeNormal();
```

### 2. 빠른 거리 비교
실제 거리 계산이 필요없는 경우 제곱 거리 사용:
```cpp
float SquaredDistance = (TargetLocation - CameraLocation).SizeSquared();
return SquaredDistance <= MaxDistanceSquared;
```

### 3. 효율적인 각도 계산
내적을 이용한 빠른 각도 비교:
```cpp
float DotProduct = FVector::DotProduct(CameraForward, DirectionToTarget);
return DotProduct >= FMath::Cos(FMath::DegreesToRadians(MaxAngle));
```
