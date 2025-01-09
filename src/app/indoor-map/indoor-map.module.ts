import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndoorMapComponent } from './indoor-map.component';



@NgModule({
  declarations: [IndoorMapComponent],
  exports: [IndoorMapComponent],
  imports: [
    CommonModule
  ]
})
export class IndoorMapModule { }
