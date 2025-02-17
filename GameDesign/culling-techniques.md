---
layout: page
title: 프러스텀 & 오클루전 컬링
description: >
  3D 렌더링 최적화를 위한 컬링 기법 설명
hide_description: false
---

## 프러스텀 컬링 (Frustum Culling)

<figure style="text-align: center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/frustum-culling.gif" alt="프러스텀 컬링 다이어그램">
  <figcaption>카메라 프러스텀과 시야각 기반 컬링</figcaption>
</figure>

### 개요ㄴ
- 카메라의 시야(View Frustum) 밖에 있는 객체들을 렌더링하지 않는 기법
- 6개의 클리핑 평면(상, 하, 좌, 우, 근, 원)으로 구성된 프러스텀 내부의 객체만 렌더링

### 구현 방법
1. 프러스텀 평면 계산
   - 카메라의 위치, 방향, FOV(시야각), 종횡비를 기반으로 6개 평면 생성
   - 각 평면은 법선 벡터와 거리값으로 정의

2. 바운딩 볼륨 테스트
   - 각 객체의 바운딩 박스/구를 프러스텀 평면과 테스트
   - 완전히 밖에 있는 객체는 렌더링 제외
   - 부분적으로 걸치는 객체는 렌더링 포함

3. 최적화 기법
   - 계층적 프러스텀 컬링 (Hierarchical Frustum Culling)
   - 공간 분할 구조 활용 (Octree, BSP 등)

## 오클루전 컬링 (Occlusion Culling)

<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/occlusion-culling.gif" alt="오클루전 컬링 예시"><br>
  <em>다른 객체에 의해 가려진 물체의 렌더링 제외</em>
</p>

### 개요
- 다른 객체에 의해 가려진(Occluded) 객체들을 렌더링하지 않는 기법
- 시점에서 보이지 않는 객체를 식별하여 렌더링 파이프라인에서 제외

### 구현 방법
1. 하드웨어 오클루전 쿼리
   - GPU의 오클루전 쿼리 기능 활용
   - 객체의 바운딩 볼륨으로 가시성 테스트
   - 픽셀 샘플링을 통한 가시성 판단

2. 소프트웨어 오클루전 컬링
   - CPU에서 수행되는 가시성 결정
   - Portal-Cell 시스템
   - Potentially Visible Set (PVS) 계산

3. 최적화 기법
   - 계층적 Z-버퍼 (Hierarchical Z-Buffer)
   - 시간적 일관성 활용 (Temporal Coherence)

## 컬링 기법의 조합

### 단계별 적용
1. 프러스텀 컬링으로 시야 밖 객체 제거
2. 오클루전 컬링으로 가려진 객체 제거
3. 상세도 수준(LOD) 시스템과 연동

### 성능 고려사항
- 컬링 연산 비용과 이점의 균형
- 동적 객체에 대한 효율적인 처리
- 메모리 사용량과 처리 시간 트레이드오프

## 실제 적용 사례

### 언리얼 엔진
- Hierarchical Visibility System
- Precomputed Visibility
- Distance Field Ambient Occlusion

### 유니티 엔진
- Occlusion Culling Window
- 정적/동적 배칭과의 통합
- 자동화된 오클루더 생성

## 최적화 팁
1. 적절한 바운딩 볼륨 선택
2. 컬링 그룹화 전략 수립
3. LOD 시스템과의 연동
4. 동적 객체에 대한 효율적인 처리
5. 프리컴퓨팅 활용

## 결론
프러스텀 컬링과 오클루전 컬링은 3D 렌더링 최적화의 핵심 기술입니다. 두 기법을 적절히 조합하여 사용하면 렌더링 성능을 크게 향상시킬 수 있습니다. 특히 대규모 3D 환경에서는 필수적인 최적화 기법이며, 현대 게임 엔진들은 이러한 기술들을 기본적으로 제공하고 있습니니다. 