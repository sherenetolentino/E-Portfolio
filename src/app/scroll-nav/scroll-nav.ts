// scroll-nav.ts
// Place this file at: src/app/scroll-nav/scroll-nav.ts

import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-nav.html',
  styleUrls: ['./scroll-nav.css'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollNav {

  showUp   = false;  // show scroll-up   button
  showDown = true;   // show scroll-down button

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY      = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight    = document.documentElement.scrollHeight;

    // Show UP button after scrolling 300px
    this.showUp = scrollY > 300;

    // Hide DOWN button when within 150px of the bottom
    this.showDown = scrollY + windowHeight < docHeight - 150;
  }

  scrollUp(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollDown(): void {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  }
}