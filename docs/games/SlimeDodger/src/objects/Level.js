import Sprite from "../../lib/Sprite.js"
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import ObjectType from "../enums/ObjectType.js";
import ObjectFactory from "../factories/ObjectFactory.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, currentScoreKey, highScoreKey, images, sounds, stateMachine, timer } from "../globals.js";
import Door from "./Door.js";
import Tile from "./Tile.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Coin from "./Coin.js";
import GameStateName from "../enums/GameStateName.js";
import EntityFactory from "../factories/EntityFactory.js";
import EntityType from "../enums/EntityType.js";
import WaveEnemy from "../entities/WaveEnemy.js";
import Direction from "../enums/Direction.js";
import SoundName from "../enums/SoundName.js";

export default class Level{
    static TOP_RIGHT_WALL_CORNER = 3;
    static TOP_LEFT_WALL_CORNER = 0;
    static BOTTOM_LEFT_WALL_CORNER = 48;
    static BOTTOM_RIGHT_WALL_CORNER = 51;

    static TOP_WALL_EDGES = [1,2];
    static RIGHT_WALL_EDGES = [19, 35];
    static LEFT_WALL_EDGES = [16, 32];
    static BOTTOM_WALL_EDGES = [49,50];
    
    static INNER_WALLS = [6,7,17,18];
    
    static FLOOR_TILES = [20,21,33,34,36];

    static TILE_EMPTY = 36;

    static DOOR_SHADOW = 85;

    static WIDTH = CANVAS_WIDTH / Tile.TILE_SIZE - 2;
	static HEIGHT = Math.floor(CANVAS_HEIGHT / Tile.TILE_SIZE);
	static RENDER_OFFSET_X = (CANVAS_WIDTH - (Level.WIDTH * Tile.TILE_SIZE)) / 2;
	static RENDER_OFFSET_Y = (CANVAS_HEIGHT - (Level.HEIGHT * Tile.TILE_SIZE)) / 2;

	static TOP_EDGE = Level.RENDER_OFFSET_Y + Tile.TILE_SIZE;
	static BOTTOM_EDGE = CANVAS_HEIGHT - Level.RENDER_OFFSET_Y - Tile.TILE_SIZE;
	static LEFT_EDGE = Level.RENDER_OFFSET_X + Tile.TILE_SIZE;
	static RIGHT_EDGE = CANVAS_WIDTH - Tile.TILE_SIZE * 2;
	static CENTER_X = Math.floor(Level.LEFT_EDGE + ((Level.RIGHT_EDGE - Level.LEFT_EDGE) / 2));
	static CENTER_Y = Math.floor(Level.TOP_EDGE + ((Level.BOTTOM_EDGE - Level.TOP_EDGE) / 2));

	static COIN_COUNT = 15;
	static WAVE_LENGTH = 22;

    constructor(player, levelNumber = 1){
		this.dimensions = new Vector(Level.WIDTH, Level.HEIGHT);
        this.sprites = Sprite.generateSpritesFromSpriteSheet(
        images.get(ImageName.LevelSpriteSheet), 
        Tile.TILE_SIZE, 
        Tile.TILE_SIZE);
		this.tiles = this.generateLevel();
        this.door = ObjectFactory.createInstance(ObjectType.Door)
		// @ts-ignore
		this.door.setLevelAndSprites(this)
		this.player = player;
		this.levelNumber = levelNumber;
        this.playerDidWalkThruDoor = false;

		this.coins = this.generateCoins();
        this.trackers = this.generateTrackers();
		this.waveEnemies = this.generateWaveEnemies(Direction.Down);
	}

	generateWaveEnemies(direction)
	{
		const waveEnemies = [];

		for (let i = 0; i < Level.WAVE_LENGTH; i++)
		{
			let x;
			let y;

			switch(direction)
			{
				case Direction.Down:
					x = getRandomPositiveInteger(Level.LEFT_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET, Level.RIGHT_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET);
					y = Level.TOP_EDGE - 8;
					break;

				case Direction.Up:
					x = getRandomPositiveInteger(Level.LEFT_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET, Level.RIGHT_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET);
					y = Level.BOTTOM_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET;
					break;

				case Direction.Right:
					x = Level.LEFT_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET;
					y = getRandomPositiveInteger(Level.TOP_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET, Level.BOTTOM_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET + 3)
					break;

				case Direction.Left:
					x = Level.RIGHT_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET;
					y = getRandomPositiveInteger(Level.TOP_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET, Level.BOTTOM_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET + 3)
					break;

			}

			let posVector = new Vector(x, y);
			let waveEnemy = EntityFactory.createInstance(EntityType.Wave);
			
			waveEnemy.level = this;
			waveEnemy.position = posVector;
			waveEnemy.direction = direction;
			waveEnemies.push(waveEnemy);
		}
		return waveEnemies;
	}

    generateTrackers() {
        const trackers = [];

        let trackerCount = getRandomPositiveInteger(1, 1);

        for (let i = 0; i < trackerCount; i++) {
            
			let x = getRandomPositiveInteger(Level.LEFT_EDGE + Coin.COIN_WIDTH, Level.RIGHT_EDGE - Coin.COIN_WIDTH * 2);
			let y = getRandomPositiveInteger(Level.TOP_EDGE + Coin.COIN_HEIGHT, Level.BOTTOM_EDGE - Coin.COIN_HEIGHT*2)
			let trackerPosVector = new Vector(x,y)
            let tracker = EntityFactory.createInstance(EntityType.Tracker);
            tracker.level = this;
            tracker.position = trackerPosVector;
            trackers.push(tracker);
        }
        return trackers;
    }

	checkEnemyProgressionComplete()
	{
		switch(this.waveEnemies[0].direction)
		{
			case Direction.Up:
				return (this.waveEnemies[0].position.y <= Level.TOP_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET)

			case Direction.Down:
				return (this.waveEnemies[0].position.y >= Level.BOTTOM_EDGE - WaveEnemy.SIZE / 2)

			case Direction.Left:
				return (this.waveEnemies[0].position.x <= Level.LEFT_EDGE - WaveEnemy.SIZE / 2 + WaveEnemy.GENERATOR_OFFSET)
			
			case Direction.Right:
				return (this.waveEnemies[0].position.x >= Level.RIGHT_EDGE - WaveEnemy.SIZE / 2 - WaveEnemy.GENERATOR_OFFSET)
		}
	}

    cleanUp(){
		this.coins  = this.coins.filter((coin) => !coin.cleanUp);
    }

    openDoors(){
        // @ts-ignore
        this.door.open();
    }

	update(dt)
	{
		this.player.update(dt);

		this.coins.forEach(c =>
			{
				c.update(dt)
                if (c.didCollideWithEntity(this.player.hitbox)){
                    if (!c.wasConsumed){
                        let score = Number(localStorage.getItem(currentScoreKey));
                        localStorage.setItem(currentScoreKey, String(score + 1));
                    }
                    c.onConsume(this.player);
                }
			});

        this.trackers.forEach(t =>{
            t.update(dt);

			if (t.didCollideWithEntity(this.player))
			{
				if (!this.player.isImmune)
				{
                    sounds.play(SoundName.EnemyAttack);
					this.player.receiveDamage();
					this.player.becomeInvulnerable();
				}
			}
        })

		this.waveEnemies.forEach(w =>
			{
				w.update(dt);

				if (w.didCollideWithEntity(this.player.hitbox))
				{
					if(!this.player.isImmune)
					{
                        sounds.play(SoundName.EnemyAttack);
						this.player.receiveDamage();
						this.player.becomeInvulnerable();
					}
				}
			})

		if (this.checkEnemyProgressionComplete())
		{
			let direction = getRandomPositiveInteger(Direction.Up, Direction.Right)

			this.waveEnemies = this.generateWaveEnemies(direction);
		}

        this.cleanUp();

        if (this.coins.length == 0){
            this.openDoors();
        }
        // @ts-ignore
        if (this.door.isOpen && this.door.didCollideWithEntity(this.player.hitbox) && !this.playerDidWalkThruDoor){
            this.changeLevel();
        }
	}

    changeLevel(){
        this.player.isEntering = true;
        this.playerDidWalkThruDoor = true;
        timer.tween(this.player.position, ["y"], [this.door.position.y], 0.2, () => {
            this.player.isEntering = false;
            this.levelNumber++;
            stateMachine.change(GameStateName.Transition, {fromState: stateMachine.states[GameStateName.Play], toState: stateMachine.states[GameStateName.Play]});
        })
    }

    render(){
        this.renderTiles();

        this.door.render();
		
		this.coins.forEach(c =>
			{
				c.render();
			})

        this.trackers.forEach(t => {
            t.render();
        })

		this.waveEnemies.forEach(w =>
			{
				w.render();
			})
		this.player.render();
        this.renderStats();
    }

    renderStats() {
        context.font = "10px game-font";
        context.fillStyle = "white";
        context.fillText(`              Level: ${this.levelNumber} \t Health: ${this.player.health}                                                                                                                      Hi-Score: ${localStorage.getItem(highScoreKey)} \t Score: ${localStorage.getItem(currentScoreKey)}`,10,10);
    }

    renderTiles() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render();
			});
		});
	}

    generateLevel() {
        const tiles = [];

		for (let y = 0; y < this.dimensions.y; y++) {
			tiles.push([]);

			for (let x = 0; x < this.dimensions.x; x++) {
				let tileId = Level.TILE_EMPTY;

				if (x === 0 && y === 0) {
					tileId = Level.TOP_LEFT_WALL_CORNER;
				}
				else if (x === 0 && y === this.dimensions.y - 1) {
					tileId = Level.BOTTOM_LEFT_WALL_CORNER;
				}
				else if (x === this.dimensions.x - 1 && y === 0) {
					tileId = Level.TOP_RIGHT_WALL_CORNER;
				}
				else if (x === this.dimensions.x - 1 && y === this.dimensions.y - 1) {
					tileId = Level.BOTTOM_RIGHT_WALL_CORNER;
				}
				// Random left-hand walls, right walls, top, bottom, and floors.
				else if (x === 0) {
						tileId = Level.LEFT_WALL_EDGES[Math.floor(Math.random() * Level.LEFT_WALL_EDGES.length)];
				}
				else if (x === this.dimensions.x - 1) {
						tileId = Level.RIGHT_WALL_EDGES[Math.floor(Math.random() * Level.RIGHT_WALL_EDGES.length)];
				}
				else if (y === 0) {
					if (x === this.dimensions.x / 2 || x === this.dimensions.x / 2 - 1) {
						tileId = Level.TILE_EMPTY;
					}
					else {
						tileId = Level.TOP_WALL_EDGES[Math.floor(Math.random() * Level.TOP_WALL_EDGES.length)];
					}
				}
				else if (y === this.dimensions.y - 1) {
					if (x === this.dimensions.x / 2 || x === this.dimensions.x / 2 - 1) {
						tileId = Level.DOOR_SHADOW;
					}
					else {
						tileId = Level.BOTTOM_WALL_EDGES[Math.floor(Math.random() * Level.BOTTOM_WALL_EDGES.length)];
					}
				}
				else {
					tileId = Level.FLOOR_TILES[Math.floor(Math.random() * Level.FLOOR_TILES.length)];
				}

				tiles[y].push(new Tile(x, y, Level.RENDER_OFFSET_X, Level.RENDER_OFFSET_Y, this.sprites[tileId]));
			}
		}

		return tiles;
    }

	generateCoins()
	{
		const coins = [];

		for(let i = 0; i < Level.COIN_COUNT; i++)
		{
			let x = getRandomPositiveInteger(Level.LEFT_EDGE + Coin.COIN_WIDTH, Level.RIGHT_EDGE - Coin.COIN_WIDTH * 2);
			let y = getRandomPositiveInteger(Level.TOP_EDGE + Coin.COIN_HEIGHT, Level.BOTTOM_EDGE - Coin.COIN_HEIGHT*2)
			let coinPosVector = new Vector(x,y)

			let coin = ObjectFactory.createInstance(ObjectType.Coin);
			coin.level = this;
			coin.position = coinPosVector;
			coins.push(coin)
		}

		return coins;
	}
}