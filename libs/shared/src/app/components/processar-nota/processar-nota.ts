import { Component, OnInit, Injector, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotasApiService } from '../../services/notas-api.service';
import { LoadingService } from '../../services/loading';

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
    MatSnackBarModule
  ],
  templateUrl: './processar-nota.html',
  styleUrl: './processar-nota.scss',
})
export class ProcessarNota implements OnInit {
  private apiService = inject(NotasApiService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public loadingService = inject(LoadingService);
  
  urlNota: string = '';
  readonly USER_EMAIL_KEY = 'allmarket_user_email';
  readonly CHAVE_FOCUS = 'allmarket_nota_chave_focus';

  constructor() {}

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

    if (!urlLimpa || !this.apiService || !email) return;
    
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
    }
  }
}