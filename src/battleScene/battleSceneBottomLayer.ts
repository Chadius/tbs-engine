import "phaser";
export class BattleSceneBottomLayer {
  rowHeight = 64;
  tileWidth = 64;
  zoomLevel = 1.0;
  lastZoomTime: number = undefined;
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  init(params: any): void {
  }

  preload(): void {
    this.scene.load.image("sand", "assets/BrownSand.png");
  }

  create(): void {
    this.centerCamera(-200, 200);
    this.scene.cameras.main.setZoom(1.0);

    this.drawMapLayer()
  }

  zoomCamera(zoomIn: boolean) {
    if (zoomIn) {
      this.zoomLevel = this.zoomLevel - 0.1;
    }
    else {
      this.zoomLevel = this.zoomLevel + 0.1;
    }

    const zoomMin = 0.3;
    const zoomMax = 4.0;
    if (this.zoomLevel < zoomMin) {
      this.zoomLevel = zoomMin
    }
    else if(this.zoomLevel > zoomMax) {
      this.zoomLevel = zoomMax
    }

    this.scene.cameras.main.setZoom(this.zoomLevel);
  }

  centerCamera(x: number, y: number) {
    this.scene.cameras.main.setZoom(2.0);
    this.scene.cameras.main.setScroll(x, y);
  }

  update(time: number, delta: number): void {
    if (!this.lastZoomTime || time - this.lastZoomTime > 1000.0) {

      this.zoomCamera(false)
      this.lastZoomTime = time
    }
  }

  drawMapLayer() {
    this.drawRow(0, 3);
    this.drawRow(1, 3);
    this.drawRow(2, 3);
    this.drawRow(3, 3);
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
}