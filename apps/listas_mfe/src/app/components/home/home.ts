import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

interface ItemLista {
  nome: string;
  comprado: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatCheckboxModule, 
    MatButtonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  itens: ItemLista[] = [];
  storageKey = 'allmarket_lista_compras';

  ngOnInit() {
    const salvo = localStorage.getItem(this.storageKey);
    if (salvo) {
      this.itens = JSON.parse(salvo);
    }
  }

  adicionarItem(input: HTMLInputElement) {
    const valor = input.value.trim().toUpperCase();
    if (valor) {
      this.itens.unshift({ nome: valor, comprado: false });
      input.value = '';
      this.salvarNoStorage();
    }
  }

  removerItem(index: number) {
    this.itens.splice(index, 1);
    this.salvarNoStorage();
  }

  salvarNoStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.itens));
  }
}