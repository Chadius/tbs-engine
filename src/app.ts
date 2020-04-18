import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import {MapDrawingScene} from "./mapDrawingScene/mapDrawing";

const config: GameConfig = {
  title: "TBS",
  width: 800,
  height: 600,
  parent: "game",
  scene: [MapDrawingScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#a66db1",
};
export class TBSGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  const game = new TBSGame(config);
};