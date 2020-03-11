import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../src/battleMap";

describe('Map has a container', () => {
  it('Knows the size of the terrain', () => {
    const terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    const battleMap = new BattleMap(terrain)

    expect(battleMap.rowCount()).to.eq(3)
    expect(battleMap.columnCount()).to.eq(2)
  })
})
