import {BattleMap} from "../battleMap";
import {Coordinate} from "../mapMeasurement";
import {TerrainType} from "../terrain/terrain";

export class BattleMapGraphicState {
  tileWidth: number
  battleMap: BattleMap

  constructor(parameters: { tileWidth: number; battleMap: BattleMap }) {
    this.tileWidth = parameters.tileWidth
    this.battleMap = parameters.battleMap
  }

  getMeasurements(): {
    horizontalOffset: number;
    verticalOffset: number;
    distanceFromCenterToCorner: number;
    perRowMovementDown: number;
    perRowMovementRight: number;
    perColumnMovementRight: number;
  } {
    const distanceFromCenterToCorner = this.tileWidth / Math.sqrt(3)
    return {
      horizontalOffset: this.tileWidth / 2,
      verticalOffset: this.tileWidth / 2,
      distanceFromCenterToCorner: distanceFromCenterToCorner,
      perRowMovementDown: 3 * distanceFromCenterToCorner / 2,
      perRowMovementRight: this.tileWidth / 2.0,
      perColumnMovementRight: this.tileWidth,
    }
  }

  getTileCoordinateAtWorldLocation(worldX: number, worldY: number): Coordinate {
    const {
      horizontalOffset,
      verticalOffset,
      perRowMovementRight,
      perRowMovementDown,
      perColumnMovementRight
    } = this.getMeasurements()

    const worldXNoOffset = worldX - horizontalOffset
    const worldYNoOffset = worldY - verticalOffset

    const rowFraction = worldYNoOffset / perRowMovementDown

    const worldXOfZeroColumnOfRow = rowFraction * perRowMovementRight
    const columnFraction = (worldXNoOffset - worldXOfZeroColumnOfRow) / perColumnMovementRight
    const fractionCoordinate = new Coordinate(rowFraction, columnFraction)

    const nearestCoordinate = fractionCoordinate.roundToNearestHexCoordinates()
    if (this.battleMap.isOnMap(nearestCoordinate)) {
      return nearestCoordinate
    }

    return undefined
  }

  getPixelCoordinates(coordinate: Coordinate): number[] {
    const {
      horizontalOffset,
      verticalOffset,
      perRowMovementRight,
      perRowMovementDown,
      perColumnMovementRight
    } = this.getMeasurements()

    const row = coordinate.getRow()
    const column = coordinate.getColumn()

    const drawX = (perColumnMovementRight * column) + (perRowMovementRight * row) + horizontalOffset
    const drawY = (row * perRowMovementDown) + verticalOffset
    return [drawX, drawY]
  }

  getAssetNamesOrderedByCoordinate(): Array<{locationKey: string; image: string }> {
    const locationTileLocationAndTerrain = this.battleMap.terrain.getTilesOrderedByCoordinates()

    const defaultAssetsByTerrainType = {
      [TerrainType.road] : {
        image: "road_tile"
      },
      [TerrainType.grass]: {
        image: "grass_tile",
      },
      [TerrainType.sky]  : {
        image: "sky_tile",
      },
      [TerrainType.wall] : {
        image: "wall_tile",
      },
      [TerrainType.sand] : {
        image: "sand_tile",
      },
    }

    const getResourcesForLocationKey = (locationKeyTerrainPair) => {
      const {locationKey, terrain } = locationKeyTerrainPair
      const imageAssetName = defaultAssetsByTerrainType[terrain.terrainType].image
      return {
        locationKey: locationKey,
        image: imageAssetName
      }
    }

    return locationTileLocationAndTerrain.map(getResourcesForLocationKey)
  }

  getAssetLocations(): Array<{ name: string; type: string; location: string}> {
    return [
      {
        name: "sand_tile",
        type: "image",
        location: "assets/BrownSand.png",
      },
      {
        name: "wall_tile",
        type: "image",
        location: "assets/BlackWall.png",
      },
      {
        name: "sky_tile",
        type: "image",
        location: "assets/BlueSky.png",
      },
      {
        name: "road_tile",
        type: "image",
        location: "assets/GrayRoad.png",
      },
    ]
  }
}