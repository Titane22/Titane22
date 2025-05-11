---
layout: page
title: C++14 표준
description: >
  C++14 표준의 주요 기능과 개선사항에 대한 개요
hide_description: false
---

# C++14 표준

C++14는 2014년에 발표된 C++ 표준으로, C++11의 마이너 업데이트로 여겨집니다. "작은 C++ 표준"이라고 불리지만, 많은 유용한 개선사항을 도입했습니다.

## 주요 기능

### 1. 일반화된 람다 표현식(Generalized Lambda Expressions)

C++11에서 도입된 람다가 더욱 강화되었습니다. 이제 매개변수 타입으로 `auto`를 사용할 수 있어 제네릭 람다를 작성할 수 있게 되었습니다.

```cpp
// C++11에서는 명시적 타입이 필요했습니다
auto lambda11 = [](int x, int y) { return x + y; };

// C++14에서는 auto를 사용할 수 있습니다
auto lambda14 = [](auto x, auto y) { return x + y; };

// 다양한 타입에 사용 가능
int sum_int = lambda14(5, 3);            // 정수 연산: 8
double sum_double = lambda14(3.14, 2.71); // 실수 연산: 5.85
std::string s = lambda14(std::string("Hello, "), "world!"); // 문자열 연합: "Hello, world!"
```

이 기능은 템플릿처럼 동작하는 람다를 만들 수 있게 해주어 코드 재사용성을 높입니다.

### 2. 향상된 constexpr

C++11에서 도입된 `constexpr`의 제한이 완화되었습니다. 이제 `constexpr` 함수 내에서 다음을 사용할 수 있습니다:

- 변수 선언 및 수정
- if 및 switch 문
- 모든 종류의 루프(for, while, do-while)
- 비재귀적 람다 표현식

```cpp
// C++11에서의 constexpr 함수는 단일 return 문만 가능했습니다
constexpr int factorial_cpp11(int n) {
    return n <= 1 ? 1 : (n * factorial_cpp11(n - 1));
}

// C++14에서는 더 복잡한 함수도 가능합니다
constexpr int factorial_cpp14(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

// 컴파일 시간에 계산됩니다
constexpr int fact5 = factorial_cpp14(5); // 120
```

이 개선으로 컴파일 시간 계산이 훨씬 더 강력해졌습니다.

### 3. 변수 템플릿(Variable Templates)

C++14에서는 변수도 템플릿화할 수 있게 되었습니다.

```cpp
template<typename T>
constexpr T pi = T(3.1415926535897932385);

// 다양한 타입으로 사용 가능
float pi_float = pi<float>;       // 3.14159f
double pi_double = pi<double>;    // 3.14159265358979
long double pi_long = pi<long double>; // 더 높은 정밀도로 근사
```

이 기능은 수학적 상수나 변환 계수와 같은 타입에 의존적인 값을 정의할 때 유용합니다.

### 4. 표준 라이브러리 개선

#### 공유 뮤텍스와 Reader-Writer 락

여러 읽기 작업과 단일 쓰기 작업을 동시에 수행할 수 있는 새로운 동기화 프리미티브가 추가되었습니다.

```cpp
#include <shared_mutex>
#include <thread>

std::shared_mutex mtx;
int shared_data = 0;

// 읽기 작업(여러 스레드가 동시에 수행 가능)
void reader() {
    std::shared_lock<std::shared_mutex> lock(mtx); // 공유 락 획득
    // shared_data 읽기
}

// 쓰기 작업(한 번에 하나의 스레드만 수행 가능)
void writer() {
    std::unique_lock<std::shared_mutex> lock(mtx); // 독점 락 획득
    // shared_data 수정
}
```

이 기능은 읽기 작업이 쓰기 작업보다 훨씬 더 빈번한 데이터 구조에 유용합니다.

#### `std::make_unique`

C++11에서는 `std::make_shared`만 제공되었지만, C++14에서는 `std::make_unique`도 추가되었습니다.

```cpp
// C++11에서는 직접 new를 사용해야 했습니다
std::unique_ptr<int> p_old(new int(42));

// C++14에서는 make_unique를 사용할 수 있습니다
auto p_new = std::make_unique<int>(42);

// 배열도 지원합니다
auto p_array = std::make_unique<int[]>(10); // 크기가 10인 int 배열
```

이 함수는 메모리 누수 없이 예외 안전성을 개선합니다.

#### 내장 타입을 위한 정수 시퀀스 (integer_sequence)

컴파일 시간 정수 시퀀스를 생성할 수 있는 유틸리티가 추가되었습니다.

```cpp
#include <utility>
#include <tuple>
#include <iostream>

template<typename T, T... ints>
void print_sequence(std::integer_sequence<T, ints...>) {
    ((std::cout << ints << ' '), ...);
    std::cout << '\n';
}

// 튜플 요소에 인덱스를 통해 접근하는 예제
template<class Tuple, std::size_t... Is>
void print_tuple_impl(const Tuple& t, std::index_sequence<Is...>) {
    ((std::cout << std::get<Is>(t) << ' '), ...);
}

template<class Tuple>
void print_tuple(const Tuple& t) {
    print_tuple_impl(t, std::make_index_sequence<std::tuple_size<Tuple>::value>{});
}

int main() {
    // 0부터 4까지의 시퀀스 생성
    print_sequence(std::make_index_sequence<5>{}); // 출력: 0 1 2 3 4

    // 튜플 출력
    auto t = std::make_tuple(10, "hello", 3.14);
    print_tuple(t); // 출력: 10 hello 3.14
}
```

이 기능은 가변 인자 템플릿과 함께 튜플 요소에 접근하거나 패턴 매칭과 같은 고급 메타프로그래밍 기법에 유용합니다.

### 5. 바이너리 리터럴(Binary Literals)

이전에는 10진수, 8진수, 16진수 리터럴만 지원했지만, C++14에서는 2진수 리터럴도 추가되었습니다.

```cpp
// 2진수 리터럴
int binary = 0b101010;    // 42
int binary_long = 0B1010'1010; // 분리자(separator)도 사용 가능
```

### 6. 숫자 분리자(Digit Separators)

가독성을 높이기 위해 숫자 리터럴에 분리자(')를 사용할 수 있게 되었습니다.

```cpp
// 숫자 분리자 사용
int million = 1'000'000;
double pi = 3.141'592'653'589'793;
long hex = 0xDEAD'BEEF;
long binary = 0b1101'0101'0001'1010;
```

### 7. 반환 타입 추론(Return Type Deduction)

함수의 반환 타입을 `auto`로 지정하여 컴파일러가 추론하도록 할 수 있습니다.

```cpp
// 함수 반환 타입 추론
auto add(int x, int y) {
    return x + y;  // int로 추론됨
}

auto get_name() {
    return "John Doe";  // const char*로 추론됨
}

// 재귀 함수에서는 최소한 한 번의 반환문이 필요합니다
auto factorial(int n) -> decltype(auto) {
    if (n <= 1) return 1;  // 여기서 타입이 결정됨
    return n * factorial(n - 1);
}
```

### 8. 타입을 유지하는 decltype(auto)

C++14에서는 `decltype(auto)`가 추가되어 참조 타입과 cv-한정자(const, volatile)를 보존할 수 있게 되었습니다.

```cpp
// decltype(auto) 예제
int x = 42;
const int& cx = x;

auto a = cx;          // int (참조와 const가 제거됨)
decltype(auto) b = cx; // const int& (참조와 const가 유지됨)

// 함수에서 사용
decltype(auto) forward_value(int& x) {
    return x;  // int& 반환
}

decltype(auto) forward_value(const int& x) {
    return x;  // const int& 반환
}
```

## C++14 주요 기능 요약

1. **일반화된 람다 표현식**
   - 매개변수에 `auto` 사용 가능
   - 다양한 타입의 입력 처리
   - 템플릿처럼 동작하는 재사용 가능한 람다

2. **향상된 constexpr**
   - 변수 선언 및 수정 허용
   - 제어문(if, switch, 루프) 지원
   - 컴파일 타임 계산 능력 강화

3. **변수 템플릿**
   - 타입에 따라 달라지는 상수 정의
   - 템플릿 매개변수화된 변수 선언
   - 수학적 상수의 타입별 최적화

4. **표준 라이브러리 개선**
   - `std::make_unique` 추가
   - 공유 뮤텍스와 Reader-Writer 락
   - 정수 시퀀스 유틸리티

5. **코드 가독성 향상**
   - 이진수 리터럴(0b, 0B 접두사)
   - 숫자 분리자(') 지원
   - 반환 타입 추론과 decltype(auto)
