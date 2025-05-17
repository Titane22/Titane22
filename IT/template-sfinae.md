---
layout: page
title: 템플릿 & SFINAE
description: >
  C++의 템플릿과 SFINAE(Substitution Failure Is Not An Error) 개념 및 활용법
hide_description: false
---

## 핵심 개념

### C++ 템플릿 기초

템플릿은 C++의 강력한 기능으로, 타입이나 값에 대해 일반화된 코드를 작성할 수 있게 해줍니다.

```cpp
// 함수 템플릿
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}

// 클래스 템플릿
template <typename T>
class Container {
private:
    T data;
public:
    void set(const T& value) { data = value; }
    T get() const { return data; }
};
```

### SFINAE(Substitution Failure Is Not An Error)

SFINAE는 "치환 실패는 오류가 아니다"라는 C++ 템플릿 규칙으로, 템플릿 인자 치환 과정에서 발생한 실패가 컴파일 오류로 이어지지 않고, 해당 오버로드가 후보군에서 제외됨을 의미합니다.

```cpp
// 정수형 타입에 대한 함수
template <typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type 
func(T t) {
    return t * 2;
}

// 부동소수점 타입에 대한 함수
template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type 
func(T t) {
    return t * 3.14;
}
```

### std::enable_if

`std::enable_if`는 SFINAE를 활용한 메타함수로, 조건에 따라 함수 오버로드나 템플릿 특수화를 선택적으로 활성화할 수 있게 해줍니다.

```cpp
template <typename T, 
          typename = typename std::enable_if<std::is_integral<T>::value>::type>
void process(T value) {
    std::cout << "정수 처리: " << value << std::endl;
}
```

C++14부터는 `std::enable_if_t`와 같은 간편한 표현이 가능합니다:

```cpp
template <typename T, 
          typename = std::enable_if_t<std::is_integral_v<T>>>
void process(T value) {
    std::cout << "정수 처리: " << value << std::endl;
}
```

### 타입 특성(Type Traits)

C++의 타입 특성 라이브러리(`<type_traits>`)는 타입에 대한 다양한 정보를 컴파일 타임에 확인할 수 있게 해주며, SFINAE와 결합하여 강력한 템플릿 메타프로그래밍을 가능하게 합니다.

```cpp
#include <type_traits>

// is_same, is_base_of, is_integral 등의 타입 특성 사용
template <typename T>
struct is_valid_type : 
    std::integral_constant<bool, 
                           std::is_integral<T>::value || 
                           std::is_floating_point<T>::value> {};
```

## 실용적인 예제

### 예제 1: 타입에 따른 함수 오버로드

```cpp
#include <iostream>
#include <type_traits>
#include <string>

// 정수형 타입만 받는 함수
template <typename T>
typename std::enable_if<std::is_integral<T>::value, void>::type
print_type_info(const T& value) {
    std::cout << "정수형 값: " << value << std::endl;
}

// 부동소수점 타입만 받는 함수
template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, void>::type
print_type_info(const T& value) {
    std::cout << "부동소수점 값: " << value << std::endl;
}

// 문자열 타입만 받는 함수
template <typename T>
typename std::enable_if<std::is_same<T, std::string>::value, void>::type
print_type_info(const T& value) {
    std::cout << "문자열 값: " << value << std::endl;
}

int main() {
    print_type_info(42);        // 정수형 값: 42
    print_type_info(3.14);      // 부동소수점 값: 3.14
    print_type_info(std::string("Hello"));  // 문자열 값: Hello
    
    // 다음은 컴파일 오류 - 위 함수들 중 어느 것도 매치되지 않음
    // print_type_info(std::vector<int>{1, 2, 3});
    
    return 0;
}
```

### 예제 2: tag dispatch 패턴

Tag dispatch는 SFINAE의 대안으로, 타입 태그를 사용하여 함수 오버로드를 선택하는 방법입니다.

```cpp
#include <iostream>
#include <type_traits>

// 태그 구조체 정의
struct integral_tag {};
struct floating_point_tag {};
struct other_tag {};

// 타입에 따라 적절한 태그 선택
template <typename T>
struct get_tag {
    using type = typename std::conditional<
        std::is_integral<T>::value, integral_tag,
        typename std::conditional<
            std::is_floating_point<T>::value, floating_point_tag,
            other_tag
        >::type
    >::type;
};

// 메인 함수 템플릿
template <typename T>
void process(T value) {
    process_impl(value, typename get_tag<T>::type());
}

// 각 태그에 대한 오버로드
void process_impl(int value, integral_tag) {
    std::cout << "정수 처리: " << value << " * 2 = " << (value * 2) << std::endl;
}

template <typename T>
void process_impl(T value, floating_point_tag) {
    std::cout << "부동소수점 처리: " << value << " * 3.14 = " << (value * 3.14) << std::endl;
}

template <typename T>
void process_impl(T value, other_tag) {
    std::cout << "기타 타입 처리: " << typeid(T).name() << std::endl;
}

int main() {
    process(10);     // 정수 처리: 10 * 2 = 20
    process(3.5f);   // 부동소수점 처리: 3.5 * 3.14 = 10.99
    process("hello"); // 기타 타입 처리: char const*
    
    return 0;
}
```

### 예제 3: C++20의 Concepts

C++20에서는 SFINAE를 더 가독성 있게 사용할 수 있는 Concepts 기능이 도입되었습니다:

```cpp
#include <iostream>
#include <concepts>

// C++20 Concepts 사용
template <typename T>
concept Integral = std::is_integral_v<T>;

template <typename T>
concept Floating = std::is_floating_point_v<T>;

// 개념을 사용한 함수 정의
template <Integral T>
void process(T value) {
    std::cout << "정수 처리: " << value << std::endl;
}

template <Floating T>
void process(T value) {
    std::cout << "부동소수점 처리: " << value << std::endl;
}

int main() {
    process(42);    // 정수 처리: 42
    process(3.14);  // 부동소수점 처리: 3.14
    
    return 0;
}
```

## 면접 질문과 답변

### Q: SFINAE란 무엇인가요?

A: SFINAE(Substitution Failure Is Not An Error)는 "치환 실패는 오류가 아니다"라는 C++ 템플릿 규칙입니다. 이는 템플릿 인수 추론 과정에서 특정 치환이 실패할 경우, 컴파일러가 오류를 발생시키지 않고 해당 함수 오버로드나 특수화를 후보군에서 제외한다는 의미입니다.

예를 들어, `std::enable_if`를 사용해 특정 타입에만 작동하는 함수를 정의했을 때, 다른 타입으로 호출하면 SFINAE로 인해 해당 오버로드가 무시되고 다른 오버로드가 선택됩니다. 이를 통해 컴파일 타임에 타입 기반 분기 처리가 가능합니다.

### Q: std::enable_if는 어떻게 사용하나요?

A: `std::enable_if`는 첫 번째 템플릿 인자가 `true`일 때만 `type` 멤버 typedef를 제공하는 조건부 메타함수입니다. 주로 다음 세 가지 방식으로 사용됩니다:

1. **함수 반환 타입으로 사용:**
```cpp
template <typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
func(T t) { return t * 2; }
```

2. **추가 템플릿 매개변수를 통한 사용 (기본 템플릿 인자 활용):**
```cpp
template <typename T, 
          typename = typename std::enable_if<std::is_integral<T>::value>::type>
void func(T t) { /* ... */ }
```

3. **함수 매개변수로 사용 (더미 매개변수):**
```cpp
template <typename T>
void func(T t, typename std::enable_if<std::is_integral<T>::value, int>::type = 0) { /* ... */ }
```

C++14부터는 `std::enable_if_t`, `std::is_integral_v` 등의 편의 템플릿을 사용해 더 간결하게 작성할 수 있습니다.

### Q: SFINAE와 static_assert의 차이점은 무엇인가요?

A: SFINAE와 `static_assert`는 모두 컴파일 타임 타입 검사에 사용되지만, 근본적인 차이가 있습니다:

- **SFINAE**: 조건을 만족하지 않을 경우 해당 함수 오버로드나 템플릿 특수화를 후보군에서 제외합니다. 다른 오버로드가 있다면 그것을 사용하고, 없다면 컴파일 오류가 발생합니다.

- **static_assert**: 주어진 조건을 만족하지 않을 경우 즉시 컴파일 오류를 발생시키고, 오류 메시지를 표시합니다. 대체 후보를 찾지 않습니다.

예를 들어:
```cpp
// SFINAE - 조건 불만족시 이 함수는 오버로드 후보에서 제외됨
template <typename T, typename = std::enable_if_t<std::is_integral_v<T>>>
void func(T t) { /* ... */ }

// static_assert - 조건 불만족시 즉시 컴파일 오류 발생
template <typename T>
void func(T t) {
    static_assert(std::is_integral_v<T>, "정수 타입만 허용됩니다!");
    /* ... */
}
```

## 실용적인 활용 사례

### 사례 1: 최적화된 swap 함수

```cpp
#include <type_traits>
#include <vector>

// 표준 swap 사용
template <typename T>
typename std::enable_if<!std::is_trivially_copyable<T>::value>::type
swap(T& a, T& b) {
    T temp = std::move(a);
    a = std::move(b);
    b = std::move(temp);
}

// 최적화된 memcpy 기반 swap
template <typename T>
typename std::enable_if<std::is_trivially_copyable<T>::value>::type
swap(T& a, T& b) {
    char temp[sizeof(T)];
    std::memcpy(temp, &a, sizeof(T));
    std::memcpy(&a, &b, sizeof(T));
    std::memcpy(&b, temp, sizeof(T));
}
```

### 사례 2: 완벽한 전달(Perfect Forwarding)을 활용한 팩토리 함수

```cpp
#include <memory>
#include <type_traits>

class BaseProduct {
public:
    virtual ~BaseProduct() = default;
    virtual void use() = 0;
};

template <typename T>
class ConcreteProduct : public BaseProduct {
public:
    template <typename... Args, 
              typename = std::enable_if_t<std::is_constructible_v<T, Args...>>>
    ConcreteProduct(Args&&... args) : data(std::forward<Args>(args)...) {}
    
    void use() override {
        // 사용 구현
    }
    
private:
    T data;
};

// 팩토리 함수
template <typename T, typename... Args>
std::enable_if_t<std::is_base_of_v<BaseProduct, ConcreteProduct<T>>, 
                std::unique_ptr<BaseProduct>>
createProduct(Args&&... args) {
    return std::make_unique<ConcreteProduct<T>>(std::forward<Args>(args)...);
}
```

### 사례 3: has_method 타입 특성 구현

```cpp
#include <type_traits>

// toString 메서드를 가지고 있는지 확인하는 타입 특성
template <typename T, typename = void>
struct has_toString : std::false_type {};

// SFINAE를 사용한 특수화
template <typename T>
struct has_toString<T, decltype(std::declval<T>().toString(), void())> : std::true_type {};

// 사용 예제
class WithToString {
public:
    std::string toString() const { return "WithToString"; }
};

class WithoutToString {
    // toString 메서드 없음
};

template <typename T>
void process(const T& obj) {
    if constexpr (has_toString<T>::value) {
        std::cout << "toString 메서드 호출: " << obj.toString() << std::endl;
    } else {
        std::cout << "toString 메서드 없음" << std::endl;
    }
}
```

## 결론

SFINAE는 C++ 템플릿 메타프로그래밍의 핵심 기법으로, 타입에 따른 조건부 컴파일 시간 분기를 가능하게 합니다. `std::enable_if`와 함께 사용하면 타입 특성에 따라 함수 오버로드를 선택적으로 활성화할 수 있어, 컴파일 타임에 타입 안전성을 보장하면서도 유연한 코드를 작성할 수 있습니다.

C++20에서는 Concepts라는 새로운 기능이 도입되어 SFINAE의 복잡성을 줄이고 더 가독성 있는 코드 작성이 가능해졌지만, SFINAE의 기본 개념 이해는 여전히 중요합니다. 