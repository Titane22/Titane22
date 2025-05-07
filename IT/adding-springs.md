---
layout: page
title: 스프링과 스프링 유사 힘
description: >
  게임 물리 엔진에서 스프링 힘의 구현과 활용
hide_description: false
lang: ko
---

## 개요
스프링 힘은 게임 물리 엔진에서 가장 유용한 힘 중 하나입니다. 자동차 게임의 서스펜션 시뮬레이션과 같은 명확한 용도 외에도, 로프, 깃발, 천, 물결 등 다양한 부드럽고 변형 가능한 물체를 표현하는 데 탁월합니다. 이 페이지에서는 스프링의 이론과 게임 물리 엔진에서의 구현 방법을 살펴봅니다.

## 후크의 법칙(Hook's Law)
후크의 법칙은 스프링의 수학적 원리를 제공합니다. 후크는 스프링이 발휘하는 힘이 스프링이 원래 위치에서 늘어나거나 압축된 거리에만 의존한다는 것을 발견했습니다. 두 배 더 늘어난 스프링은 두 배의 힘을 발휘합니다. 공식은 다음과 같습니다:

### 1차원 스프링

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
f = -k(l - l<sub>0</sub>)
</div>

여기서:
- `f`는 스프링이 발휘하는 힘
- `k`는 스프링 상수(스프링의 강성을 나타내는 값)
- `l`은 스프링의 현재 길이
- `l₀`는 스프링의 자연 길이(또는 휴지 길이)

### 3차원 스프링
3차원에서는 스칼라 대신 힘 벡터를 생성해야 합니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
f = -k(|d| - l<sub>0</sub>) · d̂
</div>

여기서:
- `d`는 스프링의 한쪽 끝에서 다른 쪽 끝으로의 벡터
- `|d|`는 벡터 d의 크기(스프링의 현재 길이)
- `d̂`는 벡터 d의 단위 벡터(방향)

벡터 `d`는 다음과 같이 계산됩니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
d = x<sub>A</sub> - x<sub>B</sub>
</div>

여기서:
- `x₍A₎`는 힘을 계산하려는 물체에 연결된 스프링 끝의 위치
- `x₍B₎`는 스프링의 다른 쪽 끝의 위치

## 탄성의 한계
실제 스프링은 특정 길이 범위 내에서만 후크의 법칙을 따릅니다. 이 범위를 "탄성의 한계"라고 합니다. 금속 스프링을 계속 늘리면 결국 탄성을 초과하여 변형됩니다. 마찬가지로, 스프링을 너무 많이 압축하면 코일이 서로 닿아 더 이상 압축이 불가능해집니다.

게임 물리 엔진에서는 대부분의 경우 이러한 복잡성을 모델링할 필요가 없습니다. 플레이어는 스프링이 가장 스프링다운 동작을 하는 것을 볼 것이며, 탄성의 한계에서 올바르게 작동하는지 여부는 거의 알아차리지 못합니다.

예외적으로, 자동차 서스펜션과 같이 특정 한계 이상으로 압축될 수 없는 스프링의 경우, 이는 스프링이 아닌 두 물체 간의 충돌처럼 작동합니다. 이러한 종류의 하드 제약 조건은 스프링만으로는 쉽게 모델링할 수 없습니다.

## 스프링 유사 물체
후크의 법칙은 금속 코일 스프링뿐만 아니라 다양한 자연 현상에 적용됩니다. 탄성 특성을 가진 모든 것은 일반적으로 후크의 법칙이 적용되는 탄성 한계를 가집니다.

### 응용 사례
1. **탄성 번지**: 스프링으로 구현 가능
2. **물의 부력**: 잠긴 물체를 표면의 가장 가까운 지점과 보이지 않는 스프링으로 연결하여 시뮬레이션
3. **카메라 제어**: 일부 개발자는 캐릭터를 따라가는 카메라를 제어하기 위해 스프링을 사용, 카메라에서 캐릭터 바로 뒤의 지점까지 스프링을 적용

## 스프링 유사 힘 생성기

물리 엔진에서는 스프링 힘을 기반으로 한 네 가지 힘 생성기를 구현할 수 있습니다. 각각은 스프링의 현재 길이를 계산하는 방식이 약간 다르지만, 모두 후크의 법칙을 사용하여 결과 힘을 계산합니다.

### 1. 기본 스프링 생성기

기본 스프링 생성기는 두 물체 사이의 거리를 계산하고 후크의 법칙을 적용하여 힘을 생성합니다. 다음과 같이 구현할 수 있습니다:

```cpp
class ParticleSpring : public ParticleForceGenerator
{
    // 스프링의 다른 쪽 끝에 있는 파티클
    Particle *other;
    // 스프링 상수
    real springConstant;
    // 스프링의 휴지 길이
    real restLength;

public:
    // 주어진 매개변수로 새 스프링 생성
    ParticleSpring(Particle *other, real springConstant, real restLength);
    // 주어진 파티클에 스프링 힘 적용
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleSpring::updateForce(Particle* particle, real duration)
{
    // 스프링의 벡터 계산
    Vector3 force;
    particle->getPosition(&force);
    force -= other->getPosition();
    
    // 힘의 크기 계산
    real magnitude = force.magnitude();
    magnitude = real_abs(magnitude - restLength);
    magnitude *= springConstant;
    
    // 최종 힘 계산 및 적용
    force.normalize();
    force *= -magnitude;
    particle->addForce(force);
}
```

이 생성기는 스프링의 다른 쪽 끝에 있는 물체, 스프링 상수, 휴지 길이의 세 가지 매개변수로 생성됩니다. 두 물체를 스프링으로 연결하려면 각 물체에 대해 생성기를 만들고 등록해야 합니다.

### 2. 고정점 스프링 생성기

많은 경우 두 물체를 스프링으로 연결하는 대신, 스프링의 한쪽 끝을 공간의 고정된 지점에 연결하고 싶을 수 있습니다. 예를 들어, 스프링 로프 다리의 지지 케이블이 이에 해당합니다.

![스프링 로프 다리](/assets/img/blog/physics/rope-bridge-springs.jpg)

```cpp
class ParticleAnchoredSpring : public ParticleForceGenerator
{
    // 스프링의 고정된 끝 위치
    Vector3 *anchor;
    // 스프링 상수
    real springConstant;
    // 스프링의 휴지 길이
    real restLength;

public:
    // 주어진 매개변수로 새 스프링 생성
    ParticleAnchoredSpring(Vector3 *anchor, real springConstant, real restLength);
    // 주어진 파티클에 스프링 힘 적용
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleAnchoredSpring::updateForce(Particle* particle, real duration)
{
    // 스프링의 벡터 계산
    Vector3 force;
    particle->getPosition(&force);
    force -= *anchor;
    
    // 힘의 크기 계산
    real magnitude = force.magnitude();
    magnitude = real_abs(magnitude - restLength);
    magnitude *= springConstant;
    
    // 최종 힘 계산 및 적용
    force.normalize();
    force *= -magnitude;
    particle->addForce(force);
}
```

게임의 카메라를 플레이어 캐릭터에 연결하려면 이 접근 방식을 사용할 수 있습니다. 고정점이 움직이지 않는 대신, 각 프레임마다 캐릭터의 위치에 따라 고정점을 재계산하고 재설정합니다.

### 3. 탄성 번지 생성기

탄성 번지는 당기는 힘만 생성합니다. 압축된 상태에서는 힘을 발생시키지 않지만, 늘어날 때는 일반 스프링처럼 작동합니다. 이는 두 물체를 함께 유지하는 데 유용합니다: 너무 멀리 떨어지면 서로 당겨지지만, 원하는 만큼 가까워질 수 있습니다.

```cpp
class ParticleBungee : public ParticleForceGenerator
{
    // 스프링의 다른 쪽 끝에 있는 파티클
    Particle *other;
    // 스프링 상수
    real springConstant;
    // 힘을 생성하기 시작하는 번지의 길이
    real restLength;

public:
    // 주어진 매개변수로 새 번지 생성
    ParticleBungee(Particle *other, real springConstant, real restLength);
    // 주어진 파티클에 스프링 힘 적용
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleBungee::updateForce(Particle* particle, real duration)
{
    // 스프링의 벡터 계산
    Vector3 force;
    particle->getPosition(&force);
    force -= other->getPosition();
    
    // 번지가 압축되었는지 확인
    real magnitude = force.magnitude();
    if (magnitude <= restLength) return;
    
    // 힘의 크기 계산
    magnitude = springConstant * (restLength - magnitude);
    
    // 최종 힘 계산 및 적용
    force.normalize();
    force *= -magnitude;
    particle->addForce(force);
}
```

### 4. 부력 힘 생성기

부력은 물체를 떠오르게 하는 힘입니다. 아르키메데스는 부력이 물체가 밀어낸 물의 무게와 같다는 것을 발견했습니다.

![부력 블록](/assets/img/blog/physics/buoyancy-block.jpg)

물체가 완전히 잠겼을 때와 부분적으로 잠겼을 때의 부력 계산은 다릅니다. 완전히 잠긴 물체는 더 깊이 밀어도 더 많은 물을 밀어내지 않으므로 힘은 동일합니다. 반면, 물체가 물 밖으로 올라갈 때는 물에서 완전히 나올 때까지 부분적으로 잠긴 상태를 유지합니다.

부력 힘 계산 공식은 다음과 같습니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
f = {
  0 (d ≤ 0일 때),<br>
  vρ (d ≥ 1일 때),<br>
  dvρ (그 외의 경우)
}
</div>

여기서:
- `s`는 잠김 깊이(물체가 완전히 잠기는 깊이)
- `ρ`는 액체의 밀도
- `v`는 물체의 부피
- `d`는 물체가 잠긴 정도(완전히 잠겼을 때 d = 1, 완전히 물 밖에 있을 때 d = 0)

`d`는 다음과 같이 계산됩니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
d = (y<sub>o</sub> - y<sub>w</sub> - s) / (2s)
</div>

여기서:
- `y₍o₎`는 물체의 y 좌표
- `y₍w₎`는 액체 평면의 y 좌표(XZ 평면과 평행하다고 가정)

```cpp
class ParticleBuoyancy : public ParticleForceGenerator
{
    // 최대 부력을 생성하기 전 물체의 최대 잠김 깊이
    real maxDepth;
    // 물체의 부피
    real volume;
    // y=0 위의 수면 높이
    real waterHeight;
    // 액체의 밀도 (순수한 물은 1000kg/m³)
    real liquidDensity;

public:
    // 주어진 매개변수로 새 부력 힘 생성
    ParticleBuoyancy(real maxDepth, real volume, real waterHeight,
                    real liquidDensity = 1000.0f);
    // 주어진 파티클에 부력 적용
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleBuoyancy::updateForce(Particle* particle, real duration)
{
    // 잠김 깊이 계산
    real depth = particle->getPosition().y;
    
    // 물 밖에 있는지 확인
    if (depth >= waterHeight + maxDepth) return;
    
    Vector3 force(0,0,0);
    
    // 최대 깊이에 있는지 확인
    if (depth <= waterHeight - maxDepth)
    {
        force.y = liquidDensity * volume;
        particle->addForce(force);
        return;
    }
    
    // 부분적으로 잠긴 경우
    force.y = liquidDensity * volume *
             (depth - maxDepth - waterHeight) / (2 * maxDepth);
    particle->addForce(force);
}
```

이 코드에서는 부력이 위쪽 방향으로 작용한다고 가정했습니다. 생성기는 네 가지 매개변수를 받습니다: 최대 깊이, 물체의 부피, 수면의 높이, 그리고 물체가 떠 있는 액체의 밀도입니다. 밀도 매개변수가 주어지지 않으면 물(밀도 1000 kg/m³)이 기본값으로 사용됩니다.

## 게임 물리 엔진에서의 구현
스프링 힘 생성기를 구현할 때는 각 물체에 대해 힘을 별도로 계산합니다. 최적화된 접근 방식에서는 관련된 두 물체 모두에 대해 동일한 힘 생성기를 사용하고, 한쪽에 대한 힘 계산을 캐시하여 다른 쪽에 대한 재계산 시간을 절약할 수 있습니다.

---

**참고 자료**: Game Physics Engine Development, Chapter 6: Springs and Springlike Things