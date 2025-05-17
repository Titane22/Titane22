---
layout: page
title: const vs constexpr
description: >
  C++에서 const와 constexpr의 차이점 및 활용법에 대한 상세 설명
hide_description: false
---

# const vs constexpr

## 핵심 개념

### const
- **정의**: 변수나 객체가 수정될 수 없음을 나타내는 키워드
- **특징**: 컴파일 타임 또는 런타임에 값이 결정될 수 있음
- **용도**: 값이 변경되지 않아야 하는 변수 선언에 사용

### constexpr 
- **정의**: 표현식이 컴파일 타임에 평가될 수 있음을 나타내는 키워드
- **특징**: 항상 컴파일 타임에 값이 결정되어야 함
- **용도**: 컴파일 타임 계산, 템플릿 메타프로그래밍, 최적화

## 상세 비교

| 특성 | const | constexpr |
|------|-------|-----------|
| 값 결정 시점 | 컴파일 타임 또는 런타임 | 반드시 컴파일 타임 |
| 변수 수정 | 불가능 | 불가능 |
| 함수 적용 | 멤버 함수에 적용 가능 | 함수 자체를 컴파일 타임에 실행 가능하게 함 |
| 포인터 | 상수 포인터 또는 포인터가 가리키는 값이 상수 | 컴파일 타임에 알려진 주소만 가능 |

## 예시 코드

### const 예시

```cpp
// 컴파일 타임 상수
const int MAX_SIZE = 100;

// 런타임에 결정되는 상수
int getInput() { return 42; }  // 예제용 함수
const int runtime_value = getInput();

// const 포인터
const int* ptr1 = &MAX_SIZE;  // 포인터가 가리키는 값이 상수
int const* ptr2 = &MAX_SIZE;  // 위와 동일
int* const ptr3 = new int(5); // 포인터 자체가 상수
const int* const ptr4 = &MAX_SIZE; // 둘 다 상수
```

### constexpr 예시

```cpp
// 컴파일 타임 상수
constexpr int MAX_SIZE = 100;
constexpr int DOUBLE_SIZE = MAX_SIZE * 2;

// 컴파일 타임 함수
constexpr int square(int x) {
    return x * x;
}

// 컴파일 타임에 계산됨
constexpr int squared_size = square(MAX_SIZE);

// 배열 크기로 사용 가능
int array[squared_size];

// C++14 이상에서는 더 복잡한 함수도 가능
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}

constexpr int fact5 = factorial(5); // 컴파일 타임에 120으로 계산
```

## constexpr 함수의 제약 조건

constexpr 함수는 다음과 같은 제약 조건을 가집니다:

1. C++11에서는 단일 return 문만 허용 (C++14부터 완화됨)
2. 모든 매개변수와 반환 타입이 리터럴 타입이어야 함
3. 부작용(side effect)이 없어야 함
4. 컴파일 시점에 알 수 없는 값에 의존하면 안 됨
5. 동적 메모리 할당을 사용할 수 없음 (C++20 전까지)

## 실용적인 사례

### 사례 1: 피보나치 수열 컴파일 타임 계산
피보나치 수열을 컴파일 타임에 계산하여 성능을 최적화할 수 있습니다.

```cpp
// 컴파일 타임 피보나치 계산
constexpr int fibonacci(int n) {
    return (n <= 1) ? n : fibonacci(n-1) + fibonacci(n-2);
}

// 사용 예: 컴파일 타임에 계산된 상수 값
constexpr int fib10 = fibonacci(10); // 컴파일 타임에 55로 계산됨
constexpr int fib_values[] = {fibonacci(0), fibonacci(1), fibonacci(5), fibonacci(10)};
```

### 사례 2: 컴파일 타임 소수 판별
소수 판별 알고리즘을 컴파일 타임에 실행하여 최적화된 코드를 생성합니다.

```cpp
// 컴파일 타임 소수 판별
constexpr bool is_prime(int n, int i = 2) {
    return (n <= 1) ? false : (i * i > n) ? true : 
           (n % i == 0) ? false : is_prime(n, i + 1);
}

// 사용 예: 컴파일 타임 검증
static_assert(is_prime(17), "17 is prime");
static_assert(!is_prime(10), "10 is not prime");

// 상수 표현식으로 사용
constexpr bool is_prime_42 = is_prime(42); // false
```

### 사례 3: 컴파일 타임 데이터 구조 처리
정렬과 같은 알고리즘을 컴파일 타임에 수행하여 초기화된 데이터를 생성합니다.

```cpp
// C++17 이상 필요
#include <array>

template <typename T, std::size_t N>
constexpr std::array<T, N> bubble_sort(std::array<T, N> arr) {
    for (std::size_t i = 0; i < N - 1; ++i) {
        for (std::size_t j = 0; j < N - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                T temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// 사용 예: 컴파일 타임에 정렬된 배열 생성
constexpr std::array<int, 5> arr = {5, 3, 1, 4, 2};
constexpr auto sorted_arr = bubble_sort(arr); // 컴파일 타임에 {1, 2, 3, 4, 5}로 정렬
```

## 주의사항

1. constexpr 변수는 자동으로 const이지만, const 변수는 constexpr이 아닐 수 있습니다.
2. constexpr 함수는 컴파일 타임과 런타임 모두에서 사용 가능합니다.
3. constexpr 함수에 컴파일 타임에 알 수 없는 값을 전달하면, 일반 함수처럼 런타임에 실행됩니다.
4. 최신 C++ 표준(C++17, C++20)에서는 constexpr의 제약 조건이 크게 완화되었습니다.

## 결론

- `const`는 값이 변경되지 않아야 할 때 사용합니다.
- `constexpr`은 컴파일 타임 계산과 최적화가 필요할 때 사용합니다.
- 가능하다면 `constexpr`을 사용하여 컴파일 타임에 값을 결정하는 것이 성능에 유리합니다.
- 모던 C++에서는 constexpr의 활용 범위가 계속 확대되고 있습니다. 