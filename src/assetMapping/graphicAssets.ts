export class GraphicAssets {
  assetMapping: Map<string, string>

  constructor(assetNameLocationPairs?: Array<{name: string; location: string}>) {

    this.assetMapping = new Map<string, string>()
    if (assetNameLocationPairs) {
      assetNameLocationPairs.forEach(nameLocationPair => {
        this.setAsset(nameLocationPair.name, nameLocationPair.location)
      })
    }
  }

  setAsset(key: string, assetName: string): void{
    this.assetMapping.set(key, assetName)
  }

  getAsset(key: string): string {
    return this.assetMapping.get(key)
  }
}