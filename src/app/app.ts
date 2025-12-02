import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GeneratorComponent } from './components/generator/generator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GeneratorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-advent-calendar-generator');
}
