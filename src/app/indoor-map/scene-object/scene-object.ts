import type { World } from "./world";

export abstract class SceneObject {
    positionX = 0;
    positionY = 0;
    width = 0;
    height = 0;
    rotation = 0;
    zoom = 1;
    label = "untitled";
    fillColor: string | null = null;
    preventScaleOnZoom = false;
    absolutePosition = false;
    
    constructor() {}

    abstract draw(world: World): void;
}