import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavTop } from '../nav-top/nav-top';    
import { NavBottom } from '../nav-bottom/nav-bottom'; 

@Component({
  selector: 'lib-navbar',
  imports: [CommonModule, NavTop, NavBottom],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() userData: any;
  @Output() logout = new EventEmitter<void>();
}
