import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { NavTop } from '../nav-top/nav-top';    
import { NavBottom } from '../nav-bottom/nav-bottom'; 
import { ProcessarNota } from '../processar-nota/processar-nota';

@Component({
  selector: 'lib-navbar',
  standalone: true,
  imports: [CommonModule, NavTop, NavBottom, ProcessarNota],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);

  @Input() userData: any;
  @Input() showNavBottom = true;
  @Output() logout = new EventEmitter<void>();

  exibirProcessarNota$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects),
    startWith(this.router.url),
    map(url => {
      const isMobile = window.innerWidth < 768;
      const isNotasRoute = url.startsWith('/notas');

      if (!isMobile) return true; 
      return isNotasRoute; 
    })
  );
}