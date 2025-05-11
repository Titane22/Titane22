---
layout: page
title: C++17 표준
description: >
  C++17 표준의 주요 기능과 특징에 대한 개요
hide_description: false
---

C++17은 2017년에 발표된 C++ 표준으로, 이전 버전인 C++14에 비해 상당한 개선점을 가져왔습니다. 
"크지도 작지도 않은 표준"이라고 표현되는 이유는 C++11처럼 혁명적인 변화는 아니지만 여러 유용한 기능을 추가했기 때문입니다.

## 주요 기능

### 1. Parallel STL (병렬 표준 템플릿 라이브러리)

C++17은 STL 알고리즘의 병렬 실행 버전을 도입했습니다. 약 80개의 STL 알고리즘이 실행 정책을 통해 다양한 방식으로 실행될 수 있게 되었습니다:

- **순차 실행 (std::execution::seq)**: 기존 방식처럼 순차적으로 실행
- **병렬 실행 (std::execution::par)**: 여러 스레드에서 병렬로 실행
- **벡터화 실행 (std::execution::par_unseq)**: SIMD 명령어를 활용한 병렬 실행

```cpp
#include <algorithm>
#include <execution>
#include <vector>

std::vector<int> v = {/* 많은 데이터 */};

// 순차 정렬
std::sort(std::execution::seq, v.begin(), v.end());

// 병렬 정렬
std::sort(std::execution::par, v.begin(), v.end());

// 벡터화된 병렬 정렬
std::sort(std::execution::par_unseq, v.begin(), v.end());
```

이 기능은 대용량 데이터 처리 성능을 크게 향상시킬 수 있습니다.

### 2. 표준화된 파일시스템 (std::filesystem)

C++17은 Boost.Filesystem에서 영감을 받은 파일시스템 라이브러리를 표준에 포함시켰습니다. 이를 통해 다음과 같은 작업이 가능해졌습니다:

- 파일 및 디렉터리 경로 조작
- 파일 존재 여부 확인
- 파일 크기 및 권한 확인
- 디렉터리 탐색
- 파일 복사, 이동, 삭제

```cpp
#include <filesystem>
namespace fs = std::filesystem;

// 디렉터리 순회
for (const auto& entry : fs::directory_iterator("/path/to/dir")) {
    std::cout << entry.path() << '\n';
}

// 파일 존재 확인
if (fs::exists("file.txt")) {
    std::cout << "파일 크기: " << fs::file_size("file.txt") << '\n';
}

// 경로 조작
fs::path p = "/home/user/file.txt";
std::cout << "파일명: " << p.filename() << '\n';
std::cout << "디렉터리: " << p.parent_path() << '\n';
```

이 기능은 플랫폼 독립적인 파일 조작을 가능하게 합니다.

### 3. 새로운 데이터 타입

C++17은 Boost에서 영감을 받은, 타입 안전성을 높여주는 세 가지 중요한 데이터 타입을 추가했습니다:

#### std::optional

값이 존재할 수도, 존재하지 않을 수도 있는 상황을 표현합니다. nullptr 대신 사용할 수 있으며, 반환 값의 부재를 더 명확하게 표현합니다.

```cpp
#include <optional>
#include <string>

std::optional<std::string> fetchUserName(int id) {
    if (userExists(id)) {
        return userName;
    }
    return std::nullopt; // 값 없음
}

// 사용 예
auto name = fetchUserName(42);
if (name) {
    std::cout << "이름: " << *name << '\n';
} else {
    std::cout << "사용자가 존재하지 않습니다\n";
}
```

#### std::variant

다양한 타입 중 하나의 값을 저장할 수 있는 타입-안전 유니온입니다. C 스타일 유니온과 달리, 어떤 타입이 저장되어 있는지 추적합니다.

```cpp
#include <variant>
#include <string>

// 여러 타입 중 하나를 저장
std::variant<int, double, std::string> v = "hello";

// 방문자 패턴으로 값 처리
std::visit([](auto&& arg) {
    using T = std::decay_t<decltype(arg)>;
    if constexpr (std::is_same_v<T, int>)
        std::cout << "정수: " << arg << '\n';
    else if constexpr (std::is_same_v<T, double>)
        std::cout << "실수: " << arg << '\n';
    else if constexpr (std::is_same_v<T, std::string>)
        std::cout << "문자열: " << arg << '\n';
}, v);
```

#### std::any

어떤 타입의 값이든 저장할 수 있는 타입-지움(type-erased) 컨테이너입니다. `void*`보다 안전한 대안입니다.

```cpp
#include <any>
#include <string>

std::any a = 42;                       // 정수 저장
a = 3.14;                              // 실수로 변경
a = std::string("Hello, world!");      // 문자열로 변경

// 타입 확인 및 접근
if (a.type() == typeid(std::string)) {
    std::cout << std::any_cast<std::string>(a) << '\n';
}
```

## 그 외 C++17의 주요 기능

위에서 언급된 기능 외에도 C++17은 다음과 같은 중요한 기능을 추가했습니다:

### 구조화된 바인딩(Structured Bindings)

여러 값을 한 번에 바인딩할 수 있는 기능입니다.

```cpp
// 맵 요소 풀기
auto [key, value] = *map.begin(); 

// 구조체 멤버 풀기
struct Point { int x, y; };
Point p{1, 2};
auto [x, y] = p;

// 배열 풀기
int arr[3] = {1, 2, 3};
auto [a, b, c] = arr;
```

### if/switch문에서의 초기화 구문

if 문이나 switch 문 내에서 변수를 초기화하고 그 범위를 제한할 수 있습니다.

```cpp
// 변수 범위가 if 블록으로 제한됨
if (auto it = map.find(key); it != map.end()) {
    // it을 사용할 수 있음
} else {
    // 여기서도 it을 사용할 수 있음
}
// 여기서는 it을 사용할 수 없음

// switch 문에서도 동일
switch (auto val = getValue(); val) {
    case 1: /* ... */ break;
    case 2: /* ... */ break;
    default: /* ... */ break;
}
```

### 인라인 변수(Inline Variables)

헤더 파일에 정의된 변수도 One Definition Rule(ODR) 위반 없이 사용할 수 있게 합니다.

```cpp
// header.h
inline int globalVar = 42;   // 여러 번 포함되어도 ODR 위반 없음
inline const double PI = 3.14159265358979;

// 클래스 정적 멤버도 인라인화 가능
class Widget {
    static inline int count = 0;  // 헤더에 정의 가능
public:
    Widget() { ++count; }
    static int getCount() { return count; }
};
```

### 접기 표현식(Fold Expressions)

가변 템플릿 인자에 대해 이항 연산자를 적용할 수 있는 간결한 구문을 제공합니다.

```cpp
template<typename... Args>
auto sum(Args... args) {
    return (... + args);  // 단항 좌측 접기: ((args1 + args2) + args3) + ...
}

template<typename T, typename... Args>
bool allEqual(T first, Args... rest) {
    return (... && (first == rest));  // 모든 인자가 first와 같은지 확인
}

// 사용 예
int total = sum(1, 2, 3, 4, 5);  // 15
bool allSame = allEqual(42, 42, 42);  // true
```

### constexpr if

컴파일 시간에 조건부 코드 실행을 가능하게 합니다.

```cpp
template <typename T>
void process(T& t) {
    if constexpr (std::is_integral_v<T>) {
        // 정수 타입일 때만 컴파일됨
        std::cout << "정수 처리: " << t << '\n';
    } else if constexpr (std::is_floating_point_v<T>) {
        // 부동소수점 타입일 때만 컴파일됨
        std::cout << "실수 처리: " << t << '\n';
    } else {
        // 다른 타입일 때만 컴파일됨
        std::cout << "기타 타입 처리\n";
    }
}

// 사용 예
int i = 42;
double d = 3.14;
std::string s = "hello";

process(i);  // "정수 처리: 42"
process(d);  // "실수 처리: 3.14"
process(s);  // "기타 타입 처리"
```

## C++17 주요 기능 요약

1. **Parallel STL**
   - 알고리즘의 병렬 실행 정책
   - 대용량 데이터 처리 성능 향상
   - 순차, 병렬, 벡터화 실행 지원

2. **파일시스템 라이브러리**
   - 플랫폼 독립적인 파일/디렉터리 관리
   - 경로 조작 및 파일 작업
   - 파일 상태 및 속성 검사

3. **새로운 데이터 타입**
   - `std::optional`: 값의 존재 여부 표현
   - `std::variant`: 타입 안전한 유니온
   - `std::any`: 타입 지움(type-erased) 값 저장소

4. **코드 간결성 개선**
   - 구조화된 바인딩: 다중 값 할당
   - if/switch 초기화 구문
   - 접기 표현식(Fold Expressions)

5. **언어 안전성 향상**
   - 인라인 변수: ODR 위반 줄임
   - constexpr if: 컴파일 타임 조건부 코드
   - 클래스 템플릿 인수 추론(CTAD)
