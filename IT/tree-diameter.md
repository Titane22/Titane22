---
layout: page
title: 트리의 지름 알고리즘
description: >
  트리에서 가장 긴 경로의 길이를 구하는 알고리즘
---

트리의 지름(Tree Diameter)은 트리에서 임의의 두 노드 사이의 거리 중 가장 긴 것을 의미합니다. 이를 구하는 효율적인 알고리즘을 알아보겠습니다.
<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/algorithms/tree-diameter.png" alt="트리의 지름 예시" width="60%"><br>
  <em>트리의 지름 예시 - 빨간색으로 표시된 경로가 트리의 지름</em>
</p>

## 알고리즘 원리

트리의 지름을 구하는 과정은 다음과 같은 두 단계로 이루어집니다:

1. **첫 번째 DFS**: 임의의 노드에서 시작하여 가장 먼 노드를 찾습니다.
   - 어떤 노드에서 시작하더라도, 찾아진 노드는 반드시 지름의 한쪽 끝점이 됩니다.

2. **두 번째 DFS**: 첫 번째 단계에서 찾은 노드에서 다시 가장 먼 노드를 찾습니다.
   - 이때 구해진 거리가 트리의 지름이 됩니다.

## 구현 방법


### 1. 2차원 배열(인접 행렬) 방식
- **메모리**: O(N²)의 공간을 사용
- **특징**:
  - 모든 노드 쌍에 대해 연결 정보를 저장
  - 노드 간 연결 확인이 O(1)로 빠름
  - 노드 수가 많을 때는 비효율적
  - 구현이 단순하고 직관적
- **적합한 경우**:
  - 노드의 수가 적은 경우 (약 1000개 이하)
  - 빠른 간선 존재 여부 확인이 필요한 경우
  - 메모리 제약이 크지 않은 경우

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring> // memset 사용
using namespace std;

#define MAX_NODES 1001
#define INF 1e9

int n; // 노드 개수
int adj[MAX_NODES][MAX_NODES]; // 2차원 배열: 인접 행렬
bool visited[MAX_NODES];

// BFS 함수: 시작 노드(start)에서 가장 먼 노드와 거리를 반환
pair<int, int> BFS(int start) {
    memset(visited, false, sizeof(visited)); // 방문 초기화
    queue<pair<int, int>> q; // {노드, 거리}
    q.push({start, 0});
    visited[start] = true;

    int farthest_node = start; // 가장 먼 노드
    int max_distance = 0; // 최대 거리

    while (!q.empty()) {
        int current = q.front().first;
        int distance = q.front().second;
        q.pop();

        // 거리 갱신
        if (distance > max_distance) {
            max_distance = distance;
            farthest_node = current;
        }

        // 현재 노드에서 인접한 노드 탐색
        for (int next = 1; next <= n; ++next) {
            if (adj[current][next] != 0 && !visited[next]) { // 간선 존재 여부 체크
                visited[next] = true;
                q.push({next, distance + adj[current][next]});
            }
        }
    }
    return {farthest_node, max_distance}; // {노드, 거리}
}

int main() {
    cin >> n; // 노드 개수 입력

    // 인접 행렬 초기화
    memset(adj, 0, sizeof(adj));

    // 간선 입력
    for (int i = 0; i < n - 1; ++i) {
        int u, v, w;
        cin >> u >> v >> w; // u와 v는 연결된 노드, w는 가중치
        adj[u][v] = w;
        adj[v][u] = w; // 무향 그래프
    }

    // 트리의 지름 계산
    // 임의의 노드에서 가장 먼 노드를 찾음
    pair<int, int> first_bfs = BFS(1);

    // 위에서 찾은 노드에서 다시 가장 먼 노드를 찾음 (트리의 지름 계산)
    pair<int, int> second_bfs = BFS(first_bfs.first);

    cout << "트리의 지름: " << second_bfs.second << endl;
    return 0;
}
```

### 2. 인접 리스트 방식
- **메모리**: O(N + E)의 공간을 사용
- **특징**:
  - 실제 연결된 간선 정보만 저장
  - 노드의 인접 노드 탐색이 더 효율적
  - 구현이 약간 더 복잡할 수 있음
  - 대부분의 실제 문제에서 선호되는 방식
- **적합한 경우**:
  - 노드의 수가 많은 경우 (10000개 이상)
  - 메모리 제약이 있는 경우
  - 트리가 희소 그래프(sparse graph) 형태인 경우
  
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cstring> // memset을 사용하기 위해 필요

using namespace std;

const int MAX = 100001;

vector<pair<int, int>> adj[MAX];
int dist[MAX];
int n;

// BFS를 이용하여 가장 먼 노드와 거리 반환
pair<int, int> BFS(int start) {
    memset(dist, -1, sizeof(dist)); // 거리 초기화
    queue<int> q;

    q.push(start);
    dist[start] = 0;

    int farthest_node = start;
    int max_distance = 0;

    while (!q.empty()) {
        int current = q.front();
        q.pop();

        for (auto edge : adj[current]) {
            int next = edge.first;
            int weight = edge.second;

            if (dist[next] == -1) { // 방문하지 않은 노드
                dist[next] = dist[current] + weight;
                q.push(next);

                if (dist[next] > max_distance) {
                    max_distance = dist[next];
                    farthest_node = next;
                }
            }
        }
    }

    return {farthest_node, max_distance};
}

int main() {
    cin >> n;

    for (int i = 0; i < n - 1; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }

    // 임의의 노드에서 가장 먼 노드를 찾음
    pair<int, int> first_bfs = BFS(1);

    // 위에서 찾은 노드에서 다시 가장 먼 노드를 찾음 (트리의 지름 계산)
    pair<int, int> second_bfs = BFS(first_bfs.first);

    cout << second_bfs.second << endl;

    return 0;
}

```

### 성능 비교

| 작업 | 2차원 배열 | 인접 리스트 |
|------|------------|-------------|
| 메모리 사용량 | O(N²) | O(N + E) |
| 간선 존재 확인 | O(1) | O(degree(v)) |
| 인접 노드 순회 | O(N) | O(degree(v)) |
| 구현 복잡도 | 낮음 | 중간 | 

## 정확성 증명

이 알고리즘이 올바른 이유는 다음과 같습니다:

1. 임의의 노드 x에서 가장 먼 노드 y를 찾았을 때, y는 반드시 트리 지름의 한쪽 끝점이 됩니다.
   - 만약 y가 지름의 끝점이 아니라면, y에서 더 먼 노드가 존재한다는 것을 의미하므로 모순
   
2. y에서 가장 먼 노드 z까지의 거리가 트리의 지름이 됩니다.
   - y가 지름의 한쪽 끝점이므로, y에서 가장 먼 노드까지의 거리가 트리의 지름이 됨

## 시간 복잡도

- 각 DFS는 모든 노드와 간선을 한 번씩만 방문
- DFS를 두 번 수행
- 전체 시간 복잡도: O(N + E) = O(N)
  - 트리는 N개의 노드와 N-1개의 간선을 가지므로

## 공간 복잡도

- 인접 리스트로 트리를 저장: O(N)
- DFS 재귀 호출 스택: O(N)
- 전체 공간 복잡도: O(N) 
