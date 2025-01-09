import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { World } from './scene-object/world';

@Component({
  selector: 'app-indoor-map',
  templateUrl: './indoor-map.component.html',
  styleUrl: './indoor-map.component.scss'
})
export class IndoorMapComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const world = new World(this.canvas.nativeElement, {width: 600, height: 600});
    world.draw();
  }
}
