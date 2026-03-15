import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  encapsulation: ViewEncapsulation.None
})
export class About implements OnInit, OnDestroy {
  isScrolled  = false;
  currentYear = new Date().getFullYear();
  private observer?: IntersectionObserver;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    setTimeout(() => this.initReveal(), 100);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

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

  @HostListener('window:scroll', [])
  onWindowScroll() { this.isScrolled = window.scrollY > 50; }
}