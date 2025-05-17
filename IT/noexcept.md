---
layout: page
title: noexcept 키워드
description: >
  C++11에서 도입된 noexcept 키워드의 의미, 중요성 및 활용 방법
hide_description: false
---

## 기본 개념

`noexcept`는 C++11부터 도입된 키워드로, 함수가 예외를 던지지 않음을 컴파일러에게 알려주는 명시적 선언입니다.

```cpp
void myFunction() noexcept;  // 이 함수는 예외를 던지지 않음을 보장
```

이것은 C++98/03에서 사용되던 `throw()`와 유사하지만, 더 엄격하고 성능 최적화 목적이 강화되었습니다.

```cpp
// C++98/03 방식 (deprecated)
void oldWay() throw();  

// C++11 이후 방식
void modernWay() noexcept;
```

## 왜 중요한가?

### 1. 성능 최적화에 도움

`noexcept` 지정자가 있는 함수는 컴파일러가 다음과 같은 최적화를 수행할 수 있습니다:

- 예외 처리를 위한 스택 풀기(stack unwinding) 기능 생략
- 예외 테이블(exception table) 생성 최소화
- 더 효율적인 코드 생성

실제로 많은 경우, `noexcept` 함수는 non-`noexcept` 함수보다 최대 25% 더 빠를 수 있습니다.

### 2. 이동 연산에서 매우 중요

표준 라이브러리 컨테이너와 알고리즘은 함수의 `noexcept` 속성을 기반으로 최적화 결정을 내립니다. 특히 **이동 연산**에서 매우 중요합니다.

```cpp
// std::vector가 내부 재할당 시 이 클래스의 객체들을
// 이동할지, 복사할지 결정할 때 중요
class MyClass {
public:
    MyClass(MyClass&& other) noexcept;  // noexcept이므로 이동 사용
    // vs
    MyClass(MyClass&& other);  // noexcept 없으므로 복사로 fallback
};
```

`std::vector` 등의 컨테이너는 내부 버퍼를 재할당할 때, 이동 연산이 `noexcept`인 경우에만 이동 의미론을 사용합니다. 그렇지 않으면 예외 안전성을 위해 복사 연산으로 대체됩니다.

## 기본 사용법

### 단순 noexcept 지정

가장 기본적인 사용법은 함수 선언에 `noexcept` 키워드를 추가하는 것입니다:

```cpp
void simpleFunction() noexcept {
    // 예외를 던지지 않는 코드
}

class MyClass {
public:
    // 소멸자는 암시적으로 noexcept
    ~MyClass();
    
    // 생성자에 noexcept 적용
    MyClass() noexcept;
    
    // 멤버 함수에 noexcept 적용
    void process() noexcept;
};
```

### 조건부 noexcept

`noexcept`는 조건식을 포함할 수 있어, 특정 조건에서만 예외를 던지지 않도록 지정할 수 있습니다:

```cpp
template<typename T>
void templateFunction(T&& value) noexcept(std::is_nothrow_move_constructible<T>::value) {
    // T의 이동 생성자가 noexcept인 경우에만 noexcept 적용
}

// 다른 함수의 noexcept 여부에 따라 결정
void dependentFunction() noexcept(noexcept(otherFunction()));
```

### noexcept 연산자

`noexcept` 키워드는 지정자(specifier)로 사용되지만, `noexcept(expr)` 형태의 연산자(operator)로도 사용됩니다. 이 연산자는 표현식이 예외를 던지지 않을 경우 `true`를 반환합니다:

```cpp
void func() noexcept;

// noexcept 연산자 사용 예
constexpr bool doesNotThrow = noexcept(func());  // true

template<typename T>
void process(T&& t) {
    static_assert(noexcept(t.clone()), "T::clone must not throw");
}
```

## 이동 연산에서의 활용

이동 연산자와 `noexcept`는 매우 밀접한 관계가 있습니다. 표준 라이브러리 컨테이너가 최적화를 위해 이동 연산을 사용하려면, 해당 연산이 `noexcept`로 표시되어야 합니다.

```cpp
class OptimizedClass {
private:
    std::string data;
    
public:
    // 이동 생성자
    OptimizedClass(OptimizedClass&& other) noexcept
        : data(std::move(other.data)) {
    }
    
    // 이동 대입 연산자
    OptimizedClass& operator=(OptimizedClass&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
        }
        return *this;
    }
};
```

### 벡터 재할당 예제

다음 예제는 `noexcept`의 중요성을 보여줍니다:

```cpp
std::vector<OptimizedClass> vec;
vec.reserve(10);  // 초기 용량 설정

// 추가 요소 push_back - 재할당 발생할 수 있음
for (int i = 0; i < 20; i++) {
    vec.push_back(OptimizedClass());  // 이동 생성자가 noexcept이므로 이동 연산 사용
}
```

`OptimizedClass`의 이동 생성자가 `noexcept`로 표시되지 않았다면, `std::vector`는 재할당 중에 복사 연산자를 대신 사용했을 것입니다.

### 표준 라이브러리 타입 분석

표준 라이브러리 타입들의 이동 연산 자격을 확인해 볼 수 있습니다:

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <type_traits>

int main() {
    std::cout << "std::string 이동 생성자는 noexcept? "
              << noexcept(std::string(std::move(std::string()))) << '\n';
              
    std::cout << "std::vector<int> 이동 생성자는 noexcept? "
              << noexcept(std::vector<int>(std::move(std::vector<int>()))) << '\n';
}
```

## 예외 발생 시 처리

`noexcept` 지정자가 있는 함수에서 예외가 발생하면 어떻게 될까요?

```cpp
void willTerminate() noexcept {
    throw std::runtime_error("이 예외로 인해 프로그램이 종료됩니다");
}

int main() {
    try {
        willTerminate();  // 이 함수 호출은 프로그램 종료를 유발
    } catch (const std::exception& e) {
        // 이 catch 블록은 절대 실행되지 않습니다!
        std::cout << "예외 잡힘: " << e.what() << '\n';
    }
}
```

`noexcept` 함수에서 예외가 "탈출"하려고 하면, C++ 런타임은 즉시 `std::terminate()`를 호출하여 프로그램을 종료합니다. `try-catch` 블록으로도 이 예외를 잡을 수 없습니다.

## 암시적 noexcept 함수

C++11부터 일부 함수는 명시적으로 선언하지 않아도 암시적으로 `noexcept`로 간주됩니다:

1. **소멸자**: 모든 소멸자는 기본적으로 `noexcept`
2. **기본 생성된 특수 멤버 함수**: 컴파일러가 자동 생성한 특수 멤버 함수는 특정 조건에서 `noexcept`
3. **`constexpr` 함수**: C++14부터 모든 `constexpr` 함수는 암시적으로 `noexcept`

```cpp
struct ImplicitNoexcept {
    // 암시적으로 noexcept
    ~ImplicitNoexcept();
    
    // 만약 std::string의 이동 생성자가 noexcept라면 이것도 noexcept
    ImplicitNoexcept(ImplicitNoexcept&&) = default;
    
    // constexpr 함수는 암시적으로 noexcept (C++14 이상)
    constexpr int calculate(int x) { return x * 2; }
};
```

## 실용적 사용 가이드라인

### 어떤 함수에 noexcept를 적용할까?

다음과 같은 함수에는 `noexcept`를 고려해보세요:

1. **이동 생성자와 이동 대입 연산자**: 가장 중요
2. **swap 함수**: 효율적인 이동 연산에 필수적
3. **메모리 할당 함수**: `std::allocator::allocate`를 제외한 대부분
4. **트리비얼(trivial) 작업 함수**: 복사, 단순 계산 등
5. **예외에 안전한 함수**: 어떤 경우에도 예외를 던지지 않는 함수

### 실무에서의 예

```cpp
// 리소스를 관리하는 클래스
class ResourceManager {
private:
    std::unique_ptr<Resource> resource;
    
public:
    // 기본 생성자
    ResourceManager() noexcept = default;
    
    // 소멸자 (암시적으로 noexcept)
    ~ResourceManager() = default;
    
    // 이동 생성자
    ResourceManager(ResourceManager&& other) noexcept 
        : resource(std::move(other.resource)) {
    }
    
    // 이동 대입 연산자
    ResourceManager& operator=(ResourceManager&& other) noexcept {
        if (this != &other) {
            resource = std::move(other.resource);
        }
        return *this;
    }
    
    // swap 함수 - 항상 noexcept여야 함
    friend void swap(ResourceManager& a, ResourceManager& b) noexcept {
        using std::swap;
        swap(a.resource, b.resource);
    }
    
    // 복사 연산은 리소스 할당이 필요해 예외 가능성 있음
    ResourceManager(const ResourceManager& other);
    ResourceManager& operator=(const ResourceManager& other);
};
```

## 조건부 noexcept의 실용적 예

복잡한 클래스의 이동 연산이 `noexcept`인지 여부는 종종 멤버 변수들의 이동 연산이 `noexcept`인지에 의존합니다:

```cpp
template <typename T>
class Container {
private:
    T* data;
    size_t size;
    
public:
    // T의 이동 생성자가 noexcept인 경우에만 noexcept
    Container(Container&& other) noexcept(std::is_nothrow_move_constructible<T>::value)
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
    }
    
    // T의 이동 대입 연산자가 noexcept인 경우에만 noexcept
    Container& operator=(Container&& other) 
        noexcept(std::is_nothrow_move_assignable<T>::value) {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
    
    // ...기타 함수들
};
```

이러한 패턴은 표준 라이브러리 컨테이너에서 광범위하게 사용됩니다.

## 요약

| 항목 | 설명 |
|------|------|
| 의미 | 함수가 예외를 던지지 않음을 선언 |
| 구문 | `void func() noexcept;` 또는 `void func() noexcept(condition);` |
| 장점 | 컴파일러 최적화, STL 컨테이너에서 이동 연산 활용 |
| 주의사항 | 위반 시 `std::terminate()` 호출됨 |
| 중요 용도 | 이동 생성자/대입 연산자, swap 함수 |
| 암시적 적용 | 소멸자, 특정 기본 생성 함수, constexpr 함수 |

## 결론

`noexcept`는 현대 C++에서 성능 최적화와 예외 안전성 보장에 중요한 키워드입니다. 특히 이동 연산에서 `noexcept`의 사용은 표준 라이브러리 컨테이너의 성능에 직접적인 영향을 미칩니다. 리소스를 관리하는 클래스를 설계할 때, 적절한 `noexcept` 선언을 통해 최적화 기회를 극대화할 수 있습니다.

`noexcept`를 사용할 때는 해당 함수가 정말로 예외를 던지지 않음을 보장할 수 있는지 신중하게 판단해야 합니다. 예외를 던질 가능성이 있는 함수에 `noexcept`를 적용하면 프로그램이 예기치 않게 종료될 수 있기 때문입니다. 