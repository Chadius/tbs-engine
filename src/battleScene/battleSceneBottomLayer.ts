import "phaser";
import {BattleMap, MapTerrain} from "../battleMap";
import {Coordinate} from "../mapMeasurement";
import {Squaddie} from "../squaddie";
import {GraphicAssets} from "../assetMapping/graphicAssets";
import Image = Phaser.GameObjects.Image;
import {BattleMapGraphicState} from "./battleMapGraphicState";

export class BattleSceneBottomLayer {
  BACKGROUND_LAYER_DEPTH = -10
  TERRAIN_LAYER_DEPTH = 10
  SQUADDIE_LAYER_DEPTH = 20

  tileWidth = 64
  scene: Phaser.Scene
  mainLayerBounds = {x: 0, y: 0, width: 800, height: 600}
  squaddieSpriteNameByID: Map<string, string>
  imageAssets: GraphicAssets

  backgroundImage: Image
  squaddieSpritesByKey: Map<string, Image>
  mapTilesByKey: Map<string, Image>

  battleMap: BattleMap
  battleMapGraphicState: BattleMapGraphicState

  terrainCamera: Phaser.Cameras.Scene2D.Camera
  terrainCameraBounds = {x: -205, y: 0, width: 200, height: 123, xMargin: 20, yMargin: 10, xPadding: 5, yPadding: 5}
  terrainCameraOrigin = {x: 600, y: 780}
  terrainWindowTextGraphic: Phaser.GameObjects.Text
  terrainWindowBackground: Phaser.GameObjects.Rectangle
  terrainWindowText: string

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  init(params: any): void {
    this.battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
        ['1', 'X', '1', '1'],
          ['3', '3', 'S', 'X'],
    ]))
    this.battleMapGraphicState = new BattleMapGraphicState({battleMap: this.battleMap, tileWidth: this.tileWidth})

    this.squaddieSpriteNameByID = new Map<string, string>()

    this.squaddieSpritesByKey = new Map<string, Image>()
    this.mapTilesByKey = new Map<string, Image>()

    this.battleMap.addSquaddie(
      new Squaddie('soldier0', 5),
      new Coordinate(0, 1)
    )
    this.squaddieSpriteNameByID.set('soldier0', 'blue_boy')

    this.battleMap.addSquaddie(
      new Squaddie('soldier1', 5),
      new Coordinate(2, 3)
    )
    this.squaddieSpriteNameByID.set('soldier1', 'blue_boy')

    this.battleMap.addSquaddie(
      new Squaddie('soldier2', 5),
      new Coordinate(1, 2)
    )
    this.squaddieSpriteNameByID.set('soldier2', 'blue_boy')

    this.terrainWindowText = ""
  }

  preload(): void {
    const imagesByAssetName = {
      "sand_tile": "assets/BrownSand.png",
      "wall_tile": "assets/BlackWall.png",
      "sky_tile": "assets/BlueSky.png",
      "road_tile": "assets/GrayRoad.png",
      "blue_boy": "assets/BlueBoy.png",
      "orange_background": "assets/OrangeBackground.png",
    }

    this.imageAssets = new GraphicAssets(imagesByAssetName)
    Object.entries(imagesByAssetName).forEach(pair => {
      this.scene.load.image(pair[0], pair[1])
    })
  }

  create(): void {
    this.createMapLayerToDrawWith()
    this.createSquaddieSprites()
    this.createBackgroundLayer()
    this.setupCameras()
  }

  createBackgroundLayer(): void {
    this.backgroundImage = this.scene.physics.add.image(400, 300, "orange_background")
    this.backgroundImage.setDepth(this.BACKGROUND_LAYER_DEPTH)
  }

  createSquaddieSprites(): void {
    const coordinatesOfAllSquaddiesByID = this.battleMap.getCoordinatesOfAllSquaddiesByID()

    coordinatesOfAllSquaddiesByID.forEach((squaddieCoordinate, squaddieId) => {
      const spriteToDraw = this.squaddieSpriteNameByID.get(squaddieId)
      const coordinatesToDrawSquaddieAt = this.battleMapGraphicState.getPixelCoordinates(squaddieCoordinate)

      const squaddieSprite = this.scene.physics.add.image(coordinatesToDrawSquaddieAt[0], coordinatesToDrawSquaddieAt[1], spriteToDraw)
      squaddieSprite.setDepth(this.SQUADDIE_LAYER_DEPTH)
      this.squaddieSpritesByKey.set(
        squaddieId,
        squaddieSprite
      )
    })
  }

  private createMapLayerToDrawWith(): void {
    const coordinateAndTilePair = this.battleMap.terrain.getTilesOrderedByCoordinates()
    coordinateAndTilePair.forEach((coordinateAndTile) => {
      const coordinateToDraw = Coordinate.newFromLocationKey(coordinateAndTile.locationKey)
      const pixelCoordinates = this.battleMapGraphicState.getPixelCoordinates(coordinateToDraw)

      const terrainTypeToTexture = {
        "sand": "sand_tile",
        "wall": "wall_tile",
        "sky" : "sky_tile",
        "road": "road_tile",
      }

      const textureToDraw = terrainTypeToTexture[coordinateAndTile.terrain.getName()] || "wall_tile"
      const tileKey = `mapTile${coordinateToDraw.getRow()} ${coordinateToDraw.getColumn()}`
      const mapTileImage = this.scene.physics.add.image(pixelCoordinates[0], pixelCoordinates[1], textureToDraw)
      mapTileImage.setDepth(this.TERRAIN_LAYER_DEPTH)
      this.mapTilesByKey.set(
        tileKey,
        mapTileImage
      )
    })
  }

  setupCameras() {
    this.scene.cameras.main.setScroll(0, 0)
    this.scene.cameras.main.setZoom(1.0)

    this.scene.cameras.main.setBounds(
      this.mainLayerBounds.x,
      this.mainLayerBounds.y,
      this.mainLayerBounds.width,
      this.mainLayerBounds.height
    )

    this.createTerrainWindowCamera()
  }

  update(time: number, delta: number): void {
    this.drawBackgroundLayer()
    this.drawAllSquaddies()
    this.drawTerrainWindow()
  }

  drawBackgroundLayer() {
    this.backgroundImage.setDisplaySize(800, 600)

    const graphics = this.scene.add.graphics({ lineStyle: { width: 4, color: 0x010101 } })
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 0, 0))
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 800, 600))
    graphics.strokeLineShape(new Phaser.Geom.Line(800, 600, 800, 0))
    graphics.strokeLineShape(new Phaser.Geom.Line(0,  0, 800, 0))
  }

  private drawAllSquaddies() {
    const coordinatesOfAllSquaddiesByID = this.battleMap.getCoordinatesOfAllSquaddiesByID()

    coordinatesOfAllSquaddiesByID.forEach((squaddieCoordinate, squaddieId) => {
      const squaddieToDraw = this.battleMap.getSquaddieById(squaddieId)
      this.drawSquaddie(squaddieToDraw, squaddieCoordinate.getRow(),squaddieCoordinate.getColumn())
    })
  }

  private drawSquaddie(squaddie: Squaddie, row: number, column: number) {
    const coordinates = this.battleMapGraphicState.getPixelCoordinates(new Coordinate(row, column))
    const squaddieSprite = this.squaddieSpritesByKey.get(squaddie.getId())
    squaddieSprite.x = coordinates[0]
    squaddieSprite.y = coordinates[1]
  }

  private createTerrainWindowCamera() {
    this.terrainCameraOrigin.x = this.mainLayerBounds.width - this.terrainCameraBounds.width - this.terrainCameraBounds.xMargin
    this.terrainCameraOrigin.y = this.mainLayerBounds.height - this.terrainCameraBounds.height - this.terrainCameraBounds.yMargin
    this.terrainCamera = new Phaser.Cameras.Scene2D.Camera(
      this.terrainCameraOrigin.x,
      this.terrainCameraOrigin.y,
      this.terrainCameraBounds.width,
      this.terrainCameraBounds.height,
    )
    this.terrainCamera.name = "terrain window"
    this.terrainCamera.setScroll(this.terrainCameraBounds.x, this.terrainCameraBounds.y)
    this.terrainCamera.setViewport(this.terrainCameraBounds.x, this.terrainCameraBounds.y, this.terrainCameraBounds.width, this.terrainCameraBounds.height)
    this.terrainCamera.setPosition(this.terrainCameraOrigin.x, this.terrainCameraOrigin.y)
    this.scene.cameras.addExisting(this.terrainCamera, false)

    const left = this.terrainCameraBounds.x + this.terrainCameraBounds.xPadding
    const width = this.terrainCameraBounds.width - (2 * this.terrainCameraBounds.xPadding)
    const centerX = this.terrainCameraBounds.x + this.terrainCameraBounds.width / 2
    const centerY = this.terrainCameraBounds.y + this.terrainCameraBounds.height / 2
    const top = this.terrainCameraBounds.y + this.terrainCameraBounds.yPadding
    const height = this.terrainCameraBounds.height - (2 * this.terrainCameraBounds.yPadding)

    this.terrainWindowBackground = new Phaser.GameObjects.Rectangle(this.scene, centerX, centerY, width, height, 0x8e8e8e, 1)
    this.terrainWindowBackground.lineWidth = 4
    this.terrainWindowBackground.strokeColor = 0x010101
    this.terrainWindowBackground.strokeAlpha = 1
    this.terrainWindowBackground.isStroked = true
    this.terrainWindowBackground.setDepth(this.TERRAIN_LAYER_DEPTH)

    this.terrainWindowTextGraphic = new Phaser.GameObjects.Text(this.scene, left, top, this.terrainWindowText, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
    this.terrainWindowTextGraphic.setDepth(this.TERRAIN_LAYER_DEPTH + 1)

    this.scene.add.existing(this.terrainWindowBackground)
    this.scene.add.existing(this.terrainWindowTextGraphic)
  }

  private drawTerrainWindow() {
    if (this.terrainCamera.visible && !this.terrainWindowText) {
      this.terrainCamera.setVisible(false)
      this.terrainWindowText = "I LIVE"
      return
    }
    else if(!this.terrainCamera.visible && this.terrainWindowText) {
      this.terrainCamera.setVisible(true)
      this.terrainWindowTextGraphic.setText(this.terrainWindowText)
    }

    const mouseX = this.scene.input.mousePointer.x
    const mouseY = this.scene.input.mousePointer.y

    const width = this.terrainCameraBounds.width - (2 * this.terrainCameraBounds.xPadding)
    const height = this.terrainCameraBounds.height - (2 * this.terrainCameraBounds.yPadding)

    if (
      mouseX >= this.terrainCameraOrigin.x &&
      mouseX <= this.terrainCameraOrigin.x + width &&
      mouseY >= this.terrainCameraOrigin.y &&
      mouseY <= this.terrainCameraOrigin.y + height
    ) {
      if (this.terrainCameraOrigin.x < 400) {
        this.terrainCameraOrigin.x = this.mainLayerBounds.width - this.terrainCameraBounds.width - this.terrainCameraBounds.xMargin
      }
      else {
        this.terrainCameraOrigin.x = 20
      }

      this.terrainCamera.setPosition(this.terrainCameraOrigin.x, this.terrainCameraOrigin.y)
    }
  }
}