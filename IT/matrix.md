---
layout: page
title: 게임 개발에서의 행렬 활용
description: >
  게임 프로그래밍에서 행렬과 변환 연산의 이해 및 활용 방법
---

## 행렬의 기본 개념

### 1. 행렬의 정의
행렬은 m×n개의 숫자를 직사각형 형태로 배열한 것으로, 게임 개발에서는 주로 변환(transformation)을 표현하는 데 사용됩니다.

```
A = [a₁₁ a₁₂ ... a₁ₙ]
    [a₂₁ a₂₂ ... a₂ₙ]
    [ :   :  ...  : ]
    [aₘ₁ aₘ₂ ... aₘₙ]
```

### 2. 게임에서 주로 사용되는 행렬
- **3×3 행렬**: 2D 변환, 회전, 확대/축소, 기울임
- **4×4 행렬**: 3D 변환, 이동, 회전, 확대/축소, 투영

### 3. 행렬 연산
- **행렬 덧셈/뺄셈**: 같은 위치의 원소끼리 연산
- **행렬 곱셈**: 행과 열의 내적으로 계산
- **역행렬**: 원래 행렬의 변환을 취소하는 행렬
- **전치행렬**: 행과 열을 바꾼 행렬

## 게임 개발에서의 변환 행렬

### 1. 이동 행렬 (Translation Matrix)
2D 또는 3D 공간에서 물체를 특정 방향으로 이동시키는 행렬입니다.

```cpp
// 3D 이동 행렬 생성 (4×4)
Matrix4x4 CreateTranslationMatrix(float x, float y, float z)
{
    Matrix4x4 result = Matrix4x4::Identity;
    result[3][0] = x;
    result[3][1] = y;
    result[3][2] = z;
    return result;
}
```

### 2. 회전 행렬 (Rotation Matrix)
물체를 특정 축을 중심으로 회전시키는 행렬입니다.

```cpp
// X축 회전 행렬
Matrix4x4 CreateRotationXMatrix(float angleDegrees)
{
    float angleRadians = angleDegrees * PI / 180.0f;
    float cos = cosf(angleRadians);
    float sin = sinf(angleRadians);
    
    Matrix4x4 result = Matrix4x4::Identity;
    result[1][1] = cos;
    result[1][2] = -sin;
    result[2][1] = sin;
    result[2][2] = cos;
    return result;
}

// Y축 회전 행렬
Matrix4x4 CreateRotationYMatrix(float angleDegrees)
{
    float angleRadians = angleDegrees * PI / 180.0f;
    float cos = cosf(angleRadians);
    float sin = sinf(angleRadians);
    
    Matrix4x4 result = Matrix4x4::Identity;
    result[0][0] = cos;
    result[0][2] = sin;
    result[2][0] = -sin;
    result[2][2] = cos;
    return result;
}

// Z축 회전 행렬
Matrix4x4 CreateRotationZMatrix(float angleDegrees)
{
    float angleRadians = angleDegrees * PI / 180.0f;
    float cos = cosf(angleRadians);
    float sin = sinf(angleRadians);
    
    Matrix4x4 result = Matrix4x4::Identity;
    result[0][0] = cos;
    result[0][1] = -sin;
    result[1][0] = sin;
    result[1][1] = cos;
    return result;
}
```

### 3. 크기 변환 행렬 (Scale Matrix)
물체의 크기를 변경하는 행렬입니다.

```cpp
// 3D 크기 변환 행렬
Matrix4x4 CreateScaleMatrix(float scaleX, float scaleY, float scaleZ)
{
    Matrix4x4 result = Matrix4x4::Identity;
    result[0][0] = scaleX;
    result[1][1] = scaleY;
    result[2][2] = scaleZ;
    return result;
}
```

### 4. 복합 변환
여러 변환을 순차적으로 적용할 때는 행렬 곱셈을 사용합니다. 주의할 점은 행렬 곱셈은 교환법칙이 성립하지 않으므로 순서가 중요합니다.

```cpp
// 이동 후 회전 후 크기 변환 (일반적인 순서: Scale → Rotate → Translate)
Matrix4x4 CreateTransformMatrix(
    float posX, float posY, float posZ,
    float rotX, float rotY, float rotZ,
    float scaleX, float scaleY, float scaleZ)
{
    Matrix4x4 S = CreateScaleMatrix(scaleX, scaleY, scaleZ);
    Matrix4x4 RX = CreateRotationXMatrix(rotX);
    Matrix4x4 RY = CreateRotationYMatrix(rotY);
    Matrix4x4 RZ = CreateRotationZMatrix(rotZ);
    Matrix4x4 T = CreateTranslationMatrix(posX, posY, posZ);
    
    // 변환 순서: 크기 → X축 회전 → Y축 회전 → Z축 회전 → 이동
    return T * RZ * RY * RX * S;
}
```

## 카메라 및 투영 행렬

### 1. 뷰 행렬 (View Matrix)
카메라의 위치와 방향을 기반으로 월드 공간의 좌표를 카메라 공간으로 변환합니다.

```cpp
// 뷰 행렬 생성 (Look-At 방식)
Matrix4x4 CreateViewMatrix(
    const Vector3& eyePosition,    // 카메라 위치
    const Vector3& targetPosition, // 바라보는 위치
    const Vector3& upVector)       // 카메라의 상단 방향
{
    // 카메라 축 계산
    Vector3 zAxis = Normalize(eyePosition - targetPosition);
    Vector3 xAxis = Normalize(Cross(upVector, zAxis));
    Vector3 yAxis = Cross(zAxis, xAxis);
    
    // 뷰 행렬 구성
    Matrix4x4 result;
    result[0][0] = xAxis.x; result[0][1] = yAxis.x; result[0][2] = zAxis.x; result[0][3] = 0.0f;
    result[1][0] = xAxis.y; result[1][1] = yAxis.y; result[1][2] = zAxis.y; result[1][3] = 0.0f;
    result[2][0] = xAxis.z; result[2][1] = yAxis.z; result[2][2] = zAxis.z; result[2][3] = 0.0f;
    
    // 카메라의 위치 벡터와 카메라 좌표계 축 벡터들 간의 내적
    // 이 내적은 카메라 위치를 카메라 좌표계 원점으로 이동시키는 변환의 일부
    // 마이너스 부호는 월드→카메라 변환(카메라의 반대 방향으로 월드를 움직임)을 나타냄
    result[3][0] = -Dot(xAxis, eyePosition);
    result[3][1] = -Dot(yAxis, eyePosition);
    result[3][2] = -Dot(zAxis, eyePosition);
    result[3][3] = 1.0f;
    
    return result;
}
```

### 2. 투영 행렬 (Projection Matrix)
3D 공간의 좌표를 2D 화면에 투영하는 행렬입니다.

```cpp
// 원근 투영 행렬 (Perspective Projection)
Matrix4x4 CreatePerspectiveMatrix(
    float fovDegrees,  // 시야각 (Field of View)
    float aspectRatio, // 화면 비율 (width/height)
    float nearZ,       // 가까운 클리핑 평면
    float farZ)        // 먼 클리핑 평면
{
    float fovRadians = fovDegrees * PI / 180.0f;
    float tanHalfFov = tanf(fovRadians / 2.0f);
    
    Matrix4x4 result = {};
    result[0][0] = 1.0f / (aspectRatio * tanHalfFov);
    result[1][1] = 1.0f / tanHalfFov;
    result[2][2] = farZ / (farZ - nearZ);
    result[2][3] = 1.0f;
    result[3][2] = -(farZ * nearZ) / (farZ - nearZ);
    
    return result;
}

// 직교 투영 행렬 (Orthographic Projection)
Matrix4x4 CreateOrthographicMatrix(
    float left, float right,
    float bottom, float top,
    float nearZ, float farZ)
{
    Matrix4x4 result = Matrix4x4::Identity;
    result[0][0] = 2.0f / (right - left);
    result[1][1] = 2.0f / (top - bottom);
    result[2][2] = 1.0f / (farZ - nearZ);
    result[3][0] = -(right + left) / (right - left);
    result[3][1] = -(top + bottom) / (top - bottom);
    result[3][2] = -nearZ / (farZ - nearZ);
    
    return result;
}
```

## 게임에서의 행렬 활용 사례

### 1. 캐릭터 및 오브젝트 변환
게임 오브젝트의 위치, 회전, 크기를 관리하는 데 행렬을 사용합니다.

```cpp
class GameObject {
private:
    Vector3 position;
    Vector3 rotation;
    Vector3 scale;
    
    Matrix4x4 worldMatrix;
    
public:
    void UpdateWorldMatrix() {
        // 위치, 회전, 크기 정보로 월드 변환 행렬 업데이트
        worldMatrix = CreateTransformMatrix(
            position.x, position.y, position.z,
            rotation.x, rotation.y, rotation.z,
            scale.x, scale.y, scale.z
        );
    }
    
    // 월드 공간에서 정점 변환
    Vector3 TransformPoint(const Vector3& localPoint) {
        return worldMatrix.MultiplyPoint(localPoint);
    }
};
```

### 2. 계층 구조 (Hierarchy) 구현
부모-자식 관계의 계층 구조를 구현할 때 행렬 곱셈을 활용합니다.

```cpp
class SceneNode {
private:
    Matrix4x4 localMatrix;
    Matrix4x4 worldMatrix;
    SceneNode* parent;
    std::vector<SceneNode*> children;
    
public:
    void UpdateWorldMatrix() {
        if (parent) {
            // 부모의 월드 행렬과 자신의 로컬 행렬을 곱함
            worldMatrix = parent->worldMatrix * localMatrix;
        } else {
            // 최상위 노드인 경우 로컬 행렬이 곧 월드 행렬
            worldMatrix = localMatrix;
        }
        
        // 자식 노드들의 월드 행렬도 재귀적으로 업데이트
        for (auto child : children) {
            child->UpdateWorldMatrix();
        }
    }
};
```

### 3. 카메라 제어
카메라의 위치와 방향을 설정하고 월드 공간을 뷰 공간으로 변환합니다.

```cpp
class Camera {
private:
    Vector3 position;
    Vector3 target;
    Vector3 upVector;
    
    Matrix4x4 viewMatrix;
    Matrix4x4 projectionMatrix;
    
public:
    void UpdateViewMatrix() {
        viewMatrix = CreateViewMatrix(position, target, upVector);
    }
    
    void SetPerspective(float fov, float aspectRatio, float nearZ, float farZ) {
        projectionMatrix = CreatePerspectiveMatrix(fov, aspectRatio, nearZ, farZ);
    }
    
    // 월드 좌표를 스크린 좌표로 변환
    Vector2 WorldToScreen(const Vector3& worldPos) {
        Vector4 viewPos = viewMatrix.MultiplyPoint(Vector4(worldPos, 1.0f));
        Vector4 clipPos = projectionMatrix.MultiplyPoint(viewPos);
        
        // 동차 좌표(homogeneous coordinates) 처리
        float invW = 1.0f / clipPos.w;
        Vector3 ndcPos(clipPos.x * invW, clipPos.y * invW, clipPos.z * invW);
        
        // NDC 좌표를 스크린 좌표로 변환
        return Vector2(
            (ndcPos.x * 0.5f + 0.5f) * screenWidth,
            (1.0f - (ndcPos.y * 0.5f + 0.5f)) * screenHeight
        );
    }
};
```

### 4. 충돌 감지 최적화
회전된 충돌체의 충돌 검사를 최적화하기 위해 역행렬을 사용합니다.

```cpp
bool CheckCollisionOBBWithOBB(const OBB& obb1, const OBB& obb2) {
    // OBB1의 역행렬을 사용해 OBB2를 OBB1의 로컬 공간으로 변환
    Matrix4x4 invOBB1Matrix = obb1.worldMatrix.Inverse();
    
    // OBB2의 모서리 점들을 OBB1의 로컬 공간으로 변환
    Vector3 transformedCorners[8];
    for (int i = 0; i < 8; i++) {
        transformedCorners[i] = invOBB1Matrix.MultiplyPoint(obb2.GetWorldCorner(i));
    }
    
    // 이제 AABB vs 변환된 OBB2 검사를 수행 (더 간단)
    // ...
}
```

## 행렬 최적화 기법

### 1. SIMD 명령어 활용
현대 CPU의 SIMD(Single Instruction Multiple Data) 명령어를 활용하여 행렬 연산을 가속화할 수 있습니다.

```cpp
// SSE 명령어로 4x4 행렬 곱셈 구현 예시 (의사 코드)
Matrix4x4 MultiplySSE(const Matrix4x4& a, const Matrix4x4& b) {
    Matrix4x4 result;
    
    for (int i = 0; i < 4; i++) {
        __m128 row = _mm_set_ps(a.m[i][3], a.m[i][2], a.m[i][1], a.m[i][0]);
        
        for (int j = 0; j < 4; j++) {
            __m128 column = _mm_set_ps(b.m[3][j], b.m[2][j], b.m[1][j], b.m[0][j]);
            __m128 product = _mm_mul_ps(row, column);
            
            // 가로 합산 (horizontal sum)
            float sum = HorizontalSum(product);
            result.m[i][j] = sum;
        }
    }
    
    return result;
}
```

### 2. 특수 행렬 활용
특별한 유형의 행렬은 계산을 최적화할 수 있습니다.

```cpp
// 단위 행렬(Identity matrix)과의 곱셈 최적화
Matrix4x4 MultiplyWithIdentity(const Matrix4x4& m) {
    // 단위 행렬과의 곱은 원래 행렬 그대로 반환
    return m;
}

// 직교 행렬(Orthogonal matrix)의 역행렬 최적화
Matrix4x4 InverseOrthogonal(const Matrix4x4& m) {
    // 직교 행렬의 역행렬은 전치 행렬과 같음 (훨씬 계산이 빠름)
    return m.Transpose();
}

// 변환 행렬의 역행렬 최적화
Matrix4x4 InverseTransform(const Matrix4x4& m) {
    // 4x4 변환 행렬의 역행렬을 효율적으로 계산
    Matrix3x3 rotScale(
        m[0][0], m[0][1], m[0][2],
        m[1][0], m[1][1], m[1][2],
        m[2][0], m[2][1], m[2][2]
    );
    
    Matrix3x3 invRotScale = rotScale.Inverse();
    Vector3 translation(m[3][0], m[3][1], m[3][2]);
    Vector3 invTranslation = -invRotScale * translation;
    
    return Matrix4x4(
        invRotScale[0][0], invRotScale[0][1], invRotScale[0][2], 0,
        invRotScale[1][0], invRotScale[1][1], invRotScale[1][2], 0,
        invRotScale[2][0], invRotScale[2][1], invRotScale[2][2], 0,
        invTranslation.x, invTranslation.y, invTranslation.z, 1
    );
}
```

### 3. 캐싱 및 지연 계산
불필요한 행렬 계산을 줄이기 위한 기법들입니다.

```cpp
class Transform {
private:
    Vector3 position;
    Quaternion rotation;
    Vector3 scale;
    
    Matrix4x4 localMatrix;
    Matrix4x4 worldMatrix;
    
    bool localDirty = true;
    bool worldDirty = true;
    
public:
    void SetPosition(const Vector3& newPos) {
        position = newPos;
        localDirty = true;
        worldDirty = true;
    }
    
    const Matrix4x4& GetLocalMatrix() {
        if (localDirty) {
            // 로컬 행렬이 필요할 때만 재계산
            localMatrix = CreateTransformMatrix(position, rotation, scale);
            localDirty = false;
        }
        return localMatrix;
    }
    
    const Matrix4x4& GetWorldMatrix() {
        if (worldDirty) {
            // 월드 행렬이 필요할 때만 재계산
            if (parent) {
                worldMatrix = parent->GetWorldMatrix() * GetLocalMatrix();
            } else {
                worldMatrix = GetLocalMatrix();
            }
            worldDirty = false;
        }
        return worldMatrix;
    }
};
```

## 주의사항 및 팁

### 1. 행렬 표기법과 메모리 레이아웃
API나 라이브러리에 따라 행렬의 표기법과 메모리 레이아웃이 다를 수 있습니다.

- **행 우선(Row-major) vs 열 우선(Column-major)**: 메모리에 행렬을 저장하는 방식이 다릅니다.
- **왼손 좌표계 vs 오른손 좌표계**: 게임 엔진이나 그래픽 API에 따라 좌표계가 다릅니다.
    - 언리얼 엔진: 오른손 좌표계
    - 유니티 엔진: 왼손 좌표계

```cpp
// 행렬 표기법 변환 예시
Matrix4x4 RowToColumnMajor(const Matrix4x4& rowMajor) {
    return rowMajor.Transpose();
}

// 좌표계 변환 예시 (오른손 → 왼손)
Matrix4x4 RightToLeftHanded(const Matrix4x4& rightHanded) {
    Matrix4x4 result = rightHanded;
    // Z축 뒤집기
    result[0][2] = -result[0][2];
    result[1][2] = -result[1][2];
    result[2][2] = -result[2][2];
    result[3][2] = -result[3][2];
    return result;
}
```

### 2. 수치 안정성
행렬 연산 시 수치 오차가 누적될 수 있으므로 주의해야 합니다.

```cpp
// 행렬 정규화 (수치 오차 보정)
void NormalizeRotationMatrix(Matrix3x3& rotationMatrix) {
    // 첫 번째 행 정규화
    Vector3 xAxis(rotationMatrix[0][0], rotationMatrix[0][1], rotationMatrix[0][2]);
    xAxis = Normalize(xAxis);
    
    // y축과 x축이 직교하도록 조정
    Vector3 zAxis(rotationMatrix[2][0], rotationMatrix[2][1], rotationMatrix[2][2]);
    Vector3 yAxis = Cross(zAxis, xAxis);
    yAxis = Normalize(yAxis);
    
    // z축을 다시 계산
    zAxis = Cross(xAxis, yAxis);
    
    // 정규화된 축으로 행렬 업데이트
    rotationMatrix[0][0] = xAxis.x; rotationMatrix[0][1] = xAxis.y; rotationMatrix[0][2] = xAxis.z;
    rotationMatrix[1][0] = yAxis.x; rotationMatrix[1][1] = yAxis.y; rotationMatrix[1][2] = yAxis.z;
    rotationMatrix[2][0] = zAxis.x; rotationMatrix[2][1] = zAxis.y; rotationMatrix[2][2] = zAxis.z;
}
```

### 3. 쿼터니언과의 연계
회전 표현에는 행렬보다 쿼터니언(quaternion)이 더 적합한 경우가 많습니다.

```cpp
// 쿼터니언에서 회전 행렬로 변환
Matrix3x3 QuaternionToMatrix(const Quaternion& q) {
    float xx = q.x * q.x;
    float xy = q.x * q.y;
    float xz = q.x * q.z;
    float xw = q.x * q.w;
    float yy = q.y * q.y;
    float yz = q.y * q.z;
    float yw = q.y * q.w;
    float zz = q.z * q.z;
    float zw = q.z * q.w;
    
    return Matrix3x3(
        1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw),
        2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw),
        2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)
    );
}

// 회전 행렬에서 쿼터니언으로 변환
Quaternion MatrixToQuaternion(const Matrix3x3& m) {
    float trace = m[0][0] + m[1][1] + m[2][2];
    Quaternion q;
    
    if (trace > 0) {
        float s = 0.5f / sqrtf(trace + 1.0f);
        q.w = 0.25f / s;
        q.x = (m[2][1] - m[1][2]) * s;
        q.y = (m[0][2] - m[2][0]) * s;
        q.z = (m[1][0] - m[0][1]) * s;
    } else {
        // 대각선 요소 중 가장 큰 값 기준으로 계산
        // ...
    }
    
    return q;
}
```

