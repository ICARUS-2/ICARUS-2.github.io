import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import SoundName from "../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, currentScoreKey, highScoreKey, keys, sounds, stateMachine } from "../globals.js";

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
		context.font = '40px game-font';
		context.fillStyle = "blue";
		context.fillText('SLIMEDODGER', CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2);
		context.fillText('PRESS ENTER', CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + 30)
		context.font = '20px game-font';
		context.fillText(`Hi-Score: ${localStorage.getItem(highScoreKey)}`, CANVAS_WIDTH / 2.7, CANVAS_HEIGHT * 0.75);
	}
}
