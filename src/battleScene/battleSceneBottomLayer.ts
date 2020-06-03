import "phaser";
import {BattleMap, MapTerrain} from "../battleMap";
import {Coordinate} from "../mapMeasurement";
import {Squaddie} from "../squaddie";

export class BattleSceneBottomLayer {
  rowHeight = 64
  tileWidth = 64
  scene: Phaser.Scene
  mainLayerBounds = {x: 0, y: 0, width: 800, height: 600}
  battleMap: BattleMap
  squaddieSpriteNameByID: Map<string, string>

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  init(params: any): void {
    this.battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
        ['1', 'X', '1', '1'],
          ['3', '1', '1', '1'],
    ]))

    this.squaddieSpriteNameByID = new Map<string, string>()

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
  }

  preload(): void {
    this.scene.load.image("sand", "assets/BrownSand.png");
    this.scene.load.image("blue_boy", "assets/BlueBoy.png");
    this.scene.load.image("orange_background", "assets/OrangeBackground.png");
  }

  create(): void {
    this.setupCamera()
  }

  update(time: number, delta: number): void {
    this.drawBackgroundLayer()
    this.drawMapLayer()
    this.drawAllSquaddies()
  }

  drawBackgroundLayer() {
    const backgroundImage = this.scene.physics.add.image(400, 300, "orange_background")
    backgroundImage.setDisplaySize(800, 600)

    const graphics = this.scene.add.graphics({ lineStyle: { width: 4, color: 0x010101 } })
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 0, 0))
    graphics.strokeLineShape(new Phaser.Geom.Line(0, 600, 800, 600))
    graphics.strokeLineShape(new Phaser.Geom.Line(800, 600, 800, 0))
    graphics.strokeLineShape(new Phaser.Geom.Line(0,  0, 800, 0))
  }

  drawMapLayer(): void {
    const coordinateAndTilePair = this.battleMap.terrain.getTilesOrderedByCoordinates()
    coordinateAndTilePair.forEach((coordinateAndTile) => {
      const coordinateToDraw = Coordinate.newFromLocationKey(coordinateAndTile.locationKey)
      this.drawTile(coordinateToDraw)
    })
  }

  drawTile(coordinate: Coordinate): void {
    const pixelCoordinates = this.getPixelCoordinates(coordinate.getRow(), coordinate.getColumn())
    this.scene.physics.add.image(pixelCoordinates[0], pixelCoordinates[1], "sand");
  }

  drawRow(row: number, width: number): void {
    const coordinates = this.getPixelCoordinates(row, 0)
    const drawX = coordinates[0]
    const drawY = coordinates[1]
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

  private drawAllSquaddies() {
    const coordinatesOfAllSquaddiesByID = this.battleMap.getCoordinatesOfAllSquaddiesByID()

    coordinatesOfAllSquaddiesByID.forEach((squaddieCoordinate, squaddieId) => {
      const squaddieToDraw = this.battleMap.getSquaddieById(squaddieId)
      this.drawSquaddie(squaddieToDraw, squaddieCoordinate.getRow(),squaddieCoordinate.getColumn())
    })
  }


  private drawSquaddie(squaddie: Squaddie, row: number, column: number) {
    const coordinates = this.getPixelCoordinates(row, column)

    const graphics = this.scene.add.graphics({ lineStyle: { width: 4, color: 0x010101 } })
    graphics.strokeEllipse(coordinates[0], coordinates[1], 20, 20, 32)

    const spriteID = this.squaddieSpriteNameByID.get(squaddie.getId())
    this.scene.physics.add.image(coordinates[0], coordinates[1], spriteID);
  }

  private getPixelCoordinates(row: number, column: number): number[] {
    const distanceFromCenterToCorner = this.tileWidth / Math.sqrt(3);
    const drawX = distanceFromCenterToCorner * (Math.sqrt(3) * column  +  Math.sqrt(3)/2 * row) + this.tileWidth / 2
    const drawY = (row * this.tileWidth / 4.0 * 3)  + this.tileWidth / 2
    return [drawX, drawY]
  }
}