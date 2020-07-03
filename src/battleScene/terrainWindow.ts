import "phaser";
import {BattleMapGraphicState} from "./battleMapGraphicState";
import {GuiBoxMeasurement} from "../gui/guiBoxMeasurement";

export class TerrainWindow {
  camera: Phaser.Cameras.Scene2D.Camera
  cameraScroll = {x: -220, y: 0}
  cameraViewport = {x: 600, y: 780, width: 200, height: 123}
  windowMargin = {x: 20, y: 10}
  windowPadding = {x: 5, y: 5}
  textGraphic: Phaser.GameObjects.Text
  background: Phaser.GameObjects.Rectangle
  text: string
  borderWidth: number
  guiElement: GuiBoxMeasurement

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

    this.guiElement = new GuiBoxMeasurement({
      origin: {
        left: this.cameraScroll.x,
        width: this.cameraViewport.width,
        top: this.cameraScroll.y,
        height: this.cameraViewport.height,
      },
      border: {
        top: 4,
        right: 4,
        bottom: 4,
        left: 4,
      },
      margin: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20,
      },
      padding: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      }
    })

    this.background = new Phaser.GameObjects.Rectangle(
      scene,
      this.guiElement.getBorderCenterX(),
      this.guiElement.getBorderCenterY(),
      this.guiElement.getMarginWidth(),
      this.guiElement.getMarginHeight(),
      0x8e8e8e,
      1,
    )
    this.background.lineWidth = 4
    this.background.strokeColor = 0x010101
    this.background.strokeAlpha = 1
    this.background.isStroked = true
    this.background.setDepth(terrainLayerDepth)

    this.textGraphic = new Phaser.GameObjects.Text(
      scene,
      this.guiElement.getContentLeft(),
      this.guiElement.getContentTop(),
      this.text,
      { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
    )
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

    const width = this.guiElement.getContentWidth()
    const height = this.guiElement.getContentHeight()

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
}