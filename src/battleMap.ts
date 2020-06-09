import {Squaddie} from "./squaddie";
import {BaseCoordinate, Coordinate} from "./mapMeasurement";
import {TerrainTile} from "./terrain/terrain";

export class MapTerrain {
  tilesByLocationKey: Map<string, TerrainTile>
  rowCount: number
  columnCount: number

  constructor(typeTiles: Array<string[]>) {
    this.tilesByLocationKey = new Map<string, TerrainTile> ()

    typeTiles.forEach((rowOfTiles, rowIndex) => {
      let columnIndex;
      for(columnIndex = 0; columnIndex < rowOfTiles.length; columnIndex = columnIndex + 1) {
        const coordinateOfTile = new Coordinate(rowIndex, columnIndex)
        const terrainTile = TerrainTile.newFromNickname(rowOfTiles[columnIndex])
        this.tilesByLocationKey.set(coordinateOfTile.getLocationKey(), terrainTile)
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

  hasTileAtCoordinate(coordinate: BaseCoordinate): boolean {
    const locationKey = coordinate.getLocationKey()
    return this.tilesByLocationKey.has(locationKey)
  }

  getTilesOrderedByCoordinates(): Array<{locationKey: string; terrain: TerrainTile }> {
    const allTiles = new Array<{locationKey: string; terrain: TerrainTile }>()

    let row, column;
    for (row = 0; row < this.getRowCount(); row = row + 1) {
      for (column = 0; column < this.getColumnCount(); column = column + 1) {
        const coordinateToSearchFor = new Coordinate(row, column)
        if (this.hasTileAtCoordinate(coordinateToSearchFor)) {
          const locationKey = coordinateToSearchFor.getLocationKey()
          allTiles.push(
            {
              locationKey: locationKey,
              terrain: this.tilesByLocationKey.get(locationKey),
            }
          )
        }
      }
    }
    return allTiles
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

  isOnMap(rowOrCoordinate: number | BaseCoordinate, column?: number): boolean {
    if (typeof rowOrCoordinate === 'number') {
      if (column !== undefined) {
        return this.terrain.hasTileAtCoordinate(new Coordinate(rowOrCoordinate, column))
      }
    }
    else {
      return this.terrain.hasTileAtCoordinate(rowOrCoordinate)
    }
    return undefined
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
    return originCoordinate.generateNeighbors()
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
