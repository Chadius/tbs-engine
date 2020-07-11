import {Squaddie} from "../squaddie";
import {BattleMapGraphicState} from "./battleMapGraphicState";
import {Coordinate} from "../mapMeasurement";

export class SquaddieOnMap {
  squaddie: Squaddie
  spriteName: string
  spriteImage: Phaser.GameObjects.Image
  spriteLocation: string
  battleMapGraphicState: BattleMapGraphicState

  constructor(params: {squaddie: Squaddie; spriteName: string; spriteLocation: string; battleMapGraphicState: BattleMapGraphicState}) {
    this.squaddie = params.squaddie
    this.spriteName = params.spriteName
    this.spriteLocation = params.spriteLocation
    this.battleMapGraphicState = params.battleMapGraphicState
  }

  drawSquaddie(row: number, column: number) {
    const coordinates = this.battleMapGraphicState.getPixelCoordinates(new Coordinate(row, column))
    const squaddieSprite = this.spriteImage
    squaddieSprite.x = coordinates[0]
    squaddieSprite.y = coordinates[1]
  }

  getSpriteName() {
    return this.spriteName
  }

  getSpriteLocation() {
    return this.spriteLocation
  }

  setSprite(squaddieSprite: Phaser.Physics.Arcade.Image) {
    this.spriteImage = squaddieSprite
  }
}