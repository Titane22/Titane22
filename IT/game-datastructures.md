---
layout: page
title: 자료구조와 알고리즘
description: >
  게임 개발에서 자주 사용되는 자료구조와 알고리즘을 설명합니다.
kramdown:
  math_engine: mathjax
---

# 자료구조와 알고리즘

## 기본 자료구조
### 배열과 동적 배열
배열 연산의 복잡도:

$$
\text{Array Access: } O(1) \text{ for } A[i]
$$

$$
\text{Dynamic Array Growth: } capacity_{new} = capacity_{old} \times 2
$$

$$
\text{Amortized Cost: } O(1) \text{ for insertion}
$$

### 연결 리스트
연결 리스트의 구조와 연산:

$$
\text{Node Structure: } Node = \left[
\begin{array}{ccc}
data & next & prev
\end{array}
\right]
$$

$$
\text{List Operations: } \begin{cases}
O(1) & \text{for insert/delete} \\
O(n) & \text{for search}
\end{cases}
$$

### 트리와 그래프
트리와 그래프의 기본 속성:

$$
\text{Binary Tree Node: } Node = \left[
\begin{array}{ccc}
data & left & right
\end{array}
\right]
$$

$$
\text{Tree Height: } h = \log_2(n + 1)
$$

$$
\text{Graph: } G = (V, E)
$$

### 해시 테이블
해시 테이블의 핵심 개념:

$$
\text{Hash Function: } h(k) = k \bmod m
$$

$$
\text{Load Factor: } \alpha = \frac{n}{m}
$$

$$
\text{Collision Resolution: } h_i(k) = (h(k) + i) \bmod m
$$

## 게임 개발 관련 알고리즘
### 경로찾기 (A*, Dijkstra)
경로찾기 알고리즘의 핵심 수식:

$$
\text{A* Function: } f(n) = g(n) + h(n)
$$

$$
\text{where: } \begin{cases}
g(n) = \text{cost from start to n} \\
h(n) = \text{estimated cost from n to goal}
\end{cases}
$$

$$
\text{Dijkstra: } d[v] = \min(d[v], d[u] + w(u,v))
$$

### 공간 분할
공간 분할 기준:

$$
\text{Quadtree Split: } \begin{cases}
(x, y) & \text{for 2D} \\
depth \leq d_{max}
\end{cases}
$$

$$
\text{Octree Split: } \begin{cases}
(x, y, z) & \text{for 3D} \\
depth \leq d_{max}
\end{cases}
$$

### 게임 AI 알고리즘
AI 알고리즘의 수학적 표현:

$$
\text{State Machine: } S \xrightarrow{action} S'
$$

$$
\text{Behavior Tree: } BT = \begin{cases}
\text{Sequence} \\
\text{Selector} \\
\text{Decorator}
\end{cases}
$$

$$
\text{Decision Tree: } P(a|s) = \frac{P(s|a)P(a)}{P(s)}
$$

### 충돌 감지 최적화
충돌 감지의 복잡도:

$$
\text{Broad Phase: } O(n \log n) \text{ with spatial partitioning}
$$

$$
\text{Narrow Phase: } O(m) \text{ where } m = \text{number of candidates}
$$

$$
\text{Total Complexity: } O(n \log n + m)
$$