import {Coordinate, Path} from "../mapMeasurement";
import TinyQueue from "tinyqueue";
import {SearchHistoryContext, SearchStrategy} from "./searchStrategy";

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

export const checkIfCoordinatesAreOffMap = (searchHistoryContext: SearchHistoryContext): {shouldExitEarly: boolean; returnVal: null} => {
  const {battleMap, startCoordinate, endCoordinate} = searchHistoryContext
  if (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate)) {
    return { shouldExitEarly: false, returnVal: undefined }
  }
  return { shouldExitEarly: true, returnVal: null }
}

export const initalizeSearchHistoryWithPriorityQueue = (searchHistoryContext: SearchHistoryContext): void => {
  const {startCoordinate, battleMap, visitedLocations} = searchHistoryContext

  searchHistoryContext.pathsToSearch = new TinyQueue<Path> ([], lowerMoveCostIsFirst)
  searchHistoryContext.pathsToSearch.push(new Path(startCoordinate))
  visitedLocations.clear()
  visitedLocations.add(
    startCoordinate.getLocationKey()
  )
}

export const morePathsToSearch = (searchHistoryContext: SearchHistoryContext): boolean => {
  return (searchHistoryContext.pathsToSearch.length > 0)
}

export const popNextPathFromQueue = (searchHistoryContext: SearchHistoryContext): Path => {
  return searchHistoryContext.pathsToSearch.pop()
}

export const addPathLocationToVisited = (searchHistoryContext: SearchHistoryContext, currentPath: Path): void => {
  searchHistoryContext.visitedLocations.add(currentPath.getHeadCoordinate().getLocationKey())
}

export const endIfPathIsAtDestination = (searchHistoryContext: SearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path} => {
  const pathIsAtDestination = (currentPath.getHeadCoordinate().equals(searchHistoryContext.endCoordinate))
  if (pathIsAtDestination) {
    return {shouldExitEarly: true, returnVal: currentPath}
  }
  return {shouldExitEarly: false, returnVal: undefined }
}

export const getUnvisitedCoordinatesNextToPathHead = (searchHistoryContext: SearchHistoryContext, currentPath: Path): Array<Coordinate> => {
  const neighbors = searchHistoryContext.battleMap.getOnMapNeighbors(currentPath.getHeadCoordinate())
    .filter((neighbor) => {
      const locationKey = neighbor.getLocationKey()
      return !(searchHistoryContext.visitedLocations.has(locationKey))
    })
  return neighbors
}

export const addNeighborsToPathAndCreateNewPaths = (searchHistoryContext: SearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path> => {
  return neighbors.map((neighbor) => {
    const movementCostToNeighbor = 1
    return currentPath.cloneAndAddCoordinate(neighbor, movementCostToNeighbor)
  })
}

export const addNewPathsToSearchQueue = (searchHistoryContext: SearchHistoryContext, newPaths: Array<Path>): void => {
  newPaths.forEach((newPath) => {
    searchHistoryContext.pathsToSearch.push(newPath)
  })
}

export class StraightLineStrategy implements SearchStrategy {
  checkForEarlyExitCondition(searchHistoryContext: SearchHistoryContext): {shouldExitEarly: boolean; returnVal: null} {
    return checkIfCoordinatesAreOffMap(searchHistoryContext)
  }

  initalizeSearchHistory(searchHistoryContext: SearchHistoryContext): void {
    return initalizeSearchHistoryWithPriorityQueue(searchHistoryContext)
  }

  shouldContinueSearching(searchHistoryContext: SearchHistoryContext): boolean {
    return morePathsToSearch(searchHistoryContext)
  }

  getNextPath(searchHistoryContext: SearchHistoryContext): Path {
    return popNextPathFromQueue(searchHistoryContext)
  }

  markPathAsVisited(searchHistoryContext: SearchHistoryContext, currentPath: Path): void {
    return addPathLocationToVisited(searchHistoryContext, currentPath)
  }

  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path} {
    return endIfPathIsAtDestination(searchHistoryContext, currentPath)
  }

  findNewNeighborsForPath(searchHistoryContext: SearchHistoryContext, currentPath: Path): Array<Coordinate> {
    return getUnvisitedCoordinatesNextToPathHead(searchHistoryContext, currentPath)
  }

  addNeighborsToPath(searchHistoryContext: SearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path> {
    return addNeighborsToPathAndCreateNewPaths(searchHistoryContext, neighbors, currentPath)
  }

  addNewPathsToSearch(searchHistoryContext: SearchHistoryContext, newPaths: Array<Path>): void {
    return addNewPathsToSearchQueue(searchHistoryContext, newPaths)
  }

  noPathsRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}