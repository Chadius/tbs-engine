import {Coordinate, Path} from "../mapMeasurement";
import {SearchHistoryContext, SearchStrategy, SquaddieSearchHistoryContext} from "./searchStrategy";
import {
  addNeighborsToPathAndCreateNewPaths,
  addPathLocationToVisited,
  checkIfCoordinatesAreOffMap, endIfPathIsAtDestination, getUnvisitedCoordinatesNextToPathHead,
  initalizeSearchHistoryWithPriorityQueue, morePathsToSearch, popNextPathFromQueue,
} from "./straightLineStrategy";

const addNewPathsIfWithinMoverange = (searchHistoryContext: SquaddieSearchHistoryContext, newPaths: Array<Path>): void => {
  newPaths.forEach((newPath) => {
    if (newPath.getTotalMovementCostSpent() <= searchHistoryContext.squaddie.getCurrentMovePerTurn()) {
      searchHistoryContext.pathsToSearch.push(newPath)
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

  addNewCoordinatesToFrontier(searchHistoryContext: SquaddieSearchHistoryContext, newPaths: Array<Path>): void {
    return addNewPathsIfWithinMoverange(searchHistoryContext, newPaths)
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

  noCoordinatesRemain(searchHistoryContext: SearchHistoryContext): any {
    return null
  };
}
