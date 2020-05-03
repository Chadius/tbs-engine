export class CameraControlForMainLayer {
  scrollPosition: {x: number; y: number}
  transitionScrollDestination: {x: number; y: number}
  scrollSpeedPerSecond: number
  distanceFunction: (x1: number, y1: number, x2: number, y2: number) => number
  angleFunction: (x1: number, y1: number, x2: number, y2: number) => number

  constructor(options: {
    position: {x: number; y: number};
    scrollSpeedPerSecond: number;
    distanceFunction: (x1: number, y1: number, x2: number, y2: number) => number;
    angleFunction: (x1: number, y1: number, x2: number, y2: number) => number;
  }) {
    this.scrollPosition = {
      x: options.position.x,
      y: options.position.y,
    }

    this.transitionScrollDestination = {
      x: options.position.x,
      y: options.position.y,
    }

    this.scrollSpeedPerSecond = options.scrollSpeedPerSecond

    this.distanceFunction = options.distanceFunction
    this.angleFunction = options.angleFunction
  }

  getPosition(): number[]  {
    return [
      this.scrollPosition.x,
      this.scrollPosition.y,
    ]
  }

  getDestination(): number[]  {
    return [
      this.transitionScrollDestination.x,
      this.transitionScrollDestination.y,
    ]
  }

  immediateScroll(targetPosition: number[]): void {
    this.scrollPosition.x = targetPosition[0]
    this.scrollPosition.y = targetPosition[1]
  }

  transitionScroll(targetPosition: number[]): void {
    this.transitionScrollDestination.x = targetPosition[0]
    this.transitionScrollDestination.y = targetPosition[1]
  }

  passMilliseconds(timeElapsedInMilliseconds: number): void {
    const distanceBetweenCurrentAndDestination = this.distanceFunction(
      this.scrollPosition.x,
      this.scrollPosition.y,
      this.transitionScrollDestination.x,
      this.transitionScrollDestination.y,
    )

    const finishTransitionTolerance = this.scrollSpeedPerSecond / 10.0
    if (distanceBetweenCurrentAndDestination < finishTransitionTolerance) {
      this.scrollPosition.x = this.transitionScrollDestination.x
      this.scrollPosition.y = this.transitionScrollDestination.y
      return
    }

    const secondsToReachDestination = distanceBetweenCurrentAndDestination / this.scrollSpeedPerSecond
    if (timeElapsedInMilliseconds >= secondsToReachDestination * 1000.0) {
      this.scrollPosition.x = this.transitionScrollDestination.x
      this.scrollPosition.y = this.transitionScrollDestination.y
      return
    }

    const angleBetweenCurrentAndDestination = this.angleFunction(
      this.scrollPosition.x,
        this.scrollPosition.y,
        this.transitionScrollDestination.x,
        this.transitionScrollDestination.y,
    )

    const xSpeedPerSecond = Math.cos(angleBetweenCurrentAndDestination) * this.scrollSpeedPerSecond
    const ySpeedPerSecond = Math.sin(angleBetweenCurrentAndDestination) * this.scrollSpeedPerSecond

    const xDistance = xSpeedPerSecond * (timeElapsedInMilliseconds / 1000.0)
    const yDistance = ySpeedPerSecond * (timeElapsedInMilliseconds / 1000.0)

    this.scrollPosition.x = this.scrollPosition.x + xDistance
    this.scrollPosition.y = this.scrollPosition.y + yDistance
  }
}