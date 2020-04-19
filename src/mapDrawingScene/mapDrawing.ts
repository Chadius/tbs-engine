import "phaser";
export class MapDrawingScene extends Phaser.Scene {
  rowHeight = 64;
  tileWidth = 64;
  zoomLevel = 1.0;
  lastZoomTime: number = undefined;

  constructor() {
    super({
      key: "MapDrawingScene"
    });
  }
  init(params: any): void {
  }

  preload(): void {
    this.load.image("sand", "assets/BrownSand.png");
  }

  create(): void {
    this.centerCamera(-200, 200);
    this.cameras.main.setZoom(1.0);

    this.drawRow(0, 3);
    this.drawRow(1, 3);
    this.drawRow(2, 3);
    this.drawRow(3, 3);
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

    this.cameras.main.setZoom(this.zoomLevel);
  }

  centerCamera(x: number, y: number) {
    this.cameras.main.setZoom(2.0);
    this.cameras.main.setScroll(x, y);
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
      this.physics.add.image(drawX + (i * this.tileWidth), drawY, "sand");
    }
  }

  update(time: number, delta: number): void {
    super.update(time, delta)
    if (!this.lastZoomTime || time - this.lastZoomTime > 1000.0) {

      this.zoomCamera(false)
      this.lastZoomTime = time
    }
  }
};