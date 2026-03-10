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
  storageKey = 'allmarket_lista_compras';
  userEmailKey = 'allmarket_user_email';

  async ngOnInit() {
    const salvo = localStorage.getItem(this.storageKey);
    if (salvo) this.itens = JSON.parse(salvo);
    await this.carregarLojasRecentes();
  }

  async carregarLojasRecentes() {
    const email = localStorage.getItem(this.userEmailKey);
    if (!email) return;

    try {
      const notas = await this.apiService.getHistorico(email);
      const lojasUnicas = new Map();
      
      notas.forEach((nota: any) => {
        const nomeLoja = nota.estabelecimento?.nome || 'Loja Desconhecida';
        const nomeLimpo = nomeLoja.replace(/SUPERMERCADOS?|MERCADOS?|ATACADISTA|LTDA|S\/A/gi, '').trim();
        
        if (!lojasUnicas.has(nomeLimpo)) {
          lojasUnicas.set(nomeLimpo, {
            nome: nomeLimpo,
            itens: nota.itens || nota.produtos || []
          });
        }
      });

      this.lojasRecentes = Array.from(lojasUnicas.values()).slice(0, 10);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  importarItensDaLoja(loja: any) {
    loja.itens.forEach((p: any) => {
      const nome = p.nome.toUpperCase().trim();
      if (!this.itens.find(i => i.nome === nome)) {
        this.itens.unshift({ nome, comprado: false });
      }
    });
    this.salvarNoStorage();
  }

  adicionarItem(input: HTMLInputElement | string) {
    const valor = typeof input === 'string' ? input : input.value;
    const nome = valor.trim().toUpperCase();
    if (nome) {
      if (!this.itens.find(i => i.nome === nome)) {
        this.itens.unshift({ nome, comprado: false });
      }
      if (typeof input !== 'string') input.value = '';
      this.salvarNoStorage();
    }
  }

  removerItem(index: number) {
    this.itens.splice(index, 1);
    this.salvarNoStorage();
  }

  salvarNoStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itens));
  }
}