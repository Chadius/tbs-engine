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

  isOnMap(rowOrCoordinate: number | Coordinate, column?: number): boolean {
    let row = 0
    if (typeof rowOrCoordinate === 'number') {
      row = rowOrCoordinate
    }
    else {
      row = rowOrCoordinate.getRow()
      column = rowOrCoordinate.getColumn()
    }

    return (
      row >= 0
      && row < this.rowCount()
      && column >= 0
      && column < this.columnCount()
    )
  }

  coordinatesToLocationIndex(rowOrCoordinate: number | Coordinate, column?: number): number {
    let row: number = undefined

    if(typeof rowOrCoordinate === 'number') {
      row = rowOrCoordinate
    }
    else {
      row = rowOrCoordinate.getRow()
      column = rowOrCoordinate.getColumn()
    }

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
    if (this.squaddiesByLocationIndex.get(locationIndex)) {
      throw Error(`Two squaddies cannot be at the same coordinates (${row}, ${column})`)
    }

    this.squaddiesByLocationIndex.set(locationIndex, newSquaddie)
  }

  getSquaddieAtCoordinates(row: number, column: number) {
    const squaddieCoordinate = this.coordinatesToLocationIndex(row, column)
    if (!squaddieCoordinate) {
      return undefined
    }

    return this.squaddiesByLocationIndex.get(squaddieCoordinate) || null
  }

  getSquaddieAtLocationIndex(locationIndex: number): Squaddie {
    if (this.locationIndexToCoordinates(locationIndex) === undefined) {
      return undefined
    }

    return this.squaddiesByLocationIndex.get(locationIndex) || null
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

  getNeighbors(originCoordinate: Coordinate): Array<Coordinate> {
    const originRow = originCoordinate.getRow()
    const originColumn = originCoordinate.getColumn()
    const originRowIsEven = (originRow % 2 === 0)
    const freeDiagonalDirection = originRowIsEven ? -1 : 1

    return [
      new Coordinate(originRow, originColumn - 1),
      new Coordinate(originRow, originColumn + 1),
      new Coordinate(originRow - 1 , originColumn),
      new Coordinate(originRow + 1, originColumn),
      new Coordinate(originRow - 1 , originColumn + freeDiagonalDirection),
      new Coordinate(originRow + 1, originColumn + freeDiagonalDirection),
    ]
      .filter((neighbor) => { return this.isOnMap(neighbor)})
  }

  getLocationIndexOfSquaddie(squaddieToFind: Squaddie): number{
    const squaddieIterator = this.squaddiesByLocationIndex.entries()

    let nextSquaddieKeyValue = squaddieIterator.next()
    while(!nextSquaddieKeyValue.done) {
      const locationIndex = nextSquaddieKeyValue.value[0]
      const squaddie = nextSquaddieKeyValue.value[1]
      if (squaddie === squaddieToFind) {
        return locationIndex
      }
      nextSquaddieKeyValue = squaddieIterator.next()
    }

    return null
  }

  getCoordinateOfSquaddie(squaddie: Squaddie): Coordinate {
    const locationIndex = this.getLocationIndexOfSquaddie(squaddie)
    if (!locationIndex) {
      return null
    }
    const rowIndexPair = this.locationIndexToCoordinates(locationIndex)
    return new Coordinate(rowIndexPair.row, rowIndexPair.column)
  }

  moveSquaddie(squaddieToMove: Squaddie, destinationRow: number, destinationColumn: number): void {
    if (!this.isOnMap(destinationRow, destinationColumn)) {
      throw Error(`Destination is off map: (${destinationRow}, ${destinationColumn})`)
    }

    const locationIndexOfSquaddie = this.getLocationIndexOfSquaddie(squaddieToMove)
    if (this.getSquaddieAtCoordinates(destinationRow, destinationColumn)) {
      throw Error(`Another Squaddie is at the destination, cannot move: (${destinationRow}, ${destinationColumn})`)
    }

    this.squaddiesByLocationIndex.set(locationIndexOfSquaddie, null)
    this.addSquaddie(squaddieToMove, destinationRow, destinationColumn)
  }
}
