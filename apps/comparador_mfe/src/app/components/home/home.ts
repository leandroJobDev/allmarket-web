import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NotasApiService } from '@allmarket-web/shared';

interface ItemComparador {
  nome: string;
  loja: string;
  preco: number;
  data: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  providers: [CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private apiService = inject(NotasApiService);
  
  todosOsItens: ItemComparador[] = [];
  itensFiltrados: ItemComparador[] = [];

  async ngOnInit() {
    const email = localStorage.getItem('allmarket_user_email');
    if (email) {
      const notas = await this.apiService.getHistorico(email);
      this.prepararBaseDeDados(notas);
    }
  }

  prepararBaseDeDados(notas: any[]) {
    const listaTemporaria: ItemComparador[] = [];
    const removerPalavras = /SUPERMERCADOS?|MERCADOS?|ATACADISTA|COMERCIO|LTDA|S\/A/gi;

    notas.forEach(nota => {
      if (nota.itens && Array.isArray(nota.itens)) {
        const nomeLoja = (nota.estabelecimento?.nome_fantasia || nota.estabelecimento?.nome || 'Desconhecido')
          .replace(removerPalavras, '').trim().toUpperCase();

        nota.itens.forEach((item: any) => {
          listaTemporaria.push({
            nome: item.nome.toUpperCase(),
            loja: nomeLoja,
            preco: item.preco_unitario,
            data: nota.data_emissao ? nota.data_emissao.split(' ')[0] : ''
          });
        });
      }
    });

    // Ordenar do mais barato para o mais caro por padrão
    this.todosOsItens = listaTemporaria.sort((a, b) => a.preco - b.preco);
  }

  filtrarItens(event: any) {
    const termo = event.target.value.toLowerCase();
    if (termo.length < 2) {
      this.itensFiltrados = [];
      return;
    }

    this.itensFiltrados = this.todosOsItens.filter(item => 
      item.nome.toLowerCase().includes(termo)
    );
  }
}