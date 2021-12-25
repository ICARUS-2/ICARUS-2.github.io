import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds, timer } from "../globals.js";
import GameObject from "./GameObject.js";
import Animation from "../../lib/Animation.js";
import SoundName from "../enums/SoundName.js";

export default class Coin extends GameObject
{
    static COIN_WIDTH = 16;
    static COIN_HEIGHT = 16;
    static ANIMATION_DELAY = 0.25;
    constructor(dimensions, position)
    {
        super(dimensions, position);

        
        this.goldSprites = Sprite.generateSpritesFromSpriteSheet
        (
            images.get(ImageName.GoldCoinSpriteSheet),
            Coin.COIN_WIDTH,
            Coin.COIN_HEIGHT,
        )

        this.silverSprites = Sprite.generateSpritesFromSpriteSheet
        (
            images.get(ImageName.SilverCoinSpriteSheet),
            Coin.COIN_WIDTH,
            Coin.COIN_HEIGHT
        )

        this.blueSprites = Sprite.generateSpritesFromSpriteSheet
        (
            images.get(ImageName.BlueCoinSpriteSheet),
            Coin.COIN_WIDTH,
            Coin.COIN_HEIGHT
        )

        this.sprites = this.blueSprites;

        this.isConsumable = true;
        this.level = null;
        this.currentAnimation = new Animation([0, 1, 2, 3], Coin.ANIMATION_DELAY)
    }

    update(dt)
    {
        this.currentAnimation.update(dt);
        this.currentFrame = this.currentAnimation.currentFrame;
        this.updateAndSetHitbox();
    }

    onConsume(consumer)
    {
        super.onConsume(consumer);
        sounds.play(SoundName.PickupCoin)

        //handle coin collection logic
        timer.tween(this.position, ["x", "y"], [consumer.position.x, consumer.position.y], 0.2, () => {this.cleanUp = true});
    }

    updateAndSetHitbox()
    {
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
    }
}