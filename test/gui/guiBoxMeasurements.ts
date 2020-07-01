import {expect} from 'chai'
import {GuiBoxMeasurement} from "../../src/gui/guiBoxMeasurement";

describe('Create GUI Box Measurements', () => {
  let origin
  let margin
  let border
  let padding

  beforeEach(() => {
    origin = {
      left: 100,
      top: 10,
      width: 200,
      height: 120,
    }

    margin = {
      top: 20,
      right: 10,
      bottom: 15,
      left: 0,
    }

    border = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    }

    padding = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    }
  })

  it('Knows the origin dimensions', () => {
    const window = new GuiBoxMeasurement({
      origin : origin
    })

    expect(window.getOriginLeft()).to.eql(100)
    expect(window.getOriginTop()).to.eql(10)
    expect(window.getOriginWidth()).to.eql(200)
    expect(window.getOriginHeight()).to.eql(120)
    expect(window.getOriginRight()).to.eql(300)
    expect(window.getOriginBottom()).to.eql(130)
  })

  it('Knows the margin', () => {
    const window = new GuiBoxMeasurement({
      origin : origin,
      margin: margin,
    })

    expect(window.getMarginTopValue()).to.eql(margin.top)
    expect(window.getMarginRightValue()).to.eql(margin.right)
    expect(window.getMarginBottomValue()).to.eql(margin.bottom)
    expect(window.getMarginLeftValue()).to.eql(margin.left)

    expect(window.getMarginTopEnd()).to.eql(30)
    expect(window.getMarginRightEnd()).to.eql(290)
    expect(window.getMarginBottomEnd()).to.eql(115)
    expect(window.getMarginLeftEnd()).to.eql(100)
  })

  it('Knows the border', () => {
    const window = new GuiBoxMeasurement({
      origin : origin,
      margin: margin,
      border: border,
    })

    expect(window.getBorderTopValue()).to.eql(border.top)
    expect(window.getBorderRightValue()).to.eql(border.right)
    expect(window.getBorderBottomValue()).to.eql(border.bottom)
    expect(window.getBorderLeftValue()).to.eql(border.left)

    expect(window.getBorderTopEnd()).to.eql(40)
    expect(window.getBorderRightEnd()).to.eql(280)
    expect(window.getBorderBottomEnd()).to.eql(105)
    expect(window.getBorderLeftEnd()).to.eql(110)
  })

  it('Knows the padding', () => {
    const window = new GuiBoxMeasurement({
      origin : origin,
      margin: margin,
      border: border,
      padding: padding,
    })

    expect(window.getPaddingTopValue()).to.eql(padding.top)
    expect(window.getPaddingRightValue()).to.eql(padding.right)
    expect(window.getPaddingBottomValue()).to.eql(padding.bottom)
    expect(window.getPaddingLeftValue()).to.eql(padding.left)

    expect(window.getPaddingTopEnd()).to.eql(60)
    expect(window.getPaddingRightEnd()).to.eql(260)
    expect(window.getPaddingBottomEnd()).to.eql(85)
    expect(window.getPaddingLeftEnd()).to.eql(130)
  })

  it('Knows the bounding box for the content', () => {
    const window = new GuiBoxMeasurement({
      origin : origin,
      margin: margin,
      border: border,
      padding: padding,
    })

    expect(window.getContentTop()).to.eql(60)
    expect(window.getContentRight()).to.eql(260)
    expect(window.getContentBottom()).to.eql(85)
    expect(window.getContentLeft()).to.eql(130)
  })
})

describe("Change a GUI Box Measurements", () => {
  let origin
  let margin
  let border
  let padding

  let window: GuiBoxMeasurement

  beforeEach(() => {
    origin = {
      left: 100,
      top: 10,
      width: 200,
      height: 120
    }

    margin = {
      top: 20,
      right: 10,
      bottom: 15,
      left: 0,
    }

    border = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    }

    padding = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
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

  it("Can change the margins", () => {
    window.setMarginTop(30)
    expect(window.getMarginTopEnd()).to.eql(40)

    window.setMarginRight(50)
    expect(window.getMarginRightEnd()).to.eql(250)

    window.setMarginBottom(30)
    expect(window.getMarginBottomEnd()).to.eql(100)

    window.setMarginLeft(25)
    expect(window.getMarginLeftEnd()).to.eql(125)
  })

  it("Can change the border", () => {
    window.setBorderTop(20)
    expect(window.getBorderTopEnd()).to.eql(30)

    window.setBorderRight(20)
    expect(window.getBorderRightEnd()).to.eql(280)

    window.setBorderBottom(20)
    expect(window.getBorderBottomEnd()).to.eql(110)

    window.setBorderLeft(20)
    expect(window.getBorderLeftEnd()).to.eql(120)
  })

  it("Can change the padding", () => {
    window.setPaddingTop(50)
    expect(window.getPaddingTopEnd()).to.eql(60)

    window.setPaddingRight(50)
    expect(window.getPaddingRightEnd()).to.eql(250)

    window.setPaddingBottom(50)
    expect(window.getPaddingBottomEnd()).to.eql(80)

    window.setPaddingLeft(50)
    expect(window.getPaddingLeftEnd()).to.eql(150)
  })
})