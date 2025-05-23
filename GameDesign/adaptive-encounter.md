---
layout: page
title: 適応型エンカウント
description: >
  プレイヤーの傾向に応じて動的に調整される戦闘頻度設定システム
hide_description: false
lang: ja
---

# 適応型エンカウントシステム (Adaptive Encounter System)

## 見えない変数：ERGゲージ
ERGゲージは0〜100の値で存在し、
ユーザーの戦闘行動パターンに応じてリアルタイムで変化する。

ERGが高いほど：戦闘を頻繁に行う → 好戦的

ERGが低いほど：戦闘を回避する → 回避的

## 初期値
ゲーム開始時、ERGは中間値の50からスタート

## ERG変化条件

| 行動 | 変化量 | 説明 |
|------|--------|------|
| モンスターとの戦闘開始 | +5 | 単純な戦闘参加 |
| 戦闘での勝利 | +5 | 勝利するとさらに増加 |
| 戦闘連続参加（N分以内N回） | +10 | 好戦的プレイの強化 |
| 戦闘逃走/回避 | -10 | 回避的プレイの強化 |
| モンスター近くでの回避（検知後離脱） | -5 | 避けた行動自体に反応 |
| 一定時間非戦闘状態維持 | -1/分 | 段階的な減少 |

## ERGに応じたエンカウント変化
ERG値に応じて以下のような敵スポーンシステムが変化する。

| ERG範囲 | モンスター数 | スポーン間隔 | モンスターの性質 |
|----------|-----------|-----------|-------------|
| 0〜30 | 少ない | 遅い | 偵察型、先に攻撃しない |
| 31〜70 | 普通 | 普通 | 状況に応じて反応 |
| 71〜100 | 多い | 速い | 積極的にエンカウントを試みる（遠距離から認識） |

また、ERGが高いほどモンスターがプレイヤーを追跡する範囲と速度も増加し、
好戦的なユーザーは戦闘を望まなくても戦いに巻き込まれやすくなる

## ボーナスシステム
### 戦闘適応度システム
- ERG数値に応じて経験値補正を提供：
    - 回避ユーザーが少ない戦闘で大きな経験値 → 危険な挑戦への報酬
    - 好戦ユーザーは数量で経験値を確保 → 持続的な成長を誘導

### 適応型クエスト/報酬分岐
ERGが高いと攻撃的なモンスター/ボスが出現し、
低いと探索や回避特化のクエスト/報酬が出現

## システムデザインの意義
ユーザーが明示的に難易度を調整しなくても、自然に自分のスタイルでゲームを楽しめる
→ ゲームがユーザーのスタイルを認識し反応するため、より没入感を与える 