---
layout: page
title: 환경 쿼리 시스템 (EQS)
description: >
  언리얼 엔진의 Environment Query System 상세 가이드
hide_description: false
---


## EQS 개요
* Environment Query System
  * AI의 환경 인식과 의사결정을 위한 시스템
  * 공간상의 다양한 위치나 객체를 평가하고 점수화
  * 실시간 환경 분석 및 최적의 위치/대상 선정

## 구성요소 상세

### 1. Generator (생성기)
* **ActorsOfClass**
  * 특정 클래스의 모든 액터 검색
  * 옵션:
    * Search Radius: 검색 반경
    * Searched Actor Class: 검색할 액터 클래스
    * Search Center: 검색 중심점 (Self/Context)

* **SimpleGrid**
  * 격자 패턴으로 포인트 생성
  * 옵션:
    * Grid Size: 격자 크기
    * Space Between: 포인트 간격
    * ProjectionData: 투영 설정
      * Projection Height: 높이 투영
      * Navigation: 내비메시 투영

* **Donut**
  * 도넛 형태의 포인트 생성
  * 옵션:
    * Number of Rings: 링 개수
    * Points per Ring: 링당 포인트 수
    * Min/Max Radius: 최소/최대 반경
    * Arc Direction: 아크 방향
    * Arc Angle: 아크 각도

* **Pathfinding Grid**
  * 내비메시 기반 경로 포인트 생성
  * 옵션:
    * Navigation Filter: 내비게이션 필터
    * Path Distance: 경로 거리
    * Path Cost: 경로 비용

### 2. Tests (테스트)

* **Distance Test**
  * 거리 기반 평가
  * 옵션:
    * Test Mode: 
      * PathDistance (경로 거리)
      * 3D Distance (직선 거리)
    * Distance To: 거리 측정 대상
    * Scoring Factor: 점수 계산 방식
      * Linear: 선형 감소
      * Inverse Linear: 역선형
      * Square: 제곱
      * Inverse Square: 역제곱

* **Dot Product Test**
  * 방향 벡터 기반 평가
  * 옵션:
    * Line A/B: 비교할 두 방향
    * Test Mode: 
      * Absolute: 절대값
      * Relative: 상대값
    * Scoring Factor: 점수 계산 방식

* **Trace Test**
  * 레이캐스트 기반 평가
  * 옵션:
    * Trace Channel: 트레이스 채널
    * Trace From: 시작점
    * Trace To: 종료점
    * Test Purpose: 
      * Score Only if Hit
      * Score Only if Miss
      * Score Both

* **Gameplay Tag Test**
  * 게임플레이 태그 기반 평가
  * 옵션:
    * Tags to Match: 매칭할 태그
    * Tag Match Type: 
      * Any Tags Match
      * All Tags Match
      * None Tags Match

### 3. Context (컨텍스트)

* **Quest Context**
  * 쿼리 실행 시점의 상황 정보
  * 설정:
    * Querier: 쿼리 실행자
    * Target: 대상 액터/위치
    * SearchRadius: 검색 범위
    * ItemsToFind: 찾을 아이템 수

## 실전 구현 예제

### 1. 커버 포인트 찾기 
```cpp
// EQS_FindCover.h
UCLASS()
class UEnvQueryTest_CoverPosition : public UEnvQueryTest
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, Category = "Cover")
    float MinDistanceFromEnemy = 200.f;
    
    UPROPERTY(EditDefaultsOnly, Category = "Cover")
    float MaxDistanceFromEnemy = 800.f;
};

// 구현부
virtual void RunTest(FEnvQueryInstance& QueryInstance) const override
{
    UObject QueryOwner = QueryInstance.Owner.Get();
    for (FEnvQueryInstance::ItemIterator It(this, QueryInstance); It; ++It)
    {
        FVector ItemPos = GetItemLocation(QueryInstance, It.GetIndex());
        float DistanceToEnemy = // 적과의 거리 계산
        float Score = FMath::GetMappedRangeValueClamped(
            FVector2D(MinDistanceFromEnemy, MaxDistanceFromEnemy),
            FVector2D(1.0f, 0.0f),
            DistanceToEnemy
        );
        It.SetScore(TestPurpose, FilterType, Score, true);
    }
}
```
### 2. 전술적 위치 선정
```cpp
// EQS_TacticalPosition.h
UCLASS()
class UEnvQueryTest_TacticalPosition : public UEnvQueryTest
{
    GENERATED_BODY()
    public:
    UPROPERTY(EditDefaultsOnly, Category = "Tactical")
    float PreferredHeight = 100.f;
    UPROPERTY(EditDefaultsOnly, Category = "Tactical")
    float HeightImportance = 1.0f;
    UPROPERTY(EditDefaultsOnly, Category = "Tactical")
    float CoverImportance = 1.0f;
};
```
## 디버깅 도구

### 1. EQS 디버거
* 활성화 방법: `ShowDebug EQS`
* 시각화 옵션:
  * 테스트 결과
  * 점수 분포
  * 필터링된 항목

### 2. 성능 최적화
* 쿼리 실행 빈도 조절
* 테스트 순서 최적화
* 캐싱 전략 수립

## 베스트 프랙티스
1. 테스트 우선순위 설정
2. 컨텍스트 재사용
3. 적절한 갱신 주기 설정
4. 결과 캐싱 활용
5. 디버그 시각화 활용