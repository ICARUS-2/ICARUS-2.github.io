import Sprite from "../../lib/Sprite.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";
import Vector from "../../lib/Vector.js";
import Player from "./Player.js";
import Level from "../objects/Level.js";

export default class TrackingEnemy extends GameEntity{
    static SPRITE_INDICES  = {
        Down: [0, 1, 2, 3],
        Left: [12, 13, 14, 15],
        Right: [4, 5, 6, 7],
        Up: [8, 9, 10, 11]
    }
    static ANIMATION_DELAY = 0.15;

    static SIZE = 32;
    static HITBOX_OFFSET = 8;

    static BASE_SPEED = 30;

    static MAX_SPEED = 60;

    static SPEED_SCALAR = 5;

    constructor(){
        super();

        this.dimensions = new Vector(TrackingEnemy.SIZE, TrackingEnemy.SIZE)

        this.sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.TrackerEnemySpriteSheet), TrackingEnemy.SIZE, TrackingEnemy.SIZE);
        this.animations = 
        {
            [Direction.Up]: new Animation([TrackingEnemy.SPRITE_INDICES.Up[0], TrackingEnemy.SPRITE_INDICES.Up[1], TrackingEnemy.SPRITE_INDICES.Up[2], TrackingEnemy.SPRITE_INDICES.Up[3]], TrackingEnemy.ANIMATION_DELAY),
            [Direction.Down]: new Animation([TrackingEnemy.SPRITE_INDICES.Down[0], TrackingEnemy.SPRITE_INDICES.Down[1], TrackingEnemy.SPRITE_INDICES.Down[2], TrackingEnemy.SPRITE_INDICES.Down[3]], TrackingEnemy.ANIMATION_DELAY),
            [Direction.Left]: new Animation([TrackingEnemy.SPRITE_INDICES.Left[0], TrackingEnemy.SPRITE_INDICES.Left[1], TrackingEnemy.SPRITE_INDICES.Left[2], TrackingEnemy.SPRITE_INDICES.Left[3]], TrackingEnemy.ANIMATION_DELAY),
            [Direction.Right]: new Animation([TrackingEnemy.SPRITE_INDICES.Right[0], TrackingEnemy.SPRITE_INDICES.Right[1], TrackingEnemy.SPRITE_INDICES.Right[2], TrackingEnemy.SPRITE_INDICES.Right[3]], TrackingEnemy.ANIMATION_DELAY),
        }

        this.currentAnimation = this.animations[Direction.Down];

        this.speed = TrackingEnemy.BASE_SPEED;
        this.level = null;
    }
    
    update(dt){
        this.speed = Math.min(TrackingEnemy.BASE_SPEED + (TrackingEnemy.BASE_SPEED * this.level.levelNumber/TrackingEnemy.SPEED_SCALAR), TrackingEnemy.MAX_SPEED);
        this.updateAndSetHitbox();
        let verticalDiff = Math.abs(this.level.player.hitbox.position.y - Player.HEIGHT - this.hitbox.position.y);
        let horizontalDiff = Math.abs(this.level.player.hitbox.position.x - this.hitbox.position.x);

        if (verticalDiff > horizontalDiff){
            if (this.level.player.position.y - Player.HEIGHT / 2 > this.position.y){
                this.direction = Direction.Down;
                this.currentAnimation = this.animations[Direction.Down];
            }
            else{
                this.direction = Direction.Up;
                this.currentAnimation = this.animations[Direction.Up]
            }
        }
        else{
            if (this.level.player.position.x - Player.WIDTH / 2 > this.position.x){
                this.direction = Direction.Right;
                this.currentAnimation = this.animations[Direction.Right];
            }
            else{
                this.direction = Direction.Left;
                this.currentAnimation = this.animations[Direction.Left];
            }
        }

        switch(this.direction){
            case Direction.Up:
                this.position.set(this.position.x, this.position.y - this.speed*dt);
                break;
            case Direction.Down:
                this.position.set(this.position.x, this.position.y + this.speed*dt)
                break;
            case Direction.Left:
                this.position.set(this.position.x - this.speed*dt, this.position.y)
                break;
            case Direction.Right:
                this.position.set(this.position.x + this.speed*dt, this.position.y)
                break;
        }

        this.currentAnimation.update(dt);
    }

    updateAndSetHitbox()
    {
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x + TrackingEnemy.HITBOX_OFFSET,
			this.position.y + this.hitboxOffsets.position.y + TrackingEnemy.HITBOX_OFFSET * 2 - 2,
			this.dimensions.x / 2 + this.hitboxOffsets.dimensions.x / 2,
			this.dimensions.y / 4 + this.hitboxOffsets.dimensions.y / 4,
		);
    }
    
}