import {expect} from 'chai'
import {Coordinate, Path} from "../src/mapMeasurement";
import {PathMap} from "../src/pathMap";

describe('PathMaps are created', () => {
  it('with no Paths and be empty', () => {
    const blankPathMap = new PathMap()
    expect(blankPathMap.isEmpty()).to.be.true
  })

  it('from multiple Paths', () => {
    const pathsToInclude = new Array<Path> (
      new Path (new Coordinate(0, 0)),
      new Path (new Coordinate(0, 1)),
    )

    const pathMapWithPaths = PathMap.newPathMapByArrayOfPaths(pathsToInclude)
    expect(pathMapWithPaths.isEmpty()).to.be.false
  })

  it('by cloning another PathMap', () => {
    const pathsToInclude = new Array<Path> (
      new Path (new Coordinate(0, 0)),
      new Path (new Coordinate(0, 1)),
    )

    const pathMapWithPaths = PathMap.newPathMapByArrayOfPaths(pathsToInclude)

    const clonedPathMap = pathMapWithPaths.clone()
    expect(clonedPathMap.isEmpty()).to.be.false
    expect(clonedPathMap.getNumberOfPaths()).to.equal(pathMapWithPaths.getNumberOfPaths())
    expect(clonedPathMap.getAllCoordinates().length).to.equal(pathMapWithPaths.getAllCoordinates().length)
    expect(clonedPathMap).to.not.equal(pathMapWithPaths)
  })
})

describe('PathMaps can introspect', () => {
  let tiltedSquarePathMap: PathMap
  let donutPathMap: PathMap
  let twoRowPathMap: PathMap

  beforeEach(() => {
    const pathsToInclude = new Array<Path> (
      new Path (new Coordinate(0, 0)),
      new Path (new Coordinate(0, 1)),
      new Path (new Coordinate(0, 2)),

      new Path (new Coordinate(1, 0)),
      new Path (new Coordinate(1, 1)),
      new Path (new Coordinate(1, 2)),

      new Path (new Coordinate(2, 1)),
      new Path (new Coordinate(2, 2)),
      new Path (new Coordinate(2, 3)),
    )

    tiltedSquarePathMap = PathMap.newPathMapByArrayOfPaths(pathsToInclude)

    const holeInTheMiddle = new Array<Path> (
      new Path (new Coordinate(0, 0)),
      new Path (new Coordinate(0, 1)),
      new Path (new Coordinate(0, 2)),

      new Path (new Coordinate(1, 0)),
      new Path (new Coordinate(1, 2)),

      new Path (new Coordinate(2, 1)),
      new Path (new Coordinate(2, 2)),
      new Path (new Coordinate(2, 3)),
    )

    donutPathMap = PathMap.newPathMapByArrayOfPaths(holeInTheMiddle)

    const topTwoRowsOfPaths = new Array<Path> (
      new Path (new Coordinate(1, 0)),
      new Path (new Coordinate(1, 1)),
      new Path (new Coordinate(1, 2)),

      new Path (new Coordinate(2, 1)),
      new Path (new Coordinate(2, 2)),
      new Path (new Coordinate(2, 3)),
    )

    twoRowPathMap = PathMap.newPathMapByArrayOfPaths(topTwoRowsOfPaths)
  })

  it ('and indicate the number of Paths', () => {
    expect(tiltedSquarePathMap.getNumberOfPaths()).to.equal(9)
  })

  it('will indicate if there is no Path for a given Coordinate', () => {
    expect(tiltedSquarePathMap.getPathForCoordinate(new Coordinate(3, 6))).to.be.undefined
  })

  it('and return the Path used for a give Coordinate', () => {
    const uprightPath: Path = tiltedSquarePathMap.getPathForCoordinate(new Coordinate(2, 1))
    expect(uprightPath.getNumberOfCoordinates()).to.equal(1)
    expect(uprightPath.getHeadCoordinate().getRow()).to.equal(2)
    expect(uprightPath.getHeadCoordinate().getColumn()).to.equal(1)
    expect(uprightPath.getMovementCostSpent()).to.equal(0)
  })

  it('can indicate all of the coordinates in the PathMap', () => {
    const allCoordinatesInPathMap: Array<Coordinate> = tiltedSquarePathMap.getAllCoordinates()
    expect(allCoordinatesInPathMap.length).to.equal(9)
    expect(allCoordinatesInPathMap.some((coordinate) => {
      return coordinate.equals(new Coordinate(2, 1))
      })
    ).to.be.true
  })
})

describe('PathMaps can change info after creation', () => {
  let newPathMap: PathMap
  let pathsToInclude: Array<Path>
  
  beforeEach(() => {
    pathsToInclude = new Array<Path> (
      new Path (new Coordinate(0, 0)),
      new Path (new Coordinate(0, 1)),
    )

    newPathMap = PathMap.newPathMapByArrayOfPaths(pathsToInclude)
  })
  
  it('and add a Path for an empty Coordinate', () => {
    newPathMap.setPath(
      new Path (new Coordinate(0, 2))
    )

    expect(newPathMap.getNumberOfPaths()).to.equal(3)
  })

  it('and overwrite one Path at a given Coordinate for another', () => {
    const newPath = new Path (new Coordinate(0, 0))
    newPath.addCoordinate(new Coordinate(0, 1), 1)

    newPathMap.setPath(newPath)

    expect(newPathMap.getNumberOfPaths()).to.equal(2)

    const alteredPath = newPathMap.getPathForCoordinate(new Coordinate(0 , 1))
    expect(alteredPath.getNumberOfCoordinates()).to.equal(2)
    expect(alteredPath.getHeadCoordinate().getRow()).to.equal(0)
    expect(alteredPath.getHeadCoordinate().getColumn()).to.equal(1)
    expect(alteredPath.getMovementCostSpent()).to.equal(1)
  })

  it('and remove the Path for a given Coordinate', () => {
    newPathMap.removePathAtCoordinate(new Coordinate(0, 1))
    expect(newPathMap.getNumberOfPaths()).to.equal(1)
    expect(newPathMap.getPathForCoordinate(new Coordinate(0, 1))).to.be.undefined
  })
})