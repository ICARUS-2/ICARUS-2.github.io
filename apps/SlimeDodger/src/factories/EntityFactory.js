import Player from "../entities/Player.js";
import TrackingEnemy from "../entities/TrackingEnemy.js";
import WaveEnemy from "../entities/WaveEnemy.js";
import EntityType from "../enums/EntityType.js";

export default class EntityFactory
{
    static createInstance(type)
    {
        switch(type)
        {
            case EntityType.Player: 
                return new Player();
            case EntityType.Tracker:
                return new TrackingEnemy();
            case EntityType.Wave:
                return new WaveEnemy();
        }
    }
}