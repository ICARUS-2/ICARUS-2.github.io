import State from "../../lib/State.js";
import { currentScoreKey, highScoreKey, images, keys, sounds } from "../globals.js";
import { stateMachine } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import { context } from "../globals.js";
import { CANVAS_HEIGHT } from "../globals.js";
import { CANVAS_WIDTH } from "../globals.js";
import SoundName from "../enums/SoundName.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Player from "../entities/Player.js";

export default class GameOverState extends State {
	constructor() {
		super();

		this.transitionAlpha = 0;
		this.currentState = null;
	}

	enter(parameters)
	{
		let currentScore = Number(localStorage.getItem(currentScoreKey));
		let hiScore = Number(localStorage.getItem(highScoreKey));
		if (currentScore > hiScore){
			localStorage.setItem(highScoreKey, String(currentScore));
		}
	}

	update(dt)
	{
		if (keys.Enter)
		{
			keys.Enter = false;
			sounds.play(SoundName.MenuSelect);
			localStorage.setItem(currentScoreKey, "0");
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render()
	{
		context.font = '40px game-font';
		context.fillStyle = "red";
		context.fillText('GAME OVER', CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2)

		context.fillStyle = "cyan"
		context.font = '30px game-font';
		context.fillText(`Hi-Score: ${localStorage.getItem(highScoreKey)}   Score: ${localStorage.getItem(currentScoreKey)}`, CANVAS_WIDTH / 10, CANVAS_HEIGHT / 2 + 30)
		context.font = '20px game-font';
		context.fillText(`PRESS ENTER`, CANVAS_WIDTH / 2.9, CANVAS_HEIGHT * 0.75);
	}
}
