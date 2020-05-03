import {expect} from 'chai'
import {CameraControlForMainLayer} from "../src/battleSceneUtilities/cameraControlManagement";

let cameraControl

beforeEach(() => {
  cameraControl = new CameraControlForMainLayer({
    position: {
      x: 450,
      y: 250,
    },
    scrollSpeedPerSecond: 100,
    distanceFunction: (x1: number, y1: number, x2: number, y2: number) => { return 0},
    angleFunction: (x1: number, y1: number, x2: number, y2: number) => { return 0},
  })
})

describe('Camera settings', () => {
  it('Can read camera position', () => {
    expect(cameraControl.getPosition()).to.eql([450, 250])
  })
})

describe('Instant Camera scrolling', () => {
  it('Can scroll to destination immediately', () => {
    cameraControl.immediateScroll([50, 30])
    expect(cameraControl.getPosition()).to.eql([50, 30])
  })
})

describe('Scrolling Camera control movement', () => {
  it('can set destination immediately', () => {
    cameraControl.transitionScroll([100, 400])
    expect(cameraControl.getPosition()).to.eql([450, 250])
    expect(cameraControl.getDestination()).to.eql([100, 400])
  })

  it('arrives at destination after duration elapses', () => {
    cameraControl.transitionScroll([100, 400])
    cameraControl.passMilliseconds(2000)
    expect(cameraControl.getPosition()).to.eql([100, 400])
  })
})
