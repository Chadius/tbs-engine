import {expect} from 'chai'
import {Coordinate, Path} from "../src/mapMeasurement";

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
})

describe('Paths', () => {
  let newPath: Path

  beforeEach(() => {
    newPath = new Path(new Coordinate(1, 3))
  })

  it('have a starting coordinate at no cost', () => {
    expect(newPath.getHeadCoordinate().getRow()).to.equal(1)
    expect(newPath.getHeadCoordinate().getColumn()).to.equal(3)
    expect(newPath.getMovementCostSpent()).to.equal(0)
  })

  it('knows the number of coordinates it is made of', () => {
    expect(newPath.getNumberOfCoordinates()).to.equal(1)
  })

  it('can add more Coordinates and the move cost', () => {
    newPath.addCoordinate(new Coordinate(2, 3), 1)
    expect(newPath.getNumberOfCoordinates()).to.equal(2)
    expect(newPath.getMovementCostSpent()).to.equal(1)
  })
})
