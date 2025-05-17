---
layout: page
title: 람다 함수(Lambda Functions)
description: >
  C++11에서 도입된 람다 함수의 개념, 문법, 캡처 방식 및 실용적인 사용 예제
hide_description: false
---

# 람다 함수(Lambda Functions)

## 핵심 개념

### 람다 함수란?

람다 함수는 C++11에서 도입된 익명 함수로, 코드 내에서 이름 없이 정의하고 사용할 수 있는
함수 객체입니다. 람다 함수는 함수형 프로그래밍 스타일을 C++에 도입하고, 코드의 가독성과
간결성을 높이는 데 도움을 줍니다.

```cpp
// 기본 람다 함수 문법
[capture-clause](parameters) -> return_type { function_body }
```

각 부분의 의미:
- `[capture-clause]`: 외부 변수를 람다 내부로 캡처하는 방식 지정
- `(parameters)`: 함수 매개변수 목록 (선택 사항)
- `-> return_type`: 반환 타입 (선택 사항, 대부분 컴파일러가 추론 가능)
- `{ function_body }`: 함수 본문

### 람다 함수의 캡처 방식

람다 함수는 다양한 방식으로 외부 변수를 캡처할 수 있습니다:

```cpp
int x = 10;
int y = 20;

// 1. 값에 의한 캡처
auto lambda1 = [x]() { return x * 2; };  // x를 값으로 캡처

// 2. 참조에 의한 캡처
auto lambda2 = [&y]() { y = 30; return y; };  // y를 참조로 캡처

// 3. 값과 참조 혼합
auto lambda3 = [x, &y]() { y = x * 2; return y; };

// 4. 모든 사용된 변수를 값으로 캡처
auto lambda4 = [=]() { return x + y; };

// 5. 모든 사용된 변수를 참조로 캡처
auto lambda5 = [&]() { x = 30; y = 40; return x + y; };

// 6. 기본적으로 모두 값으로 캡처하되, 특정 변수만 참조로 캡처
auto lambda6 = [=, &y]() { y = x * 2; return y; };

// 7. 기본적으로 모두 참조로 캡처하되, 특정 변수만 값으로 캡처
auto lambda7 = [&, x]() { y = x * 2; return y; };
```

### mutable 키워드

기본적으로 값으로 캡처된 변수는 람다 내부에서 수정할 수 없습니다. `mutable` 키워드를 사용하면 이 제한을 해제할 수 있습니다:

```cpp
int x = 10;
auto lambda = [x]() mutable { x += 5; return x; };  // 캡처된 x의 복사본을 수정
std::cout << lambda() << std::endl;  // 15 출력
std::cout << x << std::endl;         // 여전히 10 (원본 x는 변경되지 않음)
```

### 제네릭 람다 (C++14)

C++14부터는 `auto` 키워드를 사용하여 제네릭 람다 함수를 만들 수 있습니다:

```cpp
// 모든 타입에 작동하는 제네릭 람다
auto generic_lambda = [](auto x, auto y) { return x + y; };

int a = generic_lambda(10, 20);          // int + int
double b = generic_lambda(3.14, 2.71);   // double + double
std::string c = generic_lambda(std::string("Hello, "), "World!");  // string + const char*
```

### 람다와 클로저

람다 표현식이 평가되면 고유한 클로저 타입의 객체가 생성됩니다. 각 람다 표현식은 서로 다른 타입을 생성합니다:

```cpp
auto lambda1 = []() { return 1; };
auto lambda2 = []() { return 1; };
// lambda1과 lambda2는 다른 타입입니다!

// std::function으로 동일한 시그니처의 람다를 저장할 수 있습니다
std::function<int()> func1 = lambda1;
std::function<int()> func2 = lambda2;
// func1과 func2는 같은 타입입니다
```

## 실용적인 예제

### 예제 1: STL 알고리즘과 함께 사용

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 3, 1, 4, 2};
    
    // 오름차순 정렬
    std::sort(numbers.begin(), numbers.end());
    
    // 내림차순 정렬 (람다 사용)
    std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
        return a > b;
    });
    
    // numbers: {5, 4, 3, 2, 1}
    
    // 짝수만 찾기
    auto even_count = std::count_if(numbers.begin(), numbers.end(), [](int n) {
        return n % 2 == 0;
    });
    
    // 모든 요소에 10 더하기
    std::transform(numbers.begin(), numbers.end(), numbers.begin(), [](int n) {
        return n + 10;
    });
    
    // numbers: {15, 14, 13, 12, 11}
    
    return 0;
}
```

### 예제 2: 이벤트 콜백 처리

```cpp
#include <iostream>
#include <functional>
#include <vector>
#include <string>

class Button {
private:
    std::string name;
    std::function<void()> onClick;
    
public:
    Button(const std::string& name) : name(name), onClick(nullptr) {}
    
    void setOnClickListener(std::function<void()> callback) {
        onClick = callback;
    }
    
    void click() {
        std::cout << "Button " << name << " clicked!" << std::endl;
        if (onClick) {
            onClick();
        }
    }
};

int main() {
    Button btn1("Save");
    Button btn2("Cancel");
    
    // 람다를 사용하여 버튼 클릭 이벤트 처리
    btn1.setOnClickListener([]() {
        std::cout << "Saving data..." << std::endl;
    });
    
    int exitCode = 0;
    btn2.setOnClickListener([&exitCode]() {
        std::cout << "Operation cancelled." << std::endl;
        exitCode = 1;
    });
    
    btn1.click();  // "Button Save clicked!" "Saving data..."
    btn2.click();  // "Button Cancel clicked!" "Operation cancelled."
    
    return exitCode;
}
```

### 예제 3: 즉시 실행 함수 표현식 (IIFE)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // 즉시 실행 람다를 사용한 복잡한 초기화
    const auto result = [](int base) {
        std::vector<int> values;
        
        for (int i = 0; i < 5; ++i) {
            values.push_back(base * (i + 1));
        }
        
        std::sort(values.begin(), values.end(), std::greater<int>());
        
        int sum = 0;
        for (int value : values) {
            sum += value;
        }
        
        return sum;
    }(10);  // 기본값 10으로 람다 즉시 실행
    
    std::cout << "Result: " << result << std::endl;  // Result: 150
    
    return 0;
}
```

### 예제 4: 캡처를 활용한 상태 유지 (C++14)

```cpp
#include <iostream>
#include <vector>
#include <functional>

// 카운터 생성 함수
auto make_counter() {
    int count = 0;
    return [count]() mutable {
        return ++count;
    };
}

// unique_ptr 캡처 (C++14 이상)
auto create_resource_manager() {
    auto resource = std::make_unique<int>(42);
    
    return [resource = std::move(resource)]() {
        return *resource;
    };
}

int main() {
    // 두 개의 독립적인 카운터 생성
    auto counter1 = make_counter();
    auto counter2 = make_counter();
    
    std::cout << counter1() << std::endl;  // 1
    std::cout << counter1() << std::endl;  // 2
    std::cout << counter2() << std::endl;  // 1 (독립적)
    
    // 리소스 관리자 생성
    auto manager = create_resource_manager();
    std::cout << manager() << std::endl;  // 42
    
    return 0;
}
```

### 예제 5: 재귀적 람다 함수 (C++14)

```cpp
#include <iostream>
#include <functional>

int main() {
    // 재귀적 람다 함수 (팩토리얼 계산)
    std::function<int(int)> factorial = [&factorial](int n) {
        return (n <= 1) ? 1 : n * factorial(n - 1);
    };
    
    std::cout << "5! = " << factorial(5) << std::endl;  // 120
    
    // C++14 방식의 재귀적 람다
    auto factorial_cpp14 = [](auto self, int n) -> int {
        return (n <= 1) ? 1 : n * self(self, n - 1);
    };
    
    std::cout << "6! = " << factorial_cpp14(factorial_cpp14, 6) << std::endl;  // 720
    
    return 0;
}
```

## 면접 질문

### Q1: 람다 함수와 일반 함수 객체(Functor)의 차이점은 무엇인가요?
**A:** 람다 함수는 익명의 함수 객체를 간결하게 정의할 수 있는 문법적 편의성을 제공합니다. 내부적으로는 컴파일러가 람다 표현식을 고유한 클래스 타입의 함수 객체로 변환합니다. 일반 함수 객체는 명시적으로 클래스를 정의하고 `operator()`를 구현해야 하지만, 람다는 이러한 보일러플레이트 코드 없이 인라인으로 함수 객체를 정의할 수 있습니다.

### Q2: 값 캡처와 참조 캡처의 차이점과 각각 언제 사용해야 하나요?
**A:** 
- **값 캡처(`[x]`)**: 외부 변수의 복사본을 생성하여 람다 내부에서 사용합니다. 람다가 호출될 때 원본 변수가 소멸되거나 변경되어도 안전하게 사용할 수 있습니다.
- **참조 캡처(`[&x]`)**: 외부 변수에 대한 참조를 유지합니다. 원본 변수의 값을 수정할 수 있지만, 람다가 호출될 때 참조된 변수가 반드시 유효해야 합니다.

값 캡처는 람다의 수명이 캡처된 변수보다 길 경우나 스레드 간에 람다를 전달할 때 안전합니다. 참조 캡처는 큰 객체를 복사하지 않고 효율적으로 사용하거나, 람다 내에서 외부 변수를 수정해야 할 때 유용합니다.

### Q3: 람다 함수를 사용할 때의 주의사항은 무엇인가요?
**A:** 
1. 참조로 캡처된 변수가 람다의 호출 시점에 유효해야 합니다(댕글링 참조 방지).
2. 기본적으로 값으로 캡처된 변수는 불변(const)이며, 수정하려면 `mutable` 키워드가 필요합니다.
3. 각 람다는 고유한 타입을 가집니다. 동일한 시그니처의 여러 람다를 저장하려면 `std::function`을 사용해야 합니다.
4. 캡처는 람다 정의 시점의 변수 값을 사용합니다. 람다 정의 후 변수가 변경되어도 값 캡처된 람다 내부의 값은 변경되지 않습니다.
5. 재귀적 람다는 자기 자신을 참조로 캡처하거나 `std::function`을 사용해야 합니다.

### Q4: C++14와 C++17에서 람다 함수의 주요 개선점은 무엇인가요?
**A:**
- **C++14**: 
  - 제네릭 람다 (`auto` 매개변수)
  - 초기화 캡처 (람다 캡처 시 이동 의미론 지원)
  - 반환 타입 추론 개선

- **C++17**:
  - `constexpr` 람다 함수
  - 캡처된 `*this`
  - 람다 컨텍스트에서 `this` 암시적 캡처 제거

### Q5: 람다 함수가 성능에 미치는 영향은 무엇인가요?
**A:** 람다 함수는 일반적으로 인라인화되므로 함수 포인터보다 성능이 우수합니다. 값으로 캡처하는 경우 복사 비용이 발생할 수 있지만, 참조로 캡처하면 이 비용을 줄일 수 있습니다. 최신 컴파일러에서는 람다를 일반 함수 객체로 최적화하여 오버헤드가 거의 없습니다. 단, `std::function`으로 람다를 저장할 경우 약간의 간접 호출 비용이 발생할 수 있습니다.

## 실무 활용

### 1. 정렬 및 필터링

람다 함수는 STL 알고리즘과 함께 사용하여 복잡한 정렬 및 필터링 로직을 간결하게 표현할 수 있습니다:

```cpp
// 사용자 정의 객체 정렬
std::sort(users.begin(), users.end(), [](const User& a, const User& b) {
    if (a.last_name != b.last_name)
        return a.last_name < b.last_name;
    return a.first_name < b.first_name;
});

// 특정 조건에 맞는 요소 필터링
auto premium_users = std::count_if(users.begin(), users.end(), [](const User& u) {
    return u.subscription_type == "premium" && u.active;
});
```

### 2. 비동기 프로그래밍 및 콜백

람다 함수는 비동기 작업의 콜백으로 자주 사용됩니다:

```cpp
// 비동기 작업 완료 후 콜백
async_operation(data, [](Result result, Error error) {
    if (error) {
        handle_error(error);
        return;
    }
    process_result(result);
});
```

### 3. 지연 평가(Lazy Evaluation)

람다를 사용하여 필요할 때만 계산하는 지연 평가 패턴을 구현할 수 있습니다:

```cpp
template<typename F>
class lazy_val {
    F computation;
    mutable bool cached = false;
    mutable std::decay_t<std::result_of_t<F()>> value;
public:
    lazy_val(F f) : computation(std::move(f)) {}
    
    const auto& get() const {
        if (!cached) {
            value = computation();
            cached = true;
        }
        return value;
    }
};

// 사용 예제
auto expensive_result = lazy_val([]() {
    return perform_expensive_calculation();
});

// 실제로 필요할 때만 계산됨
if (condition) {
    use_result(expensive_result.get());
}
```

### 4. 범위 제한 실행

람다를 사용하여 특정 범위 내에서만 리소스를 사용하는 패턴을 구현할 수 있습니다:

```cpp
template<typename F>
auto with_lock(std::mutex& m, F&& func) {
    std::lock_guard<std::mutex> lock(m);
    return func();
}

std::mutex data_mutex;
// 잠금이 필요한 코드만 람다로 실행
auto result = with_lock(data_mutex, [&]() {
    shared_data.modify();
    return shared_data.get_value();
});
``` 