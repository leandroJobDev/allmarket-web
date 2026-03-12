import { Component, OnInit, inject, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
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
export class Home implements OnInit, AfterViewChecked {
  private apiService = inject(NotasApiService);
  private cdr = inject(ChangeDetectorRef);

  todasAsNotas: any[] = [];
  notasFiltradas: any[] = [];
  notasExibidas: any[] = [];
  notaSelecionada: any = null;
  limiteExibicao = 0;
  termoBusca = '';
  private processandoChave = false;

  ngOnInit() {
    this.definirLimiteInicial();
    this.carregarDados();
  }

  ngAfterViewChecked() {
    const chaveParaAbrir = localStorage.getItem('allmarket_nota_chave_focus');
    if (chaveParaAbrir && !this.processandoChave && this.todasAsNotas.length > 0) {
      this.processandoChave = true;
      this.verificarNotaParaAbrir(chaveParaAbrir);
    }
  }

  private verificarNotaParaAbrir(chave: string) {
    const notaEncontrada = this.todasAsNotas.find(n => n.chave === chave);
    if (notaEncontrada) {
      this.selecionarNota(notaEncontrada);
      localStorage.removeItem('allmarket_nota_chave_focus');
      this.cdr.detectChanges();
    }
    setTimeout(() => this.processandoChave = false, 500);
  }

  async carregarDados() {
    const email = localStorage.getItem('allmarket_user_email');
    if (!email) return;

    try {
      this.todasAsNotas = await this.apiService.getHistorico(email);
      this.aplicarFiltrosEDados();
      
      const chave = localStorage.getItem('allmarket_nota_chave_focus');
      if (chave) this.verificarNotaParaAbrir(chave);
    } catch (error) {
      console.error(error);
    }
  }

  selecionarNota(nota: any) {
    this.notaSelecionada = nota;
    this.cdr.detectChanges();
  }

  limparNome(nome: string): string {
    if (!nome) return '';
    const remover = /SUPERMERCADOS?|MERCADOS?|ATACADISTA|COMERCIO|LTDA|S\/A/gi;
    return nome.replace(remover, '').trim();
  }

  formatarData(data: string): string {
    if (!data) return '';
    return data.split(' ')[0];
  }

  get temMaisNotas(): boolean {
    return this.notasFiltradas.length > this.notasExibidas.length;
  }

  atualizarLista() {
    this.notasExibidas = this.notasFiltradas.slice(0, this.limiteExibicao);
    this.cdr.detectChanges();
  }

  filtrarHistorico(event: Event) {
    const input = event.target as HTMLInputElement;
    this.termoBusca = input.value.toLowerCase();
    this.definirLimiteInicial();
    this.notaSelecionada = null;
    this.aplicarFiltrosEDados();
  }

  private definirLimiteInicial() {
    const width = window.innerWidth;
    if (width < 768) this.limiteExibicao = 6;
    else if (width < 1200) this.limiteExibicao = 10;
    else this.limiteExibicao = 16;
  }

  aplicarFiltrosEDados() {
    this.notasFiltradas = this.todasAsNotas.filter(nota => {
      const nome = nota.estabelecimento?.nome?.toLowerCase() || '';
      return nome.includes(this.termoBusca.toLowerCase());
    });
    this.atualizarLista();
  }

  mostrarMaisNotas() {
    const width = window.innerWidth;
    if (width < 768) this.limiteExibicao += 6;
    else if (width < 1200) this.limiteExibicao += 10;
    else this.limiteExibicao += 16;
    this.atualizarLista();
  }

  async excluirNota(chave: string) {
    const email = localStorage.getItem('allmarket_user_email');
    if (!email || !chave) return;
  
    try {
      const sucesso = await this.apiService.excluirNota(chave, email);
      if (sucesso) {
        setTimeout(() => {
          this.notaSelecionada = null;
          this.cdr.detectChanges();
        }, 0);
  
        await this.carregarDados();
      }
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  }
}