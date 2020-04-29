export class ZoomInfoForBattleMainLayer{
  currentZoomLevel: number
  minZoomLevel: number
  maxZoomLevel: number
  startingZoomLevel: number
  endingZoomLevel: number
  timeSpentTransitioning: number
  transitionDuration: number
  interpolationFunction: (v: number[], k: number) => number

  constructor(options: {
    initial: number;
    min: number;
    max: number;
    interpolator: (v: number[], k: number) => number;
  }) {
    this.currentZoomLevel = options.initial
    this.minZoomLevel = options.min
    this.maxZoomLevel = options.max
    this.interpolationFunction = options.interpolator
  }

  isInTransition(): boolean {
    if (this.timeSpentTransitioning === undefined || this.transitionDuration === undefined) {
      return false
    }

    return this.timeSpentTransitioning < this.transitionDuration
  }

  transitionZoomLevel(zoomLevel: number) {
    if (zoomLevel > this.getMaxZoomLevel()) {
      return
    }
    if (zoomLevel < this.getMinZoomLevel()) {
      return
    }

    this.timeSpentTransitioning = 0
    this.transitionDuration = 1000

    this.startingZoomLevel = this.currentZoomLevel
    this.endingZoomLevel = zoomLevel
    this.endingZoomLevel = this.boundZoomLevel(this.endingZoomLevel)
  }

  instantlyChangeZoomLevel(zoomLevel: number) {
    this.currentZoomLevel = zoomLevel
    this.currentZoomLevel = this.boundZoomLevel(this.currentZoomLevel)
  }

  passMilliseconds(timeElapsed: number) {
    if (!this.isInTransition()) {
      return
    }

    const lerpPoints = [
      this.startingZoomLevel,
      this.endingZoomLevel,
    ]

    const proportionateTimeElapsed = this.timeSpentTransitioning / this.transitionDuration

    this.currentZoomLevel = this.interpolationFunction(lerpPoints, proportionateTimeElapsed)

    this.timeSpentTransitioning = this.timeSpentTransitioning + timeElapsed

    if (this.timeSpentTransitioning >= this.transitionDuration) {
      this.currentZoomLevel = this.endingZoomLevel
    }
  }

  getCurrentZoomLevel() {
    return this.currentZoomLevel
  }

  getMinZoomLevel() {
    return this.minZoomLevel
  }

  getMaxZoomLevel() {
    return this.maxZoomLevel
  }

  boundZoomLevel(zoomLevelToRestrain: number): number {
    if (zoomLevelToRestrain <= this.minZoomLevel) {
      zoomLevelToRestrain = this.minZoomLevel
    } else if (zoomLevelToRestrain >= this.maxZoomLevel) {
      zoomLevelToRestrain = this.maxZoomLevel
    }
    return zoomLevelToRestrain
  }
}