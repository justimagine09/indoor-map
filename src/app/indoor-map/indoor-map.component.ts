import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { World } from './scene-object/world';
import { interval } from 'rxjs';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrl: './indoor-map.component.scss'
})
export class IndoorMapComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  world!: World;
  line: any = [];
  tempLine: any;
  creating = false;

  ngAfterViewInit(): void {
    this.world = new World(this.canvas.nativeElement, {width: 600, height: 600});
    
    interval(1).subscribe(() => {
      this.world.drawWorld();
      this.line.forEach((line: any) => {
        if(line.length) {
          this.world.context.beginPath();
          this.world.context.fillStyle = "orange";
          this.world.context.strokeStyle = '#000';
          this.world.context.moveTo(line[0].x, line[0].y);
          line.forEach((line: any, index: number) => {
            if (index === 0) return;
            this.world.context.lineTo(line.x, line.y);
          });
          
          this.world.context.fill();
  
          this.world.context.stroke();
          this.world.context.closePath();
        };
      });

      if(this.line.length) {
        const line = this.line[this.line.length - 1];
        if(line.length) {
          if(this.tempLine && this.creating) {
            this.world.context.beginPath();
            this.world.context.strokeStyle = 'orange';
            this.world.context.lineTo(this.tempLine.x, this.tempLine.y);
            this.world.context.lineTo(line[line.length - 1].x, line[line.length - 1].y);
            this.world.context.stroke();
            this.world.context.closePath();
          }
        }
      }
      
      this.world.drawGrid();
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
    if (this.world.hoveredGrid) {
      const grid = this.world.hoveredGrid;
      if (!this.creating) {
        this.line.push([]);
        this.creating = true;
      }
      this.line[this.line.length - 1].push({x: grid.positionX, y: grid.positionY});
    }
  }
}
