import {Path} from "../mapMeasurement";
import {SearchStrategy, SquaddieSearchHistoryContext} from "./SearchStrategy";
import {StraightLineStrategy} from "./StraightLineStrategy";

export class SquaddieOneTurnMovementStrategy extends StraightLineStrategy implements SearchStrategy {
  addNewPathsToSearch(searchHistoryContext: SquaddieSearchHistoryContext, newPaths: Array<Path>): void {
    newPaths.forEach((newPath) => {
      if (newPath.getMovementCostSpent() <= searchHistoryContext.squaddie.getCurrentMovePerTurn()) {
        searchHistoryContext.pathsToSearch.push(newPath)
      }
    })
  }
}
