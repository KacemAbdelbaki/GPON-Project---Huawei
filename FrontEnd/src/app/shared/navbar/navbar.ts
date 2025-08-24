import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../Services/User/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar implements OnInit {
  @ViewChild('sidenavTrigger') sidenavTrigger!: ElementRef<HTMLElement>;
  
  isLoggedIn: boolean = false;

  constructor(public readonly userService: UserService) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (!authState.isLoading) {
        this.isLoggedIn = authState.isLoggedIn;
        console.log('Auth state updated:', authState);
      }
    });
  }
}
