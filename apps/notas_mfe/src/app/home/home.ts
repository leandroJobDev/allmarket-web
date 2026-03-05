import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotasService } from '@allmarket-web/shared';
import { NotaDetalhes } from '../nota-detalhes/nota-detalhes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NotaDetalhes
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private notasService = inject(NotasService);

  todasAsNotas: any[] = [];
  notasFiltradas: any[] = [];
  notasExibidas: any[] = [];
  
  limiteExibicao = 8;
  termoBusca = '';

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    const email = localStorage.getItem('allmarket_user_email');
    if (email) {
      try {
        const notas = await this.notasService.getHistorico(email);
        this.todasAsNotas = notas.sort((a: any, b: any) => b.data_emissao.localeCompare(a.data_emissao));
        this.atualizarLista();
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
  }

  filtrarHistorico(event: any) {
    this.termoBusca = event.target.value.toLowerCase();
    this.atualizarLista();
  }

  atualizarLista() {
    this.notasFiltradas = this.todasAsNotas.filter(nota => 
      nota.estabelecimento.nome.toLowerCase().includes(this.termoBusca)
    );
    this.notasExibidas = this.notasFiltradas.slice(0, this.limiteExibicao);
  }

  mostrarMaisNotas() {
    this.limiteExibicao += 8;
    this.atualizarLista();
  }

  get temMaisNotas(): boolean {
    return this.notasExibidas.length < this.notasFiltradas.length;
  }

  handleDeleteNota(chave: string) {
    this.todasAsNotas = this.todasAsNotas.filter(nota => nota.chave !== chave);
    this.atualizarLista();
  }

  onCloseDetails() {
    this.atualizarLista();
  }
}