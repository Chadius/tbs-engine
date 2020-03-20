import {Coordinate, Path} from "../mapMeasurement";
import TinyQueue from "tinyqueue";
import {SearchHistoryContext, SearchStrategy} from "./SearchStrategy";

export const lowerMoveCostIsFirst = (a: Path, b: Path): number => {
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

export class StraightLineStrategy implements SearchStrategy {
  checkForEarlyExitCondition(searchHistoryContext: SearchHistoryContext): {shouldExitEarly: boolean; returnVal: null} {
    const {battleMap, startCoordinate, endCoordinate} = searchHistoryContext
    if (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate)) {
      return { shouldExitEarly: false, returnVal: undefined }
    }
    return { shouldExitEarly: true, returnVal: null }
  }

  initalizeSearchHistory(searchHistoryContext: SearchHistoryContext): void {
    const {startCoordinate, battleMap, visitedLocations} = searchHistoryContext

    searchHistoryContext.pathsToSearch = new TinyQueue<Path> ([], lowerMoveCostIsFirst)
    searchHistoryContext.pathsToSearch.push(new Path(startCoordinate))
    visitedLocations.clear()
    visitedLocations.add(
      battleMap.coordinatesToLocationIndex
      (startCoordinate)
    )
  }

  shouldContinueSearching(searchHistoryContext: SearchHistoryContext): boolean {
    return (searchHistoryContext.pathsToSearch.length > 0)
  }

  getNextPath(searchHistoryContext: SearchHistoryContext): Path {
    return searchHistoryContext.pathsToSearch.pop()
  }

  markPathAsVisited(searchHistoryContext: SearchHistoryContext, currentPath: Path): void {
    const currentPathLocationIndex = searchHistoryContext.battleMap.coordinatesToLocationIndex(
      currentPath.getCurrentCoordinates()
    )

    searchHistoryContext.visitedLocations.add(currentPathLocationIndex)
  }

  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path} {
    const pathIsAtDestination = (currentPath.getCurrentCoordinates().equals(searchHistoryContext.endCoordinate))
    if (pathIsAtDestination) {
      return {shouldExitEarly: true, returnVal: currentPath}
    }
    return {shouldExitEarly: false, returnVal: undefined }
  }

  findNewNeighborsForPath(searchHistoryContext: SearchHistoryContext, currentPath: Path): Array<Coordinate> {
    const neighbors = searchHistoryContext.battleMap.getNeighbors(currentPath.getCurrentCoordinates())
      .filter((neighbor) => {
        const locationIndex = searchHistoryContext.battleMap.coordinatesToLocationIndex(neighbor)
        return !(searchHistoryContext.visitedLocations.has(locationIndex))
      })
    return neighbors
  }

  addNeighborsToPath(searchHistoryContext: SearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path> {
    return neighbors.map((neighbor) => {
      const movementCostToNeighbor = 1
      const newPathToSearch = currentPath.clone()
      newPathToSearch.addCoordinate(neighbor, movementCostToNeighbor)
      return newPathToSearch
    })
  }

  addNewPathsToSearch(searchHistoryContext: SearchHistoryContext, newPaths: Array<Path>): void {
    newPaths.forEach((newPath) => {
      searchHistoryContext.pathsToSearch.push(newPath)
    })
  }

  noPathsRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}