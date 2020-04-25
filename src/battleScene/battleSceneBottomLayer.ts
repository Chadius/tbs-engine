import "phaser";
export class BattleSceneBottomLayer {
  rowHeight = 64;
  tileWidth = 64;
  scene: Phaser.Scene
  zoomInfo: {
    start: number;
    end: number;
    timeElapsed: number;
    transitionDuration: number;
    current: number;
    min: number;
    max: number;
    isInTransition(): boolean;
    boundToMinMax(): void;
  };

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
    this.zoomInfo = {
      start: undefined,
      end: undefined,
      timeElapsed: undefined,
      transitionDuration: undefined,
      current: 1.0,
      min: 1.0 / 4.0,
      max: 1.0 * 4.0,
      isInTransition: () => {
        if (this.zoomInfo.timeElapsed === undefined || this.zoomInfo.transitionDuration === undefined) {
          return false
        }

        return this.zoomInfo.timeElapsed < this.zoomInfo.transitionDuration
      },
      boundToMinMax: () => {
        if (this.zoomInfo.end <= this.zoomInfo.min) {
          this.zoomInfo.end = this.zoomInfo.min
        }
        else if(this.zoomInfo.end >= this.zoomInfo.max) {
          this.zoomInfo.end = this.zoomInfo.max
        }
      }
    }

    this.scene.cameras.main.setZoom(this.zoomInfo.current)
  }

  createCameraControls() {
    this.scene.input.keyboard.on('keydown-MINUS', (event) => {
      this.zoomInCamera()
    })
    this.scene.input.keyboard.on('keydown-PLUS', (event) => {
      this.zoomOutCamera()
    })
  }

  zoomInCamera() {
    if (this.zoomInfo.isInTransition()) {
      return
    }
    if (this.zoomInfo.current >= this.zoomInfo.max) {
      return
    }

    this.zoomInfo.start = this.zoomInfo.current
    this.zoomInfo.end = this.zoomInfo.current * 2.0
    this.zoomInfo.boundToMinMax()

    this.zoomInfo.timeElapsed = 0
    this.zoomInfo.transitionDuration = 1000
  }

  zoomOutCamera() {
    if (this.zoomInfo.isInTransition()) {
      return
    }
    if (this.zoomInfo.current <= this.zoomInfo.min) {
      return
    }

    this.zoomInfo.start = this.zoomInfo.current
    this.zoomInfo.end = this.zoomInfo.current / 2.0
    this.zoomInfo.boundToMinMax()

    this.zoomInfo.timeElapsed = 0
    this.zoomInfo.transitionDuration = 1000
  }

  updateCameraZoom(timeDelta: number) {
    if (!this.zoomInfo.isInTransition()) {
      return
    }

    const lerpPoints = [
      this.zoomInfo.start,
      this.zoomInfo.end,
    ]

    const timeElapsed = (this.zoomInfo.timeElapsed / this.zoomInfo.transitionDuration)

    this.zoomInfo.current = Phaser.Math.Interpolation.Linear(lerpPoints, timeElapsed)

    this.zoomInfo.timeElapsed = this.zoomInfo.timeElapsed + timeDelta

    if (this.zoomInfo.timeElapsed >= this.zoomInfo.transitionDuration) {
      this.zoomInfo.current = this.zoomInfo.end
    }

    this.scene.cameras.main.setZoom(this.zoomInfo.current)
  }
}