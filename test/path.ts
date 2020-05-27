import {expect} from 'chai'
import {Coordinate, Path, SearchCoordinate} from "../src/mapMeasurement";

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
    const nextSearchCoordinate = new SearchCoordinate(1,2, 3, 4, 5 ,6)
    expect(nextSearchCoordinate.getMovementCostSpent()).to.equal(5)
    expect(nextSearchCoordinate.getEstimatedMovementCostRemaining()).to.equal(6)
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

describe('Paths', () => {
  let newPath: Path

  beforeEach(() => {
    newPath = new Path(new SearchCoordinate(1, 3, null, null, 0, 0))
  })

  it('have a starting coordinate at no cost', () => {
    expect(newPath.getHeadCoordinate().getRow()).to.equal(1)
    expect(newPath.getHeadCoordinate().getColumn()).to.equal(3)
    expect(newPath.getTotalMovementCostSpent()).to.equal(0)
  })

  it('knows the number of coordinates it is made of', () => {
    expect(newPath.getNumberOfCoordinates()).to.equal(1)
  })

  it('can add more Search Coordinates and the move cost', () => {
    newPath.addSearchCoordinate(new SearchCoordinate(2, 3, 1, 3, 1, 0))
    expect(newPath.getNumberOfCoordinates()).to.equal(2)
    expect(newPath.getTotalMovementCostSpent()).to.equal(1)
  })

  it('can clone existing paths', () => {
    const clonedPath = newPath.clone()
    expect(newPath.getNumberOfCoordinates()).to.equal(clonedPath.getNumberOfCoordinates())
    expect(newPath.getHeadCoordinate().getLocationKey()).to.equal(clonedPath.getHeadCoordinate().getLocationKey())
    expect(newPath.getTotalMovementCostSpent()).to.equal(clonedPath.getTotalMovementCostSpent())
  })

  it('can clone and extend existing paths', () => {
    const extendedPath: Path = newPath.cloneAndAddCoordinate(
      new SearchCoordinate(2, 3, 1, 3, 10, 0)
    )
    expect(extendedPath.getNumberOfCoordinates()).to.equal(newPath.getNumberOfCoordinates() + 1)
    expect(extendedPath.getTotalMovementCostSpent()).to.equal(newPath.getTotalMovementCostSpent() + 10)
    expect(extendedPath.getHeadCoordinate().getRow()).to.equal(2)
    expect(extendedPath.getHeadCoordinate().getColumn()).to.equal(3)
  })
})
