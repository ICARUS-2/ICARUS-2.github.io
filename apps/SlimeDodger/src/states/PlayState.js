import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import { sounds, stateMachine, timer } from "../globals.js";
import GameStateName from "../enums/GameStateName.js";
import Vector from "../../lib/Vector.js";
import Level from "../objects/Level.js";
import EntityFactory from "../factories/EntityFactory.js";
import EntityType from "../enums/EntityType.js";
import SoundName from "../enums/SoundName.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.player = EntityFactory.createInstance(EntityType.Player);
		this.player.position = new Vector(20,20);
		this.level = new Level(this.player, 1);
		// @ts-ignore
		this.player.level = this.level;
	}

	enter()
	{
		// @ts-ignore
		this.player.reset();
		this.level = new Level(this.player, this.level.levelNumber);
		sounds.play(SoundName.MainMusic);
	}

	update(dt)
	{
		timer.update(dt)
		this.level.update(dt);
		if (this.player.isDead)
		{
			this.level.levelNumber = 1;
			sounds.stop(SoundName.MainMusic);
			stateMachine.change(GameStateName.Transition,
			{
				fromState: this,
				toState: stateMachine.states[GameStateName.GameOver]
			});

		}
	}

	render()
	{
		this.level.render();
	}
}
