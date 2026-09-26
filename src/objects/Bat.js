import { Container, Sprite, Graphics } from "pixi.js";

export class Bat extends Container {
    constructor(range = 30, speed = 0.04, onHit, direction) {
        super()

        this.onHit = onHit

        this.range = range
        this.speed = speed
        this.progres = 0
        this.wiggleTime = 0
        this.direction = direction

        /*
        this.circle = new Graphics()
        this.circle.circle(0,0,15)
        this.circle.fill({color:0xff0000})
        this.addChildAt(this.circle, 0)
        */

        this.sprite = Sprite.from('bat')

        this.sprite.width = 90
        this.sprite.height = 45

        this.sprite.anchor.set(0.5)

        this.addChild(this.sprite)
    }

    update(delta, player, defeat) {
        if (defeat) return

        this.progres += this.speed * delta;

        switch (this.direction){ 
            case "CLOCK":
                this.sprite.x = Math.cos(this.progres) * this.range
                this.sprite.y = Math.sin(this.progres) * this.range
                break
            case "UN_CLOCK":
                console.log("E")
                this.sprite.x = Math.cos(-this.progres) * this.range
                this.sprite.y = Math.sin(-this.progres) * this.range
                break
        }

        const enemyPosition = this.sprite.getGlobalPosition();
        const playerPosition = player.getGlobalPosition();
        
        const dx = enemyPosition.x - playerPosition.x;
        const dy = enemyPosition.y - playerPosition.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        this.wiggleTime += delta
        this.sprite.rotation = Math.sin(this.wiggleTime * 0.15) * 0.2
    
        /*
        this.circle.x = this.sprite.x
        this.circle.y = this.sprite.y
        */

        if (distance < 15) {
            this.onHit();
        }
    }
}