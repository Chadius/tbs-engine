import {SearchCoordinate, Path} from "../mapMeasurement";
import TinyQueue from "tinyqueue";
import {BaseSearchHistoryContext, SearchHistoryContext, SearchStrategy} from "./searchStrategy";
import {PathMap} from "../pathMap";

export const lowerMoveCostIsFirst = (a: SearchCoordinate, b: SearchCoordinate): number => {
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
  const {startCoordinate} = searchHistoryContext

  const startSearchCoordinate = new SearchCoordinate(
    startCoordinate.getRow(),
    startCoordinate.getColumn(),
    null,
    null,
    0,
    0
  )

  searchHistoryContext.frontierCoordinates = new TinyQueue<SearchCoordinate> ([], lowerMoveCostIsFirst)
  searchHistoryContext.frontierCoordinates.push(
    startSearchCoordinate
  )
  searchHistoryContext.visitedCoordinatesAndMovementCosts = new PathMap()
  searchHistoryContext.visitedCoordinatesAndMovementCosts.addSearchCoordinate(startSearchCoordinate)
}

export const areThereMoreCoordinatesToSearch = (searchHistoryContext: SearchHistoryContext): boolean => {
  return (searchHistoryContext.frontierCoordinates.length > 0)
}

export const popNextSearchCoordinateFromQueue = (searchHistoryContext: SearchHistoryContext): SearchCoordinate => {
  const coordinateWithLowestTotalMovementCost = searchHistoryContext.frontierCoordinates.pop()
  return coordinateWithLowestTotalMovementCost
}

export const addCoordinateToVisited = (searchHistoryContext: SearchHistoryContext, currentCoordinate: SearchCoordinate): void => {
  searchHistoryContext.visitedCoordinatesAndMovementCosts.addSearchCoordinate(currentCoordinate)
}

export const endIfCoordinateIsAtDestination = (searchHistoryContext: SearchHistoryContext, currentCoordinate: SearchCoordinate): {shouldExitEarly: boolean; returnVal: Path} => {
  const pathIsAtDestination = (currentCoordinate.getLocationKey() === searchHistoryContext.endCoordinate.getLocationKey())
  if (pathIsAtDestination) {
    const currentPath = searchHistoryContext.visitedCoordinatesAndMovementCosts.generatePathToCoordinate(currentCoordinate)
    return {shouldExitEarly: true, returnVal: currentPath}
  }
  return {shouldExitEarly: false, returnVal: undefined }
}

export const getUnvisitedCoordinatesNextToFrontier = (searchHistoryContext: SearchHistoryContext, frontierCoordinate: SearchCoordinate): Array<SearchCoordinate> => {
  const neighbors = searchHistoryContext.battleMap.getOnMapNeighbors(frontierCoordinate)
    .filter((neighbor) => {
      return !(searchHistoryContext.visitedCoordinatesAndMovementCosts.hasCoordinate(neighbor))
    })
  return neighbors.map(neighbor => {
    return new SearchCoordinate(
      neighbor.getRow(),
      neighbor.getColumn(),
      frontierCoordinate.getRow(),
      frontierCoordinate.getColumn(),
      1,
      0,
      frontierCoordinate.getMovementCostSpent() + 1
    )
  })
}

export const addNewCoordinatesToFrontier = (searchHistoryContext: BaseSearchHistoryContext, newNeighbors: Array<SearchCoordinate>): void => {
  newNeighbors.forEach((neighbor) => {
    searchHistoryContext.frontierCoordinates.push(neighbor)
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
    return areThereMoreCoordinatesToSearch(searchHistoryContext)
  }

  getNextFrontierCoordinate(searchHistoryContext: SearchHistoryContext): SearchCoordinate {
    return popNextSearchCoordinateFromQueue(searchHistoryContext)
  }

  markCoordinateAsVisited(searchHistoryContext: BaseSearchHistoryContext, currentCoordinate: SearchCoordinate): void {
    return addCoordinateToVisited(searchHistoryContext, currentCoordinate)
  }

  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentCoordinate: SearchCoordinate): {shouldExitEarly: boolean; returnVal: Path} {
    return endIfCoordinateIsAtDestination(searchHistoryContext, currentCoordinate)
  }

  findNewNeighborsForCoordinate(searchHistoryContext: SearchHistoryContext, currentCoordinate: SearchCoordinate): Array<SearchCoordinate> {
    return getUnvisitedCoordinatesNextToFrontier(searchHistoryContext, currentCoordinate)
  }

  addNewCoordinatesToFrontier(searchHistoryContext: BaseSearchHistoryContext, newNeighbors: Array<SearchCoordinate>): void {
    return addNewCoordinatesToFrontier(searchHistoryContext, newNeighbors)
  }

  noCoordinatesRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}