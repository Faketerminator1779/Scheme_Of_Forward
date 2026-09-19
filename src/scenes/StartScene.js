import { Text } from 'pixi.js';
import { Scene } from './Scene.js';
import { GameScene } from './GameScene.js';

export class StartScene extends Scene {
  constructor(sceneManager) {
    super(sceneManager);

    this.time = 0

    this.title = new Text({
      text: 'SCHEME OF FORWARD',
      style: {
        fill: '#ffffff',
        fontSize: 28,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        align: 'center'
      }
    });

    this.title.anchor.set(0.5);
    this.title.position.set(180, 180);

    this.startButton = new Text({
      text: 'START',
      style: {
        fill: '#00ff88',
        fontSize: 36,
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }
    });

    this.startButton.anchor.set(0.5);
    this.startButton.position.set(180, 320);

    this.startButton.eventMode = 'static';
    this.startButton.cursor = 'pointer';

    this.startButton.on('pointerdown', () => {
      this.sceneManager.changeScene(
        new GameScene(this.sceneManager)
      );
    });

    

    this.container.addChild(
      this.title,
      this.startButton
    );
  }
  
  update(delta) {
    this.time += delta;

    this.title.y = 180 + Math.sin(this.time * 0.1) * 8
  }
}