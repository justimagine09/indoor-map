import { SceneObject } from "./scene-object";

export class World {
    positionX = 0;
    positionY = 0;
    width = 0;
    height = 0;
    rotation = 0;
    zoom = 1;
    sceneObjects: SceneObject[] = [];
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
        this.width = config.width;
        this.height = config.height;
        this.gridCount = this.gridCount ?? 20;
        element.width = config.width;
        element.height = config.height;
    }
    
    draw () {
        this.drawWorld();
        this.sceneObjects.forEach((item) => {
            item.draw(this);
        });

        let xDistance = this.getGridGapFromWorld();
        let yDistance = this.getGridGapFromWorld();

        while (xDistance < this.width) {
            this.context.fillStyle = '#000';
            this.context.fillRect(xDistance, 0, 0.3, this.height);
            xDistance+= this.getGridGapFromWorld();
        }

        while (yDistance < this.width) {
            this.context.fillStyle = '#000';
            this.context.fillRect(0, yDistance, this.width ,0.3);
            yDistance+= this.getGridGapFromWorld();
        }
    }

    getMousePosition(mouseEvent: MouseEvent) {
       return {
        x: mouseEvent.pageX - this.canvas.offsetLeft,
        y: mouseEvent.pageY - this.canvas.offsetTop
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

        return { x, y };
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

    getPositionXFromWorld(x: number) {
        return (this.positionX + x) * this.zoom;
    }

    getPositionYFromWorld(y: number) {
        return (this.positionY + y) * this.zoom;
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
}