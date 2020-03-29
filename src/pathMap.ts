import {Coordinate, Path} from "./mapMeasurement";
import {BattleMapFunctions} from "./battleMap";
import {BaseSearchHistoryContext} from "./searchStrategies/SearchStrategy";

export class PathMap {
  pathsByCoordinateLocationKey: Map<string, Path>

  constructor() {
    this.pathsByCoordinateLocationKey = new Map<string, Path> ()
  }

  static newPathMapByArrayOfPaths(pathsToInclude: Array<Path>): PathMap {
    const newPathMap = new PathMap()

    pathsToInclude.forEach((path: Path) => {
      newPathMap.setPath(path)
    })

    return newPathMap
  }

  isEmpty(): boolean {
    return this.getNumberOfPaths() === 0
  }

  setPath(path: Path): void {
    const locationKeyFromHeadOfPath = path.getHeadCoordinate().getLocationKey()
    this.pathsByCoordinateLocationKey.set(locationKeyFromHeadOfPath, path)
  }

  getNumberOfPaths(): number{
    return this.pathsByCoordinateLocationKey.size
  }

  getPathForCoordinate(coordinate: Coordinate) {
    const locationKey = coordinate.getLocationKey()
    if (this.pathsByCoordinateLocationKey.has(locationKey)) {
      return this.pathsByCoordinateLocationKey.get(locationKey).clone()
    }
    return undefined
  }

  removePathAtCoordinate(coordinate: Coordinate): void {
    const locationKey = coordinate.getLocationKey()
    this.pathsByCoordinateLocationKey.delete(locationKey)
  }

  getAllCoordinates(): Array<Coordinate> {
    const coordinates = new Array<Coordinate>()

    const pathIterator = this.pathsByCoordinateLocationKey.values()

    let nextPath = pathIterator.next()
    while(!nextPath.done) {
      coordinates.push(nextPath.value.getHeadCoordinate())
      nextPath = pathIterator.next()
    }

    return coordinates
  }

  getBoundingBox(): Array<Coordinate> {
    let leftSide = undefined
    let rightSide = undefined

    let upSide = undefined
    let downSide = undefined

    const pathIterator = this.pathsByCoordinateLocationKey.values()

    let nextPath = pathIterator.next()
    while(!nextPath.done) {
      const headCoordinate = nextPath.value.getHeadCoordinate()
      if (leftSide === undefined || headCoordinate.getColumn() < leftSide) {
        leftSide = headCoordinate.getColumn()
      }

      if (rightSide === undefined || headCoordinate.getColumn() > rightSide) {
        rightSide = headCoordinate.getColumn()
      }

      if (downSide === undefined || headCoordinate.getRow() < downSide) {
        downSide = headCoordinate.getRow()
      }

      if (upSide === undefined || headCoordinate.getRow() > upSide) {
        upSide = headCoordinate.getRow()
      }

      nextPath = pathIterator.next()
    }

    if ([leftSide, rightSide, upSide, downSide].includes(undefined)) {
      return undefined
    }

    return new Array<Coordinate>(
      new Coordinate(downSide, leftSide),
      new Coordinate(upSide, rightSide),
    )
  }

  getSmallestMapDimensions(): {row: number; column: number} {
    const boundingBox = this.getBoundingBox()

    if(!boundingBox) {
      return undefined
    }

    return {
      row: boundingBox[1].getRow(),
      column: boundingBox[1].getColumn(),
    }
  }

  getOutlineCoordinates(): Array<Coordinate> {
    const pathMapCoordinates = this.getAllCoordinates()
    const pathMapCoordinateKeys = pathMapCoordinates.map(
      coordinate => {
        return coordinate.getLocationKey()
      }
    )

    return pathMapCoordinates.filter(coordinate => {
      const neighborCoordinates = BattleMapFunctions.getNeighborCoordinates(coordinate)
      const neighborCoordinatesKeys = neighborCoordinates.map(
        coordinate => {
          return coordinate.getLocationKey()
        }
      )

      const everyNeighborIsInThePathMap = neighborCoordinatesKeys
        .every(neighborCoordinateKey => {
          return pathMapCoordinateKeys
            .includes(neighborCoordinateKey)
      })
      return (everyNeighborIsInThePathMap === false)
    })
  }

  clone(): PathMap {
    const newPathMap = new PathMap()
    const locationKeyPathIterator = this.pathsByCoordinateLocationKey.values()

    let nextLocationKeyPathPair = locationKeyPathIterator.next()
    while(!nextLocationKeyPathPair.done) {
      newPathMap.setPath(nextLocationKeyPathPair.value.clone())

      nextLocationKeyPathPair = locationKeyPathIterator.next()
    }

    return newPathMap
  }

  expandBorder(range: number): PathMap {
    if (range < 0) {
      return undefined
    }

    if (range < 1) {
      return this.clone()
    }

    // Add all of the Paths from the sourcePathMap into a working array.
    // Create a visited list. Initialize with the sourcePathMap coordinates. This will also add the feathered locations.

    // For each Path in the sourcePathMap,
    //// currentPath is one of the sourcePathMap Paths.
    //// Create an array to store the resulting paths.
    //// Call recursive function, pass in the array, visited, the current feather distance (0) and the path to work on (currentPath)

    ////// Add 1 to the feather distance. Stop if it's more than the range.
    ////// get the neighbors of the working path
    ////// - If the neighbor is already visited, stop
    ////// For each neighbor,
    //////// Add the neighbor location to visited.
    //////// Make a cloned path, and add the neighbor.
    //////// Add the cloned path to the result.
    //////// Now recurse on the neighbor if the feather distance isn't too far.

    // get all Paths and create a PathMap from them.

    return undefined;
  }
}