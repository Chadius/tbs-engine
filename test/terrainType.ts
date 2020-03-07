import {TerrainTypeMap} from "../src/terrainTypes"
import {expect} from 'chai'

describe ("Terrain Dimensions are determined by Blocks", () => {
  it("Knows the number of rows and columns based on the initialization", () => {
    const terrain = new TerrainTypeMap([
      ["1", "1"],
      ["1", "X"],
      ["3", "1"],
    ])

    expect(terrain.rowCount()).to.eq(3)
    expect(terrain.columnCount()).to.eq(2)
  })
})