---
layout: page
title: 언리얼 엔진 무기 스폰 시스템
description: >
  언리얼 엔진에서 무기 액터를 스폰하고 캐릭터에 부착하는 방법
---

# 언리얼 엔진 무기 스폰 시스템

## 기본 구현

```cpp
// 헤더 파일
UCLASS()
class YOURGAME_API ACharacterBase : public ACharacter
{
    GENERATED_BODY()
    
protected:
    // 블루프린트에서 설정 가능한 무기 클래스
    UPROPERTY(EditDefaultsOnly, Category = "Weapon")
    TSubclassOf<AActor> WeaponClass;
    
    // 현재 장착된 무기 참조
    UPROPERTY()
    AActor* CurrentWeapon;
    
public:
    UFUNCTION(BlueprintCallable, Category = "Weapon")
    void SpawnAndAttachWeapon();
};

// CPP 파일
void ACharacterBase::SpawnAndAttachWeapon()
{
    if (WeaponClass)
    {
        // 스폰 파라미터 설정
        FActorSpawnParameters SpawnParams;
        SpawnParams.Owner = this;
        SpawnParams.Instigator = GetInstigator();
        
        // 현재 액터의 위치에서 무기 스폰
        AActor* SpawnedWeapon = GetWorld()->SpawnActor<AActor>(
            WeaponClass,
            GetActorTransform(),
            SpawnParams
        );
        
        if (SpawnedWeapon)
        {
            // 무기를 캐릭터 메시의 특정 소켓에 부착
            FAttachmentTransformRules AttachRules(
                EAttachmentRule::SnapToTarget, // 부착 규칙
                true                          // 웰딩 여부
            );
            
            SpawnedWeapon->AttachToComponent(
                GetMesh(),                    // 부착할 부모 컴포넌트
                AttachRules,                  // 부착 규칙
                FName("weapon_socket")        // 소켓 이름
            );
        }
    }
}
```

## 주요 구성 요소

1. **무기 클래스 설정**
   - `TSubclassOf<AActor>`를 사용하여 스폰할 무기 클래스 지정
   - 블루프린트에서 설정 가능하도록 `EditDefaultsOnly` 지정

2. **스폰 파라미터**
   ```cpp
   FActorSpawnParameters SpawnParams;
   SpawnParams.Owner = this;           // 무기의 소유자 설정
   SpawnParams.Instigator = GetInstigator(); // 발동자 설정
   ```

3. **부착 규칙**
   ```cpp
   FAttachmentTransformRules AttachRules(
       EAttachmentRule::SnapToTarget, // 타겟 위치에 즉시 스냅
       true                          // 웰딩 활성화
   );
   ```

## 소켓 설정 가이드

1. 언리얼 에디터에서 캐릭터 스켈레탈 메시 열기
2. 소켓 추가하기:
   - 스켈레톤 트리에서 원하는 본 선택
   - 우클릭 → Add Socket
   - 소켓 이름 설정 (예: "weapon_socket")
   - 소켓의 위치와 회전 조정

## 구현 시 주의사항

1. **메모리 관리**
   ```cpp
   // 새 무기 스폰 전 기존 무기 제거
   if (CurrentWeapon)
   {
       CurrentWeapon->Destroy();
       CurrentWeapon = nullptr;
   }
   ```

2. **에러 처리**
   ```cpp
   if (!WeaponClass)
   {
       UE_LOG(LogTemp, Warning, TEXT("WeaponClass is not set"));
       return;
   }
   ```

3. **소켓 이름 확인**
   ```cpp
   // 소켓 존재 여부 확인
   if (!GetMesh()->DoesSocketExist(FName("weapon_socket")))
   {
       UE_LOG(LogTemp, Warning, TEXT("Socket 'weapon_socket' does not exist"));
       return;
   }
   ```

## 최적화 팁

1. 자주 스폰되는 무기는 오브젝트 풀링 사용
2. 레플리케이션 고려 (멀티플레이어)
3. 무기 전환 시 스폰 대신 가시성 토글
4. 메모리 누수 방지를 위한 적절한 정리

## 블루프린트 연동 예제

```cpp
UFUNCTION(BlueprintCallable, Category = "Weapon")
void SwitchWeapon(TSubclassOf<AActor> NewWeaponClass)
{
    WeaponClass = NewWeaponClass;
    SpawnAndAttachWeapon();
}``` 
