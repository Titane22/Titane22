---
layout: page
title: 최소 스패닝 트리 (프림 알고리즘)
description: >
  프림 알고리즘을 이용한 네트워크 복구 문제 해결
---

# 프림 알고리즘을 이용한 MST 구현

## 문제: 네트워크 복구 (Network Recovery)

N개의 컴퓨터와 M개의 네트워크 케이블로 구성된 네트워크에서, 모든 컴퓨터를 최소 비용으로 연결하는 문제를 해결합니다.

## 구현 코드

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
using namespace std;

const int INF = 1e9;  // 무한대 값 정의

class NetworkRecovery {
private:
    int n, m;  // 컴퓨터 수(N), 케이블 수(M)
    vector<pair<int, int>> adj[1001];  // 인접 리스트 (노드, 비용)

public:
    NetworkRecovery(int computers, int cables) 
        : n(computers), m(cables) {}

    // 간선 추가
    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    // 프림 알고리즘 구현
    void prim() {
        vector<int> dist(n + 1, INF);  // 각 노드까지의 최소 비용
        vector<int> parent(n + 1, -1);  // 복구된 케이블 정보
        vector<bool> visited(n + 1, false);  // 방문 여부
        priority_queue<pair<int, int>, 
                      vector<pair<int, int>>, 
                      greater<>> pq;  // 최소 힙

        // 시작 노드 초기화
        dist[1] = 0;
        pq.push({0, 1});  // {비용, 노드}

        while (!pq.empty()) {
            auto [cost, u] = pq.top();
            pq.pop();

            if (visited[u]) continue;
            visited[u] = true;

            // 인접 노드 탐색
            for (auto [v, w] : adj[u]) {
                if (!visited[v] && w < dist[v]) {
                    dist[v] = w;
                    parent[v] = u;
                    pq.push({w, v});
                }
            }
        }

        // 결과 출력
        printResult(dist, parent);
    }

private:
    // 결과 출력 함수
    void printResult(const vector<int>& dist, const vector<int>& parent) {
        int totalCost = 0;
        vector<pair<int, int>> result;

        for (int i = 2; i <= n; i++) {
            if (parent[i] == -1) continue;
            totalCost += dist[i];
            result.push_back({parent[i], i});
        }

        cout << totalCost << "\n";
        for (auto [u, v] : result) {
            cout << u << " " << v << "\n";
        }
    }
};
```

## 프림 알고리즘 동작 원리

1. **초기화**
   - 모든 노드의 거리를 무한대(INF)로 설정
   - 시작 노드의 거리를 0으로 설정
   - 우선순위 큐에 시작 노드 추가

2. **노드 선택과 방문**
   - 우선순위 큐에서 최소 비용의 노드 선택
   - 방문하지 않은 노드만 처리
   - 방문 표시 후 인접 노드 탐색

3. **인접 노드 처리**
   - 선택된 노드의 인접 노드들 검사
   - 방문하지 않은 노드 중 더 작은 비용 발견 시 갱신
   - 갱신된 노드는 우선순위 큐에 추가

4. **결과 생성**
   - parent 배열을 통해 선택된 간선 추적
   - 총 비용과 선택된 간선 목록 출력

## 시간 복잡도 분석

- **전체 복잡도**: O(E log V)
  - E: 간선의 수
  - V: 정점의 수
- **주요 연산**:
  - 우선순위 큐 삽입/삭제: O(log V)
  - 모든 간선 처리: O(E)

## 구현 최적화

1. **자료구조 선택**
   - 인접 리스트로 메모리 사용 최적화
   - 우선순위 큐로 최소 비용 간선 빠른 선택

2. **메모리 관리**
   - 필요한 크기만큼만 벡터 할당
   - 불필요한 복사 연산 방지

3. **성능 개선**
   - 방문 체크로 중복 처리 방지
   - 간선 정보 효율적 관리
</rewritten_file>
