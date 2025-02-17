---
layout: page
title: LOD(Level of Detail) 시스템
description: >
  Level of Detail 시스템의 원리와 최적화 기법
hide_description: false
---

## LOD 시스템 개요

<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/lod-system.jpg" alt="LOD 시스템 예시"><br>
  <em>거리에 따른 모델 디테일 레벨 변화</em>
</p>

### 기본 원리
- 카메라와의 거리에 따라 3D 모델의 디테일 수준을 자동으로 조절
- 멀리 있는 객체는 낮은 폴리곤 수의 모델을 사용
- 가까이 있는 객체는 높은 폴리곤 수의 모델을 사용

## LOD 레벨 구성

### LOD 0 (최대 디테일)
- 카메라와 가장 가까운 거리에서 사용
- 16,128 Tris의 고해상도 메시
- 모든 디테일과 텍스처 표현
- 완벽한 구형 표현

### LOD 1 (높은 디테일)
- 중간 근거리에서 사용
- 3,968 Tris로 약 75% 감소
- 육안으로 구분하기 어려운 수준의 품질 유지
- 부드러운 구형 표현 유지

### LOD 2 (중간 디테일)
- 중간 거리에서 사용
- 960 Tris로 원본 대비 94% 감소
- 기본적인 형태와 실루엣 유지
- 격자 구조가 육안으로 보이기 시작

### LOD 3 (낮은 디테일)
- 먼 거리에서 사용
- 224 Tris로 원본 대비 98.6% 감소
- 대략적인 구형 실루엣 표현
- 명확한 다각형 구조 보임

### LOD 4 (최저 디테일)
- 가장 먼 거리에서 사용
- 48 Tris로 원본 대비 99.7% 감소
- 기본적인 형태만 유지
- 다각형 형태의 저해상도 메시

## LOD 전환 기술

<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/lod-transition.gif" alt="LOD 전환 효과"><br>
  <em>부드러운 LOD 레벨 전환</em>
</p>

### 디스턴스 기반 전환
- 카메라와의 거리에 따른 단순 전환
- 계산이 간단하고 직관적
- 갑작스러운 전환으로 인한 팝핑 현상 발생 가능

### 알파 페이딩
- LOD 레벨 간 부드러운 블렌딩
- 전환 시 시각적 아티팩트 감소
- 메모리와 렌더링 오버헤드 증가

### 지오메트리 모핑
- 점진적인 버텍스 변형
- 가장 부드러운 전환 효과
- 구현이 복잡하고 연산 비용이 높음

### 팝핑 현상 (Popping Effect)
<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/lod-popping.gif" alt="LOD 팝핑 현상"><br>
  <em>This is an exaggerated example of a 3D object's geometrically being reduced using a level of detail technique. LOD0 is the highest detail version of the object and each subsequent LOD reduces the quality of the object. A change without intermediate steps from LOD1 to LOD2 will be obvious to the viewer.</em>
</p>

팝핑 현상이란:
- LOD 레벨이 전환되는 순간 갑자기 모델의 디테일이 변경되면서 발생하는 시각적 깜빡임
- 특히 급격한 디테일 차이가 있는 LOD 레벨 사이에서 자주 발생
- 플레이어의 몰입감을 저해하는 주요 요인

발생 원인:
- 즉각적인 LOD 레벨 전환
- LOD 레벨 간 과도한 디테일 차이
- 부적절한 전환 거리 설정

해결 방법:
1. 점진적 페이딩 (Gradual Fading)
   - 두 LOD 레벨을 서서히 블렌딩
   - 알파 값을 이용한 부드러운 전환

2. 지오메트리 모핑 (Geometry Morphing)
   - 버텍스 위치를 점진적으로 변형
   - 가장 자연스러운 전환 효과

3. 디테일 간격 최적화
   - LOD 레벨 간 적절한 디테일 차이 유지
   - 전환 거리의 세밀한 조정

## 최적화 전략

### 메시 최적화
1. 중요 피처 보존
   - 실루엣에 영향을 주는 버텍스 유지
   - 텍스처 디테일로 대체 가능한 지오메트리 단순화

2. 텍스처 최적화
   - LOD 레벨별 적절한 텍스처 해상도 사용
   - 노멀맵과 디테일맵의 효율적 활용

### 성능 고려사항
1. 메모리 관리
   - LOD 레벨별 메모리 사용량 최적화
   - 동적 로딩 시스템 활용

2. CPU/GPU 부하
   - LOD 전환 연산 최적화
   - 배칭을 통한 드로우콜 감소

## 실제 적용 사례

### 오픈 월드 게임
- 지형과 식생의 LOD 관리
- 동적 스트리밍과 연동
- 시야 거리에 따른 자동 조절

### 도시 환경
- 건물과 프롭의 LOD 시스템
- 인스턴싱과 결합
- 그림자와 라이팅 최적화

## 구현 팁
1. LOD 레벨 설정
   - 적절한 전환 거리 설정
   - 객체의 중요도에 따른 레벨 수 조정
   - 시각적 품질과 성능의 균형

2. 전환 품질
   - 부드러운 전환을 위한 페이딩 구현
   - 팝핑 현상 최소화
   - 시야각과 움직임 고려

3. 최적화
   - 컬링 시스템과의 통합
   - 메모리 사용량 관리
   - 배칭 시스템 활용

## 결론
LOD 시스템은 3D 그래픽스 최적화의 핵심 요소입니다. 적절한 LOD 설정과 전환 기술을 통해 시각적 품질을 유지하면서도 성능을 크게 향상시킬 수 있습니다. 특히 대규모 3D 환경에서는 필수적인 최적화 기법이며, 현대 게임 엔진들은 이러한 기능을 기본적으로 제공하고 있습니다.

## 참고 자료
- [UE4 Optimization & Performance Pt.2 - LODs](https://www.artstation.com/blogs/samslover/QwNE/ue4-optimization-performance-pt2-lods) 