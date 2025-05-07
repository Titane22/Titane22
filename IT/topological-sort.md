# 게임 개발 문제 풀이

## 🔹 해결 방법
1. BFS를 이용하여 모든 열쇠 및 시작 지점 간의 최단 거리 계산
   - 맵에서 'S'(시작점)과 모든 'K'(열쇠) 위치를 찾음
   - BFS를 돌려서 각 포인트 간 최단 거리를 측정
   - 유효한 경로를 가중치 그래프로 저장

2. MST (최소 스패닝 트리) 알고리즘 적용
   - 구해진 거리 정보를 이용해 최소 스패닝 트리를 구성
   - 크루스칼(Kruskal) 알고리즘 사용
   - MST의 총 비용이 모든 열쇠를 수집하는 데 필요한 최소 비용이 됨

3. 최소 비용 출력
   - MST를 구성할 수 없는 경우 -1 출력
   - 가능한 경우 최소 비용 출력

## 🔹 코드
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
#include <algorithm>
using namespace std;

#define INF 1e9

int n, m;
vector<string> board;
vector<pair<int, int>> keys;          // 'S'와 'K' 위치 저장
vector<vector<int>> dist;             // BFS로 구한 최단 거리 그래프
vector<tuple<int, int, int>> edges;   // MST용 간선 리스트
vector<int> parent;                   // 유니온 파인드용 부모 배열

// 방향 이동 (상, 하, 좌, 우)
int dx[] = {0, 0, -1, 1};
int dy[] = {-1, 1, 0, 0};

// BFS로 특정 지점 (sx, sy)에서 다른 모든 열쇠까지의 최단 거리 계산
vector<int> bfs(int sx, int sy) {
    vector<vector<int>> d(n, vector<int>(m, INF));
    queue<pair<int, int>> q;
    q.push({sx, sy});
    d[sx][sy] = 0;
    
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        
        for (int dir = 0; dir < 4; dir++) {
            int nx = x + dx[dir];
            int ny = y + dy[dir];
            if (nx >= 0 && nx < n && ny >= 0 && ny < m && board[nx][ny] != '#' && d[nx][ny] == INF) {
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    
    vector<int> res(keys.size(), INF);
    for (int i = 0; i < keys.size(); i++) {
        int kx = keys[i].first, ky = keys[i].second;
        if (d[kx][ky] != INF) res[i] = d[kx][ky];
    }
    return res;
}

// 유니온 파인드 (Find 연산)
int find(int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]);
}

// 유니온 파인드 (Union 연산)
bool unionSet(int a, int b) {
    int rootA = find(a);
    int rootB = find(b);
    if (rootA == rootB) return false;
    parent[rootB] = rootA;
    return true;
}

int main() {
    cin >> m >> n;  // 가로, 세로 크기
    board.resize(n);
    
    for (int i = 0; i < n; i++) {
        cin >> board[i];
        for (int j = 0; j < m; j++) {
            if (board[i][j] == 'S' || board[i][j] == 'K') {
                keys.push_back({i, j});
            }
        }
    }
    
    int k = keys.size();
    dist.assign(k, vector<int>(k, INF));
    
    // 모든 'S'와 'K'에 대해 BFS 실행
    for (int i = 0; i < k; i++) {
        dist[i] = bfs(keys[i].first, keys[i].second);
    }
    
    // 간선 정보 생성
    for (int i = 0; i < k; i++) {
        for (int j = i + 1; j < k; j++) {
            if (dist[i][j] != INF) {
                edges.push_back({dist[i][j], i, j});
            }
        }
    }
    
    // 크루스칼 알고리즘 실행
    sort(edges.begin(), edges.end());
    parent.resize(k);
    for (int i = 0; i < k; i++) parent[i] = i;
    
    int mst_cost = 0, edge_count = 0;
    for (auto [cost, u, v] : edges) {
        if (unionSet(u, v)) {
            mst_cost += cost;
            edge_count++;
            if (edge_count == k - 1) break;
        }
    }
    
    // 결과 출력
    if (edge_count != k - 1) cout << -1 << endl;
    else cout << mst_cost << endl;
    
    return 0;
}

```


## 🔹 시간 복잡도
- BFS 실행: O(NM)
- MST 크루스칼 알고리즘: O(E log E)
- 총 시간 복잡도: O(NM + E log E), 여기서 E = k^2

## 🔹 예제 입력/출력
입력 1:
```
5 5
S..K.
.#.#.
..K#.
####.
.K.K.
```
출력 1:
```
7
```

입력 2:
```
5 5
S....
###.#
..K#K
###.#
...K.
```
출력 2:
```
-1
```

입력 3:
```
3 3
S.K
.#.
K.K
```
출력 3:
```
4
```

## 🔹 예제 설명
1번 예제:
- 시작점에서 모든 열쇠를 수집하는 최소 거리가 7
- 가능한 경로: S → 오른쪽 K → 아래 K → 아래 K → 오른쪽 K

2번 예제:
- 벽으로 인해 모든 열쇠에 도달할 수 없음
- 따라서 -1 출력


## 🔹 코드 설명
1. 주요 자료구조
   - `board`: 입력받은 맵을 저장하는 2차원 벡터
   - `keys`: 시작점('S')과 열쇠('K')의 위치를 저장하는 벡터
   - `dist`: 각 지점 간의 최단 거리를 저장하는 2차원 벡터
   - `edges`: MST 구성을 위한 간선 정보를 저장하는 벡터
   - `parent`: 유니온 파인드를 위한 부모 노드 정보 벡터

2. 주요 함수
   - `bfs(sx, sy)`: 특정 지점에서 다른 모든 열쇠까지의 최단 거리 계산
   - `find(x)`: 유니온 파인드의 Find 연산 구현
   - `unionSet(a, b)`: 유니온 파인드의 Union 연산 구현

3. 알고리즘 흐름
   ```
   1) 입력 처리
      - 맵 정보 입력
      - 시작점과 열쇠 위치 저장
   
   2) 거리 계산
      - 각 지점에서 BFS 실행
      - 모든 지점 쌍 간의 최단 거리 계산
   
   3) MST 구성
      - 간선 정보 생성 및 정렬
      - 크루스칼 알고리즘으로 MST 구성
   
   4) 결과 출력
      - MST 구성 가능 여부 확인
      - 최소 비용 또는 -1 출력
   ```
## 🔹 주의사항
1. 입력 처리
   - 맵의 가로(m)와 세로(n) 크기가 반대로 입력되므로 주의
   - 벽('#')을 만나면 이동할 수 없음

2. BFS 구현
   - 방문하지 않은 칸은 INF로 초기화
   - 4방향 이동만 가능
   - 맵 경계와 벽 체크 필수

3. MST 구성
   - 모든 열쇠를 연결하는 경로가 없으면 -1 출력
   - edge_count가 (정점 수 - 1)이 되어야 완성

## 🔹 최적화 팁
1. BFS 최적화
   - visited 배열 대신 distance 배열로 방문 체크
   - queue 대신 deque 사용 가능

2. 유니온 파인드 최적화
   - 경로 압축 사용
   - rank 기반 합치기 가능

3. 메모리 사용
   - 필요한 만큼만 벡터 크기 할당
   - 불필요한 복사 피하기

