import "phaser";
import {ZoomInfoForBattleMainLayer} from "../battleSceneUtilities/zoomLevelManagement";
import {CameraControlForMainLayer} from "../battleSceneUtilities/cameraControlManagement";

export class BattleSceneBottomLayer {
  rowHeight = 64
  tileWidth = 64
  scene: Phaser.Scene
  zoomInfo: ZoomInfoForBattleMainLayer
  cameraInfo: CameraControlForMainLayer
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

  centerCamera(x: number, y: number) {
    this.scene.cameras.main.setZoom(1.0)
    this.scene.cameras.main.setScroll(x, y)
  }

  update(time: number, delta: number): void {
    this.updateCameraZoom(delta)
    this.updateCameraScroll(delta)
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
    this.centerCamera(0, 0)
    this.createCameraControls()
    this.zoomInfo = new ZoomInfoForBattleMainLayer({
      initial: 1.0,
      min: 1.0 / 4.0,
      max: 1.0 * 4.0,
      interpolator: Phaser.Math.Interpolation.Linear,
    })

    this.cameraInfo = new CameraControlForMainLayer({
      position: {
        x: 0,
        y: 0
      },
      scrollSpeedPerSecond: 400,
      distanceFunction: Phaser.Math.Distance.Between,
      angleFunction: Phaser.Math.Angle.Between,
    })

    this.scene.cameras.main.setZoom(this.zoomInfo.getCurrentZoomLevel())

    this.scene.cameras.main.setBounds(
      this.mainLayerBounds.x,
      this.mainLayerBounds.y,
      this.mainLayerBounds.width,
      this.mainLayerBounds.height
    )
  }

  createCameraControls() {
    this.scene.input.keyboard.on('keydown-MINUS', (event) => {
      this.zoomOutCamera()
    })
    this.scene.input.keyboard.on('keydown-PLUS', (event) => {
      this.zoomInCamera()
    })

    this.scene.input.keyboard.on('keydown-DOWN', (event) => {
      this.scrollCameraDown()
    })
    this.scene.input.keyboard.on('keydown-UP', (event) => {
      this.scrollCameraUp()
    })
    this.scene.input.keyboard.on('keydown-LEFT', (event) => {
      this.scrollCameraLeft()
    })
    this.scene.input.keyboard.on('keydown-RIGHT', (event) => {
      this.scrollCameraRight()
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

  scrollCameraUp() {
    const currentPosition = this.cameraInfo.getPosition()
    this.scrollCameraWithinBounds(currentPosition[0], currentPosition[1] - 100)
  }

  private scrollCameraWithinBounds(destinationX: number, destinationY: number) {
    this.cameraInfo.transitionScroll(
      [
        this.scene.cameras.main.clampX(destinationX),
        this.scene.cameras.main.clampY(destinationY)
      ]
    )
  }

  scrollCameraDown() {
    const currentPosition = this.cameraInfo.getPosition()
    this.scrollCameraWithinBounds(currentPosition[0], currentPosition[1] + 100)
  }

  scrollCameraLeft() {
    const currentPosition = this.cameraInfo.getPosition()
    this.scrollCameraWithinBounds(currentPosition[0] - 100, currentPosition[1])
  }

  scrollCameraRight() {
    const currentPosition = this.cameraInfo.getPosition()
    this.scrollCameraWithinBounds(currentPosition[0] + 100, currentPosition[1])
  }

  updateCameraScroll(timeDelta: number) {
    this.cameraInfo.passMilliseconds(timeDelta)
    const currentPosition = this.cameraInfo.getPosition()
    this.scene.cameras.main.setScroll(
      currentPosition[0],
      currentPosition[1],
    )
  }
}