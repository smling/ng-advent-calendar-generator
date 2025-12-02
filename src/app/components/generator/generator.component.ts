import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { CalendarItemLayout } from '../../models/calendar-item-layout';
import { GeneratorFormat } from '../../models/generator-format';
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
    const start = this.startNumber();
    const end = this.endNumber();
    const format = this.format() === GeneratorFormat.Sequential ? 'sequential' : 'random';
    const layout =
      this.calendarItemLayout() === CalendarItemLayout.Random ? 'random' : 'fixed';
    const backgroundFormat = this.backgroundFormat();
    const startColor = this.startColor();
    const endColor = this.endColor();
    const fontSize = this.fontSize();
    const fontFamily = this.fontFamily();
    const fontColor = this.fontColor();

    const range = Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
    const previewDays = format === 'random' ? this.shuffle(range) : range;
    const previewSizes =
      layout === 'random'
        ? this.randomSizes(previewDays.length)
        : Array.from({ length: previewDays.length }).fill('size-1x1');

    const html = `<div id="calendar" class="calendar"></div>`;

    const javascript = [
      'const config = {',
      `  start: ${start},`,
      `  end: ${end},`,
      `  format: '${format}',`,
      `  layout: '${layout}',`,
      `  days: ${JSON.stringify(previewDays)},`,
      `  sizes: ${JSON.stringify(previewSizes)},`,
      `  backgroundFormat: '${backgroundFormat}',`,
      `  startColor: '${startColor}',`,
      `  endColor: '${endColor}',`,
      `  fontSize: ${fontSize},`,
      `  fontFamily: '${fontFamily.replace(/'/g, "\\'")}',`,
      `  fontColor: '${fontColor}'`,
      `};`,
      '',
      'function buildDays({ start, end, format }) {',
      '  if (format === "random") {',
      '    return config.days;',
      '  }',
      '  return Array.from({ length: Math.max(0, end - start + 1) },',
      '    (_, index) => start + index);',
      '}',
      '',
      'function onDayClicked(dayElement, dayValue) {',
      '  console.log("Day clicked:", dayValue, dayElement);',
      '  dayElement.classList.add("is-active");',
      '  setTimeout(() => dayElement.classList.remove("is-active"), 300);',
      '}',
      '',
      'function renderCalendar(target, days, sizes) {',
      '  const container = document.querySelector(target);',
      '  container.style.setProperty("--calendar-start", config.startColor);',
      '  container.style.setProperty(',
      '    "--calendar-end",',
      '    config.backgroundFormat === "solid" ? config.startColor : config.endColor',
      '  );',
      '  container.style.setProperty("--calendar-font-size", `${config.fontSize}rem`);',
      '  container.style.setProperty("--calendar-font-family", config.fontFamily);',
      '  container.style.setProperty("--calendar-font-color", config.fontColor);',
      '  container.innerHTML = days',
      "    .map((day, index) => `<div class=\"calendar__day ${sizes[index] || 'size-1x1'}\">${day}</div>`)",
      '    .join("");',
      '  container.querySelectorAll(".calendar__day").forEach((el, index) => {',
      '    el.addEventListener("click", () => onDayClicked(el, days[index]));',
      '  });',
      '}',
      '',
      'const days = buildDays(config);',
      'const sizes = config.layout === "random" ? config.sizes : config.sizes.map(() => "size-1x1");',
      "renderCalendar('#calendar', days, sizes);",
      '',
      `// Preview: ${JSON.stringify(previewDays)}`
    ].join('\n');

    const css = [
      'html, body {',
      '  margin: 0;',
      '  padding: 0;',
      '  background: #0f172a;',
      '}',
      '',
      '.calendar {',
      '  display: grid;',
      '  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));',
      '  grid-auto-rows: 120px;',
      '  gap: 12px;',
      '  padding: 12px;',
      '  background: #0f172a;',
      '  border-radius: 12px;',
      '  color: #e2e8f0;',
      '  grid-auto-flow: dense;',
      '  height: 100%;',
      '  min-height: 480px;',
      '  align-content: start;',
      '}',
      '',
      '.calendar__day {',
      '  display: grid;',
      '  place-items: center;',
      '  border-radius: 10px;',
      '  background: linear-gradient(135deg, var(--calendar-start, #22d3ee), var(--calendar-end, #6366f1));',
      '  font-weight: 700;',
      '  font-size: var(--calendar-font-size, 1.1rem);',
      '  font-family: var(--calendar-font-family, Inter, system-ui, -apple-system, sans-serif);',
      '  color: var(--calendar-font-color, #e2e8f0);',
      '  border: 1px solid rgba(255, 255, 255, 0.08);',
      '}',
      '',
      '.calendar__day.is-active {',
      '  outline: 2px solid #22d3ee;',
      '  outline-offset: 2px;',
      '}',
      '',
      '.calendar__day.size-1x1 {',
      '  grid-row: span 1;',
      '  grid-column: span 1;',
      '}',
      '',
      '.calendar__day.size-1x2 {',
      '  grid-row: span 1;',
      '  grid-column: span 2;',
      '}',
      '',
      '.calendar__day.size-2x1 {',
      '  grid-row: span 2;',
      '  grid-column: span 1;',
      '}',
      '',
      '.calendar__day.size-2x2 {',
      '  grid-row: span 2;',
      '  grid-column: span 2;',
      '}'
    ].join('\n');

    return { html, javascript, css };
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

  private shuffle(values: number[]): number[] {
    const copy = [...values];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
  }

  private randomSizes(count: number): string[] {
    const choices = ['size-1x1', 'size-1x2', 'size-2x1', 'size-2x2'];
    return Array.from({ length: count }, () => choices[Math.floor(Math.random() * choices.length)]);
  }
}
