import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements AfterViewInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: ElementRef<HTMLElement>;
  @ViewChild('sidenavTrigger') sidenavTrigger!: ElementRef<HTMLElement>;
  @ViewChild('sidenavClose') sidenavClose!: ElementRef<HTMLElement>;

  private page: string = 'dashboard';
  private clickListener!: (e: MouseEvent) => void;

  constructor() { }

  ngAfterViewInit(): void {
    this.setupSidenavToggle();
    this.setupOutsideClickListener();
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.clickListener);
  }

  private setupSidenavToggle(): void {
    if (!this.sidenav || !this.sidenavClose) {
      console.error('Sidenav elements not found');
      return;
    }

    const sidenav = this.sidenav.nativeElement;
    const sidenavClose = this.sidenavClose.nativeElement;
    
    let sidenavTriggerElement = this.sidenavTrigger?.nativeElement || 
      document.querySelector('[sidenav-trigger]') || 
      document.querySelector('[#sidenavTrigger]');
      
    if (!sidenavTriggerElement) {
      console.warn('Sidenav trigger not found, looking for any potential trigger');
      const potentialTrigger = document.querySelector('.navbar-main .xl\\:hidden a') || 
                              document.querySelector('a.block.p-0.text-sm.text-white');
      if (potentialTrigger instanceof HTMLElement) {
        sidenavTriggerElement = potentialTrigger;
      }
    }
    
    if (!sidenavTriggerElement) {
      console.error('Could not find sidenav trigger');
      return;
    }
    
    const sidenavTrigger = sidenavTriggerElement;
    
    if (!sidenavTrigger) {
      console.error('Could not find sidenav trigger');
      return;
    }
    
    const burger = sidenavTrigger.firstElementChild as HTMLElement;
    const topBread = burger?.firstElementChild as HTMLElement;
    const bottomBread = burger?.lastElementChild as HTMLElement;

    sidenavTrigger.addEventListener('click', () => {
      if (this.page === 'virtual-reality') {
        sidenav.classList.toggle('xl:left-[18%]');
      }

      const isExpanded = sidenav.getAttribute('aria-expanded') === 'true';
      sidenav.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');

      sidenav.classList.toggle('translate-x-0');
      sidenav.classList.toggle('ml-6');
      sidenav.classList.toggle('shadow-xl');

      if (this.page === 'rtl') {
        topBread?.classList.toggle('-translate-x-[5px]');
        bottomBread?.classList.toggle('-translate-x-[5px]');
      } else {
        topBread?.classList.toggle('translate-x-[5px]');
        bottomBread?.classList.toggle('translate-x-[5px]');
      }
    });

    sidenavClose.addEventListener('click', () => {
      sidenavTrigger.click();
    });
  }

  private setupOutsideClickListener(): void {
    this.clickListener = (e: MouseEvent) => {
      if (!this.sidenav) return;
      
      const sidenav = this.sidenav.nativeElement;
      const target = e.target as HTMLElement;

      const sidenavTriggerElement = document.querySelector('[sidenav-trigger]') || 
        document.querySelector('[#sidenavTrigger]') ||
        document.querySelector('.navbar-main .xl\\:hidden a') ||
        document.querySelector('a.block.p-0.text-sm.text-white');

      if (sidenav.contains(target) || sidenavTriggerElement?.contains(target)) {
        return;
      }
      
      if (sidenav.getAttribute('aria-expanded') === 'true') {
        if (sidenavTriggerElement && sidenavTriggerElement instanceof HTMLElement) {
          sidenavTriggerElement.click();
        } else {
          sidenav.setAttribute('aria-expanded', 'false');
          sidenav.classList.remove('translate-x-0', 'ml-6', 'shadow-xl');
        }
      }
    };

    window.addEventListener('click', this.clickListener);
  }
}