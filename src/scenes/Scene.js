import { Container } from 'pixi.js';

export class Scene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager
    this.container = new Container()
    this.camera = new Container()
    this.container.addChild(this.camera)
  }

  update() {}

  destroy() {
    this.container.destroy({
      children: true
    });
  }
}