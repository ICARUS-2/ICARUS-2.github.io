import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameEntity from "./GameEntity.js";
import TrackingEnemy from "./TrackingEnemy.js";
import Animation from "../../lib/Animation.js";


export default class WaveEnemy extends GameEntity
{
    static SPRITE_INDICES = 
    {
        Down: [0, 1],
        Right: [2, 3],
        Up: [4, 5],
        Left: [6, 7]
    }

    static ANIMATION_DELAY = 0.15;

    static SIZE = 32;
    static HITBOX_OFFSET = 10;
    static GENERATOR_OFFSET = 5;

    constructor()
    {
        super();

        this.dimensions = new Vector(WaveEnemy.SIZE, WaveEnemy.SIZE);

        this.sprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.WaveEnemySpriteSheet),
        TrackingEnemy.SIZE, TrackingEnemy.SIZE)
    
        this.animations = 
        {
            [Direction.Up]: new Animation([WaveEnemy.SPRITE_INDICES.Up[0], WaveEnemy.SPRITE_INDICES.Up[1]], WaveEnemy.ANIMATION_DELAY),
            [Direction.Down]: new Animation([WaveEnemy.SPRITE_INDICES.Down[0], WaveEnemy.SPRITE_INDICES.Down[1]], WaveEnemy.ANIMATION_DELAY),
            [Direction.Left]: new Animation([WaveEnemy.SPRITE_INDICES.Left[0], WaveEnemy.SPRITE_INDICES.Left[1]], WaveEnemy.ANIMATION_DELAY),
            [Direction.Right]: new Animation([WaveEnemy.SPRITE_INDICES.Right[0], WaveEnemy.SPRITE_INDICES.Right[1]], WaveEnemy.ANIMATION_DELAY),
        }

        this.currentAnimation = this.animations[Direction.Down];
        this.direction = Direction.Down;
        this.speed = 70;
        this.level = null;
    }

    update(dt)
    {
        this.speed = TrackingEnemy.BASE_SPEED + (TrackingEnemy.BASE_SPEED * this.level.levelNumber/TrackingEnemy.SPEED_SCALAR);
        this.updateAndSetHitbox();

        switch(this.direction)
        {
            case Direction.Up:
                this.position.set(this.position.x, this.position.y - this.speed * dt);
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
        this.currentFrame = this.currentAnimation.currentFrame;
    }

    updateAndSetHitbox()
    {
        this.hitbox.set(
            this.position.x + this.hitboxOffsets.position.x + WaveEnemy.HITBOX_OFFSET,
            this.position.y + this.hitboxOffsets.position.y + WaveEnemy.HITBOX_OFFSET - 2,
            this.dimensions.x / 3 + this.hitboxOffsets.dimensions.x / 3,
            this.dimensions.y / 3 + this.hitboxOffsets.dimensions.y / 3,
        );
    }
}