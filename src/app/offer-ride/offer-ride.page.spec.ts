import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferRidePage } from './offer-ride.page';

describe('OfferRidePage', () => {
  let component: OfferRidePage;
  let fixture: ComponentFixture<OfferRidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
