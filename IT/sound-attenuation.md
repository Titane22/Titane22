---
layout: page
title: 언리얼 엔진 사운드 감쇠 설정
description: >
  거리에 따른 사운드 볼륨 조절을 위한 Attenuation 설정 가이드
---

# 사운드 감쇠(Attenuation) 시스템

## 개요
사운드 감쇠는 음원으로부터의 거리에 따라 소리의 크기를 자연스럽게 조절하는 시스템입니다.

## 구현 방법

### 1. 블루프린트에서 설정
1. Wave Player 노드 생성
2. Random 노드로 다양성 추가 (선택사항)
3. Attenuation 노드 연결
4. Output으로 최종 출력

### 2. Attenuation 설정
- **Distance Algorithm**: 거리 계산 방식 선택
  - Linear: 선형적 감소
  - Logarithmic: 로그 스케일로 감소
  - Natural: 자연스러운 감소

- **주요 설정값**
  - Falloff Distance: 소리가 감소하기 시작하는 거리
  - Maximum Distance: 소리가 들리는 최대 거리
  - Volume Multiplier: 전체적인 볼륨 크기

## 활용 팁
1. 실내/실외 환경에 따른 적절한 거리 설정
2. 사운드의 중요도에 따른 Maximum Distance 조절
3. 여러 사운드 간의 밸런스 조정을 위한 Volume Multiplier 활용 