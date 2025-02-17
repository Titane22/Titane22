---
layout: page
title: C++ Enum을 블랙보드에서 사용하기
description: >
  언리얼 엔진에서 C++로 정의한 열거형을 AI 블랙보드에 적용하는 방법
---

# C++ Enum을 블랙보드에서 사용하기

## C++ Enum 정의

먼저 블루프린트에서 사용 가능한 Enum을 C++에서 정의합니다:

```cpp
UENUM(BlueprintType)
enum class ENPCState : uint8
{
    Patrolling UMETA(DisplayName = "Patrolling"),
    Alerted UMETA(DisplayName = "Alerted"),
    // ... 추가 상태들
};
```

## 블랙보드에 Enum 적용하기

1. 블랙보드 에디터를 엽니다
2. New Key를 클릭하고 'Enum' 타입을 선택합니다
3. Details 패널의 **Enum Name** 텍스트 박스에 C++에서 정의한 Enum 이름을 직접 입력합니다
   - 예: `ENPCState`
4. Enter를 눌러 적용합니다

## 주의사항

- C++ Enum은 블랙보드의 드롭다운 목록에 자동으로 나타나지 않습니다
- Enum 이름을 정확히 입력해야 합니다 (대소문자 구분)
- UENUM(BlueprintType) 매크로가 반드시 필요합니다

## 활용 예시

```cpp
// AI Controller에서 상태 변경
void AAIController::UpdateState(ENPCState NewState)
{
    if (Blackboard)
    {
        Blackboard->SetValueAsEnum(TEXT("NPCState"), static_cast<uint8>(NewState));
    }
}
```

## 트러블슈팅

1. Enum이 인식되지 않는 경우
   - 프로젝트를 다시 빌드
   - Enum 이름이 정확한지 확인
   - UENUM(BlueprintType) 매크로 확인

2. 값이 제대로 설정되지 않는 경우
   - uint8로 캐스팅되었는지 확인
   - 블랙보드 키 이름이 정확한지 확인 