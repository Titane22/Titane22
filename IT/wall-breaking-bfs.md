---
layout: page
title: 벽 부수고 이동하기 2 (BFS)
description: >
  3차원 방문 배열을 활용한 BFS 최단 경로 문제 해결
---

# 벽 부수고 이동하기 2

## 문제 설명
N×M 크기의 맵에서 최대 K개의 벽을 부수며 (1,1)에서 (N,M)까지의 최단 경로를 찾는 문제입니다.

## 핵심 아이디어
1. **3차원 방문 배열 활용**
   - `visited[y][x][k]`: (y,x) 위치에서 k개의 벽을 부순 상태
   - 같은 위치라도 부순 벽의 개수에 따라 다른 상태로 처리

2. **BFS를 통한 최단 경로 탐색**
   - 큐에 현재 위치와 부순 벽의 개수를 함께 저장
   - 모든 가능한 상태를 너비 우선으로 탐색

## 구현 코드
```cpp
#include <iostream>
#include <vector>
#include <tuple>
#include <queue>
#include <cstring>
using namespace std;

int n, m, k;
int map[1000][1000];
bool visisted[1000][1000][11];
int dist[1000][1000][11];
vector<pair<int, int>> dir = { {0, 1}, {0, -1}, {1, 0}, {-1, 0} };

int bfs()
{
    memset(dist, -1, sizeof(dist));
    memset(visisted, false, sizeof(visisted));

    queue<tuple<int, int, int>> q;
    q.push({0, 0, 0});
    visisted[0][0][0] = true;
    dist[0][0][0] = 0;

    while (!q.empty())
    {
        int x, y, z;
        tie(x, y, z) = q.front();
        q.pop();

        if (x == m - 1 && y == n - 1)
        {
            return dist[y][x][z];
        }

        for (int d = 0; d < 4; d++)
        {
            int nx = x + dir[d].second;
            int ny = y + dir[d].first;

            if (nx >= 0 && nx < m && ny >= 0 && ny < n)
            {
                // 벽을 만난 경우
                if (map[ny][nx] == 1 && z + 1 <= k && !visisted[ny][nx][z + 1])
                {
                    q.push({ nx, ny, z + 1 });
                    visisted[ny][nx][z + 1] = true;
                    dist[ny][nx][z + 1] = dist[y][x][z] + 1;
                }
                // 빈 공간을 만난 경우
                else if (map[ny][nx] == 0 && !visisted[ny][nx][z])
                {
                    q.push({ nx, ny, z });
                    visisted[ny][nx][z] = true;
                    dist[ny][nx][z] = dist[y][x][z] + 1;
                }
            }
        }
    }

    return -1;
}
```

## 주요 포인트
1. **상태 관리**
   - 위치(x,y)와 부순 벽의 개수(z)로 상태 표현
   - 방문 배열과 거리 배열을 3차원으로 관리

2. **이동 처리**
   - 벽을 만난 경우: 부술 수 있다면 부수고 이동
   - 빈 공간: 그대로 이동

3. **종료 조건**
   - 목적지 도달: 현재까지의 거리 반환
   - 모든 탐색 완료: -1 반환 