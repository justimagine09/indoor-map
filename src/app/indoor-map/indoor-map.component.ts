import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { World } from './scene-object/world';
import { interval } from 'rxjs';
import { CustomObject } from './scene-object/square';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrl: './indoor-map.component.scss'
})
export class IndoorMapComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  world!: World;
  line: any = [];
  objectPath: any;
  tempLine: any;
  creating = false;
  sceneObjects: CustomObject[] = [];

  ngAfterViewInit(): void {
    this.world = new World(this.canvas.nativeElement, {width: 600, height: 600});
    
    interval(1).subscribe(() => {
      this.world.drawWorld();
      this.sceneObjects.forEach(item => item.draw(this.world));
      const newLocal = this;
      newLocal.objectPath?.draw(this.world);
      this.drawTempLine();
    });
  }

  onMouseMove($event: MouseEvent) {
    this.world.hover($event);
    if (this.world.hoveredGrid) {
      const grid = this.world.hoveredGrid;
      this.tempLine = {x: grid.positionX, y: grid.positionY};
    } else {
      this.tempLine = null;
    }
  }
  
  onHover($event: MouseEvent) {
    this.world.hover($event);
  }

  onClick($event: MouseEvent) {
    const point = this.world.getMousePosition($event);
    const grid = this.world.hoveredGrid;

    if (grid && this.creating) {
      if (!this.objectPath) {
        this.createObject(grid.positionX, grid.positionY);
        return;
      }

      this.objectPath.lines.push({positionX: grid.positionX + 1, positionY: grid.positionY + 1});
    } else {
      
      this.sceneObjects.forEach((item) => {
        item.hover(point.x, point.y, this.world);
      });
    }
  }

  drawTempLine() {
    if (!this.objectPath || !this.tempLine) return;
    const lineLength = this.objectPath.lines.length;
    const lastLine = lineLength ? this.objectPath.lines[lineLength - 1] : this.objectPath;
    this.world.context.save();
    this.world.context.beginPath();
    this.world.context.strokeStyle = 'orange'
    this.world.context.moveTo(lastLine.positionX, lastLine.positionY);
    this.world.context.lineTo(this.tempLine.x + 1, this.tempLine.y + 1);
    this.world.context.stroke();
    this.world.context.closePath();
    this.world.context.restore();
  }

  createObject(x: number, y: number) {
    this.objectPath = new CustomObject({
      positionX: x + 1,
      positionY: y + 1,
      lines: []
    });
  }

  save() {
    console.log(this.objectPath);
    this.objectPath.calculateBoundary();
    this.sceneObjects.push(this.objectPath);
    this.objectPath = null;
    this.tempLine = null;
  }

  toggle() {
    this.creating = !this.creating;
    if(!this.creating) {
      this.objectPath = null;
      this.tempLine = null;
    }
  }
}
