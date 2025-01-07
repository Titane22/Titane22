---
layout: page
title: 게임 엔진 기초
description: >
  게임 엔진의 기본 구조와 핵심 시스템을 설명합니다.
kramdown:
  math_engine: mathjax
---

## 게임 엔진 아키텍처
### 컴포넌트 기반 시스템
컴포넌트 시스템의 기본 구조입니다:

$$
\text{Entity Components: } E = \left[
\begin{array}{cccc}
c_1 & c_2 & \cdots & c_n
\end{array}
\right]
$$

$$
\text{Component Update: } C_{t+1} = f(C_t, \Delta t)
$$

### 이벤트 시스템
이벤트 처리 시스템의 수학적 표현:

$$
\text{Event Queue: } Q = \left[
\begin{array}{cccc}
e_1 & e_2 & \cdots & e_n
\end{array}
\right]
$$

$$
\text{Event Processing: } P(e) = \sum_{i=1}^n h_i(e)
$$

## 핵심 시스템
### 렌더링 시스템
프레임 시간과 성능 계산:

$$
\text{Frame Time: } \Delta t = t_{i+1} - t_i
$$

$$
\text{FPS: } fps = \frac{1}{\Delta t}
$$

$$
\text{Frame Budget: } B = \frac{1000\text{ ms}}{60\text{ fps}} \approx 16.67\text{ ms}
$$

### 물리 시스템
물리 시뮬레이션 시간 단계:

$$
\text{Physics Step: } \Delta t_{fixed} = \frac{1}{physics\_fps}
$$

$$
\text{Interpolation: } x(t) = x_1 + (x_2 - x_1)\alpha, \quad \alpha = \frac{t - t_1}{t_2 - t_1}
$$

## 최적화
### 메모리 관리
메모리 관리 지표:

$$
\text{Memory Pool: } M = \left[
\begin{array}{cccc}
b_1 & b_2 & \cdots & b_n
\end{array}
\right]
$$

$$
\text{Fragmentation: } F = 1 - \frac{\text{Largest Free Block}}{\text{Total Free Memory}}
$$

### 성능 프로파일링
성능 측정 지표:

$$
\text{CPU Time: } T_{cpu} = \sum_{i=1}^n t_i
$$

$$
\text{Memory Usage: } M_{used} = M_{total} - M_{free}
$$

$$
\text{Load Time: } T_{load} = T_{io} + T_{process}
$$

### LOD (Level of Detail)
LOD 계산:

$$
\text{LOD Level: } L = \left\lfloor\log_2\left(\frac{d}{d_0}\right)\right\rfloor
$$

$$
\text{Vertex Count: } V_L = \frac{V_0}{2^L}
$$