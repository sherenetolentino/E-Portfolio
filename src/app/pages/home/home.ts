import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  encapsulation: ViewEncapsulation.None
})
export class Home implements OnInit, OnDestroy {
  isScrolled    = false;
  lightboxOpen  = false;
  lightboxImage = '';
  lightboxAlt   = '';

  private observer?: IntersectionObserver;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    // Small delay lets Angular finish rendering the DOM
    setTimeout(() => this.initReveal(), 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initReveal(): void {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          this.observer!.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      .forEach(el => this.observer!.observe(el));
  }

  @HostListener('window:scroll')
  onWindowScroll() { this.isScrolled = window.scrollY > 50; }

  @HostListener('document:keydown.escape')
  onEscape() { if (this.lightboxOpen) this.closeLightbox(); }

  openLightbox(src: string, alt: string) {
    this.lightboxImage = src; this.lightboxAlt = alt;
    this.lightboxOpen  = true; document.body.style.overflow = 'hidden';
  }
  closeLightbox() {
    this.lightboxOpen  = false; this.lightboxImage = ''; this.lightboxAlt = '';
    document.body.style.overflow = '';
  }
}