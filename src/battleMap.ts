export class MapTerrain{
  tileTypesByRow: Array<string[]>

  constructor(typeTiles: Array<string[]>) {
    const numColumnsInEachRow = typeTiles.map((row: string[]) => row.length)
    if (numColumnsInEachRow.every(col => col === numColumnsInEachRow[0]) !== true) {
      throw TypeError("All rows must have the same number of columns.")
    }

    this.tileTypesByRow = typeTiles
  }

  rowCount() {
    return this.tileTypesByRow.length
  }

  columnCount() {
    return this.tileTypesByRow[0].length
  }
}

export class BattleMap{
  terrain: MapTerrain

  constructor(terrain: MapTerrain) {
    this.terrain = terrain
  }

  rowCount() {
    return this.terrain.rowCount()
  }

  columnCount() {
    return this.terrain.columnCount()
  }
}
