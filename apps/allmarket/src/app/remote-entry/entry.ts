import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-allmarket-entry',
  template: `
    <!-- root component must expose a router outlet for routed components -->
    <router-outlet></router-outlet>
  `,
})
export class RemoteEntry {}