---
layout: page
title: 게임 개발자를 위한 수학
description: >
  게임 개발에 필수적인 수학적 개념들을 설명합니다.
kramdown:
  math_engine: mathjax
---

# 게임 수학

## 벡터 (Vectors)
벡터는 크기와 방향을 가진 양을 나타냅니다:

$$
\text{2D Vector: } \vec{v} = (x, y)
$$

$$
\text{3D Vector: } \vec{v} = (x, y, z)
$$

### 벡터 연산
$$
\text{Addition: } \vec{a} + \vec{b} = (a_x + b_x, a_y + b_y, a_z + b_z)
$$

$$
\text{Scalar Multiplication: } c\vec{v} = (cx, cy, cz)
$$

$$
\text{Dot Product: } \vec{a} \cdot \vec{b} = a_x b_x + a_y b_y + a_z b_z
$$

$$
\text{Cross Product: } \vec{a} \times \vec{b} = (a_y b_z - a_z b_y, a_z b_x - a_x b_z, a_x b_y - a_y b_x)
$$

### 벡터의 정규화
$$
\text{Magnitude: } |\vec{v}| = \sqrt{x^2 + y^2 + z^2}
$$

$$
\text{Normalized Vector: } \hat{v} = \frac{\vec{v}}{|\vec{v}|}
$$

## 행렬 (Matrices)
### 변환 행렬
$$
\begin{aligned}
\text{Translation: } &T = \begin{pmatrix} 
1 & 0 & 0 & t_x \\
0 & 1 & 0 & t_y \\
0 & 0 & 1 & t_z \\
0 & 0 & 0 & 1
\end{pmatrix} \\[2em]
\text{Rotation (X-axis): } &R_x = \begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & \cos\theta & -\sin\theta & 0 \\
0 & \sin\theta & \cos\theta & 0 \\
0 & 0 & 0 & 1
\end{pmatrix} \\[2em]
\text{Scale: } &S = \begin{pmatrix}
s_x & 0 & 0 & 0 \\
0 & s_y & 0 & 0 \\
0 & 0 & s_z & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\end{aligned}
$$