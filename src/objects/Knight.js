import { AnimatedSprite, Assets, Container, Graphics } from 'pixi.js';

export class Knight extends Container {

    constructor() {
        super();

        this.direction = 'down'

        this.animations = {
            down: this.getFrames('knight_down'),
            up: this.getFrames('knight_up'),
            right: this.getFrames('knight_right'),
            left: this.getFrames('knight_left')
        }

        this.sprite = new AnimatedSprite(this.animations.down)
        this.sprite.width = 45
        this.sprite.height = 90

        this.sprite.anchor.set(0.5, 0.75)

        this.sprite.animationSpeed = 0.1
        this.sprite.loop = true

        this.addChild(this.sprite)

        /*
        this.circle = new Graphics()
        this.circle.circle(0,0,25)
        this.circle.fill({color:0xff0000})
        this.addChildAt(this.circle, 0)
        */

    }

    getFrames(name) {
        const textures = []

        for (let i = 0; i < 4; i++) {
            textures.push(Assets.get(name + ' ' + i))
        }

        return textures
    }

    move(direction) {
        if (!this.sprite) return

        if (this.direction !== direction) {
            
            this.direction = direction

            this.sprite.textures = this.animations[direction]
            this.sprite.animationSpeed = 0.1
            this.sprite.loop = true
            this.sprite.play()

            return
        }

        if (!this.sprite.playing) {
            this.sprite.play()
        }
    }

    stop() {
        if (!this.sprite) return

        this.sprite.stop()
        this.sprite.gotoAndStop(0)
    }
}