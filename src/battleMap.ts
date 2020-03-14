import {Squaddie} from "./squaddie";
import {Coordinate} from "./mapMeasurement";

export class MapTerrain {
  tileTypesByRow: Array<string[]>

  constructor(typeTiles: Array<string[]>) {
    const numColumnsInEachRow = typeTiles.map((row: string[]) => row.length)
    if (numColumnsInEachRow.every(col => col === numColumnsInEachRow[0]) !== true) {
      throw TypeError("All rows must have the same number of columns.")
    }

    this.tileTypesByRow = typeTiles
  }

  rowCount(): number {
    return this.tileTypesByRow.length
  }

  columnCount(): number {
    return this.tileTypesByRow[0].length
  }
}

export class BattleMap{
  terrain: MapTerrain
  squaddiesByLocationIndex: Map<number, Squaddie>

  constructor(terrain: MapTerrain) {
    this.terrain = terrain

    this.squaddiesByLocationIndex = new Map<number, Squaddie>()
  }

  rowCount(): number {
    return this.terrain.rowCount()
  }

  columnCount(): number {
    return this.terrain.columnCount()
  }

  isOnMap(row: number, column: number): boolean {
    return (
      row >= 0
      && row < this.rowCount()
      && column >= 0
      && column < this.columnCount()
    )
  }

  coordinatesToLocationIndex(row: number, column: number): number {
    if (this.isOnMap(row, column) !== true) {
      return undefined
    }
    return (row * this.columnCount() + column)
  }

  locationIndexToCoordinates(locationIndex: number): {row: number; column: number} {
    const row = Math.floor(locationIndex / this.columnCount()),
      column = locationIndex % this.columnCount()

    if (this.isOnMap(row, column) !== true) {
      return undefined
    }

    return {
      row: row,
      column: column,
    }
  }

  addSquaddie(newSquaddie: Squaddie, row: number, column: number) {
    const locationIndex = this.coordinatesToLocationIndex(row, column)
    if (this.squaddiesByLocationIndex[locationIndex]) {
      throw Error(`Two squaddies cannot be at the same coordinates (${row}, ${column})`)
    }

    this.squaddiesByLocationIndex[locationIndex] = newSquaddie
  }

  getSquaddieAtLocation(row: number, column: number) {
    const squaddieCoordinate = this.coordinatesToLocationIndex(row, column)
    if (!squaddieCoordinate) {
      return undefined
    }

    return this.squaddiesByLocationIndex[squaddieCoordinate] || null
  }

  getDirectDistance(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
    const columnDistance = endCoordinate.getColumn() - startCoordinate.getColumn()
    const rowDistance = endCoordinate.getRow() - startCoordinate.getRow()

    if (columnDistance === 0) {
      return Math.abs(rowDistance)
    }

    if (rowDistance === 0) {
      return Math.abs(columnDistance)
    }

    const startingRowIsEven = (startCoordinate.getRow() % 2 === 0)
    const applyDiscountForUsingDiagonals = ((startingRowIsEven && columnDistance < 0) || (!startingRowIsEven && columnDistance > 0))
    const discountForUsingDiagonals = applyDiscountForUsingDiagonals ? 1 : 0

    return Math.abs(columnDistance) + Math.abs(rowDistance) - discountForUsingDiagonals
  }
}
