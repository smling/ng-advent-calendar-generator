import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { CalendarItemLayout } from '../models/calendar-item-layout';
import { GeneratorFormat } from '../models/generator-format';
import { GeneratorService } from './generator.service';

describe('GeneratorService', () => {
  let service: GeneratorService;

  beforeEach(() => {
    service = new GeneratorService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds sequential fixed code blocks with deterministic days and sizes', () => {
    const result = service.buildCodeBlocks({
      start: 1,
      end: 3,
      format: GeneratorFormat.Sequential,
      layout: CalendarItemLayout.Fixed,
      backgroundFormat: 'gradient',
      startColor: '#22d3ee',
      endColor: '#6366f1',
      fontSize: 1.1,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontColor: '#e2e8f0'
    });

    expect(result.previewDays).toEqual([1, 2, 3]);
    expect(result.previewSizes).toEqual(['size-1x1', 'size-1x1', 'size-1x1']);
    expect(result.html).toContain('id="calendar"');
    expect(result.javascript).toContain("format: 'sequential'");
    expect(result.css).toContain('.calendar__day.size-2x2');
  });

  it('respects random layout choices using deterministic Math.random stubs', () => {
    // Ensure predictable sizes and shuffle (though shuffle not used when format is sequential)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.8);

    const result = service.buildCodeBlocks({
      start: 5,
      end: 7,
      format: GeneratorFormat.Sequential,
      layout: CalendarItemLayout.Random,
      backgroundFormat: 'solid',
      startColor: '#111111',
      endColor: '#222222',
      fontSize: 1.5,
      fontFamily: 'Georgia, serif',
      fontColor: '#ffffff'
    });

    expect(result.previewSizes).toEqual(['size-1x1', 'size-1x2', 'size-2x2']);
    expect(result.javascript).toContain("layout: 'random'");
    expect(result.javascript).toContain("backgroundFormat: 'solid'");
    expect(result.javascript).toContain("startColor: '#111111'");
  });

  it('returns empty days and sizes when range is invalid', () => {
    const result = service.buildCodeBlocks({
      start: 10,
      end: 5,
      format: GeneratorFormat.Random,
      layout: CalendarItemLayout.Random,
      backgroundFormat: 'gradient',
      startColor: '#000000',
      endColor: '#ffffff',
      fontSize: 1,
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontColor: '#000000'
    });

    expect(result.previewDays).toEqual([]);
    expect(result.previewSizes).toEqual([]);
    expect(result.javascript).toContain('Math.max(0, end - start + 1)');
  });
});
