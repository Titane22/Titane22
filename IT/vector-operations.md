---
layout: page
title: 벡터의 내적과 외적
description: >
  게임 개발에서 자주 사용되는 벡터의 내적과 외적 연산
---

## 벡터의 내적 (Dot Product)

### 1. 수학적 정의
두 벡터 A와 B의 내적:

$$A \cdot B = |A||B|\cos\theta$$

$$A \cdot B = A_xB_x + A_yB_y + A_zB_z$$

### 2. 게임에서의 활용
1. **방향 체크**
   - 두 벡터가 이루는 각도 확인
   - 전방/후방 판정
   - 시야각 계산

2. **투영**
   - 한 벡터를 다른 벡터에 투영
   - 벽에 수직인 이동 벡터 계산
   - 카메라 정렬

### 3. 구현 예시
```cpp
float DotProduct(const FVector& A, const FVector& B)
{
    return A.X * B.X + A.Y * B.Y + A.Z * B.Z;
}

// 각도 계산 예시
float AngleBetweenVectors(const FVector& A, const FVector& B)
{
    float DotProd = DotProduct(A, B);
    float MagA = sqrt(DotProduct(A, A));
    float MagB = sqrt(DotProduct(B, B));
    return acos(DotProd / (MagA * MagB)) * 180.0f / PI;
}
```

## 벡터의 외적 (Cross Product)

### 1. 수학적 정의
두 벡터 A와 B의 외적:

$$A \times B = |A||B|\sin\theta\hat{n}$$

$$A \times B = 
\begin{pmatrix}
A_yB_z - A_zB_y \\
A_zB_x - A_xB_z \\
A_xB_y - A_yB_x
\end{pmatrix}
$$

### 2. 게임에서의 활용
1. **수직 벡터 생성**
   - 카메라 Up 벡터 계산
   - 평면의 법선 벡터 계산
   - 회전축 결정

2. **회전 방향 판단**
   - 좌/우회전 판정
   - 개체의 회전 방향 결정
   - 충돌 면 방향 계산

### 3. 구현 예시
```cpp
FVector CrossProduct(const FVector& A, const FVector& B)
{
    return FVector(
        A.Y * B.Z - A.Z * B.Y,
        A.Z * B.X - A.X * B.Z,
        A.X * B.Y - A.Y * B.X
    );
}

// 우측 벡터 계산 예시
FVector GetRightVector(const FVector& Forward, const FVector& Up)
{
    return CrossProduct(Forward, Up);
}
```

## 실전 응용 사례

### 1. 시야각 체크

```cpp
bool IsInViewAngle(const FVector& Forward, const FVector& DirectionToTarget, float ViewAngle)
{
    float Dot = DotProduct(Forward, DirectionToTarget);
    float Angle = FMath::Acos(Dot) * 180.0f / PI;
    return Angle <= ViewAngle * 0.5f;
}
```

### 2. 회전 방향 결정

```cpp
float DetermineRotationDirection(
    const FVector& Forward, 
    const FVector& DirectionToTarget,
    const FVector& Up)
{
    FVector Cross = CrossProduct(Forward, DirectionToTarget);
    float Dir = DotProduct(Cross, Up);
    return (Dir > 0.0f) ? 1.0f : -1.0f;
}
```

### 3. 부채꼴 범위 체크 (롤과 같은 부채꼴 스킬 범위)

```cpp
bool IsInArcRange(
    const FVector& CasterPosition,    // 캐스터(스킬 사용자) 위치
    const FVector& CasterForward,     // 캐스터의 전방 벡터
    const FVector& TargetPosition,    // 대상 위치
    float MaxDistance,                // 최대 사정거리
    float ArcAngle)                   // 부채꼴 각도 (도 단위)
{
    // 1. 거리 체크
    FVector DirectionToTarget = TargetPosition - CasterPosition;
    float DistanceToTarget = sqrt(DotProduct(DirectionToTarget, DirectionToTarget));
    
    if (DistanceToTarget > MaxDistance)
        return false;  // 대상이 최대 사정거리 밖에 있음
    
    // 2. 각도 체크
    // 방향 벡터를 정규화
    FVector NormalizedDirection = DirectionToTarget;
    // 거리의 역수를 한 번만 계산 (최적화: 나눗셈 연산은 비용이 크므로 한 번만 수행)
    float InvDist = 1.0f / DistanceToTarget;
    // 각 벡터 성분에 역수를 곱하여 정규화 (벡터 길이를 1로 만듦)
    // 곱셈은 나눗셈보다 연산 비용이 적어 성능상 이점이 있음
    NormalizedDirection.X *= InvDist;
    NormalizedDirection.Y *= InvDist;
    NormalizedDirection.Z *= InvDist;
    
    // 캐스터의 전방 벡터와 대상 방향 사이의 각도 계산
    float Dot = DotProduct(CasterForward, NormalizedDirection);
    float AngleRadians = acos(Dot);
    float AngleDegrees = AngleRadians * 180.0f / PI;
    
    // 부채꼴 내부에 있는지 확인
    return AngleDegrees <= ArcAngle * 0.5f;
}
```

## 부채꼴 스킬 구현 세부 사항

### 1. 기본 원리
부채꼴 범위의 스킬은 다음 요소들로 정의됩니다:
- 최대 사정거리 (부채꼴의 반지름)
- 부채꼴 각도 (예: 90도)
- 캐스터의 위치와 전방 벡터

### 2. 최적화 팁
```cpp
// 내적을 사용한 각도 비교 최적화 (역코사인 계산 없이)
bool IsInArcRangeOptimized(
    const FVector& CasterPosition,
    const FVector& CasterForward,
    const FVector& TargetPosition,
    float MaxDistance,
    float ArcAngleDegrees)
{
    // 1. 거리 체크
    FVector DirectionToTarget = TargetPosition - CasterPosition;
    float DistanceSquared = DotProduct(DirectionToTarget, DirectionToTarget);
    
    if (DistanceSquared > MaxDistance * MaxDistance)
        return false;
    
    // 2. 각도 체크 - 직접 각도 계산 대신 내적값 비교
    float CosineHalfAngle = cos(ArcAngleDegrees * 0.5f * PI / 180.0f);
    
    // 방향 벡터 정규화
    float InvDist = 1.0f / sqrt(DistanceSquared);
    FVector NormalizedDirection = FVector(
        DirectionToTarget.X * InvDist,
        DirectionToTarget.Y * InvDist,
        DirectionToTarget.Z * InvDist
    );
    
    // 내적값이 코사인 값보다 크면 각도가 작은 것
    float Dot = DotProduct(CasterForward, NormalizedDirection);
    return Dot >= CosineHalfAngle;
}
```

### 3. 시각적 표현
부채꼴 스킬의 시각적 표현을 위해서는:
- 메쉬나 파티클 이펙트를 사용하여 부채꼴 형태 렌더링
- 부채꼴의 모서리를 따라 점들을 배치하고 연결하여 그리기
- 쉐이더를 사용하여 동적 부채꼴 이펙트 생성

## 최적화 고려사항

1. **정규화(Normalize)**
   - 내적/외적 계산 전 벡터 정규화 필요성 검토
   - 불필요한 정규화 연산 최소화

2. **정밀도 vs 성능**
   - 각도 계산 시 역코사인 사용 최소화
   - 근사값 사용 가능 여부 검토

3. **캐싱**
   - 자주 사용되는 벡터 연산 결과 캐싱
   - Transform 정보 캐싱

## 주의사항

1. **수치 안정성**
   - 0에 가까운 값 처리
   - 정규화 전 길이 체크
   - NaN/Inf 처리

2. **최적화 균형**
   - 정확도와 성능의 균형
   - 상황에 따른 적절한 근사치 사용

3. **좌표계 주의**
   - 월드/로컬 좌표계 구분
   - 좌표계 변환 시 일관성 유지

