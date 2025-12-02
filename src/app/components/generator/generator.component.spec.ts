import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CalendarItemLayout } from '../../models/calendar-item-layout';
import { GeneratorFormat } from '../../models/generator-format';
import { GeneratorService } from '../../services/generator.service';
import { GeneratorComponent } from './generator.component';

describe('GeneratorComponent', () => {
  let buildCodeBlocks = vi.fn();

  beforeEach(async () => {
    buildCodeBlocks = vi.fn().mockReturnValue({
      html: '<div id="calendar"></div>',
      javascript: 'const config = {};',
      css: 'body { background: #000; }',
      previewDays: [1, 2, 3],
      previewSizes: ['size-1x1', 'size-1x1', 'size-1x1'],
    });

    await TestBed.configureTestingModule({
      imports: [GeneratorComponent],
      providers: [{ provide: GeneratorService, useValue: { buildCodeBlocks } }],
    }).compileComponents();
  });

  it('delegates code generation to GeneratorService with current signal values', () => {
    const fixture = TestBed.createComponent(GeneratorComponent);
    const component = fixture.componentInstance as any;

    component.startNumber.set(2);
    component.endNumber.set(5);
    component.format.set(GeneratorFormat.Sequential);
    component.calendarItemLayout.set(CalendarItemLayout.Random);
    component.backgroundFormat.set('solid');
    component.startColor.set('#123456');
    component.endColor.set('#654321');
    component.fontSize.set(1.25);
    component.fontFamily.set('Georgia, serif');
    component.fontColor.set('#abcdef');

    // Trigger computed evaluation
    component.codeBlocks();

    expect(buildCodeBlocks).toHaveBeenCalledWith({
      start: 2,
      end: 5,
      format: GeneratorFormat.Sequential,
      layout: CalendarItemLayout.Random,
      backgroundFormat: 'solid',
      startColor: '#123456',
      endColor: '#654321',
      fontSize: 1.25,
      fontFamily: 'Georgia, serif',
      fontColor: '#abcdef',
    });
  });

  it('exposes service output to the template bindings', () => {
    const fixture = TestBed.createComponent(GeneratorComponent);
    const component = fixture.componentInstance as any;

    fixture.detectChanges();

    const codeBlocks = component.codeBlocks();
    expect(codeBlocks.html).toContain('calendar');
    expect(codeBlocks.javascript).toContain('config');
    expect(codeBlocks.css).toContain('background');
  });
});
