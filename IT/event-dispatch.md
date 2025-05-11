---
layout: page
title: C++에서의 이벤트 디스패치
description: >
  이벤트 기반 프로그래밍에서 이벤트 디스패치 시스템의 구현과 활용
hide_description: false
---

이벤트 디스패치(Event Dispatch)는 이벤트 기반 프로그래밍의 핵심 메커니즘으로, 
프로그램의 한 부분에서 발생한 이벤트를 적절한 처리 함수나 객체에 전달하는 역할을 합니다.

## 기본 개념

이벤트 디스패치 시스템은 다음과 같은 핵심 구성 요소로 이루어집니다:

1. **이벤트(Event)**: 시스템에서 발생한 상태 변화나 동작을 나타내는 객체
2. **이벤트 소스(Event Source)**: 이벤트를 발생시키는 객체
3. **이벤트 리스너(Event Listener)**: 이벤트를 처리하는 함수나 객체
4. **이벤트 디스패처(Event Dispatcher)**: 이벤트를 적절한 리스너에게 전달하는 중간 매개체

## C++에서의 기본 구현

### 1. 이벤트 기본 클래스

```cpp
// 이벤트 기본 클래스
class Event {
public:
    enum class Type {
        MouseClick,
        KeyPress,
        WindowResize,
        // 기타 이벤트 타입
    };

    Type getType() const { return type; }
    virtual ~Event() = default;

protected:
    explicit Event(Type type) : type(type) {}

private:
    Type type;
};
```

### 2. 구체적인 이벤트 타입

```cpp
// 마우스 클릭 이벤트
class MouseClickEvent : public Event {
public:
    MouseClickEvent(int x, int y, int button) 
        : Event(Type::MouseClick), x(x), y(y), button(button) {}

    int getX() const { return x; }
    int getY() const { return y; }
    int getButton() const { return button; }

private:
    int x, y;      // 마우스 좌표
    int button;    // 클릭된 버튼
};

// 키 입력 이벤트
class KeyPressEvent : public Event {
public:
    KeyPressEvent(int keyCode) 
        : Event(Type::KeyPress), keyCode(keyCode) {}

    int getKeyCode() const { return keyCode; }

private:
    int keyCode;   // 키코드
};
```

### 3. 이벤트 리스너 인터페이스

```cpp
// 이벤트 리스너 인터페이스
class EventListener {
public:
    virtual void onEvent(const Event& event) = 0;
    virtual ~EventListener() = default;
};

// 특정 타입의 이벤트 리스너
template<typename EventType>
class TypedEventListener {
public:
    virtual void handle(const EventType& event) = 0;
    virtual ~TypedEventListener() = default;
};
```

### 4. 이벤트 디스패처

```cpp
#include <vector>
#include <unordered_map>
#include <typeindex>
#include <memory>

class EventDispatcher {
public:
    // 일반 리스너 등록
    void addListener(EventListener* listener) {
        listeners.push_back(listener);
    }

    // 타입별 리스너 등록
    template<typename EventType>
    void addListener(TypedEventListener<EventType>* listener) {
        auto typeIndex = std::type_index(typeid(EventType));
        typedListeners[typeIndex].push_back(listener);
    }

    // 이벤트 디스패치
    void dispatchEvent(const Event& event) {
        // 일반 리스너에게 이벤트 전달
        for (auto listener : listeners) {
            listener->onEvent(event);
        }

        // 타입별 리스너에게 이벤트 전달
        auto typeIndex = std::type_index(typeid(event));
        if (typedListeners.find(typeIndex) != typedListeners.end()) {
            for (auto listener : typedListeners[typeIndex]) {
                // 여기서 다운캐스트가 필요
                // 실제 구현에서는 더 안전한 방법이 필요
            }
        }
    }

private:
    std::vector<EventListener*> listeners;
    std::unordered_map<std::type_index, std::vector<void*>> typedListeners;
};
```

## 완벽한 전달을 활용한 이벤트 디스패치

C++11 이후로 도입된 완벽한 전달(Perfect Forwarding)을 활용하면 이벤트 객체를 효율적으로 생성하고 전달할 수 있습니다.

```cpp
#include <utility>

// 이벤트 디스패치 유틸리티 함수
template<typename EventType, typename... Args>
void dispatchEvent(EventDispatcher& dispatcher, Args&&... args) {
    // 완벽한 전달로 이벤트 생성
    EventType event(std::forward<Args>(args)...);
    // 디스패처에 이벤트 전달
    dispatcher.dispatchEvent(event);
}

// 사용 예
int main() {
    EventDispatcher dispatcher;
    
    // MouseClickEvent(100, 200, 0) 생성 및 디스패치
    dispatchEvent<MouseClickEvent>(dispatcher, 100, 200, 0);
    
    return 0;
}
```

## 템플릿 메타프로그래밍을 활용한 개선된 디스패처

타입 안전성을 강화하고 성능을 개선하기 위해 템플릿 메타프로그래밍을 활용할 수 있습니다.

```cpp
#include <functional>
#include <memory>
#include <unordered_map>
#include <vector>
#include <typeindex>

class AdvancedEventDispatcher {
public:
    // 함수 객체 기반 이벤트 핸들러 등록
    template<typename EventType>
    void addHandler(std::function<void(const EventType&)> handler) {
        auto typeIndex = std::type_index(typeid(EventType));
        auto& handlers = getHandlers<EventType>(typeIndex);
        handlers.push_back(handler);
    }

    // 이벤트 디스패치 (const 참조 버전)
    template<typename EventType>
    void dispatch(const EventType& event) {
        auto typeIndex = std::type_index(typeid(EventType));
        auto& handlers = getHandlers<EventType>(typeIndex);
        for (auto& handler : handlers) {
            handler(event);
        }
    }

    // 이벤트 디스패치 (완벽한 전달 버전)
    template<typename EventType, typename... Args>
    void dispatch(Args&&... args) {
        EventType event(std::forward<Args>(args)...);
        dispatch(event);
    }

private:
    // 타입별 핸들러 저장소 접근
    template<typename EventType>
    std::vector<std::function<void(const EventType&)>>& getHandlers(std::type_index typeIndex) {
        // 해당 타입의 핸들러 컨테이너가 없으면 생성
        if (handlersMap.find(typeIndex) == handlersMap.end()) {
            handlersMap[typeIndex] = std::make_shared<HandlerContainer<EventType>>();
        }
        return static_cast<HandlerContainer<EventType>*>(handlersMap[typeIndex].get())->handlers;
    }

    // 핸들러 컨테이너 기본 클래스
    struct BaseHandlerContainer {
        virtual ~BaseHandlerContainer() = default;
    };

    // 타입별 핸들러 컨테이너
    template<typename EventType>
    struct HandlerContainer : BaseHandlerContainer {
        std::vector<std::function<void(const EventType&)>> handlers;
    };

    std::unordered_map<std::type_index, std::shared_ptr<BaseHandlerContainer>> handlersMap;
};
```

## 사용 예제

### 1. 이벤트 리스너 구현

```cpp
// 마우스 이벤트 리스너
class MouseHandler : public TypedEventListener<MouseClickEvent> {
public:
    void handle(const MouseClickEvent& event) override {
        std::cout << "마우스 클릭: x=" << event.getX() 
                  << ", y=" << event.getY() 
                  << ", 버튼=" << event.getButton() << std::endl;
    }
};

// 키보드 이벤트 리스너
class KeyboardHandler : public TypedEventListener<KeyPressEvent> {
public:
    void handle(const KeyPressEvent& event) override {
        std::cout << "키 입력: " << event.getKeyCode() << std::endl;
    }
};
```

### 2. 이벤트 디스패치 시스템 활용

```cpp
int main() {
    // 고급 이벤트 디스패처 사용
    AdvancedEventDispatcher dispatcher;
    
    // 람다로 핸들러 등록
    dispatcher.addHandler<MouseClickEvent>([](const MouseClickEvent& e) {
        std::cout << "람다 핸들러: 마우스 클릭 (" 
                  << e.getX() << ", " << e.getY() << ")" << std::endl;
    });
    
    // 멤버 함수를 핸들러로 등록
    KeyboardHandler keyHandler;
    dispatcher.addHandler<KeyPressEvent>([&keyHandler](const KeyPressEvent& e) {
        keyHandler.handle(e);
    });
    
    // 이벤트 디스패치
    dispatcher.dispatch<MouseClickEvent>(100, 200, 0);
    dispatcher.dispatch<KeyPressEvent>(65); // 'A' 키
    
    return 0;
}
```

## 이벤트 디스패치 시스템의 장점

1. **느슨한 결합(Loose Coupling)**
   - 이벤트 발생 시스템과 처리 시스템이 서로 독립적으로 동작
   - 코드 모듈성과 유지보수성 향상

[참고](https://www.techtarget.com/searchnetworking/definition/loose-coupling)

2. **확장성**
   - 새로운 이벤트 타입과 리스너를 쉽게 추가 가능
   - 플러그인 아키텍처 구현에 적합

3. **비동기 처리**
   - 이벤트 큐와 결합하여 비동기 이벤트 처리 가능
   - 이벤트 발생과 처리의 시간적 분리

4. **중앙 집중식 관리**
   - 모든 이벤트 흐름을 중앙에서 관리
   - 디버깅과 로깅이 용이

## 실제 응용 분야

- **GUI 프레임워크**: 사용자 입력 처리
- **게임 엔진**: 게임 내 이벤트 관리
- **네트워크 서버**: 클라이언트 요청 처리
- **시뮬레이션 소프트웨어**: 다양한 시스템 간의 상호작용

## 성능 고려사항

이벤트 디스패치 시스템을 설계할 때 고려해야 할 성능 측면:

1. **메모리 관리**: 이벤트 객체 생성과 소멸의 효율성
2. **디스패치 오버헤드**: 이벤트 라우팅의 계산 비용
3. **타입 안전성과 성능**: 동적 캐스팅 vs 템플릿 메타프로그래밍
4. **락킹 메커니즘**: 멀티스레드 환경에서의 동기화

## 결론

이벤트 디스패치 시스템은 현대적인 소프트웨어 개발에서 필수적인 디자인 패턴입니다. C++11 이후 도입된 기능들(특히 가변 템플릿, 완벽한 전달, 람다 표현식)을 활용하면 타입 안전하고 효율적인 이벤트 시스템을 구현할 수 있습니다. 적절히 설계된 이벤트 시스템은 코드의 모듈성, 재사용성, 유지보수성을 크게 향상시킵니다.
