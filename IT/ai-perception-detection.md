---
layout: page
title: 언리얼 엔진 AI 인식 시스템 설정
description: >
  AI Controller의 Perception 컴포넌트 감지 설정 가이드
---

# AI 인식 시스템의 감지 설정

## AI 시야 감지 설정

```cpp
// 시야 센서 기본 설정
SightConfig->DetectionByAffiliation.bDetectEnemies = true;    // 적대적 대상 감지
SightConfig->DetectionByAffiliation.bDetectFriendlies = true; // 우호적 대상 감지
SightConfig->DetectionByAffiliation.bDetectNeutrals = true;   // 중립 대상 감지
```

## 전체 감지 활성화의 이유

1. **유연한 상호작용**
   - 모든 유형의 액터를 감지하여 상황에 따라 다른 행동 가능
   - 추후 팀 기반 시스템 구현 시 용이

2. **동적 관계 설정**
   - 게임 진행 중 적대/우호 관계가 변경될 수 있음
   - 모든 감지를 켜두고 로직에서 처리하는 것이 유리

3. **디버깅 용이성**
   - 개발 단계에서 모든 감지를 활성화하여 테스트
   - 필요한 경우 코드에서 선택적으로 처리

## 구현 시 고려사항

- 실제 게임플레이에서는 필요한 감지만 선택적으로 사용
- 성능 최적화가 필요한 경우 불필요한 감지는 비활성화
- 감지된 액터의 처리는 별도의 로직에서 구현 