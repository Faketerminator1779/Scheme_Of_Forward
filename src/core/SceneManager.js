export class SceneManager {
  constructor(app) {
    this.app = app;
    this.currentScene = null;
  }

  changeScene(newScene) {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.app.stage.removeChildren();
    }

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene.container);
  }

  update(delta) {
    if (this.currentScene?.update) {
      this.currentScene.update(delta);
    }
  }
}