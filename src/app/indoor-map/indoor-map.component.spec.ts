import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndoorMapComponent } from './indoor-map.component';

describe('IndoorMapComponent', () => {
  let component: IndoorMapComponent;
  let fixture: ComponentFixture<IndoorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndoorMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndoorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
