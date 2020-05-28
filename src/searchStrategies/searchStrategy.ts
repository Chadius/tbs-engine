import {Coordinate, Path, SearchCoordinate} from "../mapMeasurement";
import {BattleMap} from "../battleMap";
import TinyQueue from "tinyqueue";
import {Squaddie} from "../squaddie";
import {PathMap} from "../pathMap";

export interface BaseSearchHistoryContext {
  battleMap: BattleMap;
  endCoordinate: Coordinate;
  frontierCoordinates: TinyQueue<SearchCoordinate> | null;
  startCoordinate: Coordinate;
  visitedCoordinatesAndMovementCosts: PathMap;
}

export class SearchHistoryContext implements BaseSearchHistoryContext{
  battleMap: BattleMap;
  endCoordinate: Coordinate;
  frontierCoordinates: TinyQueue<SearchCoordinate> | null;
  startCoordinate: Coordinate;
  visitedCoordinatesAndMovementCosts: PathMap;

  constructor(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    this.battleMap = battleMap
    this.startCoordinate = startCoordinate
    this.endCoordinate = endCoordinate
    this.frontierCoordinates = null
    this.visitedCoordinatesAndMovementCosts = new PathMap()
  }
}

export class SquaddieSearchHistoryContext extends SearchHistoryContext implements BaseSearchHistoryContext{
  squaddie: Squaddie | null;

  constructor(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate, squaddie: Squaddie) {
    super(battleMap, startCoordinate, endCoordinate)
    this.squaddie = squaddie
  }
}

export interface SearchStrategy {
  checkForEarlyExitCondition(searchHistoryContext: BaseSearchHistoryContext): {shouldExitEarly: boolean; returnVal: null | undefined};
  initalizeSearchHistory(searchHistoryContext: BaseSearchHistoryContext): void;
  shouldContinueSearching(searchHistoryContext: BaseSearchHistoryContext): boolean;
  getNextFrontierCoordinate(searchHistoryContext: BaseSearchHistoryContext): SearchCoordinate;
  markCoordinateAsVisited(searchHistoryContext: BaseSearchHistoryContext, currentCoordinate: SearchCoordinate): void;
  shouldEndSearchEarly(searchHistoryContext: BaseSearchHistoryContext, currentCoordinate: SearchCoordinate): {shouldExitEarly: boolean; returnVal: Path | undefined};
  findNewNeighborsForCoordinate(searchHistoryContext: BaseSearchHistoryContext, currentCoordinate: SearchCoordinate): Array<SearchCoordinate>;
  addNewCoordinatesToFrontier(searchHistoryContext: BaseSearchHistoryContext, newNeighbors: Array<SearchCoordinate>): void;
  noCoordinatesRemain(searchHistoryContext: BaseSearchHistoryContext): any;
}