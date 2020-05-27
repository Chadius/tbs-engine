import {Coordinate, Path} from "../mapMeasurement";
import {BattleMap} from "../battleMap";
import TinyQueue from "tinyqueue";
import {Squaddie} from "../squaddie";

export interface BaseSearchHistoryContext {
  battleMap: BattleMap;
  endCoordinate: Coordinate;
  pathsToSearch: TinyQueue<Path> | null;
  startCoordinate: Coordinate;
  visitedLocations: Set<string>;
}

export class SearchHistoryContext implements BaseSearchHistoryContext{
  battleMap: BattleMap;
  endCoordinate: Coordinate;
  pathsToSearch: TinyQueue<Path> | null;
  startCoordinate: Coordinate;
  visitedLocations: Set<string>;

  constructor(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    this.battleMap = battleMap
    this.startCoordinate = startCoordinate
    this.endCoordinate = endCoordinate
    this.visitedLocations = new Set<string>()
    this.pathsToSearch = null
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
  getNextFrontierCoordinate(searchHistoryContext: BaseSearchHistoryContext): Path;
  markCoordinateAsVisited(searchHistoryContext: BaseSearchHistoryContext, currentPath: Path): void;
  shouldEndSearchEarly(searchHistoryContext: BaseSearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path | undefined};
  findNewNeighborsForCoordinate(searchHistoryContext: BaseSearchHistoryContext, currentPath: Path): Array<Coordinate>;
  markNeighborOrigins(searchHistoryContext: BaseSearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path>;
  addNewCoordinatesToFrontier(searchHistoryContext: BaseSearchHistoryContext, newPaths: Array<Path>): void;
  noCoordinatesRemain(searchHistoryContext: BaseSearchHistoryContext): any;
}