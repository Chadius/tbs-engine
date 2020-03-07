export class TerrainTypeMap {
  tileTypesByRow: Array<string[]>

  constructor(typeTiles: Array<string[]>) {
    this.tileTypesByRow = typeTiles
  }

  rowCount() {
    return this.tileTypesByRow.length
  }
}
