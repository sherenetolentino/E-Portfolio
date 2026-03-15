import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Pipe({ name: 'safe', standalone: true })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [RouterModule, CommonModule, SafeUrlPipe],
  templateUrl: './resume.html',
  styleUrls: ['./resume.css'],
  encapsulation: ViewEncapsulation.None
})
export class Resume implements OnInit, OnDestroy {
  isScrolled      = false;
  currentYear     = new Date().getFullYear();
  isCertModalOpen = false;
  activeCertTitle = '';
  activeCertSrc   = '';

  private observer?: IntersectionObserver;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    setTimeout(() => this.initReveal(), 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    document.body.style.overflow = '';
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

  @HostListener('window:scroll', [])
  onWindowScroll() { this.isScrolled = window.scrollY > 50; }

  @HostListener('document:keydown.escape')
  onEscKey() { if (this.isCertModalOpen) this.closeCert(); }

  openCert(title: string, src: string): void {
    this.activeCertTitle = title;
    this.activeCertSrc   = src;
    this.isCertModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCert(): void {
    this.isCertModalOpen = false;
    this.activeCertTitle = '';
    this.activeCertSrc   = '';
    document.body.style.overflow = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('cert-modal-overlay')) {
      this.closeCert();
    }
  }
}