import {expect} from 'chai'
import {Path, SearchCoordinate} from "../src/mapMeasurement";

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
