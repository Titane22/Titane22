---
layout: page
title: 최소 회의실 개수 (우선순위 큐)
description: >
  우선순위 큐를 활용한 회의실 배정 문제 해결
---

# 최소 회의실 개수 구하기

## 문제 설명
N개의 회의에 대해 시작 시간과 종료 시간이 주어질 때, 필요한 최소 회의실 개수를 구하는 문제입니다.

## 핵심 아이디어
1. **정렬과 우선순위 큐 활용**
   - 회의를 시작 시간 기준으로 정렬
   - 종료 시간을 우선순위 큐에 저장하여 관리

2. **회의실 재사용 로직**
   - 현재 회의 시작 시간이 가장 빨리 끝나는 회의 종료 시간보다 늦으면 재사용
   - 그렇지 않으면 새 회의실 필요

## 구현 코드
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<pair<int, int>> meetings(n);
    for (int i = 0; i < n; i++) {
        cin >> meetings[i].first >> meetings[i].second; // 시작 시간, 종료 시간
    }

    // 시작 시간을 기준으로 정렬
    sort(meetings.begin(), meetings.end());

    // 우선순위 큐(최소 힙)를 사용하여 종료 시간을 관리
    priority_queue<int, vector<int>, greater<int>> pq;

    for (const auto& meeting : meetings) {
        int start = meeting.first;
        int end = meeting.second;

        // 가장 먼저 끝나는 회의의 종료 시간과 비교
        if (!pq.empty() && pq.top() <= start) {
            pq.pop(); // 기존 회의실 재사용 가능
        }

        pq.push(end); // 현재 회의 종료 시간 추가
    }

    // 큐에 남아 있는 요소의 개수 = 필요한 최소 회의실 개수
    cout << pq.size() << endl;

    return 0;
}
```

## 시간 복잡도 분석
- **정렬**: O(N log N)
- **우선순위 큐 연산**: O(log N) × N번 = O(N log N)
- **전체 시간 복잡도**: O(N log N)

## 입력 예시
```
3
1 4
2 5
3 6
```

## 출력 예시
```
3
```

## 주요 포인트
1. **데이터 정렬**
   - 시작 시간 기준 정렬로 순차적 처리 가능

2. **우선순위 큐 활용**
   - 종료 시간 관리를 위한 최소 힙 사용
   - 가장 빨리 끝나는 회의실부터 재사용 시도

3. **회의실 개수 계산**
   - 우선순위 큐의 최종 크기가 필요한 회의실 수 