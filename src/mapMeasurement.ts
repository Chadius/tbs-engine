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
  coordinates: Array<Coordinate>
  movementCostSpent: number
  estimatedMovementCostToDestination: number

  constructor(startingCoordinate?: Coordinate) {
    if (startingCoordinate) {
      this.coordinates = new Array<Coordinate>(startingCoordinate)
    }
    else {
      this.coordinates = new Array<Coordinate>()
    }
    this.movementCostSpent = 0
    this.estimatedMovementCostToDestination = 0
  }

  getNumberOfCoordinates(): number{
    return this.coordinates.length
  }

  getHeadCoordinate(): Coordinate{
    return this.coordinates[this.coordinates.length - 1]
  }

  getMovementCostSpent(): number{
    return this.movementCostSpent
  }

  addCoordinate(newCoordinate: Coordinate, movementCost: number): void {
    this.coordinates.push(newCoordinate)
    this.movementCostSpent = this.movementCostSpent + movementCost
  }

  clone(): Path {
    const clonedPath = new Path(this.coordinates[0])
    clonedPath.coordinates = [...this.coordinates]
    clonedPath.movementCostSpent = this.getMovementCostSpent()
    return clonedPath
  }

  cloneAndAddCoordinate(coordinate: Coordinate, movementCost: number): Path {
    const newPath = this.clone()
    newPath.addCoordinate(coordinate, movementCost)
    return newPath
  }
}