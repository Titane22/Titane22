---
layout: page
title: 향상된 입력 시스템
description: >
  언리얼 엔진 5의 Enhanced Input System 이해와 활용
hide_description: false
---

## 개요
* Enhanced Input System이란?
  * 언리얼 5의 새로운 입력 처리 시스템
  * 기존 Input System과의 차이점
  * 크로스 플랫폼 지원
* 주요 특징
  * 모듈식 설계
  * 컨텍스트 기반 입력 처리
  * 실시간 입력 매핑 변경

## 핵심 구성요소
* Input Action
  * 단일 입력 동작 정의
  * 트리거 타입 설정
  * 값 처리 방식
* Input Mapping Context
  * 입력 매핑 그룹화
  * 우선순위 설정
  * 컨텍스트 전환
* Input Modifiers
  * 입력값 변형
  * 데드존 설정
  * 스케일링

## 설정 방법
* 프로젝트 설정
  * 플러그인 활성화
  * 기본 설정
  * 입력 디바이스 설정
* Input Action 생성
  * 액션 타입 선택
  * 트리거 설정
  * 값 처리 설정
* Mapping Context 설정
  * 키 바인딩
  * 모디파이어 적용
  * 우선순위 관리

## 입력 처리 방식
* Triggered 이벤트
  * Triggered
  * Started
  * Ongoing
  * Completed
  * Canceled
* 값 타입
  * Boolean
  * Axis1D
  * Axis2D
  * Axis3D

## C++ 구현 
```cpp
// 헤더 파일에서
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category=Input)
class UInputMappingContext DefaultMappingContext;
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category=Input)
class UInputAction MoveAction;
// CPP 파일에서
void APlayerCharacter::SetupPlayerInputComponent(UInputComponent PlayerInputComponent)
{
    if (UEnhancedInputComponent EnhancedInputComponent = CastChecked<UEnhancedInputComponent>(PlayerInputComponent))
    {
        EnhancedInputComponent->BindAction(MoveAction, ETriggerEvent::Triggered, this, &APlayerCharacter::Move);
    }
}
void APlayerCharacter::Move(const FInputActionValue& Value)
{
    const FVector2D MovementVector = Value.Get<FVector2D>();
    AddMovementInput(FVector(MovementVector.X, MovementVector.Y, 0.0f));
}
```

## 블루프린트 구현
* 입력 액션 바인딩
  * Enhanced Input 컴포넌트 추가
  * 액션 이벤트 바인딩
  * 입력 처리 함수 구현
* 컨텍스트 관리
  * 컨텍스트 추가/제거
  * 우선순위 조정
  * 런타임 매핑 변경

## 고급 기능
* 모디파이어 체인
  * 복합 모디파이어
  * 커스텀 모디파이어
  * 체인 순서 관리
* 트리거 설정
  * Hold 시간
  * Tap 횟수
  * 조합 입력
* 디바이스별 설정
  * 키보드/마우스
  * 게임패드
  * 터치스크린

## 디버깅과 최적화
* 디버깅 도구
  * 입력 시각화
  * 이벤트 로깅
  * 실시간 모니터링
* 성능 고려사항
  * 이벤트 처리 최적화
  * 메모리 관리
  * 입력 지연 최소화

## 실전 활용 예제
* 기본 구현
  * 캐릭터 이동
  * 카메라 제어
  * 상호작용
* 고급 구현
  * 콤보 시스템
  * 제스처 인식
  * 크로스 플랫폼 입력

## 마이그레이션 가이드
* 기존 시스템에서 전환
  * 단계별 마이그레이션
  * 주의사항
  * 호환성 유지
* 베스트 프랙티스
  * 구조 설계
  * 코드 구성
  * 유지보수 전략