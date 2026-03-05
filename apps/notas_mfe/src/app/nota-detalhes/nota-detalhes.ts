import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nota-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './nota-detalhes.html',
  styleUrl: './nota-detalhes.scss',
})
export class NotaDetalhes {
  @Input() nota: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() excluir = new EventEmitter<string>();

  displayedColumns: string[] = ['item', 'valor'];

  emitFechar() {
    this.fechar.emit();
  }

  emitExcluir(chave: string) {
    this.excluir.emit(chave);
  }

  fecharNota() {
    this.emitFechar();
  }

  removerNota(chave: string) {
    this.emitExcluir(chave);
  }
}