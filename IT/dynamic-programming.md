# 동적 프로그래밍 (Dynamic Programming)

## 🔹 개요
동적 프로그래밍(DP)은 복잡한 문제를 더 작은 하위 문제로 나누어 해결하는 알고리즘 설계 기법입니다. 이번 예제에서는 위상 정렬과 DP를 결합한 "ACM Craft" 문제를 통해 DP의 활용을 살펴보겠습니다.

## 🔹 ACM Craft 문제
### 문제 설명
- N개의 건물과 건설 규칙이 주어집니다.
- 각 건물은 특정 시간이 소요되며, 선행 건물이 완성되어야 건설 가능합니다.
- 특정 건물을 건설하는데 필요한 최소 시간을 계산해야 합니다.

### 입력 형식
```
첫 줄: 테스트 케이스 개수 T
각 테스트 케이스:
    첫 줄: 건물의 수 N, 규칙의 수 K
    둘째 줄: N개의 건물 건설 시간
    다음 K개 줄: 건설 규칙 (X Y)
    마지막 줄: 목표 건물 번호 W
```

### 예제 입력
```
2
4 4
10 1 100 10
1 2
1 3
2 4
3 4
4
8 8
10 20 1 5 8 7 1 43
1 2
1 3
2 4
2 5
3 6
5 7
6 7
7 8
7
```

### 예제 출력
```
120
39
```

## 🔹 해결 코드
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

void solve() {
    int T;
    cin >> T;

    while (T--) {
        int N, K;
        cin >> N >> K;

        // 건물 정보 초기화
        vector<int> build_time(N + 1);
        vector<int> indegree(N + 1, 0);
        vector<vector<int>> adj(N + 1);
        vector<int> dp(N + 1, 0);  // 각 건물까지의 최소 건설 시간

        // 건설 시간 입력
        for (int i = 1; i <= N; i++) {
            cin >> build_time[i];
        }

        // 건설 규칙 입력
        for (int i = 0; i < K; i++) {
            int X, Y;
            cin >> X >> Y;
            adj[X].push_back(Y);
            indegree[Y]++;
        }

        int target;
        cin >> target;

        // 위상 정렬 시작
        queue<int> q;
        for (int i = 1; i <= N; i++) {
            if (indegree[i] == 0) {
                q.push(i);
                dp[i] = build_time[i];
            }
        }

        // 위상 정렬 수행
        while (!q.empty()) {
            int curr = q.front();
            q.pop();

            for (int next : adj[curr]) {
                dp[next] = max(dp[next], dp[curr] + build_time[next]);
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                }
            }
        }

        cout << dp[target] << endl;
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    solve();
    return 0;
}
```

## 🔹 알고리즘 설명
1. **DP 상태 정의**
   - `dp[i]`: i번 건물을 짓는데 필요한 최소 시간
   - 이전 건물들의 완성 시간 중 최대값 + 현재 건물의 건설 시간

2. **위상 정렬과의 결합**
   - 위상 정렬로 건설 순서 보장
   - DP로 각 단계에서의 최소 시간 계산
   - 진입차수가 0인 건물부터 시작하여 순차적으로 처리

3. **점화식**
   ```cpp
   dp[next] = max(dp[next], dp[curr] + build_time[next])
   ```
   - `dp[curr]`: 현재까지의 건설 시간
   - `build_time[next]`: 다음 건물의 건설 소요 시간

## 🔹 시간 복잡도
- V: 건물의 수, E: 규칙의 수
- 위상 정렬: O(V + E)
- 전체 시간 복잡도: O(T * (V + E))

## 🔹 공간 복잡도
- O(V + E): 인접 리스트와 DP 배열 저장 