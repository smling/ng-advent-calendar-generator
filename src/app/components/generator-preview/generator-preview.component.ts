import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CalendarItemLayout } from '../../models/calendar-item-layout';
import { GeneratorFormat } from '../../models/generator-format';

@Component({
  selector: 'app-generator-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generator-preview.component.html',
  styleUrl: './generator-preview.component.css',
})
export class GeneratorPreviewComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) start = 1;
  @Input({ required: true }) end = 24;
  @Input({ required: true }) format: GeneratorFormat = GeneratorFormat.Random;
  @Input({ required: true }) calendarItemLayout: CalendarItemLayout = CalendarItemLayout.Fixed;
  @Input() validationSummary: string[] = [];
  @Input() html = '';
  @Input() javascript = '';
  @Input() css = '';
  @Input() showSummary = false;
  @ViewChild('frameContainer', { static: true }) frameContainer?: ElementRef<HTMLDivElement>;

  protected iframeWidth = signal<number | null>(null);

  protected readonly GeneratorFormat = GeneratorFormat;
  protected readonly CalendarItemLayout = CalendarItemLayout;
  protected get sanitizedSrcdoc(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.previewDoc);
  }

  private resizeObserver?: ResizeObserver;
  private lastWidth: number | null = null;
  private resizeListener?: () => void;

  constructor(private readonly sanitizer: DomSanitizer) {}

  public ngAfterViewInit(): void {
    const container = this.frameContainer?.nativeElement;
    if (!container) {
      return;
    }
  }

  public ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  protected get previewDoc(): string {
    return [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<style>',
      this.css,
      '</style>',
      '</head>',
      '<body>',
      this.html,
      '<script>',
      this.javascript,
      '</script>',
      '</body>',
      '</html>',
    ].join('\n');
  }
}
