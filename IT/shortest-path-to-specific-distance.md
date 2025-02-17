---
layout: page
title: Shortest Path to a Specific Distance
description: >
  BFS를 활용한 특정 거리의 도시 찾기 알고리즘 구현
---

## 문제 설명
N개의 도시와 M개의 단방향 도로가 있을 때, 특정 도시 X로부터 출발하여 도달할 수 있는 모든 도시 중 최단 거리가 정확히 K인 모든 도시를 찾는 문제입니다.

### 입력 조건
- 도시 개수 N (2 ≤ N ≤ 300,000)
- 도로 개수 M (1 ≤ M ≤ 1,000,000)
- 거리 정보 K (0 ≤ K ≤ N-1)
- 출발 도시 번호 X (1 ≤ X ≤ N)

## 해결 방법

### 1. BFS 알고리즘 활용
- 너비 우선 탐색을 사용하여 각 도시까지의 최단 거리를 계산
- 모든 도로의 거리가 1로 동일하므로 BFS로 최단 거리 계산이 가능
- 가중치가 없는 그래프에서는 BFS가 최단 경로를 보장

### 2. 전체 구현 코드

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int n, m, k, x;
vector<vector<int>> adj;    // 인접 리스트
vector<int> dist;           // 거리 정보

vector<int> BFS() {
    vector<int> result;
    queue<int> q;
    q.push(x);
    dist[x] = 0;

    while (!q.empty()) {
        int cur = q.front();
        q.pop();

        for (int next : adj[cur]) {
            if (dist[next] == -1) {  // 미방문 도시
                dist[next] = dist[cur] + 1;
                if (dist[next] == k) {
                    result.push_back(next);
                } else if (dist[next] < k) {
                    q.push(next);
                }
            }
        }
    }
    return result;
}

int main() {
    cin >> n >> m >> k >> x;

    adj.resize(n + 1);        // 1-based 인덱스 사용
    dist.assign(n + 1, -1);   // 거리 배열 -1로 초기화

    // 도로 정보 입력
    for (int i = 0; i < m; i++) {
        int start, end;
        cin >> start >> end;
        adj[start].push_back(end);  // 단방향 도로
    }

    // BFS 수행 및 결과 처리
    vector<int> res = BFS();
    if (res.empty()) {
        cout << -1 << endl;
    } else {
        sort(res.begin(), res.end());  // 오름차순 정렬
        for (int val : res) {
            cout << val << endl;
        }
    }
    return 0;
}

### 3. 주요 자료구조
1. **인접 리스트 (adj)**
   - 각 도시에서 갈 수 있는 도시들을 저장
   - 메모리 효율적인 그래프 표현

2. **거리 배열 (dist)**
   - 각 도시까지의 최단 거리 저장
   - -1로 초기화하여 미방문 상태 표시

## 시간 복잡도 분석

- BFS: O(N + M)
  - 각 도시는 한 번만 방문
  - 각 도로는 한 번만 확인
- 결과 정렬: O(R log R), R은 결과 도시의 수

## 구현 시 주의사항

1. **메모리 관리**
   - 큰 입력에 대비한 벡터 크기 조정
   - 불필요한 방문 제한

2. **예외 처리**
   - 결과가 없는 경우 -1 출력
   - 입력 범위 검증

3. **최적화**
   - 거리가 K를 초과하면 더 이상 탐색하지 않음
   - 필요한 경우만 큐에 추가
