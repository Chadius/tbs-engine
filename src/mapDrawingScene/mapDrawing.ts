import "phaser";
export class MapDrawingScene extends Phaser.Scene {
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
    this.drawRow(0, 3);
    this.drawRow(1, 3);
    this.drawRow(2, 3);
    this.drawRow(3, 3);
  }

  drawRow(row: number, width: number): void {
    const oddRowHorizontalOffset = 32;
    const oddRowVerticalOffset = 16;
    const rowHeight = 64;
    const tileWidth = 64;

    let drawX = tileWidth;
    let drawY = 600 - rowHeight;

    const rowIsOdd = (row % 2 === 1);
    if (rowIsOdd) {
      drawX = drawX + oddRowHorizontalOffset;
    }

    drawY = drawY - ((rowHeight - oddRowVerticalOffset) * row);

    for(let i = 0; i < width; i++) {
      this.physics.add.image(drawX + (i * tileWidth), drawY, "sand");
    }
  }
};