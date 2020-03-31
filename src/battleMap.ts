import {Squaddie} from "./squaddie";
import {Coordinate} from "./mapMeasurement";

export const BattleMapFunctions = {
  getNeighborCoordinates: (originCoordinate: Coordinate) => {
    const originRow = originCoordinate.getRow()
    const originColumn = originCoordinate.getColumn()
    const originRowIsEven = (originRow % 2 === 0)
    const freeDiagonalDirection = originRowIsEven ? -1 : 1

    return [
      new Coordinate(originRow, originColumn - 1),
      new Coordinate(originRow, originColumn + 1),
      new Coordinate(originRow - 1, originColumn),
      new Coordinate(originRow + 1, originColumn),
      new Coordinate(originRow - 1, originColumn + freeDiagonalDirection),
      new Coordinate(originRow + 1, originColumn + freeDiagonalDirection),
    ]
  }
}

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
  squaddiesByLocationKey: Map<string, Squaddie>

  constructor(terrain: MapTerrain) {
    this.terrain = terrain

    this.squaddiesByLocationKey = new Map<string, Squaddie>()
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

  addSquaddie(newSquaddie: Squaddie, coordinate: Coordinate) {
    const locationKey = coordinate.getLocationKey()
    if (this.squaddiesByLocationKey.get(locationKey)) {
      throw Error(`Two squaddies cannot be at the same coordinates ${locationKey}`)
    }

    if (!this.isOnMap(coordinate)) {
      throw Error(`Cannot add Squaddie off map at ${locationKey}`)
    }

    this.squaddiesByLocationKey.set(locationKey, newSquaddie)
  }

  getSquaddieAtCoordinate(coordinate: Coordinate) {
    if (!this.isOnMap(coordinate)) {
      return undefined
    }

    const locationKey = coordinate.getLocationKey()

    return this.squaddiesByLocationKey.get(locationKey) || null
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

  getOnMapNeighbors(originCoordinate: Coordinate): Array<Coordinate> {
    return BattleMapFunctions.getNeighborCoordinates(originCoordinate)
      .filter((neighbor) => {
      return this.isOnMap(neighbor)
    });
  }

  getCoordinateOfSquaddie(squaddieToFind: Squaddie): Coordinate {
    const squaddieIterator = this.squaddiesByLocationKey.entries()

    let nextSquaddieKeyValue = squaddieIterator.next()
    while(!nextSquaddieKeyValue.done) {
      const locationKey = nextSquaddieKeyValue.value[0]
      const squaddie = nextSquaddieKeyValue.value[1]
      if (squaddie === squaddieToFind) {
        return Coordinate.newFromLocationKey(locationKey)
      }
      nextSquaddieKeyValue = squaddieIterator.next()
    }

    return null
  }

  moveSquaddie(squaddieToMove: Squaddie, destination: Coordinate): void {
    if (!this.isOnMap(destination.getRow(), destination.getColumn())) {
      throw Error(`Destination is off map: ${destination.getLocationKey()}`)
    }

    const squaddieLocation = this.getCoordinateOfSquaddie(squaddieToMove)
    const squaddieAtDestination = this.getSquaddieAtCoordinate(destination)
    if (squaddieAtDestination && squaddieAtDestination !== squaddieToMove) {
      throw Error(`Another Squaddie is at the destination, cannot move: ${destination.getLocationKey()}`)
    }

    this.squaddiesByLocationKey.set(squaddieLocation.getLocationKey(), null)
    this.addSquaddie(squaddieToMove, destination)
  }
}
