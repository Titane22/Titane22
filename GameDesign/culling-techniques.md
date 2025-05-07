---
layout: page
title: フラスタム & オクルージョンカリング
description: >
  3Dレンダリング最適化のためのカリング技法の説明
hide_description: false
---

## フラスタムカリング (Frustum Culling)

<figure style="text-align: center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/frustum-culling.gif" alt="フラスタムカリングダイアグラム">
  <figcaption>カメラフラスタムと視野角ベースのカリング</figcaption>
</figure>

### 概要
- カメラの視野(View Frustum)外にあるオブジェクトをレンダリングしない技法
- 6つのクリッピング平面(上、下、左、右、近、遠)で構成されるフラスタム内部のオブジェクトのみをレンダリング

### 実装方法
   [Frustum Culling Algorithms](https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling)


## オクルージョンカリング (Occlusion Culling)

<p align="center">
  <img src="{{ site.baseurl }}/assets/img/blog/gamedev/occlusion-culling.gif" alt="オクルージョンカリング例"><br>
  <em>他のオブジェクトによって隠されたものをレンダリングから除外</em>
</p>

### 概要
- 他のオブジェクトによって隠された(Occluded)オブジェクトをレンダリングしない技法
- 視点から見えないオブジェクトを識別してレンダリングパイプラインから除外

### 実装方法
   [Occlusion Culling Algorithms](https://www.gamedeveloper.com/programming/occlusion-culling-algorithms)

   (難しい...)

   [Hierarchical Depth Buffers](https://miketuritzin.com/post/hierarchical-depth-buffers/)

   (難しい...2)

## 結論
フラスタムカリングとオクルージョンカリングは3Dレンダリング最適化の核心技術です。
二つの技法を適切に組み合わせて使用するとレンダリングパフォーマンスを大きく向上させることができます。
特に大規模3D環境では必須の最適化技法であり、
現代のゲームエンジンはこれらの技術を基本的に提供しています。 