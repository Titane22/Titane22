---
layout: page
title: 이징 함수 치트 시트
description: >
  자연스러운 애니메이션을 위한 이징(Easing) 함수의 종류와 활용법을 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [animation, math]
---

<style>
.easing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.easing-card {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1rem;
  color: white;
}

.easing-graph {
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
}

.easing-graph path {
  fill: none;
  stroke-width: 2;
}

.easing-graph .in {
  stroke: #4ade80;
}

.easing-graph .out {
  stroke: #ffffff;
}

.easing-graph .inout {
  stroke: #60a5fa;
}

.easing-name {
  text-align: center;
  font-size: 0.9rem;
  margin: 0;
}

.demo-container {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
}

.demo-ball {
  width: 20px;
  height: 20px;
  background: #4ade80;
  border-radius: 50%;
  position: absolute;
  top: -8px;
  left: 0;
  animation: moveRight 2s infinite;
}

@keyframes moveRight {
  from {
    left: 0;
  }
  to {
    left: calc(100% - 20px);
  }
}
</style>

# 이징 함수 치트 시트

이징 함수는 시간에 따른 파라미터의 변화율을 지정합니다. 자연스럽고 매력적인 애니메이션을 만드는 데 필수적인 요소입니다.
{:.lead}

* toc
{:toc .large-only}

## 주요 이징 함수 종류

### Sine 이징
```mermaid
graph LR
    A[시작] -->|easeInSine| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C20,100 40,0 100,0" />
    </svg>
    <p class="easing-name">easeInSine</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.12, 0, 0.39, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C60,0 80,100 100,100" />
    </svg>
    <p class="easing-name">easeOutSine</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C20,100 20,0 50,0 S80,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutSine</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1)"></div>
    </div>
  </div>
</div>

1. **easeInSine** - 0 속도에서 시작하여 점차 가속
2. **easeOutSine** - 감속하여 0 속도로 끝남
3. **easeInOutSine** - 중간까지 가속한 후 감속

### Quad 이징
```mermaid
graph LR
    A[시작] -->|easeInQuad| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C40,100 60,0 100,0" />
    </svg>
    <p class="easing-name">easeInQuad</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.11, 0, 0.5, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C40,0 60,100 100,100" />
    </svg>
    <p class="easing-name">easeOutQuad</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.5, 1, 0.89, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C30,100 30,0 50,0 S70,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutQuad</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1)"></div>
    </div>
  </div>
</div>

1. **easeInQuad** - 0 속도에서 시작하여 제곱으로 가속
2. **easeOutQuad** - 제곱으로 감속하여 0 속도로 끝남
3. **easeInOutQuad** - 중간까지 제곱 가속 후 제곱 감속

### Cubic 이징
```mermaid
graph LR
    A[시작] -->|easeInCubic| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C50,100 70,0 100,0" />
    </svg>
    <p class="easing-name">easeInCubic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C30,0 50,100 100,100" />
    </svg>
    <p class="easing-name">easeOutCubic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C25,100 25,0 50,0 S75,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutCubic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1)"></div>
    </div>
  </div>
</div>

1. **easeInCubic** - 0 속도에서 시작하여 세제곱으로 가속
2. **easeOutCubic** - 세제곱으로 감속하여 0 속도로 끝남
3. **easeInOutCubic** - 중간까지 세제곱 가속 후 세제곱 감속

### Quart 이징
```mermaid
graph LR
    A[시작] -->|easeInQuart| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C60,100 80,0 100,0" />
    </svg>
    <p class="easing-name">easeInQuart</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.5, 0, 0.75, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C20,0 40,100 100,100" />
    </svg>
    <p class="easing-name">easeOutQuart</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C20,100 20,0 50,0 S80,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutQuart</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1)"></div>
    </div>
  </div>
</div>

1. **easeInQuart** - 0 속도에서 시작하여 4제곱으로 가속
2. **easeOutQuart** - 4제곱으로 감속하여 0 속도로 끝남
3. **easeInOutQuart** - 중간까지 4제곱 가속 후 4제곱 감속

### Quint 이징
```mermaid
graph LR
    A[시작] -->|easeInQuint| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C80,100 90,0 100,0" />
    </svg>
    <p class="easing-name">easeInQuint</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C10,0 20,100 100,100" />
    </svg>
    <p class="easing-name">easeOutQuint</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C10,100 10,0 50,0 S90,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutQuint</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1)"></div>
    </div>
  </div>
</div>

1. **easeInQuint** - 0 속도에서 시작하여 5제곱으로 가속
2. **easeOutQuint** - 5제곱으로 감속하여 0 속도로 끝남
3. **easeInOutQuint** - 중간까지 5제곱 가속 후 5제곱 감속

### Expo 이징
```mermaid
graph LR
    A[시작] -->|easeInExpo| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C70,100 90,0 100,0" />
    </svg>
    <p class="easing-name">easeInExpo</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.7, 0, 0.84, 0)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C10,0 30,100 100,100" />
    </svg>
    <p class="easing-name">easeOutExpo</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C15,100 15,0 50,0 S85,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutExpo</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.87, 0, 0.13, 1)"></div>
    </div>
  </div>
</div>

1. **easeInExpo** - 0 속도에서 시작하여 지수적으로 가속
2. **easeOutExpo** - 지수적으로 감속하여 0 속도로 끝남
3. **easeInOutExpo** - 중간까지 지수 가속 후 지수 감속

### Circ 이징
```mermaid
graph LR
    A[시작] -->|easeInCirc| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 Q50,100 100,0" />
    </svg>
    <p class="easing-name">easeInCirc</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 Q50,100 100,100" />
    </svg>
    <p class="easing-name">easeOutCirc</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C10,100 10,0 50,0 S90,100 100,100" />
    </svg>
    <p class="easing-name">easeInOutCirc</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.85, 0, 0.15, 1)"></div>
    </div>
  </div>
</div>

1. **easeInCirc** - 0 속도에서 시작하여 원형으로 가속
2. **easeOutCirc** - 원형으로 감속하여 0 속도로 끝남
3. **easeInOutCirc** - 중간까지 원형 가속 후 원형 감속

### Back 이징
```mermaid
graph LR
    A[시작] -->|easeInBack| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 C40,100 60,110 100,0" />
    </svg>
    <p class="easing-name">easeInBack</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.6, -0.28, 0.735, 0.045)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 C40,-10 60,0 100,100" />
    </svg>
    <p class="easing-name">easeOutBack</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 C30,110 30,-10 50,0 S70,110 100,100" />
    </svg>
    <p class="easing-name">easeInOutBack</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)"></div>
    </div>
  </div>
</div>

1. **easeInBack** - 시작점을 약간 넘어갔다가 가속
2. **easeOutBack** - 끝점을 약간 넘어갔다가 감속
3. **easeInOutBack** - 양 끝점을 약간씩 넘어가는 가속과 감속

### Elastic 이징
```mermaid
graph LR
    A[시작] -->|easeInElastic| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 120 120">
      <path class="in" d="M10,110 C20,110 30,110 40,30 S50,80 60,30 S70,80 80,30 S90,80 100,30 S110,110 110,30" />
    </svg>
    <p class="easing-name">easeInElastic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.95, 0.05, 0.795, 0.035)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 120 120">
      <path class="out" d="M10,10 C20,90 30,30 40,90 S50,30 60,90 S70,90 110,110" />
    </svg>
    <p class="easing-name">easeOutElastic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 120 120">
      <path class="inout" d="M10,110 C20,90 25,30 35,90 S45,30 60,30 S75,90 85,30 S95,90 110,110" />
    </svg>
    <p class="easing-name">easeInOutElastic</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1)"></div>
    </div>
  </div>
</div>

1. **easeInElastic** - 탄성을 가진 시작 모션
2. **easeOutElastic** - 탄성을 가진 종료 모션
3. **easeInOutElastic** - 시작과 끝에 탄성을 가진 모션

### Bounce 이징
```mermaid
graph LR
    A[시작] -->|easeInBounce| B[끝]
    style A fill:#1473e6
    style B fill:#247b5e
```

<div class="easing-grid">
  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="in" d="M0,100 L25,50 L50,75 L75,87.5 L100,0" />
    </svg>
    <p class="easing-name">easeInBounce</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.36, 0, 0.66, -0.56)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="out" d="M0,0 L25,87.5 L50,75 L75,50 L100,100" />
    </svg>
    <p class="easing-name">easeOutBounce</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)"></div>
    </div>
  </div>

  <div class="easing-card">
    <svg class="easing-graph" viewBox="0 0 100 100">
      <path class="inout" d="M0,100 L25,50 L50,75 L75,25 L100,100" />
    </svg>
    <p class="easing-name">easeInOutBounce</p>
    <div class="demo-container">
      <div class="demo-ball" style="animation-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6)"></div>
    </div>
  </div>
</div>

1. **easeInBounce** - 튀어오르는 시작 모션
2. **easeOutBounce** - 튀어오르는 종료 모션
3. **easeInOutBounce** - 시작과 끝에 튀어오르는 모션

## 이징 함수의 활용
{:.lead}

이징 함수는 다양한 형태로 존재하며, 각각의 특성에 따라 다른 애니메이션을 만들 수 있습니다. 위에서 언급한 이징 함수들은 가장 일반적인 형태를 보여주는 것입니다.

### 이징 함수의 사용법

이징 함수를 사용하는 방법은 간단합니다. 이징 함수를 애니메이션 파라미터에 적용하면 됩니다. 예를 들어, 트랜지션의 위치를 애니메이션하는 경우, 이징 함수를 적용하여 위치를 제어할 수 있습니다.
{:.note}

이징 함수를 사용하는 방법은 간단합니다. 이징 함수를 애니메이션 파라미터에 적용하면 됩니다. 예를 들어, 트랜지션의 위치를 애니메이션하는 경우, 이징 함수를 적용하여 위치를 제어할 수 있습니다.

## 참고 자료

이징 함수에 대한 더 자세한 정보는 다음 자료를 참고하세요:
- [Easing Functions](https://easings.net/)
- [Robert Penner's Easing Equations](https://robertpenner.com/easing/)