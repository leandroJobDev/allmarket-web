import { Component, OnInit, NgZone, inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotasApiService } from '@allmarket-web/shared'; 

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, AfterViewInit { 
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private snackBar = inject(MatSnackBar);
  private apiService = inject(NotasApiService);

  loading = false;
  userData: any = null;
  temNotas = false;
  erroMfe = false;

  ngOnInit() {
    
    this.configurarGoogle();
  }

  ngAfterViewInit() {
    
    this.renderizarBotaoGoogle();
  }

  configurarGoogle() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '570724598871-n23jsilb8ncvfv2ve6b848q327fgdav9.apps.googleusercontent.com',
        callback: (res: any) => this.handleLogin(res)
      });
    }
  }

  renderizarBotaoGoogle() {
    const interval = setInterval(() => {
      const btnContainer = document.getElementById("google-btn-container");
      if (btnContainer && typeof google !== 'undefined') {
        google.accounts.id.renderButton(
          btnContainer,
          { theme: "outline", size: "large", shape: "pill", width: 280 }
        );
        clearInterval(interval);
      }
    }, 100);
  }

  handleLogin(response: any) {
    this.ngZone.run(async () => {
      this.loading = true;
      try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        localStorage.setItem('allmarket_user', JSON.stringify(payload));
        localStorage.setItem('allmarket_user_email', payload.email);

        this.temNotas = await this.apiService.validarEAtualizarNotas(payload.email);
        
        if (this.temNotas) {
          this.router.navigate(['/notas']);
        } else {
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Erro no login:', error);
        this.snackBar.open('Erro ao validar acesso', 'Fechar', { duration: 3000 });
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}