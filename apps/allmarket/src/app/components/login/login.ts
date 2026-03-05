import { Component, OnInit, NgZone, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotasService, environment } from '@allmarket-web/shared'; 
import { Home } from '../home/home'; 

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,      
    Home    
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit { 
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private snackBar = inject(MatSnackBar);
  private notasService = inject(NotasService);

  loading = false;
  isLoggedIn = false;
  userData: any = null;
  temNotas = false;
  erroMfe = false;

  ngOnInit() {
    this.verificarSessao();
    this.iniciarLoginGoogle();
  }

  verificarSessao() {
    const savedUser = localStorage.getItem('allmarket_user');
    if (savedUser) {
      this.userData = JSON.parse(savedUser);
      this.isLoggedIn = true;
      this.verificarNotas(this.userData.email);
    }
  }

  iniciarLoginGoogle() {
    if (this.isLoggedIn) return;
    
    if (typeof google === 'undefined' || !google.accounts) {
      setTimeout(() => this.iniciarLoginGoogle(), 300);
      return;
    }

    const container = document.getElementById("google-btn-container");
    if (!container) {
      setTimeout(() => this.iniciarLoginGoogle(), 100);
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: true,
      ux_mode: 'popup'
    });

    google.accounts.id.renderButton(
      container,
      { theme: "outline", size: "large", shape: "pill", width: 280, locale: "pt_BR" }
    );
  }

handleCredentialResponse(response: any) {
  this.ngZone.run(async () => {
    this.loading = true;
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      this.userData = JSON.parse(jsonPayload);
      localStorage.setItem('allmarket_user', JSON.stringify(this.userData));
      this.isLoggedIn = true; 

      await this.verificarNotas(this.userData.email);
      
      if (!this.temNotas) {
        this.router.navigate(['/home']); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

async verificarNotas(email: string) {
    try {
      this.temNotas = await this.notasService.validarEAtualizarNotas(email);
      
      if (this.temNotas) {
        this.ngZone.run(() => {
          this.router.navigate(['/notas']);
        });
      }
    } catch (error) {
      this.exibirErroMfe();
    }
}

  private exibirErroMfe() {
    this.erroMfe = true;
    this.temNotas = false;
    this.snackBar.open('Sistema de notas indisponível no momento.', 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  sair() {
    this.notasService.limparEstado();
    localStorage.removeItem('allmarket_user');
    this.isLoggedIn = false;
    this.userData = null;
    this.temNotas = false;
    this.router.navigate(['/login']);
    setTimeout(() => this.iniciarLoginGoogle(), 300);
  }
}