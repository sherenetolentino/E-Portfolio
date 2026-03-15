import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
  encapsulation: ViewEncapsulation.None
})
export class Projects implements OnInit, OnDestroy {
  isScrolled = false;
  private observer?: IntersectionObserver;

  constructor(public router: Router, public themeService: ThemeService) {}

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