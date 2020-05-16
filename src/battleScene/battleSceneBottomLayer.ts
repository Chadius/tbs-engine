import "phaser";

export class BattleSceneBottomLayer {
  rowHeight = 64
  tileWidth = 64
  scene: Phaser.Scene
  mainLayerBounds = {x: 0, y: 0, width: 800, height: 600}

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

    const graphics = this.scene.add.graphics({ lineStyle: { width: 4, color: 0x010101 } });
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 0, 0));
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 800, 600));
    graphics.strokeLineShape(new Phaser.Geom.Line(800, 600, 800, 0));
    graphics.strokeLineShape(new Phaser.Geom.Line(0,  0, 800, 0));
  }

  update(time: number, delta: number): void {
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
    this.scene.cameras.main.setScroll(0, 0)
    this.scene.cameras.main.setZoom(1.0)

    this.scene.cameras.main.setBounds(
      this.mainLayerBounds.x,
      this.mainLayerBounds.y,
      this.mainLayerBounds.width,
      this.mainLayerBounds.height
    )
  }
}