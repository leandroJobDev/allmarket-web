import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; // ADICIONE ESTA LINHA

@Component({
  selector: 'lib-nav-bottom',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule // ADICIONE AQUI TAMBÉM
  ],
  templateUrl: './nav-bottom.html',
  styleUrl: './nav-bottom.scss'
})
export class NavBottom {
  @Output() logout = new EventEmitter<void>();
}