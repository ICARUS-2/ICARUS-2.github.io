import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js";
import { CANVAS_WIDTH, context, DEBUG, images, keys, timer } from "../globals.js";
import Hitbox from "../../lib/Hitbox.js";
import Direction from "../enums/Direction.js";
import ImageName from "../enums/ImageName.js";
import Animation from "../../lib/Animation.js";
import Level from "../objects/Level.js";

export default class Player extends GameEntity
{
    static WIDTH = 16;
    static HEIGHT = 16;

    static INVULN_DURATION = 1.5;
    static INVULN_FLASH_INTERVAL = 0.1;
    static MAX_HEALTH = 3;

    static HITBOX_OFFSET_VALUE = 6;

    static ANIMATION_DELAY = 0.15;

    static CHARACTER_SPRITE_INDICES  = {
        Down: [13, 12, 14],
        Left: [28, 27, 29],
        Right: [43, 42, 44],
        Up: [58, 57, 59]
    }
    
    constructor()
    {
        super();

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.PlayerSpriteSheet),
            Player.WIDTH,
            Player.HEIGHT
        )
        
        this.hitboxOffsets = new Hitbox(0, Player.WIDTH, 0, -Player.HEIGHT - Player.HITBOX_OFFSET_VALUE);

        this.dimensions.x = Player.WIDTH;
        this.dimensions.y = Player.HEIGHT;
        this.isImmune = false;
        this.alpha = 1;
        this.invulnerabilityTimer = null;
        this.health = Player.MAX_HEALTH;
        this.isDead = false;
        this.direction = Direction.Down;
        this.currentFrame = Player.CHARACTER_SPRITE_INDICES.Up[0];
        this.positionOffset = {x:0, y:0};
        this.currentAnimation = new Animation([Player.CHARACTER_SPRITE_INDICES.Up[0]], 1)
        this.isWalking = false;
        this.level = null;
        this.isEntering = true;

        this.animations = 
        {
            [Direction.Up]: new Animation([Player.CHARACTER_SPRITE_INDICES.Up[0], Player.CHARACTER_SPRITE_INDICES.Up[1], Player.CHARACTER_SPRITE_INDICES.Up[2]], Player.ANIMATION_DELAY),
            [Direction.Down]: new Animation([Player.CHARACTER_SPRITE_INDICES.Down[0], Player.CHARACTER_SPRITE_INDICES.Down[1], Player.CHARACTER_SPRITE_INDICES.Down[2]], Player.ANIMATION_DELAY),
            [Direction.Left]: new Animation([Player.CHARACTER_SPRITE_INDICES.Left[0], Player.CHARACTER_SPRITE_INDICES.Left[1], Player.CHARACTER_SPRITE_INDICES.Left[2]], Player.ANIMATION_DELAY),
            [Direction.Right]: new Animation([Player.CHARACTER_SPRITE_INDICES.Right[0], Player.CHARACTER_SPRITE_INDICES.Right[1], Player.CHARACTER_SPRITE_INDICES.Right[2]], Player.ANIMATION_DELAY),
        }
        this.speed = 70;
    }

    reset()
    {
        this.position.set(CANVAS_WIDTH / 2 - this.dimensions.x / 2,Level.BOTTOM_EDGE - this.dimensions.y + Player.HITBOX_OFFSET_VALUE *1.5)      
        timer.tween(this.position, ['y'], [this.position.y - Player.HITBOX_OFFSET_VALUE * 1.5], 0.3, ()=>{this.isEntering = false;})
        this.health = Player.MAX_HEALTH;
        this.isDead = false;
        this.alpha = 1;
        this.invulnerabilityTimer?.clear();
        this.direction = Direction.Up;  
        this.isImmune = false;
    }

    receiveDamage(dmg)
    {
        this.health -=dmg;
        this.invulnerabilityTimer = this.startInvulnerabilityTimer();
    }

    startInvulnerabilityTimer()
    {
        const action = () =>
        {
            this.alpha = this.alpha === 1? 0.5 : 1;
        }

        const interval = Player.INVULN_FLASH_INTERVAL;
        const duration = Player.INVULN_DURATION;

        const callback = () =>
        {
            this.alpha = 1;
            this.isImmune = false;
        }

        return timer.addTask(action, interval, duration, callback);
    }

    update(dt)
    {
        this.updateAndSetHitbox();
        if ((!keys.w && !keys.s && !keys.a && !keys.d) || this.isEntering)
        {
            this.isWalking = false;
            return;
        }
        this.isWalking = true;

        this.currentAnimation = this.animations[this.direction];

        if (keys.w)
        {
            this.direction = Direction.Up;
            this.position.set(this.position.x, this.position.y - this.speed*dt);
        
            if (this.position.y <= Level.TOP_EDGE - this.dimensions.y + Player.HITBOX_OFFSET_VALUE) 
            {
				this.position.y = Level.TOP_EDGE - this.dimensions.y + Player.HITBOX_OFFSET_VALUE;
			}
        }
        else if (keys.s)
        {
            this.direction = Direction.Down;
            this.position.set(this.position.x, this.position.y + this.speed*dt);
        
			if (this.position.y + this.dimensions.y >= Level.BOTTOM_EDGE) 
            {
				this.position.y = Level.BOTTOM_EDGE - this.dimensions.y;
			}
        }

        if (keys.a)
        {
            this.direction = Direction.Left;
            this.position.set(this.position.x - this.speed*dt, this.position.y);
        
            if (this.position.x <= Level.LEFT_EDGE) {
				this.position.x = Level.LEFT_EDGE;
			}
        }
        else if (keys.d)
        {
            this.direction = Direction.Right;
            this.position.set(this.position.x + this.speed*dt, this.position.y);
        
            if (this.position.x + this.dimensions.x >= Level.RIGHT_EDGE) {
				this.position.x = Level.RIGHT_EDGE - this.dimensions.x;
			}
        }

        this.currentAnimation.update(dt)
    }

    render()
    {
        context.save();

        context.globalAlpha = this.alpha;

        super.render(this.positionOffset);

        context.restore();
    }

    updateAndSetHitbox()
    {
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x + Player.WIDTH/4,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x/2 + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }
    
    receiveDamage(damage = 1)
    {
        this.health -= damage;

        if (this.health == 0)
            this.isDead = true;
    }

    becomeInvulnerable()
    {
        this.isImmune = true;
        this.invulnerabilityTimer = this.startInvulnerabilityTimer();
    }

    startInvulnerabilityTimer() {
		const action = () => {
			this.alpha = this.alpha === 1 ? 0.5 : 1;
		};
		const interval = Player.INVULN_FLASH_INTERVAL;
		const duration = Player.INVULN_DURATION;
		const callback = () => {
			this.alpha = 1;
			this.isImmune = false;
		};

		return timer.addTask(action, interval, duration, callback);
	}
}