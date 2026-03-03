import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, limit } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class NotasRepository {
  private firestore = inject(Firestore);

  async checkUserNotesExistence(email: string): Promise<boolean> {
    const notasRef = collection(this.firestore, 'tb_notas');
    const q = query(
      notasRef,
      where('usuario_email', '==', email),
      where('chave', '!=', ''),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
}