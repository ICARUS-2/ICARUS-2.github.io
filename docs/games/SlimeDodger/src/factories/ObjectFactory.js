import Player from "../entities/Player.js";
import EntityType from "../enums/EntityType.js";
import ObjectType from "../enums/ObjectType.js";
import Coin from "../objects/Coin.js";
import Vector from "../../lib/Vector.js";
import Door from "../objects/Door.js";
import Level from "../objects/Level.js";
import Tile from "../objects/Tile.js";

export default class ObjectFactory
{
    static createInstance(type)
    {
        switch(type)
        {
            case ObjectType.Coin: 
                return new Coin(new Vector(Coin.COIN_WIDTH, Coin.COIN_HEIGHT), new Vector(0,0));

            case ObjectType.Door:
                return new Door(new Vector(Door.VERTICAL_WIDTH, Door.VERTICAL_HEIGHT), new Vector(Level.RENDER_OFFSET_X + (Level.WIDTH / 2 * Tile.TILE_SIZE) - Tile.TILE_SIZE, Level.RENDER_OFFSET_Y));
        }
    }
}