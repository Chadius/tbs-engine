import {Coordinate, Path} from "./mapMeasurement";
import {BattleMapFunctions} from "./battleMap";

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

    const outlineCoordinates = this.getOutlineCoordinates()
    const visitedCoordinateKeys = new Set(
      outlineCoordinates.map( coordinate => {
        return coordinate.getLocationKey()
      })
    )

    const newPathsForNewPathMap = new Array<Path> ()

    const helperAddUnvisitedNeighborPathsWithinRange = (
      currentPath: Path,
      newPathsForNewPathMap: Array<Path>,
      visitedCoordinateKeys: Set<string>,
      currentDistanceFromOutline: number): void => {

      currentDistanceFromOutline = currentDistanceFromOutline + 1
      if (currentDistanceFromOutline > range) {
        return
      }

      const unvisitedNeighbors = BattleMapFunctions.getNeighborCoordinates(currentPath.getHeadCoordinate())
        .filter(coordinate => {
          const locationKey = coordinate.getLocationKey()
          if(visitedCoordinateKeys.has(locationKey)) {
            return false
          }
          return true
        })

      unvisitedNeighbors.forEach(neighbor => {
        const locationKey = neighbor.getLocationKey()
        visitedCoordinateKeys.add(locationKey)

        const newPath = currentPath.cloneAndAddCoordinate(neighbor, 1)
        newPathsForNewPathMap.push(newPath)

        if (currentDistanceFromOutline < range) {
          helperAddUnvisitedNeighborPathsWithinRange(newPath, newPathsForNewPathMap, visitedCoordinateKeys, currentDistanceFromOutline)
        }
      })
    }

    outlineCoordinates.forEach(outlineCoordinate => {
      const currentPath = this.getPathForCoordinate(outlineCoordinate)
      helperAddUnvisitedNeighborPathsWithinRange(currentPath, newPathsForNewPathMap, visitedCoordinateKeys, 0)
    })

    return PathMap.newPathMapByArrayOfPaths(newPathsForNewPathMap)
  }
}