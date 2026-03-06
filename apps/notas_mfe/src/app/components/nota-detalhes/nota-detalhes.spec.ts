import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotaDetalhes } from './nota-detalhes';

describe('NotaDetalhes', () => {
  let component: NotaDetalhes;
  let fixture: ComponentFixture<NotaDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDetalhes],
    }).compileComponents();

    fixture = TestBed.createComponent(NotaDetalhes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
