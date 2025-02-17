---
layout: page
title: 블루프린트 타임라인 컴포넌트 접근
description: >
  블루프린트에서 생성된 타임라인 컴포넌트에 C++에서 접근하는 방법을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [unreal, cpp, blueprint]
---

## 개요

블루프린트에서 Timeline 노드를 사용할 때, 자동으로 생성되는 UTimelineComponent에 C++에서 접근하는 방법을 설명합니다.

## 타임라인 컴포넌트 작동 방식

1. **자동 생성**
   - 블루프린트에서 Timeline 노드 사용 시 UTimelineComponent 자동 생성
   - 컴포넌트가 액터에 자동으로 추가됨
   - 컴포넌트 이름은 Timeline 변수 이름으로 지정됨

## C++에서 접근하기

```cpp
// 타임라인 컴포넌트 찾기
UTimelineComponent* TimelineComponent = FindComponentByClass<UTimelineComponent>();

if (TimelineComponent)
{
    // 타임라인 컴포넌트 조작
    TimelineComponent->Play();
    // 또는
    TimelineComponent->Stop();
    // 또는
    TimelineComponent->Reverse();
}
```

## 주의사항

1. **컴포넌트 존재 확인**
   - FindComponentByClass 결과가 nullptr일 수 있음
   - 사용 전 항상 유효성 검사 필요

2. **다중 타임라인**
   - 여러 타임라인이 있는 경우 이름으로 구분 필요
   - GetAllComponents를 사용하여 모든 타임라인 컴포넌트 열거 가능

3. **초기화 시점**
   - BeginPlay 이후에 접근하는 것이 안전
   - 생성자에서는 컴포넌트가 아직 존재하지 않을 수 있음 