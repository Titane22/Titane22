---
layout: page
title: 스택을 활용한 괄호 검사
description: >
  괄호 쌍의 유효성을 검사하는 스택 기반 알고리즘 구현
hide_description: false
---

## 문제 설명
주어진 문자열이 올바른 괄호 쌍으로 이루어져 있는지 확인하는 프로그램을 작성합니다.

### 입력 조건
- 문자열 S (1 ≤ |S| ≤ 100,000)
- 문자열은 다음 괄호들과 기타 문자로 구성됩니다:
  - 소괄호: ()
  - 중괄호: {}
  - 대괄호: []

### 출력 조건
- 올바른 괄호 쌍: "YES"
- 잘못된 괄호 쌍: "NO"

## 구현 코드
```cpp
#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool IsValid(string str) {
    stack<char> st;
    for (char ch : str) {
        if (ch == '(' || ch == '{' || ch == '[') {
            st.push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (st.empty()) return false; // 스택이 비어 있으면 잘못된 입력
            char top = st.top();
            st.pop();
            // 괄호 매칭 확인
            if ((ch == ')' && top != '(') ||
                (ch == '}' && top != '{') ||
                (ch == ']' && top != '[')) {
                return false;
            }
        }
    }
    // 스택에 남아 있는 열린 괄호가 없으면 유효
    return st.empty();
}

int main() {
    string str;
    cin >> str;
    cout << (IsValid(str) ? "YES" : "NO") << endl;
    return 0;
}   
```

## 코드 설명

1. **스택 활용**: 
   - 열린 괄호('(', '{', '[')는 스택에 push
   - 닫힌 괄호(')', '}', ']')를 만나면 스택의 top과 비교

2. **검사 과정**:
   - 닫힌 괄호를 만났을 때 스택이 비어있다면 잘못된 입력
   - 스택의 top이 현재 닫힌 괄호와 매칭되지 않으면 잘못된 입력
   - 문자열 검사가 끝난 후 스택이 비어있지 않으면 잘못된 입력

3. **시간 복잡도**: O(n)
   - 문자열을 한 번만 순회
   - 각 문자에 대한 스택 연산은 O(1)

## 예제 입출력

### 예제 1
```
입력: {[()]}
출력: YES
```

### 예제 2
```
입력: {[(])}
출력: NO
```

### 예제 3
```
입력: {[()]}abc
출력: YES
```

## 주의사항
- 괄호 외의 문자는 무시
- 중첩된 괄호도 올바른 순서로 닫혀야 함
- 빈 문자열은 올바른 괄호 문자열로 간주

