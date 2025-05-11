---
layout: page
title: C++ 고급 디자인 패턴 - CRTP와 Overload 패턴
description: >
  C++의 강력한 템플릿 메타프로그래밍 패턴인 CRTP와 Overload 패턴에 대한 설명과 예제
hide_description: false
---

## CRTP

CRTP(Curiously Recurring Template Pattern)는 C++의 강력한 정적 다형성 메커니즘으로, 파생 클래스가 자기 자신을 베이스 클래스의 템플릿 인자로 전달하는 패턴입니다.

### CRTP 기본 개념

CRTP의 기본 구조는 다음과 같습니다:

```cpp
// 기본 클래스 템플릿
template <typename Derived>
class Base {
public:
    void interface() {
        // 파생 클래스의 구현을 호출
        static_cast<Derived*>(this)->implementation();
    }
    
    // 기본 구현 제공 (선택적)
    void implementation() {
        std::cout << "Base implementation" << std::endl;
    }
};

// 파생 클래스가 자신을 템플릿 인자로 전달
class Derived : public Base<Derived> {
public:
    void implementation() {
        std::cout << "Derived implementation" << std::endl;
    }
};
```

이 패턴을 사용하면 베이스 클래스에서 파생 클래스의 메서드를 호출할 수 있어, 가상 함수의 런타임 오버헤드 없이 다형성을 구현할 수 있습니다.

### CRTP 주요 사용 사례

1. **정적 다형성**: 가상 함수를 사용하지 않고 컴파일 타임에 다형성 구현
2. **인터페이스 자동 구현**: 파생 클래스가 최소한의 메서드만 구현하면 베이스 클래스가 나머지를 자동으로 제공
3. **연산자 오버로딩 자동화**: 모든 비교 연산자를 한 번에 구현할 수 있음
4. **믹스인 패턴**: 다양한 기능을 클래스에 쉽게 결합

### CRTP 장단점

#### 장점:
- **성능 향상**: 가상 함수 호출 오버헤드가 없음
- **컴파일 타임 검사**: 오류를 런타임이 아닌 컴파일 타임에 발견
- **인라인화 가능**: 컴파일러가 코드를 인라인화할 수 있어 최적화 기회 증가

#### 단점:
- **코드 복잡성**: 템플릿과 상속을 함께 사용하여 코드가 복잡해질 수 있음
- **디버깅 어려움**: 템플릿 코드는 일반적으로 디버깅하기 어려움
- **코드 크기 증가**: 템플릿 인스턴스화로 인해 코드 크기가 증가할 수 있음

### CRTP 예제 코드

#### 예제 1: 연산자 자동 구현

```cpp
// 모든 비교 연산자 자동 구현
template <typename Derived>
class EqualityComparable {
public:
    friend bool operator!=(const Derived& lhs, const Derived& rhs) {
        return !(lhs == rhs);
    }
};

// < 연산자를 정의하면 나머지 비교 연산자 자동 구현
template <typename Derived>
class ComparableWithLessThan : public EqualityComparable<Derived> {
public:
    friend bool operator>(const Derived& lhs, const Derived& rhs) {
        return rhs < lhs;
    }
    
    friend bool operator<=(const Derived& lhs, const Derived& rhs) {
        return !(rhs < lhs);
    }
    
    friend bool operator>=(const Derived& lhs, const Derived& rhs) {
        return !(lhs < rhs);
    }
};

// 사용 예시: 최소한의 구현으로 모든 비교 연산자 획득
class Point : public ComparableWithLessThan<Point> {
private:
    int x, y;
    
public:
    Point(int x, int y) : x(x), y(y) {}
    
    // 기본 비교 연산만 구현
    friend bool operator==(const Point& lhs, const Point& rhs) {
        return lhs.x == rhs.x && lhs.y == rhs.y;
    }
    
    friend bool operator<(const Point& lhs, const Point& rhs) {
        return lhs.x < rhs.x || (lhs.x == rhs.x && lhs.y < rhs.y);
    }
};
```

#### 예제 2: 정적 다형성으로 성능 최적화

```cpp
// 도형의 기본 클래스
template <typename Derived>
class Shape {
public:
    double area() const {
        return static_cast<const Derived*>(this)->area_impl();
    }
    
    double perimeter() const {
        return static_cast<const Derived*>(this)->perimeter_impl();
    }
    
    // 기본 구현 (필요에 따라 오버라이드)
    double area_impl() const {
        return 0.0;
    }
    
    double perimeter_impl() const {
        return 0.0;
    }
};

// 원 구현
class Circle : public Shape<Circle> {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double area_impl() const {
        return 3.14159 * radius * radius;
    }
    
    double perimeter_impl() const {
        return 2 * 3.14159 * radius;
    }
};

// 사각형 구현
class Rectangle : public Shape<Rectangle> {
private:
    double width, height;
    
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area_impl() const {
        return width * height;
    }
    
    double perimeter_impl() const {
        return 2 * (width + height);
    }
};

// 사용 예시
void printArea(const auto& shape) {
    std::cout << "면적: " << shape.area() << std::endl;
}
```

## Overload 패턴

Overload 패턴은 C++에서 서로 다른 타입에 대해 다른 동작을 수행하기 위한 패턴으로, 함수 오버로딩과 템플릿의 특성을 활용합니다.

### Overload 패턴 기본 개념

Overload 패턴의 핵심은 여러 타입을 처리할 수 있는 함수 객체(Functor)를 만드는 것입니다:

```cpp
// 기본 Overloader 구조
struct Overloader {
    void operator()(int x) {
        std::cout << "정수 처리: " << x << std::endl;
    }
    
    void operator()(double x) {
        std::cout << "실수 처리: " << x << std::endl;
    }
    
    void operator()(const std::string& x) {
        std::cout << "문자열 처리: " << x << std::endl;
    }
};

// 사용
template <typename T>
void process(const T& value) {
    Overloader{}(value);  // 적절한 오버로드 자동 선택
}
```

C++17 이상에서는 `std::variant`와 람다를 활용한 더 유연한 방식을 사용할 수 있습니다:

```cpp
// C++17 이상에서의 Overload 패턴
template <class... Ts>
struct Overloaded : Ts... {
    using Ts::operator()...;
};

// C++17의 클래스 템플릿 인수 추론(CTAD) 지원
template <class... Ts>
Overloaded(Ts...) -> Overloaded<Ts...>;
```

### Overload 패턴 주요 사용 사례

1. **타입 기반 분기 처리**: 다양한 타입에 대해 특화된 처리 로직 구현
2. **방문자 패턴(Visitor Pattern)**: `std::variant`나 다형적 자료구조 처리
3. **제네릭 프로그래밍**: 다양한 타입을 위한 공통 인터페이스 제공
4. **Discriminated Union 처리**: 합 타입(Sum Type) 처리

### Overload 패턴 장단점

#### 장점:
- **타입 안전성**: 컴파일 타임에 타입 검사
- **성능 효율성**: 런타임 타입 체크 대신 정적 디스패치 사용
- **확장성**: 새로운 타입이나 기능 추가가 용이

#### 단점:
- **코드 복잡성**: 템플릿과 다중 상속으로 코드가 복잡해질 수 있음
- **컴파일 시간 증가**: 템플릿 메타프로그래밍으로 인한 컴파일 시간 증가
- **오류 메시지 이해 어려움**: 템플릿 관련 오류 메시지는 복잡할 수 있음

### Overload 패턴 예제 코드

#### 예제 1: std::variant와 방문자 패턴

```cpp
#include <iostream>
#include <string>
#include <variant>
#include <vector>

// 여러 타입을 저장할 수 있는 변형체
using Var = std::variant<int, double, std::string>;

// Overload 패턴 헬퍼
template <class... Ts>
struct Overloaded : Ts... { using Ts::operator()...; };
template <class... Ts>
Overloaded(Ts...) -> Overloaded<Ts...>;

int main() {
    // 다양한 타입을 담은 컨테이너
    std::vector<Var> vars = {42, 3.14, "Hello"};
    
    // 각 요소를 타입에 맞게 처리
    for (const auto& v : vars) {
        std::visit(Overloaded{
            [](int x) { std::cout << "정수: " << x << '\n'; },
            [](double x) { std::cout << "실수: " << x << '\n'; },
            [](const std::string& x) { std::cout << "문자열: " << x << '\n'; }
        }, v);
    }
    
    return 0;
}
```

#### 예제 2: 타입에 따른 직렬화 구현

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <map>

// 직렬화 담당 클래스
class Serializer {
public:
    // 기본 타입 직렬화
    std::string operator()(int value) const {
        return std::to_string(value);
    }
    
    std::string operator()(double value) const {
        return std::to_string(value);
    }
    
    std::string operator()(const std::string& value) const {
        return "\"" + value + "\"";
    }
    
    // 컨테이너 직렬화
    template <typename T>
    std::string operator()(const std::vector<T>& vec) const {
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < vec.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << (*this)(vec[i]);  // 재귀적 직렬화
        }
        oss << "]";
        return oss.str();
    }
    
    template <typename K, typename V>
    std::string operator()(const std::map<K, V>& map) const {
        std::ostringstream oss;
        oss << "{";
        bool first = true;
        for (const auto& [key, value] : map) {
            if (!first) oss << ", ";
            oss << (*this)(key) << ": " << (*this)(value);
            first = false;
        }
        oss << "}";
        return oss.str();
    }
};

// 직렬화 함수
template <typename T>
std::string serialize(const T& value) {
    return Serializer{}(value);
}

int main() {
    // 다양한 타입 직렬화 예제
    std::cout << serialize(42) << '\n';
    std::cout << serialize(3.14159) << '\n';
    std::cout << serialize(std::string("Hello")) << '\n';
    std::cout << serialize(std::vector<int>{1, 2, 3, 4, 5}) << '\n';
    std::cout << serialize(std::map<std::string, int>{ { "one", 1 }, { "two", 2 } }) << '\n';
    
    return 0;
}
```

## C++23에서의 개선점

C++23의 "Deducing this" 기능은 CRTP와 Overload 패턴을 더 간단하게 만들어 줍니다.

### Deducing this를 활용한 CRTP 단순화

```cpp
// C++23의 "Deducing this"를 사용한 CRTP 대체
class Shape {
public:
    // this 매개변수를 템플릿화
    template <typename Self>
    double area(this const Self& self) {
        return self.area_impl();
    }
    
    template <typename Self>
    double perimeter(this const Self& self) {
        return self.perimeter_impl();
    }
    
    // 기본 구현
    double area_impl() const {
        return 0.0;
    }
    
    double perimeter_impl() const {
        return 0.0;
    }
};

// 상속이 더 간단해짐
class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(double r) : radius(r) {}
    
    double area_impl() const {
        return 3.14159 * radius * radius;
    }
    
    double perimeter_impl() const {
        return 2 * 3.14159 * radius;
    }
};
```

### Deducing this를 활용한 Overload 패턴 개선

```cpp
// C++23의 "Deducing this"를 사용한 방문자 패턴 구현
class Visitor {
public:
    // 다양한 타입에 대한 방문 메서드
    void visit(this Visitor& self, int value) {
        std::cout << "정수 방문: " << value << '\n';
    }
    
    void visit(this Visitor& self, double value) {
        std::cout << "실수 방문: " << value << '\n';
    }
    
    void visit(this Visitor& self, const std::string& value) {
        std::cout << "문자열 방문: " << value << '\n';
    }
    
    // 컴파일 타임 다형성을 위한 방문 템플릿
    template <typename T>
    void visitElement(this Visitor& self, const T& element) {
        self.visit(element);
    }
};

// 다양한 요소를 방문하는 함수
template <typename Collection>
void visitAll(Visitor& visitor, const Collection& collection) {
    for (const auto& element : collection) {
        visitor.visitElement(element);
    }
}
```

## 정리리

CRTP와 Overload 패턴은 C++의 강력한 템플릿 메타프로그래밍 기법으로, 다형성을 구현하면서도 런타임 오버헤드를 최소화할 수 있습니다. 

C++23의 "Deducing this" 기능은 이러한 패턴들을 더 간결하고 직관적으로 구현할 수 있게 해줍니다.

이러한 패턴들은 성능이 중요한 시스템이나 라이브러리 개발에 특히 유용하며, 현대적인 C++ 프로그래밍에서는 필수적인 도구입니다.