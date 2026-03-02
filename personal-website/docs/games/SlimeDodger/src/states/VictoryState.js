import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, currentScoreKey, highScoreKey, keys, sounds, stateMachine } from "../globals.js";
import GameOverState from "./GameOverState.js";

export default class VictoryState extends GameOverState {
	constructor(){
		super();
	}

	render()
	{
		context.font = '40px game-font';
		context.fillStyle = "yellow";
		context.fillText('Hi Score Achieved!', CANVAS_WIDTH / 15, CANVAS_HEIGHT/6);

		super.render();
	}
}
