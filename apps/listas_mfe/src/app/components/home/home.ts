import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotasApiService } from '@allmarket-web/shared';

interface ItemLista {
  nome: string;
  comprado: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatCheckboxModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private apiService = inject(NotasApiService);
  private cdr = inject(ChangeDetectorRef);
  
  itens: ItemLista[] = [];
  lojasRecentes: any[] = [];
  listasSalvas: any[] = [];
  lojaSelecionada: any = null;
  itensParaEscolher: any[] = [];
  
  nomeNovaLista: string = '';
  exibirPainelSalvar: boolean = false;
  
  storageKey = 'allmarket_lista_compras';
  storageListasKey = 'allmarket_listas_salvas_db';
  userEmailKey = 'allmarket_user_email';

  async ngOnInit() {
    const salvo = localStorage.getItem(this.storageKey);
    if (salvo) this.itens = JSON.parse(salvo);
    
    const listasDB = localStorage.getItem(this.storageListasKey);
    if (listasDB) this.listasSalvas = JSON.parse(listasDB);

    await this.carregarLojasRecentes();
  }

  async carregarLojasRecentes() {
    const email = localStorage.getItem(this.userEmailKey);
    if (!email) return;

    try {
      const notas = await this.apiService.getHistorico(email);
      const lojasUnicas = new Map();

      notas.forEach((nota: any) => {
        const nomeLoja = nota.estabelecimento?.nome_fantasia || nota.estabelecimento?.nome;
        if (nomeLoja && !lojasUnicas.has(nomeLoja)) {
          const nomeLimpo = nomeLoja.replace(/SUPERMERCADOS?|MERCADOS?|ATACADISTA|LTDA|S\/A/gi, '').trim();
          lojasUnicas.set(nomeLoja, {
            nome: nomeLimpo,
            itens: nota.itens || []
          });
        }
      });

      this.lojasRecentes = Array.from(lojasUnicas.values()).slice(0, 10);
      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

  abrirEscolhaItens(obj: any, isLista: boolean = false) {
    this.lojaSelecionada = obj;
    this.itensParaEscolher = obj.itens.map((p: any) => ({
      nome: p.nome.toUpperCase().trim(),
      selecionado: isLista
    }));
  }

  confirmarSelecao() {
    const selecionados = this.itensParaEscolher.filter(i => i.selecionado);
    selecionados.forEach(item => {
      if (!this.itens.find(i => i.nome === item.nome)) {
        this.itens.unshift({ nome: item.nome, comprado: false });
      }
    });
    this.salvarNoStorage();
    this.fecharSelecao();
  }

  fecharSelecao() {
    this.lojaSelecionada = null;
    this.itensParaEscolher = [];
  }

  adicionarItem(input: HTMLInputElement | string) {
    const valor = typeof input === 'string' ? input : input.value;
    const nome = valor.trim().toUpperCase();
    if (nome) {
      if (!this.itens.find(i => i.nome === nome)) {
        this.itens.unshift({ nome, comprado: false });
        this.salvarNoStorage();
      }
      if (typeof input !== 'string') input.value = '';
    }
  }

  removerItem(index: number) {
    this.itens.splice(index, 1);
    this.salvarNoStorage();
  }

  salvarNoStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itens));
  }

  salvarListaCompleta() {
    if (!this.nomeNovaLista.trim()) return;

    const novaLista = {
      nome: this.nomeNovaLista.toUpperCase(),
      itens: [...this.itens],
      isListaSalva: true
    };

    this.listasSalvas.unshift(novaLista);
    localStorage.setItem(this.storageListasKey, JSON.stringify(this.listasSalvas));

    this.nomeNovaLista = '';
    this.exibirPainelSalvar = false;
    this.cdr.detectChanges();
  }
}