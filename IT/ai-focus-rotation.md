---
layout: page
title: AI SetFocus 문제 해결
description: >
  AI Controller의 SetFocus 기능이 작동하지 않을 때의 해결 방법
---

# AI SetFocus 문제 해결 가이드

## 문제 상황
AI Controller의 SetFocus 함수를 호출했지만 AI가 타겟을 바라보지 않는 현상

## 해결 방법

```cpp
// Character 클래스의 생성자나 BeginPlay에서
void AEnemyCharacter::BeginPlay()
{
    Super::BeginPlay();
    
    // AI의 회전을 컨트롤러를 따르도록 설정
    bUseControllerRotationYaw = true;
}
```

## 작동 원리
1. `bUseControllerRotationYaw = true`로 설정하면 캐릭터가 컨트롤러의 회전값을 따르게 됨
2. SetFocus 함수는 컨트롤러의 회전을 변경
3. 결과적으로 캐릭터가 타겟을 향해 회전

## 주의사항
- 네비게이션 이동 시에는 회전 설정을 조절해야 할 수 있음
- 캐릭터 무브먼트 컴포넌트의 회전 설정과 충돌할 수 있음 