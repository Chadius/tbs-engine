import "phaser";
import {BattleMap, MapTerrain} from "../battleMap";
import {Coordinate} from "../mapMeasurement";
import {Squaddie} from "../squaddie";
import {AssetLocationMapping} from "../assetMapping/assetLocationMapping";
import Image = Phaser.GameObjects.Image;
import {BattleMapGraphicState} from "./battleMapGraphicState";
import {TerrainWindow} from "./terrainWindow";
import {GuiBoxMeasurement} from "../gui/guiBoxMeasurement";
import {SquaddieOnMap} from "./squaddieOnMap";

export class BattleSceneBottomLayer {
  BACKGROUND_LAYER_DEPTH = -10
  TERRAIN_LAYER_DEPTH = 10
  SQUADDIE_LAYER_DEPTH = 20

  tileWidth = 64
  scene: Phaser.Scene
  mainLayerBounds: GuiBoxMeasurement
  squaddieOnMapNameByID: Map<string, SquaddieOnMap>

  imageAssets: AssetLocationMapping

  backgroundImage: Image
  mapTilesByKey: Map<string, Image>

  battleMap: BattleMap
  battleMapGraphicState: BattleMapGraphicState

  terrainWindow: TerrainWindow

  constructor(scene: Phaser.Scene) {
    this.terrainWindow = new TerrainWindow()
    this.scene = scene
  }

  init(params: any): void {
    this.mapTilesByKey = new Map<string, Image>()
    this.squaddieOnMapNameByID = new Map<string, SquaddieOnMap> ()
    this.initScreenResolution()

    this.battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
        ['1', 'X', '1', '1'],
          ['3', '3', 'S', 'X'],
    ]))
    this.battleMapGraphicState = new BattleMapGraphicState({battleMap: this.battleMap, tileWidth: this.tileWidth})
    this.addSquaddiesToMap();
    this.terrainWindow.init({parentWindow: this.mainLayerBounds})
  }

  private initScreenResolution(): void {
    this.mainLayerBounds = new GuiBoxMeasurement({
      origin: {
        left: 0, top: 0, width: 480, height: 270
      }
    })
  }

  private addSquaddiesToMap(): void {

    const squaddieCreationInfo = [
      {
        squaddieId: "soldier0",
        row: 0,
        column: 1
      },
      {
        squaddieId: "soldier1",
        row: 2,
        column: 3
      },
      {
        squaddieId: "soldier2",
        row: 1,
        column: 2
      },
    ]

    squaddieCreationInfo.forEach(info => {
      const newSoldier = new Squaddie(info.squaddieId, 5)
      this.battleMap.addSquaddie(
        newSoldier,
        new Coordinate(info.row, info.column)
      )
      this.squaddieOnMapNameByID.set(info.squaddieId, new SquaddieOnMap({
        squaddie: newSoldier,
        spriteName: 'blue_boy',
        spriteLocation: "assets/BlueBoy.png",
        battleMapGraphicState: this.battleMapGraphicState,
      }))
    })
  }

  preload(): void {
    const imageAssetLocations = this.battleMapGraphicState.getAssetLocations()

    this.squaddieOnMapNameByID.forEach((squaddieOnMap) => {
      imageAssetLocations.push(
        {
          name: squaddieOnMap.getSpriteName(),
          type: "image",
          location: squaddieOnMap.getSpriteLocation(),
        }
      )
    })

    imageAssetLocations.push(
      {
        name: "orange_background",
        type: "image",
        location: "assets/OrangeBackground.png"
      }
    )

    this.imageAssets = new AssetLocationMapping(imageAssetLocations)

    this.preloadImageAssets(this.imageAssets)
  }

  private preloadImageAssets(assetLocationMapping: AssetLocationMapping): void{
    assetLocationMapping.getAssetNameLocaitonPairs().forEach(assetLocation => {
      this.scene.load.image(assetLocation.name, assetLocation.location)
    })
  }

  create(): void {
    this.createMapLayerToDrawWith()
    this.createSquaddieSprites()
    this.createBackgroundLayer()
    this.setupCameras()
  }

  private createBackgroundLayer(): void {
    this.backgroundImage = this.scene.physics.add.image(
      this.mainLayerBounds.getOriginCenterX(),
      this.mainLayerBounds.getOriginCenterY(),
      "orange_background"
    )
    this.backgroundImage.setDepth(this.BACKGROUND_LAYER_DEPTH)
  }

  private createSquaddieSprites(): void {
    const coordinatesOfAllSquaddiesByID = this.battleMap.getCoordinatesOfAllSquaddiesByID()

    coordinatesOfAllSquaddiesByID.forEach((squaddieCoordinate, squaddieId) => {
      const spriteToDraw = this.squaddieOnMapNameByID.get(squaddieId).getSpriteName()

      const coordinatesToDrawSquaddieAt = this.battleMapGraphicState.getPixelCoordinates(squaddieCoordinate)

      const squaddieSprite = this.scene.physics.add.image(coordinatesToDrawSquaddieAt[0], coordinatesToDrawSquaddieAt[1], spriteToDraw)
      squaddieSprite.setDepth(this.SQUADDIE_LAYER_DEPTH)

      this.squaddieOnMapNameByID.get(squaddieId).setSprite(squaddieSprite)
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

  private setupCameras() {
    this.scene.cameras.main.setScroll(0, 0)
    this.scene.cameras.main.setZoom(1.0)

    this.scene.cameras.main.setBounds(
      this.mainLayerBounds.getOriginLeft(),
      this.mainLayerBounds.getOriginTop(),
      this.mainLayerBounds.getOriginWidth(),
      this.mainLayerBounds.getOriginHeight()
    )

    this.terrainWindow.createTerrainWindowCamera(this.scene, this.TERRAIN_LAYER_DEPTH)
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
      this.battleMapGraphicState
    )
  }

  private drawBackgroundLayer() {
    this.backgroundImage.setDisplaySize(this.mainLayerBounds.getOriginWidth(), this.mainLayerBounds.getOriginHeight())

    const top = this.mainLayerBounds.getOriginTop()
    const left = this.mainLayerBounds.getOriginLeft()
    const bottom = this.mainLayerBounds.getOriginBottom()
    const right = this.mainLayerBounds.getOriginRight()

    const graphics = this.scene.add.graphics({ lineStyle: { width: 4, color: 0x010101 } })
    graphics.strokeLineShape(new Phaser.Geom.Line(left, top, right, top))
    graphics.strokeLineShape(new Phaser.Geom.Line(right, bottom, right, top))
    graphics.strokeLineShape(new Phaser.Geom.Line(left, bottom, right, bottom))
    graphics.strokeLineShape(new Phaser.Geom.Line(left, bottom, left, top))
  }

  private drawAllSquaddies() {
    const coordinatesOfAllSquaddiesByID = this.battleMap.getCoordinatesOfAllSquaddiesByID()

    coordinatesOfAllSquaddiesByID.forEach((squaddieCoordinate, squaddieId) => {
      const squaddieToDraw = this.squaddieOnMapNameByID.get(squaddieId)
      squaddieToDraw.drawSquaddie(
        squaddieCoordinate.getRow(),
        squaddieCoordinate.getColumn()
      )
    })
  }
}