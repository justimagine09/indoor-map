import { SceneObject } from "./scene-object";
import type { World } from "./world";


export class Line extends SceneObject {
    endPositionX = 0;
    endPositionY = 0;
    strokeColor = "#999";
    
    constructor(object: any) {
        super();
        this.positionX = object.positionX;
        this.positionY = object.positionY;
        this.endPositionX = object.endPositionX ?? object.positionX;
        this.endPositionY = object.endPositionX ?? object.positionY;
        this.strokeColor = object.strokeColor ?? "#999";
    }

    draw(world: World): void {
        world.context.beginPath();
        const startX = this.absolutePosition ? this.positionX : world.getPositionXFromWorld(this.positionX);
        const startY = this.absolutePosition ? this.positionY : world.getPositionYFromWorld(this.positionY);
        const endX = this.absolutePosition ? this.endPositionX : world.getPositionXFromWorld(this.endPositionX);
        const endY = this.absolutePosition ? this.endPositionY : world.getPositionYFromWorld(this.endPositionY);

        world.context.strokeStyle = this.strokeColor;
        world.context.moveTo(startX, startY);
        world.context.lineTo(endX, endY);
        world.context.stroke();
        world.context.closePath();
    }
}
export class Square extends SceneObject {
    constructor(object: any) {
        super();
        this.positionX = object.positionX as any;
        this.positionY = object.positionY as any;
        this.width = object.width;
        this.height = object.height;
        this.preventScaleOnZoom = object.preventScaleOnZoom ?? false;
        this.fillColor = object.fillColor ?? "#999";
    }

    draw(world: World): void {
        world.context.fillStyle = this.fillColor ?? 'transparent'
        if(this.preventScaleOnZoom) {
            const x = this.absolutePosition ? this.positionX : world.getPositionXFromWorld(this.positionX);
            const y = this.absolutePosition ? this.positionY : world.getPositionXFromWorld(this.positionY);

            world.context.fillRect(
                x - (this.width / 2),
                y - (this.height / 2),
                this.width,
                this.height
            );
        } else {
            world.context.fillRect(
                world.getPositionXFromWorld(this.positionX),
                world.getPositionYFromWorld(this.positionY),
                world.getWidthFromWorld(this.positionX),
                world.getHeightFromWorld(this.positionX)
            );
        }
    }
}

export class CustomObject extends SceneObject {
    lines: any = [];
    strokeColor = '#000';
    boundary: any = {};
    showTransformer = false;
    
    constructor(object: any) {
        super();
        this.positionX = object.positionX as any;
        this.positionY = object.positionY as any;
        this.lines = object.lines ?? [];
    }

    calculateBoundary() {
        const xs = [this.positionX, ...this.lines.map((line: any) => line.positionX)];
        const ys = [this.positionY, ...this.lines.map((line: any) => line.positionY)];
        this.boundary.left = Math.min(...xs);
        this.boundary.right = Math.max(...xs);
        this.boundary.top = Math.min(...ys);
        this.boundary.bottom = Math.max(...ys);
        this.boundary.positionX = this.boundary.left;
        this.boundary.positionY = this.boundary.top;
        this.boundary.width = this.boundary.right - this.boundary.left;
        this.boundary.height = this.boundary.bottom - this.boundary.top;
    }

    override draw(world: World): void {
        // if(this.boundary && this.showTransformer) {
        //     world.context.fillStyle = 'blue';
        //     world.context.strokeStyle = 'skyblue';
        //     world.context.strokeRect(this.boundary.positionX - 10, this.boundary.positionY - 10, this.boundary.width + 20, this.boundary.height + 20);
        //     world.context.fillRect(this.boundary.left - 13, this.boundary.top - 13, 6, 6);
        //     world.context.fillRect(this.boundary.right + 7, this.boundary.top - 13, 6, 6);
        //     world.context.fillRect(this.boundary.left - 13, this.boundary.bottom + 7, 6, 6);
        //     world.context.fillRect(this.boundary.right + 7, this.boundary.bottom + 7, 6, 6);
        // }

        world.context.beginPath();
        world.context.strokeStyle = this.strokeColor;
        world.context.moveTo(world.getPositionXFromWorld(this.positionX), world.getPositionYFromWorld(this.positionY));
        this.lines.forEach((line: any) => {
            world.context.lineTo(world.getPositionXFromWorld(line.positionX), world.getPositionYFromWorld(line.positionY));
            world.context.fillStyle = "#000";
            world.context.fillRect(world.getPositionXFromWorld(line.positionX) - 2, world.getPositionYFromWorld(line.positionY) - 2, 4, 4);
        });
        if(this.fillColor) {
            world.context.fillStyle = this.fillColor;
            world.context.fill();
        }
        world.context.stroke();
        world.context.closePath();
        
        world.context.fillStyle = "#000";
        world.context.fillRect(world.getPositionXFromWorld(this.positionX) - 2, world.getPositionYFromWorld(this.positionY) - 2, 4, 4);
    }

    hover(x: any, y: any) {
        if(
            x >= this.boundary.left && x <= this.boundary.right &&
            y >= this.boundary.top && y <= this.boundary.bottom
        ) {
            const sides = [{positionX: this.positionX, positionY: this.positionY}, ...this.lines];
            if(this.pointInAPolygon(x, y, sides)) {
                this.showTransformer = true;
            }
        }
    }

    pointInAPolygon(x: any, y: any, polygon: any) {
        const num_vertices = polygon.length;
        let inside = false;
     
        let p1 = polygon[0];
        let p2;
     
        for (let i = 1; i <= num_vertices; i++) {
            p2 = polygon[i % num_vertices];
     
            if (y > Math.min(p1.positionY, p2.positionY)) {
                if (y <= Math.max(p1.positionY, p2.positionY)) {
                    if (x <= Math.max(p1.positionX, p2.positionX)) {
                        const x_intersection = ((y - p1.positionY) * (p2.positionX - p1.positionX)) / (p2.positionY - p1.positionY) + p1.positionX;
     
                        if (p1.positionX === p2.positionX || x <= x_intersection) {
                            inside = !inside;
                        }
                    }
                }
            }
     
            p1 = p2;
        }
     
        return inside;
    }
}