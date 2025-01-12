import type { World } from "./world";

export abstract class SceneObject {
    positionX = 0;
    positionY = 0;
    width = 0;
    height = 0;
    rotation = 0;
    zoom = 1;
    
    constructor() {}

    abstract draw(world: World): void;
}