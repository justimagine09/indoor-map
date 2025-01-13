import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [EditorComponent],
  exports: [EditorComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class EditorModule { }
