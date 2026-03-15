import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  encapsulation: ViewEncapsulation.None
})
export class Contact implements OnInit, OnDestroy {

  isScrolled    = false;
  currentYear   = new Date().getFullYear();

  contactForm!: FormGroup;
  formSubmitted = false;
  isSending     = false;
  sendSuccess   = false;
  sendError     = false;

  /*
    CHANGE IF NEEDED: Your EmailJS credentials.
    These are from your original contact.ts — unchanged.
  */
  private SERVICE_ID  = 'service_6iyb12z';
  private TEMPLATE_ID = 'template_y45bo4c';
  private PUBLIC_KEY  = 'D8msF66txiCIUbVJx';

  private observer!: IntersectionObserver;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    /* Initialize EmailJS with your public key */
    emailjs.init(this.PUBLIC_KEY);

    /* Build the reactive form */
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      message:  ['', Validators.required]
    });

    /* Scroll reveal — same aggressive fix as home.ts */
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
  }

  /* ── Scroll reveal ── */
  private initScrollReveal(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20px 0px' }
    );

    this.revealAll();
    setTimeout(() => this.revealAll(), 50);
    setTimeout(() => this.revealAll(), 300);
    setTimeout(() => this.revealAll(), 800);
  }

  private revealAll(): void {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      .forEach(el => {
        this.observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  /* ── Form submit — EmailJS unchanged from your original ── */
  onSubmit() {
    this.formSubmitted = true;
    this.sendSuccess   = false;
    this.sendError     = false;

    if (this.contactForm.invalid) return;

    this.isSending = true;

    const { fullName, email, message } = this.contactForm.value;

    /*
      CHANGE IF NEEDED: These keys must match your EmailJS template
      variables. Your template uses {{fullName}}, {{email}}, {{message}}.
    */
    const templateParams = {
      fullName,
      email,
      message
    };

    emailjs
      .send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams)
      .then(() => {
        this.isSending    = false;
        this.sendSuccess  = true;
        this.contactForm.reset();
        this.formSubmitted = false;
        /* Hide success message after 5 seconds */
        setTimeout(() => (this.sendSuccess = false), 5000);
      })
      .catch((error: unknown) => {
        console.error('EmailJS error:', error);
        this.isSending   = false;
        this.sendError   = true;
        /* Hide error message after 5 seconds */
        setTimeout(() => (this.sendError = false), 5000);
      });
  }
}