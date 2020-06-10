export enum TerrainType {
  road = "road",
  grass = "grass",
  sand = "sand",
  sky = "sky",
  wall = "wall"
}

export class TerrainTile {
  terrainType: TerrainType
  name: string
  description: string

  constructor(type: TerrainType, name: string, description?: string) {
    this.terrainType = type
    this.name = name
    this.description = description || ""
  }

  getTerrainType(): TerrainType {
    return this.terrainType
  }

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  static newFromTerrainType(terrainType: TerrainType): TerrainTile {
    if (terrainType === TerrainType.road) {
      return new TerrainTile(terrainType, terrainType.valueOf(), "Roads are easy to traverse.")
    }
    if (terrainType === TerrainType.grass) {
      return new TerrainTile(terrainType, terrainType.valueOf(), "Grass is a bit slow to cross.")
    }
    if (terrainType === TerrainType.sand) {
      return new TerrainTile(terrainType, terrainType.valueOf(), "Sand is very hard to cross.")
    }
    if (terrainType === TerrainType.sky) {
      return new TerrainTile(terrainType, terrainType.valueOf(), "Sky tiles must be flown over.")
    }
    if (terrainType === TerrainType.wall) {
      return new TerrainTile(terrainType, terrainType.valueOf(), "Walls are unpassable.")
    }

    throw Error(`Unknown TerrainType ${terrainType}`)
  }

  static newFromName(name: string): TerrainTile {
    const terrainType = TerrainType[name]
    return TerrainTile.newFromTerrainType(terrainType)
  }

  static newFromNickname(nickname: string): TerrainTile {
    const nicknameToType = {
      "1": TerrainType.road,
      "2": TerrainType.grass,
      "3": TerrainType.sand,
      "S": TerrainType.sky,
      "X": TerrainType.wall,
    }

    const terrainType = nicknameToType[nickname]
    return TerrainTile.newFromTerrainType(terrainType)
  }
}