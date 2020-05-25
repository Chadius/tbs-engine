import {expect} from 'chai'
import {Coordinate, Path, SearchCoordinate} from "../src/mapMeasurement";
import {PathMap} from "../src/pathMap";

describe.only('PathMaps are created', () => {
  it('with no Paths and be empty', () => {
    const blankPathMap = new PathMap()
    expect(blankPathMap.isEmpty()).to.be.true
  })

  it('by cloning another PathMap', () => {
    const searchCoordinateStart = new SearchCoordinate(1, 2, null, null, 0, 3)
    const searchCoordinateEnd = new SearchCoordinate(2, 2, 1, 2, 1, 2)

    const originalPathMap = new PathMap()
    originalPathMap.addSearchCoordinate(searchCoordinateStart)
    originalPathMap.addSearchCoordinate(searchCoordinateEnd)

    const clonedPathMap = originalPathMap.clone()
    expect(clonedPathMap.getNumberOfSearchCoordinates()).to.equal(2)

    expect (clonedPathMap.getSearchCoordinateAtCoordinate(
      new Coordinate(1, 2)
    )).to.equal(searchCoordinateStart)
    expect (clonedPathMap.getSearchCoordinateAtCoordinate(
      new Coordinate(2, 2)
    )).to.equal(searchCoordinateEnd)
  })

  it('by adding SearchCoordinates one at a time', () => {
    const searchCoordinate1 = new SearchCoordinate(1, 2, null, null, 0, 3)
    const searchCoordinate2 = new SearchCoordinate(2, 2, 1, 2, 1, 2)
    const searchCoordinate3 = new SearchCoordinate(3, 2, 2, 2, 2, 1)
    const searchCoordinate4 = new SearchCoordinate(3, 1, 3, 2, 3, 0)

    const newPathMap = new PathMap()
    newPathMap.addSearchCoordinate(searchCoordinate1)
    newPathMap.addSearchCoordinate(searchCoordinate2)
    newPathMap.addSearchCoordinate(searchCoordinate3)
    newPathMap.addSearchCoordinate(searchCoordinate4)

    expect(newPathMap.getNumberOfSearchCoordinates()).to.equal(4)
    expect(newPathMap.isEmpty()).to.be.false
  })
})

describe.only('PathMaps with SearchCoordinates', () => {
  let newPathMap: PathMap
  let searchCoordinateStart: SearchCoordinate
  let searchCoordinateAfterStart: SearchCoordinate
  let searchCoordinateBeforeGoal: SearchCoordinate
  let searchCoordinateGoal: SearchCoordinate

  beforeEach(() => {
    searchCoordinateStart = new SearchCoordinate(1, 2, null, null, 0, 3)
    searchCoordinateAfterStart = new SearchCoordinate(2, 2, 1, 2, 1, 2)
    searchCoordinateBeforeGoal = new SearchCoordinate(3, 2, 2, 2, 2, 1)
    searchCoordinateGoal = new SearchCoordinate(3, 1, 3, 2, 3, 0)

    newPathMap = new PathMap()
    newPathMap.addSearchCoordinate(searchCoordinateStart)
    newPathMap.addSearchCoordinate(searchCoordinateAfterStart)
    newPathMap.addSearchCoordinate(searchCoordinateBeforeGoal)
    newPathMap.addSearchCoordinate(searchCoordinateGoal)
  })

  it('are not empty', () => {
    expect(newPathMap.isEmpty()).to.be.false
  })

  it('know the number of search coordinates', () => {
    expect(newPathMap.getNumberOfSearchCoordinates()).to.equal(4)
  })

  it('can retrieve the Search Coordinate at a given Coordinate', () => {
    const existingSearchCoordinate = newPathMap.getSearchCoordinateAtCoordinate(
      new Coordinate(3, 2)
    )
    expect(existingSearchCoordinate).to.equal(searchCoordinateBeforeGoal)
  })

  it('can remove existing search coordinates', () => {
    newPathMap.removeSearchCoordinate(new Coordinate(3, 2))
    const existingSearchCoordinate = newPathMap.getSearchCoordinateAtCoordinate(
      new Coordinate(3, 2)
    )
    expect(existingSearchCoordinate).to.be.undefined
  })

  it('can generate Paths based on an existing search coordinate', () => {
    const pathToGoal = newPathMap.generatePathToCoordinate(searchCoordinateGoal)

    expect(pathToGoal.getNumberOfCoordinates()).to.equal(4)
    expect(pathToGoal.getHeadCoordinate()).to.eql(searchCoordinateGoal)
  })

  it('returns undefined if it tries to generate a Path from a nonexistent coordinate', () => {
    const pathToGoal = newPathMap.generatePathToCoordinate(new Coordinate(-1, 9001))
    expect(pathToGoal).to.be.undefined
  })

  it('Can return all added coordinates', () => {
    const allCoordinates = newPathMap.getAllCoordinates()

    expect(allCoordinates.length).to.equal(4)
    expect(allCoordinates).to.include(searchCoordinateStart)
    expect(allCoordinates).to.include(searchCoordinateAfterStart)
    expect(allCoordinates).to.include(searchCoordinateBeforeGoal)
    expect(allCoordinates).to.include(searchCoordinateGoal)
  })
})