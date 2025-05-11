---
layout: page
title: 게임 개발에서의 쿼터니언 활용
description: >
  게임 프로그래밍에서 쿼터니언과 회전 연산의 이해 및 활용 방법
---

## 쿼터니언의 기본 개념

### 1. 쿼터니언의 정의
쿼터니언(Quaternion)은 4차원 복소수로, 3D 공간에서의 회전을 표현하는 데 최적화된 수학적 도구입니다. 쿼터니언 $q$는 다음과 같이 표현할 수 있습니다:

$q = w + xi + yj + zk$

여기서:
- $w$는 실수부(scalar part)
- $x, y, z$는 허수부(vector part)
- $i, j, k$는 허수 단위로 $i^2 = j^2 = k^2 = ijk = -1$이라는 특성을 가집니다.

### 2. 쿼터니언의 표현 형식
게임 개발에서는 일반적으로 쿼터니언을 다음과 같은 구조체나 클래스로 표현합니다:

```cpp
struct Quaternion {
    float x, y, z; // 벡터 부분 (회전축과 관련)
    float w;       // 스칼라 부분 (회전각과 관련)
};
```

### 3. 단위 쿼터니언
회전을 표현하기 위해서는 단위 쿼터니언(unit quaternion)을 사용합니다. 단위 쿼터니언은 크기(norm)가 1인 쿼터니언으로, 다음 조건을 만족합니다:

$\|q\| = \sqrt{w^2 + x^2 + y^2 + z^2} = 1$

## 쿼터니언 연산

### 1. 쿼터니언 덧셈과 뺄셈
쿼터니언의 덧셈과 뺄셈은 각 성분별로 수행됩니다:

```cpp
Quaternion Add(const Quaternion& q1, const Quaternion& q2) {
    return Quaternion(
        q1.x + q2.x,
        q1.y + q2.y,
        q1.z + q2.z,
        q1.w + q2.w
    );
}

Quaternion Subtract(const Quaternion& q1, const Quaternion& q2) {
    return Quaternion(
        q1.x - q2.x,
        q1.y - q2.y,
        q1.z - q2.z,
        q1.w - q2.w
    );
}
```

### 2. 쿼터니언 곱셈
쿼터니언 곱셈은 복잡하지만, 두 회전의 조합을 표현할 때 중요합니다:

```cpp
Quaternion Multiply(const Quaternion& q1, const Quaternion& q2) {
    return Quaternion(
        q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
        q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
        q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
        q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z
    );
}
```

### 3. 쿼터니언 켤레(Conjugate)
쿼터니언의 켤레는 벡터 부분의 부호를 바꾼 것입니다:

```cpp
Quaternion Conjugate(const Quaternion& q) {
    return Quaternion(-q.x, -q.y, -q.z, q.w);
}
```

### 4. 쿼터니언 역원(Inverse)
단위 쿼터니언의 역원은 켤레와 같습니다:

```cpp
Quaternion Inverse(const Quaternion& q) {
    // 단위 쿼터니언인 경우
    if (IsUnit(q)) {
        return Conjugate(q);
    }
    
    // 일반적인 경우
    float normSquared = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
    float invNormSquared = 1.0f / normSquared;
    return Quaternion(
        -q.x * invNormSquared,
        -q.y * invNormSquared,
        -q.z * invNormSquared,
         q.w * invNormSquared
    );
}
```

### 5. 쿼터니언 정규화(Normalization)
쿼터니언을 단위 쿼터니언으로 만드는 과정입니다:

```cpp
Quaternion Normalize(const Quaternion& q) {
    float magnitude = sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    
    // 0으로 나누기 방지
    if (magnitude < EPSILON) {
        return Quaternion(0, 0, 0, 1); // 항등 쿼터니언 반환
    }
    
    float invMagnitude = 1.0f / magnitude;
    return Quaternion(
        q.x * invMagnitude,
        q.y * invMagnitude,
        q.z * invMagnitude,
        q.w * invMagnitude
    );
}
```

## 회전과 쿼터니언

### 1. 회전축과 각도로부터 쿼터니언 생성
회전축 $\vec{v}$ 와 회전각 $\theta$ 로부터 쿼터니언을 생성하는 방법입니다:

```cpp
Quaternion FromAxisAngle(const Vector3& axis, float angleDegrees) {
    // 축 정규화
    Vector3 normalizedAxis = Normalize(axis);
    
    float angleRadians = angleDegrees * PI / 180.0f;
    float halfAngle = angleRadians * 0.5f;
    float sinHalfAngle = sin(halfAngle);
    
    return Quaternion(
        normalizedAxis.x * sinHalfAngle,
        normalizedAxis.y * sinHalfAngle,
        normalizedAxis.z * sinHalfAngle,
        cos(halfAngle)
    );
}
```

### 2. 쿼터니언에서 회전축과 각도 추출
쿼터니언으로부터 회전축과 각도를 추출하는 방법입니다:

```cpp
void ToAxisAngle(const Quaternion& q, Vector3& outAxis, float& outAngleDegrees) {
    // 쿼터니언 정규화
    Quaternion unitQ = Normalize(q);
    
    // 회전각 계산
    float cosHalfAngle = unitQ.w;
    float angleRadians = 2.0f * acos(cosHalfAngle);
    outAngleDegrees = angleRadians * 180.0f / PI;
    
    // 회전축 계산
    float sinHalfAngle = sqrt(1.0f - cosHalfAngle * cosHalfAngle);
    
    // sinHalfAngle이 0에 가까우면 회전각이 0이나 360도에 가까움
    if (abs(sinHalfAngle) < 0.0001f) {
        outAxis = Vector3(1.0f, 0.0f, 0.0f); // 임의의 축 반환
    } else {
        outAxis = Vector3(
            unitQ.x / sinHalfAngle,
            unitQ.y / sinHalfAngle,
            unitQ.z / sinHalfAngle
        );
    }
}
```

### 3. 오일러 각도에서 쿼터니언으로 변환
오일러 각도(yaw, pitch, roll)에서 쿼터니언으로 변환하는 방법입니다:

```cpp
Quaternion FromEulerAngles(float pitchDegrees, float yawDegrees, float rollDegrees) {
    // 라디안 변환
    float pitch = pitchDegrees * PI / 180.0f;
    float yaw = yawDegrees * PI / 180.0f;
    float roll = rollDegrees * PI / 180.0f;
    
    // 각 축에 대한 회전 계산
    float cy = cos(yaw * 0.5f);
    float sy = sin(yaw * 0.5f);
    float cp = cos(pitch * 0.5f);
    float sp = sin(pitch * 0.5f);
    float cr = cos(roll * 0.5f);
    float sr = sin(roll * 0.5f);
    
    // 쿼터니언 계산 (회전 순서: Y->X->Z, 즉 Yaw->Pitch->Roll)
    return Quaternion(
        cy * sp * cr + sy * cp * sr,  // x
        sy * cp * cr - cy * sp * sr,  // y
        cy * cp * sr - sy * sp * cr,  // z
        cy * cp * cr + sy * sp * sr   // w
    );
}
```

### 4. 쿼터니언에서 오일러 각도로 변환
쿼터니언에서 오일러 각도(yaw, pitch, roll)로 변환하는 방법입니다:

```cpp
void ToEulerAngles(const Quaternion& q, float& outPitchDegrees, float& outYawDegrees, float& outRollDegrees) {
    // 짐벌락 방지를 위한 특수 처리 포함
    
    // Roll (z-axis rotation)
    float sinrCosp = 2.0f * (q.w * q.z + q.x * q.y);
    float cosrCosp = 1.0f - 2.0f * (q.y * q.y + q.z * q.z);
    outRollDegrees = atan2(sinrCosp, cosrCosp) * 180.0f / PI;
    
    // Pitch (x-axis rotation)
    float sinp = 2.0f * (q.w * q.x - q.y * q.z);
    if (abs(sinp) >= 1.0f) {
        // 짐벌락 발생 시 90도로 고정
        outPitchDegrees = copysign(90.0f, sinp) * 180.0f / PI;
    } else {
        outPitchDegrees = asin(sinp) * 180.0f / PI;
    }
    
    // Yaw (y-axis rotation)
    float sinyCosp = 2.0f * (q.w * q.y + q.z * q.x);
    float cosyCosp = 1.0f - 2.0f * (q.x * q.x + q.y * q.y);
    outYawDegrees = atan2(sinyCosp, cosyCosp) * 180.0f / PI;
}
```

