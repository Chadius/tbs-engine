import {Coordinate, Path} from "./mapMeasurement";
import {BattleMapFunctions} from "./battleMap";

// TODO: Rebuild PathMap
/*
PathMap should be a vector field and a cost field of SearchCoordinates, organized by their location key.
-isEmpty
-addSearchCoordinate
-getNumberOfSearchCoordinates
-getSearchCoordinateAtCoordinate
-generatePathFromCoordinate
-removeSearchCoordinate
-getAllCoordinates
-clone
 */

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
}