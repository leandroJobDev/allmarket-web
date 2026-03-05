import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotasRepository } from '../repositories/notas.repository';

@Injectable({ providedIn: 'root' })
export class NotasService {
  private repo = inject(NotasRepository);
  
  private temNotasSubject = new BehaviorSubject<boolean>(false);
  temNotas$ = this.temNotasSubject.asObservable();

  async getHistorico(email: string): Promise<any[]> {
    try {
      const notas = await this.repo.getHistorico(email);
      const temNotas = notas && notas.length > 0;
      this.temNotasSubject.next(temNotas);
      return notas || [];
    } catch (error) {
      console.error('Erro ao buscar histórico no service:', error);
      return [];
    }
  }

  async excluirNota(chave: string, email: string): Promise<boolean> {
    try {
      const sucesso = await this.repo.deleteNota(chave, email);
      if (sucesso) {
        await this.validarEAtualizarNotas(email);
      }
      return sucesso;
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      return false;
    }
  }

  async validarEAtualizarNotas(email: string): Promise<boolean> {
    const notas = await this.getHistorico(email);
    const existe = notas.length > 0;
    this.temNotasSubject.next(existe);
    return existe;
  }

  limparEstado() {
    this.temNotasSubject.next(false);
  }
}