import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import {GameScene} from "./starFallScenes/gameScene";
import {WelcomeScene} from "./starFallScenes/welcomeScene";
import {ScoreScene} from "./starFallScenes/scoreScene";

const config: GameConfig = {
  title: "Starfall",
  width: 800,
  height: 600,
  parent: "game",
  scene: [WelcomeScene, GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};
export class StarfallGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  const game = new StarfallGame(config);
};