import { Application } from 'pixi.js';
import { SceneManager } from './SceneManager.js';
import { StartScene } from '../scenes/StartScene.js';

export class Game {
  constructor() {
    this.app = new Application();
    this.sceneManager = null;
  }

  async start() {
    await this.app.init({
      width: 360,
      height: 640,
      background: '#000000',
      antialias: false,
      resolution: 1,
      autoDensity: false
    });

    document.querySelector('#app').appendChild(this.app.canvas);

    this.sceneManager = new SceneManager(this.app);

    this.app.ticker.add((ticker) => {
      this.sceneManager.update(ticker.deltaTime);
    });

    this.sceneManager.changeScene(
      new StartScene(this.sceneManager)
    );
  }
}