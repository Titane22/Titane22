---
layout: page
title: 일반적인 힘의 추가
description: >
  다중 힘 시스템과 달랑베르의 원리를 이용한 물리 엔진 확장
hide_description: false
---

파티클 물리 엔진에 중력 이외의 다양한 힘을 추가하고 동시에 작용하는 여러 힘을 처리하는 방법을 살펴보겠습니다. 이를 위해 힘 생성기(Force Generator)라는 개념을 도입하여 게임 월드의 현재 상태를 기반으로 힘을 계산할 수 있게 됩니다.

## 달랑베르의 원리(D'Alembert's Principle)

여러 힘이 동시에 작용할 때 물체의 움직임을 계산하는 방법이 필요합니다. 한 힘이 다른 힘과 반대 방향으로 작용하거나 같은 방향으로 강화할 수 있기 때문입니다. 달랑베르의 원리는 이러한 상황을 해결하는 방법을 제시합니다.

### 합력 계산

달랑베르의 원리에 따르면, 물체에 작용하는 여러 힘은 단일 힘으로 대체할 수 있습니다. 이는 다음 공식으로 표현됩니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
f = Σ f<sub>i</sub>
</div>

즉, 벡터 덧셈을 사용하여 모든 힘을 더하고, 그 결과로 나온 단일 힘을 적용하면 됩니다.

## 구현 방법

### 1. 힘 누산기(Force Accumulator)

각 프레임에서 힘을 누적하기 위해 벡터를 힘 누산기로 사용합니다:

```cpp
class Particle
{
    // ... 기존 Particle 코드 ...

    /**
     * 다음 시뮬레이션 반복에서만 적용될 누적된 힘을 보관합니다.
     * 이 값은 각 적분 단계에서 0으로 초기화됩니다.
     */
    Vector3 forceAccum;

    /**
     * 파티클에 적용된 힘을 초기화합니다.
     * 각 적분 단계 후 자동으로 호출됩니다.
     */
    void clearAccumulator();
};
```

### 2. 적분기 업데이트

누적된 힘을 사용하여 가속도를 계산하고 파티클의 상태를 업데이트합니다:

```cpp
void Particle::integrate(real duration)
{
    assert(duration > 0.0);

    // 선형 위치 업데이트
    position.addScaledVector(velocity, duration);

    // 힘으로부터 가속도 계산
    Vector3 resultingAcc = acceleration;
    resultingAcc.addScaledVector(forceAccum, inverseMass);

    // 가속도로부터 선형 속도 업데이트
    velocity.addScaledVector(resultingAcc, duration);

    // 감쇠 적용
    velocity *= real_pow(damping, duration);

    // 힘 초기화
    clearAccumulator();
}

void Particle::clearAccumulator()
{
    forceAccum.clear();
}
```

### 3. 힘 추가 메서드

새로운 힘을 누산기에 추가하는 메서드를 구현합니다:

```cpp
class Particle
{
    // ... 기존 Particle 코드 ...

    /**
     * 주어진 힘을 파티클에 추가합니다.
     * 다음 반복에서만 적용됩니다.
     *
     * @param force 적용할 힘
     */
    void addForce(const Vector3 &force);
};

void Particle::addForce(const Vector3 &force)
{
    forceAccum += force;
}
```

## 힘 생성기(Force Generators)

대부분의 힘은 오랜 기간 동안 물체에 작용합니다. 이러한 장기적인 힘을 관리하기 쉽게 하기 위해 레지스트리 시스템을 만들 수 있습니다. 힘은 파티클에 자신을 등록하고, 각 프레임마다 힘을 제공하도록 요청받습니다. 이를 "힘 생성기"라고 합니다.

### 힘 생성기의 장점

1. **모듈화**: 각 힘의 계산 로직을 별도의 클래스로 분리할 수 있습니다.
2. **유연성**: 필요에 따라 힘을 동적으로 추가하거나 제거할 수 있습니다.
3. **재사용성**: 동일한 종류의 힘을 여러 파티클에 쉽게 적용할 수 있습니다.
4. **확장성**: 새로운 종류의 힘을 쉽게 추가할 수 있습니다.

## 응용

이러한 시스템을 사용하여 다음과 같은 다양한 힘을 구현할 수 있습니다:

1. 중력
2. 공기 저항
3. 부력
4. 스프링 힘
5. 자기력
6. 바람의 영향
7. 폭발력

각각의 힘은 자신만의 힘 생성기를 가질 수 있으며, 파티클 시스템은 이러한 모든 힘을 자연스럽게 조합하여 현실적인 물리 시뮬레이션을 만들어낼 수 있습니다.

# 힘 생성기의 구현

## 힘의 종류와 특성

물리 엔진에서 다양한 종류의 힘을 처리해야 합니다:

1. **항상 존재하는 힘**: 중력과 같이 항상 모든 물체에 작용하는 힘
2. **물체 행동에 따른 힘**: 물체의 움직임에 따라 발생하는 항력(drag)
3. **환경에 의한 힘**: 부력이나 폭발에 의한 힘
4. **연결에 의한 힘**: 스프링처럼 물체들이 연결되어 있을 때 발생하는 힘
5. **사용자 요청에 의한 힘**: 자동차 가속이나 제트팩 추진력

또한 힘의 동적 특성도 고려해야 합니다:
- **상수 힘**: 중력처럼 항상 일정한 힘
- **위치/속도 의존 힘**: 항력은 속도가 높을수록 강해지고, 스프링은 압축될수록 더 큰 힘을 발생
- **외부 요인에 의한 힘**: 폭발은 시간이 지남에 따라 소멸되고, 제트팩은 버튼을 놓으면 즉시 중단

이러한 다양한 힘을 효율적으로 처리하기 위해 힘 생성기(Force Generator) 구조를 사용합니다.

## 인터페이스와 다형성

힘 생성기를 구현하기 위해 인터페이스와 다형성 개념을 활용합니다:

**인터페이스(Interface)**: 소프트웨어 컴포넌트가 다른 컴포넌트와 상호작용하는 방식을 명세합니다. 객체지향 언어에서는 클래스가 노출할 메서드, 상수, 데이터 타입, 예외 등을 지정합니다.

**다형성(Polymorphism)**: 어떤 명세를 충족하는 소프트웨어 컴포넌트를 사용할 수 있는 언어의 능력입니다. 우리의 경우, 힘 생성기 인터페이스를 구현하는 모든 클래스는 동일한 방식으로 사용될 수 있습니다.

C++에서는 순수 가상 함수를 가진 기본 클래스를 사용하여 인터페이스를 구현합니다.

## 힘 생성기 인터페이스

힘 생성기 인터페이스는 현재 힘을 제공하는 기능만 필요합니다:

```cpp
/**
 * 힘 생성기는 하나 이상의 파티클에 힘을 추가하도록 요청받을 수 있습니다.
 */
class ParticleForceGenerator
{
public:
    /**
     * 주어진 파티클에 적용되는 힘을 계산하고 업데이트하기 위해
     * 인터페이스 구현에서 이 메서드를 오버로드하세요.
     */
    virtual void updateForce(Particle *particle, real duration) = 0;
};
```

`updateForce` 메서드는 힘이 필요한 프레임의 지속 시간과 힘을 요청하는 파티클에 대한 포인터를 전달받습니다. 프레임 지속 시간은 일부 힘 생성기(예: 스프링 힘 생성기)에 필요합니다.

힘 생성기는 값을 반환하지 않고, 대신 전달받은 파티클의 `addForce` 메서드를 호출하여 힘을 적용합니다.

## 힘 레지스트리

어떤 힘 생성기가 어떤 파티클에 영향을 미치는지 등록하는 메커니즘이 필요합니다. 이를 위해 중앙 레지스트리를 사용합니다:

```cpp
/**
 * 모든 힘 생성기와 그들이 적용되는 파티클을 보관합니다.
 */
class ParticleForceRegistry
{
protected:
    /**
     * 하나의 힘 생성기와 그것이 적용되는 파티클을 추적합니다.
     */
    struct ParticleForceRegistration
    {
        Particle *particle;
        ParticleForceGenerator *fg;
    };
    
    /**
     * 등록 목록을 보관합니다.
     */
    typedef std::vector<ParticleForceRegistration> Registry;
    Registry registrations;
    
public:
    /**
     * 주어진 힘 생성기가 주어진 파티클에 적용되도록 등록합니다.
     */
    void add(Particle* particle, ParticleForceGenerator *fg);
    
    /**
     * 주어진 등록된 쌍을 레지스트리에서 제거합니다.
     * 쌍이 등록되어 있지 않으면 이 메서드는 아무 효과가 없습니다.
     */
    void remove(Particle* particle, ParticleForceGenerator *fg);
    
    /**
     * 레지스트리에서 모든 등록을 지웁니다.
     * 이는 파티클이나 힘 생성기 자체를 삭제하지 않고,
     * 단지 그들의 연결 기록만 삭제합니다.
     */
    void clear();
    
    /**
     * 모든 힘 생성기를 호출하여 해당 파티클의 힘을 업데이트합니다.
     */
    void updateForces(real duration);
};
```

각 프레임에서 업데이트가 수행되기 전에 모든 힘 생성기가 호출됩니다. 이들은 누산기에 힘을 추가하고, 이 힘은 나중에 각 파티클의 가속도를 계산하는 데 사용됩니다:

```cpp
void ParticleForceRegistry::updateForces(real duration)
{
    Registry::iterator i = registrations.begin();
    for (; i != registrations.end(); i++)
    {
        i->fg->updateForce(i->particle, duration);
    }
}
```

## 중력 힘 생성기

이전의 중력 구현을 힘 생성기로 대체할 수 있습니다. 각 프레임마다 일정한 가속도를 적용하는 대신, 중력은 각 파티클에 연결된 힘 생성기로 표현됩니다:

```cpp
/**
 * 중력 힘을 적용하는 힘 생성기입니다.
 * 하나의 인스턴스를 여러 파티클에 사용할 수 있습니다.
 */
class ParticleGravity : public ParticleForceGenerator
{
    /** 중력에 의한 가속도를 보관합니다. */
    Vector3 gravity;
    
public:
    /** 주어진 가속도로 생성기를 생성합니다. */
    ParticleGravity(const Vector3 &gravity);
    
    /** 주어진 파티클에 중력 힘을 적용합니다. */
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleGravity::updateForce(Particle* particle, real duration)
{
    // 무한 질량이 아닌지 확인합니다.
    if (!particle->hasFiniteMass()) return;
    
    // 질량에 비례한 힘을 파티클에 적용합니다.
    particle->addForce(gravity * particle->getMass());
}
```

이 클래스는 중력 가속도만 저장하며, 하나의 인스턴스를 여러 물체에서 공유할 수 있습니다.

## 항력 힘 생성기

항력(Drag)은 물체의 속도에 따라 작용하는 힘입니다. 게임에서는 일반적으로 다음과 같은 단순화된 항력 모델을 사용합니다:

<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
f<sub>drag</sub> = -v̂(k<sub>1</sub>|v| + k<sub>2</sub>|v|<sup>2</sup>)
</div>

여기서 k<sub>1</sub>과 k<sub>2</sub>는 항력의 강도를 특징짓는 두 상수로, "항력 계수"라고 합니다. 이 공식은 물체 속도의 반대 방향으로 힘이 작용하며, 그 강도는 속도와 속도의 제곱에 모두 의존한다는 것을 나타냅니다.

k<sub>2</sub> 값이 있는 항력은 높은 속도에서 더 빠르게 증가합니다. 이는 자동차가 무한정 가속하는 것을 막는 공기역학적 항력의 경우입니다. 저속에서는 공기 저항이 거의 없지만, 속도가 두 배가 될 때마다 항력은 거의 네 배가 됩니다.

```cpp
/**
 * 항력 힘을 적용하는 힘 생성기입니다.
 * 하나의 인스턴스를 여러 파티클에 사용할 수 있습니다.
 */
class ParticleDrag : public ParticleForceGenerator
{
    /** 속도 항력 계수를 보관합니다. */
    real k1;
    
    /** 속도 제곱 항력 계수를 보관합니다. */
    real k2;
    
public:
    /** 주어진 계수로 생성기를 생성합니다. */
    ParticleDrag(real k1, real k2);
    
    /** 주어진 파티클에 항력을 적용합니다. */
    virtual void updateForce(Particle *particle, real duration);
};

void ParticleDrag::updateForce(Particle* particle, real duration)
{
    Vector3 force;
    particle->getVelocity(&force);
    
    // 총 항력 계수를 계산합니다.
    real dragCoeff = force.magnitude();
    dragCoeff = k1 * dragCoeff + k2 * dragCoeff * dragCoeff;
    
    // 최종 힘을 계산하고 적용합니다.
    force.normalize();
    force *= -dragCoeff;
    particle->addForce(force);
}
```

이 항력 모델은 3장에서 사용한 단순 감쇠보다 훨씬 복잡합니다. 골프공이 비행 중에 경험하는 항력과 같은 현상을 모델링하는 데 사용할 수 있습니다. 그러나 비행 시뮬레이터에 필요한 공기역학에는 충분하지 않을 수 있습니다.

## 힘 생성기의 확장성

힘 생성기 시스템의 주요 장점은 확장성입니다. 새로운 종류의 힘이 필요할 때마다 `ParticleForceGenerator` 인터페이스를 구현하는 새 클래스를 만들기만 하면 됩니다. 물리 엔진 자체를 수정할 필요 없이 다양한 힘을 추가할 수 있습니다.

이러한 접근 방식은 게임 개발에서 특히 유용합니다. 새로운 게임 메커니즘이나 레벨에 맞춰 물리 시스템을 확장할 수 있기 때문입니다. 예를 들어, 자기장, 바람, 소용돌이, 중력장 등 다양한 환경 효과를 쉽게 구현할 수 있습니다.

# 내장 중력과 감쇠

## 힘 생성기 vs 직접 적용

앞서 설명한 힘 생성기를 사용하면 중력과 감쇠(damping)를 모두 힘 생성기로 대체할 수 있습니다. 이 접근 방식은 많은 물리 엔진에서 사용되며 다음과 같은 장점이 있습니다:

1. 감쇠를 처리하는 특별한 코드를 제거할 수 있습니다.
2. 물체에 중력 가속도를 저장할 필요가 없습니다.
3. 모든 힘을 일관된 방식으로 처리할 수 있습니다.

그러나 이 책에서는 이 접근 방식을 사용하지 않습니다. 3장에서 했던 것처럼 감쇠와 중력 가속도를 직접 적용하는 것이 더 빠르기 때문입니다. 매번 이들에 대한 힘을 계산하는 것은 이미 답을 알고 있는 계산에 추가 시간을 낭비하는 것입니다.

## 효율적인 접근 방식

효율성을 위해 다음과 같은 접근 방식을 취합니다:

1. **감쇠와 가속도 유지**: 기본적인 감쇠와 중력 가속도는 직접 적용합니다.

2. **복잡한 항력 처리**: 더 복잡한 항력이 필요한 경우, 감쇠 값을 1에 가깝게 설정하고 항력 힘 생성기를 추가합니다.

3. **특수한 중력 처리**: 특이한 형태의 중력이 필요한 경우(예: 궤도를 도는 우주선), 올바른 동작을 제공하는 중력 힘 생성기를 만들고 중력 가속도를 0으로 설정합니다.

이 방식은 기본적인 물리 효과에 대해서는 효율성을 유지하면서도, 필요할 때 더 복잡한 물리 효과를 추가할 수 있는 유연성을 제공합니다.

# 요약

## 힘의 조합

힘은 벡터를 더함으로써 쉽게 조합할 수 있으며, 총합은 마치 그것이 물체에 적용된 유일한 힘인 것처럼 작용합니다. 이것이 달랑베르의 원리이며, 이를 통해 힘이 어떻게 생성되는지에 대해 알 필요 없이 여러 일반적인 힘을 지원할 수 있습니다.

## 힘 생성기의 역할

이 책 전반에 걸쳐 다양한 종류의 힘 생성기를 볼 수 있습니다. 이들은 물체에 적용할 힘을 계산함으로써 어떤 종류의 물리적 속성을 시뮬레이션합니다. 이 장에서 만든 코드는 이러한 힘을 관리하고, 결합하고, 적분하기 전에 적용할 수 있게 해줍니다.

## 다음 단계

항력과 중력은 중요한 힘 생성기이지만, 이들은 단지 우리가 파티클 물리 엔진에서 이미 가지고 있던 기능을 복제할 뿐입니다. 질량-집합체(mass-aggregate) 물리 엔진으로 나아가기 위해서는 파티클들을 서로 연결하기 시작해야 합니다. 다음 장에서는 이 장에서 구축한 힘 생성기 구조를 사용하여 스프링과 다른 스프링과 유사한 연결을 소개합니다. 