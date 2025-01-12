import { SceneObject } from "./scene-object";
import type { World } from "./world";

export class Square extends SceneObject {
    override draw(): void {}
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
        this.lines = object.lines;
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
        if(this.boundary && this.showTransformer) {
            world.context.fillStyle = 'blue';
            world.context.strokeStyle = 'skyblue';
            world.context.strokeRect(this.boundary.positionX - 10, this.boundary.positionY - 10, this.boundary.width + 20, this.boundary.height + 20);
            world.context.fillRect(this.boundary.left - 13, this.boundary.top - 13, 6, 6);
            world.context.fillRect(this.boundary.right + 7, this.boundary.top - 13, 6, 6);
            world.context.fillRect(this.boundary.left - 13, this.boundary.bottom + 7, 6, 6);
            world.context.fillRect(this.boundary.right + 7, this.boundary.bottom + 7, 6, 6);
        }

        world.context.beginPath();
        world.context.strokeStyle = this.strokeColor;
        world.context.moveTo(this.positionX, this.positionY);
        this.lines.forEach((line: any) => {
            world.context.lineTo(line.positionX, line.positionY);
        });
        world.context.stroke();
        if(this.showTransformer) {
            world.context.fillStyle = "red";
            world.context.fill();
        }
        world.context.closePath();
    }

    hover(x: any, y: any, world: World) {
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