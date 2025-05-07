---
layout: page
title: FTransform 보간 처리
description: >
  언리얼 엔진에서 FTransform 타입의 올바른 보간 처리 방법을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [unreal, cpp, math]
---

## 문제점

기존 코드는 FTransform에 대해 직접 FMath::Lerp를 사용하려 했지만 작동하지 않습니다.

### 작동하지 않는 코드
```cpp
// 컴파일 에러 발생
FTransform InterpolatedTransform = FMath::Lerp(StartTransform, EndTransform, Alpha);
```

### 문제의 원인
1. FMath::Lerp는 기본 수치 타입이나 기본 수학 타입에만 정의됨
   - float, int 등의 기본 타입
   - FVector, FRotator 같은 기본 수학 타입
2. FTransform은 복합 데이터 타입
3. FTransform에 대한 - 연산자가 정의되어 있지 않음

## 해결 방법

FTransform의 각 구성 요소를 개별적으로 보간해야 합니다.

### 작동하는 코드
```cpp
FTransform InterpolateTransforms(const FTransform& Start, const FTransform& End, float Alpha)
{
    // 위치 보간
    FVector NewLocation = FMath::Lerp(
        Start.GetLocation(),
        End.GetLocation(),
        Alpha
    );

    // 회전 보간
    FQuat NewRotation = FMath::Lerp(
        Start.GetRotation(),
        End.GetRotation(),
        Alpha
    );

    // 스케일 보간
    FVector NewScale = FMath::Lerp(
        Start.GetScale3D(),
        End.GetScale3D(),
        Alpha
    );

    // 새로운 Transform 생성
    return FTransform(NewRotation, NewLocation, NewScale);
}
```

## 장점

1. **컴파일러 에러 해결**
   - 각 컴포넌트별로 올바른 보간 함수 사용
   - 타입 안정성 확보

2. **정확한 컴포넌트별 보간**
   - 위치, 회전, 스케일 각각 독립적으로 보간
   - 더 세밀한 제어 가능

3. **선택적 보간**
```cpp
// Z축 값을 유지하면서 X,Y만 보간하는 예시
FVector NewLocation = Start.GetLocation();
NewLocation.X = FMath::Lerp(Start.GetLocation().X, End.GetLocation().X, Alpha);
NewLocation.Y = FMath::Lerp(Start.GetLocation().Y, End.GetLocation().Y, Alpha);
// Z값은 Start 값 유지
```

## 주의사항

1. **회전 보간**
   - FQuat을 사용하면 더 부드러운 회전 보간 가능
   - FRotator 대신 FQuat 사용 권장

2. **성능 고려**
   - 개별 컴포넌트 보간으로 인한 약간의 성능 오버헤드
   - 최적화가 필요한 경우 사용 빈도 고려

3. **특수한 경우**
   - 비균일 스케일이 있는 경우 주의
   - 부모-자식 관계가 있는 경우 상대 변환 고려 