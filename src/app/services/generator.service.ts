import { Injectable } from '@angular/core';

import { CalendarItemLayout } from '../models/calendar-item-layout';
import { GeneratorFormat } from '../models/generator-format';

export interface GeneratorConfig {
  start: number;
  end: number;
  format: GeneratorFormat;
  layout: CalendarItemLayout;
  backgroundFormat: 'gradient' | 'solid';
  startColor: string;
  endColor: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
}

export interface GeneratorCodeBlocks {
  html: string;
  javascript: string;
  css: string;
  previewDays: number[];
  previewSizes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class GeneratorService {
  public buildCodeBlocks(config: GeneratorConfig): GeneratorCodeBlocks {
    const format = config.format === GeneratorFormat.Sequential ? 'sequential' : 'random';
    const layout = config.layout === CalendarItemLayout.Random ? 'random' : 'fixed';

    const range = Array.from(
      { length: Math.max(0, config.end - config.start + 1) },
      (_, index) => config.start + index,
    );
    const previewDays = format === 'random' ? this.shuffle(range) : range;
    const previewSizes =
      layout === 'random'
        ? this.randomSizes(previewDays.length)
        : Array.from({ length: previewDays.length }, () => 'size-1x1');

    const html = `<div id="calendar" class="calendar"></div>`;

    const javascript = [
      'const config = {',
      `  start: ${config.start},`,
      `  end: ${config.end},`,
      `  format: '${format}',`,
      `  layout: '${layout}',`,
      `  days: ${JSON.stringify(previewDays)},`,
      `  sizes: ${JSON.stringify(previewSizes)},`,
      `  backgroundFormat: '${config.backgroundFormat}',`,
      `  startColor: '${config.startColor}',`,
      `  endColor: '${config.endColor}',`,
      `  fontSize: ${config.fontSize},`,
      `  fontFamily: '${config.fontFamily.replace(/'/g, "\\'")}',`,
      `  fontColor: '${config.fontColor}'`,
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
      '    .map((day, index) => `<div class="calendar__day ${sizes[index] || \'size-1x1\'}">${day}</div>`)',
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
      `// Preview: ${JSON.stringify(previewDays)}`,
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
      '}',
    ].join('\n');

    return { html, javascript, css, previewDays, previewSizes };
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
