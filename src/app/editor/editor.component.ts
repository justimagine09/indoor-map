import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { World } from '../indoor-map/scene-object/world';
import { CustomObject } from '../indoor-map/scene-object/square';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('world') worldCanvas!: ElementRef<HTMLCanvasElement>;
  world!: World;
  snapOnGrid = false;
  creatingObject = false;
  newObject?: CustomObject;
  mousePointer: any;
  mouseDownPosition: any;
  panning = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.world = new World(
      this.worldCanvas.nativeElement,
      {
        width: this.worldCanvas.nativeElement.clientWidth,
        height: this.worldCanvas.nativeElement.clientHeight
      }
    );

    this.draw();
  }

  draw() {
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        window.requestAnimationFrame(() => {
          this.world.draw();
          if(this.mousePointer && this.snapOnGrid) {
            this.world.context.fillStyle = "rgba(0, 0, 0, 0.5)";
            this.world.context.fillRect(this.mousePointer.x - 4, this.mousePointer.y - 4, 8, 8);
          }
          animate();
        });
      }

      animate();
    });
  }

  onMouseMove(mouseEvent: MouseEvent) {
    const mousePosition = this.world.getMousePosition(mouseEvent);
    const nearestGridPoint = this.world.getNearestGridPoint(mousePosition.x, mousePosition.y);
    this.mousePointer = nearestGridPoint;
    if (this.mouseDownPosition && this.panning) {
      const distanceX = this.mouseDownPosition.x - this.mousePointer.x;
      const distanceY = this.mouseDownPosition.y - this.mousePointer.y;
      this.world.positionX -= distanceX;
      this.world.positionY -= distanceY;
      this.mouseDownPosition = this.mousePointer;
    }
  }

  onMouseDown(mouseEvent: MouseEvent) {
    if(this.panning) {
      
    this.mouseDownPosition = this.world.getMousePosition(mouseEvent);
    }
  }

  onMouseUp($event: any) {
    this.mouseDownPosition = undefined;
  }

  onClick(mouseEvent: MouseEvent) {
    const mousePosition = this.world.getMousePosition(mouseEvent);
    let positionX = mousePosition.x * (this.world.gridGap / this.world.getGridGapFromWorld()),
    positionY = mousePosition.y * (this.world.gridGap / this.world.getGridGapFromWorld());

    if (this.snapOnGrid) {
      const nearestGridPoint = this.world.getNearestGridPoint(mousePosition.x, mousePosition.y);
      positionX = nearestGridPoint.x * (this.world.gridGap / this.world.getGridGapFromWorld()) - this.world.positionX;
      positionY = nearestGridPoint.y * (this.world.gridGap / this.world.getGridGapFromWorld()) - this.world.positionY;
    }

    if (!this.creatingObject) return;
    
    if (!this.newObject) {
      this.newObject = new CustomObject({positionX, positionY});
      this.world.sceneObjects.push(this.newObject);
      return;
    }

    this.newObject!.lines.push({positionX, positionY});
  }

  zoom(zoomIn = false): any {
    if(zoomIn) return this.world.zoom += 0.2;
    this.world.zoom -= 0.2;
  }

  toggleCreateObject() {
    this.creatingObject = !this.creatingObject;

    if(!this.creatingObject) {
      this.newObject = undefined;
    }
  }

  saveObject() {
    this.newObject = undefined;
    this.creatingObject = false;
  }
}
