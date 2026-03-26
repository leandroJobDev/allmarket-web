import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-scanner-animation',
  templateUrl: './scanner-animation.component.html',
  styleUrls: ['./scanner-animation.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerAnimationComponent {}
