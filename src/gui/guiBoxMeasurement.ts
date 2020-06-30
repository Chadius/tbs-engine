export class GuiBoxMeasurement {
  origin: {
    left: number;
    top: number;
    width: number;
    height: number;
  }

  constructor(param: { origin: { top: number; left: number; width: number; height: number } }) {
    this.origin = {
      left: param.origin.left,
      top: param.origin.top,
      width: param.origin.width,
      height: param.origin.height,
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
}
