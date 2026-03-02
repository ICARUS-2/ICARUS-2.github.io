import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemPairComponent } from './list-item-pair.component';

describe('ListItemPairComponent', () => {
  let component: ListItemPairComponent;
  let fixture: ComponentFixture<ListItemPairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemPairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
