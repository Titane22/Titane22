---
layout: page
title: C++ Enum 사용 가이드
description: >
  언리얼 엔진에서 C++ enum 타입을 사용할 때의 가이드라인을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [unreal, cpp]
---

## 일반 C++ Enum 사용

UPROPERTY를 사용하지 않는 일반 C++ 멤버 변수로 선언할 때는 TEnumAsByte로 감싸지 않아도 됩니다.

### 예시 코드

```cpp
// 열거형 정의
UENUM()
enum class EGameState : uint8
{
    None,
    Playing,
    Paused,
    GameOver
};

class AMyGameMode
{
private:
    // 일반 C++ 멤버 변수로 사용할 때
    EGameState CurrentState;  // TEnumAsByte 불필요
};
```

## TEnumAsByte가 필요한 경우

TEnumAsByte는 언리얼 엔진의 리플렉션 시스템을 위한 것으로, 다음과 같은 경우에 필요합니다:

1. **블루프린트 접근이 필요한 경우**
```cpp
UPROPERTY(BlueprintReadWrite, Category = "Game")
TEnumAsByte<EGameState> CurrentState;
```

2. **에디터에서 수정이 필요한 경우**
```cpp
UPROPERTY(EditDefaultsOnly, Category = "Game")
TEnumAsByte<EGameState> DefaultState;
```

3. **네트워크 복제가 필요한 경우**
```cpp
UPROPERTY(Replicated, Category = "Game")
TEnumAsByte<EGameState> ReplicatedState;
```

## 사용 가이드라인

### TEnumAsByte 필요
- 블루프린트에서 변수 접근 필요
- 에디터에서 기본값 설정 필요
- 네트워크 복제 기능 필요
- 리플렉션 시스템 사용 필요

### TEnumAsByte 불필요
- 순수 C++ 코드에서만 사용
- 리플렉션 시스템 불필요
- 내부 로직용 열거형

## 주의사항

1. **메모리 크기**
   - TEnumAsByte는 항상 1바이트 크기
   - 일반 enum은 컴파일러에 따라 크기가 다를 수 있음

2. **성능 고려**
   - TEnumAsByte는 약간의 오버헤드 발생
   - 성능이 중요한 경우 일반 enum 사용 고려

3. **호환성**
   - 네트워크 복제 시 항상 TEnumAsByte 사용
   - 블루프린트 호환성 필요 시 TEnumAsByte 사용 