import {MapTerrain} from '../src/battleMap'
import {expect} from 'chai'
import {Coordinate} from "../src/mapMeasurement";

describe ('Map Terrain Dimensions', () => {
  it('Knows the number of rows based on the initialization', () => {
    const terrain = new MapTerrain([
          ['1', '1'],
        ['1', 'X'],
      ['3', '1'],
    ].reverse())

    expect(terrain.getRowCount()).to.eq(3)
  })

  it('Knows the number of columns based on the initialization', () => {
    const terrain = new MapTerrain([
        ['1', 'X', 'X'],
      ['S', '1', 'X'],
    ].reverse())

    expect(terrain.getColumnCount()).to.eq(3)
  })

  it('knows which coordinates are on the map', () => {
    const mapWithShortRow = new MapTerrain([
        ['1', 'X'],
      ['S', '1', 'X'],
    ].reverse())

    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(0,0))).to.be.true
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(0,2))).to.be.true
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(1,0))).to.be.true
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(1,1))).to.be.true

    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(1, 2))).to.be.false

    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(0,-1))).to.be.false
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(0, 9001))).to.be.false
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(9001,0))).to.be.false
    expect(mapWithShortRow.hasTileAtCoordinate(new Coordinate(-1,0))).to.be.false
  })

  it('knows how to return a list of ordered tiles', () => {
    const mapWithShortRow = new MapTerrain([
        ['1', 'X'],
      ['S', '1', 'X'],
    ].reverse())

    const orderedTiles = mapWithShortRow.getTilesOrderedByCoordinates()
    expect(orderedTiles.length).to.equal(5)
    expect(orderedTiles[0]["locationKey"]).to.equal("0, 0")
    expect(orderedTiles[0]["terrain"]).to.equal("S")

    expect(orderedTiles[1]["locationKey"]).to.equal("0, 1")
    expect(orderedTiles[1]["terrain"]).to.equal("1")

    expect(orderedTiles[2]["locationKey"]).to.equal("0, 2")
    expect(orderedTiles[2]["terrain"]).to.equal("X")

    expect(orderedTiles[3]["locationKey"]).to.equal("1, 0")
    expect(orderedTiles[3]["terrain"]).to.equal("1")

    expect(orderedTiles[4]["locationKey"]).to.equal("1, 1")
    expect(orderedTiles[4]["terrain"]).to.equal("X")
  })
})
