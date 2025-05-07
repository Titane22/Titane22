---
layout: page
title: 직교 정규 기저 (Orthonormal Basis)
description: >
  서로 수직인 세 개의 단위 벡터로 구성된 직교 정규 기저의 구성 방법에 대해 알아봅니다.
sitemap: false
hide_last_modified: true
categories: [game-dev]
tags: [physics, math]
---

## 개요

직교 정규 기저는 서로 수직(orthogonal)이면서 길이가 1인(normal) 세 개의 벡터로 구성된 집합입니다. 이는 3D 공간에서 좌표계를 정의하거나 방향을 표현하는 데 매우 유용합니다.

## 구성 알고리즘

두 개의 비평행 벡터로부터 직교 정규 기저를 구성하는 알고리즘은 다음과 같습니다:

### 입력
- 벡터 a: 방향이 고정된 첫 번째 벡터 (크기는 변경 가능)
- 벡터 b: 두 번째 벡터 (방향과 크기 모두 변경 가능)

### 단계별 과정

1. **첫 번째 수직 벡터 생성**
   ```cpp
   Vector3 c = a % b;  // 벡터곱 계산
   
   if (c.magnitude() < epsilon) {
       // a와 b가 평행하면 실패
       return false;
   }
   ```

2. **두 번째 벡터 재계산**
   ```cpp
   b = c % a;  // 순서 주의
   ```

3. **모든 벡터 정규화**
   ```cpp
   a.normalize();
   b.normalize();
   c.normalize();
   ```

### C++ 구현

```cpp
class Vector3 {
public:
    /**
     * 직교 정규 기저를 생성합니다.
     * @param a 첫 번째 벡터 (방향 고정)
     * @param b 두 번째 벡터
     * @param c 결과로 생성되는 세 번째 벡터
     * @return 성공 여부
     */
    static bool generateOrthonormalBasis(
        Vector3& a, Vector3& b, Vector3& c)
    {
        // 첫 번째 수직 벡터 생성
        c = a % b;
        
        // 평행 벡터 검사
        if (c.magnitude() < 1e-6f) {
            return false;
        }
        
        // 두 번째 벡터 재계산
        b = c % a;
        
        // 정규화
        a.normalize();
        b.normalize();
        c.normalize();
        
        return true;
    }
};
```

## 좌표계 방향성 고려

이 알고리즘은 기본적으로 오른손 좌표계를 기준으로 설계되었습니다.

### 오른손 좌표계
```cpp
c = a % b;
b = c % a;
```

### 왼손 좌표계
```cpp
c = b % a;
b = a % c;
```

## 활용

1. **충돌 처리**
   - 접촉점 검출
   - 접촉 해결

2. **카메라 시스템**
   - 카메라 방향 설정
   - 시점 변환

3. **물리 시뮬레이션**
   - 회전 변환
   - 관성 텐서 계산

## 주의사항

1. **입력 벡터**
   - 두 입력 벡터가 평행하면 실패
   - 충분한 크기를 가진 벡터 사용

2. **수치 안정성**
   - 매우 작은 벡터 처리 주의
   - 정규화 과정에서의 오차 고려

3. **좌표계 일관성**
   - 사용하는 좌표계에 맞는 알고리즘 선택
   - 일관된 좌표계 사용 유지 