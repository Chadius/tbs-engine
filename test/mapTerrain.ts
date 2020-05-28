import {MapTerrain} from '../src/battleMap'
import {expect} from 'chai'

describe ('Map Terrain Dimensions', () => {
  it('Knows the number of rows based on the initialization', () => {
    const terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    expect(terrain.getRowCount()).to.eq(3)
  })

  it('Knows the number of columns based on the initialization', () => {
    const terrain = new MapTerrain([
      ['1', 'X', 'X'],
      ['S', '1', 'X'],
    ])

    expect(terrain.getColumnCount()).to.eq(3)
  })
})
