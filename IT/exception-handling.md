---
layout: page
title: 예외 처리(Exception Handling)
description: >
  C++의 예외 처리 메커니즘, try-catch 블록, throw 표현식, noexcept 지정자 및 예외 안전성
hide_description: false
---

## 핵심 개념

### 예외 처리 기본 구조

C++의 예외 처리는 `try`, `catch`, `throw` 키워드를 사용하여 구현됩니다. 이 메커니즘을 통해 오류 발생 지점과 처리 지점을 분리하여 코드의 가독성과 유지보수성을 향상시킬 수 있습니다.

```cpp
try {
    // 예외가 발생할 수 있는 코드
    if (/* 오류 조건 */) {
        throw 예외객체;  // 예외 발생
    }
} catch (예외타입1 e) {
    // 예외타입1을 처리하는 코드
} catch (예외타입2 e) {
    // 예외타입2를 처리하는 코드
} catch (...) {
    // 모든 예외를 처리하는 코드
}
```

### 표준 예외 계층 구조

C++ 표준 라이브러리는 `<stdexcept>` 헤더에 다양한 예외 클래스를 제공합니다. 이 클래스들은 모두 `std::exception` 클래스를 상속받습니다.

```cpp
#include <stdexcept>

// 주요 표준 예외 클래스
// std::exception - 모든 표준 예외의 기본 클래스
// std::logic_error - 프로그램 논리 오류
//   - std::invalid_argument
//   - std::domain_error
//   - std::length_error
//   - std::out_of_range
// std::runtime_error - 실행 시간에 발견되는 오류
//   - std::range_error
//   - std::overflow_error
//   - std::underflow_error
```

### 사용자 정의 예외

표준 예외 클래스를 상속하여 사용자 정의 예외를 만들 수 있습니다:

```cpp
class MyException : public std::exception {
private:
    std::string message;
    
public:
    MyException(const std::string& msg) : message(msg) {}
    
    // what() 메서드를 오버라이드하여 예외 메시지 제공
    const char* what() const noexcept override {
        return message.c_str();
    }
};
```

### noexcept 지정자

C++11에서 도입된 `noexcept` 지정자는 함수가 예외를 발생시키지 않음을 명시합니다. 이는 컴파일러 최적화와 코드의 안정성을 향상시킵니다.

```cpp
// 절대 예외를 던지지 않는 함수
void safeFunction() noexcept {
    // 예외를 발생시키지 않는 코드
}

// 조건부 noexcept (표현식이 true일 때만 noexcept)
template <typename T>
void process(T value) noexcept(std::is_integral<T>::value) {
    // 정수 타입일 경우에만 noexcept가 적용됨
}
```

### 예외 안전성 보장 수준

예외 안전성(Exception Safety)은 예외 발생 시 프로그램의 상태를 얼마나 잘 유지하는지를 나타냅니다. 일반적으로 세 가지 수준의 보장이 있습니다:

1. **기본 보장(Basic Guarantee)**: 예외 발생 시, 프로그램은 유효한 상태를 유지하지만, 어떤 상태인지는 예측할 수 없습니다.
   
2. **강한 보장(Strong Guarantee)**: 예외 발생 시, 프로그램은 연산 전의 상태로 정확히 되돌아갑니다(원자적 연산).
   
3. **예외 없음 보장(No-throw Guarantee)**: 함수가 절대 예외를 발생시키지 않습니다.

```cpp
// 강한 보장 예제 - 복사 후 교체(copy-and-swap) 패턴
void Vector::push_back(const T& value) {
    // 1. 새로운 메모리 할당 (예외 발생 가능)
    // 2. 새 메모리에 데이터 복사 (예외 발생 가능)
    // 3. 포인터 교체 (예외 발생 안 함)
    
    // 예외가 1,2단계에서 발생하더라도, 원본 벡터는 변경되지 않음
}
```

## 실용적인 예제

### 예제 1: 기본 예외 처리

```cpp
#include <iostream>
#include <stdexcept>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    try {
        // 범위를 벗어난 인덱스에 접근 시도
        std::cout << "접근 시도: " << numbers.at(10) << std::endl;
    } catch (const std::out_of_range& e) {
        std::cerr << "예외 발생: " << e.what() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "다른 예외 발생: " << e.what() << std::endl;
    } catch (...) {
        std::cerr << "알 수 없는 예외 발생!" << std::endl;
    }
    
    std::cout << "프로그램이 정상적으로 계속 실행됩니다." << std::endl;
    
    return 0;
}
```

### 예제 2: 사용자 정의 예외와 함수 간 예외 전파

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

// 사용자 정의 예외
class DivisionByZeroException : public std::exception {
public:
    const char* what() const noexcept override {
        return "0으로 나눌 수 없습니다";
    }
};

class NegativeDivisorException : public std::exception {
private:
    std::string message;
    
public:
    NegativeDivisorException(int divisor) {
        message = "음수 값으로 나눌 수 없습니다: " + std::to_string(divisor);
    }
    
    const char* what() const noexcept override {
        return message.c_str();
    }
};

// 예외를 발생시키는 함수
double safeDivide(double a, int b) {
    if (b == 0) {
        throw DivisionByZeroException();
    }
    
    if (b < 0) {
        throw NegativeDivisorException(b);
    }
    
    return a / b;
}

// 예외를 처리하는 함수
void processDivision(double a, int b) {
    try {
        double result = safeDivide(a, b);
        std::cout << a << " / " << b << " = " << result << std::endl;
    } catch (const DivisionByZeroException& e) {
        std::cerr << "오류: " << e.what() << std::endl;
    } catch (const NegativeDivisorException& e) {
        std::cerr << "오류: " << e.what() << std::endl;
    }
}

int main() {
    processDivision(10.0, 2);  // 정상 출력: 10 / 2 = 5
    processDivision(10.0, 0);  // 예외 처리: 0으로 나눌 수 없습니다
    processDivision(10.0, -2); // 예외 처리: 음수 값으로 나눌 수 없습니다: -2
    
    return 0;
}
```

### 예제 3: 리소스 관리와 예외 안전성

```cpp
#include <iostream>
#include <memory>
#include <fstream>
#include <stdexcept>

// 예외 안전하지 않은 방식 (문제점: 예외 발생 시 메모리 누수)
void unsafeFunction() {
    int* data = new int[1000];  // 자원 할당
    
    // 예외가 발생할 수 있는 코드
    std::ifstream file("data.txt");
    if (!file) {
        throw std::runtime_error("파일을 열 수 없습니다");
        // 여기서 예외가 발생하면 delete[]가 호출되지 않음 -> 메모리 누수
    }
    
    // 정상 처리 후 자원 해제
    delete[] data;
}

// RAII를 사용한 예외 안전한 방식
void safeFunction() {
    // 스마트 포인터로 자동 자원 관리
    std::unique_ptr<int[]> data(new int[1000]);
    
    // 예외가 발생해도 data는 자동으로 해제됨
    std::ifstream file("data.txt");
    if (!file) {
        throw std::runtime_error("파일을 열 수 없습니다");
    }
    
    // 정상 처리 (명시적 해제 필요 없음)
}

int main() {
    try {
        // unsafeFunction();  // 메모리 누수 가능성
        safeFunction();      // 항상 자원 해제 보장
    } catch (const std::exception& e) {
        std::cerr << "예외 발생: " << e.what() << std::endl;
    }
    
    return 0;
}
```

### 예제 4: noexcept의 실용적 사용

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <stdexcept>

// 예외를 발생시키지 않는 함수
void processData(const std::vector<int>& data) noexcept {
    for (int value : data) {
        std::cout << value << " ";
    }
    std::cout << std::endl;
}

// 조건부 noexcept
template <typename T>
void swap(T& a, T& b) noexcept(noexcept(T(std::move(T())))) {
    T temp = std::move(a);
    a = std::move(b);
    b = std::move(temp);
}

// noexcept 검사
template <typename T>
void optimizedProcess(T& container) {
    if constexpr (noexcept(container.resize(0))) {
        // 예외를 발생시키지 않는 최적화된 경로
        container.resize(0);
        std::cout << "예외를 발생시키지 않는 resize 호출" << std::endl;
    } else {
        // 예외를 발생시킬 수 있는 경우 다른 방법 사용
        while (!container.empty()) {
            container.pop_back();
        }
        std::cout << "안전한 방법으로 컨테이너 비우기" << std::endl;
    }
}

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5};
    
    // noexcept 함수 호출
    processData(data);
    
    // 조건부 noexcept 함수 호출
    int a = 5, b = 10;
    swap(a, b);
    std::cout << "a = " << a << ", b = " << b << std::endl;
    
    // noexcept 표현식 활용
    optimizedProcess(data);
    
    return 0;
}
```

### 예제 5: 스택 풀기(Stack Unwinding)와 소멸자

```cpp
#include <iostream>
#include <string>

class Resource {
private:
    std::string name;
    
public:
    Resource(const std::string& n) : name(n) {
        std::cout << "Resource " << name << " 생성됨" << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource " << name << " 해제됨" << std::endl;
    }
};

void function3() {
    Resource r3("level3");
    std::cout << "function3 실행 중..." << std::endl;
    throw std::runtime_error("function3에서 예외 발생");
    // 이 지점은 실행되지 않음
    std::cout << "function3 종료" << std::endl;
}

void function2() {
    Resource r2("level2");
    std::cout << "function2 실행 중..." << std::endl;
    function3();
    // 예외가 발생하면 이 지점은 실행되지 않음
    std::cout << "function2 종료" << std::endl;
}

void function1() {
    Resource r1("level1");
    std::cout << "function1 실행 중..." << std::endl;
    
    try {
        function2();
    } catch (const std::exception& e) {
        std::cout << "예외 포착: " << e.what() << std::endl;
    }
    
    std::cout << "function1 종료" << std::endl;
}

int main() {
    std::cout << "프로그램 시작" << std::endl;
    function1();
    std::cout << "프로그램 종료" << std::endl;
    
    return 0;
}
```

## 면접 질문

### Q1: C++에서 예외 처리의 주요 이점은 무엇인가요?
**A:** C++ 예외 처리의 주요 이점은 다음과 같습니다:
1. **오류 처리 분리**: 오류 감지 코드와 처리 코드를 분리하여 가독성을 높입니다.
2. **전파 메커니즘**: 함수 호출 스택을 통해 오류가 자동으로 전파되어, 적절한 수준에서 처리할 수 있습니다.
3. **타입 안전성**: 다양한 타입의 예외를 처리할 수 있어 오류의 종류에 따라 다른 대응이 가능합니다.
4. **자원 정리**: 스택 풀기 과정에서 지역 객체의 소멸자가 호출되어 자원이 자동으로 정리됩니다.
5. **오류 무시 방지**: 반환 값을 통한 오류 전달과 달리, 예외는 명시적으로 처리하지 않으면 프로그램이 종료됩니다.

### Q2: noexcept의 용도는 무엇인가요?
**A:** `noexcept` 지정자의 주요 용도는 다음과 같습니다:
1. **최적화 기회 제공**: 컴파일러에게 함수가 예외를 발생시키지 않음을 알려 더 효율적인 코드를 생성할 수 있게 합니다.
2. **이동 연산 최적화**: 특히 이동 생성자와 이동 대입 연산자에서 중요하며, 표준 라이브러리는 `noexcept` 함수를 선호합니다.
3. **예외 전파 차단**: 함수에서 예외가 발생하면 `std::terminate`가 호출되어 프로그램이 종료됩니다.
4. **코드 계약**: 개발자에게 함수의 예외 안전성에 대한 정보를 명확히 전달합니다.
5. **조건부 컴파일**: `noexcept` 연산자를 사용하여 컴파일 타임에 코드 경로를 선택할 수 있습니다.

### Q3: 예외 안전성(Exception Safety)이란 무엇이며, 다양한 수준의 예외 안전성을 설명해 주세요.
**A:** 예외 안전성은 예외가 발생했을 때 프로그램이 어떻게 동작하는지에 대한 보장을 의미합니다. 세 가지 주요 수준이 있습니다:

1. **기본 보장(Basic Guarantee)**: 예외 발생 시 자원 누수가 없고, 객체는 유효한 상태를 유지하지만 정확히 어떤 상태인지는 예측할 수 없습니다.

2. **강한 보장(Strong Guarantee)**: 예외 발생 시 프로그램의 상태가 함수 호출 이전 상태로 정확히 되돌아갑니다. "원자적 연산" 또는 "실패 시 변경 없음(commit-or-rollback)" 의미론이라고도 합니다. 

3. **예외 없음 보장(No-throw Guarantee)**: 함수가 절대 예외를 발생시키지 않음을 보장합니다. 중요한 소멸자, 이동 생성자, 스왑 함수 등에 필요합니다.

대부분의 경우 강한 보장을 목표로 하되, 성능 문제가 있는 경우 명확한 문서화와 함께 기본 보장으로 타협하기도 합니다.

### Q4: 예외 처리 시 주의해야 할 함정은 무엇인가요?
**A:** 예외 처리 시 주의해야 할 주요 함정은 다음과 같습니다:
1. **자원 누수**: 예외 발생 시 자원이 해제되지 않는 문제. RAII 패턴으로 해결할 수 있습니다.
2. **소멸자에서의 예외**: 스택 풀기 중 소멸자에서 예외가 발생하면 `std::terminate`가 호출됩니다. 소멸자는 `noexcept`가 기본값입니다.
3. **예외 스와핑**: 하나의 예외를 처리하는 도중 다른 예외가 발생하면 첫 번째 예외 정보가 손실됩니다.
4. **과도한 try-catch**: 모든 함수에 try-catch를 사용하면 코드가 복잡해지고 가독성이 떨어집니다.
5. **예외 사양 부작용**: C++11 이전의 동적 예외 사양(`throw(타입)`)은 런타임 비용이 높고 유지보수가 어려워 C++17에서 제거되었습니다.

### Q5: C++11에서 동적 예외 사양(Dynamic Exception Specification)과 noexcept의 차이점은 무엇인가요?
**A:** 동적 예외 사양(`throw(타입)`)과 `noexcept`의 주요 차이점은 다음과 같습니다:
1. **컴파일 타임 vs 런타임 검사**: `noexcept`는 주로 컴파일 타임 검사를 제공하지만, 동적 예외 사양은 런타임 검사를 수행합니다.
2. **성능**: `noexcept`는 런타임 오버헤드가 없지만, 동적 예외 사양은 런타임 검사로 인한 오버헤드가 있습니다.
3. **처리 방식**: 동적 예외 사양을 위반하면 `std::unexpected`가 호출되고, `noexcept`를 위반하면 `std::terminate`가 직접 호출됩니다.
4. **지원 상태**: 동적 예외 사양은 C++17에서 제거되었지만, `noexcept`는 현재 C++ 표준의 권장 기능입니다.
5. **표현력**: `noexcept`는 조건부 버전(`noexcept(조건)`)을 통해 더 유연한 예외 보장을 표현할 수 있습니다.

## 실무 활용

### 1. 예외를 활용한 오류 처리 패턴

C++에서 예외는 다음과 같은 상황에서 효과적으로 사용할 수 있습니다:

```cpp
// 생성자에서의 예외 처리
class Connection {
public:
    Connection(const std::string& address) {
        if (!isValidAddress(address)) {
            throw std::invalid_argument("유효하지 않은 주소: " + address);
        }
        
        if (!connect(address)) {
            throw std::runtime_error("연결 실패: " + address);
        }
        
        // 연결 성공
    }
    
    ~Connection() {
        disconnect();  // 항상 실행됨 (예외 발생하지 않아야 함)
    }
    
private:
    bool isValidAddress(const std::string& address) { /* 구현 */ }
    bool connect(const std::string& address) { /* 구현 */ }
    void disconnect() noexcept { /* 구현 */ }
};

// 사용 예:
void processData() {
    try {
        Connection conn("example.com");
        // 연결 사용
    } catch (const std::exception& e) {
        // 연결 실패 처리
        logError(e.what());
    }
    // Connection의 소멸자는 항상 호출됨
}
```

### 2. 함수 시도 패턴(Function Try Block)

생성자에서 초기화 목록의 예외를 처리하기 위한 패턴:

```cpp
class Widget {
private:
    Resource resource;
    
public:
    // 함수 try 블록
    Widget(const std::string& name)
    try : resource(name) {
        // 생성자 본문
        std::cout << "Widget 생성 완료" << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Widget 생성 실패: " << e.what() << std::endl;
        // 여기서 다시 예외를 던지거나 변환할 수 있음
        throw;  // 호출자에게 예외 전파
    }
};
```

### 3. 예외 변환 패턴

저수준 예외를 더 의미 있는 고수준 예외로 변환하는 패턴:

```cpp
class DatabaseException : public std::runtime_error {
public:
    DatabaseException(const std::string& msg) 
        : std::runtime_error(msg) {}
};

class RecordNotFoundException : public DatabaseException {
public:
    RecordNotFoundException(int id) 
        : DatabaseException("레코드를 찾을 수 없음: " + std::to_string(id)) {}
};

// 예외 변환 예
Record findRecord(int id) {
    try {
        // 저수준 API 호출
        return lowLevelFindRecord(id);
    } catch (const LowLevelFileException& e) {
        // 더 의미 있는 고수준 예외로 변환
        throw RecordNotFoundException(id);
    } catch (const std::exception& e) {
        // 기타 예외를 데이터베이스 예외로 변환
        throw DatabaseException(std::string("데이터베이스 오류: ") + e.what());
    }
}
```

### 4. RAII와 예외 안전성

`std::lock_guard`와 같은 RAII 패턴을 구현한 클래스:

```cpp
template <typename Mutex>
class LockGuard {
private:
    Mutex& mutex_;
    bool locked_;
    
public:
    explicit LockGuard(Mutex& mutex) 
        : mutex_(mutex), locked_(true) {
        mutex_.lock();
    }
    
    ~LockGuard() noexcept {
        if (locked_) {
            mutex_.unlock();
        }
    }
    
    void unlock() {
        if (locked_) {
            mutex_.unlock();
            locked_ = false;
        }
    }
    
    // 복사/이동 방지
    LockGuard(const LockGuard&) = delete;
    LockGuard& operator=(const LockGuard&) = delete;
};

// 사용 예:
void updateSharedData() {
    LockGuard<std::mutex> lock(dataMutex);
    
    // 예외가 발생해도 잠금은 자동으로 해제됨
    processSharedData();
}
```

### 5. noexcept 활용한 예외 안전성 최적화

이동 생성자와 이동 대입 연산자에서의 `noexcept` 활용:

```cpp
class String {
private:
    char* data_;
    size_t size_;
    
public:
    // 이동 생성자 - noexcept로 최적화
    String(String&& other) noexcept 
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }
    
    // 이동 대입 연산자 - noexcept로 최적화
    String& operator=(String&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }
    
    // 다른 메서드...
};

// 벡터에서 재할당 시 최적화됨
std::vector<String> strings;
strings.push_back(String("example"));  // 효율적인 이동 연산 사용
``` 