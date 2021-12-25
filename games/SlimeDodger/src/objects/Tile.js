import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Tile {
	static TILE_SIZE = 16;

	/**
	 * Represents one tile in the Tilemap and on the screen.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {Sprite} sprite
	 */
	constructor(x, y, xOffset, yOffset, sprite) {
		this.position = new Vector(x, y);
		this.canvasPosition = new Vector(x * Tile.TILE_SIZE + xOffset, y * Tile.TILE_SIZE + yOffset);
		this.dimensions = new Vector(Tile.TILE_SIZE, Tile.TILE_SIZE);
		this.sprite = sprite;
	}

	render() {
		this.sprite.render(this.canvasPosition.x, this.canvasPosition.y);
	}
}
