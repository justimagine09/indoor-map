import { BehaviorSubject } from "rxjs";
import { SceneObject } from "./scene-object";

export class World {
    positionX = 0;
    positionY = 0;
    width = 0;
    height = 0;
    rotation = 0;
    zoom = 1;
    sceneObjects = new BehaviorSubject<SceneObject[]>([]);
    sceneObjectsLength = 0;
    gridCount = 20;
    grids: any = [];
    gridGap = 15;
    gridColor = '#000';
    backgroundColor = '#eee';
    context: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    hoveredGrid?: any;

    constructor(element:HTMLCanvasElement, config: any) {
        this.context = element.getContext('2d')!;
        this.canvas = element;
        this.gridCount = this.gridCount ?? 20;
        element.width = config.width;
        element.height = config.height;
        // this.positionX = this.gridGap * -1;
        // this.positionY =  this.gridGap * -1;
        this.width = config.width;
        this.height = config.height;
        this.sceneObjects.subscribe((objects) => {
            this.sceneObjectsLength = objects.length;
        });
    }
    
    draw () {
        this.drawWorld();
        this.sceneObjects.getValue().forEach((item) => {
            item.draw(this);
        });
        this.drawGrid();
    }

    drawGrid() {
        let xDistance = this.getGridGapFromWorld();
        let yDistance = this.getGridGapFromWorld();

        while (xDistance < this.width) {
            this.context.fillStyle = 'rgba(0,0,0,0.1)';
            this.context.fillRect(xDistance, 0, 1, this.height);
            xDistance+= this.getGridGapFromWorld();
        }

        while (yDistance < this.height) {
            this.context.fillStyle = 'rgba(0,0,0,0.1)';
            this.context.fillRect(0, yDistance, this.width, 1);
            yDistance+= this.getGridGapFromWorld();
        }
    }

    getMousePosition(mouseEvent: MouseEvent) {
       return {
        x: Math.round(mouseEvent.pageX - this.canvas.offsetLeft),
        y: Math.round(mouseEvent.pageY - this.canvas.offsetTop)
       }
    }

    getNearestGridPoint(x: number, y: number): {x:number, y: number} {
        const gap = this.getGridGapFromWorld();
        const xGap = gap - (x % gap);
        const xR = x % gap;
        const yGap = gap - (y % gap);
        const yR = y % gap;

        x = xGap < xR ? x + xGap : x - xR;
        y = yGap < yR ? y + yGap : y - yR;

        x = x * (this.gridGap / this.getGridGapFromWorld());
        y = y * (this.gridGap / this.getGridGapFromWorld());
        
        return { x, y };
    }

    zoomIn() {
        this.zoom++;
    }

    zoomOut() {
        if(this.zoom <= 0) return;
        this.zoom--;
    }

    hover(mouseEvent: MouseEvent) {
        if (this.hoveredGrid) this.hoveredGrid.hovered = false;
        const mousePosition = this.getMousePosition(mouseEvent);
        const grid = this.grids.find((grid: any) => {
            const distanceX= grid.positionX - mousePosition.x;
            const distanceY= grid.positionY - mousePosition.y;
            const dis=Math.sqrt(distanceX*distanceX+distanceY*distanceY);
            return dis < 10;
        });
        if (grid) {
            this.hoveredGrid = grid;
            this.hoveredGrid.hovered = true;
            this.canvas.style.cursor='pointer';
        } else {
            this.canvas.style.cursor='auto';
        }
    }

    drawWorld() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    getPositionXFromWorld(x: number, zoom?: number) {
        return (this.positionX + x) * (zoom ?? this.zoom);
    }

    getPositionYFromWorld(y: number, zoom?: number) {
        return (this.positionY + y) * (zoom ?? this.zoom);
    }

    getWidthFromWorld(width: number) {
        return width * this.zoom;
    }

    getHeightFromWorld(height: number) {
        return height * this.zoom;
    }

    getGridGapFromWorld() {
        return this.gridGap * this.zoom;
    }

    getAbsolutePositionX(x: number) {
        return x / this.zoom - this.positionX;
    }

    getAbsolutePositionY(y: number) {
        return y / this.zoom - this.positionY;
    }

    addSceneObject(object: SceneObject) {
        const objects = this.sceneObjects.getValue();
        objects.push(object);
        this.sceneObjects.next(objects);
    }

    removeSceneObject(object: SceneObject){
        const objects = this.sceneObjects.getValue();
        objects.splice(objects.indexOf(object), 1);
        this.sceneObjects.next(objects);

    }
}