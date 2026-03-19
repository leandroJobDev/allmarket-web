import { Component, OnInit, inject, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NotasApiService } from '@allmarket-web/shared';
import { ConfirmacaoDialog } from '../confirmacao-dialog/confirmacao-dialog';
import { firstValueFrom } from 'rxjs';

interface ItemLista {
  nome: string;
  comprado: boolean;
  categoria?: string;
}

@Pipe({
  name: 'groupBy',
  standalone: true
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any[] {
    if (!collection || !Array.isArray(collection)) return [];
    
    const groups = collection.reduce((acc, curr) => {
      if (!curr) return acc;
      const key = (curr[property] || 'OUTROS').toUpperCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {} as { [key: string]: any[] });

    return Object.keys(groups).map(key => ({
      key,
      value: groups[key]
    })).sort((a, b) => {
      if (a.key === 'OUTROS') return 1;
      if (b.key === 'OUTROS') return -1;
      return a.key.localeCompare(b.key);
    });
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatCheckboxModule, MatDialogModule, GroupByPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private apiService = inject(NotasApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  itens: ItemLista[] = [];
  limiteLojas: number = 10;
  lojasRecentes: any[] = [];
  listasSalvas: any[] = [];
  lojaSelecionada: any = null;
  itensParaEscolher: any[] = [];

  nomeNovaLista: string = '';
  exibirPainelSalvar: boolean = false;

  listaAtivaObjeto: any = null;
  emailParaCompartilhar: string = '';
  exibirPainelCompartilhar: boolean = false;
  emailsVinculados: string[] = [];

  storageKey = 'allmarket_lista_compras';
  storageListasKey = 'allmarket_listas_salvas_db';
  userEmailKey = 'allmarket_user_email';

  async ngOnInit() {
    const email = localStorage.getItem(this.userEmailKey);
    if (!email) {
      // Fallback para localStorage se não houver email logado
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        this.itens = JSON.parse(salvo).map((i: any) => ({
          ...i,
          categoria: i.categoria || 'OUTROS'
        }));
      }

      const listasDB = localStorage.getItem(this.storageListasKey);
      if (listasDB) this.listasSalvas = JSON.parse(listasDB);
    } else {
      await this.carregarDadosFirestore(email);
      await this.carregarVinculos(email);
    }

    await this.carregarLojasRecentes();
  }

  async carregarVinculos(email: string) {
    const vinculos = await this.apiService.getVinculos(email);
    // Remove o próprio e-mail da lista de exibição para mostrar apenas os parceiros
    this.emailsVinculados = vinculos.filter(e => e.toLowerCase() !== email.toLowerCase());
  }

  async carregarDadosFirestore(email: string) {
    const res = await this.apiService.getListas(email);
    const listas = Array.isArray(res) ? res : [];

    // Procura a lista ativa
    const listaAtiva = listas.find(l => l.ativa);
    if (listaAtiva) {
      this.listaAtivaObjeto = listaAtiva;
      this.itens = (listaAtiva.itens || []).map((i: any) => ({
        ...i,
        categoria: i.categoria || 'OUTROS'
      }));
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
      // Busca apenas o histórico necessário baseado no limite
      const notas = await this.apiService.getHistorico(email);
      // O backend traz tudo, nós limitamos aqui para manter a performance de visualização
      const notasLimitadas = notas.slice(0, this.limiteLojas * 2); // Pega um pouco mais para garantir lojas únicas
      const lojasProcessadas: any[] = [];

      notasLimitadas.forEach((nota: any) => {
        const est = nota.estabelecimento;
        if (!est) return;

        let nomeExibicao = '';
        if (est.nome_fantasia && est.nome_fantasia.trim() !== '') {
          nomeExibicao = est.nome_fantasia.trim().toUpperCase();
        } else {
          nomeExibicao = est.nome.replace(/SUPERMERCADOS?|MERCADOS?|ATACADISTA|LTDA|S\/A|COMERCIO|IMPORTACAO|EXPORTACAO/gi, '').trim().toUpperCase();
        }

        lojasProcessadas.push({
          nome: nomeExibicao,
          data: nota.data_emissao,
          itens: nota.itens || []
        });
      });

      this.lojasRecentes = lojasProcessadas.slice(0, this.limiteLojas);
      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

  abrirEscolhaItens(obj: any, isLista: boolean = false) {
    this.lojaSelecionada = obj;
    this.itensParaEscolher = obj.itens.map((p: any) => ({
      nome: p.nome.toUpperCase().trim(),
      categoria: p.categoria || 'OUTROS',
      selecionado: isLista
    }));
  }

  confirmarSelecao() {
    const selecionados = this.itensParaEscolher.filter(i => i.selecionado);
    selecionados.forEach(item => {
      if (!this.itens.find(i => i.nome === item.nome)) {
        this.itens.unshift({ 
          nome: item.nome, 
          comprado: false,
          categoria: item.categoria 
        });
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
        this.itens.unshift({ nome, comprado: false, categoria: 'OUTROS' });
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
    return [...this.itens].sort((a, b) => a.nome.localeCompare(b.nome));
  }

  trackByGrupo(index: number, grupo: any) { return grupo.key; }
  trackByItem(index: number, item: any) { return item.nome; }

  getIcon(categoria: string): string {
    if (!categoria) return 'inventory_2';
    
    const icons: { [key: string]: string } = {
      'ALIMENTOS': 'restaurant',
      'LATICÍNIOS': 'egg_alt',
      'BEBIDAS': 'local_drink',
      'HIGIENE': 'sanitizer',
      'HIGIENE PESSOAL': 'sanitizer',
      'LIMPEZA': 'cleaning_services',
      'HORTIFRUTI': 'eco',
      'CARNES': 'kebab_dining',
      'CARNES E EMBUTIDOS': 'kebab_dining',
      'PADARIA': 'bakery_dining',
      'OUTROS': 'inventory_2'
    };

    return icons[categoria.toUpperCase()] || 'inventory_2';
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
      ...this.listaAtivaObjeto,
      usuario_email: email,
      nome: 'LISTA ATIVA',
      itens: this.itens,
      ativa: true,
      data_criacao: this.listaAtivaObjeto?.data_criacao || new Date().toISOString()
    };

    try {
      const salva = await this.apiService.salvarLista(lista);
      this.listaAtivaObjeto = salva;
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
    
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Excluir Lista',
        mensagem: `Deseja realmente excluir a lista "${lista.nome}"?`
      }
    });

    const confirmar = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmar) return;

    const email = localStorage.getItem(this.userEmailKey);
    
    if (lista.id && email) {
      await this.apiService.deletarLista(lista.id);
    }
    
    this.listasSalvas = this.listasSalvas.filter(l => l.id !== lista.id && l.nome !== lista.nome);
    if (!email) {
      localStorage.setItem(this.storageListasKey, JSON.stringify(this.listasSalvas));
    }
  }

  async compartilharLista() {
    const emailDesejado = this.emailParaCompartilhar.trim().toLowerCase();
    if (!emailDesejado || !emailDesejado.includes('@')) return;

    const userEmail = localStorage.getItem(this.userEmailKey);
    if (!userEmail) return;

    try {
      await this.apiService.vincularEmail(userEmail, emailDesejado);
      await this.carregarVinculos(userEmail); // Atualiza lista global
      await this.carregarDadosFirestore(userEmail); // Atualiza dados agora que estão vinculados

      this.emailParaCompartilhar = '';
      this.exibirPainelCompartilhar = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao vincular', error);
    }
  }

  async removerCompartilhamento(email: string) {
    const dialogRef = this.dialog.open(ConfirmacaoDialog, {
      data: {
        titulo: 'Remover Vínculo',
        mensagem: `Deseja realmente desvincular o e-mail ${email}? Você deixará de compartilhar dados com esta conta.`,
        textoConfirmar: 'DESVINCULAR'
      }
    });

    const confirmar = await firstValueFrom(dialogRef.afterClosed());
    if (!confirmar) return;

    const userEmail = localStorage.getItem(this.userEmailKey);
    if (!userEmail) return;

    try {
      await this.apiService.desvincularEmail(userEmail, email);
      await this.carregarVinculos(userEmail);
      await this.carregarDadosFirestore(userEmail);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao desvincular', error);
    }
  }
}