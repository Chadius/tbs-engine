export class GraphicAssets {
  assetMapping: Map<string, string>

  constructor(keysToAsset?: { [key: string]: string} ) {
    this.assetMapping = new Map<string, string>()
    if (keysToAsset) {
      Object.entries(keysToAsset).forEach(pair => {
        this.setAsset(pair[0], pair[1])
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