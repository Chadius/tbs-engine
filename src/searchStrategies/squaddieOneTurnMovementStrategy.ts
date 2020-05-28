import {Path, SearchCoordinate} from "../mapMeasurement";
import {SearchHistoryContext, SearchStrategy, SquaddieSearchHistoryContext} from "./searchStrategy";
import {
  addCoordinateToVisited,
  checkIfCoordinatesAreOffMap, endIfCoordinateIsAtDestination, getUnvisitedCoordinatesNextToFrontier,
  initalizeSearchHistoryWithPriorityQueue, areThereMoreCoordinatesToSearch, popNextSearchCoordinateFromQueue,
} from "./straightLineStrategy";

const addNeighborsToFrontierIfWithinMoverange = (searchHistoryContext: SquaddieSearchHistoryContext, neighbors: Array<SearchCoordinate>): void => {
  neighbors.forEach((newNeighbor) => {
    if (newNeighbor.getTotalMovementCostSpent() <= searchHistoryContext.squaddie.getCurrentMovePerTurn()) {
      searchHistoryContext.frontierCoordinates.push(newNeighbor)
    }
  })
}


export class SquaddieOneTurnMovementStrategy implements SearchStrategy {
  checkForEarlyExitCondition(searchHistoryContext: SearchHistoryContext): {shouldExitEarly: boolean; returnVal: null} {
    return checkIfCoordinatesAreOffMap(searchHistoryContext)
  }

  initalizeSearchHistory(searchHistoryContext: SearchHistoryContext): void {
    return initalizeSearchHistoryWithPriorityQueue(searchHistoryContext)
  }

  addNewCoordinatesToFrontier(searchHistoryContext: SquaddieSearchHistoryContext, neighbors: Array<SearchCoordinate>): void {
    return addNeighborsToFrontierIfWithinMoverange(searchHistoryContext, neighbors)
  }

  shouldContinueSearching(searchHistoryContext: SearchHistoryContext): boolean {
    return areThereMoreCoordinatesToSearch(searchHistoryContext)
  }

  getNextFrontierCoordinate(searchHistoryContext: SearchHistoryContext): SearchCoordinate {
    return popNextSearchCoordinateFromQueue(searchHistoryContext)
  }

  markCoordinateAsVisited(searchHistoryContext: SearchHistoryContext, currentFrontierCoordinate: SearchCoordinate): void {
    return addCoordinateToVisited(searchHistoryContext, currentFrontierCoordinate)
  }

  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentFrontierCoordinate: SearchCoordinate): {shouldExitEarly: boolean; returnVal: Path} {
    return endIfCoordinateIsAtDestination(searchHistoryContext, currentFrontierCoordinate)
  }

  findNewNeighborsForCoordinate(searchHistoryContext: SearchHistoryContext, currentFrontierCoordinate: SearchCoordinate): Array<SearchCoordinate> {
    return getUnvisitedCoordinatesNextToFrontier(searchHistoryContext, currentFrontierCoordinate)
  }

  noCoordinatesRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}
