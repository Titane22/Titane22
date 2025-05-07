---
layout: page
title: 컴퓨터 그래픽스
description: >
  3D 그래픽스의 기초 개념과 렌더링 파이프라인을 설명합니다.
kramdown:
  math_engine: mathjax
---


## 3D 변환 (Transformations)
### 행렬 변환
3D 공간에서의 기본적인 변환 행렬들입니다:

$$
\text{Model Matrix: } M = T \cdot R \cdot S
$$

$$
\text{View Matrix: } V = \left[
\begin{array}{cccc}
r_x & r_y & r_z & -e_r \\
u_x & u_y & u_z & -e_u \\
f_x & f_y & f_z & -e_f \\
0 & 0 & 0 & 1
\end{array}
\right]
$$

$$
\text{Projection Matrix: } P = \left[
\begin{array}{cccc}
\frac{2n}{r-l} & 0 & \frac{r+l}{r-l} & 0 \\
0 & \frac{2n}{t-b} & \frac{t+b}{t-b} & 0 \\
0 & 0 & -\frac{f+n}{f-n} & -\frac{2fn}{f-n} \\
0 & 0 & -1 & 0
\end{array}
\right]
$$

## 조명 (Lighting)
### 퐁 조명 모델
퐁 조명 모델은 주변광, 확산광, 반사광의 합으로 계산됩니다:

$$
I = I_a + I_d + I_s
$$

$$
\text{where: } I_a = k_a \cdot a, \quad I_d = k_d(L \cdot N), \quad I_s = k_s(R \cdot V)^n
$$

### 그림자 매핑
그림자 매핑의 기본 원리입니다:

$$
\text{Shadow test: } z_{current} > z_{stored}
$$

$$
\text{Bias: } b = \max\{\tan(\theta) \cdot \text{texel}, \text{min\_bias}\}
$$

## 텍스처링 (Texturing)
### UV 매핑
텍스처 좌표 계산과 밉맵 레벨 결정:

$$
\text{Texture coordinates: } (u,v) = \left(\frac{x}{w}, \frac{y}{h}\right)
$$

$$
\text{Mipmap level: } \lambda = \log_2\left(\max\left\{\sqrt{\left(\frac{\partial u}{\partial x}\right)^2 + \left(\frac{\partial v}{\partial x}\right)^2}, \sqrt{\left(\frac{\partial u}{\partial y}\right)^2 + \left(\frac{\partial v}{\partial y}\right)^2}\right\}\right)
$$

## PBR (Physically Based Rendering)
### 프레넬 방정식

$$
F_0 = \left(\frac{n_1 - n_2}{n_1 + n_2}\right)^2
$$

$$
F(\theta) = F_0 + (1 - F_0)(1 - \cos\theta)^5
$$

### BRDF

$$
f_r = \frac{DFG}{4(N \cdot L)(N \cdot V)}
$$

$$
\text{where: } D = \frac{\alpha^2}{\pi((N \cdot H)^2(\alpha^2-1)+1)^2}, \quad G = G_1(L)G_1(V)
$$