import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { World } from '../indoor-map/scene-object/world';
import { CustomObject, Line, Square } from '../indoor-map/scene-object/square';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('worldz') worldCanvas!: ElementRef<HTMLCanvasElement>;
  world!: World;
  snapOnGrid = false;
  creatingObject = false;
  newObject?: CustomObject;
  mousePointer?: Square;
  verticalRuler!: Line;
  horizontalRuler!: Line;
  temporaryLine!: Line;
  mouseDownPosition: any;
  panning = false;
  showRuler = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.world = new World(
      this.worldCanvas.nativeElement,
      {
        width: this.worldCanvas.nativeElement.clientWidth,
        height: this.worldCanvas.nativeElement.clientHeight
      }
    );
    this.temporaryLine = new Line({positionX: 0, positionY: 0, strokeColor: "orange"});
    this.verticalRuler = new Line({positionX: 0, positionY: 0, strokeColor: "pink"});
    this.horizontalRuler = new Line({positionX: 0, positionY: 0, strokeColor: "pink"});
    this.draw();
  }

  draw() {
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        window.requestAnimationFrame(() => {
          this.world.draw();

          if (this.newObject && this.mousePointer && this.creatingObject) {
            let x = this.newObject.positionX;
            let y = this.newObject.positionY;
            const lineLength = this.newObject.lines.length;

            if (lineLength > 0) {
              x = this.newObject.lines[lineLength - 1].positionX;
              y = this.newObject.lines[lineLength - 1].positionY;
            }

            this.temporaryLine.positionX = this.world.getPositionXFromWorld(x);
            this.temporaryLine.positionY = this.world.getPositionYFromWorld(y)
            this.temporaryLine.endPositionX = this.mousePointer.positionX;
            this.temporaryLine.endPositionY = this.mousePointer.positionY;
            this.temporaryLine.absolutePosition = !this.snapOnGrid;
            this.temporaryLine.draw(this.world);
          }

          if(this.mousePointer && this.showRuler) {
            this.verticalRuler.positionX = this.mousePointer.positionX;
            this.verticalRuler.positionY = 0
            this.verticalRuler.endPositionX = this.mousePointer.positionX;
            this.verticalRuler.endPositionY = this.world.height;
            this.verticalRuler.absolutePosition = true;
            this.verticalRuler.draw(this.world);

            
            this.horizontalRuler.positionY = this.mousePointer.positionY;
            this.horizontalRuler.positionX = 0
            this.horizontalRuler.endPositionX = this.world.width;
            this.horizontalRuler.endPositionY = this.mousePointer.positionY;
            this.horizontalRuler.absolutePosition = true;
            this.horizontalRuler.draw(this.world);
            this.world.context.fillStyle = "#000";
            this.world.context.fillText(this.mousePointer?.positionX + ', ' + this.mousePointer.positionY, this.mousePointer!.positionX + 10, this.mousePointer!.positionY - 10);
          }
          this.mousePointer?.draw(this.world);

          animate();
        });
      }

      animate();
    });
  }

  onClick(mouseEvent: MouseEvent) {
    const mousePosition = this.world.getMousePosition(mouseEvent);
    let positionX = this.world.getAbsolutePositionX(mousePosition.x),
    positionY = this.world.getAbsolutePositionY(mousePosition.y);

    if (this.snapOnGrid) {
      const nearestGridPoint = this.world.getNearestGridPoint(mousePosition.x, mousePosition.y);
      positionX = nearestGridPoint.x;
      positionY = nearestGridPoint.y;
    }

    if (!this.creatingObject) return;
    
    if (!this.newObject) {
      this.newObject = new CustomObject({positionX, positionY});
      this.world.addSceneObject(this.newObject);
      return;
    }

    this.newObject!.lines.push({positionX, positionY});
  }

  onMouseMove(mouseEvent: MouseEvent) {
    const mousePosition = this.world.getMousePosition(mouseEvent);
    const nearestGridPoint = this.world.getNearestGridPoint(mousePosition.x, mousePosition.y);

    if (!this.mousePointer) {
      this.mousePointer = new Square({
        positionX: mousePosition.x,
        positionY: mousePosition.y,
        width: 4,
        height: 4,
        preventScaleOnZoom: true
      });
    }

    if (this.snapOnGrid) {
      this.mousePointer.absolutePosition = false;
      this.mousePointer.positionX = nearestGridPoint.x;
      this.mousePointer.positionY = nearestGridPoint.y;
    } else {
      this.mousePointer.absolutePosition = true;
      this.mousePointer.positionX = mousePosition.x;
      this.mousePointer.positionY = mousePosition.y;
    }

    if (this.mouseDownPosition && this.panning) {
      const distanceX = this.mouseDownPosition.x - this.mousePointer.positionX;
      const distanceY = this.mouseDownPosition.y - this.mousePointer.positionY;
      this.world.positionX -= distanceX;
      this.world.positionY -= distanceY;
      this.mouseDownPosition.x = this.mousePointer.positionX;
      this.mouseDownPosition.y = this.mousePointer.positionY;
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

  zoom(zoomIn = false): any {
    if(zoomIn) return this.world.zoomIn();
    this.world.zoomOut();
  }

  toggleCreateObject() {
    this.creatingObject = !this.creatingObject;

    if(!this.creatingObject && this.newObject) {
      this.world.removeSceneObject(this.newObject);
      this.newObject = undefined;
    }
  }

  saveObject() {
    this.newObject = undefined;
    this.creatingObject = false;
  }
}
