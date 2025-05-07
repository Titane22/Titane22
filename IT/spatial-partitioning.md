---
layout: page
title: 공간 분할 구조 (Spatial Partitioning)
description: >
  게임 개발에서 활용되는 공간 분할 구조의 개념과 종류, 활용 방법
hide_description: false
lang: ko
---

## 개요

공간 분할 구조는 2D 또는 3D 공간을 더 작은 영역으로 나누어 효율적으로 관리하는 데이터 구조입니다. 게임 개발에서는 충돌 감지, 객체 배치, 렌더링 최적화 등 다양한 목적으로 사용됩니다. 적절한 공간 분할 구조를 활용하면 게임의 성능을 크게 향상시킬 수 있습니다.

## 주요 공간 분할 구조

### 1. 그리드 (Grid)

#### 개념
- 공간을 균일한 크기의 셀(격자)로 나눕니다.
- 가장 단순하고 구현하기 쉬운 방법입니다.

#### 장점
- 구현이 간단하고 직관적입니다.
- 객체 위치에 따른 셀 계산이 빠릅니다.
- 메모리 사용량이 예측 가능합니다.

#### 단점
- 객체 분포가 불균일할 때 비효율적입니다.
- 고정된 셀 크기로 인해 세밀한 조정이 어렵습니다.

### 2. 쿼드트리 (Quadtree) / 옥트리 (Octree)

#### 개념
- **쿼드트리**: 2D 공간을 재귀적으로 4개의 영역으로 분할합니다.
- **옥트리**: 3D 공간을 재귀적으로 8개의 영역으로 분할합니다.
- 객체 밀도에 따라 분할 깊이가 달라집니다.

#### 장점
- 객체 분포에 적응적으로 대응합니다.
- 특정 영역 내 객체 검색이 효율적입니다.
- 메모리 사용이 객체 분포에 따라 최적화됩니다.

#### 단점
- 구현이 그리드보다 복잡합니다.
- 동적 환경에서 트리 재구성 비용이 발생할 수 있습니다.

### 3. BSP 트리 (Binary Space Partitioning)

#### 개념
- 공간을 평면으로 재귀적으로 이진 분할합니다.
- 분할 평면의 방향이 자유롭습니다.

#### 장점
- 복잡한 기하학적 구조에 적합합니다.
- 렌더링 순서 결정에 유용합니다.

#### 단점
- 구현이 복잡합니다.
- 동적 환경에서는 성능이 저하될 수 있습니다.

### 4. kD 트리 (k-dimensional tree)

#### 개념
- k차원 공간을 축에 수직인 평면으로 이진 분할합니다.
- 각 레벨마다 분할 축이 순환됩니다.

#### 장점
- 다차원 데이터에 효율적입니다.
- 최근접 이웃 검색에 유용합니다.

#### 단점
- 동적 환경에서 업데이트가 어렵습니다.

## 언리얼 엔진에서의 활용

언리얼 엔진은 내부적으로 다양한 공간 분할 구조를 사용합니다:

- **언리얼의 월드 파티셔닝 (World Partitioning)**: 대규모 오픈 월드를 관리하기 위한 시스템으로, 공간 분할 구조를 활용합니다.
- **물리 엔진**: 충돌 감지를 위해 공간 분할 구조를 사용합니다.
- **렌더링 최적화**: 가시성 결정과 컬링을 위해 공간 분할 구조를 활용합니다.

## 객체 배치에 공간 분할 구조 활용하기

AttachableSpawnVolume과 같은 시스템에서 최소 간격을 유지하며 객체를 배치할 때 공간 분할 구조를 활용할 수 있습니다:

1. **그리드 기반 접근법**:
   - 전체 공간을 최소 간격 기반의 그리드로 나눕니다.
   - 각 셀에 최대 하나의 객체만 배치하여 최소 간격을 보장합니다.

2. **적응형 접근법**:
   - 복잡한 환경에서는 쿼드트리나 옥트리를 사용하여 적응적으로 공간을 분할합니다.
   - 객체 밀도에 따라 더 세밀하게 분할하여 효율성을 높입니다.

## 공간 분할 구조 구현 예시

다음은 간단한 2D 그리드 기반 공간 분할 구조의 의사 코드입니다:

```cpp
class SpatialGrid {
private:
    float cellSize;                 // 각 셀의 크기
    Map<GridCoord, List<Entity>> cells;  // 그리드 셀과 해당 셀에 있는 엔티티 목록

public:
    // 엔티티 추가
    void AddEntity(Entity entity) {
        GridCoord cell = WorldToGrid(entity.position);
        cells[cell].Add(entity);
    }

    // 엔티티 이동
    void MoveEntity(Entity entity, Vector2 oldPosition, Vector2 newPosition) {
        GridCoord oldCell = WorldToGrid(oldPosition);
        GridCoord newCell = WorldToGrid(newPosition);

        if (oldCell != newCell) {
            cells[oldCell].Remove(entity);
            cells[newCell].Add(entity);
        }
    }

    // 특정 반경 내 모든 엔티티 찾기
    List<Entity> GetEntitiesInRadius(Vector2 position, float radius) {
        List<Entity> result;
        GridCoord center = WorldToGrid(position);
        int cellRadius = Ceil(radius / cellSize);

        // 주변 셀 모두 검사
        for (int x = -cellRadius; x <= cellRadius; x++) {
            for (int y = -cellRadius; y <= cellRadius; y++) {
                GridCoord currentCell = center + GridCoord(x, y);
                
                if (cells.Contains(currentCell)) {
                    for (Entity entity : cells[currentCell]) {
                        if (Distance(position, entity.position) <= radius) {
                            result.Add(entity);
                        }
                    }
                }
            }
        }
        
        return result;
    }

private:
    // 월드 좌표를 그리드 좌표로 변환
    GridCoord WorldToGrid(Vector2 position) {
        return GridCoord(
            Floor(position.x / cellSize),
            Floor(position.y / cellSize)
        );
    }
};
```

## 결론

공간 분할 구조는 게임 개발에서 성능 최적화를 위한 핵심 기술입니다. 각 구조마다 장단점이 있으므로, 게임의 특성과 요구사항에 맞는 적절한 구조를 선택하는 것이 중요합니다. 대규모 오픈 월드 게임이나 많은 객체가 상호작용하는 시뮬레이션에서는 효율적인 공간 분할 구조가 게임의 성능을 결정짓는 중요한 요소가 될 수 있습니다. 