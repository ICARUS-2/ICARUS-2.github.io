import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCardLinkComponent } from './zoom-card-link.component';

describe('ZoomCardLinkComponent', () => {
  let component: ZoomCardLinkComponent;
  let fixture: ComponentFixture<ZoomCardLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomCardLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomCardLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
