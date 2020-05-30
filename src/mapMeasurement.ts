export interface BaseCoordinate {
  row: number;
  column: number;

  getRow(): number;
  getColumn(): number;
  getLocationKey(): string;
  toCubeCoordinates(): {x: number; y: number; z: number};
}

export class Coordinate implements BaseCoordinate{
  row: number
  column: number

  constructor(row: number, column: number) {
    this.row = row
    this.column = column
  }

  getRow(): number {
    return this.row
  }

  getColumn(): number {
    return this.column
  }

  equals(other: Coordinate): boolean {
    return this.getLocationKey() === other.getLocationKey()
  }

  getLocationKey(): string {
    return `${this.getRow()}, ${this.getColumn()}`
  }


  toCubeCoordinates(): {x: number; y: number; z: number} {
    return {
      x: this.getColumn(),
      y: this.getRow(),
      z: -1 * (this.getColumn() + this.getRow()),
    }
  }

  static newFromLocationKey(locationKey: string): Coordinate {
    const splitByComma = locationKey.split(",")
    const row = parseInt(splitByComma[0])
    const column = parseInt(splitByComma[1])

    if (isNaN(row) || isNaN(column)) {
      return undefined
    }
    return new Coordinate(row, column)
  }

  static newFromCubeCoordinates(x: number, y: number, z: number): Coordinate {
    const row = y
    const column = x
    return new Coordinate(row,column)
  }

  add(addend: Coordinate): Coordinate {
    const thisAsCubeCoordinates = this.toCubeCoordinates()
    const addendAsCubeCoordinates = addend.toCubeCoordinates()

    const sumCubeCoordinates = {
      x: thisAsCubeCoordinates.x + addendAsCubeCoordinates.x,
      y: thisAsCubeCoordinates.y + addendAsCubeCoordinates.y,
      z: thisAsCubeCoordinates.z + addendAsCubeCoordinates.z,
    }

    return Coordinate.newFromCubeCoordinates(sumCubeCoordinates.x, sumCubeCoordinates.y, sumCubeCoordinates.z)
  }

  static generateCubeDirections(): Coordinate[] {
    return [
      Coordinate.newFromCubeCoordinates(1, -1, 0),
      Coordinate.newFromCubeCoordinates(1, 0, -1),
      Coordinate.newFromCubeCoordinates(0, 1, -1),
      Coordinate.newFromCubeCoordinates(-1, 1, 0),
      Coordinate.newFromCubeCoordinates(-1, 0, -1),
      Coordinate.newFromCubeCoordinates(0, -1, 1),
    ]
  }

  static generateAxialDirections(): Coordinate[] {
    return [
      new Coordinate(0, 1),
      new Coordinate(-1, 1),
      new Coordinate(-1, 0),
      new Coordinate(0, -1),
      new Coordinate(1, -1),
      new Coordinate(1, 0),
    ]
  }

  generateNeighbors(): Array<Coordinate> {
    const axialDirections = Coordinate.generateAxialDirections()
    return [0,1,2,3,4,5].map((directionIndex) => {
      return this.add(axialDirections[directionIndex])
    })
  }
}

export class SearchCoordinate extends Coordinate implements BaseCoordinate {
  originRow: number | null
  originColumn: number | null
  movementCostSpent: number
  estimatedMovementCostRemaining: number
  totalMovementCostSpent: number

  constructor(
    row: number,
    column: number,
    originRow: number | null,
    originColumn: number | null,
    movementCostSpent: number,
    estimatedMovementCostRemaining: number,
    totalMovementCostSpent?: number
  ) {
    super(row, column);
    this.originRow = originRow
    this.originColumn = originColumn
    this.movementCostSpent = movementCostSpent
    this.estimatedMovementCostRemaining = estimatedMovementCostRemaining
    this.totalMovementCostSpent = totalMovementCostSpent
  }

  getOriginColumn(): number | null {
    return this.originColumn
  }

  getOriginRow(): number | null {
    return this.originRow
  }

  getOriginLocationKey(): string | null {
    if (this.originRow && this.originColumn) {
      return `${this.getOriginRow()}, ${this.getOriginColumn()}`
    }
    return null
  }

  getMovementCostSpent(): number {
    return this.movementCostSpent
  }

  getEstimatedMovementCostRemaining(): number {
    return this.estimatedMovementCostRemaining
  }

  getTotalMovementCostSpent(): number {
    return this.totalMovementCostSpent
  }

  isOrigin() {
    return (this.getOriginLocationKey() === null)
  }

  clone() {
    return new SearchCoordinate(
      this.getRow(),
      this.getColumn(),
      this.getOriginRow(),
      this.getOriginColumn(),
      this.getMovementCostSpent(),
      this.getEstimatedMovementCostRemaining(),
    )
  }
}

export class Path {
  searchCoordinates: Array<SearchCoordinate>

  constructor(startingCoordinate?: SearchCoordinate) {
    if (startingCoordinate) {
      this.searchCoordinates = new Array<SearchCoordinate>(startingCoordinate)
    }
    else {
      this.searchCoordinates = new Array<SearchCoordinate>()
    }
  }

  getNumberOfCoordinates(): number{
    return this.searchCoordinates.length
  }

  getHeadCoordinate(): SearchCoordinate {
    return this.searchCoordinates[this.searchCoordinates.length - 1]
  }

  getTotalMovementCostSpent(): number {
    return this.searchCoordinates.map(
      searchCoordinate => searchCoordinate.getMovementCostSpent()
    ).reduce(
      (accumulator, currentCost) => {
        return accumulator + currentCost
      },
      0
    )
  }

  addSearchCoordinate(newSearchCoordinate: SearchCoordinate): void {
    this.searchCoordinates.push(newSearchCoordinate)
  }

  clone(): Path {
    const clonedPath = new Path()
    this.searchCoordinates.forEach((newSearchCoordinate) => {
      clonedPath.addSearchCoordinate(newSearchCoordinate.clone())
    })
    return clonedPath
  }

  cloneAndAddCoordinate(newSearchCoordinate: SearchCoordinate): Path {
    const newPath = this.clone()
    newPath.addSearchCoordinate(newSearchCoordinate)
    return newPath
  }
}