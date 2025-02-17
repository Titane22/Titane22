---
layout: page
title: 언리얼 리플렉션 시스템
description: >
  언리얼 엔진의 리플렉션 시스템의 개념과 활용 방법에 대해 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [unreal, cpp]
---

# 언리얼 리플렉션 시스템

## 개요

리플렉션 시스템은 런타임에 타입 정보를 조회하고 조작할 수 있게 해주는 메커니즘입니다. 언리얼 엔진에서는 이를 통해 블루프린트, 에디터, 직렬화, 네트워크 복제 등의 기능을 구현합니다.

## 주요 매크로

### 클래스 매크로
```cpp
// 기본 클래스 선언
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
};

// 추가 지정자 사용
UCLASS(Blueprintable, BlueprintType)
class MYGAME_API UMyObject : public UObject
{
    GENERATED_BODY()
};
```

### 프로퍼티 매크로
```cpp
UPROPERTY()  // 기본 프로퍼티
float DefaultValue;

UPROPERTY(EditAnywhere)  // 에디터에서 수정 가능
float EditableValue;

UPROPERTY(BlueprintReadWrite)  // 블루프린트에서 읽기/쓰기 가능
float BlueprintValue;

UPROPERTY(Replicated)  // 네트워크 복제
float NetworkValue;
```

### 함수 매크로
```cpp
UFUNCTION()  // 기본 함수
void DefaultFunction();

UFUNCTION(BlueprintCallable)  // 블루프린트에서 호출 가능
void CallableFromBlueprint();

UFUNCTION(Server, Reliable)  // 서버 RPC
void ServerFunction();
```

## 리플렉션 지정자

### 클래스 지정자
- **Blueprintable**: 블루프린트로 상속 가능
- **BlueprintType**: 블루프린트에서 변수로 사용 가능
- **Abstract**: 추상 클래스
- **NotBlueprintable**: 블루프린트로 상속 불가

### 프로퍼티 지정자
- **EditAnywhere**: 인스턴스와 아카이브에서 수정 가능
- **EditDefaultsOnly**: 아카이브에서만 수정 가능
- **EditInstanceOnly**: 인스턴스에서만 수정 가능
- **VisibleAnywhere**: 읽기 전용으로 표시
- **Category**: 에디터에서의 카테고리 지정

### 함수 지정자
- **BlueprintCallable**: 블루프린트에서 호출 가능
- **BlueprintPure**: 상태를 변경하지 않는 순수 함수
- **BlueprintImplementableEvent**: 블루프린트에서 구현
- **BlueprintNativeEvent**: C++에서 기본 구현 제공

## 활용 예시

### 동적 타입 확인
```cpp
if (Object->IsA(AMyActor::StaticClass()))
{
    // AMyActor 타입인 경우
}
```

### 프로퍼티 접근
```cpp
for (TFieldIterator<FProperty> PropIt(Class); PropIt; ++PropIt)
{
    FProperty* Property = *PropIt;
    // 프로퍼티 처리
}
```

### 함수 호출
```cpp
UFunction* Function = Object->FindFunction(FName(TEXT("MyFunction")));
if (Function)
{
    Object->ProcessEvent(Function, nullptr);
}
```

## 주의사항

1. **성능 고려**
   - 리플렉션은 직접 접근보다 느림
   - 성능이 중요한 경우 직접 접근 사용

2. **메모리 사용**
   - 리플렉션 정보는 추가 메모리 사용
   - 필요한 경우에만 리플렉션 활성화

3. **빌드 시간**
   - 리플렉션 정보 생성으로 빌드 시간 증가
   - 불필요한 리플렉션 매크로 제거

4. **헤더 툴**
   - UHT(Unreal Header Tool) 의존성
   - 매크로 문법 정확히 준수 필요

## 활용 사례

1. **에디터 통합**
   - 커스텀 에디터 도구 개발
   - 프로퍼티 에디터 커스터마이징

2. **직렬화**
   - 세이브 게임 시스템
   - 에셋 로딩/저장

3. **네트워킹**
   - 변수 복제
   - RPC 구현

4. **UI/UX**
   - 데이터 바인딩
   - 동적 UI 생성 