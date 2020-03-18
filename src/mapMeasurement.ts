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
    return this.row === other.row && this.column === other.column
  }
}

export class Path {
  coordinates: Array<Coordinate>
  movementCostSpent: number
  estimatedMovementCostToDestination: number

  constructor(startingCoordinate: Coordinate) {
    this.coordinates = new Array<Coordinate>(startingCoordinate)
    this.movementCostSpent = 0
    this.estimatedMovementCostToDestination = 0
  }

  getNumberOfCoordinates(): number{
    return this.coordinates.length
  }

  getCurrentCoordinates(): Coordinate{
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
}