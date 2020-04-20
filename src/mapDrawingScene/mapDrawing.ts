import "phaser";
import {BattleSceneBottomLayer} from "../battleScene/battleSceneBottomLayer"

export class MapDrawingScene extends Phaser.Scene {
  battleSceneBottomLayer: BattleSceneBottomLayer

  constructor() {
    super({
      key: "MapDrawingScene"
    });
    this.battleSceneBottomLayer = new BattleSceneBottomLayer(this)
  }
  init(params: any): void {
    this.battleSceneBottomLayer.init(params)
  }

  preload(): void {
    this.battleSceneBottomLayer.preload()
  }

  create(): void {
    this.battleSceneBottomLayer.create()
  }

  update(time: number, delta: number): void {
    super.update(time, delta)
    this.battleSceneBottomLayer.update(time, delta)
  }
};