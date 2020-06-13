import {BattleMap} from "../battleMap";
import {Coordinate} from "../mapMeasurement";

export class BattleMapGraphicState {
  tileWidth: number
  battleMap: BattleMap

  constructor(parameters: { tileWidth: number; battleMap: BattleMap }) {
    this.tileWidth = parameters.tileWidth
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
    const distanceFromCenterToCorner = this.tileWidth / Math.sqrt(3)
    return {
      horizontalOffset: this.tileWidth / 2,
      verticalOffset: this.tileWidth / 2,
      distanceFromCenterToCorner: distanceFromCenterToCorner,
      perRowMovementDown: 3 * distanceFromCenterToCorner / 2,
      perRowMovementRight: this.tileWidth / 2.0,
      perColumnMovementRight: this.tileWidth,
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