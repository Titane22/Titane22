---
layout: page
title: 히트박스와 허트박스의 이해
description: >
  게임 개발에서 사용되는 히트박스(Hitbox)와 허트박스(Hurtbox)의 차이점과 구현 방법을 설명합니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [collision, game-design]
---

## 개요
- **히트박스(Hitbox)**: 공격이 적중하는 영역
- **허트박스(Hurtbox)**: 피해를 받을 수 있는 영역


## 히트박스 (Hitbox)
- 공격 판정이 있는 영역
- 주로 무기나 공격 동작에 적용
- 일시적으로 활성화되는 경우가 많음
- 공격력, 지속시간 등의 속성을 가짐

![Hitboxes Deal Damage](/assets/img/blog/gamedev/HitBox.jpg)
*히트박스는 데미지를 주는 영역을 정의합니다.*

## 허트박스 (Hurtbox)
- 캐릭터가 피해를 받을 수 있는 영역
- 캐릭터의 실제 물리적 형태를 반영
- 지속적으로 존재하는 경우가 많음
- 무적 상태 등의 속성을 가질 수 있음

![Hurtboxes Take Damage](/assets/img/blog/gamedev/HurtBox.jpg)
*허트박스는 데미지를 받는 영역을 정의합니다.*

## 주요 특징

1. **시각화**
   - 디버그 모드에서 다른 색상으로 표시
   - 히트박스: 빨간색
   - 허트박스: 초록색

2. **최적화**
   - 간단한 형태 사용 (박스, 구체)
   - 필요한 경우에만 활성화

3. **게임 밸런스**
   - 히트박스/허트박스 크기로 난이도 조절
   - 액션 게임에서 특히 중요 

[히트박스와 허트박스 시스템 구현 가이드](https://youtu.be/Nv5KrS3cN9c)