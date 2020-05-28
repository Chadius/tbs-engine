import {BaseCoordinate, Coordinate, Path, SearchCoordinate} from "./mapMeasurement";

export class PathMap {
  searchCoordinatesByLocationKey: Map<string, SearchCoordinate>

  constructor() {
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

    while(searchCoordinate) {
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
    pathCoordinatesFromDestinationToStart.reverse().forEach((searchCoordinate, index) => {
      newPath.addSearchCoordinate(searchCoordinate)
    })
    return newPath
  }

  removeSearchCoordinate(coordinate: Coordinate): void {
    const locationKey = coordinate.getLocationKey()
    this.searchCoordinatesByLocationKey.delete(locationKey)
  }

  hasCoordinate(coordinate: BaseCoordinate): boolean {
    const locationKey = coordinate.getLocationKey()
    return this.searchCoordinatesByLocationKey.has(locationKey)
  }

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