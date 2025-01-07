---
layout: page
title: 2D 물체 충돌 처리
description: >
  2D 공간에서의 원형 물체 충돌 시뮬레이션 구현
hide_description: false
---

## 문제 설명
2D 공간에서 두 개의 원형 물체가 충돌할 때의 물리 시뮬레이션을 구현하는 문제입니다.

### 조건
* 두 물체는 각각 다른 위치와 속도를 가짐
* 충돌 후에는 운동량 보존 법칙에 따라 속도가 변경됨
* 충돌하지 않는 경우 직선 운동 유지

### 입력 예시
```plaintext
물체 A: (x1, y1) = (0, 0), r1 = 5, (vx1, vy1) = (2, 3)
물체 B: (x2, y2) = (10, 0), r2 = 5, (vx2, vy2) = (-3, 1)
```

### 출력 예시
```plaintext
충돌 여부: Yes
충돌 후 물체 A 속도: (vx1', vy1') = (-2.5, 1.5)
충돌 후 물체 B 속도: (vx2', vy2') = (1.5, 4.5)
충돌 후 물체 A 위치: (x1', y1') = (-2.5, 1.5)
충돌 후 물체 B 위치: (x2', y2') = (11.5, 4.5)
```

## 해결 방법

### 1. 구현 코드
```cpp
#include <iostream>
#include <cmath>

using namespace std;

// 벡터 구조체 정의
struct ObjVector {
    double x;
    double y;
};

// 물체 클래스 정의
class Obj {
public:
    double x;
    double y;
    int r;
    ObjVector v;

    Obj(double x, double y, int r, ObjVector v) 
        : x(x), y(y), r(r), v(v) {}
};

// 충돌 여부 확인 함수
bool IsCrashed(double x1, double x2, double y1, double y2, int r1, int r2) {
    double sumRadius = r1 + r2;
    double d = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    return d <= sumRadius;
}

// 충돌 후 속도 및 위치 계산 함수
void AfterCollision(Obj& obj1, Obj& obj2, int m1, int m2, double deltaTime) {
    double dx = obj1.x - obj2.x;
    double dy = obj1.y - obj2.y;
    double distanceSquared = dx * dx + dy * dy;

    if (distanceSquared == 0) {
        cout << "Error: 두 물체의 위치가 동일합니다." << endl;
        return;
    }

    // 물체 A의 새로운 속도
    double v1x = obj1.v.x - (2.0 * m2 / (m1 + m2)) * 
                 ((obj1.v.x - obj2.v.x) * dx + (obj1.v.y - obj2.v.y) * dy) / 
                 distanceSquared * dx;
    double v1y = obj1.v.y - (2.0 * m2 / (m1 + m2)) * 
                 ((obj1.v.x - obj2.v.x) * dx + (obj1.v.y - obj2.v.y) * dy) / 
                 distanceSquared * dy;

    // 물체 B의 새로운 속도
    double v2x = obj2.v.x - (2.0 * m1 / (m1 + m2)) * 
                 ((obj2.v.x - obj1.v.x) * -dx + (obj2.v.y - obj1.v.y) * -dy) / 
                 distanceSquared * -dx;
    double v2y = obj2.v.y - (2.0 * m1 / (m1 + m2)) * 
                 ((obj2.v.x - obj1.v.x) * -dx + (obj2.v.y - obj1.v.y) * -dy) / 
                 distanceSquared * -dy;

    // 속도 업데이트
    obj1.v.x = v1x;
    obj1.v.y = v1y;
    obj2.v.x = v2x;
    obj2.v.y = v2y;

    // 위치 업데이트
    obj1.x += obj1.v.x * deltaTime;
    obj1.y += obj1.v.y * deltaTime;
    obj2.x += obj2.v.x * deltaTime;
    obj2.y += obj2.v.y * deltaTime;

    // 결과 출력
    cout << "충돌 후 물체 A 속도: (" << v1x << ", " << v1y << ")" << endl;
    cout << "충돌 후 물체 B 속도: (" << v2x << ", " << v2y << ")" << endl;
    cout << "충돌 후 물체 A 위치: (" << obj1.x << ", " << obj1.y << ")" << endl;
    cout << "충돌 후 물체 B 위치: (" << obj2.x << ", " << obj2.y << ")" << endl;
}

int main() {
    // 물체 초기화
    Obj a(0, 0, 5, {2, 3});
    Obj b(10, 0, 5, {-3, 1});

    double deltaTime = 1.0; // 시간 단위 (초)
    
    cout << "충돌 여부: ";
    if (IsCrashed(a.x, b.x, a.y, b.y, a.r, b.r)) {
        cout << "Yes" << endl;
        AfterCollision(a, b, a.r, b.r, deltaTime); // 반지름을 질량으로 가정
    } else {
        cout << "No" << endl;
    }

    return 0;
}
```
## 구현 설명

### 1. 주요 구성 요소
* **ObjVector 구조체**: 2D 벡터를 표현
* **Obj 클래스**: 물체의 위치, 반지름, 속도 정보 저장
* **IsCrashed 함수**: 충돌 여부 판단
* **AfterCollision 함수**: 충돌 후 속도와 위치 계산

### 2. 물리 계산
* **충돌 감지**:
  * 두 원의 중심 거리가 반지름 합보다 작거나 같으면 충돌
  * d = √((x₁-x₂)² + (y₁-y₂)²) ≤ r₁ + r₂

* **충돌 후 속도**:
  * 탄성 충돌 공식 사용
  * 운동량과 에너지 보존 법칙 적용
  * 벡터 투영을 통한 속도 계산

### 3. 위치 업데이트
* 시간 단위(deltaTime)를 적용하여 새로운 위치 계산
* x' = x + vx * t
* y' = y + vy * t

## 최적화 및 개선 사항
1. 연속 충돌 처리 추가
2. 회전 운동 구현
3. 마찰력과 감쇠 효과 추가
4. 충돌 해상도 개선

## 활용 분야
* 2D 게임 물리 엔진
* 입자 시뮬레이션
* 충돌 감지 시스템
* 물리 기반 애니메이션

