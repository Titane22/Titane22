---
layout: page
title: C++20 표준
description: >
  C++20의 주요 기능에 대한 샘플 코드와 설명
hide_description: false
---

이 페이지는 C++20에 도입된 주요 기능들에 대한 샘플 코드를 모아놓은 참고 자료입니다.

## 목차
- [Ranges](#ranges)
- [Coroutines](#coroutines)
- [Concepts](#concepts)
- [Modules](#modules)

---

## Ranges

Ranges는 컨테이너에 직접 알고리즘을 적용하고, 파이프 연산자로 여러 알고리즘을 연결할 수 있는 기능입니다.

### 기본 사용법

```cpp
#include <ranges>
#include <vector>
#include <iostream>

int main() {
    // 기본적인 ranges 사용
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    
    // 파이프 연산자를 사용한 알고리즘 체이닝
    auto result = numbers 
        | std::views::filter([](int n) { return n % 2 == 0; })  // 짝수만 선택
        | std::views::transform([](int n) { return n * n; })    // 제곱
        | std::views::take(3);                                  // 처음 3개만 선택

    // 여기서는 아직 아무 연산도 수행되지 않음 (지연 평가)
    // 실제로 값을 사용할 때 연산이 수행됨
    for (int n : result) {
        std::cout << n << " ";  // 출력: 4 16 36
    }
    std::cout << std::endl;
}
```

### 무한 시퀀스 처리

```cpp
#include <ranges>
#include <iostream>

int main() {
    // 무한 시퀀스 생성
    auto infinite = std::views::iota(1)  // 1부터 시작하는 무한 시퀀스
        | std::views::filter([](int n) { return n % 2 == 0; })  // 짝수만
        | std::views::transform([](int n) { return n * n; })    // 제곱
        | std::views::take(5);                                  // 처음 5개만

    // 무한 시퀀스의 처음 5개 요소 출력
    for (int n : infinite) {
        std::cout << n << " ";  // 출력: 4 16 36 64 100
    }
    std::cout << std::endl;
}
```

### 다차원 데이터 처리

```cpp
#include <ranges>
#include <vector>
#include <iostream>

int main() {
    // 2D 데이터 처리
    std::vector<std::vector<int>> matrix = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    // 행렬의 모든 요소를 평탄화하고 필터링
    auto flattened = matrix 
        | std::views::join              // 2D를 1D로 평탄화
        | std::views::filter([](int n) { return n > 5; });  // 5보다 큰 수만 선택

    for (int n : flattened) {
        std::cout << n << " ";  // 출력: 6 7 8 9
    }
    std::cout << std::endl;
}
```

### 지연 평가 확인

```cpp
#include <ranges>
#include <vector>
#include <iostream>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // 지연 평가 예시 - 각 단계에서 출력 추가
    auto pipeline = numbers 
        | std::views::filter([](int n) { 
            std::cout << "Filtering: " << n << std::endl;
            return n % 2 == 0; 
        })
        | std::views::transform([](int n) { 
            std::cout << "Transforming: " << n << std::endl;
            return n * n; 
        })
        | std::views::take(2);

    // 여기서는 아무 출력도 없음 (아직 연산이 수행되지 않음)
    std::cout << "Pipeline created" << std::endl;

    // 실제 값을 사용할 때만 연산이 수행됨
    for (int n : pipeline) {
        std::cout << "Result: " << n << std::endl;
    }
}
```

## Coroutines

코루틴은 함수의 실행을 일시 중단하고 나중에 재개할 수 있는 기능입니다.

### 기본 코루틴 구조

```cpp
#include <coroutine>
#include <iostream>

// 간단한 코루틴 예제
struct Task {
    struct promise_type {
        Task get_return_object() { return {}; }
        std::suspend_never initial_suspend() { return {}; }
        std::suspend_never final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() {}
    };
};

// 비동기 작업을 위한 코루틴
Task async_operation() {
    std::cout << "작업 시작\n";
    co_await std::suspend_never{};  // 실제로는 비동기 작업을 여기서 수행
    std::cout << "작업 완료\n";
}

int main() {
    async_operation();
    return 0;
}
```

### 제너레이터 구현

```cpp
#include <coroutine>
#include <iostream>

// 무한 시퀀스 생성기
struct Generator {
    struct promise_type {
        int current_value;
        
        Generator get_return_object() { 
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)}; 
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(int value) {
            current_value = value;
            return {};
        }
        void return_void() {}
        void unhandled_exception() {}
    };

    std::coroutine_handle<promise_type> coro;

    Generator(std::coroutine_handle<promise_type> h) : coro(h) {}
    ~Generator() { if (coro) coro.destroy(); }

    int next() {
        coro.resume();
        return coro.promise().current_value;
    }
};

// 피보나치 수열 생성기
Generator fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}

int main() {
    auto fib = fibonacci();
    std::cout << "피보나치 수열의 처음 10개 수:\n";
    for (int i = 0; i < 10; ++i) {
        std::cout << fib.next() << " ";  // 0 1 1 2 3 5 8 13 21 34
    }
    std::cout << "\n";
    return 0;
}
```

### 비동기 데이터 처리

```cpp
#include <coroutine>
#include <iostream>
#include <vector>
#include <thread>
#include <chrono>

// 비동기 데이터 처리 파이프라인
struct AsyncDataProcessor {
    struct promise_type {
        int value;
        
        AsyncDataProcessor get_return_object() { 
            return AsyncDataProcessor{std::coroutine_handle<promise_type>::from_promise(*this)}; 
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(int v) {
            value = v;
            return {};
        }
        void return_void() {}
        void unhandled_exception() {}
    };

    std::coroutine_handle<promise_type> coro;

    AsyncDataProcessor(std::coroutine_handle<promise_type> h) : coro(h) {}
    ~AsyncDataProcessor() { if (coro) coro.destroy(); }

    int process() {
        coro.resume();
        return coro.promise().value;
    }
};

// 데이터 처리 파이프라인
AsyncDataProcessor process_data(std::vector<int> data) {
    for (int value : data) {
        // 데이터 처리 시뮬레이션
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        co_yield value * 2;  // 각 값을 2배로 처리
    }
}

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    auto processor = process_data(data);
    
    std::cout << "데이터 처리 결과:\n";
    for (size_t i = 0; i < data.size(); ++i) {
        std::cout << "원본: " << data[i] 
                  << ", 처리됨: " << processor.process() << "\n";
    }
    return 0;
}
```

## Concepts

Concepts는 템플릿 매개변수에 대한 제약 조건을 명시적으로 정의할 수 있는 기능입니다.

### 기본 개념 정의

```cpp
#include <concepts>
#include <iostream>

// 기본 개념 정의
template<typename T>
concept Number = std::integral<T> || std::floating_point<T>;

template<typename T>
concept Container = requires(T c) {
    { c.begin() } -> std::same_as<typename T::iterator>;
    { c.end() } -> std::same_as<typename T::iterator>;
    { c.size() } -> std::convertible_to<std::size_t>;
};

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};
```

### 개념을 사용한 함수 템플릿

```cpp
#include <concepts>
#include <iostream>

template<typename T>
concept Number = std::integral<T> || std::floating_point<T>;

// 개념을 사용한 함수 템플릿
template<Number T>
T square(T x) {
    return x * x;
}

int main() {
    std::cout << "정수 제곱: " << square(5) << "\n";     // OK
    std::cout << "실수 제곱: " << square(3.14) << "\n";  // OK
    // square("hello");  // 컴파일 오류: 'char const*' 타입은 'Number' 개념을 만족하지 않음
    return 0;
}
```

### 여러 개념 조합

```cpp
#include <concepts>
#include <vector>
#include <list>
#include <iostream>
#include <string>

template<typename T>
concept Container = requires(T c) {
    { c.begin() } -> std::same_as<typename T::iterator>;
    { c.end() } -> std::same_as<typename T::iterator>;
    { c.size() } -> std::convertible_to<std::size_t>;
};

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

template<Container T>
void print_container(const T& container) {
    for (const auto& item : container) {
        std::cout << item << " ";
    }
    std::cout << "\n";
}

// 여러 개념 조합
template<typename T>
requires Container<T> && Printable<typename T::value_type>
void process_container(const T& container) {
    std::cout << "컨테이너 크기: " << container.size() << "\n";
    print_container(container);
}

int main() {
    // Container 개념 사용
    std::vector<int> vec = {1, 2, 3, 4, 5};
    std::list<std::string> lst = {"Hello", "World", "C++20"};
    
    std::cout << "벡터 출력: ";
    print_container(vec);
    
    std::cout << "리스트 출력: ";
    print_container(lst);
    
    return 0;
}
```

### 사용자 정의 타입과 함께 사용

```cpp
#include <concepts>
#include <vector>
#include <iostream>

template<typename T>
concept Container = requires(T c) {
    { c.begin() } -> std::same_as<typename T::iterator>;
    { c.end() } -> std::same_as<typename T::iterator>;
    { c.size() } -> std::convertible_to<std::size_t>;
};

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};

// 사용자 정의 타입
struct Point {
    int x, y;
    friend std::ostream& operator<<(std::ostream& os, const Point& p) {
        return os << "(" << p.x << "," << p.y << ")";
    }
};

template<Container T>
void print_container(const T& container) {
    for (const auto& item : container) {
        std::cout << item << " ";
    }
    std::cout << "\n";
}

template<typename T>
requires Container<T> && Printable<typename T::value_type>
void process_container(const T& container) {
    std::cout << "컨테이너 크기: " << container.size() << "\n";
    print_container(container);
}

int main() {
    // 복합 개념 사용
    std::vector<Point> points = { { 1, 1 }, { 2, 2 }, { 3, 3 } };
    process_container(points);  // Point 객체 출력 가능
    return 0;
}
```

## Modules

Modules는 기존의 헤더 파일 시스템을 대체하는 현대적인 코드 구성 방식입니다.

### 기본 모듈 정의

```cpp
// math.cppm
module;  // 전역 모듈 조각 시작
#include <cmath>  // 전역 모듈에서 표준 라이브러리 포함

export module math;  // 'math' 모듈 선언 및 내보내기

export namespace math {  // 내보낼 기능들을 namespace로 그룹화
    double square(double x) {
        return x * x;
    }

    double cube(double x) {
        return x * x * x;
    }

    struct Point {
        double x, y;
        double distance(const Point& other) const {
            return std::sqrt(square(x - other.x) + square(y - other.y));
        }
    };
}
```

### 모듈 가져오기 및 사용

```cpp
// main.cpp
import math;  // math 모듈 가져오기
#include <iostream>  // 아직 표준 라이브러리는 #include 사용

int main() {
    // 수학 모듈 사용
    std::cout << "5의 제곱: " << math::square(5) << "\n";
    std::cout << "3의 세제곱: " << math::cube(3) << "\n";

    // math::Point 사용
    math::Point p1{0, 0}, p2{3, 4};
    std::cout << "두 점 사이의 거리: " << p1.distance(p2) << "\n";  // 5

    return 0;
}
```

### 모듈 간 의존성

```cpp
// geometry.cppm
module;
#include <vector>

export module geometry;  // 'geometry' 모듈 선언
import math;  // 'math' 모듈 가져오기

export namespace geometry {
    class Circle {
        math::Point center;  // 다른 모듈의 타입 사용
        double radius;
    public:
        Circle(const math::Point& c, double r) : center(c), radius(r) {}
        double area() const {
            return 3.14159 * math::square(radius);  // 다른 모듈의 함수 사용
        }
    };

    class Rectangle {
        math::Point topLeft;
        double width, height;
    public:
        Rectangle(const math::Point& tl, double w, double h)
            : topLeft(tl), width(w), height(h) {}
        double area() const {
            return width * height;
        }
    };
}

// main.cpp (모듈 사용)
import math;
import geometry;
#include <iostream>

int main() {
    math::Point p1{0, 0}, p2{3, 4};
    geometry::Circle circle(p1, 5);
    geometry::Rectangle rect(p2, 4, 6);

    std::cout << "원의 넓이: " << circle.area() << "\n";
    std::cout << "사각형의 넓이: " << rect.area() << "\n";
    return 0;
}
```

## C++20 주요 기능 요약

1. **Ranges**
   - 컨테이너에 직접 알고리즘 적용
   - 파이프 연산자로 알고리즘 체이닝
   - 지연 평가로 메모리/성능 최적화
   - 무한 시퀀스 처리 가능

2. **Coroutines**
   - 함수 실행 일시 중단 및 재개
   - 비동기 프로그래밍 간소화
   - 데이터 스트림 생성 및 처리
   - 상태 보존과 메모리 효율성

3. **Concepts**
   - 템플릿 매개변수에 대한 명시적 제약 조건
   - 타입 안전성 강화
   - 개선된 오류 메시지
   - 코드 가독성 향상

4. **Modules**
   - 헤더 파일 시스템 대체
   - 빌드 성능 향상
   - 캡슐화 강화
   - 전역 매크로 오염 방지

5. **기타 개선사항**
   - 3방향 비교 연산자(<=>)
   - 지정 초기화(Designated Initializers)
   - consteval과 constinit
   - 스페이스쉽 연산자(Spaceship Operator)
