---
layout: page
title: C++23 - The Next C++ Standard
description: >
  An overview of the upcoming C++23 standard and its major features.
hide_description: false
---
## C++ 표준의 역사

### C++98
- 80년대 말에 Bjarne Stroustrup과 Margaret A. Ellis가 유명한 "Annotated C++ Reference Manual (ARM)" 책을 저술
- 이 책의 목적은 두 가지:
  - 너무 많은 C++ 독립 구현체들이 있었기 때문에 ARM은 C++의 기능을 정의
  - C++ 표준인 C++98 (ISO/IEC 14882)의 기초가 됨
- C++98은 몇몇 중요한 기능들을 포함:
  - Templates
  - STL(Standard Template Library): 컨테이너, 알고리즘, 스트링, IO Stream들을 포함

### C++03
- C++03 (14882:2003)에서는 아주 작은 기술 수정이 이뤄짐
- 커뮤니티에서는 C++98을 포함한 C++03을 "레거시 C++"이라고 부름

### TR1
- 2005년에 재미난 일이 생김. TR1(Technical Report 1)이 발간
- TR1은 C++11을 위한 큰 발걸음이자 Modern C++로 향하는 첫걸음
- C++ 표준 위원회 멤버들의 Boost 프로젝트에 기반
- 차세대 C++ 표준에 들어갈 13개의 라이브러리를 포함:
  - 정규식
  - 난수
  - std::shared_ptr 같은 스마트 포인터
  - 해시테이블 등

### C++11
- 다음 C++ 표준이었지만, 우린 Modern C++이라고 부름 (이 이름엔 C++14와 C++17을 포함)
- C++11은 C++을 개발하는 방식을 완전히 바꿔버림:
  - TR1의 컴포넌트
  - move-semantic
  - perfect forwarding
  - variadic templates
  - constexpr
  - 스레딩 기반의 메모리 모델과 Threading API

### C++14
- 작은 C++ 표준
- 주요 기능:
  - read-writer locks
  - generalized lambdas
  - generalized constexpr 함수

### C++17
- 크지도 작지도 않은 표준
- 두 가지 뛰어난 기능:
  - Parallel STL
  - 표준화된 파일시스템
- 약 80개의 STL 알고리즘이 실행 정책을 통해 실행 가능:
  - 병렬
  - 순차
  - 벡터
- Boost에서 많은 영향을 받음:
  - 파일 시스템
  - 3개의 새로운 데이터 타입:
    - std::optional
    - std::variant
    - std::any

### C++20
C++20은 C++11과 마찬가지로 C++ 프로그래밍 방식을 바꿔버림. 특히 다음 네 가지 큰 기능이 있습니다:

1. **Ranges**
   - 컨테이너에서 직접 알고리즘을 표현
   - 파이프 기호로 알고리즘을 조합
   - 무한 데이터 스트림에 적용 가능
   - **지연 평가(Lazy Evaluation)**: 실제로 값이 필요할 때까지 연산을 미룸

   [C++20 Ranges 샘플 코드 보기](cpp20-samples#ranges)

   #### 지연 평가의 장점
   1. **메모리 효율성**
      - 중간 결과를 저장하지 않고 필요할 때만 계산
      - 예: `filter`와 `transform`을 체이닝할 때 중간 벡터를 생성하지 않음

   2. **무한 시퀀스 처리 가능**
      - 전체 시퀀스를 메모리에 저장하지 않고도 처리 가능
      - `take`를 사용하여 필요한 만큼만 계산

   3. **성능 최적화**
      - 불필요한 연산을 피할 수 있음
      - 예: `take(3)` 이후의 요소는 계산하지 않음

   4. **파이프라인 최적화**
      - 컴파일러가 전체 파이프라인을 최적화할 수 있음
      - 여러 연산을 하나의 루프로 결합 가능

2. **Coroutines**
   - C++에서 비동기 프로그래밍이 주류가 되게 함
   - 협동작업, 이벤트 루프, 무한 데이터 스트림 및 파이프라인의 기반

   [C++20 Coroutines 샘플 코드 보기](cpp20-samples#coroutines)

   #### 코루틴의 주요 특징
   1. **비동기 작업 처리**
      - `co_await`: 비동기 작업의 완료를 기다림
      - `co_yield`: 값을 반환하고 실행을 일시 중단
      - `co_return`: 코루틴 종료

   2. **상태 보존**
      - 코루틴은 실행 상태를 보존
      - 재개 시 이전 상태에서 계속 실행

   3. **메모리 효율성**
      - 스택 대신 힙에 상태 저장
      - 많은 수의 동시 작업 처리 가능

   4. **파이프라인 구성**
      - 여러 코루틴을 연결하여 복잡한 비동기 파이프라인 구성 가능
      - 데이터 스트림 처리에 적합

3. **Concepts**
   - 템플릿을 생각하고 프로그래밍하는 방식을 바꿈
   - 템플릿 인자에 대한 제약과 타입 검사
   - 컴파일 시점에 확인 가능

   [C++20 Concepts 샘플 코드 보기](cpp20-samples#concepts)

   #### Concepts의 주요 특징
   1. **타입 제약**
      - 템플릿 매개변수에 대한 명확한 요구사항 정의
      - 컴파일 시점에 타입 검사 가능

   2. **코드 가독성**
      - 템플릿 코드의 의도를 명확하게 표현
      - 오류 메시지가 더 명확하고 이해하기 쉬움

   3. **재사용성**
      - 개념을 조합하여 새로운 제약 조건 생성 가능
      - 표준 라이브러리와의 통합 용이

4. **Modules**
   - 헤더 파일의 한계를 극복
   - 전처리기 불필요
   - 빌드 시간 단축
   - 패키지 빌드 용이성 향상

   [C++20 Modules 샘플 코드 보기](cpp20-samples#modules)

   #### Modules의 주요 특징
   1. **빌드 성능**
      - 헤더 파일 중복 포함 문제 해결
      - 컴파일 시간 단축
      - 의존성 관리 용이

   2. **캡슐화**
      - 모듈 내부 구현 세부사항 숨김
      - 명시적인 인터페이스 정의
      - 더 나은 코드 구조화

   3. **패키지 관리**
      - 모듈 단위의 코드 재사용
      - 의존성 명확화
      - 빌드 시스템 통합 용이

### C++23
- 2023년 7월 현재 C++23이 최종 투표를 앞두고 있음

#### 핵심 언어 기능
- **Deducing this**
  - 작지만 매우 영향력 있는 기능
  - Python과 유사하게, 멤버함수에 implicit하게 전달된 this 포인터를 explicit하게 만듦
  - CRTP(Curiously Recurring Template Pattern)나 Overload 패턴 구현이 간단해짐

  [C++23 Deducing this 샘플 코드 보기](cpp23-samples#deducing-this)

  #### "Deducing this"의 주요 혜택
  
  1. **코드 가독성 향상**
     - 함수의 동작과 의도를 더 명확하게 표현
     - 일관된 문법으로 멤버 함수와 일반 함수의 차이 감소
  
  2. **더 적은 템플릿 상용구**
     - CRTP 패턴 단순화
     - 다양한 참조 한정자(reference qualifiers)를 위한 중복 코드 감소
  
  3. **강력한 인터페이스 설계**
     - 다형성 없이도 공통 인터페이스 구현 가능
     - 런타임 다형성의 오버헤드 없이 정적 다형성 구현
  
  4. **완벽한 전달(Perfect forwarding) 지원**
     - 레퍼런스 카테고리(lvalue/rvalue) 보존
     - 효율적인 값 전달 메커니즘

#### 라이브러리 기능
- **표준 라이브러리 개선**
  - `import std;`로 표준 라이브러리 직접 임포트
  - `std::print` 및 `std::println`에서 C++20 포맷 스트링 적용 가능
  - `std::flat_map`: 성능 향상을 위한 `std::map` 대체제
  - `std::optional`: Monadic 인터페이스로 확장되어 Composability 향상
  - `std::expected`: 새로운 데이터 타입
  - `std::mdspan`: 다차원 span
  - `std::generator`: 숫자들의 스트림을 생성하기 위한 코루틴

## 출처
- [C++23: The Next C++ Standard](https://www.modernescpp.com/index.php/c23-the-next-c-standard/)