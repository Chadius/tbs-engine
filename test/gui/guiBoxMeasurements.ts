import {expect} from 'chai'
import {GuiBoxMeasurement} from "../../src/gui/guiBoxMeasurement";

describe("Create GUI Box Measurements", () => {
  it("Knows the overall dimensions", () => {
    const window = new GuiBoxMeasurement({
      origin : {
        left: 100,
        top: 10,
        width: 200,
        height: 120
      }
    })

    expect(window.getOriginLeft()).to.eql(100)
    expect(window.getOriginTop()).to.eql(10)
    expect(window.getOriginWidth()).to.eql(200)
    expect(window.getOriginHeight()).to.eql(120)
    expect(window.getOriginRight()).to.eql(300)
    expect(window.getOriginBottom()).to.eql(130)
  })
})

describe("Change a GUI Box Measurements", () => {
  let origin
  let window: GuiBoxMeasurement

  beforeEach(() => {
    origin = {
      left: 100,
      top: 10,
      width: 200,
      height: 120
    }

    window = new GuiBoxMeasurement({
      origin : origin
    })
  })

  it("Can change the origin location", () => {
    window.setOriginLeft(10)
    expect(window.getOriginLeft()).to.eql(10)

    window.setOriginTop(200)
    expect(window.getOriginTop()).to.eql(200)

    window.setOriginWidth(30)
    expect(window.getOriginLeft()).to.eql(10)
    expect(window.getOriginRight()).to.eql(40)

    window.setOriginHeight(50)
    expect(window.getOriginTop()).to.eql(200)
    expect(window.getOriginBottom()).to.eql(250)

    window.setOriginLeft(-30)
    expect(window.getOriginLeft()).to.eql(-30)

    window.setOriginWidth(-100)
    expect(window.getOriginRight()).to.eql(-30)

    window.setOriginRight(0)
    expect(window.getOriginWidth()).to.eql(30)

    window.setOriginBottom(300)
    expect(window.getOriginHeight()).to.eql(100)

    window.setOriginRight(-1000)
    expect(window.getOriginLeft()).to.eql(-30)
    expect(window.getOriginRight()).to.eql(-30)

    window.setOriginBottom(-1000)
    expect(window.getOriginTop()).to.eql(200)
    expect(window.getOriginBottom()).to.eql(200)

  })
})