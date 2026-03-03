import { Component } from '@angular/core';
import { Home } from '../home/home';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    Home,
    MatCardModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
