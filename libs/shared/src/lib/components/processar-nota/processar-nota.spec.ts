import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessarNota } from './processar-nota';

describe('ProcessarNota', () => {
  let component: ProcessarNota;
  let fixture: ComponentFixture<ProcessarNota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessarNota],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessarNota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
