import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { LoadingService } from './loading';

@Injectable({ providedIn: 'root' })
export class NotasApiService {
  private http = inject(HttpClient);
  private loadingService = inject(LoadingService);
  private apiUrl = environment.apiUrl;

  private temNotasSubject = new BehaviorSubject<boolean>(false);
  temNotas$ = this.temNotasSubject.asObservable();

  private async _internalGetHistorico(email: string): Promise<any[]> {
    try {
      const notas = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/historico?email=${email}`)
      );      

      const lista = Array.isArray(notas) ? notas.filter(n => {
        const temChave = n.chave && n.chave !== "";
        return temChave;
      }) : [];

      this.temNotasSubject.next(lista.length > 0);
      return lista;
    } catch (error) {
      return [];
    }
  }

  async getHistorico(email: string): Promise<any[]> {
    this.loadingService.show();
    try {
      return await this._internalGetHistorico(email);
    } finally {
      this.loadingService.hide();
    }
  }

  async excluirNota(chave: string, email: string): Promise<boolean> {
    this.loadingService.show();
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/historico/${chave}?email=${email}`)
      );
      await this.validarEAtualizarNotas(email);
      return true;
    } catch (error) {
      return false;
    } finally {
      this.loadingService.hide();
    }
  }

  async processarNota(url: string, email: string): Promise<any> {
    this.loadingService.show();
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
    } finally {
      this.loadingService.hide();
    }
  }

  async validarEAtualizarNotas(email: string): Promise<boolean> {
    const notas = await this._internalGetHistorico(email);
    const existe = notas.length > 0;
    this.temNotasSubject.next(existe);
    return existe;
  }

  async getListas(email: string): Promise<any[]> {
    this.loadingService.show();
    try {
      const res = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/listas?email=${email}`)
      );
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
      return [];
    } finally {
      this.loadingService.hide();
    }
  }

  async salvarLista(lista: any): Promise<any> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/listas`, lista)
      );
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  async deletarLista(id: string): Promise<boolean> {
    this.loadingService.show();
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/listas/${id}`)
      );
      return true;
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
      return false;
    } finally {
      this.loadingService.hide();
    }
  }

  async sincronizarListas(email: string, listas: any[]): Promise<void> {
    this.loadingService.show();
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/listas/sincronizar`, { email, listas })
      );
    } catch (error) {
      console.error('Erro ao sincronizar listas:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  async vincularEmail(emailDono: string, emailVinculado: string): Promise<void> {
    this.loadingService.show();
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/vinculos`, { email_dono: emailDono, email_vinculado: emailVinculado })
      );
    } catch (error) {
      console.error('Erro ao vincular e-mail:', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  async getVinculos(email: string): Promise<string[]> {
    this.loadingService.show();
    try {
      return await firstValueFrom(
        this.http.get<string[]>(`${this.apiUrl}/vinculos?email=${email}`)
      );
    } catch (error) {
      console.error('Erro ao buscar vínculos:', error);
      return [email];
    } finally {
      this.loadingService.hide();
    }
  }

  async desvincularEmail(emailA: string, emailB: string): Promise<void> {
    this.loadingService.show();
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/vinculos?email_a=${emailA}&email_b=${emailB}`)
      );
    } catch (error) {
      console.error('Erro ao desvincular e-mail:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  limparEstado() {
    this.temNotasSubject.next(false);
  }
}