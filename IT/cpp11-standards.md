---
layout: page
title: C++11 표준
description: >
  C++11 표준의 주요 기능과 모던 C++의 시작
hide_description: false
---

C++11은 2011년에 발표된 C++ 표준으로, 
이전 표준인 C++03에서 크게 개선되어 모던 C++의 시작점으로 여겨집니다. 

코드 작성 방식과 성능에 혁명적인 변화를 가져왔으며, 
C++ 언어의 표현력과 안전성을 크게 향상시켰습니다.

## 주요 기능

### 1. 자동 타입 추론 (Auto)

변수, 함수 반환 타입의 자동 추론이 가능해졌습니다.

```cpp
// 변수의 타입 추론
auto i = 42;               // int
auto d = 3.14;             // double
auto s = "Hello";          // const char*
auto v = std::vector<int>{1, 2, 3}; // std::vector<int>

// 반복자 코드 간소화
std::vector<int> vec = {1, 2, 3};
for (auto it = vec.begin(); it != vec.end(); ++it) {
    // 기존: std::vector<int>::iterator it = vec.begin();
    // ...
}

// 함수 반환 타입 추론 (후행 반환 타입 구문)
auto add(int x, int y) -> int {
    return x + y;
}
```

### 2. 범위 기반 for 루프

컨테이너를 더 쉽게 순회할 수 있는 문법이 추가되었습니다.

```cpp
std::vector<int> vec = {1, 2, 3, 4, 5};

// 기존 방식
for (std::vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
    std::cout << *it << ' ';
}

// 범위 기반 for 루프
for (int& value : vec) {
    std::cout << value << ' ';
    value *= 2; // 원본을 수정할 수 있음
}

// 읽기 전용으로 접근
for (const auto& value : vec) {
    std::cout << value << ' ';
}
```

### 3. 람다 표현식

익명 함수를 만들 수 있는 람다 표현식이 도입되었습니다.

```cpp
// 기본 람다 문법
auto greet = []() { std::cout << "Hello, World!\n"; };
greet(); // "Hello, World!" 출력

// 매개변수를 받는 람다
auto add = [](int a, int b) { return a + b; };
std::cout << add(3, 4); // 7 출력

// 캡처 목록을 사용하는 람다
int multiplier = 2;
auto multiply = [multiplier](int x) { return x * multiplier; };
std::cout << multiply(5); // 10 출력

// 값 변경이 가능한 캡처 목록
auto modify = [multiplier]() mutable { 
    multiplier *= 2; 
    return multiplier; 
};

// 모든 변수를 참조로 캡처
[&]() { /* 외부 변수를 참조로 접근 */ };

// 모든 변수를 값으로 캡처
[=]() { /* 외부 변수를 값으로 접근 */ };

// 일부 변수만 캡처
[x, &y]() { /* x는 값으로, y는 참조로 캡처 */ };
```

### 4. 이동 의미론 (Move Semantics)과 우측값 참조 (Rvalue References)

객체의 소유권을 효율적으로 이동할 수 있는 메커니즘이 추가되었습니다.

```cpp
// 이동 생성자와 이동 대입 연산자
class MyString {
private:
    char* data;
    size_t length;
    
public:
    // 이동 생성자
    MyString(MyString&& other) noexcept 
        : data(other.data), length(other.length) {
        other.data = nullptr;
        other.length = 0;
    }
    
    // 이동 대입 연산자
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            length = other.length;
            other.data = nullptr;
            other.length = 0;
        }
        return *this;
    }
    
    // ... 다른 멤버들 ...
};

// 사용 예
MyString createString() {
    MyString temp("Hello");
    return temp; // 이동 생성자를 통해 효율적으로 이동됨
}

MyString s = createString(); // 불필요한 복사 없음
```

### 5. 스마트 포인터

메모리 관리를 자동화하는 스마트 포인터가 표준 라이브러리에 추가되었습니다.

```cpp
#include <memory>

// unique_ptr: 단독 소유권
std::unique_ptr<int> p1(new int(42));
//std::unique_ptr<int> p2 = p1; // 컴파일 오류: 복사 불가
std::unique_ptr<int> p3 = std::move(p1); // 이동은 가능

// shared_ptr: 공유 소유권
std::shared_ptr<int> sp1(new int(42));
std::shared_ptr<int> sp2 = sp1; // 참조 카운트 증가
std::cout << *sp1 << ", " << *sp2 << ", Count: " << sp1.use_count(); // 42, 42, Count: 2

// weak_ptr: 약한 참조
std::weak_ptr<int> wp = sp1;
if (auto locked = wp.lock()) {
    std::cout << *locked; // 42
}

// make_shared: 더 효율적인 shared_ptr 생성
auto sp3 = std::make_shared<int>(42);
```

### 6. 타입 추론 (Decltype)

표현식의 타입을 추론할 수 있는 `decltype` 키워드가 도입되었습니다.

```cpp
int i = 42;
double d = 3.14;
const int& r = i;

decltype(i) x = i;         // int
decltype(d) y = d;         // double
decltype(r) z = i;         // const int&
decltype(i + d) w = i + d; // double

// 함수 반환 타입으로도 사용 가능
template<typename T, typename U>
auto add(T t, U u) -> decltype(t + u) {
    return t + u;
}
```

### 7. 초기화 리스트 (Initializer Lists)

객체 초기화를 위한 일관된 문법이 도입되었습니다.

```cpp
// 중괄호 초기화
int a{42};
double b{3.14};
bool c{true};

// 배열 초기화
int arr[] = {1, 2, 3, 4, 5};

// 벡터 초기화
std::vector<int> vec = {1, 2, 3, 4, 5};

// 맵 초기화
std::map<std::string, int> ages = {
    {"Alice", 25},
    {"Bob", 30},
    {"Charlie", 35}
};

// 클래스에서의 초기화 리스트 지원
class Widget {
public:
    Widget(std::initializer_list<int> values) {
        // values 처리
    }
};

Widget w = {1, 2, 3, 4, 5};
```

### 8. nullptr

`NULL`과 `0`을 대체하는 타입 안전한 널 포인터 상수가 도입되었습니다.

```cpp
// nullptr 사용
int* p = nullptr;  // 기존: int* p = NULL; 또는 int* p = 0;

// 함수 오버로딩에서 더 명확해짐
void f(int);
void f(char*);

f(0);      // f(int) 호출
f(nullptr); // f(char*) 호출
```

### 9. 열거형 클래스 (Enum Classes)

타입 안전성이 향상된 열거형이 추가되었습니다.

```cpp
// 기존 열거형의 문제점
enum Color { RED, GREEN, BLUE };
enum Fruit { APPLE, BANANA, ORANGE };

Color c = RED;
if (c == APPLE) { // 서로 다른 열거형이지만 비교 가능 (컴파일 에러 없음)
    // ...
}

// 열거형 클래스
enum class NewColor { RED, GREEN, BLUE };
enum class NewFruit { APPLE, BANANA, ORANGE };

NewColor nc = NewColor::RED;
//if (nc == NewFruit::APPLE) { // 컴파일 오류: 서로 다른 타입 비교 불가
//}

// 또한 명시적으로 타입 지정 가능
enum class Flags : uint8_t {
    OPTION1 = 0x01,
    OPTION2 = 0x02,
    OPTION3 = 0x04
};
```

### 10. constexpr

컴파일 시간에 평가될 수 있는 표현식을 정의할 수 있는 키워드가 도입되었습니다.

```cpp
// 컴파일 시간 상수
constexpr int factorial(int n) {
    return n <= 1 ? 1 : (n * factorial(n - 1));
}

// 컴파일 시간에 계산됨
constexpr int fact5 = factorial(5); // 120

// 컴파일 시간에 평가되는 변수
constexpr double PI = 3.14159265358979;
constexpr double TWICE_PI = 2.0 * PI;
```

### 11. 쓰레딩 라이브러리

멀티쓰레딩 프로그래밍을 위한 표준 라이브러리가 추가되었습니다.

```cpp
#include <thread>
#include <mutex>
#include <future>
#include <chrono>

// 기본 쓰레드 사용
std::thread t1([]() {
    std::cout << "Hello from thread!" << std::endl;
});
t1.join();

// 뮤텍스를 사용한 동기화
std::mutex mtx;
int counter = 0;

void increment() {
    std::lock_guard<std::mutex> lock(mtx);
    ++counter;
}

// Future와 Promise를 사용한 비동기 작업
std::future<int> compute = std::async(std::launch::async, []() {
    std::this_thread::sleep_for(std::chrono::seconds(1));
    return 42;
});

// 결과 받기
int result = compute.get(); // 1초 후 42를 반환
```

### 12. 가변 인자 템플릿 (Variadic Templates)

임의의 개수와 타입의 매개변수를 받을 수 있는 템플릿이 가능해졌습니다.

```cpp
// 가변 인자 템플릿 함수
template<typename... Args>
void printAll(Args... args) {
    (std::cout << ... << args) << std::endl;
}

printAll(1, 2.5, "Hello", 'x'); // "12.5Hellox" 출력

// 재귀적 구현 (C++17 이전)
void print() {
    std::cout << std::endl;
}

template<typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << ' ';
    print(rest...); // 나머지 인수로 재귀 호출
}

print(1, 2.5, "Hello", 'x'); // "1 2.5 Hello x" 출력

// 튜플 구현에도 사용됨
template<typename... Types>
class tuple;
```

### 13. 사용자 정의 리터럴

사용자가 리터럴 표기법을 확장할 수 있는 기능이 추가되었습니다.

```cpp
// 사용자 정의 리터럴
constexpr long double operator""_km(long double value) {
    return value * 1000.0; // 킬로미터를 미터로 변환
}

constexpr long double operator""_mi(long double value) {
    return value * 1609.344; // 마일을 미터로 변환
}

// 사용 예
auto marathon = 42.195_km; // 42195.0 미터
auto mile = 1.0_mi;        // 1609.344 미터
```

### 14. 명시적 오버라이드와 final

상속 관계에서 메서드 오버라이딩을 명시적으로 표현할 수 있게 되었습니다.

```cpp
class Base {
public:
    virtual void foo();
    virtual void bar();
    virtual void baz();
};

class Derived : public Base {
public:
    void foo() override; // 명시적으로 오버라이드 표시
    void bar() final;    // 하위 클래스에서 더 이상 오버라이드할 수 없음
    //void qux() override; // 컴파일 오류: Base에 qux가 없음
};

class FurtherDerived : public Derived {
public:
    //void bar() override; // 컴파일 오류: bar는 final
};

final class SealedClass { /* ... */ }; // 이 클래스는 상속될 수 없음
```

### 15. 멤버 함수 참조 한정자 (Ref-qualifiers)

멤버 함수가 lvalue 또는 rvalue에서만 호출될 수 있도록 지정할 수 있습니다.

```cpp
class Widget {
public:
    void doWork() &;  // lvalue (*this)에서만 호출 가능
    void doWork() &&; // rvalue (*this)에서만 호출 가능
};

Widget w;
w.doWork();      // 첫 번째 버전 호출 (w는 lvalue)
Widget().doWork(); // 두 번째 버전 호출 (Widget()은 rvalue)
```

## 메모리 모델과 스레딩

C++11은 멀티스레드 환경에서의 동작을 정의하는 새로운 메모리 모델을 도입했습니다. 이는 현대적인 CPU 아키텍처와 병렬 프로그래밍을 위한 기반이 됩니다.

```cpp
#include <atomic>

// 원자적 연산
std::atomic<int> counter(0);
counter.fetch_add(1, std::memory_order_relaxed);

// 메모리 순서 지정
std::atomic<bool> ready(false);
std::atomic<int> data(0);

// 쓰기 스레드
data.store(42, std::memory_order_release);
ready.store(true, std::memory_order_release);

// 읽기 스레드
while (!ready.load(std::memory_order_acquire));
int answer = data.load(std::memory_order_acquire);
```

## 좌측값(lvalue)과 우측값(rvalue)

C++에서 표현식은 두 가지 주요 카테고리로 구분됩니다: 

좌측값(lvalue)과 우측값(rvalue). 

이 구분은 C++11에서 도입된 이동 의미론(Move Semantics)과 완벽한 전달(Perfect Forwarding)의 기반이 됩니다.

### 좌측값(lvalue)

좌측값은 다음과 같은 특성을 갖습니다:

- **이름이 있고 주소를 가질 수 있음**
- **대입 연산자 왼쪽에 올 수 있음**
- **참조 수명이 장기적임**

예시:
```cpp
int x = 10;          // x는 좌측값
int& ref = x;        // 좌측값 참조로 x를 참조
int* ptr = &x;       // 좌측값의 주소를 얻을 수 있음
x = 20;              // 좌측값에 값 할당 가능
```

좌측값에는 다음이 포함됩니다:
- 변수명
- 배열 요소
- 문자열 리터럴("hello" 등)
- 좌측값 참조를 반환하는 함수 결과
- 좌측값을 반환하는 클래스 멤버 접근 표현식(obj.m)

### 우측값(rvalue)

우측값은 다음과 같은 특성을 갖습니다:

- **이름이 없음(임시 값)**
- **대입 연산자 왼쪽에 올 수 없음**
- **표현식 이후 곧 소멸됨(임시적)**
- **이동 가능함(move semantics 대상)**

예시:
```cpp
int x = 10 + 20;     // 10 + 20은 우측값
int&& rref = 5 + 3;  // 우측값 참조
//5 = x;             // 오류: 우측값에 할당 불가
```

우측값에는 다음이 포함됩니다:
- 리터럴(10, 3.14, true 등)
- 임시 객체
- 비참조 값을 반환하는 함수 호출
- 산술 표현식(a + b, x * y 등)
- 후위 증감 연산자(x++)

### 값 카테고리의 계층 구조

C++11에서는 값 카테고리가 더 세분화되었습니다:

```
표현식(Expression)
├── 좌측값(lvalue)
├── 우측값(rvalue)
    ├── 소멸 값(xvalue, eXpiring value)
    └── 순수 우측값(prvalue, pure rvalue)
```

- **소멸 값(xvalue)**: 이동될 수 있는 리소스를 가리키는 표현식 (예: `std::move(x)`)
- **순수 우측값(prvalue)**: 임시 값, 리터럴 등

### 우측값 참조

C++11에서 도입된 우측값 참조(`&&`)는 우측값에 바인딩할 수 있는 새로운 참조 타입입니다:

```cpp
int&& rref = 42;        // 우측값 참조
int&& rref2 = x + y;    // 계산 결과인 우측값에 바인딩

// 함수 오버로딩
void foo(int& x) {       // 좌측값 참조 버전
    std::cout << "lvalue 참조\n";
}
void foo(int&& x) {      // 우측값 참조 버전
    std::cout << "rvalue 참조\n";
}

int main() {
    int a = 10;
    foo(a);         // "lvalue 참조" 출력
    foo(10);        // "rvalue 참조" 출력
    foo(a + 10);    // "rvalue 참조" 출력
}
```

### 참조 카테고리 이해하기

| 표현식 | 값 카테고리 | 가능한 참조 |
|--------|------------|------------|
| `x` (변수) | lvalue | `T&` |
| `10` (리터럴) | prvalue | `T&&` |
| `x + y` (표현식) | prvalue | `T&&` |
| `*p` (포인터 역참조) | lvalue | `T&` |
| `std::move(x)` | xvalue | `T&&` |
| `x++` (후위 증가) | prvalue | `T&&` |
| `++x` (전위 증가) | lvalue | `T&` |

이 개념들은 C++11의 이동 의미론과 완벽한 전달을 이해하는 데 필수적입니다. 특히 리소스 관리와 최적화에 큰 영향을 미칩니다.

## 완벽한 전달(Perfect Forwarding)

C++11에서는 우측값 참조(&&)와 `std::forward`를 통해 함수가 받은 인자를 다른 함수에 원래의 값 카테고리(lvalue/rvalue)를 그대로 유지하며 전달할 수 있는 완벽한 전달 메커니즘을 제공합니다.

```cpp
#include <utility>
#include <iostream>

// 다양한 인자를 받는 목표 함수
void process(int& x) {
    std::cout << "좌측값 참조: " << x << '\n';
    ++x;
}

void process(int&& x) {
    std::cout << "우측값 참조: " << x << '\n';
}

// 완벽한 전달을 구현한 래퍼 함수
template<typename T>
void wrapper(T&& arg) {
    // std::forward를 사용하여 원래 값 카테고리 보존
    process(std::forward<T>(arg));
}

int main() {
    int a = 42;
    
    process(a);        // 좌측값 버전 호출
    process(123);      // 우측값 버전 호출
    
    wrapper(a);        // T는 int&, arg는 int&로 추론되고 좌측값으로 전달됨
    wrapper(123);      // T는 int, arg는 int&&로 추론되고 우측값으로 전달됨
    
    std::cout << "a 값: " << a << '\n';  // a가 43으로 증가함
    
    return 0;
}
```

### 완벽한 전달의 작동 원리

1. **유니버설 참조(Universal Reference)**:
   - 템플릿 타입 매개변수 `T`와 함께 사용된 `T&&`는 우측값 참조가 아닌 유니버설 참조입니다.
   - 좌측값이 전달되면 `T`는 `Type&`로 추론되고, `T&&`는 `Type&`가 됩니다.
   - 우측값이 전달되면 `T`는 `Type`으로 추론되고, `T&&`는 `Type&&`가 됩니다.

2. **참조 접기(Reference Collapsing)**:
   - `Type& &&` → `Type&` (좌측값 참조)
   - `Type&& &&` → `Type&&` (우측값 참조)

3. **std::forward의 역할**:
   - 좌측값이 전달되었다면 좌측값으로 유지
   - 우측값이 전달되었다면 우측값으로 변환
   - 이를 통해 원래의 값 카테고리를 보존

### 완벽한 전달의 장점

- 여러 오버로드 함수를 위한 래퍼 함수를 하나만 작성하면 됨
- 불필요한 복사 없이 효율적인 인자 전달
- 생성자와 팩토리 함수에서 특히 유용
- `std::make_shared`, `std::make_unique` 등이 내부적으로 이 기술을 활용

이 기능은 특히 가변 인자 템플릿과 함께 사용될 때 강력하며, 모던 C++의 성능과 표현력 향상에 크게 기여합니다.

## C++11 주요 기능 요약

1. **자동 타입 추론 (Auto)**
   - 변수 타입 자동 추론으로 코드 간결성 향상
   - 복잡한 반복자 타입 직접 명시 불필요
   - 후행 반환 타입으로 함수 선언 가독성 개선

2. **람다 표현식**
   - 익명 함수를 통한 코드 간결성 및 가독성 향상
   - 외부 변수 캡처 메커니즘 (값, 참조)
   - 알고리즘 함수에 간편하게 동작 전달 가능

3. **이동 의미론과 우측값 참조**
   - 불필요한 복사 제거로 성능 향상
   - 리소스 소유권 명시적 이동
   - 완벽한 전달(Perfect Forwarding) 지원

4. **메모리 관리 개선**
   - 스마트 포인터(`unique_ptr`, `shared_ptr`, `weak_ptr`)
   - 자동 메모리 관리 및 리소스 누수 방지
   - 참조 카운팅 기반 공유 소유권

5. **병렬 프로그래밍 지원**
   - 표준 스레딩 라이브러리
   - 동기화 프리미티브(뮤텍스, 조건 변수)
   - 비동기 작업 지원(future, promise)
