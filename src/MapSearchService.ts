import {Coordinate, Path} from "./mapMeasurement";
import {BattleMap} from "./battleMap";
import TinyQueue from "tinyqueue";

function pathCompare (a: Path, b: Path): number {
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

    const pathFromStartToEnd = new Path(startCoordinate)
    // const visitedLocations = new Set()
    // visitedLocations.add(battleMap.coordinatesToLocationIndex(startCoordinate))
    //
    // const pathsToSearch = new TinyQueue ([], pathCompare)
    //
    // while(visitedLocations.size > 0) {
    //   // If queue is empty, destination is unreachable. Stop.
    //   const currentPath = pathsToSearch.pop()
    //
    //   visitedLocations.add(battleMap.coordinatesToLocationIndex(currentPath.getCurrentCoordinates()))
    //
    //   if (currentPath.getCurrentCoordinates().equals(endCoordinate)) {
    //     return currentPath
    //   }
    //
    //   // Add neighbors as long as they haven't been already visited
    //   // const neighbors =
    // }

    return pathFromStartToEnd
  },

  hasValidCoordinates(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): boolean {
    return (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate))
  },
}