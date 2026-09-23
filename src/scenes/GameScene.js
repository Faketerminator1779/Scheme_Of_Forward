import { Container, Graphics, Sprite, Text, Rectangle } from 'pixi.js';
import { Scene } from './Scene.js';

import mapStart from '../data/mapStart.json'
import mapRooms from '../data/mapRooms.json'

import { Knight } from '../objects/Knight.js'

import { Pilar } from '../objects/Pilar.js'


export class GameScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);


        this.isDefeated = false;
        this.defeatOverlay = new Container()
        this.defeatOverlay.visible = false
        this.container.addChild(this.defeatOverlay)

        this.objectContainer = new Container()
        this.objectContainer.sortableChildren = true
        this.camera.addChild(this.objectContainer)

        this.playerContainer = new Container()
        this.objectContainer.addChild(this.playerContainer)

        this.playerContainer.x = 0
        this.playerContainer.y = 0

        this.player = new Knight()
        this.playerContainer.addChild(this.player)
        this.playerCurrentheight = 0
        this.playerCurrentRecord = 0
        
        this.mapPlayerPosition = { x: 0, y: 0}
        this.mapPlayerRoom = 0
        this.mapPlayerMaxRoom = 0

        this.camera.x = 164
        this.camera.y = 528

        this.moveDistance = 48
        this.moveSpeed = 6
        this.isMoving = false;
        this.targetX = this.playerContainer.x
        this.targetY = this.playerContainer.y
        this.jumpHeight = 15
        this.jumpProgress = 0

        this.gameStart = false

        this.map = []
        this.mapLayout = []
        this.mapLayoutOffset = []
        this.mapLayoutObjects = []
        this.exitTile = {x: 0, y: 0}
        this.mapHeight = 0
        this.numberOfRooms = 0

        this.moveQueue = []

        window.addEventListener('keydown', (event) => { 
            this.gameStart = true

            if (event.repeat) return;

            if (event.key === 'ArrowUp' || event.key === 'w') {
                this.handleMove('up')
            } 

            if (event.key === 'ArrowDown' || event.key === 's') { 
                this.handleMove('down')
            }

            if (event.key === 'ArrowLeft' || event.key === 'a') { 
                this.handleMove('left')
            } 

            if (event.key === 'ArrowRight' || event.key === 'd') {
                this.handleMove('right')
            }
        }); 

        this.touchScreenStarted = false

        this.touchStartX = 0
        this.touchStartY = 0

        this.touchMinDistance = 30

        this.gameTouchArea = new Container()
        this.gameTouchArea.eventMode = 'static'
        this.gameTouchArea.hitArea = new Rectangle(0,0,360,640)

        this.container.addChild(this.gameTouchArea)

        this.gameTouchArea.on('pointerdown', (event) => {
            if (this.touchScreenStarted == false) {
                this.touchScreenStarted = true
            }
            this.gameStart = true
            this.touchStartX = event.global.x
            this.touchStartY = event.global.y
        })

        this.gameTouchArea.on('pointerup', (event) => {
            if (!this.touchScreenStarted) return
            this.handleSwipe(event)
        })

        this.gameTouchArea.on('pointerupoutside', (event) => {
            if (!this.touchScreenStarted) return
            this.handleSwipe(event)
        })

        this.initiateMap()
    }

    handleSwipe(event) {
        const dx = event.global.x - this.touchStartX
        const dy = event.global.y - this.touchStartY

        if (Math.abs(dx) < this.touchMinDistance && Math.abs(dy) < this.touchMinDistance) return

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                this.handleMove('right')
            } else {
                this.handleMove('left')
            }
        } else {
            if (dy > 0) {
                this.handleMove('down')
            } else {
                this.handleMove('up')
            }
        }
    }

    getObjectAt(x, y, room) {
        return this.mapLayoutObjects[room]?.find(object => 
            object.mapX === x &&
            object.mapY === y
        )
    }

    handleMove(direction) {
        if (this.isMoving) {
            this.moveQueue.push(direction)
            return
        }

        if (direction === 'up') {
            this.player.move('up')
            
            if (this.mapPlayerPosition.y == 0) {
                const targetX = this.mapPlayerPosition.x - this.mapLayoutOffset[this.mapPlayerRoom + 1].x + this.mapLayoutOffset[this.mapPlayerRoom].x
                const targetY = this.mapLayout[this.mapPlayerRoom + 1].length - 1
                const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom + 1)
                if (object) return

                this.playerContainer.zIndex--
                this.mapPlayerPosition.y = this.mapLayout[this.mapPlayerRoom + 1].length - 1
                this.mapPlayerPosition.x = this.mapPlayerPosition.x - this.mapLayoutOffset[this.mapPlayerRoom + 1].x + this.mapLayoutOffset[this.mapPlayerRoom].x 
                this.mapPlayerRoom++

                if(this.mapPlayerRoom > this.mapPlayerMaxRoom) {
                    this.mapPlayerMaxRoom++
                    this.generateRoom()
                }
            } else {
                const targetX = this.mapPlayerPosition.x
                const targetY = this.mapPlayerPosition.y - 1
                const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom)
                if (object) return

                this.playerContainer.zIndex--
                this.mapPlayerPosition.y--
            }
            this.move(0, -this.moveDistance)
            this.playerCurrentheight++
            if (this.playerCurrentRecord == this.playerCurrentheight - 1) {
                this.playerCurrentRecord = this.playerCurrentheight
            }
        }

        if (direction === 'down') {
            
            this.player.move('down')
            if (this.mapPlayerPosition.y == this.mapLayout[this.mapPlayerRoom].length -1) {
                const targetX = this.mapPlayerPosition.x + this.mapLayoutOffset[this.mapPlayerRoom].x - this.mapLayoutOffset[this.mapPlayerRoom -1].x
                const targetY = 0
                const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom - 1)
                if (object) return

                this.playerContainer.zIndex++
                this.mapPlayerPosition.y = 0
                this.mapPlayerPosition.x = this.mapPlayerPosition.x + this.mapLayoutOffset[this.mapPlayerRoom].x - this.mapLayoutOffset[this.mapPlayerRoom -1].x 
                this.mapPlayerRoom--
            } else {
                const targetX = this.mapPlayerPosition.x
                const targetY = this.mapPlayerPosition.y + 1
                const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom)
                if (object) return

                this.playerContainer.zIndex++
                this.mapPlayerPosition.y++
            }
            this.move(0, this.moveDistance)
            this.playerCurrentheight--
        }

        if (direction === 'left') {
            this.player.move('left')

            const targetX = this.mapPlayerPosition.x - 1
            const targetY = this.mapPlayerPosition.y
            const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom)
            if (object) return

            this.mapPlayerPosition.x--
            this.move(-this.moveDistance, 0)
        }

        if (direction === 'right') {
            this.player.move('right')

            const targetX = this.mapPlayerPosition.x + 1
            const targetY = this.mapPlayerPosition.y
            const object = this.getObjectAt(targetX, targetY, this.mapPlayerRoom)
            if (object) return

            this.mapPlayerPosition.x++ 
            this.move(this.moveDistance, 0); 
        }
    }

    move(dx, dy) { 
        this.targetX = this.playerContainer.x + dx
        this.targetY = this.playerContainer.y + dy

        this.jumpProgress = 0
        this.isMoving = true
    }

    createStartMapObject(object, roomIndex, roomHeight, xOffSet = 0, yOffset = 0) {
        let sprite
        switch (object.name) {
            case 'pilar':
                sprite = new Pilar()
                break
            default:
                return
        }
        sprite.x = (object.x + xOffSet) * 48 + 3
        sprite.y = (object.y - yOffset) * 48 + 3
        sprite.zIndex = -(roomHeight - object.y + yOffset)
        this.objectContainer.addChild(sprite)

        this.mapLayoutObjects[roomIndex].push({
            type: object.name,
            mapX: object.x,
            mapY: object.y,
            sprite: sprite
        })
    }

    createMapObject(object, roomIndex, roomHeight, xOffSet = 0, yOffset = 0) {
        let sprite
        switch (object.name) {
            case 'pilar':
                sprite = new Pilar()
                break
            default:
                return
        }
        sprite.x = (object.x + xOffSet) * 48 + 3
        sprite.y = (object.y - yOffset -1) * 48 + 3
        sprite.zIndex = -(roomHeight - object.y + yOffset)
        this.objectContainer.addChild(sprite)

        this.mapLayoutObjects[roomIndex].push({
            type: object.name,
            mapX: object.x,
            mapY: object.y,
            sprite: sprite
        })
    }

    initiateMap() {
        const startPlace = mapStart.schemas[Math.floor(Math.random() * mapStart.schemas.length)]
        this.playerContainer.zIndex = -startPlace.startTileY
        this.mapLayout.push(startPlace.tiles)
        const mapContainer = new Container()
        this.camera.addChildAt(mapContainer, 0)
        for (let row = 0; row < startPlace.height; row++) {
            for (let col = 0; col < startPlace.width; col++) {
                if (startPlace.tiles[row][col] == 0) {

                } else {
                    let tile
                    switch (startPlace.tiles[row][col]) {
                        case 10:
                            tile = Sprite.from('tile')
                            break;
                        case 11:
                            tile = Sprite.from('tileArrowUp')
                            break;
                        case 12:
                            tile = Sprite.from('tileArrowDown')
                            break;
                        case 13:
                            tile = Sprite.from('tileArrowLeft')
                            break;
                        case 14:
                            tile = Sprite.from('tileArrowRight')
                            break;
                            
                    }
                    tile.x = 48 * col
                    tile.y = 48 * row
                    tile.width = 51;
                    tile.height = 102;

                    mapContainer.addChild(tile)
                }
            }
        }

        this.mapLayoutObjects.push([])
        startPlace.objects.forEach(object => {
            this.createStartMapObject(object, 0, startPlace.height)
        });

        this.map.push(mapContainer)
        this.mapLayoutOffset.push({x: 0, y: 0})
        this.mapPlayerPosition.x = startPlace.startTileX
        this.mapPlayerPosition.y = startPlace.startTileY
        
        this.playerContainer.x = startPlace.startTileX * 48 + 3
        this.playerContainer.y = startPlace.startTileY * 48 + 3
        
        this.exitTile.x = startPlace.exitTileX
        this.exitTile.y = startPlace.exitTileY

        this.mapHeight += startPlace.height

        this.camera.x = 180 - this.playerContainer.x - 16
        this.camera.y = 180 - this.playerContainer.y + 200
        this.generateRoom()
        this.generateRoom()
        this.generateRoom()
    }

    generateRoom() {
        const room = mapRooms.schemas[Math.floor(Math.random() * mapRooms.schemas.length)]
        const mapContainer = new Container()
        this.camera.addChildAt(mapContainer, 0)
        this.mapLayout.push(room.tiles)
        const xOffSet = this.mapLayoutOffset[this.numberOfRooms].x - room.startTileX + this.exitTile.x
        const yOffset = this.mapHeight
        this.mapHeight += room.height
        this.mapLayoutOffset.push({x: xOffSet, y: yOffset })
        for (let row = 0; row < room.height; row++) {
            for (let col = 0; col < room.width; col++) {
                if (room.tiles[row][col] == 0) {

                } else {
                    let tile
                    switch (room.tiles[row][col]) {
                        case 10:
                            tile = Sprite.from('tile')
                            break;
                        case 11:
                            tile = Sprite.from('tileArrowUp')
                            break;
                        case 12:
                            tile = Sprite.from('tileArrowDown')
                            break;
                        case 13:
                            tile = Sprite.from('tileArrowLeft')
                            break;
                        case 14:
                            tile = Sprite.from('tileArrowRight')
                            break;
                            
                    }
                    tile.x = 48 * (col + xOffSet)
                    tile.y = 48 * (row - yOffset - 1)
                    tile.width = 51;
                    tile.height = 102;

                    mapContainer.addChild(tile)
                }
            }
        }
        
        
        this.exitTile.x = room.exitTileX
        this.exitTile.y = room.exitTileY
        this.numberOfRooms++
        this.mapLayoutObjects.push([])
        room.objects.forEach(object => {
            this.createMapObject(object, this.numberOfRooms, room.height,xOffSet, yOffset)
        });
    }

    defeat() {
        this.isDefeated = true;
        this.defeatOverlay.removeChildren()

        const background = new Graphics()

        background.rect(0,0,360,640)
        background.fill({color: 0x000000, alpha: 0.7})

        this.defeatOverlay.addChild(background)

        this.defeatOverlay.visible = true

        this.isMoving = false
        const title = new Text({
            text: 'YOU DIED',
            style: {
                fontSize: 40,
                fill: 0xffffff
            }
        });

        title.anchor.set(0.5);
        title.x = 180;
        title.y = 120;

        this.defeatOverlay.addChild(title);

        const score = new Text({
            text: `Height: ${this.playerCurrentRecord}`,
            style: {
                fontSize: 20,
                fill: 0xffffff
            }
        });

        score.anchor.set(0.5);
        score.x = 180;
        score.y = 180;

        this.defeatOverlay.addChild(score);
    }

    onPlayerEnterTile() {
        const tile = this.mapLayout[this.mapPlayerRoom][this.mapPlayerPosition.y][this.mapPlayerPosition.x]
        if (!tile || tile == undefined) {
            this.defeat()
        }
    }

    update(delta) {
        if (this.isDefeated) return;

        if (this.isMoving) {
            const step = this.moveSpeed * delta

            const dx = this.targetX - this.playerContainer.x
            const dy = this.targetY - this.playerContainer.y

            const distance = Math.sqrt(dx * dx + dy * dy)

            const progress = 1 - distance / this.moveDistance

            const jump = Math.sin(progress * Math.PI)

            this.player.y = -jump * this.jumpHeight

            if (distance <= step) {
                this.playerContainer.x = this.targetX
                this.playerContainer.y = this.targetY

                this.player.y = 0

                this.isMoving = false
                this.onPlayerEnterTile()

                if (this.moveQueue.length > 0 && !this.isDefeated) {
                    const nextMove = this.moveQueue.shift()
                    this.handleMove(nextMove)
                }
            } else {
                this.playerContainer.x += (dx / distance) * step
                this.playerContainer.y += (dy / distance) * step
            }
        }

        if (this.gameStart) {
            this.camera.x = 180 - this.playerContainer.x - 16
            this.camera.y = 180 - this.playerContainer.y + 200
            //this.camera.y += 0.5 * delta
        }

    }
}