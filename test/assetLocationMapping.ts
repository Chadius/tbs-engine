import {expect} from 'chai'
import {AssetLocationMapping} from "../src/assetMapping/assetLocationMapping";

describe("Graphic Assets", () => {
  it("Can look up assets", () => {
    const gfxAssets = new AssetLocationMapping();
    gfxAssets.setAsset("sand", "assets/sand_image.png")

    const sandAssetName = gfxAssets.getAsset("sand")
    expect(sandAssetName).to.eql("assets/sand_image.png")
  })

  it('Can be created with multiple assets', () => {
    const gfxAssets = new AssetLocationMapping(
      [
        {
          name: "sand",
          location: "assets/sand_image.png",
        },
        {
          name: "sea",
          location: "assets/ocean.png",
        },
        {
          name: "footstep",
          location: "assets/audio/running.mp3",
        }
      ])

    expect(gfxAssets.getAsset("sand")).to.eql("assets/sand_image.png")
    expect(gfxAssets.getAsset("sea")).to.eql("assets/ocean.png")
    expect(gfxAssets.getAsset("footstep")).to.eql("assets/audio/running.mp3")
  })

  it('Will return undefined if there is no key', () => {
    const gfxAssets = new AssetLocationMapping([{
      name: "sea", location: "assets/ocean.png"
    }])

    expect(gfxAssets.getAsset("sand")).to.be.undefined
  })

  it('Will overwrite keys', () => {
    const gfxAssets = new AssetLocationMapping([{
      name: "sea", location: "assets/ocean.png"
    }])
    gfxAssets.setAsset("sea", "assets/water.jpg")
    expect(gfxAssets.getAsset("sea")).to.eql("assets/water.jpg")
  })

  it('Returns all name locaiton pairs', () => {
    const assets = new AssetLocationMapping([
      {
        name: "sea", location: "assets/ocean.png"
      },
      {
        name: "footstep",
        location: "assets/audio/running.mp3",
      }
    ])
    expect(assets.getAssetNameLocaitonPairs()).to.eql([
        {
          name: "sea", location: "assets/ocean.png"
        },
        {
          name: "footstep",
          location: "assets/audio/running.mp3",
        }
      ]
    )
  })
})