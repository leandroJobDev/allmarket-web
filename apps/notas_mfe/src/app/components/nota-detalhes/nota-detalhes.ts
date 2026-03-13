import { Component, Input, Output, EventEmitter, inject, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-nota-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './nota-detalhes.html',
  styleUrls: ['./nota-detalhes.scss'],
})
export class NotaDetalhes implements OnChanges {
  private dialog = inject(MatDialog);
  private elementRef = inject(ElementRef);

  @Input() nota: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() excluir = new EventEmitter<string>();

  displayedColumns: string[] = ['item', 'valor'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nota'] && changes['nota'].currentValue) {
      this.executarRolagem();
    }
  }

  private executarRolagem() {
    setTimeout(() => {
      this.elementRef.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  fecharNota() {
    this.fechar.emit();
  }

  removerNota(chave: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluir.emit(chave);
      }
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Excluir Nota</h2>
    <mat-dialog-content>Deseja realmente remover esta nota?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Excluir</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}