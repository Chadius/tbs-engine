import {Coordinate, Path} from "../mapMeasurement";
import {BattleMap} from "../battleMap";
import TinyQueue from "tinyqueue";

export class SearchHistoryContext {
  battleMap: BattleMap;
  startCoordinate: Coordinate;
  endCoordinate: Coordinate;
  visitedLocations: Set<number>;
  pathsToSearch: TinyQueue<Path> | null;

  constructor(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate) {
    this.battleMap = battleMap
    this.startCoordinate = startCoordinate
    this.endCoordinate = endCoordinate
    this.visitedLocations = new Set<number>()
    this.pathsToSearch = null
  }
}

export interface SearchStrategy {
  checkForEarlyExitCondition(searchHistoryContext: SearchHistoryContext): {shouldExitEarly: boolean; returnVal: null | undefined};
  initalizeSearchHistory(searchHistoryContext: SearchHistoryContext): void;
  shouldContinueSearching(searchHistoryContext: SearchHistoryContext): boolean;
  getNextPath(searchHistoryContext: SearchHistoryContext): Path;
  markPathAsVisited(searchHistoryContext: SearchHistoryContext, currentPath: Path): void;
  shouldEndSearchEarly(searchHistoryContext: SearchHistoryContext, currentPath: Path): {shouldExitEarly: boolean; returnVal: Path | undefined};
  findNewNeighborsForPath(searchHistoryContext: SearchHistoryContext, currentPath: Path): Array<Coordinate>;
  addNeighborsToPath(searchHistoryContext: SearchHistoryContext, neighbors: Array<Coordinate>, currentPath: Path): Array<Path>;
  addNewPathsToSearch(searchHistoryContext: SearchHistoryContext, newPaths: Array<Path>): void;
  noPathsRemain(searchHistoryContext: SearchHistoryContext): any;
}