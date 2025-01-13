import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndoorMapModule } from './indoor-map/indoor-map.module';
import { EditorModule } from './editor/editor.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IndoorMapModule, EditorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'indoor-map';
}
