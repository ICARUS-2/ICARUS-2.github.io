import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriangularBannerComponent } from './triangular-banner.component';

describe('TriangularBannerComponent', () => {
  let component: TriangularBannerComponent;
  let fixture: ComponentFixture<TriangularBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriangularBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriangularBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
