import {expect} from 'chai'
import {GraphicAssets} from "../src/assetMapping/graphicAssets";

describe("Graphic Assets", () => {
  it("Can look up assets", () => {
    const gfxAssets = new GraphicAssets();
    gfxAssets.setAsset("sand", "assets/sand_image.png")

    const sandAssetName = gfxAssets.getAsset("sand")
    expect(sandAssetName).to.equal("assets/sand_image.png")
  })

  it('Can be created with multiple assets', () => {
    const gfxAssets = new GraphicAssets({
      "sand": "assets/sand_image.png",
      "sea": "assets/ocean.png",
      "footstep": "assets/audio/running.mp3",
    })

    expect(gfxAssets.getAsset("sand")).to.equal("assets/sand_image.png")
    expect(gfxAssets.getAsset("sea")).to.equal("assets/ocean.png")
    expect(gfxAssets.getAsset("footstep")).to.equal("assets/audio/running.mp3")
  })

  it('Will return undefined if there is no key', () => {
    const gfxAssets = new GraphicAssets({
      "sea": "assets/ocean.png"
    })

    expect(gfxAssets.getAsset("sand")).to.be.undefined
  })

  it('Will overwrite keys', () => {
    const gfxAssets = new GraphicAssets({
      "sea": "assets/ocean.png"
    })
    gfxAssets.setAsset("sea", "assets/water.jpg")
    expect(gfxAssets.getAsset("sea")).to.equal("assets/water.jpg")
  })
})