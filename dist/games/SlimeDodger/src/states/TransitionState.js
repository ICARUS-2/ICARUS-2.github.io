import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, stateMachine, timer } from "../globals.js";

export default class TransitionState extends State
{
    static TRANSITION_DELAY = 0.4;
    constructor()
    {
        super();

        this.transitionAlpha = 0;
        this.currentState = null;
    }

    enter(parameters)
    {
        this.fromState = parameters.fromState;
        this.toState = parameters.toState;
        this.toStateEnterParameters = parameters.toStateEnterParameters;
        this.currentState = this.fromState;
        this.transitionAlpha = 0;
        
        this.fadeOut();
    }

    update(dt)
    {
        timer.update(dt);
    }

    render()
    {
        this.currentState.render();
        context.fillStyle = `rgb(0, 0, 0, ${this.transitionAlpha})`;
        context.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    fadeOut()
    {
        timer.tween(this, ['transitionAlpha'], [1], TransitionState.TRANSITION_DELAY, () =>
        {
            this.currentState = this.toState;
            this.currentState.enter(this.toStateEnterParameters);
            this.fadeIn();
        });
    }

    fadeIn()
    {
        timer.tween(this, ['transitionAlpha'], [0], TransitionState.TRANSITION_DELAY, () =>
        {
            stateMachine.currentState = this.currentState;
        })
    }
}