---
layout: page
title: 파이어웍스 시스템(Fireworks)
description: >
  파티클 시스템을 활용한 불꽃놀이 효과 구현
hide_description: false
---

파이어웍스(불꽃놀이) 시스템은 게임에서 가장 일반적으로 사용되는 파티클 물리의 응용 사례 중 하나입니다. 이는 단순한 시각적 효과를 넘어 폭발, 흐르는 물, 연기, 불 등 다양한 효과를 표현하는 데 활용될 수 있는 파티클 시스템의 화려한 응용입니다.

## 파이어웍스 데이터 구조

기본 파티클 구조에 추가 데이터를 포함시켜 파이어웍스를 구현합니다. 주요 추가 데이터는 다음과 같습니다:

### 1. 파티클 유형(Type)

파이어웍스는 여러 단계의 페이로드(payload)로 구성됩니다. 초기 로켓이 발사된 후 여러 개의 경량 미니 불꽃으로 폭발하고, 이들은 짧은 지연 후 다시 폭발할 수 있습니다. 이러한 다양한 유형의 불꽃을 정수 값으로 표현합니다.

### 2. 파티클 수명(Age)

파이어웍스는 정교하게 시간이 조절된 퓨즈로 연쇄 반응을 일으킵니다. 로켓은 먼저 모터에 점화하고, 짧은 비행 시간 후 모터가 타들어가면서 폭발 단계가 시작됩니다. 이 폭발은 추가 유닛을 흩뿌릴 수 있으며, 이들은 모두 동일한 길이의 퓨즈를 가져 최종 폭발이 거의 동시에 일어납니다(완전히 동시는 아니며, 약간의 차이가 있어야 자연스러움). 이를 지원하기 위해 각 파티클의 수명을 추적하고 매 프레임마다 업데이트합니다.

다음은 Firework 클래스의 기본 구조입니다:

```cpp
/**
 * 파이어웍스는 렌더링과 진화를 위한 추가 데이터가 있는 파티클입니다.
 */
class Firework : public cyclone::Particle
{
public:
    /** 파이어웍스는 규칙에 사용되는 정수 유형을 가집니다. */
    unsigned type;
    
    /**
     * 파이어웍스의 수명은 폭발 시점을 결정합니다. 수명은 점차 감소하며,
     * 0을 지나면 파이어웍스가 페이로드를 전달합니다.
     * 수명을 '남은 퓨즈'로 생각하세요.
     */
    cyclone::real age;
    
    /**
     * 주어진 시간 동안 파이어웍스를 업데이트합니다.
     * 파이어웍스가 수명이 다하여 제거되어야 하면 true를 반환합니다.
     */
    bool update(cyclone::real duration)
    {
        // 물리 상태 업데이트
        integrate(duration);
        
        // 수명을 0까지 감소시킵니다
        age -= duration;
        return (age < 0);
    }
};
```

## 파이어웍스 규칙(Rules)

파이어웍스 디스플레이의 효과를 정의하기 위해, 한 유형의 파티클이 다른 유형으로 변화하는 방식을 지정해야 합니다. 이를 규칙 세트로 정의합니다. 각 파이어웍스 유형에 대해 수명과 수명이 지났을 때 생성될 추가 파이어웍스에 대한 데이터를 저장합니다.

```cpp
/**
 * 파이어웍스 규칙은 퓨즈의 길이와 진화할 파티클을 제어합니다.
 */
struct FireworkRule
{
    /** 이 규칙이 관리하는 파이어웍스 유형 */
    unsigned type;
    
    /** 퓨즈의 최소 길이 */
    cyclone::real minAge;
    
    /** 퓨즈의 최대 길이 */
    cyclone::real maxAge;
    
    /** 이 파이어웍스의 최소 상대 속도 */
    cyclone::Vector3 minVelocity;
    
    /** 이 파이어웍스의 최대 상대 속도 */
    cyclone::Vector3 maxVelocity;
    
    /** 이 파이어웍스 유형의 감쇠 */
    cyclone::real damping;
    
    /**
     * 페이로드는 이 파이어웍스의 퓨즈가 끝났을 때 생성할
     * 새로운 파이어웍스 유형입니다.
     */
    struct Payload
    {
        /** 생성할 새 파티클의 유형 */
        unsigned type;
        
        /** 이 페이로드의 파티클 수 */
        unsigned count;
    };
    
    /** 이 파이어웍스 유형의 페이로드 수 */
    unsigned payloadCount;
    
    /** 페이로드 세트 */
    Payload *payloads;
    
    /**
     * 이 유형의 새 파이어웍스를 생성하고 주어진 인스턴스에 기록합니다.
     * 선택적 부모 파이어웍스는 위치와 속도의 기준으로 사용됩니다.
     */
    void create(Firework *firework, const Firework *parent = NULL) const
    {
        cyclone::Random r;
        firework->type = type;
        firework->age = r.randomReal(minAge, maxAge);
        
        if (parent) firework->setPosition(parent->getPosition());
        
        // 속도는 파티클의 속도입니다
        cyclone::Vector3 vel = parent->getVelocity();
        vel += r.randomVector(minVelocity, maxVelocity);
        firework->setVelocity(vel);
        
        // 모든 경우에 질량 1을 사용합니다
        // (중력의 영향만 받으므로 다른 질량을 가진 파이어웍스는 의미가 없음)
        firework->setMass(1);
        firework->setDamping(damping);
        firework->setAcceleration(cyclone::Vector3::GRAVITY);
        firework->clearAccumulator();
    }
};
```

규칙은 코드에서 제공되며, 모든 가능한 파이어웍스의 동작을 제어하는 함수에서 정의됩니다:

```cpp
void FireworksDemo::initFireworkRules()
{
    // 파이어웍스 유형을 순회하며 규칙을 생성합니다
    rules[0].setParameters(
        1,                          // 유형
        3, 5,                       // 수명 범위
        cyclone::Vector3(-5, -5, -5), // 최소 속도
        cyclone::Vector3(5, 5, 5),    // 최대 속도
        0.1                         // 감쇠
    );
    // ... 다른 파이어웍스 유형에 대해서도 마찬가지 ...
}
```

## 구현 세부 사항

### 파티클 생성 및 업데이트

각 프레임마다 모든 파이어웍스의 수명이 업데이트되고 규칙에 따라 확인됩니다. 수명이 임계값을 지나면 제거되고 더 많은 파이어웍스가 그 자리에 생성됩니다(연쇄 반응의 마지막 단계는 더 이상의 파이어웍스를 생성하지 않음).

```cpp
void FireworksDemo::create(unsigned type, const Firework *parent)
{
    // 이 파이어웍스를 생성하는 데 필요한 규칙을 가져옵니다
    FireworkRule *rule = rules + (type - 1);
    
    // 파이어웍스를 생성합니다
    rule->create(fireworks+nextFirework, parent);
    
    // 다음 파이어웍스의 인덱스를 증가시킵니다
    nextFirework = (nextFirework + 1) % maxFireworks;
}
```

파이어웍스가 생성되면 파티클 속성이 설정되며, 속도는 랜덤 요소로 결정됩니다.

여러 파이어웍스 유형에 높은 감쇠 값을 사용하면 폭발하기 전에 공중에 머무르는 효과를 낼 수 있습니다.

### 파이어웍스 업데이트 루프

매 프레임마다 현재 활성화된 모든 파이어웍스가 업데이트됩니다:

```cpp
for (Firework *firework = fireworks;
     firework < fireworks+maxFireworks;
     firework++)
{
    // 이 파이어웍스를 처리해야 하는지 확인합니다
    if (firework->type > 0)
    {
        // 제거가 필요한가요?
        if (firework->update(duration))
        {
            // 적절한 규칙을 찾습니다
            FireworkRule *rule = rules + (firework->type-1);
            
            // 현재 파이어웍스를 삭제합니다
            // (create 함수에 전달하기 위한 위치와 속도에는 영향을 주지 않고,
            // 렌더링이나 물리에 처리되는지 여부만 영향을 줍니다)
            firework->type = 0;
            
            // 페이로드를 추가합니다
            for (unsigned i = 0; i < rule->payloadCount; i++)
            {
                FireworkRule::Payload * payload = rule->payloads + i;
                create(payload->type, payload->count, firework);
            }
        }
    }
}
```

## 파티클 시스템의 다양한 응용

동일한 종류의 파티클 시스템이 많은 게임 엔진에서 사용됩니다. 파티클의 중력을 매우 낮은 값으로 설정하거나, 심지어 일부 종류의 파티클을 위로 끌어올리는 중력을 설정함으로써 연기, 불, 흐르는 물, 폭발, 불꽃, 비 등 다양한 효과를 만들 수 있습니다.

각 파티클 유형의 차이점은 주로 렌더링 방식에 있습니다. 파티클은 일반적으로 3차원 모델이 아닌 화면에 평면 비트맵으로 그려집니다.

대부분의 상용 파티클 시스템은 파티클이 회전할 수 있도록 합니다. 이는 이 책의 후반부에서 다룰 완전한 3차원 회전이 아니라, 각 파티클 비트맵이 화면에서 동일한 방향으로 그려지지 않도록 하는 화면 회전입니다. 이 회전이 시간에 따라 변하도록 하는 것이 유용할 수 있습니다.

## 파티클 물리 엔진의 활용

파티클 물리 엔진은 주로 특수 효과에 적합합니다:
- 발사체 무기의 탄도학
- 파티클 시스템
- 폭발에 대한 시각적 효과

이 장에서는 파티클 시스템을 사용하여 불꽃놀이를 렌더링했습니다. 이 외에도 수십 가지의 다른 용도가 있습니다. 대부분의 게임은 어떤 종류의 파티클 시스템을 사용합니다(종종 주요 물리 엔진과 완전히 별개로). 중력, 항력, 초기 속도에 대해 다른 속성을 가진 파티클을 설정함으로써 흐르는 물에서 연기, 화염구에서 불꽃놀이까지 모든 것을 시뮬레이션할 수 있습니다.

결국, 단일 파티클만으로는 충분하지 않을 것입니다. 완전한 3차원 객체가 필요합니다. 스프링, 막대, 케이블로 연결된 파티클로 구조를 구축하여 객체를 시뮬레이션하는 방법을 살펴볼 수 있습니다. 이러한 구조를 처리하기 위해서는 파티클에 작용하는 중력 외에도 더 많은 힘을 고려해야 합니다. 