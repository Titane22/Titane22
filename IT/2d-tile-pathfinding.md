---
layout: page
title: 2D 타일 기반 경로 탐색 알고리즘
description: >
  BFS를 이용한 2D 격자에서의 최단 경로 탐색 구현
hide_description: false
---


## 문제 설명
2D 격자(grid)에서 로봇이 출발점에서 도착점까지 최단 경로를 찾아 이동하는 문제입니다.

### 조건
* 격자 크기: n x m (2 ≤ n, m ≤ 100)
* 격자 데이터: 0(이동 가능), 1(장애물)
* 상하좌우 이동만 가능
* 출발점과 도착점은 항상 이동 가능한 칸

### 입력 예시 
```plaintext
예제 입력
5 5
0 0 1 0 0
0 1 1 0 1
0 0 0 0 1
1 1 1 0 0
0 0 0 0 0
0 0
4 4
```

### 출력 예시
```plaintext
최단 경로 길이: 8
복원된 경로: (0, 0) (1, 0) (2, 0) (2, 1) (2, 2) (3, 3) (4, 3) (4, 4)
```

## 해결 방법

### 1. 구현 코드
```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

#define MAX_SIZE 100
#define INF 1e9

// 전역 변수 선언
int n, m;                      // 격자 크기
int sx, sy, ex, ey;           // 시작점과 끝점 좌표
int map[MAX_SIZE][MAX_SIZE];  // 격자 맵
int cost[MAX_SIZE][MAX_SIZE]; // 각 위치까지의 최단 거리
pair<int, int> parent[MAX_SIZE][MAX_SIZE]; // 경로 복원용 부모 노드 저장
pair<int, int> direction[4];
direction[0] = make_pair(-1, 0);  // 상
direction[1] = make_pair(0, -1);  // 좌
direction[2] = make_pair(1, 0);   // 하
direction[3] = make_pair(0, 1);   // 우

// 유효한 좌표인지 확인하는 함수
bool IsArea(int x, int y) {
    return x >= 0 && x < m && y >= 0 && y < n;
}

// BFS로 최단 경로 찾기
int BFS() {
    queue<pair<int, int>> q;
    
    // 시작점 초기화
    q.push({sy, sx});
    cost[sy][sx] = 0;
    parent[sy][sx] = {-1, -1};

    while (!q.empty()) {
        auto current = q.front();
        q.pop();

        // 도착점에 도달한 경우
        if (current.first == ey && current.second == ex) {
            return cost[ey][ex];
        }

        // 4방향 탐색
        for (int d = 0; d < 4; d++) {
            int cy = current.first + direction[d].first;
            int cx = current.second + direction[d].second;

            // 유효한 이동인지 확인
            if (IsArea(cx, cy) && map[cy][cx] == 0 && 
                cost[cy][cx] > cost[current.first][current.second] + 1) {
                cost[cy][cx] = cost[current.first][current.second] + 1;
                parent[cy][cx] = current;
                q.push({cy, cx});
            }
        }
    }
    return -1; // 경로를 찾지 못한 경우
}

// 경로 복원 및 출력 함수
void RestorePath() {
    vector<pair<int, int>> path;
    pair<int, int> current = {ey, ex};

    // 도착점부터 시작점까지 역추적
    while (current.first != -1 && current.second != -1) {
        path.push_back(current);
        current = parent[current.first][current.second];
    }

    // 경로 출력 (역순으로)
    cout << "복원된 경로: ";
    for (auto it = path.rbegin(); it != path.rend(); ++it) {
        cout << "(" << it->first << ", " << it->second << ") ";
    }
    cout << endl;
}

int main() {
    // 입력 받기
    cin >> n >> m;

    // 맵 정보 입력 및 비용 배열 초기화
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> map[i][j];
            cost[i][j] = INF;
        }
    }

    // 시작점과 도착점 입력
    cin >> sy >> sx >> ey >> ex;

    // BFS 실행 및 결과 출력
    int result = BFS();
    
    if (result != -1) {
        cout << "최단 경로 길이: " << result << endl;
        RestorePath();
    } else {
        cout << "경로가 존재하지 않습니다." << endl;
    }

    return 0;
}
```

## 구현 설명

### 1. 주요 구성 요소
* **방향 배열**: 상하좌우 이동을 위한 방향 벡터
* **cost 배열**: 각 위치까지의 최단 거리 저장
* **parent 배열**: 경로 복원을 위한 부모 노드 저장

### 2. BFS 알고리즘
* 큐를 사용하여 현재 위치에서 갈 수 있는 모든 방향 탐색
* 방문하지 않은 칸이면서 이동 가능한 칸일 경우 큐에 추가
* 각 위치까지의 최단 거리와 부모 노드 정보 갱신

### 3. 경로 복원
* 도착점부터 시작하여 parent 배열을 따라 역추적
* 시작점에 도달할 때까지 경로를 vector에 저장
* 저장된 경로를 역순으로 출력

## 시간 복잡도
* O(N × M): 모든 칸을 한 번씩 방문
* N: 격자의 세로 크기
* M: 격자의 가로 크기
 
## 활용 분야
* 게임 AI 경로 탐색
* 로봇 내비게이션
* 미로 찾기 알고리즘
* 타일 기반 게임 맵 설계

## 대체 구현 코드
다음은 동일한 문제에 대한 다른 구현 방식입니다.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <stack>
using namespace std;

const int MAX_SIZE = 100;
int n, m;
int map[MAX_SIZE][MAX_SIZE];  // 지도
bool visited[MAX_SIZE][MAX_SIZE];  // 방문 체크
pair<int, int> parent[MAX_SIZE][MAX_SIZE];  // 부모 노드 저장
pair<int, int> directions[4] = { {-1, 0}, {1, 0}, {0, -1}, {0, 1} };  // 상하좌우

pair<int, int> start, dest;

// 범위 검사
bool IsWithinBounds(int x, int y) {
    return x >= 0 && x < m && y >= 0 && y < n;
}

// BFS 탐색
bool BFS() {
    queue<pair<int, int>> q;
    q.push(start);
    visited[start.first][start.second] = true;

    while (!q.empty()) {
        auto [cy, cx] = q.front();
        q.pop();

        // 목적지 도달 시 탐색 종료
        if (make_pair(cy, cx) == dest) return true;

        for (auto [dy, dx] : directions) {
            int ny = cy + dy, nx = cx + dx;

            if (IsWithinBounds(nx, ny) && map[ny][nx] == 0 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                parent[ny][nx] = { cy, cx };  // 부모 노드 설정
                q.push({ ny, nx });
            }
        }
    }

    return false;  // 목적지에 도달하지 못한 경우
}

// 경로 복원 및 출력
void PrintPath() {
    stack<pair<int, int>> path;
    auto current = dest;

    while (current != start) {
        path.push(current);
        current = parent[current.first][current.second];
    }
    path.push(start);

    cout << "최단 거리: " << path.size() - 1 << endl;
    cout << "경로: ";
    while (!path.empty()) {
        auto [y, x] = path.top();
        path.pop();
        cout << "(" << y << "," << x << ")";
        if (!path.empty()) cout << " -> ";
    }
    cout << endl;
}

int main() {
    cin >> n >> m;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> map[i][j];
            visited[i][j] = false;
        }
    }

    cin >> start.first >> start.second >> dest.first >> dest.second;

    if (start == dest) {
        cout << "최단 거리: 0" << endl;
        cout << "경로: (" << start.first << "," << start.second << ")" << endl;
    } else if (BFS()) {
        PrintPath();
    } else {
        cout << "경로가 존재하지 않습니다." << endl;
    }

    return 0;
}
```

이 구현의 주요 차이점:
1. 구조체 대신 pair를 사용하여 좌표 표현
2. 경로 출력 시 스택을 사용하여 역순 출력
3. 방문 체크를 별도의 배열로 관리
4. 구조화된 바인딩(structured binding)을 사용하여 코드 가독성 향상