---
layout: page
title: 게임 개발자를 위한 수학
description: >
  게임 개발에 필요한 기초 수학 개념들을 알아봅니다.
categories: [IT]
tags: [game-development, mathematics]
---

## 벡터 (Vectors)

### 1. 2D 벡터
- 위치와 방향을 표현
- x, y 좌표로 구성

```cpp
// 벡터의 길이
float length = sqrt(x*x + y*y);

// 벡터 정규화
float normalized_x = x / length;
float normalized_y = y / length;

// 내적 (Dot Product)
float dot = x1*x2 + y1*y2;

// 외적 (Cross Product, 2D에서는 스칼라 값)
float cross = x1*y2 - y1*x2;
```

### 2. 3D 벡터
- x, y, z 좌표로 구성

```cpp
// 벡터의 길이
float length = sqrt(x*x + y*y + z*z);

// 벡터 정규화
float normalized_x = x / length;
float normalized_y = y / length;
float normalized_z = z / length;

// 내적
float dot = x1*x2 + y1*y2 + z1*z2;

// 외적
float cross_x = y1*z2 - z1*y2;
float cross_y = z1*x2 - x1*z2;
float cross_z = x1*y2 - y1*x2;
```

## 행렬 (Matrices)

### 1. 2D 변환 행렬
```cpp
// 회전 행렬
float rotation_matrix[2][2] = {
    {cos(angle), -sin(angle)},
    {sin(angle),  cos(angle)}
};

// 크기 변환 행렬
float scale_matrix[2][2] = {
    {scale_x, 0},
    {0, scale_y}
};
```

### 2. 3D 변환 행렬
```cpp
// Y축 회전 행렬
float rotation_y[3][3] = {
    {cos(angle),  0, sin(angle)},
    {0,           1, 0         },
    {-sin(angle), 0, cos(angle)}
};

// X축 회전 행렬
float rotation_x[3][3] = {
    {1, 0,           0          },
    {0, cos(angle), -sin(angle)},
    {0, sin(angle),  cos(angle)}
};
```

## 삼각함수

### 1. 각도 변환
```cpp
// 각도를 라디안으로
struct Vector2D {
    float x, y;
    
    // 생성자
    Vector2D(float x = 0.0f, float y = 0.0f) : x(x), y(y) {}
    
    // 벡터 덧셈
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
    
    // 벡터 뺄셈
    Vector2D operator-(const Vector2D& other) const {
        return Vector2D(x - other.x, y - other.y);
    }
    
    // 스칼라 곱
    Vector2D operator*(float scalar) const {
        return Vector2D(x * scalar, y * scalar);
    }
    
    // 벡터 정규화
    Vector2D Normalize() const {
        float length = sqrt(x*x + y*y);
        if (length != 0.0f)
            return Vector2D(x/length, y/length);
        return *this;
    }
    
    // 내적
    float DotProduct(const Vector2D& other) const {
        return x*other.x + y*other.y;
    }
    
    // 외적 (2D에서는 스칼라 값 반환)
    float CrossProduct(const Vector2D& other) const {
        return x*other.y - y*other.x;
    }
    
    // 벡터 길이
    float Length() const {
        return sqrt(x*x + y*y);
    }
};
```

### 2. 3D 벡터
```cpp
struct Vector3D {
    float x, y, z;
    
    Vector3D(float x = 0.0f, float y = 0.0f, float z = 0.0f) 
        : x(x), y(y), z(z) {}
    
    // 벡터 덧셈
    Vector3D operator+(const Vector3D& other) const {
        return Vector3D(x + other.x, y + other.y, z + other.z);
    }
    
    // 벡터 뺄셈
    Vector3D operator-(const Vector3D& other) const {
        return Vector3D(x - other.x, y - other.y, z - other.z);
    }
    
    // 외적
    Vector3D CrossProduct(const Vector3D& other) const {
        return Vector3D(
            y*other.z - z*other.y,
            z*other.x - x*other.z,
            x*other.y - y*other.x
        );
    }
};
```

## 행렬 (Matrices)

### 1. 4x4 변환 행렬
```cpp
class Matrix4x4 {
private:
    float m[4][4];

public:
    // 단위 행렬 생성
    static Matrix4x4 Identity() {
        Matrix4x4 mat;
        for(int i = 0; i < 4; i++)
            for(int j = 0; j < 4; j++)
                mat.m[i][j] = (i == j) ? 1.0f : 0.0f;
        return mat;
    }
    
    // 이동 행렬 생성
    static Matrix4x4 Translation(float x, float y, float z) {
        Matrix4x4 mat = Identity();
        mat.m[0][3] = x;
        mat.m[1][3] = y;
        mat.m[2][3] = z;
        return mat;
    }
    
    // 회전 행렬 (Y축 기준)
    static Matrix4x4 RotationY(float angle) {
        Matrix4x4 mat = Identity();
        float c = cos(angle);
        float s = sin(angle);
        mat.m[0][0] = c;
        mat.m[0][2] = -s;
        mat.m[2][0] = s;
        mat.m[2][2] = c;
        return mat;
    }
};
```

## 보간법 (Interpolation)

```cpp
class Interpolation {
public:
    // 선형 보간
    static float Lerp(float start, float end, float t) {
        return start + t * (end - start);
    }
    
    // 구면 선형 보간 (쿼터니언)
    static Quaternion Slerp(const Quaternion& q1, const Quaternion& q2, float t) {
        float dot = q1.Dot(q2);
        
        // 각도가 너무 작으면 선형 보간 사용
        if (dot > 0.9995f) {
            return Quaternion::Lerp(q1, q2, t);
        }
        
        float angle = acos(dot);
        float sinAngle = sin(angle);
        float t1 = sin((1-t) * angle) / sinAngle;
        float t2 = sin(t * angle) / sinAngle;
        
        return q1 * t1 + q2 * t2;
    }
};
```

## 충돌 감지

```cpp
class CollisionDetection {
public:
    // 구와 구의 충돌 검사
    static bool SphereToSphere(const Vector3D& center1, float radius1,
                             const Vector3D& center2, float radius2) {
        float distSq = (center2 - center1).LengthSquared();
        float radiusSum = radius1 + radius2;
        return distSq <= radiusSum * radiusSum;
    }
    
    // AABB 충돌 검사
    static bool AABBToAABB(const AABB& box1, const AABB& box2) {
        return (box1.min.x <= box2.max.x && box1.max.x >= box2.min.x) &&
               (box1.min.y <= box2.max.y && box1.max.y >= box2.min.y) &&
               (box1.min.z <= box2.max.z && box1.max.z >= box2.min.z);
    }
    
    // 광선과 평면의 충돌 검사
    static bool RayPlaneIntersection(const Ray& ray, const Plane& plane,
                                   float& t) {
        float denom = ray.direction.DotProduct(plane.normal);
        if (abs(denom) < 0.000001f) return false;
        
        t = -(ray.origin.DotProduct(plane.normal) + plane.d) / denom;
        return t >= 0;
    }
};
```

## 수학 유틸리티

```cpp
namespace MathUtil {
    constexpr float PI = 3.14159265359f;
    
    // 각도를 라디안으로 변환
    inline float DegToRad(float degrees) {
        return degrees * PI / 180.0f;
    }
    
    // 라디안을 각도로 변환
    inline float RadToDeg(float radians) {
        return radians * 180.0f / PI;
    }
    
    // 값을 특정 범위로 제한
    template<typename T>
    T Clamp(T value, T min, T max) {
        return value < min ? min : (value > max ? max : value);
    }
    
    // 선형 보간
    template<typename T>
    T Lerp(const T& a, const T& b, float t) {
        return a + (b - a) * Clamp(t, 0.0f, 1.0f);
    }
}
```

## 포물선 운동 (Projectile Motion)

### 1. 탄도 계산
```cpp
// 발사 속도와 각도로 포물선 궤적 계산
float ProjectileXLocation = StartX + InitialVelocity * cos(LaunchAngle) * Time;
float ProjectileYLocation = StartY + (InitialVelocity * sin(LaunchAngle) * Time) - 
                          (0.5f * Gravity * Time * Time);

// 목표 지점까지의 발사 각도 계산
float CalculateLaunchAngle(float TargetDistance, float TargetHeight, float ProjectileVelocity)
{
    float Gravity = 980.0f;  // cm/s^2
    float VelocitySquared = ProjectileVelocity * ProjectileVelocity;
    
    // 제곱근 내부의 계산
    float UnderRoot = (VelocitySquared * VelocitySquared) - 
                     (Gravity * ((Gravity * TargetDistance * TargetDistance) + 
                     (2 * TargetHeight * VelocitySquared)));
    
    if (UnderRoot >= 0) {
        // 발사 각도 계산 (라디안)
        float AngleInRadians = atan((VelocitySquared + sqrt(UnderRoot)) / 
                              (Gravity * TargetDistance));
        return AngleInRadians;
    }
    return 0.0f;  // 도달 불가능한 경우
}
```
