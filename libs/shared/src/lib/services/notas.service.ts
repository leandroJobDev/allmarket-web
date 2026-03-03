import { inject, Injectable } from '@angular/core'; // Faltava isso
import { BehaviorSubject } from 'rxjs';           // Faltava isso
import { NotasRepository } from '../repositories/notas.repository'; // Ajuste o caminho se necessário

@Injectable({ providedIn: 'root' })
export class NotasService {
  private repo = inject(NotasRepository);
  
  private temNotasSubject = new BehaviorSubject<boolean>(false);
  temNotas$ = this.temNotasSubject.asObservable();

  async validarEAtualizarNotas(email: string): Promise<boolean> {
    const existe = await this.repo.checkUserNotesExistence(email);
    this.temNotasSubject.next(existe);
    return existe;
  }

  limparEstado() {
    this.temNotasSubject.next(false);
  }
}