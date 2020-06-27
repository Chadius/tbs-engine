import {expect} from 'chai'
import {BattleMap, MapTerrain} from "../../src/battleMap"
import {BattleMapGraphicState} from "../../src/battleScene/battleMapGraphicState"

describe("default map resources", () => {
  let battleMap: BattleMap
  let battleMapGraphicState: BattleMapGraphicState

  beforeEach(() => {
    battleMap = new BattleMap(new MapTerrain([
      ['1', '1', '1', '1'],
      ['1', 'X', '1', '1'],
      ['3', '3', 'S', 'X'],
    ]))

    battleMapGraphicState = new BattleMapGraphicState({
      battleMap: battleMap,
      tileWidth: 64
    })
  })

  it("guesses the asset needed for each tile", () => {
    const resourcesToUse = battleMapGraphicState.getAssetNamesOrderedByCoordinate()

    expect(resourcesToUse).to.eql([
      {
        locationKey: "0, 0",
        image: "road_tile",
      },
      {
        locationKey: "0, 1",
        image: "road_tile",
      },
      {
        locationKey: "0, 2",
        image: "road_tile",
      },
      {
        locationKey: "0, 3",
        image: "road_tile",
      },

      {
        locationKey: "1, 0",
        image: "road_tile",
      },
      {
        locationKey: "1, 1",
        image: "wall_tile",
      },
      {
        locationKey: "1, 2",
        image: "road_tile",
      },
      {
        locationKey: "1, 3",
        image: "road_tile",
      },

      {
        locationKey: "2, 0",
        image: "sand_tile",
      },
      {
        locationKey: "2, 1",
        image: "sand_tile",
      },
      {
        locationKey: "2, 2",
        image: "sky_tile",
      },
      {
        locationKey: "2, 3",
        image: "wall_tile",
      },
    ])
  })

  it("guesses the default asset locations", () => {
    const assetLocations = battleMapGraphicState.getAssetLocations()

    expect(assetLocations).to.eql([
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
    ])
  })
})