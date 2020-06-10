import {expect} from 'chai'
import {TerrainTile, TerrainType} from "../src/terrain/terrain";

describe("Terrain fields", () => {
  it("Knows the movement cost type", () => {
    const tile = new TerrainTile(TerrainType.road, "pavement")

    expect(tile.getTerrainType()).to.equal(TerrainType.road)
  })

  it("Knows the name", () => {
    const tile = new TerrainTile(TerrainType.road, "pavement")

    expect(tile.getName()).to.equal("pavement")
  })

  it("Can be made without a description", () => {
    const tile = new TerrainTile(TerrainType.road, "pavement")

    expect(tile.getDescription()).to.equal("")
  })

  it("Can be made with a description", () => {
    const tile = new TerrainTile(TerrainType.road, "pavement", "Comfy and easy to wear")

    expect(tile.getDescription()).to.equal("Comfy and easy to wear")
  })
})

describe('Premade terrain fields', () => {
  it("Can make a premade tile based on the terrain type", () => {
    const tileMadeFromTerrainType = TerrainTile.newFromTerrainType(TerrainType.road)
    expect(tileMadeFromTerrainType.getTerrainType()).to.equal(TerrainType.road)
    expect(tileMadeFromTerrainType.getName()).to.equal("road")
    expect(tileMadeFromTerrainType.getDescription()).to.equal("Roads are easy to traverse.")
  })

  it("Can make a premade tile based on the name", () => {
    const tileMadeFromTerrainType = TerrainTile.newFromName("grass")
    expect(tileMadeFromTerrainType.getTerrainType()).to.equal(TerrainType.grass)
    expect(tileMadeFromTerrainType.getName()).to.equal("grass")
    expect(tileMadeFromTerrainType.getDescription()).to.equal("Grass is a bit slow to cross.")
  })

  it("Can make a premade tile based on a single character nickname", () => {
    const tileMadeFromTerrainType = TerrainTile.newFromNickname("3")
    expect(tileMadeFromTerrainType.getTerrainType()).to.equal(TerrainType.sand)
    expect(tileMadeFromTerrainType.getName()).to.equal("sand")
    expect(tileMadeFromTerrainType.getDescription()).to.equal("Sand is very hard to cross.")
  })

  it("Throws an error if it doesn't know the terrain type", () => {
    const unknownTerrainType = () => {
      TerrainTile.newFromName("kwyjibo")
    }
    expect(unknownTerrainType).to.throw(Error)

    const unknownTerrainNickname = () => {
      TerrainTile.newFromNickname("kwyjibo")
    }
    expect(unknownTerrainNickname).to.throw(Error)
  })

  it("Can make a premade sky tile", () => {
    const tileMadeFromTerrainType = TerrainTile.newFromNickname("S")
    expect(tileMadeFromTerrainType.getTerrainType()).to.equal(TerrainType.sky)
    expect(tileMadeFromTerrainType.getName()).to.equal("sky")
    expect(tileMadeFromTerrainType.getDescription()).to.equal("Sky tiles must be flown over.")
  })

  it("Can make a premade wall tile", () => {
    const tileMadeFromTerrainType = TerrainTile.newFromTerrainType(TerrainType.wall)
    expect(tileMadeFromTerrainType.getTerrainType()).to.equal(TerrainType.wall)
    expect(tileMadeFromTerrainType.getName()).to.equal("wall")
    expect(tileMadeFromTerrainType.getDescription()).to.equal("Walls are unpassable.")
  })
})