import {MapTerrain} from '../src/mapTerrain'
import {expect} from 'chai'

describe ('Map Terrain Dimensions', () => {
  it('Knows the number of rows based on the initialization', () => {
    const terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    expect(terrain.rowCount()).to.eq(3)
  })

  it('Knows the number of columns based on the initialization', () => {
    const terrain = new MapTerrain([
      ['1', 'X', 'X'],
      ['S', '1', 'X'],
    ])

    expect(terrain.columnCount()).to.eq(3)
  })
})

describe('Invalid terrain definition throws exceptions', () => {
  it('Throws an error when the rows do not have the same number of tiles', () => {
    const makeBadTerrain = () => {
      new MapTerrain([
        [],
        ['1', '2'],
      ])
    }

    expect(makeBadTerrain).to.throw(TypeError)
  })
})