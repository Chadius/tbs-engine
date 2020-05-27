import {Coordinate, Path} from "./mapMeasurement";
import {BattleMap} from "./battleMap";
import {StraightLineStrategy} from "./searchStrategies/straightLineStrategy";
import {SearchHistoryContext, SearchStrategy, SquaddieSearchHistoryContext} from "./searchStrategies/searchStrategy";
import {Squaddie} from "./squaddie";
import {SquaddieOneTurnMovementStrategy} from "./searchStrategies/squaddieOneTurnMovementStrategy";

export const MapSearchService = {
  runSearchAlgorithm(searchStrategy: SearchStrategy, searchHistoryContext: SearchHistoryContext): Path | null{
    searchStrategy.initalizeSearchHistory(searchHistoryContext)

    const earlyExitCondition = searchStrategy.checkForEarlyExitCondition(searchHistoryContext)
    if(earlyExitCondition.shouldExitEarly) {
      return earlyExitCondition.returnVal
    }

    while (searchStrategy.shouldContinueSearching(searchHistoryContext)) {
      const currentPath = searchStrategy.getNextFrontierCoordinate(searchHistoryContext)

      searchStrategy.markCoordinateAsVisited(searchHistoryContext, currentPath)

      const endSearchQuery = searchStrategy.shouldEndSearchEarly(searchHistoryContext, currentPath)
      if (endSearchQuery.shouldExitEarly) {
        return endSearchQuery.returnVal
      }

      const neighbors = searchStrategy.findNewNeighborsForCoordinate(searchHistoryContext, currentPath)

      const newPaths = searchStrategy.markNeighborOrigins(searchHistoryContext, neighbors, currentPath)
      searchStrategy.addNewCoordinatesToFrontier(searchHistoryContext, newPaths)
    }

    return searchStrategy.noCoordinatesRemain(searchHistoryContext)
  },

  calculatePath(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): Path | null {
    const searchContext = new SearchHistoryContext (
      battleMap,
      startCoordinate,
      endCoordinate
    )
    const newSearchStrategy = new StraightLineStrategy()
    return MapSearchService.runSearchAlgorithm(newSearchStrategy, searchContext)
  },

  getSquaddiePathToDestination(squaddie: Squaddie, battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    const searchContext = new SquaddieSearchHistoryContext(battleMap, startCoordinate, endCoordinate, squaddie)
    const newSearchStrategy = new SquaddieOneTurnMovementStrategy()
    return MapSearchService.runSearchAlgorithm(newSearchStrategy, searchContext)
  },
}