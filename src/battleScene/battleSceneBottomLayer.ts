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
    this.setupCamera()

    this.drawMapLayer()
  }

  centerCamera(x: number, y: number) {
    this.scene.cameras.main.setZoom(2.0)
    this.scene.cameras.main.setScroll(x, y)
  }

  update(time: number, delta: number): void {
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

  setupCamera() {
    this.centerCamera(-200, 200)
    this.scene.cameras.main.setZoom(1.0)
    this.createCameraControls()
  }

  createCameraControls() {
    this.scene.input.keyboard.on('keydown-MINUS', (event) => {
      this.zoomInCamera()
    })
    this.scene.input.keyboard.on('keydown-PLUS', (event) => {
      this.zoomOutCamera()
    })
  }

  boundCameraZoomVLevel() {
    const zoomInLimit = 1.0 / 4.0
    const zoomOutLimit = 1.0 * 4.0
    if (this.zoomLevel < zoomInLimit) {
      this.zoomLevel = zoomInLimit
    }
    else if(this.zoomLevel > zoomOutLimit) {
      this.zoomLevel = zoomOutLimit
    }
  }

  zoomInCamera() {
    this.zoomLevel = this.zoomLevel / 2.0
    this.boundCameraZoomVLevel()
    this.scene.cameras.main.setZoom(this.zoomLevel)
  }

  zoomOutCamera() {
    this.zoomLevel = this.zoomLevel * 2.0
    this.boundCameraZoomVLevel()
    this.scene.cameras.main.setZoom(this.zoomLevel)
  }
}