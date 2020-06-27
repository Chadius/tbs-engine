import {expect} from 'chai'
import {TerrainTileGraphic} from "../../src/battleScene/terrainTileGraphic";

describe("Terrain tile graphics", () => {
  it("Knows the associated tile image", () => {
    const tile = new TerrainTileGraphic({ name: "mud", imageResource: "brown.png"})

    expect(tile.getImageResource()).to.equal("brown.png")
  })

  it("Knows the name", () => {
    const tile = new TerrainTileGraphic({ name: "mud", imageResource: "brown.png"})

    expect(tile.getName()).to.equal("mud")
  })
})
