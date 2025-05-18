---
layout: page
title: Potato & Fox
description: >
  ポテト & フォックス：私たちは誰よりも相性がいいけど、誰よりも一緒にいたくない友達関係
hide_description: false
lang: ja
---

![Potato & Fox Title](/assets/img/blog/gamedesign/potato-fox/title.png)

# Potato & Fox

## 概要

**ジャンル:** 3Dプラットフォーマー

**プラットフォーム:** PC / コンソール向け

### **核心テーマ**:
- 相性の良い二人のキャラクター
- 森の中の動物と植物の調和

## ゲームの特徴

- 二つのキャラクターを自由に切り替えながら適切なメカニズムを通じてステージをクリア

    - **ポテト:** 垂直的メカニズム（地面に植えてからジャンプ→キツネが踏んでスーパージャンプ可能）
    - **キツネ:** 水平的メカニズム（ポテトや他のオブジェクトを持ち上げて前方に投げる）

- ステージごとに二つのメカニズムを同時に適用して隠れたルートを開拓可能

- ボスもメカニズムを組み合わせて倒す必要がある

## ゲームプレイ

![ゲームコントロール](/assets/img/blog/gamedesign/potato-fox/controls.jpg)

- **WASD:** 移動
- **Ctrl:** しゃがむ
- **スペース:** ジャンプ（3段ジャンプ可能 - スーパーマリオ64スタイル）
- **スペース + Ctrl:** 遠くへ飛ぶ
- **マウス左クリック:** アビリティ

## レベルデザイン

### 最初のステージ草案

#### 地下1階

![F1 Floor Layout](/assets/img/blog/gamedesign/potato-fox/f1-layout.jpg)

- 横断に失敗した場合、地下へ誘導して狼と遭遇

#### 1階

![1F Floor Layout](/assets/img/blog/gamedesign/potato-fox/1f-layout.jpg)

- コインを食べると上部のゲージが上がることを学習
- キツネでポテトを投げると一度に通過できる距離を設定
- TODO: ゲージの意味を学習させるための直感的なUI必要
  - 例）鍵を持っているリス → ゲージが満タンになると鍵を放出するUIに変形

#### 2階

![2F Floor Layout](/assets/img/blog/gamedesign/potato-fox/2f-layout.jpg)

- <movement>
  - 一般的なジャンプでは登れない位置にオブジェクトがあることを暗示
  - キャラクター能力の組み合わせで登れることを学習
- <evade>
  - ゲージをすべて満たすとリスが鍵を渡す（自動）
  - ゲージを満たさずにリスに鍵をもらおうとジャンプするとドングリを撃ってくる
  - 不足しているコインを集められるように宝箱を配置
- <goal>
  - 目標を直線に配置して見えるようにするより、滝で隠して更に多くのプラットフォームがあるという感じを与える

#### 3階

![3F Floor Layout](/assets/img/blog/gamedesign/potato-fox/3f-layout.jpg)

- <movement>
  - スーパージャンプで丘に登るとレバーを通じて秘密のエレベーターを追加
  - 複雑な上部プラットフォームの位置でレバーの存在を学習したプレイヤーは次のステージから注意するようになる
- <evade>
  - 動くオブジェクトを避けさせて高度なコントロールを学習させる

## Assets
[Animal](https://www.fab.com/ko/listings/8a1a99a3-e09c-437e-80b5-ad00ef44cd5c)

[Acorn](https://www.fab.com/ko/listings/49159673-0da0-4162-8c45-84f91f849f3f)

[Animation#1](https://www.fab.com/ko/listings/0a4a5e43-6941-4a4b-ba7f-2bf7e8015c5c)

[Animation#2](https://www.fab.com/ko/listings/9319491d-0e91-422c-9b67-ad4bf6c01a02)

[Crouch](https://youtu.be/0DQJkzLqCLk?si=6FFzrlz8CaARFIkU)

[Waterfall](https://www.fab.com/ko/listings/23869931-3e46-4c42-b541-9f6057f12d13)

[Map, Obastacle](https://www.fab.com/ko/listings/07924fb1-9117-4b6f-9d3e-ac4f0c91e615)

[Sound](https://pixabay.com/sound-effects/search/game/)

[Portal](https://www.fab.com/ko/listings/09c25974-9702-42f0-8265-67cf982824b7)

[UI/Progress Bar](https://www.fab.com/ko/listings/59e7553a-5800-4757-ab63-0f0d2726f050)

## TODO

### ゲームメカニズム
- ボス遭遇時にもっとお互いのメカニズムを利用できるデザインが必要

### カメラシステム
- キャラクターが見える面積によって衝突チェック
- 仲間が先に死んだときのアクションカメラ

### キャラクターモデリング
- ポテトとキツネ

### キャラクターアニメーション
- はしごを登る

### AI
- ボスの部位によるEQSシステムを基にした回避システム
  - ボスの視界は必ず0、しかしグロッキー状態になると点数が1になる可能性もある
  - ボスの弱点に近いほど1に近づく