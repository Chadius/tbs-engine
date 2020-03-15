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

    // Initialize
    const pathFromStartToEnd = new Path(startCoordinate)
    const visitedLocations = new Set()
    visitedLocations.add(battleMap.coordinatesToLocationIndex(startCoordinate))

    const pathsToSearch = new TinyQueue<Path> ([], pathCompare)
    pathsToSearch.push(pathFromStartToEnd)

    while(pathsToSearch.length > 0) {
      // If queue is empty, destination is unreachable. Stop.
      const currentPath = pathsToSearch.pop()

      visitedLocations.add(battleMap.coordinatesToLocationIndex(currentPath.getCurrentCoordinates()))

      if (currentPath.getCurrentCoordinates().equals(endCoordinate)) {
        return currentPath
      }

      // Discover new neighbors to search
      const neighbors = battleMap.getNeighbors(currentPath.getCurrentCoordinates())
        .filter((neighbor) => {
          const locationIndex = battleMap.coordinatesToLocationIndex(neighbor)
          return !(visitedLocations.has(locationIndex))
        })

      // Make new paths using filtered neighbors
      neighbors.forEach((neighbor) => {
        const movementCostToNeighbor = 1
        const newPathToSearch = currentPath.clone()
        newPathToSearch.addCoordinate(neighbor, movementCostToNeighbor)
        pathsToSearch.push(newPathToSearch)
      })
    }

    return pathFromStartToEnd
  },

  hasValidCoordinates(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): boolean {
    return (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate))
  },
}