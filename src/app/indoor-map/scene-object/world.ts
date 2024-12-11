export class World {
    static positionX = 0;
    static positionY = 0;
    static width = 0;
    static height = 0;
    static rotation = 0;
    static zoom = 1;
    static sceneObjects = [];
    static context: CanvasRenderingContext2D;
    static canvas: HTMLCanvasElement;

    initialize(element: HTMLCanvasElement) {
        World.context = element.getContext('2d')!;
        World.canvas = element;
    }
}