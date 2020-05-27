import {SearchCoordinate, Path, Coordinate} from "../mapMeasurement";
import TinyQueue from "tinyqueue";
import {SearchHistoryContext, SearchStrategy} from "./searchStrategy";

export const lowerMoveCostIsFirst = (a: Path, b: Path): number => {
  const pathAMovementCost = a.getTotalMovementCostSpent()
  const pathBMovementCost = b.getTotalMovementCostSpent()
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
  searchHistoryContext.pathsToSearch.push(
    new Path(
      new SearchCoordinate(
        startCoordinate.getRow(),
        startCoordinate.getColumn(),
        null,
        null,
        0,
        0
      )
    )
  )
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
  const pathIsAtDestination = (currentPath.getHeadCoordinate().getLocationKey() === searchHistoryContext.endCoordinate.getLocationKey())
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
    return currentPath.cloneAndAddCoordinate(
      new SearchCoordinate(
        neighbor.getRow(),
        neighbor.getColumn(),
        currentPath.getHeadCoordinate().getRow(),
        currentPath.getHeadCoordinate().getColumn(),
        movementCostToNeighbor,
        0,
      )
    )
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

  getNextFrontierCoordinate(searchHistoryContext: SearchHistoryContext): Path {
    return popNextPathFromQueue(searchHistoryContext)
  }

  markCoordinateAsVisited(searchHistoryContext: SearchHistoryContext, currentPath: Path): void {
    return addPathLocationToVisited(searchHistoryContext, currentPath)
  }

  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path} {
    return endIfPathIsAtDestination(searchHistoryContext, currentPath)
  }

  findNewNeighborsForCoordinate(searchHistoryContext: SearchHistoryContext, currentPath: Path): Array<Coordinate> {
    return getUnvisitedCoordinatesNextToPathHead(searchHistoryContext, currentPath)
  }

  markNeighborOrigins(searchHistoryContext: SearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path> {
    return addNeighborsToPathAndCreateNewPaths(searchHistoryContext, neighbors, currentPath)
  }

  addNewCoordinatesToFrontier(searchHistoryContext: SearchHistoryContext, newPaths: Array<Path>): void {
    return addNewPathsToSearchQueue(searchHistoryContext, newPaths)
  }

  noCoordinatesRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}