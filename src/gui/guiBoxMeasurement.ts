export class GuiBoxMeasurement {
  origin: {
    left: number;
    top: number;
    width: number;
    height: number;
  }

  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  border: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  constructor(param: {
    origin: { top: number; left: number; width: number; height: number };
    margin?: { top: number; right: number; bottom: number; left: number };
    border?: { top: number; right: number; bottom: number; left: number };
    padding?: { top: number; right: number; bottom: number; left: number };
  }) {
    this.origin = {
      left: param.origin.left,
      top: param.origin.top,
      width: param.origin.width,
      height: param.origin.height,
    }

    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    if (param.margin) {
      this.margin = {
        top: param.margin.top,
        right: param.margin.right,
        bottom: param.margin.bottom,
        left: param.margin.left,
      }
    }

    this.border = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    if (param.border) {
      this.border = {
        top: param.border.top,
        right: param.border.right,
        bottom: param.border.bottom,
        left: param.border.left,
      }
    }

    this.padding = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    if (param.padding) {
      this.padding = {
        top: param.padding.top,
        right: param.padding.right,
        bottom: param.padding.bottom,
        left: param.padding.left,
      }
    }
  }

  getOriginLeft(): number {
    return this.origin.left
  }
  getOriginTop(): number {
    return this.origin.top
  }
  getOriginWidth(): number {
    return this.origin.width
  }
  getOriginHeight(): number {
    return this.origin.height
  }
  getOriginRight(): number {
    return this.getOriginLeft() + this.getOriginWidth()
  }
  getOriginBottom(): number {
    return this.getOriginTop() + this.getOriginHeight()
  }

  setOriginLeft(left: number) {
    this.origin.left = left
  }
  setOriginTop(top: number) {
    this.origin.top = top
  }
  setOriginWidth(width: number) {
    if (width < 0) {
      width = 0
    }
    this.origin.width = width
  }
  setOriginHeight(height: number) {
    if (height < 0) {
      height = 0
    }
    this.origin.height = height
  }
  setOriginRight(right: number) {
    if (right < this.getOriginLeft()) {
      right = this.getOriginLeft()
    }
    this.origin.width = right - this.origin.left
  }
  setOriginBottom(bottom: number) {
    if (bottom < this.getOriginTop()) {
      bottom = this.getOriginTop()
    }
    this.origin.height = bottom - this.origin.top
  }

  getMarginTopValue(): number {
    return this.margin.top
  }
  getMarginRightValue(): number {
    return this.margin.right
  }
  getMarginBottomValue(): number {
    return this.margin.bottom
  }
  getMarginLeftValue(): number {
    return this.margin.left
  }

  getMarginTopEnd(): number {
    return this.getOriginTop() + this.getMarginTopValue()
  }
  getMarginRightEnd(): number {
    return this.getOriginRight() - this.getMarginRightValue()
  }
  getMarginBottomEnd(): number {
    return this.getOriginBottom() - this.getMarginBottomValue()
  }
  getMarginLeftEnd(): number {
    return this.getOriginLeft() + this.getMarginLeftValue()
  }

  setMarginTop(top: number) {
    this.margin.top = top
  }
  setMarginRight(right: number) {
    this.margin.right = right
  }
  setMarginBottom(bottom: number) {
    this.margin.bottom = bottom
  }
  setMarginLeft(left: number) {
    this.margin.left = left
  }

  getBorderTopValue(): number {
    return this.border.top
  }
  getBorderRightValue(): number {
    return this.border.right
  }
  getBorderBottomValue(): number {
    return this.border.bottom
  }
  getBorderLeftValue(): number {
    return this.border.left
  }

  getBorderTopEnd(): number {
    return this.getMarginTopEnd() + this.getBorderTopValue()
  }
  getBorderRightEnd(): number {
    return this.getMarginRightEnd() - this.getBorderRightValue()
  }
  getBorderBottomEnd(): number {
    return this.getMarginBottomEnd() - this.getBorderBottomValue()
  }
  getBorderLeftEnd(): number {
    return this.getMarginLeftEnd() + this.getBorderLeftValue()
  }

  setBorderTop(top: number) {
    this.border.top = top
  }
  setBorderRight(right: number) {
    this.border.right = right
  }
  setBorderBottom(bottom: number) {
    this.border.bottom = bottom
  }
  setBorderLeft(left: number) {
    this.border.left = left
  }

  getPaddingTopValue(): number {
    return this.padding.top
  }
  getPaddingRightValue(): number {
    return this.padding.right
  }
  getPaddingBottomValue(): number {
    return this.padding.bottom
  }
  getPaddingLeftValue(): number {
    return this.padding.left
  }

  getPaddingTopEnd(): number {
    return this.getBorderTopEnd() + this.getPaddingTopValue()
  }
  getPaddingRightEnd(): number {
    return this.getBorderRightEnd() - this.getPaddingRightValue()
  }
  getPaddingBottomEnd(): number {
    return this.getBorderBottomEnd() - this.getPaddingBottomValue()
  }
  getPaddingLeftEnd(): number {
    return this.getBorderLeftEnd() + this.getPaddingLeftValue()
  }

  setPaddingTop(top: number) {
    this.padding.top = top
  }
  setPaddingRight(right: number) {
    this.padding.right = right
  }
  setPaddingBottom(bottom: number) {
    this.padding.bottom = bottom
  }
  setPaddingLeft(left: number) {
    this.padding.left = left
  }

  getContentTop(): number {
    return this.getPaddingTopEnd()
  }
  getContentRight(): number {
    return this.getPaddingRightEnd()
  }
  getContentBottom(): number {
    return this.getPaddingBottomEnd()
  }
  getContentLeft(): number {
    return this.getPaddingLeftEnd()
  }
}
