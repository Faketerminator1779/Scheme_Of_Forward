import { Game } from './core/Game.js';
import { Assets, TextureStyle } from 'pixi.js';

const game = new Game();

TextureStyle.defaultOptions.scaleMode = 'nearest'

await Assets.load([
    '/assets/map/tiles.json',
    '/assets/characters/knight.json',
    '/assets/objects/pilar.json'
]);


game.start();