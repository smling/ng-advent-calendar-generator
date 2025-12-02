import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { CalendarItemLayout } from '../../models/calendar-item-layout';
import { GeneratorFormat } from '../../models/generator-format';
import { GeneratorService } from '../../services/generator.service';
import { GeneratorCodeComponent } from '../generator-code/generator-code.component';
import { GeneratorPreviewComponent } from '../generator-preview/generator-preview.component';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule, GeneratorPreviewComponent, GeneratorCodeComponent],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent {
  constructor(private readonly generatorService: GeneratorService) {}

  protected readonly GeneratorFormat = GeneratorFormat;
  protected readonly CalendarItemLayout = CalendarItemLayout;
  protected readonly formatOptions = [
    { label: 'Random', value: GeneratorFormat.Random },
    { label: 'Sequential', value: GeneratorFormat.Sequential }
  ];
  protected readonly backgroundFormatOptions = [
    { label: 'Linear gradient', value: 'gradient' as const },
    { label: 'Solid color', value: 'solid' as const }
  ];
  protected readonly layoutOptions = [
    { label: 'Fixed', value: CalendarItemLayout.Fixed },
    { label: 'Random', value: CalendarItemLayout.Random }
  ];

  protected readonly fontFamilyOptions = [
    { label: 'Inter (default)', value: 'Inter, system-ui, -apple-system, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: '"Courier New", monospace' }
  ];

  protected activeTabIndex = signal(0);
  protected startNumber = signal(1);
  protected endNumber = signal(24);
  protected format = signal<GeneratorFormat>(GeneratorFormat.Random);
  protected calendarItemLayout = signal<CalendarItemLayout>(CalendarItemLayout.Fixed);
  protected backgroundFormat = signal<'gradient' | 'solid'>('gradient');
  protected startColor = signal('#22d3ee');
  protected endColor = signal('#6366f1');
  protected fontSize = signal(1.1); // rem
  protected fontFamily = signal(this.fontFamilyOptions[0].value);
  protected fontColor = signal('#e2e8f0');

  protected readonly validationSummary = computed(() => {
    const start = this.startNumber();
    const end = this.endNumber();

    return [
      start <= 0 ? 'Start number must be a positive integer.' : '',
      end <= 0 ? 'End number must be a positive integer.' : ''
    ].filter(Boolean);
  });
  protected readonly codeBlocks = computed(() => {
    return this.generatorService.buildCodeBlocks({
      start: this.startNumber(),
      end: this.endNumber(),
      format: this.format(),
      layout: this.calendarItemLayout(),
      backgroundFormat: this.backgroundFormat(),
      startColor: this.startColor(),
      endColor: this.endColor(),
      fontSize: this.fontSize(),
      fontFamily: this.fontFamily(),
      fontColor: this.fontColor()
    });
  });

  protected onStartChange(value: number | string): void {
    this.startNumber.set(this.toPositiveInteger(value, 1));
  }

  protected onEndChange(value: number | string): void {
    this.endNumber.set(this.toPositiveInteger(value, 24));
  }

  protected onFormatChange(value: GeneratorFormat | string): void {
    if (value === GeneratorFormat.Sequential || value === GeneratorFormat.Random) {
      this.format.set(value);
      return;
    }

    this.format.set(GeneratorFormat.Random);
  }

  protected onLayoutChange(value: CalendarItemLayout | string): void {
    if (value === CalendarItemLayout.Fixed || value === CalendarItemLayout.Random) {
      this.calendarItemLayout.set(value);
      return;
    }

    this.calendarItemLayout.set(CalendarItemLayout.Fixed);
  }

  protected onTabChange(index: number): void {
    this.activeTabIndex.set(index);
  }

  protected onBackgroundFormatChange(value: 'gradient' | 'solid' | string): void {
    if (value === 'gradient' || value === 'solid') {
      this.backgroundFormat.set(value);
      return;
    }

    this.backgroundFormat.set('gradient');
  }

  protected onStartColorChange(value: string): void {
    this.startColor.set(value || '#22d3ee');
  }

  protected onEndColorChange(value: string): void {
    this.endColor.set(value || '#6366f1');
  }

  protected onFontSizeChange(value: number | string): void {
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.fontSize.set(parsed);
      return;
    }
    this.fontSize.set(1.1);
  }

  private toPositiveInteger(value: number | string, fallback: number): number {
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);

    if (!Number.isNaN(parsed) && Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }

    return fallback;
  }
}
