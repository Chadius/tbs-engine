import "phaser";
import {BattleMap, MapTerrain} from "../battleMap";
import {Coordinate} from "../mapMeasurement";
import {Squaddie} from "../squaddie";
import {GraphicAssets} from "../assetMapping/graphicAssets";
import Image = Phaser.GameObjects.Image;
import {BattleMapGraphicState} from "./battleMapGraphicState";
import {TerrainWindow} from "./terrainWindow";

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

  terrainWindow: TerrainWindow

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.terrainWindow = new TerrainWindow()
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

    this.terrainWindow.init(params)
  }

  preload(): void {
    const assetLocations = this.battleMapGraphicState.getAssetLocations()
    assetLocations.push(
      {
        name: "blue_boy",
        type: "image",
        location: "assets/BlueBoy.png"
      }
    )
    assetLocations.push(
      {
        name: "orange_background",
        type: "image",
        location: "assets/OrangeBackground.png"
      }
    )

    this.imageAssets = new GraphicAssets(assetLocations)

    const assetIsAnImage = assetLocation => assetLocation.type === "image"
    assetLocations.filter(assetIsAnImage).forEach(assetLocation => {
      this.scene.load.image(assetLocation.name, assetLocation.location)
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
    const assetByLocationKey = this.battleMapGraphicState.getAssetNamesOrderedByCoordinate()

    const coordinateAndTilePair = this.battleMap.terrain.getTilesOrderedByCoordinates()
    coordinateAndTilePair.forEach((coordinateAndTile) => {
      const coordinateToDraw = Coordinate.newFromLocationKey(coordinateAndTile.locationKey)
      const pixelCoordinates = this.battleMapGraphicState.getPixelCoordinates(coordinateToDraw)

      const assetInfo = assetByLocationKey.find(
        locationKeyImagePair => locationKeyImagePair.locationKey === coordinateAndTile.locationKey
      )

      if (!assetInfo) {
        return
      }

      const textureToDraw = assetInfo.image
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

    this.terrainWindow.createTerrainWindowCamera(this.mainLayerBounds, this.scene, this.TERRAIN_LAYER_DEPTH)
  }

  update(time: number, delta: number): void {
    this.drawBackgroundLayer()
    this.drawAllSquaddies()
    this.terrainWindow.drawTerrainWindow(
      {
        x: this.scene.input.mousePointer.x,
        y: this.scene.input.mousePointer.y,
        isDown: this.scene.input.activePointer.isDown
      },
      this.battleMapGraphicState,
      this.mainLayerBounds.width
    )
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
}