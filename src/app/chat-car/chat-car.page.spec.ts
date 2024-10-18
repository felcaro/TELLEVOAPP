import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatCarPage } from './chat-car.page';

describe('ChatCarPage', () => {
  let component: ChatCarPage;
  let fixture: ComponentFixture<ChatCarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
