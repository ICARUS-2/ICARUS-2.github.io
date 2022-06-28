import Vector from "../../lib/Vector.js";
import SoundName from "../enums/SoundName.js";
import { sounds } from "../globals.js";
import GameObject from "./GameObject.js";
import Tile from "./Tile.js";

export default class Door extends GameObject{
	static VERTICAL_WIDTH = 16;
	static VERTICAL_HEIGHT = 32;

    static CLOSED_DOOR = 41;
    static OPEN_DOOR = 42;

    constructor(dimensions, position, level = null) {
		super(dimensions, position);

		this.level = level;
		this.isOpen = false;
		this.isCollidable = true;
	}

    render(){
		this.sprites[this.currentFrame].render(Math.floor(this.position.x), Math.floor(this.position.y));
		this.sprites[this.currentFrame].render(Math.floor(this.position.x + Tile.TILE_SIZE), Math.floor(this.position.y));
    }

	setLevelAndSprites(level)
	{
		this.level = level;
		this.openSprite = this.level.sprites[Door.OPEN_DOOR];
		this.closeSprite = this.level.sprites[Door.CLOSED_DOOR];
		this.sprites = [this.closeSprite, this.openSprite];
	}

    open() {
		if (!this.isOpen) {
			this.isOpen = true;
		    this.currentFrame = 1;
            sounds.play(SoundName.DoorOpen)
		}
	}
}