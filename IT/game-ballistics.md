---
layout: page
title: 탄도학(Ballistics)
description: >
  게임에서의 발사체 물리 시뮬레이션 구현
hide_description: false
---

게임 물리 엔진에서 가장 흔한 응용 중 하나는 탄도학(ballistics)을 모델링하는 것입니다. 이는 현대 물리 엔진이 유행하기 전부터 20년 이상 게임에서 사용되어 온 기술입니다.

## 발사체 시뮬레이션의 기본 개념

탄도학 시뮬레이션에서는 각 무기가 파티클을 발사합니다. 이 파티클은 총알, 포탄, 화염구, 레이저 볼트 등 다양한 발사체를 표현할 수 있습니다. 이러한 발사체들은 모두 "projectile"이라고 통칭합니다.

각 무기는 특징적인 **총구 속도(muzzle velocity)**를 가집니다:
- 발사체가 무기에서 발사되는 속도
- 레이저 볼트는 매우 빠르고, 화염구는 상대적으로 느림
- 게임에서 사용되는 총구 속도는 실제 세계의 동등한 무기와 다를 수 있음

## 발사체 속성 설정

### 현실적인 속도와 게임 속도의 차이

실제 무기의 총구 속도:
- 가장 느린 총: 약 250 m/s
- 장갑을 관통하는 탱크 포탄: 약 1,800 m/s
- 레이저와 같은 에너지 무기: 빛의 속도(300,000,000 m/s)

이러한 값들은 게임에서 사용하기에 너무 높습니다. 1km² 크기의 게임 레벨에서 0.5초 만에 지나가는 총알은 플레이어에게 거의 보이지 않을 것입니다. 이런 경우에는 물리 시뮬레이션을 사용하지 않고, 무기가 발사된 순간 레벨을 통과하는 광선(ray)을 발사하여 대상과 충돌하는지 확인하는 것이 더 효과적입니다.

게임에서 발사체의 움직임을 가시적으로 만들기 위해서는 인간 규모의 게임에서 약 5~25 m/s 범위의 총구 속도를 사용합니다. 이로 인해 두 가지 결과가 발생합니다:

### 1. 파티클 질량 조정

발사체가 충돌할 때의 효과는 질량과 속도 모두에 의존합니다. 속도를 낮추면 보상을 위해 질량을 증가시켜야 합니다.

에너지, 질량, 속도를 연결하는 방정식:
<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
e = ms²
</div>
여기서 e는 에너지, s는 발사체의 속도입니다.

동일한 에너지를 유지하기 위한 질량 변화 계산:
<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
m₂ = m₁ × (s₁/s₂)²
</div>

예시:
- 실제 5g 총알이 500 m/s로 이동
- 게임에서 25 m/s로 감속 (s₁/s₂ = 20)
- 동일한 에너지를 위해 질량을 400배 증가: 2kg

### 2. 중력 감소

대부분의 발사체는 비행 중에 너무 많이 감속되지 않아야 하므로, 감쇠(damping) 매개변수는 1에 가까워야 합니다. 포탄이나 박격포탄은 중력에 의해 곡선을 그릴 수 있지만, 다른 유형의 발사체는 중력의 영향을 거의 받지 않아야 합니다.

속도 변화에 따른 "현실적인" 중력 값 계산:
<div style="font-size: 1.5em; text-align: center; margin: 20px 0;">
g<sub>bullet</sub> = (1/s) × g<sub>normal</sub>
</div>
여기서 g<sub>normal</sub>은 시뮬레이션하려는 중력입니다(대부분의 게임에서 10 m/s²).

예시:
- 총알 예제에서 s = 20
- g_bullet = 0.5 m/s²

## 구현 예시

다음은 발사체 유형에 따라 파티클 속성을 설정하는 코드 예시입니다:

```cpp
// 파티클 속성 설정
switch(currentShotType) {
case PISTOL:
    shot->particle.setMass(2.0f);                // 2.0kg
    shot->particle.setVelocity(0.0f, 0.0f, 35.0f); // 35m/s
    shot->particle.setAcceleration(0.0f, -1.0f, 0.0f);
    shot->particle.setDamping(0.99f);
    break;
case ARTILLERY:
    shot->particle.setMass(200.0f);              // 200.0kg
    shot->particle.setVelocity(0.0f, 30.0f, 40.0f); // 50m/s
    shot->particle.setAcceleration(0.0f, -20.0f, 0.0f);
    shot->particle.setDamping(0.99f);
    break;
case FIREBALL:
    shot->particle.setMass(1.0f);                // 1.0kg - 주로 폭발 데미지
    shot->particle.setVelocity(0.0f, 0.0f, 10.0f); // 5m/s
    shot->particle.setAcceleration(0.0f, 0.6f, 0.0f); // 위로 떠오름
    shot->particle.setDamping(0.9f);
    break;
case LASER:
    // 영화에서 보이는 레이저 볼트 (실제 레이저 빔이 아님)
    shot->particle.setMass(0.1f);                // 0.1kg - 거의 무게 없음
    shot->particle.setVelocity(0.0f, 0.0f, 100.0f); // 100m/s
    shot->particle.setAcceleration(0.0f, 0.0f, 0.0f); // 중력 없음
    shot->particle.setDamping(0.99f);
    break;
}

// 모든 파티클 유형에 공통적인 데이터 설정
shot->particle.setPosition(0.0f, 1.5f, 0.0f);
shot->startTime = TimingData::get().lastFrameTimestamp;
shot->type = currentShotType;

// 힘 누산기 초기화
shot->particle.clearAccumulator();
```

물리 업데이트 코드:

```cpp
// 각 파티클의 물리 업데이트
for (AmmoRound *shot = ammo; shot < ammo+ammoRounds; shot++) {
    if (shot->type != UNUSED) {
        // 물리 실행
        shot->particle.integrate(duration);
        
        // 파티클이 유효한지 확인
        if (shot->particle.getPosition().y < 0.0f ||
            shot->startTime+5000 < TimingData::get().lastFrameTimestamp ||
            shot->particle.getPosition().z > 200.0f) {
            // 발사체 타입을 미사용으로 설정하여 메모리 재사용
            shot->type = UNUSED;
        }
    }
}
```

## 실제 게임에서의 응용

실제 게임에서는 발사체가 무언가와 충돌했는지 확인하기 위해 충돌 감지 시스템을 사용합니다. 추가적인 게임 로직을 통해 대상 캐릭터의 체력을 감소시키거나 표면에 총알 구멍 그래픽을 추가할 수 있습니다.

완전한 물리 엔진과 결합하면 다양한 발사체의 에너지와 충격 효과를 현실적으로 시뮬레이션할 수 있습니다.

## 소스 코드

이 문서에서 설명한 탄도학 시스템의 전체 소스 코드는 다음 GitHub 저장소에서 확인할 수 있습니다:

[GitHub - Ballistics Physics System](https://github.com/titane22/game-physics-engine/tree/main/ballistics)
