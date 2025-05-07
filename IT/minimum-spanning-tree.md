---
layout: page
title: 최소 스패닝 트리 (Minimum Spanning Tree)
description: >
  크루스칼 알고리즘을 이용한 최소 스패닝 트리 구현
---

## 문제 설명
N개의 노드와 M개의 간선으로 이루어진 무방향 가중치 그래프가 주어집니다. 이 그래프에서 최소 스패닝 트리를 구성하는 간선들의 가중치 합을 구하는 문제입니다.

## 입력 형식
- 첫 줄에 정점의 개수 N (1 ≤ N ≤ 1000)과 간선의 개수 M (1 ≤ M ≤ 100,000)이 주어집니다.
- 다음 M개의 줄에는 세 정수 u, v, w가 주어지며, 이는 노드 u와 노드 v를 연결하는 가중치 w의 간선이 존재함을 나타냅니다.
- (1 ≤ u,v ≤ N, 1 ≤ w ≤ 1,000,000)

## 출력 형식
최소 스패닝 트리의 가중치 합을 출력합니다.

## 예제
### 입력 
```plaintext
4 5
1 2 1
2 3 2
3 4 3
4 1 4
1 3 5
``` 

### 출력
```plaintext
7
```

## 구현 코드
크루스칼 알고리즘을 사용한 구현입니다.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

vector<int> parent, rank;

int Find(int x) {
    if (parent[x] != x) {
        parent[x] = Find(parent[x]); // 경로 압축
    }
    return parent[x];
}

bool Union(int x, int y) {
    int rootX = Find(x);
    int rootY = Find(y);

    if (rootX == rootY) return false;

    if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
    } else if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
    } else {
        parent[rootY] = rootX;
        rank[rootX]++;
    }
    return true;
}

int main() {
    int n, m;
    cin >> n >> m;

    vector<Edge> edges(m);
    for (int i = 0; i < m; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].weight;
    }

    sort(edges.begin(), edges.end()); // 간선을 가중치 순으로 정렬

    parent.resize(n + 1);
    rank.resize(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        parent[i] = i;
    }

    int mstWeight = 0;
    for (const Edge& edge : edges) {
        if (Union(edge.u, edge.v)) {
            mstWeight += edge.weight;
        }
    }

    cout << mstWeight << endl;
    return 0;
}
```

## 알고리즘 설명
1. 크루스칼 알고리즘은 그리디 알고리즘의 일종으로, 가장 가중치가 작은 간선부터 선택하여 MST를 구성합니다.
2. Union-Find 자료구조를 사용하여 사이클 형성을 방지합니다.
3. 간선들을 가중치 기준으로 오름차순 정렬한 후, 사이클을 형성하지 않는 간선들을 순서대로 선택합니다.
4. 선택된 간선들의 가중치 합이 최소 스패닝 트리의 총 가중치가 됩니다.

## 시간 복잡도
- 간선 정렬: O(M log M)
- Union-Find 연산: O(α(N)) (거의 상수 시간)
- 전체 시간 복잡도: O(M log M)

여기서 M은 간선의 개수, N은 정점의 개수입니다.