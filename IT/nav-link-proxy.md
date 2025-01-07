---
layout: page
title: NavLink Proxy & Smart Link
description: >
  언리얼 엔진의 Navigation Link Proxy와 Smart Link 시스템 가이드
hide_description: false
---

## NavLink Proxy 개요
* Navigation Link Proxy란?
  * 내비게이션 메시 상의 특별한 연결 지점
  * 서로 다른 내비게이션 영역을 연결
  * 점프, 사다리, 벽 넘기 등의 특수 이동 구현
* 주요 특징
  * 양방향/단방향 설정 가능
  * 커스텀 이동 로직 구현
  * 동적 활성화/비활성화

## 기본 구성요소

### 1. NavLink Proxy 설정
* **기본 속성**
  * Smart Link Enabled: 스마트 링크 사용 여부
  * Bidirectional: 양방향 이동 허용
  * Start Point/End Point: 시작점과 끝점
  * Link Direction: 링크 방향
  * Width: 링크 폭

* **Advanced 설정**
  * Snap to NavMesh: 내비메시에 스냅
  * Can Walk On: 위를 걸을 수 있는지
  * Area Class: 영역 클래스
  * Cost Override: 경로 비용 오버라이드

### 2. Smart Link
* **개념**
  * 고급 내비게이션 링크 시스템
  * 상황에 따른 동적 경로 결정
  * AI 캐릭터의 능력에 따른 경로 선택

* **설정 옵션**
  * Required Capabilities: 필요한 능력치
  * Navigation Classes: 사용 가능한 내비게이션 클래스
  * Link Cost: 링크 사용 비용
  * Direction Restriction: 방향 제한

## 구현 예제

### 1. 기본 NavLink 설정 
```cpp
// NavLinkSetup.h
UCLASS()
class ACustomNavLink : public ANavLinkProxy
{
    GENERATED_BODY()
    public:
    ACustomNavLink();
    virtual void BeginPlay() override;

    protected:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Navigation")
    bool bSmartLinkIsEnabled;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Navigation")
    FVector LinkRelativeStart;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Navigation")
    FVector LinkRelativeEnd;
};
// NavLinkSetup.cpp
ACustomNavLink::ACustomNavLink()
{
    // 기본 설정
    bSmartLinkIsEnabled = true;

    // 링크 포인트 설정
    PointLinks.Empty();
    PointLinks.Add(FNavigationLink());
    PointLinks[0].Left = LinkRelativeStart;
    PointLinks[0].Right = LinkRelativeEnd;
}
```
### 2. Smart Link 구현

```cpp
// SmartLinkComponent.h
UCLASS()
class UCustomSmartLinkComponent : public UNavLinkCustomComponent
{
    GENERATED_BODY()
public:
    // 스마트 링크 능력 정의
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Smart Link")
    TArray<FGameplayTag> RequiredAbilities;

    // 링크 사용 가능 여부 확인
    UFUNCTION(BlueprintCallable, Category = "Smart Link")
    bool CanUseSmartLink(ACharacter Character);
};
```

## 실전 활용 사례

### 1. 점프 포인트 구현
```cpp
void ACustomNavLink::SetupJumpPoint()
{
    // 점프 링크 설정
    FNavigationLink& JumpLink = PointLinks[0];
    JumpLink.SetAreaClass(UNavArea_Jump::StaticClass());
    JumpLink.Direction = ENavLinkDirection::BothWays;
    
    // 점프 파라미터 설정
    JumpLink.MaxFallSpeed = 1000.f;
    JumpLink.JumpGravity = GetWorld()->GetGravityZ();
}
```

### 2. 사다리 시스템
```cpp
void ACustomNavLink::SetupLadder()
{
    // 사다리 링크 설정
    FNavigationLink& LadderLink = PointLinks[0];
    LadderLink.SetAreaClass(UNavArea_Ladder::StaticClass());
    LadderLink.Direction = ENavLinkDirection::BothWays;
    
    // 사다리 특성 설정
    bSmartLinkIsEnabled = true;
    RequiredAbilities.Add(FGameplayTag::RequestGameplayTag(FName("Ability.Climb")));
}
```

## Smart Link 고급 기능

### 1. 동적 경로 비용
* 상황별 비용 계산
* AI 상태에 따른 비용 조정
* 환경 조건 반영

### 2. 조건부 활성화
* 게임플레이 상황에 따른 활성화
* 캐릭터 능력에 따른 접근 제한
* 시간/상황별 제한

### 3. 커스텀 이동 로직
```cpp:IT/index.md
void ACustomNavLink::OnSmartLinkReached(AActor* MovingActor, const FVector& DestinationPoint)
{
    // 특수 이동 애니메이션 실행
    if (ACharacter* Character = Cast<ACharacter>(MovingActor))
    {
        // 이동 타입에 따른 애니메이션 실행
        PlayMoveAnimation(Character);
        
        // 이동 완료 후 처리
        HandleMovementComplete(Character);
    }
}
```

## 디버깅과 최적화

### 1. 시각화 도구
* ShowNavigation 커맨드
* 링크 상태 표시
* 경로 시각화

### 2. 성능 고려사항
* 링크 수 최적화
* 스마트 링크 조건 최적화
* 경로 계산 부하 관리

## 베스트 프랙티스
1. 적절한 링크 배치
2. 명확한 사용 조건 정의
3. 성능을 고려한 스마트 링크 설계
4. 직관적인 디버그 시각화 구현
5. 확장 가능한 구조 설계
```

이 페이지는 다음 내용을 포함합니다:
1. NavLink Proxy의 기본 개념과 설정
2. Smart Link 시스템의 상세 설명
3. 실제 구현 예제 (점프, 사다리 등)
4. 고급 기능과 최적화 방법
5. 디버깅 도구와 베스트 프랙티스

각 섹션은 실제 프로젝트에서 활용할 수 있는 구체적인 예제와 설정 옵션을 포함하고 있습니다.