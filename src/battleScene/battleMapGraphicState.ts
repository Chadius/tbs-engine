import {BattleMap} from "../battleMap";
import {Coordinate} from "../mapMeasurement";

export class BattleMapGraphicState {
  tileSize: number
  battleMap: BattleMap

  constructor(parameters: { tileSize: number; battleMap: BattleMap }) {
    this.tileSize = parameters.tileSize
    this.battleMap = parameters.battleMap
  }

  getTileCoordinateAtWorldLocation(worldX: number, worldY: number): Coordinate {
    const distanceFromCenterToCorner = this.tileSize / Math.sqrt(3);
    const worldXNoOffset = worldX - (this.tileSize / 2)
    const worldYNoOffset = worldY - (this.tileSize / 2)

    const perRowMovementDown = 3 * distanceFromCenterToCorner / 2
    const perRowMovementRight = distanceFromCenterToCorner / 2.0
    const perColumnMovementRight = this.tileSize

    const rowFraction = worldYNoOffset / perRowMovementDown

    const worldXOfZeroColumnOfRow = rowFraction * perRowMovementRight
    const columnFraction = (worldXNoOffset - worldXOfZeroColumnOfRow) / perColumnMovementRight
    const fractionCoordinate = new Coordinate(rowFraction, columnFraction)

    const nearestCoordinate = fractionCoordinate.roundToNearestHexCoordinates()
    if (this.battleMap.isOnMap(nearestCoordinate)) {
      return nearestCoordinate
    }

    return undefined
  }
}