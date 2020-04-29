import {expect} from 'chai'
import {ZoomInfoForBattleMainLayer} from "../src/battleSceneUtilities/zoomLevelManagement";

let zoomInfo
const initialZoomLevel = 1.0
const zoomLimitMultiplier = 4.0

beforeEach(() => {
  zoomInfo = new ZoomInfoForBattleMainLayer({
    initial: initialZoomLevel,
    min: initialZoomLevel / zoomLimitMultiplier,
    max: initialZoomLevel * zoomLimitMultiplier,
    interpolator: (v: number[], k: number) => {
      return 1
    }
  })
})

describe('Instant Zoom', () => {
  it('can be set to any value within limits', () => {
    zoomInfo.instantlyChangeZoomLevel(2.0)
    expect(zoomInfo.getCurrentZoomLevel()).to.eq(2.0)
  })

  it('cannot have less than minimum zoom limit', () => {
    zoomInfo.instantlyChangeZoomLevel(0.1)
    expect(zoomInfo.getCurrentZoomLevel()).to.eq(zoomInfo.getMinZoomLevel())
  })

  it('cannot have more than maximum zoom limit', () => {
    zoomInfo.instantlyChangeZoomLevel(10)
    expect(zoomInfo.getCurrentZoomLevel()).to.eq(zoomInfo.getMaxZoomLevel())
  })
})

describe(`Transition Zoom`, () => {
  it('knows it is not in transition if it has never transitioned', () => {
    expect(zoomInfo.isInTransition()).to.be.false
  })

  it('knows it is in transition if it just started transition', () => {
    zoomInfo.transitionZoomLevel(2.0)
    expect(zoomInfo.isInTransition()).to.be.true
  })

  it('knows it is not in transition if time elapsed has exceeded the duration', () => {
    zoomInfo.transitionZoomLevel(2.0)
    zoomInfo.passMilliseconds(2000)
    expect(zoomInfo.isInTransition()).to.be.false
  })

  it('will not start transition to zoom out if already zoomed all the way', () => {
    zoomInfo.instantlyChangeZoomLevel(zoomInfo.getMaxZoomLevel())
    zoomInfo.transitionZoomLevel(zoomInfo.getMaxZoomLevel() * 2)
    expect(zoomInfo.isInTransition()).to.be.false
  })

  it('will not start transition to zoom in if already zoomed all the way', () => {
    zoomInfo.instantlyChangeZoomLevel(zoomInfo.getMinZoomLevel())
    zoomInfo.transitionZoomLevel(zoomInfo.getMinZoomLevel() / 2.0)
    expect(zoomInfo.isInTransition()).to.be.false
  })
})

describe('Linear Interpolation', () => {
  it('begins at the start value', () => {
    zoomInfo.transitionZoomLevel(2.0)
    zoomInfo.passMilliseconds(0)
    expect(zoomInfo.getCurrentZoomLevel()).to.eq(initialZoomLevel)
  })

  it('finishes at the end value', () => {
    zoomInfo.transitionZoomLevel(2.0)
    zoomInfo.passMilliseconds(1000)
    expect(zoomInfo.getCurrentZoomLevel()).to.eq(2.0)
  })
})