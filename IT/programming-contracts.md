---
layout: page
title: 프로그래밍 계약 조건
description: >
  프리컨디션, 포스트컨디션, 함수 시그니처에 관한 개념과 활용
hide_description: false
---

프로그래밍에서 계약 조건(Contract Conditions)은 코드의 정확성과 신뢰성을 보장하기 위한 중요한 개념입니다. 
주로 함수나 메서드의 호출 전후에 만족해야 하는 조건들을 명확히 함으로써, 버그를 예방하고 디버깅을 용이하게 합니다.

## 프리컨디션(Precondition)

### 정의
함수가 호출되기 전에 반드시 만족해야 하는 조건입니다.
→ 이 조건이 지켜지지 않으면 함수는 제대로 작동하지 않으며, 버그나 예외가 발생할 수 있습니다.

### 목적
함수의 입력값에 대한 유효성 보장.

### 예시
```cpp
void divide(int a, int b) {
    assert(b != 0);  // 프리컨디션: b는 0이 아니어야 함
    std::cout << a / b << std::endl;
}
```

프리컨디션이 지켜지지 않으면 함수 내부 로직이 실패할 수 있습니다.

## 포스트컨디션(Postcondition)

### 정의
함수가 실행을 마친 후 반드시 만족해야 하는 조건입니다.
→ 함수가 의도한 대로 작동했는지 확인하기 위해 사용됩니다.

### 목적
함수가 약속한 출력값이나 상태 변경을 검증.

### 예시
```cpp
int add(int a, int b) {
    int result = a + b;
    assert(result >= a && result >= b);  // 포스트컨디션: 결과는 최소한 입력값 중 하나보다 크거나 같음
    return result;
}
```

또한 리팩토링 중 결과가 변하지 않았는지 검증할 때도 포스트컨디션을 사용할 수 있습니다.

## 함수 시그니처(Function Signature)

### 정의
함수의 이름과 매개변수의 타입 및 개수로, 함수의 인터페이스를 정의합니다.
→ C++에서는 반환값의 타입은 함수 시그니처에 포함되지 않습니다.

### 형식 예시
```cpp
int add(int a, int b);
```

여기서 `add(int, int)`가 함수 시그니처입니다.

### 다른 예시
```cpp
void log(std::string message, int level); // log(std::string, int)
double sqrt(double value);                // sqrt(double)
```

중복 정의(overload) 시에도 함수 시그니처가 중요합니다:
```cpp
void print(int x);
void print(double x); // 시그니처가 다르므로 오버로딩 가능
```

C++20부터는 계약 조건을 언어 수준에서 지원하기 위한 논의가 진행되고 있으며, 현재는 `assert` 매크로나 사용자 정의 함수를 통해 이러한 조건을 검사하는 것이 일반적입니다. 