import {expect} from 'chai'
import {Coordinate, SearchCoordinate} from "../src/mapMeasurement";

describe('Coordinates', () => {
  let newCoordinate: Coordinate

  beforeEach(() => {
    newCoordinate = new Coordinate(2, 5)
  })

  it('can tell its row and column', () => {
    expect(newCoordinate.getRow()).to.equal(2)
    expect(newCoordinate.getColumn()).to.equal(5)
  })

  it('can generate a location key based on its row and column', () => {
    expect(newCoordinate.getLocationKey()).to.equal("2, 5")
  })

  it('can compare value equality to other Coordinates using a custom function', () => {
    const sameRowAndColumn = new Coordinate(2, 5)
    const differentRowAndColumn = new Coordinate(1, 7)

    expect(newCoordinate.equals(sameRowAndColumn)).to.be.true
    expect(newCoordinate.equals(differentRowAndColumn)).to.be.false
  })

  it('can create a new coordinate from a string', () => {
    expect(Coordinate.newFromLocationKey("0, 0").getRow()).to.equal(0)
    expect(Coordinate.newFromLocationKey("0,0").getColumn()).to.equal(0)

    expect(Coordinate.newFromLocationKey("0, 1").getRow()).to.equal(0)
    expect(Coordinate.newFromLocationKey("0, 1").getColumn()).to.equal(1)

    expect(Coordinate.newFromLocationKey("1, 0").getRow()).to.equal(1)
    expect(Coordinate.newFromLocationKey("1, 0").getColumn()).to.equal(0)

    expect(Coordinate.newFromLocationKey("10")).to.be.undefined
    expect(Coordinate.newFromLocationKey("s, t")).to.be.undefined
  })

  it('Can convert to cube coordinates', () => {
    const cubeCoordinates = newCoordinate.toCubeCoordinates()
    expect(cubeCoordinates.x).to.equal(5)
    expect(cubeCoordinates.y).to.equal(2)
    expect(cubeCoordinates.z).to.equal(-7)
  })

  it('Can convert from cube coordinates', () => {
    const fromCubeCoordinate = Coordinate.newFromCubeCoordinates(5,2,-7)
    expect(fromCubeCoordinate).to.eql(newCoordinate)
  })
})

describe('SearchCoordinate', () => {
  it('Can be created without an origin', () => {
    const firstSearchCoordinate = new SearchCoordinate(1,2, null, null, 0, 0)
    expect(firstSearchCoordinate.getOriginRow()).to.be.null
    expect(firstSearchCoordinate.getOriginColumn()).to.be.null
    expect(firstSearchCoordinate.getOriginLocationKey()).to.be.null

    expect(firstSearchCoordinate.isOrigin()).to.be.true
  })

  it('Can be created with an origin', () => {
    const nextSearchCoordinate = new SearchCoordinate(1,2, 3, 4, 0 ,0)
    expect(nextSearchCoordinate.getOriginRow()).to.equal(3)
    expect(nextSearchCoordinate.getOriginColumn()).to.equal(4)
  })
  it('Can be return location key of the origin', () => {
    const nextSearchCoordinate = new SearchCoordinate(1,2, 3, 4, 0 ,0)
    expect(nextSearchCoordinate.getOriginLocationKey()).to.equal("3, 4")
  })
  it('Can record and recall the movement cost', () => {
    const nextSearchCoordinate = new SearchCoordinate(1,2, 3, 4, 5 ,6, 7)
    expect(nextSearchCoordinate.getMovementCostSpent()).to.equal(5)
    expect(nextSearchCoordinate.getEstimatedMovementCostRemaining()).to.equal(6)
    expect(nextSearchCoordinate.getTotalMovementCostSpent()).to.equal(7)
  })

  it('can be cloned and compared with a custom equals function', () => {
    const firstSearchCoordinate = new SearchCoordinate(1,2, null, null, 0, 0)
    const clonedSearchCoordinate = firstSearchCoordinate.clone()

    expect(clonedSearchCoordinate.getOriginRow()).to.equal(firstSearchCoordinate.getOriginRow())
    expect(clonedSearchCoordinate.getOriginColumn()).to.equal(firstSearchCoordinate.getOriginColumn())
    expect(clonedSearchCoordinate.getRow()).to.equal(firstSearchCoordinate.getRow())
    expect(clonedSearchCoordinate.getColumn()).to.equal(firstSearchCoordinate.getColumn())
    expect(clonedSearchCoordinate.getMovementCostSpent()).to.equal(firstSearchCoordinate.getMovementCostSpent())
    expect(clonedSearchCoordinate.getEstimatedMovementCostRemaining()).to.equal(firstSearchCoordinate.getEstimatedMovementCostRemaining())

    expect(clonedSearchCoordinate).to.eql(firstSearchCoordinate)
  })
})

describe('Coordinate Math', () => {
  it('Can add two coordinates', () => {
    const firstCoordinate = new Coordinate(0, 1)
    const secondCoordinate = new Coordinate(1, 0)

    let sumCoordinate = firstCoordinate.add(secondCoordinate)
    expect(sumCoordinate).to.eql(new Coordinate(1, 1))

    const thirdCoordinate = new Coordinate(2, 0)

    sumCoordinate = firstCoordinate.add(thirdCoordinate)
    expect(sumCoordinate).to.eql(new Coordinate(2, 1))
  })

  it('Can generate neighbors for a given coordinate', () => {
    const centerCoordinate = new Coordinate(3, 4)

    const neighbors = centerCoordinate.generateNeighbors()
    expect(neighbors.length).to.equal(6)

    expect(neighbors).to.deep.include(new Coordinate(3, 3))
    expect(neighbors).to.deep.include(new Coordinate(3, 5))
    expect(neighbors).to.deep.include(new Coordinate(2, 4))
    expect(neighbors).to.deep.include(new Coordinate(4, 4))
    expect(neighbors).to.deep.include(new Coordinate(2, 5))
    expect(neighbors).to.deep.include(new Coordinate(4, 3))
  })
})