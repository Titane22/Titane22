---
layout: page
title: 언리얼 엔진 UI/Widget 시스템
description: >
  언리얼 엔진의 UI 시스템과 위젯 블루프린트 활용 가이드
---

## 기본 개념
언리얼 엔진의 UI 시스템은 UMG(Unreal Motion Graphics)를 통해 구현됩니다. UMG는 게임 내 UI 요소를 디자인하고 구현하기 위한 비주얼 UI 저작 도구입니다.

## 전체 예제 코드

```cpp
// W_HealthBar.h
#pragma once

#include "CoreMinimal.h"
#include "Blueprint/UserWidget.h"
#include "Components/ProgressBar.h"
#include "I_Damagable.h"
#include "W_HealthBar.generated.h"

UCLASS()
class LEGACYHUNTER_API UW_HealthBar : public UUserWidget
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category = "UI")
    float GetPercent() const;

protected:
    UPROPERTY(meta = (BindWidget))
    class UProgressBar* ProgressBar;

    UPROPERTY(BlueprintReadWrite, Category = "References")
    TScriptInterface<II_Damagable> DamagableActor;
};

// I_Damagable.h
#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "I_Damagable.generated.h"

UINTERFACE(MinimalAPI)
class UI_Damagable : public UInterface
{
    GENERATED_BODY()
};

class LEGACYHUNTER_API II_Damagable
{
    GENERATED_BODY()

public:
    // Health 관련
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Health")
    float GetCurrentHealth();

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Health")
    float GetMaxHealth();

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Health")
    void Heal(float Amount);

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Health")
    void TakeDamage(float DamageAmount, FDamageEvent const& DamageEvent, AController* EventInstigator, AActor* DamageCauser);

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Health")
    bool IsDead() const;

    // Combat 관련
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Combat")
    bool IsAttacking() const;

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Combat")
    void ReserveAttackToken();

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Combat")
    void ReturnAttackToken();

    // Team 관련
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Team")
    int32 GetTeamNumber() const;

    // State 관련
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "State")
    void SetInterruptable(bool bCanBeInterrupted);

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "State")
    void SetIsInvincible(bool bInvincible);
};
```

## Widget Blueprint 작업 순서

1. **위젯 생성**
   - Content Browser에서 우클릭 → User Interface → Widget Blueprint

2. **디자인 구성**
   - Palette에서 필요한 위젯 컴포넌트를 드래그하여 배치
   - Hierarchy 창에서 위젯 구조 관리
   - Details 패널에서 속성 설정

3. **C++ 연동 예제**
```cpp
// 위젯 생성 및 표시
UUserWidget* Widget = CreateWidget<UUserWidget>(GetWorld(), WidgetClass);
Widget->AddToViewport();

// 위젯 업데이트
GetWorld()->GetTimerManager().SetTimer(UpdateTimer, this, &UCustomWidget::UpdateWidget, UpdateInterval, true);

// 위젯 제거
Widget->RemoveFromParent();
```

## 주요 위젯 컴포넌트

- **Text**: 텍스트 표시
- **Button**: 클릭 가능한 버튼
- **Progress Bar**: 진행률 표시
- **Image**: 이미지 표시
- **Canvas Panel**: 자유로운 레이아웃
- **Horizontal/Vertical Box**: 수평/수직 정렬
- **Grid Panel**: 그리드 레이아웃
- **Overlay**: 레이어 중첩

## 최적화 팁

1. 불필요한 위젯은 Visibility를 Hidden으로 설정
2. Tick 대신 Timer 사용
3. 위젯 재사용 및 Pooling 시스템 활용
4. 동적 콘텐츠는 필요한 경우에만 업데이트
5. 복잡한 레이아웃은 여러 위젯으로 분할하여 관리

## 참고 사항
- 위젯 블루프린트에서 C++ 함수 호출 시 UFUNCTION 매크로 필수
- 인터페이스 함수는 BlueprintNativeEvent로 선언하여 블루프린트 오버라이드 가능
- BindWidget 매크로를 사용하여 위젯 컴포넌트와 변수를 자동으로 연결