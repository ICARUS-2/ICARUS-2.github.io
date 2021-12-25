import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import { context, DEBUG } from "../globals.js";

export default class GameEntity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {}) {
		this.position = entityDefinition.position ?? new Vector();
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		this.speed = entityDefinition.speed ?? 1;
		this.totalHealth = entityDefinition.health ?? 1;
		this.damage = entityDefinition.damage ?? 1;
		this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		this.health = this.totalHealth;
		this.stateMachine = null;
		this.currentAnimation = null;
		this.sprites = [];
		this.direction = Direction.Down;
		this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;
	}

	update(dt) {
		this.stateMachine.update(dt);
		this.currentAnimation.update(dt);
		this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		// this.stateMachine.render();
		this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));

		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}
}