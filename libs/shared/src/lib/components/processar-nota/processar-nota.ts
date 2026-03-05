import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'lib-processar-nota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './processar-nota.html',
  styleUrl: './processar-nota.scss',
})
export class ProcessarNota implements OnInit {
  urlNota: string = '';
  isProcessando: boolean = false;

  ngOnInit() {
    console.log('[ProcessarNota] component initialized');
  }

  enviarNota() {
    if (!this.urlNota.trim()) {
      console.warn('[ProcessarNota] URL vazia');
      return;
    }
    
    this.isProcessando = true;
    console.log('[ProcessarNota] Processando nota:', this.urlNota);
    
    // Simulação de processamento
    setTimeout(() => {
      this.isProcessando = false;
      this.urlNota = '';
    }, 1500);
  }
}
