import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../src/battleMap";
import {Squaddie} from "../src/squaddie";
import {Coordinate, Path} from "../src/mapMeasurement";

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
});

describe('Map can create Paths and Coordinates', () => {
  it('Can create and inspect Coordinates', () => {
    const coord = new Coordinate(2, 0)

    expect(coord.row).to.equal(2)
    expect(coord.column).to.equal(0)

    expect(coord.getRow()).to.equal(2)
    expect(coord.getColumn()).to.equal(0)
  })

  it('Can compare Coordinates', () => {
    const coord = new Coordinate(2, 0)
    const coord2 = new Coordinate(2, 0)
    const coord3 = new Coordinate(0, 2)

    expect(coord.equals(coord2)).to.be.true
    expect(coord2.equals(coord)).to.be.true
    expect(coord.equals(coord3)).to.be.false
  })

  it('Can create and query Paths', () => {
    const startingCoord = new Coordinate(2, 0)
    const path = new Path(startingCoord)

    expect(path.getNumberOfCoordinates()).to.equal(1)
    expect(path.getCurrentCoordinates().row).to.equal(2)
    expect(path.getCurrentCoordinates().column).to.equal(0)
    expect(path.getMovementCostSpent()).to.equal(0)
  })

  it('Can add more Coordinates to a Path and change the movement cost', () => {
    const startingCoord = new Coordinate(2, 0)
    const path = new Path(startingCoord)
    path.addCoordinate(new Coordinate(2, 1), 1)
    path.addCoordinate(new Coordinate(3, 1), 1)
    path.addCoordinate(new Coordinate(3, 2), 1)
    path.addCoordinate(new Coordinate(4, 3), 3)

    expect(path.getNumberOfCoordinates()).to.equal(5)
    expect(path.getCurrentCoordinates().row).to.equal(4)
    expect(path.getCurrentCoordinates().column).to.equal(3)
    expect(path.getMovementCostSpent()).to.equal(6)
  })
})

describe('Squaddie has move limits on a map', () => {
  it('Squaddie has movement', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:6})

    expect(soldierWithMovement.getBaseMovePerTurn()).to.equal(6)
    expect(soldierWithMovement.getCurrentMovePerTurn()).to.equal(6)
  })

  it('Can calculate as the crow flies distance to locations on a map', () => {
    const terrain = new MapTerrain([
      ['1', '1', '1'],
      ['1', '1', '1'],
      ['1', '1', '1'],
      ['1', '1', '1'],
    ])


  })
})