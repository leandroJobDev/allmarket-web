import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBottom } from './nav-bottom';

describe('NavBottom', () => {
  let component: NavBottom;
  let fixture: ComponentFixture<NavBottom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBottom],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBottom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
