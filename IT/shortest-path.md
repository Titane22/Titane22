---
layout: page
title: 최적 경로 탐색 알고리즘
description: >
  다익스트라 알고리즘을 이용한 최단 경로 탐색 구현
hide_description: false
---

## 문제 설명
그래프가 주어졌을 때, 특정 시작 노드에서 모든 다른 노드로의 최단 경로를 계산하는 문제입니다.

### 조건
* 무방향 가중치 그래프
* 간선의 가중치는 1 이상의 양수
* 노드 개수 N (1 ≤ N ≤ 1000)
* 간선 개수 M (1 ≤ M ≤ 100,000)

### 입력 예시
```plaintext
예제 입력
5 6
1 2 2
1 3 4
2 3 1
2 4 7
3 5 3
4 5 1
1
```

### 출력 예시
```
0 2 3 9 6
```

## 해결 방법

### 1. 구현 코드
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

// 간선 구조체 정의
struct Edge {
    int to, weight;
};

// 전역 변수 선언
vector<Edge> graph[1001];        // 인접 리스트로 구현한 그래프
vector<int> dist(1001, INT_MAX); // 최단 거리 저장 배열
int n, m, start;                 // 노드 수, 간선 수, 시작 노드

// 다익스트라 알고리즘 구현
void dijkstra(int start) {
    // 우선순위 큐 선언 (최소 힙)
    priority_queue<pair<int, int>,
                  vector<pair<int, int>>,
                  greater<pair<int, int>>> pq;
    
    // 시작 노드 초기화
    dist[start] = 0;
    pq.push({0, start}); // {거리, 노드 번호}

    while (!pq.empty()) {
        int currentDist = pq.top().first;
        int currentNode = pq.top().second;
        pq.pop();

        // 이미 처리된 노드라면 스킵
        if (currentDist > dist[currentNode]) continue;

        // 현재 노드와 연결된 다른 노드들을 확인
        for (Edge edge : graph[currentNode]) {
            int nextNode = edge.to;
            int weight = edge.weight;

            // 더 짧은 경로를 발견한 경우 업데이트
            if (dist[nextNode] > currentDist + weight) {
                dist[nextNode] = currentDist + weight;
                pq.push({dist[nextNode], nextNode});
            }
        }
    }
}

int main() {
    // 입력 받기
    cin >> n >> m;

    // 간선 정보 입력
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        graph[u].push_back({v, w});
        graph[v].push_back({u, w}); // 무방향 그래프
    }

    // 시작 노드 입력
    cin >> start;

    // 다익스트라 알고리즘 실행
    dijkstra(start);

    // 결과 출력
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INT_MAX)
            cout << "INF ";
        else
            cout << dist[i] << " ";
    }
    cout << endl;
    return 0;
}
```

## 구현 설명

### 1. 주요 구성 요소
* **Edge 구조체**: 목적지 노드와 가중치 정보 저장
* **graph 배열**: 인접 리스트로 구현된 그래프
* **dist 배열**: 시작점에서 각 노드까지의 최단 거리
* **우선순위 큐**: 최단 거리를 가진 노드 우선 처리

### 2. 다익스트라 알고리즘
* 우선순위 큐를 사용하여 최단 거리를 가진 노드부터 처리
* 현재 노드에서 이동 가능한 모든 노드 검사
* 더 짧은 경로 발견 시 거리 정보 업데이트

### 3. 시간 복잡도
* O((V + E) log V)
  * V: 노드의 개수
  * E: 간선의 개수
* 우선순위 큐 연산: O(log V)

## 활용 분야
* 네트워크 라우팅
* 게임 내 내비게이션
* 지도 어플리케이션
* 소셜 네트워크 분석