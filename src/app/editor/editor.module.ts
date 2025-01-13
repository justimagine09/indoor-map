import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditorComponent],
  exports: [EditorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule
  ]
})
export class EditorModule { }
