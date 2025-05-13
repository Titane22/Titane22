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

## 게임에서의 쿼터니언 활용

### 1. 벡터 회전
쿼터니언을 사용하여 벡터를 회전시키는 방법입니다:

```cpp
Vector3 RotateVector(const Vector3& v, const Quaternion& q) {
    // v' = q * v * q^(-1)
    
    // 계산 최적화를 위한 구현
    Vector3 qvec(q.x, q.y, q.z);
    Vector3 uv = Cross(qvec, v);
    Vector3 uuv = Cross(qvec, uv);
    
    return v + ((uv * q.w) + uuv) * 2.0f;
}
```

### 2. 쿼터니언 구면 선형 보간 (SLERP)
두 회전 간의 부드러운 보간을 위한 SLERP(Spherical Linear Interpolation) 구현:

```cpp
Quaternion Slerp(const Quaternion& q1, const Quaternion& q2, float t) {
    // 경계 조건 처리
    if (t <= 0.0f) return q1;
    if (t >= 1.0f) return q2;
    
    // 단위 쿼터니언 보장
    Quaternion q1n = Normalize(q1);
    Quaternion q2n = Normalize(q2);
    
    // 내적 계산 (쿼터니언 사이의 각도 관련)
    float dot = q1n.x * q2n.x + q1n.y * q2n.y + q1n.z * q2n.z + q1n.w * q2n.w;
    
    // 가장 짧은 경로로 보간하기 위한 처리
    if (dot < 0.0f) {
        q2n = Quaternion(-q2n.x, -q2n.y, -q2n.z, -q2n.w);
        dot = -dot;
    }
    
    // 두 쿼터니언이 매우 가까우면 선형 보간
    if (dot > 0.9995f) {
        return Normalize(Quaternion(
            q1n.x * (1.0f - t) + q2n.x * t,
            q1n.y * (1.0f - t) + q2n.y * t,
            q1n.z * (1.0f - t) + q2n.z * t,
            q1n.w * (1.0f - t) + q2n.w * t
        ));
    }
    
    // 구면 선형 보간 계산
    float angle = acos(dot);
    float sinAngle = sin(angle);
    float invSinAngle = 1.0f / sinAngle;
    
    float coeff1 = sin((1.0f - t) * angle) * invSinAngle;
    float coeff2 = sin(t * angle) * invSinAngle;
    
    return Quaternion(
        q1n.x * coeff1 + q2n.x * coeff2,
        q1n.y * coeff1 + q2n.y * coeff2,
        q1n.z * coeff1 + q2n.z * coeff2,
        q1n.w * coeff1 + q2n.w * coeff2
    );
}
```

### 3. 애니메이션 블렌딩
게임 캐릭터의 애니메이션 블렌딩에 쿼터니언을 활용하는 예시:

```cpp
class AnimationBlender {
private:
    Quaternion currentRotation;
    Quaternion targetRotation;
    float blendSpeed;
    
public:
    void Update(float deltaTime) {
        // SLERP를 사용한 회전 보간
        float t = min(1.0f, deltaTime * blendSpeed);
        currentRotation = Slerp(currentRotation, targetRotation, t);
    }
    
    void SetTargetRotation(const Quaternion& target, float speed) {
        targetRotation = target;
        blendSpeed = speed;
    }
    
    Matrix4x4 GetRotationMatrix() {
        return QuaternionToMatrix(currentRotation);
    }
};
```

### 4. 카메라 제어
게임 카메라 제어에 쿼터니언을 활용하는 예시:

```cpp
class Camera {
private:
    Vector3 position;
    Quaternion rotation;
    
public:
    void LookAt(const Vector3& target) {
        Vector3 direction = Normalize(target - position);
        Vector3 up = Vector3(0.0f, 1.0f, 0.0f);
        
        // 방향 벡터를 쿼터니언으로 변환
        Vector3 forward = Vector3(0.0f, 0.0f, 1.0f);
        Vector3 rotationAxis = Cross(forward, direction);
        
        if (Length(rotationAxis) < EPSILON) {
            // 방향이 이미 일치하는 경우
            rotation = Quaternion(0.0f, 0.0f, 0.0f, 1.0f);
            return;
        }
        
        rotationAxis = Normalize(rotationAxis);
        float angle = acos(Dot(forward, direction));
        
        rotation = FromAxisAngle(rotationAxis, angle * 180.0f / PI);
    }
    
    void Rotate(float pitchDegrees, float yawDegrees) {
        Quaternion pitchRotation = FromAxisAngle(Vector3(1.0f, 0.0f, 0.0f), pitchDegrees);
        Quaternion yawRotation = FromAxisAngle(Vector3(0.0f, 1.0f, 0.0f), yawDegrees);
        
        // 회전 조합 (순서 중요: yaw -> pitch)
        rotation = Multiply(Multiply(rotation, yawRotation), pitchRotation);
        rotation = Normalize(rotation);
    }
    
    Matrix4x4 GetViewMatrix() {
        // 쿼터니언에서 회전 행렬 계산
        Matrix4x4 rotMatrix = QuaternionToMatrix4x4(rotation);
        
        // 위치 정보를 포함한 뷰 행렬 생성
        Matrix4x4 viewMatrix = rotMatrix;
        viewMatrix[3][0] = -Dot(Vector3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), position);
        viewMatrix[3][1] = -Dot(Vector3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]), position);
        viewMatrix[3][2] = -Dot(Vector3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]), position);
        
        return viewMatrix;
    }
};
```

## 쿼터니언의 장점과 주의사항

### 1. 장점
- **짐벌락 회피**: 오일러 각도의 주요 문제인 짐벌락(gimbal lock)을 방지
- **부드러운 보간**: SLERP를 통한 자연스러운 회전 보간
- **메모리 효율성**: 회전 행렬(9개 요소)보다 적은 값(4개 요소)으로 회전 표현
- **수치적 안정성**: 누적 오차가 적음

### 2. 주의사항
- **성능 vs 가독성**: 실제 적용 시 행렬 변환이 필요할 수 있어 추가 계산 발생
- **정규화 필요**: 반복적인 연산 후 수치 오차로 인해 정규화가 필요
- **학습 곡선**: 직관적인 이해가 어려울 수 있음

```cpp
// 쿼터니언 정규화의 중요성 예시
void UpdateObjectRotation(GameObject& obj, const Quaternion& additionalRotation) {
    // 회전 적용
    obj.rotation = Multiply(obj.rotation, additionalRotation);
    
    // 수치 오차 방지를 위한 주기적 정규화
    if (++obj.updateCount % 10 == 0) {
        obj.rotation = Normalize(obj.rotation);
    }
}
```

### 3. 행렬과 쿼터니언 선택 지침
- **단순 회전 표현**: 쿼터니언 사용
- **계층적 변환**: 행렬 사용
- **회전 보간**: 쿼터니언 + SLERP
- **완전한 변환(이동+회전+크기)**: 행렬 사용

```cpp
class Transform {
private:
    Vector3 position;
    Quaternion rotation;  // 회전은 쿼터니언으로 표현
    Vector3 scale;
    Matrix4x4 worldMatrix; // 최종 변환은 행렬로 표현
    
public:
    void UpdateWorldMatrix() {
        // 쿼터니언을 회전 행렬로 변환
        Matrix4x4 rotMatrix = QuaternionToMatrix4x4(rotation);
        
        // 이동, 회전, 크기 결합
        worldMatrix = CreateTransformMatrix(position, rotMatrix, scale);
    }
};
```

