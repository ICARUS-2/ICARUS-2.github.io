import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainButtonHrefComponent } from './main-button-href.component';

describe('MainButtonHrefComponent', () => {
  let component: MainButtonHrefComponent;
  let fixture: ComponentFixture<MainButtonHrefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainButtonHrefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainButtonHrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
