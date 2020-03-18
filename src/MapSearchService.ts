import {Coordinate, Path} from "./mapMeasurement";
import {BattleMap} from "./battleMap";
import TinyQueue from "tinyqueue";

export const pathCompare = (a: Path, b: Path): number => {
  const pathAMovementCost = a.getMovementCostSpent()
  const pathBMovementCost = b.getMovementCostSpent()
  if (pathAMovementCost < pathBMovementCost) {
    return -1
  }
  if (pathAMovementCost > pathBMovementCost) {
    return 1
  }
  return 0
}

export const MapSearchService = {
  calculatePath(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): Path {
    if(!MapSearchService.hasValidCoordinates(battleMap, startCoordinate, endCoordinate)) {
      return null
    }

    const pathsToSearch = MapSearchService.initializeSearchHistory(startCoordinate)

    const visitedLocations = new Set<number>()
    visitedLocations.add(battleMap.coordinatesToLocationIndex(startCoordinate))

    while(pathsToSearch.length > 0) {
      const currentPath = pathsToSearch.pop()

      MapSearchService.markPathAsVisited(battleMap, currentPath, visitedLocations)

      const pathIsAtDestination = (currentPath.getCurrentCoordinates().equals(endCoordinate))
      if (pathIsAtDestination) {
        return currentPath
      }

      const neighbors = MapSearchService.getValidNeighbors(battleMap, currentPath, visitedLocations)
      MapSearchService.addNeighbors(battleMap, currentPath, pathsToSearch, neighbors)
    }

    return null
  },

  markPathAsVisited(battleMap: BattleMap, currentPath: Path, visitedLocations: Set<number>) {
    const currentPathLocationIndex = battleMap.coordinatesToLocationIndex(
      currentPath.getCurrentCoordinates()
    )

    visitedLocations.add(currentPathLocationIndex)
  },

  initializeSearchHistory(startCoordinate: Coordinate) {
    const pathsToSearch = new TinyQueue<Path> ([], pathCompare)
    pathsToSearch.push(new Path(startCoordinate))
    return pathsToSearch
  },

  getValidNeighbors(battleMap: BattleMap, currentPath: Path, visitedLocations: Set<number>) {
    const neighbors = battleMap.getNeighbors(currentPath.getCurrentCoordinates())
      .filter((neighbor) => {
        const locationIndex = battleMap.coordinatesToLocationIndex(neighbor)
        return !(visitedLocations.has(locationIndex))
      })
    return neighbors
  },

  addNeighbors(
    battleMap: BattleMap,
    currentPath: Path,
    pathsToSearch: TinyQueue<Path>,
    neighbors: Array<Coordinate>
  ): void {
    // Make new paths using filtered neighbors
    neighbors.forEach((neighbor) => {
      const movementCostToNeighbor = 1
      const newPathToSearch = currentPath.clone()
      newPathToSearch.addCoordinate(neighbor, movementCostToNeighbor)
      pathsToSearch.push(newPathToSearch)
    })
  },

  hasValidCoordinates(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): boolean {
    return (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate))
  },
}