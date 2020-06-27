export class TerrainTileGraphic {
  name: string;
  imageResource: string;

  constructor(params: { name: string; imageResource: string}) {
    this.name = params.name
    this.imageResource = params.imageResource
  }

  getImageResource(): string {
    return this.imageResource
  }

  getName(): string {
    return this.name
  }
}