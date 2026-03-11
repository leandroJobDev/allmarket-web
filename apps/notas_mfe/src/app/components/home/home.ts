import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotasApiService } from '@allmarket-web/shared';
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
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private apiService = inject(NotasApiService);
  private cdr = inject(ChangeDetectorRef);

  todasAsNotas: any[] = [];
  notasFiltradas: any[] = [];
  notasExibidas: any[] = [];
  notaSelecionada: any = null;
  limiteExibicao = 0; 
  termoBusca = '';

  ngOnInit() {
    this.definirLimiteInicial();
    this.carregarDados();
  }

  async carregarDados() {
    const email = localStorage.getItem('allmarket_user_email');
    if (email) {
      try {
        const notas = await this.apiService.getHistorico(email);
        
        this.todasAsNotas = [...notas].sort((a: any, b: any) =>
          (b.data_emissao || '').localeCompare(a.data_emissao || '')
        );
        
        this.aplicarFiltrosEDados();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async handleDeleteNota(chave: string) {
    const email = localStorage.getItem('allmarket_user_email');
    if (email && chave) {
      const sucesso = await this.apiService.excluirNota(chave, email);
      if (sucesso) {
        this.todasAsNotas = this.todasAsNotas.filter(n => n.chave !== chave);
        this.notaSelecionada = null;
        this.atualizarLista();
      }
    }
  }

  selecionarNota(nota: any) {
    if (this.notaSelecionada?.chave === nota.chave) {
      this.notaSelecionada = null;
    } else {
      this.notaSelecionada = nota;
      setTimeout(() => {
        document.getElementById('res')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  atualizarLista() {
    this.notasFiltradas = this.todasAsNotas.filter(nota => {
      const nome = nota.estabelecimento?.nome?.toLowerCase() || '';
      return nome.includes(this.termoBusca);
    });
    this.notasExibidas = this.notasFiltradas.slice(0, this.limiteExibicao);
    this.cdr.detectChanges();
  }

  filtrarHistorico(event: Event) {
    const input = event.target as HTMLInputElement;
    this.termoBusca = input.value.toLowerCase();
    this.definirLimiteInicial(); 
    this.notaSelecionada = null;
    this.atualizarLista();
  }

  private definirLimiteInicial() {
    const width = window.innerWidth;
    if (width < 768) {
      this.limiteExibicao = 6;  
    } else if (width < 1200) {
      this.limiteExibicao = 10; 
    } else {
      this.limiteExibicao = 16; 
    }
  }

  aplicarFiltrosEDados() {
    this.notasFiltradas = this.todasAsNotas.filter(nota => {
      const nome = nota.estabelecimento?.nome?.toLowerCase() || '';
      return nome.includes(this.termoBusca.toLowerCase());
    });

    
    this.notasExibidas = this.notasFiltradas.slice(0, this.limiteExibicao);
    this.cdr.detectChanges();
  }

  
  mostrarMaisNotas() {
    const width = window.innerWidth;
    if (width < 768) this.limiteExibicao += 6;
    else if (width < 1200) this.limiteExibicao += 10;
    else this.limiteExibicao += 16;

    this.aplicarFiltrosEDados();
  }

  limparNome(nome: string): string {
    if (!nome) return 'ESTABELECIMENTO';
    return nome.replace(/SUPERMERCADOS?|MERCADOS?|ATACADISTA|COMERCIO|LTDA|S\/A/gi, '').trim();
  }

  formatarData(dataStr: string): string {
    return dataStr ? dataStr.split(' ')[0] : '--/--/----';
  }

  get temMaisNotas(): boolean {
    return this.notasExibidas.length < this.notasFiltradas.length;
  }
}