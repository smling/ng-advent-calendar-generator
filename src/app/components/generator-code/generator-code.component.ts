import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generator-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generator-code.component.html',
  styleUrl: './generator-code.component.css',
})
export class GeneratorCodeComponent {
  @Input({ required: true }) html = '';
  @Input({ required: true }) javascript = '';
  @Input({ required: true }) css = '';
  @Input() clickHint = 'onDayClicked(dayElement, dayValue) fires when a day is clicked.';
}
