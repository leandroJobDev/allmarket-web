import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Navbar } from '@allmarket-web/shared'; 

@Component({
  imports: [RouterModule,Navbar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'allmarket';
  showNavBottom = true;

  private router = inject(Router);

  constructor() {
    try {
      // initial state
      this.showNavBottom = !this.router.url.includes('/login');
    } catch {
      this.showNavBottom = true;
    }

    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url || '';
        this.showNavBottom = !url.includes('/login');
      }
    });
  }
}
