import { Sprite, Container } from 'pixi.js';

export class Pilar extends Container {

    constructor() {
        super();

        this.sprite = Sprite.from('pilar')

        this.sprite.width = 45;
        this.sprite.height = 90;

        this.sprite.anchor.set(0, 0.5)

        this.addChild(this.sprite)

        this.pushable = false
        console.log("EEEEEEEEEE")
    }
}