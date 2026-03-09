import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavTop } from '../nav-top/nav-top';    
import { NavBottom } from '../nav-bottom/nav-bottom'; 
import { ProcessarNota } from '../processar-nota/processar-nota';

@Component({
  selector: 'lib-navbar',
  standalone: true,
  imports: [CommonModule, NavTop, NavBottom,ProcessarNota],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() userData: any;
  @Input() showNavBottom = true;
  @Output() logout = new EventEmitter<void>();
}
