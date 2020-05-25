import {Coordinate, Path, SearchCoordinate} from "./mapMeasurement";

export class PathMap {
  searchCoordinatesByLocationKey: Map<string, SearchCoordinate>
  pathsByCoordinateLocationKey: Map<string, Path> // TODO remove this

  constructor() {
    this.pathsByCoordinateLocationKey = new Map<string, Path> () // TODO Delete me

    this.searchCoordinatesByLocationKey = new Map<string, SearchCoordinate> ()
  }

  isEmpty(): boolean {
    return this.getNumberOfSearchCoordinates() === 0
  }

  getNumberOfSearchCoordinates(): number {
    return this.searchCoordinatesByLocationKey.size
  }

  addSearchCoordinate(searchCoordinate: SearchCoordinate): void {
    const locationKey = searchCoordinate.getLocationKey()
    this.searchCoordinatesByLocationKey.set(locationKey, searchCoordinate)
  }

  getSearchCoordinateAtCoordinate(coordinate: Coordinate): SearchCoordinate | undefined {
    const locationKey = coordinate.getLocationKey()
    if (this.searchCoordinatesByLocationKey.has(locationKey)) {
      return this.searchCoordinatesByLocationKey.get(locationKey).clone()
    }
    return undefined
  }

  generatePathToCoordinate(destination: Coordinate): Path | undefined {
    const searchCoordinateAtDestination = this.getSearchCoordinateAtCoordinate(destination)
    if (searchCoordinateAtDestination === undefined) {
      return undefined
    }

    const pathCoordinatesFromDestinationToStart = new Array<SearchCoordinate>()

    let searchCoordinate = searchCoordinateAtDestination
    pathCoordinatesFromDestinationToStart.push(searchCoordinate)
    while(searchCoordinate && searchCoordinate.isOrigin() === false) {
      pathCoordinatesFromDestinationToStart.push(searchCoordinate)
      const previousSearchCoordinate = this.getSearchCoordinateAtCoordinate(
        new Coordinate(
          searchCoordinate.getOriginRow(),
          searchCoordinate.getOriginColumn(),
        )
      )
      searchCoordinate = previousSearchCoordinate
    }

    const newPath = new Path()
    pathCoordinatesFromDestinationToStart.reverse().forEach((coordinate, index) => {
      newPath.addCoordinate(coordinate, coordinate.getMovementCostSpent()) // TODO movement cost? Maybe Path should have SearchCoordinates
    })
    return newPath
  }

  removeSearchCoordinate(coordinate: Coordinate): void {
    const locationKey = coordinate.getLocationKey()
    this.searchCoordinatesByLocationKey.delete(locationKey)
  }

  // TODO: Delete me
  setPath(path: Path): void {
    const locationKeyFromHeadOfPath = path.getHeadCoordinate().getLocationKey()
    this.pathsByCoordinateLocationKey.set(locationKeyFromHeadOfPath, path)
  }

  // TODO: Delete me
  getPathForCoordinate(coordinate: Coordinate) {
    const locationKey = coordinate.getLocationKey()
    if (this.pathsByCoordinateLocationKey.has(locationKey)) {
      return this.pathsByCoordinateLocationKey.get(locationKey).clone()
    }
    return undefined
  }

  // TODO: Delete me
  removePathAtCoordinate(coordinate: Coordinate): void {
    const locationKey = coordinate.getLocationKey()
    this.pathsByCoordinateLocationKey.delete(locationKey)
  }

  // TODO: Update this to get all SearchCoordinates.
  // TODO: Refactor opportunity: ICoordinate
  getAllCoordinates(): Array<SearchCoordinate> {
    const coordinates = new Array<SearchCoordinate>()

    const locationKeySearchCoordinateIterator = this.searchCoordinatesByLocationKey.values()
    let nextLocationKeySearchCoordinatePair = locationKeySearchCoordinateIterator.next()
    while(!nextLocationKeySearchCoordinatePair.done) {
      coordinates.push(nextLocationKeySearchCoordinatePair.value.clone())
      nextLocationKeySearchCoordinatePair = locationKeySearchCoordinateIterator.next()
    }

    return coordinates
  }

  clone(): PathMap {
    const newPathMap = new PathMap()
    const locationKeySearchCoordinateIterator = this.searchCoordinatesByLocationKey.values()

    let nextLocationKeySearchCoordinatePair = locationKeySearchCoordinateIterator.next()
    while(!nextLocationKeySearchCoordinatePair.done) {
      newPathMap.addSearchCoordinate(nextLocationKeySearchCoordinatePair.value.clone())
      nextLocationKeySearchCoordinatePair = locationKeySearchCoordinateIterator.next()
    }

    return newPathMap
  }
}