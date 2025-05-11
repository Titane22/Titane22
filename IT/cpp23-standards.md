---
layout: page
title: C++23 표준준
description: >
  C++23의 주요 기능에 대한 샘플 코드와 설명
hide_description: false
---

이 페이지는 C++23에 도입된 주요 기능들에 대한 샘플 코드를 모아놓은 참고 자료입니다.

## 목차
- [Deducing this](#deducing-this)
- [표준 라이브러리 기능](#표준-라이브러리-기능)

---

## Deducing this

`Deducing this`는 멤버 함수에서 `this` 포인터를 명시적으로 선언하고 추론할 수 있게 해주는 기능입니다.

### 기본 사용법

```cpp
#include <iostream>

class Counter {
private:
    int count = 0;

public:
    // C++23 이전 방식
    void increment() {
        ++count;
    }
    
    // C++23 방식: 명시적 this 파라미터
    void increment(this Counter& self) {
        ++self.count;
    }
    
    // const 한정자 사용
    int getValue(this const Counter& self) {
        return self.count;
    }
    
    // 값 전달 방식
    Counter copyAdd(this Counter self, int value) {
        self.count += value;
        return self;
    }
};

int main() {
    Counter c;
    c.increment();
    std::cout << "Counter value: " << c.getValue() << std::endl;
    
    Counter c2 = c.copyAdd(10);
    std::cout << "Original counter: " << c.getValue() 
              << ", New counter: " << c2.getValue() << std::endl;
    return 0;
}
```

### 다양한 레퍼런스 타입 활용

```cpp
#include <iostream>

class Widget {
public:
    // lvalue 레퍼런스 버전
    void process(this Widget& self) {
        std::cout << "Called on lvalue Widget" << std::endl;
    }
    
    // rvalue 레퍼런스 버전
    void process(this Widget&& self) {
        std::cout << "Called on rvalue Widget" << std::endl;
    }
};

int main() {
    Widget w;
    w.process();        // "Called on lvalue Widget" 출력
    Widget().process(); // "Called on rvalue Widget" 출력
    return 0;
}
```

### CRTP 패턴 단순화

```cpp
#include <iostream>

// 기존 C++ 방식
template <typename Derived>
class BaseOld {
public:
    void action() {
        // 다운캐스팅 필요
        static_cast<Derived*>(this)->implementation();
    }
};

class DerivedOld : public BaseOld<DerivedOld> {
public:
    void implementation() {
        std::cout << "Old style implementation" << std::endl;
    }
};

// C++23 방식
class Base {
public:
    template <typename Self>
    void action(this Self&& self) {
        // 다운캐스팅 불필요
        std::forward<Self>(self).implementation();
    }
};

class Derived : public Base {
public:
    void implementation() {
        std::cout << "New style implementation" << std::endl;
    }
};

int main() {
    DerivedOld old;
    old.action();     // "Old style implementation" 출력
    
    Derived modern;
    modern.action();  // "New style implementation" 출력
    return 0;
}
```

### 체이닝 API 구현

```cpp
#include <iostream>
#include <string>
#include <string_view>

class StringBuilder {
private:
    std::string data;

public:
    template <typename Self>
    auto& append(this Self&& self, std::string_view str) {
        self.data.append(str);
        return self;
    }
    
    template <typename Self>
    auto& clear(this Self&& self) {
        self.data.clear();
        return self;
    }
    
    std::string toString(this const StringBuilder& self) {
        return self.data;
    }
};

int main() {
    StringBuilder builder;
    std::string result = builder
        .append("Hello")
        .append(" ")
        .append("C++23")
        .toString();
    std::cout << "StringBuilder result: " << result << std::endl;
    return 0;
}
```

### 다형성 없는 인터페이스

```cpp
#include <iostream>

class Shape {
public:
    template <typename Self>
    double area(this const Self& self) {
        return self.calculateArea();  // 파생 클래스의 calculateArea 호출
    }
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}
    
    double calculateArea() const {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double calculateArea() const {
        return width * height;
    }
};

int main() {
    Circle circle(5.0);
    Rectangle rectangle(4.0, 6.0);
    
    std::cout << "Circle area: " << circle.area() << std::endl;      // 78.5398
    std::cout << "Rectangle area: " << rectangle.area() << std::endl; // 24
    return 0;
}
```

### 요소 접근 최적화

```cpp
#include <iostream>
#include <vector>

class Vector {
private:
    std::vector<int> data;

public:
    Vector(std::initializer_list<int> init) : data(init) {}
    
    // const 레퍼런스: 읽기 전용 접근
    int at(this const Vector& self, size_t index) {
        return self.data.at(index);
    }
    
    // 비-const 레퍼런스: 수정 가능한 접근
    int& at(this Vector& self, size_t index) {
        return self.data.at(index);
    }
    
    // rvalue 레퍼런스: 내부 데이터 이동
    std::vector<int> extractData(this Vector&& self) {
        return std::move(self.data);
    }
};

int main() {
    Vector vec = {1, 2, 3, 4, 5};
    std::cout << "Vec[2]: " << vec.at(2) << std::endl;  // 3
    
    vec.at(2) = 30;  // 수정
    std::cout << "Vec[2] after modification: " << vec.at(2) << std::endl;  // 30
    
    auto movedData = std::move(vec).extractData();
    std::cout << "Moved data size: " << movedData.size() << std::endl;  // 5
    return 0;
}
```

## 표준 라이브러리 기능

C++23은 아래와 같은 표준 라이브러리 기능들을 새롭게 추가했습니다.

### std::print, std::println

```cpp
#include <print>
#include <iostream>
#include <string>

int main() {
    // 기존 출력 방식
    std::cout << "Hello, " << "World!" << std::endl;
    
    // C++23의 print 함수
    std::print("Hello, {}!\n", "C++23");
    
    // 줄바꿈이 포함된 println 함수
    std::println("Value: {}", 42);
    
    // 포맷팅 옵션 사용
    std::println("Hex: {:#x}, Binary: {:#b}", 255, 15);
    
    // 여러 인수 출력
    std::string name = "C++";
    int version = 23;
    std::println("{} version {}", name, version);
    
    return 0;
}
```

### std::expected

```cpp
#include <expected>
#include <iostream>
#include <string>

// 에러 정보를 나타내는 타입
struct ErrorInfo {
    int code;
    std::string message;
};

// 파일을 읽는 함수 (성공 또는 실패 가능)
std::expected<std::string, ErrorInfo> readFile(const std::string& filename) {
    // 파일이 존재하지 않는 경우 시뮬레이션
    if (filename.empty()) {
        return std::unexpected(ErrorInfo{404, "File not found"});
    }
    
    // 권한이 없는 경우 시뮬레이션
    if (filename == "secret.txt") {
        return std::unexpected(ErrorInfo{403, "Permission denied"});
    }
    
    // 성공적으로 파일 내용 반환
    return "This is the content of " + filename;
}

int main() {
    // 성공 케이스
    auto result1 = readFile("example.txt");
    if (result1) {
        std::cout << "Success: " << *result1 << std::endl;
    }
    
    // 실패 케이스 1
    auto result2 = readFile("");
    if (!result2) {
        std::cout << "Error " << result2.error().code 
                  << ": " << result2.error().message << std::endl;
    }
    
    // 실패 케이스 2
    auto result3 = readFile("secret.txt");
    if (!result3) {
        std::cout << "Error " << result3.error().code 
                  << ": " << result3.error().message << std::endl;
    }
    
    // Monadic 인터페이스 사용
    auto result4 = readFile("example.txt")
        .and_then([](std::string content) -> std::expected<int, ErrorInfo> {
            return content.length();  // 성공 시 파일 내용 길이 반환
        })
        .or_else([](ErrorInfo err) -> std::expected<int, ErrorInfo> {
            if (err.code == 404) {
                return 0;  // 파일이 없으면 0 반환
            }
            return std::unexpected(err);  // 다른 오류는 그대로 전파
        });
    
    if (result4) {
        std::cout << "Content length: " << *result4 << std::endl;
    }
    
    return 0;
}
```

### std::flat_map

```cpp
#include <flat_map>
#include <iostream>
#include <string>
#include <chrono>

// 성능 측정 유틸리티 함수
template <typename Func>
double measure(Func&& func) {
    auto start = std::chrono::high_resolution_clock::now();
    func();
    auto end = std::chrono::high_resolution_clock::now();
    return std::chrono::duration<double, std::milli>(end - start).count();
}

int main() {
    // flat_map 초기화
    std::flat_map<int, std::string> flat_map = {
        {1, "one"}, {5, "five"}, {3, "three"}, {2, "two"}, {4, "four"}
    };
    
    // 요소 접근 및 순회
    std::cout << "flat_map 내용:\n";
    for (const auto& [key, value] : flat_map) {
        std::cout << key << ": " << value << "\n";
    }
    
    // 검색 성능 테스트
    const int ITERATIONS = 10000;
    int searchKey = 3;
    
    double time = measure([&]() {
        for (int i = 0; i < ITERATIONS; ++i) {
            auto it = flat_map.find(searchKey);
            if (it == flat_map.end()) {
                std::cout << "Key not found\n";
            }
        }
    });
    
    std::cout << "flat_map에서 " << ITERATIONS << "번 검색 시간: " 
              << time << "ms\n";
    
    // 요소 추가 및 정렬 상태 유지
    flat_map.insert({6, "six"});
    flat_map.emplace(7, "seven");
    
    std::cout << "요소 추가 후 flat_map 내용:\n";
    for (const auto& [key, value] : flat_map) {
        std::cout << key << ": " << value << "\n";
    }
    
    return 0;
}
```

### std::generator

```cpp
#include <generator>
#include <iostream>
#include <vector>

// 범위 내의 숫자 생성
std::generator<int> range(int start, int end, int step = 1) {
    for (int i = start; i < end; i += step) {
        co_yield i;
    }
}

// 무한 피보나치 시퀀스 생성
std::generator<int> fibonacci() {
    int a = 0, b = 1;
    co_yield a;
    co_yield b;
    
    while (true) {
        int next = a + b;
        co_yield next;
        a = b;
        b = next;
    }
}

// 파일의 모든 라인 생성
std::generator<std::string_view> readLines(std::string_view content) {
    size_t pos = 0;
    while (pos < content.size()) {
        size_t endPos = content.find('\n', pos);
        if (endPos == std::string::npos) {
            endPos = content.size();
        }
        co_yield content.substr(pos, endPos - pos);
        pos = endPos + 1;
    }
}

int main() {
    // 범위 생성기 사용
    std::cout << "1부터 10까지 2씩 증가:\n";
    for (int value : range(1, 10, 2)) {
        std::cout << value << " ";  // 1 3 5 7 9
    }
    std::cout << "\n\n";
    
    // 피보나치 생성기 사용
    std::cout << "피보나치 수열의 처음 10개 숫자:\n";
    int count = 0;
    for (int value : fibonacci()) {
        std::cout << value << " ";  // 0 1 1 2 3 5 8 13 21 34
        if (++count >= 10) break;  // 무한 시퀀스 제한
    }
    std::cout << "\n\n";
    
    // 라인 생성기 사용
    std::string fileContent = "First line\nSecond line\nThird line";
    std::cout << "파일 내용 라인별 출력:\n";
    for (std::string_view line : readLines(fileContent)) {
        std::cout << "라인: " << line << "\n";
    }
    
    return 0;
}
```

### std::optional 확장 (Monadic 인터페이스)

```cpp
#include <optional>
#include <iostream>
#include <string>

// 사용자 정보 클래스
struct User {
    int id;
    std::string name;
    std::optional<std::string> email;
};

// ID로 사용자 찾기
std::optional<User> findUserById(int id) {
    // 간단한 예제를 위한 하드코딩된 사용자
    if (id == 1) {
        return User{1, "Alice", "alice@example.com"};
    } else if (id == 2) {
        return User{2, "Bob", std::nullopt};
    }
    return std::nullopt;
}

// 이메일로 도메인 추출
std::optional<std::string> extractDomain(const std::optional<std::string>& email) {
    return email.and_then([](const std::string& email) -> std::optional<std::string> {
        size_t pos = email.find('@');
        if (pos != std::string::npos && pos + 1 < email.length()) {
            return email.substr(pos + 1);
        }
        return std::nullopt;
    });
}

int main() {
    // 기존 방식 (C++17)
    auto user1 = findUserById(1);
    if (user1) {
        if (user1->email) {
            size_t pos = user1->email->find('@');
            if (pos != std::string::npos) {
                std::cout << "User 1 email domain (C++17 방식): " 
                          << user1->email->substr(pos + 1) << std::endl;
            }
        }
    }
    
    // C++23 방식 (Monadic 인터페이스)
    auto domain1 = findUserById(1)
        .and_then([](const User& user) -> std::optional<std::string> {
            return user.email;
        })
        .transform([](const std::string& email) -> std::string {
            size_t pos = email.find('@');
            return (pos != std::string::npos) ? email.substr(pos + 1) : "";
        });
    
    if (domain1) {
        std::cout << "User 1 email domain (C++23 방식): " << *domain1 << std::endl;
    }
    
    // 사용자 2 (이메일 없음) 처리
    auto domain2 = findUserById(2)
        .and_then([](const User& user) -> std::optional<std::string> {
            return user.email;
        })
        .transform([](const std::string& email) -> std::string {
            size_t pos = email.find('@');
            return (pos != std::string::npos) ? email.substr(pos + 1) : "";
        })
        .or_else([]() -> std::optional<std::string> {
            return "no-email.com";  // 이메일이 없는 경우의 기본값
        });
    
    std::cout << "User 2 email domain (C++23 방식): " << *domain2 << std::endl;
    
    return 0;
}
```

### C++23 표준 라이브러리 개선

#### `import std;` - 직접 표준 라이브러리 임포트
- C++20에서 도입된 모듈 시스템의 확장으로, 전체 표준 라이브러리를 한 번에 임포트할 수 있습니다.
- 기존의 `#include` 방식보다 컴파일 시간이 빨라지고 코드가 더 깔끔해집니다.

#### `std::print` 및 `std::println` - C++20 포맷 스트링 적용 가능
- 형식화된 출력을 위한 새로운 함수로, Python의 `print()` 함수와 유사합니다.
- C++20의 `std::format`을 기반으로 하며, 기존 `std::cout`보다 직관적이고 간결한 출력이 가능합니다.
- `std::println`은 자동으로 줄바꿈을 추가합니다.

#### `std::flat_map` - 성능 향상을 위한 `std::map` 대체제
- 캐시 친화적인 구조로 설계된 연관 컨테이너입니다.
- 연속된 메모리 공간에 키와 값을 저장하여 메모리 지역성이 향상되고 데이터 검색 성능이 개선됩니다.
- 작은 크기의 맵에서 특히 효율적입니다.

#### `std::optional`의 Monadic 인터페이스 - Composability 향상
- 기존 C++17의 `std::optional`에 함수형 프로그래밍에서 영감을 받은 메서드가 추가되었습니다.
- `and_then()`, `transform()`, `or_else()` 같은 메서드로 값 처리를 연속적으로 구성할 수 있습니다.
- 중첩된 조건문 없이 더 간결하고 읽기 쉬운 코드 작성이 가능합니다.

#### `std::expected` - 새로운 데이터 타입
- 오류 처리를 위한 새로운 유틸리티 타입으로, Rust의 `Result` 타입과 유사합니다.
- 함수가 성공적인 결과 또는 오류를 반환할 수 있도록 합니다.
- 예외를 사용하지 않고도 오류 상태를 명시적으로 처리할 수 있습니다.

#### `std::mdspan` - 다차원 span
- 다차원 배열 뷰를 제공하는 클래스입니다.
- 기존 데이터에 대한 소유권 없이 다차원 뷰를 만들 수 있어 메모리 효율성이 높습니다.
- 과학 계산, 이미지 처리 등에서 유용하게 사용됩니다.

#### `std::generator` - 숫자들의 스트림을 생성하기 위한 코루틴
- 코루틴 기반 제너레이터 타입입니다.
- 데이터 시퀀스를 지연 생성하여 메모리 효율성을 높입니다.
- 무한 시퀀스나 대용량 데이터 처리에 유용합니다.

## C++23 주요 기능 요약

1. **Deducing this**
   - 멤버 함수에서 `this` 포인터를 명시적으로 선언
   - 레퍼런스 타입(lvalue, rvalue)에 따른 다양한 구현
   - CRTP 패턴 단순화
   - 체이닝 API 구현 용이

2. **표준 라이브러리 기능**
   - `std::print`, `std::println`: 포맷팅이 쉬운 출력 함수
   - `std::expected`: 에러 처리를 위한 새로운 타입
   - `std::flat_map`: 캐시 친화적인 연관 컨테이너
   - `std::generator`: 코루틴 기반 제너레이터
   - `std::optional` 확장: Monadic 인터페이스 추가
   - `std::mdspan`: 다차원 배열 뷰
