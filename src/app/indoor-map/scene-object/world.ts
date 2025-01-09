export class World {
    positionX = 0;
    positionY = 0;
    width = 0;
    height = 0;
    rotation = 0;
    zoom = 1;
    sceneObjects = [];
    gridCount = 20;
    grids: any = [];
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
        this.createGridItems();
    }
    
    draw () {
        this.drawWorld();
        this.drawGrid();
    }

    getMousePosition(mouseEvent: MouseEvent) {
       return {
        x: mouseEvent.pageX - this.canvas.offsetLeft,
        y: mouseEvent.pageY - this.canvas.offsetTop
       }
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
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(this.positionX, this.positionY, this.width, this.height);
    }

    drawGrid() {
        this.context.fillStyle = this.gridColor;
        this.grids.forEach((grid: any) => {
            if(grid.hovered) {
                this.context.fillRect(grid.positionX - 2, grid.positionY - 2, grid.width + 4, grid.height + 4);
                return;
            }
            this.context.fillRect(grid.positionX, grid.positionY, grid.width, grid.height);
        });
    }

    private createGridItems() {
        this.grids = [];
        const gapX = this.width / this.gridCount;
        const gapY = this.height / this.gridCount;

        for (let i=1; i < this.gridCount; i++) {
            const gridX = gapX * i;
            
            for (let j=1; j < this.gridCount; j++) {
                const gridY = gapY * j;

                this.grids.push({
                    positionX: this.positionX + gridX - 1,
                    positionY: this.positionY + gridY - 1,
                    width: 2,
                    height: 2
                });
            }
        }
    }
}