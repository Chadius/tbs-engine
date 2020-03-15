import {Coordinate, Path} from "./mapMeasurement";
import {BattleMap} from "./battleMap";

export const MapSearchService = {
  calculatePath(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): Path {
    if(!MapSearchService.hasValidCoordinates(battleMap, startCoordinate, endCoordinate)) {
      return null
    }

    const pathFromStartToEnd = new Path(startCoordinate)
    const visitedLocations = new Set()
    visitedLocations.add(battleMap.coordinatesToLocationIndex(startCoordinate))

    // const pathsToSearch : Queue
    //
    // let destinationFound = false, destinationUnreachable = false
    //
    // while(visitedLocations.size > 0 || destinationFound || destinationUnreachable) {
    //   // If queue is empty, destination is unreachable. Stop.
    //   // Pop the top of the queue
    //   // Mark location as visited
    //   // Is this the destination?
    //   // Add neighbors as long as they haven't been already visited
    // }

    return pathFromStartToEnd
  },

  hasValidCoordinates(battleMap: BattleMap, startCoordinate: Coordinate, endCoordinate: Coordinate): boolean {
    return (battleMap.isOnMap(startCoordinate) && battleMap.isOnMap(endCoordinate))
  },
}