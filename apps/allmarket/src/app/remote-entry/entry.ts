import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar, NotasApiService } from '@allmarket-web/shared';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  selector: 'app-allmarket-entry',
  templateUrl: './entry.html',
  styleUrls: ['./entry.scss']
})
export class RemoteEntry implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private apiService = inject(NotasApiService);

  exibirNavbar = false;
  exibirProcessarNota = false;
  userData: any = null;

  ngOnInit() {
    this.verificarStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.verificarStatus());
  }

  async verificarStatus() {
    const dadosUsuario = localStorage.getItem('allmarket_user');
    const email = localStorage.getItem('allmarket_user_email');
    const url = this.router.url;

    if (dadosUsuario && email) {
      this.userData = JSON.parse(dadosUsuario);
      this.exibirNavbar = !url.includes('/login');
      this.exibirProcessarNota = !url.includes('/login');

      if (url === '/' || url === '/login') {
        const temNotas = await this.apiService.validarEAtualizarNotas(email);
        if (temNotas) {
          this.router.navigate(['/notas']);
        } else {
          this.router.navigate(['/home']);
        }
      }
    } else {
      this.exibirNavbar = false;
      this.exibirProcessarNota = false;
      if (!url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    }
    this.cdr.detectChanges();
  }

  sair() {
    localStorage.removeItem('allmarket_user');
    localStorage.removeItem('allmarket_user_email');
    this.apiService.limparEstado();
    this.router.navigate(['/login']);
  }
}