import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../src/battleMap"
import {BattleMapGraphicState} from "../src/battleScene/battleMapGraphicState"
import {Coordinate} from "../src/mapMeasurement";

describe("clicking on a map", () => {
  let battleMap
  let battleMapGraphicState

  beforeEach(() => {
    battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
        ['1', 'X', '1', '1'],
          ['3', '3', 'S', 'X'],
    ]))

    battleMapGraphicState = new BattleMapGraphicState({
      battleMap: battleMap,
      tileSize: 64
    })
  })

  it('clicking off map returns undefined', () => {
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(-10, -5)).to.be.undefined
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(9001, 1)).to.be.undefined
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(1, 9001)).to.be.undefined
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(0, 0)).to.be.undefined
  })

  it('knows which tile you clicked on', () => {
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(32, 32)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(32, 31)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(32, 1)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(2, 24)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(2, 42)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(32, 62)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(56, 46)).to.eql(new Coordinate(0, 0))
    expect(battleMapGraphicState.getTileCoordinateAtWorldLocation(56, 24)).to.eql(new Coordinate(0, 0))
  })
})

describe("Can look at lines", () => {
  let battleMapGraphicState

  beforeEach(() => {
    const battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
      ['1', 'X', '1', '1'],
      ['3', '3', 'S', 'X'],
    ]))

    battleMapGraphicState = new BattleMapGraphicState({
      battleMap: battleMap,
      tileSize: 64
    })
  })
})