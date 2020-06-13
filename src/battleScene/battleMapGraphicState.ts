import {BattleMap} from "../battleMap";
import {Coordinate} from "../mapMeasurement";

export class BattleMapGraphicState {
  tileSize: number
  battleMap: BattleMap

  constructor(parameters: { tileSize: number; battleMap: BattleMap }) {
    this.tileSize = parameters.tileSize
    this.battleMap = parameters.battleMap
  }

  getMeasurements(): {
    horizontalOffset: number;
    verticalOffset: number;
    distanceFromCenterToCorner: number;
    perRowMovementDown: number;
    perRowMovementRight: number;
    perColumnMovementRight: number;
  } {
    const distanceFromCenterToCorner = this.tileSize / Math.sqrt(3)
    return {
      horizontalOffset: this.tileSize / 2,
      verticalOffset: this.tileSize / 2,
      distanceFromCenterToCorner: distanceFromCenterToCorner,
      perRowMovementDown: 3 * distanceFromCenterToCorner / 2,
      perRowMovementRight: this.tileSize / 2.0,
      perColumnMovementRight: this.tileSize,
    }
  }

  getTileCoordinateAtWorldLocation(worldX: number, worldY: number): Coordinate {
    const {
      horizontalOffset,
      verticalOffset,
      perRowMovementRight,
      perRowMovementDown,
      perColumnMovementRight
    } = this.getMeasurements()

    const worldXNoOffset = worldX - horizontalOffset
    const worldYNoOffset = worldY - verticalOffset

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

  getPixelCoordinates(coordinate: Coordinate): number[] {
    const {
      horizontalOffset,
      verticalOffset,
      perRowMovementRight,
      perRowMovementDown,
      perColumnMovementRight
    } = this.getMeasurements()

    const row = coordinate.getRow()
    const column = coordinate.getColumn()

    const drawX = (perColumnMovementRight * column) + (perRowMovementRight * row) + horizontalOffset
    const drawY = (row * perRowMovementDown) + verticalOffset
    return [drawX, drawY]
  }
}