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
  tilesByLocationKey: Map<string, string>
  rowCount: number
  columnCount: number

  constructor(typeTiles: Array<string[]>) {
    this.tilesByLocationKey = new Map<string, string> ()

    typeTiles.forEach((rowOfTiles, rowIndex) => {
      let columnIndex;
      for(columnIndex = 0; columnIndex < rowOfTiles.length; columnIndex = columnIndex + 1) {
        const coordinateOfTile = new Coordinate(rowIndex, columnIndex)
        this.tilesByLocationKey.set(coordinateOfTile.getLocationKey(), rowOfTiles[columnIndex])
      }
    })

    this.rowCount = 0
    this.columnCount = 0

    this.tilesByLocationKey.forEach((tileLetter, locationKey, map) => {
      const coordinateOfLocation = Coordinate.newFromLocationKey(locationKey)
      this.rowCount = this.rowCount > coordinateOfLocation.getRow() ? this.rowCount : coordinateOfLocation.getRow()
      this.columnCount = this.columnCount > coordinateOfLocation.getColumn() ? this.columnCount : coordinateOfLocation.getColumn()
    })

    if(this.tilesByLocationKey.size > 0) {
      this.rowCount = this.rowCount + 1
      this.columnCount = this.columnCount + 1
    }
  }

  getRowCount(): number {
    return this.rowCount
  }

  getColumnCount(): number {
    return this.columnCount
  }
}

export class BattleMap{
  terrain: MapTerrain
  squaddiesByLocationKey: Map<string, Squaddie>
  squaddiesById: Map<string, Squaddie>

  constructor(terrain: MapTerrain) {
    this.terrain = terrain

    this.squaddiesByLocationKey = new Map<string, Squaddie>()
    this.squaddiesById = new Map<string, Squaddie>()
  }

  rowCount(): number {
    return this.terrain.getRowCount()
  }

  columnCount(): number {
    return this.terrain.getColumnCount()
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

    if (this.squaddiesById.get(newSquaddie.getId())) {
      throw Error(`Squaddie already exists with this ID: ${newSquaddie.getId()}`)
    }

    if (!this.isOnMap(coordinate)) {
      throw Error(`Cannot add Squaddie off map at ${locationKey}`)
    }

    this.squaddiesByLocationKey.set(locationKey, newSquaddie)
    this.squaddiesById.set(newSquaddie.getId(), newSquaddie)
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
    let coordinateOfSquaddie = null
    this.squaddiesByLocationKey.forEach((squaddie, locationKey) => {
      if (squaddie === squaddieToFind) {
        coordinateOfSquaddie = Coordinate.newFromLocationKey(locationKey)
      }
    })
    return coordinateOfSquaddie
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
    this.squaddiesById.set(squaddieToMove.getId(), null)
    this.addSquaddie(squaddieToMove, destination)
  }

  getCoordinatesOfAllSquaddiesByID(): Map<string, Coordinate> {
    const allCoordinates = new Map<string, Coordinate>()
    this.squaddiesByLocationKey.forEach((squaddie, locationKey) => {
      allCoordinates.set(squaddie.getId(), Coordinate.newFromLocationKey(locationKey))
    })
    return allCoordinates
  }

  getSquaddieById(squaddieID: string): Squaddie {
    return this.squaddiesById.get(squaddieID) || null
  }
}
