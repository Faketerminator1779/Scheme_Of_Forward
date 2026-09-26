import { Sprite, Container, Graphics } from 'pixi.js';

export class Pilar extends Container {

    constructor() {
        super();

        this.sprite = Sprite.from('pilar')

        this.sprite.width = 51;
        this.sprite.height = 102;

        this.sprite.anchor.set(0.5, 0.75)



        this.addChild(this.sprite)

        /*
        this.circle = new Graphics()
        this.circle.circle(0,0,25)
        this.circle.fill({color:0xff0000})
        this.addChildAt(this.circle, 0)
        */

        this.pushable = false
    }
}