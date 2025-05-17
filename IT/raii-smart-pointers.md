---
layout: page
title: RAII와 스마트 포인터
description: >
  C++의 자원 관리 패턴과 스마트 포인터의 종류 및 활용법에 대한 상세 설명
hide_description: false
---

# RAII와 스마트 포인터

## RAII 개념

RAII(Resource Acquisition Is Initialization)는 C++의 핵심 자원 관리 패턴으로, 리소스의 할당과 해제를 객체의 생명 주기와 연결하는 프로그래밍 기법입니다.

### 핵심 원리

- **리소스 할당은 객체 초기화 시점에 수행**
- **리소스 해제는 객체 소멸 시점에 자동으로 수행**
- **예외 발생 시에도 자원이 올바르게 해제됨을 보장**

### RAII 적용 대표적 리소스

- 메모리 (new/delete)
- 파일 핸들 (open/close)
- 뮤텍스 락 (lock/unlock)
- 네트워크 연결 (connect/disconnect)
- 데이터베이스 연결 (connect/disconnect)

### RAII 예시

```cpp
class File {
private:
    FILE* m_handle;

public:
    // 생성자에서 리소스 획득
    File(const char* filename, const char* mode) {
        m_handle = fopen(filename, mode);
        if (!m_handle) {
            throw std::runtime_error("Failed to open file");
        }
    }

    // 소멸자에서 리소스 해제
    ~File() {
        if (m_handle) {
            fclose(m_handle);
        }
    }

    // 복사 및 이동 생성자/대입 연산자 생략...

    // 파일 핸들 사용
    void write(const char* text) {
        if (m_handle) {
            fputs(text, m_handle);
        }
    }
};

// 사용 예
void processFile() {
    // 스택에 File 객체 생성
    File logFile("log.txt", "w");
    
    logFile.write("Log entry 1\n");
    
    // 함수가 종료되면 logFile의 소멸자가 자동으로 호출되어 파일 닫힘
    // 예외가 발생해도 스택 풀기(stack unwinding)를 통해 소멸자가 호출됨
}
```

### RAII의 장점

1. **자원 누수 방지**: 객체가 소멸될 때 항상 해제되므로 메모리 누수 방지
2. **예외 안전성**: 예외 발생 시에도 자원이 적절히 해제됨
3. **코드 가독성**: 자원 관리 코드가 분산되지 않고 한 곳에 집중됨
4. **유지보수성**: 자원 관리 정책 변경 시 한 곳만 수정하면 됨

## 스마트 포인터

스마트 포인터는 RAII 원칙을 메모리 관리에 적용한 객체로, 동적으로 할당된 메모리의 수명을 자동으로 관리합니다.

### 1. unique_ptr

`std::unique_ptr`는 하나의 객체에 대한 독점적 소유권을 가지는 스마트 포인터입니다.

#### 특징

- **독점 소유권**: 하나의 객체는 하나의 unique_ptr만 소유 가능
- **복사 불가능**: 복사 생성자와 복사 대입 연산자가 삭제됨
- **이동 가능**: 소유권을 다른 unique_ptr로 이전 가능
- **커스텀 삭제자 지원**: 기본 delete 외에 다른 방식으로 리소스 해제 가능

#### 사용 예시

```cpp
#include <memory>
#include <iostream>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource released\n"; }
    void use() { std::cout << "Resource used\n"; }
};

void uniquePtrExample() {
    // 생성 방법 1: 직접 생성
    std::unique_ptr<Resource> res1(new Resource());
    
    // 생성 방법 2: make_unique 사용 (C++14 이상, 권장)
    auto res2 = std::make_unique<Resource>();
    
    // 사용
    res1->use();
    (*res2).use();
    
    // 이동 가능
    auto res3 = std::move(res1);  // res1은 이제 nullptr
    
    // 명시적 소유권 해제
    res2.reset();  // Resource released 출력
    
    // 조건부 사용
    if (res3) {
        res3->use();
    }
    
    // 함수 종료 시 res3의 소멸자가 호출되어 Resource released 출력
}

// 커스텀 삭제자 사용 예
void customDeleterExample() {
    auto customDeleter = [](Resource* p) {
        std::cout << "Custom deleter called\n";
        delete p;
    };
    
    std::unique_ptr<Resource, decltype(customDeleter)> res(new Resource(), customDeleter);
}
```

### 2. shared_ptr

`std::shared_ptr`는 여러 포인터가 하나의 객체를 공유하며, 참조 카운팅을 통해 마지막 참조가 사라질 때 자동으로 메모리를 해제합니다.

#### 특징

- **공유 소유권**: 여러 shared_ptr이 같은 객체를 참조 가능
- **참조 카운팅**: 내부적으로 객체 참조 횟수를 관리
- **스레드 안전**: 참조 카운트 조작은 원자적 연산으로 스레드 안전
- **복사 가능**: 복사 시 참조 카운트 증가
- **컨트롤 블록**: 참조 카운트와 삭제자 정보를 담은 별도 메모리 블록 사용

#### 사용 예시

```cpp
#include <memory>
#include <iostream>
#include <vector>

void sharedPtrExample() {
    // 생성 방법 1: 직접 생성
    std::shared_ptr<Resource> res1(new Resource());
    
    // 생성 방법 2: make_shared 사용 (권장)
    auto res2 = std::make_shared<Resource>();
    
    // 복사를 통한 공유
    auto res3 = res2;  // 참조 카운트: 2
    
    {
        auto res4 = res2;  // 참조 카운트: 3
        std::cout << "Reference count: " << res2.use_count() << std::endl;  // 3 출력
        
        // 블록 종료 시 res4가 소멸되고 참조 카운트 감소
    }
    
    std::cout << "Reference count: " << res2.use_count() << std::endl;  // 2 출력
    
    // 컨테이너에 저장
    std::vector<std::shared_ptr<Resource>> resources;
    resources.push_back(res1);
    resources.push_back(res2);
    
    // 명시적 소유권 해제
    res1.reset();  // res1은 이제 nullptr, 참조 카운트만 감소, 메모리는 해제되지 않음
    
    // 모든 shared_ptr이 소멸되면 마지막에 Resource 해제
}
```

### 3. weak_ptr

`std::weak_ptr`는 `shared_ptr`이 관리하는 객체에 대한 약한 참조를 제공하며, 주로 순환 참조 문제를 해결하는 데 사용됩니다.

#### 특징

- **비소유권 참조**: 객체의 수명에 영향을 주지 않음
- **참조 카운트 증가 없음**: shared_ptr의 참조 카운트를 증가시키지 않음
- **만료 확인 가능**: 참조하는 객체가 아직 유효한지 확인 가능
- **shared_ptr로 변환 필요**: 객체에 접근하려면 shared_ptr로 변환해야 함

#### 사용 예시: 순환 참조 해결

```cpp
#include <memory>
#include <iostream>

class Node;
using NodePtr = std::shared_ptr<Node>;
using WeakNodePtr = std::weak_ptr<Node>;

class Node {
public:
    NodePtr next;      // 강한 참조
    WeakNodePtr prev;  // 약한 참조
    
    Node() { std::cout << "Node created\n"; }
    ~Node() { std::cout << "Node destroyed\n"; }
};

void circularReferenceExample() {
    // 순환 참조 생성
    NodePtr node1 = std::make_shared<Node>();
    NodePtr node2 = std::make_shared<Node>();
    
    std::cout << "Node1 ref count: " << node1.use_count() << std::endl;  // 1 출력
    std::cout << "Node2 ref count: " << node2.use_count() << std::endl;  // 1 출력
    
    // 상호 참조 설정
    node1->next = node2;  // 강한 참조
    node2->prev = node1;  // 약한 참조
    
    std::cout << "Node1 ref count: " << node1.use_count() << std::endl;  // 1 출력 (weak_ptr은 카운트 증가 안함)
    std::cout << "Node2 ref count: " << node2.use_count() << std::endl;  // 2 출력 (node1->next가 참조)
    
    // weak_ptr 사용 방법
    if (auto prevNode = node2->prev.lock()) {  // shared_ptr로 변환
        std::cout << "Node2's previous node is valid\n";
        prevNode->next = nullptr;  // 안전하게 접근 가능
    }
    
    // 함수 종료 시 node1, node2가 소멸되고 메모리 해제됨
    // weak_ptr을 사용하지 않고 양쪽 다 shared_ptr을 사용했다면,
    // 순환 참조로 인해 메모리 누수가 발생했을 것임
}
```

### 스마트 포인터 사용 지침

1. **기본적으로 `unique_ptr` 사용**: 소유권이 단일 객체에만 필요한 경우
2. **공유 소유권이 필요할 때만 `shared_ptr` 사용**: 성능상 오버헤드 존재
3. **생성 시 `make_unique`/`make_shared` 함수 활용**: 예외 안전성과 성능 향상
4. **순환 참조는 `weak_ptr`로 해결**: 한쪽은 weak_ptr 사용
5. **raw 포인터 혼용 주의**: 스마트 포인터가 관리하는 객체를 raw 포인터로 삭제하지 말 것
6. **배열은 `unique_ptr<T[]>` 또는 컨테이너 사용**: C++17 이전에는 shared_ptr이 배열 지원 안함

### 실용적인 활용 사례

#### 팩토리 패턴

```cpp
class Product {
public:
    virtual void use() = 0;
    virtual ~Product() = default;
};

class ConcreteProduct : public Product {
public:
    void use() override {
        std::cout << "Using concrete product\n";
    }
};

// 팩토리 함수는 unique_ptr 반환
std::unique_ptr<Product> createProduct() {
    return std::make_unique<ConcreteProduct>();
}

// 사용
void factoryExample() {
    auto product = createProduct();
    product->use();
}
```

#### 메모리 풀 관리

```cpp
class MemoryPool {
private:
    std::vector<std::shared_ptr<void>> resources;
    
public:
    template<typename T, typename... Args>
    std::shared_ptr<T> allocate(Args&&... args) {
        auto resource = std::make_shared<T>(std::forward<Args>(args)...);
        resources.push_back(resource);
        return resource;
    }
    
    void releaseUnused() {
        resources.erase(
            std::remove_if(resources.begin(), resources.end(),
                [](const std::shared_ptr<void>& res) { return res.use_count() == 1; }),
            resources.end()
        );
    }
};
```

#### 캐시 구현

```cpp
template<typename Key, typename Value>
class Cache {
private:
    std::unordered_map<Key, std::weak_ptr<Value>> cache;
    std::mutex cacheMutex;
    
public:
    std::shared_ptr<Value> get(const Key& key) {
        std::lock_guard<std::mutex> lock(cacheMutex);
        auto it = cache.find(key);
        if (it != cache.end()) {
            if (auto value = it->second.lock()) {
                return value;  // 캐시 히트
            }
            // 캐시 항목이 만료되었으면 제거
            cache.erase(it);
        }
        return nullptr;  // 캐시 미스
    }
    
    void insert(const Key& key, std::shared_ptr<Value> value) {
        std::lock_guard<std::mutex> lock(cacheMutex);
        cache[key] = value;
    }
    
    void cleanup() {
        std::lock_guard<std::mutex> lock(cacheMutex);
        for (auto it = cache.begin(); it != cache.end();) {
            if (it->second.expired()) {
                it = cache.erase(it);
            } else {
                ++it;
            }
        }
    }
};
```

### 주의사항 및 함정

1. **make_shared와 메모리 해제 지연**
   - `make_shared`는 객체와 컨트롤 블록을 하나의 메모리 블록에 할당
   - weak_ptr이 남아있으면 컨트롤 블록이 유지되어 메모리 완전 해제가 지연될 수 있음

2. **순환 참조**
   - `shared_ptr`로만 구성된 순환 참조는 메모리 누수 발생
   - 항상 순환 구조에서는 한쪽에 `weak_ptr` 사용

3. **스마트 포인터 배열**
   - C++17 이전: `unique_ptr<T[]>`는 지원, `shared_ptr<T[]>`는 미지원
   - C++17 이후: 둘 다 배열 지원
   - 가능하면 `std::vector`나 `std::array` 사용 권장

4. **성능 고려사항**
   - `shared_ptr`은 컨트롤 블록 관리와 원자적 연산으로 오버헤드 존재
   - 성능 중요 코드에서는 필요한 경우만 사용

## 결론

- RAII는 C++에서 자원을 안전하게 관리하는 핵심 패턴
- 스마트 포인터는 RAII를 적용한 메모리 관리 도구
- `unique_ptr`는 단일 소유권 시나리오에 적합
- `shared_ptr`는 공유 소유권이 필요할 때 사용
- `weak_ptr`는 순환 참조 방지와 임시 접근에 유용
- 적절한 스마트 포인터 사용으로 메모리 누수와 댕글링 포인터 방지 