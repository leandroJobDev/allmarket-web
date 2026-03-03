import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-nav-bottom',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './nav-bottom.html',
  styleUrl: './nav-bottom.scss'
})
export class NavBottom {
  @Output() logout = new EventEmitter<void>();
}
