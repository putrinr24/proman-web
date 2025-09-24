import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'fc-svg-loader',
  templateUrl: './fc-svg-loader.component.html',
  styleUrls: ['./fc-svg-loader.component.css'],
  standalone: false,
})
export class FcSvgLoaderComponent {
  @Input() path = '';
  @Input() className = '';
  svgIcon: SafeHtml | null = null;

  private static svgCache: Map<string, SafeHtml> = new Map();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (!this.path) {
      this.svgIcon = null;
      return;
    }

    // Check if the SVG is already cached
    if (FcSvgLoaderComponent.svgCache.has(this.path)) {
      this.svgIcon = FcSvgLoaderComponent.svgCache.get(this.path) || null;
    } else {
      // Fetch and cache the SVG if not already loaded
      this.http.get(this.path, { responseType: 'text' }).subscribe((value) => {
        const sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(value);
        FcSvgLoaderComponent.svgCache.set(this.path, sanitizedSvg);
        this.svgIcon = sanitizedSvg;
      });
    }
  }
}
