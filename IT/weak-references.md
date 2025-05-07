---
layout: page
title: C++ 약한 참조와 언리얼 엔진에서의 활용
description: >
  C++의 약한 참조 개념과 언리얼 엔진에서 약한 참조를 효과적으로 사용하는 방법
hide_description: false
lang: ko
---

## 약한 참조란?

약한 참조(Weak Reference)는 객체의 수명에 영향을 주지 않고 해당 객체를 참조하는 방법입니다. 강한 참조(Strong Reference)와 달리, 약한 참조는 참조 카운트를 증가시키지 않아 객체의 소멸 시기를 결정하는 데 영향을 주지 않습니다.

### C++에서의 약한 참조

C++11부터 표준 라이브러리는 약한 참조를 위한 `std::weak_ptr`을 제공합니다. 이는 `std::shared_ptr`과 함께 사용되며, 다음과 같은 특징을 가집니다:

1. **참조 카운트 증가 없음**: `std::weak_ptr`은 참조 카운트를 증가시키지 않습니다.
2. **만료 확인**: 약한 참조가 가리키는 객체가 아직 유효한지 확인할 수 있습니다.
3. **강한 참조로 변환**: 필요할 때 `lock()` 메서드를 사용하여 일시적으로 강한 참조(`std::shared_ptr`)로 변환할 수 있습니다.

#### 기본 사용법

```cpp
#include <memory>
#include <iostream>

int main() {
    // 공유 포인터 생성
    std::shared_ptr<int> sharedPtr = std::make_shared<int>(42);
    
    // 약한 포인터 생성
    std::weak_ptr<int> weakPtr = sharedPtr;
    
    // 약한 포인터를 사용해 객체에 접근
    if (auto tempShared = weakPtr.lock()) {
        std::cout << "Value: " << *tempShared << std::endl;
    } else {
        std::cout << "Object no longer exists" << std::endl;
    }
    
    // 공유 포인터 리셋 (객체 삭제)
    sharedPtr.reset();
    
    // 이제 약한 포인터는 만료됨
    if (auto tempShared = weakPtr.lock()) {
        std::cout << "Value: " << *tempShared << std::endl;
    } else {
        std::cout << "Object no longer exists" << std::endl;
    }
    
    return 0;
}
```

### 약한 참조가 필요한 이유

1. **순환 참조 방지**: 강한 참조만 사용하면 객체들이 서로를 참조하는 순환 참조가 발생할 수 있으며, 이로 인해 메모리 누수가 발생할 수 있습니다.

   ### 순환 참조 (Circular Reference)
   
   순환 참조는 두 개 이상의 객체가 서로를 참조하는 상황입니다. 참조 카운팅 방식에서 이런 순환 구조가 있으면 각 객체의 참조 카운트가 항상 1 이상이므로 메모리에서 해제되지 않는 문제가 발생합니다.
   
   ```cpp
   // 순환 참조 예시
   auto objA = std::make_shared<ClassA>();
   auto objB = std::make_shared<ClassB>();
   
   objA->refToB = objB;  // A가 B를 강하게 참조
   objB->refToA = objA;  // B가 A를 강하게 참조
   
   // 두 객체 모두 참조 카운트가 1 이상이므로
   // 접근할 수 없게 되어도 메모리에서 해제되지 않음
   ```
   
   약한 참조를 사용하면 이 문제를 해결할 수 있습니다:
   
   ```cpp
   objA->refToB = objB;      // A가 B를 강하게 참조
   objB->weakRefToA = objA;  // B가 A를 약하게 참조
   
   // objA가 접근 불가능해지면 메모리에서 해제됨
   // objB의 약한 참조는 참조 카운트를 증가시키지 않기 때문
   ```

2. **캐시 구현**: 객체를 캐시하되 수명을 제어하지 않을 때 유용합니다.
3. **옵저버 패턴**: 옵저버가 대상 객체의 수명을 연장하지 않도록 약한 참조를 사용할 수 있습니다.

## 언리얼 엔진에서의 약한 참조

언리얼 엔진은 자체적인 가비지 컬렉션과 메모리 관리 시스템을 갖추고 있으며, 약한 참조를 위한 여러 클래스를 제공합니다.

### 주요 약한 참조 타입

1. **TWeakObjectPtr<T>**: UObject 기반 클래스에 대한 약한 참조를 제공합니다.
2. **TWeakPtr<T>**: 공유 포인터(TSharedPtr)와 함께 사용되는 약한 참조입니다.
3. **FWeakObjectPtr**: 내부적으로 사용되는 기본 약한 참조 클래스입니다.

### TWeakObjectPtr 사용법

```cpp
// 액터 참조 저장
AActor* MyActor = ...; // 어딘가에서 액터를 얻음
TWeakObjectPtr<AActor> WeakActorRef = MyActor;

// 나중에 사용할 때
if (WeakActorRef.IsValid()) {
    // 약한 참조가 유효하므로 안전하게 사용 가능
    WeakActorRef->DoSomething();
} else {
    // 참조된 액터가 파괴됨
    UE_LOG(LogTemp, Warning, TEXT("Actor no longer exists"));
}

// 강한 참조로 변환
AActor* StrongRef = WeakActorRef.Get();
if (StrongRef) {
    // 변환 성공
    StrongRef->DoSomething();
}
```

### TWeakPtr 사용법

```cpp
// 공유 포인터 생성
TSharedPtr<FMyClass> SharedRef = MakeShared<FMyClass>();

// 약한 참조 생성
TWeakPtr<FMyClass> WeakRef = SharedRef;

// 약한 참조 사용
if (TSharedPtr<FMyClass> PinnedRef = WeakRef.Pin()) {
    // 약한 참조가 유효함
    PinnedRef->DoSomething();
} else {
    // 원본 객체가 파괴됨
}
```

### 언리얼 엔진에서 약한 참조 사용 시나리오

1. **델리게이트에서 객체 참조**: 델리게이트에서 객체를 참조할 때, 그 객체가 파괴되어도 안전하게 처리하기 위해 약한 참조를 사용합니다.

```cpp
// 약한 참조를 사용한 델리게이트 바인딩
TWeakObjectPtr<UMyClass> WeakThis(this);
MyDelegate.BindLambda([WeakThis]() {
    if (WeakThis.IsValid()) {
        WeakThis->DoSomething();
    }
});
```

2. **컴포넌트 간 참조**: 한 컴포넌트가 다른 컴포넌트를 참조할 때, 순환 참조를 방지하기 위해 약한 참조를 사용합니다.

```cpp
UPROPERTY()
TWeakObjectPtr<UStaticMeshComponent> MeshComponentRef;
```

3. **다른 액터 참조**: 한 액터가 다른 액터를 참조하되 그 액터의 수명을 통제하지 않을 때 사용합니다.

```cpp
UPROPERTY()
TWeakObjectPtr<AActor> TargetActorRef;
```

### 약한 참조 vs UPROPERTY()

언리얼 엔진에서는 `UPROPERTY()` 매크로로 표시된 포인터도 가비지 컬렉터에 의해 자동으로 null로 설정됩니다. 그러나 차이점이 있습니다:

1. **유효성 검사**: `TWeakObjectPtr`은 `IsValid()`로 쉽게 유효성을 검사할 수 있습니다.
2. **직렬화**: `UPROPERTY()`는 자동으로 직렬화되고 에디터에 노출될 수 있습니다.
3. **성능**: 일반 포인터가 약간 더 빠르지만, 약한 참조는 안전성을 제공합니다.

## 주의사항

1. **성능 고려사항**: 약한 참조는 유효성 검사 오버헤드가 있으므로, 극도로 성능이 중요한 코드에서는 주의해야 합니다.
2. **스레드 안전성**: 멀티스레드 환경에서 약한 참조를 사용할 때는 추가적인 동기화가 필요할 수 있습니다.
3. **가비지 컬렉션 주기**: 언리얼 엔진의 가비지 컬렉션은 주기적으로 실행되므로, 객체가 파괴되더라도 약한 참조가 즉시 무효화되지 않을 수 있습니다.

## 결론

약한 참조는 C++와 언리얼 엔진에서 메모리 관리와 객체 수명 문제를 해결하는 강력한 도구입니다. 순환 참조를 방지하고, 객체의 유효성을 안전하게 확인하며, 객체 간의 관계를 유연하게 관리할 수 있게 해줍니다. 언리얼 엔진에서 개발할 때 약한 참조를 적절히 활용하면 더 안정적이고 메모리 효율적인 코드를 작성할 수 있습니다. 