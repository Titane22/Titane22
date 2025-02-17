---
layout: page
title: 언리얼 엔진 블루프린트 함수 라이브러리
description: >
  C++로 작성한 유틸리티 함수를 블루프린트에서 사용하기
---

# 블루프린트 함수 라이브러리

## 개요
블루프린트 함수 라이브러리는 특정 게임 오브젝트에 종속되지 않은 유틸리티 함수들의 모음입니다. 여러 블루프린트에서 공통으로 사용할 수 있는 정적 함수들을 제공할 때 유용합니다.

## 구현 방법

```cpp
UCLASS()
class MYGAME_API UMyBlueprintFunctionLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()
    
public:
    UFUNCTION(BlueprintCallable, Category="My Functions")
    static float CalculateDamage(float BaseDamage, float DefenseRatio);
    
    UFUNCTION(BlueprintPure, Category="My Functions")
    static FString GetFormattedPlayerName(const FString& RawName);
};
```

## 주요 특징

1. **독립성**
   - 특정 액터나 컴포넌트에 종속되지 않음
   - 어디서든 호출 가능

2. **정적 함수**
   - 모든 함수는 static으로 선언
   - 인스턴스 생성 없이 사용 가능

3. **재사용성**
   - 공통 기능을 한 곳에서 관리
   - 코드 중복 방지

## 사용 시 장점

1. 코드의 중앙 집중화
2. 유지보수 용이성
3. 블루프린트와 C++ 코드 간의 원활한 통합

[출처: 평범한 개발자의 개발 여정](https://jhtop0419.tistory.com/29) 