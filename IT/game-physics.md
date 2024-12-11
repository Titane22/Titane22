---
layout: page
title: 게임 물리
description: >
  게임 개발에서 사용되는 물리 시스템의 기초 개념을 설명합니다.
kramdown:
  math_engine: mathjax
---

# 게임 물리

## 운동학 (Kinematics)
### 속도와 가속도

$$
\text{Velocity: } v = \frac{dx}{dt}
$$

$$
\text{Acceleration: } a = \frac{dv}{dt} = \frac{d^2x}{dt^2}
$$

### 운동 방정식

$$
\text{Position: } x(t) = x_0 + v_0t + \frac{1}{2}at^2
$$

$$
\text{Velocity: } v(t) = v_0 + at
$$

$$
\text{Force: } F = ma
$$

## 충돌 감지 (Collision Detection)
### 구체 충돌

$$
\text{Collision occurs when: } \lVert\vec{p_1} - \vec{p_2}\rVert < r_1 + r_2
$$

### AABB 충돌

$$
\text{Collision occurs when: } |A_x - B_x| < \frac{A_{width} + B_{width}}{2} \text{ AND } |A_y - B_y| < \frac{A_{height} + B_{height}}{2}
$$

### 광선 투사 (Ray Casting)
$$
\text{Ray equation: } Ray(t) = \vec{origin} + t\vec{direction}
$$

## 충격과 운동량 (Impulse and Momentum)
### 운동량과 충격량

$$
\text{Momentum: } p = mv
$$

$$
\text{Impulse: } J = F\Delta t = \Delta p
$$

### 탄성 충돌

$$
\text{Final velocity (object 1): } v_{1f} = \frac{(m_1-m_2)v_{1i} + 2m_2v_{2i}}{m_1+m_2}
$$

$$
\text{Conservation of momentum: } m_1v_{1i} + m_2v_{2i} = m_1v_{1f} + m_2v_{2f}
$$

### 마찰력

$$
\text{Friction force: } f = \mu N
$$