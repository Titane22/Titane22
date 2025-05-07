---
layout: page
title: 제트팩 시스템 구현 가이드
description: >
  언리얼 엔진에서 가변적인 점프와 제트팩 시스템을 구현하는 방법
hide_description: false
lang: ko
---

## 개요

게임에서 캐릭터의 이동성을 향상시키는 기능 중 하나인 제트팩 시스템은 플레이어에게 새로운 이동 옵션을 제공합니다. 이 페이지에서는 언리얼 엔진에서 가변적인 점프 높이와 제트팩 시스템을 구현하는 방법을 설명합니다.

## 기본 원리

제트팩 또는 가변적인 점프 시스템의 핵심 원리는 다음과 같습니다:

1. **버튼 홀드 감지**: 플레이어가 점프 버튼을 얼마나 오래 누르고 있는지 감지
2. **시간 기반 높이 조절**: 버튼을 누르고 있는 시간에 비례하여 상승력 제공
3. **최대 제한 설정**: 무한정 올라가지 않도록 최대 시간 또는 높이 제한 설정
4. **땅 감지**: 캐릭터가 지면에 닿았는지 여부 확인으로 제트팩/점프 사용 가능 상태 결정

## 구현 코드 설명

아래 코드는 언리얼 엔진의 캐릭터 클래스에서 가변적인 점프 높이를 구현하는 예시입니다:

```cpp
// 점프 키를 계속 누르고 있는지 확인
if (bJumpKeyHeld && !GetCharacterMovement()->IsMovingOnGround())
{
    // 키를 누르고 있는 시간 계산
    float HeldTime = GetWorld()->GetTimeSeconds() - JumpHoldStartTime;
    
    // 최대 홀드 시간을 초과하지 않았을 때만 추가 점프 높이 적용
    if (HeldTime <= MaxJumpHoldTime)
    {
        // 시간에 비례하여 추가 점프 높이 계산 (선형으로 증가)
        float JumpBoost = FMath::Lerp(0.0f, MaxJumpHeight - MinJumpHeight, HeldTime / MaxJumpHoldTime);
        
        // Z 속도에 부스트 적용
        FVector Velocity = GetCharacterMovement()->Velocity;
        if (Velocity.Z > 0)
        {
            // 점프 중이고 위로 올라가는 중일 때만 추가 부스트 적용
            Velocity.Z += JumpBoost * DeltaTime * 4.0f; 
            GetCharacterMovement()->Velocity = Velocity;
        }
    }
}
```

### 주요 변수 설명

- `bJumpKeyHeld`: 점프 키가 현재 눌려있는지 여부를 저장하는 불리언 변수
- `JumpHoldStartTime`: 점프 키를 처음 눌렀을 때의 시간을 저장
- `MaxJumpHoldTime`: 점프 키를 최대로 유지할 수 있는 시간 (초)
- `MinJumpHeight`: 최소 점프 높이 (짧게 탭했을 때)
- `MaxJumpHeight`: 최대 점프 높이 (최대 시간동안 홀드했을 때)
- `DeltaTime`: 프레임 간 경과 시간 (초)

## 전체 구현 과정

### 1. 필요한 변수 선언

Character 클래스의 헤더 파일(.h)에 다음 변수들을 선언합니다:

```cpp
// 점프 관련 변수
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jump")
float MinJumpHeight = 300.0f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jump")
float MaxJumpHeight = 600.0f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jump")
float MaxJumpHoldTime = 0.5f;

// 내부 사용 변수
bool bJumpKeyHeld = false;
float JumpHoldStartTime = 0.0f;
```

### 2. 입력 바인딩 설정

`SetupPlayerInputComponent` 함수에서 점프 키에 대한 Press와 Release 이벤트를 모두 바인딩합니다:

```cpp
void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    
    // 기존 바인딩...
    
    // 점프 키 바인딩
    PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &AMyCharacter::StartJump);
    PlayerInputComponent->BindAction("Jump", IE_Released, this, &AMyCharacter::StopJump);
}
```

### 3. 점프 시작 및 종료 함수 구현

점프 키를 눌렀을 때와 뗐을 때의 동작을 구현합니다:

```cpp
void AMyCharacter::StartJump()
{
    bJumpKeyHeld = true;
    JumpHoldStartTime = GetWorld()->GetTimeSeconds();
    Jump(); // 기본 점프 함수 호출
}

void AMyCharacter::StopJump()
{
    bJumpKeyHeld = false;
    StopJumping(); // 기본 점프 중단 함수 호출
}
```

### 4. Tick 함수에서 점프 높이 조절

매 프레임마다 점프 높이를 조절하는 로직을 Tick 함수에 추가합니다:

```cpp
void AMyCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    // 점프 조절 로직
    if (bJumpKeyHeld && !GetCharacterMovement()->IsMovingOnGround())
    {
        float HeldTime = GetWorld()->GetTimeSeconds() - JumpHoldStartTime;
        
        if (HeldTime <= MaxJumpHoldTime)
        {
            float JumpBoost = FMath::Lerp(0.0f, MaxJumpHeight - MinJumpHeight, HeldTime / MaxJumpHoldTime);
            
            FVector Velocity = GetCharacterMovement()->Velocity;
            if (Velocity.Z > 0)
            {
                Velocity.Z += JumpBoost * DeltaTime * 4.0f; 
                GetCharacterMovement()->Velocity = Velocity;
            }
        }
    }
}
```

## 제트팩 모드로 확장하기

위 코드는 가변적인 점프 높이를 구현한 것이지만, 이를 제트팩 시스템으로 확장할 수 있습니다. 제트팩은 일반적으로 공중에서도 상승력을 제공하며, 연료 시스템을 가집니다.

### 1. 제트팩 변수 추가

```cpp
// 제트팩 관련 변수
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jetpack")
float JetpackForce = 800.0f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jetpack")
float MaxFuel = 100.0f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jetpack")
float FuelConsumptionRate = 20.0f;

UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement|Jetpack")
float FuelRefillRate = 10.0f;

UPROPERTY(BlueprintReadOnly, Category = "Movement|Jetpack")
float CurrentFuel;

UPROPERTY(BlueprintReadOnly, Category = "Movement|Jetpack")
bool bJetpackActive = false;
```

### 2. 제트팩 활성화/비활성화 함수

```cpp
void AMyCharacter::StartJetpack()
{
    if (CurrentFuel > 0)
    {
        bJetpackActive = true;
    }
}

void AMyCharacter::StopJetpack()
{
    bJetpackActive = false;
}
```

### 3. 제트팩 로직 구현

Tick 함수에 제트팩 로직을 추가합니다:

```cpp
void AMyCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    // 기존 점프 로직...
    
    // 제트팩 로직
    if (bJetpackActive && CurrentFuel > 0)
    {
        // 제트팩 힘 적용
        FVector JetpackImpulse = FVector(0, 0, JetpackForce * DeltaTime);
        GetCharacterMovement()->AddImpulse(JetpackImpulse, true);
        
        // 연료 소비
        CurrentFuel = FMath::Max(0.0f, CurrentFuel - FuelConsumptionRate * DeltaTime);
        
        // 연료가 바닥나면 제트팩 비활성화
        if (CurrentFuel <= 0)
        {
            bJetpackActive = false;
        }
    }
    else if (GetCharacterMovement()->IsMovingOnGround() && !bJetpackActive)
    {
        // 땅에 있고 제트팩이 비활성화된 상태면 연료 리필
        CurrentFuel = FMath::Min(MaxFuel, CurrentFuel + FuelRefillRate * DeltaTime);
    }
}
```

## 시각 효과 및 사운드 추가

실제 게임에서는 제트팩 사용 시 시각 효과와 사운드를 추가해야 합니다:

```cpp
void AMyCharacter::UpdateJetpackEffects()
{
    if (bJetpackActive)
    {
        if (!JetpackParticleComponent->IsActive())
        {
            JetpackParticleComponent->Activate();
            JetpackAudioComponent->Play();
        }
    }
    else
    {
        if (JetpackParticleComponent->IsActive())
        {
            JetpackParticleComponent->Deactivate();
            JetpackAudioComponent->Stop();
        }
    }
}
```

## 애니메이션 블렌드 스페이스 연동

제트팩 사용 시 캐릭터 애니메이션을 자연스럽게 전환하려면 애니메이션 블루프린트에 다음과 같은 로직을 추가할 수 있습니다:

1. `bJetpackActive` 변수를 애니메이션 블루프린트에 전달
2. 제트팩 활성화 상태와 수직 속도에 따라 블렌드 스페이스 구성
3. 제트팩 시작, 유지, 종료 애니메이션 상태 전환 구현

## 결론

가변적인 점프 높이와 제트팩 시스템은 플레이어에게 더 다양하고 재미있는 이동 옵션을 제공합니다. 위 코드를 기반으로 게임의 요구사항에 맞게 확장하고 수정할 수 있습니다. 예를 들어, 연료 게이지 UI 표시, 제트팩 업그레이드 시스템, 또는 공중에서 다양한 기동을 할 수 있는 추가 기능을 구현할 수 있습니다.

제트팩 시스템은 플랫포머 게임, 탐험 게임, 슈팅 게임 등 다양한 장르에서 활용할 수 있는 유용한 게임플레이 메커니즘입니다. 