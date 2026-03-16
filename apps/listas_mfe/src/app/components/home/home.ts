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
    const email = localStorage.getItem(this.userEmailKey);
    if (!email) {
      // Fallback para localStorage se não houver email logado
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) this.itens = JSON.parse(salvo);
      
      const listasDB = localStorage.getItem(this.storageListasKey);
      if (listasDB) this.listasSalvas = JSON.parse(listasDB);
    } else {
      await this.carregarDadosFirestore(email);
    }

    await this.carregarLojasRecentes();
  }

  async carregarDadosFirestore(email: string) {
    const res = await this.apiService.getListas(email);
    const listas = Array.isArray(res) ? res : [];
    
    // Procura a lista ativa
    const listaAtiva = listas.find(l => l.ativa);
    if (listaAtiva) {
      this.itens = listaAtiva.itens || [];
    } else {
      // Se não tem no firestore mas tem no localStorage, migra
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        this.itens = JSON.parse(salvo);
        await this.persistirListaAtiva();
      }
    }

    // Listas salvas (modelos)
    this.listasSalvas = listas.filter(l => !l.ativa);
    if (this.listasSalvas.length === 0) {
      const listasDB = localStorage.getItem(this.storageListasKey);
      if (listasDB) {
        this.listasSalvas = JSON.parse(listasDB);
        // Sincroniza em background
        this.apiService.sincronizarListas(email, this.listasSalvas);
      }
    }
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

  get todosComprados(): boolean {
    return this.itens.length > 0 && this.itens.every(i => i.comprado);
  }

  get algunsComprados(): boolean {
    return this.itens.some(i => i.comprado) && !this.todosComprados;
  }

  toggleSelecionarTudo() {
    const novoEstado = !this.todosComprados;
    this.itens.forEach(i => i.comprado = novoEstado);
    this.salvarNoStorage();
  }

  get todosItensParaEscolherSelecionados(): boolean {
    return this.itensParaEscolher.length > 0 && this.itensParaEscolher.every(i => i.selecionado);
  }

  get algunsItensParaEscolherSelecionados(): boolean {
    return this.itensParaEscolher.some(i => i.selecionado) && !this.todosItensParaEscolherSelecionados;
  }

  toggleSelecionarTudoParaEscolher() {
    const novoEstado = !this.todosItensParaEscolherSelecionados;
    this.itensParaEscolher.forEach(i => i.selecionado = novoEstado);
  }

  get itensSorted(): ItemLista[] {
    const naoComprados = this.itens.filter(i => !i.comprado).sort((a, b) => a.nome.localeCompare(b.nome));
    const comprados = this.itens.filter(i => i.comprado).sort((a, b) => a.nome.localeCompare(b.nome));
    return [...naoComprados, ...comprados];
  }

  async toggleItem(item: ItemLista) {
    item.comprado = !item.comprado;
    await this.persistirListaAtiva();
  }

  async removerPorNome(nome: string) {
    this.itens = this.itens.filter(i => i.nome !== nome);
    await this.persistirListaAtiva();
  }

  async removerTudo() {
    this.itens = [];
    await this.persistirListaAtiva();
  }

  async salvarNoStorage() {
    await this.persistirListaAtiva();
  }

  async persistirListaAtiva() {
    const email = localStorage.getItem(this.userEmailKey);
    if (!email) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.itens));
      return;
    }

    const lista = {
      usuario_email: email,
      nome: 'LISTA ATIVA',
      itens: this.itens,
      ativa: true,
      data_criacao: new Date().toISOString()
    };

    try {
      await this.apiService.salvarLista(lista);
      // Remove do storage local para garantir que a fonte da verdade é o firestore
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Erro ao persistir no Firestore, salvando localmente como backup', error);
      localStorage.setItem(this.storageKey, JSON.stringify(this.itens));
    }
  }

  async salvarListaCompleta() {
    if (!this.nomeNovaLista.trim()) return;

    const email = localStorage.getItem(this.userEmailKey);
    const novaLista = {
      usuario_email: email,
      nome: this.nomeNovaLista.toUpperCase(),
      itens: [...this.itens],
      ativa: false,
      data_criacao: new Date().toISOString()
    };

    if (email) {
      try {
        const salva = await this.apiService.salvarLista(novaLista);
        this.listasSalvas.unshift(salva);
        localStorage.removeItem(this.storageListasKey);
      } catch (error) {
        this.listasSalvas.unshift(novaLista);
      }
    } else {
      this.listasSalvas.unshift(novaLista);
      localStorage.setItem(this.storageListasKey, JSON.stringify(this.listasSalvas));
    }

    this.nomeNovaLista = '';
    this.exibirPainelSalvar = false;
    this.cdr.detectChanges();
  }

  async deletarListaSalva(lista: any, event: Event) {
    event.stopPropagation();
    const email = localStorage.getItem(this.userEmailKey);
    
    if (lista.id && email) {
      await this.apiService.deletarLista(lista.id);
    }
    
    this.listasSalvas = this.listasSalvas.filter(l => l.id !== lista.id && l.nome !== lista.nome);
    if (!email) {
      localStorage.setItem(this.storageListasKey, JSON.stringify(this.listasSalvas));
    }
  }
}