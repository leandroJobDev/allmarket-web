import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NotasApiService } from '@allmarket-web/shared';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  providers: [CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements AfterViewInit {
  private apiService = inject(NotasApiService);
  totalGeral = 0;
  private barChart: any;
  private pieChart: any;

  async ngAfterViewInit() {
    const email = localStorage.getItem('allmarket_user_email');
    if (email) {
      const notas = await this.apiService.getHistorico(email);
      this.processarEDesenhar(notas);
    }
  }

  processarEDesenhar(notas: any[]) {
    const dadosMensais: any = {};
    const dadosLojas: any = {};
    let soma = 0;

    const removerPalavras = /SUPERMERCADOS?|MERCADOS?|ATACADISTA|COMERCIO|LTDA|S\/A|CIA|BRASILEIRA/gi;

    notas.forEach(nota => {
      const valor = Number(nota.valor_total) || 0;
      
      if (valor > 0) {
        soma += valor;

        if (nota.data_emissao) {
          const dataString = nota.data_emissao.split(' ')[0];
          const partes = dataString.split('/');
          if (partes.length === 3) {
            const mesAno = `${partes[1]}/${partes[2]}`;
            dadosMensais[mesAno] = (dadosMensais[mesAno] || 0) + valor;
          }
        }

        let nomeLoja = nota.estabelecimento?.nome || "OUTROS";
        nomeLoja = nomeLoja.replace(removerPalavras, '').trim().split(' ')[0].toUpperCase();
        if (!nomeLoja) nomeLoja = "OUTROS";
        
        dadosLojas[nomeLoja] = (dadosLojas[nomeLoja] || 0) + valor;
      }
    });

    this.totalGeral = soma;
    this.renderizarGraficos(dadosMensais, dadosLojas);
  }

  renderizarGraficos(dadosMensais: any, dadosLojas: any) {
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: Object.keys(dadosMensais),
        datasets: [{
          data: Object.values(dadosMensais),
          backgroundColor: '#2563eb',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    this.pieChart = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(dadosLojas),
        datasets: [{
          data: Object.values(dadosLojas),
          backgroundColor: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}