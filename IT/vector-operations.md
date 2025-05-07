---
layout: page
title: 벡터의 내적과 외적
description: >
  게임 개발에서 자주 사용되는 벡터의 내적과 외적 연산
---

## 벡터의 내적 (Dot Product)

### 1. 수학적 정의
두 벡터 A와 B의 내적:

$$
\begin{aligned}
A \cdot B &= |A||B|\cos\theta \\
&= A_xB_x + A_yB_y + A_zB_z
\end{aligned}
$$

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
```

## 벡터의 외적 (Cross Product)

### 1. 수학적 정의
두 벡터 A와 B의 외적:

$$
\begin{aligned}
A \times B &= |A||B|\sin\theta\hat{n} \\
&= \begin{pmatrix}
A_yB_z - A_zB_y \\
A_zB_x - A_xB_z \\
A_xB_y - A_yB_x
\end{pmatrix}
\end{aligned}
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

