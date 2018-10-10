import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestDataComponent } from './quest-data.component';

describe('QuestDataComponent', () => {
  let component: QuestDataComponent;
  let fixture: ComponentFixture<QuestDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
