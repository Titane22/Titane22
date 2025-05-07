---
layout: page
title: A* 알고리즘으로 길 찾기 구현
description: >
  A* 알고리즘을 사용한 2D 그리드 맵에서의 최단 경로 찾기 구현
hide_description: false
---


## 문제 설명
2차원 격자 형태의 맵에서 시작점에서 목표점까지의 최단 경로를 찾는 문제입니다.

### 조건
* 2차원 격자 맵 (0: 이동 가능, 1: 이동 불가)
* 상하좌우 이동만 가능 (대각선 이동 불가)
* 이동 비용은 모든 방향에 대해 1
* 경로가 없을 경우 "No Path" 출력

### 입력 예시

```plaintext
맵 크기: 5 x 5
맵:
0 0 1 0 0
0 1 1 0 0
0 0 0 0 1
1 1 1 0 0
0 0 0 0 0
시작점: (0, 0)
목표점: (4, 4)
```
### 출력 예시
```plaintext
최단 경로 길이: 8
경로: [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (3, 3), (4, 4)]
```


## 해결 방법

### 1. A* 알고리즘 구현
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
#include <algorithm>
using namespace std;

// 노드 구조체
struct Node {
    int x, y, cost, priority;
    Node(int x, int y, int cost, int priority)
        : x(x), y(y), cost(cost), priority(priority) {}
    
    bool operator<(const Node& other) const {
        return priority > other.priority;
    }
};

// 휴리스틱 함수 (맨해튼 거리)
int heuristic(int x1, int y1, int x2, int y2) {
    return abs(x1 - x2) + abs(y1 - y2);
}

// A* 알고리즘 구현
vector<pair<int, int>> a_star(const vector<vector<int>>& grid, 
                             pair<int, int> start, 
                             pair<int, int> goal) {
    int rows = grid.size();
    int cols = grid[0].size();
    
    // 이동 방향 (상하좌우)
    vector<pair<int, int>> directions;
    directions.push_back(make_pair(-1, 0));  // 상
    directions.push_back(make_pair(1, 0));   // 하
    directions.push_back(make_pair(0, -1));  // 좌
    directions.push_back(make_pair(0, 1));   // 우
    
    // 방문 체크 및 비용 저장
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    vector<vector<int>> cost(rows, vector<int>(cols, INT_MAX));
    vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));
    
    priority_queue<Node> pq;
    pq.push(Node(start.first, start.second, 0, 
                 heuristic(start.first, start.second, goal.first, goal.second)));
    cost[start.first][start.second] = 0;

    while (!pq.empty()) {
        Node current = pq.top();
        pq.pop();

        int x = current.x, y = current.y;
        if (visited[x][y]) continue;
        visited[x][y] = true;

        if (x == goal.first && y == goal.second) {
            vector<pair<int, int>> path;
            while (x != -1 && y != -1) {
                path.push_back({x, y});
                tie(x, y) = parent[x][y];
            }
            reverse(path.begin(), path.end());
            return path;
        }

        for (auto [dx, dy] : directions) {
            int nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < rows && ny < cols && 
                grid[nx][ny] == 0 && !visited[nx][ny]) {
                int new_cost = cost[x][y] + 1;
                if (new_cost < cost[nx][ny]) {
                    cost[nx][ny] = new_cost;
                    parent[nx][ny] = {x, y};
                    int priority = new_cost + 
                                 heuristic(nx, ny, goal.first, goal.second);
                    pq.push(Node(nx, ny, new_cost, priority));
                }
            }
        }
    }
    return {};
}

int main() {
    vector<vector<int>> grid = {
        {0, 0, 1, 0, 0},
        {0, 1, 1, 0, 0},
        {0, 0, 0, 0, 1},
        {1, 1, 1, 0, 0},
        {0, 0, 0, 0, 0}
    };

    pair<int, int> start = {0, 0};
    pair<int, int> goal = {4, 4};

    vector<pair<int, int>> path = a_star(grid, start, goal);

    if (!path.empty()) {
        cout << "최단 경로 길이: " << path.size() - 1 << "\n경로: ";
        for (auto [x, y] : path) {
            cout << "(" << x << ", " << y << ") ";
        }
        cout << endl;
    } else {
        cout << "No Path" << endl;
    }

    return 0;
}
```

## 구현 설명

### 1. 주요 구성 요소
* **Node 구조체**: 현재 위치(x, y), 비용(cost), 우선순위(priority) 정보 저장
* **휴리스틱 함수**: 맨해튼 거리를 사용한 목표까지의 예상 비용 계산
* **우선순위 큐**: f(n) = g(n) + h(n) 값이 가장 작은 노드 우선 처리

### 2. 알고리즘 동작 과정
1. 시작 노드를 우선순위 큐에 삽입
2. 우선순위가 가장 높은 노드를 선택
3. 목표 노드에 도달했는지 확인
4. 인접 노드들을 탐색하고 비용 계산
5. 더 나은 경로를 발견하면 정보 업데이트
6. 목표에 도달할 때까지 2-5 반복

### 3. 주요 데이터 구조
* **visited**: 노드 방문 여부 체크
* **cost**: 시작점에서 각 노드까지의 최소 비용
* **parent**: 경로 추적을 위한 부모 노드 정보

## 성능 분석

### 시간 복잡도
* O((V + E) * log V)
  * V: 노드 수 (격자 크기)
  * E: 간선 수 (이동 가능한 경로)
* 우선순위 큐 연산: O(log V)

### 공간 복잡도
* O(V): 방문 배열, 비용 배열, 부모 배열 저장

## 최적화 팁
1. 방문 체크를 통한 중복 탐색 방지
2. 우선순위 큐를 사용한 효율적인 노드 선택
3. 정확한 휴리스틱 함수 사용
4. 불필요한 노드 탐색 최소화

## 활용 분야
* 게임 AI 길찾기
* 로봇 내비게이션
* 경로 계획
* 미로 탐색

이 페이지는 A* 알고리즘의 구현과 설명을 포함하고 있으며, 다음과 같은 내용을 담고 있습니다:
1. 문제 설명과 입출력 예시
2. 전체 소스 코드
3. 구현 설명과 주요 구성 요소
4. 성능 분석
5. 최적화 팁과 활용 분야