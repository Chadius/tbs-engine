export class Coordinate {
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

  static newFromLocationKey(locationKey: string): Coordinate {
    const splitByComma = locationKey.split(",")
    const row = parseInt(splitByComma[0])
    const column = parseInt(splitByComma[1])

    if (isNaN(row) || isNaN(column)) {
      return undefined
    }
    return new Coordinate(row, column)
  }
}

export class SearchCoordinate extends Coordinate {
  originRow: number | null
  originColumn: number | null
  movementCostSpent: number
  estimatedMovementCostRemaining: number

  constructor(row: number, column: number, originRow: number | null, originColumn: number | null,
              movementCostSpent: number,
              estimatedMovementCostRemaining: number) {
    super(row, column);
    this.originRow = originRow
    this.originColumn = originColumn
    this.movementCostSpent = movementCostSpent
    this.estimatedMovementCostRemaining = estimatedMovementCostRemaining
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