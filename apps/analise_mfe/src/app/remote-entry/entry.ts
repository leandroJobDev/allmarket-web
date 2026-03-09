import { Component } from '@angular/core';
import { Home } from '../components/home/home';

@Component({
  imports: [Home],
  selector: 'app-analise_mfe-entry',
  template: `<app-home></app-home>`,
})
export class RemoteEntry {}
