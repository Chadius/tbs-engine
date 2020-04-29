import "phaser";
import {ZoomInfoForBattleMainLayer} from "../battleSceneUtilities/zoomLevelManagement";
export class BattleSceneBottomLayer {
  rowHeight = 64;
  tileWidth = 64;
  scene: Phaser.Scene
  zoomInfo: ZoomInfoForBattleMainLayer

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  init(params: any): void {
  }

  preload(): void {
    this.scene.load.image("sand", "assets/BrownSand.png");
  }

  create(): void {
    this.setupCamera()

    this.drawMapLayer()
  }

  centerCamera(x: number, y: number) {
    this.scene.cameras.main.setZoom(2.0)
    this.scene.cameras.main.setScroll(x, y)
  }

  update(time: number, delta: number): void {
    this.updateCameraZoom(delta)
  }

  drawMapLayer() {
    this.drawRow(0, 3)
    this.drawRow(1, 3)
    this.drawRow(2, 3)
    this.drawRow(3, 3)
  }

  drawRow(row: number, width: number): void {
    const oddRowHorizontalOffset = 32;
    const oddRowVerticalOffset = 16;

    let drawX = this.tileWidth;
    let drawY = 600 - this.rowHeight;

    const rowIsOdd = (row % 2 === 1);
    if (rowIsOdd) {
      drawX = drawX + oddRowHorizontalOffset;
    }

    drawY = drawY - ((this.rowHeight - oddRowVerticalOffset) * row);

    for(let i = 0; i < width; i++) {
      this.scene.physics.add.image(drawX + (i * this.tileWidth), drawY, "sand");
    }
  }

  setupCamera() {
    this.centerCamera(-200, 200)
    this.createCameraControls()
    this.zoomInfo = new ZoomInfoForBattleMainLayer({
      initial: 1.0,
      min: 1.0 / 4.0,
      max: 1.0 * 4.0,
      interpolator: Phaser.Math.Interpolation.Linear,
    })

    this.scene.cameras.main.setZoom(this.zoomInfo.getCurrentZoomLevel())
  }

  createCameraControls() {
    this.scene.input.keyboard.on('keydown-MINUS', (event) => {
      this.zoomOutCamera()
    })
    this.scene.input.keyboard.on('keydown-PLUS', (event) => {
      this.zoomInCamera()
    })
  }

  zoomInCamera() {
    if (this.zoomInfo.isInTransition()) {
      return
    }
    this.zoomInfo.transitionZoomLevel(this.zoomInfo.getCurrentZoomLevel() * 2.0)
  }

  zoomOutCamera() {
    if (this.zoomInfo.isInTransition()) {
      return
    }
    this.zoomInfo.transitionZoomLevel(this.zoomInfo.getCurrentZoomLevel() / 2.0)
  }

  updateCameraZoom(timeDelta: number) {
    this.zoomInfo.passMilliseconds(timeDelta)
    this.scene.cameras.main.setZoom(this.zoomInfo.getCurrentZoomLevel())
  }
}