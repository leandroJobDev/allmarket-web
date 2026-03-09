import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotasApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private temNotasSubject = new BehaviorSubject<boolean>(false);
  temNotas$ = this.temNotasSubject.asObservable();

  async getHistorico(email: string): Promise<any[]> {
    console.log('[NotasApiService] Chamando getHistorico:', email);
    console.log('[NotasApiService] URL:', `${this.apiUrl}/historico?email=${email}`);
    
    try {
      const notas = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/historico?email=${email}`)
      );
      
      console.log('[NotasApiService] Resposta bruta:', notas);

      const lista = Array.isArray(notas) ? notas.filter(n => {
        const temChave = n.chave && n.chave !== "";
        if (!temChave) console.warn('[NotasApiService] Nota sem chave ignorada:', n);
        return temChave;
      }) : [];

      console.log('[NotasApiService] Lista final processada:', lista);
      this.temNotasSubject.next(lista.length > 0);
      return lista;
    } catch (error) {
      console.error('[NotasApiService] Erro na requisição:', error);
      return [];
    }
  }

  async excluirNota(chave: string, email: string): Promise<boolean> {
    console.log('[NotasApiService] Excluindo nota:', chave, 'do usuário:', email);
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/historico/${chave}?email=${email}`)
      );
      await this.validarEAtualizarNotas(email);
      return true;
    } catch (error) {
      console.error('[NotasApiService] Erro ao excluir:', error);
      return false;
    }
  }

  async processarNota(url: string, email: string): Promise<any> {
    try {
      const payload = { url, email };
      const resultado = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/processar`, payload)
      );
      await this.validarEAtualizarNotas(email);
      return resultado;
    } catch (error) {
      console.error('Erro ao processar nota:', error);
      throw error;
    }
  }

  async validarEAtualizarNotas(email: string): Promise<boolean> {
    console.log('[NotasApiService] Validando estado para:', email);
    const notas = await this.getHistorico(email);
    const existe = notas.length > 0;
    this.temNotasSubject.next(existe);
    return existe;
  }

  limparEstado() {
    this.temNotasSubject.next(false);
  }
}