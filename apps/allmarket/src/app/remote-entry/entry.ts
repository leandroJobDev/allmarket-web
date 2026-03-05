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
    this.verificarStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.verificarStatus();
    });
  }

  verificarStatus() {
    const dadosUsuario = localStorage.getItem('allmarket_user');
    const url = this.router.url;

    if (dadosUsuario) {
      this.userData = JSON.parse(dadosUsuario);
      this.exibirNavbar = !url.includes('/login');
      this.exibirProcessarNota = !url.includes('/login');

      if (url.includes('/login') || url === '/') {
        this.router.navigate(['/']);
      }
    } else {
      this.exibirNavbar = false;
      this.exibirProcessarNota = false;
      this.userData = null;

      if (!url.includes('/login')) {
        this.router.navigate(['/login']);
      }
    }
    this.cdr.detectChanges();
  }

  sair() {
    localStorage.removeItem('allmarket_user');
    localStorage.removeItem('allmarket_user_email');
    this.router.navigate(['/login']);
  }
}