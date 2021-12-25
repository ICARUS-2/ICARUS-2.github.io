import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, currentScoreKey, highScoreKey, images, keys, sounds, stateMachine } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import Player from "../entities/Player.js";
import TrackingEnemy from "../entities/TrackingEnemy.js";
import WaveEnemy from "../entities/WaveEnemy.js";

export default class TitleScreenState extends State {
	constructor() {
		super();

	}
	enter(){
		if (!localStorage.getItem(highScoreKey)){
			localStorage.setItem(highScoreKey, "0");
		}
		localStorage.setItem(currentScoreKey, "0");
		sounds.play(SoundName.TitleMusic);
	}
	update(dt)
	{
		if (keys.Enter)
		{
			keys.Enter = false;
			sounds.stop(SoundName.TitleMusic);
			sounds.play(SoundName.MenuSelect);

			stateMachine.change(GameStateName.Transition,
				{
					fromState : this,
					toState : stateMachine.states[GameStateName.Play]
				});
		}
	}

	render()
	{
		images.render(ImageName.BackgroundImageSprite, 0, -5, CANVAS_WIDTH, CANVAS_HEIGHT)
		context.font = '45px game-font';
		context.fillStyle = "blue";
		context.fillText('SLIMEDODGER', CANVAS_WIDTH / 6.5, CANVAS_HEIGHT / 2);
		context.font = '20px game-font';
		context.fillText(`Hi-Score: ${localStorage.getItem(highScoreKey)}`, CANVAS_WIDTH / 2.7, CANVAS_HEIGHT / 2 + 30)
		context.fillText(`PRESS ENTER`, CANVAS_WIDTH / 2.7, CANVAS_HEIGHT * 0.75);

		let playerSprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.PlayerSpriteSheet), Player.WIDTH, Player.HEIGHT)
		playerSprites[Player.CHARACTER_SPRITE_INDICES.Right[0]].render(100,157)
	
		let trackerSprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.TrackerEnemySpriteSheet), TrackingEnemy.SIZE, TrackingEnemy.SIZE)
		trackerSprites[TrackingEnemy.SPRITE_INDICES.Down[0]].render(305, 125);

		let waveEnemySprites = Sprite.generateSpritesFromSpriteSheet(images.get(ImageName.WaveEnemySpriteSheet), WaveEnemy.SIZE, WaveEnemy.SIZE);
		waveEnemySprites[WaveEnemy.SPRITE_INDICES.Down[0]].render(263, 123)
		waveEnemySprites[WaveEnemy.SPRITE_INDICES.Left[0]].render(275, 121);
	}
}
