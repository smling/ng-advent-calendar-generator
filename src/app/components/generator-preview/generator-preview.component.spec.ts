import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';

import { CalendarItemLayout } from '../../models/calendar-item-layout';
import { GeneratorFormat } from '../../models/generator-format';
import { GeneratorPreviewComponent } from './generator-preview.component';

describe('GeneratorPreviewComponent', () => {
  it('builds a preview document containing HTML, CSS, and JS', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GeneratorPreviewComponent]
    }).createComponent(GeneratorPreviewComponent);

    const component = fixture.componentInstance as any;
    component.start = 1;
    component.end = 3;
    component.format = GeneratorFormat.Random;
    component.calendarItemLayout = CalendarItemLayout.Fixed;
    component.html = '<div id="calendar"></div>';
    component.css = 'body { background: #0f172a; }';
    component.javascript = 'console.log("render");';

    const doc = component.previewDoc as string;
    expect(doc).toContain('<style>');
    expect(doc).toContain(component.html);
    expect(doc).toContain(component.css);
    expect(doc).toContain(component.javascript);

    const sanitized = component.sanitizedSrcdoc;
    expect(sanitized).toBeTruthy();
  });
});
