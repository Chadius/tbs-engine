import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../src/battleMap";
import {Squaddie} from "../src/squaddie";
import {Coordinate, Path} from "../src/mapMeasurement";
import {MapSearchService} from "../src/MapSearchService";

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


  describe('Locate added squaddies', () => {
    it('by coordinates', () => {
      const battleMap = new BattleMap(terrain)

      battleMap.addSquaddie(soldier, 0, 1)
      battleMap.addSquaddie(soldier2, 2, 1)

      expect(battleMap.getSquaddieAtCoordinates(0,1)).to.equal(soldier)
      expect(battleMap.getSquaddieAtCoordinates(2,1)).to.equal(soldier2)
      expect(battleMap.getSquaddieAtCoordinates(1,1)).to.equal(null)
      expect(battleMap.getSquaddieAtCoordinates(10,30)).to.equal(undefined)
    })

    it('by location', () => {
      const battleMap = new BattleMap(terrain)

      battleMap.addSquaddie(soldier, 0, 1)
      battleMap.addSquaddie(soldier2, 2, 1)

      expect(battleMap.getSquaddieAtLocationIndex(1)).to.equal(soldier)
      expect(battleMap.getSquaddieAtLocationIndex(5)).to.equal(soldier2)
      expect(battleMap.getSquaddieAtLocationIndex(3)).to.equal(null)
      expect(battleMap.getSquaddieAtLocationIndex(9001)).to.equal(undefined)
    })

    it('and get location index of Squaddies', () => {
      const battleMap = new BattleMap(terrain)

      battleMap.addSquaddie(soldier, 0, 1)
      battleMap.addSquaddie(soldier2, 2, 1)
      const soldier3 = new Squaddie(10)

      expect(battleMap.getLocationIndexOfSquaddie(soldier)).to.equal(1)
      expect(battleMap.getCoordinateOfSquaddie(soldier2)).to.eql(new Coordinate(2, 1))
      expect(battleMap.getLocationIndexOfSquaddie(soldier3)).to.equal(null)
    })
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

  it('Can clone Paths', () => {
    const startingCoord = new Coordinate(2, 0)
    const firstPath = new Path(startingCoord)
    const secondPath = firstPath.clone()
    firstPath.addCoordinate(new Coordinate(2, 1), 1)

    expect(firstPath.getNumberOfCoordinates()).to.equal(2)
    expect(secondPath.getNumberOfCoordinates()).to.equal(1)
    expect(secondPath.getCurrentCoordinates().row).to.equal(2)
    expect(secondPath.getCurrentCoordinates().column).to.equal(0)
    expect(secondPath.getMovementCostSpent()).to.equal(0)
  })
})

describe('Map can generate neighbors based on location', () => {
  let flatMap: BattleMap

  before(() => {
    flatMap = new BattleMap(
      new MapTerrain([
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
    ]))
  })

  const convertSetCoordinatesToArrayOfLocationIndecies = (setOfCoordinates: Array<Coordinate>): Array<number> => {
    return setOfCoordinates.map((x) => {return flatMap.coordinatesToLocationIndex(x)})
  }

  const assertNeighborsInclude = (setOfNeighborCoordinates: Array<Coordinate>, expectedCoordinates: Array<Array<number>>): void => {
    const locationOfNeighbors = convertSetCoordinatesToArrayOfLocationIndecies(setOfNeighborCoordinates)
    expectedCoordinates.forEach((rowColumnPair: Array<number>) => {
      const expectedLocation = flatMap.coordinatesToLocationIndex(rowColumnPair[0],rowColumnPair[1])
      expect(locationOfNeighbors).to.include(expectedLocation, `Cannot find (${rowColumnPair[0]}, ${rowColumnPair[1]})`)
    })
  }

  it('Can generate neighbors based on even row', () => {
    const neighborsOfEvenRow = flatMap.getNeighbors(new Coordinate(2, 1))
    expect(neighborsOfEvenRow.length).to.equal(6)
    assertNeighborsInclude(neighborsOfEvenRow, [[2,0], [2,2], [3,1], [1,1], [3,0], [1,0],])
  })

  it('Can generate neighbors based on odd row', () => {
    const neighborsOfOddRow = flatMap.getNeighbors(new Coordinate(1, 1))
    expect(neighborsOfOddRow.length).to.equal(6)
    assertNeighborsInclude(neighborsOfOddRow, [[1,0], [1,2], [0,1], [2,1], [0,2], [2,2],])
  })

  it('Can generate neighbors that are on the map', () => {
    const neighborsOfLowerLeft = flatMap.getNeighbors(new Coordinate(0, 0))
    expect(neighborsOfLowerLeft.length).to.equal(2)
    assertNeighborsInclude(neighborsOfLowerLeft, [[1,0], [0,1]])

    const neighborsOfUpperRight = flatMap.getNeighbors(new Coordinate(3, 4))
    expect(neighborsOfUpperRight.length).to.equal(2)
    assertNeighborsInclude(neighborsOfUpperRight, [[3,3], [2,4]])
  })
})

describe('Map can calculate as the crow flies distance between hex tiles', () => {
  let terrain: MapTerrain
  let battleMap: BattleMap

  let startCoordEvenRow: Coordinate
  let startCoordOddRow: Coordinate

  beforeEach(() => {
    terrain = new MapTerrain([
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
      ['1', '1', '1', '1', '1',],
    ])
    battleMap = new BattleMap(terrain)
    startCoordEvenRow = new Coordinate(2, 1)
    startCoordOddRow = new Coordinate(3, 1)
  })

  it('Uses no movement if it does not move', () => {
    expect(battleMap.getDirectDistance(startCoordEvenRow, startCoordEvenRow)).to.equal(0)
  })

  it('Moving from even to odd row costs 1', () => {
    expect(battleMap.getDirectDistance(startCoordEvenRow, startCoordOddRow)).to.equal(1)
  })

  it('Moving along the same column costs 1 per row', () => {
    const coordSameColumn = new Coordinate(0, 1)
    expect(battleMap.getDirectDistance(startCoordEvenRow, coordSameColumn)).to.equal(2)
  })

  it('Moving along the same row costs 1 per column', () => {
    const coordSameRow = new Coordinate(2, 4)
    expect(battleMap.getDirectDistance(startCoordEvenRow, coordSameRow)).to.equal(3)
  })

  it('Moving from Even row to Odd Row diagonally left costs 1', () => {
    const evenRowCanUseLeftDiagonal = new Coordinate(1, 0)
    expect(battleMap.getDirectDistance(startCoordEvenRow, evenRowCanUseLeftDiagonal)).to.equal(1)
  })

  it('Moving from Odd row to Even Row diagonally right costs 1', () => {
    const oddRowCanUseRightDiagonal = new Coordinate(2, 2)
    expect(battleMap.getDirectDistance(startCoordOddRow, oddRowCanUseRightDiagonal)).to.equal(1)
  })

  it('Moving from Even row to Odd Row diagonally right costs 2', () => {
    const evenRowCannotUseRightDiagonal = new Coordinate(1, 2)
    expect(battleMap.getDirectDistance(startCoordEvenRow, evenRowCannotUseRightDiagonal)).to.equal(2)
  })

  it('Moving from Odd row to Even Row diagonally left costs 2', () => {
    const oddRowCannotUseLeftDiagonal = new Coordinate(2, 0)
    expect(battleMap.getDirectDistance(startCoordOddRow, oddRowCannotUseLeftDiagonal)).to.equal(2)
  })
})

describe('A* Navigation', () => {
  let invalidStartPoint: Coordinate
  let invalidEndPoint: Coordinate
  let zeroZeroStartPoint: Coordinate

  let oneTileMap: BattleMap
  let oneRowMap: BattleMap

  before(() => {
    invalidStartPoint = new Coordinate(-1,-1)
    invalidEndPoint = new Coordinate(-1,-1)
    oneTileMap = new BattleMap(
      new MapTerrain([
        ['1', ],
      ])
    )
    oneRowMap = new BattleMap(
      new MapTerrain([
        ['1', '1', '1', '1', ],
      ])
    )

    zeroZeroStartPoint = new Coordinate(0,0)
  })

  it('Produces a 1 step Path when searching', () => {
    const pathToStartingPoint = MapSearchService.calculatePath(oneTileMap, zeroZeroStartPoint, zeroZeroStartPoint)

    expect(pathToStartingPoint.getNumberOfCoordinates()).to.equal(1)
    expect(pathToStartingPoint.getCurrentCoordinates().row).to.equal(0)
    expect(pathToStartingPoint.getCurrentCoordinates().column).to.equal(0)
    expect(pathToStartingPoint.getMovementCostSpent()).to.equal(0)
  })

  it('Returns null if the start coordinate is off screen', () => {
    const pathWithInvalidStartingPoint = MapSearchService.calculatePath(oneTileMap, invalidStartPoint, invalidStartPoint)

    expect(pathWithInvalidStartingPoint).to.be.null
  })

  it('Returns null if the end coordinate is off screen', () => {
    const pathWithInvalidStartingPoint = MapSearchService.calculatePath(oneTileMap, zeroZeroStartPoint, invalidEndPoint)

    expect(pathWithInvalidStartingPoint).to.be.null
  })

  it('Returns a linear path', () => {
    const endCoordinate = new Coordinate(0, 3)
    const pathToStartingPoint = MapSearchService.calculatePath(oneRowMap, zeroZeroStartPoint, endCoordinate)

    expect(pathToStartingPoint.getNumberOfCoordinates()).to.equal(4)
    expect(pathToStartingPoint.getCurrentCoordinates().row).to.equal(0)
    expect(pathToStartingPoint.getCurrentCoordinates().column).to.equal(3)
    expect(pathToStartingPoint.getMovementCostSpent()).to.equal(3)
  })
})

describe('Squaddie has move limits on a map', () => {
  it('Squaddie has movement', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:6})

    expect(soldierWithMovement.getBaseMovePerTurn()).to.equal(6)
    expect(soldierWithMovement.getCurrentMovePerTurn()).to.equal(6)
  })

  it('Can determine paths to destinations in range', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:4})
    const oneRowMap = new BattleMap(
      new MapTerrain([
        ['1', '1', '1', '1', ],
      ])
    )

    const zeroZeroStartPoint = new Coordinate(0,0)
    const endCoordinate = new Coordinate(0, 3)

    const pathToEndOfRow = MapSearchService.getSquaddiePathToDestination(
      soldierWithMovement,
      oneRowMap,
      zeroZeroStartPoint,
      endCoordinate
    )
    expect(pathToEndOfRow).to.not.be.null
  })

  it('Cannot find paths to destinations out of range', () => {
    const soldierWithMovement = new Squaddie(5, {}, {movement:1})
    const oneRowMap = new BattleMap(
      new MapTerrain([
        ['1', '1', '1', '1', ],
      ])
    )

    const zeroZeroStartPoint = new Coordinate(0,0)
    const endCoordinate = new Coordinate(0, 3)

    const pathToEndOfRow = MapSearchService.getSquaddiePathToDestination(
      soldierWithMovement,
      oneRowMap,
      zeroZeroStartPoint,
      endCoordinate
    )
    expect(pathToEndOfRow).to.be.null
  })
})

describe('Map can move Squaddies on the map', () => {
  let terrain: MapTerrain
  let soldier: Squaddie

  beforeEach(() => {
    terrain = new MapTerrain([
      ['1', '1'],
      ['1', 'X'],
      ['3', '1'],
    ])

    soldier = new Squaddie(5)
  })

  it('Will update Squaddie locations', () => {
    const battleMap = new BattleMap(terrain)

    battleMap.addSquaddie(soldier, 0, 1)
    battleMap.moveSquaddie(soldier, 2, 0)
    expect(battleMap.getSquaddieAtCoordinates(0,1)).to.equal(null)
    expect(battleMap.getSquaddieAtCoordinates(2,0)).to.equal(soldier)
    expect(battleMap.getSquaddieAtLocationIndex(4)).to.equal(soldier)
    expect(battleMap.getCoordinateOfSquaddie(soldier)).to.eql(new Coordinate(2, 0))
  })

  it('Throws an error if destination is off map', () => {
    const battleMap = new BattleMap(terrain)

    battleMap.addSquaddie(soldier, 0, 1)

    const moveOffLeftEdge: () => void = () => {
      battleMap.moveSquaddie(soldier, 0, -1)
    }

    const moveOffRightEdge: () => void = () => {
      battleMap.moveSquaddie(soldier, 0, 2)
    }

    const moveOffBottomEdge: () => void = () => {
      battleMap.moveSquaddie(soldier, -1, 0)
    }

    const moveOffTopEdge: () => void = () => {
      battleMap.moveSquaddie(soldier, 3, 0)
    }

    expect(moveOffLeftEdge).to.throw(Error)
    expect(moveOffRightEdge).to.throw(Error)
    expect(moveOffTopEdge).to.throw(Error)
    expect(moveOffBottomEdge).to.throw(Error)
  })

  it('Throws an error if destination is occupied by another squaddie and aborts movement', () => {
    const battleMap = new BattleMap(terrain)

    battleMap.addSquaddie(soldier, 0, 1)

    const soldier2 = new Squaddie(5)
    battleMap.addSquaddie(soldier2, 1, 0)

    const moveOnOtherSoldier: () => void = () => {
      battleMap.moveSquaddie(soldier, 1, 0)
    }

    expect(moveOnOtherSoldier).to.throw(Error)
    expect(battleMap.getSquaddieAtCoordinates(0,1)).to.equal(soldier)
  })
})