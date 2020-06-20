import "phaser";
import {BattleMapGraphicState} from "./battleMapGraphicState";

export class TerrainWindow {
  camera: Phaser.Cameras.Scene2D.Camera
  cameraScroll = {x: -205, y: 0}
  cameraViewport = {x: 600, y: 780, width: 200, height: 123}
  windowMargin = {x: 20, y: 10}
  windowPadding = {x: 5, y: 5}
  textGraphic: Phaser.GameObjects.Text
  background: Phaser.GameObjects.Rectangle
  text: string
  borderWidth: number

  init(params: any): void {
    this.borderWidth = 4
    this.text = "Click on a tile"
  }

  createTerrainWindowCamera(parentWindow: {x: number; y: number; width: number; height: number}, scene: Phaser.Scene, terrainLayerDepth: number) {
    this.cameraViewport.x = parentWindow.width - this.cameraViewport.width - this.windowMargin.x
    this.cameraViewport.y = parentWindow.height - this.cameraViewport.height - this.windowMargin.x
    this.camera = new Phaser.Cameras.Scene2D.Camera(
      this.cameraViewport.x,
      this.cameraViewport.y,
      this.cameraViewport.width,
      this.cameraViewport.height,
    )
    this.camera.name = "terrain window"
    this.camera.setScroll(this.cameraScroll.x, this.cameraScroll.y)
    this.camera.setViewport(this.cameraViewport.x, this.cameraViewport.y, this.cameraViewport.width, this.cameraViewport.height)
    scene.cameras.addExisting(this.camera, false)

    this.background = new Phaser.GameObjects.Rectangle(scene, this.getCenterX(), this.getCenterY(), this.getBoxContainerWidth(), this.getBoxContainerHeight(), 0x8e8e8e, 1)
    this.background.lineWidth = 4
    this.background.strokeColor = 0x010101
    this.background.strokeAlpha = 1
    this.background.isStroked = true
    this.background.setDepth(terrainLayerDepth)

    this.textGraphic = new Phaser.GameObjects.Text(scene, this.getContentLeft(), this.getContentTop(), this.text, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
    this.textGraphic.setDepth(terrainLayerDepth + 1)

    scene.add.existing(this.background)
    scene.add.existing(this.textGraphic)
  }

  drawTerrainWindow(
    mouse: {
      x: number;
      y: number;
      isDown: boolean;
    },
    battleMapGraphicState: BattleMapGraphicState,
    parentWindowWidth: number
  ) {
    this.updateTextBasedOnMouseClick(mouse, battleMapGraphicState)

    const width = this.getContentWidth()
    const height = this.getContentHeight()

    if (
      mouse.x >= this.cameraViewport.x &&
      mouse.x <= this.cameraViewport.x + width &&
      mouse.y >= this.cameraViewport.y &&
      mouse.y <= this.cameraViewport.y + height
    ) {
      if (this.cameraViewport.x < 400) {
        this.cameraViewport.x = parentWindowWidth - this.cameraViewport.width - this.windowMargin.x
      }
      else {
        this.cameraViewport.x = 20
      }

      this.camera.setPosition(this.cameraViewport.x, this.cameraViewport.y)
    }
  }

  updateTextBasedOnMouseClick(
    mouse: {
      x: number;
      y: number;
      isDown: boolean;
    },
    battleMapGraphicState: BattleMapGraphicState
  ) {
    if(mouse.isDown !== true) {
      return
    }

    const clickedCoordinate = battleMapGraphicState.getTileCoordinateAtWorldLocation(mouse.x, mouse.y)
    if (clickedCoordinate) {
      this.text = `${clickedCoordinate.getRow()}, ${clickedCoordinate.getColumn()}`
    }
    else {
      this.text = ""
    }
    this.textGraphic.setText(this.text)

    this.toggleWindowVisibilityIfThereIsText()
  }

  toggleWindowVisibilityIfThereIsText() {
    if (this.camera.visible && !this.text) {
      this.camera.setVisible(false)
    }
    else if(!this.camera.visible && this.text) {
      this.camera.setVisible(true)
    }
  }

  getContentWidth() {
    return this.cameraViewport.width - (2 * this.windowMargin.x) - (2 * this.borderWidth) - (2 * this.windowPadding.x)
  }
  getContentHeight() {
    return this.cameraViewport.height - (2 * this.windowPadding.y)
  }

  getContentX() {
    return this.cameraScroll.x + this.windowMargin.x + this.borderWidth + this.windowPadding.x
  }
  getContentLeft() {
    return this.getContentX()
  }
  getContentY() {
    return this.cameraScroll.y + this.windowMargin.y + this.borderWidth + this.windowPadding.y
  }
  getContentTop() {
    return this.getContentY()
  }

  getBoxContainerWidth() {
    return this.cameraViewport.width - (2 * this.windowMargin.x) - (2 * this.borderWidth)
  }
  getBoxContainerHeight() {
    return this.cameraViewport.height - (2 * this.windowMargin.y) - (2 * this.borderWidth)
  }

  getCenterX() {
    return this.cameraScroll.x + (this.cameraViewport.width / 2)
  }
  getCenterY() {
    return this.cameraScroll.y + (this.cameraViewport.height / 2)
  }
}