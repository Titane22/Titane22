---
layout: page
title: 게임 개발에서의 삼각함수 활용
description: >
  게임 프로그래밍에서 자주 사용되는 삼각함수와 그 응용 사례
---

## 삼각함수의 기본 개념

### 1. 주요 삼각함수
- **sin(θ)**: 사인 - 직각삼각형에서 대변/빗변
- **cos(θ)**: 코사인 - 직각삼각형에서 인접변/빗변
- **tan(θ)**: 탄젠트 - 직각삼각형에서 대변/인접변 (또는 sin(θ)/cos(θ))
- **atan2(y, x)**: 역탄젠트 - 좌표 (x, y)에 대한 각도 계산

### 2. 기본 공식
```
sin²θ + cos²θ = 1
tan(θ) = sin(θ)/cos(θ)
sin(θ+φ) = sin(θ)cos(φ) + cos(θ)sin(φ)
cos(θ+φ) = cos(θ)cos(φ) - sin(θ)sin(φ)
```

## 게임 개발에서의 활용 사례

### 1. 캐릭터 이동 및 회전
```cpp
// 목표 지점을 향해 캐릭터 회전시키기
float CalculateTargetAngle(const FVector2D& CurrentPosition, const FVector2D& TargetPosition)
{
    float DeltaX = TargetPosition.X - CurrentPosition.X;
    float DeltaY = TargetPosition.Y - CurrentPosition.Y;
    
    // atan2는 -π에서 π 사이의 각도를 반환 (라디안)
    float Angle = atan2(DeltaY, DeltaX);
    
    // 라디안에서 도(degree)로 변환 (필요시)
    float AngleDegrees = Angle * 180.0f / PI;
    
    return AngleDegrees;
}

// 원형 경로를 따라 움직이기
FVector2D CircularMovement(float CenterX, float CenterY, float Radius, float Time, float Speed)
{
    float Angle = Time * Speed;
    
    FVector2D Position;
    Position.X = CenterX + Radius * cos(Angle);
    Position.Y = CenterY + Radius * sin(Angle);
    
    return Position;
}
```

### 2. 파티클 효과 및 애니메이션
```cpp
// 나선형 패턴 생성
FVector SpiralPattern(float t, float Height, float Radius, float RotationSpeed)
{
    FVector Position;
    Position.X = Radius * cos(t * RotationSpeed);
    Position.Y = Radius * sin(t * RotationSpeed);
    Position.Z = Height * t;
    
    return Position;
}

// 펄럭이는 깃발이나 물결 효과
float WaveEffect(float X, float Time, float Frequency, float Amplitude)
{
    return sin(Time * Frequency + X * 0.5f) * Amplitude;
}

// 진동 효과 (예: 화면 흔들림)
float ScreenShake(float Time, float DecayFactor, float Frequency)
{
    // 시간에 따라 감소하는 진폭
    float CurrentAmplitude = exp(-DecayFactor * Time);
    return CurrentAmplitude * sin(Time * Frequency);
}
```

### 3. 물리 시뮬레이션
```cpp
// 포물선 궤적 계산 (발사체)
FVector2D ProjectileTrajectory(float StartX, float StartY, float Velocity, float AngleDegrees, float Time, float Gravity)
{
    float AngleRadians = AngleDegrees * PI / 180.0f;
    
    FVector2D Position;
    Position.X = StartX + Velocity * cos(AngleRadians) * Time;
    Position.Y = StartY + Velocity * sin(AngleRadians) * Time - 0.5f * Gravity * Time * Time;
    
    return Position;
}

// 진자 운동
FVector2D PendulumMovement(float PivotX, float PivotY, float Length, float MaxAngle, float Time, float SwingSpeed)
{
    // 시간에 따른 진자의 각도 계산
    float CurrentAngle = MaxAngle * sin(Time * SwingSpeed);
    
    // 진자 끝의 위치 계산
    FVector2D Position;
    Position.X = PivotX + Length * sin(CurrentAngle);
    Position.Y = PivotY + Length * cos(CurrentAngle);
    
    return Position;
}
```

### 4. 카메라 제어
```cpp
// 카메라를 타겟 주위로 회전
FVector OrbitCamera(const FVector& TargetPosition, float Distance, float HorizontalAngle, float VerticalAngle)
{
    // 수평 회전 (XZ 평면)
    float HorizRad = HorizontalAngle * PI / 180.0f;
    float X = Distance * cos(HorizRad);
    float Z = Distance * sin(HorizRad);
    
    // 수직 회전 (Y 축 기준)
    float VertRad = VerticalAngle * PI / 180.0f;
    float HorizDist = Distance * cos(VertRad);
    float Y = Distance * sin(VertRad);
    
    // 최종 카메라 위치
    return FVector(
        TargetPosition.X + HorizDist * cos(HorizRad),
        TargetPosition.Y + Y,
        TargetPosition.Z + HorizDist * sin(HorizRad)
    );
}
```

### 5. AI 및 행동 패턴
```cpp
// NPC가 순찰하는 경로 계산 (사인파 경로)
FVector2D PatrolPath(float StartX, float StartY, float Length, float Width, float Progress)
{
    // 0에서 1 사이의 진행도
    float NormalizedProgress = fmod(Progress, 1.0f);
    
    FVector2D Position;
    Position.X = StartX + Length * NormalizedProgress;
    Position.Y = StartY + Width * sin(NormalizedProgress * 2.0f * PI);
    
    return Position;
}

// 적이 플레이어를 중심으로 원형 이동
FVector2D CircleAroundTarget(const FVector2D& TargetPos, float Radius, float Speed, float Time, bool Clockwise)
{
    float Direction = Clockwise ? -1.0f : 1.0f;
    float Angle = Direction * Time * Speed;
    
    FVector2D Position;
    Position.X = TargetPos.X + Radius * cos(Angle);
    Position.Y = TargetPos.Y + Radius * sin(Angle);
    
    return Position;
}
```

## 최적화 기법

### 1. 테이블(룩업 테이블) 사용
```cpp
// 미리 계산된 사인/코사인 값 배열
class TrigLookupTable
{
private:
    static const int TABLE_SIZE = 360;
    float SinTable[TABLE_SIZE];
    float CosTable[TABLE_SIZE];
    
public:
    TrigLookupTable()
    {
        // 테이블 초기화
        for (int i = 0; i < TABLE_SIZE; i++)
        {
            float Angle = (float)i * PI / 180.0f;
            SinTable[i] = sin(Angle);
            CosTable[i] = cos(Angle);
        }
    }
    
    float GetSin(float AngleDegrees)
    {
        // 각도를 0-359 범위로 정규화
        int Index = (int)fmod(AngleDegrees + 360.0f, 360.0f);
        return SinTable[Index];
    }
    
    float GetCos(float AngleDegrees)
    {
        // 각도를 0-359 범위로 정규화
        int Index = (int)fmod(AngleDegrees + 360.0f, 360.0f);
        return CosTable[Index];
    }
};
```

### 2. 근사 함수 사용
```cpp
// 사인 함수의 빠른 근사치 계산
float FastSin(float x)
{
    // x를 -PI~PI 범위로 정규화
    x = fmod(x + PI, 2.0f * PI) - PI;
    
    // 테일러 급수(Taylor series)의 일부를 사용한 근사
    // sin(x) ≈ x - x³/6 + x⁵/120 - ...
    return x * (1.0f - x * x / 6.0f);
}

// 코사인 함수의 빠른 근사치 계산
float FastCos(float x)
{
    // cos(x) = sin(x + PI/2)
    return FastSin(x + PI * 0.5f);
}
```

### 3. SIMD 활용 예시 (개념)
```cpp
// SSE/NEON 등의 벡터화 명령어 활용 예시 (의사 코드)
void BatchSinCos(float* Angles, int Count, float* SinResults, float* CosResults)
{
    // 4개의 값을 한번에 처리 (SSE 사용시)
    for (int i = 0; i < Count; i += 4)
    {
        // 4개의 각도 로드
        float4 AngleVec = load4(Angles + i);
        
        // 병렬 사인/코사인 계산
        float4 SinVec = sin4(AngleVec);
        float4 CosVec = cos4(AngleVec);
        
        // 결과 저장
        store4(SinResults + i, SinVec);
        store4(CosResults + i, CosVec);
    }
}
```

## 주의사항 및 팁

### 1. 각도 단위 관리
```cpp
// 라디안 <-> 도 변환 상수
const float RAD_TO_DEG = 180.0f / PI;
const float DEG_TO_RAD = PI / 180.0f;

// 각도 정규화 함수들
float NormalizeAngle360(float Degrees)
{
    // 0 ~ 360도 범위로 정규화
    return fmod(fmod(Degrees, 360.0f) + 360.0f, 360.0f);
}

float NormalizeAngle180(float Degrees)
{
    // -180 ~ 180도 범위로 정규화
    float Angle = fmod(Degrees + 180.0f, 360.0f);
    if (Angle < 0)
        Angle += 360.0f;
    return Angle - 180.0f;
}
```

### 2. 수치 안정성
```cpp
// acos/asin 사용시 입력값 고정시키기
float SafeAcos(float x)
{
    // 입력값을 -1.0 ~ 1.0 범위로 제한
    if (x < -1.0f)
        x = -1.0f;
    else if (x > 1.0f)
        x = 1.0f;
    
    return acos(x);
}

// tan 함수 사용시 분모가 0이 되는 경우 처리
float SafeTan(float Degrees)
{
    float Rad = Degrees * DEG_TO_RAD;
    
    // 90도나 270도에 너무 가까운 경우
    const float EPSILON = 0.0001f;
    if (fabs(cos(Rad)) < EPSILON)
    {
        // 분모가 0에 가까움, 무한대 대신 큰 값 반환
        return (sin(Rad) > 0) ? 1000000.0f : -1000000.0f;
    }
    
    return tan(Rad);
}
```

### 3. 실전 사용 팁
- 삼각함수 호출이 많은 경우 결과값을 캐싱하여 재사용
- 매 프레임마다 같은 각도에 대한 계산이 필요하면 멤버 변수로 저장
- 정밀도가 중요하지 않은 경우, 근사 함수를 사용하여 성능 향상
- 드물게 사용되는 복잡한 삼각함수는 수치 안정성을 위해 라이브러리 함수 활용

