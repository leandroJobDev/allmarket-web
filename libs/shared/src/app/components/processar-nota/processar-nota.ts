import { Component, OnInit, Injector, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotasApiService } from '../../services/notas-api.service';

@Component({
  selector: 'lib-processar-nota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './processar-nota.html',
  styleUrl: './processar-nota.scss',
})
export class ProcessarNota implements OnInit {
  private apiService: NotasApiService | null = null;
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  urlNota: string = '';
  isProcessando: boolean = false;
  readonly USER_EMAIL_KEY = 'allmarket_user_email';
  readonly CHAVE_FOCUS = 'allmarket_nota_chave_focus';

  constructor(private injector: Injector) {
    try {
      this.apiService = this.injector.get(NotasApiService);
    } catch (e) {
      console.error(e);
    }
  }

  ngOnInit() {}

  private mostrarErro(msg: string) {
    this.snackBar.open(msg, 'Fechar', {
      duration: 3000,
      panelClass: ['snack-error']
    });
  }

  async enviarNota() {
    const urlLimpa = this.urlNota.trim();
    const email = localStorage.getItem(this.USER_EMAIL_KEY);

    if (!urlLimpa || this.isProcessando || !this.apiService || !email) return;

    this.isProcessando = true;
    this.cdr.detectChanges();
    
    try {
      const resposta = await this.apiService.processarNota(urlLimpa, email);
      const nota = resposta?.nota || resposta;
      
      this.urlNota = '';
      if (nota && nota.chave) {
        localStorage.setItem(this.CHAVE_FOCUS, nota.chave);
      }
      
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/notas']);
      });

    } catch (error: any) {
      const bruto = error.error;
      const errorData = bruto?.nota || bruto;
      
      this.urlNota = '';
      if (error.status === 409 && errorData?.chave) {
        localStorage.setItem(this.CHAVE_FOCUS, errorData.chave);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notas']);
        });
      } else {
        this.mostrarErro('Erro ao processar nota');
      }
    } finally {
      this.isProcessando = false;
      this.cdr.detectChanges();
    }
  }
}