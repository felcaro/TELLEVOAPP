import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FindRidePage } from './find-ride.page';

describe('FindRidePage', () => {
  let component: FindRidePage;
  let fixture: ComponentFixture<FindRidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FindRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
