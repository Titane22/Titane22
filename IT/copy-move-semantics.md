---
layout: page
title: Copy와 Move Semantics
description: >
  C++의 복사와 이동 의미론에 대한 상세 설명 및 Rule of 3/5/0 개념 설명
hide_description: false
---

## 핵심 개념

### 복사(Copy)와 이동(Move)의 기본 개념

- **복사(Copy)**: 객체의 모든 내용을 새로운 메모리 공간에 복제
- **이동(Move)**: 객체의 리소스 소유권을 다른 객체로 전달(리소스를 "훔쳐오듯" 이전)

### Rule of 3/5/0

C++의 역사와 발전 과정에 따라 생겨난 개념으로, 객체의 리소스 관리 방법을 설계할 때 고려해야 할 규칙입니다.

#### Rule of Three (C++98 기준)

가장 먼저 정립된 개념으로, 다음 세 가지 특수 함수 중 하나라도 직접 정의한다면 나머지 둘도 함께 정의해야 한다는 규칙입니다.

1. **복사 생성자 (Copy Constructor)**
2. **복사 대입 연산자 (Copy Assignment Operator)**
3. **소멸자 (Destructor)**

**이유**: 리소스를 직접 관리하는 클래스라면 (예: 동적 메모리 할당) 세 함수 모두 올바른 리소스 관리가 필요합니다.

#### Rule of Five (C++11 이후)

C++11에서 이동 의미론(Move Semantics)이 도입되며, 다음 두 함수가 추가되었습니다.

1. **이동 생성자 (Move Constructor)**
2. **이동 대입 연산자 (Move Assignment Operator)**

**요점**: 리소스를 직접 소유하는 객체는 위의 5가지 함수를 모두 신중하게 구현하거나, 명시적으로 삭제(delete)해야 합니다.

#### Rule of Zero (모던 C++, C++11/17/20 철학)

현대 C++에서는 스마트 포인터와 표준 컨테이너 등으로 리소스 관리가 자동화되면서, 가능하면 특수 함수를 직접 정의하지 않는 것이 권장됩니다.

**핵심**: RAII, `std::unique_ptr`, `std::vector` 등을 활용해 사용자가 리소스를 직접 다루지 않아도 되는 설계를 추구합니다.

### lvalue와 rvalue

- **lvalue**: 이름이 있고 주소를 취할 수 있는 표현식 (일반적인 변수)
- **rvalue**: 이름이 없는 임시 값 (리터럴, 임시 객체 등)

## 예시 코드

### 복사 생성자와 복사 대입 연산자

```cpp
class MyString {
private:
    char* data;
    size_t length;

public:
    // 생성자
    MyString(const char* str) {
        length = strlen(str);
        data = new char[length + 1];
        strcpy(data, str);
    }

    // 소멸자
    ~MyString() {
        delete[] data;
    }

    // 복사 생성자 (깊은 복사)
    MyString(const MyString& other) {
        length = other.length;
        data = new char[length + 1];
        strcpy(data, other.data);
        std::cout << "Copy constructor called\n";
    }

    // 복사 대입 연산자 (깊은 복사)
    MyString& operator=(const MyString& other) {
        if (this != &other) {  // 자기 자신 대입 검사
            delete[] data;     // 기존 리소스 해제
            
            length = other.length;
            data = new char[length + 1];
            strcpy(data, other.data);
        }
        std::cout << "Copy assignment operator called\n";
        return *this;
    }
};
```

### 이동 생성자와 이동 대입 연산자

```cpp
class MyString {
private:
    char* data;
    size_t length;

public:
    // 이전 코드에 추가...

    // 이동 생성자
    MyString(MyString&& other) noexcept : data(other.data), length(other.length) {
        other.data = nullptr;  // 원본 객체의 자원을 "훔쳐옴"
        other.length = 0;
        std::cout << "Move constructor called\n";
    }

    // 이동 대입 연산자
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;  // 기존 리소스 해제
            
            // 리소스 이동
            data = other.data;
            length = other.length;
            
            // 원본 객체 초기화
            other.data = nullptr;
            other.length = 0;
        }
        std::cout << "Move assignment operator called\n";
        return *this;
    }
};
```

### Rule of Three 구현 예시

```cpp
class ResourceHandler {
private:
    Resource* resource;

public:
    // 생성자
    ResourceHandler(int id) : resource(new Resource(id)) {}

    // 소멸자
    ~ResourceHandler() {
        delete resource;
    }

    // 복사 생성자
    ResourceHandler(const ResourceHandler& other) 
        : resource(new Resource(*other.resource)) {}

    // 복사 대입 연산자
    ResourceHandler& operator=(const ResourceHandler& other) {
        if (this != &other) {
            delete resource;
            resource = new Resource(*other.resource);
        }
        return *this;
    }
};
```

### Rule of Five 구현 예시

```cpp
class ResourceHandler {
private:
    Resource* resource;

public:
    // 생성자
    ResourceHandler(int id) : resource(new Resource(id)) {}

    // 소멸자
    ~ResourceHandler() {
        delete resource;
    }

    // 복사 생성자
    ResourceHandler(const ResourceHandler& other) 
        : resource(new Resource(*other.resource)) {}

    // 복사 대입 연산자
    ResourceHandler& operator=(const ResourceHandler& other) {
        if (this != &other) {
            delete resource;
            resource = new Resource(*other.resource);
        }
        return *this;
    }

    // 이동 생성자
    ResourceHandler(ResourceHandler&& other) noexcept 
        : resource(other.resource) {
        other.resource = nullptr;
    }

    // 이동 대입 연산자
    ResourceHandler& operator=(ResourceHandler&& other) noexcept {
        if (this != &other) {
            delete resource;
            resource = other.resource;
            other.resource = nullptr;
        }
        return *this;
    }
};
```

### Rule of Zero 구현 예시

```cpp
class ResourceHandler {
private:
    std::unique_ptr<Resource> resource;  // 자원 관리를 스마트 포인터에 위임

public:
    ResourceHandler(int id) : resource(std::make_unique<Resource>(id)) {}
    
    // 특수 함수 정의 없음: 컴파일러가 적절한 함수 자동 생성
    // 소멸자, 복사/이동 생성자, 복사/이동 대입 연산자 모두 자동 처리됨
};
```

## 이동 의미론 활용 시나리오

### 1. 큰 컨테이너 반환

```cpp
std::vector<int> createLargeVector() {
    std::vector<int> result(1000000, 42);
    // C++11 이후: 이동 의미론으로 복사 비용 최소화
    return result;
}

void useVector() {
    // 이동 생성자 호출: 대용량 데이터 복사 없음
    std::vector<int> v = createLargeVector();
}
```

### 2. std::move 활용

```cpp
std::unique_ptr<Resource> source(new Resource(100));
std::unique_ptr<Resource> destination;

// std::move로 소유권 이전
destination = std::move(source);  // source는 이제 nullptr
```

### 3. 임시 객체 최적화

```cpp
class Widget {
    std::vector<int> data;

public:
    // 임시 객체를 효율적으로 처리
    void setData(std::vector<int>&& newData) {
        data = std::move(newData);  // 이동 대입 사용
    }
};

Widget w;
std::vector<int> temp = {1, 2, 3, 4, 5};
w.setData(std::move(temp));  // temp의 데이터를 이동
```

## 면접 질문과 답변

### Q: Rule of Five란 무엇인가요?

A: Rule of Five는 C++11에서 도입된 개념으로, 리소스를 직접 관리하는 클래스가 다음 5가지 특수 함수를 모두 제대로 정의해야 한다는 규칙입니다:

1. 소멸자
2. 복사 생성자
3. 복사 대입 연산자
4. 이동 생성자
5. 이동 대입 연산자

이 규칙은 기존 C++98의 "Rule of Three"에 이동 의미론 관련 함수가 추가된 것입니다. 이는 리소스 관리가 필요한 클래스에서 이동 연산을 제대로 지원하도록 보장합니다.

### Q: 이동 생성자(Move Constructor)는 언제 호출되나요?

A: 이동 생성자는 다음과 같은 상황에서 호출됩니다:

1. 객체가 rvalue를 사용하여 초기화될 때:
   ```cpp
   MyClass a = std::move(b);  // 명시적으로 이동
   MyClass a = MyClass();     // 임시 객체로부터 초기화
   ```

2. 함수에서 객체를 반환할 때(Return Value Optimization이 적용되지 않는 경우):
   ```cpp
   MyClass createObject() { return MyClass(); }
   MyClass obj = createObject();
   ```

3. `std::move`를 사용하여 명시적으로 이동을 지시할 때:
   ```cpp
   std::vector<MyClass> vec;
   MyClass obj;
   vec.push_back(std::move(obj));
   ```

### Q: 복사 생성자와 이동 생성자의 차이점은 무엇인가요?

A: 
- **복사 생성자**는 원본 객체의 내용을 새로운 메모리에 복제하여 객체의 새 인스턴스를 만듭니다. 원본 객체는 변경되지 않습니다.
- **이동 생성자**는 원본 객체의 리소스 소유권을 새 객체로 이전합니다. 이 과정에서 원본 객체의 리소스는 "훔쳐와서" 새 객체로 이동하고, 원본 객체는 유효하지만 리소스가 없는 상태로 남게 됩니다.

### Q: noexcept 키워드가 이동 연산에서 중요한 이유는 무엇인가요?

A: 이동 연산에 `noexcept` 키워드를 사용하는 것은 다음과 같은 이유로 중요합니다:

1. 표준 라이브러리 컨테이너(특히 `std::vector`)는 예외 안전성을 위해 이동 연산이 예외를 던지지 않을 때만 이동 연산을 사용합니다.
2. `noexcept`가 없으면 컨테이너는 보수적으로 복사 연산을 사용하게 되어 성능 저하가 발생합니다.
3. 리소스 이동은 일반적으로 예외를 던지지 않기 때문에, 이동 연산에 `noexcept`를 표시하는 것이 자연스럽고 효율적입니다.

## 실용적 활용 사례

### 사례 1: 대용량 데이터 컨테이너 최적화

```cpp
class DataContainer {
private:
    std::vector<double> data;

public:
    // 생성자
    DataContainer(size_t size) : data(size) {}

    // 이동 생성자로 효율적인 컨테이너 이동
    DataContainer(DataContainer&& other) noexcept 
        : data(std::move(other.data)) {}

    // 이동 대입 연산자
    DataContainer& operator=(DataContainer&& other) noexcept {
        if (this != &other) {
            data = std::move(other.data);
        }
        return *this;
    }

    // 데이터 처리 메서드
    void process() {
        // 데이터 처리 로직
    }
};

// 사용 예
void processLargeData() {
    DataContainer source(1000000);
    
    // 이동 연산으로 대용량 데이터 효율적 이전
    DataContainer destination = std::move(source);
    
    // source는 이제 비어있고, destination이 데이터를 소유
    destination.process();
}
```

### 사례 2: 리소스 핸들러 클래스

```cpp
class DatabaseConnection {
private:
    DBConnection* connection;
    bool connected;

public:
    // 생성자
    DatabaseConnection(const std::string& connectionString) 
        : connection(nullptr), connected(false) {
        connection = DBConnect(connectionString.c_str());
        if (connection) connected = true;
    }

    // 소멸자
    ~DatabaseConnection() {
        if (connected && connection) {
            DBDisconnect(connection);
        }
    }

    // 복사 방지
    DatabaseConnection(const DatabaseConnection&) = delete;
    DatabaseConnection& operator=(const DatabaseConnection&) = delete;

    // 이동 생성자
    DatabaseConnection(DatabaseConnection&& other) noexcept 
        : connection(other.connection), connected(other.connected) {
        other.connection = nullptr;
        other.connected = false;
    }

    // 이동 대입 연산자
    DatabaseConnection& operator=(DatabaseConnection&& other) noexcept {
        if (this != &other) {
            // 기존 연결 정리
            if (connected && connection) {
                DBDisconnect(connection);
            }
            
            // 리소스 이동
            connection = other.connection;
            connected = other.connected;
            
            // 원본 객체 초기화
            other.connection = nullptr;
            other.connected = false;
        }
        return *this;
    }

    // 쿼리 실행 메서드
    bool executeQuery(const std::string& query) {
        if (!connected || !connection) return false;
        return DBExecuteQuery(connection, query.c_str());
    }
};
```

### 사례 3: 스마트 포인터 활용 (Rule of Zero)

```cpp
class ModernResourceHandler {
private:
    std::unique_ptr<Resource> resource;
    std::vector<int> data;
    std::string name;

public:
    ModernResourceHandler(const std::string& resourceName, int resourceId) 
        : resource(std::make_unique<Resource>(resourceId)),
          name(resourceName) {
        // 초기화 코드
    }

    // Rule of Zero: 특수 함수를 명시적으로 선언하지 않음
    // 컴파일러가 적절한 이동/복사 연산을 자동으로 생성
    
    void processResource() {
        if (resource) {
            // 리소스 처리 로직
        }
    }
};
```

## 최적화 팁과 권장 사항

1. **가능하면 Rule of Zero 사용**: 직접 리소스를 관리하는 대신 표준 라이브러리 컨테이너와 스마트 포인터를 활용하세요.

2. **이동 연산에 noexcept 표시**: 표준 라이브러리 컨테이너가 최적화를 수행할 수 있도록 이동 연산에 `noexcept`를 사용하세요.

3. **값에 의한 전달과 반환 사용**: 현대 C++에서는 이동 의미론 덕분에 값으로 객체를 전달하고 반환하는 것이 효율적일 수 있습니다.

4. **불필요한 복사 제거**: `std::move`를 적절히 사용하여 불필요한 복사를 이동으로 대체하세요.

5. **복사/이동 연산자에서 자기 대입 검사**: `if (this != &other)` 구문으로 자기 대입을 확인하세요.

6. **std::move와 std::forward 구분**: `std::move`는 무조건 이동이고, `std::forward`는 조건부 이동(완벽한 전달)입니다.

7. **깊은 이동을 위한 재귀적 std::move 사용**: 객체의 모든 멤버에 `std::move`를 적용하여 깊은 이동을 구현하세요.

## 결론

복사와 이동 의미론은 C++ 프로그래밍에서 성능과 리소스 관리를 최적화하는 데 핵심적인 개념입니다. Rule of 3/5/0의 이해와 적절한 적용을 통해 메모리 누수를 방지하고 효율적인 코드를 작성할 수 있습니다. 현대적인 C++ 코드에서는 가능한 한 직접 리소스 관리를 피하고 표준 라이브러리 컨테이너와 스마트 포인터를 활용하는 Rule of Zero 접근 방식이 권장됩니다. 