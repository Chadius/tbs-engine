import {Coordinate, Path} from "./mapMeasurement";

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
}