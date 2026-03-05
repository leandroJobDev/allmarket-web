import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar, ProcessarNota } from '@allmarket-web/shared';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, ProcessarNota],
  selector: 'app-allmarket-entry',
  templateUrl: './entry.html',
  styleUrls: ['./entry.scss']
})
export class RemoteEntry implements OnInit {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  exibirNavbar = false;
  exibirProcessarNota = false;
  userData: any = null;

  ngOnInit() {
    console.log('[RemoteEntry] ngOnInit start');
    this.verificarStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      console.log('[RemoteEntry] NavigationEnd:', this.router.url);
      this.verificarStatus();
    });
  }

  verificarStatus() {
    const dadosUsuario = localStorage.getItem('allmarket_user');
    const url = this.router.url;
    console.log('[RemoteEntry] verificarStatus', { dadosUsuario, url });

    if (dadosUsuario) {
      this.userData = JSON.parse(dadosUsuario);
      // Mostrar navbar em todas as rotas EXCETO /login
      this.exibirNavbar = !url.includes('/login');
      // Mostrar processar-nota em todas as rotas EXCETO /login
      this.exibirProcessarNota = !url.includes('/login');
      console.log('[RemoteEntry] userData set, exibirNavbar=', this.exibirNavbar, 'exibirProcessarNota=', this.exibirProcessarNota);
    } else {
      this.exibirNavbar = false;
      this.exibirProcessarNota = false;
      this.userData = null;
      console.log('[RemoteEntry] no user data, hiding navbar and processar-nota');
    }
    this.cdr.detectChanges();
  }

  sair() {
    console.log('[RemoteEntry] logout triggered');
    localStorage.removeItem('allmarket_user');
    this.userData = null;
    this.exibirNavbar = false;
    this.exibirProcessarNota = false;
    this.router.navigate(['/login']);
  }
}