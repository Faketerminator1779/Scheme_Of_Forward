import { Sprite } from 'pixi.js';

export class Pilar extends Sprite {

    constructor() {
        super(Sprite.from('pilar'));

        this.width = 45;
        this.height = 90;
    }
}