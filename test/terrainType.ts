import {TerrainTypeMap} from "../src/terrainTypes"
import {expect} from 'chai'

describe ("Terrain Dimensions are determined by Blocks", () => {
  it("Knows the number of rows based on the initialization", () => {
    const terrain = new TerrainTypeMap([
      ["1", "1"],
      ["1", "X"],
      ["3", "1"],
    ])

    expect(terrain.rowCount()).to.eq(3)
  })

  it("Knows the number of columns based on the initialization", () => {
    const terrain = new TerrainTypeMap([
      ["1", "1", "2"],
      ["1", "X", "X"],
      ["S", "1", "X"],
    ])

    expect(terrain.columnCount()).to.eq(3)
  })
})
