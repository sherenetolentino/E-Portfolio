import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDarkMode = false;

  constructor() {
    // Restores last saved preference when page loads
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');       // ← THIS is what the CSS reads
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');    // ← THIS removes it
      localStorage.setItem('theme', 'light');
    }
  }
}