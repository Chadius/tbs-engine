import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../src/battleMap";
import {Squaddie} from "../src/squaddie";

describe('Map contains the terrain and can query it', () => {
  let terrain: MapTerrain
  let battleMap: BattleMap

  beforeEach(() => {
    terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    battleMap = new BattleMap(terrain)
  })

  it('Knows the size of the terrain', () => {
    expect(battleMap.rowCount()).to.eq(3)
    expect(battleMap.columnCount()).to.eq(2)
  })

  it('Can tell if coordinates are off map', () => {
    expect(battleMap.isOnMap(0,0)).to.be.true
    expect(battleMap.isOnMap(1,0)).to.be.true
    expect(battleMap.isOnMap(2,1)).to.be.true
    expect(battleMap.isOnMap(3,0)).to.be.false
    expect(battleMap.isOnMap(0,2)).to.be.false
  })

  it('Can convert coordinates to location index', () => {
    expect(battleMap.coordinatesToLocationIndex(0,0)).to.equal(0)
    expect(battleMap.coordinatesToLocationIndex(1,0)).to.equal(2)
    expect(battleMap.coordinatesToLocationIndex(2,1)).to.equal(5)
    expect(battleMap.coordinatesToLocationIndex(-1,0)).to.equal(undefined)
    expect(battleMap.coordinatesToLocationIndex(0,2)).to.equal(undefined)
  })

  it('Can convert location index to coordinates', () => {
    expect(battleMap.locationIndexToCoordinates(0)).to.eql({row:0,column:0})
    expect(battleMap.locationIndexToCoordinates(1)).to.eql({row:0,column:1})
    expect(battleMap.locationIndexToCoordinates(2)).to.eql({row:1,column:0})
    expect(battleMap.locationIndexToCoordinates(-1)).to.eql(undefined)
    expect(battleMap.locationIndexToCoordinates(6)).to.eql(undefined)
  })

})

describe('Map can contain Squaddies',  () => {
  let terrain: MapTerrain
  let soldier: Squaddie
  let soldier2: Squaddie

  beforeEach(() => {
    terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    soldier = new Squaddie(5)
    soldier2 = new Squaddie(10)
  })

  it('Can add a Squaddie and find its location', () => {
    const battleMap = new BattleMap(terrain)

    battleMap.addSquaddie(soldier, 0, 1)
    battleMap.addSquaddie(soldier2, 2, 1)

    expect(battleMap.getSquaddieAtLocation(0,1)).to.equal(soldier)
    expect(battleMap.getSquaddieAtLocation(2,1)).to.equal(soldier2)
    expect(battleMap.getSquaddieAtLocation(1,1)).to.equal(null)
    expect(battleMap.getSquaddieAtLocation(10,30)).to.equal(undefined)
  })

  it('Cannot add two Squaddies at the same location', () => {
    const battleMap = new BattleMap(terrain)

    battleMap.addSquaddie(soldier, 0, 1)

    const stackingSquaddiesThrowsErrors: () => void = () => {
      battleMap.addSquaddie(soldier2, 0, 1)
    }

    expect(stackingSquaddiesThrowsErrors).to.throw(Error)
  })

  it('Squaddie has movement', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:6})

    expect(soldierWithMovement.getBaseMovePerTurn()).to.equal(6)
    expect(soldierWithMovement.getCurrentMovePerTurn()).to.equal(6)
  })
});