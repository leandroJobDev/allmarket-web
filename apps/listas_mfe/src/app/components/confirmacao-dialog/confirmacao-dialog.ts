import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmacao-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.titulo || 'Confirmação' }}</h2>
    <mat-dialog-content>
      <p>{{ data.mensagem }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="btn-cancelar" (click)="onCancelar()">CANCELAR</button>
      <button mat-raised-button class="btn-confirmar" (click)="onConfirmar()">{{ data.textoConfirmar || 'EXCLUIR' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display: block; padding: 8px; border-radius: 20px; }
    h2 { font-weight: 800; color: #0f172a; margin-bottom: 12px; font-size: 20px; letter-spacing: -0.5px; }
    mat-dialog-content { padding: 0; margin-bottom: 24px; color: #64748b; font-size: 15px; line-height: 1.6; }
    mat-dialog-actions { 
      padding: 0; gap: 12px; 
      button { 
        border-radius: 12px; font-weight: 700; padding: 8px 20px; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;
      }
    }
    .btn-cancelar { color: #64748b; }
    .btn-confirmar { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
  `]
})
export class ConfirmacaoDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmacaoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelar(): void {
    this.dialogRef.close(false);
  }

  onConfirmar(): void {
    this.dialogRef.close(true);
  }
}
