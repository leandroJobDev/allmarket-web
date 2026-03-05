import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, limit, doc, deleteDoc, orderBy } from '@angular/fire/firestore';

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

  async getHistorico(email: string): Promise<any[]> {
    const notasRef = collection(this.firestore, 'tb_notas');
    const q = query(
      notasRef,
      where('usuario_email', '==', email),
      orderBy('data_emissao', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteNota(chave: string, email: string): Promise<boolean> {
    const notasRef = collection(this.firestore, 'tb_notas');
    const q = query(
      notasRef, 
      where('chave', '==', chave),
      where('usuario_email', '==', email)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return false;

    const deletePromises = querySnapshot.docs.map(documento => 
      deleteDoc(doc(this.firestore, 'tb_notas', documento.id))
    );

    await Promise.all(deletePromises);
    return true;
  }
}